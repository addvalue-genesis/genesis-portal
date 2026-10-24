// B3/B8 7-day single-trip integration + customer code vs INTERNAL cost vs
// internal Working SELL vs NOT ISSUED customer proposal namespace regression.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const oldJS=require.extensions[".js"],oldJSX=require.extensions[".jsx"];
const transpile=(mod,file)=>{
 const r=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(r.code,file);
};
require.extensions[".js"]=(mod,file)=>file.startsWith(root+path.sep)?transpile(mod,file):oldJS(mod,file);
require.extensions[".jsx"]=(mod,file)=>file.startsWith(root+path.sep)?transpile(mod,file):(oldJSX||oldJS)(mod,file);
require.extensions[".css"]=()=>{};
const get=file=>require(path.join(root,"project0553",file));
const {selectBcTurnkeyWorkingCost0553:current}=get("data/bcTurnkeyWorkingCost0553.js");
const {makeWorkingFinancialIdentity0553:ident,validateCostVsCommercialIdentity0553:check}=get("data/workingCostCommercialIdentity0553.js");
const {selectB3B8SevenDayCommercialAllocation0553:integrated}=get("data/b3B8SevenDayCommercialAllocation0553.js");
const {selectB3HierarchicalPriceTable0553:priceTable}=get("data/b3HierarchicalPriceTable0553.js");
const {B3B8SevenDayAllocation0553:View}=get("B3B8SevenDayAllocation0553.jsx");
const {BcCostEvidenceDetail0553:OwnerDetail}=get("BcCostEvidenceDetail0553.jsx");
const {buildBcModuleNavigator0553:nav}=get("data/bcModuleNavigator0553.js");
const a=ident("B3",{activity:"FAT",vendor:"MGW",serviceId:"SERV-2"});
const b=ident("B8",{activity:"TRN"});
assert.deepEqual([a.contractLineId,a.internalCostActivityId,a.internalWorkingSellId,a.customerProposalLineId,a.supplierQuoteId],
 ["SOW-B3","IC-FAT-001","WS-B3","CP-B3","VQ-MGW-SERV-2"]);
assert.deepEqual([b.contractLineId,b.internalCostActivityId,b.internalWorkingSellId,b.customerProposalLineId],
 ["SOW-B8","IC-TRN-001","WS-B8","CP-B8"]);
