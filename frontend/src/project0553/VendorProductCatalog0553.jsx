import React,{useMemo,useState} from "react";
import {VENDOR_UNIFIED_CATALOG_0553} from "./data/vendorUnifiedCatalog0553";
import {canonicalCompanyId0553,resolveCompany0553} from "./data/companyIdentity0553";
import HISTORICAL_VENDOR from "./data/historicalVendorEvidence0553.json";
import EXION_REFERENCE from "./data/quotes/EXION-1240515-R0.reference.json";
import EXION_LATEST from "./data/quotes/EXION-1260576-R0.current.json";
import {RF_AND_PATCH_REFERENCE_0553} from "./data/rfAndPatchReference0553";
import {MR0002_PRICE_REGISTRY_0553} from "./data/mr0002PriceRegistry0553";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {SmartFilterBar,SmartDataGroup,moduleSegment} from "../common/ui/SmartDataExplorer";
import { SUPPLIER_QUOTE_LINES_0553 } from "./data/supplierQuoteLines";
import { buildQuotationCommercialRegister } from "../common/engineering/quotationCommercialRecord";

// Read-only quotation-to-product index. Never silently promotes a quote line into BOM.
export function VendorProductCatalog0553(){
 const [view,setView]=useState("supplier");
 const [mr,setMr]=useState("ALL");
 const [vendor,setVendor]=useState("ALL");
 const [companyQuery,setCompanyQuery]=useState("");
 const [search,setSearch]=useState("");
 const [evidenceClass,setEvidenceClass]=useState("ALL");
 const [chosenQuote,setChosenQuote]=useState("");
 const commercial=useMemo(()=>buildQuotationCommercialRegister([{id:EXION_LATEST.id,vendor:"EXION (Thailand)",quotation:EXION_LATEST.quotation,source:EXION_LATEST.source,scope:EXION_LATEST.scope,date:EXION_LATEST.date,currency:EXION_LATEST.currency,quotedTotal:EXION_LATEST.quotedTotal,status:EXION_LATEST.status,validUntil:EXION_LATEST.validUntil,terms:EXION_LATEST.terms.map(x=>x.topic+": "+x.value).join(" | ")},...SUPPLIER_QUOTE_LINES_0553,...HISTORICAL_VENDOR.quotes.map(q=>({...q,terms:q.terms,source:q.sourceUrl||q.source})),{id:EXION_REFERENCE.id,vendor:EXION_REFERENCE.vendor,quotation:EXION_REFERENCE.quotation,date:EXION_REFERENCE.date,currency:EXION_REFERENCE.currency,quotedTotal:EXION_REFERENCE.totalExVat,scope:"MR-0003 historical telephone/sounder reference",status:EXION_REFERENCE.priceState,source:EXION_REFERENCE.document,terms:EXION_REFERENCE.terms.map(x=>x.join(": ")).join(" | ")}]),[]);
 const selectedCommercial=commercial.find(q=>q.quoteId===chosenQuote);
 const catalog=VENDOR_UNIFIED_CATALOG_0553;
 const suppliersById=new Map(catalog.suppliers.map(v=>[v.id,v]));
 const productsById=new Map(catalog.products.map(p=>[p.id,p]));
 const quoteById=new Map(commercial.map(q=>[q.quoteId,q]));
 const companyCollator=new Intl.Collator("en",{sensitivity:"base",numeric:true});
 const sortedSuppliers=[...catalog.suppliers].sort((a,b)=>companyCollator.compare(a.name,b.name));
 const matchingSuppliers=sortedSuppliers.filter(company=>[company.name,...(company.aliases||[]),...(company.sourceSupplierLabels||[])].join(" ").toLocaleLowerCase().includes(companyQuery.trim().toLocaleLowerCase()));
 const sortedQuotes=[...commercial].sort((a,b)=>companyCollator.compare(resolveCompany0553(a.vendor).name,resolveCompany0553(b.vendor).name)||companyCollator.compare(a.quotationNo||"",b.quotationNo||""));
 const allowedQuotes=sortedQuotes.filter(q=>(vendor==="ALL"||canonicalCompanyId0553(q.vendor)===vendor)&&(!companyQuery||matchingSuppliers.some(s=>s.id===canonicalCompanyId0553(q.vendor))));
 const chooseVendor=value=>{setVendor(value);setChosenQuote("");};
 const chooseQuote=value=>{setChosenQuote(value);if(value){const q=quoteById.get(value);if(q)setVendor(canonicalCompanyId0553(q.vendor));}};
 const rows=catalog.relationships.filter(x=>{
  if(evidenceClass!=="ALL"&&(evidenceClass==="CURRENT"?x.sourceClass!=="SUPPLIER_QUOTATION":evidenceClass==="HISTORICAL"?!String(x.sourceClass||"").includes("HISTORICAL"):evidenceClass==="DATASHEET"?!["MANUFACTURER_BROCHURE","DATASHEET_ONLY"].includes(x.sourceClass):!String(x.sourceClass||"").startsWith("WEB")))return false;
  if((view==="supplier"||view==="quote")&&companyQuery.trim()){
   const selected=suppliersById.get(x.vendorId);
   const source=[selected?.name,...(selected?.aliases||[]),...(selected?.sourceSupplierLabels||[])].join(" ").toLocaleLowerCase();
   if(!source.includes(companyQuery.trim().toLocaleLowerCase()))return false;
  }
  if(view==="supplier" && vendor!=="ALL"&&x.vendorId!==vendor)return false;
  if(view==="supplier" && chosenQuote&&x.quoteId!==chosenQuote)return false;
  if(view==="quote" && !x.quoteId)return false;
  if(view==="quote" && chosenQuote&&x.quoteId!==chosenQuote)return false;
  if(view==="quote" && vendor!=="ALL"&&x.vendorId!==vendor)return false;
  if(view==="product"&&chosenQuote&&x.quoteId!==chosenQuote)return false;
  if(view==="mr"&&mr!=="ALL"&&!String(x.mr).split("/").includes(mr))return false;
  if(view==="compare"&&mr!=="ALL"&&!String(x.mr).split("/").includes(mr))return false;
  if(!search)return true;
  return [x.productKey,x.mr,x.quotation,x.sourceClass,x.referenceFrom,x.referenceDocument,x.description,productsById.get(x.productKey)?.description,x.sourceSupplierLabel,x.sourceThirdParty,x.sourceSupplierRole,suppliersById.get(x.vendorId)?.name,...(suppliersById.get(x.vendorId)?.aliases||[])].join(" ").toLowerCase().includes(search.toLowerCase());
 });
 const resetSearch=()=>{setView("supplier");setMr("ALL");setVendor("ALL");setCompanyQuery("");setSearch("");setEvidenceClass("ALL");setChosenQuote("");};
 const groups=new Map();
 const groupKey=r=>view==="quote"?(r.quoteId||"NO_QUOTE"):view==="product"?r.productKey:(view==="mr"||view==="compare")?(r.mr||"NO_MR"):r.vendorId;
 const groupLabel=id=>{
  if(view==="quote"){const item=commercial.find(q=>q.quoteId===id);return item?resolveCompany0553(item.vendor).name+" · "+item.quotationNo:id;}
  if(view==="product")return productsById.get(id)?.partNumber||id;
  if(view==="mr"||view==="compare")return id;
  return suppliersById.get(id)?.name||id;
 };
 rows.forEach(r=>{const k=String(groupKey(r)||"UNASSIGNED");if(!groups.has(k))groups.set(k,[]);groups.get(k).push(r);});
 const grouped=[...groups.entries()].map(([id,items])=>({id,items,title:groupLabel(id)}))
  .sort((a,b)=>String(a.title).localeCompare(String(b.title),"en"));
 return <section className="p55-section" style={{marginTop:18}}>
  <h2>Vendor Products · Datasheets · Quotations</h2>
  <p><ComponentCopyId projectId="PJ2608-0553" componentKey="bid.vendor.products"/></p>
  <p><strong>Active View Module</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.vendor.products."+view}/></p>
  <p>แสดงเฉพาะเอกสารที่ได้รับจริง: Quotation แสดงราคาและเงื่อนไข Vendor; Datasheet ที่ไม่มีราคาให้เว้นว่าง โดยไม่มีการเพิ่มสินค้าเข้า BOM อัตโนมัติ</p>
  <SmartFilterBar moduleKey="bid.vendor.products.search" title="Company / Product / Quotation · Smart Filter"
    total={catalog.relationships.length} shown={rows.length} onReset={resetSearch}
    description="Search known companies, manufacturers, part numbers, functions, MR and historical quotations; matches do not imply AVL approval."
    controls={[
     {key:"view",label:"View / Group By",type:"select",value:view,onChange:value=>{setView(value);setVendor("ALL");setCompanyQuery("");setChosenQuote("");setMr("ALL");},
       options:[{value:"supplier",label:"Company / Supplier"},{value:"quote",label:"Quotation"},{value:"product",label:"Product / Model"},{value:"mr",label:"MR / System"},{value:"compare",label:"TBE / CBE Candidates"}]},
     ...(view==="supplier"||view==="quote"?[
       {key:"companyQuery",label:"Type company / ค้นหาบริษัท (A–Z)",type:"search",value:companyQuery,
        onChange:value=>{setCompanyQuery(value);setVendor("ALL");setChosenQuote("");},
        placeholder:"CSS, EXION, MGW, RS, CommScope"},
       {key:"vendor",label:"Supplier (alphabetical)",type:"select",value:vendor,onChange:chooseVendor,
        options:[{value:"ALL",label:"All suppliers ("+matchingSuppliers.length+" / "+sortedSuppliers.length+")"},
        ...matchingSuppliers.map(v=>({value:v.id,label:v.name}))]}
     ]:[]),
     ...(view==="mr"||view==="compare"?[{key:"mr",label:"MR / System",type:"select",value:mr,onChange:setMr,
       options:[{value:"ALL",label:"All MR Systems"},...["MR-0001","MR-0002","MR-0003","MR-0004"].map(v=>({value:v,label:v}))]}]:[]),
     {key:"evidence",label:"Evidence class",type:"select",value:evidenceClass,onChange:setEvidenceClass,
       options:[{value:"ALL",label:"All evidence"},{value:"CURRENT",label:"Supplier quotations"},{value:"HISTORICAL",label:"Historical / ERP"},{value:"WEB",label:"Web references"},{value:"DATASHEET",label:"Manufacturer datasheets"}]},
     {key:"search",label:"Search (Company / Product / Source)",type:"search",value:search,onChange:setSearch,placeholder:"e.g. EXION, CommScope, Zone 2, 1260576"}
    ]}/>
  {(view==="supplier"||view==="quote")&&<div className="p55-filterbar">
    <label>Quotation &amp; commercial conditions <select value={chosenQuote} onChange={e=>chooseQuote(e.target.value)}>
     <option value="">All quotations / Select to inspect</option>
     {allowedQuotes.map(q=><option key={q.quoteId} value={q.quoteId}>{resolveCompany0553(q.vendor).name} · {q.quotationNo}</option>)}
    </select></label>
    <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.vendor.products.quotation-selector"/>
  </div>}
  {(view==="supplier"||view==="quote")&&selectedCommercial&&<div className="p55-panel" style={{padding:14,marginBottom:12}}>
   <h3>{resolveCompany0553(selectedCommercial.vendor).name} — {selectedCommercial.quotationNo}</h3><p className="p55-note">Original source supplier label: {selectedCommercial.vendor}</p><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.vendor.products.quotation."+selectedCommercial.quoteId}/>
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
  <p><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.vendor.products."+view+".quote-lines"}/></p>
  <p className="p55-note">{catalog.relationships.length} supplier quote lines and external/historical product references · {rows.length} displayed (all matching entries, no hidden 150-row cap). All evidence classes share this product table; reference records are not supplier quotations. Original source quote-line identities are preserved.</p>
  {grouped.map(g=><SmartDataGroup key={g.id}
    projectId="PJ2608-0553" moduleKey={"bid.vendor.products."+view+".group."+moduleSegment(g.id)}
    title={g.title} count={g.items.length}
    description={view==="supplier"?"Original source labels: "+(suppliersById.get(g.id)?.sourceSupplierLabels||[]).join(" · "):null}
    defaultOpen={Boolean(search)||Boolean(chosenQuote)||grouped.length===1}>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr>
   <th>Supplier / Source Class</th><th>Product / Model &amp; Function</th><th>MR</th><th>Quotation / Reference From</th><th>Qty / Unit Price / UOM</th><th>Technical / Budgetary Gate</th>
  </tr></thead><tbody>{g.items.map(r=>{
    const p=productsById.get(r.productKey);
    const isQuote=Boolean(r.quoteId);
    return <tr key={r.id}>
     <td><strong>{suppliersById.get(r.vendorId)?.name}</strong><small>Source / assignment: {r.sourceSupplierLabel}</small>{r.sourceClass==="DATASHEET_ONLY"&&<small>Relationship: {r.relationshipRole||"DATA_SOURCE_ASSOCIATION"}</small>}{r.sourceThirdParty&&<small>{r.sourceSupplierRole}: {r.sourceThirdParty}</small>}<small>{r.sourceClass||"SUPPLIER_QUOTATION"}</small></td>
     <td><strong>{p?.partNumber||"UNIDENTIFIED"}</strong><div>{r.description||p?.description}</div>{r.manufacturer&&<small>Manufacturer: {r.manufacturer}</small>}{r.manufacturerOrderNo&&<small>Order No.: {r.manufacturerOrderNo}</small>}{r.tagCandidate&&<small>Candidate TAG: {r.tagCandidate}</small>}<ComponentCopyId projectId="PJ2608-0553" componentKey={isQuote?"bid.vendor.products.quote-line."+r.id:r.sourceClass==="DATASHEET_ONLY"?"bid.vendor.products.datasheet."+r.id:"bid.vendor.products.evidence."+moduleSegment(r.id)} componentName={p?.partNumber||r.description||r.id}/></td>
     <td>{r.mr}</td>
     <td>{isQuote?<><button type="button" className="p553-detail-button" onClick={()=>{setView("quote");setVendor(r.vendorId);setChosenQuote(r.quoteId);}}>{r.quotation}</button><small>{r.priceStatus}</small></>:<><strong>Reference From</strong><small>{r.referenceFrom}</small><small>{r.referenceDocument||""}</small></>}
      {(r.sourceUrl||(!isQuote&&r.source))&&<small><a href={r.sourceUrl||r.source} target="_blank" rel="noreferrer">Open original source</a></small>}</td>
     <td>{r.quantity??"—"} / {Number.isFinite(r.unitPrice)?r.currency+" "+r.unitPrice.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT PRICED"} / {r.pricingUnit||"SOURCE UOM / REVIEW"}<small>{r.vat||""}</small></td>
     <td><strong>{r.approvedForBudget?"SOURCE ELIGIBLE / ENGINEERING CHECK":"REFERENCE_ONLY / NOT SELECTED"}</strong><small>{r.technicalCompliance||"NOT VERIFIED"}</small><small>{r.scopeDriver||""}</small>{r.relatedRetailEvidenceId&&<small>Linked retail evidence: {r.relatedRetailEvidenceId}</small>}{r.relatedBudgetBasis&&<small>Internal budget only: {r.relatedBudgetBasis}</small>}</td>
    </tr>})}</tbody></table></div>

  </SmartDataGroup>)}
  {!grouped.length&&<p role="status" className="p55-note">No matching Vendor evidence. Clear filters or broaden the search.</p>}
  {view==="compare"&&<p className="p55-note"><strong>Candidate comparison only:</strong> not a completed TBE/CBE. Review MR compliance and quote conditions before recommending an offer.</p>}
  <p className="p55-note"><strong>Release gate:</strong> Product selection requires MR/DTS compliance, datasheet/certification, configuration, supplier price validity and approved project decision. Historical/expired/alternative quotations never enter costing automatically.</p>
 </section>;
}
