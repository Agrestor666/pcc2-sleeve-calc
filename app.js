/** Ch. II when P < 690 bar; Ch. IX Eq. (34a) when P ≥ 690 bar */
const P_HP_THRESHOLD_BAR = 690;

const REGIME = { CH2: "ch2", CH9: "ch9" };

const $ = id => document.getElementById(id);
const BASE_INPUT_IDS = ["defect_s", "defect_c", "thk", "od", "gap", "corrosion_ca", "mawp", "tmax"];

const LOG_RULE = "═══════════════════════════════════════════════";

/* ── Regime helpers ── */

function isHighPressure(P) {
    return P >= P_HP_THRESHOLD_BAR;
}

function getRegime(P) {
    if (isNaN(P)) return null;
    return isHighPressure(P) ? REGIME.CH9 : REGIME.CH2;
}

function readPressure() {
    const v = parseFloat($("mawp").value);
    return isNaN(v) ? NaN : v;
}

function formatThickness(value, regime) {
    return regime === REGIME.CH9 ? value.toFixed(3) : value.toFixed(1);
}

/** Sleeve outside diameter: D = OD + 2·GAP + 2·THK (pipe OD + annular gap each side + both walls). */
function sleeveOutsideDiameter(OD, GAP, THK) {
    return OD + 2 * GAP + 2 * THK;
}

/* ── Initialization ── */

function init() {
    populateMaterials();
    bindEvents();
    updatePressureUI();
}

function populateMaterials() {
    const sel = $("material");
    const a1Keys = typeof A1_BY_MATERIAL !== "undefined" ? Object.keys(A1_BY_MATERIAL) : [];
    const k1Keys = typeof K1_BY_MATERIAL !== "undefined" ? Object.keys(K1_BY_MATERIAL) : [];
    const mats = [...new Set([...a1Keys, ...k1Keys, ...Object.keys(SValues)])];
    for (const mat of mats.sort()) {
        const opt = document.createElement("option");
        opt.value = mat;
        opt.textContent = mat;
        sel.appendChild(opt);
    }
}

function bindEvents() {
    BASE_INPUT_IDS.forEach(id => $(id).addEventListener("input", onInputChange));
    $("coeff_y").addEventListener("input", onInputChange);
    $("material").addEventListener("change", onInputChange);
    $("weld_e").addEventListener("change", onInputChange);

    $("btnCalc").addEventListener("click", runCalculation);
    $("btnExportPng").addEventListener("click", exportPng);
    $("btnCopyLog").addEventListener("click", copyLog);
}

function onInputChange() {
    updatePressureUI();
    checkReady();
}

/* ── UI: pressure regime ── */

function updatePressureUI() {
    const P = readPressure();
    const regime = getRegime(P);
    const hp = regime === REGIME.CH9;
    const known = regime != null;

    $("fieldGroupCh2").hidden = hp;
    $("fieldGroupCh2Weld").hidden = hp;
    $("fieldGroupCh9").hidden = !hp;

    $("formulaCh2Box").classList.toggle("formula-box--inactive", hp);
    $("formulaCh9Box").classList.toggle("formula-box--inactive", !known || !hp);

    $("outputResultsCh2").hidden = hp;
    $("outputResultsCh9").hidden = !hp;

    const banner = $("pressureRegimeBanner");
    if (!known) {
        banner.hidden = true;
    } else if (hp) {
        banner.hidden = false;
        banner.textContent =
            `P = ${P} bar ≥ ${P_HP_THRESHOLD_BAR} bar — Chapter IX Eq. (34a) active; Chapter II formula shown inactive.`;
    } else {
        banner.hidden = false;
        banner.textContent =
            `P = ${P} bar < ${P_HP_THRESHOLD_BAR} bar — Chapter II formula active; high-pressure formula shown inactive.`;
    }

    updateK1StressDisplay();
    updateA1StressDisplay();
}

