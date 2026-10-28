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
 }),
 Object.freeze({key:"official",number:"10.3.4",shortLabel:"Official Release",fullLabel:"Official Release — English / USD",moduleId:"bid.budget.pricing.official",lifecycle:"CUSTOMER_FORMAT_USD_NOT_AUTOMATICALLY_ISSUED"})
]);
export const pricingViewByKey0553=key=>PRICING_VIEWS_0553.find(v=>v.key===key)||PRICING_VIEWS_0553.find(v=>v.key==="released");

// Addresses inside the existing Release/Official views; no new price owner or stage.
export const breakdownModule0553=(origin="released",code=null)=>{
 const view=pricingViewByKey0553(origin==="official"?"official":"released");
 const base=origin==="official"?view.moduleId:"bid.budget.pricing.release.preview";
 return {id:base+".breakdown"+(code?"."+code.toLowerCase():""),
  number:view.number+"."+(code||"A")};
};
export const BREAKDOWN_MODULES_0553=Object.freeze(["released","official"].flatMap(origin=>
 [null,"A1","A2","A3","A4"].map(code=>{
  const module=breakdownModule0553(origin,code);
  return Object.freeze({...module,name:module.number+" — Part A Breakdown"+(code?" / "+code:""),
   tab:"budget",keywords:"price breakdown MR customer internal รายละเอียดราคา สรุป"});
 })));
