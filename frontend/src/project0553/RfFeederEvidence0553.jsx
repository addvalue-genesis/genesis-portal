import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {deriveDtrsRfiBudget0553} from "./data/dtrsRfiBudgetCalculation0553";

export function RfFeederEvidence0553({group}) {
 const s=deriveDtrsRfiBudget0553().find(x=>x.wp===group.site);
 if(!s)return null;
 const line=group.items.find(i=>i.quoteLine==="UHF-4");
 const usd=Number.isFinite(line?.extended)?line.extended.toFixed(2):"UNVERIFIED";
 return <details className="p55-panel" data-component-key={"bid.budget.bom.mr0002."+group.site.toLowerCase()+"."+group.site.toLowerCase()+"-bulk-rf-feeder.evidence"} style={{padding:12}}>
  <summary><strong>RF Feeder Evidence — AFC Layout C1 / MGW quote reconciliation</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom.mr0002."+group.site.toLowerCase()+"."+group.site.toLowerCase()+"-bulk-rf-feeder.evidence"}/></summary>
  <p><strong>COUNTED IN VENDOR PACKAGE / NOT ADDITIVE.</strong> MGW-P26-058 UHF-4 includes 100 m 1/2-inch 50-ohm LSZH feeder and 6 male connectors PER set. One set allocated provisionally to {group.site}: USD {usd}, included in the MR0002 working USD subtotal. The separate RF-FEEDER and RF-CONNECTOR lines MUST NOT be summed again.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Basis</th><th>Quantity</th><th>Cost treatment / verification</th></tr></thead><tbody>
   <tr><td>LAY Rev.C1 / conditional LNA–Omni route proxy</td><td>{s.assumedRouteM} m (9.144 m assumed grid span + 3 m termination)</td><td>Not a measured route; verify topology, cable type, endpoint and deck path</td></tr>
   <tr><td>Budgetary cable takeoff including 15% procurement allowance</td><td>{s.procurementM} m per site</td><td>Engineering proxy ONLY; not additional priced procurement</td></tr>
   <tr><td>MGW UHF-4 quoted package</td><td>100 m feeder + 6 male connectors / set</td><td>USD {usd} counted once; provisional one kit per WP; original quote three sets</td></tr>
   <tr><td>Difference — NOT confirmed surplus</td><td>{100-s.procurementM} m nominal</td><td>Do not treat as free spare; assess all RF paths, cut lengths, interfaces and vendor delivery</td></tr>
   <tr><td>RFI LNA RF SMA(F), surge, DC/alarm, Ex gland</td><td>Separate connection-specific derivations</td><td>Verify existing allowance ownership; N-male kit connectors do not prove SMA mating; no zero-cost assumption</td></tr>
  </tbody></table></div>
  <p className="p55-note">Evidence: MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1 (ZWP20 sheet 4 / ZWP21 sheet 7 / ZWP22 sheet 10); MGW quotation P26-058, UHF-4; existing DTRS RFI budget calculation. Price status: PACKAGE COUNTED; field-route / interface confirmation pending. No quotation release.</p>
 </details>;
}
