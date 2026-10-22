// 0553: new SPQ-001 must augment (not replace) existing MAP/GEQ, WBS and Rev08 budgets.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src");
const before=require.extensions[".js"];
require.extensions[".js"]=(m,file)=>{
 if(file.startsWith(root+path.sep)){
  const t=babel.transformFileSync(file,{babelrc:false,configFile:false,sourceMaps:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  m._compile(t.code,file);
 }else before(m,file);
};
const from=p=>require(path.join(root,"project0553",p));
const {deriveSpareRiskQuantity0553,deriveSpareReliabilityDemand0553,SPQ_001_0553,SPQ_002_0553}=from("data/spareRiskQuantity0553.js");
const {selectSpareCoverageEngineering0553}=from("data/spareCoverageEngineering0553.js");
const {selectUnifiedSpareConsumables0553}=from("data/unifiedSpareConsumables0553.js");
const {selectBcTurnkeyWorkingCost0553}=from("data/bcTurnkeyWorkingCost0553.js");
const scope=selectSpareCoverageEngineering0553(),baseline=selectUnifiedSpareConsumables0553();
const current=selectBcTurnkeyWorkingCost0553();
assert.equal(SPQ_001_0553.id,"SPQ-001");
assert(scope.reusedEquationIds.includes("MAP-06")&&scope.reusedEquationIds.includes("MAP-07"));
assert.deepEqual(scope.newEquationIds,["SPQ-001","SPQ-002"]);
assert.equal(SPQ_002_0553.id,"SPQ-002");
assert.equal(deriveSpareReliabilityDemand0553({installedCount:3}).status,"OPEN_INPUT");
assert.equal(deriveSpareReliabilityDemand0553({installedCount:1,failureRatePerYear:0,horizonYears:1,targetConfidence:0.95,evidence:"synthetic zero-failure unit test"}).quantity,0);
assert.equal(deriveSpareReliabilityDemand0553({installedCount:1,failureRatePerYear:1,horizonYears:1,targetConfidence:0.9,evidence:"synthetic unit test"}).quantity,2);
const q=deriveSpareRiskQuantity0553({installedCount:3,critical:true});
assert.equal(q.budgetQty,1);
assert.equal(q.contractualPartMinimum,null);
assert.equal(q.finalAcceptedQty,null);
assert.equal(q.pricePostingAllowed,false);
assert.equal(q.mayPoolAcrossSites,false);
assert.equal(deriveSpareRiskQuantity0553({installedCount:3,critical:true,contractualPartMinimum:4}).budgetQty,4);
assert.equal(deriveSpareRiskQuantity0553({installedCount:null,critical:true}).status,"INVALID_INPUT");
assert.deepEqual(Object.keys(scope.totals),["MR-0001","MR-0002","MR-0003","MR-0004"]);
assert(scope.totals["MR-0001"].installedTagInstances>0,"MR0001 MTO tags missing");
assert(scope.totals["MR-0002"].installedTagInstances>0,"MR0002 AFC layout tags missing");
assert.equal(scope.totals["MR-0003"].installedTagInstances,12,"MR0003 C1 4 platform x 3 installed functional tags");
assert.equal(scope.totals["MR-0004"].installedTagInstances,9,"MR0004 C1 3 platform x 3 installed functional tags");
assert(scope.byMr["MR-0003"].some(x=>x.site==="ZWP23"&&x.tag==="TPH-504-001"),"MR scope must override missing layout phone symbol");
assert(!scope.byMr["MR-0004"].some(x=>x.site==="ZWP23"),"Do not invent RACON on ZWP23");
const mr2Gap=scope.unresolvedRequirementTags.find(x=>x.mr==="MR-0002"&&x.tag==="RAD-508-001");
assert(mr2Gap&&mr2Gap.quantity===null&&
 mr2Gap.status==="REQUIREMENT_TO_SELECTED_PACKAGE_CROSSWALK_OPEN",
 "Retain MR source LNA-to-BDA substitution as OPEN, not approved release");
assert.deepEqual(mr2Gap.candidateCurrentInstalledTagsBySite,{
 ZWP20:"TCAB-508-002",ZWP21:"TCAB-508-001",ZWP22:"TCAB-508-001"
},"AFC original LNA enclosure BDA site roles, not suffix guesses");
for(const [site,bda,surge] of [
 ["ZWP20","TCAB-508-002","TCAB-508-001"],
 ["ZWP21","TCAB-508-001","TCAB-508-002"],
 ["ZWP22","TCAB-508-001","TCAB-508-002"]
]){
 const rows=scope.byMr["MR-0002"].filter(x=>x.site===site);
 assert.equal(rows.find(x=>x.functionRole==="LEGACY_LNA_ENCLOSURE")?.tag,bda);
 assert.equal(rows.find(x=>x.functionRole==="RF_SURGE_EXD")?.tag,surge);
}
assert(scope.groups.some(g=>g.mr==="MR-0002"&&g.tag==="TCAB-508-002"&&
 g.family==="DMR_BDA_ENCLOSURE_ASSEMBLY"&&g.installedSites.includes("ZWP20")));
assert(scope.groups.some(g=>g.mr==="MR-0002"&&g.tag==="TCAB-508-002"&&
 g.family==="DMR_SURGE_ASSEMBLY"&&g.installedSites.includes("ZWP21")));
assert(scope.groups.some(g=>g.mr==="MR-0002"&&g.tag==="TCAB-508-001"&&
 g.family==="DMR_SURGE_ASSEMBLY"&&g.installedSites.includes("ZWP20")));
assert.equal(new Set(scope.installed.map(x=>x.key)).size,scope.installed.length);
assert.equal(new Set(scope.groups.map(x=>x.id)).size,scope.groups.length);
assert(scope.groups.some(x=>x.family==="MARINE_RACON_MAIN"&&x.criticality==="COMMISSIONING_CRITICAL_CANDIDATE"));
assert(scope.groups.every(x=>x.sourceEvidence.length&&x.verifiedDirectCostTHB===null&&x.incrementalWorkingSellTHB===null&&!x.postToPricing));
assert(scope.groups.every(x=>x.estimatedPartQtyState.includes("BUDGETARY_SCENARIO")));
assert(scope.groups.every(x=>x.reliabilityQty===null&&x.reliabilityState==="OPEN_INPUT"));
assert.equal(scope.allSpareSkuVerified,false);
assert.equal(scope.minimumContractSatisfied,false);
assert.equal(scope.customerReleaseAllowed,false);
for(const code of ["B10","B13","C1","C2"]){
 assert.equal(scope.categoryBudgetsTHB[code],baseline.budgetTotalsTHB[code],"Risk analysis must not change budget "+code);
 assert.equal(current.byCode[code].workingSellTHB,baseline.budgetTotalsTHB[code],"Never re-price Rev08 silently");
 assert.equal(current.byCode[code].directCostTHB,null,"Working SELL is not approved direct cost");
}
assert.equal(current.knownWorkingSellTHB,4308914.13,"Protect latest owner-only Part B Base; legacy Rev05 remains audit source");
const view=fs.readFileSync(path.join(root,"project0553/ScopeBcAnnexDetail0553.jsx"),"utf8");
assert(view.includes("selectSpareCoverageEngineering0553")&&view.includes("coverage.groups.filter("));
assert(babel.transformSync(view,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code.length);
console.log("PASS 0553 SPQ-001: existing MAP equations reused; 4 MR installed tag traces, risk scenarios, no invented OEM compliance, no new cost/price posting, Base and C1/C2 option budgets frozen.");
