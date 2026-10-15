// PJ2608-0553 / Source-locked packing and marking clauses used by B5 derivation.
// Contract ANNEX 4 contains a *template* header/destination; never infer a
// contractual delivery location from its Shanghai/12345 sample text.
// Every rule is a requirement, never a separately billable package.
export const B5_SOURCE_URLS_0553=Object.freeze({
 annex4:"https://drive.google.com/file/d/1SLMpWaduVvlnBkN1O-ukO8_XZHZU6c4_/view",
 annex42:"https://drive.google.com/file/d/1ZHOpLPeYVgFKKDHXkof4_78ijP7-Yw7N/view",
 std006:"https://drive.google.com/file/d/1O8f5NsNsn1IABeurGiYGnBdlLHgsP18U/view",
 mr0001:"https://drive.google.com/file/d/1XMDolhzCvw2kQnahlFBwxTujkW22pQSm/view",
 mr0002:"https://drive.google.com/file/d/1BbpBxKCuv0w8Khruw5flIhSPlIWXw6Mx/view",
 mr0003:"https://drive.google.com/file/d/1Y0Xh4BpfHZBV_MxOSuWmr-I9r-7DNkB1/view",
 mr0004:"https://drive.google.com/file/d/1Iq0DGmHlVP8dXvwKED-co00TGlM7NGp7/view"
});
const clause=(id,sourceId,section,title,requirement,unitDriver,costBoundary,gate)=>Object.freeze({
 id,sourceId,section,title,requirement,unitDriver,costBoundary,gate,
 sourceUrl:B5_SOURCE_URLS_0553[sourceId],pricingStatus:"REQUIREMENT_ONLY_NOT_AN_ADDITIVE_PRICE"
});
export const B5_PACKING_CLAUSES_0553=Object.freeze([
 clause("B5-REQ-01","annex4","Part I §A pp4–6","Packing-list field completeness",
 "Project/destination/seller/PO/tag; item Qty/UOM; parcel counts; net/gross kg; dimensions/volume; hazardous class if applicable",
 "Unique physical package IDs and completed Master/Single packing lists","B2 owns document preparation and status, B5 owns physical packing compliance","PACKING_LIST_FIELDS_COMPLETE_PENDING"),
 clause("B5-REQ-02","annex42","Master & Single Packing List pp1–2","Package-level identity",
 "Master/Single packing sheets must reconcile Package No, item/MR/Tag, material code, Qty, weight, dimensions, packing kind and storage symbol",
 "Distinct accepted crate/pack keys","Template content is B2, printed label/physical packing B5","ACTUAL_MASTER_SINGLE_LIST_REQUIRED"),
 clause("B5-REQ-03","annex4","Part I §B pp6–7","Appropriate shipment packing",
 "Packaging must withstand chosen transport modes, multiple lifts, handling and storage; technical packaging specification prevails over the template minimum",
 "Unique pack count × type/material/physical labor","OEM initial export packing included/unincluded must be proved before B5 charge","OEM_QUOTE_AND_PACK_TYPE_EVIDENCE_PENDING"),
 clause("B5-REQ-04","annex4","Part I §B pp6–7","Order segregation and pack numbering",
 "Sequential case numbering by PO; different PO equipment cannot be mixed without project approval",
 "Distinct PO/pack ID; approved consolidation","Do not count same pallet/crate under each MR and each shipping leg","PO_PACKAGE_IDENTITY_PENDING"),
 clause("B5-REQ-05","annex4","Part I §A pp5–6","IPPC wooden packing",
 "If export wood packaging is used, origin-authority IPPC-treated marked wood and corresponding declaration/proof are required",
 "I_wood × N_wooden_boxes","Condition-based B5 packaging cost; customs/plant-quarantine fees B6 only if incurred","WOOD_USAGE_AND_IPPC_VENDOR_PROOF_PENDING"),
 clause("B5-REQ-06","annex4","Part I §B pp8–9","Electronics moisture protection",
 "Electrical/electronic goods require suitable airtight barrier packing and desiccants; fragile items need adequate mechanical protection",
 "N_electronic_pack × protection material Qty and pack labor","Standard included OEM packing must be netted from extra B5; consumables used within B5 not separately B13","BARRIER_DESICCANT_AND_OEM_INCLUSION_PENDING"),
 clause("B5-REQ-07","annex4","Part I §B pp9–10","Spares separate marking and preservation",
 "Separate cases marked SPARE PARTS; at least 2 years indoor storage for spare crates",
 "N_spare_cases × preservation/marking only if physical supply awarded","Spare item procurement belongs B10/C1/C2, not B5; packaging only","AWARDED_SPARES_AND_SPARE_CRATE_COUNT_PENDING"),
 clause("B5-REQ-08","annex4","Part I §C p10","Two-face waterproof marking",
 "Mark packages on two adjacent faces with contract/PO, package number, tag, gross/net mass and dimensions; resolve placeholder location with purchaser",
 "Unique physical packages × marking effort","No duplicated B2 label content or B6 shipper fee","MARKING_DESTINATION_DATA_AND_QTY_PENDING"),
 clause("B5-REQ-09","annex4","Part II pp11–12","No unapproved partial shipment",
 "Partial shipments require advance purchaser approval; additional packing/handling charge requires contract basis",
 "Approved shipment batch count, NOT four MR count by default","B5 new charge cannot arise merely from an extra leg unless approved","PARTIAL_SHIPMENT_APPROVAL_AND_COST_BOUNDARY_OPEN"),
 clause("B5-REQ-10","std006","§3 and §7.1 pp1–7","PTTEP packing integrity",
 "Different orders and spares segregated, tailored handling/lifting protection; basic one-year packing integrity requirement",
 "Verified package type and duration","B5 compliant pack; Annex4 2-year spare packing remains stricter for spare crates","PTTEP_STD_APPLICABILITY_AND_PACK_PROOF_PENDING"),
 clause("B5-REQ-11","std006","§7.2.1 pp10–11","International wooden packaging ISPM-15",
 "Export wooden packing requires appropriately treated marked material under ISPM 15, with source confirmation",
 "I_wood × wooden pack Qty","Physical crate treatment B5, avoid duplicating Annex4 IPPC as a second charge","ISPM15_INCLUSION_CERT_REQUIRED"),
 clause("B5-REQ-12","std006","§7.4.3 and §7.6 pp15–16","Humidity and handling marks",
 "Electrical gear moisture barrier; consignee/PO/package/weights/dimensions/origin; waterproof marking on two sides",
 "Electronic pack and actual package counts","Same physical pack charge as Annex4; separate compliance evidence only","MARKING_AND_HUMIDITY_CONTROL_VERIFICATION_PENDING"),
 clause("B5-REQ-13","mr0001","§5 and Attachment 9","SCADA package and loose items",
 "SCADA radio package and seven-location scope include vendor packing/transport plus loose items, preservations and site unpack instructions as applicable",
 "MR0001 eligible packing object keys, not seven inferred crates","OEM/Part A included costs must be credited","MR0001_PACKING_DETAILS_PENDING"),
 clause("B5-REQ-14","mr0002","§5 and Attachment 9","DMR radio package",
 "Vendor packing and export/storage preparations for MR0002; actual China→Thailand→China itinerary is management routing",
 "MR0002 physical packaging object keys by actual leg","OEM initial packing B5 inclusion; freight/clearance B6; repack only when separately needed","MR0002_ROUTE_REPACK_SCOPE_PENDING"),
 clause("B5-REQ-15","mr0003","§5 and Attachment 9","Ex Telephone/Sounder package",
 "Vendor packing for explosion-proof telephone/sounder equipment; Ex labels/certificates must remain associated with package after repack",
 "MR0003 equipment-specific packing object keys","OEM package protection and Ex certification cannot be duplicated","MR0003_EX_PACKING_PENDING"),
 clause("B5-REQ-16","mr0004","§5 and Attachment 9","Marine RACON package",
 "Vendor packing, transit protection and storage preparation for Marine RACON",
 "MR0004 equipment-specific packing object keys","OEM initial packing included/unincluded must be evidenced","MR0004_RACON_PACKING_PENDING")
]);
export const B5_PACKING_SOURCE_POLICY_0553=Object.freeze({
 moduleId:"bid.engineering.equations.b5.source",
 sourceClauseCount:B5_PACKING_CLAUSES_0553.length,
 workObject:"MR/PO × leg × actual crate number / package ID",
 sourceCountIsNotPackageQuantity:true,sourceCountIsNotShipmentQuantity:true,
 clauseAndStandardsAreNonAdditive:true,physicalPackageCount:null,
 acceptedMasterPackingListRef:null,sourceOwner:"02 source rule / 10.2 cost owner",
 contractualSeller:"SAMTEL or nominated OEM per accepted subcontract",
 tradeConstraint:"Source Annex4 cover contains unfilled placeholders and Shanghai address; use accepted PO named yard rather than template example"
});
