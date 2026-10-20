import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {BcCostEvidenceDetail0553} from "./BcCostEvidenceDetail0553";
import {BcWorkCostLines0553} from "./BcWorkCostLines0553";

// 10.2 / read-only presentation of the 16 CANONICAL B/C owners.
// These names/colors do not allocate costs or create new WBS, cost lines or SELL.
const WORK_TYPE_0553=Object.freeze({
 B1:["engineering","Engineering / Project Support"],
 B2:["engineering","Documentation / VDRL"],
 B3:["testing","Inspection / FAT / SAT / SIT"],
 B4:["fabrication","Painting / Coating"],
 B5:["logistics","Packing / Marking"],
 B6:["logistics","Freight / Delivery"],
 B7:["logistics","Storage"],
 B8:["services","Training"],
 B9:["services","Specialist Assistance"],
 B10:["spares","Commissioning Spares"],
 B11:["tools","Permanent O&M Special Tools"],
 B12:["spares","First Filling"],
 B13:["spares","Consumables"],
 B14:["commercial","Bonds / Insurance"],
 C1:["options","Optional Capital Spares"],
 C2:["options","Optional Two-year Spares"]
});
const money=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const copy=id=><span className="p553-bc-copy"
 onClick={e=>{e.preventDefault();e.stopPropagation();}} onKeyDown={e=>e.stopPropagation()}>
 <ComponentCopyId projectId="PJ2608-0553" componentKey={id}/>
 </span>;
export function BcWorkingHierarchy0553({partBRows,partCRows,partBWorkingSell,partCWorkingSell,
 missingB,missingC,forceOpenCode=null,navigationTarget=null}){
 const allRows=[...partBRows,...partCRows];
 if(allRows.length!==16||allRows.some(x=>!WORK_TYPE_0553[x.code]||
  x.moduleId!=="bid.budget.working.bc."+x.code.toLowerCase()))
  throw Error("10.2 sixteen B/C source owners must remain canonical and uniquely mapped");
 const [expanded,setExpanded]=React.useState(()=>new Set(["B1"]));
 const [expandNested,setExpandNested]=React.useState(null);
 const rootRef=React.useRef(null);
 React.useEffect(()=>{
  const code=String(forceOpenCode||"").toUpperCase();
  if(WORK_TYPE_0553[code])setExpanded(previous=>{
   if(previous.has(code))return previous;
   const next=new Set(previous);next.add(code);return next;
  });
 },[forceOpenCode]);
 React.useEffect(()=>{
  if(expandNested===null)return;
  // Root content is mounted by React BEFORE we expand nested disclosure nodes.
  // Native <details> enables opening arbitrary leaf Module IDs by the existing
  // openModuleAncestors0553 helper without custom navigator side effects.
  rootRef.current?.querySelectorAll("details.p553-bc-row details").forEach(node=>{
   node.open=expandNested;
  });
  setExpandNested(null);
 },[expanded,expandNested]);
 const toggleAll=isOpen=>{
  setExpanded(new Set(isOpen?allRows.map(x=>x.code):[]));
  setExpandNested(isOpen);
 };
 const groups=[
  {part:"B",label:"Part B — Base Services / Spares",rows:partBRows,total:partBWorkingSell,missing:missingB},
  {part:"C",label:"Part C — Optional Spare Parts",rows:partCRows,total:partCWorkingSell,missing:missingC}
 ];
 return <section className="p55-panel p553-bc-worktype" ref={rootRef}
  data-component-key="bid.budget.working.bc.inline-list">
  <div className="p553-bc-main-header">
   <div>
    <h4>10.2 — B1–B14 / C1–C2 · Hierarchical Work Type Accordion</h4>
    <p className="p55-note">Click ＋ / − to view individual modules. B1 is expanded initially so
     B1.1–B1.8 are immediately available. Colors identify WORK TYPE, not approval status.</p>
    <p className="p55-note">Each Working SELL amount is shown once from the canonical 10.2
     cost-owner row. Details below are read-only; actual Direct Cost is NOT ESTABLISHED.</p>
   </div>
   <div className="p553-bc-main-actions">
    <button type="button" className="p553-detail-button" onClick={()=>toggleAll(true)}>
     ＋ Expand All</button>
    <button type="button" className="p553-detail-button" onClick={()=>toggleAll(false)}>
     − Collapse All</button>
   </div>
  </div>
  {groups.map(group=><section key={group.part} className="p553-bc-part"
   data-component-key={"bid.budget.working.bc.part-"+group.part.toLowerCase()}>
   <h4>{group.label}</h4>
   <p className="p55-note"><strong>Working SELL subtotal: {money(group.total)}</strong>
    {" "}· Priced {group.rows.length-group.missing.length}/{group.rows.length}
    {" "}· Pending {group.missing.join(", ")||"none"}
    {" "}· {group.part==="C"?"OPTIONAL; excluded from Part B base":"Base, known priced lines only"}.
    Unknown direct costs do not imply zero.</p>
   {group.rows.map(item=>{
    const [tone,type]=WORK_TYPE_0553[item.code];
    const open=expanded.has(item.code);
    return <details key={item.code} open={open}
     onToggle={event=>{
      if(event.target!==event.currentTarget)return;
      const shouldOpen=event.currentTarget.open;
      setExpanded(previous=>{
       if(previous.has(item.code)===shouldOpen)return previous;
       const next=new Set(previous);
       shouldOpen?next.add(item.code):next.delete(item.code);
       return next;
      });
     }}
     data-component-key={item.moduleId}
     className={"p553-bc-row p553-bc-row--"+tone+
       (navigationTarget===item.moduleId?" p553-module-nav-target":"")}>
     <summary className="p553-bc-row-summary">
      <span className="p553-bc-index">{item.code}</span>
      <span className="p553-bc-row-label">
       <strong>{item.requirement}</strong>
       <small>{type} · {item.workflowNumber} · {item.optional?"OPTIONAL":"BASE"}</small>
       <code>{item.moduleId}</code>
      </span>
      <span className="p553-bc-row-sell">
       <strong>{money(item.workingSellTHB)}</strong>
       <small>Working SELL · {Number.isFinite(item.directCostTHB)?
        "Direct cost verified separately":"Direct Cost NOT ESTABLISHED"}</small>
      </span>
      {copy(item.moduleId)}
     </summary>
     {open&&<div className="p553-bc-row-body">
      <div className="p553-bc-row-facts">
       <p className="p55-note"><strong>Source / Cost Owner:</strong> {item.code}
        {" "}· {item.sourceRevision} · {item.executionOwner}
        {" "}· Qty {Number.isFinite(item.qtyDriver)?item.qtyDriver:"TBC"} {item.unit||"LS"}
        {" "}· Single-owner non-duplicate Working SELL.</p>
       <p className="p55-note">No additional Working SELL is generated by this accordion,
        the original Cost Evidence table or the nested Module Navigator.</p>
      </div>
      <section className="p55-panel" data-component-key={item.moduleId+".details"}
       style={{padding:12,marginTop:10}}>
       <h4>{item.code} — Detailed Work / Cost Evidence</h4>
       <BcCostEvidenceDetail0553 workingRow={item} navigationTarget={navigationTarget}/>
       <BcWorkCostLines0553 selectedCode={item.code} presentationNamespace={item.moduleId}/>
      </section>
     </div>}
    </details>;
   })}
  </section>)}
 </section>;
}
