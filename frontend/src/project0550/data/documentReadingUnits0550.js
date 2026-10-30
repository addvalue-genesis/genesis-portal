// Native review coverage must not invent PDF page counts for Word/Excel/email.
export function documentReadingUnits0550(source){
 const title=source?.title||"",content=source?.content||"";
 if(/\.xlsx?\s*$/i.test(title)){
  const names=[...content.matchAll(/\[SHEET ([^;\]\n]+)/g)].map(m=>m[1].trim());
  return {kind:"SHEET",units:[...new Set(names)].map((name,i)=>({number:i+1,label:name}))};
 }
 if(source?.provider==="GMAIL"||/\.(?:docx?|msg)\s*$/i.test(title)||/\bMSG\s*$/i.test(title)){
  const blocks=content.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
  return {kind:"TEXT_BLOCK",units:blocks.map((s,i)=>({number:i+1,label:s.slice(0,120)}))};
 }
 if(/\.(?:zip|rar)\s*$/i.test(title)){
  const names=[...content.matchAll(/^\[ARCHIVE MEMBER\] (.+)$/gm)].map(m=>m[1]);
  return {kind:"ARCHIVE_MEMBER",units:names.map((name,i)=>({number:i+1,label:name}))};
 }
 return {kind:"PDF_PAGE",units:[]};
}
