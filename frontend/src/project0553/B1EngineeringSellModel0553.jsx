import React,{useMemo,useState} from "react";
import {selectBcWorkCostLines0553} from "./data/bcWorkCostLines0553";

// Analysis-only role-rate scenario; never overwrites canonical B1 Working Sell.
const ROLES=["Lead","Senior","Engineer","Drafter","Document Control"];
const GROUPS=[["COMMON","Common Engineering"],["MR1","MR0001 — SCADA / WiMAX"],["MR2","MR0002 — DMR Trunk Radio"],["MR3","MR0003 — Ex Telephone / Sounder"],["MR4","MR0004 — RACON"]];
const cash=x=>Number.isFinite(x)?"THB "+x.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"RATE PENDING";
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
export function B1EngineeringSellModel0553({workingRow}){
 const lines=useMemo(()=>selectBcWorkCostLines0553().rows.filter(x=>x.code==="B1"&&x.id.startsWith("B1-WBS-")),[]);
 const [rates,setRates]=useState(Object.fromEntries(ROLES.map(r=>[r,""])));
 const [expanded,setExpanded]=useState({});
 const mhByRole=Object.fromEntries(ROLES.map(role=>[role,lines.reduce((n,x)=>n+(x.roleMH?.[role]||0),0)]));
 const mh=lines.reduce((n,x)=>n+x.quantity,0);
 const ready=ROLES.every(role=>mhByRole[role]===0||(rates[role].trim()!==""&&Number.isFinite(Number(rates[role]))&&Number(rates[role])>=0));
 const extended=lines.map(line=>({...line,scenarioSell:ready?round(ROLES.reduce((sum,role)=>sum+(line.roleMH?.[role]||0)*Number(rates[role]||0),0)):null}));
 const scenario=ready?round(extended.reduce((sum,x)=>sum+x.scenarioSell,0)):null;
 const sourceOk=lines.length===27&&mh===964;
 const rateMissing=ROLES.filter(role=>mhByRole[role]>0&&rates[role].trim()==="");
 return <section className="p55-panel" data-component-key="bid.budget.working.bc.b1.engineering-rate-model" style={{padding:14,marginTop:12}}>
  <h4>B1 — First Principles Engineering Workload → Role Rate → Working SELL</h4>
  <p className="p55-note">Method: 02 First Principles / GEQ-005; 04 MR requirement mapping; 05 engineering drawings and interfaces; 06 role-hours from Rev05 08_B1_ENGINEERING; 10.2 pricing scenario. 27 source WBS activities are the present workload baseline, NOT independently verified productivity quantities from the upstream modules. Validate those dependencies before customer release.</p>
  <div className="p55-metric-grid">
   <div><strong>Source WBS workload</strong><p>{mh} MH / {lines.length} activities</p><small>{sourceOk?"PASS source integrity":"ERROR — source mismatch"}</small></div>
   <div><strong>Canonical B1 Working SELL</strong><p>{cash(workingRow.workingSellTHB)}</p><small>Rev05 baseline; unchanged</small></div>
   <div><strong>Role-rate derived scenario</strong><p>{cash(scenario)}</p><small>{ready?"Analysis only; not posted":"Fill all applicable role SELL rates"}</small></div>
   <div><strong>Scenario − Baseline</strong><p>{ready?cash(round(scenario-workingRow.workingSellTHB)):"PENDING"}</p><small>Compare, do not auto-post</small></div>
  </div>
  <h4>1 — Set working SELL rate by personnel role (THB/MH)</h4>
  <p className="p55-note">All inputs start blank deliberately. These are prospective commercial SELL rates, not payroll/direct cost and not the earlier THB 510,000 / 964 MH allocation factor. Values are local what-if inputs and are not saved to the price registry.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget">
   <thead><tr><th>Role</th><th>Workload (MH)</th><th>Working SELL rate (THB/MH)</th><th>Role SELL amount THB</th></tr></thead>
   <tbody>{ROLES.map(role=><tr key={role}><td><strong>{role}</strong></td><td>{mhByRole[role]}</td><td><input type="number" min="0" step="0.01" aria-label={role+" sell rate THB per MH"} style={{width:"100%",maxWidth:180}} placeholder="Enter rate" value={rates[role]} onChange={e=>setRates(v=>({...v,[role]:e.target.value}))}/></td><td>{ready?cash(round(mhByRole[role]*Number(rates[role]||0))):"RATE PENDING"}</td></tr>)}
   <tr><td><strong>TOTAL</strong></td><td><strong>{mh}</strong></td><td>{rateMissing.length?rateMissing.join(", ")+" pending":"Role rates entered"}</td><td><strong>{cash(scenario)}</strong></td></tr></tbody>
  </table></div>
  <h4>2 — WBS activities grouped by MR (expand to see each work object)</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget">
   <thead><tr><th>Work package</th><th>Activities</th><th>MH</th><th>Derived SELL (THB)</th><th>Breakdown</th></tr></thead><tbody>
   {GROUPS.map(([key,name])=>{const subset=extended.filter(x=>x.group===key);const subMH=subset.reduce((n,x)=>n+x.quantity,0);const subSell=ready?round(subset.reduce((n,x)=>n+x.scenarioSell,0)):null;return <React.Fragment key={key}>
    <tr><td><strong>{name}</strong></td><td>{subset.length}</td><td>{subMH}</td><td>{cash(subSell)}</td><td><button type="button" className="p553-detail-button" aria-expanded={!!expanded[key]} onClick={()=>setExpanded(v=>({...v,[key]:!v[key]}))}>{expanded[key]?"− Hide":"+ Detail"}</button></td></tr>
    {expanded[key]&&<tr><td colSpan={5}><div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:800,width:"100%"}}><thead><tr><th>WBS activity / physical work</th>{ROLES.map(role=><th key={role}>{role} MH</th>)}<th>Total MH</th><th>Derived SELL THB</th><th>Source & status</th></tr></thead>
    <tbody>{subset.map(x=><tr key={x.id}><td><strong>{x.name}</strong><small>{x.id}</small></td>{ROLES.map(role=><td key={role}>{x.roleMH?.[role]||"—"}</td>)}<td>{x.quantity}</td><td>{cash(x.scenarioSell)}</td><td><small>{x.sourceRef}</small><small>Rev05 role MH, engineering validation pending</small></td></tr>)}</tbody></table></div></td></tr>}</React.Fragment>})}
   <tr><td><strong>TOTAL B1 — ROLE RATE MODEL</strong></td><td>{lines.length}</td><td>{mh}</td><td><strong>{cash(scenario)}</strong></td><td>{sourceOk?"SOURCE PASS":"CHECK"}</td></tr>
   </tbody></table></div>
  <p className="p55-note">Commercial control: derived scenario must be reviewed and explicitly promoted through a separate approved rate/version workflow before replacing the THB 510,000 canonical Working SELL. No automatic posting to Part B subtotal, Direct Cost or customer quotation; B2 document control and B3 FAT/SAT activities must not be counted twice.</p>
 </section>;
}
