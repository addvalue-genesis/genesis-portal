// PJ2608-0553 SCADA management budgetary envelope: calculated projection of the original ledger,
// not a second cost ledger. Original site ledger remains immutable. Currency conversion is explicit.
// 2026-10-12 management: all brownfield NEW-replacement budget assumption; accessories separate;
// physical Ethernet route 60m +15% as scenario; market comparables; distinct envelope buckets.
import {selectMR0001TagCostRows0553} from "./mr0001TagCostLedger0553";
import {deriveScadaBulkVerification0553} from "./scadaBulkQuantityVerification0553";
const round=n=>Math.round(n*100)/100;
const SITES=["ZPQ","ZWP8","ZWP11","ZWP20","ZWP21","ZWP22","ZWP23"];
// This ratio is an explicitly labelled adjustable SCENARIO, not a client/OEM fact or approved corporate rate.
export const SCADA_CONTINGENCY_SCENARIO_PCT=10;
export function deriveScadaBudgetEnvelope0553({thbPerUsd=null,contingencyPct=SCADA_CONTINGENCY_SCENARIO_PCT}={}){
 const validFX=Number.isFinite(thbPerUsd)&&thbPerUsd>0;
 const pct=Number.isFinite(contingencyPct)&&contingencyPct>=0?contingencyPct:null;
 const siteBulk=deriveScadaBulkVerification0553();
 const locations=SITES.map(site=>{
  const ledger=selectMR0001TagCostRows0553(site);
  const originalTHB=round(ledger.filter(x=>x.countedInWorkingTotal&&x.currency==="THB"&&Number.isFinite(x.extended)).reduce((s,x)=>s+x.extended,0));
  const originalUSD=round(ledger.filter(x=>x.countedInWorkingTotal&&x.currency==="USD"&&Number.isFinite(x.extended)).reduce((s,x)=>s+x.extended,0));
  const bulk=siteBulk.find(x=>x.site===site);
  // ZWP20 CAT6A and M20 are ALREADY in source row11. Other WP ledgers
  // may book 69m+M20 via previous management allowance: never add the same physical function twice.
  const allocatedBulkInSource=ledger.some(x=>/bulk material/i.test(String(x.tag||""))&&x.countedInWorkingTotal);
  const missingBaseBulk=(bulk?.rows||[]).filter(x=>x.budgetBucket==="BASE_FIELD_BULK"&&Number.isFinite(x.provisionalExtendedTHB));
  const incrementalBase=allocatedBulkInSource?0:round(missingBaseBulk.reduce((s,x)=>s+x.provisionalExtendedTHB,0));
  const conditionalRows=(bulk?.rows||[]).filter(x=>x.budgetBucket==="CONDITIONAL_ACCESSORY_ALLOWANCE");
  const pricedConditional=conditionalRows.filter(x=>Number.isFinite(x.provisionalExtendedTHB));
  const conditionalPricedFloor=round(pricedConditional.reduce((s,x)=>s+x.provisionalExtendedTHB,0));
  const unresolved=conditionalRows.filter(x=>!Number.isFinite(x.provisionalExtendedTHB)).map(x=>x.id);
  const baseTHB=round(originalTHB+incrementalBase+(validFX?originalUSD*thbPerUsd:0));
  const baseComplete=validFX||originalUSD===0;
  const conditionalComplete=unresolved.length===0;
  const riskBase=baseComplete?round(baseTHB+conditionalPricedFloor):null;
  const contingency=riskBase!==null&&pct!==null?round(riskBase*pct/100):null;
  const pricedEnvelope=riskBase!==null&&contingency!==null?round(riskBase+contingency):null;
  const completeEnvelope=baseComplete&&conditionalComplete&&bulk?.unresolvedQuantityTags?.length===0;
  return {site,baseSourceTHB:originalTHB,baseSourceUSD:originalUSD,incrementalBaseBulkTHB:incrementalBase,
   baseBudgetTHB:baseComplete?baseTHB:null,conditionalAllowanceTHB:conditionalComplete?conditionalPricedFloor:null,
   pricedConditionalFloorTHB:conditionalPricedFloor,
   contingencyPct:pct,contingencyTHB:contingency,pricedEnvelopeTHB:pricedEnvelope,
   unresolvedAccessoryFunctions:unresolved,accessoryCoverage:pricedConditional.length+"/"+conditionalRows.length,
   replacementBasis:["ZPQ","ZWP8","ZWP11"].includes(site)?"ALL_NEW_REPLACEMENT_MANAGEMENT_SCENARIO":"GREENFIELD_SOURCE_SCOPE",
   includedBulkNotAdded:allocatedBulkInSource,completeEnvelope,
   unresolvedQuantityTags:bulk?.unresolvedQuantityTags||[],
   warning:"Priced envelope is a FLOOR, NOT full budget: unresolved accessories, Ex approvals, final cable routes and separately scoped services/spares remain excluded."};
 });
 const total=(key)=>locations.every(x=>Number.isFinite(x[key]))?round(locations.reduce((s,x)=>s+x[key],0)):null;
 return {locations,totals:{baseBudgetTHB:total("baseBudgetTHB"),conditionalAllowanceTHB:total("conditionalAllowanceTHB"),
  contingencyTHB:total("contingencyTHB"),pricedEnvelopeTHB:total("pricedEnvelopeTHB")},
  fx:{thbPerUsd:validFX?thbPerUsd:null,required:locations.some(x=>x.baseSourceUSD>0)},
  status:"PARTIAL_PRICED_ENVELOPE_NOT_FULL_COMPLETENESS",
  source:"MR0001 original tag cost ledger + 16-function physical bulk audit",
  pricingPolicy:"One cost owner; never post vendor-included accessory to Base twice; all accessories require separate conditional reference where not proven included",
  amountNotComplete:true};
}
