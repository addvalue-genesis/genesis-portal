SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS etm_projects (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_code VARCHAR(64) NOT NULL UNIQUE,
 project_name VARCHAR(255) NOT NULL,
 status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
 metadata_json JSON NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_systems (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_code VARCHAR(64) NOT NULL,
 system_name VARCHAR(255) NOT NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_system(project_id,system_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_locations (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 parent_location_id BIGINT UNSIGNED NULL,
 location_code VARCHAR(96) NOT NULL,
 location_name VARCHAR(255) NOT NULL,
 location_type VARCHAR(64) NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_location(project_id,location_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(parent_location_id) REFERENCES etm_locations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_documents (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 document_no VARCHAR(160) NOT NULL,
 title VARCHAR(500) NOT NULL,
 document_type VARCHAR(32) NULL,
 revision VARCHAR(32) NULL,
 issue_status VARCHAR(64) NULL,
 source_uri TEXT NULL,
 storage_uri TEXT NULL,
 is_current TINYINT(1) NOT NULL DEFAULT 1,
 supersedes_document_id BIGINT UNSIGNED NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_doc_rev(project_id,document_no,revision),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(supersedes_document_id) REFERENCES etm_documents(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_evidence (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 evidence_code VARCHAR(96) NOT NULL,
 evidence_class ENUM('A','B','C','D') NOT NULL,
 document_id BIGINT UNSIGNED NULL,
 clause_ref VARCHAR(128) NULL,
 page_ref VARCHAR(64) NULL,
 drawing_ref VARCHAR(160) NULL,
 location_id BIGINT UNSIGNED NULL,
 statement_text TEXT NOT NULL,
 evidence_status VARCHAR(64) NOT NULL DEFAULT 'CURRENT',
 is_current TINYINT(1) NOT NULL DEFAULT 1,
 metadata_json JSON NULL,
 UNIQUE KEY uq_evidence(project_id,evidence_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(document_id) REFERENCES etm_documents(id),
 FOREIGN KEY(location_id) REFERENCES etm_locations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_requirements (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 location_id BIGINT UNSIGNED NULL,
 requirement_code VARCHAR(96) NOT NULL,
 requirement_type VARCHAR(64) NULL,
 requirement_text TEXT NOT NULL,
 evidence_id BIGINT UNSIGNED NULL,
 status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
 priority VARCHAR(16) NULL,
 is_current TINYINT(1) NOT NULL DEFAULT 1,
 metadata_json JSON NULL,
 UNIQUE KEY uq_requirement(project_id,requirement_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(location_id) REFERENCES etm_locations(id),
 FOREIGN KEY(evidence_id) REFERENCES etm_evidence(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_interfaces (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 interface_code VARCHAR(96) NOT NULL,
 interface_name VARCHAR(255) NOT NULL,
 source_entity VARCHAR(255) NOT NULL,
 target_entity VARCHAR(255) NOT NULL,
 medium VARCHAR(128) NULL,
 protocol_signal VARCHAR(128) NULL,
 status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
 metadata_json JSON NULL,
 UNIQUE KEY uq_interface(project_id,interface_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_proof_objects (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 location_id BIGINT UNSIGNED NULL,
 proof_code VARCHAR(128) NOT NULL,
 proof_type ENUM('CAL','SDY','RPT','TEST','ASSESSMENT') NOT NULL,
 proof_name VARCHAR(255) NOT NULL,
 official_document_id BIGINT UNSIGNED NULL,
 input_status VARCHAR(64) NULL,
 result_status VARCHAR(64) NULL,
 release_gate_status VARCHAR(64) NULL,
 evidence_class ENUM('A','B','C','D') NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_proof(project_id,proof_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(location_id) REFERENCES etm_locations(id),
 FOREIGN KEY(official_document_id) REFERENCES etm_documents(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_formulas (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NULL,
 formula_code VARCHAR(128) NOT NULL,
 formula_name VARCHAR(255) NOT NULL,
 formula_version VARCHAR(32) NOT NULL,
 expression_text TEXT NOT NULL,
 output_unit VARCHAR(32) NULL,
 input_schema_json JSON NULL,
 output_schema_json JSON NULL,
 status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
 UNIQUE KEY uq_formula(formula_code,formula_version),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_calculation_runs (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 location_id BIGINT UNSIGNED NULL,
 proof_object_id BIGINT UNSIGNED NULL,
 formula_id BIGINT UNSIGNED NOT NULL,
 run_code VARCHAR(128) NOT NULL,
 formula_version VARCHAR(32) NOT NULL,
 run_status VARCHAR(32) NOT NULL DEFAULT 'PRELIMINARY',
 input_snapshot_json JSON NOT NULL,
 output_snapshot_json JSON NULL,
 pass_fail_status VARCHAR(32) NULL,
 is_current TINYINT(1) NOT NULL DEFAULT 1,
 supersedes_run_id BIGINT UNSIGNED NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_calc_run(project_id,run_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(location_id) REFERENCES etm_locations(id),
 FOREIGN KEY(proof_object_id) REFERENCES etm_proof_objects(id),
 FOREIGN KEY(formula_id) REFERENCES etm_formulas(id),
 FOREIGN KEY(supersedes_run_id) REFERENCES etm_calculation_runs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_required_mto (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 location_id BIGINT UNSIGNED NULL,
 mto_code VARCHAR(128) NOT NULL,
 description TEXT NOT NULL,
 required_qty DECIMAL(24,8) NULL,
 unit VARCHAR(32) NULL,
 quantity_status VARCHAR(64) NOT NULL DEFAULT 'TBC',
 proof_object_id BIGINT UNSIGNED NULL,
 release_status VARCHAR(64) NOT NULL DEFAULT 'NOT_RELEASED',
 metadata_json JSON NULL,
 UNIQUE KEY uq_mto(project_id,mto_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(location_id) REFERENCES etm_locations(id),
 FOREIGN KEY(proof_object_id) REFERENCES etm_proof_objects(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_document_templates (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 template_code VARCHAR(96) NOT NULL UNIQUE,
 template_name VARCHAR(255) NOT NULL,
 template_type VARCHAR(32) NOT NULL,
 template_uri TEXT NULL,
 template_version VARCHAR(32) NULL,
 output_formats VARCHAR(128) NULL,
 metadata_json JSON NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_vdrl_items (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 vdrl_code VARCHAR(128) NOT NULL,
 document_id BIGINT UNSIGNED NULL,
 deliverable_title VARCHAR(500) NOT NULL,
 template_id BIGINT UNSIGNED NULL,
 responsible_party VARCHAR(255) NULL,
 revision VARCHAR(32) NULL,
 review_cycle_count INT NOT NULL DEFAULT 0,
 approval_status VARCHAR(64) NULL,
 lifecycle_stage_code VARCHAR(64) NULL,
 status VARCHAR(32) NOT NULL DEFAULT 'PLANNED',
 metadata_json JSON NULL,
 UNIQUE KEY uq_vdrl(project_id,vdrl_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(document_id) REFERENCES etm_documents(id),
 FOREIGN KEY(template_id) REFERENCES etm_document_templates(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_media (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 media_code VARCHAR(128) NOT NULL,
 media_type VARCHAR(32) NOT NULL,
 source_uri TEXT NOT NULL,
 storage_uri TEXT NULL,
 source_document_id BIGINT UNSIGNED NULL,
 page_ref VARCHAR(64) NULL,
 drawing_ref VARCHAR(160) NULL,
 caption TEXT NULL,
 revision VARCHAR(32) NULL,
 checksum_sha256 CHAR(64) NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_media(project_id,media_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(source_document_id) REFERENCES etm_documents(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_lifecycle_stages (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 stage_code VARCHAR(64) NOT NULL UNIQUE,
 stage_name VARCHAR(255) NOT NULL,
 sequence_no INT NOT NULL,
 stage_group VARCHAR(64) NULL,
 cost_category VARCHAR(64) NULL,
 active_flag TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_activities (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 location_id BIGINT UNSIGNED NULL,
 stage_id BIGINT UNSIGNED NOT NULL,
 activity_code VARCHAR(128) NOT NULL,
 activity_name VARCHAR(255) NOT NULL,
 quantity_driver_code VARCHAR(96) NULL,
 quantity_value DECIMAL(24,8) NULL,
 quantity_unit VARCHAR(32) NULL,
 umh_value DECIMAL(24,8) NULL,
 calculated_mh DECIMAL(24,8) NULL,
 mh_formula_id BIGINT UNSIGNED NULL,
 responsible_party VARCHAR(255) NULL,
 execution_party VARCHAR(255) NULL,
 cost_owner VARCHAR(255) NULL,
 witness_party VARCHAR(255) NULL,
 approval_party VARCHAR(255) NULL,
 status VARCHAR(32) NOT NULL DEFAULT 'PLANNED',
 metadata_json JSON NULL,
 UNIQUE KEY uq_activity(project_id,activity_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(location_id) REFERENCES etm_locations(id),
 FOREIGN KEY(stage_id) REFERENCES etm_lifecycle_stages(id),
 FOREIGN KEY(mh_formula_id) REFERENCES etm_formulas(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_roles (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 role_code VARCHAR(96) NOT NULL UNIQUE,
 role_name VARCHAR(255) NOT NULL,
 discipline VARCHAR(96) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_rates (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 role_id BIGINT UNSIGNED NOT NULL,
 rate_code VARCHAR(96) NOT NULL,
 currency VARCHAR(16) NOT NULL,
 hourly_rate DECIMAL(24,8) NULL,
 daily_rate DECIMAL(24,8) NULL,
 overtime_rate DECIMAL(24,8) NULL,
 site_factor DECIMAL(12,6) NULL,
 offshore_factor DECIMAL(12,6) NULL,
 effective_from DATE NULL,
 effective_to DATE NULL,
 FOREIGN KEY(role_id) REFERENCES etm_roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_spare_requirements (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 spare_code VARCHAR(128) NOT NULL,
 spare_type ENUM('STARTUP','COMMISSIONING','OPERATIONAL','TWO_YEAR','CAPITAL','INSURANCE','SPECIAL_TOOL','CONSUMABLE') NOT NULL,
 description TEXT NOT NULL,
 quantity DECIMAL(24,8) NULL,
 unit VARCHAR(32) NULL,
 quantity_basis TEXT NULL,
 responsible_party VARCHAR(255) NULL,
 cost_status VARCHAR(64) NOT NULL DEFAULT 'TBC',
 metadata_json JSON NULL,
 UNIQUE KEY uq_spare(project_id,spare_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_test_requirements (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 stage_id BIGINT UNSIGNED NOT NULL,
 test_code VARCHAR(128) NOT NULL,
 test_name VARCHAR(255) NOT NULL,
 acceptance_criteria TEXT NULL,
 responsible_party VARCHAR(255) NULL,
 witness_party VARCHAR(255) NULL,
 status VARCHAR(32) NOT NULL DEFAULT 'PLANNED',
 metadata_json JSON NULL,
 UNIQUE KEY uq_test(project_id,test_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(stage_id) REFERENCES etm_lifecycle_stages(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_cost_items (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 location_id BIGINT UNSIGNED NULL,
 activity_id BIGINT UNSIGNED NULL,
 mto_id BIGINT UNSIGNED NULL,
 lifecycle_stage_id BIGINT UNSIGNED NULL,
 cost_code VARCHAR(128) NOT NULL,
 cost_category VARCHAR(96) NOT NULL,
 description TEXT NOT NULL,
 quantity DECIMAL(24,8) NULL,
 unit VARCHAR(32) NULL,
 unit_cost DECIMAL(24,8) NULL,
 currency VARCHAR(16) NULL,
 amount DECIMAL(24,8) NULL,
 cost_formula_id BIGINT UNSIGNED NULL,
 cost_status VARCHAR(64) NOT NULL DEFAULT 'TBC',
 metadata_json JSON NULL,
 UNIQUE KEY uq_cost(project_id,cost_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(location_id) REFERENCES etm_locations(id),
 FOREIGN KEY(activity_id) REFERENCES etm_activities(id),
 FOREIGN KEY(mto_id) REFERENCES etm_required_mto(id),
 FOREIGN KEY(lifecycle_stage_id) REFERENCES etm_lifecycle_stages(id),
 FOREIGN KEY(cost_formula_id) REFERENCES etm_formulas(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_risks (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 risk_code VARCHAR(128) NOT NULL,
 risk_category VARCHAR(64) NULL,
 risk_title VARCHAR(255) NOT NULL,
 risk_description TEXT NULL,
 probability DECIMAL(8,4) NULL,
 impact_cost DECIMAL(24,8) NULL,
 impact_days DECIMAL(12,4) NULL,
 risk_status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
 mitigation TEXT NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_risk(project_id,risk_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
