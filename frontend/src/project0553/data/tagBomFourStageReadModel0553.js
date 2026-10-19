// PJ2608-0553: read-only composition of EXISTING authoritative sources.
// This is a presentation adapter, not a new BOM, cost calculation engine, or
// accepted OEM configuration. MR Set/Lot never becomes a purchased SKU count.
import {MR0001_PACKAGE_COMPOSITION} from "./mr0001PackageComposition";
import {MR0001_ENGINEERING_REQUIRED_BOM} from "./mr0001RequiredBomDerivation";
import {SUPPLIER_QUOTE_LINES_0553} from "./supplierQuoteLines";
import {MR0001_WORKING_PRICED_BOM} from "./mr0001WorkingPricedBom";
import {auditZWP20RadioVendorMapping0553} from "./controlledTagMappingPilot0553";
import {deriveBartecTagRequiredBulkProjection0553,deriveBartecTcabRequiredBom0553} from "./bartecTagRequiredBulkProjection0553";
import {deriveZwp20BulkPricingBridge0553} from "./zwp20BulkPricingBridge0553";
import {projectMR0001TagEvidence0553} from "./mr0001TagEvidenceProjection0553";

const rounded=n=>Math.round(n*100)/100;
const ownedBy=(c,owner)=>!c.allocationOwner||c.allocationOwner===owner;
const candidateLookup=new Map(SUPPLIER_QUOTE_LINES_0553.map(quote=>[quote.id,quote]));

// If the canonical TAG Ledger does not expose function rows directly, recover
// ONLY the matching Cost Owner from the existing independent SOURCE audit.
// Required/OEM quantities remain owned by Engineering, never by this projection.
const auditedOwnerDetail=(site,tagRow,owner)=>{
 if(site!=="ZWP20"||![5,6,10].includes(tagRow.row)||!Number.isFinite(tagRow.extended))return [];
 const audit=auditZWP20RadioVendorMapping0553();
 const proof=(audit.ownerReconciliation||[]).find(x=>x.id===owner);
 if(audit.status!=="BUDGETARY_RECONCILED_WITH_QUALIFICATIONS"||!proof?.pass||
    Math.abs(proof.ledgerUSD-tagRow.extended)>0.01)return [];
 return audit.details.filter(x=>x.costOwner===owner&&x.sourceMatch&&
   Number.isFinite(x.engineeringQty)&&Number.isFinite(x.sourceUnitPriceUSD)).map(x=>({
  id:"AUDITED_SOURCE_"+x.quoteLine,functionId:x.functionId,
  allocationOwner:x.costOwner,requiredQty:x.engineeringQty,
  budgetaryQuoteLine:x.quoteLine,budgetarySelectedSKU:x.partNumber,
  budgetaryUnitPrice:Number.isFinite(x.mappingRateUSD)?x.mappingRateUSD:x.sourceUnitPriceUSD,
  budgetaryExtended:Number.isFinite(x.mappingExtendedUSD)?x.mappingExtendedUSD:rounded(x.engineeringQty*x.sourceUnitPriceUSD),
  currency:"USD",offeredQuoteQty:x.sourceQuoteQty,
  priceEvidenceType:"AUDITED_VENDOR_SOURCE_NOT_APPROVED_OEM",
  budgetaryDecision:"INDEPENDENT_MAP09_COST_OWNER_RECONCILED__TECHNICAL_PROOF_OPEN"
 }));
};

