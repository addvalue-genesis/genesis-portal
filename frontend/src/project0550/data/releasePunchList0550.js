import {deriveBidPunch0550} from './bidPunch0550';
import {SYSTEMS} from '../data';

export function releaseReviewBacklog0550(model){return [
 ...(model.sourceReadiness?.rows||[]).filter(r=>r.problems.length).map(r=>({type:'A_INPUT',id:r.id,title:r.documentNo+' '+r.revision+' / '+r.title,locator:r.locator,sourceIds:r.binding?.sourceIds||[],problems:r.problems})),
 ...(model.integration?.documentGaps||[]).map(r=>({type:'DOCUMENT',id:r.id,problems:[r.reason]})),
 ...(model.integration?.requirements||[]).filter(r=>r.problems.length).map(r=>({type:'REQUIREMENT',id:r.id,system:r.systemToken,title:r.title,sourceIds:r.sourceIds,locator:r.sourceLocator,problems:r.problems})),
 ...model.official.selected.filter(r=>r.reviewProblems.length).map(r=>({type:'PRICE',id:r.id,customerRow:r.customerRowCode,title:r.description,problems:r.reviewProblems})),
 ...model.official.schedule.filter(r=>!r.ready).map(r=>({type:'CUSTOMER_ROW',id:r.code,problems:r.problems}))
];}
// Consume the same Common root IDs / durable plans as WP.8. No second Punch store.
export function deriveReleasePunchList0550(data,model,today){
 const common=deriveBidPunch0550(data,model,SYSTEMS,today),control=model.releaseControl||{};
 return {schema:'0550-release-punch-view-v1',common,items:common.rows,stages:common.stages,recordCount:common.rows.length,rawRequirementProblems:common.rawRequirementProblems,
  backlog:releaseReviewBacklog0550(model),gateRows:(control.problems||[]).map(code=>({code})),volumeView:common.volumeView,currentState:control.state||'HOLD',
  authorization:{ready:Boolean(control.ready),state:control.state||'HOLD',issues:control.issues?.length||0,transmittals:control.transmittals?.length||0}};
}
