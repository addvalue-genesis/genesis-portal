<?php
// backend/api/employees/get.php
require_once __DIR__ . '/../db.php';

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
if ($id <= 0) {
    send_json(['error' => 'Invalid id'], 400);
}

// TODO: Query Dolibarr + GENESIS. Now returns example only.
$employee = [
    'id' => $id,
    'fk_user_id' => $id,
    'fullname' => 'Example User #' . $id,
    'email' => 'user' . $id . '@example.com',
    'position' => 'Telecom Engineer',
    'national_id' => '1234567890123',
    'passport_no' => 'AB1234567',
    'passport_expiry' => '2027-12-31',
    'health_cert_date' => '2025-11-10',
    'health_cert_expiry' => '2026-11-10',
    'skills' => ['CCTV', 'Offshore', 'Myanmar'],
];

send_json(['item' => $employee]);
