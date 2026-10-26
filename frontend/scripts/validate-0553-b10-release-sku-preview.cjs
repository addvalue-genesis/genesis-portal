// PJ2608-0553 B10: Source → Release → Source contract with compact, customer-safe
// presentation. Engineering SKU details stay available in 10.2, not 10.3/10.5.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src"),original=require.extensions[".js"];
for(const ext of [".js",".jsx"])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?
 m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code,f):original(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const {selectSpareCustomerSchedule0553}=from("data/spareCustomerSchedule0553.js");
const {selectBcTurnkeyWorkingCost0553}=from("data/bcTurnkeyWorkingCost0553.js");
const {selectScopePartBcWorking0553}=from("data/scopePartBcReadModel0553.js");
const {buildReleaseCommercialModel0553,auditAnnexBidirectionalTrace0553}=from("data/releaseCommercialModel0553.js");
const {buildOfficialUsdRelease0553}=from("data/officialUsdRelease0553.js");
const {B10KitPriceSummary0553}=from("B10KitPriceSummary0553.jsx");
const {selectB10PhysicalComposition0553}=from("data/b10PhysicalComposition0553.js");
const {ScopeBcAnnexDetail0553}=from("ScopeBcAnnexDetail0553.jsx");
const ReactText=html=>html.replace(/<[^>]*>/g,"").replace(/&amp;/g,"&").replace(/&#x27;/g,"'");
const source=selectSpareCustomerSchedule0553(),working=selectBcTurnkeyWorkingCost0553();
const scope=selectScopePartBcWorking0553(),release=buildReleaseCommercialModel0553({thbPerUsd:31.5}),official=buildOfficialUsdRelease0553(release);
const current=source.currentByCode.B10,kitRows=release.annex.B10,officialRows=official.annex.B10;
const composition=selectB10PhysicalComposition0553();
assert.deepEqual(composition.sourceToReleaseParentIds,current.map(x=>x.id));
assert.deepEqual(composition.parentRows.map(x=>x.traceId),kitRows.map(x=>x.traceId));
assert.equal(composition.deliveredCommissioningKits,14);
assert.equal(composition.originalWorkingSellTHB,509827.5);
assert.equal(composition.procurementSkuApprovedCount,0);
assert.equal(composition.approvedB10SpareStockQtyCount,0);
assert.equal(composition.additionalPostingAllowed,false);
assert.equal(composition.requiredSpareFamilies.length,14);
assert(composition.installedComponents.some(x=>x.group.includes("ODU")&&x.sku==="3K-SC-HAZ-RF4958-GPS-01"));
assert(composition.installedComponents.some(x=>x.item.startsWith("IDU")&&x.sku===null));
assert(composition.installedComponents.some(x=>x.sku==="IE-3400-8P2S-E"&&x.referenceCurrency==="THB"));
assert(composition.installedComponents.some(x=>x.sku==="PWR-IE65W-PC-DC"&&x.referenceCurrency==="THB"));
assert(composition.installedComponents.some(x=>x.sku==="BD4345-00N0-AC + HRMD95-VIIIB"));
assert(composition.installedComponents.some(x=>x.sku==="212-02-6008-510"));
assert(composition.installedComponents.some(x=>x.sku==="SeaBeacon-2 System 6 Ex (024439)"));
assert(composition.installedComponents.every(x=>x.sparePurchaseQty===null&&x.spareUnitSellUSD===null&&x.nonposting===true));
assert(composition.requiredSpareFamilies.every(x=>x.sparePurchaseQty===null&&x.referenceUnitPrice===null));

assert.deepEqual(current.map(x=>x.id),kitRows.map(x=>x.sourceId));
assert.deepEqual(kitRows.map(x=>x.sourceId),officialRows.map(x=>x.sourceId));
assert.deepEqual(kitRows.map(x=>x.sourceRowModuleId),officialRows.map(x=>x.sourceRowModuleId));
assert.deepEqual(kitRows.map(x=>x.traceId),officialRows.map(x=>x.traceId));
assert.deepEqual(kitRows.map(x=>x.qty),[4,3,4,3]);
assert.equal(new Set(current.map(x=>x.id)).size,4);
assert.equal(working.byCode.B10.workingSellTHB,509827.5);
assert.equal(scope.lines.B10.workingSellTHB,509827.5);
assert.equal(release.b.find(x=>x.code==="B10").customerSellTHB,509827.5);
assert.equal(release.annexModels.B10.annexLineTotalTHB,509827.5);
assert.equal(official.b.find(x=>x.code==="B10").amountUSD,16200);
assert.equal(Math.round(officialRows.reduce((n,x)=>n+x.totalUSD,0)*100),1620000);
assert.equal(working.knownWorkingSellTHB,4994787.13);
assert.equal(release.annexTraceAudit.totalRows,16);
assert.equal(auditAnnexBidirectionalTrace0553(source.currentByCode,release.annex).sourceToReleasePassed,true);
assert.equal(auditAnnexBidirectionalTrace0553(source.currentByCode,release.annex).releaseToSourcePassed,true);
assert.equal(release.approval.releaseAllowed,false);

const common=(rows,options={})=>renderToStaticMarkup(React.createElement(B10KitPriceSummary0553,{rows,...options}));
const internal=common(kitRows,{currency:"THB",total:509827.5,internal:true,variant:"release",onOpenSource:()=>{}});
const external=common(kitRows,{currency:"THB",total:509827.5,variant:"release"});
const scopeHtml=renderToStaticMarkup(React.createElement(ScopeBcAnnexDetail0553,{code:"B10",mode:"scope",onOpenSource:()=>{},onOpenReleaseRow:()=>{}}));
const officialHtml=common(officialRows,{currency:"USD",total:16200,variant:"official"});
for(const html of [internal,external,scopeHtml,officialHtml]){
 const text=ReactText(html);
 assert(text.includes("B10 — Kit price summary / reconciliation"));
 assert.equal((html.match(/data-source-id=/g)||[]).length,4);
 for(const id of current.map(x=>x.id)){
  assert(html.includes('data-source-id="'+id+'"'),id+" missing");
  assert(html.includes("bid.budget.working.bc.b10.spare-line."+id.toLowerCase()),id+" reverse source missing");
 }
 if(html===external||html===officialHtml)assert(!text.includes("bid.budget."),"internal Module ID leaked into customer quotation");
 assert(!text.includes("B10 — Price-to-Win What-if"));
 assert(!text.includes("Original Item / Source → SKU"));
 assert(!text.includes("Next G Solution"));
 assert(!text.includes("Source quote D-2"));
 assert(!text.includes("PTTEP FIRST-PRINCIPLES PARAMETRIC"));
}
assert(ReactText(external).includes("509,827.50"));
assert(ReactText(officialHtml).includes("16,200.00"));
for(const html of [internal,external,scopeHtml,officialHtml]){
 assert(html.includes("B10 — Original Annex: Spare Part Schedule"),"B10 Original Annex title must match the current customer-safe UI");
 assert.equal((html.match(/data-native-b10-source-id=/g)||[]).length,14);
 assert.equal((html.match(/data-b10-requirement-id=/g)||[]).length,14);
 assert(html.includes('data-parent-source-id="B10-PTTEP-01"'));
 if(html===officialHtml){
  assert(html.includes("16,200.00")&&html.includes("1,821.69"),
   "Official B10 must map USD 16,200 and row rates from its own rounded MR parents");
  assert(html.includes("PRE-AWARD USD / CIF NOT VERIFIED"));
  assert(!html.includes("16,185.00"),"Do not display Working-pre-round allocation as Official");
 }else assert(html.includes("16,185.00")&&html.includes("1,820.00"),
  "Unissued B10 14-line budget split from 10.2 Working missing");
 assert(!html.includes('data-native-b10-source-id="B10-COMP-NG-A-1"'),
  "Part A installed ODU cannot be offered as a physical B10 spare line");
 assert(html.includes('data-b10-original-template="B-I"'),"B10 Preview must use original 8-column B-I geometry");
}
assert(!external.includes("242,460.00"),"No Part A supplier cost leaked into customer preview");
assert(!officialHtml.includes("242,460.00"),"No supplier price in Official customer preview");
assert(internal.includes("Engineering source / vendor evidence — INTERNAL ONLY"),
 "Internal supplier evidence must sit outside customer-facing Specification/Materials cells");
assert(!officialHtml.includes("Engineering source / vendor evidence — INTERNAL ONLY"),
 "Confidential source evidence must not leak to Official view");
assert(internal.includes("BUDGETARY WORKING ALLOCATION — USD"),
 "Nonissued allocation must be clearly distinguished from CIF OEM spare unit price");
assert(officialHtml.includes("PRE-AWARD USD / CIF NOT VERIFIED"),
 "Official B10 quoted USD rates must remain conspicuously pre-award and non-OEM");
assert((officialHtml.match(/data-native-b10-source-id=/g)||[]).length===14);
assert(!officialHtml.includes("To be quoted"),"Official budgetary lot prices must no longer be blank");
assert(internal.includes("16,185.00"));
assert(internal.includes("1,820.00"));
assert(!officialHtml.includes("16,185.00"),"Official USD source summary may not inherit unissued allocation amounts");
assert(officialHtml.includes("B10 PRE-AWARD PRICE ALLOCATION — NOT AN OEM SPARE CIF QUOTE"));
assert(ReactText(internal).includes("10.2 Source"));
assert(!ReactText(external).includes("10.2 Source"));
assert(!ReactText(officialHtml).includes("10.2 Source"));
assert(ReactText(scopeHtml).includes("10.3 Release"));
for(const id of current.map(x=>x.id)){
 const sourceModuleId=current.find(x=>x.id===id).sourceRowModuleId;
 const out=kitRows.find(x=>x.sourceId===id);
 assert.equal(out.sourceRowModuleId,sourceModuleId);
 assert.equal(out.traceId,"B10::"+id);
 assert.equal(out.workingTotalTHB,current.find(x=>x.id===id).extendedTHB);
}
assert.throws(()=>common(kitRows.slice(0,3),{currency:"THB",total:509827.5}),/exactly four/);
assert.throws(()=>common(kitRows,{currency:"THB",total:1}),/do not reconcile/);
assert.throws(()=>common([{...kitRows[0],qty:2},...kitRows.slice(1)],{currency:"THB",total:509827.5}),/quantities diverged/);

const releaseUi=fs.readFileSync(path.join(root,"project0553/ReleaseCustomerWorkbook0553.jsx"),"utf8");
const officialUi=fs.readFileSync(path.join(root,"project0553/OfficialUsdRelease0553.jsx"),"utf8");
const budgetaryUi=fs.readFileSync(path.join(root,"project0553/BudgetaryWorkbookPreview0553.jsx"),"utf8");
const budgetWorkspaceUi=fs.readFileSync(path.join(root,"project0553/CommercialWorkspace.jsx"),"utf8");
const scopeUi=fs.readFileSync(path.join(root,"project0553/ScopeBcAnnexDetail0553.jsx"),"utf8");
const css=fs.readFileSync(path.join(root,"project0553/releaseWorkbook0553.css"),"utf8");
assert(releaseUi.includes('code==="B10"?<B10KitPriceSummary0553'));
assert(!releaseUi.includes('code==="B10"&&<B10ReleaseSkuSchedule0553'));
assert(!releaseUi.includes('internal&&code==="B10"&&<B10ItemizedPurchasingEvidence0553'));
assert(!releaseUi.includes('internal&&code==="B10"&&<B10PriceToWinScenario0553'));
assert(scopeUi.includes('if(code==="B10"&&!inWorking)return'));
assert(scopeUi.includes('onOpenSource={onOpenSource} onOpenReleaseRow={onOpenReleaseRow}'));
assert(officialUi.includes('sheet==="B10"?<B10KitPriceSummary0553'));
assert(budgetaryUi.includes('sheet==="B10 CommSpares"?<B10KitPriceSummary0553'));
assert(budgetaryUi.includes('onOpenSource={onOpenSource} variant="budgetary"'));
assert(budgetWorkspaceUi.includes('<BudgetaryWorkbookPreview0553 onOpenSource={openReleaseSource}/>'));
// Release navigation now carries the exact B10 spare function key, in addition to its parent source row.
assert(budgetWorkspaceUi.includes('const openReleaseAnnexRow=({code,sourceId,sourceSelectionId=null})=>'));
assert(budgetWorkspaceUi.includes('setReleaseAnnexTarget(prev=>({code,sourceId,sourceSelectionId,seq:'));
assert(budgetWorkspaceUi.includes('setPricingStage("released"); // navigation only, no price posting/approval'));
assert(budgetWorkspaceUi.includes('sourceSelectionId:item.sourceSelectionId||null,originWasExact:true'));
assert(budgetWorkspaceUi.includes('onClick={()=>openReleaseAnnexRow(returnToRelease)'));
assert(releaseUi.includes('const requestedStageRow=focusAnnexTarget.code==="B10"&&focusAnnexTarget.sourceSelectionId'));
assert(budgetWorkspaceUi.includes('onOpenReleaseRow={openReleaseAnnexRow}'));
assert(budgetWorkspaceUi.includes('onOpenSource={openReleaseSource}'));
assert(releaseUi.includes('const targetId="bid.budget.pricing.release.preview.annex."'));
assert(releaseUi.includes('onOpenSource={onOpenSource} variant="release"'));
assert(scopeUi.includes('onOpenSource={onOpenSource} onOpenReleaseRow={onOpenReleaseRow}'));
// Source rows use unitPriceTHB/extendedTHB, not Release customerTotalTHB.
for(const variant of ["budgetary","scope"]){
 const priceHtml=common(current,{currency:"THB",total:509827.5,variant});
 assert(priceHtml.includes("509,827.50"),variant+" source price absent");
 for(const sourceRow of current)
  assert(priceHtml.includes(sourceRow.extendedTHB.toLocaleString("en-US",{minimumFractionDigits:2})),
   variant+" missing source price "+sourceRow.id);
 assert.throws(()=>common(current.map((r,i)=>i===0?{...r,extendedTHB:undefined}:r),
  {currency:"THB",total:509827.5,variant}),/missing THB price field/);
}
const budgetHtml=common(current,{currency:"THB",total:509827.5,internal:true,variant:"budgetary",onOpenSource:()=>{}});
assert.equal((budgetHtml.match(/data-source-id=/g)||[]).length,4);
assert(budgetHtml.includes('bid.budget.pricing.budgetary.annex.b10.'));
assert(ReactText(budgetHtml).includes("10.2 Source"));
assert(css.includes(".p553-b10-commercial-table{width:100%;min-width:0"));
assert(css.includes(".p553-b10-commercial-scroll{width:100%;max-width:100%;overflow-x:auto"));
assert(css.includes(".p553-native-sheet{overflow:hidden"));
console.log("PASS PJ2608-0553 B10: Source 4 MR kits Working THB509827.50 / USD16185, Official 14 source-linked 1-LOT priced budget rows USD16200, two price stages separate, no OEM spare quantity or actual CIF SKU falsely approved");
