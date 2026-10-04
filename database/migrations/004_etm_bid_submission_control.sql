SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS etm_bid_packages (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 bid_code VARCHAR(128) NOT NULL,
 bid_title VARCHAR(500) NOT NULL,
 bid_revision VARCHAR(32) NULL,
 submission_due DATETIME NULL,
 status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
 metadata_json JSON NULL,
 UNIQUE KEY uq_bid_package(project_id,bid_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_bid_source_groups (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 bid_package_id BIGINT UNSIGNED NOT NULL,
 group_code VARCHAR(96) NOT NULL,
 group_name VARCHAR(255) NOT NULL,
 source_domain ENUM('CONTRACT','COMMERCIAL','TECHNICAL','CLARIFICATION','VENDOR','OTHER') NOT NULL,
 status VARCHAR(32) NOT NULL DEFAULT 'RECEIVED',
 metadata_json JSON NULL,
 UNIQUE KEY uq_bid_source_group(bid_package_id,group_code),
 FOREIGN KEY(bid_package_id) REFERENCES etm_bid_packages(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_bid_source_documents (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 bid_package_id BIGINT UNSIGNED NOT NULL,
 source_group_id BIGINT UNSIGNED NULL,
 document_id BIGINT UNSIGNED NULL,
 source_code VARCHAR(128) NOT NULL,
 source_title VARCHAR(500) NOT NULL,
 source_role VARCHAR(128) NULL,
 precedence_order INT NULL,
 status VARCHAR(32) NOT NULL DEFAULT 'CURRENT',
 metadata_json JSON NULL,
 UNIQUE KEY uq_bid_source_doc(bid_package_id,source_code),
 FOREIGN KEY(bid_package_id) REFERENCES etm_bid_packages(id),
 FOREIGN KEY(source_group_id) REFERENCES etm_bid_source_groups(id),
 FOREIGN KEY(document_id) REFERENCES etm_documents(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_bid_requirement_lines (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 bid_package_id BIGINT UNSIGNED NOT NULL,
 source_document_id BIGINT UNSIGNED NULL,
 system_id BIGINT UNSIGNED NULL,
 location_id BIGINT UNSIGNED NULL,
 requirement_code VARCHAR(128) NOT NULL,
 requirement_domain ENUM('CONTRACTUAL','COMMERCIAL','TECHNICAL','SCHEDULE','DOCUMENT','QA_TEST','LOGISTICS','TRAINING','SITE_SERVICE','SPARES','WARRANTY','OTHER') NOT NULL,
 clause_ref VARCHAR(128) NULL,
 requirement_text TEXT NOT NULL,
 response_required TINYINT(1) NOT NULL DEFAULT 1,
 price_impact_flag TINYINT(1) NOT NULL DEFAULT 0,
 schedule_impact_flag TINYINT(1) NOT NULL DEFAULT 0,
 evidence_class ENUM('A','B','C','D') NULL,
 status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
 metadata_json JSON NULL,
 UNIQUE KEY uq_bid_req(bid_package_id,requirement_code),
 FOREIGN KEY(bid_package_id) REFERENCES etm_bid_packages(id),
 FOREIGN KEY(source_document_id) REFERENCES etm_bid_source_documents(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(location_id) REFERENCES etm_locations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_bid_responses (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 bid_requirement_id BIGINT UNSIGNED NOT NULL,
 response_type ENUM('COMPLY','COMPLY_WITH_CLARIFICATION','TECHNICAL_DEVIATION','COMMERCIAL_DEVIATION','OPTION','EXCLUSION','TBC','NOT_APPLICABLE') NOT NULL DEFAULT 'TBC',
 response_text TEXT NULL,
 reason_justification TEXT NULL,
 linked_proof_id BIGINT UNSIGNED NULL,
 linked_mto_id BIGINT UNSIGNED NULL,
 linked_cost_item_id BIGINT UNSIGNED NULL,
 response_status ENUM('DRAFT','READY','SUBMITTED','RESPONDED','CLOSED') NOT NULL DEFAULT 'DRAFT',
 metadata_json JSON NULL,
 UNIQUE KEY uq_bid_response(bid_requirement_id),
 FOREIGN KEY(bid_requirement_id) REFERENCES etm_bid_requirement_lines(id),
 FOREIGN KEY(linked_proof_id) REFERENCES etm_proof_objects(id),
 FOREIGN KEY(linked_mto_id) REFERENCES etm_required_mto(id),
 FOREIGN KEY(linked_cost_item_id) REFERENCES etm_cost_items(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_bid_deviations (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 bid_package_id BIGINT UNSIGNED NOT NULL,
 bid_requirement_id BIGINT UNSIGNED NULL,
 deviation_code VARCHAR(128) NOT NULL,
 deviation_type ENUM('TECHNICAL','COMMERCIAL') NOT NULL,
 source_doc_para_description TEXT NOT NULL,
 vendor_deviation TEXT NOT NULL,
 reason_justification TEXT NULL,
 contractor_response_1 TEXT NULL,
 vendor_response_1 TEXT NULL,
 company_response TEXT NULL,
 purchaser_response_1 TEXT NULL,
 resolution TEXT NULL,
 closure_status VARCHAR(64) NULL,
 final_closure TEXT NULL,
 status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
 metadata_json JSON NULL,
 UNIQUE KEY uq_bid_deviation(bid_package_id,deviation_code),
 FOREIGN KEY(bid_package_id) REFERENCES etm_bid_packages(id),
 FOREIGN KEY(bid_requirement_id) REFERENCES etm_bid_requirement_lines(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_price_schedule_definitions (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 schedule_code VARCHAR(32) NOT NULL UNIQUE,
 schedule_name VARCHAR(255) NOT NULL,
 scope_classification VARCHAR(64) NULL,
 pricing_rule TEXT NULL,
 template_source VARCHAR(255) NULL,
 metadata_json JSON NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_bid_price_schedule_items (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 bid_package_id BIGINT UNSIGNED NOT NULL,
 schedule_definition_id BIGINT UNSIGNED NOT NULL,
 line_code VARCHAR(128) NOT NULL,
 description TEXT NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 mto_id BIGINT UNSIGNED NULL,
 activity_id BIGINT UNSIGNED NULL,
 spare_requirement_id BIGINT UNSIGNED NULL,
 quantity DECIMAL(24,8) NULL,
 unit VARCHAR(32) NULL,
 unit_rate DECIMAL(24,8) NULL,
 amount DECIMAL(24,8) NULL,
 currency VARCHAR(16) NULL,
 inclusion_status ENUM('BASE','OPTION','SEPARATE','CALL_OFF','EXCLUDED','TBC') NOT NULL DEFAULT 'TBC',
 cost_basis_status VARCHAR(64) NOT NULL DEFAULT 'TBC',
 metadata_json JSON NULL,
 UNIQUE KEY uq_bid_price_line(bid_package_id,schedule_definition_id,line_code),
 FOREIGN KEY(bid_package_id) REFERENCES etm_bid_packages(id),
 FOREIGN KEY(schedule_definition_id) REFERENCES etm_price_schedule_definitions(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(mto_id) REFERENCES etm_required_mto(id),
 FOREIGN KEY(activity_id) REFERENCES etm_activities(id),
 FOREIGN KEY(spare_requirement_id) REFERENCES etm_spare_requirements(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_bid_submission_items (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 bid_package_id BIGINT UNSIGNED NOT NULL,
 submission_code VARCHAR(128) NOT NULL,
 submission_type ENUM('PRICE','TECHNICAL_DEVIATION','COMMERCIAL_DEVIATION','TECHNICAL_PROPOSAL','VDRL','SCHEDULE','COMMERCIAL_PROPOSAL','OTHER') NOT NULL,
 title VARCHAR(500) NOT NULL,
 source_template VARCHAR(255) NULL,
 readiness_status ENUM('READY','PARTIAL','OPEN','NOT_READY','BLOCKED') NOT NULL DEFAULT 'OPEN',
 generated_output_id BIGINT UNSIGNED NULL,
 remarks TEXT NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_bid_submission(bid_package_id,submission_code),
 FOREIGN KEY(bid_package_id) REFERENCES etm_bid_packages(id),
 FOREIGN KEY(generated_output_id) REFERENCES etm_generated_outputs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
