"""Two-part meme Short: image or video + caption on top, a reaction clip (with sound) on the bottom.

    python meme.py --top map.png --bottom "https://www.youtube.com/watch?v=..." \
        --caption "\"You've completed the tutorial. Now it's time to explore the world on your own\"" \
        --icon 👠 --icon-pos 0.62,0.62 --out meme.mp4 [--start 0 --end 12]
    python meme.py --top trailer.mp4 --top-start 34.6 --bottom clip.mp4 --caption "..." --out meme.mp4

--top can be an image or a video (muted; --top-start picks where it begins).
--bottom can be a YouTube URL (downloaded with yt-dlp) or a local video file; its sound is kept.
--icon-pos is the icon centre as fractions of the top half (x,y). Leave --icon out for none.
"""
import argparse
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1080, 1920
HALF = H // 2
VIDEO_EXT = {".mp4", ".mov", ".mkv", ".webm", ".m4v"}

CAPTION_FONTS = ["C:/Windows/Fonts/arialbd.ttf", "/usr/share/fonts/opentype/inter/Inter-Bold.otf",
                 "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"]
EMOJI_FONTS = ["C:/Windows/Fonts/seguiemj.ttf", "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf"]


def first_existing(paths):
    for p in paths:
        if Path(p).exists():
            return p
    raise SystemExit(f"none of these fonts exist: {paths}")


def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if draw.textlength(test, font=font) <= max_w:
            cur = test
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def emoji_image(char, size):
    path = first_existing(EMOJI_FONTS)
    if "Noto" in path:  # bitmap font: only renders at 109px, scale afterwards
        f = ImageFont.truetype(path, 109)
        img = Image.new("RGBA", (160, 160), (0, 0, 0, 0))
        ImageDraw.Draw(img).text((80, 80), char, font=f, embedded_color=True, anchor="mm")
    else:
        f = ImageFont.truetype(path, size)
        img = Image.new("RGBA", (size * 2, size * 2), (0, 0, 0, 0))
        ImageDraw.Draw(img).text((size, size), char, font=f, embedded_color=True, anchor="mm")
    img = img.crop(img.getbbox())
    scale = size / max(img.size)
    return img.resize((max(1, int(img.width * scale)), max(1, int(img.height * scale))), Image.LANCZOS)


def cover(src, w, h):
    r = max(w / src.width, h / src.height)
    src = src.resize((int(src.width * r + 0.5), int(src.height * r + 0.5)), Image.LANCZOS)
    left, top = (src.width - w) // 2, (src.height - h) // 2
    return src.crop((left, top, left + w, top + h))


