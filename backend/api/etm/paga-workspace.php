<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';

try {
    $db = etm_db();
    $projectCode = $_GET['project'] ?? 'PJ2608-0550';

    $q = $db->prepare("
      SELECT p.id project_id, p.project_code, p.project_name,
             s.id system_id, s.system_code, s.system_name
      FROM etm_projects p
      JOIN etm_systems s ON s.project_id = p.id
      WHERE p.project_code = ? AND s.system_code = 'PAGA'
    ");
    $q->execute([$projectCode]);
    $ctx = $q->fetch();

    if (!$ctx) {
        etm_json_response(['ok' => false, 'error' => 'PAGA_CONTEXT_NOT_FOUND'], 404);
    }

    $locations = $db->prepare("
      SELECT l.id, l.location_code, l.location_name, l.location_type,
             SUM(CASE WHEN po.proof_type='CAL' THEN 1 ELSE 0 END) cal_count,
             SUM(CASE WHEN po.proof_type='SDY' THEN 1 ELSE 0 END) sdy_count,
             SUM(CASE WHEN po.result_status='OPEN' OR po.result_status IS NULL THEN 1 ELSE 0 END) open_proofs
      FROM etm_locations l
      LEFT JOIN etm_proof_objects po ON po.location_id=l.id AND po.system_id=?
      WHERE l.project_id=?
      GROUP BY l.id,l.location_code,l.location_name,l.location_type
      ORDER BY l.location_code
    ");
    $locations->execute([(int)$ctx['system_id'], (int)$ctx['project_id']]);

    $proofs = $db->prepare("
      SELECT po.proof_code,po.proof_type,po.proof_name,po.input_status,
             po.result_status,po.release_gate_status,po.evidence_class,l.location_name
      FROM etm_proof_objects po
      LEFT JOIN etm_locations l ON l.id=po.location_id
      WHERE po.project_id=? AND po.system_id=?
      ORDER BY po.proof_type,po.proof_code
    ");
    $proofs->execute([(int)$ctx['project_id'], (int)$ctx['system_id']]);

    $stages = $db->query("
      SELECT stage_code,stage_name,sequence_no,stage_group,cost_category
      FROM etm_lifecycle_stages
      WHERE active_flag=1
      ORDER BY sequence_no
    ")->fetchAll();

    etm_json_response([
      'ok' => true,
      'project' => ['code'=>$ctx['project_code'], 'name'=>$ctx['project_name']],
      'system' => ['code'=>$ctx['system_code'], 'name'=>$ctx['system_name']],
      'locations' => $locations->fetchAll(),
      'proofs' => $proofs->fetchAll(),
      'lifecycleStages' => $stages,
      'architectureStatus' => 'REV0'
    ]);
} catch (Throwable $e) {
    etm_json_response(['ok'=>false,'error'=>'ETM_API_ERROR','message'=>$e->getMessage()],500);
}
