# PJ2608 0550 Three proposal volumes and change impact

Date 31 October 2026 Asia Bangkok. UI `2026-10-31.1-preview`.
Base `f81dec7d23401e618f653ac2a1384019212254ee` on
`feat/pj2608-0550-official-working-20261028`. Application stays on port 3050.

The user authorized implementing the reviewed three-volume structure, numbered
tabs, changes originating in customer A or supplier/Working inputs, linked
Deviation review, and a VDRL-guided Volume II. This extends existing records and
does not reprice, select replacement suppliers, approve engineering or send a bid.

## Navigation and responsibility

| Number | View | Purpose |
|---|---|---|
| A | Original RFQ Documents | Customer requirements and received evidence |
| 01 to 10 | Existing SI workbenches | Keep their identities and commercial sections 10.0–10.8 |
| 07 | Vendors and Evidence | Supplier sources on the right; not the same as WP.7 |
| WP.1 to WP.8 inside 10.2 | Working Preview process | SI reasoning and reconciliation using both source sides |
| 09.3 | Inputs and Change impact | Explicit dependency graph and bounded affected-record traversal |
| 10.7 | Existing Release | Readiness, authorization, exact frozen output and transmittal records |
| 11 | Volume I Quotation | Cover and Exhibit C A/A1/A2/B/C/C1–C8, allocation and draft export |
| 12 | Existing Volume II Technical | Preserve IDs and five Invitation sections; add 12.V VDRL |
| 13 | Volume III Commercial | Eleven qualification responses and commercial deviations |
| 14 | AVL and Deviation | Existing technical register/export and the same commercial register as 13.D |

`11.A1`, `11.C7`, `12.V`, `13.8` and `09.3` are searchable display references.
Old module addresses, 15 architectural MOD identities, records, prices, storage
origin and automatic source preparation remain. No extra independent supplier,
requirement, quantity, price or Deviation copy is made for a new view.

## Inputs and equations

The existing SI equation remains:

`R = F_SI(A, S; K, D, Θ)`

A is customer sources, S is supplier sources, K is reusable knowledge/equations,
D is recorded SI decisions, and Θ holds quantity/unit, rate, selling method,
commercial treatment, FX and rounding/version bases. Menu B is the workspace,
not a replacement symbol for S or F_SI.

| Input change | Numerical effect | Review and document effect |
|---|---|---|
| Customer content, revision, authority, replacement | No guessed BOM/quantity or replacement product | Linked requirements/proofs/activities/allocations return OPEN or STALE; SI must resolve |
| Offer cost, unit, currency, dates, brand/model | Referencing Working rows reuse their existing equations | Review selected offer, engineering, AVL, linked technical response and schedule binding |
| Working quantity or selected offer | Recompute that cost owner and its parent totals | Reconcile requirement/offer choices, physical list, technical response and schedules |
| Calculation inputs | Re-evaluate existing equation and quantity bindings | Revisit proof/criteria, activities and linked documents |
| Topology/interface | No automatic invention of equipment | Revisit relevant system/shared proof and interface dependencies |
| Selling method/rate, markup, margin, Prime or FX | Follow existing cost/sell/FX/rounding policy | Affected price reviews and document allocations stale; no overwrite of an issued amount |
| VDRL, qualification, narrative, Deviation evidence | No new additive costs | Check referenced content, document review, acceptance and current package readiness |

Financial kernels are reused, including `MD = Events × Days × Crew`,
`MH = MD × Hday`, `Cost = quantity × native unit cost`,
`Sell = Cost × (1+m)` or `Cost/(1−g)`, and the existing DIRECT and Prime paths.
DIRECT selling prices may remain fixed when cost changes: a cost change does not
imply every selling price changes. Existing per-line money rounding and FX apply.
C7 may derive man-hours from canonical MD only with an explicit source-backed
hours/day binding. It never substitutes elapsed days for man-days.

The impact graph defines an edge `x → y` when y references/depends on x.
`Affected(x)` is the set reachable from x; a visited set terminates cycles.
The UI reports known linked effects rather than mutating their inputs. It covers
registered sources, requirements, offers, calculations, topology, particulars,
AVL/deviations, activities, Working, technical records, schedule bindings,
VDRL and document responses. It is not a semantic reader or a proof that every
engineering dependency has been discovered. Existing scope fingerprints can be
more conservative than this graph, especially inventory-level source reviews.
Calculating a React projection again is not writing every project record again.

## Proposal records and schedule allocation

Optional `bidVolumes` v1 extends the validated bidding workspace. It holds
document metadata, response/evidence records, one binding per canonical Working
line, VDRL rows and a commercial deviation register. Opening tabs does not write
or seed these records. Existing IndexedDB transactions/audit/backup validation
are reused. An older backup preserves a current bidVolumes register; restoring
earlier Working inputs can stale its dependencies but cannot erase the package
controls or frozen history.

One additive Working owner is bound to one C1–C8 detail schedule and a named
A1/A2 summary. Prices/quantities remain in Working; the forms project the same
reviewed USD amounts and check allocation conservation. Unknown/unallocated
amounts remain OPEN, not zero. Included component records are not additive.
Changing Base/Option treatment in a document cannot reclassify Working silently.
C8 call-off rates may reference explicitly unselected canonical Working rows;
they are excluded from Base/Option sums and require a reviewed source-backed
C8 disposition and man-day basis. Selecting that same rate into Base invalidates
the call-off treatment; no new cost line is posted by the document view.
The selected Working offer and technical offer references must reconcile through
the canonical requirements; changing product without updating the mapping blocks
the package. These checks compare structured links, not the meaning of prose.

