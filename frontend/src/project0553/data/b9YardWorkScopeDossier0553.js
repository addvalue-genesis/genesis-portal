// PJ2608-0553 / B9 Yard Specialist — read-only Work Scope → Working SELL dossier.
// Same canonical WS-B9 1 LS shown with grouped activities; never a second posting.
// B3.R6 / Yard SAT is contractual test/acceptance scope with UNPRICED B3 RACI;
// this B9 call-out includes Senior Engineer plus Field Technician, 7+2 days each.
// Supplier expense allowances are Working SELL estimates, NOT verified direct costs.
const ROOT="bid.budget.working.bc.b9.price-trace.work-scope";
const B3_YARD_SAT_ID="bid.budget.working.bc.b3.resource-price-dossier.group.06";
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const freeze=Object.freeze;
const GROUPS=freeze([
 freeze({key:"labour",label:"Senior Engineer + Field Technician — Yard Labour / Travel Days",
  sourceIds:freeze(["B9-YARD-STAFF","B9-YARD-TRAVEL-DAYS","B9-YARD-FIELD-STAFF","B9-YARD-FIELD-TRAVEL-DAYS"])}),
 freeze({key:"travel",label:"Mobilisation, Transport & Accommodation",
  sourceIds:freeze(["B9-YARD-AIRFARE","B9-HOTEL-YARD","B9-LOCAL-TRAVEL-YARD"])}),
 freeze({key:"compliance",label:"Visa / Work Authorization & Insurance",
  sourceIds:freeze(["B9-YARD-VISA","B9-YARD-TRAVEL-INSURANCE","B9-YARD-WORK-INSURANCE"])})
]);
export function selectB9YardWorkScopeDossier0553(workingRow){
 if(workingRow?.code!=="B9"||!workingRow.b9ChinaBudget)
  throw Error("B9 Yard Work Scope requires canonical 10.2 WS-B9 owner");
 const source=workingRow.b9ChinaBudget;
 const ownerRows=source.rows.filter(x=>x.costOwner==="B9");
 const grouped=GROUPS.map((g,i)=>{
  const lines=g.sourceIds.map(id=>{
   const r=ownerRows.find(row=>row.id===id);
   if(!r||r.workingCostTHB!==null||r.directCostTHB!==null||
    r.workingSellTHB!==round(r.qty*r.unitRateTHB))
    throw Error("B9 Yard source row quantity/rate/cost authority mismatch: "+id);
   const paidSeniorLabour=id==="B9-YARD-STAFF"||id==="B9-YARD-TRAVEL-DAYS";
   const paidFieldLabour=id==="B9-YARD-FIELD-STAFF"||id==="B9-YARD-FIELD-TRAVEL-DAYS";
   const paidLabour=paidSeniorLabour||paidFieldLabour;
   return freeze({
    ...r,id:ROOT+".line."+id.toLowerCase(),sourceExpenseId:r.id,
    sourceModuleId:r.moduleId,
    site:"JUTAL Zhuhai Fabrication Yard — pooled four-GF scope, no per-site posting",
    role:paidSeniorLabour?source.selectedYardRole:paidFieldLabour?source.selectedYardFieldRole:"Expense / logistics / compliance allowance",
    people:paidLabour?1:null,
    days:paidLabour?r.qty:null,
    rateUSDPerMD:paidSeniorLabour?source.onshoreSeniorUSDPerDay:paidFieldLabour?source.onshoreFieldUSDPerDay:null,
    fxTHBPerUSD:paidLabour?round(r.unitRateTHB/(paidSeniorLabour?source.onshoreSeniorUSDPerDay:source.onshoreFieldUSDPerDay)):null,
    verifiedDirectCostTHB:null,postingAllowed:false,
    includedInCanonicalWSB9:true,
    b3RequirementCrossReference:B3_YARD_SAT_ID
   });
  });
  return freeze({
   key:g.key,name:g.label,id:ROOT+".group."+String(i+1).padStart(2,"0"),
   siteId:ROOT+".group."+String(i+1).padStart(2,"0")+".site.01",
   site:"JUTAL Zhuhai Fabrication Yard (GF ZWP20–23 — no allocated site price)",
   rows:freeze(lines),selectedWorkingSellTHB:round(lines.reduce((s,r)=>s+r.workingSellTHB,0)),
   independentPostingAllowed:false,releaseAllowed:false
  });
 });
 const selectedTotal=round(grouped.reduce((s,g)=>s+g.selectedWorkingSellTHB,0));
 const ids=grouped.flatMap(g=>g.rows.map(x=>x.sourceExpenseId));
 if(ownerRows.length!==10||ids.length!==ownerRows.length||
  new Set(ids).size!==ownerRows.length||
  ids.some(id=>!ownerRows.some(x=>x.id===id))||
  grouped.map(g=>g.selectedWorkingSellTHB).join("|")!=="368550|90000|22000"||
  selectedTotal!==workingRow.workingSellTHB||
  selectedTotal!==source.b9BaseWorkingSellTHB||
  selectedTotal!==source.conditionalYardSellTHB||
  !source.priceAlreadyIncludedInB9Base||
  source.customerReleaseAllowed||source.yardPaidCrew!==2||
  source.onshoreSeniorUSDPerDay!==700||
  source.onshoreYardSeniorTHBPerMD!==22050||source.onshoreYardFieldTHBPerMD!==18900||
  workingRow.directCostTHB!==null)
  throw Error("B9 Yard dossier must reconcile ONCE to canonical WS-B9 and retain B3 RACI split");
 return freeze({
  moduleId:ROOT,sourceOwnerModuleId:workingRow.moduleId,
  cclItem31Ref:"Commercial_check_list_FOR-SAMTEL_Rev04_20260923-Samart.xlsx / CCL item 31",
  cclItem31OriginalScope:freeze({yardWorkingDays:18,offshoreWorkingDays:45,trainingDays:2,
   surveyDays:5,yardPersonnel:2,offshorePersonnel:2,surveyPersonnel:2,
   gap:"CCL 18d Yard / 45d Offshore remain unchanged; selected B9 7+2 Yard support does not cover full CCL commitment; scope/RACI pending"}),

  site:"JUTAL Zhuhai Fabrication Yard, China",
  b3RequirementModuleId:B3_YARD_SAT_ID,
  groups:freeze(grouped),sourceRowCount:ids.length,
  workingSellId:"WS-B9",scopeId:"SOW-B9",proposalId:"CP-B9",
  qty:1,unit:"LS",selectedWorkingSellTHB:selectedTotal,
  conditionalPhysicalExecution:true,writtenCalloutRequired:true,
  verifiedDirectCostTHB:null,independentPostingAllowed:false,
  additionalCustomerLineAllowed:false,customerReleaseAllowed:false,
  b3Group06SeparateUnpricedTestScope:true,
  unbilledFieldBackupCashRiskTHB:0,
  fieldTechnicianIncludedExpenseAllowanceTHB:source.fieldTechnicianIncrementalCashAllowanceTHB,
  unbilledFieldBackupPostingAllowed:false
 });
}
