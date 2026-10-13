import React,{useMemo,useState} from "react";
import {VENDOR_0553_SOURCES} from "./vendorEvidence";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {SmartFilterBar,SmartDataGroup,moduleSegment} from "../common/ui/SmartDataExplorer";

// Source-document register only: the Company/Product view is the catalog.
// This register exposes every original source, including those not yet mapped to quote lines.
export function VendorSourceRegister0553(){
 const [term,setTerm]=useState("");
 const [kind,setKind]=useState("ALL");
 const [mr,setMr]=useState("ALL");
 const types=[...new Set(VENDOR_0553_SOURCES.map(s=>s.type))].sort((a,b)=>a.localeCompare(b,"en"));
 const mrOptions=[...new Set(VENDOR_0553_SOURCES.map(s=>s.mr))].sort((a,b)=>a.localeCompare(b,"en"));
 const rows=useMemo(()=>VENDOR_0553_SOURCES.filter(s=>
  (kind==="ALL"||s.type===kind)&&(mr==="ALL"||s.mr===mr)&&
  [s.id,s.mr,s.supplier,s.manufacturer,s.document,s.status,s.type,s.next].join(" ").toLocaleLowerCase().includes(term.trim().toLocaleLowerCase())
 ),[kind,mr,term]);
 return <SmartDataGroup moduleKey="bid.documents" title="Source Documents / เอกสารต้นฉบับ Vendor & OEM"
   count={VENDOR_0553_SOURCES.length} defaultOpen={false}
   description="Original source register remains complete even when source quotation/products have not yet been mapped. Search by Source ID, Company, MR, document title or evidence type.">
  <SmartFilterBar moduleKey="bid.documents.source-filter" title="Document Source Search"
   total={VENDOR_0553_SOURCES.length} shown={rows.length}
   onReset={()=>{setTerm("");setKind("ALL");setMr("ALL");}}
   controls={[
    {key:"query",label:"Find source / company / MR / ID",type:"search",value:term,onChange:setTerm,
      placeholder:"MGW, RFI, MR-0002, V-RACON"},
    {key:"kind",label:"Evidence Type",type:"select",value:kind,onChange:setKind,
      options:[{value:"ALL",label:"All evidence types"},...types.map(t=>({value:t,label:t}))]},
    {key:"mr",label:"MR / System",type:"select",value:mr,onChange:setMr,
      options:[{value:"ALL",label:"All MR / Systems"},...mrOptions.map(m=>({value:m,label:m}))]}
   ]}/>
  <div className="p55-table-wrap">
   <table className="p55-table p55-table--compact">
    <thead><tr><th>Source ID / Copy</th><th>MR / Company</th><th>Document / Original Link</th><th>Evidence Class</th><th>Verification / Status</th></tr></thead>
    <tbody>{rows.map(s=><tr key={s.id}>
     <td><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.documents.source."+moduleSegment(s.id)} componentName={s.document}/></td>
     <td><strong>{s.mr}</strong><small>{s.supplier}</small>{s.manufacturer&&<small>Manufacturer: {s.manufacturer}</small>}</td>
     <td><a href={s.url} target="_blank" rel="noreferrer">{s.document}</a><small>Original source: {s.id}</small></td>
     <td>{s.type}</td><td>{s.status}<small>{s.next}</small></td>
    </tr>)}</tbody>
   </table>
  </div>
  {!rows.length&&<p className="p55-note" role="status">No source matches. Clear filters to show all originals.</p>}
 </SmartDataGroup>;
}
