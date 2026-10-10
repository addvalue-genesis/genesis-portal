// Extracted from MGW original P26-058 (21-Sep-2026). Source-priced packages are NOT individual component prices.
// Vendor package accessory inclusion is retained in descriptions to prevent double counting.
const source="https://drive.google.com/file/d/1qR4fuRXnRbHI2hgj8BB9T1dztZTWiINc/view?usp=sharing";
export const MGW_P26_058_0553={
 id:"MGW-P26-058",vendor:"MGW Technologies Pte Ltd",quotation:"P26-058",date:"2026-09-21",
 validUntil:null,validityRule:"90 days from quotation date (verify any subsequent amendment)",
 currency:"USD",mr:"MR-0002/MR-0003/MR-0004",scope:"ZWP20/ZWP21/ZWP22",
 source,revision:"Original 21-Sep-2026",quotedTotal:273519,status:"SOURCE_QUOTED_TBE_CBE_REQUIRED",
 terms:"EX WORKS Nantong, China; Delivery 12–16 weeks after approval of essential drawings/documents; Payment 20% upon key engineering documents (VDRL/datasheets/SLD/BOM), 10% upon main supplier PO evidence, 60% on goods and original invoice, final 10% after commissioning/as-built and receipt of 5% warranty bond; warranty 18 months after delivery or 12 months after SAT whichever first; validity 90 days from 21-Sep-2026. MGW reserves revision rights.",
 commercialTerms:{
  deliveryTerm:"EXW",deliveryPlace:"Nantong, China",leadTime:"12–16 weeks after approval of essential drawings and documents",
  payment:"20% documents / 10% purchase evidence / 60% goods + invoice / 10% commissioning, as-built and 5% warranty bond",
  warranty:"18 months from delivery or 12 months after SAT, whichever first",
  validity:"90 days from 21-Sep-2026",warrantyBond:"5% required at last payment",source
 },
 lines:[
 ["UHF-1","HYTERA-TS-9200","Integrated EX BDA, 8-channel selector, 95dB, wall mount set",3,13674,41022,"UHF","", "MGW BDA, not RFI LNA"],
 ["UHF-2","SINCLAIR-SY307-SF3SNF(ABK)","Yagi antenna 450–470MHz, 12.1dBi N-female",3,644,1932,"UHF"],
 ["UHF-3","HYTERA-TQJ-400AD5","UHF omni antenna 400–470MHz 5dBi N-female",3,21,63,"UHF"],
 ["UHF-4","FORLLER-RF-ACCESSORY","Per set: 100m 1/2-inch 50ohm LSZH RF feeder, DNV certificate plus six feeder male connectors",3,515,1545,"UHF"],
 ["RACON-1","MSM-RBM04-EX","Ex db eb IIB T6 Gb Zone1 Racon incl programming cable",3,60667,182001,"RACON"],
 ["PHONE-1","JR-JREX106-SIP-PACKAGE","Ex IP telephone package: wall bracket, Ex headset with 15m cable, WAROM BBJ81 alarm sounder/strobe and WAROM BXJ-S SS316L Ex junction box with certified gland",3,11152,33456,"PABX"],
 ["SERV-1","MGW-ENGINEERING","Design engineering, drawings, documentation and project management",1,8000,8000,"SERVICE"],
 ["SERV-2","MGW-FAT","Integration, assembly, inspection and FAT 2 days with client witness at Nantong",1,5000,5000,"SERVICE"],
 ["SERV-3","MGW-PACKING","Packing, marking and preparation for delivery",1,500,500,"SERVICE"]
 ],
 priceNotes:"Package allocations preserved; embedded handset/sounder/JB and UHF feeder must not be priced again as added bulk without a documented exclusion."
};
const sums=MGW_P26_058_0553.lines.reduce((n,l)=>n+(l[5]||0),0);
if(sums!==MGW_P26_058_0553.quotedTotal)throw Error("MGW total mismatch");
