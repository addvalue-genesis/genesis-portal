// PR#30: 10.2 5-day FAT/B8 and 28+2 SAT scenario + 10.4 source/native parity.
// Does not promote illustrative SELL or alter 40-day canonical SAT Test IDs.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const prior=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const compiled=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(compiled.code,file);
 }else prior(mod,file);
};
const from=p=>require(path.join(root,"project0553",p));
const canonical=from("data/bcTurnkeyWorkingCost0553.js").selectBcTurnkeyWorkingCost0553();
const scope=from("data/scopePartBcReadModel0553.js").selectScopePartBcWorking0553();
const release=from("data/releaseCommercialModel0553.js")
 .buildReleaseCommercialModel0553({thbPerUsd:31.5});
const audit=from("estimateToBidMapping.js")
 .auditCurrentCustomerProjection0553({canonical,release,scope});
const current=canonical.byCode;
const scenarios=canonical.scenarioAudits;
assert.equal(canonical.knownWorkingSellTHB,4577057.13);
assert.equal(current.B3.workingSellTHB,2133300);
assert.equal(current.B8.workingSellTHB,151550);
assert.equal(current.B9.workingSellTHB,480550);
assert.equal(current.B9.b9ChinaBudget.conditionalYardSellTHB,480550);
assert.equal(release.b.find(x=>x.code==="B9").conditionalOptionWorkingSellTHB,480550);
assert.equal(release.b.find(x=>x.code==="B9").customerSellTHB,480550);
assert.equal(release.b.find(x=>x.code==="B9").conditionalOptionIncludedInBase,true);
assert.equal(release.b.find(x=>x.code==="B9").samTelDeductionTHB,24027.5);
assert.equal(release.b.find(x=>x.code==="B9").addvalueReceivableTHB,456522.5);
assert.equal(release.b.find(x=>x.code==="B3").customerSellTHB,2133300);
assert.equal(release.b.find(x=>x.code==="B3").samTelDeductionTHB,106665);
assert.equal(release.b.find(x=>x.code==="B3").addvalueReceivableTHB,2026635);
assert.equal(scope.lines.B3.workingSellTHB,2133300);
assert.equal(scope.lines.B8.workingSellTHB,151550);
assert.equal(scope.lines.B9.workingSellTHB,480550);
const lean=scenarios.b3LeanSat28plus2;
assert.equal(lean.baseTeamDays,28);
assert.equal(current.B3.b3SelectedSatSurveyBudget.satTeamDays,28);
assert.equal(current.B3.b3SelectedSatSurveyBudget.siteSurveyTeamDays,5);
assert.equal(current.B3.b3SelectedSatSurveyBudget.satWorkingSellTHB,1587600);
assert.equal(current.B3.b3SelectedSatSurveyBudget.siteSurveyWorkingSellTHB,252000);
assert.equal(lean.workingTeamDaysWithRisk,30);
assert.equal(lean.managementReserveTeamDays,2);
assert.equal(lean.currentWorkingSellTHB,null);
assert.equal(lean.illustrativeWholeB3THB,null);
assert.equal(lean.comparisonSavingTHB,null);
assert.equal(lean.mgwPurchasedWorkingSellTHB,null);
assert.equal(lean.supplierQuotedCostTHB,null);
assert.equal(lean.coveredTestIds.length,21);
assert.equal(new Set(lean.coveredTestIds).size,21);
assert(lean.rows.every(x=>x.testIds.length>0&&x.postingAllowed===false));
assert.equal(lean.directCostTHB,null);
assert.equal(lean.postingAllowed,false);
for(const [people,b3Amount,b8Amount] of [[1,200475,22275],[2,178200,44550]]){
 const plan=people===1?scenarios.b3B8FiveDayOneTrainer:
  scenarios.b3B8FiveDayTwoTrainers;
 assert.equal(plan.trainingCrew,people);
 assert.equal(plan.programme.length,5);
 assert.equal(plan.originalExpenseRows,8);
 assert.equal(plan.originalChinaTripSellTHB,263700);
 assert.equal(plan.fiveDayTripReferenceTHB,222750);
 assert.equal(plan.b3TripAllocatedReferenceTHB,b3Amount);
 assert.equal(plan.b8TripAllocatedReferenceTHB,b8Amount);
 assert.equal(plan.mgwPurchasedInB3WorkingSellTHB,0);
 assert.equal(plan.mgwSupplierQuotedUSD,0);
 assert.equal(plan.originalB8WorkingSellTHB,30000);
 assert.equal(plan.originalB8Hours,44);
 assert.equal(plan.trainingPreparationOverlapReconciled,false);
 assert.equal(plan.postingAllowed,false);
 assert.equal(plan.selectedWorkingSellTHB,null);
 assert.equal(plan.directCostTHB,null);
 assert.equal(new Set(plan.allocations.map(x=>x.sourceExpenseId)).size,8);
 for(const line of plan.allocations){
  assert.equal(line.postingAllowed,false);
  assert.equal(line.verifiedDirectCostTHB,null);
  assert.equal(Math.round((line.proposedB3AllocationTHB+
   line.proposedB8AllocationTHB)*100)/100,line.scenarioWorkingSellTHB);
 }
}
assert.equal(audit.declaredMappingCount,21);
assert.equal(audit.rows.filter(x=>x.code.startsWith("B")).length,14);
assert.equal(audit.selectedValueParity,true,
 "10.1/10.2/10.3/10.5 working projection values must match");
assert.equal(audit.a5Nonadditive,true);
assert.equal(audit.originalWorkbookLayoutCheckedAgainstActualBinary,false);
assert.equal(audit.customerReleaseAllowed,false);
const b3=audit.rows.find(x=>x.code==="B3"),b8=audit.rows.find(x=>x.code==="B8"),
 b9=audit.rows.find(x=>x.code==="B9");
assert.deepEqual([b3.originalCell,b8.originalCell,b9.originalCell],
 ["G26","G31","G32"]);
const workbook=fs.readFileSync(path.join(root,"project0553","nativeWorkingDraft0553.js"),"utf8");
assert(workbook.includes("const row=23+i")&&workbook.includes('write(scope,"G"+row,round(price))'),
 "Native writer must use same B1..B14 release source and customer cells");
assert(workbook.includes("const row=8+i"),"Native Part A grouping mapping missing");
const names=from("data/officialWorkbookTemplate0553.js").OFFICIAL_WORKBOOK_TEMPLATE_0553
 .sheets.find(x=>x.name==="Scope of supply").rows;
for(const [code,row] of [["B3",26],["B8",31],["B9",32]])
 assert(names.some(x=>x[0]===row&&x[1]===code&&x[2]),"Native description missing "+code);
assert.equal(release.approval.releaseAllowed,false);
console.log("PASS 0553 b3-b8-five-day-lean-parity: current-source checks passed; B3 2,133,300.00 / Part B 4,577,057.13; no selected MGW FAT services; historical evidence nonposting.");
