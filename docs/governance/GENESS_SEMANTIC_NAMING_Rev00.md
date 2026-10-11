# GENESS Global Semantic Naming Convention — Rev.00 (2026-10-11)

## Scope
The generic identity/validation API is `frontend/src/common/governance/componentRegistry.js`. Project-specific implementations supply mappings; the **PJ2608-0553 pilot only** currently imports and displays semantic codes. No PJ2608-0550 file or dataset is changed.

## Naming contract
- User-facing stable **semantic name**: `DOMAIN-FUNCTION[-SUBFUNCTION]`; e.g. `BID-BUD`, `BID-ENG-SCH`.
- Immutable project-scoped software identity: `PJ2608-0553:L3-B:budget` (the legacy route key is preserved).
- Location code: `L3-B-10` or `L3-B-05.3`; can be repositioned without renaming the semantic identity.
- Document/MR/MTO source references and workflow IDs are **separate namespaces**.
- Semantic names must be centrally registered, unique within the intended shared domain, not recycled, and must not be generated from tab indices. Global cross-project uniqueness is a governance policy; the current factory validates within each project instance only.

## PJ2608-0553 pilot inventory
| Semantic code | Location | Legacy route | Workflow |
| --- | --- | --- | --- |
| BID-GOV | L3-B-01 | overview | WF-01 |
| BID-FPR | L3-B-02 | engineering | WF-02 |
| BID-ARC | L3-B-03 | architecture | WF-03 |
| BID-REQ | L3-B-04 | systems | WF-04 |
| BID-ENG-SCH | L3-B-05.3 | schematic | WF-05 |
| BID-EXE | L3-B-06 | execution | WF-06 |
| BID-VEN | L3-B-07 | documents | WF-07, WF-09 |
| BID-RSK | L3-B-08 | risk | WF-08 |
| BID-DAT | L3-B-09 | registry | supporting |
| BID-BUD | L3-B-10 | budget | WF-10, WF-11 |

The live registry lives in `frontend/src/project0553/lifecycleNavigation.js`: `TAB_SEMANTIC_0553` and `TAB_IDENTITY_0553`. Every tab holds its semantic code, position code, stable route identity, workflow reference, and representative source path. For edits, verify all actual source usage; sourcePaths is **not** a full dependency inventory.

## Budget child-component working aliases — further registry mapping required
- `BID-BUD-SUM` → `L3-B-10.01` Internal Budget Shortcut
- `BID-BUD-BOM` → `L3-B-10.02` Simple/Engineering BOM
- `BID-BUD-BLK` → `L3-B-10.03` Bulk and Enclosure
- `BID-BUD-SOS` → `L3-B-10.04` Scope of Supply
These are existing UI functions and **proposed** child semantic aliases, not yet exhaustively registered.

## Change log
2026-10-11: initial common semantic-name validator and explicit 0553 ten-tab mapping; renders `BID-*` in workbench navigation. Existing route IDs, calculation, vendor, BOM, and budget are not modified. Build and screen verification pending on local Windows machine.

## Next
1. Local `npm run build` and navigation smoke test.
2. Link child semantic codes to actual UI sections, including Budget subpanels.
3. Global persistent revision/decision ledger with approvals and explicit project scope; Git commit history alone is not an engineering revision ledger.
