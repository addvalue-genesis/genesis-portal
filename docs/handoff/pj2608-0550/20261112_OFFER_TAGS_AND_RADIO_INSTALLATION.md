# Offer TAGs and Radio installation evidence

12 Nov 2026. Official Working, based on `67b2f514`.

Use 07.2 to record several values on the existing Offer for Equipment TAG,
TAG Location, Cabinet/Rack and Volume I classification. The Offer editor
supports A1/A2, C1–C8 and D/E/F. The quotation register filters source items
by these TAGs. M and P reflect Working links and Schedule bindings.
Quoted totals continue to describe the full source quotation.

The internal Volume I view groups Working records by supplier, quotation
and source revision, then shows the existing 11.M destination. A single
compatible source category can prefill an unsaved 11.M editor. Existing
saved allocation and spare-equation paths keep priority. D/E/F are
supporting views for a Working owner. The preview follows the current
allocation and does not generate financial lines from source TAGs.

MGW Q26-063 Radio uses one CUS evidence table keyed by existing quote item.
07.2 and the shared Supplier/Working detail use that table. All 18 priced
source rows have a CUS reference or an OPEN state. The Motorola Option
has A2 metadata and retains its TBD rate. The source total is USD 700,501.

The APF Radio BLD places Marine, Aeronautical and MF/HF equipment in
RAD-309 at the Control Building ITR. APF-CAB-0004 is the DMR cabinet
reference in LIS, with individual cabinet allocations OPEN. ACP LIS
and BLD identify RAD-308-001 as the Radio cabinet and show the standalone
Console at its point of use. The 700 m quote lot has a rack endpoint
reference and unresolved per-cable TAGs. Conflicting CUS revisions and
shared APF package references remain explicit. The existing approved
requirement and cabinet TAG bindings are distinct from Offer inputs and
remain available.

ADR-0550-001 principles 2, 3, 5, 6, 9, 10 and 12 apply. No new module or
Offer IDs. Financial ownership, export calculations and formal Release
continue through the existing Working and Schedule records.

Targeted checks passed for multiple values, optional field validation,
unambiguous 11.M prefill, four quote filters, all 18 Radio source rows,
and quotation grouping in 11.M/11.P via React SSR. Changed JS/JSX compiles
with Babel. Full webpack and the Windows browser workspace were not verified.
