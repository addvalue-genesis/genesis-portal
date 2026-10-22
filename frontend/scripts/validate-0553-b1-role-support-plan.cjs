// PJ2608-0553 | B1.1–B1.8 office/admin/finance/procurement resource cost estimate.
// Assert budgets and B1 support scenario, NOT verified direct cost or released customer price.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src");
const orig=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const t=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(t.code,file);
 }else orig(mod,file);
};
const from=p=>require(path.join(root,"project0553",p));
const {selectB1ProjectSupportBudget0553}=from("data/b1ProjectSupportBudget0553.js");
const {selectBcTurnkeyWorkingCost0553}=from("data/bcTurnkeyWorkingCost0553.js");
const {selectB1RevKMilestoneCoverage0553}=from("data/b1RevKMilestoneCoverage0553.js");
const m=selectB1ProjectSupportBudget0553(),legacy=selectB1RevKMilestoneCoverage0553(),bc=selectBcTurnkeyWorkingCost0553();
assert.equal(m.moduleId,"bid.budget.working.bc.b1.revk-pm-milestones");
assert.equal(m.coveredMilestones,19);
assert.equal(m.uniqueKChargeEvents,12);
assert.equal(m.milestones.length,19);
assert.equal(m.roleLines.length,41);
assert.equal(m.roleRates.PM.monthlyTHB,90000);
assert.equal(m.roleRates.ADMIN.monthlyTHB,25000);
assert.equal(m.roleRates.ACCOUNTANT.monthlyTHB,35000);
assert.equal(m.roleRates.PROCUREMENT.monthlyTHB,38000);
assert.equal(m.roleRates.COORD.monthlyTHB,42000);
assert.equal(Object.keys(m.roleRates).length,7);
assert.equal(m.labourHours,242);
assert.equal(m.labourWorkingCostTHB,80400);
assert.equal(m.labourWorkingSellTHB,100500);
assert.equal(m.baseExpenseWorkingCostTHB,101000);
assert.equal(m.baseExpenseWorkingSellTHB,111100);
assert.equal(m.baseWorkingCostTHB,181400);
assert.equal(m.baseWorkingSellTHB,211600);
assert.equal(m.conditionalWorkingCostTHB,47000);
assert.equal(m.conditionalWorkingSellTHB,51700);
assert.equal(m.proposedB1BaseWorkingSellTHB,211600);
assert.equal(m.canonicalB1WorkingSellTHB,211600);
assert.equal(m.historicalEngineeringCarryForwardTHB,0);
assert.equal(m.historicalPmCarryForwardTHB,0);
assert.equal(m.engineeringScopeReview.length,27);
assert(m.engineeringScopeReview.every(x=>x.workingSellTHB===null&&x.quantityMH===null&&x.postingAllowed===false));
assert.equal(m.canonicalPriceSource,"NEW_2026_ROLE_ACTIVITY_RESOURCE_COST_ONLY");
assert.equal(m.actualDirectCostTHB,null);
assert.equal(m.customerReleasedSellTHB,null);
assert.equal(m.postingAllowed,false);
assert.equal(m.accounts.length,8);
assert.deepEqual(m.accounts.map(x=>x.account),["B1.1","B1.2","B1.3","B1.4","B1.5","B1.6","B1.7","B1.8"]);
assert.equal(m.accounts.reduce((n,x)=>Math.round((n+x.baseWorkingCostTHB)*100)/100,0),m.baseWorkingCostTHB);
assert.equal(m.accounts.reduce((n,x)=>Math.round((n+x.baseWorkingSellTHB)*100)/100,0),m.baseWorkingSellTHB);
assert.equal(new Set(m.lines.map(x=>x.id)).size,m.lines.length);
assert.equal(m.roleLines.reduce((n,x)=>n+x.qty,0),242);
assert(m.roleLines.every(x=>x.costOwner==="B1"&&x.unit==="MH"&&x.directCostTHB===null));
assert(m.expenseLines.every(x=>x.costOwner==="B1"&&x.directCostTHB===null));
assert(m.roleLines.every(x=>x.unitCostTHB<1000),"Admin/payroll cost rates must not inherit USD600/specialist sale rate");
assert(m.milestones.filter(x=>x.rows.length>0).every(x=>x.chargeableHere));
assert.equal(m.milestones.filter(x=>x.rows.length>0).length,12);
assert.equal(m.milestones.find(x=>x.stage==="K04").rows.length,0);
assert.equal(m.milestones.find(x=>x.stage==="K07").chargeOwnerStage,"K03");
assert.equal(m.milestones.find(x=>x.stage==="K09").chargeOwnerStage,"K08");
assert.equal(m.milestones.find(x=>x.stage==="K00").rows.every(x=>x.role!=="PM"),true,"K00 PM kickoff included in engineering legacy");
assert(m.roleLines.filter(x=>x.wbs==="K01").every(x=>!x.roleName.includes("FAT witness")),"B3 factory team not eligible for B1");
assert(m.expenseLines.filter(x=>x.conditional).every(x=>x.account==="B1.6"||x.account==="B1.7"));
assert.equal(bc.byCode.B1.workingSellTHB,211600,"B1 must use new role/activity costs only");
assert.equal(bc.byCode.B1.b1SupportPlanningBudget.proposedB1BaseWorkingSellTHB,m.proposedB1BaseWorkingSellTHB);
// Part B selected pricing has changed since the original B1-only test was
// authored: B2 Rev05 THB580,000 was replaced with a first-principles
// THB237,121.13 selected Working SELL, and MGW purchased iFAT/Facility added
// THB307,125 to B3. Do not regress either price owner to satisfy a B1 test.
assert.equal(bc.byCode.B2.workingSellTHB,237121.13,
 "B2 current independent 131-WO VDRL Working SELL must be selected, not Rev05");
