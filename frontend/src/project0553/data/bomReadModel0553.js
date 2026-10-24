// Read-only projections for all BOM display modules.
// The working BOM/site derivation remains the sole engineering calculation owner.
// No price, quantity, FX or sell amount is created in this file.
import {SITE_SYSTEM_COST_RECONCILIATION_0553} from "./siteSystemCostReconciliation";
import {MR0002_WORKING_BOM_0553} from "./mr0002WorkingBom0553";
import {MR0003_MGW_WORKING_BOM_0553} from "./mr0003MgwWorkingBom0553";
import {MR0004_WORKING_BOM_0553} from "./mr0004WorkingBom0553";
const source=SITE_SYSTEM_COST_RECONCILIATION_0553;
const mr0002=MR0002_WORKING_BOM_0553.sites.map(s=>({site:s.site,mr:"MR-0002",name:"DMR Trunk Radio",detailRows:s.items.map(item=>({...item,row:item.quoteLine||item.id,sourceQty:item.qty,sourceUnit:item.unit})),
 subtotals:[{currency:"USD",amount:s.controlledTotalUSD}],gaps:s.scopeWarnings,
 projectionSource:"MR0002_WORKING_BOM_CANONICAL",completeness:"PROVISIONAL_SOME_COSTS_EXCLUDED",
 rfqSource:source.systems.find(x=>x.id==="MR-0002")?.rfqSource||null}));
const mr0003=MR0003_MGW_WORKING_BOM_0553.sites.map(s=>({
 site:s.site,mr:"MR-0003",name:"Ex IP Phone / EXION Gai-Tronics + EATON",
 detailRows:s.items.map(item=>({...item,row:item.quoteLine||item.id,
  sourceQty:item.qty,sourceUnit:item.unit})),
 subtotals:[{currency:"THB",amount:s.controlledTotalTHB}],gaps:s.gaps,
 projectionSource:"MR0003_EXION_4SITE_WORKING_BOM_SELECTED",
 completeness:"EXION_QUOTE_4_SITES__JB_GLANDS_AND_TECH_OPEN",
 rfqSource:source.systems.find(x=>x.id==="MR-0003")?.rfqSource||null
}));
const mr0004=MR0004_WORKING_BOM_0553.sites.map(site=>({
 site:site.site,mr:"MR-0004",name:"Marine RACON — MDS / ORGA SeaBeacon 2",
 detailRows:site.items.map(item=>({...item,row:item.id})),
 evidence:site.evidence,
 subtotals:[{currency:"USD",amount:site.controlledTotalUSD}],gaps:site.gaps,
 projectionSource:"MR0004_WORKING_BOM_CANONICAL",
 completeness:"BUDGETARY_QUOTE_RATE_PER_SITE__VENDOR_QTY_RECONFIRM",
 rfqSource:source.systems.find(x=>x.id==="MR-0004")?.rfqSource||null
}));
const unifiedRows=source.rows.map(r=>mr0002.find(x=>x.site===r.site&&x.mr===r.mr)||mr0003.find(x=>x.site===r.site&&x.mr===r.mr)||mr0004.find(x=>x.site===r.site&&x.mr===r.mr)||r);
for(const r of [...mr0002,...mr0003,...mr0004])if(!unifiedRows.some(x=>x.site===r.site&&x.mr===r.mr))unifiedRows.push(r);
export const BOM_READ_MODEL_0553=Object.freeze({
 projectId:"PJ2608-0553",
 dataRevision:"WORKING_UNRELEASED",
 systems:source.systems,
 sites:source.sites,
 rows:unifiedRows,
 byMr:source.systems.map(s=>({...s,rows:unifiedRows.filter(r=>r.mr===s.id)})),
 completeness:"MR0001_PARTIAL_MR0002_MGW_R2_SELECTED_MR0003_EXION_4SITES_MR0004_MDS_ONE_QUOTED_THREE_BUDGETED__TECH_BULK_UNVERIFIED",
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
