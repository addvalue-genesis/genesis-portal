SET NAMES utf8mb4;

-- PJ2608-0550 PAGA canonical product identity seed.
-- Requires migration 016 and seed 018.
-- Purpose: the same INDUSTRONIC product can be referenced by multiple reseller/vendor offers
-- or datasheets without duplicating technical identity. Commercial facts remain on each offer.

SET @v=(SELECT id FROM etm_vendors WHERE vendor_code='INDUSTRONIC' LIMIT 1);

INSERT INTO etm_products
(product_code,manufacturer_vendor_id,product_family,product_name,canonical_model,manufacturer_part_no,lifecycle_state,control_state,metadata_json)
VALUES
('IND-INTRON-X',@v,'PAGA_NODE','INTRON-X Node','INTRON-X',NULL,'CURRENT','WORKING',JSON_OBJECT('source','INDUSTRONIC A20261632')),
('IND-AP712',@v,'PAGA_CALL_STATION','AP712 Access Panel','AP712',NULL,'CURRENT','CONTROLLED',JSON_OBJECT('source','INDUSTRONIC A20261632')),
('IND-DX705',@v,'PAGA_CALL_STATION','DX705 Ex Field Call Station','DX705',NULL,'CURRENT','CONTROLLED',JSON_OBJECT('source','INDUSTRONIC A20261632')),
('IND-LD8-UE',@v,'PAGA_SPEAKER','LD 8 UE/IP54 EN54 Ceiling Speaker','LD 8 UE/IP54 EN54',NULL,'CURRENT','CONTROLLED',JSON_OBJECT('source','INDUSTRONIC A20261632')),
('IND-DSP15',@v,'PAGA_SPEAKER','DSP 15 25W Ex Horn Speaker','DSP 15',NULL,'CURRENT','CONTROLLED',JSON_OBJECT('source','INDUSTRONIC A20261632')),
('IND-GNEXB2X21',@v,'PAGA_BEACON','GNExB2X21 Ex Beacon','GNExB2X21',NULL,'CURRENT','CONTROLLED',JSON_OBJECT('source','INDUSTRONIC A20261632')),
('IND-MBX21',@v,'PAGA_BEACON','MBX21 Beacon','MBX21',NULL,'CURRENT','CONTROLLED',JSON_OBJECT('source','INDUSTRONIC A20261632')),
('IND-XSKT001',@v,'SPECIAL_TOOL','XSKT001 Service Kit','XSKT001','XSKT001','CURRENT','CONTROLLED',JSON_OBJECT('source','INDUSTRONIC A20261632')),
('IND-XCKT001',@v,'SPECIAL_TOOL','XCKT001 Commissioning Kit','XCKT001','XCKT001','CURRENT','CONTROLLED',JSON_OBJECT('source','INDUSTRONIC A20261632')),
('IND-XBC',@v,'PAGA_CONTROL_MODULE','XBC Beacon Control Module','XBC',NULL,'CURRENT','CONTROLLED',JSON_OBJECT('source','INDUSTRONIC A20261632','commercialState','OPTION_IN_CURRENT_OFFER')),
('IND-XCO',@v,'PAGA_CONTROLLER','Redundant XCO Controller','XCO',NULL,'CURRENT','WORKING',JSON_OBJECT('source','INDUSTRONIC A20261632','commercialState','OPTION_IN_CURRENT_OFFER')),
('IND-HP8T',@v,'PAGA_SPEAKER','HP8T Horn Speaker','HP8T',NULL,'CURRENT','CONTROLLED',JSON_OBJECT('source','INDUSTRONIC A20261632','commercialState','OPTION_IN_CURRENT_OFFER')),
('IND-XST-PRO',@v,'SOFTWARE_LICENCE','XST Pro Activation Key','XST Pro',NULL,'CURRENT','CONTROLLED',JSON_OBJECT('source','INDUSTRONIC A20261632','commercialState','OPTION_IN_CURRENT_OFFER'))
ON DUPLICATE KEY UPDATE
 manufacturer_vendor_id=VALUES(manufacturer_vendor_id),
 product_family=VALUES(product_family),
 product_name=VALUES(product_name),
 canonical_model=VALUES(canonical_model),
 manufacturer_part_no=VALUES(manufacturer_part_no),
 lifecycle_state=VALUES(lifecycle_state),
 control_state=VALUES(control_state),
 metadata_json=VALUES(metadata_json);

