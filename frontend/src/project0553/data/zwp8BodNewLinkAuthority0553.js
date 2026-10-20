// PJ2608-0553 MR0001 engineering authority: BOD C2 section 7.2 controls
// ZPQ <-> ZWP8 PTP scope, reconciled with BLD C1 sheet7 and MR0001 C1 p12.
// This is a READ-ONLY clarification of contractual NEW link vs existing link.
// It changes NO immutable Rev02/03 cost source and confers no OEM SKU approval.
export const ZWP8_BOD_NEW_LINK_AUTHORITY_0553=Object.freeze({
 source:"MM-ZTK-1F-GEN-TEL-BOD-0001 Rev.C2 section 7.2; MR-0001 Rev.C1 p12; BLD-0001 Rev.C1 sheet7",
 baseline:{link:"ZPQ <-> ZWP8",status:"EXISTING_LINK_RETAINED__NO_AUTO_REPLACEMENT"},
 newLink:{link:"ZPQ <-> ZWP8",status:"ADDITIONAL_NEW_PTP_LINK_REQUIRED_BY_BOD_C2",
  cause:"After site survey, original throughput insufficient for ZWP20 and ZWP22",
  ends:[
   {site:"ZPQ",role:"NEW_PTP_BASE",radio:1,antenna:"4ft directional",antennaQty:1},
   {site:"ZWP8",role:"NEW_PTP_REMOTE",radio:1,antenna:"4ft directional",antennaQty:1}
  ],
  ownerZwp8:{odu:"MR-502-004",idu:"MR-502-004A",antenna:"ANT-502-003"},
  costStatus:"SOURCE_MTO_NEW_LINK_SCOPE_CONFIRMED__OEM_PRICE_PARTIAL"
 },
 separatePtMp:{role:"NEW_PTMP_BASE_ZWP8_TO_ZWP20_ZWP22",source:"BOD C2 section 7.2",
  ownerZwp8:{odu:"MR-502-003",idu:"MR-502-003A",antenna:"ANT-502-002"},
  antenna:"90 degree sector; client requirement; OEM gain/pattern subject to verification"},
 openGates:["Selected radio/antenna exact OEM SKU and certificates",
  "Full indoor IDU and Ex enclosure 2-radio space and heat compatibility",
  "A-4 / B-3 / Myanmar region and management licences, NMS entitlement",
  "Route, cables, glands, power and vendor package inclusions"],
 immutableCostRevision:"REV03_UNCHANGED",newLinkScopeConfirmed:true,
 physicalExistingLinkToBeReplaced:false,customerSellChanged:false
});
export const ZWP8_BOD_AUDIT_DISPLAY_CORRECTIONS_0553=Object.freeze({
 "ZWP8-ENG-03":{
  title:"Two NEW 1F radio branches required: PTMP base and additional PTP endpoint; OEM configuration open",
  details:"BOD Rev.C2 §7.2 explicitly requires one NEW PTMP base/90° sector at ZWP8 and one NEW PTP radio/4ft antenna at ZWP8 for the additional ZPQ↔ZWP8 link. MR0001 Rev.C1 p12 confirms MR-502-003/003A/ANT-502-002 and MR-502-004/004A/ANT-502-003. The existing baseline PTP link in BLD C1 remains; it is NOT a substitute for the additional new link. Only OEM model/licences/installation/price verification remains open."
 },
 "ZWP8-ENG-06":{
  title:"BOD C2 §7.2 confirms additional NEW ZPQ–ZWP8 PTP; existing link retained",
  details:"After site survey, insufficient throughput on the existing ZPQ↔ZWP8 link was identified. BOD requires one new 4ft-antenna/radio at EACH end (ZPQ and ZWP8) as an additional separate PTP link. BLD C1 shows the retained existing link. ZWP8 MR-502-004/MR-502-004A/ANT-502-003 are assigned to the new PTP branch. Pending verification is selected OEM solution and any final tie-in details—not whether the link is required."
 }
});
