// PJ2608-0553 10.2 -> 10.5 price display and detailed B/C audit.
// Historical Rev08 records remain audit-only; approved budgetary Working SELL is owned by 10.2. No direct COST or customer-released price is inferred.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src");
const original=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const t=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(t.code,file);
 }else original(mod,file);
};
const from=p=>require(path.join(root,"project0553",p));
const {selectScopeBcPriceAudit0553,SCOPE_BC_DETAIL_CODES_0553,buildScopeBcModuleNavigator0553}=from("data/scopeBcPriceAudit0553.js");
const {selectBcTurnkeyWorkingCost0553}=from("data/bcTurnkeyWorkingCost0553.js");
const {REV08_BASELINE}=from("data/rev08CommercialBaseline.js");
const codes=["B10","B11","B13","B14","C1","C2"],listLength={B10:9,B11:4,B13:4,B14:0,C1:2,C2:12};
const expectedUSD={B10:3905.5355,B11:4073.4637,B13:713.7845,B14:8333.3333,C1:128550.7734,C2:22914.4979};
const sourceSnapshot=JSON.stringify(REV08_BASELINE),bcSnapshot=JSON.stringify(selectBcTurnkeyWorkingCost0553());
const p=selectScopeBcPriceAudit0553({thbPerUsd:31.5}),bc=selectBcTurnkeyWorkingCost0553();
assert.deepEqual(SCOPE_BC_DETAIL_CODES_0553,codes);
assert.equal(p.moduleId,"bid.budget.scope");
assert.equal(p.rows.length,6);
assert.equal(p.costComplete,false);assert.equal(p.releaseAllowed,false);
assert.equal(p.sourceModuleId,"bid.budget.working.bc");
for(const code of codes){
 const a=p.byCode[code],b=bc.byCode[code],s=REV08_BASELINE.summary.find(x=>x[0]===code);
 assert.equal(a.moduleId,"bid.budget.scope."+code.toLowerCase());
 assert.equal(a.ownerModuleId,b.moduleId);
 assert.equal(a.directCostTHB,b.directCostTHB);
 assert.equal(a.workingSellTHB,b.workingSellTHB);
 assert.equal(a.commercialSellTHB,b.commercialSellTHB);
 assert.equal(a.directCostTHB,null,"No Rev08 amount may be posted as current cost "+code);
 // Working SELL budget approvals in 10.2 are distinct from historical source
 // and do not constitute direct COST or customer-released quotation.
 const budgetSell={B10:509827.5,B11:157657.5,B13:46683,C1:null,C2:null};
 if(Object.hasOwn(budgetSell,code)){
  assert.equal(a.workingSellTHB,budgetSell[code],code+" approved pre-award budgetary working sell");
  assert.equal(b.unifiedSpareBudget?.pricingClass,code.startsWith("C")?"OPTIONAL_OEM_QUOTE_NOT_ESTABLISHED":"UNQUOTED_2026_PARAMETRIC_WORKING_SELL");
  assert.equal(b.unifiedSpareBudget?.verifiedDirectCost,false);
  assert.equal(b.unifiedSpareBudget?.releaseAllowed,false);
  if(code==="B11"){
   assert.equal(b.b11VendorFollowup?.status,"UNQUOTED_PARAMETRIC_2026_TOOL_REVIEW");
   assert.equal(b.b11VendorFollowup?.amountTHB,157657.5);
   assert.equal(b.b11VendorFollowup?.verifiedDirectCost,false);
   assert.equal(b.b11VendorFollowup?.releaseAllowed,false);
   assert.equal(a.directCostTHB,null,"B11 OEM tool quotation/inclusion not yet verified");
   assert.equal(a.commercialSellTHB,null,"B11 budget approval does not release customer price");
  }
 }else assert.equal(a.workingSellTHB,null,"No selected current Working Sell "+code);
 assert.equal(a.historicalReferenceUSD,s[2]);
 assert.equal(a.historicalReferenceUSD,expectedUSD[code]);
 assert.equal(a.historicalReferenceTHB,Math.round((expectedUSD[code]*31.5+Number.EPSILON)*100)/100);
 assert.equal(a.historicalDetailLines.length,listLength[code]);
 assert.equal(a.optional,code.startsWith("C"));
 assert.equal(a.releaseAllowed,false);
 assert.deepEqual(a.currentRequirementRows,b.requirementRows);
 assert.deepEqual(a.currentVerificationSteps,b.costEvidence.stages);
 assert.deepEqual(a.currentCostGaps,b.costEvidence.requiredInputs);
 for(const line of a.historicalDetailLines){
  assert.equal(line.sourceClass,"HISTORICAL_PRICE_REFERENCE_ONLY");
  assert.equal(line.costPostingAllowed,false);
  assert.equal(line.currentVendorSku,null);
  assert.equal(line.verifiedUnitCostTHB,null);
  assert.equal(line.verifiedRequiredQty,null);
  assert.equal(line.historicalExtendedTHB,Math.round((line.historicalExtendedUSD*31.5+Number.EPSILON)*100)/100);
 }
 if(code!=="B14"){
  assert(a.historicalHasDetail);
  assert(a.historicalReconciled,"Historical item totals must reconcile within USD 0.01: "+code);
  assert(Math.abs(a.historicalDetailUSD-a.historicalReferenceUSD)<=0.01);
 }else{
  assert.equal(a.historicalHasDetail,false);
  assert.equal(a.historicalReconciled,false);
  assert.equal(a.summaryPriceOnly,true);
  assert.equal(a.historicalDetailUSD,null);
 }
}
// Preserve residual rounding from Rev08, do not invent a balancing vendor cost.
assert.equal(p.byCode.B10.historicalDisplayedVsSummaryDeltaTHB,-0.02);
assert.equal(p.byCode.B11.historicalDisplayedVsSummaryDeltaTHB,0);
assert.equal(p.byCode.B13.historicalDisplayedVsSummaryDeltaTHB,-0.04);
assert.equal(p.byCode.B14.historicalDisplayedVsSummaryDeltaTHB,null);
assert.equal(p.byCode.C1.historicalDisplayedVsSummaryDeltaTHB,0);
assert.equal(p.byCode.C2.historicalDisplayedVsSummaryDeltaTHB,-0.08);
assert.equal(p.byCode.C2.historicalReconciliationDeltaUSD,-0.0025);
assert.equal(p.byCode.B10.currentRequirementCount,bc.byCode.B10.requirementCount);
assert.equal(p.byCode.C1.currentRequirementCount,bc.byCode.C1.requirementCount);
assert.equal(p.byCode.C2.currentRequirementCount,0,"Do not map old capital-spares C2 as 2-year options");
assert.equal(p.byCode.B11.currentRequirementCount,0,"Do not invent OEM tools list");
assert.equal(p.byCode.B13.currentRequirementCount,0,"Do not invent consumables inventory");
assert.equal(p.byCode.B14.currentRequirementCount,0,"No invented insurance detail");
assert.equal(selectScopeBcPriceAudit0553().byCode.C1.historicalReferenceTHB,null,
 "No implicit current FX from dated historical reference");
