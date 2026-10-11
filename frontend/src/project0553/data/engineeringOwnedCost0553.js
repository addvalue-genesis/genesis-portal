// Engineering owns the required functions and quantities; suppliers only supply compatible rates.
// Never derive purchase quantities from supplier offer quantities or default missing values to 1.
import {SCADA_LINKS_0553} from "./scadaLinkEvidence";
import {MR0001_PACKAGE_COMPOSITION} from "./mr0001PackageComposition";
import {AVIAT_0553_TECHNICAL_EVALUATION} from "./aviatTechnicalBidEvaluation";
const quotes=new Map(AVIAT_0553_TECHNICAL_EVALUATION.rows.map(q=>[q.quoteLine,q]));
const validQty=q=>Number.isFinite(q)&&q>=0;
const ZWP20_RADIO_TAG="MR-502-001";
function engineeringQuantity(item,component,packageRow){
 const recorded=validQty(component.requiredQty)?component.requiredQty:null;
 if(recorded!==null)return {qty:recorded,state:"ENGINEERING_SOURCE",proof:"Controlled Engineering BOM"};
 if(item.site!=="ZWP20"||item.sourceTag!==ZWP20_RADIO_TAG||item.sourceRow!==4)return {qty:null,state:"TOPOLOGY_REVIEW",proof:"Site interface not yet reconciled"};
 const links=SCADA_LINKS_0553.filter(link=>link.to==="ZWP20"&&link.from==="ZWP8");
 const anchored=links.length===1&&item.sourceScopeQty===1&&packageRow?.sourceCodes?.length===1;
 if(!anchored)return {qty:null,state:"MTO_TOPOLOGY_CONFLICT",proof:"One-to-one source / link verification failed"};
 if(component.functionId==="RADIO_EQUIPMENT")return {qty:1,state:"DOCUMENT_DERIVED_PRELIMINARY",proof:"MTO Rev04 ZWP20 row4: 1 radio ODU Set; RPT-0001 C1 ZWP8→ZWP20: one remote endpoint; redundancy unverified"};
 if(["RF_FILTER","CAPACITY_KEY","REGION_KEY","POWER","POWER_CORD","MOUNT_FEEDER"].includes(component.functionId))
   return {qty:1,state:"PARAMETRIC_1_PER_RADIO_ASSUMPTION",proof:"1 radio endpoint × 1 "+component.functionId+" per radio candidate; confirm actual function requirement, licensing, shared mount and power design; not approved"};
 return {qty:null,state:"CONTRACTUAL_OR_INTERFACE_INPUT_REQUIRED",proof:"Warranty period/entitlement cannot be derived as a physical unit from radio count"};
}
export function deriveEngineeringOwnedCost0553(item){
 const packageRow=MR0001_PACKAGE_COMPOSITION.packages.find(p=>p.platform===item.site&&p.sourceRowIndex===item.sourceRow);
 const components=(packageRow?.components||[]).map(c=>{
  const matches=c.candidateQuotes.map(v=>{
   const q=quotes.get(v.quoteLine);
   return {quoteLine:v.quoteLine,sku:q?.partNumber||v.partNumber,offeredQty:q?.sourceQty??null,
    currency:q?.currency||v.currency,unitPrice:Number.isFinite(q?.unitPrice)?q.unitPrice:null,
    candidateStatus:q?.classification||"UNREVIEWED"};
  });
  const standardWarranty=c.functionId==="WARRANTY";
  const derivation=standardWarranty?{qty:null,state:"STANDARD_INCLUDED_NO_INCREMENTAL_COST",proof:"Standard OEM warranty is included in equipment base price. Extended warranty is separate optional scope, not a required radio hardware BOM quantity."}:engineeringQuantity(item,c,packageRow);
  const qty=derivation.qty;
  const selected=standardWarranty?null:c.selectedOffer?matches.find(x=>x.quoteLine===c.selectedOffer||x.sku===c.selectedOffer):null;
  const budgetaryCodes={RADIO_EQUIPMENT:"B-1",RF_FILTER:"B-2",CAPACITY_KEY:"B-3",REGION_KEY:"B-4",MOUNT_FEEDER:"B-5",POWER:"B-6",POWER_CORD:"B-7"};
  // Budgetary selection follows the Engineering topology decision; never offered quantity.
  // ZWP20 has a single remote endpoint in RPT/MTO, hence Group B remote candidate.
  // Each function may be costed once, while OEM approval and deviations remain tracked.
  const remoteTopology=SCADA_LINKS_0553.some(l=>l.from==="ZWP8"&&l.to===item.site&&l.mode==="PTMP");
  const budgetaryEligible=item.site==="ZWP20"&&item.sourceTag==="MR-502-001"&&item.sourceRow===4
    &&item.sourceScopeQty===1&&remoteTopology&&!standardWarranty;
  const budgetaryCandidate=budgetaryEligible
    ?matches.find(q=>q.quoteLine===budgetaryCodes[c.functionId]&&Number.isFinite(q.unitPrice)):null;
  const budgetaryExtended=qty!==null&&Number.isFinite(budgetaryCandidate?.unitPrice)
   ?Math.round(qty*budgetaryCandidate.unitPrice*100)/100:null;
  const price=standardWarranty?null:selected&&Number.isFinite(selected.unitPrice)?selected.unitPrice:null;
  const extended=qty!==null&&price!==null?Math.round(qty*price*100)/100:null;
  return {id:c.id,functionId:c.functionId,nonCostedIncluded:standardWarranty,driver:c.quantityDriver,requiredQty:qty,quantityState:derivation.state,quantityProof:derivation.proof,selectedOffer:c.selectedOffer,
   vendorCandidates:matches,budgetaryQuoteLine:budgetaryCandidate?.quoteLine||null,budgetaryUnitPrice:budgetaryCandidate?.unitPrice??null,budgetaryExtended,
   budgetaryDecision:budgetaryCandidate?"ENGINEERING_REMOTE_ROLE_MATCH__OEM_REVIEW":"NO_BUDGETARY_MATCH",
   unitPrice:price,currency:selected?.currency||null,
   extended,technicalState:c.technicalState,
   state:standardWarranty?"INCLUDED_STANDARD_WARRANTY_NO_EXTRA_COST":extended!==null?"COSTED_FROM_ENGINEERING_QTY":qty!==null?"QTY_DERIVED_VENDOR_SELECTION_REQUIRED":"ENGINEERING_QTY_REQUIRED"};
 });
 const preliminaryRows=components.filter(c=>c.budgetaryExtended!==null);
 const budgetaryPartialUSD=preliminaryRows.length?Math.round(preliminaryRows.reduce((n,c)=>n+c.budgetaryExtended,0)*100)/100:null;
 const budgetaryCoverage=components.length>0&&components.filter(c=>!c.nonCostedIncluded).every(c=>c.budgetaryExtended!==null);
 const budgetaryItemTotalUSD=budgetaryCoverage?budgetaryPartialUSD:null;
 const budgetaryDecision={basis:"MTO Rev04 ZWP20 row4 + RPT-0001 C1 PTMP remote endpoint",selectedVendor:"Next G",configuration:"Remote Group B",
   quotation:"NG/260916-ADV-DAP1",scope:"MR-502-001 radio ODU function subset, not antenna/bulk/site totals",
   qtySource:"ENGINEERING_TOPOLOGY_AND_EXPLICIT_PARAMETRIC_ASSUMPTIONS",
   requiredDeviationReview:["RF capacity/throughput entitlement","Myanmar region/frequency entitlement","Power cord/site DC interface","RF filter and mounting ownership"],
   standardWarranty:"INCLUDED",state:budgetaryCoverage?"BUDGETARY_FUNCTION_ESTIMATE__NOT_RELEASED":"BUDGETARY_PARTIAL__GAPS_RECORDED"};
 const ready=components.length>0&&components.every(c=>c.nonCostedIncluded||c.extended!==null);
 const currencySet=[...new Set(components.filter(c=>c.extended!==null).map(c=>c.currency))];
 const amount=ready&&currencySet.length===1?Math.round(components.reduce((n,c)=>n+c.extended,0)*100)/100:null;
 return {site:item.site,tag:item.sourceTag,sourceRow:item.sourceRow,components,
  requiredFunctionCount:components.filter(c=>!c.nonCostedIncluded).length,qtyDerivedCount:components.filter(c=>!c.nonCostedIncluded&&c.requiredQty!==null).length,
  costedFunctionCount:components.filter(c=>!c.nonCostedIncluded&&c.extended!==null).length,budgetaryCostedCount:preliminaryRows.length,budgetaryPartialUSD,budgetaryItemTotalUSD,budgetaryCoverage,
  amount,currency:amount!==null?currencySet[0]:null,budgetaryDecision,
  state:amount!==null?"ENGINEERING_BOM_COSTED_REQUIRES_APPROVAL":"DERIVATION_INCOMPLETE",
  rule:"Engineering requiredQty is authoritative. Vendor quotedQty is price evidence only. No synthetic quantity or false aggregate."};
}
