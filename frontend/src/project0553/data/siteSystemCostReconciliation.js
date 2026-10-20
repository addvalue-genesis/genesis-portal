// Per-MR reconciliation projection. This module must not create an independent BOM.
// It projects the same controlled site ledgers used by location views, then supplements
// locations that do not yet have a detailed site ledger with clearly-labelled legacy evidence.
import {PROJECT_0553_FACTS} from "../projectFacts";
import {deriveZWP20SiteCost0553} from "./zwp20SiteCost0553";
import {ZWP8_ROW43_COST_TRACE} from "./zwp8Row43CostTrace";
import {MR0001_WORKING_PRICED_BOM} from "./mr0001WorkingPricedBom";
import {MGW_P26_058_0553} from "./mgwP26058";
import {MGW_P26_058_R2_SELECTED_0553} from "./mgwP26058R2Selected0553";
import {MR0002_WORKING_BOM_0553} from "./mr0002WorkingBom0553";
import {MR0003_MGW_WORKING_BOM_0553} from "./mr0003MgwWorkingBom0553";
import {MR0004_WORKING_BOM_0553} from "./mr0004WorkingBom0553";
import {SUPPLIER_QUOTE_LINES_0553} from "./supplierQuoteLines";
import {MR0001_RADIO_ROLE_MATRIX} from "./mr0001RadioRoleMatrix";
import {deriveWpSystemBulkBudget0553} from "./wpSystemBulkBudget0553";

const systems=PROJECT_0553_FACTS.systems.map(s=>({
 id:s.mr,name:s.name,rfqSource:s.rfqSource||null
}));
const sites=[...new Set([
 ...MR0001_WORKING_PRICED_BOM.items.map(x=>x.site),
 ...MR0001_RADIO_ROLE_MATRIX.sites.map(x=>x.site),
 ..."ZWP20 ZWP21 ZWP22".split(" ")
])].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
const sourcePrice=(id)=>SUPPLIER_QUOTE_LINES_0553.find(q=>q.id===id);
const mgwBySystem={"MR-0002":["UHF-1","UHF-2","UHF-3","UHF-4"]};
// EXION THAI QT 1260576 (4 quoted each); PROSPER JB is 2024 historical Zawtika 1E comparator, not a current 1F firm quote.
export const MR0003_LEGACY_EXION_RATE_EVIDENCE_0553=Object.freeze({phone:{sku:"212-02-6008-510",rateTHB:145000,quotedQty:4},sounder:{sku:"DB3BDG048N2BNR",rateTHB:62000,quotedQty:4},jb:{sku:"BARTEC-EX-E-TELEPHONE-JB",rateTHB:24500,quotedQty:4,referenceOnly:true},siteBudgetQty:1,assignedSites:["ZWP20","ZWP21","ZWP22"],unallocatedExionQty:1,exionQuote:"1260576",prosperQuote:"Q-PROSRY-24051"});
// Selected current MR0003 quote: single MGW PHONE-1 package across four
// sites; EXION 2026 and PROSPER 2024 preserved as historic comparison only.
export const MR0003_SELECTED_RATE_EVIDENCE_0553=Object.freeze({
 quoteId:MGW_P26_058_R2_SELECTED_0553.id,
 quoteNumber:MGW_P26_058_R2_SELECTED_0553.quoteNumber,
 supplier:"MGW Technologies Pte Ltd",
 currency:"USD",sites:["ZWP20","ZWP21","ZWP22","ZWP23"],
 phone:{sku:"212-02-6008-410",quotedQty:4,packageUnitUSD:6400},
 sounder:{sku:"DB3B",quotedQty:4,priceInclusion:"MGW_PHONE1"},
 jb:{sku:"BXJ-S",quotedQty:4,priceInclusion:"MGW_PHONE1"},
 legacyEXION:"1260576",legacyPROSPER:"Q-PROSRY-24051",
 canonicalBOM:"MR0003_MGW_WORKING_BOM_0553",
 selectedWorkingSupplier:true,releaseAllowed:false
});
const normalizedMGW=MGW_P26_058_0553.lines.map(([id,sku,description,qty,unit,extended,group])=>({id,sku,description,qty,unit,extended,group}));
const sharedMGW=normalizedMGW.filter(x=>x.id.startsWith("SERV-"));
const checkedAmount=(row)=>row.qty*row.unit;

