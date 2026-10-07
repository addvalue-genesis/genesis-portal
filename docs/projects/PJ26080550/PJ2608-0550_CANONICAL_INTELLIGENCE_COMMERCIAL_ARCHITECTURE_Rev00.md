# PJ2608-0550 — Canonical Intelligence / Vendor Offer / Pricing Architecture Rev00

Status: CONTROLLED WORKING ARCHITECTURE
Date: 2026-10-07

## 1. Core distinction

Requirement Thread is a PJ2608-0550 PARTICULAR instance: what must be solved.
Main/Common/Generic method and equations are reusable controlled methods: how to solve.
Requirement threads bind reusable equations through etm_equation_bindings; they do not copy or redefine common equations.

## 2. Canonical requirement intelligence flow

Source/Evidence -> Requirement -> SmartControl finding -> Resolution Case -> Internal search -> External authority only if internal evidence is insufficient -> Evidence Candidate -> Human review -> Controlled evidence/decision -> Recalculate downstream.

Authority ladder:
1. Project governing: Contract / MR / PHI / BOD / SPE / project STD / approved TC-TQ / approved decisions.
2. Company standard / approved vendor evidence.
3. Applicable international standard.
4. OEM engineering manual / validated method.
5. Peer-reviewed / recognised engineering research.
6. Approved historical calibration.
7. Explicit controlled assumption only as last resort.

No external source silently overrides governing project requirements. No research candidate auto-mutates released project facts.

DB objects:
- etm_requirements
- etm_requirement_resolution_cases
- etm_research_candidates
- etm_evidence / etm_evidence_assertions
- etm_decisions
- etm_trace_edges

## 3. Equation architecture

Canonical equation truth = etm_equation_registry.
Project/system/requirement use = etm_equation_bindings.
Legacy etm_formulas is compatibility/migration input only and maps through etm_legacy_formula_equation_map.
EquationKernel.jsx is a projection of the DB registry with a controlled fallback snapshot when DB/API is unavailable.

Before creating a new equation:
1. Search COMMON / GENERIC / PROFILE registry.
2. Reuse/bind existing equation when the mathematical form already exists.
3. Create a PARTICULAR equation only when project/system physics requires distinct math.
4. Record source/method basis and review state.

## 4. Vendor offer architecture

Vendor quotation remains intact as one source offer:
etm_vendor_offers -> etm_vendor_offer_items.

One quote may serve several systems. Do not split/copy the source quote per system.
System / MTO / customer-price relationships live in etm_vendor_offer_item_bindings.
Shared items remain SHARED_COMMON until a causal allocation driver exists.

Vendor terms are first-class controlled objects in etm_vendor_offer_conditions:
Incoterm, payment, validity, lead time, warranty, FAT/IFAT/SAT/commissioning, training, documentation, spares, tools, licence, tax, delivery point, exclusions and assumptions.

Each condition can drive cost, schedule, risk and warranty impacts and can link to accepted-condition / deviation / decision objects.

## 5. Four commercial semantic layers

Every commercial line has four distinct meanings:
1. SOURCE_COST — supplier/procurement cost as quoted.
2. INTERNAL_COST — complete controlled ADDVALUE/project cost including required equipment/bulk/work/lifecycle/common/risk as applicable.
3. WORKING_SELL — management/budgetary/target selling price, not yet customer authorised.
4. RELEASED_SELL — authorised customer selling price.

DB object = etm_price_line_layers.

7.1 Internal Cost / Commercial Analysis may show all four layers.
7.0 ASK-TSI Priced Breakdown consumes AUTHORISED RELEASED_SELL only.
Missing RELEASED_SELL remains HOLD/TBC; Source Cost or Working Sell must never be substituted into the customer form.

## 6. PAGA pilot bindings

PAGA requirement threads REQ-PAGA-001..007 are migrated into etm_requirements with current controlled metadata.
PAGA particular equations are migrated into etm_equation_registry and bound to requirements through etm_equation_bindings.
Current open gaps are represented as resolution cases; they are questions/jobs, not invented answers.

INDUSTRONIC A20261632 is canonicalised as one offer with item bindings and condition impacts.
Current PAGA price layers:
- SOURCE_COST = A20261632 quoted final EUR 226,454.05.
- INTERNAL_COST = HOLD/TBC until completion cost closes.
- WORKING_SELL = EUR 292,645.96 known-cost-only preview.
- RELEASED_SELL = HOLD.

## 7. Revision propagation

Source revision or vendor-condition change -> trace dependency -> requirement/equation binding/reconciliation/work/cost/price-layer impact -> projections stale -> recalculate/review -> regenerate output revision.

7.0/7.1 are views of canonical price state, not independent calculators.

## 8. Implementation files

- database/migrations/015_etm_intelligence_vendor_pricing_layers.sql
- database/seeds/016_pj2608_0550_paga_requirement_equation_bindings.sql
- database/seeds/017_pj2608_0550_paga_resolution_cases.sql
- database/seeds/018_pj2608_0550_industronic_offer_control.sql
- frontend/src/pages/projects/PJ26080550/Project0550GapResolutionEngine.js
- frontend/src/pages/projects/PJ26080550/Project0550PricingLayerModel.js
- frontend/src/pages/projects/PJ26080550/useProject0550RequirementThreads.js
- backend/api/etm/equation-registry.php
- backend/api/etm/requirement-threads.php
- backend/api/etm/gap-resolution.php
- backend/api/etm/vendor-offer-control.php
- backend/api/etm/pricing-layers.php

## 9. Deployment order

Run migrations through 015 in order, then controlled seeds 016-018.
Until DB deployment completes, UI may use controlled fallback snapshots but must label them as fallback and never treat them as a second source of truth.
