// Structured per-set breakdown of an MGW radio lot. The parent offer keeps the
// only price. Remark lines stay notes. Page-spill text is merged by the caller
// before parse, using radioLotSourceText0550.
export const RADIO_GTPL_SEPARATOR_0550='\nLocation: APM\nVHF DMR Radio System GTPL\n';
export const RADIO_GTPL_INSTALLATION_SITE_0550='APF';
export const RADIO_ACCESSORIES_SEPARATOR_0550='\nVHF DMR Radio System Accessaries MOTOROLA\n';

export const VHF_DMR_REVIEW_FLAGS_0550 = [
  { id: 'REVIEW_FLAG_DMR_COMBINER', scope: 'APF (1.1.1)', tagNo: 'APF-CAB-0004', summary: 'Verify Tx Combiner & Rx Multicoupler inclusion inside APF-CAB-0004 (3 Repeaters sharing 1 Tx + 1 Rx Dipole antenna).' },
  { id: 'REVIEW_FLAG_DMR_HANDHELD_EX', scope: 'APF (1.1.1.11)', summary: 'Verify ATEX / IECEx / UL (TIA-4950) Ex-certification on all 98 Ea. VHF DMR Handheld Radios.' },
  { id: 'REVIEW_FLAG_DMR_CAPACITY_MAX', scope: 'APF / ACP / ABV01', summary: 'Verify Motorola Capacity Max system & subscriber licenses (3 Repeaters + 128 Radios).' },
  { id: 'REVIEW_FLAG_DMR_FEEDER_LINK_BUDGET', scope: '1.1.5 / 1.1.7 / 1.1.16', summary: 'Verify RF Link Budget attenuation on 1/2" feeder cable (150 m / 60 m tower) for potential Phase-2 7/8" upgrade clarification.' },
  { id: 'REVIEW_FLAG_AERO_FREQUENCY', scope: 'APF (1.1.4)', summary: 'Verify 118–137 MHz airband operating frequencies and channel plan against Heliport operational requirements.' },
  { id: 'REVIEW_FLAG_AERO_HANDHELD_EX', scope: 'APF (1.1.4.4)', summary: 'Verify ATEX / IECEx / UL hazardous-area certificates and full airband channel capability for all 4 Ea. VHF-AM Aeronautical Handheld Radios.' },
  { id: 'REVIEW_FLAG_AERO_DCA_APPROVAL', scope: 'APF (1.1.4)', summary: 'Verify Myanmar Department of Civil Aviation (DCA) Heliport aeronautical station licensing and approval.' },
];

