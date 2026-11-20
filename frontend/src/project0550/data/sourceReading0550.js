// Native extraction coordinates, shared by the MR and whole-corpus readers.
// Multiple extraction passes are views of the same source, not new revisions.
export function sourceReadingPasses0550(source){
 const content=source?.content||'',markers=[...content.matchAll(/\[PDF PAGE (\d+)(?:;\s*([^\]\n]*))?\]/g)],passes=[];
 let previous=0,pass;
 markers.forEach((m,i)=>{
  const number=Number(m[1]);
  const explicitPass=number===1&&i>0&&/\[NATIVE FULL-FILE TEXT PASS /.test(content.slice(markers[i-1].index+markers[i-1][0].length,m.index));
  if(!pass||(number===1&&(previous>1||explicitPass))){pass={index:passes.length,pages:[]};passes.push(pass);}
  const printed=m[2]?.match(/printed\s+(\d+)\b/i)?.[1];
  pass.pages.push({number,printed:printed?Number(printed):null,marker:m[0],start:m.index+m[0].length,end:markers[i+1]?.index??content.length,text:content.slice(m.index+m[0].length,markers[i+1]?.index??content.length)});previous=number;
 });
 return passes;
}
export function sourcePageBlocks0550(source,page,passIndex=0){
 const rows=sourceReadingPasses0550(source)[passIndex]?.pages.filter(p=>p.number===page)||[];
 if(rows.length!==1)return [];
 const p=rows[0],text=p.text,starts=[0];let offset=0;
 for(const line of text.split('\n')){if(offset&&/^(?:\s*(?:\d+\.\d+(?:\.\d+)*[\s.)]|[a-z]\)|\d+\)|[•●]|-(?:\s|$))|\s*Notes?\s*:)/i.test(line))starts.push(offset);offset+=line.length+1;}
 const points=[...new Set(starts)].sort((a,b)=>a-b),chunks=[];
 points.forEach((start,i)=>{const end=points[i+1]??text.length;for(let n=start;n<end;n+=3500)chunks.push({start:p.start+n,end:p.start+Math.min(n+3500,end)});});
 return chunks.map(b=>{const raw=source.content.slice(b.start,b.end);return {start:b.start+raw.length-raw.trimStart().length,end:b.start+raw.trimEnd().length};}).filter(b=>b.end>b.start).map(b=>({...b,excerpt:source.content.slice(b.start,b.end)}));
}
export function sourceLocatorPages0550(locator){
 const match=String(locator||'').match(/(?:physical\s+)?PDF\s*(?:pages?|p)\s*(\d+(?:\s*[-–,]\s*\d+)*)/i);
 if(!match)return [];
 const pages=[];for(const token of match[1].split(',')){const [a,b=a]=token.trim().split(/[-–]/).map(Number);if(a>0&&b>=a&&b-a<10000)for(let n=a;n<=b;n++)pages.push(n);}
 return [...new Set(pages)];
}
