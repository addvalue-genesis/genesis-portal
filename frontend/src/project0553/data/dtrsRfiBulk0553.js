import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import {DTRS_SELECTED_LNA_EVIDENCE_0553} from "./z1fParametricBulkRoutes0553";
const functions=[
 ["LNA","TCAB-508-001","RX3852-2002-11","MOT RFI DTS",1,"equipment"],
 ["RF SMA female port","RX3852","50 ohm SMA(F)","RFI DTS",null,"connector sets"],
 ["DC mating plug","RX3852","A2671","RFI DTS note 1",1,"candidate"],
 ["Alarm mating plug","RX3852","A2881","RFI DTS note 1",1,"candidate"],
 ["DC 11-28V field supply","TCAB-508-001","voltage-drop-sized DC cable","RFI DTS",null,"m"],
 ["Alarm NC/NO/COM interface","TCAB-508-001","multi-core control cable","RFI DTS",null,"m"],
 ["RF surge and grounding","TCAB-508-002","surge and bonding interface","Z1F LAY",null,"set"],
 ["Yagi antenna RF path","ANT-508-001","50-ohm feeder subject to topology","Z1F LAY",null,"m"],
 ["Omni antenna RF path","ANT-508-002","50-ohm feeder subject to topology","Z1F LAY",null,"m"]
];
export const DTRS_RFI_BULK_0553={
 selected:DTRS_SELECTED_LNA_EVIDENCE_0553,
 source:"RFI Low Noise Amplifier RX3852-2002-11 supplied by MOT",
 byWP:Z1F_TEL_LAYOUT_INDEX_0553.byWP.map(w=>{
  const tags=new Set(w.equipment.filter(e=>e.system==="DTRS_TRUNK_RADIO").map(e=>e.tag));
  return {wp:w.wp,functions:tags.has("TCAB-508-001")?functions.filter(row=>tags.has(row[1])||row[1]==="RX3852").map(([fn,tag,sku,source,qty,unit])=>({fn,tag,sku,source,qty,unit,cost:null,stage:"ENGINEERING_FUNCTION_ONLY"})):[]};
 }),
 rules:["Do not use Motorola as selected Z1F equipment","RFI LNA frequency 380-520MHz, RF impedance 50 ohm, SMA(F)","A2671 and A2881 mating plugs may require separate purchase","Select RF coax from attenuation at operational frequency and end connector DTS","No CAT6A rate for RF coax, DC or alarm cable","Avoid counting TCAB-508-001 and TCAB-508-002 components twice","Different RF antenna paths require separate topology validation and route-length takeoff"],
 lossFormula:"coax_loss_dB = attenuation_dB_per_100m_at_f * length_m / 100 + connector_dB + surge_dB"
};
