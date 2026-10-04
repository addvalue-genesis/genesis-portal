INSERT INTO etm_projects(project_code,project_name)
VALUES('PJ2608-0550','SAM PTTEPI MY ASK TEL [MMC24-5002]')
ON DUPLICATE KEY UPDATE project_name=VALUES(project_name);

SET @p=(SELECT id FROM etm_projects WHERE project_code='PJ2608-0550');

INSERT INTO etm_systems(project_id,system_code,system_name)
VALUES(@p,'PAGA','Public Address and General Alarm')
ON DUPLICATE KEY UPDATE system_name=VALUES(system_name);

SET @s=(SELECT id FROM etm_systems WHERE project_id=@p AND system_code='PAGA');

INSERT INTO etm_locations(project_id,location_code,location_name,location_type) VALUES
(@p,'APF-CATERING','Catering Building','BUILDING'),
(@p,'APF-ACCOMMODATION','Accommodation Building','BUILDING'),
(@p,'APF-FIRE-SAFETY','Fire/Safety Building','BUILDING'),
(@p,'APF-CONTROL','Control Building','BUILDING')
ON DUPLICATE KEY UPDATE location_name=VALUES(location_name);

INSERT INTO etm_lifecycle_stages(stage_code,stage_name,sequence_no,stage_group,cost_category) VALUES
('ENGINEERING','Engineering',10,'ENGINEERING','ENGINEERING'),
('PROCUREMENT','Procurement',20,'SUPPLY','EQUIPMENT'),
('FAB_INTEGRATION','Fabrication / Integration',30,'SUPPLY','FABRICATION'),
('FAT','Factory Acceptance Test',40,'TEST','FAT_IFAT'),
('IFAT','Integrated Factory Acceptance Test',50,'TEST','FAT_IFAT'),
('PACK_LOGISTICS','Packing / Logistics',60,'LOGISTICS','LOGISTICS'),
('INSTALLATION','Site Installation',70,'SITE','INSTALLATION'),
('PRECOM','Pre-Commissioning',80,'SITE','PRECOM'),
('STARTUP','Start-up',90,'SITE','STARTUP'),
('COMMISSIONING','Commissioning',100,'SITE','COMMISSIONING'),
('TRAINING','Training',110,'SITE','TRAINING'),
('SAT','Site Acceptance Test',120,'TEST','SAT_ISAT'),
('ISAT','Integrated Site Acceptance Test',130,'TEST','SAT_ISAT'),
('PUNCH_CLOSEOUT','Punch / Closeout',140,'CLOSEOUT','CLOSEOUT'),
('WARRANTY_SUPPORT','Warranty / Support',150,'AFTERSALES','WARRANTY_SUPPORT')
ON DUPLICATE KEY UPDATE stage_name=VALUES(stage_name),sequence_no=VALUES(sequence_no);

INSERT INTO etm_roles(role_code,role_name,discipline) VALUES
('PM','Project Manager','PROJECT'),
('LEAD_TEL','Lead Telecom Engineer','TELECOM'),
('SYS_ENG','System Engineer','TELECOM'),
('CAD','CAD / Designer','ENGINEERING'),
('DOC_CTRL','Document Controller','DOCUMENT'),
('QAQC','QA/QC Engineer','QAQC'),
('TECH','Technician','SITE'),
('SUPERVISOR','Site Supervisor','SITE'),
('COM_ENG','Commissioning Engineer','COMMISSIONING')
ON DUPLICATE KEY UPDATE role_name=VALUES(role_name);

INSERT INTO etm_formulas(project_id,formula_code,formula_name,formula_version,expression_text,output_unit) VALUES
(@p,'WORK_MH','Activity Manhour','1.0','Q * UMH','MH'),
(@p,'LABOR_COST','Labor Cost','1.0','MH * RATE','CURRENCY'),
(@p,'DOC_MH','Document Workload','1.0','MH_BASE + REVIEW_CYCLES * MH_PER_REVIEW + MH_FINAL','MH'),
(@p,'PAGA_LOOP_LOAD','PAGA Speaker Loop Load','1.0','SUM(TAP_W)','W'),
(@p,'PAGA_AMP_ALLOWED','PAGA Allowed Amplifier Load','1.0','AMP_NOMINAL_W * MAX_LOADING_FACTOR','W'),
(@p,'PAGA_AMP_ACTIVE_COUNT','PAGA Active Amplifier Count','1.0','CEIL(REQUIRED_LOAD_W / ALLOWED_LOAD_W)','EA'),
(@p,'PAGA_FREE_FIELD_SPL','PAGA Free-field SPL Screening','1.0','SPL_1W_1M + 10*LOG10(TAP_W) - 20*LOG10(DISTANCE_M)','dBA'),
(@p,'PAGA_SPEECH_TARGET_MIN','PAGA Minimum Speech Target','1.0','MAX(65,AMBIENT_DBA + 10)','dBA'),
(@p,'PAGA_BEACON_REQUIRED','PAGA Beacon Requirement','1.0','IF(AMBIENT_DBA >= 85,1,0)','BOOLEAN')
ON DUPLICATE KEY UPDATE expression_text=VALUES(expression_text);

