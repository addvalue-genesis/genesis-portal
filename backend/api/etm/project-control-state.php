<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';

function etm_fetch_all(PDO $db,string $sql,array $params=[]): array {
    $q=$db->prepare($sql);
    $q->execute($params);
    return $q->fetchAll();
}
function etm_fetch_one(PDO $db,string $sql,array $params=[]): ?array {
    $q=$db->prepare($sql);
    $q->execute($params);
    $row=$q->fetch();
    return $row ?: null;
}

try {
    $db=etm_db();
    $projectCode=$_GET['project'] ?? 'PJ2608-0550';

    $project=etm_fetch_one($db,"
      SELECT id,project_code,project_name,status,updated_at
      FROM etm_projects WHERE project_code=?
    ",[$projectCode]);

    if(!$project){
        etm_json_response(['ok'=>false,'error'=>'PROJECT_CONTEXT_NOT_FOUND'],404);
    }

    $projectId=(int)$project['id'];

    $bid=etm_fetch_one($db,"
      SELECT id,bid_code,bid_title,bid_revision,submission_due,status
      FROM etm_bid_packages
      WHERE project_id=?
      ORDER BY id DESC LIMIT 1
    ",[$projectId]);

    $requirements=[];
    $deviations=[];
    $priceLines=[];
    $submissionItems=[];
    $sourceGroups=[];
    $sourceDocuments=[];
    if($bid){
        $bidId=(int)$bid['id'];

        $sourceGroups=etm_fetch_all($db,"
          SELECT id,group_code,group_name,source_domain,status
          FROM etm_bid_source_groups
          WHERE bid_package_id=?
          ORDER BY id
        ",[$bidId]);

        $sourceDocuments=etm_fetch_all($db,"
          SELECT source_code,source_title,source_role,precedence_order,status,document_id,source_group_id
          FROM etm_bid_source_documents
          WHERE bid_package_id=?
          ORDER BY id
        ",[$bidId]);

        $requirements=etm_fetch_all($db,"
          SELECT
            r.id,r.requirement_code,r.requirement_domain,r.clause_ref,r.requirement_text,
            r.price_impact_flag,r.schedule_impact_flag,r.status requirement_status,
            d.source_code,d.source_title,d.status source_status,
            br.response_type,br.response_text,br.reason_justification,br.response_status,
            br.linked_proof_id,br.linked_mto_id,br.linked_cost_item_id
          FROM etm_bid_requirement_lines r
          LEFT JOIN etm_bid_source_documents d ON d.id=r.source_document_id
          LEFT JOIN etm_bid_responses br ON br.bid_requirement_id=r.id
          WHERE r.bid_package_id=?
          ORDER BY r.id
        ",[$bidId]);

        $deviations=etm_fetch_all($db,"
          SELECT id,deviation_code,deviation_type,source_doc_para_description,vendor_deviation,
                 reason_justification,resolution,closure_status,final_closure,status,bid_requirement_id
          FROM etm_bid_deviations
          WHERE bid_package_id=?
          ORDER BY id
        ",[$bidId]);

        $priceLines=etm_fetch_all($db,"
          SELECT
            psi.id,psi.line_code,psi.description,psi.quantity,psi.unit,psi.unit_rate,psi.amount,
            psi.currency,psi.inclusion_status,psi.cost_basis_status,
            psd.schedule_code,psd.schedule_name,
            s.system_code,s.system_name
          FROM etm_bid_price_schedule_items psi
          JOIN etm_price_schedule_definitions psd ON psd.id=psi.schedule_definition_id
          LEFT JOIN etm_systems s ON s.id=psi.system_id
          WHERE psi.bid_package_id=?
          ORDER BY psd.schedule_code,psi.id
        ",[$bidId]);

        $submissionItems=etm_fetch_all($db,"
          SELECT submission_code,submission_type,title,source_template,readiness_status,
                 generated_output_id,remarks
          FROM etm_bid_submission_items
          WHERE bid_package_id=?
          ORDER BY id
        ",[$bidId]);
    }

    $documents=etm_fetch_all($db,"
      SELECT id,document_no,title,document_type,revision,issue_status,is_current,
             supersedes_document_id,source_uri,storage_uri,updated_at
      FROM etm_documents
      WHERE project_id=? AND is_current=1
      ORDER BY document_no
    ",[$projectId]);

    $vdrl=etm_fetch_all($db,"
      SELECT
        vo.id,vo.occurrence_code,vo.dossier_group,vo.deliverable_title,vo.source_authority,
        vo.source_row_ref,vo.source_sdrl_code,vo.source_mapping_status,vo.with_bid_status,
        vo.bidding_required,vo.execution_required,vo.owner_basis,vo.owner_basis_class,
        vo.status,vo.assignee,vo.evidence_ref,vo.next_action,vo.generator_profile,
        vo.quantity_driver,vo.quantity_unit,vo.umh,vo.calculated_mh,
        s.system_code,s.system_name
      FROM etm_vdrl_occurrences vo
      LEFT JOIN etm_systems s ON s.id=vo.system_id
      WHERE vo.project_id=?
      ORDER BY vo.id
    ",[$projectId]);

    $costItems=etm_fetch_all($db,"
      SELECT
        c.id,c.cost_code,c.cost_category,c.description,c.quantity,c.unit,c.unit_cost,
        c.currency,c.amount,c.cost_status,s.system_code,s.system_name
      FROM etm_cost_items c
      LEFT JOIN etm_systems s ON s.id=c.system_id
      WHERE c.project_id=?
      ORDER BY c.id
    ",[$projectId]);

    $costPriceBindings=etm_fetch_all($db,"
      SELECT
        b.binding_code,b.allocation_basis,b.allocated_quantity,b.allocated_amount,
        b.currency binding_currency,b.binding_state,b.note_text,
        c.id cost_item_id,c.cost_code,c.cost_category,c.description cost_description,
        c.quantity cost_quantity,c.unit cost_unit,c.unit_cost,c.currency cost_currency,
        c.amount cost_amount,c.cost_status,
        psi.id price_line_id,psi.line_code,psi.description price_line_description,
        s.system_code,s.system_name
      FROM etm_cost_price_bindings b
      JOIN etm_cost_items c ON c.id=b.cost_item_id
      JOIN etm_bid_price_schedule_items psi ON psi.id=b.bid_price_schedule_item_id
      LEFT JOIN etm_systems s ON s.id=c.system_id
      WHERE b.project_id=?
      ORDER BY psi.line_code,c.cost_category,c.id
    ",[$projectId]);

    $openChanges=etm_fetch_all($db,"
      SELECT id,change_code,source_object_type,source_object_id,source_document_id,
             previous_revision,new_revision,change_type,change_summary,event_status,created_at
      FROM etm_change_events
      WHERE project_id=? AND event_status NOT IN ('RESOLVED','CANCELLED')
      ORDER BY created_at DESC
    ",[$projectId]);

    $outputRevisions=etm_fetch_all($db,"
      SELECT output_code,output_module_id,output_type,revision_no,input_snapshot_hash,
             output_state,supersedes_output_revision_id,change_event_id,generated_at,issued_at
      FROM etm_output_revisions
      WHERE project_id=?
      ORDER BY output_code,id DESC
    ",[$projectId]);

    $projectionState=etm_fetch_all($db,"
      SELECT module_id,projection_revision,canonical_snapshot_hash,projection_status,
             stale_reason,change_event_id,updated_at
      FROM etm_module_projection_state
      WHERE project_id=?
      ORDER BY module_id
    ",[$projectId]);

    $priceDecision=etm_fetch_one($db,"
      SELECT decision_code,price_state,cost_internal,cost_accept,financing_cost,risk_reserve,
             currency,floor_price,target_price,offer_price,rationale_text,buyer_gate_status,
             authorized_by,authorized_at,input_snapshot_json
      FROM etm_bid_price_decisions
      WHERE project_id=?
      ORDER BY id DESC LIMIT 1
    ",[$projectId]);

    $acceptedConditions=etm_fetch_all($db,"
      SELECT condition_code,source_ref,condition_text,acceptance_state,cost_class,
             equation_code,input_state,amount_native,currency,zero_reason,evidence_ref,status
      FROM etm_accepted_conditions
      WHERE project_id=?
      ORDER BY id
    ",[$projectId]);

    $buyerChecks=etm_fetch_all($db,"
      SELECT check_code,check_group,check_text,severity,source_ref,check_state,
             evidence_ref,action_text,hypothesis_flag
      FROM etm_buyer_view_checks
      WHERE project_id=?
      ORDER BY id
    ",[$projectId]);

    $traceSummary=etm_fetch_one($db,"
      SELECT COUNT(*) total_edges,
             COALESCE(SUM(stale_on_upstream_change=1),0) propagating_edges,
             COALESCE(SUM(binding_state IN ('PARTIAL','OPEN','TBC','SOURCE_CONFLICT')),0) open_edges
      FROM etm_trace_edges
      WHERE project_id=? AND status='ACTIVE'
    ",[$projectId]);

    etm_json_response([
      'ok'=>true,
      'architectureStatus'=>'CANONICAL_STATE_REVISION_CONTROL_013',
      'project'=>$project,
      'bidPackage'=>$bid,
      'sourceGroups'=>$sourceGroups,
      'sourceDocuments'=>$sourceDocuments,
      'documents'=>$documents,
      'requirements'=>$requirements,
      'deviations'=>$deviations,
      'priceLines'=>$priceLines,
      'vdrl'=>$vdrl,
      'costItems'=>$costItems,
      'costPriceBindings'=>$costPriceBindings,
      'submissionItems'=>$submissionItems,
      'priceDecision'=>$priceDecision,
      'acceptedConditions'=>$acceptedConditions,
      'buyerChecks'=>$buyerChecks,
      'openChanges'=>$openChanges,
      'outputRevisions'=>$outputRevisions,
      'projectionState'=>$projectionState,
      'traceSummary'=>$traceSummary ?: ['total_edges'=>0,'propagating_edges'=>0,'open_edges'=>0]
    ]);
} catch (Throwable $e) {
    etm_json_response([
      'ok'=>false,
      'error'=>'ETM_PROJECT_CONTROL_STATE_API_ERROR',
      'message'=>$e->getMessage()
    ],500);
}
