SET @p=(SELECT id FROM etm_projects WHERE project_code='PJ2608-0550');

INSERT INTO etm_bid_packages(project_id,bid_code,bid_title,bid_revision,status)
VALUES(@p,'PJ2608-0550-BID','Aung Sinkha Telecom Quotation / Bid Submission','REV0','ACTIVE')
ON DUPLICATE KEY UPDATE bid_title=VALUES(bid_title),bid_revision=VALUES(bid_revision);

SET @bid=(SELECT id FROM etm_bid_packages WHERE project_id=@p AND bid_code='PJ2608-0550-BID');

INSERT INTO etm_bid_source_groups(bid_package_id,group_code,group_name,source_domain,status) VALUES
(@bid,'CONTRACT','Contract / Commercial Pack','CONTRACT','RECEIVED'),
(@bid,'TECH','Technical RFQ Pack','TECHNICAL','RECEIVED'),
(@bid,'CLAR','Clarification / Deviation Pack','CLARIFICATION','ACTIVE'),
(@bid,'VENDOR','Vendor / Subsupplier Inputs','VENDOR','PARTIAL')
ON DUPLICATE KEY UPDATE group_name=VALUES(group_name),status=VALUES(status);

SET @g_contract=(SELECT id FROM etm_bid_source_groups WHERE bid_package_id=@bid AND group_code='CONTRACT');
SET @g_tech=(SELECT id FROM etm_bid_source_groups WHERE bid_package_id=@bid AND group_code='TECH');
SET @g_clar=(SELECT id FROM etm_bid_source_groups WHERE bid_package_id=@bid AND group_code='CLAR');

INSERT INTO etm_bid_source_documents(bid_package_id,source_group_id,source_code,source_title,source_role,precedence_order,status) VALUES
(@bid,@g_contract,'PA','Purchase Agreement','CONTRACT',1,'CURRENT'),
(@bid,@g_contract,'EXH-A','Exhibit A - Scope of Work','SCOPE_OF_WORK',2,'CURRENT'),
(@bid,@g_contract,'EXH-B','Exhibit B - Work Time Schedule','SCHEDULE',3,'CURRENT'),
(@bid,@g_contract,'EXH-C','Exhibit C - Commercial Terms','PRICE_TEMPLATE',4,'CURRENT'),
(@bid,@g_contract,'EXH-D','Exhibit D - Performance Test','ACCEPTANCE',5,'CURRENT'),
(@bid,@g_clar,'ATT-3','Attachment 3 - Technical Deviations List','TECHNICAL_DEVIATION_TEMPLATE',NULL,'CURRENT'),
(@bid,@g_clar,'ATT-4','Attachment 4 - Commercial Deviations List','COMMERCIAL_DEVIATION_TEMPLATE',NULL,'CURRENT'),
(@bid,@g_tech,'TECH-PACK','MR / SPE / PHI / BOD / LIS / Drawings / FEED / Latest Updates','TECHNICAL_REQUIREMENT_PACK',NULL,'CURRENT')
ON DUPLICATE KEY UPDATE source_title=VALUES(source_title),source_role=VALUES(source_role),status=VALUES(status);

INSERT INTO etm_price_schedule_definitions(schedule_code,schedule_name,scope_classification,pricing_rule,template_source) VALUES
('A1','Lump Sum Initial Contract Price for Base Scope of Supply','BASE',
 'Include all ancillaries; include pre-commissioning, commissioning and start-up spares/tools as applicable; include sufficient field service/training basis.','Exhibit C Schedule A1'),
('A2','Lump Sum Initial Contract Price for Optional Scope of Supply','OPTION',
 'Optional scope priced separately and adjusted by actual purchase order.','Exhibit C Schedule A2'),
('C1','Breakdown of Lump Sum Initial Contract Price for Base Scope','BASE',
 'Detailed base-scope price breakdown.','Exhibit C Schedule C1'),
('C2','Breakdown for Spares for Pre-Commissioning and Commissioning','BASE',
 'Commissioning-stage spare/consumable breakdown.','Exhibit C Schedule C2'),
('C3','Breakdown for Spares for Two Years Operation','SEPARATE',
 'Two-year operational spares excluded from base scope and priced separately.','Exhibit C Schedule C3'),
('C4','Breakdown for Capital Spares','SEPARATE',
 'Capital spares priced separately.','Exhibit C Schedule C4'),
('C5','Breakdown for Special Tools for Commissioning and Maintenance','BASE_CHECK',
 'Special tools basis to be checked against base-scope inclusion requirement.','Exhibit C Schedule C5'),
('C6','Proposed Filling Material and Consumables','BASE_CHECK',
 'Initial fills / consumables basis to be checked against scope.','Exhibit C Schedule C6'),
('C7','Quotation for Field Services and Training','BASE',
 'Personnel category, total hours/man-days and rates; sufficient included service time.','Exhibit C Schedule C7'),
('C8','Services and Facilities to Company and Purchaser','CALL_OFF_MIXED',
 'Separate free-of-charge obligations from call-off unit-rate services/facilities.','Exhibit C Schedule C8')
ON DUPLICATE KEY UPDATE schedule_name=VALUES(schedule_name),scope_classification=VALUES(scope_classification),pricing_rule=VALUES(pricing_rule);

INSERT INTO etm_bid_submission_items(bid_package_id,submission_code,submission_type,title,source_template,readiness_status) VALUES
(@bid,'SUB-PRICE','PRICE','Commercial Price Schedules','Exhibit C A1/A2 + C1-C8','NOT_READY'),
(@bid,'SUB-TECH-DEV','TECHNICAL_DEVIATION','Technical Deviations List','Attachment 3','OPEN'),
(@bid,'SUB-COM-DEV','COMMERCIAL_DEVIATION','Commercial Deviations List','Attachment 4','OPEN'),
(@bid,'SUB-TECH','TECHNICAL_PROPOSAL','Technical Proposal / Compliance Package','Technical RFQ Pack','PARTIAL'),
(@bid,'SUB-VDRL','VDRL','Vendor Document Register / MDDR / VDRS','Exhibit A Annex 8','PARTIAL'),
(@bid,'SUB-SCHED','SCHEDULE','Bid / Delivery Schedule','Exhibit B','OPEN')
ON DUPLICATE KEY UPDATE title=VALUES(title),source_template=VALUES(source_template),readiness_status=VALUES(readiness_status);
