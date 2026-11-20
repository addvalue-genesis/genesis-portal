// MR0003 product-side selected equipment ledger; NOT a customer release.
// The separate wpSystemBulkBudget JB line is informational and NOT additive.
import {MR0003_SELECTED_PRICE_0553 as p} from "./mr0003SelectedPrice0553";
import {deriveMR0003PhoneBulk0553} from "./mr0003PhoneBulkDerivation0553";
const round=n=>Math.round(n*100)/100;
export function deriveMR0003ProductLedger0553(){
 const sites=p.locations.map(site=>{
  const bulk=deriveMR0003PhoneBulk0553(site);
  const lines=[
   {id:"TPH-504-001",description:"GAI-TRONICS Ex SIP phone",qty:1,unitPriceTHB:p.phoneTHB,extendedTHB:p.phoneTHB,source:p.quoteExion,priceClass:"VENDOR_QUOTED"},
   {id:"LSE-504-001",description:"EXION quoted Ex sounder",qty:1,unitPriceTHB:p.sounderTHB,extendedTHB:p.sounderTHB,source:p.quoteExion,priceClass:"VENDOR_QUOTED"},
   {id:"TCAB-504-001",description:"BARTEC GA-1004 8-M20 working enclosure, priced by historical PROSPER Item 3 4-M20 comparable",qty:1,unitPriceTHB:p.jbTHB,extendedTHB:p.jbTHB,source:p.quoteProsper,priceClass:"HISTORICAL_COMPARABLE_CONFIGURATION_GAP"}
  ];
  const knownTHB=round(lines.reduce((s,r)=>s+r.extendedTHB,0));
  return {site,lines,equipmentReferenceTHB:knownTHB,bulkCandidateCircuits:bulk.estimatedCircuitCount,
   bulkCandidateJbGlands:bulk.estimatedActiveGlands,gaM20Capacity:bulk.selectedGaHoleCapacity,
   reservedSpareEntries:bulk.basis.sparePolicy.ga1004SpareAtThreeActive,
   unresolvedBulkCostTHB:null,totalPartATHB:null,
   state:"EQUIPMENT_BUDGET_REFERENCE_ONLY__BULK_NOT_PRICED__GA_PRICE_RECONFIRMATION"};
 });
 return {mr:"MR0003",sites,equipmentReferenceTHB:round(sites.reduce((s,r)=>s+r.equipmentReferenceTHB,0)),
  bulkTHB:null,totalPartATHB:null,counts:{phone:4,sounder:4,jb:4},
  rules:["MGW PHONE-1 is not selected","BARTEC GA-1004 eight holes with 3 provisional active ends, 5 remaining plugs; drain separate","PROSPER item3 quote for FOUR-hole JB is historical rate only","Do not add JB price again in WP system bulk summary","No zero-valued bulk; no released priced Part A until cable type, gland SKU and route quantities are reconciled"]};
}
