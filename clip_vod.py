"""Turn a Twitch VOD (or a local recording) into candidate vertical Shorts.

    python clip_vod.py https://www.twitch.tv/videos/123456789
    python clip_vod.py recording.mp4
    python clip_vod.py --captures "C:/Users/me/Videos/Captures"

Finds highlights from loudness spikes in the mic/game audio, German reaction words
(faster-whisper transcript) and Twitch chat spikes, then renders 1080x1920 clips with
word-by-word captions and writes CANDIDATES.md. Never uploads anything.
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from datetime import date
from pathlib import Path

import numpy as np

HOP = 0.5  # seconds per analysis step
REACTION_WORDS = {  # German reactions -> weight
    "alter": 3, "digga": 3, "diggah": 3, "krass": 3, "nein": 2, "was": 1, "wie": 1, "warum": 1.5,
    "junge": 2, "bruder": 2, "bro": 2, "oh": 1.5, "gott": 2, "omg": 3, "scheiße": 2.5, "scheisse": 2.5,
    "fuck": 2.5, "wtf": 3, "hilfe": 2, "lauf": 1.5, "schnell": 1, "geil": 2.5, "wow": 2.5, "haha": 2.5,
    "hahaha": 3, "lol": 2, "unmöglich": 2.5, "verrückt": 2.5, "tipp": 2, "trick": 2, "geheim": 2,
}
CHAT_WORDS = ("kekw", "lul", "omegalul", "pog", "poggers", "w", "omg", "lol", "krass", "wtf", "😂", "💀")
DEFAULT_FONT = "Arial Black" if os.name == "nt" else "Inter Display Black"


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, **kw)


def ffprobe_duration(path):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)])
    return float(out)


# ---------------------------------------------------------------- download
def download(url, workdir: Path):
    vod = workdir / "vod.mp4"
    if not vod.exists():
        run([sys.executable, "-m", "yt_dlp", "-f", "best[height<=1080]/best", "-o", str(vod),
             "--write-subs", "--sub-langs", "rechat", "--no-part", url])
    chat = next(iter(workdir.glob("vod*.json")), None)
    return vod, chat


# ---------------------------------------------------------------- signals
def zscore_local(x, win_steps):
    """z-score against a rolling median/MAD so slow volume changes don't count."""
    out = np.zeros_like(x)
    half = win_steps // 2
    for i in range(len(x)):
        seg = x[max(0, i - half): i + half + 1]
        med = np.median(seg)
        mad = np.median(np.abs(seg - med)) + 1e-6
        out[i] = (x[i] - med) / (1.4826 * mad)
    return out


def loudness_signal(video, workdir: Path):
    wav = workdir / "audio16k.wav"
    if not wav.exists():
        run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(video), "-vn", "-ac", "1", "-ar", "16000", "-map_metadata", "-1", "-bitexact", "-c:a", "pcm_s16le", str(wav)])
    raw = np.memmap(wav, dtype="<i2", mode="r", offset=44).astype(np.float32) / 32768
    step = int(16000 * HOP)
    n = len(raw) // step
    rms = np.sqrt(np.mean(raw[: n * step].reshape(n, step) ** 2, axis=1) + 1e-9)
    db = 20 * np.log10(rms)
    return np.clip(zscore_local(db, int(60 / HOP)), 0, 8), wav


def transcribe(wav: Path, workdir: Path, model_size: str, device: str):
    cache = workdir / f"transcript_{model_size}.json"
    if cache.exists():
        return json.loads(cache.read_text(encoding="utf-8"))
    from faster_whisper import WhisperModel
    if device == "auto":
        try:
            import ctranslate2
            device = "cuda" if ctranslate2.get_cuda_device_count() > 0 else "cpu"
        except Exception:
            device = "cpu"
    model = WhisperModel(model_size, device=device, compute_type="float16" if device == "cuda" else "int8")
    segs, _ = model.transcribe(str(wav), language="de", word_timestamps=True, vad_filter=True)
    words = []
    for s in segs:
        for w in s.words or []:
            words.append({"t": round(w.start, 2), "e": round(w.end, 2), "w": w.word.strip()})
        print(f"  transcribed {s.end / 60:.1f} min", end="\r", flush=True)
    cache.write_text(json.dumps(words, ensure_ascii=False), encoding="utf-8")
    return words


