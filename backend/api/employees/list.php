<?php
// backend/api/employees/list.php
require_once __DIR__ . '/../db.php';

// TODO: In later phases we will JOIN:
// - Dolibarr: llx_user
// - GENESIS: genesis_employee_ext
// For now, return a static example payload.

$example = [
    [
        'id' => 1,
        'fk_user_id' => 1,
        'fullname' => 'Example User',
        'email' => 'user@example.com',
        'position' => 'Telecom Engineer',
        'national_id' => '1234567890123',
        'passport_no' => 'AB1234567',
        'passport_expiry' => '2027-12-31',
        'health_cert_expiry' => '2026-11-01',
    ],
];

send_json(['items' => $example]);
