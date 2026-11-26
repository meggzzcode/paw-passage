#!/usr/bin/env python3
"""Generates the PWA icons in public/icons/ from the site's paw mark (src/components/shell/Logo.tsx geometry).
Original brand art, no third-party artwork. Run: python3 scripts/pwa-icons.py (needs Pillow). Commit the small PNGs only."""
import math, os
from PIL import Image, ImageDraw

PINE = (35, 77, 68)      # #234D44, the site's theme-color
CREAM = (247, 240, 225)  # #f7f0e1, --pp-paper
SS = 4                   # supersampling factor for smooth edges
# LogoMark ellipses (cx, cy, rx, ry) in its 32x32 box; the paw spans x 7.5-24.5, y 6.9-23.5
PAW = [(16, 19.5, 5, 4), (9.5, 14, 2, 2.6), (14, 9.5, 2, 2.6), (18.8, 9.5, 2, 2.6), (22.5, 14, 2, 2.6)]
CX, CY, W = 16.0, 15.2, 17.0  # paw centre and width in the 32 box

def render(size, paw_frac, corner_frac, out):
    s = size * SS
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if corner_frac is None:
        d.rectangle([0, 0, s, s], fill=PINE + (255,))
    else:
        d.rounded_rectangle([0, 0, s - 1, s - 1], radius=s * corner_frac, fill=PINE + (255,))
    k = s * paw_frac / W
    for cx, cy, rx, ry in PAW:
        x, y = s / 2 + (cx - CX) * k, s / 2 + (cy - CY) * k
        d.ellipse([x - rx * k, y - ry * k, x + rx * k, y + ry * k], fill=CREAM + (255,))
    img = img.resize((size, size), Image.LANCZOS)
    if corner_frac is None:
        img = img.convert("RGB")
    img.save(out, optimize=True)
    print(out, os.path.getsize(out), "bytes")

here = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
os.makedirs(here, exist_ok=True)
render(192, 0.46, 0.2, f"{here}/icon-192.png")
render(512, 0.46, 0.2, f"{here}/icon-512.png")
render(512, 0.34, None, f"{here}/maskable-512.png")   # paw inside the 80% safe zone, full-bleed background
render(180, 0.46, None, f"{here}/apple-touch-icon.png")  # iOS rounds the corners itself
