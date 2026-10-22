import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectB11MinimumTools0553} from "./data/b11MinimumTools0553";
import {selectB3SiteMrSatCoverage0553} from "./data/b3SiteMrSatCoverage0553";

const THB=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const MODULE="bid.budget.working.bc.b11.operational-tools-trace";

// B1/B2/B3/B9/B11 contract-to-tool trace, not another cost ledger or quote.
export function B11OperationalToolsTrace0553({workingRow}){
 if(workingRow?.code!=="B11")return null;
 const tools=selectB11MinimumTools0553(),sat=selectB3SiteMrSatCoverage0553();
 if(tools.rows.length!==5||sat.rows.length!==21||
  workingRow.workingSellTHB!==128314.11||workingRow.directCostTHB!==null)
  throw Error("B11 operational tool trace must keep selected source and no verified Direct Cost");
 const tests=mr=>sat.rows.filter(x=>x.mr===mr.replace("-","")&&x.id.startsWith("SAT-"));
 return <section className="p55-panel" data-component-key={MODULE} style={{padding:12,marginTop:12}}>
  <div className="p55-eyebrow">10.2 B11 — HANDOVER TOOL &amp; SOFTWARE REQUIREMENTS · B1/B2/B3/B9 CROSSWALK</div>
  <h4>B11 — Customer-Retained Special Tools, not ADDVALUE temporary SAT instruments</h4>
  <p className="p55-note"><strong>Contract identity:</strong> B1 engineering/configuration defines the functional requirement and TAG;
   B2 VDRL/document control requests and records OEM manuals, licences, configuration and as-built deliverables;
   B3 SAT demonstrates/uses test instruments to witness functionality;
   B9 is senior specialist assistance at JUTAL Zhuhai only upon call-out;
   <strong> B11 supplies the permanent configuration/O&amp;M tool/software/license to PURCHASER where contractually required.</strong>
   These activities may reference each other but must not be billed twice.</p>
  <div className="p55-metric-grid">
   <div><strong>Selected B11 Working SELL</strong><p>{THB(workingRow.workingSellTHB)}</p>
    <small>Rev08 category budget only; 5 source requirements do NOT get invented individual prices</small></div>
   <div><strong>EXA-A8 Source Requirements</strong><p>{tools.rows.length}</p>
    <small>4 original Rev08 priced source lines; shared/included tooling credit OPEN</small></div>
   <div><strong>Current Verified OEM Tool COST</strong><p>NOT ESTABLISHED</p>
    <small>Check OEM deliverable SKUs, Qty, licence rights and Part A inclusions</small></div>
  </div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1250}}>
   <thead><tr><th>Source Item / TAG</th><th>Permanent O&amp;M Tool / Software / License</th>
    <th>B1 Technical Basis → B2 Document Handover</th><th>B3 SAT Test-ID Links</th>
    <th>B9 vs B11 Cost Owner</th><th>Customer Tool Unit Price / Cost Gate</th></tr></thead>
   <tbody>{tools.rows.map(x=><tr key={x.id} data-component-key={MODULE+"."+x.id.toLowerCase()}>
    <td><strong>{x.id}</strong><small>{x.mr} / {x.tag}</small>
     <ComponentCopyId projectId="PJ2608-0553" componentKey={MODULE+"."+x.id.toLowerCase()}/></td>
    <td><strong>{x.description}</strong><small>{x.qty} {x.unit} requirement; OEM SKU and inclusion unverified</small></td>
    <td>B1: validate selected functional architecture / OEM integration and TAG.
     <small>B2: register OEM licence entitlement / configuration / operating manual / signed as-left record in VDRL; exact document IDs and submission quantities to verify</small></td>
    <td>{tests(x.mr).map(t=><small key={t.id}>{t.id}: {t.system}</small>)}
     <small>B3 executes temporary SAT testing; tool needs post-handover ownership proof</small></td>
    <td><strong>B11 = delivered customer asset</strong>
     <small>B9 = conditional specialist personnel; no equipment purchases from B9</small></td>
    <td><strong>NOT ALLOCATED</strong>
     <small>{x.compatibilityGate}</small><small>Vendor quoted/included vs extra: OPEN</small></td>
   </tr>)}</tbody>
   <tfoot><tr><th colSpan={5}>B11 category Selected Working SELL (not five additional charge lines)</th>
    <th>{THB(workingRow.workingSellTHB)} / Direct COST NOT ESTABLISHED</th></tr></tfoot>
  </table></div>
  <p className="p55-note"><strong>Authority:</strong> {tools.source} ·
   {" "}<a href={tools.url} target="_blank" rel="noreferrer">Original EXA-A8 supplier special tools requirements</a>.
   Particular MR0002 TETRA-gateway applicability needs written decision because selected radio is DMR/RFI BDA.
   MGW-included RACON programming accessories require actual OEM SKU, quantity and entitlement verification;
   do not charge twice in Part A and B11. B3 VeEX 30 rental-days is a contractor-use temporary test tool, not a purchaser handover asset.</p>
 </section>;
}
