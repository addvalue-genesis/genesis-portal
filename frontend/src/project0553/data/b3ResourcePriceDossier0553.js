// PJ2608-0553 — B2-style, source-linked B3 work/crew/day/rate dossier.
// Read-only detailed decomposition of the ONE selected WS-B3 amount, not a
// new calculator that can override 10.2/10.3/10.5 customer budgets.
// Source values: management-selected B3 SAT28 / BF Survey 3+2 resource days, B3 China FAT eight rows,
// MGW P26-058_R2 SERV-2/4 and temporary VeEX rental. Actual Direct Cost null.
// RACI-limited NEW scope: BOD C2 §8 BF revisit conditional; SPE C2
// §7.3.2 Yard SAT; §7.3.3 Offshore Vendor commissioning — unpriced.
// Dollar rates here are pre-award SELL or vendor quotation, NOT payroll cost.
import {selectB3SurveySatExecutionPlan0553} from "./b3SurveySatExecutionPlan0553";
import {selectB3SiteMrSatCoverage0553} from "./b3SiteMrSatCoverage0553";
const root="bid.budget.working.bc.b3.resource-price-dossier";
const freeze=Object.freeze;
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const total=rows=>round(rows.reduce((n,r)=>n+(Number.isFinite(r.workingSellTHB)?r.workingSellTHB:0),0));
const resourceRoles=freeze(["Senior Telecom Systems Integration Engineer","Senior RF/Telecom Field Specialist"]);
const make=(phase,short,obj)=>freeze({
 id:root+"."+phase+"."+short.toLowerCase(),
 pricePostingOwner:"WS-B3",workingCostTHB:null,actualDirectCostTHB:null,
 customerReleaseAllowed:false,...obj
});
const stage=(name,rows,reference)=>{
 const priced=rows.filter(x=>x.postingClass==="INCLUDED_SELECTED_B3_WORKING_SELL");
 return freeze({
  name,rows:freeze(rows),reference,
  pricePostingOwner:"WS-B3",
  selectedWorkingSellTHB:total(priced),
  directCostTHB:null,
  rowCount:rows.length
 });
};
export function selectB3ResourcePriceDossier0553(workingRow){
 if(!workingRow||workingRow.code!=="B3")throw Error("B3 dossier requires selected 10.2 owner row");
 const sat=workingRow.b3FortyDayBudget; // historical
 const satSelected=workingRow.b3SelectedSatSurveyBudget;
 const fat=workingRow.b3ChinaFatBudget;
 const mgw=workingRow.b3MgwPurchasedFatWorkingSell;
 const plan=selectB3SurveySatExecutionPlan0553(workingRow);
 const matrix=selectB3SiteMrSatCoverage0553();
 const rateUSD=sat.rateUSDPerPersonDay,fx=sat.fxTHBPerUSD;
 const rateTHB=round(rateUSD*fx);
 const satLines=satSelected.satRows.flatMap(box=>{
  const mrTests=matrix.budgetarySiteTimeboxes.find(x=>x.id===box.id)?.testIds||[];
  return resourceRoles.map((role,i)=>make("sat-baseline",box.id.toLowerCase()+".person-"+(i+1),{
   group:"SAT_SELECTED_28D",site:box.site,wbs:box.wbs,work:box.work,
   role,people:1,teamDays:box.days,qty:box.days,unit:"person-day",unitRateTHB:rateTHB,
   rateUSDPerUnit:rateUSD,fxTHBPerUSD:fx,
   calculation:"1 person × "+box.days+" days × USD "+rateUSD+" × FX "+fx,
   workingSellTHB:round(box.days*rateTHB),
   sourceModuleId:satSelected.moduleId,sourceType:"CURRENT_SELECTED_SAT_28_DAY_WORKING_BUDGET__GF_YARD_OFFSHORE_RACI_NOT_APPROVED",
   linkedTestIds:freeze(mrTests),
   postingClass:"INCLUDED_SELECTED_B3_WORKING_SELL",
   verifiedRateType:"PRE_AWARD_WORKING_SELL_RATE",
   stageAllocationConfirmed:false
  }));
 });
 const fatRows=fat.rows.filter(r=>r.costOwner==="B3"&&!r.optional);
 const fatLines=fatRows.map(r=>make("fat-witness",r.id.toLowerCase(),{
  group:"FAT_WITNESS",site:"MGW Nantong, China (venue subject to confirmation)",wbs:r.wbs,
  work:r.description,role:r.id==="B3-FAT-STAFF"?"2 FAT paid witnesses (PM/Chief Telecom Engineer + Sr Telecom Engineer)":
   "FAT witness travel / accommodation / insurance expense",
  people:r.id==="B3-FAT-STAFF"?2:null,
  teamDays:r.id==="B3-FAT-STAFF"?6:r.id==="B3-TRAVEL-DAYS"?2:null,
  qty:r.qty,unit:r.unit,unitRateTHB:r.unitRateTHB,
  rateUSDPerUnit:null,fxTHBPerUSD:null,
  calculation:r.qty+" "+r.unit+" × THB "+r.unitRateTHB,
  workingSellTHB:r.workingSellTHB,
  sourceModuleId:r.moduleId,sourceType:r.status,sourceEvidence:r.evidence,
  postingClass:"INCLUDED_SELECTED_B3_WORKING_SELL",
  verifiedRateType:"USER_OR_ESTIMATOR_WORKING_SELL_ALLOWANCE",
  stageAllocationConfirmed:true
 }));
 const mgwLines=mgw.quoteLines.map(q=>make("mgw-vendor",q.serviceId.toLowerCase(),{
  group:"MGW_PURCHASED_FAT",site:mgw.policy.executionLocation,wbs:"K01",
  work:q.description,role:"MGW service / facility",people:null,teamDays:null,
  qty:q.qty,unit:q.unit,rateUSDPerUnit:q.quotedUnitUSD,
  fxTHBPerUSD:mgw.policy.workingFXTHBPerUSD,
  unitRateTHB:round(q.quotedCostTHB/q.qty),
  quotedVendorCostTHB:q.quotedCostTHB,
  markupSamtelTHB:round(q.quotedCostTHB*.20),
  markupAddvalueTHB:round(q.quotedCostTHB*.05),
  markupReserveTHB:round(q.quotedCostTHB*.05),
  calculation:q.qty+" × USD "+q.quotedUnitUSD+" × FX "+mgw.policy.workingFXTHBPerUSD+" × 1.30",
  workingSellTHB:round(q.quotedCostTHB*1.30),
  sourceModuleId:mgw.moduleId,sourceEvidence:q.vendorQuoteSourceUrl,
  sourceType:"MGW_VENDOR_QUOTE_NOT_PAID_ACTUAL_COST",
  postingClass:"INCLUDED_SELECTED_B3_WORKING_SELL",
  verifiedRateType:"QUOTED_SUPPLIER_COST_PLUS_SELECTED_20_5_5",
  stageAllocationConfirmed:true
 }));
 const veex=sat.veex;
 const rental=[make("tools","veex-mx100",{
  group:"TEMPORARY_SAT_TOOL",site:"Shared; FAT/SAT scope, site allocation unverified",
  work:"Temporary VeEX MX100+ test equipment rental (not permanent B11 O&M tools)",
  role:"Rental equipment",people:null,teamDays:veex.quantity,
  qty:veex.quantity,unit:veex.unit,unitRateTHB:veex.rateTHB,
  calculation:veex.quantity+" rental-days × THB "+veex.rateTHB,
  workingSellTHB:veex.workingSellTHB,
  sourceModuleId:"bid.budget.working.bc.b3.veex-mx100",
  sourceType:"REV_P_PRE_AWARD_RENTAL_ESTIMATE_EX_VAT",
  postingClass:"INCLUDED_SELECTED_B3_WORKING_SELL",
  verifiedRateType:"PROVISIONAL_RENTAL_SELL_ALLOWANCE",
  stageAllocationConfirmed:false
 })];
 const bfLines=satSelected.siteSurveyRows.filter(x=>x.id!=="SUR-TRAVEL").flatMap((r)=>{
  return resourceRoles.map((role,i)=>make("bf-conditional",r.site.toLowerCase()+".person-"+(i+1),{
   group:"BF_SELECTED_SURVEY_ALLOWANCE",site:r.site,wbs:"BOD Rev.C2 §8",
   work:r.work,role,people:1,teamDays:r.days,
   qty:r.days,unit:"person-day",unitRateTHB:rateTHB,
   calculation:"1 person × "+r.days+" selected-budget BF Survey site-day × THB "+rateTHB,
   workingSellTHB:round(r.days*rateTHB),sourceModuleId:satSelected.moduleId,
   sourceType:"SELECTED_WORKING_SELL_SURVEY_ALLOWANCE__BF_PHYSICAL_CALL_OUT_PENDING",
   postingClass:"INCLUDED_SELECTED_B3_WORKING_SELL",
   stageAllocationConfirmed:false
  }));
 });
 const bfTripLines=resourceRoles.map((role,i)=>make("bf-conditional","trip.person-"+(i+1),{
  group:"BF_SELECTED_SURVEY_ALLOWANCE",site:"BF joint roundtrip",wbs:"BOD Rev.C2 §8",
  work:"Only if separate ADDVALUE physical BF revisit/boat logistics required",
  role,people:1,teamDays:2,
  qty:2,unit:"person-day",unitRateTHB:rateTHB,
  calculation:"1 person × "+plan.survey.provisionalTravelTeamDaysIfCalled+" conditional travel-day × THB "+rateTHB,
  workingSellTHB:round(2*rateTHB),sourceModuleId:satSelected.moduleId,
  sourceType:"SELECTED_WORKING_SELL_SURVEY_TRAVEL_ALLOWANCE__TRIP_NOT_BOOKED",
  postingClass:"INCLUDED_SELECTED_B3_WORKING_SELL",
  stageAllocationConfirmed:false
 }));
 // Yard/Offshore are distinct CONTRACT PHASES. Crosswalk each phase to
 // existing Site/MR Test IDs without multiplying the same shared price/crew.
 // Per-MR labour rate/duration MUST remain null until OEM/ITP/RACI approval.
 const pendingPhase=(rows,phase,workOwner)=>rows.flatMap(x=>{
  const tests=matrix.rows.filter(t=>t.site===x.site&&t.mr.startsWith("MR000"));
  if(!tests.length||tests.length!==x.linkedTestIds.length)
   throw Error("B3 GF phase source Test-ID coverage diverged at "+x.site);
  return tests.map(t=>make(phase,x.site.toLowerCase()+"."+t.mr.toLowerCase(),{
   group:workOwner,site:x.site,wbs:x.sourceClause+" / "+t.wbs,
   work:t.system+" — "+t.requiredFunction,phaseScope:x.activity,
   role:"ADDVALUE role / vendor RACI NOT APPROVED",
   people:null,teamDays:null,qty:null,unit:"person-day",
   unitRateTHB:null,rateUSDPerUnit:null,workingSellTHB:null,
   calculation:"Qty × role × working days × verified Direct Cost rate = NOT ESTABLISHED",
   sourceModuleId:t.moduleId,sourceType:x.status,
   mr:t.mr,linkedTestIds:freeze([t.id]),
   testInstruments:t.testInstruments,signoffEvidence:t.signoffEvidence,
   postingClass:"UNPRICED_REQUIREMENT_NONPOSTING",stageAllocationConfirmed:false
  }));
 });
 const yardLines=pendingPhase(plan.yardSat.rows,"gf-yard","GF_FABRICATION_YARD_SAT");
 const offshoreLines=pendingPhase(plan.offshore.rows,"gf-offshore","GF_OFFSHORE_COMMISSIONING");
 const sharedLines=plan.shared.map(x=>make("shared",x.id.toLowerCase(),{
  group:x.phase,site:x.site,wbs:"K17/K18",work:x.activity,
  role:"Approval-stage owner unresolved",people:null,teamDays:null,
  qty:null,unit:"team-day",unitRateTHB:null,
  workingSellTHB:null,calculation:"Confirm whether integrated test timebox belongs to Yard or Offshore",
  sourceModuleId:plan.moduleId,sourceType:x.status,
  postingClass:"UNPRICED_REQUIREMENT_NONPOSTING",stageAllocationConfirmed:false
 }));
 const stageGroups=freeze([
  stage("MGW Purchased Factory FAT — Quotation Cost → WS-B3 SELL",mgwLines,"B3.1.1"),
  stage("ADDVALUE China FAT — Witness / Travel / Hotel / Insurance",fatLines,"B3.1.2"),
  stage("Selected SAT/SIT 28 Team-days / 56 MD",satLines,"B3.2.1"),
  stage("Temporary VeEX MX100+ rental",rental,"B3.3.1"),
  stage("Selected BF Survey 3 site +2 travel Team-days / 10 MD (physical call-out conditional)",freeze([...bfLines,...bfTripLines]),"B3.2.3"),
  stage("JUTAL Zhuhai Fabrication Yard SAT — actual resource inputs OPEN",yardLines,"SPE §7.3.2"),
  stage("Offshore Vendor Commissioning after installation — actual resources OPEN",offshoreLines,"SPE §7.3.3"),
  stage("Integrated SIT and Punch — phase/RACI undecided",sharedLines,"K17–K18")
 ]);
 const priced=stageGroups.slice(0,5);
 const budgetSelected=total(priced.map(g=>({workingSellTHB:g.selectedWorkingSellTHB})));
 const picked=freeze(priced.map(g=>g.selectedWorkingSellTHB));
 const singleIds=stageGroups.flatMap(g=>g.rows.map(r=>r.id));
 if(new Set(singleIds).size!==singleIds.length||
    mgwLines.length!==2||fatLines.length!==8||satLines.length!==18||
    bfLines.length!==6||bfTripLines.length!==2||yardLines.length!==14||offshoreLines.length!==14||
    total(mgwLines)!==307125||total(fatLines)!==397400||total(satLines)!==1411200||total(bfLines)+total(bfTripLines)!==252000||
    total(rental)!==30000||budgetSelected!==2397725||
    workingRow.workingSellTHB!==budgetSelected||
    picked.join("|")!=="307125|397400|1411200|30000|252000"||
    plan.survey.conditionalLabourSellReferenceTHB!==252000||
    mgwLines.reduce((n,r)=>n+r.quotedVendorCostTHB,0)!==236250||
    stageGroups.slice(5).some(g=>g.selectedWorkingSellTHB!==0||
      g.rows.some(r=>r.workingSellTHB!==null||r.actualDirectCostTHB!==null)))
  throw Error("B3 detailed dossier does not reconcile to 10.2 canonical Working SELL");
 return freeze({
  moduleId:root,ownerModuleId:workingRow.moduleId,
  groupNames:freeze(["MGW Purchased FAT","ADDVALUE FAT witness","Selected SAT 28d priced resource roles",
   "VeEX Rental","Selected BF survey working budget","GF Yard SAT","GF Offshore commissioning","SIT/Punch Gate"]),
  groups:stageGroups,pricedGroupCount:priced.length,
  priceRowCount:mgwLines.length+fatLines.length+satLines.length+rental.length+bfLines.length+bfTripLines.length,
  pricedWorkingSellTHB:budgetSelected,selectedCanonicalWorkingSellTHB:workingRow.workingSellTHB,
  vendorQuoteCostTHB:236250,actualPaidDirectCostTHB:null,
  noApprovedStagePersonDays:true,
  oldLeanScenarioReferenceTeamDays:plan.sat.oldLeanWithRiskTeamDays,
  oldPriceReferenceTeamDays:sat.workdays,
  currentSATTeamDays:satSelected.satTeamDays,currentBFSurveyTeamDays:satSelected.siteSurveyTeamDays,
  bfSelectedSurveyWorkingSellTHB:satSelected.siteSurveyWorkingSellTHB,
  bfOptionalIllustrativeSellTHB:plan.survey.conditionalLabourSellReferenceTHB,
  currentBFRevisitRequired:null,
  customerReleaseAllowed:false,postingAllowed:false,
  releaseProjectionSource:"bcTurnkeyWorkingCost0553.js / B3 → releaseCommercialModel0553.js / B3",
  noPriceMutation:true
 });
}
