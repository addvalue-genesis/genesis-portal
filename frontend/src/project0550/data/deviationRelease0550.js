import {deriveAvlReconciliation0550} from "./avlReconciliation0550";
import layout from "./deviationReleaseLayout0550.json";
import template from "./deviationReleaseTemplate0550.json";
import {zipStore} from "../exportOriginalPriceForm";
import {PAGA_AVL_BASIS_0550} from "./avlDeviationBasis0550";
export const DEVIATION_RELEASE_LAYOUT_0550=layout;
export const DEVIATION_RELEASE_FIELDS_0550=["releaseDocument","releasePageRef","purchaserRequirement","bidderClarification","bidderProposal","purchaserReply","releaseRemarks"];
export const DEVIATION_RELEASE_META_KEYS_0550=Object.keys(layout.metadata);
const text=v=>typeof v==="string"?v:"";
const esc=v=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
export const deviationReleaseMetadata0550=data=>({...layout.metadata,...data.deviationRelease});
export function deviationReleaseDefaults0550(d,requirements){
 const r=requirements.find(r=>r.id===d.requirementId),seed=d.id===PAGA_AVL_BASIS_0550.deviationId||d.avlCheckId===PAGA_AVL_BASIS_0550.avlId;
 return {releaseDocument:seed?"Exhibit A - Annex 2_1, Lists of Vendors and Subcontractors":d.contractorDocument,
  releasePageRef:seed?"PDF page 13 / printed page 11 of 12\nPAGA System":d.contractorDocument,
  purchaserRequirement:r?.statement||r?.sourceExcerpt||"",bidderClarification:"",purchaserReply:"",
  bidderProposal:seed?"Proposed PAGA manufacturer: INDUSTRONIC. Platform: INTRON-X. Offer: A20261632.":"",releaseRemarks:""};
}
const rowHeight=cells=>Math.max(60,18+Math.max(...cells.map((v,i)=>text(v).split(/\r?\n/).reduce((n,line)=>n+Math.max(1,Math.ceil(line.length/Math.max(4,layout.widths[i]*.8))),0)))*15);
export function deriveDeviationRelease0550(data,integration,selectedIds){
 const metadata=deviationReleaseMetadata0550(data),issues=[],ids=[...new Set(selectedIds)],all=integration.deviations;
 if(!ids.length)issues.push("เลือกรายการ Deviation ที่ต้องการส่งออกอย่างน้อย 1 รายการ");
 for(const [k,v] of Object.entries(metadata))if(!text(v).trim())issues.push("หัวเอกสารยังไม่ครบ: "+k);
 const records=ids.map(id=>all.find(d=>d.id===id)).filter(Boolean);
 if(records.length!==ids.length)issues.push("มีรายการที่เลือกไม่อยู่ในทะเบียนปัจจุบัน");
 const groups=[];
 const automated=records.filter(d=>d.id.startsWith("DEV-AVL-"));
 if(automated.length&&deriveAvlReconciliation0550(data,integration).referenceConflict)issues.push("ฐาน AVL เปลี่ยน/ถูกแทนที่ กรุณาทบทวนร่างก่อนส่งออก");
 for(const d of records){
  if(d.problems?.includes("STALE_DEPENDENCIES"))issues.push(d.id+": หลักฐานหรือข้อเสนอเปลี่ยน ต้องทบทวน Deviation ก่อนส่งออก");
  const defaults=deviationReleaseDefaults0550(d,integration.requirements),value=k=>text(d[k]===undefined?defaults[k]:d[k]);
  const document=value("releaseDocument");let group=groups.find(g=>g.document===document);
  if(!group){group={document,number:groups.length+1,rows:[]};groups.push(group);}
  const cells=[`${group.number}.${group.rows.length+1}`,value("releasePageRef"),value("purchaserRequirement"),value("bidderClarification"),d.vendorDeviation,value("bidderProposal"),d.justification,value("purchaserReply"),d.companyResponse,d.state==="ACCEPTED_DEVIATION"?"Closed":"Open",[value("releaseRemarks"),d.resolution,d.finalClosure].filter(Boolean).join("\n")].map(text);
  if(!document.trim()||[1,2,4,6].some(i=>!cells[i].trim()))issues.push(d.id+": ระบุ Document, Page/Clause, Requirement, Deviation และ Justification ให้ครบ");
  if(!integration.requirements.some(r=>r.id===d.requirementId))issues.push(d.id+": ยังไม่ผูก Requirement");
  if(!d.offerIds.length||d.offerIds.some(id=>!data.offers.some(o=>o.id===id)))issues.push(d.id+": ข้อเสนอที่อ้างอิงไม่ครบ");
  if(d.offerIds.some(id=>!data.lines.some(l=>l.selected&&l.systemToken===d.systemToken&&l.offerId===id)))issues.push(d.id+": ข้อเสนอที่อ้างอิงไม่ได้อยู่ในตัวเลือก Working ปัจจุบัน");
  if(d.id.startsWith("DEV-AVL-")){const a=integration.avlChecks.find(a=>a.id===d.avlCheckId);if(d.offerIds.some(id=>{const o=data.offers.find(o=>o.id===id);return o&&(o.quoteRef!==d.vendorQuoteRef||(a?.manufacturer&&o.brand?.trim()&&o.brand.trim().toUpperCase()!==a.manufacturer.trim().toUpperCase()));}))issues.push(d.id+": ยี่ห้อหรือเลขข้อเสนอเปลี่ยน กรุณาทบทวนร่าง");}
  const height=rowHeight(cells);if(height>409)issues.push(d.id+": ข้อความยาวเกินความสูงแถว Excel กรุณาย่อข้อความหรือแยกเป็นหลายรายการ");
  group.rows.push({id:d.id,cells,height});
 }
 for(const v of [...Object.values(metadata),...groups.flatMap(g=>[g.document,...g.rows.flatMap(r=>r.cells)])])if(/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(v))issues.push("ข้อความมีอักขระควบคุมที่ Excel ไม่รองรับ");
 return {metadata,groups,issues:[...new Set(issues)],count:records.length,revision:data.revision,draft:true};
}
function xmlCell(v,row,col,style){return `<x:c r="${String.fromCharCode(65+col)}${row}" s="${style}" t="inlineStr"><x:is><x:t xml:space="preserve">${esc(v)}</x:t></x:is></x:c>`;}
export function buildDeviationReleaseXlsx0550(release){
 if(release.issues.length||!release.count)throw Error(release.issues.join("\n")||"No deviations selected");
 const parts={...template.parts};let xml=parts["xl/worksheets/sheet1.xml"];
 const matches=xml.match(/<x:row r="11"[\s\S]*?<\/x:sheetData>/);if(!matches)throw Error("Deviation template row contract changed");
 let row=11,body="",merges=[];
 for(const g of release.groups){
  body+=`<x:row r="${row}" ht="36" customHeight="1">${Array.from({length:11},(_,i)=>xmlCell(i===0?g.number+".0":i===1?g.document:"",row,i,template.sectionStyles[i])).join("")}</x:row>`;merges.push(`B${row}:K${row}`);row++;
  body+=`<x:row r="${row++}" ht="6" customHeight="1"/>`;
  for(const r of g.rows){body+=`<x:row r="${row}" ht="${r.height}" customHeight="1">${r.cells.map((v,i)=>xmlCell(v,row,i,template.bodyStyles[i])).join("")}</x:row>`;row++;}
 }
 xml=xml.replace(matches[0],body+"</x:sheetData>");
 xml=xml.replace(/<x:mergeCells[^>]*>[\s\S]*?<\/x:mergeCells>/,`<x:mergeCells count="${8+merges.length}">${[...Array.from({length:5},(_,i)=>`C${i+1}:K${i+1}`),"A6:K6","A7:K7","A8:K8",...merges].map(ref=>`<x:mergeCell ref="${ref}"/>`).join("")}</x:mergeCells>`);

 DEVIATION_RELEASE_META_KEYS_0550.forEach((k,i)=>{xml=xml.replace(`{{META_${i}}}`,esc(release.metadata[k]));});
 xml=xml.replace("{{DRAFT_STATUS}}",`DRAFT - NOT ISSUED / Workspace revision ${release.revision}`);
 xml=xml.replace(/<x:dimension[^>]*\/>/,"");
 xml=xml.replace(/<x:pageMargins[^>]*\/>/g,"");
 xml=xml.replace('</x:worksheet>','<x:printOptions horizontalCentered="1"/><x:pageMargins left="0.25" right="0.25" top="0.4" bottom="0.4" header="0.15" footer="0.15"/><x:pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/><x:headerFooter><x:oddFooter>&amp;LDRAFT - NOT ISSUED&amp;RPage &amp;P of &amp;N</x:oddFooter></x:headerFooter></x:worksheet>');
 xml=xml.replace('<x:sheetViews>','<x:sheetPr><x:pageSetUpPr fitToPage="1"/></x:sheetPr><x:sheetViews>');
 parts["xl/worksheets/sheet1.xml"]=xml;
 parts["xl/workbook.xml"]=parts["xl/workbook.xml"].replace('</x:workbook>',`<x:definedNames><x:definedName name="_xlnm.Print_Area" localSheetId="0">'Deviation List'!$A$1:$K$${row-1}</x:definedName><x:definedName name="_xlnm.Print_Titles" localSheetId="0">'Deviation List'!$1:$10</x:definedName></x:definedNames></x:workbook>`);
 return zipStore(parts);
}
export function exportDeviationRelease0550(release){
 const bytes=buildDeviationReleaseXlsx0550(release),url=URL.createObjectURL(new Blob([bytes],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}));
 const a=document.createElement("a");a.href=url;a.download=`PJ2608-0550_Deviation_List_DRAFT_R${release.revision}.xlsx`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
