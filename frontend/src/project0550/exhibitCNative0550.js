// The HTML and DOCX bodies come from the supplied Word file, including merges,
// notes and fixed labels. Only bidder response slots are substituted here.
import template from './data/exhibitCNativeTemplate0550.json';
import {sumMoney0550} from './data/money0550';
import {zipStore} from './exportOriginalPriceForm';

export const NATIVE_SUMMARIES_0550=[['GOODS','GOODS / C1'],['INSPECTION','Inspection and tests'],['PACKING','Preservation and packing'],['COMMISSIONING_SPARES','Commissioning spares / C2'],['OPERATION_SPARES','Two-year operation spares / C3'],['CAPITAL_SPARES','Capital spares / C4'],['SPECIAL_TOOLS','Special tools / C5'],['CONSUMABLES','Filling materials / C6'],['FIELD_SERVICE','Site Service / C7'],['TRAINING','Training / C7'],['OFFICE','Office / C8'],['TRANSPORT','In-city Transportation / C8'],['AIRPORT','Airport Pick-up & Drop-off / C8'],['OFFICE_CONSUMABLES','Office consumables / C8'],['WORKING_LUNCH','Working Launch / C8 (source label)'],['VENDOR_DOCUMENTS','Vendor Documents'],['OTHER','Others (Please specify)']];
export const NATIVE_FIELDS_0550={A:[['agreementNo','Agreement / Contract No.']],C2:[['vendorNameAddress','VENDOR name and address']],C3:[['vendorNameAddress','VENDOR name and address']],C4:[['vendorNameAddress','VENDOR name and address']],C7:[['sitePeriodDays','Free site service period in days'],['trainingPeriodDays','Proposed training period in days']]};
const escape=v=>String(v??'OPEN').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=v=>typeof v==='number'&&Number.isFinite(v)?v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):'OPEN';
const value=v=>v===null||v===undefined||v===''?'OPEN':String(v);
const sum=rows=>sumMoney0550(rows.map(b=>b.amount));
const chunks=(rows,n)=>Array.from({length:Math.max(1,Math.ceil(rows.length/n))},(_,i)=>rows.slice(i*n,(i+1)*n));
const field=(view,id,name)=>view.getRecord('I.'+id).nativeFields?.[name]||'';
const term=b=>/\bCIF\b/i.test(b.deliveryTerm)&&!/\bFOB\b/i.test(b.deliveryTerm)?'CIF':/\bFOB\b/i.test(b.deliveryTerm)&&!/\bCIF\b/i.test(b.deliveryTerm)?'FOB':'';
const normalize=s=>String(s||'').trim().toUpperCase();
const aliases={GOODS:'GOODS','SITE SERVICE':'FIELD_SERVICE',TRAINING:'TRAINING',OFFICE:'OFFICE','IN-CITY TRANSPORTATION':'TRANSPORT','AIRPORT PICK-UP & DROP-OFF':'AIRPORT','OFFICE CONSUMABLES':'OFFICE_CONSUMABLES','WORKING LAUNCH':'WORKING_LUNCH'};
const role=b=>aliases[normalize(b.summary)]||normalize(b.summary);
const shared=(rows,key)=>{const values=[...new Set(rows.map(b=>b[key]||''))];return values.length===1&&values[0]?values[0]:'OPEN';};
function words(n){
 if(!Number.isFinite(n))return 'OPEN';
 const small=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],tens=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
 const w=x=>x<20?small[x]:x<100?tens[Math.floor(x/10)]+(x%10?' '+small[x%10]:''):x<1000?small[Math.floor(x/100)]+' hundred'+(x%100?' '+w(x%100):''):[1e12,1e9,1e6,1e3].reduce((out,k)=>out||(x>=k?w(Math.floor(x/k))+' '+({1000:'thousand',1000000:'million',1000000000:'billion',1000000000000:'trillion'}[k])+(x%k?' '+w(x%k):''):''),'');
 if(n<0||n>=1e15)return 'OPEN';const cents=Math.round(n*100),whole=Math.floor(cents/100);return 'United States Dollars '+w(whole)+(cents%100?' and '+w(cents%100)+' cents':'')+' only';
}
const blankValues=id=>Object.fromEntries(Object.keys(template.defaults).filter(k=>k.startsWith(id+'_')).map(k=>[k,template.defaults[k]]));
function fill(id,values,format){
 return template.schedules[id][format].replace(/\{\{([\w]+)\}\}/g,(_,key)=>{
  if(key==='NATIVE_RESPONSE')return '{{NATIVE_RESPONSE}}';
  const v=Object.hasOwn(values,key)?values[key]:template.defaults[key]||'';
  return escape(v).replace(/\n/g,format==='xml'?'</w:t><w:br/><w:t xml:space="preserve">':'<br>');
 });
}
function nativePages(view,id){
 const rows=view.scheduleRows(id),pages=[],issues=[];
 const add=(values={},detail='')=>pages.push({id,values,detail});
 const set=(v,r,c,x)=>{v[`${id}_${r}_${c}`]=x;};
 const prices=(v,r,start,b)=>{const t=term(b);set(v,r,start,t==='CIF'?number(b.unitPrice):'');set(v,r,start+1,t==='FOB'?number(b.unitPrice):'');set(v,r,start+2,t==='CIF'?number(b.amount):'');set(v,r,start+3,t==='FOB'?number(b.amount):'');if(!t){set(v,r,start,'OPEN');set(v,r,start+2,'OPEN');issues.push('Customer CIF/FOB term OPEN: '+b.lineId);}};
 if(id==='A'){add();return {pages,issues};}
 if(id==='A1'||id==='A2'){
  const v=blankValues(id),base=id==='A1',part=base?'BASE':'OPTION',eligible=view.bindings.filter(b=>b.line&&b.treatment===part);
  const slot=b=>base?b.schedule==='C2'?5:b.schedule==='C5'?7:b.schedule==='C7'?8:b.schedule==='C8'?9:({GOODS:2,INSPECTION:3,PACKING:4,VENDOR_DOCUMENTS:10,OTHER:11}[role(b)]):b.schedule==='C4'?3:b.schedule==='C7'?4:b.schedule==='C6'?5:b.schedule==='C3'?6:7;
  const groups=new Map();for(const b of eligible){const r=slot(b);if(r===undefined){issues.push('A1 summary row OPEN: '+b.lineId);continue;}if(!groups.has(r))groups.set(r,[]);groups.get(r).push(b);}
  for(const [r,bs] of groups){
   const amount=sum(bs),terms=new Set(bs.map(term));set(v,r,3,r===8&&base?'Day':'Lot');set(v,r,4,r===8&&base?value(field(view,'C7','sitePeriodDays')):1);
   if(base){set(v,r,5,r===8?value(field(view,'C7','sitePeriodDays'))+' days included in Lump Sum':number(amount));if(r===9){const qty=bs.every(b=>b.unit==='MD'&&Number.isFinite(b.quantity))?bs.reduce((n,b)=>n+b.quantity,0):null;set(v,r,3,'Day');set(v,r,4,value(qty));set(v,r,5,qty>0&&Number.isFinite(amount)?number(amount/qty):'OPEN');}set(v,r,6,number(amount));set(v,r,7,bs.map(b=>b.line.description).join('; ')+(terms.has('')?' / Customer delivery term OPEN':''));}
   else{
    if(r===6||r===7)set(v,r,1,bs.map(b=>b.line.description).join('; '));
    const diemQty=r===4&&bs.every(b=>b.line.unit==='MD'&&Number.isFinite(b.line.quantity))?bs.reduce((n,b)=>n+b.line.quantity,0):null;
    if(r===4){set(v,r,3,'MD');set(v,r,4,value(diemQty));if(!diemQty||terms.size>1)issues.push('A2 DIEM quantity/rate basis OPEN');}
    for(const [t,rate,total] of [['CIF',5,7],['FOB',6,8]]){const selected=bs.filter(b=>term(b)===t);if(selected.length){set(v,r,rate,r===4?diemQty>0&&terms.size===1?number(sum(selected)/diemQty):'OPEN':number(sum(selected)));set(v,r,total,number(sum(selected)));}}
    set(v,r,9,bs.map(b=>b.line.description).join('; ')+(terms.has('')?' / Customer CIF/FOB term OPEN':''));if(terms.has('')){set(v,r,5,'OPEN');set(v,r,7,'OPEN');issues.push('A2 customer term OPEN');}
   }
  }
  if(base){set(v,12,1,'In figures: USD '+number(view.baseAssigned)+'\nIn Words: '+words(view.baseAssigned));}
  else for(const [r,t] of [[8,'CIF'],[9,'FOB']]){const bs=eligible.filter(b=>term(b)===t);set(v,r,2,'In figures: '+(eligible.some(b=>!term(b))?'OPEN':bs.length?'USD '+number(sum(bs)):'OPEN')+'\nIn Words: '+(bs.length?words(sum(bs)):'OPEN'));}
  add(v);return {pages,issues};
 }
 if(id==='B'||id==='C'){add();return {pages,issues};}
 if(['C1','C5','C6'].includes(id)){
  const capacity=id==='C1'?32:7;
  chunks(rows,capacity).forEach((group,pi)=>{const v=blankValues(id);group.forEach((b,i)=>{const r=i+2;set(v,r,0,pi*capacity+i+1);set(v,r,1,b.line.description);if(id==='C1'){set(v,r,2,b.unit);set(v,r,3,value(b.quantity));set(v,r,4,number(b.unitPrice));set(v,r,5,number(b.amount));set(v,r,6,b.deliveryTerm||'Customer delivery term OPEN');}else{const offset=id==='C6'?1:0;if(offset)set(v,r,2,value(b.specification));set(v,r,2+offset,b.unit);set(v,r,3+offset,value(b.quantity));prices(v,r,4+offset,b);}});if(id==='C1')set(v,34,1,pi===chunks(rows,capacity).length-1?'USD '+number(sum(rows)):'Continued on next form');add(v,pi?'Continuation '+(pi+1):'');});
 }
 if(['C2','C3','C4'].includes(id)){
  const groups=new Map();for(const b of rows){const key=b.mainEquipment||'OPEN';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(b);}if(!groups.size)groups.set('OPEN',[]);
  for(const [main,bs] of groups)chunks(bs,7).forEach((group,pi)=>{const v=blankValues(id);set(v,0,0,value(field(view,id,'vendorNameAddress')));set(v,0,1,value(field(view,'A','agreementNo')));set(v,0,2,main);set(v,0,3,shared(bs,'vendorEquipmentNo'));set(v,1,1,shared(bs,'referenceDrawings'));group.forEach((b,i)=>{const r=i+4;[b.line.description,value(b.partNo),value(b.interchangeA),value(b.interchangeB),value(b.quantity),value(b.delivery),b.physical?.estimatedWeightKg>0&&b.quantity!==null?number(b.physical.estimatedWeightKg*b.quantity):'OPEN',value(b.origin),value(b.shippingFrom)].forEach((x,c)=>set(v,r,c,x));prices(v,r,9,b);});add(v,main+(pi?' / Continuation '+(pi+1):''));});
 }
 if(id==='C7'){
  const site=rows.filter(b=>role(b)==='FIELD_SERVICE'),training=rows.filter(b=>role(b)==='TRAINING'),unknown=rows.filter(b=>!['FIELD_SERVICE','TRAINING'].includes(role(b)));
  for(const b of unknown)issues.push('Select Site Service / Training in allocation: '+b.lineId);
  const count=Math.max(1,Math.ceil(site.length/4),Math.ceil(training.length/4));
  for(let p=0;p<count;p++){const v=blankValues(id);for(const [bs,start,subtotal] of [[site,1,5],[training,6,10]]){const group=bs.slice(p*4,(p+1)*4);group.forEach((b,i)=>{set(v,start+i,2,b.line.description);set(v,start+i,3,b.unit==='MH'?value(b.quantity):'OPEN');set(v,start+i,4,b.unit==='MH'?number(b.unitPrice):'OPEN');set(v,start+i,5,number(b.amount));});set(v,subtotal,1,number(sum(group)));}set(v,11,1,unknown.length?'OPEN':number(sum([...site.slice(p*4,(p+1)*4),...training.slice(p*4,(p+1)*4)])));set(v,1,6,value(field(view,id,'sitePeriodDays'))+' days');set(v,6,6,value(field(view,id,'trainingPeriodDays'))+' days');add(v,p?'Continuation '+(p+1):'');}
 }
 if(id==='C8'){
  const v=blankValues(id),rowMap={OFFICE:1,TRANSPORT:2,AIRPORT:3,OFFICE_CONSUMABLES:4,WORKING_LUNCH:5};
  for(const b of rows)if(!rowMap[role(b)])issues.push('Select native C8 facility row in allocation: '+b.lineId);
  for(const [key,r] of Object.entries(rowMap)){const bs=rows.filter(b=>role(b)===key);if(!bs.length)continue;const qty=bs.every(b=>b.unit==='MD'&&Number.isFinite(b.quantity))?bs.reduce((n,b)=>n+b.quantity,0):null,amount=sum(bs);set(v,r,3,key==='AIRPORT'?'':value(qty));set(v,r,4,bs.length===1?number(bs[0].unitPrice):'OPEN');set(v,r,5,number(amount));set(v,r,6,bs.map(b=>b.line.description+' / '+b.treatment).join('; '));if(bs.length>1)issues.push('C8 native row has multiple Working rates; review consolidation: '+key);}
  set(v,6,1,rows.some(b=>!rowMap[role(b)])?'OPEN':number(sum(rows)));add(v);
 }
 return {pages,issues};
}
function renderPage(view,page,format){
 let result=fill(page.id,page.values,format);
 if(page.id==='A'){
  const vals=['OPEN','OPEN',number(view.baseAssigned),words(view.baseAssigned),number(view.optionsAssigned),words(view.optionsAssigned)];let i=0;
  result=result.replace(/_{5,}/g,()=>escape(vals[i++]||'OPEN'));
 }
 const response=view.getRecord('I.'+page.id).content;
 if(format==='xml')result=result.replace('{{NATIVE_RESPONSE}}',response?.trim()?`<w:p><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">BIDDER response: ${escape(response).replace(/\n/g,'</w:t><w:br/><w:t xml:space="preserve">')}</w:t></w:r></w:p>`:'');
 else if(response?.trim())result+=`<p class="native-response"><b>BIDDER response:</b> ${escape(response).replace(/\n/g,'<br>')}</p>`;
 return result;
}
const logo='data:image/png;base64,'+template.binary['word/media/image1.png'];
export const nativeFormCss0550=`.p55-native-paper{box-sizing:border-box;width:1120px;max-width:none;min-height:720px;background:white;color:#000;padding:28px 40px;margin:0 auto 24px;font:13px Arial,sans-serif;box-shadow:0 1px 8px #0002}.p55-native-paper *{box-sizing:border-box}.p55-native-paper header{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid black;margin-bottom:24px;font-size:11px}.p55-native-paper header img{width:100px;height:auto}.p55-native-paper h2{font:bold 15px Arial;text-align:center;color:#000;margin:18px 0 22px}.p55-native-paper p{margin:0;white-space:pre-wrap;line-height:1.2}.p55-native-paper>p{margin:10px 0}.p55-native-paper table{width:100%;border-collapse:collapse;table-layout:fixed;margin:0 0 14px;color:#000;font:12px Arial}.p55-native-paper td{border:1px solid #000;padding:3px 4px;vertical-align:middle;overflow-wrap:break-word;line-height:1.12;min-height:23px}.p55-native-paper tr{height:23px;break-inside:avoid}.p55-native-paper thead td{text-align:center;font-weight:bold;background:#fff}.p55-native-paper footer{display:flex;justify-content:space-between;border-top:1px solid #000;margin-top:24px;padding-top:4px;font:10px 'Times New Roman',serif}.p55-native-paper .native-status{font:10px Arial;text-align:right;margin:4px 0;color:#555}.p55-native-paper .native-response{margin-top:14px}.p55-native-scroll{max-width:100%;overflow:auto;background:#e8edf2;padding:18px 12px}.p55-native-toolbar{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.p55-native-help{font-size:13px}.p55-native-issues{color:#8a4200}@media print{body{margin:0}.p55-native-paper{width:auto;min-height:0;box-shadow:none;margin:0;padding:0;break-before:page}.p55-native-paper:first-child{break-before:auto}.p55-native-paper table{font-size:10px}.p55-native-paper header img{width:85px}thead{display:table-header-group}@page{size:A4 landscape;margin:12mm}}`;
export function nativeSchedule0550(view,id){
 const {pages,issues}=nativePages(view,id),label=view.outputLabel||'DRAFT — NOT FOR SUBMISSION';
 const html=pages.map(page=>`<article class="p55-native-paper" data-native-schedule="${id}"><header><img alt="CNEEC" src="${logo}"><span>Supply of Export XXX for Onshore Processing Facilities and Associated<br>Onshore Pipelines for Aung Sinkha Development Project<br>AGREEMENT No.: ${escape(field(view,'A','agreementNo')||'OPEN')}</span></header><p class="native-status">${escape(label)} / ${escape(view.proposal.documentNo||'OPEN')} / ${escape(view.proposal.revision)}${page.detail?' / '+escape(page.detail):''}</p>${renderPage(view,page,'html')}<footer><span>Exhibit C - Commercial Terms</span><span>Source page ${template.schedules[id].page} of 18${page.detail?' / '+escape(page.detail):''}</span></footer></article>`).join('');
 return {html,issues,pages};
}
export function nativeExhibitProblems0550(view){
 const problems=Object.keys(template.schedules).flatMap(id=>nativePages(view,id).issues.map(p=>id+' / '+p));
 // Only active detail forms need these header/period values. Empty schedules keep
 // their explicit applicability review in the existing package model.
 for(const id of ['C2','C3','C4'])if(view.scheduleRows(id).length){
  if(!field(view,id,'vendorNameAddress').trim())problems.push(id+' / VENDOR name and address OPEN');
  if(view.scheduleRows(id).some(b=>!b.vendorEquipmentNo?.trim()||!b.referenceDrawings?.trim()))problems.push(id+' / Equipment header references OPEN');
  const equipment=new Set(view.scheduleRows(id).map(b=>b.mainEquipment));
  for(const main of equipment)if(['vendorEquipmentNo','referenceDrawings'].some(key=>new Set(view.scheduleRows(id).filter(b=>b.mainEquipment===main).map(b=>b[key])).size>1))problems.push(id+' / Conflicting equipment header references: '+main);
 }
 for(const [r,key] of [['FIELD_SERVICE','sitePeriodDays'],['TRAINING','trainingPeriodDays']])if(view.scheduleRows('C7').some(b=>role(b)===r)&&!field(view,'C7',key).trim())problems.push('C7 / '+key+' OPEN');
 return problems;
}
export function nativeExhibitHtml0550(view,only,includeCover=false){
 const ids=only?[only]:Object.keys(template.schedules);
 const cover=includeCover?`<article class="p55-native-paper"><h2>Volume I — Quotation</h2><p>${escape(view.outputLabel||'DRAFT — NOT FOR SUBMISSION')}</p><p>${escape(view.proposal.documentNo||'OPEN')} / ${escape(view.proposal.revision)}</p><h2>Power of Attorney / Undertaking</h2><p>${escape(view.getRecord('I.cover').content||'OPEN')}</p></article>`:'';
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Exhibit C / ${escape(only||'All Schedules')}</title><style>${nativeFormCss0550}</style></head><body>${cover}${ids.map(id=>nativeSchedule0550(view,id).html).join('')}</body></html>`;
}
export function buildNativeExhibitDocx0550(view,only){
 const blocks=Object.fromEntries(Object.keys(template.schedules).map(id=>[id,nativePages(view,id).pages.map(page=>renderPage(view,page,'xml')).join('')]));
 let xml=template.document.replace(/\{\{SCHEDULE_(\w+)_XML\}\}/g,(_,id)=>blocks[id]);
 if(only){
  // Retain the native final landscape section, logo relationships and styles.
  const start=xml.indexOf('<w:body>')+8,end=xml.lastIndexOf('<w:sectPr');
  xml=xml.slice(0,start)+blocks[only]+xml.slice(end);
 }
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
 const html=format==='html',content=html?nativeExhibitHtml0550(view,only):buildNativeExhibitDocx0550(view,only),url=URL.createObjectURL(new Blob([content],{type:html?'text/html;charset=utf-8':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})),a=document.createElement('a');a.href=url;a.download=`PJ2608-0550_Exhibit-C_${only?'Schedule-'+only:'All-Schedules'}_${view.proposal.revision.replace(/[^\w.-]/g,'_')}_DRAFT.${format}`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
