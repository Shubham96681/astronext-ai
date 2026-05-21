import re
from collections import Counter
from pathlib import Path

def analyze(path: Path, label: str) -> None:
    print("===", label, "===")
    head = path.read_text(encoding="utf-8", errors="ignore")[:200000]
    svg_open = re.search(r"<svg[^>]{0,800}>", head)
    if svg_open:
        print("svg tag:", svg_open.group(0)[:500])
    fills = re.findall(r'fill="(#[0-9A-Fa-f]{3,8})"', head)
    fills += re.findall(r"fill:'(#[0-9A-Fa-f]{3,8})'", head)
    strokes = re.findall(r'stroke="(#[0-9A-Fa-f]{3,8})"', head)
    print("top fills:", Counter(fills).most_common(20))
    print("top strokes:", Counter(strokes).most_common(10))
    fonts = re.findall(r'font-family="([^"]+)"', head)
    print("fonts:", Counter(fonts).most_common(12))
    sizes = re.findall(r'font-size="([^"]+)"', head)
    print("font-sizes:", Counter(sizes).most_common(20))
    texts = re.findall(r"<tspan[^>]*>([^<]{1,120})</tspan>", head)
    texts += re.findall(r"<text[^>]*>([^<]{1,120})</text>", head)
    unique = []
    for t in texts:
        t = t.strip()
        if t and t not in unique:
            unique.append(t)
    print("text (unique, first 40):", unique[:40])
    print()

root = Path(__file__).resolve().parents[1]
analyze(root / "Astrologer-Details.svg", "Astrologer-Details")
analyze(root / "Details-Read-More.svg", "Details-Read-More")
