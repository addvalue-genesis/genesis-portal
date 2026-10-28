# PJ2601-0510 — SAT original-revision recovery (2026-10-17)

## Source of truth

- Uploaded original: `1 .Site Acceptance Test(SAT)-integrated 15-10-26.docx`
- Baseline copied locally as: `sat0510_service/templates/PTTEP_SAT_original.docx`
- Selected ZMS–MS diagram as: `sat0510_service/assets/network_zms_ms.png`
- PO / Service Order: **3450075822**.
- Preserve all original SAT paragraphs, tables, inline pictures, results, approval forms, and historical evidence; no "JSON reconstruction" for this deliverable.

## Revisions inspected

1. `generate.py`: original-template image/references replacement.
2. `authoring.py`: JSON generated two-page report (not a faithful SAT revision; NOT active).
3. `pttep_layout.py`: generated approximation of the page chrome (NOT active).
4. `layout_repair.py`: broad change to page breaks/section breaks; may disturb pagination (NOT active).
5. `original_revision.py`: active, retains all original OOXML parts and substitutes only targeted references and the designated network image.

`server.py` now imports `original_revision.render`.

## Mandatory next QA / blockers

- Render output side-by-side with submitted original; ensure no lost embedded drawings, evidence, or tables.
- Repair original duplicated **in-body** page header tables and excessive blank/overflow pages individually. Do not add an overlapping Word Header automatically.
- Confirm cover and revision/approval sheet fit single pages; update page-count labels after final pagination.
- Validate radio IP map (ZMS .224, MS .225, mask /24, gateway .1) against approved configuration; current SAT IP values match the proposed diagram, but on-site verification is pending.
- SAT section 5.1 has frequency 5.590 GHz / 40 MHz; network planning Rev01 shows 5.495 GHz / 80 MHz. Do not silently change until approved.
- Do not treat pre-existing PASS/evidence as SAT verification of the upgrade. Preserve these for engineering review.
- The current React arbitrary Document Editor is NOT yet linked to source-preserving edit operations. Do not claim arbitrary field edits export.
- Original controlled document number MM-ZTK-1A-ONEP-SAT-001 needs document-control confirmation.

## Startup (after copying source files locally)

```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal
git pull --ff-only origin feat/pj2601-0510-sat-workspace-ui-20261017
.\.venv-sat0510\Scripts\python.exe -m uvicorn sat0510_service.server:app --host 127.0.0.1 --port 8051
```

In second terminal `cd frontend; npm start -- --port 3002`. No customer release before visual QA.
