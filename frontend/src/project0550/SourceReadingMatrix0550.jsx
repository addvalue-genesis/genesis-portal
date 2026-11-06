import React, {useEffect, useMemo, useRef, useState} from "react";
import {BidHeading} from "./BidModulePresentation";
import {WP_NAVIGATION_0550} from "./workingPreviewStages0550";
import {APF_BUILDINGS_0550, apfPhiMatrix0550} from "./data/apfPhiMatrix0550";
import {
 SOURCE_MATRIX_CHECKS_0550, SOURCE_MATRIX_GROUPS_0550, sourceMatrixIndex0550, sourceReadingMatrix0550,
} from "./data/sourceReadingMatrix0550";

const states = {
 reviewed:["✓","มีผลทบทวนการอ่าน"],
 found:["●","พบจุดอ่าน"],
 reference:["○","พบเอกสาร/อ้างอิง · รออ่าน"],
 open:["!","OPEN · มีข้อค้างตรวจ"],
 pending:["·","รอคัดกรอง"],
 location:["■","มีเครื่องหมายใน PHI"],
 note:["N","มี Note"],
 blank:["–","ช่องว่างใน PHI"],
 unlisted:["·","ไม่มีแถวแยกใน PHI"],
};
const headings = {SOFTWARE:"SOFT."};
const sourceTitle = source => source?.documentNo || source?.title;
const sourceTarget = id => "bid.documents.controlled-source-inventory.document." + id;

function SourceList0550({sources, onOpen, initial = 12}) {
 const [all,setAll] = useState(false);
 return <>
  <ul>{(all ? sources : sources.slice(0,initial)).map(item => <li key={item.id}>
   {item.source ? <>
    <button type="button" onClick={() => onOpen(item.id)}>{sourceTitle(item.source)}{item.source.revision ? " · " + item.source.revision : ""} ↗</button>
    <small>{item.source.effectiveAuthority} · {item.source.readState}
     {item.reviewed ? " · ตรวจอ่านแล้วตามทะเบียน" : " · รอทบทวน"}
     {item.revisionState && item.revisionState !== "CURRENT_PACKAGE" ? " · " + item.revisionState : ""}</small>
   </> : <strong>{item.id} · OPEN ยังไม่พบ Source ที่ผูก</strong>}
   {item.points?.length > 0 && <details>
    <summary>จุดอ่านที่ผูกไว้ · {item.points.length}</summary>
    <ul>{item.points.map((point,i) => <li key={i}>
     <strong>{[point.kind,point.site,point.locator].filter(Boolean).join(" · ")}</strong>
     {point.text && <blockquote>{point.text}</blockquote>}
     {point.visual && <small>หลักฐานภาพ · {point.visual}</small>}
    </li>)}</ul>
   </details>}
  </li>)}</ul>
  {!all && sources.length > initial && <button type="button" onClick={() => setAll(true)}>แสดงทั้งหมด {sources.length} แหล่ง</button>}
 </>;
}

function DocumentCell0550({cell, onOpen, onOpenRegister}) {
 const linked = new Set(cell.sources.map(item => item.id));
 const candidates = cell.candidates.filter(source => !linked.has(source.id));
 const references = cell.references.filter(ref => ref.edges.length || ref.reason);
 return <>
  <p><strong>{states[cell.state][1]}</strong>{cell.expected && " · ระบุหมวดไว้ใน Scope Review"}</p>
  <p>{SOURCE_MATRIX_CHECKS_0550[cell.family]}</p>
  {cell.issues.length > 0 && <ul>{cell.issues.map(issue => <li key={issue}>{issue}</li>)}</ul>}
  {cell.sources.length > 0 && <>
   <h4>เอกสารที่ผูกหรือพบจากอ้างอิง · {cell.sources.length}</h4>
   <SourceList0550 sources={cell.sources} onOpen={onOpen}/>
  </>}
  {references.length > 0 && <details open={!cell.sources.length}>
   <summary>เลขอ้างอิงและต้นทาง · {references.length}</summary>
   <ul>{references.map(ref => <li key={ref.number}>
    <strong>{ref.number}{ref.revisions.length ? " · " + ref.revisions.join(" / ") : ""}</strong>
    {ref.reason && <small>OPEN · {ref.reason}</small>}
    {ref.edges.map((edge,i) => <details key={i}>
     <summary>{edge.fromDocumentNo || "MR"} · {edge.locator}</summary>
     {edge.excerpt && <blockquote>{edge.excerpt}</blockquote>}
     <button type="button" onClick={() => onOpen(edge.fromId)}>เปิดเอกสารที่อ้างถึงรายการนี้ ↗</button>
    </details>)}
   </li>)}</ul>
  </details>}
  {candidates.length > 0 && <details>
   <summary>ทะเบียน CUS หมวดนี้ · อีก {candidates.length} แหล่งรอคัดกรองรายระบบ</summary>
   <SourceList0550 sources={candidates.map(source => ({id:source.id,source}))} onOpen={onOpen}/>
  </details>}
  {!cell.sources.length && !references.length && !candidates.length && <p>รอตรวจชุดต้นทางหรือเลขอ้างอิงของหมวดนี้</p>}
  {["open","pending"].includes(cell.state) && <button type="button" onClick={onOpenRegister}>เปิดทะเบียน CUS ↗</button>}
 </>;
}

