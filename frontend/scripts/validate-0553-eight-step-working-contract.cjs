// PJ2608-0553 eight-step-to-working-cost integration regression.
// Read-only; no recalculation of vendor rates or revision changes.
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const oldJS=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const t=babel.transformFileSync(file,{babelrc:false,configFile:false,sourceMaps:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(t.code,file);
 }else oldJS(mod,file);
};
const {COST_INTEGRITY_0553:audit}=require(path.join(root,"project0553/data/costIntegrity0553.js"));
const {WORKING_BOM_BY_LOCATION_0553:locations}=require(path.join(root,"project0553/data/workingBomByLocation.js"));
const {summarizeMR0001TagCost0553}=require(path.join(root,"project0553/data/mr0001TagCostLedger0553.js"));
const stages=audit.steps;
assert.deepEqual(stages.map(s=>s.step),[1,2,3,4,5,6,7,8],"Eight project methodology gates required");
assert(stages.every(s=>s.workflow&&s.sourceModules?.length),"Each 1-8 gate must have a real workflow/module source");
assert.equal(audit.currentWorkingEvidence.siteCount,locations.locations.length);
const ledgers=locations.locations.map(x=>summarizeMR0001TagCost0553(x.site));
assert.equal(audit.currentWorkingEvidence.sourceRows,ledgers.reduce((n,s)=>n+s.totalRows,0));
assert.equal(audit.currentWorkingEvidence.allocatedWorkingRows,ledgers.reduce((n,s)=>n+s.costedRows,0));
assert.equal(audit.currentWorkingEvidence.originalUSD,Math.round(ledgers.reduce((n,s)=>n+s.subtotals.USD,0)*100)/100);
assert.equal(audit.currentWorkingEvidence.originalTHB,Math.round(ledgers.reduce((n,s)=>n+s.subtotals.THB,0)*100)/100);
assert.equal(audit.currentWorkingEvidence.physicalSkuApproved,false,"Working allocations do not constitute engineering approval");
assert.equal(audit.budgetReleaseAllowed,false,"Budget approval requires source and technical gates");
const scope=fs.readFileSync(path.join(root,"project0553/ScopeSheetsDetail0553.jsx"),"utf8");
assert(scope.includes("round(workingScadaEquipment+a5.a5PriceTHB-scadaLedgerCostTHB)"),
 "A5 must reconcile net A1 plus A5 to original gross without double counting");
assert(scope.includes("round(a5.a1CostToReclassifyTHB-a5.a5PriceTHB)"),
 "A5 transfer and disclosure must agree");
const workbook=fs.readFileSync(path.join(root,"project0553/BudgetaryWorkbookPreview0553.jsx"),"utf8");
assert(!workbook.includes("partAKnownTotal+partBKnownTotal"),
 "Never add A equipment COST and B working SELL into a misleading workbook total");
assert(workbook.includes('scopeTotalLabel="NOT ESTABLISHED"'),"Incomplete customer total must be visibly held");
console.log("PASS 0553 1-8 workflow trace, current MR0001 TAG ledger, A5 no-duplicate reconciliation and A/B basis separation");
