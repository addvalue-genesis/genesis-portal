<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';

try {
    $db=etm_db();
    $projectCode=$_GET['project'] ?? 'PJ2608-0550';
    $systemCode=$_GET['system'] ?? '';

    $offerQ=$db->prepare("
      SELECT
        vo.id,vo.offer_code,vo.offer_revision,vo.offer_date,vo.currency,vo.status,
        v.vendor_code,v.vendor_name
      FROM etm_vendor_offers vo
      JOIN etm_projects p ON p.id=vo.project_id
      JOIN etm_vendors v ON v.id=vo.vendor_id
      WHERE p.project_code=?
      ORDER BY vo.offer_date DESC,vo.id DESC
    ");
    $offerQ->execute([$projectCode]);
    $offers=$offerQ->fetchAll();

    $itemSql="
      SELECT
        voi.id vendor_offer_item_id,voi.vendor_offer_id,voi.item_no,voi.vendor_part_no,
        voi.vendor_model,voi.description,voi.offered_qty,voi.unit,voi.unit_price,voi.amount,
        b.binding_code,b.binding_role,b.allocation_driver,b.allocated_qty,b.allocated_amount,
        b.currency binding_currency,b.binding_state,b.note_text,
        s.system_code,s.system_name,m.mto_code,psi.line_code
      FROM etm_vendor_offer_items voi
      JOIN etm_vendor_offers vo ON vo.id=voi.vendor_offer_id
      JOIN etm_projects p ON p.id=vo.project_id
      LEFT JOIN etm_vendor_offer_item_bindings b ON b.vendor_offer_item_id=voi.id AND b.project_id=p.id
      LEFT JOIN etm_systems s ON s.id=b.system_id
      LEFT JOIN etm_required_mto m ON m.id=b.required_mto_id
      LEFT JOIN etm_bid_price_schedule_items psi ON psi.id=b.bid_price_schedule_item_id
      WHERE p.project_code=?
    ";
    $params=[$projectCode];
    if($systemCode!==''){
      $itemSql.=" AND (s.system_code=? OR s.system_code IS NULL)";
      $params[]=$systemCode;
    }
    $itemSql.=" ORDER BY vo.id,voi.id,b.id";
    $itemQ=$db->prepare($itemSql);
    $itemQ->execute($params);

    $conditionSql="
      SELECT
        c.id,c.vendor_offer_id,c.vendor_offer_item_id,c.condition_code,c.condition_type,
        c.raw_text,c.normalized_value_json,c.acceptance_state,c.cost_impact_state,
        c.schedule_impact_state,c.risk_impact_state,c.warranty_impact_state,
        s.system_code,s.system_name
      FROM etm_vendor_offer_conditions c
      JOIN etm_vendor_offers vo ON vo.id=c.vendor_offer_id
      JOIN etm_projects p ON p.id=c.project_id
      LEFT JOIN etm_systems s ON s.id=c.system_id
      WHERE p.project_code=?
    ";
    $conditionParams=[$projectCode];
    if($systemCode!==''){
      $conditionSql.=" AND (s.system_code=? OR s.system_code IS NULL)";
      $conditionParams[]=$systemCode;
    }
    $conditionSql.=" ORDER BY vo.id,c.id";
    $conditionQ=$db->prepare($conditionSql);
    $conditionQ->execute($conditionParams);

    etm_json_response([
      'ok'=>true,
      'projectCode'=>$projectCode,
      'systemCode'=>$systemCode,
      'sourceOfTruth'=>'etm_vendor_offers + etm_vendor_offer_items + item bindings + offer conditions',
      'offers'=>$offers,
      'items'=>$itemQ->fetchAll(),
      'conditions'=>$conditionQ->fetchAll()
    ]);
} catch(Throwable $e){
    etm_json_response([
      'ok'=>false,
      'error'=>'ETM_VENDOR_OFFER_CONTROL_API_ERROR',
      'message'=>$e->getMessage()
    ],500);
}