assert.equal(bc.previousB2Rev05ReferenceTHB,580000,
 "Old B2 quoted SELL must remain historical, nonposting evidence");
assert.equal(bc.byCode.B3.workingSellTHB,2599325,
 "B3 must include sourced MGW purchased FAT in addition to witnesses/SAT");
assert.equal(bc.byCode.B3.b3OriginalWithoutMgwPurchasedTHB,2090600,
 "B3 previous 40-day SAT / FAT witness remains a reference basis, not double posted");
assert.equal(bc.byCode.B3.b3MgwPurchasedFatWorkingSell.selectedIncrementalWorkingSellTHB,307125,
 "MGW purchased FAT Working SELL must be included once in canonical B3");
const roundTHB=v=>Math.round((v+Number.EPSILON)*100)/100;
const historicalB1OnlyBaseTHB=4187590.69; // B1-current, B2 historical Rev05, B3 before MGW purchase.
const historicalToCurrent=roundTHB(historicalB1OnlyBaseTHB
 -(bc.previousB2Rev05ReferenceTHB-bc.byCode.B2.workingSellTHB)
 +bc.byCode.B3.b3MgwPurchasedFatWorkingSell.selectedIncrementalWorkingSellTHB
 +bc.byCode.B9.workingSellTHB
 -(bc.byCode.B3.b3FortyDayBudget.laborWorkingSellTHB-bc.byCode.B3.b3SelectedSatSurveyBudget.laborWorkingSellTHB));
assert.equal(historicalToCurrent,4262586.82,
 "Historical B1-only baseline to current B2/B3 price selection bridge failed");
const sumBaseOwners=roundTHB(bc.rows.filter(r=>r.baseScope&&Number.isFinite(r.workingSellTHB))
 .reduce((sum,r)=>sum+r.workingSellTHB,0));
assert.equal(bc.knownWorkingSellTHB,sumBaseOwners,
 "Canonical Part B Base must be the sum of unique selected base-scope B owners");
assert.equal(bc.knownWorkingSellTHB,historicalToCurrent,
 "Part B Base must reconcile after B1 legacy exclusion, B2 131-WO reprice and MGW purchased FAT");
assert.equal(bc.byCode.B9.workingSellTHB,261950);
assert.equal(bc.byCode.B9.b9ChinaBudget.conditionalYardSellTHB,261950);
const jsx=fs.readFileSync(path.join(root,"project0553/B1RevKMilestoneBudget0553.jsx"),"utf8");
for(const token of ["selectB1ProjectSupportBudget0553","model.accounts.map(","model.milestones.map(",
 "model.roleRates","model.baseWorkingCostTHB","model.baseWorkingSellTHB",
 "model.canonicalB1WorkingSellTHB","model.conditionalWorkingSellTHB",
 "roleName","unitCostTHB","workingCostTHB","workingSellTHB"]){
 assert(jsx.includes(token),"Missing budget planning display: "+token);
}
assert(!jsx.includes("usdPerPersonDay"),"Old USD600 general admin widget still active");
assert(babel.transformSync(jsx,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code.length>0,
 "B1 budget JSX Babel syntax invalid");
console.log("PASS PJ2608-0553 B1 role-based planning: 19 K/12 unique events; 7 roles, 242 MH, THB 80,400 labour cost; THB 181,400 support base cost / THB 211,600 support SELL; THB 51,700 conditional sell; proposed B1 THB 211,600; Part B canonical recalculated with current B1 only.");
