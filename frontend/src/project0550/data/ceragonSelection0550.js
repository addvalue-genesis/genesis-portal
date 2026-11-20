import mr from './mrWorkingCatalog0550.json';

const quote = 'OFFER-CERAGON-26-30029-REVA1-E90E86E5-';
export const CERAGON_R10_0550 = quote + 'R10';
export const CERAGON_R11_0550 = quote + 'R11';
export const CERAGON_R12_0550 = quote + 'R12';
export const CERAGON_LINK_OWNER_0550 = 'LINE-CERAGON-ASK-REVA1-BASE';
export const CERAGON_DISH_ALLOWANCE_0550 = 'LINE-BID-DMR-ANTENNA-GAP-0550';
export const CERAGON_R11_DECISION_DATE_0550 = '2026-11-07';
export const CERAGON_R11_CONFIGURATION_0550 = 'CERAGON IP-50CX 7 GHz, 2+0, one Full Outdoor radio and one 1.2 m antenna per site, without Hot Standby.';
export const CERAGON_R11_WORKING_BASIS_0550 = {
  description:'Full Outdoor 2+0 · ไม่ใช้ IDU แยก · ต่อ Fiber จาก ODU เข้า Access Switch และจ่าย DC โดยตรงให้ ODU พร้อม Grounding',
  installationSheet:'2+0 Installation',
  open:'ตรวจชนิด Fiber/SFP และพอร์ต Switch, ต้นทางไฟ DC และความจำเป็นของ AC/DC 150 W ตามไซต์',
};
export const CERAGON_R11_OPEN_SCOPE_0550 = 'MR Appendix 1.5: reconcile Full Outdoor / no Hot Standby, MR antenna quantity versus BLD/TYP/LIS, APF cabinet and access switch, and both cable schedules. Verify net throughput at 99.99% availability with the 2+0 RF path losses.';
export const ceragonR11Selected0550 = data => data.lines.some(line =>
  line.id === CERAGON_LINK_OWNER_0550 && line.selected && line.offerId === CERAGON_R11_0550);
export const ceragonSupersededOffer0550 = (data, offerId) =>
  offerId === CERAGON_R10_0550 && ceragonR11Selected0550(data);
export const ceragonR11Source0550 = offer =>
  offer?.id === CERAGON_R11_0550 && offer.vendorId === 'VENDOR-CERAGON-0550' &&
  offer.currency === 'USD' && offer.unit === 'Lot' && offer.quoteEvidence?.revision === 'RevA1' &&
  offer.quoteEvidence.classification === 'OPTION' && offer.quoteEvidence.quotedQuantity === 0;

const dmrTags = {
  APF: {IDU:'APF-MR-320-202', ODU:'APF-MR-320-201', Antenna:'APF-ANT-320-201'},
  ACP: {IDU:'ACP-MR-320-002', ODU:'ACP-MR-320-001', Antenna:'ACP-ANT-320-001'},
};
const dtsDoc = 'MM-ASK-1A-APF-TEL-DTS-0010';
const r11SourceHash = 'e90e86e573545c77f354e3a12ae40d09279ea9a1b90f0cac300a8cc53ca1123f';
const equipmentRole = {IDU:'Microwave Indoor Unit', ODU:'Microwave Outdoor Unit', Antenna:'Microwave Antenna'};
const sharedDeviation = 'DEV-DMR-CERAGON-R11-BID-DRAFT';
const cusRefs = {
  APF: {
    IDU:['BLD: MR-320-351 · เลขต่างจาก DTS ต้องยืนยัน','1UOEoBJFgw_rEUIdtty-Nz8hTq0YuZoH6'],
    ODU:['BLD: MR-320-201','1UOEoBJFgw_rEUIdtty-Nz8hTq0YuZoH6'],
    Antenna:['LIS: ANT-320-201','1RV7Reqq5qCBSlBQACBW_Y3fftmIcxmQI'],
    Cable:['Cable LIS 237: MR-320-201/MR-320 · RF coaxial','1GBrVXA5UfeXTYpl1yatwmjkwZVlEIvEW'],
  },
  ACP: {
    IDU:['LIS: MR-320-002 · อยู่ในตู้ RAD-308-001','1DfrFGgupaIYrbyTPa_FT_4Z26r8mxm_G'],
    ODU:['LIS: MR-320-001','1DfrFGgupaIYrbyTPa_FT_4Z26r8mxm_G'],
    Antenna:['LIS: ANT-320-001','1DfrFGgupaIYrbyTPa_FT_4Z26r8mxm_G'],
    Cable:['Cable LIS 76: MR-320-001/RAD-308-001 · ป้าย IDU ขัดกับ Equipment LIS ที่ระบุ ODU','15BE-jtUdYexxZyz_e3Zu902yXJlWtNe5'],
  },
};

