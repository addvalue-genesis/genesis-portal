import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./PagaWorkspace.css";
import { PAGA_VIEW_MODULES } from "./Project0550ModuleRegistry";

const VIEWS = PAGA_VIEW_MODULES.map((m)=>({ key:m.key, label:`${m.id} · ${m.title}` }));

const LOCATIONS = [
  { code: "APF-CATERING", name: "Catering", state: "ACTIVE", detail: "Vertical slice in progress" },
  { code: "APF-ACCOMMODATION", name: "Accommodation", state: "BASELINE", detail: "Historical baseline ready" },
  { code: "APF-FIRE-SAFETY", name: "Fire / Safety", state: "BASELINE", detail: "Historical baseline ready" },
  { code: "APF-CONTROL", name: "Control Building", state: "REFERENCE", detail: "Main PAGA node reference" },
];


const PAGA_CATERING_SYSTEM = {
  facts: {
    zone: "ZONE 1 · Accommodation area",
    location: "Catering Building · APF",
    historicalSpeakerTags: 8,
    speakerTags: "LSN-303-201 … LSN-303-208",
    historicalRemoteNode: "PAGA-303-201",
    historicalMainNode: "PAGA-303-351",
    vendorOffer: "INDUSTRONIC A20261632",
    vendorRemoteNode: "1 × Remote Amplifier Node (within 4-node group)",
    vendorAmplifier: "1 × NPA 300 W active + 1 × NPA 300 W N+1",
    vendorSpeaker: "LD 8 UE/IP54 EN54 · 8 W · 100 V",
    vendorNetwork: "Managed FE switch · 8 RJ45 / 4 Combo / 1 SFP SM",
    sourcePower: "230 VAC UPS; package power engineering by Vendor",
  },
  dummy: {
    ambientNoiseDbA: 75,
    geometry: "24 m × 12 m × 3.2 m",
    speakerLayout: "2 × 4 ceiling grid using historical 8 tags",
    tapW: 8,
    cable: "2C × 2.5 mm² Cu — DUMMY",
    legacyLoopLengthM: 210,
    upsAutonomyH: 1,
    dummyNodeLoadW: 1000,
  }
};

const PAGA_REQUIREMENT_REGISTER = [
  ["REQ-PAGA-CAT-001","Audible speech","Speech ≥ ambient +10 dB and ≤ ambient +20 dB; minimum 65 dBA","SPE-0004 §9.4","PAGA-SDY-COVER-001","FACT"],
  ["REQ-PAGA-CAT-002","Alarm audibility","Alarm tone ≥ ambient +6 dB","SPE-0004 §9.4","PAGA-SDY-COVER-001","FACT"],
  ["REQ-PAGA-CAT-003","Visual alarm trigger","Beacon supplements audible alarm when ambient ≥85 dBA","SPE-0004 §9.4","PAGA-SDY-COVER-001","FACT"],
  ["REQ-PAGA-CAT-004","Speaker deployment","Vendor shall calculate deployment of speakers / beacons / alerting devices","SPE-0004 §8.4","RPT-0005","FACT"],
  ["REQ-PAGA-CAT-005","Amplifier loading","Total amplifier loading ≤80% nominal; channel 200–400 W","SPE-0004 §10.1.2","PAGA-CAL-AMP-001","FACT"],
  ["REQ-PAGA-CAT-006","Amplifier redundancy","Remote amplifier unit at each building shall be N+1","SPE-0004 §8.6","PAGA-CAL-AMP-001","FACT"],
  ["REQ-PAGA-CAT-007","Power","APF 230 VAC UPS; Vendor responsible for complete package power engineering","SPE-0004 §6.2 / §9.6","PAGA-CAL-UPS-001","FACT"],
  ["REQ-PAGA-CAT-008","Interfaces","PAGA interfaces with F&G, IP Telephony/PABX and Entertainment system","SPE-0004 §7 / §9.3","PAGA-SDY-IF-001","FACT"],
  ["REQ-PAGA-CAT-009","Factory/site acceptance","PAGA tests include FAT, IFAT and SAT","SPE-0004 §11","PAGA-TEST-001","FACT"],
  ["REQ-PAGA-CAT-010","Current ambient input","Current Catering operating ambient-noise level","Not found in controlled source","PAGA-SDY-COVER-001","TBC → DUMMY 75 dBA"],
  ["REQ-PAGA-CAT-011","Current geometry","Current room geometry and listener coordinates","Current drawing geometry not yet controlled","PAGA-SDY-COVER-001","TBC → DUMMY 24×12×3.2 m"],
  ["REQ-PAGA-CAT-012","Loop cable design","Current cable size/route + acceptance loss criterion","Current controlled cable basis not located","PAGA-CAL-LOSS-001","TBC → DUMMY 2C×2.5 mm² / legacy 210 m"],
  ["REQ-PAGA-CAT-013","UPS autonomy","Required autonomy duration / duty case","60-min requirement not confirmed in current source set","PAGA-CAL-UPS-001","TBC → DUMMY 1 h"],
  ["REQ-PAGA-CAT-014","PAGA block drawing reference","MR Appendix 2 says APF PAGA = BLD-0004; PHI-0004 reference list says APF PAGA = BLD-0003","MR-0001 vs PHI-0004","SOURCE-RECON-001","SOURCE_CONFLICT"],
];

const PAGA_VENDOR_MAPPING = [
  ["Remote node","Catering requires building-level remote amplification topology","A20261632 group 4000 includes Catering; NPA 300 W + N+1","OFFERED MATCH · exact tag binding pending"],
  ["Amplifier active","Capacity driven by final loop load","1 × NPA 300 W; 4 lines or 2 loops","PRELIM MATCH"],
  ["Amplifier standby","N+1 required","1 × NPA 300 W in N+1 configuration","MATCH TO REQUIREMENT"],
  ["Ceiling speaker","Final quantity/tap from coverage study","LD 8 UE/IP54 EN54 · 8 W · 100 V; project-wide quote qty 124","MODEL SUITABLE · Catering allocation TBC"],
  ["Speaker monitoring","Line monitoring required by specification","NPA supports speaker circuit monitoring; activation item ACT-NPA offered","RECONCILE ACTIVATION / CONFIG"],
  ["Network","Remote node must tie into PAGA LAN / monitoring","Managed FE switch; 1 SFP SM in offered node","INTERFACE / FO ROUTE TBC"],
  ["Beacon","Required if Catering ambient ≥85 dBA","Project-wide Ex/non-Ex beacons offered; XBC optional for monitored loops","NOT REQUIRED IN 75 dBA DUMMY; FINAL NOISE STUDY CONTROLS"],
];

