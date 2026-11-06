import {assessBidPunch,stageBidPunch} from '../../common/governance/bidPunch';
import {integrationFingerprint0550} from './integrationWorkspace0550';
import {deriveBidProcess0550,bidStudyDelivery0550} from './bidProcess0550';
import {deriveBidVolumes0550} from './bidVolumes0550';
import {bidCompletionBasisChanged0550} from './bidCompletion0550';

export function punchTaskRoute0550(row,requirements,preferredId){
 const code=row.id.split('|')[0],candidates=(row.requirementIds||[]).map(id=>requirements.find(r=>r.id===id)).filter(r=>r&&(r.problems||[]).some(p=>p.split(' / ')[0]===code)),requirement=candidates.find(r=>r.id===preferredId)||candidates[0];
 if(code==='ENGINEERING_PROOF_OPEN'&&requirement&&['CAL','RPT'].includes(requirement.proofMode))return {kind:'PROOF',requirement,recordId:requirement.proofs?.find(p=>p.kind===requirement.proofMode&&p.state!=='REVIEWED_PROOF')?.id};
 if(code==='ACTIVITY_OPEN'&&requirement){const kind=requirement.problems.find(p=>p.startsWith('ACTIVITY_OPEN / '))?.split(' / ')[1];return {kind:'ACTIVITY',requirement,activityKind:kind||'INSTALLATION',recordId:requirement.activities?.find(a=>a.kind===kind&&a.state!=='REVIEWED_PLAN')?.id};}
 return {kind:'TARGET',target:requirement&&row.target?.startsWith('bid.working-preview.requirement.')?'bid.working-preview.requirement.'+requirement.id:row.target,sourceTarget:row.sourceTarget};
}
export const punchProofDraft0550=(r,id)=>({id,requirementId:r?.id||'',title:'',kind:r?.proofMode==='RPT'?'RPT':'CAL',calculationId:'',operator:'GTE',limit:null,unit:'',method:'',inputsBasis:'',criteria:r?.criteria||'',limitations:'',report:'',outcome:'OPEN',reviewer:'',reviewedOn:'',status:'DRAFT',basisKey:''});
export const punchActivityDraft0550=(r,id,kind='INSTALLATION')=>({id,requirementId:r?.id||'',kind,title:'',responsible:'',quantity:null,unit:'',calculationId:'',workLineId:'',scopeBasis:'',acceptanceCriteria:r?.criteria||'',deliverable:'',dueDate:'',reviewer:'',reviewedOn:'',status:'DRAFT',basisKey:''});

