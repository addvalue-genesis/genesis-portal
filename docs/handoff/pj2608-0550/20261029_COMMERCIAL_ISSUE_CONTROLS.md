# 0550 — Commercial issue controls

29-Oct-2026 (Asia/Bangkok), UI `2026-10-29.9-preview`.
Base: `a4fa70a6` (all-system AVL), existing Official Working branch. No change to module IDs,
project financial inputs, current supplier selection, customer columns or history.

## Implemented

- E06 elapsed duration retains scientific unit `DAYS`, and binds to the existing
  bidding unit `day`. Rate/output comparisons use this explicit equivalence.
  A duration is never converted into MD or MH. Activity drivers accept the same
  day equivalence; their quantities and rates are not changed.
- Requirement, proof, activity, AVL and scope dependency keys include the relevant
  schematic nodes, shared nodes, incident edges and adjacent endpoint nodes.
  Relevant topology changes stale linked reviews and Official bases. Unrelated
  isolated systems do not change another system's requirement fingerprint.
  This is dependency coverage, not topology adequacy or automatic BOM derivation.
- Existing `bid.budget.release` now contains readiness details, internal backlog
  export, explicit authorization/current-form confirmation, frozen issue exports,
  history and separate actual transmittal records. No new Module ID is introduced.
- Readiness checks actual Integration and Official projections, all selected USD
  prices, Base total, source intake/findings, FX and mapping. Provisional pricing
  cannot be authorized from its UI. No checkbox bypasses missing prerequisites.
- An authorized issue freezes the saved raw workspace (without recursive issue
  history), exact customer-row projection and totals. Authorization metadata is a
  local user record, not authenticated identity or a digital signature.
- The same IndexedDB transaction that checks the workspace revision enforces
  append-only issue/transmittal history. It recomputes readiness and customer
  output from each new frozen snapshot before saving. A normal authorization
  must freeze the actual pre-save workspace and cannot also edit its prices.
- Working edits never alter the frozen issue. Export uses that issue's stored columns,
  authorized date and exact customer output, without rerunning future pricing rules; customer XLSX omits internal review
  and authorization notes. Download does not create a sent/transmitted state.
- Recorded transmittals require the frozen issue, actual date, recipient,
  reference/evidence and recorder. No email, Drive share or submission is sent.
- Workspace backup includes issue history. Explicit backup import validates each
  newly restored issue at its authorized date, merges history, retains local
  records and rejects conflicting IDs/numbers. Old backups cannot erase issues.
  Workspace backup input allows 64 MiB; source/SI intake remains 16 MiB.
- Status distinguishes HOLD, READY_FOR_AUTHORIZATION, AUTHORIZED_NOT_SENT and
  ISSUED_RECORDED. Current Working may differ from a historical issued snapshot.
  A matching current issue does not by itself make changed/expired evidence ready.

## Principles invoked

ADR-0550-001 **2–6 and 8–14**: units and source meaning, canonical allocation,
visible missing inputs, topology dependency review, single-owner financials,
source-to-output trace, frozen commercial history, stable IDs, project-wide
readiness and engineering acceptance separate from software calculations.

## Validation

- `validate:pj0550-release-issue`: E06 quantity/rate binding, MD mismatch rejection,
  real all-scope synthetic readiness, explicit authorization, missing/future
  evidence rejection, exact frozen output, immutable/append-only history, backup
  restoration/conflict handling, separate transmittals and native frozen XLSX.
- `validate:pj0550-release-issue-browser`: isolated synthetic workspace; actual
  UI authorization, IndexedDB save, native XLSX download, separate transmittal,
  reload and old-backup import preserving frozen history. No external sending.
- Final integrated base: all 15 non-browser 0550 validators passed, including
  the concurrent all-system AVL regression. Three current browser suites passed:
  commercial issue, recovery, and SI with the actual private work package.
  Production compilation passed with the existing asset-size warning.
- The older `validate-pj2608-0550-bidding-browser.cjs` was also attempted. It stops
  at its obsolete ten-tab assertion (the application already has eleven including
  AVL/Deviation). Its later legacy assumptions were not represented as verified
  or weakened to bypass current Integration gates. No application defect was
  established by that tab-count failure.

These fixtures are not real project approvals, rates, FX or applicability results.

## Actual project boundary

The private project review package remains separate from the public repository.
Available source material establishes 19 systems plus COMMON, 264 canonical MR
Working rows, 139 preserved supplier offers, and private engineering drafts.
It does not supply an approved complete engineering/commercial release. Missing
scope/prices and source conflicts remain OPEN; no allowance, guessed quantity,
new FX, substitute supplier or fabricated approval is inserted to close them.

The user's saved Windows browser workspace has not been read by this session.
Its exported workspace is needed to use their actual current FX, edits and
selections. A fresh code seed is not a replacement for that saved workspace.

Remaining engineering work includes full applicable source/drawing review,
selected model and interface verification, exact MR/offer allocations, derived
CAL/RPT with real design inputs, B/C resources and rates, customer acceptance of
applicable deviations, and the customer's actual submission authority. The new
workflow supplies recording and preservation; it does not grant that authority.
Full transitive impact reporting and shared proof/activity cardinalities remain
separate architecture work.
