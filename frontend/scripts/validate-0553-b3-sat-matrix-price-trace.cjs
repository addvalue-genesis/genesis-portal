// PJ2608-0553 / 10.2 B3 SAT/SIT 40-day coverage price trace.
// Validate CANONICAL 2-person / 40 team-day / 80 MD working sell source,
// nine shared timeboxes, 21 NON-POSTING Test IDs and actual React SSR output.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs"),babel=require("@babel/core");
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const js=require.extensions[".js"],jsx=require.extensions[".jsx"];
const compile=(mod,file)=>{
 const result=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(result.code,file);
};
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):js(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):(jsx||js)(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const {selectBcTurnkeyWorkingCost0553:canonical}=from("data/bcTurnkeyWorkingCost0553.js");
const {selectB3FortyDayWorkingSell0553:days}=from("data/b3FortyDayWorkingSell0553.js");
const {selectB3SiteMrSatCoverage0553:matrix}=from("data/b3SiteMrSatCoverage0553.js");
const {B3SiteMrSatCoverage0553:MatrixUI}=from("B3SiteMrSatCoverage0553.jsx");
const {BcCostEvidenceDetail0553:Parent}=from("BcCostEvidenceDetail0553.jsx");
const {B3WorkingSellBreakdown0553:Breakdown}=from("B3WorkingSellBreakdown0553.jsx");
const current=canonical(),b3=current.byCode.B3,original=days(),m=matrix();
const frozenSnapshot=JSON.stringify({workingSell:b3.workingSellTHB,
 directCost:b3.directCostTHB,source:original.rows,veex:original.veex});
assert.equal(b3.moduleId,"bid.budget.working.bc.b3");
assert.equal(b3.workingSellTHB,2750525);
assert.equal(b3.directCostTHB,null);
assert.equal(m.moduleId,"bid.budget.working.bc.b3.site-mr-sat-matrix");
assert.equal(m.priceBasisModuleId,"bid.budget.working.bc.b3.40-day-abc");
const p=m.priceProof;
assert.equal(p.persons,2);
assert.equal(p.workdays,40);
assert.equal(p.personDays,80);
assert.equal(p.rateUSDPerPersonDay,800);
assert.equal(p.fxTHBPerUSD,31.5);
assert.equal(p.rateTHBPerPersonDay,25200);
assert.equal(p.rateTHBPerTeamDay,50400);
assert.equal(p.laborWorkingSellTHB,2016000);
assert.equal(p.veexRentalDays,30);
assert.equal(p.veexRentalRateTHB,1000);
assert.equal(p.veexWorkingSellTHB,30000);
assert.equal(p.offshoreWorkingSellTHB,2046000);
assert.equal(b3.b3ChinaFatBudget.fatWorkingSellTHB,397400);
assert.equal(p.offshoreWorkingSellTHB+b3.b3ChinaFatBudget.fatWorkingSellTHB+b3.b3MgwPurchasedFatWorkingSell.selectedIncrementalWorkingSellTHB,b3.workingSellTHB);
const wanted=[
 ["ZPQ",3,6,151200,3],["ZWP8",2,4,100800,1],["ZWP11",2,4,100800,1],
 ["ZWP20",8,16,403200,4],["ZWP21",7,14,352800,4],
 ["ZWP22",7,14,352800,4],["ZWP23",5,10,252000,2],
 ["Cross-site / ZPQ",4,8,201600,1],["As-left / offshore",2,4,100800,1]
];
assert.equal(m.budgetarySiteTimeboxes.length,wanted.length);
for(let i=0;i<wanted.length;i++){
 const t=m.budgetarySiteTimeboxes[i],w=wanted[i];
 assert.deepEqual([t.site,t.days,t.personDays,t.includedLaborSellTHB,t.testIds.length],w);
 assert.equal(t.crew,2);assert.equal(t.teamDayRateTHB,50400);
 assert.equal(t.sourceModuleId,p.sourceModuleId);
 assert.equal(t.postingAllowed,false);
 assert.equal(t.additionalTestSellTHB,null); // nonposting is NOT verified zero cost
 assert.equal(t.includedLaborSellTHB,t.personDays*25200);
 assert.equal(m.rows.filter(x=>x.budgetTimeboxId===t.id).length,t.testIds.length);
}
assert.equal(m.budgetarySiteTimeboxes.reduce((n,t)=>n+t.days,0),40);
assert.equal(m.budgetarySiteTimeboxes.reduce((n,t)=>n+t.personDays,0),80);
assert.equal(m.budgetarySiteTimeboxes.reduce((n,t)=>n+t.includedLaborSellTHB,0),2016000);
assert.equal(m.rows.length,21);
assert(m.rows.every(x=>x.workingSellTHB===null&&x.directCostTHB===null&&
 x.pricePostingState==="INCLUDED_IN_SHARED_SITE_TIMEBOX__NO_EXTRA_MR_TEST_CHARGE"));
const testIDs=new Set(m.budgetarySiteTimeboxes.flatMap(x=>x.testIds));
assert.equal(testIDs.size,21,"Every SAT Test ID belongs to one and only one priced Site timebox");
for(const x of m.rows)assert(testIDs.has(x.id));
const html=renderToStaticMarkup(React.createElement(MatrixUI,{workingRow:b3}));
for(const x of [
 'data-component-key="bid.budget.working.bc.b3.site-mr-sat-matrix"',
 "2 persons","40 days","80 MD","USD 800","50,400.00",
 "Site × Team Workdays × Working SELL","ZWP20","403,200.00",
 "2,016,000.00","30,000.00","397,400.00","2,750,525.00",
 "Shared across MR Test IDs","NOT per MR","SHARED SITE WORKING SELL"
])assert(html.includes(x),"Rendered SAT matrix missing "+x);
for(const r of m.rows){
 const start=html.indexOf('data-component-key="'+r.moduleId+'"');
 assert(start>=0,"Missing Test-ID module "+r.id);
 const end=html.indexOf("</tr>",start);
 assert(end>start,"Missing SAT Test-ID HTML row end "+r.id);
 const rowHtml=html.slice(start,end);
 const siteBudget=m.budgetarySiteTimeboxes.find(t=>t.id===r.budgetTimeboxId);
 assert(siteBudget,"SAT Test row missing price owner "+r.id);
 const sharedPrice="THB "+siteBudget.includedLaborSellTHB.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
 assert(rowHtml.includes("Module ID:")&&rowHtml.includes("Copy component ID "+r.moduleId),
  "SAT Test-ID must display its exact copyable Module ID: "+r.id);
 assert(rowHtml.includes(sharedPrice)&&rowHtml.includes("SHARED SITE WORKING SELL"),
  "SAT Test-ID must show source Site Working SELL visibly: "+r.id);
 assert(rowHtml.includes("NON-ADDITIVE")&&rowHtml.includes("NOT SEPARATELY PRICED"),
  "Shared Site value may not be mistaken for a second per-MR price: "+r.id);
}
const parentHtml=renderToStaticMarkup(React.createElement(Parent,{workingRow:b3}));
assert(parentHtml.includes("2,750,525.00")&&parentHtml.includes("80 MD"));
assert(parentHtml.includes("2. Site × Team Workdays × Working SELL"));
const head=renderToStaticMarkup(React.createElement(Breakdown,{workingRow:b3}));
assert(head.includes("80 Man-days")&&head.includes("40")&&head.includes("site-mr-sat-matrix"));
const host=fs.readFileSync(path.join(root,"project0553/BcCostEvidenceDetail0553.jsx"),"utf8");
assert(host.includes('<B3SiteMrSatCoverage0553 workingRow={workingRow}/>'));
assert.equal(JSON.stringify({workingSell:canonical().byCode.B3.workingSellTHB,
 directCost:canonical().byCode.B3.directCostTHB,source:days().rows,veex:days().veex}),frozenSnapshot,
 "UI/matrix may not mutate the 10.2 B3 canonical Working Sell or source days");
console.log("PASS B3 SAT Matrix cost trace: 2 persons ×40 team-days =80 MD × THB25,200 = THB2,016,000; 9 shared site/SIT/Punch allocations, 21 nonposting Test IDs, +VeEX30,000 +MGW FAT397,400 = THB2,750,525 incl MGW purchased 307,125. No new price posting.");
