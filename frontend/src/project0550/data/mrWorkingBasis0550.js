import catalog from "./mrWorkingCatalog0550.json";
import form from "./customerForm0550.json";
import {policyDefaults0550} from "../bidWorkingBasis0550";

export const MR_WORKING_CATALOG_0550 = catalog;
export const MR_WORKING_VERSION = catalog.version;
const byId = new Map(catalog.rows.map(r=>[r.id,r]));
export const mrRequirement0550 = line => byId.get(line.mrRequirementId);
const codeFor = r => r.wbs === "A" ? form.rows.find(c=>c.systems.includes(r.systemToken))?.code||"" : form.rows.some(c=>c.code===r.wbs)?r.wbs:"";
export function importMrWorkingBasis0550(data,policies,today) {
 if(data.mrWorkingImport?.version===MR_WORKING_VERSION)return data;
 const next={...data,lines:[...data.lines]},importedLineIds=[],conflicts=[];
 for(const r of catalog.rows) {
  const id="REQ-"+r.id,scopeKey="MR."+r.id;
  // Preserve exact existing records, including intentional deselection/price edits.
  if(next.lines.some(l=>l.mrRequirementId===r.id))continue;
  if(next.lines.some(l=>l.id===id||l.scopeKey===scopeKey)){conflicts.push(r.id);continue;}
  const policy=policyDefaults0550(policies,["A","B5","B6","C2","C3"].includes(r.wbs)?"Goods / Procured Cost":"Professional Service")||{};
  next.lines.push({id,mrRequirementId:r.id,systemToken:r.systemToken,wbs:r.wbs,description:r.site+" · "+r.description,
   scopeKey,tagRef:r.site,requirementRef:r.reference,sourceRef:r.reference+" / "+r.note,
   vendorId:"",offerId:"",calculationId:"",resultKey:"value",quantity:r.quantity,unit:r.unit,currency:"THB",manualCost:null,
   sellMode:"DIRECT",sellRate:null,markupPct:null,marginPct:null,primePct:null,...policy,selected:r.responsibility!=="COMPANY",
   customerRowCode:codeFor(r),customerRemark:"",brand:"",responsibility:r.responsibility,scopeBasis:r.note,
   coveredByLineId:r.owner?"REQ-"+r.owner:"",coverageBasis:r.owner?r.reference+" / "+r.note:"",
   ...(["TEL-VSAT","TEL-VSAT-KU"].includes(r.systemToken)?{satelliteScope:r.responsibility==="COMPANY"?"COMPANY_SUPPLY":r.responsibility==="CLARIFICATION"?"CLARIFICATION":r.wbs==="A"?"TSI_EQUIPMENT":"TSI_SERVICES"}:{})});
  // Exact preserved tower quotation identifies both heights; use one package
  // owner instead of inventing a 30 m / 60 m price split. Other partial vendor
  // packages remain candidates until their detailed coverage is evidenced.
  const tower=next.lines.find(l=>l.id==="LINE-LEGACY-TEL-TELT-1"&&l.selected&&l.description==="Current tower supply quote anchor — 30m + 60m towers"&&l.offerId&&next.offers.some(o=>o.id===l.offerId&&o.quoteRef.includes("2609.95.1")&&o.quoteRef.includes("2609.95.2")));
  if(["MR-B1-11-APF-08","MR-B1-11-ACP-06"].includes(r.id)&&tower){const added=next.lines[next.lines.length-1];added.coveredByLineId=tower.id;added.coverageBasis="Existing quote anchor identifies 30 m + 60 m tower supply; single package price, no proportional allocation. Erection/foundation/services remain separate scope checks.";}
  importedLineIds.push(id);
 }
 next.mrWorkingImport={version:MR_WORKING_VERSION,date:today,importedLineIds,conflicts};
 return next;
}
export function mrLineScope0550(data,line) {
 const requirement=mrRequirement0550(line);
 if(!requirement)return {applicable:false,excluded:false,covered:false,problems:[],candidates:[]};
 const responsibility=line.responsibility||requirement.responsibility,problems=[];
 const basis=Boolean(line.scopeBasis?.trim()&&line.requirementRef?.trim());
 if(!basis)problems.push("MR_SCOPE_BASIS_OPEN: ระบุข้อกำหนดและฐานแบ่งขอบเขต");
 if(responsibility==="CLARIFICATION")problems.push("MR_CLARIFICATION: ยืนยันขอบเขต / หน่วย / ผู้รับผิดชอบก่อนคิดราคา");
 const excluded=responsibility==="COMPANY"&&basis;
 if(excluded)problems.push("COMPANY_SUPPLY: ไม่รวมในราคา TSI");
 const owner=data.lines.find(l=>l.id===line.coveredByLineId);
 const covered=Boolean(line.coveredByLineId&&line.coverageBasis?.trim()&&owner&&owner.id!==line.id&&owner.selected&&!owner.coveredByLineId&&owner.responsibility!=="COMPANY"&&owner.satelliteScope!=="COMPANY_SUPPLY"&&owner.wbs[0]===line.wbs[0]&&responsibility==="TSI"&&basis);
 if(line.coveredByLineId&&!covered)problems.push("MR_COVERAGE_OWNER_OPEN: เจ้าของราคาไม่มี / ไม่เลือก / วนซ้ำ / อยู่คนละ Part / ขาดหลักฐาน");
 const candidates=data.lines.filter(l=>l.id!==line.id&&!l.mrRequirementId&&l.systemToken===line.systemToken&&l.wbs[0]===line.wbs[0]&&l.selected);
 if(!covered&&!excluded&&candidates.length&&!line.coverageBasis?.trim())problems.push("MR_PACKAGE_COVERAGE_OPEN: มีราคา package เดิม ต้องระบุว่ารวมอยู่ใน owner หรือเป็นงานเพิ่มที่ไม่ซ้ำ");
 return {applicable:true,requirement,responsibility,excluded,covered,owner,problems,candidates};
}
export function mrWorkingGaps0550(data,lines) {
 if(!data.mrWorkingImport)return [];
 const gaps=[];
 for(const requirement of catalog.rows) {
  const matches=lines.filter(l=>l.mrRequirementId===requirement.id),row=matches[0];
  if(matches.length!==1){gaps.push({id:requirement.id,code:codeFor(requirement),reason:matches.length?"DUPLICATE MR REQUIREMENT":"MR REQUIREMENT MISSING"});continue;}
  if(row.mrScopeState?.excluded)continue;
  const state=row.mrScopeState;
  if(state?.covered){const owner=lines.find(l=>l.id===state.owner.id);if(state.problems.length||owner?.provisionalCustomerTHB==null)gaps.push({id:requirement.id,code:row.customerRowCode,reason:"INCLUDED OWNER PRICE / SCOPE OPEN"});}
  else if(!row.selected||row.provisionalCustomerTHB==null)gaps.push({id:requirement.id,code:row.customerRowCode,reason:!row.selected?"REQUIRED ROW NOT SELECTED":"MR QUANTITY / PRICE / SCOPE OPEN"});
 }
 return gaps;
}
