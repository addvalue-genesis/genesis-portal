// Draft layout only. Each allocation stays with its existing Working owner.
export function c2SystemGroups0550(view){
 const groups=new Map(view.c2Systems.map(({token,name})=>[token,{token,name,rows:[]}]));
 for(const row of view.scheduleRows('C2')){
  const token=row.line?.systemToken||'COMMON';
  if(!groups.has(token))groups.set(token,{token,name:token,rows:[]});
  groups.get(token).rows.push(row);
 }
 return [...groups.values()].filter(group=>!view.c2SystemToken||group.token===view.c2SystemToken);
}
