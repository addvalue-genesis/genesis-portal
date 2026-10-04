INSERT INTO etm_roles(role_code,role_name,role_description,role_scope) VALUES
('PROJECT_OWNER','Project Owner','Full project administration, commercial visibility and release authority.','PROJECT'),
('BID_MANAGER','Bid Manager','Controls bid scope, compliance, deviation, readiness and submission.','PROJECT'),
('LEAD_ENGINEER','Lead Telecom Engineer','Controls engineering basis, proof, MTO and technical approvals.','PROJECT'),
('ENGINEER','Engineer','Works on assigned systems/locations, evidence, CAL/SDY/RPT and technical data.','PROJECT'),
('DOCUMENT_CONTROL','Document Controller','Controls VDRL/MDDR, revisions, transmittals and document issue workflow.','PROJECT'),
('COMMERCIAL','Commercial / Estimator','Controls cost, price schedules, commercial deviations and selling price preparation.','PROJECT'),
('QA_QC','QA/QC','Controls ITP, FAT/SAT evidence, quality dossiers and inspection records.','PROJECT'),
('VIEWER','Viewer','Read-only project visibility without internal commercial release authority.','PROJECT'),
('EXTERNAL_REVIEWER','External Reviewer','Restricted clean/customer-style view with no internal notes or cost detail.','PROJECT')
ON DUPLICATE KEY UPDATE role_name=VALUES(role_name),role_description=VALUES(role_description);

INSERT INTO etm_permissions(permission_code,permission_group,permission_name,description,sensitivity) VALUES
('project.view','PROJECT','View Project','See project in project list and open project workspace.','NORMAL'),
('project.manage_members','PROJECT','Manage Members','Add/remove project members and change access.','RELEASE'),
('bid.view','BID','View Bid Workspace','View bid package, scope and submission readiness.','NORMAL'),
('bid.edit','BID','Edit Bid Responses','Edit compliance response and bid working data.','INTERNAL'),
('bid.approve','BID','Approve Bid Basis','Approve working bid basis before submission.','RELEASE'),
('engineering.view','ENGINEERING','View Engineering','View engineering evidence, proof, MTO and technical state.','NORMAL'),
('engineering.edit','ENGINEERING','Edit Engineering','Create/update evidence, inputs, CAL/SDY/RPT and engineering objects.','INTERNAL'),
('engineering.approve','ENGINEERING','Approve Engineering','Approve engineering result / working basis.','RELEASE'),
('engineering.freeze_mto','ENGINEERING','Freeze MTO','Release Required MTO as controlled procurement basis.','RELEASE'),
('vdrl.view','VDRL','View VDRL','View VDRL/MDDR/document production.','NORMAL'),
('vdrl.edit','VDRL','Edit VDRL','Update document status, assignee, evidence and revision data.','INTERNAL'),
('vdrl.issue','VDRL','Issue Documents','Issue/release controlled document revision and transmittal.','RELEASE'),
('qa.view','QA','View QA/Test','View ITP/FAT/SAT/quality information.','NORMAL'),
('qa.edit','QA','Edit QA/Test','Prepare ITP/FAT/SAT/quality evidence.','INTERNAL'),
('vendor.view','VENDOR','View Vendor/TBE','View vendor quote, compliance and TBE.','INTERNAL'),
('vendor.edit','VENDOR','Edit Vendor/TBE','Update vendor/TBE/deviation evaluation.','INTERNAL'),
('deviation.technical.edit','DEVIATION','Edit Technical Deviation','Prepare/manage technical deviations.','INTERNAL'),
('deviation.commercial.edit','DEVIATION','Edit Commercial Deviation','Prepare/manage commercial deviations.','COMMERCIAL'),
('commercial.cost.view','COMMERCIAL','View Internal Cost','View internal cost build-up.','COMMERCIAL'),
('commercial.cost.edit','COMMERCIAL','Edit Internal Cost','Edit rates, costs and estimating inputs.','COMMERCIAL'),
('commercial.price.view','COMMERCIAL','View Selling Price','View selling price and customer price schedules.','COMMERCIAL'),
('commercial.price.edit','COMMERCIAL','Edit Selling Price','Prepare price schedules and pricing basis.','COMMERCIAL'),
('commercial.price.freeze','COMMERCIAL','Freeze Selling Price','Freeze controlled bid price for submission.','RELEASE'),
('internal_notes.view','SECURITY','View Internal Notes','View internal-only comments and working notes.','INTERNAL'),
('customer_preview.export','OUTPUT','Export Customer Preview','Generate clean customer-facing preview/output.','NORMAL'),
('submission.release','OUTPUT','Release Bid Submission','Release controlled bid submission package.','RELEASE')
ON DUPLICATE KEY UPDATE permission_name=VALUES(permission_name),description=VALUES(description),sensitivity=VALUES(sensitivity);

