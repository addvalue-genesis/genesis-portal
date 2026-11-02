// ADR-0550-001 §§2–6,8–12. Authoring only: never read this draft as an
// active price, approved supplier mapping, activity plan or cost exclusion.
export const SUPPLY_DRAFT_SCHEMA_0550="genesis.0550.supply-proposal-draft.v1";
export const SUPPLY_SERVICE_TREATMENTS_0550=[["REVIEW","รอตรวจขอบเขต"],["INCLUDED","รวมในแพ็กเกจ"],["SEPARATE","คิดเป็นบริการแยก"]];
export function activeSupplyLine0550(line){if(!line||line.supplyDraft===undefined)return line;const {supplyDraft,...active}=line;return active;}
export function blankSupplyProposalDraft0550(line={}){
 return {schema:SUPPLY_DRAFT_SCHEMA_0550,seller:"ADDVALUE",manufacturer:line.brand||"",procurementChannel:"",quotationRef:"",pricingMode:"FIXED",currency:line.currency||"THB",unit:line.unit||"Lot",packageSellRate:null,packageMarkupPct:null,finalMarginPct:5,primeMarkupPct:20,basis:"",serviceAllocations:[]};
}
export function validateSupplyProposalDraft0550(d,units){
 const fail=m=>{throw Error("Supply proposal draft: "+m);};
 const fields=(o,allowed)=>{if(!o||typeof o!=="object"||Array.isArray(o)||Object.keys(o).some(k=>!allowed.includes(k))||allowed.some(k=>o[k]===undefined))fail("invalid fields");};
 fields(d,Object.keys(blankSupplyProposalDraft0550()));
 const text=(v,max=4000)=>typeof v==="string"&&v.length<=max;
 const number=v=>v===null||typeof v==="number"&&Number.isFinite(v)&&v>=0&&v<=1e12;
 if(d.schema!==SUPPLY_DRAFT_SCHEMA_0550||!["ADDVALUE","EXTERNAL"].includes(d.seller)||!["FIXED","COST_MARKUP"].includes(d.pricingMode)||!["THB","USD","EUR"].includes(d.currency)||!units.includes(d.unit))fail("invalid pricing basis");
 for(const k of ["manufacturer","procurementChannel","quotationRef","basis"])if(!text(d[k]))fail("invalid "+k);
 for(const k of ["packageSellRate","packageMarkupPct"])if(!number(d[k]))fail("invalid "+k);
 if(!number(d.finalMarginPct)||d.finalMarginPct===null||d.finalMarginPct>=100||!number(d.primeMarkupPct)||d.primeMarkupPct===null)fail("invalid remaining project layers");
 if(!Array.isArray(d.serviceAllocations)||d.serviceAllocations.length>100||new Set(d.serviceAllocations.map(r=>r?.workLineId)).size!==d.serviceAllocations.length)fail("duplicate/invalid B allocations");
 for(const r of d.serviceAllocations){fields(r,["workLineId","treatment","basis"]);if(typeof r.workLineId!=="string"||!/^[\w.-]{1,100}$/.test(r.workLineId)||!SUPPLY_SERVICE_TREATMENTS_0550.some(([k])=>k===r.treatment)||!text(r.basis))fail("invalid B allocation");}
 return d;
}
export function supplyDraftBacklinks0550(data,workLineId){
 return data.lines.flatMap(owner=>(owner.supplyDraft?.serviceAllocations||[]).filter(r=>r.workLineId===workLineId).map(allocation=>({owner,allocation})));
}
export function deriveSupplyProposalDraft0550(data,line){
 const draft=line.supplyDraft;if(!draft)return null;
 const issues=[];
 if(draft.seller==="ADDVALUE"){
  if(!draft.manufacturer.trim()||!draft.procurementChannel.trim()||!draft.quotationRef.trim()||!draft.basis.trim())issues.push("ระบุผู้ผลิต ช่องทางจัดซื้อ เลขร่างข้อเสนอ และฐานขอบเขต");
  if((draft.pricingMode==="FIXED"&&draft.packageSellRate===null)||(draft.pricingMode==="COST_MARKUP"&&draft.packageMarkupPct===null))issues.push("ยังไม่มีฐานราคาขายแพ็กเกจใหม่");
 }
 const services=draft.serviceAllocations.map(allocation=>{
  const service=data.lines.find(l=>l.id===allocation.workLineId),activities=(data.integrationWorkspace?.activities||[]).filter(a=>a.workLineId===allocation.workLineId),problems=[];
  if(!service||!service.wbs.startsWith("B"))problems.push("ไม่พบเจ้าของงาน B เดิม — คงรหัสอ้างอิงไว้เพื่อตรวจ");
  if(allocation.treatment==="REVIEW"||!allocation.basis.trim())problems.push("ยังต้องยืนยันขอบเขตและหลักฐานการรวม/แยกงาน");
  if(!activities.length)problems.push("ยังไม่มี SI activity ผูกกับเจ้าของงานนี้");
  if(allocation.treatment==="INCLUDED"){
   if(service?.selected&&!service.coveredByLineId&&service.responsibility!=="COMPANY")problems.push("B ยังเลือกคิดเงินอยู่ — ร่างนี้ยังไม่ตัดยอด ต้องกระทบยอดก่อนใช้ราคาใหม่");
   if(supplyDraftBacklinks0550(data,allocation.workLineId).filter(x=>x.owner.id!==line.id&&x.allocation.treatment==="INCLUDED").length>0)problems.push("งาน B ถูกระบุรวมในหลายแพ็กเกจ — ตรวจเจ้าของต้นทุนครั้งเดียว");
  }
  if(allocation.treatment==="SEPARATE"&&service&&!service.selected)problems.push("B ที่จะคิดแยกยังไม่ได้เลือกใช้งาน");
  return {...allocation,service,activities,problems};
 });
 return {draft,issues,services,state:"DRAFT_ONLY",activePriceUnchanged:true};
}
