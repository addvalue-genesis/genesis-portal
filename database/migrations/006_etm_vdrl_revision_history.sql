SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS etm_vdrl_revision_history (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 vdrl_occurrence_id BIGINT UNSIGNED NOT NULL,
 deliverable_document_id BIGINT UNSIGNED NULL,
 revision_no VARCHAR(32) NOT NULL,
 revision_date DATE NULL,
 issue_purpose VARCHAR(64) NULL,
 issue_status VARCHAR(64) NULL,
 change_summary TEXT NULL,
 source_revision_snapshot_json JSON NULL,
 db_snapshot_ref VARCHAR(255) NULL,
 generated_output_id BIGINT UNSIGNED NULL,
 transmittal_id BIGINT UNSIGNED NULL,
 supersedes_revision_id BIGINT UNSIGNED NULL,
 is_current TINYINT(1) NOT NULL DEFAULT 0,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 metadata_json JSON NULL,
 UNIQUE KEY uq_vdrl_revision(vdrl_occurrence_id,revision_no),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(vdrl_occurrence_id) REFERENCES etm_vdrl_occurrences(id),
 FOREIGN KEY(deliverable_document_id) REFERENCES etm_documents(id),
 FOREIGN KEY(generated_output_id) REFERENCES etm_generated_outputs(id),
 FOREIGN KEY(transmittal_id) REFERENCES etm_transmittals(id),
 FOREIGN KEY(supersedes_revision_id) REFERENCES etm_vdrl_revision_history(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
