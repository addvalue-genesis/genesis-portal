# Master Tower / IDIE original supplier prices

4-Nov-2026, Asia/Bangkok. Parent30a705bc / existing Official Working branch /
Draft PR53 / port3050. UI2026-11-04.9 retains concurrent CERAGON RevA1 work.

## Diagnosis and source facts

Owner confirms PAGA source rows now appear after the canonical DATA correction.
IDIE still shows OPEN defaults; Master Tower appears as one combined legacy
Working owner. Direct inspection found the actual IDIE prepared register still
in the duplicate DATA. Moved that same file into the established DATA beside
Source Rev11/A Rev07; parent readback verified, no contents or sharing changed.

Both Master Tower PDF texts and separate document identities already exist in
Source Rev11. The legacy Vendor projection only exposed the old combined supply
owner, not each original source quotation. Original PDFs were retrieved and both
pages of each were read/rendered. Source2609.95.1 is60m;2609.95.2 is30m, dated
22-Sep-2026. Each has15 item rows, original LS/Gl units, unit/extended amounts,
net/VAT/total summaries, payment terms, exclusions, validity and printed124Months
warranty wording. Preserve that unusual printed warranty as a clarification,
not a corrected technical acceptance. Private original rates remain outside Git.

Private Master register preserves30 original item rows plus2 normalized source
net summaries. Exact whole-THB row sums reconcile to the original net/VAT/total figures.
The unchanged aggregate Working supply price matches items2–5 of both originals;
the full supplier quotations additionally include services/civil/other work.
No replacement of the selected supply owner with either full quotation is made.

IDIE original QO26163 register already contains4 native rates. Its first two
printed AMOUNT cells say Asactual/AsActual; mobilization and optional vendor-print
rows print explicit amounts. A separate immutable supplement adds only these
previously missing total/filename facts, keeping the original receipt/payload.
No staff duration, headcount, trip count, tax treatment or total project estimate
is inferred from source Qty1. No financial adoption or engineering closure.

## Implementation / invariants

Reuse existing VND07.1/07.2, canonical offers, native source evidence and private
Vendor automatic loader. Optional quotedTotalText preserves printed Asactual.
An immutable follow-up register can add missing total/text/filename fields only
when every pre-existing source-evidence field matches; it retains authored facts
and edited active rates. Zero-quantity CERAGON alternatives, annual support and
independent family receipts from30a705bc remain governed and tested.

Optional source workingReferenceOfferIds identifies existing combined price
owners without selecting/repricing source rows. Both original Master quotations
are counted as sources; the legacy aggregate is explicitly a separate Working
reference, retaining its own original ID, quantity, price and selected status.
Only source items2–5 carry this reference; other rows do not acquire coverage.
Missing/deleted owners are not refilled; self/cross-supplier references fail.
UI grouping/inspection is read-only, keeps original colours, disclosures and
unique CopyID/navigation anchors, and never adds reference amounts twice.
Source gross item rows remain non-additive under their source net owner.

Prepared private DATA files:
- PJ2608-0550_MASTER_TOWER_Original_Quotes_Vendor_Register_20261104.json
- PJ2608-0550_IDIE_QO26163_Amounts_Vendor_Register_20261104.json

Original supplier terms/rates and the reproducible prepared JSON package are
saved separately. New files use the verified original DATA identity next to
Source Rev11/A Rev07, not the duplicate same-named directory. Startup loads them
through the existing local bridge; no new panel, module ID or manual import.

## Verification / boundary

Extended Vendor synthetic checks passed: original amount supplements with edited
active rates, printed text, rejection/preservation of changed facts, two original
quote identities plus combined reference. Actual private32 Master source records
and4 IDIE records pass original unit/amount/net reconciliation, source-row supply
subtotal versus unchanged selected owner, idempotency, both grouping views and
unchanged Working/FX/source/history. Existing Vendor/default/automatic, CERAGON,
supplier-revision, SI-work-package, bidding and controlled release validators
passed; context/whitespace checks passed. Production webpack passes with the
existing3.39MiB size warning. Full monorepo chain was not repeated.

Production Chromium in an isolated profile passed automatic private loading of
PAGA, IDIE and Master registers; exact native units/rates/amounts, source counts,
separate combined reference, both group modes, unique anchors, read-only view,
IndexedDB reload,390px containment and no page errors. Repeated after merging
the concurrent CERAGON change; its independent defaults remain. These checks do
not read/write the owner's Windows browser or prove Desktop sync/consumption.

ADR0550-001 principles1–3,5–6,8–12 apply: source facts versus Working scope,
exact supplier identities/locators, many-to-many references, one financial owner,
unknown/Asactual amounts, revision preservation and frozen history. No changed
source authority, customer/SI acceptance, MR allocation, price adoption, formal
customer issue or PR merge. Windows result remains to be observed after update.
