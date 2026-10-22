// 10.2 B3 Site Survey scope, required as distinct pre-SAT reconnaissance.
// No proven staff/team-day/travel price is inside the currently selected 40-day SAT.
// BOD Rev.C2 §8 already records BF survey results at ZPQ, ZWP8, ZWP11.
// Seven project locations means review coverage, NOT seven new physical visits.
// SPE Rev.C2 §7.3.2 Yard SAT and §7.3.3 Offshore Commissioning are separate.
// Do not use SAT Test IDs to create paid Site Survey days.
const SITES=Object.freeze(["ZPQ","ZWP8","ZWP11","ZWP20","ZWP21","ZWP22","ZWP23"]);
export function selectB3SiteSurveyScope0553(){
 const rows=Object.freeze(SITES.map((site,i)=>Object.freeze({
  sourceId:"B3-SUR-"+site,site,
  purpose:site==="ZPQ"||site==="ZWP8"||site==="ZWP11"?
   "Brownfield existing-asset/IDU/Cisco interface, rack/earthing/cable path verification":
   "Greenfield layout, access, network/RF interfaces, hazardous-area and cable route readiness",
  activityOwner:"B3_TECHNICAL_SITE_REVIEW__PHYSICAL_VISIT_CONDITIONAL",reportOwner:"B2_VDRL_FINAL_DOCUMENT_CONTROL_ONLY",
  siteClass:site==="ZPQ"||site==="ZWP8"||site==="ZWP11"?"BF":"GF",
  oldBodSurveyResultsExist:site==="ZPQ"||site==="ZWP8"||site==="ZWP11",
  newPhysicalVisitApproved:false,newPhysicalVisitRequired:null,
  scopeDocumentReviewRequired:true,approvedOnsiteDays:null,
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
  note:"Seven locations are project technical review scope, not seven new physical field-survey trips. BOD §8 contains existing BF site survey findings at ZPQ/ZWP8/ZWP11. Optional BF re-verification must have evidence of a gap and written RACI/call-out. GF yard SAT and offshore commissioning are distinct vendor execution phases under SPE §7.3.2/7.3.3; no unapproved site visits or cost postings.",
  priorBFSurveyResultsPresent:true,newSevenSiteSurveyRequired:false,
  bfPhysicalRevisitCandidateSites:Object.freeze(["ZPQ","ZWP8","ZWP11"]),
  gfPhysicalSurveyNewRequirementEstablished:false,
  rows,locations:7,scopeIncluded:true,alreadyPricedInCurrentSelectedB3:false,
  personnelAndDayRateNeedsSource:true,physicalSurveyCountVerified:false,
  newIncrementalWorkingSellTHB:null,verifiedDirectCostTHB:null,
  noDoubleCountOwners:Object.freeze(["B1 design review","B2 report/VDRL control","B3 field survey and separate SAT"]),
  postingAllowed:false,releaseAllowed:false
 });
}
