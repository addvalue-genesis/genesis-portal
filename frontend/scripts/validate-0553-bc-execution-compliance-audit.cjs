// PJ2608-0553 mandatory 01–08 engineering-to-economics audit.
// Read-only; original Cost Baseline Rev02, WBS Rev05 SELL and historical Rev08
// are protected from synthetic freight, permit, MOB or license posting.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src");
const oldJS=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const t=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(t.code,file);
 }else oldJS(mod,file);
};
const from=p=>require(path.join(root,"project0553",p));
const {selectBcExecutionComplianceAudit0553,BC_EXECUTION_AUDIT_ITEMS_0553}=from("data/bcExecutionComplianceAudit0553.js");
const {evaluateOffshoreMobDemobEconomics0553}=from("data/bcMobDemobEconomics0553.js");
const {selectBcTurnkeyWorkingCost0553}=from("data/bcTurnkeyWorkingCost0553.js");
const {derivePartBcWorkingWbs0553}=from("data/partBCWorkingWbs0553.js");
const {FAT_EXECUTION_BASIS_0553}=from("data/fatExecutionBasis0553.js");
const oldWbs=JSON.stringify(derivePartBcWorkingWbs0553()),oldLedger=JSON.stringify(selectBcTurnkeyWorkingCost0553());
const a=selectBcExecutionComplianceAudit0553();
assert.equal(a.moduleId,"bid.budget.working.bc.execution-audit");
assert(a.sourceCount>=15&&a.requirements.length>=38,"All reviewed MR/SPE/DTS/BOD/ANNEX sources required");
assert.equal(new Set(a.requirements.map(x=>x.id)).size,a.requirements.length);
const customerCodes=["B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","B14","C1","C2"];
for(const code of customerCodes){
 assert(a.byCode[code].length>0,"No evidence for customer code "+code);
 assert(a.byCode[code].every(x=>x.code===code));
}
const docIds=new Set(a.sources.map(s=>s.id));
for(const item of a.requirements){
 assert(item.steps&&item.source&&item.section&&item.costDriver&&item.owner&&item.state);
 assert(docIds.has(item.source),"Missing human-traceable source "+item.id);
 assert(!Object.hasOwn(item,"directCostTHB"),"Evidence must not invent direct cost");
}
const canonical=selectBcTurnkeyWorkingCost0553();
for(const code of customerCodes){
 const current=canonical.byCode[code];
 assert.equal(current.executionAuditModuleId,a.moduleId);
 assert.equal(current.executionAuditCount,a.byCode[code].length);
 assert.deepEqual(current.executionAuditIds,a.byCode[code].map(x=>x.id));
 assert.equal(current.directCostTHB,null,"Trace cannot promote WBS SELL to Direct Cost");
}
assert.equal(a.offshore.tripCount,5);
assert.deepEqual(a.offshore.trips.map(t=>t.teamDays),[7,7,7,5,13]);
assert.equal(a.offshore.teamDays,39);
assert.equal(a.offshore.crew,2);
assert.equal(a.offshore.personDays,78);
assert.equal(a.offshore.activeB3WorkingSellTHB,2109600);
assert.equal(a.offshore.supersededTeamDays,44);
assert.equal(a.offshore.supersededPersonDays,88);
assert.equal(a.offshore.supersededMustNotPost,true);
assert.equal(a.offshore.mobilizationsPerTrip,null);
assert.equal(a.offshore.actualCrewMovementAndPOB,null);
assert(a.byCode.B3.some(x=>x.state==="NOTICE_14_VS_30_CONFLICT__PLAN_30"));
assert(a.byCode.B3.some(x=>x.state==="DUAL_FAT_STAGE_ACCEPTANCE_AND_NOTICE_30D_GATED"));
assert(a.byCode.B6.some(x=>x.state==="LICENSE_AUTHORIZATION_FEES_AND_SCHEDULE_OPEN"));
assert(a.byCode.B6.some(x=>x.state==="EXPORTER_ID_AND_PERMIT_APPLICABILITY_REQUIRED"));
assert(a.byCode.B6.some(x=>x.state==="NAMED_NANTONG_YARD_ADDRESS_AND_INCOTERM_PENDING"));
assert(a.byCode.B11.some(x=>x.state==="TETRA_VS_DMR_AND_OEM_INCLUSION_GATED"));
assert(a.byCode.B10.some(x=>x.state==="OEM_PART_NUMBERS_RATE_QTY_REQUIRED"));
for(const mr of ["MR0001-C1","MR0002-C1","MR0003-C1","MR0004-C1"]){
 assert(a.sources.some(x=>x.id===mr));
 assert(a.byCode.B10.some(x=>x.source===mr&&x.finding.includes("not")),
  "Original MR reviewer says physically SUPPLY spares, not only a list: "+mr);
}
assert(a.byCode.B3.some(x=>x.source==="MR0004-C1"&&x.state==="RACON_OFFSHORE_SAT_COMMISSIONING_MANDATORY"));
assert(a.byCode.C1.length&&a.byCode.C2.length);
assert.deepEqual(a.specialTools.map(x=>x.quantity),[1,1,1,1,1]);
assert(a.specialTools.some(x=>x.state==="APPLICABILITY_GATED_BOD_CURRENT_DMR"));
assert(a.laborPricePolicy.includes("SELL REFERENCE"));
assert(a.laborPricePolicy.includes("payroll"));
for(const key of ["workingCostTHB","permitFeesTHB","freightTHB","mobDemobActualCostTHB"])
 assert.equal(a[key],null,"No guessed permit/freight/staff cost: "+key);
