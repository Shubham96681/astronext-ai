"""Jagannath hero — do NOT key black/white globally (black faces + white eyes).

Use mix-blend-mode: lighten in jagannath-store-page.css instead.
This script only validates the asset exists.
"""
from __future__ import annotations

import os
import sys

SRC = os.path.join(
    os.path.dirname(__file__), '..', 'src', 'assets', 'generated', 'hero-jagannath-triad.png'
)


if __name__ == '__main__':
    if not os.path.isfile(SRC):
        sys.exit(f'missing {SRC}')
    print('ok', SRC, os.path.getsize(SRC))
