# PJ2608-0553 — Requirements-Driven Engineering-to-Order Knowledge System (Architecture Rev01)
Date: 2026-10-13. Status: DESIGN / KNOWLEDGE ARCHITECTURE, **NOT IMPLEMENTED AUTONOMOUS SELECTION**.
Owner: ADDVALUE engineering. Pilot: `ZWP20 / MR-502-001 / MTO Row 4`.

## Business objective
Preserve the experienced Telecom SI engineer's rules and reasons, not merely their choices, so future engineers can reproduce requirement interpretation, vendor equivalence, complete-package BOM, field bulk and A+B1..B14+C1/C2 budget decisions without relying on one person.
System must show why an item is suitable, unsuitable, missing evidence, assumed, preferred but non-AVL, or requires deviation. Never silently convert a best guess into compliance, a quote into approved procurement, or an assumed rate into original supplier price.

## External frameworks (inspiration, not a claim of certification)
- ISO/IEC/IEEE 29148:2018 Requirements Engineering — https://www.iso.org/standard/72089.html
- ISO/IEC/IEEE 15288:2023 system life-cycle processes — https://www.iso.org/standard/81702.html
- IEC 81346-1:2022 structuring/reference designation — https://webstore.iec.ch/en/publication/64021
- IEC 61360-1:2017 component characteristics/data dictionary — https://webstore.iec.ch/en/publication/28560
- ISO 15926-1:2004 process-plant/oil & gas lifecycle data — https://www.iso.org/standard/29556.html
- IEC 60079-14:2024 Ex design, selection, installation (applicable only as required by site & contract) — https://webstore.iec.ch/en/publication/66049
- ISO 10007:2017 configuration management — https://www.iso.org/standard/70400.html
- Engineer-to-Order configuration knowledge modeled as a constraint satisfaction problem — https://www.sciencedirect.com/science/article/abs/pii/S0166361517306280
- W3C SHACL graph validation is an option, not a requirement to introduce an RDF backend immediately — https://www.w3.org/TR/shacl/
- INCOSE semi-automatic requirements trace links using embeddings + LLM classification (2024) — https://incose.onlinelibrary.wiley.com/doi/10.1002/iis2.13285

These publications do NOT themselves prescribe a single ready-made telecom estimator or prove GENESS compliance.

## Technical technique selected
**Evidence-Grounded Hybrid KBE + ETO Constraint Solver + Digital Thread.**
5 cooperating engines rather than an autonomous LLM price chooser:
1. Source/parser engine: immutable MR/BOD/DTS/SPE/STD/MTO/LAY/BLD/RPT/TC, revision, clause, table, page, source-hash, drawing-note, bidder comment. Unresolved OCR/PDF/table extraction = REVIEW and evidence pointer, never invented clause.
2. Semantic catalogue: normalize aliases/function names/technical parameters and distinguish supplier/distributor/manufacturer/customer, SKU/part no/quote line and quoted assembly from customer TAG. Synonyms search is discovery only.
3. Candidate engine: retrieve by function + interfaces + observed variants, rank recall candidates. Technical attribute filters and constraint solver determine whether a candidate configuration could satisfy **all** mandatory requirements. Unknown proof does not count as satisfied.
4. Engineering configuration/BOM explosion: assemble product, licence/option keys, Ex interfaces, mounting, fittings, spare parts, commissioning tools, cables and package inclusions. Quantities derived from requirements, topology, drawings, selected architecture; check ownership and included accessories.
5. Decision-and-commercial engine: preserve approvals, reason and provenance; compare alternatives, qualified deviations and A/B/C cost owner allocation; ledger reconcile before use. Commercial source rate is distinct from vendor catalog, engineering cost, marked-up sell amount.

## Lifecycle stage gate — do not skip
Overall existing Stage 1..8 unchanged; MAP-01..10 are **subchecks of Stage 5 only**, never a substitute.
- Stage 1 Source document register and revision/priority.
- Stage 2 Requirements, notes/comments, conflicts, tie-ins, applicable standards and battery limits.
- Stage 3 First Principles: function, architecture/interface, CAL/RPT and quantity drivers.
- Stage 4 Vendor/OEM evidence and historical knowledge from 07 Vendor (not automatic AVL approval).
- Stage 5 Candidate suitability/decomposition and MAP-01..10 sequential checks.
- Stage 6 OEM certification, RF/throughput, power, Ex/NMS, hard constraints, formal deviation disposition.
- Stage 7 Complete installed scope: material + bulk + B services + spares, overhead/teams, owning TAG and work package.
- Stage 8 10 Budgetary A+B1..B14+C1/C2, tax/FX source, cross-currency and release review.

