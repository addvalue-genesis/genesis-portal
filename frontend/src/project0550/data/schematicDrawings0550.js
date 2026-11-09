import {supplierItemSourceText0550} from './supplierCostProjection0550';

const document = (site, family, number, revision, title, place) => ({
 documentNo: `MM-ASK-1A-${site}-TEL-${family}-${number}`, site, revision, title, place,
});
const block = (number, revision, title) => document('APF','BLD',number,revision,title);
const layout = (site, number, place, revision='C1', title=place) => document(site,'LAY',number,revision,title,place);

// Transcribed from the drawing title blocks. Only the runtime CUS record
// provides the source link. Comment-sheet titles can refer to earlier issues.
const overall = block('0001','C6','Telecom Overall');
const network = block('0002','C5','Network, IP Telephony and CCTV');
const paga = block('0004','C4','PAGA');
const ndb = block('0005','C1','Non-Directional Beacon');
const vsat = block('0006','C1','VSAT');
const radio = block('0007','C3','Radio');
const microwave = block('0011','C3','Microwave');
const entertainment = block('0012','C1','Entertainment');
const apfControl = layout('APF','0001','Control Building');
const lanAccessReferences = [
 document('APF','DTS','0001','B1','Network Datasheet · Access Switch port density'),
 document('APF','SPE','0002','B1','Network Specification · §7.3.2 Access Switch'),
];
const layouts = [
 apfControl, layout('APF','0002','Catering Building'), layout('APF','0003','Work House & Work Shop'),
 layout('APF','0004','Guard House'), layout('APF','0005','Accommodation Building'),
 layout('APF','0007','Office Building'), layout('APF','0008','Store'),
 layout('APF','0009','Sub-station','C4'), layout('APF','0010',null,'C4','APF Overall Area'),
 layout('APF','0016','Security Building'), layout('APF','0017','Fire/Safety Building'),
 layout('ACP','0001','Office/Guard House Building','C2','ACP Office Building'),
 layout('ACP','0002','Guard House Building'), layout('ACP','0003',null,'C1','ACP Overall Area'),
 layout('ACP','0004','E&I Cabin'),
];

