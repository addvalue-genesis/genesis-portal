// MR-0002 single Working BOM derivation. Evidence is not customer release.
// Quote-wide MGW quantities are never multiplied by guessed site quantities.
// Site equipment is an explicit management provisional 1-per-WP distribution.
import {MGW_P26_058_R2_SELECTED_0553} from "./mgwP26058R2Selected0553";
import {MGW_R2_COVER_20261020_0553} from "./mgwP26058R2Cover20261020";
import {RFI_BDA_SELECTION_0553} from "./rfiBdaSelected0553";
import {selectMR0002Rate0553} from "./mr0002PriceRegistry0553";

import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import {deriveDtrsRfiBudget0553} from "./dtrsRfiBudgetCalculation0553";
const p=RFI_BDA_SELECTION_0553;
const mgwLines=MGW_P26_058_R2_SELECTED_0553.lines.filter(x=>["UHF-2","UHF-3","UHF-4"].includes(x.id));
// R2 UHF-1 RFI BDA + WAROM enclosure is a SINGLE quoted package. UHF-2/3/4 likewise bundled.
const budgetBulk=deriveDtrsRfiBudget0553();
const bySite=Z1F_TEL_LAYOUT_INDEX_0553.byWP
 .filter(w=>w.equipment.some(x=>x.system==="DTRS_TRUNK_RADIO"))
 .map(w=>{
  const site=w.wp,siteTags=new Set(w.equipment.filter(x=>x.system==="DTRS_TRUNK_RADIO").map(x=>x.tag));
  const mappings={"UHF-2":"ANT-508-001","UHF-3":"ANT-508-002","UHF-4":"DTRS-RF-FEEDER-KIT"};
  const equipment=mgwLines.map(({id,model:sku,package:description,quantity:quotedQty})=>({
   id:site+"-"+id,site,mr:"MR-0002",tag:mappings[id],quoteLine:id,sku,description,
   qty:1,unit:"set",currency:"USD",unitCost:selectMR0002Rate0553(id)?.unitRate??null,extended:selectMR0002Rate0553(id)?.unitRate??null,
   source:MGW_P26_058_R2_SELECTED_0553.id,sourceQuoteQty:quotedQty,
   status:["UHF-2","UHF-3","UHF-4"].includes(id)?"MANAGEMENT_SELECTED_MGW_RF_PACKAGE_PROVISIONAL_SITE_QTY":"UNSELECTED_OR_SCOPE_REVIEW",
   owner:["UHF-2","UHF-3","UHF-4"].includes(id)?"MGW_SELECTED_RF_PACKAGE":"VENDOR_EVIDENCE_ONLY",
   countedInWorkingTotal:["UHF-2","UHF-3","UHF-4"].includes(id)
  }));
  const r2Bda=selectMR0002Rate0553("UHF-1");
  const quoteUhf1=MGW_P26_058_R2_SELECTED_0553.lines.find(x=>x.id==="UHF-1");
  if(!quoteUhf1||!r2Bda||r2Bda.unitRate!==quoteUhf1.unitPriceUSD||r2Bda.unitRate!==31474||r2Bda.source!==MGW_P26_058_R2_SELECTED_0553.id)throw Error("MR0002 RFI-BDA must match MGW P26-058_R2 UHF-1 supplier quote");
  const rfiBda={id:site+"-RFI-BDA",site,mr:"MR-0002",tag:"TCAB-508-001",quoteLine:"UHF-1",
   sku:r2Bda.model,description:r2Bda.description,
   qty:siteTags.has("TCAB-508-001")?1:null,unit:"set",currency:"USD",
   unitCost:quoteUhf1.unitPriceUSD,extended:siteTags.has("TCAB-508-001")?quoteUhf1.unitPriceUSD:null,
   source:MGW_P26_058_R2_SELECTED_0553.id,sourceQuoteQty:r2Bda.quoteQty,
   status:"MGW_R2_QUOTED_RFI_BDA_AND_WAROM_EXD_BUNDLE__FINAL_TECHNICAL_REVIEW_REQUIRED",
   owner:"MGW_UHF1_RFI_WAROM_BUNDLED_PACKAGE",countedInWorkingTotal:true,
   includedComponents:r2Bda.componentInclusions,
   referenceSiteQty:3,referenceQtyBasis:"Three quote sets allocated provisionally one each to ZWP20, ZWP21, ZWP22; check MTO before bid release",
   note:"RFI BD4345-00N0-AC and WAROM HRMD95-VIIIB Ex d enclosure are BOTH included in USD31474/set; never add BARTEC enclosure as another equipment cost. Confirm Ex d assembly certification, RF penetrations, thermal clearance, electrical interface and approved frequency."
  };
  const enclosure={id:site+"-RFI-BDA-EXD-ENCLOSURE",site,mr:"MR-0002",tag:"TCAB-508-001",sku:"HRMD95-VIIIB",
   description:"WAROM HRMD95-VIIIB Ex d enclosure, included with RFI BD4345-00N0-AC in MGW R2 UHF-1 package",
   qty:siteTags.has("TCAB-508-001")?1:null,unit:"included set",currency:"USD",unitCost:null,extended:null,
   source:MGW_P26_058_R2_SELECTED_0553.id+" / UHF-1",quoteLine:"UHF-1",
   priceInclusion:"INCLUDED_IN_MGW_R2_UHF1",parentPackage:site+"-RFI-BDA",
   status:"PRICE_INCLUDED_IN_UHF1__EXD_ASSEMBLY_COMPLIANCE_VERIFY",
   owner:"MGW_UHF1_WAROM_ENCLOSURE_INCLUDED_NON_ADDITIVE",countedInWorkingTotal:false,
   evidenceState:"INCLUDED_IN_QUOTED_PACKAGE",displayPrice:"INCLUDED IN UHF-1 (USD 31,474 / SET)",
   note:"WAROM enclosure is vendor-quoted inside UHF-1, not a BARTEC EJB-6 procurement item. No separate enclosure price is published. Ex d assembly certification, installed glands, RF feedthroughs, internal clearance and heat dissipation still require technical verification."};
  const glandBasis=RFI_BDA_SELECTION_0553.glandBudgetDesign;
  const gland={id:site+"-BDA-M20-GLANDS",site,mr:"MR-0002",tag:"TCAB-508-001-M20",sku:glandBasis.model,
   description:"M20 Ex-rated Hawke armoured-cable gland, including locknut earth tag washer",
   qty:siteTags.has("TCAB-508-001")?glandBasis.estimatedActivePerSite:null,unit:"set",currency:"THB",unitCost:glandBasis.ratePerSet,
   extended:siteTags.has("TCAB-508-001")?glandBasis.indicativeRatePerSiteTHB:null,source:glandBasis.source,
   priceBasis:"HISTORICAL_BUDGETARY_MATCH_PENDING",status:glandBasis.status,
   owner:"BDA_FIELD_GLAND_BUDGET_SCENARIO__VENDOR_PACKAGE_DEDUCTION_REQUIRED",countedInWorkingTotal:false,
   entryCapacity:glandBasis.dtsNominalM20EntryCapacity,spareStoppingPlugs:glandBasis.estimatedSparePlugsPerSite,
   note:"2 active M20 DC/control candidate entries + 2 spare certified plugs (not 4 glands); indicative THB2040/WP. Ex d, cable OD, installed gland certificates and BARTEC inclusions must be checked. RF N-type ports require separately qualified RF feedthroughs."};
  const rfFeedthrough={id:site+"-BDA-RF-FEEDTHROUGHS",site,mr:"MR-0002",tag:"TCAB-508-001-RF",sku:null,
   description:"Ex d assembly-approved N-type RF feedthroughs and RF surge/interconnect package",qty:siteTags.has("TCAB-508-001")?2:null,unit:"candidate RF ports",currency:null,unitCost:null,extended:null,
   source:"RFI BD Series N(f) RF ports; DTS-0002 C1 Ex d and two RF surge paths",status:"TWO_RF_PATHS_DERIVED__OEM_CERTIFIED_PENETRATION_SKU_PRICE_OPEN",owner:"BDA_RF_FEEDTHROUGH__PACKAGE_INCLUSION_CHECK",countedInWorkingTotal:false,
   note:"Two donor/service RF ports are budgetary interface basis, not confirmed enclosure penetrations. Account for Ex d approved coupling, RF SPD and no duplication with TCAB-508-002 or MGW UHF-4 feeder kit."};
  // Reuse prior bulk calculation; never create a second cost model.
  // MGW UHF-4 includes 100m feeder and six connectors per set; exclude overlapping field cable/connectors.
  const priorBulk=budgetBulk.find(x=>x.wp===site);
  const overlapping=new Set(["RF-FEEDER","RF-CONNECTOR"]);
  const obsoleteLnaBulk=new Set(["RF-SMA","LNA-POWER","LNA-ALARM"]);
  const fieldBulk=(priorBulk?.rows||[]).filter(b=>!overlapping.has(b.id)).map(b=>{
   const duplicate=overlapping.has(b.id);
   const includedSurge=b.id==="EX-SURGE";
   const allowance=includedSurge?null:selectMR0002Rate0553(b.id);
   const priceKnown=Number.isFinite(b.amount)||Boolean(allowance);
   return {id:site+"-BULK-"+b.id,site,mr:"MR-0002",tag:"BULK-"+b.id,
    description:b.item,qty:allowance?.qty??b.qty,unit:allowance?.unit??b.unit,currency:"THB",unitCost:allowance?.unitRate??b.rate,
    extended:allowance?Math.round(allowance.qty*allowance.unitRate*100)/100:b.amount??null,source:allowance?.source??b.source,
    priceBasis:allowance?.priceType??"EXISTING_PRIOR_BULK_CALCULATION",
    status:includedSurge?"PRICE_INCLUDED_IN_UHF2_POLYPHASER__EX_SURGE_COMPLIANCE_VERIFY":obsoleteLnaBulk.has(b.id)?"SUPERSEDED_LNA_INTERFACE__BDA_REDESIGN_REQUIRED":duplicate?"INCLUDED_IN_MGW_UHF4__NOT_ADDITIVE":allowance?"BUDGETARY_ALLOWANCE_SUBJECT_TO_INTERFACE_CONFIRMATION":b.state,
    owner:includedSurge?"MGW_UHF2_POLYPHASER_INCLUDED_NON_ADDITIVE":obsoleteLnaBulk.has(b.id)?"HISTORICAL_LNA_BULK_NOT_ADDITIVE":duplicate?"MGW_UHF4_INCLUDED":"FIELD_BULK_PREVIOUS_BUDGET",
    countedInWorkingTotal:!includedSurge&&!duplicate&&!obsoleteLnaBulk.has(b.id)&&priceKnown,
    ...(includedSurge?{source:MGW_P26_058_R2_SELECTED_0553.id+" / UHF-2; TEL-LAY TCAB-508-002",quoteLine:"UHF-2",sku:"PolyPhaser IS-B50LN-C2",description:"PolyPhaser IS-B50LN-C2 plus Solexy RXNMS0200JX0 included in selected MGW R2 UHF-2 Yagi set; completed Ex assembly for TCAB-508-002 not established",currency:"USD",unitCost:null,extended:null,priceInclusion:"INCLUDED_IN_MGW_R2_UHF2",parentPackage:site+"-UHF-2",evidenceState:"QUOTE_INCLUDED_TECHNICAL_EQUIVALENCE_UNVERIFIED",displayPrice:"INCLUDED IN UHF-2 (USD 847 / SET)",note:"PolyPhaser IS-B50LN-C2 and Solexy RXNMS0200JX0 are included in the quoted Yagi set, without individual prices. Do not add the former THB 25,000 EX-SURGE management allowance. Separate hazardous-area surge assembly requirements remain to be checked against MR, layout and certification; no claim of complete Ex compliance."}:{}),
    costGap:!includedSurge&&!duplicate&&!priceKnown?"ACCESSORY_ALLOWANCE_REQUIRES_BASIS":null};
  });
  return {site,source:Z1F_TEL_LAYOUT_INDEX_0553.source,siteTags:[...siteTags],
   items:[rfiBda,enclosure,gland,rfFeedthrough,...fieldBulk.filter(x=>x.owner!=="HISTORICAL_LNA_BULK_NOT_ADDITIVE"),...equipment],quoteAllocation:"MGW_R2_RFI_BDA_WAROM_EXD_YAGI_OMNI_FEEDER_FOUR_QUOTED_BUNDLES",
   controlledTotalUSD:[rfiBda,...equipment].filter(x=>x.countedInWorkingTotal&&Number.isFinite(x.extended)).reduce((sum,x)=>sum+x.extended,0),
   controlledTotalTHB:[enclosure,...fieldBulk].filter(x=>x.countedInWorkingTotal&&Number.isFinite(x.extended)).reduce((sum,x)=>sum+x.extended,0),
   scopeWarnings:[
    "MGW P26-058_R2 UHF-1 is RFI BD4345-00N0-AC plus WAROM HRMD95-VIIIB as ONE USD31474/set package; historical HYTERA proxy and BARTEC candidate cannot be added",
    "Selected MGW P26-058_R2 UHF-2 USD847 includes YBSS6-99, UNV2, PolyPhaser IS-B50LN-C2 and Solexy RXNMS0200JX0; UHF-4 includes 100m feeder and six connectors per set: do not double-count",
    "Three quotation sets allocated provisionally one each to ZWP20/ZWP21/ZWP22; verify MTO and interfaces",
    "Technical release requires confirmation of approved BDA frequency, Ex d enclosure assembly certification, glands, RF feedthroughs and safety assessment",
    "Legacy LNA parts and references remain non-additive; separate field bulk only where demonstrably excluded from quoted kits"
   ]
};
 });
