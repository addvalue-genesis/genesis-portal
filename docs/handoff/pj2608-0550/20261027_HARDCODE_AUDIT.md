# PJ2608-0550 data / hardcode audit — 27 October 2026

Status: reviewed code paths and repaired confirmed data literals; not a certificate that the entire application is free of project-specific constants.

Baseline: `b8c74a31b1a86846c877550a2021cb68aa92e913`, branch `feat/pj2608-0550-source-intake-20261027`, draft PR #50. Scope: the 0550 data facade/repositories, reference registries, calculation runtime, bid workspace model, source intake/Drive bridge, coverage binding, project page and price export. No new private source content is added to the public repository in this change.

## Findings and changes

| Area | Before | After / classification |
| --- | --- | --- |
| Project facts | Stakeholders, location, conditions and evidence states embedded in `projectFacts.js` | Existing records moved unchanged into versioned reference JSON |
| B1 cost lineage | THB 24M allowance, recovered THB 11,155,029.32325 and gap THB 12,844,970.67675 embedded in JS | Same values and row details in reference JSON; gap remains unresolved |
| Service method references | Source metadata, E01–E18 descriptions and B/C allowance narratives embedded in JS | Reference JSON, with validated method IDs; actual executable formulas remain in `serviceEquationRuntime.js` |
| Engineering / regulatory bindings | System-to-kernel map, PAGA review candidates, reuse crosswalk and project logistics instruction embedded in JS | Reference JSON; common knowledge binding and projection algorithms remain in JS |
| Repeated UI values | B1 heading repeated `24M`; day label repeated `8h`; FX card repeated `33.6335` | Read from reference data / the existing frozen dataset |
| Unknown monetary values | Seven display expressions substituted zero for a missing amount | Missing remains an em dash through existing money formatters |
| Original price-form export | Missing quantity/unit silently became `1 Lot`; zero total became blank | Missing quantity/unit stays blank; explicit zero is preserved; known issued workbook remains byte-identical |
| Main controlled dataset | Already read from validated snapshot JSON | Unchanged |
| Current bid inputs | Already stored as validated mutable workspace records, with source/date controls for FX | Unchanged; historical allowances do not become current inputs |
| Source inventory | Reviewed private intake JSON loaded through the local Drive Desktop bridge into the workspace | Unchanged; this migration does not add documents or re-review evidence |

## Storage and authority

`frontend/src/project0550/data/reference/pj2608-0550.reference-registers.json` contains preserved reference data. `referenceRepository.js` validates references and authority and freezes the loaded object. Existing module exports remain compatible wrappers, avoiding a dependency cycle with the main repository and equation runtime.

The registry is bundled, version-controlled JSON: a reviewed change still requires a rebuild. It is not a live database or a raw-document ingestion engine. The `PRESERVED_REFERENCE_NOT_CURRENT_BID_INPUT` authority and migration metadata are deliberate. Moving records to JSON does not prove their facts, approve their prices, refresh regulatory knowledge, resolve conflicts, or promote them into the current bid. Existing evidence states and historical allowance descriptions are retained exactly.

Keep these data sources separate:

1. Frozen issued snapshot: immutable historical price/evidence record.
2. Reference registries: preserved method/source/binding records, changed only through reviewed revisions.
3. Mutable bid workspace: current quantities, vendor offers, rates, FX, calculations and source intake.
4. GDrive/Gmail original evidence: upstream source authority; reviewed intake is a structured projection, not a substitute for reading every original document.

## Remaining literals / limits

- The legacy project page still has historical issue-date, route and status narrative literals (for example `08-Oct-2026`). These are presentation duplication and should eventually read submission metadata. This audit does not claim that all page copy is data-driven.
- WBS IDs, unit/currency lists, the 19-system and project-identity boundaries, 15 module IDs, PAGA pilot defaults and customer-form row layout remain explicit configuration. They are not current price/rate inputs. Generalizing the app to other projects requires a separate configuration design.
- Formula constants, rounding, numerical validity limits, layout sizes and ZIP/XLSX format constants remain code. Do not mechanically move every number to JSON.
- `legacy/data.rev04.20261005.js` remains an archival hardcoded module. No active import was found in the frontend source search; do not delete historical evidence as part of this audit.
- Existing allowance explanations still contain historical numbers inside JSON text. They are preserved source interpretation, not computed live commentary. Any future revision must reconcile the prose and numeric records together.
- Windows Drive mount and full browser interaction were not verified in this audit. Existing automated local bridge and server-rendered checks pass. No legal/regulatory freshness review was performed.

## Validation

- `npm run build`: all eight validation commands pass, followed by production compilation. Three existing webpack bundle-size/performance warnings remain.
- New `npm run validate:pj0550-references`: eleven exported/projection structures match the pre-migration canonical baseline exactly, including prices, evidence states, kernel mappings and coverage.
- Reference validation rejects wrong authority/project, duplicate equation IDs, broken method/crosswalk/service-line references, inconsistent B1 reconciliation and an invalid equivalent-day basis. Deep freezing prevents mutation of shared records.
- Known issued XLSX SHA-256 remains `2065bb70efa3e8b3bb90b4fbe64f099e02d1ae6c73a73d03b8e745987becafc6`. Missing quantity/unit and explicit zero cases are tested separately.
- Frozen snapshot integrity, 19 systems, 15 module IDs, equation evaluation, current bidding, source intake and Drive bridge checks pass. Final release remains HOLD.

The projection baseline test is an intentional migration guard. A future authorized reference revision must update its expectation with a reviewed explanation, rather than silently bypassing it.
