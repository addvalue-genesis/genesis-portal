<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';

function etm_control_count(PDO $db, string $sql, array $params): array {
    $q = $db->prepare($sql);
    $q->execute($params);
    $row = $q->fetch();
    return $row ?: ['total'=>0,'open_count'=>0];
}

try {
    $db = etm_db();
    $projectCode = $_GET['project'] ?? 'PJ2608-0550';

    $q = $db->prepare("
      SELECT id, project_code, project_name
      FROM etm_projects
      WHERE project_code = ?
    ");
    $q->execute([$projectCode]);
    $project = $q->fetch();

    if (!$project) {
        etm_json_response(['ok'=>false,'error'=>'PROJECT_CONTEXT_NOT_FOUND'],404);
    }

    $projectId = (int)$project['id'];

    $summary = [
        'traceEdges' => etm_control_count($db, "
            SELECT COUNT(*) total,
                   COALESCE(SUM(binding_state IN ('PARTIAL','OPEN','TBC','SOURCE_CONFLICT')),0) open_count
            FROM etm_trace_edges
            WHERE project_id=? AND status='ACTIVE'
        ", [$projectId]),
        'responsibilities' => etm_control_count($db, "
            SELECT COUNT(*) total,
                   COALESCE(SUM(binding_state IN ('WORKING_MODEL','TBC','SOURCE_CONFLICT')),0) open_count
            FROM etm_object_responsibilities
            WHERE project_id=? AND status='ACTIVE'
        ", [$projectId]),
        'executionEvents' => etm_control_count($db, "
            SELECT COUNT(*) total,
                   COALESCE(SUM(event_state IN ('REQUIRED','PLANNED','HOLD','TBC')),0) open_count
            FROM etm_execution_events
            WHERE project_id=?
        ", [$projectId]),
        'physicalTrips' => etm_control_count($db, "
            SELECT COUNT(*) total,
                   COALESCE(SUM(trip_state IN ('REQUIRED','PLANNED','QUOTED','HOLD','TBC')),0) open_count
            FROM etm_physical_trips
            WHERE project_id=?
        ", [$projectId]),
        'vdrlWorkloads' => etm_control_count($db, "
            SELECT COUNT(*) total,
                   COALESCE(SUM(input_state IN ('PARTIAL','OPEN','TBC','SOURCE_CONFLICT')),0) open_count
            FROM etm_vdrl_workload_bindings
            WHERE project_id=? AND is_current=1
        ", [$projectId]),
        'costPriceBindings' => etm_control_count($db, "
            SELECT COUNT(*) total,
                   COALESCE(SUM(binding_state IN ('PARTIAL','OPEN','TBC')),0) open_count
            FROM etm_cost_price_bindings
            WHERE project_id=?
        ", [$projectId]),
    ];

    $edges = $db->prepare("
      SELECT edge_code,source_object_type,source_object_id,relationship_type,
             target_object_type,target_object_id,binding_state,basis_text
      FROM etm_trace_edges
      WHERE project_id=? AND status='ACTIVE'
      ORDER BY id DESC
      LIMIT 200
    ");
    $edges->execute([$projectId]);

    $costStates = $db->prepare("
      SELECT COALESCE(cost_status,'TBC') state, COUNT(*) item_count
      FROM etm_cost_items
      WHERE project_id=?
      GROUP BY COALESCE(cost_status,'TBC')
      ORDER BY state
    ");
    $costStates->execute([$projectId]);

    $commercialStates = $db->prepare("
      SELECT psi.inclusion_status state, COUNT(*) item_count
      FROM etm_bid_price_schedule_items psi
      JOIN etm_bid_packages bp ON bp.id=psi.bid_package_id
      WHERE bp.project_id=?
      GROUP BY psi.inclusion_status
      ORDER BY psi.inclusion_status
    ");
    $commercialStates->execute([$projectId]);

    etm_json_response([
      'ok'=>true,
      'project'=>[
        'code'=>$project['project_code'],
        'name'=>$project['project_name']
      ],
      'summary'=>$summary,
      'traceEdges'=>$edges->fetchAll(),
      'costStates'=>$costStates->fetchAll(),
      'commercialStates'=>$commercialStates->fetchAll(),
      'architectureStatus'=>'CONTROL_SPINE_010'
    ]);
} catch (Throwable $e) {
    etm_json_response([
      'ok'=>false,
      'error'=>'ETM_CONTROL_SPINE_API_ERROR',
      'message'=>$e->getMessage()
    ],500);
}
