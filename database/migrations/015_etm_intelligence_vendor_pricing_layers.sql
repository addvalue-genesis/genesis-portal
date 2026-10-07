SET NAMES utf8mb4;

-- PJ2608-0550 canonical intelligence / pricing architecture.
-- Extends existing requirement, equation, vendor-offer and bid-price objects.
-- No duplicate engineering truth tables are introduced.

ALTER TABLE etm_equation_bindings
  ADD COLUMN IF NOT EXISTS requirement_id BIGINT UNSIGNED NULL AFTER location_id,
  ADD COLUMN IF NOT EXISTS proof_object_id BIGINT UNSIGNED NULL AFTER requirement_id,
  ADD COLUMN IF NOT EXISTS required_mto_id BIGINT UNSIGNED NULL AFTER proof_object_id,
  ADD COLUMN IF NOT EXISTS binding_role
    ENUM('REQUIREMENT_DRIVER','PROOF_METHOD','QUANTITY_DRIVER','WORKLOAD_DRIVER','COST_DRIVER','COMMERCIAL_DRIVER','DISPLAY_CONVERSION','OTHER')
    NOT NULL DEFAULT 'OTHER' AFTER binding_name;

CREATE INDEX IF NOT EXISTS ix_eq_binding_requirement
  ON etm_equation_bindings(project_id,requirement_id,binding_role);