function updateA1StressDisplay() {
    const el = $("a1StressDisplay");
    const regime = getRegime(readPressure());

    if (regime !== REGIME.CH2) {
        el.hidden = true;
        el.textContent = "";
        return;
    }

    const mat = $("material").value;
    const tmax = parseFloat($("tmax").value);
    if (!mat || isNaN(tmax)) {
        el.hidden = false;
        el.textContent = "Select material and Tmax to look up S in Table A-1.";
        return;
    }

    const a1 = lookupA1Stress(mat, tmax);
    if (!a1) {
        el.hidden = false;
        el.textContent = `No Table A-1 data for “${mat}” at ${tmax} °C — check material or edition.`;
        return;
    }

    el.hidden = false;
    el.textContent = a1.logLine
        ? `${a1.logLine}  →  S = ${a1.mpa} MPa (${a1.bar} bar).`
        : `Table A-1: S = ${a1.mpa} MPa (${a1.bar} bar) at Tmax = ${tmax} °C. ${a1.note}`;
}

function updateK1StressDisplay() {
    const el = $("k1StressDisplay");
    const regime = getRegime(readPressure());

    if (regime !== REGIME.CH9) {
        el.hidden = true;
        el.textContent = "";
        return;
    }

    const mat = $("material").value;
    const tmax = parseFloat($("tmax").value);
    if (!mat || isNaN(tmax)) {
        el.hidden = false;
        el.textContent = "Select material and Tmax to look up S in Table K-1.";
        return;
    }

    const k1 = lookupK1Stress(mat, tmax);
    if (!k1) {
        el.hidden = false;
        el.textContent = `No Table K-1 data for “${mat}” at ${tmax} °C — check material or edition.`;
        return;
    }

    el.hidden = false;
    el.textContent = k1.logLine
        ? `${k1.logLine}  →  S = ${k1.mpa} MPa (${k1.bar} bar).`
        : `Table K-1: S = ${k1.mpa} MPa (${k1.bar} bar) at Tmax = ${tmax} °C. ${k1.note}`;
}

/* ── Form state ── */

function isRegimeInputsReady(regime) {
    const mat = $("material").value;
    const tmax = parseFloat($("tmax").value);
    if (regime === REGIME.CH9) {
        return mat && !isNaN(tmax) && lookupK1Stress(mat, tmax) != null;
    }
    if (regime === REGIME.CH2) {
        return (
            $("coeff_y").value.trim() !== "" &&
            mat &&
            !isNaN(tmax) &&
            lookupA1Stress(mat, tmax) != null
        );
    }
    return false;
}

function checkReady() {
    const baseOk = BASE_INPUT_IDS.every(id => $(id).value.trim() !== "");
    const regime = getRegime(readPressure());
    const regimeOk = regime != null && isRegimeInputsReady(regime);
    $("btnCalc").disabled = !(baseOk && regimeOk);
}

function validateCommon() {
    let ok = true;

    for (const id of BASE_INPUT_IDS) {
        const el = $(id);
        const v = parseFloat(el.value);
        let valid = true;

        if (id === "defect_s" || id === "defect_c") {
            valid = Number.isInteger(v) && v >= 1;
        } else if (id === "corrosion_ca" || id === "gap") {
            valid = !isNaN(v) && v >= 0;
        } else if (id === "tmax") {
            valid = Number.isInteger(v);
        } else {
            valid = !isNaN(v) && v > 0;
        }

        el.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
    }

    return ok;
}

function validateCh2(inp) {
    let ok = true;
    const yEl = $("coeff_y");
    const Y = parseFloat(yEl.value);
    const yOk = !isNaN(Y) && Y >= 0;
    yEl.classList.toggle("invalid", !yOk);
    if (!yOk) ok = false;

    if (!inp.a1) {
        showToast(`Table A-1: no allowable stress for ${inp.mat} at ${inp.Tmax} °C.`, true);
        ok = false;
    }

    if (inp.D <= 0) {
        showToast("Sleeve outside diameter D = OD + 2·GAP + 2·THK must be > 0.", true);
        ok = false;
    }

    const denominator = 2 * (inp.a1.bar * inp.E + inp.P * inp.Y);
    if (ok && denominator <= 0) {
        showToast("Denominator 2·(S·E + P·Y) ≤ 0 — check S, E, P, and Y.", true);
        ok = false;
    }

    return ok;
}

function validateCh9(inp) {
    if (!inp.k1) {
        showToast(`Table K-1: no allowable stress for ${inp.mat} at ${inp.Tmax} °C.`, true);
        return false;
    }

    if (inp.D - 2 * inp.CA <= 0) {
        showToast("Ch. IX: require D − 2·CA > 0 (D = OD + 2·GAP + 2·THK; check OD, GAP, THK, CA).", true);
        return false;
    }

    return true;
}

/* ── Calculation ── */

