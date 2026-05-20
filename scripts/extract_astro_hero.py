import base64
import os
import re

svg_path = r'd:\astronext3\Astrologer-pAGE.svg'
out_dir = r'd:\astronext3\src\assets\generated'
os.makedirs(out_dir, exist_ok=True)

with open(svg_path, 'r', encoding='utf-8', errors='ignore') as f:
    data = f.read()

# pattern10 (hero hands visual at x=795) references image4
m = re.search(
    r'<image id="image4_404_4246"[^>]+xlink:href="(data:image/[^"]+)"',
    data,
)
if not m:
    raise SystemExit('image4 not found')

href = m.group(1)
header, b64 = href.split(',', 1)
ext = 'png' if 'png' in header else 'jpg'
out = os.path.join(out_dir, f'astrologers-hero-hands.{ext}')
with open(out, 'wb') as f:
    f.write(base64.b64decode(b64))
print(f'wrote {out} ({os.path.getsize(out)} bytes)')
