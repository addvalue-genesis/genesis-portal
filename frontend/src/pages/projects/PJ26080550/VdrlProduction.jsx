import React, { useMemo, useState } from "react";

const ROWS = [
  ["VDRL-001","PROJECT DOSSIER","Vendor document schedule","MR-0001 Rev.A1 App.3 pp38–40","A1","NOT ISSUED","0","VERIFY","ADDVALUE PREP","Not started","GENESS Register"],
  ["VDRL-002","PROJECT DOSSIER","Bought out items list","MR-0001 Rev.A1 App.3 pp38–40","A1","NOT ISSUED","0","VERIFY","JOINT","In progress","GENESS List"],
  ["VDRL-003","ENGINEERING DOSSIER","RF path and coverage study report","MR App.3 pp38–40","A1","NOT ISSUED","0","VERIFY","JOINT / ENGINEERING","In progress","Study / RPT"],
  ["VDRL-004","ENGINEERING DOSSIER","Functional Design Specification / FDS","MR App.3 pp38–40","A1","NOT ISSUED","0","VERIFY","JOINT","Not started","DOCX Generator"],
  ["VDRL-005","ENGINEERING DOSSIER","General arrangement drawings","MR App.3 pp38–40","A1","NOT ISSUED","0","VERIFY","JOINT / OEM","Not started","Drawing Register"],
  ["VDRL-006","ENGINEERING DOSSIER","Block diagrams","MR App.3 pp38–40","A1","NOT ISSUED","0","VERIFY","JOINT / OEM","In progress","Drawing / JSX"],
  ["VDRL-007","ENGINEERING DOSSIER","Schematic diagrams","MR App.3 pp38–40","A1","NOT ISSUED","0","VERIFY","JOINT / OEM","Not started","Drawing Register"],
  ["VDRL-008","ENGINEERING DOSSIER","Equipment data sheets","MR App.3 pp38–40","A1","NOT ISSUED","0","VERIFY","OEM INPUT","In progress","DTS Generator"],
  ["VDRL-009","ENGINEERING DOSSIER","Catalogues and brochures","MR App.3 pp38–40","A1","NOT ISSUED","0","VERIFY","OEM INPUT","Partial","OEM Attachment"],
  ["VDRL-010","ENGINEERING DOSSIER","Telecommunication termination / typical installation details","MR App.3 pp38–40","A1","NOT ISSUED","0","VERIFY","JOINT","Not started","DOC/DWG"],
  ["VDRL-011","ENGINEERING DOSSIER","Termination diagrams","MR App.3 pp38–40","A1","NOT ISSUED","0","VERIFY","JOINT","Not started","DWG Generator"],
  ["VDRL-012","ENGINEERING DOSSIER","Telecom calculations","MR App.3 pp38–40","A1","NOT ISSUED","0","VERIFY","ENGINEERING","In progress","CAL Generator"],
  ["VDRL-013","QUALITY DOSSIER","Quality management system certificate","MR App.3 pp38–40","A1","NOT ISSUED","0","VERIFY","OEM INPUT","Partial","OEM Attachment"],
  ["VDRL-014","QUALITY DOSSIER","Performance guarantee certificate","MR App.3 pp38–40","A1","NOT ISSUED","0","VERIFY","OEM / JOINT","Not started","Certificate"],
  ["VDRL-015","QUALITY DOSSIER","Performance testing and acceptance test procedures","MR App.3 pp38–40","A1","NOT ISSUED","0","VERIFY","JOINT","Not started","Procedure Generator"],
  ["VDRL-016","QUALITY DOSSIER","Site acceptance test procedure","MR App.3 pp38–40","A1","NOT ISSUED","0","VERIFY","JOINT","Not started","SAT Generator"],
  ["VDRL-017","QUALITY DOSSIER","Factory acceptance test report (FAT)","MR App.3 pp38–40","A1","NOT ISSUED","0","VERIFY","JOINT / OEM","Not started","FAT Report"],
  ["VDRL-018","QUALITY DOSSIER","Inspection and test plan","MR App.3 pp38–40","A1","NOT ISSUED","0","VERIFY","JOINT","Not started","ITP Generator"],
  ["VDRL-019","QUALITY DOSSIER","Quality Assurance Dossier","MR App.3 pp39–40","A1","NOT ISSUED","0","VERIFY","JOINT","Not started","Dossier"],
  ["VDRL-020","MAINT. / OPERATION","Unpacking and preservation procedure","MR App.3 pp39–40","A1","NOT ISSUED","0","VERIFY","JOINT / OEM","Not started","Procedure"],
  ["VDRL-021","MAINT. / OPERATION","Handling and shipping procedures","MR App.3 pp39–40","A1","NOT ISSUED","0","VERIFY","JOINT / OEM","Not started","Procedure"],
  ["VDRL-022","MAINT. / OPERATION","Pre-commissioning / commissioning procedure","MR App.3 pp39–40","A1","NOT ISSUED","0","VERIFY","JOINT","Not started","Procedure Generator"],
  ["VDRL-023","MAINT. / OPERATION","Erection / installation procedure","MR App.3 pp39–40","A1","NOT ISSUED","0","VERIFY","JOINT","Not started","Procedure Generator"],
  ["VDRL-024","MAINT. / OPERATION","Recommended start-up and commissioning spares list","MR App.3 pp39–40","A1","NOT ISSUED","0","VERIFY","JOINT / OEM","In progress","Spares List"],
  ["VDRL-025","MAINT. / OPERATION","Recommended spares list for two years operation","MR App.3 pp39–40","A1","NOT ISSUED","0","VERIFY","OEM INPUT","Not started","SPIR / Price List"],
  ["VDRL-026","MAINT. / OPERATION","Operation dossier","MR App.3 pp39–40","A1","NOT ISSUED","0","VERIFY","JOINT","Not started","Manual / Dossier"],
  ["VDRL-027","PAGA PARTICULAR","MM-ASK-1A-APF-TEL-RPT-0005 · PAGA Sound Coverage Study Report","0550 PAGA project source","B1 / source refs","NOT ISSUED","0","N/A / post-award proof","ENGINEERING / OEM CONFIRM","In progress","RPT Generator"],
];

