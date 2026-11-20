// MR0001 budget closeout gate. Never declare complete by replacing unknown with zero.
// Reads actual canonical tag ledger, not UI status strings or quoted-wide quantities.
import {selectMR0001TagCostRows0553} from "./mr0001TagCostLedger0553";
const sites=["ZWP20","ZWP21","ZWP22","ZWP23","ZPQ","ZWP8","ZWP11"];
const round=n=>Math.round(n*100)/100;
export function auditMR0001CostCloseout0553(){
 const locations=sites.map(site=>{
  const rows=selectMR0001TagCostRows0553(site);
  const entries=rows.map(r=>{
   const hasRate=Number.isFinite(r.unitCost)&&Boolean(r.currency);
   const booked=r.countedInWorkingTotal!==false&&Number.isFinite(r.extended)&&hasRate;
   const ref=Number.isFinite(r.referenceExtended);
   return {site,row:r.row,tag:r.tag,id:`bid.budget.bom.${site.toLowerCase()}.${String(r.tag).toLowerCase().replace(/[^a-z0-9-]/g,"-")}.${r.row}`,
    status:booked?"BUDGETARY_COST_POSTED":ref?"PRICED_REFERENCE_NOT_POSTED":"UNPRICED_OR_NOT_ALLOCATED",
    originalCurrency:r.currency,unitCost:hasRate?r.unitCost:null,
    bookedAmount:booked?r.extended:null,referenceAmount:ref?r.referenceExtended:null,
    source:r.source||null,reason:r.status||null};
  });
  const booked=entries.filter(e=>e.status==="BUDGETARY_COST_POSTED");
  const outstanding=entries.filter(e=>e.status!=="BUDGETARY_COST_POSTED");
  const subtotals={USD:0,THB:0};
  for(const e of booked)if(Object.prototype.hasOwnProperty.call(subtotals,e.originalCurrency))
   subtotals[e.originalCurrency]=round(subtotals[e.originalCurrency]+e.bookedAmount);
  return {site,entries,total:entries.length,booked:booked.length,
   outstanding,subtotals,costClosed:entries.length>0&&outstanding.length===0};
 });
 return {locations,totalRows:locations.reduce((n,x)=>n+x.total,0),
  totalBooked:locations.reduce((n,x)=>n+x.booked,0),
  outstanding:locations.flatMap(x=>x.outstanding),
  costClosed:locations.every(x=>x.costClosed),
  releaseAllowed:false,revision:"INTERNAL_WORKING_NOT_CUSTOMER_RELEASE"};
}