const CATERING = {
  historical: {
    speakers: 8,
    tags: "LSN-303-201 ... LSN-303-208",
    remoteNode: "PAGA-303-201",
    mainNode: "PAGA-303-351",
  },
  sources: [
    { code: "LAY-0002", rev: "C1", title: "Catering Telecom Equipment Layout & Cable Routing", cls: "A" },
    { code: "SPE-0004", rev: "B1", title: "PAGA Specification", cls: "A" },
    { code: "PHI-0001", rev: "B1", title: "Telecommunication Design Philosophy", cls: "A" },
    { code: "PHI-0002", rev: "B1", title: "Telecommunication Interface Philosophy", cls: "A" },
    { code: "BOD-0001", rev: "C8", title: "Basis of Design", cls: "A" },
    { code: "10008-STD-6-TEL-007", rev: "R00", title: "PTTEP PAGA General Specification", cls: "A" },
    { code: "TC / TQ-007", rev: "2026-09-16", title: "CPECC PAGA coverage clarification", cls: "A" },
    { code: "A20261632", rev: "2026", title: "INDUSTRONIC offer — Offered Source, not Project Requirement", cls: "A" },
    { code: "DAT-302-144-100", rev: "V02", title: "INDUSTRONIC NPA datasheet — 300/600 W IP PA unit", cls: "A" },
    { code: "DAT-001-208-012", rev: "Vendor", title: "INDUSTRONIC LD 8 UE/IP54 EN54 ceiling speaker", cls: "A" },
  ],
  requirements: [
    { label: "Speech / message", value: "≥65 dBA", state: "SOURCE" },
    { label: "Speech SNR", value: "+10 to +20 dB vs ambient", state: "WORKING" },
    { label: "Alarm", value: "≥6 dB above ambient", state: "SOURCE" },
    { label: "Beacon", value: "Required when ambient ≥85 dBA", state: "SOURCE" },
    { label: "Amplifier load", value: "≤80% nominal", state: "SOURCE" },
    { label: "Loop loss", value: "Acceptance criterion TBC", state: "OPEN — no source limit found yet" },
    { label: "Redundancy", value: "N+1 / hot standby", state: "SOURCE" },
    { label: "UPS / Power", value: "230 VAC UPS + complete vendor power engineering", state: "SOURCE" },
  ],
  interfaces: ["F&G", "PABX", "Entertainment Mute", "Remote Node ↔ Main MCU", "UPS / Power", "Network / Monitoring"],
  blockers: [
    { title: "Ambient noise", detail: "Current Catering ambient-noise input not yet controlled", impact: "Blocks final speaker tap / beacon decision" },
    { title: "Current geometry", detail: "Latest architectural geometry / listener distance required", impact: "Blocks final coverage result" },
    { title: "APF cable schedule", detail: "Current cable type / length not yet confirmed", impact: "Blocks loop-loss and bulk cable" },
    { title: "Loop topology", detail: "Two-loop arrangement is a working hypothesis only", impact: "Blocks final loop assignment" },
    { title: "Drawing reference conflict", detail: "MR-0001 references APF PAGA BLD-0004 while PHI-0004 references BLD-0003", impact: "Must reconcile governing drawing before final topology release" },
  ],
};

const PROOFS = [
  {
    id: "PAGA-SDY-COVER-001",
    type: "SDY",
    name: "Sound Coverage / SNR Study",
    status: "OPEN",
    formula: "Acoustic simulation / coverage mapping",
    inputs: "Geometry + Ambient Noise + Speaker SPL / Directivity / Tap",
    output: "Speaker / beacon positions, taps, coverage result",
  },
  {
    id: "PAGA-CAL-LOAD-001",
    type: "CAL",
    name: "Speaker Tap & Loop Load",
    status: "PRELIMINARY",
    formula: "P_loop = Σ P_tap,i",
    inputs: "Historical 8 tags × candidate 8 W maximum tap",
    output: "64 W upper-bound screening load",
  },
  {
    id: "PAGA-CAL-AMP-001",
    type: "CAL",
    name: "Amplifier Sizing / Loading",
    status: "PRELIMINARY PASS",
    formula: "P_allow = P_nominal × 0.80",
    inputs: "300 W vendor candidate amplifier",
    output: "240 W allowed; 64 W load ⇒ 1 active amp by capacity",
  },
  {
    id: "PAGA-CAL-LOSS-001",
    type: "CAL",
    name: "Speaker Loop Cable Loss",
    status: "BLOCKED",
    formula: "100 V line loss using cable R + route length + connected load",
    inputs: "Current cable schedule missing",
    output: "TBC — must be ≤20%",
  },
  {
    id: "PAGA-CAL-UPS-001",
    type: "CAL",
    name: "UPS / Autonomy",
    status: "OPEN",
    formula: "Energy / load autonomy calculation",
    inputs: "Final node + beacon + electronics load",
    output: "TBC — verify 60 min alarm duty",
  },
];

const MTO_ROWS = [
  { object: "Indoor loudspeaker", required: "TBC", baseline: "8 historical tags", vendor: "LD 8 UE/IP54 EN54 candidate", state: "PROOF OPEN" },
  { object: "Remote amplifier node", required: "TBC", baseline: "PAGA-303-201", vendor: "1 node offered for Catering", state: "PRELIM MATCH" },
  { object: "Active amplifier", required: "1 by capacity screening", baseline: "Historical amp qty not authority", vendor: "1 × NPA 300 W active", state: "PRELIM MATCH" },
  { object: "N+1 amplifier", required: "Required", baseline: "N+1 requirement", vendor: "1 × NPA 300 W N+1", state: "PRELIM MATCH" },
  { object: "Flashing beacon", required: "TBC", baseline: "No Catering tag found ≠ zero scope", vendor: "Project-wide beacons offered", state: "NOISE INPUT NEEDED" },
  { object: "Speaker loop cable", required: "TBC", baseline: "Legacy routing only", vendor: "No final APF cable schedule", state: "BLOCKED" },
  { object: "F&G / PABX / Entertainment I/O", required: "TBC", baseline: "Functional tie-ins required", vendor: "Implementation to reconcile", state: "INTERFACE OPEN" },
];

const RPT_PACKAGE = [
  ["RPT section", "Requirement & Design Criteria Register", "AVAILABLE / EVOLVING"],
  ["RPT section", "Input / Assumption / Hold Register", "PARTIAL"],
  ["SDY", "Ambient Noise / Operating Scenario Study", "INPUT MISSING"],
  ["SDY", "Speaker Acoustic Coverage & SNR Study", "OPEN"],
  ["CAL", "Speaker Deployment Calculation", "TBC"],
  ["CAL", "Speaker Tap & Loop Load", "PRELIMINARY"],
  ["CAL", "Amplifier Sizing / Loading", "PRELIMINARY"],
  ["CAL", "Loop Cable Loss", "BLOCKED"],
  ["CAL", "UPS Load & Autonomy", "OPEN"],
  ["SDY", "Tie-In / Interface Assessment", "PARTIAL"],
  ["RPT section", "Required MTO Reconciliation", "NOT RELEASED"],
  ["TEST", "FAT / IFAT + SAT / Walk-Round", "PLANNED"],
];

