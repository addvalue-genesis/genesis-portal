/*
PJ2608-0550 PAGA Bulk Pilot Rev00
Source: PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx
Drive: 1DaLqyT1WChxawJPNf5mK2_9TAg4Mh41G
Controlled adaptation only. Ref/scenario qty is not released order qty.
*/
export const PROJECT0550_PAGA_BULK_SOURCE={
  workbook:"PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx",
  driveFileId:"1DaLqyT1WChxawJPNf5mK2_9TAg4Mh41G",
  sheet:"PAGA | Bulk breakdown for quotation",
  revision:"Rev00",
  sourceDate:"2026-09-13"
};

export const PROJECT0550_PAGA_BULK_ROWS=[
  {id:"B01",objectClass:"BULK",family:"CABLE",ownership:"SYSTEM_DEDICATED",item:"Indoor FR audio cable",spec:"T3 | 2C x 2.5 mm2",refQty:3580,unit:"m",qtyState:"FEED_REFERENCE",basis:"LIS APF source; confirm rating, route and allowances.",labour:"Pull m; terminate actual cores; circuit test",route:"A1-05",installRoute:"C1"},
  {id:"B02",objectClass:"BULK",family:"CABLE",ownership:"SYSTEM_DEDICATED",item:"Indoor FR cable",spec:"T3 | 4C x 2.5 mm2",refQty:430,unit:"m",qtyState:"FEED_REFERENCE",basis:"Purpose/voltage and route allocation to be confirmed.",labour:"Pull m; terminate actual cores",route:"A1-05",installRoute:"C1"},
  {id:"B03",objectClass:"BULK",family:"CABLE",ownership:"SYSTEM_DEDICATED",item:"Outdoor armoured FR cable",spec:"T4 | 2C x 2.5 mm2",refQty:805,unit:"m",qtyState:"RECONCILE_MTO",basis:"805 m extracted; reconcile with MTO by cable identity.",labour:"Pull m; armour bond; terminate",route:"A1-05",installRoute:"C1"},
  {id:"B04",objectClass:"BULK",family:"CABLE",ownership:"SYSTEM_DEDICATED",item:"Outdoor armoured FR cable",spec:"T4 | 4C x 2.5 mm2",refQty:17840,unit:"m",qtyState:"HOLD",basis:"Includes legacy inter-cabinet copper and duplicate-tag records; redesign for IP/FO architecture.",labour:"Physical installed m after redesign",route:"A1-05_AFTER_REDESIGN",installRoute:"C1"},
  {id:"B05",objectClass:"BULK",family:"SPECIAL_CABLE",ownership:"SYSTEM_DEDICATED",item:"OCU / digital station special cable",spec:"OEM selection",refQty:640,unit:"m",qtyState:"OEM_CLARIFICATION",basis:"Two source runs 270 + 370 m; DX705 uses XDG Up0 two-wire.",labour:"Pull m; OEM termination and loop test",route:"A1-05",installRoute:"C1"},
  {id:"B06",objectClass:"BULK",family:"FIBER",ownership:"TBC",item:"Inter-cabinet fibre cable",spec:"SM fibre; cores/construction TBC",refQty:null,unit:"m",qtyState:"UNIT_RATE_AFTER_SPEC",basis:"Confirm topology, redundancy, cores and shared LAN/FO scope.",labour:"Pull m; splice cores; optical tests",route:"A1-05_IF_DEDICATED / COMMON_IF_SHARED",installRoute:"C1"},
  {id:"B07",objectClass:"BULK",family:"ODF_PATCH",ownership:"TBC",item:"Fibre termination accessories",spec:"ODF / pigtail / adapter / patch lead",refQty:null,unit:"set",qtyState:"UNIT_RATE_AFTER_SPEC",basis:"Count actual fibre ends; deduct verified LAN/FO scope and OEM patch cords.",labour:"Mount ODF; splice / label / test",route:"A1-05_IF_DEDICATED / COMMON_IF_SHARED",installRoute:"C1"},
  {id:"B08",objectClass:"BULK",family:"DATA_CABLE",ownership:"SYSTEM_DEDICATED",item:"Access-panel network cabling",spec:"Project-approved CAT6A link",refQty:null,unit:"link",qtyState:"SCENARIO_4_OR_8",basis:"4 quoted IP panels; 1 or 2 LAN connections each; confirm power method.",labour:"Pull route m; terminate ends; certify links",route:"A1-05",installRoute:"C1"},
  {id:"B09",objectClass:"BULK",family:"CONNECTOR",ownership:"SYSTEM_DEDICATED",item:"RJ45 / modular jack / patch cords",spec:"Approved termination arrangement",refQty:null,unit:"pc",qtyState:"DERIVE_FROM_ENDS",basis:"Count actual field-terminated ports; factory patch leads are different assemblies.",labour:"Field terminations only; exclude factory ends",route:"A1-05",installRoute:"C1"},
  {id:"B10",objectClass:"BULK",family:"JB",ownership:"SYSTEM_DEDICATED",item:"PAGA outdoor junction boxes",spec:"Ex certified; minimum IP65 per SPE",refQty:59,unit:"tag",qtyState:"FEED_REFERENCE_ONLY",basis:"59 distinct JB tags in extracted APF graph; confirm replacement scope and terminal/entry schedule.",labour:"Mount JB; gland; terminate cores; test",route:"A1-05",installRoute:"C1"},
  {id:"B11",objectClass:"BULK",family:"GLAND",ownership:"SYSTEM_DEDICATED",item:"Additional Ex horn glands",spec:"M20 x 1.5; cable OD/armour/certificate TBC",refQty:57,unit:"pc",qtyState:"CONDITIONAL_SCENARIO",basis:"Conditional result if all 57 horns use two entries and supplied gland is suitable; not released.",labour:"Install all field glands including free-issued",route:"A1-05_IF_REQUIRED",installRoute:"C1"},
  {id:"B12",objectClass:"BULK",family:"GLAND",ownership:"SYSTEM_DEDICATED",item:"Additional ceiling speaker glands",spec:"M20; actual cable OD TBC",refQty:124,unit:"pc",qtyState:"CONDITIONAL_SCENARIO",basis:"Conditional result if all 124 use two entries; final topology may differ.",labour:"Install field glands and mount ceiling units",route:"A1-05_IF_REQUIRED",installRoute:"C1"},
  {id:"B13",objectClass:"BULK",family:"GLAND_STOPPING_PLUG",ownership:"SYSTEM_DEDICATED",item:"Beacon glands and stopping plugs",spec:"GNEx: 3 M20 entries; supplied fittings TBC",refQty:null,unit:"pc",qtyState:"OEM_CLARIFICATION",basis:"Entry count does not prove supplied gland count; verify actual cable/entry arrangement.",labour:"Entry installation; power terminations",route:"A1-05_IF_REQUIRED",installRoute:"C1"},
  {id:"B14",objectClass:"BULK",family:"GLAND",ownership:"SYSTEM_DEDICATED",item:"Digital Ex station glands",spec:"DX705 family M20 / M25",refQty:null,unit:"pc",qtyState:"VERIFY_SUPPLIED_SET",basis:"Confirm offered assembly, armour compatibility and actual used entries.",labour:"Mount / gland / terminate station",route:"A1-05_IF_REQUIRED",installRoute:"C1"},
  {id:"B15",objectClass:"BULK",family:"MOUNTING_SUPPORT",ownership:"SYSTEM_DEDICATED",item:"Field mounting materials",spec:"Pole clamps / anchors / ceiling works",refQty:null,unit:"set",qtyState:"MEASURE_BY_MOUNTING_TYPE",basis:"57 Ex horn brackets supplied; site clamps/posts/anchors remain layout dependent.",labour:"Mount by surface / height / access method",route:"A1-05",installRoute:"C1"},
  {id:"B16",objectClass:"BULK",family:"CABINET_INSTALL_ACCESSORY",ownership:"SYSTEM_DEDICATED",item:"Cabinet installation materials",spec:"Plinth / anchors / wall support / penetration",refQty:7,unit:"cabinet",qtyState:"QUOTED_ASSEMBLY_COUNT",basis:"2 floor cabinets + 5 wall cabinets; support loads require approved GA.",labour:"Set cabinets; anchor; bond; connect",route:"A1-05",installRoute:"C1"},
  {id:"B17",objectClass:"BULK",family:"POWER_DISTRIBUTION_ACCESSORY",ownership:"SYSTEM_DEDICATED",item:"UPS feeds / beacon power / protection",spec:"Feed and circuit ratings TBC",refQty:null,unit:"circuit",qtyState:"ELECTRICAL_INTERFACE",basis:"Separate audio circuits, beacon 230 VAC and control wiring; autonomy requires load calculation.",labour:"Pull feeds; terminate; protection / autonomy test",route:"A1-05",installRoute:"C1"},
  {id:"B18",objectClass:"BULK",family:"EARTHING_CONTAINMENT",ownership:"TBC",item:"Earthing / containment / sealing",spec:"By route and penetration schedule",refQty:null,unit:"lot",qtyState:"BREAK_DOWN_BEFORE_RFQ",basis:"Bond cabinet, armour and supports; shared routes only under agreed allocation.",labour:"Installed m / supports / bonds / penetrations",route:"A1-05_IF_DEDICATED / COMMON_IF_SHARED",installRoute:"C1"},
  {id:"B19",objectClass:"BULK",family:"NAMEPLATE_LABEL",ownership:"SYSTEM_DEDICATED",item:"SS316 nameplates and cable markers",spec:"By asset / cable / core identity",refQty:null,unit:"pc",qtyState:"DERIVE_FROM_TAG_REGISTER",basis:"Avoid duplicate OEM nameplates; derive labels from actual asset/cable ends.",labour:"Install actual labels; no factory double charge",route:"A1-05",installRoute:"C1"},
  {id:"B20",objectClass:"ACCESSORY",family:"OEM_CONNECTION_KIT",ownership:"VENDOR_INCLUDED_TBC",item:"OEM speaker connection kits",spec:"XPA LINE/LOOP; XPAZ connection kits",refQty:null,unit:"kit",qtyState:"INCLUSION_CHECK_FIRST",basis:"Required kits may be included in quoted cabinet; obtain final cabinet BOM before adding.",labour:"Factory wiring versus field work boundary",route:"A1-05_AFTER_VENDOR_RECONCILIATION",installRoute:"C1_IF_FIELD_WORK"},
  {id:"B21",objectClass:"ACCESSORY",family:"BEACON_CONTROL_COMPLETION",ownership:"SYSTEM_DEDICATED",item:"Monitored beacon circuit completion",spec:"XBC + licences + field terminals",refQty:null,unit:"set",qtyState:"OEM_GAP_QUOTATION",basis:"XBC is optional; monitored-loop requirement must be closed against PHI/SPE and final design.",labour:"Factory fit; field wiring; monitored-loop test",route:"A1-05_OPTION_OR_REQUIRED",installRoute:"C1"},
  {id:"B22",objectClass:"ACCESSORY",family:"SYSTEM_COMPLETION_OPTION",ownership:"VENDOR_INCLUDED_TBC",item:"System completion options",spec:"Redundant controller / test panel / spare capacity",refQty:null,unit:"set",qtyState:"OEM_GAP_QUOTATION",basis:"Resolve engineering checks before fixing option quantity and associated bulk.",labour:"OEM configuration; integration / functional test",route:"A1-05_OPTION_OR_REQUIRED",installRoute:"B4_OR_C1_BY_WORK_OBJECT"},
  {id:"B23",objectClass:"SERVICE",family:"VDRL_SERVICE_GAP",ownership:"VENDOR_INCLUDED_TBC",item:"VDRL / SDRL gap services",spec:"Compliance matrix and additional deliverables",refQty:null,unit:"lot",qtyState:"QUOTE_INCREMENTAL_SCOPE",basis:"OEM documentation/project management already quoted; price only confirmed gaps and site documents.",labour:"Document hours by deliverable / revisions",route:"B1",installRoute:"N/A"},
  {id:"B24",objectClass:"SERVICE",family:"SITE_SERVICE",ownership:"TBC",item:"Onshore installation / SAT / commissioning",spec:"Activity quantities x onshore unit MH",refQty:null,unit:"lot",qtyState:"SEPARATE_SERVICE_QUOTATION",basis:"Factory FAT rate is not onshore crew/SAT rate; obtain authorised site commissioning terms.",labour:"Installed quantities x MH/unit; assign owner",route:"B4 / C1 BY WORK_OBJECT",installRoute:"C1_PHYSICAL / B4_ASSISTANCE_TEST"}
];


