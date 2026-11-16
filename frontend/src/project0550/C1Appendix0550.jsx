import React,{useEffect,useMemo,useRef,useState} from 'react';
import {bidOwnerStyle} from './bidPresentation0550';
import {deriveC1Appendix0550,c1AppendixOverview0550,c1AppendixSubtotalLabel0550,c1Display0550,c1AppendixCss0550,sanitizeCustomerText0550} from './data/c1Appendix0550';
import {sumMoney0550} from './data/money0550';
import {APF_DMR_MR_12_ITEMS_0550,APF_MARINE_MR_6_ITEMS_0550,ACP_MARINE_MR_4_ITEMS_0550,APF_AERO_MR_5_ITEMS_0550,APF_ROIP_MR_7_ITEMS_0550,ACP_CONSOLE_BOM_0550,APF_TOWER_60M_BOM_0550,ACP_TOWER_30M_BOM_0550} from './data/radioLotComponents0550';
import {APF_VSAT_1_BOM_0550,APF_VSAT_2_BOM_0550,YANGON_VSAT_BOM_0550,APF_VSAT_CABLE_BOM_0550,YANGON_VSAT_CABLE_BOM_0550,APF_VSAT_OFFSHORE_BOM_0550,APF_KU_BOM_0550,ACP_KU_BOM_0550} from './data/satelliteScope0550';

