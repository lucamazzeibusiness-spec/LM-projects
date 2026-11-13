"""Bolder profile-picture concepts for GTA Deutschland. Rendered at 2x, saved at 800x800."""
import math
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops

S = 1600
from pathlib import Path

OUT = Path(__file__).parent / "out"
OUT.mkdir(exist_ok=True)


def _font(*candidates):
    for c in candidates:
        if Path(c).exists():
            return c
    raise SystemExit(f"no font found: {candidates}")


FD = "/usr/share/fonts/opentype/inter/"
BLACKI = _font(FD + "InterDisplay-BlackItalic.otf", "C:/Windows/Fonts/ariblk.ttf")
BLACK = _font(FD + "InterDisplay-Black.otf", "C:/Windows/Fonts/ariblk.ttf")
INK = (14, 3, 24)
FLAG = [(20, 20, 20), (221, 0, 0), (255, 206, 0)]


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def radial(size, inner, outer, cx=0.5, cy=0.5, power=1.0):
    img = Image.new("RGB", (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            d = math.hypot(x / size - cx, y / size - cy) / 0.71
            px[x, y] = lerp(inner, outer, min(1, d ** power))
    return img


def vgrad(w, h, stops):
    img = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(1, h - 1)
        for (t0, c0), (t1, c1) in zip(stops, stops[1:]):
            if t0 <= t <= t1:
                d.line([(0, y), (w, y)], fill=lerp(c0, c1, (t - t0) / max(1e-6, t1 - t0)))
                break
    return img


def sunburst(img, cx, cy, rays, c1, c2, alpha=90):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    R = S * 1.2
    for k in range(rays):
        a0 = 2 * math.pi * k / rays
        a1 = a0 + math.pi / rays
        col = c1 if k % 2 == 0 else c2
        d.polygon([(cx, cy), (cx + R * math.cos(a0), cy + R * math.sin(a0)), (cx + R * math.cos(a1), cy + R * math.sin(a1))],
                  fill=col + (alpha,))
    img.alpha_composite(layer)


def star_points(cx, cy, r, inner=0.45):
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * inner
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return pts


def wanted_stars(img, cy, r, gap, filled=5):
    d = ImageDraw.Draw(img)
    total = 5 * 2 * r + 4 * gap
    x = S / 2 - total / 2 + r
    for i in range(5):
        pts = star_points(x, cy, r)
        d.polygon(star_points(x + 8, cy + 10, r * 1.18), fill=INK + (255,))
        d.polygon(star_points(x, cy, r * 1.18), fill=INK + (255,))
        d.polygon(pts, fill=(255, 214, 40, 255) if i < filled else (60, 50, 70, 255))
        x += 2 * r + gap


def chunky_text(img, xy, text, font, fill_stops, outline=(255, 255, 255), glow=(255, 40, 150), depth=22, depth_col=(70, 10, 80)):
    w, h = img.size
    def mask(stroke=0, off=(0, 0)):
        m = Image.new("L", (w, h), 0)
        ImageDraw.Draw(m).text((xy[0] + off[0], xy[1] + off[1]), text, font=font, fill=255, anchor="mm", stroke_width=stroke)
        return m
    g = mask(46).filter(ImageFilter.GaussianBlur(40))
    img.paste(glow + (255,), (0, 0), g)
    for i in range(depth, 0, -2):  # 3D extrusion
        img.paste(depth_col + (255,), (0, 0), mask(26, (i, i)))
    img.paste(INK + (255,), (0, 0), mask(26))
    img.paste(outline + (255,), (0, 0), mask(13))
    fm = mask()
    x0, y0, x1, y1 = fm.getbbox()
    grad = vgrad(w, y1 - y0, fill_stops)
    full = Image.new("RGBA", (w, h))
    full.paste(grad, (0, y0))
    img.paste(full, (0, 0), fm)
    # chrome shine line
    shine = Image.new("L", (w, h), 0)
    ImageDraw.Draw(shine).rectangle([0, y0 + (y1 - y0) * 0.47, w, y0 + (y1 - y0) * 0.5], fill=170)
    img.paste((255, 255, 255, 255), (0, 0), ImageChops.multiply(shine, fm))


def palm(d, base, height, lean, color):
    bx, by = base
    pts = []
    for i in range(41):
        t = i / 40
        x = bx + lean * height * t * t
        y = by - height * t
        r = height * (0.04 - 0.02 * t)
        d.ellipse([x - r, y - r, x + r, y + r], fill=color)
        pts.append((x, y))
    tx, ty = pts[-1]
    for k in range(8):
        ang = math.radians(-165 + k * 44 + lean * 15)
        L = height * 0.45
        top, bot = [], []
        for i in range(21):
            t = i / 20
            x = tx + math.cos(ang) * L * t
            y = ty + math.sin(ang) * L * t + (L * 0.5) * t * t
            wd = height * 0.05 * math.sin(math.pi * t)
            nx, ny = -math.sin(ang), math.cos(ang)
            top.append((x + nx * wd, y + ny * wd))
            bot.append((x - nx * wd, y - ny * wd))
        d.polygon(top + bot[::-1], fill=color)


def flag_ribbon(img, cy, width, height, text=None):
    d = ImageDraw.Draw(img)
    x0, x1 = S / 2 - width / 2, S / 2 + width / 2
    tail = height * 0.55
    for side in (-1, 1):  # ribbon tails
        bx = x0 if side < 0 else x1
        poly = [(bx, cy - height / 2 + 30), (bx + side * tail * 1.4, cy - height / 2 + 30),
                (bx + side * tail * 0.9, cy + 30), (bx + side * tail * 1.4, cy + height / 2 + 30), (bx, cy + height / 2 + 30)]
        d.polygon(poly, fill=(120, 0, 0, 255), outline=INK + (255,))
    d.rounded_rectangle([x0 - 14, cy - height / 2 - 14, x1 + 14, cy + height / 2 + 14], radius=22, fill=INK + (255,))
    m = Image.new("L", img.size, 0)
    ImageDraw.Draw(m).rounded_rectangle([x0, cy - height / 2, x1, cy + height / 2], radius=14, fill=255)
    bars = Image.new("RGBA", img.size)
    bd = ImageDraw.Draw(bars)
    for i, c in enumerate(FLAG):
        bd.rectangle([x0, cy - height / 2 + i * height / 3, x1, cy - height / 2 + (i + 1) * height / 3], fill=c + (255,))
    img.paste(bars, (0, 0), m)
    if text:
        f = ImageFont.truetype(BLACK, int(height * 0.62))
        d.text((S / 2, cy), text, font=f, fill=(255, 255, 255), anchor="mm", stroke_width=10, stroke_fill=INK)


def ring(img, color, width=34):
    d = ImageDraw.Draw(img)
    m = 40
    glow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse([m, m, S - m, S - m], outline=color + (255,), width=width + 30)
    img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(24)))
    d.ellipse([m, m, S - m, S - m], outline=color + (255,), width=width)