const LIFECYCLE = [
  "Engineering",
  "Procurement",
  "Fabrication / Integration",
  "FAT",
  "IFAT",
  "Packing / Logistics",
  "Installation",
  "Pre-Commissioning",
  "Start-up",
  "Commissioning",
  "Training",
  "SAT",
  "ISAT",
  "Punch / Closeout",
  "Warranty / Support",
];

const COST_BUCKETS = [
  "Equipment",
  "Bulk",
  "Engineering MH",
  "VDRL / Document MH",
  "FAT / IFAT",
  "Logistics",
  "Installation MH",
  "Pre-Com",
  "Start-up",
  "Commissioning",
  "Training",
  "SAT / ISAT",
  "Spares / Tools",
  "Regulatory",
  "PM / Admin",
  "Warranty / Support",
  "Risk",
];

const FINAL_OUTPUTS = [
  {
    code: "DESIGN",
    title: "Engineering Design Basis",
    th: "รู้ว่าระบบต้องทำอะไรจริง",
    detail: "Requirement + constraint + interface + approved engineering result",
  },
  {
    code: "MTO",
    title: "Required MTO & Bulk",
    th: "รู้ว่าต้องซื้อและติดตั้งอะไร เท่าไร",
    detail: "Equipment, cable, JB, interface hardware and quantities released from proof",
  },
  {
    code: "TBE",
    title: "Vendor / TBE Decision",
    th: "รู้ว่าผู้ขายเสนอครบหรือขาดอะไร",
    detail: "Required vs Offered, compliance, deviation, capability and regulatory status",
  },
  {
    code: "VDRL",
    title: "VDRL & Workload",
    th: "รู้ว่าต้องทำเอกสารอะไร และใช้คนกี่ชั่วโมง",
    detail: "PTTEP deliverables, review cycles, role, Q × UMH and document-production workload",
  },
  {
    code: "DELIVERY",
    title: "Execution & Acceptance Plan",
    th: "รู้ว่าต้องทำงานและทดสอบอะไรจนรับมอบ",
    detail: "FAT, IFAT, logistics, installation, pre-com, start-up, commissioning, SAT / ISAT",
  },
  {
    code: "COST",
    title: "Project Cost / Schedule / Risk",
    th: "รู้ต้นทุนรวม เวลา และความเสี่ยงของโครงการ",
    detail: "Material + labor + lifecycle service + spares + document + risk, with TBC kept visible",
  },
  {
    code: "QUOTE",
    title: "Quotation / Selling Price",
    th: "ได้ราคาเสนอที่มีที่มาและอธิบายได้",
    detail: "Controlled cost basis + approved commercial pricing policy / margin + exclusions and assumptions",
  },
];

const BID_WORKFLOW = {
  objective: "ทำราคา PAGA ให้ครบ scope และลดความเสี่ยงต้นทุนตกหล่นก่อน freeze ราคาเสนอ",
  focus: "Catering Building",
  stage: "Engineering Proof",
  nextGate: "Close critical inputs → release Required MTO → price equipment / bulk / work / lifecycle",
};

const NEED_FROM_USER = [
  { item: "Ambient Noise / Noise Study", why: "ใช้ปิด Sound Coverage, speaker tap และ beacon requirement", action: "Provide / locate source" },
  { item: "Latest Catering Geometry / Layout", why: "ใช้ยืนยัน coverage, listener distance และตำแหน่ง speaker", action: "Confirm current drawing" },
  { item: "Current APF Cable Schedule", why: "ใช้คำนวณ loop loss และ bulk cable", action: "Locate controlled schedule" },
  { item: "Final Loop Topology", why: "ใช้ยืนยัน 2-loop hypothesis ก่อน freeze loop load / cable", action: "Verify drawing / vendor" },
];

const CHATGPT_CAN_DO = [
  { label: "Trace requirements back to MR / SPE / PHI / BOD / STD / TC", state: "CAN DO NOW" },
  { label: "Run preliminary CAL from controlled inputs and version the result", state: "CAN DO NOW" },
  { label: "Reconcile Required vs INDUSTRONIC offered BOM / deviation", state: "CAN DO NOW" },
  { label: "Build VDRL / workload / lifecycle cost structure with TBC visible", state: "CAN DO NOW" },
  { label: "Freeze final coverage / cable loss / final MTO", state: "WAITING INPUT" },
];

const RESOLUTION_QUEUE = [
  {
    id: "RES-PAGA-009",
    topic: "Catering loop topology",
    systemAction: "Reconcile BLD / LIS / vendor architecture and derive loop arrangement from controlled evidence.",
    currentBasis: "Two-loop arrangement remains a working hypothesis only.",
    state: "SYSTEM TO RESOLVE",
    escalation: "Raise TC/TQ only if governing sources remain incomplete/conflicting. Jack decision not required."
  },
  {
    id: "RES-PAGA-008",
    topic: "Acoustic design criterion",
    systemAction: "Apply SPE/STD sound-level requirements and verify by coverage study.",
    currentBasis: "≥65 dBA, speech +10 to +20 dB above ambient; alarm +6 dB; beacon if ambient ≥85 dBA.",
    state: "SOURCE-BASED",
    escalation: "No Jack decision required unless business chooses to accept a documented deviation."
  },
  {
    id: "RES-PAGA-SPARE",
    topic: "N+1 vs future spare capacity",
    systemAction: "Separate redundancy requirement from future expansion/spare-capacity requirement, then reconcile vendor architecture.",
    currentBasis: "SPE requires N+1 remote amplifier and minimum future spare/expansion provisions.",
    state: "SYSTEM TO RECONCILE",
    escalation: "Escalate only if residual commercial/risk acceptance remains after technical interpretation is closed."
  },
];

const QUOTE_READINESS = [
  { label: "Engineering Basis", status: "PARTIAL", detail: "Source/criteria ready; coverage/loss not closed" },
  { label: "Required MTO", status: "NOT READY", detail: "Speaker/beacon/cable still proof-driven" },
  { label: "Vendor / Pricing", status: "PARTIAL", detail: "INDUSTRONIC offer available; required-vs-offered not final" },
  { label: "Bulk", status: "OPEN", detail: "Cable/JB/termination drivers not frozen" },
  { label: "VDRL / Manhour", status: "STRUCTURE READY", detail: "Document/work model ready; UMH/rates still controlled inputs" },
  { label: "Lifecycle Cost", status: "TBC", detail: "FAT/IFAT/site/pre-com/commissioning/SAT resource basis not priced" },
  { label: "Spares / Tools", status: "TBC", detail: "Start-up, commissioning, 2-year spares and tools need quantity basis" },
  { label: "Commercial Price", status: "NOT READY", detail: "Selling price must wait for controlled cost basis + pricing policy" },
];

