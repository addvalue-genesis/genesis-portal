import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {CHANGE_LOG_VERSION_0553,RELEASE_NOTES_0553,CHANGE_TYPES_0553} from "./data/budgetChangeLog0553";

// Git revision is injected by webpack at dev-server/build launch. The curated
// notes describe actual changes; SHA tells users when their local code changes.
// Neither changes or writes canonical prices, customer releases or source ledgers.
const BUILD_REVISION_0553=typeof __PJ0553_BUILD_REVISION__==="string"
 ?__PJ0553_BUILD_REVISION__:"UNAVAILABLE";
const SEEN_KEY_0553="pj2608-0553-budget-changes-seen-v1";
const readSeen=()=>{
 try{return typeof window==="undefined"?null:window.localStorage.getItem(SEEN_KEY_0553);}
 catch(_){return null;}
};
const groups=Object.freeze([
 {key:"ui",label:"UI / Navigation",tone:"ui",kinds:["UI"]},
 {key:"data",label:"Data Flow / Cost / Release",tone:"data",kinds:["DATA_FLOW","ENGINEERING","COST","PRICE","RELEASE"]}
]);
const stamp=BUILD_REVISION_0553+"|"+CHANGE_LOG_VERSION_0553;
const validSha=sha=>/^[a-f0-9]{7,40}$/i.test(sha||"");

export function BudgetChangeSummary0553({onOpenModule=()=>{}}){
 const rootRef=React.useRef(null);
 const [seen,setSeen]=React.useState(readSeen);
 const [showAll,setShowAll]=React.useState(false);
 const unseen=seen!==stamp;
 const previousRevision=(seen||"").split("|")[0];
 const compareAvailable=validSha(previousRevision)&&validSha(BUILD_REVISION_0553)&&
  previousRevision!==BUILD_REVISION_0553;
 const compareUrl=compareAvailable?
  "https://github.com/addvalue-genesis/genesis-portal/compare/"+previousRevision+"..."+BUILD_REVISION_0553:null;
 const markReviewed=()=>{
  try{window.localStorage.setItem(SEEN_KEY_0553,stamp);}catch(_){/* browser privacy settings */}
  setSeen(stamp);
 };
 const toggleNested=open=>{
  rootRef.current?.querySelectorAll("details.p553-changes-group, details.p553-changes-row")
   .forEach(node=>{node.open=open;});
  setShowAll(open);
 };
 return <section ref={rootRef} className="p55-panel p553-changes" data-component-key="bid.budget.changes">
  <div className="p553-changes-top">
   <div>
    <div className="p553-changes-title">
     <h3>What's New / Change Summary</h3>
     {unseen&&<span className="p553-changes-new">NEW CODE / REVIEW</span>}
    </div>
    <p className="p55-note">PJ2608-0553 · Latest change log {CHANGE_LOG_VERSION_0553} ·
     {" "}Build Git revision <code>{BUILD_REVISION_0553}</code></p>
    <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.changes"/>
   </div>
   <div className="p553-changes-actions">
    <button type="button" onClick={()=>toggleNested(true)}>＋ Expand All</button>
    <button type="button" onClick={()=>toggleNested(false)}>− Collapse All</button>
    <button type="button" onClick={markReviewed} disabled={!unseen}>
     {unseen?"✓ Mark Reviewed":"Reviewed ✓"}</button>
   </div>
  </div>
  <p className="p55-note">
   {unseen?"เวอร์ชันนี้ยังไม่ถูก Mark Reviewed ใน Browser นี้ — ดูรายการเปลี่ยนแปลงด้านล่าง":
    "คุณ Mark Reviewed เวอร์ชันนี้แล้ว"}
   {" · "}Git revision เปลี่ยนเมื่อ Pull และ Restart npm start / Build ใหม่;
   รายละเอียดด้านล่างเป็น Change Log ที่บันทึกไว้ใน Code ไม่ใช่รายการ Git Commit อัตโนมัติ
   {compareUrl&&<> · <a href={compareUrl} target="_blank" rel="noreferrer">Compare Git revisions ↗</a></>}
  </p>
  <div className="p553-changes-groups">
   {groups.map(group=>{
    const items=RELEASE_NOTES_0553.filter(x=>group.kinds.includes(x.kind));
    return <details key={group.key} className={"p553-changes-group p553-changes-group--"+group.tone}
     data-component-key={"bid.budget.changes."+group.key} open>
     <summary>
      <strong>{group.label}</strong>
      <small>{items.length} change{items.length===1?"":"s"} · {group.key==="ui"?"Blue = UI updates":"Amber = data-flow / price control"}</small>
      <code>{"bid.budget.changes."+group.key}</code>
     </summary>
     <div className="p55-table-wrap">
      <table className="p55-table p55-table--compact p553-changes-table">
       <thead><tr>
        <th>Date / ID</th><th>What's Changed · Expand Details</th>
        <th>Module ID / Open ↗ / Copy</th><th>Price Impact</th>
       </tr></thead>
       <tbody>{items.map(entry=><tr key={entry.id}
        className={"p553-changes-item p553-changes-item--"+entry.tone}
        data-component-key={"bid.budget.changes."+entry.id.toLowerCase()}>
        <td><strong>{entry.date}</strong><small>{entry.id}</small></td>
        <td><details className="p553-changes-row">
         <summary><strong>{entry.title}</strong></summary>
         <p>{entry.detail}</p>
         <small>Code area: {entry.source} · {CHANGE_TYPES_0553[entry.kind]}</small>
        </details></td>
        <td>{entry.moduleIds.map(id=><div className="p553-changes-module" key={id}>
         <button type="button" className="p553-changes-module-open"
          onClick={()=>onOpenModule({sourceModuleId:id})} title={"Open "+id}
          aria-label={"Open Module "+id}>↗ <code>{id}</code></button>
         <ComponentCopyId projectId="PJ2608-0553" componentKey={id}/>
        </div>)}</td>
        <td><strong className={entry.priceImpact==="NO_PRICE_CHANGE"?"p553-changes-impact--none":"p553-changes-impact--changed"}>
         {entry.priceImpact==="NO_PRICE_CHANGE"?"ไม่มีการเปลี่ยนราคา":
          entry.priceImpact==="WORKING_SOURCE_CHANGED"?"Canonical Working changed":"Price impact: review"}
         </strong><small>Customer Release ยัง HOLD</small></td>
       </tr>)}</tbody>
      </table>
     </div>
    </details>;
   })}
  </div>
  <p className="p55-note">What's New เป็นข้อมูลเพื่อการตรวจสอบเท่านั้น: ไม่เปลี่ยน 10.1 BOM, 10.2 Working Cost/SELL,
   10.3 Release Price หรือ Approval. สีแยกประเภทงาน ไม่ใช่สถานะอนุมัติราคาขาย</p>
 </section>;
}
