import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {WORKING_FINANCIAL_NAMESPACES_0553 as N} from "./data/workingCostCommercialIdentity0553";

// One presentation-only financial identity matrix for every B1–B14/C1–C2 owner.
// Financial IDs never create new cost postings, proposals or technical Module IDs.
const money=v=>Number.isFinite(v)?"THB "+v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const usd=v=>Number.isFinite(v)?"USD "+v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
export function BcFinancialIdentityMatrix0553({workingRow}){
 if(!workingRow||!/^(?:B(?:[1-9]|1[0-4])|C[12])$/.test(workingRow.code))return null;
 const code=workingRow.code;
 const mgw=code==="B3"?workingRow.b3MgwPurchasedFatWorkingSell:null;
 const quoteLines=mgw?.quoteLines||[];
 const rowData=[
  {kind:N.SOW,id:"SOW-"+code,source:"Contract B/C scope",quote:null,cost:null,sell:null,
   status:workingRow.optional?"OPTION / scope only":"BASE / scope only"},
  ...quoteLines.map(q=>({kind:N.VQ,id:q.vendorQuoteId,source:q.description,
   quote:q.quotedAmountUSD,cost:q.quotedCostTHB,sell:null,
   status:"MGW 20-Oct Rev2 quotation evidence; NOT paid Direct Cost"})),
  {kind:N.IC,id:mgw?.identity||null,source:mgw?"MGW SERV-2/4 purchased quote reference":"Actual cost / cost ledger",
   quote:null,cost:null,sell:null,
   status:mgw?"Quoted purchased source THB "+mgw.vendorPurchasedQuoteTHB.toLocaleString("en-US")+"; actual invoice cost NOT VERIFIED":"Actual Direct Cost NOT ESTABLISHED; source activities do not prove payroll or invoice"},
  {kind:N.WS,id:"WS-"+code,source:"10.2 canonical selected working owner",
   quote:null,cost:null,sell:workingRow.workingSellTHB,
   status:workingRow.optional?"OPTIONAL working reference — NOT included in Part B Base":"Selected Working SELL ONCE; not actual paid cost"},
  {kind:N.CP,id:"CP-"+code,source:"10.3 Release Preview reads 10.2, no new pricing owner",
   quote:null,cost:null,sell:null,
   status:"NOT ISSUED / RELEASE HOLD — no independent customer-price posting"},
  ...(mgw?[{kind:N.SC,id:"SC-B3-FAT",source:"B3/B8 seven-day what-if",
   quote:null,cost:null,sell:null,status:"NON-POSTING alternative / no scenario release"},
   {kind:N.AU,id:"AU-B3-FAT",source:"Historical FAT and source audit",
   quote:null,cost:null,sell:null,status:"NON-POSTING evidence / no addition to Working SELL"}]:[])
 ];
 if(mgw&&(mgw.selectedIncrementalWorkingSellTHB!==307125||quoteLines.length!==2||
  quoteLines.reduce((n,q)=>n+q.quotedCostTHB,0)!==mgw.vendorPurchasedQuoteTHB))
  throw Error("B3 financial identity matrix supplier quotation/WS mismatch");
 return <section className="p55-panel" data-component-key={workingRow.moduleId+".financial-identity"}
  style={{padding:12,marginTop:12}}>
  <h4>{code} — Financial Identity / Price Authority (SOW · VQ · IC · WS · CP)</h4>
  <p className="p55-note">Contract B-code and technical Module ID remain unchanged.
   The table does not recalculate or post any cost/SELL. Missing VQ or verified IC is NOT zero.
   <ComponentCopyId projectId="PJ2608-0553" componentKey={workingRow.moduleId+".financial-identity"}/></p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Layer</th><th>Financial ID</th><th>Source / Cost Owner</th>
    <th>Vendor USD</th><th>Verified Direct Cost THB</th>
    <th>Working SELL THB</th><th>Treatment / Customer Status</th></tr></thead>
   <tbody>{rowData.map((r,i)=><tr key={r.kind+":"+(r.id||i)}>
    <td><strong>{r.kind}</strong></td><td><code>{r.id||"NOT ASSIGNED"}</code></td>
    <td>{r.source}</td><td>{usd(r.quote)}</td><td>{money(r.cost)}</td>
    <td><strong>{money(r.sell)}</strong></td><td>{r.status}</td>
   </tr>)}</tbody>
  </table></div>
  {mgw&&<p className="p55-note"><strong>MGW Purchased FAT — selected component WS THB {mgw.selectedIncrementalWorkingSellTHB.toLocaleString("en-US")}:</strong>
   source vendor USD {mgw.vendorPurchasedQuoteUSD.toLocaleString("en-US")} / quoted THB {mgw.vendorPurchasedQuoteTHB.toLocaleString("en-US")}+
   SAMTEL 20% {money(mgw.samTelMarkupTHB)} + ADDVALUE 5% {money(mgw.addvalueMarkupTHB)}+
   Omission 5% {money(mgw.omissionReserveTHB)}. These amounts are a breakdown INSIDE WS-B3,
   not an additional row to post. Ordinary Part B 5% is NOT deducted again on this purchased component.</p>}
 </section>;
}
