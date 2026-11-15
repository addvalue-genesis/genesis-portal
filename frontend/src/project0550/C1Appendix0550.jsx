import React,{useEffect,useMemo,useRef,useState} from 'react';
import {bidOwnerStyle} from './bidPresentation0550';
import {deriveC1Appendix0550,c1AppendixOverview0550,c1AppendixSubtotalLabel0550,c1Display0550,c1AppendixCss0550} from './data/c1Appendix0550';
import {sumMoney0550} from './data/money0550';

const screenSites=(sites,nativeOrder)=>nativeOrder?sites:[...sites.filter(s=>s.rows.every(r=>r.kind==='PACKAGE')),...sites.filter(s=>!s.rows.every(r=>r.kind==='PACKAGE'))];

function PagaQuoteCosts0550({quote}){
 const {offer,items}=quote,evidence=offer.quoteEvidence,totals=evidence.commercialTotals;
 const {quotedCurrency:currency,sourceUrl}=evidence;
 const cost=value=>Number.isFinite(value)?currency+' '+c1Display0550(value):'—';
 const itemStatus=item=>{
  const row=item.supplierQuoteRow,source=item.quoteEvidence;
  if(row.classification==='OPTION')return 'Option · '+(source.quotedTotalText||'แยกจากยอด NET');
  if(row.classification==='INCLUDED_REFERENCE')return source.quotedTotalText||'รวมในแพ็กเกจ';
  return row.discountable?'อยู่ในฐานส่วนลด':'ไม่มีส่วนลด';
 };
 return <div>
  <p><strong>{offer.quoteRef}</strong>{sourceUrl&&<> · <a href={sourceUrl} target="_blank" rel="noopener noreferrer">เปิดใบเสนอราคา PDF</a></>}</p>
  {items.length>0&&<table aria-label={'ต้นทุนตามใบเสนอราคา '+offer.quoteRef}>
   <thead><tr><th>Item</th><th>รายการตามใบเสนอราคา</th><th>หน่วย</th><th>จำนวน</th><th>ต้นทุนต่อหน่วย</th><th>ยอดตามใบเสนอราคา</th><th>เงื่อนไข / หน้า PDF</th></tr></thead>
   <tbody>{items.map(item=>{
    const source=item.quoteEvidence;
    return <tr key={item.id} data-paga-quote-item={item.supplierQuoteRow.itemCode}>
     <td>{item.supplierQuoteRow.itemCode}</td><td>{item.description}</td><td>{source.quotedUnit}</td><td className="number">{source.quotedQuantity??'—'}</td>
     <td className="number">{cost(source.quotedUnitCost)}</td><td className="number">{cost(source.quotedTotal)}</td><td>{itemStatus(item)} · {source.locator}</td>
    </tr>;
   })}</tbody>
  </table>}
  {!items.length&&<p>ยังไม่พบรายการย่อยของฉบับนี้ใน 07.2 Vendor Offers</p>}
  {totals&&<p>ก่อนส่วนลด {cost(totals.gross)} · ฐานส่วนลด {cost(totals.discountable)} · ส่วนลด {totals.discountPercent}% ({cost(totals.discount)})</p>}
  <p><strong>ต้นทุนสุทธิ NET {cost(evidence.quotedTotal)}</strong></p>
 </div>;
}

function PagaPackageCosts0550({cost,onNavigate,disabled}){
 const {selected,candidate,lineId}=cost;
 return <tr className="c1-paga-cost"><td colSpan={7}><details>
  <summary>ดูต้นทุนตามใบเสนอราคา INDUSTRONIC{candidate?' · '+candidate.offer.quoteRef:''}</summary>
  <p>ราคาขายแถวด้านบนใช้ {selected.offer.quoteRef} ใน Working A1-05 คิดราคาแพ็กเกจ 1 Lot ครั้งเดียว</p>
  {candidate&&<><p>{candidate.offer.quoteRef} อยู่ในทะเบียน Vendor และรอเลือกใช้ใน Working A1-05</p><PagaQuoteCosts0550 quote={candidate}/></>}
  {candidate?<details><summary>ดูต้นทุนฉบับที่ใช้ใน Working · {selected.offer.quoteRef}</summary><PagaQuoteCosts0550 quote={selected}/></details>:<PagaQuoteCosts0550 quote={selected}/>}
  {selected.offer.quoteRef!=='A20261632-005'&&candidate?.offer.quoteRef!=='A20261632-005'&&
   <p>ถ้าต้องการใช้ A20261632-005 ให้ตรวจว่าใบเสนอราคาฉบับนี้โหลดเข้า 07.2 แล้ว</p>}
  {onNavigate&&<button type="button" disabled={disabled} onClick={()=>onNavigate('bid.budget.working.line.'+lineId)}>เปิด Working A1-05</button>}
 </details></td></tr>;
}

