# CERAGON RevA1 — native quote registration in existing VND

4-Nov-2026; parent `05de6515`; Official Working branch / PR53 / port3050;
UI2026-11-04.8. Owner supplied the updated CERAGON workbook. Existing Vendor
07.1/07.2 and company/system projections are reused; no new screen or module ID.

## Source and interpretation

- Drive XLSX `1YEik9MUniq2B9oW5FZLAl8-UrphS5HD9`:
  `26-30029_BoQ_Addvalue_ASK Project_IP-50CX 2+2 HB_RevA1_20261103.xlsx`,
  SHA256 `e90e86e573545c77f354e3a12ae40d09279ea9a1b90f0cac300a8cc53ca1123f`.
  Quote3-Nov-2026, valid until3-Dec-2026, native USD. Filename ref26-30029 and
  printed `'Offer '!C5` ref26-3029-1 are both retained, pending clarification.
- System `TEL-DMR` means digital microwave / customer MR Appendix1.5, not VHF
  digital mobile radio. CERAGON is source branding; contracting entity remains OPEN.
- Read cached values, local formulas and both installation images without editing
  or recalculating the source workbook. All24 BoQ part rows independently matched
  their `ROUNDUP(SUMPRODUCT(...),0)` selected quantities. The50 retained external
  workbook link definitions were not followed. Unit/amounts and source total were
  independently reconciled with decimal arithmetic outside public Git.
- Four canonical Offer IDs cover main2+2HSB link, alternative2+0, spares and annual
  Gold SLA support. Alternative native quantity0 remains0/OPTION. Support retains
  quantity2, native price-per-year and `year`; no normalization to package/day or
  automatic duration/crew/trip adoption. Generic installation/time-sheet notes do
  not establish a priced installation/FAT/SAT/training scope.
- BoQ components remain non-additive source detail within existing quoted terms;
  no component prices are fabricated or distributed from the package arbitrarily.
  Received path calculation PDF `1hGcBbwgqPR1DhbsfUzSrtc43E-FS8cS8` is supplier
  evidence, not our derived CAL/RPT or customer acceptance.

## Existing data path / preservation

- Private prepared package uses `genesis.0550.vendor-register.v1`, batch
  `VND-CERAGON-26-30029-REVA1-E90E86E5-20261104-2`, vendor`VENDOR-CERAGON-0550`
  and4hash/row-based Offer IDs. Uploaded to verified project
  `90_SYSTEM_WORKING/DATA`, file`1RzC_lafMUWKOJTSjypFcKTxzd0HFfo8k`,19,776bytes;
  initial metadata readback confirmed duplicate DATA`1IIylD7nei9IrXgtmB_plxRHUidjb2aFi`;
  corrected canonical destination below. Prices and original
  commercial terms are not stored in public Git. No source file or sharing changed.
- A separate immutable public metadata catalog has null current/original rates and
  no original terms. Startup shows CERAGON even offline, then the existing bounded
  automatic private loader fills only exact untouched defaults. Saved/priced rows,
  intentional deletions, aliases, original IDIE catalog and prior actual receipts
  retain their existing ownership. Each catalog family now has independent receipts;
  consuming/deleting IDIE cannot suppress CERAGON or restore IDIE, and vice versa.
- Append `year` to existing unit enum; allow source quantity0 only for OPTION.
  RATE must remain positive and negative quantities are rejected. No new schema,
  receipt database or automatic Working line/selection/price/quantity/FX write.
- Keep existing15 architectural IDs, CopyIDs, owner colours and +/−. Frozen issues,
  selected commercial reference and exact artifact history remain governed.
  The previously carried CERAGON system allowance is not replaced by this partial
  supplier quotation and is not evidence of approved savings.

## OPEN engineering/commercial reconciliation

Confirm single-mode SFP versus multimode FO cable; credit30days versus30/70 terms;
named EXW/FCA point and delivered/CIF logistics/taxes; MR cabinet/IDU/antenna and
excluded switch/router scope versus full-outdoor offer; source/BoQ/MR cable runs;
AC/DC converter conditional remark versus selected quantity; spare kit SFP inclusion;
2+0 terminology/dual-core design; governing throughput/availability criteria,
source drawing routes and all remaining project obligations. Source dates, symbols,
supplier claims and group membership do not establish formal MR mapping/PASS.

