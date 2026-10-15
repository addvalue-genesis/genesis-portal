// Single source selector for bid.budget.scope.<code> and its parent summary.
// Source line-items are the original Rev08 workbook (not verified live OEM rates).
import {REV08_BASELINE} from "./rev08CommercialBaseline";

export function selectScopeSheet0553(code,{thbPerUsd}={}){
 const lines=REV08_BASELINE.detail[code]||[];
 const fxValid=Number.isFinite(thbPerUsd)&&thbPerUsd>0;
 const rows=lines.map(([description,qty,unitUSD],i)=>({
  id:`${code}-${i+1}`,description,qty,unitUSD,
  unitTHB:fxValid?unitUSD*thbPerUsd:null,
  totalTHB:fxValid?Math.round(qty*unitUSD*thbPerUsd*100)/100:null
 }));
 const totalTHB=fxValid?Math.round(rows.reduce((sum,row)=>sum+row.totalTHB,0)*100)/100:null;
 return {code,rows,totalTHB,qty:rows.length,source:"bid.budget.scope."+code.toLowerCase()+" / Rev08 original worksheet",status:"HISTORICAL_REV08_NOT_VERIFIED_OEM",fxValid};
}
