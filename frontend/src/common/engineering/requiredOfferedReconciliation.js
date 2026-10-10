// Generic evidence-first reconciliation; no project rates or device facts.
const missing=(reason,source)=>({state:"REVIEW_REQUIRED",reason,source});
export function reconcileRequiredAndOffered({required=[],offered=[],sourceId}={}){
 if(!sourceId||!Array.isArray(required)||!Array.isArray(offered))return {status:"OPEN_SOURCE",rows:[]};
 const rows=required.map(req=>{
  const options=offered.filter(o=>o.partNumber===req.selectedPartNumber||o.equipmentFamily===req.equipmentFamily&&o.mr===req.mr);
  const chosen=options.find(o=>o.partNumber===req.selectedPartNumber)||null;
  if(!Number.isFinite(req.requiredQty))return {...req,decision:missing("Required quantity not derived from source",req.sourceId),candidates:options};
  if(!chosen)return {...req,decision:missing("No exact offered part/model matched",req.sourceId),candidates:options};
  const offeredQty=chosen.qty;
  const quantityGap=Number.isFinite(offeredQty)?offeredQty-req.requiredQty:null;
  const state=quantityGap===null?"REVIEW_REQUIRED":quantityGap<0?"SHORTFALL":quantityGap>0?"SURPLUS_REVIEW":"QUANTITY_MATCH_TECH_REVIEW";
  return {...req,decision:{state,quantityGap,partNumber:chosen.partNumber,source:chosen.sourceId,
   technicalApproval:"OPEN",priceApproval:"OPEN"},candidates:options};
 });
 return {status:"PRELIMINARY_NOT_APPROVED",rows,unmappedOffered:offered.filter(x=>!required.some(r=>r.selectedPartNumber===x.partNumber)),releaseAllowed:false};
}
export function deriveAcceptedQuoteCost({row,quote}){
 if(row?.decision?.state!=="ACCEPTED_ENGINEERING"||row?.decision?.technicalApproval!=="VERIFIED")return {status:"HOLD_ENGINEERING",value:null};
 if(!Number.isFinite(row.requiredQty)||!Number.isFinite(quote?.unitPrice)||quote.unitPrice<0||!quote.sourceId)return {status:"OPEN_PRICING",value:null};
 return {status:"DERIVED_REVIEW",value:row.requiredQty*quote.unitPrice,currency:quote.currency,sourceId:quote.sourceId};
}
