import React,{useMemo,useState} from "react";
import {assessVendorEvidenceForBudget0553} from "./data/vendorExternalEvidence0553";
import {RF_AND_PATCH_REFERENCE_0553} from "./data/rfAndPatchReference0553";
import {MR0002_PRICE_REGISTRY_0553} from "./data/mr0002PriceRegistry0553";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
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
  <p><ComponentCopyId projectId="PJ2608-0553" componentKey="bid.vendor.products"/></p>
  <p><strong>Active View Module</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.vendor.products."+view}/></p>
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
   <h3>{selectedCommercial.vendor} — {selectedCommercial.quotationNo}</h3><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.vendor.products.quotation."+selectedCommercial.quoteId}/>
   <p><strong>Original terms (working transcription):</strong> {selectedCommercial.sourceTermsRaw||"NOT CAPTURED — verify original"}</p>
   <p><strong>Source:</strong> {selectedCommercial.sourceUrl?<a href={selectedCommercial.sourceUrl} target="_blank" rel="noreferrer">Open source document</a>:selectedCommercial.source||"NOT CAPTURED"}</p>
   <p>Scope: {selectedCommercial.scope||"OPEN"} · Currency: {selectedCommercial.currency||"OPEN"} · Valid until: {selectedCommercial.validUntil||"NOT RECORDED"} · Quote status: {selectedCommercial.quoteStatus}</p>
   <p><strong>Commercial verification:</strong> {selectedCommercial.verification}. Delivery, incoterm, payment, warranty, taxes, exclusions, freight and certifications must be verified against the original PDF before project-cost adoption.</p>
   {selectedCommercial.originalQuote?.commercialTerms&&<section className="p55-panel" data-component-key="bid.vendor.products.quotation.NG-260916" style={{padding:14}}>
     <h4>Next G · Complete Original Quotation Conditions / เงื่อนไขต้นฉบับ</h4>
     <p><strong>Supplier:</strong> {selectedCommercial.originalQuote.commercialTerms.supplier.name} · {selectedCommercial.originalQuote.commercialTerms.supplier.address} · Tax ID {selectedCommercial.originalQuote.commercialTerms.supplier.taxId}</p>
     <p><strong>Customer:</strong> {selectedCommercial.originalQuote.commercialTerms.customer.name} · {selectedCommercial.originalQuote.commercialTerms.customer.address}</p>
     <p><strong>Quoted system:</strong> {selectedCommercial.originalQuote.commercialTerms.quotationHeading.scope} · USD {selectedCommercial.originalQuote.commercialTerms.quotationHeading.grandTotal.toLocaleString("en-US",{minimumFractionDigits:2})} · {selectedCommercial.originalQuote.commercialTerms.quotationHeading.originalBOQLineCount} original BOQ lines</p>
     <p><a href={selectedCommercial.originalQuote.commercialTerms.sourceUrl} target="_blank" rel="noreferrer">Original supplier PDF</a> · <a href={selectedCommercial.originalQuote.commercialTerms.rfqFolder} target="_blank" rel="noreferrer">Client RFQ/TC folder</a></p>
     <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Clause ID / Topic</th><th>Original supplier text</th><th>Recorded meaning</th><th>RFQ / TC comparison and action</th></tr></thead><tbody>
      {selectedCommercial.originalQuote.commercialTerms.sourceTermRecords.map(t=><tr key={t.id}><td><strong>{t.id}</strong><small>{t.topic}</small></td><td>{t.originalText}</td><td>{t.value}</td><td>{t.implication}<small>{t.verification}</small></td></tr>)}
     </tbody></table></div>
     <h4>Not explicitly committed in the supplier quotation — clarification register</h4>
     <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Subject</th><th>Evidence classification</th><th>Question / control</th></tr></thead><tbody>
      {selectedCommercial.originalQuote.commercialTerms.sourceNotStated.map(t=><tr key={t.topic}><td>{t.topic}</td><td>{t.state}</td><td>{t.note}</td></tr>)}
     </tbody></table></div>
     <p className="p55-note"><strong>Preservation rule:</strong> Original 53 BOQ lines, quoted currency, source null/dashes and original supplier terms are retained. These terms are separate from RFQ requirements, technical acceptance, site allocation and customer pricing; no silent override.</p>
    </section>}
   <p className="p55-note">This is a read-only quotation-header view. Original quote lines and cost calculations have not changed.</p>
  </div>}
  <details className="p55-panel" open data-component-key="bid.vendor.products.external-evidence" style={{padding:14,marginBottom:12}}>
   <summary><strong>Unified External / Historical Vendor Evidence → Budgetary 10 impact</strong></summary>
   <p className="p55-note">Only registry evidence. Web price, ERP history and supplier quotations remain separate classes; none automatically overwrites existing budgeting or an issued customer price.</p>
   <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Source / Module</th><th>Product / Function</th><th>Quoted unit price</th><th>Document</th><th>Budgetary 10 gate / status</th></tr></thead><tbody>
    {assessVendorEvidenceForBudget0553().rows.map(e=><tr key={e.id}>
     <td>{e.supplier}<small>{e.sourceClass}</small><small>{e.module}</small></td>
     <td><strong>{e.sku}</strong><small>{e.description}</small><small>{e.technicalState}</small></td>
     <td>{Number.isFinite(e.unitPrice)?e.currency+" "+e.unitPrice.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})+" / "+(e.unit||"UNVERIFIED UOM"):"PRICE NOT VERIFIED"}<small>VAT: {e.vat||"N/A"} · {e.checkedDate||"Historical"}</small></td>
     <td>{e.url?<a href={e.url} target="_blank" rel="noreferrer">Source page</a>:e.reference}<small>{e.reference||""}</small></td>
     <td><strong>{e.budgetaryRateStatus}</strong><small>{e.budgetDependency}</small></td>
    </tr>)}
   </tbody></table></div>
  </details>
  <div className="p55-panel" style={{marginBottom:12,padding:14}}>
  <h3>Online Retail Price Evidence — separate from supplier quotations</h3>
  <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.vendor.products.price-reference.weidmuller-1963600000"/>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Retail Supplier</th><th>Manufacturer / Product</th><th>Unit Rate (THB, ex VAT)</th><th>Evidence</th><th>Cost Owner</th></tr></thead><tbody><tr>
   <td>RS Thailand</td><td>Weidmüller IE-PS-RJ45-FH-BK / Order No. 1963600000</td><td>1,176.68 per pc (indicative)</td>
   <td><a href="https://th.rs-online.com/web/p/ethernet-couplers/7417317" target="_blank" rel="noreferrer">RS item 7417317</a><small>Retail evidence only; quantity-break price and availability subject to supplier confirmation</small></td>
   <td>ZWP20 DATO-507-001 Row 8; included once in working budget; not additional Row 11 cost</td>
  </tr></tbody></table></div></div>
  <div className="p55-panel" style={{padding:14,marginBottom:12}}>
  <h3>Historical Procurement · CAT6A Patch Cord &amp; RF Interface</h3><p><strong>RF Budgetary Web Price Evidence:</strong> L4TNM-PSA N-Male <a href={RF_AND_PATCH_REFERENCE_0553.webRFPrices.connector.source} target="_blank" rel="noreferrer">RF Parts</a> THB {RF_AND_PATCH_REFERENCE_0553.webRFPrices.connector.thbBudget}/pc; SG12-12B2U grounding <a href={RF_AND_PATCH_REFERENCE_0553.webRFPrices.grounding.source} target="_blank" rel="noreferrer">RF Parts</a> THB {RF_AND_PATCH_REFERENCE_0553.webRFPrices.grounding.thbBudget}/kit; 3M 2228 <a href={RF_AND_PATCH_REFERENCE_0553.webRFPrices.weatherproof.source} target="_blank" rel="noreferrer">element14</a> THB {RF_AND_PATCH_REFERENCE_0553.webRFPrices.weatherproof.thbBudget}/roll. Converted USD quotes at planning FX 33.54, excluding imported delivery/taxes. Do not duplicate weatherproofing included with SG12-12B2U. Feeder ERP unit not verified.</p><ComponentCopyId projectId="PJ2608-0553" componentKey="bid.vendor.products.rf-bulk-web-price-evidence"/>
  <p><strong>Selected internal Budgetary Price Reference — BISMON</strong> · CommScope 1933882-4 / web part NPC6ASZDB-BL0000 · Cat6A F/UTP shielded 4ft (1.22m), THB {RF_AND_PATCH_REFERENCE_0553.cat6PatchBismon.unitRateTHB}/pc as web-displayed price. <a href={RF_AND_PATCH_REFERENCE_0553.cat6PatchBismon.sourceUrl} target="_blank" rel="noreferrer">View vendor page</a>. Pricing VAT status requires reconfirmation. F/UTP 1.22m is not identical to the historical S/FTP exact 1m SKU; check acceptance before cost posting.</p>
  <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.vendor.products.budgetary-reference.bismon-cat6a-4ft"/>
  <p><strong>CommScope LDF4RK-50A (1/2-inch RF Feeder)</strong> — Dolibarr cost THB {RF_AND_PATCH_REFERENCE_0553.rfFeederHistorical.dolibarrCostTHB}; weighted average THB {RF_AND_PATCH_REFERENCE_0553.rfFeederHistorical.weightedAverageTHB}; best buying THB {RF_AND_PATCH_REFERENCE_0553.rfFeederHistorical.bestBuyingTHB} (CSS Thai). Royaltec supplier record THB 631; purchase reference PO2402-0816. Unit of measure must be checked in ERP before applying a per-meter cost. Not selected Z1F RF cable yet.</p>
  <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.vendor.products.historical-procurement.commscope-ldf4rk-50a"/>
  <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.vendor.products.historical-procurement.rf-and-cat6a"/>
  <p>CommScope NETCONNECT Cat6A S/FTP LSZH 1m blue · SKU CSS BL001M · Supplier CSS Thai · AGERP PO2406-0845 · THB {RF_AND_PATCH_REFERENCE_0553.cat6Patch.historicalUnitRateTHB}/pc (ex VAT) · historical purchase reference, not current offer. Quantity follows indoor port/patch map.</p>
  <p><strong>Additional 2m CAT6A patch cord:</strong> {RF_AND_PATCH_REFERENCE_0553.cat6Patch2m.product} · Yellow, S/FTP LSZH · CSS Thai historical ERP best buying THB {RF_AND_PATCH_REFERENCE_0553.cat6Patch2m.historicalERPBestBuyingTHB}/pc ex VAT, applied from 15-Feb-2020. Length and quantity must follow indoor patch schedule; not additive to 1m version.</p><ComponentCopyId projectId="PJ2608-0553" componentKey="bid.vendor.products.historical-procurement.commscope-npc6aszdb-yl002m"/>
  <p>RF jumper: factory included in selected ODU supply per management confirmation. Field-terminated RF feeder connector: select part number and quantity only after matching cable type, RF ports and installation condition.</p>
  </div>
  {dataSheetProducts.length>0&&<div className="p55-panel" style={{marginBottom:14,padding:14}}>
    <h3>Product Datasheets (no quotation recorded)</h3><ComponentCopyId projectId="PJ2608-0553" componentKey="bid.vendor.products.datasheets"/>
    <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Supplier / Source</th><th>Product / Model</th><th>MR</th><th>Datasheet</th><th>Unit Price</th></tr></thead><tbody>
     {dataSheetProducts.map(x=><tr key={x.id}><td>{x.supplier}</td><td>{x.partNumber}<div>{x.description}</div><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.vendor.products.datasheet."+x.id}/></td><td>{x.mr}</td><td><a href={x.url} target="_blank" rel="noreferrer">Open original</a></td><td></td></tr>)}
    </tbody></table></div><p className="p55-note">Product Datasheet = manufacturer evidence; Project DTS = client requirement. Compare the two in TBE before selecting a product. Blank price is not zero.</p>
   </div>}
  <p><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.vendor.products."+view+".quote-lines"}/></p>
  <p className="p55-note">{catalog.relationships.length} source quotation lines · {rows.length} displayed (max 150). Quote-line identity is retained; duplicate SKUs across suppliers are not merged into costs.</p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr>
   <th>Supplier</th><th>Product / Model</th><th>MR</th><th>Quotation</th><th>Qty / Unit Rate</th><th>Project Selection</th>
  </tr></thead><tbody>{rows.map(r=>{
    const p=productsById.get(r.productKey);
    return <tr key={r.id}><td>{suppliersById.get(r.vendorId)?.name}</td><td><strong>{p?.partNumber||"UNIDENTIFIED"}</strong><div>{p?.description}</div><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.vendor.products.quote-line."+r.id}/></td><td>{r.mr}</td>
    <td><button type="button" className="p553-detail-button" onClick={()=>{setView("quote");setVendor(r.vendorId);setChosenQuote(r.quoteId);}}>{r.quotation}</button><div style={{fontSize:12}}>{r.priceStatus}</div></td><td>{r.quantity??"OPEN"} / {r.unitPrice??"OPEN"} {r.currency}</td><td>UNREVIEWED / NOT IN BOM</td></tr>
   })}</tbody></table></div>
  {view==="compare"&&<p className="p55-note"><strong>Candidate comparison only:</strong> not a completed TBE/CBE. Review MR compliance and quote conditions before recommending an offer.</p>}
  <p className="p55-note"><strong>Release gate:</strong> Product selection requires MR/DTS compliance, datasheet/certification, configuration, supplier price validity and approved project decision. Historical/expired/alternative quotations never enter costing automatically.</p>
 </section>;
}
