// Bid-stage process over canonical inputs. It never changes money, scope,
// engineering reviews or frozen issues. A quote basis is not technical acceptance.
import {sumMoney0550} from './money0550';
import {importMrWorkingBasis0550} from './mrWorkingBasis0550';
import {policyDefaults0550} from '../bidWorkingBasis0550';
import {quoteValidity0550} from './quoteValidity0550';
import {CERAGON_LINK_OWNER_0550,CERAGON_DISH_ALLOWANCE_0550,CERAGON_R10_0550,CERAGON_R11_0550,CERAGON_R11_DECISION_DATE_0550,CERAGON_R11_CONFIGURATION_0550,CERAGON_R11_OPEN_SCOPE_0550,ceragonR11Source0550} from './ceragonSelection0550';
const finite=Number.isFinite;
const unique=a=>[...new Set(a.filter(Boolean))];
export const BID_PROCESS_VERSION_0550='0550-bid-process-20261104-1';
// These concern scope disposition, not whether q × rate can be calculated.
// Invalid owners, duplicate scope, currency/units, quote dates and numeric errors
// are deliberately not classified as scope warnings.
export const isBidScopeWarning0550=p=>['MR_CLARIFICATION:','MR_PACKAGE_COVERAGE_OPEN:','MR_SCOPE_BASIS_OPEN:'].some(prefix=>p.startsWith(prefix));
const controls=new Set(['REQ-MR-ACT-B5-D04','REQ-MR-ACT-B6-D05','REQ-MR-ACT-C2-D04','REQ-MR-ACT-C3-D04']);
const study={
 'TEL-RADIO-DTRS':'B01.02','TEL-RADIO-MARINE':'B01.02','TEL-RADIO-AERO':'B01.02','TEL-RADIO-SSB':'B01.02',
 'TEL-TELT':'B01.03','TEL-CCTV':'B01.04','TEL-LAN':'B01.04','TEL-PAGA':'B01.05','TEL-NDB':'B01.06','TEL-FO':'B01.07'
};
export function bidStudyDelivery0550(data,token){
 const code=study[token];if(!code)return null;
 const sources=data.sourceIntake?.sources||[],replaced=new Set(sources.flatMap(s=>s.replaces||[]));
 const current=sources.filter(s=>s.documentNo==='MM-ASK-1A-APF-TEL-MR-0001'&&s.authority==='CURRENT_TENDER'&&s.revision==='B1'&&s.content&&!replaced.has(s.id));
 if(current.length!==1)return null;
 const source=current[0];
 const normalized=source.content.replace(/\s+/g,' ');
 const marker=normalized.indexOf(code+' '),end=marker<0?-1:normalized.indexOf(' P+4',marker);
 // Require the actual row, nearby P+4, and the source's own submission legend.
 if(marker<0||end<marker||end-marker>240||!normalized.includes('Post Order submittal requirement in weeks'))return null;
 const excerpt=normalized.slice(marker,end+5);
 if(/\bWITH BID\b|\bWith Bid\b|\bB\b/.test(excerpt))return null;
 return {code,dueCode:'P+4',weeksAfterOrder:4,sourceId:source.id,locator:'MR Rev.B1 / Appendix3 / printed p37 (physical PDF p39); submission legend printed p35',excerpt,phase:'AFTER_PO'};
}
export function deriveBidProcess0550(data,model,systems){
 const provisional=model.provisional,lines=provisional.lines,byId=new Map(lines.map(l=>[l.id,l])),requirements=model.integration?.requirements||[];
 const buckets=new Map();
 const add=(code,label,role,line,action)=>{const key=code+'|'+(line.systemToken==='COMMON'?line.wbs:line.systemToken);if(!buckets.has(key))buckets.set(key,{id:key,code,label,role,systemToken:line.systemToken,wbs:line.wbs,lineIds:[],inputProblems:[],action});buckets.get(key).lineIds.push(line.id);buckets.get(key).inputProblems.push(...(line.provisionalProblems||line.problems||[]));};
 const controlsPresent=[],financial=[],notSelected=[];
 for(const line of lines){
  const raw=data.lines.find(l=>l.id===line.id);
  const control=controls.has(line.id)&&!finite(raw?.manualCost)&&!finite(raw?.sellRate)&&!raw?.offerId&&!raw?.calculationId;
  if(control){controlsPresent.push(line.id);continue;}
  if(!line.selected){notSelected.push(line.id);continue;}
  financial.push(line);
  if(finite(line.customerUSD)){
   if((line.problems||[]).some(isBidScopeWarning0550))add('SCOPE_BASIS','มีราคาแล้ว · ต้องจัดขอบเขตตาม RFQ','SI',line,'ใช้ราคาที่คำนวณได้ต่อ พร้อมตรวจขอบเขตและเจ้าของราคา; ไม่ถือว่าผ่านสเปก');
   continue;
  }
  const related=requirements.filter(r=>r.workLineIds.includes(line.id));
  const owners=unique(related.flatMap(r=>r.workLineIds)).map(id=>byId.get(id)).filter(l=>l&&l.id!==line.id&&l.selected&&finite(l.customerUSD));
  const sameSystem=(line.mrScopeState?.candidates||[]).map(l=>byId.get(l.id)).filter(l=>l?.selected&&finite(l.customerUSD));
  const candidates=unique([...owners,...sameSystem].map(l=>l.id));
  if(candidates.length){add('PACKAGE_ALLOCATION','มีราคาแพ็กเกจ · งานจัดสรรขอบเขต','SI',line,'เทียบรายการกับแพ็กเกจเดิมและจัดเจ้าของราคาเดียว; ไม่ซื้อหรือเพิ่มราคาโดยอัตโนมัติ');continue;}
  if(line.wbs==='C1'){add('INSTALLATION_BASIS','งานติดตั้ง · ต้องจัดขอบเขตและประมาณการ','SI',line,'ใช้ MR ปัจจุบันแยก mounting/cable/FO/tower/civil; จัดปริมาณและเรต ไม่ใช้ EXCLUDED/CNEEC เดิมตัดงาน');continue;}
  if(line.wbs==='C2'||line.wbs==='C3'||line.wbs==='B5'){add('SPARES_BASIS','อะไหล่ · ต้องจัดรายการและเรต','SI',line,'จัดรายการอะไหล่ตาม RFQ ใช้เรตของรุ่น/หน่วยเดียวกันที่มีใน Vendor และหักส่วนที่รวมแล้ว');continue;}
  add('PRICE_BASIS','ต้องจัดฐานปริมาณ / เรต / FX','SI',line,'ตรวจข้อมูล Vendor/ทรัพยากร/สมการที่มี แล้วจัดประมาณการพร้อมที่มา; ข้อมูลที่ไม่มีต้องระบุเฉพาะ input และผลกระทบ');
 }
 const parts=['A','B','C'].map(part=>{const rows=financial.filter(l=>l.wbs.startsWith(part)),known=rows.filter(l=>finite(l.customerUSD));return {part,owners:rows.length,priced:known.length,pending:rows.length-known.length,knownUSD:sumMoney0550(known.map(l=>l.customerUSD)),knownCostTHB:sumMoney0550(rows.filter(l=>finite(l.costTHB)).map(l=>l.costTHB)),missingCost:rows.filter(l=>!finite(l.costTHB)).length,complete:rows.length>0&&known.length===rows.length};});
 const systemRows=systems.map(s=>{const rs=requirements.filter(r=>r.systemToken===s.token),ids=unique(rs.flatMap(r=>r.workLineIds)),owners=lines.filter(l=>l.selected&&finite(l.customerUSD)&&(l.systemToken===s.token||ids.includes(l.id))),delivery=bidStudyDelivery0550(data,s.token),plan=byId.get('REQ-MR-ACT-B1-D03');return {token:s.token,name:s.name,requirementCount:rs.length,ownerIds:unique(owners.map(l=>l.id)),supplyOwnerIds:unique(owners.filter(l=>l.wbs==='A').map(l=>l.id)),serviceOwnerIds:unique(owners.filter(l=>l.wbs!=='A').map(l=>l.id)),companySupply:rs.some(r=>r.responsibility==='COMPANY'),delivery,studyWorkPriced:Boolean(delivery&&plan?.selected&&finite(plan.customerUSD)),workOwnerId:delivery?'REQ-MR-ACT-B1-D03':null,engineeringAccepted:rs.length>0&&rs.every(r=>['REVIEWED_MAPPING','NOT_APPLICABLE'].includes(r.state))};});
 const groups=[...buckets.values()].map(g=>({...g,lineIds:unique(g.lineIds),inputProblems:unique(g.inputProblems)}));
 return {version:BID_PROCESS_VERSION_0550,parts,systems:systemRows,groups,controlLineIds:controlsPresent,notSelectedLineIds:notSelected,canPrepare:financial.some(l=>finite(l.customerUSD)),pricedOwners:financial.filter(l=>finite(l.customerUSD)).length,priceInputRows:financial.filter(l=>!finite(l.customerUSD)).length,engineeringAccepted:false,releaseAllowed:false};
}

