// PJ2608-0553 · executable pricing arithmetic + JSX/source-route contract checks.
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const base=path.resolve(__dirname,"../src/project0553");
const file=(rel)=>fs.readFileSync(path.join(base,rel),"utf8");
const source=file("data/releaseCommercialModel0553.js");
const isolated=source.replace(/^import .*?;\s*$/gm,"").replace(/\bexport /g,"");
const sandbox={};vm.runInNewContext(isolated+";this.calc={priceAorCFromCost0553,priceBWorkingSell0553,buildPartATagGroupBreakdown0553,buildAnnexWorkingPriceBridge0553};",sandbox);
const ac=sandbox.calc.priceAorCFromCost0553(100);
assert.equal(ac.customerSellTHB,130);
assert.equal(ac.samTelShareTHB,20);
assert.equal(ac.addvalueTargetProfitTHB,5);
assert.equal(ac.omissionReserveTHB,5);
assert.equal(sandbox.calc.priceAorCFromCost0553(null),null);
const b=sandbox.calc.priceBWorkingSell0553(100);
assert.equal(b.customerSellTHB,100);
assert.equal(b.samTelDeductionTHB,5);
assert.equal(b.addvalueReceivableTHB,95);
assert.equal(b.addvalueProfitTHB,null);
assert.equal(sandbox.calc.priceBWorkingSell0553(100,70).addvalueProfitTHB,25);
assert.equal(sandbox.calc.priceBWorkingSell0553(null),null);
assert.match(source,/workingSellTHB.*not.*supplier direct cost|workingSellTHB.*not.*a supplier direct cost/i);
assert.match(source,/DIRECT_COST_NOT_ESTABLISHED__NO_30_PERCENT_ON_WORKING_SELL/);
assert.match(source,/aOverflow=.*>15/);
assert.match(source,/annexOverflow=.*>13/);
// Part A TAG-group reconciliation uses all source rows, not the first 15 template cells.
const samplePartA={
 a:[
  {code:"A1",mr:"MR-0001",description:"SCADA",sourceModuleId:"bid.budget.bom.system-location-mto",
   sourceRows:[
    {site:"ZWP20",tag:"MR-502-001",costTHB:100,customerSellTHB:130},
    {site:"ZWP21",tag:"MR-502-001",costTHB:200,customerSellTHB:260}
   ],previewSellTHB:390,unresolvedCount:2,pricedCount:2,costComplete:false},
  {code:"A2",mr:"MR-0002",description:"Trunk Radio",sourceModuleId:"bid.budget.bom.system-location-mto",
   sourceRows:[{site:"ZWP20",tag:"ANT-508-001",costTHB:50,customerSellTHB:65}],
   previewSellTHB:65,unresolvedCount:0,pricedCount:1,costComplete:true}
 ],
 summary:{aProvisionalCustomerSellTHB:455}
};
const audit=sandbox.calc.buildPartATagGroupBreakdown0553(samplePartA);
assert.equal(audit.groups.length,2);
assert.equal(audit.groups[0].tagGroups[0].family,"MR");
assert.equal(audit.groups[0].tagGroups[0].sites.length,2);
assert.equal(audit.groups[0].tagGroups[0].customerSellTHB,390);
assert.equal(audit.pricedFloorTHB,455);
assert.equal(audit.varianceTHB,0);
assert.equal(audit.reconciliationPassed,true);
assert.equal(audit.incomplete,true);

// CURRENT PTTEP five-category Annex: preserve source-row identity, but never
// convert historical Rev08 spare Qty or unit prices into customer current offer.
const revBox={};
vm.runInNewContext(file("data/rev08CommercialBaseline.js").replace(/\bexport /g,"")+";this.rev=REV08_BASELINE;",revBox);
const round2=n=>Math.round((n+Number.EPSILON)*100)/100;
for(const code of ["B10","B11","B13","C1","C2"]){
 const detail=revBox.rev.detail[code];
 const original=revBox.rev.summary.find(x=>x[0]===code)[2];
 const parent=round2(original*31.5);
 const rows=detail.map(([description,qty,usd],index)=>({
  id:code+"-REV08-"+String(index+1).padStart(2,"0"),
  sourceId:code+"-REV08-"+String(index+1).padStart(2,"0"),
  sourceRevision:"Rev08",sourcePriceUSD:usd,workingFxTHBPerUSD:31.5,
  qty,tagNo:"SOURCE-MTO-ASSOCIATION",description,
  unitPriceTHB:round2(usd*31.5),extendedTHB:round2(qty*usd*31.5)
 }));
 const x=sandbox.calc.buildAnnexWorkingPriceBridge0553({
  code,sourceRows:rows,owner:code.startsWith("B")?{workingSellTHB:parent}:{workingReferenceTHB:parent}
 });
 assert.equal(x.totalRows,detail.length);
 assert.equal(x.rows.length,detail.length);
 assert.equal(x.selectedWorkingTHB,null);
 assert.equal(x.annexLineTotalTHB,null);
 assert.equal(x.varianceTHB,null);
 assert.equal(x.reconciled,false);
 assert.equal(x.priceStatus,"OEM_SPARE_SKU_QTY_AND_NEW_PRICE_NOT_ESTABLISHED");
 assert.ok(x.rows.every(z=>z.qty===null&&z.workingUnitTHB===null&&z.workingTotalTHB===null&&
  z.customerUnitTHB===null&&z.customerTotalTHB===null&&z.selectedLine===false));
 assert.ok(x.rows.every((z,i)=>z.historicalQty===rows[i].qty&&
  z.referenceTotalTHB===rows[i].extendedTHB),"History must be audit-only, never current quote");
 assert.equal(x.customerReleaseAllowed,false);
}
// Even a synthetic historical price must NOT bypass the new OEM proof gate.
const unbalanced=sandbox.calc.buildAnnexWorkingPriceBridge0553({
 code:"B10",sourceRows:[{qty:1,sourcePriceUSD:10,workingFxTHBPerUSD:31.5,
 unitPriceTHB:315,extendedTHB:315}],owner:{workingSellTHB:320}
});
assert.equal(unbalanced.selectedWorkingTHB,null);
assert.equal(unbalanced.varianceTHB,null);
assert.equal(unbalanced.reconciled,false);

