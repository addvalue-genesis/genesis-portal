// Execute the real four-stage TAG read model with controlled 0553 sources.
// Guard Required -> Working -> Vendor -> Verification, no duplicate cost posting.
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const originalJS=require.extensions[".js"],originalJSX=require.extensions[".jsx"];
function babelCompile(mod,filename){
 const compiled=babel.transformFileSync(filename,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(compiled.code,filename);
}
require.extensions[".js"]=(mod,filename)=>filename.startsWith(root+path.sep)?babelCompile(mod,filename):originalJS(mod,filename);
require.extensions[".jsx"]=(mod,filename)=>filename.startsWith(root+path.sep)?babelCompile(mod,filename):(originalJSX||originalJS)(mod,filename);
const {deriveZWP20SiteCost0553}=require(path.join(root,"project0553/data/zwp20SiteCost0553.js"));
const {getTagBomFourStage0553}=require(path.join(root,"project0553/data/tagBomFourStageReadModel0553.js"));
const before=JSON.stringify(deriveZWP20SiteCost0553().rows);
const rows=deriveZWP20SiteCost0553().rows,odu=rows.find(x=>x.row===4&&x.tag==="MR-502-001");
assert(odu,"ZWP20 ODU TAG missing");
const m=getTagBomFourStage0553("ZWP20",{...odu,countedInWorkingTotal:true});
assert.equal(m.owner,"MR-502-001.4");
assert.equal(m.sourceMatched,true,"MTO identity must be source-matched");
assert.deepEqual(m.required.map(x=>x.functionId),[
 "RADIO_EQUIPMENT","RF_FILTER","CAPACITY_KEY","REGION_KEY","POWER","POWER_CORD","MOUNT_FEEDER","WARRANTY"
]);
assert.equal(m.physicalSkuApproved,false,"Required functional BOM is NOT an approved physical SKU takeoff");
assert(m.required.every(x=>x.approvedSkuQty===null),"No fabricated approved SKU quantity");
assert.equal(m.working.extended,7288.65,"Frozen ODU ledger amount must remain intact");
assert.equal(m.working.derivedFunctionSubtotal,7288.65,"ODU only, no IDU power duplicate");
assert.equal(m.working.deltaFromLedger,0,"Derived ODU subset must reconcile to frozen ledger");
assert.equal(m.working.completeness,"WORKING_FUNCTIONS_RECONCILED");
assert.deepEqual(m.working.functions.filter(x=>!x.includedWithoutExtra).map(x=>x.quoteCode),
 ["B-1","B-2","B-3","B-4","B-5"]);
assert.deepEqual(m.working.otherOwnerFunctions.map(x=>[x.quoteCode,x.owner]),
 [["B-6","MR-502-001A.5"],["B-7","MR-502-001A.5"]]);
assert.deepEqual(m.offered.map(x=>x.code),["B-1","B-2","B-3","B-4","B-5"],
 "TAG vendor compare must never include IDU, antenna or surge-owned quoted lines");
assert.equal(m.offered.find(x=>x.code==="B-1").offeredQty,3);
const region=m.offered.find(x=>x.code==="B-4");
assert.equal(region.quotedUnit,null,"Vendor B-4 source MUST remain NULL");
assert.equal(region.workingAssumedZero,true,"USD 0 management assumption must be qualified");
assert.equal(region.quotedTotal,null,"Vendor original quote B-4 has no total");
assert.equal(m.releaseAllowed,false);
const unlike=getTagBomFourStage0553("ZWP20",{...odu,countedInWorkingTotal:true,
 detail:odu.detail.map(x=>x.functionId==="RADIO_EQUIPMENT"?{...x,currency:"THB"}:x)});
assert.equal(unlike.working.derivedFunctionSubtotal,null,"Never add mixed currency function rates");
assert.equal(unlike.working.completeness,"MIXED_OR_UNVERIFIED_FUNCTION_CURRENCIES");
const idu=rows.find(x=>x.row===5&&x.tag==="MR-502-001A");
assert(idu,"Separate IDU cost owner must remain present");
const iduView=getTagBomFourStage0553("ZWP20",{...idu,countedInWorkingTotal:true});
assert.equal(iduView.working.extended,671.27);
assert.equal(iduView.working.derivedFunctionSubtotal,671.27,"Existing MAP-09 owner B-6/B-7 must reconstruct IDU subset");
assert.deepEqual(iduView.offered.map(x=>x.code),["B-6","B-7"],"IDU must show only source lines with IDU cost owner");
assert.equal(iduView.working.deltaFromLedger,0);
assert.notEqual(iduView.owner,m.owner);
for(const check of [{row:6,tag:"ANT-502-001",code:"B-12",usd:4709.77},{row:10,tag:"SA-502-001",code:"B-8",usd:614.2}]){
 const tag=rows.find(x=>x.row===check.row&&x.tag===check.tag);
 assert(tag,"Missing TAG: "+check.tag);
 const view=getTagBomFourStage0553("ZWP20",{...tag,countedInWorkingTotal:true});
 assert.equal(view.working.extended,check.usd);
 assert.equal(view.working.derivedFunctionSubtotal,check.usd);
 assert.equal(view.working.deltaFromLedger,0);
 assert.deepEqual(view.offered.map(x=>x.code),[check.code],"TAG line not separated correctly: "+check.tag);
}

assert.equal(JSON.stringify(deriveZWP20SiteCost0553().rows),before,"Read model must not mutate ledger");
const ui=fs.readFileSync(path.join(root,"project0553/TagFourStageWorkbench0553.jsx"),"utf8");
const host=fs.readFileSync(path.join(root,"project0553/LocationBomDetail0553.jsx"),"utf8");
assert(ui.includes("04 · Engineering Verification")&&ui.includes("03 · Vendor Offer Comparison"),"Missing ordered four-stage UI");
for(const suffix of [".required-bom",".working-priced-bom",".vendor-comparison",".engineering-verification"]){
 assert(ui.includes('id+"'+suffix+'"'),"Missing stable four-stage module "+suffix);
}
assert(host.includes("<TagFourStageWorkbench0553 site={site} tagRow={v} moduleKey={tagKey(v)}>"),
 "The existing TAG Derivation module must contain the four-stage workbench");
assert(host.includes('moduleKey={tagKey(v)+".derivation"}'),"Legacy TAG derivation ID preserved");
assert(host.includes("<TagMappingAudit0553/>")&&host.includes('moduleKey={tagKey(v)+".particular-evidence"}'),
 "Mapping Audit and RFQ detail must remain available under Engineering Verification");
const compiled=babel.transformSync(ui,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
assert(compiled.code.length>0,"Four-stage JSX compile failed");
console.log("PASS 0553 TAG four-stage read model: 8 engineering-required functions (no approved SKU), 5 ODU quote codes, USD 7,288.65 owner-only reconciliation, IDU USD 671.27 separate, B-4 supplier NULL, zero ledger mutation; four TAG owners' source lines, all four module contracts and JSX compile.");
