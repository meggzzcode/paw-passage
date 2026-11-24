#!/usr/bin/env python3
"""Makes the 1200x630 share image for each town 'things to do' article: public/share-towns/<state>-<town>.jpg,
cropped from src/assets/things-<town>.jpg (same crop-to-detail logic as make-share-images.py).
Run from the repo root after changing a town hero:  python3 scripts/make-town-share-images.py"""
import importlib.util, os
from PIL import Image

spec = importlib.util.spec_from_file_location("share", os.path.join(os.path.dirname(os.path.abspath(__file__)), "make-share-images.py"))
share = importlib.util.module_from_spec(spec); spec.loader.exec_module(share)

TOWNS = {
    "georgia": ["blue-ridge", "ellijay", "helen", "dahlonega"],
    "california": ["san-diego", "santa-barbara", "monterey", "mendocino"],
}
os.makedirs("public/share-towns", exist_ok=True)
for state, towns in TOWNS.items():
    for t in towns:
        img = share.cover(Image.open(f"src/assets/things-{t}.jpg").convert("RGB"), 1200, 630)
        img.save(f"public/share-towns/{state}-{t}.jpg", quality=82, optimize=True)
        print("made", state, t)
