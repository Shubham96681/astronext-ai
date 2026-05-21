"""Sync brand SVGs from logo-assets zip and emit header-cropped variants."""
from __future__ import annotations

import re
import shutil
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ZIP_DIR = ROOT / "logo-assets" / "Astronext Logo"
OUT_DIR = ROOT / "src" / "assets" / "logos"

# Zip filename -> deployed asset name
MAP = {
    "ASTRO NEXT 1.svg": "logo-light.svg",
    "ASTRO NEXT 2.svg": "logo-purple.svg",
    "ASTRO NEXT 3.svg": "logo-on-dark.svg",
    "ASTRO NEXT 4.svg": "logo-footer.svg",
    "ASTRO NEXT 5.svg": "logo-light-gold.svg",
}


def path_bbox(svg_path: Path, pad: float = 10) -> tuple[float, float, float, float]:
    tree = ET.parse(svg_path)
    xs, ys = [], []
    for el in tree.getroot().iter():
        d = el.get("d")
        if not d:
            continue
        nums = [float(x) for x in re.findall(r"[-+]?(?:\d*\.\d+|\d+)", d)]
        for i, n in enumerate(nums):
            (xs if i % 2 == 0 else ys).append(n)
    x0, y0 = min(xs) - pad, min(ys) - pad
    return x0, y0, max(xs) - x0 + 2 * pad, max(ys) - y0 + 2 * pad


def apply_viewbox(src_text: str, x: float, y: float, w: float, h: float) -> str:
    vb = f'viewBox="{x:.2f} {y:.2f} {w:.2f} {h:.2f}"'
    return re.sub(r'viewBox="[^"]*"', vb, src_text, count=1)


def sync() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for zip_name, out_name in MAP.items():
        src = ZIP_DIR / zip_name
        if not src.exists():
            print(f"skip missing {zip_name}")
            continue
        text = src.read_text(encoding="utf-8")
        x, y, w, h = path_bbox(src)
        cropped = apply_viewbox(text, x, y, w, h)
        (OUT_DIR / out_name).write_text(cropped, encoding="utf-8")
        header_name = out_name.replace("logo-", "logo-header-")
        (OUT_DIR / header_name).write_text(cropped, encoding="utf-8")
        print(f"{out_name}: {w:.0f}x{h:.0f} aspect={w/h:.2f}")


if __name__ == "__main__":
    sync()
