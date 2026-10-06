const path = require("path");

const data = require(path.join(__dirname, "..", "src", "project0550", "data", "snapshots", "pj2608-0550.rev07.json"));

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

const pricingOnHold = /HOLD/i.test(data.project?.pricingStatus || data.project?.state || "");
if (!pricingOnHold) fail("Rev07 current baseline must remain HOLD until selected PAGA closes");

const knownUsd = (data.cneecBreakdown || []).reduce((sum, row) => sum + (Number.isFinite(row.usd) ? row.usd : 0), 0);
const knownThb = (data.cneecBreakdown || []).reduce((sum, row) => sum + (Number.isFinite(row.thb) ? row.thb : 0), 0);
if (!closeEnough(knownUsd, data.project.knownBaseExPagaUsd)) fail("known A+B USD subset does not reconcile");
if (!closeEnough(knownThb, data.project.knownBaseExPagaThb)) fail("known A+B THB subset does not reconcile");

const paga = data.cneecBreakdown.find((x) => x.code === "A1-05");
if (!paga || paga.vendor !== "INDUSTRONIC") fail("PAGA selected vendor must be INDUSTRONIC");
if (paga.usd !== null || paga.thb !== null) fail("PAGA USD/THB must remain null while EUR conversion is TBC");
if (!Number.isFinite(paga.eur) || paga.eur <= 0) fail("PAGA known selected EUR subtotal missing");
if (!/OPEN|TBC|HOLD/i.test(paga.state || "")) fail("PAGA state must expose OPEN/TBC");

if (data.project.baseUsd !== null || data.project.baseThb !== null) fail("Base headline must remain HOLD/null");
if (data.project.totalWithOptionsUsd !== null || data.project.totalWithOptionsThb !== null) fail("Total headline must remain HOLD/null");

const c1 = data.options.find((x) => x.code === "C1");
const c2 = data.options.find((x) => x.code === "C2");
const c3 = data.options.find((x) => x.code === "C3");
if (!c1 || c1.usd !== null || c1.thb !== null || !/NOT PRICED/i.test(c1.state || "")) {
  fail("C1 must remain NOT PRICED and null-valued");
}
if (!c2 || !closeEnough(c2.usd, data.project.c2Usd) || !closeEnough(c2.thb, data.project.c2Thb)) {
  fail("C2 mismatch");
}
if (!c3 || !closeEnough(c3.usd, data.project.c3Usd) || !closeEnough(c3.thb, data.project.c3Thb)) {
  fail("C3 mismatch");
}

const knownWithOptionsUsd = data.project.knownBaseExPagaUsd + data.project.c2Usd + data.project.c3Usd;
const knownWithOptionsThb = data.project.knownBaseExPagaThb + data.project.c2Thb + data.project.c3Thb;
if (!closeEnough(knownWithOptionsUsd, data.project.knownBasePlusC2C3ExPagaUsd, 0.01)) fail("known USD with options mismatch");
if (!closeEnough(knownWithOptionsThb, data.project.knownBasePlusC2C3ExPagaThb, 0.02)) fail("known THB with options mismatch");

if (/EXION|GAI[- ]?TRONICS|GAITRONIC/i.test(JSON.stringify(data))) {
  fail("removed PAGA vendor remains in Rev07 dataset");
}

console.log(
  "[PJ2608-0550 DATA] PASS",
  data.meta.datasetId,
  "| systems=" + systems.length,
  "| PAGA=" + paga.vendor + " EUR " + paga.eur.toFixed(2),
  "| knownBaseUSD=" + data.project.knownBaseExPagaUsd.toFixed(2),
  "| total=HOLD"
);
