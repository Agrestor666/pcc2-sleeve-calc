"""Generate table-a1.js from tools/a1_stress_data.json + Ti/Ni fallback rows."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from stress_lookup_template import emit_a1_lookup_tail  # noqa: E402
DATA = json.loads((ROOT / "tools" / "a1_stress_data.json").read_text(encoding="utf-8"))
K1_DATA = json.loads((ROOT / "tools" / "k1_stress_data.json").read_text(encoding="utf-8"))

# K-1 line map when A-1 OCR row is missing or invalid
K1_LINE_FALLBACK: dict[str, tuple[str, int]] = {
    "UNS 7060X": ("stainless", 1),
    "ASTM A312 UNS N08904": ("stainless", 1),
    "ASTM A671 CC65 CL12": ("carbon", 5),
    "ASTM A671 CC65 CL22": ("carbon", 5),
    "ASTM A671 CF71 CL22": ("alloy", 3),
    "ASTM A691 1.25CR CL42": ("alloy", 3),
    "ASTM A691 2.25CR CL42": ("alloy", 4),
}

UNION_TEMPS = [40, 65, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375]

N06600_MPA = [151, 147, 143, 140, 138, 135, 133, 130, 128, 126, 124, 122, None, None]
TI_GR2_MPA = [207, 190, 168, 154, 141, 129, 116, 102, 91, 78, 64, None, None, None]

MATERIAL_MAP: dict[str, tuple[str, int]] = {
    "API 5L GRADE B PSL 2": ("carbon", 35),
    "API SPEC 5L GRADE X60 PSL 2": ("carbon", 73),
    "ASTM A333 GRADE 6": ("carbon", 35),
    "ASTM A333 GRADE 3": ("carbon", 52),
    "ASTM A335 GRADE P11": ("alloy", 60),
    "ASTM A335 GRADE P22": ("alloy", 63),
    "ASTM A671 CC65 CL12": ("carbon", 35),
    "ASTM A671 CC65 CL22": ("carbon", 35),
    "ASTM A671 CF71 CL22": ("alloy", 60),
    "ASTM A691 1.25CR CL42": ("alloy", 60),
    "ASTM A691 2.25CR CL42": ("alloy", 63),
    "ASTM A312 TP 316L": ("stainless", 10),
    "ASTM A312 TP 304L": ("stainless", 11),
    "ASTM A312 TP 321": ("stainless", 24),
    "ASTM A312 UNS N08904": ("stainless", 10),
    "ASTM A358 GRADE 304L CL1": ("stainless", 11),
    "ASTM A358 GRADE 316L CL1": ("stainless", 10),
    "ASTM A358 GRADE 321 CL1": ("stainless", 24),
    "ASTM A790 S31803": ("alloy", 54),
    "ASTM A790 S32750": ("stainless", 24),
    "ASTM A928 S31803 CL 1": ("alloy", 54),
    "ASTM A928 S32750 CL 1": ("stainless", 24),
    "ASTM B444 N06625 GR 1": ("_n06600", 0),
    "ASTM B705 N06625 GR 1 CLASS 2": ("_n06600", 0),
    "ASTM B861 GRADE 2": ("_ti2", 0),
    "ASTM B862 GRADE 2": ("_ti2", 0),
    "UNS 7060X": ("stainless", 1),
}

NOTES = {
    "API 5L GRADE B PSL 2": "API 5L Grade B (B31.3-2024 Table A-1)",
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
    "ASTM A312 UNS N08904": "Not in A-1 — conservative TP316L basis",
    "ASTM A358 GRADE 304L CL1": "A 358 Grade 304L Cl. 1",
    "ASTM A358 GRADE 316L CL1": "A 358 Grade 316L Cl. 1",
    "ASTM A358 GRADE 321 CL1": "A 358 Grade 321 Cl. 1",
    "ASTM A790 S31803": "A 790 S31803 (2205)",
    "ASTM A790 S32750": "A 790 S32750",
    "ASTM A928 S31803 CL 1": "A 928 S31803 Cl. 1",
    "ASTM A928 S32750 CL 1": "A 928 S32750 Cl. 1",
    "ASTM B444 N06625 GR 1": "N06625 not in A-1 (2024) — N06600 (B167) substituted",
    "ASTM B705 N06625 GR 1 CLASS 2": "N06625 not in A-1 (2024) — N06600 (B167) substituted",
    "ASTM B861 GRADE 2": "Ti Grade 2 (B 861 / B 381 F-2)",
    "ASTM B862 GRADE 2": "Ti Grade 2 (B 862 / B 381 F-2)",
    "UNS 7060X": "Not in A-1 — conservative TP316L basis",
}


def resample(section_temps: list[int], row: list, dst: list[int]) -> list:
    out = []
    for t in dst:
        if t in section_temps:
            out.append(row[section_temps.index(t)])
        else:
            out.append(None)
    return out


def get_row(sec_key: str, line: int) -> list | None:
    sec = DATA.get(sec_key)
    if sec:
        raw = sec["lines"].get(str(line))
        if raw and max(v for v in raw if v is not None) >= 50:
            return resample(sec["temps_c"], raw, UNION_TEMPS)
    return None


def get_k1_row(sec_key: str, line: int) -> list | None:
    sec = K1_DATA.get(sec_key)
    if not sec:
        return None
    raw = sec["lines"].get(str(line))
    if not raw:
        return None
    return resample(sec["temps_c"], raw, UNION_TEMPS)


def main():
    lines = [
        "/**",
        " * ASME B31.3-2024 Table A-1 — allowable stress vs temperature (SI).",
        " * Temperatures [°C], stresses [MPa]. Interpolation per Appendix A General Note (c).",
        " * Source: A1.pdf (B31.3-2024 Table A-1, SI units). MPa → bar (×10) for Chapter II.",
        " */",
        f"const A1_TEMP_C = {json.dumps(UNION_TEMPS)};",
        "",
        "/** @type {Record<string, { mpa: (number|null)[], note?: string }>} */",
        "const A1_BY_MATERIAL = {",
    ]

    for mat in sorted(MATERIAL_MAP.keys()):
        sec_key, line = MATERIAL_MAP[mat]
        note = NOTES.get(mat, "")
        if sec_key == "_n06600":
            mpa = N06600_MPA
        elif sec_key == "_ti2":
            mpa = TI_GR2_MPA
        else:
            mpa = get_row(sec_key, line)
            if not mpa and mat in K1_LINE_FALLBACK:
                k1_sec, k1_line = K1_LINE_FALLBACK[mat]
                mpa = get_k1_row(k1_sec, k1_line)
                note = (note or "") + " (A-1 OCR pending — K-1 row used; verify)"
        if not mpa:
            continue
        lines.append(f'    "{mat}": {{')
        lines.append(f"        mpa: {json.dumps(mpa)},")
        lines.append(f'        note: "{note}"')
        lines.append("    },")

    lines.append("};")
    lines.append("")
    lines.append("const MPA_TO_BAR = 10;")
    lines.append("")
    lines.extend(emit_a1_lookup_tail())

    out = ROOT / "table-a1.js"
    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {out} ({len(MATERIAL_MAP)} materials)")


if __name__ == "__main__":
    main()
