SET NAMES utf8mb4;

-- PJ2608-0550 — classify BULK inside the existing required-MTO object.
-- No second bulk truth table is created.
-- Engineering ownership and customer commercial mapping are intentionally separate.

ALTER TABLE etm_required_mto
  ADD COLUMN IF NOT EXISTS object_class
    ENUM('MAIN_EQUIPMENT','BULK','ACCESSORY','SPARE','TOOL','FREE_ISSUE','REUSED_EXISTING','OTHER')
    NOT NULL DEFAULT 'MAIN_EQUIPMENT' AFTER description,
  ADD COLUMN IF NOT EXISTS ownership_class
    ENUM('SYSTEM_DEDICATED','SHARED_COMMON','VENDOR_INCLUDED','FREE_ISSUE','REUSED_EXISTING','TBC')
    NOT NULL DEFAULT 'TBC' AFTER object_class,
  ADD COLUMN IF NOT EXISTS material_family VARCHAR(96) NULL AFTER ownership_class,
  ADD COLUMN IF NOT EXISTS quantity_driver_code VARCHAR(128) NULL AFTER material_family,
  ADD COLUMN IF NOT EXISTS commercial_treatment
    ENUM('ROLL_UP_TO_SYSTEM_A1','COMMON_POOL_THEN_CAUSAL_ALLOCATE_TO_A1','B2','B5','B6','C1','C2','C3','VENDOR_INCLUDED','FREE_ISSUE','EXCLUDED','TBC')
    NOT NULL DEFAULT 'TBC' AFTER quantity_driver_code,
  ADD COLUMN IF NOT EXISTS commercial_mapping_state
    ENUM('VERIFIED','PARTIAL','OPEN','TBC','NOT_APPLICABLE')
    NOT NULL DEFAULT 'TBC' AFTER commercial_treatment,
  ADD COLUMN IF NOT EXISTS shared_allocation_driver VARCHAR(128) NULL AFTER commercial_mapping_state,
  ADD COLUMN IF NOT EXISTS vendor_inclusion_state
    ENUM('INCLUDED','PARTIAL','NOT_INCLUDED','FREE_ISSUE','REUSED','TBC')
    NOT NULL DEFAULT 'TBC' AFTER shared_allocation_driver;

CREATE INDEX IF NOT EXISTS ix_mto_bulk_class
  ON etm_required_mto(project_id,object_class,ownership_class,commercial_treatment);

-- Canonical rule:
-- 1) bulk remains an MTO/material object with system/location/driver trace;
-- 2) commercial roll-up is handled by cost-price binding, not by creating duplicate bulk rows;
-- 3) installation labor is a separate activity/cost object (C1);
-- 4) common/shared bulk remains OPEN until a causal allocation driver exists.
