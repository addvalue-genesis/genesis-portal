# PJ2601-0510 PTTEP SAT Workspace — Local Template Service

This module uses the project's PTTEP DOCX template as the real layout master. The Webpack JSX page is at `/projects/pj2601-0510/sat`. The service is separate from the Webpack dev server.

## Required source assets (not automatically committed)
The approved master DOCX and selected network PNG are source materials and must be copied from the previously supplied SAT Workspace Pilot package:
- `sat0510_service/templates/PTTEP_SAT_project_references.docx`
- `sat0510_service/assets/network_zms_ms.png`

The pilot ZIP contains these under `templates/` and `assets/`. Retain the original Word template unchanged. Do not use an AI-regenerated substitute image.

## Start (two terminals)

In the repository root:

```powershell
py -m pip install fastapi uvicorn lxml
py -m uvicorn sat0510_service.server:app --port 8051
```

In `frontend` (a different PowerShell window):

```powershell
npm start -- --port 3002
```

Open http://localhost:3002/projects/pj2601-0510/sat , select **PTTEP Preview** and choose **Generate PTTEP DOCX + PDF**.

PDF conversion requires LibreOffice `soffice` on PATH. Both downloadable documents are generated from the SAME DOCX; the PDF viewer is not a fake HTML preview.

## Current limitations
- Basic references/IP addresses and the embedded network diagram are bound; many BOM and test table cells are not yet dynamically bound.
- The selected PNG is a fixed image; editing addresses in JSON does not change pixels inside it.
- Original SAT results and evidence must NOT be treated as verification of the new installation.
- Page-faithful output must be checked against PTTEP master manually per page; original pagination/header defects remain possible.
- The UI is a working prototype, not an approved PTTEP document for issue.
