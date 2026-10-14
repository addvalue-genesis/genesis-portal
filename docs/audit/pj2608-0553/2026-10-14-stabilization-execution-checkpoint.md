# PJ2608-0553 — Stabilization Execution Checkpoint

**Status:** IN PROGRESS / INTERNAL ENGINEERING WORKING PREVIEW ONLY  
**Approval:** no new cost baseline, customer quotation or deployment approved.

## Implemented in this package
- Shared `workingBomAggregation0553.js` excludes package-child `priceInclusion` / `parentPackage` rows from financial postings even if a downstream field incorrectly marks them counted.
- The projection reports `invalidPosting` for counted rows missing numeric amount, missing currency, or marked as included.
- `validate-0553-bom-runtime-reconciliation.cjs` enforces unique cost item IDs, no invalid MR0002 posting, no additive UHF included components, and source-quote versus three-location USD/THB-ledger consistency.
- Historical Rev01 MR0001 locked cost file and approved manifest remain untouched.

## What this does NOT prove
- It does not resolve MR0001 Rev01 dependency mismatch or authorize Rev02.
- It does not prove MR0001-MR0004 all use exactly one full drilldown renderer.
- It does not certify RFQ/OEM technical acceptance or the true A+B+C selling price.
- It does not establish an authoritative BOT exchange rate; display THB still depends on dated FX provenance.
- Build and browser UI must be executed in the user checkout or CI before PASS can be declared.

## Verification commands on exact working branch
```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal
git status
git pull --ff-only origin feat/pj2608-0553-mgw-r2-uhf-20261014
cd frontend
npm run validate:0553-bom-architecture
npm run validate:0553-bom-runtime-reconciliation
```
Full `npm run build` still has an independently enforced Rev01 baseline conflict. Do not refresh its SHA manifest without approved Rev02.

## Next technical gates
1. Validate the above runtime assertions in actual Node/React environment.
2. Recover the historical `zwp8Row43CostTrace.js` used at Rev01 approval; execute source-isolated MR0001 seven-location reconciliation and review changes to ZWP8/ZWP11.
3. Complete common MR row schema/renderer and cost projection parity for MR0001–MR0004.
4. Reconcile per-TAG → WP → MR → A1–A4 → A+B+C at identical scope and FX rate/date/source.
5. Submit Rev02 change control for explicit approval before modifying protected baseline.
