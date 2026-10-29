// 0553: current PTTEP spare estimate inside EXISTING B10/B11/B13/C1/C2 owners.
// A DOCUMENT-VERIFIED requirement does not imply OEM price/parts certification.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src");
const original=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const out=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
  mod._compile(out.code,file);
 }else original(mod,file);
};
require.extensions[".jsx"]=require.extensions[".js"];
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const {selectSpareCustomerSchedule0553}=from("data/spareCustomerSchedule0553.js");
const {selectDocumentSpareObligations0553}=from("data/documentSpareObligations0553.js");
const {selectBcTurnkeyWorkingCost0553}=from("data/bcTurnkeyWorkingCost0553.js");
const {selectScopePartBcWorking0553}=from("data/scopePartBcReadModel0553.js");
const {buildReleaseCommercialModel0553,auditAnnexBidirectionalTrace0553}=from("data/releaseCommercialModel0553.js");
const {auditCurrentCustomerProjection0553}=from("estimateToBidMapping.js");
const costs=selectSpareCustomerSchedule0553(),docs=selectDocumentSpareObligations0553();
const bc=selectBcTurnkeyWorkingCost0553(),scope=selectScopePartBcWorking0553(),rel=buildReleaseCommercialModel0553({thbPerUsd:31.5});
const codes=["B10","B11","B13","C1","C2"];
const expected={B10:509827.5,B11:157657.5,B13:46683,C1:null,C2:null};
assert.equal(docs.totals.commissioningKitSets,14);
assert.deepEqual(docs.rows.map(x=>x.commissioningKitQuantity),[4,3,4,3]);
assert.deepEqual(codes.map(x=>costs.currentByCode[x].length),[4,4,3,1,4]);
assert.equal(costs.currentRows.length,16);
assert.equal(new Set(costs.currentRows.map(x=>x.id)).size,16);
assert(costs.currentRows.every(x=>!x.customerReleaseAllowed));
assert.equal(costs.currentBudgetaryPricingFactor,1.30);
assert.equal(costs.currentWorkingFxTHBPerUSD,31.5);
assert.equal(costs.currentRows.filter(x=>x.code==="B10").reduce((n,x)=>n+x.qty,0),14);
assert.equal(costs.b11Requirements.rows.length,5);
assert(costs.b11Requirements.rows.some(x=>x.compatibilityGate.includes("TETRA_GATEWAY_SCOPE_VS_SELECTED_DMR")));
assert(costs.currentByCode.C1[0].sourcePriceUSD===null);
assert.equal(costs.currentByCode.C1[0].internalInstalledComparableUnitUSD,75000);
assert(costs.currentByCode.C2.every(x=>x.qty===null&&x.unitPriceTHB===null));
for(const code of codes){
 const owner=bc.byCode[code],working=costs.currentBudgetaryByCode[code],sow=scope.lines[code];
 assert.equal(owner.moduleId,"bid.budget.working.bc."+code.toLowerCase());
 assert.equal(owner.workingSellTHB,expected[code]);
 assert.equal(working,expected[code]);
 assert.equal(sow.sourceModuleId,owner.moduleId);
 assert.equal(sow.workingSellTHB,owner.workingSellTHB);
 assert.equal(owner.directCostTHB,null,"No OEM-confirmed internal direct cost for "+code);
 assert.equal(owner.unifiedSpareBudget.verifiedDirectCost,false);
 assert.equal(owner.unifiedSpareBudget.releaseAllowed,false);
 const projected=rel.annex[code],source=costs.currentByCode[code];
 assert.equal(projected.length,source.length,code+" one-way source count");
 for(let i=0;i<source.length;i++){
  assert.equal(projected[i].sourceId,source[i].id);
  assert.equal(projected[i].traceId,source[i].traceId);
  assert.equal(projected[i].sourceRowModuleId,source[i].sourceRowModuleId);
  assert.equal(projected[i].qty,source[i].qty);
  assert.equal(projected[i].workingTotalTHB,source[i].extendedTHB);
  assert.equal(projected[i].customerReleaseAllowed,false);
  assert.equal(source[i].engineeringVerification.sourceId,source[i].id);
  assert.equal(source[i].engineeringVerification.sourceRowModuleId,source[i].sourceRowModuleId);
  assert(source[i].engineeringVerification.evidence&&source[i].engineeringVerification.action);
  assert.equal(source[i].engineeringVerification.approvedReplacementSku,null);
  assert.equal(source[i].engineeringVerification.verifiedSpareQty,null);
  assert.equal(source[i].engineeringVerification.verifiedDirectCostTHB,null);
  assert.equal(source[i].engineeringVerification.extraPostingAllowed,false);
  assert.deepEqual(projected[i].engineeringVerification,source[i].engineeringVerification);
  assert.equal(projected[i].actualOemSpareSku,null);
  assert.equal(projected[i].engineeringProofComplete,false);
  assert(projected[i].nativeRow<=18);
 }
 if(code.startsWith("B")){
  assert.equal(rel.b.find(x=>x.code===code).customerSellTHB,working);
  assert.equal(rel.annexModels[code].selectedWorkingTHB,working);
  assert.equal(rel.annexModels[code].annexLineTotalTHB,working);
  assert(rel.annexModels[code].reconciled);
 }else{
  assert.equal(rel.c.find(x=>x.code===code).customerSellTHB,null);
  assert.equal(rel.annexModels[code].selectedWorkingTHB,code==="C1"?null:null);
 }
}
assert.equal(rel.annexTraceAudit.totalRows,16);
assert.equal(rel.annexTraceAudit.sourceToReleasePassed,true);
assert.equal(rel.annexTraceAudit.releaseToSourcePassed,true);
// Null option parity is valid; zero, missing values and mismatched projections are not.
assert.equal(auditCurrentCustomerProjection0553({canonical:bc,release:rel,scope}).selectedValueParity,true);
for(const value of [0,undefined,1]){
 const wrong=structuredClone(rel);wrong.c[0].workingReferenceTHB=value;
 assert.equal(auditCurrentCustomerProjection0553({canonical:bc,release:wrong,scope}).selectedValueParity,false);
}
for(const patch of [
 {sourceId:"ORPHAN"},{sourceRowModuleId:"bid.budget.working.bc.b11"},
 {qty:99},{workingTotalTHB:0},{customerUnitTHB:0},{workingUnitTHB:0},
 {nativeRow:18},{nativeSheet:"C1 CapitalSpares"},{nativeCells:{}},
 {mr:[]},{sites:[]},{evidenceSource:"unverified replacement"},{customerReleaseAllowed:true},
 {engineeringVerification:null},{engineeringVerification:{approvedReplacementSku:"invented"}},
 {actualOemSpareSku:"invented"},{installedCandidateSku:"invented"},{engineeringProofComplete:true}
]){
 const wrong=structuredClone(rel.annex);Object.assign(wrong.B10[0],patch);
 assert.throws(()=>auditAnnexBidirectionalTrace0553(costs.currentByCode,wrong),/BIDIRECTIONAL/);
}
const duplicate=structuredClone(rel.annex);duplicate.C2[1]=duplicate.C2[0];
assert.throws(()=>auditAnnexBidirectionalTrace0553(costs.currentByCode,duplicate),/BIDIRECTIONAL/);
// Value-preserving serialization must remain valid; object identity is not evidence parity.
assert.equal(auditAnnexBidirectionalTrace0553(costs.currentByCode,structuredClone(rel.annex)).totalRows,16);
assert.equal(bc.knownWorkingSellTHB,5782287.13);
const unchangedOwners={B1:421180,B2:237121.13,B3:2322450,B4:null,B5:311184,
 B6:335584,B7:30000,B8:142550,B9:480550,B12:null,B14:787500};
