const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const orig=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){const c=babel.transformFileSync(file,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});mod._compile(c.code,file)}
 else orig(mod,file);
};
const {deriveIntegratedBulkMaster0553}=require(path.join(root,"project0553/data/integratedBulkMaster0553.js"));
const m=deriveIntegratedBulkMaster0553();
assert.equal(m.locations.length,7);
assert.deepEqual(m.systems,["SCADA_RADIO","DTRS_TRUNK_RADIO","EX_IP_PHONE","MARINE_RACON"]);
assert.equal(m.originalA5SourceTHB,260232);
assert.equal(m.recomputedA5THB,260232);
assert.equal(m.postedExtraTHB,0);
assert.equal(m.glandCapacity,144);
assert.equal(m.glandPurchaseQty,null);
assert.equal(m.customerReleased,false);
for(const w of m.locations){
 assert.equal(w.groups.length,4);
 assert.deepEqual(w.groups.map(g=>g.mr),["MR0001","MR0002","MR0003","MR0004"]);
 assert(w.groups.some(g=>g.id==="SCADA_RADIO"&&Number.isFinite(g.postedA5THB)));
 for(const g of w.groups){
  assert.equal(g.items.every(i=>i.postingState==="NOT_ADDITIVE_TO_SOURCE_LEDGER"),true);
  assert.equal(g.items.every(i=>i.wp===w.wp&&i.mr===g.mr),true);
 }
}
for(const w of ["ZWP20","ZWP21","ZWP22","ZWP23"]){
 assert(m.locations.find(x=>x.wp===w).groups.find(x=>x.mr==="MR0003").enclosure?.holeCapacity===8);
}
const screen=fs.readFileSync(path.join(root,"project0553/BulkTakeoff0553.jsx"),"utf8");
assert(screen.includes("deriveIntegratedBulkMaster0553()"));
assert(screen.includes('data-component-key="bid.budget.bulk.integrated-mr0001-0004"'));
assert(screen.includes("integrated.locations.flatMap"));
const c=babel.transformSync(screen,{babelrc:false,configFile:false,presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
assert(c.code.length>0);
console.log("PASS 0553 Integrated Bulk Master: 7 WP x 4 MR, original A5 THB260232 unchanged, BARTEC 144 drilled holes not bought glands, no duplicate posting.");
