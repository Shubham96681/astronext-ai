import base64
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def rects(path: Path) -> None:
    text = path.read_text(encoding="utf-8", errors="ignore")[:800000]
    found = []
    for m in re.finditer(r"<rect ", text):
        chunk = text[m.start() : m.start() + 400]
        x = re.search(r'x="([^"]+)"', chunk)
        y = re.search(r'y="([^"]+)"', chunk)
        w = re.search(r'width="([^"]+)"', chunk)
        h = re.search(r'height="([^"]+)"', chunk)
        fill = re.search(r'fill="([^"]+)"', chunk)
        rx = re.search(r'rx="([^"]+)"', chunk)
        if not all([x, y, w, h]):
            continue
        xf, yf, wf, hf = float(x.group(1)), float(y.group(1)), float(w.group(1)), float(h.group(1))
        if wf * hf < 8000:
            continue
        found.append((yf, xf, wf, hf, rx.group(1) if rx else "", fill.group(1) if fill else ""))
    found.sort()
    print(path.name, "large rects:")
    for item in found[:40]:
        print("  y=%.0f x=%.0f w=%.0f h=%.0f rx=%s fill=%s" % item)


def extract_pattern_images(svg_name: str, out_dir: Path) -> None:
    p = ROOT / svg_name
    data = p.read_text(encoding="utf-8", errors="ignore")
    out_dir.mkdir(parents=True, exist_ok=True)
    # image definitions inside defs
    imgs = re.findall(
        r'<image[^>]+id="([^"]+)"[^>]+(?:width="([^"]+)")?[^>]+(?:height="([^"]+)")?[^>]+xlink:href="(data:image/[^"]+)"',
        data,
    )
    print(svg_name, "defs images:", len(imgs))
    for i, (id_, w, h, href) in enumerate(imgs):
        header, b64 = href.split(",", 1)
        ext = "png" if "png" in header else "jpg"
        safe = re.sub(r"[^a-z0-9]+", "-", id_.lower()).strip("-")[:48]
        out = out_dir / f"{safe}.{ext}"
        out.write_bytes(base64.b64decode(b64))
        print(f"  {out.name} {w}x{h} ({out.stat().st_size})")

    # map pattern fills to rects
    patterns = re.findall(r'fill="url\(#([^)]+)\)"', data[:200000])
    print("patterns used:", list(dict.fromkeys(patterns))[:15])


if __name__ == "__main__":
    rects(ROOT / "Astrologer-Details.svg")
    print()
    rects(ROOT / "Details-Read-More.svg")
    print()
    extract_pattern_images("Astrologer-Details.svg", ROOT / "src/assets/generated/astrologer-detail")
    print()
    extract_pattern_images("Details-Read-More.svg", ROOT / "src/assets/generated/jg-detail")
