# Cost integrity — Color-coded Hierarchical Nested Accordion

Date: 2026-10-24 (Asia/Bangkok)
Branch: `fix/pj2608-0553-integrity-nested-accordion-20261024`
Base: `85a5c16e61b29755b5a1721f502265f6db71640e` on `fix/pj2608-0553-original-bc-annex-price-status-20261023`.

## Requested behavior and integration

The owner requested +/− disclosure for the Cost integrity / 8-step verification panel in 10.1, applying the established Color-coded Hierarchical Nested Accordion standard. CommercialWorkspace0553 still calls CostIntegrityReview0553 at its existing location. Evidence still comes exclusively from COST_INTEGRITY_0553; its data and all pricing/approval logic are unchanged.

- Preserve parent ID `bid.budget.integrity`, initially collapsed with visible title, evidence counts, total-cost qualification and Copy ID.
- Reuse ControlledModuleSection0553 for three independently collapsible children: `.steps` (blue), `.mr-coverage` (teal), `.vendor-register` (amber).
- Headers show numbered groups and source status/counts. Colors identify information categories, not approval.
- Expand All / Collapse All operates on this panel only, including its parent. Controls remain reachable while the parent is collapsed.
- Preserve all three source tables, notes, source currencies and quote overlap qualifications. Wide tables scroll horizontally.
- Update curated What's New to 2026-10-24-R32 with NO_PRICE_CHANGE.

## Validation

PASS: eight-step-working-contract, budget-change-summary, nested-module-contract, git diff --check.

PASS: isolated React/jsdom interaction check of four unique IDs visible in summary elements, initial collapsed state, independent disclosure, Expand/Collapse All, unrelated-panel isolation, Copy ID without toggling, preserved table row counts (8 steps, 4 MRs, source vendor count), and immutable evidence. This was a temporary QA harness, not a new production dependency.

PASS: `npx webpack --mode production` (three existing asset/entrypoint size warnings); webpack dev compilation also succeeded.

BLOCKED: full `npm run build` stops at existing `validate:0553-revk-abc-ownership` with `Rev.K B1/B3/B9 / Part B canonical Working Sell divergence`. The failing source, its input ledgers and validator are unmodified by this UI commit. Do not relax that check as part of this work.

PENDING: real-browser visual inspection (desktop/mobile table scrolling and focus styling). Playwright Chromium download returned an invalid/truncated archive, so no visual PASS is claimed. User workstation build/runtime acceptance remains pending.

## Applying to the active worktree

This branch is based on the October 23 B/C annex branch, not a claim about which branch is currently checked out on the user's workstation. Fetch and cherry-pick this focused commit into the active branch if it already includes later work; do not replace that worktree with an older branch. Restart the frontend dev server after applying so the build revision refreshes.
