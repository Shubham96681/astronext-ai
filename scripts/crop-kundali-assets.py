"""Crop key visuals from kundali-patra-reference.png (1440px wide)."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
REF = ROOT / "src/assets/generated/kundali/kundali-patra-reference.png"
OUT = ROOT / "src/assets/generated/kundali"

im = Image.open(REF)
# Coordinates on 1440×5156 artboard (verified against SVG rects)
crops = {
    # Cosmic geometry + watercolor (center of white band, ~y 980–1420 on artboard)
    "kundali-cosmic-art.png": (400, 1020, 1040, 1540),
    "kundali-chart-sample.png": (200, 2380, 1240, 3180),
    "kundali-waves-bg.png": (0, 680, 1440, 900),
}

for name, box in crops.items():
    crop = im.crop(box)
    crop.save(OUT / name, optimize=True)
    print(name, crop.size)
