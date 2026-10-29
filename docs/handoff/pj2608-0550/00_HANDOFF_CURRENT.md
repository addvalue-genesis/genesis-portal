> **Selected AVL deviation, 29-Oct-2026:** Read
> [Selected PAGA AVL deviation](20261029_SELECTED_AVL_DEVIATION.md) for UI
> `2026-10-29.3-preview`. The existing register now prepares and saves the selected
> INDUSTRONIC draft with source/offer lineage, preserves user records and separates
> request progress from customer acceptance. MASTER TOWER is not automatically
> treated as an AVL deviation. Same branch; financial inputs and Release HOLD remain.

> **AVL update, 29-Oct-2026:** Read
> [Sub-vendor source reference](20261029_AVL_SUBVENDOR_REFERENCE.md) for UI
> `2026-10-29.2-preview`. The existing `bid.deviations.avl` now shows the supplied
> vendor-prepared list with 10 original rows / 5 grouped declarations, draft
> preparation and approval-evidence separation. Models/applicability/AVL approval
> remain OPEN. Same review branch and preserved financial inputs.

> **Current implementation, 29-Oct-2026:** Read
> [Working Preview 1–8 / Particular / AVL–Deviation](20261029_WORKING_PREVIEW_1_TO_8.md)
> first. Same review branch, UI `2026-10-29.1-preview`. New workspace controls,
> source-to-proof mapping, document reading ledger and deviation gates are
> implemented and tested. Actual project-wide source review and engineering proof
> are still OPEN; Release remains HOLD. Earlier checkpoints below are historical.

> **Current correction, 28-Oct-2026:** Read
> [MR work process and inherited bases](20261028_WORK_PROCESS_DEFAULTS.md).
> UI `.4-preview` on the same Official Working review branch, draft PR #53.
> This applies the current chat's process order and reuse of 01–08 bases to the
> earlier handoff. Stable IDs and frozen prices remain unchanged. Actual customer
> prices and user installation are not verified; release remains HOLD.

> **Earlier new-chat checkpoint, 28-Oct-2026:** Read
> [PJ2608-0550 detailed handoff](PJ2608-0550_NEW_CHAT_HANDOFF_20261028.md) first.
> Review branch `feat/pj2608-0550-official-working-20261028`, UI `.3-preview`,
> application commit `eb8dda6b`; 15 browser checks passed. User installation of
> `.3-preview` and actual Official prices remain unverified. PR #53 is Draft;
> latest GitHub check reports `mergeable=false / dirty`, not merged. Older branch,
> intake and mergeability checkpoints below are historical, not current runtime state.

> **Hub checkpoint, 27-Oct-2026:** The unified launch branch is
> `feat/genesis-project-hub-20261027` with 0550 source `ec436381`.
> See `docs/project-hub-20261027.md`; Windows folder `genesis-project-hub`,
> URL `http://localhost:3001/`. The older branch instructions below describe
> historical standalone work, not the current multi-project launch target.

# PJ2608-0550 Living Handoff / Current Checkpoint

**Official working update (isolated branch, not deployed):** [Official Tender review and customer form](20261028_OFFICIAL_WORKING.md). HIS-01 / RFQ-02 / OFF-03 / REL-04 separate historical output, current evidence, reviewed working prices and customer draft. No historical price fallback; final issue remains HOLD.

**Data separation audit:** [2026-10-27 hardcode findings and migration](20261027_HARDCODE_AUDIT.md). Project reference registries now live in validated JSON; existing prices/evidence states are preserved, missing amounts are not zero, and the issued XLSX retains exact byte parity. Current inputs remain separate workspace data. Historical UI copy/configuration still contains documented literals; do not claim the whole app is hardcode-free.

**Current source inventory checkpoint:** [2026-10-27 private GDrive/Gmail source intake and first-versus-Official package comparison](20261027_SOURCE_INTAKE.md). Use the existing controlled-source-inventory module and private batch Rev02. Its package table preserves the five reviewed folder locations, intermediate issue, archive members and same-revision replacement separately. Document-number comparison separates current EPC, earlier package copies and cover revision history; never select a revision by alphabet or upload date. Reviewed private data loads from Google Drive for Desktop through the local development bridge; manual import is a fallback. Restart the dev server after pulling this change. This does not change frozen pricing or authorize release. Active review URL uses port 3001; follow the latest workflow checkpoint rather than the historical port below.

**Latest software checkpoint:** [2026-10-27 active Bidding workflow](20261027_BIDDING_WORKFLOW.md). The baseline narrative below remains historical authority for its snapshot; current bid preparation now has saved inputs and a Working → THB → USD workflow.

**Project:** PJ2608-0550 — SAMTEL / PTTEPI Myanmar ASK Telecom [MMC24-5002]  
**Working branch:** `feat/pj2608-0550-tpp-ui-rev04`  
**PR:** #2 — DO NOT MERGE without explicit approval  
**Method:** First Principles + Telecom Constraint-Based Engineering + Parametric Cost Model  
**Purpose:** Continuity checkpoint for a new ChatGPT/Claude/Grok/Antigravity session. This file is a navigation layer, not a substitute for the code/data sources listed below.

