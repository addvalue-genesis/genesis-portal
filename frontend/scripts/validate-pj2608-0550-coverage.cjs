"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { assertControlledSnapshot } = require("./assert-pj2608-0550-snapshot.cjs");
const babel = require("@babel/core");
const root = path.resolve(__dirname, "../src");
const previousJs = require.extensions[".js"], previousJsx = require.extensions[".jsx"];
const compile = (mod, file) => mod._compile(babel.transformFileSync(file, {
  babelrc: false, configFile: false, presets: [["@babel/preset-env", {targets: {node: "current"}, modules: "commonjs"}], "@babel/preset-react"],
}).code, file);
require.extensions[".js"] = (mod, file) => file.startsWith(root + path.sep) ? compile(mod, file) : previousJs(mod, file);
require.extensions[".jsx"] = compile;
function freeze(obj) { if (obj && typeof obj === "object") { Object.values(obj).forEach(freeze); Object.freeze(obj); } return obj; }
function resolve(obj, pointer) { return pointer.slice(1).split("/").reduce((v,k) => v?.[k.replace(/~1/g,"/").replace(/~0/g,"~")], obj); }
try {
  const snapshotFile = path.join(root, "project0550/data/snapshots/pj2608-0550.rev07.json");
  const raw = fs.readFileSync(snapshotFile);
  assertControlledSnapshot(raw);
  const source = freeze(JSON.parse(raw));
  const {buildCoverageMatrix, PAGA_REVIEW_PLAN, EQUATION_REUSE_CROSSWALK} = require(path.join(root,"project0550/coverageModel.js"));
  const {MODULE_REGISTRY} = require(path.join(root,"project0550/moduleRegistry.js"));
  const {SERVICE_EQUATIONS} = require(path.join(root,"project0550/serviceEquationModel.js"));
  const matrix = buildCoverageMatrix(source);
  assert.equal(matrix.rows.length,19);
  assert.equal(new Set(matrix.rows.map(r=>r.systemToken)).size,19);
  assert.equal(MODULE_REGISTRY.length,15);
  assert.equal(matrix.summary.requirementCoveragePercent,null);
  assert.equal(matrix.summary.systemsWithOpenRequirementExtraction,19);
  assert.equal(matrix.summary.systemsWithoutVerifiedCostOwner,19);
  assert.equal(matrix.summary.systemsWithoutVerifiedTagBinding,19);
  assert.equal(matrix.summary.systemsRequiringKernelReview,4);
  assert.equal(matrix.summary.systemsWithoutLinkedQuoteRecord,18);
  assert.equal(matrix.summary.systemsWithUnresolvedOutputTrace,0);
  assert.deepEqual(EQUATION_REUSE_CROSSWALK.map(e=>e.equationId),SERVICE_EQUATIONS.map(e=>e.id));
  assert.deepEqual(EQUATION_REUSE_CROSSWALK.find(e=>e.equationId==="E17").geqReferences,[]);
  for(const row of matrix.rows) {
    assert.equal(row.status,"OPEN"); assert.equal(row.costOwner,null); assert.equal(row.requirementCount,null);
    assert.equal(row.finalReleaseGate,"HOLD"); assert.equal(resolve(source,row.systemPointer).token,row.systemToken);
    assert.equal(resolve(source,row.workingPointer).token,row.systemToken);
    assert.equal(resolve(source,row.releasePointer).code,row.releaseRowId);
    assert.equal(resolve(source,row.issuedPointer).code,row.releaseRowId);
    assert.equal(resolve(source,row.tracePointer).customerLine,row.releaseRowId);
    assert(MODULE_REGISTRY.some(m=>m.id===row.moduleId));
    row.outputModules.forEach(id=>assert(MODULE_REGISTRY.some(m=>m.id===id)));
    for(const c of row.components) {
      assert.equal(resolve(source,c.sourcePointer).id,c.sourceRowId);
      assert.equal(c.requirementId,null); assert.equal(c.qtyDriver,null); assert.equal(c.bomTag,null); assert.equal(c.costOwner,null);
      c.equationIds.forEach(id=>assert(SERVICE_EQUATIONS.some(e=>e.id===id)));
      c.engineeringKernel.forEach(id=>assert(row.kernelIds.includes(id)));
      assert.equal(c.status,"OPEN");
    }
  }
  const paga=matrix.rows.find(r=>r.systemToken==="TEL-PAGA");
  assert.equal(paga.releaseRowId,"A1-05"); assert.equal(paga.components.length,10);
  assert.deepEqual(paga.unmappedReviewIds,[]);
  assert.deepEqual(paga.components.map(c=>c.sourceRowId),PAGA_REVIEW_PLAN.map(c=>c.componentId));
  assert.deepEqual(paga.kernelIds,["ACOUSTIC","POWER","RELIABILITY"]);
  assert.equal(matrix.rows.find(r=>r.systemToken==="TEL-AIS").releaseRowId,"A1-08");
  assert.equal(matrix.rows.find(r=>r.systemToken==="TEL-TELT").releaseRowId,"A1-11");
  assert.equal(matrix.rows.find(r=>r.systemToken==="TEL-VSAT-KU").releaseRowId,"A1-01");
  assert.deepEqual(buildCoverageMatrix(source),matrix,"Projection must be deterministic");
  assert.equal(JSON.stringify(source),JSON.stringify(JSON.parse(raw)),"Projection changed canonical data");
  // Missing/ambiguous evidence must fail closed without guessing a trace or zero cost.
  const missing=JSON.parse(raw); missing.budgetarySubmission.internalTrace=[]; missing.commercialSources=[];
  const missingPaga=missing.budgetaryEstimate.partA.find(r=>r.token==="TEL-PAGA");missingPaga.components.shift();
  const incomplete=buildCoverageMatrix(missing).rows.find(r=>r.systemToken==="TEL-PAGA");
  assert.equal(incomplete.releaseRowId,null); assert.equal(incomplete.traceState,"OPEN"); assert.equal(incomplete.quoteState,"OPEN");
  assert.deepEqual(incomplete.unmappedReviewIds,["TEL-PAGA-C01"]);
  const duplicate=JSON.parse(raw);duplicate.budgetarySubmission.internalTrace.push({...duplicate.budgetarySubmission.internalTrace.find(r=>r.customerLine==="A1-05")});
  assert.equal(buildCoverageMatrix(duplicate).rows.find(r=>r.systemToken==="TEL-PAGA").releaseRowId,null);
  const other=JSON.parse(raw);other.meta.projectCode="PJ2608-0553";
  assert.throws(()=>buildCoverageMatrix(other),/PJ2608-0550/);
  const {renderToStaticMarkup}=require("react-dom/server"), React=require("react");
  const {CoverageMatrix}=require(path.join(root,"project0550/CoverageMatrix.jsx"));
  const html=renderToStaticMarkup(React.createElement(CoverageMatrix));
  assert.equal((html.match(/aria-pressed=/g)||[]).length,19);
  assert.equal((html.match(/data-source-row-id=/g)||[]).length,10);
  for(const text of ["SPL_required", "E_required", "NOT_IMPLEMENTED", "A1-05", "MOD-REQ-COMPLETENESS"]) assert(html.includes(text),text);
  console.log("PASS 0550 coverage: 19 systems, 10 PAGA review threads, 18 equation references; immutable Rev10, fail-closed evidence, output identity, no financial posting; source-to-native navigation still NOT_IMPLEMENTED.");
} finally {
  require.extensions[".js"]=previousJs;
  if(previousJsx) require.extensions[".jsx"]=previousJsx; else delete require.extensions[".jsx"];
}
