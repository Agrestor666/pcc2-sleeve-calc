/**
 * ASME B31.3-2024 Table K-1 — allowable stress vs temperature (SI).
 * Temperatures [°C], stresses [MPa]. Interpolation per Appendix K General Note (c).
 * Source: K1.pdf (B31.3-2024 Table K-1, SI units). MPa → bar (×10) for Eq. (34a).
 */
const K1_TEMP_C = [40, 65, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375];

/** @type {Record<string, { mpa: (number|null)[], note?: string }>} */
const K1_BY_MATERIAL = {
    "API 5L GRADE B PSL 2": {
        mpa: [212, 199, 193, null, 188, null, 182, null, 174, null, 165, 161, 155, 151],
        note: "API 5L Grade B (B31.3-2024 Table K-1)"
    },
    "API SPEC 5L GRADE X60 PSL 2": {
        mpa: [312, 302, 295, null, 282, null, 264, null, 249, null, 238, null, null, null],
        note: "API 5L Grade X60"
    },
    "ASTM A312 TP 304L": {
        mpa: [151, 138, 128, 121, 116, 111, 106, 103, 100, 97, 95, 93, 91, 90],
        note: "A 312 TP304L"
    },
    "ASTM A312 TP 316L": {
        mpa: [151, 138, 127, 120, 115, 110, 106, 104, 100, 97, 96, 94, 92, 90],
        note: "A 312 TP316L"
    },
    "ASTM A312 TP 321": {
        mpa: [151, 142, 135, 129, 126, 121, 117, 113, 110, 106, 104, 102, 99, 97],
        note: "A 312 TP321"
    },
    "ASTM A312 UNS N08904": {
        mpa: [151, 138, 127, 120, 115, 110, 106, 104, 100, 97, 96, 94, 92, 90],
        note: "Not in K-1 — conservative TP316L basis"
    },
    "ASTM A333 GRADE 3": {
        mpa: [212, 199, 193, 190, 187, 184, 182, 178, 174, 169, 163, 156, 149, 141],
        note: "A 333 Grade 3"
    },
    "ASTM A333 GRADE 6": {
        mpa: [212, 199, 193, null, 188, null, 182, null, 174, null, 165, 161, 155, 151],
        note: "A 333 Grade 6"
    },
    "ASTM A335 GRADE P11": {
        mpa: [182, 173, 167, 162, 159, 156, 154, 151, 148, 146, 144, 141, 139, 136],
        note: "A 335 Grade P11"
    },
    "ASTM A335 GRADE P22": {
        mpa: [182, 173, 169, 167, 164, 163, 162, 162, 162, 162, 162, 162, 162, 162],
        note: "A 335 Grade P22"
    },
    "ASTM A358 GRADE 304L CL1": {
        mpa: [151, 138, 128, 121, 116, 111, 106, 103, 100, 97, 95, 93, 91, 90],
        note: "A 358 Grade 304L Cl. 1"
    },
    "ASTM A358 GRADE 316L CL1": {
        mpa: [151, 138, 127, 120, 115, 110, 106, 104, 100, 97, 96, 94, 92, 90],
        note: "A 358 Grade 316L Cl. 1"
    },
    "ASTM A358 GRADE 321 CL1": {
        mpa: [182, 170, 162, 155, 150, 145, 140, 135, 132, 128, 125, 122, 119, 117],
        note: "A 358 Grade 321 Cl. 1"
    },
    "ASTM A671 CC65 CL12": {
        mpa: [212, 199, 193, null, 188, null, 182, null, 174, null, 165, 161, 155, 151],
        note: "Approx. A 106 Grade B (CC65)"
    },
    "ASTM A671 CC65 CL22": {
        mpa: [212, 199, 193, null, 188, null, 182, null, 174, null, 165, 161, 155, 151],
        note: "Approx. A 106 Grade B (CC65)"
    },
    "ASTM A671 CF71 CL22": {
        mpa: [182, 173, 167, 162, 159, 156, 154, 151, 148, 146, 144, 141, 139, 136],
        note: "Approx. A 335 Grade P11 (CF71)"
    },
    "ASTM A691 1.25CR CL42": {
        mpa: [182, 173, 167, 162, 159, 156, 154, 151, 148, 146, 144, 141, 139, 136],
        note: "Approx. A 335 Grade P11"
    },
    "ASTM A691 2.25CR CL42": {
        mpa: [182, 173, 169, 167, 164, 163, 162, 162, 162, 162, 162, 162, 162, 162],
        note: "Approx. A 335 Grade P22"
    },
    "ASTM A790 S31803": {
        mpa: [368, 358, 347, 334, 325, 317, 311, 306, 302, 298, null, null, null, null],
        note: "A 790 S31803 (2205)"
    },
    "ASTM A790 S32750": {
        mpa: [356, 346, 338, 330, 322, 314, 308, 303, 299, 295, null, null, null, null],
        note: "A 790 S32750"
    },
    "ASTM A928 S31803 CL 1": {
        mpa: [368, 358, 347, 334, 325, 317, 311, 306, 302, 298, null, null, null, null],
        note: "A 928 S31803 Cl. 1"
    },
    "ASTM A928 S32750 CL 1": {
        mpa: [356, 346, 338, 330, 322, 314, 308, 303, 299, 295, null, null, null, null],
        note: "A 928 S32750 Cl. 1"
    },
    "ASTM B444 N06625 GR 1": {
        mpa: [151, 147, 143, 140, 138, 135, 133, 130, 128, 126, 124, 122, null, null],
        note: "N06625 not in K-1 (2024) — N06600 (B167) substituted"
    },
    "ASTM B705 N06625 GR 1 CLASS 2": {
        mpa: [151, 147, 143, 140, 138, 135, 133, 130, 128, 126, 124, 122, null, null],
        note: "N06625 not in K-1 (2024) — N06600 (B167) substituted"
    },
    "ASTM B861 GRADE 2": {
        mpa: [207, 190, 168, 154, 141, 129, 116, 102, 91, 78, 64, null, null, null],
        note: "Ti Grade 2 (B 861 / B 381 F-2)"
    },
    "ASTM B862 GRADE 2": {
        mpa: [207, 190, 168, 154, 141, 129, 116, 102, 91, 78, 64, null, null, null],
        note: "Ti Grade 2 (B 862 / B 381 F-2)"
    },
    "UNS 7060X": {
        mpa: [151, 138, 127, 120, 115, 110, 106, 104, 100, 97, 96, 94, 92, 90],
        note: "Not in K-1 — conservative TP316L basis"
    },
};