const nav=buildScopeBcModuleNavigator0553();
assert.equal(nav.length,7);
assert.equal(nav[0].id,"bid.budget.scope");
assert.deepEqual(nav.slice(1).map(x=>x.id),codes.map(c=>"bid.budget.scope."+c.toLowerCase()));
assert(nav.every(x=>x.tab==="budget"&&x.anchorModuleId===x.id));
assert.equal(JSON.stringify(REV08_BASELINE),sourceSnapshot,"Historical Rev08 source mutated");
assert.equal(JSON.stringify(selectBcTurnkeyWorkingCost0553()),bcSnapshot,"10.2 canonical working ledger mutated");
const ui=fs.readFileSync(path.join(root,"project0553/ScopeSheetsDetail0553.jsx"),"utf8");
const detail=fs.readFileSync(path.join(root,"project0553/ScopeBcAnnexDetail0553.jsx"),"utf8");
const page=fs.readFileSync(path.join(root,"pages/PJ26080553.jsx"),"utf8");
const work=fs.readFileSync(path.join(root,"project0553/CommercialWorkspace.jsx"),"utf8");
for(const snippet of ['selectScopeBcPriceAudit0553({thbPerUsd:fx?.thbPerUsd})',
 'SCOPE_BC_DETAIL_CODES_0553','<ScopeBcAnnexDetail0553 code={category[1]} fx={fx} onOpenReleaseRow={onOpenReleaseRow} onOpenSource={onOpenSource}/>',
 'Historical Rev08 Reference THB','data-component-key="bid.budget.scope"','setSheet(found[0])'])
 assert(ui.includes(snippet),"10.5 Scope display missing source-backed prices or navigation: "+snippet);
