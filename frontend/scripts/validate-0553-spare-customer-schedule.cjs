// PJ2608-0553: five-category customer-facing pre-award spare/tool/consumable schedule
// must reuse source tag/BOM, keep commercial history segregated and guard
// RFI BDA / WAROM exact parent-package ownership against additive pricing.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src");
const before=require.extensions[".js"];
require.extensions[".js"]=(m,file)=>{
 if(file.startsWith(root+path.sep)){
  const x=babel.transformFileSync(file,{babelrc:false,configFile:false,sourceMaps:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  m._compile(x.code,file);
 }else before(m,file);
};
const from=p=>require(path.join(root,"project0553",p));
const {selectSpareCustomerSchedule0553}=from("data/spareCustomerSchedule0553.js");
const {selectSpareCoverageEngineering0553}=from("data/spareCoverageEngineering0553.js");
const {selectSpareEngineeringReconciliation0553}=from("data/spareEngineeringReconciliation0553.js");
const {selectBcTurnkeyWorkingCost0553}=from("data/bcTurnkeyWorkingCost0553.js");
const {REV08_BASELINE}=from("data/rev08CommercialBaseline.js");
const {buildReleaseCommercialModel0553}=from("data/releaseCommercialModel0553.js");
const {MR0002_WORKING_BOM_0553}=from("data/mr0002WorkingBom0553.js");
const x=selectSpareCustomerSchedule0553(),cov=selectSpareCoverageEngineering0553(),bc=selectBcTurnkeyWorkingCost0553();
const codes=["B10","B11","B13","C1","C2"];
assert.deepEqual(x.codes,codes);
assert.deepEqual(cov.categoryCodes,codes);
assert.equal(x.rows.length,31);
assert.equal(x.b11Requirements.rows.length,5,"EXA-A8 minimum Phase 1F telecom tools missing");
assert(x.b11Requirements.rows.some(r=>r.description.includes("TETRA voice gateway")&&r.compatibilityGate.includes("TETRA_GATEWAY_SCOPE_VS_SELECTED_DMR")),"Never silently equate TETRA gateway with selected DMR");
assert(x.b11Requirements.rows.every(r=>r.qty===1&&r.budgetAllocationTHB===null&&!r.pricePostingAllowed));
assert.equal(new Set(x.rows.map(r=>r.id)).size,x.rows.length);
const counts={B10:9,B11:4,B13:4,C1:2,C2:12};
for(const code of codes){
 assert.equal(x.byCode[code].length,counts[code]);
 const rev=REV08_BASELINE.detail[code];
 assert.equal(rev.length,counts[code]);
 assert.equal(x.summary[code].lineCount,counts[code]);
 assert.equal(x.summary[code].options,code.startsWith("C"));
 for(const r of x.byCode[code]){
  assert(r.tagNo&&r.description&&r.detailSpecification&&r.materials);
  assert(Number.isInteger(r.qty)&&r.qty>0);
  assert(Number.isFinite(r.unitPriceTHB)&&Number.isFinite(r.extendedTHB));
  assert.equal(r.costOwner,code);
  assert.equal(r.customerReleaseAllowed,false);
  assert(r.mappingStatus&&r.sourceId);
  for(const key of r.installedTagKeys)assert(cov.installed.some(z=>z.key===key),"Unmatched installed tag "+key);
 }
 assert(Math.abs(x.summary[code].deltaFromDisplayedRoundedLinesTHB)<=0.12);
}
// Plain-English table contract: item/purpose/spec/materials must explain the scope,
// while ALL 31 raw TAG/source and Qty × Unit Price amounts remain intact.
for(const r of x.rows){
 assert.equal(r.originalDescription,r.description,"Loss of raw Rev08 description "+r.id);
 assert(r.displayDescription&&r.displayDescription.length>4,"Plain item name missing "+r.id);
 assert(r.displayPurpose&&r.displaySpecification&&r.explanationTH,"Missing explanation "+r.id);
 assert(r.displayMaterials.includes("TBC"),"Do not invent physical material "+r.id);
 assert.equal(r.materialVerified,false);
 assert.equal(r.oemSpareSkuVerified,false);
 assert.equal(r.commonSpareInterchangeabilityVerified,false);
 assert.equal(r.relatedTagList.length,r.relatedEquipmentTagCount);
 assert.equal(r.relatedSiteTagCount,r.installedTagKeys.length);
 if(r.relatedEquipmentTagCount>1)
  assert(r.tagSummary.includes("related equipment TAGs"),"TAG summary missing "+r.id);
}
for(const code of ["B10","C2"]){
 for(const item of x.byCode[code].filter(r=>/poe|gland|surge/i.test(r.description)))
  assert.notEqual(item.displayDescription,item.description,"Complex spare label must be simplified "+item.id);
}
const release=buildReleaseCommercialModel0553();
assert.equal(release.annexTraceAudit.totalRows,31);
assert.equal(release.annexTraceAudit.sourceToReleasePassed,true);
assert.equal(release.annexTraceAudit.releaseToSourcePassed,true);
assert.equal(release.annexTraceAudit.rowTrace.length,31);
assert(release.annexTraceAudit.rowTrace.every(r=>r.sourceToReleaseMatched&&r.releaseToSourceMatched&&!r.customerReleaseAllowed));
const nativeNames={B10:"B10 CommSpares",B11:"B11 SpecialTool",B13:"B13 Consumerables",
 C1:"C1 CapitalSpares",C2:"C2 2Y-Spares"};
const originIndex=new Map(x.rows.map(row=>[row.id,row]));
for(const code of codes){
 for(const [i,row] of release.annex[code].entries()){
  const original=originIndex.get(row.sourceId);
  assert(original,"Orphan Release Annex line "+row.sourceId);
  assert.equal(row.sourceRowModuleId,original.sourceRowModuleId);
  assert.equal(row.nativeSheet,nativeNames[code]);
  assert.equal(row.nativeRow,6+i);
  assert.deepEqual(row.nativeCells,{tagNo:"C"+(6+i),description:"D"+(6+i),
   specification:"E"+(6+i),materials:"F"+(6+i),qty:"G"+(6+i),
   unitPrice:"H"+(6+i),totalPrice:"I"+(6+i)});
  assert.equal(row.originalDescription,original.description);
  assert.equal(row.tagNo,original.tagNo);
  assert.equal(row.qty,original.qty);
  assert.equal(row.workingTotalTHB,original.extendedTHB);
 }
}
const reverseCheckText=fs.readFileSync(path.join(root,"project0553/nativeWorkingDraft0553.js"),"utf8");
assert(reverseCheckText.includes("RELEASE→SOURCE→NATIVE mismatch"));
assert(reverseCheckText.includes("routeTrace[j].sourceId!==r.sourceId"));
const bcNavigatorText=fs.readFileSync(path.join(root,"project0553/data/bcModuleNavigator0553.js"),"utf8");
assert(bcNavigatorText.includes("selectSpareCustomerSchedule0553"));
assert(bcNavigatorText.includes("id:s.sourceRowModuleId"));

for(const code of codes){
 const source=x.byCode[code],customer=release.annex[code];
 assert.equal(customer.length,source.length);
 for(let i=0;i<source.length;i++){
  assert.equal(customer[i].tagNo,source[i].tagNo,"Never lose original linked TAG identity");
  assert.equal(customer[i].tagSummary,source[i].tagSummary);
  assert.deepEqual(customer[i].relatedTagList,source[i].relatedTagList);
  assert.equal(customer[i].description,source[i].displayDescription);
  assert.deepEqual(customer[i].engineeringVerification,source[i].engineeringVerification,
   "Source→Release must preserve existing OEM evidence and risk on all 31 spare lines");
  assert.equal(customer[i].actualOemSpareSku,null);
  assert.equal(customer[i].engineeringProofComplete,false);
  assert.equal(customer[i].specification,source[i].displaySpecification);
  assert.equal(customer[i].materials,source[i].displayMaterials);
  assert.equal(customer[i].workingTotalTHB,source[i].extendedTHB,"No price change on reword");
 }
}
const workbookUI=fs.readFileSync(path.join(root,"project0553/ReleaseCustomerWorkbook0553.jsx"),"utf8");
const scopeUI=fs.readFileSync(path.join(root,"project0553/ScopeBcAnnexDetail0553.jsx"),"utf8");
for(const jsx of [workbookUI,scopeUI]){
 assert(jsx.includes("p553-annex-tag-list"),"TAG Expand/Collapse not rendered");
 assert(jsx.includes("tagSummary"),"Concise TAG summary not rendered");
}
assert(workbookUI.includes("r?.purpose")&&workbookUI.includes("p553-annex-materials"));
assert(workbookUI.includes("p553-annex-description")&&workbookUI.includes("p553-annex-specification"));
assert(workbookUI.includes("p553-annex-qty")&&workbookUI.includes("r?.unit"));
assert(workbookUI.includes("p553-annex-tag-chip")&&scopeUI.includes("p553-annex-tag-chip"));
const releaseCss=fs.readFileSync(path.join(root,"project0553/releaseWorkbook0553.css"),"utf8");
const projectCss=fs.readFileSync(path.join(root,"project0553/project0553.css"),"utf8");
assert(releaseCss.includes(".p553-customer-table.p553-annex-table{min-width:1440px}"));
assert(projectCss.includes(".p553-annex-tag-chip"));
assert(scopeUI.includes("x.displayDescription")&&scopeUI.includes("x.displayMaterials"));
assert(scopeUI.includes("inWorking?x.sourceRowModuleId"));
assert(workbookUI.includes("item.sourceRowModuleId||item.sourceModuleId"));
assert(scopeUI.includes("onOpenReleaseRow({code,sourceId:x.id,sourceRowModuleId:x.sourceRowModuleId})"),"Source→Release row link missing");
assert(scopeUI.includes('p553-c1-historical-source-trace'),"C1 historical source rows must remain reverse-traceable, nonposting");
assert(workbookUI.includes('focusAnnexTarget'),"Source→Release must select exact customer tab");
assert(workbookUI.includes('focusAnnexTarget.sourceId.toLowerCase()'),"Source→Release must highlight exact Annex row");
const workspaceUI=fs.readFileSync(path.join(root,"project0553/CommercialWorkspace.jsx"),"utf8");
assert(workspaceUI.includes('onOpenReleaseRow={openReleaseAnnexRow}'));
assert(workspaceUI.includes('focusAnnexTarget={releaseAnnexTarget}'));

// Complete 31-line PRE-AWARD engineering review (not fictitious OEM validation).
const eng=selectSpareEngineeringReconciliation0553();
assert.equal(eng.verificationRows.length,31);
assert.equal(new Set(eng.verificationRows.map(v=>v.id)).size,31);
assert(eng.vendorClarificationReady&&!eng.physicalSpirComplete);
assert.equal(eng.verifiedSpareRows,undefined);
assert(eng.verificationRows.every(v=>v.sourceRowModuleId&&v.requiredVendorAnswer&&
 v.technicalGap&&v.verifiedSpareSku===null&&v.verifiedDirectCostTHB===null&&
 v.verifiedQuantity===null&&!v.pricePosted&&!v.customerReleaseAllowed));
assert.equal(eng.includedVendorKits.length,2);
assert(eng.includedVendorKits[0].included===true&&eng.includedVendorKits[0].affects==="B11-REV08-01");
assert(eng.priorityRows.some(v=>v.id==="B11-REV08-01"));
assert(eng.priorityRows.some(v=>v.id==="C1-REV08-02"&&v.installedCandidateSku.includes("Tideland")));
assert(eng.priorityRows.some(v=>v.id==="C2-REV08-09"&&v.technicalGap.includes("1/2-inch")));
assert(eng.priorityRows.some(v=>v.id==="C2-REV08-10")===false,"CAT6A row pending, not invent OEM quote");
assert(eng.b10c2Conflicts.length>=5);
for(const v of eng.b10c2Conflicts)assert(v.code==="C2");
assert.equal(eng.kitLines.length,14);
for(const r of x.rows){
 const evidence=r.engineeringVerification;
 assert(evidence&&evidence.action&&evidence.issue);
 assert.equal(evidence.approvedReplacementSku,null);
 assert.equal(evidence.verifiedSpareQty,null);
 assert.equal(evidence.verifiedDirectCostTHB,null);
 assert.equal(evidence.extraPostingAllowed,false);
 assert.equal(r.verifiedSpareSku,null);
 assert.equal(r.verifiedSpareQty,null);
 assert.equal(r.verifiedSpareDirectCostTHB,null);
}
const engineeringUi=fs.readFileSync(path.join(root,"project0553/ScopeBcAnnexDetail0553.jsx"),"utf8");
assert(engineeringUi.includes("spareReconciliation.verificationRows.filter(x=>x.code===code)"));
assert(engineeringUi.includes("MGW Paul email 20-Oct"));
assert(engineeringUi.includes("Attachment 7 instruction 6"));
assert.equal(x.summary.B10.workingReferenceTHB,123024.37);
assert.equal(x.summary.B11.workingReferenceTHB,128314.11);
assert.equal(x.summary.B13.workingReferenceTHB,22484.21);
assert.equal(x.summary.C1.workingReferenceTHB,4049349.36);
assert.equal(x.summary.C2.workingReferenceTHB,721806.68);
assert.equal(bc.byCode.B11.workingSellTHB,128314.11,"Current B11 management budgetary working sell; OEM direct cost and inclusion remain unverified");
for(const code of ["B10","B13","C1","C2"])
 assert.equal(bc.byCode[code].workingSellTHB,x.summary[code].workingReferenceTHB);
assert.equal(bc.knownWorkingSellTHB,4602736.82,"Current Part B Base includes B2 131-WO, MGW Purchased FAT and B9 quoted Base once; Rev08 spare lines remain audit");
assert.equal(x.riskCandidates.length,1);
assert(x.crossCategoryDuplicates.some(z=>z.family==="SCADA_POE"&&z.categories.includes("B10")&&z.categories.includes("C2")),"B10-C2 PoE overlap must be flagged for stock-quantity reconciliation");
assert(x.byCode.B13.every(r=>r.activityBasedQuantityEquation==="SPQ-003"&&r.activityBasedQuantityState==="OPEN_INPUT"),"B13 must not claim evidence-based activity consumption from old spreadsheet");
const risk=x.riskCandidates[0],src=MR0002_WORKING_BOM_0553.sites.find(s=>s.site==="ZWP20").items.find(r=>r.id==="ZWP20-RFI-BDA");
// ZWP20 is the only site where BDA is the -002 enclosure and RF surge -001.
assert.equal(src.tag,"TCAB-508-002");
assert.equal(risk.tagNo,src.tag);
assert.equal(risk.sourceUnitUSD,31474);
for(const [wp,expectedBda,expectedSurge] of [
 ["ZWP20","TCAB-508-002","TCAB-508-001"],
 ["ZWP21","TCAB-508-001","TCAB-508-002"],
 ["ZWP22","TCAB-508-001","TCAB-508-002"]
]){
 const selected=MR0002_WORKING_BOM_0553.sites.find(x=>x.site===wp);
 assert(selected,"No selected MR0002 site "+wp);
 assert.equal(selected.selectedBdaTag,expectedBda);
 assert.equal(selected.referenceSurgeTag,expectedSurge);
 assert.equal(selected.items.find(x=>x.id===wp+"-RFI-BDA").tag,expectedBda);
 assert.equal(selected.items.find(x=>x.id===wp+"-RFI-BDA").unitCost,31474);
}
assert.equal(risk.originalBOM.find(x=>x.id==="ZWP20-RFI-BDA").tag,src.tag);
assert(!risk.warnings.some(x=>x.includes("selected TCAB-508-001 RFI-BDA")));
assert.equal(risk.moduleId,"bid.budget.bom.mr0002.zwp20.zwp20-rfi-bda.evidence");
assert.equal(risk.sourceUnitUSD,src.unitCost);
assert.equal(risk.sourceQuoteLine,src.quoteLine);
assert.equal(risk.qty,1,"One risk replacement pool scenario, not 3 distributed vendor shipments");
assert.equal(risk.comparativeAmountTHB,991431);
assert.equal(risk.notionalRiskScenarioOnly,true);
assert(risk.originalBOM.some(r=>r.id==="ZWP20-RFI-BDA"&&r.referenceExtendedTHB===991431));
assert(risk.originalBOM.some(r=>r.id==="ZWP20-RFI-BDA-EXD-ENCLOSURE"&&r.nonAdditive&&r.priceInclusion==="INCLUDED_IN_MGW_R2_UHF1"));
assert(risk.originalBOM.some(r=>r.id==="ZWP20-BDA-RF-FEEDTHROUGHS"&&r.referenceUnitTHB===null),"Unknown Ex RF penetration costs must remain unresolved");
assert.equal(risk.includedInWorkingSell,false);
assert.equal(risk.additionalCostPostedTHB,null);
assert.equal(x.riskQuestionAnswered,false,"Risk question cannot be declared solved before spare SKU/quantity validation");
assert.equal(x.releaseAllowed,false);
const view=fs.readFileSync(path.join(root,"project0553/ScopeBcAnnexDetail0553.jsx"),"utf8");
assert(view.includes("selectSpareCustomerSchedule0553")&&view.includes("customerSchedule.riskCandidates.map"));
assert(view.includes("SUPPLIER RECOMMENDATION FOR SPECIAL TOOLS")&&view.includes("customerSchedule.summary.B11.workingReferenceTHB"),"B11 customer format must show four priced tool lines and THB total");
assert(view.includes('colSpan={7}')&&view.includes('code==="B11"&&<tfoot>'),"B11 price footer must use original customer schedule columns");
for(const phrase of ["Tag No.","Unit Price THB","Total Price THB","Lead Time ARO"]){
 assert(view.includes(phrase),"Missing customer table column: "+phrase);
}
assert(babel.transformSync(view,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code.length);
console.log("PASS 0553 5-category customer schedule: 31 Rev08 lines; actual MR-installed-tag candidate links; B11 tools; RFI BDA USD 31,474 / THB 991,431 non-additive risk; base + C options unchanged.");
