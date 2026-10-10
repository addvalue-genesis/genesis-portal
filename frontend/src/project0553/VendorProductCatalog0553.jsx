import React,{useMemo,useState} from "react";
import { SUPPLIER_QUOTE_LINES_0553 } from "./data/supplierQuoteLines";
import { VENDOR_0553_SOURCES } from "./vendorEvidence";
import { buildVendorProductCatalog } from "../common/engineering/vendorProductCatalog";
import { buildQuotationCommercialRegister } from "../common/engineering/quotationCommercialRecord";

// Read-only quotation-to-product index. Never silently promotes a quote line into BOM.
export function VendorProductCatalog0553(){
 const [view,setView]=useState("supplier");
 const [mr,setMr]=useState("ALL");
 const [vendor,setVendor]=useState("ALL");
 const [search,setSearch]=useState("");
 const [chosenQuote,setChosenQuote]=useState("");
 const commercial=useMemo(()=>buildQuotationCommercialRegister(SUPPLIER_QUOTE_LINES_0553),[]);
 const selectedCommercial=commercial.find(q=>q.quoteId===chosenQuote);
 const catalog=useMemo(()=>buildVendorProductCatalog(SUPPLIER_QUOTE_LINES_0553),[]);
 const suppliersById=new Map(catalog.suppliers.map(v=>[v.id,v]));
 const datasheets=VENDOR_0553_SOURCES.filter(v=>v.type==="DATASHEET_ONLY");
 const dataSheetProducts=datasheets.map(v=>({
   id:v.id,partNumber:v.document.match(/RX[0-9-]+/)?.[0]||v.document,
   description:v.document,supplier:v.supplier,mr:v.mr==="MR-0001"&&v.id==="V-RFI-LNA"?"MR-0002 (engineering mapping review)":v.mr,
   url:v.url,price:null,quotation:null,status:v.status
 }));

 const productsById=new Map(catalog.products.map(p=>[p.id,p]));
 const quoteById=new Map(commercial.map(q=>[q.quoteId,q]));
 const allowedQuotes=commercial.filter(q=>vendor==="ALL"||String(q.vendor).trim().toLowerCase()===vendor);
 const chooseVendor=value=>{setVendor(value);setChosenQuote("");};
 const chooseQuote=value=>{setChosenQuote(value);if(value&&view==="quote"){const q=quoteById.get(value);if(q)setVendor(String(q.vendor).trim().toLowerCase());}};
 const rows=catalog.relationships.filter(x=>{
  if(view==="supplier" && vendor!=="ALL"&&x.vendorId!==vendor)return false;
  if(view==="supplier" && chosenQuote&&x.quoteId!==chosenQuote)return false;
  if(view==="quote" && chosenQuote&&x.quoteId!==chosenQuote)return false;
  if(view==="product"&&chosenQuote&&x.quoteId!==chosenQuote)return false;
  if(view==="mr"&&mr!=="ALL"&&!String(x.mr).split("/").includes(mr))return false;
  if(view==="compare"&&mr!=="ALL"&&!String(x.mr).split("/").includes(mr))return false;
  if(!search)return true;
  return [x.productKey,x.mr,x.quotation,productsById.get(x.productKey)?.description,suppliersById.get(x.vendorId)?.name].join(" ").toLowerCase().includes(search.toLowerCase());
 }).slice(0,150);
 return <section className="p55-section" style={{marginTop:18}}>
  <h2>Vendor Products · Datasheets · Quotations</h2>
  <p>แสดงเฉพาะเอกสารที่ได้รับจริง: Quotation แสดงราคาและเงื่อนไข Vendor; Datasheet ที่ไม่มีราคาให้เว้นว่าง โดยไม่มีการเพิ่มสินค้าเข้า BOM อัตโนมัติ</p>
  <div className="p55-filterbar"><label>View <select value={view} onChange={e=>{setView(e.target.value);setVendor("ALL");setChosenQuote("");setMr("ALL");setSearch("");}}>
   <option value="supplier">Supplier View</option><option value="quote">Quotation View</option><option value="product">Product View</option><option value="mr">MR / System View</option><option value="compare">TBE / CBE Candidate Comparison</option>
  </select></label>
  {(view==="supplier"||view==="quote")&&<label>Supplier <select value={vendor} onChange={e=>chooseVendor(e.target.value)}>
   <option value="ALL">All suppliers ({catalog.suppliers.length})</option>
   {catalog.suppliers.map(v=><option key={v.id} value={v.id}>{v.name} ({catalog.relationships.filter(r=>r.vendorId===v.id).length} lines)</option>)}
  </select></label>}
  {(view==="mr"||view==="compare")&&<label>MR / System <select value={mr} onChange={e=>setMr(e.target.value)}><option value="ALL">All MR Systems</option>{["MR-0001","MR-0002","MR-0003","MR-0004"].map(v=><option key={v} value={v}>{v}</option>)}</select></label>}
  <label>Search Product / Model / Quote <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Model, MR, supplier, quotation" /></label></div>
  {(view==="supplier"||view==="quote")&&<div className="p55-filterbar"><label>Quotation & commercial conditions <select value={chosenQuote} onChange={e=>chooseQuote(e.target.value)}>
   <option value="">All quotations / Select to inspect</option>
   {allowedQuotes.map(q=><option key={q.quoteId} value={q.quoteId}>{q.vendor} · {q.quotationNo}</option>)}
  </select></label></div>}
  {(view==="supplier"||view==="quote")&&selectedCommercial&&<div className="p55-panel" style={{padding:14,marginBottom:12}}>
   <h3>{selectedCommercial.vendor} — {selectedCommercial.quotationNo}</h3>
   <p><strong>Original terms (working transcription):</strong> {selectedCommercial.sourceTermsRaw||"NOT CAPTURED — verify original"}</p>
   <p><strong>Source:</strong> {selectedCommercial.sourceUrl?<a href={selectedCommercial.sourceUrl} target="_blank" rel="noreferrer">Open source document</a>:selectedCommercial.source||"NOT CAPTURED"}</p>
   <p>Scope: {selectedCommercial.scope||"OPEN"} · Currency: {selectedCommercial.currency||"OPEN"} · Valid until: {selectedCommercial.validUntil||"NOT RECORDED"} · Quote status: {selectedCommercial.quoteStatus}</p>
   <p><strong>Commercial verification:</strong> {selectedCommercial.verification}. Delivery, incoterm, payment, warranty, taxes, exclusions, freight and certifications must be verified against the original PDF before project-cost adoption.</p>
   <p className="p55-note">This is a read-only quotation-header view. Original quote lines and cost calculations have not changed.</p>
  </div>}
  {dataSheetProducts.length>0&&<div className="p55-panel" style={{marginBottom:14,padding:14}}>
    <h3>Product Datasheets (no quotation recorded)</h3>
    <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Supplier / Source</th><th>Product / Model</th><th>MR</th><th>Datasheet</th><th>Unit Price</th></tr></thead><tbody>
     {dataSheetProducts.map(x=><tr key={x.id}><td>{x.supplier}</td><td>{x.partNumber}<div>{x.description}</div></td><td>{x.mr}</td><td><a href={x.url} target="_blank" rel="noreferrer">Open original</a></td><td></td></tr>)}
    </tbody></table></div><p className="p55-note">Product Datasheet = manufacturer evidence; Project DTS = client requirement. Compare the two in TBE before selecting a product. Blank price is not zero.</p>
   </div>}
  <p className="p55-note">{catalog.relationships.length} source quotation lines · {rows.length} displayed (max 150). Quote-line identity is retained; duplicate SKUs across suppliers are not merged into costs.</p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr>
   <th>Supplier</th><th>Product / Model</th><th>MR</th><th>Quotation</th><th>Qty / Unit Rate</th><th>Project Selection</th>
  </tr></thead><tbody>{rows.map(r=>{
    const p=productsById.get(r.productKey);
    return <tr key={r.id}><td>{suppliersById.get(r.vendorId)?.name}</td><td><strong>{p?.partNumber||"UNIDENTIFIED"}</strong><div>{p?.description}</div></td><td>{r.mr}</td>
    <td><button type="button" className="p553-detail-button" onClick={()=>{setView("quote");setVendor(r.vendorId);setChosenQuote(r.quoteId);}}>{r.quotation}</button><div style={{fontSize:12}}>{r.priceStatus}</div></td><td>{r.quantity??"OPEN"} / {r.unitPrice??"OPEN"} {r.currency}</td><td>UNREVIEWED / NOT IN BOM</td></tr>
   })}</tbody></table></div>
  {view==="compare"&&<p className="p55-note"><strong>Candidate comparison only:</strong> not a completed TBE/CBE. Review MR compliance and quote conditions before recommending an offer.</p>}
  <p className="p55-note"><strong>Release gate:</strong> Product selection requires MR/DTS compliance, datasheet/certification, configuration, supplier price validity and approved project decision. Historical/expired/alternative quotations never enter costing automatically.</p>
 </section>;
}
