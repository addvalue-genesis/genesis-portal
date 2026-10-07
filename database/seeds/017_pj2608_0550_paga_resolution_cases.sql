SET NAMES utf8mb4;

-- PJ2608-0550 PAGA current requirement-resolution cases.
-- These are not answers. They are controlled OPEN research jobs derived from known gaps.
-- Internal search must run before external authority search.

SET @p=(SELECT id FROM etm_projects WHERE project_code='PJ2608-0550');

INSERT INTO etm_requirement_resolution_cases
(project_id,requirement_id,case_code,blocking_stage,problem_statement,resolution_status,internal_search_status,external_search_status,recommended_action,metadata_json)
SELECT @p,r.id,'RES-REQ-PAGA-001-INPUT','ENGINEERING_INPUT',
 'Ambient noise / room geometry / speaker mounting inputs are not fully controlled for final audible-coverage proof.',
 'OPEN','NOT_STARTED','NOT_STARTED',
 'Search 0550 MR/PHI/BOD/SPE/STD/DWG/LAY/survey and approved vendor evidence first. If insufficient, use applicable acoustic/OEM/recognised engineering references to propose a preliminary basis and keep OEM/project confirmation open.',
 JSON_OBJECT('origin','CONTROLLED_GAP','autoApply',false)
FROM etm_requirements r WHERE r.project_id=@p AND r.requirement_code='REQ-PAGA-001'
UNION ALL
SELECT @p,r.id,'RES-REQ-PAGA-002-ALARM','ENGINEERING_INPUT',
 'Ambient-noise / hazardous-location / beacon-visibility inputs are incomplete for final alarm/beacon applicability.',
 'OPEN','NOT_STARTED','NOT_STARTED',
 'Search current project acoustic/area-classification/layout evidence first, then applicable standard/OEM guidance if project evidence is insufficient.',
 JSON_OBJECT('origin','CONTROLLED_GAP','autoApply',false)
FROM etm_requirements r WHERE r.project_id=@p AND r.requirement_code='REQ-PAGA-002'
UNION ALL
SELECT @p,r.id,'RES-REQ-PAGA-003-LOAD','CAL_STUDY_RPT',
 'Amplifier loading and N+1 proof remains partial because final speaker tap / loop allocation is not released.',
 'OPEN','NOT_STARTED','NOT_STARTED',
 'Resolve controlled speaker/loop inputs, run the bound PAGA loading equation and compare against vendor capability; do not adopt offered quantity as required quantity.',
 JSON_OBJECT('origin','CONTROLLED_GAP','autoApply',false)
FROM etm_requirements r WHERE r.project_id=@p AND r.requirement_code='REQ-PAGA-003'
UNION ALL
SELECT @p,r.id,'RES-REQ-PAGA-004-TOPOLOGY','INTERFACE_CONTEXT',
 'Final loop topology / cable route / cable identity is not controlled and source drawing references conflict.',
 'OPEN','NOT_STARTED','NOT_STARTED',
 'Reconcile current DWG/LIS/MTO/project drawing references and vendor topology first. If unresolved, create an explicit source-conflict disposition before calculation/release.',
 JSON_OBJECT('origin','CONTROLLED_GAP','autoApply',false)
FROM etm_requirements r WHERE r.project_id=@p AND r.requirement_code='REQ-PAGA-004'
UNION ALL
SELECT @p,r.id,'RES-REQ-PAGA-005-UPS','ENGINEERING_INPUT',
 'UPS/autonomy proof is open because final node load, autonomy and battery/efficiency parameters are incomplete.',
 'OPEN','NOT_STARTED','NOT_STARTED',
 'Search project UPS/autonomy requirements and vendor load data first; if sizing inputs remain absent, use applicable OEM/engineering method only as a preliminary basis with explicit closure actions.',
 JSON_OBJECT('origin','CONTROLLED_GAP','autoApply',false)
FROM etm_requirements r WHERE r.project_id=@p AND r.requirement_code='REQ-PAGA-005'
UNION ALL
SELECT @p,r.id,'RES-REQ-PAGA-006-INTERFACE','INTERFACE_CONTEXT',
 'Fire & Gas / PABX / Entertainment interface list, signal/protocol and responsibility boundary are not fully closed.',
 'OPEN','NOT_STARTED','NOT_STARTED',
 'Search PHI/BOD/SPE/cause-and-effect/interface drawings and approved TC/TQ first; derive exact interface objects only after controlled edge evidence exists.',
 JSON_OBJECT('origin','CONTROLLED_GAP','autoApply',false)
FROM etm_requirements r WHERE r.project_id=@p AND r.requirement_code='REQ-PAGA-006'
UNION ALL
SELECT @p,r.id,'RES-REQ-PAGA-007-LIFECYCLE','FAT_IFAT',
 'FAT/IFAT/SAT/commissioning responsibility and event/resource boundaries are not fully closed.',
 'OPEN','NOT_STARTED','NOT_STARTED',
 'Reconcile MR/SPE lifecycle obligations with selected vendor service quote and warranty conditions; create complementary role assignments and avoid duplicate event/trip cost.',
 JSON_OBJECT('origin','CONTROLLED_GAP','autoApply',false)
FROM etm_requirements r WHERE r.project_id=@p AND r.requirement_code='REQ-PAGA-007'
ON DUPLICATE KEY UPDATE
 blocking_stage=VALUES(blocking_stage),
 problem_statement=VALUES(problem_statement),
 recommended_action=VALUES(recommended_action),
 metadata_json=VALUES(metadata_json);
