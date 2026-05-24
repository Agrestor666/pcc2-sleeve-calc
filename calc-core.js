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
