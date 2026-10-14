// Controlled MR0002 commercial price evidence. Not a new BOM or supplier quotation.
import {MGW_P26_058_0553} from "./mgwP26058";
import {RFI_LNA_PRICE_DECISION_0553} from "./rfiLnaPriceDecision0553";
import {RFI_BDA_SELECTION_0553} from "./rfiBdaSelected0553";
import {RF_AND_PATCH_REFERENCE_0553} from "./rfAndPatchReference0553";
const allowance=[
 ["RF-SMA",2,"pc",1138.31,"WEB_ANALOG","https://www.digikey.co.th/en/products/detail/crystek-corporation/CCSMA-MM-RG316DS-12/1867560","SMA RF pigtail, benchmark only"],
 ["LNA-POWER",1,"lot",3500,"MANAGEMENT_ALLOWANCE","RFI A2671 / DC cable interface","DC power cable and mating plug"],
 ["LNA-ALARM",1,"lot",3500,"MANAGEMENT_ALLOWANCE","RFI A2881 / alarm interface","Alarm cable and mating plug"],
 ["EX-SURGE",1,"lot",25000,"MANAGEMENT_ALLOWANCE","TCAB-508-002 Ex protection scope","Ex RF surge assembly"],
 ["LNA-BOX",1,"lot",57939.81,"WEB_ANALOG_NOT_SPEC_MATCHED","https://th.rs-online.com/web/p/wall-boxes/2289468","Ex enclosure allowance; certification/size to verify"]
];
const mgw=MGW_P26_058_0553.lines.filter(x=>["UHF-1","UHF-2","UHF-3","UHF-4"].includes(x[0])).map(x=>({
 id:x[0],supplier:"MGW",manufacturer:x[0]==="UHF-1"?"HYTERA":x[0]==="UHF-2"?"SINCLAIR":x[0]==="UHF-3"?"HYTERA":"FORLLER",
 model:x[1],description:x[2],currency:"USD",unitRate:x[4],quoteQty:x[3],
 source:MGW_P26_058_0553.id,priceType:"SUPPLIER_QUOTE",
 selected:x[0]!=="UHF-1",selectionStatus:x[0]==="UHF-1"?"UNSELECTED_BDA":"BUDGETARY_SELECTED"
}));
const lna=RFI_LNA_PRICE_DECISION_0553;
export const MR0002_PRICE_REGISTRY_0553=Object.freeze([
 {id:"RFI-LNA",supplier:lna.supplierWorkingAssignment,manufacturer:"RFI",model:lna.model,
  description:lna.product,currency:lna.currency,unitRate:lna.unitBudgetAllowance,
  source:lna.decisionSource,priceType:"HISTORICAL_SUPERSEDED_NOT_ACTIVE",selected:false,
  selectionStatus:"SUPERSEDED_BY_RFI_BDA_BASE_OFFER"},
 {id:"RFI-BDA",supplier:"ENGINEERING BUDGET PROJECTION",manufacturer:"RFI",model:"BD Series (ordering code conditional)",description:"RFI BD Series UHF BDA equipment only; HYTERA quote proxy for budget",currency:"USD",unitRate:RFI_BDA_SELECTION_0553.pricingBenchmark.historicalMGWHyteraUSD,qty:1,unit:"set",source:"MGW P26-058 UHF-1 different-brand historical comparator",priceType:"CROSS_BRAND_BUDGETARY_PROXY_NOT_RFI_QUOTE",selected:true,selectionStatus:"MANAGEMENT_BASE_OFFER__PRICE_REPLACEABLE"},
 {id:"RFI-BDA-EXD-ENCLOSURE",supplier:"ENGINEERING BUDGET PROJECTION",manufacturer:"BARTEC",model:"EJB-7 Ex d IP66 design candidate",description:"BARTEC Ex d enclosure historical comparable; no certified assembly price yet",currency:"THB",unitRate:null,historicalComparableTHB:RFI_BDA_SELECTION_0553.pricingBenchmark.referenceEnclosureAllowanceTHB,qty:1,unit:"set",source:"PROSPER Q-PROSRY-24051 Rev0 Item5 historical Ex d panel",priceType:"HISTORICAL_DIFFERENT_CONFIGURATION_COMPARABLE",selected:true,selectionStatus:"EJB7_PRICE_UNVERIFIED__HISTORICAL_ASSEMBLY_RATE_NOT_USABLE"},
 ...mgw,
 ...allowance.map(([id,qty,unit,unitRate,priceType,source,description])=>({
  id,supplier:"MANAGEMENT / WEB REFERENCE",manufacturer:"TO_BE_SELECTED",model:id,description,
  currency:"THB",unitRate,qty,unit,source,priceType,selected:!["LNA-POWER","LNA-ALARM","RF-SMA","LNA-BOX"].includes(id),
  selectionStatus:["LNA-POWER","LNA-ALARM","RF-SMA","LNA-BOX"].includes(id)?"SUPERSEDED_LNA_ONLY":"BUDGETARY_ONLY_OEM_CERTIFICATION_PENDING"
 }))
]);
export const selectMR0002Rate0553=id=>MR0002_PRICE_REGISTRY_0553.find(x=>x.id===id);