function readInputs() {
    const mat = $("material").value;
    const Tmax = parseFloat($("tmax").value);
    const k1 = lookupK1Stress(mat, Tmax);
    const a1 = lookupA1Stress(mat, Tmax);

    const THK = parseFloat($("thk").value);
    const OD = parseFloat($("od").value);
    const GAP = parseFloat($("gap").value);

    return {
        s: parseInt($("defect_s").value, 10),
        c: parseInt($("defect_c").value, 10),
        THK,
        OD,
        GAP,
        D: sleeveOutsideDiameter(OD, GAP, THK),
        P: parseFloat($("mawp").value),
        Tmax,
        Y: parseFloat($("coeff_y").value),
        CA: parseFloat($("corrosion_ca").value),
        E: parseFloat($("weld_e").value),
        mat,
        a1,
        k1
    };
}

function computeSleeveCh2({ D, P, S, E, Y, s }) {
    const denominator = 2 * (S * E + P * Y);
    const t_pressure = (P * D) / denominator;
    const L = s + 100;
    return { D, denominator, t_pressure, L };
}

function computeCh9Thickness({ D, CA, P, S }) {
    const factor = (D - 2 * CA) / 2;
    const exponent = -1.155 * (P / S);
    const expTerm = Math.exp(exponent);
    const t_pressure = factor * (1 - expTerm);
    const t = t_pressure + CA;
    return { t, t_pressure, factor, exponent, expTerm };
}

function runCalculation() {
    if (!validateCommon()) {
        showToast("Please fix invalid fields", true);
        return;
    }

    const inp = readInputs();
    const regime = getRegime(inp.P);

    if (regime === REGIME.CH9) {
        if (!validateCh9(inp)) return;
        runCh9Calculation(inp);
    } else {
        if (!validateCh2(inp)) return;
        runCh2Calculation(inp);
    }

    $("btnExportPng").disabled = false;
    $("btnCopyLog").disabled = false;
    showToast("Calculation complete");
}

function runCh2Calculation(inp) {
    const S = inp.a1.bar;
    const { D, denominator, t_pressure, L } = computeSleeveCh2({ ...inp, S });
    const Ts = t_pressure + inp.CA;

    renderResults(Ts, L, REGIME.CH2);
    renderMaterialInfo(inp, D, REGIME.CH2, S);
    renderLogCh2(inp, D, denominator, t_pressure, Ts, L, S);
    checkThicknessAdequacy(Ts, inp.THK, REGIME.CH2);
    updatePressureUI();
}

function runCh9Calculation(inp) {
    const S = inp.k1.bar;
    const { t, t_pressure, factor, exponent, expTerm } = computeCh9Thickness({
        D: inp.D,
        CA: inp.CA,
        P: inp.P,
        S
    });
    const L = inp.s + 100;

    renderResults(t, L, REGIME.CH9);
    renderMaterialInfo(inp, inp.D, REGIME.CH9, S);
    renderLogCh9(inp, S, t, t_pressure, factor, exponent, expTerm, L);
    checkThicknessAdequacy(t, inp.THK, REGIME.CH9);
    updatePressureUI();
}

/* ── THK adequacy check ── */

function checkThicknessAdequacy(tRequired, THK, regime) {
    const isCh9 = regime === REGIME.CH9;
    const alertEl = isCh9 ? $("alertThkCh9") : $("alertThkCh2");
    const textEl = isCh9 ? $("alertThkTextCh9") : $("alertThkTextCh2");

    if (tRequired > THK) {
        const tFmt = isCh9 ? tRequired.toFixed(3) : tRequired.toFixed(1);
        textEl.textContent =
            `Calculated t = ${tFmt} mm exceeds assumed sleeve THK = ${THK} mm. ` +
            `Increase THK to at least ${tFmt} mm.`;
        alertEl.hidden = false;
    } else {
        alertEl.hidden = true;
    }
}

/* ── Rendering ── */

function renderResults(thickness, L, regime) {
    const tStr = formatThickness(thickness, regime);
    if (regime === REGIME.CH9) {
        $("outTminCh9").textContent = tStr;
        $("outLCh9").textContent = L;
    } else {
        $("outTminCh2").textContent = tStr;
        $("outLCh2").textContent = L;
    }
}

