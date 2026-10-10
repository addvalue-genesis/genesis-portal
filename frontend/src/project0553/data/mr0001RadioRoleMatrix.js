// MR0001 physical radio role matrix: engineering inference from directional RPT topology.
// Link endpoint roles are NOT certified equipment counts, vendor SKU assignments, or approvals.
import { SCADA_LINKS_0553, SCADA_RADIO_PATH_REPORT } from "./scadaLinkEvidence";
import { MR0001_ENGINEERING_REQUIRED_BOM } from "./mr0001RequiredBomDerivation";
import { AVIAT_0553_TECHNICAL_EVALUATION } from "./aviatTechnicalBidEvaluation";

const roles=SCADA_LINKS_0553.flatMap(link=>{
 const directional=link.mode==="PTMP";
 return [
  {id:link.id+":FROM",linkId:link.id,site:link.from,peer:link.to,mode:link.mode,side:"FROM",
   inferredRole:directional?"PTMP_BASE_CANDIDATE":"PTP_PEER_CANDIDATE",
   antennaReference:link.reportTxAntenna},
  {id:link.id+":TO",linkId:link.id,site:link.to,peer:link.from,mode:link.mode,side:"TO",
   inferredRole:directional?"PTMP_REMOTE_CANDIDATE":"PTP_PEER_CANDIDATE",
   antennaReference:link.reportRxAntenna}
 ].map(r=>({...r,frequencyMHz:link.frequencyMHz,requiredRadioQty:null,requiredAntennaQty:null,
  installedRoleApproval:"OPEN_BLK_OEM_RADIO_PLAN",sourceId:SCADA_RADIO_PATH_REPORT.id}));
});
const quoteRoles=AVIAT_0553_TECHNICAL_EVALUATION.rows
 .filter(x=>["RADIO_BASE","RADIO_REMOTE","ANTENNA_SECTOR","ANTENNA_PARABOLIC"].includes(x.functionId)&&x.offeredRole==="BASE_CANDIDATE_NOT_ACCEPTED")
 .map(x=>({quoteLine:x.quoteLine,partNumber:x.partNumber,role:x.functionId,offeredQty:x.sourceQty,
  allocatedQty:null,acceptedQty:null,sourceId:x.sourceId}));
const sites=[...new Set(roles.map(x=>x.site))].sort().map(site=>{
 const entries=roles.filter(x=>x.site===site);
 const mto=MR0001_ENGINEERING_REQUIRED_BOM.rows.filter(x=>x.platform===site);
 return {site,roles:entries,mtoRows:mto.map(x=>({sourceRowIndex:x.sourceRowIndex,sourcePartText:x.sourcePartText,sourceQtyText:x.sourceQuantityText})),
  ptMpBaseCandidates:entries.filter(x=>x.inferredRole==="PTMP_BASE_CANDIDATE").length,
  ptMpRemoteCandidates:entries.filter(x=>x.inferredRole==="PTMP_REMOTE_CANDIDATE").length,
  ptpPeerCandidates:entries.filter(x=>x.inferredRole==="PTP_PEER_CANDIDATE").length,
  physicallyRequiredBaseQty:null,physicallyRequiredRemoteQty:null,physicallyRequiredPtpQty:null,
  physicallyRequiredAntennaQty:null,siteOfferAllocations:[],status:"INFERRED_LINK_ROLES_ONLY"};
});
export const MR0001_RADIO_ROLE_MATRIX=Object.freeze({
 projectId:"PJ2608-0553",mr:"MR-0001",sourceId:SCADA_RADIO_PATH_REPORT.id,
 sourceRevision:SCADA_RADIO_PATH_REPORT.revision,method:"RPT_LINK_ORIENTATION_CANDIDATE",
 links:SCADA_LINKS_0553.length,logicalEndpoints:roles.length,sites,roles,quoteRoles,
 engineeringQuestions:[
  {id:"ROLE-01",question:"Confirm RPT path direction against BLD/MR and OEM PTP/PTMP radio configuration",state:"OPEN"},
  {id:"ROLE-02",question:"Can multiple PTMP sectors/remotes share one base? Confirm azimuth/beamwidth, licensed capacity and availability",state:"OPEN"},
  {id:"ROLE-03",question:"Confirm separate 5.5/5.8 GHz RF chains at sites serving multiple links",state:"OPEN"},
  {id:"ROLE-04",question:"Confirm ZWP23 receiver diversity, parabolic antenna count and OEM hardware requirements",state:"OPEN"},
  {id:"ROLE-05",question:"Assign exact MR-502 radio/antenna tags and NG A/B/C quote lines to site roles without double allocation",state:"OPEN"}
 ],
 acceptedPhysicalQty:null,acceptedCost:null,customerSell:null,releaseAllowed:false
});
