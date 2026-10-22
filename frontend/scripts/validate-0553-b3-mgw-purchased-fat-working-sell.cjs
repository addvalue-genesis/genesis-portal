// PJ2608-0553 — MGW quoted iFAT+Facility USD7500 becomes current B3 PURCHASED WS.
// Vendor cost is an OFFER (not paid direct cost). Markup 20% SAMTEL + 5% ADDVALUE +
// 5% omission. Part B 5% deduction applies ONLY to the original non-purchased B3;
// two separate SAMTEL mechanisms must never charge the same purchased item twice.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src"),oldJS=require.extensions[".js"],oldJSX=require.extensions[".jsx"];
const compile=(mod,file)=>{
 const x=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(x.code,file);
};
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):oldJS(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):(oldJSX||oldJS)(m,f);
require.extensions[".css"]=()=>{};
const get=p=>require(path.join(root,"project0553",p));
const {selectB3MgwPurchasedFatWorkingSell0553:selected}=get("data/b3MgwPurchasedFatWorkingSell0553.js");
const {MGW_R2_COVER_20261020_0553:cover}=get("data/mgwP26058R2Cover20261020.js");
const {MGW_P26_058_R2_SELECTED_0553:originalMGW}=get("data/mgwP26058R2Selected0553.js");
const {selectBcTurnkeyWorkingCost0553:working}=get("data/bcTurnkeyWorkingCost0553.js");
const {selectB3WorkingSellBreakdown0553:breakdown}=get("data/b3WorkingSellBreakdown0553.js");
const {selectB3HierarchicalPriceTable0553:hierarchy}=get("data/b3HierarchicalPriceTable0553.js");
const {selectScopePartBcWorking0553:scope}=get("data/scopePartBcReadModel0553.js");
const {priceBWorkingSell0553:priceB,buildReleaseCommercialModel0553:release,
 RELEASE_POLICY_0553:policy}=get("data/releaseCommercialModel0553.js");
const {BcCostEvidenceDetail0553:Owner}=get("BcCostEvidenceDetail0553.jsx");
const quote=selected(),b=working(),b3=b.byCode.B3,b3Snap=JSON.stringify(b3);
assert.equal(quote.vendorPurchasedQuoteUSD,7500);
assert.equal(quote.vendorPurchasedQuoteTHB,236250);
assert.equal(quote.samTelMarkupTHB,47250);
assert.equal(quote.addvalueMarkupTHB,11812.5);
assert.equal(quote.omissionReserveTHB,11812.5);
assert.equal(quote.selectedIncrementalWorkingSellTHB,307125);
assert.deepEqual(quote.quoteLines.map(x=>x.serviceId),["SERV-2","SERV-4"]);
assert.equal(quote.quoteLines[0].quotedAmountUSD,5000);
assert.equal(quote.quoteLines[1].quotedAmountUSD,2500);
assert.equal(cover.equipmentTotalUSD,350341);
assert.equal(originalMGW.equipmentTotalUSD,350341);
assert.equal(cover.overallTotalUSD,368841);
assert.equal(quote.sourceVendorQuoteTotalUSD,368841);
assert.equal(quote.sourceVendorQuoteServicesUSD,18500);
assert.equal(quote.vendorPurchasedQuoteTHB,
 Math.round(quote.vendorPurchasedQuoteUSD*31.5*100)/100);
assert.equal(quote.verifiedDirectCostTHB,null);
assert.equal(quote.customerReleaseAllowed,false);
assert.equal(quote.partADuplicationCheckState.startsWith("OPEN"),true);
assert.equal(quote.policy.bStandardFivePctDeductionOnPurchasedComponentAllowed,false);
assert.equal(quote.policy.samTelCostMarkupPct,policy.aAndC.samtelCostPct);
assert.equal(quote.policy.addvalueCostMarkupPct,policy.aAndC.addvalueCostPct);
assert.equal(quote.policy.omissionReserveCostMarkupPct,policy.aAndC.omissionReserveCostPct);
assert.equal(b3.workingSellTHB,2599325);
assert.equal(b3.b3OriginalWithoutMgwPurchasedTHB,2292200); // current B3 minus purchased OEM FAT, SAT/Survey/China rate revisions included
assert.equal(b3.b3MgwPurchasedFatWorkingSell.selectedIncrementalWorkingSellTHB,307125);
assert.equal(b3.b3ChinaFatBudget.fatWorkingSellTHB,422600);
assert.equal(b3.b3FortyDayBudget.workingSellTHB,2046000);
assert.equal(b3.b3SelectedSatSurveyBudget.satWorkingSellTHB,1587600);
assert.equal(b3.b3SelectedSatSurveyBudget.siteSurveyWorkingSellTHB,252000);
assert.equal(b3.directCostTHB,null);
assert.equal(b3.commercialSellTHB,null);
assert.equal(b.knownWorkingSellTHB,4481186.82);
assert.equal(b.releaseAllowed,false);
assert.equal(b.costComplete,false);
const price=breakdown(b3),table=hierarchy(b3);
assert.equal(price.totalWorkingSellTHB,2599325);
assert.deepEqual(price.summary.map(x=>x.workingSellTHB),
 [1587600,252000,30000,307125,422600]);