const legacyRows=sites.flatMap(site=>systems.map(mr=>{
 const evidence=[];
 if(mr.id==="MR-0001"){
  const matches=MR0001_WORKING_PRICED_BOM.items.filter(x=>x.site===site&&Number.isFinite(x.indicativePackageCostTHB));
  for(const x of matches)evidence.push({source:"VST-0048-RE1",line:x.sourceTag,description:"Cisco LAN working package",sourceQty:x.sourceScopeQty,assumedQty:x.sourceScopeQty,currency:"THB",unit:MR0001_WORKING_PRICED_BOM.cisco.unitPackageQuotedSumTHB,extended:x.indicativePackageCostTHB,kind:"PROVISIONAL_SITE_QUOTE_BUNDLE"});
 }
 if(site==="ZWP8"&&mr.id==="MR-0001"){
  const chosen=ZWP8_ROW43_COST_TRACE.referenceScenarios.find(x=>x.id===ZWP8_ROW43_COST_TRACE.preferredScenarioId);
  if(chosen&&Number.isFinite(chosen.partialEquipmentUSD)){
   evidence.push({source:"NG-260916",line:"MTO43:4FT",description:"Two remote-radio assemblies + two 4ft antenna candidates (partial only)",
    sourceQty:null,assumedQty:1,currency:"USD",unit:chosen.partialEquipmentUSD,extended:chosen.partialEquipmentUSD,
    kind:"BUDGETARY_PREFERRED_PARTIAL__NOT_APPROVED"});
  }
 }
 if(["ZWP20","ZWP21","ZWP22"].includes(site)&&mgwBySystem[mr.id]){
  for(const v of normalizedMGW.filter(row=>mgwBySystem[mr.id].includes(row.id))){
   if(v.qty!==3)throw Error("MGW site scenario quantity changed: "+v.id);
   evidence.push({source:"MGW-P26-058",line:v.id,description:v.description,sourceQty:v.qty,assumedQty:1,
    currency:"USD",unit:v.unit,extended:v.unit,kind:"PROVISIONAL_EQUAL_SPLIT_3_SITES"});
  }
 }
 if(mr.id==="MR-0003"&&MR0003_LEGACY_EXION_RATE_EVIDENCE_0553.assignedSites.includes(site)){
  const e=MR0003_LEGACY_EXION_RATE_EVIDENCE_0553;
  for(const x of [
   {line:"PHONE-1",description:"GAI-TRONICS Auteldac 6 Ex VoIP Phone / "+e.phone.sku,rate:e.phone.rateTHB,source:"EXION THAI QT "+e.exionQuote,kind:"2026_QUOTED_RATE__ONE_PER_SITE_PROVISIONAL"},
   {line:"SOUNDER-1",description:"Ex sounder / "+e.sounder.sku,rate:e.sounder.rateTHB,source:"EXION THAI QT "+e.exionQuote,kind:"2026_QUOTED_RATE__ONE_PER_SITE_PROVISIONAL"},
   {line:"JB-1",description:"BARTEC Ex e Telephone Junction Box assembly, historical 1E analogue",rate:e.jb.rateTHB,source:"PROSPER "+e.prosperQuote+" 2024 (historical Zawtika 1E)",kind:"HISTORICAL_COMPARABLE_1E_NOT_1F_VENDOR_CONFIRMATION"}
  ])evidence.push({source:x.source,line:x.line,description:x.description,sourceQty:4,assumedQty:1,currency:"THB",unit:x.rate,extended:x.rate,kind:x.kind});
 }
 if(mr.id==="MR-0003"&&["ZWP20","ZWP21","ZWP22"].includes(site)){
  const phoneBulk=deriveWpSystemBulkBudget0553().find(w=>w.wp===site)?.systems.find(s=>s.id==="EX_IP_PHONE")?.items||[];
  // Existing PROSPER JB-1 is the price owner. Expose only external field bulk as
  // distinct unresolved engineering lines; no false zero cost or duplicate JB.
  for(const b of phoneBulk.filter(x=>x.id!=="EX-PHONE-JB")){
   evidence.push({source:b.source,line:b.id,description:b.item,
    sourceQty:null,assumedQty:Number.isFinite(b.qty)?b.qty:null,
    currency:"THB",unit:Number.isFinite(b.rateTHB)?b.rateTHB:null,
    extended:Number.isFinite(b.extendedTHB)?b.extendedTHB:null,
    kind:b.status+"__FIELD_BULK_PRICE_OR_ROUTE_PENDING",
    costOwner:b.owner,notes:b.note});
  }
 }
 const currencies=[...new Set(evidence.filter(e=>Number.isFinite(e.extended)).map(e=>e.currency))];
 const subtotals=currencies.map(currency=>({currency,amount:Math.round(evidence.filter(e=>e.currency===currency&&Number.isFinite(e.extended)).reduce((n,e)=>n+e.extended,0)*100)/100}));
 const gaps=mr.id==="MR-0001"?["Detailed site ledger not yet implemented for this location","RF/CAL/OEM quantity and scope ownership must remain source-linked"]:
  mr.id==="MR-0002"?["RFI LNA not included in MGW BDA","Site RF topology, feeder and enclosure take-off"]:
  mr.id==="MR-0003"?["EXION quoted 4 phones and 4 sounders; only 3 are provisionally allocated here, fourth is UNALLOCATED","PROSPER JB THB 24,500 is 2024 Zawtika 1E comparator, requote required","Confirm site tag allocation, Ex JB configuration and installation cable/terminations"]:
  ["RACON installation accessories, Ex/certification and test"];
 return {site,mr:mr.id,name:mr.name,rfqSource:mr.rfqSource,evidence,subtotals,gaps,
  detailRows:[],projectionSource:"LEGACY_SOURCE_EVIDENCE_NOT_DETAILED_SITE_LEDGER",
  completeness:"PARTIAL_NOT_APPROVED",verifiedTotal:null,
  sourceNote:mr.id==="MR-0001"?"Legacy site evidence pending migration to controlled detailed site ledger":mr.id==="MR-0003"?"EXION THAI 2026 telephone/sounder rates + PROSPER 2024 JB comparable. Fourth EXION set not allocated. MGW excluded from selected MR0003 pricing.":"MR-specific evidence projection, not final release"};
}));

