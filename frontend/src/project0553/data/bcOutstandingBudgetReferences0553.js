// PJ2608-0553 10.2 — Pre-award price references that must not silently post to Working SELL.
// B7 free 90-day storage is subject to an included-in-package and insurance check.
// B11 is the historical itemized special-tools budget and B14 is a summary-only
// bond/insurance allowance, NOT a verified insurer or bank fee quotation.
import {REV08_BASELINE} from "./rev08CommercialBaseline";
import {selectBcB5HistoricalPriceBridge0553} from "./bcB5HistoricalPriceBridge0553";
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
export function selectBcOutstandingBudgetReferences0553(){
 const historical=selectBcB5HistoricalPriceBridge0553();
 const amount=code=>round(REV08_BASELINE.summary.find(x=>x[0]===code)[2]*31.5);
 const b11Detail=REV08_BASELINE.detail.B11.map(([description,qty,unitUSD],i)=>Object.freeze({
  id:"B11-REV08-"+(i+1),description,qty,unitBudgetTHB:round(unitUSD*31.5),
  extendedBudgetTHB:round(qty*unitUSD*31.5),basis:"HISTORICAL_REV08_WORKING_FX_31_5"
 }));
 const byCode=Object.freeze({
  B7:Object.freeze({amountTHB:historical.originalB5EmbeddedStorageSellTHB,currency:"THB",
   priceClass:"NON_ADDITIVE_STORAGE_CONTINGENCY_REFERENCE",chargeToWorkingSell:false,
   rule:"90-day workshop storage is contracted FREE; old provision was embedded in legacy B5 and must not be added again. Extended storage only after written confirmation.",
   costOwner:"SAMTEL/OEM",source:"Rev09 B7-BUD embedded in older B5",includedInBase:false}),
  B11:Object.freeze({amountTHB:amount("B11"),currency:"THB",
   priceClass:"BUDGETARY_SPECIAL_TOOLS_REFERENCE",chargeToWorkingSell:false,
   rule:"Four Rev08 special-tool candidates; confirm RACON kits and software included in Part A/OEM and charge only additional deliverable tools.",
   costOwner:"SAMTEL/OEM",source:"4-Scope of Supply.xlsx Rev08 B11",details:b11Detail,includedInBase:false}),
  B14:Object.freeze({amountTHB:amount("B14"),currency:"THB",
   priceClass:"BUDGETARY_FINANCIAL_RISK_ALLOWANCE",chargeToWorkingSell:false,
   rule:"SAMTEL-owned performance bond 10% of contract value (bond face value, NOT fee), advance payment guarantee where applicable, contract insurance premium. Avoid freight/storage policy duplication with B6/B7. Obtain bank fee, tenor, insured basis.",
   costOwner:"SAMTEL",source:"4-Scope of Supply.xlsx Rev08 B14 + Commercial Checklist Rev04",includedInBase:false})
 });
 if(amount("B11")!==128314.11||amount("B14")!==262500||byCode.B7.amountTHB!==37894.74)
  throw Error("B7/B11/B14 budget evidence baseline changed");
 return Object.freeze({moduleId:"bid.budget.working.bc.outstanding-budget-references",byCode,
  pricingRule:"Visible pre-award candidates, never extra posting to canonical Base until cost owner / scope / insurance reconciled"});
}
