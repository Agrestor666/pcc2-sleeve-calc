"""Shared JS fragments for table-a1.js / table-k1.js lookup + fallbacks."""

# When direct row missing or S cannot be interpolated, try these keys (in order).
A1_MATERIAL_FALLBACK: dict[str, list[str]] = {
    "API 5L GRADE B PSL 2": ["ASTM A333 GRADE 6"],
    "ASTM A671 CC65 CL12": ["API 5L GRADE B PSL 2", "ASTM A333 GRADE 6"],
    "ASTM A671 CC65 CL22": ["API 5L GRADE B PSL 2", "ASTM A333 GRADE 6"],
    "ASTM A671 CF71 CL22": ["ASTM A335 GRADE P11"],
    "ASTM A691 1.25CR CL42": ["ASTM A335 GRADE P11"],
    "ASTM A691 2.25CR CL42": ["ASTM A335 GRADE P22"],
    "ASTM A312 UNS N08904": ["ASTM A312 TP 316L"],
    "ASTM A358 GRADE 304L CL1": ["ASTM A312 TP 304L"],
    "ASTM A358 GRADE 316L CL1": ["ASTM A312 TP 316L"],
    "ASTM A358 GRADE 321 CL1": ["ASTM A312 TP 321"],
    "ASTM A928 S31803 CL 1": ["ASTM A790 S31803"],
    "ASTM A928 S32750 CL 1": ["ASTM A790 S32750"],
    "ASTM B862 GRADE 2": ["ASTM B861 GRADE 2"],
    "UNS 7060X": ["ASTM A312 TP 316L"],
}

K1_MATERIAL_FALLBACK: dict[str, list[str]] = {
    "API 5L GRADE B PSL 2": ["ASTM A333 GRADE 6"],
    "ASTM A671 CC65 CL12": ["API 5L GRADE B PSL 2", "ASTM A333 GRADE 6"],
    "ASTM A671 CC65 CL22": ["API 5L GRADE B PSL 2", "ASTM A333 GRADE 6"],
    "ASTM A671 CF71 CL22": ["ASTM A335 GRADE P11"],
    "ASTM A691 1.25CR CL42": ["ASTM A335 GRADE P11"],
    "ASTM A691 2.25CR CL42": ["ASTM A335 GRADE P22"],
    "ASTM A312 UNS N08904": ["ASTM A312 TP 316L"],
    "ASTM A358 GRADE 304L CL1": ["ASTM A312 TP 304L"],
    "ASTM A358 GRADE 316L CL1": ["ASTM A312 TP 316L"],
    "ASTM A358 GRADE 321 CL1": ["ASTM A312 TP 321"],
    "ASTM A928 S31803 CL 1": ["ASTM A790 S31803"],
    "ASTM A928 S32750 CL 1": ["ASTM A790 S32750"],
    "ASTM B862 GRADE 2": ["ASTM B861 GRADE 2"],
    "ASTM B444 N06625 GR 1": ["ASTM B705 N06625 GR 1 CLASS 2"],
    "ASTM B705 N06625 GR 1 CLASS 2": ["ASTM B444 N06625 GR 1"],
    "UNS 7060X": ["ASTM A312 TP 316L"],
    "ASTM A790 S31803": ["ASTM A312 TP 316L"],
    "ASTM A790 S32750": ["ASTM A312 TP 316L"],
    "ASTM A928 S31803 CL 1": ["ASTM A790 S31803", "ASTM A312 TP 316L"],
    "ASTM A928 S32750 CL 1": ["ASTM A790 S32750", "ASTM A312 TP 316L"],
}