-- PROJECT_OWNER: all permissions.
INSERT IGNORE INTO etm_role_permissions(role_id,permission_id,allowed)
SELECT r.id,p.id,1 FROM etm_roles r CROSS JOIN etm_permissions p WHERE r.role_code='PROJECT_OWNER';

-- BID_MANAGER: all bid work plus broad view/edit, but member administration reserved to owner.
INSERT IGNORE INTO etm_role_permissions(role_id,permission_id,allowed)
SELECT r.id,p.id,1 FROM etm_roles r JOIN etm_permissions p
WHERE r.role_code='BID_MANAGER' AND p.permission_code IN (
'project.view','bid.view','bid.edit','bid.approve',
'engineering.view','engineering.edit','vdrl.view','vdrl.edit','qa.view',
'vendor.view','vendor.edit','deviation.technical.edit','deviation.commercial.edit',
'commercial.cost.view','commercial.price.view','commercial.price.edit',
'internal_notes.view','customer_preview.export','submission.release');

INSERT IGNORE INTO etm_role_permissions(role_id,permission_id,allowed)
SELECT r.id,p.id,1 FROM etm_roles r JOIN etm_permissions p
WHERE r.role_code='LEAD_ENGINEER' AND p.permission_code IN (
'project.view','bid.view','engineering.view','engineering.edit','engineering.approve','engineering.freeze_mto',
'vdrl.view','vdrl.edit','qa.view','qa.edit','vendor.view','vendor.edit','deviation.technical.edit',
'internal_notes.view','customer_preview.export');

INSERT IGNORE INTO etm_role_permissions(role_id,permission_id,allowed)
SELECT r.id,p.id,1 FROM etm_roles r JOIN etm_permissions p
WHERE r.role_code='ENGINEER' AND p.permission_code IN (
'project.view','bid.view','engineering.view','engineering.edit','vdrl.view','qa.view','vendor.view',
'deviation.technical.edit','internal_notes.view');

INSERT IGNORE INTO etm_role_permissions(role_id,permission_id,allowed)
SELECT r.id,p.id,1 FROM etm_roles r JOIN etm_permissions p
WHERE r.role_code='DOCUMENT_CONTROL' AND p.permission_code IN (
'project.view','bid.view','engineering.view','vdrl.view','vdrl.edit','vdrl.issue','qa.view',
'internal_notes.view','customer_preview.export');

INSERT IGNORE INTO etm_role_permissions(role_id,permission_id,allowed)
SELECT r.id,p.id,1 FROM etm_roles r JOIN etm_permissions p
WHERE r.role_code='COMMERCIAL' AND p.permission_code IN (
'project.view','bid.view','bid.edit','vdrl.view','vendor.view','vendor.edit',
'deviation.commercial.edit','commercial.cost.view','commercial.cost.edit',
'commercial.price.view','commercial.price.edit','commercial.price.freeze',
'internal_notes.view','customer_preview.export');

INSERT IGNORE INTO etm_role_permissions(role_id,permission_id,allowed)
SELECT r.id,p.id,1 FROM etm_roles r JOIN etm_permissions p
WHERE r.role_code='QA_QC' AND p.permission_code IN (
'project.view','bid.view','engineering.view','vdrl.view','vdrl.edit','qa.view','qa.edit',
'vendor.view','internal_notes.view','customer_preview.export');

INSERT IGNORE INTO etm_role_permissions(role_id,permission_id,allowed)
SELECT r.id,p.id,1 FROM etm_roles r JOIN etm_permissions p
WHERE r.role_code='VIEWER' AND p.permission_code IN (
'project.view','bid.view','engineering.view','vdrl.view','qa.view','vendor.view','customer_preview.export');

INSERT IGNORE INTO etm_role_permissions(role_id,permission_id,allowed)
SELECT r.id,p.id,1 FROM etm_roles r JOIN etm_permissions p
WHERE r.role_code='EXTERNAL_REVIEWER' AND p.permission_code IN (
'project.view','bid.view','engineering.view','vdrl.view','qa.view','customer_preview.export');
