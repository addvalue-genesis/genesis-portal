<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';

try {
    $db=etm_db();
    $projectCode=$_GET['project'] ?? 'PJ2608-0550';
    $systemCode=$_GET['system'] ?? 'TEL-PAGA';

    $q=$db->prepare("
      SELECT
        m.id,m.mto_code,m.description,m.object_class,m.ownership_class,m.material_family,
        m.quantity_driver_code,m.required_qty,m.unit,m.quantity_status,m.release_status,
        m.commercial_treatment,m.commercial_mapping_state,m.shared_allocation_driver,
        m.vendor_inclusion_state,m.metadata_json,
        s.system_code,s.system_name
      FROM etm_required_mto m
      JOIN etm_projects p ON p.id=m.project_id
      LEFT JOIN etm_systems s ON s.id=m.system_id
      WHERE p.project_code=?
        AND (s.system_code=? OR ?='')
        AND m.object_class IN ('BULK','ACCESSORY','SPARE','TOOL','OTHER')
      ORDER BY m.mto_code
    ");
    $q->execute([$projectCode,$systemCode,$systemCode]);
    $rows=$q->fetchAll();

    etm_json_response([
      'ok'=>true,
      'projectCode'=>$projectCode,
      'systemCode'=>$systemCode,
      'rows'=>$rows
    ]);
} catch(Throwable $e){
    etm_json_response([
      'ok'=>false,
      'error'=>'ETM_BULK_STATE_API_ERROR',
      'message'=>$e->getMessage()
    ],500);
}