const control = 'Control Building';
const controlRoom = 'Instrument & Telecom Room';
const tags = {
 lan:'APF-LAN-307-351', cctv:'APF-CCTV-317', sat:'APF-SAT-301', dmr:'APF-MR-320',
 radio:'APF-RAD-309', paga:'APF-PAGA-303-351', met:'APF-MET-315', odf:'APF-ODF-300',
};
const cabinet = (tag, name, systems, item, contentsDrawing, components) => ({
 tag, name, systems, site:'APF', place:control, room:controlRoom,
 dimensions:[800,800,2100], mount:'Floor', layout:apfControl, item, contentsDrawing, components,
});
const cctvItems = [
 {label:'Access Switch', tag:'SW-317-351', ports:48, offer:/\b(?:access|poe\+?) switch\b/i},
 {label:'UTP Patch Panel', offer:/\b(?:utp|cat6a) patch(?:\/manage)? panel\b/i},
 {label:'NVR Server', offer:/\bnvr\b/i},
 {label:'Media Converters', offer:/\bmedia converters?\b/i},
];
const cabinets = [
 cabinet(tags.lan,'LAN Cabinet',['TEL-LAN','TEL-LAN-VCS','TEL-PABX','TEL-IPP','TEL-FO'],26,[network,2],[
  {label:'Core Switches',tag:'SW-307-351 / SW-307-352',offer:/\bcore switch/i},
  {label:'Distribution Switches',tag:'SW-307-353 / SW-307-354',offer:/\bdistribution switch/i},
  {label:'Access Switch',tag:'SW-307-355',ports:48,offer:/\baccess switch/i},
  {label:'Firewalls, UTP Patch Panels, IP Telephony, Wireless Controller'},
 ]),
 cabinet(tags.cctv,'CCTV Cabinet',['TEL-CCTV'],27,[network,2],cctvItems),
 cabinet(tags.sat,'VSAT System',['TEL-VSAT','TEL-VSAT-KU'],28,[vsat,2],[
  {label:'Splitter/Combiner, VSAT Modems and L3 Switches'},
  {label:'Ku-Band Satellite Modem',offer:/\bsatellite modem\b/i},
 ]),
 cabinet(tags.dmr,'Microwave System Cabinet',['TEL-DMR'],29,[microwave,2],[
  {label:'Microwave IDU',tag:'MR-320-351',offer:/\b(?:idu|indoor unit)\b/i},
  {label:'UTP Patch Panel'},
 ]),
 cabinet(tags.radio,'Radio Cabinet',['TEL-RADIO-MARINE','TEL-RADIO-AERO','TEL-RADIO-SSB','TEL-RADIO-DTRS'],30,[radio,2],[
  {label:'Access Switch',tag:'SW-309-351',offer:/\baccess switch\b/i},
  {label:'VHF-FM Marine Radios and IP Gateways',tag:'RAD-310-351 to RAD-310-354'},
  {label:'VHF-AM Aeronautical Radio and IP Gateway',tag:'RAD-311-351 / RAD-311-352'},
  {label:'MF/HF SSB Radio',tag:'RAD-309-351'},
 ]),
 cabinet(tags.paga,'PAGA System Cabinet',['TEL-PAGA'],31,[paga,2],[
  {label:'PAGA Control Unit'}, {label:'PAGA Amplifiers, including Hot Standby'}, {label:'Amplifier Interface'},
 ]),
 cabinet(tags.met,'Meteorological Cabinet',['TEL-MET'],32,[network,2],[
  {label:'Access Switch',tag:'SW-315-351'}, {label:'UTP Patch Panel'}, {label:'Meteorological Equipment'},
 ]),
 cabinet(tags.odf,'Fiber Optical Distribution Frame Cabinet',['TEL-FO','TEL-LAN','TEL-IPP'],37,[network,2],[
  {label:'FOC Patch Panels',offer:/\b(?:fo|foc|fiber optic) patch(?:\/manage)? panel\b/i},
 ]),
];

