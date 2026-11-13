"""Download a clip and render it as a 1080x1920 Short."""
import json
import shutil
import subprocess
from pathlib import Path

import yt_dlp

LAYOUTS = {
    # Blurred, zoomed copy behind the full 16:9 frame.
    "blur": (
        "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
        "boxblur=20:5[bg];[0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2"
    ),
    # Centre crop, fills the screen but cuts the sides off.
    "crop": "[0:v]crop=ih*9/16:ih,scale=1080:1920",
}


def ffmpeg_bin(name: str = "ffmpeg") -> str:
    path = shutil.which(name)
    if not path:
        raise SystemExit(f"{name} not found on PATH; open a new terminal after installing FFmpeg")
    return path


def download(url: str, dest: Path) -> Path:
    opts = {"outtmpl": str(dest / "source.%(ext)s"), "format": "best", "quiet": True}
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=True)
        return Path(ydl.prepare_filename(info))


def duration(video: Path) -> float:
    out = subprocess.run(
        [ffmpeg_bin("ffprobe"), "-v", "quiet", "-print_format", "json", "-show_format", str(video)],
        capture_output=True, text=True, check=True,
    )
    return float(json.loads(out.stdout)["format"]["duration"])


def render(src: Path, out: Path, layout: str, ass: Path | None) -> None:
    graph = LAYOUTS[layout]
    if ass:
        # Run from the clip folder so the subtitles filter gets a plain relative
        # name; Windows drive letters break ffmpeg's filter escaping.
        graph += f",ass={ass.name}"
    subprocess.run(
        [
            ffmpeg_bin(), "-y", "-loglevel", "error", "-i", src.name,
            "-filter_complex", graph + "[v]", "-map", "[v]", "-map", "0:a?",
            "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "160k", "-r", "30", "-movflags", "+faststart",
            out.name,
        ],
        cwd=src.parent, check=True,
    )
