# Original supplier cost separated from allocation in every system

5-Nov-2026, Asia/Bangkok. Parentf1701c76, existing Official Working branch,
Draft PR53, port3050. UI2026-11-05.4.

## Owner rule and implementation

The owner's clarification applies to both towers and every0550 system:
original supplier quote cost and its allocation to A/B/C are different layers.
ADR0550-001§13 now records this explicitly. The existing twenty Part-A groups
(nineteen systems plus COMMON) use the same Supplier cost/trace component.
Original full quotation/base/net, native item quantities/units/rates/amounts,
options, revision and saved FX are independent of the Working allocation table.
That table labels its cost as allocated Working cost, not the supplier invoice.
The existing tower inline full-net view and collapsed legacy basis are retained.

One read-only index is built per workspace, rather than rebuilding Vendor maps
for each system. Shared quote identity and full totals are invariant under system
or relevant/full-item filters. No project procurement grand total is formed from
all sources: different suppliers, alternatives, revisions and options must not be
added blindly. One quote appearing in several systems is a reference, not several
financial contributions. No private supplier rate is added to Git.

MGW cover totals and inconsistent detailed totals remain separate original facts;
its CCTV/LAN discrepancies and TBD row stay visible. INDUSTRONIC net packages do
not sum their gross components twice. Working AP712/option rate-reference records
do not duplicate the original source items or option totals; their actual selected
Working quantities remain traceable to the native rate. This exclusion is shared
with existing Vendor07.2 source-total calculation. NET base inclusion does not
automatically include optional items. IDIE Asactual, original zero-quantity
CERAGON alternatives and native annual units stay exact; missing prices/FX stay
OPEN and native currency remains available.

Source applicability comes from registered quote metadata/MGW native catalogue.
Later SI/Working candidate links are shown separately as supporting references,
not promoted to complete supplier scope. On the tested private fixture there are
seven distinct original quotations, direct source references in sixteen of the
twenty groups, and no direct registered supplier quote for TEL-VSAT,
TEL-VSAT-KU,TEL-LAN-VCS or TEL-AIS. Supporting candidate references may exist.
This is a registry snapshot, not a claim that the project never received another
document. Estimates/old rate references/COMPANY supply are not zero-cost quotes.

Native item tables mount only when their quote is expanded. A shared quote can
show relevant items or the full original without changing its full amount.
MR mapping remains a separate disclosure; all original IDs/copy/navigation and
the existing module registry are retained, with implementation paths updated.

## Invariants and verification

ADR0550-001 principles2/3/5/6/8/9/10/11/12 and§13 apply. This is a shared source
projection, not financial ownership, source schema or scope migration. No
prices/quantities/FX/selected owners, prepared estimates, raw sources/SI decisions,
review fingerprints, customer outputs or frozen issues are changed. No new
architectural/module/customer IDs or approval gate is introduced. The source
view does not certify engineering or complete bid scope.

- Independent synthetic shared-source tests: one quote across two systems,
  allocation A→C independence, full/net/base/options, zero-quantity option,
  authored active-rate versus immutable source price, unknown net/FX, no duplicate
  Working-rate option amount, lazy SSR and no writes.
- Actual private workspace: all twenty source panels, seven unique quotes,
  MGW full totals across fourteen source-declared system/COMMON references,
  original37/39 PAGA item counts and additional-rate links, IDIE Asactual,
  tower8 supply references/22 allocations, exact canonical/model/customer rows.
- Existing Vendor grouping/registration, per-tower prices, price-summary and
  controlled issue/frozen-history validators passed. No full monorepo repeat.
- Production browser checks shared MGW identity/full totals under system and
  native-row filters, cover conflict, PAGA revisions/IDIE, missing source quote,
  all twenty panels, lazy item mounting, preserved tower/source/owner navigation,
  strict Official, reload/mobile and exact IndexedDB preservation; no page errors.
- Production webpack and continuity/whitespace checks passed; existing large
  application-chunk advisory remains. Windows saved data was not accessed.

Pull/restart the same branch. Existing private DATA loads through the same bridge;
no JSON replacement, manual price adoption, customer issue or PR merge is needed.
