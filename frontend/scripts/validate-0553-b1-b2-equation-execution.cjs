// 02 common GEQ/PEQ -> 10.2 B1/B2 source-driven, fail-closed equation proof.
// Never force 964 MH, two review cycles, loaded rates, or price into a derivation.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src");
const orig=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const out=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(out.code,file);
 }else orig(mod,file);
};
const {selectBcWorkCostLines0553}=require(path.join(root,"project0553/data/bcWorkCostLines0553.js"));
const {selectBcTurnkeyWorkingCost0553}=require(path.join(root,"project0553/data/bcTurnkeyWorkingCost0553.js"));
const {derivePartBcWorkingWbs0553}=require(path.join(root,"project0553/data/partBCWorkingWbs0553.js"));
const vdrl=require(path.join(root,"project0553/data/bcVdrlSourceLedger0553.json"));
const m=selectBcWorkCostLines0553(),b=selectBcTurnkeyWorkingCost0553(),p=m.equationProof;
assert.equal(vdrl.records.length,143);
assert.equal(p.moduleId,"bid.engineering.equations.b1-b2");
assert.equal(p.workflowNumber,"02");
assert.equal(p.records.length,143);
assert.equal(p.totals.sourceRows,143);
assert.equal(p.totals.uniqueTitleTypes,38);
assert.equal(p.totals.sourceDocumentKeys,143);
assert.equal(p.totals.uniqueDocumentInstances,null);
assert.deepEqual(Object.values(p.byMr).map(x=>x.sourceRows),[37,36,35,35]);
assert.deepEqual(Object.values(p.byMr).map(x=>x.A),[26,26,25,25]);
assert.deepEqual(Object.values(p.byMr).map(x=>x.I),[10,9,9,9]);
assert.deepEqual(Object.values(p.byMr).map(x=>x.blank),[1,1,1,1]);
assert.equal(p.validation.length,5);
assert.equal(p.validation[4].status,"PASS_SOURCE_RECONCILIATION");
assert.equal(p.validation[1].status,"TRACE_BOUNDARY_PARTIAL");
assert.equal(p.validation[2].status,"OPEN_REVIEW_CYCLES");
assert.equal(p.validation[3].status,"OPEN_PRODUCTIVITY_AND_ROLE_RATES");
assert.equal(p.revisionControl.reviewDaysAreBillableMH,false);
assert.equal(p.revisionControl.reviewCyclesRequiredForMH,true);
assert.equal(p.revisionControl.reviewDaysWorking,10);
assert.equal(p.revisionControl.contractorResubmitDaysCalendar,15);
assert(p.GEQ.includes("GEQ-005")&&p.GEQ.includes("GEQ-024"));
assert(p.PEQ_B1.includes("PEQ-B1-003")&&p.PEQ_B2.includes("PEQ-B2-014"));
assert.equal(p.b1Activities.length,27);
assert.equal(p.b1BaselineMH,964);
assert.equal(p.b1CalculatedMH,null);
assert.equal(p.b2CalculatedMH,null);
assert(p.b1Activities.every(x=>x.equationStatus==="OPEN_INPUT"&&x.calculatedMH===null));
assert(p.b1Activities.every(x=>x.missingInputs.includes("unitHours")&&x.missingInputs.includes("factor")));
assert(p.records.every(x=>x.documentControlOwner==="B2"&&x.documentationEquationProof.status==="OPEN_INPUT"));
assert(p.records.every(x=>x.documentationEquationProof.value===null&&x.engineeringEquationProof.value===null));
assert(p.records.every(x=>x.calculatedB1MH===null&&x.calculatedB2MH===null&&x.documentCostTHB===null&&x.technicalCostTHB===null&&!x.pricePostingAllowed));
assert(p.records.every(x=>x.revisionCycles===null&&x.documentInstances===null));
assert.equal(p.records.filter(x=>x.approvalClass===null).length,4);
assert(p.records.filter(x=>x.title.toLowerCase().includes("progress reports")).every(x=>x.occurrenceRule==="SCHEDULE_RECURRENCE_DURATION_REQUIRED"));
assert(p.records.filter(x=>x.title==="VENDOR Document Register List").every(x=>x.occurrenceRule==="UPDATE_UNTIL_APPROVED_DURATION_REQUIRED"));
assert(p.records.filter(x=>x.title==="FAT Report"||x.title==="SAT Report").every(x=>x.technicalWorkOwner==="B3_OR_OEM_FOR_TEST_CONTENT"));
assert.equal(m.equationProofModuleId,p.moduleId);
assert.equal(b.b1b2EquationProofModuleId,p.moduleId);
assert.deepEqual(b.b1b2EquationProof,p); // selectors produce equivalent independent snapshots, not referential identity
assert.equal(b.byCode.B1.b1b2EquationProofModuleId,p.moduleId);
assert.equal(b.byCode.B2.b1b2EquationProofModuleId,p.moduleId);
assert.equal(b.byCode.B3.b1b2EquationProofModuleId,null);
assert.equal(b.knownWorkingSellTHB,3844711.82,"Current base B1/B3/B9 replaced by Rev.K WBS costed budget");
assert.equal(b.knownWorkingSellTHB,Math.round(b.rows.filter(x=>x.baseScope&&Number.isFinite(x.workingSellTHB)).reduce((sum,x)=>sum+x.workingSellTHB,0)*100)/100,"C1/C2 options excluded from base");
assert.equal(b.byCode.B1.workingSellTHB,211600);
assert.equal(b.byCode.B2.workingSellTHB,237121.13);
assert.equal(b.byCode.B2.b2PriorWorkingSellReferenceTHB,580000);
assert.equal(b.byCode.B3.workingSellTHB,2443400);
assert.equal(derivePartBcWorkingWbs0553().subtotalTHB,3804160);
assert.equal(b.knownDirectCostTHB,null);
assert.equal(b.releaseAllowed,false);
const ui=fs.readFileSync(path.join(root,"project0553/B1B2EquationAudit0553.jsx"),"utf8");
assert(ui.includes("proof.records.map")&&ui.includes("proof.b1Activities.map")&&ui.includes("proof.validation.map"));
const page=fs.readFileSync(path.join(root,"pages/PJ26080553.jsx"),"utf8");
const budget=fs.readFileSync(path.join(root,"project0553/BcWorkCostLines0553.jsx"),"utf8");
assert(page.includes("<B1B2EquationAudit0553/>"));
assert(budget.includes("<B1B2EquationAudit0553 selectedCode={selectedCode}/>"));
for(const f of ["project0553/B1B2EquationAudit0553.jsx","project0553/BcWorkCostLines0553.jsx","pages/PJ26080553.jsx"]){
 assert(babel.transformFileSync(path.join(root,f),{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code.length>0);
}
console.log("PASS 0553 02 GEQ/PEQ -> 10.2: 143 VDRL rows / 38 titles, 102 A / 37 I / 4 blank; 27 B1 WBS / 964 MH BASELINE; independent MH and cost remain OPEN_INPUT; source selling baselines B1/B2/B3 unchanged.");
