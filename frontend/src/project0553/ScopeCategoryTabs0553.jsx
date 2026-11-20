import React from "react";

// Shared presentation-only tab names: 10.2 cost ownership and 10.5 customer
// scope must keep distinct Module IDs. No numerical calculations here.
export const SCOPE_CATEGORY_TABS_0553=Object.freeze([
 ["Scope of supply","ALL"],["B10 CommSpares","B10"],
 ["B11 SpecialTool","B11"],["B12 FirstFilling","B12"],
 ["B13 Consumerables","B13"],["B14 BondsInsurance","B14"],
 ["C1 CapitalSpares","C1"],["C2 2Y-Spares","C2"]
]);
export function ScopeCategoryTabs0553({value="ALL",onChange}){
 return <div className="p55-filterbar" role="group" aria-label="B/C category tabs">
  {SCOPE_CATEGORY_TABS_0553.map(([name,code])=><button key={code}
   type="button" className={value===code?"is-active":""}
   aria-pressed={value===code} onClick={()=>onChange(code)}>{name}</button>)}
 </div>;
}