assert.equal(a.customerReleaseAllowed,false);
const mobBase=evaluateOffshoreMobDemobEconomics0553();
assert.equal(mobBase.state,"INSUFFICIENT_VERIFIED_COST_OR_ACCESS_DATA");
assert.equal(mobBase.recommendation,null);
assert.equal(mobBase.workingB3SellReferenceTHB,2109600);
assert.equal(mobBase.directCostPostingAllowed,false);
const syntheticSites=["ZWP20","ZWP21","ZWP22","ZWP23","ZPQ","ZWP8","ZWP11"];
const makeOption=(id,n,extra=0)=>({id,rotationCount:n,coveredSites:syntheticSites,
 hucApproved:true,simopsApproved:true,pobApproved:true,marineTransfersApproved:true,
 approvedScheduleRef:"SYNTHETIC_VALIDATION_ONLY",transferAndAdditionalCostTHB:extra});
const compared=evaluateOffshoreMobDemobEconomics0553({
 crewCostTHBPerMD:1000,travelTHBPerPersonRoundTrip:5000,
 extraMobDemobMDPerRotation:2,mobDemobAlreadyIncludedIn39:false,
 options:[makeOption("TEST-FIVE",5),makeOption("TEST-FOUR",4,2000)]
});
assert.equal(compared.state,"COMPARABLE_COST_SCENARIOS_PENDING_MANAGEMENT_RELEASE");
assert.equal(compared.recommendation.id,"TEST-FOUR");
assert.equal(compared.scenarios[0].scenarioTotalDirectCostTHB,138000);
assert.equal(compared.scenarios[1].scenarioTotalDirectCostTHB,128000);
assert(compared.scenarios.every(o=>o.includedInCurrentCostLedger===false));
const unapproved=evaluateOffshoreMobDemobEconomics0553({
 crewCostTHBPerMD:1000,travelTHBPerPersonRoundTrip:5000,
 extraMobDemobMDPerRotation:2,mobDemobAlreadyIncludedIn39:false,
 options:[makeOption("TEST-FIVE",5),{...makeOption("TEST-FOUR",4),hucApproved:false}]
});
assert.equal(unapproved.recommendation,null,"Unapproved HUC must block economic trip recommendation");
assert.equal(unapproved.scenarios[1].scenarioTotalDirectCostTHB,null);
const mobIncluded=evaluateOffshoreMobDemobEconomics0553({
 crewCostTHBPerMD:1000,travelTHBPerPersonRoundTrip:5000,
 extraMobDemobMDPerRotation:2,mobDemobAlreadyIncludedIn39:true,
 options:[makeOption("TEST-FIVE",5),makeOption("TEST-FOUR",4,2000)]
});
assert.equal(mobIncluded.scenarios[0].extraMobCostTHB,0,"Do not duplicate MOB labor already included in working base");
assert.equal(FAT_EXECUTION_BASIS_0553.integratedFat.location,"SAMTEL Bangkok, Thailand");
assert.equal(JSON.stringify(derivePartBcWorkingWbs0553()),oldWbs);
assert.equal(JSON.stringify(selectBcTurnkeyWorkingCost0553()),oldLedger);
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const ui=read("project0553/BcExecutionComplianceAudit0553.jsx");
const workspace=read("project0553/CommercialWorkspace.jsx"),navigator=read("pages/PJ26080553.jsx");
for(const name of ["project0553/BcExecutionComplianceAudit0553.jsx","project0553/CommercialWorkspace.jsx","pages/PJ26080553.jsx"])
 assert(babel.transformSync(read(name),{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code,
  "JSX Syntax check "+name);
assert(workspace.includes('<BcExecutionComplianceAudit0553 selectedCode={bcTab}/>'));
assert(workspace.includes('exact?.tagName==="DETAILS"'));
assert(navigator.includes('id:"bid.budget.working.bc.execution-audit"'));
assert(ui.includes('data-component-key={m.moduleId}'));
assert(ui.includes('componentKey={m.moduleId}'));
assert(ui.includes('m.offshore.trips.map('));
assert(ui.includes('visible.map(row=>'));
assert(ui.includes('m.specialTools.map('));
assert(ui.includes("m.regulatoryPolicy")&&ui.includes("m.laborPricePolicy"));
assert(ui.includes("evaluateOffshoreMobDemobEconomics0553()")&&ui.includes("mobilizationEconomics.moduleId"));
console.log("PASS 0553 B/C execution 01–08 compliance: 32+ source clauses, all B/C codes, FAT/notice conflict, 5-trip/39-team-day/78-MD WBS vs superseded 44/88, Myanmar/Thai permit RACI, Annex-8 tools, no invented cost or changed SELL.");
