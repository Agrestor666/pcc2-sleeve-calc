"""Debug OCR rows on an A1.pdf page."""
import re
import sys
from pathlib import Path

import easyocr
import fitz
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]


def ocr_page(reader, page, scale=3.0):
    mat = fitz.Matrix(scale, scale)
    pix = page.get_pixmap(matrix=mat)
    img = np.array(Image.frombytes("RGB", [pix.width, pix.height], pix.samples))
    out = []
    for bbox, text, conf in reader.readtext(img):
        if conf < 0.25:
            continue
        x = (bbox[0][0] + bbox[2][0]) / 2
        y = (bbox[0][1] + bbox[2][1]) / 2
        out.append((y, x, text.strip(), conf))
    return out


def cluster_rows(items, y_tol=18):
    if not items:
        return []
    sorted_items = sorted(items, key=lambda t: t[0])
    rows, current_y, current = [], sorted_items[0][0], []
    for y, x, text, _ in sorted_items:
        if abs(y - current_y) > y_tol:
            if current:
                rows.append(sorted(current, key=lambda t: t[0]))
            current, current_y = [], y
        current.append((x, text))
    if current:
        rows.append(sorted(current, key=lambda t: t[0]))
    return rows


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    pi = int(sys.argv[1]) if len(sys.argv) > 1 else 38
    reader = easyocr.Reader(["en"], gpu=False, verbose=False)
    doc = fitz.open(ROOT / "A1.pdf")
    rows = cluster_rows(ocr_page(reader, doc[pi]))
    print(f"Page {pi}: {len(rows)} OCR rows")
    for row in rows:
        nums = []
        line = None
        for x, t in row:
            t = t.replace(",", "")
            if not re.fullmatch(r"\d+", t):
                continue
            n = int(t)
            if line is None and x < 200 and 1 <= n <= 99:
                line = n
            else:
                nums.append(n)
        if len(nums) >= 6:
            print(f"  line={line} nums={nums[:14]} len={len(nums)}")


if __name__ == "__main__":
    main()
