// 10.2 / B3+B8 China FIVE-DAY trip expense allocation AUDIT; NOT selected price.
// Existing source: b9ChinaWorkingBudget0553 (eight B3 expense IDs); original 6 days.
// Day 1-2 FAT, Day 3 spare, Day 4 Training, Day 5 Punch: user calendar,
// NOT equal to SERV-2 iFAT two days + SERV-4 minimum five facility days.
// This selector is nonposting and MUST NOT be imported as a price source by 10.3.
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const total=a=>round(a.reduce((sum,x)=>sum+x,0));
export function selectB3B8FiveDaySourceAllocation0553({b3,b8,trainingCrew=1}={}){
 if(b3?.code!=="B3"||b8?.code!=="B8"||![1,2].includes(trainingCrew))
  throw Error("Require canonical B3/B8 and scenario training crew=1 or 2");
 const china=b3.b3ChinaFatBudget;
 const source=china?.rows.filter(r=>r.costOwner==="B3"&&!r.optional)||[];
 const ids=new Set(source.map(r=>r.id));
 const purchased=b3.b3MgwPurchasedFatWorkingSell;
 if(source.length!==8||ids.size!==8||china.fatWorkingSellTHB!==263700||
  b3.workingSellTHB!==2133300||b8.workingSellTHB!==151550||b8.qtyDriver!==1||
  purchased?.selectedIncrementalWorkingSellTHB!==0||
  purchased?.vendorPurchasedQuoteTHB!==0)
  throw Error("Source has changed: review six-day B3/B8 and SERV-2/4 before reallocation");
 const staffing=source.find(r=>r.id==="B3-FAT-STAFF");
 if(staffing?.qty!==12||staffing?.unitRateTHB!==20475||
  staffing?.workingSellTHB!==245700)
  throw Error("Existing 12-MD witness labor source not established");
 const programme=Object.freeze([
  {day:1,activity:"Formal customer FAT / ITP day 1",b3MD:2,b8MD:0},
  {day:2,activity:"Formal customer FAT / ITP day 2",b3MD:2,b8MD:0},
  {day:3,activity:"FAT spare / retest",b3MD:2,b8MD:0},
  {day:4,activity:"Training at SAMTEL (approval open)",b3MD:2-trainingCrew,b8MD:trainingCrew},
  {day:5,activity:"Punch list and closeout",b3MD:2,b8MD:0}
 ].map(d=>Object.freeze({...d,postingAllowed:false})));
 const b3MD=total(programme.map(d=>d.b3MD));
 const b8MD=total(programme.map(d=>d.b8MD));
 const onsiteMD=b3MD+b8MD;
 if(onsiteMD!==10)throw Error("Five-day two-person trip requires ten onsite MD");
 const rows=Object.freeze(source.map(r=>{
  // Reduce only onsite labor from 12 to 10 MD. All other source quantities
  // (including the unresolved fourteen hotel room-nights) remain AS-IS.
  // Pro-rata travel allocation is an audit assumption, not an invoice split.
  const scenarioQty=r.id===staffing.id?onsiteMD:r.qty;
  const scenarioSell=round(scenarioQty*r.unitRateTHB);
  const b8=r.id===staffing.id?round(b8MD*r.unitRateTHB):
   round(scenarioSell*b8MD/onsiteMD);
  const b3=round(scenarioSell-b8);
  if(round(b3+b8)!==scenarioSell||r.directCostTHB!==null||!r.internalCostLineId)
   throw Error("Unique expense conservation failed: "+r.id);
  return Object.freeze({
   sourceExpenseId:r.id,sourceInternalCostLineId:r.internalCostLineId,
   originalSourceQty:r.qty,scenarioQty,unit:r.unit,
   originalWorkingSellTHB:r.workingSellTHB,scenarioWorkingSellTHB:scenarioSell,
   proposedB3AllocationTHB:b3,proposedB8AllocationTHB:b8,
   ownerAllocation:"B3_B8_NONPOSTING",allocationBasis:r.id===staffing.id?
    "ONSITE_PERSON_DAYS":"SHARED_TRIP_EXPENSE_PRORATA_PERSON_DAYS",
   verifiedDirectCostTHB:null,postingAllowed:false
  });
 }));
 const sourceSell=total(rows.map(r=>r.originalWorkingSellTHB));
 const scenarioSell=total(rows.map(r=>r.scenarioWorkingSellTHB));
 const b3Alloc=total(rows.map(r=>r.proposedB3AllocationTHB));
 const b8Alloc=total(rows.map(r=>r.proposedB8AllocationTHB));
 if(sourceSell!==263700||scenarioSell!==222750||
  round(b3Alloc+b8Alloc)!==scenarioSell||sourceSell-scenarioSell!==40950||
  new Set(rows.map(r=>r.sourceExpenseId)).size!==8)
  throw Error("B3/B8 five-day scenario is not financially conserved");
 return Object.freeze({
  moduleId:"bid.budget.working.bc.b3.fat-training-5d-source-allocation",
  scenarioId:"SC-B3-B8-SAMTEL-FIVE-DAY-NONPOSTING",
  sourceModuleId:"bid.budget.working.bc.b3.revk-china-budget",
  targetOwnerModuleIds:Object.freeze(["bid.budget.working.bc.b3","bid.budget.working.bc.b8"]),
  authority:"USER_DESCRIBED_5_DAY_SCHEDULE__COST_SPLIT_NOT_APPROVED",
  status:"NONPOSTING_WHAT_IF__HOLD",
  programme,trainingCrew,b3OnsitePersonDays:b3MD,b8OnsitePersonDays:b8MD,
  originalExpenseRows:8,allocations:rows,
  originalChinaTripSellTHB:sourceSell,fiveDayTripReferenceTHB:scenarioSell,
  b3TripAllocatedReferenceTHB:b3Alloc,b8TripAllocatedReferenceTHB:b8Alloc,
  originalB8WorkingSellTHB:30000, // historical Rev05-only source reference, not current WS-B8
  originalB8Hours:44,currentSelectedB8HybridTrainingWorkingSellTHB:b8.workingSellTHB,trainingPreparationOverlapReconciled:false,
  mgwSupplierQuotedUSD:purchased.vendorPurchasedQuoteUSD,mgwSupplierQuotedTHB:purchased.vendorPurchasedQuoteTHB,
  mgwPurchasedInB3WorkingSellTHB:purchased.selectedIncrementalWorkingSellTHB,
  supplierSERV2SERV4Unchanged:true,customerIFATLineAllowed:false,
  existingSourceHotelRoomNights:source.find(r=>r.id==="B3-HOTEL")?.qty??null,
  approvedFiveDayHotelRoomNights:null,approvedTrainingCrew:null,
  sourceExpenseReconciliationPassed:true,directCostTHB:null,
  selectedWorkingSellTHB:null,customerPriceTHB:null,
  postingAllowed:false,releaseAllowed:false,
  gates:Object.freeze([
   "Training Day 4 after FAT contradicts BOD pre-FAT training; require purchaser agreement",
   "SERV-2 two iFAT days and SERV-4 minimum five facility days are separate quote identities",
   "Training crew count 1 or 2 and actual site/facility itinerary not approved",
   "B8 44 MH/THB30000 documentation/preparation overlap must be reconciled before promotion",
   "No hotel nights selected for local SAMTEL venue; old China scenario is superseded",
   "4-MR 48-hour witnessed ITP, site availability and customer acceptance not confirmed",
   "MGW equipment supply only; no service amount remains in B3; do not mark up ADDVALUE Working SELL again"
  ])
 });
}