ADR0550-001 principles1–6,8–14 affected this change: exact source facts versus SI
interpretation/proof, independent revision ownership, non-additive packages,
canonical projections and preserved release history. Engineering proof and complete
MR-to-supplier mappings remain OPEN; automatic Windows consumption is unverified.

## Verification

- Model/SSR regression with actual private CERAGON: exact4source rows/rates/evidence,
  zero alternative, annual support units, grouping identity, cross-family receipts,
  source validation and edit/delete/idempotency; every other workspace field retained.
- Existing defaults regression with actual private IDIE passed; both public catalogs
  have null money and no private terms. Existing Vendor grouping/automatic bridge,
  controlled commercial issue and Drive bridge validators passed.
- Actual private CERAGON passed isolated production Chromium: initial503 shows
  four OPEN defaults, later DATA arrival fills4native rates automatically without
  Load/reload/file chooser; both company/system views, IndexedDB/reload and deliberate
  deletion preservation verified, all other workspace fields equal, no page errors.
- Production webpack passed with existing asset-warning class (largest chunk3.39MiB).
  Private HTML review rendered with24BoQ rows/12OPEN issues and no desktop overflow.
- Actual private IDIE also passed the same production browser regression with both
  catalog families installed; CERAGON defaults do not block existing IDIE hydration.
- Context continuity and diff-whitespace checks passed; private source/review artifacts
  are saved separately. Actual release/archive browser also passed: authorization, exact bytes/SHA,
  explicit reference, backup/tamper/restore, stale-tab rejection, mobile containment,
  transmittal and old-backup frozen-history preservation. No external sending.
- Delivered code is isolated from concurrent uncommitted PAGA/Vendor work in the
  original checkout. Only this worktree is staged; that checkout is not reset or
  overwritten. Existing-branch delivery uses an expected-head fast-forward lease.

Restart npm after pull so existing startup/bridge code uses this version. Identity
presence is independent of Drive; private rates still require the actual synced DATA
file. No Load/file chooser is required. No customer issue or PR merge is authorized.

Delivery rebase: remote PAGA original-quotation update `be463bb0` arrived during
CERAGON delivery. It is retained in full; quote source totals/filenames and existing
PAGA metadata enrichment are not reverted. The combined UI version is .8.

Before delivery the prepared private package receives a new batch suffix -2 with
original G10/G11/G12/G14 totals and source filename for the newly landed PAGA UI.
The same prepared Drive artifact retains its ID/history; the supplier workbook is
unchanged. Public metadata has no quotedTotal field until private source arrives.
The earlier prepared batch is not reused with different contents; supported prior
production code rejected this new quote's zero option/annual unit. Windows ingestion
is still not inferred. Rechecked combined source/price/history contracts below.

Canonical DATA correction (remote05de6515): initial upload used the duplicate
4-Nov90_SYSTEM_WORKING/DATA. Direct metadata of existing Source Rev11
`1WTuu5tqsD7s1b9hdR6tuyarfuE_71Rs4`, folder listing and A Rev07
`1TA7YYV55oiMSDTyWmbnQurhp-ToGgkxU` establish original DATA
`1Rpl1RwxzniUQgz-Ma7rZMXyWqRH7zWnf`, parent90_SYSTEM_WORKING
`1Ye5WH72DF-Wi9mxL8auXQfIKHLcN37l1`. Moved only this CERAGON prepared
file there, preserving its File ID/content; post-move metadata confirms parent
and19,776bytes. No duplicate folder or other Vendor file changed. Search results
did not expose all current JSON children; direct folder listing/metadata did.

Combined code validation repeated after PAGA rebase: actual CERAGON model/SSR,
original totals, source filename, Vendor/default/automatic/supplier-revision checks,
production webpack and real automatic Vendor/Release/archive Chromium all passed.
Source amounts and frozen-history inputs remained unchanged. Context/diff checks
are repeated at final delivery; no whole-monorepo build or Windows use claimed.