const STATUS=["All","Not started","In progress","Partial","Ready","Blocked","Hold"];

const WORKLOAD_MODEL = [
  ["Q_issue","Number of controlled issues / occurrences","Bid issue, execution issue, recurring register/report occurrence, final issue — source-driven."],
  ["Q_content","Actual engineering content quantity","Locations, equipment types, interfaces, sheets, test events, calculations or other content driver."],
  ["MH_prepare","Q_issue × (MH_setup/issue + Q_content × UMH_content)","Preparation workload; inputs remain TBC until a controlled 0550 estimating basis exists."],
  ["MH_lifecycle","Check + document control + internal approval + external review + revision + final issue","Added once by lifecycle state; B1 technical authoring must not be duplicated inside B2 document control."]
];

export function VdrlProduction(){
  const [status,setStatus]=useState("All");
  const [dossier,setDossier]=useState("All");
  const [q,setQ]=useState("");

  const dossiers=useMemo(()=>["All",...Array.from(new Set(ROWS.map(r=>r[1])))],[]);
  const data=useMemo(()=>ROWS.filter(r=>
    (status==="All"||r[9]===status) &&
    (dossier==="All"||r[1]===dossier) &&
    (!q||r.join(" ").toLowerCase().includes(q.toLowerCase()))
  ),[status,dossier,q]);

  const ready=ROWS.filter(r=>r[9]==="Ready").length;
  const inprog=ROWS.filter(r=>r[9]==="In progress"||r[9]==="Partial").length;

  return (
    <div className="vdrl-shell">
      <div className="vdrl-history-note">
        <strong>Reuse pattern found</strong>
        <span>
          0541 used a VDRS register with document code/title/review flow; 0553 used lifecycle control with source row,
          bidding/execution, owner basis, status, assignee, evidence and next action. This 0550 view combines those patterns
          but keeps 0550 facts separate.
        </span>
      </div>

      <div className="vdrl-stats">
        <div><strong>{ROWS.length}</strong><span>Source-driven / particular deliverables</span></div>
        <div><strong>{inprog}</strong><span>In progress / partial</span></div>
        <div><strong>{ready}</strong><span>Ready</span></div>
        <div><strong>TBC</strong><span>Document MH until UMH approved</span></div>
      </div>

      <div className="vdrl-toolbar">
        <select value={dossier} onChange={e=>setDossier(e.target.value)}>{dossiers.map(x=><option key={x}>{x}</option>)}</select>
        <select value={status} onChange={e=>setStatus(e.target.value)}>{STATUS.map(x=><option key={x}>{x}</option>)}</select>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search title / owner / generator / source…" />
        <button type="button">Generate selected draft</button>
        <button type="button">Export VDRL XLSX</button>
        <button type="button" onClick={()=>window.print()}>Print / PDF</button>
      </div>

      <div className="vdrl-revision-control">
        <strong>Revision control</strong>
        <span>Source Rev = revision of the requirement/source document. Deliverable Rev = revision of our document being issued. Hist Rev = immutable issue history; never overwrite prior revisions.</span>
      </div>

      <section className="vdrl-generator-map">
        {WORKLOAD_MODEL.map(([key,meaning,control],idx)=>(
          <React.Fragment key={key}>
            <div>
              <b>{key}</b>
              <span>{meaning}</span>
              <small>{control}</small>
            </div>
            {idx<WORKLOAD_MODEL.length-1&&<em>→</em>}
          </React.Fragment>
        ))}
      </section>

      <div className="vdrl-warning">
        <strong>VDRL workload control:</strong>
        <span>
          One VDRL row is not automatically one engineering work unit. Q_issue and Q_content are independent drivers.
          Unknown recurrence, content quantity, review cycle or UMH remains TBC and therefore cannot be treated as zero cost.
        </span>
      </div>

      <div className="vdrl-warning">
        <strong>Source-control rule:</strong>
        <span>
          Document titles below are source-supported from MR-0001 Appendix 3. Exact SDRL code / With-Bid mark is not auto-filled
          until the source table is verified. 0541/0553 codes, quantities and responsibilities are not copied as 0550 facts.
        </span>
      </div>

      <div className="bid-table-wrap">
        <table className="vdrl-table">
          <thead>
            <tr>
              <th>Control ID</th><th>Dossier</th><th>Deliverable</th><th>Source authority</th>
              <th>Source Rev</th><th>Deliverable Rev</th><th>Hist Rev</th>
              <th>With Bid</th><th>Owner working basis</th><th>Status</th><th>Generator / Evidence</th>
              <th>MH basis</th><th>Next action</th>
            </tr>
          </thead>
          <tbody>
            {data.map(r=>(
              <tr key={r[0]}>
                <td><code>{r[0]}</code></td>
                <td><span className="vdrl-dossier">{r[1]}</span></td>
                <td><strong>{r[2]}</strong></td>
                <td>{r[3]}</td>
                <td><span className="vdrl-source-rev">{r[4]}</span></td>
                <td><span className="vdrl-deliverable-rev">{r[5]}</span></td>
                <td><button className="vdrl-hist-btn" type="button" title="Revision history preview">{r[6]} rev</button></td>
                <td><span className="vdrl-verify">{r[7]}</span></td>
                <td>{r[8]}<small>WORKING MODEL</small></td>
                <td><Status status={r[9]}/></td>
                <td>{r[10]}</td>
                <td>
                  <code>Q_issue × (setup + Q_content × UMH)</code>
                  <small>+ check / DC / review / revise / final · inputs TBC</small>
                </td>
                <td><input placeholder="Assignee / evidence / gap / due…" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="vdrl-generator-map">
        <div><b>Data / Evidence</b><span>MR / SPE / PHI / CAL / vendor input</span></div><em>→</em>
        <div><b>GENESS Template</b><span>DOCX / XLSX / Drawing / Report model</span></div><em>→</em>
        <div><b>Internal Review</b><span>Evidence / naming / completeness gates</span></div><em>→</em>
        <div><b>Customer Preview</b><span>Clean output / PTTEP format</span></div><em>→</em>
        <div><b>Issue / VDRL</b><span>Revision / transmittal / return / status</span></div>
      </section>
    </div>
  );
}

function Status({status}){
  const s=String(status).toLowerCase();
  let tone="neutral";
  if(s.includes("ready")) tone="good";
  else if(s.includes("progress")||s.includes("partial")) tone="warn";
  else if(s.includes("not")||s.includes("block")||s.includes("hold")) tone="bad";
  return <span className={"bid-status "+tone}>{status}</span>;
}
