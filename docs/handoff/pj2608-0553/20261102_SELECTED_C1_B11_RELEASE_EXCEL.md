# R75 — selected C1 and B11 withdrawal

Owner authorization: B11 not separately quoted / N/A and withdraw its allowance; latest six-row C1 must update Summary and every Excel export; customer exports must omit internal wording.

| Selected value | Before | Current |
|---|---:|---:|
| B11 Working SELL THB | 157,657.50 | N/A |
| B11 Official USD | 5,100 | N/A |
| Part B Working SELL THB | 6,223,782.87 | 6,066,125.37 |
| A+B Official USD | 902,900 | 897,800 |
| C1 optional USD | 97,500 | 181,100 |
| C1 selected THB | 3,071,250 | 5,704,650 |
| C2 optional USD | 23,000 | 23,000 |

C1 selected items 1.1/1.2/2/3/4/5 retain TAG, description, specification and materials from the existing SI scenario. Quantities 1/1/2/1/1/1 multiply by USD unit rates 16,500/9,100/900/15,300/40,900/97,500. RACON item5 stays included. No extra factor or separate rounding charge. Raw equipment cost scenario THB4,387,631.87 and raw SELL THB5,703,921.43 remain unchanged; selected rounded child SELL totals THB5,704,650, with THB728.57 rounding attribution. Option stays excluded from A+B. Quantity approval, OEM interchangeability and final delivery terms remain open.

B11 customer annex has N/A and the qualification: "Not separately quoted. Tools expressly included in the equipment supply remain included." Historical four-row source/parametric allowance is retained for audit; its customer prices are null. Raw source and business/module identities remain available. This does not declare every contractual tool requirement technically inapplicable.

The selected option adapter is the common six-row financial source for 10.2 Working C1, Scope, 10.3 Release, Official Summary, original USD/THB native Excel and the 10-sheet Breakdown workbook. Customer annex uses Price/Total labels with only relevant commercial qualifications. Internal rate/comparator/allocation commentary stays in engineering/audit views. Existing downloaded spreadsheets must be exported again; the app cannot rewrite files already on the user's computer.

Regression: `validate:0553-selected-spare-release` protects pre-R75 financial fingerprints for every row other than B11/C1 (including B1), source annex identities, rounding, all three actual exports and customer wording. Existing source history fixtures remain unchanged. No merge, issue or customer transmission authorized.

Validation completed: production `build:0553` passes (three existing webpack asset-size warnings). Actual USD, THB and Breakdown generation, stale B11 formula removal, original ZIP/layout preservation, unaffected price fingerprints, SI quantity/rounding, owner-scope and commercial integration checks pass. One pre-existing full-build guard still fails: `validate:0553-rev03-approved-baseline` expects old MR0001 blob `83aace6f7d7de98d29ac63d510978ffb729303be` but pre-R75 HEAD already contains `a798040ab3d5db26e6ca3b6d35b09f732886a1e6` from the earlier owner-selected L3 work. This task does not modify MR0001 or refresh that immutable manifest/checksum. Thus the entire legacy `npm run build` chain remains blocked by that existing guard; the dedicated production build and current financial/export checks pass.
