// PJ2608-0553 read-only A/B/C readiness; NOT a new cost ledger or an
// automatic estimate-to-bid allocation. Source currency and basis remain explicit.
// The MR0001 Working TAG Ledger provides A-cost evidence. PART_BC_WBS_SOURCE is
// a PROJECT-WIDE SELL basis (NOT cost), and C options remain uncosted.
import {WORKING_BOM_BY_LOCATION_0553} from "./workingBomByLocation";
import {summarizeMR0001TagCost0553} from "./mr0001TagCostLedger0553";
import {derivePartBcWorkingWbs0553,PART_BC_WBS_SOURCE_0553} from "./partBCWorkingWbs0553";
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const sum=(values)=>round(values.reduce((n,x)=>n+x,0));
export function deriveAbcWorkingReadiness0553({site="ALL",thbPerUsd=null}={}){
 const allSites=WORKING_BOM_BY_LOCATION_0553.locations.map(x=>x.site);
 const selectedSites=site==="ALL"?allSites:allSites.filter(s=>s===site);
 const locationRows=selectedSites.map(id=>{
  const ledger=summarizeMR0001TagCost0553(id);
  const posted=ledger.rows.filter(x=>x.countedInWorkingTotal&&Number.isFinite(x.extended)&&["USD","THB"].includes(x.currency));
  const unposted=ledger.rows.filter(x=>!x.countedInWorkingTotal||!Number.isFinite(x.extended)||!["USD","THB"].includes(x.currency));
  return {site:id,sourceCount:ledger.totalRows,postedCount:posted.length,
   unresolved:unposted.map(x=>({tag:x.tag,row:x.row,status:x.status||"NO_BOOKED_COST",
    currency:x.currency??null})),
   originalUSD:sum(posted.filter(x=>x.currency==="USD").map(x=>x.extended)),
   originalTHB:sum(posted.filter(x=>x.currency==="THB").map(x=>x.extended)),
   currencyIssues:ledger.rows.filter(x=>x.countedInWorkingTotal&&Number.isFinite(x.extended)&&!["USD","THB"].includes(x.currency)).length};
 });
 const subtotalUSD=sum(locationRows.map(x=>x.originalUSD));
 const subtotalTHB=sum(locationRows.map(x=>x.originalTHB));
 const fxUsable=Number.isFinite(thbPerUsd)&&thbPerUsd>0;
 const knownWorkingTHB=fxUsable?round(subtotalTHB+subtotalUSD*thbPerUsd):
  subtotalUSD===0?subtotalTHB:null;
 const totalRows=locationRows.reduce((n,x)=>n+x.sourceCount,0);
 const postedRows=locationRows.reduce((n,x)=>n+x.postedCount,0);
 const currencyIssues=locationRows.reduce((n,x)=>n+x.currencyIssues,0);
 const b=derivePartBcWorkingWbs0553();
 const bRows=b.rows.filter(x=>/^B(?:[1-9]|1[0-4])$/.test(x.code));
 const cRows=b.rows.filter(x=>/^C[12]$/.test(x.code));
 const bSourceSell=Number.isFinite(b.subtotalTHB)?b.subtotalTHB:null;
 const cKnownSell=cRows.filter(x=>Number.isFinite(x.sellTHB));
 const outstandingB=bRows.filter(x=>!Number.isFinite(x.sellTHB));
 const currentAComplete=totalRows>0&&postedRows===totalRows&&currencyIssues===0;
 const bCostsMapped=[]; // No cost-backed estimate-to-bid allocations exist in this source.
 const cCostsMapped=[]; // No OEM spare qty x source-rate allocation exists in this source.
 return Object.freeze({
  scope:"MR-0001 TAG / selected Location; Part B Rev05 project-wide SELL reference only",
  site,selectedSites,locations:locationRows,
  priceEvidenceCoverageNotApproval:true,
  A:{originalUSD:subtotalUSD,originalTHB:subtotalTHB,knownWorkingTHB,
    postedRows,totalRows,unpostedRows:totalRows-postedRows,currencyIssues,
    complete:currentAComplete,knownBasis:"MR0001_TAG_LEDGER_EQUIPMENT_AND_ATTRIBUTABLE_BULK",
    fullCostTHB:currentAComplete?knownWorkingTHB:null,
    action:totalRows===postedRows?"Check physical SKU/CAL/OEM/scope approval; source-priced is not acceptance":
    "Close unposted MTO TAGs and engineering/bulk/quotation ownership before certifying Part A"},
  B:{costTHB:null,costMappedRows:bCostsMapped.length,sourceWbsRows:bRows,
    workingSellTHB:bSourceSell,workingSellCount:bRows.filter(x=>Number.isFinite(x.sellTHB)).length,
    totalRows:bRows.length,unpricedSellRows:outstandingB.length,
    status:"WORKING_SELL_ONLY__NOT_VENDOR_OR_SERVICE_COST",
    action:"Derive internal cost from controlled staff MH/MD, resources, supplier quotes, travel/logistics, then reconcile B1–B14 responsibility and CBS mapping"},
  C:{costTHB:null,costMappedRows:cCostsMapped.length,sourceWbsRows:cRows,
    workingSellTHB:cKnownSell.length===cRows.length&&cRows.length>0?
      sum(cKnownSell.map(x=>x.sellTHB)):null,
    totalRows:cRows.length,unpricedSellRows:cRows.length-cKnownSell.length,
    status:"OEM_SPARE_QTY_UNIT_RATE_AND_SCOPE_PENDING",
    action:"Obtain capital and 2-year spares SKU, qty, OEM rates and RFQ scope; C1/C2 are options in source WBS"},
  ABC:{completeCostTHB:null,knownAOnlyWorkingTHB:knownWorkingTHB,
    knownCostScope:"PART_A_MR0001_ONLY; EXCLUDES_B_COST_C_COST_AND_OTHER_MR_COST",
    canAddCosts:false,workingSellAndCostNeverMixed:true,
    missing:["Part A remaining source/quantity/technical gaps","Part B internal cost allocation and 9 unpriced sell lines","Part C optional spares costing"],
    releaseAllowed:false},
  bWbsSource:PART_BC_WBS_SOURCE_0553.revision,
  bWbsSourceUrl:PART_BC_WBS_SOURCE_0553.url,
  fx:{thbPerUsd:fxUsable?thbPerUsd:null,source:"DISPLAY_SETTING__MUST_VERIFY_SOURCE_BEFORE_CUSTOMER_RELEASE"},
  warning:"B Rev05 THB 3,804,160 is working SELL, not B cost. Do not add it to A cost. C unpriced is UNKNOWN, not THB 0. Item 37/55 is price evidence only, not accepted physical SKU."});
}
