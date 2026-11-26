"""Write optimized webp files for each example: the finished keepsake (<id>.webp) and the original photo as a small
'before' thumbnail (<id>-photo.webp). Usage: python3 -I compose.py SRC_DIR RAW_DIR OUT_DIR examples.json
(dev tool, not shipped). Limits: each file <= 90 KB (we aim for 80 KB)."""
import io, json, sys
from PIL import Image, ImageOps

src, raw, out, spec = sys.argv[1:5]
MAX = 80 * 1024


def save(img, path):
    for q in range(84, 25, -4):
        buf = io.BytesIO()
        img.save(buf, "WEBP", quality=q, method=6)
        if buf.tell() <= MAX:
            break
    open(path, "wb").write(buf.getvalue())
    print(path.split("/")[-1], img.size, buf.tell(), "q", q)


for ex in json.load(open(spec)):
    card = Image.open(f"{raw}/{ex['id']}.png").convert("RGB")
    ch = 700
    card = card.resize((round(card.width * ch / card.height), ch), Image.LANCZOS)
    save(card, f"{out}/{ex['id']}.webp")
    photo = ImageOps.exif_transpose(Image.open(f"{src}/{ex['photos'][0]}")).convert("RGB")
    ph = 520
    pw = min(620, round(photo.width * ph / photo.height))
    photo = ImageOps.fit(photo, (pw, ph), Image.LANCZOS, centering=(0.5, 0.4))
    save(photo, f"{out}/{ex['id']}-photo.webp")
