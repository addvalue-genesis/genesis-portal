// B3: section 02 existing GEQ/PEQ source IRT -> 10.2 working proof. No extra cost posting.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src");
const orig=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const x=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(x.code,file);
 }else orig(mod,file);
};
const irt=require(path.join(root,"project0553/data/bcB3IrtSourceLedger0553.json"));
const {selectBcB3EquationExecution0553}=require(path.join(root,"project0553/data/bcB3EquationExecution0553.js"));
const {selectBcWorkCostLines0553}=require(path.join(root,"project0553/data/bcWorkCostLines0553.js"));
const {selectBcTurnkeyWorkingCost0553}=require(path.join(root,"project0553/data/bcTurnkeyWorkingCost0553.js"));
const {derivePartBcWorkingWbs0553}=require(path.join(root,"project0553/data/partBCWorkingWbs0553.js"));
const p=selectBcB3EquationExecution0553(),w=selectBcWorkCostLines0553(),b=selectBcTurnkeyWorkingCost0553();
assert.equal(p.moduleId,"bid.engineering.equations.b3");
assert.equal(p.workflowNumber,"02");
assert.equal(irt.moduleId,"bid.engineering.equations.b3.irt-source");
assert.equal(irt.records.length,109);
assert.equal(new Set(irt.records.map(r=>r.id)).size,109);
assert.deepEqual(irt.sourceDocuments.map(x=>x.count),[28,27,27,27]);
assert.deepEqual(Object.values(p.mrIrtCounts),[28,27,27,27]);
assert(p.irtSourceRows.every(x=>x.sourceStatus==="SOURCE_IRT_RFQ_NOT_APPROVED_ITP"));
assert(p.irtSourceRows.every(x=>x.itemDescription&&!/MATERIAL REQUISITION FOR|INSPECTION REQUIREMENT TABLE/.test(x.itemDescription)),"IRT source item leaked repeated PDF page headers");
assert(p.irtSourceRows.every(x=>x.eventOccurrence===null&&x.addvalueIncrementalMH===null&&!x.pricePostingAllowed));
assert.equal(p.stageRequirementCount,16);
assert.deepEqual(Object.values(p.stageRequirementGroups).map(x=>x.length),[4,4,4,4]);
assert.equal(p.stageRequirementKeys.filter(x=>x.eventGroupKey==="B3-SAMTEL-BKK-CROSS-MR").length,4);
assert(p.stageRequirementKeys.every(x=>x.billableDirectCostTHB===null&&!x.countAsAdditionalPricedVisit));
assert(p.GEQ.includes("GEQ-005")&&p.PEQ.includes("PEQ-B3-011"));
assert.equal(p.integratedFat.location,"SAMTEL Warehouse, Thailand");
assert.equal(p.integratedFat.workingTeamDays,8);
assert.equal(p.integratedFat.workingGrossShiftMH,128);
assert.deepEqual(p.integratedFat.roleWorkload.map(x=>x.grossShiftMH),[64,64]);
assert(p.integratedFat.roleWorkload.every(x=>x.model==="GEQ-005"&&x.status==="DERIVED_REVIEW"&&x.directCostStatus==="OPEN_INPUT"&&x.directCostTHB===null));
assert.equal(p.integratedFat.workingSellTHB,144000);
assert.equal(p.offshore.workingTripCount,5);
assert.deepEqual(p.offshore.workingTrips.map(x=>x.teamDays),[7,7,7,5,13]);
assert.deepEqual(p.offshore.workingTrips.map(x=>x.workingPersonDays),[14,14,14,10,26]);
assert.deepEqual(p.offshore.workingTrips.map(x=>x.grossShiftMH),[168,168,168,120,312]);
assert(p.offshore.workingTrips.every(x=>x.noAdditiveMobDemob&&x.approvedAccess===false));
assert.equal(p.offshore.workingTeamDays,39);
assert.equal(p.offshore.workingPersonDays,78);
assert.equal(p.offshore.grossShiftMH,936);
assert.deepEqual(["technical","mob","demob","integration","transfer"].map(k=>p.offshore.tripComposition[k]),[26,5,5,2,1]);
assert.equal(p.offshore.workingSellTHB,1965600);
assert.equal(p.workingSellTHB,2109600);
assert.equal(p.independentDirectCostTHB,null);
assert.equal(p.independentApprovedProductiveMH,null);
assert.equal(p.independentVerifiedSellTHB,null);
assert.equal(p.offshore.approvedPhysicalTripCount,null);
assert.equal(p.offshore.approvedSatDays,null);
assert.equal(p.offshore.approvedCommissioningDays,null);
assert.equal(p.testDocumentRows.length,20);
assert.deepEqual(p.validation.map(x=>x.status),[
 "PASS_SOURCE_IRT_ONLY","PASS_WORKING_PRICE_ONLY","PASS_INCLUDED_MOB_NOT_ADDITIVE",
 "OPEN_APPROVED_ITP_AND_TEST_EVENT_KEYS","OPEN_SAT_COM_SCHEDULE_AND_HUC",
 "OPEN_INTERNAL_COST_AND_TRANSPORT","OPEN_WITNESS_NOTICE_30_VS_14",
 "TRACE_CROSS_OWNER_NON_ADDITIVE"]);
