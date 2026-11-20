import PARTICULAR from "./documentParticularRequirements0553.json";
import CONFLICTS from "./documentParticularConflicts0553.json";
const normalize=s=>String(s||"").toUpperCase().replace(/\s+/g,"").replace("ZWP08","ZWP8");
export function traceTagParticular0553(site,tag){
 const s=normalize(site), t=normalize(tag);
 const clauses=PARTICULAR.records.filter(r=>r.tags.map(normalize).includes(t)||r.tags.map(normalize).includes(s)||r.tags.includes("SYSTEM"));
 const classify=r=>r.tags.map(normalize).includes(t)?"TAG":r.tags.map(normalize).includes(s)?"SITE":"SYSTEM";
 const order={TAG:0,SITE:1,SYSTEM:2};
 clauses.sort((a,b)=>order[classify(a)]-order[classify(b)]||a.id.localeCompare(b.id));
 const conflicts=CONFLICTS.records.filter(r=>r.tags.map(normalize).includes(t)||r.tags.map(normalize).includes(s)||r.tags.includes("SYSTEM"));
 return {projectId:PARTICULAR.projectId,site,tag,
  direct:clauses.filter(r=>classify(r)==="TAG"),
  siteSpecific:clauses.filter(r=>classify(r)==="SITE"),
  common:clauses.filter(r=>classify(r)==="SYSTEM"),
  conflicts,releaseAllowed:false,
  rule:"Source clause is an engineering proof obligation; it is NOT a priced BOM, accepted vendor product or automatic cost posting"};
}
