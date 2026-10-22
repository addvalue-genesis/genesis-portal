// PJ2608-0553 MGW Oct20 updated cover — VENDOR quote evidence ONLY.
// No silent 10.2 B3/B5/B6 SELL or protected Rev02/Rev03 mutation.
const assert=require("node:assert/strict"),path=require("node:path");
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const oldJs=require.extensions[".js"],oldJsx=require.extensions[".jsx"];
const compile=(mod,filename)=>{
 const out=babel.transformFileSync(filename,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(out.code,filename);
};
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):oldJs(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):(oldJsx||oldJs)(m,f);
require.extensions[".css"]=()=>{};
const get=p=>require(path.join(root,"project0553",p));
const {MGW_R2_COVER_20261020_0553:v}=get("data/mgwP26058R2Cover20261020.js");
const {MGW_P26_058_R2_SELECTED_0553:detail}=get("data/mgwP26058R2Selected0553.js");
const {MGW_PAUL_EMAIL_CLARIFICATIONS_0553:email}=get("data/mgwPaulEmailClarifications0553.js");
const {MGW_ROAD_FREIGHT_PACKING_EVIDENCE_0553:delivery}=get("data/mgwRoadFreightPackingEvidence0553.js");
const {SUPPLIER_QUOTE_LINES_0553:registry}=get("data/supplierQuoteLines.js");
const {selectBcTurnkeyWorkingCost0553:working}=get("data/bcTurnkeyWorkingCost0553.js");
const {MgwR2CommercialCover0553:CoverUI}=get("MgwR2CommercialCover0553.jsx");
const {BcCostEvidenceDetail0553:EvidenceUI}=get("BcCostEvidenceDetail0553.jsx");
assert.equal(v.quoteNumber,"P26-058_R2");
assert.equal(v.quoteDate,"2026-10-20");
assert.equal(v.equipmentTotalUSD,350341);
assert.equal(v.priorCommercialServiceTotalUSD,14500);
assert.equal(v.serviceTotalUSD,18500);
assert.equal(v.priorOverallTotalUSD,364841);
assert.equal(v.overallTotalUSD,368841);
assert.equal(v.changes.equipmentDeltaUSD,0);
assert.equal(v.changes.iFatDeltaUSD,-1000);
assert.equal(v.changes.newFATFacilityUSD,2500);
assert.equal(v.changes.newRoadFreightUSD,2500);
assert.equal(v.changes.overallDeltaUSD,4000);
assert.deepEqual(v.services.map(x=>[x.id,x.usd]),[
 ["SERV-1",8000],["SERV-2",5000],["SERV-4",2500],
 ["SERV-3",500],["SERV-5",2500]
]);
assert.equal(v.services.reduce((sum,x)=>sum+x.usd,0),18500);
assert(v.services.every(x=>!x.workingCostPostingAllowed&&!x.workingSellPostingAllowed&&x.directCostTHB===null));
assert.equal(v.freight.emailUSD,v.freight.quotedUSD);
assert.equal(v.freight.includedInOverallTotal,true);
assert.equal(v.freight.additiveToEmail,false);
assert.equal(v.deliveryTerms.termsReconciled,false);
assert.equal(v.deliveryTerms.cover,"DAP Nantong China");
assert.equal(v.deliveryTerms.previousDetail,"EX WORKS Nantong China");
assert.equal(v.FAT.internalFatDays,2);
assert.equal(v.FAT.facilityEndUserDaysMinimum,5);
assert.equal(v.FAT.addvalueExistingWitnessDaysBudgeted,6);
assert.equal(v.FAT.attendanceVsVenueReconciled,false);
assert.equal(email.pricedVendorFreight.usd,2500);
assert.equal(delivery.coverFreightUSD,2500);
assert.equal(delivery.coverPackingUSD,500);
assert.equal(delivery.supplierMessageRoadFreightUSD,2500);
assert.equal(delivery.supplierConfirmsRoadFreightIncludesPacking,true);
assert.equal(delivery.possibleOverlapUSD,500);
assert.equal(delivery.confirmedCreditUSD,null,"No confirmed packing credit until a supplier amendment");
assert.equal(delivery.vendorQuoteTotalUSD,368841,"Latest vendor offer unchanged by WhatsApp");
assert.equal(delivery.adjustedSupplierTotalUSD,null);
assert.equal(delivery.directCostPostingAllowed,false);
assert.equal(delivery.b5WorkingSellOverrideAllowed,false);
assert.equal(delivery.b6WorkingSellOverrideAllowed,false);
assert.equal(delivery.navigationMap.routeDistanceKmIndicative,1639);
assert.equal(delivery.navigationMap.transitTimeForCargoVerified,null);

