// PJ2608-0553 · executable pricing arithmetic + JSX/source-route contract checks.
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const base=path.resolve(__dirname,"../src/project0553");
const file=(rel)=>fs.readFileSync(path.join(base,rel),"utf8");
const source=file("data/releaseCommercialModel0553.js");
const isolated=source.replace(/^import .*?;\s*$/gm,"").replace(/\bexport /g,"");
const sandbox={};vm.runInNewContext(isolated+";this.calc={priceAorCFromCost0553,priceBWorkingSell0553,buildPartATagGroupBreakdown0553};",sandbox);
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

const workspace=file("CommercialWorkspace.jsx");
assert.match(workspace,/PricingCfoDashboard0553 model=\{releaseModel\}/);
assert.match(workspace,/ReleaseCustomerWorkbook0553 model=\{releaseModel\} recipient=\{recipient\}/);
assert.match(workspace,/onOpenSource=\{openReleaseSource\}/);
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
assert.match(ui,/approved:false,releaseAllowed:false/);
assert.match(ui,/sourceModuleId/);
assert.match(ui,/recipient==="INTERNAL"&&viewer==="INTERNAL"/);
assert.match(ui,/OVERFLOW/);
assert.match(ui,/buildPartATagGroupBreakdown0553\(model\)/);
assert.match(ui,/bid.budget.pricing.release.part-a-tag-groups/);
assert.match(ui,/Part A — TAG Group Price Breakdown/);
assert.match(ui,/partATagBreakdown.pricedFloorTHB/);
assert.match(ui,/expandedTagGroups\[key\]/);
assert.match(ui,/aTags.slice\(15\)/); // Original template 15-row cap still audited.

assert.ok(!/sourceFile\.write|updateWorkingSellTHB/.test(ui));
console.log("PASS PJ2608-0553 release pricing 100 => A/C 130, B client 100 / SAMTEL 5 / ADDVALUE 95; source and HOLD checks");
