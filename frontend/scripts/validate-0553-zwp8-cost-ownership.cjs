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
const {MR0001_WORKING_PRICED_BOM}=require(path.join(root,"project0553/data/mr0001WorkingPricedBom.js"));
const {summarizeMR0001TagCost0553}=require(path.join(root,"project0553/data/mr0001TagCostLedger0553.js"));
const {ZWP8_ROW43_COST_TRACE}=require(path.join(root,"project0553/data/zwp8Row43CostTrace.js"));
const {SCADA_LINKS_0553}=require(path.join(root,"project0553/data/scadaLinkEvidence.js"));
const zwp11Enclosure=summarizeMR0001TagCost0553("ZWP11").rows.find(x=>x.row===51&&x.tag==="TCAB-500-003");
assert(zwp11Enclosure,"ZWP11 original MR0001 enclosure TAG missing");
assert.equal(zwp11Enclosure.sourceQty,1,"Preserve MTO Row51 original one Set");
assert.equal(zwp11Enclosure.procurementQty,0,"ZWP11 existing enclosure requires no new purchase");
assert.equal(zwp11Enclosure.extended,0,"Existing cabinet not a 39,200 THB new equipment purchase");
assert.equal(zwp11Enclosure.referenceExtended,39200,"Retain historical analogue as unselected reference");
assert(zwp11Enclosure.status.includes("MODIFICATION_NOT_ESTABLISHED"),"Do not mark unpriced Ex modification as free");
const original=JSON.stringify(summarizeMR0001TagCost0553("ZWP8").rows);
const audit=auditZWP8CostOwnership0553({thbPerUsd:31.5});
assert.deepEqual(audit.physicalGroup,{radioODU:2,radioIDU:2,antenna:2,surge:2});
// Original ZWP8 before TC-0001: USD 28,174.05 + THB 499,906.
 // Now only the Cisco expansion module and module SmartNet are removed (THB 51,950).
const cisco=MR0001_WORKING_PRICED_BOM.cisco;
assert.equal(cisco.removedUnitTHB,51950,"TC-0001 excludes exactly one module and its SmartNet per site");
assert.equal(cisco.unitPackageQuotedSumTHB,371580);
assert.deepEqual(audit.currencyTotals,{USD:28174.05,THB:447956});
assert.equal(audit.currencyTotals.THB+cisco.removedUnitTHB,499906,
 "ZWP8 THB ledger must preserve original currency source bridge");
assert.equal(audit.sourceUnitUSD.oduOnly,7288.65);
assert.equal(audit.sourceUnitUSD.poe,671.27);
assert.equal(audit.sourceUnitUSD.surge,614.2);
assert.equal(audit.sourceUnitUSD.oduScenarioWithAccessories,13002);
assert(ZWP8_ROW43_COST_TRACE.referenceScenarios.find(x=>x.id===ZWP8_ROW43_COST_TRACE.preferredScenarioId).radioCodes.includes("B-8"));
assert.equal(audit.currentWorkingTHB,1335438.58);
assert.equal(Math.round((audit.currentWorkingTHB+cisco.removedUnitTHB)*100)/100,1387388.58,
 "ZWP8 pre-TC baseline must reconcile exactly to removed Cisco expansion costs");
assert.equal(audit.duplicatedSurgeUSD,0);
assert.equal(audit.misplacedPOEUSD,0);
assert.equal(audit.adjustedOwnerTotalUSD,28174.05);
assert.equal(audit.adjustedOwnerTotalTHB,1335438.58);
assert.equal(audit.currentWorkingTHB,audit.adjustedOwnerTotalTHB,"Owner totals reconciled");
assert.equal(audit.flags.verifiedArithmetic,false,"No duplicate surge event should be active");
assert.equal(audit.flags.uniqueCostOwnerPassed,true,"Each physical owner receives its own source quote function");
assert.equal(audit.ledgerCoverage.costed,11);
assert.equal(audit.ledgerCoverage.total,11);
assert.deepEqual(audit.ledgerCoverage.unpricedTags,[]);
assert(audit.issues.some(x=>x.id==="ZWP8-OWN-01"&&x.level==="RECONCILED"));
assert(audit.issues.some(x=>x.id==="ZWP8-OWN-02"&&x.level==="RECONCILED"));
assert.equal(audit.siteLinks.length,3);
assert(audit.siteLinks.filter(x=>x.mode==="PTMP").length===2);
const existing=SCADA_LINKS_0553.find(x=>x.from==="ZPQ"&&x.to==="ZWP8"&&x.mode==="PTP");
assert(existing,"ZPQ–ZWP8 existing physical link evidence missing");
assert.equal(existing.installedLinkState,"EXISTING_BASELINE","Do not silently reclassify PTP baseline as new");
assert.equal(existing.newReplacementAutomaticallyRequired,false,"Existing link is not an automatic procurement obligation");
assert(existing.capacityScope.includes("ADDITIONAL NEW LINK"),"Retain separate BOD added-link capacity obligation");
assert(audit.siteLinks.find(x=>x.id==="SCADA-ZPQ-ZWP8")?.installedLinkState==="EXISTING_BASELINE","ZWP8 audit must retain original PTP status");
assert(audit.issues.some(x=>x.id==="ZWP8-ENG-06"&&x.details.includes("EXISTING communication link")),"Engineering conflict must remain explicit");
assert.equal(audit.flags.vendorTechApproved,false);
assert.equal(audit.flags.customerReleased,false);
const withoutFx=auditZWP8CostOwnership0553();
assert.equal(withoutFx.currentWorkingTHB,null,"USD/THB cannot be combined without FX");
assert.equal(withoutFx.adjustedOwnerTotalTHB,null,"Corrections must retain original USD currency");
assert.equal(JSON.stringify(summarizeMR0001TagCost0553("ZWP8").rows),original,"Audit may not mutate any source ledger lines");
const view=fs.readFileSync(path.join(root,"project0553/ZWP8CostOwnershipAudit0553.jsx"),"utf8");
const host=fs.readFileSync(path.join(root,"project0553/LocationBomDetail0553.jsx"),"utf8");
const overview=fs.readFileSync(path.join(root,"project0553/SimpleBom0553.jsx"),"utf8");
assert(view.includes('id="bid.budget.bom.zwp8.cost-ownership-audit"'));
assert(view.includes('<ControlledModuleSection0553 moduleKey={id}')&&view.includes('moduleKey={id+".issues"}'));
assert(host.includes('site==="ZWP8"&&<ZWP8CostOwnershipAudit0553 fx={fx}/>'));
assert(view.includes("PTP ZPQ ↔ ZWP8 = EXISTING baseline link"),"Existing link must be prominently labeled for project executive");
assert(overview.includes("OWNER AUDIT: AFC radio/sector and independent IDU/Surge owners costed"),"Do not lose owner status visibility");
assert(!view.includes("setCost")&&!view.includes("updateLedger"));
const compiled=babel.transformSync(view,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
assert(compiled.code.length>0);
console.log("PASS ZWP8 AFC owner reconciliation: USD 28,174.05 + THB 447,956 = THB 1,335,438.58 at working FX; legacy THB 1,387,388.58 reconciles via THB 51,950 TC-0001 Cisco exclusion; 11/11 TAG allocated; OEM/NMS gates open.");
