SET NAMES utf8mb4;

-- PJ2608-0550 ETM evidence-intelligence extension.
-- Purpose:
--   Source readers (human / AI / connector) persist structured assertions.
--   Deterministic code reconciles those assertions against controlled project state.
--   Reasoning output is stored as REVIEW_REQUIRED proposals; no auto-release.

CREATE TABLE IF NOT EXISTS etm_evidence_assertions (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 evidence_id BIGINT UNSIGNED NOT NULL,
 assertion_code VARCHAR(128) NOT NULL,
 assertion_domain VARCHAR(64) NOT NULL,
 system_token VARCHAR(96) NULL,
 price_line_code VARCHAR(64) NULL,
 location_code VARCHAR(96) NULL,
 object_key VARCHAR(255) NULL,
 assertion_state ENUM('FACT','DERIVED','ASSUMPTION','TBC','NOT_FOUND','SOURCE_CONFLICT','NOT_APPLICABLE') NOT NULL DEFAULT 'TBC',
 value_json JSON NULL,
 unit VARCHAR(64) NULL,
 source_priority INT NOT NULL DEFAULT 0,
 extractor_type ENUM('HUMAN','AI','CONNECTOR','IMPORT','RULE_ENGINE') NOT NULL DEFAULT 'HUMAN',
 review_state ENUM('UNREVIEWED','REVIEW_REQUIRED','APPROVED','REJECTED','SUPERSEDED','CONFLICT') NOT NULL DEFAULT 'REVIEW_REQUIRED',
 supersedes_assertion_id BIGINT UNSIGNED NULL,
 assertion_hash CHAR(64) NULL,
 metadata_json JSON NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_evidence_assertion(project_id,assertion_code),
 KEY ix_assertion_system(project_id,system_token,assertion_domain),
 KEY ix_assertion_price(project_id,price_line_code,assertion_domain),
 KEY ix_assertion_review(project_id,review_state),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(evidence_id) REFERENCES etm_evidence(id),
 FOREIGN KEY(supersedes_assertion_id) REFERENCES etm_evidence_assertions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_reasoning_runs (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 run_code VARCHAR(128) NOT NULL,
 engine_name VARCHAR(128) NOT NULL,
 engine_revision VARCHAR(64) NOT NULL,
 release_intent VARCHAR(64) NULL,
 input_snapshot_hash CHAR(64) NULL,
 input_state_json JSON NULL,
 output_summary_json JSON NULL,
 run_status ENUM('CONTROLLED','CONDITIONAL','BLOCKED','ERROR') NOT NULL DEFAULT 'CONDITIONAL',
 initiated_by_type ENUM('HUMAN','AI','CONNECTOR','SYSTEM') NOT NULL DEFAULT 'SYSTEM',
 initiated_by_ref VARCHAR(255) NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_reasoning_run(project_id,run_code),
 KEY ix_reasoning_status(project_id,run_status),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_reasoning_proposals (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 reasoning_run_id BIGINT UNSIGNED NOT NULL,
 proposal_code VARCHAR(160) NOT NULL,
 target_object_type VARCHAR(64) NOT NULL,
 target_object_ref VARCHAR(160) NOT NULL,
 proposal_action VARCHAR(96) NOT NULL,
 disposition VARCHAR(64) NOT NULL DEFAULT 'NEW_EVIDENCE',
 proposed_value_json JSON NULL,
 rationale_text TEXT NOT NULL,
 supporting_assertions_json JSON NULL,
 proposal_state ENUM('REVIEW_REQUIRED','APPROVED','REJECTED','SUPERSEDED','CONFLICT') NOT NULL DEFAULT 'REVIEW_REQUIRED',
 approval_required TINYINT(1) NOT NULL DEFAULT 1,
 approved_by VARCHAR(255) NULL,
 approved_at DATETIME NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_reasoning_proposal(project_id,proposal_code),
 KEY ix_proposal_run(reasoning_run_id),
 KEY ix_proposal_target(project_id,target_object_type,target_object_ref),
 KEY ix_proposal_state(project_id,proposal_state),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(reasoning_run_id) REFERENCES etm_reasoning_runs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Design rule:
-- etm_evidence = source statement/document trace
-- etm_evidence_assertions = structured machine-readable claims extracted from evidence
-- etm_reasoning_runs = deterministic evaluation snapshot
-- etm_reasoning_proposals = reviewable candidate change, never an implicit project-fact mutation
