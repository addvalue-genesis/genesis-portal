// PJ2608-0553 — ZWP8 source-backed, read-only O&G cost-ownership audit.
// NEVER mutates the frozen MR0001 ledger, vendor quotation, management scenario,
// Brownfield NEW/REUSE selection, or approval/release flags.
import {summarizeMR0001Rev03TagCost0553 as summarizeMR0001TagCost0553} from "./mr0001Rev03CostOverlay0553";
import {ZWP8_ROW43_COST_TRACE} from "./zwp8Row43CostTrace";
import {SCADA_LINKS_0553} from "./scadaLinkEvidence";
import {MR0001_SITE_CLASSIFICATION} from "./mr0001SiteClassification";
import NEXTG from "./quotes/NG-260916-ADV-DAP1.full.json";
const round=v=>Math.round((v+Number.EPSILON)*100)/100;
const line=id=>NEXTG.lines.find(x=>x.code===id);
const sum=values=>round(values.reduce((n,v)=>n+v,0));
const site="ZWP8";
const radioTags=["MR-502-003","MR-502-004"];
const iduTags=["MR-502-003A","MR-502-004A"];
const surgeTags=["SA-502-002","SA-502-003"];
const antennaTags=["ANT-502-002","ANT-502-003"];
export function auditZWP8CostOwnership0553({thbPerUsd=null}={}){
 const ledger=summarizeMR0001TagCost0553(site);
 const rows=ledger.rows;
 const get=tag=>rows.find(r=>r.tag===tag);
 const category=tags=>tags.map(tag=>get(tag)).filter(Boolean);
 const radios=category(radioTags),idu=category(iduTags),surge=category(surgeTags),antennas=category(antennaTags);
 const quoteRadioCodes=ZWP8_ROW43_COST_TRACE.referenceScenarios.find(x=>x.id===ZWP8_ROW43_COST_TRACE.preferredScenarioId)?.radioCodes||[];
 const units={oduOnly:sum(["B-1","B-2","B-3","B-5"].map(x=>line(x)?.unitPrice??0)),
  poe:sum(["B-6","B-7"].map(x=>line(x)?.unitPrice??0)),
  surge:line("B-8")?.unitPrice??null,antenna:line("B-12")?.unitPrice??null};
 const radioUnitFromScenario=ZWP8_ROW43_COST_TRACE.ownerCosts["MR-502-003"]??null;
 const radioSourcesValid=radios.length===2&&radios.every(r=>r.countedInWorkingTotal&&r.currency==="USD"&&r.extended===ZWP8_ROW43_COST_TRACE.ownerCosts[r.tag]);
 const surgeSourcesValid=surge.length===2&&surge.every(r=>r.countedInWorkingTotal&&r.currency==="USD"&&r.extended===units.surge);
 const iduSourcesUnpriced=idu.length===2&&idu.every(r=>!r.countedInWorkingTotal);
 const ownersVerified=ZWP8_ROW43_COST_TRACE.items.every(x=>get(x.tag)?.extended===ZWP8_ROW43_COST_TRACE.ownerCosts[x.tag]);
 const canQuantifyOverlap=radioSourcesValid&&surgeSourcesValid&&
  radios.some(x=>x.detail?.some(f=>f.functionId==="B-8"))&&Number.isFinite(units.surge);
 const sourceOverlapUSD=ownersVerified&&surgeSourcesValid?0:canQuantifyOverlap?round(radios.length*units.surge):null;
 const wrongOwnerPOEUSD=ownersVerified?0:radioSourcesValid&&radios.some(x=>x.detail?.some(f=>f.functionId==="B-6"))&&radios.some(x=>x.detail?.some(f=>f.functionId==="B-7"))?
  round(radios.length*units.poe):null;
 // This is a what-if read-only correction: remove the duplicated surge B-8
 // from ODU, and move B-6/B-7 to the two separately required IDU TAGs.
 const quotedUSD=ledger.subtotals.USD,quotedTHB=ledger.subtotals.THB;
 const uniqueUSD=Number.isFinite(sourceOverlapUSD)?round(quotedUSD-sourceOverlapUSD):null;
 const fxReady=Number.isFinite(thbPerUsd)&&thbPerUsd>0;
 const displayedTHB=fxReady?round(quotedTHB+quotedUSD*thbPerUsd):null;
 const adjustedTHB=fxReady&&Number.isFinite(uniqueUSD)?round(quotedTHB+uniqueUSD*thbPerUsd):null;
 const otherSites=["ZWP20","ZWP21","ZWP22","ZWP23","ZPQ","ZWP11"].map(id=>{
  const l=summarizeMR0001TagCost0553(id);
  return {site:id,allocatedUSD:l.subtotals.USD,allocatedTHB:l.subtotals.THB,
   comparedTHB:fxReady?round(l.subtotals.THB+l.subtotals.USD*thbPerUsd):null,
   costed:l.costedRows,total:l.totalRows};
 });
 const zwp8Links=SCADA_LINKS_0553.filter(x=>x.to===site||x.from===site);
 const physicalGroup={radioODU:radios.length,radioIDU:idu.length,antenna:antennas.length,surge:surge.length};
 const issues=[
  {id:"ZWP8-OWN-01",level:sourceOverlapUSD===0?"RECONCILED":"ERROR",title:"B-8 surge source ownership after role allocation",
   amountUSD:sourceOverlapUSD,
   details:"Current A/B radio allocations exclude surge lines A-8 and B-8. Two separate SA physical owners retain their source rate once each; previous double charge is historical only."},
  {id:"ZWP8-OWN-02",level:ownersVerified&&!iduSourcesUnpriced?"RECONCILED":"ERROR",title:"A-6/A-7 and B-6/B-7 PoE now assigned to independent IDU TAGs",
   amountUSD:wrongOwnerPOEUSD,
   details:"ODU working functions exclude PoE. Each IDU TAG is costed as industrial PoE plus cord only; still does not prove a complete certified IDU."},
  {id:"ZWP8-ENG-03",level:"REVIEW",title:"Two radio and two antenna NEW/reuse decisions not source-confirmed",
   amountUSD:null,
   details:"MTO Rev04 grouped row43 lists 2 ODU + 2 IDU + 2 antenna Set scopes for functional engineering. The ZPQ↔ZWP8 PTP connection is an EXISTING BASELINE link in BLD-0001 Rev.C1. BOD Rev.C2 §7.2 calls for an additional new capacity link after site survey, but does not turn the existing baseline link into two automatically replaceable radio/antenna assemblies. Confirm exact added hardware, reused interfaces and scope before procurement."},
  {id:"ZWP8-ENG-04",level:"REVIEW",title:"PTMP 90-degree sector + PTP 4ft parabolic roles require RF confirmation",
   amountUSD:null,
   details:"PTMP uses ONE A-12 90-degree sector at ZWP8 shared by ZWP20 and ZWP22; angular geometry passes but vendor radiation pattern/calculation proof remains OPEN. The separate added PTP path has ONE B-12 parabolic candidate; existing PTP unchanged."},
  {id:"ZWP8-COM-05",level:"REVIEW",title:"Vendor source quoted quantity is not ZWP8 engineering purchase quantity",
   amountUSD:null,
   details:"One A-12 sector and one B-12 PTP parabolic are separately allocated; Vendor global quoted quantities do not determine ZWP8 procurement quantities. Licence A-3/B-4, NMS capacity and OEM acceptance remain unknown."},
  {id:"ZWP8-ENG-06",level:"REVIEW",title:"Existing PTP ZPQ–ZWP8 baseline versus BOD additional new link",amountUSD:null,
   details:"BLD Rev.C1 Sheet7/Notes9 depict/use the EXISTING communication link. BOD Rev.C2 §7.2 and SPE Rev.C2 §6.1.3 separately call for additional/new capacity after site survey. Existing physical link is not NEW procurement: identify whether the additional installation is parallel link/upgrade, its exact endpoints, equipment owner, antenna and cable before posting new hardware cost."}
 ];
 return {
  site,fx:{thbPerUsd:fxReady?thbPerUsd:null},
  basis:"MTO Rev04 row43–47 + RPT-0001 Rev.C1 + BLD/TC/CAL + NG/260916-ADV-DAP1 + canonical TAG Ledger",
  sourceClassification:MR0001_SITE_CLASSIFICATION.sites[site],
  siteLinks:zwp8Links.map(x=>({id:x.id,from:x.from,to:x.to,mode:x.mode,txAntenna:x.reportTxAntenna,rxAntenna:x.reportRxAntenna,installedLinkState:x.installedLinkState||"NEW_DESIGN_INTERFACE",capacityScope:x.capacityScope||"Phase 1F planned link, technical/OEM confirmation required",newReplacementAutomaticallyRequired:x.newReplacementAutomaticallyRequired??null})),
  physicalGroup,sourceUnitUSD:{...units,oduScenarioWithAccessories:radioUnitFromScenario},
  currencyTotals:{USD:quotedUSD,THB:quotedTHB},
  currentWorkingTHB:displayedTHB,duplicatedSurgeUSD:sourceOverlapUSD,
  misplacedPOEUSD:wrongOwnerPOEUSD,adjustedOwnerTotalUSD:uniqueUSD,
  adjustedOwnerTotalTHB:adjustedTHB,
  ledgerCoverage:{costed:ledger.costedRows,total:ledger.totalRows,unpricedTags:ledger.unresolvedRows.map(x=>x.tag)},
  otherSites,issues,
  calculation:"ZWP8 working = A1+A2+A4+A5 (one PTMP base) + A6+A7 (one IDU interface) + A12 (one 90° sector) + B1+B2+B3+B5 (one additional PTP candidate) + B6+B7 (one PTP IDU interface) + B12 (one PTP parabolic) + two individually owned surge rates + separately posted LAN/TCAB/Bulk. Existing assets excluded as new purchases.",
  flags:{verifiedArithmetic:canQuantifyOverlap,uniqueCostOwnerPassed:ownersVerified&&surgeSourcesValid&&sourceOverlapUSD===0,
   vendorTechApproved:false,baseStationLicenceApproved:false,nmsEntitlementVerified:false,physicalNewReuseApproved:false,customerReleased:false},
  policy:"AUDIT_ONLY_DO_NOT_MUTATE_LOCKED_LEDGER_OR_AUTO_APPROVE_DESIGN"
 };
}
