# PJ2608 0550 Existing Working and MGW prices in Schedule previews

UI `2026-10-31.3-preview`, following `953003b` on the same 0550 branch/port 3050.
The user showed A1 empty with 268 unallocated Working records, then showed the
existing 28 CCTV offers and asked why those records/prices were absent from C1.

## Cause and resulting behavior

The prior screen required manually authored schedule bindings and read only
Official-reviewed amounts. Available supplier/Working information was therefore
hidden behind document allocation and review gates. The gates remain necessary
for authorization, but must not prevent preparation and reading of a draft.

Volume I now defaults to **Working Preview**. Opening it projects the current
selected Working cost owners, existing prices and SI allocation suggestions into
the original forms without saving or changing project inputs. The status shows
selected/saved/suggested/unresolved counts, the known customer-selling subtotal
and the number still OPEN. A known subtotal is explicitly not a complete project
price. Price gaps expose their existing Working/FX/input reasons and navigation
back to the source row. Reviewed-only mode remains available.

An explicit **save draft allocations** button saves all new suggestions in one
normal workspace transaction. Existing allocations and reviews are preserved;
new ones are DRAFT with empty reviewer/review stamp. Opening or exporting a
preview never performs that save. No supplier selection, quantity, source offer,
pricing method/rate, margin, Prime or FX value is changed.

## Price and source boundaries

Price precedence is the existing Official-reviewed customer amount, then the
current Working customer amount, then its existing provisional customer amount.
There is no new pricing equation, historical-price fallback, invented markup or
substitution of supplier cost for customer selling price. Missing inputs remain
OPEN. The label identifies the output as a Working draft for selected scope,
pending allocation, price and completeness review. It cannot authorize a package.

**C1** also exposes the existing MGW offer table inside the page, with a system
selector, source quantities/unit costs, original totals, source discrepancies and
links back to the offer editor. CCTV has all **28** catalogue entries. Its source
cover USD **133,072** differs from detail USD **482,142**; the existing 29-Oct
instruction and pricing kernel use the detailed quoted scope when that Working
package is selected. This change does not switch the user's existing selection.
Source offers remain visible even when customer pricing cannot yet be computed.

The internal MGW cost table is excluded from the Word/HTML/PDF customer form.
Selected MGW package owners in C1 can expand into their stored component-basis
rows in the Working draft. Parent price is charged once; component price cells
say **Included**, and their quantities are expressly pending MR reconciliation.
Component references do not become Working lines or additive costs. The footer
total excludes component-reference rows. Source-only alternatives remain in the
internal source panel and are not posted into the customer price.

## Allocation semantics

Rules propose destinations from the existing 0550 WBS, exact MR activity IDs and
exact MGW service row IDs. They are SI interpretations for review, not proof of
engineering/commercial compliance. In particular:

| Existing Working category | Draft Exhibit C destination |
|---|---|
| A goods | C1 / A1 GOODS |
| B1 engineering/coordination | A1 Others; exact document activities → Vendor Documents |
| B2 freight | A1 Others; never renamed packing just because it is transport |
| B3 training | C7 Training; hour/period basis remains required |
| B4 field assistance | Proposed C7 Site Service; exact FAT/IFAT activities → A1 Inspection |
| B5 commissioning/start-up spares | C2 |
| B6 special tools | C5 |
| B7 survey | Proposed C7 Site Service, applicability still requires review |
| B8/B9 regulatory/insurance | A1 Others |
| C1 optional physical installation | A2 Please Specify; not DIEM supervision |
| C2 capital spares | C4, not Exhibit C C2 |
| C3 two-year spares | C3; existing base/option source conflict remains open |

Exact MGW documents/FAT/combined packing-marking-delivery rows retain their full
bundle and propose the matching A1 field without splitting or adding costs.
Unknown categories stay unresolved. B7 WBS here is survey, not top tab 07
Vendors/Evidence or WP.7. The workbook's C1/C2/C3 are also separate namespaces
from Exhibit C C1/C2/C3.

Bindings now accept direct **A1/A2** summary rows for costs that have no dedicated
C1–C8 form, such as project/permit/insurance or optional installation scope.
Existing schema keys and IDs remain; A1 requires BASE and a valid summary role,
A2 requires OPTION/OTHER. Existing C detail unit, source, scope and review checks
remain. A1/A2 and detail views refer to the same single canonical cost owner.

## Verification and limits

Relevant ADR principles: **2,3,5,6,8–13**. This implements readable draft projections
and assistance with allocation; it does not approve engineering, MR quantities,
AVL/deviations or supplier scope. Current strict package readiness, authorization,
frozen bytes/history and backup behavior remain authoritative. The old renderer
path is unchanged for saved/frozen views; Working-only annotations and component
expansion are conditional on the draft projection.

The model regression uses the actual MGW catalogue with explicit synthetic sales
inputs. It checks 28 CCTV source rows, the existing 482142 detail-cost kernel,
canonical customer selling/Prime, component non-additivity, supplier-cost exclusion
from customer rates, unknown sell inputs, offer-change propagation, read-only
opening, batch DRAFT saves, existing-decision preservation and frozen history.
The browser regression checks real C1 tables/downloads, default/reviewed modes,
batch save/reload, no financial/history changes, mobile containment and errors.
Existing native-form, MGW pricing, commercial issue and recovery checks are also
run. Word layout is rendered and inspected with the populated CCTV example.

The screenshot/example tests use synthetic commercial policy inputs and are not
the user's actual bid price. Their amounts must not be copied into project data.

Recorded checks: Working-schedules model and browser PASS; existing three-volume browser PASS; native Exhibit C model/legacy restore PASS; MGW detail-pricing/FX PASS; commercial-issue and workspace-recovery PASS; production webpack PASS with the existing size warning. The populated synthetic C1 Word/PDF was inspected across three pages: all 28 components, repeated headers, complete rows, one package amount and one total, no supplier unit costs in customer cells.
