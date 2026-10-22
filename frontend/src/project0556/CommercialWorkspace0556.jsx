import React,{useEffect,useMemo,useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {getProject0556Dataset} from "./data/repository";
import {BUDGET_MODULES_0556} from "./moduleRegistry";

const p=getProject0556Dataset();
const EMPTY="NOT ESTABLISHED";
const investment=[
 {id:"CAP-01",work:"APP radio / dual-pol antenna / mounting equipment",owner:"APP",qty:null,cost:null},
 {id:"CAP-02",work:"AMA radio / ASD dual-pol antennas / mounting",owner:"AMA",qty:null,cost:null},
 {id:"CAP-03",work:"Ethernet / SFP / power / UPS / grounding / cables",owner:"BOTH",qty:null,cost:null},
 {id:"CAP-04",work:"Engineering & FAT / SAT / acceptance tools",owner:"BOTH",qty:null,cost:null}
];
const activities=[
 ["B1","Detailed engineering / RF profile / interference / design evidence","DESIGN",null],
 ["B2","Frequency coordination, import and apparatus licenses","REGULATORY",null],
 ["B3","Installation, FAT, SAT, commissioning and handover","IMPLEMENTATION",null],
 ["B4","Equipment ownership, warranty and lifecycle spares","ASSET",null],
 ["B5","24x7 NOC, monitoring and alarms / monthly service","OPEX_60M",60],
 ["B6","Annual PM, corrective maintenance and offshore response","OPEX_60M",60],
 ["B7","Monthly SLA reporting, risk reserve and service credits","OPEX_60M",60],
 ["B8","End-of-term removal, offshore demob and restoration","DECOM",null]
].map(([code,description,type,months])=>({code,description,type,months,verifiedCost:null,selectedWorkingSell:null}));
const mapping=[
 ["Supply / capital","10.1","CAPEX / asset ownership remains unpriced"],
 ["Engineering, license, commissioning","10.2 / B1–B4","One-time scope and service setup"],
 ["Monitoring, SLA, PM and field support","10.2 / B5–B7","60-month service obligation"],
 ["Decommissioning and removal","10.2 / B8","Terminal lifecycle obligation"]
];
const Cell=({children})=><td>{children===null||children===undefined?EMPTY:children}</td>;
const Block=({label,children,code,open=false})=><details className="p556-budget-phase" data-component-key={code} open={open}>
 <summary><strong>{label}</strong><small>{code}</small></summary>
 <div className="p55-stack" style={{padding:"12px 14px"}}>{children}</div>
</details>;
const Copy=({code})=><ComponentCopyId projectId="PJ2610-0556" componentKey={code}/>;
const Table=({columns,rows})=><div className="p55-table-wrap"><table className="p55-table p55-table--compact">
 <thead><tr>{columns.map((name,i)=><th key={i}>{name}</th>)}</tr></thead>
 <tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><Cell key={j}>{cell}</Cell>)}</tr>)}</tbody>
 </table></div>;