Exhibit C rev-0 uses C6 Consumables, C7 Field Services/Training, C8 Facilities.
Invitation's index differs. C3 two-year spares and C8 Base/call-off have conflicting
template wording. Record exact customer confirmation/disposition in 11.C3 and
11.C8; no silent conflict resolution, new charge or allowance is introduced.
Supplier purchase Incoterms and customer delivery terms are separate: each
schedule binding records the customer delivery term/place and its source.

Draft XLSX and printable HTML use the same table projection as Preview. The
workbook has Cover plus 13 Schedule sheets, actual quantity/unit and customer
selling amounts, repeat print headers and landscape pages. These are editable
schedule preparation forms, not a byte-identical reproduction of the Word file.
Native part/interchangeability/logistics/weight fields and C7 hour basis stay
OPEN until supplied. No cost, markup, margin, FX fields or private source corpus
are exported automatically. VDRL and Volume III also export XLSX/HTML; Volume II
retains its technical HTML/Print-to-PDF export and includes the VDRL plan.

## VDRL and deviations

VDRL rows record document number/title, source/locator, system, owner, due date,
submission phase, deliverable reference and links to the existing technical
responses. They can link one deliverable to several Invitation sections.
With Bid, Post Award and explicit N/A are separate. The source-backed VDRL scope
review and With-Bid links must cover the five Invitation sections for applicable
systems. Existing reviewed N/A requirements can remove an explicitly excluded
scope from mandatory authoring, while it remains visible in the original checklist.
Imported source metadata or an empty register never establishes completeness.

AVL nonlisting prepares/updates the existing technical deviation workflow.
Changed dependencies prevent stale deviation exports. User text and decisions
are retained; no customer acceptance is manufactured or silently rewritten.
Commercial deviations are one canonical register viewed at 13.D and 14.2.
Acceptance needs current source/locator/excerpt, reviewer and current dependencies.
An internal Volume I/II mismatch is a correction task first. Only a deliberate
departure from a customer requirement belongs in a customer deviation request.

## Release and version compatibility

Saving the new bidVolumes register activates full-package prerequisites on new
commercial authorization. Legacy workspaces without it retain their old
commercial-only behavior and are explicitly labelled as not certifying a complete
three-volume bid. Once enabled, normal saves cannot remove the package controls.
The gate requires Integration/Official readiness, current schedule mapping,
technical consistency, VDRL With-Bid coverage, qualification responses and accepted
applicable technical/commercial deviations. Draft export does not satisfy it.

New package issues use commercial-issue v3 and freeze exact I/III/VDRL table
projections plus printable I/II/III/VDRL content, alongside the existing customer
rows and raw workspace. Frozen export reads these stored outputs without running
future pricing or document rules. Existing v1/v2 issues remain supported and are
not migrated/reissued. Append-only transaction enforcement, backup conflict checks
and separate transmittal evidence remain. Authorizing is a local record, not an
authenticated signature or an external submission.

## Verification and remaining project work

The new model regression uses a synthetic complete package to exercise real v3
authorization, source/offer staleness, inconsistent selected offers, pending
commercial deviations, VDRL gaps, unknown totals, strict schema/roundtrip,
canonical financial preservation, impact cycles, exact immutable frozen outputs,
escaped Excel/HTML and rendered React views. Native XLSX is also opened with
openpyxl to inspect sheets, totals and print setup.

The browser regression uses a separate database and synthetic sources to test
numbered navigation/search, schedule preview/download, VDRL unsaved-edit guard,
impact traversal, authorization/frozen download, authoring persistence, shared
commercial deviations and mobile containment. Run results are recorded in the
completion report. Production compilation retains its existing bundle-size warning.

ADR principles applied: **1–6, 8–14**. This change provides workflow and checks;
it does not claim all real A pages are read, every supplier update is received,
every VDRL native row is interpreted, calculations are accepted, or a project bid
has been issued. Existing private source/Windows state is not replaced by the
synthetic fixtures. No customer message, merge or submission is performed.

### Recorded results on the final implementation

- Eleven model/render suites passed: bid-volumes, working-preview,
  avl-reconciliation, technical-proposal, release-issue, bidding,
  source-readiness, source-workspace-auto, si-controls, workspace-recovery,
  and price-summary. The final bid-volumes/release/recovery checks were repeated
  after the authoring and backup-preservation corrections.
- Production webpack compilation passed with the existing large-bundle warning.
- New three-volume browser suite passed: all fourteen tabs, searchable numbers,
  actual downloads, canonical data preservation, VDRL unsaved-edit guard,
  real v3 authorization and frozen output, old-backup preservation, reload and
  mobile containment; zero page errors.
- Existing Volume II browser suite passed unchanged, including authoring,
  physical details, source navigation and escaped draft export.
- Native workbook opened in openpyxl: Cover plus thirteen schedules, numeric
  totals, frozen/repeating headers and landscape print configuration checked.
- The full-page synthetic QA screenshot was visually inspected; it is not the
  user's project data or evidence that the Windows installation has been updated.
- `git diff --check` passed. No actual customer issue, message or merge was made.
