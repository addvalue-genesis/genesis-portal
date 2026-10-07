SET NAMES utf8mb4;

-- PJ2608-0550 INDUSTRONIC PAGA offer canonicalisation.
-- Preserves the whole source offer, then binds individual items/conditions to PAGA.
-- Requires migrations 002, 003, 009, 010 and 015.

SET @p=(SELECT id FROM etm_projects WHERE project_code='PJ2608-0550');
SET @s=(SELECT id FROM etm_systems WHERE project_id=@p AND system_code='PAGA' LIMIT 1);

INSERT INTO etm_vendors(vendor_code,vendor_name,manufacturer_flag,avl_status,status)
VALUES('INDUSTRONIC','INDUSTRONIC Industrie-Electronic GmbH & Co. KG',1,'CURRENT_0550_APPROVAL_OPEN','ACTIVE')
ON DUPLICATE KEY UPDATE
 vendor_name=VALUES(vendor_name),
 manufacturer_flag=VALUES(manufacturer_flag),
 avl_status=VALUES(avl_status),
 status=VALUES(status);

SET @v=(SELECT id FROM etm_vendors WHERE vendor_code='INDUSTRONIC');

INSERT INTO etm_vendor_offers
(project_id,vendor_id,offer_code,offer_revision,offer_date,currency,status,metadata_json)
VALUES
(@p,@v,'A20261632','Rev00','2026-09-03','EUR','RECEIVED',
 JSON_OBJECT(
   'project','PTTEP - Thailand - Aung Sinkha Development Project (ASK Project)',
   'inquiry','RQ2608-1181',
   'incoterm','FCA Wertheim/Germany · INCOTERMS 2020',
   'validity','2026-12-31',
   'quotedTotalBeforeDiscount',255115.00,
   'discount',28660.95,
   'quotedFinal',226454.05,
   'sourceRule','Preserve AS QUOTED; system/price allocation is stored in binding rows.'
 ))
ON DUPLICATE KEY UPDATE
 offer_date=VALUES(offer_date),currency=VALUES(currency),status=VALUES(status),metadata_json=VALUES(metadata_json),
 id=LAST_INSERT_ID(id);

SET @o=(SELECT id FROM etm_vendor_offers WHERE project_id=@p AND vendor_id=@v AND offer_code='A20261632' ORDER BY id DESC LIMIT 1);

-- Re-runnable seed: remove only this controlled source offer's item rows/bindings before rebuilding.
DELETE b FROM etm_vendor_offer_item_bindings b
JOIN etm_vendor_offer_items i ON i.id=b.vendor_offer_item_id
WHERE i.vendor_offer_id=@o;
DELETE FROM etm_vendor_offer_items WHERE vendor_offer_id=@o;

