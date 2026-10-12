import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {BOM_READ_MODEL_0553,bomItems0553} from "./data/bomReadModel0553";
export function PartAWorkingBomReadOnly0553(){
 const siteRows=BOM_READ_MODEL_0553.rows.filter(r=>bomItems0553(r).length);
 return <div className="p55-panel">
  <h4>Part A — BOM Working Detail <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.summary.workbook.scope-of-supply.part_a.bom-detail"/></h4>
  <p className="p55-note">Read-only from BOM ledger. Scope evidence only; not yet approved customer XLSX mapping, quantity or sell price. Internal vendor costs are hidden.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>MR</th><th>Location</th><th>MTO Row</th><th>Tag</th><th>Equipment / Description</th><th>Qty</th><th>Unit</th><th>Status</th><th>Copy Module</th></tr></thead>
   <tbody>{siteRows.flatMap(r=>bomItems0553(r).map((item,i)=><tr key={r.mr+":"+r.site+":"+(item.id||i)}>
    <td>{r.mr}</td><td>{r.site}</td><td>{item.row??"—"}</td><td>{item.tag||"—"}</td><td>{item.description}</td>
    <td>{item.sourceQty??"—"}</td><td>{item.sourceUnit||"—"}</td><td>{item.status||"WORKING"}</td>
    <td><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+r.site.toLowerCase()+"."+(item.tag||item.id||"row-"+i).toLowerCase().replace(/[^a-z0-9-]/g,"-")}/></td>
   </tr>))}
   {!siteRows.length&&<tr><td colSpan={9}>No detailed BOM source rows available.</td></tr>}
   </tbody></table></div>
  <p className="p55-note">Other MR/location allocations without detailed source rows are not yet physical BOM; original XLSX blank lines remain unchanged for eventual controlled export.</p>
 </div>;
}