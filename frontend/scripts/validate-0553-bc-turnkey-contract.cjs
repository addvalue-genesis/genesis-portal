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
const {BUDGET_BC_WORKFLOW_0553}=from("workstreamOwnership0553.js");

const originalWbs=JSON.stringify(derivePartBcWorkingWbs0553());
const originalLifecycle=JSON.stringify(LIFECYCLE_SPARES_0553.rows);
assert(validateBcRoutes0553(),"Customer B/C mapping must not duplicate or omit codes");
const m=selectBcTurnkeyWorkingCost0553(),scope=selectScopePartBcWorking0553();
assert.equal(m.workflowNumber,"10.2");
assert.equal(new Set(BUDGET_BC_WORKFLOW_0553.map(r=>r.workflowNumber)).size,BUDGET_BC_WORKFLOW_0553.length,"10.2 workflow numbers must be unique");
assert.equal(BUDGET_BC_WORKFLOW_0553.filter(r=>r.parent==="10.2").length,4,"10.2 must own four source workstreams");
assert.equal(m.rows.length,16);
assert.equal(new Set(m.rows.map(r=>r.code)).size,16);
assert.deepEqual(m.rows.map(r=>r.code),BC_CUSTOMER_CODES_0553);
const wbsBase=derivePartBcWorkingWbs0553().subtotalTHB;
assert.equal(wbsBase,3804160,"Legacy ADDVALUE WBS subtotal must remain unchanged");
const currentBaseCodes=["B1","B2","B3","B5","B6","B7","B8","B9","B10","B11","B13","B14"];
const expectedBase=Math.round(currentBaseCodes.reduce((sum,code)=>sum+m.byCode[code].workingSellTHB,0)*100)/100;
assert.equal(m.knownWorkingSellTHB,expectedBase,"Current owner-only B1-B14 SELL: no Rev05 Engineering source price arithmetic");
assert.equal(m.knownWorkingSellTHB,5782287.13,"Controlled revised pre-award Part B Base Working SELL");
assert.equal(m.byCode.B1.workingSellTHB,421180);
assert.equal(m.byCode.B2.workingSellTHB,237121.13);
assert.equal(m.byCode.B2.b2PriorWorkingSellReferenceTHB,580000);
assert.equal(m.byCode.B2.directCostTHB,null);
assert.equal(m.byCode.B1.b1SupportPlanningBudget.historicalEngineeringCarryForwardTHB,0);
assert.equal(m.byCode.B1.b1SupportPlanningBudget.historicalPmCarryForwardTHB,0);
assert.equal(m.byCode.B3.workingSellTHB,2322450);
assert.equal(m.byCode.B9.workingSellTHB,480550);
assert.equal(m.byCode.B9.b9ChinaBudget.conditionalYardSellTHB,480550);
assert.equal(m.byCode.B3.b3ChinaFatBudget.fatWorkingSellTHB,452850);
assert.equal(scope.knownAddvalueWorkingSellTHB,m.knownWorkingSellTHB);
assert.equal(m.knownDirectCostTHB,null);
assert.equal(m.baseTurnkeyCostTHB,null);
assert.equal(m.optionalCostTHB,null);
assert.equal(m.releaseAllowed,false);
assert.equal(m.costComplete,false);
assert.equal(m.noCrossBasisSummation,true);
const pricedCodes=m.rows.filter(r=>Number.isFinite(r.workingSellTHB)).map(r=>r.code);
assert.deepEqual(pricedCodes,["B1","B2","B3","B5","B6","B7","B8","B9","B10","B11","B13","B14"],
 "Rev.K current: 12 Part B selected budgetary prices; B4/B12 excluded; C1/C2 optional");
assert.equal(pricedCodes.length,12,"Current price coverage counts B7, B11 and optional C1/C2; historical Rev05 11-code assertion superseded");
assert.equal(m.byCode.B9.workingSellTHB,480550,"B9 1 LS included ONCE in Base; field attendance conditional");
assert.equal(m.byCode.B8.workingSellTHB,142550);
assert.equal(m.byCode.B8.qtyDriver,1);
assert.equal(m.byCode.B7.workingSellTHB,30000,"B7 user-approved budgetary 1-month reserve");
assert.equal(m.byCode.B11.workingSellTHB,157657.5,"B11 current budgetary SELL; OEM direct cost remains unverified");
assert.equal(m.byCode.B10.workingSellTHB,509827.5);
assert.equal(m.byCode.B13.workingSellTHB,46683);
assert.equal(m.byCode.C1.workingSellTHB,null);
assert.equal(m.byCode.C2.workingSellTHB,null);
assert.equal(m.knownWorkingSellTHB,m.rows.filter(r=>r.baseScope&&Number.isFinite(r.workingSellTHB)).reduce((n,r)=>Math.round((n+r.workingSellTHB)*100)/100,0),"Options must not enter Base Working SELL");
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
const scopeView=fs.readFileSync(path.join(root,"project0553/ScopeSheetsDetail0553.jsx"),"utf8");
assert(!scopeView.includes("const shownAmount=hasChild?childAmount:amount"),"Scope must not use Rev08 as current B/C cost");
assert(scopeView.includes("CURRENT TURNKEY COST NOT ESTABLISHED"),"Scope must distinguish active cost from historical reference");
const workbook=fs.readFileSync(path.join(root,"project0553/BudgetaryWorkbookPreview0553.jsx"),"utf8");
assert(workbook.includes("const bcHistorical=showHistorical&&"),"Historical B/C cannot fill main price by default");
assert(!workbook.includes("partAKnownTotal+partBKnownTotal"),"Cost and sell must not be added in customer Row 38");
const mapping=fs.readFileSync(path.join(root,"project0553/EstimateToBidMapping0553.jsx"),"utf8");
assert(mapping.includes('selectBcTurnkeyWorkingCost0553()'),"Mapping must consume canonical 10.2 source");
const workspace=fs.readFileSync(path.join(root,"project0553/CommercialWorkspace.jsx"),"utf8");
// 10.2 now groups canonical rows into Part B Base and Part C Options before rendering.
assert(workspace.includes("const bcWorking=selectBcTurnkeyWorkingCost0553();"),
 "10.2 must select its canonical B/C working source");
assert(workspace.includes("const partBRows=bcWorking.rows.filter(r=>!r.optional);")&&
       workspace.includes("const partCRows=bcWorking.rows.filter(r=>r.optional);"),
 "10.2 must separate canonical Part B Base and Part C optional rows");
const hierarchy=fs.readFileSync(path.join(root,"project0553/BcWorkingHierarchy0553.jsx"),"utf8");
assert(workspace.includes('bcTab==="ALL"&&<BcWorkingHierarchy0553')&&
       workspace.includes("partBRows={partBRows}")&&
       workspace.includes("partCRows={partCRows}")&&
       hierarchy.includes("group.rows.map(item=>")&&
       hierarchy.includes("data-component-key={item.moduleId}")&&
       hierarchy.includes("item.workingSellTHB"),
 "10.2 must render each canonical item in its Part B/C group with Working Sell and module ID");
assert(workspace.includes('if(Math.abs(partBWorkingSell-bcWorking.knownWorkingSellTHB)>0.01)throw Error("10.2 Part B summary mismatch")'),
 "10.2 Part B subtotal must reconcile to canonical Working Sell");
console.log("PASS 0553 B/C 16/16 customer mapping, turnkey scope, working sell/cost separation, lifecycle remap, no historical default and no duplicated posting");
