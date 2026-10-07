<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

function etm_impact_json_body(): array {
    $raw=file_get_contents('php://input');
    $data=json_decode($raw ?: '{}',true);
    if(!is_array($data)) etm_json_response(['ok'=>false,'error'=>'INVALID_JSON_BODY'],400);
    return $data;
}

function etm_impact_modules_for_type(string $type): array {
    $t=strtoupper($type);
    $map=[
        'DOCUMENT'=>['1.0','4.0','5.0','6.0','8.0','9.0','12.0'],
        'DOCUMENT_REVISION'=>['1.0','4.0','5.0','6.0','8.0','9.0','12.0'],
        'EVIDENCE'=>['1.0','4.0','5.0','6.0','8.0','9.0','12.0'],
        'REQUIREMENT'=>['1.0','3.0','4.0','5.0','6.0','7.1','8.0','9.0','12.0'],
        'REQUIREMENT_RESOLUTION'=>['4.0','5.0','6.0','7.1','12.0'],
        'EQUATION_BINDING'=>['3.0','4.0','7.1','12.0'],
        'PROOF'=>['4.0','5.0','6.0','7.0','7.1','8.0','9.0','10.0','12.0'],
        'CALCULATION'=>['4.0','6.0','7.0','7.1','9.0','10.0','12.0'],
        'MTO'=>['4.0','5.0','6.0','7.0','7.1','8.0','9.0','10.0','12.0'],
        'REQUIRED_MTO'=>['4.0','5.0','6.0','7.0','7.1','8.0','9.0','10.0','12.0'],
        'VENDOR_OFFER'=>['4.0','6.0','7.0','7.1','8.0','10.0','12.0'],
        'VENDOR_OFFER_ITEM'=>['4.0','6.0','7.0','7.1','8.0','10.0','12.0'],
        'VENDOR_OFFER_CONDITION'=>['2.0','4.0','6.0','7.0','7.1','8.0','10.0','12.0'],
        'ACTIVITY'=>['4.0','7.0','7.1','9.0','10.0','12.0'],
        'VDRL'=>['4.0','5.0','9.0','10.0','12.0'],
        'COST_ITEM'=>['2.0','4.0','7.0','7.1','10.0'],
        'PRICE_LINE'=>['2.0','4.0','7.0','7.1','10.0'],
        'PRICE_LAYER'=>['2.0','4.0','7.0','7.1','10.0'],
        'BID_RESPONSE'=>['1.0','5.0','6.0','8.0','10.0'],
        'DEVIATION'=>['1.0','6.0','8.0','10.0'],
        'OUTPUT'=>['10.0']
    ];
    return $map[$t] ?? ['1.0','4.0'];
}

function etm_change_code(string $projectCode,string $type,int $id,?string $newRevision): string {
    $rev=preg_replace('/[^A-Za-z0-9_.-]+/','-',trim((string)$newRevision));
    return 'CHG-'.$projectCode.'-'.strtoupper($type).'-'.$id.'-'.($rev!==''?$rev:date('YmdHis'));
}

