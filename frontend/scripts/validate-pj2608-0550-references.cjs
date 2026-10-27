"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const crypto = require("node:crypto");
const babel = require("@babel/core");
const root = path.resolve(__dirname, "../src");
const previous = require.extensions[".js"];
require.extensions[".js"] = (mod, file) => file.startsWith(root + path.sep)
  ? mod._compile(babel.transformFileSync(file, { babelrc: false, configFile: false,
    presets: [["@babel/preset-env", { targets: { node: "current" }, modules: "commonjs" }]],
  }).code, file) : previous(mod, file);
const get = file => require(path.join(root, "project0550", file));
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === "object"
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const hash = value => crypto.createHash("sha256").update(value).digest("hex");
const copy = value => JSON.parse(JSON.stringify(value));

async function captureOriginalExport(submission) {
  const oldDocument = global.document, oldTimeout = global.setTimeout;
  const oldCreate = URL.createObjectURL, oldRevoke = URL.revokeObjectURL;
  let blob;
  try {
    URL.createObjectURL = value => { blob = value; return "blob:test"; };
    URL.revokeObjectURL = () => {};
    global.setTimeout = () => {};
    global.document = { createElement: () => ({ click() {}, remove() {} }), body: { appendChild() {} } };
    get("exportOriginalPriceForm").exportOriginalPriceFormXlsx(submission);
    return Buffer.from(await blob.arrayBuffer());
  } finally {
    URL.createObjectURL = oldCreate; URL.revokeObjectURL = oldRevoke;
    global.document = oldDocument; global.setTimeout = oldTimeout;
  }
}

async function main() {
  const data = get("data"), service = get("serviceEquationModel"), coverage = get("coverageModel");
  const projection = {
    projectFacts: get("projectFacts").PROJECT_0550_FACTS,
    b1CostLineage: get("b1CostLineage").B1_COST_LINEAGE,
    serviceEquationSource: service.SERVICE_EQUATION_SOURCE,
    serviceEquations: service.SERVICE_EQUATIONS,
    serviceLineDerivation: service.SERVICE_LINE_DERIVATION,
    regulatoryBinding: get("regulatoryBinding").PROJECT_0550_REGULATORY_BINDING,
    pagaReviewPlan: coverage.PAGA_REVIEW_PLAN,
    equationReuseCrosswalk: coverage.EQUATION_REUSE_CROSSWALK,
    reuseCompatibility: coverage.REUSE_COMPATIBILITY,
    kernelLibrary: get("knowledgeKernelBinding").buildProject0550KnowledgeKernelLibrary(data.SYSTEMS),
    coverage: data.REQUIREMENT_COVERAGE,
  };
  // Exact semantic projection captured BEFORE migration at b8c74a3; key order is immaterial.
  assert.equal(hash(JSON.stringify(canonical(projection))), "789e1ab08e156cbb135d027da5ce8b636b25d881649a4b3c42421a563aa627ff", "Reference migration changed existing values/evidence/mappings");
  const { getProject0550References, validateReferenceRegisters } = get("data/referenceRepository");
  const references = getProject0550References();
  assert(Object.isFrozen(references.b1CostLineage.groups[0].rows));
  assert.throws(() => { references.b1CostLineage.currentAllowanceThb = 0; }, TypeError);
  for (const [change, error] of [
    [x => { x.meta.projectId = "OTHER"; }, /project/],
    [x => { x.meta.authority = "CURRENT"; }, /authority/],
    [x => { x.serviceLineDerivation.B1.methodIds.push("MISSING"); }, /method/],
    [x => { x.serviceEquations.push(x.serviceEquations[0]); }, /duplicate/],
    [x => { x.equationReuseCrosswalk[0].equationId = "MISSING"; }, /crosswalk/],
    [x => { x.pagaReviewPlan[0].serviceLines = ["MISSING"]; }, /service line/],
    [x => { x.b1CostLineage.reconciliationGapThb += 1; }, /reconciliation/],
    [x => { x.presentation.b1EquivalentHoursPerDay = null; }, /basis/],
  ]) { const invalid = copy(references); change(invalid); assert.throws(() => validateReferenceRegisters(invalid), error); }
  assert.equal(data.PROJECT_0550_PRESENTATION.b1EquivalentHoursPerDay, 8);
  const snapshot = require(path.join(root, "project0550/data/snapshots/pj2608-0550.rev07.json"));
  assert.equal(hash(await captureOriginalExport(snapshot.budgetarySubmission)),
    "2065bb70efa3e8b3bb90b4fbe64f099e02d1ae6c73a73d03b8e745987becafc6", "Previously issued XLSX changed");
  const missing = (await captureOriginalExport({ customerRows: [] })).toString();
  assert(missing.includes('<c r="D6" s="0"/><c r="E6" s="0"/>'), "Missing qty/unit must stay blank");
  const zero = (await captureOriginalExport({ customerRows: [{ code: "A1-01", qty: 0, unit: "Unit", customerUsd: 0 }], baseBeforeOptionsUsd: 0 })).toString();
  assert(zero.includes('<c r="D6" s="0"><v>0</v></c>'), "Explicit zero quantity must survive export");
  assert(zero.includes('<c r="G65" s="5"><v>0</v></c>'), "Explicit zero total must survive export");
  console.log("PASS reference migration: 11 projections match pre-migration baseline; immutable references; invalid bindings rejected; issued XLSX exact byte parity; unknown quantity/unit blank, explicit zero retained.");
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => { require.extensions[".js"] = previous; });
