// PJ2608-0553 / 10.3 pricing-view identifiers only; NOT price authority or version control.
// Compatibility registry: Working and Budgetary identities are now TEMP audit views.
// Only Release Preview is active in 10.3. There is still no approved/frozen issue.
export const PRICING_VIEWS_0553=Object.freeze([
 Object.freeze({
  key:"working",number:"10.3.1",shortLabel:"Working",
  fullLabel:"Working Preview",moduleId:"bid.budget.pricing.working",
  lifecycle:"TEMP_HISTORICAL_WORKING_REFERENCE"
 }),
 Object.freeze({
  key:"budgetary",number:"10.3.2",shortLabel:"Budgetary",
  fullLabel:"Budgetary Submission",moduleId:"bid.budget.pricing.budgetary",
  lifecycle:"TEMP_BUDGETARY_SNAPSHOT_NOT_REGISTERED"
 }),
 Object.freeze({
  key:"released",number:"10.3.3",shortLabel:"Release",
  fullLabel:"Released Customer Output",moduleId:"bid.budget.pricing.release",
  lifecycle:"SINGLE_LIVE_CUSTOMER_PREVIEW_APPROVAL_HOLD"
 })
]);
export const pricingViewByKey0553=key=>PRICING_VIEWS_0553.find(v=>v.key===key)||PRICING_VIEWS_0553.find(v=>v.key==="released");
