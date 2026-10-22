// Source → 10.1 MR/BULK → Working Cost → 10.3 Release trace: NO price posting.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const original=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const compiled=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(compiled.code,file);
 }else original(mod,file);
};
const from=p=>require(path.join(root,"project0553",p));
const {deriveBulkMrLocationCoverage0553:bulkSource}=from("data/bulkMrLocationCoverage0553.js");
const {deriveBulkSourceToReleaseTrace0553:trace}=from("data/bulkSourceToReleaseTrace0553.js");
const {buildReleaseCommercialModel0553:release}=from("data/releaseCommercialModel0553.js");
const {MGW_P26_058_R2_SELECTED_0553:mgw}=from("data/mgwP26058R2Selected0553.js");
const mto=from("data/snapshots/mr0001.mto.rev04.sourceRows.json");
const before=release({thbPerUsd:31.5});
const snap=JSON.stringify({a:before.a,b:before.b,c:before.c,summary:before.summary});
const matrix=trace({releaseModel:before});
const bulk=bulkSource();
assert.equal(matrix.scopeSlots,28);
assert.equal(matrix.applicable,17);
assert.deepEqual(matrix.scopeByMR,{"MR-0001":7,"MR-0002":3,"MR-0003":4,"MR-0004":3});
assert.equal(matrix.groups.length,17);
assert.equal(matrix.originalA5PartialTHB,260232);
assert.equal(bulk.originalA5BookedTHB,260232);
assert.equal(matrix.additionalPostingTHB,0);
assert.equal(matrix.workingSellChanged,false);
assert.equal(matrix.releasePriceChanged,false);
assert.equal(matrix.sourceToReleaseReady,false);
assert.equal(matrix.releaseAllowed,false);
const rows={ZWP20:11,ZWP21:20,ZWP22:29,ZWP23:36,ZPQ:41,ZWP8:47,ZWP11:52};
assert.deepEqual(matrix.originalMR0001SourceRows.map(x=>[x.site,x.row]),
 Object.entries(rows));
for(const [site,row] of Object.entries(rows)){
 const m=matrix.groups.find(x=>x.site===site&&x.mr==="MR-0001");
 assert(m&&m.sourceMtoRow===row);
 assert.equal(m.sourceLotQty,1);
 assert.equal(m.sourceLotUnit,"Lot");
 assert.equal(m.knownSourceFloorTHB,37176);
 assert.equal(m.bookedCostAlreadyInPartA,true);
 assert.equal(m.customerLine,"A1");
 assert.equal(m.sourceToReleaseReady,false);
 assert(m.sourceMtoDescription.includes("TC-0001 Items 7"));
 assert(m.openEvidenceGates.includes("TC0001_7_8_FIRE_RATING_CLIENT_REPLY_UNVERIFIED"));
 const a=mto.itemRows.find(r=>r.sourceRowIndex===row&&r.platform===site);
 assert(a&&a.sourcePartText==="Bulk Material");
}
for(const mr of ["MR-0002","MR-0003","MR-0004"]){
 const pairs=matrix.groups.filter(x=>x.mr===mr);
 assert(pairs.every(x=>x.selectedQuoteId===mgw.id));
 assert(pairs.every(x=>x.sourceMtoRow===null));
 assert(pairs.every(x=>x.releasePart===x.customerLine));
 assert(pairs.every(x=>!x.sourceToReleaseReady));
 assert(pairs.every(x=>x.additionalPostingTHB===0));
}
for(const site of ["ZWP20","ZWP21","ZWP22"]){
 const g=bulk.groups.find(x=>x.site===site&&x.mr==="MR-0002");
 assert(g.items.some(x=>x.id==="DMR-MR-C1-BULK-LOT"));
 assert(g.items.some(x=>x.id==="FEEDER-KIT"&&x.state==="VENDOR_INCLUDED"&&x.qty===100));
 assert(g.items.some(x=>x.id==="ADDVALUE-NEK-FIELD-FEEDER"&&x.state==="BULK_RESERVE_CANDIDATE"&&x.qty===null));
 assert(g.items.some(x=>x.id==="BDA-RF-EXTENSION"&&x.owner==="MGW_COMPLETE_SYSTEM_CORRECTIVE_SCOPE"&&x.qty===null));
 const racon=bulk.groups.find(x=>x.site===site&&x.mr==="MR-0004");
 const adapter=racon.items.find(x=>x.id==="RACON-PHASE-ADAPTER-CHARGER");
 assert(adapter&&adapter.phaseRequiredQty===1&&adapter.qty===null&&adapter.siteAllocatedQty===null);
 assert.equal(adapter.purchaseQty,null);
 assert.equal(adapter.quotedInMGWRev2,false);
}
for(const site of ["ZWP20","ZWP21","ZWP22","ZWP23"]){
 const phone=bulk.groups.find(x=>x.site===site&&x.mr==="MR-0003");
 assert(phone.items.some(x=>x.id==="PHONE-SPECIAL-CABLE-C1"));
 assert(matrix.groups.some(x=>x.mr==="MR-0003"&&x.site===site&&x.sourceLotQty===null&&x.mr0003SystemQty===1));
}
assert.equal(matrix.sourceMR0004PhaseKitQty,1);
assert.equal(matrix.sourceMR0004PhaseKitSitePurchaseQty,null);
assert(matrix.groups.every(x=>x.missingRequiredFunctionIds.length===0));
assert(matrix.groups.every(x=>x.openEvidenceGates.length>0&&x.openMaterialEvidenceCount>0));
const after=release({thbPerUsd:31.5});
assert.equal(JSON.stringify({a:after.a,b:after.b,c:after.c,summary:after.summary}),snap,
 "BULK completeness audit may NEVER affect selected 10.3 Release amounts");
const jsx=fs.readFileSync(path.join(root,"project0553/BulkSourceToReleaseAudit0553.jsx"),"utf8");
const bom=fs.readFileSync(path.join(root,"project0553/SimpleBom0553.jsx"),"utf8");
const workspace=fs.readFileSync(path.join(root,"project0553/CommercialWorkspace.jsx"),"utf8");
const navigator=fs.readFileSync(path.join(root,"project0553/data/bulkModuleNavigator0553.js"),"utf8");
babel.transformSync(jsx,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
assert(bom.includes('<BulkSourceToReleaseAudit0553 mr={system} site={site} focusModuleId={navigationTarget}/>'));
assert(workspace.includes('<BulkSourceToReleaseAudit0553 releaseModel={releaseModel} placement="RELEASE"/>'));
assert(navigator.includes('deriveBulkSourceToReleaseTrace0553'));
assert(jsx.includes('MR0004 phase kit is exactly one requirement across all three WPs'));
console.log("PASS 0553 BULK source→release: exact MR0001 MTO rows 11/20/29/36/41/47/52, 7+3+4+3 scope, MR0004 1 shared phase kit, MGW owner/NEK spare HOLD, A5 260232 source-only, Release prices unchanged");