// Read-only technical cross-reference from the workbook opened on 7 Nov.
// Its bytes differ from the file registered as the Working price source.
export const CERAGON_R11_BOQ_REVIEW_0550 = {
  url:'https://docs.google.com/spreadsheets/d/1YEik9MUniq2B9oW5FZLAl8-UrphS5HD9/edit',
  sha256:'b07dbeb43423e2379d5df53fc0b980a688b7a33166526d25cbff07600ea90255',
};

function r11BoqReference(site, component) {
  const column = site === 'ACP' ? 'H' : 'I';
  const diplexer = site === 'ACP' ? ['DXCX07-161F-01W02-L',68] : ['DXCX07-161F-01W02-H',67];
  const rows = {
    IDU:[],
    ODU:[['IP-50CX-7-8w',66,1], [...diplexer,1,'Sub-band TBD'],
      ['SL-Capacity-150M',73,2],['SL-ACM',74,2],['SL-XPIC',75,2],['SL-MC-ABC',76,2],
      ['SL-Edge-CET-Node',77,1],['SL-2nd-Core-Act.',78,1],['SL-Sync-Unit',79,1]],
    Antenna:[['Am-4-7_8-CIRC-A',93,1],['IP-20C_OMT_kit_7-8G',71,1],['Ant Pol mount 4-6FT',91,1]],
    Cable:[['IP-20_FO_MM_LC2LC_ARM_80m',87,1,'MM 80 m / M28 gland'],['SFP-GE-LX-EXT-TEMP',81,2,'SM 1310 nm'],
      ['Outdoor_DC_cbl_2x14AWG_drum',84,0.5,'ต่อ drum'],['IP-20C_DC_Conn',85,1],['GRND CABLE 16MM^2',83,0.5,'ต่อ drum'],
      ['Fiber_clamp_6cbl_4.0-7.0mm',88,75],['AC/DC OUTDOOR 150W',89,1,'ขึ้นกับเงื่อนไขใน BoQ']],
  };
  return {
    column, type:component === 'IDU' ? 'DESIGN_ALTERNATIVE' : component === 'Cable' ? 'INTERFACE_OPEN' : 'PROPOSED_PARTS',
    parts:rows[component].map(([part,row,quantity,note,last])=>({part,quantity,note,
      locator:`BoQ!${column}${row}${last ? `:${column}${last}` : ''}`})),
  };
}

function dmrLineReferences(site, component, linked, knownVendor) {
  const [label,id] = cusRefs[site][component];
  return {cusReference:{label,url:`https://drive.google.com/file/d/${id}/view`},
    vendorReference:linked && knownVendor ? r11BoqReference(site,component) : null};
}

export function ceragonR11RequirementSite0550(requirement) {
  return /^REQDEF-MR-B1-15-(APF|ACP)-0[12]$/.exec(requirement.id)?.[1] || null;
}