assert.equal(p.customerReleaseAllowed,false);
assert.equal(p.postToLedger,false);
assert.equal(w.b3EquationProofModuleId,p.moduleId);
assert.deepEqual(w.b3EquationProof,p);
assert.equal(b.b3EquationProofModuleId,p.moduleId);
assert.deepEqual(b.b3EquationProof,p);
assert.equal(b.byCode.B3.b3EquationProofModuleId,p.moduleId);
assert.equal(b.byCode.B1.b3EquationProofModuleId,null);
assert.equal(b.byCode.B2.b3EquationProofModuleId,null);
assert.equal(b.byCode.B3.workingSellTHB,2322450);
assert.equal(b.knownWorkingSellTHB,6223782.87,"Current Part B Base includes replacement B1/B3/B9 + selected B5/B6/B7/B10/B11/B13");
assert.equal(b.knownWorkingSellTHB,Math.round(b.rows.filter(x=>x.baseScope&&Number.isFinite(x.workingSellTHB)).reduce((n,x)=>n+x.workingSellTHB,0)*100)/100,"Optional C1/C2 excluded");
assert.equal(b.knownDirectCostTHB,null);
assert.equal(b.releaseAllowed,false);
assert.equal(derivePartBcWorkingWbs0553().subtotalTHB,3804160);
assert.equal(w.rows.length,111);
assert.equal(w.requiredAuditCount,40);
const ui=fs.readFileSync(path.join(root,"project0553/B3EquationAudit0553.jsx"),"utf8");
assert(ui.includes("proof.irtSourceRows.map")&&ui.includes("proof.offshore.workingTrips.map")&&ui.includes("proof.validation.map")&&ui.includes("proof.testDocumentRows.map"));
const page=fs.readFileSync(path.join(root,"pages/PJ26080553.jsx"),"utf8");
const budget=fs.readFileSync(path.join(root,"project0553/BcWorkCostLines0553.jsx"),"utf8");
assert(page.includes("<B3EquationAudit0553/>"));
assert(budget.includes("<B3EquationAudit0553 selectedCode={selectedCode}/>"));
for(const f of ["project0553/B3EquationAudit0553.jsx","project0553/BcWorkCostLines0553.jsx","pages/PJ26080553.jsx"]){
 assert(babel.transformFileSync(path.join(root,f),{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code.length>0);
}
console.log("PASS B3 existing GEQ/PEQ: 109 RFQ IRT points (28/27/27/27), 16 non-priced MR-stage requirements, 8 BKK FAT team-days (128 gross shift MH), 5 offshore trips / 39 team-days / 78 MD (936 shift MH), 10 included MOB/DEMOB, THB2,109,600 source Working SELL unchanged; direct COST OPEN.");
