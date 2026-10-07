SET NAMES utf8mb4;

-- PJ2608-0550 PAGA requirement threads + particular equation bindings.
-- Migrates the existing controlled JS pilot into canonical DB objects.
-- Requires migrations 001, 008, 010 and 015.

SET @p=(SELECT id FROM etm_projects WHERE project_code='PJ2608-0550');
SET @s=(SELECT id FROM etm_systems WHERE project_id=@p AND system_code='PAGA' LIMIT 1);

INSERT INTO etm_requirements
(project_id,system_id,requirement_code,requirement_type,requirement_text,status,priority,metadata_json)
VALUES
(@p,@s,'REQ-PAGA-001','PERFORMANCE',
 'Speech level shall satisfy the project PAGA audibility criteria at required occupied locations.',
 'PARTIAL','HIGH',
 JSON_OBJECT(
   'title','Audible speech coverage',
   'sources',JSON_ARRAY('SPE-0004-B1','STD-TEL-007'),
   'constraints',JSON_ARRAY('Minimum 65 dBA','When ambient < 85 dBA, speech target is at least ambient +10 dB and not more than ambient +20 dB'),
   'proof',JSON_ARRAY('PAGA-SDY-COVER-001','RPT-0005'),
   'objects',JSON_ARRAY('Speaker type','Speaker quantity','Speaker tap','Location/layout'),
   'drives',JSON_ARRAY('Required speaker quantity','Speaker tap/load','Cable route','Installation/test work'),
   'fundamentalNeed','People in occupied areas must hear and understand public-address speech.',
   'interfaceContext',JSON_ARRAY('Occupied location / room','Ambient acoustic environment','Speaker-to-listener geometry'),
   'engineeringInputs',JSON_ARRAY('Ambient noise','Geometry','Speaker acoustic data','Mounting/location'),
   'architecture','Coverage-driven speaker layout; final arrangement remains proof-driven.',
   'requiredMtoState','Speaker type / qty / tap / mount = TBC until coverage proof closes.'
 )),
(@p,@s,'REQ-PAGA-002','PERFORMANCE',
 'Alarm tones and visual warning shall meet the project ambient-noise criterion.',
 'PARTIAL','HIGH',
 JSON_OBJECT(
   'title','Alarm audibility and visual alarm',
   'sources',JSON_ARRAY('SPE-0004-B1','STD-TEL-007'),
   'constraints',JSON_ARRAY('Alarm tone >= ambient +6 dB','Flashing beacon supplements audible alarm where ambient >=85 dBA'),
   'proof',JSON_ARRAY('PAGA-SDY-COVER-001','RPT-0005'),
   'objects',JSON_ARRAY('Speakers','Beacons','Beacon monitoring/control'),
   'drives',JSON_ARRAY('Beacon quantity','Beacon controller / monitored circuits','Hazardous-area device class'),
   'fundamentalNeed','Personnel must reliably perceive emergency alarm notification.',
   'interfaceContext',JSON_ARRAY('Ambient noise','Occupied/hazardous location','Beacon circuit monitoring'),
   'engineeringInputs',JSON_ARRAY('Ambient noise','Area classification','Beacon visibility/location basis'),
   'architecture','Audible alarm plus beacon supplementation where required.',
   'requiredMtoState','Beacon / monitored circuit / controller qty = proof- and location-driven.'
 )),
(@p,@s,'REQ-PAGA-003','DESIGN',
 'Remote amplifier architecture shall satisfy loading and N+1 requirements.',
 'PARTIAL','HIGH',
 JSON_OBJECT(
   'title','Amplifier loading and redundancy',
   'sources',JSON_ARRAY('SPE-0004-B1','IND-NPA-DAT'),
   'constraints',JSON_ARRAY('Amplifier nominal output within required project/vendor capability','Total connected loading <=80% of nominal','Remote amplifier units at each building N+1'),
   'proof',JSON_ARRAY('PAGA-CAL-AMP-001'),
   'objects',JSON_ARRAY('Remote amplifier','Active amplifier','Standby amplifier','Speaker circuits / loops'),
   'drives',JSON_ARRAY('Amplifier quantity','Cabinet quantity','Power demand','Heat/load','Cost'),
   'fundamentalNeed','Speaker load must be driven with sufficient capacity and required redundancy.',
   'interfaceContext',JSON_ARRAY('Speaker loops/circuits','Remote building node','Power/network/cabinet boundary'),
   'engineeringInputs',JSON_ARRAY('Speaker qty','Tap','Loop allocation','Amplifier nominal output'),
   'architecture','Active + standby remote amplifier arrangement by building.',
   'requiredMtoState','Amplifier and cabinet qty = TBC until load/topology proof closes.'
 )),
