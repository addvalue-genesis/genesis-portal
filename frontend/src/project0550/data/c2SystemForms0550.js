import {COMMISSIONING_PHASES_0550,commissioningPhase0550} from './commissioningSparePhases0550';

export function c2PartsDescription0550({line,lineId}){
 return lineId?.startsWith('LINE-B5-LAN-STARTUP-')?line.description.replace(/^SI estimate · (?=LAN start-up spare · )/,''):line.description;
}

const legacyProjectLots=new Set(COMMISSIONING_PHASES_0550.map(phase=>phase.legacyId));
const knownKey=value=>{
 const key=value?.trim().toUpperCase();
 return key&&key!=='OPEN'?key:'';
};

export function c2ProjectLotOverlaps0550(rows){
 const equipment=new Map(),systems=new Map();
 for(const row of rows){
  if(!row.line||row.line.selected===false||row.nonAdditive)continue;
  const partNo=knownKey(row.partNo);
  const projectLot=row.unit?.trim().toUpperCase()==='LOT'&&
   (!partNo||legacyProjectLots.has(row.lineId)||/^PROJECT\s*·/i.test(row.line.description?.trim()));
  if(!projectLot&&!partNo)continue;
  const category=projectLot?'lots':'parts';
  const systemToken=row.line.systemToken||'COMMON';
  if(!systems.has(systemToken))systems.set(systemToken,{systemToken,lots:[],parts:[]});
  systems.get(systemToken)[category].push(row);
  const key=knownKey(row.mainEquipment);
  if(key){
   if(!equipment.has(key))equipment.set(key,{mainEquipment:row.mainEquipment.trim(),lots:[],parts:[]});
   equipment.get(key)[category].push(row);
  }
 }
 const matches=group=>group.lots.length>0&&group.parts.length>0;
 const systemWarnings=[...systems.values()].filter(group=>{
  if(!matches(group))return false;
  const keys=new Set([...group.lots,...group.parts].map(row=>knownKey(row.mainEquipment)));
  return keys.has('')||keys.size>1;
 });
 return [...equipment.values()].filter(matches).concat(systemWarnings);
}

export const c2HasSystem0550=row=>Boolean(row.line?.systemToken&&row.line.systemToken!=='COMMON');

// Draft layout only. A project-level Working allowance is not a system spare form.
export function c2SystemGroups0550(view){
 const groups=new Map((view.c2Systems||[]).filter(({token})=>token!=='COMMON').map(({token,name})=>[token,{token,name,rows:[]}]));
 for(const row of view.scheduleRows('C2')){
  if(!c2HasSystem0550(row))continue;
  const token=row.line.systemToken;
  if(!groups.has(token))groups.set(token,{token,name:token,rows:[]});
  groups.get(token).rows.push(row);
 }
 return [...groups.values()].filter(group=>!view.c2SystemToken||group.token===view.c2SystemToken).map(group=>{
  const phases=new Set(group.rows.map(row=>row.line&&commissioningPhase0550(row.line)));
  const pendingPhases=COMMISSIONING_PHASES_0550.filter(phase=>!phases.has(phase.id));
  return {...group,pendingPhases};
 });
}
