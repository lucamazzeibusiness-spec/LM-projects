"""Two-part meme Short: image + caption on top, a reaction clip (with sound) on the bottom.

    python meme.py --top map.png --bottom "https://www.youtube.com/watch?v=..." \
        --caption "\"You've completed the tutorial. Now it's time to explore the world on your own\"" \
        --icon 👠 --icon-pos 0.62,0.62 --out meme.mp4 [--start 0 --end 12]

--bottom can be a YouTube URL (downloaded with yt-dlp) or a local video file.
--icon-pos is the icon centre as fractions of the top half (x,y). Leave --icon out for none.
"""
import argparse
import os
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
HALF = H // 2

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


def build_top(top_path, caption, icon, icon_pos, out_png):
    src = Image.open(top_path).convert("RGB")
    r = max(W / src.width, HALF / src.height)
    src = src.resize((int(src.width * r + 0.5), int(src.height * r + 0.5)), Image.LANCZOS)
    left, top = (src.width - W) // 2, (src.height - HALF) // 2
    img = src.crop((left, top, left + W, top + HALF)).convert("RGBA")
    d = ImageDraw.Draw(img)
    if icon:
        cx, cy = (float(v) for v in icon_pos.split(","))
        box = 130
        x0, y0 = int(cx * W - box / 2), int(cy * HALF - box / 2)
        d.rectangle([x0, y0, x0 + box, y0 + box], fill=(255, 255, 255, 255))
        em = emoji_image(icon, 104)
        img.alpha_composite(em, (x0 + (box - em.width) // 2, y0 + (box - em.height) // 2))
    if caption:
        f = ImageFont.truetype(first_existing(CAPTION_FONTS), 88)
        lines = wrap(d, caption, f, W - 110)
        y = 40
        for ln in lines:
            d.text((W // 2, y), ln, font=f, fill="white", anchor="ma", stroke_width=8, stroke_fill="black")
            y += 108
    img.convert("RGB").save(out_png)


def fetch_bottom(src, workdir: Path):
    if src.startswith("http"):
        out = workdir / "bottom_src.mp4"
        if not out.exists():
            subprocess.run([sys.executable, "-m", "yt_dlp", "-f", "bv*[height<=1080]+ba/b", "--merge-output-format", "mp4",
                            "-o", str(out), src], check=True)
        return out
    return Path(src)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--top", required=True, help="image for the top half (map screenshot etc.)")
    ap.add_argument("--bottom", required=True, help="YouTube URL or local video for the bottom half")
    ap.add_argument("--caption", default="")
    ap.add_argument("--icon", default="", help="one emoji drawn in a white box on the top image")
    ap.add_argument("--icon-pos", default="0.62,0.62")
    ap.add_argument("--start", type=float, default=0)
    ap.add_argument("--end", type=float, default=None, help="cut the bottom clip here (seconds)")
    ap.add_argument("--out", default="meme.mp4")
    a = ap.parse_args()

    work = Path(a.out).resolve().parent / (Path(a.out).stem + "_work")
    work.mkdir(parents=True, exist_ok=True)
    top_png = work / "top.png"
    build_top(a.top, a.caption, a.icon, a.icon_pos, top_png)
    bottom = fetch_bottom(a.bottom, work)
    cut = ["-ss", str(a.start)] + (["-to", str(a.end)] if a.end else [])
    fc = ("[1:v]scale=1080:960:force_original_aspect_ratio=increase,crop=1080:960,setsar=1,fps=30[b];"
          "[0:v]scale=1080:960,setsar=1,fps=30[t];[t][b]vstack=inputs=2,format=yuv420p[v]")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", str(top_png), *cut, "-i", str(bottom),
                    "-filter_complex", fc, "-map", "[v]", "-map", "1:a?", "-shortest",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", str(Path(a.out).resolve())], check=True)
    print("saved", a.out)


if __name__ == "__main__":
    main()
