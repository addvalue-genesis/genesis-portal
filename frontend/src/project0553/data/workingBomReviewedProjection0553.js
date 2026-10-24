// Additive review/read adapter; the approved Rev03 source projection remains immutable.
import {selectWorkingBomProjection0553 as selectSourceProjection0553} from "./workingBomAggregation0553";
import {buildA1InternalReview0553} from "./a1InternalReview0553";
export function selectWorkingBomProjection0553(options={}){
 const source=selectSourceProjection0553(options);
 const internalReview=source.lines.some(x=>x.mr==="MR-0001")?buildA1InternalReview0553(source.lines):null;
 return {...source,internalReview};
}
// Monetary contract shared by Working, Budgetary, Scope and Release:
// convert and round each counted source line once, then sum those same lines.
export function workingBomLineCostTHB0553(line,thbPerUsd){
 if(!line.counted||!Number.isFinite(line.extended))return null;
 const raw=line.currency==="THB"?line.extended:
  line.currency==="USD"&&Number.isFinite(thbPerUsd)&&thbPerUsd>0?line.extended*thbPerUsd:null;
 return raw===null?null:Math.round((raw+Number.EPSILON)*100)/100;
}
export function workingBomTotalTHB0553(projection,thbPerUsd){
 const lines=projection.lines.filter(x=>x.counted);
 if(!lines.length)return null;
 const amounts=lines.map(x=>workingBomLineCostTHB0553(x,thbPerUsd));
 return amounts.some(x=>x===null)?null:
  Math.round((amounts.reduce((s,x)=>s+x,0)+Number.EPSILON)*100)/100;
}
