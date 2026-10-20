// PJ2608-0553 10.2/B3.1 explicit 2+5 FAT days, travel outside on-site and USD600/person/day.
// Compare proposed Working SELL with canonical B3; NEVER mutate source, direct cost or customer release.
const assert=require("node:assert/strict"),path=require("node:path"),babel=require("@babel/core");
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const oldJs=require.extensions[".js"],oldJsx=require.extensions[".jsx"];
const compile=(mod,file)=>{
 const out=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(out.code,file);
};
require.extensions[".js"]=(mod,file)=>file.startsWith(root+path.sep)?compile(mod,file):oldJs(mod,file);
require.extensions[".jsx"]=(mod,file)=>file.startsWith(root+path.sep)?compile(mod,file):(oldJsx||oldJs)(mod,file);
const get=p=>require(path.join(root,"project0553",p));
const {selectBcTurnkeyWorkingCost0553:working}=get("data/bcTurnkeyWorkingCost0553.js");
const {selectB3Fat2Plus5PricingScenario0553:scenario}=get("data/b3Fat2Plus5PricingScenario0553.js");
const {B3Fat2Plus5Pricing0553:Display}=get("B3Fat2Plus5Pricing0553.jsx");
const {B3WorkTypeAccordion0553:Accordion}=get("B3WorkTypeAccordion0553.jsx");
const {buildBcModuleNavigator0553:nav}=get("data/bcModuleNavigator0553.js");
const {MGW_R2_COVER_20261020_0553:cover}=get("data/mgwP26058R2Cover20261020.js");
const b=working(),row=b.byCode.B3;
const before=JSON.stringify({workingSellTHB:row.workingSellTHB,directCostTHB:row.directCostTHB,
 totalB:b.knownWorkingSellTHB,coverTotal:cover.overallTotalUSD});
const s=scenario(row);
assert.equal(s.moduleId,"bid.budget.working.bc.b3.fat-2plus5-pricing-scenario");
assert.equal(s.rateUSDPerPersonDay,600);
assert.equal(s.rateTHBPerPersonDay,18900);
assert.equal(s.planningFxTHBPerUSD,31.5);
assert.deepEqual([s.internalFatDays,s.customerFatDays,s.onsiteDays,s.persons,s.onsitePersonDays],[2,5,7,2,14]);
assert.equal(s.travelDaysPerPerson,2);
assert.equal(s.travelPersonDays,4);
assert.equal(s.allTravelSeparateFromOnsite,true);
assert.equal(s.hotelNightsPerPerson,8);
assert.equal(s.supplierFATIncludedUSD,7500);
assert.equal(s.supplierTotalUSD,368841);
assert.equal(s.supplierServiceCostPostingAllowed,false);
assert.equal(s.currentWorkingSellOverwriteAllowed,false);
assert.equal(s.customerReleaseAllowed,false);
const expected=new Map([
 ["B3-FAT-STAFF",[14,264600,37800]],
 ["B3-TRAVEL-DAYS",[4,75600,0]],
 ["B3-AIRFARE",[2,30000,0]],
 ["B3-HOTEL",[16,40000,5000]],
 ["B3-VISA",[2,8000,0]],
 ["B3-LOCAL-TRAVEL",[1,8000,0]],
 ["B3-TRAVEL-INSURANCE",[2,4000,0]],
 ["B3-WORK-INSURANCE",[2,10000,0]]
]);
assert.equal(s.rows.length,expected.size);
for(const item of s.rows){
 const x=expected.get(item.expenseId);
 assert(x,"Unexpected B3.1 expense "+item.expenseId);
 assert.deepEqual([item.qty,item.proposedWorkingSellTHB,item.deltaTHB],x);
 assert.equal(item.postingAllowed,false);
 assert.equal(item.directCostTHB,null);
}
assert.equal(s.currentFatSellTHB,397400);
assert.equal(s.proposalFatSellTHB,440200);
assert.equal(s.deltaTHB,42800);
assert.equal(s.currentB3WorkingSellTHB,2443400);
assert.equal(s.proposedB3TotalTHB,2486200);
const html=renderToStaticMarkup(React.createElement(Display,{workingRow:row}));
for(const token of ["2-day iFAT + 5-day Customer FAT","USD 600","14 person-days",
 "Travel is NOT included","440,200.00","2,486,200.00","42,800.00",
 "Customer Release HOLD","368,841"])assert(html.includes(token),"B3.1 scenario SSR missing "+token);
assert(html.includes('data-component-key="'+s.moduleId+'"'));
const rootHtml=renderToStaticMarkup(React.createElement(Accordion,{workingRow:row}));
assert(rootHtml.includes('data-component-key="'+s.moduleId+'"'),"B3.1 accordion must mount proposed scenario");
const entry=nav().find(x=>x.id===s.moduleId);
assert(entry&&entry.anchorModuleId===s.moduleId,"Project Module Navigator must deep-link B3.1 proposed price");
assert.equal(JSON.stringify({workingSellTHB:working().byCode.B3.workingSellTHB,
 directCostTHB:working().byCode.B3.directCostTHB,totalB:working().knownWorkingSellTHB,
 coverTotal:cover.overallTotalUSD}),before,"Pricing scenario must NOT alter canonical B3/CFO/quote");
console.log("PASS 0553 B3.1 2+5 on-site/2-day travel: USD600/person/day, 2 engineers, revised FAT SELL THB440200 (+42800) and B3 proposed THB2486200, unposted; MGW USD7500 supplier charge nonadditive, Customer Release HOLD.");
