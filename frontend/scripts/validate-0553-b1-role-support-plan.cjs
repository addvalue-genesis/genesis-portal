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
assert.equal(m.budgetaryVsCanonicalDeltaTHB,98200);
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
assert.equal(bc.byCode.B1.workingSellTHB,211600,"Proposal must not silently reprice canonical customer B1");
assert.equal(bc.byCode.B1.b1SupportPlanningBudget.proposedB1BaseWorkingSellTHB,m.proposedB1BaseWorkingSellTHB);
assert.equal(bc.knownWorkingSellTHB,4187590.69,"Part B base must remain unchanged until CFO release");
assert.equal(bc.byCode.B3.workingSellTHB,2443400);
assert.equal(bc.byCode.B9.workingSellTHB,0);
assert.equal(bc.byCode.B9.b9ChinaBudget.conditionalYardSellTHB,233600);
const jsx=fs.readFileSync(path.join(root,"project0553/B1RevKMilestoneBudget0553.jsx"),"utf8");
for(const token of ["selectB1ProjectSupportBudget0553","model.accounts.map(","model.milestones.map(",
 "model.roleRates","model.baseWorkingCostTHB","model.baseWorkingSellTHB",
 "model.proposedB1BaseWorkingSellTHB","model.conditionalWorkingSellTHB",
 "roleName","unitCostTHB","workingCostTHB","workingSellTHB"]){
 assert(jsx.includes(token),"Missing budget planning display: "+token);
}
assert(!jsx.includes("usdPerPersonDay"),"Old USD600 general admin widget still active");
assert(babel.transformSync(jsx,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code.length>0,
 "B1 budget JSX Babel syntax invalid");
console.log("PASS PJ2608-0553 B1 role-based planning: 19 K/12 unique events; 7 roles, 242 MH, THB 80,400 labour cost; THB 181,400 support base cost / THB 211,600 support SELL; THB 51,700 conditional sell; proposed B1 THB 211,600; original Part B canonical unchanged.");
