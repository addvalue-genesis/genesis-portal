// 10.2 B3 Site Survey scope, required as distinct pre-SAT reconnaissance.
// No proven staff/team-day/travel price is inside the currently selected 40-day SAT.
// Post-site-survey engineering comments in BOD are NOT evidence of a budgeted new
// physical visit. Do not use SAT Test IDs to create paid Site Survey days.
const SITES=Object.freeze(["ZPQ","ZWP8","ZWP11","ZWP20","ZWP21","ZWP22","ZWP23"]);
export function selectB3SiteSurveyScope0553(){
 const rows=Object.freeze(SITES.map((site,i)=>Object.freeze({
  sourceId:"B3-SUR-"+site,site,
  purpose:site==="ZPQ"||site==="ZWP8"||site==="ZWP11"?
   "Brownfield existing-asset/IDU/Cisco interface, rack/earthing/cable path verification":
   "Greenfield layout, access, network/RF interfaces, hazardous-area and cable route readiness",
  activityOwner:"B3_FIELD_SURVEY_SOW",reportOwner:"B2_VDRL_FINAL_DOCUMENT_CONTROL_ONLY",
  surveyEffortTeamDays:null,travelDays:null,boatPOBAllowanceTHB:null,
  workingSellTHB:null,verifiedDirectCostTHB:null,postingAllowed:false
 })));
 if(rows.length!==7||new Set(rows.map(x=>x.site)).size!==7||
  rows.some(x=>x.workingSellTHB!==null||x.postingAllowed))
  throw Error("B3 Site Survey cannot silently inherit SAT MD or priced owner");
 return Object.freeze({
  moduleId:"bid.budget.working.bc.b3",
  sourceId:"B3-SITE-SURVEY-SEVEN-SITE-SCOPE-20261021",
  displayName:"Inspection / Site Survey / FAT / SAT",
  sourceAuthority:"BOD post-site-survey change register plus seven current project locations; commercial category B3 ITP/inspection",
  note:"Pre-SAT engineering/technical survey is part of B3 scope; separate crew, POB, visit days and travel require WBS evidence before price selection. Old BOD post-survey comments do NOT prove this field visit was costed.",
  rows,locations:7,scopeIncluded:true,alreadyPricedInCurrentSelectedB3:false,
  personnelAndDayRateNeedsSource:true,physicalSurveyCountVerified:false,
  newIncrementalWorkingSellTHB:null,verifiedDirectCostTHB:null,
  noDoubleCountOwners:Object.freeze(["B1 design review","B2 report/VDRL control","B3 field survey and separate SAT"]),
  postingAllowed:false,releaseAllowed:false
 });
}
