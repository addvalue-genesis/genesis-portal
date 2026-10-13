import React,{useMemo,useState} from "react";
import {VENDOR_UNIFIED_CATALOG_0553} from "./data/vendorUnifiedCatalog0553";
import HISTORICAL_VENDOR from "./data/historicalVendorEvidence0553.json";
import EXION_REFERENCE from "./data/quotes/EXION-1240515-R0.reference.json";
import EXION_LATEST from "./data/quotes/EXION-1260576-R0.current.json";
import {RF_AND_PATCH_REFERENCE_0553} from "./data/rfAndPatchReference0553";
import {MR0002_PRICE_REGISTRY_0553} from "./data/mr0002PriceRegistry0553";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {SmartFilterBar,SmartDataGroup,moduleSegment} from "../common/ui/SmartDataExplorer";
import { SUPPLIER_QUOTE_LINES_0553 } from "./data/supplierQuoteLines";
import { VENDOR_0553_SOURCES } from "./vendorEvidence";
import { buildQuotationCommercialRegister } from "../common/engineering/quotationCommercialRecord";

// Read-only quotation-to-product index. Never silently promotes a quote line into BOM.
export function VendorProductCatalog0553(){
 const [view,setView]=useState("supplier");
 const [mr,setMr]=useState("ALL");
 const [vendor,setVendor]=useState("ALL");
 const [search,setSearch]=useState("");
 const [evidenceClass,setEvidenceClass]=useState("ALL");
 const [chosenQuote,setChosenQuote]=useState("");
 const commercial=useMemo(()=>buildQuotationCommercialRegister([{id:EXION_LATEST.id,vendor:"EXION (Thailand)",quotation:EXION_LATEST.quotation,source:EXION_LATEST.source,scope:EXION_LATEST.scope,date:EXION_LATEST.date,currency:EXION_LATEST.currency,quotedTotal:EXION_LATEST.quotedTotal,status:EXION_LATEST.status,validUntil:EXION_LATEST.validUntil,terms:EXION_LATEST.terms.map(x=>x.topic+": "+x.value).join(" | ")},...SUPPLIER_QUOTE_LINES_0553,...HISTORICAL_VENDOR.quotes.map(q=>({...q,terms:q.terms,source:q.sourceUrl||q.source})),{id:EXION_REFERENCE.id,vendor:EXION_REFERENCE.vendor,quotation:EXION_REFERENCE.quotation,date:EXION_REFERENCE.date,currency:EXION_REFERENCE.currency,quotedTotal:EXION_REFERENCE.totalExVat,scope:"MR-0003 historical telephone/sounder reference",status:EXION_REFERENCE.priceState,source:EXION_REFERENCE.document,terms:EXION_REFERENCE.terms.map(x=>x.join(": ")).join(" | ")}]),[]);
 const selectedCommercial=commercial.find(q=>q.quoteId===chosenQuote);
 const catalog=VENDOR_UNIFIED_CATALOG_0553;
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
 const chooseQuote=value=>{setChosenQuote(value);if(value){const q=quoteById.get(value);if(q)setVendor(String(q.vendor).trim().toLowerCase());}};
 const rows=catalog.relationships.filter(x=>{
  if(evidenceClass!=="ALL"&&(evidenceClass==="CURRENT"?x.sourceClass!=="SUPPLIER_QUOTATION":evidenceClass==="HISTORICAL"?!String(x.sourceClass||"").includes("HISTORICAL"):evidenceClass==="DATASHEET"?!["MANUFACTURER_BROCHURE","DATASHEET_ONLY"].includes(x.sourceClass):!String(x.sourceClass||"").startsWith("WEB")))return false;
  if(view==="supplier" && vendor!=="ALL"&&x.vendorId!==vendor)return false;
  if(view==="supplier" && chosenQuote&&x.quoteId!==chosenQuote)return false;
  if(view==="quote" && !x.quoteId)return false;
  if(view==="quote" && chosenQuote&&x.quoteId!==chosenQuote)return false;
  if(view==="quote" && vendor!=="ALL"&&x.vendorId!==vendor)return false;
  if(view==="product"&&chosenQuote&&x.quoteId!==chosenQuote)return false;
  if(view==="mr"&&mr!=="ALL"&&!String(x.mr).split("/").includes(mr))return false;
  if(view==="compare"&&mr!=="ALL"&&!String(x.mr).split("/").includes(mr))return false;
  if(!search)return true;
  return [x.productKey,x.mr,x.quotation,x.sourceClass,x.referenceFrom,x.referenceDocument,x.description,productsById.get(x.productKey)?.description,suppliersById.get(x.vendorId)?.name].join(" ").toLowerCase().includes(search.toLowerCase());
 });
 const resetSearch=()=>{setView("supplier");setMr("ALL");setVendor("ALL");setSearch("");setEvidenceClass("ALL");setChosenQuote("");};
 const groups=new Map();
 const groupKey=r=>view==="quote"?(r.quoteId||"NO_QUOTE"):view==="product"?r.productKey:(view==="mr"||view==="compare")?(r.mr||"NO_MR"):r.vendorId;
 const groupLabel=(id,items)=>{
  if(view==="quote")return commercial.find(q=>q.quoteId===id)?.vendor+" · "+(commercial.find(q=>q.quoteId===id)?.quotationNo||id);
  if(view==="product")return productsById.get(id)?.partNumber||id;
  if(view==="mr"||view==="compare")return id;
  return suppliersById.get(id)?.name||id;
 };
 rows.forEach(r=>{const k=String(groupKey(r)||"UNASSIGNED");if(!groups.has(k))groups.set(k,[]);groups.get(k).push(r);});
 const grouped=[...groups.entries()].map(([id,items])=>({id,items,title:groupLabel(id,items)}))
  .sort((a,b)=>String(a.title).localeCompare(String(b.title),"en"));
 const renderVendorTable=items=><>
  {grouped.map(g=><SmartDataGroup key={g.id}
    projectId="PJ2608-0553" moduleKey={"bid.vendor.products."+view+".group."+moduleSegment(g.id)}
    title={g.title} count={g.items.length}
    defaultOpen={Boolean(search)||Boolean(chosenQuote)||grouped.length===1}>
    {renderVendorTable(g.items)}
  </SmartDataGroup>)}
  {!grouped.length&&<p role="status" className="p55-note">No matching Vendor evidence. Clear filters or broaden the keyword.</p>}
  {view==="compare"&&<p className="p55-note"><strong>Candidate comparison only:</strong> not a completed TBE/CBE. Review MR compliance and quote conditions before recommending an offer.</p>}
  <p className="p55-note"><strong>Release gate:</strong> Product selection requires MR/DTS compliance, datasheet/certification, configuration, supplier price validity and approved project decision. Historical/expired/alternative quotations never enter costing automatically.</p>
 </section>;
}
