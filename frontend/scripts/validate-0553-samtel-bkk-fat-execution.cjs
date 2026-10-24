// Management-approved integrated FAT at SAMTEL Bangkok.
// Verify operational strategy and existing B/C read model without any new cost.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs"),babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const old=require.extensions[".js"];
require.extensions[".js"]=(m,f)=>{
 if(f.startsWith(root+path.sep)){
  const t=babel.transformFileSync(f,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  m._compile(t.code,f);
 }else old(m,f);
};
const from=p=>require(path.join(root,"project0553",p));
const d=from("data/fatExecutionBasis0553.js").FAT_EXECUTION_BASIS_0553;
const working=from("data/bcTurnkeyWorkingCost0553.js").selectBcTurnkeyWorkingCost0553();
const mgw=from("data/mgwP26058.js").MGW_P26_058_0553;
const exion=from("data/quotes/EXION-1260576-R0.current.json");
const nextG=from("data/quotes/NG-260916-commercial-terms.js").NEXT_G_260916_TERMS_0553;
const racon=from("data/raconTerminationBudget0553.js").RACON_TERMINATION_POLICY_0553;
assert.equal(d.decisionAuthority,"PROJECT_MANAGEMENT_USER");
assert.equal(d.integratedFat.location,"SAMTEL Warehouse, Thailand");
assert(d.integratedFat.strategy.includes("ONE_COMBINED_CROSS_SYSTEM_INTEGRATED_FAT"));
assert.equal(d.yard.location,"JUTAL Zhuhai Yard, China — separate B9 assistance");
assert.equal(d.yard.addvalueBaseCrew,2);
assert.equal(d.chinaPartner.authority,
 "LOGISTICS_AND_CUSTOMS_ADVICE_ONLY__NO_CONFIRMED_EXECUTION_OR_IMPORTER_OF_RECORD");
assert.equal(d.mrPaths.length,4);
assert.deepEqual(d.mrPaths.map(r=>r.mr),["MR-0001","MR-0002","MR-0003","MR-0004"]);
assert(d.mrPaths.every(x=>x.fat==="INTEGRATED_AT_SAMTEL_BKK"));
assert(d.mrPaths.every(x=>x.routing.includes("SAMTEL Bangkok FAT")&&x.routing.includes("CIF Zhuhai Port")));
assert.equal(nextG.sourceTermRecords.find(x=>x.id==="NG-TERM-04").originalText,"DAP Ranong");
assert.equal(mgw.commercialTerms.deliveryTerm,"EXW");
assert.equal(mgw.commercialTerms.deliveryPlace,"Nantong, China");
assert(exion.terms.some(t=>t.topic==="Incoterm"&&t.value.includes("DDP Nonthaburi")));
assert.equal(racon.quotation.vendorClarificationRequired,true);
assert(d.mrPaths[1].logistics.includes("China export"));
assert(d.mrPaths[1].logistics.includes("Thailand re-export"));
assert(d.mrPaths[3].source.includes("FAT included")&&d.mrPaths[3].source.includes("FAT/R-FAT excluded"));
assert(d.costRouting.noDoubleCount.length>=4);
for(const c of ["B3","B6","B9"]){
 const row=working.byCode[c];
 assert.equal(row.executionDecision?.legacyDecisionId,"REV_K_MGW_FOUR_MR_FAT_JUTAL_ZHUHAI_20261018","Legacy Bangkok routing must stay as audit provenance at "+c);
 assert.equal(row.executionDecision?.decisionId,"SAMTEL_WAREHOUSE_CIF_ZHUHAI_20261024","Active decision must be SAMTEL Warehouse CIF");
 assert.match(row.executionDecision.integratedFatLocation,/SAMTEL Warehouse/); // Active Rev.K venue overrides historical BKK source only
 assert.equal(row.directCostTHB,null,"Execution location must not invent "+c+" direct cost");
}
assert.equal(working.byCode.B3.workingSellTHB,2440425);
assert.equal(working.byCode.B3.b3FortyDayBudget.workdays,40,
 "Legacy Bangkok/40-day pricing basis remains audit-only");
// Current B3 includes two independent 22-Oct rate deltas (+SAT Senior 176400,
// +FAT China paid witnesses 25200). Remove these before the 21-Oct audit bridge.
const satSeniorRateDeltaTHB=28*(1000-800)*31.5;
const fatWitnessRateDeltaTHB=working.byCode.B3.b3ChinaFatBudget.fatWorkingSellTHB+158900-397400;
assert.equal(satSeniorRateDeltaTHB+fatWitnessRateDeltaTHB,201600);
assert.equal(working.byCode.B3.workingSellTHB-
 (satSeniorRateDeltaTHB+fatWitnessRateDeltaTHB)+158900+352800,2750525,
 "Historical B3 scenario must NOT blend 21-Oct SAT change with 22-Oct role revisions");
assert.equal(working.byCode.B9.workingSellTHB,480550);
assert.equal(working.byCode.B6.workingSellTHB,307584,"B6 approved pre-award logistics working sell; direct cost stays null");
assert.equal(working.knownWorkingSellTHB,4884182.13,"Current selected Part B Base: includes SAT28+BF5 in B3; B9 1 LS once");
assert.equal(working.knownWorkingSellTHB,Math.round(working.rows.filter(r=>r.baseScope&&Number.isFinite(r.workingSellTHB)).reduce((sum,r)=>sum+r.workingSellTHB,0)*100)/100,"Options excluded from Base");
assert.equal(working.costComplete,false);
assert.equal(working.releaseAllowed,false);
assert.equal(d.existingSellUnchanged,false);
assert.equal(d.existingDirectCostUnchanged,true);
assert.equal(d.releaseAllowed,false);
const ui=fs.readFileSync(path.join(root,"project0553/CommercialWorkspace.jsx"),"utf8");
assert(ui.includes("Integrated FAT and Training at SAMTEL Warehouse, Thailand"));
// The old inline item.executionDecision panel moved into canonical 10.2
// BcCostEvidenceDetail. Ensure active MGW FAT is visible while Bangkok stays
// isolated as historical FAT_EXECUTION_BASIS provenance.
assert(ui.includes("Integrated FAT and Training at SAMTEL Warehouse, Thailand")&&
 ui.includes('<BcCostEvidenceDetail0553 workingRow={bcWorking.byCode[bcTab]} navigationTarget={navigationTarget}/>'),
 "10.2 active MGW basis must be visible through the selected owner detail");
assert(ui.includes("JUTAL Zhuhai Yard, China"));
console.log("PASS 0553 Rev05 Bangkok FAT audit preserved, active SAMTEL Warehouse FAT and JUTAL Yard strategy reconciled, B1 current SELL protected and B3/B9 current SELL repriced with separate management authority; no direct-cost posting.");
