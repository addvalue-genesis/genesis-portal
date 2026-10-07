import { PROJECT0550_ENGINEERING_DOCTRINE } from "./Project0550EngineeringDoctrine";

/*
PJ2608-0550 — PAGA DIGITAL THREAD / REQUIREMENT BASIS PILOT

Purpose:
Make the "Requirement" layer executable and reviewable, not merely prose.

Professional method alignment:
- Canonical method authority = PROJECT0550_ENGINEERING_DOCTRINE.fullChain.
- First Principles resolves fundamental need before solution / quantity / price.
- Constraint-Based Engineering resolves feasible context, inputs, proof, architecture and quantity.
- Parametric Cost converts controlled quantity/work drivers into MH, material, lifecycle, risk and commercial outputs.
- UI groups are presentation only; they must not reorder dependencies.
- Maintain bidirectional traceability; do not let vendor BOM redefine the customer requirement.
- COMMON/GENERIC equations are reused from GEQ registry.
- PAGA-specific calculations / studies are PARTICULAR bindings.

This is the pilot pattern for all 19 telecom systems.
*/

export const PROJECT0550_PAGA_SOURCE_CHAIN = [
  {
    code:"MR-0001-A1",
    class:"CUSTOMER / PROJECT SOURCE",
    document:"MM-ASK-1A-APF-TEL-MR-0001 Rev.A1",
    locator:"Appendix 1.4",
    role:"Scope / quantity / deliverable boundary",
    authority:"PROJECT_SOURCE",
    state:"CONTROLLED"
  },
  {
    code:"PHI-0001-PAGA",
    class:"CUSTOMER / PROJECT SOURCE",
    document:"MM-ASK-1A-APF-TEL-PHI-0001",
    locator:"§7.3.4",
    role:"System philosophy / operating intent / interfaces",
    authority:"PROJECT_SOURCE",
    state:"CONTROLLED"
  },
  {
    code:"BOD-0001-PAGA",
    class:"CUSTOMER / PROJECT SOURCE",
    document:"MM-ASK-1A-APF-TEL-BOD-0001 Rev.C8",
    locator:"§7.1.4",
    role:"Basis of design / architecture boundary",
    authority:"PROJECT_SOURCE",
    state:"CONTROLLED"
  },
  {
    code:"SPE-0004-B1",
    class:"CUSTOMER / PROJECT SOURCE",
    document:"MM-ASK-1A-APF-TEL-SPE-0004 Rev.B1",
    locator:"PAGA technical clauses",
    role:"Performance criteria / redundancy / interfaces / FAT-IFAT-SAT",
    authority:"PROJECT_SOURCE",
    state:"CONTROLLED"
  },
  {
    code:"STD-TEL-007",
    class:"COMPANY STANDARD",
    document:"10008-STD-6-TEL-007",
    locator:"Applicable PAGA standard clauses",
    role:"Company minimum technical / engineering requirements",
    authority:"COMPANY_STANDARD",
    state:"APPLICABILITY_REQUIRED"
  },
  {
    code:"DWG-PAGA-BLD",
    class:"PROJECT DRAWING",
    document:"PAGA System Block / Wiring Diagram",
    locator:"BLD-0003 vs BLD-0004 source conflict",
    role:"Topology / loop / interface / connection proof",
    authority:"PROJECT_DRAWING",
    state:"SOURCE_CONFLICT"
  },
  {
    code:"IND-A20261632",
    class:"VENDOR EVIDENCE",
    document:"INDUSTRONIC Offer A20261632",
    locator:"Selected PAGA technical + commercial offer",
    role:"Offered architecture / BOM / cost input",
    authority:"VENDOR_OFFERED_SOURCE",
    state:"CURRENT_SELECTED"
  },
  {
    code:"IND-NPA-DAT",
    class:"VENDOR DATASHEET",
    document:"INDUSTRONIC NPA IP-Based Public Address Unit",
    locator:"DAT-302-144-100-V02",
    role:"Product capability / amplifier output / circuit count / redundancy",
    authority:"VENDOR_DATASHEET",
    state:"CONTROLLED_VENDOR_EVIDENCE"
  }
];

