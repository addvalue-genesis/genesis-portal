// PJ2608-0553 / 10.2 B3.1–B3.4 price projection.
// Read ONLY from canonical B3 Working SELL + latest MGW Supplier Cover.
// The supplier execution/facility lines are cost evidence, never B3 SELL additions.
import {selectB3WorkingSellBreakdown0553} from "./b3WorkingSellBreakdown0553";
import {MGW_R2_COVER_20261020_0553 as cover} from "./mgwP26058R2Cover20261020";
const sum=rows=>Math.round(rows.reduce((n,x)=>n+x.workingSellTHB,0)*100)/100;
const byId=id=>cover.services.find(x=>x.id===id);
export function selectB3WorkTypeReconciliation0553(workingRow){
 const m=selectB3WorkingSellBreakdown0553(workingRow);
 if(!m)return null;
 const fat=m.summary.find(x=>x.id==="MGW-FAT");
 const offshore=m.summary.find(x=>x.id==="OFFSHORE");
 const tools=m.summary.find(x=>x.id==="VEEX");
 if(!fat||!offshore||!tools)throw Error("B3 group missing canonical source component");
 const items=[
  {id:"B3.1",moduleId:"bid.budget.working.bc.b3.fat",label:"FAT witness/travel/insurance",
   workingSellTHB:fat.workingSellTHB,sourceModuleId:fat.moduleId,postingAllowed:false},
  {id:"B3.2",moduleId:"bid.budget.working.bc.b3.sat",label:"Offshore SAT/SIT labour",
   workingSellTHB:offshore.workingSellTHB,sourceModuleId:offshore.moduleId,postingAllowed:false},
  {id:"B3.3",moduleId:"bid.budget.working.bc.b3.tools",label:"Temporary VeEX SAT rental",
   workingSellTHB:tools.workingSellTHB,sourceModuleId:tools.moduleId,postingAllowed:false},
  {id:"B3.4",moduleId:"bid.budget.working.bc.b3.audit",label:"Price reconciliation and cost audit — no independent SELL",
   workingSellTHB:null,sourceModuleId:m.moduleId,postingAllowed:false}
 ];
 const supplierServices=[byId("SERV-2"),byId("SERV-4")];
 if(supplierServices.some(x=>!x||x.workingSellPostingAllowed||x.workingCostPostingAllowed))
  throw Error("B3 supplier iFAT/facility cannot become a second B3 working price");
 const vendorFatUSD=supplierServices.reduce((n,x)=>n+x.usd,0);
 if(vendorFatUSD!==7500||cover.overallTotalUSD!==368841||
  sum(items.filter(x=>Number.isFinite(x.workingSellTHB)))!==m.totalWorkingSellTHB||
  m.totalWorkingSellTHB!==workingRow.workingSellTHB||
  items[3].workingSellTHB!==null||m.verifiedDirectCostTHB!==null)
  throw Error("B3 group SELL reconciliation or MGW quote separation diverged");
 const supplier=Object.freeze({
  moduleId:"bid.budget.working.bc.b3.mgw-r2-cover-20261020",
  quoteNumber:cover.quoteNumber,quoteDate:cover.quoteDate,
  quoteOverallUSD:cover.overallTotalUSD,
  serviceRows:Object.freeze(supplierServices.map(x=>Object.freeze({
   id:x.id,description:x.description,supplierCostUSD:x.usd,sourceUrl:x.sourceUrl,
   ownerCandidate:x.ownerCandidate,workingSellPostingAllowed:false,
   directCostPostingAllowed:false
  }))),
  serviceSubtotalUSD:vendorFatUSD,
  internalIFATDays:cover.FAT.internalFatDays,
  endUserFacilityDaysMinimum:cover.FAT.facilityEndUserDaysMinimum,
  addvalueWitnessBudgetDays:cover.FAT.addvalueExistingWitnessDaysBudgeted,
  managementSeparateSequentialFATStagesConfirmed:cover.FAT.managementDistinctFATStagesConfirmed,
  plannedExecutionOrder:cover.FAT.executionOrder,
  internalAndCustomerFATScopeDuplicate:cover.FAT.quotedServiceOverlap,
  supplierFATServicesAlreadyQuotedOnce:true,
  customerFATReserveDaysMinimum:cover.FAT.facilityEndUserDaysMinimum,
  freightAfterCustomerFATPlanned:cover.FAT.freightAfterCustomerFATPlanned,
  supplierFATServiceCreditUSD:cover.FAT.supplierFATPriceCreditUSD,
  actualFATAgendaAndDatesConfirmed:false,
  actualADDVALUEWitnessAttendanceDaysConfirmed:false,
  addvalueWitnessLaborIncludedInSupplierUSD:null,
  supplierVendorServiceCostOwnerApproved:false,
  alreadyIncludedInMGWCommercialCover:true,
  b3WorkingSellComponentTHB:fat.workingSellTHB,
  b3ActualDirectCostTHB:null,
  approvedAdditionalWorkingSellTHB:null,
  plannedDistinctSupplierActivitiesNoPriceDuplication:true,
  noVendorCostPostingFromThisReadModel:true,
  governance:"User-directed plan: Stage 1 MGW/ADDVALUE internal iFAT (2 days), Stage 2 separate customer FAT premises reserve (minimum 5 days), Stage 3 ship equipment to JUTAL Zhuhai Yard after FAT. SERV-2 USD5000 and SERV-4 USD2500 are distinct, not duplicates; both are included once in MGW supplier total. ADDVALUE B3 Working SELL remains 6 witness-day budget, not an automatic seven-day personnel commitment. Actual attendance, agreed FAT agenda, supplier cost allocation and Incoterm are still unapproved. No Working SELL/cost ledger automatic posting."
 });
 return Object.freeze({
  moduleId:"bid.budget.working.bc.b3.worktype-accordion",
  parentOwnerModuleId:"bid.budget.working.bc.b3",
  categories:Object.freeze(items.map(x=>Object.freeze(x))),
  totalWorkingSellTHB:m.totalWorkingSellTHB,
  directCostTHB:null,customerReleaseAllowed:false,
  supplierFat:supplier,categoryTotalsAreReadOnly:true
 });
}
