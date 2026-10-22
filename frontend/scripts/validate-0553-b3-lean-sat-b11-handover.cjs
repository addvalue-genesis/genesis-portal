// Cross-owner source contract: last approved B3 lean execution is 28 productive
// two-person team-days +2 internal risk, +2 unpriced management reserve.
// Retain the selected 40-team-day B3 Working SELL until commercial approval.
// Contract B9 = specialist assistance; B11 = customer-retained O&M tools.
const assert=require("node:assert/strict");
const path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const oldJs=require.extensions[".js"],oldJsx=require.extensions[".jsx"];
const transpile=(m,f)=>{const x=babel.transformFileSync(f,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});m._compile(x.code,f)};
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?transpile(m,f):oldJs(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?transpile(m,f):(oldJsx||oldJs)(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const {selectBcTurnkeyWorkingCost0553:current}=from("data/bcTurnkeyWorkingCost0553.js");
const {selectB3LeanSatScenario0553:lean}=from("data/b3LeanSatScenario0553.js");
const {selectB3SiteMrSatCoverage0553:coverage}=from("data/b3SiteMrSatCoverage0553.js");
const {selectB11MinimumTools0553:tools}=from("data/b11MinimumTools0553.js");
const {buildBcModuleNavigator0553:nav}=from("data/bcModuleNavigator0553.js");
const {B3SiteMrSatCoverage0553:Sat}=from("B3SiteMrSatCoverage0553.jsx");
const {B3WorkTypeAccordion0553:Accordion}=from("B3WorkTypeAccordion0553.jsx");
const {BcCostEvidenceDetail0553:Host}=from("BcCostEvidenceDetail0553.jsx");
const w=current(),b3=w.byCode.B3,b9=w.byCode.B9,b11=w.byCode.B11;
const snapshot=JSON.stringify(w),x=lean(b3),sat=coverage(),min=tools();
assert.equal(b3.workingSellTHB,2750525);
assert.equal(b9.workingSellTHB,233600);
assert.equal(b11.workingSellTHB,128314.11);
assert.equal(w.knownWorkingSellTHB,4385436.82);
assert.equal(x.baseTeamDays,28);
assert.equal(x.internalRiskTeamDays,2);
assert.equal(x.workingTeamDaysWithRisk,30);
assert.equal(x.managementReserveTeamDays,2);
assert.equal(x.basePersonDays,56);
assert.equal(x.oldTeamDays,40);
assert.equal(x.oldPersonDays,80);
assert.equal(x.postingAllowed,false);
assert.equal(x.currentWorkingSellTHB,b3.workingSellTHB);
assert.equal(x.rows.length,9);
assert.deepEqual(x.rows.map(r=>[r.id,r.days]),[
 ["BF-ZPQ",2],["BF-ZWP8",2],["BF-ZWP11",2],["GF-ZWP21",5],
 ["GF-ZWP23",3],["GF-ZWP22",5],["GF-ZWP20",5],["SIT",3],["PUNCH",1]
]);
assert.equal(x.rows.reduce((n,r)=>n+r.days,0),28);
assert.equal(sat.priceProof.workdays,40);
assert.equal(sat.rows.length,21);
assert.equal(sat.siteMRTestCount,19);
assert.equal(min.rows.length,5);
assert(min.rows.every(r=>r.pricePostingAllowed===false&&r.budgetAllocationTHB===null));
const html=renderToStaticMarkup(React.createElement(Sat,{workingRow:b3}));
const hierarchy=renderToStaticMarkup(React.createElement(Accordion,{workingRow:b3}));
for(const item of ["28 productive +","2 risk","management-reserve","Retained 40-Day SELL Baseline",
 "40-Day Price Allocation","MGW","2 people","NOT ESTABLISHED"]){
 assert(html.toLowerCase().includes(item.toLowerCase()),"Missing lean vs priced timebox SAT UI text: "+item);
}
assert(html.includes('data-component-key="bid.budget.working.bc.b3.sat.latest-execution-days"'));
assert(hierarchy.includes("Latest SAT execution:")&&hierarchy.includes("28")&&hierarchy.includes("30"),
 "B3.sat accordion must show 28+2 execution without opening the 40-day child");
const b11Html=renderToStaticMarkup(React.createElement(Host,{workingRow:b11}));
assert(b11Html.includes('data-component-key="bid.budget.working.bc.b11.operational-tools-trace"'));
assert(b11Html.includes("128,314.11"));
assert(b11Html.includes("B1")&&b11Html.includes("B2")&&b11Html.includes("B3")&&b11Html.includes("B9"));
for(const row of min.rows)
 assert(b11Html.includes('data-component-key="bid.budget.working.bc.b11.operational-tools-trace.'+row.id.toLowerCase()+'"'),
  "Missing B11 special tool "+row.id);
const b9Html=renderToStaticMarkup(React.createElement(Host,{workingRow:b9}));
assert(b9Html.includes("B9 is Specialist Field Assistance, NOT permanent equipment procurement"),
 "B9 is human assistance; B11 owns tool handover");
assert(b9Html.includes("JUTAL Zhuhai Yard"));
const ids=new Set(nav().map(e=>e.id));
for(const item of ["bid.budget.working.bc.b3.sat.latest-execution-days","bid.budget.working.bc.b11.operational-tools-trace",
 ...x.rows.map(r=>"bid.budget.working.bc.b3.sat.latest-execution-days."+r.id.toLowerCase()),
 ...min.rows.map(r=>"bid.budget.working.bc.b11.operational-tools-trace."+r.id.toLowerCase())])
 assert(ids.has(item),"Navigator missing lean/tool anchor "+item);
assert.equal(JSON.stringify(current()),snapshot);
console.log("PASS B3 latest SAT 28 productive +2 risk (+2 nonposting reserve), 9 site/event timeboxes and 21 tests; B3 current 40-day SELL THB2750525 unchanged; B9 assistance 233600 separated from B11 permanent tools 128314.11 with five EXA-A8 rows, B1/B2/B3 links, no added cost or release.");