(@p,@s,'REQ-PAGA-004','DESIGN',
 'Speaker circuits / loops and cable shall support the required acoustic load within acceptable electrical loss and topology constraints.',
 'OPEN','HIGH',
 JSON_OBJECT(
   'title','Loop / cable loss and topology',
   'sources',JSON_ARRAY('SPE-0004-B1','DWG-PAGA-BLD'),
   'constraints',JSON_ARRAY('Final loop topology must come from controlled drawing / design','Current cable size/type and route length remain TBC'),
   'proof',JSON_ARRAY('PAGA-CAL-LOSS-001','SOURCE-RECON-001'),
   'objects',JSON_ARRAY('Cable','JB / termination','Loop / circuit','Cabinet I/O'),
   'drives',JSON_ARRAY('Cable quantity','Bulk/JB quantity','Loss margin','Installation MH'),
   'fundamentalNeed','Electrical distribution must deliver required speaker power within acceptable loss.',
   'interfaceContext',JSON_ARRAY('Cabinet-field route','Loop topology','JB/termination/cable-entry boundary'),
   'engineeringInputs',JSON_ARRAY('Loop load','Cable route/length','Cable material/area','100 V line','Final topology'),
   'architecture','Loop/circuit architecture preliminary while drawing/topology conflict is open.',
   'requiredMtoState','Cable/JB/termination/loop qty remain TBC.'
 )),
(@p,@s,'REQ-PAGA-005','DESIGN',
 'Complete PAGA package power engineering shall be compatible with project UPS supply and required autonomy.',
 'OPEN','HIGH',
 JSON_OBJECT(
   'title','Power / UPS autonomy',
   'sources',JSON_ARRAY('SPE-0004-B1','PHI-0001-PAGA','BOD-0001-PAGA'),
   'constraints',JSON_ARRAY('APF 230 VAC UPS basis','Final autonomy duration / efficiency / battery sizing inputs must be controlled before release'),
   'proof',JSON_ARRAY('PAGA-CAL-UPS-001'),
   'objects',JSON_ARRAY('Power supply','UPS load','Battery / autonomy provision','Distribution'),
   'drives',JSON_ARRAY('Power load','Battery/autonomy capacity','Cabinet/power accessories','Cost'),
   'fundamentalNeed','PAGA must remain powered for the required operating/emergency duration.',
   'interfaceContext',JSON_ARRAY('230 VAC UPS','PAGA node loads','Distribution/protection boundary'),
   'engineeringInputs',JSON_ARRAY('Node load','Autonomy','Efficiency/reserve','Battery/UPS parameters'),
   'architecture','UPS-fed package architecture; final storage provision remains input-driven.',
   'requiredMtoState','Power supply / UPS accessory / battery-autonomy provision = TBC.'
 )),
