import React,{useMemo,useState} from "react";
import { SUPPLIER_QUOTE_LINES_0553 } from "./data/supplierQuoteLines";
import { buildVendorProductCatalog } from "../common/engineering/vendorProductCatalog";
import { buildQuotationCommercialRegister } from "../common/engineering/quotationCommercialRecord";

// Read-only quotation-to-product index. Never silently promotes a quote line into BOM.
export function VendorProductCatalog0553(){
 const [vendor,setVendor]=useState("ALL");
 const [search,setSearch]=useState("");
 const [chosenQuote,setChosenQuote]=useState("");
 const commercial=useMemo(()=>buildQuotationCommercialRegister(SUPPLIER_QUOTE_LINES_0553),[]);
 const selectedCommercial=commercial.find(q=>q.quoteId===chosenQuote);
 const catalog=useMemo(()=>buildVendorProductCatalog(SUPPLIER_QUOTE_LINES_0553),[]);
 const rows=catalog.relationships.filter(x=>(vendor==="ALL"||x.vendorId===vendor)&&
  (!search||[x.productKey,x.mr,x.quotation,catalog.products.find(p=>p.id===x.productKey)?.description].join(" ").toLowerCase().includes(search.toLowerCase()))).slice(0,150);
 return <section className="p55-section" style={{marginTop:18}}>
  <h2>Internal Vendor–Product Catalog · Quotation Evidence</h2>
  <p>บริษัทหนึ่งมีสินค้าได้หลายรายการ และสินค้าหนึ่งรุ่นอาจมาจากหลาย Supplier ข้อมูลด้านล่างอ่านจาก quotation records เดิมของ 0553 โดยยังไม่เลือกเข้า Project BOM และไม่รับรองราคา</p>
  <div className="p55-filterbar"><label>Supplier <select value={vendor} onChange={e=>setVendor(e.target.value)}>
   <option value="ALL">All suppliers ({catalog.suppliers.length})</option>
   {catalog.suppliers.map(v=><option key={v.id} value={v.id}>{v.name} ({catalog.relationships.filter(r=>r.vendorId===v.id).length} lines)</option>)}
  </select></label><label>Model / MR / Quotation <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Model / MR / Quotation" /></label></div>
  <div className="p55-filterbar"><label>Quotation & commercial conditions <select value={chosenQuote} onChange={e=>setChosenQuote(e.target.value)}><option value="">Select quotation to inspect terms</option>{commercial.map(q=><option key={q.quoteId} value={q.quoteId}>{q.vendor} · {q.quotationNo}</option>)}</select></label></div>
  {selectedCommercial&&<div className="p55-panel" style={{padding:14,marginBottom:12}}>
   <h3>{selectedCommercial.vendor} — {selectedCommercial.quotationNo}</h3>
   <p><strong>Original terms (working transcription):</strong> {selectedCommercial.sourceTermsRaw||"NOT CAPTURED — verify original"}</p>
   <p><strong>Source:</strong> {selectedCommercial.sourceUrl?<a href={selectedCommercial.sourceUrl} target="_blank" rel="noreferrer">Open source document</a>:selectedCommercial.source||"NOT CAPTURED"}</p>
   <p>Scope: {selectedCommercial.scope||"OPEN"} · Currency: {selectedCommercial.currency||"OPEN"} · Valid until: {selectedCommercial.validUntil||"NOT RECORDED"} · Quote status: {selectedCommercial.quoteStatus}</p>
   <p><strong>Commercial verification:</strong> {selectedCommercial.verification}. Delivery, incoterm, payment, warranty, taxes, exclusions, freight and certifications must be verified against the original PDF before project-cost adoption.</p>
   <p className="p55-note">This is a read-only quotation-header view. Original quote lines and cost calculations have not changed.</p>
  </div>}
  <p className="p55-note">{catalog.relationships.length} source quotation lines · {rows.length} displayed (max 150). Quote-line identity is retained; duplicate SKUs across suppliers are not merged into costs.</p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr>
   <th>Supplier</th><th>Product / Model</th><th>MR</th><th>Quotation</th><th>Qty / Unit Rate</th><th>Project Selection</th>
  </tr></thead><tbody>{rows.map(r=>{
    const p=catalog.products.find(x=>x.id===r.productKey);
    return <tr key={r.id}><td>{catalog.suppliers.find(x=>x.id===r.vendorId)?.name}</td><td><strong>{p?.partNumber||"UNIDENTIFIED"}</strong><div>{p?.description}</div></td><td>{r.mr}</td>
    <td>{r.quotation}<div style={{fontSize:12}}>{r.priceStatus}</div></td><td>{r.quantity??"OPEN"} / {r.unitPrice??"OPEN"} {r.currency}</td><td>UNREVIEWED / NOT IN BOM</td></tr>
   })}</tbody></table></div>
  <p className="p55-note"><strong>Release gate:</strong> Product selection requires MR/DTS compliance, datasheet/certification, configuration, supplier price validity and approved project decision. Historical/expired/alternative quotations never enter costing automatically.</p>
 </section>;
}
