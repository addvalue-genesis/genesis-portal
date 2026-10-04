# PJ2608-0550 Engineering Truth Model — Rev0

## Digital thread

SOURCE -> REQUIREMENT -> LOCATION -> CONSTRAINT -> INTERFACE -> INPUT
-> CAL -> SDY -> RPT -> ENGINEERING RESULT -> REQUIRED MTO/BULK
-> VENDOR/TBE -> FAT/IFAT -> LOGISTICS -> INSTALLATION
-> PRE-COMMISSIONING -> START-UP -> COMMISSIONING -> TRAINING
-> SAT/ISAT -> ACCEPTANCE -> COST/SCHEDULE/RISK

PAGA is the first vertical slice. The schema must support all telecom systems.

## Six engines

1. Engineering Truth
2. Document & VDRL
3. Work & Manhour
4. Lifecycle Delivery & Acceptance
5. Vendor / TBE
6. Cost / Schedule / Risk

## Technology

- MariaDB 11.4: deterministic engineering source of truth
- JSON: API/import/export/snapshots only
- React JSX: GENESIS/TPP UI
- PHP 8.2: initial cPanel-compatible API
- Google Drive / Cloudflare R2: documents, drawings, images, generated DOCX/XLSX/PDF
- Supabase pgvector: semantic retrieval/RAG only
- GitHub: schema, migrations, formulas, API and React code

## Evidence

A = SOURCE FACT
B = DERIVED ENGINEERING RULE
C = ASSUMPTION / TBC
D = MODEL / SYSTEM DESIGN

Mandatory doctrine:
- NOT FOUND != ZERO SCOPE
- TBC != ZERO COST
- VENDOR BOM != PROJECT REQUIREMENT

## Formula model

MH = Q * UMH

Labor Cost = MH * Rate

PAGA Loop Load = SUM(TAP_W)

Allowed Amplifier Load = AMP_NOMINAL_W * MAX_LOADING_FACTOR

Active Amplifier Count = CEIL(REQUIRED_LOAD_W / ALLOWED_LOAD_W)

A changed input creates a new calculation run. Prior runs remain auditable.

## VDRL / document production

VDRL deliverables are database objects. A document can contain text, tables, formula results,
charts, images, drawings, source citations and appendices. PTTEP templates are versioned.
Generated DOCX/XLSX/PDF must record the DB/formula snapshot used.

## Lifecycle

Engineering, Procurement, Fabrication/Integration, FAT, IFAT, Packing/Logistics,
Installation, Pre-Commissioning, Start-up, Commissioning, Training, SAT, ISAT,
Punch/Closeout and Warranty/Support.

Spare classes include Start-up, Commissioning, Operational, Two-Year,
Capital/Insurance, Special Tools and Consumables.

## Project cost

Project Cost = Equipment + Bulk + Engineering + VDRL + FAT/IFAT + Logistics +
Installation + Pre-Commissioning + Start-up + Commissioning + Training +
SAT/ISAT + Spares + Regulatory + PM + Warranty/Support + Risk.

Excel Rev06 is the migration baseline only, not the future master.
