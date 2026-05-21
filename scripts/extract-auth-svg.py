"""Extract auth panel reference PNG from Jagannath-Store (1).svg."""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(r"D:\astronext3")
SVG = ROOT / "Jagannath-Store (1).svg"
OUT = ROOT / "src" / "assets" / "auth-reference.png"

# Try cairosvg
try:
    import cairosvg

    cairosvg.svg2png(url=str(SVG), write_to=str(OUT), output_width=1440)
    print("saved", OUT, OUT.stat().st_size)
    sys.exit(0)
except Exception as e:
    print("cairosvg failed:", e)

# Fallback: inkscape CLI
for cmd in [
    ["inkscape", str(SVG), "--export-type=png", f"--export-filename={OUT}", "-w", "1440"],
    ["magick", "convert", str(SVG), str(OUT)],
]:
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        if OUT.exists():
            print("saved via", cmd[0], OUT.stat().st_size)
            sys.exit(0)
    except Exception as ex:
        print(cmd[0], "failed", ex)

print("No renderer available")
