/** Ch. II when P < 690 bar; Ch. IX Eq. (34a) when P ≥ 690 bar */
const P_HP_THRESHOLD_BAR = 690;

/** Semantic version — update with each release; see CHANGELOG.md */
const APP_VERSION = "1.1.0";
const CODE_BASIS = "ASME B31.3-2024 (Table A-1 / K-1, SI)";

const REGIME = { CH2: "ch2", CH9: "ch9" };

const $ = id => document.getElementById(id);
const BASE_INPUT_IDS = ["defect_s", "defect_c", "thk", "od", "gap", "corrosion_ca", "mawp", "tmax"];
const REF_INPUT_IDS = ["paz", "avis"];

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
    initTheme();
    initLanguage();
    populateMaterials();
    bindEvents();
    initHelpModal();
    applyI18nToDom();
    renderHelpModalBody();
    updatePressureUI();
    renderAppVersion();
}

function getTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
}

function initTheme() {
    const saved = localStorage.getItem("pcc2-theme");
    const theme = saved === "light" ? "light" : "dark";
    applyTheme(theme, false);
    $("btnTheme").addEventListener("click", () => {
        applyTheme(getTheme() === "dark" ? "light" : "dark");
    });
}

function applyTheme(theme, refreshI18n = true) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("pcc2-theme", theme);
    const icon = $("btnThemeIcon");
    const btn = $("btnTheme");
    if (icon) icon.textContent = theme === "light" ? "\u263E" : "\u2600";
    if (btn) {
        btn.setAttribute("data-i18n-title", theme === "light" ? "ui.themeDark" : "ui.themeLight");
        if (refreshI18n) btn.title = t(btn.getAttribute("data-i18n-title"));
    }
}

function initLanguage() {
    const saved = localStorage.getItem("pcc2-lang");
    if (saved && I18N_LOCALES.includes(saved)) setLanguage(saved);
    else setLanguage("en");

    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            setLanguage(btn.getAttribute("data-lang"));
            applyI18nToDom();
            renderHelpModalBody();
            syncHelpAppVersion();
            updatePressureUI();
            renderAppVersion();
        });
    });
}

function syncHelpAppVersion() {
    const verEl = document.getElementById("helpAppVersion");
    if (verEl) verEl.textContent = `v${APP_VERSION} · ${CODE_BASIS}`;
}

function refreshLocaleUi() {
    applyI18nToDom();
    renderHelpModalBody();
    syncHelpAppVersion();
    updatePressureUI();
    renderAppVersion();
}

function initHelpModal() {
    const modal = $("helpModal");
    const btnHelp = $("btnHelp");
    const btnClose = $("btnHelpClose");

    const openHelp = () => {
        renderHelpModalBody();
        syncHelpAppVersion();
        modal.hidden = false;
        document.body.classList.add("modal-open");
        btnClose.focus();
    };

    const closeHelp = () => {
        modal.hidden = true;
        document.body.classList.remove("modal-open");
        btnHelp.focus();
    };

    btnHelp.addEventListener("click", openHelp);
    btnClose.addEventListener("click", closeHelp);
    modal.addEventListener("click", e => {
        if (e.target === modal) closeHelp();
    });
    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && !modal.hidden) closeHelp();
    });
}

function renderAppVersion() {
    const el = $("appVersion");
    if (el) {
        el.textContent = `v${APP_VERSION} · ${CODE_BASIS}`;
    }
}

