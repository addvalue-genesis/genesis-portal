// New supplier quotation revision: do not overwrite historical MGW P26-058.
// Prices belong to bundled supplier packages; components do not have individual quoted unit rates.
const folder="https://drive.google.com/drive/folders/1AC0DEwWh3JfZcQcWSPuJZPTRP4AYggEl";
export const MGW_P26_058_R2_UHF_0553=Object.freeze({
 id:"MGW-P26-058-R2-UHF",supplier:"MGW Technologies Pte Ltd",
 quotation:"P26-058_R2",quotationFile:"Q26-058 AddValue_PTTEP Z1F_UHF.PDF",
 date:"2026-09-21",currency:"USD",scope:["ZWP20","ZWP21","ZWP22"],
 priceAuthority:"SUPPLIER_QUOTATION_REVISION_R2",technicalAuthority:"MANUFACTURER_DATASHEET",
 equipmentTotalUSD:97704,servicesTotalUSD:6000,overallTotalUSD:103704,
 priceTerms:{incoterm:"EXW",place:"Nantong China",delivery:"12-16 weeks after essential document approval",validityDays:90},
 lines:[
  {id:"UHF-1",manufacturer:"RFI",model:"BD4345-00N0-AC",package:"RFI 430-450MHz 1.5MHz passband BDA plus WAROM HRMD95-VIIIB Ex d enclosure and wall-mount components",quantity:3,unit:"set",unitPriceUSD:31474,extendedUSD:94422,componentInclusions:["RFI BD4345-00N0-AC","WAROM HRMD95-VIIIB","wall-mount components"],datasheets:["https://drive.google.com/file/d/1QDdoHtDjbafLsgJtRu7BtIZ7m4zW9a0h/view","https://drive.google.com/file/d/1jzI1QDhsIrMsrk0X79aGsjk4cP5WBMsx/view"]},
  {id:"UHF-2",manufacturer:"RFI",model:"YBSS6-99",package:"Yagi outdoor antenna package",quantity:3,unit:"set",unitPriceUSD:227,extendedUSD:681,componentInclusions:["RFI YBSS6-99","UNV2 stainless clamp","PolyPhaser IS-B50LN-C2"],datasheets:[]},
  {id:"UHF-3",manufacturer:"Kenbotong (KBT)",model:"TQJ-400AD5",package:"400-470MHz 5dBi N-Female UHF omni antenna",quantity:3,unit:"set",unitPriceUSD:21,extendedUSD:63,componentInclusions:["KBT TQJ-400AD5"],datasheets:["https://drive.google.com/file/d/1hWCY1548aN8zwQTL4t8BKGBWs6r1cCUj/view"]},
  {id:"UHF-4",manufacturer:"FORLLER",model:"RF LLF 1/2 50",package:"100m 1/2-inch LSZH 50-ohm RF feeder plus six 1/2-inch male feeder connectors PER SET",quantity:3,unit:"set",unitPriceUSD:846,extendedUSD:2538,componentInclusions:["100m feeder per set","6 feeder connectors per set"],datasheets:[]}
 ],
 services:[
  {id:"SERV-1",description:"Design engineering, drawing, documentation and project management",currency:"USD",price:2500},
  {id:"SERV-2",description:"Integration, assembly, inspection and 2-day FAT with client witness at Nantong",currency:"USD",price:3200},
  {id:"SERV-3",description:"Packing, marking and delivery preparation",currency:"USD",price:300}
 ],
 unpricedEvidence:[{manufacturer:"SOLEXY",series:"RX Series",datasheet:"https://drive.google.com/file/d/1Oas7D2YAV9ejYhBsDuOwYOb1qmqmYDzz/view",postingAllowed:false,reason:"Not explicitly listed as a priced R2 quote component; do not assume included"}],
 sourceFolder:folder,
 controls:{oneSetPerLocation:"MANAGEMENT_ALLOCATION_OF_QUOTED_THREE_SETS",quoteComponentPriceIsNotStandalone:true,additionalExEnclosurePostingAllowed:false,additionalFeederConnectorPostingAllowed:false,servicePriceNotEquipment:true,releaseState:"INTERNAL_WORKING_PREVIEW"}
});
const q=MGW_P26_058_R2_UHF_0553;
if(q.lines.reduce((s,x)=>s+x.quantity*x.unitPriceUSD,0)!==q.equipmentTotalUSD ||
 q.services.reduce((s,x)=>s+x.price,0)!==q.servicesTotalUSD ||
 q.equipmentTotalUSD+q.servicesTotalUSD!==q.overallTotalUSD)throw Error("MGW R2 UHF quotation reconciliation failed");
