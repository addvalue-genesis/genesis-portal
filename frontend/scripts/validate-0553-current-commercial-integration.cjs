/* Full 10.2 runtime selector validation — not just isolated model fixtures. */
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src");
const old=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const t=babel.transformFileSync(file,{babelrc:false,configFile:false,sourceMaps:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(t.code,file);
 }else old(mod,file);
};
const from=p=>require(path.join(root,"project0553",p));
const budget=from("data/bcTurnkeyWorkingCost0553.js").selectBcTurnkeyWorkingCost0553();
const abc=from("data/revKAbcOwnershipControl0553.js").selectRevKAbcOwnershipControl0553(budget);
const fat=from("data/fatWbsFourMr0553.js").selectFourMrFatWbs0553();
const sites=from("data/b3SiteMrSatCoverage0553.js").selectB3SiteMrSatCoverage0553();
const scope=from("data/scopePartBcReadModel0553.js").selectScopePartBcWorking0553();
const by=budget.byCode;
const release=from("data/releaseCommercialModel0553.js").buildReleaseCommercialModel0553({thbPerUsd:31.5});
assert.equal(release.moduleId,"bid.budget.pricing.release");
assert.equal(release.approval.releaseAllowed,false,"One live preview must not authorize customer issue");
assert.equal(release.b.length,14,"All B1–B14 need a release projection");
for(const line of release.b){
 const owner=by[line.code];
 assert(owner,"Release B category lacks selected 10.2 owner: "+line.code);
 assert.equal(line.workingSellTHB,owner.workingSellTHB,"Release must read selected 10.2 "+line.code);
 assert.equal(line.customerSellTHB,owner.workingSellTHB,"Release B must not reprice selected "+line.code);
}
assert.equal(release.b.find(x=>x.code==="B3").customerSellTHB,2322450,
 "User-selected SAT 28 + BF Survey 3+2 working budget must project once to Release, risk days excluded");
for(const [code,amount] of Object.entries({B1:211600,B2:237121.13,B3:2322450,B8:142550,B9:480550})){
 assert.equal(by[code].workingSellTHB,amount,"Canonical current "+code+" sell mismatch");
 assert.equal(scope.lines[code].workingSellTHB,amount,"Customer Scope/10.2 "+code+" divergence");
 assert.equal(by[code].directCostTHB,null,"Unverified direct cost posted to "+code);
}
assert.equal(budget.knownWorkingSellTHB,4757207.13);
assert.equal(abc.partBBaseTHB,budget.knownWorkingSellTHB);
assert.equal(abc.currentB1B3B9BaseTHB,3014600); // current B1 211600 + B3 2322450 + B9 480550
assert.equal(abc.postedWorkingSellDeltaTHB,0);
assert.equal(abc.b9YardConditionalLumpSumTHB,480550);
assert.equal(abc.b3FatWitnessSellTHB,452850);
assert.equal(by.B3.b3MgwPurchasedFatWorkingSell.vendorPurchasedQuoteUSD,0);
assert.equal(by.B3.b3MgwPurchasedFatWorkingSell.vendorPurchasedQuoteTHB,0);
assert.equal(by.B3.b3MgwPurchasedFatWorkingSell.selectedIncrementalWorkingSellTHB,0);
assert.equal(by.B3.b3SelectedSatSurveyBudget.satWorkingSellTHB,1587600);
assert.equal(by.B3.b3SelectedSatSurveyBudget.siteSurveyWorkingSellTHB,252000);
assert.equal(by.B3.b3SelectedSatSurveyBudget.riskTeamDaysNotIncluded,2);
assert.equal(release.b.find(x=>x.code==="B3").samTelPurchased20PctCostShareTHB,0);
assert.equal(release.b.find(x=>x.code==="B3").samTelOrdinaryB5PctDeductionTHB,116122.5);
assert.equal(release.b.find(x=>x.code==="B3").samTelDeductionTHB,116122.5);
assert.equal(abc.b9FatBaseTHB,0);
assert.ok(by.B3.b3ChinaFatBudget.rows.filter(x=>!x.optional).every(x=>x.costOwner==="B3"));
assert.ok(by.B9.b9ChinaBudget.rows.filter(x=>x.optional).every(x=>x.costOwner==="B9"));
assert.equal(by.B9.b9ChinaBudget.yardCallOutCrew,2);
assert.equal(by.B9.b9ChinaBudget.yardPhysicalDeploymentCrew,2);
assert.equal(by.B9.b9ChinaBudget.unbilledBackupCashAllowanceTHB,0);
assert.equal(fat.estimatedFatWitnessDays,3);
assert.equal(fat.rows.length,12);
assert.equal(sites.rows.length,21);
assert.equal(sites.plannedWorkingDays,40);
assert.equal(sites.postingAllowed,false);
assert.equal(budget.releaseAllowed,false);
assert.equal(budget.costComplete,false);
assert.equal(abc.customerReleaseAllowed,false);
const jsx=[
 "project0553/B3SiteMrSatCoverage0553.jsx",
 "project0553/B3WorkTypeAccordion0553.jsx",
 "project0553/B9ChinaBudgetDetail0553.jsx",
 "project0553/BcCostEvidenceDetail0553.jsx",
 "project0553/RevKAbcOwnershipControl0553.jsx",
 "project0553/CommercialWorkspace.jsx",
 "project0553/ScopeSheetsDetail0553.jsx"
];
for(const f of jsx){
 const x=babel.transformFileSync(path.join(root,f),{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 assert(x.code.length>0,"Cannot parse "+f);
}
const view=fs.readFileSync(path.join(root,"project0553/BcCostEvidenceDetail0553.jsx"),"utf8");
const workType=fs.readFileSync(path.join(root,"project0553/B3WorkTypeAccordion0553.jsx"),"utf8");
assert(view.includes("<B3WorkTypeAccordion0553 workingRow={workingRow}"),"B3 work-type accordion not mounted");
assert(workType.includes("<B3SiteMrSatCoverage0553 workingRow={workingRow}/>"),"B3 SAT matrix not mounted in SAT group");
assert(workType.includes('<B9ChinaBudgetDetail0553 budget={fat} selectedOwner="B3" purchasedServices={workingRow.b3MgwPurchasedFatWorkingSell} workingRow={workingRow}/>'),"China FAT witness must receive canonical WS-B3 owner for full total");
const workspace=fs.readFileSync(path.join(root,"project0553/CommercialWorkspace.jsx"),"utf8");
assert(workspace.includes("<RevKAbcOwnershipControl0553 working={bcWorking}/>"),"CFO current ABC not mounted");
console.log("PASS 0553 current-commercial-integration: current-source checks passed; B3 2,322,450.00 / Part B 4,757,207.13; no selected MGW FAT services; historical evidence nonposting.");
