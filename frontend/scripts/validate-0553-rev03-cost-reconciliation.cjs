// Rev03 TC-0001 — runtime source -> overlay -> 7-location/A1/TCAB cost reconciliation.
// Negative fixtures detect duplicate owners, malformed currency, unverified rates.
// No historical file, quote, B/C sell or protected Rev02 source is rewritten.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),babel=require("@babel/core");
const root=path.resolve(__dirname,"../src"),oldJS=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(!file.startsWith(root+path.sep))return oldJS(mod,file);
 const out=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(out.code,file);
};
const from=p=>require(path.join(root,"project0553",p));
const {REV03_TC0001_COST_POLICY_0553:policy,REV03_TC0001_SITES_0553:sites,
 selectMR0001Rev03TagCostRows0553:rowsFor,
 summarizeMR0001Rev03TagCost0553:summary,
 selectRev03Tc0001ChangeRows0553:changes}=from("data/mr0001Rev03CostOverlay0553.js");
const {selectMR0001TagCostRows0553:rev02RawRows}=from("data/mr0001TagCostLedger0553.js");
const {selectWorkingBomProjection0553:projected}=from("data/workingBomAggregation0553.js");
const {getMR0001LocationCost0553:location}=from("data/mr0001LocationCostSummary0553.js");
const {MR0001_WORKING_PRICED_BOM:bom}=from("data/mr0001WorkingPricedBom.js");
const {BID_COST_SPINE_0553:spine}=from("data/bidCostSpine.js");
const {deriveA5BulkAttribution0553:a5}=from("data/a5BulkAttribution0553.js");
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const money=n=>round(n);
function validateOwners(rows,site){
 const seen=new Set();
 for(const r of rows){
  const id=site+"|"+r.row+"|"+r.tag;
  assert(!seen.has(id),"Duplicate TAG/row owner: "+id);
  seen.add(id);
  if(r.countedInWorkingTotal){
   assert(Number.isFinite(r.extended),"Missing counted cost: "+id);
   assert(["THB","USD"].includes(r.currency),"Unsupported counted currency: "+id);
   assert(!r.parentPackage&&!r.priceInclusion,"Double-posted included package: "+id);
  }
 }
 return seen.size;
}
assert.equal(policy.baselineRevision,"Rev03");
assert.equal(policy.approvalScope,"INTERNAL_BUDGETARY_WORKING_REVISION_ONLY");
assert.equal(policy.customerWorkingSellChanged,false);
assert.equal(policy.customerReleaseAllowed,false);
assert.equal(policy.approvedOEMTechnicalCompliance,false);
assert.equal(policy.actualDirectCostVerified,false);
assert.equal(sites.length,5);
assert.deepEqual(changes().map(x=>x.site),["ZWP20","ZWP21","ZWP22","ZWP23","ZWP8"]);
assert.equal(bom.cisco.items.length,9);
assert.deepEqual(bom.cisco.removedItems.map(x=>x.quoteLine),["2.0","2.0.1"]);
const rawSnapshot=Object.fromEntries(["ZWP20","ZWP21","ZWP22","ZWP23","ZWP8","ZPQ","ZWP11"].map(site=>
 [site,JSON.stringify(rev02RawRows(site))]));
assert.equal(rev02RawRows("ZWP20").find(x=>x.tag==="LAN-502-001").extended,423530,
 "Rev02 ZWP20 frozen cost is original 16-port package");