export function CommercialWorkspace0556({navigationTarget=null,navigationSequence=0}){
 const [pricingStage,setPricingStage]=useState("working");
 const [recipient,setRecipient]=useState("INTERNAL");
 const [costFilter,setCostFilter]=useState("ALL");
 const [feedback,setFeedback]=useState(null);
 const activeRows=useMemo(()=>costFilter==="ALL"?activities:activities.filter(x=>x.code===costFilter),[costFilter]);
 useEffect(()=>{
  if(!navigationTarget||!navigationTarget.startsWith("bid.budget."))return;
  const el=Array.from(document.querySelectorAll("[data-component-key]")).find(e=>e.getAttribute("data-component-key")===navigationTarget);
  if(!el){setFeedback("Cannot locate module: "+navigationTarget);return;}
  let n=el;
  while(n){if(n.tagName==="DETAILS")n.open=true;n=n.parentElement;}
  el.scrollIntoView({behavior:"smooth",block:"start"});
  setFeedback(null);
 },[navigationTarget,navigationSequence,costFilter]);
 const summary=[{name:"Equipment / one-time investment",value:p.costs.capexTotal},
                {name:"60-month operating commitment",value:p.costs.opex60Months},
                {name:"Current Working SELL",value:p.costs.workingSell},
                {name:"Budget / Release",value:p.costs.releaseSell}];
 return <div className="p55-stack">
  <section className="p55-panel">
   <h2>10 Budget &amp; Commercial Analysis <Copy code="bid.budget"/></h2>
   <p className="p55-note">0553 master workbench UX. All current price sources are scoped to PJ2610-0556. Historical 0553 vendor rates and budget values are forbidden.</p>
   {feedback&&<p role="alert" className="p55-note">{feedback}</p>}
   <div className="p55-metric-grid">
    {summary.map(x=><div key={x.name}><strong>{x.name}</strong><p>{x.value===null?EMPTY:"THB "+x.value.toLocaleString("en-US")}</p><small>Not released · Source evidence required</small></div>)}
   </div>
  </section>
  <Block label="10.1 — Engineering Basis & Required BOM" code="bid.budget.bom" open>
   <p className="p55-note">RF requirement → function → site → physical equipment → quantity → verified vendor quote. No 0553 BOM is inherited.</p>
   <Table columns={["Item","Site / Scope","Required physical function","Quantity","Verified cost THB"]}
     rows={investment.map(r=>[r.id,r.owner,r.work,r.qty,r.cost])}/>
   <p className="p55-note">Reference TOR: 2+0 XPIC, ASD, APP 70 m, AMA 30/25 m; frequency and cable route are OPEN.</p>
  </Block>
  <Block label="10.2 — Working Costs / Services & 60-Month Rental" code="bid.budget.working.bc" open>
   <div className="p55-filterbar"><label htmlFor="p556-costfilter">Workstream Filter</label>
    <select id="p556-costfilter" value={costFilter} onChange={e=>setCostFilter(e.target.value)}>
     <option value="ALL">ALL — Complete Lifecycle</option>
     {activities.map(x=><option key={x.code} value={x.code}>{x.code} — {x.type}</option>)}
    </select></div>
   <Table columns={["Owner / Module","Work Type","Cost category","Term (months)","Verified Cost THB","Working SELL THB"]}
    rows={activeRows.map(r=>[
     <div><strong>{r.code}</strong> <Copy code={"bid.budget.working.bc."+r.code.toLowerCase()}/></div>,
     r.description,r.type,r.months,r.verifiedCost,r.selectedWorkingSell
    ])}/>
   {activeRows.map(row=><details key={row.code} className="p556-budget-phase" data-component-key={"bid.budget.working.bc."+row.code.toLowerCase()}>
    <summary><strong>{row.code} — {row.description}</strong><small>Working source · NOT ESTABLISHED</small></summary>
    <div className="p55-panel"><Copy code={"bid.budget.working.bc."+row.code.toLowerCase()}/>
     <p className="p55-note">Quantity, recurrence, unit rate, documentation, operational burden and price authority require current-project evidence. No automatic posting.</p>
     <Table columns={["Calculation Driver","Controlled Value","Evidence / State"]}
      rows={[["Duration (months)",row.months,"TOR / project timing"],["Verified unit rate",null,"Vendor or loaded internal rate required"],["Total Direct COST THB",null,"OPEN_INPUT"],["Working SELL THB",null,"NOT POSTED"]]}/>
    </div>
   </details>)}
  </Block>
  <Block label="10.3 — Pricing Working / Budgetary / Release" code="bid.budget.pricing" open>
   <div className="p55-filterbar" role="group" aria-label="Pricing stage">
    {[["working","10.3.1 · Working / Edit"],["budgetary","10.3.2 · Budgetary"],["released","10.3.3 · Release"]].map(([code,label])=>
      <button key={code} className={"p556-detail-button"+(pricingStage===code?" is-active":"")} onClick={()=>setPricingStage(code)} type="button" aria-pressed={pricingStage===code}>{label}</button>)}
   </div>
   <p className="p55-note"><strong>Selected view:</strong> {pricingStage.toUpperCase()} · data status: NOT ESTABLISHED · Release gate: HOLD.</p>
   <Table columns={["Price Basis","Project-specific source","Amount THB","State"]}
     rows={[["One-time equipment + engineering","10.1 / 10.2",null,"OPEN_INPUT"],["Recurring managed service × 60 months","10.2 B5–B7",null,"OPEN_INPUT"],["End-of-contract demobilization","10.2 B8",null,"OPEN_INPUT"],["Customer price / margin approval","New pricing authority",null,"RELEASE HOLD"]]}/>
   <p className="p55-note">Working, Budgetary and Release are distinct states; switching tabs does not approve or mutate prices.</p>
  </Block>
  <Block label="10.4 — Estimate → Customer Bid Mapping" code="bid.budget.mapping">
   <Table columns={["Customer package","Cost owner","Mapping rule"]} rows={mapping}/>
   <p className="p55-note">No duplicate posting across equipment, installation, 60-month recurring service, and decommissioning.</p>
  </Block>
  <Block label="10.5 — Scope of Service / Equipment & SLA" code="bid.budget.scope">
   <Table columns={["TOR scope","Included scope intent","Pricing status"]}
    rows={[["Rental equipment","APP & AMA radio / antennas / all installation accessories",EMPTY],
           ["Design / installation","Engineering, FAT, SAT and final records",EMPTY],
           ["Recurring service","24x7 NOC, preventive and corrective maintenance",EMPTY],
           ["Licensing","Frequency and regulatory approvals",EMPTY],
           ["SLA / penalties","99.995% yearly target, response and resolution obligations",EMPTY],
           ["Removal","All equipment removed and restored at contract end",EMPTY]]}/>
  </Block>
  <Block label="10.6 — Customer Proposal Preview / Export" code="bid.budget.customer-output">
   <div className="p55-filterbar" role="group" aria-label="Preview audience">
    {["INTERNAL","CUSTOMER"].map(x=><button type="button" key={x} onClick={()=>setRecipient(x)} aria-pressed={recipient===x} className="p556-detail-button">{x}</button>)}
   </div>
   <p className="p55-note">{recipient} · Read-only preview. Source evidence and commercial approval are required before export.</p>
   <Table columns={["Description","Duration / Basis","THB"]}
    rows={[["APP–AMA Managed Microwave Rental","60 months",null],["One-time engineering / commissioning","Lump sum (unpriced)",null],["End-of-term decommissioning","Lump sum (unpriced)",null]]}/>
   <button disabled type="button" className="p556-detail-button" title="No approved release snapshot">Export Customer Proposal — HOLD</button>
  </Block>
  <Block label="10.7 — Internal Budget Summary & Audit" code="bid.budget.internal">
   <Table columns={["Control","State"]}
    rows={[["0556-specific source quotes","NONE — OPEN"],["Verified 60-month operating-cost ledger","NOT ESTABLISHED"],["Cost and SELL duplication audit","PENDING"],["Engineering / RF proof","PENDING"],["Approved and frozen customer release","NO SNAPSHOT"]]}/>
  </Block>
 </div>;
}
