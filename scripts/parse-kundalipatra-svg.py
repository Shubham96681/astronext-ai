"""Extract layout metadata from kundalipatra.svg."""
from __future__ import annotations

import re
from pathlib import Path

SVG = Path(__file__).resolve().parent.parent / "kundalipatra.svg"
text = SVG.read_text(encoding="utf-8", errors="ignore")

print("size:", len(text))
print("viewBox 1440 x 5156")

# All text nodes (tspan included)
for m in re.finditer(
    r"<text[^>]*?(?:x=\"([^\"]+)\")?[^>]*?(?:y=\"([^\"]+)\")?[^>]*>(.*?)</text>",
    text,
    re.DOTALL,
):
    raw = re.sub(r"<[^>]+>", "", m.group(3)).strip()
    if raw:
        print(f"text x={m.group(1)} y={m.group(2)}: {raw[:100]}")

# Buttons / key rects
for m in re.finditer(
    r'<rect x="(\d+)" y="(\d+)" width="(\d+)" height="(\d+)"[^>]*fill="#([^"]+)"',
    text,
):
    x, y, w, h, color = m.groups()
    if int(h) >= 35 and int(w) >= 100:
        print(f"rect {x},{y} {w}x{h} #{color}")

# Section y markers from large text
print("\n--- fill colors used ---")
colors = sorted(set(re.findall(r'fill="#([0-9A-Fa-f]{6})"', text)))
print(len(colors), colors[:30])
