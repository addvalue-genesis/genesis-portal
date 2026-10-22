// PJ2608-0553: derive searchable BULK module IDs from the exact 10.1.1.3 data projection.
// Navigation is read-only; it does not post costs, approve procurement or alter source MTO.
import {deriveBulkMrLocationCoverage0553} from "./bulkMrLocationCoverage0553";
import {deriveMR0002RfPhysicalRouteReconciliation0553} from "./mr0002RfPhysicalRouteReconciliation0553";
import {deriveBulkSourceToReleaseTrace0553} from "./bulkSourceToReleaseTrace0553";

export function buildBulkModuleNavigator0553(){
 const bulk=deriveBulkMrLocationCoverage0553();
 const rf=deriveMR0002RfPhysicalRouteReconciliation0553();
 const sourceToRelease=deriveBulkSourceToReleaseTrace0553();
 const make=(id,name,keywords,site=null,mr=null)=>({
  id,anchorModuleId:id,tab:"budget",kind:"BULK_READ_ONLY",
  name,keywords,site,mr,workflowNumber:"10.1.1.3"
 });
 const result=[
  make("bid.budget.bom.system-location-mto","10.1.1.3 — System × Location × MTO","BOM source TAG working cost"),
  make(bulk.moduleId,"10.1.1.3 — BULK / Location Reconciliation","BULK all MR site system installation spare vendor included"),
  make(sourceToRelease.moduleId,"10.1.1.3 — BULK Source-to-Release Audit","source release MR0001 MR0002 MR0003 MR0004 MTO 11 20 29 36 41 47 52")
 ];
 for(const g of bulk.groups.filter(x=>x.active)){
  const title=g.site+" / "+g.mr;
  result.push(make(g.moduleId,title+" — BULK Material / Owner Reconciliation",
   title+" conditional reserve included missing cable price scope",g.site,g.mr));
  for(const item of g.items)result.push(make(item.moduleId,title+" — "+item.item,
   item.id+" "+item.state+" "+item.owner+" "+title,g.site,g.mr));
 }
 for(const g of sourceToRelease.groups){
  result.push(make(g.moduleId,g.site+" / "+g.mr+" — BULK Source-to-Release",
   "source release trace "+g.sourceRequirement+" "+g.site+" "+g.mr,g.site,g.mr));
 }
 for(const loc of rf.sites){
  result.push(make(loc.moduleId,loc.site+" / MR0002 — RF Physical Route Evidence",
   "RF DONOR SERVICE FORLLER MGW NEK spare "+loc.site,loc.site,"MR-0002"));
  for(const route of loc.circuits)
   result.push(make(route.moduleId,loc.site+" / MR0002 — "+route.name,
    "RF antenna feeder circuit "+route.id+" "+loc.site,loc.site,"MR-0002"));
 }
 const seen=new Set();
 for(const entry of result){
  if(seen.has(entry.id))throw Error("Duplicate 0553 BULK Module ID: "+entry.id);
  seen.add(entry.id);
 }
 return result;
}
