import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import {APPROVED_0553_BUDGET_BASIS} from "./approvedBudgetBasis0553";

// Information-only Tideland 070.1016-DWG Rev.C (2 sheets) and
// SEABEACON-2 application diagram page 3. Supplied control/J boxes NOT field cables.
// Lengths below are explicit engineering scenarios, not dimensions taken from GA.
export const RACON_TERMINATION_POLICY_0553=Object.freeze({
 state:"PRELIMINARY_BUDGETARY_ROUTE_SCENARIO_NOT_MEASURED",
 supplierDrawing:"SEABEACON 2 Termination Diagram (For information only).pdf",
 originalDrawing:"Tideland 070.1016-DWG Rev C",siteDrawing:"MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1",
 terminalCount:17,procurementAllowancePct:APPROVED_0553_BUDGET_BASIS.greenfield.cableProcurementAllowancePct,
 modelledLengthsM:{outdoorAdjacent:6,fieldToIndoor:60,indoorInterface:6},
 packageOwner:"RACON_VENDOR_PACKAGE",
 excludedFromVendor:"Field cables and cable glands explicitly excluded in application diagram note; boxes with Ex blank plugs supplied",
 connectionTypes:[
  {id:"RACON_TO_CONTROL_A",from:"RACON JB 630.1421-00",to:"Control box 630.1422-00",kind:"10C x 1.5mm2",category:"outdoorAdjacent",circuits:1,evidence:"Application diagram p3 first system cable; 10C 1.5mm2"},
  {id:"RACON_TO_CONTROL_B",from:"RACON JB 630.1421-00",to:"Control box 630.1422-00",kind:"10C x 1.5mm2",category:"outdoorAdjacent",circuits:1,evidence:"Application diagram p3 second system cable; 10C 1.5mm2"},
  {id:"CONTROL_TO_DB",from:"Control box 630.1422-00",to:"DB-5P indoor interface",kind:"10C x 1.5mm2",category:"fieldToIndoor",circuits:1,evidence:"Application diagram p3 10C 1.5mm2; check actual signal termination map"},
  {id:"DB_TO_ICSS",from:"DB-5P",to:"Client ESD and status panel",kind:"3C x 2.5mm2",category:"indoorInterface",circuits:1,evidence:"Application diagram p3 3C 2.5mm2 to ESD/status"},
  {id:"DB_TO_HYPERTERMINAL",from:"DB-5P",to:"Hyperterminal/interface",kind:"3C x 2.5mm2",category:"indoorInterface",circuits:1,evidence:"Application diagram p3 3C 2.5mm2 to Hyperterminal; check communication physical medium and signal spec"},
  {id:"DB_24V_SUPPLY",from:"Customer 24V source",to:"DB-5P",kind:"3C x 2.5mm2",category:"indoorInterface",circuits:1,evidence:"Application diagram p3 incoming 24VDC; drawing p1 says customer 18-32VDC"}
 ],
 requirementSignals:["EARTH","VDC COMMON","VDC SUPPLY","INHIBIT","INHIBIT RETURN","GO/NOGO","GO/NOGO RETURN","RX DATA","TX DATA","WARN NC/C/NO","ALARM NC/C/NO","WARN GND","ALARM GND"],
 flags:["Page3 cable sizes stated FOR REFERENCE ONLY; verify against electrical design, offshore cable rating and cable schedule",
 "Page2 terminal TB1 1-17 is not a 17-conductor cable purchase quantity",
 "Vendor-supplied RACON, control enclosure, JB and Ex blank plugs are not charged twice",
 "Vendor information GA and termination diagram have potentially different entry gland inclusion; treat field glands as candidate pending delivery scope"]
});
const ceilPurchase=m=>Math.ceil(m*(1+RACON_TERMINATION_POLICY_0553.procurementAllowancePct/100));
export function deriveRaconTerminationBudget0553(){
 const p=RACON_TERMINATION_POLICY_0553;
 return Z1F_TEL_LAYOUT_INDEX_0553.byWP.filter(w=>w.equipment.some(e=>e.system==="MARINE_RACON"&&e.tag==="MAR-514-001")).map(w=>{
  const lines=p.connectionTypes.map(v=>({id:v.id,wp:w.wp,...v,designBudgetM:p.modelledLengthsM[v.category],
   procurementM:ceilPurchase(p.modelledLengthsM[v.category])*v.circuits,
   unitRateTHB:null,extendedTHB:null,workingZeroDisplayTHB:0,
   costOwner:"FIELD_RACON_BULK_NOT_VENDOR_ENCLOSURE",state:"CABLE_RATE_PENDING__ZERO_IS_PRESENTATION_ONLY"}));
  const types=[...new Set(lines.map(x=>x.kind))].map(kind=>({kind,
   distinctRuns:lines.filter(x=>x.kind===kind).reduce((n,x)=>n+x.circuits,0),
   totalPurchaseM:lines.filter(x=>x.kind===kind).reduce((n,x)=>n+x.procurementM,0)}));
  return {wp:w.wp,rows:lines,cableTypes:types,routedRunCount:lines.length,
   procurementTotalM:lines.reduce((n,x)=>n+x.procurementM,0),
   fieldGlandCandidateQty:lines.length*2,
   glandState:"TWO_ENDS_PER_RUN_BEFORE_VENDOR_INCLUDED_AND_ENTRY_SIZE_DEDUCTION",
   knownVendorEnclosureCostExtraTHB:0,
   pricedSubtotalTHB:null,displayWorkingTHB:0,
   completionState:"QUANTITY_SCENARIO_WITHOUT_UNIT_RATES_NOT_RELEASED",
   caveat:"60m is only field control-box-to-indoor DB scenario; short local runs are 6m each, not 60m. Dimensions, actual number of cables and cable routing require project drawing validation."};
 });
}
