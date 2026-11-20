// PJ2608-0553 selected DATO-507-001 pricing decision / provenance / single owner.
// Historical INNOVA N/A is preserved. RS retail working rate supersedes THB 0.
// This validator must NEVER replace an engineering/OEM compliance sign-off.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const old=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const out=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(out.code,file);
 }else old(mod,file);
};
const from=name=>require(path.join(root,"project0553/data",name));
const {deriveZWP20SiteCost0553}=from("zwp20SiteCost0553.js");
const {MR0001_WORKING_PRICED_BOM}=from("mr0001WorkingPricedBom.js");
const {selectMR0001TagCostRows0553}=from("mr0001TagCostLedger0553.js");
const {summarizeMR0001Rev03TagCost0553}=from("mr0001Rev03CostOverlay0553.js");
const {deriveWpSystemBulkBudget0553}=from("wpSystemBulkBudget0553.js");
const {findZwp20WebRate0553}=from("zwp20WebBulkRates0553.js");
const {INNOVA_0553_PROVISIONAL_PRICES}=from("innovaHistoricalBudgetPrices.js");
const {SUPPLIER_QUOTE_LINES_0553}=from("supplierQuoteLines.js");
const ref=findZwp20WebRate0553("RJ45");
assert(ref&&ref.url&&ref.source,"Canonical RS Thailand source");
assert.equal(ref.rateTHB,1176.68,"RS 741-7317 working reference");
assert.equal(ref.approvalStatus,"MANAGEMENT_APPROVED_INTERNAL_BUDGETARY_PRODUCT_AND_RATE","Confirmed manager-approved working price must be retained");
assert.equal(ref.approvalAuthority,"PROJECT_MANAGEMENT_USER");
assert(ref.approvalConfirmation.includes("2026-10-15"));
assert(ref.approvalScope.includes("NO_AUTOMATIC_EX_TECHNICAL_APPROVAL"));
assert.equal(ref.costOwner,"bid.budget.bom.zwp20.dato-507-001.8");
const original=INNOVA_0553_PROVISIONAL_PRICES.quotations.find(x=>x.number==="QA24-0604").lines.find(x=>x.partNumber==="IE-PS-RJ45-FH-BK");
assert.equal(original.unitPriceExVat,null,"INNOVA source N/A must stay NULL");
const sonic=SUPPLIER_QUOTE_LINES_0553.find(x=>x.id==="SONIC-CCY24-PXC-633").lines.find(x=>x[1]==="FL-PP-RJ45-SC");
assert.equal(sonic[4],1900,"Original Phoenix historical quote amount");
const site=deriveZWP20SiteCost0553();
const dato=site.rows.find(x=>x.row===8&&x.tag==="DATO-507-001");
assert(dato,"Missing ZWP20 MTO row8");
assert.equal(dato.sourceQty,1);
assert.equal(dato.sourceUnit,"Set");
assert.equal(dato.components.length,2);
const panel=dato.components.find(x=>x.sku==="FL-PP-RJ45-SC");
const plug=dato.components.find(x=>x.sku==="IE-PS-RJ45-FH-BK");
assert(panel&&plug,"Selected DATO products");
assert.equal(panel.unitPrice,sonic[4]);
assert.equal(panel.extended,1900);
assert.equal(plug.qty,1);
assert.equal(plug.unitPrice,ref.rateTHB);
assert.equal(plug.priceBasis,"MANAGEMENT_APPROVED_RS_RETAIL_BUDGET_REFERENCE_EX_VAT");
assert.equal(plug.extended,1176.68);
assert.equal(plug.budgetApproval,ref.approvalStatus,"Ledger must reflect recorded approval");
assert.equal(plug.budgetApprovedBy,ref.approvalAuthority);
assert.equal(dato.managementBudgetApprovalRecorded,true,"DATO selection approval must not be reopened");
assert.equal(plug.quotedUnitPrice,null,"RS reference must not overwrite INNOVA N/A");
assert.equal(dato.extended,3076.68);
assert.equal(dato.unitCost,3076.68,"MTO one Set unit cost must be entire selected two-component Set");
assert.equal(dato.extended,dato.sourceQty*dato.unitCost,"No misleading unit-rate versus extended mismatch");
// Financial amounts are asserted in integer satang: IEEE-754 may yield 3076.6800000000003.
assert.equal(dato.components.reduce((sum,x)=>sum+Math.round(x.extended*100),0),
 Math.round(dato.extended*100),"Selected component costs must equal DATO one-Set cost to the satang");
