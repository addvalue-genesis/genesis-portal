// Controlled proof of user-confirmed BARTEC hole counts, not an active-gland procurement estimate.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const old=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const c=babel.transformFileSync(file,{babelrc:false,configFile:false,sourceMaps:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(c.code,file);
 }else old(mod,file);
};
const {BARTEC_ENCLOSURE_BASIS_0553:bartec,selectBartecEnclosureBasis0553:get}=require(path.join(root,"project0553/data/bartecEnclosureBasis0553.js"));
const {ZWP20_GA_BULK_RECONCILIATION:ga}=require(path.join(root,"project0553/data/zwp20GaBulkReconciliation.js"));
const {ZWP20_BULK_SCOPE_AUDIT_0553:audit}=require(path.join(root,"project0553/data/zwp20BulkScopeAudit0553.js"));
const expected={
 SCADA_EXE_TYPE_1_2_3:{n:16,top:12,left:2,right:2,bottom:0,plugs:16,drain:1,spare:4,active:12},
 PHONE_EXE_JB:{n:8,top:8,left:0,right:0,bottom:0,plugs:8,drain:1,spare:2,active:6},
 HISTORICAL_TETRA_EXD:{n:18,top:0,left:0,right:0,bottom:18,plugs:18,drain:1,spare:4,active:14},
 HISTORICAL_TETRA_SELECTOR:{n:4,top:0,left:0,right:0,bottom:4,plugs:4,drain:0,spare:2,active:2}
};
assert.equal(bartec.products.length,Object.keys(expected).length);
for(const [id,e] of Object.entries(expected)){
 const x=get(id);assert(x,"Missing "+id);
 assert.equal(x.entryCount,e.n,id);
 assert.equal(x.entries.top,e.top,id+" top");
 assert.equal(x.entries.left,e.left,id+" left");
 assert.equal(x.entries.right,e.right,id+" right");
 assert.equal(x.entries.bottom,e.bottom,id+" bottom");
 assert.equal(x.entries.top+x.entries.left+x.entries.right+x.entries.bottom,e.n,id+" drilled-hole sum");
 assert.equal(x.originalStoppingPlugs,e.plugs,id+" factory plugs");
 assert.equal(x.drainEntryCount,e.drain,id+" drain separate");
 assert.equal(x.spareEntryPlanningQty,e.spare,id+" reserve only");
 assert.equal(x.maxActiveEntryPlanningQty,e.active,id+" planning max");
 assert.equal(x.activeCableGlandQty,null,id+" physical glands not measured");
 assert.equal(x.extraFieldGlandPurchaseQty,null,id+" no purchase quantity inferred");
 assert.equal(x.z1fSiteAllocationQty,null,id+" historical site quantity not Z1F");
}
assert.equal(ga.selectedBartecModelAndHoles.entryCount,16);
assert.equal(audit.enclosureCableEntries.total,16);
assert.equal(audit.enclosureCableEntries.drainSeparate,1);
assert.equal(audit.checks.find(x=>x.id==="PANEL_M20").qty,1,"historically booked gland allowance remains unmodified");
assert.equal(bartec.doesNotChangeCostLedger,true);
assert.equal(bartec.releasedCustomerBOM,false);
assert(/18/.test(bartec.customerDeviationStatus));
const jsx=fs.readFileSync(path.join(root,"project0553/BulkTakeoff0553.jsx"),"utf8");
assert(jsx.includes("BARTEC_ENCLOSURE_BASIS_0553.products.map"));
assert(jsx.includes("customerDeviationStatus"));
console.log("PASS 0553 BARTEC approved physical entry counts 16/8/18/4; drains separate, active/purchase glands unknown; 16-vs-18 DTS deviation open; booked partial M20 rate/quantity unaffected.");