// Execute only exact untouched system defaults. Source rates stay in Vendor;
// edits, deselections, deleted handled rows and alternate commercial choices win.
export function prepareBidProcess0550(data,policies,today){
 if(data.projectId!=='PJ2608-0550'||!data.repositoryBasisImport)return data;
 const previous=data.repositoryBasisImport.bidProcess;
 if(today>=CERAGON_R11_DECISION_DATE_0550)data=prepareCeragonR11(data,policies,today,previous?.ceragonHandled);
 if(previous?.version===BID_PROCESS_VERSION_0550&&previous.ceragonHandled)return data;
 const pristine=importMrWorkingBasis0550({lines:[],offers:[]},policies,today).lines;
 let lines=data.lines,changed=false;
 const same=(a,b)=>JSON.stringify(Object.keys(a||{}).sort().map(k=>[k,a[k]]))===JSON.stringify(Object.keys(b||{}).sort().map(k=>[k,b[k]]));
 const controlLineIds=previous?.controlLineIds||[];
 if(!previous){
  lines=lines.map(l=>{if(!controls.has(l.id)||!same(l,pristine.find(x=>x.id===l.id)))return l;changed=true;controlLineIds.push(l.id);return {...l,selected:false};});
 }
 let ceragonHandled=previous?.ceragonHandled||false;
 const id=CERAGON_LINK_OWNER_0550;
 const offers=data.offers.filter(o=>o.vendorId==='VENDOR-CERAGON-0550'&&o.id===CERAGON_R10_0550&&o.quoteEvidence?.revision==='RevA1'&&o.quoteEvidence?.systemTokens?.length===1&&o.quoteEvidence.systemTokens[0]==='TEL-DMR'&&o.quoteEvidence.quotedQuantity===1&&o.currency==='USD'&&o.unit==='Lot'&&finite(o.unitCost)&&o.unitCost>=0&&quoteValidity0550(o,today).current);
 if(today>=CERAGON_R11_DECISION_DATE_0550){
  ceragonHandled=ceragonHandled||lines.some(line=>line.id===id&&line.offerId===CERAGON_R11_0550);
 }else if(!ceragonHandled&&offers.length===1){
  // Do not replace a saved DMR commercial selection or any edited native row.
  const native=lines.filter(l=>l.systemToken==='TEL-DMR');
  const authored=native.length!==pristine.filter(l=>l.systemToken==='TEL-DMR').length||native.some(l=>!l.mrRequirementId||!same(l,pristine.find(x=>x.id===l.id)));
  if(!authored&&!lines.some(l=>l.id===id)){
   const o=offers[0],policy=policyDefaults0550(policies,'Goods / Procured Cost');
   if(policy){lines=[...lines,{id,systemToken:'TEL-DMR',wbs:'A',description:'CERAGON ACP–APF microwave link / RevA1 quoted supply',scopeKey:'CERAGON.ACP-APF.REVA1.R10',tagRef:'ACP–APF',requirementRef:'MR Rev.B1 Appendix1.5 / quoted ACP–APF link; site/BOM/length differences remain in SI review',sourceRef:o.sourceRef+' / one quoted whole-link Lot; component BoQ is non-additive. Supply only; services, freight, spares and additional scope are separate.',vendorId:o.vendorId,offerId:o.id,calculationId:'',resultKey:'value',quantity:1,unit:'Lot',currency:'USD',manualCost:null,sellMode:'MARGIN',sellRate:null,markupPct:null,marginPct:null,primePct:null,...policy,selected:true,customerRowCode:'A1-11',customerRemark:'Quoted microwave supply basis; final design and RFQ scope reconciliation remain required.',brand:o.brand}];changed=true;}
  }
  ceragonHandled=true;
 }
 if(previous&&!changed&&ceragonHandled===previous.ceragonHandled)return data;
 return {...data,lines,repositoryBasisImport:{...data.repositoryBasisImport,bidProcess:{...previous,version:BID_PROCESS_VERSION_0550,preparedOn:today,controlLineIds,ceragonHandled}}};
}
// Adopt the authorised 2+0 offer against the existing whole-link owner.
// A deleted, deselected or independently edited commercial basis stays authored.
function prepareCeragonR11(data,policies,today,handled){
 const offer=data.offers.find(ceragonR11Source0550);
 if(!offer)return data;
 const old=data.lines.find(l=>l.id===CERAGON_LINK_OWNER_0550);
 if(old?.offerId===CERAGON_R11_0550){
  if(!old.selected||!data.lines.some(l=>l.id===CERAGON_DISH_ALLOWANCE_0550&&l.selected))return data;
  return {...data,lines:data.lines.map(l=>l.id===CERAGON_DISH_ALLOWANCE_0550?{...l,selected:false}:l)};
 }
 if(old&&(old.offerId!==CERAGON_R10_0550||old.scopeKey!=='CERAGON.ACP-APF.REVA1.R10'||old.systemToken!=='TEL-DMR'||old.wbs!=='A'||!old.selected||old.quantity!==1||old.unit!=='Lot'||old.calculationId||old.manualCost!==null||old.sellRate!==null))return data;
 if(!old&&handled)return data;
 if(!old&&data.lines.some(l=>l.id!==CERAGON_DISH_ALLOWANCE_0550&&l.systemToken==='TEL-DMR'&&l.wbs==='A'&&l.selected&&(l.offerId||l.calculationId||l.mgwDetailGroupId||finite(l.manualCost)||finite(l.sellRate))))return data;
 const policy=policyDefaults0550(policies,'Goods / Procured Cost');
 if(!old&&!policy)return data;
 const owner={
  ...(old||{id:CERAGON_LINK_OWNER_0550,systemToken:'TEL-DMR',wbs:'A',tagRef:'ACP–APF',
   calculationId:'',resultKey:'value',quantity:1,unit:'Lot',currency:'USD',manualCost:null,
   sellMode:'MARGIN',sellRate:null,markupPct:null,marginPct:null,primePct:null,...policy,selected:true,customerRowCode:'A1-11'}),
  description:'CERAGON ACP–APF microwave link / RevA1 R11 2+0',
  scopeKey:'CERAGON.ACP-APF.REVA1.R11',
  requirementRef:'MR Rev.B1 Appendix 1.5 / APF and ACP / one shared link',
  sourceRef:offer.sourceRef+' / '+today+' / R11 selected: one Working Lot. Original quotation option quantity remains zero.',
  vendorId:offer.vendorId,offerId:offer.id,brand:offer.brand,
  customerRemark:CERAGON_R11_CONFIGURATION_0550+' '+CERAGON_R11_OPEN_SCOPE_0550
 };
 const lines=data.lines.map(l=>l===old?owner:l.id===CERAGON_DISH_ALLOWANCE_0550&&l.selected?{...l,selected:false}:l);
 return {...data,lines:old?lines:[...lines,owner]};
}