export const PROJECT0550_PAGA_CANONICAL_STAGE_STATE = {
  SOURCE_EVIDENCE:{state:"CONTROLLED",detail:"MR / PHI / BOD / SPE / STD + project drawings + selected vendor evidence are registered with authority/state."},
  REQUIREMENT:{state:"CONTROLLED / PARTIAL",detail:"Source-backed PAGA requirement threads are explicit; remaining TBC inputs stay open."},
  FUNDAMENTAL_NEED:{state:"CONTROLLED",detail:"People must receive intelligible public address / alarm indication and the system must integrate / be testable across the required lifecycle."},
  CONSTRAINT:{state:"PARTIAL",detail:"Acoustic, loading, redundancy, Ex, topology, power, interface and responsibility constraints include open items."},
  INTERFACE_CONTEXT:{state:"PARTIAL",detail:"Fire & Gas, PABX, Entertainment, building/location and vendor/EPC boundaries are identified but not all closed."},
  ENGINEERING_INPUT:{state:"PARTIAL",detail:"Ambient noise, geometry, cable route/type, topology and autonomy inputs remain partly open."},
  CAL_STUDY_RPT:{state:"OPEN",detail:"RPT-0005 and PAGA particular CAL/SDY objects must be completed / source-bound."},
  PROOF:{state:"OPEN",detail:"Coverage, amplifier loading, loop/loss, autonomy and interface proof must pass before engineering release."},
  ARCHITECTURE:{state:"PRELIMINARY",detail:"INDUSTRONIC architecture is offered evidence; final required architecture remains proof-driven."},
  PHYSICAL_OBJECT:{state:"PRELIMINARY",detail:"Cabinet, amplifier, AP712, speaker, beacon, I/O, cable/bulk and accessories are known object families; final required set is not frozen."},
  QUANTITY_DRIVER:{state:"PARTIAL",detail:"Coverage + load + topology + loss + redundancy + location/interface requirements drive required quantities."},
  REQUIRED_MTO:{state:"TBC",detail:"Final required quantities remain TBC until proof/input chain closes."},
  BULK:{state:"WORKING",detail:"Cable / JB / terminations / supports / glands / connectors are working/open by route and final quantity."},
  VENDOR_RECONCILIATION:{state:"PARTIAL",detail:"INDUSTRONIC offered BOM can be reconciled, but offered quantity cannot substitute for required MTO."},
  WORK_RESOURCE:{state:"WORKING",detail:"Direct PAGA engineering/FAT/SAT/training/VDRL workload model is bound; shared/common allocation remains controlled separately."},
  DOCUMENT_QA:{state:"WORKING",detail:"Engineering / test / O&M VDRL lifecycle modeled; final deliverable applicability/revisions require closure."},
  FAT_IFAT:{state:"WORKING",detail:"FAT/IFAT required; factory/vendor and retained ADDVALUE scope must avoid double count."},
  LOGISTICS_REGULATORY:{state:"OPEN",detail:"FCA Germany onward logistics, import, AVL/type approval and responsibility remain open."},
  SITE_READINESS:{state:"OPEN",detail:"Site access, interfaces, ambient/geometry/route inputs and readiness are not fully controlled."},
  INSTALL_PRECOM:{state:"OPEN",detail:"Physical installation is separate C1 option while retained pre-commissioning support remains to be closed."},
  SAT_COMMISSIONING:{state:"OPEN",detail:"Site OEM/ADVALUE SAT/integration/commissioning ownership and effort remain open."},
  HANDOVER_WARRANTY:{state:"OPEN",detail:"Spares, O&M handover and warranty obligations remain partly open."},
  COST_SCHEDULE_RISK:{state:"WORKING",detail:"Vendor cost + direct service cost known in part; open completion cost remains TBC and not zero."},
  COMMERCIAL_TREATMENT:{state:"WORKING / HOLD",detail:"Indicative known-cost commercial preview is available; final customer sell is not released."},
  RELEASE:{state:"BLOCKED",detail:"Mandatory upstream proof / quantity / lifecycle / commercial gates are not closed."}
};

