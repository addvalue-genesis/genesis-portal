# TEL-TELT original quotations and Working trace

5-Nov-2026, Asia/Bangkok. Parent872fec85, existing Official Working branch,
Draft PR53, port3050. UI2026-11-05.1. Owner authorised correction after the
two-source / thirty-item audit; no price adoption or engineering acceptance.

## Problem and resulting behaviour

Master Tower originals have fifteen items each plus one net summary per source.
Working retains one combined supply owner and two non-additive native MR rows.
The budget preparation separately assigns twenty-two service/construction/delivery
source items to existing B/C owners. Vendor's old usage projection only followed
direct offerId and MGW detail groups, so those twenty-two rows appeared unused.
The Part-A tower group did not expose the two original quotations or B/C trace.

The existing TEL-TELT group now shows native MR site/quantity and proposed source
links, both quotation identities/net totals and thirty original item rows with
native Qty/Unit/Unit Price/Total/locator and navigation to existing Vendor and
Working owner IDs. NET summaries are not additional item costs. Eight supply
rows retain their existing combined-owner references; twenty-two dated allocation
links show their B/C destination. The delivery owner explicitly identifies mixed
quoted and estimated costs. Nothing in this view adds a price or accepts scope.

Existing Vendor07.2 now reads these same source-bound allocation receipts for
usage display. Input/source fingerprints must still match; an edited/deleted
source/owner or deselection cannot leave a current usage claim. Stale links say
review required. The new read helper is deliberately separate from
workingOffers0550, which participates in financial/review fingerprints.
Part/group labels distinguish owner/check rows, non-additive price references
and COMPANY references; their existing IDs, order, colours and disclosure stay.

## Invariants and governing principles

ADR0550-001 principles2/3/5/6/8/9/10/11/12 apply: exact source facts versus
interpretation, bidirectional trace, one cost owner, visible stale/unmatched
states, canonical projection and immutable history. This is a read-only
implementation inside the existing modules, with no schema/startup migration,
new architectural/presentation ID, tab or customer row. No supplier rate is
published in Git. Preserve every price, native MR quantity, FX, source,
review, calculation, deliberate edit/deletion and frozen issue byte.

## Verification and limits

- Actual private JSON plus rendered component: two originals/thirty items,
  eight supply references/twenty-two allocation links, native paint Gl units,
  mixed delivery costs and no false unused labels. Full canonical JSON is
  identical after both read-only renderings.
- Adversarial checks: owner cost edit, supplier rate change, source deletion,
  owner deletion and deselection invalidate current allocation claims.
- Existing Vendor registration/grouping, actual bid-completion/financial
  invariants, E01–E18 bidding, Working Preview, price-summary and controlled
  issue/frozen-history validators passed.
- Production Chromium on the actual private fixture: both quotation disclosures,
  thirty source rows, one owner/two references, Vendor status, C1 owner/Vendor
  navigation, bulk disclosure independence,1440/390 containment, reload and
  exact IndexedDB preservation passed; no page errors.
- Production webpack passed with the existing large application-chunk advisory.
  Continuity/whitespace checks run at delivery. The full monorepo build chain
  was not repeated; bounded affected validators were run explicitly.

Source/SI mapping is still DRAFT. Structural loading, wind/antenna/foundation
adequacy, scope/option allocation and supplier commercial confirmation remain
engineering/commercial work. The source reference is not accepted coverage.
These checks use an isolated profile, not the owner's saved Windows browser.
Pull the same branch and restart frontend; no private JSON replacement is needed.
