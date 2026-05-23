"""
Build table-k1.js from K1.pdf stress pages (OCR) + material line mapping.
ASME B31.3-2024 Table K-1, SI: temperatures [°C], stress [MPa] -> converted to [bar] in JS.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

import easyocr
import fitz
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "K1.pdf"
OUT_JS = ROOT / "table-k1.js"

# App material key -> (section_index, line_no) in K-1 blocks
MATERIAL_LINES: dict[str, tuple[int, int]] = {
    "API 5L GRADE B PSL 2": (0, 5),
    "API SPEC 5L GRADE X60 PSL 2": (0, 13),
    "ASTM A333 GRADE 6": (0, 3),
    "ASTM A333 GRADE 3": (1, 6),
    "ASTM A335 GRADE P11": (1, 3),
    "ASTM A335 GRADE P22": (1, 4),
    "ASTM A671 CC65 CL12": (0, 2),
    "ASTM A671 CC65 CL22": (0, 2),
    "ASTM A671 CF71 CL22": (1, 3),
    "ASTM A691 1.25CR CL42": (1, 3),
    "ASTM A691 2.25CR CL42": (1, 4),
    "ASTM A312 TP 316L": (2, 1),
    "ASTM A312 TP 304L": (2, 3),
    "ASTM A312 TP 321": (2, 9),
    "ASTM A312 UNS N08904": (2, 1),
    "ASTM A358 GRADE 304L CL1": (2, 3),
    "ASTM A358 GRADE 316L CL1": (2, 1),
    "ASTM A358 GRADE 321 CL1": (2, 9),
    "ASTM A790 S31803": (2, 26),
    "ASTM A790 S32750": (2, 24),
    "ASTM A928 S31803 CL 1": (2, 26),
    "ASTM A928 S32750 CL 1": (2, 24),
    "ASTM B444 N06625 GR 1": (3, 1),
    "ASTM B705 N06625 GR 1 CLASS 2": (3, 1),
    "ASTM B861 GRADE 2": (3, 15),
    "ASTM B862 GRADE 2": (3, 15),
    "UNS 7060X": (2, 1),
}

# Stress pages (0-based) and their temperature breakpoints [°C]
STRESS_SECTIONS = [
    {"pages": [1], "temps_c": [40, 65, 100, 150, 200, 250, 300, 325, 350, 375]},
    {"pages": [3], "temps_c": [40, 65, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375]},
    {"pages": [5], "temps_c": [40, 65, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375]},
    {"pages": [7], "temps_c": [40, 65, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375]},
]

MATERIAL_NOTES: dict[str, str] = {
    "API 5L GRADE B PSL 2": "API 5L Grade B (B31.3-2024 Table K-1)",
    "API SPEC 5L GRADE X60 PSL 2": "API 5L Grade X60",
    "ASTM A333 GRADE 6": "A 333 Grade 6",
    "ASTM A333 GRADE 3": "A 333 Grade 3",
    "ASTM A335 GRADE P11": "A 335 Grade P11",
    "ASTM A335 GRADE P22": "A 335 Grade P22",
    "ASTM A671 CC65 CL12": "Approx. A 106 Grade B (CC65)",
    "ASTM A671 CC65 CL22": "Approx. A 106 Grade B (CC65)",
    "ASTM A671 CF71 CL22": "Approx. A 335 Grade P11 (CF71)",
    "ASTM A691 1.25CR CL42": "Approx. A 335 Grade P11",
    "ASTM A691 2.25CR CL42": "Approx. A 335 Grade P22",
    "ASTM A312 TP 316L": "A 312 TP316L",
    "ASTM A312 TP 304L": "A 312 TP304L",
    "ASTM A312 TP 321": "A 312 TP321",
    "ASTM A312 UNS N08904": "Not in K-1 — conservative TP316L basis",
    "ASTM A358 GRADE 304L CL1": "A 358 Grade 304L Cl. 1",
    "ASTM A358 GRADE 316L CL1": "A 358 Grade 316L Cl. 1",
    "ASTM A358 GRADE 321 CL1": "A 358 Grade 321 Cl. 1",
    "ASTM A790 S31803": "A 790 S31803 (2205)",
    "ASTM A790 S32750": "A 790 S32750",
    "ASTM A928 S31803 CL 1": "A 928 S31803 Cl. 1",
    "ASTM A928 S32750 CL 1": "A 928 S32750 Cl. 1",
    "ASTM B444 N06625 GR 1": "UNS N06625",
    "ASTM B705 N06625 GR 1 CLASS 2": "UNS N06625",
    "ASTM B861 GRADE 2": "Ti Grade 2 (B 861)",
    "ASTM B862 GRADE 2": "Ti Grade 2 (B 862)",
    "UNS 7060X": "Not in K-1 — conservative TP316L basis",
}


def ocr_page(reader, page, scale: float = 3.0):
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


def parse_nums(row):
    nums = []
    line = None
    for x, t in row:
        t = t.replace(",", "")
        if t in ("...", "…"):
            continue
        if not re.fullmatch(r"\d+", t):
            continue
        n = int(t)
        if line is None and x < 200 and 1 <= n <= 99:
            line = n
        else:
            nums.append(n)
    return line, nums


def extract_stress_section(reader, doc, page_idx: int, temps_c: list[int]) -> dict[int, list[int | None]]:
    items = ocr_page(reader, doc[page_idx])
    rows = cluster_rows(items)
    n_stress = len(temps_c)
    by_line: dict[int, list[int | None]] = {}
    seq = 0

    for row in rows:
        line_hint, nums = parse_nums(row)
        if len(nums) < n_stress + 1:
            continue
        # [max_temp, s1..sn] or extra leading line no already stripped
        max_t = nums[0]
        stresses = nums[1 : 1 + n_stress]
        if len(stresses) < n_stress:
            continue
        if max_t < 100 or max(stresses[:3]) < 50:
            continue

        line = line_hint if line_hint is not None else seq + 1
        if line_hint is None:
            seq += 1
        else:
            seq = max(seq, line)

        row_vals: list[int | None] = []
        for v in stresses[:n_stress]:
            row_vals.append(v if v > 10 else None)
        by_line[line] = row_vals

    return by_line


def merge_temps_union(sections: list[dict]) -> list[int]:
    all_t = set()
    for s in sections:
        all_t.update(s["temps_c"])
    return sorted(all_t)


def resample_to_temps(src_temps: list[int], src_vals: list, dst_temps: list[int]) -> list:
    out = []
    for t in dst_temps:
        if t in src_temps:
            out.append(src_vals[src_temps.index(t)])
        else:
            out.append(None)
    return out


def emit_js(sections_data: list[dict], material_map: dict) -> str:
    union_temps = merge_temps_union(sections_data)

    lines = [
        "/**",
        " * ASME B31.3-2024 Table K-1 — allowable stress vs temperature (SI).",
        " * Temperatures [°C], stresses [MPa]. Interpolation per Appendix K General Note (c).",
        " * Source: K1.pdf (B31.3-2024 Table K-1, SI units). MPa converted to bar for Eq. (34a).",
        " */",
        f"const K1_TEMP_C = {json.dumps(union_temps)};",
        "",
        "/** @type {Record<string, { mpa: (number|null)[], note?: string }>} */",
        "const K1_BY_MATERIAL = {",
    ]

    for mat, (sec_i, line_no) in sorted(material_map.items()):
        sec = sections_data[sec_i]
        row = sec["lines"].get(line_no)
        if not row:
            continue
        mpa = resample_to_temps(sec["temps_c"], row, union_temps)
        note = MATERIAL_NOTES.get(mat, "")
        mpa_json = json.dumps(mpa)
        lines.append(f'    "{mat}": {{')
        lines.append(f"        mpa: {mpa_json},")
        if note:
            lines.append(f'        note: "{note}"')
        lines.append("    },")

    lines.append("};")
    lines.extend(
        [
            "",
            "/* MPA_TO_BAR (10) — defined in table-a1.js, loaded before this file */",
            "",
            "function interpolateMpa(mpaRow, tempC) {",
            "    if (tempC <= K1_TEMP_C[0]) {",
            "        const v = mpaRow[0];",
            "        return v == null ? null : v;",
            "    }",
            "    const lastIdx = K1_TEMP_C.length - 1;",
            "    if (tempC >= K1_TEMP_C[lastIdx]) {",
            "        let v = mpaRow[lastIdx];",
            "        if (v == null) {",
            "            for (let i = lastIdx - 1; i >= 0; i--) {",
            "                if (mpaRow[i] != null) {",
            "                    v = mpaRow[i];",
            "                    break;",
            "                }",
            "            }",
            "        }",
            "        return v;",
            "    }",
            "    for (let i = 0; i < lastIdx; i++) {",
            "        const t0 = K1_TEMP_C[i];",
            "        const t1 = K1_TEMP_C[i + 1];",
            "        if (tempC > t1) continue;",
            "        const s0 = mpaRow[i];",
            "        const s1 = mpaRow[i + 1];",
            "        if (s0 == null || s1 == null) {",
            "            return s0 != null ? s0 : s1;",
            "        }",
            "        const f = (tempC - t0) / (t1 - t0);",
            "        return s0 + f * (s1 - s0);",
            "    }",
            "    return null;",
            "}",
            "",
            "/**",
            " * @returns {{ mpa: number, bar: number, tempC: number, note: string } | null}",
            " */",
            "function lookupK1Stress(material, tempC) {",
            "    const entry = K1_BY_MATERIAL[material];",
            "    if (!entry) return null;",
            "",
            "    const mpa = interpolateMpa(entry.mpa, tempC);",
            "    if (mpa == null || mpa <= 0) return null;",
            "",
            "    return {",
            "        mpa: Math.round(mpa * 1000) / 1000,",
            "        bar: Math.round(mpa * MPA_TO_BAR * 10) / 10,",
            "        tempC: Math.round(tempC * 10) / 10,",
            "        note: entry.note || \"\"",
            "    };",
            "}",
            "",
        ]
    )
    return "\n".join(lines)


def main():
    reader = easyocr.Reader(["en"], gpu=False, verbose=False)
    doc = fitz.open(PDF)

    sections_data = []
    for sec in STRESS_SECTIONS:
        lines: dict[int, list] = {}
        for pi in sec["pages"]:
            part = extract_stress_section(reader, doc, pi, sec["temps_c"])
            lines.update(part)
        sections_data.append({"temps_c": sec["temps_c"], "lines": lines})
        print(f"Section page {sec['pages']}: {len(lines)} stress rows")

    js = emit_js(sections_data, MATERIAL_LINES)
    OUT_JS.write_text(js, encoding="utf-8")
    print(f"Wrote {OUT_JS}")


if __name__ == "__main__":
    main()
