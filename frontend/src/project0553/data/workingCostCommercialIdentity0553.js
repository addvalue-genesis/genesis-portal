// PJ2608-0553: explicit FINANCIAL IDENTITY / NO CUSTOMER-ITEM COLLISION.
// Contract B3/B8 identifiers are prescribed by Scope of Supply and MUST NOT be renamed.
// IC = INTERNAL COST ACTIVITY (an estimate/reference; not a verified cost posting).
// WS = INTERNAL WORKING SELL budget (10.2/10.3; not an issued customer quotation).
// CP = CUSTOMER PROPOSAL contract line (reserved/NOT ISSUED unless Release authorized).
// VQ = VENDOR QUOTE source record; AU = non-posting Audit; SC = Scenario reference.
// UI/Module IDs are stable technical identifiers and are not independently posted.
const W=Object.freeze({
 SOW:"SOW",IC:"IC",WS:"WS",CP:"CP",VQ:"VQ",AU:"AU",SC:"SC"
});
export const WORKING_FINANCIAL_NAMESPACES_0553=W;
export function makeWorkingFinancialIdentity0553(contractCode,{activity="FAT",vendor=null,serviceId=null}={}){
 if(!/^(B(?:[1-9]|1[0-4])|C[12])$/.test(contractCode)||!/^[A-Z][A-Z0-9-]*$/.test(activity))
  throw Error("Scope line must be an existing B1–B14/C1/C2 code; cost activity must be explicit");
 const result={
  contractLineId:W.SOW+"-"+contractCode,
  internalCostActivityId:W.IC+"-"+activity+"-001",
  internalWorkingSellId:W.WS+"-"+contractCode,
  customerProposalLineId:W.CP+"-"+contractCode,
  internalScenarioId:W.SC+"-"+contractCode+"-"+activity,
  customerProposalState:"NOT_ISSUED_RELEASE_HOLD",
  financialCostPostingAllowed:false,
  technicalModuleId:"bid.budget.working.bc."+contractCode.toLowerCase(),
  costIdentityRule:"Internal cost is not contract B-number. Contract line is a SOW mapping only; sales price is not supplier/verified direct cost."
 };
 if(vendor&&serviceId){
  if(!/^[A-Z0-9-]+$/.test(vendor)||!/^[A-Z0-9-]+$/.test(serviceId))
   throw Error("Vendor and service codes must be unique named source references");
  result.supplierQuoteId=W.VQ+"-"+vendor+"-"+serviceId;
 }
 return Object.freeze(result);
}
export function validateCostVsCommercialIdentity0553(identities){
 if(!Array.isArray(identities)||!identities.length)throw Error("Missing financial identities");
 const all=identities.flatMap(x=>[
  x.contractLineId,x.internalCostActivityId,x.internalWorkingSellId,
  x.customerProposalLineId,x.internalScenarioId].filter(Boolean));
 if(identities.some(x=>x.contractLineId===x.internalCostActivityId||
    x.internalCostActivityId===x.customerProposalLineId||
    x.internalWorkingSellId===x.customerProposalLineId||
    x.customerProposalState!=="NOT_ISSUED_RELEASE_HOLD"||
    x.financialCostPostingAllowed))
  throw Error("Internal Cost/Working Sell cannot use the same ID as official proposal or post");
 return Object.freeze({valid:true,contractLines:new Set(identities.map(x=>x.contractLineId)).size,
  protectsLegalBCode:true,customerReleased:false});
}
