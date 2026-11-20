# Punch source closure, exact work routes and per-MR Vendor details

5-Nov-2026. Parent9c065470 (rebased over Release/KU updates), existing Official Working branch / Draft PR53,
port3050. UI2026-11-05.9. Continue the prior work; no new architectural Module ID.

## Completed follow-on scope

1. Common Punch now derives distinct stages: UNPLANNED, PLAN_INCOMPLETE,
   ACTION_PLANNED, OVERDUE, STALE, VERIFIED_CLOSED and UNVERIFIED_REMOVAL.
   A saved action plan is not completion. A disappeared issue is not completion.
   Only a live project adapter can verify that the exact original source subjects
   still exist and their native validators clear the tracked cause. This is
   cause-level closure, not blanket Mapping/engineering/issue acceptance.
2. Punch proof/activity actions open the existing WP.2/WP.6 editor with the
   correct requirement and CAL/RPT/delivery kind. Reuse an existing unfinished
   record where present; otherwise create only an unsaved DRAFT. RPT no longer
   defaults incorrectly to CAL. Empty inputs, OPEN conclusion and blank review
   remain. Price inputs, Mapping and source records are not written by navigation.
3. Existing Part-A MR rows now have an adjacent full-width, lazy Supplier detail
   disclosure. It reads exact canonical Requirement.offerIds (native MR identity or explicit
   authored Requirement.workLineIds link) and reuses the same
   full original quote projection as the system view. Both tower rows can open
   their15 original items with native Qty/Unit/Rate/Total and full NET, plus existing
   A/B/C owner links. Mapping is edited only in the existing SI editor. No mapping
   is inferred from the legacy price owner, no source price is adopted and no
   second cost owner or procurement total is created.

Workflow Stage (Prepare/Bid/Authorize/Post-order) remains separate from task progress
(planned/overdue/stale/verified). Both WP.8 and Release10.7 retain the same roots
and saved plans; source closure adds tracking to this existing store.

## State and storage contract

Optional `tracking` metadata extends only an explicitly saved `bidPunchPlans`
record: opaque kind/key/subjectIds, required phase and, for shared activity work,
linked original subjects. Common validates bounded strings, unique lists and
supported field structure; the 0550 adapter interprets native subject types.
Old plans without tracking remain readable. They cannot be claimed historically
closed merely because their issue disappeared. There is no automatic data write,
re-review, source replacement or private JSON deployment in this change.

New tracked plans distinguish actual closure from deletion, changed system/proof
context or a missing source. With-Bid VDRL changed to POST_AWARD cannot silently
close the original Bid-phase obligation. Unrecognized causes stay unverified.
Aggregate package/input/issue and budget receipts also retain a compact subject
identity scope key; missing or changed subject sets remain unverified. This is a
conservative change detector, not a signature or issue authorization.
Current active issues always win over a purported resolution. Source changes
make active work plans stale; native verified cause closure can be recognized
using the current evidence even though the original work plan's basis changed.
A report or record may clear one administrative cause while other source, proof,
AVL or package causes remain OPEN. Original release controls remain unchanged.

Existing WP.8 exposes stage filters, search, current work, source history and
links back to the original modules. The Supplier companion table row has no
price-owner/component identity; original MR/owner Module IDs and financial
counts stay unchanged. Native item tables mount only after disclosure. All19
systems plus COMMON use the same implementation; no tower-only Mapping store.

ADR-0550-001 domain principles 3 (row Mapping), 5 (single cost owner),
10 (canonical records / multiple views), 11 (frozen history) and 14 (Integrator
CAL/RPT evidence) govern this change. Native acceptance remains authoritative;
a Punch plan or Vendor match cannot prove engineering adequacy.

## Verification

- Common stage/closure tests, no closure by deletion or an untracked legacy note,
  live-issue precedence, unknown cause, strict optional metadata and phase guards.
- Actual private fixture: tracked administrative cause closes only after all four
  original tower requirements satisfy the native record-review validator. Deleting
  a tracked non-seed requirement leaves it unverified. Other engineering and issue
  conditions remain OPEN. These are isolated QA clones, not project acceptance.
- Exact original financial/source/quantity/FX/frozen-history preservation;88/88
  selected financial owners retain known costs/prices and zero numeric blockers.
- Per-MR source SSR proves lazy mounting and no inferred Mapping when Offer IDs
  are removed. Native15+15 items/NETs/units and receipt allocations remain exact.
- Isolated production browser passed: both native15-item MR quotations, full
  NETs/native units, current ACP selection retained by the RPT editor, OPEN/DRAFT
  unsaved proof with no implicit writes, task-progress search/filter, explicit plan
  save/reload and desktop/mobile containment, with no page errors.
- Shared Release/WP.8 production-browser plan regression passed after integrating
  concurrent9c065470: one authored plan persists in both views and after reload;
  only plans and normal revision/audit change. Native release Stage remains
  separate from task progress. No engineering, source or financial mutation.
- Final authored Requirement-to-MR source-link SSR and actual trace regressions
  passed after the browser run; original seeded MR behavior stays unchanged.
- Combined actual Common/Release regressions and context preflight passed.
  Full `npm run build` passed (213 PASS output entries) with final production
  compilation. Existing asset-size warning remains (0550 chunk3.59MiB).

Engineering acceptance, conditional bid-phase issue policy, customer authorization
and the owner's Windows saved-data consumption remain separate. No customer issue
or PR merge is performed. Pull/restart the existing branch; no manual JSON import.