// Canonical ZWP20 source: this is EXACTLY the same derived ledger rendered by bid.budget.bom.zwp20.
// Reconciliation only changes grouping from Location -> MR; it must not recalculate or re-price these rows.
const zwp20=deriveZWP20SiteCost0553();
const canonicalZwp20Mr1={
 site:zwp20.site,mr:zwp20.system,
 name:systems.find(s=>s.id===zwp20.system)?.name||zwp20.system,
 rfqSource:systems.find(s=>s.id===zwp20.system)?.rfqSource||null,
 evidence:zwp20.rows.filter(r=>Number.isFinite(r.extended)).map(r=>({
  source:r.basis,line:`MTO-${r.row}`,description:r.description,sourceQty:r.sourceQty,assumedQty:r.sourceQty,
  currency:r.currency,unit:r.unitCost,extended:r.extended,kind:r.status
 })),
 detailRows:zwp20.rows,
 subtotals:Object.entries(zwp20.subtotals).filter(([,amount])=>Number.isFinite(amount)).map(([currency,amount])=>({currency,amount})),
 gaps:zwp20.gaps.map(r=>`${r.tag||("row "+r.row)}: ${r.status}`),
 projectionSource:"CANONICAL_ZWP20_SITE_LEDGER",
 completeness:zwp20.status,verifiedTotal:null,
 sourceNote:"Same row objects and subtotals as PJ2608-0553 / bid.budget.bom.zwp20; presentation grouped under MR-0001."
};

