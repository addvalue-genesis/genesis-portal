<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

function etm_auth_user_email(): ?string {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    $mode = getenv('ETM_AUTH_MODE') ?: 'session';

    if ($mode === 'dev') {
        $dev = getenv('ETM_DEV_USER_EMAIL') ?: null;
        return $dev ? strtolower(trim($dev)) : null;
    }

    if (!empty($_SESSION['etm_user_email'])) {
        return strtolower(trim((string)$_SESSION['etm_user_email']));
    }

    if (!empty($_SERVER['REMOTE_USER'])) {
        return strtolower(trim((string)$_SERVER['REMOTE_USER']));
    }

    return null;
}

function etm_require_user(PDO $db): array {
    $email = etm_auth_user_email();
    if (!$email) {
        etm_json_response(['ok'=>false,'error'=>'AUTH_REQUIRED'],401);
    }

    $q = $db->prepare("
        SELECT id,email,display_name,status
        FROM etm_users
        WHERE email=? AND status='ACTIVE'
    ");
    $q->execute([$email]);
    $user = $q->fetch();

    if (!$user) {
        etm_json_response(['ok'=>false,'error'=>'USER_NOT_AUTHORIZED'],403);
    }

    return $user;
}

function etm_project_access_context(PDO $db, int $userId, string $projectCode): array {
    $q = $db->prepare("
        SELECT
            p.id project_id,p.project_code,p.project_name,
            m.id membership_id,m.project_access,m.system_scope_mode,m.location_scope_mode,
            r.role_code,r.role_name
        FROM etm_projects p
        JOIN etm_project_memberships m ON m.project_id=p.id AND m.user_id=? AND m.membership_status='ACTIVE'
        JOIN etm_roles r ON r.id=m.role_id AND r.status='ACTIVE'
        WHERE p.project_code=?
          AND (m.valid_from IS NULL OR m.valid_from<=NOW())
          AND (m.valid_to IS NULL OR m.valid_to>=NOW())
    ");
    $q->execute([$userId,$projectCode]);
    $ctx = $q->fetch();

    if (!$ctx) {
        etm_json_response(['ok'=>false,'error'=>'PROJECT_ACCESS_DENIED'],403);
    }

    $pq = $db->prepare("
        SELECT p.permission_code
        FROM etm_role_permissions rp
        JOIN etm_permissions p ON p.id=rp.permission_id
        JOIN etm_project_memberships m ON m.role_id=rp.role_id
        WHERE m.id=? AND rp.allowed=1
    ");
    $pq->execute([(int)$ctx['membership_id']]);
    $permissions = array_map(fn($x)=>$x['permission_code'],$pq->fetchAll());

    $oq = $db->prepare("
        SELECT p.permission_code,o.allowed
        FROM etm_user_permission_overrides o
        JOIN etm_permissions p ON p.id=o.permission_id
        WHERE o.project_id=? AND o.user_id=?
    ");
    $oq->execute([(int)$ctx['project_id'],$userId]);
    foreach ($oq->fetchAll() as $o) {
        if ((int)$o['allowed'] === 1 && !in_array($o['permission_code'],$permissions,true)) {
            $permissions[] = $o['permission_code'];
        } elseif ((int)$o['allowed'] === 0) {
            $permissions = array_values(array_filter(
                $permissions,
                fn($x)=>$x !== $o['permission_code']
            ));
        }
    }

    $mq = $db->prepare("
        SELECT module_code,access_level
        FROM etm_membership_module_access
        WHERE membership_id=?
    ");
    $mq->execute([(int)$ctx['membership_id']]);

    return [
        'project_id'=>(int)$ctx['project_id'],
        'membership_id'=>(int)$ctx['membership_id'],
        'project_code'=>$ctx['project_code'],
        'project_name'=>$ctx['project_name'],
        'project_access'=>$ctx['project_access'],
        'role_code'=>$ctx['role_code'],
        'role_name'=>$ctx['role_name'],
        'system_scope_mode'=>$ctx['system_scope_mode'],
        'location_scope_mode'=>$ctx['location_scope_mode'],
        'permissions'=>$permissions,
        'module_access'=>$mq->fetchAll(),
    ];
}

function etm_require_permission(array $ctx, string $permission): void {
    if (!in_array($permission,$ctx['permissions'],true)) {
        etm_json_response([
            'ok'=>false,
            'error'=>'PERMISSION_DENIED',
            'permission'=>$permission,
        ],403);
    }
}
