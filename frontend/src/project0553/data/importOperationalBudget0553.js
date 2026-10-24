// Owner-approved 24-Oct budget assumptions, NOT quotations or published fee schedules.
// One price source for B1 licensing and B6 border administration. No DB/manual-input refactor.
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
export const IMPORT_OPERATIONAL_BUDGET_0553=Object.freeze({
 id:"OWNER-20261024-TH-CN-MM-OPERATIONS",costOwnerByStage:["B6","B6","B1"],
 pricingStatus:"OWNER_SELECTED_PLANNING_ALLOWANCE_NOT_VERIFIED_COST",
 serviceSellFactor:1.10,governmentFeeSellFactor:1,
 stages:Object.freeze([
  {id:"TH-IN",owner:"B6",label:"Supplier → Thailand / นำเข้าไทย",costTHB:30000,
   basis:"Up to 3 import lots × THB8,000 + THB6,000 document/rework reserve; NextG/MGW/MDS planning touchpoints, not confirmed shipments; EXION domestic",
   excludes:"Freight, duty/VAT, recoverable VAT cash flow, product testing and supplier-included charges"},
  {id:"TH-CN",owner:"B6",label:"Thailand → CIF Zhuhai / ส่งออกและเอกสาร JUTAL",costTHB:20000,
   basis:"1 consolidated export lot × THB15,000 broker/documents + THB5,000 external certification/courier support",
   excludes:"Truck/loading/terminal, sea freight, cargo insurance, China import tax/clearance and JUTAL onward freight"},
  {id:"CN-MM",owner:"B1",label:"Myanmar Import & Operational Licensing / ใบอนุญาตนำเข้าและใช้งาน",costTHB:200000,
   basis:"Four-MR regulatory package; MR count is not licence or shipment count; government decisions remain external",
   excludes:"B1 office staff already budgeted, duplicate filing allowance, JUTAL platform freight, duties/taxes and physical clearance paid by others"}
 ]),
 myanmarLines:Object.freeze([
  {id:"B1-MM-AGENCY",account:"B1.6",activity:"Myanmar company: prepare/translate/file, respond, follow up and collect applicable approvals for MR0001–MR0004",qty:2500,unit:"USD planning reference",unitCostTHB:31.5,sellFactor:1.10,
   gate:"User-supplied USD2500 reference upper bound × planning FX31.5, NOT a received quote; includes translation/courier/filing formerly B1-EXP-FILING; private service, not government revenue"},
  {id:"B1-MM-GOV",account:"B1.7",activity:"Myanmar Government Fees & Charges — PTD/MOTC, MOC and applicable Customs official charges",qty:1,unit:"allowance",unitCostTHB:25000,sellFactor:1,
   gate:"Unverified statutory fee allowance; official schedule/receipt and applicable payer required; no service uplift, no reimbursable-at-actual contract term implied; duty/VAT excluded"},
  {id:"B1-MM-ADDITIONAL",account:"B1.6",activity:"Additional approval work reserve: model/type approval, station/frequency and first-year requirements if applicable",qty:1,unit:"reserve",unitCostTHB:75000,sellFactor:1.10,
   gate:"Mixed work/fee contingency, NOT a published government fee; reuse prior approvals only after model/site/holder check; unused allowance is not an extra charge"},
  {id:"B1-MM-REWORK",account:"B1.6",activity:"Regulatory execution/rework contingency",qty:1,unit:"reserve",unitCostTHB:21250,sellFactor:1.10,
   gate:"Budget risk reserve for lawful resubmission/document corrections; excludes B1 salaried staff and unofficial payments"}
 ]),
 // Explicit NEW internal split of the old mixed SELL envelope, not a historical invoice split.
 b6Replacement:Object.freeze({oldImportSellTHB:12000,oldExportMixedSellTHB:25000,
  allocatedOldExportServiceSellTHB:15000,retainedTruckLoadingTerminalSellTHB:10000,
  splitStatus:"NEW_INTERNAL_PLANNING_ALLOCATION_NOT_VERIFIED_VENDOR_SPLIT",
  note:"Reassign old25,000 SELL into15,000 service replaced and10,000 physical dispatch retained. Adequacy of retained truck/terminal remains open; no supplier credit claimed."}),
 completion:"Applicable import/operating approvals received and handed over to JUTAL/PTTEP with model, quantity, site, holder and validity register; written reuse/exemption evidence where applicable. No application is claimed submitted or approved.",
 responsibility:"ADDVALUE manages telecom dossiers and Myanmar partner delivery; authorized applicant/holder signs. PTTEPI FaFE/MOE/MOGE interfaces and authorized customs broker retain their roles; JUTAL supplies final shipment/platform data.",
 evidence:"10015-WIS-LOG-MM0001-R03 §6.1.1/6.1.2/6.1.5 and Myanmar Shipment appendix §5/6.2; 10008-STD-6-TEL-001-R00 §7.2.4.2/7.2.5.1; owner24-Oct route and budget decisions",
 directCostTHB:null,releaseAllowed:false
});
export function selectImportOperationalBudget0553(){
 const s=IMPORT_OPERATIONAL_BUDGET_0553;
 const stages=s.stages.map(r=>({...r,workingSellTHB:r.owner==="B1"?
  round(s.myanmarLines.reduce((n,x)=>n+x.qty*x.unitCostTHB*x.sellFactor,0)):round(r.costTHB*s.serviceSellFactor)}));
 const replacement=s.b6Replacement;
 return {...s,stages,totalCostTHB:stages.reduce((n,r)=>n+r.costTHB,0),
  b6IncrementalSellTHB:round(stages.filter(r=>r.owner==="B6").reduce((n,r)=>n+r.workingSellTHB,0)-replacement.oldImportSellTHB-replacement.allocatedOldExportServiceSellTHB),
  governmentFeeAllowanceTHB:25000,governmentFeeSellTHB:25000};
}
