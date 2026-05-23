# ASME PCC-2 — Sleeve Type B Thickness Calculator

**Version 1.0.0** — see [CHANGELOG.md](CHANGELOG.md).

Web-based calculator for determining minimum wall thickness of **Type B full encirclement repair sleeves** per **ASME PCC-2 Article 2.6**, using design formulas from **ASME B31.3**.

## Formulas (selected by design pressure P)

| Condition | Formula |
|-----------|---------|
| **P &lt; 690 bar** | Chapter II: `t = (P·D) / (2·(S·E + P·Y)) + CA` with **D = OD + 2·GAP + 2·THK** |
| **P ≥ 690 bar** | Chapter IX Eq. (34a): `t = ((D − 2·CA) / 2)·(1 − exp(−1.155·P/S)) + CA` with **D = OD + 2·GAP + 2·THK** |

| Symbol | Description |
|--------|-------------|
| **t** | Required sleeve thickness (incl. CA) [mm] |
| **P** | Design pressure (MAWP) [bar] |
| **D** | Outside diameter of sleeve (= OD + 2·GAP + 2·THK) [mm] |
| **GAP** | Radial clearance between sleeve bore and pipe OD (each side) [mm] |
| **S** | Allowable stress [bar] — from **Table A-1** (Ch. II) or **Table K-1** (Ch. IX, B31.3-2024 SI: MPa×10) |
| **E** | Weld joint efficiency (default **0.80**; 1.00 if 100% RT applies), Ch. II only |
| **Y** | Temperature coefficient (B31.3 Table 304.1.1), Ch. II only |
| **CA** | Corrosion allowance [mm] |

Sleeve length: **L = s + 100 mm** (s = longitudinal defect extent).

**OD** (parent pipe), **GAP** (annular clearance each side), and **THK** (sleeve wall) define **D = OD + 2·GAP + 2·THK** used in both formulas. Field **c** (circumferential defect) is recorded in the log only.

Type B sleeves are designed for 100% of design pressure with no credit for remaining carrier pipe wall thickness.

## UI behaviour

- Two formula panels: Chapter II (Output) and Chapter IX (high pressure). The inactive panel is greyed out.
- Results appear under the **active** formula only.
- For **P &lt; 690 bar**, **S** is looked up from **Table A-1** (`tables/table-a1.js`, B31.3-2024 SI: °C / MPa) at **Tmax**; the Run button stays disabled until a valid A-1 value exists.
- For **P ≥ 690 bar**, **S** is looked up from **Table K-1** (`tables/table-k1.js`, B31.3-2024 SI: °C / MPa) at **Tmax**; the Run button stays disabled until a valid K-1 value exists.

## Supported materials (27)

API 5L Grade B PSL 2, API 5L Grade X60 PSL 2, ASTM A333 (Gr. 3, 6), ASTM A335 (Gr. P11, P22), ASTM A671 (CC65, CF71), ASTM A691 (1.25Cr, 2.25Cr), ASTM A312 (TP 304L, 316L, 321, UNS N08904), ASTM A358 (304L, 316L, 321), ASTM A790 (S31803, S32750), ASTM A928 (S31803, S32750), ASTM B444 N06625, ASTM B705 N06625, ASTM B861/B862 Grade 2, UNS 7060X.

Some K-1 rows are mapped or approximate — verify against your code edition and project spec.

## ASME PCC-2 Assistant (chat)

Dialogflow CX Messenger (EU) is embedded in `SleeveCalc.html`. Icon source: `pcc2-chat-icon.svg` (also embedded as a data URL in HTML). Chat requires network access to `gstatic.com`.

## Project structure

```
ASME PCC2/
├── SleeveCalc.html      Main page
├── assets/              Help modal figures (Type B schematic)
├── styles.css           Layout and dark theme
├── materials.js         Legacy fixed S (deprecated; use tables/table-a1.js)
├── tables/
│   ├── table-a1.js      Table A-1 lookup (Chapter II)
│   ├── table-k1.js      Table K-1 lookup (Chapter IX)
│   ├── A1.pdf           Source PDF (Table A-1, not required on hosting)
│   └── K1.pdf           Source PDF (Table K-1, not required on hosting)
├── app.js               UI, validation, calculations, export
├── favicon.svg
├── pcc2-chat-icon.svg   Chat icon source (optional edit asset)
├── sitemap.xml          SEO (hosting)
├── googleaab751f69310ca84.html   Google Search Console (optional)
└── README.md
```

## Usage

Open `SleeveCalc.html` in a modern browser. No build step.

1. Enter defect dimensions (s, c)
2. Enter sleeve parameters (THK, OD, GAP, CA, material)
3. Enter process data (MAWP, Tmax; Y and E for P &lt; 690 bar — S from Table A-1 at Tmax)
4. Click **Run Sleeve THK Calculation**
5. Export log to PNG or copy to clipboard

## Input validation

| Field | Rule |
|-------|------|
| s, c | Integer ≥ 1 |
| THK, OD, P | Number &gt; 0 |
| GAP, CA, Y | Number ≥ 0 |
| Tmax | Integer |
| P ≥ 690 bar | Valid Table K-1 S at Tmax; D − 2·CA &gt; 0 (D = OD + 2·GAP + 2·THK) |
| P &lt; 690 bar | Valid Table A-1 S at Tmax; D &gt; 0; 2·(S·E + P·Y) &gt; 0 |

## Origin

Migrated from a VB.NET AutoCAD plugin (palette UI only). Web calculator aligned with B31.3 Chapter II and high-pressure Eq. (34a).

**Related repo (different project):** [ASME_PCC_2](https://github.com/Agrestor666/ASME_PCC_2) — original AutoCAD/VB.NET sleeve tool, not this web app.
