/* Pure calculation helpers — no DOM. Depends on constants.js (REGIME, P_HP_THRESHOLD_BAR). */

function isHighPressure(P) {
    return P >= P_HP_THRESHOLD_BAR;
}

function getRegime(P) {
    if (isNaN(P)) return null;
    return isHighPressure(P) ? REGIME.CH9 : REGIME.CH2;
}

function formatThickness(value, regime) {
    return regime === REGIME.CH9 ? value.toFixed(3) : value.toFixed(1);
}

/** Sleeve outside diameter: D = OD + 2·GAP + 2·THK (pipe OD + annular gap each side + both walls). */
function sleeveOutsideDiameter(OD, GAP, THK) {
    return OD + 2 * GAP + 2 * THK;
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

/**
 * Mill tolerance fraction f from sleeve OD D [mm] and editable breakpoints (%).
 * @param {{ odBreakMm: number, tolSmallPct: number, tolLargePct: number }} settings
 */
function millToleranceForDiameter(D, settings) {
    const useLarge = D >= settings.odBreakMm;
    const pct = useLarge ? settings.tolLargePct : settings.tolSmallPct;
    return { fraction: pct / 100, pct, band: useLarge ? "large" : "small" };
}

/** t_required = t_calculated / (1 − f_mill) */
function thicknessWithMillTolerance(tCalculated, millFraction) {
    if (!(millFraction >= 0 && millFraction < 1)) return NaN;
    return tCalculated / (1 - millFraction);
}

function applyMillTolerance(D, tCalculated, settings) {
    const mill = millToleranceForDiameter(D, settings);
    return {
        tCalculated,
        tRequired: thicknessWithMillTolerance(tCalculated, mill.fraction),
        millFraction: mill.fraction,
        millPct: mill.pct,
        millBand: mill.band
    };
}

/**
 * Bracket pipe OD to adjacent nominal rows in TR_BY_NPS (Totalenergies sheet).
 * @returns {{ rows: { nps: string, odMm: number, trMm: number }[], trMax: number, pipeOdMm: number }}
 */
function bracketRetirementThickness(pipeOdMm) {
    const table = TR_BY_NPS;
    if (!table.length) return { rows: [], trMax: 0, pipeOdMm };

    if (pipeOdMm <= table[0].odMm) {
        const row = table[0];
        return { rows: [row], trMax: row.trMm, pipeOdMm };
    }
    const last = table[table.length - 1];
    if (pipeOdMm >= last.odMm) {
        return { rows: [last], trMax: last.trMm, pipeOdMm };
    }

    let lower = table[0];
    let upper = last;
    for (let i = 0; i < table.length; i++) {
        if (table[i].odMm <= pipeOdMm) lower = table[i];
        if (table[i].odMm >= pipeOdMm) {
            upper = table[i];
            break;
        }
    }

    const rows = lower.odMm === upper.odMm ? [lower] : [lower, upper];
    const trMax = Math.max(...rows.map(r => r.trMm));
    return { rows, trMax, pipeOdMm };
}

/** Mill tolerance on sleeve D, then TR floor from bracketed pipe nominals. */
function applyThicknessWithMillAndTr(sleeveD, tCalculated, millSettings, pipeOdMm) {
    const mill = applyMillTolerance(sleeveD, tCalculated, millSettings);
    const tr = bracketRetirementThickness(pipeOdMm);
    const tAfterMill = mill.tRequired;
    const tRequired = Math.max(tAfterMill, tr.trMax);
    const trChecks = tr.rows.map(row => ({
        nps: row.nps,
        odMm: row.odMm,
        trMm: row.trMm,
        pass: tAfterMill >= row.trMm - 1e-9
    }));
    return {
        tCalculated: mill.tCalculated,
        tAfterMill,
        tRequired,
        millFraction: mill.millFraction,
        millPct: mill.millPct,
        millBand: mill.millBand,
        trBracket: tr,
        trChecks,
        trGoverned: tRequired > tAfterMill + 1e-9
    };
}