for(const [code,value] of Object.entries(unchangedOwners)){
 assert.equal(bc.byCode[code].workingSellTHB,value,code+" checkpoint must not change");
 assert.equal(scope.lines[code].workingSellTHB,value);
 assert.equal(rel.b.find(x=>x.code===code).customerSellTHB,value);
}
assert.equal(rel.summary.baseCustomerSellTHB,null,"A+B complete total must not be constructed from partial costs");
assert.equal(rel.approval.releaseAllowed,false);
assert.equal(rel.approval.exportNativeAllowed,false);
const ui=fs.readFileSync(path.join(root,"project0553/ReleaseCustomerWorkbook0553.jsx"),"utf8");
const detail=fs.readFileSync(path.join(root,"project0553/ScopeBcAnnexDetail0553.jsx"),"utf8");
const exportSrc=fs.readFileSync(path.join(root,"project0553/nativeWorkingDraft0553.js"),"utf8");
assert(ui.includes("PTTEP FIRST-PRINCIPLES PARAMETRIC"));
assert(ui.includes('money(provisionalBase)'));
assert(ui.includes("sourceRowModuleId"));
assert(ui.includes('onOpenSource({...source,sourceModuleId:source.sourceRowModuleId||source.sourceModuleId})'),
 "Trace drawer must return to the same source row, with owner fallback only for non-row sources");
