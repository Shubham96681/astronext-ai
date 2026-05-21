"""Export cosmic geometry band from kundali-patra-reference.png (1440 artboard)."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
REF = ROOT / "src/assets/generated/kundali/kundali-patra-reference.png"
OUT = ROOT / "src/assets/generated/kundali/kundali-cosmic-art.png"

im = Image.open(REF)
# Sacred geometry only (no headline copy above)
box = (180, 1040, 1260, 1580)
crop = im.crop(box)
crop.save(OUT, optimize=True)
print("saved", OUT, crop.size)
