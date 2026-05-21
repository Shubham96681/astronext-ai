from pathlib import Path
from PIL import Image

src = Path(r"D:\astronext3\src\assets\auth-reference.png")
out = Path(r"D:\astronext3\src\assets\auth-zodiac-art.png")

im = Image.open(src)
# 1440 reference — zodiac wheel center-left (approx from SVG paths x~330-450, y~500)
w, h = im.size
# crop box: left portion of hero grid
box = (int(w * 0.08), int(h * 0.22), int(w * 0.52), int(h * 0.72))
cropped = im.crop(box)
cropped.save(out, optimize=True)
print("saved", out, cropped.size)