// Each line is an observed path, with parallel equipment grouped for legibility.
// Labels identify design blocks; quantities and rack U come from separate evidence.
const path = (drawing,sheet,place,nodes) => ({
 drawing,sheet,place,
 nodes:nodes.map(([label,tag,rackTag],i)=>({label,tag,rackTag,column:i,row:0})),
 edges:nodes.slice(1).map((_,i)=>[i,i+1]),
});
const cctv = {
 drawing:network,sheet:2,place:control,
 nodes:[
  {label:'Indoor PTZ Cameras',tag:'CAM-317-351 to 354',column:0,row:1},
  {label:'UTP Patch Panel',tag:'CCTV-317',rackTag:tags.cctv,column:1,row:1},
  {label:'48-port Access Switch',tag:'SW-317-351',rackTag:tags.cctv,column:1,row:0},
  {label:'NVR Server',tag:'CCTV-317',rackTag:tags.cctv,column:1,row:2},
  {label:'Media Converters',tag:'CCTV-317',rackTag:tags.cctv,column:2,row:0},
  {label:'CCTV Monitors',tag:'Control Room',column:2,row:2},
 ],
 edges:[[0,1],[1,2],[1,3],[1,4],[1,5]],
};
const profiles = {
 'TEL-LAN': path(network,2,control,[['FOC Patch Panels','ODF-300',tags.odf],['Core Switches','SW-307-351 / 352',tags.lan],['Distribution Switches','SW-307-353 / 354',tags.lan]]),
 'TEL-LAN-VCS': path(network,8,'Office Building',[['Access Switch','LAN-307-151'],['Video Conference','Office Building']]),
 'TEL-VSAT': path(vsat,2,control,[['VSAT Antenna','ANT-301-001'],['RCU / RF Chain'],['Splitter / Modems','SAT-301',tags.sat],['L3 Switches','SAT-301',tags.sat]]),
 'TEL-VSAT-KU': path(vsat,2,control,[['Ku-Band Internet Antenna','ANT-301-306'],['Ku-Band Satellite Modem','SAT-301',tags.sat],['Firewall IT','LAN-307-351']]),
 'TEL-PABX': path(network,2,control,[['IP Telephony','LAN-307-351',tags.lan],['LAN Distribution','LAN-307-351',tags.lan],['IP Phones','Control Building']]),
 'TEL-IPP': path(network,2,control,[['FOC Patch Panel','ODF-300',tags.odf],['Ex Phone Connection','Continuation to Sheet 11']]),
 'TEL-PAGA': path(paga,2,control,[['PAGA Control Unit','PAGA-303-351',tags.paga],['PAGA Amplifier','PAGA-303-351',tags.paga],['Speaker Circuit','Control Building']]),
 'TEL-CCTV': cctv,
 'TEL-RADIO-DTRS': path(radio,2,control,[['VHF-DMR Antennas','APF-VHF-ANT-0001 to 0003'],['VHF-DMR Repeaters','APF-VHF-0001 to 0003'],['VHF Switch','APF-VHF-SW-0001'],['Radio Access Switch','SW-309-351',tags.radio]]),
 'TEL-RADIO-MARINE': path(radio,2,control,[['VHF-FM Antennas','ANT-310-201 / 202'],['Marine Radios','RAD-310-351 / 352',tags.radio],['IP Gateways','RAD-310-353 / 354',tags.radio],['Radio Access Switch','SW-309-351',tags.radio]]),
 'TEL-RADIO-AERO': path(radio,2,control,[['VHF-AM Antenna','ANT-311-201'],['Aeronautical Radio','RAD-311-351',tags.radio],['IP Gateway','RAD-311-352',tags.radio],['Radio Access Switch','SW-309-351',tags.radio]]),
 'TEL-RADIO-SSB': path(radio,2,control,[['MF/HF SSB Antenna','ANT-309-201'],['MF/HF SSB Radio','RAD-309-351',tags.radio]]),
 'TEL-NDB': path(ndb,2,control,[['NDB Antenna','ANT-312-001'],['ATU','ATU-312-001'],['NDB Transmitter','TR-312-001'],['Extended Control / Monitor','CTR-312-002']]),
 'TEL-AIS': path(overall,1,control,[['Core Switches','Control Building'],['LAN Switch','CCR'],['AIS Monitoring','CCR']]),
 'TEL-DMR': path(microwave,2,control,[['Microwave Antenna','ANT-320-201'],['Microwave ODU','MR-320-201'],['IDU / UTP Patch Panel','MR-320-351',tags.dmr],['LAN Distribution','SW-307-353 / 354']]),
 'TEL-FO': path(network,2,control,[['Core Switches','LAN-307-351',tags.lan],['FOC Patch Panels','ODF-300',tags.odf],['FOC to Building LANs','Continuation on BLD']]),
 'TEL-TELT': {
  drawing:overall,sheet:1,place:null,relationship:'อุปกรณ์บนเสา · ตรวจความสูงจาก MR',
  nodes:[
   {label:'APF Telecom Tower',column:0,row:0},
   {label:'Microwave ODU and Antenna',column:1,row:0},
   {label:'Meteorological Sensor',column:1,row:1},
  ],
  edges:[[0,1],[0,2]],
 },
 'TEL-ES': path(entertainment,2,'Catering Building',[['Ku-Band Antenna / LNB','ANT-308-002'],['TV Outlet','Catering Building'],['Set Top Box'],['Smart TV']]),
 'TEL-MET': path(network,2,control,[['Meteorological Equipment','MET-315',tags.met],['UTP Patch Panel','MET-315',tags.met],['Access Switch','SW-315-351',tags.met]]),
};

const normalized = value => value.trim().toUpperCase().replace(/^REV\.?\s*/,'');
const current = source => source.effectiveAuthority==='CURRENT_TENDER';

