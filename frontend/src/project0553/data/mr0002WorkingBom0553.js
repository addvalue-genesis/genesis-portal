// MR-0002 single Working BOM derivation. Evidence is not customer release.
// Quote-wide MGW quantities are never multiplied by guessed site quantities.
// Site equipment is an explicit management provisional 1-per-WP distribution.
import {MGW_P26_058_0553} from "./mgwP26058";
import {RFI_LNA_PRICE_DECISION_0553} from "./rfiLnaPriceDecision0553";
import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import {deriveDtrsRfiBudget0553} from "./dtrsRfiBudgetCalculation0553";
const p=RFI_LNA_PRICE_DECISION_0553;
const round=n=>Math.round(n*100)/100;
const mgwLines=MGW_P26_058_0553.lines.filter(x=>x[0].startsWith("UHF-"));
// MGW HYTERA quotation is retained ONLY as an unselected alternative; do not book as chosen RFI equipment.
const budgetBulk=deriveDtrsRfiBudget0553();
const bySite=Z1F_TEL_LAYOUT_INDEX_0553.byWP
 .filter(w=>w.equipment.some(x=>x.system==="DTRS_TRUNK_RADIO"))
 .map(w=>{
  const site=w.wp,siteTags=new Set(w.equipment.filter(x=>x.system==="DTRS_TRUNK_RADIO").map(x=>x.tag));
  const mappings={"UHF-1":"TCAB-508-001","UHF-2":"ANT-508-001","UHF-3":"ANT-508-002","UHF-4":"DTRS-RF-FEEDER-KIT"};
  const equipment=mgwLines.map(([id,sku,description,quotedQty,unitPrice,,group])=>({
   id:site+"-"+id,site,mr:"MR-0002",tag:mappings[id],quoteLine:id,sku,description,
   qty:1,unit:"set",currency:"USD",unitCost:unitPrice,extended:unitPrice,
   source:"MGW-P26-058",sourceQuoteQty:quotedQty,
   status:"UNSELECTED_MGW_HYTERA_ALTERNATIVE_NOT_RFI",owner:"VENDOR_EVIDENCE_ONLY",
   countedInWorkingTotal:false
  }));
  const lna={id:site+"-RFI-LNA",site,mr:"MR-0002",tag:"TCAB-508-001/RFI-LNA",sku:p.model,
   description:p.product,qty:null,unit:"unit",currency:p.currency,unitCost:p.unitBudgetAllowance,
   extended:null,source:p.decisionSource,status:p.status,
   owner:"RFI_LNA_SEPARATE_FROM_MGW_BDA",countedInWorkingTotal:false,
   note:"No approved physical LNA quantity or location allocation; THB500000/unit is rate only"};
  // These rows are indicative engineering scenarios; they must not be added
  // to the MGW feeder kit automatically because the package already includes RF bulk.
  const fieldBulk=(budgetBulk.find(x=>x.wp===site)?.items||[]).map(b=>({
   id:site+"-BULK-"+b.id,site,mr:"MR-0002",tag:"BULK-"+b.id,
   description:b.item,qty:b.qty,unit:b.unit,currency:"THB",unitCost:b.rate,
   extended:b.amount??null,source:b.source,status:b.state,
   owner:"CONDITIONAL_FIELD_BULK__PACKAGE_OVERLAP_REVIEW",
   countedInWorkingTotal:false
  }));
  return {site,source:Z1F_TEL_LAYOUT_INDEX_0553.source,siteTags:[...siteTags],
   items:[lna,...fieldBulk,...equipment],quoteAllocation:"RFI_SELECTED_MGW_ALTERNATIVES_NOT_COSTED",
   controlledTotalUSD:0,
   scopeWarnings:["RFI is the selected MR-0002 manufacturer; HYTERA is not selected","All MGW UHF quote lines remain alternative evidence only and are excluded from working totals",
    "Management LNA THB500000 rate has no approved site quantity",
    "Field bulk remains separate conditional non-additive scenario"]};
 });
export const MR0002_WORKING_BOM_0553=Object.freeze({
 id:"P553-MR0002-WORKING-BOM",mr:"MR-0002",sites:bySite,
 workingRateSource:p,quotation:MGW_P26_058_0553.id,
 quoteTotalUSD:MGW_P26_058_0553.quotedTotal,
 selectedManufacturer:"RFI",status:"RFI_SELECTED_MGW_HYTERA_EXCLUDED_NO_CUSTOMER_RELEASE"
});
