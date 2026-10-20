// PJ2608-0553 / 10.3 pricing-view identifiers only; NOT price authority or version control.
// The UI modes currently share underlying working source projections. A frozen
// approved Budget/Release snapshot is not implemented merely by switching a tab.
export const PRICING_VIEWS_0553=Object.freeze([
 Object.freeze({
  key:"working",number:"10.3.1",shortLabel:"Working",
  fullLabel:"Working Preview",moduleId:"bid.budget.pricing.working",
  lifecycle:"LIVE_WORKING_READ_MODEL"
 }),
 Object.freeze({
  key:"budgetary",number:"10.3.2",shortLabel:"Budgetary",
  fullLabel:"Budgetary Submission",moduleId:"bid.budget.pricing.budgetary",
  lifecycle:"BUDGET_PREVIEW_SNAPSHOT_NOT_REGISTERED"
 }),
 Object.freeze({
  key:"released",number:"10.3.3",shortLabel:"Release",
  fullLabel:"Released Customer Output",moduleId:"bid.budget.pricing.release",
  lifecycle:"CUSTOMER_PREVIEW_APPROVAL_HOLD"
 })
]);
export const pricingViewByKey0553=key=>PRICING_VIEWS_0553.find(v=>v.key===key)||PRICING_VIEWS_0553[0];
