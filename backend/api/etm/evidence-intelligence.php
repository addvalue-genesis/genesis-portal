<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

function etm_evidence_priority(string $sourceType): int {
    $map = [
        'APPROVED_HUMAN_DECISION' => 100,
        'GOVERNING_PROJECT_SOURCE' => 90,
        'CURRENT_VENDOR_QUOTE' => 80,
        'CURRENT_PROJECT_CALCULATION' => 75,
        'CURRENT_MARKET_SANITY' => 60,
        'HISTORICAL_REFERENCE' => 35,
        'ASSUMPTION' => 10,
    ];
    return $map[$sourceType] ?? 0;
}

function etm_read_json_body(): array {
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        etm_json_response(['ok'=>false,'error'=>'EMPTY_JSON_BODY'],400);
    }
    $data = json_decode($raw,true);
    if (!is_array($data)) {
        etm_json_response(['ok'=>false,'error'=>'INVALID_JSON_BODY'],400);
    }
    return $data;
}

try {
    $db = etm_db();
    $user = etm_require_user($db);

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $projectCode = $_GET['project'] ?? 'PJ2608-0550';
        $ctx = etm_project_access_context($db,(int)$user['id'],$projectCode);
        etm_require_permission($ctx,'engineering.view');

        $q = $db->prepare("
          SELECT
            ea.assertion_code,
            ea.assertion_domain,
            ea.system_token,
            ea.price_line_code,
            ea.location_code,
            ea.object_key,
            ea.assertion_state,
            ea.value_json,
            ea.unit,
            ea.source_priority,
            ea.extractor_type,
            ea.review_state,
            ea.assertion_hash,
            e.evidence_code,
            e.evidence_class,
            e.statement_text,
            e.evidence_status,
            e.metadata_json evidence_metadata_json,
            ea.created_at,
            ea.updated_at
          FROM etm_evidence_assertions ea
          JOIN etm_evidence e ON e.id=ea.evidence_id
          WHERE ea.project_id=?
          ORDER BY ea.updated_at DESC, ea.id DESC
          LIMIT 500
        ");
        $q->execute([(int)$ctx['project_id']]);
        $rows = $q->fetchAll();

        $summaryQ = $db->prepare("
          SELECT
            COUNT(*) assertion_count,
            COUNT(DISTINCT evidence_id) source_count,
            COALESCE(SUM(review_state IN ('REVIEW_REQUIRED','CONFLICT','UNREVIEWED')),0) review_open
          FROM etm_evidence_assertions
          WHERE project_id=?
        ");
        $summaryQ->execute([(int)$ctx['project_id']]);

        etm_json_response([
            'ok'=>true,
            'project'=>['code'=>$ctx['project_code'],'name'=>$ctx['project_name']],
            'summary'=>$summaryQ->fetch() ?: ['assertion_count'=>0,'source_count'=>0,'review_open'=>0],
            'assertions'=>$rows,
            'architectureStatus'=>'EVIDENCE_INTELLIGENCE_011'
        ]);
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        etm_json_response(['ok'=>false,'error'=>'METHOD_NOT_ALLOWED'],405);
    }

    $packet = etm_read_json_body();
    $projectCode = (string)($packet['projectCode'] ?? 'PJ2608-0550');
    if ($projectCode !== 'PJ2608-0550') {
        etm_json_response(['ok'=>false,'error'=>'PROJECT_NOT_ALLOWED'],400);
    }

    $ctx = etm_project_access_context($db,(int)$user['id'],$projectCode);
    etm_require_permission($ctx,'engineering.edit');

    $sourceId = trim((string)($packet['sourceId'] ?? ''));
    $sourceType = trim((string)($packet['sourceType'] ?? ''));
    $evidenceClass = strtoupper(trim((string)($packet['evidenceClass'] ?? '')));
    $assertions = $packet['assertions'] ?? null;

    if ($sourceId === '' || $sourceType === '' || !in_array($evidenceClass,['A','B','C','D'],true) || !is_array($assertions) || count($assertions)===0) {
        etm_json_response(['ok'=>false,'error'=>'INVALID_EVIDENCE_PACKET'],400);
    }

    $allowedExtractors = ['HUMAN','AI','CONNECTOR','IMPORT','RULE_ENGINE'];
    $extractorType = strtoupper((string)($packet['extractorType'] ?? 'AI'));
    if (!in_array($extractorType,$allowedExtractors,true)) {
        $extractorType = 'AI';
    }

    $statement = trim((string)($packet['sourceRef'] ?? $packet['title'] ?? $sourceId));
    $sourceMeta = [
        'sourceType'=>$sourceType,
        'title'=>$packet['title'] ?? null,
        'sourceRef'=>$packet['sourceRef'] ?? null,
        'sourceUrl'=>$packet['sourceUrl'] ?? null,
        'ingestedBy'=>$user['email'],
    ];

    $db->beginTransaction();

    $ev = $db->prepare("
      INSERT INTO etm_evidence(
        project_id,evidence_code,evidence_class,statement_text,evidence_status,is_current,metadata_json
      ) VALUES(?,?,?,?, 'CURRENT',1,?)
      ON DUPLICATE KEY UPDATE
        evidence_class=VALUES(evidence_class),
        statement_text=VALUES(statement_text),
        evidence_status='CURRENT',
        is_current=1,
        metadata_json=VALUES(metadata_json),
        id=LAST_INSERT_ID(id)
    ");
    $ev->execute([
        (int)$ctx['project_id'],
        $sourceId,
        $evidenceClass,
        $statement !== '' ? $statement : $sourceId,
        json_encode($sourceMeta,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES)
    ]);
    $evidenceId = (int)$db->lastInsertId();

    $upsert = $db->prepare("
      INSERT INTO etm_evidence_assertions(
        project_id,evidence_id,assertion_code,assertion_domain,system_token,price_line_code,
        location_code,object_key,assertion_state,value_json,unit,source_priority,
        extractor_type,review_state,assertion_hash,metadata_json
      ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,'REVIEW_REQUIRED',?,?)
      ON DUPLICATE KEY UPDATE
        evidence_id=VALUES(evidence_id),
        assertion_domain=VALUES(assertion_domain),
        system_token=VALUES(system_token),
        price_line_code=VALUES(price_line_code),
        location_code=VALUES(location_code),
        object_key=VALUES(object_key),
        assertion_state=VALUES(assertion_state),
        value_json=VALUES(value_json),
        unit=VALUES(unit),
        source_priority=VALUES(source_priority),
        extractor_type=VALUES(extractor_type),
        review_state='REVIEW_REQUIRED',
        assertion_hash=VALUES(assertion_hash),
        metadata_json=VALUES(metadata_json)
    ");

    $written = 0;
    foreach ($assertions as $a) {
        if (!is_array($a)) continue;

        $assertionId = trim((string)($a['assertionId'] ?? ''));
        $domain = strtoupper(trim((string)($a['domain'] ?? '')));
        $state = strtoupper(trim((string)($a['state'] ?? 'TBC')));
        if ($assertionId === '' || $domain === '') {
            throw new RuntimeException('Each assertion requires assertionId and domain.');
        }

        $allowedStates = ['FACT','DERIVED','ASSUMPTION','TBC','NOT_FOUND','SOURCE_CONFLICT','NOT_APPLICABLE'];
        if (!in_array($state,$allowedStates,true)) $state='TBC';

        $valuePayload = [
            'value'=>$a['value'] ?? null,
            'qty'=>$a['qty'] ?? null,
            'unitPrice'=>$a['unitPrice'] ?? null,
            'total'=>$a['total'] ?? null,
            'currency'=>$a['currency'] ?? null,
            'note'=>$a['note'] ?? null,
        ];
        $hashPayload = [
            'sourceId'=>$sourceId,
            'assertionId'=>$assertionId,
            'domain'=>$domain,
            'systemToken'=>$a['systemToken'] ?? null,
            'priceLine'=>$a['priceLine'] ?? null,
            'location'=>$a['location'] ?? null,
            'object'=>$a['object'] ?? null,
            'state'=>$state,
            'value'=>$valuePayload,
        ];
        $hash = hash('sha256',json_encode($hashPayload,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));

        $meta = [
            'sourceType'=>$sourceType,
            'sourceRef'=>$packet['sourceRef'] ?? null,
            'rawAssertion'=>$a,
        ];

        $upsert->execute([
            (int)$ctx['project_id'],
            $evidenceId,
            $assertionId,
            $domain,
            $a['systemToken'] ?? null,
            $a['priceLine'] ?? null,
            $a['location'] ?? null,
            $a['object'] ?? ($a['key'] ?? null),
            $state,
            json_encode($valuePayload,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES),
            $a['unit'] ?? null,
            etm_evidence_priority($sourceType),
            $extractorType,
            $hash,
            json_encode($meta,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES),
        ]);
        $written++;
    }

    $db->commit();

    etm_json_response([
        'ok'=>true,
        'project'=>$projectCode,
        'sourceId'=>$sourceId,
        'evidenceId'=>$evidenceId,
        'assertionsWritten'=>$written,
        'reviewState'=>'REVIEW_REQUIRED',
        'next'=>'Run controlled evidence reasoning and approve/reject proposals before mutating released project facts.',
        'architectureStatus'=>'EVIDENCE_INTELLIGENCE_011'
    ],201);

} catch (Throwable $e) {
    if (isset($db) && $db instanceof PDO && $db->inTransaction()) {
        $db->rollBack();
    }
    etm_json_response([
      'ok'=>false,
      'error'=>'ETM_EVIDENCE_INTELLIGENCE_API_ERROR',
      'message'=>$e->getMessage()
    ],500);
}
