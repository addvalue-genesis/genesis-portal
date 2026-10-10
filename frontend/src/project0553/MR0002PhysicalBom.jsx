import React from "react";
import {deriveCable,deriveTerminationAccessories,deriveInstalledAndPurchaseQty} from "../common/engineering/physicalBomDerivation";
import {LNA_0553_BASIS} from "./data/lnaEvidence";
const e={sourceId:"MR0002-C1",revision:"C1"};
const facilities=["ZWP20","ZWP21","ZWP22"];
const objects=[
 ["RAD-508-001","Low Noise Amplifier",1],
 ["ANT-508-001","Yagi Antenna",1],
 ["ANT-508-002","Omni Antenna",1],
 ["TCAB-508-001","DMR Ex d Enclosure",1],
 ["TCAB-508-002","Surge Enclosure",1]
];
export function MR0002PhysicalBom(){
 const qty=deriveInstalledAndPurchaseQty({facilityQuantities:facilities.map(f=>({facility:f,quantity:1})),spares:null,contingency:null,evidence:e});
 const cable=deriveCable({evidence:e});
 const fittings=deriveTerminationAccessories({evidence:e});
 return <section className="p55-panel">
  <div className="p55-eyebrow">MR0002 / PHYSICAL BOM DERIVATION / SOURCE CONTROL</div>
  <h3>DMR LNA / Cable / JB / Glands / Accessories</h3>
  <p className="p55-note">MR Rev.C1 ยืนยัน Tag และ Base Quantity ต่อ Platform; ระบบยังไม่เติม Route Length, Gland Count หรือ Spare Quantity จากการเดาเอง</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget"><thead><tr><th>Parent / ID</th><th>Physical object</th><th>Installed quantity basis</th><th>Purchase / readiness</th></tr></thead><tbody>
  {objects.map(([tag,name,per])=><tr key={tag}><td>MR-0002 / {tag}</td><td>{name}</td><td>{facilities.map(f=>f+" × "+per).join(" · ")} = {per*facilities.length} sets</td><td>Spare/contingency: OPEN</td></tr>)}
  {[
  ["BULK-CABLE","RF feeder / fire-resistant coaxial cable","Length: "+(cable.value??"OPEN")+" m","LAY/route + approved cable spec required"],
  ["BULK-CONNECTOR","RF connector / adapter","Qty: "+(fittings.value?.connectors??"OPEN"),"Connection topology / model required"],
  ["BULK-GLAND","Ex cable gland / blanking","Qty: "+(fittings.value?.cableGlands??"OPEN"),"Certified enclosure entries, cable OD and gland type required"],
  ["BULK-SURGE","RF surge arrestor","MR-listed SA-508-001 / SA-508-002; quantity to reconcile","Protection layout, installation type and datasheet required"],
  ["BULK-EARTH","Grounding / surge bonding kit","OPEN","Grounding routing and vendor kit required"]
  ].map(([id,name,q,note])=><tr key={id}><td>MR-0002 / {id}</td><td>{name}</td><td>{q}</td><td>{note}</td></tr>)}
  </tbody></table></div>
  <p className="p55-note"><strong>Calculation lineage:</strong> MR-0002 → Physical Tags → EQ-002 Installed Qty → EQ-003 Purchase Qty → RF-PROP-02 Feeder Loss → MTO / Installation MH (pending route topology). No released BOM or quotation yet.</p>
  <p className="p55-note"><strong>Source:</strong> <a target="_blank" rel="noreferrer" href={LNA_0553_BASIS.sources[0].url}>MR0002 Rev.C1</a>. Quantity per tag is provisional pending MTO Rev04 reconciliation, duplicates/bulk and scope ownership.</p>
 </section>;
}
