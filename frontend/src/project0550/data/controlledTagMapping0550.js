import {assessControlledTagMappingV2,matchQuotedSourceLineV2,deriveSourcedExtendedV2,reconcileTagCostOwnersV2,TAG_MAPPING_RULE_VERSION} from '../../common/engineering/controlledTagMappingV2';
import {roundMoney0550,sumMoney0550,PRICING_POLICY_0550} from './money0550';
import {customerTagCatalogue0550,tagBindingProblems0550,tagCandidatesForRequirement0550} from './tagEvidence0550';
import {nativeSupplierItem0550} from './supplierCostProjection0550';
import {MGW_QUOTE_0550,mgwQuoteItem0550,supplierOfferExcluded0550,MGW_SCOPE_EXCLUDED_0550} from './mgwVendorBasis0550';
import {bidRequirementOwners0550} from './bidProcess0550';
import {bidCompletionSourceUsages0550} from './bidCompletion0550';
import {mgwDetailGroupPrice0550} from './mgwDetailPricing0550';
import {towerWorkingBreakdown0550} from './towerWorkingBreakdown0550';
const unique=xs=>[...new Set(xs.filter(Boolean))];
const okSource=(data,id)=>{const s=data.sourceIntake?.sources.find(s=>s.id===id);return s&&s.content&&s.readState!=='METADATA_ONLY'&&s.authority==='CURRENT_TENDER'&&!data.sourceIntake.sources.some(n=>n.replaces?.includes(id));};
export function deriveControlledTagMapping0550(data,model,systems,today){
 const catalogue=customerTagCatalogue0550(data),all=model.integration?.requirements||[],lineById=new Map(data.lines.map(l=>[l.id,l])),usages=bidCompletionSourceUsages0550(data);
 const tower=towerWorkingBreakdown0550(data,model.provisional),ownerAudits=new Map();
 for(const owner of model.provisional?.selected||[]){
  const raw=lineById.get(owner.id),nativeAmount=owner.provisionalCostNative,receipt=usages.find(u=>u.line.id===owner.id),items=[];
  if(receipt?.kind==='QUOTED'&&receipt.current)for(const id of receipt.offerIds){const o=data.offers.find(o=>o.id===id),n=o&&nativeSupplierItem0550(o);if(n)items.push({sourceUsageKey:id,ownerId:owner.id,currency:n.currency,amount:n.total});}
  else if(owner.id==='LINE-LEGACY-TEL-TELT-1'&&tower.state==='READY')for(const d of tower.rows.values())if(d.kind==='DETAIL')for(const id of d.offerIds){const n=nativeSupplierItem0550(data.offers.find(o=>o.id===id));items.push({sourceUsageKey:id,ownerId:owner.id,currency:n.currency,amount:n.total});}
  else if(raw?.mgwDetailGroupId){const cost=mgwDetailGroupPrice0550(data,raw.mgwDetailGroupId,raw);items.push({sourceUsageKey:'MGW:'+raw.mgwDetailGroupId,ownerId:owner.id,currency:'USD',amount:cost.costUSD});}
  else {const o=data.offers.find(o=>o.id===raw?.offerId),n=o&&nativeSupplierItem0550(o);if(n&&o.unitCost===n.rate&&o.currency===n.currency&&o.unit===n.unit&&raw.currency===n.currency){const derived=deriveSourcedExtendedV2({quantity:owner.quantity,sourceUnitRate:n.rate,currency:n.currency,round:roundMoney0550,pricingPolicy:PRICING_POLICY_0550});items.push({sourceUsageKey:o.id,ownerId:owner.id,currency:n.currency,amount:derived.amount});}}
  const check=reconcileTagCostOwnersV2({items,ledger:[{ownerId:owner.id,currency:owner.currency,extended:nativeAmount}],round:roundMoney0550,pricingPolicy:PRICING_POLICY_0550});ownerAudits.set(owner.id,{id:owner.id,kind:check.pass?'SOURCE_RECONCILED':receipt?.kind||'BASIS_REVIEW',...check});
 }

 const requirements=all.filter(r=>r.id.startsWith('REQDEF-')||r.tagBindings?.length);
 const rows=requirements.map(r=>{
  const links=r.tagBindings||[],rawLines=r.workLineIds.map(id=>lineById.get(id)).filter(Boolean),physical=rawLines.some(l=>l.mrRequirementId&&l.wbs==='A'&&l.responsibility!=='COMPANY'),owners=bidRequirementOwners0550(r,model),company=r.responsibility==='COMPANY';
  const candidates=physical?tagCandidatesForRequirement0550(r,catalogue):[],tagProblems=links.length?tagBindingProblems0550(data,r,links,catalogue):[];
  const offerIds=unique([...r.offerIds,...links.flatMap(l=>l.offerIds)]),offers=offerIds.map(id=>data.offers.find(o=>o.id===id));
  const sourceChecks=offers.map(o=>{
   if(!o)return {matched:false,issues:['OFFER_MISSING']};
   if(supplierOfferExcluded0550(data,o,r.systemToken))return {id:o.id,matched:false,issues:[MGW_SCOPE_EXCLUDED_0550]};
   const n=nativeSupplierItem0550(o),mgw=mgwQuoteItem0550(o),sourceId=o.quoteEvidence?.sourceId||(mgw?'MGW:'+MGW_QUOTE_0550.sourceSha256:'');
   const itemCode=o.supplierQuoteRow?.itemCode||mgw?.id||o.quoteEvidence?.locator||'';
   const registered={offerId:o.id,sourceId,itemCode,quantity:n?.quantity,unit:n?.unit,rate:n?.rate,currency:n?.currency};
   const expected={...registered,unit:o.unit,rate:o.unitCost,currency:o.currency};
   const result=matchQuotedSourceLineV2({expected,registered});
   const validityCurrent=Boolean(today&&o.date&&o.validUntil&&o.date<=today&&o.validUntil>=today);
   const extended=deriveSourcedExtendedV2({quantity:n?.quantity,sourceUnitRate:n?.rate,currency:n?.currency,round:roundMoney0550,pricingPolicy:PRICING_POLICY_0550});
   return {...result,id:o.id,validityCurrent,originalExtended:extended.amount,sourceTotal:n?.total,originalTotalMatches:Number.isFinite(n?.total)&&extended.amount===n.total};
  });
  const priced=owners.length>0&&owners.every(o=>Number.isFinite(o.customerUSD)&&Number.isFinite(o.costTHB)),nativeReady=r.state==='REVIEWED_MAPPING'||r.state==='NOT_APPLICABLE';
  const ownerSafe=owners.length>0&&owners.every(o=>!o.mrScopeState?.covered&&o.selected&&!o.problems?.some(p=>/DUPLICATE|OWNER_OPEN|NON_ADDITIVE/.test(p)));
  const currentUsages=owners.flatMap(o=>usages.filter(u=>u.line.id===o.id));
  const unit=u=>String(u||'').toUpperCase().replace(/^PCS$/,'PC'),nativePhysical=rawLines.filter(l=>l.mrRequirementId&&l.wbs==='A');
  const quantityMapped=links.length>0&&!tagProblems.length&&(nativePhysical.length===1&&links.every(b=>unit(b.unit)===unit(nativePhysical[0].unit))&&links.reduce((n,b)=>n+b.quantity,0)===nativePhysical[0].quantity||nativeReady&&nativePhysical.every(l=>['LOT','SET'].includes(unit(l.unit)))&&links.every(b=>b.basis.trim()));

  const stage=(id,pass,reason,na=false)=>({id,state:na?'NOT_APPLICABLE':pass?'PASS':'OPEN',reason});
  const checks=[
   stage('MAP-01',links.length>0&&!tagProblems.length,physical?(links.length?tagProblems.join(' / ')||'TAG source/site/quantity references match current customer evidence':'ยังไม่มี TAG ที่ผูกกับรายการลูกค้านี้'):'ข้อกำหนดนี้ไม่ได้เป็นแถวจัดหาอุปกรณ์ตาม MR',!physical&&!links.length),
   stage('MAP-02',r.sourceIds.length>0&&r.sourceIds.every(id=>okSource(data,id))&&Boolean(r.sourceExcerpt&&r.sourceLocator),'ตรวจข้อกำหนดและฉบับต้นทางจาก Customer source ที่ผูกไว้'),
   stage('MAP-03',Boolean(r.need&&r.criteria),'ต้องมีคำตีความหน้าที่และเกณฑ์รับของรายการลูกค้า'),
   stage('MAP-04',sourceChecks.length>0&&sourceChecks.every(c=>c.matched),'ตรวจ Offer/Item/จำนวน/หน่วย/เรต/สกุลกับต้นฉบับ · ไม่อนุมานจากชื่อคล้ายกัน',company),
   stage('MAP-05',nativeReady,'ใช้ผล CAL/RPT/AVL/Deviation/Mapping เดิม · มีราคาไม่เท่ากับผ่านข้อกำหนด'),
   stage('MAP-06',physical?quantityMapped:rawLines.length>0&&rawLines.every(l=>Number.isFinite(l.quantity)&&l.quantity>0),physical?'จำนวนตามแถว TAG ลูกค้าต้องมีหลักฐาน · จำนวนซื้อ/ติดตั้ง/อะไหล่แยกกัน':'ปริมาณงานอ้างจาก Working/สมการเดิม',company),
   stage('MAP-07',ownerSafe,'อ้างเจ้าของต้นทุนเดิมครั้งเดียว · ลิงก์ TAG ไม่สร้างต้นทุนใหม่',company),
   stage('MAP-08',priced,'ต้นทุนและราคาขายใช้ E01–E18 / FX / Decimal policy เดิม',company),
   stage('MAP-09',ownerSafe&&priced&&owners.every(o=>ownerAudits.get(o.id)?.pass)&&currentUsages.every(u=>u.current),'กระทบยอดต้นฉบับกับเจ้าของราคาเดิมตามสกุลและ Decimal policy · ประมาณการ/ต้นทุนผสมแสดงแยก · ไม่แจกยอดแพ็กเกจต่อ TAG',company),
   stage('MAP-10',nativeReady&&priced&&owners.every(o=>o.reviewState==='REVIEWED_WORKING')&&sourceChecks.length>0&&sourceChecks.every(c=>c.validityCurrent)&&(!physical||links.length>0&&!tagProblems.length),'แยกงานทำร่างราคาออกจากการตรวจ Mapping/วิศวกรรมและการอนุมัติออกฉบับ',company)
  ];
  return {id:r.id,systemToken:r.systemToken,site:r.site,title:r.title,requirement:r,physical,company,links,candidates,tagProblems,sourceChecks,ownerAudits:owners.map(o=>ownerAudits.get(o.id)),ownerIds:owners.map(o=>o.id),customerRowCodes:unique(owners.map(o=>o.customerRowCode)),vdrlIds:unique(links.flatMap(l=>l.vdrlIds)),...assessControlledTagMappingV2({checks,priceAvailable:priced,engineeringReady:nativeReady})};
 });
 const tokens=[...systems.map(s=>s.token),'COMMON'].filter((t,i,a)=>a.indexOf(t)===i);
 const selected=model.provisional?.selected||[],systemRows=tokens.map(token=>{
  const rs=rows.filter(r=>r.systemToken===token),ids=new Set(rs.flatMap(r=>r.ownerIds)),owners=selected.filter(o=>o.systemToken===token||ids.has(o.id));
  return {token,name:systems.find(s=>s.token===token)?.name||token,requirements:rs.length,physical:rs.filter(r=>r.physical).length,tagLinked:rs.filter(r=>r.physical&&r.links.length&&!r.tagProblems.length).length,mappingComplete:rs.filter(r=>r.mappingComplete).length,pricedOwners:owners.filter(o=>Number.isFinite(o.customerUSD)).length,ownerIds:owners.map(o=>o.id),priceOpen:owners.filter(o=>!Number.isFinite(o.customerUSD)||!Number.isFinite(o.costTHB)).length,knownUSD:sumMoney0550(owners.filter(o=>Number.isFinite(o.customerUSD)).map(o=>o.customerUSD)),candidateTags:unique(rs.flatMap(r=>r.candidates.map(t=>t.site+'|'+t.tag))).length};
 });
 return {ruleVersion:TAG_MAPPING_RULE_VERSION,reviewDate:today||null,pricingPolicy:PRICING_POLICY_0550,rows,systems:systemRows,catalogue,ownerAudits:[...ownerAudits.values()],uniqueOwners:selected.length,knownUSD:sumMoney0550(selected.filter(o=>Number.isFinite(o.customerUSD)).map(o=>o.customerUSD)),priceOpen:selected.filter(o=>!Number.isFinite(o.customerUSD)||!Number.isFinite(o.costTHB)).length,issueAuthorized:false};
}
