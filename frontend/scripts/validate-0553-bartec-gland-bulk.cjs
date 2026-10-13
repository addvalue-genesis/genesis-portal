// Runtime validation of source-backed BARTEC gland BULK sizing/count scaffolding.
// Synthetic cable endings below are strictly test fixtures, never project facts.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src"), old=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const t=babel.transformFileSync(file,{babelrc:false,configFile:false,sourceMaps:false,
    presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(t.code,file);
 }else old(mod,file);
};
const {deriveBartecGlandBulkSchedule0553:derive,reconcileBartecVerifiedCableEnds0553:reconcile}=require(path.join(root,"project0553/data/bartecGlandBulkSchedule0553.js"));
const r=derive();
assert.equal(r.sites.length,7);
assert.equal(r.allEnclosures.length,11);
assert.equal(r.allEnclosures.filter(x=>x.system==="SCADA_RADIO").length,7);
assert.equal(r.allEnclosures.filter(x=>x.system==="EX_IP_PHONE").length,4);
assert.equal(r.rollup.knownEntryCapacityForScope,7*16+4*8);
assert.equal(r.rollup.knownFactoryPlugsForScope,7*16+4*8);
assert.equal(r.rollup.plannedReservedEntryCapacity,7*4+4*2);
assert.equal(r.rollup.verifiedActiveGlandQty,null);
assert.equal(r.rollup.verifiedPurchaseGlandQty,null);
assert.equal(r.rollup.actualGlandSizeBreakdown,null);
assert.equal(r.pricePosted,false); assert.equal(r.customerApproved,false);
for(const w of r.sites){
 for(const b of w.enclosures){
  assert.equal(b.entryThread,"M20"); assert.equal(b.drainSeparate,1);
  assert.equal(b.initialStoppingPlugs,b.holeCapacity);
  assert.equal(b.verifiedActiveGlands,null);
  assert.equal(b.purchaseGlandsBySize,null);
  assert.equal(b.requiredGlandsBySize,null);
  assert(b.interfaceRows.length>=3);
  for(const e of b.interfaceRows){
   assert.equal(e.cableOuterDiameterMm,null);
   assert.equal(e.activeGlandQty,null);
   assert.equal(e.purchaseGlandQty,null);
   assert.equal(e.glandPartNumber,null);
   assert.equal(e.sealingRangeMinMm,null);
   assert.equal(e.sealingRangeMaxMm,null);
  }
 }
 if(["ZWP20","ZWP21","ZWP22","ZWP23"].includes(w.site)){
  const phone=w.enclosures.find(x=>x.system==="EX_IP_PHONE");
  assert(phone);assert.equal(phone.holeCapacity,8);assert(phone.interfaceRows.some(x=>x.id==="PHONE-DEVICE"));
  assert(phone.interfaceRows.some(x=>x.id==="PHONE-SOUNDER"));
  assert(phone.interfaceRows.some(x=>x.id==="PHONE-UPLINK"));
  assert(phone.includedPackageSource.includes("WAROM")===["ZWP20","ZWP21","ZWP22"].includes(w.site));
 }else assert(!w.enclosures.some(x=>x.system==="EX_IP_PHONE"),"Do not invent MR0003 scope on brownfield "+w.site);
}
assert.equal(reconcile({site:"ZWP20",enclosureId:"ZWP20-PHONE-JB"}).purchase,null);
assert.equal(reconcile({site:"ZWP20",enclosureId:"ZWP20-PHONE-JB",ends:[{cableId:"SIM1"}]}).required,null);
const mock=(id)=>({cableId:id,evidenceSource:"SYNTHETIC_TEST_ONLY",verifiedCableEnd:true,entryThread:"M20",
  cableODmm:10.5,glandSku:"TEST-M20-SIZE-A",glandCertificate:"SYNTHETIC_CERT",
  glandExVerified:true,glandArmourMatchVerified:true,sealMinMm:8,sealMaxMm:12});
let x=reconcile({site:"ZWP20",enclosureId:"ZWP20-PHONE-JB",ends:[mock("CABLE1"),mock("CABLE2")]});
assert.equal(x.required,2);assert.equal(x.purchase,null);
assert.equal(x.bySize.length,1);assert.equal(x.bySize[0].requiredQty,2);
x=reconcile({site:"ZWP20",enclosureId:"ZWP20-PHONE-JB",ends:[mock("CABLE1"),mock("CABLE1")]});
assert.equal(x.required,null);
x=reconcile({site:"ZWP20",enclosureId:"ZWP20-PHONE-JB",ends:[{...mock("CABLE1"),cableODmm:16}]});
assert.equal(x.required,null);
x=reconcile({site:"ZWP20",enclosureId:"ZWP20-PHONE-JB",ends:[mock("CABLE1")],vendorIncludedQty:1});
assert.equal(x.required,1);assert.equal(x.purchase,0);
x=reconcile({site:"ZWP20",enclosureId:"ZWP20-PHONE-JB",ends:Array.from({length:7},(_,i)=>mock("SIM"+i))});
assert.equal(x.status,"ENTRY_CAPACITY_SPARE_RULE_EXCEEDED");
const jsx=fs.readFileSync(path.join(root,"project0553/BulkTakeoff0553.jsx"),"utf8");
assert(jsx.includes("deriveBartecGlandBulkSchedule0553"));
assert(jsx.includes("PHONE-UPLINK")===false,"display interface rows from data not duplicated JSX facts");
assert(jsx.includes("Gland seal range / SKU / Ex"));
const wp=fs.readFileSync(path.join(root,"project0553/data/wpSystemBulkBudget0553.js"),"utf8");
assert(wp.includes('id:"EX-PHONE-BARTEC-M20-GLAND-SIZE-QTY"'));
assert(wp.includes('id:"SCADA-BARTEC-M20-GLAND-SIZE-QTY"'));
assert(r.policy.freeze.includes("69m"));
console.log("PASS BARTEC M20 gland bulk: 7 SCADA/4 Ex telephone site records, 144 hole capacity NOT 144 active glands; cable OD/SKU/count remain unknown; vendor WAROM vs BARTEC conflict, no ledger postings; synthetic end/size proof works.");
