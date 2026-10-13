import React from "react";
import EXION_CURRENT from "./data/quotes/EXION-1260576-R0.current.json";
import EXION_HISTORICAL from "./data/quotes/EXION-1240515-R0.reference.json";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";

// One read-only presentation of SOURCE quotation clauses.
// Quotation records and original line prices are preserved; terms never imply accepted compliance.
const getOriginal=quote=>{
 if(!quote)return null;
 if(quote.quoteId===EXION_CURRENT.id)return EXION_CURRENT;
 if(quote.quoteId===EXION_HISTORICAL.id)return EXION_HISTORICAL;
 return quote.originalQuote||null;
};
const sourceRows=original=>{
 if(!original)return [];
 const detail=original.commercialTerms?.sourceTermRecords;
 if(Array.isArray(detail)&&detail.length)return detail.map((term,index)=>({
  key:term.id||String(index),topic:term.topic||term.id||"Supplier condition",
  value:term.originalText||term.value||"NOT CAPTURED",page:term.sourcePage||term.page||null,
  comment:term.implication||null,verification:term.verification||null
 }));
 const terms=original.terms;
 if(Array.isArray(terms))return terms.map((term,index)=>({
  key:term.id||String(index),
  topic:Array.isArray(term)?term[0]:term.topic||term.title||"Supplier condition",
  value:Array.isArray(term)?term[1]:term.value||term.originalText||"NOT CAPTURED",
  page:Array.isArray(term)?null:term.page||null,comment:null,verification:null
 }));
 return [];
};
export function QuotationTermsDetail0553({quote}){
 if(!quote)return <p className="p55-note">Quotation source detail not recorded.</p>;
 const original=getOriginal(quote);
 const rows=sourceRows(original);
 const source=original?.source||original?.document||quote.source||"SOURCE DOCUMENT NOT INDEXED";
 const url=original?.sourceUrl||original?.commercialTerms?.sourceUrl||quote.sourceUrl||null;
 const raw=rows.length?null:original?.terms??quote.sourceTermsRaw??null;
 const total=Number.isFinite(original?.quotedTotal)?original.quotedTotal:
  Number.isFinite(original?.totalExVat)?original.totalExVat:
  Number.isFinite(quote.quotedTotal)?quote.quotedTotal:null;
 const currency=original?.currency||quote.currency||"UNVERIFIED";
 const status=original?.status||original?.priceState||quote.quoteStatus||"SOURCE_VERIFICATION_REQUIRED";
 return <section className="p55-panel" style={{padding:12,margin:"10px 0"}} data-component-key={"bid.vendor.products.quotation."+quote.quoteId+".conditions"}>
  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
   <strong>Quotation &amp; Commercial Conditions / เงื่อนไขใบเสนอราคา</strong>
   <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.vendor.products.quotation."+quote.quoteId+".conditions"}
    componentName={quote.quotationNo+" — Commercial Conditions"}/>
  </div>
  <p className="p55-note">
   <strong>{quote.quotationNo}</strong> · {original?.revision||quote.revision||"Revision not recorded"}
   {" · Issued: "+(original?.date||quote.date||"NOT RECORDED")}
   {" · Validity: "+(original?.validUntil||quote.validUntil||"NOT RECORDED")}
   {" · "+status}
   {total!==null&&" · Original total "+currency+" "+total.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
  </p>
  <p className="p55-note">Original source: {url?<a href={url} target="_blank" rel="noreferrer">{source}</a>:source}
   {" · Original vendor: "+(original?.vendor||quote.vendor||"NOT RECORDED")}
  </p>
  {rows.length>0?<div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Clause / Topic</th><th>Supplier original condition (recorded)</th><th>Source Page</th><th>Evidence / Interpretation</th></tr></thead>
   <tbody>{rows.map(r=><tr key={r.key}>
    <td><strong>{r.topic}</strong></td><td>{r.value}</td><td>{r.page==null?"Not indexed":"p."+r.page}</td>
    <td>{r.comment||"Original quotation condition"}{r.verification&&<small>{r.verification}</small>}</td>
   </tr>)}</tbody>
  </table></div>:
   <p className="p55-note"><strong>Recorded terms:</strong> {typeof raw==="string"?raw:raw?JSON.stringify(raw):"NOT CAPTURED — inspect original supplier quotation."}</p>}
  {Array.isArray(original?.technicalGates)&&original.technicalGates.length>0&&
   <details><summary>Engineering / Commercial Verification Points ({original.technicalGates.length})</summary>
    <ul>{original.technicalGates.map((gate,i)=><li key={i}>{gate}</li>)}</ul>
   </details>}
  <p className="p55-note">Conditions are source evidence, not approved exceptions or project release.
   Prices, currencies, expiry dates, product lines and commercial scope are not automatically adopted into Budgetary 10.</p>
 </section>;
}
