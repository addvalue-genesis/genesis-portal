// Read-only Part B/C Scope binding, never a second cost ledger.
// Current WBS figures are ADDVALUE WORKING SELL, NOT internal cost or released customer price.
// C and owner/OEM rows without a controlled current rate remain unpriced, not zero.
import {derivePartBcWorkingWbs0553,PART_BC_WBS_SOURCE_0553} from "./partBCWorkingWbs0553";
const SCOPE_CODES=["B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","B14","C1","C2"];
const spares=new Set(["B10","B11","B13","C1","C2"]);
export function selectScopePartBcWorking0553(){
 const source=derivePartBcWorkingWbs0553();
 const lines=Object.fromEntries(source.rows.filter(r=>SCOPE_CODES.includes(r.code)).map(r=>{
  const priced=Number.isFinite(r.sellTHB);
  return [r.code,{
   code:r.code,amountTHB:priced?r.sellTHB:null,
   unitRateTHB:priced&&Number.isFinite(r.unitPriceTHB)?r.unitPriceTHB:null,
   qty:r.qty,unit:r.unit,owner:r.owner,
   priceType:priced?"WORKING_SELL_NOT_INTERNAL_COST":"NO_CURRENT_VERIFIED_PRICE",
   priceStatus:r.state,
   source:PART_BC_WBS_SOURCE_0553.revision,
   sourceUrl:PART_BC_WBS_SOURCE_0553.url,
   equations:r.equations||[],
   basis:r.driver,
   requirement:spares.has(r.code)?"OEM itemized schedule: MR → equipment SKU → spare/tool item → qty → vendor rate → scope owner; included items must not be priced twice":
    "WBS work package → responsible owner → quantity/effort → approved rate → commercial treatment",
   includedInCurrentBTotal:priced&&(r.owner==="ADDVALUE"||r.code==="B9"),
   optional:r.code.startsWith("C")
  }];
 }));
 if(SCOPE_CODES.some(id=>!lines[id]))throw Error("B/C Scope mapping incomplete");
 const subtotal=Object.values(lines).filter(x=>x.includedInCurrentBTotal).reduce((n,x)=>n+x.amountTHB,0);
 if(Math.abs(subtotal-source.subtotalTHB)>0.01)throw Error("B/C Scope to source WBS subtotal mismatch");
 return {lines,knownAddvalueWorkingSellTHB:subtotal,complete:false,
  state:"PARTIAL_ADDVALUE_WORKING_SELL_ONLY_BC_NOT_FULLY_PRICED",
  sourceUrl:source.sourceUrl};
}
