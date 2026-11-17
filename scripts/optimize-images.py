#!/usr/bin/env python3
"""Resize/recompress hero photos in src/assets (Pillow).

Usage: python3 scripts/optimize-images.py   (run on ORIGINAL full-size files; re-running on
already optimized files is safe: widths <= 1600 are not resized, quality 80 is re-applied once more,
so keep the originals if you want to re-run with different settings).
Heroes: max 1600 px wide, JPEG q80, progressive, plus a 800 px "<name>-800.jpg" variant for phones.
Card images (*-card.jpg, 960 px, all under 220 KB) are left alone.
"""
import glob, os
from PIL import Image

HERO_MAX, PHONE_W, Q = 1600, 800, 80
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "assets")

MIN_Q, CAP = 78, 390 * 1024  # never below q78; step down from q80 only if a file is over the size cap

def save(img, path):
    for q in range(Q, MIN_Q - 1, -1):
        img.save(path, "JPEG", quality=q, optimize=True, progressive=True, subsampling="4:2:0")
        if os.path.getsize(path) <= CAP:
            break

for f in sorted(glob.glob(os.path.join(root, "*.jpg"))):
    name = os.path.basename(f)
    if name.endswith("-card.jpg") or name.endswith("-800.jpg"):
        continue
    img = Image.open(f).convert("RGB")
    w, h = img.size
    if w > HERO_MAX:
        img = img.resize((HERO_MAX, round(h * HERO_MAX / w)), Image.LANCZOS)
    save(img, f)
    small = img.resize((PHONE_W, round(img.size[1] * PHONE_W / img.size[0])), Image.LANCZOS)
    save(small, f[:-4] + "-800.jpg")
    print(name, img.size, os.path.getsize(f) // 1024, "KB;", "800w", os.path.getsize(f[:-4] + "-800.jpg") // 1024, "KB")
