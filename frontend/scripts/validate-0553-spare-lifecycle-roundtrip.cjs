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
const {selectSparePricedBudgetReview0553}=from("data/sparePricedBudgetReview0553.js");
const {SparePricedBudgetReview0553}=from("SparePricedBudgetReview0553.jsx");

const source=selectSpareCustomerSchedule0553(),release=buildReleaseCommercialModel0553({thbPerUsd:31.5});
const official=buildOfficialUsdRelease0553(release);
const model=buildSpareLifecycleTrace0553(source,release);
const priced=selectSparePricedBudgetReview0553();
assert.deepEqual(["B11","B13","C1","C2"].map(code=>priced.rows[code].length),[4,3,1,12]);
assert.equal(priced.totals.B11,157657.5);
assert.equal(priced.totals.B13,46683);
assert.equal(priced.totals.C1,3071250);
assert(Math.abs(priced.totals.C2-721806.60)<0.02);
assert(priced.c2HistoricalOnly&&priced.c1IncludedInOfficial===false&&priced.c2IncludedInOfficial===false);
assert(priced.codes.every(code=>priced.rows[code].every(x=>x.quantity>0&&x.unitPriceTHB>0&&x.extendedTHB>0)));
assert(priced.rows.C2.every(x=>x.customerIssueAllowed===false&&!x.priceSelectedInWorking));
for(const code of priced.codes){
 const rendered=renderToStaticMarkup(React.createElement(SparePricedBudgetReview0553,{code,context:"release"}));
 assert(rendered.includes('data-budget-price-review="'+code+'"'));
 assert.equal((rendered.match(/data-source-pricing-line=/g)||[]).length,priced.rows[code].length);
}

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
assert(model.requirements.B10.minimum.includes("14 kit sets"));
assert(model.requirements.B11.minimum.includes("5 distinct minimum telecom tool functions"));
assert(model.requirements.B13.open.includes("B5 packing and A5 installed bulk"));
assert(model.requirements.C1.open.includes("Independent OEM"));
assert(model.requirements.C2.open.includes("omit confirmed B10 identical stock"));
assert.equal(model.completeCategoryReconciliation,false);
assert.equal(model.newPriceReview.B10.proposedTHB,568083.85);
assert.equal(model.newPriceReview.B10.officialEquivalentUSD,18100);
assert.equal(model.newPriceReview.B10.selected,false);
assert.equal(model.newPriceReview.B10.proposalOnly,true);
assert(model.newPriceReview.B10.evidenceClass.includes("NONITEMIZED"));
assert.equal(model.newPriceReview.B11.proposedTHB,null);
assert.equal(model.newPriceReview.B13.proposedTHB,null);
assert.equal(model.newPriceReview.C1.proposedTHB,3071250);
assert(model.newPriceReview.C1.evidenceClass.includes("NOT_OEM_SPARE_QUOTE"));
assert.equal(model.newPriceReview.C2.proposedTHB,null);
assert(SPARE_LIFECYCLE_CODES_0553.every(code=>
 model.newPriceReview[code].selected===false&&
 model.newPriceReview[code].customerReleaseAllowed===false&&
 model.newPriceReview[code].proposalOnly===true));

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
assert(html.includes("Customer requirement minimums / next OEM evidence"));
assert(html.includes("MR0001–0004 Attachment 7 instruction 6"));
assert(html.includes("TETRA/DMR applicability"));
assert(html.includes("14 kit sets"));
for(const code of SPARE_LIFECYCLE_CODES_0553)
 assert(html.includes('data-new-spare-price-review="'+code+'"'),"Missing new/old price comparison "+code);
assert(html.includes("568,083.85"),"B10 new researched candidate not displayed");
assert(html.includes("3,071,250.00"),"C1 nonposting equipment benchmark not displayed");
assert(html.includes("NOT SELECTED / RELEASE HOLD"));

const workspace=fs.readFileSync(path.join(root,"project0553/CommercialWorkspace.jsx"),"utf8");
const releaseUi=fs.readFileSync(path.join(root,"project0553/ReleaseCustomerWorkbook0553.jsx"),"utf8");
const detail=fs.readFileSync(path.join(root,"project0553/ScopeBcAnnexDetail0553.jsx"),"utf8");
const modelJs=fs.readFileSync(path.join(root,"project0553/data/spareLifecycleTrace0553.js"),"utf8");
const officialJs=fs.readFileSync(path.join(root,"project0553/data/officialUsdRelease0553.js"),"utf8");
const exportJs=fs.readFileSync(path.join(root,"project0553/nativeWorkingDraft0553.js"),"utf8");
for(const phrase of [
 'buildSpareLifecycleTrace0553(selectSpareCustomerSchedule0553(),releaseModel)',
 'setReturnToRelease({code,sourceId:released.sourceId,traceId:released.traceId,',
 'originWasExact:true',
 'originWasExact:false',
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
assert(releaseUi.includes('target.classList.add("p553-release-row-focus")'),
 "After returning from the exact Working source, Release must highlight that very row");
const css=fs.readFileSync(path.join(root,"project0553/releaseWorkbook0553.css"),"utf8");
assert(css.includes(".p553-release-row-focus>td"),"Exact Release row highlight style missing");
assert(detail.includes("onOpenReleaseRow({code,sourceId:x.id,sourceRowModuleId:x.sourceRowModuleId})"));
assert(modelJs.includes("customerReleaseAllowed:false"));
assert(officialJs.includes('incrementUSD:100'));
assert(exportJs.includes('if(detail.length>13)throw Error(code+" exceeds 13 physical rows in original.'));
assert.equal(release.annexTraceAudit.totalRows,16);
assert.equal(release.approval.releaseAllowed,false);
console.log("PASS 0553 five-category: 16/16 roundtrip, selected financial owner preserved; NEW B10 review THB568083.85 vs selected THB509827.50, C1 installed comparator THB3071250 unposted, B11/B13/C2 new rates not established, Official unchanged, seven no-duplicate gates");
