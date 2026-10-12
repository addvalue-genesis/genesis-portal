// Read-only projections for all BOM display modules.
// The working BOM/site derivation remains the sole engineering calculation owner.
// No price, quantity, FX or sell amount is created in this file.
import {SITE_SYSTEM_COST_RECONCILIATION_0553} from "./siteSystemCostReconciliation";
import {MR0002_WORKING_BOM_0553} from "./mr0002WorkingBom0553";
import {RACON_TERMINATION_POLICY_0553} from "./raconTerminationBudget0553";
import {RACON_VENDOR_SCOPE_0553} from "./raconVendorScope0553";
const source=SITE_SYSTEM_COST_RECONCILIATION_0553;
const mr0002=MR0002_WORKING_BOM_0553.sites.map(s=>({site:s.site,mr:"MR-0002",name:"DMR Trunk Radio",detailRows:s.items.map(item=>({...item,row:item.quoteLine||item.id,sourceQty:item.qty,sourceUnit:item.unit})),
 subtotals:[{currency:"USD",amount:s.controlledTotalUSD}],gaps:s.scopeWarnings,
 projectionSource:"MR0002_WORKING_BOM_CANONICAL",completeness:"PROVISIONAL_SOME_COSTS_EXCLUDED",
 rfqSource:source.systems.find(x=>x.id==="MR-0002")?.rfqSource||null}));
const orga=RACON_TERMINATION_POLICY_0553.quotation;
const mr0004Sites=["ZWP20","ZWP21","ZWP22"];
const mr0004=mr0004Sites.map(site=>({
 site,mr:"MR-0004",name:"Marine RACON — MDS / ORGA",
 detailRows:RACON_VENDOR_SCOPE_0553.include.map((item,i)=>({
  id:site+"-ORGA-"+i,site,tag:item.tag,description:item.item,
  sourceQty:null,sourceUnit:"set",unitCost:null,extended:null,currency:"USD",
  status:"MDS_ORGA_VENDOR_PACKAGE__SITE_QTY_NOT_ALLOCATED",
  source:"ORGA-"+orga.number,countedInWorkingTotal:false
 })),
 evidence:[{source:"MDS / ORGA — "+orga.number,line:"ORGA-PACKAGE",
  description:"SeaBeacon-2 System 6 Ex RACON vendor package; site allocation pending",
  sourceQty:null,assumedQty:null,currency:"USD",unit:orga.packageUSD,extended:null,
  kind:"ORGA_QUOTED_PACKAGE_UNALLOCATED_NOT_SITE_COST"}],
 subtotals:[],gaps:["ORGA USD "+orga.packageUSD+" quote is ONE package reference, not automatically allocated to each WP",
  "Confirm MDS/ORGA quotation package count and per-WP scope",
  "Cable/gland inclusion conflict and field bulk reconciliation pending"],
 projectionSource:"MDS_ORGA_RACON_EVIDENCE",completeness:"SITE_ALLOCATION_PENDING",
 rfqSource:source.systems.find(x=>x.id==="MR-0004")?.rfqSource||null
}));
const unifiedRows=source.rows.map(r=>mr0002.find(x=>x.site===r.site&&x.mr===r.mr)||mr0004.find(x=>x.site===r.site&&x.mr===r.mr)||r);
for(const r of [...mr0002,...mr0004])if(!unifiedRows.some(x=>x.site===r.site&&x.mr===r.mr))unifiedRows.push(r);
export const BOM_READ_MODEL_0553=Object.freeze({
 projectId:"PJ2608-0553",
 dataRevision:"WORKING_UNRELEASED",
 systems:source.systems,
 sites:source.sites,
 rows:unifiedRows,
 byMr:source.systems.map(s=>({...s,rows:unifiedRows.filter(r=>r.mr===s.id)})),
 completeness:"MR0001_PARTIAL_MR0002_PROVISIONAL_MR0003_LEGACY_MR0004_ORGA_UNALLOCATED",
 releaseAllowed:false
});
export const bomItems0553=row=>row.detailRows?.length?row.detailRows:[];
export const bomEvidence0553=row=>row.evidence||[];
export function selectBomRows0553({mr="ALL",site="ALL"}={}){
 return BOM_READ_MODEL_0553.rows.filter(row=>
  (mr==="ALL"||row.mr===mr)&&(site==="ALL"||row.site===site));
}
export function bomCurrencySubtotals0553(rows){
 const sums=new Map();
 for(const row of rows) for(const item of row.subtotals||[]){
  if(Number.isFinite(item.amount))sums.set(item.currency,Math.round(((sums.get(item.currency)||0)+item.amount)*100)/100);
 }
 return [...sums].map(([currency,amount])=>({currency,amount}));
}