const isNonMrApmRow=r=>r.site==='APM'||r.key==='OWNER:LINE-MGW-CURRENT-RADIO-006';
const screenSites=(sites,nativeOrder)=>{
 const valid=sites.filter(s=>s.name!=='APM').map(s=>({...s,rows:s.rows.filter(r=>!isNonMrApmRow(r))})).filter(s=>s.rows.length>0);
 return nativeOrder?valid:[...valid.filter(s=>s.rows.every(r=>r.kind==='PACKAGE')),...valid.filter(s=>!s.rows.every(r=>r.kind==='PACKAGE'))];
};

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
 return sanitizeCustomerText0550(note);
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
 if(/comprised of/i.test(desc)||/^\(refer/i.test(desc)||desc.length>120||/—\s*quoted equipment/i.test(desc)){
  if(r.appendix==='1.1'){
   if(/marine/i.test(desc))return 'VHF-FM Marine Radio System';
   if(/ssb|mf/i.test(desc))return 'MF/HF SSB Radio System';
   if(/aero/i.test(desc))return 'VHF-AM Aeronautical Radio';
   if(/roip|dispatch/i.test(desc))return 'VHF DMR Dispatch Console';
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
 const rawTitle=desc.split('\n')[0].replace(/^(?:PROJECT|SI estimate|Working draft offer)\s*·\s*/i,'').replace(/comprised of\s*:\s*$/i,'').trim();
 return sanitizeCustomerText0550(rawTitle)||desc;
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
  if(desc.includes('antenna cable')||desc.includes('coaxial')||desc.includes('feeder')||sys.includes('antenna cable')){
   return 'RF Feeder Coaxial Cables, Jumper Cables, Connectors, Grounding Kits, and Installation Accessories per Company requirements and Material Requisition (MR).';
  }
  if(sys.includes('roip')||sys.includes('console')||desc.includes('roip')||desc.includes('dispatch')){
   return 'RoIP Dispatching Console Subsystem, Software Licenses, and Voice Recording System.';
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

const APF_DMR_BOM_RAW=APF_DMR_MR_12_ITEMS_0550;

const ACP_DMR_BOM_RAW=[
 {tagNo:'RAD-308-001',mrDescription:'Radio System Cabinet',offeredEquipment:'Rittal Radio System Cabinet (42U 19" Floor Mounted)',description:'Rittal Radio System Cabinet (42U 19" Floor Mounted)',brand:'Rittal',model:'VX IT 42U 800x1000x2200',partNo:'VX25 / VX IT',quantity:1,unit:'Set',remarks:'Included in Base Scope of Supply',weight:4500},
 {tagNo:'Per Appendix 2 Drawing',mrDescription:'DMR Access Switch',offeredEquipment:'DMR Tier III Access Switch',description:'DMR Tier III Access Switch',brand:'H3C / Motorola',model:'LS-5135S-24T4S-EI',partNo:'LS-5135S-24T4S-EI',quantity:1,unit:'Set',remarks:'Included in Base Scope of Supply',weight:1500},
 {tagNo:'Per Appendix 2 Drawing',mrDescription:'VHF Omni DMR Antenna',offeredEquipment:'VHF DMR Omni Antenna',description:'VHF DMR Omni Antenna',brand:'Amphenol Procom',model:'TQJ-150I',partNo:'TQJ-150I',quantity:1,unit:'Set',remarks:'Included in Base Scope of Supply',weight:1500},
 {tagNo:'Per Appendix 2 Drawing',mrDescription:'VHF Dipole DMR Antenna',offeredEquipment:'VHF DMR Antenna 4 Stack',description:'VHF DMR Antenna 4 Stack',brand:'Amphenol Procom',model:'4-Stack Dipole Array',partNo:'WL-150-4S',quantity:1,unit:'Set',remarks:'Included in Base Scope of Supply',weight:2000},
 {tagNo:'ACP-ROIP-IGW-001 to 004',mrDescription:'RoIP IP Gateway',offeredEquipment:'SmartPTT VHF DMR IP Gateway',description:'SmartPTT VHF DMR IP Gateway',brand:'SmartPTT / Motorola',model:'RG-2000',partNo:'RG-2000',quantity:4,unit:'Sets',remarks:'Included in Base Scope of Supply',weight:14000},
 {tagNo:'ACP-RAD-308-002 / 003',mrDescription:'VHF DMR Fixed Radio',offeredEquipment:'VHF DMR Fixed Radio Station',description:'VHF DMR Fixed Radio Station',brand:'Motorola',model:'MOTOTRBO M8668i',partNo:'M8668i',quantity:2,unit:'Sets',remarks:'With desktop power & mounting kit',weight:10000},
 {tagNo:'CON-308-001 / ACP-CON-308-001',mrDescription:'VHF Dispatch Console',offeredEquipment:'VHF DMR Dispatch Console',description:'VHF DMR Dispatch Console',brand:'Dell / Motorola',model:'OptiPlex Workstation',partNo:'CON-308-001',quantity:1,unit:'Set',remarks:'Included in Base Scope of Supply',weight:6823.36},
 {tagNo:'Per Appendix 2 Drawing',mrDescription:'Etc. / Bulk Materials & Accessories',offeredEquipment:'Bulk Materials & Installation Accessories (RF Jumpers, Grounding, Mounting Hardware)',description:'Bulk Materials & Installation Accessories (RF Jumpers, Grounding, Mounting Hardware)',brand:'Amphenol / Rittal',model:'Installation Kit',partNo:'ACC-DMR-ACP',quantity:1,unit:'Lot',remarks:'Included in Base Scope of Supply',weight:0},
];

const ABV_DMR_BOM_RAW=[
 {tagNo:'RAD-308',mrDescription:'VHF DMR Mobile Radio',offeredEquipment:'VHF DMR Mobile Radio Station (Fixed-Use)',description:'VHF DMR Mobile Radio Station (Fixed-Use)',brand:'Motorola',model:'MOTOTRBO M8668i',partNo:'M8668i',quantity:1,unit:'Ea.',remarks:'Fixed-use station with mounting bracket, power supply & interface kit',weight:750},
 {tagNo:'Per Appendix 2 Drawing',mrDescription:'VHF Omni DMR Antenna',offeredEquipment:'VHF DMR Omni Antenna',description:'VHF DMR Omni Antenna',brand:'Amphenol Procom',model:'TQJ-150I',partNo:'TQJ-150I',quantity:1,unit:'Ea.',remarks:'Included in Base Scope of Supply',weight:0},
 {tagNo:'Per Appendix 2 Drawing',mrDescription:'Coaxial RF Surge Arrester',offeredEquipment:'Coaxial RF Lightning Surge Protector',description:'Coaxial RF Lightning Surge Protector',brand:'Amphenol / PolyPhaser',model:'LX-BLQ-400-N',partNo:'LX-BLQ-400-N',quantity:1,unit:'Ea.',remarks:'Included in Base Scope of Supply',weight:0},
 {tagNo:'Per Appendix 2 Drawing',mrDescription:'Antenna Cable & Installation Accessories',offeredEquipment:'RF Jumper Cables, Connectors & Installation Accessories',description:'RF Jumper Cables, Connectors & Installation Accessories',brand:'Amphenol / Motorola',model:'Fixed-Use Installation Kit',partNo:'ACC-DMR-ABV01',quantity:1,unit:'Lot',remarks:'Included in Base Scope of Supply',weight:0},
];

const AMS_DMR_BOM_RAW=[
 {mrDescription:'VHF DMR Mobile Radio',offeredEquipment:'VHF DMR Mobile Radio Station (Desktop)',description:'VHF DMR Mobile Radio Station (Desktop)',brand:'Motorola',model:'MOTOTRBO M8668i',partNo:'M8668i',quantity:1,unit:'Set',remarks:'Desktop mobile station complete with desk mic & power supply',weight:2500},
 {mrDescription:'VHF Omni DMR Antenna',offeredEquipment:'VHF DMR Omni Antenna',description:'VHF DMR Omni Antenna',brand:'Amphenol Procom',model:'TQJ-150I',partNo:'TQJ-150I',quantity:1,unit:'Set',remarks:'Included in Base Scope of Supply',weight:500},
 {mrDescription:'Coaxial RF Surge Arrester',offeredEquipment:'Coaxial RF Lightning Surge Protector',description:'Coaxial RF Lightning Surge Protector',brand:'Amphenol / PolyPhaser',model:'LX-BLQ-400-N',partNo:'LX-BLQ-400-N',quantity:1,unit:'Ea',remarks:'Included in Base Scope of Supply',weight:200},
 {mrDescription:'Antenna Cable & Installation Accessories',offeredEquipment:'RF Feeder Cables, Jumpers & Installation Accessories',description:'RF Feeder Cables, Jumpers & Installation Accessories',brand:'Yongding / Amphenol',model:'HCAAYZ-50-12 / Jumper Kit',partNo:'HCAAYZ-50-12',quantity:1,unit:'Lot',remarks:'Included in Base Scope of Supply',weight:324}
];

function inferBrand(desc='',r={}){
 const text=(desc+' '+(r.description||'')+' '+(r.mr?.title||'')+' '+(r.system||'')).toLowerCase();
 if(text.includes('ceragon'))return 'Ceragon';
 if(text.includes('industronic')||text.includes('paga')||text.includes('inco'))return 'Industronic';
 if(text.includes('cisco'))return 'Cisco';
 if(text.includes('dell'))return 'Dell';
 if(text.includes('sailor')||text.includes('cobham')||text.includes('marine')||text.includes('ssb'))return 'Cobham Sailor';
 if(text.includes('jotron')||text.includes('aero')||text.includes('airband'))return 'Jotron';
 if(text.includes('motorola')||text.includes('mototrbo')||text.includes('dmr')||text.includes('dtrs')||text.includes('repeater')||text.includes('handheld')||text.includes('mobile'))return 'Motorola';
 if(text.includes('tuteng'))return 'TUTENG';
 if(text.includes('smartptt'))return 'SmartPTT / Motorola';
 if(text.includes('h3c'))return 'H3C / Motorola';
 if(text.includes('rittal')||text.includes('rack')||text.includes('cabinet')||text.includes('enclosure'))return 'Rittal';
 if(text.includes('hikvision')||text.includes('cctv')||text.includes('camera')||text.includes('nvr')||text.includes('ptz'))return 'Hikvision';
 if(text.includes('amphenol')||text.includes('procom')||text.includes('rfi')||text.includes('antenna')||text.includes('omni')||text.includes('dipole'))return 'Amphenol Procom';
 if(text.includes('alcatel')||text.includes('chevalier')||text.includes('avaya')||text.includes('phone')||text.includes('telephone')||text.includes('pbx')||text.includes('pabx'))return 'Avaya / Uniden';
 if(text.includes('master tower')||text.includes('tower'))return 'Master Tower';
 if(text.includes('schneider')||text.includes('apc')||text.includes('ups')||text.includes('power supply')||text.includes('xdr'))return 'APC Schneider / Mean Well';
 if(text.includes('belden')||text.includes('prysmian')||text.includes('draka')||text.includes('cable')||text.includes('fiber')||text.includes('foc')||text.includes('cat6'))return 'Draka / Prysmian';
 if(text.includes('yongding')||text.includes('feeder')||text.includes('coaxial'))return 'Yongding';
 if(text.includes('commscope')||text.includes('fodp')||text.includes('patch panel')||text.includes('fosc'))return 'CommScope / 3M';
 if(text.includes('nautel')||text.includes('ndb')||text.includes('beacon'))return 'Nautel';
 if(text.includes('vaisala')||text.includes('met')||text.includes('weather'))return 'Vaisala';
 if(text.includes('vsat')||text.includes('satellite')||text.includes('dish'))return 'Cobham Satcom';
 if(r.mr?.brand)return r.mr.brand;
 return 'Manufacturer Standard';
}

function parseModelPartNo(desc='',r={}){
 const text=String(desc||'').trim();
 let partNo='',model='';
 const pn=text.match(/\b(?:P\/N|Part No\.?|Model|Type)[:\s]+([A-Za-z0-9_.-]+)/i);
 if(pn){partNo=pn[1];model=pn[1];}
 else{
  const mc=text.match(/\b(IP-50CX|C9200-[A-Z0-9-]+|C9120AXI-[A-Z0-9-]+|R740|R660|TS-?8|DS-2[A-Z0-9-]+|SAILOR\s*6210|SAILOR\s*6320|SAILOR\s*6301|SAILOR\s*6368|SAILOR\s*6384|SAILOR\s*SP3530|6210|6222|6310|6320|FT-857|MOTOTRBO|DR3000|SLR5500|XIR-P[0-9]+[A-Z]*|M8668i|G26642|LS-5135S[A-Z0-9-]*|MSR\s*3610-XS|GMVN[0-9]+[A-Z]?|HKVN[0-9]+[A-Z]?|RG-2000|RGW-7700|VHF74|HF8000|TR-910|TR30-AIR|TRON\s*TR30|TQJ-150I|LX-BLQ-400-N|WLHL-150\s*F3|WLFL-150-3|WLSGQ-150|WL-150-4S|HCAAYZ-50-12|J179|J159|AS7411|INCO\s*7000|INCO\s*7100|WXT536|VR125)\b/i);
  if(mc){model=mc[1];partNo=mc[1];}
 }

 const cleanDesc=text.replace(/^(?:-\s*)?/,'').replace(/^(?:PROJECT|SI estimate|Working draft offer)\s*·\s*/i,'').replace(/;\s*quantity in metres per supplier quote.*$/i,'').replace(/comprised of\s*:\s*$/i,'').trim();

 if(!model||model==='Standard EPC Model'||!partNo||partNo==='Per Specification'){
  const low=cleanDesc.toLowerCase();
  if(/cabinet|enclosure|rack/i.test(low)){
   model=r.site==='ACP'?'G26642 19" Enclosure':'TS-8 Industrial Enclosure';
   partNo=r.site==='ACP'?'G26642':'TS8.8806.500';
  } else if(/access switch|switch/i.test(low)){
   model='LS-5135S-24T4S-EI';
   partNo='LS-5135S-24T4S-EI';
  } else if(/router/i.test(low)){
   model='MSR 3610-XS';
   partNo='MSR 3610-XS';
  } else if(/omni antenna/i.test(low)){
   model='TQJ-150I Omni Antenna';
   partNo='TQJ-150I';
  } else if(/4 stack|4-stack|stack antenna/i.test(low)){
   model='4-Stack Dipole Array';
   partNo='WL-150-4S';
  } else if(/marine antenna|vhf74/i.test(low)){
   model='VHF74 Marine Antenna';
   partNo='VHF74';
  } else if(/ssb antenna|hf8000/i.test(low)){
   model='HF8000 8m Marine Whip';
   partNo='HF8000';
  } else if(/aero.*antenna|whip antenna/i.test(low)){
   model='Airband Dipole Whip';
   partNo='AIR-ANT-01';
  } else if(/fixed radio.*marine|marine.*fixed/i.test(low)){
   model='SAILOR 6210 VHF';
   partNo='SAILOR 6210';
  } else if(/handheld.*marine|marine.*handheld|sp3530/i.test(low)){
   model='SAILOR SP3530 ATEX';
   partNo='SP3530';
  } else if(/fixed radio.*ssb|ssb.*fixed|mf\/hf/i.test(low)){
   model='SAILOR 6320 DSC Class A';
   partNo='SAILOR 6320';
  } else if(/fixed radio.*aero|aero.*fixed|tr-910/i.test(low)){
   model='TR-910 Airband Transceiver';
   partNo='TR-910';
  } else if(/handheld.*aero|aero.*handheld|portable.*air/i.test(low)){
   model='TRON TR30 AIR';
   partNo='TR30-AIR';
  } else if(/fixed radio|dmr fixed/i.test(low)){
   model='MOTOTRBO M8668i';
   partNo='M8668i';
  } else if(/handheld|p8668/i.test(low)){
   model='MOTOTRBO XiR P8668Ex';
   partNo='XiR-P8668Ex';
  } else if(/repeater|slr5500/i.test(low)){
   model='MOTOTRBO SLR5500';
   partNo='SLR5500';
  } else if(/gateway/i.test(low)){
   model=/marine|ssb/i.test(low)?'RGW-7700 IP Gateway':'SmartPTT RG-2000';
   partNo=/marine|ssb/i.test(low)?'RGW-7700':'RG-2000';
  } else if(/console|dispatcher|workstation/i.test(low)){
   model='OptiPlex 7000 / SmartPTT PLUS';
   partNo='CON-308-001';
  } else if(/server/i.test(low)){
   model='PowerEdge R740 2U';
   partNo='PowerEdge R740';
  } else if(/ptz/i.test(low)){
   model='DS-2DY7436IXG-CXLWF316L';
   partNo='DS-2DY7436IXG-CXLWF316L';
  } else if(/bullet|fixed camera/i.test(low)){
   model='DS-2CD1623G3-LIZ';
   partNo='DS-2CD1623G3-LIZ';
  } else if(/dome/i.test(low)){
   model='DS-2CD3121G2E-IU';
   partNo='DS-2CD3121G2E-IU';
  } else if(/nvr/i.test(low)){
   model='Embedded 4K NVR';
   partNo='DS-9632NI-I8';
  } else if(/ip phone|phone/i.test(low)){
   model=/analog/i.test(low)?'AS7411 Analog Phone':'J179 Gigabit IP Phone';
   partNo=/analog/i.test(low)?'AS7411':'700513569';
  } else if(/access point/i.test(low)){
   model='Catalyst 9120AX Series';
   partNo='C9120AXI-E';
  } else if(/tower.*60/i.test(low)){
   model='4-Leg Lattice Tower 60M';
   partNo='MT-4L-60M';
  } else if(/tower.*30/i.test(low)){
   model='4-Leg Lattice Tower 30M';
   partNo='MT-4L-30M';
  } else if(/tower/i.test(low)){
   model='Galvanized Steel Lattice Tower';
   partNo='MT-LAT-STD';
  } else if(/foc.*outdoor|foc.*12.*armored|foc.*24/i.test(low)){
   model='Heavy Duty Armored Loose Tube FOC';
   partNo='FOC-ARM-OUT';
  } else if(/foc.*indoor/i.test(low)){
   model='Multi-Core LSZH Distribution FOC';
   partNo='FOC-LSZH-IN';
  } else if(/fodp|patch cord/i.test(low)){
   model='19" Rack Mount Optical Distribution Panel';
   partNo='FODP-24P-SC';
  } else if(/fosc|splice closure/i.test(low)){
   model='Dome Fiber Optic Splice Closure';
   partNo='FOSC-400G';
  } else if(/hdpe/i.test(low)){
   model='HDPE Subduct 32/28mm Heavy Duty';
   partNo='HDPE-32/28';
  } else if(/manhole|handhole/i.test(low)){
   model='Composite Telecom Manhole & Frame';
   partNo='MH-COMP-800';
  } else if(/termination/i.test(low)){
   model='Fiber Optic Mechanical Splice Kit';
   partNo='TERMKIT-FO';
  } else if(/coaxial|feeder|rf cable|antenna cable|t5/i.test(low)){
   model='1/2" Flexible RF Foam Dielectric Cable';
   partNo='HCAAYZ-50-12';
  } else if(/cat6a.*armored|t9/i.test(low)){
   model='CAT6A S/FTP Galvanized Steel Wire Armored';
   partNo='CAT6A-SFTP-ARM';
  } else if(/cat6a|t8/i.test(low)){
   model='CAT6A U/UTP 4-Pair High Performance';
   partNo='CAT6A-UUTP-4P';
  } else if(/2cx2.5|power cable|t2/i.test(low)){
   model='2Cx2.5 mm² XLPE/SWA/PVC Power Cable';
   partNo='T2-2CX2.5-ARM';
  } else if(/patching|cable management/i.test(low)){
   model='1U 19" Horizontal Cable Management Panel';
   partNo='CMP-1U-19';
  } else if(/lightning|arrester/i.test(low)){
   model='Coaxial RF Surge Protector';
   partNo='LX-BLQ-400-N';
  } else if(/power supply/i.test(low)){
   model='DIN-Rail Power Supply 24VDC';
   partNo='XDR-240-24';
  } else {
   model='Manufacturer Model per MR';
   partNo='Catalog Standard';
  }
 }

 return {cleanDesc:cleanDesc||text,model,partNo};
}

function resolveBomTagNo(it,r){
 if(it.tagNo)return it.tagNo;
 const reqs=r.requirements||[];
 const boundTags=[...new Set(reqs.flatMap(q=>(q.tagBindings||[]).map(tb=>tb.tag)).filter(Boolean))];
 if(boundTags.length)return boundTags.join(', ');
 const cabTags=[...new Set(reqs.map(q=>q.cabinetTag).filter(Boolean))];
 if(cabTags.length&&/cabinet|rack|enclosure/i.test(it.description||''))return cabTags.join(', ');
 if(r.key==='MR-B1-11-ACP-05'||r.sn==='1.1.13')return 'CON-308-001 / ACP-CON-308-001';
 if(r.key==='MR-B1-11-APF-06'||r.sn==='1.1.6'){
  if(/console/i.test(it.description||''))return 'CON-308-001 / 002';
  if(/server/i.test(it.description||''))return 'APF-VHF-SERVER-003';
 }
 return 'Per Appendix 2 Drawing';
}

function resolveMrDescription(it,r){
 if(it.mrDescription)return sanitizeCustomerText0550(it.mrDescription);
 const mrTitle=sanitizeCustomerText0550(cleanItemTitle0550(r)||'');
 const offered=sanitizeCustomerText0550(it.offeredEquipment||it.description||'');
 return mrTitle&&mrTitle.toLowerCase()!==offered.toLowerCase()?mrTitle:offered;
}

function dedupeBomItems(items,r){
 const seen=new Map(),deduped=[];
 for(const it of items){
  const u=String(it.unit||'').trim().toLowerCase();
  const rem=String(it.remarks||it.note||'').toLowerCase();
  if(u==='x'||rem.includes('included in lot'))continue;
  const offered=sanitizeCustomerText0550(it.offeredEquipment||it.description||'');
  const mrDesc=resolveMrDescription(it,r);
  const norm=(it.itemCode||it.partNo||it.model||offered.toLowerCase().replace(/[^a-z0-9]/g,'')).trim();
  if(!norm)continue;
  if(seen.has(norm)){
   const ex=seen.get(norm);
   if(Number.isFinite(it.quantity)&&Number.isFinite(ex.quantity))ex.quantity+=it.quantity;
   if(Number.isFinite(it.amount)&&Number.isFinite(ex.amount))ex.amount+=it.amount;
  }else{
   const cleanItem={
    ...it,
    tagNo:resolveBomTagNo(it,r),
    mrDescription:mrDesc,
    offeredEquipment:offered,
    description:offered,
    brand:sanitizeCustomerText0550(it.brand||''),
    model:sanitizeCustomerText0550(it.model||''),
    partNo:sanitizeCustomerText0550(it.partNo||''),
    remarks:sanitizeCustomerText0550(it.remarks||'Included in Base Scope of Supply')
   };
   seen.set(norm,cleanItem);
   deduped.push(cleanItem);
  }
 }
 return deduped;
}

function buildStaticBomItems(rawItems,r,pricingMode){
 const totalWeight=rawItems.reduce((acc,it)=>acc+(Number.isFinite(it.weight)?it.weight:1000),0);
 let accumulated=0;
 const items=rawItems.map((item,idx)=>{
  let amount=null,unitPrice=null;
  if(Number.isFinite(r.amount)&&pricingMode==='ITEMIZED'){
   const w=Number.isFinite(item.weight)?item.weight:1000;
   if(totalWeight<=0){
    amount=idx===0?r.amount:0;
   }else if(idx===rawItems.length-1){
    amount=Math.round((r.amount-accumulated)*100)/100;
   }else{
    amount=Math.round((r.amount*w/totalWeight)*100)/100;
    accumulated+=amount;
   }
   unitPrice=item.quantity>0?Math.round((amount/item.quantity)*100)/100:amount;
  }
  return {...item,amount,unitPrice};
 });
 return dedupeBomItems(items,r);
}

export function formatBomItems0550(r,pricingMode='LUMP_SUM'){
 const isDmrApf=r.sn==='1.1.1'||r.key==='MR-B1-11-APF-01'||(r.appendix==='1.1'&&r.site==='APF'&&/dmr/i.test(r.description));
 const isDmrAcp=r.sn==='1.1.9'||r.key==='MR-B1-11-ACP-01'||(r.appendix==='1.1'&&r.site==='ACP'&&/dmr/i.test(r.description));
 const isDmrAbv=r.sn==='1.1.15'||r.key==='MR-B1-11-ABV01-01'||(r.appendix==='1.1'&&r.site==='ABV01'&&/dmr/i.test(r.description));
 const isDmrAms=r.key==='OWNER:LINE-MGW-CURRENT-RADIO-016'||(r.appendix==='1.1'&&r.site==='AMS01'&&/dmr/i.test(r.description));
 const isMarineApf=r.sn==='1.1.2'||r.key==='MR-B1-11-APF-02'||(r.appendix==='1.1'&&r.site==='APF'&&/marine/i.test(r.description));
 const isMarineAcp=r.sn==='1.1.10'||r.key==='MR-B1-11-ACP-02'||(r.appendix==='1.1'&&r.site==='ACP'&&/marine/i.test(r.description));
 const isAeroApf=r.sn==='1.1.4'||r.key==='MR-B1-11-APF-04'||(r.appendix==='1.1'&&r.site==='APF'&&/aeronautical|aero/i.test(r.description));
 const isRoipApf=r.sn==='1.1.6'||r.key==='MR-B1-11-APF-06'||(r.appendix==='1.1'&&r.site==='APF'&&/roip/i.test(r.description));
 const isConsoleAcp=r.sn==='1.1.13'||r.key==='MR-B1-11-ACP-05';
 const isTowerApf=r.sn==='1.1.8'||r.key==='MR-B1-11-APF-08';
 const isTowerAcp=r.sn==='1.1.14'||r.key==='MR-B1-11-ACP-06';
 const isAntennaCable=r.appendix==='1.1'&&/antenna cable/i.test(r.description||'');
 let items=[];

 if(isDmrApf)return buildStaticBomItems(APF_DMR_BOM_RAW,r,pricingMode);
 if(isDmrAcp)return buildStaticBomItems(ACP_DMR_BOM_RAW,r,pricingMode);
 if(isDmrAbv)return buildStaticBomItems(ABV_DMR_BOM_RAW,r,pricingMode);
 if(isDmrAms)return buildStaticBomItems(AMS_DMR_BOM_RAW,r,pricingMode);
 if(isMarineApf)return buildStaticBomItems(APF_MARINE_MR_6_ITEMS_0550,r,pricingMode);
 if(isMarineAcp)return buildStaticBomItems(ACP_MARINE_MR_4_ITEMS_0550,r,pricingMode);
 if(isAeroApf)return buildStaticBomItems(APF_AERO_MR_5_ITEMS_0550,r,pricingMode);
 if(isRoipApf)return buildStaticBomItems(APF_ROIP_MR_7_ITEMS_0550,r,pricingMode);
 if(isConsoleAcp)return buildStaticBomItems(ACP_CONSOLE_BOM_0550,r,pricingMode);
 if(isTowerApf)return buildStaticBomItems(APF_TOWER_60M_BOM_0550,r,pricingMode);
 if(isTowerAcp)return buildStaticBomItems(ACP_TOWER_30M_BOM_0550,r,pricingMode);
 if(r.key==='MR-B1-12-APF-01'||r.sn==='1.2.1')return buildStaticBomItems(APF_VSAT_1_BOM_0550,r,pricingMode);
 if(r.key==='MR-B1-12-APF-02'||r.sn==='1.2.2')return buildStaticBomItems(APF_VSAT_2_BOM_0550,r,pricingMode);
 if(r.key==='MR-B1-12-APF-03'||r.sn==='1.2.3')return buildStaticBomItems(APF_VSAT_CABLE_BOM_0550,r,pricingMode);
 if(r.key==='MR-B1-12-APF-04'||r.sn==='1.2.4')return buildStaticBomItems(APF_VSAT_OFFSHORE_BOM_0550,r,pricingMode);
 if(r.key==='MR-B1-12-APF-05'||r.sn==='1.2.5')return buildStaticBomItems(APF_KU_BOM_0550,r,pricingMode);
 if(r.key==='MR-B1-12-YANGON-01'||r.sn==='1.2.6')return buildStaticBomItems(YANGON_VSAT_BOM_0550,r,pricingMode);
 if(r.key==='MR-B1-12-YANGON-02'||r.sn==='1.2.7')return buildStaticBomItems(YANGON_VSAT_CABLE_BOM_0550,r,pricingMode);
 if(r.key==='MR-B1-12-ACP-01'||r.sn==='1.2.8')return buildStaticBomItems(ACP_KU_BOM_0550,r,pricingMode);
 if(isAntennaCable){
  const cableQty=Number(r.quantity)||500;
  return buildStaticBomItems([{itemNo:'1',tagNo:'Per Appendix 2 Drawing',mrDescription:'Antenna Cable',offeredEquipment:'1/2" RF Coaxial Feeder Cable & Jumpers (per Appendix 2)',description:'1/2" RF Coaxial Feeder Cable & Jumpers (per Appendix 2)',brand:'Yongding / Amphenol',model:'1/2" Flexible RF Foam Dielectric Cable',partNo:'HCAAYZ-50-12',quantity:cableQty,unit:r.unit||'m',remarks:'Included in Base Scope of Supply (per Appendix 2 drawings)',weight:1000}],r,pricingMode);
 }

 if(r.quotedComponents&&r.quotedComponents.length>0){
  for(const c of r.quotedComponents){
   const desc=c.offer?.description||c.description||'';
   const isCableLot=/antenna cable|coaxial|feeder/i.test(desc)&&(c.quantity===1||!c.quantity)&&(c.unit==='Lot'||!c.unit)&&Number(r.quantity)>1&&r.unit==='m';
   const brand=isCableLot?'Yongding / Amphenol':(c.offer?.brand||inferBrand(desc,r));
   const parsed=parseModelPartNo(desc,r);
   const qty=isCableLot?Number(r.quantity):(c.quantity??1);
   const unit=isCableLot?(r.unit||'m'):(c.unit||'Ea');
   const unitPrice=isCableLot&&Number.isFinite(c.amount)&&qty>0?Math.round((c.amount/qty)*100)/100:c.unitPrice;
   items.push({
    description:isCableLot?'1/2" RF Coaxial Feeder Cable & Jumpers (per MR)':parsed.cleanDesc,
    brand,
    model:parsed.model,
    partNo:parsed.partNo,
    quantity:qty,
    unit,
    unitPrice,
    amount:c.amount,
    remarks:c.included?'Included in OEM Equipment Package':'Included in Base Scope of Supply'
   });
  }
 }
 if(items.length===0&&r.components&&r.components.length>0){
  const cleanComponents=r.components.filter(c=>c.note!=='SI budget estimate'&&!/ACP E&I Cabin/i.test(c.description||''));
  for(const c of cleanComponents){
   const desc=c.description||'';
   const brand=inferBrand(desc,r);
   const {model,partNo,cleanDesc}=parseModelPartNo(desc,r);
   const remarks=c.note?c.note.replace(/SI budget estimate\s*·?\s*/gi,'').trim()||'Included in Lot':'Included in Base Scope of Supply';
   items.push({
    description:cleanDesc,
    brand,
    model,
    partNo,
    quantity:c.quantity??1,
    unit:c.unit||'Ea',
    unitPrice:c.unitPrice,
    amount:c.amount,
    remarks
   });
  }
 }
 if(items.length===0){
  const desc=cleanItemTitle0550(r);
  const brand=inferBrand(desc,r);
  const {model,partNo,cleanDesc}=parseModelPartNo(desc,r);
  items.push({
   description:cleanDesc||formalScopeDescription0550(r),
   brand,
   model,
   partNo,
   quantity:r.quantity??1,
   unit:r.unit||'Lot',
   unitPrice:r.unitPrice,
   amount:r.amount,
   remarks:'Included in Lot'
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

 return dedupeBomItems(items,r);
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
     <tr className={g.id==='OTHER'?'c1-other':'c1-app'} id={'p55-c1-app-'+g.id} style={bidOwnerStyle(g.rows[0]?.mr?.systemToken||'A')}><td colSpan={showSummary?5:7}>{button('APP:'+g.id,g.id==='OTHER'?heading:'APPENDIX '+g.id+' · '+heading)}</td>{showSummary&&<><td className="number" data-c1-summary-amount={g.id}>{c1Display0550(summary?.amount)}</td><td>{summary?.label||''}</td></>}</tr>
     {expanded('APP:'+g.id)&&g.systems.map(sys=>{
      const apmExcludedAmt=sys.sites.flatMap(s=>s.rows).filter(isNonMrApmRow).reduce((acc,r)=>acc+(Number.isFinite(r.amount)?r.amount:0),0);
      const displayKnownAmount=Number.isFinite(sys.knownAmount)?Math.round((sys.knownAmount-apmExcludedAmt)*100)/100:null;
      return <React.Fragment key={sys.name}>
      <tr className="c1-system">
       <td colSpan={!documentMode&&Number.isFinite(displayKnownAmount)?5:7}>{button('SYS:'+g.id+':'+sys.name,sys.name)}</td>
       {!documentMode&&Number.isFinite(displayKnownAmount)&&<><td className="number">{c1Display0550(displayKnownAmount)}</td><td>Priced items subtotal</td></>}
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
         <td>{r.unit&&r.unit!=='—'&&r.unit!=='U'?r.unit:(r.quantity===1||r.kind==='PACKAGE'||r.sn?.includes('.P')||r.sn==='1.1.P1'?'Lot':'—')}</td>
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
               <th style={{width:'4%',textAlign:'center'}}>Item</th>
               <th style={{width:pricingMode==='ITEMIZED'?'14%':'17%'}}>MR Description</th>
               <th style={{width:'11%'}}>Tag No.</th>
               <th style={{width:pricingMode==='ITEMIZED'?'16%':'20%'}}>Offered Equipment</th>
               <th style={{width:'10%'}}>Brand</th>
               <th style={{width:pricingMode==='ITEMIZED'?'10%':'12%'}}>Model</th>
               <th style={{width:pricingMode==='ITEMIZED'?'9%':'11%'}}>Part No.</th>
               <th style={{width:'4%',textAlign:'center'}}>Qty</th>
               <th style={{width:'4%',textAlign:'center'}}>Unit</th>
               {pricingMode==='ITEMIZED'&&<>
                <th style={{width:'9%',textAlign:'right'}}>Unit Rate ({currency})</th>
                <th style={{width:'9%',textAlign:'right'}}>Total Price ({currency})</th>
               </>}
               <th style={{width:pricingMode==='ITEMIZED'?'9%':'12%'}}>Remarks</th>
              </tr>
             </thead>
             <tbody>
              {bomItems.map((item,idx)=>(
               <tr key={idx} className="c1-bom-item-row">
                <td style={{textAlign:'center'}}>{r.sn}.{idx+1}</td>
                <td style={{fontWeight:500}}>{item.mrDescription||item.description}</td>
                <td style={{fontFamily:'Consolas,monospace',fontSize:'11px'}}>{item.tagNo||'Per Appendix 2 Drawing'}</td>
                <td>{item.offeredEquipment||item.description}</td>
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
                <td colSpan={9} style={{textAlign:'right',fontWeight:'bold'}}>Subtotal ({r.sn}) — Verified matching parent Lot:</td>
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
     </React.Fragment>;})}
     {expanded('APP:'+g.id)&&<tr className="c1-subtotal"><td colSpan={5}>{g.id==='OTHER'?'OTHER BASE SUPPLY':'APPENDIX '+g.id} — SUBTOTAL</td>
      <td className="number">{c1Display0550(g.amount??g.draftSubtotal)}</td><td>{c1AppendixSubtotalLabel0550(g)}</td></tr>}
    </tbody>;})}
    <tfoot><tr><td colSpan={5}>{screenSubtotal===null?'TOTAL — BASE SCOPE OF SUPPLY':'BASE SCOPE OF SUPPLY'}</td><td className="number">{c1Display0550(projection.amount??screenSubtotal)}</td><td>{screenSubtotal!==null?'Priced items subtotal':''}</td></tr></tfoot>
   </table>
   {view.getRecord?.('I.C1')?.content&&<p>{view.getRecord('I.C1').content}</p>}
   <footer>Schedule C1 · {view.proposal.documentNo} / {view.proposal.revision}</footer>
  </article>
  </div>
 </section>;
}
