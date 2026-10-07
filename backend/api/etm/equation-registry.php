<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

try {
    $db=etm_db();
    $user=etm_require_user($db);
    $projectCode=$_GET['project'] ?? 'PJ2608-0550';
    $ctx=etm_project_access_context($db,(int)$user['id'],$projectCode);
    etm_require_permission($ctx,'engineering.view');

    $q=$db->prepare("
      SELECT
        er.id,er.equation_code,er.equation_layer,er.equation_domain,er.equation_name,
        er.expression_text,er.model_class,er.evidence_basis,er.grounding_class,
        er.calibration_state,er.control_status,er.method_source,er.method_revision,er.control_note
      FROM etm_equation_registry er
      ORDER BY er.equation_code
    ");
    $q->execute();
    $equations=$q->fetchAll();

    $bq=$db->prepare("
      SELECT
        eb.binding_code,eb.binding_name,eb.binding_role,eb.input_state,eb.input_binding_json,
        eb.source_refs_json,eb.output_object_type,eb.output_object_ref,eb.binding_status,
        er.equation_code,s.system_code,r.requirement_code,p.proof_code,m.mto_code
      FROM etm_equation_bindings eb
      JOIN etm_equation_registry er ON er.id=eb.equation_id
      LEFT JOIN etm_systems s ON s.id=eb.system_id
      LEFT JOIN etm_requirements r ON r.id=eb.requirement_id
      LEFT JOIN etm_proof_objects p ON p.id=eb.proof_object_id
      LEFT JOIN etm_required_mto m ON m.id=eb.required_mto_id
      WHERE eb.project_id=?
      ORDER BY s.system_code,r.requirement_code,eb.binding_code
    ");
    $bq->execute([(int)$ctx['project_id']]);

    etm_json_response([
      'ok'=>true,
      'projectCode'=>$projectCode,
      'sourceOfTruth'=>'etm_equation_registry',
      'equations'=>$equations,
      'bindings'=>$bq->fetchAll()
    ]);
} catch(Throwable $e){
    etm_json_response([
      'ok'=>false,
      'error'=>'ETM_EQUATION_REGISTRY_API_ERROR',
      'message'=>$e->getMessage()
    ],500);
}