## 1. Non-negotiable operating rules

1. Work on PJ2608-0550 only unless explicitly instructed otherwise.
2. Preserve knowledge, evidence and decision history; architecture/implementation may evolve.
3. Source fact, derived result, assumption/TBC, conflict and model logic are different information classes.
4. TBC / OPEN / missing evidence must never silently become zero.
5. Never back-solve or invent allocations to force a parent total to reconcile.
6. Every material cost must be traceable as far as available through:
   `Source → Requirement → Constraint → Proof → Work/Physical Object → Driver → Qty/MH/MD → Rate/Unit Price → Cost → Commercial Layer → Risk/Confidence`.
7. COMMON/GENERIC knowledge is reused; project-specific facts are bound in the PARTICULAR layer.
8. Frozen externally issued snapshots are immutable.
9. Audit/breakdown/trace information should render as readable grid tables with visible borders.
10. Original source detail must not be summarized away when it is available.

## 2. Read these files before making changes

| Order | File | Why |
|---:|---|---|
| 1 | `frontend/src/project0550/architectureManifest.js` | Governing architecture/evolution policy |
| 2 | `frontend/src/project0550/moduleRegistry.js` | Module purpose, lifecycle, invariants |
| 3 | `frontend/src/project0550/projectFacts.js` | Structured project/stakeholder/scope/milestone/clarification facts |
| 4 | `frontend/src/project0550/data/snapshots/pj2608-0550.rev07.json` | Active controlled project dataset |
| 5 | `frontend/src/project0550/serviceEquationModel.js` | B/C service equations and derivation logic |
| 6 | `frontend/src/project0550/b1CostLineage.js` | B1 audit/reconciliation state |
| 7 | `frontend/src/knowledge-kernels/library.js` | COMMON engineering/economic kernels |
| 8 | `frontend/src/project0550/knowledgeKernelBinding.js` | 19-system project binding to common kernels |
| 9 | `frontend/src/knowledge-kernels/regulatoryMyanmar.js` | Reusable Myanmar regulatory/import knowledge |
| 10 | `frontend/src/project0550/regulatoryBinding.js` | 0550-specific regulatory/logistics binding |
| 11 | `frontend/src/pages/PJ26080550.jsx` | Current UI and drill-down behaviour |
| 12 | `frontend/src/project0550/data.js` | Stable facade used by UI |

## 3. Current architecture

`COMMON Knowledge → GENERIC DOMAIN → PARTICULAR PROJECT → Evidence/Requirement → Engineering Proof → Quantity/MTO → Execution → Cost/Risk → Budgetary/Release`

COMMON/GENERIC stores reusable laws, equations, domain knowledge and Myanmar regulatory knowledge. PARTICULAR 0550 stores MR/PHI/BOD/SPE/TC facts, vendor quotations, 19-system bindings, project decisions and cost/release states.

## 4. 19 internal systems

1 Network/LAN; 2 Video Conference; 3 VSAT C-band; 4 Ku Internet; 5 PABX/IP telephony; 6 Hazardous-area telephone; 7 PAGA; 8 CCTV; 9 VHF DMR trunked radio; 10 Marine VHF; 11 Aeronautical VHF; 12 MF/HF SSB; 13 Microwave + WBB; 14 Entertainment; 15 Fiber optic; 16 Telecom towers; 17 Meteorological; 18 NDB; 19 AIS.

Customer Part-A form has 15 lines; internal 19→15 mapping is retained.

## 5. Locked/working vendor basis

| System | Working basis |
|---|---|
| LAN | CISCO |
| Firewall/cyber | PALO ALTO |
| VSAT / Ku | THAICOM |
| PABX | AVAYA |
| PAGA | INDUSTRONIC |
| CCTV | HIKVISION |
| DMR trunked | MOTOROLA |
| Microwave | CERAGON |
| Tower | MASTER TOWER COMPANY |
| MET | VAISALA |
| NDB | NAUTEL via SDA Thailand |
| Fiber | Brand intentionally open; AVL/compliant O&G-grade |

Marine/Aero/MF-HF Jason quotation is a partial anchor only. VCS/Entertainment/AIS remain vendor-open/partial.

## 6. Budget/control status

Frozen externally issued SAMTEL budgetary snapshot is immutable history.

### B1 critical audit state

- Current Rev10 B1 control allowance = **THB 24.000M**
- Latest fully traceable recovered bottom-up model found = **THB 11.155029M**
- Unreconciled difference = **THB 12.844971M**
- Rule: **do not fabricate sub-lines to make 24M reconcile**.

Recovered groups: 19-System Engineering/CAL-RPT/MTO; Cross-System Interface Engineering; VDRL lifecycle; Common PM/Vendor/Regulatory/Tower design.