def word_signal(words, n):
    sig = np.zeros(n)
    for w in words:
        key = re.sub(r"[^\wäöüß]", "", w["w"].lower())
        wt = REACTION_WORDS.get(key, 0)
        if wt:
            sig[min(n - 1, int(w["t"] / HOP))] += wt
    return np.convolve(sig, np.ones(int(4 / HOP)), mode="same")


def chat_signal(chat_path, n):
    if not chat_path:
        return np.zeros(n)
    try:
        data = json.loads(Path(chat_path).read_text(encoding="utf-8"))
    except Exception:
        return np.zeros(n)
    msgs = data if isinstance(data, list) else data.get("comments", [])
    rate = np.zeros(n)
    for m in msgs:
        t = m.get("content_offset_seconds") or m.get("contentOffsetSeconds")
        if t is None:
            continue
        body = json.dumps(m.get("message", m), ensure_ascii=False).lower()
        bonus = 1 + sum(body.count(k) for k in CHAT_WORDS)
        i = int(float(t) / HOP)
        if 0 <= i < n:
            rate[i] += bonus
    rate = np.convolve(rate, np.ones(int(5 / HOP)), mode="same")
    return np.clip(zscore_local(rate, int(120 / HOP)), 0, 8) if rate.any() else rate


# ---------------------------------------------------------------- picking clips
def pick_clips(score, words, duration, top, min_len=12, max_len=45):
    order = np.argsort(score)[::-1]
    taken, clips = [], []
    for i in order:
        if score[i] <= 0.5 or len(clips) >= top:
            break
        peak = i * HOP
        if any(abs(peak - p) < 40 for p in taken):
            continue
        start, end = max(0, peak - 9), min(duration, peak + 11)
        # snap to speech pauses so sentences aren't cut
        for w in words:
            if start - 3 < w["t"] < start and w["t"] - _prev_end(words, w) > 0.6:
                start = w["t"] - 0.2
            if end < w["e"] < end + 4 and _next_start(words, w) - w["e"] > 0.6:
                end = w["e"] + 0.4
                break
        if end - start < min_len:
            end = min(duration, start + min_len)
        end = min(end, start + max_len)
        taken.append(peak)
        clips.append({"start": round(start, 2), "end": round(end, 2), "peak": round(peak, 2), "score": float(score[i])})
    best = max((c["score"] for c in clips), default=0)
    clips = [c for c in clips if c["score"] >= 0.45 * best]  # drop weak filler
    return sorted(clips, key=lambda c: -c["score"])


def _prev_end(words, w):
    i = words.index(w)
    return words[i - 1]["e"] if i else -99


def _next_start(words, w):
    i = words.index(w)
    return words[i + 1]["t"] if i + 1 < len(words) else 1e9


def reasons(clip, loud, wsig, chat, words):
    i = int(clip["peak"] / HOP)
    sl = slice(max(0, i - 6), i + 7)
    r = []
    if loud[sl].max() > 2.5:
        r.append("Lautstärke-Peak")
    hits = [w["w"] for w in words if clip["start"] <= w["t"] <= clip["end"]
            and re.sub(r"[^\wäöüß]", "", w["w"].lower()) in REACTION_WORDS]
    if hits:
        r.append("Reaktion: " + ", ".join(dict.fromkeys(h.strip(".,!?") for h in hits[:4])))
    if chat[sl].max() > 2.5:
        r.append("Chat-Spike")
    return " + ".join(r) or "Gesamt-Score"


