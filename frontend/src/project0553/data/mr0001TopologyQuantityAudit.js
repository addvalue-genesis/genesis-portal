// Project-specific quantitative topology audit; endpoint counts are graph facts, NOT approved equipment quantities.
import { SCADA_LINKS_0553, SCADA_RADIO_PATH_REPORT } from "./scadaLinkEvidence";
import { MR0001_PACKAGE_COMPOSITION } from "./mr0001PackageComposition";
import { AVIAT_0553_TECHNICAL_EVALUATION } from "./aviatTechnicalBidEvaluation";
const endpoints=SCADA_LINKS_0553.flatMap(l=>[
 {linkId:l.id,site:l.from,side:"FROM",mode:l.mode,frequencyMHz:l.frequencyMHz},
 {linkId:l.id,site:l.to,side:"TO",mode:l.mode,frequencyMHz:l.frequencyMHz}
]);
const siteRows=[...new Set(endpoints.map(e=>e.site))].sort().map(site=>{
 const e=endpoints.filter(x=>x.site===site);
 const p=MR0001_PACKAGE_COMPOSITION.packages.filter(x=>x.platform===site);
 return {site,linkEndpointCount:e.length,linkIds:[...new Set(e.map(x=>x.linkId))],
  frequencyMHz:[...new Set(e.map(x=>x.frequencyMHz))],mtoPackageRows:p.length,
  requiredBaseRadioQty:null,requiredRemoteRadioQty:null,requiredAntennaQty:null,
  requiredEquipmentQty:null,status:"LINK_ENDPOINT_COUNT_ONLY_ROLE_AND_SHARED_CAPACITY_OPEN"};
});
const base=AVIAT_0553_TECHNICAL_EVALUATION.rows.filter(x=>x.offeredRole==="BASE_CANDIDATE_NOT_ACCEPTED");
export const MR0001_TOPOLOGY_QUANTITY_AUDIT=Object.freeze({
 projectId:"PJ2608-0553",mr:"MR-0001",
 reportId:SCADA_RADIO_PATH_REPORT.id,reportRevision:SCADA_RADIO_PATH_REPORT.revision,
 linkCount:SCADA_LINKS_0553.length,endpointCount:endpoints.length,siteCount:siteRows.length,
 endpoints,sites:siteRows,
 proposedRoleQuantities:{baseStations:null,remoteUnits:null,ptpRadios:null,sectorAntennas:null,parabolicAntennas:null},
 offeredRadioCandidates:base.filter(x=>["RADIO_BASE","RADIO_REMOTE"].includes(x.functionId)).map(x=>({
  line:x.quoteLine,functionId:x.functionId,offeredQty:x.sourceQty,source:x.sourceId,
  siteAllocation:null,acceptedQty:null})),
 outstanding:[
  {id:"TOPO-01",reason:"One PTMP base may serve multiple remotes; topology link endpoints must not be counted as radios",source:"RPT-0001-C1",state:"HOLD"},
  {id:"TOPO-02",reason:"ZWP8 and ZPQ act in multiple paths; independent radios/sectors and resilience require BLD, OEM and capacity proof",source:"RPT-0001-C1 / BLD-0001-C1",state:"HOLD"},
  {id:"TOPO-03",reason:"MTO radio/antenna packages and grouped source rows need native split and role assignment per path",source:"MTO Rev04",state:"HOLD"},
  {id:"TOPO-04",reason:"60-degree report sector vs 90-degree vendor antenna; frequency, availability and spectrum/country entitlement remain unresolved",source:"RPT-0001-C1 / BOD-0001-C2 / NG quote",state:"CONFLICT"}
 ],
 status:"TOPOLOGY_QUANTIFIED_EQUIPMENT_OPEN",releaseAllowed:false
});
