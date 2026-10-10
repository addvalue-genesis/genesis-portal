// User-approved 2024 provisional THB budget rates. Candidate matching ≠ approved allocation.
import { INNOVA_0553_PROVISIONAL_PRICES } from "./innovaHistoricalBudgetPrices";
import { MR0001_PACKAGE_COMPOSITION } from "./mr0001PackageComposition";

const q=INNOVA_0553_PROVISIONAL_PRICES.quotations;
const rateLines=[
 {id:"QA24-0605-CAT6A",quote:"QA24-0605",sku:"APS-AME-CAT6A-305M",description:"APS AME LabLan U/FTP CAT6A 305m box",unit:"box",packLengthM:305,rateTHB:46000,functions:["CABLE_FIRE_RATING"],status:"PROVISIONAL_ALTERNATIVE_CABLE"},
 {id:"QA24-0606-M25",quote:"QA24-0606",sku:"501/421/B/M25",description:"Hawke gland for LCF12-50JFN half-inch RF cable",unit:"set",rateTHB:690,functions:["GLANDS"],status:"PROVISIONAL_SIZE_SPECIFIC"},
 {id:"QA24-0606-M40",quote:"QA24-0606",sku:"501/421/C2/M40",description:"Hawke gland for LCF78-50JFNA seven-eighth RF cable",unit:"set",rateTHB:2015,functions:["GLANDS"],status:"PROVISIONAL_SIZE_SPECIFIC"}
];
const basketEvidence=q.filter(x=>x.number==="QA24-0604").map(x=>({
 id:x.number,quote:x.number,sourceTotalTHB:x.originalSubtotalExVat,
 status:"BASKET_SUBTOTAL_NOT_PER_SKU_RATE",selectedSku:null,allocationQty:null
}));
const candidates=MR0001_PACKAGE_COMPOSITION.packages.flatMap(p=>p.components
 .filter(c=>["GLANDS","CABLE_FIRE_RATING","FEEDER_ROUTE","RF_CONNECTOR"].includes(c.functionId))
 .map(c=>({packageId:p.id,componentId:c.id,site:p.platform,functionId:c.functionId,
  evidence:rateLines.filter(r=>r.functions.includes(c.functionId)).map(r=>r.id),
  otherSupplierQuote:"QA24-0604",requiredQty:null,selectedRateId:null,allocatedQty:null,
  provisionalExtendedTHB:null,acceptedCost:null,
  status:"SOURCE_PRICE_AVAILABLE_QUANTITY_AND_MATCH_OPEN"})));
export const MR0001_INNOVA_COST_BRIDGE=Object.freeze({
 projectId:"PJ2608-0553",mr:"MR-0001",currency:"THB",
 sourceDate:"2024-07-15",budgetStatus:"USER_AUTHORIZED_PROVISIONAL_RATE_REQUOTE_PENDING",
 rateLines,basketEvidence,candidates,
 assumptions:["Rates are source prices before VAT, not approved current quotes",
  "QA24-0604 total is a mixed basket and cannot be a unit price",
  "QA24-0605 CAT6A is 305 m per box, not a flat per-metre purchase quote",
  "Glands are size-specific alternatives; do not count both without proven interfaces",
  "CAT6A does not substitute RF coax feeder merely because both are cables",
  "No site cost until quantity, specification and rate choice are evidenced"],
 customerReleaseAllowed:false
});
export function calculateProvisionalInnovaLine({rateId,qty,verifiedUnit,scopeState}={}){
 const rate=rateLines.find(r=>r.id===rateId);
 if(!rate||!Number.isInteger(qty)||qty<0||verifiedUnit!==rate.unit||scopeState!=="ENGINEERING_QUANTITY_VERIFIED")
  return {status:"HOLD_QUANTITY_OR_UNIT",costTHB:null};
 return {status:"PROVISIONAL_BUDGET_ONLY",costTHB:qty*rate.rateTHB,rateSource:rate.quote,currency:"THB",customerReleaseAllowed:false};
}