function buildLogVersionLines() {
    return [
        tEn("log.calcVer", { ver: APP_VERSION }),
        tEn("log.codeBasis", { basis: CODE_BASIS })
    ];
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
    [...REF_INPUT_IDS, ...BASE_INPUT_IDS].forEach(id => $(id).addEventListener("input", onInputChange));
    $("coeff_y").addEventListener("input", onInputChange);
    $("material").addEventListener("change", onInputChange);
    $("weld_e").addEventListener("change", onInputChange);

    $("btnCalc").addEventListener("click", runCalculation);
    $("btnExportPng").addEventListener("click", exportPng);
    $("btnExportPdf").addEventListener("click", exportPdf);
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
        banner.textContent = t("ui.bannerHp", { p: P, thr: P_HP_THRESHOLD_BAR });
    } else {
        banner.hidden = false;
        banner.textContent = t("ui.bannerCh2", { p: P, thr: P_HP_THRESHOLD_BAR });
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
        el.textContent = t("ui.selectA1");
        return;
    }

    const a1 = lookupA1Stress(mat, tmax);
    if (!a1) {
        el.hidden = false;
        el.textContent = t("ui.noA1", { mat, tmax });
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
        el.textContent = t("ui.selectK1");
        return;
    }

    const k1 = lookupK1Stress(mat, tmax);
    if (!k1) {
        el.hidden = false;
        el.textContent = t("ui.noK1", { mat, tmax });
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
    const refOk = REF_INPUT_IDS.every(id => $(id).value.trim() !== "");
    const baseOk = BASE_INPUT_IDS.every(id => $(id).value.trim() !== "");
    const regime = getRegime(readPressure());
    const regimeOk = regime != null && isRegimeInputsReady(regime);
    $("btnCalc").disabled = !(refOk && baseOk && regimeOk);
}

function validateCommon() {
    let ok = true;

    for (const id of REF_INPUT_IDS) {
        const el = $(id);
        const valid = el.value.trim() !== "";
        el.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
    }

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
        showToast(t("toast.noA1", { mat: inp.mat, tmax: inp.Tmax }), true);
        ok = false;
    }

    if (inp.D <= 0) {
        showToast(t("toast.dInvalid"), true);
        ok = false;
    }

    const denominator = 2 * (inp.a1.bar * inp.E + inp.P * inp.Y);
    if (ok && denominator <= 0) {
        showToast(t("toast.denomInvalid"), true);
        ok = false;
    }

    return ok;
}

function validateCh9(inp) {
    if (!inp.k1) {
        showToast(t("toast.noK1", { mat: inp.mat, tmax: inp.Tmax }), true);
        return false;
    }

    if (inp.D - 2 * inp.CA <= 0) {
        showToast(t("toast.ch9dInvalid"), true);
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
        PAZ: $("paz").value.trim(),
        AVIS: $("avis").value.trim(),
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
        showToast(t("toast.fixFields"), true);
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
    $("btnExportPdf").disabled = false;
    $("btnCopyLog").disabled = false;
    showToast(t("toast.calcDone"));
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
        textEl.textContent = t("ui.alertThk", { t: tFmt, thk: THK });
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
        textEl.textContent = t("ui.matInfoCh9", {
            mat: inp.mat, mpa: k1.mpa, bar: S_bar, tmax: inp.Tmax, d: D, p: inp.P
        });
    } else {
        const a1 = inp.a1;
        const a1txt = `S = ${a1.mpa} MPa (${S_bar} bar) @ ${inp.Tmax} °C`;
        textEl.textContent = t("ui.matInfoCh2", {
            mat: inp.mat, mpa: a1.mpa, bar: S_bar, tmax: inp.Tmax, e: inp.E, d: D.toFixed(1)
        });
    }
}

function buildLogReferenceSection(inp) {
    return [
        tEn("log.reference"),
        tEn("log.paz", { paz: inp.PAZ }),
        tEn("log.avis", { avis: inp.AVIS }),
        LOG_RULE
    ];
}

function buildLogInputSection(inp) {
    const { s, c, THK, OD, GAP, D, CA, mat, P, Tmax } = inp;
    return [
        tEn("log.inputData"),
        "",
        tEn("log.defectSize"),
        tEn("log.longS", { s }),
        tEn("log.circC", { c }),
        "",
        tEn("log.sleeveBlock"),
        tEn("log.thk", { thk: THK }),
        tEn("log.od", { od: OD }),
        tEn("log.gap", { gap: GAP }),
        tEn("log.dCalc", { d: D.toFixed(1) }),
        tEn("log.ca", { ca: CA }),
        tEn("log.mat", { mat }),
        "",
        tEn("log.process"),
        tEn("log.p", { p: P }),
        tEn("log.tmax", { tmax: Tmax })
    ];
}

