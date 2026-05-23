/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const lookupCore = fs.readFileSync(path.join(root, "stress-lookup.js"), "utf8");
const a1 = fs.readFileSync(path.join(root, "table-a1.js"), "utf8");
const k1 = fs.readFileSync(path.join(root, "table-k1.js"), "utf8");
const ctx = new Function(
    lookupCore +
        a1 +
        k1 +
        "; return { lookupA1Stress, lookupK1Stress, A1_BY_MATERIAL, K1_BY_MATERIAL };"
)();

const materials = Object.keys(ctx.A1_BY_MATERIAL);
const temps = [40, 125, 200, 275, 300, 350, 375];
let fail = 0;

for (const mat of materials) {
    for (const t of temps) {
        const a1r = ctx.lookupA1Stress(mat, t);
        const k1r = ctx.lookupK1Stress(mat, t);
        if (!a1r) {
            console.error(`A-1 FAIL: ${mat} @ ${t}°C`);
            fail++;
        }
        if (!k1r) {
            console.error(`K-1 FAIL: ${mat} @ ${t}°C`);
            fail++;
        }
    }
}

console.log(`Checked ${materials.length} materials × ${temps.length} temps. Failures: ${fail}`);
process.exit(fail ? 1 : 0);