# ---------------------------------------------------------------- rendering
def ass_time(t):
    t = max(0, t)
    return f"{int(t // 3600)}:{int(t % 3600 // 60):02d}:{t % 60:05.2f}"


def write_ass(path: Path, words, clip_start, clip_end, font, tag="GTA DEUTSCHLAND"):
    """Word-by-word captions: chunks of up to 3 words, current word in yellow."""
    ws = [w for w in words if clip_start <= w["t"] < clip_end]
    chunks, cur = [], []
    for i, w in enumerate(ws):
        cur.append(w)
        nxt = ws[i + 1] if i + 1 < len(ws) else None
        pause = nxt is not None and nxt["t"] - w["e"] > 0.35
        if nxt is None or pause or len(cur) >= 3 or len(" ".join(x["w"] for x in cur)) >= 16:
            chunks.append(cur)
            cur = []
    head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,{font},92,&H00FFFFFF,&H00FFFFFF,&H001E041E,&H96000000,1,0,0,0,100,100,0,0,1,9,5,2,60,60,520,1
Style: Tag,{font},50,&H00FFFFFF,&H00FFFFFF,&H001E041E,&H00000000,1,0,0,0,100,100,2,0,1,5,0,8,40,40,150,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    lines = [f"Dialogue: 0,{ass_time(0)},{ass_time(clip_end - clip_start)},Tag,,0,0,0,,{tag}"]
    for ci, ch in enumerate(chunks):
        c_end = chunks[ci + 1][0]["t"] if ci + 1 < len(chunks) else ch[-1]["e"] + 0.4
        c_end = min(c_end, ch[-1]["e"] + 0.8)
        for wi, w in enumerate(ch):
            s = w["t"]
            e = ch[wi + 1]["t"] if wi + 1 < len(ch) else c_end
            txt = " ".join(("{\\c&H3CD6FF&}" + x["w"].upper().strip(".,") + "{\\c&HFFFFFF&}") if k == wi
                           else x["w"].upper().strip(".,") for k, x in enumerate(ch))
            pop = "{\\fscx88\\fscy88\\t(0,90,\\fscx100\\fscy100)}" if wi == 0 else ""
            lines.append(f"Dialogue: 1,{ass_time(s - clip_start)},{ass_time(e - clip_start)},Cap,,0,0,0,,{pop}{txt}")
    path.write_text(head + "\n".join(lines) + "\n", encoding="utf-8")


def render(video, clip, words, outdir: Path, name, font, zoom=1.3):
    outdir.mkdir(parents=True, exist_ok=True)
    ass = outdir / f"{name}.ass"
    write_ass(ass, words, clip["start"], clip["end"], font)
    dur = clip["end"] - clip["start"]
    vf = ("[0:v]split=2[a][b];"
          "[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:2,eq=brightness=-0.12[bg];"
          f"[b]scale={int(1080 * zoom) // 2 * 2}:-2,crop=1080:ih[fg];"
          "[bg][fg]overlay=(W-w)/2:(H-h)/2-80,"
          f"subtitles={ass.name}[v]")
    run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(clip["start"]), "-t", str(dur), "-i", str(Path(video).resolve()),
         "-filter_complex", vf, "-map", "[v]", "-map", "0:a?", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
         "-c:a", "aac", "-b:a", "160k", "-af", "loudnorm=I=-14:TP=-1.5", "-movflags", "+faststart", f"{name}.mp4"],
        cwd=outdir)
    thumb = outdir / f"{name}.jpg"
    run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(min(dur - 0.1, clip["peak"] - clip["start"])), "-i", f"{name}.mp4",
         "-frames:v", "1", "-vf", "scale=270:-1", thumb.name], cwd=outdir)
    ass.unlink()
    return outdir / f"{name}.mp4"


def hms(t):
    return f"{int(t // 3600)}:{int(t % 3600 // 60):02d}:{int(t % 60):02d}"


