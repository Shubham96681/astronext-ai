"""Slice assets from design-reference.png (2880 x 13630)."""
from PIL import Image
import os

W, H = 2880, 13630
ref = Image.open(r'd:\astronext3\design-reference.png')
out_dir = r'd:\astronext3\src\assets'
os.makedirs(out_dir, exist_ok=True)

def c(x1, y1, x2, y2):
    return ref.crop((int(x1 * W), int(y1 * H), int(x2 * W), int(y2 * H)))

slices = {
    'logo_cropped.png': (0.03, 0.006, 0.28, 0.028),
    'hero_woman.png': (0.50, 0.015, 0.98, 0.086),
    'zodiac_wheel.png': (0.52, 0.02, 0.90, 0.082),
    # Use PDF embed for phone — PNG slice from full page often captures wrong bands
    # 'whatsapp_phone.png': (0.34, 0.092, 0.66, 0.168),
    'meditation_woman.png': (0.0, 0.168, 0.44, 0.248),
    'puja_items.png': (0.22, 0.248, 0.78, 0.312),
    'app_mockup.png': (0.06, 0.518, 0.28, 0.578),
    'product_1.jpg': (0.04, 0.418, 0.26, 0.478),
    'product_2.jpg': (0.28, 0.418, 0.50, 0.478),
    'product_3.jpg': (0.52, 0.418, 0.74, 0.478),
    'product_4.jpg': (0.76, 0.418, 0.98, 0.478),
    'avatar_1.jpg': (0.10, 0.348, 0.18, 0.378),
    'avatar_2.jpg': (0.43, 0.348, 0.51, 0.378),
    'avatar_3.jpg': (0.76, 0.348, 0.84, 0.378),
}

for name, box in slices.items():
    im = c(*box)
    path = os.path.join(out_dir, name)
    if name.endswith('.jpg'):
        im.convert('RGB').save(path, quality=94)
    else:
        im.save(path, optimize=True)
    print(name, im.size)

# Hero woman with light bg keying
hero = c(0.50, 0.015, 0.98, 0.086).convert('RGBA')
px = hero.load()
for y in range(hero.height):
    for x in range(hero.width):
        r, g, b, a = px[x, y]
        if r > 235 and g > 215 and b > 220:
            px[x, y] = (r, g, b, 0)
hero.save(os.path.join(out_dir, 'hero_woman_transparent.png'))
print('hero_woman_transparent.png', hero.size)
