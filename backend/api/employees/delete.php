<?php
// backend/api/employees/delete.php
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input) || empty($input['id'])) {
    send_json(['error' => 'Invalid payload, missing id'], 400);
}

// TODO: Delete from genesis_employee_ext.
send_json([
    'message' => 'Employee EXT record would be deleted here in later phase.',
    'received' => $input,
]);