Rule: `ProceedQualified` can allow *internal working scenario* with registered assumptions/uncertainty, but `TechnicalPass` must never be claimed without proper evidence and `CustomerRelease` requires explicit authorization. If structural identity/owner/quantity/currency fails, stop and display ERROR, do not price.

## Data model (M:N relationships)
DocumentVersion -> SourceClause/Comment -> Requirement -> RequiredFunction -> Interface -> Constraint -> ProofTask
    -> CandidateProduct (OEM, model, component properties) -> QuotedAssembly/Package
    -> QuotationVersion -> QuoteLine (original unit, qty, price, currency, Incoterm/terms)
    -> Inclusion/Exclusion/BOMExplosion -> PhysicalPart -> CostOwner (SITE/TAG/MTO row)
    -> CostEvidence -> InternalCost -> CustomerSell -> ApprovedDecision -> Test/AuditEvent.

Reference ID of an engineering source object must be immutable and contain project/revision/location scope. Company master canonical ID is separate from original supplier label and manufacturer. Multiple quotation versions per supplier, products across multiple suppliers, one TAG mapping to many parts and one OEM package mapping to multiple TAGs are all normal.

## Requirement and technical parameter normalization
Store clause original text and structured interpretation SEPARATELY, including original language; page, sheet, figure, source URL, revision, source precedence rule, applicability (MR/Site/TAG), engineering owner, verification method and confidence.
Parameter dictionaries should contain normalized units, value, requirement operator, test method and hard/soft status: `frequencyMHz, bandwidthMHz, throughputMbps, protocol, topologyRole, licences, NMS entitlement, supplyVoltageV, powerW, PoEStandard, ExZone, gasGroup, temperatureClass, protectionType, ingressIP, materialSS316L, outdoorCableRating, grounding, wavelength, coaxConnector, antennaGainDb, environmentalLoad, deliveryPlace, incoterm, warranty`. Absence of a vendor property = UNKNOWN, not match.

## Constraint model
`eligible(o,r) = all mandatory constraints VERIFIED or an explicitly approved design deviation; marketing wording by itself is never a certificate.`
For budget candidates, assign `candidateState = COMPATIBLE_EVIDENCED | UNVERIFIED | CONFLICT | REJECTED | DEVIATION_CANDIDATE`. Never use a single fabricated 0–100% 'compliance score' to override a hard constraint.
Optional preference ranking after technical filtering may consider `AVL status, performance margin, total landed/installed lifecycle cost, lead time, warranty, vendor reliability, documentation completeness, management preference`. Weights/approval rules require written management policy; never invent weights or equate a favored non-AVL item with approved AVL. For non-AVL preferred product, retain justification, alternative comparison and approval/deviation state.
`BOM.requiredQuantity = source endpoint count × engineering units-per-endpoint + independent verified drivers.`
`Cost(T,currency) = Σ_{i owned uniquely by T, same currency} Q_engineering(i) × sourceUnitRate(i)`.
Original `NULL` rate remains `NULL`; management budget allowance is a separate evidence object. No across-currency addition absent sourced FX. Keep quote-wide offer Qty distinct.

## Source precedence and conflict
Use client RFQ's actual document-order hierarchy and approved clarifications. Do not hard-code 'MR always outranks BOD' globally. A comment/note or revision can alter which clause applies; raise `SOURCE_CONFLICT` with both document references and ask qualified engineering disposition. No tacit preferred brand should supersede mandatory technical/Ex requirements.