export const APF_DMR_MR_12_ITEMS_0550 = [
  { itemNo: '1', tagNo: 'APF-CAB-0004', mrDescription: 'Radio System Cabinet', offeredEquipment: '42U 19" Floor-Mounted Telecom Equipment Cabinet', description: 'Radio System Cabinet', brand: 'TUTENG', model: 'G26642', partNo: 'G26642', quantity: 1, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 24000 },
  { itemNo: '2', tagNo: 'APF-VHF-ANT-0001', mrDescription: 'VHF Dipole DMR Antenna Tx', offeredEquipment: 'VHF 4-Stack Dipole Array Antenna (Tx)', description: 'VHF Dipole DMR Antenna Tx', brand: 'Amphenol Procom', model: '4-Stack Dipole Array', partNo: 'WL-150-4S', quantity: 1, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 5000 },
  { itemNo: '3', tagNo: 'APF-VHF-ANT-0002', mrDescription: 'VHF Dipole DMR Antenna Rx', offeredEquipment: 'VHF 4-Stack Dipole Array Antenna (Rx)', description: 'VHF Dipole DMR Antenna Rx', brand: 'Amphenol Procom', model: '4-Stack Dipole Array', partNo: 'WL-150-4S', quantity: 1, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 5000 },
  { itemNo: '4', tagNo: 'APF-VHF-ANT-0003 / 0004', mrDescription: 'VHF Omni DMR Antenna', offeredEquipment: 'VHF Omnidirectional Collinear Antenna', description: 'VHF Omni DMR Antenna', brand: 'Amphenol Procom', model: 'TQJ-150I', partNo: 'TQJ-150I', quantity: 2, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 4500 },
  { itemNo: '5', tagNo: 'APF-VHF-0001 to 0003', mrDescription: 'VHF DMR Repeater', offeredEquipment: 'VHF DMR Tier III Base Station / Repeater', description: 'VHF DMR Repeater', brand: 'Motorola', model: 'MOTOTRBO SLR5500', partNo: 'SLR5500', quantity: 3, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 48000 },
  { itemNo: '6', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VHF CCMS server', offeredEquipment: 'DMR Central Control & Management Server (CCMS)', description: 'VHF CCMS server', brand: 'Dell', model: 'PowerEdge R740', partNo: 'PowerEdge R740', quantity: 1, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 32000 },
  { itemNo: '7', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VHF RM server', offeredEquipment: 'DMR Radio Management (RM) Server', description: 'VHF RM server', brand: 'Dell', model: 'PowerEdge R740', partNo: 'PowerEdge R740', quantity: 1, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 32000 },
  { itemNo: '8', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VHF DMR Fixed Radio', offeredEquipment: 'VHF DMR Fixed / Base Mobile Transceiver', description: 'VHF DMR Fixed Radio', brand: 'Motorola', model: 'MOTOTRBO M8668i', partNo: 'M8668i', quantity: 6, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 25000 },
  { itemNo: '9', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VHF DMR Mobile Radio', offeredEquipment: 'VHF DMR Mobile Radio Transceiver (with Suction Cup Antenna)', description: 'VHF DMR Mobile Radio', brand: 'Motorola', model: 'MOTOTRBO M8668i', partNo: 'M8668i', quantity: 21, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 68000 },
  { itemNo: '10', tagNo: 'CON-308-001 / 002', mrDescription: 'VHF Dispatch Panel', offeredEquipment: 'VHF DMR RoIP Dispatch Workstation & Software Console', description: 'VHF Dispatch Panel', brand: 'Motorola / SmartPTT', model: 'SmartPTT PLUS Dispatch Panel', partNo: 'CON-308-001', quantity: 1, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 18000 },
  { itemNo: '11', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VHF DMR Handheld Radio (ATEX or 13:19UL)', offeredEquipment: 'VHF DMR ATEX Intrinsically Safe Handheld Radio', description: 'VHF DMR Handheld Radio (ATEX or 13:19UL)', brand: 'Motorola', model: 'MOTOTRBO XiR P8668Ex', partNo: 'XiR-P8668Ex', quantity: 98, unit: 'Ea.', remarks: 'ATEX Zone 1 Certified (covering APF, AMS01, ABV01, ACP, and MOGE)', weight: 245000 },
  { itemNo: '12', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Etc. / Bulk Materials & Accessories', offeredEquipment: 'RF Surge Arresters, Six-Port Charger, Remote Speaker Mic & Bulk Accessories', description: 'Etc. / Bulk Materials & Accessories', brand: 'Amphenol / PolyPhaser', model: 'Bulk Materials & Accessories per Appendix 2', partNo: 'ACC-DMR-BULK', quantity: 1, unit: 'Lot', remarks: 'Included in Base Scope of Supply (per Appendix 2 drawings)', weight: 10000 },
];

export const APF_MARINE_MR_6_ITEMS_0550 = [
  { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Radio System Cabinet', offeredEquipment: 'Rittal 42U 19" Floor-Mounted Radio System Cabinet', description: 'Rittal 42U 19" Floor-Mounted Radio System Cabinet', brand: 'Rittal', model: 'VX IT 42U 800x1000x2200', partNo: 'VX25 / VX IT', quantity: 1, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 6000 },
  { itemNo: '2', tagNo: 'RAD-310-351, RAD-310-352', mrDescription: 'VHF-FM Marine Fixed Radio', offeredEquipment: 'VHF-FM Marine Fixed Transceiver Unit c/w Hand Mic & Flush Mount Kit', description: 'VHF-FM Marine Fixed Transceiver Unit c/w Hand Mic & Flush Mount Kit', brand: 'SAILOR', model: 'SAILOR 6210 VHF', partNo: '6210-VHF', quantity: 4, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 28000 },
  { itemNo: '3', tagNo: 'RAD-310-353, RAD-310-354', mrDescription: 'VHF-FM Marine IP Gateway', offeredEquipment: 'VHF-FM Marine RoIP IP Gateway', description: 'VHF-FM Marine RoIP IP Gateway', brand: 'SAILOR / Cobham', model: 'RGW-7700', partNo: 'RGW-7700', quantity: 2, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 12000 },
  { itemNo: '4', tagNo: 'ANT-310-201, ANT-310-202', mrDescription: 'VHF-FM Marine Antenna', offeredEquipment: 'VHF-FM Marine Omnidirectional Antenna', description: 'VHF-FM Marine Omnidirectional Antenna', brand: 'SAILOR / Amphenol', model: 'VHF74', partNo: 'VHF74', quantity: 4, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 8000 },
  { itemNo: '5', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VHF-FM Marine Handheld Radio (For APF and ACP, II2G Ex ib IIA T3 Gb as minimum)', offeredEquipment: 'VHF-FM Marine Intrinsically Safe Handheld Radio c/w Charger & Adaptor', description: 'VHF-FM Marine Intrinsically Safe Handheld Radio c/w Charger & Adaptor', brand: 'SAILOR', model: 'SAILOR SP3530 ATEX', partNo: 'SP3530', quantity: 10, unit: 'Ea.', remarks: 'Intrinsically Safe II 2G Ex ib IIC T4 (exceeds II2G Ex ib IIA T3 Gb)', weight: 38000 },
  { itemNo: '6', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Bulk Materials & Installation Accessories (per Appendix 2 Drawings)', offeredEquipment: '230VAC/24VDC Power Supply Units (XDR-240), RF Connectors & Mounting Hardware', description: '230VAC/24VDC Power Supply Units (XDR-240), RF Connectors & Mounting Hardware', brand: 'Mean Well / Amphenol', model: 'XDR-240-24 / Marine Accessory Kit', partNo: 'XDR-240-24', quantity: 1, unit: 'Lot', remarks: 'Included in Base Scope of Supply (per Appendix 2 drawings)', weight: 4000 },
];

export const ACP_MARINE_MR_4_ITEMS_0550 = [
  { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VHF-FM Marine Radio Fixed', offeredEquipment: 'VHF-FM Marine Fixed Transceiver Unit c/w Hand Mic & Flush Mount Kit', description: 'VHF-FM Marine Fixed Transceiver Unit c/w Hand Mic & Flush Mount Kit', brand: 'SAILOR', model: 'SAILOR 6210 VHF', partNo: '6210-VHF', quantity: 2, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 16000 },
  { itemNo: '2', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VHF-FM Marine Antenna', offeredEquipment: 'VHF-FM Marine Omnidirectional Antenna', description: 'VHF-FM Marine Omnidirectional Antenna', brand: 'SAILOR / Amphenol', model: 'VHF74', partNo: 'VHF74', quantity: 2, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 5000 },
  { itemNo: '3', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VHF-FM Marine IP Gateway', offeredEquipment: 'VHF-FM Marine RoIP IP Gateway', description: 'VHF-FM Marine RoIP IP Gateway', brand: 'SAILOR / Cobham', model: 'RGW-7700', partNo: 'RGW-7700', quantity: 2, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 7000 },
  { itemNo: '4', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Bulk Materials & Installation Accessories (per Appendix 2 Drawings)', offeredEquipment: '230VAC/24VDC Power Supply Units (XDR-240), RF Connectors & Mounting Hardware', description: '230VAC/24VDC Power Supply Units (XDR-240), RF Connectors & Mounting Hardware', brand: 'Mean Well / Amphenol', model: 'XDR-240-24 / Marine Accessory Kit', partNo: 'XDR-240-24', quantity: 1, unit: 'Lot', remarks: 'Included in Base Scope of Supply (per Appendix 2 drawings)', weight: 2000 },
];

export const APF_AERO_MR_5_ITEMS_0550 = [
  { itemNo: '1', tagNo: 'RAD-311-351', mrDescription: 'VHF-AM Aeronautical Fixed Radio', offeredEquipment: 'Jotron TR-910 Fixed AM VHF Radio Transceiver (118–137 MHz) c/w Hand Mic & Flush Mount Kit', description: 'Jotron TR-910 Fixed AM VHF Radio Transceiver (118–137 MHz) c/w Hand Mic & Flush Mount Kit', brand: 'Jotron', model: 'TR-910', partNo: 'TR-910', quantity: 3, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 38040 },
  { itemNo: '2', tagNo: 'RAD-311-352', mrDescription: 'VHF Aeronautical IP Gateway', offeredEquipment: 'VHF-AM Aeronautical RoIP / Dispatch IP Gateway', description: 'VHF-AM Aeronautical RoIP / Dispatch IP Gateway', brand: 'Jotron / Cobham', model: 'Jotron RoIP Gateway', partNo: 'RAD-311-352', quantity: 1, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 3500 },
  { itemNo: '3', tagNo: 'ANT-311-201', mrDescription: 'VHF-AM Aeronautical Antenna', offeredEquipment: 'VHF-AM Aeronautical Omnidirectional Whip / Ground-to-Air Antenna c/w Lightning Arrester', description: 'VHF-AM Aeronautical Omnidirectional Whip / Ground-to-Air Antenna c/w Lightning Arrester', brand: 'Jotron / Amphenol', model: 'TR-910 Antenna System', partNo: 'ANT-311-201', quantity: 3, unit: 'Ea.', remarks: 'Included in Base Scope of Supply', weight: 4000 },
  { itemNo: '4', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VHF-AM Aeronautical Handheld Radio (ATEX or UL)', offeredEquipment: 'Portable VHF Airband Handheld Radio c/w Emergency & Test Batteries, Charger (ATEX / UL Compliant)', description: 'Portable VHF Airband Handheld Radio c/w Emergency & Test Batteries, Charger (ATEX / UL Compliant)', brand: 'Jotron', model: 'TRON TR30 AIR (Compliant)', partNo: 'TRON-TR30-AIR', quantity: 4, unit: 'Ea.', remarks: 'ATEX or UL Compliant Airband Portable', weight: 18000 },
  { itemNo: '5', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Bulk Materials & Installation Accessories (per Appendix 2 Drawings)', offeredEquipment: '230VAC/13.8VDC Power Supply Units, SIL3 ESD Safety Relay & RF Installation Accessories', description: '230VAC/13.8VDC Power Supply Units, SIL3 ESD Safety Relay & RF Installation Accessories', brand: 'Jotron / Mean Well', model: 'TR-910 PSU & ESD Kit', partNo: 'ACC-AERO-APF', quantity: 1, unit: 'Lot', remarks: 'Included in Base Scope of Supply (per Appendix 2 drawings)', weight: 2000 },
];

export function radioGtplLocationDisplay0550(text){
 return text.replace(RADIO_GTPL_SEPARATOR_0550,'\nLocation: '+RADIO_GTPL_INSTALLATION_SITE_0550+'\nVHF DMR Radio System GTPL\n');
}

const qtyLine=/^~?\s*(\d+(?:\.\d+)?)\s*x\s+(.+)$/i;
const bulletLine=/^-\s+(.+)$/;
const dotLine=/^[·•]\s*(.+)$/;
const sectionLine=/^(License|Comprising|Description)\s*:\s*(.*)$/i;
const remarkLine=/^Remark\s*:\s*(.*)$/i;
const unitToken=/^(?:\d+(?:\.\d+)?(?:m|mm|kg|g|w|kw|vac|vdc|v|hz|khz|mhz|ghz)|230vac|24vdc|13\.8v|1\.95kg)$/i;
const skipParen=/^(atex|sealed|m|main|flush|optional|include|including)$/i;

export function radioLotSourceText0550(detail,{continuation,option=false,stripUnpriced=false}={}){
 let text=detail||'';
 if(stripUnpriced)text=text.split(RADIO_GTPL_SEPARATOR_0550)[0];
 if(continuation?.anchor&&text.includes(continuation.anchor))text=text.replace(continuation.anchor,continuation.text);
 if(!text.includes(RADIO_ACCESSORIES_SEPARATOR_0550))return option?'':text;
 const [base,accessories]=text.split(RADIO_ACCESSORIES_SEPARATOR_0550);
 return option?accessories||'':base;
}

const clean=line=>String(line||'').replace(/\u00a0/g,' ').replace(/[\u2010\u2011\u2012\u2013\u2014]/g,'-').replace(/\uFF0C/g,',').replace(/\uFF1A/g,':').replace(/[ \t]+/g,' ').trim();

function component(fields){
 return {
  quantity:fields.quantity??null,
  unit:fields.unit??'',
  description:fields.description||'',
  partNo:fields.partNo||'',
  group:fields.group||'',
  included:fields.included!==false,
  remarks:fields.remarks||'',
  sourceLine:fields.sourceLine||'',
 };
}

function isModelToken(token){
 return /[0-9]/.test(token)&&/[A-Za-z]/.test(token)&&/^[A-Za-z0-9][A-Za-z0-9./+-]*$/.test(token)&&!unitToken.test(token)&&token.length>=2;
}
function isSuffixToken(token){
 return /^(?:F\d+|Gen\d+)$/.test(token);
}

// The model or part number is the trailing code. A short suffix (F3, Gen10)
// stays with the code before it. Leading SAILOR / Sailor codes are used when
// the line does not end in a part number.
export function radioPartNo0550(description){
 let text=clean(description).replace(/\s*[/／]\s*$/,'').replace(/[，,：:]\s*$/,'').trim();
 const original=text;
 const paren=text.match(/^(.*)\(([^)]+)\)\s*$/);
 if(paren&&!skipParen.test(paren[2].trim())&&/[A-Z0-9]/i.test(paren[2])&&paren[2].trim().length<=40&&paren[1].trim()){
  return {description:paren[1].trim(),partNo:paren[2].trim()};
 }
 if(/OptiPlex Tower/i.test(text)){
  return {description:text.replace(/\s*OptiPlex Tower\s*$/i,'').trim(),partNo:'OptiPlex Tower'};
 }
 const tokens=text.split(' ').filter(Boolean);
 let end=tokens.length-1;
 const part=[];
 if(end>=0&&(isSuffixToken(tokens[end])||isModelToken(tokens[end]))){
  part.unshift(tokens[end]);
  end--;
  if(end>=0&&(isModelToken(tokens[end])||(/^(?:MSR|DL20|SAILOR|Sailor)$/.test(tokens[end])&&part.length))){
   part.unshift(tokens[end]);
   end--;
  }
 }else if(end>=1&&/^\d{3,5}$/.test(tokens[end])&&/^(?:SAILOR|Sailor)$/.test(tokens[end-1])){
  part.unshift(tokens[end-1],tokens[end]);
  end-=2;
 }
 let partNo=part.join(' ');
 let name=tokens.slice(0,end+1).join(' ').replace(/[，,]\s*$/,'').trim();
 if(!partNo){
  const lead=original.match(/^(SAILOR|Sailor)\s+((?:SP)?\d{3,5}[A-Z0-9]*)\b/);
  if(lead)partNo=lead[1]+' '+lead[2];
  name=original;
 }
 if(!name)return {description:original,partNo:''};
 return {description:name,partNo};
}

function isGroupHeader(line){
 return sectionLine.test(line)||remarkLine.test(line)||/^DELL PC Workstation$/i.test(line);
}

export function parseRadioLotComponents0550(detail,{defaultGroup='',defaultIncluded=true}={}){
 const components=[];
 let group=defaultGroup;
 let remarkMode=null;
 let spec=[];
 let specMode=false;
 let includeParent=null;
 const flushSpec=()=>{
  const text=spec.map(clean).filter(Boolean).join('\n').trim();
  spec=[];
  specMode=false;
  if(!text)return;
  components.push(component({
   description:'Specification',partNo:'',group:'Description',included:false,remarks:text,sourceLine:text,
  }));
 };
 const appendRemark=text=>{
  const last=components[components.length-1];
  if(!last){spec.push(text);return;}
  last.remarks=[last.remarks,text].filter(Boolean).join(' ').replace(/\s+/g,' ').trim();
 };
 const pushQty=(quantity,body,sourceLine,included)=>{
  const named=radioPartNo0550(body);
  const row=component({
   quantity,unit:'x',description:named.description,partNo:named.partNo,group,included,
   sourceLine,remarks:'',
  });
  components.push(row);
  includeParent=row;
 };
 const lines=String(detail||'').split(/\r?\n/);
 for(const raw of lines){
  const line=clean(raw);
  if(!line)continue;
  const remark=line.match(remarkLine);
  if(remark){
   flushSpec();
   if(remark[1].trim()){
    appendRemark(remark[1].trim());
    remarkMode='note';
    // The note closes the section it follows. Later equipment returns to the lot.
    group='';
   }else{remarkMode='excluded';group='Remark';}
   continue;
  }
  const section=line.match(sectionLine);
  if(section){
   flushSpec();
   remarkMode=null;
   const name=section[1].toLowerCase();
   if(name==='description'){specMode=true;group='Description';if(section[2].trim())spec.push(section[2].trim());}
   else group=name==='license'?'License':name==='comprising'?'Comprising':section[1];
   continue;
  }
  if(/^DELL PC Workstation$/i.test(line)){flushSpec();remarkMode=null;group='DELL PC Workstation';continue;}
  // A repeated model label between included lines is not its own priced row.
  if(/^(?:SAILOR|Sailor)\s+[A-Z0-9-]{2,16}$/.test(line)){
   if(includeParent)includeParent.remarks=[includeParent.remarks,line].filter(Boolean).join(' ').trim();
   continue;
  }
  const counted=line.match(qtyLine);
  if(counted){
   flushSpec();
   const excluded=remarkMode==='excluded'||defaultIncluded===false;
   if(remarkMode==='note')remarkMode=null;
   pushQty(Number(counted[1]),counted[2],line,!excluded);
   continue;
  }
  const bullet=line.match(bulletLine);
  if(bullet){
   flushSpec();
   const named=radioPartNo0550(bullet[1]);
   const included=remarkMode==='excluded'||defaultIncluded===false?false:true;
   components.push(component({
    quantity:null,unit:'',description:named.description,partNo:named.partNo,
    group:includeParent?.description||group,included,sourceLine:line,
   }));
   continue;
  }
  if(specMode||dotLine.test(line)||(!components.length&&!isGroupHeader(line))){
   specMode=true;
   spec.push(line.replace(/^[·•]\s*/,''));
   continue;
  }
  if(/^Location\s*:/i.test(line)||/^Etc\.?$/i.test(line)||/^[a-z(]/.test(line)){
   appendRemark(line);
   continue;
  }
  appendRemark(line);
 }
 flushSpec();
 return components;
}

// Display rows for a priced radio lot. Quantity may scale by the lot count.
// Amounts stay null so a schedule cannot add them to the lot price.
export function offerWithoutRadioComponents0550(offer){
 if(!offer||!Object.hasOwn(offer,'components'))return offer||null;
 const {components,...price}=offer;
 return price;
}
export function radioLotIncludedLines0550(offer,lotQuantity){
 if(!offer?.components?.length)return [];
 const sets=Number.isFinite(lotQuantity)&&lotQuantity>0?lotQuantity:1;
 return offer.components.map(component=>{
  const remark=component.included===false;
  const perSet=Number.isFinite(component.quantity)?component.quantity:null;
  return {
   description:[component.description,component.partNo].filter(Boolean).join(' · '),
   partNo:component.partNo||'',
   quantity:!remark&&perSet!=null?perSet*sets:perSet,
   unit:component.unit||'',
   unitPrice:null,
   amount:null,
   exportPrice:false,
   nonAdditive:true,
   included:component.included!==false,
   note:[remark?'Remark':'Included in lot',component.group,component.remarks].filter(Boolean).join(' · '),
  };
 });
}
