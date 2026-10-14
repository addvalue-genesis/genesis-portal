# ZWP8 Rev01 historical dependency compatibility finding

Status: **BLOCKED — NOT REPRODUCED — Rev02 NOT APPROVED**.

## What is verified
The Rev01 `mr0001TagCostLedger0553.js` was recovered by its approved Git blob SHA `ec222963670a5cfdf5e8f4b850d33c4de01afba1`.

The historical ledger accesses:
- `scenario.radioAssemblyUnitUSD`
- `scenario.antennaUnitUSD`
- `scenario.partialEquipmentUSD`

The checked-out `zwp8Row43CostTrace.js` currently exposes the new AFC owner-based `ownerCodes` and `ownerCosts` and populates `partialEquipmentUSD` from the six new source-function owners. It does **not** provide `antennaUnitUSD` in its reference scenario. The Rev01 ledger assertion compares the historical radio/antenna assignment against the new AFC total, and fails by design.

## Engineering audit decision
This is a dependency revision mismatch. It does not justify bypassing the assertion or rewriting original Rev01 code.

The earlier illustrative ZWP8 difference (USD +9,797.41) remains a static code-path comparison, **not verified runtime delta** until the original dependency at Rev01 approval is found.

Current working preview may be used for engineering review, but the cost release/build approval gate remains blocked. Unverified FX and vendor approval are separate gates.

## Next evidence required
1. Identify a historical Git commit or immutable artifact containing the exact dependency used when Rev01 was approved.
2. Record the dependency blob SHA, its commit/time provenance, and frozen associated quote/MTO inputs.
3. Execute Rev01 and Current in separate process/module environments with their matching dependencies.
4. Compare each seven-location MTO TAG across quantities, original currency, rates, amount, inclusion and owner.
5. Present Rev02 cost-impact reconciliation and obtain explicit sign-off; do not edit Rev01 approval manifest.

Audit implementation: `frontend/scripts/audit-0553-mr0001-baseline-side-by-side.cjs` records runtime failure and dependency-compatibility metadata instead of manufacturing a numeric PASS.
