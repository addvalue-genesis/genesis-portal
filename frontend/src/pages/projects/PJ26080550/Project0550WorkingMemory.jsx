/*
PJ2608-0550 — TEAM WORKING MEMORY / READ FIRST

Purpose
-------
This JSX is the durable working-memory entry point for the team.
Before developing PJ2608-0550, read this file plus the current module JSX,
Engineering Doctrine, Smart Control Engine and controlled state/data.

Team rule
---------
READ CURRENT CODE/STATE
→ READ 0550 SOURCES
→ ANALYZE / ENGINEER TOGETHER
→ AGREE THE NEW WORKING DECISION
→ SYNC THE DECISION INTO JSX/JS/JSON
→ VALIDATE / BUILD
→ COMMIT TO THE FEATURE BRANCH

A material conclusion that remains only in chat is NOT CLOSED.

Governing method
----------------
First Principles
+ Telecom Constraint-Based Engineering
+ Parametric Cost Model

Data architecture
-----------------
User/team works through JSX/React.
Behind JSX, MariaDB and JSON work together:
- MariaDB = deterministic system of record, relationships, revision/history, actuals.
- JSON = API/snapshot/import-export/exchange/offline/AI-readable state.
- GDrive/Excel/RFQ/Vendor docs = upstream evidence, not browser truth.
The UI should hide this plumbing from normal project work.

Important
---------
The governing method is executable logic, not explanatory text.
Code must evaluate source/evidence, constraints, proof gates, quantity drivers,
vendor reconciliation, lifecycle work, cost completeness and release readiness.
*/

import React from "react";

export const PROJECT0550_TEAM_WORKING_MEMORY = {
  projectCode: "PJ2608-0550",
  projectName: "SAM PTTEPI MY ASK TEL [MMC24-5002]",
  baseline: "CURRENT 0550 CONTROLLED WORKING BASELINE",
  syncRevision: "SYNC-20261007-03",
  governingMethod: "First Principles + Telecom Constraint-Based Engineering + Parametric Cost Model",
  closeRule: "MATERIAL CHAT CONCLUSION NOT SYNCED TO CONTROLLED CODE/STATE => NOT CLOSED",
  currentPricingControl: {
    baseline: "REV07 controlled pricing state in Project0550PricingBaseline.js",
    cctvControl: "A1-06 current known 55-camera market-sanity basis; superseded 24-Ex-PTZ proxy must not return",
    vendorEvidenceRule: "New vendor evidence updates the controlled JS/JSX state first; do not regenerate outputs from an older workbook revision.",
    priceLayerRule: "Vendor Offer = source/procurement cost AS QUOTED. Price Build-up must show required additions/completion and commercial transformation separately. An indicative sell may be shown only with an explicit scope limitation; final customer sell remains HOLD until all required cost/release gates are closed.",
    pagaSellControl: "Known selected PAGA cost EUR 231,678.05. Working goods commercial preview = cost ×1.20/0.95 = EUR 292,645.96 on known selected cost only. Final PAGA customer sell remains HOLD because bulk/logistics/site service/spares/compliance are still open.",
    partBControl: "B1-B9 restored from the existing controlled parametric model rather than the resource-continuity management overlay. B1/B3/B4 use service sell + SAMTEL 5%; B2/B5/B6 use goods/procured rule on known non-PAGA cost; B7/B8/B9 come from dedicated Survey / Permit / Insurance sheets. 24_Safe_Service_Pricing remains management protection and must not overwrite contractual B-line semantics.",
    fxControl: "GEQ-034 COMMON/GENERIC Controlled Currency Conversion: P_to = P_from × R_from,THB / R_to,THB. Cross-currency display uses Bank of Thailand FM_FX_001_S3 MID RATE from the controlled rate date/type. Current basis 06-Oct-2026: USD/THB 33.6643, EUR/THB 37.7629, CNY/THB 5.0217. Source/vendor currency remains authoritative; converted value is DERIVED working/reference only.",
    uiReadabilityControl: "PTTEP 10008-STD-6-GEN-003 was reviewed for document presentation; no explicit web/UI font-size rule was identified. 0550 UI therefore applies its controlled readability standard: trace body >=12.5px, tabs ~13px, equation chips >=11.5px, two-column engineering trace, and no micro-text to fit density.",
    currentPricedBreakdown: "PJ2608-0550_ASK-TSI_Priced-Breakdown_INTERNAL_Rev07_CODE-SYNC_20261006.xlsx · Drive file 1S-0tkA5AQ1eRp45RT0T-lNic7_On-_Mq",
    jasonQT2026160: "Maps to A1-08 Marine, A1-09 Aero, A1-10 SSB, A1-14 MET, A1-15 NDB and an AIS component inside composite A1-01; total source quote THB 3,507,650 excl. VAT."
  },
  teamReadOrder: [
    "Project0550WorkingMemory.jsx",
    "Project0550EngineeringDoctrine.js",
    "Project0550SmartControlEngine.js",
    "Project0550EvidenceMemory.json",
    "Project0550EvidenceReasoner.js",
    "Project0550PriceSourceModel.js",
    "Project0550PartBModel.js",
    "Project0550FxControl.js",
    "Project0550OutputContract.js",
    "current module .jsx",
    "controlled JSON / DB state",
    "0550 source evidence as needed"
  ],
  workflow: [
    "READ_CURRENT_CODE_STATE",
    "READ_0550_SOURCE_EVIDENCE",
    "ANALYZE_AND_ENGINEER_IN_CHAT",
    "AGREE_WORKING_DECISION",
    "SYNC_TO_JSX_JS_JSON",
    "VALIDATE_BUILD",
    "COMMIT_FEATURE_BRANCH",
    "REVIEW_BEFORE_MAIN"
  ],
  dataArchitecture: {
    userSurface: {
      technology: "React / JSX",
      role: "team working interface + current operational memory + workflow"
    },
    mariaDb: {
      role: "system of record + relationships + revision/history + actual data + calibration history",
      visibilityToUser: "normally hidden behind JSX/API"
    },
    json: {
      role: "controlled snapshot + API payload + import/export + offline/fallback + team/AI-readable state",
      relationshipToDb: "parallel representation / exchange, not a replacement for MariaDB"
    },
    sourceEvidence: {
      role: "GDrive / Excel / RFQ / MR / SPE / PHI / BOD / DWG / LIS / CAL / RPT / vendor evidence",
      rule: "source evidence feeds the controlled model; UI must not silently reinterpret missing data as zero"
    }
  },
  executionRule: {
    decorativeMethodTextOnly: false,
    requiredBehavior: [
      "read controlled project facts/state",
      "ingest new source evidence as structured assertions",
      "detect stale state / source conflict / superseded data before output",
      "apply First Principles",
      "evaluate technical and non-technical constraints",
      "require CAL/Study/RPT proof where applicable",
      "derive required objects/quantity/work",
      "reconcile vendor offer against required quantity",
      "propose controlled updates from new evidence without silent auto-apply",
      "run parametric workload/cost logic",
      "check lifecycle/regulatory/commercial gates",
      "return blocker/warning/readiness and required next action"
    ]
  },
  outputContracts: [
    {
      id: "ASK-TSI-PRICED-BREAKDOWN",
      sourceTemplate: "ASK-TSI Priced Breakdown List.xlsx",
      sourceSheet: "PriceBreakdown",
      sourceRange: "A1:H80",
      purpose: "Customer/internal price output form generated from controlled engineering/cost/commercial state",
      rule: "Do not make the form the source of engineering truth; generate/map it from the controlled model."
    }
  ],
  branchPolicy: {
    workingBranch: "feature/pj2608-0550-etm-rev0",
    main: "DO NOT MERGE UNTIL JACK REVIEWS",
    preservePreviousArchitecture: true
  }
};

