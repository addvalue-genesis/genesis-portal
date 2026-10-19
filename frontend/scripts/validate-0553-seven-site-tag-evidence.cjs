// PJ2608-0553 — 7-location MR0001 4-stage Required/Working/Vendor/Verify.
// Read-only runtime projection; preserve Rev03 protected cost and original quotes.
// Validate source TAG row coverage, component ownership, no automatic Ex/OEM approval.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),babel=require("@babel/core");
const root=path.resolve(__dirname,"../src"),oldJS=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(!file.startsWith(root+path.sep))return oldJS(mod,file);
 const out=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(out.code,file);
};
const source=p=>require(path.join(root,"project0553",p));
const {selectMR0001Rev03TagCostRows0553:tagRows}=source("data/mr0001Rev03CostOverlay0553.js");
const {getTagBomFourStage0553:fourStage}=source("data/tagBomFourStageReadModel0553.js");
const {selectWorkingBomProjection0553:projection}=source("data/workingBomAggregation0553.js");
const {SUPPLIER_QUOTE_LINES_0553:quotes}=source("data/supplierQuoteLines.js");
const sites=["ZWP20","ZWP21","ZWP22","ZWP23","ZPQ","ZWP8","ZWP11"];
const family=t=>String(t).toUpperCase().replace(/\s+/g,"");
let inspected=0;const familyCounts={DATO:0,SURGE:0,ENCLOSURE:0,BULK:0};
const sourceBefore=JSON.stringify(Object.fromEntries(sites.map(site=>[site,tagRows(site)])));
const originalQuotes=JSON.stringify(quotes);
for(const site of sites){
 const all=tagRows(site);
 const ownerKeys=new Set();
 const book=projection({mr:"MR-0001",site});
 assert.deepEqual(book.invalidPosting,[],"No invalid counted working postings at "+site);
 for(const item of all){
  const key=item.row+"|"+item.tag;
  assert(!ownerKeys.has(key),"Duplicate MTO owner at "+site+"/"+key);ownerKeys.add(key);
  const t=family(item.tag);
  const expected=t.startsWith("DATO-")?"DATO":t.startsWith("SA-")?"SURGE":
   t.startsWith("TCAB-")?"ENCLOSURE":t==="BULKMATERIAL"?"BULK":null;
  if(!expected)continue;
  const m=fourStage(site,item);
  assert(m.ownerEvidence,site+"/"+key+" has no owner-aware evidence in shared workbench");
  assert.equal(m.ownerEvidence.category,expected);
  assert.equal(m.ownerEvidence.siteRole,["ZPQ","ZWP8","ZWP11"].includes(site)?
   "BROWNFIELD_REPLACEMENT_REUSE_TIE_IN_UNRESOLVED":"GREENFIELD_SITE_SPECIFIC_WORKING_TAKEOFF_PENDING");
  assert.equal(m.ownerEvidence.sourceMatched,true,site+"/"+key+" source evidence mismatch");
  assert(m.required.length>0,site+"/"+key+" missing Required Engineering Function");
  assert(m.required.some(r=>r.id.startsWith("OWNER-"))||site==="ZWP20"&&expected==="ENCLOSURE",
   site+"/"+key+" missing owner-linked functional row");
  assert(m.required.every(r=>r.approvedSkuQty===null),site+"/"+key+" must not auto-approve OEM SKU");
  assert.equal(m.physicalSkuApproved,false);
  assert.equal(m.working.extended,item.countedInWorkingTotal?item.extended:null);
  assert.equal(m.working.currency,item.currency);
  assert.equal(m.releaseAllowed,false);
  assert.equal(m.ownerEvidence.customerSellChanged,false);
  for(const q of m.offered){
   assert(q.costOwner===m.owner,site+"/"+key+" mixed quote owner");
   if(q.sourceStatus?.includes("ALTERNATIVE")||q.sourceStatus?.includes("REFERENCE_ONLY"))
    assert(q.workingExtended===null,site+"/"+key+" unselected supplier rate was posted");
  }
  if(expected==="DATO"){
   for(const fn of ["DATO_RJ45_PANEL_INTERFACE","DATO_RJ45_FIELD_PLUG"])
    assert(m.required.some(r=>r.functionId===fn),site+"/"+key+" "+fn);
   assert(m.ownerEvidence.notes.some(s=>s.includes("NOT an INNOVA supplier quotation")));
   assert(m.offered.find(r=>r.quoteId==="INNOVA-QA24-0604")?.quotedUnit===null,
    site+"/"+key+" historical INNOVA N/A must remain NULL");
   assert.equal(m.ownerEvidence.functionSubtotalMatches,true,site+"/"+key+" DATO two components mismatch");
  }
  if(expected==="SURGE"){
   assert(m.required.some(r=>r.functionId==="ETHERNET_SURGE_ASSEMBLY"));
   assert(m.ownerEvidence.notes.every(s=>!s.includes("TECHNICAL_APPROVED")));
  }
  if(expected==="BULK"){
   for(const fn of ["SCADA_CAT6A_WORKING_ALLOWANCE","SCADA_M20_GLAND_WORKING_ALLOWANCE"])
    assert(m.required.some(r=>r.functionId===fn),site+"/"+key+" "+fn);
   assert(m.ownerEvidence.notes.some(s=>s.includes("not as-built")||s.includes("not dimensioned")||s.includes("not as-built"))||
    m.ownerEvidence.notes.some(s=>s.includes("not measured")),site+"/"+key+" bulk scope must be qualified");
  }
  if(expected==="ENCLOSURE"){
   assert(m.required.some(r=>r.functionId==="SCADA_EXE_ENCLOSURE_ASSEMBLY"||
    r.functionId==="EXISTING_TCAB_REUSE_AND_MODIFICATION"||
    r.functionId==="SCADA_EX_E_PANEL_ASSEMBLY"));
   if(site==="ZWP11"&&t==="TCAB-500-003"){
    assert.equal(item.procurementQty,0);
    assert.equal(item.extended,0);
    assert(m.required.some(r=>r.functionId==="EXISTING_TCAB_REUSE_AND_MODIFICATION"));
    assert(m.ownerEvidence.notes.some(x=>x.includes("Zero new-panel procurement")));
   }
  }
  familyCounts[expected]++;inspected++;
 }
}
assert.equal(familyCounts.DATO,4);
assert.equal(familyCounts.ENCLOSURE,6);
assert.equal(familyCounts.SURGE,8);
assert.equal(familyCounts.BULK,7);
assert.equal(inspected,25);
assert.equal(JSON.stringify(Object.fromEntries(sites.map(site=>[site,tagRows(site)]))),sourceBefore,
 "Read-only seven-site projection must never mutate TAG ledgers");
assert.equal(JSON.stringify(quotes),originalQuotes,"Vendor source quote must remain immutable");
const view=fs.readFileSync(path.join(root,"project0553/TagFourStageWorkbench0553.jsx"),"utf8");
const model=fs.readFileSync(path.join(root,"project0553/data/tagBomFourStageReadModel0553.js"),"utf8");
assert(view.includes("m.ownerEvidence.siteRole")&&view.includes("required-bom.owner-evidence"));
assert(view.includes("engineering-verification.owner-evidence"));
for(const phase of [".required-bom",".working-priced-bom",".vendor-comparison",".engineering-verification"])
 assert(view.includes('id+"'+phase+'"'),"Missing shared site/TAG workflow stage "+phase);
assert(model.includes("projectMR0001TagEvidence0553"));
const compiled=babel.transformSync(view,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
assert(compiled.code.length>0);
console.log("PASS 0553 seven-site MR0001: 25 DATO/SA/TCAB/Bulk TAGs in 7 locations, 4-stage owner-scoped evidence; original quotes/Rev03 costs unchanged, no OEM or sell release");