INSERT INTO etm_vendor_offer_items
(vendor_offer_id,item_no,description,offered_qty,unit,unit_price,amount,metadata_json)
VALUES
(@o,'1010','INTRON-X Node — APF Control Building',1,'U',40062,40062,JSON_OBJECT('group','Main Node','inFinal',true)),
(@o,'2010','INTRON-X Node — ACP Office/Guard House + Truck Loading',1,'U',33790,33790,JSON_OBJECT('group','Main Node','inFinal',true)),
(@o,'3010','Remote Amplifier Node — APF Accommodation',1,'U',22229,22229,JSON_OBJECT('group','Remote Node','inFinal',true)),
(@o,'4010','Remote Amplifier Node — Catering/Store/Office/Security',4,'U',15944,63776,JSON_OBJECT('group','Remote Node','inFinal',true)),
(@o,'11010','AP712 Access Panel',4,'U',3210,12840,JSON_OBJECT('group','Master Call Station','inFinal',true)),
(@o,'12020','DX705 Ex Field Call Station',2,'U',2367,4734,JSON_OBJECT('group','Field Call Station','inFinal',true)),
(@o,'14020','LD 8 UE/IP54 EN54 Ceiling Speaker',124,'U',75,9300,JSON_OBJECT('group','Speaker','inFinal',true)),
(@o,'14030','DSP 15 25W Ex Horn Speaker',57,'U',295,16815,JSON_OBJECT('group','Speaker','inFinal',true)),
(@o,'15010','GNExB2X21 Ex Beacon',9,'U',910,8190,JSON_OBJECT('group','Beacon','inFinal',true)),
(@o,'15020','MBX21 Beacon',4,'U',798,3192,JSON_OBJECT('group','Beacon','inFinal',true)),
(@o,'18010','XSKT001 Service Kit',1,'U',257,257,JSON_OBJECT('group','Special Tools','inFinal',true)),
(@o,'18020','XCKT001 Commissioning Kit',1,'U',160,160,JSON_OBJECT('group','Special Tools','inFinal',true)),
(@o,'18050','Config Manager X/1 USB',1,'U',2485,2485,JSON_OBJECT('group','Special Tools','inFinal',true)),
(@o,'20010','Activation package',1,'Lot',13225,13225,JSON_OBJECT('group','Software / Activation','inFinal',true)),
(@o,'22030','Documentation & Project Management',1,'Lot',16000,16000,JSON_OBJECT('group','Documentation','inFinal',true)),
(@o,'23010','FAT at INDUSTRONIC Wertheim, Germany',3,'day',1020,3060,JSON_OBJECT('group','Service','inFinal',true)),
(@o,'24010','Packing Charges',1,'Lot',5000,5000,JSON_OBJECT('group','Packing','inFinal',true)),
(@o,'5010','Redundant XCO Controller',1,'U',3328,3328,JSON_OBJECT('group','OPTION','inFinal',false)),
(@o,'5020','Redundant Managed FE Switch',1,'U',3408,3408,JSON_OBJECT('group','OPTION','inFinal',false)),
(@o,'5030','Engineering Test Panel',1,'U',1894,1894,JSON_OBJECT('group','OPTION','inFinal',false)),
(@o,'5040','XBC Beacon Control Module',1,'U',2014,2014,JSON_OBJECT('group','OPTION','inFinal',false)),
(@o,'11020','AP Additional Keypad',1,'U',681,681,JSON_OBJECT('group','OPTION','inFinal',false)),
(@o,'14010','HP8T Horn Speaker',1,'U',97,97,JSON_OBJECT('group','OPTION','inFinal',false)),
(@o,'18040','XST Pro Activation Key',1,'U',400,400,JSON_OBJECT('group','OPTION','inFinal',false));

SET @a105=(
 SELECT psi.id
 FROM etm_bid_price_schedule_items psi
 JOIN etm_bid_packages bp ON bp.id=psi.bid_package_id
 WHERE bp.project_id=@p AND psi.line_code='A1-05'
 ORDER BY psi.id DESC LIMIT 1
);

INSERT INTO etm_vendor_offer_item_bindings
(project_id,vendor_offer_item_id,system_id,bid_price_schedule_item_id,binding_code,binding_role,allocated_qty,allocated_amount,currency,binding_state,note_text)
SELECT
 @p,i.id,@s,@a105,
 CONCAT('VOB-A20261632-',i.item_no),
 CASE
   WHEN JSON_UNQUOTE(JSON_EXTRACT(i.metadata_json,'$.group'))='OPTION' THEN 'OPTION'
   WHEN i.item_no='23010' THEN 'SERVICE'
   WHEN i.item_no IN ('18010','18020','18050') THEN 'TOOL'
   WHEN i.item_no='24010' THEN 'LOGISTICS'
   ELSE 'DIRECT_SYSTEM_ITEM'
 END,
 i.offered_qty,i.amount,'EUR',
 CASE WHEN JSON_UNQUOTE(JSON_EXTRACT(i.metadata_json,'$.group'))='OPTION' THEN 'PARTIAL' ELSE 'VERIFIED' END,
 'PAGA system binding only. Required quantity remains governed by requirement/proof/MTO; vendor offered quantity is not adopted as required quantity.'
FROM etm_vendor_offer_items i
WHERE i.vendor_offer_id=@o
ON DUPLICATE KEY UPDATE
 system_id=VALUES(system_id),bid_price_schedule_item_id=VALUES(bid_price_schedule_item_id),
 binding_role=VALUES(binding_role),allocated_qty=VALUES(allocated_qty),allocated_amount=VALUES(allocated_amount),
 currency=VALUES(currency),binding_state=VALUES(binding_state),note_text=VALUES(note_text);

DELETE FROM etm_vendor_offer_conditions WHERE project_id=@p AND vendor_offer_id=@o;

INSERT INTO etm_vendor_offer_conditions
(project_id,vendor_offer_id,system_id,condition_code,condition_type,raw_text,normalized_value_json,acceptance_state,cost_impact_state,schedule_impact_state,risk_impact_state,warranty_impact_state,metadata_json)
VALUES
(@p,@o,@s,'COND-A20261632-INCOTERM','INCOTERM',
 'Terms of Delivery: FCA Wertheim/Germany, INCOTERMS 2020.',
 JSON_OBJECT('incoterm','FCA','place','Wertheim, Germany'),'OPEN','CONFIRMED','POTENTIAL','POTENTIAL','NONE',
 JSON_OBJECT('commercialRouteImpact','B2 onward freight/import/inland logistics')),
