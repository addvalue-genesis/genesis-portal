// P553-MR0001-FIRST-PRINCIPLES / ACTIVE PILOT
// Purpose: derive RF link-end functions and physical antenna reference counts from RPT topology.
// Why: a requisition Set or quoted radio quantity is not an engineering calculation.
// Inputs: RPT-0001 Rev.C1 five links, site-level MTO working BOM.
// Outputs: per-site endpoint / antenna demand; OEM SKU quantities intentionally unapproved.
// Downstream: Budget Working Preview and future OEM configuration reconciliation.
// Limit: endpoint demand ≠ dedicated hardware. PTMP sharing, antenna diversity, band and Ex unresolved.
import { SCADA_LINKS_0553, SCADA_RADIO_PATH_REPORT } from "./scadaLinkEvidence";
import { MR0001_WORKING_PRICED_BOM } from "./mr0001WorkingPricedBom";
const endpoints=SCADA_LINKS_0553.flatMap(l=>[
 {id:l.id+":A",site:l.from,peer:l.to,linkId:l.id,mode:l.mode,frequencyMHz:l.frequencyMHz,antenna:l.reportTxAntenna,
  role:l.mode==="PTMP"?"PTMP_BASE_DIRECTIONAL_CANDIDATE":"PTP_PEER"},
 {id:l.id+":B",site:l.to,peer:l.from,linkId:l.id,mode:l.mode,frequencyMHz:l.frequencyMHz,antenna:l.reportRxAntenna,
  role:l.mode==="PTMP"?"PTMP_REMOTE_DIRECTIONAL_CANDIDATE":"PTP_PEER"}
]);
const locations=[...new Set(MR0001_WORKING_PRICED_BOM.items.map(r=>r.site))].map(site=>{
 const roles=endpoints.filter(e=>e.site===site);
 const items=MR0001_WORKING_PRICED_BOM.items.filter(r=>r.site===site);
 return {site,roles,sourceMtoItems:items.length,linkEndpointDemand:roles.length,
  antennaReferenceDemand:roles.reduce((n,e)=>n+(/x2 diversity/i.test(e.antenna)?2:1),0),
  antennaReferenceBasis:"RPT link-end antenna references; x2 diversity interpreted as two antennas, not approved procurement count",
  derivedRadioSkuQty:null,derivedAntennaPurchaseQty:null,
  sourceId:SCADA_RADIO_PATH_REPORT.id,sourceRevision:SCADA_RADIO_PATH_REPORT.revision,
  blockedBy:["MTO role-to-link allocation","BLD existing/reuse classification","OEM PTMP sharing and capacity","Sector 60/90 conflict","Country region/Ex approval"]};
});
export const MR0001_FIRST_PRINCIPLES_DERIVATION=Object.freeze({
 id:"P553-MR0001-RF-DEMAND",method:"RPT C1 topology decomposition / functional endpoint demand",
 sourceUrl:SCADA_RADIO_PATH_REPORT.url,linkCount:SCADA_LINKS_0553.length,
 linkEndCount:endpoints.length,locations,endpoints,
 calculation:"Link endpoints = 2 × distinct RPT links; antenna reference demand = one per endpoint except explicitly noted x2 diversity",
 validity:"REFERENCE_DEMAND_NOT_OEM_PURCHASE_QTY",
 selectedRadioSku:null,acceptedUnitCost:null,releaseAllowed:false
});
