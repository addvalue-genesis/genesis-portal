// PJ2608-0553: source-led per-MR SAT work breakdown without fictional cost allocation.
// ZPQ Site price 3 team-days × 2 people × USD800 × 31.5 = THB151,200 shared;
// NEVER 3 × THB151,200 or invented MR-specific rate/hours.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const oldJs=require.extensions[".js"],oldJsx=require.extensions[".jsx"];
const compile=(mod,file)=>{
 const r=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(r.code,file);
};
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):oldJs(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):(oldJsx||oldJs)(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const {selectB3SiteMrSatCoverage0553:matrix}=from("data/b3SiteMrSatCoverage0553.js");
const {selectB3SatMrWorkBreakdown0553:breakdown}=from("data/b3SatMrWorkBreakdown0553.js");
const {selectBcTurnkeyWorkingCost0553:canon}=from("data/bcTurnkeyWorkingCost0553.js");
const {buildBcModuleNavigator0553:navigator}=from("data/bcModuleNavigator0553.js");
const {B3SiteMrSatCoverage0553:Panel}=from("B3SiteMrSatCoverage0553.jsx");
const {B3SatMrWorkBreakdown0553:Detail}=from("B3SatMrWorkBreakdown0553.jsx");
const full=matrix(),owner=canon().byCode.B3,index=navigator();
const original=JSON.stringify({currentB3:owner.workingSellTHB,days:full.budgetarySiteTimeboxes});
assert.equal(owner.workingSellTHB,2440425);
assert.equal(owner.b3SelectedSatSurveyBudget.satTeamDays,28);
assert.equal(owner.b3SelectedSatSurveyBudget.siteSurveyTeamDays,5);
assert.equal(owner.directCostTHB,null);
const zp=full.budgetarySiteTimeboxes.find(t=>t.id==="BF-ZPQ");
assert(zp);
assert.equal(zp.site,"ZPQ");
assert.equal(zp.days,3);
assert.equal(zp.crew,2);
assert.equal(zp.personDays,6);
assert.equal(zp.teamDayRateTHB,50400);
assert.equal(zp.includedLaborSellTHB,151200);
const zrows=full.rows.filter(r=>r.site==="ZPQ");
assert.deepEqual(zrows.map(x=>x.mr),["MR0001","MR0002","MR0003"]);
assert.equal(zrows.length,3);
let workCount=0;
for(const r of full.rows){
 const site=full.budgetarySiteTimeboxes.find(t=>t.id===r.budgetTimeboxId);
 const sub=breakdown(r,site,full.priceProof);
 assert.equal(sub.moduleId,r.moduleId+".work-breakdown");
 assert.equal(sub.ownerModuleId,r.moduleId);
 assert.equal(sub.sharedSiteWorkingSellTHB,site.includedLaborSellTHB);
 assert.equal(sub.siteTeamDays,site.days);
 assert.equal(sub.siteCrew,2);
 assert.equal(sub.approvedMrSpecificTeamDays,null);
 assert.equal(sub.approvedMrSpecificManDays,null);
 assert.equal(sub.approvedMrWorkingSellTHB,null);
 assert.equal(sub.verifiedMrDirectCostTHB,null);
 assert(sub.taskRows.length>=2);
 assert(sub.taskRows.every(t=>t.estimatedTeamDays===null&&t.allocatedManDays===null&&
  t.extendedWorkingSellTHB===null&&t.directCostTHB===null));
 for(const task of sub.taskRows){
  assert(task.moduleId.startsWith(r.moduleId+".task."));
  assert(index.some(e=>e.id===task.moduleId&&e.anchorModuleId===task.moduleId));
 }
 assert(index.some(e=>e.id===sub.moduleId&&e.anchorModuleId===sub.moduleId));
 workCount+=sub.taskRows.length;
 if(r.site==="ZPQ"){
  assert.equal(sub.sharedSiteWorkingSellTHB,151200);
  assert.equal(sub.sharedMrTestIds.length,3);
  assert.equal(sub.sitePersonDays,6);
 }
}
assert(workCount>60,"Each of 21 SAT modules must have detailed engineering verification activities");
const mr2=breakdown(zrows[1],zp,full.priceProof);
const mr3=breakdown(zrows[2],zp,full.priceProof);
assert(mr2.taskRows.some(x=>x.verification.includes("no new installed BDA at ZPQ assumed")));
assert(mr3.taskRows.some(x=>x.verification.includes("no assumption of new Ex phone or sounder at ZPQ")));
const rendered=renderToStaticMarkup(React.createElement(Panel,{workingRow:owner}));
for(const r of zrows){
 const module=r.moduleId+".work-breakdown";
 assert(rendered.includes('data-component-key="'+module+'"'),"Missing ZPQ MR detail: "+r.id);
 assert(rendered.includes("View MR Breakdown"),"Each Test ID should link to individual details");
}
assert(rendered.includes("ZPQ 3 team-days = THB 151,200 shared across its three Test IDs"));
const individual=renderToStaticMarkup(React.createElement(Detail,{
 testRow:zrows[0],timebox:zp,priceProof:full.priceProof,defaultOpen:true
}));
for(const phrase of [
 "THB 151,200.00","3","6","USD 800",
 "INDIVIDUAL MR WORKING SELL: NOT ESTABLISHED",
 "Estimated","NOT ALLOCATED","Module ID","4"
]){if(phrase==="Estimated")continue;assert(individual.includes(phrase),"Missing MR detail disclosure "+phrase);}
assert(individual.includes("No approved split of 3 Site days across the MR tests"));
assert(individual.includes("task.rf-channel"));
assert(!individual.includes("MR Working SELL THB 151,200.00"),"ZPQ Site envelope must not be presented as individual MR sell");
const ui=fs.readFileSync(path.join(root,"project0553/B3SiteMrSatCoverage0553.jsx"),"utf8");
assert(ui.includes("openMrDetails(r)")&&ui.includes("B3SatMrWorkBreakdown0553"));
assert.equal(JSON.stringify({currentB3:canon().byCode.B3.workingSellTHB,days:matrix().budgetarySiteTimeboxes}),original,
 "SAT subtask drilldown may not mutate any source Working SELL or Site days");
console.log("PASS B3 SAT per-MR Work Breakdown: ZPQ 3 days ×2 people ×USD800 ×FX31.5 = THB151,200 Site only; MR0001/2/3 have distinct source-led test subtasks, no invented MR/day/rate, 21 detailed modules searchable, B3 THB2,440,425 selected while historical ZPQ 3-day matrix is price-only nonposting.");