for(const snippet of ['data-component-key={moduleId}','p.historicalDetailLines.map(',
 'p.currentDerivationLines.map(','p.currentRequirementRows.map(','p.currentVerificationSteps.map(',
 'p.historicalReferenceTHB','p.historicalDisplayedVsSummaryDeltaTHB','x.historicalUnitTHB','x.historicalExtendedTHB','NO ITEMIZED REV08 ANNEX',
 'NOT VERIFIED / NOT POSTED'])
 assert(detail.includes(snippet),"10.5 child price audit missing: "+snippet);
// 10.5 must use the same dated FX-controlled historical THB read projection;
 // unconverted Rev08 USD remains accessible as an explicit 10.2-only source note.
assert(!detail.includes("<td>{usd(x.historicalUnitUSD)}</td>"),"Current 10.5 screen must show THB not raw USD price columns");
assert(detail.includes("<th>Historical unit THB *</th>")&&detail.includes("<th>Historical extended THB *</th>"),
 "Current 10.5 historical evidence columns must be THB labelled");
assert(detail.includes("x.historicalUnitUSD*p.historicalFxTHBPerUSD")&&
 detail.includes("x.historicalTotalUSD*p.historicalFxTHBPerUSD"),
 "Historical source USD must convert using the visible FX reference; never treat raw USD as THB");
assert(detail.includes("inWorking&&<small>Original: {usd(x.historicalUnitUSD)}</small>"),
 "Original USD should be preserved only in 10.2 Working source review");
assert(detail.includes("inWorking&&(customerSchedule.sparePriceEvidence.directComparablesByCode"),
 "Direct installed-equipment quote currency and supplier evidence belongs to 10.2 Working, not 10.5");
assert(page.includes('...buildScopeBcModuleNavigator0553()'));
assert(work.includes('navigationTarget={navigationTarget} navigationSequence={navigationSequence}'));
assert(!ui.includes('const shownAmount=hasChild?childAmount:amount'),
 "Scope may not silently post Rev08 sheet total as working cost");
for(const file of ["project0553/ScopeSheetsDetail0553.jsx","project0553/ScopeBcAnnexDetail0553.jsx","project0553/CommercialWorkspace.jsx","pages/PJ26080553.jsx"]){
 const compiled=babel.transformSync(fs.readFileSync(path.join(root,file),"utf8"),{
  babelrc:false,configFile:false,presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]
 }).code;
 assert(compiled?.length>0,"JSX compile failed "+file);
}
console.log("PASS 0553 10.2->10.5 Scope B10/B11/B13/B14/C1/C2: B11 THB157657.50 selected budgetary WORKING SELL (not verified Direct Cost, not released quote); 6 Rev08 historical references, 31 child rows, B14 unpriced, current-owner trace and Module ID links.");
