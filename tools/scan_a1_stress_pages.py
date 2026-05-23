"""Scan A1.pdf for Table A-1 stress grid pages (OCR)."""
from __future__ import annotations

import sys
from pathlib import Path

import easyocr
import fitz

from build_table_k1 import extract_stress_section

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "tables" / "A1.pdf"

SECTIONS = [
    ("carbon", [40, 65, 100, 150, 200, 250, 300, 325, 350, 375]),
    ("alloy", [40, 65, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375]),
]


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 35
    end = int(sys.argv[2]) if len(sys.argv) > 2 else 95

    reader = easyocr.Reader(["en"], gpu=False, verbose=False)
    doc = fitz.open(PDF)

    for pi in range(start, min(end, len(doc))):
        best = None
        for name, temps in SECTIONS:
            lines = extract_stress_section(reader, doc, pi, temps)
            if len(lines) > (best[1] if best else 0):
                best = (name, len(lines), temps, lines)
        if best and best[1] >= 8:
            name, count, temps, lines = best
            print(f"page {pi}: {name} {count} rows, temps={len(temps)}")
            for ln in sorted(lines.keys())[:3]:
                print(f"  line {ln}: {lines[ln]}")


if __name__ == "__main__":
    main()
