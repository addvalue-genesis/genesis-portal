import {assessBidPunch,stageBidPunch} from '../../common/governance/bidPunch';
import {integrationFingerprint0550} from './integrationWorkspace0550';
import {deriveBidProcess0550,bidStudyDelivery0550} from './bidProcess0550';
import {deriveBidVolumes0550} from './bidVolumes0550';
import {bidCompletionBasisChanged0550} from './bidCompletion0550';

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
  const [code,ref]=problem.split(' / '),cause=punchCause0550(code);
  const shared=['PARTICULAR_OPEN','PARTICULAR_ACTIVITY_OPEN','SOURCE_FINDING','CURRENT_SOURCE_OPEN','SOURCE_REVISION_OR_COPY_OPEN','SOURCE_MISSING','CONTENT_UNREAD'].includes(code)&&ref;
  // One SI task per cause/system/proof method, with the exact affected MR IDs
  // retained below it. Do not hand thousands of identical review tasks to the
  // owner or make one shared source problem look like thousands of purchases.
  const key=shared?code+'|'+ref:code+'|SYSTEM|'+r.systemToken+(code==='ENGINEERING_PROOF_OPEN'?'|'+r.proofMode:'');
  const particular=(integration.particulars||[]).find(p=>p.id===ref),finding=(data.sourceIntake?.findings||[]).find(f=>f.id===ref);
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
  const row=add('SOURCE_FINDING|'+f.id,{...punchCause0550('SOURCE_FINDING'),title:f.statement,context:f.impact,shared:true,target:'bid.documents.finding.'+f.id,sourceTarget:true});row.systemTokens.push(...(f.systemTokens.length?f.systemTokens:['COMMON']));row.codes.push(f.state);
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
 const issues=[...groups.values()].map(r=>({...r,systemTokens:[...new Set(r.systemTokens.length?r.systemTokens:['COMMON'])],requirementIds:[...new Set(r.requirementIds)].filter(id=>reqById.has(id)),workLineIds:[...new Set(r.workLineIds)],codes:[...new Set(r.codes)]}));
 const assessed=assessBidPunch({issues,plans:data.bidPunchPlans||[],owners:owners.map(o=>({id:o.id,selected:o.selected,costAmount:o.costTHB,sellAmount:o.customerUSD})),today,documentsReady:volumes.ready,engineeringReady:Boolean(integration.ready)});
 const stageView=stageBidPunch(assessed.rows.map(r=>({...r,workStage:r.hardPriceBlock||/^(PRICE\||COMMERCIAL\||BUDGET_BASIS_CHANGED|A_INPUT\|)/.test(r.id)||/^ISSUE\|(NATIVE_EXHIBIT_C:|CUSTOMER_SCOPE_OPEN|REVIEWED_USD_PRICE_OPEN|BASE_TOTAL_OPEN|CURRENT_FX_OPEN|REQUIREMENT_OR_PRICE_MAPPING_OPEN|A_INPUT_READINESS_OPEN|SOURCE_INTAKE_OPEN)/.test(r.id)?'PREPARE':r.workStage})));
 return {...assessed,...stageView,volumeView:volumes,process,rawRequirementProblems:reqs.reduce((n,r)=>n+(r.problems?.length||0),0)};
}
