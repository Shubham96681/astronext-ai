"""Chroma-key meditation cutout from magenta studio backdrop -> transparent PNG."""
from collections import deque
from PIL import Image, ImageFilter
import os

SRC = r'C:\Users\shubh\.cursor\projects\d-astronext3\assets\meditation-woman-source.png'
OUT = r'd:\astronext3\src\assets\generated\meditation-woman.png'


def feather_alpha(im: Image.Image, radius: int = 2) -> Image.Image:
    r, g, b, a = im.split()
    a = a.filter(ImageFilter.GaussianBlur(radius))
    return Image.merge('RGBA', (r, g, b, a))


def is_backdrop(r: int, g: int, b: int) -> bool:
    if r > 140 and b > 140 and g < min(r, b) - 25:
        return True
    if r > 170 and b > 150 and g < 140:
        return True
    return False


def flood_key(im: Image.Image) -> Image.Image:
    im = im.convert('RGBA')
    px = im.load()
    w, h = im.size
    visited = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    for x in range(w):
        q.append((x, 0))
        q.append((x, h - 1))
    for y in range(h):
        q.append((0, y))
        q.append((w - 1, y))

    while q:
        x, y = q.popleft()
        if x < 0 or y < 0 or x >= w or y >= h or visited[y][x]:
            continue
        visited[y][x] = True
        r, g, b, a = px[x, y]
        if not is_backdrop(r, g, b):
            continue
        px[x, y] = (r, g, b, 0)
        q.append((x + 1, y))
        q.append((x - 1, y))
        q.append((x, y + 1))
        q.append((x, y - 1))

    return im


def despill_magenta(im: Image.Image) -> Image.Image:
    px = im.load()
    w, h = im.size

    def neighbors_transparent(x: int, y: int) -> bool:
        for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and px[nx, ny][3] < 20:
                return True
        return False

    for _ in range(2):
        for y in range(h):
            for x in range(w):
                r, g, b, a = px[x, y]
                if a < 12:
                    continue
                magenta_tint = r > 90 and b > 90 and g < 105 and (r + b) > g * 2.2
                if magenta_tint and (a < 245 or neighbors_transparent(x, y)):
                    px[x, y] = (r, g, b, 0)
                    continue
                if a < 250 and b > g and b > r - 15:
                    nr = int(r * 0.98)
                    ng = min(255, int(g * 1.06))
                    nb = int(b * 0.62)
                    px[x, y] = (nr, ng, nb, a)
    return im


def trim_transparent(im: Image.Image, pad: int = 12) -> Image.Image:
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
    if not os.path.exists(SRC):
        raise SystemExit(f'Missing source: {SRC}')
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    im = flood_key(Image.open(SRC))
    im = despill_magenta(im)
    r, g, b, a = im.split()
    a = a.filter(ImageFilter.MinFilter(3))
    im = Image.merge('RGBA', (r, g, b, a))
    im = feather_alpha(im, 1)
    im = trim_transparent(im)
    im.save(OUT, optimize=True)
    print(f'Saved {OUT} ({im.size[0]}x{im.size[1]})')


if __name__ == '__main__':
    main()
