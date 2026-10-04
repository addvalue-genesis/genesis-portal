SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS etm_accepted_conditions (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 bid_package_id BIGINT UNSIGNED NULL,
 condition_code VARCHAR(128) NOT NULL,
 source_ref VARCHAR(255) NOT NULL,
 condition_text TEXT NOT NULL,
 acceptance_state ENUM('ACCEPT','ACCEPT_WITH_CLARIFICATION','REJECT','OPEN') NOT NULL DEFAULT 'OPEN',
 cost_class ENUM('C_BASE','C_ACCEPT','F','R','ZERO_WITH_REASON','CLARIFY_FIRST') NOT NULL DEFAULT 'CLARIFY_FIRST',
 equation_code VARCHAR(64) NULL,
 input_state ENUM('VERIFIED','PARTIAL','OPEN','TBC','NOT_APPLICABLE') NOT NULL DEFAULT 'OPEN',
 input_json JSON NULL,
 amount_native DECIMAL(24,8) NULL,
 currency VARCHAR(16) NULL,
 zero_reason TEXT NULL,
 evidence_ref TEXT NULL,
 status VARCHAR(64) NOT NULL DEFAULT 'WORKING',
 metadata_json JSON NULL,
 UNIQUE KEY uq_accepted_condition(project_id,condition_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(bid_package_id) REFERENCES etm_bid_packages(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_pricing_policy_versions (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 policy_code VARCHAR(96) NOT NULL,
 policy_revision VARCHAR(32) NOT NULL,
 pricing_mode ENUM('MARKUP','MARGIN','RATE_CARD','HYBRID','OTHER') NOT NULL,
 policy_name VARCHAR(255) NOT NULL,
 expression_text TEXT NULL,
 approved_by VARCHAR(255) NULL,
 approved_at DATETIME NULL,
 status ENUM('DRAFT','APPROVED','SUPERSEDED','DISABLED') NOT NULL DEFAULT 'DRAFT',
 metadata_json JSON NULL,
 UNIQUE KEY uq_pricing_policy(policy_code,policy_revision)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_bid_price_decisions (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 bid_package_id BIGINT UNSIGNED NULL,
 decision_code VARCHAR(128) NOT NULL,
 price_state ENUM('MODEL_ONLY','INTERNAL_HOLD','AUTHORISATION_PENDING','AUTHORISED_OFFER','SUPERSEDED') NOT NULL DEFAULT 'MODEL_ONLY',
 cost_internal DECIMAL(24,8) NULL,
 cost_accept DECIMAL(24,8) NULL,
 financing_cost DECIMAL(24,8) NULL,
 risk_reserve DECIMAL(24,8) NULL,
 currency VARCHAR(16) NULL,
 floor_policy_id BIGINT UNSIGNED NULL,
 target_policy_id BIGINT UNSIGNED NULL,
 floor_price DECIMAL(24,8) NULL,
 target_price DECIMAL(24,8) NULL,
 offer_price DECIMAL(24,8) NULL,
 rationale_text TEXT NULL,
 buyer_gate_status VARCHAR(64) NULL,
 authorized_by VARCHAR(255) NULL,
 authorized_at DATETIME NULL,
 input_snapshot_json JSON NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_bid_price_decision(project_id,decision_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(bid_package_id) REFERENCES etm_bid_packages(id),
 FOREIGN KEY(floor_policy_id) REFERENCES etm_pricing_policy_versions(id),
 FOREIGN KEY(target_policy_id) REFERENCES etm_pricing_policy_versions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_buyer_view_checks (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 bid_package_id BIGINT UNSIGNED NULL,
 check_code VARCHAR(128) NOT NULL,
 check_group VARCHAR(96) NOT NULL,
 check_text TEXT NOT NULL,
 severity ENUM('CRITICAL','MAJOR','MINOR') NOT NULL DEFAULT 'MAJOR',
 source_ref VARCHAR(255) NULL,
 check_state ENUM('PASS','FAIL','HOLD','NOT_APPLICABLE') NOT NULL DEFAULT 'HOLD',
 evidence_ref TEXT NULL,
 action_text TEXT NULL,
 hypothesis_flag TINYINT(1) NOT NULL DEFAULT 0,
 metadata_json JSON NULL,
 UNIQUE KEY uq_buyer_check(project_id,check_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(bid_package_id) REFERENCES etm_bid_packages(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_pricing_control_checks (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 control_code VARCHAR(96) NOT NULL UNIQUE,
 control_name VARCHAR(255) NOT NULL,
 control_rule TEXT NOT NULL,
 origin_project VARCHAR(64) NULL,
 origin_source VARCHAR(500) NULL,
 control_type ENUM('DEFINITION','ANTI_DOUBLE_COUNT','RECONCILIATION','PRICE_STATE','RATE_PEDIGREE','QUANTITY_STATE','RISK','OTHER') NOT NULL,
 status ENUM('ACTIVE','DRAFT','SUPERSEDED') NOT NULL DEFAULT 'ACTIVE',
 metadata_json JSON NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
