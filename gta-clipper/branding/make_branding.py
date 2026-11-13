"""Draw the GTA Deutschland channel banner and profile picture (original art, no Rockstar assets).

    python branding/make_branding.py
"""
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = Path(__file__).parent / "out"
OUT.mkdir(exist_ok=True)
FONTS = Path("C:/Windows/Fonts")
FALLBACK = Path("/usr/share/fonts/opentype/inter")  # Linux preview: Inter instead of Impact/Arial
FLAG = [(20, 20, 20), (221, 0, 0), (255, 206, 0)]
SKY = [(0.0, (16, 6, 36)), (0.45, (92, 18, 104)), (0.75, (255, 46, 136)), (1.0, (255, 150, 60))]


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    if (FONTS / name).exists():
        return ImageFont.truetype(str(FONTS / name), size)
    if "impact" in name:
        return ImageFont.truetype(str(FALLBACK / "InterDisplay-Black.otf"), int(size * 0.8))
    return ImageFont.truetype(str(FALLBACK / "Inter-Bold.otf"), size)


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


def skyline_sides(d, w, horizon, scale, seed):
    """Skyline that stays low in the middle so the sun stays visible."""
    rnd = random.Random(seed)
    x = 0
    while x < w:
        bw = int(rnd.randint(40, 100) * scale)
        dist = abs((x + bw / 2) - w / 2) / (w / 2)          # 0 centre .. 1 edge
        bh = int(rnd.randint(140, 380) * scale * (0.15 + 0.85 * dist ** 1.4))
        d.rectangle([x, horizon - bh, x + bw, horizon], fill=(30, 8, 50))
        d.line([(x, horizon - bh), (x + bw, horizon - bh)], fill=(255, 90, 170), width=2)  # neon roof edge
        for wy in range(horizon - bh + 10, horizon - 8, int(22 * scale)):
            for wx in range(x + 6, x + bw - 6, int(16 * scale)):
                if rnd.random() < 0.22:
                    d.rectangle([wx, wy, wx + 5 * scale, wy + 8 * scale], fill=(255, 200, 130))
        x += bw + int(rnd.randint(0, 10) * scale)


def grid(img, horizon):
    """Neon perspective grid on the ground."""
    w, h = img.size
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    col = (255, 60, 170, 150)
    for k in range(-12, 13):
        d.line([(w / 2 + k * 18, horizon), (w / 2 + k * 170, h)], fill=col, width=2)
    y, step = horizon + 6, 6
    while y < h:
        d.line([(0, y), (w, y)], fill=col, width=2)
        step *= 1.35
        y += step
    glow = layer.filter(ImageFilter.GaussianBlur(4))
    img.paste(Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB"))
    img.paste(Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB"))


def gradient_text(img, xy, text, f, top, bottom, outline=(255, 255, 255), glow=(255, 40, 160)):
    w, h = img.size
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).text(xy, text, font=f, fill=255, anchor="mm")
    x0, y0, x1, y1 = mask.getbbox()
    # outer neon glow from a thick outline
    glow_mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(glow_mask).text(xy, text, font=f, fill=255, anchor="mm", stroke_width=14)
    img.paste(glow, (0, 0), glow_mask.filter(ImageFilter.GaussianBlur(20)))
    # hard drop shadow + dark outline
    sh = Image.new("L", img.size, 0)
    ImageDraw.Draw(sh).text((xy[0] + 10, xy[1] + 12), text, font=f, fill=255, anchor="mm", stroke_width=10)
    img.paste((20, 4, 34), (0, 0), sh)
    ol = Image.new("L", img.size, 0)
    ImageDraw.Draw(ol).text(xy, text, font=f, fill=255, anchor="mm", stroke_width=10)
    img.paste((20, 4, 34), (0, 0), ol)
    ol2 = Image.new("L", img.size, 0)
    ImageDraw.Draw(ol2).text(xy, text, font=f, fill=255, anchor="mm", stroke_width=5)
    img.paste(outline, (0, 0), ol2)
    # sunset-gradient fill with a chrome horizon line through the middle
    fill = gradient(w, y1 - y0, [(0, top), (0.5, (255, 240, 200)), (0.52, (255, 120, 60)), (1, bottom)])
    full = Image.new("RGB", img.size)
    full.paste(fill, (0, y0))
    img.paste(full, (0, 0), mask)


def rounded_flag(img, cx, y, width, height):
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([cx - width // 2 - 5, y - 5, cx + width // 2 + 5, y + height + 5], radius=12, fill=(20, 4, 34))
    m = Image.new("L", img.size, 0)
    ImageDraw.Draw(m).rounded_rectangle([cx - width // 2, y, cx + width // 2, y + height], radius=8, fill=255)
    bars = Image.new("RGB", img.size)
    bd = ImageDraw.Draw(bars)
    for i, c in enumerate(FLAG):
        bd.rectangle([cx - width // 2, y + i * height // 3, cx + width // 2, y + (i + 1) * height // 3], fill=c)
    img.paste(bars, (0, 0), m)


def vignette(img):
    w, h = img.size
    m = Image.new("L", img.size, 0)
    ImageDraw.Draw(m).ellipse([w * 0.08, h * 0.08, w * 0.92, h * 0.92], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(70))
    dark = Image.new("RGB", img.size, (8, 2, 18))
    img.paste(Image.composite(img, dark, m))


def banner() -> None:
    # 2560x1440; YouTube only guarantees the centre 1546x423 (y 508-931) is visible on every device.
    w, h, horizon = 2560, 1440, 1000
    img = gradient(w, h, [(t * horizon / h, c) for t, c in SKY] + [(1.0, (255, 150, 60))])
    sun(img, w // 2, horizon, 380)
    water(img, horizon)
    grid(img, horizon)
    d = ImageDraw.Draw(img)
    skyline_sides(d, w, horizon, 1.0, seed=7)
    palm(d, (160, h + 40), 900, 0.18)
    palm(d, (330, h + 60), 640, 0.22)
    palm(d, (2400, h + 40), 920, -0.2)
    palm(d, (2230, h + 60), 620, -0.24)
    gradient_text(img, (w // 2, 640), "GTA DEUTSCHLAND", font("impact.ttf", 170),
                  top=(255, 255, 255), bottom=(255, 40, 140))
    rounded_flag(img, w // 2, 768, 620, 30)
    glow_text(img, (w // 2, 868), "NEWS  •  GAMEPLAY  •  CLIPS  •  TIPPS & TRICKS",
              font("arialbd.ttf", 54), glow=(255, 120, 60), radius=10)
    img.save(OUT / "banner.png")


def profile() -> None:
    s, horizon = 800, 545
    img = gradient(s, s, [(t * horizon / s, c) for t, c in SKY] + [(1.0, (255, 150, 60))])
    sun(img, s // 2, horizon, 250)
    water(img, horizon)
    grid(img, horizon)
    d = ImageDraw.Draw(img)
    skyline_sides(d, s, horizon, 0.5, seed=3)
    palm(d, (-10, s + 40), 470, 0.18)
    palm(d, (810, s + 40), 470, -0.18)
    vignette(img)
    gradient_text(img, (s // 2, 315), "GTA", font("impact.ttf", 330),
                  top=(255, 255, 255), bottom=(255, 40, 140))
    rounded_flag(img, s // 2, 470, 300, 42)
    img.save(OUT / "profile.png")


if __name__ == "__main__":
    banner()
    profile()
    print("saved banner.png and profile.png")
