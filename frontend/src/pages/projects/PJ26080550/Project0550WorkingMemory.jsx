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
  syncRevision: "SYNC-20261007-21",
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
    presentationLayerRule: "UI presentation may change without changing the controlled engineering/commercial model. Current prototype defaults to Hierarchical Outline / Group View with +/- expand-collapse; Detailed Tabs remain available as fallback. Both consume the same trace, evidence, DB/JSON state, equations and output contracts.",
    digitalThreadRule: "Canonical execution authority = Project0550EngineeringDoctrine.fullChain. First Principles: SOURCE/EVIDENCE -> REQUIREMENT -> FUNDAMENTAL NEED. Constraint-Based Engineering: CONSTRAINT -> INTERFACE/CONTEXT -> ENGINEERING INPUT -> CAL/STUDY/RPT -> PROOF -> ARCHITECTURE -> PHYSICAL OBJECT -> QUANTITY DRIVER -> REQUIRED MTO -> BULK -> VENDOR RECONCILIATION. Parametric Cost/Lifecycle: WORK/RESOURCE -> DOCUMENT/VDRL/QA -> FAT/IFAT -> LOGISTICS/REGULATORY -> SITE READINESS -> INSTALL/PRECOM -> SAT/INTEGRATION/COMMISSIONING -> HANDOVER/WARRANTY -> COST/SCHEDULE/RISK -> COMMERCIAL TREATMENT -> RELEASE. UI groups may collapse these stages but may not change dependency order.",
    commercialAnalyticsRule: "Commercial visualization is presentation only and must reuse controlled price/cost state. The 19 engineering systems roll into 15 ASK-TSI A1 commercial groups; composite lines must remain explicitly composite until a defensible allocation driver exists. Graphs must distinguish source cost, controlled/budgetary sell, commercial uplift and OPEN/TBC cost.",
    pagaPilotAnalytics: "PAGA pilot now binds direct service/labor rows from Rev04 05_Service_Parametric + 07_VDRL: 432.5 direct MH, THB 259,450 internal direct labor cost, THB 937,078.55 base service sell before shared/common allocation. Shared survey/common pools and OEM site attendance remain separate until causally allocated/quoted.",
    singleSourceModuleRule: "No module owns independent project truth. 1.0 is overview projection; 2.0 writes approved commercial policy only; 3.0 is reusable method/equation engine; 4.0 is orchestrator/control; 5.0/6.0 are controlled projections/disposition views. True downstream output modules are 7.0/8.0/9.0/10.0, with 8.0/9.0 carrying their own closure/revision workflow while still linked to originating canonical requirements. Graphs/charts are projections only.",
    revisionPropagationRule: "A source revision (e.g. MR revision) is registered as a new document revision with supersession; create change event; traverse existing etm_trace_edges; mark affected requirement/proof/MTO/work/VDRL/cost/commercial/output objects REVIEW/RECALCULATE/REGENERATE/STALE; preserve history; issue a new output revision only after revalidation. No silent overwrite and no manual independent module refresh.",
    internalAnalysisRule: "7.1 Internal Cost / Commercial Analysis is a projection only. Default line view shows Source Cost / Internal Cost / Working Sell / Released Sell separately across the 15 commercial groups mapped to 19 engineering systems. Cost, vendor bindings, conditions and price layers come from canonical DB when live; fallback is a labelled controlled snapshot only. Composite system allocation stays OPEN until a causal driver exists. Graphs reuse the same canonical state and persist no independent commercial truth.",
    partABAllocationRule: "ASK-TSI Part A may contain selected vendor/OEM package cost including vendor labor/service if management keeps that service inside the vendor package. ADDVALUE labor/professional work must not be buried in A1 and normally maps to Part B/C. A vendor service may alternatively be exposed separately in B/C, but one service cost may exist in only one customer-price location. Complementary roles are separate work objects, e.g. OEM executes FAT while ADDVALUE leads/witnesses/close-outs.",
    pagaLifecycleResponsibility: "A20261632 explicitly quotes INDUSTRONIC FAT at Wertheim, Germany: 3 days × EUR 1,020/day = EUR 3,060, OEM executes FAT/TPI and up to 3 purchaser/end-user persons may attend; purchaser/end-user travel/accommodation are excluded. No site service rate is quoted. The offer states commissioning should be performed by INDUSTRONIC authorised personnel and independent commissioning may affect warranty. Current pilot therefore uses HYBRID FAT (OEM execute + ADDVALUE lead/witness/travel/closeout), ADDVALUE retained Pre-Com/SAT, and keeps OEM-authorised site commissioning as a separate TBC/quote/authorisation gate.",
    serviceBulkArchitecture: "Part B is derived from source-backed lifecycle/service obligations, not a standalone labor table. B1-B9 use MR/PHI/BOD/SPE/STD/Contract/TC/vendor evidence according to domain. Bulk is modeled now as a canonical required-MTO/material class: system-dedicated bulk remains attached to the system; shared/common bulk remains a common pool until causal allocation. Commercially, system bulk normally rolls into the applicable A1 line because the customer form expects bulk materials with the system package, while installation labor maps C1, logistics B2, startup spares B5, tools B6, capital spares C2 and 2Y operating spares C3. No /19 allocation by default.",
    allSystemScopeTaxonomyRule: "The ordered scope hierarchy is COMMON/GENERIC for all 19 telecom systems, not PAGA-specific: 01 Main Equipment/Vendor Package; 02 Bulk/Material; 03 System Completion/Accessories/Options; 04 Engineering/CAL/SDY/RPT/VDRL; 05 Logistics; 06 Training; 07 FAT/IFAT/Field Assistance/Pre-Com/SAT/Commissioning; 08 Start-up/Commissioning Spares; 09 Special Tools; 10 Survey; 11 Permit/Licence/Regulatory; 12 Insurance/Risk Transfer; 13 Installation Construction; 14 10Y Capital Spares; 15 2Y Operation Spares; 16 Shared/Common Allocation Pool; 17 Cost/Commercial Summary. Every system uses the same x.1-x.7 submodule pattern and table presentation; only canonical data bindings differ by system.",
    tablePresentationRule: "Default management/engineering presentation is ruled table/line view with stable columns and +/- drilldown. Cards/graphs are secondary visualisations only. Table grouping must follow the common system taxonomy so users can see what heading each object belongs to and avoid missing scope.",
    pagaBulkPilot: "PAGA Bulk Pilot Rev00 is now bound as B01-B24. B01-B22 are material/accessory source rows; no source reference quantity is treated as released order quantity. Canonical DB seed stores reference quantities only in metadata and leaves required_qty NULL until proof/topology releases them. B23 VDRL/SDRL gap service is reclassified to B1; B24 onshore installation/SAT/commissioning is split by work object between B4 and C1. 7.1 displays the same bulk objects as expandable lines and prefers LIVE DB bulk-state when available.",
    engineeringTableViewRule: "PAGA engineering trace presentation defaults to ruled line tables. Canonical 25-stage chain, source set, requirement threads, particular equations and downstream outputs all render from the existing digital-thread objects. Requirement rows support +/- expansion into a stable two-column subtable of Source -> Fundamental Need -> Constraint/Context -> Engineering Input -> CAL/Study/RPT -> Architecture/Object/Qty -> Equation/Driver. Vendor Offer, Required-vs-Offered and Cost/Selling-Price outline sections reuse the same ruled table components as Detailed Tabs, with numeric columns right-aligned and fixed widths. Obsolete card/bar analytics were removed from the price form. This is presentation-only; doctrine, DB/JSON state and calculation dependencies are unchanged.",
    canonicalIntelligenceArchitecture: "Requirement Thread is a PARTICULAR project instance, not a copy of MAIN/COMMON/GENERIC method. Canonical equations live in etm_equation_registry and are bound via etm_equation_bindings. SmartControl findings generate internal-first resolution jobs; external standards/OEM/research are searched only when current project/company/vendor evidence is insufficient, and proposals require human review before controlled-state mutation.",
    vendorOfferArchitecture: "Vendor quotation remains a whole source offer in etm_vendor_offers + etm_vendor_offer_items. Multi-system use is expressed through etm_vendor_offer_item_bindings; commercial/technical terms are first-class etm_vendor_offer_conditions with cost/schedule/risk/warranty impact states. System views filter bindings; they do not copy or redefine the quote.",
    pricingLayerArchitecture: "Every commercial line has four semantic layers: SOURCE_COST -> INTERNAL_COST -> WORKING_SELL -> RELEASED_SELL. 7.1 Internal Cost / Commercial Analysis may show all four. 7.0 ASK-TSI has two UI modes over the same state: Working Preview shows current controlled working prices for internal form review, while Released Customer Output consumes AUTHORISED RELEASED_SELL only. Customer export remains released-sell-only; unreleased lines remain HOLD/TBC and must never be filled from source cost or working sell.",
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
    "Project0550CommercialModel.js",
    "Project0550CommercialAllocationPolicy.js",
    "Project0550PricingLayerModel.js",
    "Project0550GapResolutionEngine.js",
    "Project0550LifecycleExecutionModel.js",
    "Project0550ServiceBulkPolicy.js",
    "Project0550SystemScopeTaxonomy.js",
    "Project0550PagaBulkModel.js",
    "Project0550ModuleContract.js",
    "Project0550RevisionImpactModel.js",
    "Project0550PagaDigitalThread.js",
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
