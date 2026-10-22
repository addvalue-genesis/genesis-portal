// PJ2608-0553 — customer-style 5-category pre-award read model.
// Source of listed quantities/prices is existing Rev08; actual installed TAG identities
// are from MR/ MTO / AFC scoped tag model, never guessed. Candidate tag links are
// engineering associations, not verified OEM interchangeable spare part numbers.
// SPQ spare cost scenarios are NON-POSTING and separate from price-controlled base.
import {selectUnifiedSpareConsumables0553} from "./unifiedSpareConsumables0553";
import {selectSpareCoverageEngineering0553} from "./spareCoverageEngineering0553";
import {MR0002_WORKING_BOM_0553} from "./mr0002WorkingBom0553";
import {deriveSpareRiskQuantity0553,deriveConsumableBudgetQuantity0553} from "./spareRiskQuantity0553";
import {selectB11MinimumTools0553} from "./b11MinimumTools0553";
import pttepCandidateData from "./snapshots/pttepSpareCandidateInventory0553.json";
const CODES=Object.freeze(["B10","B11","B13","C1","C2"]);
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const unique=items=>[...new Set(items)];
function fits(category,description,x){
 const d=description.toLowerCase(),m=x.mr,t=x.tag.toUpperCase();
 if(category==="B11"){
  if(/racon/.test(d))return m==="MR-0004"&&t.startsWith("MAR-");
  if(/rf connector/.test(d))return (m==="MR-0001"||m==="MR-0002")&&t.startsWith("ANT-");
  if(/cable termination/.test(d))return t.startsWith("TCAB-");
  return false; // Configuration software is project COMMON and cannot be assigned a single TAG.
 }
 if(category==="B13")return false; // Common preservation consumables, NOT installed SKUs.
 if(/racon/.test(d))return m==="MR-0004"&&(/racon complete/.test(d)?t.startsWith("MAR-"):t.startsWith("TCAB-"));
 if(/scada remote radio/.test(d))return m==="MR-0001"&&t.startsWith("MR-")&&!t.endsWith("A");
 if(/scada|poe/.test(d))return m==="MR-0001"&&t.startsWith("MR-");
 if(/cisco/.test(d))return m==="MR-0001"&&t.startsWith("LAN-");
 if(/ethernet/.test(d))return m==="MR-0001"&&(/^(LAN|SA)-/.test(t));
 if(/telephone|phone/.test(d))return m==="MR-0003"&&t.startsWith("TPH-");
 if(/sounder/.test(d))return m==="MR-0003"&&t.startsWith("LSE-");
 if(/rf surge/.test(d))return m==="MR-0001"&&t.startsWith("SA-")||m==="MR-0002"&&x.functionRole==="RF_SURGE_EXD";
 if(/rf |n-male|7\/8-inch/.test(d))return (m==="MR-0001"||m==="MR-0002")&&t.startsWith("ANT-");
 if(/gland|fuse|relay/.test(d))return t.startsWith("TCAB-")||/fuse/.test(d)&&m==="MR-0001"&&t.startsWith("LAN-");
 if(/cat6a/.test(d))return m==="MR-0001"&&t.startsWith("LAN-");
 return false;
}
const hint=(description)=>{
 const d=description.toLowerCase();
 if(/gland/.test(d))return "Ex certification, thread and installed cable OD must match";
 if(/surge/.test(d))return "Surge rating, RF frequency/impedance or Ethernet PoE ratings must match";
 if(/power|poe/.test(d))return "Match OEM part number, rated input/output voltage and power";
 if(/radio|bda/.test(d))return "Match frequency band, radio configuration, interface and Ex assembly";
 if(/racon/.test(d))return "Match selected RACON manufacturer system configuration";
 if(/software|configuration/.test(d))return "Confirm license/access rights and OEM package inclusions";
 if(/connector|feeder/.test(d))return "Match cable type, impedance and termination series";
 if(/telephone|sounder/.test(d))return "Match Ex certification, voltage, interface and approved model";
 if(/preservation|desiccant|moisture|cleaning|labels/.test(d))return "Preservation/maintenance consumption and handover stock, not installed equipment";
 return "Confirm actual OEM SKU, rating and delivery quantity against MR/DTS/SPIR";
};
const rowStatus=(code)=>code==="B11"?"BUDGETARY_REFERENCE_NOT_POSTED":"EXISTING_REV08_WORKING_SELL_BUDGET";
const budgetUnitFromDescription=d=>{
 const s=d.toLowerCase();
 if(/cable.*\(m\)|cable.*\(meter\)/.test(s))return "m";
 if(/desiccant pack/.test(s))return "pack";
 if(/barrier bag/.test(s))return "bag";
 if(/kit/.test(s))return "kit";
 if(/set|tools and maintenance access|programming and adapter/.test(s))return "set";
 if(/gland.*set|relay.*socket/.test(s))return "set";
 return "ea";
};

