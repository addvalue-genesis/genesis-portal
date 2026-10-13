// PJ2608-0553: one read-only vendor/product/source index for the supplier screen.
// Quote lines remain original evidence, while public web / historical procurement
// are separate referenced price observations, never synthetic supplier quotations.
import {SUPPLIER_QUOTE_LINES_0553} from "./supplierQuoteLines";
import {VENDOR_EXTERNAL_EVIDENCE_0553} from "./vendorExternalEvidence0553";
import HISTORICAL_VENDOR from "./historicalVendorEvidence0553.json";
import EXION_REFERENCE from "./quotes/EXION-1240515-R0.reference.json";
import EXION_LATEST from "./quotes/EXION-1260576-R0.current.json";
import KNOWLEDGE_PRODUCTS from "./vendorKnowledgeProducts0553.json";
import {buildVendorProductCatalog} from "../../common/engineering/vendorProductCatalog";
const quoted=buildVendorProductCatalog(SUPPLIER_QUOTE_LINES_0553);
const suppliers=new Map(quoted.suppliers.map(x=>[x.id,{...x,quoteIds:[...x.quoteIds]}]));
const products=new Map(quoted.products.map(x=>[x.id,{...x}]));
const relationships=quoted.relationships.map(x=>({...x,sourceClass:"SUPPLIER_QUOTATION",referenceFrom:x.source,
 originalQuoteId:x.quoteId,sourceUrl:SUPPLIER_QUOTE_LINES_0553.find(q=>q.id===x.quoteId)?.sourceUrl||null,
 description:products.get(x.productKey)?.description||null,
 approvedForBudget:false}));
for(const e of VENDOR_EXTERNAL_EVIDENCE_0553){
 const supplierId=e.supplier.trim().toLowerCase();
 if(!suppliers.has(supplierId))suppliers.set(supplierId,{id:supplierId,name:e.supplier,quoteIds:[]});
 const key=e.sku;
 if(!products.has(key))products.set(key,{id:key,partNumber:key,description:e.description});
 relationships.push({
  id:e.id,vendorId:supplierId,productKey:key,description:e.description,quoteId:null,quotation:null,
  mr:e.budgetDependency?.startsWith("DTRS")?"MR-0002":"MR-0001",
  quantity:null,unitPrice:e.unitPrice,currency:e.currency,priceStatus:e.sourceClass,
  selectionStatus:"UNREVIEWED",technicalCompliance:e.technicalState,source:e.url||e.reference,
  sourceUrl:e.url||null,sourceClass:e.sourceClass,referenceFrom:e.module,
  referenceDocument:e.reference||null,originalQuoteId:null,
  pricingUnit:e.unit,vat:e.vat,freight:e.freight,checkedDate:e.checkedDate,
  approvedForBudget:e.budgetPostingAllowed,scopeDriver:e.budgetDependency
 });
}
// Imported historical supplier quotes remain source observations, not working quotes.
// Quote-specific unit and original reference are not lost by SKU deduplication.
for(const quote of HISTORICAL_VENDOR.quotes){
 const vendorId=quote.vendor.trim().toLowerCase();
 if(!suppliers.has(vendorId))suppliers.set(vendorId,{id:vendorId,name:quote.vendor,quoteIds:[]});
 suppliers.get(vendorId).quoteIds.push(quote.id);
 for(const [i,line] of quote.lines.entries()){
  const productKey=line.sku||`UNIDENTIFIED:${quote.id}:${i}`;
  if(!products.has(productKey))products.set(productKey,{id:productKey,partNumber:productKey,description:line.description});
  const isService=/TRANSPORT|YARD|CRAFT|MOB-|STANDBY|OVERTIME/i.test(line.sku);
  relationships.push({id:quote.id+":"+i,vendorId,productKey,description:line.description,
   quoteId:quote.id,quotation:quote.quotation,originalQuoteId:quote.id,
   mr:quote.mr,quantity:line.qty,unitPrice:line.unitPrice,currency:quote.currency,
   priceStatus:quote.status,selectionStatus:"UNREVIEWED",technicalCompliance:"NOT_VERIFIED_FOR_Z1F",
   source:quote.source,sourceUrl:quote.sourceUrl,sourceClass:quote.sourceClass,
   referenceFrom:quote.source||quote.quotation,referenceDocument:quote.source,
   pricingUnit:line.unit,scopeDriver:quote.scope,verifiedOriginalLineTotal:line.lineTotal,
   quoteTerms:quote.terms,sourceLine:i+1,
   budgetCategoryCandidate:isService?"B2_B4_C1_REVIEW":"EQUIPMENT_BULK_TO_REVIEW",
   approvedForBudget:false});
 }
}

