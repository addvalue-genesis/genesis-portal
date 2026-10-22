// PJ2608-0553 B3 10.2 review: human-readable Survey and latest 28+2
// SAT execution WBS. Survey 7 field+2 transit days is NONPOSTING new assumption.
// Old 40 team-day/80 MD selected price stays isolated from execution plan.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const js=require.extensions[".js"],jsx=require.extensions[".jsx"];
const compile=(m,f)=>{const r=babel.transformFileSync(f,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});m._compile(r.code,f)};
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):js(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):(jsx||js)(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const {selectBcTurnkeyWorkingCost0553:working}=from("data/bcTurnkeyWorkingCost0553.js");
const {selectB3SurveySatExecutionPlan0553:plan}=from("data/b3SurveySatExecutionPlan0553.js");
const {buildBcModuleNavigator0553:nav}=from("data/bcModuleNavigator0553.js");
const {B3SurveySatExecutionPlan0553:Panel}=from("B3SurveySatExecutionPlan0553.jsx");
const {B3SiteMrSatCoverage0553:Matrix}=from("B3SiteMrSatCoverage0553.jsx");
const {BcCostEvidenceDetail0553:Host}=from("BcCostEvidenceDetail0553.jsx");
const bc=working(),b3=bc.byCode.B3,before=JSON.stringify(bc),x=plan(b3);
assert.equal(x.survey.rows.length,7);assert.equal(x.survey.crew,2);
assert.equal(x.survey.productiveTeamDays,7);assert.equal(x.survey.travelTeamDays,2);
assert.equal(x.survey.totalTeamDays,9);assert.equal(x.survey.personDays,18);
assert.equal(x.survey.onsiteLabourSellReferenceTHB,352800);
assert.equal(x.survey.travelLabourSellReferenceTHB,100800);
assert.equal(x.survey.planningLabourSellReferenceTHB,453600);
assert.equal(x.survey.selectedWorkingSellTHB,null);
assert.equal(x.survey.directCostTHB,null);assert.equal(x.survey.workingSellPostingAllowed,false);
assert.equal(x.sat.crew,2);assert.equal(x.sat.productiveTeamDays,28);
assert.equal(x.sat.productivePersonDays,56);assert.equal(x.sat.riskTeamDays,2);
assert.equal(x.sat.riskPersonDays,4);assert.equal(x.sat.executionTeamDays,30);
assert.equal(x.sat.executionPersonDays,60);
assert.equal(x.sat.managementReserveTeamDays,2);
assert.equal(x.sat.managementReservePersonDays,4);
assert.equal(x.sat.managementReserveIncluded,false);
assert.equal(x.sat.selectedBaselineTeamDays,40);
assert.equal(x.sat.selectedBaselinePersonDays,80);
assert.equal(x.sat.selectedBaselineLaborSellTHB,2016000);
assert.equal(x.sat.scenarioLabourWithRiskTHB,1512000);
assert.equal(x.phaseSummary.surveyPlusSatPlannedTeamDays,39);
assert.equal(x.phaseSummary.surveyPlusSatPlannedPersonDays,78);
assert.equal(x.phaseSummary.satTravelMOBDEMOBExcluded,true);
assert.equal(x.phaseSummary.selectedB3WorkingSellTHB,2750525);
assert.equal(x.phaseSummary.scenarioB3SATFATPlusSurveySellTHB,2700125);
assert.equal(x.customerReleaseAllowed,false);assert.equal(x.postingAllowed,false);
assert.deepEqual(x.sat.rows.map(r=>[r.id,r.productiveTeamDays]),[
 ["BF-ZPQ",2],["BF-ZWP8",2],["BF-ZWP11",2],
 ["GF-ZWP21",5],["GF-ZWP23",3],["GF-ZWP22",5],["GF-ZWP20",5],["SIT",3],["PUNCH",1]]);
assert.equal(new Set(x.sat.rows.flatMap(r=>r.linkedTests)).size,21);
assert.deepEqual(x.survey.rows.map(r=>r.site),
 ["ZPQ","ZWP8","ZWP11","ZWP21","ZWP23","ZWP22","ZWP20"]);
const html=renderToStaticMarkup(React.createElement(Panel,{workingRow:b3}));
const compact=renderToStaticMarkup(React.createElement(Panel,{workingRow:b3,compact:true}));
assert(html.includes('data-component-key="bid.budget.working.bc.b3.field-execution-plan"'));
assert(!compact.includes('data-component-key="bid.budget.working.bc.b3.field-execution-plan"'));
for(const phrase of ["28", "30", "56", "60", "80", "453,600.00", "352,800.00",
 "100,800.00", "1,512,000.00", "2,700,125.00", "2,750,525.00",
 "Site Survey", "Mobilization","Survey 7 sites","NOT ESTABLISHED","NOT POSTED"]){
 assert(html.includes(phrase),"Readable Site Survey / SAT WBS missing "+phrase);
}
const matrix=renderToStaticMarkup(React.createElement(Matrix,{workingRow:b3}));
assert(matrix.includes("28")&&matrix.includes("60")&&matrix.includes("7 site"));
assert(matrix.includes("แสดงฐานราคาเดิม 40 วัน / 80 MD"));
assert(matrix.includes("Technical SAT Test IDs ทั้ง 21 รายการ"));
const host=renderToStaticMarkup(React.createElement(Host,{workingRow:b3}));
assert(host.includes("Site Survey + SAT Execution Plan"));
assert(host.includes("Survey 2 people"));
assert(host.includes("2,750,525.00"));
const navIds=new Set(nav().map(r=>r.id));
const expected=[x.moduleId,
 ...x.survey.rows.map(r=>x.moduleId+".survey."+r.site.toLowerCase()),
 ...x.sat.rows.map(r=>x.moduleId+".sat."+r.id.toLowerCase())];
for(const id of expected){
 assert(navIds.has(id),"Module Navigator missing "+id);
 assert(html.includes('data-component-key="'+id+'"'),"Actual planned B3 task not rendered "+id);
}
const keys=[...host.matchAll(/data-component-key="([^"]+)"/g)].map(x=>x[1]);
assert.equal(keys.length,new Set(keys).size,"B3 Survey/SAT rendering duplicates DOM Module IDs");
assert.equal(JSON.stringify(working()),before,"Scenario cannot reprice 10.2 canonical B3");
assert.equal(bc.byCode.B3.directCostTHB,null);
assert.equal(bc.knownWorkingSellTHB,4385436.82);
console.log("PASS B3 readable survey/SAT: 2 people, proposed Survey 7 onsite +2 travel=9 team-days/18MD (THB453600 unposted SELL scenario, Cost null); latest SAT 28 productive+2 risk=30 team-days/60MD, +2 mgmt unposted; 7 sites and 21 tests; old 40 days/80MD retained for price audit, B3 SELL 2750525 unchanged, Release HOLD.");
