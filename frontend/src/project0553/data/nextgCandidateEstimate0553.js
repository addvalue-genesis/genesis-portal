// Evidence-level candidate rate breakdown; never equate a quote-wide quantity with a site's required quantity.
import { AVIAT_0553_TECHNICAL_EVALUATION } from "./aviatTechnicalBidEvaluation";
import { MR0001_PACKAGE_COMPOSITION } from "./mr0001PackageComposition";
import { MR0001_RADIO_ROLE_MATRIX } from "./mr0001RadioRoleMatrix";
const byLine=new Map(AVIAT_0553_TECHNICAL_EVALUATION.rows.map(r=>[r.quoteLine,r]));
export const NEXTG_CANDIDATE_ESTIMATE_0553=Object.freeze({
 id:"P553-NG-TRACE",site:"ZWP20",mr:"MR-0001",
 sourceQuote:AVIAT_0553_TECHNICAL_EVALUATION.quoteNumber,sourceCurrency:"USD",
 sourceTotal:AVIAT_0553_TECHNICAL_EVALUATION.quotedTotal,
 estimateFor(item){
  const pkg=MR0001_PACKAGE_COMPOSITION.packages.find(p=>p.platform===item.site&&p.sourceRowIndex===item.sourceRow);
  const roles=MR0001_RADIO_ROLE_MATRIX.sites.find(s=>s.site===item.site);
  const functions=(pkg?.components||[]).map(c=>{
   const candidates=c.candidateQuotes.map(x=>{
    const q=byLine.get(x.quoteLine);
    return {id:c.id+":"+x.quoteLine,quoteLine:x.quoteLine,sku:q?.partNumber||x.partNumber,
     functionId:c.functionId,offeredQty:q?.sourceQty??null,unitPrice:q?.unitPrice??null,
     quotedExtended:q?.quotedTotal??null,currency:q?.currency||"USD",
     quotedGroup:q?.group||null,technicalState:q?.classification||"UNMAPPED",
     issues:q?.issues||[],sourceId:q?.sourceId||null,
     // deliberately NOT an allocation
     siteRequiredQty:null,siteAllocatedQty:null,estimatedSiteCost:null};
   });
   return {id:c.id,functionId:c.functionId,quantityDriver:c.quantityDriver,
    requiredQty:c.requiredQty,technicalState:c.technicalState,candidates};
  });
  return {itemId:item.id,site:item.site,sourceTag:item.sourceTag,sourceRow:item.sourceRow,
   sourceScopeQty:item.sourceScopeQty,sourceScopeUnit:item.sourceScopeUnit,
   roleEvidence:roles?{ptMpBaseCandidates:roles.ptMpBaseCandidates,ptMpRemoteCandidates:roles.ptMpRemoteCandidates,
    ptpPeerCandidates:roles.ptpPeerCandidates,status:roles.status}:null,
   functions,quoteLineCount:functions.reduce((n,f)=>n+f.candidates.length,0),
   siteVendorEstimateUSD:null,
   status:"VENDOR_UNIT_RATES_AVAILABLE__SITE_QUANTITY_AND_ALLOCATION_NOT_APPROVED",
   criticalNote:"Quotation rates are sourced; quoted totals and quantities belong to entire offer. No location-specific cost until roles, licences, capacity, RF and quantity proof are evaluated.",
   calculation:"Site cost = Σ (derived physical quantity × chosen source unit rate) + directly attributed accessories + bulk + services + risk"};
 }
});
