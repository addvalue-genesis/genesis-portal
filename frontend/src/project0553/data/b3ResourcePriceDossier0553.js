// PJ2608-0553 — B2-style, source-linked B3 work/crew/day/rate dossier.
// Read-only detailed decomposition of the ONE selected WS-B3 amount, not a
// new calculator that can override 10.2/10.3/10.5 customer budgets.
// Source values: B3 40-day priced timeboxes, B3 China FAT eight rows,
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
 const sat=workingRow.b3FortyDayBudget;
 const fat=workingRow.b3ChinaFatBudget;
 const mgw=workingRow.b3MgwPurchasedFatWorkingSell;
 const plan=selectB3SurveySatExecutionPlan0553(workingRow);
 const matrix=selectB3SiteMrSatCoverage0553();
 const rateUSD=sat.rateUSDPerPersonDay,fx=sat.fxTHBPerUSD;
 const rateTHB=round(rateUSD*fx);
 const satLines=sat.rows.flatMap(box=>{
  const mrTests=matrix.budgetarySiteTimeboxes.find(x=>x.id===box.id)?.testIds||[];
  return resourceRoles.map((role,i)=>make("sat-baseline",box.id.toLowerCase()+".person-"+(i+1),{
   group:"SAT_BASELINE",site:box.site,wbs:box.wbs,work:box.reason,
   role,people:1,teamDays:box.days,qty:box.days,unit:"person-day",unitRateTHB:rateTHB,
   rateUSDPerUnit:rateUSD,fxTHBPerUSD:fx,
   calculation:"1 person × "+box.days+" days × USD "+rateUSD+" × FX "+fx,
   workingSellTHB:round(box.days*rateTHB),
   sourceModuleId:sat.moduleId,sourceType:"CURRENT_SELECTED_40_DAY_PRICING_BASIS__NOT_APPROVED_DEPLOYMENT",
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
 const bfLines=plan.survey.rows.flatMap((r)=>{
  return resourceRoles.map((role,i)=>make("bf-conditional",r.site.toLowerCase()+".person-"+(i+1),{
   group:"BF_REVISIT_OPTION",site:r.site,wbs:"BOD Rev.C2 §8",
   work:r.recommendedWork,role,people:1,teamDays:r.provisionalTeamDaysIfCalled,
   qty:r.provisionalTeamDaysIfCalled,unit:"person-day",unitRateTHB:rateTHB,
   calculation:"1 person × "+r.provisionalTeamDaysIfCalled+" conditional site-day × THB "+rateTHB,
   illustrativeOnlyTHB:round(r.provisionalTeamDaysIfCalled*rateTHB),
   workingSellTHB:null,sourceModuleId:plan.moduleId,
   sourceType:"OPTIONAL_BF_REVISIT_ONLY_IF_WRITTEN_GAP_AND_CALL_OUT",
   postingClass:"UNPRICED_CONDITIONAL_NONPOSTING",
   stageAllocationConfirmed:false
  }));
 });
 const bfTripLines=resourceRoles.map((role,i)=>make("bf-conditional","trip.person-"+(i+1),{
  group:"BF_REVISIT_OPTION",site:"BF joint roundtrip",wbs:"BOD Rev.C2 §8",
  work:"Only if separate ADDVALUE physical BF revisit/boat logistics required",
  role,people:1,teamDays:plan.survey.provisionalTravelTeamDaysIfCalled,
  qty:plan.survey.provisionalTravelTeamDaysIfCalled,unit:"person-day",unitRateTHB:rateTHB,
  calculation:"1 person × "+plan.survey.provisionalTravelTeamDaysIfCalled+" conditional travel-day × THB "+rateTHB,
  illustrativeOnlyTHB:round(plan.survey.provisionalTravelTeamDaysIfCalled*rateTHB),
  workingSellTHB:null,sourceModuleId:plan.moduleId,
  sourceType:"OPTIONAL_BF_TRIP_NOT_BOOKED_OR_PRICED",
  postingClass:"UNPRICED_CONDITIONAL_NONPOSTING",
  stageAllocationConfirmed:false
 }));
 const pendingPhase=(rows,phase,workOwner)=>rows.map(x=>make(phase,x.site.toLowerCase(),{
  group:workOwner,site:x.site,wbs:x.sourceClause,
  work:x.activity,role:"ADDVALUE role / vendor RACI NOT APPROVED",
  people:null,teamDays:null,qty:null,unit:"person-day",
  unitRateTHB:null,rateUSDPerUnit:null,workingSellTHB:null,
  calculation:"Crew × working days × sourced Direct Cost rate = NOT ESTABLISHED",
  sourceModuleId:plan.moduleId,sourceType:x.status,
  linkedTestIds:x.linkedTestIds,
  postingClass:"UNPRICED_REQUIREMENT_NONPOSTING",stageAllocationConfirmed:false
 }));
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
  stage("Retained 40-Team-Day SAT/SIT labour PRICE BASELINE",satLines,"B3.2.1"),
  stage("Temporary VeEX MX100+ rental",rental,"B3.3.1"),
  stage("Brownfield conditional site re-verification — not current price",freeze([...bfLines,...bfTripLines]),"BOD §8"),
  stage("JUTAL Zhuhai Fabrication Yard SAT — actual resource inputs OPEN",yardLines,"SPE §7.3.2"),
  stage("Offshore Vendor Commissioning after installation — actual resources OPEN",offshoreLines,"SPE §7.3.3"),
  stage("Integrated SIT and Punch — phase/RACI undecided",sharedLines,"K17–K18")
 ]);
 const priced=stageGroups.slice(0,4);
 const budgetSelected=total(priced.map(g=>({workingSellTHB:g.selectedWorkingSellTHB})));
 const picked=freeze(priced.map(g=>g.selectedWorkingSellTHB));
 const singleIds=stageGroups.flatMap(g=>g.rows.map(r=>r.id));
 if(new Set(singleIds).size!==singleIds.length||
    mgwLines.length!==2||fatLines.length!==8||satLines.length!==18||
    bfLines.length!==6||bfTripLines.length!==2||yardLines.length!==4||offshoreLines.length!==4||
    total(mgwLines)!==307125||total(fatLines)!==397400||total(satLines)!==2016000||
    total(rental)!==30000||budgetSelected!==2750525||
    workingRow.workingSellTHB!==budgetSelected||
    picked.join("|")!=="307125|397400|2016000|30000"||
    plan.survey.conditionalLabourSellReferenceTHB!==252000||
    mgwLines.reduce((n,r)=>n+r.quotedVendorCostTHB,0)!==236250||
    stageGroups.slice(4).some(g=>g.selectedWorkingSellTHB!==0||
      g.rows.some(r=>r.workingSellTHB!==null||r.actualDirectCostTHB!==null)))
  throw Error("B3 detailed dossier does not reconcile to 10.2 canonical Working SELL");
 return freeze({
  moduleId:root,ownerModuleId:workingRow.moduleId,
  groupNames:freeze(["MGW Purchased FAT","ADDVALUE FAT witness","Retained SAT 40d priced resource roles",
   "VeEX Rental","BF conditional review","GF Yard SAT","GF Offshore commissioning","SIT/Punch Gate"]),
  groups:stageGroups,pricedGroupCount:priced.length,
  priceRowCount:mgwLines.length+fatLines.length+satLines.length+rental.length,
  pricedWorkingSellTHB:budgetSelected,selectedCanonicalWorkingSellTHB:workingRow.workingSellTHB,
  vendorQuoteCostTHB:236250,actualPaidDirectCostTHB:null,
  noApprovedStagePersonDays:true,
  oldLeanScenarioReferenceTeamDays:plan.sat.oldLeanWithRiskTeamDays,
  oldPriceReferenceTeamDays:sat.workdays,
  bfOptionalIllustrativeSellTHB:plan.survey.conditionalLabourSellReferenceTHB,
  currentBFRevisitRequired:null,
  customerReleaseAllowed:false,postingAllowed:false,
  releaseProjectionSource:"bcTurnkeyWorkingCost0553.js / B3 → releaseCommercialModel0553.js / B3",
  noPriceMutation:true
 });
}
