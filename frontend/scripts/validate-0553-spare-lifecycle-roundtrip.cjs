// 0553 cross-category B10/B11/B13/C1/C2: exact 16 Working→Release→Source→Release
// contract, source financial owner retention and 7 nonposting physical-stock gates.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src"),original=require.extensions[".js"];
for(const ext of [".js",".jsx"])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?
 m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code,f):original(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const {selectSpareCustomerSchedule0553}=from("data/spareCustomerSchedule0553.js");
const {buildReleaseCommercialModel0553}=from("data/releaseCommercialModel0553.js");
const {buildOfficialUsdRelease0553}=from("data/officialUsdRelease0553.js");
const {buildSpareLifecycleTrace0553,SPARE_LIFECYCLE_CODES_0553}=from("data/spareLifecycleTrace0553.js");
const {SpareLifecycleControl0553}=from("SpareLifecycleControl0553.jsx");

const source=selectSpareCustomerSchedule0553(),release=buildReleaseCommercialModel0553({thbPerUsd:31.5});
const official=buildOfficialUsdRelease0553(release);
const model=buildSpareLifecycleTrace0553(source,release);
assert.deepEqual(SPARE_LIFECYCLE_CODES_0553,["B10","B11","B13","C1","C2"]);
assert.deepEqual(SPARE_LIFECYCLE_CODES_0553.map(x=>model.totals[x].rows),[4,4,3,1,4]);
assert.deepEqual(SPARE_LIFECYCLE_CODES_0553.map(x=>model.totals[x].workingSellTHB),
 [509827.5,157657.5,46683,null,null]);
assert.equal(model.rows.length,16);
assert.equal(new Set(model.rows.map(x=>x.sourceId)).size,16);
assert.equal(model.rules.length,7);
assert.equal(model.confirmedSameSkuCrossCategory,0);
assert.equal(model.releaseAllowed,false);
assert.equal(model.noNewPosting,true);
assert.equal(model.completeCategoryReconciliation,false);
assert(model.rules.some(x=>x.id==="B10-C2"&&x.requirement.includes("Attachment 7 instruction 6")));
assert(model.rules.some(x=>x.id==="B11-B3"));
assert(model.rules.some(x=>x.id==="B13-B5"));
assert(model.rules.some(x=>x.id==="B13-A5"));
const expectedOfficial={B10:16200,B11:5100,B13:1500};
for(const code of SPARE_LIFECYCLE_CODES_0553){
 const rows=model.rows.filter(x=>x.code===code),working=source.currentByCode[code],shown=release.annex[code];
 assert.equal(rows.length,working.length);
 assert.equal(rows.length,shown.length);
 for(let i=0;i<rows.length;i++){
  const x=rows[i],s=working[i],r=shown[i];
  assert.equal(x.sourceId,s.id);
  assert.equal(x.sourceId,r.sourceId);
  assert.equal(x.traceId,r.traceId);
  assert.equal(x.sourceRowModuleId,s.sourceRowModuleId);
  assert.equal(x.sourceRowModuleId,r.sourceRowModuleId);
  assert.equal(x.releaseRowModuleId,
   "bid.budget.pricing.release.preview.annex."+code.toLowerCase()+"."+x.sourceId.toLowerCase());
  assert.equal(x.selectedWorkingSellTHB,r.workingTotalTHB);
  assert.equal(x.customerTotalTHB,r.customerTotalTHB);
  assert.equal(x.countedAsAdditionalSku,false);
  assert.equal(x.physicalSkuApproved,false);
  assert.equal(x.physicalQtyApproved,false);
  assert.equal(x.independentSpareUnitPriceApproved,false);
  assert.equal(x.customerReleaseAllowed,false);
 }
 if(code.startsWith("C")){
  assert.equal(model.totals[code].workingSellTHB,null);
  assert(official.annex[code].every(x=>x.unitUSD===null&&x.totalUSD===null));
 }else{
  assert.equal(official.b.find(x=>x.code===code).amountUSD,expectedOfficial[code]);
 }
}
const html=renderToStaticMarkup(React.createElement(SpareLifecycleControl0553,{
 model,view:"release",onOpenSource:()=>{},onOpenReleaseRow:()=>{}
}));
assert.equal((html.match(/data-spare-roundtrip-row=/g)||[]).length,16);
assert(html.includes("Release HOLD"));
for(const item of model.rows){
 assert(html.includes('data-spare-roundtrip-row="'+item.sourceId+'"'));
 assert(html.includes(item.sourceRowModuleId));
 assert(html.includes(item.sourceId));
}
assert(html.includes("10.2 Source"));
assert(html.includes("10.3.3 Release"));
const workspace=fs.readFileSync(path.join(root,"project0553/CommercialWorkspace.jsx"),"utf8");
const releaseUi=fs.readFileSync(path.join(root,"project0553/ReleaseCustomerWorkbook0553.jsx"),"utf8");
const detail=fs.readFileSync(path.join(root,"project0553/ScopeBcAnnexDetail0553.jsx"),"utf8");
const modelJs=fs.readFileSync(path.join(root,"project0553/data/spareLifecycleTrace0553.js"),"utf8");
const officialJs=fs.readFileSync(path.join(root,"project0553/data/officialUsdRelease0553.js"),"utf8");
const exportJs=fs.readFileSync(path.join(root,"project0553/nativeWorkingDraft0553.js"),"utf8");
for(const phrase of [
 'buildSpareLifecycleTrace0553(selectSpareCustomerSchedule0553(),releaseModel)',
 'setReturnToRelease({code,sourceId:released.sourceId,traceId:released.traceId,',
 'released.sourceRowModuleId!==id',
 'setPricingStage("working")',
 'Return to exact 10.3.3 Release row',
 'onClick={()=>openReleaseAnnexRow(returnToRelease)}',
 '<SpareLifecycleControl0553 model={spareLifecycle} view="working"',
 '<SpareLifecycleControl0553 model={spareLifecycle} view="release"',
 '<ReleaseCustomerWorkbook0553 model={releaseModel}',
])assert(workspace.includes(phrase),"Roundtrip UI missing "+phrase);
assert(releaseUi.includes('focusAnnexTarget.code.toLowerCase()+"."+focusAnnexTarget.sourceId.toLowerCase()'));
assert(releaseUi.includes('sourceModuleId:item.sourceRowModuleId||item.sourceModuleId'));
assert(detail.includes("onOpenReleaseRow({code,sourceId:x.id,sourceRowModuleId:x.sourceRowModuleId})"));
assert(modelJs.includes("customerReleaseAllowed:false"));
assert(officialJs.includes('incrementUSD:100'));
assert(exportJs.includes('if(detail.length>13)throw Error(code+" exceeds 13 physical rows in original.'));
assert.equal(release.annexTraceAudit.totalRows,16);
assert.equal(release.approval.releaseAllowed,false);
console.log("PASS 0553 five-category 16/16 Working→Release→Source→Release identity; B10/B11/B13 unchanged 509827.50/157657.50/46683.00, C1/C2 unpriced, Official rounding unchanged, seven no-duplicate stock rules HOLD");
