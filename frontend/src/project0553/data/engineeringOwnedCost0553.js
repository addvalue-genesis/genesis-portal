// Engineering owns the required functions and quantities; suppliers only supply compatible rates.
// Never derive purchase quantities from supplier offer quantities or default missing values to 1.
import {MR0001_PACKAGE_COMPOSITION} from "./mr0001PackageComposition";
import {AVIAT_0553_TECHNICAL_EVALUATION} from "./aviatTechnicalBidEvaluation";
const quotes=new Map(AVIAT_0553_TECHNICAL_EVALUATION.rows.map(q=>[q.quoteLine,q]));
const validQty=q=>Number.isFinite(q)&&q>=0;
export function deriveEngineeringOwnedCost0553(item){
 const packageRow=MR0001_PACKAGE_COMPOSITION.packages.find(p=>p.platform===item.site&&p.sourceRowIndex===item.sourceRow);
 const components=(packageRow?.components||[]).map(c=>{
  const matches=c.candidateQuotes.map(v=>{
   const q=quotes.get(v.quoteLine);
   return {quoteLine:v.quoteLine,sku:q?.partNumber||v.partNumber,offeredQty:q?.sourceQty??null,
    currency:q?.currency||v.currency,unitPrice:Number.isFinite(q?.unitPrice)?q.unitPrice:null,
    candidateStatus:q?.classification||"UNREVIEWED"};
  });
  const qty=validQty(c.requiredQty)?c.requiredQty:null;
  const selected=c.selectedOffer?matches.find(x=>x.quoteLine===c.selectedOffer||x.sku===c.selectedOffer):null;
  const price=selected&&Number.isFinite(selected.unitPrice)?selected.unitPrice:null;
  const extended=qty!==null&&price!==null?Math.round(qty*price*100)/100:null;
  return {id:c.id,functionId:c.functionId,driver:c.quantityDriver,requiredQty:qty,selectedOffer:c.selectedOffer,
   vendorCandidates:matches,unitPrice:price,currency:selected?.currency||null,
   extended,technicalState:c.technicalState,
   state:extended!==null?"COSTED_FROM_ENGINEERING_QTY":"ENGINEERING_QTY_OR_SELECTION_REQUIRED"};
 });
 const ready=components.length>0&&components.every(c=>c.extended!==null);
 const currencySet=[...new Set(components.filter(c=>c.extended!==null).map(c=>c.currency))];
 const amount=ready&&currencySet.length===1?Math.round(components.reduce((n,c)=>n+c.extended,0)*100)/100:null;
 return {site:item.site,tag:item.sourceTag,sourceRow:item.sourceRow,components,
  requiredFunctionCount:components.length,qtyDerivedCount:components.filter(c=>c.requiredQty!==null).length,
  costedFunctionCount:components.filter(c=>c.extended!==null).length,
  amount,currency:amount!==null?currencySet[0]:null,
  state:amount!==null?"ENGINEERING_BOM_COSTED_REQUIRES_APPROVAL":"DERIVATION_INCOMPLETE",
  rule:"Engineering requiredQty is authoritative. Vendor quotedQty is price evidence only. No synthetic quantity or false aggregate."};
}
