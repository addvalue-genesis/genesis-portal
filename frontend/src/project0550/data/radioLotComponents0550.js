// Structured per-set breakdown of an MGW radio lot. The parent offer keeps the
// only price. Remark lines stay notes. Page-spill text is merged by the caller
// before parse, using radioLotSourceText0550.
export const RADIO_GTPL_SEPARATOR_0550='\nLocation: APM\nVHF DMR Radio System GTPL\n';
export const RADIO_ACCESSORIES_SEPARATOR_0550='\nVHF DMR Radio System Accessaries MOTOROLA\n';

const qtyLine=/^~?\s*(\d+(?:\.\d+)?)\s*x\s+(.+)$/i;
const bulletLine=/^-\s+(.+)$/;
const dotLine=/^[·•]\s*(.+)$/;
const sectionLine=/^(License|Comprising|Description)\s*:\s*(.*)$/i;
const remarkLine=/^Remark\s*:\s*(.*)$/i;
const unitToken=/^(?:\d+(?:\.\d+)?(?:m|mm|kg|g|w|kw|vac|vdc|v|hz|khz|mhz|ghz)|230vac|24vdc|13\.8v|1\.95kg)$/i;
const skipParen=/^(atex|sealed|m|main|flush|optional|include|including)$/i;

export function radioLotSourceText0550(detail,{continuation,option=false,stripUnpriced=false}={}){
 let text=detail||'';
 if(stripUnpriced)text=text.split(RADIO_GTPL_SEPARATOR_0550)[0];
 if(continuation?.anchor&&text.includes(continuation.anchor))text=text.replace(continuation.anchor,continuation.text);
 if(!text.includes(RADIO_ACCESSORIES_SEPARATOR_0550))return option?'':text;
 const [base,accessories]=text.split(RADIO_ACCESSORIES_SEPARATOR_0550);
 return option?accessories||'':base;
}

const clean=line=>String(line||'').replace(/\u00a0/g,' ').replace(/[\u2010\u2011\u2012\u2013\u2014]/g,'-').replace(/\uFF0C/g,',').replace(/\uFF1A/g,':').replace(/[ \t]+/g,' ').trim();

function component(fields){
 return {
  quantity:fields.quantity??null,
  unit:fields.unit??'',
  description:fields.description||'',
  partNo:fields.partNo||'',
  group:fields.group||'',
  included:fields.included!==false,
  remarks:fields.remarks||'',
  sourceLine:fields.sourceLine||'',
 };
}

function isModelToken(token){
 return /[0-9]/.test(token)&&/[A-Za-z]/.test(token)&&/^[A-Za-z0-9][A-Za-z0-9./+-]*$/.test(token)&&!unitToken.test(token)&&token.length>=2;
}
function isSuffixToken(token){
 return /^(?:F\d+|Gen\d+)$/.test(token);
}

// The model or part number is the trailing code. A short suffix (F3, Gen10)
// stays with the code before it. Leading SAILOR / Sailor codes are used when
// the line does not end in a part number.
export function radioPartNo0550(description){
 let text=clean(description).replace(/\s*[/／]\s*$/,'').replace(/[，,：:]\s*$/,'').trim();
 const original=text;
 const paren=text.match(/^(.*)\(([^)]+)\)\s*$/);
 if(paren&&!skipParen.test(paren[2].trim())&&/[A-Z0-9]/i.test(paren[2])&&paren[2].trim().length<=40&&paren[1].trim()){
  return {description:paren[1].trim(),partNo:paren[2].trim()};
 }
 if(/OptiPlex Tower/i.test(text)){
  return {description:text.replace(/\s*OptiPlex Tower\s*$/i,'').trim(),partNo:'OptiPlex Tower'};
 }
 const tokens=text.split(' ').filter(Boolean);
 let end=tokens.length-1;
 const part=[];
 if(end>=0&&(isSuffixToken(tokens[end])||isModelToken(tokens[end]))){
  part.unshift(tokens[end]);
  end--;
  if(end>=0&&(isModelToken(tokens[end])||(/^(?:MSR|DL20|SAILOR|Sailor)$/.test(tokens[end])&&part.length))){
   part.unshift(tokens[end]);
   end--;
  }
 }else if(end>=1&&/^\d{3,5}$/.test(tokens[end])&&/^(?:SAILOR|Sailor)$/.test(tokens[end-1])){
  part.unshift(tokens[end-1],tokens[end]);
  end-=2;
 }
 let partNo=part.join(' ');
 let name=tokens.slice(0,end+1).join(' ').replace(/[，,]\s*$/,'').trim();
 if(!partNo){
  const lead=original.match(/^(SAILOR|Sailor)\s+((?:SP)?\d{3,5}[A-Z0-9]*)\b/);
  if(lead)partNo=lead[1]+' '+lead[2];
  name=original;
 }
 if(!name)return {description:original,partNo:''};
 return {description:name,partNo};
}

