// Per-MR reconciliation projection. This module must not create an independent BOM.
// It projects the same controlled site ledgers used by location views, then supplements
// locations that do not yet have a detailed site ledger with clearly-labelled legacy evidence.
import {PROJECT_0553_FACTS} from "../projectFacts";
import {deriveZWP20SiteCost0553} from "./zwp20SiteCost0553";
import {ZWP8_ROW43_COST_TRACE} from "./zwp8Row43CostTrace";
import {MR0001_WORKING_PRICED_BOM} from "./mr0001WorkingPricedBom";
import {MGW_P26_058_0553} from "./mgwP26058";
import {SUPPLIER_QUOTE_LINES_0553} from "./supplierQuoteLines";
import {MR0001_RADIO_ROLE_MATRIX} from "./mr0001RadioRoleMatrix";

const systems=PROJECT_0553_FACTS.systems.map(s=>({
 id:s.mr,name:s.name,rfqSource:s.rfqSource||null
}));
const sites=[...new Set([
 ...MR0001_WORKING_PRICED_BOM.items.map(x=>x.site),
 ...MR0001_RADIO_ROLE_MATRIX.sites.map(x=>x.site),
 ..."ZWP20 ZWP21 ZWP22".split(" ")
])].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
const sourcePrice=(id)=>SUPPLIER_QUOTE_LINES_0553.find(q=>q.id===id);
const mgwBySystem={"MR-0002":["UHF-1","UHF-2","UHF-3","UHF-4"],
 "MR-0003":["PHONE-1"],"MR-0004":["RACON-1"]};
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
 const currencies=[...new Set(evidence.map(e=>e.currency))];
 const subtotals=currencies.map(currency=>({currency,amount:Math.round(evidence.filter(e=>e.currency===currency).reduce((n,e)=>n+e.extended,0)*100)/100}));
 const gaps=mr.id==="MR-0001"?["Detailed site ledger not yet implemented for this location","RF/CAL/OEM quantity and scope ownership must remain source-linked"]:
  mr.id==="MR-0002"?["RFI LNA not included in MGW BDA","Site RF topology, feeder and enclosure take-off"]:
  mr.id==="MR-0003"?["Verify phone package vs sounder/JB/gland scope","Installation cable/terminations"]:
  ["RACON installation accessories, Ex/certification and test"];
 return {site,mr:mr.id,name:mr.name,rfqSource:mr.rfqSource,evidence,subtotals,gaps,
  detailRows:[],projectionSource:"LEGACY_SOURCE_EVIDENCE_NOT_DETAILED_SITE_LEDGER",
  completeness:"PARTIAL_NOT_APPROVED",verifiedTotal:null,
  sourceNote:mr.id==="MR-0001"?"Legacy site evidence pending migration to controlled detailed site ledger":"MGW 3-unit quotation split equally across ZWP20-22 only as reversible budgetary assumption"};
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

const rows=legacyRows.map(r=>r.site==="ZWP20"&&r.mr==="MR-0001"?canonicalZwp20Mr1:r);
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
