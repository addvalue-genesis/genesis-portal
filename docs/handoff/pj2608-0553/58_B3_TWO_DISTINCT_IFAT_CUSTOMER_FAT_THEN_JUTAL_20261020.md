# PJ2608-0553 / 10.2 B3 — Management Clarification: Two Distinct FAT Stages
Date: 2026-10-20
Status: PRE-AWARD MANAGEMENT EXECUTION STRATEGY (no supplier reissued quote; no approved direct COST or Customer Release)

## Decision
The MGW quotation P26-058_R2 20-Oct-2026 cover's two FAT services are deliberately distinct in activity and are **NOT a duplicated service**:
1. **Stage 1 / SERV-2 — Internal iFAT, 2 days, USD5,000.** MGW and ADDVALUE perform internal integration, debugging, verification and preparation before involving customer.
2. **Stage 2 / SERV-4 — Separate end-user Customer FAT premises reserve, minimum 5 days, USD2,500.** Reserve time and facilities for client/customer FAT after readiness from Stage 1; customer attendance and precise schedule to be agreed.
3. **Stage 3 / SERV-5 — Deliver completed equipment to JUTAL Yard, Zhuhai, after FAT.** Cover USD2,500 road freight already included once in vendor total; actual delivery Incoterm named point remains unresolved (cover says DAP Nantong vs freight destination JUTAL Zhuhai).

No deductions or offsets between SERV-2 and SERV-4; quote-wide MGW total remains **USD368,841**, composed of equipment USD350,341 plus five quoted services USD18,500. The separate SERV-3 USD500 packing vs SERV-5 statement that freight includes packing remains a **different** potential USD500 conflict awaiting supplier written clarification.

## ADDVALUE B3 versus MGW vendor scope
- **10.2 / `bid.budget.working.bc.b3.fat`** — ADDVALUE B3 Working SELL **THB397,400** = 2 paid staff × six budgetary FAT witness days + separate travel/insurance expense basis; NOT the USD7500 supplier FAT execution/facility charge.
- **10.2 / `bid.budget.working.bc.b3.mgw-r2-cover-20261020`** — supplier service evidence SERV-2 USD5000 + SERV-4 USD2500 = **USD7500 within MGW cover, not an additional B3 SELL line**.
- **10.2 / `bid.budget.working.bc.b3`** — total THB2,443,400 remains unchanged, also including SAT/SIT labour THB2,016,000 and VeEX rental THB30,000.
- Management confirms stages are separate; **the outstanding question is not service duplication**. Still verify when the two ADDVALUE witnesses must attend across two stages, calendar dates, any extra allowance if attendance exceeds six budgeted witness workdays, OEM tools/facility included, and cost owner for supplier-side services.
- **10.2 / `bid.budget.working.bc.b6`** — road shipment after FAT, once, not another freight surcharge; receiving site and China-to-Myanmar responsibility unconfirmed.
- **10.3 / `bid.budget.pricing.release`** — remains HOLD; protected Rev02/Rev03 baseline, Working Cost, Working SELL untouched.

## Code function owners / downstream
`mgwP26058R2Cover20261020.js` (MGW cover commercial authority + documented management stage sequence) → `selectB3WorkTypeReconciliation0553()` (read-only B3 SELL and supplier cost evidence) → `B3WorkTypeAccordion0553.jsx` and `MgwR2CommercialCover0553.jsx` (10.2 UI) → `scopePartBcReadModel0553.js` / 10.5 scope and `buildReleaseCommercialModel0553()` / 10.3 customer approval HOLD.

The stage clarification does NOT mean the supplier has confirmed dates, billable witness attendance, FAT procedure or physical logistics receipt.
