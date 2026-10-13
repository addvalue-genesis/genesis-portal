// PJ2608-0553 — independent first-principles regression for the ZWP8
// Brownfield source MTO vs Vendor quote vs cost-owner posting.
// This test documents a DETECTED defect; it must not turn a duplicate into PASS.
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const oldJS=require.extensions[".js"],oldJSX=require.extensions[".jsx"];
function compile(mod,file){
 const v=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(v.code,file);
}
require.extensions[".js"]=(mod,file)=>file.startsWith(root+path.sep)?compile(mod,file):oldJS(mod,file);
require.extensions[".jsx"]=(mod,file)=>file.startsWith(root+path.sep)?compile(mod,file):(oldJSX||oldJS)(mod,file);
const {auditZWP8CostOwnership0553}=require(path.join(root,"project0553/data/zwp8CostOwnershipAudit0553.js"));
const {summarizeMR0001TagCost0553}=require(path.join(root,"project0553/data/mr0001TagCostLedger0553.js"));
const {ZWP8_ROW43_COST_TRACE}=require(path.join(root,"project0553/data/zwp8Row43CostTrace.js"));
const {SCADA_LINKS_0553}=require(path.join(root,"project0553/data/scadaLinkEvidence.js"));
const original=JSON.stringify(summarizeMR0001TagCost0553("ZWP8").rows);
const audit=auditZWP8CostOwnership0553({thbPerUsd:31.5});
assert.deepEqual(audit.physicalGroup,{radioODU:2,radioIDU:2,antenna:2,surge:2});
assert.deepEqual(audit.currencyTotals,{USD:27796.18,THB:499906});
assert.equal(audit.sourceUnitUSD.oduOnly,7288.65);
assert.equal(audit.sourceUnitUSD.poe,671.27);
assert.equal(audit.sourceUnitUSD.surge,614.2);
assert.equal(audit.sourceUnitUSD.oduScenarioWithAccessories,8574.12);
assert(ZWP8_ROW43_COST_TRACE.referenceScenarios.find(x=>x.id===ZWP8_ROW43_COST_TRACE.preferredScenarioId).radioCodes.includes("B-8"));
assert.equal(audit.currentWorkingTHB,1375485.67);
assert.equal(audit.duplicatedSurgeUSD,1228.4);
assert.equal(audit.misplacedPOEUSD,1342.54);
assert.equal(audit.adjustedOwnerTotalUSD,26567.78);
assert.equal(audit.adjustedOwnerTotalTHB,1336791.07);
assert.equal(audit.currentWorkingTHB-audit.adjustedOwnerTotalTHB,38694.60000000009);
assert.equal(audit.flags.verifiedArithmetic,true);
assert.equal(audit.flags.uniqueCostOwnerPassed,false,"Duplicate surge must NEVER be represented as passing");
assert.equal(audit.ledgerCoverage.costed,9);
assert.equal(audit.ledgerCoverage.total,11);
assert.deepEqual(audit.ledgerCoverage.unpricedTags,["MR-502-003A","MR-502-004A"]);
assert(audit.issues.some(x=>x.id==="ZWP8-OWN-01"&&x.level==="ERROR"));
assert(audit.issues.some(x=>x.id==="ZWP8-OWN-02"&&x.level==="ERROR"));
assert.equal(audit.siteLinks.length,3);
assert(audit.siteLinks.filter(x=>x.mode==="PTMP").length===2);
assert(SCADA_LINKS_0553.some(x=>x.from==="ZWP8"&&x.to==="ZPQ")===false);
assert.equal(audit.flags.vendorTechApproved,false);
assert.equal(audit.flags.customerReleased,false);
const withoutFx=auditZWP8CostOwnership0553();
assert.equal(withoutFx.currentWorkingTHB,null,"USD/THB cannot be combined without FX");
assert.equal(withoutFx.adjustedOwnerTotalTHB,null,"Corrections must retain original USD currency");
assert.equal(JSON.stringify(summarizeMR0001TagCost0553("ZWP8").rows),original,"Audit may not mutate any source ledger lines");
const view=fs.readFileSync(path.join(root,"project0553/ZWP8CostOwnershipAudit0553.jsx"),"utf8");
const host=fs.readFileSync(path.join(root,"project0553/LocationBomDetail0553.jsx"),"utf8");
assert(view.includes('id="bid.budget.bom.zwp8.cost-ownership-audit"'));
assert(view.includes('<ControlledModuleSection0553 moduleKey={id}')&&view.includes('moduleKey={id+".issues"}'));
assert(host.includes('site==="ZWP8"&&<ZWP8CostOwnershipAudit0553 fx={fx}/>'));
assert(!view.includes("setCost")&&!view.includes("updateLedger"));
const compiled=babel.transformSync(view,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
assert(compiled.code.length>0);
console.log("PASS ZWP8 source/ownership audit: CURRENT THB 1,375,485.67; B-8 duplicate USD 1,228.40 / THB 38,694.60; B-6/B-7 misplaced USD 1,342.54; de-duplicated illustrative THB 1,336,791.07; 9/11 posted; 3 RPT links; source LEDGER UNCHANGED and warning still FAILS unique-cost-owner gate.");
