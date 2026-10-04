SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS etm_workbench_objectives (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 location_id BIGINT UNSIGNED NULL,
 objective_code VARCHAR(128) NOT NULL,
 objective_text TEXT NOT NULL,
 current_focus VARCHAR(255) NULL,
 current_stage VARCHAR(128) NULL,
 next_gate TEXT NULL,
 status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
 is_current TINYINT(1) NOT NULL DEFAULT 1,
 metadata_json JSON NULL,
 UNIQUE KEY uq_workbench_objective(project_id,objective_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(location_id) REFERENCES etm_locations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_input_requests (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 location_id BIGINT UNSIGNED NULL,
 request_code VARCHAR(128) NOT NULL,
 requested_from ENUM('USER','CLIENT','VENDOR','OTHER_DISCIPLINE','INTERNAL') NOT NULL DEFAULT 'USER',
 item_name VARCHAR(255) NOT NULL,
 reason_text TEXT NULL,
 impact_text TEXT NULL,
 priority VARCHAR(16) NOT NULL DEFAULT 'MEDIUM',
 status ENUM('OPEN','REQUESTED','RECEIVED','VERIFIED','CLOSED','NOT_APPLICABLE') NOT NULL DEFAULT 'OPEN',
 source_document_id BIGINT UNSIGNED NULL,
 due_date DATE NULL,
 received_date DATE NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_input_request(project_id,request_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(location_id) REFERENCES etm_locations(id),
 FOREIGN KEY(source_document_id) REFERENCES etm_documents(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_action_queue (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 location_id BIGINT UNSIGNED NULL,
 action_code VARCHAR(128) NOT NULL,
 action_owner ENUM('CHATGPT','USER','CLIENT','VENDOR','TSI','OTHER') NOT NULL,
 action_type VARCHAR(96) NOT NULL,
 action_text TEXT NOT NULL,
 blocked_by_input_request_id BIGINT UNSIGNED NULL,
 priority VARCHAR(16) NOT NULL DEFAULT 'MEDIUM',
 status ENUM('READY','WAITING_INPUT','IN_PROGRESS','DONE','CANCELLED') NOT NULL DEFAULT 'READY',
 metadata_json JSON NULL,
 UNIQUE KEY uq_action_queue(project_id,action_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(location_id) REFERENCES etm_locations(id),
 FOREIGN KEY(blocked_by_input_request_id) REFERENCES etm_input_requests(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_quote_readiness (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 location_id BIGINT UNSIGNED NULL,
 readiness_code VARCHAR(128) NOT NULL,
 dimension_name VARCHAR(128) NOT NULL,
 readiness_status ENUM('READY','PARTIAL','OPEN','TBC','NOT_READY','BLOCKED') NOT NULL DEFAULT 'TBC',
 readiness_score DECIMAL(5,2) NULL,
 basis_text TEXT NULL,
 blocker_count INT NOT NULL DEFAULT 0,
 evaluated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 metadata_json JSON NULL,
 UNIQUE KEY uq_quote_readiness(project_id,readiness_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(location_id) REFERENCES etm_locations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_decision_actions (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 decision_id BIGINT UNSIGNED NOT NULL,
 action_type ENUM('ACCEPT_WORKING_BASIS','KEEP_TBC','CREATE_TC','ASK_VENDOR','ASK_CLIENT','RECALCULATE','SUPERSEDE') NOT NULL,
 action_status ENUM('PROPOSED','APPROVED','REJECTED','DONE') NOT NULL DEFAULT 'PROPOSED',
 actor VARCHAR(128) NULL,
 action_note TEXT NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 metadata_json JSON NULL,
 FOREIGN KEY(decision_id) REFERENCES etm_decisions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
