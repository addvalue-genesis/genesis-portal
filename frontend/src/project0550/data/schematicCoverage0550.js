import Decimal from 'decimal.js';
import {mgwCurrentDirectMr0550,mgwCurrentMr0550} from './mgwQuoteSelection0550';

import {schematicLanBom0550} from './schematicLanBom0550';

const normalized=name=>name.toLowerCase().replace(/\s+/g,' ').trim();
const nativeUnit=value=>{
 const unit=normalized(value||'').replace(/\.$/,'');
 return {set:'set',sets:'set',ea:'pc',each:'pc',pcs:'pc',pc:'pc',m:'m',pair:'pair',pairs:'pair'}[unit];
};
const knownQuantity=n=>Number.isFinite(n)&&n>=0;
const compareOrder={SHORT:0,EXCESS:1,OPEN:2,TIE_IN:3,MATCH:4};
const unitFor=(rows,read)=>{
 const units=new Set(rows.map(row=>nativeUnit(read(row))||read(row)));
 return units.size===1?[...units][0]:null;
};

function cameraKind(description){
 if(!/\bcamera\b/i.test(description))return '';
 const ptz=/\bptz\b/i.test(description),fixed=/\bfixed\b/i.test(description);
 if(ptz===fixed)return '';
 if(/hazardous area|explosion[ -]proof/i.test(description))return ptz?'Ex PTZ':'Ex Fixed';
 if(/\bdome\b/i.test(description))return ptz?'Dome PTZ':'Dome Fixed';
 if(fixed&&/\b(?:indoor|bullet)\b/i.test(description))return 'Indoor Fixed / Bullet';
 return '';
}

function itemKey(row,side,required,aliases){
 const name=row.description.replace(/^[A-Z0-9]+\s+·\s+/,'');
 if(row.system==='TEL-CCTV'){
  const camera=cameraKind(name);
  if(camera)return {key:'camera:'+camera,label:camera};
 }
 const id=side==='VND'?mgwCurrentDirectMr0550(row.offer):row.id;
 if(id&&aliases.has(id))return {key:'direct:'+id,label:required.find(r=>r.id===id).description};
 return {key:'name:'+normalized(name),label:name};
}

function total(rows,read){
 if(!rows.length)return null;
 const numbers=rows.map(read);
 return numbers.every(knownQuantity)?numbers.reduce((sum,n)=>sum.plus(n),new Decimal(0)).toNumber():null;
}

// Source quantities only. Comparison is scoped to one site/location and uses
// native units. A source candidate or a matching count does not approve scope.
export function schematicCoverage0550(required,offers,{building=false,hasUnlocatedOffer=false,completeCameraRegister=false,partialCameraRegister=false,packageOffers=offers,place}={}){
 const mr=required.filter(row=>row.responsibility!=='COMPANY');
 const base=offers.filter(row=>!row.native.option&&!row.multipleSystems);
 const packages=(!building||place)?schematicLanBom0550(mr,packageOffers,place):{results:[],usedMr:new Set(),usedOffers:new Set()};
 const regularMr=mr.filter(row=>!packages.usedMr.has(row.id));
 const regularOffers=base.filter(row=>!packages.usedOffers.has(row.offer.id));
 const aliases=new Set(regularOffers.map(row=>mgwCurrentDirectMr0550(row.offer)).filter(id=>id&&regularMr.some(row=>row.id===id)));
 const byKey=new Map(),sourceOptions=offers.filter(row=>row.native.option||row.multipleSystems);
 const add=(row,side)=>{
  const {key,label}=itemKey(row,side,regularMr,aliases);
  if(!byKey.has(key))byKey.set(key,{key,label,required:[],offers:[]});
  byKey.get(key)[side==='CUS'?'required':'offers'].push(row);
 };
 regularMr.forEach(row=>add(row,'CUS'));
 regularOffers.forEach(row=>add(row,'VND'));
 const hasCameraScope=mr.some(row=>cameraKind(row.description))&&base.some(row=>cameraKind(row.description))&&
  [...mr,...base].every(row=>row.type!=='Camera'||cameraKind(row.description));
 const results=[...packages.results];
 for(const group of byKey.values()){
  const {key,required:cus,offers:vnd}=group;
  const camera=key.startsWith('camera:');
  const paired=cus.length>0&&vnd.length>0;
  const canUseZero=camera&&hasCameraScope&&completeCameraRegister&&!building&&!hasUnlocatedOffer;
  if(!paired&&!canUseZero){
   const mrUnit=unitFor(cus,row=>row.unit),vndUnit=unitFor(vnd,row=>row.native.unit);
   results.push({...group,mrUnit,vndUnit,requiredQty:cus.length===1?total(cus,row=>row.quantity):null,
    offeredQty:vnd.length===1?total(vnd,row=>row.native.quantity):null,status:'OPEN',
    reason:building?'รอยืนยัน TAG หรือจำนวนที่จัดสรรถึงตำแหน่งนี้':
     cus.length===1&&/^MR-B1-18-APF-(19|20)$/.test(cus[0].id)?'รอใบเสนอราคาสาย · ใช้ข้อกำหนด CUS ขอราคาจากผู้ขายสายได้':
     cus.length?'ยังไม่พบรายการ VND ที่จับคู่ได้':'ยังไม่พบข้อกำหนด MR ที่จับคู่ได้'});
   continue;
  }
  const mrUnit=unitFor(cus,row=>row.unit),vndUnit=unitFor(vnd,row=>row.native.unit);
  const unit=nativeUnit(mrUnit||vndUnit);
  const sameUnit=Boolean(unit&&(!cus.length||nativeUnit(mrUnit)===unit)&&(!vnd.length||nativeUnit(vndUnit)===unit));
  const requiredQty=cus.length?(mrUnit?total(cus,row=>row.quantity):null):0;
  const offeredQty=vnd.length?(vndUnit?total(vnd,row=>row.native.quantity):null):0;
  const revisions=new Set(vnd.map(row=>row.quoteKey));
  const incompleteCamera=camera&&partialCameraRegister;
  const canCompare=!hasUnlocatedOffer&&!incompleteCamera&&sameUnit&&requiredQty!==null&&offeredQty!==null&&revisions.size<=1&&
   (camera||cus.length===1&&vnd.length===1);
  const delta=canCompare?new Decimal(offeredQty).minus(requiredQty).toNumber():null;
  const status=delta===null?'OPEN':delta<0?'SHORT':delta>0?'EXCESS':'MATCH';
  results.push({...group,requiredQty,offeredQty,mrUnit:mrUnit||unit,vndUnit:vndUnit||unit,unit,delta,status,
   reason:canCompare?'':hasUnlocatedOffer?'มีรายการที่ยังไม่จัดสรรถึงตำแหน่งนี้':incompleteCamera?'ทะเบียนใบเสนอราคา CCTV ยังมาไม่ครบฉบับ':
    !sameUnit?'ตรวจหน่วยหรือส่วนประกอบในแพ็กเกจ':
    revisions.size>1?'มีหลายใบเสนอราคาในรายการเดียวกัน':'ตรวจจำนวนและขอบเขตในต้นฉบับ'});
 }
 if(sourceOptions.length){
  results.push({key:'optional',label:'Option / รายการใช้ร่วม',required:[],offers:sourceOptions,status:'OPEN',
   reason:'ตรวจขอบเขตแยกและเจ้าของรายการใช้ร่วม'});
 }
 return results.sort((a,b)=>compareOrder[a.status]-compareOrder[b.status]);
}

export const schematicOfferMrRefs0550=row=>mgwCurrentMr0550(row.offer);
