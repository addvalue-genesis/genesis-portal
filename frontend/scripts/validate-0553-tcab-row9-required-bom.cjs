// ZWP20 TCAB-500-001.9: Required BOM / BARTEC GA / Cost parity regression.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),babel=require("@babel/core");
const root=path.resolve(__dirname,"../src"),original=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(!file.startsWith(root+path.sep))return original(mod,file);
 const res=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(res.code,file);
};
const project=p=>require(path.join(root,"project0553",p));
const {selectMR0001TagCostRows0553:ledger}=project("data/mr0001TagCostLedger0553.js");
const {getTagBomFourStage0553:fourStage}=project("data/tagBomFourStageReadModel0553.js");
const {selectWorkingBomProjection0553:projection}=project("data/workingBomAggregation0553.js");
const tag=ledger("ZWP20").find(x=>x.tag==="TCAB-500-001"&&x.row===9);
const bulk=ledger("ZWP20").find(x=>x.row===11);
assert(tag&&bulk,"TCAB Row9 and distinct Bulk Row11 required");
const before=JSON.stringify(ledger("ZWP20"));
assert.equal(tag.sourceQty,1);
assert.equal(tag.currency,"THB");
assert.equal(tag.unitCost,39200);
assert.equal(tag.extended,39200);
const m=fourStage("ZWP20",tag);
assert.equal(m.sourceMatched,true);
assert.equal(m.owner,"TCAB-500-001.9");
assert.equal(m.scopeQty,1);
assert.equal(m.working.extended,39200);
assert.equal(m.working.derivedFunctionSubtotal,39200);
assert.equal(m.working.deltaFromLedger,0);
assert.equal(m.working.completeness,"WORKING_FUNCTIONS_RECONCILED");
assert.equal(m.working.functions.length,1);
assert.equal(m.working.functions[0].functionId,"BARTEC_EXE_PANEL_ASSEMBLY");
assert.equal(m.tcabRequired.selectedModel,"07-56D1-9811");
assert.deepEqual(m.tcabRequired.entries,{top:12,left:2,right:2,bottom:0});
assert.equal(m.tcabRequired.entryCount,16);
assert.equal(m.tcabRequired.requiredEntriesByDts,18);
assert.equal(m.tcabRequired.factoryStoppingPlugs,16);
assert.equal(m.tcabRequired.factoryLocknuts,16);
assert.equal(m.tcabRequired.drainValveCount,1);
assert.equal(m.tcabRequired.reservedCapacity,4);
assert(m.required.some(r=>r.functionId==="SCADA_TCAB_TOTAL_M20_ENTRIES"));
assert(m.required.some(r=>r.functionId==="SCADA_TCAB_FACTORY_STOPPING_PLUGS"));
assert(m.required.some(r=>r.functionId==="SCADA_TCAB_ACTIVE_M20_GLANDS_BY_VERIFIED_CABLE_ENDS"&&r.derivedWorkingQty===null));
assert(m.required.some(r=>r.functionId==="SCADA_EX_E_PANEL_ASSEMBLY"&&r.budgetAmountTHB===39200&&r.budgetPosting.includes("NOT_ADDITIVE")));
assert(m.required.every(r=>r.approvedSkuQty===null),"Historical GA is NOT an approved 1F procurement BOM");
assert.equal(m.physicalSkuApproved,false);
assert.equal(m.offered.length,2,"Historical Prosper item1 and alternative item2 both preserved");
assert.equal(m.offered.find(x=>x.code==="1").workingExtended,39200);
assert.equal(m.offered.find(x=>x.code==="2").workingQty,0);
assert.equal(m.offered.find(x=>x.code==="2").workingExtended,null);
assert.equal(m.releaseAllowed,false);
const alloc=projection({mr:"MR-0001",site:"ZWP20"}).lines.filter(x=>x.tag==="TCAB-500-001"&&x.counted);
assert.equal(alloc.length,1,"One TCAB Row9 owner only");
assert.equal(alloc[0].extended,39200);
assert.notEqual(bulk.tag,tag.tag,"Row11 bulk must not be collapsed into TCAB");
assert.equal(JSON.stringify(ledger("ZWP20")),before,"Read model must not mutate cost source");
const ui=fs.readFileSync(path.join(root,"project0553/TagFourStageWorkbench0553.jsx"),"utf8");
const detail=fs.readFileSync(path.join(root,"project0553/LocationBomDetail0553.jsx"),"utf8");
assert(ui.includes("required-bom.tcab-assembly"),"TCAB GA must render under the correct Module ID");
assert(ui.includes("m.tcabRequired.entries.top")&&ui.includes("m.tcabRequired.requiredEntriesByDts"));
assert(detail.includes('defaultTcabExpanded=v=>site==="ZWP20"&&v.tag==="TCAB-500-001"&&v.row===9'));
assert(detail.includes("{isTagExpanded(v)&&<tr"),"TAG row must visibly expand");
for(const source of [ui,detail]){
 const compiled=babel.transformSync(source,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 assert(compiled.code.length>0,"JSX compile");
}
console.log("PASS TCAB ZWP20 Row9: Required BARTEC GA 16 vs DTS18, working THB39,200, two historical quote candidates, Row11 separate, no duplicate posting or customer approval.");