export function schematicDrawingSource0550(sources, drawing){
 const copies=sources.filter(source=>source.documentNo.trim().toUpperCase()===drawing.documentNo);
 const exact=copies.filter(source=>normalized(source.revision)===drawing.revision&&source.effectiveAuthority!=='REPLACED_COPY');
 const active=copies.filter(current);
 const matching=exact.filter(current);
 const source=matching.length===1?matching[0]:exact.length===1?exact[0]:null;
 const warning=active.some(copy=>normalized(copy.revision)!==drawing.revision)||matching.length>1
  ? 'OPEN · ฉบับ CUS ปัจจุบันต้องเทียบกับแผ่นที่ใช้ถอดผัง'
  : source&&!current(source)?'แบบอ้างอิง · ยังไม่ได้ยืนยันเป็นฉบับ Tender ปัจจุบัน'
  : !source?'OPEN · ยังไม่มีฉบับนี้ในทะเบียน CUS':'';
 return {source,warning};
}

export function schematicDrawings0550(system,site,place){
 const reviewed=profiles[system];
 const matchesPlace=location=>!place||location===place;
 const topology=site==='APF'&&reviewed&&matchesPlace(reviewed.place)?reviewed:null;
 return {
  topology,
  blockDrawings:[...new Set([...(reviewed?[reviewed.drawing]:[]),overall])],
  specifications:system==='TEL-LAN'||system==='TEL-CCTV'?lanAccessReferences:[],
  layouts:layouts.filter(drawing=>drawing.site===site&&(!drawing.place||matchesPlace(drawing.place))),
  cabinets:cabinets.filter(rack=>rack.site===site&&matchesPlace(rack.place)&&(system==='COMMON'||rack.systems.includes(system))),
 };
}

export function rackOfferCandidates0550(rack,quoteRows){
 const seen=new Set();
 const scope=quoteRows.filter(row=>row.site===rack.site&&!row.native.option&&
  (!row.building||row.building===rack.place)&&
  (rack.systems.includes(row.system)||rack.tag===tags.cctv&&row.system==='TEL-LAN'));
 return scope.flatMap(row=>{
  const evidence=supplierItemSourceText0550(row.offer);
  const text=[row.description,...evidence].join(' ');
  const exactRack=new RegExp('(?:^|[^A-Z0-9-])'+rack.tag+'(?![A-Z0-9-])','i').test(text);
  const access=/\baccess switch\b/i.test(row.description);
  const ports=access?Number(text.match(/\b(\d+)\s*[- ]?\s*ports?\b/i)?.[1]||text.match(/\b(\d+)x\s*10\/100\/1000\b/i)?.[1])||null:null;
  const crossSystem=rack.tag===tags.cctv&&row.system==='TEL-LAN'&&ports===48;
  if(!rack.systems.includes(row.system)&&!crossSystem)return [];
  const isCabinet=/\b(?:cabinet|rack)\b/i.test(row.description);
  const component=rack.components.find(item=>item.offer?.test(row.description));
  if((!exactRack&&!isCabinet&&!component)||seen.has(row.offer.id))return [];
  seen.add(row.offer.id);
  // Read only explicitly labeled W / D / H from a cabinet line.
  const dimensions=isCabinet?text.match(/\b(\d+)\s*W\s*[×x]\s*(\d+)\s*D\s*[×x]\s*(\d+)\s*H\s*mm\b/i)?.slice(1).map(Number):null;
  const part=access?text.match(/\bC[0-9]{4}[A-Z]*-[A-Z0-9]+(?:-[A-Z0-9]+)+\b/i)?.[0]:null;
  return [{...row,exactRack,crossSystem,ports,part,requiredPorts:component?.ports,
   component:isCabinet?'Rack/Cabinet':component?.label||'TAG ตู้',
   dimensions,dimensionDelta:dimensions?.map((value,i)=>value-rack.dimensions[i])}];
 });
}