// Translate existing 0550 conditions, never rewrite their state or acceptance.
export function punchCause0550(code){
 if(code==='REVIEW_OPEN')return {severity:'MINOR',priceEffect:'EVIDENCE',title:'รอบันทึกผลทบทวน',action:'ตรวจเนื้อหาและฐานก่อนบันทึกผู้ทบทวน/วันที่ในแบบเดิม'};
 if(code==='ENGINEERING_PROOF_OPEN')return {severity:'MAJOR',priceEffect:'SCOPE',title:'CAL/RPT ยังไม่ครบตามข้อกำหนด',action:'ตรวจว่างานใดต้องพิสูจน์ก่อน Bid และงานใดเป็นรายงานหลัง PO; ตั้งขอบเขต/ราคางานที่ต้องทำ โดยไม่บันทึก PASS แทนหลักฐาน'};
 if(code==='STALE_DEPENDENCIES')return {severity:'MAJOR',priceEffect:'UNKNOWN',title:'ฐานที่เคยทบทวนเปลี่ยน',action:'เปรียบเทียบฐานที่เปลี่ยน ประเมินผลต่อขอบเขต/ราคา แล้วทบทวนต้นทางใหม่'};
 if(/^(SUPPLIER_ALLOCATION|WORKING_ALLOCATION|RESPONSIBILITY|REQUIREMENT_INTERPRETATION)/.test(code))return {severity:'MAJOR',priceEffect:'SCOPE',title:'ต้องจัดขอบเขต/ผู้รับผิดชอบ/แพ็กเกจ',action:'เทียบ MR กับรายการ Supplier และเจ้าของงานที่มีแล้ว; ระบุส่วนรวม/ไม่รวม และจัดราคาส่วนเพิ่มที่ไม่ซ้ำ'};
 if(/^(ACTIVITY|PARTICULAR_ACTIVITY)/.test(code))return {severity:'MAJOR',priceEffect:'SCOPE',title:'แผนงาน/ทรัพยากร/เจ้าของต้นทุนยังไม่ครบ',action:'ใช้แผนและสมการเดิมจัด MH/MD/ค่าใช้จ่าย ผูกเจ้าของงานเดียว ตรวจงานที่ Supplier รวมแล้ว'};
 if(/AVL|DEVIATION/.test(code))return {severity:'MAJOR',priceEffect:'SCOPE',title:'AVL / ข้อยกเว้นยังไม่ยืนยัน',action:'ตรวจผู้ผลิต/รุ่นกับข้อกำหนด; ถ้ามีทางเลือกให้ผูกต้นทุนและผลกระทบ พร้อมดำเนินข้อยกเว้นในทะเบียนเดิม'};
 if(/SOURCE|EXCERPT|CLAUSE|PARTICULAR|DOCUMENT/.test(code))return {severity:'REVIEW',priceEffect:'UNKNOWN',title:'ต้องตรวจฐานเอกสาร/ประเด็นต้นทาง',action:'อ่านประเด็นและฉบับที่เกี่ยวข้อง ระบุว่ากระทบชนิด จำนวน ขอบเขต หรือเป็นงานเอกสาร; ผูกหลักฐานและฐานราคาที่ใช้'};
 return {severity:'REVIEW',priceEffect:'UNKNOWN',title:'ต้องประเมินเงื่อนไขเพิ่มเติม',action:'เปิดต้นทางของเงื่อนไข ประเมินผลต่อราคาและกำหนดส่งก่อนจัด Major/Minor'};
}
export function sourceFindingPunchCause0550(finding){
 const cause=punchCause0550('SOURCE_FINDING');
 const severity={'CUS Punch / MAJOR':'MAJOR','CUS Punch / MINOR':'MINOR'}[finding?.category];
 return severity?{...cause,severity,priceEffect:severity==='MAJOR'?'SCOPE':'EVIDENCE',action:finding.impact}:cause;
}
// A disappeared row is not evidence of closure. New plans retain their exact
// source subjects; the original live validators must clear the tracked cause.
export function punchGateScope0550(data,model){
 const ids=rows=>(rows||[]).map(r=>r.id||r.inputId||r.code).sort();
 return integrationFingerprint0550({requirements:ids(model.integration?.requirements),findings:ids(data.sourceIntake?.findings),lines:ids(data.lines),inputs:ids(model.sourceReadiness?.rows),records:ids(data.bidVolumes?.records),vdrl:ids(data.bidVolumes?.vdrl),bindings:ids(data.bidVolumes?.bindings)});
}
export function resolveBidPunchPlan0550(data,model,plan,volumes,scopeKey){
 const t=plan.tracking,unknown=reason=>({id:plan.id,verified:false,reason});
 if(!t||t.key!==plan.id)return unknown('แผนเดิมไม่มีชุดอ้างอิงต้นทางสำหรับยืนยันการปิด');
 const [code,,system,proofMode]=plan.id.split('|'),i=model.integration||{};
 const reqCodes=['REVIEW_OPEN','REVIEW_BASIS_OPEN','STALE_DEPENDENCIES','ENGINEERING_PROOF_OPEN','RESPONSIBILITY_OPEN','SUPPLIER_ALLOCATION_OPEN','WORKING_ALLOCATION_OPEN','REQUIREMENT_INTERPRETATION_OPEN','PROOF_DISPOSITION_OPEN','CUSTOMER_SOURCE_OPEN','SUPPLIER_SOURCE_OPEN','CURRENT_SOURCE_OPEN','SOURCE_REVISION_OR_COPY_OPEN','SOURCE_MISSING','CONTENT_UNREAD','CLAUSE_LOCATOR_OR_EXCERPT_OPEN','EXCERPT_NOT_IN_REVIEWED_TEXT','OFFER_MISSING','AVL_REVIEW_OPEN','ACTIVITY_OPEN','TECHNICAL_DEVIATION_OPEN'];
 const prefixes={PARTICULAR:['PARTICULAR_OPEN','PARTICULAR_ACTIVITY_OPEN'],FINDING:['SOURCE_FINDING'],OWNER:['PRICE','COMMERCIAL'],TECHNICAL:['TECHNICAL'],VDRL:['VDRL'],PACKAGE:['PACKAGE'],A_INPUT:['A_INPUT'],ISSUE:['ISSUE'],BUDGET:['BUDGET_BASIS_CHANGED']};
 if(t.kind==='REQUIREMENTS'?!reqCodes.includes(code):!prefixes[t.kind]?.includes(code))return unknown('ชนิดต้นทางไม่ตรงกับสาเหตุที่ติดตาม');
 if(t.kind!=='REQUIREMENTS'&&t.kind!=='BUDGET'&&(t.subjectIds.length!==1||plan.id!==code+'|'+t.subjectIds[0]))return unknown('ตัวตนต้นทางไม่ตรงกับรายการ Punch เดิม');
 let records=[],valid=false,target='bid.working-preview.step.8';
 if(t.kind==='REQUIREMENTS'){
  records=t.subjectIds.map(id=>(i.requirements||[]).find(r=>r.id===id));
  valid=records.length>0&&records.every(r=>r&&Array.isArray(r.problems)&&(!system||r.systemToken===system)&&(!proofMode||r.proofMode===proofMode));
  if(valid)valid=records.every(r=>{
   if(r.problems.some(p=>p.split(' / ')[0]===code))return false;
   if(r.disposition==='NOT_APPLICABLE')return r.state==='NOT_APPLICABLE';
   if(['REVIEW_OPEN','REVIEW_BASIS_OPEN','STALE_DEPENDENCIES'].includes(code))return r.status==='REVIEWED'&&!r.problems.some(p=>['REVIEW_OPEN','REVIEW_BASIS_OPEN','STALE_DEPENDENCIES'].includes(p));
   if(code==='ENGINEERING_PROOF_OPEN')return r.proofs?.some(p=>p.kind===r.proofMode&&p.state==='REVIEWED_PROOF')||r.state==='REVIEWED_MAPPING';
   return true;
  });
  if(records[0])target='bid.working-preview.requirement.'+records[0].id;
 }else if(t.kind==='PARTICULAR'){
  records=t.subjectIds.map(id=>(i.particulars||[]).find(p=>p.id===id));valid=records.length>0&&records.every(p=>p?.state==='REVIEWED_PARTICULAR');target='bid.working-preview.particular.'+t.subjectIds[0];
  if(code==='PARTICULAR_ACTIVITY_OPEN')valid=valid&&Boolean(t.linkedIds?.length)&&t.linkedIds.every(id=>{const r=i.requirements?.find(r=>r.id===id);return r&&!r.problems.some(p=>p.startsWith('PARTICULAR_ACTIVITY_OPEN / '+t.subjectIds[0]+' / '));});
 }else if(t.kind==='FINDING'){
  records=t.subjectIds.map(id=>(data.sourceIntake?.findings||[]).find(f=>f.id===id));valid=records.length>0&&records.every(f=>f?.state==='SOURCE_SUPPORTED');target='bid.documents.finding.'+t.subjectIds[0];
 }else if(t.kind==='OWNER'){
  records=t.subjectIds.map(id=>model.provisional?.selected.find(l=>l.id===id));
  valid=records.length>0&&records.every(l=>l&&Number.isFinite(l.customerUSD)&&Number.isFinite(l.costTHB)&&(!plan.id.startsWith('COMMERCIAL|')||!(l.problems||[]).some(p=>/Quote|DUPLICATE|NON_ADDITIVE|scope|MR_|SATELLITE_|FX|mismatch/i.test(p))));target='bid.budget.working.line.'+t.subjectIds[0];
 }else if(t.kind==='TECHNICAL'||t.kind==='VDRL'){
  const collection=t.kind==='TECHNICAL'?volumes?.technical.records:volumes?.vdrl;
  records=t.subjectIds.map(id=>collection?.find(r=>r.id===id));valid=records.length>0&&records.every(r=>r&&(t.kind==='TECHNICAL'?r.state==='REVIEWED_DRAFT':r.state==='REVIEWED'&&(t.requiredPhase!=='BID'||r.phase==='BID')));target=t.kind==='TECHNICAL'?'bid.technical.'+(records[0]?.sectionId||'overview'):'bid.technical.vdrl';
 }else if(t.kind==='BUDGET'){
  valid=Boolean(t.scopeKey&&t.scopeKey===(scopeKey||punchGateScope0550(data,model))&&data.repositoryBasisImport?.bidCompletion&&!bidCompletionBasisChanged0550(data));target='bid.budget.official.summary';
 }else if(['PACKAGE','A_INPUT','ISSUE'].includes(t.kind)){
  const gate=t.kind==='PACKAGE'?data.bidVolumes&&volumes:t.kind==='A_INPUT'?model.sourceReadiness:model.releaseControl;
  valid=Boolean(t.scopeKey&&t.scopeKey===(scopeKey||punchGateScope0550(data,model))&&gate?.ready===true&&Array.isArray(gate.problems)&&t.subjectIds.every(p=>!gate.problems.includes(p)));target=t.kind==='A_INPUT'?'l3.original':t.kind==='PACKAGE'?'bid.quotation':'bid.budget.release';
 }else return unknown('ยังไม่มีวิธียืนยันการปิดสำหรับชนิดต้นทางนี้');
 return {id:plan.id,verified:valid,reason:valid?'ต้นทางชุดเดิมยังอยู่ และผลตรวจปัจจุบันไม่พบสาเหตุนี้แล้ว':'ต้นทางถูกลบ/เปลี่ยนบริบท หรือผลตรวจเดิมยังไม่ผ่าน จึงยังยืนยันการปิดไม่ได้',target,sourceTarget:t.kind==='FINDING'||t.kind==='A_INPUT'};
}
export function deriveBidPunch0550(data,model,systems,today){
 const integration=model.integration||{},process=deriveBidProcess0550(data,model,systems),owners=model.provisional?.selected||[];
 // Conservative change detector, not a signature. Notes/audit themselves do not
 // invalidate plans; source, financial, interpretation or package edits do.
 const basis=integrationFingerprint0550({source:data.sourceIntake||null,sourceControl:data.sourceControl||null,lines:data.lines,offers:data.offers,fx:data.fx,calculations:data.calculations,integration:data.integrationWorkspace||null,customerReviews:data.customerReviews||null,technical:data.technicalProposal||null,volumes:data.bidVolumes||null,completion:data.repositoryBasisImport?.bidCompletion||null});
 const groups=new Map(),reqs=integration.requirements||[],reqById=new Map(reqs.map(r=>[r.id,r]));
 const delivery=new Map(systems.map(s=>[s.token,bidStudyDelivery0550(data,s.token)]));
 function add(key,patch,req){
  if(!groups.has(key))groups.set(key,{id:key,basisKey:basis,systemTokens:[],requirementIds:[],workLineIds:[],codes:[],phase:'REVIEW',hardPriceBlock:false,...patch});
  const row=groups.get(key);
  if(req){row.systemTokens.push(req.systemToken);row.requirementIds.push(req.id);row.workLineIds.push(...req.workLineIds);}
  return row;
 }
 for(const r of reqs)for(const problem of r.problems||[]){
  const [code,ref]=problem.split(' / ');
  const shared=['PARTICULAR_OPEN','PARTICULAR_ACTIVITY_OPEN','SOURCE_FINDING','CURRENT_SOURCE_OPEN','SOURCE_REVISION_OR_COPY_OPEN','SOURCE_MISSING','CONTENT_UNREAD'].includes(code)&&ref;
  // One SI task per cause/system/proof method, with the exact affected MR IDs
  // retained below it. Do not hand thousands of identical review tasks to the
  // owner or make one shared source problem look like thousands of purchases.
  const key=shared?code+'|'+ref:code+'|SYSTEM|'+r.systemToken+(code==='ENGINEERING_PROOF_OPEN'?'|'+r.proofMode:'');
  const particular=(integration.particulars||[]).find(p=>p.id===ref),finding=(data.sourceIntake?.findings||[]).find(f=>f.id===ref);
  const cause=code==='SOURCE_FINDING'?sourceFindingPunchCause0550(finding):punchCause0550(code);
  let target='bid.working-preview.requirement.'+r.id,sourceTarget=false;
  if(code==='PARTICULAR_OPEN'||code==='PARTICULAR_ACTIVITY_OPEN')target='bid.working-preview.particular.'+ref;
  if(code==='SOURCE_FINDING'){target='bid.documents.finding.'+ref;sourceTarget=true;}
  if(['CURRENT_SOURCE_OPEN','SOURCE_REVISION_OR_COPY_OPEN','SOURCE_MISSING','CONTENT_UNREAD'].includes(code)){target='bid.documents.source.'+ref;sourceTarget=true;}
  const row=add(key,{...cause,target,sourceTarget,title:particular?.title||finding?.statement||cause.title,context:particular?.impact||finding?.impact||r.title,shared:Boolean(shared)},r);
  row.codes.push(problem);
  if(code==='ENGINEERING_PROOF_OPEN'&&r.proofMode==='RPT'&&delivery.get(r.systemToken)){
   const d=delivery.get(r.systemToken);row.deliveryHint=d.code+' / '+d.dueCode+' / '+d.locator;
   row.action=cause.action+' · มีตารางรายงานระดับระบบ '+d.code+' '+d.dueCode+' ให้ตรวจว่าตรงกับ RPT ข้อนี้หรือไม่; ราคางานทบทวนกับงานจัดทำต้องตรวจแยก';
  }
 }
 // Preserve a path to source findings/Particulars even when no MR refers to them.
 for(const p of integration.particulars||[])if(p.problems?.length){
  const row=add('PARTICULAR_OPEN|'+p.id,{...punchCause0550('PARTICULAR_OPEN'),title:p.title,context:p.impact,shared:true,target:'bid.working-preview.particular.'+p.id});row.systemTokens.push(p.systemToken);row.codes.push(...p.problems);
 }
 for(const f of data.sourceIntake?.findings||[])if(f.state!=='SOURCE_SUPPORTED'){
  const row=add('SOURCE_FINDING|'+f.id,{...sourceFindingPunchCause0550(f),title:f.statement,context:f.impact,shared:true,target:'bid.documents.finding.'+f.id,sourceTarget:true});row.systemTokens.push(...(f.systemTokens.length?f.systemTokens:['COMMON']));row.codes.push(f.state);
 }
 // Genuine numerical/identity/unit errors remain price blockers. Existing
 // scope warnings and Included MR references must not become extra purchases.
 for(const l of owners){
  const missing=!Number.isFinite(l.customerUSD)||!Number.isFinite(l.costTHB),problems=l.provisionalProblems||[];
  if(missing){const row=add('PRICE|'+l.id,{severity:'MAJOR',priceEffect:'INPUT',title:'ฐานตัวเลขต้นทุน/ราคายังไม่ครบ',context:l.description,action:'เปิด Working ตรวจปริมาณ หน่วย เรต สมการ FX และเจ้าของต้นทุน; ใช้ราคาอ้างอิงหรือประมาณการที่มีฐาน ไม่ใส่ศูนย์แทนข้อมูลขาด',target:'bid.budget.working.line.'+l.id,hardPriceBlock:true});row.systemTokens.push(l.systemToken);row.workLineIds.push(l.id);row.codes.push(...problems);}
  const concerns=(l.problems||[]).filter(p=>/Quote|DUPLICATE|NON_ADDITIVE|scope|MR_|SATELLITE_|FX|mismatch/i.test(p));
  if(concerns.length){const row=add('COMMERCIAL|'+l.id,{severity:'MAJOR',priceEffect:'SCOPE',title:'ทบทวนเงื่อนไขราคา/ขอบเขตที่ใช้จัดงบ',context:l.description,action:'ตรวจวันที่/อายุใบเสนอราคา ฐานหน่วย ขอบเขต การนับซ้ำและสมมติฐาน; คงราคาเดิมจนมีฐานแก้ไข',target:'bid.budget.working.line.'+l.id});row.systemTokens.push(l.systemToken);row.workLineIds.push(l.id);row.codes.push(...concerns);}
 }
 if(bidCompletionBasisChanged0550(data))add('BUDGET_BASIS_CHANGED',{severity:'MAJOR',priceEffect:'UNKNOWN',title:'ฐานจัดงบเปลี่ยน ต้องตรวจประมาณการและการจัดสรร',context:'ราคา/ปริมาณ/FX/Source ต่างจากฐานวันที่จัดงบ',action:'ตรวจรายการประมาณการและผลกระทบกับเจ้าของงานเดิมก่อนใช้ยอด',target:'bid.budget.official.summary'});
 // Include ALL package layers, not only Mapping: native schedules, technical
 // drafts, With-Bid VDRL, commercial responses and existing release controls.
 const volumes=deriveBidVolumes0550(data,model,systems,today);
 for(const r of volumes.technical.records||[])if(r.problems.length){const row=add('TECHNICAL|'+r.id,{severity:'MAJOR',priceEffect:'EVIDENCE',title:'เอกสารเทคนิคยังไม่ครบ / '+r.sectionId,context:r.content?'มีเนื้อหาร่าง ต้องตรวจหลักฐานและผลทบทวน':'ยังไม่มีเนื้อหา/เจ้าของเอกสาร',action:'จัดทำเนื้อหาข้อเสนอและลิงก์หลักฐานใน Volume II เดิม; แยกงานที่จะส่งหลัง PO',target:'bid.technical.'+r.sectionId,requiredWithBid:true,phase:'BID'});row.systemTokens.push(r.systemToken);row.requirementIds.push(...r.requirementIds);row.codes.push(...r.problems);}
 for(const r of volumes.vdrl||[])if(r.problems.length){const row=add('VDRL|'+r.id,{severity:r.phase==='BID'?'MAJOR':'REVIEW',priceEffect:'EVIDENCE',title:r.title||r.id,context:'VDRL / '+r.phase,action:'ตรวจข้อกำหนดกำหนดส่ง เอกสารจริง ผู้รับผิดชอบและลิงก์เทคนิคใน12.V; แผนส่งตามไม่เท่ากับส่งแล้ว',target:'bid.technical.vdrl',requiredWithBid:r.phase==='BID',requiredPhase:r.phase==='POST_AWARD'?'POST_AWARD':'REVIEW',phase:r.phase==='POST_AWARD'?'POST_AWARD':r.phase==='BID'?'BID':'REVIEW'});row.systemTokens.push(r.systemToken);row.codes.push(...r.problems);}
 for(const problem of volumes.problems||[]){const cause=punchCause0550(problem),row=add('PACKAGE|'+problem,{...cause,priceEffect:'EVIDENCE',severity:'MAJOR',title:problem,context:'เงื่อนไขความครบชุดข้อเสนอเดิม',action:'เปิดแบบราคา/แผนเอกสาร ตรวจรายการลูกและฐานที่ยังขาด ไม่เปลี่ยนสถานะต้นทางจาก Punch plan',target:/VDRL|VOLUME_II|TECHNICAL/.test(problem)?'bid.technical.vdrl':/VOLUME_III/.test(problem)?'bid.commercial':'bid.quotation',requiredWithBid:true,phase:'BID'});row.systemTokens.push('COMMON');row.codes.push(problem);}
 for(const problem of model.sourceReadiness?.problems||[]){const row=add('A_INPUT|'+problem,{severity:'MAJOR',priceEffect:'EVIDENCE',title:problem,context:'A · เงื่อนไขฐานข้อมูล/การอ่าน/ฉบับใช้งานที่ยังค้าง',action:'เปิด A ตรวจทะเบียนเอกสาร การรับข้อมูลและผลทบทวน ใช้ฐานราคาเดิมทำร่างต่อ พร้อมตรวจผลกระทบของข้อมูลที่ยังไม่ครบ',target:'l3.original',sourceTarget:true});row.systemTokens.push('COMMON');row.codes.push(problem);}
 for(const problem of model.releaseControl?.problems||[]){const row=add('ISSUE|'+problem,{severity:'MAJOR',priceEffect:'EVIDENCE',title:problem,context:'เงื่อนไขออกฉบับอย่างเป็นทางการเดิม ไม่ใช่เงื่อนไขหยุดคำนวณร่าง',action:'ตรวจสาเหตุใน10.7และปิดที่ต้นทาง แผน Punch ไม่แทนการทบทวนหรือการอนุญาตออกฉบับ',target:'bid.budget.release'});row.systemTokens.push('COMMON');row.codes.push(problem);}
 const scopeKey=punchGateScope0550(data,model);
 const issues=[...groups.values()].map(r=>{
  const requirementIds=[...new Set(r.requirementIds)].filter(id=>reqById.has(id)),[prefix,...parts]=r.id.split('|'),ref=parts.join('|');
  const kind=prefix.startsWith('PARTICULAR')?'PARTICULAR':prefix==='SOURCE_FINDING'?'FINDING':['PRICE','COMMERCIAL'].includes(prefix)?'OWNER':prefix==='BUDGET_BASIS_CHANGED'?'BUDGET':['TECHNICAL','VDRL','PACKAGE','A_INPUT','ISSUE'].includes(prefix)?prefix:'REQUIREMENTS';
  return {...r,systemTokens:[...new Set(r.systemTokens.length?r.systemTokens:['COMMON'])],requirementIds,workLineIds:[...new Set(r.workLineIds)],codes:[...new Set(r.codes)],tracking:{kind,key:r.id,subjectIds:kind==='REQUIREMENTS'?requirementIds:[ref||prefix],requiredPhase:r.requiredWithBid?'BID':r.requiredPhase||'REVIEW',...(prefix==='PARTICULAR_ACTIVITY_OPEN'?{linkedIds:requirementIds}:{}),...(['PACKAGE','A_INPUT','ISSUE','BUDGET'].includes(kind)?{scopeKey}:{})}};
 });
 const plans=data.bidPunchPlans||[],resolutions=plans.map(p=>resolveBidPunchPlan0550(data,model,p,volumes,scopeKey));
 const assessed=assessBidPunch({issues,plans,owners:owners.map(o=>({id:o.id,selected:o.selected,costAmount:o.costTHB,sellAmount:o.customerUSD})),today,documentsReady:volumes.ready,engineeringReady:Boolean(integration.ready),resolutions});
 const stageView=stageBidPunch(assessed.rows.map(r=>({...r,taskStage:r.stage,workStage:r.hardPriceBlock||/^(PRICE\||COMMERCIAL\||BUDGET_BASIS_CHANGED|A_INPUT\|)/.test(r.id)||/^ISSUE\|(NATIVE_EXHIBIT_C:|CUSTOMER_SCOPE_OPEN|REVIEWED_USD_PRICE_OPEN|BASE_TOTAL_OPEN|CURRENT_FX_OPEN|REQUIREMENT_OR_PRICE_MAPPING_OPEN|A_INPUT_READINESS_OPEN|SOURCE_INTAKE_OPEN)/.test(r.id)?'PREPARE':r.workStage})));
 return {...assessed,...stageView,volumeView:volumes,process,rawRequirementProblems:reqs.reduce((n,r)=>n+(r.problems?.length||0),0)};
}
