import {COMMISSIONING_PHASES_0550,commissioningPhase0550} from './commissioningSparePhases0550';
import {CERAGON_R12_0550} from './ceragonSelection0550';
import {mgwCurrentOffer0550} from './mgwQuoteSelection0550';
import {roundMoney0550,displayPriceCheck0550} from './money0550';
import {vendorOfferEntries0550,vendorQuoteRowTreatment0550} from './vendorRegister0550';
import {evaluateServiceEquation,SPARE_EQUATION_SCHEDULES_0550} from '../serviceEquationRuntime';
import {mgwDetailGroupBasis0550} from './mgwDetailPricing0550';
import {sourceAmountTHB0550} from './supplierCostProjection0550';

export const SPARE_DRAFT_NOTE_0550='Draft from SI equation — not allocated to Schedule. Does not enter Volume I totals until bound in 11.M.';
const countUnits=new Set(['Pc','U','SET']);
const knownNumber=n=>typeof n==='number'&&Number.isFinite(n);
// Only quantity is new. Selling and FX use the existing E10/E11/E12, E13,
// source-to-THB and E17 path, with the parent's saved commercial policy.
function draftPrice(data,line,quantity,unitCost,currency,unit){
 const eq=(id,inputs)=>evaluateServiceEquation(id,inputs).value;
 const rawCost=knownNumber(quantity)&&knownNumber(unitCost)?quantity*unitCost:null;
 const totalCost=roundMoney0550(rawCost);
 let sell=null;
 if(line.sellMode==='DIRECT'&&currency===line.currency&&unit===line.unit&&knownNumber(line.sellRate))sell=eq('E10',{rows:[{id:line.id,quantity,sellRate:line.sellRate}],other:0});
 if(rawCost!==null&&line.sellMode==='MARKUP'&&knownNumber(line.markupPct))sell=eq('E11',{cost:rawCost,markup:line.markupPct/100});
 if(rawCost!==null&&line.sellMode==='MARGIN'&&knownNumber(line.marginPct))sell=eq('E12',{cost:rawCost,margin:line.marginPct/100});
 const customerNative=sell!==null&&knownNumber(line.primePct)?eq('E13',{sell,primeMarkup:line.primePct/100}):null;
 const customerTHB=roundMoney0550(sourceAmountTHB0550(customerNative,currency,data.fx));
 const usd=customerTHB!==null&&data.fx?.source?.trim()&&data.fx?.date&&data.fx.thbPerUSD>0?eq('E17',{THB:customerTHB,fx:data.fx.thbPerUSD}):currency==='USD'?customerNative:null;
 const amount=roundMoney0550(usd),unitPrice=quantity===0&&amount===0?0:displayPriceCheck0550(amount,quantity).unitPrice;
 return {totalCost,customerTHB,amount,unitPrice};
}