assert(detail.includes("customerSchedule.currentByCode"));
assert(detail.includes("onOpenReleaseRow"));
assert(exportSrc.includes('model.sourceCoverage?.aReady===true&&model.sourceCoverage?.bSellReady===true'));
for(const file of ["project0553/ReleaseCustomerWorkbook0553.jsx","project0553/ScopeBcAnnexDetail0553.jsx"]){
 const result=babel.transformFileSync(path.join(root,file),{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 assert(result.code.length>0,"Existing UI JSX does not parse "+file);
}
// Render the existing components: canonical row anchors must occur exactly once,
// including C1 whose historical audit previously reused the current row anchor.
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const Detail=from("ScopeBcAnnexDetail0553.jsx").ScopeBcAnnexDetail0553;
for(const code of codes){
 for(const mode of ["working","scope"]){
  const html=renderToStaticMarkup(React.createElement(Detail,{code,mode,
   onOpenReleaseRow:()=>{},onOpenSource:()=>{}}));
  for(const row of costs.currentByCode[code]){
   const anchor=mode==="working"?row.sourceRowModuleId:"bid.budget.scope."+code.toLowerCase()+".spare-line."+row.id.toLowerCase();
   assert.equal(html.split('data-component-key="'+anchor+'"').length-1,1,"Unique rendered source anchor "+anchor);
  }
  assert(html.includes("10.3 Release"));
  if(code==="B10"&&mode==="scope"){
   assert(html.includes("B10 — Kit price summary / reconciliation"));
   assert(html.includes("509,827.50"));
   assert(!html.includes("B10 — Price-to-Win What-if"));
   assert(!html.includes("B10 — Original Item / Source"));
   assert(!html.includes("bid.budget.working.bc.b10.itemized-purchasing-evidence"));
  }else assert(html.includes("Current row OEM proof — OPEN"));
  if(mode==="scope")assert(html.includes("10.2 Source"));
  if(code.startsWith("C"))assert(html.includes("NOT QUOTED"));
 }
}
const Customer=from("ReleaseCustomerWorkbook0553.jsx").ReleaseCustomerWorkbook0553;
const html=renderToStaticMarkup(React.createElement(Customer,{model:rel}));
for(const amount of ["509,827.50","157,657.50","46,683.00"])assert(html.includes(amount));
assert(html.includes("CONDITIONAL BUDGETARY")&&html.includes("Not quoted; excluded from this offer."));
for(const amount of ["3,071,250.00","721,806.60"])assert(html.includes(amount));
assert.equal((html.match(/data-option-price-status="CONDITIONAL_BUDGETARY_OFFER"/g)||[]).length,2);
assert(html.includes("27,979,839.36")&&html.includes("WORKING DRAFT"));
const Scope=from("ScopeSheetsDetail0553.jsx").ScopeSheetsDetail0553;
const scopeHtml=renderToStaticMarkup(React.createElement(Scope,{fx:{thbPerUsd:31.5},onOpenSource:()=>{},onOpenReleaseRow:()=>{}}));
for(const amount of ["509,827.50","157,657.50","46,683.00"])assert(scopeHtml.includes(amount));
assert(scopeHtml.includes("4 current Annex rows")&&scopeHtml.includes("3 current Annex rows"));
assert(scopeHtml.includes("NOT QUOTED")&&scopeHtml.includes("10.2 Source")&&scopeHtml.includes("10.3 Annex"));
console.log("PASS 0553 existing B10/B11/B13/C1/C2: PTTEP 14 kits, new provisional Working 509827.50/157657.50/46683.00, C option quote HOLD; 16 bidirectional row mappings, no old Rev08 rates, incomplete customer A+B total");
