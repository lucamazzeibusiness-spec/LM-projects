"""Transcribe a clip with faster-whisper and write a Shorts-style .ass subtitle file."""
from pathlib import Path

_model = None

HEADER = """[Script Info]
ScriptType: v4.00+
PlayResX: {w}
PlayResY: {h}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Arial Black,{cap},&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,6,2,2,60,60,{cap_v},1
Style: Credit,Arial,{credit},&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,3,1,8,60,60,{credit_v},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""


def _ts(sec: float) -> str:
    h, rem = divmod(max(sec, 0), 3600)
    m, s = divmod(rem, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def _clean(text: str) -> str:
    return text.strip().upper().replace("{", "(").replace("}", ")").replace("\n", " ")


def transcribe_words(video: Path, model_size: str, device: str = "cpu",
                     prompt: str | None = None) -> list[tuple[float, float, str]]:
    """prompt: text the audio probably contains (e.g. the script), so names are spelled right."""
    global _model
    if _model is None:
        from faster_whisper import WhisperModel

        # "cuda" needs the CUDA 12 + cuDNN runtime installed; "auto" picks the GPU
        # whenever one exists and then crashes without them, so default to CPU.
        _model = WhisperModel(model_size, device=device, compute_type="int8")
    segments, _ = _model.transcribe(str(video), word_timestamps=True, vad_filter=True, initial_prompt=prompt)
    return [(w.start, w.end, w.word) for seg in segments for w in seg.words]


def write_ass(out: Path, duration: float, credit: str, words, per_line: int = 3,
              width: int = 1080, height: int = 1920) -> None:
    if height > width:  # vertical: captions under the video band, credit above it
        sizes = dict(cap=84, cap_v=480, credit=48, credit_v=520)
    else:
        sizes = dict(cap=64, cap_v=70, credit=36, credit_v=40)
    lines = [HEADER.format(w=width, h=height, **sizes)]
    if credit:
        lines.append(f"Dialogue: 0,{_ts(0)},{_ts(duration)},Credit,,0,0,0,,{_clean(credit)}\n")
    for i in range(0, len(words), per_line):
        chunk = words[i : i + per_line]
        start, end = chunk[0][0], chunk[-1][1]
        text = " ".join(_clean(w[2]) for w in chunk)
        lines.append(f"Dialogue: 1,{_ts(start)},{_ts(end)},Cap,,0,0,0,,{text}\n")
    out.write_text("".join(lines), encoding="utf-8")
