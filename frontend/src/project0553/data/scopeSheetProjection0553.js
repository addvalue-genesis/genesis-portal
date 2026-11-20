// One read model for the child worksheet and the parent scope summary.
// Historical workbook prices are NOT current OEM quotes.
import {REV08_BASELINE} from "./rev08CommercialBaseline";
export function selectScopeSheet0553(code,{thbPerUsd}={}){
 const sourceRows=REV08_BASELINE.detail[code]||[];
 const hasFx=Number.isFinite(thbPerUsd)&&thbPerUsd>0;
 const rows=sourceRows.map(([description,qty,unitUSD],index)=>({
  id:code+"-"+(index+1),description,qty,unitUSD,
  unitTHB:hasFx?Math.round(unitUSD*thbPerUsd*100)/100:null,
  totalTHB:hasFx?Math.round(qty*unitUSD*thbPerUsd*100)/100:null
 }));
 return {code,rows,quantity:rows.length,
  totalTHB:hasFx?Math.round(rows.reduce((sum,row)=>sum+row.totalTHB,0)*100)/100:null,
  status:"HISTORICAL_REV08_REFERENCE_NOT_CURRENT_OEM_PRICE",
  source:"bid.budget.scope."+code.toLowerCase()+" → Rev08 detail",
  hasFx};
}
