# Project architecture instructions

## PJ2608-0550

Latest commercial navigation: [fixed 10.0–10.8 order and nested SI steps](docs/handoff/pj2608-0550/20261030_COMMERCIAL_SECTION_ORDER.md), UI `2026-10-30.5-preview`. Working/Budget/Release shortcuts open existing sections; preserve IDs, automatic data loading, financial values and frozen history.

Latest SI/Volume II continuation: [linked drafts and evidence review](docs/handoff/pj2608-0550/20261030_SI_VOLUME_II_CONTINUATION.md), UI `2026-10-30.4-preview`. Optional technical drafts use the existing automatic paired JSON path; preserve authored IDs/slots, local document metadata, deleted records, financial values and history. Actual project engineering/source gaps remain OPEN.

Latest source loading: [automatic existing JSON into A/B](docs/handoff/pj2608-0550/20261030_A_AUTO_JSON.md), UI `2026-10-30.3-preview`. Normal startup must not require downloading/selecting/importing A files. Preserve canonical workspace receipts, user edits/deletions, dedicated 0550 routes/3050, pricing and frozen history.

Latest A preparation: read [linked source preparation and native reading](docs/handoff/pj2608-0550/20261030_A_SOURCE_PREPARATION.md), UI `2026-10-30.1-preview`. Private Rev08 and linked drafts are distributed separately; actual A is still OPEN. Search/preparation does not approve engineering or issue a Release.

Before changing 0550 evidence intake, requirements, supplier mapping, engineering,
execution, document control, pricing, release or their UI, read
[`docs/architecture/ADR-0550-001-integrator-traceability.md`](docs/architecture/ADR-0550-001-integrator-traceability.md).
It records the user's accepted customer–integrator–supplier domain principles.

For the SI equation/module responsibility map and pricing/display review, also read
[`docs/architecture/PJ2608-0550_SI_Equation_Rev03.md`](docs/architecture/PJ2608-0550_SI_Equation_Rev03.md)
and the implementation checkpoint
[`docs/handoff/pj2608-0550/20261029_SI_OPERATING_CONTROLS.md`](docs/handoff/pj2608-0550/20261029_SI_OPERATING_CONTROLS.md).
The equation document is the reviewed design reference; the checkpoint records
what was actually implemented. Do not treat outstanding design goals as runtime checks.

For private SI draft ingestion, see
[`docs/handoff/pj2608-0550/20261029_SI_WORK_PACKAGE.md`](docs/handoff/pj2608-0550/20261029_SI_WORK_PACKAGE.md).
An imported DRAFT is preparation, not approved mapping or engineering acceptance.

For E06 units, schematic review dependencies and the controlled commercial issue /
backup-history contract, read
[`docs/handoff/pj2608-0550/20261029_COMMERCIAL_ISSUE_CONTROLS.md`](docs/handoff/pj2608-0550/20261029_COMMERCIAL_ISSUE_CONTROLS.md).

For Volume II authoring and its optional canonical workspace records, also read
[`docs/handoff/pj2608-0550/20261029_VOLUME_II_TECHNICAL_PROPOSAL.md`](docs/handoff/pj2608-0550/20261029_VOLUME_II_TECHNICAL_PROPOSAL.md).
Draft technical review/export does not authorize a technical or commercial submission.

For A expected RFQ inputs, shared reading and the versioned commercial-issue gate,
read [`docs/handoff/pj2608-0550/20261029_A_INPUT_CONTROLS.md`](docs/handoff/pj2608-0550/20261029_A_INPUT_CONTROLS.md).
Receipt/readiness is not source-clause completeness or engineering approval.

The ADR distinguishes domain A/customer and B/supplier from existing UI areas and
commercial Part A/B/C. Do not rename or migrate those namespaces implicitly.
Preserve source/version lineage, stable IDs, user decisions, single cost ownership
and frozen history. Do not describe a documented principle as an implemented gate
without checking the implementation. Apply these instructions to 0550; do not
reinterpret 0553 project data or workflow through these labels.

The scope is every system and shared obligation required by the customer's project
documents, using the supplied MGW/INDUSTRONIC material and existing Drive catalogs/
datasheets. Do not redefine the task as a CCTV-only pilot, a quote-matching table,
or a UI redesign. The integrator must reason from requirements through engineering
CAL/RPT and verification to the appropriate equipment, services and deliverables.
Distinguish received CAL/RPT evidence from our derived CAL/RPT; a catalog match or
supplier declaration is not by itself proof of system adequacy. See principles 13–14.

### Make use of the principles visible

Before implementing a 0550 change, identify the relevant numbered principles in
ADR-0550-001 and inspect their current implementation. In the completion report
or PR description, state which principles affected the change, the checks actually
performed, and any remaining enforcement gaps. Do not report a policy as enforced
by tests or runtime unless those checks exist and were verified. Documentation-only
changes must be identified as such. Consult the ADR's operational invocation table
when deciding which controls apply; do not require unrelated checks for a small change.
