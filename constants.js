/** Ch. II when P < 690 bar; Ch. IX Eq. (34a) when P ≥ 690 bar */
const P_HP_THRESHOLD_BAR = 690;

/** Semantic version — update with each release; see CHANGELOG.md */
const APP_VERSION = "1.1.0";
const CODE_BASIS = "ASME B31.3-2024 (Table A-1 / K-1, SI)";

const REGIME = { CH2: "ch2", CH9: "ch9" };

const LOG_RULE = "═══════════════════════════════════════════════";

const BASE_INPUT_IDS = ["defect_s", "defect_c", "thk", "od", "gap", "corrosion_ca", "mawp", "tmax"];
const REF_INPUT_IDS = ["paz", "avis"];
