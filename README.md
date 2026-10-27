## PJ2608-0550 working version

Use **0550-20261027.1** on `fix/pj2608-0550-canonical-workspace-20261027`, based on the existing bidding workflow. From this checkout, double-click `START-0550.cmd` on Windows, or run `npm ci` then `npm run start:0550` in `frontend`. The only recommended local entry is `http://localhost:3001/projects/pj2608-0550`. Stop an older server on port 3001 before launching; do not move to another port to resolve a conflict.

The page header must show **WORKSPACE 0550-20261027.1**. Export the current browser workspace before updating or moving between ports. Private equipment policy rates are configured/imported in Working Preview; no project percentages are published in the source. See [the current handoff](docs/handoff/pj2608-0550/20261027_CANONICAL_WORKSPACE.md).

# Addvalue GENESIS Portal

Official Development Repository for Add Value System Co., Ltd.

GENESIS is the unified digital backbone for Addvalue — integrating:
- PostgreSQL Core Database
- Project Management & Cost Engine
- Document Control + OCR Extraction
- Staff Management (Passport, Training, Health)
- ERP Sync: MySQL → PostgreSQL Mapping
- Modular WebApp (176 HTML modules)
- GENESIS API Gateway
- GENESIS Architecture & Development Rules

---

## 📁 Repository Structure

```
/database      → PostgreSQL schema files, migrations
/mapping       → MySQL → PostgreSQL mapping definitions
/modules       → HTML modules (176), categorized
/docs          → Architecture, diagrams, references
/backend       → API Layer (Node/Express or Python/FastAPI)
/frontend      → GENESIS UI (webapp)
/docker        → Docker Compose (DB + API + Frontend)
/tests         → Test automation
```

---

## 🚀 GENESIS Development Roadmap

1. GENESIS PostgreSQL Schema v0.1  
2. ERP SQL → PostgreSQL Mapping  
3. Load 176 HTML modules → Modules Catalog  
4. GENESIS API Adapter for modules  
5. Project Cost Engine  
6. Document OCR Pipeline  
7. Staff System Integration  
8. Unified WebApp GENESIS v1.0

---

## 🧩 Ownership
Add Value System Co., Ltd.  
Organization: **addvalue-genesis**
