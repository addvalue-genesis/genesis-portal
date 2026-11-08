import {COMMISSIONING_PHASES_0550} from './commissioningSparePhases0550';

const legacyProjectLots=new Set(COMMISSIONING_PHASES_0550.map(phase=>phase.legacyId));
const knownKey=value=>{
 const key=value?.trim().toUpperCase();
 return key&&key!=='OPEN'?key:'';
};

export function c2ProjectLotOverlaps0550(rows){
 const equipment=new Map();
 for(const row of rows){
  const key=knownKey(row.mainEquipment);
  if(!key||!row.line||row.line.selected===false||row.nonAdditive)continue;
  const projectLot=row.unit?.trim().toUpperCase()==='LOT'&&
   (legacyProjectLots.has(row.lineId)||/^PROJECT\s*·/i.test(row.line.description?.trim()));
  if(!projectLot&&!knownKey(row.partNo))continue;
  if(!equipment.has(key))equipment.set(key,{mainEquipment:row.mainEquipment.trim(),lots:[],parts:[]});
  equipment.get(key)[projectLot?'lots':'parts'].push(row);
 }
 return [...equipment.values()].filter(group=>group.lots.length&&group.parts.length);
}

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