function renderMaterialInfo(inp, D, regime, S_bar) {
    const isCh9 = regime === REGIME.CH9;
    const infoEl = isCh9 ? $("materialInfoCh9") : $("materialInfoCh2");
    const textEl = isCh9 ? $("materialInfoTextCh9") : $("materialInfoTextCh2");
    infoEl.style.display = "flex";

    if (isCh9) {
        const k1 = inp.k1;
        const k1txt = `S = ${k1.mpa} MPa (${S_bar} bar) @ ${inp.Tmax} °C`;
        textEl.textContent =
            `Material: ${inp.mat}  |  ${k1txt}  |  D = ${D} mm  |  P = ${inp.P} bar`;
    } else {
        const a1 = inp.a1;
        const a1txt = `S = ${a1.mpa} MPa (${S_bar} bar) @ ${inp.Tmax} °C`;
        textEl.textContent =
            `Material: ${inp.mat}  |  ${a1txt}  |  E = ${inp.E}  |  D = ${D.toFixed(1)} mm`;
    }
}

function buildLogInputSection(inp) {
    const { s, c, THK, OD, GAP, D, CA, mat, P, Tmax } = inp;
    return [
        "Input Data:",
        "",
        "  Size of defect",
        `    Longitudinal              s  = ${s} mm`,
        `    Circumferential           c  = ${c} mm  (record only)`,
        "",
        "  Predicted sleeve parameters and parent pipe",
        `    Wall thickness (sleeve)  THK = ${THK} mm`,
        `    Outside diameter (pipe)   OD = ${OD} mm`,
        `    Gap (sleeve bore ↔ pipe) GAP = ${GAP} mm  (radial, each side)`,
        `    Sleeve outside diameter    D = OD + 2·GAP + 2·THK = ${D.toFixed(1)} mm`,
        `    Corrosion allowance        CA = ${CA} mm`,
        `    Material                     = ${mat}`,
        "",
        "  Process info",
        `    Design pressure            P = ${P} bar`,
        `    Design temperature      Tmax = ${Tmax} °C`
    ];
}

function buildLogFooter(L, thicknessLine) {
    return [
        LOG_RULE,
        "Results:",
        "",
        thicknessLine,
        `    Sleeve length               L = ${L} mm`,
        "",
        "  Note: Type B sleeve designed for 100% of design",
        "  pressure — no credit for remaining carrier pipe wall.",
        LOG_RULE
    ];
}

function renderLogCh2(inp, D, denominator, t_pressure, Ts, L, S) {
    const { P, CA, Y, E, mat, Tmax, a1, OD, GAP, THK } = inp;
    const a1lines = [
        `    Table A-1 (B31.3-2024, SI): S = ${a1.mpa} MPa = ${S} bar`,
        `    Tmax = ${Tmax} °C, interpolated per Appendix A`,
        a1.logLine ? `    ${a1.logLine}` : `    ${a1.note}`
    ];
    const lines = [
        "Sleeve Type B — Calculation Note",
        "Per ASME PCC-2 Art. 2.6 / ASME B31.3 Chapter II",
        `Design pressure P = ${P} bar (< ${P_HP_THRESHOLD_BAR} bar → Chapter II)`,
        LOG_RULE,
        "",
        ...buildLogInputSection(inp),
        ...a1lines,
        `    Allowable stress           S = ${S} bar`,
        `    Coefficient                Y = ${Y}  (B31.3 Table 304.1.1; default 0.4 → ferritic, T ≤ 482 °C typical)`,
        "",
        "  Weld joint efficiency",
        `    Factor                     E = ${E}`,
        `    D = OD + 2·GAP + 2·THK = ${OD} + 2×${GAP} + 2×${THK} = ${D.toFixed(1)} mm`,
        "",
        LOG_RULE,
        "Formula (Chapter II):",
        "",
        "    D = OD + 2·GAP + 2·THK",
        "    t = (P · D) / (2 · (S · E + P · Y)) + CA",
        `    t_pressure = (${P} × ${D.toFixed(1)}) / (2 × (${S} × ${E} + ${P} × ${Y}))`,
        `    t_pressure = ${(P * D).toFixed(1)} / ${denominator.toFixed(1)} = ${t_pressure.toFixed(1)} mm`,
        `    t = t_pressure + CA = ${t_pressure.toFixed(1)} + ${CA} = ${Ts.toFixed(1)} mm`,
        "",
        ...buildLogFooter(L, `    Required sleeve thickness   t = ${Ts.toFixed(1)} mm  (incl. CA)`),
        "",
        "  Note (Y): Default 0.4 aligns with ASME B31.3 Table 304.1.1",
        "  for ferritic steels typically when design temperature ≤ 482 °C",
        "  (900 °F), with other code conditions; use another Y if not applicable.",
        "",
        "  Note (S): Table A-1 from B31.3-2024 Appendix A (A1.pdf, SI units);",
        "  materials without an A-1 row use conservative mapping — verify."
    ];

    $("logContainer").textContent = lines.join("\n");
}

