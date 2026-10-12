// Read-only projections for all BOM display modules.
// The working BOM/site derivation remains the sole engineering calculation owner.
// No price, quantity, FX or sell amount is created in this file.
import {SITE_SYSTEM_COST_RECONCILIATION_0553} from "./siteSystemCostReconciliation";
import {MR0002_WORKING_BOM_0553} from "./mr0002WorkingBom0553";
const source=SITE_SYSTEM_COST_RECONCILIATION_0553;
const mr0002=MR0002_WORKING_BOM_0553.sites.map(s=>({site:s.site,mr:"MR-0002",name:"DMR Trunk Radio",detailRows:s.items.map(item=>({...item,row:item.quoteLine||item.id,sourceQty:item.qty,sourceUnit:item.unit})),
 subtotals:[{currency:"USD",amount:s.controlledTotalUSD}],gaps:s.scopeWarnings,
 projectionSource:"MR0002_WORKING_BOM_CANONICAL",completeness:"PROVISIONAL_SOME_COSTS_EXCLUDED",
 rfqSource:source.systems.find(x=>x.id==="MR-0002")?.rfqSource||null}));
const unifiedRows=source.rows.map(r=>mr0002.find(x=>x.site===r.site&&x.mr===r.mr)||r);
for(const r of mr0002)if(!unifiedRows.some(x=>x.site===r.site&&x.mr===r.mr))unifiedRows.push(r);
export const BOM_READ_MODEL_0553=Object.freeze({
 projectId:"PJ2608-0553",
 dataRevision:"WORKING_UNRELEASED",
 systems:source.systems,
 sites:source.sites,
 rows:unifiedRows,
 byMr:source.systems.map(s=>({...s,rows:unifiedRows.filter(r=>r.mr===s.id)})),
 completeness:"MR0001_PARTIAL_MR0002_PROVISIONAL_MR0003_4_LEGACY",
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
