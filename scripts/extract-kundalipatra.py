"""Render kundalipatra.svg to reference PNG and extract embedded raster assets."""
from __future__ import annotations

import base64
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SVG = ROOT / "kundalipatra.svg"
OUT_DIR = ROOT / "src" / "assets" / "generated" / "kundali"
REF = OUT_DIR / "kundali-patra-reference.png"

OUT_DIR.mkdir(parents=True, exist_ok=True)


def render_reference() -> None:
    try:
        import cairosvg

        cairosvg.svg2png(url=str(SVG), write_to=str(REF), output_width=1440)
        print("reference", REF, REF.stat().st_size)
        return
    except Exception as e:
        print("cairosvg failed:", e)

    for cmd in [
        ["inkscape", str(SVG), "--export-type=png", f"--export-filename={REF}", "-w", "1440"],
        ["magick", "convert", "-density", "144", str(SVG), str(REF)],
    ]:
        try:
            subprocess.run(cmd, check=True, capture_output=True)
            if REF.exists():
                print("reference via", cmd[0], REF.stat().st_size)
                return
        except Exception as ex:
            print(cmd[0], "failed", ex)
    sys.exit("No renderer available")


def extract_images() -> None:
    text = SVG.read_text(encoding="utf-8", errors="ignore")
    for m in re.finditer(
        r'<image id="(image\d+[^"]*)"[^>]*width="(\d+)" height="(\d+)"[^>]*xlink:href="data:image/([^;]+);base64,([^"]+)"',
        text,
    ):
        img_id, w, h, fmt, b64 = m.groups()
        data = base64.b64decode(b64)
        ext = "jpg" if fmt in ("jpeg", "jpg") else "png"
        out = OUT_DIR / f"{img_id}.{ext}"
        out.write_bytes(data)
        print("asset", out.name, w, h, len(data))


def slice_sections() -> None:
    from PIL import Image

    im = Image.open(REF)
    w, h = im.size
    # y positions from 1440 artboard scaled to actual height
    scale = h / 5156
    bands = {
        "hero": (0, int(680 * scale)),
        "main": (int(620 * scale), int(3300 * scale)),
        "promo": (int(2550 * scale), int(3400 * scale)),
        "footer": (int(4600 * scale), h),
    }
    for name, (y0, y1) in bands.items():
        crop = im.crop((0, y0, w, y1))
        out = OUT_DIR / f"kundali-{name}.png"
        crop.save(out, optimize=True)
        print("slice", out.name, crop.size)


if __name__ == "__main__":
    render_reference()
    extract_images()
    if REF.exists():
        slice_sections()
