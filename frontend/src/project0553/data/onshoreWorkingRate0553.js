// PJ2608-0553 / Onshore labour Working SELL rate - management selection 2026-10-18.
// RATE approval is not quantity approval, payroll/direct cost verification, travel inclusion,
// vendor quote approval or authority to overwrite historical/working WBS sell totals.
export const ONSHORE_ROLE_WORKING_SELL_RATES_0553=Object.freeze({
 seniorTelecomEngineerUSDPerPersonDay:700,
 fieldTelecomSpecialistUSDPerPersonDay:600,
 fxTHBPerUSD:31.5,
 seniorTelecomEngineerTHBPerPersonDay:22050,
 fieldTelecomSpecialistTHBPerPersonDay:18900,
 twoPersonSeniorPlusFieldTeamTHBPerDay:40950,
 rateAuthority:"USER_ONSHORE_SENIOR_700_FIELD_600_20261022",
 directCostVerified:false,customerReleaseApproved:false
});
export const ONSHORE_WORKING_SELL_RATE_0553=Object.freeze({
  usdPerPersonDay:600,
  thbPerUsd:31.5,
  workingHoursPerDay:8,
  thbPerPersonDay:18900,
  rateClass:"USER_SELECTED_ONSHORE_ROLE_WORKING_SELL_RATE",
  roleRates:ONSHORE_ROLE_WORKING_SELL_RATES_0553,
  source:"USER_ONSHORE_SENIOR_700_FIELD_600_20261022",
  applicability:"ADDVALUE Onshore labour (office PM B1, MGW China FAT Witness B3, JUTAL optional Yard staffing B9) where explicitly scoped",
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
  note:"One expense ID, one cost owner; do not cross-charge MGW FAT B3 and Yard B9 into B1; no cumulative B1/B9 sell change until WBS scope and quantities reconciled"
});
export function selectOnshoreWorkingRate0553(){ 
 const r=ONSHORE_WORKING_SELL_RATE_0553;
 if(r.usdPerPersonDay*r.thbPerUsd!==r.thbPerPersonDay || r.workingHoursPerDay!==8||
  r.roleRates.seniorTelecomEngineerUSDPerPersonDay*r.thbPerUsd!==r.roleRates.seniorTelecomEngineerTHBPerPersonDay||
  r.roleRates.fieldTelecomSpecialistUSDPerPersonDay*r.thbPerUsd!==r.roleRates.fieldTelecomSpecialistTHBPerPersonDay)throw Error("Onshore Working Sell basis mismatch");
 return r;
}
