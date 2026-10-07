# PJ2608-0550 — Canonical Intelligence / Product / Derivation / Pricing Architecture Rev01

Status: CONTROLLED WORKING ARCHITECTURE  
Date: 2026-10-07  
Supersedes for current implementation guidance: Rev00

## 1. Core operating model

PJ2608-0550 uses one canonical derivation spine:

Source / Evidence  
→ PARTICULAR Canonical State  
→ COMMON / GENERIC Equation Binding  
→ Derivation / Reconciliation Engine  
→ Canonical Cost / Price State  
→ 7.1 Internal Cost / Commercial Analysis — Management Derivation Workbench  
→ Management Review / Release  
→ 7.0 ASK-TSI Priced Breakdown — Working Preview / Released Customer Output.

React is a working surface and projection. It must not own a second engineering or pricing engine.

## 2. Data-role separation

### MariaDB
Canonical truth when live:
- source/document/evidence identity and revision,
- requirements / constraints / interfaces / proof / MTO / bulk / activities,
- vendor offers / items / conditions,
- canonical product identity,
- equation registry / bindings,
- calculation runs / input-output snapshots / stale state,
- cost objects / cost-price bindings,
- SOURCE_COST / INTERNAL_COST / WORKING_SELL / RELEASED_SELL,
- revision/change impacts and release state.

### JSON
Exchange / import / AI evidence packet / API payload / snapshot / checkpoint only.
JSON must not become a competing master state when canonical DB state exists.

### JavaScript
Deterministic engine / validation / reconciliation / selector / projection logic.
Controlled JS fact snapshots are migration/fallback compatibility only while live DB state is unavailable.

## 2.1 Executable code separation — Refactor 2026-10-07

The derivation layer is now physically separated in code:

- `CanonicalCommercialDerivationKernel.js` = COMMON / GENERIC reusable algorithms only.
- `Project0550CanonicalDerivationEngine.js` = PJ2608-0550 PARTICULAR adapter / bindings only.
- 7.1 and 7.0 continue to consume the existing project adapter API; UI behavior is not allowed to become a second calculation engine.

The COMMON / GENERIC kernel owns only reusable semantics such as currency-normalised amount handling, internal-cost precedence, calculation-run state classification, and the standard commercial derivation trace.

PJ2608-0550-specific facts remain outside the kernel, including commercial line/system mapping, source classification, controlled fallback audit facts, product/vendor selection and project evidence.

This boundary is mandatory for future refactors: a new vendor quote, datasheet or system source must first update PARTICULAR state. It must not add a vendor/model/0550 line code directly into the COMMON / GENERIC kernel.

## 3. PARTICULAR vs COMMON / GENERIC

A project Requirement Thread is PARTICULAR: it states what PJ2608-0550 must solve.

COMMON / GENERIC contains reusable equations, algorithms, rules and cost families: how a class of problem is solved.

Particular state references reusable methods through etm_equation_bindings.

New quote, datasheet, drawing, TC/TQ, source revision or system evidence always enters PARTICULAR state first.

A finding may only be promoted to COMMON / GENERIC through:
1. candidate identification,
2. review,
3. approval,
4. new controlled method/equation version.

No vendor datasheet or project-specific fact may silently mutate a generic method used by other systems/projects.

## 3.1 Source / evidence ingestion

Controlled evidence packets now distinguish source classes including:
- governing project source,
- company standard,
- OEM datasheet,
- vendor technical submission,
- vendor quotation,
- project calculation,
- international standard,
- recognised research,
- historical calibration/reference,
- explicit assumption.

Assertion domains include PRODUCT_IDENTITY, PRODUCT_CAPABILITY, VENDOR_CONDITION and METHOD_CANDIDATE in addition to requirement/quantity/proof/cost/commercial domains.

After migration 016, evidence assertions may bind directly to canonical product_id and a target object reference. Unknown product codes remain review items; ingestion does not auto-create or silently map a product.

METHOD_CANDIDATE or reusableMethodCandidate stays a PARTICULAR proposal until reviewed. Promotion to COMMON/GENERIC requires a new controlled method/equation version.

## 4. Canonical product identity

Migration 016 adds:
- etm_products,
- etm_product_aliases,
- product_id on etm_vendor_offer_items,
- product linkage on evidence assertions.

Purpose:
the same OEM model offered by multiple resellers/vendors must map to one canonical product identity.

Example:
INDUSTRONIC AP712 offered by Vendor A and Vendor B remains one product identity.

Technical identity/capability:
- manufacturer,
- model,
- manufacturer part number,
- product family,
- datasheet/evidence assertions.