try {
    $db=etm_db();
    $user=etm_require_user($db);
    $projectCode=$_GET['project'] ?? 'PJ2608-0550';
    $ctx=etm_project_access_context($db,(int)$user['id'],$projectCode);

    if($_SERVER['REQUEST_METHOD']==='GET'){
        etm_require_permission($ctx,'engineering.view');
        $q=$db->prepare("
          SELECT ce.*,
                 (SELECT COUNT(*) FROM etm_change_impacts ci WHERE ci.change_event_id=ce.id) impact_count,
                 (SELECT COUNT(*) FROM etm_change_impacts ci WHERE ci.change_event_id=ce.id AND ci.impact_status='OPEN') open_impact_count
          FROM etm_change_events ce
          WHERE ce.project_id=?
          ORDER BY ce.created_at DESC
          LIMIT 100
        ");
        $q->execute([(int)$ctx['project_id']]);
        $events=$q->fetchAll();

        $eventId=isset($_GET['event_id'])?(int)$_GET['event_id']:0;
        $impacts=[];
        if($eventId>0){
            $iq=$db->prepare("
              SELECT ci.*,te.edge_code,te.relationship_type
              FROM etm_change_impacts ci
              LEFT JOIN etm_trace_edges te ON te.id=ci.trace_edge_id
              WHERE ci.project_id=? AND ci.change_event_id=?
              ORDER BY ci.id
            ");
            $iq->execute([(int)$ctx['project_id'],$eventId]);
            $impacts=$iq->fetchAll();
        }

        etm_json_response(['ok'=>true,'events'=>$events,'impacts'=>$impacts]);
    }

    if($_SERVER['REQUEST_METHOD']!=='POST'){
        etm_json_response(['ok'=>false,'error'=>'METHOD_NOT_ALLOWED'],405);
    }

    etm_require_permission($ctx,'engineering.edit');
    $body=etm_impact_json_body();

    $sourceType=strtoupper(trim((string)($body['sourceObjectType'] ?? 'DOCUMENT')));
    $sourceId=(int)($body['sourceObjectId'] ?? 0);
    $previousRevision=isset($body['previousRevision'])?(string)$body['previousRevision']:null;
    $newRevision=isset($body['newRevision'])?(string)$body['newRevision']:null;
    $changeType=strtoupper((string)($body['changeType'] ?? 'NEW_REVISION'));
    $summary=(string)($body['changeSummary'] ?? '');
    $sourceDocumentId=isset($body['sourceDocumentId'])?(int)$body['sourceDocumentId']:null;

    $allowed=['NEW_REVISION','SUPERSEDE','SOURCE_CORRECTION','APPROVED_DECISION','VENDOR_UPDATE','RATE_UPDATE','OTHER'];
    if($sourceId<=0 || !in_array($changeType,$allowed,true)){
        etm_json_response(['ok'=>false,'error'=>'INVALID_CHANGE_INPUT'],400);
    }

    $changeCode=(string)($body['changeCode'] ?? etm_change_code($projectCode,$sourceType,$sourceId,$newRevision));
    $snapshotHash=hash('sha256',json_encode([
        'project'=>$projectCode,'sourceType'=>$sourceType,'sourceId'=>$sourceId,
        'previousRevision'=>$previousRevision,'newRevision'=>$newRevision,'changeType'=>$changeType
    ],JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE));

    $db->beginTransaction();

    $ins=$db->prepare("
      INSERT INTO etm_change_events(
        project_id,change_code,source_object_type,source_object_id,source_document_id,
        previous_revision,new_revision,change_type,change_summary,source_snapshot_hash,event_status,metadata_json
      ) VALUES(?,?,?,?,?,?,?,?,?,?,'DETECTED',?)
      ON DUPLICATE KEY UPDATE
        change_summary=VALUES(change_summary),
        source_snapshot_hash=VALUES(source_snapshot_hash),
        event_status='DETECTED',
        id=LAST_INSERT_ID(id)
    ");
    $ins->execute([
      (int)$ctx['project_id'],$changeCode,$sourceType,$sourceId,$sourceDocumentId,
      $previousRevision,$newRevision,$changeType,$summary,$snapshotHash,
      json_encode(['actor'=>$user['email']],JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE)
    ]);
    $eventId=(int)$db->lastInsertId();

    $edgeQ=$db->prepare("
      SELECT id,edge_code,source_object_type,source_object_id,relationship_type,
             target_object_type,target_object_id,propagation_action,stale_on_upstream_change
      FROM etm_trace_edges
      WHERE project_id=? AND status='ACTIVE'
        AND source_object_type=? AND source_object_id=?
    ");

    $impactIns=$db->prepare("
      INSERT INTO etm_change_impacts(
        project_id,change_event_id,trace_edge_id,impacted_object_type,impacted_object_id,
        impact_action,impact_reason,prior_state,target_state,impact_status,metadata_json
      ) VALUES(?,?,?,?,?,?,?,?,?,'OPEN',?)
      ON DUPLICATE KEY UPDATE
        impact_reason=VALUES(impact_reason),
        target_state=VALUES(target_state),
        impact_status='OPEN'
    ");

    $queue=[[$sourceType,$sourceId,0]];
    $seen=[];
    $affectedModules=['1.0'=>true,'4.0'=>true];
    $impactCount=0;

    while($queue){
        [$type,$id,$depth]=array_shift($queue);
        if($depth>25) continue;
        $key=strtoupper((string)$type).':'.(int)$id;
        if(isset($seen[$key])) continue;
        $seen[$key]=true;

        $edgeQ->execute([(int)$ctx['project_id'],$type,$id]);
        foreach($edgeQ->fetchAll() as $edge){
            $targetType=strtoupper((string)$edge['target_object_type']);
            $targetId=(int)$edge['target_object_id'];
            $action=(string)($edge['propagation_action'] ?: 'REVIEW');
            $reason='Upstream '.$type.'#'.$id.' changed via '.$edge['relationship_type'].' ('.$edge['edge_code'].')';

            $impactIns->execute([
              (int)$ctx['project_id'],$eventId,(int)$edge['id'],$targetType,$targetId,
              $action,$reason,null,
              $action==='RECALCULATE'?'STALE_CALCULATION':($action==='REGENERATE'?'STALE_OUTPUT':'REVIEW_REQUIRED'),
              json_encode(['depth'=>$depth+1],JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE)
            ]);
            $impactCount++;

            foreach(etm_impact_modules_for_type($targetType) as $moduleId){
                $affectedModules[$moduleId]=true;
            }
            if((int)$edge['stale_on_upstream_change']===1){
                $queue[]=[$targetType,$targetId,$depth+1];
            }
        }
    }

    $projectionUpsert=$db->prepare("
      INSERT INTO etm_module_projection_state(
        project_id,module_id,projection_revision,canonical_snapshot_hash,projection_status,stale_reason,change_event_id
      ) VALUES(?,?,?,?,'STALE',?,?)
      ON DUPLICATE KEY UPDATE
        projection_revision=VALUES(projection_revision),
        canonical_snapshot_hash=VALUES(canonical_snapshot_hash),
        projection_status='STALE',
        stale_reason=VALUES(stale_reason),
        change_event_id=VALUES(change_event_id)
    ");
    foreach(array_keys($affectedModules) as $moduleId){
        $projectionUpsert->execute([
          (int)$ctx['project_id'],$moduleId,'CHANGE-'.$eventId,$snapshotHash,
          'Upstream change '.$changeCode.' requires projection rebuild/review.',$eventId
        ]);
    }

    if($affectedModules){
        $placeholders=implode(',',array_fill(0,count($affectedModules),'?'));
        $params=array_merge([(int)$ctx['project_id']],array_keys($affectedModules));
        $stale=$db->prepare("
          UPDATE etm_output_revisions
          SET output_state='STALE',change_event_id=?
          WHERE project_id=?
            AND output_module_id IN ($placeholders)
            AND output_state IN ('DRAFT','READY','BLOCKED')
        ");
        $staleParams=array_merge([$eventId,(int)$ctx['project_id']],array_keys($affectedModules));
        $stale->execute($staleParams);
    }

    $done=$db->prepare("UPDATE etm_change_events SET event_status='IMPACT_ANALYZED' WHERE id=?");
    $done->execute([$eventId]);

    $db->commit();

    etm_json_response([
      'ok'=>true,
      'changeEventId'=>$eventId,
      'changeCode'=>$changeCode,
      'impactCount'=>$impactCount,
      'affectedModules'=>array_keys($affectedModules),
      'rule'=>'Issued historical outputs remain immutable; current projections/draft-ready outputs become stale until revalidated/regenerated.',
      'autoRelease'=>false
    ],201);

} catch(Throwable $e){
    if(isset($db) && $db instanceof PDO && $db->inTransaction()) $db->rollBack();
    etm_json_response([
      'ok'=>false,
      'error'=>'ETM_REVISION_IMPACT_API_ERROR',
      'message'=>$e->getMessage()
    ],500);
}
