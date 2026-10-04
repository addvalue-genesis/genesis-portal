SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS etm_document_blocks (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 vdrl_item_id BIGINT UNSIGNED NOT NULL,
 block_order INT NOT NULL,
 block_type ENUM('TEXT','TABLE','FORMULA','CHART','IMAGE','DRAWING','SOURCE','APPENDIX') NOT NULL,
 block_key VARCHAR(128) NULL,
 title VARCHAR(255) NULL,
 content_json JSON NULL,
 media_id BIGINT UNSIGNED NULL,
 proof_object_id BIGINT UNSIGNED NULL,
 status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
 INDEX ix_doc_block_order(vdrl_item_id,block_order),
 FOREIGN KEY(vdrl_item_id) REFERENCES etm_vdrl_items(id),
 FOREIGN KEY(media_id) REFERENCES etm_media(id),
 FOREIGN KEY(proof_object_id) REFERENCES etm_proof_objects(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_document_review_cycles (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 vdrl_item_id BIGINT UNSIGNED NOT NULL,
 cycle_no INT NOT NULL,
 issue_revision VARCHAR(32) NULL,
 issue_date DATE NULL,
 return_date DATE NULL,
 return_status VARCHAR(64) NULL,
 reviewer_party VARCHAR(255) NULL,
 response_status VARCHAR(64) NULL,
 planned_mh DECIMAL(24,8) NULL,
 actual_mh DECIMAL(24,8) NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_doc_review(vdrl_item_id,cycle_no),
 FOREIGN KEY(vdrl_item_id) REFERENCES etm_vdrl_items(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_transmittals (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 transmittal_no VARCHAR(128) NOT NULL,
 transmittal_date DATE NULL,
 sender_party VARCHAR(255) NULL,
 receiver_party VARCHAR(255) NULL,
 purpose VARCHAR(128) NULL,
 status VARCHAR(64) NULL,
 storage_uri TEXT NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_transmittal(project_id,transmittal_no),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_transmittal_items (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 transmittal_id BIGINT UNSIGNED NOT NULL,
 vdrl_item_id BIGINT UNSIGNED NULL,
 document_id BIGINT UNSIGNED NULL,
 revision VARCHAR(32) NULL,
 issue_status VARCHAR(64) NULL,
 metadata_json JSON NULL,
 FOREIGN KEY(transmittal_id) REFERENCES etm_transmittals(id),
 FOREIGN KEY(vdrl_item_id) REFERENCES etm_vdrl_items(id),
 FOREIGN KEY(document_id) REFERENCES etm_documents(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_vendors (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 vendor_code VARCHAR(96) NOT NULL UNIQUE,
 vendor_name VARCHAR(255) NOT NULL,
 manufacturer_flag TINYINT(1) NOT NULL DEFAULT 0,
 avl_status VARCHAR(64) NULL,
 regulatory_status VARCHAR(64) NULL,
 status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
 metadata_json JSON NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_vendor_offers (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 vendor_id BIGINT UNSIGNED NOT NULL,
 offer_code VARCHAR(128) NOT NULL,
 offer_revision VARCHAR(32) NULL,
 offer_date DATE NULL,
 document_id BIGINT UNSIGNED NULL,
 currency VARCHAR(16) NULL,
 status VARCHAR(32) NOT NULL DEFAULT 'RECEIVED',
 metadata_json JSON NULL,
 UNIQUE KEY uq_vendor_offer(project_id,vendor_id,offer_code,offer_revision),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(vendor_id) REFERENCES etm_vendors(id),
 FOREIGN KEY(document_id) REFERENCES etm_documents(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_vendor_offer_items (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 vendor_offer_id BIGINT UNSIGNED NOT NULL,
 item_no VARCHAR(64) NULL,
 vendor_part_no VARCHAR(128) NULL,
 vendor_model VARCHAR(160) NULL,
 description TEXT NOT NULL,
 offered_qty DECIMAL(24,8) NULL,
 unit VARCHAR(32) NULL,
 unit_price DECIMAL(24,8) NULL,
 amount DECIMAL(24,8) NULL,
 technical_data_json JSON NULL,
 metadata_json JSON NULL,
 FOREIGN KEY(vendor_offer_id) REFERENCES etm_vendor_offers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_vendor_submissions (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 vendor_id BIGINT UNSIGNED NOT NULL,
 submission_code VARCHAR(128) NOT NULL,
 submission_type VARCHAR(96) NOT NULL,
 required_by_requirement_id BIGINT UNSIGNED NULL,
 required_by_proof_id BIGINT UNSIGNED NULL,
 document_id BIGINT UNSIGNED NULL,
 submission_status VARCHAR(64) NOT NULL DEFAULT 'REQUIRED',
 compliance_status VARCHAR(64) NOT NULL DEFAULT 'TBC',
 due_date DATE NULL,
 received_date DATE NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_vendor_submission(project_id,submission_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(vendor_id) REFERENCES etm_vendors(id),
 FOREIGN KEY(required_by_requirement_id) REFERENCES etm_requirements(id),
 FOREIGN KEY(required_by_proof_id) REFERENCES etm_proof_objects(id),
 FOREIGN KEY(document_id) REFERENCES etm_documents(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_reconciliations (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 reconciliation_code VARCHAR(128) NOT NULL,
 required_mto_id BIGINT UNSIGNED NULL,
 vendor_offer_item_id BIGINT UNSIGNED NULL,
 compliance_status VARCHAR(64) NOT NULL DEFAULT 'TBC',
 gap_qty DECIMAL(24,8) NULL,
 deviation_ref VARCHAR(160) NULL,
 action_text TEXT NULL,
 risk_status VARCHAR(64) NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_recon(project_id,reconciliation_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(required_mto_id) REFERENCES etm_required_mto(id),
 FOREIGN KEY(vendor_offer_item_id) REFERENCES etm_vendor_offer_items(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_tbe_evaluations (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 vendor_id BIGINT UNSIGNED NOT NULL,
 tbe_code VARCHAR(128) NOT NULL,
 criterion_group VARCHAR(96) NOT NULL,
 criterion_code VARCHAR(96) NOT NULL,
 criterion_text TEXT NOT NULL,
 requirement_id BIGINT UNSIGNED NULL,
 vendor_response TEXT NULL,
 evaluation_status ENUM('COMPLY','TO_BE_CLARIFIED','DEVIATION','NOT_COMPLY','BIDDER_TO_ADVISE','NOT_APPLICABLE','TBC') NOT NULL DEFAULT 'TBC',
 concern_text TEXT NULL,
 recommendation_text TEXT NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_tbe(project_id,tbe_code,criterion_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(vendor_id) REFERENCES etm_vendors(id),
 FOREIGN KEY(requirement_id) REFERENCES etm_requirements(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_activity_resources (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 activity_id BIGINT UNSIGNED NOT NULL,
 role_id BIGINT UNSIGNED NOT NULL,
 headcount DECIMAL(12,4) NOT NULL DEFAULT 1,
 planned_mh DECIMAL(24,8) NULL,
 actual_mh DECIMAL(24,8) NULL,
 rate_id BIGINT UNSIGNED NULL,
 planned_cost DECIMAL(24,8) NULL,
 actual_cost DECIMAL(24,8) NULL,
 metadata_json JSON NULL,
 FOREIGN KEY(activity_id) REFERENCES etm_activities(id),
 FOREIGN KEY(role_id) REFERENCES etm_roles(id),
 FOREIGN KEY(rate_id) REFERENCES etm_rates(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_test_runs (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 test_requirement_id BIGINT UNSIGNED NOT NULL,
 run_no INT NOT NULL DEFAULT 1,
 run_date DATETIME NULL,
 result_status VARCHAR(32) NOT NULL DEFAULT 'NOT_RUN',
 result_json JSON NULL,
 punch_count INT NULL,
 evidence_document_id BIGINT UNSIGNED NULL,
 remarks TEXT NULL,
 UNIQUE KEY uq_test_run(test_requirement_id,run_no),
 FOREIGN KEY(test_requirement_id) REFERENCES etm_test_requirements(id),
 FOREIGN KEY(evidence_document_id) REFERENCES etm_documents(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_schedule_milestones (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 lifecycle_stage_id BIGINT UNSIGNED NULL,
 milestone_code VARCHAR(128) NOT NULL,
 milestone_name VARCHAR(255) NOT NULL,
 baseline_date DATE NULL,
 forecast_date DATE NULL,
 actual_date DATE NULL,
 status VARCHAR(64) NOT NULL DEFAULT 'PLANNED',
 dependency_json JSON NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_milestone(project_id,milestone_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(lifecycle_stage_id) REFERENCES etm_lifecycle_stages(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_decisions (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 decision_code VARCHAR(128) NOT NULL,
 topic VARCHAR(255) NOT NULL,
 decision_text TEXT NOT NULL,
 evidence_class ENUM('A','B','C','D') NULL,
 decision_status VARCHAR(64) NOT NULL,
 rationale TEXT NULL,
 residual_open_point TEXT NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 metadata_json JSON NULL,
 UNIQUE KEY uq_decision(project_id,decision_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_entity_links (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 from_entity_type VARCHAR(64) NOT NULL,
 from_entity_id BIGINT UNSIGNED NOT NULL,
 relation_type VARCHAR(96) NOT NULL,
 to_entity_type VARCHAR(64) NOT NULL,
 to_entity_id BIGINT UNSIGNED NOT NULL,
 evidence_id BIGINT UNSIGNED NULL,
 metadata_json JSON NULL,
 INDEX ix_link_from(project_id,from_entity_type,from_entity_id),
 INDEX ix_link_to(project_id,to_entity_type,to_entity_id),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(evidence_id) REFERENCES etm_evidence(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_generated_outputs (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 vdrl_item_id BIGINT UNSIGNED NULL,
 output_code VARCHAR(128) NOT NULL,
 output_format ENUM('DOCX','XLSX','PDF','HTML','JSON') NOT NULL,
 storage_uri TEXT NOT NULL,
 generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 db_snapshot_ref VARCHAR(255) NULL,
 formula_snapshot_json JSON NULL,
 checksum_sha256 CHAR(64) NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_generated_output(project_id,output_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(vdrl_item_id) REFERENCES etm_vdrl_items(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
