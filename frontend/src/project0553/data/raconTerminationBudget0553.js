import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import {APPROVED_0553_BUDGET_BASIS} from "./approvedBudgetBasis0553";
import {MDS_SCOPE_DECISION_0553} from "./mr0004WorkingBom0553";

// Information-only Tideland 070.1016-DWG Rev.C (2 sheets) and
// SEABEACON-2 application diagram page 3. Raw quote inclusion/exclusion
// contradictions stay below; owner's decision governs effective supply credits.
// Lengths below are explicit engineering scenarios, not dimensions taken from GA.
export const RACON_TERMINATION_POLICY_0553=Object.freeze({
 state:"PRELIMINARY_BUDGETARY_ROUTE_SCENARIO_NOT_MEASURED",
 supplierDrawing:"SEABEACON 2 Termination Diagram (For information only).pdf",
 originalDrawing:"Tideland 070.1016-DWG Rev C",siteDrawing:"MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1",
 terminalCount:17,procurementAllowancePct:APPROVED_0553_BUDGET_BASIS.greenfield.cableProcurementAllowancePct,
 modelledLengthsM:{outdoorAdjacent:6,fieldToIndoor:60,indoorInterface:6},
 packageOwner:"RACON_VENDOR_PACKAGE",
 excludedFromVendor:"Owner 02-Nov-2026 selects FAT/cable/gland exclusion. ADDVALUE supplies; no provisional vendor credit. Raw QTORG2609244 contradictions remain source evidence only.",
 scopeDecision:MDS_SCOPE_DECISION_0553,
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
 "Owner selected ADDVALUE cable/gland supply; final gland size and active entry count still require cable-end/Ex verification"]
});
const ceilPurchase=m=>Math.ceil(m*(1+RACON_TERMINATION_POLICY_0553.procurementAllowancePct/100));
export function deriveRaconTerminationBudget0553(){
 const p=RACON_TERMINATION_POLICY_0553;
 return Z1F_TEL_LAYOUT_INDEX_0553.byWP.filter(w=>w.equipment.some(e=>e.system==="MARINE_RACON"&&e.tag==="MAR-514-001")).map(w=>{
  const lines=p.connectionTypes.map(v=>{
   const budgetLengthM=p.modelledLengthsM[v.category];
   const totalProcurementM=ceilPurchase(budgetLengthM)*v.circuits;
   const quotedProvided=p.quotation.cablesIncluded.find(c=>c.id===v.id);
   const provided=p.scopeDecision.vendorCableCreditM===0?null:quotedProvided;
   const includedM=provided?.lengthM??0;
   const shortfallM=Math.max(0,totalProcurementM-includedM);
   const replacementFullRunM=provided&&shortfallM>0?totalProcurementM:0;
   const additionalM=provided?replacementFullRunM:totalProcurementM;
   return {id:v.id,wp:w.wp,...v,designBudgetM:budgetLengthM,
    procurementM:totalProcurementM,vendorIncludedM:includedM,extensionShortfallM:shortfallM,replacementFullRunM,additionalPurchaseM:additionalM,
    quotedVendorCableM:quotedProvided?.lengthM??0,
    vendorIncludedBasis:"OWNER_EXCLUDES_CABLES__ADDVALUE_SUPPLY",
    cableUseRule:provided&&shortfallM>0?"REPLACE_FULL_RUN_UNLESS_ENGINEERED_JOIN_APPROVED":"NO_JOIN_REQUIRED",
    unitRateTHB:p.webBudgetRates?.[v.kind]?.thbPerM??null,extendedTHB:Number.isFinite(p.webBudgetRates?.[v.kind]?.thbPerM)?Math.round(additionalM*p.webBudgetRates[v.kind].thbPerM*100)/100:null,workingZeroDisplayTHB:0,
    costOwner:p.scopeDecision.cableOwner,state:additionalM?(Number.isFinite(p.webBudgetRates?.[v.kind]?.thbPerM)?"WEB_BUDGET_RATE_EX_WORKS_NOT_LANDED":"ADDITIONAL_CABLE_RATE_PENDING"):"NO_CABLE_PURCHASE"};
  });
  const types=[...new Set(lines.map(x=>x.kind))].map(kind=>({kind,
   distinctRuns:lines.filter(x=>x.kind===kind).reduce((n,x)=>n+x.circuits,0),
   totalPurchaseM:lines.filter(x=>x.kind===kind).reduce((n,x)=>n+x.additionalPurchaseM,0)}));
  return {wp:w.wp,rows:lines,cableTypes:types,routedRunCount:lines.length,
   procurementTotalM:lines.reduce((n,x)=>n+x.procurementM,0),
   vendorIncludedCableM:lines.reduce((n,x)=>n+x.vendorIncludedM,0),
   additionalCablePurchaseM:lines.reduce((n,x)=>n+x.additionalPurchaseM,0),
   extensionShortfallOnlyM:lines.reduce((n,x)=>n+x.extensionShortfallM,0),
   supplyRisk:"ADDVALUE supplies full routed cable lengths; six route functions and budget lengths are scenarios, not a measured cable schedule",
   fieldGlandCandidateQty:lines.length*2,vendorIncludedGlandQty:p.scopeDecision.vendorGlandCreditQty,
   additionalGlandCandidateQty:Math.max(0,lines.length*2-p.scopeDecision.vendorGlandCreditQty),
   glandState:"OWNER_EXCLUDES_GLANDS__ADDVALUE_SUPPLY__FINAL_EX_END_REGISTER_PENDING",
   knownVendorEnclosureCostExtraTHB:0,
   pricedSubtotalTHB:lines.some(x=>x.extendedTHB!==null)?Math.round(lines.reduce((n,x)=>n+(x.extendedTHB??0),0)*100)/100:null,displayWorkingTHB:0,
   pricedCoverageCount:lines.filter(x=>x.extendedTHB!==null).length,unpricedCoverageCount:lines.filter(x=>x.extendedTHB===null).length,
   completionState:"ADDVALUE_SUPPLY_CONFIRMED__TAKEOFF_AND_RATES_PENDING",
   quotation:p.quotation,
   scopeDecision:p.scopeDecision,
   caveat:"Owner selects FAT/cable/gland exclusions: ADDVALUE B3 owns integrated FAT; ADDVALUE field bulk owns cables/glands. Supplier credits are zero. Raw p4/p5 inclusions and p7/p8 exclusions are retained, not supplier-confirmed resolution. 60m field and 6m local runs plus cable types/end counts remain engineering assumptions. No measured takeoff, matched purchase rate or new cost posting is implied."};
 });
}
