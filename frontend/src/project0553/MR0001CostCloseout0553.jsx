import React from "react";
import {auditMR0001CostCloseout0553} from "./data/mr0001CostCloseout0553";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
export function MR0001CostCloseout0553(){
 const report=auditMR0001CostCloseout0553();
 return <details className="p55-panel" data-component-key="bid.budget.bom.mr0001.cost-closeout">
  <summary><strong>MR-0001 Cost Closeout / ตรวจรายการที่ยังไม่ปิดราคา</strong>
   <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.bom.mr0001.cost-closeout"/>
   <small>{report.totalBooked}/{report.totalRows} booked · {report.outstanding.length} unresolved · {report.costClosed?"COST CHECK PASSED":"NOT COST CLOSED"}</small></summary>
  <p className="p55-note">ข้อมูลนี้ตรวจจาก Cost Ledger จริงทั้ง 7 Location. Reference-only ไม่ใช่ต้นทุนที่บันทึกแล้ว; ไม่ใช้ 0.00 แทนราคาที่ขาด</p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Location</th><th>Priced / Total</th><th>USD source subtotal</th><th>THB source subtotal</th><th>Closeout</th></tr></thead><tbody>
   {report.locations.map(x=><tr key={x.site}><td>{x.site}</td><td>{x.booked}/{x.total}</td><td>{x.subtotals.USD.toLocaleString("en-US")}</td><td>{x.subtotals.THB.toLocaleString("en-US")}</td><td>{x.costClosed?"BUDGETARY PRICED":"OPEN "+x.outstanding.length}</td></tr>)}
  </tbody></table></div>
  {report.outstanding.length>0&&<div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Module ID</th><th>Missing treatment</th><th>Source</th><th>Status</th></tr></thead><tbody>
   {report.outstanding.map(x=><tr key={x.id}><td>{x.id}<ComponentCopyId projectId="PJ2608-0553" componentKey={x.id}/></td><td>{x.status}{Number.isFinite(x.referenceAmount)&&<small>Reference {x.originalCurrency} {x.referenceAmount.toLocaleString("en-US")}</small>}</td><td>{x.source||"NO SOURCE"}</td><td>{x.reason}</td></tr>)}
  </tbody></table></div>}
 </details>;
}