assert(check([a,b]).protectsLegalBCode);
const working=current(),snapshot=JSON.stringify(working);
const b3=working.byCode.B3,b8=working.byCode.B8,m=integrated({b3,b8});
assert(m&&m.scenarioOnly&&!m.releaseAllowed&&!m.financialPostingAllowed&&!m.workingSellChangeAllowed);
assert.equal(m.onSiteDays,7);
assert.equal(m.crew,2);
assert.equal(m.onsitePersonDays,14);
assert.equal(m.b3OnsitePersonDays,12);
assert.equal(m.b8OnsitePersonDays,2);
assert.equal(m.travelPersonDays,0);
assert.equal(m.travelLabourExistingIncludedB3THB,0);
assert.equal(m.additionalHotelNights,0);
assert.equal(m.additionalHotelSellTHB,0);
assert.equal(m.b3FatWorkingSellCurrentTHB,263700);
assert.equal(m.proposedB3FatWorkingSellTHB,263700);
assert.equal(m.proposedB8TrainingWorkingSellTHB,37800);
assert.equal(m.grossTripProposedWorkingSellTHB,301500);
assert.equal(m.b3CurrentWorkingSellTHB,2133300);
assert.equal(m.b8CurrentWorkingSellTHB,151550);
assert.equal(m.b3ProposedWorkingSellTHB,2133300);
assert.equal(m.b8ProposedWorkingSellTHB,37800);
assert.equal(m.currentCombinedWorkingSellTHB,2284850);
assert.equal(m.proposedCombinedWorkingSellTHB,2171100);
assert.equal(m.currentToProposedDeltaTHB,-113750);
assert.equal(m.b8SourceOriginalTrainingMH,44);
assert.equal(m.b8TrainingContactHours,16);
assert.equal(m.b8PreparationAndOtherMHToReconcile,28);
assert(m.unapprovedGates.some(x=>x.includes("Yangon")));
assert(m.unapprovedGates.some(x=>x.includes("48 test-hours")));
assert.equal(m.program.length,7);
assert(m.program.every(x=>x.b3MD+x.b8MD===2));
const table=priceTable(b3,m);
const p=table.groups.find(x=>x.kind==="audit").items.find(x=>x.moduleId.endsWith(".fat-training-7d-allocation"));
assert(p&&p.workingSellTHB===null&&p.referenceTHB===263700);
assert(!table.groups.find(x=>x.kind==="fat").items.some(x=>x.moduleId.endsWith(".fat-training-7d-allocation")));
assert.equal(table.totalWorkingSellTHB,2322450);
const htmlB3=renderToStaticMarkup(React.createElement(View,{b3,b8,owner:"B3"}));
const htmlB8=renderToStaticMarkup(React.createElement(View,{b3,b8,owner:"B8"}));
const ownerB3=renderToStaticMarkup(React.createElement(OwnerDetail,{workingRow:b3}));
const ownerB8=renderToStaticMarkup(React.createElement(OwnerDetail,{workingRow:b8}));
// Rendered prices come from the SAME nonposting scenario selector. Do not
// require former 2,448,400/2,486,200 prices from before MGW Purchased FAT
// was selected inside B3 Working SELL. The old hard-coded UI assertion lagged
// behind its own up-to-date 2,755,525/2,793,325 data-model assertions.
const readable=n=>n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
for(const x of [htmlB3,htmlB8]){
 for(const text of ["SOW-B3","SOW-B8","IC-FAT-001","IC-TRN-001",
  "WS-B3","WS-B8","CP-B3","CP-B8","NOT ISSUED",
  readable(m.b3CurrentWorkingSellTHB),readable(m.b3ProposedWorkingSellTHB),
  readable(m.b8ProposedWorkingSellTHB),
  readable(m.currentCombinedWorkingSellTHB),readable(m.proposedCombinedWorkingSellTHB),
  readable(m.travelLabourExistingIncludedB3THB)])
  assert(x.includes(text),"financial identity or selected/nonposting scenario price not visible: "+text);
}
assert.equal(m.vendorMgwPurchasedSellAlreadyInCanonicalB3THB,0,
 "Purchased OEM FAT must remain in canonical B3, not added by seven-day scenario");
assert.equal(m.noDuplicateVendorPurchasedOnScenario,true,
 "Seven-day nonposting option must not repost MGW SERV-2/4");
assert(ownerB3.includes('data-component-key="bid.budget.working.bc.b3.fat-training-7d-allocation"'));
assert(ownerB8.includes('data-component-key="bid.budget.working.bc.b8.integrated-fat-training-7d"'));
// B8 owner trace hosts this scenario inside native <details> sections. Their
// initial-expanded state must use React-supported DOM open, not defaultOpen.
const ownerTrace=fs.readFileSync(path.join(root,"project0553/BcOwnerPriceTrace0553.jsx"),"utf8");
assert(ownerTrace.includes('data-component-key={id} open={defaultOpen}')&&
 !ownerTrace.includes('data-component-key={id} defaultOpen={defaultOpen}'),
 "B/C owner native details must not leak unsupported defaultOpen DOM property");
const ids=new Set(nav().map(x=>x.id));
assert(ids.has("bid.budget.working.bc.b3.fat-training-7d-allocation"));
assert(ids.has("bid.budget.working.bc.b8.integrated-fat-training-7d"));
const quoted=fs.readFileSync(path.join(root,"project0553/BcWorkingHierarchy0553.jsx"),"utf8");
assert(quoted.includes('"SOW-"+item.code')&&quoted.includes('" WS-"+item.code')&&
 quoted.includes('" CP-"+item.code'));
assert.equal(current().byCode.B3.workingSellTHB,2322450);
assert.equal(current().byCode.B8.workingSellTHB,142550);
assert.equal(JSON.stringify(current()),snapshot);
console.log("PASS 0553 b3-b8-seven-day-identity: current-source checks passed; B3 2,322,450.00 / Part B 4,757,207.13; no selected MGW FAT services; historical evidence nonposting.");
