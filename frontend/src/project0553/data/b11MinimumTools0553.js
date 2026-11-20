// PJ2608-0553 — EXA-A8 Attachment-2 Phase 1F 5.0 Telecommunication.
// Minimum project operational tools are separate from Rev08 historical B11
// quote rows. Do not allocate a one-lot source budget to individual licenses.
const SOURCE="MMC25-5001 EXA-A8 Attachment-2 / 5.0 Telecommunication";
const url="https://drive.google.com/file/d/1J3jkvf9e-tbFAiGwrK0s_bVIbH6pmUZ7/view";
const rows=Object.freeze([
 Object.freeze({id:"B11-MIN-01",description:"Software and license for SCADA radio configuration",qty:1,unit:"lot",mr:"MR-0001",tag:"MR-502-001",sourceQuoteCandidate:"B11-REV08-04",compatibilityGate:"SCADA_RADIO_OEM_LICENSE_RIGHTS_AND_PART_A_INCLUSION",applicable:true}),
 Object.freeze({id:"B11-MIN-02",description:"Software and license for SCADA network monitoring",qty:1,unit:"lot",mr:"MR-0001",tag:"LAN-502-001",sourceQuoteCandidate:"B11-REV08-04",compatibilityGate:"NMS_LICENSE_TERMS_AND_PART_A_CISCO_SUBSCRIPTIONS",applicable:true}),
 Object.freeze({id:"B11-MIN-03",description:"Software and license for TETRA voice gateway",qty:1,unit:"lot",mr:"MR-0002",tag:"RAD-508-001",sourceQuoteCandidate:"B11-REV08-04",compatibilityGate:"TETRA_GATEWAY_SCOPE_VS_SELECTED_DMR_RFI_BDA__FORMAL_APPLICABILITY_CHECK",applicable:null}),
 Object.freeze({id:"B11-MIN-04",description:"Configuration software license for radar beacon (if applicable)",qty:1,unit:"lot",mr:"MR-0004",tag:"MAR-514-001",sourceQuoteCandidate:"B11-REV08-01",compatibilityGate:"RACON_OEM_CONFIG_TOOL_NEEDED_AND_VENDOR_PACKAGE_INCLUDED",applicable:null}),
 Object.freeze({id:"B11-MIN-05",description:"Charging kit for radar beacon (if applicable)",qty:1,unit:"set",mr:"MR-0004",tag:"MAR-514-001",sourceQuoteCandidate:"B11-REV08-01",compatibilityGate:"RACON_POWER_INTERFACE_AND_PACKAGE_KIT_INCLUSION",applicable:null})
]);
export function selectB11MinimumTools0553(){
 if(rows.length!==5||new Set(rows.map(x=>x.id)).size!==5)throw Error("Minimum tool source register malformed");
 return Object.freeze({moduleId:"bid.budget.working.bc.b11.minimum-tools",source:SOURCE,url,
  rows:rows.map(x=>Object.freeze({...x,budgetAllocationTHB:null,
   budgetPriceState:"REFERENCE_TO_SHARED_REV08_B11_PACKAGE__NO_UNSUPPORTED_LINE_ALLOCATION",
   acceptedSpareSku:null,pricePostingAllowed:false})),
  requiredScopeState:"MINIMUM_EQUIPMENT_TOOLS_DELIVERY_REVIEW",
  sourceBudgetIncludedAsPackageReferenceOnly:true,
  unresolved:["MR0002 TETRA vs selected DMR RFI BDA applicability","RACON charging kit inclusion","SCADA NMS/Radio software already supplied in Part A licenses"],
  released:false});
}