# ---------------------------------------------------------------- main
def process_vod(src, args):
    workdir = Path(args.out) / "vods" / date.today().isoformat()
    if re.match(r"https?://", src):
        vid = re.search(r"videos/(\d+)", src)
        workdir = workdir / (vid.group(1) if vid else "vod")
        workdir.mkdir(parents=True, exist_ok=True)
        video, chat = download(src, workdir)
    else:
        video, chat = Path(src), args.chat and Path(args.chat)
        workdir = workdir / Path(src).stem
        workdir.mkdir(parents=True, exist_ok=True)
    duration = ffprobe_duration(video)
    print(f"Video: {video} ({duration / 60:.1f} min)")
    loud, wav = loudness_signal(video, workdir)
    n = len(loud)
    words = [] if args.no_transcript else transcribe(wav, workdir, args.model, args.device)
    wsig = word_signal(words, n)
    csig = chat_signal(chat, n)
    score = 1.0 * loud + 0.6 * wsig + 0.8 * csig
    clips = pick_clips(score, words, duration, args.top)
    print(f"{len(clips)} candidates")
    sheet = ["# Clip-Kandidaten", "", f"Quelle: `{src}`", "",
             "| # | Vorschau | VOD-Zeit | Länge | Warum | Gesagt |", "|---|---|---|---|---|---|"]
    for k, c in enumerate(clips, 1):
        name = f"clip_{k:02d}"
        render(video, c, words, workdir / "clips", name, args.font, args.zoom)
        said = " ".join(w["w"] for w in words if c["start"] <= w["t"] < c["end"])[:140]
        sheet.append(f"| {k} | ![](clips/{name}.jpg) | {hms(c['start'])} | {c['end'] - c['start']:.0f} s | "
                     f"{reasons(c, loud, wsig, csig, words)} | {said} |")
        print(f"  rendered {name}")
    (workdir / "CANDIDATES.md").write_text("\n".join(sheet) + "\n", encoding="utf-8")
    (workdir / "candidates.json").write_text(json.dumps(clips, indent=1), encoding="utf-8")
    print(f"Done: {workdir / 'CANDIDATES.md'}")


def process_captures(folder, args):
    outdir = Path(args.out) / "captures" / date.today().isoformat()
    outdir.mkdir(parents=True, exist_ok=True)
    for i, f in enumerate(sorted(Path(folder).glob("*.mp4")), 1):
        work = outdir / f.stem
        work.mkdir(exist_ok=True)
        dur = ffprobe_duration(f)
        _, wav = loudness_signal(f, work)
        words = [] if args.no_transcript else transcribe(wav, work, args.model, args.device)
        render(f, {"start": 0, "end": min(dur, 59), "peak": dur / 2}, words, outdir, f"capture_{i:02d}", args.font, args.zoom)
        shutil.rmtree(work, ignore_errors=True)
        print(f"  rendered capture_{i:02d} from {f.name}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("source", nargs="?", help="Twitch VOD URL or local video file")
    ap.add_argument("--captures", help="folder of Xbox capture clips to verticalize")
    ap.add_argument("--chat", help="chat JSON for a local file (TwitchDownloader or yt-dlp rechat)")
    ap.add_argument("--out", default="output")
    ap.add_argument("--top", type=int, default=12)
    ap.add_argument("--model", default="small", help="faster-whisper model: small / medium / large-v3")
    ap.add_argument("--device", default="auto")
    ap.add_argument("--font", default=DEFAULT_FONT)
    ap.add_argument("--zoom", type=float, default=1.3, help="gameplay zoom in the vertical frame (1.0 = full width)")
    ap.add_argument("--no-transcript", action="store_true", help="skip whisper (no captions, loudness/chat only)")
    a = ap.parse_args()
    if a.captures:
        process_captures(a.captures, a)
    if a.source:
        process_vod(a.source, a)
    if not (a.source or a.captures):
        ap.print_help()
