"""Builds the review sheets from the PNGs written by render-contact-sheet.mjs (dev tool, not shipped).
Usage: python3 -I make-sheets.py SRC_DIR OUT_DIR   (OUT_DIR holds full/ and manifest.json)
Writes OUT_DIR/contact-sheet-story.jpg (all families, Story) and OUT_DIR/sheets/<family>.jpg (original | story |
3 variations | square + portrait), plus 390px phone-size previews in OUT_DIR/phone/."""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont, ImageOps

src, out = sys.argv[1:3]
man = json.load(open(f"{out}/manifest.json"))
os.makedirs(f"{out}/sheets", exist_ok=True)
os.makedirs(f"{out}/phone", exist_ok=True)
BG = (250, 244, 232)
INK = (58, 44, 38)
try:
    F = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
    FS = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
except OSError:
    F = FS = ImageFont.load_default()


def full(name):
    return Image.open(f"{out}/full/{name}").convert("RGB")


def fit_w(img, w):
    return img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)


# --- all ten, Story: 5 columns x 2 rows of 360px tiles
W, GAP, LAB = 360, 14, 56
cols, rows = 5, 2
sheet = Image.new("RGB", (cols * (W + GAP) + GAP, rows * (640 + LAB + GAP) + GAP), BG)
d = ImageDraw.Draw(sheet)
for i, r in enumerate(man):
    x = GAP + (i % cols) * (W + GAP)
    y = GAP + (i // cols) * (640 + LAB + GAP)
    sheet.paste(fit_w(full(r["story"]), W), (x, y + LAB))
    d.text((x, y + 4), r["name"], font=F, fill=INK)
    d.text((x, y + 30), r["family"], font=FS, fill=INK)
sheet.save(f"{out}/contact-sheet-story.jpg", quality=90)

# --- per-family sheets
for r in man:
    orig = [fit_w(Image.open(f"{src}/{f}").convert("RGB") if not f.endswith("webp") else Image.open(f"{src}/{f}").convert("RGB"), W) for f in r["original"]]
    orig = [ImageOps.exif_transpose(i) for i in orig]
    tiles = [("Original photo" + ("s" if len(orig) > 1 else ""), None), ("Story 1080x1920", r["story"])]
    tiles += [(v["theme"], v["file"]) for v in r["variations"]]
    colw = W + GAP
    Wt = (len(tiles) + 1) * colw + GAP
    S = Image.new("RGB", (Wt, 830 + LAB + 2 * GAP + 40), BG)
    dd = ImageDraw.Draw(S)
    dd.text((GAP, 6), f"{r['name']} ({r['family']})  {r['note']}", font=F, fill=INK)
    y0 = 40 + LAB // 2
    for n, (lab, f) in enumerate(tiles):
        x = GAP + n * colw
        dd.text((x, 36), lab, font=FS, fill=INK)
        if f is None:
            yy = y0
            for o in orig:
                S.paste(o, (x, yy))
                yy += o.height + 8
        else:
            S.paste(fit_w(full(f), W), (x, y0))
    x = GAP + len(tiles) * colw
    dd.text((x, 36), "Square 1080x1080 / Portrait 1080x1350", font=FS, fill=INK)
    sq = fit_w(full(r["square"]), W)
    po = fit_w(full(r["portrait"]), W)
    S.paste(sq, (x, y0))
    S.paste(po, (x, y0 + sq.height + 8))
    S.save(f"{out}/sheets/{r['family']}.jpg", quality=90)
    fit_w(full(r["story"]), 390).save(f"{out}/phone/{r['family']}__story-390.jpg", quality=90)
print("ok", len(man))
