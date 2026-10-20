// PJ2608-0553 · 10.3 Customer Release staging model.
// NEVER mutate 10.1 / 10.2. Never equate Working SELL with direct COST.
// A/C: cost × (1 + 20% SAMTEL + 5% ADDVALUE + 5% ADDVALUE omission reserve).
// B: show canonical 10.2 Working SELL unchanged; SAMTEL deducts 5% internally.
import {selectWorkingBomProjection0553} from "./workingBomAggregation0553";
import {selectBcTurnkeyWorkingCost0553} from "./bcTurnkeyWorkingCost0553";
import {selectSpareCustomerSchedule0553} from "./spareCustomerSchedule0553";

export const RELEASE_POLICY_0553=Object.freeze({
 id:"P553-RELEASE-PRICING-R01",
 aAndC:{samtelCostPct:20,addvalueCostPct:5,omissionReserveCostPct:5,priceFactor:1.30},
 b:{customerSellMultiplier:1,samtelDeductionOfCustomerSellPct:5},
 base:["A","B"],optional:["C1","C2"],currency:"THB",
 state:"INTERNAL_PROVISIONAL__NOT_APPROVED"
});
export const RELEASE_CUSTOMER_COLUMNS_0553=Object.freeze({
 scope:["S.N / 序号","Tag No. / 位号","Description / 名称","Main Specification / 主要参数","Qty / 数量","Unit Price / 单价","Sub-Total / 小计","Remark / 备注"],
 annex:["Item / 序号","Tag No / 位号","Description / 描述","Detail Specification / 详细规格","Materials / 材质","QTY / 数量","UNIT PRICE (CURRENCY) / 单价","TOTAL PRICE (CURRENCY) / 总价"]
});
const n=x=>typeof x==="number"&&Number.isFinite(x);
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
const sum=rows=>round(rows.reduce((a,r)=>a+r,0));
const positive=n=>typeof n==="number"&&Number.isFinite(n)&&n>0;
export function priceAorCFromCost0553(costTHB){
 if(!n(costTHB)||costTHB<0)return null;
 const p=RELEASE_POLICY_0553.aAndC;
 return Object.freeze({
  directCostTHB:round(costTHB),
  samTelShareTHB:round(costTHB*p.samtelCostPct/100),
  addvalueTargetProfitTHB:round(costTHB*p.addvalueCostPct/100),
  omissionReserveTHB:round(costTHB*p.omissionReserveCostPct/100),
  customerSellTHB:round(costTHB*p.priceFactor)
 });
}
export function priceBWorkingSell0553(workingSellTHB,actualCostTHB=null){
 if(!n(workingSellTHB)||workingSellTHB<0)return null;
 const deduction=round(workingSellTHB*RELEASE_POLICY_0553.b.samtelDeductionOfCustomerSellPct/100);
 return Object.freeze({
  customerSellTHB:round(workingSellTHB),samTelDeductionTHB:deduction,
  addvalueReceivableTHB:round(workingSellTHB-deduction),
  directCostTHB:n(actualCostTHB)?round(actualCostTHB):null,
  addvalueProfitTHB:n(actualCostTHB)?round(workingSellTHB-deduction-actualCostTHB):null
 });
}
const LINE_DESCRIPTION_0553=Object.freeze({
 A1:"MR-0001 SCADA / AVIAT / Cisco",A2:"MR-0002 Trunk Radio",
 A3:"MR-0003 Ex Telephone / Sounder",A4:"MR-0004 RACON"
});
const resultMoneyTHB=(line,rate)=>{
 if(!line.counted||!n(line.extended))return null;
 return line.currency==="THB"?round(line.extended):
  line.currency==="USD"&&positive(rate)?round(line.extended*rate):null;
};
export function buildReleaseCommercialModel0553({thbPerUsd=null}={}){
 const rate=positive(thbPerUsd)?thbPerUsd:null;
 const bc=selectBcTurnkeyWorkingCost0553();
 const spare=selectSpareCustomerSchedule0553();
 const aCodes=Object.keys(LINE_DESCRIPTION_0553);
 const a=aCodes.map(code=>{
  const mr="MR-000"+code.slice(1);
  const bom=selectWorkingBomProjection0553({mr});
  const sourceRows=bom.lines.filter(r=>r.counted).map((line,index)=>{
   const item=line.item||{};
   const rawQty=n(item.sourceQty)?item.sourceQty:n(item.qty)?item.qty:null;
   const cost=resultMoneyTHB(line,rate);
   const unit=n(cost)&&positive(rawQty)?round(cost/rawQty):null;
   return {
    id:String(line.id||index),code,sourceModuleId:"bid.budget.bom.system-location-mto",
    mr,site:line.site,tag:String(line.tag||"NOT VERIFIED"),
    description:item.description||item.role||LINE_DESCRIPTION_0553[code],
    specification:[item.vendor,item.sku].filter(Boolean).join(" / ")||item.note||"OEM specification pending",
    qty:rawQty,unit:item.sourceUnit||item.unit||null,
    costTHB:cost,unitCostTHB:unit,
    customerUnitTHB:unit===null?null:priceAorCFromCost0553(unit).customerSellTHB,
    customerSellTHB:cost===null?null:priceAorCFromCost0553(cost).customerSellTHB,
    sourcePriceCurrency:line.currency,sourceRef:line.source,
    status:item.status||"WORKING_EVIDENCE_NOT_APPROVED",verified:false
   };
  });
  const countedCosts=sourceRows.map(x=>x.costTHB).filter(n);
  const partialCost= sum(countedCosts);
  const costComplete=bom.unresolved===0&&bom.invalidPosting.length===0&&
    !bom.scenario&&sourceRows.length>0&&countedCosts.length===sourceRows.length&&
    sourceRows.every(x=>positive(x.qty)&&x.tag!=="NOT VERIFIED");
  return {code,mr,description:LINE_DESCRIPTION_0553[code],sourceModuleId:"bid.budget.bom.system-location-mto",
   sourceRows,previewCostTHB:countedCosts.length?partialCost:null,
   previewSellTHB:countedCosts.length?priceAorCFromCost0553(partialCost).customerSellTHB:null,
   pricedCount:countedCosts.length,unresolvedCount:bom.unresolved,
   state:costComplete?"WORKING_COMPLETE_BUT_NOT_APPROVED":"PARTIAL_WORKING_COST_NOT_CUSTOMER_RELEASE",
   costComplete,releaseAllowed:false};
 });
 const b=bc.rows.filter(r=>r.code.startsWith("B")).map(r=>{
  const price=priceBWorkingSell0553(r.workingSellTHB,r.directCostTHB);
  return {code:r.code,description:r.requirement,sourceModuleId:r.moduleId,
   qty:1,unit:"lot",workingSellTHB:r.workingSellTHB,
   customerSellTHB:price?.customerSellTHB??null,
   samTelDeductionTHB:price?.samTelDeductionTHB??null,
   addvalueReceivableTHB:price?.addvalueReceivableTHB??null,
   actualCostTHB:price?.directCostTHB??null,
   profitTHB:price?.addvalueProfitTHB??null,
   conditional:r.code==="B7"||r.code==="B9",
   costComplete:n(r.directCostTHB),releaseAllowed:false,
   sourceStatus:r.priceStatus,workingSellBasis:r.workingSellBasis};
 });
 const c=bc.rows.filter(r=>r.code.startsWith("C")).map(r=>{
  // "workingSellTHB" is *not* a supplier direct cost. Never markup it by 30%.
  const basis=n(r.directCostTHB)?priceAorCFromCost0553(r.directCostTHB):null;
  return {code:r.code,description:r.requirement,sourceModuleId:r.moduleId,
   qty:1,unit:"lot",workingReferenceTHB:r.workingSellTHB,
   verifiedDirectCostTHB:r.directCostTHB,
   customerSellTHB:basis?.customerSellTHB??null,
   samTelShareTHB:basis?.samTelShareTHB??null,
   reserveTHB:basis?.omissionReserveTHB??null,
   addvalueTargetProfitTHB:basis?.addvalueTargetProfitTHB??null,
   costComplete:Boolean(basis),optional:true,releaseAllowed:false,
   state:basis?"WORKING_COST_NOT_APPROVED":"DIRECT_COST_NOT_ESTABLISHED__NO_30_PERCENT_ON_WORKING_SELL"};
 });
 const annexCodes=["B10","B11","B13","C1","C2"];
 const annex=Object.fromEntries(annexCodes.map(code=>[code,(spare.byCode[code]||[]).map(x=>({
  id:x.id,code,sourceModuleId:"bid.budget.working.bc."+code.toLowerCase(),
  tagNo:x.tagNo,description:x.description,
  specification:x.detailSpecification,materials:x.materials,qty:x.qty,unit:x.unit,
  leadTimeARO:x.leadTimeARO,referenceUnitTHB:x.unitPriceTHB,referenceTotalTHB:x.extendedTHB,
  customerUnitTHB:null,customerTotalTHB:null,
  status:x.mappingStatus,sourceId:x.sourceId,customerReleaseAllowed:false,
  note:"Rev08 budgetary reference; OEM SKU/quantity/cost not approved"
 }))]));
 const aKnown=a.filter(x=>n(x.previewSellTHB));
 const bKnown=b.filter(x=>n(x.customerSellTHB));
 const cKnown=c.filter(x=>n(x.customerSellTHB));
 const aCost=sum(a.filter(x=>n(x.previewCostTHB)).map(x=>x.previewCostTHB));
 const aPrice=sum(aKnown.map(x=>x.previewSellTHB));
 const bPrice=sum(bKnown.map(x=>x.customerSellTHB));
 const bSamTel=sum(bKnown.map(x=>x.samTelDeductionTHB));
 const bNet=sum(bKnown.map(x=>x.addvalueReceivableTHB));
 const bProfitComplete=b.every(x=>n(x.profitTHB));
 const aCostComplete=a.every(x=>x.costComplete);
 const cCostComplete=c.every(x=>x.costComplete);
 const annexOverflow=annexCodes.filter(code=>annex[code].length>13);
 const aOverflow=a.reduce((t,x)=>t+x.sourceRows.length,0)>15;
 const gaps=[
  ...a.filter(x=>!x.costComplete).map(x=>x.code+" equipment cost / TAG / FX pending"),
  ...b.filter(x=>!x.costComplete).map(x=>x.code+" verified direct cost pending"),
  ...c.filter(x=>!x.costComplete).map(x=>x.code+" verified supplier cost pending"),
  ...annexOverflow.map(x=>x+" exceeds 13 original rows"),
  ...(aOverflow?["Part A exceeds 15 original TAG rows"]:[]),
  "Approval snapshot, verified FX, commercial owner sign-off and original XLSX reconciliation required"
 ];
 return Object.freeze({
  moduleId:"bid.budget.pricing.release",policy:RELEASE_POLICY_0553,
  a,b,c,annex,summary:{
   aProvisionalCostTHB:aKnown.length?aCost:null,
   aProvisionalCustomerSellTHB:aKnown.length?aPrice:null,
   aProvisionalSamTelShareTHB:aKnown.length?round(aCost*.20):null,
   aProvisionalAddvalueTargetProfitTHB:aKnown.length?round(aCost*.05):null,
   aProvisionalReserveTHB:aKnown.length?round(aCost*.05):null,
   bProvisionalCustomerSellTHB:bKnown.length?bPrice:null,
   bProvisionalSamTelDeductionTHB:bKnown.length?bSamTel:null,
   bProvisionalNetReceivableTHB:bKnown.length?bNet:null,
   bVerifiedCostTHB:bProfitComplete?sum(b.map(x=>x.actualCostTHB)):null,
   bProfitTHB:bProfitComplete?sum(b.map(x=>x.profitTHB)):null,
   cOptionalCustomerSellTHB:cCostComplete?sum(cKnown.map(x=>x.customerSellTHB)):null,
   baseCustomerSellTHB:aCostComplete&&b.every(x=>n(x.customerSellTHB))?round(aPrice+bPrice):null,
   addvalueRealizedProfitTHB:null // Incomplete verified total cost; never invent profit.
  },
  sourceCoverage:{aReady:aCostComplete,bSellReady:b.length===bKnown.length,
   bCostReady:bProfitComplete,cCostReady:cCostComplete,
   annexOverflow,aOverflow,gaps},
  approval:{approved:false,releaseAllowed:false,exportNativeAllowed:false,
   reason:"Commercial snapshot is not approved, source TAG/annex allocation and Cost Ledger incomplete"}
 });
}
