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
 selectedSurvey=bc.byCode.B3.b3SelectedSatSurveyBudget,
 inbound=bc.byCode.B6.b6Mr0001ChinaInboundEvidence,
 storage=bc.byCode.B7.b7ThreeMonthStorageEvidence;
assert.equal(bc.knownWorkingSellTHB,4308914.13,"Only owner-selected SAT28 + BF Survey5 may replace the prior B3 budget; B6/B7 cannot reprice");
assert.equal(bc.byCode.B3.workingSellTHB,2599325);
assert.equal(selectedSurvey.satTeamDays,28);
assert.equal(selectedSurvey.siteSurveyTeamDays,5);
assert.equal(selectedSurvey.satWorkingSellTHB,1587600);
assert.equal(selectedSurvey.siteSurveyWorkingSellTHB,252000);
assert.equal(selectedSurvey.riskTeamDaysNotIncluded,2);
assert.equal(selectedSurvey.siteSurveyPhysicalVisitConfirmed,false);
assert.equal(selectedSurvey.directCostTHB,null);
assert.equal(bc.byCode.B6.workingSellTHB,307584);
assert.equal(bc.byCode.B7.workingSellTHB,30000);
assert.equal(bc.byCode.B9.workingSellTHB,480550);
assert.equal(release.b.find(x=>x.code==="B3").customerSellTHB,2599325);
assert.equal(release.b.find(x=>x.code==="B6").customerSellTHB,307584);
assert.equal(release.b.find(x=>x.code==="B7").customerSellTHB,30000);
assert.equal(release.b.find(x=>x.code==="B9").customerSellTHB,480550);
for(const code of ["B3","B6","B7"])
 assert.equal(scope.lines[code].workingSellTHB,bc.byCode[code].workingSellTHB);
assert.equal(survey.locations,7);
assert.equal(new Set(survey.rows.map(x=>x.site)).size,7);
assert.equal(survey.displayName,"Inspection / Site Survey / FAT / SAT");
assert(survey.scopeIncluded&&survey.rows.every(x=>
 x.surveyEffortTeamDays===null&&x.workingSellTHB===null&&!x.postingAllowed));
assert.equal(survey.alreadyPricedInCurrentSelectedB3,false); // raw seven-site source survey rows remain NONPOSTING; selected BF3+travel2 belongs to separate source owner
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
console.log("PASS 0553 B3 selected SAT28 (THB1587600) + conditional BF Survey3+travel2 (THB252000), raw 7-location Survey source NONPOSTING, B6 China inlet/B7 storage unchanged; B3 selected THB2599325, Release HOLD.");
