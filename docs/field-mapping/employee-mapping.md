 # Employee Field Mapping – Dolibarr → GENESIS (Phase 1.1)

This document tracks how we map **Dolibarr ERP** user data into **GENESIS Portal**
 for the Employee Core Module.

 ## Tables involved

 - Dolibarr: `llx_user`
 - GENESIS: `genesis_employee_ext` (in `genesis_portal` database)

 ## Mapping Overview

 | Concept                | Dolibarr (llx_user)      | GENESIS (genesis_employee_ext) | Notes |
 |------------------------|--------------------------|---------------------------------|-------|
 | Internal user ID       | `rowid`                  | `fk_user_id`                    | Primary link between ERP and GENESIS |
 | Login / username       | `login`                  | *(read-only from ERP)*         | Shown in UI, not stored again |
 | Full name              | `firstname` + `lastname` | *(read-only from ERP)*         | Concatenated as display name |
 | Email                  | `email`                  | *(read-only from ERP)*         | Single source of truth is ERP |
 | Job position / title   | `job`                    | *(read-only from ERP)*         | Used in assignment & proposal |
 | National ID            | *(not available)*        | `national_id`                  | New field, Thailand 13-digit or other format |
 | Passport number        | *(not available)*        | `passport_no`                  | New field |
 | Passport expiry        | *(not available)*        | `passport_expiry`              | For Myanmar / offshore deployment checks |
 | Blood type             | *(not available)*        | `blood_type`                   | For medical / HSE forms |
 | Health check date      | *(not available)*        | `health_cert_date`             | From annual medical check-up |
 | Health certificate exp | *(not available)*        | `health_cert_expiry`           | Used in validation rules |
 | Training matrix        | *(scattered / external)* | `training_matrix` (JSON)       | Stores list of trainings & expiry dates |
 | Skills / competencies  | *(not modeled)*          | `skills` (JSON)                | For assignment & proposal auto-generation |
 | Notes / remarks        | `note_private` (?)       | `notes`                        | Optional: GENESIS-specific remarks |

 In later phases we will extend this document to cover:

 - HRM modules in Dolibarr (if enabled)
 - Link to certification documents stored in DMS/ECM
 - Validation rules (passport / medical / training validity windows)