export const PROJECT0550_PAGA_CANONICAL_THREAD = PROJECT0550_ENGINEERING_DOCTRINE.fullChain.map(([id,label],index)=>({
  order:index+1,
  id,
  label,
  ...(PROJECT0550_PAGA_CANONICAL_STAGE_STATE[id] || {state:"TBC",detail:"Stage not yet bound."})
}));

export const PROJECT0550_PAGA_METHOD_GROUPS = PROJECT0550_ENGINEERING_DOCTRINE.presentationGroups.map(group=>({
  ...group,
  stages:group.stages.map(stageId=>PROJECT0550_PAGA_CANONICAL_THREAD.find(x=>x.id===stageId)).filter(Boolean)
}));

export const PROJECT0550_PAGA_REQUIREMENTS = [
  {
    id:"REQ-PAGA-001",
    title:"Audible speech coverage",
    source:["SPE-0004-B1","STD-TEL-007"],
    requirement:"Speech level shall satisfy the project PAGA audibility criteria at required occupied locations.",
    constraints:[
      "Minimum 65 dBA",
      "When ambient < 85 dBA, speech target is at least ambient +10 dB and not more than ambient +20 dB"
    ],
    proof:["PAGA-SDY-COVER-001","RPT-0005"],
    objects:["Speaker type","Speaker quantity","Speaker tap","Location/layout"],
    equations:["PAGA-CAL-COVER-001","GEQ-004"],
    drives:["Required speaker quantity","Speaker tap/load","Cable route","Installation/test work"],
    state:"PARTIAL"
  },
  {
    id:"REQ-PAGA-002",
    title:"Alarm audibility and visual alarm",
    source:["SPE-0004-B1","STD-TEL-007"],
    requirement:"Alarm tones and visual warning shall meet the project ambient-noise criterion.",
    constraints:[
      "Alarm tone >= ambient +6 dB",
      "Flashing beacon supplements audible alarm where ambient >=85 dBA"
    ],
    proof:["PAGA-SDY-COVER-001","RPT-0005"],
    objects:["Speakers","Beacons","Beacon monitoring/control"],
    equations:["PAGA-CAL-COVER-001","GEQ-004","GEQ-031"],
    drives:["Beacon quantity","Beacon controller / monitored circuits","Hazardous-area device class"],
    state:"PARTIAL"
  },
  {
    id:"REQ-PAGA-003",
    title:"Amplifier loading and redundancy",
    source:["SPE-0004-B1","IND-NPA-DAT"],
    requirement:"Remote amplifier architecture shall satisfy loading and N+1 requirements.",
    constraints:[
      "Amplifier nominal output within required project/vendor capability",
      "Total connected loading <=80% of nominal",
      "Remote amplifier units at each building N+1"
    ],
    proof:["PAGA-CAL-AMP-001"],
    objects:["Remote amplifier","Active amplifier","Standby amplifier","Speaker circuits / loops"],
    equations:["PAGA-CAL-AMP-001","GEQ-002","GEQ-032"],
    drives:["Amplifier quantity","Cabinet quantity","Power demand","Heat/load","Cost"],
    state:"PARTIAL"
  },
  {
    id:"REQ-PAGA-004",
    title:"Loop / cable loss and topology",
    source:["SPE-0004-B1","DWG-PAGA-BLD"],
    requirement:"Speaker circuits / loops and cable shall support the required acoustic load within acceptable electrical loss and topology constraints.",
    constraints:[
      "Final loop topology must come from controlled drawing / design",
      "Current cable size/type and route length remain TBC"
    ],
    proof:["PAGA-CAL-LOSS-001","SOURCE-RECON-001"],
    objects:["Cable","JB / termination","Loop / circuit","Cabinet I/O"],
    equations:["PAGA-CAL-LOSS-001","GEQ-012","GEQ-019"],
    drives:["Cable quantity","Bulk/JB quantity","Loss margin","Installation MH"],
    state:"OPEN"
  },
  {
    id:"REQ-PAGA-005",
    title:"Power / UPS autonomy",
    source:["SPE-0004-B1","PHI-0001-PAGA","BOD-0001-PAGA"],
    requirement:"Complete PAGA package power engineering shall be compatible with project UPS supply and required autonomy.",
    constraints:[
      "APF 230 VAC UPS basis",
      "Final autonomy duration / efficiency / battery sizing inputs must be controlled before release"
    ],
    proof:["PAGA-CAL-UPS-001"],
    objects:["Power supply","UPS load","Battery / autonomy provision","Distribution"],
    equations:["PAGA-CAL-UPS-001","GEQ-018"],
    drives:["Power load","Battery/autonomy capacity","Cabinet/power accessories","Cost"],
    state:"OPEN"
  },
  {
    id:"REQ-PAGA-006",
    title:"System interfaces",
    source:["PHI-0001-PAGA","SPE-0004-B1","BOD-0001-PAGA"],
    requirement:"PAGA shall implement required interfaces and priority logic with adjacent systems.",
    constraints:[
      "Fire & Gas alarm/tone trigger",
      "IP Telephony/PABX broadcast interface",
      "Entertainment mute / priority interface"
    ],
    proof:["PAGA-SDY-IF-001"],
    objects:["I/O","Network interface","Gateway / protocol","Cause & effect / priority logic"],
    equations:["GEQ-025","GEQ-026"],
    drives:["Integration MH","Interface hardware","IFAT/SAT test cases","VDRL"],
    state:"PARTIAL"
  },
  {
    id:"REQ-PAGA-007",
    title:"Lifecycle verification",
    source:["MR-0001-A1","SPE-0004-B1"],
    requirement:"PAGA lifecycle shall include required engineering documentation and acceptance testing.",
    constraints:["FAT required","IFAT required","SAT required"],
    proof:["PAGA-TEST-001"],
    objects:["FAT procedure/report","IFAT procedure/report","SAT procedure/report","Punch/closeout"],
    equations:["GEQ-004","GEQ-005","GEQ-009","GEQ-023","GEQ-024"],
    drives:["Engineering MH","Vendor coordination","Travel/event workload","B1/B4 cost"],
    state:"PARTIAL"
  }
];

