// Historical BARTEC 2022 As-Built GA mapping to PJ2608-0553 SCADA radio indoor functions.
// Source is a reference assembly in another project, NOT ZWP20 native GA or current quantities.
// 21G1048t-BA-GA-1001 Type 1 & 1002 Type 2, Z0; reference file 16 pages.
export const ZWP20_BARTEC_NEXTG_REFERENCE_MAP=Object.freeze({
 source:{name:"21G1048t-BA-GA-100X_Z0.pdf",revision:"Z0",year:2022,
   status:"HISTORICAL_REFERENCE_ONLY",type1:"GA-1001 pages 1-3",type2:"GA-1002 pages 4-6",
   note:"Legacy TCAB-WP12/WP14/WP6/etc tags do not identify ZWP20 TCAB-500-001."},
 currentBasis:{mto:"MR0001 MTO Rev04: ZWP20 row 5 IDU 1 Set; row 7 LAN 1 Set; row 9 TCAB 1 Set; row 10 SA 1 Set",
   bld:"MM-ZTK-1F-ZWPX-TEL-BLD-0001 Rev C1 AFC sheet 3 Note 8: NEW IDU AND SURGE ARRESTOR installed in NEW Ex e ENCLOSURE"},
 entries:[
  {functionId:"INDOOR_POE_INJECTOR",legacyVendor:"REDLINE",legacySku:"RPM-POEINJ-DC",legacyDrawing:"GA-1001 p2 line 1B; GA-1002 p5 line 1B",
   candidateVendor:"Next G / Aviat",candidateQuote:"NG/260916-ADV-DAP1",candidateLine:"B-6",alternativeQuoteLine:"A-6",candidateSku:"PS-DCDC-HAZ-POE-IND-01",
   estimatedUnitUSD:667.67,allocation:"MR-502-001A row5",status:"BUDGETARY_FUNCTIONAL_IDU_INTERFACE_SELECTION",
   checks:["DC feed, PoE budget, Zone 2 Ex suitability and internal wiring","Customer IDU is a functional label: PoE injector/power interface is a suitable budgetary interpretation, pending OEM interface compliance; A-6 and B-6 same SKU and not additive"]},
  {functionId:"INDOOR_POWER_CORD",legacyVendor:"BARTEC",legacySku:"INTERNAL_WIRING_PVC",legacyDrawing:"GA-1001 p2 line 22",
   candidateVendor:"Next G / Aviat",candidateQuote:"NG/260916-ADV-DAP1",candidateLine:"B-7",candidateSku:"PPT-B",
   estimatedUnitUSD:3.6,allocation:"MR-502-001A row5",status:"ELECTRICAL_INTERFACE_REVIEW",
   checks:["North America power cord may not suit ZWP20 DC-hardwired installation"]},
  {functionId:"ETHERNET_SURGE",legacyVendor:"MTL",legacySku:"ZB24597",legacyDrawing:"GA-1001 p2 line 1C; GA-1002 p5 line 1C",
   candidateVendor:"Next G / Aviat",candidateQuote:"NG/260916-ADV-DAP1",candidateLine:"B-8",candidateSku:"LP-POE-INL-IND-01",
   estimatedUnitUSD:614.2,allocation:"SA-502-001 row10",status:"FUNCTION_CANDIDATE_NOT_EX_COMPLIANCE_APPROVED",
   checks:["PoE, earthing, hazardous-area ratings, protective coordination","Do not include again within row5 or row9"]},
  {functionId:"INDUSTRIAL_MANAGED_SWITCH",legacyVendor:"Cisco",legacySku:"IE3200/3300/3400-8T",legacyDrawing:"GA-1001 p2 line 1A",
   candidateVendor:"VST ECS / Cisco",candidateQuote:"A-0048/2026_Re1",candidateLine:"1.0",candidateSku:"IE-3400-8P2S-E",
   estimatedUnitUSD:null,allocation:"LAN-502-001 row7",status:"PARTIAL_TECHNICAL_FAMILY_MATCH",
   checks:["Port count, Ex installation method, PoE load and network architecture","Not a Next G quoted line; purchase package priced THB separately"]},
  {functionId:"EX_E_ENCLOSURE",legacyVendor:"BARTEC",legacySku:"07-56D1-9811",legacyDrawing:"GA-1001 p2 line 1",
   candidateVendor:null,candidateQuote:null,candidateLine:null,candidateSku:null,estimatedUnitUSD:null,
   allocation:"TCAB-500-001 row9",status:"HISTORICAL_MECHANICAL_REFERENCE_NOT_ZWP20_SELECTED",
   checks:["600x400x210 mm SS316L Ex eb IP66 historical size only","Check ZWP20 heat dissipation, Ex certificate, gland entries, mounting and actual equipment layouts","Exclude Ex e telephone JB and unrelated Ex d radio enclosure"]},
  {functionId:"TERMINATION_AND_PANEL_ASSEMBLY",legacyVendor:"Phoenix Contact / BARTEC",legacySku:"BOM lines 2-22 (Type 1)",legacyDrawing:"GA-1001 p2",
   candidateVendor:null,candidateQuote:null,candidateLine:null,candidateSku:null,estimatedUnitUSD:null,
   allocation:"TCAB-500-001 row9 / bulk row11 by verified ownership",status:"HISTORICAL_ASSEMBLY_REFERENCE",
   checks:["Terminals, end covers, jumpers, markers, earth busbar, mounting, stopping plugs, glands and wiring","Historical quantities are NOT transferable to ZWP20 without a new interface take-off"]}
 ],
 nonApplicable:[
  "GA-1004 p10-11 is Ex e Telephone JB; NOT the SCADA Telecom Enclosure",
  "GA-1005 p12-14 is Ex d TETRA modem panel; NOT the SCADA indoor IDU enclosure",
  "GA-1006 p15-16 is TETRA selector station; NOT the SCADA telecom enclosure"
 ]
});
