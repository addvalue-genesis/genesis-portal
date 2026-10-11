import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";

// Budget estimate ONLY. Rectilinear cable route is an upper routing proxy relative to
// diagonal shortest path; actual cable-tray obstacles and penetrations may exceed it.
// Source WP bay dimension 9144 mm, ZWP20 mezzanine 21.1/21.3m,
// lower 18.3m, upper 24.5m. Horizontal paths are not surveyed.
export const DTRS_SELECTED_LNA_EVIDENCE_0553=Object.freeze({
 supplier:"MOT",manufacturer:"RF Industries (RFI)",model:"RX3852-2002-11",
 function:"DTRS_LOW_NOISE_AMPLIFIER",allocation:"TCAB-508-002 RF LNA enclosure",
 source:"RFI Low Noise Amplifier, RX3852-2002-11.pdf",
 sourceUrl:"https://drive.google.com/file/d/1dAnYkC2r2hyYEgUuN-xA0xAvq-zG2iTA/view",
 frequencyMHz:[380,520],impedanceOhms:50,connector:"SMA female",
 maxGainDb:40,noiseFigureDbMax:2,dcVoltageV:[11,28],
 dcMatingPlug:"A2671, 2 pin, separately ordered if required",
 alarmMatingPlug:"A2881, 3 pin, separately ordered if required",
 note:"RFI is confirmed for offered LNA only; do not infer full radio/repeater OEM or feeder cable SKU from this LNA datasheet",
 state:"VENDOR_DTS_EVIDENCE__FEEDER_MATCH_PENDING"
});
export const DTRS_HISTORICAL_FEEDER_EVIDENCE_0553=Object.freeze({
 source:"BOQ_AWP36 Radio Project Rv.2_31-1-2025.pdf",project:"AWP36, not Z1F",
 use:"OTHER_PROJECT_HISTORY_ONLY__NOT_SELECTED_OEM_OR_BUDGET_RATE_FOR_Z1F",
 radio:{sku:"XiR M8668i",system:"DMR Tier III",bandMHz:[350,400],sourcePackage:"One AWP36 DMR fixed station reference"},
 feeder:{sku:"LDF4RK-50A",brand:"CommScope",nominalSize:"1/2-inch coaxial",lengthM:50,
  connectorIncluded:true,quotedAssemblyCostTHB:50000,ratePerMComparableTHB:1000,
  rateWarning:"Quoted 50m connectorized assembly; implied 1000 THB/m cannot be extrapolated as approved raw-cable unit rate"},
 protector:{sku:"APG-BNFNF-350",quotedCostTHB:20000,
  scope:"RF Lightning Arrester and Grounding Kit, separate from feeder assembly"},
 qualification:["Not confirmed for Z1F DTRS","Selected radio frequency and antenna RF port/connector match",
 "Calculate feeder attenuation and link loss at selected frequency","Power/VSWR, Ex, earthing and offshore cable fire requirements",
 "Separate VHF Marine and DMR radio quotes; no 50m multiplied from quotation without physical run count"]
});
export const Z1F_BULK_ROUTE_PARAMETERS_0553=Object.freeze({
 baySpanM:9.144,horizontalSiteAllowanceM:15,
 lowerElevationM:18.3,mezzanineElevationM:21.2,upperElevationM:24.5,
 managementMinimumFieldToRoomM:50,terminationLoopM:3,
 scenarioFactors:{short:1,base:1.2,long:1.5},
 quoteRateTHBPerM:524,quoteSource:"INNOVA QA24-0604 item 1 / historical CAT6A, not a rate for RF, voice, DC or every cable type",
 reference:"MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1, ZWP20 sheets 3/4/5; no cable-tray routing shown"
});
const deckElevation={UPPER:24.5,MEZZANINE_EI_ROOFTOP:21.2,LOWER:18.3,TC_ROOM:18.3};
const distance=(a,b)=>Math.abs((deckElevation[a]??18.3)-(deckElevation[b]??18.3));
const round=n=>Math.round(n*100)/100;
const determineRoute=(wp,system,tag,deck,end,kind)=>({
 id:`${wp}:${system}:${tag}->${end}`,
 wp,system,from:tag,to:end,sourceDeck:deck,destinationDeck:"TC_ROOM",
 cableKind:kind,
 cableSpecificationSource:kind==="RF_FEEDER_UNSPECIFIED"?"SELECTED_TRUNK_RADIO_DTS_REQUIRED":null,
 evidence:"LAY_TAG_POSITION_AND_DECK; CABLE_TRAY_PATH_NOT_SHOWN",
 quantityOwnership:"ONE_DISTINCT_PHYSICAL_CABLE; VERIFY_WIRING_AND_PACKAGE_INCLUDED",
 horizontalAllowanceM:15,verticalReferenceM:round(distance(deck,"TC_ROOM")),
 terminationAllowanceM:3,
 managementMinimumM:50
});
export function deriveZ1FTelBulkRoutes0553(params=Z1F_BULK_ROUTE_PARAMETERS_0553){
 const routeRows=[];
 const equipmentRows=[];
 for(const wp of Z1F_TEL_LAYOUT_INDEX_0553.byWP){
  const seen=new Set();
  for(const e of wp.equipment){
   const key=e.system+"|"+e.tag;
   if(seen.has(key)){equipmentRows.push({wp:wp.wp,tag:e.tag,system:e.system,deck:e.deck,status:"DUPLICATE_TAG_OTHER_SHEET__NOT_ADDITIONAL_QUANTITY"});continue;}
   seen.add(key);
   equipmentRows.push({wp:wp.wp,tag:e.tag,system:e.system,deck:e.deck,sheet:e.sheet,status:"LAY_EQUIPMENT_EVIDENCE"});
  }
  const select=(system,tag)=>wp.equipment.find(e=>e.system===system&&e.tag===tag);
  const scada=select("SCADA_RADIO","MR-502-001");
  if(scada)routeRows.push(determineRoute(wp.wp,"SCADA_RADIO",scada.tag,scada.deck,"INDOOR_POE_TC_ROOM","CAT6A_DATA"));
  const racon=select("MARINE_RACON","TCAB-514-001");
  if(racon)routeRows.push(determineRoute(wp.wp,"MARINE_RACON",racon.tag,racon.deck,"TC_ROOM_INTERFACE","RACON_POWER_CONTROL_UNSPECIFIED"));
  const trunk=select("DTRS_TRUNK_RADIO","TCAB-508-002");
  if(trunk)routeRows.push(determineRoute(wp.wp,"DTRS_TRUNK_RADIO",trunk.tag,trunk.deck,"TC_ROOM_RADIO_INTERFACE","RF_FEEDER_UNSPECIFIED"));
  // EX IP Phone: no invented route until distinct tag and terminal can be located.
 }
 const estimates=routeRows.map(r=>{
  const geometricProxyM=r.horizontalAllowanceM+r.verticalReferenceM+r.terminationAllowanceM;
  const budgetBaselineM=Math.max(geometricProxyM,r.managementMinimumM);
  const scenarios=Object.fromEntries(Object.entries(params.scenarioFactors).map(([name,factor])=>[name,round(budgetBaselineM*factor)]));
  const canCostCable=r.cableKind==="CAT6A_DATA";
  const rfSpecificationGate=r.system==="DTRS_TRUNK_RADIO"?{status:"RFI_LNA_DTS_FOUND__FEEDER_SPEC_STILL_REQUIRED",offeredLna:DTRS_SELECTED_LNA_EVIDENCE_0553,historicalRejectedAsSelection:DTRS_HISTORICAL_FEEDER_EVIDENCE_0553,required:["Selected Motorola radio/repeater model and TX/RX frequency band","Antenna RF connectors and count of feed lines","DTS maximum feeder insertion loss / receiver sensitivity / transmit path loss budget","Connector types, lightning protector, rated power, Ex requirements","Feeder family 1/2in, 7/8in or other chosen by loss calculation, NOT assumption"],calculation:"L_loss_dB = (cable_attenuation_dB_per_100m_at_frequency)*(run_length_m/100) + connector_loss + lightning_protector_loss; compare with DTS link budget."}:null;
  return {...r,geometricProxyM:round(geometricProxyM),budgetBaselineM,scenarios,rfSpecificationGate,
   rateTHBPerM:canCostCable?params.quoteRateTHBPerM:null,
   materialBaseTHB:canCostCable?round(scenarios.base*params.quoteRateTHBPerM):null,
   rateState:canCostCable?"PROVISIONAL_INNOVA_CABLE_RATE":r.system==="DTRS_TRUNK_RADIO"?"RFI_LNA_IDENTIFIED__RF_FEEDER_SELECTION_PENDING":"CABLE_TYPE_RATE_NOT_SELECTED",
   installationBasis:"PARAMETRIC_BUDGET_ONLY_NOT_MEASURED"};
 });
 const byWP=Z1F_TEL_LAYOUT_INDEX_0553.byWP.map(w=>{
  const rows=estimates.filter(r=>r.wp===w.wp);
  return {wp:w.wp,rows,pricedCableTHB:round(rows.reduce((n,r)=>n+(r.materialBaseTHB??0),0)),
   pricedRouteCount:rows.filter(r=>r.materialBaseTHB!==null).length,
   excludedSystem:"EX_IP_PHONE__NO_DISTINCT_TAG_WITH_VERIFIED_ENDPOINT"};
 });
 return {params,byWP,rows:estimates,equipmentRows,
  method:"For each unique routed cable: L_geometry = H_manhattan_proxy + |elev1-elev2| + terminalLoop; L_budget = max(50m, L_geometry); short/base/long = L_budget times 1/1.2/1.5. All 15m H and 3m loop are assumptions, not a scaled surveyed cable route. Distinct branches are additional cables, not just extra distance per tag.",
  caveat:"Cable rates 524 THB/m apply to CAT6A only. RF feeder, RACON wiring and EX IP Phone cannot be costed from CAT6A rate. Never add this parametric comparison subtotal on top of working BOM without reconciled cost ownership."
 };
}
