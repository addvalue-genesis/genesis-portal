// Estimator assumptions for owner review, 30-Oct-2026. No canonical price import/write.
// Duration and utilisation are NOT an agreed schedule or approved staffing plan.
import {selectB1ProjectSupportBudget0553} from "./b1ProjectSupportBudget0553";
import {evaluateB2VdrlIndependentScenario0553} from "./b2IndependentVdrlRecalculation0553";
import {quoteUsd0553} from "./officialUsdRelease0553";
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
export const B1_LIFECYCLE_REVIEW_0553=Object.freeze({
 date:"2026-10-30",durationMonths:[6,9,12],weeksPerMonth:52/12,
 // All weekly hours replace the existing milestone role allowance; never added to it.
 weeklyHours:Object.freeze({PM:4,COORD:8,ADMIN:3,PROCUREMENT:2,ACCOUNTANT:1,FINANCE_MANAGER:0.5}),
 regulatoryHours:40, // Separate specialist filing support, not PM/coordinator time.
 meetingsPerQuarter:1,engineeringProxyRole:"PM",
 sourceModuleId:"bid.budget.working.bc.b1.audit.engineering-review",
 authority:"ESTIMATOR_WHAT_IF_NOT_OWNER_SELECTED",postingAllowed:false,
 instrumentLicenceAllowance:Object.freeze({sellTHB:100000,
  authority:"USER_SELECTED_INCREMENTAL_SELL_ALLOWANCE_20261030",
  classification:"PROVISIONAL_SELL_NOT_VERIFIED_COST",currency:"THB",
  scope:"Additional Myanmar licensing service for Instrument Wireless Gateway and Antenna",
  replacesIllustrativeUSD:1600,verifiedCostTHB:null,firmPartnerQuote:false}),
 engineering:Object.freeze([
  {id:"SI-01",title:"Cross-system responsibility and technical exception decisions",qty:4,hoursPerUnit:8,boundary:"Four MR decision packages; excludes B2 requirement/document review and OEM design"},
  {id:"SI-02",title:"Integration/interface decisions across the four MR systems",qty:4,hoursPerUnit:8,boundary:"Design authority decisions only; excludes drawing authorship and B9 onsite configuration"},
  {id:"SI-03",title:"Brownfield interface decisions: ZPQ, ZWP8 and ZWP11",qty:3,hoursPerUnit:8,boundary:"Desktop interface resolution; excludes B3 survey, travel, test and field execution"},
  {id:"SI-04",title:"Supplier technical deviation resolution",qty:4,hoursPerUnit:6,boundary:"Assumed four work packages, not verified supplier count; excludes B2 TBE/document work"},
  {id:"SI-05",title:"SI readiness decision before execution",qty:4,hoursPerUnit:4,boundary:"System-level release decision; excludes B3 FAT/SAT procedure, witness and execution"},
  {id:"SI-06",title:"Final technical acceptance decision",qty:4,hoursPerUnit:4,boundary:"Residual SI acceptance only; excludes B2 final dossier and B3/B9 punch/retest work"}
 ])
});
export function evaluateB1LifecycleReview0553({months=9,weeklyHours={},regulatoryHours=B1_LIFECYCLE_REVIEW_0553.regulatoryHours,engineeringHours=null}={}){
 const cfg=B1_LIFECYCLE_REVIEW_0553,base=selectB1ProjectSupportBudget0553();
 if(!Number.isFinite(months)||months<=0||months>36||!Number.isFinite(regulatoryHours)||regulatoryHours<0||regulatoryHours>2000)
  throw Error("Invalid B1 review duration or regulatory hours");
 if(Object.keys(weeklyHours).some(k=>!(k in cfg.weeklyHours)))throw Error("Unknown B1 support role");
 const weeks=months*cfg.weeksPerMonth;
 const roleRow=(key,hours)=>{
  const r=base.roleRates[key];
  const raw=hours*r.monthlyTHB*base.employerLoadFactor/base.workHoursPerMonth;
  return {key,role:r.name,account:r.account,hours,monthlyTHB:r.monthlyTHB,
   planningCostTHB:round(raw),candidateSellTHB:round(raw/(1-base.laborGrossMarginTarget))};
 };
 const support=Object.entries(cfg.weeklyHours).map(([key,fallback])=>{
  const hoursPerWeek=weeklyHours[key]??fallback;
  if(!Number.isFinite(hoursPerWeek)||hoursPerWeek<0||hoursPerWeek>40)throw Error("Invalid B1 weekly hours");
  return {...roleRow(key,weeks*hoursPerWeek),hoursPerWeek};
 });
 const regulatory=roleRow("REGULATORY",regulatoryHours);
 const expenses=base.expenseLines.map(r=>{
  const qty=r.id==="B1-EXP-OFFICE"?months:r.id==="B1-EXP-MEET"?Math.ceil(months/3)*cfg.meetingsPerQuarter:r.qty;
  return {...r,qty,planningCostTHB:round(qty*r.unitCostTHB),candidateSellTHB:round(qty*r.unitCostTHB*(r.sellFactor??base.expenseHandlingSellFactor))};
 });
 const engineering=cfg.engineering.map(r=>({...r,hours:r.qty*r.hoursPerUnit,ownerVerified:false}));
 const technicalHours=engineeringHours??engineering.reduce((n,r)=>n+r.hours,0);
 if(!Number.isFinite(technicalHours)||technicalHours<0||technicalHours>5000)throw Error("Invalid B1 SI review hours");
 // This is an explicit PM-salary cost proxy, NOT a verified SI engineer salary/rate.
 const technical=roleRow(cfg.engineeringProxyRole,technicalHours);
 const rows=[...support,regulatory,...expenses];
 const floorCost=round(rows.reduce((n,r)=>n+r.planningCostTHB,0));
 const floorSell=round(rows.reduce((n,r)=>n+r.candidateSellTHB,0));
 const candidateSellTHB=round(floorSell+technical.candidateSellTHB);
 const candidateCostTHB=round(floorCost+technical.planningCostTHB);
 const currentOfficialUSD=quoteUsd0553(base.baseWorkingSellTHB);
 const candidateOfficialUSD=quoteUsd0553(candidateSellTHB);
 const instrumentExtraSellTHB=cfg.instrumentLicenceAllowance.sellTHB;
 const withInstrumentSellTHB=round(candidateSellTHB+instrumentExtraSellTHB);
 const withInstrumentOfficialUSD=quoteUsd0553(withInstrumentSellTHB);
 const b2=evaluateB2VdrlIndependentScenario0553();
 return {moduleId:cfg.sourceModuleId,months,weeks,support,regulatory,expenses,engineering,
  technical:{...technical,proxy:true,sourceRole:cfg.engineeringProxyRole,ownerVerified:false},
  supportAndExistingScopeCostTHB:floorCost,supportAndExistingScopeSellTHB:floorSell,
  supportAndExistingScopeOfficialUSD:quoteUsd0553(floorSell),candidateCostTHB,candidateSellTHB,candidateOfficialUSD,
  currentCostTHB:base.baseWorkingCostTHB,currentSellTHB:base.baseWorkingSellTHB,currentOfficialUSD,
  deltaSellTHB:round(candidateSellTHB-base.baseWorkingSellTHB),deltaOfficialUSD:candidateOfficialUSD-currentOfficialUSD,
  currentSupportHours:base.roleLines.filter(r=>r.role!=="REGULATORY").reduce((n,r)=>n+r.qty,0),
  proposedSupportHours:support.reduce((n,r)=>n+r.hours,0),
  b2SelectedMH:b2.result.selectedB2MH,b2TechnicalAuthorExcludedMH:b2.result.excludedOtherOwnerMH,
  b2SourceUrl:b2.sourceUrl,existingMyanmarExternalCostTHB:expenses.filter(r=>r.id.startsWith("B1-MM-")).reduce((n,r)=>n+r.planningCostTHB,0),
  existingMyanmarReservesCostTHB:expenses.filter(r=>["B1-MM-ADDITIONAL","B1-MM-REWORK"].includes(r.id)).reduce((n,r)=>n+r.planningCostTHB,0),
  instrumentAllowance:cfg.instrumentLicenceAllowance,
  instrumentExtraCostTHB:null,instrumentExtraSellTHB,instrumentExtraIncluded:true,
  withInstrumentSellTHB,withInstrumentOfficialUSD,withInstrumentCostTHB:null,
  withInstrumentDeltaOfficialUSD:withInstrumentOfficialUSD-currentOfficialUSD,
  verifiedDirectCostTHB:null,postingAllowed:false,customerReleaseAllowed:false,selected:false,
  openGates:["Confirm award-to-final-acceptance duration, licensing lead time and extension/warranty support obligations.",
   "Approve weekly role utilisation and actual loaded payroll; the six/nine/twelve month cases are assumptions.",
   "Check every SI decision package against B2's 131 work objects, Part A OEM design and B3/B9 execution before accepting any technical hours.",
   "Replace the PM salary proxy with an agreed SI engineering role rate; 144 hours are new estimator assumptions, not historical 964-MH carry-forward.",
   "Confirm actual meeting/trip counts; this case retains two management person-trips and six room-nights.",
   "Owner selected THB100000 incremental Instrument licence SELL allowance, replacing the illustrative USD1600. Actual cost, partner quotation, models, quantities and serials remain unconfirmed; no automatic posting or claim of firm premium/fee.",
   "Review use of existing THB96250 Myanmar reserves; never treat them as wholly free or automatically add another reserve for the same work.",
   "Check recurring licence/third-party charges and government fees if applicable; existing external package is not proof of validity for every duration."]};
}
