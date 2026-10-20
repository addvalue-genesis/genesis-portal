import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {MGW_R2_COVER_20261020_0553 as cover} from "./data/mgwP26058R2Cover20261020";

const f=n=>Number.isFinite(n)?"USD "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const labels={
 B1:["SERV-1"],B2:["SERV-1"],B3:["SERV-2","SERV-4"],
 B5:["SERV-3"],B6:["SERV-5"]
};
export function MgwR2CommercialCover0553({code}){
 const lines=cover.services.filter(row=>(labels[code]||[]).includes(row.id));
 if(!lines.length)return null;
 const base="bid.budget.working.bc."+code.toLowerCase()+".mgw-r2-cover-20261020";
 return <section className="p55-panel" data-component-key={base} style={{padding:12,marginTop:12}}>
  <h4>MGW P26-058_R2 Commercial Cover — 20-Oct-2026 · Source Cost Evidence</h4>
  <p className="p55-note"><strong>Module ID:</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey={base}/>
   <strong> Quote evidence:</strong> {cover.document}. Same quote reference but updated cover dated 20-Oct-2026.
   Supplier quote change does <strong>NOT</strong> automatically revise {code} Direct Cost, Working SELL or customer release.
  </p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>MGW Service / Module ID</th><th>Supplier Scope (Cover)</th><th>Previous USD</th><th>New USD</th><th>Delta USD</th><th>Owner / Verification Gate</th></tr></thead>
   <tbody>{lines.map(row=><tr key={row.id} data-component-key={base+"."+row.id.toLowerCase()}>
    <td><strong>{row.id}</strong>
     <ComponentCopyId projectId="PJ2608-0553" componentKey={base+"."+row.id.toLowerCase()}/></td>
    <td>{row.description}</td>
    <td>{f(row.priorUSD)}</td><td><strong>{f(row.usd)}</strong></td>
    <td>{f(row.deltaUSD)}</td>
    <td><strong>{row.ownerCandidate}</strong><small>{row.scopeState} · NO COST / SELL POSTING</small></td>
   </tr>)}</tbody>
  </table></div>
  <p className="p55-note"><strong>MGW supplier commercial total:</strong> Equipment {f(cover.equipmentTotalUSD)} + service
   {f(cover.serviceTotalUSD)} = <strong>{f(cover.overallTotalUSD)}</strong>.
   The previous cover was {f(cover.priorOverallTotalUSD)}; vendor total change = <strong>{f(cover.changes.overallDeltaUSD)}</strong>.
   These are vendor USD figures, not ADDVALUE's B/C Working SELL.</p>
  {code==="B3"&&<p className="p55-note"><strong>FAT distinction:</strong> Vendor iFAT {cover.FAT.internalFatDays} days /
   {f(cover.FAT.internalFatUSD)} is separate from the end-user FAT premises minimum
   {cover.FAT.facilityEndUserDaysMinimum} days / {f(cover.FAT.facilityEndUserUSD)}.
   ADDVALUE currently budgets 6 FAT witness days × 2 staff in B3; the venue and attendance durations are not yet reconciled.
   Do not add the vendor FAT charges a second time to the B3 Working SELL.</p>}
  {code==="B6"&&<p className="p55-note"><strong>Freight is ALREADY INCLUDED in new vendor overall quote:</strong>
   {f(cover.freight.quotedUSD)} for Nantong → JUTAL site, recorded in SERV-5.
   Paul's earlier email USD2,500 is the same rate evidence, <strong>NOT another USD2,500</strong>.
   Cover states delivery destination "{cover.deliveryTerms.cover}", conflicting with road freight to "{cover.deliveryTerms.statedRoadFreightTo}".
   Verify delivery/risk transfer, route, Incoterm and eventual Myanmar import/duties with JUTAL/MGW before booking B6.</p>}
 </section>;
}