/* MPA_TO_BAR (10) — defined in table-a1.js, loaded before this file */

function interpolateMpa(mpaRow, tempC) {
    return interpolateStressMpa(mpaRow, K1_TEMP_C, tempC);
}

const K1_MATERIAL_FALLBACK = {
    "API 5L GRADE B PSL 2": [
        "ASTM A333 GRADE 6"
    ],
    "ASTM A671 CC65 CL12": [
        "API 5L GRADE B PSL 2",
        "ASTM A333 GRADE 6"
    ],
    "ASTM A671 CC65 CL22": [
        "API 5L GRADE B PSL 2",
        "ASTM A333 GRADE 6"
    ],
    "ASTM A671 CF71 CL22": [
        "ASTM A335 GRADE P11"
    ],
    "ASTM A691 1.25CR CL42": [
        "ASTM A335 GRADE P11"
    ],
    "ASTM A691 2.25CR CL42": [
        "ASTM A335 GRADE P22"
    ],
    "ASTM A312 UNS N08904": [
        "ASTM A312 TP 316L"
    ],
    "ASTM A358 GRADE 304L CL1": [
        "ASTM A312 TP 304L"
    ],
    "ASTM A358 GRADE 316L CL1": [
        "ASTM A312 TP 316L"
    ],
    "ASTM A358 GRADE 321 CL1": [
        "ASTM A312 TP 321"
    ],
    "ASTM A928 S31803 CL 1": [
        "ASTM A790 S31803",
        "ASTM A312 TP 316L"
    ],
    "ASTM A928 S32750 CL 1": [
        "ASTM A790 S32750",
        "ASTM A312 TP 316L"
    ],
    "ASTM B862 GRADE 2": [
        "ASTM B861 GRADE 2"
    ],
    "ASTM B444 N06625 GR 1": [
        "ASTM B705 N06625 GR 1 CLASS 2"
    ],
    "ASTM B705 N06625 GR 1 CLASS 2": [
        "ASTM B444 N06625 GR 1"
    ],
    "UNS 7060X": [
        "ASTM A312 TP 316L"
    ],
    "ASTM A790 S31803": [
        "ASTM A312 TP 316L"
    ],
    "ASTM A790 S32750": [
        "ASTM A312 TP 316L"
    ]
};

function lookupK1Stress(material, tempC) {
    const chain = [material, ...(K1_MATERIAL_FALLBACK[material] || [])];
    const tried = [];
    for (const key of chain) {
        tried.push(key);
        const entry = K1_BY_MATERIAL[key];
        if (!entry) continue;
        const mpa = interpolateStressMpa(entry.mpa, K1_TEMP_C, tempC);
        if (mpa == null || mpa <= 0) continue;
        const baseNote = entry.note || "";
        const logLine = key === material
            ? `Table K-1: ${material} @ ${tempC} °C — ${baseNote}`
            : `Table K-1: ${material} → przyjęto ${key} (zamiennik) @ ${tempC} °C — ${baseNote}`;
        console.info("[S lookup]", logLine);
        return {
            mpa: Math.round(mpa * 1000) / 1000,
            bar: Math.round(mpa * MPA_TO_BAR * 10) / 10,
            tempC: Math.round(tempC * 10) / 10,
            note: baseNote,
            sourceMaterial: key,
            requestedMaterial: material,
            acceptedFrom: key === material ? "direct" : "fallback",
            logLine
        };
    }
    console.warn(`[S lookup] Table K-1: brak S dla ${material} @ ${tempC} °C (sprawdzono: ${tried.join(", ")})`);
    return null;
}
