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
  {id:"B08",objectClass:"BULK",family:"DATA_CABLE",ownership:"SYSTEM_DEDICATED",item:"Access-panel network cabling",spec:"Project-approved CAT6A link",refQty:null,unit:"link",qtyState:"SCENARIO_4_OR_8",basis:"4 quoted IP panels; 1 or 2 LAN connections each; confirm power method.",labour:"Pull route m; terminate ends; certify links",route:"A1-05",installRoute:"C1"}
];