assert.equal(detail.equipmentTotalUSD,350341);
assert.equal(detail.overallTotalUSD,364841);
assert.equal(detail.services.reduce((sum,x)=>sum+x.amountUSD,0),14500);
const vendorRecords=registry.filter(x=>x.id===detail.id);
assert.equal(vendorRecords.length,1);
const vendor=vendorRecords[0];
assert.equal(vendor.quotedTotal,368841);
assert.equal(vendor.date,"2026-10-20");
assert.equal(vendor.source,v.sourceUrl);
assert.equal(vendor.detailSource,detail.source);
assert.equal(vendor.lines.reduce((sum,x)=>sum+x[5],0),368841);
assert.equal(vendor.lines.length,11);
assert.equal(vendor.lines.find(x=>x[0]==="SERV-5")[5],2500);
const b=working();
const owners=["B1","B2","B3","B5","B6","B10","B11","C2"];
const before=JSON.stringify(owners.map(x=>[x,b.byCode[x].workingSellTHB,b.byCode[x].directCostTHB]));
for(const [code,serviceIds] of [
 ["B1",["SERV-1"]],["B2",["SERV-1"]],
 ["B3",["SERV-2","SERV-4"]],["B5",["SERV-3"]],["B6",["SERV-5"]]]){
 const html=renderToStaticMarkup(React.createElement(CoverUI,{code}));
 assert(html.includes("368,841.00"),"Cover total "+code);
 for(const id of serviceIds)
  assert(html.includes(id),"Missing owner service "+code+" "+id);
 assert(html.includes("NOT")||html.includes("NO COST"),"No posting warning "+code);
 const joined=renderToStaticMarkup(React.createElement(EvidenceUI,{workingRow:b.byCode[code]}));
 assert(joined.includes('data-component-key="bid.budget.working.bc.'+code.toLowerCase()+'.mgw-r2-cover-20261020"'),
 "10.2 owner should surface updated MGW cover evidence "+code);
}
for(const code of ["B5","B6"]){
 const html=renderToStaticMarkup(React.createElement(CoverUI,{code}));
 assert(html.includes('data-component-key="'+delivery.moduleIds[code]+'"'),code+" new supplier chat module missing");
 assert(html.includes("2,500.00")&&html.includes("500.00"),code+" freight/packing source values missing");
 assert(html.includes("Confirmed deduction: NOT ESTABLISHED"),code+" no unauthorized USD500 credit");
 assert(html.includes("Zhuhai Jutal")&&html.includes("DAP Nantong"),code+" destination and Incoterm conflict hidden");
}
const b3=renderToStaticMarkup(React.createElement(CoverUI,{code:"B3"}));
assert(b3.includes("minimum")&&b3.includes("6 FAT witness days"));
const b6=renderToStaticMarkup(React.createElement(CoverUI,{code:"B6"}));
assert(b6.includes("ALREADY INCLUDED")&&b6.includes("NOT another USD2,500"));
assert.equal(b.byCode.B3.workingSellTHB,2397725);
assert.equal(b.byCode.B3.b3MgwPurchasedFatWorkingSell.selectedIncrementalWorkingSellTHB,307125);
assert.equal(JSON.stringify(owners.map(x=>[x,working().byCode[x].workingSellTHB,working().byCode[x].directCostTHB])),before);
console.log("PASS MGW R2 20-Oct COVER + chat packing overlap: USD350341 equipment unchanged, services 14500->18500, total 364841->368841 (+4000), iFAT 5000, FAT facility 2500, road freight 2500 counted once, 10.2 B3 management-selected 307125 purchased service markup through controlled WS only, protected historic vendor quote unchanged; customer release HOLD.");