INSERT INTO etm_product_aliases(product_id,vendor_id,alias_type,alias_value,alias_state)
SELECT id,@v,'MODEL',canonical_model,'VERIFIED'
FROM etm_products
WHERE manufacturer_vendor_id=@v AND canonical_model IS NOT NULL
ON DUPLICATE KEY UPDATE alias_state=VALUES(alias_state),vendor_id=VALUES(vendor_id);

SET @p=(SELECT id FROM etm_projects WHERE project_code='PJ2608-0550');
SET @o=(
 SELECT vo.id
 FROM etm_vendor_offers vo
 JOIN etm_vendors v ON v.id=vo.vendor_id
 WHERE vo.project_id=@p AND v.vendor_code='INDUSTRONIC' AND vo.offer_code='A20261632'
 ORDER BY vo.id DESC LIMIT 1
);

UPDATE etm_vendor_offer_items i
JOIN etm_products p ON p.product_code='IND-INTRON-X'
SET i.product_id=p.id,i.vendor_model='INTRON-X'
WHERE i.vendor_offer_id=@o AND i.item_no IN ('1010','2010','3010','4010');

UPDATE etm_vendor_offer_items i JOIN etm_products p ON p.product_code='IND-AP712'
SET i.product_id=p.id,i.vendor_model='AP712'
WHERE i.vendor_offer_id=@o AND i.item_no='11010';

UPDATE etm_vendor_offer_items i JOIN etm_products p ON p.product_code='IND-DX705'
SET i.product_id=p.id,i.vendor_model='DX705'
WHERE i.vendor_offer_id=@o AND i.item_no='12020';

UPDATE etm_vendor_offer_items i JOIN etm_products p ON p.product_code='IND-LD8-UE'
SET i.product_id=p.id,i.vendor_model='LD 8 UE/IP54 EN54'
WHERE i.vendor_offer_id=@o AND i.item_no='14020';

UPDATE etm_vendor_offer_items i JOIN etm_products p ON p.product_code='IND-DSP15'
SET i.product_id=p.id,i.vendor_model='DSP 15'
WHERE i.vendor_offer_id=@o AND i.item_no='14030';

UPDATE etm_vendor_offer_items i JOIN etm_products p ON p.product_code='IND-GNEXB2X21'
SET i.product_id=p.id,i.vendor_model='GNExB2X21'
WHERE i.vendor_offer_id=@o AND i.item_no='15010';

UPDATE etm_vendor_offer_items i JOIN etm_products p ON p.product_code='IND-MBX21'
SET i.product_id=p.id,i.vendor_model='MBX21'
WHERE i.vendor_offer_id=@o AND i.item_no='15020';

UPDATE etm_vendor_offer_items i JOIN etm_products p ON p.product_code='IND-XSKT001'
SET i.product_id=p.id,i.vendor_model='XSKT001',i.vendor_part_no='XSKT001'
WHERE i.vendor_offer_id=@o AND i.item_no='18010';

UPDATE etm_vendor_offer_items i JOIN etm_products p ON p.product_code='IND-XCKT001'
SET i.product_id=p.id,i.vendor_model='XCKT001',i.vendor_part_no='XCKT001'
WHERE i.vendor_offer_id=@o AND i.item_no='18020';

UPDATE etm_vendor_offer_items i JOIN etm_products p ON p.product_code='IND-XBC'
SET i.product_id=p.id,i.vendor_model='XBC'
WHERE i.vendor_offer_id=@o AND i.item_no='5040';

UPDATE etm_vendor_offer_items i JOIN etm_products p ON p.product_code='IND-XCO'
SET i.product_id=p.id,i.vendor_model='XCO'
WHERE i.vendor_offer_id=@o AND i.item_no='5010';

UPDATE etm_vendor_offer_items i JOIN etm_products p ON p.product_code='IND-HP8T'
SET i.product_id=p.id,i.vendor_model='HP8T'
WHERE i.vendor_offer_id=@o AND i.item_no='14010';

UPDATE etm_vendor_offer_items i JOIN etm_products p ON p.product_code='IND-XST-PRO'
SET i.product_id=p.id,i.vendor_model='XST Pro'
WHERE i.vendor_offer_id=@o AND i.item_no='18040';

-- Example design rule for future vendor/reseller quotations:
-- match the offered OEM model/part number to etm_products first, then preserve the
-- reseller-specific price, incoterm, lead time, warranty and conditions on that offer.
-- Do not duplicate the product simply because the selling vendor differs.
