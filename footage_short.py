"""Footage-led Shorts: real game footage, big on-screen text, optional freeze-frame zoom. No voice, no music.

    python footage_short.py shorts.json            # render every Short in the file
    python footage_short.py shorts.json --only 3   # just one

shorts.json:
{
  "source": "output/extended-look/extended-look-360p.mp4",
  "out_dir": "output/extended-look",
  "shorts": [
    {"name": "pisswasser", "start": 711, "end": 724,
     "freeze": {"at": 716.5, "dur": 3.0, "box": [0.40, 0.0, 0.72, 0.30]},
     "texts": [{"t": [0, 3], "text": "Achte auf das Schild 👀", "pos": "top"}, ...]}
  ]
}
Text times are on the finished Short's timeline (seconds). "pos" is "top" (above the footage) or "bottom".
"box" is the freeze-frame crop as fractions of the frame: [x0, y0, x1, y1].
The audio track is silent so a sound can be added in the YouTube app.
"""
import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))  # so clipper/ imports work from any cwd

W, H = 1080, 1920
FONT = "Arial Black"
# Footage band: full-width 16:9 in the middle, blurred zoomed copy behind it.
LAYOUT = ("split=2[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
          "boxblur=26:2,eq=brightness=-0.15[bg];[b]scale=1080:-2:flags=lanczos[fg];"
          "[bg][fg]overlay=(W-w)/2:(H-h)/2")


def ff(*args, cwd=None):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args], check=True, cwd=cwd)


def ts(t):
    return f"{int(t // 3600)}:{int(t % 3600 // 60):02d}:{t % 60:05.2f}"


def build_voice(spec, work, total):
    """Speak each voice line at its time, mix into one track, return (wav, caption words)."""
    from clipper import captions, tts
    from clipper.render import duration

    inputs, mixes = [], []
    for i, line in enumerate(spec["voice"]):
        mp3 = work / f"voice_{i:02d}.mp3"
        tts.speak(line["text"], mp3, spec.get("voice_name", "de-DE-ConradNeural"))
        end = line["at"] + duration(mp3)
        if end > total:
            print(f"   warning: '{line['text'][:30]}...' ends at {end:.1f}s, video is {total:.1f}s")
        inputs += ["-i", mp3.name]
        ms = int(line["at"] * 1000)
        mixes.append(f"[{i}:a]adelay={ms}|{ms}[v{i}]")
    n = len(spec["voice"])
    graph = (";".join(mixes) + ";" + "".join(f"[v{i}]" for i in range(n))
             + f"amix=inputs={n}:normalize=0,apad,atrim=0:{total:.3f}[a]")
    ff(*inputs, "-filter_complex", graph, "-map", "[a]", "-ar", "44100", "-ac", "2", "voice.wav", cwd=work)
    prompt = " ".join(line["text"] for line in spec["voice"])
    words = captions.transcribe_words(work / "voice.wav", "small", "cpu", prompt=prompt)
    return work / "voice.wav", words


def caption_lines(words, per_line=3):
    """Shorts-style captions: 3 words at a time, bottom of the frame."""
    chunks, cur = [], []
    for i, w in enumerate(words):
        cur.append(w)
        nxt = words[i + 1] if i + 1 < len(words) else None
        # Break at sentence ends and pauses so one caption never spans two voice lines.
        if (nxt is None or len(cur) >= per_line or w[2].strip()[-1:] in ".?!:"
                or nxt[0] - w[1] > 0.6):
            chunks.append(cur)
            cur = []
    lines = []
    for chunk in chunks:
        text = " ".join(w[2].strip().upper() for w in chunk).replace("{", "(").replace("}", ")")
        lines.append(f"Dialogue: 1,{ts(chunk[0][0])},{ts(chunk[-1][1])},bottom,,0,0,0,,{text}")
    return lines


def write_ass(path, texts, extra=()):
    head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: top,{FONT},92,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,8,4,8,70,70,380,1
Style: bottom,{FONT},86,&H003CD6FF,&H003CD6FF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,8,4,2,70,70,400,1
Style: tag,{FONT},44,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,2,0,1,4,0,8,40,40,150,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    lines = []
    for x in texts:
        a, b = x["t"]
        pop = "{\\fscx80\\fscy80\\t(0,120,\\fscx100\\fscy100)}"
        lines.append(f"Dialogue: 1,{ts(a)},{ts(b)},{x.get('pos', 'top')},,0,0,0,,{pop}{x['text'].upper()}")
    path.write_text(head + "\n".join([*lines, *extra]) + "\n", encoding="utf-8")


def render(source: Path, spec: dict, out_dir: Path):
    work = out_dir / f"{spec['name']}_work"
    if work.exists():
        shutil.rmtree(work)
    work.mkdir(parents=True)
    enc = ["-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "30", "-an"]
    parts = []

    def clip(a, b, name):
        ff("-ss", str(a), "-t", f"{b - a:.3f}", "-i", str(source), "-filter_complex", LAYOUT, *enc, name, cwd=work)
        parts.append(name)

    fz = spec.get("freeze")
    if fz:
        clip(spec["start"], fz["at"], "p1.mp4")
        x0, y0, x1, y1 = fz["box"]
        # Still of the detail, slowly pushing in so the freeze doesn't feel dead.
        ff("-ss", str(fz["at"]), "-i", str(source), "-frames:v", "1",
           "-vf", f"crop=iw*{x1 - x0}:ih*{y1 - y0}:iw*{x0}:ih*{y0},scale=1920:-2:flags=lanczos", "still.png", cwd=work)
        frames = int(fz["dur"] * 30)
        ff("-loop", "1", "-t", str(fz["dur"]), "-i", "still.png", "-filter_complex",
           f"zoompan=z='1+0.12*on/{frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30,"
           + LAYOUT, *enc, "p2.mp4", cwd=work)
        parts.append("p2.mp4")
        clip(fz["at"], spec["end"], "p3.mp4")
    else:
        clip(spec["start"], spec["end"], "p1.mp4")

    (work / "parts.txt").write_text("".join(f"file '{p}'\n" for p in parts))
    ff("-f", "concat", "-safe", "0", "-i", "parts.txt", "-c", "copy", "joined.mp4", cwd=work)
    texts = spec["texts"] + [{"t": [0, 999], "text": "GTA DEUTSCHLAND", "pos": "tag"}]
    if spec.get("voice"):
        from clipper.render import duration
        wav, words = build_voice(spec, work, duration(work / "joined.mp4"))
        write_ass(work / "text.ass", texts, caption_lines(words))
        audio = ["-i", wav.name]
    else:  # silent track so a sound can be added in the YouTube app
        write_ass(work / "text.ass", texts)
        audio = ["-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo"]
    out = out_dir / f"{spec['name']}.mp4"
    ff("-i", "joined.mp4", *audio, "-vf", "ass=text.ass",
       "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest",
       "-movflags", "+faststart", str(out.resolve()), cwd=work)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec", type=Path)
    ap.add_argument("--only", type=int, help="1-based index of one Short to render")
    a = ap.parse_args()
    cfg = json.loads(a.spec.read_text(encoding="utf-8"))
    source, out_dir = Path(cfg["source"]).resolve(), Path(cfg["out_dir"])
    out_dir.mkdir(parents=True, exist_ok=True)
    for i, spec in enumerate(cfg["shorts"], 1):
        if a.only and i != a.only:
            continue
        print("rendered", render(source, spec, out_dir))


if __name__ == "__main__":
    main()
