import {COMMISSIONING_PHASES_0550,commissioningPhase0550} from './commissioningSparePhases0550';
import {CERAGON_R12_0550} from './ceragonSelection0550';
import {mgwCurrentOffer0550} from './mgwQuoteSelection0550';
import {roundMoney0550} from './money0550';
import {vendorOfferEntries0550,vendorQuoteRowTreatment0550} from './vendorRegister0550';

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

const spareDescription=description=>/\bspares?\b|\bcommissioning kit\b/i.test(description||'');
const spareWbs=new Set(['B5','C2','C3']);
const isMgwReferenceOffer=offer=>Boolean(offer?.mgwQuoteLineId)||mgwCurrentOffer0550(offer);
const spareReferenceNote=(line,offer,treatment)=>{
 if(offer?.id===CERAGON_R12_0550||line?.wbs==='C2'||/\bcapital spares?\b/i.test(offer?.description||''))return 'Capital spares · Schedule C4';
 if(line?.wbs==='C3'||offer?.quoteEvidence?.revision==='SP2'||/\b(?:two[- ]year|operation(?:al)?) spares?\b/i.test(offer?.description||''))return 'Operation spares · Schedule C3';
 if(offer?.supplierQuoteRow?.parentOfferId&&offer.supplierQuoteRow.parentOfferId!==offer.id&&treatment!=='OPTION')return 'Included in supplier NET package';
 if(treatment==='REFERENCE')return 'Supplier reference / included item';
 if(treatment==='OPTION')return 'Supplier option';
 if(isMgwReferenceOffer(offer))return 'MGW equipment / service · Draft reference for C2 · not allocated';
 return 'C2 allocation OPEN';
};

// Internal display data only. Keep these references outside scheduleRows and
// keep supplier currency, quantities, and costs on their own source basis.
export function c2DraftRowsFromExisting0550(data,model){
 const lines=(model.provisional?.lines||model.lines).filter(line=>line.selected);
 const activeOffers=new Map(lines.filter(line=>line.offerId).map(line=>[line.offerId,line]));
 const bindings=new Map((data.bidVolumes?.bindings||[]).map(binding=>[binding.lineId,binding]));
 const groups=new Map(),offerEntries=vendorOfferEntries0550(data);
 const entryById=new Map(offerEntries.map(entry=>[entry.offer.id,entry]));
 const selectedKits=new Set(offerEntries.filter(({offer:o})=>o.supplierQuoteRow?.itemCode==='18020'&&
  o.quoteEvidence?.systemTokens.includes('TEL-PAGA')&&activeOffers.has(o.supplierQuoteRow.parentOfferId)).map(({offer:o})=>o.vendorId));
 const add=(token,key,row)=>{
  if(!token||token==='COMMON')return;
  if(!groups.has(token))groups.set(token,new Map());
  const rows=groups.get(token);
  if(!rows.has(key))rows.set(key,row);
 };
 const amount=(quantity,rate)=>Number.isFinite(quantity)&&Number.isFinite(rate)?roundMoney0550(quantity*rate):null;
 const addReference=(token,offer,line)=>{
  const evidence=offer?.quoteEvidence,sourceRow=offer?.supplierQuoteRow,entry=entryById.get(offer?.id);
  const treatment=entry&&vendorQuoteRowTreatment0550(entry);
  const quantity=line?line.quantity:evidence?.quotedQuantity??sourceRow?.quantity;
  const unitCost=line?line.costRate:evidence?evidence.quotedUnitCost:offer.unitCost;
  const quotedTotal=Number.isFinite(evidence?.quotedTotal)?evidence.quotedTotal:amount(quantity,unitCost);
  const working=line||activeOffers.get(sourceRow?.parentOfferId)||activeOffers.get(offer?.id);
  const description=line?.description||offer?.description||line?.id;
  const binding=bindings.get((line||activeOffers.get(offer?.id))?.id);
  const partNo=binding?.partNo||offer?.description?.match(/\bP\s*\/\s*N\s+([^\s·,;]+)/i)?.[1];
  add(token,offer?.id||line.id,{description,partNo,quoteItem:sourceRow?.itemCode,
   quantity,unit:line?.unit||evidence?.quotedUnit||sourceRow?.quotedUnit||offer?.unit,
   unitCost,totalCost:line?line.provisionalCostNative??amount(quantity,unitCost):quotedTotal,
   currency:line?.currency||evidence?.quotedCurrency||offer?.currency,
   source:[offer&&'07 Vendor · '+offer.quoteRef,working&&'10.2 Working '+working.wbs[0]+' · '+working.id].filter(Boolean).join(' / '),
   note:spareReferenceNote(working,offer,treatment)});
 };
 for(const line of lines){
  const offer=entryById.get(line.offerId)?.offer;
  if(line.offerId&&!offer)continue;
  if(spareWbs.has(line.wbs)||spareDescription(line.description)||spareDescription(offer?.description))addReference(line.systemToken,offer,line);
 }
 for(const {offer,sourceSystemTokens} of offerEntries){
  const sourceRow=offer.supplierQuoteRow;
  const kit=sourceRow?.itemCode==='18020'&&sourceSystemTokens.includes('TEL-PAGA');
  const isSpare=spareDescription(offer.description);
  const isMgwForSystem=isMgwReferenceOffer(offer)&&sourceSystemTokens.length>0;
  if(!kit&&!isSpare&&!isMgwForSystem)continue;
  if(kit&&selectedKits.has(offer.vendorId)&&!activeOffers.has(sourceRow.parentOfferId))continue;
  for(const token of sourceSystemTokens)addReference(token,offer);
 }
 return new Map([...groups].map(([token,rows])=>[token,[...rows.values()]]));
}

// Draft layout only. A project-level Working allowance is not a system spare form.
// Always include every non-COMMON system, even when no B5 rows are allocated yet.
export function c2SystemGroups0550(view,references){
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
  const draftRows=group.rows.length?[]:references?.get(group.token)||[];
  return {...group,draftRows,status:group.rows.length?'HAS_ROWS':draftRows.length?'DRAFT_FROM_EXISTING':'AWAITING_B5',pendingPhases};
 });
}
