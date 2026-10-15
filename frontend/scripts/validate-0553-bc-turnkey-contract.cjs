// PJ2608-0553 10.2 B/C working-cost source contract; no new rates and no customer release.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
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
const from=p=>require(path.join(root,"project0553",p));
const {selectBcTurnkeyWorkingCost0553}=from("data/bcTurnkeyWorkingCost0553.js");
const {selectScopePartBcWorking0553}=from("data/scopePartBcReadModel0553.js");
const {derivePartBcWorkingWbs0553}=from("data/partBCWorkingWbs0553.js");
const {BC_CUSTOMER_CODES_0553,validateBcRoutes0553}=from("data/bcWorkingModuleRoutes0553.js");
const {LIFECYCLE_SPARES_0553}=from("data/lifecycleSpareScope0553.js");

const originalWbs=JSON.stringify(derivePartBcWorkingWbs0553());
const originalLifecycle=JSON.stringify(LIFECYCLE_SPARES_0553.rows);
assert(validateBcRoutes0553(),"Customer B/C mapping must not duplicate or omit codes");
const m=selectBcTurnkeyWorkingCost0553(),scope=selectScopePartBcWorking0553();
assert.equal(m.workflowNumber,"10.2");
assert.equal(m.rows.length,16);
assert.equal(new Set(m.rows.map(r=>r.code)).size,16);
assert.deepEqual(m.rows.map(r=>r.code),BC_CUSTOMER_CODES_0553);
assert.equal(m.knownWorkingSellTHB,3804160);
assert.equal(scope.knownAddvalueWorkingSellTHB,3804160);
assert.equal(m.knownDirectCostTHB,null);
assert.equal(m.baseTurnkeyCostTHB,null);
assert.equal(m.optionalCostTHB,null);
assert.equal(m.releaseAllowed,false);
assert.equal(m.costComplete,false);
assert.equal(m.noCrossBasisSummation,true);
assert.equal(m.rows.filter(r=>Number.isFinite(r.workingSellTHB)).length,5);
for(const r of m.rows){
 assert.equal(r.directCostTHB,null,r.code+" has unsupported internal cost");
 assert.equal(r.commercialSellTHB,null,r.code+" has unsupported customer sell");
 assert.equal(r.riskCostTHB,null);
 assert.equal(r.contractOwner,"SAMTEL");
 assert.equal(r.turnkeyEstimator,"ADDVALUE_FOR_SAMTEL");
 assert.equal(r.optional,r.code.startsWith("C"));
 assert.equal(r.baseScope,!r.optional);
 assert(r.workflowNumber&&r.moduleId&&r.outputModuleId&&r.sourceRevision&&r.routeSourceModules.length);
 assert.equal(scope.lines[r.code].directCostTHB,r.directCostTHB);
 assert.equal(scope.lines[r.code].workingSellTHB,r.workingSellTHB);
 assert.equal(scope.lines[r.code].workflowNumber,r.workflowNumber);
 assert.equal(scope.lines[r.code].sourceModuleId,r.moduleId);
}
assert.equal(m.byCode.B10.requirementCount,LIFECYCLE_SPARES_0553.rows.filter(r=>r.activity==="STARTUP_SPARES").length);
assert.equal(m.byCode.C1.requirementCount,LIFECYCLE_SPARES_0553.rows.filter(r=>r.activity==="CAPITAL_SPARES").length);
assert.equal(m.byCode.C2.requirementCount,0,"C2 must not inherit old C2-coded capital spares");
assert.equal(m.byCode.B11.requirementCount,0,"No invented OEM tool schedule");
assert.equal(m.byCode.B13.requirementCount,0,"Do not count B10 start-up items again as B13");
assert(m.byCode.B6.executionOwner==="SAMTEL","Preserve original execution owner");
assert.equal(m.byCode.B6.directCostTHB,null,"SAMTEL execution cost belongs in turnkey estimate but is not verified");
assert.equal(JSON.stringify(derivePartBcWorkingWbs0553()),originalWbs,"WBS immutable");
assert.equal(JSON.stringify(LIFECYCLE_SPARES_0553.rows),originalLifecycle,"Lifecycle evidence immutable");
const workbook=fs.readFileSync(path.join(root,"project0553/BudgetaryWorkbookPreview0553.jsx"),"utf8");
assert(workbook.includes("const bcHistorical=showHistorical&&"),"Historical B/C cannot fill main price by default");
assert(!workbook.includes("partAKnownTotal+partBKnownTotal"),"Cost and sell must not be added in customer Row 38");
const mapping=fs.readFileSync(path.join(root,"project0553/EstimateToBidMapping0553.jsx"),"utf8");
assert(mapping.includes('selectBcTurnkeyWorkingCost0553()'),"Mapping must consume canonical 10.2 source");
const workspace=fs.readFileSync(path.join(root,"project0553/CommercialWorkspace.jsx"),"utf8");
assert(workspace.includes("bcWorking.rows.map("),"10.2 must render the canonical rows");
console.log("PASS 0553 B/C 16/16 customer mapping, turnkey scope, working sell/cost separation, lifecycle remap, no historical default and no duplicated posting");
