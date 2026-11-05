# Punch controls are optional inspection and tracking

5-Nov-2026 · UI2026-11-05.10 · parent4a7d0f7 · existing Official Working branch.

The owner asked why work appeared to require pressing buttons. The previous
UI presented an unplanned → planned/waiting → closed sequence, and every row
had prominent plan/source buttons. That implied a plan was a prerequisite to
do source work, although no such dependency exists in the native validators.

Improve the same WP.8 and10.7 component, with no new Module ID or storage:

- Explain that source work can proceed directly without saving a tracking plan.
- Describe recorded plan facts rather than claiming work is waiting to start.
  Keep the existing UNPLANNED/PLAN_INCOMPLETE/ACTION_PLANNED enum values.
- Show current work/action and recorded plan facts in the row. Put its manual
  editor/source/Working links under the optional “ดูแผน / ต้นทาง” disclosure.
- Use explicit “เปิดแบบบันทึกแผน” and “เปิดต้นทาง” labels. These open the original
  editor/routes; they do not trigger an automated engineering worker or execute
  the described task. Inspecting/toggling tools never saves source or plan data.
- Keep current native tracking/closure, the correct RPT/activity editors, all
  per-MR Supplier details and original IDs, prices/Qty/FX/reviews/frozen records.
  Only an explicit plan save writes the existing plans and normal audit/revision.

This removes misleading prerequisites in presentation. It does not execute or
close the outstanding project work, assign an owner/deadline, invent evidence,
approve engineering, waive a requirement or issue customer documents. Actual
source review and engineering work remain separate and must be recorded with
evidence. ADR0550-001 §§8,10,12,14 applies: required evidence is not a forced
sequence of UI clicks; canonical native results establish status.

## Validation

- Existing Common plan/closure and Release Stage/SSR checks passed.
- Actual reconstructed DATA regression passed:88/88 known draft owners, zero
  numeric blockers,1,166 shared roots; existing native closure and deletion
  guards retain their behavior. No financial/source/quantity/FX acceptance write.
- Continuity/contracts check and final production webpack compilation passed
  (existing3.59MiB asset warning). No dependency/schema changes.
- Existing production-browser WP.8 regression passed with optional controls
  initially collapsed: source/Mapping and exact unsaved RPT work remain
  accessible without a saved Punch plan; opening the menu and inspecting original
  15+15 Supplier items leave canonical data unchanged. Explicit save changes
  only plans plus normal revision/audit; reload, filters,1440/390 containment
  and zero page errors passed.

- Final production-browser shared Release/WP.8 regression passed: manual
  editor controls are initially hidden in the optional disclosure; explicit save
  uses the same tracked plan in both views and after reload. Only plans plus
  normal revision/audit change, with no page errors.

The private fixture/browser is isolated QA, not the owner's Windows saved
workspace. No actual engineering completion, customer issue or merge is claimed.
