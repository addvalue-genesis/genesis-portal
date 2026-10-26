// PJ2608-0553 / 10.3.4 price-to-source projection of B10 functional LOT rows.
// Each of 14 displayed 1-LOT amounts is allocated from its own immutable
// 10.3.4 MR parent (including USD100 summary rounding). This is NOT a
// verified OEM spare unit quote or delivered spare physical quantity.
import {selectB10NativeAnnexReview0553} from "./b10NativeAnnexReview0553";
const freeze=Object.freeze;
export function buildB10OfficialItemizedAnnex0553(official){
 const base=selectB10NativeAnnexReview0553();
 const parents=official?.annex?.B10||[],summary=official?.b?.find(x=>x.code==="B10");
 if(official?.currency!=="USD"||official.issued!==false||
    parents.length!==4||!Number.isFinite(summary?.amountUSD))
  throw Error("0553 B10 Official item allocation needs 4 unissued, priced source MR owners");
 const rows=freeze(parents.flatMap(parent=>{
  const items=base.rows.filter(x=>x.parentSourceId===parent.sourceId);
  if(!items.length||parent.qty!==({"B10-PTTEP-01":4,"B10-PTTEP-02":3,"B10-PTTEP-03":4,"B10-PTTEP-04":3})[parent.sourceId]||
     !Number.isFinite(parent.totalUSD)||!parent.traceId||!parent.sourceRowModuleId||
     items.some(x=>x.traceId!==parent.traceId||x.sourceRowModuleId!==parent.sourceRowModuleId))
   throw Error("0553 B10 Official cannot map exact functional item to source parent "+parent.sourceId);
  const cents=Math.round(parent.totalUSD*100);
  const per=Math.floor(cents/items.length),remaining=cents-per*items.length;
  return items.map((row,i)=>freeze({
   ...row,officialPriceClass:"PROVISIONAL_PARENT_ROUNDING_ALLOCATION_NOT_OEM_SKU_PRICE",
   qty:1,unit:"LOT",unitUSD:(per+(i<remaining?1:0))/100,
   totalUSD:(per+(i<remaining?1:0))/100,
   parentOfficialUSD:parent.totalUSD,
   parentWorkingTHB:parent.sourceTHB,
   isPhysicalSpareQtyVerified:false,isOemSpareUnitPriceVerified:false,
   issued:false,
   lineSourceId:row.id,financeSourceId:row.parentSourceId
  }));
 }));
 const round2=n=>Math.round((n+Number.EPSILON)*100)/100;
 const total=round2(rows.reduce((n,x)=>n+x.totalUSD,0));
 if(rows.length!==14||new Set(rows.map(x=>x.id)).size!==14||
   total!==summary.amountUSD||
   parents.some(p=>round2(rows.filter(x=>x.parentSourceId===p.sourceId)
    .reduce((n,x)=>n+x.totalUSD,0))!==p.totalUSD))
  throw Error("0553 B10 Official 14-line split does not reconcile to 4 existing rounded MR prices");
 return freeze({rows,totalUSD:total,currency:"USD",
  sourceModelId:"bid.budget.pricing.release.preview",
  sourceRowIds:freeze(parents.map(x=>x.sourceId)),
  mode:"PRE_AWARD_BUDGETARY_NONISSUED",
  authorizesOemSpareSku:false,authorizesPhysicalSpareQty:false,
  customerIssued:false,needsIncotermApproval:true,
  notice:"PRE-AWARD BUDGETARY LOT ALLOCATION ONLY. Each Qty 1 LOT is a financial functional allowance, NOT one physical replacement spare. OEM SPIR spare SKU/quantity, CIF price, and buyer approval remain open."
 });
}
