SET NAMES utf8mb4;

-- PJ2608-0550 PAGA bulk pilot seed.
-- Requires migration 014.
-- Source reference quantities are preserved in metadata_json only.
-- required_qty remains NULL until engineering proof/route/topology releases a true order quantity.

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B01','Indoor FR audio cable','BULK','SYSTEM_DEDICATED','CABLE',NULL,'m','FEED_REFERENCE','NOT_RELEASED','ROLL_UP_TO_SYSTEM_A1','PARTIAL','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B01','reference_qty',3580,'reference_basis','LIS APF source; confirm rating, route and allowances.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B02','Indoor FR cable','BULK','SYSTEM_DEDICATED','CABLE',NULL,'m','FEED_REFERENCE','NOT_RELEASED','ROLL_UP_TO_SYSTEM_A1','PARTIAL','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B02','reference_qty',430,'reference_basis','Purpose/voltage and route allocation to be confirmed.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B03','Outdoor armoured FR cable','BULK','SYSTEM_DEDICATED','CABLE',NULL,'m','RECONCILE_MTO','NOT_RELEASED','ROLL_UP_TO_SYSTEM_A1','PARTIAL','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B03','reference_qty',805,'reference_basis','Extracted reference; reconcile by cable identity.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B04','Outdoor armoured FR cable','BULK','SYSTEM_DEDICATED','CABLE',NULL,'m','HOLD','NOT_RELEASED','ROLL_UP_TO_SYSTEM_A1','OPEN','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B04','reference_qty',17840,'reference_basis','Legacy/duplicate source records; redesign before release.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B05','OCU / digital station special cable','BULK','SYSTEM_DEDICATED','SPECIAL_CABLE',NULL,'m','OEM_CLARIFICATION','NOT_RELEASED','ROLL_UP_TO_SYSTEM_A1','OPEN','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B05','reference_qty',640,'reference_basis','OEM cable selection required.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B06','Inter-cabinet fibre cable','BULK','TBC','FIBER',NULL,'m','UNIT_RATE_AFTER_SPEC','NOT_RELEASED','TBC','OPEN','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B06','reference_qty',NULL,'reference_basis','Confirm topology and shared LAN/FO boundary.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B07','Fibre termination accessories','BULK','TBC','ODF_PATCH',NULL,'set','UNIT_RATE_AFTER_SPEC','NOT_RELEASED','TBC','OPEN','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B07','reference_qty',NULL,'reference_basis','Count actual fibre ends; deduct shared/OEM scope.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B08','Access-panel network cabling','BULK','SYSTEM_DEDICATED','DATA_CABLE',NULL,'link','SCENARIO_4_OR_8','NOT_RELEASED','ROLL_UP_TO_SYSTEM_A1','OPEN','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B08','reference_qty',NULL,'reference_basis','4 quoted IP panels; link count depends on final topology.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B09','RJ45 / modular jack / patch cords','BULK','SYSTEM_DEDICATED','CONNECTOR',NULL,'pc','DERIVE_FROM_ENDS','NOT_RELEASED','ROLL_UP_TO_SYSTEM_A1','OPEN','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B09','reference_qty',NULL,'reference_basis','Derive from field-terminated ends.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B10','PAGA outdoor junction boxes','BULK','SYSTEM_DEDICATED','JB',NULL,'tag','FEED_REFERENCE_ONLY','NOT_RELEASED','ROLL_UP_TO_SYSTEM_A1','PARTIAL','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B10','reference_qty',59,'reference_basis','59 distinct source tags; confirm actual replacement scope.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B11','Additional Ex horn glands','BULK','SYSTEM_DEDICATED','GLAND',NULL,'pc','CONDITIONAL_SCENARIO','NOT_RELEASED','ROLL_UP_TO_SYSTEM_A1','OPEN','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B11','reference_qty',57,'reference_basis','Conditional scenario only; not released.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B12','Additional ceiling speaker glands','BULK','SYSTEM_DEDICATED','GLAND',NULL,'pc','CONDITIONAL_SCENARIO','NOT_RELEASED','ROLL_UP_TO_SYSTEM_A1','OPEN','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B12','reference_qty',124,'reference_basis','Conditional scenario only; not released.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B13','Beacon glands and stopping plugs','BULK','SYSTEM_DEDICATED','GLAND_STOPPING_PLUG',NULL,'pc','OEM_CLARIFICATION','NOT_RELEASED','ROLL_UP_TO_SYSTEM_A1','OPEN','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B13','reference_qty',NULL,'reference_basis','Verify supplied fittings and actual entries.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B14','Digital Ex station glands','BULK','SYSTEM_DEDICATED','GLAND',NULL,'pc','VERIFY_SUPPLIED_SET','NOT_RELEASED','ROLL_UP_TO_SYSTEM_A1','OPEN','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B14','reference_qty',NULL,'reference_basis','Verify assembly and armour compatibility.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B15','Field mounting materials','BULK','SYSTEM_DEDICATED','MOUNTING_SUPPORT',NULL,'set','MEASURE_BY_MOUNTING_TYPE','NOT_RELEASED','ROLL_UP_TO_SYSTEM_A1','OPEN','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B15','reference_qty',NULL,'reference_basis','Layout-dependent site mounting materials.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B16','Cabinet installation materials','BULK','SYSTEM_DEDICATED','CABINET_INSTALL_ACCESSORY',NULL,'cabinet','QUOTED_ASSEMBLY_COUNT','NOT_RELEASED','ROLL_UP_TO_SYSTEM_A1','PARTIAL','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B16','reference_qty',7,'reference_basis','2 floor + 5 wall cabinets; approved GA required.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B17','UPS feeds / beacon power / protection','BULK','SYSTEM_DEDICATED','POWER_DISTRIBUTION_ACCESSORY',NULL,'circuit','ELECTRICAL_INTERFACE','NOT_RELEASED','ROLL_UP_TO_SYSTEM_A1','OPEN','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B17','reference_qty',NULL,'reference_basis','Power/load/autonomy interface open.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B18','Earthing / containment / sealing','BULK','TBC','EARTHING_CONTAINMENT',NULL,'lot','BREAK_DOWN_BEFORE_RFQ','NOT_RELEASED','TBC','OPEN','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B18','reference_qty',NULL,'reference_basis','Dedicated versus shared route allocation open.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B19','SS316 nameplates and cable markers','BULK','SYSTEM_DEDICATED','NAMEPLATE_LABEL',NULL,'pc','DERIVE_FROM_TAG_REGISTER','NOT_RELEASED','ROLL_UP_TO_SYSTEM_A1','OPEN','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B19','reference_qty',NULL,'reference_basis','Derive from actual asset/cable identities.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B20','OEM speaker connection kits','ACCESSORY','TBC','OEM_CONNECTION_KIT',NULL,'kit','INCLUSION_CHECK_FIRST','NOT_RELEASED','TBC','OPEN','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B20','reference_qty',NULL,'reference_basis','Reconcile cabinet BOM before adding.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B21','Monitored beacon circuit completion','ACCESSORY','SYSTEM_DEDICATED','BEACON_CONTROL_COMPLETION',NULL,'set','OEM_GAP_QUOTATION','NOT_RELEASED','ROLL_UP_TO_SYSTEM_A1','OPEN','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B21','reference_qty',NULL,'reference_basis','XBC/licence/terminal completion subject to proof.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_required_mto
(project_id,system_id,mto_code,description,object_class,ownership_class,material_family,required_qty,unit,quantity_status,release_status,commercial_treatment,commercial_mapping_state,vendor_inclusion_state,metadata_json)
SELECT p.id,s.id,'PAGA-B22','System completion options','ACCESSORY','TBC','SYSTEM_COMPLETION_OPTION',NULL,'set','OEM_GAP_QUOTATION','NOT_RELEASED','TBC','OPEN','TBC',JSON_OBJECT('source_workbook','PJ2608-0550_PAGA_Bulk-Pilot_Rev00.xlsx','source_row','B22','reference_qty',NULL,'reference_basis','Engineering proof determines required options.','reference_only',1)
FROM etm_projects p
JOIN etm_systems s ON s.project_id=p.id AND s.system_code='TEL-PAGA'
WHERE p.project_code='PJ2608-0550'
ON DUPLICATE KEY UPDATE
 description=VALUES(description),
 object_class=VALUES(object_class),
 ownership_class=VALUES(ownership_class),
 material_family=VALUES(material_family),
 unit=VALUES(unit),
 quantity_status=VALUES(quantity_status),
 release_status=VALUES(release_status),
 commercial_treatment=VALUES(commercial_treatment),
 commercial_mapping_state=VALUES(commercial_mapping_state),
 metadata_json=VALUES(metadata_json);
