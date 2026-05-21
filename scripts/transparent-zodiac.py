"""Remove checkerboard — preserve full wheel, no edge clipping."""
from pathlib import Path
from PIL import Image

SRC = Path(__file__).resolve().parents[1] / "src" / "assets" / "auth-zodiac-wheel-source.png"
OUT = Path(__file__).resolve().parents[1] / "src" / "assets" / "auth-zodiac-wheel.png"


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    w, h = im.size
    px = im.load()

    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            lum = 0.299 * r + 0.587 * g + 0.114 * b

            # Only remove light checkerboard / white — never clip by circle
            if lum >= 176:
                px[x, y] = (0, 0, 0, 0)
            else:
                alpha = int(min(255, max(0, (255 - lum) * 1.15)))
                if alpha < 8:
                    px[x, y] = (0, 0, 0, 0)
                else:
                    px[x, y] = (20, 20, 24, alpha)

    bbox = im.getbbox()
    if bbox:
        pad = 28
        bbox = (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(w, bbox[2] + pad),
            min(h, bbox[3] + pad),
        )
        im = im.crop(bbox)

    im.save(OUT, "PNG", optimize=True)
    print(f"Saved {OUT} ({im.size[0]}x{im.size[1]})")


if __name__ == "__main__":
    main()
