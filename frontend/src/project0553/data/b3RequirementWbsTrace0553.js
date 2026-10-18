// PJ2608-0553 | Contract requirement → physical function → Rev.K executable work → single cost owner.
// This is a traceability / completeness view ONLY: no schedule or price postings.
// Actual vendor/contractor roles remain subject to MR/SPE contractual RACI.
// Source authority: current BOD C2, SPE C2, MR C1, DTS C1. Rev.K defines work activities not acceptance criteria.
export const B3_REQ_TRACE_SOURCES_0553=Object.freeze({
  "BOD": "https://drive.google.com/file/d/1YPVUfUIy8X5lVOHbTcQ3i6J2zc4bLTFQ/view",
  "SPE": "https://drive.google.com/file/d/1pa5Tlqpu65Lv1HDkNSz3XvcDCkpjVGRn/view",
  "MR1": "https://drive.google.com/file/d/1UiabYMc178_X5_AkQsBe6kA0hUJAG5f8/view",
  "MR2": "https://drive.google.com/file/d/1Vk8Jv8x9jDb7tMUNh1f7F4EtK6y5u6cm/view",
  "MR3": "https://drive.google.com/file/d/1RYFm75mMuLr5brbXjLNu8UWIDUptRP-Q/view",
  "MR4": "https://drive.google.com/file/d/17oOEMjDVQy3PgOQYbPYyXyaxk3P_rrNC/view",
  "DTS1": "https://drive.google.com/file/d/1hOjBgaJ07PXF6rkep2dzkMXv-pnkQzix/view",
  "DTS2": "https://drive.google.com/file/d/1xfUFbik-uEB6cfX04a-opkfeBkZD7I6a/view",
  "DTS3": "https://drive.google.com/file/d/1vHFKKvDtkNyXSzGOvKnVAr4azDjnl3WP/view",
  "DTS4": "https://drive.google.com/file/d/1NhRRBC5iaYsAblJdcaZgzw5P1u63f5V8/view"
});
const B3_REQUIREMENT_WBS_SOURCE_0553=Object.freeze([
  {
    "id": "RQM-01",
    "moduleId": "bid.budget.working.bc.b3.requirement-trace.rqm-01",
    "system": "ALL",
    "costOwner": "B3",
    "wbs": "K01",
    "activity": "MGW OEM FAT China",
    "requirementRef": "BOD §10.2–10.3; SPE §7.3.1",
    "requiredResult": "Vendor conducts FAT, approved procedure, HW/SW, 100% correct performance; calibrated instruments, signed record",
    "responsibility": "MGW executes; ADDVALUE 2 witness personnel per Rev.K; one unbilled standby",
    "location": "MGW factory China, actual address OPEN",
    "deliverable": "FAT signed procedure + hardware/software printouts + as-left configurations",
    "costRule": "MGW OEM factory execution/tools Part A; ADDVALUE FAT witness labour/travel in B3 Inspection Testing per Scope of Supply",
    "gate": "MGW procedure/ITP, actual witness days and owner confirmation",
    "requirementClass": "MUST",
    "status": "FAT_VENDOR_OWNED",
    "sourceKeys": [
      "BOD",
      "SPE"
    ],
    "workingCostTHB": null,
    "workingSellTHB": null,
    "postingAllowed": false
  },
  {
    "id": "RQM-02",
    "moduleId": "bid.budget.working.bc.b3.requirement-trace.rqm-02",
    "system": "ALL",
    "costOwner": "B3",
    "wbs": "K01",
    "activity": "FAT advance notice",
    "requirementRef": "BOD §10.2; SPE §7.3",
    "requiredResult": "BOD requests at least 30 calendar days; SPE requests at least 14 calendar days before vendor/shop witness",
    "responsibility": "MGW submits notice; CONTRACTOR/COMPANY confirms governing lead time",
    "location": "MGW vendor shop China",
    "deliverable": "Dated notice + witness confirmation",
    "costRule": "FAT notice/witness planning included in B3 FAT expense event; no separate B9 charge",
    "gate": "Contract precedence/notice resolution (30 vs 14 days)",
    "requirementClass": "MUST",
    "status": "NOTICE_CONFLICT_OPEN",
    "sourceKeys": [
      "BOD",
      "SPE"
    ],
    "workingCostTHB": null,
    "workingSellTHB": null,
    "postingAllowed": false
  },
  {
    "id": "RQM-03",
    "moduleId": "bid.budget.working.bc.b3.requirement-trace.rqm-03",
    "system": "ALL",
    "costOwner": "B9",
    "wbs": "K02-K12",
    "activity": "Fabrication Yard SAT",
    "requirementRef": "SPE §7.3.2; MR0001–0004 §7.4",
    "requiredResult": "Contractor/Vendor SAT at Fabrication site to COMPANY-approved manufacturer procedures; signed procedure and printouts",
    "responsibility": "JUTAL contractor + MGW/vendor per agreed RACI; ADDVALUE execution vs witness unresolved",
    "location": "JUTAL Zhuhai Yard (Rev.K)",
    "deliverable": "Yard SAT procedure, signed sheets, tests, ITR and punches",
    "costRule": "B9 only for assigned ADDVALUE yard attendance/testing; JUTAL installation not booked",
    "gate": "Signed RACI, approved yard ITP, exact site/man-days",
    "requirementClass": "MUST",
    "status": "YARD_ROLE_OPEN",
    "sourceKeys": [
      "SPE",
      "MR1",
      "MR2",
      "MR3",
      "MR4"
    ],
    "workingCostTHB": null,
    "workingSellTHB": null,
    "postingAllowed": false
  },
  {
    "id": "RQM-04",
    "moduleId": "bid.budget.working.bc.b3.requirement-trace.rqm-04",
    "system": "MR0003",
    "costOwner": "B9",
    "wbs": "K10",
    "activity": "Yard telephone functional test",
    "requirementRef": "BOD §10.2; SPE §7.3; DTS-0003 C1",
    "requiredResult": "All phones physically verified and basic functional tested by CONTRACTOR at yard before shipping; relay/sounder interface per DTS",
    "responsibility": "JUTAL contractor (specified); ADDVALUE witness/support only if contracted",
    "location": "JUTAL Zhuhai Yard: ZWP20/21/22/23 packages",
    "deliverable": "Each phone functional record, sounder relay verification and signed handover",
    "costRule": "B9 only incremental ADDVALUE support, not fabrication labor",
    "gate": "Specify ITP, relay/DCDB interface, sound acceptance test",
    "requirementClass": "MUST",
    "status": "VENDOR_SUPPORT_SCOPE_OPEN",
    "sourceKeys": [
      "BOD",
      "SPE",
      "DTS3"
    ],
    "workingCostTHB": null,
    "workingSellTHB": null,
    "postingAllowed": false
  },
  {
    "id": "RQM-05",
    "moduleId": "bid.budget.working.bc.b3.requirement-trace.rqm-05",
    "system": "ALL",
    "costOwner": "B9",
    "wbs": "K12-K15",
    "activity": "Removal/transfer/reinstallation after Yard SAT",
    "requirementRef": "SPE §7.3.2",
    "requiredResult": "After telecom SAT, specified SCADA IDUs/ODUs, TETRA voice gateways and phones removed as loose items to ZPQ for final integration, then reinstalled after platform installation",
    "responsibility": "CONTRACTOR/JUTAL logistics and mechanical execution, MGW technical support; ADDVALUE role not established",
    "location": "Zhuhai Yard → ZPQ, then platforms (routing to verify)",
    "deliverable": "Serial-number chain-of-custody, preservation, shipment, reintegration/retention records",
    "costRule": "Not automatically B9; cargo B6, reinstall by contract installer; B9 only unique approved specialist service",
    "gate": "SPE references TETRA while Rev.K uses DMR BDA: technical clarification needed; reinstallation owner",
    "requirementClass": "MUST",
    "status": "APPLICABILITY_RACI_CONFLICT",
    "sourceKeys": [
      "SPE"
    ],
    "workingCostTHB": null,
    "workingSellTHB": null,
    "postingAllowed": false
  },
  {
    "id": "RQM-06",
    "moduleId": "bid.budget.working.bc.b3.requirement-trace.rqm-06",
    "system": "ALL",
    "costOwner": "B9",
    "wbs": "K03-K12",
    "activity": "Vendor onshore support",
    "requirementRef": "SPE §7.3.4",
    "requiredResult": "Vendor identify support requirements for installation/commissioning and quote experienced staff at onshore man-day rate; installation excluded from vendor scope",
    "responsibility": "JUTAL executes physical installation; ADDVALUE/MGW support subject to RACI",
    "location": "Zhuhai Yard",
    "deliverable": "Man-day attendance sheet, ITR witness/assist reports",
    "costRule": "B9 for unique ADDVALUE onshore specialist days, never JUTAL installation hours",
    "gate": "Approval for execution vs supervision vs witness; time and personnel",
    "requirementClass": "CONDITIONAL",
    "status": "SIGNED_RACI_PENDING",
    "sourceKeys": [
      "SPE"
    ],
    "workingCostTHB": null,
    "workingSellTHB": null,
    "postingAllowed": false
  },
  {
    "id": "RQM-07",
    "moduleId": "bid.budget.working.bc.b3.requirement-trace.rqm-07",
    "system": "MR0001",
    "costOwner": "B9",
    "wbs": "K08",
    "activity": "Yard SCADA configuration/verification",
    "requirementRef": "SPE §7.3.1–7.3.2; DTS-0001 C1",
    "requiredResult": "FAT with actual planned IP/VLAN/frequency/bandwidth; yard readiness tests of radio/network interfaces; licensed software",
    "responsibility": "MGW OEM prepares/configures; ADDVALUE yard specialist if contracted",
    "location": "Zhuhai Yard; ZWP20/21/22/23 package and brownfield interfaces",
    "deliverable": "Config image, NMS/port/IP/VLAN record, yard signed functional sheet",
    "costRule": "A/OEM configuration inclusions first; B9 distinct onshore attendance only",
    "gate": "Approved values/test methods and MGW scope credits",
    "requirementClass": "MUST",
    "status": "MGW_INTERFACE_SCOPE_OPEN",
    "sourceKeys": [
      "SPE",
      "DTS1"
    ],
    "workingCostTHB": null,
    "workingSellTHB": null,
    "postingAllowed": false
  },
  {
    "id": "RQM-08",
    "moduleId": "bid.budget.working.bc.b3.requirement-trace.rqm-08",
    "system": "MR0002",
    "costOwner": "B9",
    "wbs": "K09",
    "activity": "Yard DMR initial check",
    "requirementRef": "SPE §7.3; DTS-0002 C1",
    "requiredResult": "RFI BDA/antenna inspection, safe passband/config and Ex readiness; applicable ETSI EN 300 394-1 methodology",
    "responsibility": "MGW/RFI OEM + JUTAL installer; ADDVALUE witness only if contracted",
    "location": "Zhuhai Yard ZWP20/21/22 (ZWP23 no new BDA)",
    "deliverable": "BDA baseline settings and safe test report",
    "costRule": "B9 unique yard role; no extra vendor OEM internal factory charges",
    "gate": "Isolation/safe RF method, 380–520 MHz module vs antenna band; ITP approval",
    "requirementClass": "MUST",
    "status": "RF_METHOD_AND_OWNER_OPEN",
    "sourceKeys": [
      "SPE",
      "DTS2"
    ],
    "workingCostTHB": null,
    "workingSellTHB": null,
    "postingAllowed": false
  },
  {
    "id": "RQM-09",
    "moduleId": "bid.budget.working.bc.b3.requirement-trace.rqm-09",
    "system": "MR0004",
    "costOwner": "B9",
    "wbs": "K11",
    "activity": "Yard RACON safe config test",
    "requirementRef": "SPE §7.3, DTS-0004 C1",
    "requiredResult": "Verify code D, 20sec ON/40sec OFF, power and Ex state; factory/yard bench tests do not replace offshore marine range acceptance",
    "responsibility": "MGW/ORGA, ADDVALUE technician only if appointed",
    "location": "Zhuhai Yard ZWP20/21/22",
    "deliverable": "Yard self-test/config/preservation and certified tools",
    "costRule": "B9 unique assigned yard support only",
    "gate": "DTS-0004 D code vs historical ORGA quotation Q; COMPANY-approved manufacturer procedure",
    "requirementClass": "MUST",
    "status": "CODE_VARIANT_AND_METHOD_OPEN",
    "sourceKeys": [
      "SPE",
      "DTS4"
    ],
    "workingCostTHB": null,
    "workingSellTHB": null,
    "postingAllowed": false
  },
  {
    "id": "RQM-10",
    "moduleId": "bid.budget.working.bc.b3.requirement-trace.rqm-10",
    "system": "ALL",
    "costOwner": "B3",
    "wbs": "K14-K15",
    "activity": "SAT access/readiness",
    "requirementRef": "BOD §10.4–10.5; SPE §7.3.3; Rev.K K14–K15",
    "requiredResult": "Offshore equipment installed/commissioned and MC/RFSAT evidence accepted before performance testing",
    "responsibility": "JUTAL installation/MC; ADDVALUE readiness witness/SAT specialist; PTTEPI ICT/Ops counterpart",
    "location": "ZPQ/ZWP8/ZWP11/ZWP20–23",
    "deliverable": "Approved ITP, MC/RFSAT, HSE/PTW, site as-built readiness",
    "costRule": "B3 ADDVALUE offshore readiness and test crew only",
    "gate": "Signed MC, access/PTW, remote endpoint and test window",
    "requirementClass": "MUST",
    "status": "SITE_READINESS_OPEN",
    "sourceKeys": [
      "BOD",
      "SPE"
    ],
    "workingCostTHB": null,
    "workingSellTHB": null,
    "postingAllowed": false
  },
  {
    "id": "RQM-11",
    "moduleId": "bid.budget.working.bc.b3.requirement-trace.rqm-11",
    "system": "MR0001",
    "costOwner": "B3",
    "wbs": "K15-K17",
    "activity": "SCADA offshore performance",
    "requirementRef": "MR-0001 §7.5; DTS-0001 C1; BOD §10.5",
    "requiredResult": "Measured radio transmit/receive, actual link/bandwidth/speed, IP/NMS integration and applicable DTS 5.5–5.8GHz, VSWR requirements",
    "responsibility": "ADDVALUE offshore test specialists with PTTEPI ICT/PLC peer",
    "location": "ZPQ/ZWP8/ZWP11 + ZWP20–23",
    "deliverable": "Per-link measurement, throughput printouts, NMS alarms, signed reports",
    "costRule": "B3 direct execution; no B9 factory/yard repeat",
    "gate": "Approved test acceptance thresholds; exact endpoints and tool certificates",
    "requirementClass": "MUST",
    "status": "REMOTE_END_AND_THRESHOLD_OPEN",
    "sourceKeys": [
      "MR1",
      "DTS1",
      "BOD"
    ],
    "workingCostTHB": null,
    "workingSellTHB": null,
    "postingAllowed": false
  },
  {
    "id": "RQM-12",
    "moduleId": "bid.budget.working.bc.b3.requirement-trace.rqm-12",
    "system": "MR0002",
    "costOwner": "B3",
    "wbs": "K15-K17",
    "activity": "DMR offshore performance",
    "requirementRef": "MR-0002 §7.5; SPE §7.3; DTS-0002 C1",
    "requiredResult": "Actual Tx/Rx radio measurement and communication for every talk-group; ETSI EN 300 394-1 method; onsite RF isolation and coverage",
    "responsibility": "ADDVALUE offshore RF specialist + PTTEPI radio/ICT",
    "location": "ZWP20/21/22 BDA; ZWP23 portable coverage only; host ZPQ",
    "deliverable": "Per-talkgroup call log, donor/service measurements, alarm report",
    "costRule": "B3 direct SAT/SIT, no new repeater procurement",
    "gate": "Approved frequency/talkgroup plan, RF test instruments, isolation criteria",
    "requirementClass": "MUST",
    "status": "RADIO_METHOD_OPEN",
    "sourceKeys": [
      "MR2",
      "SPE",
      "DTS2"
    ],
    "workingCostTHB": null,
    "workingSellTHB": null,
    "postingAllowed": false
  },
  {
    "id": "RQM-13",
    "moduleId": "bid.budget.working.bc.b3.requirement-trace.rqm-13",
    "system": "MR0003",
    "costOwner": "B3",
    "wbs": "K16-K17",
    "activity": "Ex telephone/sounder final E2E",
    "requirementRef": "DTS-0003 C1; MR-0003 §7.5; BOD §10.5",
    "requiredResult": "Test installed phone/PABX/SIP, ring/sounder contact and 24VDC actuation, Ex integrity, live calls",
    "responsibility": "ADDVALUE telecom engineer and site electrical/ICT partner",
    "location": "ZWP20/21/22/23 + host PABX interface",
    "deliverable": "Phone call matrix, sounder measured levels, relay check and signed SAT",
    "costRule": "B3 actual offshore acceptance; earlier yard phone test stays in B9/JUTAL",
    "gate": "Confirm acoustic criteria and DTS sounder units, Ex safe work permit",
    "requirementClass": "MUST",
    "status": "ACOUSTIC_THRESHOLD_OPEN",
    "sourceKeys": [
      "DTS3",
      "MR3",
      "BOD"
    ],
    "workingCostTHB": null,
    "workingSellTHB": null,
    "postingAllowed": false
  },
  {
    "id": "RQM-14",
    "moduleId": "bid.budget.working.bc.b3.requirement-trace.rqm-14",
    "system": "MR0004",
    "costOwner": "B3",
    "wbs": "K16-K17",
    "activity": "Marine RACON actual field acceptance",
    "requirementRef": "DTS-0004 C1; MR-0004 §7.5; SPE §7.3 / IALA R.101",
    "requiredResult": "Use marine radar to verify X/S-band response, D Morse signature and approved coverage/range; DTS 20NM characteristic and 20s/40s schedule subject to accepted method",
    "responsibility": "ADDVALUE offshore specialist + marine radar vessel/witness/ORGA OEM as required",
    "location": "ZWP20/21/22 offshore (not ZWP23)",
    "deliverable": "Marine radar screen/log, duty-code capture and signed witness report",
    "costRule": "B3 field test/operator/rental if ADDVALUE pays; vessel cost bearer TBC",
    "gate": "Vessel owner, marine method/azimuths, OEM confirmed model and Ex variant",
    "requirementClass": "MUST",
    "status": "MARINE_VESSEL_AND_METHOD_OPEN",
    "sourceKeys": [
      "DTS4",
      "MR4",
      "SPE"
    ],
    "workingCostTHB": null,
    "workingSellTHB": null,
    "postingAllowed": false
  },
  {
    "id": "RQM-15",
    "moduleId": "bid.budget.working.bc.b3.requirement-trace.rqm-15",
    "system": "ALL",
    "costOwner": "B3",
    "wbs": "K17-K18",
    "activity": "Integrated SIT and offshore final acceptance",
    "requirementRef": "BOD §10.5; SPE §7.3.3; Rev.K K17–K18",
    "requiredResult": "Performance after final installation/commissioning; end-to-end NMS/PLC/voice/alarms and punch closure",
    "responsibility": "ADDVALUE SAT specialists + COMPANY/ICT/Ops/Instrument counterpart",
    "location": "ZPQ + remote new WHPs",
    "deliverable": "SIT signed acceptance, printouts, as-left configs, punch register",
    "costRule": "B3 SAT/SIT direct staff only, separate B2 final dossier control",
    "gate": "72h SIT in Rev.I proposed, not a universal BOD acceptance duration",
    "requirementClass": "MUST",
    "status": "ITP_AND_SITE_SCHEDULE_OPEN",
    "sourceKeys": [
      "BOD",
      "SPE"
    ],
    "workingCostTHB": null,
    "workingSellTHB": null,
    "postingAllowed": false
  },
  {
    "id": "RQM-16",
    "moduleId": "bid.budget.working.bc.b3.requirement-trace.rqm-16",
    "system": "ALL",
    "costOwner": "B3",
    "wbs": "K16-K18",
    "activity": "SAT/commissioning test tools",
    "requirementRef": "BOD §10.4–10.5; SPE §7.3.2–7.3.3",
    "requiredResult": "Carry tools/analyzers needed for site acceptance especially radio signal measurements; calibrations and test method evidence",
    "responsibility": "ADDVALUE offshore test engineers; OEM tool loans/third-party rental as available",
    "location": "ZWP20–23, ZPQ/ZWP8/ZWP11 as applicable",
    "deliverable": "Calibration certificate, test-equipment ID, measurement records",
    "costRule": "B3 rental instruments; B11 is permanent delivered O&M tools only",
    "gate": "Instrument rental days and calibration compliance pending",
    "requirementClass": "MUST",
    "status": "INSTRUMENT_QUANTITY_OPEN",
    "sourceKeys": [
      "BOD",
      "SPE"
    ],
    "workingCostTHB": null,
    "workingSellTHB": null,
    "postingAllowed": false
  },
  {
    "id": "RQM-17",
    "moduleId": "bid.budget.working.bc.b3.requirement-trace.rqm-17",
    "system": "ALL",
    "costOwner": "B2",
    "wbs": "K18",
    "activity": "SAT report & VDRL lifecycle",
    "requirementRef": "BOD §10.4–10.5; SPE §10–11",
    "requiredResult": "Signed technical records generated by test executor, then transmittal/Revision Control and Final Dossier by Document Control",
    "responsibility": "ADDVALUE/Company test signatories then Document Controller",
    "location": "Offshore field evidence → office dossier",
    "deliverable": "Signed original SAT/Comm RPT (B3 activity), VDRL transmittal/final dossier (B2 activity)",
    "costRule": "B3 owns test records; B2 owns document control only; no double labor hours",
    "gate": "Work-object split and VDRL references",
    "requirementClass": "MUST",
    "status": "B2_B3_EVIDENCE_SPLIT",
    "sourceKeys": [
      "BOD",
      "SPE"
    ],
    "workingCostTHB": null,
    "workingSellTHB": null,
    "postingAllowed": false
  },
  {
    "id": "RQM-18",
    "moduleId": "bid.budget.working.bc.b3.requirement-trace.rqm-18",
    "system": "ALL",
    "costOwner": "B8",
    "wbs": "K00-K01",
    "activity": "Vendor technical training",
    "requirementRef": "SPE §7.4 and §9",
    "requiredResult": "Training of ICT/O&M team; 2 batches, Yangon venue; before FAT sequencing of radio technical training must be reconciled",
    "responsibility": "MGW/OEM trainer or ADDVALUE trainer if contracted",
    "location": "Yangon, Myanmar, schedule relative to China FAT",
    "deliverable": "Course agenda, attendance certificates, program",
    "costRule": "B8 training; not B3/B9 service hours",
    "gate": "Cross-border sequence and OEM-inclusive training price",
    "requirementClass": "MUST",
    "status": "TRAINING_SEQUENCE_OPEN",
    "sourceKeys": [
      "SPE"
    ],
    "workingCostTHB": null,
    "workingSellTHB": null,
    "postingAllowed": false
  },
  {
    "id": "RQM-19",
    "moduleId": "bid.budget.working.bc.b3.requirement-trace.rqm-19",
    "system": "ALL",
    "costOwner": "B1",
    "wbs": "K00-K18",
    "activity": "Project management / approvals",
    "requirementRef": "Rev.K K00–K18",
    "requiredResult": "PM progress, decisions and interface approvals distinct from engineering test execution",
    "responsibility": "ADDVALUE management office",
    "location": "Office / remote meeting",
    "deliverable": "Meeting minutes and signed progress/decision log",
    "costRule": "B1 indirect ONLY; no B3/B9 engineering time",
    "gate": "Unique event ID and actual PM hours",
    "requirementClass": "CONDITIONAL",
    "status": "NON_ADDITIVE_PM_OVERLAY",
    "sourceKeys": [
      "BOD",
      "SPE"
    ],
    "workingCostTHB": null,
    "workingSellTHB": null,
    "postingAllowed": false
  }
]);
// Contract must-have ≠ automatic ADDVALUE staffing. B9 onshore help is call-out only
// except management-selected China FAT witness, subject to signed subcontract RACI.
export const B3_REQUIREMENT_WBS_TRACE_0553=Object.freeze(B3_REQUIREMENT_WBS_SOURCE_0553.map(r=>Object.freeze({
 ...r,
 contractualRequirementState:r.requirementClass==="MUST"?"DELIVERABLE_MANDATORY_BY_CONTRACT":"WHEN_REQUESTED",
 addvalueAttendanceState:["RQM-01","RQM-02"].includes(r.id)?"B3_MGW_FAT_WITNESS_AND_NOTICE":r.costOwner!=="B9"?"CHECK_EXECUTION_RACI":
  (r.id==="RQM-01"?"REVK_2_FAT_WITNESSES_PLANNED":r.id==="RQM-02"?"FAT_NOTICE_INCLUDED_NO_EXTRA_CHARGE":"NO_UNCONDITIONAL_YARD_ATTENDANCE__CALL_OUT_OR_SIGNED_RACI_ONLY"),
 b9CommercialTreatment:r.costOwner!=="B9"?null:
  (r.id==="RQM-01"?"FAT_BASE__WITNESS":r.id==="RQM-02"?"FAT_BASE__NOTICE_INCLUDED_NO_EXTRA":"YARD_SUPPORT_CONDITIONAL__NO_BASE_CHARGE"),
 costPostingAuthority:"NO_CHARGE_WITHOUT_UNIQUE_EXPENSE_ID_AND_APPROVED_SCOPE"
})));
export function selectB3RequirementWbsTrace0553(){
 const rows=B3_REQUIREMENT_WBS_TRACE_0553;
 if(rows.length!==19||new Set(rows.map(r=>r.id)).size!==rows.length)throw Error("B3 requirement trace identity/coverage gap");
 const valid=new Set(["A","B1","B2","B3","B8","B9","B6","JUTAL"]);
 for(const row of rows){
  if(!valid.has(row.costOwner)||!row.requirementRef||!row.requiredResult||!row.wbs||!row.responsibility||!row.location||!row.deliverable||!row.costRule||row.postingAllowed||row.workingSellTHB!==null)
   throw Error("Requirement-to-WBS cost-owner or evidence gap at "+row.id);
  if(row.sourceKeys.some(k=>!B3_REQ_TRACE_SOURCES_0553[k]))throw Error("Missing source URL "+row.id);
 }
 if(!rows.some(r=>r.id==="RQM-03"&&r.costOwner==="B9")||!rows.some(r=>r.id==="RQM-15"&&r.costOwner==="B3"))
  throw Error("Fabrication Yard SAT and Offshore SIT must be separate WBS/Cost Owners");
 if(rows.some(x=>x.costOwner==="B9"&&!["RQM-01","RQM-02"].includes(x.id)&&x.b9CommercialTreatment!=="YARD_SUPPORT_CONDITIONAL__NO_BASE_CHARGE"))throw Error("B9 yard assistance incorrectly made mandatory price");
 return Object.freeze({moduleId:"bid.budget.working.bc.b3.requirement-trace",rows,
  B3:rows.filter(x=>x.costOwner==="B3"),B9:rows.filter(x=>x.costOwner==="B9"),
  external:rows.filter(x=>x.costOwner!=="B3"&&x.costOwner!=="B9"),
  currentVersion:"BOD-C2_SPE-C2_MR-C1_DTS-C1_REV-K-20261018",
  postingAllowed:false,
  scheduleApproved:false,acceptanceCriteriaApproved:false,
  sourceURLs:B3_REQ_TRACE_SOURCES_0553});
}
