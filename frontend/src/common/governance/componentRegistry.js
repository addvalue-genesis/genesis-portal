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
export function findTabIdentity(registry,route){return registry.tabs.find(x=>x.route===route)||null;}
export function makeChangeRecord({id,projectId,workflowId,componentId,reason,sourceCommit,status="PROPOSED"}){
 if(!id||!projectId||!componentId||!reason)throw Error("Incomplete change record");
 return Object.freeze({id,projectId,workflowId:workflowId||null,componentId,reason,sourceCommit:sourceCommit||null,status});
}