// Read-only projection of selected Working A + current 07 offers + saved SI
// inputs. No Working line, price owner, allocation, A1/A2 or history is written.
// Equipment quantity is N; it must never be mistaken for vendor spare quantity.
export function spareEquationDraftRows0550(data,model,schedule,systemToken){
 const equationId=Object.keys(SPARE_EQUATION_SCHEDULES_0550).find(id=>SPARE_EQUATION_SCHEDULES_0550[id]===schedule);
 if(!equationId)return new Map();
 const current=vendorOfferEntries0550(data),byOffer=new Map(current.map(e=>[e.offer.id,e]));
 const shown=new Map((model.provisional?.lines||model.lines||[]).map(l=>[l.id,l]));
 const groups=new Map(),seen=new Set();
 const add=row=>{if(!groups.has(row.systemToken))groups.set(row.systemToken,[]);groups.get(row.systemToken).push(row);};
 for(const raw of data.lines||[]){
  const line=shown.get(raw.id)||raw;
  if(raw.wbs!=='A'||raw.selected!==true||line.selected===false||raw.coveredByLineId||raw.responsibility==='COMPANY'||line.mrScopeState?.covered||line.mrScopeState?.excluded||line.satelliteScopeState?.excluded||(systemToken&&raw.systemToken!==systemToken))continue;
  const direct=byOffer.get(raw.offerId)?.offer;
  const packageBasis=raw.mgwDetailGroupId?mgwDetailGroupBasis0550(data,raw.mgwDetailGroupId,raw):null;
  const equipment=packageBasis?packageBasis.source.rows.flatMap((row,i)=>packageBasis.offers[i]?.length===1&&byOffer.has(packageBasis.offers[i][0].id)?[{offer:packageBasis.offers[i][0],N:null,unit:row.unit}]:[]):direct?[{offer:direct,N:countUnits.has(line.unit)?line.quantity:null,unit:line.unit}]:[];
  // Explicit OEM spare children of a selected NET package are valid references;
  // unselected revisions/options do not become spare demand by system alone.
  const children=direct?current.filter(e=>e.offer.supplierQuoteRow?.parentOfferId===direct.id&&e.offer.id!==direct.id&&spareDescription(e.offer.description)).map(e=>({offer:e.offer,N:null,unit:e.offer.unit})):[];
  for(const source of [...equipment,...children]){
   const offer=source.offer,key=raw.systemToken+'|'+raw.id+'|'+offer.id;
   if(seen.has(key))continue;seen.add(key);
   const declared=spareReferenceNote(null,offer,byOffer.get(offer.id)?.referenceOnly?'REFERENCE':'');
   const isSpare=spareDescription(offer.description)||offer.supplierQuoteRow?.itemCode==='18020';
   if(isSpare&&((declared.includes('C4')&&schedule!=='C4')||(declared.includes('C3')&&schedule!=='C3')||(!declared.includes('C3')&&!declared.includes('C4')&&schedule!=='C2')))continue;
   const calculations=(data.calculations||[]).filter(c=>c.equationId===equationId&&c.systemToken===raw.systemToken&&c.inputs?.workingLineId===raw.id&&
    (c.inputs.offerId===offer.id||!c.inputs.offerId&&equipment.length===1&&offer.id===direct?.id));
   const calc=calculations.length===1?calculations[0]:null;
   const issues=[];
   if(packageBasis)issues.push('Package component quote quantity is not installed MR quantity; use the source-backed SI N input');
   const inputs={includedInKit:0,approvedStock:0,...(calc?.inputs||{})};
   if(!calc)issues.push(calculations.length?'Ambiguous SI calculation for Working / Offer':'SI quantity inputs OPEN');
   if(!Object.hasOwn(calc?.inputs||{},'includedInKit'))issues.push('Kit coverage unconfirmed; no deduction assumed');
   if(!Object.hasOwn(calc?.inputs||{},'approvedStock'))issues.push('Stock release unconfirmed; no deduction assumed');
   if(knownNumber(source.N)&&countUnits.has(source.unit)){
    if(knownNumber(inputs.N)&&inputs.N!==source.N)issues.push('Saved N differs; current Working / MR population used');
    inputs.N=source.N;
   }
   // Only an expressly identified spare line supplies an OEM quantity candidate.
   const vendorQty=offer.quoteEvidence?.quotedQuantity??offer.supplierQuoteRow?.quantity;
   const qtyKey=schedule==='C4'?'oemListQty':'vendorQty';
   if(isSpare&&knownNumber(vendorQty)&&!Object.hasOwn(inputs,qtyKey))inputs[qtyKey]=vendorQty;
   const result=calculations.length>1?{state:'OPEN',value:null,errors:['Ambiguous SI calculations']}:evaluateServiceEquation(equationId,inputs);
   const unit=offer.quoteEvidence?.quotedUnit||offer.unit||source.unit;
   const currency=offer.currency;
   // A net Lot is not a replacement component unit price. Preserve missing
   // rates instead of dividing package totals or copying supplier quoted totals.
   const unitCost=(isSpare||countUnits.has(unit))&&knownNumber(offer.unitCost)?offer.unitCost:null;
   if(unitCost===null)issues.push('Replacement spare unit cost OPEN / package basis');
   if(!isSpare&&unitCost!==null)issues.push('Existing equipment unit rate reference; OEM replacement price confirmation OPEN');
   if(!calc?.sourceRef?.trim())issues.push('SI source / applicability reference OPEN');
   if(!raw.requirementRef?.trim()&&!raw.mrRequirementId)issues.push('CUS / MR reference OPEN');
   const price=draftPrice(data,line,result.value,unitCost,currency,unit);
   if(price.amount===null)issues.push('Existing selling policy / Prime / FX inputs OPEN');
   const sourceRef=[raw.requirementRef,raw.mrRequirementId,offer.quoteRef,offer.sourceRef,calc?.sourceRef].filter(Boolean).join(' / ');
   add({id:'draft-'+schedule+'-'+raw.id+'-'+offer.id,systemToken:raw.systemToken,schedule,equationId,calculationId:calc?.id||'',inputs,result,
    workingLineId:raw.id,offerId:offer.id,partNo:calc?.inputs.partNo||'',description:offer.description||raw.description,
    quantity:result.value,unit,unitCost,totalCost:price.totalCost,currency,amount:price.amount,unitPrice:price.unitPrice,customerTHB:price.customerTHB,
    note:SPARE_DRAFT_NOTE_0550,workspaceRevision:data.revision,source:'CUS / '+(raw.requirementRef||raw.mrRequirementId||'OPEN')+' / 10.2 Working A · '+raw.id+' / 07 Vendor · '+offer.id+' / SI · '+equationId,
    sourceRef,issues:[...issues,...result.errors],equationDraft:true,nonAdditive:true,priceOwner:false});
  }
 }
 return groups;
}
export const c2EquationDraftRows0550=(data,model,systemToken)=>spareEquationDraftRows0550(data,model,'C2',systemToken);
export const c3EquationDraftRows0550=(data,model,systemToken)=>spareEquationDraftRows0550(data,model,'C3',systemToken);
export const c4EquationDraftRows0550=(data,model,systemToken)=>spareEquationDraftRows0550(data,model,'C4',systemToken);

