"""Extract one embedded image from a Figma SVG by id (line-by-line, low memory)."""
import base64
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def extract(svg_name: str, image_id: str, out_name: str) -> None:
    path = ROOT / svg_name
    out = ROOT / "src/assets/generated" / out_name
    out.parent.mkdir(parents=True, exist_ok=True)
    needle = f'id="{image_id}"'
    with path.open(encoding="utf-8", errors="ignore") as f:
        for line in f:
            if needle not in line or "xlink:href=" not in line:
                continue
            m = re.search(r'xlink:href="(data:image/[^"]+)"', line)
            if not m:
                continue
            header, b64 = m.group(1).split(",", 1)
            ext = "png" if "png" in header else "jpg"
            out = out.with_suffix(f".{ext}")
            out.write_bytes(base64.b64decode(b64))
            print(f"wrote {out} ({out.stat().st_size} bytes)")
            return
    raise SystemExit(f"{image_id} not found in {svg_name}")


if __name__ == "__main__":
    jobs = [
        ("Astrologer-Details.svg", "image1_404_4385", "astrologer-detail/portrait-main"),
        ("Astrologer-Details.svg", "image4_404_4385", "astrologer-detail/avatar-1"),
        ("Astrologer-Details.svg", "image6_404_4385", "astrologer-detail/avatar-2"),
        ("Astrologer-Details.svg", "image7_404_4385", "astrologer-detail/avatar-3"),
        ("Details-Read-More.svg", "image2_404_4544", "jg-detail/product-hero"),
    ]
    for svg, iid, out in jobs:
        try:
            extract(svg, iid, out)
        except SystemExit as e:
            print("skip", out, e)
