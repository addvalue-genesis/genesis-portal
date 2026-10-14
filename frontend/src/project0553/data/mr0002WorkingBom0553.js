// MR-0002 single Working BOM derivation. Evidence is not customer release.
// Quote-wide MGW quantities are never multiplied by guessed site quantities.
// Site equipment is an explicit management provisional 1-per-WP distribution.
import {MGW_P26_058_0553} from "./mgwP26058";
import {RFI_BDA_SELECTION_0553} from "./rfiBdaSelected0553";
import {selectMR0002Rate0553} from "./mr0002PriceRegistry0553";

import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import {deriveDtrsRfiBudget0553} from "./dtrsRfiBudgetCalculation0553";
const p=RFI_BDA_SELECTION_0553;
const mgwLines=MGW_P26_058_0553.lines.filter(x=>["UHF-2","UHF-3","UHF-4"].includes(x[0]));
// MGW UHF-2 Yagi, UHF-3 Omni and UHF-4 100m feeder/6 connectors are budget selections; UHF-1 BDA excluded.
const budgetBulk=deriveDtrsRfiBudget0553();
const bySite=Z1F_TEL_LAYOUT_INDEX_0553.byWP
 .filter(w=>w.equipment.some(x=>x.system==="DTRS_TRUNK_RADIO"))
 .map(w=>{
  const site=w.wp,siteTags=new Set(w.equipment.filter(x=>x.system==="DTRS_TRUNK_RADIO").map(x=>x.tag));
  const mappings={"UHF-2":"ANT-508-001","UHF-3":"ANT-508-002","UHF-4":"DTRS-RF-FEEDER-KIT"};
  const equipment=mgwLines.map(([id,sku,description,quotedQty,unitPrice,,group])=>({
   id:site+"-"+id,site,mr:"MR-0002",tag:mappings[id],quoteLine:id,sku,description,
   qty:1,unit:"set",currency:"USD",unitCost:selectMR0002Rate0553(id)?.unitRate??null,extended:selectMR0002Rate0553(id)?.unitRate??null,
   source:"MGW-P26-058",sourceQuoteQty:quotedQty,
   status:["UHF-2","UHF-3","UHF-4"].includes(id)?"MANAGEMENT_SELECTED_MGW_RF_PACKAGE_PROVISIONAL_SITE_QTY":"UNSELECTED_OR_SCOPE_REVIEW",
   owner:["UHF-2","UHF-3","UHF-4"].includes(id)?"MGW_SELECTED_RF_PACKAGE":"VENDOR_EVIDENCE_ONLY",
   countedInWorkingTotal:["UHF-2","UHF-3","UHF-4"].includes(id)
  }));
  const rfiBda={id:site+"-RFI-BDA",site,mr:"MR-0002",tag:"RFI-BDA/LOCATION_TO_VERIFY",
   sku:RFI_BDA_SELECTION_0553.model,description:"RFI BD Series UHF Bi-Directional Amplifier 380-520 MHz; exact subband/options unresolved",
   qty:siteTags.has("TCAB-508-001")?1:null,unit:"set",currency:"USD",unitCost:selectMR0002Rate0553("RFI-BDA").unitRate,extended:siteTags.has("TCAB-508-001")?selectMR0002Rate0553("RFI-BDA").unitRate:null,source:"MGW P26-058 UHF-1 DIFFERENT BRAND PROXY; "+RFI_BDA_SELECTION_0553.document,
   status:"ACTIVE_BUDGETARY_PROXY__NOT_RFI_VENDOR_QUOTE__TECHNICAL_DEVIATION_REQUIRED",owner:"RFI_BDA_BASE_OFFER",countedInWorkingTotal:true,
   benchmarkUSDPerSite:RFI_BDA_SELECTION_0553.pricingBenchmark.historicalMGWHyteraUSD,
   benchmarkSource:RFI_BDA_SELECTION_0553.pricingBenchmark.basis,
   enclosureMarketReferenceEUR:RFI_BDA_SELECTION_0553.pricingBenchmark.exDEnclosureMarketEUR,
   referenceSiteQty:3,referenceQtyBasis:"MR0002 C1 one set each ZWP20/21/22; not a confirmed RFI purchase quantity",
   note:"RFI BD Series is Base Offer. BD3840-0000-24 is conditional ordering candidate, not fixed SKU. Ex d IP66 full assembly and RF/thermal certification mandatory. MGW HYTERA USD13674 is OTHER-BRAND benchmark, not RFI quote. RX3852 LNA is non-additive superseded reference."};
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
   items:[rfiBda,enclosure,gland,rfFeedthrough,...fieldBulk.filter(x=>x.owner!=="HISTORICAL_LNA_BULK_NOT_ADDITIVE"),...equipment],quoteAllocation:"RFI_BDA_BASE_OFFER_WITH_EXD_ENCLOSURE_MGW_YAGI_OMNI_FEEDER_SELECTED_LNA_EVIDENCE_ONLY",
   controlledTotalUSD:[rfiBda,...equipment].filter(x=>x.countedInWorkingTotal&&Number.isFinite(x.extended)).reduce((sum,x)=>sum+x.extended,0),
   controlledTotalTHB:[enclosure,...fieldBulk].filter(x=>x.countedInWorkingTotal&&Number.isFinite(x.extended)).reduce((sum,x)=>sum+x.extended,0),
   scopeWarnings:["RFI BD Series newly selected BDA product family replaces MGW UHF-1 HYTERA TS-9200; exact SKU, vendor quote, quantity and LNA coexistence not approved for cost posting","MGW UHF-2 Yagi and UHF-3 Omni selected; provisional 1 per ZWP20/ZWP21/ZWP22, reconcile site MTO","MGW UHF-3 HYTERA Omni antenna remains selected separately from excluded UHF-1 BDA; UHF-4 includes 100m feeder + six connectors",
    "RFI RX3852 LNA removed from ACTIVE BOM; its historical data is retained separately in price registry, subject to approved BDA technical deviation",
    "Prior DTRS bulk reused; RF-FEEDER / RF-CONNECTOR excluded to prevent overlap with MGW UHF-4",
    "Legacy RX3852 SMA/LNA-specific DC and alarm allowances must not be automatically applied to N-type BDA; verify RF feeder kit against BDA interfaces",
    "DTS requires 4 M20 entries; budget assumes 2 active certified glands and 2 spare stopping plugs per WP. Hawke historical THB1020 per set is rate evidence, not an OEM-approved Ex d SKU",
    "Two RF paths require separate certified assembly treatment and no duplication with original RF surge enclosure"]};
 });
export const MR0002_WORKING_BOM_0553=Object.freeze({
 id:"P553-MR0002-WORKING-BOM",mr:"MR-0002",sites:bySite,
 workingRateSource:p,quotation:MGW_P26_058_0553.id,
 quoteTotalUSD:MGW_P26_058_0553.quotedTotal,
 selectedManufacturer:"RFI",selectedBda:RFI_BDA_SELECTION_0553,status:"RFI_BDA_BASE_OFFER__LNA_SUPERSEDED_NON_ADDITIVE__EXD_ENCLOSURE_AND_DEVIATION_GATED"
});
