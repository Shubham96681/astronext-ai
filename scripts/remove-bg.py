"""Remove solid backgrounds and feather edges for seamless hero/section photos."""
from PIL import Image, ImageFilter
import os

def feather_alpha(im: Image.Image, radius=2) -> Image.Image:
    r, g, b, a = im.split()
    a = a.filter(ImageFilter.GaussianBlur(radius))
    return Image.merge('RGBA', (r, g, b, a))

def solidify_foreground(im: Image.Image, min_alpha: int = 72) -> Image.Image:
    """Opaque interior — stops background SVG bleeding through soft PNG edges."""
    im = im.convert('RGBA')
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a >= min_alpha:
                px[x, y] = (r, g, b, 255)
            elif a < 24:
                px[x, y] = (r, g, b, 0)
    return im

def key_light_pink(im: Image.Image) -> Image.Image:
    """Deprecated for hero — use scripts/process-hero.py instead."""
    im = im.convert('RGBA')
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r > 248 and g > 244 and b > 246:
                px[x, y] = (r, g, b, 0)
            elif r > 242 and g > 235 and b > 238 and abs(r - g) < 12:
                px[x, y] = (r, g, b, 0)
    return feather_alpha(im, 1)

def key_white(im: Image.Image) -> Image.Image:
    im = im.convert('RGBA')
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r > 242 and g > 242 and b > 242:
                px[x, y] = (r, g, b, 0)
    return feather_alpha(im, 1)

def key_meditation_cosmic(im: Image.Image) -> Image.Image:
    """Remove dark starfield + baked-in gold chart from meditation stock composite."""
    im = im.convert('RGBA')
    px = im.load()
    w, h = im.size

    def is_background(r: int, g: int, b: int) -> bool:
        lum = (r + g + b) / 3
        # Deep navy / space
        if lum < 48 and b >= g - 8 and b >= r - 20:
            return True
        if r < 55 and g < 58 and b < 95:
            return True
        # Purple nebula haze in the box
        if r < 90 and g < 75 and b < 120 and lum < 85:
            return True
        # Gold wheel lines & labels (not skin — skin has more red, higher lum)
        if r > 105 and g > 75 and b < 115 and (r - b) > 35 and lum < 195:
            if r - g < 55:  # exclude very warm skin tones
                return True
        # Dim gold constellation dots
        if r > 90 and g > 70 and b < 90 and lum < 140 and (r - b) > 30:
            return True
        # Star specks on dark
        if lum > 140 and lum < 220 and abs(r - g) < 25 and abs(g - b) < 25:
            if r < 200:  # colored stars
                return True
        return False

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_background(r, g, b):
                px[x, y] = (r, g, b, 0)

    return feather_alpha(im, 2)

assets = r'd:\astronext3\src\assets\generated'

# hero-woman.png: run scripts/process-hero.py (do not key here — ruins pink dress)

if os.path.exists(f'{assets}/puja-items.png'):
    key_white(Image.open(f'{assets}/puja-items.png')).save(f'{assets}/puja-items.png')
    print('puja ok')

# meditation-woman.png: run scripts/process-meditation.py after regenerating source asset

for name in os.listdir(assets):
    if name.startswith('product-') and name.endswith('.png'):
        key_white(Image.open(os.path.join(assets, name))).save(os.path.join(assets, name))
        print('product', name)
