const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const dir=path.resolve(__dirname,"../src/project0553");
const read=p=>fs.readFileSync(path.join(dir,p),"utf8");
const model=read("data/siteSystemCostReconciliation.js");
const ui=read("SiteSystemCostReconciliation0553.jsx");
const bom=read("SimpleBom0553.jsx");
for(const token of ["mgwSharedUSD","nextGSiteAllocatedUSD:null","siteFinalTotals:null","projectFinalTotal:null","PROVISIONAL_EQUAL_SPLIT_3_SITES","MGW BDA is NOT","MGW reconciliation to original failed"])
 assert(model.includes(token),"Missing reconciliation protection: "+token);
for(const id of ["MR-0001","MR-0002","MR-0003","MR-0004"])assert(model.includes(id),"Missing system "+id);
assert(ui.includes("Site × MR Budgetary Cost Reconciliation"));
assert(ui.includes("NOT ESTABLISHED"));
assert(ui.includes("Source unit price")&&ui.includes("Assumed site Qty"));
assert(bom.includes("<SiteSystemCostReconciliation0553/>"));
assert(bom.indexOf("<SiteSystemCostReconciliation0553/>")<bom.indexOf("Locations with source data"));
const mgw=[[3,13674],[3,644],[3,21],[3,515],[3,60667],[3,11152],[1,8000],[1,5000],[1,500]];
assert.equal(mgw.reduce((n,[q,u])=>n+q*u,0),273519);
assert.equal(mgw.slice(0,6).reduce((n,[q,u])=>n+q*u,0),260019);
assert.equal(mgw.slice(6).reduce((n,[q,u])=>n+q*u,0),13500);
console.log("PASS 0553 site×MR price-source reconciliation structure; MGW equipment USD 260019 + shared USD 13500 = USD 273519. Engineering site allocation remains assumption.");
