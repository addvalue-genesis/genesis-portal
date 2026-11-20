# 0550 SI mapping: customer TAG to B07 quotation/component evidence

UI `2026-11-02.5-preview`, parent `47feeb5a6ad9b53f547b0fd0f8f67ce7e5c38b4a`.

## Process and owner decision

Mapping belongs to the existing SI process B01–B09 / Working Preview, using B07
supplier evidence. Volume I (11 C1–C8) displays the resulting shared Working
amounts and is not a second mapping or pricing process. Existing `bid.documents`,
source IDs, offers and Working records remain authoritative and are reused.

On 2-Nov-2026 the owner selected current DTS B1 as the APF LAN cabinet TAG working
basis: **11 TAGs**, while retaining the nine-tag received LIS C8 as a supporting
cross-check. This does not establish two additional purchases, change quantities
or prices, resolve every DTS/LIS discrepancy, change source authority, or represent
customer acceptance. MR and all applicable documents continue to govern the scope.

Owner clarification on 2-Nov-2026: **MR, DTS, SPE and PHI are the primary customer
requirement basis together**, with other applicable received documents. Supplier
quotations are compared to that basis; they do not lower it. This is not an
invented contractual precedence order among those four document families. Use
controlled revisions and applicability; record conflicts and ask the owner one
concrete question at a time when a decision is needed. The DTS 11-TAG choice is
a specific working-basis decision, not a general override of MR/SPE/PHI.
The 48-port DTS versus 24-port MGW observation therefore remains a discrepancy;
24 ports is not silently accepted or repriced as compliant. Reconcile the relevant
MR/SPE/PHI clauses and actual design before any alternative/deviation decision.

## Code behavior

Existing WP.7 mapping rows now show the current saved B07 description/brand,
original MGW quotation page/site/quantity and expandable native SET component
detail, including hardware, license, support, PSU and SFP where listed. A native
quantity is labelled as offered quantity, not required/allocated quantity.
Saved offer edits are retained separately from original quote detail. Generic or
missing offers do not acquire invented component details.

Rows show existing SI review problems and links to existing Working cost owners.
No new navigational module/ID, schema, editable store, matching algorithm,
allocation, price, supplier selection or approval is created. TAG text equality
is not used as evidence of compatibility. Native component references do not
create extra Working rows or duplicate the package price. The original-source
component view is internal SI evidence, not a Volume II or customer export change.

## Private authored supplement

`PJ2608-0550_SI_TAG_B07_Mapping_Draft_Rev02_20261102.json` is a separate private
linked v2 SI package, not bundled in Git or automatically selected by the paired
Rev11/Rev07 filename discovery. Use the existing `bid.documents.si-work-package`
explicit preview/apply path against the matching Source Rev11 intake.

Owner-review copy: [private Rev02 draft](https://chatgpt.com/library?file_id=libfile_98095119151c8191b7ef0706c1839675&account_id=personal).

It authors 38 unstamped requirements, 38 OPEN desk reports and one port-count
conflict: 22 APF Access Point candidates, nine cabinet candidates, two retained
unmatched current-DTS cabinet TAGs, and five checks of the real MGW LAN-021
switch/license/support/PSU/SFP SET. Existing Source/Offer/Working IDs are linked;
no switch TAG is invented and no quantity is allocated by ingestion. Native DTS
48-port wording versus quoted 24-port hardware remains unresolved.

Rev02 records the owner's DTS working-basis decision; Rev01 bytes/batch and the
entire original Rev11/Rev07 preparation lineage are unchanged. The v2 importer
preserves differing existing IDs: if Rev01 was already applied or a user edited
a row, this supplement will not overwrite that local work. Its explicit preview
shows preserved rows. Likewise, explicitly reapplying v2 after deleting its own
new IDs offers those missing IDs again; this is not an automatic continuation or
a new deletion-protection guarantee. A changed local source basis is rejected.

The concrete first batch does not claim completed mapping/engineering of all 19
systems. All 19 systems and COMMON remain in the existing workspace; other system
requirements, sources, technical drafts, prices and history are preserved.

## Principles and verification

ADR-0550-001 principles 2–6 and 8–14 apply: distinguish native evidence from SI
interpretation, retain many-to-many links and cost ownership, disclose gaps,
reuse canonical records, keep revision-dependent review and frozen history, and
require actual engineering proof rather than name/TAG matching.

- New model/SSR check: actual MGW LAN-021 native parts and source quantities,
  current saved offer text, missing/generic offers, escaped text, no mutation,
  price-copy or review stamp, and existing WP.7/B07/Working target IDs.
- Existing Working Preview suite: engineering/source/offer staleness, requirements,
  AVL/deviation and release/financial-preservation checks.
- Private actual Rev07 workspace: 14 checks of linked-package validation, all
  prior records and raw financial/source/technical/volume/history equality,
  idempotent import, preserved edits/prior deletions, stale-source rejection,
  existing single owner, 19 systems + COMMON and unchanged known customer subtotal.
  Mapping/engineering readiness and Release remain OPEN/HOLD.
- Production webpack passed with the existing ~3.21 MiB asset-size warning.

The earlier full-private browser import attempt did not complete successfully;
it is not represented as an installation into the user's Windows database.
The targeted supplier-evidence browser check passed on the bounded retry: actual
native components expanded in WP.7, navigation reached the existing B07 offer,
mobile containment and no page errors, with unchanged IndexedDB. Its requirement
fixture is synthetic and its quote component data is the repository catalogue.
The subsequent customer-basis clarification changes guidance text and these
operating instructions only. Its supplier-evidence and Working Preview model/SSR
checks are rerun; it does not add a new runtime precedence or engineering gate.
No full monorepo build/test chain, customer approval, message or issue is included.
