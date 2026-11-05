# KU supplier pricing and canonical MR links

5-Nov-2026. Parent4a1c5b2b, existing Official Working branch. UI2026-11-05.7.

## Observed cause

The available completed-workspace fixture has two native KU/C Internet MR rows
(APF/ACP), three linked requirements, one system-level Working estimate, and no
registered original supplier quote for TEL-VSAT-KU. MGW Q26-063 has no VSAT/KU
items; its old selector returns null for an empty set. The screenshot's17 MR/32
MGW counts cannot by themselves establish KU scope. Registration is distinct
from proving that no quotation exists anywhere in the user's source folders.

The MR display also previously looked up only REQDEF-<native-ID>, then filtered
its offerIds through source-declared system quotes. That could hide authored
Requirement links, cross-system SI candidates, direct Working selections and
shared-owner Offers. Displaying OPEN in that case was not an accurate account
of the saved links.

## Change

Every existing Part-A system/COMMON source panel now has visible buttons to the
existing Vendor07.2 (`bid.vendor.offers`) and Mapping WP.7. No new Module ID/tab
or namespace migration. Unquoted systems retain their explicit missing-original
notice. Selected manual cost bases appear in a separate disclosure with exact
saved quantity, native rate, source basis and a link to the original Working owner.
This includes the existing12-month KU estimate; it is not converted into an Offer
or accepted per-MR coverage.

MR trace reads canonical workLineIds, existing REQDEF identities, directly bound
Offers and shared-owner Offers. Links open the exact Vendor/Requirement record;
authored requirement states remain visible. Requirement candidates remain labelled
pending review. Deleted Offer/owner references remain gaps; unrelated requirements
are not added just because they share a cost owner. A shared owner is described
as a price reference, not automatically approved INCLUDED coverage.

ADR0550-001 principles2–3,5–6,8–12 and13 apply: source facts versus interpretation,
many-to-many canonical links, single ownership, visible gaps, navigation, immutable
source applicability/prices/history, and supplier cost separate from allocation.
No source/financial/engineering/review/schema records are written by the projection.
Common Punch and all formal issue controls remain unchanged.

## Validation and boundaries

Synthetic regression covers authored requirement IDs, a source quote declared for
another system, direct selections, shared owners, dangling/deleted records, absent
Vendor prices and no mutation of canonical data. Actual fixture audit covers all20
groups and88 numeric owners with exact financial/source/output preservation.
Production webpack and affected Bidding/Working checks passed. Seed production
browser passed both existing targets, native MR display,1440/390 containment,
unchanged workspace and reload. Final actual project production browser passed:
the two unquoted KU rows, the saved12-month estimate and exact owner,Vendor07.2,
mobile/reload and the whole saved-workspace hash,Vendor07.2/WP.7 navigation
and zero page errors. The full all-project WP.7 view is large; this change does not
redesign that existing view or claim full-project engineering acceptance.

This is a visibility/navigation correction, not completion of KU procurement or
engineering. A current provider quotation/configuration, supply responsibility,
service basis and reviewed MR mapping remain necessary. The user's Windows saved
browser has not been accessed; there is no customer issue or merge.
