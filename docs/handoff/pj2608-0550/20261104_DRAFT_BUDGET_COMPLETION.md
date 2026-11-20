# A/B/C numeric draft-budget completion

2026-11-04 · UI2026-11-04.19 · parent8ab117b9 · existing branch / draft PR53

## Owner direction and result

The owner explicitly asked to finish the remaining package allocation and B/C pricing work. The existing10.5 now has a complete numeric **draft budget**, on received quotations plus clearly labelled new planning estimates. This is not a claim of fully confirmed RFQ scope, a fixed supplier quote, accepted engineering, an approved customer offer or an issued document. The distinction is visible in the existing summary, not hidden in developer notes.

On the exact available SourceRev13/ARev09 workspace, all88 financial price owners have cost/estimate and selling amounts:21 PartA,57 PartB and10 PartC. Draft monetary gaps and unmapped financial owners are zero, including Base A+B and separate Option C totals. Prior54 calculated selling amounts and all existing known costs remain exact. Every original PartA/MR record, quantity, source quotation, FX, calculation, engineering record and frozen issue stays unchanged. Three supplemental system-budget owners and one incremental shared-bulk owner are new Working records; architectural/display Module IDs are unchanged.

## Price and scope treatment

- Partition both original Master Tower quotations into their existing supply-only owner and disjoint quoted engineering, TSSR/soil, delivery, erection and civil/earthing/fencing/site-finishing owners. Never buy the full net quote again. Quoted tower civil excludes piling, inaccessible-site extra transport and pipeline civil/trenching; these have not become confirmed scope.
- CERAGON spare option uses one quoted package containing two ODUs, not two times its whole-package price. It is a proposed capital-spare price basis, not an OEM-approved ten-year complete spare list.
- B/C unquoted work is filled only on untouched defaults, labelled ESTIMATE with quantity/rate/percentage assumptions. Internal costs for exact protected TSI labour plans are separate labelled cost estimates; protected selling inputs remain exact. Existing training travel and cargo cover reference their existing owners. List/normalization tasks are non-additive, not extra purchases. Existing B7/B8/B9 internal WBS/IDs are retained and assigned to existing native customer B1/B4 rows; no customer row is invented.
-182 untouched native PartA details get **pricing references** to selected package/budget owners, without changing raw MR records or claiming technical coverage. Package references are non-additive and use source requirements and selected Working evidence. Embedded PBX/NVR/MET detail follows its existing parent price reference. Original raw quantities, including unknown cable lengths, are preserved.
- A pricing reference is conditional on exact native input and owner/offer/calculation keys. A changed MR input, missing/deselected owner or changed quoted price invalidates it. A separate warning identifies changed source, quantity, price or FX relative to the saved budget basis. The versioned preparation does not overwrite later edits or recreate deleted owners. Saved reserve amounts remain a dated planning basis until re-estimated; no promise of automatic risk/quantity engineering is made.

## Material estimate assumptions — must stay visible

These are authored **bid planning assumptions**, not findings from the RFQ or vendor quotations:

- VSAT support: native cabinet/router/kit/cable quantities at separately labelled budget unit costs. COMPANY terminal supply remains excluded; router responsibility and detailed configuration are unconfirmed.
- KU/C Internet: per-site terminal/accessory allowance plus12 planning months of service. Duration, provider, bandwidth and responsibility are not confirmed. The proposal must qualify this assumption until reconciled with the RFQ; it is not an unconditional commitment to all service periods.
- Conferencing: native audio/video package quantities at explicit budget rates; manufacturer, codecs, licences and interfaces are unconfirmed.
- Bulk: assumed three5km pipeline-route cable/duct pools and four3km site cable pools, plus20% termination/accessory provision, less the entire already-priced MGW bulk cost. These are not verified route lengths, a closed MTO or proven supplier coverage. The existing quoted package and incremental provision are never counted twice. Physical installation/civil remain separate.
- Spare provisions: startup2%, precommissioning1%, commissioning1%; capital6% of non-microwave procurement basis plus the separate CERAGON package; two-year consumables2% and routine replacements1%. They are monetary provisions, not approved item lists, failure-rate calculations or evidence that no additional hardware is required.
- Shipping, additional OEM training/travel, tools, fees, insurance and installation crew-days use the explicit assumptions shown per row. Insurance percentages are budget provisions, not premium offers, policy wording or confirmation of cover. C1 mounting/cabling/FO workload is not a verified installation takeoff. VAT, duties, gross-up, deductibles and unconfirmed supplier quote validity still need applicable commercial treatment.

No historical aggregate B/C allowance or old full-project total was silently substituted. No private source prices or completed workspace is committed to public Git. The new estimate parameters are explicit code-owned planning assumptions, analogous to the existing TSI labour/travel budget, and are disclosed in the current Working UI.

## Implementation and governing principles

The internal helper bidCompletion0550.js extends the existing versioned repository-preparation receipt. It is not a new architectural module. Existing canonical equations produce all costs, margins, FX and selling totals. ADR0550-001 §§3/5/8/10 govern the non-additive source/Working/price references; §§6/9/11 govern estimate disclosure, source/owner invalidation, authored input preservation and frozen history. The owner's bid-stage clarification to §14 permits a priced draft with stated assumptions; it does not certify engineering or waive With Bid requirements.

Controlled Official review, RFQ/engineering acceptance and customer issue remain separate and HOLD. Existing frozen issues render/validate through their original policy; no new approval, customer send or PR merge is performed. First-time startup can fill untouched defaults once existing private DATA is present. Git contains code and planning parameters, not the owner's saved browser workspace. Windows consumption remains unobserved.

## Verification

- Actual-data model/receipt/schema: PASSED. All88 financial owners priced; all native equipment rows exact; previous known prices/costs, sources/FX/calculations/SI/history exact; disjoint source tower partition; one CERAGON spare package; no duplicate/shared-travel/cargo charge; complete draft Base/Options totals; strict Official remains unapproved.
- Adversarial checks: PASSED. Empty/missing DATA and ambiguous effective-current MR do not install a budget. Authored zero/nonfinancial edits survive. Repeated preparation is identical; handled deletion stays deleted; changed MR input or missing owner invalidates its reference; changed FX/source/price basis is disclosed.
- Existing bidding/E01–E18, Working Preview/SSR, price summary and controlled issue/frozen-history validators: PASSED.
- Production browser on repository seeds and actual private workspace: PASSED. Startup, quoted-versus-estimate disclosure, non-additive references, computed quantities, existing price-owner navigation, A/B/C display, read-only inspection, reload,390px containment and zero page errors.
- Final production webpack and continuity checks: PASSED (existing3.47MiB chunk advisory). Git whitespace check passed. Remote content readback follows branch delivery; Windows consumption remains unobserved.

## Delivery

Code update on the same branch; no new Source/A JSON is needed. Existing private Vendor DATA remains the source of real quoted prices. Pull and restart frontend, then inspect10.5 / PJ2608-0550 / bid.budget.official.summary. The dated draft and assumptions must be reviewed before treating this as a fixed compliant customer quotation.