export const PROJECT0550_PAGA_PARTICULAR_EQUATIONS = [
  {
    code:"PAGA-CAL-COVER-001",
    name:"PAGA acoustic target / beacon applicability",
    expression:"L_speech,target = max(65, L_ambient + 10); L_alarm,target = L_ambient + 6; I_beacon = 1 when L_ambient >= 85 dBA",
    source:["SPE-0004-B1","STD-TEL-007"],
    input:["Ambient noise by location","Room/area geometry","Speaker acoustic data","Mounting/location"],
    output:["Required SPL target","Beacon applicability","Coverage design basis"],
    state:"INPUT_PARTIAL"
  },
  {
    code:"PAGA-CAL-AMP-001",
    name:"PAGA amplifier loading / redundancy",
    expression:"P_load = Σ(q_speaker × tap_W); P_allowable = 0.80 × P_amp,nominal; require P_load <= P_allowable; N_amp = N_required + N+1 redundancy",
    source:["SPE-0004-B1","IND-NPA-DAT"],
    input:["Speaker quantity","Tap setting","Amplifier nominal output","Loop/circuit allocation"],
    output:["Required active amplifier capacity","Standby amplifier quantity","Utilization"],
    state:"PARTIAL"
  },
  {
    code:"PAGA-CAL-LOSS-001",
    name:"PAGA speaker-loop cable loss",
    expression:"I_loop = P_load / V_line; R_loop = 2 × L × ρ / A; P_loss = I_loop² × R_loop",
    source:["FIRST_PRINCIPLE","SPE-0004-B1","DWG-PAGA-BLD"],
    input:["Loop load","100 V line","Cable length","Conductor area/material"],
    output:["Cable loss","Voltage/load margin","Cable size / route feasibility"],
    state:"INPUT_OPEN"
  },
  {
    code:"PAGA-CAL-UPS-001",
    name:"PAGA UPS energy / autonomy basis",
    expression:"E_required,ideal = P_node × t_autonomy; detailed battery sizing requires controlled efficiency / reserve / battery parameters",
    source:["FIRST_PRINCIPLE","SPE-0004-B1","BOD-0001-PAGA"],
    input:["Node power demand","Required autonomy","Efficiency/reserve/battery factors"],
    output:["UPS energy requirement / battery sizing basis"],
    state:"INPUT_OPEN"
  }
];

