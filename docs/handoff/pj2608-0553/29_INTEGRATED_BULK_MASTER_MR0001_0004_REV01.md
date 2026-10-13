# PJ2608-0553 Integrated Telecom Bulk Master — Rev01

Date: 2026-10-13. Target: MR0001, MR0002, MR0003, MR0004 across WP20/21/22/23 and the three MR0001 brownfield sites ZPQ/ZWP8/ZWP11.

## Implemented source-connected structure
- One read model: `frontend/src/project0553/data/integratedBulkMaster0553.js`
- The existing `frontend/src/project0553/data/wpSystemBulkBudget0553.js` supplies WP/system line items, tentative quantities, supplier rate references and flags.
- The existing `frontend/src/project0553/data/bartecGlandBulkSchedule0553.js` supplies 7 SCADA and 4 EX phone modelled enclosure registrations, cable ends/OD/Ex procurement proof gates.
- The original read-only `frontend/src/project0553/data/a5BulkAttribution0553.js` remains the sole booked Bulk A5 source in this view.
- `frontend/src/project0553/BulkTakeoff0553.jsx` now shows four MR groups under each WP, detailed line items, source/evidence and owner, distinct posted A5 and unposted candidate subtotals.
- `frontend/scripts/validate-0553-integrated-bulk-master.cjs` checks 7 WP × 4 MR, no duplicate post, original A5 THB260232 and BARTEC 144 modelled cable holes; registered in frontend/package.json build sequence.

## Scope mapping
MR0001 SCADA: cable CAT6A/entries/connectors, panel M20 sizing, surge and mounting; MR0002 DTRS: antenna/feeders/LNA/control/RF enclosure; MR0003 EX IP Phone: phone/sounder/JB M20 gland sizing/field cables; MR0004 Marine RACON: power/control/termination cable allowances and supplier inclusions.

## Financial and technical boundaries
This is a **working integrated view**, not a claim that every MTO/bulk quantity, certified Ex gland model, supplier price, B1–B14 or C1/C2 is approved or costed. NULL means unresolved, not THB0. The historical THB260232 A5 source belongs to booked MR0001 Bulk Material at seven original MTO site rows, and must never be added again from a separate preview. No additional booking has been performed.

BARTEC SCADA Ex e: 16 usable M20 factory holes, while DTS specifies 18 minimum; formal client deviation remains open. BARTEC EX telephone JB: 8 M20 holes. MGW PHONE-1 quotes WAROM JB/glands at three WP; no approved matching part credit to BARTEC. Historical TETRA cabinets are separate and do not map to current MR0002.

## Next engineering activities to close full priced BULK
Trace every cable end per MR and WP from controlled WIR/TER, BLD, LAY, GA and selected equipment datasheets; size gland threads and sealing ranges from actual cable OD/armor and Ex type; measure or parameterize approved routed length, resolve OEM package inclusions, and source missing compatible market/vendor unit rates. Then update per-MR actual budget scenarios with versioned assumption and variance, reconcile A5 changes through a controlled cost-ledger revision, and derive A+B+C with services/installation lifecycle B/C. Do not silently substitute blank quantities with invented final purchased counts.

## Validation
Connector readback of all edited files establishes persistence; runtime Node/Babel/Webpack on user's workstation has not been run. Run `npm run validate:0553-integrated-bulk-master`, `npm run validate:0553-a5-bulk-attribution` and `npm run build` after git pull.