export function ceragonR11Dts0550(data) {
  const sources = data.sourceIntake?.sources || [];
  const replaced = new Set(sources.flatMap(source => source.replaces || []));
  return sources.filter(source => source.documentNo === dtsDoc &&
    source.authority === 'CURRENT_TENDER' && !replaced.has(source.id))
    .sort((a,b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}

export function dmrDtsEquipment0550(dts, tag, role) {
  if (!dts.every(item=>item.revision==='B1')) return {source:null,location:null};
  const pattern=new RegExp(`(?:^|\\s)${tag}\\s+${role}\\b\\s*(.*)$`,'i');
  const rows=dts.filter(item=>item.readState!=='METADATA_ONLY').flatMap(item=>
    (item.content||'').split(/\r?\n/).flatMap(line=>{
      const match=line.match(pattern);
      return match?[{item,location:match[1].trim().replace(/\s+/g,' ')}]:[];
    }));
  const locations=[...new Set(rows.map(row=>row.location).filter(Boolean))];
  const item=(rows.find(row=>row.location)||rows[0])?.item;
  return {source:item?{id:item.id,locator:`${dtsDoc} Rev.B1 / Sheet 4/4`}:null,
    location:locations.length===1?locations[0]:null};
}

// DTS identifies the equipment; the MR supplies the quantity for each site.
// Do not convert a found TAG into a quantity or add another Working owner.
export function ceragonR11ScopeCheck0550(requirement, mrRow, offer, dts, deviations) {
  const site = ceragonR11RequirementSite0550(requirement);
  if (!site) return [];
  const vendorSite = ceragonR11Source0550(offer) && offer.quoteEvidence.sourceSha256 === r11SourceHash && /IP-50CX[^\n]*2\+0/i.test(offer.description)
    ? offer.description.split(new RegExp(`Site ${site}:`, 'i'))[1]?.split(/Site (APF|ACP):/i)[0] : null;
  const quoted = pattern => vendorSite?.match(pattern)?.[1] ?? null;
  const siteMatches = requirement.site === site && requirement.systemToken === 'TEL-DMR';
  const linked = siteMatches && requirement.offerIds.includes(CERAGON_R11_0550) && requirement.workLineIds.includes(CERAGON_LINK_OWNER_0550);
  const accepted = matchesScope => deviations.some(deviation =>
    !deviation.avlCheckId && deviation.state === 'ACCEPTED_DEVIATION' && deviation.offerIds.includes(CERAGON_R11_0550) &&
    (deviation.requirementId === requirement.id || deviation.id === sharedDeviation) &&
    matchesScope(deviation.approvalExcerpt?.toUpperCase() || ''));

  if (mrRow?.id.endsWith('-02')) {
    const offered = quoted(/-\s*(\d+)-meter cable/i);
    return [{site, component:'สายและ Interface', tag:null, required:mrRow.quantity, unit:mrRow.unit,
      mrComponents:mrRow.components,
      offered:offered === null ? null : Number(offered), offerUnit:'m', source:null,
      ...dmrLineReferences(site,'Cable',linked,offered !== null),
      state:linked && offered !== null && accepted(excerpt => excerpt.includes(requirement.id) ||
        new RegExp(`APPENDIX\\s+1\\.5[^\\n]*\\b${site}\\s+ITEM\\s+2\\b`).test(excerpt)) ? 'ACCEPTED_DEVIATION' : 'OPEN',
      reason:!linked ? 'ตรวจไซต์และการผูก R11 กับ Working ก่อนทบทวนสาย' :
        'เทียบชนิดสาย จุดต่อ และระยะตามแบบที่ยอมรับก่อนคิดส่วนต่าง ห้ามหักระยะจากคนละ Interface'}];
  }
  return Object.entries(dmrTags[site]).map(([component,tag]) => {
    const role = equipmentRole[component];
    const {source,location} = dmrDtsEquipment0550(dts,tag,role);
    const pattern = component === 'Antenna' ? /Microwave Anten[n]?a\s+(\d+)\s+Ea\./i : new RegExp(`${role}\\s+(\\d+)\\s+Ea\\.`, 'i');
    const required = (mrRow?.components || []).map(line => line.match(pattern)?.[1]).find(Boolean);
    const offered = component === 'Antenna' ? quoted(/-\s*(\d+)x Antenna/i)
      : quoted(/-\s*(\d+)x Full Outdoor Unit \(IP-50CX\)/i);
    // The R11 package contains a Full Outdoor radio per site; it has no separate IDU row.
    const quantity = offered === null ? null : component === 'IDU'
      ? (/\b(?:IDU|Indoor Unit)\b/i.test(vendorSite) ? null : 0) : Number(offered);
    const known = linked && source && required && quantity !== null;
    const deviation = component === 'IDU' || (known && Number(required) !== quantity);
    const state = !known ? 'OPEN' : !deviation ? 'QUANTITY_MATCH' : accepted(excerpt => excerpt.includes(tag)) ? 'ACCEPTED_DEVIATION' : 'DEVIATION_PENDING';
    return {site, component, tag, location, required:required ? Number(required) : null, unit:'Ea.', offered:quantity, offerUnit:'Ea.',
      ...dmrLineReferences(site,component,linked,quantity !== null),
      source, state,
      reason:!siteMatches ? 'ไซต์หรือระบบที่ผูกต่างจาก MR' : !source ? 'ต้องยืนยัน TAG จาก DTS ฉบับที่ใช้' :
        !known ? 'ต้องยืนยัน MR และ R11 ที่ผูกกับ Working' :
        component === 'IDU' ? 'Full Outdoor ต้องยืนยันหน้าที่ IDU ไฟสำรอง และจุดต่อในห้องของไซต์นี้' :
          'เทียบจำนวนตาม MR กับของใน R11 แยกจากจำนวนที่ ADDVALUE ตั้งเผื่อและผลพิสูจน์ทางวิศวกรรม'};
  });
}

export const CERAGON_R11_C1_0550 = {
  'MR-B1-15-APF-01': [
    'APF end of the shared 2+0 link.',
    'APF cabinet shared with Wireless Broadband; check ADDVALUE allocation.',
    '1 IP-50CX Full Outdoor radio; high sub-band diplexer. No Hot Standby.',
    'No separate IDU. Full Outdoor interface proposed as a deviation.',
    '1 × 1.2 m dish per APF BLD, tag ANT-320-201; differs from MR quantity.',
    'Excluded by CERAGON. Check ADDVALUE LAN scope.',
  ],
  'MR-B1-15-APF-02': [
    'Offer: 75 m. BoQ: 80 m MM fibre assembly and DC cable. Confirm route, lengths and SM/MM compatibility.',
    'Full Outdoor fibre to customer network and DC power replace the IDU–ODU interface.',
    'Radio mounted to the antenna assembly through OMT; verify installation detail.',
  ],
  'MR-B1-15-ACP-01': [
    'ACP end of the same shared 2+0 link.',
    '1 IP-50CX Full Outdoor radio; low sub-band diplexer. No Hot Standby.',
    'No separate IDU. Reconcile the Radio Cabinet interface for Full Outdoor.',
    '1 × 1.2 m dish per ACP TYP/LIS, tag ANT-320-001; differs from MR quantity.',
  ],
  'MR-B1-15-ACP-02': [
    'Offer: 75 m. BoQ: 80 m MM fibre assembly and DC cable. Confirm route, lengths and SM/MM compatibility.',
    'Full Outdoor fibre to customer network and DC power replace the IDU–ODU interface.',
    'Radio mounted to the antenna assembly through OMT; verify installation detail.',
  ],
};

// ADDVALUE owns these activities for the single APF–ACP link. The IDs
// identify existing shared Working owners, so the same effort is counted once.
export const DMR_PART_B_0550=[
  {title:'Engineering and system integration',activity:'B1-D02',schedule:'A1 / Vendor Documents'},
  {title:'SDRL and document control',activity:'B1-D04',schedule:'A1 / Vendor Documents'},
  {title:'iFAT',activity:'B4-D02',schedule:'A1 / Inspection and Tests'},
  {title:'FAT',activity:'B4-D01',schedule:'A1 / Inspection and Tests'},
  {title:'SAT',activity:'B4-D03',schedule:'C7 / Site Service'},
  {title:'Site Survey',activity:'B7-D01',schedule:'C7 / Site Service'},
].map(r=>({...r,wbs:r.activity.split('-')[0],lineId:'REQ-MR-ACT-'+r.activity}));

export const DMR_MR_0550 = 'https://drive.google.com/file/d/1eqDkuSedFAhbMfpAvVJFM87jGixJMFXd/view';

// The 24 bullets on printed p22 are numbered here in reading order. Repeated
// obligations share a row. Working and vendor links are evidence references only.
const dmrMrObligations = [
  [[1,24], 'ระบบและอุปกรณ์ประกอบครบตาม SPE / DTS / แบบอ้างอิง',
    'ไล่รายการ Etc. ทั้ง APF และ ACP ถึงเอกสารอ้างอิง แล้วเทียบ P/N และรายการที่ต้องจัดเพิ่ม', ['B1-D02']],
  [[2], 'เตรียมผิวและทาสีตู้ Microwave', 'ตรวจ Coating Specification/Datasheet และผู้จัดหาตู้ APF'],
  [[3], 'Microwave Path Study และ Link Availability/Reliability',
    'จำนวนใน MR มาจาก FEED · ตรวจ terrain, Fresnel, path loss และ rain fading ก่อนยืนยันจาน, polarization, กำลังส่ง, ระดับติดตั้ง และ BOQ (modem, coupler/combiner, pressurization ถ้าใช้, lightning protection และ rack)', ['B1-D03']],
  [[4], 'Engineering / CAL / RPT / Drawing / Interface',
    'ยืนยันขอบเขตระบบครบทั้งฮาร์ดแวร์ ซอฟต์แวร์ อุปกรณ์ประกอบ สาย และบริการที่ต้องใช้', ['B1-D02','B1-D03','B1-D05']],
  [[5], 'SDRL และเอกสารส่งมอบ', 'เทียบรายการ SDRL กับชุดเอกสารที่ OEM และ ADDVALUE ต้องส่ง', ['B1-D04']],
  [[6,7,9], 'FAT / SAT / iFAT และ Inspection & Testing',
    'ยืนยันขั้นตอนและขอบเขตทดสอบระบบครบตาม SPE/DTS รวม Interface กับระบบอื่น', ['B4-D01','B4-D02','B4-D03']],
  [[8,17], 'Start-up / Commissioning Spares, Tools & Tackles',
    'แยกรายการตามเหตุการณ์และยื่นให้ Company อนุมัติ ตรวจรายการที่ต้องใช้จริงเทียบกับงบเผื่อเดิม', ['B5-D01','B5-D02','B5-D03','B6-D01']],
  [[10,18], 'Long-term Preservation / Packing / Transport',
    'เทียบข้อกำหนดเก็บรักษาและแพ็กกับขอบเขตส่งมอบของ Vendor และผู้รับช่วงขนส่ง', ['B2-D01','B2-D02']],
  [[11], 'Two-year Operational Spares',
    'ต้องมีรายการ ราคา/หน่วย ระยะส่งมอบ และ Company อนุมัติ · CERAGON R12 เป็น Capital Spares (C2) จำนวน 2 ODU · R14 เป็น SLA', ['C3-D01','C3-D02','C3-D03'], ['R12','R14']],
  [[12,20], 'Special Tools สำหรับ Operation / Maintenance ถ้าต้องใช้',
    'ตรวจ applicability และแยกใบเสนอราคาตาม MR', ['B6-D01']],
  [[13], 'Pre-commissioning / Commissioning / Start-up / Site Supervision',
    'ยืนยันกิจกรรม จำนวนวัน ผู้รับผิดชอบ และอัตรารายวันแบบรวมค่าใช้จ่าย', ['B4-D04','B4-D05']],
  [[14], 'ระบุหน่วยราย Component', 'ตรวจถ้อยคำใน MR “Vendor shall supply unit of each component” กับรายการที่ต้องจัดหา'],
  [[15], 'ป้ายอุปกรณ์ Outdoor · Stainless Steel 316', 'ตรวจวัสดุป้ายและผู้จัดหาของแต่ละอุปกรณ์'],
  [[16], 'Approved Vendor List / Sub-vendor Approval', 'ตรวจผู้ผลิตและขออนุมัติ Sub-vendor สำหรับรายการที่อยู่นอก AVL'],
  [[19], 'Third-party Review / Certification / Inspection & Testing',
    'ยืนยันหน่วยตรวจอิสระและขอบเขตตรวจระบบครบชุด'],
  [[21], 'Assistance for Installation', 'ยืนยันขอบเขตช่วยติดตั้งและเจ้าของงานหน้างาน'],
  [[22], 'ความรับผิดชอบต่อระบบครบชุด',
    'ตรวจการแบ่งหน้าที่ออกแบบ จัดหา ผลิต ประกอบ ตรวจ ทดสอบ อะไหล่ เคลือบผิว แพ็ก และขนส่ง'],
  [[23], 'Loose Items สำหรับติดตั้งก่อน Commissioning',
    'แยกรายการ ระบุป้าย แพ็ก และตรวจว่าจัดส่งพร้อมอุปกรณ์หลัก'],
];

export function dmrMrAdditionalScope0550(requirements) {
  const apf = requirements.find(r => r.id === 'REQDEF-MR-B1-15-APF-01' && r.site === 'APF');
  const acp = requirements.find(r => r.id === 'REQDEF-MR-B1-15-ACP-01' && r.site === 'ACP');
  const apfComponents = mr.rows.find(r => 'REQDEF-'+r.id === apf?.id)?.components || [];
  const apfRows = [
    ['Microwave Cabinet', 'APF · MR-320 ใช้ร่วมกับ Wireless Broadband IDU', 'ไม่มีบรรทัดตู้ใน BoQ Option 2 คอลัมน์ I · ตรวจเจ้าของตู้และงานประกอบร่วม'],
    ['Access Switch', 'APF · ตรวจ TAG จากแบบ LAN', 'CERAGON ระบุไม่รวม Switch/Router ที่ Offer!F11 · ตรวจขอบเขต LAN ของ ADDVALUE'],
  ].map(([name,title,action])=>({reference:'p21 · APF Item 1.0', title, itemName:name,
    requirement:apfComponents.find(component=>component.startsWith(name)) || name, action, requirementId:apf?.id}));
  return [
    ...(apf ? apfRows : []),
    ...(acp ? [{reference:'p21 · ACP Item 1.0', title:'ACP · ตู้ร่วม RAD-308-001', itemName:'Radio Cabinet · RAD-308-001',
      requirement:'ตำแหน่งติดตั้ง IDU ตาม MR / DTS / LIS', action:'ตรวจจุดต่อของ Full Outdoor กับตู้ Radio เดิม · MR แถว ACP ไม่แยกจำนวนตู้', requirementId:acp.id}] : []),
    ...dmrMrObligations.map(([bullets,title,action,activities=[],offers=[]])=>({
      reference:'p22 · ข้อ '+bullets.join(', '), bullets, title, action,
      workLineIds:activities.map(activity=>'REQ-MR-ACT-'+activity),
      offerIds:offers.map(row=>quote+row),
    })),
    {reference:'p27–28 · Cable notes', title:'Cable Bulk / Patching / Termination ร่วมโครงการ',
      action:'ตรวจรายการที่ใช้จริงต่อจุดติดตั้ง DMR จาก Cable Schedule เช่น FODP/ODF, RF jumper, surge arrestor, cable gland, stopping plug, adaptor, clamp และ grounding kit · เทียบชนิดสายกับ 10008-STD-6-ICT-003 · แยกขอบเขต OEM กับ Bulk ร่วมก่อนกำหนดจำนวน'},
    {reference:'p29–31 · Appendix 2 §1–2', title:'เอกสารอ้างอิงสำหรับ Microwave',
      action:'ตรวจ SPE-0011 B1, DTS-0010 B1, APF BLD-0011 C3, ACP BLD-0001 C3 และ 10008-STD-6-TEL-004 R01 ตามทะเบียน MR แล้วไล่อ้างอิงต่อจากแต่ละฉบับ'},
  ];
}
