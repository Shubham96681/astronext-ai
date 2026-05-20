import re
from pathlib import Path

svg = Path(r"D:\astronext3\Astrologer-pAGE.svg").read_text(encoding="utf-8", errors="ignore")

# rects with fill colors (sample)
for m in re.finditer(r'<rect[^>]+>', svg[:800000]):
    tag = m.group(0)
    if 'fill="#' in tag or 'stroke="#' in tag:
        if any(k in tag for k in ['width="', 'height="', 'x=', 'y=']):
            print(tag[:200])

print("\n--- fills count ---")
fills = re.findall(r'fill="(#[0-9A-Fa-f]{3,8})"', svg)
from collections import Counter
for c, n in Counter(fills).most_common(25):
    print(c, n)

# image tags
imgs = re.findall(r'<image[^>]+>', svg[:2000000])
print("\nimages", len(imgs))
for im in imgs[:5]:
    print(im[:180])
