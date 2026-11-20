// MR0001 / seven-location, owner-scoped, READ-ONLY functional evidence bridge.
// Source identities are MTO Rev04 + selected TAG's current Rev03 read projection.
// Quotes supply reference prices, never physical required quantities or released OEM SKU.
// DATO, SA, TCAB, BULK have identical Required/Working/Vendor interface contracts,
// but Greenfield versus Brownfield selection and site/row cost ownership stay distinct.
import {SUPPLIER_QUOTE_LINES_0553} from "./supplierQuoteLines";
const quote=id=>SUPPLIER_QUOTE_LINES_0553.find(q=>q.id===id);
const valid=n=>Number.isFinite(n);
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const norm=s=>String(s||"").toUpperCase().replace(/\s+/g,"").trim();
const brownfield=new Set(["ZPQ","ZWP8","ZWP11"]);
const physicalClass=site=>brownfield.has(site)?"BROWNFIELD_REPLACEMENT_REUSE_TIE_IN_UNRESOLVED":"GREENFIELD_SITE_SPECIFIC_WORKING_TAKEOFF_PENDING";
const sourceLine=(id,sku)=>quote(id)?.lines?.find(x=>x[1]===sku)||null;
const record=(id,fn,{qty=null,unit=null,rate=null,amount=null,currency="THB",sku=null,owner=null,
 state="ENGINEERING_PROOF_REQUIRED",source=null,proof=null,posting="NON_ADDITIVE_ALREADY_OWNED",kind="WORKING_SOURCE_ONLY"}={})=>({
 id:"OWNER-"+id,functionId:fn,quantityDriver:proof||"Verify site-specific MTO scope, BLD/WIR and OEM interfaces",
 qtyProof:proof||"Physical SKU quantity not accepted; MTO Set/Lot is not an OEM count",
 documentedQty:null,documentedUnit:null,qtyClass:kind,
 derivedWorkingQty:valid(qty)?qty:null,budgetUnit:unit,approvedSkuQty:null,
 budgetRateTHB:currency==="THB"&&valid(rate)?rate:null,
 budgetAmountTHB:currency==="THB"&&valid(amount)?amount:null,
 rateEvidenceOriginal:valid(rate)?rate:null,amountEvidenceOriginal:valid(amount)?amount:null,
 currencyEvidenceOriginal:currency,sku,quoteEvidenceLine:source,
 quantityEvidence:source,budgetSource:source,budgetPosting:posting,
 qtyState:"BUDGETARY_COMPONENT_QTY_NOT_OEM_ACCEPTED",requirementState:state,
 selectionStatus:"PENDING_OEM_AND_SCOPE_VERIFICATION",costOwner:owner
});
const vendor=(code,id,workingQty,workingAmount,owner,state)=> {
 const q=quote(id),line=q?.lines?.find(x=>x[0]===code);
 if(!line)return null;
 return {functionId:"SOURCE_QUOTE_EVIDENCE",code,quoteId:id,vendor:q.vendor,quotation:q.quotation,
  sku:line[1],description:line[2],currency:q.currency,
  offeredQty:line[3],quotedUnit:valid(line[4])?line[4]:null,
  quotedTotal:valid(line[5])?line[5]:valid(line[4])&&valid(line[3])?round(line[3]*line[4]):null,
  workingQty:valid(workingQty)?workingQty:null,
  workingExtended:valid(workingAmount)?workingAmount:null,
  sourceRateNull:!valid(line[4]),sourceStatus:state,costOwner:owner};
};
export function projectMR0001TagEvidence0553(site,tagRow,source){
 const tag=norm(tagRow.tag),owner=String(tagRow.tag)+"."+tagRow.row;
 const role=physicalClass(site),required=[],offered=[],notes=[];
 const originalComponents=tagRow.components||[];
 const included=tagRow.countedInWorkingTotal===true&&valid(tagRow.extended);
 const category=tag.startsWith("DATO-")?"DATO":tag.startsWith("SA-")?"SURGE":
   tag.startsWith("TCAB-")?"ENCLOSURE":tag.includes("BULKMATERIAL")?"BULK":null;
 if(!category)return null;
 if(!source||source.platform!==site||source.sourceRowIndex!==tagRow.row)
  return {category,required,offered,notes:["MTO source identity not uniquely verified"],siteRole:role,sourceMatched:false};
 const itemRows=originalComponents.filter(x=>x&&typeof x.functionId==="string");
 const matchesCost=(items)=>included&&items.length>0&&
   items.every(x=>valid(x.extended)&&x.currency===tagRow.currency)&&
   Math.abs(round(items.reduce((n,x)=>n+x.extended,0))-tagRow.extended)<=0.01;
 // Normalization is presentation-only: preserve original source aliases and exact source rates.
 if(category==="DATO"){
  const panel=itemRows.find(c=>["DATO_RJ45_PANEL_INTERFACE","RJ45_PANEL"].includes(c.functionId));
  const plug=itemRows.find(c=>["DATO_RJ45_FIELD_PLUG","FIELD_PLUG"].includes(c.functionId));
  for(const [c,fn,desc] of [[panel,"DATO_RJ45_PANEL_INTERFACE","DATO RJ45 panel interface"],[plug,"DATO_RJ45_FIELD_PLUG","DATO field RJ45 plug"]]){
   required.push(record(fn,fn,{qty:c?.qty??null,unit:"ea",rate:c?.unitPrice,amount:c?.extended,
    currency:c?.currency||tagRow.currency,sku:c?.sku||null,owner,
    state:"EX_RATED_DISCONNECT_EQUIVALENCE_AND_CABLE_TERMINATION_OPEN",
    proof:desc+": current TAG budget component, not certified Ex socket/plug",
    source:c?.source||tagRow.source,posting:"EXISTING_DATO_TAG_COST_ONLY__NOT_ADDITIVE"}));
  }
  const sourcePanel=sourceLine("SONIC-CCY24-PXC-633","FL-PP-RJ45-SC");
  if(sourcePanel)offered.push(vendor(sourcePanel[0],"SONIC-CCY24-PXC-633",panel?.qty,panel?.extended,owner,"HISTORICAL_PANEL_RATE_BUDGETARY__EX_REVIEW"));
  const innova=sourceLine("INNOVA-QA24-0604","IE-PS-RJ45-FH-BK");
  if(innova)offered.push(vendor(innova[0],"INNOVA-QA24-0604",null,null,owner,"ORIGINAL_INNOVA_NA_RATE__RS_RETAIL_NOT_SUPPLIER_QUOTE"));
  notes.push("Phoenix/Weidmüller working choice is a PRICE scenario; selected IP20 plug is NOT Ex certification.");
  notes.push("RS Thailand THB 1,176.68 retail budget reference is NOT an INNOVA supplier quotation. Never replace original quote N/A or post another bulk plug.");
  if(!matchesCost([panel,plug].filter(Boolean)))notes.push("DATO function total not verified against one TAG owner; no artificial cost reconciliation.");
 }
 if(category==="SURGE"){
  const components=tagRow.detail?.length?tagRow.detail:itemRows;
  const priceOwned=components.filter(x=>valid(x.extended)&&valid(x.unitPrice)&&valid(x.qty));
  const qty=valid(tagRow.sourceQty)?tagRow.sourceQty:null;
  required.push(record("SURGE_INTERFACE","ETHERNET_SURGE_ASSEMBLY",{qty,unit:tagRow.sourceUnit,rate:tagRow.unitCost,
   amount:included?tagRow.extended:null,currency:tagRow.currency,sku:tagRow.sku,owner,
   source:tagRow.source,state:"ETHERNET_POE_SURGE_RATING_EX_EARTHING_CERTIFICATION_OPEN",
   proof:"One MTO surge Set is documentary scope; test actual voltage/PoE interface, Ex, earth and distinct physical surge owners",
   posting:"EXISTING_SURGE_TAG_LEDGER_ONLY__NOT_ADDITIVE"}));
  const codes=[...new Set(components.map(x=>x.budgetaryQuoteLine||x.functionId).filter(x=>/^[ABC]-8$/.test(x)))];
  for(const code of codes){
   const q=code.startsWith("A-")||code.startsWith("B-")||code.startsWith("C-")?quote("NG-260916"):null;
   const line=q?.lines?.find(x=>x[0]===code);
   if(line)offered.push(vendor(code,"NG-260916",qty,included?tagRow.extended:null,owner,
    "SURGE_FUNCTION_WORKING_REFERENCE__NOT_TECHNICALLY_APPROVED"));
  }
  if(!codes.length)notes.push("No uniquely linked supplier surge quote line for this TAG; price or SKU candidate is not evidence of OEM compliance.");
  if(priceOwned.length&&Math.abs(round(priceOwned.reduce((s,x)=>s+x.extended,0))-(tagRow.extended||0))>0.01)
   notes.push("Function prices do not reconcile to TAG owner: do not add supplier alternatives.");
 }
 if(category==="BULK"){
  const cat=itemRows.find(c=>/CAT6A|CAT6|FIELD_RUN/.test(norm(c.functionId)));
  const gland=itemRows.find(c=>/GLAND|INDOOR_ENTRY/.test(norm(c.functionId)));
  for(const [c,id,name] of [[cat,"SCADA_CAT6A_WORKING_ALLOWANCE","CAT6A field run"],[gland,"SCADA_M20_GLAND_WORKING_ALLOWANCE","M20 indoor panel entry"]]){
   required.push(record(id,id,{qty:c?.qty??null,unit:id.includes("CAT6A")?"m":"set",
    rate:c?.unitPrice,amount:c?.extended,currency:c?.currency||tagRow.currency,sku:c?.sku,
    owner,source:c?.source||tagRow.source,proof:name+" — quoted rate x management route/entry assumption, not as-built quantity",
    state:id.includes("CAT6A")?"CABLE_ROUTE_FIRE_RATING_AND_END_TO_END_COUNT_OPEN":"CABLE_OD_EX_CERT_VENDOR_INCLUDED_ACTIVE_GLAND_QTY_OPEN",
    posting:"EXISTING_BULK_TAG_ROW_ONLY__NOT_ADDITIVE"}));
  }
  notes.push("Budgetary CAT6A 60m + 15% and one M20 gland apply only where this TAG ledger has corresponding components; other physical circuits/glands are pending takeoff.");
  notes.push("Factory drilled BARTEC holes, factory plugs and spare capacity are NOT additional field gland quantities.");
  if(!matchesCost([cat,gland].filter(Boolean)))notes.push("Bulk component breakdown partial or missing; use TAG subtotal only, not guessed function costs.");
 }
 if(category==="ENCLOSURE"){
  const exact=site==="ZWP11"&&tag==="TCAB-500-003"&&tagRow.procurementQty===0;
  const rate=valid(tagRow.unitCost)?tagRow.unitCost:null;
  const sourceQty=valid(tagRow.sourceQty)?tagRow.sourceQty:null;
  required.push(record("TCAB_ASSEMBLY_OWNER",exact?"EXISTING_TCAB_REUSE_AND_MODIFICATION":"SCADA_EXE_ENCLOSURE_ASSEMBLY",{
   qty:exact?tagRow.procurementQty:sourceQty,unit:"Set",rate:exact?null:rate,
   amount:exact?null:included?tagRow.extended:null,currency:tagRow.currency,sku:tagRow.sku,
   source:tagRow.source,owner,
   proof:exact?"MTO 1 Set; BOD Rev.C2 section 8 reuses TCAB-WP11-500-003, 0 new purchase; modifications not costed":
    "MTO source set; verify chosen EX enclosure type, thermal layout, gland/termination inclusions",
   state:exact?"EXISTING_PANEL_REUSE__MODIFICATION_COST_UNKNOWN":"HISTORICAL_BARTEC_COMPARABLE__CURRENT_EX_CERT_AND_ENTRIES_PENDING",
   posting:exact?"ZERO_NEW_PROCUREMENT_ONLY__MODIFICATION_UNPRICED":"EXISTING_TCAB_TAG_COST_ONLY__NON_ADDITIVE"}));
  const prosperity=quote("PROSPER-24051");
  if(prosperity){
   const l=prosperity.lines.filter(x=>["1","2"].includes(x[0]));
   for(const q of l)offered.push(vendor(q[0],"PROSPER-24051",
     !exact&&included&&q[0]==="1"?sourceQty:0,
     !exact&&included&&q[0]==="1"?tagRow.extended:null,owner,
     exact?"HISTORICAL_REFERENCE_ONLY__NO_NEW_PANEL_PURCHASE":
      q[0]==="1"?"HISTORICAL_WORKING_COMPARABLE__NOT_1F_QUOTE":"UNSELECTED_HISTORICAL_ALTERNATIVE__NOT_ADDITIVE"));
  }
  if(exact)notes.push("ZWP11 reuses existing Ex enclosure (BOD C2 §8). Zero new-panel procurement is NOT a zero-cost enclosure modification.");
  else if(brownfield.has(site))notes.push("Brownfield replacement-equivalent enclosure value, if present, is an internal scenario; NEW/REUSE/BY OTHERS unresolved.");
  else notes.push("Historical BARTEC Type1/2/3 GA is a comparator; do not transplant 2022 quantities to this new Z1F site without enclosure selection.");
  notes.push("Check enclosure M20 entry count against DTS minimum 18, Ex certificate, heat dissipation, internal equipment and factory fittings. Factory plugs are not purchased active glands.");
 }
 const sourceMatched=source.sourceCodes?.includes(tagRow.tag)||norm(source.sourcePartText).includes(tag);
 return {category,siteRole:role,owner,required,offered:offered.filter(Boolean),notes,
  sourceMatched:Boolean(sourceMatched),sourceId:source.id||null,
  sourceEvidence:"MR0001 MTO Rev04 / "+site+" row "+tagRow.row,
  countedTagAmount:included?tagRow.extended:null,
  functionSubtotalMatches:category==="DATO"?matchesCost(itemRows):null,
  hasConfirmedPurchase:!brownfield.has(site)&&included,
  technicalApproved:false,customerSellChanged:false,releaseAllowed:false};
}
