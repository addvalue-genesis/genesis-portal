import {selectBartecEnclosureBasis0553} from "./bartecEnclosureBasis0553";
// Historical GA component evidence for ZWP20 SCADA, not approved Z1F takeoff.
// Source references are kept at the level of physical interface and cost owner.
export const ZWP20_GA_BULK_RECONCILIATION=Object.freeze({
 // Current user's selected physical BARTEC panel hole pattern is 16 M20 entries,
 // not the former default of one gland and not the DTS 18-hole requirement.
 selectedBartecModelAndHoles:selectBartecEnclosureBasis0553("SCADA_EXE_TYPE_1_2_3"),
 selectedHoleBasis:"USER_CONFIRMED_2026-10-13__BARTEC_16_PRE_DRILLED_M20__DRAIN_SEPARATE",
 customerDeviationGate:"Z1F DTS-0001 C1 SCADA enclosure minimum 18 entries vs selected BARTEC 16; do not mark technical compliance until customer disposition.",

 sourceGAs:[
  {file:"21G1048t-BA-GA-100X_Z0.pdf",project:"Zawtika historical BARTEC",status:"AS_BUILT_2022",
   pages:[1,2,3,4,5,6,7,8,9],use:"Indoor Ex e telecom panel composition"},
  {file:"SAMART-CUEL 1E-GA-REV01.pdf",project:"Zawtika 1E",status:"TECHNICAL_PROPOSAL_2024_NOT_AS_BUILT",
   pages:[4,5,6,7,9,10,18,19,21],use:"Redline antenna mount, RF and hazardous-area Ethernet ingress"}
 ],
 panel:{
  sku:"07-56D1-9811",material:"SS316L",dimensionsMm:[600,400,210],ip:"IP66",
  includedHistoricalType1:{m20Top:12,m20Left:2,m20Right:2,stoppingPlugs:16,locknuts:16,drain:1,
   terminalUT25:6,earthTerminal:10,earthBusbar:1,internalWiringLot:1},
  quoteAllocation:"TCAB-500-001 row9 historical assembly THB 39200",
  rule:"Entries/locknuts/blanking plugs are included in historical panel assembly, not a requirement to purchase 16 new glands."
 },
 functions:[
  {id:"ETH_CABLE_RUN",kind:"FIELD_CABLE",currentQty:69,unit:"m",scope:"One management-budget CAT6A ODU-to-indoor run; 60m base plus 15% purchasing allowance",
   source:"Z1F LAY C1 + Z1D geometric comparison + 1E GA p6",owner:"BULK_ROW_11",priceState:"COSTED_BUDGETARY_524_THB_PER_M",
   technicalChecks:["Outdoor/UV, fire rating and Ex penetration requirements","69m is approved purchasing allowance, not a measured route; confirm independent circuits"]},
  {id:"OUTDOOR_RADIO_INGRESS",kind:"EX_INTERFACE",currentQty:null,unit:"set",
   scope:"Radio Ethernet ingress shown as 3/4in NPT union, certified gland, cold shrink and RJ45 CAT6 plug on 1E GA p6",
   source:"SAMART-CUEL 1E GA p6",owner:"BULK_ROW_11_IF_NOT_INCLUDED_WITH_ODU",
   priceState:"NOT_INCLUDED_IN_TOTAL__VERIFY_VENDOR_SUPPLY_AND_COMPATIBILITY",
   technicalChecks:["3/4in NPT thread and Zone-2 certification","Hawke M20 is NOT a verified replacement for 3/4in NPT radio-entry kit","Determine if Next G vendor/package includes these fittings"]},
  {id:"INDOOR_M20_ENTRY",kind:"EX_INTERFACE",currentQty:1,unit:"set",
   scope:"One provisional certified field-cable gland at Ex e SCADA panel, if not supplied as fitted assembly",
   source:"BARTEC GA-1001 p2 + Prosper Q-PROSRY-24051 + INNOVA QA24-0604 line4",
   owner:"BULK_ROW_11_CONDITIONAL",priceState:"BUDGETARY_1020_THB_ALLOWANCE",
   technicalChecks:["Check cable external diameter, Ex suitability and whether Prosper supplies final fitted gland","BARTEC included 16 stopping plugs are NOT 16 active cable glands"]},
  {id:"RJ45_PANEL_CONNECTOR",kind:"NETWORK_INTERFACE",currentQty:1,unit:"set",
   scope:"Phoenix patch panel and Weidmuller RJ45 field plug",
   source:"BARTEC GA-1001 p2 line1D + SAMART-CUEL 1E GA p6",
   owner:"DATO_ROW_8",priceState:"ALREADY_COSTED__NO_BULK_DUPLICATE",
   technicalChecks:["Weidmuller 1963600000 price remains management THB0 allowance","Do not duplicate RJ45 connector in field bulk without endpoint count"]},
  {id:"RF_JUMPERS_FILTER_MOUNT",kind:"RF_INTERFACE",currentQty:null,unit:"set",
   scope:"Antenna to Redline radio RF jumper(s), filter and mounting pieces, 1E 4ft GA p19",
   source:"SAMART-CUEL 1E GA p19 + Next G package B-5",
   owner:"ODU_ROW_4_PACKAGE_FIRST",
   priceState:"VERIFY_PACKAGE_B_5__NO_BULK_DUPLICATE",
   technicalChecks:["Map number of RF ports and jumper lengths to selected Aviat/Redline model","Review whether dedicated RF lightning protector is required outside included radio package"]},
  {id:"PANEL_DC_EARTH_WIRING",kind:"INTERNAL_ASSEMBLY",currentQty:null,unit:"lot",
   scope:"Phoenix power terminals, earth busbar, internal wiring and mounting plate",
   source:"BARTEC GA-1001 p2 and TD-1001 p3",
   owner:"TCAB_ROW_9_PANEL_ASSEMBLY",
   priceState:"INCLUDED_IN_HISTORICAL_PANEL_COMPARATOR",
   technicalChecks:["Count only additional external equipotential bonding/earthing in bulk after topology and field routes are determined"]}
 ],
 separateSystemsNotApplicable:["GA-1004 Ex e telephone JB","GA-1005 Ex d TETRA modem panel","GA-1006 TETRA selector station"],
 sourceOfTruth:"User confirms BARTEC model and as-drawn 16 M20 field-entry holes as Z1F working physical basis; current Z1F MR controls location/quantity, cable-end schedule controls active glands, vendor inclusion controls purchase. Historical 2022 site quantities are NOT Z1F procurement. DTS 18-hole conflict remains open."
});
