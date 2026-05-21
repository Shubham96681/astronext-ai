"""Crop logo SVGs to tight viewBox for header use."""
import re
import xml.etree.ElementTree as ET
from pathlib import Path

LOGOS = Path(__file__).resolve().parents[1] / "src" / "assets" / "logos"
NAMES = ["logo-light.svg", "logo-purple.svg", "logo-light-gold.svg", "logo-on-dark.svg"]


def path_bbox(svg_path: Path) -> tuple[float, float, float, float]:
    tree = ET.parse(svg_path)
    xs, ys = [], []
    for el in tree.getroot().iter():
        d = el.get("d")
        if not d:
            continue
        nums = [float(x) for x in re.findall(r"[-+]?(?:\d*\.\d+|\d+)", d)]
        for i, n in enumerate(nums):
            (xs if i % 2 == 0 else ys).append(n)
    pad = 12
    x0, y0 = min(xs) - pad, min(ys) - pad
    return x0, y0, max(xs) - x0 + 2 * pad, max(ys) - y0 + 2 * pad


def crop_svg(src: Path, dest: Path) -> None:
    x, y, w, h = path_bbox(src)
    text = src.read_text(encoding="utf-8")
    text = re.sub(
        r'viewBox="[^"]*"',
        f'viewBox="{x:.2f} {y:.2f} {w:.2f} {h:.2f}"',
        text,
        count=1,
    )
    dest.write_text(text, encoding="utf-8")
    print(f"{dest.name}: viewBox={x:.1f} {y:.1f} {w:.1f} {h:.1f} aspect={w/h:.2f}")


def main() -> None:
    for name in NAMES:
        src = LOGOS / name
        if not src.exists():
            continue
        stem = src.stem.replace("logo-", "")
        dest = LOGOS / f"logo-header-{stem}.svg"
        crop_svg(src, dest)


if __name__ == "__main__":
    main()
