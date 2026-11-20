# 0550 — C1/A1 reconciliation and audit of existing service bases

1-Nov-2026, Asia/Bangkok. UI `2026-11-01.2-preview`.
Verified published base `0465063db7f8b378ce244f9814dd6f63523a484c` on
`feat/pj2608-0550-official-working-20261028`; port 3050.

## What the detailed GitHub inspection established

The user's correction is valid: a blank mutable Working field is **not evidence
that the prior work/quantity/rate is absent**. Availability, current applicability,
allocation, review and missing evidence must be distinguished.

| Existing source in the verified commit | What is actually present | Current authority / limit |
|---|---|---|
| `data/reference/pj2608-0550.reference-registers.json` → `b1CostLineage` | 19-system Engineering 1,220 MH; Interface 146.8 MH; VDRL lifecycle 2,093.6 MH; Common 2,089.6 MH; system/role/cost detail | Recovered **Rev04 5-Oct-2026** budget model, not new current-scope inputs |
| Same → CCTV | Engineering 96 MH / 12 equivalent days; VDRL 136 MH / 17 equivalent days | Historical work-object basis; equivalent days are not a new crew/trip plan |
| Same → Common examples | COM-001 PM: 1,209.6 MH, USD81.25/h selling basis, THB875/h internal source cost; COM-002 procurement 640 MH; COM-003 regulatory 240 MH | Stored source rates/costs, not fresh payroll quotes or current price approval |
| Same → B1 reconciliation | Recovered base THB11,155,029.32 versus old allowance THB24,000,000; difference THB12,844,970.68 | Specific unreconciled difference, not a declaration all B1 work is missing |
| `data/snapshots/pj2608-0550.rev07.json` | 7 role rates; 7 campaigns with days/locations; commercial policy; B/C activity detail | Controlled **Internal Budgetary Rev10** proposes **THB580M**; an old estimate, not the selected current Working total |
| `serviceLineDerivation` / E01–E18 | Work objects, document lifecycle, PM/FTE, interfaces, events, trips, MH/MD, cost/sell/FX logic | Reusable method. Some source inputs explicitly still pending; do not invent them |
| `data/mgwQuote0550.json` + current supplier offers | Engineering/PM USD120k, documents USD50k, integration/assembly/inspection/FAT USD80k, packing/marking/delivery USD5k, tagging USD500 | Five priced source service rows total USD255,500. Current saved offer edits take precedence. On-site source row is genuinely TBD. Inclusion/scope still separate |
| `commercialSources` → A20261632 | Source documentation/PM, FAT, packing, service/commissioning kits and software groups | If that package is selected, these source groups are included, non-additive. Group prices precede package discount; do not add them again |

The MH figures above and THB580M are from **different revisions of the old
estimate**. They must not be described as current quantities recalculated from
latest A + selected Supplier products. Current data must rebind the methods and
review the changed scope. Neither old monetary totals nor old MH are silently
posted into current Working.

### Confirmed code breakpoints

- `data/adapters/controlledSnapshotAdapter.js` loads the Rev07-named controlled JSON;
  its embedded `budgetaryEstimate.revision` is Internal Budgetary Rev10.
- `data.js` exports CORE_TEAM, EXECUTION_CAMPAIGNS, BUDGETARY_ESTIMATE and references.
- `importLegacyVendorBasis0550` imports **Part A quote anchors only**, deliberately
  excluding historical allowance totals; `prepareRepositoryBidBasis0550` inherits
  only a wholly blank historical FX basis, not B service detail.
- `importMrWorkingBasis0550` creates MR requirements with the native quantity where
  present, but `manualCost`/`sellRate` null. Many MR activity quantities are null.
- `applyRoleDraft0550` already supports choosing the stored role selling rate in
  the Working editor; this is not automatic role allocation or internal cost.
- E01–E18 execute saved `data.calculations`; the recovered reference workload is
  not automatically a saved current calculation. A and private SI preparation
  can add records via the existing paired JSON route; user-local contents were
  not inspected or overwritten in this audit.
- Thus old detailed bases and a blank mutable row can coexist. A status must say
  'existing basis, not yet bound/reconciled' rather than implying no data exists.

## Recheck requested after the old budget was identified as erroneous

The owner explicitly directed rechecking calculations against the 0553 Release
method because the first budget was wrong. The old MH/THB580M material is therefore
**reference evidence only**, not a repaired current budget or automatic driver set.
The new service panel labels this distinction, preserving current user inputs.

Current calculation/display defects were corrected in `bidWorkspaceModel`:

