// PJ2608-0553 B3 28+2 lean offshore SAT scenario regression.
// It must remain strictly read-only and preserve the 40-day canonical B3 price.
const assert=require("node:assert/strict");
const path=require("node:path");
const babel=require("@babel/core");
const React=require("react");
const {renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const priorJS=require.extensions[".js"],priorJSX=require.extensions[".jsx"];
const load=(mod,file)=>{
 const result=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(result.code,file);
};
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?load(m,f):priorJS(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?load(m,f):(priorJSX||priorJS)(m,f);
require.extensions[".css"]=()=>{};
const from=f=>require(path.join(root,"project0553",f));
const {selectBcTurnkeyWorkingCost0553}=from("data/bcTurnkeyWorkingCost0553.js");
const {selectB3FortyDayWorkingSell0553}=from("data/b3FortyDayWorkingSell0553.js");
const {selectB3LeanSatScenario0553}=from("data/b3LeanSatScenario0553.js");
const {B3LeanSatScenario0553}=from("B3LeanSatScenario0553.jsx");
const {B3WorkTypeAccordion0553}=from("B3WorkTypeAccordion0553.jsx");
const before=selectBcTurnkeyWorkingCost0553().byCode.B3;
const source=selectB3FortyDayWorkingSell0553();
const snapshot=JSON.stringify({b3:before.workingSellTHB,cost:before.directCostTHB,days:source.rows});
const plan=selectB3LeanSatScenario0553(before);
assert.equal(plan.moduleId,"bid.budget.working.bc.b3.lean-sat-28plus2");
assert.equal(plan.postingAllowed,false);
assert.equal(plan.releaseAllowed,false);
assert.equal(plan.directCostTHB,null);
assert.equal(plan.clientPriceTHB,null);
assert.equal(plan.oldTeamDays,40);
assert.equal(plan.oldPersonDays,80);
assert.equal(plan.crew,2);
assert.equal(plan.siteCount,7);
assert.equal(plan.timeboxCount,9);
assert.equal(plan.baseTeamDays,28);
assert.equal(plan.basePersonDays,56);
assert.equal(plan.internalRiskTeamDays,2);
assert.equal(plan.internalRiskPersonDays,4);
assert.equal(plan.managementReserveTeamDays,2);
assert.equal(plan.managementReserveSellTHB,null);
assert.equal(plan.workingTeamDaysWithRisk,30);
assert.equal(plan.rateTHBPerTeamDay,50400);
assert.equal(plan.baseLabourReferenceTHB,1411200);
assert.equal(plan.internalRiskReferenceTHB,100800);
assert.equal(plan.totalOffshoreWithRiskReferenceTHB,1512000);
assert.equal(plan.rentalReferenceTHB,30000);
assert.equal(plan.fatReferenceTHB,397400);
assert.equal(plan.illustrativeWholeB3THB,1939400);
assert.equal(plan.currentWorkingSellTHB,2443400);
assert.equal(plan.comparisonSavingTHB,504000);
assert.deepEqual(plan.rows.map(x=>[x.site,x.days]),[
 ["ZPQ",2],["ZWP8",2],["ZWP11",2],["ZWP21",5],["ZWP23",3],
 ["ZWP22",5],["ZWP20",5],["Cross-site / ZPQ",3],["As-left / offshore",1]
]);
assert(plan.rows.every(x=>x.postingAllowed===false&&x.directCostTHB===null));
const html=renderToStaticMarkup(React.createElement(B3LeanSatScenario0553,{workingRow:before}));
for(const s of [
 "lean-sat-28plus2","28 team-days","56 person-days","Management Reserve",
 "ZPQ","ZWP8","ZWP11","ZWP20","ZWP21","ZWP22","ZWP23",
 "1,411,200.00","100,800.00","1,939,400.00","2,443,400.00",
 "NONPOSTING","Direct COST remains NOT ESTABLISHED"
])assert(html.includes(s),"Lean B3 SAT render missing "+s);
const nested=renderToStaticMarkup(React.createElement(B3WorkTypeAccordion0553,{workingRow:before}));
assert(nested.includes("Lean SAT/SIT 28+2")&&nested.includes(plan.moduleId),
 "B3.2 hierarchy must render read-only lean SAT scenario");
const after=selectBcTurnkeyWorkingCost0553().byCode.B3;
assert.equal(JSON.stringify({b3:after.workingSellTHB,cost:after.directCostTHB,
 days:selectB3FortyDayWorkingSell0553().rows}),snapshot,
 "Read-only scenario must not change canonical B3 working sell, cost or 40-day timeboxes");
console.log("PASS 0553 B3 28+2 lean SAT: 7 sites + 2 integrated timeboxes, 56 MD base, 4 MD risk; customer LS illustrative only; 40-day B3 unchanged.");