def finish(img, name):
    img = img.convert("RGB").resize((800, 800), Image.LANCZOS)
    img.save(OUT / f"{name}.png")
    return img


def concept_a():
    """Wanted-level emblem: sunburst, chrome GTA, five stars, flag ribbon."""
    img = radial(S, (120, 20, 110), (10, 2, 22), cy=0.55, power=0.9).convert("RGBA")
    sunburst(img, S / 2, S * 0.56, 24, (255, 60, 150), (255, 150, 60), alpha=55)
    sun = Image.new("RGBA", img.size, (0, 0, 0, 0))
    r = 470
    sg = vgrad(2 * r, 2 * r, [(0, (255, 236, 120)), (0.6, (255, 120, 70)), (1, (255, 40, 130))])
    sm = Image.new("L", (2 * r, 2 * r), 0)
    smd = ImageDraw.Draw(sm)
    smd.ellipse([0, 0, 2 * r, 2 * r], fill=255)
    y, gap = int(r * 1.05), 10
    while y < 2 * r:
        smd.rectangle([0, y, 2 * r, y + gap], fill=0)
        y += gap + 40
        gap += 8
    sun.paste(sg, (S // 2 - r, int(S * 0.56) - r), sm)
    img.alpha_composite(sun)
    d = ImageDraw.Draw(img)
    palm(d, (230, S + 60), 1050, 0.2, INK + (255,))
    palm(d, (S - 230, S + 60), 1050, -0.2, INK + (255,))
    wanted_stars(img, S * 0.27, 86, 40)
    chunky_text(img, (S / 2, S * 0.56), "GTA", ImageFont.truetype(BLACKI, 560),
                [(0, (255, 255, 255)), (0.48, (255, 235, 190)), (0.5, (255, 110, 60)), (1, (255, 30, 140))])
    flag_ribbon(img, S * 0.82, 760, 150, "DEUTSCH")
    ring(img, (255, 46, 150))
    return finish(img, "pfp_a_wanted")


def concept_b():
    """Miami teal/pink: hot-pink GTA on teal, stars, flag bar."""
    img = radial(S, (0, 190, 200), (0, 40, 70), cy=0.45, power=1.1).convert("RGBA")
    sunburst(img, S / 2, S * 0.5, 20, (255, 255, 255), (0, 120, 150), alpha=38)
    d = ImageDraw.Draw(img)
    palm(d, (180, S + 80), 1100, 0.18, (6, 30, 50, 255))
    palm(d, (S - 180, S + 80), 1100, -0.18, (6, 30, 50, 255))
    wanted_stars(img, S * 0.27, 86, 40)
    chunky_text(img, (S / 2, S * 0.55), "GTA", ImageFont.truetype(BLACKI, 560),
                [(0, (255, 210, 240)), (0.48, (255, 120, 200)), (0.5, (255, 40, 150)), (1, (190, 0, 110))],
                outline=(255, 255, 255), glow=(255, 255, 255), depth_col=(0, 50, 80))
    flag_ribbon(img, S * 0.82, 760, 150, "DEUTSCH")
    ring(img, (255, 255, 255))
    return finish(img, "pfp_b_miami")


def concept_c():
    """Monogram: huge GD with a wanted star, sunset fill."""
    img = radial(S, (60, 10, 80), (8, 2, 16), power=1.0).convert("RGBA")
    sunburst(img, S / 2, S / 2, 28, (255, 60, 150), (120, 20, 140), alpha=60)
    chunky_text(img, (S / 2, S * 0.5), "GD", ImageFont.truetype(BLACKI, 720),
                [(0, (255, 255, 255)), (0.48, (255, 235, 190)), (0.5, (255, 110, 60)), (1, (255, 30, 140))])
    d = ImageDraw.Draw(img)
    d.polygon(star_points(S * 0.79, S * 0.25, 150, 0.45), fill=INK + (255,))
    d.polygon(star_points(S * 0.78, S * 0.24, 125, 0.45), fill=(255, 214, 40, 255))
    flag_ribbon(img, S * 0.83, 620, 110)
    ring(img, (255, 46, 150))
    return finish(img, "pfp_c_monogram")


if __name__ == "__main__":
    a, b, c = concept_a(), concept_b(), concept_c()
    sheet = Image.new("RGB", (3 * 420 + 40, 420 + 160), (32, 32, 36))
    for i, im in enumerate((a, b, c)):
        m = Image.new("L", (400, 400), 0)
        ImageDraw.Draw(m).ellipse([0, 0, 400, 400], fill=255)
        sheet.paste(im.resize((400, 400), Image.LANCZOS), (20 + i * 420, 10), m)
        for j, sz in enumerate((96, 48)):  # how it looks tiny
            sm = Image.new("L", (sz, sz), 0)
            ImageDraw.Draw(sm).ellipse([0, 0, sz, sz], fill=255)
            sheet.paste(im.resize((sz, sz), Image.LANCZOS), (20 + i * 420 + 120 + j * 120, 440), sm)
    sheet.save(OUT / "pfp_compare.png")
    print("ok")