// TC-0001 Item 13: present the same selected 8-port Cisco working source
// under the MTO TAG's Required/Working/Vendor stages, without creating a new
// ledger or treating quote-wide 5 units as 5 units at each site.
const ciscoTc0001ForTag=(site,tagRow,owner)=>{
 if(!/^LAN-502-00[12]$/.test(String(tagRow.tag||"")))return null;
 const tag=MR0001_WORKING_PRICED_BOM.items.find(r=>
  r.site===site&&r.sourceRow===tagRow.row&&r.sourceTag===tagRow.tag&&
  r.bomType==="L3_SWITCH_CISCO_BUNDLE_CANDIDATE");
 if(!tag||tag.sourceScopeQty!==1)return null;
 const offer=MR0001_WORKING_PRICED_BOM.cisco;
 const lookup=new Map(tag.configuration.map(q=>[q.quoteLine,q]));
 const groups=[
  {id:"NETWORK_SWITCH",codes:["1.0"],description:"IE-3400-8P2S-E, 8 integrated PoE RJ45 and 2 SFP slots"},
  {id:"NETWORK_LICENCE",codes:["1.6","1.6.1"],description:"IE3400 DNA Essentials subscription, 3 years; routing entitlement review"},
  {id:"DC_POWER",codes:["1.1"],description:"PWR-IE65W-PC-DC, PoE/DC supply, power headroom pending"},
  {id:"SFP_INTERFACE",codes:[],description:"Two built-in SFP interfaces only; separate optical transceivers not priced",included:true,qty:2},
  {id:"CONFIGURATION",codes:["1.2","1.3","1.4","1.5"],description:"Quote's included software/tracking parent lines",included:true},
  {id:"NETWORK_SUPPORT",codes:["1.0.1"],description:"Main-switch SmartNet; removed module SmartNet excluded"}
 ];
 const detail=groups.map(g=>{
  const sourceLines=g.codes.map(code=>lookup.get(code)).filter(Boolean);
  const quoteCodes=sourceLines.map(q=>q.quoteLine);
  const price=sourceLines.length?rounded(sourceLines.reduce((sum,q)=>sum+q.unitPrice,0)):null;
  const qty=g.qty||tag.sourceScopeQty;
  return {
   id:"TC0001-"+g.id,functionId:g.id,allocationOwner:owner,quoteId:"VST-0048-RE1",
   sourceQuoteCodes:quoteCodes,budgetaryQuoteLine:quoteCodes.join(", ")||"INTEGRATED_BASE_PORTS",
   budgetarySelectedSKU:sourceLines.map(x=>x.sku).join(" + ")||"IE-3400-8P2S-E (embedded SFP slots)",
   description:g.description,requiredQty:qty,qty,quantityState:"TC0001_INTERNAL_WORKING_QTY_NOT_OEM_APPROVED",
   currency:"THB",budgetaryUnitPrice:price,
   budgetaryExtended:g.included?null:price===null?null:rounded(price*tag.sourceScopeQty),
   nonCostedIncluded:Boolean(g.included),
   priceEvidenceType:"VST_0048_RE1_ORIGINAL_QUOTE__TC0001_REVISED_WORKING_SUBSET",
   budgetaryDecision:offer.engineeringGate,
   technicalState:"PORT_POE_L3_AND_OEM_APPROVAL_PENDING",
   sourceStatus:"QUOTE_EXPIRED_REQUOTE_REQUIRED"
  };
 });
 const quoted=offer.originalQuoteItems.map(q=>{
  const selected=lookup.has(q.quoteLine);
  return {
   functionId:groups.find(g=>g.codes.includes(q.quoteLine))?.id||"EXCLUDED_EXPANSION_MODULE",
   code:q.quoteLine,quoteId:"VST-0048-RE1",vendor:"VST ECS (Thailand) / Cisco",
   quotation:offer.sourceQuote,sku:q.sku,description:q.description,currency:q.currency,
   offeredQty:q.quoteQty,quotedUnit:q.unitPrice,
   quotedTotal:rounded(q.unitPrice*q.quoteQty),
   workingQty:selected?tag.sourceScopeQty:0,
   workingExtended:selected?rounded(q.unitPrice*tag.sourceScopeQty):null,
   sourceStatus:selected?"TC0001_RETAINED_8PORT_WORKING_QUOTE_LINE":
     "TC0001_EXCLUDED_EXPANSION_OR_MODULE_SMARTNET__AUDIT_ONLY",
   sourceRateNull:false,workingAssumedZero:false,costOwner:owner
  };
 });
 return {detail,offered:quoted,sourceTag:tag,originalTotalTHB:offer.sourceTotalTHB,
  unitWorkingTHB:offer.unitPackageQuotedSumTHB,removedTHB:offer.removedTotalTHB,
  engineeringGate:offer.engineeringGate};
};

