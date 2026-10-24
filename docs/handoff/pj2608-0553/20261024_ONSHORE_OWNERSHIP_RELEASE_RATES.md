# PJ2608-0553 — onshore grouping, inherited colours and Release rate schedule

Owner instructions on 24 October: inspect incorrectly grouped work and move it; group.06 is onshore; propagate group colours into innermost tables across modules; show **Day Rate / OT / Standby in Release**, not only Working.

## Onshore placement and price boundary

`bid.budget.working.bc.b3.resource-price-dossier.group.06` describes JUTAL Zhuhai Fabrication Yard SAT (SPE 7.3.2), distinct from offshore commissioning (7.3.3). Its 14 Site/MR test rows are **unpriced requirements**, not additional B3 charges. The native B3 contract line still controls inspection/testing; geographical onshore location alone does not reassign every test obligation to B9.

The group and all 14 rows now render inside B9's onshore Yard dossier as a requirement reference. B3 retains a compact B9 link. Legacy group/site/test IDs remain unique and searchable; display-owner routing opens B9 for group.06 descendants and gf-yard rows. Visible numbering is B9.YARD. No source cost owner or financial posting was reassigned by moving the presentation.

B9 remains the two-person onshore specialist package: Senior USD700/day + Field USD600/day, seven working plus two travel days each, selected expenses included, **THB480,550 once**. B3 SAT28 labour remains **THB1,587,600**, full B3 **THB2,322,450**, known B **THB4,757,207.13**. The 28-day allocation between BF/offshore and Yard support still needs activity/day/RACI reconciliation; this UI correction does not prove that all labour scope is free of overlap or that B9 covers all CCL/SPE obligations.

## Consistent presentation

`moduleHierarchy0553.css` supplies inherited colours to headings, nested summaries, table headers, row tints and subtotals. A/B/C owner metadata is carried by Working, equipment-source, Scope and internal Release rows. B3 retains its four work families. Unpriced requirement groups use a neutral dashed border; cross-owner references use the destination's colour. Colour never denotes price approval. Customer native XLSX styles are unchanged.

## Release Day / OT / Standby design

The same source-derived `serviceCommercialBasis0553` metadata feeds Working, Scope and Release. Release shows full-width, initially open B3.SAT and B9.YARD rate schedules immediately beneath their existing lump-sum rows, in Customer and Internal modes. These are qualifications, not new priced LS rows. Source navigation also exposes `.service-commercial-basis` under B3/B9.

| Basis | Included workdays | Crew | Day USD/person | Proposed OT USD/hour/person | Proposed standby USD/day/person |
|---|---:|---:|---|---|---|
| B3 SAT / proposed offshore basis | 28 team-days / 56 MD | 2 | Senior1,000; Field800 | Senior125; Field100 after12h | Senior1,000; Field800 |
| B9 onshore Yard | 7 working +2 travel/person | 2 | Senior700; Field600 | TBC: normal onshore hours not specified | Senior700; Field600 |

The assistant's design proposals are **OT = daily rate /12 ×1.5 offshore** and **standby =100% daily rate**. The owner has requested the rate schedule but has **not approved those multipliers**. `proposalOnly.approved=false`, agreed OT/standby values remain null, and the visible schedule is labelled **DRAFT / PROPOSED — subject to written agreement**. No proposal rates increase current totals.

Additional full working days, actual OT, travel and standby are distinct. Do not double-charge the same interval or days already included in the lump sum. Proposed standby applies only when the mobilised team is available but the customer/site cannot proceed; supplier-caused delay is excluded. Mixed/partial days, timesheets, written variations, extra mobilisation/accommodation/transport and marine support remain explicit commercial qualifications. Do not assume the offshore12h basis for onshore.

This turn implements the rate schedule in the **Release web preview**. The original six-sheet customer XLSX retains its existing format and amounts; it does not yet export this supplementary rate table. No customer submission, merge or deployment is authorised by this draft.

## Verification

- All141 build validators passed across the main run and focused reruns. The three initial failures were the temporary native remark-cell experiment (removed) and two layout validators affected by JSX attribute ordering (original ordering restored).
- Targeted service-basis tests cover included days, source rates, proposed OT arithmetic, unapproved rate status, Scope/Release parity and no added price.
- Complete Working/Release snapshot equality passed after excluding only the new service-basis metadata.
- Actual native template validation preserved all six sheets,16 annex rows, styles, merges, geometry and unrelated ZIP parts.
- Browser verified group.06 routing to B9,14 legacy rows, exact leaf navigation, bidirectional B3/B9 links, and2,023 nested table headers across all16 B/C owners. SAT header/body/subtotal colour inheritance passed.
- Browser Customer Release verified initially visible B3/B9 Day/OT/Standby proposals and unchanged totals; Internal Release retained A/B/C owner identities. No page errors. Production webpack passed with three existing size warnings.

Continue on `fix/pj2608-0553-urgent-thailand-cif-pricing-20261024`, draft PR39. MGW remains equipment supply only; no requotation. FAT2+1, Training1+1/OEM online, CIF allocation, A5 non-additive260,232 and spare rows remain unchanged. DB/global Manual Input and unrecovered requirements1–8 are still deferred.
