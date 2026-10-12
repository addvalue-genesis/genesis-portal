import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import {APPROVED_0553_BUDGET_BASIS} from "./approvedBudgetBasis0553";

// Information-only Tideland 070.1016-DWG Rev.C (2 sheets) and
// SEABEACON-2 application diagram page 3. Supplier budget quote separately includes three specific BFOU cable runs and six gland sets.
// Lengths below are explicit engineering scenarios, not dimensions taken from GA.
export const RACON_TERMINATION_POLICY_0553=Object.freeze({
 state:"PRELIMINARY_BUDGETARY_ROUTE_SCENARIO_NOT_MEASURED",
 supplierDrawing:"SEABEACON 2 Termination Diagram (For information only).pdf",
 originalDrawing:"Tideland 070.1016-DWG Rev C",siteDrawing:"MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1",
 terminalCount:17,procurementAllowancePct:APPROVED_0553_BUDGET_BASIS.greenfield.cableProcurementAllowancePct,
 modelledLengthsM:{outdoorAdjacent:6,fieldToIndoor:60,indoorInterface:6},
 packageOwner:"RACON_VENDOR_PACKAGE",
 excludedFromVendor:"QTORG2609244 p8 general exclusion conflicts with p4 included 3 BFOU cable runs and six glands; treat p4 explicitly included quantities as provisional credit and flag clarification.",
 quotation:{number:"QTORG2609244",date:"2026-09-22",packageUSD:75000,packageBasis:"ONE_QUOTED_SYSTEM__DO_NOT_MULTIPLY_BY_WP_WITHOUT_SCOPE_CHECK",cablesIncluded:[{id:"RACON_TO_CONTROL_A",lengthM:5},{id:"RACON_TO_CONTROL_B",lengthM:5},{id:"CONTROL_TO_DB",lengthM:10}],cableSpec:"BFOU 12C x 1.5mm2",glandsIncluded:6,includes:["SeaBeacon-2 System 6 Ex","Ex RACON control box","DB-5P with DC-DC converter and bracket","Purge kit","Programming cable","Packing","Standard documentation"],fatCommercialConflict:"Financial Summary p5 FAT included; Nontechnical p7 FAT/R-FAT excluded",cableCommercialConflict:"Financial Summary p4 20m BFOU + 6 glands included; p8 general cable/gland exclusion",vendorClarificationRequired:true},
 connectionTypes:[
  {id:"RACON_TO_CONTROL_A",from:"RACON JB 630.1421-00",to:"Control box 630.1422-00",kind:"BFOU 12C x 1.5mm2",category:"outdoorAdjacent",circuits:1,evidence:"Application diagram p3 first system cable; 10C 1.5mm2"},
  {id:"RACON_TO_CONTROL_B",from:"RACON JB 630.1421-00",to:"Control box 630.1422-00",kind:"BFOU 12C x 1.5mm2",category:"outdoorAdjacent",circuits:1,evidence:"Application diagram p3 second system cable; 10C 1.5mm2"},
  {id:"CONTROL_TO_DB",from:"Control box 630.1422-00",to:"DB-5P indoor interface",kind:"BFOU 12C x 1.5mm2",category:"fieldToIndoor",circuits:1,evidence:"Application diagram p3 10C 1.5mm2; check actual signal termination map"},
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
  const lines=p.connectionTypes.map(v=>{
   const budgetLengthM=p.modelledLengthsM[v.category];
   const totalProcurementM=ceilPurchase(budgetLengthM)*v.circuits;
   const provided=p.quotation.cablesIncluded.find(c=>c.id===v.id);
   const includedM=provided?.lengthM??0;
   const additionalM=Math.max(0,totalProcurementM-includedM);
   return {id:v.id,wp:w.wp,...v,designBudgetM:budgetLengthM,
    procurementM:totalProcurementM,vendorIncludedM:includedM,additionalPurchaseM:additionalM,
    vendorIncludedBasis:provided?"ORGA_QUOTE_P4_INCLUSION_PROVISIONAL":"NO_QUOTED_VENDOR_CABLE",
    unitRateTHB:null,extendedTHB:null,workingZeroDisplayTHB:0,
    costOwner:"FIELD_RACON_BULK_NET_OF_VENDOR_INCLUSION",state:additionalM?"ADDITIONAL_CABLE_RATE_PENDING":"VENDOR_INCLUDED_ONLY"};
  });
  const types=[...new Set(lines.map(x=>x.kind))].map(kind=>({kind,
   distinctRuns:lines.filter(x=>x.kind===kind).reduce((n,x)=>n+x.circuits,0),
   totalPurchaseM:lines.filter(x=>x.kind===kind).reduce((n,x)=>n+x.additionalPurchaseM,0)}));
  return {wp:w.wp,rows:lines,cableTypes:types,routedRunCount:lines.length,
   procurementTotalM:lines.reduce((n,x)=>n+x.procurementM,0),
   vendorIncludedCableM:lines.reduce((n,x)=>n+x.vendorIncludedM,0),
   additionalCablePurchaseM:lines.reduce((n,x)=>n+x.additionalPurchaseM,0),
   fieldGlandCandidateQty:lines.length*2,vendorIncludedGlandQty:p.quotation.glandsIncluded,
   additionalGlandCandidateQty:Math.max(0,lines.length*2-p.quotation.glandsIncluded),
   glandState:"6 CMP T3CDS GLANDS PROVISIONALLY QUOTED INCLUDED; ONLY UNMATCHED EX FIELD ENTRIES MAY REQUIRE PURCHASE",
   knownVendorEnclosureCostExtraTHB:0,
   pricedSubtotalTHB:null,displayWorkingTHB:0,
   completionState:"NET_OF_VENDOR_INCLUDED__PRICE_AND_COMMERCIAL_CLARIFICATION_PENDING",
   quotation:p.quotation,
   caveat:"60m field control-box-to-indoor DB and 6m local runs are assumptions, not measured routes. ORGA supplies 5m+5m+10m BFOU 12C and six glands per quoted package. These are provisional credits; p8 exclusions and p5/p7 FAT contradiction must be clarified."};
 });
}
