// The HTML and DOCX bodies come from the supplied Word file, including merges,
// notes and fixed labels. Only bidder response slots are substituted here.
import template from './data/exhibitCNativeTemplate0550.json';
import {chevalierPbxScheduleNote0550,chevalierPbxScheduleTrace0550} from './data/chevalierPbxQuote0550';
import {sumMoney0550} from './data/money0550';
import {scheduleRollup0550,rollupNote0550} from './data/scheduleRollup0550';
import {zipStore} from './exportOriginalPriceForm';
import {customerPriceColumn0550} from './data/scheduleDiagnostics0550';
import {isLicensingCostLine0550} from './data/licensingScope0550';
import {isC1Appendix0550,c1AppendixHtml0550,c1AppendixWord0550,c1AppendixCss0550,deriveC1Appendix0550} from './data/c1Appendix0550';
import {c2PartsDescription0550,c2SystemGroups0550,spareSystemGroups0550,SPARE_DRAFT_NOTE_0550} from './data/c2SystemForms0550';
import {paymentSchedule0550} from './data/bidVolumes0550';
import {C8_TOTAL_DESCRIPTION_0550,C8_TOTAL_NOTE_0550,c8CalloffTotal0550,c8Country0550,c8OtherFacilities0550,c8Revision0550,c8Unit0550} from './data/c8Calloff0550';

export const NATIVE_SUMMARIES_0550=[['GOODS','GOODS / C1'],['INSPECTION','Inspection and tests'],['PACKING','Preservation and packing'],['COMMISSIONING_SPARES','Commissioning spares / C2'],['OPERATION_SPARES','Two-year operation spares / C3'],['CAPITAL_SPARES','Capital spares / C4'],['SPECIAL_TOOLS','Special tools / C5'],['CONSUMABLES','Filling materials / C6'],['FIELD_SERVICE','Site Service / C7'],['TRAINING','Training / C7'],['OFFICE','Office / C8'],['TRANSPORT','In-city Transportation / C8'],['AIRPORT','Airport Pick-up & Drop-off / C8'],['OFFICE_CONSUMABLES','Office consumables / C8'],['WORKING_LUNCH','Working Launch / C8 (source label)'],['VENDOR_DOCUMENTS','Vendor Documents'],['OTHER','Others (Please specify)']];
export const NATIVE_FIELDS_0550={A:[['agreementNo','Agreement / Contract No.']],C2:[['vendorNameAddress','VENDOR name and address']],C3:[['vendorNameAddress','VENDOR name and address']],C4:[['vendorNameAddress','VENDOR name and address']],C7:[['sitePeriodDays','Free site service period in days'],['trainingPeriodDays','Proposed training period in days']]};
const escape=v=>String(v??'OPEN').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=v=>typeof v==='number'&&Number.isFinite(v)?v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):'OPEN';
const value=v=>v===null||v===undefined||v===''?'OPEN':String(v);
const sum=rows=>sumMoney0550(rows.map(b=>b.amount));
const shownSum=(view,rows)=>view.workingPreview?scheduleRollup0550(rows).knownUSD:sum(rows);
const subtotalNote=(view,rows)=>view.workingPreview?rollupNote0550(scheduleRollup0550(rows)):'';
const sparePriceNote=(rows,currency)=>{
 const subtotal=scheduleRollup0550(rows);
 const status=subtotal.open?'; '+subtotal.priced+'/'+subtotal.count+' priced; '+subtotal.open+' OPEN':'';
 const basis=rows.some(b=>b.line.spareBudget)?' / Draft budget allowance; OEM breakdown OPEN':'';
 return Number.isFinite(subtotal.knownUSD)?currency+' '+number(subtotal.knownUSD)+status+basis:'OPEN'+status;
};
const chunks=(rows,n)=>Array.from({length:Math.max(1,Math.ceil(rows.length/n))},(_,i)=>rows.slice(i*n,(i+1)*n));
const field=(view,id,name)=>view.getRecord('I.'+id).nativeFields?.[name]||
 (view.workingPreview&&id==='C7'&&name==='trainingPeriodDays'&&view.tenderScheduleBasis?.training?String(view.tenderScheduleBasis.training.days):'');
