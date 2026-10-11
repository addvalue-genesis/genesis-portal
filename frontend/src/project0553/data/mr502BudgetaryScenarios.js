// Provisional one-radio assembly reference only, NOT installed site quantity or selected configuration.
// Rates come from Next G quotation; excludes antenna selections, warranties, region keys, enclosure, bulk, services.
// Groups A/B/C are alternatives and may overlap; never add scenarios.
import NEXTG from "./quotes/NG-260916-ADV-DAP1.full.json";
const byCode=new Map(NEXTG.lines.map(x=>[x.code,x]));
const groupCodes={
 A:["A-1","A-2","A-4","A-5","A-6","A-7","A-8"],
 B:["B-1","B-2","B-3","B-5","B-6","B-7","B-8"],
 C:["C-1","C-2","C-3","C-5","C-6","C-7","C-8"]
};
export function getMR502BudgetaryScenarios(item){
 if(item.site!=="ZWP20"||!/^MR-502-001(?:[A-Z])?$/.test(item.sourceTag))return [];
 return Object.entries(groupCodes).map(([group,codes])=>{
  const lines=codes.map(code=>byCode.get(code)).filter(Boolean).map(q=>({
   code:q.code,sku:q.partNumber,unitPrice:q.unitPrice,sourceQuoteQty:q.qty,
   assumedQty:1,extendedUSD:Number.isFinite(q.unitPrice)?q.unitPrice:null
  }));
  const priced=lines.every(x=>Number.isFinite(x.extendedUSD));
  const partialUSD=priced?Math.round(lines.reduce((n,x)=>n+x.extendedUSD,0)*100)/100:null;
  return {group,lines,unitAssemblyReferenceUSD:partialUSD,illustrativeAssemblyQty:1,
   status:"BUDGETARY_PARTIAL_SCENARIO_NOT_SELECTED",
   exclusions:"Antenna/sector/dish, GPS, warranty choice, region entitlement, NMS, enclosure, site bulk, engineering, logistics, FAT/SAT and installation are not included; check radio capacity and Ex/power constraints",
   evidence:NEXTG.quoteNumber,quotationWideGroupQty:byCode.get(group+"-1")?.qty??null};
 });
}
