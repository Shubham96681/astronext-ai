"""Rebuild hero-woman.png — remove studio backdrop via edge flood-fill."""
from PIL import Image, ImageFilter
from collections import deque
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, 'src', 'assets')
GENERATED = os.path.join(ROOT, 'src', 'assets', 'generated')
OUT = os.path.join(GENERATED, 'hero-woman.png')
CANONICAL = os.path.join(ASSETS, 'hero-woman-full.png')
SOURCE = os.path.join(ASSETS, 'hero-woman-source.png')


def color_dist(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2) ** 0.5


def is_neutral_studio(r: int, g: int, b: int) -> bool:
    """Gray/white AI studio backdrops only — never pink dress or skin."""
    lum = (r + g + b) / 3
    sat = max(r, g, b) - min(r, g, b)
    if sat > 24:
        return False
    if lum >= 192:
        return True
    return False


def is_seed_backdrop(r: int, g: int, b: int, *, edge: bool = False) -> bool:
    if is_neutral_studio(r, g, b):
        return True
    lum = (r + g + b) / 3
    sat = max(r, g, b) - min(r, g, b)
    if r > 248 and g > 244 and b > 246:
        return True
    if lum >= 200 and sat < 55 and r >= 175 and g >= 140 and b >= 140:
        if (r - g) < 40 and abs(g - b) < 35:
            return True
    if edge and lum >= 155 and r >= 190 and g >= 115 and b >= 95 and (r - g) >= 25:
        if sat < 100:
            return True
    return False


def is_similar_backdrop(r: int, g: int, b: int, ref: tuple[int, int, int]) -> bool:
    if is_neutral_studio(r, g, b) and is_neutral_studio(ref[0], ref[1], ref[2]):
        return color_dist((r, g, b), ref) < 35
    if not is_seed_backdrop(r, g, b):
        return False
    return color_dist((r, g, b), ref) < 42


def key_backdrop_flood(im: Image.Image) -> Image.Image:
    im = im.convert('RGBA')
    w, h = im.size
    px = im.load()
    visited = bytearray(w * h)
    q: deque[tuple[int, int]] = deque()

    def idx(x: int, y: int) -> int:
        return y * w + x

    # Seeds: all border pixels that look like backdrop
    for x in range(w):
        for y in (0, h - 1):
            r, g, b, a = px[x, y]
            if is_seed_backdrop(r, g, b, edge=True):
                i = idx(x, y)
                if not visited[i]:
                    visited[i] = 1
                    q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            r, g, b, a = px[x, y]
            if is_seed_backdrop(r, g, b, edge=True):
                i = idx(x, y)
                if not visited[i]:
                    visited[i] = 1
                    q.append((x, y))

    while q:
        x, y = q.popleft()
        r, g, b, a = px[x, y]
        ref = (r, g, b)
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if nx < 0 or ny < 0 or nx >= w or ny >= h:
                continue
            i = idx(nx, ny)
            if visited[i]:
                continue
            nr, ng, nb, na = px[nx, ny]
            if is_similar_backdrop(nr, ng, nb, ref):
                visited[i] = 1
                q.append((nx, ny))

    # Remove UI chip (dark blue) separately
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r < 55 and g < 55 and b > 65 and b < 140:
                visited[idx(x, y)] = 1

    out = im.copy()
    opx = out.load()
    for y in range(h):
        for x in range(w):
            if visited[idx(x, y)]:
                opx[x, y] = (0, 0, 0, 0)

    r, g, b, a = out.split()
    a = a.filter(ImageFilter.GaussianBlur(1))
    return Image.merge('RGBA', (r, g, b, a))


def resolve_source() -> str:
    if len(sys.argv) > 1 and os.path.exists(sys.argv[1]):
        return sys.argv[1]
    if os.path.exists(SOURCE):
        return SOURCE
    if os.path.exists(CANONICAL):
        return CANONICAL
    raise SystemExit('No hero source. Pass: python scripts/process-hero.py <image.png>')


def main() -> None:
    os.makedirs(GENERATED, exist_ok=True)
    src = resolve_source()
    im = key_backdrop_flood(Image.open(src))

    target_w = 1536
    if im.width != target_w:
        scale = target_w / im.width
        im = im.resize((target_w, int(im.height * scale)), Image.Resampling.LANCZOS)

    im.save(OUT, optimize=True)
    im.save(CANONICAL, optimize=True)
    print('source', src)
    print('saved', OUT, im.size)


if __name__ == '__main__':
    main()
