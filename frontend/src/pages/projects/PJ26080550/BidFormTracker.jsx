import React, { useMemo, useState } from "react";
import { useProject0550CanonicalState } from "./useProject0550CanonicalState";

const FALLBACK_ROWS = [
  {
    id:"BID-001", source:"Exhibit A §4.1–4.3", group:"Contract",
    requirement:"Meet or exceed applicable codes, standards and project specifications; resolve conflicts before design/procurement.",
    response:"TBC — technical compliance review in progress", ref:"Technical Compliance / Deviation Register",
    status:"REVIEW", deviation:"—",
    internal:"Need clause-level reconciliation against MR/SPE/PHI/BOD/STD before final comply statement."
  },
  {
    id:"BID-002", source:"Exhibit A §5", group:"Scope",
    requirement:"Engineering, procurement, fabrication, testing, packing, transport, pre-com/commissioning spares, site services, documents, training and warranty form part of scope.",
    response:"INCLUDE — costing not complete", ref:"Scope / Cost Workbench",
    status:"PARTIAL", deviation:"—",
    internal:"This is the main scope completeness gate. Do not price equipment only."
  },
  {
    id:"BID-003", source:"Exhibit A §6.1", group:"Engineering",
    requirement:"Validate FEED, complete detailed design, calculations/drawings, installation methods and AFC development.",
    response:"INCLUDE", ref:"Engineering Proof + VDRL",
    status:"PARTIAL", deviation:"—",
    internal:"Convert each engineering obligation into proof object + deliverable + MH."
  },
  {
    id:"BID-004", source:"Exhibit A §7.6–7.8", group:"Spares",
    requirement:"Provide pre-com/commissioning spares & consumables; price 2-year spares; price capital spares; provide special tools.",
    response:"INCLUDE / SEPARATE SCHEDULES", ref:"Exhibit C C2/C3/C4/C5",
    status:"OPEN", deviation:"—",
    internal:"Base vs separate-price classification must follow Exhibit C."
  },
  {
    id:"BID-005", source:"Exhibit A §9.4–9.5", group:"QA/Test",
    requirement:"Submit ITP and support Hold/Witness/Review points including FAT/SIT notifications and attendance.",
    response:"INCLUDE", ref:"ITP / FAT / SIT / Cost",
    status:"OPEN", deviation:"—",
    internal:"Need witness basis, factory location, travel/facility cost, notice dates."
  },
  {
    id:"BID-006", source:"Exhibit A §13.1", group:"Site Service",
    requirement:"Provide instruction and supervision for installation, pre-commissioning, commissioning and testing at site.",
    response:"INCLUDE — service duration TBC", ref:"Exhibit C C7 / Site Service",
    status:"OPEN", deviation:"Commercial if excluded",
    internal:"Derive personnel × days/hours × rate; clarify execution vs supervision responsibility."
  },
  {
    id:"BID-007", source:"Exhibit A §15.1–15.3", group:"Documents",
    requirement:"Prepare MDDR/VDRS with document no., title, planned/actual submission, return dates and approval status.",
    response:"INCLUDE", ref:"VDRL / MDDR / VDRS",
    status:"PARTIAL", deviation:"—",
    internal:"Use VDRL tracker + generator. Cost document preparation/review cycles."
  },
  {
    id:"BID-008", source:"MR-0001 App.3 SDRL", group:"Documents",
    requirement:"Supplier documentation requirements must be costed; documents marked with Bid requirement shall be submitted with bid.",
    response:"INCLUDE — source-row extraction in progress", ref:"VDRL Production Queue",
    status:"PARTIAL", deviation:"—",
    internal:"Titles verified from MR. Exact SDRL code / With-Bid mark must be source-verified before release."
  },
  {
    id:"BID-009", source:"MR-0001 App.1.4 PAGA", group:"PAGA",
    requirement:"Design/supply PAGA complete system; contractual documents; FAT/SAT; IFAT; spares; site supervision; packing/transportation.",
    response:"INCLUDE — engineering proof open", ref:"PAGA Engineering Workspace",
    status:"PARTIAL", deviation:"Technical if proof gap",
    internal:"First Principles vertical slice currently Catering."
  },
  {
    id:"BID-010", source:"Exhibit C C7", group:"Commercial",
    requirement:"Field service and training basis must be sufficient and included in quoted scope; personnel hours/rates required.",
    response:"TBC — service basis to be quantified", ref:"Field Service / Training Price",
    status:"OPEN", deviation:"Commercial if limited",
    internal:"Do not leave service time undefined; this can become unrecoverable cost."
  },
  {
    id:"BID-011", source:"Exhibit C C3", group:"Commercial",
    requirement:"2-year operating spares are priced separately from base scope.",
    response:"SEPARATE PRICE", ref:"Schedule C3",
    status:"READY BASIS", deviation:"—",
    internal:"Need OEM recommended list, part number, qty, lead time, unit price."
  },
  {
    id:"BID-012", source:"Exhibit C A1 / Delivery Terms", group:"Logistics",
    requirement:"Overseas manufacturer basis CIF Yangon; China manufacturer basis FOB major China port, subject to contract template.",
    response:"TBC per vendor origin", ref:"A1 / Logistics Cost",
    status:"OPEN", deviation:"Commercial if alternative",
    internal:"Vendor origin drives freight/import boundary and commercial deviation."
  }
];