Offer-specific commercial facts remain on each quotation:
- selling vendor,
- offer number/revision,
- price,
- currency,
- Incoterm,
- lead time,
- warranty,
- exclusions,
- FAT/SAT/service conditions.

Seed 019 binds current INDUSTRONIC PAGA offer items to the canonical product pilot.

## 5. Derivation audit spine

Existing etm_calculation_runs is extended rather than creating a second calculation-run table.

Canonical run audit can now bind:
- etm_equation_bindings,
- engine name/revision,
- derivation role,
- target object,
- input snapshot hash,
- output snapshot,
- result state,
- stale flag/reason,
- change event.

Derivation roles include proof, quantity, workload, cost, schedule, risk, commercial and reconciliation.

Revision/change flow:
Source revision / vendor update / rate update  
→ etm_change_events  
→ traverse etm_trace_edges  
→ REVIEW / RECALCULATE / REGENERATE / INVALIDATE  
→ affected calculation run / projection becomes stale  
→ re-run/review  
→ new controlled result  
→ output revision.

## 6. Four commercial semantic layers

1. SOURCE_COST — vendor/procurement source cost as quoted.
2. INTERNAL_COST — complete controlled project/ADVALUE cost.
3. WORKING_SELL — internal management/budgetary/target selling state.
4. RELEASED_SELL — authorised customer selling price.

TBC/HOLD is never converted to zero.

### 7.1
Shows and analyses all four layers plus:
- source/provenance,
- particular inputs,
- product/vendor binding,
- common/generic equation binding,
- derivation/reconciliation run,
- open/stale/blocking conditions,
- cost build-up,
- commercial treatment.

### 7.0
Does not independently recalculate engineering cost.

Working Preview consumes the same WORKING_SELL semantic layer processed/reviewed in 7.1.

Released Customer Output consumes AUTHORISED RELEASED_SELL only.

## 7. Part B

B1-B9 must be auditable as:

Source obligation / scope  
→ applicability / context  
→ quantity/work driver  
→ COMMON / GENERIC equation binding  
→ derived MH / material / mobilisation / direct/common cost  
→ controlled Part B cost component  
→ commercial treatment  
→ Working Sell  
→ Released Sell.

Current Rev04 Part B values remain controlled recovered results until all upstream UMH/rate/driver objects are migrated and live derivation runs can reproduce them. The equation trace must explain/reconcile the result without pretending that a missing driver has been live-calculated.

## 8. PAGA pilot

PAGA remains the most populated pilot for the architecture:
- requirement/evidence thread,
- particular equation bindings,
- INDUSTRONIC A20261632 whole-offer control,
- canonical INDUSTRONIC product identity,
- Required vs Offered reconciliation,
- bulk/MTO pilot,
- lifecycle/FAT/SAT/commissioning responsibilities,
- Part B equation trace,
- four commercial layers.

Current PAGA:
- SOURCE_COST: controlled vendor source.
- INTERNAL_COST: incomplete / TBC until completion cost closes.
- WORKING_SELL: internal known-cost preview only.
- RELEASED_SELL: HOLD.

## 9. Key implementation files

Database:
- database/migrations/016_etm_canonical_product_derivation_spine.sql
- database/seeds/019_pj2608_0550_paga_product_identity.sql
- existing migrations 008 / 010 / 011 / 013 / 014 / 015 remain part of the same architecture.

Backend:
- backend/api/etm/derivation-state.php
- backend/api/etm/vendor-offer-control.php
- backend/api/etm/pricing-layers.php
- backend/api/etm/project-control-state.php

Frontend engine/state:
- Project0550CanonicalDerivationEngine.js
- Project0550PricingLayerModel.js
- useProject0550CanonicalState.js
- Project0550PartBDerivationModel.js
- Project0550EquationCatalog.js
- Project0550EngineeringDoctrine.js
- Project0550WorkingMemory.jsx

Frontend projections:
- InternalCostOfferAnalysis.jsx = 7.1 management derivation workbench.
- BidWorkspace.jsx / ASKTSIPricedBreakdownForm = 7.0 downstream working/released output.

## 10. Deployment order

1. Run existing migrations through 015.
2. Run migration 016.
3. Run existing controlled seeds through 018.
4. Run seed 019.
5. Deploy backend/frontend branch.
6. Verify derivation-state API reports CANONICAL_DERIVATION_SPINE_016.
7. Review 7.1 Derivation Spine and PAGA.
8. Only then extend the same pattern to the remaining 18 systems.

Until DB migration/seed deployment is complete, controlled fallback snapshots may appear, but they must be labelled fallback and never be treated as a second source of truth.
