"""Remove white background from astronext-logo.png -> transparent PNG."""
from PIL import Image, ImageFilter
import os

LOGO = r'd:\astronext3\src\assets\astronext-logo.png'


def feather_alpha(im: Image.Image, radius: int = 1) -> Image.Image:
    r, g, b, a = im.split()
    a = a.filter(ImageFilter.GaussianBlur(radius))
    return Image.merge('RGBA', (r, g, b, a))


def remove_white_background(im: Image.Image, lum_min: int = 232, sat_max: int = 38) -> Image.Image:
    """Key near-white / low-saturation pixels; keeps gold & purple ink."""
    im = im.convert('RGBA')
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = (r + g + b) / 3
            sat = max(r, g, b) - min(r, g, b)
            if lum >= lum_min and sat <= sat_max:
                # Soft edge: fade alpha as pixel approaches paper white
                if lum >= 248 and sat <= 18:
                    px[x, y] = (r, g, b, 0)
                else:
                    fade = min(1.0, (lum - lum_min) / max(1, 248 - lum_min))
                    fade *= max(0.0, 1.0 - sat / max(1, sat_max))
                    new_a = int(a * (1.0 - fade))
                    px[x, y] = (r, g, b, new_a)
    return feather_alpha(im, 1)


def trim_transparent(im: Image.Image, pad: int = 8) -> Image.Image:
    bbox = im.getbbox()
    if not bbox:
        return im
    left, top, right, bottom = bbox
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(im.width, right + pad)
    bottom = min(im.height, bottom + pad)
    return im.crop((left, top, right, bottom))


def main() -> None:
    if not os.path.exists(LOGO):
        raise SystemExit(f'Missing logo: {LOGO}')
    im = Image.open(LOGO)
    im = remove_white_background(im)
    im = trim_transparent(im)
    im.save(LOGO, optimize=True)
    print(f'Saved transparent logo: {LOGO} ({im.size[0]}x{im.size[1]})')


if __name__ == '__main__':
    main()