export const PROJECT0550_PAGA_DIRECT_SERVICE_MODEL = {
  sourceWorkbook:"PJ2608-0550_First-Principles_Resource-Protected_Budget_Model_Rev04_20261005.xlsx",
  sourceSheets:["05_Service_Parametric","07_VDRL"],
  rule:"Direct PAGA service rows only. Shared/common campaigns (e.g. multi-system survey/travel) are not forced into PAGA without a controlled allocation driver.",
  rows:[
    {code:"SVC-025",commercialMap:"B1",category:"ENGINEERING",workObject:"Requirement / constraint extraction & control",role:"LEAD",mh:16,internalCostThb:12000,baseSellThb:37035.35},
    {code:"SVC-026",commercialMap:"B1",category:"ENGINEERING",workObject:"Engineering proof / CAL-STUDY-RPT development-review",role:"DESIGN",mh:60,internalCostThb:33750,baseSellThb:106055.775},
    {code:"SVC-027",commercialMap:"B1",category:"ENGINEERING",workObject:"Physical object / MTO / vendor BOM reconciliation",role:"DESIGN",mh:24,internalCostThb:13500,baseSellThb:42422.31},
    {code:"SVC-028",commercialMap:"B4",category:"FAT / IFAT",workObject:"FAT / IFAT retained preparation, witness and close-out",role:"SITE",mh:48,internalCostThb:36000,baseSellThb:134674.0067337},
    {code:"SVC-029",commercialMap:"B4",category:"SITE / COMMISSIONING",workObject:"Pre-commissioning + SAT + integration + commissioning/start-up",role:"SITE",mh:120,internalCostThb:90000,baseSellThb:336685.01683425},
    {code:"SVC-030",commercialMap:"B3",category:"TRAINING",workObject:"Training + handover technical delivery",role:"SITE",mh:24,internalCostThb:18000,baseSellThb:67337.00336685},
    {code:"VDRL-013",commercialMap:"B1",category:"VDRL",workObject:"Engineering document review / revision / DC lifecycle",role:"DOCUMENT",mh:67.5,internalCostThb:27000,baseSellThb:102268.06875},
    {code:"VDRL-014",commercialMap:"B1",category:"VDRL",workObject:"Quality / test document lifecycle",role:"DOCUMENT",mh:37,internalCostThb:14800,baseSellThb:56058.0525},
    {code:"VDRL-015",commercialMap:"B1",category:"VDRL",workObject:"O&M / handover document lifecycle",role:"DOCUMENT",mh:36,internalCostThb:14400,baseSellThb:54542.97}
  ],
  totals:{
    directMh:432.5,
    internalCostThb:259450,
    baseSellThb:937078.5531848
  },
  exclusions:[
    "Shared multi-system survey / specialist measurement campaign",
    "Common PM / document-control pools not yet causally allocated to PAGA",
    "INDUSTRONIC / other OEM site attendance not yet quoted/closed",
    "Physical installation C1 option"
  ]
};

export const PROJECT0550_PAGA_OUTPUT_CHAIN = PROJECT0550_PAGA_METHOD_GROUPS.map((group,index)=>({
  step:index+1,
  label:group.label,
  output:group.stages.map(x=>x.label).join(" → "),
  canonicalStages:group.stages.map(x=>x.id)
}));

export function pagaRequirementSummary(){
  return {
    sources:PROJECT0550_PAGA_SOURCE_CHAIN.length,
    requirements:PROJECT0550_PAGA_REQUIREMENTS.length,
    particularEquations:PROJECT0550_PAGA_PARTICULAR_EQUATIONS.length,
    openRequirements:PROJECT0550_PAGA_REQUIREMENTS.filter(x=>/OPEN|PARTIAL/.test(x.state)).length
  };
}
