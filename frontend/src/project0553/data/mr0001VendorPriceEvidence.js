// Quotation price EVIDENCE only. Never adopt as accepted equipment cost or sell.
import { AVIAT_0553_TECHNICAL_EVALUATION } from "./aviatTechnicalBidEvaluation";
import { MR0001_GAP_ASSESSMENT } from "./mr0001GapAssessment";
const lines=AVIAT_0553_TECHNICAL_EVALUATION.rows.map(r=>({
 quoteLine:r.quoteLine,partNumber:r.partNumber,currency:r.currency,
 quotedQty:r.sourceQty,unitPrice:r.unitPrice,quotedLineTotal:r.quotedTotal,
 quoteFunction:r.functionId,quoteRole:r.offeredRole,pricingAvailable:Number.isFinite(r.unitPrice),
 quotePricingState:Number.isFinite(r.unitPrice)?"QUOTED_PRICE_EVIDENCE":"NOT_PRICED_AS_QUOTED",
 approvedUnitCost:null,acceptedCost:null,source:r.sourceId
}));
const byCode=new Map(lines.map(x=>[x.quoteLine,x]));
export const MR0001_VENDOR_PRICE_EVIDENCE=Object.freeze({
 projectId:"PJ2608-0553",quoteId:AVIAT_0553_TECHNICAL_EVALUATION.quoteNumber,
 sourceCurrency:AVIAT_0553_TECHNICAL_EVALUATION.currency,
 lines,requirementCandidates:MR0001_GAP_ASSESSMENT.requirements.map(r=>({
  requirementId:r.id,site:r.site,functionId:r.functionId,requiredQty:r.requiredQty,
  candidatePrices:r.offerLines.map(code=>byCode.get(code)).filter(Boolean),
  selectedQuoteLine:null,selectedUnitCost:null,acceptedExtendedCost:null
 })),
 customerReleaseAllowed:false
});
