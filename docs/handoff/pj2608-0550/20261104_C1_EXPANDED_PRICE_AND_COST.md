# Existing C1 price visibility and internal cost location

Parent `5e6160fbe9aae7d91dd2ae37bb3742b86a712bd6`; UI2026-11-04.13.
Same Official Working branch / draft PR53 / port3050.

The owner requires the selling price at Appendix1.4 and asks where our cost is
shown. Existing10.2 Working / Part A / PAGA already renders Cost THB, ADDVALUE THB
and Customer THB, with original-currency Source cost in the provisional view.
VND07.1/07.2 preserves original quotation amounts. C1 is the customer selling-price
projection. P1/P2/P3 are additive selling-price owners in C1, not vendor cost rows.

## Presentation change

Previously an expanded Appendix hid the known subtotal shown by its collapsed
header, while separate PROJECT package rows appeared after location detail.
Keep the known subtotal visible in the existing Total Price header cell for both
expanded and collapsed interactive modes. Retain the explicit partial-subtotal
label and strict unresolved subtotal/grand total. Put separate all-package site
blocks before MR location blocks in the interactive screen, without changing MR
row order, numbering, IDs, amounts or ownership. No new module, tab or data store.

Paper view and native HTML/Word/table exporters retain their original strict
presentation and MR-first order. No financial inputs, quote selections, quantities,
FX, canonical records, coverage links, reviews or frozen history are changed.
No invented distribution of package price across locations/TAGs. Unmapped MR
rows remain unresolved; this presentation change does not establish full PAGA
scope or adopt quotation002. The user's exact saved Windows workspace was not
read; isolated browser evidence is separate from deployment.

## Governing principles and verification

ADR0550-001 principles2,3,5,6,8,10,11,12: source cost versus customer price,
many-to-many coverage, one additive owner, disclosed gaps, existing reverse paths,
one canonical workspace, immutable outputs and stable existing UI identities.
This change improves visibility; it adds no engineering acceptance enforcement.

- Existing C1 validator passes179 MR rows, one shared owner, invalid/duplicate
  coverage holds and exact current/legacy HTML/Word/table byte hashes.
- Native Exhibit C validator passes all13 forms, merged headers/notes, overflow,
  price placement, input preservation and frozen restore/exact Word controls.
- Extended actual production browser check passes expanded PAGA header amount
  reconciled to its unique price rows, package block first,13 PAGA MR supply rows
  retaining1.4.1–13 order, partial label and unresolved strict subtotal. Paper view
  retains native MR-first order and no partial header cells. Existing179-MR,
  plus/minus controls, reverse navigation, customer-only Word, mobile containment,
  unchanged IndexedDB after navigation/export/reload and zero page errors pass.
- Inspected expanded PAGA screenshot: header subtotal and P1–P3 prices visible
  immediately above APF location detail. No source cost appears in that article.
- Production webpack passes; existing asset-size warning remains. Final context
  and whitespace checks pass; final production bundle contains UI2026-11-04.13.

Full MR mapping/engineering, per-location pricing allocation where required,
commercial review and customer issue remain separate work. Do not mark blank MR
rates Included or zero merely because their system has a priced package.
