# Versioned customer TAG Mapping and nineteen-system price draft

5-Nov-2026 · UI2026-11-05.13 · parent3ac1b34e · existing Official Working branch.

The owner authorized implementation because all19 telecom systems need a customer quotation. Use the existing customer/Supplier/Working/Volumes records, existing Module IDs and customer Exhibit C. A usable price draft is separate from approved engineering, accepted commercial terms and customer issue.

## Compatibility and affected responsibilities

Read the preceding Supplier item/MAP audit. Existing E01–E18, engineering checks,0553 MAP-01–10 register/pilot and Common controlledTagMappingKernel callers are unchanged. New controlledTagMappingV2 is an explicitly versioned contract, genesis.controlled-tag-mapping/2, over the same ten stage identities. It requires nonempty exact source identities, known nonnegative quantities/rates, an injected rounding policy, nonempty owner reconciliation and unique source usage. Missing and different currencies are not reconciled accidentally. It does not load project prices or authorize issue.

The0550 adapter injects its existing Decimal half-up policy and reads native Customer requirements, source rows, Supplier Items, CAL/RPT/AVL/Deviation states, financial owners and Schedule/VDRL references. Prices are outputs of the existing financial model, not a second ledger. Source-reconciled owner counts do not mean every estimate or mixed cost is source-confirmed. Dates/validity remain a separate review check.

ADR-0550-001 principles1–6/8–14 apply: exact evidence versus interpretation, many-to-many Mapping, engineering/deliverable applicability, one cost owner, explicit gaps, bidirectional trace, revision impact, canonical shared views, frozen issues, stable UI and all-system coverage. Implemented checks below are narrower than full semantic or contractual validation.

## Existing UI and canonical save

- PJ2608-0550 / bid.working-preview.step.7: all19 systems plus COMMON, searchable requirements and ten MAP checks, separate known numerical pricing and engineering readiness, source/cost-owner/customer-row/VDRL trace and the existing Mapping editor.
- PJ2608-0550 / bid.budget.official.summary: same read-only projection over the same records.
- PJ2608-0550 / bid.working-preview.requirement.REQDEF-MR-B1-11-APF-08: optional tagBindings in the existing Requirement Mapping form. Existing bid.budget.working.line.REQ-MR-B1-11-APF-08 still opens the original Supplier details and existing Mapping route.
- Existing bid.registry.impact: source/rule/Offer → TAG binding → Requirement/Working/VDRL → current Volumes/Release. Frozen issued history is excluded.

No architectural Module ID/tab/root store or copy of supplier prices is added. An optional canonical Requirement tagBindings array records binding id, ruleVersion, native tag/site/source/locator/excerpt/quantity/unit, Supplier Item IDs, Working references, VDRL IDs and the SI basis. Existing records lacking this property keep their previous basis and validation behavior. Both existing Requirement edit entrypoints preserve the optional property. Save uses the original canonical revision/audit path; merely opening/selecting a candidate does not save.

Actual equipment rows are extracted only from native customer LIS-0001 tabular text, not from the location tagRef. Duplicate extraction passes are deduplicated. The extractor does not assert exhaustive discovery in drawings, scanned tables or other document schedules. Historical/reference rows can be cited as DRAFT candidates but cannot pass the current-source check. Missing/changed source rows, site/quantity conflicts, unrelated Supplier/Working/VDRL references and duplicate physical bindings in one Requirement remain explicit. An explicit VDRL/SDRL requirement needs a document link. Physical TAGs and VDRL document numbers remain distinct; service/document-only requirements do not acquire invented physical TAGs.

Requirement/Proof reviews include bound TAG sources, child Supplier Items and referenced VDRL records in their basis only when tagBindings exist. Source, Item or document edits can stale those reviews. Graph reachability is an explicit-reference impact view; it is not a semantic discovery engine. Missing optional TAG bindings do not silently create a new mandatory project issue gate or reinterpret already saved legacy reviews.

## Draft customer Schedule arithmetic

The available actual reconstruction had88 selected financial owners with known cost/selling values but the old Working Schedule preview also treated182 prepared MR price-reference rows as additional unpriced financial owners. Existing bidCompletionReferences already validates input keys, selected priced owners and their basis keys; no source scope is adopted by that validation.

The read-only Working preview now honors those explicit references non-additively, like the existing provisional price model. All190 reference links (182 previously counted as price gaps plus8 previously excluded) remain identifiable as nonAdditive/coverageAccepted:false. Reference rows with edits, missing owners or stale source-owner keys cease qualifying through the original validator. New unpriced independent owners still appear OPEN. Canonical selections, prices, quantities, source, terms, Schedule decisions, strict saved/issued totals and frozen outputs are unchanged. MR scope/owner coverage gaps in the native C1 projection remain visible; this does not allocate a package price to each TAG.

The native Volume I draft is generated with existing customer forms and selling prices, with an explicit owner-review/not-issued label. Draft document number is a projection-only label, not a reserved official number. Base/Option and delivery-term fields are kept separate; missing customer CIF/FOB or review responses are not invented.

## Available-data result and limits

Read-only reconstruction SourceRev13/ARev09 plus Vendor register:264 native MR requirements,538 distinct equipment rows discovered in the LIS-0001 text catalogue,0 CURRENT_TENDER equipment rows in that extracted catalogue,88 financial owners,0 missing numerical cost/selling bases. Known Base and Option selling amounts reconcile to the private review draft; the amounts are not an accepted contract value. Shared owner references mean per-system figures must not be added together. Only6 owners meet the strict original-source reconciliation in this adapter; remaining bases include estimates/packages/mixed costs and must not be labelled all Supplier-confirmed.

There are0 saved VDRL records and0 saved Schedule bindings in that reconstruction. These are actual data limitations, not a reason to fabricate tags, reviews or commitments. Native C1 scope links, commercial delivery/payment/validity and With-Bid versus after-order deliverables still need the actual source review. The more recent Source14/A10 investigation is preserved in code/ancestry but this numerical fixture is not that latest private successor and is not Jack's Windows IndexedDB. Seven input identity/revision findings remain as recorded in the preceding A reconciliation checkpoint.

## Verification

- Full production build passed all190 validators and continuity checks, including existing0553 MAP, E/FX and native Schedule/VDRL/Release/frozen-history regressions. Webpack retains the existing bundle-size advisory.
- Focused versioned MAP checks passed: strict source tuple/locator/site/quantity/unit, existing Decimal policy, empty/duplicate/negative rejection, historical versus current source, related Supplier/owner/VDRL links, canonical optional roundtrip and dependency impact. Actual private financial owner amounts and native customer pricing are unchanged by TAG binding.
- Actual Schedule preview has88 active/priced owners,0 missing numerical prices,190 non-additive references and no saved binding or scope adoption. Native Exhibit C HTML rendered with the19-system review cover, correct separate Base/Option subtotals, shared PABX reference, COMPANY-supply AIS with SI service retained, and no original tower supplier costs.
- Isolated production browser passed existing WP.7 and pricing summary, ten MAP stages, explicit saved historical TAG draft with real Supplier Item, reload, unchanged input/price/history records, no false approval, and1440/390px containment. This is not a check of the owner's Windows profile.
- Existing actual all-system Supplier-cost check passed:7 source quotations across20 groups, original source figures/units unchanged; VSAT/KU/video conference/AIS do not acquire a fictitious direct original quotation.

No customer issue, external transmittal or PR merge. Do not infer formal customer readiness from a numerical subtotal.