function renderLogCh9(inp, S, t, t_pressure, factor, exponent, expTerm, L) {
    const { P, Tmax, CA, OD, GAP, THK, D, mat } = inp;
    const k1 = inp.k1;
    const k1lines = [
        `    Table K-1 (B31.3-2024, SI): S = ${k1.mpa} MPa = ${k1.bar} bar`,
        `    Tmax = ${Tmax} °C, interpolated per Appendix K`,
        k1.logLine ? `    ${k1.logLine}` : `    ${k1.note}`
    ];

    const lines = [
        "Sleeve Type B — Calculation Note",
        "Per ASME PCC-2 Art. 2.6 / ASME B31.3 Chapter IX (high pressure)",
        `Design pressure P = ${P} bar (≥ ${P_HP_THRESHOLD_BAR} bar → Eq. 34a)`,
        LOG_RULE,
        "",
        ...buildLogInputSection(inp),
        ...k1lines,
        "",
        LOG_RULE,
        "Formula (K304.1.2 — Eq. 34a):",
        "",
        "    D = OD + 2·GAP + 2·THK",
        "    t = ((D − 2·CA) / 2) · (1 − exp(−1.155 · P / S)) + CA",
        `    D = ${OD} + 2×${GAP} + 2×${THK} = ${D.toFixed(1)} mm`,
        `    (D − 2·CA) / 2 = (${D.toFixed(1)} − 2×${CA}) / 2 = ${factor.toFixed(4)} mm`,
        `    exp(${exponent.toFixed(6)}) = ${expTerm.toFixed(6)}`,
        `    t_pressure = ${factor.toFixed(4)} × (1 − ${expTerm.toFixed(6)}) = ${t_pressure.toFixed(4)} mm`,
        `    t = t_pressure + CA = ${t_pressure.toFixed(4)} + ${CA} = ${t.toFixed(4)} mm`,
        "",
        ...buildLogFooter(L, `    Required sleeve thickness   t = ${t.toFixed(3)} mm  (incl. CA)`),
        "",
        "  Note (S): Table K-1 from B31.3-2024 Appendix K (K1.pdf, SI units);",
        "  materials without a K-1 row use conservative mapping — verify."
    ];

    $("logContainer").textContent = lines.join("\n");
}

/* ── Export ── */

function exportPng() {
    const text = $("logContainer").textContent;
    if (!text) return;

    const lines = text.split("\n");
    const font = "13px Consolas, 'Cascadia Code', monospace";
    const lineHeight = 20;
    const padX = 32;
    const padY = 24;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = font;

    let maxW = 0;
    for (const line of lines) {
        const w = ctx.measureText(line).width;
        if (w > maxW) maxW = w;
    }

    canvas.width = maxW + padX * 2;
    canvas.height = lines.length * lineHeight + padY * 2;

    ctx.fillStyle = "#1a1e24";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#22272e";
    ctx.fillRect(0, 0, canvas.width, 4);

    ctx.font = font;
    ctx.fillStyle = "#e6edf3";
    ctx.textBaseline = "top";

    for (let i = 0; i < lines.length; i++) {
        ctx.fillStyle = lines[i].startsWith("═") ? "#3d444d" : "#e6edf3";
        ctx.fillText(lines[i], padX, padY + i * lineHeight);
    }

    canvas.toBlob(blob => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "SleeveCalc_Report.png";
        a.click();
        URL.revokeObjectURL(a.href);
        showToast("PNG exported");
    }, "image/png");
}

function copyLog() {
    const text = $("logContainer").textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => showToast("Copied to clipboard"));
}

/* ── Toast ── */

function showToast(msg, isError) {
    const t = $("toast");
    t.textContent = msg;
    t.style.background = isError ? "var(--red)" : "var(--green)";
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2500);
}

init();
