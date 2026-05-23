"""OCR one A1.pdf page and print stress rows (debug)."""
import json
import sys
from pathlib import Path

# reuse build_table_k1 helpers
sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_table_k1 import extract_stress_section, ocr_page, cluster_rows  # noqa: E402

import easyocr
import fitz

ROOT = Path(__file__).resolve().parents[1]

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    pdf_name = sys.argv[1] if len(sys.argv) > 1 else "A1.pdf"
    page_idx = int(sys.argv[2]) if len(sys.argv) > 2 else 38
    temps = [40, 65, 100, 150, 200, 250, 300, 325, 350, 375]
    if len(sys.argv) > 3:
        temps = json.loads(sys.argv[3])

    reader = easyocr.Reader(["en"], gpu=False, verbose=False)
    doc = fitz.open(ROOT / pdf_name)
    lines = extract_stress_section(reader, doc, page_idx, temps)
    print(f"Page {page_idx}, temps {temps}, rows: {len(lines)}")
    for ln in sorted(lines.keys())[:15]:
        print(ln, lines[ln])
