# PAGA original quotation register — 4 November 2026

Parent e4675393; existing Official Working branch / Draft PR53 / port3050.
Owner requires both A20261632.pdf and A20261632_002.pdf, original line quantities,
units, unit prices and totals, irrespective of whether selected in Working.

The screenshot showed only the three carried-forward A20261632 cost owners.
The revised offer was available as a private SI import, but its40 offers were
not default Vendor data. Original quantity/unit metadata was absent on legacy
owners. The existing grouping projected saved offers correctly; the data feeding
it was incomplete. Preserve original records rather than treating chosen owners
as the entire supplier quotation.

## Implementation

The existing private Vendor_Register path now accepts the existing supplierQuoteRow
classification/parent metadata as well as native original extended amounts,
filename and optional original-import receipt identity. Registration creates no
Working lines and changes no selected prices, quantities, FX, margins, source
batch, engineering review stamps or frozen output/history. Exact legacy fields
can receive source metadata; saved edits are retained and prior consumed batches
preserve deliberate deletions. Parent identity and source quantity/unit agree.
The full SI revision can subsequently reuse these exact source offers while
retaining their original metadata; differing financial records still conflict.

VND07.2 keeps its IDs/colours/CopyID and independent disclosures. It shows original
unit price, original extended total (blank printed totals stay unknown), filename,
source page/item, source links and separate existing saved-rate/Working usage.
Headers count quotation identities separately from Offer IDs. An unenriched
saved edit remains in its single unambiguous quotation group; genuinely distinct
content hashes remain distinct.

Prepared private file:
PJ2608-0550_PAGA_Original_Quotes_Vendor_Register_20261104.json.
It contains37 original numbered rows from the16-page old quote,39 from the19-page
revised quote, the three unchanged legacy owner references and the new net summary:
80 canonical Offer IDs in two quote groups. The two source base totals reconcile;
options and included references remain outside additive net package costing.
The legacy AP712 +1 uses the source rate from a4U original row; those are distinct
source/Working quantities. Summary1Lot is expressly a normalized pricing basis.
Same item5010 means different products across revisions; no identity is collapsed.

The initial upload landed in a duplicate same-named90_SYSTEM_WORKING/DATA.
Metadata confirmed that upload but did not establish the canonical Desktop source
path. See the deployment correction below; that initial check was insufficient.
Normal existing startup loads all prepared registers, not a newest-only quotation.
No private source amounts/payloads are added to Git. Git pull installs code, then
restart npm and let Drive sync supply the prepared private JSON; owner Windows
consumption has not been observed. No manual file selection is required.

## Verification and limits

- Existing Vendor registration/automatic loading/defaults, supplier revision,
  SI-work-package and bidding validators passed. Extended synthetic checks cover
  metadata-only enrichment, original unit/total retention with edited active rate,
  two revisions, parent validation, prior deletion receipts and registry-before-SI
  import order. Actual private37+39 rows reconcile to the two source bases; old
  offer fields, derived prices, Working/FX/history remain unchanged.
- Production webpack passed (existing3.38MiB size warning). Production Chromium
  opened the real app: automatic2-quote/80-offer import, both grouping directions,
  original AP7124U/unit/total, unique anchors, read-only expansion, IndexedDB
  persistence/reload,390px containment and no page errors passed in an isolated
  profile. This does not read or update the owner's Windows browser.
- ADR-0550-001 principles1,2,5,6,8–12: original supplier truth, source versus
  Working quantities, single financial owner, explicit missing amounts, revision
  identity, canonical records and frozen history. No PAGA engineering acceptance,
  price adoption, customer issue or PR merge is implied. Full monorepo build
  chain was not rerun; bounded relevant validators and production build passed.

## Deployment correction after owner screenshot

Owner screenshot after pull shows the new Total Price column but only three
legacy rows. Remote code HEAD is be463bb0, so the new UI is present while the
prepared private register has not been consumed. Direct Drive parent/child
inspection found two folders named90_SYSTEM_WORKING under the same project.
The newly created4-Nov folder contained Vendor registers only; the original
20-Aug folder/DATA contains the actually used Source Rev11 and A Rev07 packages.
The initial upload was in the former rather than the established DATA directory.

Moved the existing PAGA register into the original DATA next to those Source/A
files, removing only its verified prior parent. Same File ID,138991 bytes and
content retained; post-move metadata confirms the original DATA parent. No
application code or saved browser workspace was changed for this correction.
No further code pull/manual JSON import is needed for the move; after Desktop
sync a page reload starts the existing automatic Vendor load. Actual owner
Windows consumption remains unobserved. Only PAGA was moved in this task.

For subsequent uploads, enumerate project children and verify the DATA identity
against the existing Source/A filenames; matching folder names and a successful
upload alone are insufficient. Do not create another folder or delete duplicates
without reconciling their other contents. This is a documentation/deployment
correction under ADR principles1,2,9–11, not additional pricing/engineering work.