export function isBidControlOnly0550(data,line){
 const r=data.repositoryBasisImport?.bidProcess;
 return Boolean(r?.version===BID_PROCESS_VERSION_0550&&r.controlLineIds.includes(line.id)&&!line.selected&&controls.has(line.id)&&!finite(line.manualCost)&&!finite(line.sellRate)&&!line.offerId&&!line.calculationId);
}

export function bidRequirementOwners0550(requirement,model){
 const calculated=new Map((model.lines||[]).map(l=>[l.id,l])),priced=new Map((model.provisional?.lines||[]).map(l=>[l.id,l]));
 const ids=unique((requirement.workLineIds||[]).flatMap(id=>{const proposed=priced.get(id)?.bidPriceAllocation;if(proposed)return proposed.ownerIds;const l=calculated.get(id);return [l?.mrScopeState?.covered?l.mrScopeState.owner.id:id];}));
 return ids.map(id=>priced.get(id)).filter(l=>l?.selected&&finite(l.customerUSD));
}

// A same-system package price is useful bid evidence before exact MR allocation.
// Keep it separate from accepted covered owners and never add its amount per row.
export function bidRequirementPackageReferences0550(requirement,model){
 const calculated=new Map((model.lines||[]).map(l=>[l.id,l])),priced=new Map((model.provisional?.lines||[]).map(l=>[l.id,l]));
 const owners=new Set(bidRequirementOwners0550(requirement,model).map(l=>l.id));
 const ids=unique((requirement.workLineIds||[]).flatMap(id=>{const line=calculated.get(id);return line?.wbs==='A'&&line.systemToken!=='COMMON'&&!line.mrScopeState?.covered?(line.mrScopeState?.candidates||[]).map(l=>l.id):[];}));
 return ids.filter(id=>!owners.has(id)).map(id=>priced.get(id)).filter(l=>l?.selected&&finite(l.customerUSD));
}
