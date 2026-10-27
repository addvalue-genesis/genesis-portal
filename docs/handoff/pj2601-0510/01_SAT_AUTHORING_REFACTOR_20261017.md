# PJ2601-0510 SAT Authoring Refactor

Branch: feat/pj2601-0510-sat-workspace-ui-20261017

Architecture: React JSX Document Editor → JSON sections/blocks → Python python-docx composer → DOCX → LibreOffice PDF → iframe preview.

## Setup

```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal
git pull --ff-only origin feat/pj2601-0510-sat-workspace-ui-20261017
.\.venv-sat0510\Scripts\python.exe -m pip install -r sat0510_service\requirements.txt
.\.venv-sat0510\Scripts\python.exe -m uvicorn sat0510_service.server:app --host 127.0.0.1 --port 8051
```

Frontend separate terminal: `cd frontend; npm start -- --port 3002`

## Constraints & known gaps

- The original DOCX is a visual reference, not the underlying text-replacement template any more.
- Exact PTTEP formatting equivalence is NOT certified; must compare generated pages visually before issue.
- Sections support paragraph/heading/table/image/pageBreak. Image currently references the fixed approved diagram PNG in backend assets.
- Draft editor state is in browser memory; export the JSON for retention; no full import or permanent server revision ledger yet.
- Only the default document sections are user editable. Detailed BOM, validation rules and test evidence are not yet fully bound to JSON.
- Changing IP data does not update text burned into a PNG. User must reconcile the diagram.
- Initial SAT test status must remain NOT TESTED until actual test evidence is approved.
- Branch change has not yet passed a Windows npm build or actual PDF visual QA.
