 # Backend – PHP API (Phase 1.1)

This folder contains a very simple PHP backend that will later be extended or
 migrated to Slim Framework if needed. For now it is **pure PHP** so you can
 run it on any basic PHP hosting or XAMPP without extra tools.

 ## Files

 - `api/config.example.php` – database configuration template
 - `api/db.php` – helper to open a MySQL connection
 - `api/employees/*.php` – endpoints for Employee Core module

 ## Endpoints (initial draft)

 - `GET  backend/api/employees/list.php`
 - `GET  backend/api/employees/get.php?id={id}`
 - `POST backend/api/employees/create.php`
 - `POST backend/api/employees/update.php`
 - `POST backend/api/employees/delete.php`

 All endpoints return JSON.

 ## Note

 - In this package the endpoints are **stubs**: they show the expected structure
   and response format. In later phases we will connect them to:
     - Dolibarr ERP database (read‑only for core user data)
     - GENESIS database (`genesis_employee_ext` table) for extension data.
