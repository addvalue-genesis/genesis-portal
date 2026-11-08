# 11.A1 Others · 11.E and 11.F

Both panels are internal, read-only supporting detail for the single 11.A1 Others lot. Open them from 11.A1, the Volume I tabs or Module Search using `bid.quotation.E` and `bid.quotation.F`.

| Exhibit C rev-0 source | How the breakdown uses it |
| --- | --- |
| C1, p. 10 | Item, quantity, unit, unit rate, amount and notes for both panels |
| C7, p. 17 | Service grouping for licence preparation, application and follow-up. Hours or days come from Working when present |
| C8, p. 18 | Per-person, per-day and per-trip notes for expenses and insurance where Working supplies those drivers. A lump sum stays a lump sum |
| C5 / C6, pp. 15–16 | Existing destinations to check for special tools and filling materials or consumables when comparing scope |

11.E separates B8 licensing work and the B8-D05 authority/agent allowance from other existing A1 Others services and expenses. The existing fee references and 19-system plus COMMON screening are available in the licence evidence disclosure. 11.F uses B2-D04 for cargo and B9 for insurance. B9-D04 is a reference to the cargo owner in the default bid completion basis.

ADR-0550-001 principles 5, 6, 8, 10, 11 and 12 apply. Both panels consume the active additive Base rows assigned to A1 Others through 11.M. They preserve the selected Working/Reviewed price basis and USD/THB display. The panel links reach the same Working line and 11.M allocation. OPEN amounts and scope checks remain visible. The new tabs have no pricing, allocation, approval or issue write path. Native Exhibit C and issued history use the existing schedules.

Comparison source is 0553 branch `fix/pj2608-0553-urgent-thailand-cif-pricing-20261024` at `b2ff217`, including `20261024_B1_B14_IMPORT_OPERATIONAL_ACTIVITIES.md`, `bcExecutionActivities0553.js` and `addvalueB14Insurance0553.js`. The ASK checks cover destination clearance and duties, additional storage, applicability of coating and first filling, offshore coverage and contractual bonds. Determine responsibility, applicability and price evidence in ASK before changing Working. The comparison carries no 0553 rate or insurance allowance into the schedule.

The other 0553 headings have established comparison points in ASK. Documentation maps to 11.A1 Vendor Documents, inspection to 11.A1 and 11.D, and packing to its own 11.A1 line. Training and specialist site support use 11.C7 where applicable. Commissioning spares and handover tools have 11.C2 and 11.C5, with consumables checked against 11.C6 and the existing 11.C3 operating-spare basis. Match the scope and responsible party before allocating anything further.

## Verification

The isolated 11.E/F browser test confirmed exclusive grouping, USD and THB tie-out to the native A1 Others row, Module Search, Reviewed price separation, and unchanged IndexedDB workspace data. Native Exhibit C, Working Schedule model, Bid Volumes and continuity checks passed. Production webpack compiled with an asset-size warning. The broader Working Schedules browser check and Activity Budget total check fail the same legacy expectations on baseline `8307817d` and the updated tree. The focused test uses synthetic data and does not verify the saved amount in a Windows workspace.