// Explicit user action only. Promote a quantity draft into a new canonical
// spare owner; never bind the installed equipment's A owner to a spare schedule.
export function prepareEquationSpareWorking0550(data,draft,id){
 if(data.revision!==draft.workspaceRevision)throw Error('Working / Offer changed; refresh the SI draft first');
 const parent=data.lines.find(l=>l.id===draft.workingLineId),offer=data.offers.find(o=>o.id===draft.offerId);
 if(!parent?.selected||!offer||draft.result.state!=='CALCULATED'||!(draft.quantity>0)||!knownNumber(draft.unitCost)||!countUnits.has(draft.unit))throw Error('Complete SI quantity, matching spare unit and unit cost before preparing Working');
 const wbs={C2:'B5',C3:'C3',C4:'C2'}[draft.schedule];
 const existing=data.lines.find(l=>l.wbs===wbs&&l.calculationId&&data.calculations.some(c=>c.id===l.calculationId&&c.equationId===draft.equationId&&c.inputs?.workingLineId===parent.id&&c.inputs.offerId===offer.id));
 if(existing)return {workspace:data,lineId:existing.id};
 const calculationId=draft.calculationId||id+'-CAL';
 const calculation={id:calculationId,title:draft.schedule+' spare quantity / '+draft.description,systemToken:parent.systemToken,equationId:draft.equationId,inputs:{...draft.inputs,workingLineId:parent.id,offerId:offer.id},sourceRef:[draft.sourceRef,...draft.issues].join(' / ')};
 const line={id,systemToken:parent.systemToken,wbs,description:draft.description,scopeKey:'SI-SPARE.'+draft.schedule+'.'+parent.id+'.'+offer.id,
  tagRef:parent.tagRef||'',requirementRef:parent.requirementRef||parent.mrRequirementId||'',sourceRef:[draft.sourceRef,SPARE_DRAFT_NOTE_0550,...draft.issues].join(' / '),
  vendorId:offer.vendorId,offerId:'',calculationId,resultKey:'value',quantity:null,unit:draft.unit,currency:draft.currency,manualCost:draft.unitCost,
  sellMode:parent.sellMode,sellRate:parent.currency===draft.currency&&parent.unit===draft.unit?parent.sellRate:null,markupPct:parent.markupPct,marginPct:parent.marginPct,primePct:parent.primePct,selected:true,customerRowCode:wbs,
  ...(wbs==='B5'?{commissioningPhase:'COMMISSIONING'}:{})};
 // Explicit preparation snapshots the live Working population used by this
 // draft, including when an older saved SI calculation supplied the policy.
 const calculations=data.calculations.some(c=>c.id===calculationId)?data.calculations.map(c=>c.id===calculationId?{...c,inputs:calculation.inputs}:c):[...data.calculations,calculation];
 return {workspace:{...data,calculations,lines:[...data.lines,line]},lineId:id};
}

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

// A preview suggestion is not a saved 11.M allocation. Prefer saved rows over
// an SI draft, while retaining legacy suggestions where no SI draft exists.
function spareDisplayRows(rows,references){
 return references?.some(row=>row.equationDraft)?rows.filter(row=>!row.suggested):rows;
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
  group.rows=spareDisplayRows(group.rows,references?.get(group.token));
  const phases=new Set(group.rows.map(row=>row.line&&commissioningPhase0550(row.line)));
  const pendingPhases=COMMISSIONING_PHASES_0550.filter(phase=>!phases.has(phase.id));
  const draftRows=group.rows.length?[]:references?.get(group.token)||[];
  return {...group,draftRows,status:group.rows.length?'HAS_ROWS':draftRows.length?'DRAFT_FROM_EXISTING':'AWAITING_B5',pendingPhases};
 });
}

export function spareSystemGroups0550(view,schedule,references){
 if(schedule==='C2')return c2SystemGroups0550(view,references);
 const rows=view.scheduleRows(schedule),groups=new Map((view.c2Systems||[]).filter(s=>s.token!=='COMMON').map(s=>[s.token,{...s,rows:[]}]));
 for(const row of rows){const token=row.line?.systemToken||'COMMON';if(!groups.has(token))groups.set(token,{token,name:token,rows:[]});groups.get(token).rows.push(row);}
 for(const token of references?.keys()||[])if(!groups.has(token))groups.set(token,{token,name:token,rows:[]});
 const result=[...groups.values()].filter(g=>g.rows.length||references?.get(g.token)?.length).filter(g=>!view.c2SystemToken||view.c2SystemToken===g.token).map(g=>{
  const candidates=references?.get(g.token),rows=spareDisplayRows(g.rows,candidates);
  return {...g,rows,draftRows:rows.length?[]:candidates||[],status:rows.length?'HAS_ROWS':'DRAFT_FROM_EQUATION'};
 });
 return result.length?result:[{rows:[],draftRows:[],status:'AWAITING_SPARE_INPUTS'}];
}
