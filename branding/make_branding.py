"""Draw the GTA Deutschland channel banner and profile picture (original art, no Rockstar assets).

    .venv\\Scripts\\python.exe branding\\make_branding.py
"""
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = Path(__file__).parent
FONTS = Path("C:/Windows/Fonts")
FLAG = [(20, 20, 20), (221, 0, 0), (255, 206, 0)]
SKY = [(0.0, (16, 6, 36)), (0.45, (92, 18, 104)), (0.75, (255, 46, 136)), (1.0, (255, 150, 60))]


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONTS / name), size)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient(w: int, h: int, stops) -> Image.Image:
    img = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / (h - 1)
        for (t0, c0), (t1, c1) in zip(stops, stops[1:]):
            if t0 <= t <= t1:
                d.line([(0, y), (w, y)], fill=lerp(c0, c1, (t - t0) / (t1 - t0)))
                break
    return img


def sun(img: Image.Image, cx: int, cy: int, r: int) -> None:
    """Retro striped sun sitting on the horizon."""
    layer = gradient(2 * r, 2 * r, [(0, (255, 236, 120)), (0.55, (255, 140, 70)), (1, (255, 40, 130))])
    mask = Image.new("L", (2 * r, 2 * r), 0)
    md = ImageDraw.Draw(mask)
    md.ellipse([0, 0, 2 * r, 2 * r], fill=255)
    gap, y = 6, r  # stripes get thicker towards the bottom
    while y < 2 * r:
        md.rectangle([0, y, 2 * r, y + gap], fill=0)
        y += gap + 26
        gap += 5
    glow = Image.new("RGB", img.size, (0, 0, 0))
    ImageDraw.Draw(glow).ellipse([cx - r * 1.3, cy - r * 1.3, cx + r * 1.3, cy + r * 1.3], fill=(255, 60, 140))
    img.paste(Image.blend(img, glow.filter(ImageFilter.GaussianBlur(r // 2)), 0.35))
    img.paste(layer, (cx - r, cy - r), mask)


def skyline(d: ImageDraw.ImageDraw, w: int, horizon: int, scale: float, seed: int) -> None:
    rnd = random.Random(seed)
    x = 0
    while x < w:
        bw = int(rnd.randint(40, 110) * scale)
        bh = int(rnd.choice([rnd.randint(60, 180), rnd.randint(180, 420)]) * scale)
        d.rectangle([x, horizon - bh, x + bw, horizon], fill=(38, 10, 58))
        for wy in range(horizon - bh + 14, horizon - 10, int(22 * scale)):  # lit windows
            for wx in range(x + 8, x + bw - 8, int(16 * scale)):
                if rnd.random() < 0.18:
                    d.rectangle([wx, wy, wx + 5 * scale, wy + 8 * scale], fill=(255, 190, 120))
        x += bw + int(rnd.randint(0, 14) * scale)


def palm(d: ImageDraw.ImageDraw, base: tuple, height: int, lean: float, color=(14, 4, 26)) -> None:
    bx, by = base
    pts = []
    for i in range(41):  # curved trunk made of shrinking circles
        t = i / 40
        x = bx + lean * height * t * t
        y = by - height * t
        r = height * (0.035 - 0.017 * t)
        d.ellipse([x - r, y - r, x + r, y + r], fill=color)
        pts.append((x, y))
    tx, ty = pts[-1]
    for k in range(9):  # drooping fronds
        ang = math.radians(-170 + k * 42 + lean * 15)
        length = height * 0.42
        poly_top, poly_bot = [], []
        for i in range(21):
            t = i / 20
            x = tx + math.cos(ang) * length * t
            y = ty + math.sin(ang) * length * t + (length * 0.55) * t * t
            wdt = height * 0.045 * math.sin(math.pi * t)
            nx, ny = -math.sin(ang), math.cos(ang)
            poly_top.append((x + nx * wdt, y + ny * wdt))
            poly_bot.append((x - nx * wdt, y - ny * wdt))
        d.polygon(poly_top + poly_bot[::-1], fill=color)


def water(img: Image.Image, horizon: int) -> None:
    w, h = img.size
    d = ImageDraw.Draw(img)
    base = gradient(w, h - horizon, [(0, (40, 8, 60)), (1, (10, 3, 20))])
    img.paste(base, (0, horizon))
    for i, y in enumerate(range(horizon + 8, h, 14)):  # sun reflection streaks
        half = int((w * 0.12) * (1 - (y - horizon) / (h - horizon)) + 20)
        d.line([(w // 2 - half, y), (w // 2 + half, y)], fill=(255, 120 - min(i * 4, 80), 140), width=3)


def glow_text(img: Image.Image, xy, text: str, f, fill=(255, 255, 255), glow=(255, 50, 150), radius=18, anchor="mm"):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).text(xy, text, font=f, fill=glow + (255,), anchor=anchor)
    img.paste(glow, (0, 0), layer.filter(ImageFilter.GaussianBlur(radius)).split()[3])
    d = ImageDraw.Draw(img)
    d.text((xy[0] + 6, xy[1] + 6), text, font=f, fill=(20, 4, 30), anchor=anchor)  # drop shadow
    d.text(xy, text, font=f, fill=fill, anchor=anchor, stroke_width=3, stroke_fill=(30, 6, 45))


def flag_bar(d: ImageDraw.ImageDraw, cx: int, y: int, width: int, height: int) -> None:
    for i, c in enumerate(FLAG):
        d.rectangle([cx - width // 2, y + i * height // 3, cx + width // 2, y + (i + 1) * height // 3], fill=c)


def banner() -> None:
    # 2560x1440; YouTube only guarantees the centre 1546x423 is visible on every device.
    w, h, horizon = 2560, 1440, 1000
    img = gradient(w, h, [(t * horizon / h, c) for t, c in SKY] + [(1.0, (255, 150, 60))])
    sun(img, w // 2, horizon, 360)
    water(img, horizon)
    d = ImageDraw.Draw(img)
    skyline(d, w, horizon, 1.0, seed=7)
    palm(d, (180, h + 40), 900, 0.18)
    palm(d, (420, h + 60), 700, 0.32)
    palm(d, (2380, h + 40), 920, -0.2)
    palm(d, (2150, h + 60), 680, -0.34)
    glow_text(img, (w // 2, 640), "GTA DEUTSCHLAND", font("impact.ttf", 190))
    flag_bar(d, w // 2, 760, 560, 24)
    glow_text(img, (w // 2, 850), "NEWS  •  TRAILER-ANALYSEN  •  CLIPS", font("arialbd.ttf", 56),
              glow=(255, 120, 60), radius=10)
    img.save(OUT / "banner.png")


def profile() -> None:
    s, horizon = 800, 560
    img = gradient(s, s, [(t * horizon / s, c) for t, c in SKY] + [(1.0, (255, 150, 60))])
    sun(img, s // 2, horizon, 230)
    water(img, horizon)
    d = ImageDraw.Draw(img)
    skyline(d, s, horizon, 0.45, seed=3)
    palm(d, (40, s + 30), 520, 0.25)
    palm(d, (770, s + 30), 520, -0.25)
    glow_text(img, (s // 2, 330), "GTA", font("impact.ttf", 300), radius=22)
    flag_bar(d, s // 2, 500, 330, 36)
    img.save(OUT / "profile.png")


if __name__ == "__main__":
    banner()
    profile()
    print("saved banner.png and profile.png")
