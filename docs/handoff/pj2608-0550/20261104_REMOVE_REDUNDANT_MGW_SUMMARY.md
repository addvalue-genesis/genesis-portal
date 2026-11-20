# Remove the redundant MGW price summary from10.1

Parent `06944d581697637216aecdf2ca5d5f9389f8fd8b`; UI2026-11-04.16.
Same Official Working branch / draft PR53 / port3050.

Owner explicitly requests removal of the MGW-only price-summary table from
`bid.budget.working.sources` after confirming that07 Vendor and10.2 Working already
provide source quotations and selected cost/selling-price detail.

Remove only the import and rendered instance of MgwDetailPricingPanel0550 from
BidCommercialWorkspace. Existing10.1 MR/basis/policies, source-impact, FX controls
and navigation shortcuts remain. Keep07 Vendor and10.2 price tables, MGW native
source rows, package preparation, grouped-cost functions, editor, startup and
all saved records. The retained historical component file is unmounted; it is
not an application calculation dependency. No new tab/module or identity change.

ADR0550-001 principles5,6,8,10,11,12: single cost ownership, OPEN, reverse paths,
canonical records, frozen outputs and stable existing UI remain. No financial,
quantity/FX/selection, mapping, review or engineering acceptance is changed.

## Verification

- Production webpack passes with UI2026-11-04.16 and the removed panel text
  absent from the bundle. Existing asset-size warning remains.
- Existing MGW detail-price/FX model validator passes130 source rows in20 groups,
 17 selected draft owners, cost/selling rates, stale-review dependencies,
 duplicate prevention, MR/offer preservation, OPEN and currency conversion.
- Context/contract and whitespace checks pass. No startup/model/data/export
 implementation file changed. Windows consumption remains unobserved. - Focused actual production browser passes absence of the summary, retained10.1
  basis/shortcuts,07 Vendor navigation, existing CCTV/LAN Working prices and exact
  canonical workspace equality including offers/lines/FX/history; zero page errors.
- Mobile10.1 panel measures358px within390px viewport and shortcut stays visible.
  A broad page-width assertion found545px total page width after visiting Working;
  full-page mobile containment is not claimed or changed by this panel removal.
  The focused check is scoped to the changed10.1 panel; no unrelated CSS fix.

Existing MGW
browser coverage now checks the original prices in10.2 rather than requiring the
removed table in10.1. Retain its FX/Release/export path; the focused
`PJ0550_MGW_PANEL_REMOVAL_ONLY=1` path verifies this display removal without saving
synthetic FX. The obsolete assertion that startup EUR FX must be null is removed:
authorised saved project FX is independent of the presence of this panel.

The owner's Windows display is not directly observed; no customer issue or merge.
