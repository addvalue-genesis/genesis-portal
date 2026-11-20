# 02 — Telecom SI Document-Driven Engineering and Budgetary Estimation
Project: PJ2608-0553 / Effective: 2026-10-16 / Methodology decision

## Governance of method (02)
This is an engineering methodology, not an independent customer price or bid amendment. Customer documents determine the requirements; ADDVALUE as Telecom SI checks completeness, suitability, interfaces and inconsistencies with:
1. **First Principles**: determine functional needs, physical connectivity, replacement/removal boundaries and operation / commissioning activities.
2. **Telecom Constraint-Based Engineering**: apply MR0001–0004 Rev.C1, BOD, DTS, LIS, SPE, applicable PTTEP STD and EXA-A8, Ex assembly/configuration/power/communication/licensing/offshore restrictions; flag omissions and conflicts.
3. **Parametric Cost Model**: reuse existing MAP/GEQ quantities, source-installed TAGs and verified source-unit price. Add new equation only where existing coverage is absent. Unknown input is not zero; a reference budget is not proven direct cost.

## Authoritative information flow
**04 Requirements and Document Intelligence** → **02 First Principles & Methodology** → **05.3 Physical/Functional TAG/BOM** → **07 Vendor evidence and OEM scope** → **08 Risk, assumptions and change** → **10.2 A/B/C Working Budget** → **10.5 Customer-format schedules**. **09 Data/Code/Traceability** retains revision/evidence and formula provenance. This record belongs in 02, with budget outputs in 10, not duplicate price values in 02.

## MR Rev.C1 §5 obligations: applicable platform set quantities
| MR | System | Applicable platforms | Commissioning spare KIT requirement | Special tools | 2-year spares | C1 complete capital unit mandate |
|---|---|---|---|---|---|---|
| MR0001 | SCADA | ZWP20–23 | 4 kit sets, 1/platform | 1 set/phase | quotation only | none inferred |
| MR0002 | DMR Trunk Radio | ZWP20–22 | 3 kit sets, 1/platform | 1 set/phase | quotation only | none inferred |
| MR0003 | Ex Telephone | ZWP20–23 | 4 kit sets, 1/platform | 1 set/phase | quotation only | none inferred |
| MR0004 | Marine RACON | ZWP20–22 | 3 kit sets, 1/platform | 1 set/phase | quotation only | none inferred |

**Separate Brownfield obligation:** MR0001 §5 also covers ZPQ, ZWP08 and ZWP11 spare parts/special tools **as required**; MR0002 covers ZPQ DMR integration as required. None of these four reviewed interfaces automatically receives an extra 1 kit/platform mandate; contents and quantity remain to be proven from interface and OEM documents.\n\n**Total contractual B10 kit obligation = 14 KIT sets**, not 14 complete replacement radios/RACONs. **B11 = four per-MR, per-phase tool requirement records**, not automatically four disjoint physical packages; consolidation requires proof of common tooling/licensing. MR0004 repeats offshore commissioning/start-up one-set/platform language; verify whether redundant or independent before adding any quantity.

## Price and requirement classification
- **DOCUMENT_REQUIRED**: source clause expressly obliges the deliverable.
- **ENGINEERING_DERIVED**: source function/constraint plus proven driver yields additional physical quantities.
- **OEM_RECOMMENDED**: original OEM SPIR/recommendation identified; separate from mandatory.
- **CLARIFICATION**: conflict, ambiguity, unknown OEM compatibility or installation evidence.
- **NOT_APPLICABLE**: affirmative documented non-applicability.
No criticality heuristic is to be silently promoted to a contractual BOM or default procurement Qty.

## Existing equations / new equations
Reuse **MAP-01/02/03/05/06/07/08/09/10**, and GENERIC GEQ as applicable. `documentSpareObligations0553.js` implements **MAP-06 × per-MR platform obligations**, no separate quantity kernel. Existing SPQ-001/002 risk scenarios only flag an engineering gap, not the customer minimum, price or procurement authority. SPQ-003 B13 activity-based consumption needs the preservation program / applied units-per-activity before promotion.

## Category responsibilities
- **B10** 1 kit/platform obligation, with source-backed component content/quantity/price; includes OEM recommendations when required by applicable documents.
- **B11** one phase-tool-set requirement per MR and minimum EXA-A8 instruments/licenses, net of Part A package included licences and tools.
- **B13** distinct preservation/maintenance *handover stock*, not B5 consumed export packing or unknown field loss reserve.
- **C1** optional capital spare recommendation with source justification and replacement strategy; a Main Equipment Set/Platform **does not create** one Capital Spare Unit.
- **C2** two-year O&M *priced recommendation* unless ordered; not booked in Base. MR0001–0004 Rev.C1 Attachment 7 instruction 6 excludes items already listed in Pre-Commissioning / Start-up Spare Parts List from C2. Candidate duplicate SKUs must be reconciled and excluded from revised C2, not repriced as separate C2 physical stock.

## Price ownership / gate
Existing Rev08 B10/B11/B13/C1/C2 budget references remain immutable. Direct Cost stays unknown until rate × derived quantity is supportable, commercial treatment remains separate. New risk-only complete RFI-BDA+WAROM comparison is **not** a priced spare quote or approved stock Qty. Keep one physical stock owner per item and prevent Part A, B10, B11, B13, C1, C2 double posting. Current B10 kit count is a document requirement only, not proof that itemized historical budget covers it.

## Recorded implementation
- `frontend/src/project0553/data/documentSpareObligations0553.js` : Section 02 quantity interpretation, linked to original TAG scope and 10.2 consumers.
- `frontend/src/project0553/ScopeBcAnnexDetail0553.jsx` : customer detail displays MR/Platform obligation proof across five categories.
- `frontend/scripts/validate-0553-spare-document-obligations.cjs` : verify 4/3/4/3, no implied complete Capital Spare and no pricing mutation.
- `frontend/src/project0553/data/spareCustomerSchedule0553.js`: actual customer-style BOM/price evidence, distinct from confirmed obligations.

## Remaining required engineering work (NOT completed)
Populate B10 14 kit compositions per MR/Platform from SPIR/OEM/EXA-A8, B11 mandatory tools/license compatibility & OEM inclusion, B13 activity driver, C1 replaceable capital alternatives where contract/OEM source substantiates them, C2 source-backed 2-year inventory. Recalculate all item quantities, costs and Working Sell with source unit prices and check customer DDP vs alternate Incoterms, then perform regression and human approval. No customer release from this methodology record.