// Ingest an independently preserved historical quotation into the same catalog.
// The source quotation identity is not equivalent to a selected project cost.
const exion={id:EXION_REFERENCE.id,vendor:EXION_REFERENCE.vendor,quotation:EXION_REFERENCE.quotation,
 mr:EXION_REFERENCE.mrCandidate,currency:EXION_REFERENCE.currency,source:EXION_REFERENCE.document,
 status:EXION_REFERENCE.priceState};
const exionId=exion.vendor.trim().toLowerCase();
if(!suppliers.has(exionId))suppliers.set(exionId,{id:exionId,name:exion.vendor,quoteIds:[]});
suppliers.get(exionId).quoteIds.push(exion.id);
EXION_REFERENCE.lines.forEach((line,i)=>{
 const key=line.sku;
 if(!products.has(key))products.set(key,{id:key,partNumber:key,description:line.product});
 relationships.push({id:exion.id+":"+i,vendorId:exionId,productKey:key,
  description:line.product,quoteId:exion.id,quotation:exion.quotation,originalQuoteId:exion.id,
  mr:exion.mr,quantity:line.qty,unitPrice:line.rate,currency:exion.currency,
  pricingUnit:line.unit,sourceClass:"HISTORICAL_SUPPLIER_QUOTE",priceStatus:exion.status,
  source:exion.source,referenceFrom:exion.source,selectionStatus:"UNREVIEWED",
  technicalCompliance:"NOT_VERIFIED_FOR_Z1F",approvedForBudget:false,
  sourceLine:i+1,scopeDriver:"Historical MR-0003 reference; sounder separate from telephone"});
});
// Manufacturer records have technical specifications but no implied quotation or price.
KNOWLEDGE_PRODUCTS.records.forEach((p,i)=>{
 const supplierId=p.manufacturer.trim().toLowerCase(),key=p.model||p.id;
 if(!suppliers.has(supplierId))suppliers.set(supplierId,{id:supplierId,name:p.manufacturer,quoteIds:[]});
 if(!products.has(key))products.set(key,{id:key,partNumber:key,description:p.product});
 relationships.push({id:p.id,vendorId:supplierId,productKey:key,description:p.product,
  quoteId:null,quotation:null,mr:p.projectCandidate?.startsWith("MR-0004")?"MR-0004":"ALL",
  quantity:null,unitPrice:null,currency:null,pricingUnit:null,
  sourceClass:p.sourceType,priceStatus:"NO_QUOTATION",source:p.sourceUrl,sourceUrl:p.sourceUrl,
  referenceFrom:p.sourceDocument,referenceDocument:p.sourceDocument,
  technicalCompliance:p.technicalAssessment,selectionStatus:"UNREVIEWED",
  scopeDriver:p.category,approvedForBudget:false,
  specifications:p.specifications,sourceLine:i+1});
});
const latestVendorId="exion (thailand)";
if(!suppliers.has(latestVendorId))suppliers.set(latestVendorId,{id:latestVendorId,name:EXION_LATEST.vendor,quoteIds:[]});
suppliers.get(latestVendorId).quoteIds.push(EXION_LATEST.id);
EXION_LATEST.lines.forEach((l,i)=>{
 if(!products.has(l.sku))products.set(l.sku,{id:l.sku,partNumber:l.sku,description:l.description});
 relationships.push({id:EXION_LATEST.id+":"+i,vendorId:latestVendorId,productKey:l.sku,
 description:l.description,quoteId:EXION_LATEST.id,quotation:EXION_LATEST.quotation,
 mr:EXION_LATEST.mr,quantity:l.qty,unitPrice:l.unitPrice,currency:EXION_LATEST.currency,
 pricingUnit:l.unit,sourceClass:EXION_LATEST.sourceClass,priceStatus:EXION_LATEST.status,
 source:EXION_LATEST.source,referenceFrom:EXION_LATEST.source,approvedForBudget:false});
});
export const VENDOR_UNIFIED_CATALOG_0553=Object.freeze({
 suppliers:[...suppliers.values()],products:[...products.values()],relationships,
 sourceClassRule:"Supplier quotations, web retail, historic ERP and manufacturer evidence do not gain equivalent approvals by being shown in one table",
 storage:"GITHUB_CONTROLLED_JS_JSON_SNAPSHOT__SQL_NOT_CONNECTED",releaseAllowed:false
});