- DIRECT Working SELL was withheld when internal cost was unestablished, despite
  an explicit current quantity and selling rate. The provisional layer now calculates
  E10/E13 from those explicit current inputs. `costState` / `sellBasisState` distinguish
  known SELL from unestablished COST. Native/THB cost stays null, never zero. Official
  review and Release retain their cost/evidence gates. MARKUP/MARGIN still require cost.
- A native USD draft price formerly required a USD→THB→USD trip even if FX was
  unavailable. Native USD can now be displayed without inventing FX; THB remains
  unknown. EUR→USD and THB→USD still require actual dated conversion inputs. Where
  existing FX is present the original rounding/conversion path is retained.

- C7 Working Preview did not reuse the source-backed Hday of its linked E05
  MD calculation. New suggestions and blank saved C7-hour projections now derive
  that precise current Hday, converting MD to MH without changing the amount.
  Explicit existing hours are preserved; no 8/10-hour default or old-campaign
  assumption is introduced. Opening does not write or modify the strict view.

New `validate:pj0550-release-method` exercises MD vs MH/paid rate units, E06 elapsed
vs resource days, E07 resource cost, E11 markup vs E12 margin, E13 Prime, E17 FX,
E14 shared-pool conservation, duplicate-owner rejection, separate cost/sell and source-bound MD→MH C7 propagation.
It checks no old-budget inputs are imported and Release stays HOLD for missing cost.
The executable E01–E18 mathematical definitions were checked and retained; no
0553 FX, rounding-up increment, rate, schedule, role or WBS numbering was copied.

## Implemented corrections

1. Working-preview A1 GOODS now shows the **known selected C1 customer-selling
   subtotal**, priced/expected owner count and missing-price count. C1 footer uses
   the same unique owners, excluding package component references. No-price stays
   null, explicit zero stays zero. A1 contract lump sum/words stay OPEN until the
   whole scope reconciles. Other A1/C7/C8 preparation subtotals follow this policy.
   HTML, Word and the A1 worksheet retain partial-sum warnings. Reviewed/frozen
   paths retain their original strict sum behavior and bytes.
2. Existing WP.6 and 11.M now show product → requirement/activity → calculation →
   one Working cost owner, with actual links. Project/common context is labelled
   as context; it is not an asserted product-specific obligation or multiplier.
3. The same panel displays the **actual stored legacy workload, source date,
   role rates/campaigns and current supplier service evidence before diagnostics**.
   Old budget bases are labelled historical references, separate from current
   Working. Priced supplier evidence, selected owners and included OEM groups
   are visible instead of treating all blank rows as missing information.
4. No automatic rate/quantity/FX/margin/selection/requirement/approval mutations.
   No fabricated all-project cost from the old estimate. Actual current binding,
   authority, acceptance and coverage gates remain in force; this is not a claim
   that all existing OPEN checks have been closed.

## 0553 comparison actually inspected

Fetched current branch refs and read `officialUsdRelease0553.js` at
`59190ad67513cd55cdb4f5b25530461e281511e4`: customer totals use priced rows with an
explicit unpriced list. Read `bcWorkCostLines0553`, `bcExecutionActivities0553`,
`bcTurnkeyWorkingCost0553`, and current B1 lifecycle at
`d8708bcd4c1a7bf010414322bb6073ef02896391`. These distinguish work-object/resource
quantities, Working SELL vs direct cost, non-additive clauses and shared owners.
Only that method is reused. 0553 category numbers, rates, FX, quantities,
logistics decisions and project prices are not copied into 0550.

## Validation / governance

ADR-0550-001 principles **1–6 and 8–14** apply: inspect existing sources before
claiming absence, distinguish facts/current adoption, retain traceability and one
owner, disclose actual gaps, preserve current decisions and frozen history.

Targeted tests cover: mixed priced/unpriced C1 → A1 in native HTML/Word/XLSX,
known-vs-total separation, component non-additivity, null vs explicit zero,
unchanged inputs/history, legacy native/frozen restore, three-volume readiness,
Working 1–8/AVL/Deviation regressions, actual recovered MH/rates/campaigns and
supplier prices, explicit-vs-context-only links, canonical E05 MD/MH recalculation,
common obligations surviving equipment deselection and unchanged 15 module IDs.
Isolated browser checks actual A1 price/warnings and Word download, independent known DIRECT service SELL with cost unestablished, C1 components,
legacy basis/rates/supplier evidence, product filtering, no database writes,
mobile containment and no page errors. Production webpack passes with the
existing size warning. Partial A1 Word is rendered and visually checked.

Tests use repository sources and synthetic commercial fixtures, not the user's
private Windows workspace. Full monorepo validation was not repeated. Windows
pull/restart and customer submission remain separate; no formal issue is made.
