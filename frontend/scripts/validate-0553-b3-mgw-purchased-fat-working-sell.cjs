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
// Equipment-only correction: retain raw quote provenance, never active service funding.
assert.equal(quote.vendorPurchasedQuoteUSD,0);
assert.equal(quote.vendorPurchasedQuoteTHB,0);
assert.equal(quote.samTelMarkupTHB,0);
assert.equal(quote.addvalueMarkupTHB,0);
assert.equal(quote.omissionReserveTHB,0);
assert.equal(quote.selectedIncrementalWorkingSellTHB,0);
assert.equal(quote.includedInB3WorkingSell,false);
assert.equal(quote.selectedSupplierPurchase,false);
assert.deepEqual(quote.quoteLines,[]);
assert.deepEqual(quote.historicalQuoteLines.map(x=>x.serviceId),["SERV-2","SERV-4"]);
assert.equal(quote.historicalWithdrawnWorkingSellTHB,307125);
assert.equal(cover.equipmentTotalUSD,350341);
assert.equal(originalMGW.equipmentTotalUSD,350341);
assert.equal(cover.overallTotalUSD,368841);
assert.equal(quote.verifiedDirectCostTHB,null);
assert.equal(b3.workingSellTHB,2322450);
assert.equal(b3.b3OriginalWithoutMgwPurchasedTHB,2322450);
assert.equal(b3.b3ChinaFatBudget.fatWorkingSellTHB,452850);
assert.equal(b3.b3SelectedSatSurveyBudget.satWorkingSellTHB,1587600);
assert.equal(b3.b3SelectedSatSurveyBudget.siteSurveyWorkingSellTHB,252000);
assert.equal(b3.directCostTHB,null);
assert.equal(b.knownWorkingSellTHB,4994787.13);
assert.equal(b.releaseAllowed,false);
const price=breakdown(b3),table=hierarchy(b3);
assert.deepEqual(price.summary.map(x=>x.workingSellTHB),[1587600,252000,30000,452850]);
assert.deepEqual(table.groups.map(x=>x.workingSellTHB),[452850,1839600,30000,0]);
assert(!table.groups.flatMap(x=>x.items).some(x=>x.priceClass==='PURCHASED_SERVICE_WORKING_SELL'));
assert.equal(table.supplierFatReferenceUSD,0);
const s=scope(),commercial=release(),b3Release=commercial.b.find(x=>x.code==='B3');
assert.equal(s.lines.B3.workingSellTHB,b3.workingSellTHB);
assert.equal(s.knownAddvalueWorkingSellTHB,b.knownWorkingSellTHB);
assert.equal(b3Release.customerSellTHB,b3.workingSellTHB);
assert.equal(b3Release.mgwPurchasedServicesSellIncludedTHB,0);
assert.equal(b3Release.samTelPurchased20PctCostShareTHB,0);
assert.equal(b3Release.samTelOrdinaryB5PctDeductionTHB,116122.5);
assert.equal(b3Release.samTelDeductionTHB,116122.5);
assert.equal(b3Release.addvalueReceivableTHB,2206327.5);
assert.equal(b3Release.actualCostTHB,null);
assert.equal(b3Release.releaseAllowed,false);
assert.equal(priceB(100).samTelDeductionTHB,5);
assert.equal(priceB(2322450,null,quote).samTelDeductionTHB,116122.5);
assert.throws(()=>priceB(2322450,null,{...quote,policy:{...quote.policy,bStandardFivePctDeductionOnPurchasedComponentAllowed:true}}),/cannot be subjected/);
const Dossier=get('B3ResourcePriceDossier0553.jsx').B3ResourcePriceDossier0553;
const html=renderToStaticMarkup(React.createElement(Dossier,{workingRow:b3}));
assert(html.includes('2,322,450.00'));
assert(!html.includes('307,125.00'));
assert(!html.includes('236,250.00'));
assert(!html.includes('MGW service / facility'));
assert(html.includes('resource-price-dossier.group.01.site.01'),'Withdrawn source ID remains traceable without price');
const ids=[...html.matchAll(/data-component-key="([^"]+)"/g)].map(x=>x[1]);
assert.equal(ids.length,new Set(ids).size);
assert.equal(JSON.stringify(working().byCode.B3),b3Snap);
console.log('PASS MGW equipment-only: no active FAT services/reserve, raw quote preserved, local FAT452850, B3 2322450, PartB4994787.13; ordinary B5% once and reverse-source parity.');

assert(get('data/bcModuleNavigator0553.js').buildBcModuleNavigator0553().some(x=>x.id==='bid.budget.working.bc.b3.resource-price-dossier.group.01.site.01'),'Withdrawn exact link remains registered');
