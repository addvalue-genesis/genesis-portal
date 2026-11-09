import {mgwCurrentMr0550,mgwLanPbxFoOffer0550,mgwCctvEntOffer0550} from './mgwQuoteSelection0550';

const kinds=[
 ['Cabinet',/^LAN (?:System )?Cabinet\b/i],
 ['Firewall',/^Fire\s*Wall\b/i],
 ['Core Switch',/^Core Switch\b/i],
 ['Distribution Switch',/^Distribution\b/i],
 ['Access Switch',/^(?:Industrial )?Access Switch\b/i],
 ['UTP Patch Panel',/^(?:(?:\d+ Ports? )?CAT6A|UTP) Patch(?:\/Manage)? Panel\b/i],
 ['FO Patch Panel',/^(?:\d+ Ports? )?(?:FOC|Fiber(?: Optic)?) Patch Panel\b/i],
 ['ODF Panel',/^ODF Panel\b/i],
 ['IP PBX Server',/^(?:IP PBX|PABX) Server\b/i],
 ['Wireless Controller',/^Wireless Controller\b/i],
 ['Media Converter',/^Media Converters?\b/i],
 ['CCTV NVR',/^(?:CCTV )?NVR\b/i],
 ['MET Server',/^MET Server\b/i],
 ['Terminal Box',/^Terminal Box\b/i],
];
const kindOf=name=>kinds.find(([,pattern])=>pattern.test(name.replace(/^[A-Z0-9]+\s+·\s+/,'')))?.[0]||name;
const hasQuantity=value=>Number.isFinite(value)&&value>=0;

function packageComponents(row){
 const parts=new Map();
 for(const match of (row.detail?.text||'').matchAll(/^\s*-\s*([^\n]+?)\s+(\d+)\s+Ea\b/gmi)){
  const key=kindOf(match[1]);
  parts.set(key,(parts.get(key)||0)+Number(match[2]));
 }
 return parts;
}

function relatedToCabinet(row,id){
 if(row.native.option||row.multipleSystems)return false;
 const refs=mgwCurrentMr0550(row.offer);
 if(mgwLanPbxFoOffer0550(row.offer))return refs.includes(id)||row.system==='TEL-PABX'&&refs.includes(id+'-PBX');
 return row.system==='TEL-CCTV'&&mgwCctvEntOffer0550(row.offer)&&refs.includes(id+'-NVR');
}

function canCompareUnits(item,offer){
 const unit=offer.native.unit?.trim().toLowerCase().replace(/\.$/,'');
 if(item==='Cabinet')return /^lots?$/.test(unit);
 if(/^(?:ea|each|pcs?)$/.test(unit))return true;
 if(!/^sets?$/.test(unit))return false;
 const primary=offer.offer.quoteEvidence.terms?.[0]||'';
 // Only convert a quoted set when the original line names one primary item.
 return /^(?:~\s*|BOM:\s*)1\s*[x×]\s*/i.test(primary)||
  item==='UTP Patch Panel'&&/^~\s*Discrete distribution module Panel\b/i.test(primary);
}

export function schematicLanBom0550(required,offers,place){
 const results=[],usedMr=new Set(),usedOffers=new Set();
 for(const mr of required){
  if(mr.system!=='TEL-LAN'||mr.description!=='LAN Cabinet'||mr.unit!=='Lot'||!Number.isSafeInteger(mr.quantity)||mr.quantity<=0)continue;
  const parts=packageComponents(mr);
  if(!parts.size)continue;
  const packageOffers=offers.filter(row=>row.site===mr.site&&relatedToCabinet(row,mr.id));
  if(place&&(!mr.building||mr.building!==place||
   !packageOffers.some(row=>kindOf(row.description)==='Cabinet'&&row.building===place)))continue;
  const byItem=new Map();
  for(const row of packageOffers){
   const originalKind=kindOf(row.description);
   const kind=originalKind==='FO Patch Panel'&&parts.has('ODF Panel')&&!parts.has(originalKind)?'ODF Panel':originalKind;
   if(!byItem.has(kind))byItem.set(kind,[]);
   byItem.get(kind).push(row);
  }
  usedMr.add(mr.id);
  for(const row of packageOffers)usedOffers.add(row.offer.id);
  const sn=Number(mr.id.split('-').at(-1))+'.0';
  const packageLabel='MR '+sn+' · LAN Cabinet';
  const cabinetPlace=mr.building|| (mr.site==='APF'&&sn==='10.0'?'กลุ่ม '+mr.quantity+' อาคารตาม MR':'ระดับไซต์ตาม MR');
  for(const kind of new Set(['Cabinet',...parts.keys(),...byItem.keys()])){
   const cabinet=kind==='Cabinet';
   const each=parts.get(kind);
   const requiredQty=cabinet?mr.quantity:each===undefined?null:each*mr.quantity;
   const matches=byItem.get(kind)||[];
   const single=matches.length===1?matches[0]:null;
   const offeredQty=single&&hasQuantity(single.native.quantity)?single.native.quantity:null;
   const mrUnit=cabinet?'Lot':'Ea';
   const compatible=single&&kind!=='ODF Panel'&&canCompareUnits(kind,single);
   const delta=requiredQty!==null&&offeredQty!==null&&compatible?offeredQty-requiredQty:null;
   const status=delta===null?'OPEN':delta<0?'SHORT':delta>0?'EXCESS':'MATCH';
   const reason=delta!==null?(single.native.totalText==='Included'?'ระบุ Included ใน VND':''):
    !matches.length?'ยังไม่พบรายการในชุด VND ที่ผูกกับตู้นี้':
    matches.length>1?'มีหลายบรรทัดเสนอ ต้องแยกจำนวนก่อนเทียบ':
    requiredQty===null?'MR ตู้นี้ไม่ได้ระบุจำนวนแยกสำหรับรายการนี้':
    kind==='ODF Panel'?'VND เสนอ Fiber Patch Panel ต้องยืนยันว่าครอบคลุม ODF ที่ระบุใน MR':
    !compatible?'รอยืนยันหน่วยหรือจำนวนอุปกรณ์หลักต่อชุดจาก VND':'รอยืนยันจำนวนเสนอ';
   results.push({
    key:mr.id+'|'+kind,label:cabinet?'จำนวนตู้':kind,packageLabel,packagePlace:cabinetPlace,packageSource:mr,
    mrBasis:each!==undefined&&mr.quantity>1?each+' Ea × '+mr.quantity+' ตู้ตาม MR':'',
    required:requiredQty===null?[]:[{...mr,description:cabinet?mr.description:kind,quantity:requiredQty,unit:mrUnit}],
    offers:matches,requiredQty,offeredQty,mrUnit,vndUnit:single?.native.unit,unit:mrUnit,delta,status,reason,
   });
  }
 }
 return {results,usedMr,usedOffers};
}
