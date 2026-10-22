// 0553 | user change: B3 Site Survey SOW, B6 MR1 China intake, B7 3mo storage.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const prev=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const js=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(js.code,file);
 }else prev(mod,file);
};
const from=p=>require(path.join(root,"project0553",p));
const bc=from("data/bcTurnkeyWorkingCost0553.js").selectBcTurnkeyWorkingCost0553();
const release=from("data/releaseCommercialModel0553.js").buildReleaseCommercialModel0553({thbPerUsd:31.5});
const scope=from("data/scopePartBcReadModel0553.js").selectScopePartBcWorking0553();
const quote=from("data/mgwP26058R2Cover20261020.js").MGW_R2_COVER_20261020_0553;
const template=from("data/officialWorkbookTemplate0553.js").OFFICIAL_WORKBOOK_TEMPLATE_0553;
const survey=bc.byCode.B3.b3SiteSurveyScope,
 inbound=bc.byCode.B6.b6Mr0001ChinaInboundEvidence,
 storage=bc.byCode.B7.b7ThreeMonthStorageEvidence;
assert.equal(bc.knownWorkingSellTHB,4385436.82,"B6/B7/SURVEY must never reprice selected Base automatically");
assert.equal(bc.byCode.B3.workingSellTHB,2750525);
assert.equal(bc.byCode.B6.workingSellTHB,307584);
assert.equal(bc.byCode.B7.workingSellTHB,30000);
assert.equal(bc.byCode.B9.workingSellTHB,233600);
assert.equal(release.b.find(x=>x.code==="B3").customerSellTHB,2750525);
assert.equal(release.b.find(x=>x.code==="B6").customerSellTHB,307584);
assert.equal(release.b.find(x=>x.code==="B7").customerSellTHB,30000);
assert.equal(release.b.find(x=>x.code==="B9").customerSellTHB,233600);
for(const code of ["B3","B6","B7"])
 assert.equal(scope.lines[code].workingSellTHB,bc.byCode[code].workingSellTHB);
assert.equal(survey.locations,7);
assert.equal(new Set(survey.rows.map(x=>x.site)).size,7);
assert.equal(survey.displayName,"Inspection / Site Survey / FAT / SAT");
assert(survey.scopeIncluded&&survey.rows.every(x=>
 x.surveyEffortTeamDays===null&&x.workingSellTHB===null&&!x.postingAllowed));
assert.equal(survey.alreadyPricedInCurrentSelectedB3,false);
assert.equal(survey.newIncrementalWorkingSellTHB,null);
assert.equal(inbound.bundleCount,4);
assert.equal(inbound.referenceCBM,5);
assert.equal(inbound.referenceCargoMeasurementsConfirmed,false);
assert.equal(inbound.supplierOutgoingFreightUSD,2500);
assert.equal(inbound.supplierOutgoingFreightTHB,78750);
assert.equal(inbound.supplierOutgoingFreightAlreadyInCover,true);
assert.equal(quote.freight.quotedUSD,2500);
assert.equal(inbound.preliminaryInboundLowTHB,42797);
assert.equal(inbound.preliminaryInboundHighTHB,72372);
assert.equal(inbound.comparableNetChangeVsOldRouteTHB,null);
assert.equal(inbound.incrementToCurrentB6WorkingSellTHB,null);
assert.equal(inbound.customsDutyTHB,null);
assert.equal(inbound.importVATTHB,null);
assert.equal(inbound.insurancePremiumTHB,null);
assert.equal(inbound.postingAllowed,false);
assert.equal(storage.customerRequiredFreeMonths,3);
assert.equal(storage.vendorStorageLinePresent,false);
assert.equal(storage.vendorThreeMonthsFreeStorageConfirmed,false);
assert.equal(storage.referencePalletQty,4);
assert.equal(storage.palletCountVerified,false);
assert.equal(storage.marketThreeMonthBarePalletTHBLow,4527);
assert.equal(storage.marketThreeMonthBarePalletTHBHigh,8148.6);
assert.equal(storage.currentSelectedOneMonthWorkingSellTHB,30000);
assert.equal(storage.illustrativeFullThreeMonthManagementAllowanceTHB,90000);
assert.equal(storage.illustrativeAdditionalTwoMonthsTHB,60000);
assert.equal(storage.additionalSelectedWorkingSellTHB,null);
assert.equal(storage.postingAllowed,false);
const row=(code)=>template.sheets[0].rows.find(x=>x[1]===code);
assert.equal(row("B3")[2],"Inspection, Testing and Certification as per ITP");
assert.equal(row("B6")[2],"Transportation to DDP PURCHASER'YARD");
assert.equal(row("B7")[2],"3 months Free Storage in Vendor’s Workshop");
const map=from("estimateToBidMapping.js").ESTIMATE_TO_BID_0553.records.find(x=>x.customerLine==="B3");
assert.equal(map.description,"Inspection / Site Survey / FAT / SAT",
 "Internal working alias must change WITHOUT altering original native B3 English source");
const files=["B3WorkTypeAccordion0553.jsx","BcOwnerPriceTrace0553.jsx"];
for(const file of files){
 const jsx=fs.readFileSync(path.join(root,"project0553",file),"utf8");
 assert(babel.transformSync(jsx,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code.length>0);
}
assert.equal(release.approval.releaseAllowed,false);
assert.equal(bc.byCode.B3.directCostTHB,null);
assert.equal(bc.byCode.B6.directCostTHB,null);
assert.equal(bc.byCode.B7.directCostTHB,null);
console.log("PASS 0553 B3 7-site Survey scope, B6 4-set China inlet vs MGW USD2500 outgoing, B7 3-month unquoted storage; selected prices unchanged / HOLD.");
