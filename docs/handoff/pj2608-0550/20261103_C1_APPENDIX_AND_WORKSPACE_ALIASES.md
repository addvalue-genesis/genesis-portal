# C1 Appendix presentation and CUS / SI / VND aliases — 3 Nov 2026

User explicitly authorised implementation of the approved C1 preview in the existing app, including Module ID, colour and +/− controls. This supersedes historical UX-pause notes for this C1 presentation and workspace-label scope. Parent: `a0d4f948911ff98e93ac50206a2d5f13010eba3c`; existing branch `feat/pj2608-0550-official-working-20261028`, Draft PR53. UI `2026-11-03.6`; route remains port3050 `/projects/pj2608-0550`.

## Delivered behaviour

- Existing `bid.quotation.C1` presents MR Appendix1.1–1.8, system, site, native item and non-additive component rows. All four hierarchy levels have independent +/− controls; overview, main-items, all-components, document mode and Appendix jumps are local display state.
- 179 native MR rows project the governed repository catalogue. VSAT CAB/RTR/KIT/CPY records recombine only for display into their three original lots; each canonical ID/owner remains intact. The derived LAN PABX row is not a second MR charge. Unspecified cable quantities remain unspecified. The existing equipment descriptions are completed by a read-only179-row native MR text reference with document/revision, PDF hash and physical-page provenance; wrapped clauses, installation notes and Appendix2 references are retained. The PDF and private source/SI packages are not bundled.
- Existing Module IDs, Copy ID, display numbers01–14, the15 architectural IDs and colour functions are retained. `CUS`, `SI`, `VND`, `SI-WP-01`–`08`, `SI-COST`, `SI-OUT` and `SI-REL` are searchable display aliases. Internal state A/B/C, commercial WBS B1–B9 and customer Schedule names remain canonical; no migration or new architecture module.
- C1 internal trace opens the existing customer MR page, SI requirement, WP7 vendor mapping, selected offer, Working owner and Schedule allocation. It is outside the customer article. Existing pricing/MGW diagnostics are in a separate collapsed internal panel.
- C1 uses the existing current-view Working selling amounts. A shared owner is charged once as an explicit package row; covered MR rows point to its display item. No equal/proportional allocation is invented. Other selected base-supply owners without an Appendix classification remain visible in a supplementary Other Base Supply section, rather than inventing an Appendix assignment or dropping their price.
- UI, HTML/Print-to-PDF, Word and XLSX share the same projection. Word retains the merged two-row price header. Customer content excludes automatic source references, IDs, vendor/internal costs and mapping/readiness diagnostics; bidder-authored customer response/remarks remain customer content. Draft customer paper is labelled DRAFT — NOT FOR SUBMISSION; actual authorised labels are generated only by the existing issue flow.

## Governing implementation

`C1Appendix0550.jsx`, `data/c1Appendix0550.js` and `workspaceLabels0550.js` are presentation implementations of existing modules. The existing volume view supplies an ephemeral `c1Context`, never saved schema fields. `NativeExhibitC0550`, `exhibitCNative0550`, `exportBidVolumes0550`, `bidPackageOutput0550` and `releaseIssue0550` are affected callers/outputs.

New frozen packages use `exhibit-c-rev0.v2` / `mr-appendix.v1`; unresolved ownership, duplicate owners, missing quantity, missing price and total mismatch hold issue readiness. Historical v1 packages are recomputed using their recorded renderer, remain restore-only and retain their original bytes. No existing package is reissued, migrated or merged by this work. Canonical price/quantity/FX, selections, saved edits/deletions, source authority and frozen history are unchanged.

## Verification

- `npm run build`: PASS the full repository validation chain and production webpack. After completing the native description reference, reran C1/native-export checks and production webpack successfully. The existing oversized-chunk warning remains (final0550 chunk3.29MiB); it is not an issue-readiness approval.
- `npm run validate:pj0550-c1-appendix`: PASS179 MR identities/8 Appendices, complete wrapped radio/installation/reference clauses, explicit satellite COMPANY disposition, LAN components, shared owner charged once, invalid/missing/duplicate coverage/price gates, XLSX non-additive detail rows, merged Word header, escaped output and unchanged input data. The test also asserts exact legacy HTML/Word SHA256 hashes against parent a0d4f948.
- `validate-pj2608-0550-c1-appendix-browser.cjs`: PASS actual production app, every +/− level, all controls, canonical synthetic LAN price, customer cost/ID separation, actual grouped Word download including continued clauses, CUS/SI/VND/Working links, existing owner colour,390px containment, unchanged IndexedDB after navigation/export/reload and zero page errors. Thai screenshot rendering used a QA-only local font; no font dependency was added to the app.
- Existing `validate-pj2608-0550-working-schedules-browser.cjs`: PASS actual MGW internal28-row catalogue, retained selling amount and draft allocation, C1 customer separation,13-form lazy preview, reviewed/Working separation, financial/frozen preservation, reload/mobile and zero page errors. The test now opens the explicit internal disclosure before its nested diagnostics.
- Existing `validate-pj2608-0550-bid-volumes-browser.cjs`: PASS all14 numbered tabs/13 Schedules, actual XLSX/Word downloads, dirty guards, synthetic v3 authorisation/frozen export, saved document edit and old-backup preservation, reload/mobile and zero page errors. Other browser selectors referencing renamed area buttons were updated, but those entire suites were not rerun.
- `npm run validate:pj0550-native-exhibit`: PASS after final description changes, including legacy restore/new frozen Word outputs. `npm run context:pj0550 -- --check` and `git diff --check`: PASS.

Browser validation is isolated synthetic QA, not a customer issue. Delivery targets the existing branch and Draft PR53; do not merge or issue a project Release.

## Remaining project work

This implementation does not close source/native reading, MR/vendor package coverage, SI engineering, AVL/deviations, pricing gaps or customer issue approval. Continue the existing PAGA multi-document reconciliation and remaining systems through canonical records. The browser checks use isolated synthetic local workspaces; they do not prove the owner's Windows saved data, private source receipt or deployment state.
