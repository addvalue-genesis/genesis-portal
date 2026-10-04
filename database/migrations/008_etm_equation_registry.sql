SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS etm_equation_registry (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 equation_code VARCHAR(64) NOT NULL UNIQUE,
 equation_layer ENUM('COMMON','GENERIC','PROFILE','PARTICULAR_BINDING') NOT NULL,
 equation_domain VARCHAR(96) NOT NULL,
 equation_name VARCHAR(255) NOT NULL,
 expression_text TEXT NOT NULL,
 model_class VARCHAR(128) NULL,
 evidence_basis VARCHAR(255) NULL,
 grounding_class VARCHAR(128) NULL,
 calibration_state VARCHAR(128) NULL,
 control_status VARCHAR(128) NOT NULL DEFAULT 'CONTROLLED_WORKING_BASELINE',
 method_source VARCHAR(255) NOT NULL,
 method_revision VARCHAR(64) NULL,
 control_note TEXT NULL,
 metadata_json JSON NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_equation_bindings (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 equation_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 location_id BIGINT UNSIGNED NULL,
 binding_code VARCHAR(128) NOT NULL,
 binding_name VARCHAR(255) NOT NULL,
 input_state ENUM('VERIFIED','PARTIAL','OPEN','TBC','NOT_APPLICABLE') NOT NULL DEFAULT 'OPEN',
 input_binding_json JSON NULL,
 source_refs_json JSON NULL,
 output_object_type VARCHAR(64) NULL,
 output_object_ref VARCHAR(128) NULL,
 binding_status VARCHAR(64) NOT NULL DEFAULT 'WORKING',
 metadata_json JSON NULL,
 UNIQUE KEY uq_equation_binding(project_id,binding_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(equation_id) REFERENCES etm_equation_registry(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(location_id) REFERENCES etm_locations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_equation_method_sources (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 source_code VARCHAR(96) NOT NULL UNIQUE,
 source_project VARCHAR(64) NULL,
 source_title VARCHAR(500) NOT NULL,
 source_revision VARCHAR(64) NULL,
 source_type ENUM('CONTROLLED_MODEL','HISTORICAL_REFERENCE','STANDARD','RESEARCH','PROJECT_STANDARD') NOT NULL,
 reuse_policy VARCHAR(255) NOT NULL,
 source_uri TEXT NULL,
 status VARCHAR(64) NOT NULL DEFAULT 'ACTIVE',
 metadata_json JSON NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