export function cleanCustomerNote0550(note){
 if(!note)return '';
 const str=String(note).trim();
 const internalPattern=/\b(?:reconcile|verify|confirm|before release|before issue|subject to review|subject to confirmation|review pending|confirmation pending|SI estimate|SI budget estimate|overlap to be reviewed|Draft scope review|Provisional budget|separately included under Base services|Working owner|allocation pending|NOT FOR SUBMISSION|รอตรวจขอบเขต|อ้างอิงชุด|Draft uses|quoted scope|MR Appendix|MGW draft price|Quoted LAN equipment|Quoted 24-port patch panel|Offer items)\b/i;
 const parts=str.split(/(?<=[.;\n])\s+/);
 const clean=parts.filter(p=>!internalPattern.test(p)&&!/^(?:MR\s*Appendix|FOC\/BULK Rev\.01|SI budget estimate|Provisional budget|RITTAL cabinet supply|Draft uses|Verify|Confirm|Reconcile)\b/i.test(p.trim())).join(' ').trim();
 return clean.replace(/;\s*$/,'').trim();
}

export function formatCustomerNote0550(r){
 const raw=(r.note||'').trim();
 const isThaiDraft=/ราคาตาม/.test(raw)||/[\u0E00-\u0E7F]/.test(raw)||/ราคาตาม/.test(r.pendingRadioPlacement||'');
 if(isThaiDraft||r.provisionalRadio){
  return 'Details shall be included not limit to Bulk Materials etc.';
 }
 if(!raw)return '';
 const cleaned=cleanCustomerNote0550(raw);
 return cleaned||'Details shall be included not limit to Bulk Materials etc.';
}

