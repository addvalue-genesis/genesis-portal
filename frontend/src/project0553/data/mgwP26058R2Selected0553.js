// PJ2608-0553 / MGW P26-058_R2 (combined quote) — 2026-10-20 management-selected
// MGW's original quotation P26-058 and separate R2 UHF-only offer are preserved.
// This is the SELECTED OEM PACKAGE EVIDENCE for MR0002–MR0004, NOT approval
// of vendor compliance, EXW freight, site bulk, internal direct cost, or release.
const source="https://drive.google.com/file/d/1DLaku-mj2uYI-7A_E3z5QFZQgbz6OozA/view";
const row=(id,mr,sites,manufacturer,model,qty,unitUSD,components)=>Object.freeze({
 id,mr,sites,manufacturer,model,quantity:qty,unit:"set",currency:"USD",
 unitPriceUSD:unitUSD,extendedUSD:qty*unitUSD,
 includedComponents:Object.freeze(components.slice()),
 componentInclusions:Object.freeze(components.slice()),
 package:components.join("; "),
 datasheets:Object.freeze([]),
 quotedPriceOwner:id,source,postAdditionalIncludedComponents:false,
 vendorQuoteStatus:"MGW_P26_058_R2_COMBINED__SELECTED_WORKING_OEM_QUOTE"
});
export const MGW_P26_058_R2_SELECTED_0553=Object.freeze({
 id:"MGW-P26-058-R2-COMBINED-20261020",supplier:"MGW Technologies Pte Ltd",
 quoteNumber:"P26-058_R2",document:"Q26-058 PTTEPI MM-ZTK Phase 1F_Rev2.pdf",
 quoteDate:"2026-09-21",receivedReviewedDate:"2026-10-20",currency:"USD",
 source,selection:"MANAGEMENT_SELECTED_20261020",frozenRev03PostingAllowed:false,
 sitesByMR:Object.freeze({
  "MR-0002":["ZWP20","ZWP21","ZWP22"],
  "MR-0003":["ZWP20","ZWP21","ZWP22","ZWP23"],
  "MR-0004":["ZWP20","ZWP21","ZWP22"]
 }),
 lines:Object.freeze([
  row("UHF-1","MR-0002",["ZWP20","ZWP21","ZWP22"],"RFI / WAROM","BD4345-00N0-AC + HRMD95-VIIIB",3,31474,
   ["RFI BD4345-00N0-AC UHF BDA 430–450 MHz","WAROM HRMD95-VIIIB Ex d protective enclosure 800×540×270 internal","wall-mounted components"]),
  row("UHF-2","MR-0002",["ZWP20","ZWP21","ZWP22"],"RFI / PolyPhaser / Solexy","YBSS6-99 + UNV2 + IS-B50LN-C2 + RXNMS0200JX0",3,847,
   ["RFI YBSS6-99 6-element Yagi antenna","UNV2 stainless steel universal angle clamp",
    "PolyPhaser IS-B50LN-C2 bulkhead coax surge protector","Solexy RXNMS0200JX0 Ex antenna coupler with embedded coax"]),
  row("UHF-3","MR-0002",["ZWP20","ZWP21","ZWP22"],"KBT / Kenbotong","TQJ-400AD5",3,21,
   ["KBT TQJ-400AD5 5dBi UHF omni 400–470 MHz N-female"]),
  row("UHF-4","MR-0002",["ZWP20","ZWP21","ZWP22"],"FORLLER",'RF LLF 1/2" 50',3,846,
   ["100m 1/2-inch LSZH RF feeder per set; flame-retardant/DNV approval claimed",
    "6 x 1/2-inch 50-ohm male RF feeder connectors per set"]),
  row("PHONE-1","MR-0003",["ZWP20","ZWP21","ZWP22","ZWP23"],"Gai-Tronics / EATON / WAROM",
   "Auteldac 6 212-02-6008-410 + DB3B + BXJ-S",4,6400,
   ["Gai-Tronics Auteldac 6 212-02-6008-410 Ex VoIP/SIP PoE phone IP66",
    "EATON DB3B Ex d horn sounder 122dB (DC voltage/model variant verification OPEN)",
    "WAROM BXJ-S Ex e SS316L junction box with Ex-P SS316L cable gland",
    "Phone installation accessories specifically quoted; no headset in this Rev2 line"]),
  row("RACON-1","MR-0004",["ZWP20","ZWP21","ZWP22"],"Tideland","SeaBeacon 2 System 6",3,75059,
   ["Tideland SeaBeacon 2 System 6 X/S RACON, 18–32 VDC, claimed Zone 1 Ex",
    "DB-5P Ex d copper-free aluminium junction box listed with RACON set",
    "Selected Morse code must be confirmed by customer"])
 ]),
 services:Object.freeze([
  Object.freeze({id:"SERV-1",ownerCandidate:"B1_B2_OR_PART_A_VENDOR_INCLUSIONS",
   description:"MGW design engineering, drawings, documentation and project management",currency:"USD",amountUSD:8000,scopeVerified:false}),
  Object.freeze({id:"SERV-2",ownerCandidate:"PART_A_OEM_FAT_EXECUTION_WITH_B3_WITNESS_CHECK",
   description:"MGW integration, assembly, inspection and 2-day witnessed FAT at Nantong",currency:"USD",amountUSD:6000,scopeVerified:false}),
  Object.freeze({id:"SERV-3",ownerCandidate:"B5_VENDOR_PACKING_CREDIT_CHECK",
   description:"MGW packing, marking and delivery preparation",currency:"USD",amountUSD:500,scopeVerified:false})
 ]),
 equipmentTotalUSD:350341,serviceTotalUSD:14500,overallTotalUSD:364841,
 commercialTerms:Object.freeze({
  delivery:"EX WORKS / Nantong China",ddpAtJutalYardIncluded:false,
  deliveryWeeksAfterDrawings:[12,16],quoteValidityDays:90,
  payment:"30% engineering documents / 20% supplier orders / 20% MGW warehouse goods / 30% after FAT",
  warranty:"18 months after delivery or 12 months from SAT, whichever comes first",
  freightImportExportDutiesIncluded:null,warrantyBondIncluded:null
 }),
 sourceScopeGaps:Object.freeze([
  "Original contract delivery target JUTAL Zhuhai Yard / DDP not confirmed by EXW Nantong",
  "UHF Yagi 847 includes PolyPhaser and Solexy; do not post a second accessory cost",
  "Selected BDA Ex d complete-assembly certificate, operating frequency, power and heat pending",
  "Quoted PHONE-1 contains phone, EATON horn and WAROM JB; 24 VDC horn variant/Ex and TAG counts pending",
  "RACON quote lists SeaBeacon 2 and DB-5P only; ORGA alternate included control enclosure, purge kit, cables/glands and FAT must NOT be assumed included",
  "MGW service quote cannot be automatically added to B1/B2/B3/B5 where ADDVALUE labor already budgeted",
  "No confirmed per-site bulk cable routing, terminations, installed glands, connectors, commissioning spares"
 ]),
 governance:Object.freeze({workingBomVendorSelected:true,directCostVerified:false,
  approvedRev02Rev03ChangeAllowed:false,customerReleaseAllowed:false,
  allSiteQuantityFromQuote:"MR0002 3 + MR0003 4 + MR0004 3",
  additionalComponentPostingAllowed:false})
});
const q=MGW_P26_058_R2_SELECTED_0553,totals=Object.fromEntries(
 ["MR-0002","MR-0003","MR-0004"].map(mr=>[mr,q.lines.filter(x=>x.mr===mr).reduce((n,x)=>n+x.extendedUSD,0)]));
if(totals["MR-0002"]!==99564||totals["MR-0003"]!==25600||
 totals["MR-0004"]!==225177||
 Object.values(totals).reduce((n,x)=>n+x,0)!==q.equipmentTotalUSD||
 q.services.reduce((n,x)=>n+x.amountUSD,0)!==q.serviceTotalUSD||
 q.equipmentTotalUSD+q.serviceTotalUSD!==q.overallTotalUSD)
 throw Error("MGW P26-058_R2 selected supplier quotation arithmetic mismatch");
export const MGW_P26_058_R2_SELECTED_TOTALS_0553=Object.freeze(totals);
export const selectMGWR2Selected0553=id=>q.lines.find(x=>x.id===id)||null;
