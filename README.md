# Addvalue GENESIS Portal

This repository contains the source code and documentation for the **Addvalue GENESIS Portal**, 
an extension system that works on top of the existing Dolibarr ERP database using the ERP‑First principle.

## Structure

```text
genesis-portal/
├── backend/          # API + business logic (Claude focus)
├── frontend/         # React UI (ChatGPT focus)
├── database/         # Schema, migrations, seeds (shared)
├── docs/             # Architecture, ERD, field mapping, specs
├── mapping/          # Dolibarr → GENESIS field mapping assets
├── tests/            # Automated tests
├── docker/           # Deployment and containerisation (later phase)
└── README.md
```

## Roles

- **Jack (Suriyapong)** – Project Director, business owner, final decision
- **ChatGPT** – Frontend, workflows, documentation, integration glue
- **Claude** – Backend, database, performance, security

## Principles

- ERP‑First: Dolibarr ERP remains the single source of truth.
- GENESIS is an extension layer; it does not modify Dolibarr core tables.
- Company = People (Resources) + Work (Processes); GENESIS links both.
