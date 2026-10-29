# Project architecture instructions

## PJ2608-0550

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
