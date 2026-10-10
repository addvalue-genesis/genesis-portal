# New Chat Resume Prompt — PJ2608-0553 (Living Handoff 2026-10-10)

Continue **PJ2608-0553 only**, using GitHub `addvalue-genesis/genesis-portal`, branch `feat/pj2608-0553-tpp-bid-handoff`. Do not use main or accidentally work on the `feat/pj2608-0550-tpp-ui-rev04` source branch. Do not merge/deploy/submit offers without explicit approval.

**READ FIRST**, in this order:
1. `docs/handoff/pj2608-0553/00_HANDOFF_CURRENT.md` — read the final **2026-10-10 Living Handoff Update** as controlling; earlier sections include stale initial status and remain historical.
2. `docs/handoff/pj2608-0553/12_MACHINE_STATE.json`.
3. `frontend/src/project0553/data/repository.js`, `data/adapters/controlledSnapshotAdapter.js`, `data/validateDataset.js`, `data/controlledSnapshot.js`, `data/snapshots/pj2608-0553.working.json`.
4. `frontend/src/project0553/data/snapshots/mto.rev04.summary.json`, `data/quotes/NG-260916-ADV-DAP1.full.json`, `data/supplierQuoteLines.js`, `vendorEvidence.js`.
5. `frontend/src/common/engineering/requiredOfferedReconciliation.js`, `frontend/src/project0553/data/scadaOfferReconciliation.js`, common engineering/cost methods, `CommercialSystemBreakdown.jsx`, `CommercialWorkspace.jsx`, `commercialWorkbookControl.js`, `data/rev08CommercialBaseline.js`, 0553 page and project/source registries.
6. For proven 0550 techniques, read `frontend/src/project0550/data/repository.js`, `data/adapters/controlledSnapshotAdapter.js`, `data/validateDataset.js`, `frontend/src/pages/PJ26080550.jsx` and its PAGA quote detail; reuse COMMON methodology/UI only, never PARTICULAR 0550 vendor/rate/quantity/FX.

**Mission:** finish evidence-backed 0553 MR0001–0004 requirement→physics/constraint→required BOM→vendor quote gap→parametric cost→customer selling price→6-sheet `4-Scope of Supply.xlsx`, with separately frozen historic SAMTEL issue and working JUTAL candidate. No unsupported pricing, phantom zero, compliance, licence or release.

**Current checkpoint:** 0553 route and Budget drilldown operational; full Next G 53-line quote is JSON and USD 191,610.15 reconciles; 4 MRs MTO Rev04 imported only as SUMMARY (not full line takeoff); required-vs-offered engine is registered but MR0001 required SKU quantities still OPEN; quote for Cisco partial; 2024 BARTEC/MTL references are not Z1F current quotes; SQL and AGERP adapter not connected; 0553 Rev08 base USD 1,684,901.16 is historical customer sell, not current cost. Most recent verified user build is code `73ffda7`, all validators PASS with only bundle-size warnings; current handoff commits are documentation changes and must be pulled/validated normally.

**NEXT TASK (urgent):** ingest complete MTO Rev04 item rows and map each to MR0001 link/site tags, BOM requirements, licence, enclosure, cable/connector/gland/surge/bulk and vendor items. Reconcile NG 53 lines and complete Cisco lines; then extend MR0002–0004. Only derive current Cost/Sell after verification and sourced FX. Produce clear table columns Required / Offered / Gap / Source / Proof / Unit Cost / Sell with +/− drilldown. Verify actual tender amendment/deadline; original ITB 08-Sep conflicts with reported 14-Oct deadline.

Run `git rev-parse HEAD`, `npm run build`, report exact commits/results. Preserve full technical detail in handoff, update machine state and handoff together after every major working change. Never claim a ZIP exists until it is actually created and verified.


## Resume verification note — 2026-10-10
Direct connector re-check confirms:
- Original ITB still says 08-Sep-2026 17:00, technical + unpriced first, priced HOLD; the reported 14-Oct instruction remains unauthenticated and MUST NOT be treated as release authority.
- MTO Rev04 contains line-level rows and detailed scope beyond `mto.rev04.summary.json`. The next task is to ingest those existing rows into a controlled Required BOM; do not infer missing quantities from quote quantities.
- Current MR0001 reconciliation is intentionally fail-closed (`requiredQty:null`) until that ingestion is complete.
- Branch comparison from checkpoint `5aa4267` showed ahead 1 / behind 0 before this documentation update; after pulling, always run `git rev-parse HEAD` and `npm run build` locally to record the exact machine HEAD and validator result.
