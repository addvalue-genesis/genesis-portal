# GENESIS Coding Agent — PJ2608-0550 Handoff Controls

**Status:** Draft public-safe instructions. No permission to change frozen customer prices, issue a proposal or merge changes.

## Read these in the 0550 project first

- `docs/handoff/pj2608-0550/20261026_FORMAL_HANDOFF_FROM_0553.md`
- `docs/architecture/GENESIS_0550_EQUATION_REUSE_MANIFEST_Rev00.md`
- `frontend/src/project0550/architectureManifest.js`
- `frontend/src/project0550/serviceEquationModel.js`
- `frontend/src/project0550/data/snapshots/pj2608-0550.rev07.json`

## Primary work

Continue the EXISTING 19-system 0550 portal (PAGA first), not a new UI or second pricing engine. Project 0553 is a methodology/reference source only. Keep 0550 and 0553 data and WBS/FX/vendor prices isolated.

Project 0550 existing E01–E18, its eight knowledge kernels and 15 Module Registry IDs are the starting implementation. GEQ-001–033, PEQ, GMR, GKR and GPE are candidate reusable forms/control families; evaluate implementation and source compatibility before importing them.

Every required module should trace original requirement → engineering applicability → quantity/BOM → unique cost owner → Working/Release display → original-format export. Exact navigation roundtrip must be read-only. Unknown/TBC/HOLD is not zero.

Keep the controlled 0550 budgetary issued snapshot immutable. The 0550 base is a protected reference branch `feat/pj2608-0550-tpp-ui-rev04`; this handoff is documentation on `docs/pj2608-0550-handoff-20261026`; perf instrumentation is an isolated PR #44. Do not merge 0553 PRs blindly or port 0553 financial numbers.

Performance: 19-element filtering/grouping was very fast on the CI baseline. Profile actual browser PAGA module/Excel and expensive selectors before optimizing; no perf gain can change output identities, calculations or approval state.

Run `npm run validate:pj0550-data` and `npm run build` with actual execution evidence, and disclose pending requirements/engineering/commercial gates.

**Confidentiality:** Repository was PUBLIC at inspection. Do not commit vendor quotes, confidential costs, private project chats or secrets. Use restricted storage for detailed project evidence.
