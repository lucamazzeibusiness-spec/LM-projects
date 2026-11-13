"""Twitch branding in the GTA Deutschland synthwave style (same helpers as the YouTube art)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

import make_branding as g

OUT = g.OUT
TITLE_GRAD = dict(top=(255, 255, 255), bottom=(255, 40, 140))


def scene(w, h, horizon, sun_r, palms, scale=1.0, seed=7):
    img = g.gradient(w, h, [(t * horizon / h, c) for t, c in g.SKY] + [(1.0, (255, 150, 60))])
    g.sun(img, w // 2, horizon, sun_r)
    g.water(img, horizon)
    g.grid(img, horizon)
    d = ImageDraw.Draw(img)
    g.skyline_sides(d, w, horizon, scale, seed=seed)
    for p in palms:
        g.palm(d, *p)
    return img


def profile_banner():
    w, h, hz = 1200, 480, 360
    img = scene(w, h, hz, 170, [((60, h + 20), 380, 0.18), ((1140, h + 20), 390, -0.2)], 0.55)
    g.vignette(img)
    g.gradient_text(img, (w // 2, 170), "GTA DEUTSCHLAND", g.font("impact.ttf", 120), **TITLE_GRAD)
    g.rounded_flag(img, w // 2, 248, 300, 18)
    g.glow_text(img, (w // 2, 305), "GTA 6 LIVE  •  AUF DEUTSCH  •  XBOX", g.font("arialbd.ttf", 30), glow=(255, 120, 60), radius=8)
    img.save(OUT / "twitch_profile_banner_1200x480.png")


def offline():
    w, h, hz = 1920, 1080, 760
    img = scene(w, h, hz, 300, [((120, h + 30), 700, 0.18), ((320, h + 50), 520, 0.24),
                                ((1800, h + 30), 720, -0.2), ((1600, h + 50), 500, -0.26)], 0.9)
    g.vignette(img)
    g.gradient_text(img, (w // 2, 330), "GTA DEUTSCHLAND", g.font("impact.ttf", 190), **TITLE_GRAD)
    g.rounded_flag(img, w // 2, 448, 480, 26)
    # OFFLINE pill
    f = g.font("arialbd.ttf", 54)
    tw = int(ImageDraw.Draw(img).textlength("GERADE OFFLINE", font=f))
    pw, ph = tw + 150, 110
    pill = Image.new("RGBA", (pw, ph), (0, 0, 0, 0))
    pd = ImageDraw.Draw(pill)
    pd.rounded_rectangle([0, 0, pw - 1, ph - 1], radius=55, fill=(20, 4, 34, 235), outline=(255, 46, 136, 255), width=5)
    pd.ellipse([44, 37, 80, 73], fill=(140, 130, 150))
    pd.text((106, ph // 2), "GERADE OFFLINE", font=f, fill=(255, 255, 255), anchor="lm")
    img.paste(pill, (w // 2 - pw // 2, 520), pill)
    g.glow_text(img, (w // 2, 700), "Clips & Shorts auf YouTube: GTA Deutschland", g.font("arialbd.ttf", 46),
                glow=(255, 120, 60), radius=10)
    img.save(OUT / "twitch_offline_1920x1080.png")


def panel(label, fname):
    w, h = 320, 100
    img = scene(w, h * 3, int(h * 3 * 0.62), 70, [], 0.25, seed=len(label)).crop((0, h * 1.25, w, h * 2.25))
    img = img.resize((w, h))
    dark = Image.new("RGB", (w, h), (14, 3, 26))
    img = Image.blend(img, dark, 0.35)
    d = ImageDraw.Draw(img)
    g.glow_text(img, (w // 2, 44), label, g.font("impact.ttf", 46), glow=(255, 46, 136), radius=8)
    for i, c in enumerate(g.FLAG):
        d.rectangle([w // 2 - 50, 76 + i * 3, w // 2 + 50, 76 + (i + 1) * 3], fill=c)
    # rounded corners + neon edge
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, w - 1, h - 1], radius=14, fill=255)
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    out.paste(img, (0, 0), m)
    ImageDraw.Draw(out).rounded_rectangle([1, 1, w - 2, h - 2], radius=14, outline=(255, 46, 136, 255), width=3)
    out.save(OUT / f"panel_{fname}.png")


profile_banner()
offline()
for label, fn in [("ÜBER MICH", "ueber_mich"), ("YOUTUBE", "youtube"), ("ZEITPLAN", "zeitplan"),
                  ("SETUP", "setup"), ("REGELN", "regeln")]:
    panel(label, fn)
print("ok")
