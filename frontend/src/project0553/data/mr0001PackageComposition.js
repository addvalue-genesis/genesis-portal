// MR0001 engineering package composition. One MR row -> many required FUNCTIONS
// -> zero/many vendor candidates. Mapping is NOT approved SKU selection or purchase quantity.
import { MR0001_ENGINEERING_REQUIRED_BOM } from "./mr0001RequiredBomDerivation";
import { AVIAT_0553_TECHNICAL_EVALUATION } from "./aviatTechnicalBidEvaluation";
const functionsByFamily={
 "Subscriber Radio ODU":["RADIO_EQUIPMENT","RF_FILTER","CAPACITY_KEY","REGION_KEY","POWER","POWER_CORD","MOUNT_FEEDER","WARRANTY"],
 "Subscriber Radio IDU":["RADIO_IDU_INTERFACE","ETHERNET_PORT","POWER_INTERFACE","CONFIGURATION"],
 "Antenna":["ANTENNA_RF","ANTENNA_SUPPORT","RF_CONNECTOR","FEEDER_ROUTE"],
 "L3 Switch":["NETWORK_SWITCH","NETWORK_LICENCE","DC_POWER","SFP_INTERFACE","CONFIGURATION"],
 "DATO":["EX_DATA_CONNECTOR","EX_CERTIFICATION","CABLE_TERMINATION"],
 "Enclosure":["ENCLOSURE_CERTIFICATION","THERMAL_LAYOUT","GLANDS","EARTHING"],
 "Surge Arrestor":["ETHERNET_SURGE","EARTHING","PROTECTION_INTERFACE"],
 "Bulk Materials":["MOUNT_FEEDER","RF_CONNECTOR","FEEDER_ROUTE","GLANDS","EARTHING","CABLE_FIRE_RATING"],
 "Radio/Antenna package (split pending)":["RADIO_EQUIPMENT","ANTENNA_RF","RF_FILTER","REGION_KEY","POWER","MOUNT_FEEDER","WARRANTY"]
};
const compatibleFunctions={
 RADIO_EQUIPMENT:["RADIO_BASE","RADIO_REMOTE"],
 RF_FILTER:["RF_FILTER"], CAPACITY_KEY:["CAPACITY_KEY"],REGION_KEY:["REGION_KEY"],
 POWER:["POWER"],POWER_CORD:["POWER_CORD"],MOUNT_FEEDER:["MOUNT_FEEDER"],
 WARRANTY:["WARRANTY"],ANTENNA_RF:["ANTENNA_SECTOR","ANTENNA_PARABOLIC"],
 ANTENNA_SUPPORT:["MOUNT_FEEDER"],ETHERNET_SURGE:["ETHERNET_SURGE"]
};
const services=[
 {id:"ENG-RF",name:"RF design / link budget / availability & antenna verification",driver:"verified link topology and vendor RF model",equation:"MH = links × verified MH_per_link + revisions",source:"RPT-0001-C1",mh:null,cost:null},
 {id:"ENG-INT",name:"Power, Ethernet, enclosure, Ex and licence interface engineering",driver:"verified physical/interface edges",equation:"MH = Σ(interface count × MH_per_interface)",source:"MR0001 / BLD / LAY / TC",mh:null,cost:null},
 {id:"FAT-SAT",name:"FAT / SAT / site commissioning and OEM participation",driver:"approved ITP, events, days, crew and responsibility",equation:"MD = events × days × crew",source:"MR0001 / VDRL / ITP",mh:null,cost:null},
 {id:"LOG",name:"Logistics, permits and regulatory approvals",driver:"Incoterm, route, shipment weights and authority scope",equation:"Cost = documented shipment + approvals + travel",source:"ITB / supplier offer",mh:null,cost:null}
];
export const MR0001_PACKAGE_COMPOSITION=Object.freeze({
 projectId:"PJ2608-0553",mr:"MR-0001",state:"PRELIMINARY_FUNCTIONAL_DECOMPOSITION",
 sourceId:MR0001_ENGINEERING_REQUIRED_BOM.sourceId,
 rules:["MR Set/Lot is not installed SKU count","Vendor quote is candidate only","All physical shared components allocated exactly once after interface proof","Services and spare quantities remain independent","No quote cost adopted before technical approval"],
 packages:MR0001_ENGINEERING_REQUIRED_BOM.rows.map(r=>{
  const components=(functionsByFamily[r.equipmentFamily]||["FUNCTION_REVIEW"]).map((fn,index)=>{
   const candidates=AVIAT_0553_TECHNICAL_EVALUATION.rows.filter(x=>x.offeredRole==="BASE_CANDIDATE_NOT_ACCEPTED" && (compatibleFunctions[fn]||[]).includes(x.functionId));
   return {id:r.id+"-F"+String(index+1).padStart(2,"0"),functionId:fn,requiredQty:null,unit:"EACH_OR_AS_DESIGNED",
    quantityDriver:fn==="FEEDER_ROUTE"?"Measured cable routing + terminations + loss and spares":fn==="RADIO_EQUIPMENT"?"Confirmed role per topology/link, shared base capacity and resilience":"MR function + verified location/interface topology",
    candidateQuotes:candidates.map(x=>({quoteLine:x.quoteLine,partNumber:x.partNumber,offeredTotalQty:x.sourceQty,currency:x.currency})),
    selectedOffer:null,allocatedOfferQty:null,acceptedUnitCost:null,technicalState:"PROOF_REQUIRED",
    gapState:candidates.length?"MATCH_CANDIDATE_NOT_VERIFIED":"NO_CANDIDATE_OR_OTHER_SUPPLIER_REVIEW",
    costState:"HOLD",proofRequired:["MR/SPE/BOD/BLD/LAY/CAL/TC and OEM datasheet approval","Site-specific physical interface/quantity","Licence/Ex/power/warranty as applicable"]};
  });
  return {id:r.id,platform:r.platform,sourceRowIndex:r.sourceRowIndex,sourceCodes:r.sourceCodes,
   sourceDescription:r.sourceDescription,sourceQuantityText:r.sourceQuantityText,relatedLinks:r.relatedLinks,
   groupedRow:r.groupedRow,equipmentFamily:r.equipmentFamily,components,
   mrRequirementState:"SOURCE_REGISTERED_NOT_TECHNICALLY_APPROVED",packageTotalCost:null,packageSell:null};
 }),
 services,releaseAllowed:false
});
export function summarizeMR0001Composition(){
 const packages=MR0001_PACKAGE_COMPOSITION.packages,parts=packages.flatMap(x=>x.components);
 return {packages:packages.length,functionRows:parts.length,candidateFunctionRows:parts.filter(x=>x.candidateQuotes.length>0).length,
 acceptedFunctionRows:parts.filter(x=>Number.isFinite(x.requiredQty)&&x.selectedOffer).length,
 serviceObjects:services.length,releaseAllowed:false};
}
