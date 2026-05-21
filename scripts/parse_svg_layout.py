import re
from pathlib import Path

def rects(path: Path, limit=80):
    text = path.read_text(encoding="utf-8", errors="ignore")[:500000]
    found = []
    for m in re.finditer(
        r'<rect[^>]*x="([^"]+)"[^>]*y="([^"]+)"[^>]*width="([^"]+)"[^>]*height="([^"]+)"[^>]*(?:rx="([^"]+)")?[^>]*(?:fill="([^"]+)")?',
        text,
    ):
        x, y, w, h = map(float, m.group(1, 2, 3, 4))
        rx = m.group(5)
        fill = m.group(6) or ""
        if w * h > 5000:
            found.append((y, x, w, h, rx, fill))
    found.sort()
    print(path.name, "large rects:")
    for item in found[:limit]:
        print("  y=%.0f x=%.0f w=%.0f h=%.0f rx=%s fill=%s" % item)

root = Path(__file__).resolve().parents[1]
rects(root / "Astrologer-Details.svg")
print()
rects(root / "Details-Read-More.svg")