function isGroupHeader(line){
 return sectionLine.test(line)||remarkLine.test(line)||/^DELL PC Workstation$/i.test(line);
}

export function parseRadioLotComponents0550(detail,{defaultGroup='',defaultIncluded=true}={}){
 const components=[];
 let group=defaultGroup;
 let remarkMode=null;
 let spec=[];
 let specMode=false;
 let includeParent=null;
 const flushSpec=()=>{
  const text=spec.map(clean).filter(Boolean).join('\n').trim();
  spec=[];
  specMode=false;
  if(!text)return;
  components.push(component({
   description:'Specification',partNo:'',group:'Description',included:false,remarks:text,sourceLine:text,
  }));
 };
 const appendRemark=text=>{
  const last=components[components.length-1];
  if(!last){spec.push(text);return;}
  last.remarks=[last.remarks,text].filter(Boolean).join(' ').replace(/\s+/g,' ').trim();
 };
 const pushQty=(quantity,body,sourceLine,included)=>{
  const named=radioPartNo0550(body);
  const row=component({
   quantity,unit:'x',description:named.description,partNo:named.partNo,group,included,
   sourceLine,remarks:'',
  });
  components.push(row);
  includeParent=row;
 };
 const lines=String(detail||'').split(/\r?\n/);
 for(const raw of lines){
  const line=clean(raw);
  if(!line)continue;
  const remark=line.match(remarkLine);
  if(remark){
   flushSpec();
   if(remark[1].trim()){
    appendRemark(remark[1].trim());
    remarkMode='note';
    // The note closes the section it follows. Later equipment returns to the lot.
    group='';
   }else{remarkMode='excluded';group='Remark';}
   continue;
  }
  const section=line.match(sectionLine);
  if(section){
   flushSpec();
   remarkMode=null;
   const name=section[1].toLowerCase();
   if(name==='description'){specMode=true;group='Description';if(section[2].trim())spec.push(section[2].trim());}
   else group=name==='license'?'License':name==='comprising'?'Comprising':section[1];
   continue;
  }
  if(/^DELL PC Workstation$/i.test(line)){flushSpec();remarkMode=null;group='DELL PC Workstation';continue;}
  // A repeated model label between included lines is not its own priced row.
  if(/^(?:SAILOR|Sailor)\s+[A-Z0-9-]{2,16}$/.test(line)){
   if(includeParent)includeParent.remarks=[includeParent.remarks,line].filter(Boolean).join(' ').trim();
   continue;
  }
  const counted=line.match(qtyLine);
  if(counted){
   flushSpec();
   const excluded=remarkMode==='excluded'||defaultIncluded===false;
   if(remarkMode==='note')remarkMode=null;
   pushQty(Number(counted[1]),counted[2],line,!excluded);
   continue;
  }
  const bullet=line.match(bulletLine);
  if(bullet){
   flushSpec();
   const named=radioPartNo0550(bullet[1]);
   const included=remarkMode==='excluded'||defaultIncluded===false?false:true;
   components.push(component({
    quantity:null,unit:'',description:named.description,partNo:named.partNo,
    group:includeParent?.description||group,included,sourceLine:line,
   }));
   continue;
  }
  if(specMode||dotLine.test(line)||(!components.length&&!isGroupHeader(line))){
   specMode=true;
   spec.push(line.replace(/^[·•]\s*/,''));
   continue;
  }
  if(/^Location\s*:/i.test(line)||/^Etc\.?$/i.test(line)||/^[a-z(]/.test(line)){
   appendRemark(line);
   continue;
  }
  appendRemark(line);
 }
 flushSpec();
 return components;
}

// Display rows for a priced radio lot. Quantity may scale by the lot count.
// Amounts stay null so a schedule cannot add them to the lot price.
export function offerWithoutRadioComponents0550(offer){
 if(!offer||!Object.hasOwn(offer,'components'))return offer||null;
 const {components,...price}=offer;
 return price;
}
export function radioLotIncludedLines0550(offer,lotQuantity){
 if(!offer?.components?.length)return [];
 const sets=Number.isFinite(lotQuantity)&&lotQuantity>0?lotQuantity:1;
 return offer.components.map(component=>{
  const remark=component.included===false;
  const perSet=Number.isFinite(component.quantity)?component.quantity:null;
  return {
   description:[component.description,component.partNo].filter(Boolean).join(' · '),
   partNo:component.partNo||'',
   quantity:!remark&&perSet!=null?perSet*sets:perSet,
   unit:component.unit||'',
   unitPrice:null,
   amount:null,
   exportPrice:false,
   nonAdditive:true,
   included:component.included!==false,
   note:[remark?'Remark':'Included in lot',component.group,component.remarks].filter(Boolean).join(' · '),
  };
 });
}