export function BidFormTracker(){
  const canonical=useProject0550CanonicalState();
  const sourceRows=useMemo(()=>{
    if(!canonical.data?.requirements?.length) return FALLBACK_ROWS;
    return canonical.data.requirements.map(r=>({
      id:r.requirement_code,
      source:[r.source_code,r.clause_ref].filter(Boolean).join(" · ") || r.source_title || "SOURCE TBC",
      group:r.requirement_domain || "OTHER",
      requirement:r.requirement_text,
      response:r.response_text || r.response_type || "TBC",
      ref:[r.linked_proof_id&&"PROOF",r.linked_mto_id&&"MTO",r.linked_cost_item_id&&"COST"].filter(Boolean).join(" / ") || "CONTROLLED STATE",
      status:r.response_status || r.requirement_status || "OPEN",
      deviation:/DEVIATION/.test(String(r.response_type||"")) ? r.response_type : "—",
      internal:r.reason_justification || "Derived from canonical bid requirement / response state."
    }));
  },[canonical.data]);
  const [mode,setMode]=useState("internal");
  const [group,setGroup]=useState("ALL");
  const [q,setQ]=useState("");

  const groups=useMemo(()=>["ALL",...Array.from(new Set(sourceRows.map(x=>x.group)))],[]);
  const rows=useMemo(()=>sourceRows.filter(x=>
    (group==="ALL"||x.group===group) &&
    (!q||Object.values(x).join(" ").toLowerCase().includes(q.toLowerCase()))
  ),[sourceRows,group,q]);

  const counts=useMemo(()=>({
    total:sourceRows.length,
    open:sourceRows.filter(x=>["OPEN","REVIEW","DRAFT"].includes(String(x.status).toUpperCase())).length,
    partial:sourceRows.filter(x=>String(x.status).toUpperCase()==="PARTIAL").length,
    ready:sourceRows.filter(x=>String(x.status).toUpperCase().includes("READY")).length
  }),[sourceRows]);

  return (
    <div className="bid-form-shell">
      <div className="bid-canonical-state-banner">
        <strong>{canonical.isLive ? "LIVE DB CANONICAL REQUIREMENTS / RESPONSES" : "CONTROLLED FALLBACK PREVIEW"}</strong>
        <span>Bid Form Tracker is a projection of canonical requirement/response state; it does not own a separate requirement list.</span>
      </div>
      <div className="bid-form-toolbar">
        <div className="bid-view-mode">
          <span>View mode</span>
          <button className={mode==="internal"?"active":""} onClick={()=>setMode("internal")}>Internal · full notes</button>
          <button className={mode==="customer"?"active":""} onClick={()=>setMode("customer")}>Customer preview · clean</button>
        </div>
        <div className="bid-form-actions">
          <select value={group} onChange={e=>setGroup(e.target.value)}>{groups.map(x=><option key={x}>{x}</option>)}</select>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search requirement / source / response…" />
          <button type="button" onClick={()=>window.print()}>Print / Save PDF</button>
        </div>
      </div>

      <div className="bid-form-stats">
        <div><strong>{counts.total}</strong><span>Controlled lines</span></div>
        <div><strong>{counts.open}</strong><span>Open / review</span></div>
        <div><strong>{counts.partial}</strong><span>Partial</span></div>
        <div><strong>{counts.ready}</strong><span>Ready basis</span></div>
      </div>

      <section className="bid-customer-sheet">
        <div className="bid-sheet-head">
          <div><small>CLIENT</small><strong>PTTEP / PURCHASER BID PACKAGE</strong></div>
          <div><small>PROJECT</small><strong>PJ2608-0550 · AUNG SINKHA TELECOM</strong></div>
          <div><small>FORM</small><strong>BID COMPLIANCE / RESPONSE MATRIX</strong></div>
          <div><small>REV</small><strong>REV0 · WORKING</strong></div>
        </div>

        <div className="bid-table-wrap">
          <table className="bid-form-table">
            <thead>
              <tr>
                <th>Control ID</th>
                <th>Source / Clause</th>
                <th>Requirement</th>
                <th>Bidder Response</th>
                <th>Reference / Output</th>
                <th>Status</th>
                <th>Deviation Route</th>
                {mode==="internal"&&<th>Internal Note / Next Action</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map(r=>(
                <tr key={r.id}>
                  <td><code>{r.id}</code><small>{r.group}</small></td>
                  <td><strong>{r.source}</strong></td>
                  <td>{r.requirement}</td>
                  <td className="bid-response">{r.response}</td>
                  <td>{r.ref}</td>
                  <td><Status status={r.status}/></td>
                  <td>{r.deviation}</td>
                  {mode==="internal"&&<td className="bid-internal-note">{r.internal}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Status({status}){
  const s=String(status).toLowerCase();
  let tone="neutral";
  if(s.includes("ready")) tone="good";
  else if(s.includes("partial")) tone="warn";
  else if(s.includes("open")||s.includes("review")) tone="bad";
  return <span className={"bid-status "+tone}>{status}</span>;
}