function buildLogFooter(L, thicknessLine) {
    return [
        LOG_RULE,
        tEn("log.results"),
        "",
        thicknessLine,
        tEn("log.sleeveL", { L }),
        "",
        ...tEn("log.typeBNote"),
        LOG_RULE
    ];
}

function buildWeldEfficiencyLogNotes(E) {
    const eLabel = E >= 0.999 ? "1.00" : "0.80";
    const lines = [tEn("log.factorE", { e: eLabel })];
    lines.push(...(E >= 0.999 ? tEn("log.eNote100") : tEn("log.eNote80")));
    return lines;
}

function renderLogCh2(inp, D, denominator, t_pressure, Ts, L, S) {
    const { P, CA, Y, E, mat, Tmax, a1, OD, GAP, THK } = inp;
    const a1lines = [
        `    Table A-1 (B31.3-2024, SI): S = ${a1.mpa} MPa = ${S} bar`,
        tEn("log.tmaxA1", { tmax: Tmax }),
        a1.logLine ? `    ${a1.logLine}` : `    ${a1.note}`
    ];
    const lines = [
        ...buildLogReferenceSection(inp),
        "",
        ...buildLogVersionLines(),
        "",
        tEn("log.noteTitle"),
        tEn("log.ch2Hdr"),
        tEn("log.ch2P", { p: P, thr: P_HP_THRESHOLD_BAR }),
        LOG_RULE,
        "",
        ...buildLogInputSection(inp),
        ...a1lines,
        tEn("log.allowS", { S }),
        tEn("log.coeffY", { Y }),
        "",
        tEn("log.weld"),
        ...buildWeldEfficiencyLogNotes(E),
        tEn("log.dDetail", { od: OD, gap: GAP, thk: THK, d: D.toFixed(1) }),
        "",
        LOG_RULE,
        tEn("log.formulaCh2"),
        "",
        "    D = OD + 2·GAP + 2·THK",
        "    t = (P · D) / (2 · (S · E + P · Y)) + CA",
        `    t_pressure = (${P} × ${D.toFixed(1)}) / (2 × (${S} × ${E} + ${P} × ${Y}))`,
        `    t_pressure = ${(P * D).toFixed(1)} / ${denominator.toFixed(1)} = ${t_pressure.toFixed(1)} mm`,
        `    t = t_pressure + CA = ${t_pressure.toFixed(1)} + ${CA} = ${Ts.toFixed(1)} mm`,
        "",
        ...buildLogFooter(L, tEn("log.reqT", { t: Ts.toFixed(1) })),
        "",
        ...tEn("log.yNote"),
        "",
        ...tEn("log.sNoteA1")
    ];

    $("logContainer").textContent = lines.join("\n");
}

