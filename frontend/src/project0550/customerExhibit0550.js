import {C1_APPENDIX_LAYOUT_0550,c1AppendixCss0550} from './data/c1Appendix0550';
import {customerExhibitWordParts0550,nativeExhibitProblems0550,nativeFormCss0550,nativeSchedule0550,NATIVE_SCHEDULE_IDS_0550} from './exhibitCNative0550';
import {zipStore} from './exportOriginalPriceForm';

const customerCss0550=`
body{margin:0;color:#000;background:#fff;font:13px/1.3 Arial,Helvetica,"Liberation Sans",sans-serif}
.p55-native-paper,.p55-c1-document{box-sizing:border-box;width:100%;max-width:1120px;min-width:0;min-height:0;margin:0 auto 20px;padding:24px;border:0;color:#000}
.p55-native-paper *,.p55-c1-document *{font-family:Arial,Helvetica,"Liberation Sans",sans-serif!important}
.p55-native-paper h2,.p55-c1-document h2{color:#000;font-size:15px}
.p55-native-paper table,.p55-c1-document table,.p55-c1-document .c1-component td{font-size:12.5px}
.p55-native-paper footer,.p55-c1-document footer{color:#000;font-size:11px}
@media print{
 .p55-native-paper,.p55-c1-document{width:auto;max-width:none;padding:0;margin:0;box-shadow:none;font-size:10.5pt;break-before:page}
 article:first-child{break-before:auto}
 .p55-native-paper table,.p55-c1-document table,.p55-c1-document .c1-component td{font-size:10pt}
 .p55-native-paper footer,.p55-c1-document footer{font-size:9pt}
}
`;

