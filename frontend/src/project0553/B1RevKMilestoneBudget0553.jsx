import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectB1RevKMilestoneCoverage0553} from "./data/b1RevKMilestoneCoverage0553";

const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const money=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const checkNonnegative=value=>value!==""&&value!==null&&value!==undefined&&Number.isFinite(Number(value))&&Number(value)>=0?Number(value):null;

export function B1RevKMilestoneBudget0553(){
 const model=selectB1RevKMilestoneCoverage0553();
 const owners=model.rows.filter(r=>r.chargeableHere);
 const [rate,setRate]=useState(String(model.rate.usdPerPersonDay));
 const [hours,setHours]=useState(()=>Object.fromEntries(owners.map(r=>[r.stage,String(r.planningPmHours)])));
 const [showExclusions,setShowExclusions]=useState(false);
 const validRate=checkNonnegative(rate);
 const fx=model.rate.fxTHBPerUSD;
 const pmHourRate=validRate===null?null:validRate*fx/8;
 const planned=owners.map(r=>({...r,enteredHours:checkNonnegative(hours[r.stage])}));
 const hoursComplete=planned.every(r=>r.enteredHours!==null);
 const sumHours=hoursComplete?round(planned.reduce((n,r)=>n+r.enteredHours,0)):null;
 const totalBudgetarySell=sumHours!==null&&pmHourRate!==null?round(sumHours*pmHourRate):null;
 const moneyPerDay=validRate!==null?round(validRate*fx):null;
 const amountFor=stage=>{
  const r=planned.find(x=>x.stage===stage);
  return r&&r.enteredHours!==null&&pmHourRate!==null?round(r.enteredHours*pmHourRate):null;
 };
 const reset=()=>setHours(Object.fromEntries(owners.map(r=>[r.stage,String(r.planningPmHours)])));
 return <section className="p55-panel" data-component-key="bid.budget.working.bc.b1.revk-pm-milestones" style={{padding:14,marginTop:12}}>
  <div className="p55-eyebrow">B1 ONLY / REV.K / CFO ACTIVITY-BASED BUDGET <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.working.bc.b1.revk-pm-milestones"/></div>
  <h3>B1 — Project Management by Rev.K Milestone (K00–K18)</h3>
  <p className="p55-note"><strong>เฉพาะ B1:</strong> ตารางนี้ลงราคาเพียงค่า ADDVALUE Office PM / Project Management ที่ยังไม่มี Cost Owner ในหมวดอื่น ส่วน FAT staff, travel, Yard specialists, SAT, VDRL, freight และ OEM equipment อยู่ใน A/B2–B14 ที่มีอยู่แล้ว จึงไม่แสดงราคาหรือบวกซ้ำในตาราง K นี้</p>
  <div className="p55-metric-grid">
   <div><strong>Rev.K coverage + Module IDs</strong><p>{model.coverageTotal}/19</p><small>ทุก K มี ID เปิดอ้างอิงได้</small></div>
   <div><strong>Unique B1 PM Expense Events</strong><p>{model.uniquePmBudgetEvents}</p><small>K03–K07 และ K08–K11 รวมการประสานงาน ไม่ตั้งค่า PM ซ้ำ</small></div>
   <div><strong>CFO planned Office PM effort</strong><p>{sumHours===null?"INCOMPLETE":sumHours+" MH"}</p><small>Proxy estimate {model.initialEstimatedPmHours} MH / 8 MH ต่อคน-วัน</small></div>
   <div><strong>B1 Budgetary PM SELL (partial B1 only)</strong><p>{money(totalBudgetarySell)}</p><small>USD {rate||"pending"} per person-day × FX {fx}; NON-POSTING</small></div>
  </div>
  <p className="p55-note"><strong>หลักฐานและสมมติฐาน:</strong> Rev.K ระบุ 19 ขั้นและ Acceptance Gates แต่ไม่ได้ระบุ PM-hours ของผู้บริหาร จึงตั้ง <strong>CFO planning proxy 56 MH / 12 การประสานงานที่ไม่ซ้ำ</strong> (2–8 MH ต่อเหตุการณ์) และเปิดให้ปรับได้ ค่า USD 600/คน/วันเป็นอัตราสมมติฐานจากการหารือ ไม่ใช่ Actual Direct Cost หรือ Rate ที่ลงนามแล้ว ผลรวมนี้เป็น Budgetary SELL บางส่วนของ B1 เท่านั้น และ <strong>ไม่เพิ่มเข้ากับ B1 THB 510,000 เดิม</strong></p>
  <div className="p55-filterbar" style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:12}}>
   <label>Onshore Office PM — budgetary SELL (USD/person-day) <input type="number" min="0" step="1" value={rate} onChange={e=>setRate(e.target.value)} style={{marginLeft:8,maxWidth:130}}/></label>
   <strong>{money(moneyPerDay)} / day</strong>
   <button type="button" className="p553-detail-button" onClick={reset}>Restore CFO 56-MH scenario</button>
   <button type="button" className="p553-detail-button" onClick={()=>setHours({})}>Clear PM assumptions</button>
  </div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{width:"100%",minWidth:1490,tableLayout:"fixed",fontSize:12}}>
   <colgroup><col style={{width:"11%"}}/><col style={{width:"13%"}}/><col style={{width:"12%"}}/><col style={{width:"13%"}}/><col style={{width:"25%"}}/><col style={{width:"9%"}}/><col style={{width:"10%"}}/><col style={{width:"7%"}}/></colgroup>
   <thead><tr>
    <th>MODULE ID / REV.K</th><th>MILESTONE</th><th>WHO</th><th>WHERE</th><th>B1 ONLY — WHAT / HOW</th><th>PM HOURS</th><th>B1 PM SELL (THB)</th><th>STATUS</th>
   </tr></thead>
   <tbody>{model.rows.map(row=>{
    const leader=row.chargeableHere;
    const h=leader?checkNonnegative(hours[row.stage]):null;
    const value=leader?amountFor(row.stage):null;
    return <tr key={row.moduleId} data-component-key={row.moduleId} style={{verticalAlign:"top",overflowWrap:"anywhere",whiteSpace:"normal"}}>
     <td><strong>{row.stage}</strong><small style={{overflowWrap:"anywhere"}}>{row.moduleId}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={row.moduleId}/></td>
     <td><strong>{row.phase}</strong><small>{row.source}</small></td>
     <td>{row.who}</td>
     <td>{row.where}</td>
     <td><strong>{row.how}</strong><small>Evidence / Deliverable: {row.deliverable}</small><small>{leader?row.budgetHoursBasis:"Already included in "+row.chargeOwnerStage+" shared PM management event"}</small></td>
     <td>{leader?<input type="number" min="0" step="0.5" aria-label={row.stage+" B1 PM hours"} value={hours[row.stage]??""} onChange={e=>setHours(old=>({...old,[row.stage]:e.target.value}))} placeholder="TBC" style={{maxWidth:90,width:"100%"}}/>:<strong>Included in {row.chargeOwnerStage}</strong>}<small>{leader?(h!==null?round(h/8)+" MD (estimate)":"MH input required"):"No additional MH"}</small></td>
     <td><strong>{leader?money(value):"Included — Not additive"}</strong><small>{leader?"B1 budgetary PM ONLY":"B1 event "+row.chargeEventKey+" already counted"}</small></td>
     <td><strong>{leader?"PROXY":"SHARED"}</strong><small>NOT POSTED</small></td>
    </tr>;
   })}</tbody>
  </table></div>
  <p className="p55-note"><strong>Cash-control check:</strong> {model.uniquePmBudgetEvents} unique B1 management events, {model.coverageTotal} Rev.K references; no physical execution or other B-item value is added to the B1 PM subtotal. Estimated B1 Office PM SELL {money(totalBudgetarySell)} is <strong>not complete B1 Working Cost</strong> and has no authorization to replace the current Canonical B1 Working Sell.</p>
  <button type="button" className="p553-detail-button" aria-expanded={showExclusions} onClick={()=>setShowExclusions(v=>!v)}>{showExclusions?"− Hide":"+ Review"} Other Cost Owners (reference only — NO AMOUNT)</button>
  {showExclusions&&<div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Rev.K reference</th><th>Separate Cost Owner — not posted in B1</th><th>Single-owner key</th></tr></thead><tbody>
   {model.rows.map(row=><tr key={row.stage}><td>{row.stage}</td><td>{row.directOwner}</td><td>{row.chargeEventKey}</td></tr>)}
  </tbody></table></div>}
 </section>;
}