assert.equal(price.fat.groupFatWorkingSellTHB,729725);
assert.equal(table.totalWorkingSellTHB,2599325);
assert.deepEqual(table.groups.map(x=>x.workingSellTHB),[729725,1839600,30000,0]);
const mgwRow=table.groups[0].items.find(x=>x.moduleId.endsWith(".mgw-r2-cover-20261020"));
assert.equal(mgwRow.priceClass,"PURCHASED_SERVICE_WORKING_SELL");
assert.equal(mgwRow.vendorQuoteUSD,7500);
assert.equal(mgwRow.workingSellTHB,307125);
assert.equal(mgwRow.supplierRows.length,2);
assert(table.groups[3].items.every(x=>x.workingSellTHB===null),
 "Historically replaced FAT / seven-day what-if shall not inflate B3");
const s=scope();
assert.equal(s.lines.B3.workingSellTHB,2599325);
assert.equal(s.knownAddvalueWorkingSellTHB,4481186.82);
const commercial=release();
const b3Release=commercial.b.find(x=>x.code==="B3");
assert.equal(b3Release.customerSellTHB,2599325);
assert.equal(b3Release.mgwPurchasedServicesSellIncludedTHB,307125);
assert.equal(b3Release.samTelOrdinaryB5PctDeductionTHB,114610); // 5% × current THB2,292,200 ordinary B3 only
assert.equal(b3Release.samTelPurchased20PctCostShareTHB,47250);
assert.equal(b3Release.samTelDeductionTHB,161860); // THB114,610 ordinary + THB47,250 purchased share
assert.equal(b3Release.addvalueReceivableTHB,2437465); // B3 current THB2,599,325 less THB161,860
assert.equal(b3Release.actualCostTHB,null);
assert.equal(b3Release.releaseAllowed,false);
assert.equal(commercial.approval.releaseAllowed,false);
// Generic ordinary Part B policy must remain unchanged for non-B3 lines.
const ordinary=priceB(100);
assert.equal(ordinary.customerSellTHB,100);
assert.equal(ordinary.samTelDeductionTHB,5);
assert.equal(ordinary.addvalueReceivableTHB,95);
const protectedC=priceB(2599325,null,quote);
assert.equal(protectedC.samTelDeductionTHB,161860);
assert.throws(()=>priceB(2599325,null,{...quote,
 policy:{...quote.policy,bStandardFivePctDeductionOnPurchasedComponentAllowed:true}
}),/cannot be subjected/);
const html=renderToStaticMarkup(React.createElement(Owner,{workingRow:b3}));
for(const word of ["2,599,325.00","729,725.00","422,600.00",
 "307,125.00","236,250.00","47,250.00","11,812.50",
 "7,500.00","5,000.00","2,500.00","IC-FAT-MGW-SERV-2-4"])
 assert(html.includes(word),"B3 FAT purchased/markup price table missing "+word);
const ids=[...html.matchAll(/data-component-key="([^"]+)"/g)].map(x=>x[1]);
assert.equal(ids.length,new Set(ids).size,"B3 price must preserve unique module anchors");
assert.equal(JSON.stringify(working().byCode.B3),b3Snap);
const source=fs.readFileSync(path.join(root,"project0553/data/releaseCommercialModel0553.js"),"utf8");
assert(source.includes("samTelPurchased20PctCostShareTHB"));
assert(source.includes("samTelOrdinaryB5PctDeductionTHB"));
console.log("PASS MGW item3/4 cost USD7500 / THB236250 -> SAMTEL20 THB47250 + ADDVALUE5 THB11812.50 + Reserve5 THB11812.50 -> selected WS-B3 MGW THB307125; FAT subtotal THB729725 / B3 THB2599325 / PartB THB4481186.82. 10.3 SAMTEL20 on purchase, NOT another 5%. Cost unverified, customer release HOLD.");