const IMPACT_CHAIN = [
  { label: "Required Speaker Qty", value: "TBC", note: "Coverage study controls final quantity" },
  { label: "Cable / Bulk Qty", value: "TBC", note: "Depends on final speaker / loop / route" },
  { label: "Installation MH", value: "TBC", note: "MH = Q × UMH" },
  { label: "Pre-Com / SAT MH", value: "TBC", note: "Driven by loop/device/test cases" },
  { label: "Total Project Cost", value: "TBC", note: "TBC is never treated as zero" },
  { label: "Selling Price", value: "TBC", note: "Cost basis + approved margin/markup policy" },
];

export function PagaWorkspace() {
  const [view, setView] = useState("system");
  const [location, setLocation] = useState("APF-CATERING");
  const [mode, setMode] = useState("PREVIEW");
  const [apiError, setApiError] = useState(null);
  const [liveData, setLiveData] = useState(null);

  useEffect(() => {
    fetch("/backend/api/etm/paga-workspace.php?project=PJ2608-0550")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((payload) => {
        if (!payload.ok) throw new Error(payload.message || payload.error || "ETM API error");
        setLiveData(payload);
        setMode("LIVE DB");
      })
      .catch((err) => {
        setApiError(err);
        setMode("PREVIEW");
      });
  }, []);

  const selectedLocation = LOCATIONS.find((x) => x.code === location) || LOCATIONS[0];

  const proofSummary = useMemo(() => {
    const rows = liveData?.proofs?.length ? liveData.proofs : PROOFS;
    return {
      total: rows.length,
      open: rows.filter((x) => ["OPEN", "BLOCKED"].some((s) => String(x.status || x.result_status).includes(s))).length,
    };
  }, [liveData]);

  return (
    <div className="etm-shell">
      <header className="etm-hero">
        <div>
          <div className="etm-eyebrow">12.7 · PAGA ENGINEERING · EVIDENCE-CONTROLLED SYSTEM RESOLUTION</div>
          <div className="etm-title-line">
            <h1>PJ2608-0550</h1>
            <span className="etm-divider">/</span>
            <h1>PAGA</h1>
          </div>
          <p className="etm-subtitle">SAM PTTEPI MY ASK TEL [MMC24-5002]</p>
        </div>
        <div className="etm-hero-actions">
          <Link to="/projects/pj2608-0550/systems" className="etm-back-link">← 12.0 · 19 Systems</Link>
          <span className={`etm-mode ${mode === "LIVE DB" ? "live" : "preview"}`}>{mode}</span>
          <span className="etm-release">MTO RELEASE: NOT READY</span>
        </div>
      </header>

      {apiError && (
        <div className="etm-preview-note">
          <strong>Preview dataset</strong>
          <span>
            React UI is showing the Rev06 engineering baseline while MariaDB/API migration is pending.
            {apiError ? ` API: ${String(apiError)}` : ""}
          </span>
        </div>
      )}

      <section className="etm-bid-banner">
        <div>
          <div className="etm-section-kicker">BID ENGINEERING & COST WORKBENCH</div>
          <h2>{BID_WORKFLOW.objective}</h2>
          <p>
            First Principles + Constraint-Based Engineering + Parametric Cost Engineering
            คือวิธีที่เราใช้เปลี่ยน RFQ ไปเป็น Required Scope, Workload, Cost Basis และ Selling Price ที่ trace กลับหา evidence ได้
          </p>
        </div>
        <div className="etm-bid-state">
          <div><small>Current focus</small><strong>{BID_WORKFLOW.focus}</strong></div>
          <div><small>Current stage</small><strong>{BID_WORKFLOW.stage}</strong></div>
          <div><small>Next gate</small><strong>{BID_WORKFLOW.nextGate}</strong></div>
        </div>
      </section>

      <section className="etm-purpose">
        <div className="etm-purpose-main">
          <div className="etm-section-kicker">WHY FIRST PRINCIPLES?</div>
          <h2>เราใช้ First Principles เพื่อเปลี่ยน RFQ ให้เป็น “สิ่งที่ออกแบบได้ ซื้อได้ ทดสอบได้ และคิดต้นทุนได้”</h2>
          <p>
            ระบบนี้ไม่ได้มีเป้าหมายแค่เก็บ Requirement หรือทำ Calculation แต่ต้องตามรอยได้ว่า
            <strong> ข้อกำหนดมาจากไหน → พิสูจน์อย่างไร → ต้องใช้อะไร → ใครทำ → ทดสอบอะไร → แล้วต้นทุน/เวลา/ความเสี่ยงเท่าไร</strong>
          </p>
          <div className="etm-purpose-route">
            <span>Source / Requirement</span><b>→</b>
            <span>Engineering Proof</span><b>→</b>
            <span>Required Design / MTO</span><b>→</b>
            <span>Vendor / Delivery</span><b>→</b>
            <span>Cost / Acceptance</span>
          </div>
        </div>
        <div className="etm-purpose-status">
          <small>CURRENT POSITION · CATERING</small>
          <strong>Engineering proof ยังไม่ปิด</strong>
          <p>ดังนั้น Required MTO และ Final Cost ยังห้าม freeze</p>
          <div>
            <span className="done">Source / Criteria ✓</span>
            <span className="partial">CAL / SDY ◐</span>
            <span className="blocked">MTO / Cost ⛔</span>
          </div>
        </div>
      </section>

      <section className="etm-outcome-section">
        <div className="etm-outcome-head">
          <div>
            <div className="etm-section-kicker">FINAL OUTPUTS</div>
            <h2>เมื่อข้อมูลและ Proof ปิดครบ เราต้องได้ผลลัพธ์อะไรจากระบบนี้?</h2>
          </div>
          <span>Definition of Done</span>
        </div>
        <div className="etm-outcome-grid">
          {FINAL_OUTPUTS.map((item) => (
            <article className="etm-outcome-card" key={item.code}>
              <div className="etm-outcome-code">{item.code}</div>
              <h3>{item.title}</h3>
              <strong>{item.th}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="etm-workbench-grid">
        <section className="etm-panel">
          <div className="etm-section-kicker">WHAT I NEED FROM YOU</div>
          <h3>ข้อมูลที่ถ้าได้มา จะปลดล็อกการคำนวณ / ราคา</h3>
          <div className="etm-user-input-list">
            {NEED_FROM_USER.map((row) => (
              <div className="etm-user-input-row" key={row.item}>
                <span>INPUT</span>
                <div>
                  <strong>{row.item}</strong>
                  <p>{row.why}</p>
                </div>
                <button type="button" title="Preview action only">{row.action}</button>
              </div>
            ))}
          </div>
        </section>

        <section className="etm-panel">
          <div className="etm-section-kicker">WHAT CHATGPT CAN DO NOW</div>
          <h3>งานที่ผมเดินต่อได้โดยไม่รอคุณ</h3>
          <div className="etm-ai-work-list">
            {CHATGPT_CAN_DO.map((row) => (
              <div key={row.label}>
                <span className={row.state === "CAN DO NOW" ? "can" : "wait"}>{row.state}</span>
                <p>{row.label}</p>
              </div>
            ))}
          </div>
          <div className="etm-chat-hint">
            <strong>คุณไม่ต้องพูดภาษา DB</strong>
            <span>พิมพ์ใน Chat เช่น “ลองเช็ค speaker 8 ตัวอีกครั้ง”, “ทำ TC ขอ Cable Schedule”, หรือ “ถ้าราคา Vendor เปลี่ยนให้คำนวณผลกระทบใหม่”</span>
          </div>
        </section>
      </section>

      <section className="etm-quote-readiness">
        <div className="etm-quote-head">
          <div>
            <div className="etm-section-kicker">QUOTATION READINESS</div>
            <h2>ก่อน freeze ราคาเสนอ ต้องเห็นว่าส่วนไหนพร้อม และส่วนไหนยังเสี่ยงตกหล่น</h2>
          </div>
          <StatusPill status="PRICE NOT READY" />
        </div>
        <div className="etm-readiness-grid">
          {QUOTE_READINESS.map((item) => (
            <div className="etm-readiness-card" key={item.label}>
              <small>{item.label}</small>
              <StatusPill status={item.status} small />
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="etm-summary-grid">
        <SummaryCard label="Historical speakers" value="8" detail="LSN-303-201 … 208" tone="blue" />
        <SummaryCard label="Engineering proofs" value={String(proofSummary.total)} detail="CAL + SDY objects" tone="violet" />
        <SummaryCard label="Prelim loop load" value="64 W" detail="8 × 8 W upper-bound" tone="green" />
        <SummaryCard label="Amp allowable" value="240 W" detail="300 W × 80%" tone="green" />
        <SummaryCard label="Open blockers" value="5" detail="Noise · Geometry · Cable · Loop · Drawing conflict" tone="amber" />
        <SummaryCard label="Evidence state" value="A / B / C / D" detail="Source · Derived · TBC · Model" tone="slate" />
      </section>

      <section className="etm-impact-panel">
        <div className="etm-panel-head">
          <div>
            <div className="etm-section-kicker">ENGINEERING → COST IMPACT</div>
            <h2>เมื่อ Engineering Input เปลี่ยน อะไรจะเปลี่ยนตามในราคา?</h2>
            <p>ผลลัพธ์ Derived ต้องคำนวณใหม่จากสมการ ไม่แก้ตัวเลขปลายทางด้วยมือ</p>
          </div>
          <div className="etm-impact-equations">
            <code>MH = Q × UMH</code>
            <code>C_project = Σ Material + Σ Work + Σ Lifecycle + Σ Spares + Σ Risk</code>
            <code>P_sell = PricingPolicy(C_project, Margin / Markup)</code>
          </div>
        </div>
        <div className="etm-impact-chain">
          {IMPACT_CHAIN.map((item, index) => (
            <React.Fragment key={item.label}>
              <div className="etm-impact-node">
                <small>{item.label}</small>
                <strong>{item.value}</strong>
                <span>{item.note}</span>
              </div>
              {index < IMPACT_CHAIN.length - 1 && <b>→</b>}
            </React.Fragment>
          ))}
        </div>
      </section>

      <nav className="etm-view-tabs">
        {VIEWS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={view === item.key ? "active" : ""}
            onClick={() => setView(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <section className="etm-location-strip">
        <div className="etm-location-label">LOCATION</div>
        {LOCATIONS.map((item) => (
          <button
            key={item.code}
            type="button"
            onClick={() => setLocation(item.code)}
            className={location === item.code ? "active" : ""}
          >
            <span>{item.name}</span>
            <small>{item.detail}</small>
          </button>
        ))}
      </section>

      {selectedLocation.code === "APF-CATERING" && (
        <section className="etm-decision-panel">
          <div className="etm-panel-head">
            <div>
              <div className="etm-section-kicker">12.7.7 · TECHNICAL RESOLUTION QUEUE</div>
              <h2>สิ่งที่ระบบต้องค้นหลักฐานและปิดคำตอบเอง — ไม่โยน Technical choice ให้ Jack เดา</h2>
            </div>
            <span className="etm-preview-action-note">Actions below are Rev0 UI preview</span>
          </div>
          <div className="etm-decision-grid">
            {RESOLUTION_QUEUE.map((d) => (
              <article key={d.id} className="etm-decision-card">
                <div className="etm-decision-top">
                  <code>{d.id}</code>
                  <StatusPill status={d.state} small />
                </div>
                <h3>{d.topic}</h3>
                <p><strong>System action:</strong> {d.systemAction}</p>
                <p><strong>Current basis:</strong> {d.currentBasis}</p>
                <small>{d.escalation}</small>
              </article>
            ))}
          </div>
        </section>
      )}

      {selectedLocation.code !== "APF-CATERING" ? (
        <section className="etm-panel etm-coming">
          <div>
            <div className="etm-section-kicker">{selectedLocation.code}</div>
            <h2>{selectedLocation.name}</h2>
            <p>
              Rev0 has the location node reserved. Detailed migration from the historical evidence baseline
              will follow the same First Principles structure used for Catering.
            </p>
          </div>
          <StatusPill status={selectedLocation.state} />
        </section>
      ) : (
        <>
          {view === "system" && <SystemPictureView />}
          {view === "trace" && <TraceView />}
          {view === "proof" && <ProofView />}
          {view === "mto" && <MtoView />}
          {view === "vdrl" && <VdrlView />}
          {view === "lifecycle" && <LifecycleView />}
        </>
      )}
    </div>
  );
}


function SystemPictureView() {
  const d = PAGA_CATERING_SYSTEM.dummy;
  const speechTarget = Math.max(65, d.ambientNoiseDbA + 10);
  const alarmTarget = d.ambientNoiseDbA + 6;
  const speakerLoad = PAGA_CATERING_SYSTEM.facts.historicalSpeakerTags * d.tapW;
  const ampAllowable = 300 * 0.8;
  const ampUtilization = (speakerLoad / 300) * 100;
  const currentA = speakerLoad / 100;
  const conductorR = (2 * d.legacyLoopLengthM * 0.0175) / 2.5;
  const cableLossW = currentA * currentA * conductorR;
  const cableLossPct = (cableLossW / speakerLoad) * 100;
  const upsEnergyKWh = (d.dummyNodeLoadW * d.upsAutonomyH) / 1000;

  return (
    <div className="etm-content-stack">
      <section className="etm-panel paga-picture-hero">
        <div>
          <div className="etm-section-kicker">12.7.1 · PAGA SYSTEM PICTURE · CATERING · FACT + DUMMY PREVIEW</div>
          <h2>เห็นระบบทั้งเส้นก่อน — ข้อมูลที่ยังไม่มีใช้ Dummy เพื่อให้ Engineering Flow ทำงานได้</h2>
          <p>
            <strong>Blue = Project / historical fact</strong>, <strong>Green = INDUSTRONIC offered evidence</strong>,
            <strong>Amber = DUMMY / working scenario</strong>. Dummy ใช้เพื่อให้เห็น logic เท่านั้น และห้าม release เป็น Final MTO/Quotation.
          </p>
        </div>
        <div className="paga-picture-badges">
          <span className="fact">FACT</span>
          <span className="vendor">VENDOR</span>
          <span className="dummy">DUMMY/TBC</span>
        </div>
      </section>

      <section className="etm-panel">
        <div className="etm-panel-head">
          <div>
            <div className="etm-section-kicker">FUNCTIONAL ARCHITECTURE</div>
            <h2>Catering PAGA — from plant interfaces to people in the building</h2>
          </div>
          <StatusPill status="PRELIMINARY SYSTEM MODEL" />
        </div>

        <div className="paga-system-map">
          <div className="paga-map-column">
            <div className="paga-map-node fact"><small>PLANT INTERFACE</small><strong>Fire & Gas</strong><span>Alarm/tone trigger</span></div>
            <div className="paga-map-node fact"><small>PLANT INTERFACE</small><strong>IP PABX</strong><span>Authorized telephone broadcast</span></div>
            <div className="paga-map-node fact"><small>PLANT INTERFACE</small><strong>Entertainment</strong><span>Mute / priority interface</span></div>
          </div>
          <div className="paga-map-arrow">→</div>
          <div className="paga-map-column">
            <div className="paga-map-node fact"><small>APF MAIN PAGA</small><strong>{PAGA_CATERING_SYSTEM.facts.historicalMainNode}</strong><span>Controller / network / system supervision</span></div>
          </div>
          <div className="paga-map-arrow">→ FO / LAN →</div>
          <div className="paga-map-column">
            <div className="paga-map-node vendor"><small>CATERING REMOTE NODE</small><strong>{PAGA_CATERING_SYSTEM.facts.historicalRemoteNode}</strong><span>Vendor: managed switch + NPA active + NPA N+1</span></div>
            <div className="paga-map-node vendor"><small>AMPLIFICATION</small><strong>300 W Active + 300 W N+1</strong><span>100 V · 4 lines / 2 loops</span></div>
          </div>
          <div className="paga-map-arrow">→ 100 V →</div>
          <div className="paga-map-column speakers">
            {Array.from({length:8},(_,i)=>(
              <div className="paga-speaker fact" key={i}>
                <b>{String(i+1).padStart(2,"0")}</b>
                <span>LSN-303-{201+i}</span>
                <small>LD 8 candidate · {d.tapW} W dummy tap</small>
              </div>
            ))}
          </div>
        </div>

        <div className="paga-dummy-strip">
          <div><small>Ambient</small><strong>{d.ambientNoiseDbA} dBA</strong><span>DUMMY</span></div>
          <div><small>Geometry</small><strong>{d.geometry}</strong><span>DUMMY</span></div>
          <div><small>Layout</small><strong>{d.speakerLayout}</strong><span>HISTORICAL + DUMMY</span></div>
          <div><small>Loop route</small><strong>{d.legacyLoopLengthM} m</strong><span>LEGACY WORKING BASIS</span></div>
          <div><small>Cable</small><strong>{d.cable}</strong><span>DUMMY</span></div>
        </div>
      </section>

      <section className="etm-panel">
        <div className="etm-section-kicker">DUMMY ENGINEERING RUN</div>
        <h2>ถ้าใช้ข้อมูลสมมติข้างบน ระบบควรคำนวณต่ออย่างไร</h2>
        <div className="paga-calc-grid">
          <article><small>Speech target</small><strong>{speechTarget.toFixed(0)} dBA</strong><code>max(65, {d.ambientNoiseDbA}+10)</code><span>DUMMY INPUT → DERIVED</span></article>
          <article><small>Alarm target</small><strong>{alarmTarget.toFixed(0)} dBA</strong><code>{d.ambientNoiseDbA}+6</code><span>DUMMY INPUT → DERIVED</span></article>
          <article><small>Beacon trigger</small><strong>{d.ambientNoiseDbA >= 85 ? "YES" : "NO"}</strong><code>ambient ≥ 85 dBA</code><span>For dummy scenario only</span></article>
          <article><small>Speaker load</small><strong>{speakerLoad} W</strong><code>8 × {d.tapW} W</code><span>Historical qty + dummy tap</span></article>
          <article><small>Amp allowable</small><strong>{ampAllowable} W</strong><code>300 × 80%</code><span>FACT requirement + vendor amp</span></article>
          <article><small>Amp utilization</small><strong>{ampUtilization.toFixed(1)}%</strong><code>{speakerLoad}/300</code><span>Capacity screen PASS</span></article>
          <article><small>Cable loss screen</small><strong>{cableLossPct.toFixed(1)}%</strong><code>I²R ≈ {cableLossW.toFixed(2)} W</code><span>DUMMY cable / end-load simplification</span></article>
          <article><small>UPS energy screen</small><strong>{upsEnergyKWh.toFixed(1)} kWh</strong><code>{d.dummyNodeLoadW} W × {d.upsAutonomyH} h</code><span>DUMMY ONLY — autonomy requirement TBC</span></article>
        </div>
      </section>

      <div className="etm-two-col etm-align-start">
        <section className="etm-panel">
          <div className="etm-section-kicker">REQUIREMENT / PROOF REGISTER</div>
          <h2>Requirement ไหนเป็น Fact และช่องไหนกำลังใช้ Dummy</h2>
          <div className="etm-table-wrap">
            <table className="etm-data-table paga-register-table">
              <thead><tr><th>ID</th><th>Requirement</th><th>Controlled basis</th><th>Source</th><th>Proof</th><th>State</th></tr></thead>
              <tbody>{PAGA_REQUIREMENT_REGISTER.map(r=>(
                <tr key={r[0]}>
                  <td><code>{r[0]}</code></td><td><strong>{r[1]}</strong></td><td>{r[2]}</td><td>{r[3]}</td><td><code>{r[4]}</code></td>
                  <td><span className={r[5].startsWith("FACT")?"paga-state fact":"paga-state dummy"}>{r[5]}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>

        <section className="etm-panel">
          <div className="etm-section-kicker">REQUIRED ↔ INDUSTRONIC</div>
          <h2>Vendor เป็น Offered Truth ไม่ใช่ Project Requirement</h2>
          <div className="paga-vendor-list">
            {PAGA_VENDOR_MAPPING.map(r=>(
              <div key={r[0]}>
                <strong>{r[0]}</strong>
                <span><b>Required:</b> {r[1]}</span>
                <span><b>INDUSTRONIC:</b> {r[2]}</span>
                <StatusPill status={r[3]} small />
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="etm-panel">
        <div className="etm-section-kicker">WHAT CHANGES WHEN REAL INPUT ARRIVES</div>
        <h2>Dummy ไม่ต้องลบทิ้งด้วยมือ — เปลี่ยน input แล้ว Derived chain ต้องคำนวณใหม่</h2>
        <div className="paga-recalc-flow">
          <span>Real Ambient / Geometry</span><b>→</b>
          <span>Coverage SDY</span><b>→</b>
          <span>Speaker Qty / Tap / Beacon</span><b>→</b>
          <span>Loop Load / Cable</span><b>→</b>
          <span>Amp / UPS</span><b>→</b>
          <span>Required MTO</span><b>→</b>
          <span>Vendor Gap / Cost</span>
        </div>
      </section>
    </div>
  );
}

function TraceView() {
  const stages = [
    ["01", "SOURCE", "7 controlled references", "ready"],
    ["02", "REQUIREMENT", "Acoustic · load · loss · redundancy · tie-in", "ready"],
    ["03", "ENGINEERING INPUT", "4 critical inputs still open", "warn"],
    ["04", "CAL", "Load / Amp preliminary · Loss / UPS open", "partial"],
    ["05", "SDY", "Coverage / SNR study open", "warn"],
    ["06", "RPT-0005", "Official PAGA Sound Coverage Study Report", "partial"],
    ["07", "REQUIRED MTO", "Release blocked until proof closes", "blocked"],
    ["08", "VENDOR / TBE", "INDUSTRONIC reconciliation partial", "partial"],
    ["09", "EXECUTION", "FAT → SAT lifecycle reserved", "partial"],
    ["10", "COST", "TBC ≠ zero cost", "blocked"],
  ];

  return (
    <div className="etm-content-stack">
      <section className="etm-panel">
        <div className="etm-panel-head">
          <div>
            <div className="etm-section-kicker">12.7.2 · REQUIREMENT / EVIDENCE · CATERING</div>
            <h2>จาก Requirement ไปสู่ผลลัพธ์ที่ใช้ทำงานจริง</h2>
            <p>
              อ่านจากซ้ายไปขวา: เราเริ่มจากหลักฐาน/ข้อกำหนด แล้วใช้ CAL / SDY / RPT พิสูจน์
              จนได้ Required MTO, Vendor gap, งานที่ต้องทำ และต้นทุนที่เชื่อถือได้
            </p>
          </div>
          <div className="etm-legend">
            <span><i className="a" />A Source</span>
            <span><i className="b" />B Derived</span>
            <span><i className="c" />C TBC</span>
            <span><i className="d" />D Model</span>
          </div>
        </div>

        <div className="etm-thread">
          {stages.map(([no, label, detail, state], index) => (
            <React.Fragment key={label}>
              <div className={`etm-thread-node ${state}`}>
                <span className="etm-thread-no">{no}</span>
                <strong>{label}</strong>
                <small>{detail}</small>
              </div>
              {index < stages.length - 1 && <div className="etm-thread-arrow">→</div>}
            </React.Fragment>
          ))}
        </div>
      </section>

      <div className="etm-two-col">
        <section className="etm-panel">
          <div className="etm-section-kicker">A · SOURCE FACTS</div>
          <h3>Controlled evidence feeding Catering</h3>
          <div className="etm-source-list">
            {CATERING.sources.map((src) => (
              <div className="etm-source-row" key={src.code}>
                <span className="etm-class a">A</span>
                <div>
                  <strong>{src.code} <em>{src.rev}</em></strong>
                  <small>{src.title}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="etm-panel">
          <div className="etm-section-kicker">REQUIREMENT / CONSTRAINT</div>
          <h3>What the engineering must prove</h3>
          <div className="etm-requirement-grid">
            {CATERING.requirements.map((req) => (
              <div className="etm-requirement-card" key={req.label}>
                <small>{req.label}</small>
                <strong>{req.value}</strong>
                <span>{req.state}</span>
              </div>
            ))}
          </div>
          <div className="etm-interface-box">
            <small>TIE-IN / INTERFACE</small>
            <div>{CATERING.interfaces.map((x) => <span key={x}>{x}</span>)}</div>
          </div>
        </section>
      </div>

      <section className="etm-panel">
        <div className="etm-section-kicker">HISTORICAL DESIGN → CURRENT ENGINEERING</div>
        <h3>What we know now — and what it means</h3>
        <div className="etm-result-grid">
          <ResultCard label="Historical device baseline" value="8 speakers" detail={CATERING.historical.tags} cls="A" />
          <ResultCard label="Legacy remote node" value={CATERING.historical.remoteNode} detail={`Tie to ${CATERING.historical.mainNode}`} cls="A" />
          <ResultCard label="Candidate full-tap load" value="64 W" detail="8 historical tags × 8 W candidate tap" cls="B" />
          <ResultCard label="Allowed amp load" value="240 W" detail="300 W × 80% project loading rule" cls="B" />
          <ResultCard label="Active amp by capacity" value="1 × 300 W" detail="Capacity screen only; final topology still open" cls="B" />
          <ResultCard label="Required speaker quantity" value="TBC" detail="Coverage / noise study controls final quantity" cls="C" />
        </div>
      </section>

      <section className="etm-panel">
        <div className="etm-panel-head">
          <div>
            <div className="etm-section-kicker">RELEASE GATE</div>
            <h3>อะไรยังขาดก่อนที่เราจะได้ Final MTO / Final Cost</h3>
          </div>
          <StatusPill status="NOT READY" />
        </div>
        <div className="etm-blocker-grid">
          {CATERING.blockers.map((item) => (
            <div className="etm-blocker" key={item.title}>
              <span>!</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
                <small>{item.impact}</small>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProofView() {
  return (
    <section className="etm-panel">
      <div className="etm-panel-head">
        <div>
          <div className="etm-section-kicker">12.7.3 · ENGINEERING PROOF</div>
          <h2>CAL / SDY / RPT — not one document type</h2>
          <p>Each proof object has its own inputs, equation / method, result and release status.</p>
        </div>
        <StatusPill status="5 PROOF OBJECTS" />
      </div>

      <div className="etm-proof-grid">
        {PROOFS.map((proof) => (
          <article className="etm-proof-card" key={proof.id}>
            <div className="etm-proof-top">
              <span className={`etm-proof-type ${proof.type.toLowerCase()}`}>{proof.type}</span>
              <StatusPill status={proof.status} small />
            </div>
            <h3>{proof.name}</h3>
            <code>{proof.id}</code>
            <dl>
              <div><dt>Formula / method</dt><dd>{proof.formula}</dd></div>
              <div><dt>Input</dt><dd>{proof.inputs}</dd></div>
              <div><dt>Current output</dt><dd>{proof.output}</dd></div>
            </dl>
          </article>
        ))}
      </div>

      <div className="etm-rpt-flow">
        <div><strong>CAL</strong><span>Atomic numeric proof</span></div>
        <b>+</b>
        <div><strong>SDY</strong><span>Study / simulation / optimization</span></div>
        <b>→</b>
        <div className="emphasis"><strong>RPT-0005</strong><span>Controlled project conclusion</span></div>
        <b>→</b>
        <div><strong>MTO</strong><span>Released only after proof closes</span></div>
      </div>
    </section>
  );
}

function MtoView() {
  return (
    <div className="etm-content-stack">
      <section className="etm-panel">
        <div className="etm-panel-head">
          <div>
            <div className="etm-section-kicker">12.7.4 · REQUIRED MTO / VENDOR</div>
            <h2>Required MTO → Vendor Offered → Gap</h2>
            <p>Vendor BOM never becomes the requirement. Required quantity must come from controlled engineering proof.</p>
          </div>
          <StatusPill status="RECONCILIATION PARTIAL" />
        </div>

        <div className="etm-table-wrap">
          <table className="etm-data-table">
            <thead>
              <tr>
                <th>Engineering object</th>
                <th>Required</th>
                <th>Historical / source basis</th>
                <th>Vendor offered / candidate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {MTO_ROWS.map((row) => (
                <tr key={row.object}>
                  <td><strong>{row.object}</strong></td>
                  <td>{row.required}</td>
                  <td>{row.baseline}</td>
                  <td>{row.vendor}</td>
                  <td><StatusPill status={row.state} small /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="etm-three-col">
        <InfoPanel kicker="REQUIRED" title="Engineering truth" text="Derived from Requirement → CAL / SDY → RPT. This is the procurement basis." />
        <InfoPanel kicker="OFFERED" title="Supplier truth" text="INDUSTRONIC BOM, datasheet, deviation and proposed architecture." />
        <InfoPanel kicker="TBE" title="Technical acceptability" text="Comply / Clarify / Deviation / Not Comply + capability, regulatory and lifecycle responsibility." />
      </div>
    </div>
  );
}

function VdrlView() {
  return (
    <div className="etm-two-col etm-align-start">
      <section className="etm-panel">
        <div className="etm-section-kicker">VDRL / DOCUMENT ENGINE</div>
        <h2>RPT-0005 Evidence Package</h2>
        <p className="etm-muted">The document is generated from database objects, calculations, tables, figures and images — not maintained as an isolated Word file.</p>
        <div className="etm-package-list">
          {RPT_PACKAGE.map(([type, name, state], idx) => (
            <div className="etm-package-row" key={name}>
              <span className="etm-package-no">{String(idx + 1).padStart(2, "0")}</span>
              <div>
                <small>{type}</small>
                <strong>{name}</strong>
              </div>
              <StatusPill status={state} small />
            </div>
          ))}
        </div>
      </section>

      <div className="etm-content-stack">
        <section className="etm-panel">
          <div className="etm-section-kicker">DOCUMENT CONTENT BLOCKS</div>
          <h3>PTTEP template-ready output</h3>
          <div className="etm-token-grid">
            {["Cover / Header / Footer", "Revision History", "Text", "Calculation Table", "Chart", "Coverage Image", "Drawing", "Source Citation", "Appendix"].map((x) => <span key={x}>{x}</span>)}
          </div>
          <div className="etm-export-row">
            <button type="button">DOCX</button>
            <button type="button">XLSX</button>
            <button type="button">PDF</button>
          </div>
          <small className="etm-muted">Export actions are UI placeholders until the document API is connected.</small>
        </section>

        <section className="etm-panel">
          <div className="etm-section-kicker">WORK / MANHOUR ENGINE</div>
          <h3>Every deliverable is also a workload driver</h3>
          <div className="etm-equation">MH = Q × UMH</div>
          <div className="etm-equation secondary">MH_doc = MH_base + Review Cycles × MH_revision + MH_final</div>
          <div className="etm-role-list">
            {["Lead Telecom Engineer", "System Engineer", "CAD / Designer", "Document Controller", "QA/QC", "Project Manager"].map((x) => <span key={x}>{x}</span>)}
          </div>
          <p className="etm-muted">Rates and UMH remain TBC until controlled estimating inputs are approved.</p>
        </section>
      </div>
    </div>
  );
}

function LifecycleView() {
  return (
    <div className="etm-content-stack">
      <section className="etm-panel">
        <div className="etm-section-kicker">PROJECT LIFECYCLE / EXECUTION & ACCEPTANCE</div>
        <h2>Engineering does not stop at MTO</h2>
        <div className="etm-lifecycle-line">
          {LIFECYCLE.map((x, idx) => (
            <React.Fragment key={x}>
              <div className="etm-life-step"><span>{String(idx + 1).padStart(2, "0")}</span><strong>{x}</strong></div>
              {idx < LIFECYCLE.length - 1 && <b>›</b>}
            </React.Fragment>
          ))}
        </div>
      </section>

      <div className="etm-two-col etm-align-start">
        <section className="etm-panel">
          <div className="etm-section-kicker">SPARES / TOOLS</div>
          <h3>Commercially separate quantity bases</h3>
          <div className="etm-token-grid">
            {["Start-up Spares", "Commissioning Spares", "Operational Spares", "2-Year Spares", "Capital / Insurance", "Special Tools", "Consumables"].map((x) => <span key={x}>{x}</span>)}
          </div>
          <p className="etm-muted">Each spare class carries its own quantity basis, responsibility, lifecycle stage and cost state.</p>
        </section>

        <section className="etm-panel">
          <div className="etm-section-kicker">TOTAL PROJECT COST MODEL</div>
          <h3>TBC is visible — never treated as zero</h3>
          <div className="etm-cost-grid">
            {COST_BUCKETS.map((x) => (
              <div key={x}><span>{x}</span><strong>TBC</strong></div>
            ))}
          </div>
          <div className="etm-cost-formula">
            Project Cost = Σ Material + Σ Work/MH + Σ Lifecycle Services + Σ Spares + Σ Risk
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, detail, tone }) {
  return (
    <div className={`etm-summary-card ${tone || ""}`}>
      <small>{label}</small>
      <strong>{value}</strong>
      <span>{detail}</span>
    </div>
  );
}

function ResultCard({ label, value, detail, cls }) {
  return (
    <div className="etm-result-card">
      <div className={`etm-class ${String(cls).toLowerCase()}`}>{cls}</div>
      <small>{label}</small>
      <strong>{value}</strong>
      <span>{detail}</span>
    </div>
  );
}

function StatusPill({ status, small = false }) {
  const raw = String(status || "TBC");
  const normalized = raw.toLowerCase();
  let tone = "neutral";
  if (normalized.includes("pass") || normalized.includes("match") || normalized.includes("ready")) tone = "good";
  if (normalized.includes("open") || normalized.includes("partial") || normalized.includes("prelim") || normalized.includes("baseline")) tone = "warn";
  if (normalized.includes("block") || normalized.includes("not ready") || normalized.includes("not released") || normalized.includes("missing")) tone = "bad";
  return <span className={`etm-pill ${tone} ${small ? "small" : ""}`}>{raw}</span>;
}

function InfoPanel({ kicker, title, text }) {
  return (
    <section className="etm-panel etm-info-panel">
      <div className="etm-section-kicker">{kicker}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </section>
  );
}

