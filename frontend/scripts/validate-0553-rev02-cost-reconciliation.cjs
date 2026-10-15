// PJ2608-0553 Rev02 acceptance: replay every active MR0001 site directly from source
// TAG cost owners, never from a displayed workbook total or separate bulk scenario.
// An immutable source-price/approval regression, not OEM or customer release.
const assert=require("node:assert/strict"),path=require("node:path"),babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const oldJS=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const out=babel.transformFileSync(file,{babelrc:false,configFile:false,sourceMaps:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(out.code,file);
 }else oldJS(mod,file);
};
const from=file=>require(path.join(root,"project0553/data",file));
const {WORKING_BOM_BY_LOCATION_0553}=from("workingBomByLocation.js");
const {summarizeMR0001TagCost0553}=from("mr0001TagCostLedger0553.js");
const {selectWorkingBomProjection0553}=from("workingBomAggregation0553.js");
const {deriveA5BulkAttribution0553}=from("a5BulkAttribution0553.js");
const cent=x=>Math.round((x+Number.EPSILON)*100);
const money=x=>cent(x)/100;
const planningFx=31.5;
const sites=WORKING_BOM_BY_LOCATION_0553.locations.map(x=>x.site);
assert.equal(sites.length,7,"Controlled MR0001 MTO must cover exactly seven source locations");
assert.equal(new Set(sites).size,7,"Duplicate source location");
const before=JSON.stringify(sites.map(site=>summarizeMR0001TagCost0553(site).rows));
const records=[];
function checkSourceOwners(rows,site){
 const seen=new Set();
 for(const row of rows){
  const id=site+"|"+row.row+"|"+row.tag;
  assert(!seen.has(id),"Duplicate TAG/row owner: "+id);
  seen.add(id);
  if(row.countedInWorkingTotal){
   assert(Number.isFinite(row.extended),"Counted item has no numerical extended cost: "+id);
   assert(["USD","THB"].includes(row.currency),"Counted item has unsupported currency: "+id);
   assert(!row.parentPackage&&!row.priceInclusion,"Included package charged twice: "+id);
  }
 }
 return seen.size;
}
for(const site of sites){
 const ledger=summarizeMR0001TagCost0553(site);
 const projected=selectWorkingBomProjection0553({mr:"MR-0001",site});
 assert.deepEqual(projected.invalidPosting,[],"Invalid posting in read model at "+site);
 assert.equal(ledger.rows.length,WORKING_BOM_BY_LOCATION_0553.locations.find(x=>x.site===site).items.length,
  "MTO to active TAG source coverage "+site);
 checkSourceOwners(ledger.rows,site);
 assert.equal(cent(projected.currencies.USD||0),cent(ledger.subtotals.USD),"USD projection versus Ledger "+site);
 assert.equal(cent(projected.currencies.THB||0),cent(ledger.subtotals.THB),"THB projection versus Ledger "+site);
 const subtotal=money(ledger.subtotals.THB+ledger.subtotals.USD*planningFx);
 records.push({site,usd:ledger.subtotals.USD,thb:ledger.subtotals.THB,
  allocated:ledger.costedRows,source:ledger.totalRows,subtotalTHB:subtotal});
}
assert.equal(records.reduce((n,r)=>n+r.source,0),55,"Current MR0001 MTO source TAG baseline 55");
assert.equal(records.reduce((n,r)=>n+r.allocated,0),55,"Current priced allocation baseline 55 (NOT technical approval)");
const totalUSD=money(records.reduce((n,r)=>n+r.usd,0));
const totalTHB=money(records.reduce((n,r)=>n+r.thb,0));
const allLocationsTHB=money(totalTHB+totalUSD*planningFx);
assert.equal(allLocationsTHB,6100453.15,
 "Rev02 seven-location working budget baseline changed; review cost-owner changes before approval");
const projectedAll=selectWorkingBomProjection0553({mr:"MR-0001"});
assert.equal(cent(projectedAll.currencies.USD),cent(totalUSD));
assert.equal(cent(projectedAll.currencies.THB),cent(totalTHB));
assert.equal(projectedAll.lines.length,55);
assert.equal(projectedAll.releaseAllowed,false);
const zwp20=records.find(r=>r.site==="ZWP20");
const zwp8=records.find(r=>r.site==="ZWP8");
assert.equal(zwp20.subtotalTHB,921425.22);
assert.equal(zwp8.subtotalTHB,1387388.58);
assert.equal(zwp8.allocated,11);
const zwp11=summarizeMR0001TagCost0553("ZWP11").rows.find(r=>r.row===51&&r.tag==="TCAB-500-003");
assert(zwp11,"ZWP11 source enclosure TAG must exist");
assert.equal(zwp11.sourceQty,1);
assert.equal(zwp11.procurementQty,0);
assert.equal(zwp11.extended,0);
assert.equal(zwp11.referenceExtended,39200);
assert(zwp11.status.includes("MODIFICATION_NOT_ESTABLISHED"));
const bulk=deriveA5BulkAttribution0553();
assert.equal(bulk.state,"PARTIAL_WORKING_PRICED_BULK__RECLASS_FROM_A1");
assert.equal(bulk.a5PriceTHB,260232);
assert.equal(bulk.additionalCostPostedTHB,0);
assert.equal(money((allLocationsTHB-bulk.a5PriceTHB)+bulk.a5PriceTHB),allLocationsTHB,
 "Part A gross includes the A5 memo; no extra A5 posting");
assert.equal(JSON.stringify(sites.map(site=>summarizeMR0001TagCost0553(site).rows)),before,
 "Read-only cross-location cost audit mutated protected TAG ledgers");
// Fail-closed duplicate and missing-currency fixtures; negative tests never mutate source data.
const one=summarizeMR0001TagCost0553("ZWP20").rows;
assert.throws(()=>checkSourceOwners([...one,one[0]],"ZWP20"),/Duplicate TAG\/row owner/);
const sourcePrice=one.find(r=>r.countedInWorkingTotal);
assert(sourcePrice);
assert.throws(()=>checkSourceOwners(one.map(r=>r===sourcePrice?{...r,currency:null}:r),"ZWP20"),/unsupported currency/);
console.log("PASS Rev02 MR0001 seven-location source/quantity/currency/owner reconciliation: "+
 "55/55 working TAG allocations; THB "+allLocationsTHB.toLocaleString("en-US",{minimumFractionDigits:2})+
 " @ planning FX 31.5; ZWP20/ZWP8 and A5 no-double-post; ZWP11 new enclosure zero ONLY, modification cost open; negative fixtures blocked");
