<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

try {
    $db = etm_db();
    $user = etm_require_user($db);
    $projectCode = $_GET['project'] ?? 'PJ2608-0550';
    $ctx = etm_project_access_context($db,(int)$user['id'],$projectCode);
    etm_require_permission($ctx,'project.view');

    etm_json_response([
        'ok'=>true,
        'user'=>[
            'email'=>$user['email'],
            'display_name'=>$user['display_name'],
        ],
        'access'=>$ctx,
    ]);
} catch (Throwable $e) {
    etm_json_response([
        'ok'=>false,
        'error'=>'ACCESS_CONTEXT_ERROR',
        'message'=>$e->getMessage(),
    ],500);
}
