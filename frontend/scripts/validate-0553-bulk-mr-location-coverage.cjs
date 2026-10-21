// Verify BULK expansion is presentation only: seven source sites, four MR systems,
// MGW combined Rev2 vendor inclusion and no additional bookable working amount.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const orig=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const transpiled=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(transpiled.code,file);
 }else orig(mod,file);
};
const {deriveBulkMrLocationCoverage0553,selectBulkMrLocationCoverage0553}=require(path.join(root,"project0553/data/bulkMrLocationCoverage0553.js"));
const model=deriveBulkMrLocationCoverage0553();
assert.equal(model.sites.length,7);
assert.equal(model.groups.length,28);
assert.equal(model.originalA5BookedTHB,260232);
assert.equal(model.postAdditionalTHB,0);
assert.equal(model.customerReleased,false);
assert.equal(model.costMutationAllowed,false);
assert.match(model.selectedVendorAuthority,/R2-COMBINED-20261020/);
const active=model.groups.filter(g=>g.active);
assert.deepEqual(["MR-0001","MR-0002","MR-0003","MR-0004"].map(mr=>active.filter(g=>g.mr===mr).length),[7,3,4,3]);
const sourceRow={ZWP20:11,ZWP21:20,ZWP22:29,ZWP23:36,ZPQ:41,ZWP8:47,ZWP11:52};
for(const site of model.sites){
 assert.equal(site.byMr.length,4);
 const mr1=site.byMr[0];
 assert.equal(mr1.sourceMtoRow,sourceRow[site.site]);
 assert.equal(mr1.bookedA5THB,37176);
 assert.equal(mr1.items.filter(x=>x.state==="BOOKED_PARTIAL").length,2);
 assert.equal(mr1.items.filter(x=>Number.isFinite(x.existingBookedTHB))
  .reduce((n,x)=>n+x.existingBookedTHB,0),37176);
 for(const group of site.byMr){
  if(!group.active)assert.equal(group.items.length,0);
  const ids=new Set(group.items.map(x=>x.id));
  assert.equal(ids.size,group.items.length,"Duplicate BULK physical ID at "+site.site+"/"+group.mr);
  for(const item of group.items){
   assert.equal(item.bookedIncrementalTHB,0);
   assert.equal(item.approvedProcurement,false);
   assert.equal(item.site,site.site);
   assert.equal(item.mr,group.mr);
   assert(item.owner&&item.source);
   assert(item.moduleId.startsWith("bid.budget.bom."+site.site.toLowerCase()+"."));
   if(item.state==="NEEDS_QUANTITY")assert.equal(item.qty,null);
   if(item.state==="VENDOR_INCLUDED")assert.equal(item.category,"PACKAGE_INCLUDED");
  }
 }
}
const zwp20=model.groups.find(g=>g.mr==="MR-0002"&&g.site==="ZWP20");
assert(zwp20.items.find(x=>x.id==="YAGI-EX-RF")?.detail.includes("Full combined Rev2"));
assert(zwp20.items.find(x=>x.id==="FEEDER-KIT")?.qty===100);
assert(zwp20.items.find(x=>x.id==="FEEDER-CONNECTORS")?.qty===6);
assert(zwp20.items.some(x=>x.id==="BDA-RF-PORTS"&&x.state==="SCOPE_REVIEW"));
assert(!zwp20.items.some(x=>/LNA-RX3852|MOT_SELECTED/i.test(x.id)));
const phone=model.groups.find(g=>g.mr==="MR-0003"&&g.site==="ZWP23");
assert(phone.items.find(x=>x.id==="PHONE-SET")?.state==="VENDOR_INCLUDED");
assert(phone.items.some(x=>x.id==="PHONE-SOUNDER-CABLE"&&x.state==="NEEDS_QUANTITY"));
const racon=model.groups.find(g=>g.mr==="MR-0004"&&g.site==="ZWP20");
assert(racon.items.find(x=>x.id==="RACON-EX-CONTROL")?.state==="SCOPE_REVIEW");
assert(racon.items.find(x=>x.id==="RACON-DB5P")?.state==="VENDOR_INCLUDED");
assert(racon.items.some(x=>x.id.startsWith("RACON-")&&x.item.includes("→")));
const qty=selectBulkMrLocationCoverage0553({mr:"MR-0003",site:"ZWP20",state:"NEEDS_QUANTITY"});
assert.equal(qty.groups.length,1);
assert(qty.groups[0].visibleItems.every(x=>x.state==="NEEDS_QUANTITY"));
const ui=fs.readFileSync(path.join(root,"project0553/BulkMrLocationCoverage0553.jsx"),"utf8");
babel.transformSync(ui,{babelrc:false,configFile:false,presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
const simple=fs.readFileSync(path.join(root,"project0553/SimpleBom0553.jsx"),"utf8");
const location=fs.readFileSync(path.join(root,"project0553/LocationBomDetail0553.jsx"),"utf8");
assert(simple.includes('<BulkMrLocationCoverage0553 mr={system} site={site} state={bulkState}/>'));
assert(simple.includes('moduleKey="bid.budget.bom.system-location-mto"'));
assert(simple.includes('key:"bulk-status"'));
assert(location.includes('<BulkMrLocationCoverage0553 mr="MR-0001" site={site} detail/>'));
console.log("PASS 0553 BULK MR / Location: 7×4 groups, 17 active, 7 original A5 floor rows THB260232 non-additive, MGW Rev2, source-linked table/filter/Row11, no changed cost");
