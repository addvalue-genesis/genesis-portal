import React,{useState} from "react";
import {selectB1RevKMilestoneCoverage0553} from "./data/b1RevKMilestoneCoverage0553";
const money=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"RATE / QTY PENDING";
export function B1RevKMilestoneBudget0553(){
 const model=selectB1RevKMilestoneCoverage0553();
 const [rate,setRate]=useState(String(model.rate.usdPerPersonDay));
 const [days,setDays]=useState({});
 const [showMethod,setShowMethod]=useState(false);
 const parsedRate=rate.trim()!==""&&Number.isFinite(Number(rate))&&Number(rate)>=0?Number(rate):null;
 const validDays=Object.fromEntries(model.rows.map(r=>[r.stage,
  days[r.stage]!==undefined&&days[r.stage]!==""&&Number.isFinite(Number(days[r.stage]))&&Number(days[r.stage])>=0?Number(days[r.stage]):null]));
 const completed=model.rows.filter(r=>validDays[r.stage]!==null);
 const sumDays=completed.reduce((a,r)=>a+validDays[r.stage],0);
 const subtotal=parsedRate===null||!completed.length?null:Math.round(sumDays*parsedRate*model.rate.fxTHBPerUSD*100)/100;
 const complete=completed.length===model.rows.length;
 const onChangeDay=(stage,next)=>setDays(old=>({...old,[stage]:next}));
 return <section className="p55-panel" data-component-key="bid.budget.working.bc.b1.revk-pm-milestones" style={{padding:14,marginTop:12}}>
  <h3>B1 — Rev.K Milestone Indirect PM Budget (K00–K18)</h3>
  <p className="p55-note"><strong>Cost Owner rule:</strong> only ADDVALUE office PM, executive/client coordination and unrelated project-overhead time are eligible for B1. Physical execution, witness travel, test crew, instruments, OEM supply and document-control labour are NEVER re-charged to B1. This table allocates the already-registered PM-MILESTONE expense object by phase; it creates no second posting.</p>
  <div className="p55-metric-grid">
   <div><strong>Rev.K Milestones Mapped</strong><p>{model.coverageTotal} / 19</p><small>Every stage K00–K18 has an office-PM scope and original direct-owner exclusion</small></div>
   <div><strong>Onshore PM Rate Scenario</strong><p>{parsedRate===null?"ENTER RATE":money(parsedRate*model.rate.fxTHBPerUSD)}</p><small>USD {rate||"pending"} per person-day × FX 31.50 (NOT approved)</small></div>
   <div><strong>PM-days with Quantity Entered</strong><p>{completed.length} / 19</p><small>{sumDays.toLocaleString("en-US")} scenario PM-days entered; blanks are unknown, not zero</small></div>
   <div><strong>{complete?"Full Onshore PM Scenario":"Partial Onshore PM Scenario"}</strong><p>{money(subtotal)}</p><small>Not direct cost; not added to current B1 THB 510,000 or Part B</small></div>
  </div>
  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:10}}>
   <label>Onshore PM SELL scenario USD/person-day <input type="number" min="0" step="1" value={rate} onChange={e=>setRate(e.target.value)} style={{maxWidth:140,marginLeft:8}}/></label>
   <button type="button" className="p553-detail-button" onClick={()=>setDays(Object.fromEntries(model.rows.map(r=>[r.stage,"1"])))}>Simulate 1 PM-day per milestone</button>
   <button type="button" className="p553-detail-button" onClick={()=>setDays({})}>Clear scenario days</button>
  </div>
  <p className="p55-note"><strong>Rate provenance:</strong> USD 600 is a requested candidate, not a rate recovered as approved. The Rev05 China B9 working team basis is USD 1,250/day + USD 270/day per diem for two persons (THB 47,880/team-day) and is separate. Offshore SAT USD 800/person-day stays in B3. Neither rate is automatically imported into B1.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{width:"100%",minWidth:1420,tableLayout:"fixed",fontSize:12}}>
   <colgroup><col style={{width:"8%"}}/><col style={{width:"11%"}}/><col style={{width:"12%"}}/><col style={{width:"13%"}}/><col style={{width:"22%"}}/><col style={{width:"12%"}}/><col style={{width:"10%"}}/><col style={{width:"12%"}}/></colgroup>
   <thead><tr><th>Rev.K</th><th>Milestone / Work</th><th>WHO</th><th>WHERE</th><th>WHAT / HOW — B1 residual PM only</th><th>Direct Cost Owner (excluded)</th><th>PM-days (scenario)</th><th>B1 PM SELL scenario THB</th></tr></thead>
   <tbody>{model.rows.map(r=>{
    const d=validDays[r.stage];
    const amt=d!==null&&parsedRate!==null?Math.round(d*parsedRate*model.rate.fxTHBPerUSD*100)/100:null;
    return <tr key={r.stage} style={{verticalAlign:"top",overflowWrap:"anywhere",whiteSpace:"normal"}}>
     <td><strong>{r.stage}</strong><small>{r.id}</small></td>
     <td>{r.phase}</td>
     <td>{r.who}<small>{r.executionState}</small></td>
     <td>{r.where}</td>
     <td>{r.how}<small>Deliverable: {r.deliverable}</small><small>Event: {r.expenseEventKey}</small></td>
     <td>{r.directOwner}</td>
     <td><input type="number" min="0" step="0.5" aria-label={r.stage+" PM scenario days"} value={days[r.stage]??""} onChange={e=>onChangeDay(r.stage,e.target.value)} placeholder="TBC" style={{width:"100%",maxWidth:100}}/></td>
     <td><strong>{money(amt)}</strong><small>NON-POSTING</small></td>
    </tr>;
   })}</tbody>
  </table></div>
  <button type="button" className="p553-detail-button" aria-expanded={showMethod} onClick={()=>setShowMethod(v=>!v)}>{showMethod?"− Hide":"+ View"} CFO Calculation / Anti-duplication Rules</button>
  {showMethod&&<div className="p55-note">
   <p><strong>Calculation:</strong> Scenario SELL for a milestone = proposed ADDVALUE PM onshore person-days × selected USD/person-day × FX 31.5. Onshore PM is assumed remote/office; it is not full-time on-site participation. No PM duration is supplied by Rev.K itself.</p>
   <p><strong>Non-additive:</strong> K01 MGW FAT staff/travel = B9; K02–K12 China Yard field crew = B9; K14–K18 SAT/SIT/travel/tools = B3; VDRL/documents = B2; transport/brokerage = B6; OEM equipment = A. Only separately time-logged PM activity can later become B1. Office-management work related to several stages must be allocated by a single time/event ID rather than billed multiple times.</p>
   <p><strong>Commercial gate:</strong> B1 current THB 510,000 engineering baseline cannot be assumed to fund these items. Do not add this nonposting scenario to it or overwrite it; first reconcile engineering 964-MH baseline and authorize replacement B1 budget with supported PM quantity/rate, expense IDs and actual cost rate.</p>
  </div>}
 </section>;
}
