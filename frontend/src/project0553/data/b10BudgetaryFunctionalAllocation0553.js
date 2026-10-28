// PJ2608-0553 / WORKING selected MR-kit budget → PRE-AWARD presentation allocation.
// This is an arithmetic disclosure of existing allowances, NOT a supplier/OEM
// price per spare SKU and NOT a substitute for actual SPIR quantities.
import {selectSpareCustomerSchedule0553} from "./spareCustomerSchedule0553";
import {selectB10StageSpareSelection0553} from "./b10StageSpareSelection0553";
const freeze=Object.freeze,round2=n=>Math.round((n+Number.EPSILON)*100)/100;
export function selectB10BudgetaryFunctionalAllocation0553(){
 const s=selectSpareCustomerSchedule0553(),stage=selectB10StageSpareSelection0553();
 const parents=s.currentByCode.B10;
 const fx=parents[0]?.workingFxTHBPerUSD;
 if(parents.length!==4||!Number.isFinite(fx)||fx<=0||
    parents.some(p=>p.workingFxTHBPerUSD!==fx))throw Error("B10 Working FX/source owner changed");
 const totalTHB=round2(parents.reduce((n,p)=>n+p.extendedTHB,0));
 const byOwner=freeze(parents.map(p=>{
  const siblings=stage.stageRows.filter(x=>x.parentSourceId===p.id);
  if(!siblings.length||!Number.isInteger(p.qty)||p.qty<=0)
   throw Error("B10 contract-kit owner has no engineering breakdown: "+p.id);
  const ownerUSD=round2(p.extendedTHB/fx);
  // Equal-sharing is the default UNAPPROVED BUDGET DISPLAY allocation when
  // no independent SKU prices exist. Remainder goes to last line, ensuring
  // all rows reconcile exactly to the canonical Working owner.
  const equal=round2(ownerUSD/siblings.length);
  const money=siblings.map((x,i)=>i===siblings.length-1?
   round2(ownerUSD-equal*(siblings.length-1)):equal);
  return freeze({id:p.id,mr:p.linkedMR[0],kitQty:p.qty,sourceRowModuleId:p.sourceRowModuleId,
   sourceTotalTHB:p.extendedTHB,sourceTotalUSD:ownerUSD,
   sourceUnitTHB:p.unitPriceTHB,sourceUnitUSD:round2(p.unitPriceTHB/fx),
   allocationMethod:"EQUAL_FUNCTIONAL_SHARE_OF_MR_WORKING_ENVELOPE__NOT_SKU_UNIT_RATE",
   items:freeze(siblings.map((x,i)=>freeze({sourceSelectionId:x.id,parentSourceId:p.id,
    sourceRowModuleId:p.sourceRowModuleId,quantity:1,unit:"LOT",
    allocatedBudgetaryUnitUSD:money[i],allocatedBudgetaryTotalUSD:money[i],
    allocatedBudgetaryTotalTHB:round2(money[i]*fx),sparePurchaseQtyVerified:null,
    actualSkuUnitPriceUSD:null,actualCifUnitSellUSD:null,nonposting:true,
    priceClass:"BUDGETARY_ENVELOPE_ALLOCATION_ONLY__NOT_OEM_UNIT_SELL"})))});
 }));
 const all=freeze(byOwner.flatMap(x=>x.items));
 const totalUSD=round2(byOwner.reduce((n,x)=>n+x.sourceTotalUSD,0));
 if(all.length!==14||totalTHB!==509827.5||
  Math.abs(totalUSD-round2(totalTHB/fx))>0.01||
  Math.abs(round2(all.reduce((s,r)=>s+r.allocatedBudgetaryTotalUSD,0))-totalUSD)>0.01)
  throw Error("0553 B10 functional budgetary allocation differs from selected 10.2 Working");
 if(byOwner.some(owner=>Math.abs(round2(owner.items.reduce((n,x)=>n+x.allocatedBudgetaryTotalUSD,0))-owner.sourceTotalUSD)>0.01))
  throw Error("0553 B10 MR envelope attribution unreconciled");
 return freeze({
  moduleId:"bid.budget.working.bc.b10.budgetary-functional-allocation",
  workingSourceModule:"bid.budget.working.bc.b10",
  original10_2WorkingSellTHB:totalTHB,totalAllocatedUSD:totalUSD,
  planningFxTHBPerUSD:fx,selectedFinancialSourceRows:freeze(parents.map(x=>x.id)),
  byOwner,rows:all,allocationMethod:"EQUAL_FUNCTION_SHARE__PRESENTATION_ONLY",
  countIsActualSkuQty:false,OEMSpirComplete:false,priceChangesSelectedWorking:false,
  customerIssueAllowed:false,note:"1 LOT represents one functional allowance line; it is NOT the count of spare units. Equal price share is NOT an independently sourced component price."
 });
}
