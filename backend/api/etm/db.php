<?php
declare(strict_types=1);

function etm_json_response(array $payload, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function etm_db(): PDO {
    $host = getenv('ETM_DB_HOST') ?: '127.0.0.1';
    $port = getenv('ETM_DB_PORT') ?: '3306';
    $name = getenv('ETM_DB_NAME') ?: 'addvaluesystem_gns_etm_r01';
    $user = getenv('ETM_DB_USER') ?: '';
    $pass = getenv('ETM_DB_PASS') ?: '';

    if ($user === '') {
        throw new RuntimeException('ETM database credentials are not configured.');
    }

    return new PDO(
        "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
}
