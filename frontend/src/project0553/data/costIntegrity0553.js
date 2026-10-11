// Source-accountability control for PJ2608-0553. Does not calculate a fictitious total.
import { SUPPLIER_QUOTE_LINES_0553 } from "./supplierQuoteLines";
import { BID_COST_SPINE_0553 } from "./bidCostSpine";
import { MR0001_ENGINEERING_REQUIRED_BOM } from "./mr0001RequiredBomDerivation";

export const COST_PIPELINE_STEPS_0553 = Object.freeze([
 {step:1,name:"Executive / RFQ ownership",evidence:"Current RFQ, bidder responsibility, scope A/B/C",state:"REVIEW",reason:"Full signed scope responsibility not proved by the cost model"},
 {step:2,name:"First Principles",evidence:"Function, physical objects, demand, quantity drivers",state:"PARTIAL",reason:"MR0001 requirement derivation exists; physical SKU quantities not yet accepted"},
 {step:3,name:"Architecture & constraints",evidence:"Topology, location, throughput, power, Ex certification and interfaces",state:"PARTIAL",reason:"Constraint studies exist; not proven for every selected configuration"},
 {step:4,name:"MR / document revision",evidence:"MR, MTO, BLD, LAY, DWG, CAL/RPT native revisions",state:"PARTIAL",reason:"Snapshot exists; full cell-by-cell verification against current originals not signed"},
 {step:5,name:"Physical BOM and bulk",evidence:"Site-by-site physical quantities, SCADA enclosure vs ATEX JB, radio/NMS licences",state:"INCOMPLETE",reason:"MR0001 physical BOM unapproved; MR0002-0004 detailed BOM incomplete"},
 {step:6,name:"Execution WBS / resources",evidence:"Engineering hours, FAT/SAT, shipping, import, installation and site productivity",state:"INCOMPLETE",reason:"Complete WBS-derived A+B+C costs not available"},
 {step:7,name:"Vendor technical & cost reconciliation",evidence:"All quotes classified by overlap, alternative, current validity and commercial terms",state:"INCOMPLETE",reason:"Source quotes registered but not allocated/approved across MRs"},
 {step:8,name:"Risk, uncertainty & change",evidence:"Assumptions, parametric ranges, risk allowance and source/revision impacts",state:"INCOMPLETE",reason:"No complete evidence-backed risk-adjusted project estimate"}
]);
const classification = {
 "VST-0048-RE1":{type:"WORKING_SCENARIO",note:"Cisco LAN only; carried in cost spine; expired quotation"},
 "NG-260916":{type:"UNALLOCATED_VENDOR_QUOTE",note:"SCADA radio proposal; do not add before MTO alignment, options and OEM review"},
 "MGW-P26-058":{type:"UNALLOCATED_VENDOR_QUOTE",note:"MR0002-0004 packages with embedded feeder and Ex telephone JB; check inclusion and allocation"}
};
export const COST_INTEGRITY_0553 = Object.freeze((()=>{
 const rows=SUPPLIER_QUOTE_LINES_0553.map(q=>({
  id:q.id,vendor:q.vendor,mr:q.mr,amount:q.quotedTotal,currency:q.currency,
  quoteDate:q.date,validUntil:q.validUntil||q.validityRule||null,
  source:q.source,status:q.status,
  allocation:classification[q.id]?.type||"REFERENCE_OR_UNALLOCATED",
  note:classification[q.id]?.note||"Do not auto-sum; historical/reference, alternate or unallocated evidence pending"
 }));
 const quoteIds=new Set(rows.map(r=>r.id));
 const covered=new Set(["VST-0048-RE1"]);
 const quoteDataIssues=rows.filter(q=>!q.currency||!Number.isFinite(q.amount)).map(q=>q.id);
 const missingCostSourceIds=[...covered].filter(id=>!quoteIds.has(id));
 const physicalAccepted=MR0001_ENGINEERING_REQUIRED_BOM.rows.filter(r=>Number.isFinite(r.requiredSkuQty)&&r.selectedVendorSku);
 const reported=BID_COST_SPINE_0553.knownPreliminaryCost.THB;
 const v=rows.find(q=>q.id==="VST-0048-RE1");
 const ciscoQuoteAmount=v?.quotedTotal??null;
 const ciscoVarianceTHB=Number.isFinite(ciscoQuoteAmount)&&Number.isFinite(reported)?reported-ciscoQuoteAmount:null;
 const reconciliationPassed=ciscoVarianceTHB===0;
 const integrityIssues=[...quoteDataIssues.map(id=>"Missing quote amount/currency: "+id),...missingCostSourceIds.map(id=>"Missing cost source: "+id),...(!reconciliationPassed?["Cisco source subtotal differs from working BOM cost; investigate quote-line allocation and scope before use"]:[])];
 return {
  steps:COST_PIPELINE_STEPS_0553,quotes:rows,sourceQuoteCount:rows.length,
  reconciliationPassed,ciscoQuoteAmount,ciscoVarianceTHB,integrityIssues,
  includedQuoteIds:[...covered],unallocatedQuoteCount:rows.length-covered.size,
  knownCiscoSubtotalTHB:reported,knownSubtotalScope:"MR0001 / Cisco five LAN Set working scenario ONLY",
  mr0001RequiredSourceRows:MR0001_ENGINEERING_REQUIRED_BOM.rows.length,
  mr0001AcceptedPhysicalRows:physicalAccepted.length,
  currencyTotalsNotAdditive:true,completeProjectCost:null,verifiedBudget:null,
  completeAplusBplusC:false,allEightStepsVerified:false,budgetReleaseAllowed:false,
  policy:"Do not sum quote totals: overlapping scope, alternatives, expired quotes, mixed currencies and embedded accessories require allocation. Missing cost is UNKNOWN, never zero."
 };
})());
