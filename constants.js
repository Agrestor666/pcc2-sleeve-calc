/** Ch. II when P < 690 bar; Ch. IX Eq. (34a) when P ≥ 690 bar */
const P_HP_THRESHOLD_BAR = 690;

/** Semantic version — update with each release; see CHANGELOG.md */
const APP_VERSION = "1.3.1";
const CODE_BASIS = "ASME B31.3-2024 (Table A-1 / K-1, SI)";

const REGIME = { CH2: "ch2", CH9: "ch9" };

const LOG_RULE = "═══════════════════════════════════════════════";

const BASE_INPUT_IDS = ["defect_s", "defect_c", "thk", "od", "gap", "corrosion_ca", "mawp", "tmax"];
const REF_INPUT_IDS = ["paz", "avis"];

/** Totalenergies wall-thickness sheet (GS): D < 18" NPS → 12.5%, D >= 18" NPS → 8% */
const MILL_DEFAULT_OD_BREAK_MM = 457.2;
const MILL_DEFAULT_TOL_SMALL_PCT = 12.5;
const MILL_DEFAULT_TOL_LARGE_PCT = 8.0;
const MILL_INPUT_IDS = ["mill_od_break", "mill_tol_small", "mill_tol_large"];
