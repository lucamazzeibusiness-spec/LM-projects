"""Cut footage to a narrated script and render the finished explainer video."""
import re
import subprocess
from pathlib import Path

import yt_dlp

from clipper import captions
from clipper.render import duration, ffmpeg_bin

SIZES = {"short": (1080, 1920), "long": (1920, 1080)}


def fetch_footage(sources: list[str], dest: Path) -> list[Path]:
    """Download URLs (YouTube etc.) into dest; local files are used where they are."""
    dest.mkdir(parents=True, exist_ok=True)
    files = []
    for src in sources:
        if Path(src).exists():
            files.append(Path(src).resolve())
            continue
        if "://" not in src:
            raise SystemExit(f"Footage file not found: {src}")
        opts = {
            "outtmpl": str(dest / "%(title).60s.%(ext)s"),
            "format": "bv*[height<=1080]+ba/b[height<=1080]",
            "merge_output_format": "mp4",
            "js_runtimes": {"node": {}},  # YouTube needs a JS runtime to unlock formats
            "quiet": True,
            "noprogress": True,
        }
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(src, download=True)
            files.append(Path(ydl.prepare_filename(info)).with_suffix(".mp4"))
    return files


def shot_starts(video: Path, threshold: float = 0.35) -> list[float]:
    """Timestamps where the picture cuts to a new shot."""
    out = subprocess.run(
        [ffmpeg_bin(), "-hide_banner", "-i", str(video), "-an",
         "-vf", f"scale=320:-2,select='gt(scene,{threshold})',showinfo", "-f", "null", "-"],
        capture_output=True, text=True,
    ).stderr
    return [0.0] + [float(t) for t in re.findall(r"pts_time:([\d.]+)", out)]


def plan_footage(scenes: list[dict], footage: list[Path], root: Path) -> None:
    """Give each scene its own shot, spread in order across all the footage.

    Skips the first 3% and last 8% of each video, where logos and end cards live.
    The choice is written into each scene as source/start so it can be hand-edited.
    """
    shots = []  # (file, start, end)
    for f in footage:
        length = duration(f)
        lo, hi = 0.03 * length, 0.92 * length
        cuts = sorted({lo, hi, *(t for t in shot_starts(f) if lo < t < hi)})
        shots += [(f, a, b) for a, b in zip(cuts, cuts[1:]) if b - a >= 1]
    if not shots:
        raise SystemExit("No usable footage found")
    # Fewer shots than scenes: split the longest shots so no scene repeats footage.
    while len(shots) < len(scenes):
        i = max(range(len(shots)), key=lambda k: shots[k][2] - shots[k][1])
        f, a, b = shots[i]
        shots[i : i + 1] = [(f, a, (a + b) / 2), (f, (a + b) / 2, b)]
    step = len(shots) / len(scenes)
    for i, scene in enumerate(scenes):
        f, t, _ = shots[int(i * step)]
        scene["source"] = str(f.relative_to(root)) if f.is_relative_to(root) else str(f)
        scene["start"] = round(t + 0.3, 2)  # land just after the cut


def _layout(fmt: str, layout: str) -> str:
    w, h = SIZES[fmt]
    if fmt == "long":
        return f"[0:v]scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h}"
    if layout == "crop":
        return f"[0:v]crop=ih*9/16:ih,scale={w}:{h}"
    return (
        f"[0:v]scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},boxblur=20:5[bg];"
        f"[0:v]scale={w}:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2"
    )


def render(project: Path, script: dict, cfg: dict, music: Path | None = None) -> Path:
    fmt = script["format"]
    work = project / "work"
    work.mkdir(exist_ok=True)
    ff = ffmpeg_bin()
    enc = ["-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "30"]

    parts, voices = [], []
    for i, scene in enumerate(script["scenes"]):
        voice = work / f"voice_{i:03d}.mp3"
        if not voice.exists():
            raise SystemExit(f"Missing narration {voice.name}; run without --render-only first")
        length = duration(voice) + 0.15
        src = Path(scene["source"])
        src = src if src.is_absolute() else project / src
        start = min(scene["start"], max(duration(src) - length, 0))
        part = work / f"part_{i:03d}.mp4"
        subprocess.run(
            [ff, "-y", "-loglevel", "error", "-ss", str(start), "-t", f"{length:.3f}", "-i", str(src),
             "-filter_complex", _layout(fmt, cfg["layout"]) + "[v]", "-map", "[v]", "-an", *enc, str(part)],
            check=True,
        )
        parts.append(part)
        voices.append((voice, length))

    # Pad each narration line to its shot length so audio stays in sync with the cuts.
    (work / "parts.txt").write_text("".join(f"file '{p.name}'\n" for p in parts))
    inputs, pads = [], []
    for i, (voice, length) in enumerate(voices):
        inputs += ["-i", str(voice)]
        pads.append(f"[{i}:a]apad,atrim=0:{length:.3f}[a{i}]")
    subprocess.run(
        [ff, "-y", "-loglevel", "error", *inputs, "-filter_complex",
         ";".join(pads) + ";" + "".join(f"[a{i}]" for i in range(len(voices)))
         + f"concat=n={len(voices)}:v=0:a=1[a]", "-map", "[a]", str(work / "narration.wav")],
        check=True,
    )
    subprocess.run(
        [ff, "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", "parts.txt",
         "-c", "copy", "video.mp4"],
        cwd=work, check=True,
    )

    total = duration(work / "narration.wav")
    w, h = SIZES[fmt]
    words = captions.transcribe_words(
        work / "narration.wav", cfg["whisper_model"], cfg.get("whisper_device", "cpu"),
        prompt=" ".join(s["narration"] for s in script["scenes"]),
    )
    captions.write_ass(work / "captions.ass", total, script.get("credit", ""), words, width=w, height=h)

    cmd = [ff, "-y", "-loglevel", "error", "-i", "video.mp4", "-i", "narration.wav"]
    audio = "[1:a]anull[a]"
    if music:
        cmd += ["-stream_loop", "-1", "-i", str(music.resolve())]
        audio = "[2:a]volume=0.12[m];[1:a][m]amix=inputs=2:duration=first:normalize=0[a]"
    out = project / "video.mp4"
    subprocess.run(
        cmd + ["-filter_complex", f"[0:v]ass=captions.ass[v];{audio}", "-map", "[v]", "-map", "[a]",
               *enc, "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", str(out)],
        cwd=work, check=True,
    )
    return out
