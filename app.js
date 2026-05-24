/**
 * UI wiring and I/O. Loads after constants.js, calc-core.js, i18n, stress-lookup, table-a1, table-k1, materials.
 */
const $ = id => document.getElementById(id);

/** DOM ids for fields that differ between B31.3 Chapter II vs Chapter IX outputs. */
const REGIME_DOM_IDS = {
    [REGIME.CH2]: {
        outT: "outTminCh2",
        outTCalc: "outTcalcCh2",
        outMillMeta: "outMillMetaCh2",
        outL: "outLCh2",
        alertBox: "alertThkCh2",
        alertText: "alertThkTextCh2",
        materialInfo: "materialInfoCh2",
        materialInfoText: "materialInfoTextCh2",
        matInfoI18n: "ui.matInfoCh2"
    },
    [REGIME.CH9]: {
        outT: "outTminCh9",
        outTCalc: "outTcalcCh9",
        outMillMeta: "outMillMetaCh9",
        outL: "outLCh9",
        alertBox: "alertThkCh9",
        alertText: "alertThkTextCh9",
        materialInfo: "materialInfoCh9",
        materialInfoText: "materialInfoTextCh9",
        matInfoI18n: "ui.matInfoCh9"
    }
};

function readMillSettings() {
    return {
        odBreakMm: parseFloat($("mill_od_break").value),
        tolSmallPct: parseFloat($("mill_tol_small").value),
        tolLargePct: parseFloat($("mill_tol_large").value)
    };
}

function validateMillSettings() {
    let ok = true;
    const breakEl = $("mill_od_break");
    const breakV = parseFloat(breakEl.value);
    const breakOk = !isNaN(breakV) && breakV > 0;
    breakEl.classList.toggle("invalid", !breakOk);
    if (!breakOk) ok = false;

    for (const id of MILL_INPUT_IDS.slice(1)) {
        const el = $(id);
        const v = parseFloat(el.value);
        const valid = !isNaN(v) && v >= 0 && v < 100;
        el.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
    }
    return ok;
}

function readPressure() {
    const v = parseFloat($("mawp").value);
    return isNaN(v) ? NaN : v;
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
    [...REF_INPUT_IDS, ...BASE_INPUT_IDS, ...MILL_INPUT_IDS].forEach(id =>
        $(id).addEventListener("input", onInputChange)
    );
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

    updateAllowableStressDisplay(
        REGIME.CH2,
        "a1StressDisplay",
        lookupA1Stress,
        "Table A-1",
        "ui.selectA1",
        "ui.noA1"
    );
    updateAllowableStressDisplay(
        REGIME.CH9,
        "k1StressDisplay",
        lookupK1Stress,
        "Table K-1",
        "ui.selectK1",
        "ui.noK1"
    );
}

/**
 * One code path for Table A-1 vs K-1 readouts; `lookupFn` and `activeRegime` must stay paired.
 */
function updateAllowableStressDisplay(activeRegime, elementId, lookupFn, tableShortLabel, selectKey, noDataKey) {
    const el = $(elementId);
    const regime = getRegime(readPressure());
    if (regime !== activeRegime) {
        el.hidden = true;
        el.textContent = "";
        return;
    }

    const mat = $("material").value;
    const tmax = parseFloat($("tmax").value);
    if (!mat || isNaN(tmax)) {
        el.hidden = false;
        el.textContent = t(selectKey);
        return;
    }

    const row = lookupFn(mat, tmax);
    if (!row) {
        el.hidden = false;
        el.textContent = t(noDataKey, { mat, tmax });
        return;
    }

    el.hidden = false;
    el.textContent = row.logLine
        ? `${row.logLine}  →  S = ${row.mpa} MPa (${row.bar} bar).`
        : `${tableShortLabel}: S = ${row.mpa} MPa (${row.bar} bar) at Tmax = ${tmax} °C. ${row.note}`;
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
    let ok = validateMillSettings();

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
        k1,
        mill: readMillSettings()
    };
}