CREATE TABLE IF NOT EXISTS etm_legacy_formula_equation_map (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NULL,
 formula_id BIGINT UNSIGNED NOT NULL,
 equation_id BIGINT UNSIGNED NOT NULL,
 mapping_state ENUM('VERIFIED','PARTIAL','REVIEW_REQUIRED','SUPERSEDED') NOT NULL DEFAULT 'REVIEW_REQUIRED',
 migration_note TEXT NULL,
 metadata_json JSON NULL,
 UNIQUE KEY uq_formula_equation(formula_id,equation_id),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(formula_id) REFERENCES etm_formulas(id),
 FOREIGN KEY(equation_id) REFERENCES etm_equation_registry(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_requirement_resolution_cases (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 requirement_id BIGINT UNSIGNED NOT NULL,
 case_code VARCHAR(128) NOT NULL,
 blocking_stage ENUM(
   'SOURCE_EVIDENCE','REQUIREMENT','FUNDAMENTAL_NEED','CONSTRAINT','INTERFACE_CONTEXT',
   'ENGINEERING_INPUT','CAL_STUDY_RPT','PROOF','ARCHITECTURE','PHYSICAL_OBJECT',
   'QUANTITY_DRIVER','REQUIRED_MTO','BULK','VENDOR_RECONCILIATION','WORK_RESOURCE',
   'DOCUMENT_QA','FAT_IFAT','LOGISTICS_REGULATORY','SITE_READINESS','INSTALL_PRECOM',
   'SAT_COMMISSIONING','HANDOVER_WARRANTY','COST_SCHEDULE_RISK','COMMERCIAL_TREATMENT','RELEASE'
 ) NOT NULL,
 problem_statement TEXT NOT NULL,
 resolution_status ENUM('OPEN','RESEARCHING_INTERNAL','RESEARCHING_EXTERNAL','PROPOSAL_READY','APPROVED','REJECTED','CLOSED') NOT NULL DEFAULT 'OPEN',
 internal_search_status ENUM('NOT_STARTED','RUNNING','FOUND','INSUFFICIENT','COMPLETE') NOT NULL DEFAULT 'NOT_STARTED',
 external_search_status ENUM('NOT_STARTED','RUNNING','FOUND','INSUFFICIENT','COMPLETE','NOT_REQUIRED') NOT NULL DEFAULT 'NOT_STARTED',
 recommended_action TEXT NULL,
 approved_decision_id BIGINT UNSIGNED NULL,
 metadata_json JSON NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_requirement_resolution_case(project_id,case_code),
 KEY ix_resolution_requirement(project_id,requirement_id,resolution_status),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(requirement_id) REFERENCES etm_requirements(id),
 FOREIGN KEY(approved_decision_id) REFERENCES etm_decisions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_research_candidates (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 resolution_case_id BIGINT UNSIGNED NOT NULL,
 candidate_code VARCHAR(160) NOT NULL,
 source_tier ENUM(
   'A_PROJECT_GOVERNING',
   'B_COMPANY_STANDARD_VENDOR_APPROVED',
   'C_INTERNATIONAL_STANDARD',
   'D_OEM_ENGINEERING',
   'E_PEER_REVIEWED_RESEARCH',
   'F_HISTORICAL_CALIBRATION',
   'G_ASSUMPTION'
 ) NOT NULL,
 source_type VARCHAR(96) NOT NULL,
 source_ref VARCHAR(500) NOT NULL,
 source_uri TEXT NULL,
 statement_text TEXT NOT NULL,
 applicability_text TEXT NULL,
 authority_score DECIMAL(5,2) NULL,
 applicability_score DECIMAL(5,2) NULL,
 confidence_score DECIMAL(5,2) NULL,
 candidate_state ENUM('FOUND','REVIEW_REQUIRED','ACCEPTED','REJECTED','SUPERSEDED') NOT NULL DEFAULT 'REVIEW_REQUIRED',
 evidence_id BIGINT UNSIGNED NULL,
 metadata_json JSON NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_research_candidate(project_id,candidate_code),
 KEY ix_research_case(resolution_case_id,candidate_state,source_tier),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(resolution_case_id) REFERENCES etm_requirement_resolution_cases(id),
 FOREIGN KEY(evidence_id) REFERENCES etm_evidence(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_vendor_offer_item_bindings (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 vendor_offer_item_id BIGINT UNSIGNED NOT NULL,
 system_id BIGINT UNSIGNED NULL,
 required_mto_id BIGINT UNSIGNED NULL,
 bid_price_schedule_item_id BIGINT UNSIGNED NULL,
 binding_code VARCHAR(160) NOT NULL,
 binding_role ENUM('DIRECT_SYSTEM_ITEM','SHARED_COMMON','OPTION','SERVICE','SPARE','TOOL','LOGISTICS','OTHER') NOT NULL,
 allocation_driver VARCHAR(128) NULL,
 allocated_qty DECIMAL(24,8) NULL,
 allocated_amount DECIMAL(24,8) NULL,
 currency VARCHAR(16) NULL,
 binding_state ENUM('VERIFIED','PARTIAL','OPEN','TBC','NOT_APPLICABLE') NOT NULL DEFAULT 'TBC',
 evidence_id BIGINT UNSIGNED NULL,
 note_text TEXT NULL,
 metadata_json JSON NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_vendor_item_binding(project_id,binding_code),
 KEY ix_vendor_item_binding(vendor_offer_item_id,system_id,binding_state),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(vendor_offer_item_id) REFERENCES etm_vendor_offer_items(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(required_mto_id) REFERENCES etm_required_mto(id),
 FOREIGN KEY(bid_price_schedule_item_id) REFERENCES etm_bid_price_schedule_items(id),
 FOREIGN KEY(evidence_id) REFERENCES etm_evidence(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_vendor_offer_conditions (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 vendor_offer_id BIGINT UNSIGNED NOT NULL,
 vendor_offer_item_id BIGINT UNSIGNED NULL,
 system_id BIGINT UNSIGNED NULL,
 condition_code VARCHAR(160) NOT NULL,
 condition_type ENUM(
   'INCOTERM','PAYMENT','VALIDITY','LEAD_TIME','WARRANTY','PACKING','FREIGHT',
   'INSTALLATION','FAT','IFAT','SAT','COMMISSIONING','TRAINING','DOCUMENTATION',
   'SPARES','TOOLS','SOFTWARE_LICENCE','TAX','DELIVERY_POINT','EXCLUSION','ASSUMPTION','OTHER'
 ) NOT NULL,
 raw_text TEXT NOT NULL,
 normalized_value_json JSON NULL,
 acceptance_state ENUM('OPEN','ACCEPT','ACCEPT_WITH_CLARIFICATION','REJECT','NOT_APPLICABLE') NOT NULL DEFAULT 'OPEN',
 cost_impact_state ENUM('NONE','POTENTIAL','CONFIRMED','TBC') NOT NULL DEFAULT 'TBC',
 schedule_impact_state ENUM('NONE','POTENTIAL','CONFIRMED','TBC') NOT NULL DEFAULT 'TBC',
 risk_impact_state ENUM('NONE','POTENTIAL','CONFIRMED','TBC') NOT NULL DEFAULT 'TBC',
 warranty_impact_state ENUM('NONE','POTENTIAL','CONFIRMED','TBC') NOT NULL DEFAULT 'TBC',
 accepted_condition_id BIGINT UNSIGNED NULL,
 evidence_id BIGINT UNSIGNED NULL,
 metadata_json JSON NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_vendor_offer_condition(project_id,condition_code),
 KEY ix_vendor_condition_offer(vendor_offer_id,condition_type,acceptance_state),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(vendor_offer_id) REFERENCES etm_vendor_offers(id),
 FOREIGN KEY(vendor_offer_item_id) REFERENCES etm_vendor_offer_items(id),
 FOREIGN KEY(system_id) REFERENCES etm_systems(id),
 FOREIGN KEY(accepted_condition_id) REFERENCES etm_accepted_conditions(id),
 FOREIGN KEY(evidence_id) REFERENCES etm_evidence(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS etm_price_line_layers (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 bid_price_schedule_item_id BIGINT UNSIGNED NOT NULL,
 layer_code VARCHAR(160) NOT NULL,
 layer_type ENUM('SOURCE_COST','INTERNAL_COST','WORKING_SELL','RELEASED_SELL') NOT NULL,
 revision_no VARCHAR(64) NOT NULL DEFAULT 'WORKING',
 amount DECIMAL(24,8) NULL,
 currency VARCHAR(16) NULL,
 layer_state ENUM('TBC','WORKING','CONTROLLED','AUTHORISATION_PENDING','AUTHORISED','HOLD','SUPERSEDED') NOT NULL DEFAULT 'TBC',
 basis_text TEXT NULL,
 pricing_policy_id BIGINT UNSIGNED NULL,
 bid_price_decision_id BIGINT UNSIGNED NULL,
 input_snapshot_hash CHAR(64) NULL,
 source_snapshot_json JSON NULL,
 metadata_json JSON NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_price_line_layer(project_id,layer_code,revision_no),
 KEY ix_price_line_layers(project_id,bid_price_schedule_item_id,layer_type,layer_state),
 FOREIGN KEY(project_id) REFERENCES etm_projects(id),
 FOREIGN KEY(bid_price_schedule_item_id) REFERENCES etm_bid_price_schedule_items(id),
 FOREIGN KEY(pricing_policy_id) REFERENCES etm_pricing_policy_versions(id),
 FOREIGN KEY(bid_price_decision_id) REFERENCES etm_bid_price_decisions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Canonical rules:
-- 1. Requirement thread = particular requirement instance; it binds reusable equations/methods, never copies them.
-- 2. Smart resolution searches internal governing evidence first, then external authority tiers; proposals require review before mutating released facts.
-- 3. Vendor offer stays intact at header/item level; item-to-system/MTO/price-line relationships live in binding rows.
-- 4. Vendor commercial/technical conditions are first-class impact objects, not free-text notes only.
-- 5. Customer output must use RELEASED_SELL only. Internal analysis may show SOURCE_COST / INTERNAL_COST / WORKING_SELL / RELEASED_SELL.
