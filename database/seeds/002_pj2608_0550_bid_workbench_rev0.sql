SET @p=(SELECT id FROM etm_projects WHERE project_code='PJ2608-0550');
SET @s=(SELECT id FROM etm_systems WHERE project_id=@p AND system_code='PAGA');
SET @cat=(SELECT id FROM etm_locations WHERE project_id=@p AND location_code='APF-CATERING');

INSERT INTO etm_workbench_objectives
(project_id,system_id,location_id,objective_code,objective_text,current_focus,current_stage,next_gate,status)
VALUES
(@p,@s,@cat,'PAGA-BID-OBJ-001',
 'ทำราคา PAGA ให้ครบ scope และลดความเสี่ยงต้นทุนตกหล่นก่อน freeze ราคาเสนอ',
 'Catering Building',
 'Engineering Proof',
 'Close critical inputs -> release Required MTO -> price equipment / bulk / work / lifecycle',
 'ACTIVE')
ON DUPLICATE KEY UPDATE
 objective_text=VALUES(objective_text),
 current_focus=VALUES(current_focus),
 current_stage=VALUES(current_stage),
 next_gate=VALUES(next_gate);

INSERT INTO etm_input_requests
(project_id,system_id,location_id,request_code,requested_from,item_name,reason_text,impact_text,priority,status)
VALUES
(@p,@s,@cat,'PAGA-CAT-IN-001','USER','Ambient Noise / Noise Study',
 'ใช้ปิด Sound Coverage, speaker tap และ beacon requirement',
 'Blocks final speaker tap / beacon decision','HIGH','OPEN'),
(@p,@s,@cat,'PAGA-CAT-IN-002','USER','Latest Catering Geometry / Layout',
 'ใช้ยืนยัน coverage, listener distance และตำแหน่ง speaker',
 'Blocks final coverage result','HIGH','OPEN'),
(@p,@s,@cat,'PAGA-CAT-IN-003','CLIENT','Current APF Cable Schedule',
 'ใช้คำนวณ loop loss และ bulk cable',
 'Blocks loop-loss calculation and bulk cable quantity','HIGH','OPEN'),
(@p,@s,@cat,'PAGA-CAT-IN-004','VENDOR','Final Loop Topology',
 'ใช้ยืนยัน 2-loop hypothesis ก่อน freeze loop load / cable',
 'Blocks final loop assignment and cable release','HIGH','OPEN')
ON DUPLICATE KEY UPDATE
 reason_text=VALUES(reason_text),
 impact_text=VALUES(impact_text),
 priority=VALUES(priority),
 status=VALUES(status);

INSERT INTO etm_action_queue
(project_id,system_id,location_id,action_code,action_owner,action_type,action_text,priority,status)
VALUES
(@p,@s,@cat,'PAGA-CAT-ACT-001','CHATGPT','TRACE_REQUIREMENTS',
 'Trace requirements to MR / SPE / PHI / BOD / STD / TC and keep source locator/evidence state.','HIGH','READY'),
(@p,@s,@cat,'PAGA-CAT-ACT-002','CHATGPT','PRELIM_CAL',
 'Run preliminary CAL from controlled inputs and version the calculation result.','HIGH','READY'),
(@p,@s,@cat,'PAGA-CAT-ACT-003','CHATGPT','VENDOR_RECON',
 'Reconcile Required MTO against INDUSTRONIC offered BOM, datasheet and deviation.','HIGH','READY'),
(@p,@s,@cat,'PAGA-CAT-ACT-004','CHATGPT','VDRL_MH_MODEL',
 'Build VDRL, workload, lifecycle and cost structure while preserving TBC as non-zero scope.','MEDIUM','READY'),
(@p,@s,@cat,'PAGA-CAT-ACT-005','CHATGPT','FINAL_RELEASE',
 'Freeze final coverage, cable loss and Required MTO only after critical engineering inputs are controlled.','HIGH','WAITING_INPUT')
ON DUPLICATE KEY UPDATE
 action_text=VALUES(action_text),
 priority=VALUES(priority),
 status=VALUES(status);

INSERT INTO etm_quote_readiness
(project_id,system_id,location_id,readiness_code,dimension_name,readiness_status,basis_text,blocker_count)
VALUES
(@p,@s,@cat,'PAGA-CAT-QR-ENG','Engineering Basis','PARTIAL',
 'Source/criteria available; coverage, cable loss and UPS proof not closed.',3),
(@p,@s,@cat,'PAGA-CAT-QR-MTO','Required MTO','NOT_READY',
 'Speaker, beacon, cable and interface quantities remain proof-driven.',4),
(@p,@s,@cat,'PAGA-CAT-QR-VENDOR','Vendor / Pricing','PARTIAL',
 'INDUSTRONIC offer available; Required-vs-Offered reconciliation is not final.',2),
(@p,@s,@cat,'PAGA-CAT-QR-BULK','Bulk','OPEN',
 'Cable/JB/termination drivers not frozen.',3),
(@p,@s,@cat,'PAGA-CAT-QR-VDRL','VDRL / Manhour','PARTIAL',
 'Document/work structure ready; controlled UMH/rates and final deliverable workload remain open.',2),
(@p,@s,@cat,'PAGA-CAT-QR-LIFE','Lifecycle Cost','TBC',
 'FAT/IFAT/logistics/site/pre-com/start-up/commissioning/SAT resource basis not priced.',6),
(@p,@s,@cat,'PAGA-CAT-QR-SPARES','Spares / Tools','TBC',
 'Start-up, commissioning, two-year spares and tools require quantity basis.',4),
(@p,@s,@cat,'PAGA-CAT-QR-PRICE','Commercial Price','NOT_READY',
 'Selling price requires controlled cost basis plus approved pricing policy / margin or markup.',5)
ON DUPLICATE KEY UPDATE
 readiness_status=VALUES(readiness_status),
 basis_text=VALUES(basis_text),
 blocker_count=VALUES(blocker_count),
 evaluated_at=CURRENT_TIMESTAMP;