// A single active selected BOM is reused in reconciliation views. Historical
// EXION / PROSPER and original MGW P26-058 remain source comparisons only.
const selectedSystemRows=[
 ...MR0002_WORKING_BOM_0553.sites.map(s=>({site:s.site,mr:"MR-0002",
  name:"DMR/RFI BDA — MGW P26-058_R2",evidence:[],
  detailRows:s.items,subtotals:[{currency:"USD",amount:s.controlledTotalUSD}],
  gaps:s.scopeWarnings,projectionSource:"MGW_R2_SELECTED_MR0002",completeness:"WORKING_TECH_HOLD"})),
 ...MR0003_MGW_WORKING_BOM_0553.sites.map(s=>({site:s.site,mr:"MR-0003",
  name:"Ex Phone / Gai-Tronics EATON WAROM — MGW P26-058_R2",evidence:[],
  detailRows:s.items,subtotals:[{currency:"USD",amount:s.controlledTotalUSD}],
  gaps:s.gaps,projectionSource:"MGW_R2_SELECTED_MR0003",completeness:"WORKING_TECH_HOLD"})),
 ...MR0004_WORKING_BOM_0553.sites.map(s=>({site:s.site,mr:"MR-0004",
  name:"Marine RACON — MGW Tideland SeaBeacon 2",evidence:[],
  detailRows:s.items,subtotals:[{currency:"USD",amount:s.controlledTotalUSD}],
  gaps:s.gaps,projectionSource:"MGW_R2_SELECTED_MR0004",completeness:"WORKING_TECH_HOLD"}))
];
const rows=legacyRows.map(r=>r.site==="ZWP20"&&r.mr==="MR-0001"?
 canonicalZwp20Mr1:
 selectedSystemRows.find(v=>v.site===r.site&&v.mr===r.mr)||r);
for(const selected of selectedSystemRows){
 if(!rows.some(r=>r.site===selected.site&&r.mr===selected.mr))rows.push(selected);
}
const byMr=systems.map(mr=>({
 ...mr,
 rows:rows.filter(r=>r.mr===mr.id),
 sites:rows.filter(r=>r.mr===mr.id).map(r=>r.site)
}));
const mgwSharedAmount=sharedMGW.reduce((sum,r)=>sum+checkedAmount(r),0);
const mgwProductQuotedAmount=normalizedMGW.filter(x=>!x.id.startsWith("SERV-")).reduce((sum,r)=>sum+checkedAmount(r),0);
if(mgwSharedAmount+mgwProductQuotedAmount!==MGW_P26_058_0553.quotedTotal)throw Error("MGW reconciliation to original failed");

export const SITE_SYSTEM_COST_RECONCILIATION_0553=Object.freeze({
 id:"P553-MR-BOM-RECON",basis:"SINGLE_LEDGER_MULTI_PROJECTION",
 sites,systems,rows,byMr,
 canonicalBindings:[{view:"bid.budget.bom.zwp20",mr:"MR-0001",site:"ZWP20",source:"deriveZWP20SiteCost0553"}],
 mgwSelectedQuote:MGW_P26_058_R2_SELECTED_0553.id,
 mgwSelectedEquipmentUSD:MGW_P26_058_R2_SELECTED_0553.equipmentTotalUSD,
 mgwSelectedOverallUSD:MGW_P26_058_R2_SELECTED_0553.overallTotalUSD,
 mgwOriginalQuoteClass:"HISTORICAL_COMPARATOR_NOT_SELECTED",
 mgwSharedUSD:mgwSharedAmount,mgwProductQuotedUSD:mgwProductQuotedAmount,
 mgwQuoteUSD:MGW_P26_058_0553.quotedTotal,
 nextGQuoteUSD:sourcePrice("NG-260916")?.quotedTotal??null,
 nextGSiteAllocatedUSD:null,siteFinalTotals:null,projectFinalTotal:null,
 rules:[
  "Reconciliation is a projection, never a second BOM.",
  "A detailed site ledger must be rendered unchanged when shown inside its MR.",
  "Each MR header must expose its controlling RFQ MR source.",
  "Do not sum unlike currencies without sourced FX."
 ],
 validity:"NO_CUSTOMER_RELEASE"
});