## Historical knowledge capture (critical legacy-preservation goal)
Each reviewed case stores:
- original requirement IDs and source revision hashes;
- OEM product/quote candidates considered, rejected and accepted;
- product function/inclusion/exclusion and technical constraints by evidence;
- WHY rejected/selected, trade-off, current management preference and rationale;
- exceptions, approved deviation/reference IDs, conditions and expiry;
- affected TAG/BOM/cost owners, quote rates, quantity formula and resulting QA tests;
- reviewer, approver, approval date, rule version and sample regression fixture.
A case accepted on a previous tender NEVER silently overrides the current RFQ: reuse 'decision pattern' and test applicability in the new project. Corrections to expert reasoning become a versioned rule plus failing/passing test, not continuous LLM self-training on previous outputs. When new PDF/RFQ arrives, recompute impacted edges and show before/after diff.

## Selected grounded examples
**SCADA ZWP20 MR-502-001 Row4:** 1 Set OEM ODU is not one purchasable SKU. Current 07 Vendor Next G B-1 remote + B-2 filter + B-3 capacity key + B-4 Region 04 (quoted unit rate NULL, named US/Canada/Oman) + B-5 mount is a **qualified** working function pack. B-6/B-7 belong to IDU row5; B-8 surge row10; B-12 4ft antenna row6. Myanmar region entitlement, NMS, system CAL/availability, Ex/power and 4ft downsizing remain proof. Owner reconciliation ≠ technical approval.
**MR0003 Ex IP Phone:** EXION current QT1260576 prices Phone and sounder as separate lines; MGW P26-058 phone package includes sounder/strobe, Ex JB, certified gland and accessories. One client 'phone' TAG can be a bundle; compare complete function/inclusions and prevent double counting. The EXION+MGW alternatives are NOT additive.
**MR0002 RFI LNA:** RFI RX3852-2002-11 is OEM product, MGW is provisional working supplier; no MGW RFI LNA quote. Management THB500000/unit is an allowance, not purchase evidence. DC/alarm mating connectors not included per RFI datasheet.
**CSS Thai:** historical supplier aliases containing CommScope/Phelps Dodge/Royaltec are NOT separate CSS legal entities or proof those brands are owned by CSS.

## Implementation in existing ADDVALUE stack
Do not rewrite 0550/0553 or change existing cost ledger. Start with versioned JSON decision cases and parameter dictionary in GitHub plus test fixtures. Current source of truth stays original GDrive/SharePoint documents and controlled GitHub snapshots; R2 may store immutable original copies. When mature, AGERP manages engineering decisions/reviews, Dolibarr PROD owns approved commercial records, SQL stores relational cost/evidence versions. Supabase pgvector or an equivalent semantic index can generate shortlists, **never approve technical conditions**. TPP JSX displays grouped Company→Quotation→Candidate→Constraint→Proof and each TAG's unique cost-owner/reconciliation, with copyable module IDs.
No present assertion that current GitHub JSON is a live self-learning database: it is a controlled working snapshot and currently contains only a pilot-specific equation checker.

## Acceptance before calling the system autonomous
- Golden-case replay on representative SCADA, DMR LNA, Ex phone package and RACON, each checking exact source and revision, all function rows, missing accessories, status and totals.
- Deliberate negative tests: Region 04≠Myanmar; IP20 connector≠Ex-certified socket; non-AVL preference≠approved; NULL price≠0; currency EUR≠USD; MGW package sounder/JB double booking; historical rate≠current firm quote; duplicate TAG and alternate radio groups A/B/C.
- Cross-document revision change test reopens impacted decisions, BOM and prices with audit diff; no blanket reuse.
- Evaluate candidate-search recall *and* wrong auto-approval rate, zero unsupported cost releases, per-TAG requirement coverage and ledger deltas. Distinguish provisional working budget from customer release.
- Signoff: engineering lead owns technical selection, management controls preferred/vendor/budget assumptions, commercial reviewer owns sell release. Eventually codify delegation by role, not by person.

## Next engineering action
Before any autonomous matching: run the existing local `npm run validate:0553-controlled-tag-mapping` and `npm run build`, capture the actual results. Then design normalized `ProductTechnicalProperties`, `EngineeringDecisionCase`, `PackageInclusions`, `SupplierTechnicalDeviation` schemas and wire retrieval into pilot as READ-ONLY. Expand to MR0002/3/4 with counterexamples and independent test fixtures. Only after case-by-case validation enable non-destructive suggested choices, and later approvals workflow; avoid automatic budget posting from similarity scores.
