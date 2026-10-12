// Read-only projections for all BOM display modules.
// The working BOM/site derivation remains the sole engineering calculation owner.
// No price, quantity, FX or sell amount is created in this file.
import {SITE_SYSTEM_COST_RECONCILIATION_0553} from "./siteSystemCostReconciliation";
const source=SITE_SYSTEM_COST_RECONCILIATION_0553;
export const BOM_READ_MODEL_0553=Object.freeze({
 projectId:"PJ2608-0553",
 dataRevision:"WORKING_UNRELEASED",
 systems:source.systems,
 sites:source.sites,
 rows:source.rows,
 byMr:source.byMr,
 completeness:"PARTIAL_LEGACY_SITES_NOT_CANONICAL",
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
