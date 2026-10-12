// Stable UI and engineering FUNCTION correspondence, not a shared procurement selection.
// Based on ZWP20 MTO Rev04 Row4 and ZWP21 Row13 with RPT-0001 Rev.C1.
export const MR0001_MODULE_CROSSMAP_0553=Object.freeze({
 sourceModule:"bid.budget.bom.zwp20.mr-502-001.4",
 targetModule:"bid.budget.bom.zwp21.mr-502-001.13",
 rule:"ONE_FUNCTION_SCHEMA__SITE_SPECIFIC_ROLE_AND_BLD_RPT_CONFIG",
 sourceRole:"PTMP_REMOTE_ZWP8_TO_ZWP20",
 targetRole:"PTP_PEER_ZWP11_TO_ZWP21",
 functions:[
  {id:"RADIO_EQUIPMENT",zwp20:"B-1",zwp21:"C-1",owner:"MR-502-001",rule:"site role and frequency validation"},
  {id:"RF_FILTER",zwp20:"B-2",zwp21:"C-2",owner:"MR-502-001",rule:"RF chain and Ex installation"},
  {id:"CAPACITY_KEY",zwp20:"B-3",zwp21:"C-3",owner:"MR-502-001",rule:"throughput and NMS license verification"},
  {id:"REGION_KEY",zwp20:"B-4",zwp21:"C-4",owner:"MR-502-001",rule:"unquoted region entitlement; no false zero"},
  {id:"MOUNT_FEEDER",zwp20:"B-5",zwp21:"C-5",owner:"MR-502-001",rule:"avoid duplicate antenna feeder supply"},
  {id:"POWER",zwp20:"B-6",zwp21:"C-6",owner:"MR-502-001A",rule:"indoor power owner not ODU"},
  {id:"POWER_CORD",zwp20:"B-7",zwp21:"C-7",owner:"MR-502-001A",rule:"indoor power owner not ODU"},
  {id:"ETHERNET_SURGE",zwp20:"B-8",zwp21:"C-8",owner:"SA-502-001",rule:"separate surge tag, Ex interface review"}
 ],
 note:"ZWP20 functional detail is authoritative layout reference; ZWP21 selected hardware requires separate PTP OEM approval. Differences and missing licensed functions remain visible."
});