const locationState = (apf, row, i) => {
 if (!apf.source) return "pending";
 const locations = apf.rows.get(row.token);
 if (!locations) return "unlisted";
 const items = locations.get(i);
 return !items ? "blank" : items.some(item => item.note) ? "note" : "location";
};

export function SourceReadingMatrix0550({data, integration, systems, onOpenSource, navigationTarget}) {
 const [view,setView] = useState(navigationTarget===WP_NAVIGATION_0550.locations.id?"locations":"documents"), [selection,setSelection] = useState(null);
 useEffect(()=>{
  if(navigationTarget===WP_NAVIGATION_0550.documents.id)setView("documents");
  if(navigationTarget===WP_NAVIGATION_0550.locations.id)setView("locations");
 },[navigationTarget]);
 const dialog = useRef(null);
 const index = useMemo(() => sourceMatrixIndex0550(data.sourceIntake), [data.sourceIntake]);
 const rows = useMemo(() => sourceReadingMatrix0550(index,integration,systems,data.sourceIntake?.findings),
  [index,integration,systems,data.sourceIntake?.findings]);
 const isDocumentView = view === "documents";
 const apf = useMemo(() => isDocumentView ? null : apfPhiMatrix0550([...index.byId.values()]), [index,isDocumentView]);
 const displayedRows = isDocumentView ? rows : rows.filter(row => row.token !== "COMMON");
 const legend = isDocumentView ? ["reviewed","found","reference","open","pending"] : ["location","note","blank","unlisted","pending"];
 const selectedRow = selection && rows.find(row => row.token === selection.token);
 const selectedCell = selectedRow && isDocumentView ? selectedRow.cells[selection.column] : null;
 const selectedLocation = selectedRow && !isDocumentView ? apf.rows.get(selectedRow.token)?.get(selection.column) : null;
 useEffect(() => {if (selection && !dialog.current.open) dialog.current.showModal();}, [selection]);
 const openCus = target => {
  dialog.current.close();
  onOpenSource(target);
 };
 const openSource = id => openCus(sourceTarget(id));
 return <section className="p55-source-matrix" aria-label="CUS Document Reading Matrix" data-component-key={WP_NAVIGATION_0550.matrix.id} data-module-number={WP_NAVIGATION_0550.matrix.number}>
  <div className="p55-source-matrix-header">
   <h3><BidHeading {...WP_NAVIGATION_0550.matrix}/></h3>
   <span>{systems.length} ระบบ + COMMON</span>
  </div>
  <div className="p55-review-toolbar">
   {["documents","locations"].map(key=>{
    const item=WP_NAVIGATION_0550[key];
    return <button type="button" key={key} aria-label={item.title} aria-pressed={view===key}
     data-component-key={item.id} data-module-number={item.number} onClick={()=>setView(key)}>{item.number} · {item.title}</button>;
   })}
  </div>
  <div className="p55-source-matrix-legend" aria-label="สัญลักษณ์">
   {legend.map(key => <span key={key}><b data-state={key}>{states[key][0]}</b> {states[key][1]}</span>)}
  </div>
  {!isDocumentView && <p className="p55-note">
   {apf.source ? <>PHI-0001 · {apf.source.revision} · Table 7-3 · ตำแหน่งจากข้อความที่รักษาคอลัมน์ไว้ ตรวจสีและฉบับจริงใน CUS <button type="button" onClick={() => onOpenSource(sourceTarget(apf.source.id))}>เปิด PHI ต้นฉบับ ↗</button></>
    : "OPEN · รอตรวจฉบับและต้นฉบับ Table 7-3 ที่รักษาตำแหน่งของช่อง"}
  </p>}
  <div className="p55-table-wrap">
   <table className="p55-table" aria-label={isDocumentView ? "ระบบ × หมวดเอกสาร CUS" : "ระบบ × ตำแหน่ง APF"}>
    <thead>
     <tr><th scope="col" rowSpan={2}>ระบบงาน</th>
      {isDocumentView ? SOURCE_MATRIX_GROUPS_0550.map(([group,keys]) => <th key={group} scope="colgroup" colSpan={keys.length}>{group}</th>) :
       <th scope="colgroup" colSpan={APF_BUILDINGS_0550.length}>APF · PHI Table 7-3</th>}
     </tr>
     <tr>{isDocumentView ? SOURCE_MATRIX_GROUPS_0550.flatMap(([,keys]) => keys.map(key => <th key={key} scope="col" aria-label={key}>{headings[key] || key}</th>)) :
      APF_BUILDINGS_0550.map(site => <th key={site} scope="col">{site}</th>)}</tr>
    </thead>
    <tbody>{displayedRows.map((row,i) => <tr key={row.token} data-system-token={row.token}>
     <th scope="row">{row.token !== "COMMON" && <small>{String(i + 1).padStart(2,"0")}</small>}{row.name}</th>
     {(isDocumentView ? row.cells : APF_BUILDINGS_0550).map((column,j) => {
      const key = isDocumentView ? column.family : column;
      const state = isDocumentView ? column.state : locationState(apf,row,j);
      return <td key={key} data-state={state}><button type="button" aria-haspopup="dialog"
       aria-label={row.name + " × " + key + " · " + states[state][1]}
       onClick={() => setSelection({token:row.token,column:j})}>{states[state][0]}</button></td>;
     })}
    </tr>)}</tbody>
   </table>
  </div>
  <p className="p55-note">{isDocumentView
   ? "กดช่องเพื่อเปิดจุดอ่านและกลับไปยัง CUS · สถานะเป็นรายหมวดและหลักฐานที่พบ · ความครบทั้งระบบตรวจจาก Scope Review และทะเบียนการอ่าน"
   : "ช่องว่างหมายถึงไม่มีเครื่องหมายใน Table 7-3 · ตรวจ MR และแบบร่วมด้วยก่อนสรุปขอบเขต"}</p>
  <dialog ref={dialog} className="p55-source-matrix-dialog" aria-labelledby="p55-source-matrix-detail-title" onClose={() => setSelection(null)}>
   <header><h3 id="p55-source-matrix-detail-title">{selectedRow?.name} × {selectedCell?.family || (selection && APF_BUILDINGS_0550[selection.column])}</h3>
    <form method="dialog"><button type="submit" autoFocus>ปิด</button></form></header>
   {selectedCell && <DocumentCell0550 key={selectedRow.token + selectedCell.family} cell={selectedCell}
    onOpen={openSource} onOpenRegister={() => openCus("l3.original")}/>}
   {selectedRow && !isDocumentView && <>
    <p>{states[locationState(apf,selectedRow,selection.column)][1]} · PHI Table 7-3</p>
    {selectedLocation?.length > 0 && <ul>{selectedLocation.map(item => <li key={item.label}>{item.label}{item.note && " · " + item.note}</li>)}</ul>}
    {(apf.source ? [apf.source] : apf.candidates).map(source => <button type="button" key={source.id} onClick={() => openSource(source.id)}>
     เปิด PHI ใน CUS · {source.revision || "รอ Rev."} · {source.readState} ↗</button>)}
   </>}
  </dialog>
 </section>;
}
