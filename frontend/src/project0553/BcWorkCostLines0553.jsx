import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectBcWorkCostLines0553} from "./data/bcWorkCostLines0553";
import {B1B2EquationAudit0553} from "./B1B2EquationAudit0553";
import {B3EquationAudit0553} from "./B3EquationAudit0553";
import {B5EquationAudit0553} from "./B5EquationAudit0553";
import {selectB9ChinaWorkingBudget0553} from "./data/b9ChinaWorkingBudget0553";
import {selectB3WorkingSellAfterChinaFat0553} from "./data/b3ChinaFatOwnership0553";

const money=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const qty=n=>Number.isFinite(n)?n.toLocaleString("en-US"):"TO VERIFY";

export function BcWorkCostLines0553({selectedCode="ALL"}){
 const m=selectBcWorkCostLines0553();
 const [showAuditClauses,setShowAuditClauses]=useState(false);
 const showGroup=selectedCode==="ALL"?m.activeCodes:[selectedCode];
 const available=m.rows.filter(x=>showGroup.includes(x.code));
 const china=selectB9ChinaWorkingBudget0553();
 // Rev05 B3 Bangkok FAT is superseded by Rev.K MGW China FAT (B9).
 // Original B9 mixed labor/per-diem line is replaced by itemized Rev.K B9 ledger.
 const physical=[
  ...available.filter(x=>!x.id.startsWith("COST-AUD-")&&x.id!=="B3-FAT-BKK"&&x.code!=="B9"),
  ...(showGroup.includes("B9")?china.rows.filter(x=>!x.optional).map(x=>({
   code:"B9",id:x.id,moduleId:x.moduleId,name:x.description,quantity:x.qty,unit:x.unit,
   workingSellRateTHB:x.unitRateTHB,workingSellTHB:x.workingSellTHB,historicalCostProxyTHB:null,
   owner:"B9",sourceRef:x.evidence,scopeGate:x.status,
   equation:x.qty+" "+x.unit+" × THB "+x.unitRateTHB.toLocaleString("en-US")+" / "+x.unit,
   requiredQuantityStatus:"REV_K_BUDGET_ASSUMPTION",reconciliationTag:"REV_K_B9_OWNER_SINGLE_POSTING",
   includedInExistingCostOwner:null
  })):[])
 ];
 const clauses=available.filter(x=>x.id.startsWith("COST-AUD-"));
 const historicalProxy=physical.reduce((sum,x)=>sum+(x.historicalCostProxyTHB??0),0);
 const currentSourceSell={...m.workingSellByCode,
  B3:selectB3WorkingSellAfterChinaFat0553(m.workingSellByCode.B3),
  B9:china.workingSellTHB};
 const displayedWbsSell=showGroup.reduce((sum,code)=>sum+(currentSourceSell[code]??0),0);
 const completeSell=showGroup.every(code=>Number.isFinite(currentSourceSell[code]));
 const knownSellCount=showGroup.filter(code=>Number.isFinite(currentSourceSell[code])).length;
 return <details className="p55-panel" data-component-key={m.moduleId} open={selectedCode!=="ALL"} style={{marginTop:12,padding:"12px 14px"}}>
  <summary><strong>10.2 — First Principles / Resource &amp; Cost-Line Ledger</strong> · {physical.length} work objects · {clauses.length} audited clauses</summary>
  <p className="p55-note"><ComponentCopyId projectId="PJ2608-0553" componentKey={m.moduleId}/> · Cost Owner: 10.2 only · Source: <a href={m.sourceUrl} target="_blank" rel="noreferrer">{m.sourceRevision}</a></p>
  <p className="p55-note"><strong>Selected:</strong> {selectedCode==="ALL"?"B1/B2/B3/B5/B6/B9/B10/B11 (current derivation priority)":selectedCode}
   {" "}· Current Working SELL subtotal (legacy Rev05 superseded for China FAT): {knownSellCount>0?money(displayedWbsSell):"NOT ESTABLISHED"} ({knownSellCount}/{showGroup.length} priced; {completeSell?"covered":"NOT complete price"})
   {" "}· Actual Direct COST: <strong>NOT ESTABLISHED</strong>
   {" "}· Historical B1 proxy (not approved cost): {historicalProxy?money(historicalProxy):"n/a"}</p>
  <p className="p55-note">Rev.K B9 Base covers two ADDVALUE China MGW FAT witnesses and one BKK–China–BKK trip. Optional Yard call-out is ONE Senior Telecom Systems Integration Engineer for 7 working days plus 2 paid travel days, hotel and cover on a SEPARATE trip, offered as 1 LS and EXCLUDED from Base. Rev05 two-person 12 Yard team-days are historical only; each actual trip must be recorded once. Historical Bangkok FAT THB 144,000 removed from B3. No Direct Cost approval implied.</p>
  {(selectedCode==="ALL"||selectedCode==="B1"||selectedCode==="B2")&&<B1B2EquationAudit0553 selectedCode={selectedCode}/>}
  {(selectedCode==="ALL"||selectedCode==="B3")&&<B3EquationAudit0553 selectedCode={selectedCode}/>}
  {(selectedCode==="ALL"||selectedCode==="B5")&&<B5EquationAudit0553 selectedCode={selectedCode}/>}
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Module ID / CBS</th><th>Work Object / Resource</th><th>Qty / Unit</th><th>Working SELL Rate THB</th><th>Working SELL Total THB</th><th>Current Direct COST THB</th><th>Equation / Owner / Source / Gate</th></tr></thead>
   <tbody>{physical.map(x=><tr key={x.id} data-component-key={x.moduleId}>
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
