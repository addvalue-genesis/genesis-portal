import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectBcWorkCostLines0553} from "./data/bcWorkCostLines0553";
import {B1B2EquationAudit0553} from "./B1B2EquationAudit0553";
import {B3EquationAudit0553} from "./B3EquationAudit0553";
import {B5EquationAudit0553} from "./B5EquationAudit0553";
import {selectB9ChinaWorkingBudget0553} from "./data/b9ChinaWorkingBudget0553";
import {selectB1ProjectSupportBudget0553} from "./data/b1ProjectSupportBudget0553";
import {selectB3FortyDayWorkingSell0553} from "./data/b3FortyDayWorkingSell0553";
import {selectB3WorkingSellAfterChinaFat0553} from "./data/b3ChinaFatOwnership0553";

const money=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const qty=n=>Number.isFinite(n)?n.toLocaleString("en-US"):"TO VERIFY";

export function BcWorkCostLines0553({selectedCode="ALL",presentationNamespace=null}){
 const m=selectBcWorkCostLines0553();
 const [showAuditClauses,setShowAuditClauses]=useState(false);
 const showGroup=selectedCode==="ALL"?m.activeCodes:[selectedCode];
 const available=m.rows.filter(x=>showGroup.includes(x.code));
 const china=selectB9ChinaWorkingBudget0553();
 const b1Current=selectB1ProjectSupportBudget0553();
 const b3Current=selectB3FortyDayWorkingSell0553();
 // Rev05 Bangkok FAT is superseded by MGW FAT, but witness/travel ALWAYS cost owner B3 per contract. B9 is only optional Yard specialist.
 const physical=[
  ...available.filter(x=>!x.id.startsWith("COST-AUD-")&&x.code!=="B1"&&x.code!=="B3"&&x.code!=="B9"),
  ...(showGroup.includes("B1")?b1Current.lines.map(x=>({
   code:"B1",id:x.id,moduleId:"bid.budget.working.bc.b1.current-"+x.id.toLowerCase(),
   name:x.activity,quantity:x.qty,unit:x.unit,
   workingSellRateTHB:Math.round(x.workingSellTHB/x.qty*100)/100,
   workingSellTHB:x.workingSellTHB,historicalCostProxyTHB:null,
   owner:"B1",sourceRef:x.verification,
   scopeGate:x.conditional?"CONDITIONAL_B1_LAWFUL_SCOPE_ONLY_EXCLUDED_FROM_BASE":"NEW_B1_RESOURCE_BASE_UNVERIFIED_PAYROLL",
   equation:x.unitCostTHB===null?"Owner-selected provisional SELL allowance; COST NOT ESTABLISHED":x.role==="EXTERNAL_OR_ALLOWANCE"?
    x.qty+" × THB "+x.unitCostTHB.toFixed(2)+" cost × "+(x.sellFactor??b1Current.expenseHandlingSellFactor)+" sell handling":
    x.qty+" MH × loaded role cost THB "+x.unitCostTHB.toFixed(2)+" (planning) / 0.80 sell factor",
   requiredQuantityStatus:x.conditional?"OPTIONAL_NOT_IN_CANONICAL_B1_BASE":"ROLE/EXPENSE_PLANNING_QTY",
   reconciliationTag:x.conditional?"B1_CONDITIONAL_NO_POST":"B1_1_TO_B1_8_CURRENT_RESOURCE",
   includedInExistingCostOwner:x.conditional?"EXCLUDED_FROM_BASE":null
  })):[]),
  ...(showGroup.includes("B3")?[...b3Current.rows.map(x=>({
   code:"B3",id:"B3-"+x.id,moduleId:"bid.budget.working.bc.b3.current-"+x.id.toLowerCase(),name:x.site+" — "+x.reason,
   quantity:x.days,unit:"2-person team workdays",workingSellRateTHB:50400,workingSellTHB:x.workingSellTHB,
   historicalCostProxyTHB:null,owner:"B3",sourceRef:"Rev.K "+x.wbs+" "+x.mr+"; management 40-day choice",
   scopeGate:"WORKING_SELL_40_DAY_2_CREW__SCHEDULE_PENDING",equation:x.days+" team days × 2 × USD800 × 31.5",
   requiredQuantityStatus:"MANAGEMENT_SELECTED_40_DAY_WORK_WINDOW",reconciliationTag:"B3-REV_K-40DAY",includedInExistingCostOwner:null
  })),{
   code:"B3",id:"B3-VEEX-MX100",moduleId:"bid.budget.working.bc.b3.veex-mx100",name:"VeEX MX100+ temporary SAT instrument rental",
   quantity:30,unit:"rental-day",workingSellRateTHB:1000,workingSellTHB:30000,historicalCostProxyTHB:null,
   owner:"B3",sourceRef:b3Current.veex.rateSource,scopeGate:"30_DAYS_EX_VAT_PASS_THROUGH__OTHER_RF_INSTRUMENTS_PENDING",
   equation:"30 rental-days × THB1000 (no markup planning basis)",requiredQuantityStatus:"CURRENT_RENTAL_SCENARIO",
   reconciliationTag:"B3-REV_K-TOOLS",includedInExistingCostOwner:null
  }]:[]),
  ...(showGroup.includes("B3")?china.rows.filter(x=>!x.optional).map(x=>({
   code:"B3",id:x.id,moduleId:x.moduleId,name:x.description,quantity:x.qty,unit:x.unit,
   workingSellRateTHB:x.unitRateTHB,workingSellTHB:x.workingSellTHB,historicalCostProxyTHB:null,
   owner:"B3",sourceRef:x.evidence,scopeGate:x.status,
   equation:x.qty+" "+x.unit+" × THB "+x.unitRateTHB.toLocaleString("en-US")+" / "+x.unit,
   requiredQuantityStatus:"MGW_FAT_WITNESS_IN_B3",reconciliationTag:"B3_MGW_FAT_SINGLE_OWNER",
   includedInExistingCostOwner:null
  })):[]),
  ...(showGroup.includes("B9")?china.rows.filter(x=>x.optional).map(x=>({
   code:"B9",id:x.id,moduleId:x.moduleId,name:x.description+" (OPTIONAL)",quantity:x.qty,unit:x.unit,
   workingSellRateTHB:x.unitRateTHB,workingSellTHB:x.workingSellTHB,historicalCostProxyTHB:null,
   owner:"B9",sourceRef:x.evidence,scopeGate:x.status,
   equation:x.qty+" "+x.unit+" × THB "+x.unitRateTHB.toLocaleString("en-US")+" / "+x.unit,
   requiredQuantityStatus:"CONDITIONAL_YARD_LS_NOT_IN_BASE",reconciliationTag:"B9_OPTIONAL_YARD_ONLY",
   includedInExistingCostOwner:"OPTIONAL_THB233600_EXCLUDED_FROM_BASE"
  })):[])
 ];
 const clauses=available.filter(x=>x.id.startsWith("COST-AUD-"));
 const historicalProxy=physical.reduce((sum,x)=>sum+(x.historicalCostProxyTHB??0),0);
 const currentSourceSell={...m.workingSellByCode,
  B1:b1Current.baseWorkingSellTHB,
  B3:b3Current.workingSellTHB+china.fatWorkingSellTHB,
  B9:china.b9BaseWorkingSellTHB};
 const displayedWbsSell=showGroup.reduce((sum,code)=>sum+(currentSourceSell[code]??0),0);
 const completeSell=showGroup.every(code=>Number.isFinite(currentSourceSell[code]));
 const knownSellCount=showGroup.filter(code=>Number.isFinite(currentSourceSell[code])).length;
 return <details className="p55-panel" data-component-key={presentationNamespace?presentationNamespace+".cost-lines-view":m.moduleId} open={selectedCode!=="ALL"} style={{marginTop:12,padding:"12px 14px"}}>
  <summary><strong>10.2 — First Principles / Resource &amp; Cost-Line Ledger</strong> · {physical.length} work objects · {clauses.length} audited clauses</summary>
  <p className="p55-note"><ComponentCopyId projectId="PJ2608-0553" componentKey={m.moduleId}/> · Cost Owner: 10.2 only · Source: <a href={m.sourceUrl} target="_blank" rel="noreferrer">{m.sourceRevision}</a></p>
  <p className="p55-note"><strong>Selected:</strong> {selectedCode==="ALL"?"B1/B2/B3/B5/B6/B9/B10/B11 (current derivation priority)":selectedCode}
   {" "}· Current Working SELL subtotal (legacy Rev05 superseded for China FAT): {knownSellCount>0?money(displayedWbsSell):"NOT ESTABLISHED"} ({knownSellCount}/{showGroup.length} priced; {completeSell?"covered":"NOT complete price"})
   {" "}· Actual Direct COST: <strong>NOT ESTABLISHED</strong>
   {" "}· Legacy Engineering pricing excluded from current B1</p>
  <p className="p55-note">Contract B3 Inspection/Testing includes MGW FAT Witness & associated travel under B3, plus offshore SAT/SIT and VeEX hire. B9 holds only optional Yard specialist support, not MGW FAT. Legacy Bangkok FAT THB144,000 replaced in B3, not additive. Direct COST is unverified.</p>
  {selectedCode==="B2"&&<B1B2EquationAudit0553 selectedCode={selectedCode}/>}
  {(selectedCode==="ALL"||selectedCode==="B3")&&<B3EquationAudit0553 selectedCode={selectedCode}/>}
  {(selectedCode==="ALL"||selectedCode==="B5")&&<B5EquationAudit0553 selectedCode={selectedCode}/>}
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Module ID / CBS</th><th>Work Object / Resource</th><th>Qty / Unit</th><th>Working SELL Rate THB</th><th>Working SELL Total THB</th><th>Current Direct COST THB</th><th>Equation / Owner / Source / Gate</th></tr></thead>
   <tbody>{physical.map(x=><tr key={x.id} data-component-key={presentationNamespace?presentationNamespace+".cost-line-preview."+x.id.toLowerCase():x.moduleId}>
    <td><strong>{x.code} · {x.id}</strong><small>{x.moduleId}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={x.moduleId}/></td>
    <td><strong>{x.name}</strong><small>{x.reconciliationTag}</small>{x.roleMH&&<small>Role MH: {Object.entries(x.roleMH).map(([role,hours])=>role+" "+hours).join(" · ")}</small>}</td>
    <td>{qty(x.quantity)} {x.unit}<small>{x.requiredQuantityStatus}</small></td>
    <td>{money(x.workingSellRateTHB)}</td>
    <td>{money(x.workingSellTHB)}
      {x.historicalCostProxyTHB!==null&&<small>Historical cost proxy ONLY: {money(x.historicalCostProxyTHB)}</small>}</td>
    <td><strong>NOT ESTABLISHED</strong><small>No approved internal cost rate / cost posting</small></td>
    <td><strong>{x.equation}</strong>
     <small>OWNER: {x.owner}</small><small>SOURCE: {x.sourceRef}</small>
     <small>GATE: {x.scopeGate}</small>
     {x.includedInExistingCostOwner&&<small>NON-ADDITIVE / INCLUDED: {x.includedInExistingCostOwner}</small>}
    </td>
   </tr>)}</tbody>
  </table></div>
  <button type="button" className="p55-row-toggle" onClick={()=>setShowAuditClauses(v=>!v)} aria-expanded={showAuditClauses}>
   {showAuditClauses?"−":"＋"} Source Clauses → Cost Line Mapping ({clauses.length}; not separate priced items)
  </button>
  {showAuditClauses&&<div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Source Requirement ID</th><th>Cost Driver / Owner</th><th>Trace / Cost Gate</th></tr></thead>
   <tbody>{clauses.map(x=><tr key={x.id}><td>{x.id}<small>{x.code}</small></td>
    <td><strong>{x.name}</strong><small>{x.owner}</small></td>
    <td>{x.equation}<small>{x.sourceRef}</small><small>{x.scopeGate}</small>
     <small>NON ADDITIVE; unit rate and quantity remain unverified</small></td>
   </tr>)}</tbody>
  </table></div>}
  <p className="p55-note"><strong>Completeness:</strong> {m.requiredAuditCount} controlled requirement links / {m.rows.length} traceable working objects. Actual Internal Direct Cost, third-party freight/permit bills and OEM SKU selection remain unposted; this workbench cannot release Customer A+B+C cost.</p>
 </details>;
}
