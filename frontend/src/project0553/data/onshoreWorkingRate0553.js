// PJ2608-0553 / Onshore labour Working SELL rate - management selection 2026-10-18.
// RATE approval is not quantity approval, payroll/direct cost verification, travel inclusion,
// vendor quote approval or authority to overwrite historical/working WBS sell totals.
export const ONSHORE_WORKING_SELL_RATE_0553=Object.freeze({
  usdPerPersonDay:600,
  thbPerUsd:31.5,
  workingHoursPerDay:8,
  thbPerPersonDay:18900,
  rateClass:"USER_SELECTED_ONSHORE_WORKING_SELL_RATE",
  source:"USER_MANAGEMENT_DECISION_2026_10_18",
  applicability:"ADDVALUE Onshore labour (office PM B1, China MGW FAT / JUTAL Yard staffing B9) where explicitly scoped",
  workingSellRateApproved:true,
  internalDirectCostVerified:false,
  staffDaysApproved:false,
  travelIncluded:false,
  accommodationIncluded:false,
  visaIncluded:false,
  perDiemIncluded:false,
  ratePerPersonNotTeam:true,
  B1PostingAuthorized:false,
  B9ExistingWorkingSellOverrideAllowed:false,
  note:"One expense ID, one cost owner; do not re-charge China work in B1; no cumulative B1/B9 sell change until WBS scope and quantities reconciled"
});
export function selectOnshoreWorkingRate0553(){ 
 const r=ONSHORE_WORKING_SELL_RATE_0553;
 if(r.usdPerPersonDay*r.thbPerUsd!==r.thbPerPersonDay || r.workingHoursPerDay!==8)throw Error("Onshore Working Sell basis mismatch");
 return r;
}
