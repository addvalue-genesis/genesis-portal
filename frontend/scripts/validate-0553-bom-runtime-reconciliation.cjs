// Runtime BOM cost-integrity gate. Fails build for quote/ledger divergence.
// Babel compiles project ES modules in Node, matching existing project validators.
const assert=require("node:assert/strict"),path=require("node:path"),babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const oldJs=require.extensions[".js"],oldJsx=require.extensions[".jsx"];
function compile(mod,file){
 const src=babel.transformFileSync(file,{babelrc:false,configFile:false,presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(src.code,file);
}
require.extensions[".js"]=(mod,file)=>file.startsWith(root+path.sep)?compile(mod,file):oldJs(mod,file);
require.extensions[".jsx"]=(mod,file)=>file.startsWith(root+path.sep)?compile(mod,file):(oldJsx||oldJs)(mod,file);
const project=p=>require(path.join(root,"project0553",p));
const {MGW_P26_058_R2_SELECTED_0553:q}=project("data/mgwP26058R2Selected0553.js");
const {MR0002_WORKING_BOM_0553:bom}=project("data/mr0002WorkingBom0553.js");
const {selectWorkingBomProjection0553:projectRows}=project("data/workingBomAggregation0553.js");
const {validateBomPresentationContract0553:validateUi}=project("bomPresentationContract0553.test.js");
assert.equal(validateUi(),true,"Presentation invariants");
assert.equal(q.lines.filter(x=>x.mr==="MR-0002").reduce((sum,r)=>sum+r.quantity*r.unitPriceUSD,0),99564);
assert.equal(q.services.reduce((sum,r)=>sum+r.amountUSD,0),14500);
assert.equal(bom.quoteEquipmentTotalUSD,99564);
const target=["ZWP20","ZWP21","ZWP22"];
for(const site of target){
 const canonical=bom.sites.find(s=>s.site===site);
 assert.ok(canonical,"Missing canonical "+site);
 assert.equal(canonical.controlledTotalUSD,33188,"R2 equipment allocation "+site);
 const rows=projectRows({mr:"MR-0002",site});
 assert.deepEqual(rows.invalidPosting,[],"Invalid posting rows for "+site);
 const ids=rows.lines.map(x=>[x.site,x.mr,x.id].join("|"));
 assert.equal(new Set(ids).size,ids.length,"Duplicate source cost item IDs for "+site);
 const included=rows.lines.filter(x=>Boolean(x.item.priceInclusion));
 assert.ok(included.length>=2,"Missing included Enclosure/Surge evidence for "+site);
 assert.ok(included.every(x=>!x.counted),"Included child price added again "+site);
 const postedUSD=rows.lines.filter(x=>x.counted&&x.currency==="USD").reduce((s,x)=>s+x.extended,0);
 const postedTHB=rows.lines.filter(x=>x.counted&&x.currency==="THB").reduce((s,x)=>s+x.extended,0);
 assert.equal(Math.round(postedUSD*100),Math.round(canonical.controlledTotalUSD*100),"Cross-view USD "+site);
 assert.equal(Math.round(postedTHB*100),Math.round(canonical.controlledTotalTHB*100),"Cross-view THB "+site);
 for(const id of [site+"-RFI-BDA-EXD-ENCLOSURE",site+"-BULK-EX-SURGE"]){
  const item=canonical.items.find(x=>x.id===id);
  assert.ok(item,id+" missing");
  assert.ok(item.priceInclusion&&item.parentPackage,id+" lacks source inclusion");
  assert.equal(item.countedInWorkingTotal,false,id+" double posted");
 }
}
assert.equal(target.reduce((sum,s)=>sum+bom.sites.find(x=>x.site===s).controlledTotalUSD,0),99564,"Three-location equipment quote reconciles");
console.log("PASS PJ2608-0553 runtime MR0002 quote, 3-WP source ledger, presentation and inclusion checks");
