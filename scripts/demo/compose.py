"""Write optimized webp files for each public example: the finished Story keepsake (<id>.webp, 540x960) and the original
photo as the 'before' picture (<id>-photo.webp, 360x640). Pillow re-encodes both, so no EXIF/GPS/ICC is carried over.
Usage: python3 -I compose.py SRC_DIR RAW_DIR OUT_DIR examples.json   (dev tool, not shipped). Limit: each file <= 90 KB."""
import io, json, sys
from PIL import Image, ImageOps

src, raw, out, spec = sys.argv[1:5]
MAX = 84 * 1024


def save(img, path):
    for q in range(84, 25, -3):
        buf = io.BytesIO()
        img.save(buf, "WEBP", quality=q, method=6)
        if buf.tell() <= MAX:
            break
    open(path, "wb").write(buf.getvalue())
    print(path.split("/")[-1], img.size, buf.tell(), "q", q)


def framed(photo, pl, w, h):
    """The photo cropped exactly as the renderer frames it (cover fit, zoom, pan), with no overlay: the 'before' picture."""
    zoom, px, py = pl.get("zoom", 1), pl.get("panX", 0), pl.get("panY", 0)
    scale = max(w / photo.width, h / photo.height) * zoom
    cw, ch = w / scale, h / scale  # crop size in source pixels
    sx = max(0, photo.width - cw) / 2
    sy = max(0, photo.height - ch) / 2
    left, top = sx * (1 + px), sy * (1 + py)
    return photo.crop((round(left), round(top), round(left + cw), round(top + ch))).resize((w, h), Image.LANCZOS)


for ex in json.load(open(spec)):
    card = Image.open(f"{raw}/{ex['id']}.png").convert("RGB")
    save(card.resize((540, 960), Image.LANCZOS), f"{out}/{ex['id']}.webp")
    photo = ImageOps.exif_transpose(Image.open(f"{src}/{ex['photo']}")).convert("RGB")
    save(framed(photo, ex.get("placement", {}), 360, 640), f"{out}/{ex['id']}-photo.webp")
