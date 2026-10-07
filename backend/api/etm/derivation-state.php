<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';

function etm_deriv_table_exists(PDO $db,string $table): bool {
    $q=$db->prepare("SELECT COUNT(*) c FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=?");
    $q->execute([$table]);
    return ((int)$q->fetchColumn())>0;
}
function etm_deriv_column_exists(PDO $db,string $table,string $column): bool {
    $q=$db->prepare("SELECT COUNT(*) c FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=? AND COLUMN_NAME=?");
    $q->execute([$table,$column]);
    return ((int)$q->fetchColumn())>0;
}
function etm_deriv_all(PDO $db,string $sql,array $params=[]): array {
    $q=$db->prepare($sql);
    $q->execute($params);
    return $q->fetchAll();
}

try {
    $db=etm_db();
    $projectCode=$_GET['project'] ?? 'PJ2608-0550';

    $pQ=$db->prepare("SELECT id,project_code,project_name,status FROM etm_projects WHERE project_code=?");
    $pQ->execute([$projectCode]);
    $project=$pQ->fetch();
    if(!$project){
        etm_json_response(['ok'=>false,'error'=>'PROJECT_CONTEXT_NOT_FOUND'],404);
    }
    $projectId=(int)$project['id'];

    $hasBindingRole=etm_deriv_column_exists($db,'etm_equation_bindings','binding_role');
    $hasBindingRequirement=etm_deriv_column_exists($db,'etm_equation_bindings','requirement_id');
    $hasBindingProof=etm_deriv_column_exists($db,'etm_equation_bindings','proof_object_id');
    $hasBindingMto=etm_deriv_column_exists($db,'etm_equation_bindings','required_mto_id');

    $bindingSelect=[
      "b.id","b.binding_code","b.binding_name","b.input_state","b.input_binding_json",
      "b.source_refs_json","b.output_object_type","b.output_object_ref","b.binding_status",
      "e.equation_code","e.equation_layer","e.equation_domain","e.equation_name","e.expression_text",
      "s.system_code","s.system_name","l.location_code","l.location_name"
    ];
    $bindingSelect[]=$hasBindingRole ? "b.binding_role" : "'OTHER' binding_role";
    $bindingSelect[]=$hasBindingRequirement ? "b.requirement_id" : "NULL requirement_id";
    $bindingSelect[]=$hasBindingProof ? "b.proof_object_id" : "NULL proof_object_id";
    $bindingSelect[]=$hasBindingMto ? "b.required_mto_id" : "NULL required_mto_id";

    $equationBindings=etm_deriv_all($db,"
      SELECT ".implode(",",$bindingSelect)."
      FROM etm_equation_bindings b
      JOIN etm_equation_registry e ON e.id=b.equation_id
      LEFT JOIN etm_systems s ON s.id=b.system_id
      LEFT JOIN etm_locations l ON l.id=b.location_id
      WHERE b.project_id=?
      ORDER BY s.system_code,b.binding_code
    ",[$projectId]);

    $calculationRuns=[];
    $hasCanonicalCalc=etm_deriv_column_exists($db,'etm_calculation_runs','equation_binding_id');
    if(etm_deriv_table_exists($db,'etm_calculation_runs')){
      if($hasCanonicalCalc){
        $calculationRuns=etm_deriv_all($db,"
          SELECT
            cr.id,cr.run_code,cr.run_status,cr.pass_fail_status,cr.is_current,cr.created_at,
            cr.engine_name,cr.engine_revision,cr.derivation_role,cr.target_object_type,cr.target_object_ref,
            cr.input_snapshot_hash,cr.result_state,cr.stale_flag,cr.stale_reason,cr.change_event_id,
            cr.input_snapshot_json,cr.output_snapshot_json,
            eb.binding_code,er.equation_code,er.equation_name,
            s.system_code,s.system_name,l.location_code,l.location_name
          FROM etm_calculation_runs cr
          LEFT JOIN etm_equation_bindings eb ON eb.id=cr.equation_binding_id
          LEFT JOIN etm_equation_registry er ON er.id=eb.equation_id
          LEFT JOIN etm_systems s ON s.id=cr.system_id
          LEFT JOIN etm_locations l ON l.id=cr.location_id
          WHERE cr.project_id=? AND cr.is_current=1
          ORDER BY cr.created_at DESC,cr.id DESC
        ",[$projectId]);
      } else {
        $calculationRuns=etm_deriv_all($db,"
          SELECT
            cr.id,cr.run_code,cr.run_status,cr.pass_fail_status,cr.is_current,cr.created_at,
            NULL engine_name,NULL engine_revision,'OTHER' derivation_role,
            NULL target_object_type,NULL target_object_ref,NULL input_snapshot_hash,
            CASE WHEN cr.run_status IN ('FINAL','CONTROLLED') THEN 'CONTROLLED' ELSE 'TBC' END result_state,
            0 stale_flag,NULL stale_reason,NULL change_event_id,
            cr.input_snapshot_json,cr.output_snapshot_json,
            NULL binding_code,NULL equation_code,NULL equation_name,
            s.system_code,s.system_name,l.location_code,l.location_name
          FROM etm_calculation_runs cr
          LEFT JOIN etm_systems s ON s.id=cr.system_id
          LEFT JOIN etm_locations l ON l.id=cr.location_id
          WHERE cr.project_id=? AND cr.is_current=1
          ORDER BY cr.created_at DESC,cr.id DESC
        ",[$projectId]);
      }
    }

    $products=[];
    $productOfferItems=[];
    $hasProducts=etm_deriv_table_exists($db,'etm_products');
    $hasOfferProduct=etm_deriv_column_exists($db,'etm_vendor_offer_items','product_id');
    if($hasProducts && $hasOfferProduct){
      $productOfferItems=etm_deriv_all($db,"
        SELECT DISTINCT
          pr.id product_id,pr.product_code,pr.product_family,pr.product_name,pr.canonical_model,
          pr.manufacturer_part_no,pr.lifecycle_state,pr.control_state,
          mv.vendor_code manufacturer_code,mv.vendor_name manufacturer_name,
          vo.id vendor_offer_id,vo.offer_code,vo.offer_revision,vo.offer_date,vo.currency offer_currency,
          sv.vendor_code selling_vendor_code,sv.vendor_name selling_vendor_name,
          voi.id vendor_offer_item_id,voi.item_no,voi.vendor_part_no,voi.vendor_model,
          voi.description offer_description,voi.offered_qty,voi.unit,voi.unit_price,voi.amount,
          b.binding_code,b.binding_role,b.binding_state,
          s.system_code,s.system_name,psi.line_code
        FROM etm_vendor_offers vo
        JOIN etm_vendors sv ON sv.id=vo.vendor_id
        JOIN etm_vendor_offer_items voi ON voi.vendor_offer_id=vo.id
        JOIN etm_products pr ON pr.id=voi.product_id
        LEFT JOIN etm_vendors mv ON mv.id=pr.manufacturer_vendor_id
        LEFT JOIN etm_vendor_offer_item_bindings b ON b.vendor_offer_item_id=voi.id AND b.project_id=vo.project_id
        LEFT JOIN etm_systems s ON s.id=b.system_id
        LEFT JOIN etm_bid_price_schedule_items psi ON psi.id=b.bid_price_schedule_item_id
        WHERE vo.project_id=?
        ORDER BY pr.product_code,vo.offer_date,vo.id,voi.item_no
      ",[$projectId]);

      $seen=[];
      foreach($productOfferItems as $row){
        $id=(int)$row['product_id'];
        if(isset($seen[$id])) continue;
        $seen[$id]=true;
        $products[]=[
          'product_id'=>$row['product_id'],
          'product_code'=>$row['product_code'],
          'product_family'=>$row['product_family'],
          'product_name'=>$row['product_name'],
          'canonical_model'=>$row['canonical_model'],
          'manufacturer_part_no'=>$row['manufacturer_part_no'],
          'lifecycle_state'=>$row['lifecycle_state'],
          'control_state'=>$row['control_state'],
          'manufacturer_code'=>$row['manufacturer_code'],
          'manufacturer_name'=>$row['manufacturer_name']
        ];
      }
    }

    $productAssertions=[];
    if(etm_deriv_column_exists($db,'etm_evidence_assertions','product_id')){
      $productAssertions=etm_deriv_all($db,"
        SELECT
          a.id,a.assertion_code,a.assertion_domain,a.system_token,a.price_line_code,a.object_key,
          a.assertion_state,a.value_json,a.unit,a.review_state,a.product_id,
          pr.product_code,pr.canonical_model,
          ev.evidence_code,ev.statement_text,d.document_no,d.revision
        FROM etm_evidence_assertions a
        JOIN etm_evidence ev ON ev.id=a.evidence_id
        LEFT JOIN etm_documents d ON d.id=ev.document_id
        LEFT JOIN etm_products pr ON pr.id=a.product_id
        WHERE a.project_id=? AND a.product_id IS NOT NULL
        ORDER BY pr.product_code,a.assertion_domain,a.id
      ",[$projectId]);
    }

    $promotionCandidates=[];
    if(etm_deriv_column_exists($db,'etm_reasoning_proposals','promotion_scope')){
      $promotionCandidates=etm_deriv_all($db,"
        SELECT
          rp.id,rp.proposal_code,rp.target_object_type,rp.target_object_ref,rp.proposal_action,
          rp.promotion_scope,rp.method_change_requires_new_version,rp.disposition,
          rp.rationale_text,rp.proposal_state,rp.approval_required,rp.approved_by,rp.approved_at
        FROM etm_reasoning_proposals rp
        WHERE rp.project_id=? AND rp.promotion_scope<>'PARTICULAR_ONLY'
        ORDER BY rp.created_at DESC,rp.id DESC
      ",[$projectId]);
    }

    $staleRuns=0;
    $blockedRuns=0;
    foreach($calculationRuns as $row){
      if((int)($row['stale_flag'] ?? 0)===1 || strtoupper((string)($row['result_state'] ?? ''))==='STALE') $staleRuns++;
      if(in_array(strtoupper((string)($row['result_state'] ?? '')),['BLOCKED','TBC','ERROR'],true)) $blockedRuns++;
    }

    etm_json_response([
      'ok'=>true,
      'project'=>$project,
      'architectureStatus'=>$hasCanonicalCalc ? 'CANONICAL_DERIVATION_SPINE_016' : 'PRE_016_COMPATIBILITY',
      'sourceOfTruth'=>'DB canonical objects + equation bindings + audited calculation runs; UI is projection only',
      'equationBindings'=>$equationBindings,
      'calculationRuns'=>$calculationRuns,
      'products'=>$products,
      'productOfferItems'=>$productOfferItems,
      'productAssertions'=>$productAssertions,
      'promotionCandidates'=>$promotionCandidates,
      'summary'=>[
        'equationBindings'=>count($equationBindings),
        'currentCalculationRuns'=>count($calculationRuns),
        'staleRuns'=>$staleRuns,
        'blockedOrTbcRuns'=>$blockedRuns,
        'canonicalProducts'=>count($products),
        'productBoundOfferItems'=>count($productOfferItems),
        'productAssertions'=>count($productAssertions),
        'methodPromotionCandidates'=>count($promotionCandidates)
      ],
      'rules'=>[
        'newEvidence'=>'PARTICULAR_FIRST',
        'commonGenericPromotion'=>'REVIEW_REQUIRED_NEW_VERSION',
        'dependencyGraph'=>'etm_trace_edges',
        'calculationAudit'=>'etm_calculation_runs',
        'priceOutput'=>'7.1 analysis -> management release -> 7.0; customer output uses AUTHORISED RELEASED_SELL only'
      ]
    ]);
} catch(Throwable $e){
    etm_json_response([
      'ok'=>false,
      'error'=>'ETM_DERIVATION_STATE_API_ERROR',
      'message'=>$e->getMessage()
    ],500);
}
