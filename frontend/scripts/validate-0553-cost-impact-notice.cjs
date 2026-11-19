// Cost-impact notification guard (Rev05 §4b).
// Verifies Layer 1 (ADDVALUE receivable) & Layer 2 (SAMTEL customer release) per line
// and fails if any price delta lacks a matching signed entry in budgetChangeLog0553.js.
const assert = require("node:assert/strict");
const path = require("node:path");
const babel = require("@babel/core");

const root = path.resolve(__dirname, "../src");
const orig = require.extensions[".js"];
require.extensions[".js"] = (mod, file) => {
  if (file.startsWith(root + path.sep)) {
    const out = babel.transformFileSync(file, {
      babelrc: false,
      configFile: false,
      presets: [["@babel/preset-env", { targets: { node: "current" }, modules: "commonjs" }]],
    });
    mod._compile(out.code, file);
  } else {
    orig(mod, file);
  }
};

const { buildReleaseCommercialModel0553 } = require(path.join(
  root,
  "project0553/data/releaseCommercialModel0553.js"
));
const { buildOfficialUsdRelease0553 } = require(path.join(
  root,
  "project0553/data/officialUsdRelease0553.js"
));
const { SAMTEL_ENGINEERING_SERVICE_MARKUP_0553 } = require(path.join(
  root,
  "project0553/data/samtelEngineeringServiceMarkup0553.js"
));
const { CHANGE_LOG_VERSION_0553, RELEASE_NOTES_0553 } = require(path.join(
  root,
  "project0553/data/budgetChangeLog0553.js"
));

const roundUp = (v, inc) => inc * Math.ceil(v / inc - 1e-12);
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

const source = buildReleaseCommercialModel0553({ thbPerUsd: 31.5 });
const official = buildOfficialUsdRelease0553(source);

let layer1Total = 0;
let layer2Total = 0;
const lineDeltas = [];

for (const x of official.a) {
  const l1 = x.amountUSD || 0;
  const l2 = x.amountUSD || 0;
  layer1Total += l1;
  layer2Total += l2;
}
for (const x of official.b) {
  const rb = source.b.find((r) => r.code === x.code);
  const l1 =
    rb && rb.commercialCategory === "service" && rb.addvalueReceivableTHB != null
      ? roundUp(rb.addvalueReceivableTHB / official.policy.thbPerUsd, official.policy.seedIncrementUSD)
      : x.amountUSD || 0;
  const l2 = x.amountUSD || 0;
  if (rb && rb.commercialCategory === "service" && rb.addvalueReceivableTHB != null) {
    assert.equal(rb.releaseTHB, round2(rb.addvalueReceivableTHB * SAMTEL_ENGINEERING_SERVICE_MARKUP_0553));
  }
  layer1Total += l1;
  layer2Total += l2;
  if (l2 !== l1) {
    lineDeltas.push({ code: x.code, l1, l2, delta: l2 - l1 });
  }
}

const totalDelta = layer2Total - layer1Total;
const versionDate = CHANGE_LOG_VERSION_0553.slice(0, 10);
const newestDate = RELEASE_NOTES_0553[0]?.date || "";
assert.ok(
  versionDate >= newestDate,
  `CHANGE_LOG_VERSION_0553 (${CHANGE_LOG_VERSION_0553}) is older than newest entry (${newestDate})`
);

const matchedNotice = RELEASE_NOTES_0553.find(
  (n) =>
    n.priceImpact === "PRICE_REVIEW_REQUIRED" &&
    n.layer2DeltaUSD === totalDelta &&
    n.recordedLayer1TotalUSD === layer1Total &&
    n.recordedLayer2TotalUSD === layer2Total &&
    lineDeltas.every((d) => Array.isArray(n.affectedLines) && n.affectedLines.includes(d.code))
);
assert.ok(
  matchedNotice,
  `Missing signed cost-impact notice for Layer1=${layer1Total}, Layer2=${layer2Total}, delta=${totalDelta}`
);

console.log(
  `PASS: 0553 cost-impact notice | Layer1=USD ${layer1Total} | Layer2=USD ${layer2Total} | Delta=+USD ${totalDelta} (${lineDeltas.map((d) => `${d.code}:${d.delta >= 0 ? "+" : ""}${d.delta}`).join(", ")}) | Notice=${matchedNotice.id}`
);
