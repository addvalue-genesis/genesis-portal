import React,{useMemo,useState} from "react";
import { SUPPLIER_QUOTE_LINES_0553 } from "./data/supplierQuoteLines";
import { buildVendorProductCatalog } from "../common/engineering/vendorProductCatalog";

// Read-only quotation-to-product index. Never silently promotes a quote line into BOM.
export function VendorProductCatalog0553(){
 const [vendor,setVendor]=useState("ALL");
 const [search,setSearch]=useState("");
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
