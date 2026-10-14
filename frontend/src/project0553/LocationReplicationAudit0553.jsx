import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {Z1F_TEL_LAYOUT_INDEX_0553} from "./data/z1fTelLayoutIndex0553";
import {MR0002_WORKING_BOM_0553} from "./data/mr0002WorkingBom0553";
import {getMR0001LocationCost0553} from "./data/mr0001LocationCostSummary0553";
import {deriveWpSystemBulkBudget0553} from "./data/wpSystemBulkBudget0553";

const SITES=["ZWP20","ZWP21","ZWP22"];
const label={SCADA_RADIO:"MR0001 · SCADA",DTRS_TRUNK_RADIO:"MR0002 · DTRS",EX_IP_PHONE:"MR0003 · Ex IP Phone",MARINE_RACON:"MR0004 · Marine RACON"};
const fmt=x=>Number.isFinite(x)?x.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT VERIFIED";
export function LocationReplicationAudit0553(){
 const bulk=deriveWpSystemBulkBudget0553();
 const rows=SITES.map(site=>{
  const w=Z1F_TEL_LAYOUT_INDEX_0553.byWP.find(x=>x.wp===site);
  const mr1=getMR0001LocationCost0553(site);
  const mr2=MR0002_WORKING_BOM_0553.sites.find(x=>x.site===site);
  const b=bulk.find(x=>x.wp===site);
  const systems=["SCADA_RADIO","DTRS_TRUNK_RADIO","EX_IP_PHONE","MARINE_RACON"].map(sys=>{
   const physical=w.equipment.filter(e=>e.system===sys);
   const scope=b?.systems.find(x=>x.id===sys);
   const priced=scope?.items.filter(i=>Number.isFinite(i.extendedTHB))||[];
   const unpriced=scope?.items.filter(i=>!Number.isFinite(i.extendedTHB))||[];
   return {sys,physical,scope,priced,unpriced};
  });
  return {site,w,mr1,mr2,systems};
 });
 const base=rows[0];
 return <section className="p55-panel" data-component-key="bid.budget.bom.zwp20-21-22-replication-audit" style={{padding:14}}>
  <h3>ZWP20 → ZWP21 / ZWP22 · Common Kernel &amp; Source-Derived Comparison <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.bom.zwp20-21-22-replication-audit"/></h3>
  <p className="p55-note">COMMON algorithms, PARTICULAR drawing evidence. Equipment TAG presence is not certified installation quantity. THB and USD are never combined without an approved FX rate. Bulk scenario is NOT automatically an additive A+B+C or released selling price.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>WP</th><th>SCADA ODU / Antenna location</th><th>MR0001 counted USD / THB</th><th>MR0001 priced rows</th><th>MR0002 counted USD / THB</th><th>MR0002 active lines</th></tr></thead><tbody>
   {rows.map(x=><tr key={x.site}><td><strong>{x.site}</strong></td><td>{x.w.equipment.filter(e=>e.system==="SCADA_RADIO").map(e=>e.tag+" · "+e.deck).join(" / ")||"NOT IN LAY"}</td><td>USD {fmt(x.mr1.allocatedUSD)}<small>THB {fmt(x.mr1.allocatedTHB)}</small></td><td>{x.mr1.costedRows}/{x.mr1.sourceCount} · {x.mr1.remaining} unresolved</td><td>USD {fmt(x.mr2?.controlledTotalUSD)}<small>THB {fmt(x.mr2?.controlledTotalTHB)}</small></td><td>{x.mr2?.items.length??"NOT AVAILABLE"}</td></tr>)}
  </tbody></table></div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>WP</th><th>MR</th><th>AFC equipment-tag evidence</th><th>Bulk line coverage</th><th>Different from ZWP20</th></tr></thead><tbody>
   {rows.flatMap(x=>x.systems.map(s=>{
    const baseline=base.systems.find(z=>z.sys===s.sys);
    const delta=s.physical.map(y=>y.tag+"@"+y.deck).sort().join("|")!==baseline.physical.map(y=>y.tag+"@"+y.deck).sort().join("|");
    return <tr key={x.site+s.sys}><td>{x.site}</td><td>{label[s.sys]}</td><td>{s.physical.map(e=>e.tag+" ("+e.deck+")").join(", ")||"NO EQUIPMENT TAG ON THIS LAY — CHECK MR / OTHER DWG"}</td><td>{s.priced.length} priced / {s.unpriced.length} non-priced scenario lines<small>NOT automatically posted to A+B+C</small></td><td>{x.site==="ZWP20"?"REFERENCE":delta?"YES — location/tag distribution differs":"No tag/deck difference shown; routing still independent"}</td></tr>;
   }))}
  </tbody></table></div>
  <p className="p55-note"><strong>Release gate:</strong> MR0003 LSE-504-001 is an Ex sounder, not proof of Ex IP phone quantity. DTRS MGW UHF-4 includes feeder and connectors once; HYTERA UHF-1 BDA excluded. MR0004 upper deck RACON remains separate system. B1–B14 / C1–C2 complete sell-price reconciliation has NOT been established by this comparison and must not be inferred from these subtotals.</p>
  <p className="p55-note"><strong>References:</strong> MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1 sheets 3–11; MR0001 source cost ledger; MR0002 selected working BOM; WP-system bulk derivation. No ZWP20 quantity copied into other sites by this view.</p>
 </section>;
}
