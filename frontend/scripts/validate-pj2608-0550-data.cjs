const path = require("path");

const data = require(path.join(__dirname, "..", "src", "project0550", "data", "snapshots", "pj2608-0550.rev04.json"));

function fail(message) {
  console.error("[PJ2608-0550 DATA] FAIL:", message);
  process.exit(1);
}

function closeEnough(a, b, tolerance = 0.05) {
  return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tolerance;
}

if (data.meta?.projectCode !== "PJ2608-0550") fail("wrong project code");
if (data.project?.id !== "PJ2608-0550") fail("wrong project id");

const systems = (data.systemGroups || []).flatMap((g) => g.systems || []);
if (systems.length !== 19) fail("expected 19 systems, got " + systems.length);
if (new Set(systems.map((s) => s.no)).size !== 19) fail("duplicate system number");
if (new Set(systems.map((s) => s.token)).size !== 19) fail("duplicate system token");
if (systems.some((s) => !s.ref || !s.proof || !s.proofState || !s.quantityState || !s.costBasis)) {
  fail("system traceability/proof fields incomplete");
}

const baseUsd = (data.cneecBreakdown || []).reduce((sum, row) => sum + (row.usd ?? 0), 0);
const baseThb = (data.cneecBreakdown || []).reduce((sum, row) => sum + (row.thb ?? 0), 0);
if (!closeEnough(baseUsd, data.project.baseUsd)) fail("A+B USD breakdown does not reconcile");
if (!closeEnough(baseThb, data.project.baseThb)) fail("A+B THB breakdown does not reconcile");

const c1 = data.options.find((x) => x.code === "C1");
if (!c1 || c1.usd !== null || c1.thb !== null || !/NOT PRICED/i.test(c1.state || "")) {
  fail("C1 must remain NOT PRICED and null-valued");
}

const headlineUsd = data.project.baseUsd + data.project.c2Usd + data.project.c3Usd;
const headlineThb = data.project.baseThb + data.project.c2Thb + data.project.c3Thb;
if (!closeEnough(headlineUsd, data.project.totalWithOptionsUsd, 0.01)) fail("headline USD mismatch");
if (!closeEnough(headlineThb, data.project.totalWithOptionsThb, 0.02)) fail("headline THB mismatch");

console.log(
  "[PJ2608-0550 DATA] PASS",
  data.meta.datasetId,
  "| systems=" + systems.length,
  "| baseUSD=" + data.project.baseUsd.toFixed(2),
  "| totalUSD=" + data.project.totalWithOptionsUsd.toFixed(2)
);
