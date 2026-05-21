"""
Extract ASME B31.3-2024 Table K-1 (SI) from K1.pdf via OCR.
Outputs tools/k1_extracted.json for review and feeds table-k1.js generation.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import easyocr
import fitz
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "K1.pdf"
OUT = ROOT / "tools" / "k1_extracted.json"


def ocr_page(reader, page, scale: float = 3.0) -> list[tuple[float, float, str, float]]:
    mat = fitz.Matrix(scale, scale)
    pix = page.get_pixmap(matrix=mat)
    img = np.array(Image.frombytes("RGB", [pix.width, pix.height], pix.samples))
    items: list[tuple[float, float, str, float]] = []
    for bbox, text, conf in reader.readtext(img):
        if conf < 0.25:
            continue
        x = (bbox[0][0] + bbox[2][0]) / 2
        y = (bbox[0][1] + bbox[2][1]) / 2
        items.append((y, x, text.strip(), conf))
    return items


def cluster_rows(items: list[tuple[float, float, str, float]], y_tol: float = 18) -> list[list[tuple[float, str]]]:
    if not items:
        return []
    sorted_items = sorted(items, key=lambda t: t[0])
    rows: list[list[tuple[float, str]]] = []
    current_y = sorted_items[0][0]
    current: list[tuple[float, str]] = []
    for y, x, text, _ in sorted_items:
        if abs(y - current_y) > y_tol:
            if current:
                rows.append(sorted(current, key=lambda t: t[0]))
            current = []
            current_y = y
        current.append((x, text))
    if current:
        rows.append(sorted(current, key=lambda t: t[0]))
    return rows


def parse_number(tok: str) -> int | None:
    tok = tok.replace(",", "").strip()
    if tok in ("...", "…", "—", "-", "–"):
        return None
    if re.fullmatch(r"\d{1,4}", tok):
        return int(tok)
    return None


def find_temp_header(row: list[tuple[float, str]]) -> tuple[list[int], dict[int, float]] | None:
    """Return temperature column list and x-position map."""
    texts = [t for _, t in row]
    joined = " ".join(texts).lower()
    if "mpa" not in joined and "temp" not in joined:
        return None

    temps: list[tuple[float, int]] = []
    for x, t in row:
        if t.lower() in ("to", "min", "min.", "temp.", "temp", "no.", "no_", "line", "max"):
            continue
        n = parse_number(t)
        if n is not None and n <= 650:
            temps.append((x, n))

    if len(temps) < 4:
        return None

    # filter: keep only the right-side cluster (allowable stress columns)
    xs = [x for x, _ in temps]
    if max(xs) - min(xs) < 200:
        return None

    temps.sort(key=lambda t: t[0])
    # drop line-no / max-temp columns on the left (typically < 300 px at scale 3)
    stress_temps = [(x, t) for x, t in temps if x > 280]
    if len(stress_temps) < 4:
        stress_temps = temps

    col_temps = [t for _, t in stress_temps]
    col_x = {t: x for x, t in stress_temps}
    return col_temps, col_x


def parse_stress_row(row: list[tuple[float, str]], col_temps: list[int], col_x: dict[int, float]) -> dict[int, int | None] | None:
    nums: list[tuple[float, int]] = []
    line_no: int | None = None
    for x, t in row:
        n = parse_number(t)
        if n is None:
            continue
        if line_no is None and x < 200 and 1 <= n <= 99:
            line_no = n
            continue
        nums.append((x, n))

    if line_no is None or len(nums) < len(col_temps):
        return None

    # assign values to nearest temperature column by x
    values: dict[int, int | None] = {}
    stress_nums = [(x, n) for x, n in nums if x > 250]
    for temp in col_temps:
        tx = col_x[temp]
        # find number closest to this column x (within tolerance)
        candidates = [(abs(x - tx), n) for x, n in stress_nums if abs(x - tx) < 80]
        if not candidates:
            values[temp] = None
        else:
            values[temp] = min(candidates)[1]
    return values


def parse_material_row(row: list[tuple[float, str]]) -> dict | None:
    line_no = None
    for x, t in row:
        n = parse_number(t)
        if n and x < 120 and 1 <= n <= 99:
            line_no = n
            break
    if line_no is None:
        return None
    texts = [t for _, t in row]
    joined = " ".join(texts)
    if not re.search(r"A\d{3}|API\s*5L", joined, re.I):
        return None
    spec_m = re.search(r"(API\s*5L|A\d{3,4})", joined, re.I)
    grade_m = re.search(
        r"(Grade\s+[A-Z0-9]+|TP\s*\d+[A-Z]*|TP\s*316L|TP\s*304L|TP\s*321|"
        r"P11|P22|P1|P12|P5|X60|X42|WPL6|WPB|WPC|F42|2205|S31803|S32750|N06625|Grade\s+2)",
        joined,
        re.I,
    )
    return {
        "line": line_no,
        "raw": joined,
        "spec": spec_m.group(1).upper().replace("  ", " ") if spec_m else None,
        "grade": grade_m.group(1).upper() if grade_m else None,
    }


def process_page(rows: list[list[tuple[float, str]]], current: dict) -> None:
    for row in rows:
        mat = parse_material_row(row)
        if mat:
            current.setdefault("materials", {})[mat["line"]] = mat
            continue

        hdr = find_temp_header(row)
        if hdr:
            current["temps_c"] = hdr[0]
            current["_col_x"] = hdr[1]
            continue

        if not current.get("temps_c"):
            continue

        line_no = None
        for x, t in row:
            n = parse_number(t)
            if n and x < 200 and 1 <= n <= 99:
                line_no = n
                break
        if line_no is None:
            continue

        vals = parse_stress_row(row, current["temps_c"], current["_col_x"])
        if vals:
            current.setdefault("stresses", {})[line_no] = vals


def extract_pdf() -> dict:
    reader = easyocr.Reader(["en"], gpu=False, verbose=False)
    doc = fitz.open(PDF)

    sections: list[dict] = []
    current: dict | None = None

    for pi in range(len(doc)):
        items = ocr_page(reader, doc[pi])
        rows = cluster_rows(items)

        has_material = any(parse_material_row(r) for r in rows)
        has_stress_hdr = any(find_temp_header(r) for r in rows)

        if has_material and not has_stress_hdr:
            if current and (current.get("materials") or current.get("stresses")):
                sections.append(current)
            current = {"pages": [pi + 1], "materials": {}, "temps_c": [], "stresses": {}}
            process_page(rows, current)
            continue

        if current is None:
            current = {"pages": [pi + 1], "materials": {}, "temps_c": [], "stresses": {}}

        current.setdefault("pages", []).append(pi + 1)
        process_page(rows, current)

    if current and (current.get("materials") or current.get("stresses")):
        sections.append(current)

    catalog: list[dict] = []
    for sec in sections:
        temps = sec.get("temps_c") or []
        for line, mat in sec.get("materials", {}).items():
            stress = sec.get("stresses", {}).get(line)
            if not stress or not temps:
                continue
            catalog.append(
                {
                    "line": line,
                    "pages": sec.get("pages"),
                    "spec": mat.get("spec"),
                    "grade": mat.get("grade"),
                    "raw": mat.get("raw"),
                    "temps_c": temps,
                    "mpa": [stress.get(t) for t in temps],
                }
            )

    return {"sections": len(sections), "entries": catalog}


def main() -> None:
    data = extract_pdf()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"Wrote {len(data['entries'])} entries to {OUT}")


if __name__ == "__main__":
    main()
