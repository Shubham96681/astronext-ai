"""Extract layout tokens from Jagannath-Store (1).svg auth section."""
import re
from pathlib import Path

svg = Path(r"D:\astronext3\Jagannath-Store (1).svg").read_text(encoding="utf-8", errors="ignore")

# Slice around form panel (lines ~6200-6300 in file - search by y coords)
for m in re.finditer(r"<(rect|path|circle|line|ellipse)[^>]+>", svg):
    tag = m.group(0)
    ym = re.search(r'\by="(\d+)"', tag)
    if not ym:
        continue
    y = int(ym.group(1))
    if 60 <= y <= 800 and ("fill=" in tag or "stroke=" in tag):
        if len(tag) < 280:
            print(tag)

print("\n--- unique fills in y 300-750 ---")
fills = set()
for m in re.finditer(r"<[^>]+>", svg):
    tag = m.group(0)
    ym = re.search(r'\by="(\d+)"', tag)
    if ym and 300 <= int(ym.group(1)) <= 750:
        for f in re.findall(r'fill="([^"]+)"', tag):
            fills.add(f)
for f in sorted(fills):
    print(f)
