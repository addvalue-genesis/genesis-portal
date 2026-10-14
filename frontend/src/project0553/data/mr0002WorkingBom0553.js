// MR-0002 single Working BOM derivation. Evidence is not customer release.
// Quote-wide MGW quantities are never multiplied by guessed site quantities.
// Site equipment is an explicit management provisional 1-per-WP distribution.
import {MGW_P26_058_0553} from "./mgwP26058";
import {RFI_BDA_SELECTION_0553} from "./rfiBdaSelected0553";
import {selectMR0002Rate0553} from "./mr0002PriceRegistry0553";
import {RFI_LNA_PRICE_DECISION_0553} from "./rfiLnaPriceDecision0553";
import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import {deriveDtrsRfiBudget0553} from "./dtrsRfiBudgetCalculation0553";
const p=RFI_LNA_PRICE_DECISION_0553;
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
  const lna={id:site+"-RFI-LNA",site,mr:"MR-0002",tag:"TCAB-508-001/RFI-LNA",sku:p.model,
   description:p.product,qty:siteTags.has("TCAB-508-001")?1:null,unit:"unit",currency:p.currency,unitCost:selectMR0002Rate0553("RFI-LNA").unitRate,
   extended:siteTags.has("TCAB-508-001")?selectMR0002Rate0553("RFI-LNA").unitRate:null,source:p.decisionSource,status:"BUDGETARY_ONE_LNA_PER_TAG_FROM_MR_C1_NOT_PROCUREMENT_APPROVED",
   owner:"RFI_LNA_NOT_MGW_BDA",countedInWorkingTotal:siteTags.has("TCAB-508-001"),
   note:"One per tagged TCAB-508-001 provisional MR C1 allowance; confirm exact LNA vs enclosure supply boundary"};
  const rfiBda={id:site+"-RFI-BDA",site,mr:"MR-0002",tag:"RFI-BDA/LOCATION_TO_VERIFY",
   sku:RFI_BDA_SELECTION_0553.model,description:"RFI BD Series UHF Bi-Directional Amplifier 380-520 MHz; exact subband/options unresolved",
   qty:null,unit:"set",currency:null,unitCost:null,extended:null,source:RFI_BDA_SELECTION_0553.document,
   status:RFI_BDA_SELECTION_0553.status,owner:"RFI_BDA_NEW_SELECTED_FAMILY_NOT_HYTERA_UHF1",countedInWorkingTotal:false,
   note:"New BDA family replaces excluded MGW UHF-1 HYTERA model. Exact variant, RF topology, quantity, hazardous-area suitability and current quote must be checked. Separate RFI LNA retained without double count."};
  // Reuse prior bulk calculation; never create a second cost model.
  // MGW UHF-4 includes 100m feeder and six connectors per set; exclude overlapping field cable/connectors.
  const priorBulk=budgetBulk.find(x=>x.wp===site);
  const overlapping=new Set(["RF-FEEDER","RF-CONNECTOR"]);
  const fieldBulk=(priorBulk?.rows||[]).filter(b=>!overlapping.has(b.id)).map(b=>{
   const duplicate=overlapping.has(b.id);
   const allowance=selectMR0002Rate0553(b.id);
   const priceKnown=Number.isFinite(b.amount)||Boolean(allowance);
   return {id:site+"-BULK-"+b.id,site,mr:"MR-0002",tag:"BULK-"+b.id,
    description:b.item,qty:allowance?.qty??b.qty,unit:allowance?.unit??b.unit,currency:"THB",unitCost:allowance?.unitRate??b.rate,
    extended:allowance?Math.round(allowance.qty*allowance.unitRate*100)/100:b.amount??null,source:allowance?.source??b.source,
    priceBasis:allowance?.priceType??"EXISTING_PRIOR_BULK_CALCULATION",
    status:duplicate?"INCLUDED_IN_MGW_UHF4__NOT_ADDITIVE":allowance?"BUDGETARY_ALLOWANCE_SUBJECT_TO_INTERFACE_CONFIRMATION":b.state,
    owner:duplicate?"MGW_UHF4_INCLUDED":"FIELD_BULK_PREVIOUS_BUDGET",
    countedInWorkingTotal:!duplicate&&priceKnown,
    costGap:!duplicate&&!priceKnown?"ACCESSORY_ALLOWANCE_REQUIRES_BASIS":null};
  });
  return {site,source:Z1F_TEL_LAYOUT_INDEX_0553.source,siteTags:[...siteTags],
   items:[lna,rfiBda,...fieldBulk,...equipment],quoteAllocation:"RFI_LNA_MGW_YAGI_OMNI_FEEDER_SELECTED_AND_PRIOR_BULK",
   controlledTotalUSD:equipment.filter(x=>x.countedInWorkingTotal).reduce((sum,x)=>sum+x.extended,0),
   controlledTotalTHB:[lna,...fieldBulk].filter(x=>x.countedInWorkingTotal).reduce((sum,x)=>sum+x.extended,0),
   scopeWarnings:["RFI BD Series newly selected BDA product family replaces MGW UHF-1 HYTERA TS-9200; exact SKU, vendor quote, quantity and LNA coexistence not approved for cost posting","MGW UHF-2 Yagi and UHF-3 Omni selected; provisional 1 per ZWP20/ZWP21/ZWP22, reconcile site MTO","MGW UHF-3 HYTERA Omni antenna remains selected separately from excluded UHF-1 BDA; UHF-4 includes 100m feeder + six connectors",
    "One RFI LNA per tagged site is a budgetary MR C1 assumption, not procurement-approved",
    "Prior DTRS bulk reused; RF-FEEDER / RF-CONNECTOR excluded to prevent overlap with MGW UHF-4",
    "SMA, DC/alarm, surge and enclosure have explicit unverified budgetary allowances; verify Ex approval and supply boundaries before release"]};
 });
export const MR0002_WORKING_BOM_0553=Object.freeze({
 id:"P553-MR0002-WORKING-BOM",mr:"MR-0002",sites:bySite,
 workingRateSource:p,quotation:MGW_P26_058_0553.id,
 quoteTotalUSD:MGW_P26_058_0553.quotedTotal,
 selectedManufacturer:"RFI",selectedBda:RFI_BDA_SELECTION_0553,status:"RFI_BD_BDA_FAMILY_SELECTED__LNA_MGW_ANTENNAS_FEEDER_PRIOR_BULK__NOT_CUSTOMER_RELEASE"
});
