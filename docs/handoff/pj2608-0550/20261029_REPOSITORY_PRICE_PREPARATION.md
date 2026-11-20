# 0550 — Continue pricing from repository JSON

29-Oct-2026. UI `2026-10-29.10-preview`, base `c5948a22`.

The user explicitly directed us to use the JSON/code already in GitHub and continue
preparing prices. A browser workspace export is not a prerequisite for this workflow.
This supersedes the earlier commercial-issue checkpoint's assumption that an export
was needed before further pricing. Browser-only edits remain separate; nothing here
claims to have read them.

## Implemented

- Existing provider preparation now carries forward the controlled snapshot's
  historical THB/USD planning rate only when all FX fields are blank. The original
  source date and repository snapshot ID remain visible. No current-market-rate
  assertion or EUR FX is generated.
- A validated optional `repositoryBasisImport` marker makes preparation one-time.
  Existing partial/full FX, later intentional clearing, selected offers, quantities,
  costs, source records, engineering decisions and frozen history are preserved.
- The marker is administrative and excluded from the frozen issue's price-basis
  fingerprint. An actual FX change still changes that basis. Existing release
  readiness/authorization gates continue to execute.
- Existing Working, Budget and 10.7 projections calculate from this same FX object;
  no parallel pricing engine or new Module ID is introduced.

## Principles and limits

ADR-0550-001 **2, 5, 6, 8–14** apply: source fact/date preserved, no invented
conversion or additive package duplication, visible missing inputs, canonical
source-to-price projection, user decision/history preservation, all-system scope
and engineering acceptance distinct from arithmetic. Preparation supplies neither
engineering approval nor a complete project price. Historical management allowances
remain reference data and are not promoted to supplier cost.

## Validation

- All 16 non-browser 0550 validators passed, including the new real-repository
  preparation regression: 264 MR rows, 139 offers, original FX/date, known USD
  draft amounts, EUR/project total OPEN, no mutation, repeated preparation,
  deliberate clearing, saved partial/full FX and history preservation.
- Production compilation passed with the existing asset-size warning.
- Current release-issue, recovery and SI/private-package browser suites passed.
  The release positive fixture is isolated synthetic data, not project approval.
- The older bidding browser harness retains its previously documented obsolete
  tab-count assumption; it is not included in this pass claim.

Private review outputs are delivered separately. Source/offer engineering conflicts,
missing execution drivers, EUR FX and approvals are actual remaining work; lack of
a browser export is not the reason those repository inputs remain incomplete.