// Regression gate: every site BDA must inherit the current vendor R2 package,
// never the historical HYTERA cross-brand benchmark.
for(const location of bySite){
 const bda=location.items.find(x=>x.id===location.site+"-RFI-BDA");
 const quoted=MGW_P26_058_R2_SELECTED_0553.lines.find(x=>x.id==="UHF-1");
 if(!bda||!quoted||bda.unitCost!==quoted.unitPriceUSD||
    bda.extended!==quoted.unitPriceUSD||bda.sku!==quoted.model||
    bda.source!==MGW_P26_058_R2_SELECTED_0553.id||
    bda.quoteLine!=="UHF-1"||quoted.unitPriceUSD===RFI_BDA_SELECTION_0553.pricingBenchmark.historicalMGWHyteraUSD){
  throw Error("MR0002 "+location.site+" RFI BDA price/version mismatch: expected current MGW R2 UHF-1");
 }
}
export const MR0002_WORKING_BOM_0553=Object.freeze({
 id:"P553-MR0002-WORKING-BOM",mr:"MR-0002",sites:bySite,
 workingRateSource:p,quotation:MGW_P26_058_R2_SELECTED_0553.id,
 // Quote-wide reference is the LATEST commercial cover; not an MR0002 cost line.
 quoteTotalUSD:MGW_R2_COVER_20261020_0553.overallTotalUSD,quoteTotalClass:"LATEST_OCT20_COMBINED_THREE_SYSTEM_VENDOR_OFFER_NON_ADDITIVE",
 priorDetailedQuoteTotalUSD:MGW_P26_058_R2_SELECTED_0553.overallTotalUSD,
 quoteCoverSource:MGW_R2_COVER_20261020_0553.sourceUrl,
 quoteEquipmentTotalUSD:MGW_P26_058_R2_SELECTED_0553.lines.filter(x=>x.mr==="MR-0002").reduce((n,x)=>n+x.extendedUSD,0),
 quoteServicesTotalUSD:MGW_R2_COVER_20261020_0553.serviceTotalUSD,
 priorDetailedServicesUSD:MGW_P26_058_R2_SELECTED_0553.serviceTotalUSD,
 quoteServicesScope:"SHARED_ACROSS_MR0002_MR0003_MR0004__NON_ADDITIVE_A2__NOT_BOOKED_WORKING_COST",
 selectedManufacturer:"RFI",selectedBda:RFI_BDA_SELECTION_0553,status:"RFI_BDA_BASE_OFFER__LNA_SUPERSEDED_NON_ADDITIVE__EXD_ENCLOSURE_AND_DEVIATION_GATED"
});