(@p,@o,@s,'COND-A20261632-PAYMENT','PAYMENT',
 'Terms of Payment: advance payment net.',
 JSON_OBJECT('paymentBasis','ADVANCE_PAYMENT_NET'),'OPEN','POTENTIAL','NONE','POTENTIAL','NONE',
 JSON_OBJECT('impact','Financing/cash-flow exposure must be evaluated before final offer')),
(@p,@o,@s,'COND-A20261632-VALIDITY','VALIDITY',
 'Validity of Offer: 31.12.2026.',
 JSON_OBJECT('validUntil','2026-12-31'),'OPEN','NONE','POTENTIAL','POTENTIAL','NONE',
 JSON_OBJECT('impact','Requote/escalation risk after validity')),
(@p,@o,@s,'COND-A20261632-LEAD','LEAD_TIME',
 'Delivery Time: approx. 6 months after receipt of order and clearing up all details.',
 JSON_OBJECT('durationMonthsApprox',6,'trigger','PO + all details cleared'),'OPEN','POTENTIAL','CONFIRMED','POTENTIAL','NONE',
 JSON_OBJECT('impact','Procurement schedule / detail-closure dependency')),
(@p,@o,@s,'COND-A20261632-FAT','FAT',
 'FAT/TPI at INDUSTRONIC Wertheim is estimated at 3 days x EUR 1,020/day. INDUSTRONIC personnel plus lunch/drinks are included; purchaser/end-user travel/accommodation and third-party inspector are excluded.',
 JSON_OBJECT('days',3,'ratePerDay',1020,'currency','EUR','location','Wertheim, Germany','purchaserAttendeesMax',3),'OPEN','CONFIRMED','CONFIRMED','POTENTIAL','NONE',
 JSON_OBJECT('commercialTreatment','Vendor FAT may remain in A1 vendor package; ADDVALUE lead/witness/travel remains separate B4 work')),
(@p,@o,@s,'COND-A20261632-COMMISSION','COMMISSIONING',
 'INDUSTRONIC recommends that commissioning be carried out by INDUSTRONIC authorised personnel; independent commissioning is not covered by warranty in the event of damage. Current offer has no separate site commissioning rate.',
 JSON_OBJECT('authorisedPersonnelRequiredForWarrantySafeBasis',true,'siteRateQuoted',false),'OPEN','POTENTIAL','POTENTIAL','CONFIRMED','CONFIRMED',
 JSON_OBJECT('commercialTreatment','OEM site service B4 candidate / quote required','releaseGate','Written OEM terms or warranty-safe delegation required before ADDVALUE-only commissioning'));

-- Four semantic price layers for the current PAGA pilot.
DELETE FROM etm_price_line_layers WHERE project_id=@p AND bid_price_schedule_item_id=@a105 AND revision_no='PAGA-REV00';

INSERT INTO etm_price_line_layers
(project_id,bid_price_schedule_item_id,layer_code,layer_type,revision_no,amount,currency,layer_state,basis_text,source_snapshot_json)
VALUES
(@p,@a105,'PL-A1-05-SOURCE','SOURCE_COST','PAGA-REV00',226454.05,'EUR','CONTROLLED',
 'INDUSTRONIC A20261632 quoted final source/procurement cost.',
 JSON_OBJECT('offer','A20261632','quoteDate','2026-09-03')),
(@p,@a105,'PL-A1-05-INTERNAL','INTERNAL_COST','PAGA-REV00',NULL,'EUR','HOLD',
 'Complete internal cost is not closed: required bulk/logistics/site service/spares/compliance/work remain open.',
 JSON_OBJECT('rule','TBC is not zero')),
(@p,@a105,'PL-A1-05-WORKING','WORKING_SELL','PAGA-REV00',292645.96,'EUR','WORKING',
 'Working commercial preview on known selected cost only; not final customer selling price.',
 JSON_OBJECT('formula','known selected cost x 1.20 / 0.95','scopeLimit','open completion excluded')),
(@p,@a105,'PL-A1-05-RELEASED','RELEASED_SELL','PAGA-REV00',NULL,'EUR','HOLD',
 'No authorised released customer sell for PAGA.',
 JSON_OBJECT('releaseRequired',true));