const physicalFamily=d=>{
 const v=d.toLowerCase();
 if(/poe/.test(v))return "SCADA_POE";
 if(/cisco power/.test(v))return "CISCO_POWER";
 if(/rf surge/.test(v))return "RF_SURGE";
 if(/ethernet surge/.test(v))return "ETHERNET_SURGE";
 if(/m20/.test(v))return "M20_GLAND";
 if(/fuse/.test(v))return "FUSE";
 if(/n-male/.test(v))return "RF_N_CONNECTOR";
 return null;
};
export function selectSpareCustomerSchedule0553(){
 const master=selectUnifiedSpareConsumables0553(),cover=selectSpareCoverageEngineering0553();
 const b11Requirements=selectB11MinimumTools0553();
 const rows=CODES.flatMap(code=>(master.byCode[code]||[]).map(x=>{
  const installed=cover.installed.filter(a=>fits(code,x.description,a));
  const tags=unique(installed.map(i=>i.tag)),sites=unique(installed.map(i=>i.site));
  const common=code==="B13"||/configuration tools and maintenance access/i.test(x.description);
  const coveredCommon=common?cover.installed:installed;
  const applicableMRs=unique(coveredCommon.map(i=>i.mr));
  const applicableLocations=unique(coveredCommon.map(i=>i.site));
  // A shared common tool/consumable is not a claim of a physical OEM TAG number.
  return Object.freeze({
   id:x.id,code,item:x.item,
   tagNo:tags.length?tags.join(", "):"COMMON",
   linkedMR:applicableMRs,
   linkedLocations:applicableLocations,installedTagKeys:unique(installed.map(i=>i.key)),
   mappingStatus:tags.length?"INSTALLED_TAG_FUNCTIONAL_ASSOCIATION__SPARE_SKU_COMPATIBILITY_OPEN":common?"COMMON_NON_EQUIPMENT_STOCK":"UNMAPPED_LEGACY_PRICE_SCOPE",
   description:x.description,detailSpecification:hint(x.description),
   materials:"As specified for the selected OEM item",qty:x.budgetQty,
   unit:budgetUnitFromDescription(x.description),unitPriceTHB:x.budgetUnitTHB,extendedTHB:x.budgetTotalTHB,
   sourcePriceUSD:x.legacyUnitUSD,sourceId:x.id,sourceRevision:"4-Scope of Supply.xlsx Rev08",workingFxTHBPerUSD:master.fxTHBPerUSD,
   workingStatus:rowStatus(code),costOwner:code,customerReleaseAllowed:false,
   activityBasedQuantityEquation:code==="B13"?deriveConsumableBudgetQuantity0553({}).equationId:null,
   activityBasedQuantityState:code==="B13"?deriveConsumableBudgetQuantity0553({}).status:null,
   possibleOverlap:code==="B13"? "B5 packing material vs separate B13 handover stock must be net reconciled":
    code==="B11"?"OEM Part A included tools/software or previously supplied RACON kit must be credited":
    "Check OEM Part A / separate category delivered-quantity register",
   leadTimeARO:null,option:code.startsWith("C")
  });
 }));
 const byCode=Object.fromEntries(CODES.map(code=>[code,rows.filter(x=>x.code===code)]));
 // NEW current engineering evidence for the EXISTING five commercial modules.
 // The old Rev08 schedule above is AUDIT ONLY and must not seed current prices.
 const currentCandidateRows=pttepCandidateData.items.map(item=>{
  const related=cover.installed.filter(x=>
   (item.relatedMR==="MULTI"||x.mr===item.relatedMR)&&
   item.sites.includes(x.site));
  return Object.freeze({
   ...item,
   id:item.id,
   code:item.owner,
   installedTagsBySite:unique(related.map(x=>x.site+" / "+x.tag)),
   installedTagKeys:unique(related.map(x=>x.key)),
   tagNo:"TBC — Refer to OEM SPIR",
   linkedMR:item.relatedMR==="MULTI"?unique(related.map(x=>x.mr)):[item.relatedMR],
   linkedLocations:item.sites,
   currentRequiredQty:item.derivedRequiredQuantity,
   oemSparePartNumber:item.sparePartNumber,
   verifiedSupplierUnitCostTHB:item.independentSupplierUnitCostTHB,
   currentWorkingSellTHB:null,
   releaseAllowed:false,
   priceStatus:"NOT_ESTABLISHED__PTTEP_OEM_SPIR_REQUIRED",
   sourceId:item.id,
   sourceRevision:"PTTEP STD / MR Rev.C1 / BOD-SPE Rev.C2 / DTS Rev.C1 / AFC LAY / GA",
   sourceModuleId:"bid.budget.working.bc."+item.owner.toLowerCase()
  });
 });
 const currentByCode=Object.fromEntries(CODES.map(code=>[code,
  Object.freeze(currentCandidateRows.filter(x=>x.owner===code))]));
 const currentGroups=pttepCandidateData.groups.map(g=>Object.freeze({
  ...g,code:g.code,
  moduleId:"bid.budget.working.bc."+g.code.toLowerCase()+".detail",
  rows:Object.freeze(currentByCode[g.code].filter(x=>x.group===g.key))
 }));
 if(currentCandidateRows.length!==50||
  new Set(currentCandidateRows.map(x=>x.id)).size!==50||
  currentGroups.reduce((n,g)=>n+g.rows.length,0)!==50||
  pttepCandidateData.documentControl.totalContractKits!==14||
  currentCandidateRows.some(x=>x.currentWorkingSellTHB!==null||x.commercialPostingApproved))
  throw Error("PTTEP current five-owner spare register incomplete or price unexpectedly posted");

 // Do not silently distribute the grand total across tags or add a balancing price line.
 for(const code of CODES){
  const subtotal=round(byCode[code].reduce((n,x)=>n+x.extendedTHB,0));
  const expected=master.budgetTotalsTHB[code];
  if(Math.abs(subtotal-expected)>0.12)throw Error("Rev08 line rounding/source mismatch "+code);
 }
 const site=MR0002_WORKING_BOM_0553.sites.find(s=>s.site==="ZWP20");
 // RFI BDA is installed at the ORIGINAL LNA TAG, NOT at a hardcoded TCAB
 // suffix. ZWP20 uses -002; ZWP21/22 use -001 (reverse surge positions).
 // This 10.3 risk comparison reads actual selected BOM identity without
 // altering the MGW UHF-1 vendor quotation or creating a new spare price.
 const kit=site?.items.find(x=>x.id==="ZWP20-RFI-BDA"&&
  x.tag===site.selectedBdaTag&&x.quoteLine==="UHF-1");
 if(!kit||site.selectedDesign!=="LNA_TO_RFI_BDA_ONLY_SAME_POSITION"||
    site.referenceSurgeTag===site.selectedBdaTag||
    !site.siteTags.includes(site.referenceSurgeTag)||
    kit.qty!==1||kit.currency!=="USD"||kit.unitCost!==31474||
    !site.siteTags.includes(kit.tag))
  throw Error("MR0002/ZWP20 RFI BDA selected AFC LNA-position TAG and MGW UHF-1 quote must match Working BOM");
 const rfiEvidenceRows=site.items.filter(item=>[
  "ZWP20-RFI-BDA","ZWP20-RFI-BDA-EXD-ENCLOSURE",
  "ZWP20-BDA-M20-GLANDS","ZWP20-BDA-RF-FEEDTHROUGHS",
  "ZWP20-BULK-EX-SURGE"
 ].includes(item.id)).map(item=>Object.freeze({
  id:item.id,tag:item.tag,sku:item.sku||null,description:item.description,
  qty:item.qty,unit:item.unit,source:item.source,
  referenceUnitTHB:Number.isFinite(item.unitCost)?round(item.unitCost*(item.currency==="USD"?master.fxTHBPerUSD:1)):null,
  referenceExtendedTHB:Number.isFinite(item.extended)?round(item.extended*(item.currency==="USD"?master.fxTHBPerUSD:1)):null,
  currency:item.currency||null,priceInclusion:item.priceInclusion||null,
  countedInPartA:item.countedInWorkingTotal===true,nonAdditive:item.countedInWorkingTotal!==true,
  status:item.status
 }));
 // Count selected BDA installed bundles at each site's OWN approved
 // LNA physical position, never count a similarly named surge TAG.
 const equipmentInstances=MR0002_WORKING_BOM_0553.sites.filter(w=>
  w.selectedBdaTag&&w.selectedBdaTag!==w.referenceSurgeTag&&
  w.items.some(x=>x.id===w.site+"-RFI-BDA"&&
   x.tag===w.selectedBdaTag&&x.quoteLine==="UHF-1"&&
   x.unitCost===kit.unitCost&&x.qty===1)).length;
 if(equipmentInstances!==3)
  throw Error("MR0002 spare risk installed BDA count must follow three physical BDA positions, not shared TAG suffix");
 const scenario=deriveSpareRiskQuantity0553({installedCount:equipmentInstances,critical:true,
  contractualPartMinimum:null,compatibilityProven:false});
 const riskCandidates=Object.freeze([Object.freeze({
  id:"MR0002-RFI-BDA-REPLACEMENT-RISK",mr:"MR-0002",site:"ZWP20",tagNo:kit.tag,
  moduleId:"bid.budget.bom.mr0002.zwp20.zwp20-rfi-bda.evidence",
  description:"Complete RFI BDA + WAROM Ex d assembly — replacement risk scenario",
  sku:kit.sku,partAEquipmentOwner:"MGW_UHF1_RFI_WAROM_BUNDLED_PACKAGE",
  qty:scenario.budgetQty,unit:"complete set",sourceUnitUSD:kit.unitCost,planningFxTHBPerUSD:master.fxTHBPerUSD,
  comparativeUnitTHB:round(kit.unitCost*master.fxTHBPerUSD),
  comparativeAmountTHB:round((scenario.budgetQty||0)*kit.unitCost*master.fxTHBPerUSD),
  source:kit.source,sourceQuoteLine:kit.quoteLine,
  categoryDecision:"B10_VS_C1_PHYSICAL_STOCK_OWNER_MUST_BE_SELECTED_ONCE",
  priceClass:"PART_A_VENDOR_FULL_PACKAGE_COMPARABLE__NOT_SPARE_SELL_PRICE",
  includedInWorkingSell:false,additionalCostPostedTHB:null,notionalRiskScenarioOnly:true,
  finalSpareSkuVerified:false,contractualMinimumConfirmed:false,
  originalBOM:rfiEvidenceRows,
  warnings:["A replacement spare may be only an OEM internal BDA module rather than complete WAROM assembly; rate is an upper-package comparator, NOT vendor-approved spare price.",
   "Never charge WAROM Ex d enclosure twice; full unit is priced in Part A.",
   "MR0002 Rev.C1 LNA RAD-508-001 versus selected "+site.site+" "+kit.tag+" RFI-BDA remains a technical substitution crosswalk (same original LNA position; other sites may use different TCAB suffix)."]
 })]);
 const crossCategoryDuplicates=unique(rows.map(x=>physicalFamily(x.description)).filter(Boolean)).flatMap(family=>{
  const related=rows.filter(x=>physicalFamily(x.description)===family);
  return unique(related.map(x=>x.code)).length>1?[Object.freeze({
   family,sourceIds:related.map(x=>x.id),categories:unique(related.map(x=>x.code)),
   status:related.some(x=>x.code==="B10")&&related.some(x=>x.code==="C2")?"MR_ATTACHMENT7_EXCLUDES_PRECOM_STARTUP_SPARE_LIST_ITEMS__SKU_CROSSWALK_OPEN":"POTENTIALLY_COMMON_FUNCTION_NOT_PROVEN_SAME_SKU",
   decision:related.some(x=>x.code==="B10")&&related.some(x=>x.code==="C2")?"MR0001–0004 Attachment 7 instruction 6: exclude items listed in pre-commissioning/start-up spares; confirm same OEM part before retaining any C2 item. No automatic silent removal of existing Rev08 candidate.":"Compare separately delivered stock, OEM included parts and category owner; no automatic adjustment."
  })]:[];
 });
 const critical=cover.groups.filter(x=>x.criticality==="COMMISSIONING_CRITICAL_CANDIDATE");
 const engineeringReadiness=Object.freeze({
  installedTagInstances:cover.installed.length,uniqueTagFunctionGroups:cover.groups.length,
  criticalTagFunctionGroups:critical.length,confirmedReplacementSkuGroups:0,
  minimumSpareKitsContractValidated:false,priceEvidenceReconciledToSource:true,
  finalSparePricingCalculated:false,
  b13ActivityQuantityDerived:false,majorSpareProcurementBudgetReconciled:false,
  verdict:"NOT_YET_DEMONSTRATED_FOR_ALL_FOUR_MRS",
  // Zero confirmed here means none is evidenced as confirmed in this model,
  // not that a physical vendor kit is necessarily absent in reality.
  explanation:"Rev08 reference rows priced; delivered physical spare compatibility, contractual minimum and new major-risk allowances are not yet closed."
 });
 const pricedCategorySummary=Object.fromEntries(CODES.map(code=>[code,Object.freeze({
  workingReferenceTHB:master.budgetTotalsTHB[code],
  priceStatus:code==="B11"?"BUDGETARY_CANDIDATE_NOT_IN_WORKING_SELL":"EXISTING_WORKING_BUDGET",
  lineCount:byCode[code].length,options:code.startsWith("C"),
  deltaFromDisplayedRoundedLinesTHB:round(master.budgetTotalsTHB[code]-byCode[code].reduce((n,x)=>n+x.extendedTHB,0))
 })]));
 return Object.freeze({
  moduleId:"bid.budget.working.bc.customer-spare-schedule",
  codes:CODES,rows,byCode,summary:pricedCategorySummary,riskCandidates,crossCategoryDuplicates,b11Requirements,
  currentCandidateRows,currentByCode,currentGroups,currentDocumentControl:pttepCandidateData.documentControl,
  currentWorkingSellByCode:Object.freeze(Object.fromEntries(CODES.map(code=>[code,null]))),
  currentPriceStatus:"PTTEP_REQUIREMENT_FIRST__NO_HISTORICAL_PRICE_CARRY_FORWARD",
  installedSourceCount:cover.installed.length,engineeringReadiness,
  sourceOwnership:"Working BOM/Tag + Rev08 price reference + 10.2 commercial owner",
  riskQuestionAnswered:false,
  missingEngineeringProofs:["EXA-A8 applicable minimum lines by equipment","OEM spare/installed SKU replacement compatibility",
   "B10 kit-per-platform composition","B13 preservation quantity/activity consumption derivation",
   "B11 shared tools OEM-included credit and five EXA-A8 minimum requirements","C1/C2 stock ownership and 2-year repair logistics",
   "B13 activity drivers not yet established; SPQ-003 returns OPEN_INPUT while Rev08 quantity stays a controlled interim budget",
   "Repricing risk additions after management choice"],
  attachment7Control:"MR0001–0004 Rev.C1 Attachment 7 instruction 6 excludes all Pre-Commissioning / Start-up Spare Parts List items from the 2-year Operating Spare Parts List.",
  noAutomaticPricePosting:true,releaseAllowed:false
 });
}
