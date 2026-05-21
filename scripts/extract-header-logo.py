"""Extract header logo raster from kundalipatra.svg (pattern1 / image1)."""
import base64
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SVG = ROOT / "kundalipatra.svg"
OUT = ROOT / "src" / "assets" / "logos" / "logo-header.png"


def main() -> None:
    text = SVG.read_text(encoding="utf-8", errors="ignore")
    m = re.search(
        r'id="image1_404_21208"[^>]*xlink:href="data:image/png;base64,([^"]+)"',
        text,
    )
    if not m:
        raise SystemExit("image1 not found in kundalipatra.svg")
    OUT.write_bytes(base64.b64decode(m.group(1)))
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
