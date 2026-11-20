import {deriveWpSystemBulkBudget0553} from "./wpSystemBulkBudget0553";
import {LIFECYCLE_SPARES_0553} from "./lifecycleSpareScope0553";

const money=n=>Math.round(n*100)/100;
export function cableCostCalculation({lengthsM=[],unitRateTHB=null,allowancePct=0,extraLoopM=0,minimumM=0}={}){
 const lines=lengthsM.map(m=>{
  const quantity=Number.isFinite(m)?Math.ceil(Math.max(m,minimumM)*(1+allowancePct/100)+extraLoopM):null;
  return {sourceLengthM:m,quantityM:quantity,extendedTHB:quantity!==null&&Number.isFinite(unitRateTHB)?money(quantity*unitRateTHB):null};
 });
 return {lines,quantityM:lines.every(x=>x.quantityM!==null)?lines.reduce((s,x)=>s+x.quantityM,0):null,
  extendedTHB:lines.every(x=>x.extendedTHB!==null)?money(lines.reduce((s,x)=>s+x.extendedTHB,0)):null,
  formula:"SUM CEIL(MAX(source length, minimum) × (1 + allowance %) + loops)",
  caution:"Do not add allowance twice if supplied lengths already include loops/wastage"};
}
export function lifecycleCostCalculation({installedQty=null,spareRate=null,minimumSpare=0,unitPriceTHB=null,tests=null,unitMH=null,mobMH=null,laborRateTHB=null}={}){
 const spareQty=Number.isFinite(installedQty)&&Number.isFinite(spareRate)?Math.max(minimumSpare,Math.ceil(installedQty*spareRate)):null;
 const spareTHB=spareQty!==null&&Number.isFinite(unitPriceTHB)?money(spareQty*unitPriceTHB):null;
 const mh=[tests,unitMH,mobMH].every(Number.isFinite)?money(tests*unitMH+mobMH):null;
 const workTHB=mh!==null&&Number.isFinite(laborRateTHB)?money(mh*laborRateTHB):null;
 return {spareQty,spareTHB,mh,workTHB,
  sparesFormula:"MAX(minimum spare quantity, CEIL(installed quantity × RFQ/OEM ratio))",
  workFormula:"verified tests × evidenced unit manhours + mobilization manhours"};
}
export function deriveSevenLocationCostLedger0553(){
 return deriveWpSystemBulkBudget0553().map(w=>{
  const rows=w.systems.flatMap(sys=>sys.items.map(i=>({...i,system:sys.id})));
  const costed=rows.filter(x=>Number.isFinite(x.extendedTHB));
  const notCosted=rows.filter(x=>!Number.isFinite(x.extendedTHB));
  return {wp:w.wp,siteClass:w.siteClass,rows,pricedCount:costed.length,unpricedCount:notCosted.length,
   bulkScenarioTHB:money(costed.reduce((s,x)=>s+x.extendedTHB,0)),
   b4b5c2:LIFECYCLE_SPARES_0553.rows.filter(x=>x.wp===w.wp),
   costOwnership:w.wp==="ZWP20"?"MIRROR_EXISTING_ROW11_NOT_ADDITIVE":"SEPARATE_BUDGETARY_PROJECTION_NOT_POSTED",
   formula:"Line quantity × compatible supplier rate; lifecycle categories computed independently",
   warning:"Missing costs remain null, not zero; no mixing SCADA cable rate with RF, telephone, RACON or DC cable"};
 });
}