export const PROJECT0550_PAGA_ANALYSIS_GROUPS = [
  {order:"01",code:"MAIN_EQUIPMENT",title:"Main Equipment / Vendor Package",commercialRoute:"A1-05",purpose:"Selected OEM equipment/package source. Vendor service may remain inside the selected package only when explicitly controlled and not double-counted elsewhere."},
  {order:"02",code:"BULK_MATERIAL",title:"Bulk / Material",commercialRoute:"A1-05 material + C1 installation labor",purpose:"Physical bulk/material objects remain separate MTO/cost objects even when customer pricing rolls them into A1-05."},
  {order:"03",code:"SYSTEM_COMPLETION",title:"System Completion / Accessories / Options",commercialRoute:"A1-05 / option / required completion",purpose:"Accessories, licences and completion options that require vendor-inclusion reconciliation before adding cost."},
  {order:"04",code:"ENGINEERING_DOCUMENTS",title:"Engineering / CAL / SDY / RPT / VDRL",commercialRoute:"B1",purpose:"ADVALUE retained engineering and document-production work; vendor documentation already included in package is not recreated."},
  {order:"05",code:"LOGISTICS",title:"Transportation / Freight / Logistics",commercialRoute:"B2",purpose:"Goods movement from the vendor delivery point onward; separate from physical bulk material."},
  {order:"06",code:"TRAINING",title:"Training",commercialRoute:"B3",purpose:"Vendor and ADDVALUE training roles remain separate work/cost objects."},
  {order:"07",code:"FIELD_LIFECYCLE",title:"FAT / IFAT / Field Assistance / Pre-Com / SAT / Commissioning",commercialRoute:"B4",purpose:"Role-based lifecycle work. OEM execute/supervise and ADDVALUE lead/witness/closeout may coexist when roles are complementary."},
  {order:"08",code:"STARTUP_SPARES",title:"Start-up / Commissioning Spares",commercialRoute:"B5",purpose:"Commissioning-stage spares and consumables with their own quantity basis."},
  {order:"09",code:"SPECIAL_TOOLS",title:"Special Tools",commercialRoute:"B6",purpose:"Operation/maintenance special tools; reconcile vendor-included tools before adding."},
  {order:"10",code:"SURVEY",title:"Survey / Existing Condition Verification",commercialRoute:"B7",purpose:"Survey work triggered by missing/uncertain physical evidence; avoid blanket per-system duplication."},
  {order:"11",code:"REGULATORY",title:"Permit / Licence / Regulatory",commercialRoute:"B8",purpose:"Permit, type approval, import/export and regulatory coordination/pass-through."},
  {order:"12",code:"INSURANCE",title:"Insurance / Risk Transfer",commercialRoute:"B9",purpose:"Project/personnel insurance and risk-transfer cost."},
  {order:"13",code:"INSTALLATION",title:"On-site Installation Construction",commercialRoute:"C1",purpose:"Physical installation, pulling, mounting, termination and construction work; material stays in its material cost object."},
  {order:"14",code:"CAPITAL_SPARES",title:"10-Year Capital Spares",commercialRoute:"C2",purpose:"Capital spares priced separately from base installed equipment."},
  {order:"15",code:"OPERATION_SPARES",title:"2-Year Operation Spares",commercialRoute:"C3",purpose:"Two-year normal-operation spare parts."},
  {order:"16",code:"SHARED_COMMON",title:"Shared / Common Allocation Pool",commercialRoute:"CAUSAL ALLOCATION BEFORE A/B/C ROLL-UP",purpose:"Common FO/containment/earthing/shared objects stay common until a defensible causal allocation driver exists; never divide by 19 by default."},
  {order:"17",code:"COMMERCIAL_SUMMARY",title:"Cost / Commercial Summary",commercialRoute:"SOURCE_COST → INTERNAL_COST → WORKING_SELL → RELEASED_SELL",purpose:"Final management view of the four semantic price layers and release state."}
];

