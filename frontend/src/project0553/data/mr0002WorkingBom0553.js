// MR-0002 single Working BOM derivation. Evidence is not customer release.
// Quote-wide MGW quantities are never multiplied by guessed site quantities.
// Site equipment is an explicit management provisional 1-per-WP distribution.
import {MGW_P26_058_R2_UHF_0553} from "./mgwP26058R2Uhf0553";
import {RFI_BDA_SELECTION_0553} from "./rfiBdaSelected0553";
import {selectMR0002Rate0553} from "./mr0002PriceRegistry0553";

import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import {deriveDtrsRfiBudget0553} from "./dtrsRfiBudgetCalculation0553";
const p=RFI_BDA_SELECTION_0553;
const mgwLines=MGW_P26_058_R2_UHF_0553.lines.filter(x=>["UHF-2","UHF-3","UHF-4"].includes(x.id));
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
   source:MGW_P26_058_R2_UHF_0553.id,sourceQuoteQty:quotedQty,
   status:["UHF-2","UHF-3","UHF-4"].includes(id)?"MANAGEMENT_SELECTED_MGW_RF_PACKAGE_PROVISIONAL_SITE_QTY":"UNSELECTED_OR_SCOPE_REVIEW",
   owner:["UHF-2","UHF-3","UHF-4"].includes(id)?"MGW_SELECTED_RF_PACKAGE":"VENDOR_EVIDENCE_ONLY",
   countedInWorkingTotal:["UHF-2","UHF-3","UHF-4"].includes(id)
  }));
  const r2Bda=selectMR0002Rate0553("UHF-1");
  const rfiBda={id:site+"-RFI-BDA",site,mr:"MR-0002",tag:"TCAB-508-001",
   sku:r2Bda.model,description:r2Bda.description,
   qty:siteTags.has("TCAB-508-001")?1:null,unit:"set",currency:"USD",
   unitCost:r2Bda.unitRate,extended:siteTags.has("TCAB-508-001")?r2Bda.unitRate:null,
   source:MGW_P26_058_R2_UHF_0553.id,sourceQuoteQty:r2Bda.quoteQty,
   status:"MGW_R2_QUOTED_RFI_BDA_AND_WAROM_EXD_BUNDLE__FINAL_TECHNICAL_REVIEW_REQUIRED",
   owner:"MGW_UHF1_RFI_WAROM_BUNDLED_PACKAGE",countedInWorkingTotal:true,
   includedComponents:r2Bda.componentInclusions,
   referenceSiteQty:3,referenceQtyBasis:"Three quote sets allocated provisionally one each to ZWP20, ZWP21, ZWP22; check MTO before bid release",
   note:"RFI BD4345-00N0-AC and WAROM HRMD95-VIIIB Ex d enclosure are BOTH included in USD31474/set; never add BARTEC enclosure as another equipment cost. Confirm Ex d assembly certification, RF penetrations, thermal clearance, electrical interface and approved frequency."
  };
  const enclosure={id:site+"-RFI-BDA-EXD-ENCLOSURE",site,mr:"MR-0002",tag:"TCAB-508-001",sku:null,
   description:"BARTEC EJB-6 Ex d IP66 minimum-fit assembly budget reference (RF feedthroughs not costed)",qty:siteTags.has("TCAB-508-001")?1:null,unit:"set",currency:"THB",unitCost:null,extended:null,
   source:"DTS-0002 C1 sheets 4/6; SPE-0001 C2; BDA size 620x450x270 mm",
   status:"SELECTED_EJB6_DIMENSIONAL_CANDIDATE__PRICE_UNVERIFIED__HISTORICAL_PANEL_THB436100_NOT_COMPARABLE",owner:"BARTEC_BDA_ENCLOSURE_BUDGET_OWNER",countedInWorkingTotal:false,
   referenceMarketEUR:RFI_BDA_SELECTION_0553.pricingBenchmark.exDEnclosureMarketEUR,historicalProsperAssembledPanelTHB:436100,
   note:"Do not use historical THB436100 TETRA assembled panel as EJB6 empty enclosure cost. BARTEC EJB6 internal envelope 540x760x353mm leaves 90x140x83mm gross clearance around 450x620x270mm BDA and needs a separately scoped engineered assembly quote; exact price not verified. Confirm internal clearances, 24V load, thermal rating, certified penetrations, glands, IP66 and assembly certificate."};
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
   const allowance=selectMR0002Rate0553(b.id);
   const priceKnown=Number.isFinite(b.amount)||Boolean(allowance);
   return {id:site+"-BULK-"+b.id,site,mr:"MR-0002",tag:"BULK-"+b.id,
    description:b.item,qty:allowance?.qty??b.qty,unit:allowance?.unit??b.unit,currency:"THB",unitCost:allowance?.unitRate??b.rate,
    extended:allowance?Math.round(allowance.qty*allowance.unitRate*100)/100:b.amount??null,source:allowance?.source??b.source,
    priceBasis:allowance?.priceType??"EXISTING_PRIOR_BULK_CALCULATION",
    status:obsoleteLnaBulk.has(b.id)?"SUPERSEDED_LNA_INTERFACE__BDA_REDESIGN_REQUIRED":duplicate?"INCLUDED_IN_MGW_UHF4__NOT_ADDITIVE":allowance?"BUDGETARY_ALLOWANCE_SUBJECT_TO_INTERFACE_CONFIRMATION":b.state,
    owner:obsoleteLnaBulk.has(b.id)?"HISTORICAL_LNA_BULK_NOT_ADDITIVE":duplicate?"MGW_UHF4_INCLUDED":"FIELD_BULK_PREVIOUS_BUDGET",
    countedInWorkingTotal:!duplicate&&!obsoleteLnaBulk.has(b.id)&&priceKnown,
    costGap:!duplicate&&!priceKnown?"ACCESSORY_ALLOWANCE_REQUIRES_BASIS":null};
  });
  return {site,source:Z1F_TEL_LAYOUT_INDEX_0553.source,siteTags:[...siteTags],
   items:[rfiBda,enclosure,gland,rfFeedthrough,...fieldBulk.filter(x=>x.owner!=="HISTORICAL_LNA_BULK_NOT_ADDITIVE"),...equipment],quoteAllocation:"MGW_R2_RFI_BDA_WAROM_EXD_YAGI_OMNI_FEEDER_FOUR_QUOTED_BUNDLES",
   controlledTotalUSD:[rfiBda,...equipment].filter(x=>x.countedInWorkingTotal&&Number.isFinite(x.extended)).reduce((sum,x)=>sum+x.extended,0),
   controlledTotalTHB:[enclosure,...fieldBulk].filter(x=>x.countedInWorkingTotal&&Number.isFinite(x.extended)).reduce((sum,x)=>sum+x.extended,0),
   scopeWarnings:[
    "MGW P26-058_R2 UHF-1 is RFI BD4345-00N0-AC plus WAROM HRMD95-VIIIB as ONE USD31474/set package; historical HYTERA proxy and BARTEC candidate cannot be added",
    "R2 UHF-2 Yagi includes clamp and PolyPhaser; R2 UHF-4 includes 100m feeder and six connectors per set: do not double-count accessories",
    "Three quotation sets allocated provisionally one each to ZWP20/ZWP21/ZWP22; verify MTO and interfaces",
    "Technical release requires confirmation of approved BDA frequency, Ex d enclosure assembly certification, glands, RF feedthroughs and safety assessment",
    "Legacy LNA parts and references remain non-additive; separate field bulk only where demonstrably excluded from quoted kits"
   ]
};
 });
export const MR0002_WORKING_BOM_0553=Object.freeze({
 id:"P553-MR0002-WORKING-BOM",mr:"MR-0002",sites:bySite,
 workingRateSource:p,quotation:MGW_P26_058_R2_UHF_0553.id,
 quoteTotalUSD:MGW_P26_058_R2_UHF_0553.overallTotalUSD,
 quoteEquipmentTotalUSD:MGW_P26_058_R2_UHF_0553.equipmentTotalUSD,
 quoteServicesTotalUSD:MGW_P26_058_R2_UHF_0553.servicesTotalUSD,
 selectedManufacturer:"RFI",selectedBda:RFI_BDA_SELECTION_0553,status:"RFI_BDA_BASE_OFFER__LNA_SUPERSEDED_NON_ADDITIVE__EXD_ENCLOSURE_AND_DEVIATION_GATED"
});
