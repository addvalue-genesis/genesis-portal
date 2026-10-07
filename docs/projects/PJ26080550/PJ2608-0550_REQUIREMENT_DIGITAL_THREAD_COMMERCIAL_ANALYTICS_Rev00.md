# PJ2608-0550 Requirement Digital Thread & Commercial Analytics Rev00

**Status:** Controlled working architecture  
**Pilot:** 12.7 TEL-PAGA / INDUSTRONIC  
**Date:** 2026-10-07

## 1. Core rule

The visible UI is not the engineering truth.

The controlled chain is:

```
Customer / Company Source
→ Requirement
→ Constraint
→ Engineering Proof
→ Required Object / Quantity Driver
→ COMMON / GENERIC Equation
→ PARTICULAR System Equation / Study
→ Vendor Reconciliation
→ Work / Lifecycle
→ Cost Object
→ Commercial Output
```

Changing the UI does not change this chain.

## 2. Requirement source hierarchy

For PJ2608-0550 the typical source chain is:

```
MR / RFQ
→ PHI / BOD
→ SPE / Company STD
→ DWG / LAY / LIS / MTO
→ CAL / SDY / RPT
→ approved TC / TQ
→ accepted vendor evidence
```

A source conflict remains a controlled conflict. The application must not silently choose a source.

## 3. PAGA pilot

PAGA is the first system where the Requirement layer is expanded into a detailed digital thread.

Controlled source examples:
- MR-0001 Appendix 1.4
- PHI §7.3.4
- BOD §7.1.4
- SPE-0004
- 10008-STD-6-TEL-007
- controlled PAGA block/wiring drawings
- INDUSTRONIC A20261632
- INDUSTRONIC NPA datasheet

The source statements generate requirement threads such as:
- audible speech coverage;
- alarm audibility / visual warning;
- amplifier loading / N+1;
- loop/cable loss;
- power / UPS;
- external interfaces;
- FAT / IFAT / SAT / document lifecycle.

Each thread carries:
- source;
- requirement;
- constraints;
- proof;
- required objects;
- quantity/work drivers;
- equations;
- state.

## 4. Equation architecture

COMMON / GENERIC equations remain reusable across all 19 systems.

Examples:
- GEQ-001 Applicability
- GEQ-002 Installed Quantity
- GEQ-004 Activity Quantity Driver
- GEQ-012 Material / Landed Cost
- GEQ-019 Direct Equipment Cost
- GEQ-025 Integration Workload
- GEQ-031 Hazardous Area Compliance / Cost Gate
- GEQ-032 Procurement-class Quantity Conservation
- GEQ-033 Commercial-treatment Line Cost
- GEQ-034 Controlled Currency Conversion

System-specific engineering is represented as PARTICULAR equations / studies, e.g.:
- PAGA-CAL-COVER-001
- PAGA-CAL-AMP-001
- PAGA-CAL-LOSS-001
- PAGA-CAL-UPS-001

A Particular model can use COMMON / GENERIC equations but must keep its project/system inputs and source evidence explicit.

## 5. Why Requirement detail drives groups 2–7

Once Requirement / Source / Constraint is controlled:

1. Engineering proof can be defined.
2. Required MTO / physical objects can be derived.
3. Vendor offered objects can be reconciled.
4. Work and lifecycle activities can be derived.
5. Cost objects can be built.
6. Commercial treatment can be applied.
7. Open gaps / release blockers can be identified.

Therefore the Requirement layer is the root of the system digital thread.

## 6. Commercial analytics

Engineering architecture contains 19 systems, while the ASK-TSI commercial form contains 15 A1 lines.

The code therefore uses a controlled commercial roll-up registry:
- 1:1 lines stay attributable to one engineering system.
- composite lines remain marked COMPOSITE / ALLOCATION OPEN.
- the UI must not invent a system-level split merely to make a chart.

Commercial visualizations may show:
- system / commercial-group value;
- source cost;
- requirement additions;
- completion / bulk / lifecycle cost;
- professional labor/service;
- logistics;
- pass-through;
- uncertainty/risk;
- commercial uplift;
- customer selling price;
- OPEN/TBC amounts.

OPEN/TBC is never represented as numeric zero.

## 7. Professional design patterns adopted

### Requirements / digital thread
Use hierarchical requirements and bidirectional traceability between source requirements, derived requirements, design/proof and verification.

### Cost structure
Use a product/work-oriented hierarchy where child cost elements reconcile to their parent and common cost is visible rather than hidden.

### Interaction
Use hierarchical table/outline expand-collapse for routine review.

### Commercial exploration
Use decomposition/drill-down style analytics: start with the system/commercial-group total, then expand by cost dimension.

## 8. Current code

- `Project0550PagaDigitalThread.js`
- `Project0550CommercialModel.js`
- `Project0550SystemRegistry.js`
- `Project0550EngineeringDoctrine.js`
- `Project0550EvidenceMemory.json`
- `Project0550EvidenceReasoner.js`
- `Project0550PricingBaseline.js`
- `Project0550PriceTrace.js`
- `Project0550PartBModel.js`
- `Project0550FxControl.js`
- `ASKTSIPricedBreakdownForm.jsx`

## 9. Scale-out rule

PAGA is a pilot, not an exception.

The other 18 systems shall migrate to the same digital-thread schema using their own:
- RFQ bindings;
- technical constraints;
- proof/calculation objects;
- quantity drivers;
- Particular equations;
- vendor reconciliation;
- cost / commercial state.

No system should require a separate conceptual architecture.