// 10.3.1/10.3.2/10.3.3 refer to view identifiers, not frozen versions.
const pricingViewsBox={};
vm.runInNewContext(file("pricingViewRegistry0553.js").replace(/\bexport /g,"")+
 ";this.pricingViews=PRICING_VIEWS_0553;this.byKey=pricingViewByKey0553;",pricingViewsBox);
const pricingViews=pricingViewsBox.pricingViews;
assert.equal(pricingViews.length,3);
assert.equal(pricingViews.map(v=>v.number).join(","),"10.3.1,10.3.2,10.3.3");
assert.equal(pricingViews.map(v=>v.moduleId).join(","),
 "bid.budget.pricing.working,bid.budget.pricing.budgetary,bid.budget.pricing.release");
assert.equal(new Set(pricingViews.map(v=>v.moduleId)).size,3);
assert.equal(pricingViewsBox.byKey("released").fullLabel,"Released Customer Output");

const workspace=file("CommercialWorkspace.jsx");
assert.match(workspace,/PricingCfoDashboard0553 model=\{releaseModel\}/);
assert.match(workspace,/ReleaseCustomerWorkbook0553 model=\{releaseModel\} recipient=\{recipient\}/);
assert.match(workspace,/onOpenSource=\{openReleaseSource\}/);
// One LIVE 10.3 Release Preview; three legacy identifiers remain a compatibility registry.
assert.match(workspace,/activePricingView\.moduleId/);
assert.match(workspace,/PRICING_VIEWS_0553\.find\(view=>view\.key==="released"\)/);
assert.match(workspace,/data-component-key="bid\.budget\.pricing\.single-release"/);
for(const stage of ["working","budgetary","released"])
 assert.ok(workspace.includes('openPricingStage("'+stage+'")'),
  "Original pricing workflow shortcut missing: "+stage);
assert.match(workspace,/10\.3\.1 · Working \/ Edit/);
assert.match(workspace,/10\.3\.2 · Budgetary/);
assert.match(workspace,/10\.3\.3 · Release/);
assert.match(workspace,/openModuleAncestors0553\(target\)/);
assert.match(workspace,/findModuleElement0553\(document,id\+"\.details"\)/);
assert.match(workspace,/<ReleaseSourceNavigator0553 model=\{releaseModel\} onOpenSource=\{openReleaseSource\}/);
const navFile=file("ReleaseSourceNavigator0553.jsx");
assert.match(navFile,/p553-rsn-group--/);
assert.match(navFile,/CATEGORY_COLOR_0553/);
assert.match(navFile,/＋ Expand All/);
assert.match(navFile,/− Collapse All/);
assert.match(navFile,/onOpenSource\(\{\.\.\.row,sourceModuleId:id\}\)/);
assert.match(navFile,/ComponentCopyId/);
assert.match(navFile,/data-component-key="bid\.budget\.pricing\.release\.source-navigator"/);
assert.ok(!/setWorkingSell|postingAllowed:true|releaseAllowed:true/.test(navFile),
 "Source navigator must be read-only and nonposting");
const uiSourceLink=file("ReleaseCustomerWorkbook0553.jsx");
assert.match(uiSourceLink,/onOpenSource\(\{\.\.\.item,sourceModuleId:item\.sourceRowModuleId\|\|item\.sourceModuleId\}\)/);
assert.match(uiSourceLink,/p553-origin-link--a/);
assert.match(uiSourceLink,/r\.sourceId\.toLowerCase\(\)/);
assert.match(uiSourceLink,/same source row ID/);
assert.match(uiSourceLink,/p553-origin-link--c/);
const navStyles=file("project0553.css");
for(const key of ["p553-pricing-stage--working","p553-pricing-stage--budgetary",
 "p553-pricing-stage--released","p553-rsn-row--testing","p553-rsn-row--logistics",
 "p553-rsn-row--spares","p553-rsn-row--options"])
 assert.ok(navStyles.includes(key),"Missing color-coded pricing/navigation group "+key);

