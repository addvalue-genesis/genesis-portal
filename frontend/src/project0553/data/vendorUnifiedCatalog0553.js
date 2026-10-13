// PJ2608-0553: one read-only vendor/product/source index for the supplier screen.
// Quote lines remain original evidence, while public web / historical procurement
// are separate referenced price observations, never synthetic supplier quotations.
import {SUPPLIER_QUOTE_LINES_0553} from "./supplierQuoteLines";
import {VENDOR_EXTERNAL_EVIDENCE_0553} from "./vendorExternalEvidence0553";
import HISTORICAL_VENDOR from "./historicalVendorEvidence0553.json";
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
export const VENDOR_UNIFIED_CATALOG_0553=Object.freeze({
 suppliers:[...suppliers.values()],products:[...products.values()],relationships,
 sourceClassRule:"Supplier quotations, web retail, historic ERP and manufacturer evidence do not gain equivalent approvals by being shown in one table",
 storage:"GITHUB_CONTROLLED_JS_JSON_SNAPSHOT__SQL_NOT_CONNECTED",releaseAllowed:false
});