assert(dato.decision.includes("superseded")&&dato.decision.includes("THB 1,176.68"),"Current decision must supersede temporary zero");
assert(!dato.assumptions.some(x=>x.includes("1 provisional plug × THB 0")));
const ledger=selectMR0001TagCostRows0553("ZWP20").find(x=>x.row===8);
assert.equal(ledger.extended,dato.extended,"Single ZWP20 TAG cost source");
// A new price candidate without an approved revision must not replace the
// existing manager-approved working budget rate or alter the original quote.
const originalQuoteAmount=original.unitPriceExVat;
try{
 original.unitPriceExVat=5000;
 const postQuoteCandidate=deriveZWP20SiteCost0553().rows.find(x=>x.row===8);
 assert.equal(postQuoteCandidate.extended,3076.68,
  "A newer unapproved vendor quote cannot silently override management approval");
}finally{
 original.unitPriceExVat=originalQuoteAmount;
}
assert.equal(original.unitPriceExVat,null,"Source quotation N/A must be restored");

const scada=deriveWpSystemBulkBudget0553().find(w=>w.wp==="ZWP20").systems.find(s=>s.id==="SCADA_RADIO");
const mirrored=scada.items.find(x=>x.id==="SCADA-RJ45-WEIDMULLER");
assert.equal(mirrored.rateTHB,ref.rateTHB,"Bulk mirrors selected central retail reference");
assert.equal(mirrored.extendedTHB,null,"DATO already owns RJ45; NEVER book again as bulk");
assert.equal(mirrored.owner,"DATO_ROW8_INCLUDED_IN_BUDGET__NOT_ADDITIVE");
// The original DATO price and its owner are frozen, but TC-0001 Item 13
// intentionally removed one Cisco expansion module and its SmartNet at ZWP20.
// Reconcile the new site total against the pre-TC baseline instead of
// silently restoring an obsolete 16-port switch package.
const originalRev02Gross=Math.round((site.subtotals.THB+site.subtotals.USD*31.5)*100)/100;
const cisco8=MR0001_WORKING_PRICED_BOM.cisco;
const removedPerSite=cisco8.removedUnitTHB;
const switchRow=site.rows.find(x=>x.row===7&&x.tag==="LAN-502-001");
assert(switchRow,"ZWP20 Cisco switch MTO row7 must remain present");
assert.equal(removedPerSite,51950,"TC-0001 removes only module and expansion SmartNet");
assert.equal(switchRow.extended,423530,"Protected ZWP20 Rev02 source must remain original");
assert.equal(originalRev02Gross,921425.22,"Immutable Rev02 ZWP20 ledger");
const projected=summarizeMR0001Rev03TagCost0553("ZWP20");
const rev03Switch=projected.rows.find(x=>x.row===7&&x.tag==="LAN-502-001");
assert(rev03Switch,"Rev03 ZWP20 Cisco projection missing");
assert.equal(rev03Switch.extended,371580,"Rev03 8-port Cisco candidate");
const gross=Math.round((projected.subtotals.THB+projected.subtotals.USD*31.5)*100)/100;
assert.equal(gross,869475.22,"Current Rev03 ZWP20 cost");
assert.equal(Math.round((gross+removedPerSite)*100)/100,originalRev02Gross,
 "Rev03 minus Rev02 must be only TC-0001 Cisco expansion removal; DATO unchanged");
const bulkSource=fs.readFileSync(path.join(root,"project0553/data/wpSystemBulkBudget0553.js"),"utf8");
const datoSource=fs.readFileSync(path.join(root,"project0553/data/zwp20SiteCost0553.js"),"utf8");
assert(!bulkSource.includes("rateTHB:1176.68"),"Do not duplicate retail rate in bulk read model");
assert(!datoSource.includes("const plugRsRetailRate=1176.68"),"DATO must read canonical vendor evidence, not hardcode another rate");
console.log("PASS 0553 DATO selected Phoenix + Weidmuller: THB 1900 + 1176.68 = 3076.68; RS source not INNOVA; no SCADA Bulk duplicate; ZWP20 THB 869475.22 after TC-0001 Cisco reduction THB 51950; original THB 921425.22 reconciled");
