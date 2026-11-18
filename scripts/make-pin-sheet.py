#!/usr/bin/env python3
"""Regenerates docs/pinterest-pins.csv from the PUBLISHED guides: one command, one row per public guide.
Run from the repo root after make-share-images.py:  python3 scripts/make-pin-sheet.py
Title = guide title (max 100), description = the guide's seoDescription (max 500): both come from guide metadata, nothing is added.
Destination = guide URL + UTM parameters (utm_source=pinterest&utm_medium=social&utm_campaign=<board-slug>&utm_content=<pin-slug>).
Board = BOARDS mapping below; a guide not in the map falls back by category (Gear -> Dog Travel Gear, else Vacation Rental Planning)
and is flagged on screen so you can add it to the map. Use --check to fail (exit 1) when the CSV is out of date or a row breaks a limit."""
import csv, importlib.util, io, os, re, sys

spec = importlib.util.spec_from_file_location("share", os.path.join(os.path.dirname(os.path.abspath(__file__)), "make-share-images.py"))
share = importlib.util.module_from_spec(spec); spec.loader.exec_module(share)

SITE = "https://www.pawsandpassage.com"
OUT = "docs/pinterest-pins.csv"
BOARDS = {  # guide slug -> ONE primary board (see docs/PINTEREST-SETUP.md for the table and boards still waiting for content)
    "airbnb-pet-damage-charge-after-checkout": "Vacation Rental Planning",
    "breed-restrictions-at-vacation-rentals": "Vacation Rental Planning",
    "bringing-a-dog-to-a-no-pets-rental": "Vacation Rental Planning",
    "can-dogs-go-in-a-rental-pool-or-hot-tub": "Vacation Rental Planning",
    "can-you-leave-a-dog-alone-in-a-vacation-rental": "Vacation Rental Planning",
    "pet-friendly-listing-red-flags": "Vacation Rental Planning",
    "pet-friendly-vacation-rental-checklist": "Vacation Rental Planning",
    "puppy-at-a-vacation-rental": "Vacation Rental Planning",
    "vacation-rental-secure-fenced-yard": "Vacation Rental Planning",
    "vacation-rental-with-a-reactive-dog": "Vacation Rental Planning",
    "if-your-dog-gets-loose-on-a-trip": "Dog-Friendly Vacations",
    "christmas-week-in-a-cabin-with-a-dog": "Cabin Vacations",
    "new-years-eve-with-a-dog-in-a-vacation-rental": "Cabin Vacations",
    "dog-friendly-cabin-packing-list": "Cabin Vacations",
    "dog-car-safety-harness-and-crate-guide": "Dog Travel Gear",
    "dog-travel-first-aid-kit-guide": "Dog Travel Gear",
    "portable-dog-fence-and-playpen-guide-for-rentals": "Dog Travel Gear",
    "vacation-rental-with-a-senior-dog": "Senior Dog Travel",
    "vacation-rentals-that-welcome-large-dogs": "Large Dog Travel",
    "vacation-rentals-with-no-dog-weight-limit": "Large Dog Travel",
    "how-many-dogs-can-you-bring-to-a-vacation-rental": "Multiple Dog Travel",
    "how-vacation-rental-pet-fees-work": "Travel Cost Planning",
    "vacation-rentals-with-no-pet-fee": "Travel Cost Planning",
    "what-a-dog-really-costs-on-a-vacation-rental": "Travel Cost Planning",
}
FIELDS = ["pin_image_url", "title", "description", "destination_url", "board"]

def slugify(s): return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

def rows():
    out, notes = [], []
    for g in share.public_guides():
        slug = g["slug"]
        board = BOARDS.get(slug)
        if not board:
            board = "Dog Travel Gear" if g["category"] == "Gear" else "Vacation Rental Planning"
            notes.append(f"{slug}: not in BOARDS, defaulted to '{board}' (add it to scripts/make-pin-sheet.py)")
        utm = f"utm_source=pinterest&utm_medium=social&utm_campaign={slugify(board)}&utm_content={slug}"
        out.append({"pin_image_url": f"{SITE}/pins/{slug}.jpg", "title": g["title"], "description": g["seoDescription"],
                    "destination_url": f"{SITE}/guides/{slug}?{utm}", "board": board})
    return out, notes

def problems(rs):
    p = []
    for r in rs:
        if len(r["title"]) > 100: p.append(f"title over 100 chars: {r['pin_image_url']}")
        if not r["description"] or len(r["description"]) > 500: p.append(f"description empty or over 500 chars: {r['pin_image_url']}")
        if not os.path.exists("public/pins/" + r["pin_image_url"].rsplit("/", 1)[1]): p.append(f"pin image missing: {r['pin_image_url']}")
    return p

def render(rs):
    buf = io.StringIO(newline="")
    w = csv.DictWriter(buf, fieldnames=FIELDS, lineterminator="\n"); w.writeheader(); w.writerows(rs)
    return buf.getvalue()

if __name__ == "__main__":
    rs, notes = rows()
    for n in notes: print("NOTE:", n)
    bad = problems(rs)
    for b in bad: print("PROBLEM:", b)
    text = render(rs)
    if "--check" in sys.argv:
        current = open(OUT).read() if os.path.exists(OUT) else ""
        if bad or current != text:
            print("docs/pinterest-pins.csv is out of date or invalid: run python3 scripts/make-pin-sheet.py"); sys.exit(1)
        print("ok", len(rs), "rows"); sys.exit(0)
    if bad: sys.exit(1)
    open(OUT, "w").write(text)
    print("wrote", OUT, len(rs), "rows")
