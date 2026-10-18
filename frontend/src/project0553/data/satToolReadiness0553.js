// SAT equipment readiness for PJ2608-0553; NON-POSTING evidence overlay.
// This file NEVER edits Part B direct cost, working sell, or A/B/C ledger values.
// "Budgetary" means quotation/rental period remains to be verified.
export const SAT_TOOL_REGISTER_0553 = Object.freeze({
 revision:"Rev.P / 2026-10-18", owner:"ADDVALUE", ledgerPolicy:"NON_POSTING",
 assumptions:["ADDVALUE executes SAT; MGW/OEM provides proprietary interfaces when contracted.",
 "Offshore: 2 Senior Specialists; rate USD 800 per PERSON-day is a selling scenario, not tool cost.",
 "RACON code D vs historical ORGA quote code Q is not closed; no acceptance auto-pass.",
 "Calibration certificates, approved ITP/OEM test method and site permissions required."],
 rows:[
  {id:"TOOL-SCADA-01",mr:"MR0001",system:"SCADA WiMAX",tests:"WMX-12/13, SIT-04A",item:"VeEX MX100+ Ethernet test set",method:"RENT",unitRateTHB:1000,rateUnit:"day",quantity:null,extendedCostTHB:null,status:"RATE EVIDENCED / RENTAL DAYS OPEN",owner:"ADDVALUE",gate:"Confirm RFC2544/Y.1564 enabled and far-end compatible test partner; 1000 THB/day not all campaign days"},
  {id:"TOOL-SCADA-02",mr:"MR0001",system:"SCADA WiMAX",tests:"WMX-12/13",item:"Far-end peer / Ethernet loopback",method:"RENT_OR_CLIENT",unitRateTHB:null,rateUnit:"period",quantity:null,extendedCostTHB:null,status:"NOT ESTABLISHED",owner:"ADDVALUE/ICT",gate:"Verify test-port compatibility and PTTEPI controlled load window"},
  {id:"TOOL-SCADA-03",mr:"MR0001",system:"SCADA WiMAX",tests:"WMX-05",item:"Calibrated RF Cable & Antenna Analyzer 5.5-5.8 GHz (VSWR/DTF)",method:"RENT",unitRateTHB:null,rateUnit:"period",quantity:null,extendedCostTHB:null,status:"QUOTATION PENDING",owner:"ADDVALUE",gate:"Measurement method and adapters; RF Explorer does not replace DTF"},
  {id:"TOOL-SCADA-04",mr:"MR0001",system:"SCADA WiMAX",tests:"WMX-04/08/11/15/16",item:"Aviat OEM diagnostics / NMS",method:"OEM_PROVIDED",unitRateTHB:null,rateUnit:"included-or-quote",quantity:null,extendedCostTHB:null,status:"INCLUSION OPEN",owner:"MGW/ADDVALUE",gate:"Firmware access, credentials, monitoring and log export"},
  {id:"TOOL-RFI-01",mr:"MR0002",system:"RFI BDA/DAS",tests:"DMR-10/11/17 screening",item:"RF Explorer 6G Combo PLUS (existing ADDVALUE analyzer)",method:"EXISTING",unitRateTHB:0,rateUnit:"new-purchase",quantity:1,extendedCostTHB:0,status:"PO EXISTS / CALIBRATION OPEN",owner:"ADDVALUE",gate:"Preliminary screening only; no direct high-power connection"},
  {id:"TOOL-RFI-02",mr:"MR0002",system:"RFI BDA/DAS",tests:"DMR-06",item:"Calibrated UHF Cable & Antenna Analyzer / DTF",method:"RENT",unitRateTHB:null,rateUnit:"period",quantity:null,extendedCostTHB:null,status:"QUOTATION PENDING",owner:"ADDVALUE",gate:"50-ohm interfaces; compatible 450-470 MHz range"},
  {id:"TOOL-RFI-03",mr:"MR0002",system:"RFI BDA/DAS",tests:"DMR-07/09/10",item:"Calibrated UHF RF generator + receiver/analyzer",method:"RENT_OR_OEM",unitRateTHB:null,rateUnit:"period",quantity:null,extendedCostTHB:null,status:"QUOTATION PENDING",owner:"ADDVALUE/MGW",gate:"Antenna isolation margin and measurement dynamic range to approved method"},
  {id:"TOOL-RFI-04",mr:"MR0002",system:"RFI BDA/DAS",tests:"DMR-11",item:"Calibrated RF power meter & sensor, couplers, rated attenuators/load",method:"RENT_OR_OEM",unitRateTHB:null,rateUnit:"period",quantity:null,extendedCostTHB:null,status:"QUOTATION PENDING",owner:"ADDVALUE/MGW",gate:"Sensor ratings must safely handle high-power BDA via test fixture"},
  {id:"TOOL-RFI-05",mr:"MR0002",system:"RFI BDA/DAS",tests:"DMR-09/12/14",item:"RFI OEM CLI/configuration cable + approved radios/coverage logging",method:"OEM_AND_ADDVALUE",unitRateTHB:null,rateUnit:"period",quantity:null,extendedCostTHB:null,status:"INCLUSION OPEN",owner:"MGW/ADDVALUE",gate:"Confirm RFI BDA exact model, RF frequencies, coverage method"},
  {id:"TOOL-PHONE-01",mr:"MR0003",system:"IP Phone & Ex Sounder",tests:"TEL-05/06",item:"Calibrated IEC 61672 Sound Level Meter + acoustic calibrator",method:"RENT",unitRateTHB:null,rateUnit:"period",quantity:null,extendedCostTHB:null,status:"QUOTATION PENDING",owner:"ADDVALUE",gate:"Measurement positions, ambient reference and approved sound criterion"},
  {id:"TOOL-PHONE-02",mr:"MR0003",system:"IP Phone & Ex Sounder",tests:"TEL-01/03/04/07",item:"Approved VoIP diagnostics / test handset / laptop",method:"EXISTING_OR_OEM",unitRateTHB:null,rateUnit:"period",quantity:null,extendedCostTHB:null,status:"VERIFICATION OPEN",owner:"ADDVALUE/MGW",gate:"PABX privileges, numbering plan and authorized call tests"},
  {id:"TOOL-RACON-01",mr:"MR0004",system:"ORGA/Tideland RACON",tests:"RCN-05",item:"OEM USB-to-flying-lead / RS232 programmer",method:"OEM_INCLUDED_TO_CONFIRM",unitRateTHB:null,rateUnit:"set",quantity:null,extendedCostTHB:null,status:"OLD ORGA QUOTE INCLUDED / MGW OPEN",owner:"MGW",gate:"Confirm supply in MGW current quote; no duplicate buy"},
  {id:"TOOL-RACON-02",mr:"MR0004",system:"ORGA/Tideland RACON",tests:"RCN-02",item:"OEM purge kit, gauge and approved nitrogen arrangement",method:"OEM_INCLUDED_TO_CONFIRM",unitRateTHB:null,rateUnit:"set",quantity:null,extendedCostTHB:null,status:"OLD ORGA QUOTE INCLUDED / MGW OPEN",owner:"MGW",gate:"Certification, pressure limits, transport and safety approval"},
  {id:"TOOL-RACON-03",mr:"MR0004",system:"ORGA/Tideland RACON",tests:"RCN-06/07/08/09",item:"OEM-compatible X/S-band pulsed RACON test set",method:"RENT_OR_OEM",unitRateTHB:null,rateUnit:"campaign",quantity:null,extendedCostTHB:null,status:"TEST METHOD / QUOTATION OPEN",owner:"MGW/ADDVALUE",gate:"IALA R.101 & OEM method; RF Explorer does not cover X-band or pulse-response test"},
  {id:"TOOL-RACON-04",mr:"MR0004",system:"ORGA/Tideland RACON",tests:"RCN-10/11",item:"Marine radar X/S-band + approved vessel/witness slots",method:"MARINE_INTERFACE",unitRateTHB:null,rateUnit:"campaign",quantity:null,extendedCostTHB:null,status:"COST OWNER OPEN",owner:"Marine/PTTEPI/ADDVALUE",gate:"No operational pass without witnessed vessel/radar range evidence where specified"},
  {id:"TOOL-RACON-05",mr:"MR0004",system:"ORGA/Tideland RACON",tests:"RCN-03/04/12/13",item:"Calibrated DMM + PCS alarm test/interface",method:"EXISTING_AND_INSTRUMENT",unitRateTHB:null,rateUnit:"campaign",quantity:null,extendedCostTHB:null,status:"INTERFACE OPEN",owner:"ADDVALUE/Instrument",gate:"Approval for alarm simulation and power cycle"}
 ],
 holds:[
 {id:"RACON-CODE",status:"OPEN",detail:"Rev.H code D versus ORGA quotation code Q; verify approved MR0004/COMPANY before test."},
 {id:"RACON-DUTY",status:"OPEN",detail:"20s active/40s quiescent from draft procedure; confirm approved OEM settings."},
 {id:"RACON-RANGE",status:"OPEN",detail:"20 NM, azimuth and pulsed X/S-band response method need approved limits/witness."},
 {id:"MGW-TOOLS",status:"OPEN",detail:"Reconcile OEM included kits vs B11 customer deliverables and B3 rented service tools."}
 ]
});
export function selectSatToolReadiness0553(){
 const rows=SAT_TOOL_REGISTER_0553.rows;
 return {revision:SAT_TOOL_REGISTER_0553.revision,rows,
  knownRentalRateTHBPerDay:1000,
  knownExtendedToolCostTHB:null,
  openRows:rows.filter(r=>!Number.isFinite(r.extendedCostTHB)),
  holds:SAT_TOOL_REGISTER_0553.holds,
  state:"ENGINEERING_TOOL_PLANNING_ONLY_NOT_SAT_APPROVAL",
  postingAllowed:false
 };
}
