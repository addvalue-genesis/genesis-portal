<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';

try {
    $db=etm_db();
    $projectCode=$_GET['project'] ?? 'PJ2608-0550';

    $q=$db->prepare("
      SELECT
        pll.id,pll.layer_code,pll.layer_type,pll.revision_no,pll.amount,pll.currency,
        pll.layer_state,pll.basis_text,pll.input_snapshot_hash,pll.source_snapshot_json,
        psi.id price_line_id,psi.line_code,psi.description price_line_description
      FROM etm_price_line_layers pll
      JOIN etm_projects p ON p.id=pll.project_id
      JOIN etm_bid_price_schedule_items psi ON psi.id=pll.bid_price_schedule_item_id
      WHERE p.project_code=?
      ORDER BY psi.line_code,
        FIELD(pll.layer_type,'SOURCE_COST','INTERNAL_COST','WORKING_SELL','RELEASED_SELL'),
        pll.id DESC
    ");
    $q->execute([$projectCode]);

    etm_json_response([
      'ok'=>true,
      'projectCode'=>$projectCode,
      'sourceOfTruth'=>'etm_price_line_layers',
      'rows'=>$q->fetchAll()
    ]);
} catch(Throwable $e){
    etm_json_response([
      'ok'=>false,
      'error'=>'ETM_PRICING_LAYERS_API_ERROR',
      'message'=>$e->getMessage()
    ],500);
}