(@p,@s,'REQ-PAGA-006','INTERFACE',
 'PAGA shall implement required interfaces and priority logic with adjacent systems.',
 'PARTIAL','HIGH',
 JSON_OBJECT(
   'title','System interfaces',
   'sources',JSON_ARRAY('PHI-0001-PAGA','SPE-0004-B1','BOD-0001-PAGA'),
   'constraints',JSON_ARRAY('Fire & Gas alarm/tone trigger','IP Telephony/PABX broadcast interface','Entertainment mute / priority interface'),
   'proof',JSON_ARRAY('PAGA-SDY-IF-001'),
   'objects',JSON_ARRAY('I/O','Network interface','Gateway / protocol','Cause & effect / priority logic'),
   'drives',JSON_ARRAY('Integration MH','Interface hardware','IFAT/SAT test cases','VDRL'),
   'fundamentalNeed','PAGA must exchange triggers/status and enforce required priority with adjacent systems.',
   'interfaceContext',JSON_ARRAY('Fire & Gas','PABX','Entertainment','Protocol/I/O boundary'),
   'engineeringInputs',JSON_ARRAY('Interface list','Signal/protocol','Cause & effect','Responsibility boundary'),
   'architecture','Interface architecture partial; exact I/O/protocol/gateway remains open.',
   'requiredMtoState','I/O / gateway / license / accessories derive from controlled interface graph.'
 )),
(@p,@s,'REQ-PAGA-007','LIFECYCLE',
 'PAGA lifecycle shall include required engineering documentation and acceptance testing.',
 'PARTIAL','HIGH',
 JSON_OBJECT(
   'title','Lifecycle verification',
   'sources',JSON_ARRAY('MR-0001-A1','SPE-0004-B1'),
   'constraints',JSON_ARRAY('FAT required','IFAT required','SAT required'),
   'proof',JSON_ARRAY('PAGA-TEST-001'),
   'objects',JSON_ARRAY('FAT procedure/report','IFAT procedure/report','SAT procedure/report','Punch/closeout'),
   'drives',JSON_ARRAY('Engineering MH','Vendor coordination','Travel/event workload','B1/B4 cost'),
   'fundamentalNeed','System must be engineered, verified, accepted, handed over and supportable.',
   'interfaceContext',JSON_ARRAY('Vendor/TSI/EPC/Company boundary','Factory/site event grouping','Document workflow'),
   'engineeringInputs',JSON_ARRAY('VDRL','Review cycles','Test cases','Witness points','Crew/duration/travel grouping'),
   'architecture','Lifecycle = documents + FAT/IFAT + site integration/SAT/commissioning + handover/warranty.',
   'requiredMtoState','Creates document/test/work objects and B1/B3/B4 drivers; not a pure equipment MTO.'
 ))
ON DUPLICATE KEY UPDATE
 requirement_type=VALUES(requirement_type),
 requirement_text=VALUES(requirement_text),
 status=VALUES(status),
 priority=VALUES(priority),
 metadata_json=VALUES(metadata_json),
 is_current=1;

INSERT INTO etm_equation_registry
(equation_code,equation_layer,equation_domain,equation_name,expression_text,model_class,evidence_basis,grounding_class,calibration_state,control_status,method_source,method_revision,control_note)
VALUES
('PAGA-CAL-COVER-001','PARTICULAR_BINDING','PAGA_ACOUSTIC','PAGA acoustic target / beacon applicability',
 'L_speech,target = max(65, L_ambient + 10); L_alarm,target = L_ambient + 6; I_beacon = 1 when L_ambient >= 85 dBA',
 'PROJECT_PARTICULAR_ENGINEERING','SPE-0004-B1 + STD-TEL-007','PROJECT_REQUIREMENT / STANDARD','INPUT_REQUIRED',
 'CONTROLLED_WORKING_BASELINE','PJ2608-0550-PAGA','Rev00','Existing controlled PAGA particular equation migrated from JS pilot.'),
('PAGA-CAL-AMP-001','PARTICULAR_BINDING','PAGA_LOADING','PAGA amplifier loading / redundancy',
 'P_load = SUM(q_speaker * tap_W); P_allowable = 0.80 * P_amp,nominal; require P_load <= P_allowable; N_amp = N_required + N+1 redundancy',
 'PROJECT_PARTICULAR_ENGINEERING','SPE-0004-B1 + IND-NPA-DAT','PROJECT_REQUIREMENT / OEM_DATA','INPUT_REQUIRED',
 'CONTROLLED_WORKING_BASELINE','PJ2608-0550-PAGA','Rev00','Existing controlled PAGA particular equation migrated from JS pilot.'),
