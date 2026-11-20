import {ONSHORE_WORKING_SELL_RATE_0553} from "./onshoreWorkingRate0553";
// B1 PM USD600/day remains the 18-Oct NONPOSTING milestone audit proxy.
// The 22-Oct onshore Senior700/Field600 role revision is B3/B9-scoped;
// it must not silently rewrite B1 historical cost-source provenance.
const B1_PM_LEGACY_PROXY_RATE_SOURCE_0553="USER_MANAGEMENT_DECISION_2026_10_18";
// PJ2608-0553: Rev.K K00–K18 source coverage for B1 residual support. Legacy USD600 PM proxy stays audit-only; live multi-role THB planning lives in b1ProjectSupportBudget0553.js.
// THIS IS A CHILD ALLOCATION of PM-MILESTONE, not 19 extra expense postings.
// Each stage's physical labour/tools/travel stays with the listed A/B2–B14/C or JUTAL owner.
const B1_REVK_SOURCE_COVERAGE_0553=Object.freeze([
  {
    "id": "PM-K00",
    "stage": "K00",
    "parentExpenseId": "PM-MILESTONE",
    "expenseEventKey": "MGMT-PROJECT/K00",
    "phase": "Office engineering / preparation",
    "who": "ADDVALUE PM / Office (proposed)",
    "where": "ADDVALUE office; venue TBC",
    "what": "Project Management / Milestone coordination",
    "how": "Track engineering readiness, technical clarifications and sign-off, not produce OEM drawings",
    "directOwner": "A/OEM, B2 document control",
    "deliverable": "AFC/ITP/TAG/MTO gate; MOM",
    "source": "Rev.K K00 / linked MR0001–0004/BOD/DTS/SPE as applicable",
    "costOwner": "B1",
    "payer": "ADDVALUE project management; confirm contractual payer",
    "executionState": "PROPOSED_OFFICE_PM_OVERLAY_NOT_EXECUTION",
    "workingPmDays": null,
    "rateSource": "Management approved Onshore labor USD 600/person-day (2026-10-18); milestone PM hours remain provisional"
  },
  {
    "id": "PM-K01",
    "stage": "K01",
    "parentExpenseId": "PM-MILESTONE",
    "expenseEventKey": "MGMT-PROJECT/K01",
    "phase": "MGW IFAT/FAT",
    "who": "ADDVALUE project PM / Office (remote oversight)",
    "where": "ADDVALUE office; MGW Office China",
    "what": "Project Management / Milestone coordination",
    "how": "Confirm witness plan, FAT notice and closure; exclude paid FAT attendees/flights/hotel",
    "directOwner": "B3 MGW China FAT witness/travel; A OEM factory execution",
    "deliverable": "Witness invitation and FAT action register",
    "source": "Rev.K K01 / linked MR0001–0004/BOD/DTS/SPE as applicable",
    "costOwner": "B1",
    "payer": "ADDVALUE project management; confirm contractual payer",
    "executionState": "PROPOSED_OFFICE_PM_OVERLAY_NOT_EXECUTION",
    "workingPmDays": null,
    "rateSource": "Management approved Onshore labor USD 600/person-day (2026-10-18); milestone PM hours remain provisional"
  },
  {
    "id": "PM-K02",
    "stage": "K02",
    "parentExpenseId": "PM-MILESTONE",
    "expenseEventKey": "MGMT-PROJECT/K02",
    "phase": "DDP Zhuhai Yard handover",
    "who": "ADDVALUE PM / Procurement coordinator (office)",
    "where": "ADDVALUE office / remote Zhuhai coordination",
    "what": "Project Management / Milestone coordination",
    "how": "Track acceptance of DDP delivery and milestone obligations, not handling freight",
    "directOwner": "A goods, B6 logistics, B9 yard specialists",
    "deliverable": "Signed delivery evidence, shortage escalation",
    "source": "Rev.K K02 / linked MR0001–0004/BOD/DTS/SPE as applicable",
    "costOwner": "B1",
    "payer": "ADDVALUE project management; confirm contractual payer",
    "executionState": "PROPOSED_OFFICE_PM_OVERLAY_NOT_EXECUTION",
    "workingPmDays": null,
    "rateSource": "Management approved Onshore labor USD 600/person-day (2026-10-18); milestone PM hours remain provisional"
  },
  {
    "id": "PM-K03",
    "stage": "K03",
    "parentExpenseId": "PM-MILESTONE",
    "expenseEventKey": "MGMT-PROJECT/K03",
    "phase": "Supports & mounts",
    "who": "ADDVALUE PM / interface coordinator (remote)",
    "where": "ADDVALUE office / JUTAL interface",
    "what": "Project Management / Milestone coordination",
    "how": "Escalate structural AFC and responsibility issues; no construction labor",
    "directOwner": "JUTAL Structural / A bulk",
    "deliverable": "RACI and interface action closeout",
    "source": "Rev.K K03 / linked MR0001–0004/BOD/DTS/SPE as applicable",
    "costOwner": "B1",
    "payer": "ADDVALUE project management; confirm contractual payer",
    "executionState": "PROPOSED_OFFICE_PM_OVERLAY_NOT_EXECUTION",
    "workingPmDays": null,
    "rateSource": "Management approved Onshore labor USD 600/person-day (2026-10-18); milestone PM hours remain provisional"
  },
  {
    "id": "PM-K04",
    "stage": "K04",
    "parentExpenseId": "PM-MILESTONE",
    "expenseEventKey": "MGMT-PROJECT/K04",
    "phase": "Bulk material receipt",
    "who": "ADDVALUE PM / purchasing coordinator (office)",
    "where": "ADDVALUE office / JUTAL interface",
    "what": "Project Management / Milestone coordination",
    "how": "Track procurement exceptions & scope changes, not price bulk or receive materials twice",
    "directOwner": "A, B6, B9",
    "deliverable": "MTO gap decision and purchasing action",
    "source": "Rev.K K04 / linked MR0001–0004/BOD/DTS/SPE as applicable",
    "costOwner": "B1",
    "payer": "ADDVALUE project management; confirm contractual payer",
    "executionState": "PROPOSED_OFFICE_PM_OVERLAY_NOT_EXECUTION",
    "workingPmDays": null,
    "rateSource": "Management approved Onshore labor USD 600/person-day (2026-10-18); milestone PM hours remain provisional"
  },
  {
    "id": "PM-K05",
    "stage": "K05",
    "parentExpenseId": "PM-MILESTONE",
    "expenseEventKey": "MGMT-PROJECT/K05",
    "phase": "Yard cable/mount installation",
    "who": "ADDVALUE PM / project coordinator (office)",
    "where": "ADDVALUE office / JUTAL remote",
    "what": "Project Management / Milestone coordination",
    "how": "Track construction readiness and schedule; exclude yard supervisor field days",
    "directOwner": "B9 / JUTAL E&I",
    "deliverable": "Progress tracker / change log",
    "source": "Rev.K K05 / linked MR0001–0004/BOD/DTS/SPE as applicable",
    "costOwner": "B1",
    "payer": "ADDVALUE project management; confirm contractual payer",
    "executionState": "PROPOSED_OFFICE_PM_OVERLAY_NOT_EXECUTION",
    "workingPmDays": null,
    "rateSource": "Management approved Onshore labor USD 600/person-day (2026-10-18); milestone PM hours remain provisional"
  },
  {
    "id": "PM-K06",
    "stage": "K06",
    "parentExpenseId": "PM-MILESTONE",
    "expenseEventKey": "MGMT-PROJECT/K06",
    "phase": "Yard Ex termination",
    "who": "ADDVALUE PM / interface coordinator (office)",
    "where": "ADDVALUE office / JUTAL remote",
    "what": "Project Management / Milestone coordination",
    "how": "Coordinate interface dispute and engineering concessions; exclude technician/test labor",
    "directOwner": "B9 / JUTAL E&I",
    "deliverable": "Signed RACI / interface punch",
    "source": "Rev.K K06 / linked MR0001–0004/BOD/DTS/SPE as applicable",
    "costOwner": "B1",
    "payer": "ADDVALUE project management; confirm contractual payer",
    "executionState": "PROPOSED_OFFICE_PM_OVERLAY_NOT_EXECUTION",
    "workingPmDays": null,
    "rateSource": "Management approved Onshore labor USD 600/person-day (2026-10-18); milestone PM hours remain provisional"
  },
  {
    "id": "PM-K07",
    "stage": "K07",
    "parentExpenseId": "PM-MILESTONE",
    "expenseEventKey": "MGMT-PROJECT/K07",
    "phase": "Yard pre-commissioning checks",
    "who": "ADDVALUE PM / office reviewer",
    "where": "ADDVALUE office / JUTAL remote",
    "what": "Project Management / Milestone coordination",
    "how": "Review readiness and evidence acceptance status; exclude instruments, test crew and tool rental",
    "directOwner": "B9 or JUTAL for yard test; B3 if contract-assigned testing",
    "deliverable": "ITR/test exception decision",
    "source": "Rev.K K07 / linked MR0001–0004/BOD/DTS/SPE as applicable",
    "costOwner": "B1",
    "payer": "ADDVALUE project management; confirm contractual payer",
    "executionState": "PROPOSED_OFFICE_PM_OVERLAY_NOT_EXECUTION",
    "workingPmDays": null,
    "rateSource": "Management approved Onshore labor USD 600/person-day (2026-10-18); milestone PM hours remain provisional"
  },
  {
    "id": "PM-K08",
    "stage": "K08",
    "parentExpenseId": "PM-MILESTONE",
    "expenseEventKey": "MGMT-PROJECT/K08",
    "phase": "Yard WiMAX tests",
    "who": "ADDVALUE PM / project coordinator (office)",
    "where": "ADDVALUE office / JUTAL remote",
    "what": "Project Management / Milestone coordination",
    "how": "Monitor cross-vendor interfaces and approval gates; no configuration work",
    "directOwner": "B9 yard specialist, A/OEM config",
    "deliverable": "Interface status review",
    "source": "Rev.K K08 / linked MR0001–0004/BOD/DTS/SPE as applicable",
    "costOwner": "B1",
    "payer": "ADDVALUE project management; confirm contractual payer",
    "executionState": "PROPOSED_OFFICE_PM_OVERLAY_NOT_EXECUTION",
    "workingPmDays": null,
    "rateSource": "Management approved Onshore labor USD 600/person-day (2026-10-18); milestone PM hours remain provisional"
  },
  {
    "id": "PM-K09",
    "stage": "K09",
    "parentExpenseId": "PM-MILESTONE",
    "expenseEventKey": "MGMT-PROJECT/K09",
    "phase": "Yard RFI tests",
    "who": "ADDVALUE PM / project coordinator (office)",
    "where": "ADDVALUE office / JUTAL remote",
    "what": "Project Management / Milestone coordination",
    "how": "Track OEM technical clearance and hazard-area restrictions; no gain/CLI test",
    "directOwner": "B9 yard specialist / A OEM",
    "deliverable": "BDA readiness action list",
    "source": "Rev.K K09 / linked MR0001–0004/BOD/DTS/SPE as applicable",
    "costOwner": "B1",
    "payer": "ADDVALUE project management; confirm contractual payer",
    "executionState": "PROPOSED_OFFICE_PM_OVERLAY_NOT_EXECUTION",
    "workingPmDays": null,
    "rateSource": "Management approved Onshore labor USD 600/person-day (2026-10-18); milestone PM hours remain provisional"
  },
  {
    "id": "PM-K10",
    "stage": "K10",
    "parentExpenseId": "PM-MILESTONE",
    "expenseEventKey": "MGMT-PROJECT/K10",
    "phase": "Yard Ex phone tests",
    "who": "ADDVALUE PM / project coordinator (office)",
    "where": "ADDVALUE office / JUTAL remote",
    "what": "Project Management / Milestone coordination",
    "how": "Coordinate PABX/client acceptance window; no physical bench test labor",
    "directOwner": "B9 yard specialist / A OEM",
    "deliverable": "Client witness confirmation",
    "source": "Rev.K K10 / linked MR0001–0004/BOD/DTS/SPE as applicable",
    "costOwner": "B1",
    "payer": "ADDVALUE project management; confirm contractual payer",
    "executionState": "PROPOSED_OFFICE_PM_OVERLAY_NOT_EXECUTION",
    "workingPmDays": null,
    "rateSource": "Management approved Onshore labor USD 600/person-day (2026-10-18); milestone PM hours remain provisional"
  },
  {
    "id": "PM-K11",
    "stage": "K11",
    "parentExpenseId": "PM-MILESTONE",
    "expenseEventKey": "MGMT-PROJECT/K11",
    "phase": "Yard RACON tests",
    "who": "ADDVALUE PM / project coordinator (office)",
    "where": "ADDVALUE office / JUTAL remote",
    "what": "Project Management / Milestone coordination",
    "how": "Escalate code/Ex/marine method approvals; no RACON programming/testing",
    "directOwner": "B9 yard specialist / A OEM",
    "deliverable": "RACON approval/action log",
    "source": "Rev.K K11 / linked MR0001–0004/BOD/DTS/SPE as applicable",
    "costOwner": "B1",
    "payer": "ADDVALUE project management; confirm contractual payer",
    "executionState": "PROPOSED_OFFICE_PM_OVERLAY_NOT_EXECUTION",
    "workingPmDays": null,
    "rateSource": "Management approved Onshore labor USD 600/person-day (2026-10-18); milestone PM hours remain provisional"
  },
  {
    "id": "PM-K12",
    "stage": "K12",
    "parentExpenseId": "PM-MILESTONE",
    "expenseEventKey": "MGMT-PROJECT/K12",
    "phase": "Yard preservation & MC handover",
    "who": "ADDVALUE PM / project coordinator (office)",
    "where": "ADDVALUE office / JUTAL remote",
    "what": "Project Management / Milestone coordination",
    "how": "Monitor closeout and loadout release; no physical packing/warehouse labour",
    "directOwner": "B5 packing, B9 witness, B2 filing",
    "deliverable": "MC punch closure minutes",
    "source": "Rev.K K12 / linked MR0001–0004/BOD/DTS/SPE as applicable",
    "costOwner": "B1",
    "payer": "ADDVALUE project management; confirm contractual payer",
    "executionState": "PROPOSED_OFFICE_PM_OVERLAY_NOT_EXECUTION",
    "workingPmDays": null,
    "rateSource": "Management approved Onshore labor USD 600/person-day (2026-10-18); milestone PM hours remain provisional"
  },
  {
    "id": "PM-K13",
    "stage": "K13",
    "parentExpenseId": "PM-MILESTONE",
    "expenseEventKey": "MGMT-PROJECT/K13",
    "phase": "Marine loadout/transport",
    "who": "ADDVALUE PM / contract coordinator (office)",
    "where": "ADDVALUE office; not onboard by default",
    "what": "Project Management / Milestone coordination",
    "how": "Track milestone and cargo risk remotely; no shipboard management or vessel transport cost",
    "directOwner": "B6 freight, JUTAL marine",
    "deliverable": "Milestone acknowledgment, risk log",
    "source": "Rev.K K13 / linked MR0001–0004/BOD/DTS/SPE as applicable",
    "costOwner": "B1",
    "payer": "ADDVALUE project management; confirm contractual payer",
    "executionState": "PROPOSED_OFFICE_PM_OVERLAY_NOT_EXECUTION",
    "workingPmDays": null,
    "rateSource": "Management approved Onshore labor USD 600/person-day (2026-10-18); milestone PM hours remain provisional"
  },
  {
    "id": "PM-K14",
    "stage": "K14",
    "parentExpenseId": "PM-MILESTONE",
    "expenseEventKey": "MGMT-PROJECT/K14",
    "phase": "Offshore HUC / RFSAT readiness",
    "who": "ADDVALUE PM / client coordination (office)",
    "where": "ADDVALUE office / remote client interface",
    "what": "Project Management / Milestone coordination",
    "how": "Confirm readiness/POB approvals and vendor gates; no offshore labour/travel",
    "directOwner": "B3 SAT specialists, JUTAL E&I",
    "deliverable": "Readiness / go-no-go minutes",
    "source": "Rev.K K14 / linked MR0001–0004/BOD/DTS/SPE as applicable",
    "costOwner": "B1",
    "payer": "ADDVALUE project management; confirm contractual payer",
    "executionState": "PROPOSED_OFFICE_PM_OVERLAY_NOT_EXECUTION",
    "workingPmDays": null,
    "rateSource": "Management approved Onshore labor USD 600/person-day (2026-10-18); milestone PM hours remain provisional"
  },
  {
    "id": "PM-K15",
    "stage": "K15",
    "parentExpenseId": "PM-MILESTONE",
    "expenseEventKey": "MGMT-PROJECT/K15",
    "phase": "Brownfield interface enabling",
    "who": "ADDVALUE PM / client coordination (office)",
    "where": "ADDVALUE office / PTTEPI interface",
    "what": "Project Management / Milestone coordination",
    "how": "Coordinate host access, outages and support windows; no survey or SAT engineer hours",
    "directOwner": "B3 site survey/host-enabling labour",
    "deliverable": "Access approvals / interface actions",
    "source": "Rev.K K15 / linked MR0001–0004/BOD/DTS/SPE as applicable",
    "costOwner": "B1",
    "payer": "ADDVALUE project management; confirm contractual payer",
    "executionState": "PROPOSED_OFFICE_PM_OVERLAY_NOT_EXECUTION",
    "workingPmDays": null,
    "rateSource": "Management approved Onshore labor USD 600/person-day (2026-10-18); milestone PM hours remain provisional"
  },
  {
    "id": "PM-K16",
    "stage": "K16",
    "parentExpenseId": "PM-MILESTONE",
    "expenseEventKey": "MGMT-PROJECT/K16",
    "phase": "Greenfield SAT",
    "who": "ADDVALUE PM / client coordinator (office)",
    "where": "ADDVALUE office / PTTEPI remote",
    "what": "Project Management / Milestone coordination",
    "how": "Track SAT progress, client decisions, vessel witness windows; no test labour/travel",
    "directOwner": "B3 offshore SAT and RACON testing",
    "deliverable": "Daily project status and issue escalation",
    "source": "Rev.K K16 / linked MR0001–0004/BOD/DTS/SPE as applicable",
    "costOwner": "B1",
    "payer": "ADDVALUE project management; confirm contractual payer",
    "executionState": "PROPOSED_OFFICE_PM_OVERLAY_NOT_EXECUTION",
    "workingPmDays": null,
    "rateSource": "Management approved Onshore labor USD 600/person-day (2026-10-18); milestone PM hours remain provisional"
  },
  {
    "id": "PM-K17",
    "stage": "K17",
    "parentExpenseId": "PM-MILESTONE",
    "expenseEventKey": "MGMT-PROJECT/K17",
    "phase": "Integrated SIT",
    "who": "ADDVALUE PM / client coordinator (office)",
    "where": "ADDVALUE office / PTTEPI remote",
    "what": "Project Management / Milestone coordination",
    "how": "Coordinate signatories, integration parties and delay resolutions; no 72h test team work",
    "directOwner": "B3 SIT, B2 transmittal",
    "deliverable": "SIT acceptance actions",
    "source": "Rev.K K17 / linked MR0001–0004/BOD/DTS/SPE as applicable",
    "costOwner": "B1",
    "payer": "ADDVALUE project management; confirm contractual payer",
    "executionState": "PROPOSED_OFFICE_PM_OVERLAY_NOT_EXECUTION",
    "workingPmDays": null,
    "rateSource": "Management approved Onshore labor USD 600/person-day (2026-10-18); milestone PM hours remain provisional"
  },
  {
    "id": "PM-K18",
    "stage": "K18",
    "parentExpenseId": "PM-MILESTONE",
    "expenseEventKey": "MGMT-PROJECT/K18",
    "phase": "Project closeout",
    "who": "ADDVALUE PM / contract coordinator (office)",
    "where": "ADDVALUE office / client correspondence",
    "what": "Project Management / Milestone coordination",
    "how": "Commercial claims, final milestone reconciliation, management closeout; no technical report formatting",
    "directOwner": "B2 final dossier; B3 retest/report",
    "deliverable": "Final milestone and commercial closeout record",
    "source": "Rev.K K18 / linked MR0001–0004/BOD/DTS/SPE as applicable",
    "costOwner": "B1",
    "payer": "ADDVALUE project management; confirm contractual payer",
    "executionState": "PROPOSED_OFFICE_PM_OVERLAY_NOT_EXECUTION",
    "workingPmDays": null,
    "rateSource": "Management approved Onshore labor USD 600/person-day (2026-10-18); milestone PM hours remain provisional"
  }
]);
// CFO planning effort: estimated office PM touchpoint hours per UNIQUE management event.
// These are explicit management assumptions prompted by Rev.K gates, NOT verified Rev.K activity durations.
// Shared events K03–K07 and K08–K11 charge once only.
const B1_CFO_PM_EVENT_ESTIMATES_0553=Object.freeze([
  {
    "key": "PM-GATE-K00",
    "ownerStage": "K00",
    "stages": [
      "K00"
    ],
    "mh": 8,
    "reason": "Kickoff, scope/owner baseline and management gate: CFO 8h provisional allowance"
  },
  {
    "key": "PM-GATE-K01",
    "ownerStage": "K01",
    "stages": [
      "K01"
    ],
    "mh": 4,
    "reason": "Single MGW FAT notice/punch decision: office PM only, 4h estimated"
  },
  {
    "key": "PM-GATE-K02",
    "ownerStage": "K02",
    "stages": [
      "K02"
    ],
    "mh": 4,
    "reason": "DDP receiving/exception approval event: office PM 4h allowance"
  },
  {
    "key": "PM-GATE-K03-K07",
    "ownerStage": "K03",
    "stages": [
      "K03",
      "K04",
      "K05",
      "K06",
      "K07"
    ],
    "mh": 4,
    "reason": "One shared Yard construction/installation readiness review covers K03–K07, not five charges"
  },
  {
    "key": "PM-GATE-K08-K11",
    "ownerStage": "K08",
    "stages": [
      "K08",
      "K09",
      "K10",
      "K11"
    ],
    "mh": 4,
    "reason": "One shared cross-MR Yard integration/testing coordination review covers K08–K11"
  },
  {
    "key": "PM-GATE-K12",
    "ownerStage": "K12",
    "stages": [
      "K12"
    ],
    "mh": 4,
    "reason": "Pre-loadout/MC gate and action closeout, 4h estimated"
  },
  {
    "key": "PM-GATE-K13",
    "ownerStage": "K13",
    "stages": [
      "K13"
    ],
    "mh": 2,
    "reason": "Marine milestone monitoring from office, NOT offshore attendance, 2h estimated"
  },
  {
    "key": "PM-GATE-K14",
    "ownerStage": "K14",
    "stages": [
      "K14"
    ],
    "mh": 4,
    "reason": "HUC RFSAT go/no-go approval and access coordination, 4h estimated"
  },
  {
    "key": "PM-GATE-K15",
    "ownerStage": "K15",
    "stages": [
      "K15"
    ],
    "mh": 4,
    "reason": "Brownfield host-access/project interfaces, exclude survey labour, 4h estimated"
  },
  {
    "key": "PM-GATE-K16",
    "ownerStage": "K16",
    "stages": [
      "K16"
    ],
    "mh": 6,
    "reason": "Multi-location SAT progress/risk and client escalation, NOT technician days, 6h estimated"
  },
  {
    "key": "PM-GATE-K17",
    "ownerStage": "K17",
    "stages": [
      "K17"
    ],
    "mh": 4,
    "reason": "SIT 72h readiness/signatory coordination; exclude test team, 4h estimated"
  },
  {
    "key": "PM-GATE-K18",
    "ownerStage": "K18",
    "stages": [
      "K18"
    ],
    "mh": 8,
    "reason": "Final milestone claim/closeout management; B2 dossier and B3 test report excluded, 8h estimated"
  }
]);
const eventByStage=new Map();
for(const event of B1_CFO_PM_EVENT_ESTIMATES_0553){
 for(const stage of event.stages){
  if(eventByStage.has(stage))throw Error("Duplicate PM event stage "+stage);
  eventByStage.set(stage,event);
 }
}
export const B1_REVK_MILESTONE_COVERAGE_0553=Object.freeze(B1_REVK_SOURCE_COVERAGE_0553.map(r=>{
 const event=eventByStage.get(r.stage);
 if(!event)throw Error("Unmapped Rev.K PM cost event "+r.stage);
 return Object.freeze({...r,moduleId:"bid.budget.working.bc.b1.revk."+r.stage.toLowerCase(),
  chargeEventKey:event.key,chargeOwnerStage:event.ownerStage,
  chargeableHere:r.stage===event.ownerStage,
  planningPmHours:r.stage===event.ownerStage?event.mh:null,
  budgetHoursBasis:event.reason,effortType:"CFO_PROVISIONAL_GATE_TOUCHPOINT_HOURS_NOT_REV_K_VERIFIED",
  costOwner:"B1",workingCostTHB:null,workingSellTHB:null,
  rateSource:B1_PM_LEGACY_PROXY_RATE_SOURCE_0553,
  rateApprovalState:ONSHORE_WORKING_SELL_RATE_0553.rateClass});
}));
export const B1_PM_BUDGET_ESTIMATED_HOURS_0553=B1_CFO_PM_EVENT_ESTIMATES_0553.reduce((n,x)=>n+x.mh,0);
export const B1_ONSHORE_PM_SCENARIO_0553=Object.freeze({
  ...ONSHORE_WORKING_SELL_RATE_0553,
  source:B1_PM_LEGACY_PROXY_RATE_SOURCE_0553,
  applicability:"B1 PM planning/audit proxy ONLY; NOT B3 FAT or B9 Yard rate posting",
  fxTHBPerUSD:ONSHORE_WORKING_SELL_RATE_0553.thbPerUsd,
  state:"USER_APPROVED_RATE__NON_POSTING_PM_QUANTITY_SCENARIO",
  costOrSell:"APPROVED_ONSHORE_WORKING_SELL_RATE_NOT_VERIFIED_DIRECT_COST",
  previousB9ChinaTeamUSDPerDay:1250,
  previousB9ChinaTeamPerDiemUSD:270,
  previousB9ChinaTeamTotalTHBPerDay:47880,
  offshoreSellUSDPerPersonDay:800,
  crossChargeBlocked:true
});
export function selectB1RevKMilestoneCoverage0553(){
 const rows=B1_REVK_MILESTONE_COVERAGE_0553;
 if(rows.length!==19||rows.some((row,i)=>row.stage!=="K"+String(i).padStart(2,"0")))
  throw Error("Missing/out-of-order Rev.K milestone in B1 PM coverage");
 if(new Set(rows.map(r=>r.moduleId)).size!==rows.length)
  throw Error("Duplicate B1 PM Module ID");
 if(new Set(rows.map(r=>r.expenseEventKey)).size!==rows.length)
  throw Error("Duplicate source milestone event");
 const billed=rows.filter(x=>x.chargeableHere);
 if(billed.length!==B1_CFO_PM_EVENT_ESTIMATES_0553.length||B1_PM_BUDGET_ESTIMATED_HOURS_0553!==56)
  throw Error("Unexpected CFO PM management effort allowance");
 if(new Set(billed.map(x=>x.chargeEventKey)).size!==billed.length)
  throw Error("Duplicate PM charge event");
 for(const r of rows){
  const owner=rows.find(x=>x.stage===r.chargeOwnerStage);
  if(!owner||!owner.chargeableHere||owner.chargeEventKey!==r.chargeEventKey)
   throw Error("B1 charge owner mismatch "+r.stage);
  if(!r.chargeableHere&&r.planningPmHours!==null)
   throw Error("Indirect shared-stage duplicate PM hours "+r.stage);
 }
 if(rows.some(r=>r.parentExpenseId!=="PM-MILESTONE"||r.costOwner!=="B1"||!r.directOwner))
  throw Error("B1 milestone cost ownership not segregated");
 return Object.freeze({rows,rate:B1_ONSHORE_PM_SCENARIO_0553,
  basePostingAllowed:false,scenarioDefaultDays:null,sourceRevision:"Rev.K 2026-10-18",
  coverageTotal:rows.length,uniquePmBudgetEvents:billed.length,
  initialEstimatedPmHours:B1_PM_BUDGET_ESTIMATED_HOURS_0553,
  effortEvidenceState:"CFO_PROVISIONAL_GATE_TOUCHPOINT_ASSUMPTION__NOT_REV_K_QUANTIFIED",
  projectExpenseOwner:"PM-MILESTONE"});
}
