// PJ2608-0553 integrated MR0001–MR0004 BULK working read model.
// One WP/system/item identity. Never add mirror quotes to source cost ledger.
import {deriveWpSystemBulkBudget0553} from "./wpSystemBulkBudget0553";
import {deriveA5BulkAttribution0553} from "./a5BulkAttribution0553";
import {deriveBartecGlandBulkSchedule0553} from "./bartecGlandBulkSchedule0553";
const systems=["SCADA_RADIO","DTRS_TRUNK_RADIO","EX_IP_PHONE","MARINE_RACON"];
const mr={SCADA_RADIO:"MR0001",DTRS_TRUNK_RADIO:"MR0002",EX_IP_PHONE:"MR0003",MARINE_RACON:"MR0004"};
const note="Only amounts from unique source-owned posted A5 allocations are booked. Other indicative quantities/rates are shown separately; missing scope remains exposed.";
export function deriveIntegratedBulkMaster0553(){
 const wpRows=deriveWpSystemBulkBudget0553();
 const a5=deriveA5BulkAttribution0553();
 const gland=deriveBartecGlandBulkSchedule0553();
 const locations=wpRows.map(w=>{
  const group=systems.map(id=>{
   const src=w.systems.find(s=>s.id===id);
   const items=(src?.items||[]).map(x=>({
    ...x,wp:w.wp,mr:mr[id],system:id,
    budgetCandidateTHB:Number.isFinite(x.extendedTHB)?x.extendedTHB:null,
    postingState:"NOT_ADDITIVE_TO_SOURCE_LEDGER",
    isPriced:Boolean(Number.isFinite(x.rateTHB)&&Number.isFinite(x.qty)),
    quantityState:Number.isFinite(x.qty)?"DERIVED_OR_BUDGETARY_CHECK_SOURCE":"NOT_DERIVED"
   }));
   const found=gland.allEnclosures.find(x=>x.site===w.wp&&x.system===id);
   const original=a5.rows.find(x=>x.site===w.wp);
   const booked=id==="SCADA_RADIO"?original?.workingCostTHB??null:null;
   return {id,mr:mr[id],name:src?.name||id,items,enclosure:found||null,
    pricedCandidateSubtotalTHB:items.some(x=>Number.isFinite(x.budgetCandidateTHB))
     ?Math.round(items.reduce((n,x)=>n+(x.budgetCandidateTHB||0),0)*100)/100:null,
    postedA5THB:booked,
    unresolved:items.filter(x=>!Number.isFinite(x.qty)||!Number.isFinite(x.rateTHB)).length,
    allocationRule:"Source TAG owner only, no automatic additive quote adoption"};
  });
  return {wp:w.wp,siteClass:w.siteClass,groups:group,postedA5THB:group[0].postedA5THB,
   source:w.source};
 });
 return {
  projectId:"PJ2608-0553",moduleId:"bid.budget.bulk.integrated-mr0001-0004",
  status:"INTEGRATED_WORKING_VIEW__PARTIAL_COST_COVERAGE",
  locations, mr,systems,
  originalA5SourceTHB:a5.a5PriceTHB,
  recomputedA5THB:locations.every(x=>Number.isFinite(x.postedA5THB))?
    locations.reduce((n,x)=>n+x.postedA5THB,0):null,
  glandCapacity:gland.rollup.knownEntryCapacityForScope,
  glandPurchaseQty:gland.rollup.verifiedPurchaseGlandQty,
  postedExtraTHB:0,customerReleased:false,sourceLinked:true,note,
  rules:["No duplicate source TAG or A5 posting","Do not treat supplier-included package as additive",
   "No invented quantity for Ex/DTRS/RACON missing cable OD/route",
   "MR0003 BARTEC selected JB differs from MGW WAROM package",
   "All MR systems visible even if one site has no specific source-tag quantity"]
 };
}