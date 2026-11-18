#!/usr/bin/env python3
"""Makes a share image (1200x630, for Facebook/iMessage/Slack) and a Pinterest pin (1000x1500) for every guide.
Run from the repo root after adding or retitling a guide:  python3 scripts/make-share-images.py
Output: public/share/<slug>.jpg and public/pins/<slug>.jpg. Photos are the guide's own hero photo (src/assets)."""
import glob, os, re, textwrap
from PIL import Image, ImageDraw, ImageFont, ImageFilter

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
GREEN = (38, 70, 59)

def guides():
    for f in sorted(glob.glob("content/guides/*.md")):
        t = open(f).read().split("---", 2)[1]
        g = lambda k: (re.search(rf"^{k}:\s*(.+)$", t, re.M) or [None, ""])[1].strip().strip('"\'')
        yield g("slug") or os.path.basename(f)[:-3], g("title"), g("heroImage"), g("status")
    for f in sorted(glob.glob("src/content/guides/*.ts")):
        if f.endswith("index.ts"): continue
        s = open(f).read()
        g = lambda k: (re.search(rf'"?{k}"?:\s*"((?:[^"\\]|\\.)*)"', s) or [None, ""])[1]
        yield g("slug"), g("title").replace('\\"', '"'), g("heroImage"), g("status")

def cover(img, w, h):
    """Scale to cover w x h, then slide the crop window to where the picture has the most detail (the dog), not the centre."""
    r = max(w / img.width, h / img.height)
    img = img.resize((int(img.width * r) + 1, int(img.height * r) + 1), Image.LANCZOS)
    xmax, ymax = img.width - w, img.height - h
    if xmax <= 0 and ymax <= 0: return img.crop((0, 0, w, h))
    small = img.convert("L").filter(ImageFilter.FIND_EDGES).resize((max(1, img.width // 8), max(1, img.height // 8)))
    sw, sh = small.size; px = small.load()
    col = [sum(px[x, y] for y in range(sh)) for x in range(sw)]
    row = [sum(px[x, y] for x in range(sw)) for y in range(sh)]
    def best(vals, win, span):
        win = max(1, win // 8); span = max(0, span // 8)
        if span == 0: return 0
        scores = [(sum(vals[i:i + win]), i) for i in range(span + 1)]
        return max(scores)[1] * 8
    x = min(xmax, best(col, w, xmax)) if xmax > 0 else 0
    y = min(ymax, best(row, h, ymax)) if ymax > 0 else 0
    return img.crop((x, y, x + w, y + h))

def draw_text(img, title, w, h, big):
    d = ImageDraw.Draw(img, "RGBA")
    band_h = int(h * (0.4 if big else 0.42))
    d.rectangle((0, h - band_h, w, h), fill=GREEN + ((255,) if big else (235,)))
    size = 64 if big else 52
    font = ImageFont.truetype(FONT, size)
    lines = textwrap.wrap(title, width=22 if big else 30)[:5 if big else 4]
    y = h - band_h + int(band_h * 0.14)
    for ln in lines:
        d.text((int(w * 0.07), y), ln, font=font, fill=(250, 246, 238)); y += int(size * 1.22)
    brand = ImageFont.truetype(SANS, 26 if big else 24)
    d.text((int(w * 0.07), h - 56), "PAWS & PASSAGE  |  pawsandpassage.com", font=brand, fill=(214, 196, 160))

os.makedirs("public/share", exist_ok=True); os.makedirs("public/pins", exist_ok=True)
n = 0
for slug, title, hero, status in guides():
    if not slug or not title or not hero: continue
    src = f"src/assets/{hero}.jpg"
    if not os.path.exists(src): print("missing hero", hero, "for", slug); continue
    base = Image.open(src).convert("RGB")
    a = cover(base, 1200, 630); draw_text(a, title, 1200, 630, False); a.save(f"public/share/{slug}.jpg", quality=82, optimize=True)
    b = Image.new("RGB", (1000, 1500), GREEN); b.paste(cover(base, 1000, 900), (0, 0)); draw_text(b, title, 1000, 1500, True); b.save(f"public/pins/{slug}.jpg", quality=82, optimize=True)
    n += 1
print("made", n, "share images and pins")
