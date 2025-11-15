<?php
// backend/api/employees/create.php
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    send_json(['error' => 'Invalid JSON'], 400);
}

// TODO: Insert into genesis_employee_ext.
// For now, just echo back what we received.
send_json([
    'message' => 'Employee EXT record would be created here in later phase.',
    'received' => $input,
], 201);
