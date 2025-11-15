# GENESIS Portal – Phase 1.1 Commit Package

This package contains the initial implementation for **Phase 1.1 – Employee Core Module**.

## Scope of Phase 1.1

- Backend: PHP REST-style API (no framework dependency yet, ready to migrate to Slim later)
- Database: `genesis_employee_ext` table and base schema script
- Frontend: React pages for Home + Employees (TH/EN ready)
- Docs: Employee field mapping draft (Dolibarr → GENESIS)

## Structure

genesis-portal/
├── backend/
│   ├── README.md
│   └── api/
│       ├── config.example.php
│       ├── db.php
│       └── employees/
│           ├── list.php
│           ├── get.php
│           ├── create.php
│           ├── update.php
│           └── delete.php
├── database/
│   └── schema/
│       └── genesis_schema_phase1_1.sql
├── docs/
│   └── field-mapping/
│       └── employee-mapping.md
└── frontend/
    └── src/
        ├── App.jsx
        └── pages/
            ├── Home.jsx
            └── Employees.jsx

## How to use this package (Managed Mode)

1. Download this ZIP.
2. Extract it on your computer.
3. Upload/merge the folders and files into your existing `genesis-portal` GitHub repository:
   - `backend/`
   - `database/`
   - `docs/field-mapping/employee-mapping.md`
   - `frontend/src/App.jsx`
   - `frontend/src/pages/Home.jsx`
   - `frontend/src/pages/Employees.jsx`
4. Commit the changes on GitHub.

You do **not** need to run anything yet. At this stage we focus on having the correct
structure and files under version control. Later we will add step‑by‑step instructions
for running the frontend and backend on XAMPP / local machine.
