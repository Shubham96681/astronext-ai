"""Trim kundali-cosmic-art.png to visual bounds with even padding."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "src/assets/generated/kundali/kundali-cosmic-art.png"
PAD = 32


def trim(path: Path) -> None:
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3]
    mask = (alpha < 250) | (np.min(rgb, axis=2) < 248)
    ys, xs = np.where(mask)
    if not len(xs):
        return
    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())
    cropped = im.crop((x0, y0, x1 + 1, y1 + 1))
    cw, ch = cropped.size
    canvas = Image.new("RGBA", (cw + 2 * PAD, ch + 2 * PAD), (255, 255, 255, 255))
    canvas.paste(cropped, (PAD, PAD), cropped)
    flat = Image.new("RGB", canvas.size, (255, 255, 255))
    flat.paste(canvas, mask=canvas.split()[3])
    flat.save(path, optimize=True)
    print("trimmed", path, flat.size)


if __name__ == "__main__":
    # Flower-of-life band from design reference (no headline copy)
    user_ref = (
        Path(__file__).resolve().parents[1]
        / "assets/c__Users_shubh_AppData_Roaming_Cursor_User_workspaceStorage_7ddfc112d5b296ca664924da05d6a482_images_image-9b40926e-8593-4a60-92ff-0e0d17d21d43.png"
    )
    if not user_ref.exists():
        user_ref = (
            Path(r"C:\Users\shubh\.cursor\projects\d-astronext3\assets")
            / "c__Users_shubh_AppData_Roaming_Cursor_User_workspaceStorage_7ddfc112d5b296ca664924da05d6a482_images_image-9b40926e-8593-4a60-92ff-0e0d17d21d43.png"
        )
    if user_ref.exists():
        import shutil

        shutil.copy(user_ref, OUT)
    else:
        ref = ROOT / "src/assets/generated/kundali/kundali-patra-reference.png"
        if ref.exists():
            Image.open(ref).crop((400, 1020, 1040, 1540)).save(OUT)
    trim(OUT)
