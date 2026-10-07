SET NAMES utf8mb4;

-- PJ2608-0550 — canonical product identity + derivation spine.
--
-- Architecture rules:
-- 1) DB stores canonical source/project truth and auditable derived state.
-- 2) JSON is exchange/snapshot, not a second master when DB is live.
-- 3) JS executes deterministic rules/equations and projects results; React does not own pricing math.
-- 4) New source evidence enters PARTICULAR state first.
-- 5) PARTICULAR findings may only become COMMON/GENERIC through an explicit reviewed promotion proposal.
-- 6) Existing etm_trace_edges remains the single dependency graph.
-- 7) Existing etm_calculation_runs is extended for canonical equation bindings instead of creating a second run table.

CREATE TABLE IF NOT EXISTS etm_products (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 product_code VARCHAR(128) NOT NULL,
 manufacturer_vendor_id BIGINT UNSIGNED NULL,
 product_family VARCHAR(128) NOT NULL,
 product_name VARCHAR(255) NOT NULL,
 canonical_model VARCHAR(160) NULL,
 manufacturer_part_no VARCHAR(128) NULL,
 lifecycle_state ENUM('CURRENT','LEGACY','OBSOLETE','UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
 control_state ENUM('CONTROLLED','WORKING','REVIEW_REQUIRED','SUPERSEDED') NOT NULL DEFAULT 'REVIEW_REQUIRED',
 metadata_json JSON NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_product_code(product_code),
 KEY ix_product_identity(manufacturer_vendor_id,canonical_model,manufacturer_part_no),
 FOREIGN KEY(manufacturer_vendor_id) REFERENCES etm_vendors(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_product_aliases (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 product_id BIGINT UNSIGNED NOT NULL,
 vendor_id BIGINT UNSIGNED NULL,
 alias_type ENUM('MODEL','PART_NO','VENDOR_DESCRIPTION','LEGACY_CODE','NORMALIZED_NAME','OTHER') NOT NULL,
 alias_value VARCHAR(500) NOT NULL,
 alias_state ENUM('VERIFIED','WORKING','REVIEW_REQUIRED','SUPERSEDED') NOT NULL DEFAULT 'REVIEW_REQUIRED',
 metadata_json JSON NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_product_alias(product_id,alias_type,alias_value),
 KEY ix_product_alias_lookup(alias_type,alias_value(191)),
 FOREIGN KEY(product_id) REFERENCES etm_products(id),
 FOREIGN KEY(vendor_id) REFERENCES etm_vendors(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE etm_vendor_offer_items
  ADD COLUMN IF NOT EXISTS product_id BIGINT UNSIGNED NULL AFTER vendor_model;

CREATE INDEX IF NOT EXISTS ix_vendor_offer_item_product
  ON etm_vendor_offer_items(product_id);

ALTER TABLE etm_evidence_assertions
  ADD COLUMN IF NOT EXISTS product_id BIGINT UNSIGNED NULL AFTER object_key,
  ADD COLUMN IF NOT EXISTS target_object_type VARCHAR(64) NULL AFTER product_id,
  ADD COLUMN IF NOT EXISTS target_object_ref VARCHAR(160) NULL AFTER target_object_type;

CREATE INDEX IF NOT EXISTS ix_assertion_product
  ON etm_evidence_assertions(project_id,product_id,assertion_domain,review_state);

-- Reuse etm_calculation_runs as the canonical derivation audit trail.
-- Legacy formula_id/formula_version become optional when an etm_equation_binding is used.
ALTER TABLE etm_calculation_runs
  MODIFY COLUMN formula_id BIGINT UNSIGNED NULL,
  MODIFY COLUMN formula_version VARCHAR(32) NULL,
  ADD COLUMN IF NOT EXISTS equation_binding_id BIGINT UNSIGNED NULL AFTER formula_id,
  ADD COLUMN IF NOT EXISTS engine_name VARCHAR(128) NULL AFTER equation_binding_id,
  ADD COLUMN IF NOT EXISTS engine_revision VARCHAR(64) NULL AFTER engine_name,
  ADD COLUMN IF NOT EXISTS derivation_role
    ENUM('PROOF','QUANTITY','WORKLOAD','COST','SCHEDULE','RISK','COMMERCIAL','RECONCILIATION','DISPLAY','OTHER')
    NOT NULL DEFAULT 'OTHER' AFTER engine_revision,
  ADD COLUMN IF NOT EXISTS target_object_type VARCHAR(64) NULL AFTER derivation_role,
  ADD COLUMN IF NOT EXISTS target_object_ref VARCHAR(160) NULL AFTER target_object_type,
  ADD COLUMN IF NOT EXISTS input_snapshot_hash CHAR(64) NULL AFTER target_object_ref,
  ADD COLUMN IF NOT EXISTS result_state
    ENUM('DERIVED','CONTROLLED','TBC','BLOCKED','STALE','SUPERSEDED','ERROR')
    NOT NULL DEFAULT 'TBC' AFTER pass_fail_status,
  ADD COLUMN IF NOT EXISTS stale_flag TINYINT(1) NOT NULL DEFAULT 0 AFTER result_state,
  ADD COLUMN IF NOT EXISTS stale_reason TEXT NULL AFTER stale_flag,
  ADD COLUMN IF NOT EXISTS change_event_id BIGINT UNSIGNED NULL AFTER stale_reason;

CREATE INDEX IF NOT EXISTS ix_calc_equation_binding
  ON etm_calculation_runs(project_id,equation_binding_id,derivation_role,is_current);

CREATE INDEX IF NOT EXISTS ix_calc_target
  ON etm_calculation_runs(project_id,target_object_type,target_object_ref,is_current,result_state);

CREATE INDEX IF NOT EXISTS ix_calc_stale
  ON etm_calculation_runs(project_id,stale_flag,result_state);

ALTER TABLE etm_reasoning_proposals
  ADD COLUMN IF NOT EXISTS promotion_scope
    ENUM('PARTICULAR_ONLY','GENERIC_CANDIDATE','COMMON_CANDIDATE')
    NOT NULL DEFAULT 'PARTICULAR_ONLY' AFTER proposal_action,
  ADD COLUMN IF NOT EXISTS method_change_requires_new_version TINYINT(1) NOT NULL DEFAULT 0 AFTER promotion_scope;

CREATE INDEX IF NOT EXISTS ix_reasoning_promotion
  ON etm_reasoning_proposals(project_id,promotion_scope,proposal_state);

ALTER TABLE etm_price_line_layers
  ADD COLUMN IF NOT EXISTS calculation_run_id BIGINT UNSIGNED NULL AFTER bid_price_decision_id;

CREATE INDEX IF NOT EXISTS ix_price_layer_calc_run
  ON etm_price_line_layers(project_id,calculation_run_id,layer_type,layer_state);

-- Design contract:
-- SOURCE/DATASHEET/QUOTE -> etm_evidence / etm_evidence_assertions
-- -> PARTICULAR requirement/product/MTO/work/vendor-condition state
-- -> etm_equation_bindings (COMMON/GENERIC equation reference)
-- -> etm_calculation_runs (input/output snapshot, stale/recompute audit)
-- -> canonical target objects / cost / four price layers
-- -> 7.1 analytical workbench projection
-- -> management release
-- -> 7.0 Working Preview / Released Customer Output.
--
-- A reseller/vendor offer item may bind to the same etm_products row as another offer item.
-- Price/lead-time/incoterm stay offer facts; technical identity/capability evidence stays product/source facts.
-- No vendor or datasheet revision may mutate COMMON/GENERIC method automatically.
