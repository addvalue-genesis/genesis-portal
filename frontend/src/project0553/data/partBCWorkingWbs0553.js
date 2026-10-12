// PJ2608-0553 | SOURCE-BOUND Part B/C working sell projection (NOT cost or customer release).
// Source: PJ2608-0553_PART_B_DETAILED_QUOTATION_WBS_Rev05-OFFSHORE-EVIDENCE-AUDIT-FIXED_20260903.xlsx
// Drive ID 1vXwV3py-FwdyvZaNq-OvsDyefZEJKPqz; 00_EXEC_QUOTE and 08_B1..11_B8_B9.
// Preserves cost owner: zero ADDVALUE contribution by others ≠ zero client scope price.
// Controlled equation register: GEQ-005,008,009,012,013,016,018,021,023,033.
export const PART_BC_WBS_SOURCE_0553=Object.freeze({
 url:"https://docs.google.com/spreadsheets/d/1vXwV3py-FwdyvZaNq-OvsDyefZEJKPqz/edit",
 revision:"Rev05 OFFSHORE EVIDENCE AUDIT FIXED 2026-09-03",
 status:"WORKING_SELL_BASIS_NOT_CLIENT_RELEASE",
 equationRegister:"PJ2608-0553_MASTER_MATHEMATICAL_EQUATION_REGISTER_Rev01-DRAFT_20260902.xlsx",
 summary:[
  {code:"B1",sellTHB:510000,driver:"964 role MH × calibrated office rate",qty:964,unit:"MH",owner:"ADDVALUE",state:"WORKING_PROPOSAL",equations:["GEQ-005","GEQ-008","GEQ-018"]},
  {code:"B2",sellTHB:580000,driver:"143 VDRL rows / 38 unique titles, lifecycle MH + document control, current controlled working quotation",qty:143,unit:"VDRL row",owner:"ADDVALUE",state:"CURRENT_WORKING",equations:["GEQ-009","GEQ-024"]},
  {code:"B3",sellTHB:2109600,driver:"8 Thailand FAT team-days + 5-trip / 39 offshore team-days × 2 = 78 MD; offshore USD800/MD at working FX 31.5",qty:78,unit:"offshore MD + FAT",owner:"ADDVALUE",state:"WORKING_BASE_HOLD_SAT_SCHEDULE",equations:["GEQ-005","GEQ-013","GEQ-016","GEQ-018"]},
  {code:"B4",sellTHB:null,driver:"Painting / coating by OEM/SAMTEL, if applicable",qty:null,unit:"scope",owner:"SAMTEL/OEM",state:"OUTSIDE_ADDVALUE_SCOPE_PRICE_REQUIRED_IF_APPLICABLE"},
  {code:"B5",sellTHB:null,driver:"Packing and marking vendor package",qty:null,unit:"package",owner:"SAMTEL/OEM",state:"OUTSIDE_ADDVALUE_SCOPE"},
  {code:"B6",sellTHB:null,driver:"CIF JUTAL-nominated China port and customs responsibility",qty:null,unit:"shipment",owner:"SAMTEL",state:"OUTSIDE_ADDVALUE_SCOPE_LOGISTICS_RATE_REQUIRED"},
  {code:"B7",sellTHB:null,driver:"3 months storage, commercial owner SAMTEL",qty:3,unit:"month",owner:"SAMTEL",state:"OUTSIDE_ADDVALUE_SCOPE"},
  {code:"B8",sellTHB:30000,driver:"44 MH training WBS × office commercial calibration",qty:44,unit:"MH",owner:"ADDVALUE",state:"WORKING_PROPOSAL",equations:["GEQ-005","GEQ-008"]},
  {code:"B9",sellTHB:574560,driver:"12 China JUTAL Yard team-days including labor/per diem, travel actual additional",qty:12,unit:"team-day",owner:"ADDVALUE/OEM",state:"WORKING_PROPOSAL_TRAVEL_EXCLUDED",equations:["GEQ-013","GEQ-016","GEQ-018"]},
  {code:"B10",sellTHB:null,driver:"Commissioning/startup spares Σ(required Qty × supplier unit rate)",qty:null,unit:"spares BOM",owner:"SAMTEL/OEM",state:"VENDOR_SCHEDULE_REQUIRED",equations:["GEQ-012","GEQ-033"]},
  {code:"B11",sellTHB:null,driver:"Special tools Σ(required Qty × supplier unit rate), check OEM included items",qty:null,unit:"tool BOM",owner:"SAMTEL/OEM",state:"VENDOR_SCHEDULE_REQUIRED",equations:["GEQ-012","GEQ-033"]},
  {code:"B12",sellTHB:null,driver:"First filling applicability gate; normally N/A for telecom, OEM confirmation required",qty:null,unit:"as applicable",owner:"SAMTEL/OEM",state:"N_A_PENDING_VENDOR_APPLICABILITY"},
  {code:"B13",sellTHB:null,driver:"Consumables Σ(required Qty × supplier unit rate) after exclusions",qty:null,unit:"consumables BOM",owner:"SAMTEL/OEM",state:"VENDOR_SCHEDULE_REQUIRED"},
  {code:"B14",sellTHB:null,driver:"Bond/insurance commercial owner, policy/insured value required",qty:null,unit:"policy",owner:"SAMTEL",state:"OUTSIDE_ADDVALUE_SCOPE"},
  {code:"C1",sellTHB:null,driver:"Capital spares option Σ(OEM spare Qty × vendor unit rate)",qty:null,unit:"optional spares BOM",owner:"SAMTEL/OEM",state:"OPTION_PRICE_PENDING",equations:["GEQ-012","GEQ-033"]},
  {code:"C2",sellTHB:null,driver:"2-year operational spares option Σ(OEM spare Qty × vendor unit rate)",qty:null,unit:"optional spares BOM",owner:"SAMTEL/OEM",state:"OPTION_PRICE_PENDING",equations:["GEQ-012","GEQ-033"]}
 ]});
export function derivePartBcWorkingWbs0553(){
 const rows=PART_BC_WBS_SOURCE_0553.summary.map(x=>({
  ...x,unitPriceTHB:Number.isFinite(x.sellTHB)&&Number.isFinite(x.qty)&&x.qty>0?x.sellTHB/x.qty:null,
  source:PART_BC_WBS_SOURCE_0553.revision
 }));
 const addvalue=rows.filter(x=>x.owner==="ADDVALUE"||x.code==="B9");
 const subtotalTHB=addvalue.every(x=>Number.isFinite(x.sellTHB))?addvalue.reduce((n,x)=>n+x.sellTHB,0):null;
 if(subtotalTHB!==3804160)throw Error("Part B Rev05 working sum mismatch");
 return {rows,subtotalTHB,sourceUrl:PART_BC_WBS_SOURCE_0553.url,
  state:"PART_B_ADDVALUE_WORKING_SELL_ONLY_NOT_COMPLETE_PROJECT_BC"};
}