SET @cat=(SELECT id FROM etm_locations WHERE project_id=@p AND location_code='APF-CATERING');

INSERT INTO etm_proof_objects(project_id,system_id,location_id,proof_code,proof_type,proof_name,input_status,result_status,release_gate_status,evidence_class) VALUES
(@p,@s,@cat,'PAGA-SDY-COVER-001','SDY','PAGA Sound Coverage / SNR Study','INCOMPLETE','OPEN','NOT_RELEASED','C'),
(@p,@s,@cat,'PAGA-CAL-LOAD-001','CAL','Speaker Tap & Loop Load Calculation','PARTIAL','PRELIMINARY','NOT_RELEASED','B'),
(@p,@s,@cat,'PAGA-CAL-AMP-001','CAL','Amplifier Sizing / Loading Calculation','PARTIAL','PRELIMINARY','NOT_RELEASED','B'),
(@p,@s,@cat,'PAGA-CAL-LOSS-001','CAL','Speaker Loop Cable Loss Calculation','BLOCKED','OPEN','NOT_RELEASED','C'),
(@p,@s,@cat,'PAGA-CAL-UPS-001','CAL','PAGA UPS / Autonomy Calculation','INCOMPLETE','OPEN','NOT_RELEASED','C')
ON DUPLICATE KEY UPDATE proof_name=VALUES(proof_name),input_status=VALUES(input_status);

INSERT INTO etm_documents(project_id,document_no,title,document_type,issue_status)
VALUES(@p,'MM-ASK-1A-APF-TEL-RPT-0005','PAGA Sound Coverage Study Report','RPT','NOT_YET_PRODUCED')
ON DUPLICATE KEY UPDATE title=VALUES(title),document_type=VALUES(document_type);

INSERT INTO etm_vendors(vendor_code,vendor_name,manufacturer_flag,avl_status)
VALUES('INDUSTRONIC','INDUSTRONIC',1,'CURRENT_0550_APPROVAL_OPEN')
ON DUPLICATE KEY UPDATE vendor_name=VALUES(vendor_name);

INSERT INTO etm_spare_requirements(project_id,system_id,spare_code,spare_type,description,cost_status) VALUES
(@p,@s,'PAGA-SPR-STARTUP-001','STARTUP','PAGA start-up spares - quantity and basis to be derived from project/vendor requirements','TBC'),
(@p,@s,'PAGA-SPR-COMM-001','COMMISSIONING','PAGA commissioning spares - quantity and basis to be derived from project/vendor requirements','TBC'),
(@p,@s,'PAGA-SPR-2YR-001','TWO_YEAR','PAGA two-year operational spares - quantity and basis to be derived from project/vendor requirements','TBC'),
(@p,@s,'PAGA-TOOL-001','SPECIAL_TOOL','PAGA special tools / service / commissioning tools','TBC')
ON DUPLICATE KEY UPDATE description=VALUES(description);

INSERT INTO etm_document_templates(template_code,template_name,template_type,output_formats)
VALUES
('PTTEP-RPT','PTTEP Engineering Report Template','RPT','DOCX,PDF'),
('PTTEP-CAL','PTTEP Calculation Note Template','CAL','DOCX,PDF,XLSX'),
('PTTEP-SDY','PTTEP Engineering Study Template','SDY','DOCX,PDF'),
('PTTEP-VDRL','PTTEP VDRL Register Template','VDRL','XLSX,PDF')
ON DUPLICATE KEY UPDATE template_name=VALUES(template_name),output_formats=VALUES(output_formats);
