# PJ2608-0553 — ADDVALUE B1 Regulatory & Licence Coordination Cost Ledger (2026-10-16)

## Executive scope decision
The customer B1–B14 form is fixed. ADDVALUE's technical coordination for import/operating licence and related mobilisation, local stay, visa and documented authorized local service expenses belongs to **B1 internal regulatory subgroup** only when that is the activity's real cost owner. B3 remains SAT/FAT/offshore, B6 physical goods logistics, B9 JUTAL China specialist and B14 personnel insurance. SAMTEL bank guarantees are excluded from ADDVALUE.
This is NOT authority permission to pay an unofficial facilitation fee, agent commission without real service, government influence payment or undocumented hospitality.

## Code and calculations
`frontend/src/project0553/data/b1RegulatoryCost0553.js` creates 8 auditable B1 drivers: engineering technical licence dossier, project-regulatory coordination, regulatory MOB/DEMOB, accommodation, local travel/per diem, visa/immigration, licensed local technical agent and ADDVALUE-owned official fees. Every entry has one cost owner, engineering/trip purpose, rate/quantity evidence gate and duplicate exclusions.

Use existing GEQ/PEQ and shared cost derivation kernel. Each line's required quantity, person-days, number of trips, nightly rates and official fees remain **null until sourced**, and no extra money is booked. `frontend/src/project0553/ScopeBcAnnexDetail0553.jsx` renders the B1 cost ledger. `frontend/scripts/validate-0553-b1-regulatory-cost.cjs` verifies 8 entries, non-posting, and immutable B1 Rev05 964 MH / THB510,000 Working Sell. `frontend/package.json` runs this validation before build.

## Controls
- B1 project coordination only where the documentation and technical permit application is ADDVALUE's responsibility; external statutory licence ownership remains to validate (OEM, SAMTEL, customer, or ADDVALUE).
- One Trip ID/Travel Purpose/Cost Owner; if traveler attends both SAT and licence coordination split documented actual shares, never bill all travel twice.
- Only real and legitimate third-party services may be budgeted, with engagement, specific deliverables, beneficial-owner checks, invoice and approval.
- No invented source rate, durations, approved Direct Cost, or revised Working Sell.
- Qualification/policy evidence and supplier-specific rates are still needed to compute the final additive estimate.

## Status
GitHub code and script committed. User Windows npm validation/build/browser run are not yet evidenced for this commit. Run `npm run validate:0553-b1-regulatory-cost` and `npm run build` after pull; report any runtime errors.
