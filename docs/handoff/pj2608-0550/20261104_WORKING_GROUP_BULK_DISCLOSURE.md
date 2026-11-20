# Expand/collapse every Working child group within a Part

Parent `85b212bf47c21903fff2df9bf89e5ad46d56a5f4`; UI2026-11-04.15.
Same Official Working branch / draft PR53 / port3050.

Owner requests one command in existing `bid.budget.working.part.A` to expand or
collapse all its system groups, instead of clicking each radio/PAGA/etc. header.

## Implementation and boundaries

Existing WorkingHierarchy now places + Expand every heading / - Collapse every
heading buttons beneath each existing Part A/B/C summary. A command targets only
that Part's direct native group disclosures. Part A retains19 systems plus COMMON;
B/C use the same controls within their own existing sections. The parent stays
open, another Part is unaffected, individual keyboard/mouse toggles stay native,
and nested quotation/reference detail choices are retained. Module Search keeps
its existing ancestor-opening path. Existing IDs, Copy ID, order and colours stay.

No new tab/module/store or canonical UI-preference record. Commands change only
native details.open, following the existing navigation mechanism; no pricing,
quantities/FX/selections, source authority, review stamp or frozen output changes.
No reload persistence is promised for these native disclosure choices. No financial
kernel, source importer or exporter is edited by this change.

ADR0550-001 principles5,6,8,10,11,12 apply: single cost ownership and OPEN remain
unchanged, existing reverse paths and one workspace remain, frozen history and
stable UI identities are preserved. This is a disclosure control, not a new
engineering/coverage acceptance gate.

## Verification

- Production webpack passes; final bundle contains UI2026-11-04.15. Existing
  asset-size warning remains.
- Focused actual production browser passes all20 Part A groups; independent
  A/B/C commands, individual keyboard toggle, nested reading choices, Module
  Search reopening only the requested collapsed group, original Copy ID,390px
  containment and exact canonical workspace equality. Zero page errors.
  Run the existing price-summary browser validator with
  `PJ0550_WORKING_GROUPS_ONLY=1` for this bounded regression. The new checks
  also run before the normal full summary/Release path.
- The first browser attempt asserted synchronously before existing Module Search's
  deferred ancestor opener ran; corrected the check to await that existing effect.
  Application navigation was not changed.
- Context/contract and diff-whitespace checks pass. No financial/model/export
  validator is claimed as newly run; those kernels are unchanged.

The actual owner's Windows consumption and reload preferences remain unverified.
The original checkout contains unrelated dirty work; test in a separate worktree
whose initial tree exactly matches remote85b212bf, with only this change applied.
Do not revert, stage or publish unrelated dirty Vendor/source files.
