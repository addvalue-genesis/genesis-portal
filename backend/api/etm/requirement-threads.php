<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';

try {
    $db=etm_db();
    $projectCode=$_GET['project'] ?? 'PJ2608-0550';
    $systemCode=$_GET['system'] ?? 'PAGA';

    $q=$db->prepare("
      SELECT
        r.id,r.requirement_code,r.requirement_type,r.requirement_text,r.status,r.priority,r.metadata_json,
        s.system_code,s.system_name
      FROM etm_requirements r
      JOIN etm_projects p ON p.id=r.project_id
      LEFT JOIN etm_systems s ON s.id=r.system_id
      WHERE p.project_code=? AND r.is_current=1
        AND (s.system_code=? OR ?='')
      ORDER BY r.requirement_code
    ");
    $q->execute([$projectCode,$systemCode,$systemCode]);
    $requirements=$q->fetchAll();

    $bq=$db->prepare("
      SELECT
        r.requirement_code,er.equation_code,er.equation_name,er.expression_text,
        eb.binding_role,eb.input_state,eb.binding_status,eb.source_refs_json
      FROM etm_equation_bindings eb
      JOIN etm_projects p ON p.id=eb.project_id
      JOIN etm_equation_registry er ON er.id=eb.equation_id
      LEFT JOIN etm_requirements r ON r.id=eb.requirement_id
      LEFT JOIN etm_systems s ON s.id=eb.system_id
      WHERE p.project_code=?
        AND (s.system_code=? OR ?='')
        AND r.requirement_code IS NOT NULL
      ORDER BY r.requirement_code,er.equation_code
    ");
    $bq->execute([$projectCode,$systemCode,$systemCode]);

    $cq=$db->prepare("
      SELECT
        r.requirement_code,rc.case_code,rc.blocking_stage,rc.problem_statement,
        rc.resolution_status,rc.internal_search_status,rc.external_search_status,
        rc.recommended_action
      FROM etm_requirement_resolution_cases rc
      JOIN etm_projects p ON p.id=rc.project_id
      JOIN etm_requirements r ON r.id=rc.requirement_id
      LEFT JOIN etm_systems s ON s.id=r.system_id
      WHERE p.project_code=? AND (s.system_code=? OR ?='')
      ORDER BY r.requirement_code,rc.id
    ");
    $cq->execute([$projectCode,$systemCode,$systemCode]);

    etm_json_response([
      'ok'=>true,
      'projectCode'=>$projectCode,
      'systemCode'=>$systemCode,
      'sourceOfTruth'=>'etm_requirements + etm_equation_bindings + etm_requirement_resolution_cases',
      'requirements'=>$requirements,
      'equationBindings'=>$bq->fetchAll(),
      'resolutionCases'=>$cq->fetchAll()
    ]);
} catch(Throwable $e){
    etm_json_response([
      'ok'=>false,
      'error'=>'ETM_REQUIREMENT_THREADS_API_ERROR',
      'message'=>$e->getMessage()
    ],500);
}