const internal=/\b(?:DRAFT|TBC|TBD|internal (?:reference|note|comment|only|use)|source costs?|SI (?:estimate|reference|equation)|working (?:preview|owners?|draft|subtotal|B5|A\/B\/C|allocation)|allocation pending|open items excluded)\b|\b(?:07 Vendor|10\.2 Working|11\.M)\b/i;
const markupEntities={'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'",'&apos;':"'",'&nbsp;':' '};
const decodeText=text=>text.replace(/&(?:amp|lt|gt|quot|#39|apos|nbsp);/g,entity=>markupEntities[entity]);
const htmlText=html=>decodeText(html.replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();
// Word can split a single word across adjacent runs. Join runs within each paragraph.
const wordText=xml=>decodeText(Array.from(xml.matchAll(/<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g),([paragraph])=>
 Array.from(paragraph.matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g),match=>match[1]).join('')).join(' '));
function textProblems(text){
 const problems=[];
 if(/\bOPEN\b|\{\{\w+\}\}|_{5,}/.test(text)||/<insert\b/i.test(text))problems.push('ยังมี OPEN หรือช่องกรอกข้อมูลในแบบฟอร์ม');
 const internalText=text.match(internal)?.[0];
 if(internalText)problems.push('พบข้อความสำหรับใช้งานภายใน · '+internalText);
 if(/[\p{Script=Thai}\p{Script=Myanmar}]/u.test(text))problems.push('พบข้อความที่ต้องจัดทำเป็นภาษาอังกฤษ');
 if(/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(text))problems.push('พบอักขระที่ Word ไม่รองรับ');
 return problems;
}

function customerDocument(body){
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>PJ2608-0550 | Exhibit C</title><style>${nativeFormCss0550}${c1AppendixCss0550}${customerCss0550}</style></head><body>${body}</body></html>`;
}

function prepareCustomerExhibit(view){
 if(!view||view.workingPreview)return {items:[{id:'11.M',problems:['ต้องใช้ Schedule allocation ที่บันทึกและทบทวนแล้ว']}]};
 const optionRecord=view.getRecord('I.A2');
 const noOptions=optionRecord.state==='REVIEWED'&&optionRecord.disposition==='NOT_APPLICABLE'&&
  !view.active.some(line=>line.wbs.startsWith('C'))&&!view.bindings.some(binding=>binding.treatment==='OPTION');
 const customerView={...view,customerVersion:true,outputLabel:'CUSTOMER VERSION',c1LayoutVersion:C1_APPENDIX_LAYOUT_0550,
  optionsAssigned:noOptions&&view.optionsAssigned===null?0:view.optionsAssigned};
 const issues=nativeExhibitProblems0550(customerView);
 const docProblems=[...view.priceProblems];
 if(!view.proposal.documentNo?.trim()||!view.proposal.revision?.trim())docProblems.push('BID_DOCUMENT_CONTROL_OPEN');
 const items=[{id:'11.M / Document Control',problems:docProblems}];
 const body=NATIVE_SCHEDULE_IDS_0550.map(id=>{
  const record=view.getRecord('I.'+id);
  const {html}=nativeSchedule0550(customerView,id);
  const problems=issues.filter(problem=>problem.startsWith(id+' / ')).map(problem=>problem.slice(id.length+3));
  if(/^C[2-8]$/.test(id)&&!view.scheduleRows(id).length&&!(record.state==='REVIEWED'&&record.disposition==='NOT_APPLICABLE')){
   problems.push('Schedule ว่าง · ต้องบันทึกและทบทวน applicability');
  }
  if(record.content?.trim()&&record.state!=='REVIEWED')problems.push('BIDDER response รอทบทวน');
  problems.push(...textProblems(htmlText(html)));
  if(!html)problems.push('ไม่มีแบบฟอร์มสำหรับแสดงผล');
  items.push({id,problems:[...new Set(problems)]});
  return html;
 }).join('');
 // Check the actual Word runs as well as HTML. Formatting can differ between
 // the two renderers when a native paragraph is split across several runs.
 const wordParts=items.every(item=>!item.problems.length)?customerExhibitWordParts0550(customerView):null;
 if(wordParts){
  const word=['word/document.xml','word/header5.xml','word/footer6.xml'].map(name=>wordText(wordParts[name])).join(' ');
  const wordProblems=textProblems(word);
  if(wordProblems.length)items.push({id:'Word',problems:wordProblems});
 }
 return {items,body,wordParts};
}

export function customerReadiness0550(view){
 const {items}=prepareCustomerExhibit(view);
 return {items,ready:items.every(item=>!item.problems.length)};
}

function readyExhibit(view,disabled){
 if(disabled)throw Error('บันทึกหรือยกเลิกการแก้ไขก่อน Export');
 const prepared=prepareCustomerExhibit(view);
 if(prepared.items.some(item=>item.problems.length))throw Error('Exhibit C ยังมีข้อมูล OPEN หรือรอทบทวน');
 return prepared;
}

export function customerHtml0550(view,disabled){
 return customerDocument(readyExhibit(view,disabled).body);
}

export function buildCustomerDocx0550(view,disabled){
 return zipStore(readyExhibit(view,disabled).wordParts);
}

export function downloadCustomerDocx0550(view,disabled){
 const bytes=buildCustomerDocx0550(view,disabled);
 const url=URL.createObjectURL(new Blob([bytes],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}));
 const link=document.createElement('a');
 link.href=url;
 link.download='PJ2608-0550_Exhibit-C_'+view.proposal.revision.replace(/[^\w.-]/g,'_')+'.docx';
 link.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}

export function printCustomer0550(view,disabled){
 const html=customerHtml0550(view,disabled);
 const frame=document.createElement('iframe');
 frame.title='Print Exhibit C';
 frame.style.cssText='position:fixed;width:1px;height:1px;right:0;bottom:0;border:0';
 frame.onload=()=>{
  const printWindow=frame.contentWindow;
  printWindow.addEventListener('afterprint',()=>frame.remove(),{once:true});
  printWindow.print();
 };
 frame.srcdoc=html;
 document.body.appendChild(frame);
}