// The TCAB package is one separately allocated factory assembly, not 16
// extra M20 glands or a repetition of the SCADA Bulk Row11 cost owner.
const tcabWorkingQuoteForTag=(site,tagRow,owner,tcab)=>{
 if(!tcab)return null;
 const quoted=candidateLookup.get("PROSPER-24051");
 const originalLines=(quoted?.lines||[]).filter(x=>["1","2"].includes(x[0]));
 const selectedCode=tagRow.budgetarySelectedQuoteLine||"1";
 const selected=originalLines.find(x=>x[0]===selectedCode);
 const count=tagRow.sourceQty;
 const amount=tagRow.countedInWorkingTotal===true?tagRow.extended:null;
 const rate=tagRow.unitCost;
 const priced=Number.isFinite(count)&&Number.isFinite(rate)&&Number.isFinite(amount)&&
  Math.abs(rounded(count*rate)-amount)<0.01;
 const detail=priced?[{
  id:"TCAB-FACTORY-EXE-PANEL",functionId:"BARTEC_EXE_PANEL_ASSEMBLY",
  allocationOwner:owner,quoteId:"PROSPER-24051",
  budgetaryQuoteLine:selectedCode,budgetarySelectedSKU:tagRow.sku||selected?.[1]||null,
  requiredQty:count,qty:count,currency:"THB",
  budgetaryUnitPrice:rate,budgetaryExtended:amount,
  priceEvidenceType:"HISTORICAL_ZAWTIKA_1E_COMPARABLE_WORKING_ONLY",
  budgetaryDecision:tcab.approvalState,
  technicalState:"EX_E_LAYOUT_CERTIFICATION_AND_16_VS_18_DTS_REVIEW",
  sourceStatus:"VENDOR_REQUOTE_REQUIRED_NOT_CURRENT_PHASE_1F"
 }]:[];
 const offered=originalLines.map(line=>{
  const used=line[0]===selectedCode&&priced;
  return {
   functionId:"BARTEC_EXE_PANEL_ASSEMBLY",code:line[0],
   quoteId:quoted.id,vendor:quoted.vendor,quotation:quoted.quotation,
   sku:line[1],description:line[2],currency:"THB",
   offeredQty:line[3],quotedUnit:line[4],
   quotedTotal:Number.isFinite(line[3])&&Number.isFinite(line[4])?
    rounded(line[3]*line[4]):null,
   workingQty:used?count:0,workingExtended:used?amount:null,
   sourceRateNull:!Number.isFinite(line[4]),workingAssumedZero:false,
   sourceStatus:used?"HISTORICAL_LINE_1_BUDGETARY_COMPARABLE__REQUOTE_REQUIRED":
    "HISTORICAL_ALTERNATIVE__NOT_ADDITIVE",
   costOwner:owner
  };
 });
 return {detail,offered,matchedQuote:quoted?.quotation||null,
  budgetarySourcePriceTHB:amount,originalSourceStatus:quoted?.status||null};
};

