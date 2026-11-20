// Non-destructive projection of quotation header and terms. Never invent missing terms.
const REQUIRED_TERMS=["incoterm","deliveryPlace","leadTime","payment","warranty","taxes","exclusions","packingFreight","certificates"];
export function quotationCommercialRecord(quote){
 const original=quote||{};
 const terms=original.terms??null;
 const normalized={
  incoterm:null,deliveryPlace:null,leadTime:null,payment:null,warranty:null,
  taxes:null,exclusions:null,packingFreight:null,certificates:null
 };
 // Raw quotation text is authoritative; no regex guesses presented as verified clauses.
 return {
  quoteId:original.id,quotationNo:original.quotation,revision:original.revision??null,
  vendor:original.vendor,source:original.source,sourceUrl:/^https:\/\//.test(original.source||"")?original.source:null,
  scope:original.scope,date:original.date??null,validUntil:original.validUntil??null,
  currency:original.currency,quotedTotal:original.quotedTotal,
  sourceTermsRaw:terms,normalizedTerms:normalized,
  missingTerms:REQUIRED_TERMS.filter(k=>normalized[k]===null),
  verification:"SOURCE_TERMS_NOT_FULLY_VERIFIED",quoteStatus:original.status,
  originalQuote:original
 };
}
export function buildQuotationCommercialRegister(quotes=[]){
 return quotes.map(quotationCommercialRecord);
}