function buildLogMillSection(inp, D, thick, regime) {
    const { mill } = inp;
    const tCalcFmt = formatThickness(thick.tCalculated, regime);
    const tReqFmt = formatThickness(thick.tRequired, regime);
    const bandKey = thick.millBand === "large" ? "log.millBandLarge" : "log.millBandSmall";
    return [
        "",
        tEn("log.millBlock"),
        tEn("log.millBreak", { d: mill.odBreakMm }),
        tEn("log.millSmall", { pct: mill.tolSmallPct }),
        tEn("log.millLarge", { pct: mill.tolLargePct }),
        tEn(bandKey, { d: D.toFixed(1), pct: thick.millPct }),
        tEn("log.calcT", { t: tCalcFmt }),
        tEn("log.reqTMill", { tcalc: tCalcFmt, treq: tReqFmt, pct: thick.millPct })
    ];
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
    const tCalculated = t_pressure + inp.CA;
    const thick = applyMillTolerance(D, tCalculated, inp.mill);
    if (!Number.isFinite(thick.tRequired)) {
        showToast(t("toast.millInvalid"), true);
        return;
    }

    renderResults(thick, L, REGIME.CH2);
    renderMaterialInfo(inp, D, REGIME.CH2, S);
    renderLogCh2(inp, D, denominator, t_pressure, thick, L, S);
    checkThicknessAdequacy(thick.tRequired, inp.THK, REGIME.CH2);
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
    const thick = applyMillTolerance(inp.D, t, inp.mill);
    if (!Number.isFinite(thick.tRequired)) {
        showToast(t("toast.millInvalid"), true);
        return;
    }

    renderResults(thick, L, REGIME.CH9);
    renderMaterialInfo(inp, inp.D, REGIME.CH9, S);
    renderLogCh9(inp, S, t_pressure, thick, factor, exponent, expTerm, L);
    checkThicknessAdequacy(thick.tRequired, inp.THK, REGIME.CH9);
    updatePressureUI();
}

/* ── THK adequacy check ── */

function checkThicknessAdequacy(tRequired, THK, regime) {
    const ids = REGIME_DOM_IDS[regime];
    if (!ids) return;
    const alertEl = $(ids.alertBox);
    const textEl = $(ids.alertText);
    const isCh9 = regime === REGIME.CH9;

    if (tRequired > THK) {
        const tFmt = isCh9 ? tRequired.toFixed(3) : tRequired.toFixed(1);
        textEl.textContent = t("ui.alertThk", { t: tFmt, thk: THK });
        alertEl.hidden = false;
    } else {
        alertEl.hidden = true;
    }
}

/* ── Rendering ── */

function renderResults(thick, L, regime) {
    const ids = REGIME_DOM_IDS[regime];
    if (!ids) return;
    $(ids.outTCalc).textContent = formatThickness(thick.tCalculated, regime);
    $(ids.outT).textContent = formatThickness(thick.tRequired, regime);
    const mill = readMillSettings();
    const bandKey = thick.millBand === "large" ? "ui.millAppliedLarge" : "ui.millAppliedSmall";
    const meta = $(ids.outMillMeta);
    meta.textContent = t(bandKey, { pct: thick.millPct, break: mill.odBreakMm });
    meta.hidden = false;
    $(ids.outL).textContent = L;
}

function renderMaterialInfo(inp, D, regime, S_bar) {
    const ids = REGIME_DOM_IDS[regime];
    if (!ids) return;
    const textEl = $(ids.materialInfoText);
    $(ids.materialInfo).style.display = "flex";

    if (regime === REGIME.CH9) {
        const k1 = inp.k1;
        textEl.textContent = t(ids.matInfoI18n, {
            mat: inp.mat,
            mpa: k1.mpa,
            bar: S_bar,
            tmax: inp.Tmax,
            d: D,
            p: inp.P
        });
    } else {
        const a1 = inp.a1;
        textEl.textContent = t(ids.matInfoI18n, {
            mat: inp.mat,
            mpa: a1.mpa,
            bar: S_bar,
            tmax: inp.Tmax,
            e: inp.E,
            d: D.toFixed(1)
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

function renderLogCh2(inp, D, denominator, t_pressure, thick, L, S) {
    const { P, CA, Y, E, mat, Tmax, a1, OD, GAP, THK } = inp;
    const Ts = thick.tCalculated;
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
        `    t_calculated = t_pressure + CA = ${t_pressure.toFixed(1)} + ${CA} = ${Ts.toFixed(1)} mm`,
        ...buildLogMillSection(inp, D, thick, REGIME.CH2),
        "",
        ...buildLogFooter(L, tEn("log.reqT", { t: thick.tRequired.toFixed(1) })),
        "",
        ...tEn("log.yNote"),
        "",
        ...tEn("log.sNoteA1")
    ];

    $("logContainer").textContent = lines.join("\n");
}

function renderLogCh9(inp, S, t_pressure, thick, factor, exponent, expTerm, L) {
    const { P, Tmax, CA, OD, GAP, THK, D, mat } = inp;
    const t = thick.tCalculated;
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
        `    t_calculated = t_pressure + CA = ${t_pressure.toFixed(4)} + ${CA} = ${t.toFixed(4)} mm`,
        ...buildLogMillSection(inp, D, thick, REGIME.CH9),
        "",
        ...buildLogFooter(L, tEn("log.reqT", { t: thick.tRequired.toFixed(3) })),
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

function showToast(message, isError) {
    const toastEl = $("toast");
    toastEl.textContent = message;
    toastEl.style.background = isError ? "var(--red)" : "var(--green)";
    toastEl.classList.add("show");
    setTimeout(() => toastEl.classList.remove("show"), 2500);
}

init();