def build_overlay(background, caption, icon, icon_pos, out_png, fit="cover", caption_size=80):
    """Caption + icon drawn on the top-half image, or on a transparent layer when background is None.

    fit="contain" keeps the whole image (full width, bottom-aligned) over a blurred copy of itself,
    leaving the space above it for the caption; "cover" fills the half and crops the edges.
    """
    if background:
        src = Image.open(background).convert("RGB")
        if fit == "contain":
            img = cover(src, W, HALF).filter(ImageFilter.GaussianBlur(28))
            img = Image.blend(img, Image.new("RGB", img.size, (0, 0, 0)), 0.35)
            full = src.resize((W, int(src.height * W / src.width)), Image.LANCZOS)
            img.paste(full, (0, HALF - full.height))
            img = img.convert("RGBA")
        else:
            img = cover(src, W, HALF).convert("RGBA")
    else:
        img = Image.new("RGBA", (W, HALF), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if icon:
        cx, cy = (float(v) for v in icon_pos.split(","))
        box = 130
        x0, y0 = int(cx * W - box / 2), int(cy * HALF - box / 2)
        d.rectangle([x0, y0, x0 + box, y0 + box], fill=(255, 255, 255, 255))
        em = emoji_image(icon, 104)
        img.alpha_composite(em, (x0 + (box - em.width) // 2, y0 + (box - em.height) // 2))
    if caption:
        f = ImageFont.truetype(first_existing(CAPTION_FONTS), caption_size)
        lines = wrap(d, caption, f, W - 90)
        y = 30
        for ln in lines:
            d.text((W // 2, y), ln, font=f, fill="white", anchor="ma", stroke_width=max(4, caption_size // 10),
                   stroke_fill="black")
            y += int(caption_size * 1.22)
    img.save(out_png)


def fetch_bottom(src, workdir: Path):
    if src.startswith("http"):
        out = workdir / "bottom_src.mp4"
        if not out.exists():
            subprocess.run([sys.executable, "-m", "yt_dlp", "--js-runtimes", "node", "-f", "bv*[height<=1080]+ba/b",
                            "--merge-output-format", "mp4", "--no-progress", "-o", str(out), src], check=True)
        return out
    return Path(src)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--top", required=True, help="image or video for the top half (map screenshot, gameplay...)")
    ap.add_argument("--top-start", type=float, default=0, help="where a top video starts (seconds)")
    ap.add_argument("--top-crop", help="ffmpeg crop for a letterboxed top video, e.g. iw:ih*0.76 (cuts the black bars)")
    ap.add_argument("--bottom", required=True, help="YouTube URL or local video for the bottom half")
    ap.add_argument("--caption", default="")
    ap.add_argument("--caption-file", type=Path, help="read the caption from a UTF-8 text file (avoids shell quoting)")
    ap.add_argument("--caption-size", type=int, default=80)
    ap.add_argument("--top-fit", choices=["cover", "contain"], default="cover",
                    help="contain: show the whole top image with the caption above it; cover: fill and crop")
    ap.add_argument("--icon", default="", help="one emoji drawn in a white box on the top image")
    ap.add_argument("--icon-pos", default="0.62,0.62")
    ap.add_argument("--start", type=float, default=0)
    ap.add_argument("--end", type=float, default=None, help="cut the bottom clip here (seconds)")
    ap.add_argument("--out", default="meme.mp4")
    a = ap.parse_args()
    if a.caption_file:
        a.caption = a.caption_file.read_text(encoding="utf-8").strip()

    work =Path(a.out).resolve().parent / (Path(a.out).stem + "_work")
    work.mkdir(parents=True, exist_ok=True)
    overlay = work / "top.png"
    top_is_video = Path(a.top).suffix.lower() in VIDEO_EXT
    build_overlay(None if top_is_video else a.top, a.caption, a.icon, a.icon_pos, overlay, a.top_fit, a.caption_size)
    bottom = fetch_bottom(a.bottom, work)
    cut = ["-ss", str(a.start)] + (["-to", str(a.end)] if a.end else [])
    if top_is_video:
        # Input 0: top video (muted), 1: bottom clip, 2: caption/icon layer.
        inputs = ["-ss", str(a.top_start), "-stream_loop", "-1", "-i", str(Path(a.top).resolve()),
                  *cut, "-i", str(bottom), "-i", str(overlay)]
        pre = f"crop={a.top_crop}," if a.top_crop else ""
        top = (f"[0:v]{pre}scale=1080:960:force_original_aspect_ratio=increase,crop=1080:960,setsar=1,fps=30[tv];"
               "[tv][2:v]overlay=0:0[t];")
    else:
        inputs = ["-loop", "1", "-i", str(overlay), *cut, "-i", str(bottom)]
        top = "[0:v]scale=1080:960,setsar=1,fps=30[t];"
    fc = (top + "[1:v]scale=1080:960:force_original_aspect_ratio=increase,crop=1080:960,setsar=1,fps=30[b];"
          "[t][b]vstack=inputs=2:shortest=1,format=yuv420p[v]")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs,
                    "-filter_complex", fc, "-map", "[v]", "-map", "1:a?", "-shortest",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", str(Path(a.out).resolve())], check=True)
    print("saved", a.out)


if __name__ == "__main__":
    main()