export const PROJECT0550_PAGA_BULK_GROUPS = [
  {order:"02.1",code:"CABLE_FIBER",title:"Cable / Fiber",families:["CABLE","SPECIAL_CABLE","FIBER","DATA_CABLE"]},
  {order:"02.2",code:"TERMINATION",title:"JB / Gland / Connector / Termination",families:["ODF_PATCH","CONNECTOR","JB","GLAND","GLAND_STOPPING_PLUG"]},
  {order:"02.3",code:"MOUNTING",title:"Mounting / Cabinet / Support",families:["MOUNTING_SUPPORT","CABINET_INSTALL_ACCESSORY"]},
  {order:"02.4",code:"POWER_EARTHING",title:"Power / Earthing / Containment / Label",families:["POWER_DISTRIBUTION_ACCESSORY","EARTHING_CONTAINMENT","NAMEPLATE_LABEL"]},
  {order:"03",code:"COMPLETION",title:"System Completion / Accessories / Options",objectClasses:["ACCESSORY"]}
];

export function pagaBulkDisplayGroup(row={}){
  for(const group of PROJECT0550_PAGA_BULK_GROUPS){
    if(group.objectClasses?.includes(row.objectClass)) return group;
    if(group.families?.includes(row.family||row.material_family)) return group;
  }
  return {order:"02.9",code:"OTHER_BULK",title:"Other Bulk / Material"};
}

export const PROJECT0550_PAGA_BULK_SUMMARY={
  sourceRows:PROJECT0550_PAGA_BULK_ROWS.length,
  materialAccessoryRows:PROJECT0550_PAGA_BULK_ROWS.filter(x=>x.objectClass==="BULK"||x.objectClass==="ACCESSORY").length,
  serviceRows:PROJECT0550_PAGA_BULK_ROWS.filter(x=>x.objectClass==="SERVICE").length,
  releasedQuantityRows:0,
  rule:"All current quantities remain reference/scenario/derivation states until later canonical evidence releases them."
};

export function pagaBulkRowsForRoute(prefix){
  return PROJECT0550_PAGA_BULK_ROWS.filter(x=>String(x.route||"").startsWith(prefix));
}