function renderLogCh9(inp, S, t, t_pressure, factor, exponent, expTerm, L) {
    const { P, Tmax, CA, OD, GAP, THK, D, mat } = inp;
    const k1 = inp.k1;
    const k1lines = [
        `    Table K-1 (B31.3-2024, SI): S = ${k1.mpa} MPa = ${k1.bar} bar`,
        tEn("log.tmaxK1", { tmax: Tmax }),
        k1.logLine ? `    ${k1.logLine}` : `    ${k1.note}`
    ];

    const lines = [
        ...buildLogReferenceSection(inp),
        "",
        ...buildLogVersionLines(),
        "",
        tEn("log.noteTitle"),
        tEn("log.ch9Hdr"),
        tEn("log.ch9P", { p: P, thr: P_HP_THRESHOLD_BAR }),
        LOG_RULE,
        "",
        ...buildLogInputSection(inp),
        ...k1lines,
        "",
        LOG_RULE,
        tEn("log.formulaCh9"),
        "",
        "    D = OD + 2·GAP + 2·THK",
        "    t = ((D − 2·CA) / 2) · (1 − exp(−1.155 · P / S)) + CA",
        `    D = ${OD} + 2×${GAP} + 2×${THK} = ${D.toFixed(1)} mm`,
        `    (D − 2·CA) / 2 = (${D.toFixed(1)} − 2×${CA}) / 2 = ${factor.toFixed(4)} mm`,
        `    exp(${exponent.toFixed(6)}) = ${expTerm.toFixed(6)}`,
        `    t_pressure = ${factor.toFixed(4)} × (1 − ${expTerm.toFixed(6)}) = ${t_pressure.toFixed(4)} mm`,
        `    t = t_pressure + CA = ${t_pressure.toFixed(4)} + ${CA} = ${t.toFixed(4)} mm`,
        "",
        ...buildLogFooter(L, tEn("log.reqT", { t: t.toFixed(3) })),
        "",
        ...tEn("log.sNoteK1")
    ];

    $("logContainer").textContent = lines.join("\n");
}

/* ── Export ── */

function getLogExportFilename(ext) {
    const paz = ($("paz").value || "").trim().replace(/[^\w.-]+/g, "_");
    const avis = ($("avis").value || "").trim().replace(/[^\w.-]+/g, "_");
    const base = paz && avis ? `SleeveCalc_${paz}_${avis}` : "SleeveCalc_Report";
    return `${base}.${ext}`;
}

function buildLogCanvas() {
    const text = $("logContainer").textContent;
    if (!text) return null;

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

    const bg = getComputedStyle(document.documentElement).getPropertyValue("--log-export-bg").trim() || "#1a1e24";
    const fg = getComputedStyle(document.documentElement).getPropertyValue("--log-export-text").trim() || "#e6edf3";
    const rule = getComputedStyle(document.documentElement).getPropertyValue("--log-export-rule").trim() || "#3d444d";

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = rule;
    ctx.fillRect(0, 0, canvas.width, 4);

    ctx.font = font;
    ctx.textBaseline = "top";

    for (let i = 0; i < lines.length; i++) {
        ctx.fillStyle = lines[i].startsWith("═") ? rule : fg;
        ctx.fillText(lines[i], padX, padY + i * lineHeight);
    }

    return canvas;
}

function exportPng() {
    const canvas = buildLogCanvas();
    if (!canvas) return;

    canvas.toBlob(blob => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = getLogExportFilename("png");
        a.click();
        URL.revokeObjectURL(a.href);
        showToast(t("toast.pngDone"));
    }, "image/png");
}

function exportPdf() {
    const canvas = buildLogCanvas();
    if (!canvas) return;

    if (!window.jspdf?.jsPDF) {
        showToast(t("toast.pdfLib"), true);
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 24;
    const printableWidth = pageWidth - margin * 2;
    const printableHeight = pageHeight - margin * 2;
    const scale = printableWidth / canvas.width;
    const sliceHeightPx = Math.floor(printableHeight / scale);

    let y = 0;
    let pageIndex = 0;

    while (y < canvas.height) {
        const sliceH = Math.min(sliceHeightPx, canvas.height - y);
        const slice = document.createElement("canvas");
        slice.width = canvas.width;
        slice.height = sliceH;
        const sctx = slice.getContext("2d");
        sctx.drawImage(canvas, 0, y, canvas.width, sliceH, 0, 0, canvas.width, sliceH);

        if (pageIndex > 0) pdf.addPage();
        pdf.addImage(
            slice.toDataURL("image/png"),
            "PNG",
            margin,
            margin,
            printableWidth,
            sliceH * scale
        );

        y += sliceH;
        pageIndex += 1;
    }

    pdf.save(getLogExportFilename("pdf"));
    showToast(t("toast.pdfDone"));
}

function copyLog() {
    const text = $("logContainer").textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => showToast(t("toast.copied")));
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