('PAGA-CAL-LOSS-001','PARTICULAR_BINDING','PAGA_CABLE_LOSS','PAGA speaker-loop cable loss',
 'I_loop = P_load / V_line; R_loop = 2 * L * rho / A; P_loss = I_loop^2 * R_loop',
 'PROJECT_PARTICULAR_ENGINEERING','SPE-0004-B1 + DWG-PAGA-BLD','FIRST_PRINCIPLE / PROJECT_BINDING','INPUT_REQUIRED',
 'CONTROLLED_WORKING_BASELINE','PJ2608-0550-PAGA','Rev00','Existing controlled PAGA particular equation migrated from JS pilot.'),
('PAGA-CAL-UPS-001','PARTICULAR_BINDING','PAGA_POWER','PAGA UPS energy / autonomy basis',
 'E_required,ideal = P_node * t_autonomy; detailed battery sizing requires controlled efficiency / reserve / battery parameters',
 'PROJECT_PARTICULAR_ENGINEERING','SPE-0004-B1 + BOD-0001-PAGA','FIRST_PRINCIPLE / PROJECT_BINDING','INPUT_REQUIRED',
 'CONTROLLED_WORKING_BASELINE','PJ2608-0550-PAGA','Rev00','Existing controlled PAGA particular equation migrated from JS pilot.')
ON DUPLICATE KEY UPDATE
 equation_layer=VALUES(equation_layer),equation_domain=VALUES(equation_domain),
 equation_name=VALUES(equation_name),expression_text=VALUES(expression_text),
 model_class=VALUES(model_class),evidence_basis=VALUES(evidence_basis),
 grounding_class=VALUES(grounding_class),calibration_state=VALUES(calibration_state),
 control_status=VALUES(control_status),method_source=VALUES(method_source),
 method_revision=VALUES(method_revision),control_note=VALUES(control_note);

-- Bind reusable/common and particular equations to requirement instances.
INSERT INTO etm_equation_bindings
(project_id,equation_id,system_id,requirement_id,binding_code,binding_name,binding_role,input_state,source_refs_json,output_object_type,output_object_ref,binding_status)
SELECT @p,er.id,@s,r.id,
 CONCAT('BIND-',r.requirement_code,'-',er.equation_code),
 CONCAT(r.requirement_code,' -> ',er.equation_code),
 CASE
   WHEN er.equation_code LIKE 'PAGA-CAL-%' THEN 'PROOF_METHOD'
   WHEN er.equation_code='GEQ-004' THEN 'QUANTITY_DRIVER'
   WHEN er.equation_code IN ('GEQ-005','GEQ-009','GEQ-024','GEQ-025') THEN 'WORKLOAD_DRIVER'
   ELSE 'REQUIREMENT_DRIVER'
 END,
 CASE WHEN r.status='OPEN' THEN 'OPEN' ELSE 'PARTIAL' END,
 JSON_EXTRACT(r.metadata_json,'$.sources'),
 'REQUIREMENT_THREAD',r.requirement_code,'WORKING'
FROM etm_requirements r
JOIN etm_equation_registry er
  ON er.equation_code IN (
    CASE r.requirement_code
      WHEN 'REQ-PAGA-001' THEN 'PAGA-CAL-COVER-001'
      WHEN 'REQ-PAGA-002' THEN 'PAGA-CAL-COVER-001'
      WHEN 'REQ-PAGA-003' THEN 'PAGA-CAL-AMP-001'
      WHEN 'REQ-PAGA-004' THEN 'PAGA-CAL-LOSS-001'
      WHEN 'REQ-PAGA-005' THEN 'PAGA-CAL-UPS-001'
      WHEN 'REQ-PAGA-006' THEN 'GEQ-025'
      WHEN 'REQ-PAGA-007' THEN 'GEQ-005'
    END,
    'GEQ-004'
  )
WHERE r.project_id=@p AND r.requirement_code LIKE 'REQ-PAGA-%'
ON DUPLICATE KEY UPDATE
 input_state=VALUES(input_state),
 source_refs_json=VALUES(source_refs_json),
 binding_status=VALUES(binding_status);
