import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";

// PJ2608-0553 10.3 read-only source-link navigator.
// ALL prices are properties of the existing Release model; this component cannot post
// prices, choose a B3 SAT scenario or bypass approval. Work-type colors are labels only.
const CATEGORY_COLOR_0553=Object.freeze({
 B1:"engineering",B2:"engineering",B3:"testing",
 B4:"fabrication",B5:"logistics",B6:"logistics",B7:"logistics",
 B8:"services",B9:"services",B10:"spares",B11:"tools",
 B12:"spares",B13:"spares",B14:"commercial",C1:"options",C2:"options"
});
const currency=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT QUOTED";
const sourceId=row=>row.sourceModuleId||(row.code?.startsWith("A")?"bid.budget.bom.system-location-mto":"bid.budget.working.bc."+row.code.toLowerCase());
const groupData=model=>[
 {part:"a",title:"Part A — Equipment / 10.1",rows:model.a,defaultOpen:false},
 {part:"b",title:"Part B — Services & Spares / 10.2",rows:model.b,defaultOpen:true},
 {part:"c",title:"Part C — Options / 10.2",rows:model.c,defaultOpen:false}
];
const itemPrice=(part,row)=>part==="a"?row.previewSellTHB:row.customerSellTHB;
const itemCost=(part,row)=>part==="a"?row.previewCostTHB:part==="b"?row.actualCostTHB:row.verifiedDirectCostTHB;
const stopCopy=e=>e.stopPropagation();

export function ReleaseSourceNavigator0553({model,onOpenSource}){
 if(!model||typeof onOpenSource!=="function")throw Error("10.3 source navigator requires the selected Release projection");
 const root=React.useRef(null);
 const groups=groupData(model);
 const totalRows=groups.reduce((sum,g)=>sum+g.rows.length,0);
 const setAll=isOpen=>root.current?.querySelectorAll("details.p553-rsn-group, details.p553-rsn-leaf")
  .forEach(node=>{node.open=isOpen;});
 return <section className="p55-panel p553-rsn" ref={root}
  data-component-key="bid.budget.pricing.release.source-navigator">
  <div className="p553-rsn-header">
   <div>
    <h4>10.3 — Color-coded Module Link Navigator</h4>
    <p className="p55-note">Click the colored Module ID to open the exact selected 10.1/10.2 source.
     Colors identify the work type, not release approval. Expand/collapse shows source trace without posting another price.</p>
    <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.pricing.release.source-navigator"/>
   </div>
   <div className="p553-rsn-actions">
    <button type="button" onClick={()=>setAll(true)}>＋ Expand All</button>
    <button type="button" onClick={()=>setAll(false)}>− Collapse All</button>
   </div>
  </div>
  {groups.map(group=><details key={group.part} className={"p553-rsn-group p553-rsn-group--"+group.part}
   data-component-key={"bid.budget.pricing.release.source-navigator."+group.part}
   defaultOpen={group.defaultOpen}>
   <summary>
    <strong>{group.title}</strong>
    <span>{group.rows.length} price groups</span>
    <code>{"bid.budget.pricing.release.source-navigator."+group.part}</code>
   </summary>
   <div className="p553-rsn-scroll">
    <table className="p55-table p55-table--compact p553-rsn-table">
     <thead><tr><th>WBS / Hierarchy</th><th>Source Module ID · Click to Open ↗</th>
      <th>Direct Cost THB</th><th>Customer Preview THB</th><th>Posting</th></tr></thead>
     <tbody>
      {group.rows.map((row,index)=>{
       const id=sourceId(row);
       const tone=group.part==="a"?"engineering":CATEGORY_COLOR_0553[row.code]||"commercial";
       const navId="bid.budget.pricing.release.source-navigator."+group.part+"."+row.code.toLowerCase();
       return <tr key={row.code} className={"p553-rsn-row p553-rsn-row--"+tone}>
        <td>
         <details className="p553-rsn-leaf" data-component-key={navId}>
          <summary><strong>{row.code}</strong> {row.mr||row.description||""}</summary>
          <div className="p553-rsn-detail">
           <div>Source: <code>{id}</code></div>
           {group.part!=="a"&&<div><strong>Financial Identity:</strong>
            <code>{" SOW-"+row.code}</code> Scope ·
            <code>{" WS-"+row.code}</code> Internal Working SELL ·
            <code>{" CP-"+row.code}</code> Customer Proposal NOT ISSUED
           </div>}
           {row.code==="B3"&&row.mgwPurchasedServicesSellIncludedTHB>0&&
            <div>VQ-MGW-SERV-2 / VQ-MGW-SERV-4 → IC-FAT-MGW-SERV-2-4 quoted-cost
             → WS-B3 purchased services {currency(row.mgwPurchasedServicesSellIncludedTHB)};
             SAMTEL purchased cost share {currency(row.samTelPurchased20PctCostShareTHB)}
             counted ONCE · CP-B3 HOLD</div>}
           <div>Commercial owner: {group.part==="a"?"10.1 Equipment":row.code+" selected Working Owner"}</div>
           <div>Preview: {currency(itemPrice(group.part,row))} · {group.part==="c"?"OPTIONAL / not included in Base":group.part==="a"?"Provisional Equipment":"B Working SELL passed unchanged"}</div>
          </div>
         </details>
        </td>
        <td>
         <button type="button" className="p553-rsn-open" aria-label={"Open "+id}
          onClick={()=>onOpenSource({...row,sourceModuleId:id})}>
          <span aria-hidden="true">↗</span> <code>{id}</code>
         </button>
         <span className="p553-rsn-copy" onClick={stopCopy} onKeyDown={stopCopy}>
          <ComponentCopyId projectId="PJ2608-0553" componentKey={id}/>
         </span>
        </td>
        <td className="is-number">{currency(itemCost(group.part,row))}</td>
        <td className="is-number"><strong>{currency(itemPrice(group.part,row))}</strong></td>
        <td><small>{group.part==="c"?"OPTION · HOLD":"PREVIEW · HOLD"}</small></td>
       </tr>;
      })}
     </tbody>
    </table>
   </div>
  </details>)}
  <p className="p55-note">{totalRows} linked category rows from the SAME releaseModel (A1–A4, B1–B14, C1–C2).
   B3 working price does not change by opening a source. Not a released quotation.</p>
 </section>;
}
