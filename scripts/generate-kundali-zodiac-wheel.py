"""Install user-provided zodiac wheel or render from kundalipatra.svg."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SVG = ROOT / "kundalipatra.svg"
SRC_OUT = ROOT / "src/assets/auth-zodiac-wheel-source.png"
FINAL_OUT = ROOT / "src/assets/auth-zodiac-wheel.png"

# Verified: wheel only, 12 segments, one Leo (not 720/95 wide crop)
VIEWBOX = "820 130 540 460"
OUTPUT_WIDTH = 1080


def patch_viewbox(svg_text: str) -> str:
    return re.sub(
        r'<svg([^>]*)\s+width="1440"\s+height="5156"\s+viewBox="0 0 1440 5156"',
        f'<svg\\1 width="540" height="460" viewBox="{VIEWBOX}"',
        svg_text,
        count=1,
    )


def render(patched: str, dest: Path) -> None:
    import cairosvg

    tmp = ROOT / "scripts" / "_kundali-wheel-export.svg"
    tmp.write_text(patched, encoding="utf-8")
    cairosvg.svg2png(url=str(tmp), write_to=str(dest), output_width=OUTPUT_WIDTH)
    print("rendered", dest, dest.stat().st_size)


def make_transparent(src: Path, dest: Path) -> None:
    from PIL import Image

    im = Image.open(src).convert("RGBA")
    w, h = im.size
    px = im.load()
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            # Pink hero wash + white → transparent
            if lum >= 198 or (r > 210 and g > 175 and b > 175):
                px[x, y] = (0, 0, 0, 0)
            else:
                alpha = int(min(255, max(0, (255 - lum) * 1.25)))
                px[x, y] = (28, 28, 32, alpha) if alpha >= 10 else (0, 0, 0, 0)
    bbox = im.getbbox()
    if bbox:
        pad = 20
        bbox = (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(w, bbox[2] + pad),
            min(h, bbox[3] + pad),
        )
        im = im.crop(bbox)
    im.save(dest, "PNG", optimize=True)
    print("saved", dest, im.size)


USER_ASSET = (
    Path(__file__).resolve().parents[1]
    / "assets/c__Users_shubh_AppData_Roaming_Cursor_User_workspaceStorage_7ddfc112d5b296ca664924da05d6a482_images_image-04e4e62e-b205-4bef-bc03-a30198289c4e.png"
)


if __name__ == "__main__":
    if USER_ASSET.exists():
        import shutil

        shutil.copy(USER_ASSET, SRC_OUT)
        make_transparent(SRC_OUT, FINAL_OUT)
        raise SystemExit(0)
    if not SVG.exists():
        sys.exit(f"missing {SVG}")
    patched = patch_viewbox(SVG.read_text(encoding="utf-8", errors="ignore"))
    render(patched, SRC_OUT)
    make_transparent(SRC_OUT, FINAL_OUT)
