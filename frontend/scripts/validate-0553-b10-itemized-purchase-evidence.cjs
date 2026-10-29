// PJ2608-0553: B10 supplier-quoted SKU → Working → Scope → internal Release,
// without converting an expired quotation into a selected procurement unit rate.
// See MR0001 C1 Att.5 and NG/260916-ADV-DAP1 groups D/E.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src"),original=require.extensions[".js"];
for(const ext of [".js",".jsx"])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?
 m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[["@babel/preset-env",{targets:{node:"current"}}],"@babel/preset-react"]}).code,f):original(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const {selectB10ItemizedPurchaseEvidence0553}=from("data/b10ItemizedPurchaseEvidence0553.js");
const {selectSpareCustomerSchedule0553}=from("data/spareCustomerSchedule0553.js");
const {selectBcTurnkeyWorkingCost0553}=from("data/bcTurnkeyWorkingCost0553.js");
const {selectScopePartBcWorking0553}=from("data/scopePartBcReadModel0553.js");
const {buildReleaseCommercialModel0553}=from("data/releaseCommercialModel0553.js");
const {buildOfficialUsdRelease0553}=from("data/officialUsdRelease0553.js");
const supplier=from("data/quotes/NG-260916-ADV-DAP1.full.json");
const x=selectB10ItemizedPurchaseEvidence0553();
const schedule=selectSpareCustomerSchedule0553();
const working=selectBcTurnkeyWorkingCost0553();
const scope=selectScopePartBcWorking0553();
const release=buildReleaseCommercialModel0553({thbPerUsd:31.5});
const official=buildOfficialUsdRelease0553(release);
assert.equal(x.supplierRows.length,16);
assert.equal(x.supplierQuotedCount,14);
assert.equal(x.supplierUnpricedCount,2);
assert.equal(x.quotedSpareGroupUSD,28819.71);
assert.equal(x.proposedB10AccessoryLines.length,6);
assert.equal(x.proposedB10AccessoriesUSD,6038.92);
assert.equal(x.capitalRadioCandidateUSD,7168.96);
assert.equal(x.softwareAndWarrantyUSD,15611.83);
assert.equal(x.physicalComponentCandidateCount,8);
assert.equal(x.hardwareQuoteUSD,13207.88);
assert(x.proposedB10AccessoryLines.every(r=>r.physicalPurchaseCandidate&&r.sourceOwner==="EVIDENCE_ONLY_NONPOSTING"));
assert.equal(x.quotedSpareGroupTHB,907820.87);
assert.equal(x.originalB10WorkingSellTHB,509827.5);
assert.equal(x.originalB10ReferenceCostTHB,392175);
assert(x.costComparisonExceedsEnvelope);
assert.equal(x.sourceQuote,"NG/260916-ADV-DAP1");
assert.equal(x.legacyCandidates.length,9);
assert.equal(x.requirementArticleRows.length,14);
assert.deepEqual([...new Set(x.requirementArticleRows.map(a=>a.parentB10PriceId))],
 ["B10-PTTEP-01","B10-PTTEP-02","B10-PTTEP-03","B10-PTTEP-04"]);
for(const article of x.requirementArticleRows){
 assert.equal(article.approvedPurchaseQty,null);
 assert.equal(article.exactSpareSku,null);
 assert.equal(article.approvedSupplierUnitCostTHB,null);
 assert.equal(article.workingSellAttributionTHB,null);
 assert.equal(article.postingAllowed,false);
 assert.equal(article.releaseAllowed,false);
 assert(article.actualInstalledTagCandidates.every(z=>/^(ZWP|ZPQ)\S* \/ [A-Z]+-\d{3}-\d{3}/.test(z)));
}
assert.deepEqual(x.budgetEnvelopeRows.map(z=>z.contractKitCount),[4,3,4,3]);
assert.deepEqual(x.unquotedOtherMrCodes,["MR-0002","MR-0003","MR-0004"]);
assert.equal(new Set(x.supplierRows.map(z=>z.id)).size,16);
assert.equal(new Set(x.supplierRows.map(z=>z.sourceQuoteLine)).size,16);
for(const a of x.supplierRows){
 const q=supplier.lines.find(z=>z.code===a.sourceQuoteLine);
 assert(q);
 assert.equal(q.partNumber,a.proposedSku);
 assert.deepEqual(a.matchedBaseEquipmentQuoteLines,supplier.lines.filter(y=>
  !["D","E"].includes(y.group)&&y.partNumber===q.partNumber).map(y=>y.code));

 assert.equal(q.description,a.articleDescription);
 assert.equal(q.qty,a.vendorOfferedQty);
 assert.equal(a.quotedUnitPriceUSD,q.unitPrice);
 assert.equal(a.quotedExtendedUSD,q.quotedTotal);
 assert.equal(a.requiredSpareQty,null);
 assert.equal(a.selectedPurchaseQty,null);
 assert.equal(a.customerUnitSellTHB,null);
 assert.equal(a.verifiedDirectCostTHB,null);
 assert.equal(a.sourceOwner,"EVIDENCE_ONLY_NONPOSTING");
 assert.equal(a.countedInB10WorkingSell,false);
 assert.equal(a.countedInA1,false);
 assert.equal(a.countedInC1,false);
 assert.equal(a.countedInC2,false);
 assert.equal(a.releaseAllowed,false);
 assert(a.candidateInstalledSiteTags.every(z=>/^(ZWP|ZPQ)\S* \/ [A-Z]+-\d{3}-\d{3}/.test(z)));
 assert.equal(a.installedTagRelation,"FUNCTIONAL_CANDIDATE_ONLY__NO_VENDOR_INTERCHANGEABILITY_PROOF");
 if(a.sourceQuoteLine==="D-4"||a.sourceQuoteLine==="E-4"){
  assert.equal(a.quotedUnitPriceUSD,null);
  assert.equal(a.referenceUnitTHB,null);
 }else{
  assert(Number.isFinite(a.quotedUnitPriceUSD));
  assert.equal(a.referenceUnitTHB,Math.round((a.quotedUnitPriceUSD*31.5+Number.EPSILON)*100)/100);
 }
}
const ids=z=>z.supplierRows.map(i=>i.id);
assert.deepEqual(ids(x),ids(working.byCode.B10.b10ItemizedPurchaseEvidence));
assert.deepEqual(ids(x),ids(scope.lines.B10.b10ItemizedPurchaseEvidence));
assert.deepEqual(ids(x),ids(release.b.find(z=>z.code==="B10").b10ItemizedPurchaseEvidence));
assert.equal(x.quotedSpareGroupUSD,release.b.find(z=>z.code==="B10").b10ItemizedPurchaseEvidence.quotedSpareGroupUSD);
assert.equal(working.byCode.B10.workingSellTHB,509827.5);
assert.equal(scope.lines.B10.workingSellTHB,509827.5);
assert.equal(release.b.find(z=>z.code==="B10").customerSellTHB,509827.5);
assert.equal(schedule.currentBudgetaryByCode.B10,509827.5);
assert.equal(working.knownWorkingSellTHB,5782287.13);
assert.equal(release.annex.B10.length,4);
assert.equal(release.annexTraceAudit.totalRows,16);
assert.equal(release.annexModels.B10.annexLineTotalTHB,509827.5);
assert.equal(official.b.find(z=>z.code==="B10").amountUSD,16200);
assert.equal(official.annex.B10.length,4);
assert.equal(Math.round(official.annex.B10.reduce((v,r)=>v+r.totalUSD,0)*100),1620000);
assert(!("b10ItemizedPurchaseEvidence" in official));
assert.equal(release.approval.releaseAllowed,false);
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const {B10ItemizedPurchasingEvidence0553}=from("B10ItemizedPurchasingEvidence0553.jsx");
const ui=renderToStaticMarkup(React.createElement(B10ItemizedPurchasingEvidence0553,{evidence:x,context:"working"}));
for(const q of x.supplierRows)assert(ui.includes(q.proposedSku),q.sourceQuoteLine+" missing from Working UI");
assert.equal((ui.match(/data-b10-requirement-id=/g)||[]).length,14);
assert.equal((ui.match(/data-b10-source-id=/g)||[]).length,16);
assert(ui.includes("B10 purchase Qty"));
assert(ui.includes("NO QUOTED PRICE"));
assert(ui.includes("NO — itemized OEM SPIR still required"));
const detail=fs.readFileSync(path.join(root,"project0553/ScopeBcAnnexDetail0553.jsx"),"utf8");
const preview=fs.readFileSync(path.join(root,"project0553/ReleaseCustomerWorkbook0553.jsx"),"utf8");
const officialUi=fs.readFileSync(path.join(root,"project0553/OfficialUsdRelease0553.jsx"),"utf8");
assert(detail.includes("<B10ItemizedPurchasingEvidence0553"));
assert(!preview.includes('internal&&code==="B10"&&<B10ItemizedPurchasingEvidence0553'));
assert(preview.includes('code==="B10"?<B10KitPriceSummary0553'));
assert(detail.includes('<B10ItemizedPurchasingEvidence0553'));
assert(!officialUi.includes("B10ItemizedPurchasingEvidence0553"));
assert(working.byCode.B10.directCostTHB===null);
console.log("PASS 0553 B10 itemized evidence: 16 source quote SKU IDs, 14 rates/2 dashes, TAG applicability candidate only, Source→Working→Scope→Internal Release, unchanged 14 kits/THB 509,827.50 and USD 16,200 official envelope, no duplicate posting");
