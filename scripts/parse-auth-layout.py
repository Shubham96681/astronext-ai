from pathlib import Path
import re

lines = Path(r"D:\astronext3\Jagannath-Store (1).svg").read_text(encoding="utf-8", errors="ignore").splitlines()

# Collect elements with approximate y in hero text zone
for i, l in enumerate(lines):
    if len(l) > 400:
        continue
    ym = re.search(r'\by="([\d.]+)"', l)
    if not ym:
        continue
    y = float(ym.group(1))
    if 200 <= y <= 370 and ("rect" in l or "fill=\"#0272DA\"" in l or "fill=\"#1C064F\"" in l):
        print(f"{i+1}: {l}")