const facilitiesFormCheck='Exhibit C Rev.1 §3 refers to a call-off facilities form as C-7. Its contents list C7 as Field Services and Training and omit C8. Confirm the applicable form with the Purchaser.';
const term=customerPriceColumn0550;
const normalize=s=>String(s||'').trim().toUpperCase();
const aliases={GOODS:'GOODS','SITE SERVICE':'FIELD_SERVICE',TRAINING:'TRAINING',OFFICE:'OFFICE','IN-CITY TRANSPORTATION':'TRANSPORT','AIRPORT PICK-UP & DROP-OFF':'AIRPORT','OFFICE CONSUMABLES':'OFFICE_CONSUMABLES','WORKING LAUNCH':'WORKING_LUNCH'};
const role=b=>aliases[normalize(b.summary)]||normalize(b.summary);
export const a1SummarySlot0550=b=>b.schedule==='C2'?5:b.schedule==='C5'?7:b.schedule==='C7'?8:b.schedule==='C8'?9:({GOODS:2,INSPECTION:3,PACKING:4,VENDOR_DOCUMENTS:10,OTHER:11}[role(b)]);
const shared=(rows,key)=>{const values=[...new Set(rows.map(b=>b[key]||''))];return values.length===1&&values[0]?values[0]:'OPEN';};
function words(n,currency='USD'){
 if(!Number.isFinite(n))return 'OPEN';
 const small=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],tens=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
 const w=x=>x<20?small[x]:x<100?tens[Math.floor(x/10)]+(x%10?' '+small[x%10]:''):x<1000?small[Math.floor(x/100)]+' hundred'+(x%100?' '+w(x%100):''):[1e12,1e9,1e6,1e3].reduce((out,k)=>out||(x>=k?w(Math.floor(x/k))+' '+({1000:'thousand',1000000:'million',1000000000:'billion',1000000000000:'trillion'}[k])+(x%k?' '+w(x%k):''):''),'');
 if(n<0||n>=1e15)return 'OPEN';
 const cents=Math.round(n*100),whole=Math.floor(cents/100),thb=currency==='THB';
 return (thb?'Thai Baht ':'United States Dollars ')+w(whole)+(cents%100?' and '+w(cents%100)+(thb?' satang':' cents'):'')+' only';
}
const blankValues=id=>Object.fromEntries(Object.keys(template.defaults).filter(k=>k.startsWith(id+'_')).map(k=>[k,template.defaults[k]]));
// Draft price cells span both term columns until a delivery basis is assigned.
function mergeDraftPriceCells(source,id,row,column,format){
 const first=`{{${id}_${row}_${column}}}`,second=`{{${id}_${row}_${column+1}}}`;
 if(format==='html'){
  const start=id==='A2'?'<td><p style="text-align:center">':'<td><p>';
  const cell=placeholder=>start+placeholder+'</p></td>';
  return source.replace(cell(first)+cell(second),`<td colspan="2" class="native-c2-draft-price"><p style="text-align:right">${first}</p></td>`);
 }
 const start=source.lastIndexOf('<w:tc>',source.indexOf(first));
 const firstEnd=source.indexOf('</w:tc>',source.indexOf(first))+7;
 const secondEnd=source.indexOf('</w:tc>',source.indexOf(second))+7;
 const width=/<w:tcW w:w="(\d+)" w:type="(dxa|pct)"\/>/;
 const nextWidth=Number(source.slice(firstEnd,secondEnd).match(width)[1]);
 const merged=source.slice(start,firstEnd).replace(width,(_,w,type)=>`<w:tcW w:w="${Number(w)+nextWidth}" w:type="${type}"/><w:gridSpan w:val="2"/>`);
 return source.slice(0,start)+merged+source.slice(secondEnd);
}
function fill(id,values,format,currency,draftPriceRows=[]){
 let source=template.schedules[id][format];
 for(const [row,firstColumn] of draftPriceRows)for(const column of [firstColumn,firstColumn+2])source=mergeDraftPriceCells(source,id,row,column,format);
 if(format==='html'&&currency==='THB'){
  // Replace fixed currency labels in the preview template before adding user values.
  source=source.replace(/Amount in words:\s+United States Dollars?\s*/g,'Amount in words: ')
   .replace(/United States Dollars?|US Dollar or RMB|USD(?:<\/b><b>)? or RMB|US<\/b><b>D<\/b><b> or RMB/g,'THB')
   .replaceAll('US/h','THB/h').replaceAll('$/','THB/');
 }
 return source.replace(/\{\{([\w]+)\}\}/g,(_,key)=>{
  if(key==='NATIVE_RESPONSE')return '{{NATIVE_RESPONSE}}';
  const v=Object.hasOwn(values,key)?values[key]:template.defaults[key]||'';
  return escape(v).replace(/\n/g,format==='xml'?'</w:t><w:br/><w:t xml:space="preserve">':'<br>');
 });
}
function nativePages(view,id,currency='USD',c2References){
 const rows=id==='C1'&&view.workingPreview?view.nativeC1:view.scheduleRows(id),pages=[],issues=[];
 const add=(values={},detail='',metadata)=>pages.push({id,values,detail,...metadata});
 const set=(v,r,c,x)=>{v[`${id}_${r}_${c}`]=x;};
 const prices=(v,r,start,b,draftPriceRows)=>{
  const t=term(b);
  set(v,r,start,t==='CIF'?number(b.unitPrice):'');set(v,r,start+1,t==='FOB'?number(b.unitPrice):'');
  set(v,r,start+2,t==='CIF'?number(b.amount):'');set(v,r,start+3,t==='FOB'?number(b.amount):'');
  if(t)return;
  issues.push('Customer CIF/FOB term OPEN: '+b.lineId);
  const show=view.workingPreview&&!b.nonAdditive&&Number.isFinite(b.amount);
  if(show)draftPriceRows.push([r,start]);
  set(v,r,start,show&&Number.isFinite(b.unitPrice)?currency+' '+number(b.unitPrice):'OPEN');
  set(v,r,start+2,show?currency+' '+number(b.amount):'OPEN');
 };
 if(id==='A'){add();return {pages,issues};}
 if(id==='A1'||id==='A2'){
  const v=blankValues(id),base=id==='A1',part=base?'BASE':'OPTION',eligible=view.bindings.filter(b=>b.line&&b.treatment===part);
  const draftPriceRows=[];
  const slot=base?a1SummarySlot0550:b=>b.schedule==='C4'?3:b.schedule==='C7'?4:b.schedule==='C6'?5:b.schedule==='C3'?6:7;
  const groups=new Map();for(const b of eligible){const r=slot(b);if(r===undefined){issues.push('A1 summary row OPEN: '+b.lineId);continue;}if(!groups.has(r))groups.set(r,[]);groups.get(r).push(b);}
  for(const [r,bs] of groups){
   const amount=shownSum(view,bs),terms=new Set(bs.map(term));set(v,r,3,r===8&&base?'Day':'Lot');set(v,r,4,r===8&&base?value(field(view,'C7','sitePeriodDays')):1);
   if(base){set(v,r,5,r===8?value(field(view,'C7','sitePeriodDays'))+' days included in Lump Sum':number(amount));if(r===9){const qty=bs.every(b=>b.unit==='MD'&&Number.isFinite(b.quantity))?bs.reduce((n,b)=>n+b.quantity,0):null;set(v,r,3,'Day');set(v,r,4,value(qty));set(v,r,5,qty>0&&Number.isFinite(amount)?number(amount/qty):'OPEN');}set(v,r,6,number(amount));set(v,r,7,(view.workingPreview&&subtotalNote(view,bs)?(()=>{const p=scheduleRollup0550(bs);return p.priced+'/'+p.count+' priced; '+p.open+' OPEN. Known subtotal only'+(terms.has('')?' / Delivery term OPEN':'');})():(view.workingPreview&&bs.length>3?bs.length+' Working owners; allocation pending review':bs.map(b=>b.line.description).join('; '))+(terms.has('')?' / Customer delivery term OPEN':'')));}
   else{
    if(r===6||r===7)set(v,r,1,bs.map(b=>b.line.description).join('; '));
    const diemQty=r===4&&bs.every(b=>b.line.unit==='MD'&&Number.isFinite(b.line.quantity))?bs.reduce((n,b)=>n+b.line.quantity,0):null;
    if(r===4){set(v,r,3,'MD');set(v,r,4,value(diemQty));if(!diemQty||terms.size>1)issues.push('A2 DIEM quantity/rate basis OPEN');}
    const rollup=view.workingPreview?scheduleRollup0550(bs):null,assigned=[];
    for(const [t,rate,total] of [['CIF',5,7],['FOB',6,8]]){
     const selected=bs.filter(b=>term(b)===t);
     if(!selected.length)continue;
     const termAmount=shownSum(view,selected);
     set(v,r,rate,r===4?diemQty>0&&terms.size===1&&Number.isFinite(termAmount)?number(termAmount/diemQty):'OPEN':number(termAmount));
     set(v,r,total,number(termAmount));
     if(Number.isFinite(termAmount))assigned.push(t+' '+currency+' '+number(termAmount));
    }
    const notes=[];
    if(!view.workingPreview||r!==6&&r!==7)notes.push(view.workingPreview&&bs.length>3?bs.length+' quoted items':bs.map(b=>b.line.description).join('; '));
    if(terms.has('')){
     issues.push('A2 customer term OPEN');
     if(view.workingPreview&&Number.isFinite(amount)){
      draftPriceRows.push([r,5]);
      const rate=r!==4?amount:diemQty>0&&!rollup.open&&terms.size===1?amount/diemQty:null;
      set(v,r,5,Number.isFinite(rate)?currency+' '+number(rate):'OPEN');
      set(v,r,6,'');
      set(v,r,7,currency+' '+number(amount));
      set(v,r,8,'');
      notes.push('Draft price · CIF/FOB pending');
      if(assigned.length)notes.push('Assigned portions of this subtotal: '+assigned.join(' / '));
     }else{set(v,r,5,'OPEN');set(v,r,7,'OPEN');notes.push('Customer CIF/FOB term OPEN');}
    }
    if(rollup?.open)notes.push(rollup.priced+'/'+rollup.count+' priced, '+rollup.open+' OPEN');
    if(view.workingPreview&&bs.some(b=>b.line.spareBudget))notes.push('Draft budget allowance / OEM breakdown OPEN');
    set(v,r,9,notes.join(' / '));
   }
   if(base&&r===11&&view.workingPreview&&bs.some(b=>isLicensingCostLine0550(b.lineId)))v.A1_11_7+=' / Telecom import, radio and operating licence coordination (as applicable)';
   if(base&&r===11&&view.workingPreview&&bs.some(b=>b.line.a1OthersEstimate))v.A1_11_7+=' / Includes estimated freight, handling and insurance where applicable.';
   if(base&&r===5&&view.workingPreview&&bs.some(b=>b.line.spareBudget))v.A1_5_7+=' / Draft budget allowance; OEM breakdown OPEN';
  }
  if(base&&view.workingPreview){
   if(!groups.has(4)){
    set(v,4,6,'OPEN');
    set(v,4,7,(view.pagaNet?'PAGA OEM packing (item 24010) is included in A1-05. ':'')+'Confirm remaining packing scope and its Working owner before adding a separate amount.');
   }
   if(!groups.has(8)){
    set(v,8,5,'');set(v,8,6,'OPEN');set(v,8,7,'Confirm the C7 allocation and site service period.');
   }else if(!field(view,'C7','sitePeriodDays').trim()){
    set(v,8,5,'Site service period to confirm');
   }
   if(!groups.has(9)){
    const countryRates=view.scheduleRows('C8').some(c8Country0550);
    set(v,9,5,'');set(v,9,6,countryRates||view.tenderScheduleBasis?.facilitiesConflict?'See C8':'OPEN');
    set(v,9,7,countryRates?'Estimated Call-off Total. See C8.':view.tenderScheduleBasis?.facilitiesConflict?
     'Call-off form and any Base exceptions require confirmation. See C8.':'Confirm facilities scope, days and rates in C8.');
   }
   if(!groups.has(5)){
    set(v,5,5,'OPEN');set(v,5,6,'OPEN');
    set(v,5,7,'No Base price allocated to Form C-2; see Working and 11.M.');
   }
   // The native A1 note excludes 2-year spares. Expose the Option amount as
   // a reference in Notes only, without adding it to any Base price cell.
   const operation=view.scheduleRows('C3').filter(b=>b.treatment==='OPTION'&&!b.nonAdditive);
   set(v,6,6,operation.some(b=>Number.isFinite(b.amount))?'OPTION / see Notes':'OPEN');
   set(v,6,7,eligible.some(b=>b.schedule==='C3')
    ?'OPEN / A saved Base allocation for Form C-3 conflicts with the A1 scope note. Review 11.M.'
    :'Option reference (A2 / Form C-3): '+sparePriceNote(operation,currency)+' / Excluded from Base.');
  }
  if(base){const partial=subtotalNote(view,eligible);set(v,12,1,'In figures: '+currency+' '+number(view.baseAssigned)+'\nIn Words: '+words(view.baseAssigned,currency)+(partial?'\nKnown subtotal: '+currency+' '+number(shownSum(view,eligible))+' / '+partial:''));}
  else for(const [r,t] of [[8,'CIF'],[9,'FOB']]){
   const bs=eligible.filter(b=>term(b)===t),total=sum(bs);
   const pending=eligible.some(b=>!term(b))||view.workingPreview&&!Number.isFinite(view.optionsAssigned);
   set(v,r,2,'In figures: '+(pending?'OPEN':bs.length?currency+' '+number(total):'OPEN')+'\nIn Words: '+(view.workingPreview&&pending?'OPEN':words(total,currency)));
  }
  add(v,'',draftPriceRows.length?{draftPriceRows}:undefined);return {pages,issues};
 }
 if(id==='B'||id==='C'){
  if(id==='B'&&paymentSchedule0550(view)&&!paymentSchedule0550(view).rows.length)issues.push('Current tender payment milestones OPEN');
  add();return {pages,issues};
 }
 if(['C1','C5','C6'].includes(id)){
  const capacity=id==='C1'?32:7;
  chunks(rows,capacity).forEach((group,pi)=>{const v=blankValues(id),draftPriceRows=[];group.forEach((b,i)=>{const r=i+2;set(v,r,0,pi*capacity+i+1);set(v,r,1,b.line.description);if(id==='C1'){set(v,r,2,b.unit);set(v,r,3,value(b.quantity));set(v,r,4,b.nonAdditive?'Included':number(b.unitPrice));set(v,r,5,b.nonAdditive?'Included':number(b.amount));set(v,r,6,b.nativeNote||b.deliveryTerm||'Customer delivery term OPEN');}else{const offset=id==='C6'?1:0;if(offset)set(v,r,2,value(b.specification));set(v,r,2+offset,b.unit);set(v,r,3+offset,value(b.quantity));prices(v,r,4+offset,b,draftPriceRows);}});if(id==='C1')set(v,34,1,pi===chunks(rows,capacity).length-1?currency+' '+number(shownSum(view,rows.filter(b=>!b.nonAdditive)))+(subtotalNote(view,rows)?' / '+subtotalNote(view,rows):''):'Continued on next form');add(v,pi?'Continuation '+(pi+1):'',id==='C1'?undefined:{priceRows:group,draftPriceRows});});
 }
 if(['C2','C3','C4'].includes(id)){
  // Draft from SI equation — not allocated to Schedule. Does not enter Volume I
  // totals until bound in 11.M. These rows are never appended to view.bindings.
  const systems=view.c2Systems||c2References?spareSystemGroups0550(view,id,c2References):[{rows}];
  for(const system of systems){
   if(system.draftRows?.length){
    chunks(system.draftRows,7).forEach((references,pi)=>{
     const v=blankValues(id),draftPriceRows=[];
     set(v,0,2,'OPEN');
     const equationDraft=references.some(r=>r.equationDraft);
     set(v,1,1,equationDraft?SPARE_DRAFT_NOTE_0550:'Internal reference · 07 Vendor / 10.2 Working A/B/C · C2 allocation OPEN');
     references.forEach((reference,i)=>{
      const r=i+4;
      const cost=reference.equationDraft?'Source cost: '+(Number.isFinite(reference.totalCost)?reference.currency+' '+number(reference.totalCost):'OPEN'):'';
      set(v,r,0,[reference.description,reference.note,reference.source,cost,...(reference.issues||[])].filter(Boolean).join('\n'));
      set(v,r,1,reference.partNo|| (reference.quoteItem?'Quote item '+reference.quoteItem:'OPEN'));
      set(v,r,4,Number.isFinite(reference.quantity)?[reference.quantity,reference.unit].filter(Boolean).join(' '):'OPEN');
      const total=reference.equationDraft?(currency==='THB'?reference.customerTHB:reference.amount):reference.totalCost;
      const rate=reference.equationDraft?(reference.quantity>0&&Number.isFinite(total)?total/reference.quantity:reference.quantity===0&&total===0?0:null):reference.unitCost;
      const shownCurrency=reference.equationDraft?currency:reference.currency;
      set(v,r,9,Number.isFinite(rate)?shownCurrency+' '+number(rate):'OPEN');
      set(v,r,11,Number.isFinite(total)?shownCurrency+' '+number(total):'OPEN');
      draftPriceRows.push([r,9]);
     });
     add(v,pi?'Reference continuation '+(pi+1):equationDraft?'SI equation Draft':'Source cost reference',{systemToken:system.token,systemName:system.name,systemStatus:equationDraft?'DRAFT_FROM_EQUATION':system.status,draftPriceRows});
    });
    continue;
   }
   let firstPage=true;
   const groups=new Map();for(const b of system.rows){const key=b.mainEquipment||'OPEN';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(b);}if(!groups.size)groups.set('OPEN',[]);
   for(const [main,bs] of groups)chunks(bs,7).forEach((group,pi)=>{
    const v=blankValues(id),draftPriceRows=[];set(v,0,0,value(field(view,id,'vendorNameAddress')));set(v,0,1,value(field(view,'A','agreementNo')));set(v,0,2,main);set(v,0,3,shared(bs,'vendorEquipmentNo'));set(v,1,1,shared(bs,'referenceDrawings'));
    group.forEach((b,i)=>{
     const r=i+4,description=id==='C2'&&view.workingPreview?c2PartsDescription0550(b):b.line.description;
     [description,value(b.partNo),value(b.interchangeA),value(b.interchangeB),value(b.quantity),value(b.delivery),b.physical?.estimatedWeightKg>0&&b.quantity!==null?number(b.physical.estimatedWeightKg*b.quantity):'OPEN',value(b.origin),value(b.shippingFrom)].forEach((x,c)=>set(v,r,c,x));
     prices(v,r,9,b,draftPriceRows);
    });
    const pendingPhases=firstPage?system.pendingPhases||[]:[];
    if(system.status==='AWAITING_B5')pendingPhases.forEach((phase,i)=>{
     set(v,i+4,0,phase.title+' spares');
     for(let column=1;column<=12;column++)set(v,i+4,column,'OPEN');
    });
    add(v,main+(pi?' / Continuation '+(pi+1):''),{priceRows:group,draftPriceRows,...(system.token?{systemToken:system.token,systemName:system.name,systemStatus:system.status,spareRows:group,pendingPhases}:{})});
    firstPage=false;
   });
  }
 }
 if(id==='C7'){
  const site=rows.filter(b=>role(b)==='FIELD_SERVICE'),training=rows.filter(b=>role(b)==='TRAINING'),unknown=rows.filter(b=>!['FIELD_SERVICE','TRAINING'].includes(role(b)));
  for(const b of unknown)issues.push('Select Site Service / Training in allocation: '+b.lineId);
  const count=Math.max(1,Math.ceil(site.length/4),Math.ceil(training.length/4));
  for(let p=0;p<count;p++){
   const v=blankValues(id),pageRows=[];
   for(const [bs,start,subtotal] of [[site,1,5],[training,6,10]]){
    const group=bs.slice(p*4,(p+1)*4);pageRows.push(...group);
    group.forEach((b,i)=>{
     const name=b.line.description+(view.workingPreview&&b.treatment==='OPTION'?' (Option / A2)':'');
     set(v,start+i,2,name);set(v,start+i,3,b.unit==='MH'?value(b.quantity):'OPEN');
     set(v,start+i,4,b.unit==='MH'?number(b.unitPrice):'OPEN');set(v,start+i,5,number(b.amount));
    });
    set(v,subtotal,1,number(shownSum(view,group)));
   }
   set(v,11,1,unknown.length&&!view.workingPreview?'OPEN':number(shownSum(view,pageRows)));
   const siteDays=field(view,id,'sitePeriodDays'),trainingDays=field(view,id,'trainingPeriodDays');
   set(v,1,6,view.workingPreview&&!siteDays.trim()?'Site service period to confirm':value(siteDays)+' days');
   set(v,6,6,view.workingPreview&&!trainingDays.trim()?'Training period to confirm':value(trainingDays)+' days');
   add(v,p?'Continuation '+(p+1):'',view.workingPreview?{pageNumber:p+1,pageCount:count}:undefined);
  }
 }
 if(id==='C8'){
  const rowMap={OFFICE:1,TRANSPORT:2,AIRPORT:3,OFFICE_CONSUMABLES:4,WORKING_LUNCH:5};
  if(view.workingPreview&&view.tenderScheduleBasis?.facilitiesConflict)issues.push(facilitiesFormCheck);
  for(const b of rows)if(!rowMap[role(b)])issues.push('Select native C8 facility row in allocation: '+b.lineId);
  const total=c8CalloffTotal0550(view,rows);
  const facilities=total?rows.filter(c8OtherFacilities0550):rows;
  if(total){
   add({},'',{c8CalloffTotal:total});
   if(total.amount===null)issues.push('Estimated Call-off Total OPEN: reconcile quantities, prices and the C8 source revision in Working.');
   if(!facilities.length)return {pages,issues};
  }
  const groups=new Map();
  for(const b of facilities){
   const country=c8Country0550(b)||'';
   if(!groups.has(country))groups.set(country,[]);
   groups.get(country).push(b);
  }
  if(!groups.size)groups.set('',[]);
  for(const [country,group] of groups){
   const v=blankValues(id);
   const revisions=[...new Set(group.map(c8Revision0550).filter(Boolean))];
   for(const [key,r] of Object.entries(rowMap)){
    const bs=group.filter(b=>role(b)===key);if(!bs.length)continue;
    const assigned=view.workingPreview&&!country?bs.filter(b=>b.treatment!=='CALLOFF'):bs;
    const qty=assigned.length&&assigned.every(b=>b.unit==='MD'&&Number.isFinite(b.quantity))?assigned.reduce((n,b)=>n+b.quantity,0):null;
    set(v,r,3,country&&bs.length===1?value(bs[0].quantity)+' '+c8Unit0550(bs[0]):key==='AIRPORT'||!assigned.length?'':value(qty));
    set(v,r,4,bs.length===1?number(bs[0].unitPrice):'OPEN');
    set(v,r,5,assigned.length?number(shownSum(view,assigned)):'');
    set(v,r,6,bs.map(b=>b.line.description+' / '+(country?(r===1?b.basis:'Estimated call-off'):b.treatment==='CALLOFF'&&view.workingPreview?'Call-off rate only':b.treatment)).join('; '));
    if(bs.length>1)issues.push('C8 native row has multiple Working rates; review consolidation: '+key);
   }
   const assigned=view.workingPreview&&!country?group.filter(b=>b.treatment!=='CALLOFF'):group;
   const ratesOnly=view.workingPreview&&group.length&&!assigned.length;
   const amount=country?(new Set(assigned.map(role)).size===Object.keys(rowMap).length&&assigned.length===Object.keys(rowMap).length?
    scheduleRollup0550(assigned).totalUSD:null):shownSum(view,assigned);
   set(v,6,1,ratesOnly?'Call-off rates only':assigned.some(b=>!rowMap[role(b)])?'OPEN':number(amount));
   const detail=country?[country,...revisions,'Call-off estimate'].join(' · '):groups.size>1?'Other saved facilities':'';
   add(v,detail,{c8Country:country});
  }
 }
 return {pages,issues};
}
function scheduleTableMarkup(rows,format,widths=[1900,10700,1900]){
 if(format==='xml'){
  const grid=widths.map(width=>'<w:gridCol w:w="'+width+'"/>').join('');
  const borders=['top','left','bottom','right','insideH','insideV'].map(edge=>'<w:'+edge+' w:val="single"/>').join('');
  const body=rows.map(row=>'<w:tr>'+row.map(cell=>{
   const paragraphs=cell.split('\n').map(line=>'<w:p><w:r><w:t xml:space="preserve">'+escape(line)+'</w:t></w:r></w:p>').join('');
   return '<w:tc>'+paragraphs+'</w:tc>';
  }).join('')+'</w:tr>').join('');
  return '<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders>'+borders+
   '</w:tblBorders></w:tblPr><w:tblGrid>'+grid+'</w:tblGrid>'+body+'</w:tbl>';
 }
 const row=cells=>'<tr>'+cells.map(cell=>'<td>'+escape(cell).replace(/\n/g,'<br>')+'</td>').join('')+'</tr>';
 return '<table><thead>'+row(rows[0])+'</thead><tbody>'+rows.slice(1).map(row).join('')+'</tbody></table>';
}
function replaceScheduleTable(source,format,rows,widths){
 return source.replace(format==='xml'?/<w:tbl(?:\s[^>]*)?>[\s\S]*?<\/w:tbl>/:/<table(?:\s[^>]*)?>[\s\S]*?<\/table>/,
  ()=>scheduleTableMarkup(rows,format,widths));
}
function renderPage(view,page,format,currency='USD'){
 let result=fill(page.id,page.values,format,currency,page.draftPriceRows);
 if(page.c8CalloffTotal){
  const {amount}=page.c8CalloffTotal;
  const price=amount===null?'OPEN':currency+' '+number(amount);
  result=replaceScheduleTable(result,format,[['Description / Scope of Supply','Unit','Total Price'],
   [C8_TOTAL_DESCRIPTION_0550,'Lot',price]],[10300,1700,2500]);
 }
 if(page.c8Country){
  const label=escape(page.detail);
  result=format==='xml'?'<w:p><w:pPr><w:keepNext/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>'+label+'</w:t></w:r></w:p>'+result:
   '<p><strong>'+label+'</strong></p>'+result;
 }
 if(view.workingPreview&&page.id==='A2')result=result.replace('Contract Price for Base Scope','Contract Price for Optional Scope');
 if(view.workingPreview&&page.id==='C7'&&page.pageCount>1){
  result=result.replace('TOTAL (Sub-total 1.0+2.0)',`Page ${page.pageNumber} of ${page.pageCount} subtotal`);
 }
 const payment=page.id==='B'&&paymentSchedule0550(view);
 if(payment){
  const rows=payment.rows.length?[['No.','Payment Terms','Percentage of Initial Contract Price for Base Scope of Supply'],...payment.rows,['Total','','100.00%']]:
   [['OPEN','Confirm the current tender payment schedule before issue.','']];
  result=replaceScheduleTable(result,format,rows);
 }
 if(page.systemToken){
  const heading='System: '+page.systemToken+(page.systemName===page.systemToken?'':' / '+page.systemName);
  const label=escape(heading+(page.systemStatus==='DRAFT_FROM_EXISTING'?' · DRAFT — source costs for SI reference':
   page.systemStatus==='AWAITING_B5'?' · OPEN — awaiting Working B5 allocations':''));
  result=(format==='xml'?`<w:p><w:pPr><w:keepNext/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>${label}</w:t></w:r></w:p>`:`<p><strong>${label}</strong></p>`)+result;
 }
 if(page.id==='A'){
  const draftWords=amount=>{
   const text=words(amount,currency).replace(/ only$/,'');
   return currency==='THB'?text:text.replace(/^United States Dollars /,'');
  };
  if(view.workingPreview&&format==='xml'){
   // Word splits two of the native blanks across adjacent runs.
   result=result.replace(/_{5,}(?:<\/w:t><\/w:r><w:r\b[^>]*>(?:<w:rPr>(?:(?!<\/w:rPr>)[\s\S])*<\/w:rPr>)?<w:t\b[^>]*>_{5,})+/g,'_____');
  }
  const wording=view.workingPreview?draftWords:amount=>words(amount,currency);
  const vals=['OPEN','OPEN',number(view.baseAssigned),wording(view.baseAssigned),number(view.optionsAssigned),wording(view.optionsAssigned)];let i=0;
  result=result.replace(/_{5,}/g,(match,offset)=>escape(vals[i++]||'OPEN')+
   (view.workingPreview&&format==='html'&&result.slice(offset+match.length).startsWith('only')?' ':''));
  if(view.workingPreview)result=result.replace(/(OPEN|\d|[a-z])(<\/w:t><\/w:r><w:r\b[^>]*>(?:<w:rPr>(?:(?!<\/w:rPr>)[\s\S])*<\/w:rPr>)?)<w:t>only<\/w:t>/g,'$1$2<w:t xml:space="preserve"> only</w:t>')
   .replace(/\b(OPEN)only\b/g,'$1 only');
 }
 if(view.workingPreview&&page.id==='C1'&&view.nativeC1?.some(b=>b.nonAdditive)){
  const note='[1] Component quantities follow the MGW package basis stored in Working; MR reconciliation remains pending. Included components form part of their parent package amount and are not charged again.';
  if(format==='xml')result=result.replace('{{NATIVE_RESPONSE}}',`<w:p><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="20"/></w:rPr><w:t>${escape(note)}</w:t></w:r></w:p>{{NATIVE_RESPONSE}}`);
  else result+=`<p class="native-response">${escape(note)}</p>`;
 }
 let partialNote='';
 if(view.workingPreview){
  if(page.id==='A'){
   const available=['BASE','OPTION'].map(treatment=>{
    const rollup=scheduleRollup0550(view.bindings.filter(b=>b.line&&b.treatment===treatment));
    return treatment+': '+(rollup.priced?currency+' '+number(rollup.knownUSD)+' ('+rollup.priced+'/'+rollup.count+' allocated owners priced)':'OPEN');
   });
   partialNote='Draft subtotals of priced allocations only. '+available.join(' / ')+'. Review A1, A2 and the Schedule allocations for remaining scope.';
  }
  if(page.id==='A1'||page.id==='A2'){
   const base=page.id==='A1';
   const subtotal=scheduleRollup0550(view.bindings.filter(b=>b.line&&b.treatment===(base?'BASE':'OPTION')));
   if(subtotal.priced)partialNote=(base?'Base':'Option')+' Working subtotal (priced items): '+currency+' '+number(subtotal.knownUSD)+
    ' ('+subtotal.priced+'/'+subtotal.count+' priced'+(subtotal.open?', '+subtotal.open+' OPEN':'')+').';
   if(!base&&view.tenderScheduleBasis?.delivery)partialNote=[partialNote,view.tenderScheduleBasis.delivery.text].filter(Boolean).join(' ');
  }
  if(/^C[2-8]$/.test(page.id)&&!page.systemToken&&!view.scheduleRows(page.id).length){
   partialNote='OPEN. Confirm applicable scope and allocate the supporting Working items.';
  }
  if(page.id==='C1')partialNote=subtotalNote(view,view.scheduleRows(page.id))||partialNote;
  if(page.id==='C7'&&page.pageNumber===1){
   const rows=view.scheduleRows('C7');
   const totals=['BASE','OPTION'].map(treatment=>{
    const rollup=scheduleRollup0550(rows.filter(b=>b.treatment===treatment));
    return rollup.count?`${treatment==='BASE'?'Base / A1':'Option / A2'}: ${rollup.priced?currency+' '+number(rollup.knownUSD):'OPEN'} (${rollup.priced}/${rollup.count} priced${rollup.open?', '+rollup.open+' OPEN':''}).`:'';
   }).filter(Boolean);
   if(totals.length)partialNote='C7 Working subtotal across all pages (priced items): '+totals.join(' ');
   const hours=view.tenderScheduleBasis?.siteHours;
   if(hours&&rows.some(b=>role(b)==='FIELD_SERVICE'&&b.hoursPerDay>0&&b.hoursPerDay!==hours)){
    partialNote+=' Reconcile the Working man-hour basis with the tender site day of '+hours+' hours. Confirm calendar days from the site programme.';
   }
  }
  if(page.id==='C8'){
   partialNote=subtotalNote(view,view.scheduleRows('C8').filter(b=>b.treatment!=='CALLOFF'))||partialNote;
   if(view.tenderScheduleBasis?.facilitiesConflict)partialNote=[partialNote,facilitiesFormCheck].filter(Boolean).join(' ');
  }
  const training=view.tenderScheduleBasis?.training;
  if(page.id==='C7'&&page.pageNumber===1&&training&&!view.getRecord('I.C7').nativeFields?.trainingPeriodDays?.trim()){
   partialNote=[partialNote,`Tender planning basis: estimated ${training.days} course days for ${training.trainees} trainees (Exhibit A Annex 7). Confirm trainer hours, duration and rates separately.`].filter(Boolean).join(' ');
  }
  if(page.priceRows&&(page.id!=='C2'||!page.draftPriceRows?.length)){
   const rows=page.priceRows.filter(b=>!b.nonAdditive&&b.treatment!=='CALLOFF');
   if(rows.some(b=>b.line.spareBudget)||rows.some(b=>!term(b)&&Number.isFinite(b.amount))){
    partialNote='Schedule '+page.id+' Working price: '+sparePriceNote(rows,currency)+' (rows on this form).';
    if(rows.some(b=>!term(b)))partialNote+=' CIF/FOB allocation OPEN.';
   }
  }
  if(page.id==='C2'&&page.systemToken==='TEL-PAGA'&&view.pagaNet){
   const kit=view.pagaKit;
   partialNote=[partialNote,kit&&('INDUSTRONIC '+view.pagaNet.quoteRef+' item '+kit.supplierQuoteRow.itemCode+
    ': commissioning kit included in A1-05.'),'Confirm additional spares by equipment and phase.'].filter(Boolean).join(' ');
  }
  if(page.id==='C7'&&page.pageNumber===1&&view.pagaNet&&view.pagaScope){
   partialNote=[partialNote,'INDUSTRONIC '+view.pagaNet.quoteRef+' · '+view.pagaScope].filter(Boolean).join(' ');
  }
  if(page.id==='C3'&&view.pagaSpares?.recommended.length){
   partialNote=[partialNote,`INDUSTRONIC SP2 lists ${view.pagaSpares.recommended.length} recommended PAGA spare lines. Reconcile with the included kit and the Option allowance before allocating a separate selling price.`].filter(Boolean).join(' ');
  }
  const pbxNote=view.chevalierPbxSupply&&chevalierPbxScheduleNote0550(view,page.id);
  if(view.chevalierPbxSupply&&pbxNote&&!page.c8CalloffTotal&&(!page.systemToken||['TEL-PABX','TEL-IPP'].includes(page.systemToken))){
   partialNote=[partialNote,'IP Telephony and PABX. '+pbxNote].filter(Boolean).join(' ');
  }
 }
 if(page.draftPriceRows?.length&&!['DRAFT_FROM_EXISTING','DRAFT_FROM_EQUATION'].includes(page.systemStatus))partialNote=[partialNote,'Prices spanning CIF and FOB are pending allocation.'+
  (page.id==='C2'&&page.priceRows?.some(b=>b.line.spareBudget)?' Draft budget allowance. OEM breakdown OPEN.':'')].filter(Boolean).join(' ');
 if(page.spareRows?.length&&page.pendingPhases?.length)partialNote=[partialNote,'Awaiting Working B5: '+page.pendingPhases.map(phase=>phase.title).join(', ')+'.'].filter(Boolean).join(' ');
 if(page.c8CalloffTotal)partialNote=[C8_TOTAL_NOTE_0550,partialNote].filter(Boolean).join(' ');
 if(partialNote){if(format==='xml')result=result.replace('{{NATIVE_RESPONSE}}',`<w:p><w:r><w:t>${escape(partialNote)}</w:t></w:r></w:p>{{NATIVE_RESPONSE}}`);else result+=`<p class="native-response">${escape(partialNote)}</p>`;}
 const response=view.getRecord('I.'+page.id).content;
 if(format==='xml')result=result.replace('{{NATIVE_RESPONSE}}',response?.trim()?`<w:p><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">BIDDER response: ${escape(response).replace(/\n/g,'</w:t><w:br/><w:t xml:space="preserve">')}</w:t></w:r></w:p>`:'');
 else if(response?.trim())result+=`<p class="native-response"><b>BIDDER response:</b> ${escape(response).replace(/\n/g,'<br>')}</p>`;
 return result;
}
const logo='data:image/png;base64,'+template.binary['word/media/image1.png'];
export const nativeFormCss0550=`.p55-native-paper{box-sizing:border-box;width:1120px;max-width:none;min-height:720px;background:white;color:#000;padding:28px 40px;margin:0 auto 24px;font:13px Arial,sans-serif;box-shadow:0 1px 8px #0002}.p55-native-paper *{box-sizing:border-box}.p55-native-paper header{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid black;margin-bottom:24px;font-size:11px}.p55-native-paper header img{width:100px;height:auto}.p55-native-paper h2{font:bold 15px Arial;text-align:center;color:#000;margin:18px 0 22px}.p55-native-paper p{margin:0;white-space:pre-wrap;line-height:1.2}.p55-native-paper>p{margin:10px 0}.p55-native-paper table{width:100%;border-collapse:collapse;table-layout:fixed;margin:0 0 14px;color:#000;font:12px Arial}.p55-native-paper td{border:1px solid #000;padding:3px 4px;vertical-align:middle;overflow-wrap:break-word;line-height:1.12;min-height:23px}.p55-native-paper tr{height:23px;break-inside:avoid}.p55-native-paper thead td{text-align:center;font-weight:bold;background:#fff}.p55-native-paper footer{display:flex;justify-content:space-between;border-top:1px solid #000;margin-top:24px;padding-top:4px;font:10px 'Times New Roman',serif}.p55-native-paper .native-status{font:10px Arial;text-align:right;margin:4px 0;color:#555}.p55-native-paper .native-response{margin-top:14px}.p55-native-scroll{max-width:100%;overflow:auto;background:#e8edf2;padding:18px 12px}.p55-native-toolbar{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.p55-native-help{font-size:13px}.p55-native-issues{color:#8a4200}@media print{body{margin:0}.p55-native-paper{width:auto;min-height:0;box-shadow:none;margin:0;padding:0;break-before:page}.p55-native-paper:first-child{break-before:auto}.p55-native-paper table{font-size:10px}.p55-native-paper header img{width:85px}thead{display:table-header-group}@page{size:A4 landscape;margin:12mm}}`;
export function nativeSchedule0550(view,id,currency='USD',c2References){
 if(id==='C1'&&isC1Appendix0550(view))return {html:c1AppendixHtml0550(view),issues:deriveC1Appendix0550(view).problems,pages:[{id:'C1',values:{},detail:'MR Appendix 1.1–1.8'}]};
 const {pages,issues}=nativePages(view,id,currency,c2References),label=view.outputLabel||'DRAFT — NOT FOR SUBMISSION';
 const sourceLabel=id==='B'&&paymentSchedule0550(view)?'Schedule B · Current tender':'Source page '+template.schedules[id].page+' of 18';
 const html=pages.map(page=>`<article class="p55-native-paper" data-native-schedule="${id}"${page.systemToken?' data-c2-system="'+escape(page.systemToken)+'"':''}><header><img alt="CNEEC" src="${logo}"><span>Supply of Export XXX for Onshore Processing Facilities and Associated<br>Onshore Pipelines for Aung Sinkha Development Project<br>AGREEMENT No.: ${escape(field(view,'A','agreementNo')||'OPEN')}</span></header><p class="native-status">${escape(label)} / ${escape(view.proposal.documentNo||'OPEN')} / ${escape(view.proposal.revision)}${page.detail?' / '+escape(page.detail):''}</p>${renderPage(view,page,'html',currency)}<footer><span>Exhibit C - Commercial Terms</span><span>${sourceLabel}${page.detail?' / '+escape(page.detail):''}</span></footer></article>`).join('');
 return {html,issues,pages};
}
export function nativeExhibitProblems0550(view,only){
 const ids=only?[only]:Object.keys(template.schedules),problems=ids.flatMap(id=>nativePages(view,id).issues.map(p=>id+' / '+p));
 // Only active detail forms need these header/period values. Empty schedules keep
 // their explicit applicability review in the existing package model.
 for(const id of ['C2','C3','C4'].filter(id=>!only||only===id)){
  const systems=id==='C2'&&view.c2Systems?c2SystemGroups0550(view):[{rows:view.scheduleRows(id)}];
  const rows=systems.flatMap(group=>group.rows);
  if(!rows.length)continue;
  if(!field(view,id,'vendorNameAddress').trim())problems.push(id+' / VENDOR name and address OPEN');
  if(rows.some(b=>!b.vendorEquipmentNo?.trim()||!b.referenceDrawings?.trim()))problems.push(id+' / Equipment header references OPEN');
  for(const system of systems){
   const equipment=new Set(system.rows.map(b=>b.mainEquipment));
   for(const main of equipment)if(['vendorEquipmentNo','referenceDrawings'].some(key=>new Set(system.rows.filter(b=>b.mainEquipment===main).map(b=>b[key])).size>1))problems.push(id+' / Conflicting equipment header references: '+(system.token?system.token+' / ':'')+main);
  }
 }
 for(const [r,key] of [['FIELD_SERVICE','sitePeriodDays'],['TRAINING','trainingPeriodDays']])if((!only||only==='C7')&&view.scheduleRows('C7').some(b=>role(b)===r)&&!field(view,'C7',key).trim())problems.push('C7 / '+key+' OPEN');
 if((!only||only==='C1')&&isC1Appendix0550(view))problems.push(...deriveC1Appendix0550(view).problems.map(p=>'C1 / '+p));
 return problems;
}
export function nativeExhibitHtml0550(view,only,includeCover=false){
 const ids=only?[only]:Object.keys(template.schedules);
 const cover=includeCover?`<article class="p55-native-paper"><h2>Volume I — Quotation</h2><p>${escape(view.outputLabel||'DRAFT — NOT FOR SUBMISSION')}</p><p>${escape(view.proposal.documentNo||'OPEN')} / ${escape(view.proposal.revision)}</p><h2>Power of Attorney / Undertaking</h2><p>${escape(view.getRecord('I.cover').content||'OPEN')}</p></article>`:'';
 const pbx=only?[]:chevalierPbxScheduleTrace0550(view);
 const appendix=pbx.length?`<article class="p55-native-paper"><h2>IP Telephony and PABX · Volume I draft trace</h2><table><thead><tr><th>Volume I</th><th>Draft status</th><th>Scope</th></tr></thead><tbody>${pbx.map(row=>'<tr>'+row.map(cell=>'<td>'+escape(cell)+'</td>').join('')+'</tr>').join('')}</tbody></table></article>`:'';
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Exhibit C / ${escape(only||'All Schedules')}</title><style>${nativeFormCss0550}${isC1Appendix0550(view)?c1AppendixCss0550:''}</style></head><body>${cover}${ids.map(id=>nativeSchedule0550(view,id).html).join('')}${appendix}</body></html>`;
}
export function buildNativeExhibitDocx0550(view,only){
 if(view.workingPreview&&/AUTHORIZED|ISSUED/.test(view.outputLabel||''))throw Error('Working Preview is not an authorized package');
 const ids=only?[only]:Object.keys(template.schedules);
 const trailingBreak=/<w:p\b[^>]*>(?:(?!<\/w:p>)[\s\S])*<w:br w:type="page"\/><\/w:r><\/w:p>$/;
 const trailingParagraph=/<w:p\b[^>]*>(?:(?!<\/w:p>)[\s\S])*<\/w:p>$/;
 const blocks=Object.fromEntries(ids.map(id=>[id,id==='C1'&&isC1Appendix0550(view)
  ?c1AppendixWord0550(view):nativePages(view,id).pages.map((page,index)=>{
   const xml=renderPage(view,page,'xml');
   if(!only||!view.workingPreview)return xml;
   const content=xml.replace(trailingBreak,'').replace(trailingParagraph,paragraph=>
    /<w:t\b[^>]*>\s*[^\s<]|<w:(?:drawing|object|br|sectPr)\b/.test(paragraph)?paragraph:'');
   return index?content.replace(/^(<w:p\b[^>]*><w:pPr>(?:<w:keepNext\/>)?)/,'$1<w:pageBreakBefore/>'):content;
  }).join('')]));
 let xml=template.document.replace(/\{\{SCHEDULE_(\w+)_XML\}\}/g,(_,id)=>blocks[id]??'');
 if(only){
  // Retain the native final landscape section, logo relationships and styles.
  const start=xml.indexOf('<w:body>')+8,end=xml.lastIndexOf('<w:sectPr');
  const block=only==='C2'&&view.c2Systems?blocks[only].replace(trailingBreak,''):blocks[only];
  xml=xml.slice(0,start)+block+xml.slice(end);
 }
 const pbx=only?[]:chevalierPbxScheduleTrace0550(view);
 if(pbx.length){
  const paragraph=text=>`<w:p><w:r><w:t xml:space="preserve">${escape(text)}</w:t></w:r></w:p>`;
  const appendix=paragraph('IP Telephony and PABX · Volume I draft trace')+
   pbx.map(([id,status,scope])=>paragraph('11.'+id+' · '+status+' · '+scope)).join('');
  const section=xml.lastIndexOf('<w:sectPr');
  xml=xml.slice(0,section)+appendix+xml.slice(section);
 }
 if(view.workingPreview)xml=xml.replace(/<w:tbl(?:\s[^>]*)?>[\s\S]*?<\/w:tbl>/g,table=>{
  if(!table.includes('Component: '))return table;let index=0;
  return table.replace(/<w:tr(?:\s[^>]*)?>[\s\S]*?<\/w:tr>/g,row=>{
   const header=index++<2,component=row.includes('Component: ');if(!header&&!component)return row;
   const flag=header?'tblHeader':'cantSplit';if(row.includes('<w:'+flag))return row;
   row=row.replace('<w:trPr/>','<w:trPr></w:trPr>');
   return /<w:trPr(?:\s[^>]*)?>/.test(row)?row.replace(/(<w:trPr(?:\s[^>]*)?>)/,'$1<w:'+flag+'/>'):row.replace(/(<w:tr(?:\s[^>]*)?>)/,'$1<w:trPr><w:'+flag+'/></w:trPr>');
  });
 });
 const lastParagraph=xml.lastIndexOf('</w:p>');
 xml=xml.slice(0,lastParagraph)+'<w:bookmarkStart w:id="90550" w:name="PJ0550_EXHIBIT_END"/><w:bookmarkEnd w:id="90550"/>'+xml.slice(lastParagraph);
 if(/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(xml))throw Error('Unsupported XML control character in Exhibit C');
 const parts={...template.parts,'word/document.xml':xml};
 for(const name of Object.keys(parts).filter(n=>/^word\/header\d+\.xml$/.test(n)))parts[name]=parts[name].replace(/(<w:t[^>]*>[^<]*No\.:)(<\/w:t>)/g,(_,a,b)=>a+' '+escape(field(view,'A','agreementNo')||'OPEN')+b);
 if(Object.values(parts).some(s=>/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(s)))throw Error('Unsupported XML control character in Exhibit C');
 // A visible draft/authorized label in each native footer; original fields remain.
 for(const name of Object.keys(parts).filter(n=>/^word\/footer\d+\.xml$/.test(n)))parts[name]=parts[name].replace(/(<w:p(?:\s[^>]*)?>)/,m=>m+`<w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t xml:space="preserve">${escape(view.outputLabel||'DRAFT — NOT FOR SUBMISSION')} / </w:t></w:r>`);
 for(const [name,b64] of Object.entries(template.binary))parts[name]=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
 return zipStore(parts);
}
export function downloadNativeExhibit0550(view,format='docx',only){
 const html=format==='html',content=html?nativeExhibitHtml0550(view,only):buildNativeExhibitDocx0550(view,only),url=URL.createObjectURL(new Blob([content],{type:html?'text/html;charset=utf-8':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})),a=document.createElement('a');
 const scope=only==='C2'&&view.c2SystemToken?'Schedule-C2-'+view.c2SystemToken:only?'Schedule-'+only:'All-Schedules';
 a.href=url;a.download=`PJ2608-0550_Exhibit-C_${scope}_${view.proposal.revision.replace(/[^\w.-]/g,'_')}_DRAFT.${format}`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
