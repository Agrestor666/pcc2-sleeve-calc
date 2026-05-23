/**
 * ASME B31.3-2024 Table A-1 — allowable stress vs temperature (SI).
 * Temperatures [°C], stresses [MPa]. Interpolation per Appendix A General Note (c).
 * Source: A1.pdf (B31.3-2024 Table A-1, SI units). MPa → bar (×10) for Chapter II.
 *
 * Requires `stress-lookup.js` before this script (`createB31StressLookup`, `interpolateStressMpa`).
 */
const A1_TEMP_C = [40, 65, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375];

/** @type {Record<string, { mpa: (number|null)[], note?: string }>} */
const A1_BY_MATERIAL = {
    "API 5L GRADE B PSL 2": {
        mpa: [138, 138, 138, null, 138, null, 138, null, 132, null, 126, 122, 118, 113],
        note: "API 5L Grade B (B31.3-2024 Table A-1)"
    },
    "API SPEC 5L GRADE X60 PSL 2": {
        mpa: [172, 172, 168, null, 163, null, 158, null, 151, null, 144, 139, 135, 131],
        note: "API 5L Grade X60"
    },
    "ASTM A312 TP 304L": {
        mpa: [138, 129, 124, 122, 120, 119, 119, 118, 118, 117, 117, 116, 114, 112],
        note: "A 312 TP304L"
    },
    "ASTM A312 TP 316L": {
        mpa: [138, 129, 124, 120, 117, 115, 112, 110, 109, 107, 106, 105, 103, 102],
        note: "A 312 TP316L"
    },
    "ASTM A312 TP 321": {
        mpa: [138, 129, 124, 122, 120, 119, 119, 118, 118, 117, 117, 116, 114, 112],
        note: "A 312 TP321"
    },
    "ASTM A312 UNS N08904": {
        mpa: [138, 129, 124, 120, 117, 115, 112, 110, 109, 107, 106, 105, 103, 102],
        note: "Not in A-1 — conservative TP316L basis"
    },
    "ASTM A333 GRADE 3": {
        mpa: [149, 149, 147, null, 142, null, 138, null, 132, null, 126, 122, 118, 113],
        note: "A 333 Grade 3"
    },
    "ASTM A333 GRADE 6": {
        mpa: [138, 138, 138, null, 138, null, 138, null, 132, null, 126, 122, 118, 113],
        note: "A 333 Grade 6"
    },
    "ASTM A335 GRADE P11": {
        mpa: [138, 129, 124, 122, 120, 119, 119, 118, 118, 117, 117, 116, 114, 112],
        note: "A 335 Grade P11"
    },
    "ASTM A335 GRADE P22": {
        mpa: [138, 130, 126, 123, 121, 119, 117, 116, 115, 114, 112, 111, 110, 109],
        note: "A 335 Grade P22"
    },
    "ASTM A358 GRADE 304L CL1": {
        mpa: [138, 129, 124, 122, 120, 119, 119, 118, 118, 117, 117, 116, 114, 112],
        note: "A 358 Grade 304L Cl. 1"
    },
    "ASTM A358 GRADE 316L CL1": {
        mpa: [138, 129, 124, 120, 117, 115, 112, 110, 109, 107, 106, 105, 103, 102],
        note: "A 358 Grade 316L Cl. 1"
    },
    "ASTM A358 GRADE 321 CL1": {
        mpa: [138, 129, 124, 122, 120, 119, 119, 118, 118, 117, 117, 116, 114, 112],
        note: "A 358 Grade 321 Cl. 1"
    },
    "ASTM A671 CC65 CL12": {
        mpa: [138, 138, 138, null, 138, null, 138, null, 132, null, 126, 122, 118, 113],
        note: "Approx. A 106 Grade B (CC65)"
    },
    "ASTM A671 CC65 CL22": {
        mpa: [138, 138, 138, null, 138, null, 138, null, 132, null, 126, 122, 118, 113],
        note: "Approx. A 106 Grade B (CC65)"
    },
    "ASTM A671 CF71 CL22": {
        mpa: [138, 129, 124, 122, 120, 119, 119, 118, 118, 117, 117, 116, 114, 112],
        note: "Approx. A 335 Grade P11 (CF71)"
    },
    "ASTM A691 1.25CR CL42": {
        mpa: [138, 129, 124, 122, 120, 119, 119, 118, 118, 117, 117, 116, 114, 112],
        note: "Approx. A 335 Grade P11"
    },
    "ASTM A691 2.25CR CL42": {
        mpa: [138, 130, 126, 123, 121, 119, 117, 116, 115, 114, 112, 111, 110, 109],
        note: "Approx. A 335 Grade P22"
    },
    "ASTM A790 S31803": {
        mpa: [207, 207, 205, 202, 200, 199, 199, 199, 198, 198, 196, 194, 191, 187],
        note: "A 790 S31803 (2205)"
    },
    "ASTM A790 S32750": {
        mpa: [138, 129, 124, 122, 120, 119, 119, 118, 118, 117, 117, 116, 114, 112],
        note: "A 790 S32750"
    },
    "ASTM A928 S31803 CL 1": {
        mpa: [207, 207, 205, 202, 200, 199, 199, 199, 198, 198, 196, 194, 191, 187],
        note: "A 928 S31803 Cl. 1"
    },
    "ASTM A928 S32750 CL 1": {
        mpa: [138, 129, 124, 122, 120, 119, 119, 118, 118, 117, 117, 116, 114, 112],
        note: "A 928 S32750 Cl. 1"
    },
    "ASTM B444 N06625 GR 1": {
        mpa: [151, 147, 143, 140, 138, 135, 133, 130, 128, 126, 124, 122, null, null],
        note: "N06625 not in A-1 (2024) — N06600 (B167) substituted"
    },
    "ASTM B705 N06625 GR 1 CLASS 2": {
        mpa: [151, 147, 143, 140, 138, 135, 133, 130, 128, 126, 124, 122, null, null],
        note: "N06625 not in A-1 (2024) — N06600 (B167) substituted"
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
        note: "Not in A-1 — conservative TP316L basis (A-1 OCR pending — K-1 row used; verify)"
    },
};

/** Interpolation for A-1 rows; uses interpolateStressMpa from stress-lookup.js (load order in HTML). */
function interpolateA1Mpa(mpaRow, tempC) {
    return interpolateStressMpa(mpaRow, A1_TEMP_C, tempC);
}

const A1_MATERIAL_FALLBACK = {
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
        "ASTM A790 S31803"
    ],
    "ASTM A928 S32750 CL 1": [
        "ASTM A790 S32750"
    ],
    "ASTM B862 GRADE 2": [
        "ASTM B861 GRADE 2"
    ],
    "UNS 7060X": [
        "ASTM A312 TP 316L"
    ]
};

const lookupA1Stress = createB31StressLookup({
    tableId: "A-1",
    byMaterial: A1_BY_MATERIAL,
    tempGrid: A1_TEMP_C,
    materialFallback: A1_MATERIAL_FALLBACK
});
