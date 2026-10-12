// PJ2608-0553 — independent SI bulk quantity model. Read-only and NOT additive to existing Cost Ledger.
// Deliberately separates physical demand, supplier-included items, historical cost and unpriced exposure.
// Approved decisions: derive quantity by site topology; show package-included children;
// obtain comparable budgetary rates; never use zero to conceal a missing vendor rate.
import {WORKING_BOM_BY_LOCATION_0553} from "./workingBomByLocation";
import {ZWP20_BULK_SCOPE_AUDIT_0553} from "./zwp20BulkScopeAudit0553";
const brownfield=new Set(["ZPQ","ZWP8","ZWP11"]);
// Never transform an unknown MTO Set quantity into one piece. Expose an unresolved driver.
const count=(rows,re)=>{
 const matched=rows.filter(x=>re.test(String(x.sourceTag||"")));
 const unresolved=matched.filter(x=>!Number.isFinite(x.sourceScopeQty)||x.sourceScopeQty<0);
 return {qty:matched.reduce((n,x)=>n+(Number.isFinite(x.sourceScopeQty)&&x.sourceScopeQty>=0?x.sourceScopeQty:0),0),
   unresolvedTags:unresolved.map(x=>x.sourceTag),tagCount:matched.length};
};
const controls=ZWP20_BULK_SCOPE_AUDIT_0553.checks;
const ACCESSORY_IDS=new Set(["ODU_NPT","ODU_RJ45","PANEL_RJ45","RF_JUMPER","ANT_MOUNT","ODU_MOUNT","RF_SURGE","EARTH","SUPPORT","GLAND_PLUG","POWER","LABEL"]);
const candidateRates={
 ODU_CAT6A:{rateTHB:524,source:"INNOVA QA24-0604 line 1 / historical THB per m",priceBasis:"HISTORICAL_COMPARABLE"},
 PANEL_M20:{rateTHB:1020,source:"INNOVA QA24-0604 line 4 / historical per gland",priceBasis:"HISTORICAL_COMPARABLE"},
 ODU_RJ45:{rateTHB:1712.39,source:"https://www.digikey.co.th/en/products/detail/weidm%C3%BCller/1012490000/3975049",priceBasis:"IP67_RETAIL_CANDIDATE_NOT_EX_OR_OEM_APPROVED"}
};
const round=n=>Math.round(n*100)/100;
export function deriveScadaBulkVerification0553(){
 return WORKING_BOM_BY_LOCATION_0553.locations.map(g=>{
  const tags=g.items;
  const radioDemand=count(tags,/^MR-(502|LQM)-(?!.*[AB]$)/i);
  const antennaDemand=count(tags,/^ANT-/i),panelDemand=count(tags,/^TCAB-/i);
  const {qty:odu}=radioDemand,{qty:antenna}=antennaDemand,{qty:panel}=panelDemand;
  const unresolvedQuantityTags=[...radioDemand.unresolvedTags,...antennaDemand.unresolvedTags,...panelDemand.unresolvedTags];
  // One assumed routed Ethernet run per ODU is a budgetary driver, not a verified cable schedule.
  const runCount=unresolvedQuantityTags.length?null:odu;
  const routeBaseM=60,procurementPct=15;
  const rows=controls.map(b=>{
   const rates=candidateRates[b.id];
   const quantities={
    ODU_CAT6A:runCount!==null&&runCount>0?Math.ceil(runCount*routeBaseM*(1+procurementPct/100)):null,
    PANEL_M20:panel||null,
    ODU_NPT:odu||null,ODU_RJ45:odu||null,
    PANEL_RJ45:panel||null,RF_JUMPER:antenna||null,
    ANT_MOUNT:antenna||null,ODU_MOUNT:odu||null,
    RF_SURGE:null,EARTH:odu+antenna+panel||null,
    SUPPORT:null,GLAND_PLUG:null,POWER:panel||null,
    LABEL:null,CABLE_TEST:runCount||null,START_SPARES:null
   };
   const qty=quantities[b.id]??null;
   const boundary=["CABLE_TEST","START_SPARES"].includes(b.id)?"SERVICE_OR_SPARES_SEPARATE":
    ["RF_JUMPER","ANT_MOUNT","ODU_MOUNT","GLAND_PLUG","PANEL_RJ45"].includes(b.id)?"VENDOR_INCLUDED_FIRST_CHECK":
    "CONDITIONAL_FIELD_BULK";
   const retailOnly=b.id==="ODU_RJ45";
   const hasRate=Number.isFinite(rates?.rateTHB);
   const estimate=!retailOnly&&qty!==null&&hasRate?round(qty*rates.rateTHB):null;
   return {...b,site:g.site,derivedQty:qty,unitRateTHB:rates?.rateTHB??null,
    provisionalExtendedTHB:estimate,rateSource:rates?.source||null,
    priceBasis:rates?.priceBasis||"PRICE_RESEARCH_OR_VENDOR_PACKAGE_ALLOCATION_REQUIRED",
    decision:boundary,siteOwnership:brownfield.has(g.site)?"BUDGET_AS_NEW_REPLACEMENT__NOT_APPROVED_PROCUREMENT":"NEW_OR_VENDOR_INCLUDED_VERIFY",
    budgetBucket:ACCESSORY_IDS.has(b.id)?"CONDITIONAL_ACCESSORY_ALLOWANCE":b.id==="ODU_CAT6A"||b.id==="PANEL_M20"?"BASE_FIELD_BULK":"SERVICE_SPARES_SEPARATE",
    quantityState:qty===null?"UNDETERMINED_PHYSICAL_ROUTE_OR_OEM_CONFIGURATION":
     "SI_PARAMETRIC_PRELIMINARY_NOT_MEASURED",
    quoteIncludedNotCounted:b.id==="ODU_RJ45"||boundary==="VENDOR_INCLUDED_FIRST_CHECK",
    independentAllowanceRequired:ACCESSORY_IDS.has(b.id),
    caveat:retailOnly?"IP67 retail candidate is not Ex-approved/OEM-confirmed; reference rate only":
     b.id==="ODU_CAT6A"?"60m baseline × 15% per assumed ODU Ethernet route, not drawing-measured":
     "Site demand derived from MTO family counts; not approved installation procurement"};
  });
  return {site:g.site,mtoTagCount:tags.length,odu,antenna,panel,unresolvedQuantityTags,
   runCount,bulkFunctions:rows.length,rows,
   selectedBudgetSubtotalTHB:round(rows.reduce((n,r)=>n+(r.provisionalExtendedTHB||0),0)),
   pricedFunctionCount:rows.filter(r=>r.provisionalExtendedTHB!==null).length,
   outstandingFunctionCount:rows.filter(r=>r.provisionalExtendedTHB===null).length,
   totalBudgetComplete:false,postedToCostLedger:false,
   decisionPolicy:"Brownfield FULL NEW replacement equivalent; accessories independently reserved in Conditional not double-posted to Base; project contingency separate",
   note:"This is an independent engineering/rate-coverage review. Already booked ZWP20 cable/gland must not be added twice; other location provisional quantities are sensitivity cases only."};
 });
}
