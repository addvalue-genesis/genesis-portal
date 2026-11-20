// Project 0553 evidence recovery: joins earlier engineering and ownership records
// by immutable MTO source row. Read-only enrichment, never another BOM or price.
import {MR0001_PACKAGE_COMPOSITION} from "./mr0001PackageComposition";
import {MR0001_SCOPE_OWNERSHIP_AUDIT} from "./mr0001ScopeOwnershipAudit";
import {MR0001_RADIO_ROLE_MATRIX} from "./mr0001RadioRoleMatrix";
import {MR0001_INNOVA_COST_BRIDGE} from "./mr0001InnovaCostBridge";
const packages=new Map(MR0001_PACKAGE_COMPOSITION.packages.map(p=>[p.platform+"|"+p.sourceRowIndex,p]));
const roles=new Map(MR0001_RADIO_ROLE_MATRIX.sites.map(s=>[s.site,s]));
export function recoverMR0001Evidence0553(site,row,tag){
 const p=packages.get(site+"|"+row);
 const checks=MR0001_SCOPE_OWNERSHIP_AUDIT.checks.filter(x=>x.site==="ALL"||x.site.split("/").includes(site));
 const functions=(p?.components||[]).map(fn=>({
  id:fn.id,functionId:fn.functionId,quantityDriver:fn.quantityDriver,
  selectedOffer:fn.selectedOffer,requiredQty:fn.requiredQty,
  candidateQuotes:fn.candidateQuotes,technicalState:fn.technicalState,
  proofRequired:fn.proofRequired
 }));
 const innova=MR0001_INNOVA_COST_BRIDGE.candidates.filter(x=>x.site===site&&x.packageId===p?.id);
 return {site,row,tag,sourcePackage:p?.id||null,family:p?.equipmentFamily||null,
  functions,relatedLinks:p?.relatedLinks||[],siteRadioRoles:roles.get(site)?.roles||[],
  ownershipChecks:checks,bulkRateCandidates:innova,
  ownershipStatus:MR0001_SCOPE_OWNERSHIP_AUDIT.siteRoles.find(x=>x.site===site)?.ownershipApproval||"NOT_CLASSIFIED",
  priceApproval:"NEVER_PROMOTE_CANDIDATE_TO_BOOKED_COST"};
}