def js_interpolate_block(temp_const: str) -> list[str]:
    return [
        f"function interpolateStressMpa(mpaRow, tempGrid, tempC) {{",
        "    if (!mpaRow || !tempGrid || tempGrid.length === 0) return null;",
        f"    if (tempC <= tempGrid[0]) {{",
        "        for (let i = 0; i < mpaRow.length; i++) {",
        "            if (mpaRow[i] != null) return mpaRow[i];",
        "        }",
        "        return null;",
        "    }",
        "    const lastIdx = tempGrid.length - 1;",
        f"    if (tempC >= tempGrid[lastIdx]) {{",
        "        for (let i = lastIdx; i >= 0; i--) {",
        "            if (mpaRow[i] != null) return mpaRow[i];",
        "        }",
        "        return null;",
        "    }",
        "    let loIdx = -1;",
        "    let hiIdx = -1;",
        "    for (let i = 0; i < tempGrid.length; i++) {",
        "        if (mpaRow[i] == null) continue;",
        "        if (tempGrid[i] <= tempC) loIdx = i;",
        "        if (tempGrid[i] >= tempC && hiIdx < 0) hiIdx = i;",
        "    }",
        "    if (loIdx < 0 && hiIdx < 0) return null;",
        "    if (loIdx < 0) return mpaRow[hiIdx];",
        "    if (hiIdx < 0) return mpaRow[loIdx];",
        "    if (loIdx === hiIdx) return mpaRow[loIdx];",
        "    const t0 = tempGrid[loIdx];",
        "    const t1 = tempGrid[hiIdx];",
        "    const s0 = mpaRow[loIdx];",
        "    const s1 = mpaRow[hiIdx];",
        "    const f = (tempC - t0) / (t1 - t0);",
        "    return s0 + f * (s1 - s0);",
        "}",
        "",
    ]


def js_fallback_object(fallback_map: dict[str, list[str]]) -> str:
    import json

    return json.dumps(fallback_map, indent=4)


def js_lookup_block(
    *,
    table_label: str,
    by_const: str,
    temp_const: str,
    fallback_const: str,
    fallback_map: dict[str, list[str]],
    fn_name: str,
    interpolate_fn: str,
) -> list[str]:
    fb = js_fallback_object(fallback_map)
    return [
        f"const {fallback_const} = {fb};",
        "",
        f"function {fn_name}(material, tempC) {{",
        f"    const chain = [material, ...({fallback_const}[material] || [])];",
        "    const tried = [];",
        "    for (const key of chain) {",
        "        tried.push(key);",
        f"        const entry = {by_const}[key];",
        "        if (!entry) continue;",
        f"        const mpa = {interpolate_fn}(entry.mpa, {temp_const}, tempC);",
        "        if (mpa == null || mpa <= 0) continue;",
        "        const baseNote = entry.note || \"\";",
        "        const logLine = key === material",
        f'            ? `Table {table_label}: ${{material}} @ ${{tempC}} °C — ${{baseNote}}`',
        f'            : `Table {table_label}: ${{material}} → przyjęto ${{key}} (zamiennik) @ ${{tempC}} °C — ${{baseNote}}`;',
        '        console.info("[S lookup]", logLine);',
        "        return {",
        "            mpa: Math.round(mpa * 1000) / 1000,",
        "            bar: Math.round(mpa * MPA_TO_BAR * 10) / 10,",
        "            tempC: Math.round(tempC * 10) / 10,",
        "            note: baseNote,",
        "            sourceMaterial: key,",
        "            requestedMaterial: material,",
        "            acceptedFrom: key === material ? \"direct\" : \"fallback\",",
        "            logLine",
        "        };",
        "    }",
        f'    console.warn(`[S lookup] Table {table_label}: brak S dla ${{material}} @ ${{tempC}} °C (sprawdzono: ${{tried.join(", ")}})`);',
        "    return null;",
        "}",
        "",
    ]


def emit_a1_lookup_tail() -> list[str]:
    lines = js_interpolate_block("A1_TEMP_C")
    lines.append("function interpolateA1Mpa(mpaRow, tempC) {")
    lines.append("    return interpolateStressMpa(mpaRow, A1_TEMP_C, tempC);")
    lines.append("}")
    lines.append("")
    lines.extend(
        js_lookup_block(
            table_label="A-1",
            by_const="A1_BY_MATERIAL",
            temp_const="A1_TEMP_C",
            fallback_const="A1_MATERIAL_FALLBACK",
            fallback_map=A1_MATERIAL_FALLBACK,
            fn_name="lookupA1Stress",
            interpolate_fn="interpolateStressMpa",
        )
    )
    return lines


def emit_k1_lookup_tail() -> list[str]:
    lines = [
        "function interpolateMpa(mpaRow, tempC) {",
        "    return interpolateStressMpa(mpaRow, K1_TEMP_C, tempC);",
        "}",
        "",
    ]
    lines.extend(
        js_lookup_block(
            table_label="K-1",
            by_const="K1_BY_MATERIAL",
            temp_const="K1_TEMP_C",
            fallback_const="K1_MATERIAL_FALLBACK",
            fallback_map=K1_MATERIAL_FALLBACK,
            fn_name="lookupK1Stress",
            interpolate_fn="interpolateStressMpa",
        )
    )
    return lines
