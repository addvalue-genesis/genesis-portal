SET NAMES utf8mb4;

-- PJ2608-0550 — revision / dependency / impact propagation control.
-- Reuses etm_trace_edges as the single dependency graph; does NOT create a second graph table.
-- A source revision change (e.g. MR A1 -> A2/B1) creates one change event, traverses active trace edges,
-- marks impacted downstream objects for REVIEW / RECALCULATE / REGENERATE / INVALIDATE as applicable,
-- and records output revisions against the exact input snapshot.

ALTER TABLE etm_trace_edges
  ADD COLUMN IF NOT EXISTS propagation_action
    ENUM('REVIEW','RECALCULATE','REGENERATE','INVALIDATE','INFORM')
    NOT NULL DEFAULT 'REVIEW' AFTER relationship_type,
  ADD COLUMN IF NOT EXISTS stale_on_upstream_change TINYINT(1) NOT NULL DEFAULT 1 AFTER propagation_action,
  ADD COLUMN IF NOT EXISTS last_validated_upstream_ref VARCHAR(255) NULL AFTER stale_on_upstream_change;

CREATE TABLE IF NOT EXISTS etm_change_events (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 change_code VARCHAR(160) NOT NULL,
 source_object_type VARCHAR(64) NOT NULL,
 source_object_id BIGINT UNSIGNED NOT NULL,
 source_document_id BIGINT UNSIGNED NULL,
 previous_revision VARCHAR(64) NULL,
 new_revision VARCHAR(64) NULL,
 change_type ENUM('NEW_REVISION','SUPERSEDE','SOURCE_CORRECTION','APPROVED_DECISION','VENDOR_UPDATE','RATE_UPDATE','OTHER') NOT NULL,
 change_summary TEXT NULL,
 source_snapshot_hash CHAR(64) NULL,
 event_status ENUM('DETECTED','IMPACT_ANALYZED','REVIEW_IN_PROGRESS','RESOLVED','CANCELLED') NOT NULL DEFAULT 'DETECTED',
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 resolved_at DATETIME NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_change_event(project_id,change_code),
 KEY ix_change_source(project_id,source_object_type,source_object_id),
 KEY ix_change_status(project_id,event_status),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(source_document_id) REFERENCES etm_documents(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_change_impacts (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 change_event_id BIGINT UNSIGNED NOT NULL,
 trace_edge_id BIGINT UNSIGNED NULL,
 impacted_object_type VARCHAR(64) NOT NULL,
 impacted_object_id BIGINT UNSIGNED NOT NULL,
 impact_action ENUM('REVIEW','RECALCULATE','REGENERATE','INVALIDATE','INFORM') NOT NULL,
 impact_reason TEXT NOT NULL,
 prior_state VARCHAR(64) NULL,
 target_state VARCHAR(64) NULL,
 impact_status ENUM('OPEN','IN_PROGRESS','DONE','NOT_APPLICABLE','REJECTED') NOT NULL DEFAULT 'OPEN',
 reviewed_by VARCHAR(255) NULL,
 reviewed_at DATETIME NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_change_impact(change_event_id,impacted_object_type,impacted_object_id,impact_action),
 KEY ix_change_impact_project(project_id,impact_status),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(change_event_id) REFERENCES etm_change_events(id),
 FOREIGN KEY(trace_edge_id) REFERENCES etm_trace_edges(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_output_revisions (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 output_code VARCHAR(128) NOT NULL,
 output_module_id VARCHAR(32) NOT NULL,
 output_type VARCHAR(64) NOT NULL,
 revision_no VARCHAR(64) NOT NULL,
 generated_output_id BIGINT UNSIGNED NULL,
 input_snapshot_hash CHAR(64) NOT NULL,
 source_revision_snapshot_json JSON NOT NULL,
 output_state ENUM('DRAFT','READY','ISSUED','STALE','SUPERSEDED','BLOCKED') NOT NULL DEFAULT 'DRAFT',
 supersedes_output_revision_id BIGINT UNSIGNED NULL,
 change_event_id BIGINT UNSIGNED NULL,
 generated_at DATETIME NULL,
 issued_at DATETIME NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_output_revision(project_id,output_code,revision_no),
 KEY ix_output_current(project_id,output_code,output_state),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(generated_output_id) REFERENCES etm_generated_outputs(id),
 FOREIGN KEY(supersedes_output_revision_id) REFERENCES etm_output_revisions(id),
 FOREIGN KEY(change_event_id) REFERENCES etm_change_events(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_module_projection_state (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 module_id VARCHAR(32) NOT NULL,
 projection_revision VARCHAR(64) NOT NULL,
 canonical_snapshot_hash CHAR(64) NOT NULL,
 projection_status ENUM('CURRENT','STALE','BLOCKED','REBUILDING') NOT NULL DEFAULT 'CURRENT',
 stale_reason TEXT NULL,
 change_event_id BIGINT UNSIGNED NULL,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_module_projection(project_id,module_id),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(change_event_id) REFERENCES etm_change_events(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Propagation rule:
-- SOURCE REVISION -> change event -> traverse etm_trace_edges -> change impacts
-- -> recompute/review canonical downstream objects -> rebuild projections/graphs -> regenerate outputs
-- -> new output revision. No module owns an independent copy of truth.
