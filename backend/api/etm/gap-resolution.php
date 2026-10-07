<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

function gr_body(): array {
    $raw=file_get_contents('php://input');
    $data=json_decode($raw ?: '{}',true);
    if(!is_array($data)) etm_json_response(['ok'=>false,'error'=>'INVALID_JSON_BODY'],400);
    return $data;
}

try {
    $db=etm_db();
    $user=etm_require_user($db);
    $projectCode=$_GET['project'] ?? 'PJ2608-0550';
    $ctx=etm_project_access_context($db,(int)$user['id'],$projectCode);

    if($_SERVER['REQUEST_METHOD']==='GET'){
        etm_require_permission($ctx,'engineering.view');
        $q=$db->prepare("
          SELECT
            rc.id,rc.case_code,rc.blocking_stage,rc.problem_statement,rc.resolution_status,
            rc.internal_search_status,rc.external_search_status,rc.recommended_action,
            r.requirement_code,s.system_code
          FROM etm_requirement_resolution_cases rc
          JOIN etm_requirements r ON r.id=rc.requirement_id
          LEFT JOIN etm_systems s ON s.id=r.system_id
          WHERE rc.project_id=?
          ORDER BY r.requirement_code,rc.id
        ");
        $q->execute([(int)$ctx['project_id']]);
        $cases=$q->fetchAll();

        $cq=$db->prepare("
          SELECT
            c.id,c.candidate_code,c.source_tier,c.source_type,c.source_ref,c.source_uri,
            c.statement_text,c.applicability_text,c.authority_score,c.applicability_score,
            c.confidence_score,c.candidate_state,rc.case_code
          FROM etm_research_candidates c
          JOIN etm_requirement_resolution_cases rc ON rc.id=c.resolution_case_id
          WHERE c.project_id=?
          ORDER BY rc.id,c.source_tier,c.id
        ");
        $cq->execute([(int)$ctx['project_id']]);

        etm_json_response([
          'ok'=>true,
          'projectCode'=>$projectCode,
          'cases'=>$cases,
          'candidates'=>$cq->fetchAll(),
          'controlRule'=>'Internal-first research -> external authority if internal evidence is insufficient -> proposal -> human review. No auto-apply.'
        ]);
    }

    if($_SERVER['REQUEST_METHOD']!=='POST'){
        etm_json_response(['ok'=>false,'error'=>'METHOD_NOT_ALLOWED'],405);
    }

    etm_require_permission($ctx,'engineering.edit');
    $body=gr_body();
    $action=strtoupper((string)($body['action'] ?? ''));

    if($action==='OPEN_CASE'){
        $requirementCode=trim((string)($body['requirementCode'] ?? ''));
        $caseCode=trim((string)($body['caseCode'] ?? ''));
        $stage=strtoupper(trim((string)($body['blockingStage'] ?? '')));
        $problem=trim((string)($body['problemStatement'] ?? ''));
        if($requirementCode===''||$caseCode===''||$stage===''||$problem===''){
            etm_json_response(['ok'=>false,'error'=>'INVALID_OPEN_CASE_INPUT'],400);
        }
        $rq=$db->prepare("SELECT id FROM etm_requirements WHERE project_id=? AND requirement_code=? AND is_current=1 LIMIT 1");
        $rq->execute([(int)$ctx['project_id'],$requirementCode]);
        $requirementId=(int)($rq->fetchColumn() ?: 0);
        if(!$requirementId) etm_json_response(['ok'=>false,'error'=>'REQUIREMENT_NOT_FOUND'],404);

        $ins=$db->prepare("
          INSERT INTO etm_requirement_resolution_cases(
            project_id,requirement_id,case_code,blocking_stage,problem_statement,
            resolution_status,internal_search_status,external_search_status,recommended_action,metadata_json
          ) VALUES(?,?,?,?,?,'OPEN','NOT_STARTED','NOT_STARTED',?,?)
          ON DUPLICATE KEY UPDATE
            blocking_stage=VALUES(blocking_stage),
            problem_statement=VALUES(problem_statement),
            recommended_action=VALUES(recommended_action),
            id=LAST_INSERT_ID(id)
        ");
        $ins->execute([
          (int)$ctx['project_id'],$requirementId,$caseCode,$stage,$problem,
          $body['recommendedAction'] ?? null,
          json_encode(['createdBy'=>$user['email'],'autoApply'=>false],JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES)
        ]);
        etm_json_response(['ok'=>true,'caseId'=>(int)$db->lastInsertId(),'caseCode'=>$caseCode,'autoApply'=>false],201);
    }

    if($action==='ADD_CANDIDATE'){
        $caseCode=trim((string)($body['caseCode'] ?? ''));
        $candidateCode=trim((string)($body['candidateCode'] ?? ''));
        $tier=strtoupper(trim((string)($body['sourceTier'] ?? '')));
        $sourceType=trim((string)($body['sourceType'] ?? ''));
        $sourceRef=trim((string)($body['sourceRef'] ?? ''));
        $statement=trim((string)($body['statementText'] ?? ''));
        if($caseCode===''||$candidateCode===''||$tier===''||$sourceType===''||$sourceRef===''||$statement===''){
            etm_json_response(['ok'=>false,'error'=>'INVALID_CANDIDATE_INPUT'],400);
        }

        $caseQ=$db->prepare("SELECT id FROM etm_requirement_resolution_cases WHERE project_id=? AND case_code=? LIMIT 1");
        $caseQ->execute([(int)$ctx['project_id'],$caseCode]);
        $caseId=(int)($caseQ->fetchColumn() ?: 0);
        if(!$caseId) etm_json_response(['ok'=>false,'error'=>'RESOLUTION_CASE_NOT_FOUND'],404);

        $ins=$db->prepare("
          INSERT INTO etm_research_candidates(
            project_id,resolution_case_id,candidate_code,source_tier,source_type,source_ref,
            source_uri,statement_text,applicability_text,authority_score,applicability_score,
            confidence_score,candidate_state,metadata_json
          ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?, 'REVIEW_REQUIRED',?)
          ON DUPLICATE KEY UPDATE
            source_tier=VALUES(source_tier),source_type=VALUES(source_type),source_ref=VALUES(source_ref),
            source_uri=VALUES(source_uri),statement_text=VALUES(statement_text),
            applicability_text=VALUES(applicability_text),authority_score=VALUES(authority_score),
            applicability_score=VALUES(applicability_score),confidence_score=VALUES(confidence_score),
            candidate_state='REVIEW_REQUIRED',id=LAST_INSERT_ID(id)
        ");
        $ins->execute([
          (int)$ctx['project_id'],$caseId,$candidateCode,$tier,$sourceType,$sourceRef,
          $body['sourceUri'] ?? null,$statement,$body['applicabilityText'] ?? null,
          $body['authorityScore'] ?? null,$body['applicabilityScore'] ?? null,$body['confidenceScore'] ?? null,
          json_encode(['submittedBy'=>$user['email'],'autoApply'=>false],JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES)
        ]);

        $upd=$db->prepare("
          UPDATE etm_requirement_resolution_cases
          SET resolution_status='PROPOSAL_READY',
              internal_search_status=CASE WHEN ? LIKE 'A_%' OR ? LIKE 'B_%' OR ? LIKE 'F_%' THEN 'FOUND' ELSE internal_search_status END,
              external_search_status=CASE WHEN ? LIKE 'C_%' OR ? LIKE 'D_%' OR ? LIKE 'E_%' THEN 'FOUND' ELSE external_search_status END
          WHERE id=?
        ");
        $upd->execute([$tier,$tier,$tier,$tier,$tier,$tier,$caseId]);

        etm_json_response(['ok'=>true,'candidateId'=>(int)$db->lastInsertId(),'reviewState'=>'REVIEW_REQUIRED','autoApply'=>false],201);
    }

    if($action==='DISPOSITION_CANDIDATE'){
        $candidateId=(int)($body['candidateId'] ?? 0);
        $state=strtoupper((string)($body['state'] ?? ''));
        if($candidateId<=0 || !in_array($state,['ACCEPTED','REJECTED','SUPERSEDED'],true)){
            etm_json_response(['ok'=>false,'error'=>'INVALID_DISPOSITION_INPUT'],400);
        }
        $upd=$db->prepare("UPDATE etm_research_candidates SET candidate_state=? WHERE id=? AND project_id=?");
        $upd->execute([$state,$candidateId,(int)$ctx['project_id']]);
        etm_json_response(['ok'=>true,'candidateId'=>$candidateId,'state'=>$state,'autoApply'=>false]);
    }

    etm_json_response(['ok'=>false,'error'=>'UNKNOWN_ACTION'],400);

} catch(Throwable $e){
    etm_json_response([
      'ok'=>false,
      'error'=>'ETM_GAP_RESOLUTION_API_ERROR',
      'message'=>$e->getMessage()
    ],500);
}
