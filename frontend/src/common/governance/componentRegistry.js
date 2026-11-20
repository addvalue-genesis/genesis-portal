// GENESS shared identity rules. Does not store project facts or change legacy route keys.
// Stable identity is separate from the visible position (which may be renamed/reordered).
export function createComponentRegistry({projectId,stage,area,tabs,components=[]}){
 if(!projectId||!stage||!area)throw Error("Project, stage and area are required");
 const items=tabs.map(([route,title],index)=>Object.freeze({
  id:`${projectId}:${stage}-${area}:${route}`,
  displayCode:`${stage}-${area}-${String(index+1).padStart(2,"0")}`,
  route,title,projectId,stage,area
 }));
 const seen=new Set();
 for(const item of items){if(seen.has(item.id))throw Error("Duplicate route identity: "+item.id);seen.add(item.id);}
 return Object.freeze({projectId,stage,area,tabs:Object.freeze(items),components:Object.freeze(components)});
}
// Semantic names are stable identifiers: never derive them from display order.
export function assignSemanticNames(registry, definitions){
 const byRoute=new Map(definitions.map(d=>[d.route,d]));
 const codes=new Set();
 const tabs=registry.tabs.map(tab=>{
  const def=byRoute.get(tab.route);
  if(!def||!/^([A-Z]{2,8}-){1,3}[A-Z]{2,8}$/.test(def.code))throw Error("Missing or invalid semantic code for "+tab.route);
  if(codes.has(def.code))throw Error("Duplicate semantic code: "+def.code);
  codes.add(def.code);
  return Object.freeze({...tab,semanticCode:def.code,displayCode:def.locationCode||tab.displayCode,workflowIds:Object.freeze(def.workflowIds||[]),sourcePaths:Object.freeze(def.sourcePaths||[])});
 });
 if(byRoute.size!==tabs.length)throw Error("Unmatched semantic definitions");
 return Object.freeze({...registry,tabs:Object.freeze(tabs)});
}
export function findTabBySemanticCode(registry,code){return registry.tabs.find(t=>t.semanticCode===code)||null;}
export function findTabIdentity(registry,route){return registry.tabs.find(x=>x.route===route)||null;}
export function makeChangeRecord({id,projectId,workflowId,componentId,reason,sourceCommit,status="PROPOSED"}){
 if(!id||!projectId||!componentId||!reason)throw Error("Incomplete change record");
 return Object.freeze({id,projectId,workflowId:workflowId||null,componentId,reason,sourceCommit:sourceCommit||null,status});
}
