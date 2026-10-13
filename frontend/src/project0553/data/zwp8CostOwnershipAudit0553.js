// PJ2608-0553 — ZWP8 source-backed, read-only O&G cost-ownership audit.
// NEVER mutates the frozen MR0001 ledger, vendor quotation, management scenario,
// Brownfield NEW/REUSE selection, or approval/release flags.
import {summarizeMR0001TagCost0553} from "./mr0001TagCostLedger0553";
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
 const radioUnitFromScenario=ZWP8_ROW43_COST_TRACE.referenceScenarios.find(x=>x.id===ZWP8_ROW43_COST_TRACE.preferredScenarioId)?.radioAssemblyUnitUSD??null;
 const radioSourcesValid=radios.length===2&&radios.every(r=>r.countedInWorkingTotal&&r.currency==="USD"&&r.extended===radioUnitFromScenario);
 const surgeSourcesValid=surge.length===2&&surge.every(r=>r.countedInWorkingTotal&&r.currency==="USD"&&r.extended===units.surge);
 const iduSourcesUnpriced=idu.length===2&&idu.every(r=>!r.countedInWorkingTotal);
 const canQuantifyOverlap=radioSourcesValid&&surgeSourcesValid&&
  quoteRadioCodes.includes("B-8")&&Number.isFinite(units.surge);
 const sourceOverlapUSD=canQuantifyOverlap?round(radios.length*units.surge):null;
 const wrongOwnerPOEUSD=radioSourcesValid&&quoteRadioCodes.includes("B-6")&&quoteRadioCodes.includes("B-7")?
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
  {id:"ZWP8-OWN-01",level:canQuantifyOverlap?"ERROR":"REVIEW",title:"Ethernet Surge B-8 posted twice",
   amountUSD:sourceOverlapUSD,
   details:"Both radio ODU scenario prices contain B-8 (USD "+units.surge+" each) and SA-502-002/003 each book the same B-8 as a separate surge cost owner. Remove from ODU only after controlled owner allocation; never delete the required surge scope."},
  {id:"ZWP8-OWN-02",level:radioSourcesValid&&iduSourcesUnpriced?"ERROR":"REVIEW",title:"B-6/B-7 indoor PoE booked under ODU while IDU TAGs remain unpriced",
   amountUSD:wrongOwnerPOEUSD,
   details:"ODU bundle includes B-6/B-7 USD "+units.poe+" each; two source IDU TAGs are recorded but not separately allocated. Move PoE interface value to IDU only once; this does NOT establish a compliant standalone IDU."},
  {id:"ZWP8-ENG-03",level:"REVIEW",title:"Two radio and two antenna NEW/reuse decisions not source-confirmed",
   amountUSD:null,
   details:"MTO Rev04 grouped row43 lists 2 ODU + 2 IDU + 2 antenna Set scopes for functional engineering. The ZPQ↔ZWP8 PTP connection is an EXISTING BASELINE link in BLD-0001 Rev.C1. BOD Rev.C2 §7.2 calls for an additional new capacity link after site survey, but does not turn the existing baseline link into two automatically replaceable radio/antenna assemblies. Confirm exact added hardware, reused interfaces and scope before procurement."},
  {id:"ZWP8-ENG-04",level:"REVIEW",title:"4ft antenna alternative vs RPT/TC/CAL not reconciled",
   amountUSD:null,
   details:"RPT ZWP8 connects ZWP20 and ZWP22 as PTMP sector endpoints and ZPQ as PTP parabolic. MTO row43 TC cites 6ft/6ft, CAL cites 4ft/4ft; quoting B-12 x2 4ft is a provisional cost scenario, not verified RF requirement."},
  {id:"ZWP8-COM-05",level:"REVIEW",title:"Vendor source quoted quantity is not ZWP8 engineering purchase quantity",
   amountUSD:null,
   details:"Next G original B-12 quotedQty="+(line("B-12")?.qty??"NA")+" globally while ZWP8 scenario assumes 2 antennas; B group radio lines quotedQty="+(line("B-1")?.qty??"NA")+" globally across possible sites. The original quote is not a supplier-confirmed ZWP8 quantity allocation."},
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
  calculation:"Current quoted ZWP8 ledger = 2×(B1+B2+B3+B5+B6+B7+B8)+2×B12+2×B8+LAN+TCAB+Bulk; unique-owner what-if = current − 2×B8",
  flags:{verifiedArithmetic:canQuantifyOverlap,uniqueCostOwnerPassed:canQuantifyOverlap&&sourceOverlapUSD===0,
   vendorTechApproved:false,physicalNewReuseApproved:false,customerReleased:false},
  policy:"AUDIT_ONLY_DO_NOT_MUTATE_LOCKED_LEDGER_OR_AUTO_APPROVE_DESIGN"
 };
}
