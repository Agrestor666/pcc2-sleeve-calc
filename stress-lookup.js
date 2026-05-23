/**
 * Shared MPa interpolation and factory for B31.3 tabulated allowable stress.
 * Table-specific data (rows, temperature grid, fallback chains) stays in table-a1.js / table-k1.js only;
 * each call to createB31StressLookup(...) closes over one table’s maps so A-1 and K-1 never mix.
 */
const MPA_TO_BAR = 10;

function interpolateStressMpa(mpaRow, tempGrid, tempC) {
    if (!mpaRow || !tempGrid || tempGrid.length === 0) return null;
    if (tempC <= tempGrid[0]) {
        for (let i = 0; i < mpaRow.length; i++) {
            if (mpaRow[i] != null) return mpaRow[i];
        }
        return null;
    }
    const lastIdx = tempGrid.length - 1;
    if (tempC >= tempGrid[lastIdx]) {
        for (let i = lastIdx; i >= 0; i--) {
            if (mpaRow[i] != null) return mpaRow[i];
        }
        return null;
    }
    let loIdx = -1;
    let hiIdx = -1;
    for (let i = 0; i < tempGrid.length; i++) {
        if (mpaRow[i] == null) continue;
        if (tempGrid[i] <= tempC) loIdx = i;
        if (tempGrid[i] >= tempC && hiIdx < 0) hiIdx = i;
    }
    if (loIdx < 0 && hiIdx < 0) return null;
    if (loIdx < 0) return mpaRow[hiIdx];
    if (hiIdx < 0) return mpaRow[loIdx];
    if (loIdx === hiIdx) return mpaRow[loIdx];
    const t0 = tempGrid[loIdx];
    const t1 = tempGrid[hiIdx];
    const s0 = mpaRow[loIdx];
    const s1 = mpaRow[hiIdx];
    const f = (tempC - t0) / (t1 - t0);
    return s0 + f * (s1 - s0);
}

/**
 * @param {{ tableId: string, byMaterial: Record<string, { mpa: (number|null)[], note?: string }>, tempGrid: number[], materialFallback: Record<string, string[]> }} config
 * @param {string} config.tableId Log label fragment, e.g. "A-1" → "Table A-1: …"
 */
function createB31StressLookup(config) {
    const { tableId, byMaterial, tempGrid, materialFallback } = config;
    const label = `Table ${tableId}`;
    return function stressLookup(material, tempC) {
        const chain = [material, ...(materialFallback[material] || [])];
        const tried = [];
        for (const key of chain) {
            tried.push(key);
            const entry = byMaterial[key];
            if (!entry) continue;
            const mpa = interpolateStressMpa(entry.mpa, tempGrid, tempC);
            if (mpa == null || mpa <= 0) continue;
            const baseNote = entry.note || "";
            const logLine =
                key === material
                    ? `${label}: ${material} @ ${tempC} °C — ${baseNote}`
                    : `${label}: ${material} → przyjęto ${key} (zamiennik) @ ${tempC} °C — ${baseNote}`;
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
        console.warn(`[S lookup] ${label}: brak S dla ${material} @ ${tempC} °C (sprawdzono: ${tried.join(", ")})`);
        return null;
    };
}