## 7. Service equation model

- `MH = I × Q × UMH × Factor`
- `MH_doc = Q_doc × (H_initial + N_cycles × H_cycle + H_final)`
- `MH_PM = Months × FTE × H_month`
- Interface = unique edge × UMH × factor; no N² duplication
- `MD = Events × Days × Crew`; attendance MH = MD × hours/day
- `C_labor = Σ(MH_paid × cost_rate)`
- Trip cost = airfare + hotel + per diem + local transport + permits + insurance + other
- Service cost = labor + trip + OEM + test + other
- Training = sessions × days × trainers × h/day + prep + closeout
- FX uses controlled date/source only
- Installation labor uses installed activity quantity, not purchase/spare quantity

## 8. PAGA source truth

Selected vendor INDUSTRONIC, offer A20261632, final vendor offer **EUR 226,454.05**. Commercial basis: FCA Wertheim/Germany, advance payment, approx. 6 months after order/details cleared, 12-month warranty after despatch.

Do not treat current PAGA internal allowance as a direct EUR→THB/USD conversion. Engineering/logistics/SAT/spares/UPS/monitoring gaps remain separate.

## 9. Project facts/evidence rules

- COMPANY = PTTEP Myanmar Asset (PTTEPI)
- CONTRACTOR = CNEEC
- BIDDER/TSI = SAMART TELCOMS + ADD VALUE SYSTEM
- MOGE = importer/state-entity context where supported
- CPECC = coordination/engineering context; do not promote to legal Main EPC consortium role without controlling source

Accepted clarification examples include C1 optional physical construction with retained TSI materials/specialist work, TSI permit responsibility with Company/Contractor support, USD/6-month validity/no fixed FX, 24-month PAC→FAC warranty, Yangon/Ranong logistics split, and accepted 4-set VCS quantity.

## 10. Myanmar regulatory/import knowledge

Reusable country knowledge is stored separately from project facts. Project source `10015-WIS-LOG-MM0001-R03` supports telecom import lead time 4–5 months, MOTC prior approval, MOC sequence, applicable duty/tax exemption timing, FaFE, radio licence/frequency, DCA approval for NDB/air-band, and no hand-carry of communications equipment other than personal mobiles.

User-researched fee/tariff figures stay `USER_RESEARCH / UNVERIFIED` until authoritative source validation.

## 11. UI status

Route: `http://localhost:3000/projects/pj2608-0550`

Tabs: Executive; Architecture; 19 Systems; First Principles; Execution; Budget; Risk & Controls; Evidence.

Budget has expandable Part A/B/C detail, PAGA source detail and B1 reconciliation. Evidence has structured stakeholder/location/milestone/clarification/commercial/submission/source tables.

## 12. Data/storage direction

Current: `JSON/JS structured registries → repository/facade → UI`

Target: `AGERP / SQL + versioned evidence store → repository/API → UI`

Migration must preserve IDs, evidence state, source locator, revision and replacement trigger.

## 13. Recent important commits

- `208c6be8...` export PROJECT_0550_FACTS from facade
- `d8d7300b...` Evidence UI tables
- `2ffbd72d...` fact/evidence/scope invariants
- `4b524997...` project facts refactor
- `5f8b8c80...` regulatory module registry
- `d3cc8bbb...` expose regulatory knowledge/binding
- `ef7b0bc8...` project regulatory binding
- `b42f02ba...` common Myanmar regulatory registry
- `14a0a524...` B1 grouped reconciliation UI
- `58f62b5b...` expose B1 lineage
- `549eacfe...` corrected B1 recovered groups
- `dd962599...` derivation/equation tables
- `1735be00...` recovered service equation model
- `2084a9b0...` PAGA quotation/evidence UI
- `e1a0b43c...` PAGA commercial source ingestion

## 14. Open gaps / next engineering work

1. Complete B1 resource-loaded model or formally revise the 24M control allowance.
2. Ingest detailed recovered Engineering/Events/Trips work-object rows into runtime data.
3. Continue requirement completeness beyond TEL-LAN; other 18 systems remain incompletely audited.
4. Verify user-researched Myanmar fee/tariff figures against authoritative sources.
5. Attach exact primary-source locators to milestones currently supported only by controlled summary.
6. Keep B7/B8/B9 internal analytical layers distinct even where customer emergency form aggregates them.
7. Do not merge PR #2 without explicit instruction.

## 15. Next chat recommended task

Deploy secure STAGING for mobile/iPad review.

Preferred: `GitHub branch → Cloudflare Pages → Cloudflare Access → private STAGING URL`.

Requirements: do not expose internal pricing/vendor/evidence publicly; mark STAGING INTERNAL WORKING / NOT CUSTOMER RELEASE; preserve LOCAL/STAGING/RELEASED separation; do not merge PR #2 merely to deploy staging unless explicitly approved.

Use `11_NEW_CHAT_RESUME_PROMPT.md` as the starting prompt.
