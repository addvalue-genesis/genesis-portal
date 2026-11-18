const assert = require("node:assert/strict");
const path = require("node:path");
const babel = require("@babel/core");

const root = path.resolve(__dirname, "../src");
const original = require.extensions[".js"];
for (const ext of [".js", ".jsx"]) {
  require.extensions[ext] = (m, f) =>
    f.startsWith(root + path.sep)
      ? m._compile(
          babel.transformFileSync(f, {
            babelrc: false,
            configFile: false,
            presets: [["@babel/preset-env", { targets: { node: "current" } }], "@babel/preset-react"],
          }).code,
          f
        )
      : original(m, f);
}
require.extensions[".css"] = () => {};

const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { buildReleaseCommercialModel0553 } = require("../src/project0553/data/releaseCommercialModel0553");
const { selectCurrentReleaseRev03_0553 } = require("../src/project0553/data/officialUsdRelease0553");
const {
  OfficialUsdRelease0553,
  buildRev03PartABreakdown0553,
  resolveOfficialTier0553,
} = require("../src/project0553/OfficialUsdRelease0553");

// 1. Tier mapping (R2)
assert.equal(resolveOfficialTier0553("INTERNAL"), "SI");
assert.equal(resolveOfficialTier0553("SAMTEL"), "VND");
assert.equal(resolveOfficialTier0553("JUTAL_CNEEC"), "CUS");
assert.equal(resolveOfficialTier0553("UNKNOWN_EXTERNAL"), "CUS");

// 2. Rev03 Part A 141-row allocation & reconciliation (R1)
const source = buildReleaseCommercialModel0553({ thbPerUsd: 31.5 });
const rev03 = selectCurrentReleaseRev03_0553();
const breakdown = buildRev03PartABreakdown0553(source, rev03);
assert.ok(breakdown, "Rev03 breakdown should be derived");
assert.equal(breakdown.groups.length, 4);
assert.equal(
  breakdown.groups.reduce((n, g) => n + g.rows.length, 0),
  141,
  "Part A breakdown must retain all 141 rows"
);
assert.equal(breakdown.reconciled, true, "Rev03 breakdown must reconcile to Rev03 A1-A4 totals");
for (const g of breakdown.groups) {
  const expected = rev03.rows.find((r) => r.code === g.code).amountUSD;
  assert.equal(g.parentUSD, expected);
  assert.ok(Number.isFinite(g.rawUSD), `${g.code} rawUSD must be computed`);
  assert.ok(Number.isFinite(g.driftPct), `${g.code} driftPct must be computed`);
  assert.ok(Math.abs(g.totalUSD - expected) <= 0.01, `${g.code} sum must match Rev03 within 0.01 USD`);
}
// Drift detection check (>0.5% raw drift vs Rev03)
const driftedSource = {
  ...source,
  a: source.a.map((g) => (g.code === "A1" ? { ...g, previewSellTHB: g.previewSellTHB * 1.1 } : g)),
};
const drifted = buildRev03PartABreakdown0553(driftedSource, rev03);
assert.equal(drifted.anyDrift, true, "Drift > 0.5% must flag anyDrift");
assert.equal(drifted.groups.find((g) => g.code === "A1").hasDrift, true);

// 3. Visibility, export-gate (S2), & zero-leak checks via renderToStaticMarkup (R3, R4)
const cusHtml = renderToStaticMarkup(
  React.createElement(OfficialUsdRelease0553, { source, recipient: "JUTAL_CNEEC" })
);
const forbiddenInCus = [
  "customerSellTHB",
  "Item 7",
  "directCost",
  "sourceModuleId",
  "sourceRef",
  "Trace",
  "INTERNAL",
  "ซ่อนราคาย่อย",
  "แสดงราคาย่อย",
  "บันทึกฉบับก่อน",
];
for (const term of forbiddenInCus) {
  assert.equal(cusHtml.includes(term), false, `CUS output must not contain "${term}"`);
}
assert.equal(cusHtml.includes('data-viewer-tier="CUS"'), true);
assert.equal(cusHtml.includes("data-official-bom-detail"), false, "CUS breakdown must default collapsed");
assert.equal(cusHtml.includes('aria-expanded="false"'), true);

const vndHtml = renderToStaticMarkup(
  React.createElement(OfficialUsdRelease0553, { source, recipient: "SAMTEL" })
);
const forbiddenInVnd = [
  "SAMTEL 5%",
  "customerSellTHB",
  "directCost",
  "sourceModuleId",
  "sourceRef",
  "Trace",
  "INTERNAL",
  "ซ่อนราคาย่อย",
  "แสดงราคาย่อย",
  "บันทึกฉบับก่อน",
];
for (const term of forbiddenInVnd) {
  assert.equal(vndHtml.includes(term), false, `VND output must not contain "${term}"`);
}
assert.equal(vndHtml.includes('data-viewer-tier="VND"'), true);
assert.equal(vndHtml.includes("data-official-bom-detail"), false, "VND breakdown must default collapsed");

// 4. Negative control (S4): SI mode MUST contain internal strings so leak grep is proven active
const siHtml = renderToStaticMarkup(
  React.createElement(OfficialUsdRelease0553, { source, recipient: "INTERNAL" })
);
assert.equal(siHtml.includes('data-viewer-tier="SI"'), true);
assert.equal(siHtml.includes("RECONCILED (SI)"), true);
assert.equal(siHtml.includes("ซ่อนราคาย่อย"), true);
assert.equal(siHtml.includes("แสดงราคาย่อย"), true);
assert.equal(siHtml.includes("บันทึกฉบับก่อน"), true);
assert.equal(siHtml.includes("A1 raw"), true);

console.log("PASS: 0553 Official 10.3.4 BOM breakdown reconciliation & CUS/VND/SI visibility checks");
