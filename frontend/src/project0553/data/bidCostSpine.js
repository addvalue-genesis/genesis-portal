// P553-COST-SPINE / ACTIVE_EVOLVING / PARTICULAR_PROJECT
// Purpose: one read-only costing state consumed by Executive, Architecture, Engineering and Commercial.
// Why: prevent competing price/quantity truths in audit-only submodules.
// Inputs: MTO Rev04 working BOM, supplier price evidence. No 0550 rates or fabricated zeros.
// Output: provenance-bound known preliminary subtotal + explicit unpriced coverage; not customer sell.
// Downstream: executive metrics, First Principles binding, commercial working review.
// Migration: preserves all prior evidence/audit modules; they remain drill-down, not competing totals.
import { MR0001_WORKING_PRICED_BOM } from "./mr0001WorkingPricedBom";
import { SUPPLIER_QUOTE_LINES_0553 } from "./supplierQuoteLines";
const bom=MR0001_WORKING_PRICED_BOM;
const priced=bom.items.filter(x=>Number.isFinite(x.indicativePackageCostTHB));
const unpriced=bom.items.filter(x=>!Number.isFinite(x.indicativePackageCostTHB));
const preliminaryCostTHB=priced.reduce((n,x)=>n+x.indicativePackageCostTHB,0);
const quote=SUPPLIER_QUOTE_LINES_0553.find(x=>x.id==="VST-0048-RE1");
if(!quote||bom.cisco.sourceTotalTHB!==quote.quotedTotal||
 preliminaryCostTHB!==bom.cisco.indicativeExtendedTHB||
 preliminaryCostTHB+bom.cisco.removedTotalTHB!==quote.quotedTotal)
 throw Error("0553 TC-0001 Cisco 8-port cost/source quotation reconciliation failed");
export const BID_COST_SPINE_0553=Object.freeze({
 id:"P553-COST-SPINE",projectId:"PJ2608-0553",
 governingMethod:"First Principles + Telecom Constraint-Based Engineering + Parametric Cost Model + Evidence Control",
 source:"MR0001 MTO Rev04 / Cisco A-0048/2026_Re1",basis:"PRELIMINARY_INTERNAL_ONLY",
 sourceRows:bom.sourceRowCount,scopeItemRows:bom.sourceItemCount,
 pricedRows:priced.length,unpricedRows:unpriced.length,
 knownPreliminaryCost:{THB:preliminaryCostTHB},
 originalCiscoQuotationTHB:quote.quotedTotal,
 tc0001Cisco8PortReductionTHB:bom.cisco.removedTotalTHB,
 tc0001TechnicalStatus:bom.cisco.engineeringGate,
 fullEquipmentCost:null,
 serviceCost:null,partA:null,partB:null,partC:null,customerSell:null,
 outputTemplate:"4-Scope of Supply.xlsx / original six sheets",releaseAllowed:false,
 exclusions:["Unpriced is not zero","Working source MTO sets are not approved OEM SKU quantities",
 "Other vendor currencies are not summed without source-controlled FX",
 "Cisco 8-port working scenario follows TC-0001 Item 13; original 11 quote lines retained for traceability",
 "Port allocation, PoE power and L3 entitlement not technically approved",
 "Cisco package is scenario pricing, not OEM design compliance"]
});
