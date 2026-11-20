# Restore original Schedule A / A1 / A2 visibility

3 November2026, Asia/Bangkok. Parent local commit `2d4ee1c2`.

The owner supplied native A1/A2 screenshots and asked to recover the previously
implemented forms so customer-source/SI work can feed outputs10/11/12. Inspection
confirmed the forms, schemas, calculations and exports already exist. The2-Nov
C1/C2 display focus hid their tabs by default; no form or canonical price had
been deleted. Do not create replacement forms or rename the existing IDs.

## Change

- Volume I opens existing `bid.quotation.A1`; all13 existing Schedules are visible
  by default, including A/A1/A2/B/C/C1–C8. Optional C1/C2 focus is retained.
- Existing `bid.quotation.A`, `.A1`, `.A2` shortcuts are visible from10's Official
  Working screen. The native summary still derives from canonical Working and
  Schedule allocation; no duplicate editable total or manual price store is added.
- The lazy11.P preview includes all forms by default. Full-package and frozen
  exports retain their existing content. Dirty guards and direct hidden-form
  navigation are unchanged.
- UI `2026-11-03.5-preview`; existing15 architectural Module IDs, labels/colours,
  source/requirement/proof/offer ownership, financial inputs and frozen history
  remain unchanged. Form A1/A2 is part of11 Volume I;10 retains its existing
  Working PartA / services / options derivation. Keep those namespaces explicit.

ADR-0550-001 §§5–6,8–13 apply: one cost owner, transparent open scope, traceability,
shared canonical records, stable IDs, frozen history and full required scope.

## Actual audit boundary

The preceding PAGA217 new TAG candidates use DTS as their customer source. The
existing95 authored PAGA drafts contain PHI/SPE/DTS/STD/BLD/LAY/other sources;
adding a quote revision note did not review/approve all95 clause mappings.
In the recovered reconstruction,16 derived PAGA MR catalog defaults still have
empty sourceIds, five existing SI RPTs are OPEN, and no PAGA scope review is closed.
The importer protects data integrity but does not execute engineering interpretation
or prove that every applicable source family was fully read. A is A_OPEN; global
107 expected /100 receipt-passed /73 exact candidates /0 fully reviewed inputs
are reconstructed results, not a read of Windows IndexedDB.

Existing `systemConstraints0550`, `deriveIntegration0550` and source/readiness
controls must drive clause-specific continuation. An all-family requirement
context is not an accepted item allocation. SOW, interface/AVL LIS, BLD/LAY,
bulk/MTO, received RPT/CAL and derived proof applicability need explicit treatment.
Do not promote quote gross/net evidence to a complete customer CIF/FOB price.

## Deliverables outside Git

Private outputs10/11/12 were prepared from existing canonical models and native
renderers: internal multi-source/price derivation, the original A/A1/A2 forms as a
qualified PAGA-only price scenario, and five authored VolumeII sections. A v2
existing SI package adds technical drafts and an integrated requirement; it
preserves all financial records and does not import any completed reading or
approval attestations. It requires quote002 source successor already installed.

The price scenario reuses the recorded legacy commercial policy and FX in a
separate in-memory projection only. Active selections are unchanged, unresolved
AP712 addition remains in current data, and XBC is not duplicated in the scenario.
Full PAGA/project amounts remain unestablished where scope/services/logistics are
unpriced. Private evidence and financial deliverables must not be committed.

## Verification

- Existing bid-volumes regression/React SSR passed: A1 default and all original
  Schedule tabs visible; optional C1/C2 function/registry, VolumeIII and data intact.
- Working→Schedule and native Exhibit C regressions passed: all13 original forms,
  A1/A2 rollups, CIF/FOB handling, prices/source/history and frozen Word parity.
- Updated browser scripts parse. Browser interaction/Windows installation was not
  run because Chromium is unavailable; do not describe the authored browser checks
  as executed.
- Production webpack passed with the existing3.23MiB asset warning (14601ms).
- Private technical package passed canonical validation, repeated-import no-op,
  five authored sections and financial/source-selection preservation checks.

The prior GitHub push was blocked by automatic approval review. Do not retry or
switch publication mechanisms absent explicit authorization for the payload and
destination. Local commits/patches and private deliverables remain available.