assert.match(workspace,/data-component-key="bid\.budget\.pricing\.release"/);
assert.match(workspace,/data-component-key="bid\.budget\.pricing\.release\.source-trace"/);
assert.match(workspace,/data-component-key="bid\.budget\.pricing\.temp"/);
assert.match(workspace,/data-component-key="bid\.budget\.pricing\.working"/);
assert.match(workspace,/data-component-key="bid\.budget\.pricing\.budgetary"/);
assert.match(workspace,/data-component-key="bid\.budget\.pricing\.temp\.customer-proposal"/);
assert.match(workspace,/data-component-key="bid\.budget\.working\.bc"/);
assert.match(workspace,/data-component-key="bid\.budget\.scope"/);
assert.match(workspace,/10\.2 B3 selected Working SELL does not match 10\.3 Release Preview/);
assert.ok(!workspace.includes('PRICING_VIEWS_0553.map(view=>'),
 "Do not show three competing Pricing buttons");
assert.ok(!workspace.includes('mode==="budgetary"')&&!workspace.includes('mode==="released"'),
 "TEMP views must not be alternate active price modes");
// CFO UX contract: a single financial summary table, never KPI cards/bullet lists.
const cfo=file("PricingCfoDashboard0553.jsx");
assert.match(cfo,/p553-cfo-table/);
assert.match(cfo,/รวม A\+B \(เบื้องต้น\)/);
assert.match(cfo,/กำไรเป้าหมาย/);
assert.match(cfo,/const preliminaryBase=plus/);
assert.match(cfo,/ช่อง “ADDVALUE ได้รับ” ยังไม่ใช่กำไร/);
assert.ok(!/<Stat\b|<ul>|p553-cfo-grid/.test(cfo),"CFO must be table-only");
const cfoStyles=file("releaseWorkbook0553.css");
assert.ok(!cfoStyles.includes(".p553-cfo-grid{")&&!cfoStyles.includes(".p553-cfo-stat{"),"Retired KPI-card styles must be absent");
const ui=file("ReleaseCustomerWorkbook0553.jsx");
for(const sheet of ["Scope of supply","B10 CommSpares","B11 SpecialTool","B13 Consumerables","C1 CapitalSpares","C2 2Y-Spares"])
 assert.ok(ui.includes(sheet),"Missing original sheet "+sheet);
assert.match(ui,/const canQuote=false/);
assert.match(ui,/customer Excel Preview|Customer Excel Preview/);
assert.match(ui,/recipient==="INTERNAL"&&viewer==="INTERNAL"/);
assert.match(ui,/buildPartATagGroupBreakdown0553\(model\)/);
assert.match(ui,/partA\.groups\.map/);
assert.match(ui,/part\.previewSellTHB/);
assert.match(ui,/const provisionalBase=addKnown/);
assert.match(ui,/10\.1.*10\.3|10\.1 \/ 10\.3/);
assert.match(ui,/10\.2 B1–B14 Working Sell/);
assert.match(ui,/15 item rows|15 slots|15 item/);
assert.match(ui,/buyer must accept group-level TAG mapping/);
assert.match(ui,/const \[viewer,setViewer\]=useState\("CUSTOMER"\)/);
assert.match(ui,/Export Native XLSX — WORKING DRAFT/);
assert.match(ui,/Final Customer Release — HOLD/);
assert.match(ui,/buildNativeWorkingDraft0553\(file,model\)/);
assert.match(ui,/sourceFileRef\.current\?\.click\(\)/);
const nativeHelper=file("nativeWorkingDraft0553.js");
assert.match(nativeHelper,/entriesFromZip/);
assert.match(nativeHelper,/rebuildZip/);
assert.match(nativeHelper,/Uploaded workbook sheet names/); // source validity gate
assert.match(nativeHelper,/NOT_RELEASED/);
assert.match(nativeHelper,/buyer acceptance/);
assert.ok(!nativeHelper.includes("fetch("),"Native template must stay on the local computer");
assert.match(ui,/model.annexModels\?\.\[code\]/);
assert.match(ui,/r.customerUnitTHB/);
assert.match(ui,/r.customerTotalTHB/);
assert.match(ui,/r.workingUnitTHB/);
assert.match(ui,/r.workingTotalTHB/);
assert.match(ui,/annexModel.varianceTHB/);
assert.match(ui,/Annex lines/); // Annex footnote/table must expose the detailed sum.

assert.ok(!/p553-a-group-breakdown|Part A — TAG Group Price Breakdown|aTags\.slice\(15\)|p553-tag-breakdown-table|expandedTagGroups/.test(ui),
 "Duplicate TAG summary and first-15 TAG copy must be removed");
assert.ok(!/Export source mapping JSON|saveDraft=|approved:false,releaseAllowed:false/.test(ui),
 "Obsolete staging JSON export must not clutter the customer release UX");
assert.ok(!/sourceFile\.write|updateWorkingSellTHB/.test(ui));
console.log("PASS PJ2608-0553 release pricing 100 => A/C 130, B client 100 / SAMTEL 5 / ADDVALUE 95; source and HOLD checks");