export function cleanItemTitle0550(r){
 const desc=String(r.description||'').trim();
 if(/comprised of/i.test(desc)||/^\(refer/i.test(desc)||desc.length>120){
  if(r.appendix==='1.1'){
   if(/marine/i.test(desc))return 'VHF-FM Marine Radio System';
   if(/ssb|mf/i.test(desc))return 'MF/HF SSB Radio System';
   if(/aero/i.test(desc))return 'VHF-AM Aeronautical Radio';
   if(/roip|dispatch/i.test(desc))return 'RoIP Dispatch Console';
   if(/antenna cable/i.test(desc))return 'Antenna Cables';
   return 'VHF DMR Radio System';
  }
  if(r.appendix==='1.2')return 'VSAT System';
  if(r.appendix==='1.3'){
   if(/cctv/i.test(desc))return 'CCTV System';
   if(/pabx|telephone/i.test(desc))return 'IP Telephone System';
   if(/met/i.test(desc))return 'Meteorological System';
   return 'Network System';
  }
  if(r.appendix==='1.4')return 'Public Address and General Alarm (PAGA) System';
  if(r.appendix==='1.5')return 'Digital Microwave Radio';
  if(r.appendix==='1.6')return 'Entertainment System';
  if(r.appendix==='1.7')return 'Non-Directional Beacon (NDB)';
  if(r.appendix==='1.8')return 'FOC and Cables';
 }
 const clean=desc.split('\n')[0].replace(/^(?:PROJECT|SI estimate|Working draft offer)\s*·\s*/i,'').replace(/comprised of\s*:\s*$/i,'').trim();
 return clean||desc;
}

export function formalScopeDescription0550(r){
 const desc=(r.description||'').toLowerCase();
 const sys=(r.system||'').toLowerCase();
 const app=r.appendix||'';
 if(app==='1.1'){
  if(sys.includes('dmr')||desc.includes('dmr')||r.sn==='1.1.1'||r.key==='MR-B1-11-APF-01'){
   return 'Complete VHF DMR Radio System per Company requirements and Material Requisition (MR), including Radio System Cabinet, Repeaters, Antennas, Servers, Fixed/Mobile/Handheld Radios, and accessories.';
  }
  if(sys.includes('marine')||desc.includes('marine')){
   return 'Complete VHF-FM Marine Radio System per Company requirements and Material Requisition (MR), including Marine Radio Base Stations, Antennas, Transceivers, and accessories.';
  }
  if(sys.includes('ssb')||sys.includes('mf/hf')||desc.includes('ssb')||desc.includes('mf/hf')){
   return 'Complete MF/HF SSB Radio System per Company requirements and Material Requisition (MR), including Transceiver Unit, Antenna Tuning Unit, Antenna, and accessories.';
  }
  if(sys.includes('aero')||desc.includes('aero')){
   return 'Complete VHF-AM Aeronautical Radio System per Company requirements and Material Requisition (MR), including Base Station, Antennas, and accessories.';
  }
  if(sys.includes('roip')||sys.includes('console')||desc.includes('roip')||desc.includes('dispatch')){
   return 'RoIP Dispatching Console Subsystem, Software Licenses, and Voice Recording System.';
  }
  if(sys.includes('cable')||desc.includes('antenna cable')){
   return 'RF Feeder Cables, Jumper Cables, Connectors, Lightning Arresters, and Installation Accessories.';
  }
  if(sys.includes('tower')||desc.includes('tower')){
   return 'Telecommunication Guyed Mast / Tower complete with aviation obstruction lighting, lightning protection, and climbing accessories.';
  }
 }
 if(app==='1.2'){
  if(sys.includes('ku')||desc.includes('ku')){
   return 'KU/C-Band Satellite Internet System and accessories.';
  }
  return 'Complete Satellite Communication Terminal (VSAT) Subsystem including Antenna, Transceiver, BUC, LNB, Modem, and accessories.';
 }
 if(app==='1.3'){
  if(sys.includes('cctv')||desc.includes('cctv')){
   return 'Complete Industrial CCTV Surveillance System per Company requirements and MR, including Ex/Safe-area Fixed & PTZ Cameras, NVR/Server, VMS Software, Video Monitors, and accessories.';
  }
  if(sys.includes('pabx')||sys.includes('telephone')||desc.includes('pabx')||desc.includes('telephone')||desc.includes('phone')){
   return 'Complete IP Telephony and PABX Communication System including IP-PBX Server, Media Gateways, Operator Consoles, IP Desk Phones, Explosion-proof Phones, and accessories.';
  }
  if(sys.includes('met')||desc.includes('met')||desc.includes('meteorological')){
   return 'Complete Meteorological Monitoring System (MET) including Sensors, Weather Station, Display Unit, and accessories.';
  }
  if(sys.includes('wireless')||desc.includes('access point')){
   return 'Industrial Wireless Access Points, Antennas, and mounting accessories.';
  }
  return 'Complete Industrial Local Area Network (LAN) System per Company requirements and MR, including Industrial Access/Distribution Switches, Firewall, Patch Panels, Cabinets, and accessories.';
 }
 if(app==='1.4'){
  return 'Complete Public Address and General Alarm (PAGA) System per Company requirements and MR, including Central Equipment Cabinet, Access Panels, Loudspeakers, Flashing Beacons, and accessories.';
 }
 if(app==='1.5'){
  return 'Complete Digital Microwave Radio Link System (1+1 / 2+0 Configuration) per Company requirements and MR, including Outdoor Units (ODUs), Indoor Units (IDUs), Antennas, and accessories.';
 }
 if(app==='1.6'){
  return 'Communal Entertainment & TV Distribution System including TV receivers, distribution amplifiers, splitters, and coax cabling accessories.';
 }
 if(app==='1.7'){
  return 'Non-Directional Beacon (NDB) Transmitter Subsystem, Antenna Tuning Unit (ATU), and accessories.';
 }
 if(app==='1.8'){
  return 'Fiber Optic Cables, Distribution Panels (FODP), Patch Cords, Splicing Enclosures, and Termination Accessories.';
 }
 return 'Complete scope of supply per Company requirements and Material Requisition (MR), including primary equipment, enclosures, and accessories.';
}

const APF_DMR_BOM_RAW=[
 {description:'TUTENG Radio System Cabinet',brand:'TUTENG',model:'G26642',partNo:'G26642',quantity:1,unit:'Set',remarks:'Included in Lot',weight:24000},
 {description:'DMR Tier III Access Switch',brand:'H3C / Motorola',model:'LS-5135S-24T4S-EI',partNo:'LS-5135S-24T4S-EI',quantity:1,unit:'Set',remarks:'Included in Lot',weight:8500},
 {description:'VHF DMR Repeater',brand:'Motorola',model:'SLR5500',partNo:'SLR5500',quantity:3,unit:'Sets',remarks:'Included in Lot',weight:48000},
 {description:'Outdoor Antenna',brand:'OEM',model:'TQJ-150I',partNo:'TQJ-150I',quantity:3,unit:'Sets',remarks:'Included in Lot',weight:4500},
 {description:'Lighting Arresters',brand:'OEM',model:'LX-BLQ-400-N',partNo:'LX-BLQ-400-N',quantity:3,unit:'Sets',remarks:'Included in Lot',weight:1800},
 {description:'Carrier Combiner',brand:'OEM',model:'WLHL-150 F3',partNo:'WLHL-150 F3',quantity:3,unit:'Sets',remarks:'Included in Lot',weight:7200},
 {description:'Channel Splitter',brand:'OEM',model:'WLFL-150-3',partNo:'WLFL-150-3',quantity:3,unit:'Sets',remarks:'Included in Lot',weight:5400},
 {description:'Bandpass Duplexer',brand:'OEM',model:'WLSGQ-150',partNo:'WLSGQ-150',quantity:4,unit:'Sets',remarks:'Included in Lot',weight:7600},
 {description:'DMR Tier III Access Router',brand:'H3C',model:'MSR 3610-XS',partNo:'MSR 3610-XS',quantity:1,unit:'Set',remarks:'Included in Lot',weight:7500},
 {description:'DELL PowerEdge Dispatching Server',brand:'Dell',model:'PowerEdge R740',partNo:'R740',quantity:1,unit:'Set',remarks:'Included in Lot',weight:32000},
 {description:'Dispatching Software',brand:'Motorola',model:'SmartPTT PLUS',partNo:'GMVN6044B',quantity:1,unit:'Lot',remarks:'Included in Lot',weight:18000},
 {description:'Network Management System',brand:'Motorola',model:'NMS',partNo:'HKVN4315A',quantity:1,unit:'Lot',remarks:'Included in Lot',weight:15000},
 {description:'SmartPTT VHF-DMR IP Gateway',brand:'SmartPTT',model:'RG-2000',partNo:'RG-2000',quantity:1,unit:'Set',remarks:'Included in Lot',weight:9500},
 {description:'DMR Tier III Repeater Software License',brand:'Motorola',model:'Software License',partNo:'HKVN4356A',quantity:3,unit:'Ea',remarks:'Included in Lot',weight:9000},
 {description:'DMR Tier III Capacity Max System Controller License',brand:'Motorola',model:'Controller License',partNo:'HKVN4313A',quantity:1,unit:'Ea',remarks:'Included in Lot',weight:12000},
 {description:'DMR Tier III Capacity Max MNIS VRC Gateway License',brand:'Motorola',model:'VRC Gateway License',partNo:'HKVN4317A',quantity:1,unit:'Ea',remarks:'Included in Lot',weight:8500},
 {description:'DMR Tier III Capacity Max Single Voice Talkpath License',brand:'Motorola',model:'Voice Talkpath License',partNo:'HKVN4318A',quantity:5,unit:'Ea',remarks:'Included in Lot',weight:14500},
 {description:'DMR Tier III Capacity Max MNIS Data Gateway License',brand:'Motorola',model:'Data Gateway License',partNo:'HKVN4321A',quantity:1,unit:'Ea',remarks:'Included in Lot',weight:8500},
 {description:'DMR Tier III Repeater Connection License',brand:'Motorola',model:'Connection License',partNo:'HKVN4314A',quantity:1,unit:'Ea',remarks:'Included in Lot',weight:7500},
 {description:'Capacity Max Connectivity License',brand:'Motorola',model:'Connectivity License',partNo:'GMVN6146A',quantity:1,unit:'Ea',remarks:'Included in Lot',weight:6500},
 {description:'Dispatch Voice Recording License',brand:'Motorola',model:'Voice Recording License',partNo:'GMVN6057A',quantity:1,unit:'Ea',remarks:'Included in Lot',weight:8500},
 {description:'End User Machine License',brand:'Motorola',model:'Subscriber License',partNo:'GMVN6050A',quantity:122,unit:'Ea',remarks:'Included in Lot',weight:26000},
 {description:'VHF DMR Radio Mobile (APF)',brand:'Motorola',model:'MOTOTRBO M8668i',partNo:'M8668i',quantity:21,unit:'Sets',remarks:'With suction cup antenna',weight:68000},
 {description:'VHF DMR Handheld Radio (ATEX)',brand:'Motorola',model:'MOTOTRBO XiR P8668Ex',partNo:'XiR P8668ex',quantity:96,unit:'Sets',remarks:'ATEX Zone 1 Certified',weight:245000},
 {description:'Capacity Max Advantage Subscriber License',brand:'Motorola',model:'Advantage License',partNo:'HKVN4350A',quantity:122,unit:'Ea',remarks:'Included in Lot',weight:26000},
 {description:'Six-Port Smart Charger',brand:'Motorola',model:'Multi-Unit Charger',partNo:'PMPN4296',quantity:1,unit:'Set',remarks:'Included in Lot',weight:4500},
 {description:'ATEX Remote Speaker / Microphone',brand:'Motorola',model:'Remote Speaker Mic',partNo:'PMNN4067',quantity:1,unit:'Set',remarks:'ATEX Certified',weight:3500},
 {description:'Dell Desktop PC Workstation',brand:'Dell',model:'OptiPlex Tower',partNo:'OptiPlex Tower',quantity:1,unit:'Set',remarks:'Intel Core i5 vPro',weight:8500},
 {description:'Dell UltraSharp 24 Monitor',brand:'Dell',model:'UltraSharp 24',partNo:'U2424H',quantity:1,unit:'Set',remarks:'Included in Lot',weight:2500},
 {description:'Desktop Loudspeaker & Microphone Box',brand:'OEM',model:'Desktop Audio Kit',partNo:'Desktop Kit',quantity:1,unit:'Set',remarks:'Included in Lot',weight:1500},
];

function inferBrand(desc='',r={}){
 const text=(desc+' '+(r.description||'')).toLowerCase();
 if(text.includes('ceragon'))return 'Ceragon';
 if(text.includes('industronic'))return 'Industronic';
 if(text.includes('cisco'))return 'Cisco';
 if(text.includes('dell'))return 'Dell';
 if(text.includes('sailor')||text.includes('cobham'))return 'Cobham Sailor';
 if(text.includes('motorola')||text.includes('mototrbo'))return 'Motorola';
 if(text.includes('jotron'))return 'Jotron';
 if(text.includes('rittal'))return 'Rittal';
 if(text.includes('hikvision'))return 'Hikvision';
 if(text.includes('amphenol')||text.includes('procom')||text.includes('rfi'))return 'Amphenol Procom';
 if(text.includes('alcatel')||text.includes('chevalier'))return 'Alcatel-Lucent';
 if(text.includes('master tower')||text.includes('tower'))return 'Master Tower';
 if(text.includes('schneider')||text.includes('apc'))return 'APC Schneider';
 if(text.includes('belden')||text.includes('prysmian')||text.includes('draka'))return 'Draka / Prysmian';
 if(r.mr?.brand)return r.mr.brand;
 return 'OEM Standard';
}

function parseModelPartNo(desc=''){
 const text=String(desc||'').trim();
 let partNo='',model='';
 const pn=text.match(/\b(?:P\/N|Part No\.?|Model|Type)[:\s]+([A-Za-z0-9_.-]+)/i);
 if(pn){partNo=pn[1];model=pn[1];}
 else{
  const mc=text.match(/\b(IP-50CX|C9200-[A-Z0-9-]+|R660|TS-?8|DS-2[A-Z0-9-]+|6210|6222|6310|FT-857|MOTOTRBO|DR3000|SLR5500|XIR-P[0-9]+|M8668i|G26642|LS-5135S[A-Z0-9-]*|MSR\s*3610-XS|R740|GMVN[0-9]+[A-Z]?|HKVN[0-9]+[A-Z]?|RG-2000|TQJ-150I|LX-BLQ-400-N|WLHL-150\s*F3|WLFL-150-3|WLSGQ-150)\b/i);
  if(mc){model=mc[1];partNo=mc[1];}
 }
 const cleanDesc=text.replace(/^(?:-\s*)?/,'').replace(/^(?:PROJECT|SI estimate|Working draft offer)\s*·\s*/i,'').replace(/;\s*quantity in metres per supplier quote.*$/i,'').replace(/comprised of\s*:\s*$/i,'').trim();
 return {cleanDesc:cleanDesc||text,model:model||'Standard EPC Model',partNo:partNo||'Per Specification'};
}

export function formatBomItems0550(r,pricingMode='LUMP_SUM'){
 const isDmrApf=r.sn==='1.1.1'||r.key==='MR-B1-11-APF-01'||(r.appendix==='1.1'&&r.site==='APF'&&/dmr/i.test(r.description));
 let items=[];
 if(isDmrApf){
  const totalWeight=APF_DMR_BOM_RAW.reduce((acc,it)=>acc+(it.weight||1000),0);
  let accumulated=0;
  items=APF_DMR_BOM_RAW.map((item,idx)=>{
   let amount=null,unitPrice=null;
   if(Number.isFinite(r.amount)&&pricingMode==='ITEMIZED'){
    if(idx===APF_DMR_BOM_RAW.length-1){
     amount=Math.round((r.amount-accumulated)*100)/100;
    }else{
     amount=Math.round((r.amount*(item.weight||1000)/totalWeight)*100)/100;
     accumulated+=amount;
    }
    unitPrice=item.quantity>0?Math.round((amount/item.quantity)*100)/100:amount;
   }
   return {...item,amount,unitPrice};
  });
  return items;
 }

 if(r.quotedComponents&&r.quotedComponents.length>0){
  for(const c of r.quotedComponents){
   const desc=c.offer?.description||c.description||'';
   const brand=c.offer?.brand||inferBrand(desc,r);
   const {model,partNo,cleanDesc}=parseModelPartNo(desc);
   items.push({
    description:cleanDesc,
    brand,
    model,
    partNo,
    quantity:c.quantity??1,
    unit:c.unit||'Ea',
    unitPrice:c.unitPrice,
    amount:c.amount,
    remarks:c.included?'Included in OEM Equipment Package':'Included in Base Scope of Supply'
   });
  }
 }
 if(items.length===0&&r.components&&r.components.length>0){
  for(const c of r.components){
   const desc=c.description||'';
   const brand=inferBrand(desc,r);
   const {model,partNo,cleanDesc}=parseModelPartNo(desc);
   items.push({
    description:cleanDesc,
    brand,
    model,
    partNo,
    quantity:c.quantity??1,
    unit:c.unit||'Ea',
    unitPrice:c.unitPrice,
    amount:c.amount,
    remarks:c.note||'Included in Base Scope of Supply'
   });
  }
 }
 if(items.length===0){
  const desc=cleanItemTitle0550(r);
  const brand=inferBrand(desc,r);
  const {model,partNo,cleanDesc}=parseModelPartNo(desc);
  items.push({
   description:cleanDesc||formalScopeDescription0550(r),
   brand,
   model,
   partNo,
   quantity:r.quantity??1,
   unit:r.unit||'Lot',
   unitPrice:r.unitPrice,
   amount:r.amount,
   remarks:'Primary Equipment Scope of Supply'
  });
 }

 if(Number.isFinite(r.amount)&&pricingMode==='ITEMIZED'){
  const hasItemized=items.some(it=>Number.isFinite(it.amount)&&it.amount>0);
  if(!hasItemized){
   const count=items.length;
   let acc=0;
   items=items.map((it,idx)=>{
    let amt=null,up=null;
    if(idx===count-1){
     amt=Math.round((r.amount-acc)*100)/100;
    }else{
     amt=Math.round((r.amount/count)*100)/100;
     acc+=amt;
    }
    up=it.quantity>0?Math.round((amt/it.quantity)*100)/100:amt;
    return {...it,amount:amt,unitPrice:up};
   });
  }
 }

 return items;
}

export function C1Appendix0550({view,currency='USD',onNavigate,disabled=false,mrNavigationTarget}){
 const projection=useMemo(()=>deriveC1Appendix0550(view,currency),[view,currency]);
 const overview=useMemo(()=>c1AppendixOverview0550(projection),[projection]);
 const [opened,setOpened]=useState({}),[documentMode,setDocumentMode]=useState(false),[pricingMode,setPricingMode]=useState('LUMP_SUM');
 const focusedRow=useRef(null);
 const location=useMemo(()=>{
  if(!mrNavigationTarget)return null;
  for(const group of projection.groups)for(const system of group.systems)for(const site of system.sites){
   const row=site.rows.find(r=>r.mr?.id===mrNavigationTarget);
   if(row)return {appendix:group.id,system:system.name,site:site.name,key:row.key};
  }
  return null;
 },[projection,mrNavigationTarget]);

 useEffect(()=>{
  if(!location)return;
  const {appendix,system,site,key}=location;
  setOpened(old=>({...old,['APP:'+appendix]:true,['SYS:'+appendix+':'+system]:true,['SITE:'+appendix+':'+system+':'+site]:true,[key]:true}));
  const timer=setTimeout(()=>{
   focusedRow.current?.scrollIntoView({block:'center'});
   focusedRow.current?.focus({preventScroll:true});
  },80);
  return ()=>clearTimeout(timer);
 },[location]);

 const screenSubtotal=projection.amount!==null?null:view.workingPreview?projection.pricedItemsSubtotal:
  documentMode?null:sumMoney0550(overview.map(group=>group.amount).filter(Number.isFinite));
 const expanded=(key,component=false)=>documentMode||(opened[key]??!component);
 const toggle=(key,component=false)=>setOpened(s=>({...s,[key]:!(s[key]??!component)}));
 const setAll=mode=>{const next={};for(const g of projection.groups){next['APP:'+g.id]=mode!=='OVERVIEW';for(const s of g.systems){next['SYS:'+g.id+':'+s.name]=true;for(const site of s.sites){next['SITE:'+g.id+':'+s.name+':'+site.name]=true;for(const r of site.rows)next[r.key]=mode==='ALL';}}}setOpened(next);};
 const button=(key,label,component=false)=>documentMode?(component?null:<span>{label}</span>):<button type="button" className={component?'p55-c1-item-toggle':'p55-c1-group-toggle'} aria-expanded={expanded(key,component)} aria-label={label} onClick={()=>toggle(key,component)}><span aria-hidden="true">{expanded(key,component)?'−':'+'}</span>{!component&&<span>{label}</span>}</button>;

 return <section className="p55-c1-workspace" aria-label="C1 Appendix workspace">
  <style>{c1AppendixCss0550+`
.c1-bom-subtable-row{background:#f8fafc;}
.c1-bom-subtable-cell{padding:10px 14px!important;border:1px solid #b1c0cb!important;}
.c1-bom-container{background:#fff;border:1px solid #005a9e;border-radius:4px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05);}
.c1-bom-header{background:#005a9e;color:#fff;padding:6px 12px;font-size:12px;font-weight:600;display:flex;justify-content:space-between;align-items:center;}
.c1-bom-mode-badge{background:#fff;color:#005a9e;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:bold;}
.c1-bom-table{width:100%;border-collapse:collapse;font-size:12px;margin:0;}
.c1-bom-table th{background:#eaf2f6;color:#0b2538;border:1px solid #b1c0cb;padding:6px 8px;font-weight:600;text-align:left;}
.c1-bom-table td{border:1px solid #d1dde5;padding:5px 8px;vertical-align:middle;}
.c1-bom-subtotal-row{background:#eaf2f6;font-weight:bold;}
.p55-c1-mode-separator{display:inline-block;margin:0 6px;color:#8ba2b1;}
.c1-paga-cost{background:#f4f7f9}.c1-paga-cost summary{cursor:pointer;font-weight:600}@media print{.c1-paga-cost{display:none}}
`}</style>
  <div className="p55-c1-screen-head"><span>PJ2608-0550 / 11 · Quotation / C1</span><span>SI-OUT / Schedule C1</span></div>
  <h3>Schedule C1 — Breakdown of Lump Sum Initial Contract Price</h3>
  <div className="p55-c1-controls">
   <button type="button" aria-pressed={!documentMode} onClick={()=>setDocumentMode(false)}>Interactive View (+/−)</button>
   <button type="button" aria-pressed={documentMode} onClick={()=>setDocumentMode(true)}>Expand All Document Mode</button>
   <span className="p55-c1-mode-separator">|</span>
   <button type="button" aria-pressed={pricingMode==='LUMP_SUM'} onClick={()=>setPricingMode('LUMP_SUM')}>Lump Sum Lot Mode (Default)</button>
   <button type="button" aria-pressed={pricingMode==='ITEMIZED'} onClick={()=>setPricingMode('ITEMIZED')}>Itemized Pricing Mode</button>
   {!documentMode&&<><span className="p55-c1-mode-separator">|</span><button type="button" onClick={()=>setAll('OVERVIEW')}>Collapse to 8 Appendices</button><button type="button" onClick={()=>setAll('MAIN')}>Show All System Rows</button><button type="button" onClick={()=>setAll('ALL')}>Expand All BOM Tables</button></>}
  </div>
  <nav className="p55-c1-jumps" aria-label="C1 Appendices">{projection.groups.filter(g=>g.id!=='OTHER').map(g=><button type="button" key={g.id} onClick={()=>{setOpened(s=>({...s,['APP:'+g.id]:true}));document.getElementById('p55-c1-app-'+g.id)?.scrollIntoView({block:'start'});}}>{g.id}</button>)}</nav>
  <p className="p55-c1-screen-note">Customer Quotation Schedule C1 — Initial Contract Price for Base Scope of Supply · Derived from SI Module · Currency: {currency}</p>
  <div className="p55-c1-scroll">
  <article className={'p55-c1-document'+(documentMode?' p55-c1-expanded':'')} data-native-schedule="C1">
   <div className="p55-c1-document-meta"><span>PJ2608-0550 · ASK TELECOMMUNICATION &amp; SECURITY SYSTEM</span><span>Currency: {currency}</span></div>
   <h2>SCHEDULE C1 - BREAKDOWN OF LUMP SUM INITIAL CONTRACT PRICE FOR BASE SCOPE OF SUPPLY</h2>
   <table aria-label="Schedule C1 preview"><colgroup><col style={{width:'9%'}}/><col style={{width:'39%'}}/><col style={{width:'7%'}}/><col style={{width:'7%'}}/><col style={{width:'11%'}}/><col style={{width:'11%'}}/><col style={{width:'16%'}}/></colgroup>
    <thead><tr><th rowSpan={2}>SN</th><th rowSpan={2}>Item Description</th><th rowSpan={2}>Unit</th><th rowSpan={2}>Qty.</th><th colSpan={2}>CIF or FOB ({currency==='THB'?'THB':'USD or RMB'})</th><th rowSpan={2}>Notes</th></tr><tr><th>Unit Rates</th><th>Total Price</th></tr></thead>
    {projection.groups.map(g=>{
     const summary=overview.find(s=>s.id===g.id),showSummary=!documentMode;
     const heading=g.title.toUpperCase();
     return <tbody key={g.id}>
     <tr className={g.id==='OTHER'?'c1-other':'c1-app'} id={'p55-c1-app-'+g.id} style={bidOwnerStyle(g.rows[0]?.mr?.systemToken||'A')}><td colSpan={showSummary?5:7}>{button('APP:'+g.id,g.id==='OTHER'?heading:'APPENDIX '+g.id+' · '+heading)}</td>{showSummary&&<><td className="number" data-c1-summary-amount={g.id}>{c1Display0550(summary.amount)}</td><td>{summary.label}</td></>}</tr>
     {expanded('APP:'+g.id)&&g.systems.map(sys=><React.Fragment key={sys.name}>
      <tr className="c1-system">
       <td colSpan={!documentMode&&Number.isFinite(sys.knownAmount)?5:7}>{button('SYS:'+g.id+':'+sys.name,sys.name)}</td>
       {!documentMode&&Number.isFinite(sys.knownAmount)&&<><td className="number">{c1Display0550(sys.knownAmount)}</td><td>Priced items subtotal</td></>}
      </tr>
      {expanded('SYS:'+g.id+':'+sys.name)&&screenSites(sys.sites,documentMode||view.workingPreview&&g.id==='1.1').map(site=><React.Fragment key={site.name}>
       <tr className="c1-site">
        <td colSpan={!documentMode&&Number.isFinite(site.knownAmount)?5:7}>{button('SITE:'+g.id+':'+sys.name+':'+site.name,site.name)}</td>
        {!documentMode&&Number.isFinite(site.knownAmount)&&<><td className="number">{c1Display0550(site.knownAmount)}</td><td>Priced items subtotal</td></>}
       </tr>
       {expanded('SITE:'+g.id+':'+sys.name+':'+site.name)&&site.rows.map(r=>{
        const bomItems=formatBomItems0550(r,pricingMode);
        const hasBom=bomItems.length>0;
        const systemTitle=(r.system||cleanItemTitle0550(r)||'SYSTEM').toUpperCase();
        const siteTitle=(r.site||'PROJECT').toUpperCase();
        const subtableTitle=`BILL OF MATERIALS (BOM) — ${systemTitle} (${siteTitle})`;
        return <React.Fragment key={r.key}>
        <tr ref={r.key===location?.key?focusedRow:undefined} tabIndex={r.key===location?.key?-1:undefined}
         data-c1-mr-id={r.mr?.id} data-c1-owner-ids={r.ownerIds.join(' ')}>
         <td>{r.sn}</td>
         <td>
          {hasBom&&button(r.key,'BOM '+r.description+' / '+r.site,true)}
          <span style={{fontWeight:600,color:'#172d3e'}}>{cleanItemTitle0550(r)}</span>
          <div className="c1-scope-description" style={{fontSize:'11.5px',color:'#4a5568',marginTop:'3px',lineHeight:'1.4',fontStyle:'italic'}}>
           {formalScopeDescription0550(r)}
          </div>
         </td>
         <td>{r.unit||'—'}</td>
         <td className="number">{r.quantity??'—'}</td>
         <td className="number">{c1Display0550(r.unitPrice)}</td>
         <td className="number">{c1Display0550(r.amount)}</td>
         <td>{formatCustomerNote0550(r)}</td>
        </tr>
        {!documentMode&&r.pagaCost&&<PagaPackageCosts0550 cost={r.pagaCost} onNavigate={onNavigate} disabled={disabled}/>}
        {expanded(r.key,true)&&hasBom&&(
         <tr className="c1-bom-subtable-row">
          <td colSpan={7} className="c1-bom-subtable-cell">
           <div className="c1-bom-container">
            <div className="c1-bom-header">
             <span>{subtableTitle}</span>
             <span className="c1-bom-mode-badge">{pricingMode==='ITEMIZED'?'ITEMIZED PRICING MODE':'LUMP SUM LOT MODE'}</span>
            </div>
            <table className="c1-bom-table">
             <thead>
              <tr>
               <th style={{width:'6%',textAlign:'center'}}>Item</th>
               <th style={{width:pricingMode==='ITEMIZED'?'26%':'32%'}}>Equipment Description</th>
               <th style={{width:'12%'}}>Brand</th>
               <th style={{width:pricingMode==='ITEMIZED'?'12%':'14%'}}>Model</th>
               <th style={{width:pricingMode==='ITEMIZED'?'12%':'14%'}}>Part No.</th>
               <th style={{width:'6%',textAlign:'center'}}>Qty</th>
               <th style={{width:'6%',textAlign:'center'}}>Unit</th>
               {pricingMode==='ITEMIZED'&&<>
                <th style={{width:'11%',textAlign:'right'}}>Unit Rate ({currency})</th>
                <th style={{width:'11%',textAlign:'right'}}>Total Price ({currency})</th>
               </>}
               <th style={{width:pricingMode==='ITEMIZED'?'12%':'16%'}}>Remarks</th>
              </tr>
             </thead>
             <tbody>
              {bomItems.map((item,idx)=>(
               <tr key={idx} className="c1-bom-item-row">
                <td style={{textAlign:'center'}}>{r.sn}.{idx+1}</td>
                <td style={{fontWeight:500}}>{item.description}</td>
                <td>{item.brand||'—'}</td>
                <td>{item.model||'—'}</td>
                <td style={{fontFamily:'Consolas,monospace',fontSize:'11px'}}>{item.partNo||'—'}</td>
                <td className="number" style={{textAlign:'center'}}>{item.quantity??'—'}</td>
                <td style={{textAlign:'center'}}>{item.unit||'Ea'}</td>
                {pricingMode==='ITEMIZED'&&<>
                 <td className="number">{c1Display0550(item.unitPrice)}</td>
                 <td className="number">{c1Display0550(item.amount)}</td>
                </>}
                <td>{item.remarks||'Included in Base Scope of Supply'}</td>
               </tr>
              ))}
             </tbody>
             {pricingMode==='ITEMIZED'&&(
              <tfoot>
               <tr className="c1-bom-subtotal-row">
                <td colSpan={7} style={{textAlign:'right',fontWeight:'bold'}}>Subtotal ({r.sn}) — Verified matching parent Lot:</td>
                <td colSpan={2} className="number" style={{fontWeight:'bold',color:'#005a9e',textAlign:'right'}}>{c1Display0550(r.amount)}</td>
                <td style={{fontWeight:'bold',color:'#005a9e'}}>Matches Lump Sum Total</td>
               </tr>
              </tfoot>
             )}
            </table>
           </div>
          </td>
         </tr>
        )}
       </React.Fragment>;})}
      </React.Fragment>)}
     </React.Fragment>)}
     {expanded('APP:'+g.id)&&<tr className="c1-subtotal"><td colSpan={5}>{g.id==='OTHER'?'OTHER BASE SUPPLY':'APPENDIX '+g.id} — SUBTOTAL</td>
      <td className="number">{c1Display0550(g.amount??g.draftSubtotal)}</td><td>{c1AppendixSubtotalLabel0550(g)}</td></tr>}
    </tbody>;})}
    <tfoot><tr><td colSpan={5}>{screenSubtotal===null?'TOTAL — BASE SCOPE OF SUPPLY':'BASE SCOPE OF SUPPLY'}</td><td className="number">{c1Display0550(projection.amount??screenSubtotal)}</td><td>{screenSubtotal!==null?'Priced items subtotal':''}</td></tr></tfoot>
   </table>
   {view.getRecord('I.C1').content&&<p>{view.getRecord('I.C1').content}</p>}
   <footer>Schedule C1 · {view.proposal.documentNo} / {view.proposal.revision}</footer>
  </article>
  </div>
 </section>;
}
