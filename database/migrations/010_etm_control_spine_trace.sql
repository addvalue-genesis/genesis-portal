SET NAMES utf8mb4;

-- PJ2608-0550 ETM / GENESIS control-spine extension.
-- Reuses controlled methodology only. No PJ2608-0553 / PJ2607-0541 quantity,
-- rate, crew, scope or commercial particular is seeded by this migration.
--
-- Existing semantic states intentionally remain separated:
--   Internal cost state      -> etm_cost_items.cost_status
--   Customer treatment      -> etm_bid_price_schedule_items.inclusion_status
-- This migration links those existing objects instead of creating duplicate fields.

CREATE TABLE IF NOT EXISTS etm_trace_edges (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 edge_code VARCHAR(128) NOT NULL,
 source_object_type VARCHAR(64) NOT NULL,
 source_object_id BIGINT UNSIGNED NOT NULL,
 relationship_type VARCHAR(96) NOT NULL,
 target_object_type VARCHAR(64) NOT NULL,
 target_object_id BIGINT UNSIGNED NOT NULL,
 binding_state ENUM('VERIFIED','PARTIAL','OPEN','TBC','NOT_APPLICABLE','SOURCE_CONFLICT') NOT NULL DEFAULT 'OPEN',
 evidence_id BIGINT UNSIGNED NULL,
 basis_text TEXT NULL,
 status VARCHAR(64) NOT NULL DEFAULT 'ACTIVE',
 metadata_json JSON NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_trace_edge(project_id,edge_code),
 KEY ix_trace_source(project_id,source_object_type,source_object_id),
 KEY ix_trace_target(project_id,target_object_type,target_object_id),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(evidence_id) REFERENCES etm_evidence(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_parties (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 party_code VARCHAR(96) NOT NULL,
 party_name VARCHAR(255) NOT NULL,
 party_type ENUM('CLIENT','CONTRACTOR','SUBCONTRACTOR','VENDOR','OEM','INTERNAL','AUTHORITY','OTHER') NOT NULL DEFAULT 'OTHER',
 vendor_id BIGINT UNSIGNED NULL,
 legal_entity_name VARCHAR(255) NULL,
 status VARCHAR(64) NOT NULL DEFAULT 'ACTIVE',
 metadata_json JSON NULL,
 UNIQUE KEY uq_party(project_id,party_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(vendor_id) REFERENCES etm_vendors(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_object_responsibilities (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 responsibility_code VARCHAR(128) NOT NULL,
 object_type VARCHAR(64) NOT NULL,
 object_id BIGINT UNSIGNED NOT NULL,
 responsibility_role VARCHAR(64) NOT NULL,
 party_id BIGINT UNSIGNED NULL,
 binding_state ENUM('SOURCE_CONFIRMED','WORKING_MODEL','TBC','NOT_APPLICABLE','SOURCE_CONFLICT') NOT NULL DEFAULT 'TBC',
 source_ref VARCHAR(500) NULL,
 evidence_id BIGINT UNSIGNED NULL,
 effective_from DATE NULL,
 effective_to DATE NULL,
 status VARCHAR(64) NOT NULL DEFAULT 'ACTIVE',
 metadata_json JSON NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_object_responsibility(project_id,responsibility_code),
 KEY ix_resp_object(project_id,object_type,object_id),
 KEY ix_resp_party(project_id,party_id,responsibility_role),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(party_id) REFERENCES etm_parties(id),
 FOREIGN KEY(evidence_id) REFERENCES etm_evidence(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_execution_events (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 location_id BIGINT UNSIGNED NULL,
 stage_id BIGINT UNSIGNED NULL,
 event_code VARCHAR(128) NOT NULL,
 event_type VARCHAR(64) NOT NULL,
 event_name VARCHAR(255) NOT NULL,
 source_ref VARCHAR(500) NULL,
 evidence_id BIGINT UNSIGNED NULL,
 planned_start DATETIME NULL,
 planned_finish DATETIME NULL,
 actual_start DATETIME NULL,
 actual_finish DATETIME NULL,
 event_state ENUM('REQUIRED','PLANNED','READY','IN_PROGRESS','COMPLETE','HOLD','TBC','NOT_APPLICABLE') NOT NULL DEFAULT 'TBC',
 metadata_json JSON NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_execution_event(project_id,event_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(location_id) REFERENCES etm_locations(id),
 FOREIGN KEY(stage_id) REFERENCES etm_lifecycle_stages(id),
 FOREIGN KEY(evidence_id) REFERENCES etm_evidence(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_physical_trips (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 trip_code VARCHAR(128) NOT NULL,
 trip_name VARCHAR(255) NOT NULL,
 origin_text VARCHAR(255) NULL,
 destination_text VARCHAR(255) NULL,
 departure_date DATE NULL,
 return_date DATE NULL,
 traveller_count DECIMAL(12,4) NULL,
 trip_state ENUM('REQUIRED','PLANNED','QUOTED','BOOKED','COMPLETE','HOLD','TBC','NOT_APPLICABLE') NOT NULL DEFAULT 'TBC',
 source_ref VARCHAR(500) NULL,
 evidence_id BIGINT UNSIGNED NULL,
 metadata_json JSON NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_physical_trip(project_id,trip_code),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(evidence_id) REFERENCES etm_evidence(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_event_activity_bindings (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 event_id BIGINT UNSIGNED NOT NULL,
 activity_id BIGINT UNSIGNED NOT NULL,
 purpose_class VARCHAR(64) NULL,
 workload_owner_state ENUM('SOURCE_CONFIRMED','WORKING_MODEL','TBC','NOT_APPLICABLE') NOT NULL DEFAULT 'TBC',
 metadata_json JSON NULL,
 UNIQUE KEY uq_event_activity(event_id,activity_id),
 FOREIGN KEY(event_id) REFERENCES etm_execution_events(id),
 FOREIGN KEY(activity_id) REFERENCES etm_activities(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_event_trip_bindings (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 event_id BIGINT UNSIGNED NOT NULL,
 physical_trip_id BIGINT UNSIGNED NOT NULL,
 trip_role VARCHAR(64) NULL,
 incremental_mobilization_flag TINYINT(1) NOT NULL DEFAULT 0,
 metadata_json JSON NULL,
 UNIQUE KEY uq_event_trip(event_id,physical_trip_id),
 FOREIGN KEY(event_id) REFERENCES etm_execution_events(id),
 FOREIGN KEY(physical_trip_id) REFERENCES etm_physical_trips(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_trip_cost_bindings (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 physical_trip_id BIGINT UNSIGNED NOT NULL,
 cost_item_id BIGINT UNSIGNED NOT NULL,
 allocation_note TEXT NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_trip_cost_item(cost_item_id),
 KEY ix_trip_cost_trip(physical_trip_id),
 FOREIGN KEY(physical_trip_id) REFERENCES etm_physical_trips(id),
 FOREIGN KEY(cost_item_id) REFERENCES etm_cost_items(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_vdrl_workload_bindings (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 vdrl_occurrence_id BIGINT UNSIGNED NOT NULL,
 workload_code VARCHAR(128) NOT NULL,
 model_revision VARCHAR(32) NOT NULL DEFAULT 'WORKING',
 issue_quantity DECIMAL(24,8) NULL,
 content_quantity DECIMAL(24,8) NULL,
 content_unit VARCHAR(64) NULL,
 setup_mh_per_issue DECIMAL(24,8) NULL,
 content_umh DECIMAL(24,8) NULL,
 prepare_mh DECIMAL(24,8) NULL,
 check_mh DECIMAL(24,8) NULL,
 document_control_mh DECIMAL(24,8) NULL,
 internal_approval_mh DECIMAL(24,8) NULL,
 external_review_mh DECIMAL(24,8) NULL,
 revision_mh DECIMAL(24,8) NULL,
 final_issue_mh DECIMAL(24,8) NULL,
 total_mh DECIMAL(24,8) NULL,
 equation_binding_id BIGINT UNSIGNED NULL,
 input_state ENUM('VERIFIED','PARTIAL','OPEN','TBC','NOT_APPLICABLE','SOURCE_CONFLICT') NOT NULL DEFAULT 'TBC',
 source_ref VARCHAR(500) NULL,
 evidence_id BIGINT UNSIGNED NULL,
 is_current TINYINT(1) NOT NULL DEFAULT 1,
 supersedes_workload_id BIGINT UNSIGNED NULL,
 metadata_json JSON NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_vdrl_workload(project_id,workload_code,model_revision),
 KEY ix_vdrl_workload_occurrence(vdrl_occurrence_id,is_current),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(vdrl_occurrence_id) REFERENCES etm_vdrl_occurrences(id),
 FOREIGN KEY(equation_binding_id) REFERENCES etm_equation_bindings(id),
 FOREIGN KEY(evidence_id) REFERENCES etm_evidence(id),
 FOREIGN KEY(supersedes_workload_id) REFERENCES etm_vdrl_workload_bindings(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_cost_price_bindings (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 binding_code VARCHAR(128) NOT NULL,
 cost_item_id BIGINT UNSIGNED NOT NULL,
 bid_price_schedule_item_id BIGINT UNSIGNED NOT NULL,
 allocation_basis VARCHAR(128) NULL,
 allocated_quantity DECIMAL(24,8) NULL,
 allocated_amount DECIMAL(24,8) NULL,
 currency VARCHAR(16) NULL,
 binding_state ENUM('VERIFIED','PARTIAL','OPEN','TBC','NOT_APPLICABLE') NOT NULL DEFAULT 'TBC',
 evidence_id BIGINT UNSIGNED NULL,
 note_text TEXT NULL,
 metadata_json JSON NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_cost_price_binding(project_id,binding_code),
 KEY ix_cost_price_cost(cost_item_id),
 KEY ix_cost_price_line(bid_price_schedule_item_id),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(cost_item_id) REFERENCES etm_cost_items(id),
 FOREIGN KEY(bid_price_schedule_item_id) REFERENCES etm_bid_price_schedule_items(id),
 FOREIGN KEY(evidence_id) REFERENCES etm_evidence(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
