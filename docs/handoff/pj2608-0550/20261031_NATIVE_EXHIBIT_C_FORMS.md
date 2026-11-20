# PJ2608 0550 Native Exhibit C screens and Word export

UI `2026-10-31.2-preview`, following `a5bdd4b` on the existing
`feat/pj2608-0550-official-working-20261028` branch and port 3050.

The user supplied ten screenshots of the actual Exhibit C forms and clarified
that these documents must be visible on screen and export in their original
format. The previous flat summary tables did not meet that requirement.

## Result and entry points

Volume I opens at **11.A1**. The compact numbered tabs expose **11.A, A1, A2,
B, C, C1–C8**. Each displays the native form, with the original multi-level and
merged headers, fixed descriptions, CIF/FOB columns and notes. Source wording
and errors are retained, including A2's Base wording and C4's blank FOB heading.
The supporting evidence/review editor is collapsed beneath the document.

Each form has **Export Schedule Word (.docx)** and **Print / PDF**. Complete
Exhibit C Word is available there and in **11.P**. Word export edits the supplied
Word package, retaining its styles, original table XML, section sizes, logo,
relationships, legal introduction, headers and notes. Individual form export
uses the same body with the native landscape section. An explicit draft/authorized
footer is added; the total-page field references the final numbered page instead
of retaining a false fixed 18 after continuation or individual extraction.
Browser/print HTML projects the same template structure and values at a readable
screen scale; browser fonts and page flow can differ from Word pagination.

The existing XLSX remains a **data worksheet**, not the native-layout deliverable.
It is not described as a reproduction of the original Word form. Volume I HTML
also retains its power-of-attorney/undertaking cover. Volumes II/III retain their
existing document responsibilities and records; these supplied screenshots are
all Volume I schedules.

## Inputs and limits

The form view reads existing canonical Working quantities and customer selling
amounts. It does not seed or alter selections, prices, FX, margins or scope.
Unallocated Working lines stay visible as gaps with navigation to **11.M**.
Selecting a native summary row, customer delivery term and source-backed metadata
does not duplicate an amount or create another cost owner.

Native row choices distinguish Site Service/Training and the five C8 facilities.
Explicit CIF versus FOB delivery terms determine which price cells are filled;
unknown terms show OPEN and block new native issue preparation. C2–C4 produce a
separate form for each Main Equipment number and continue after seven rows.
C1/C5/C6 and service groups continue without dropping overflow records.
C7 still requires the existing explicit man-hour basis; no day/hour assumption is
inserted from the UI. A2 DIEM quantity/rate is OPEN without a canonical MD basis.
C8 retains the existing canonical unit controls: a round-trip entry is not silently
converted to man-days. Unsupported/missing quantity bases require source/Working
resolution before authorization. The native row remains visible in the form.

Optional response `nativeFields` holds Agreement No., bidder name/address and
service-period text. Optional binding fields hold vendor equipment number and
reference drawings. They are authoring metadata, not copied prices/quantities.
Legacy records without these fields validate, and adding empty defaults does not
stale their reviews. Actual metadata changes participate in existing fingerprints.
Missing headers, conflicting equipment references, unknown native row allocation
or rate placement remain review work, not customer acceptance.

## Frozen output compatibility

New v3 packages additionally freeze `nativeExhibitVersion` and the exact native
Word bytes (`docxI`, base64). **10.7 Export Frozen Exhibit C Word** downloads
those stored bytes. Subsequent Working or template changes do not regenerate them.
Previously issued v1/v2/v3 records are not rewritten. Restoring an older v3 package
uses its prior table/HTML renderer and readiness policy; it cannot pass as a newly
authorized native package. New authorization verifies the actual saved workspace,
native response gaps, exact frozen output and the existing package controls.

`exhibitCNativeTemplate0550.json` is generated from the supplied
`3 Exhibit C-Commercial Terms rev-0.docx` using
`frontend/scripts/prepare-exhibit-c-template-0550.py`. It records the source hash.
The generator verifies expected headings/table locations; do not point it at a
different revision without reviewing the mapping. It never modifies the source.

## Verification

Relevant ADR-0550-001 principles: **2, 3, 5, 6, 8–12**. This is a document view/export
change with bounded readiness checks, not new engineering or customer approval.

The native regression covers all thirteen forms, merged headers/notes, unchanged
canonical inputs, CIF/FOB placement, continued rows, per-equipment forms, escaped
HTML/Word, legacy optional fields/reviews, historical restore and exact frozen Word.
The browser regression exercises every Schedule, actual Word/XLSX downloads,
unsaved-metadata guards, real authorization/frozen Word bytes, existing VDRL and
Deviation links, unchanged financials/history, backup restore, reload and mobile
containment. The synthetic Word exports are rendered with the document renderer;
all form pages and the complete Exhibit C are inspected for layout.

Production webpack keeps the existing bundle-size warning; the native template
increases the 0550 route bundle. Source distribution, automatic paired JSON,
module IDs and Windows startup command stay the same. Tests use isolated synthetic
data, not the user's private browser workspace. No customer submission is sent.
