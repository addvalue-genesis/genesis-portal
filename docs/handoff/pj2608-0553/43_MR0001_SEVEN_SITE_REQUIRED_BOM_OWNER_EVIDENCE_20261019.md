# PJ2608-0553 — MR0001 Seven-Site TAG Required BOM / UI Evidence Alignment

Status: READ-ONLY engineering presentation change — NO Rev02/Rev03 cost change and NO customer release.
Branch: `feat/pj2608-0553-mr0001-seven-site-required-bom-20261019`

## Controlled shared four stages
All seven MR0001 locations reuse the **existing** `LocationBomDetail0553.jsx` host and `TagFourStageWorkbench0553.jsx`:
1. Required Engineering BOM = MTO source functions, documentary MTO quantities and site-specific functional working candidates (NOT accepted SKU quantities).
2. Working Priced BOM = existing TAG cost owner and selected budgetary source functions; no new posting.
3. Vendor Offer Comparison = source quotation line and quoted qty/currency; original N/A/null maintained, alternative non-additive.
4. Engineering Verification = OEM/RF/Ex/route/NMS requirements, unresolved review, per-site NEW/REUSE decision and double-count prevention.

Implementation: `mr0001TagEvidenceProjection0553.js` is a new read-only extension joined inside existing `tagBomFourStageReadModel0553.js`. No edits to approved source costs, site/Location JSX wrapper, original vendor quotations or Change Control manifest.

## Site × Source MTO mapping

| Site | DATO | TCAB | SA / Surge | Bulk |
|---|---|---|---|---|
| ZWP20 | 8 | 9 | 10 | 11 |
| ZWP21 | 17 | 18 | 19 | 20 |
| ZWP22 | 26 | 27 | 28 | 29 |
| ZWP23 | 33 | 34 | 35 | 36 |
| ZPQ | — | — | 40 | 41 |
| ZWP8 | — | 46 | 45 (2 SA TAGs) | 47 |
| ZWP11 | — | 51 (existing/reuse) | 50 | 52 |

Physical source coverage: **25 TAGs** = 4 DATO + 6 TCAB + 8 Surge + 7 Bulk. This is not a claim that all 25 are new purchases.

### Per-function proof and cost ownership
- **DATO-507-001 (GF sites):** Phoenix `FL-PP-RJ45-SC` and Weidmüller `IE-PS-RJ45-FH-BK` are separate working price components. Original INNOVA rate `N/A` remains null; RS THB 1,176.68 is a different retail/reference source. Their functional amount is already within DATO TAG; no cost added to A5 Bulk. Actual Ex-rated disconnect compliance remains open.
- **TCAB-500-001 (GF sites):** Enclosure historically budgeted using Prosper/BARTEC comparison. 2022 manufacturer GA component and entry quantities are a *reference*; do not automatically transfer 16 holes/16 plugs as approved site-specific build or purchase. Client DTS minimum 18 entries vs 16 selected GA basis requires deviation disposition. Already-included plugs, earth terminals and drain are not purchased again as field bulk.
- **TCAB-500-003 (ZWP8/ZWP11):** Treat Brownfield replacement/reuse and cost reference as conditional. ZWP11 MTO row51 is a 1 Set documentary need, **0 new cabinet procurement** according to BOD Rev.C2 §8; all retrofit/modification costs remain unverified, not free.
- **SA (all sites):** Dedicated physical surge TAG owns the working line; do not add identical Next G A-8/B-8/C-8 under ODU or IDU. Site-specific vendor proof remains conditional for voltage/PoE, hazardous-area certification, earthing and endpoint count.
- **Bulk (all sites):** CAT6A field run and M20 panel gland allowance are separate evidence rows from the *local* TAG's components. Management 60m+15% and 1 M20 budget scenario are not measured cable route nor certified active glands. 16 cabinet holes and factory plugs are capacities/inclusions, not an active gland purchase. Unpriced field interfaces remain visible.
- **ZPQ, ZWP8, ZWP11:** Same UI structure but retain Brownfield NEW/REUSE/BY OTHERS uncertainty and source currency/owner; no invented replacement or fake zero.

## Freeze and verification
Do not touch:
- Rev01 & Rev02 and Rev03 manifests (all pinned).
- `mr0001TagCostLedger0553.js` (`65e3a690e8bc04a4cf6b812f0fe07703972ff483`).
- `zwp20SiteCost0553.js` (`75efeff5b5b85665be5aab6088b7cf806fa8085a`).
- `engineeringOwnedCost0553.js` (`f29b8d3705fd8bee0d72ddeb1349b80d9b28d760`).
- Rev03 `mr0001Rev03CostOverlay0553.js`, original quote sources and Working Sell.

New runtime check: `npm run validate:0553-seven-site-tag-evidence` verifies 25 TAGs, owner identity, DATO component source rates and original N/A, 7-site scope classification, alternative exclusions, zero new ZWP11 cabinet purchase, unchanged TAG ledgers/quotes and four named presentation stages.

Required before sign-off: execute `npm run validate:0553-seven-site-tag-evidence` plus `npm run build` on the user workspace; inspect the GUI for selected site/tag open/close behavior. No local/CI PASS is claimed until execution.
