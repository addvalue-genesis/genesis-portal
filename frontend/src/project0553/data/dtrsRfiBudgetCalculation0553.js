import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import {RF_AND_PATCH_REFERENCE_0553} from "./rfAndPatchReference0553";

// Approved internal RF budget policy. Horizontal routing in the AFC LAY is not dimensioned.
// One 9.144m grid span is an explicitly assumed engineering allowance, NOT a scaled measured route.
// No supplier RF feeder unit of measure or actual field cable inclusion is proven in the historical ERP record.
export const DTRS_RFI_APPROVED_BASIS_0553=Object.freeze({
 approvedDate:"2026-10-12",status:"MANAGEMENT_APPROVED_BUDGETARY",
 system:"DTRS_TRUNK_RADIO",cable:"CommScope LDF4RK-50A",cableImpedanceOhms:50,
 procurementAllowancePct:15,standardGridSpanM:9.144,terminationRoutingAllowanceM:3,
 conservativeErpRateTHBPerAssumedMetre:631,erpPriceUnitVerified:false,
 countPolicy:"One conditional 1/2in LNA-area-to-Omni feeder per identified site. Do not count as confirmed cable unless MOT interface topology requires separate feeder.",
 duplicatePolicy:"Factory RF jumper included in vendor; Ex d surge and LNA assemblies count only in their owners; count connectors only for field-terminated ends."
});
const round=x=>Math.round(x*100)/100;
export function deriveDtrsRfiBudget0553(){
 const b=DTRS_RFI_APPROVED_BASIS_0553;
 const p=RF_AND_PATCH_REFERENCE_0553.webRFPrices;
 return Z1F_TEL_LAYOUT_INDEX_0553.byWP.filter(w=>w.equipment.some(e=>e.tag==="TCAB-508-001")).map(w=>{
  const tags=new Set(w.equipment.filter(e=>e.system==="DTRS_TRUNK_RADIO").map(e=>e.tag));
  const complete=["ANT-508-001","ANT-508-002","TCAB-508-001","TCAB-508-002"].every(tag=>tags.has(tag));
  const routeBaseM=b.standardGridSpanM+b.terminationRoutingAllowanceM;
  const purchaseM=Math.ceil(routeBaseM*(1+b.procurementAllowancePct/100));
  const items=[
   {id:"RF-FEEDER",item:"LDF4RK-50A 1/2in 50-ohm feeder",qty:purchaseM,unit:"m",rate:631,amount:purchaseM*631,source:"ERP weighted cost THB631 per unverified UOM",state:"ASSUMED_THB_PER_M__VERIFY_UOM_AND_PATH"},
   {id:"RF-CONNECTOR",item:"L4TNM-PSA N-male connector candidate",qty:2,unit:"pcs",rate:p.connector.thbBudget,amount:round(2*p.connector.thbBudget),source:p.connector.source,state:"N_FEMALE_MATING_PORTS_NOT_PROVEN"},
   {id:"RF-GROUND",item:"SG12-12B2U RF grounding kit",qty:1,unit:"kit",rate:p.grounding.thbBudget,amount:p.grounding.thbBudget,source:p.grounding.source,state:"GROUND_POINT_ASSUMPTION"},
   {id:"RF-TAPE",item:"3M 2228 weatherproofing roll",qty:1,unit:"roll",rate:p.weatherproof.thbBudget,amount:p.weatherproof.thbBudget,source:p.weatherproof.source,state:"PROCUREMENT_ROLL_ALLOWANCE__SHARE_ACROSS_LOCATIONS"},
   {id:"RF-SMA",item:"SMA-male flexible RF pigtail input/output as required",qty:null,unit:"set",rate:null,amount:null,source:"RFI RX3852-2002-11 SMA(F); MOT interface diagram",state:"OEM_INTERFACE_TOPOLOGY_REQUIRED"},
   {id:"LNA-POWER",item:"RFI LNA 11-28V DC field supply cable + A2671",qty:null,unit:"m/set",rate:null,amount:null,source:"RFI LNA datasheet",state:"VOLTAGE_DROP_AND_OEM_SUPPLY_SCOPE_PENDING"},
   {id:"LNA-ALARM",item:"Alarm interface cable + A2881",qty:null,unit:"m/set",rate:null,amount:null,source:"RFI LNA datasheet",state:"ALARM_TERMINAL_AND_SUPPLY_SCOPE_PENDING"},
   {id:"EX-SURGE",item:"RF surge path / TCAB-508-002",qty:null,unit:"set",rate:null,amount:null,source:"TEL-LAY C1 / package scope",state:"EXISTING_ENCLOSURE_COST_OWNER__NO_DOUBLE_COUNT"},
   {id:"LNA-BOX",item:"RFI LNA enclosure TCAB-508-001",qty:null,unit:"set",rate:null,amount:null,source:"TEL-LAY C1 / MOT supply",state:"SEPARATE_ENCLOSURE_COST_OWNER__NO_DOUBLE_COUNT"}
  ];
  const priceCaseTHB=round(items.reduce((a,x)=>a+(x.amount??0),0));
  const lossPer100m450MHz=4.749;
  const cableLossDb450=round(lossPer100m450MHz*routeBaseM/100);
  return {wp:w.wp,siteClass:"GREENFIELD",tags:[...tags],topologyComplete:complete,
   assumedRouteM:round(routeBaseM),procurementM:purchaseM,rfFeederCount:1,connectorCount:2,
   cableLossDb450,lossRule:"4.749dB/100m at 450MHz assumed; cable path loss excludes SMA pigtail, connector, surge and VSWR",
   rows:items,illustrativeRFMaterialTHB:priceCaseTHB,
   quoteBackedCommittedTHB:null,
   scenarioState:"INTERNAL_ALLOWANCE_SCENARIO_NOT_MEASURED_NOT_ACCEPTED_OEM",
   priceCaveat:"631 THB assumed per meter from ERP whose UOM is unverified; if ERP UOM differs, this scenario cost is not usable",
   drawingEvidence:"Z1F TEL-LAY-0001 C1 sheets "+(w.sheets.mezzanine||w.sheets.lower)+" ; 9.144m WP grid span comparator; endpoints close on deck but no routed tray path",
   rfTopology:"MOT concept Yagi -> LNA vicinity -> 1/2in cable toward Omni. Actual LNA IN/OUT + active repeater/coupler path not proven.",
   extraCostNotIncluded:"Custom SMA pigtails, DC and alarm cables, selected Ex RF surge device, brackets, shipping, installation, test and spares",
   note:"Weatherproofing 1 roll is per-WP purchasing scenario; combine procurement across WPs if one roll covers multiple connections. RF jumper factory supplied."
  };
 });
}
