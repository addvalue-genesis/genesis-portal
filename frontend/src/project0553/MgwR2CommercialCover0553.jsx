import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {MGW_R2_COVER_20261020_0553 as cover} from "./data/mgwP26058R2Cover20261020";
import {MGW_ROAD_FREIGHT_PACKING_EVIDENCE_0553 as deliveryEvidence} from "./data/mgwRoadFreightPackingEvidence0553";

const f=n=>Number.isFinite(n)?"USD "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const labels={
 B1:["SERV-1"],B2:["SERV-1"],B3:["SERV-2","SERV-4"],
 B5:["SERV-3"],B6:["SERV-5"]
};
export function MgwR2CommercialCover0553({code,purchasedWorkingSell=null}){
 const lines=cover.services.filter(row=>(labels[code]||[]).includes(row.id));
 if(!lines.length)return null;
 const base="bid.budget.working.bc."+code.toLowerCase()+".mgw-r2-cover-20261020";
 return <section className="p55-panel" data-component-key={base} style={{padding:12,marginTop:12}}>
  <h4>MGW P26-058_R2 Commercial Cover — 20-Oct-2026 · Source Cost Evidence</h4>
  <p className="p55-note"><strong>Module ID:</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey={base}/>
   <strong> Quote evidence:</strong> {cover.document}. Same quote reference but updated cover dated 20-Oct-2026.
   Supplier source evidence does <strong>NOT</strong> establish paid Direct Cost or Customer Release. {code==="B3"?"Management selected SERV-2/4 purchased price with 20% SAMTEL + 5% ADDVALUE + 5% reserve into current WS-B3 only.":"Do not infer a price update for other cost owners."}
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
  {["B5","B6"].includes(code)&&<section className="p55-panel"
   data-component-key={deliveryEvidence.moduleIds[code]} style={{marginTop:10,padding:10}}>
   <h4>MGW WhatsApp — Nantong → Zhuhai JUTAL / USD 2,500 INCLUDING PACKING</h4>
   <p className="p55-note"><strong>Module ID:</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey={deliveryEvidence.moduleIds[code]}/>
    <strong> Supplier message:</strong> "{deliveryEvidence.originalStatements[0]}" · "{deliveryEvidence.originalStatements[1]}".
    Navigation image identifies destination {deliveryEvidence.mapDestinationCompanyChinese} ({deliveryEvidence.destinationWorkingInterpretation}).
   </p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>MGW 20-Oct Cover</th><th>Vendor USD</th><th>Latest WhatsApp confirmation</th><th>Price / Owner action</th></tr></thead>
    <tbody>
     <tr><td>SERV-3 — Packing, marking and preparation</td><td><strong>{f(deliveryEvidence.coverPackingUSD)}</strong></td>
      <td><strong>Potential overlapping packing scope</strong> (not proved duplicate)</td>
      <td>B5 — do not deduct until MGW identifies whether this is distinct export packaging/marking</td></tr>
     <tr><td>SERV-5 — Nantong to JUTAL road freight</td><td><strong>{f(deliveryEvidence.coverFreightUSD)}</strong></td>
      <td><strong>MGW confirms road transportation includes packing</strong></td>
      <td>B6 — rate already included once in the latest supplier quote, NOT an additional charge</td></tr>
    </tbody>
   </table></div>
   <p className="p55-note"><strong>Potential overlap:</strong> {f(deliveryEvidence.possibleOverlapUSD)} (USD500 cover packing).
    <strong> Confirmed deduction: NOT ESTABLISHED.</strong> Supplier quotation stays {f(deliveryEvidence.vendorQuoteTotalUSD)}.
    Price correction / Working SELL changes prohibited until supplier reissues commercial scope.</p>
   <p className="p55-note"><strong>Road route:</strong> screenshot approximately {deliveryEvidence.navigationMap.routeDistanceKmIndicative.toLocaleString("en-US")} km /
    {deliveryEvidence.navigationMap.drivingTimeDisplay}. This is consumer navigation evidence, not certified truck transit time or vehicle tariff.
    Cover still says "{cover.deliveryTerms.cover}"; named delivery term to JUTAL Zhuhai requires written confirmation.</p>
  </section>}
  {code==="B3"&&<p className="p55-note"><strong>FAT distinction:</strong> Vendor iFAT {cover.FAT.internalFatDays} days /
   {f(cover.FAT.internalFatUSD)} is separate from the end-user FAT premises minimum
   {cover.FAT.facilityEndUserDaysMinimum} days / {f(cover.FAT.facilityEndUserUSD)}.
   ADDVALUE currently budgets 6 FAT witness days × 2 staff in B3; the venue and attendance durations are not yet reconciled.
   The SERV-2/4 source quote USD7,500 is purchased into current WS-B3 with 20+5+5 ONCE; do not add the USD amount or charge again in Part A, B5/B6 or B9.</p>}
  {code==="B6"&&<p className="p55-note"><strong>Freight is ALREADY INCLUDED in new vendor overall quote:</strong>
   {f(cover.freight.quotedUSD)} for Nantong → JUTAL site, recorded in SERV-5.
   Paul's earlier email USD2,500 is the same rate evidence, <strong>NOT another USD2,500</strong>.
   Cover states delivery destination "{cover.deliveryTerms.cover}", conflicting with road freight to "{cover.deliveryTerms.statedRoadFreightTo}".
   Verify delivery/risk transfer, route, Incoterm and eventual Myanmar import/duties with JUTAL/MGW before booking B6.</p>}
 </section>;
}
