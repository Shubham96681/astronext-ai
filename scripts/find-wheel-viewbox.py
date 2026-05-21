import re
from pathlib import Path

import cairosvg

ROOT = Path(__file__).resolve().parent.parent
SVG = ROOT / "kundalipatra.svg"
text = SVG.read_text(encoding="utf-8", errors="ignore")

for vb in ["850 160 500 400", "880 180 460 380", "900 200 420 340", "820 130 540 460"]:
    patched = re.sub(
        r'<svg([^>]*)\s+width="1440"\s+height="5156"\s+viewBox="0 0 1440 5156"',
        f'<svg\\1 width="500" height="400" viewBox="{vb}"',
        text,
        count=1,
    )
    tmp = ROOT / "scripts/_tmp.svg"
    out = ROOT / f"scripts/_test-{vb.replace(' ', '-')}.png"
    tmp.write_text(patched, encoding="utf-8")
    cairosvg.svg2png(url=str(tmp), write_to=str(out), output_width=900)
    print(vb, out.stat().st_size)