export function Project0550WorkingMemoryPanel(){
  const m=PROJECT0550_TEAM_WORKING_MEMORY;
  return (
    <section className="bid-panel bid-highlight">
      <div className="bid-panel-head">
        <div>
          <small>TEAM WORKING MEMORY · {m.syncRevision}</small>
          <h2>คุย/วิเคราะห์จบ → Sync กลับเข้า controlled code/state ก่อนถือว่าปิดงาน</h2>
        </div>
        <span className="bid-chip">READ CURRENT CODE FIRST</span>
      </div>
      <p>
        Governing method: <strong>{m.governingMethod}</strong>. JSX เป็น working interface ของทีม;
        MariaDB + JSON ทำงานคู่กันอยู่เบื้องหลัง และ source evidence จาก GDrive/Excel/RFQ ใช้ป้อน model ตาม traceable controls.
      </p>
      <div className="bid-control-grid">
        <div><strong>1 · Read</strong><span>อ่าน current JSX / doctrine / state ก่อนเริ่มคิดต่อ</span></div>
        <div><strong>2 · Engineer</strong><span>อ่าน source แล้วคิดตาม First Principles + Constraints + Parametric Cost</span></div>
        <div><strong>3 · Sync</strong><span>ข้อสรุปใหม่ต้องถูก update กลับเข้า JSX/JS/JSON</span></div>
        <div><strong>4 · Validate</strong><span>Smart control ตรวจ blocker / warning / release readiness</span></div>
        <div><strong>5 · Commit</strong><span>เก็บ current working state ไว้บน feature branch</span></div>
        <div><strong>6 · Continue</strong><span>Chat/ทีมรอบถัดไปอ่าน code ล่าสุดแล้วทำต่อ ไม่เริ่มจากศูนย์</span></div>
      </div>
    </section>
  );
}