for(const {site,tag,row} of sites){
 const ledger=rowsFor(site);
 validateOwners(ledger,site);
 const matched=ledger.filter(r=>r.tag===tag&&r.row===row);
 assert.equal(matched.length,1,site+" one controlled physical LAN TAG");
 const x=matched[0];
 assert.equal(x.sourceQty,1);
 assert.equal(x.currency,"THB");
 assert.equal(x.extended,371580);
 assert.equal(x.unitCost,371580);
 assert.equal(x.originalRev02UnitTHB,423530);
 assert.equal(x.changeId,"REV03-TC0001-ITEM13");
 assert.equal(x.technicalApproved,false);
 assert.equal(x.customerSellChanged,false);
 assert.equal(x.countedInWorkingTotal,true);
 const siteProjection=projected({mr:"MR-0001",site});
 const counted=siteProjection.lines.filter(x=>x.counted&&x.tag===tag);
 assert.equal(counted.length,1,site+" exactly one price posting");
 assert.equal(counted[0].extended,371580);
 assert.deepEqual(siteProjection.invalidPosting,[]);
 assert.equal(location(site).allocatedTHB,summary(site).subtotals.THB);
 assert.equal(location(site).allocatedUSD,summary(site).subtotals.USD);
}
for(const site of ["ZPQ","ZWP11"])
 assert.equal(rowsFor(site).filter(x=>x.tag?.startsWith("LAN-")&&x.countedInWorkingTotal).length,0,
  site+" no new Cisco switch procurement");
const siteNames=["ZWP20","ZWP21","ZWP22","ZWP23","ZPQ","ZWP8","ZWP11"];
let sumUSD=0,sumTHB=0,rowCount=0,costed=0;
for(const site of siteNames){
 const x=summary(site);
 sumUSD+=x.subtotals.USD;sumTHB+=x.subtotals.THB;
 rowCount+=x.totalRows;costed+=x.costedRows;
 assert.equal(x.totalRows,rowsFor(site).length);
}
assert.equal(rowCount,55);
assert.equal(costed,55);
const revisionTotal=money(sumTHB+sumUSD*31.5);
assert.equal(revisionTotal,5840703.15);
assert.equal(money(revisionTotal+policy.excludedTotalTHB),6100453.15);
assert.equal(money(summary("ZWP20").subtotals.THB+summary("ZWP20").subtotals.USD*31.5),869475.22);
assert.equal(money(summary("ZWP8").subtotals.THB+summary("ZWP8").subtotals.USD*31.5),1335438.58);
const totalA1=projected({mr:"MR-0001"});
assert.equal(money((totalA1.currencies.THB||0)+(totalA1.currencies.USD||0)*31.5),revisionTotal);
assert.equal(totalA1.releaseAllowed,false);
assert.deepEqual(totalA1.invalidPosting,[]);
assert.equal(a5().a5PriceTHB,260232);
assert.equal(a5().additionalCostPostedTHB,0);
assert.equal(spine.customerSell,null);
assert.equal(spine.partA,null);
assert.equal(spine.tc0001Cisco8PortReductionTHB,259750);
const tcab=rowsFor("ZWP20").find(x=>x.tag==="TCAB-500-001"&&x.row===9);
assert.equal(tcab.extended,39200,"Unrelated BARTEC Row9 price must not change");
for(const site of siteNames)
 assert.equal(JSON.stringify(rev02RawRows(site)),rawSnapshot[site],
  "Read-only Rev03 projection mutated protected Rev02 source: "+site);
const one=rowsFor("ZWP20");
assert.throws(()=>validateOwners([...one,one[0]],"ZWP20"),/Duplicate TAG\/row owner/);
assert.throws(()=>validateOwners(one.map(r=>r.tag==="LAN-502-001"?{...r,currency:null}:r),"ZWP20"),/Unsupported counted currency/);
assert.throws(()=>validateOwners(one.map(r=>r.tag==="LAN-502-001"?{...r,extended:null}:r),"ZWP20"),/Missing counted cost/);
assert.throws(()=>validateOwners(one.map(r=>r.tag==="LAN-502-001"?{...r,parentPackage:true}:r),"ZWP20"),/Double-posted included package/);
const consumer=fs.readFileSync(path.join(root,"project0553/data/workingBomAggregation0553.js"),"utf8");
assert(consumer.includes("mr0001Rev03CostOverlay0553"));
console.log("PASS Rev03 TC-0001: 55/55 TAGs, 5 LAN costs THB 371,580, 7 locations THB 5,840,703.15, Rev02 bridge THB 259,750; pinned frozen sources unchanged, A5 and sell non-additive, negative fixtures.");
