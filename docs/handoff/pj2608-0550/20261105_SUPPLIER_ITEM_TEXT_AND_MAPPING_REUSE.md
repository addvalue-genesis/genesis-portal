# Original Supplier item text and existing mapping-equation audit

5-Nov-2026 · UI2026-11-05.11 · parent163a1bbf · existing Official Working branch.

## Existing MR / Vendor detail correction

The owner showed the existing APF60m MR row and its full native quotation table.
It listed all15 source item names/quantities/prices but omitted the source item
specification/scope text. Exact tower descriptions already exist in each Offer's
quoteEvidence.terms and sourceRef. MGW detail exists in its original catalogue.
No new PDF extraction or inferred specification is needed for those records.

WorkingSupplierTrace0550 and VendorOfferGroups0550 now reuse one read-only
SupplierItemSourceText0550 component. It displays exact quoteEvidence.terms and
MGW native detail as text under each original item, preserving line breaks and
escaping markup. Exact duplicate strings render once. The recorded sourceRef
remains separately identifiable; missing source item text stays explicit rather
than being invented from a title or a similar quotation. Original source/PDF,
Item and Working-owner links remain. Original quote bodies remain lazy in Working.
All existing systems/quotes use this presentation, not a tower-specific text copy.

Canonical Offer/Requirement/Working records, Mapping, quantities, rates/FX,
owner selection, A/B/C allocation, review bases, customer templates/exports,
VDRL and frozen issues are unchanged. No new architectural Module ID or schema.
ADR domain principles2/3/5/8/10/12/14 govern exact source fact, traceable Mapping,
single ownership, shared views and engineering acceptance.

## Existing equations inspected before adding mapping logic

The owner's target is Customer item <-> engineering/mapping rules <-> TAG, with
Supplier Item evidence, unique physical/cost ownership, customer Schedule and
VDRL/deliverable links. A location or quotation item number is not an equipment TAG.

| Existing family | Source / responsibility | Current boundary |
|---|---|---|
| E01–E18 | 0550 serviceEquationModel/reference registers and executable serviceEquationRuntime | Existing work quantities, hours/days, cost, markup/margin/Prime, allocation and FX; not a general customer-to-TAG identity resolver |
| Eleven engineering checks | Same0550 runtime: PAGA, availability, CCTV, network/power/port/license headroom, FO loss, RF margin | Numeric inputs/units/criteria; CALCULATED does not grant engineering acceptance |
| Eight Knowledge Kernels /27 formula definitions | knowledge-kernels/library.js and project0550/knowledgeKernelBinding.js | Reusable knowledge with explicit project bindings; definitions are not proof that every formula executes |
| MAP-01–MAP-10 | project0553/data/controlledTagMappingEquations0553.json and controlledTagMappingPilot0553.js | Existing source/TAG/function/Vendor/constraint/quantity/owner/reconciliation sequence; runtime is a0553 pilot with project-specific inputs, not wired into0550 |
| Common controlledTagMappingKernel.js | normalizedEquipmentTag, matchQuotedSourceLine, deriveSourcedExtended, reconcileTagCostOwners | Generic primitives already exist. Normalization is not verification of a TAG.0550 Offer schemas/rounding and native evidence require an adapter, not copied0553 financial data |
|0550 canonical Mapping and impact | integrationWorkspace0550, mrWorkingBasis0550, changeImpact0550, c1Appendix0550, bidVolumes0550 | Existing requirement/Offer/owner/Schedule/VDRL references; not a universally complete equipment-TAG relation. tagRef can contain a site label from the native MR importer |
| GEQ/PEQ/GMR/GKR/GPE crosswalk |0550 preserved reference registers | Reference/compatibility statuses; no automatic equivalent0550 execution merely from a family name |

| Existing rule | Role |
|---|---|
| MAP-01 | Exact project/MR/site/TAG/source-row/revision identity |
| MAP-02 | Applicable requirement/evidence thread |
| MAP-03 | Required function decomposition; one TAG can contain several functions/SKUs |
| MAP-04 | Exact source line / quote / SKU / function candidate join |
| MAP-05 | Mandatory technical constraints or documented accepted disposition |
| MAP-06 | Source-backed engineering quantity driver |
| MAP-07 | Unique physical instance / cost ownership |
| MAP-08 | Quantity x original source rate, with currency and unknowns preserved |
| MAP-09 | Reconcile mapped values with authoritative Working owner |
| MAP-10 | Separate controlled budgetary continuation from technical release |

Do not add another independent E/MAP register, create TAGs from APF/ACP or imply
that displaying a full quotation maps every source Item to a specific TAG.
Future0550 TAG wiring must adapt these existing rules to actual0550 customer TAG
sources and canonical records, keep bidirectional references, and prove quantity,
ownership, review staleness and native output parity. VDRL maps required documents
and reports; physical equipment TAGs and VDRL document numbers remain distinct.
This correction implements source-text visibility only, not that future adapter.

## Verification

- Original item-text unit/SSR checks passed: verbatim30 tower descriptions,
  shared Working/Vendor rendering, native MGW detail, exact duplicate handling,
  preserved line breaks, escaped markup, explicit missing-text/source-reference
  distinction and lazy Working quote bodies.
- Actual all-system Supplier-cost and tower-price regressions passed:7 source
  quotations across20 groups, shared source identity/full totals, PAGA revisions,
  IDIE Asactual, exact original quantities/units,8 supply references and22 current
  tower allocations; canonical JSON, financial projection and customer rows remain
  unchanged. Groups lacking a direct source register stay explicitly unresolved.
- Existing Vendor register regression and continuity preflight passed.
- Production webpack build passed (existing3.59MiB asset-size advisory).
- Isolated production browser passed: exact original text for all15+15 native
  tower items beside APF/ACP MR rows, all20 source panels, shared MGW totals,
  Vendor/Working/C1 navigation, native units, source disclosure,1440/390px
  containment, unchanged saved workspace/reload and zero page errors.
- Existing0553 controlled TAG Mapping validator passed, including its source/
  quantity/owner negative cases and no ledger mutation. This verifies that
  existing pilot only; it does not establish0550 TAG wiring or acceptance.
No engineering acceptance, source/financial migration, customer issue or PR merge.