export function getTagBomFourStage0553(site,tagRow){
 const owner=String(tagRow.tag||"")+"."+String(tagRow.row??"");
 const source=MR0001_ENGINEERING_REQUIRED_BOM.rows.find(r=>r.platform===site&&r.sourceRowIndex===tagRow.row);
 // One source row may have several equipment TAGs; never collapse those into one SKU.
 const pkg=MR0001_PACKAGE_COMPOSITION.packages.find(p=>p.platform===site&&p.sourceRowIndex===tagRow.row);
 const matchingTag=Boolean(source?.sourceCodes?.includes(tagRow.tag)||
   (source?.sourcePartText||"").includes(tagRow.tag)||String(tagRow.tag).toLowerCase().includes("bulk"));
 const ciscoTc=ciscoTc0001ForTag(site,tagRow,owner);
 const ownerEvidence=projectMR0001TagEvidence0553(site,tagRow,source);
 const tcab=deriveBartecTcabRequiredBom0553(site,tagRow.tag,source);
 const tcabQuote=tcabWorkingQuoteForTag(site,tagRow,owner,tcab);
 // For historical enclosure references with one site-owned TAG cost, expose
 // a single owner-scoped working function without inventing factory fitting rates.
 // Brownfield existing/reuse alternatives never become new approved purchases.
 const enclosureWorking=ownerEvidence?.category==="ENCLOSURE"&&!tcab&&
   tagRow.countedInWorkingTotal===true&&Number.isFinite(tagRow.extended)&&
   tagRow.sourceQty===1&&tagRow.procurementQty!==0&&
   Number.isFinite(tagRow.unitCost)?[{
    id:"SOURCE-TCAB-"+site+"-"+tagRow.row,
    functionId:"SCADA_EXE_ENCLOSURE_ASSEMBLY",allocationOwner:owner,
    requiredQty:tagRow.sourceQty,qty:tagRow.sourceQty,currency:tagRow.currency,
    budgetaryQuoteLine:"PROSPER-24051-1-HISTORICAL-COMPARABLE",
    budgetarySelectedSKU:tagRow.sku||null,
    budgetaryUnitPrice:tagRow.unitCost,budgetaryExtended:tagRow.extended,
    priceEvidenceType:"HISTORICAL_COMPARABLE_TAG_COST_NOT_1F_QUOTE",
    budgetaryDecision:"EX_AND_SCOPE_OWNER_REVIEW_PENDING"}]:[];
 const detail=tagRow.detail?.length?tagRow.detail:tagRow.components?.length?tagRow.components:
  (ciscoTc?.detail||tcabQuote?.detail|| (enclosureWorking.length?enclosureWorking:auditedOwnerDetail(site,tagRow,owner)));
 const byFunction=new Map(detail.map(c=>[c.functionId,c]));
 // Bridge the previously isolated BARTEC manufacturer geometry + source MTO
 // into THIS TAG's Stage 01 Required view. No read-model cost mutation.
 const bartecBulkRequired=deriveBartecTagRequiredBulkProjection0553(site,tagRow.tag,source);
 const budgetBridge=site==="ZWP20"&&tagRow.row===11&&/bulk material/i.test(tagRow.tag)?deriveZwp20BulkPricingBridge0553():null;
 const required=(pkg?.components||[]).map(functionRow=>{
  const c=byFunction.get(functionRow.functionId);
  const budget=budgetBridge?.entries.find(x=>x.functionId===functionRow.functionId);
  const aggregate=functionRow.functionId==="MOUNT_FEEDER"&&budgetBridge;
  // Quote-backed existing TAG cost is evidence, NOT a second cost posting.
  // The THB presentation adapter converts only after a dated FX is supplied.
  const originalRate=Number.isFinite(c?.budgetaryUnitPrice)?c.budgetaryUnitPrice:
   Number.isFinite(c?.unitPrice)?c.unitPrice:Number.isFinite(c?.rateTHB)?c.rateTHB:null;
  const originalAmount=Number.isFinite(c?.budgetaryExtended)?c.budgetaryExtended:
   Number.isFinite(c?.extended)?c.extended:null;
  const originalCurrency=c?.currency||tagRow.currency||null;
  return {id:functionRow.id,functionId:functionRow.functionId,
   requirementState:functionRow.technicalState,quantityDriver:functionRow.quantityDriver,
   approvedSkuQty:functionRow.requiredQty, // remains null until approved by Engineering
   derivedWorkingQty:budget?.qty??(aggregate?1:Number.isFinite(c?.requiredQty)?c.requiredQty:Number.isFinite(c?.qty)?c.qty:null),
   budgetRateTHB:budget?.unitRateTHB??(aggregate?budgetBridge.scenarioTHB:null),
   rateEvidenceOriginal:originalRate,amountEvidenceOriginal:originalAmount,currencyEvidenceOriginal:originalCurrency,
   quoteEvidenceLine:c?.budgetaryQuoteLine||c?.functionId||null,
   budgetAmountTHB:budget?.extendedTHB??(aggregate?budgetBridge.scenarioTHB:null),
   budgetUnit:budget?.unit??(aggregate?"lot":null),
   budgetBasis:budget?.quantityBasis??(aggregate?"ONE source MTO Bulk lot, aggregate scenario total; DO NOT add to individual child amounts":null),
   budgetSource:budget?.source??(aggregate?budgetBridge.source:null),
   budgetPosting:aggregate?"ROLLUP_TOTAL_ONLY_NOT_ADDITIVE":budget?"SOURCE_RATE_BUDGET_ESTIMATE_NOT_ADDITIVE":Number.isFinite(originalRate)?"EXISTING_TAG_LEDGER_EVIDENCE_NON_ADDITIVE":"NO_SOURCE_RATE_YET",
   qtyState:budget?"WORKING_BUDGET_QUANTITY_WITH_OPEN_TECHNICAL_PROOF":aggregate?"WORKING_BUDGET_LOT_ROLLUP":c?.quantityState||"ENGINEERING_PHYSICAL_QTY_NOT_VERIFIED",
   qtyProof:c?.quantityProof||functionRow.proofRequired?.join("; ")||"REVIEW",
   costOwner:c?.allocationOwner||null,selectionStatus:c?.budgetarySelectionState||"NOT_SELECTED",
   candidateCount:functionRow.candidateQuotes?.length||0};
 });
 // Generic "GLANDS" stays as an unverified installed physical requirement; append
 // distinct GA documented capacity/accessories and the separately priced 1-gland
 // allowance without replacing the original MTO-required functional composition.
 if(bartecBulkRequired)required.push(...bartecBulkRequired.requirements);
 // All source-backed functional evidence is NON-ADDITIVE to the existing TAG
 // ledger. It improves Stage 01 visibility, not TAG prices or procurement qty.
 if(ownerEvidence&&!(tcab&&ownerEvidence.category==="ENCLOSURE"))
  required.push(...ownerEvidence.required);
 if(tcab){
  // The one MTO source assembly has a working historical comparable in Row9.
  // Show it beside the required functions as NON-ADDITIVE existing TAG evidence.
  required.push(...tcab.requirements.map(r=>r.functionId==="SCADA_EX_E_PANEL_ASSEMBLY"?
   {...r,derivedWorkingQty:tagRow.sourceQty,
    budgetUnit:tagRow.sourceUnit||"Set",
    budgetRateTHB:Number.isFinite(tagRow.unitCost)?tagRow.unitCost:null,
    budgetAmountTHB:tagRow.countedInWorkingTotal?tagRow.extended:null,
    budgetSource:tcab.priceBasis,
    budgetPosting:"EXISTING_TCAB_ROW9_TAG_LEDGER_ONLY__NOT_ADDITIVE",
    selectionStatus:tcab.approvalState}:r));
 }
 // Working functions and pricing originate exclusively from the existing TAG cost ledger.
 // For ODU row4 B-6/B-7 are required functions but belong to IDU row5; do NOT sum them.
 const ownerDetail=detail.filter(c=>ownedBy(c,owner));
 const pricedFunctions=ownerDetail.map(c=>{
  const sourceId=c.budgetaryQuoteLine||c.budgetarySelectedOffer||c.source||null;
  const qty=Number.isFinite(c.requiredQty)?c.requiredQty:Number.isFinite(c.qty)?c.qty:
   Number.isFinite(c.quantity)?c.quantity:null;
  const unit=Number.isFinite(c.budgetaryUnitPrice)?c.budgetaryUnitPrice:
   Number.isFinite(c.unitPrice)?c.unitPrice:Number.isFinite(c.rateTHB)?c.rateTHB:null;
  const originalExtended=Number.isFinite(c.budgetaryExtended)?c.budgetaryExtended:
   Number.isFinite(c.extended)?c.extended:null;
  return {id:c.id||c.functionId,functionId:c.functionId,quoteCode:sourceId,qty,unit,
   currency:c.currency||tagRow.currency||null,extended:originalExtended,
   sourceRateState:c.priceEvidenceType||c.status||"WORKING_PRELIMINARY",
   sku:c.budgetarySelectedSKU||c.sku||null,
   note:c.budgetaryDecision||c.technicalState||c.state||"",
   includedWithoutExtra:c.nonCostedIncluded===true};
 });
 const otherOwnerFunctions=detail.filter(c=>c.allocationOwner&&!ownedBy(c,owner)).map(c=>({
  functionId:c.functionId,owner:c.allocationOwner,quoteCode:c.budgetaryQuoteLine||c.budgetarySelectedOffer||null
 }));
 const costed=pricedFunctions.filter(c=>!c.includedWithoutExtra);
 const workingCurrencies=new Set(costed.map(c=>c.currency).filter(Boolean));
 const currencyValid=workingCurrencies.size===1&&workingCurrencies.has(tagRow.currency);
 const numericallyComplete=costed.length>0&&currencyValid&&costed.every(c=>Number.isFinite(c.extended));
 // Never sum USD, THB, EUR or null-currency components together by accident.
 const workingTotal=numericallyComplete?rounded(costed.reduce((sum,c)=>sum+c.extended,0)):null;
 const ledgerTotal=tagRow.countedInWorkingTotal&&Number.isFinite(tagRow.extended)?tagRow.extended:null;
 const delta=numericallyComplete&&Number.isFinite(ledgerTotal)?rounded(workingTotal-ledgerTotal):null;
 // Vendor proof belongs in the vendor registry. Show the exact quoted source rows
 // relevant to THIS physical owner, never the other owners or all 53 quote rows.
 const offeredNextG=pricedFunctions.filter(c=>/^([ABC]-\d+)$/.test(String(c.quoteCode||""))).map(c=>{
  const q=candidateLookup.get("NG-260916");
  const found=q?.lines?.find(line=>line[0]===c.quoteCode);
  return {functionId:c.functionId,code:c.quoteCode,quoteId:q?.id||null,
   vendor:q?.vendor||null,quotation:q?.quotation||null,currency:q?.currency||null,
   sku:found?.[1]||null,description:found?.[2]||null,offeredQty:found?.[3]??null,
   quotedUnit:found?.[4]??null,quotedTotal:found?.[5]??null,
   workingQty:c.qty,workingExtended:c.extended,
   sourceRateNull:found?.[4]===null,workingAssumedZero:found?.[4]===null&&c.unit===0,
   sourceStatus:q?.status||null,
   costOwner:owner};
 });
 const offered=ciscoTc?.offered||tcabQuote?.offered||
  (offeredNextG.length?offeredNextG:ownerEvidence?.offered||[]);
 const otherSupplierEvidence=offered.length===0&&Boolean(tagRow.vendor||tagRow.sku||tagRow.source);
 return Object.freeze({
  site,tag:tagRow.tag,row:tagRow.row,owner,
  sourceId:source?.id||null,sourceMatched:matchingTag,sourceQuantityText:source?.sourceQuantityText||null,
  scopeQty:tagRow.sourceQty??null,scopeUnit:tagRow.sourceUnit||null,
  packageFamily:pkg?.equipmentFamily||"SOURCE_MAPPING_REVIEW",
  required,bartecBulkRequired,tcabRequired:tcab,ownerEvidence,budgetBridge,
  physicalSkuApproved:required.some(x=>Number.isFinite(x.approvedSkuQty)),
  working:{status:tagRow.status||"REVIEW",currency:tagRow.currency||null,extended:ledgerTotal,
   selectedVendor:tagRow.vendor||null,selectedSku:tagRow.sku||null,
   source:tagRow.source||null,functions:pricedFunctions,
   otherOwnerFunctions,derivedFunctionSubtotal:workingTotal,
   deltaFromLedger:delta,assumptions:tagRow.assumptions||[],
   completeness:pricedFunctions.length===0?"TAG_TOTAL_ONLY__NO_FUNCTION_COMPOSITION":
    !currencyValid?"MIXED_OR_UNVERIFIED_FUNCTION_CURRENCIES":
    !numericallyComplete?"FUNCTION_PRICES_PARTIAL":delta===null?"LEDGER_OR_RATE_REVIEW":
    Math.abs(delta)<=0.01?"WORKING_FUNCTIONS_RECONCILED":"COST_OWNER_MISMATCH"},
  offered,otherSupplierEvidence,tcabQuoteStatus:tcabQuote?.originalSourceStatus||null,ciscoTc0001:ciscoTc?{unitWorkingTHB:ciscoTc.unitWorkingTHB,originalTotalTHB:ciscoTc.originalTotalTHB,removedTHB:ciscoTc.removedTHB,engineeringGate:ciscoTc.engineeringGate}:null,releaseAllowed:false
 });
}
