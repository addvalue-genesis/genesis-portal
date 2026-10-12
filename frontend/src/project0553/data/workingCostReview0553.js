// Shared read-only aggregation: preserve original currencies, never sum unknown prices.
// Only numeric extended costs with an identified currency enter totals.
import {deriveA1EquipmentCoverage0553} from "./a1EquipmentProjection0553";
export const WORKING_FX_POLICY_0553=Object.freeze({thbPerUsd:31.5,source:"MANAGEMENT_WORKING_2026-10-12_NOT_BOT",cnyPerUsd:null});
export function convertWorkingAmount0553(amount,from,to,fx=WORKING_FX_POLICY_0553){
 if(!Number.isFinite(amount)||!from||!to||from==="UNASSIGNED")return null;
 if(from===to)return amount;
 const thb=Number(fx.thbPerUsd),cny=Number(fx.cnyPerUsd);
 if(!(thb>0))return null;
 const asUSD=from==="USD"?amount:from==="THB"?amount/thb:from==="CNY"&&cny>0?amount/cny:null;
 if(asUSD===null)return null;
 return to==="USD"?asUSD:to==="THB"?asUSD*thb:to==="CNY"&&cny>0?asUSD*cny:null;
}
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
export function summarizeWorkingItems0553(items,displayCurrency="THB",fx=WORKING_FX_POLICY_0553){
 const original=new Map();let pending=0,unconverted=0,converted=0,known=0;
 for(const item of items){
  if(!Number.isFinite(item.extended)||!item.currency||item.currency==="UNASSIGNED"){pending++;continue;}
  known++;original.set(item.currency,round((original.get(item.currency)||0)+item.extended));
  const v=convertWorkingAmount0553(item.extended,item.currency,displayCurrency,fx);
  if(v===null)unconverted++;else converted+=v;
 }
 return {count:items.length,known,pending,unconverted,original:[...original].map(([currency,amount])=>({currency,amount})),
  converted:known&&unconverted===0?round(converted):null,complete:pending===0&&unconverted===0};
}
export function deriveWorkingCostReview0553(displayCurrency="THB",fx=WORKING_FX_POLICY_0553){
 const a1=deriveA1EquipmentCoverage0553(),items=a1.items;
 const sites=[...new Set(items.map(x=>x.site))];
 const mrs=[...new Set(items.map(x=>x.mr))];
 return {items,partA:summarizeWorkingItems0553(items,displayCurrency,fx),
  bySite:sites.map(site=>({site,...summarizeWorkingItems0553(items.filter(x=>x.site===site),displayCurrency,fx)})),
  byMR:mrs.map(mr=>({mr,...summarizeWorkingItems0553(items.filter(x=>x.mr===mr),displayCurrency,fx)})),
  partB:null,partC:null,project:null,displayCurrency,
  note:"A1 cost coverage only; no Part B/C or full project totals until controlled cost mappings exist."};
}
