/**
 * PJ2608-0553 / 10.3.3 — Export WORKING DRAFT into an ORIGINAL native .xlsx
 * supplied via local browser file picker.  No template is checked into GitHub,
 * no upload or network request occurs. Sheets/merges are retained; exported layout is fitted.
 *
 * 10.1 -> 10.3.3: four GROUPED MR lines within original Part A rows 8..11.
 * 10.2 -> 10.3.3: B1..B14 Working Sell and B10/B11/B13 Annex detail.
 * C1/C2: item descriptions/qty only, because direct cost+30% is unverified.
 * RELEASE is always HOLD; this export is INTERNAL / NOT FOR CUSTOMER SUBMISSION.
 *
 * ZIP archive parts are copied unchanged except specified worksheet XML cell
 * values and presentation styles/sizes. No dependency addition or price change.
 */
const SHEETS_0553=Object.freeze([
 "Scope of supply","B10 CommSpares","B11 SpecialTool",
 "B13 Consumerables","C1 CapitalSpares","C2 2Y-Spares"
]);
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const u16=(v,o)=>v.getUint16(o,true),u32=(v,o)=>v.getUint32(o,true);
const set16=(v,o,x)=>v.setUint16(o,x,true),set32=(v,o,x)=>v.setUint32(o,x>>>0,true);
const encode=new TextEncoder(),decode=new TextDecoder();
function crc32(bytes){
 let c=0xFFFFFFFF;
 for(const b of bytes){c^=b;for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xEDB88320:0);}
 return (c^0xFFFFFFFF)>>>0;
}
const combine=parts=>{
 const n=parts.reduce((s,x)=>s+x.length,0),all=new Uint8Array(n);
 let at=0;for(const p of parts){all.set(p,at);at+=p.length;}return all;
};
export function entriesFromZip(bytes){
 if(bytes.length<22||bytes.length>25_000_000)throw Error("Expected original .xlsx size within 25 MB");
 const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 let end=-1;
 for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--){
  if(u32(v,i)===0x06054b50){end=i;break;}
 }
 if(end<0)throw Error("Invalid XLSX ZIP ending");
 const count=u16(v,end+10),start=u32(v,end+16);
 if(count<8||count>3000||start>=bytes.length)throw Error("Unsupported XLSX ZIP directory");
 const out=[];let pos=start;
 for(let i=0;i<count;i++){
  if(pos+46>bytes.length||u32(v,pos)!==0x02014b50)throw Error("Invalid ZIP central directory");
  const n=u16(v,pos+28),ex=u16(v,pos+30),comment=u16(v,pos+32);
  const length=46+n+ex+comment,offset=u32(v,pos+42);
  const name=decode.decode(bytes.slice(pos+46,pos+46+n));
  const compressedSize=u32(v,pos+20),rawSize=u32(v,pos+24);
  if(offset+30>bytes.length||u32(v,offset)!==0x04034b50)throw Error("Invalid ZIP entry local header "+name);
  const ln=u16(v,offset+26),le=u16(v,offset+28),begin=offset+30+ln+le;
  if(begin+compressedSize>bytes.length)throw Error("Corrupted entry "+name);
  out.push({name,central:bytes.slice(pos,pos+length),local:bytes.slice(offset,begin),
   compressed:bytes.slice(begin,begin+compressedSize),method:u16(v,pos+10),
   rawSize,crc:u32(v,pos+16),flags:u16(v,pos+8)});
  pos+=length;
 }
 return out;
}
export async function readEntry(entry){
 if(entry.method===0)return entry.compressed;
 if(entry.method!==8)throw Error("Unsupported source compression "+entry.name);
 if(typeof DecompressionStream!=="function")throw Error("Native XLSX export needs Chromium with DecompressionStream");
 const stream=new Blob([entry.compressed]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
 const data=new Uint8Array(await new Response(stream).arrayBuffer());
 if(data.length!==entry.rawSize)throw Error("Invalid ZIP original size in "+entry.name);
 return data;
}
function encodeExcelText(text){
 return String(text).replace(/&/g,"&amp;").replace(/</g,"&lt;")
  .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
}
// Excel writers may use a default namespace or an explicit x:/ns0: prefix.
// Canonicalize only SpreadsheetML elements, preserving relationship namespaces.
function normalizeSpreadsheetXml0553(xml){
 const ns="http://schemas.openxmlformats.org/spreadsheetml/2006/main";
 const root=xml.match(/<(?!\?)[A-Za-z_][^>]*>/)?.[0];
 if(!root)throw Error("Missing SpreadsheetML root");
 const aliases=[...root.matchAll(/xmlns:([\w.-]+)="([^"]*)"/g)].filter(x=>x[2]===ns).map(x=>x[1]);
 for(const alias of aliases){
  const escaped=alias.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  xml=xml.replace(new RegExp('(<\\/?)'+escaped+':(?=[A-Za-z_])','g'),'$1');
 }
 if(aliases.length&&!/\bxmlns="/.test(root))xml=xml.replace(/<(?!\?)[A-Za-z_][^>]*>/,tag=>tag.replace(/>$/,' xmlns="'+ns+'">'));
 return xml.replace(/<[^>]*>/g,tag=>tag.replace(/\s+\/>$/,"/>"));
}
function replaceCell(xml,address,value){
 if(!/^[A-J][1-9][0-9]*$/.test(address))throw Error("Illegal destination "+address);
 if(typeof value!=="string"&&!(typeof value==="number"&&Number.isFinite(value)))
  throw Error("Invalid cell value "+address);
 // Stop before a self-closing slash. A greedy opening tag can consume the
 // next cell through its </c>, silently deleting intervening styled cells.
 const cellPattern=new RegExp('(<c\\b[^>]*\\br="'+address+'"[^>]*?)(?:\\s*/>|>([\\s\\S]*?)</c>)');
 const match=xml.match(cellPattern);
 if(!match)throw Error("Customer source does not have expected styled cell "+address);
 const nameAndStyle=match[1].replace(/\s+t="[^"]*"/g,"").replace(/\/\s*$/,"");
 if(/<f(?:\s|>)/.test(match[2]||""))throw Error("Refusing to overwrite formula "+address);
 const isText=typeof value==="string",start=nameAndStyle+(isText?' t="inlineStr"':'')+">";
 const contents=isText?'<is><t xml:space="preserve">'+encodeExcelText(value)+'</t></is>':
  "<v>"+value+"</v>";
 return xml.replace(match[0],start+contents+"</c>");
}
export function rebuildZip(entries,changes){
 const localParts=[],centralParts=[];let offset=0;
 for(const e of entries){
  const uncompressed=changes.get(e.name);
  const data=uncompressed||e.compressed;
  const method=uncompressed?0:e.method,originalSize=uncompressed?data.length:e.rawSize;
  const crc=uncompressed?crc32(data):e.crc;
  const local=e.local.slice(),cv=new DataView(local.buffer);
  set16(cv,6,e.flags&~8);set16(cv,8,method);
  set32(cv,14,crc);set32(cv,18,data.length);set32(cv,22,originalSize);
  const central=e.central.slice(),dv=new DataView(central.buffer);
  set16(dv,8,e.flags&~8);set16(dv,10,method);
  set32(dv,16,crc);set32(dv,20,data.length);set32(dv,24,originalSize);
  set32(dv,42,offset);
  localParts.push(local,data);centralParts.push(central);
  offset+=local.length+data.length;
 }
 const central=combine(centralParts);
 const end=new Uint8Array(22),e=new DataView(end.buffer);
 set32(e,0,0x06054b50);set16(e,8,entries.length);set16(e,10,entries.length);
 set32(e,12,central.length);set32(e,16,offset);
 return combine([...localParts,central,end]);
}
function write(writes,cell,value){
 // Empty strings are intentional clears of superseded native Annex cells.
 if(value===null||value===undefined)return;
 if(writes.has(cell))throw Error("Duplicate native mapping "+cell);
 writes.set(cell,value);
}
// Check the completed summary, not just successful ZIP creation or spare annexes.
// A partially filled customer template must never be reported as a full export.
export function assertNativeScopeSummary0553(xml,{a,b,total,unpricedText,sharedXml=""}){
 const unescape=s=>s.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,"&");
 const textOf=s=>unescape([...s.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map(x=>x[1]).join(""));
 const shared=[...sharedXml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map(x=>textOf(x[1]));
 const cell=address=>{
  const match=xml.match(new RegExp('<c\\b[^>]*\\br="'+address+'"[^>]*?(?:/>|>([\\s\\S]*?)</c>)'));
  if(!match)return null;
  const value=(match[1]||"").match(/<v>([^<]*)<\/v>/)?.[1];
  if(/\bt="s"/.test(match[0]))return shared[Number(value)]??null;
  if(/\bt="inlineStr"/.test(match[0]))return textOf(match[1]||"");
  return value===undefined?null:Number(value);
 };
 const requireCell=(address,expected)=>{
  if(cell(address)!==expected)throw Error("Incomplete native A/B summary: "+address+" does not match Release");
 };
 if(a?.length!==4||b?.length!==14)throw Error("Incomplete native A/B source: expected A1–A4 and B1–B14");
 for(const [items,prefix,start] of [[a,"A",8],[b,"B",24]])items.forEach((item,i)=>{
  if(item.code!==prefix+(i+1))throw Error("Incomplete native A/B source: missing or reordered "+prefix+(i+1));
  const row=start+i;
  requireCell("A"+row,item.code);requireCell("E"+row,1);
  const desc=cell((prefix==="A"?"C":"B")+row);
  if(typeof desc!=="string"||!desc.trim()||/^xxx$/i.test(desc.trim()))throw Error("Incomplete native A/B description: "+item.code);
  if(prefix==="A"){
   requireCell("B"+row,item.mr);requireCell("C"+row,item.description);
   if(typeof cell("D"+row)!=="string"||!cell("D"+row).trim())throw Error("Incomplete native A locations: "+item.code);
  }
  const price=Number.isFinite(item.amount)?round(item.amount):(item.priceText||item.offerTreatment?.priceText||unpricedText);
  requireCell("F"+row,price);requireCell("G"+row,price);
 });
 // Spare-only workbooks also omit G38; reject that even when all annexes pass.
 const sum=round([...a,...b].reduce((n,x)=>n+(Number.isFinite(x.amount)?x.amount:0),0));
 if(round(total)!==sum)throw Error("Native A+B total does not reconcile to source rows (Part C excluded)");
 requireCell("G38",sum);
 for(let row=12;row<=22;row++)for(const col of "ABCDEFG"){
  const value=cell(col+row);
  if(value!==null&&value!=="")throw Error("Stale Part A template row: "+col+row);
 }
 return {partARows:a.length,partBRows:b.length,total:sum};
}
// Owner-requested Release export layout. Original values, formulas, merges,
// borders, fills and unrelated ZIP parts are retained; body styles are cloned.
function fitNativeReleaseLayout0553(stylesXml,sharedXml,sheets,warnings){
 const attr=(tag,key)=>tag.match(new RegExp('\\b'+key+'="([^"]*)"'))?.[1];
 const setAttr=(tag,key,value)=>{
  const re=new RegExp('\\s'+key+'="[^"]*"');
  return re.test(tag)?tag.replace(re,' '+key+'="'+value+'"'):tag.replace(/\s*\/?>$/,end=>' '+key+'="'+value+'"'+end);
 };
 const section=(xml,name)=>xml.match(new RegExp('<'+name+'\\b[^>]*>([\\s\\S]*?)</'+name+'>'));
 const fontsSection=section(stylesXml,'fonts'),stylesSection=section(stylesXml,'cellXfs');
 if(!fontsSection||!stylesSection)throw Error('Native workbook has no usable font/cell styles');
 const fonts=fontsSection[1].match(/<font\b[^>]*>[\s\S]*?<\/font>/g)||[];
 const styles=stylesSection[1].match(/<xf\b[^>]*?(?:\/>|>[\s\S]*?<\/xf>)/g)||[];
 const fontCache=new Map(),styleCache=new Map();
 const formats=[...stylesXml.matchAll(/<numFmt\b[^>]*numFmtId="(\d+)"[^>]*formatCode="([^"]*)"[^>]*\/>/g)];
 const unitFormat=formats.find(x=>x[2]==="#,##0.00##");
 const unitFormatId=unitFormat?Number(unitFormat[1]):Math.max(164,...formats.map(x=>Number(x[1])))+1;
 let usesUnitFormat=false;
 const fittedStyle=(id,numeric,header,total=false,unit=false)=>{
  const key=id+':'+numeric+':'+header+':'+total+':'+unit;if(styleCache.has(key))return styleCache.get(key);
  let xf=styles[id];if(!xf)throw Error('Invalid native cell style '+id);
  const fontId=Number(attr(xf,'fontId')||0);
  if(!fontCache.has(fontId)){
   let font=fonts[fontId];if(!font)throw Error('Invalid native font '+fontId);
   font=font.replace(/<sz\b[^>]*\/>/g,'').replace(/<name\b[^>]*\/>/g,'').replace(/<scheme\b[^>]*\/>/g,'')
    .replace('</font>','<sz val="10"/><name val="Arial"/></font>');
   let next=fonts.indexOf(font);if(next<0){next=fonts.length;fonts.push(font);}fontCache.set(fontId,next);
  }
  xf=xf.replace(/^<xf\b[^>]*>/,tag=>setAttr(setAttr(setAttr(tag,'fontId',fontCache.get(fontId)),'applyFont',1),'applyAlignment',1));
  if(total)xf=xf.replace(/^<xf\b[^>]*>/,tag=>setAttr(setAttr(tag,'numFmtId',4),'applyNumberFormat',1));
  if(unit){usesUnitFormat=true;xf=xf.replace(/^<xf\b[^>]*>/,tag=>setAttr(setAttr(tag,'numFmtId',unitFormatId),'applyNumberFormat',1));}
  if(xf.endsWith('/>'))xf=xf.slice(0,-2)+'></xf>';
  xf=xf.replace(/<alignment\b[^>]*?(?:\/>|>[\s\S]*?<\/alignment>)/g,'');
  xf=xf.replace('</xf>','<alignment horizontal="'+(header?'center':numeric?'right':'left')+'" vertical="'+(header?'center':'top')+'" wrapText="'+(numeric?0:1)+'"/></xf>');
  let next=styles.indexOf(xf);if(next<0){next=styles.length;styles.push(xf);}styleCache.set(key,next);return next;
 };
 const unescape=s=>s.replace(/&#(x[0-9a-f]+|\d+);/gi,(_,n)=>String.fromCodePoint(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n)))
  .replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&');
 const textOf=xml=>[...xml.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map(x=>unescape(x[1])).join('');
 const shared=[...(sharedXml||'').matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map(x=>textOf(x[1]));
 const column=letters=>[...letters].reduce((n,c)=>n*26+c.charCodeAt(0)-64,0);
 // Conservative Arial 10 metrics at 96dpi, including wide glyphs and long TAGs.
 const pixels=s=>[...s].reduce((n,c)=>n+(/[^\x00-\x7f]/.test(c)?14:/[MW@%]/.test(c)?12:/[A-Z0-9]/.test(c)?8:/[il.,:;'!| ]/.test(c)?4:7),0);
 const linesFor=(text,width)=>text.split(/\r?\n/).reduce((total,line)=>{
  let lines=1,used=0;
  for(const token of line.split(/(\s+)/).filter(Boolean)){
   const w=pixels(token);if(used&&used+w>width){lines++;used=0;}
   if(w>width){const full=Math.ceil(w/width);lines+=full-1;used=w-(full-1)*width;}else used+=w;
  }
  return total+lines;
 },0);
 const output=new Map();
 for(const [name,input] of sheets){
  const main=/sheet1\.xml$/.test(name),last=main?8:/sheet[56]\.xml$/.test(name)?10:9;
  let xml=input;
  const originalCols=xml.match(/<cols\b[^>]*>([\s\S]*?)<\/cols>/);
  if(!originalCols)throw Error('Native worksheet has no column widths: '+name);
  const cols=originalCols[1].match(/<col\b[^>]*\/>/g)||[];
  const widths=Array.from({length:last},(_,i)=>{
   const old=cols.find(c=>Number(attr(c,'min'))<=i+1&&Number(attr(c,'max'))>=i+1);
   return Number(old&&attr(old,'width')||8.43);
  });
  const merges=new Map();
  for(const m of xml.matchAll(/<mergeCell\b[^>]*ref="([A-Z]+)(\d+):([A-Z]+)(\d+)"[^>]*\/>/g))
   merges.set(m[1]+m[2],{end:column(m[3]),rowspan:Number(m[4])-Number(m[2])+1});
  xml=xml.replace(/<row\b[^>]*?(?:\/>|>[\s\S]*?<\/row>)/g,row=>{
   const r=Number(attr(row,'r')),header=r===4||r===5;
   const body=main?r>=8&&r<=43&&![23,39,40].includes(r):r>=6&&r<=21;
   if(!header&&!body)return row;
   let height=Number(attr(row.match(/^<row\b[^>]*>/)[0],'ht')||15),touched=false;
   row=row.replace(/<c\b[^>]*?(?:\/>|>[\s\S]*?<\/c>)/g,cell=>{
    const opening=cell.match(/^<c\b[^>]*>/)[0],address=attr(opening,'r'),col=column(address?.match(/^[A-Z]+/)?.[0]||'A');
    if(col>last||(!main&&col<2))return cell;
    const type=attr(opening,'t'),v=cell.match(/<v>([\s\S]*?)<\/v>/)?.[1];
    const text=type==='s'?shared[Number(v)]||'':type==='inlineStr'?textOf(cell):v||'';
    if(!text&&!/<f\b/.test(cell))return cell;
    const numeric=!['s','inlineStr','str'].includes(type)&&v!==undefined&&Number.isFinite(Number(v));
    const id=fittedStyle(Number(attr(opening,'s')||0),numeric,header,
     numeric&&(main?[6,7].includes(col):col===9),!main&&col===8&&numeric);
    cell=cell.replace(opening,setAttr(opening,'s',id));touched=true;
    const merge=merges.get(address);
    if(!merge||merge.rowspan===1){
     const width=widths.slice(col-1,merge?.end||col).reduce((n,w)=>n+w*7+5,0)-12;
     const needed=numeric?20:linesFor(text,Math.max(width,20))*14+6;
     if(needed>409)warnings.push(name+' '+address+': text exceeds Excel maximum row height; review this cell before issue');
     height=Math.max(height,Math.min(409,needed));
    }
    return cell;
   });
   if(touched)row=row.replace(/^<row\b[^>]*>/,tag=>setAttr(setAttr(tag,'ht',height),'customHeight',1));
   return row;
  });
  output.set(name,xml);
 }
 const replaceSection=(xml,name,items)=>xml.replace(new RegExp('<'+name+'\\b[^>]*>[\\s\\S]*?</'+name+'>'),'<'+name+' count="'+items.length+'">'+items.join('')+'</'+name+'>');
 if(usesUnitFormat&&!unitFormat){
  const format='<numFmt numFmtId="'+unitFormatId+'" formatCode="#,##0.00##"/>';
  if(/<numFmts\b[^>]*>/.test(stylesXml))stylesXml=stylesXml.replace(/<numFmts\b[^>]*>([\s\S]*?)<\/numFmts>/,(_,body)=>'<numFmts count="'+(formats.length+1)+'">'+body+format+'</numFmts>');
  else stylesXml=stylesXml.replace(/(<styleSheet\b[^>]*>)/,'$1<numFmts count="1">'+format+'</numFmts>');
 }
 return {sheets:output,stylesXml:replaceSection(replaceSection(stylesXml,'fonts',fonts),'cellXfs',styles)};
}

/**
 * @returns {{blob:Blob,filename:string,warnings:string[],mappedCells:number}}
 */
export async function buildNativeWorkingDraft0553(file,model){
 if(!file||!/\.xlsx$/i.test(file.name||""))throw Error("Select the original 4-Scope of Supply.xlsx");
 const input=new Uint8Array(await file.arrayBuffer()),entries=entriesFromZip(input);
 const names=new Set(entries.map(e=>e.name));
 const wb=entries.find(e=>e.name==="xl/workbook.xml");
 if(!wb)throw Error("Missing native workbook.xml");
 const workbook=decode.decode(await readEntry(wb));
 if(!SHEETS_0553.every(name=>workbook.includes('name="'+name+'"')))
  throw Error("Uploaded workbook sheet names do not match the six original customer sheets");
 const sourceXml=new Map();
 for(let i=1;i<=6;i++){
  const entryName="xl/worksheets/sheet"+i+".xml";
  if(!names.has(entryName))throw Error("Original worksheet missing: "+entryName);
  sourceXml.set(entryName,normalizeSpreadsheetXml0553(decode.decode(await readEntry(entries.find(e=>e.name===entryName)))));
 }
 const sharedEntry=entries.find(e=>e.name==="xl/sharedStrings.xml");
 const sharedXml=sharedEntry?normalizeSpreadsheetXml0553(decode.decode(await readEntry(sharedEntry))):"";
 const textRuns=xml=>[...xml.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map(x=>x[1]).join("");
 const sharedStrings=[...sharedXml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map(x=>textRuns(x[1]));
 const sourceText=address=>{
  const cell=sourceXml.get("xl/worksheets/sheet1.xml").match(new RegExp('<c\\b[^>]*r="'+address+'"[^>]*?>[\\s\\S]*?</c>'))?.[0]||"";
  const text=/\bt="s"/.test(cell)?sharedStrings[Number(cell.match(/<v>(\d+)<\/v>/)?.[1])]||"":textRuns(cell);
  return text.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,"&");
 };
 const warnings=["WORKING DRAFT ONLY — NOT RELEASED / NOT FOR CUSTOMER SUBMISSION"];
 const writes=new Map();
 const scope=new Map();
 for(let i=0;i<4;i++){
  const row=8+i,group=model.a[i];
  if(!group||group.code!=="A"+(i+1))throw Error("Part A source group order mismatch");
  const sum=group.previewSellTHB;
  if(!Number.isFinite(sum))warnings.push(group.code+" has no working price");
  write(scope,"A"+row,group.code);
  write(scope,"B"+row,group.mr);
  write(scope,"C"+row,group.description);
  write(scope,"D"+row,"Locations: "+([...new Set(group.sourceRows.map(x=>x.site).filter(Boolean))].join(", ")||"TBC"));
  write(scope,"E"+row,1);
  write(scope,"F"+row,Number.isFinite(sum)?round(sum):"NOT ESTABLISHED");
  write(scope,"G"+row,Number.isFinite(sum)?round(sum):"NOT ESTABLISHED");
 }
 // Reusing a previously filled template must not keep old equipment/quantities.
 for(let row=12;row<=22;row++)for(const col of "ABCDEFG"){
  const address=col+row;
  if(new RegExp('<c\\b[^>]*\\br="'+address+'"').test(sourceXml.get("xl/worksheets/sheet1.xml")))write(scope,address,"");
 }
 const bc=model.b||[];
 for(let i=1;i<=14;i++){
  const row=23+i,b=bc.find(x=>x.code==="B"+i),price=b?.customerSellTHB;
  write(scope,"A"+row,"B"+i);write(scope,"E"+row,1);
  if(!Number.isFinite(price)){
   const text=b?.offerTreatment?.priceText||"NOT ESTABLISHED";
   if(b?.offerTreatment?.status!=="NOT_QUOTED_EXCLUDED")warnings.push("B"+i+" price NOT ESTABLISHED");
   write(scope,"F"+row,text);write(scope,"G"+row,text);
   continue;
  }
  write(scope,"F"+row,round(price)); // B10/B11/B13 current Annex working unit LS must replace original stale F value too.
  write(scope,"G"+row,round(price));
 }
 // Current commercial wording comes from the same B6 source as Working/Release.
 // The original template remains unchanged; do not re-export its superseded DDP heading.
 for(const line of bc){
  const cell="B"+(23+Number(line.code.slice(1)));
  const original=sourceText(cell).split(/\r?\n(?:Activities:|Included (?:SAT|Yard support):)/)[0]||line.description;
  const heading=line.offerTreatment||line.code==="B6"?line.description:original;
  const notes=[line.offerTreatment?.remark,line.executionActivities?.releaseText?"Activities: "+line.executionActivities.releaseText:null,line.serviceCommercialBasis?.compactText].filter(Boolean);
  write(scope,cell,[heading,...notes].filter(Boolean).join("\n"));
 }
 const a=model.summary?.aProvisionalCustomerSellTHB,b=model.summary?.bProvisionalCustomerSellTHB;
 for(const [code,row] of [["C1",41],["C2",42]]){
  const option=model.c?.find(x=>x.code===code),items=model.budgetaryOptionAnnex?.[code];
  const offered=option?.budgetaryOfferPrepared===true;
  if(offered&&(!items?.length||option.budgetaryOfferStatus!=="CONDITIONAL_BUDGETARY_OFFER"||
    option.customerOfferIssued!==false||Number.isFinite(option.customerSellTHB)||
    round(items.reduce((sum,x)=>sum+x.extendedTHB,0))!==option.budgetaryOptionOfferTHB||
    items.some(x=>round(x.quantity*x.unitPriceTHB)!==x.extendedTHB)))
   throw Error(code+" conditional option source arithmetic/approval mismatch");
  write(scope,"F"+row,offered?option.budgetaryOptionOfferTHB:"NOT QUOTED");
  write(scope,"G"+row,offered?option.budgetaryOptionOfferTHB:"NOT QUOTED");
  if(offered){
   write(scope,"B"+row,option.description+"\nCONDITIONAL BUDGETARY OFFER (THB) — excluded from A+B");
   write(scope,"H"+row,"OEM SKU/Qty, B10 exclusion and proposed CIF Zhuhai subject to confirmation; original DDP terms require buyer approval.");
  }
 }
 const complete=model.sourceCoverage?.aReady===true&&model.sourceCoverage?.bSellReady===true;
 const priced=[a,b].filter(Number.isFinite);
 const unpricedB=bc.filter(r=>!Number.isFinite(r.customerSellTHB)&&r.offerTreatment?.status!=="NOT_QUOTED_EXCLUDED").map(r=>r.code).join(", ");
 const excludedB=bc.filter(r=>r.offerTreatment?.status==="NOT_QUOTED_EXCLUDED").map(r=>r.code).join(", ");
 write(scope,"A38","Total 合计 / A+B — priced items (THB)"+
  (excludedB?"\nNot quoted / excluded: "+excludedB+".":"")+
  (complete?"":"\nExcludes unpriced items"+(unpricedB?": "+unpricedB:"")+"."));
 write(scope,"G38",priced.length?round(priced.reduce((sum,n)=>sum+n,0)):"NOT ESTABLISHED");
 write(scope,"H38","WORKING DRAFT");
 if(!complete)warnings.push("A+B NOT COMPLETE: priced subtotal only; mandatory items/confirmed supplier evidence pending");
 if(model.sourceCoverage?.aOverflow)warnings.push("Original has 15 A TAG slots; 4 grouped MR lines require buyer acceptance before final submission");
 if(!model.sourceCoverage?.aReady)warnings.push("Part A Working equipment cost/TAG evidence still incomplete");
 const changes=new Map();
 let count=0;
 const replaceAll=(sheetName,map)=>{
  let xml=sourceXml.get(sheetName);
  for(const [cell,val] of map){xml=replaceCell(xml,cell,val);count++;}
  changes.set(sheetName,encode.encode(xml));
 };
 replaceAll("xl/worksheets/sheet1.xml",scope);
 const annexCodes=["B10","B11","B13","C1","C2"];
 for(let i=0;i<annexCodes.length;i++){
  const code=annexCodes[i],option=model.c?.find(x=>x.code===code);
  const offered=option?.budgetaryOfferPrepared===true;
  const detail=offered?model.budgetaryOptionAnnex[code].map(x=>({
   sourceId:x.sourceId,historicalSourceId:x.historicalSourceId,
   tagNo:code==="C2"?"Two-year operating stock / TAG by OEM":x.tag,
   description:x.description,specification:x.specification,materials:x.materials,
   qty:x.quantity,customerUnitTHB:x.unitPriceTHB,customerTotalTHB:x.extendedTHB,
   leadTimeARO:x.leadTime||"OEM confirmation required"
  })):model.annex?.[code]||[],audit=model.annexModels?.[code];
  const rows=new Map();
  if(detail.length>13)throw Error(code+" exceeds 13 physical rows in original. Cannot export without layout changes.");
  // The 12 historical C2 price rows are distinct from the 4 current MR parents.
  const routeTrace=offered?null:model.annexTraceAudit?.rowTrace?.filter(x=>x.code===code)||null;
  if(routeTrace&&routeTrace.length!==detail.length)
   throw Error(code+" native export diverged from bidirectional Source/Release line count");
  // Overwrite every original customer Annex cell so a previously filled
  // workbook cannot leak stale Rev08 Qty/prices into the working draft.
  for(let j=detail.length;j<13;j++){
   const row=j+6;
   for(const col of ["B","C","D","E","F","G","H","I"])write(rows,col+row,"");
   if(code.startsWith("C"))write(rows,"J"+row,"");
  }
  detail.forEach((r,j)=>{
   const row=j+6;
   if(r.nativeRow!==undefined&&r.nativeRow!==row)
    throw Error(code+" native row changed: "+r.sourceId);
   if(r.nativeSheet&&r.nativeSheet!==SHEETS_0553[i+1])
    throw Error(code+" native worksheet/source row mismatch: "+r.sourceId);
   if(r.nativeCells&&Object.entries({tagNo:"C",description:"D",specification:"E",
    materials:"F",qty:"G",unitPrice:"H",totalPrice:"I"}).some(([key,col])=>r.nativeCells[key]!==col+row))
    throw Error(code+" native cell mapping changed: "+r.sourceId);
   if(routeTrace&&(!routeTrace[j]||routeTrace[j].sourceId!==r.sourceId||
      routeTrace[j].nativeRow!==row||
      routeTrace[j].sourceModuleId!==r.sourceRowModuleId||
      routeTrace[j].workingTotalTHB!==r.workingTotalTHB))
    throw Error(code+" RELEASE→SOURCE→NATIVE mismatch: "+r.sourceId);
   write(rows,"B"+row,j+1);
   // Native customer worksheet retains ALL original candidate TAG references.
   // Count/expand is a browser UI presentation and cannot fit the frozen template.
   write(rows,"C"+row,r.tagNo||"COMMON");
   write(rows,"D"+row,r.description||"");
   write(rows,"E"+row,r.specification||"");
   write(rows,"F"+row,r.materials||"");
   write(rows,"G"+row,Number.isFinite(r.qty)?r.qty:"TBC — OEM SPIR");
   if(code.startsWith("B")||offered){
    write(rows,"H"+row,Number.isFinite(r.customerUnitTHB)?r.customerUnitTHB:"NOT ESTABLISHED");
    write(rows,"I"+row,Number.isFinite(r.customerTotalTHB)?round(r.customerTotalTHB):"NOT ESTABLISHED");
   }
   if(code.startsWith("C")){
    if(!offered){write(rows,"H"+row,"NOT QUOTED");write(rows,"I"+row,"NOT QUOTED");}
    write(rows,"J"+row,r.leadTimeARO??"OEM confirmation required");
   }
   // C1/C2 require independent OEM spare cost before any commercial price.
  });
  write(rows,"I19",offered?option.budgetaryOptionOfferTHB:code.startsWith("B")?(Number.isFinite(audit?.annexLineTotalTHB)?round(audit.annexLineTotalTHB):"NOT ESTABLISHED"):"NOT QUOTED");
  if(offered){
   write(rows,"H4","CONDITIONAL BUDGETARY OFFER (THB) / CIF SUBJECT TO APPROVAL");
   write(rows,"B19","CONDITIONAL BUDGETARY OPTION TOTAL (THB) — excluded from A+B");
   write(rows,"B21",code+" price offered conditionally. "+option.budgetaryOfferTechnicalGate+
    ". Original DDP site; proposed CIF Zhuhai requires buyer approval. NOT ISSUED.");
  }
  if(Number.isFinite(audit?.varianceTHB)&&Math.abs(audit.varianceTHB)>0.01)
   warnings.push(code+" line-to-summary variance THB "+audit.varianceTHB.toFixed(2)+" — no balancing item created");
  if(code.startsWith("C"))warnings.push(offered?code+" CONDITIONAL BUDGETARY OFFER, excluded from A+B; OEM/CIF and B10 stock exclusion remain open":code+" optional price not quoted: verified direct cost required");
  replaceAll("xl/worksheets/sheet"+(i+2)+".xml",rows);
 }
 // Refresh the existing quantity formula cache after replacing TAG rows with
 // four MR lots. Preserve the formula itself and the original workbook parts.
 const summarySheet="xl/worksheets/sheet1.xml";
 let summaryXml=decode.decode(changes.get(summarySheet));
 const quantityTotal=Array.from({length:15},(_,i)=>{
  const cell=summaryXml.match(new RegExp('<c\\b[^>]*r="E'+(8+i)+'"[^>]*?(?:/>|>([\\s\\S]*?)</c>)'));
  return cell&&!/\bt="(?:s|inlineStr)"/.test(cell[0])?Number((cell[1]||"").match(/<v>([^<]+)<\/v>/)?.[1]||0):0;
 }).reduce((sum,n)=>sum+n,0);
 summaryXml=summaryXml.replace(/(<c\b[^>]*r="E7"[^>]*><f>SUM\(E8:E22\)<\/f>)(?:<v>[^<]*<\/v>)?(<\/c>)/,
  (_m,start,end)=>start+"<v>"+quantityTotal+"</v>"+end);
 changes.set(summarySheet,encode.encode(summaryXml));
 // Fit the exported Release workbook, including merged description cells.
 const styleEntry=entries.find(e=>e.name==="xl/styles.xml");
 if(!styleEntry)throw Error("Native workbook is missing styles.xml");
 const fitted=fitNativeReleaseLayout0553(normalizeSpreadsheetXml0553(decode.decode(await readEntry(styleEntry))),
  sharedXml,
  new Map([...changes].map(([name,bytes])=>[name,decode.decode(bytes)])),warnings);
 for(const [name,xml] of fitted.sheets)changes.set(name,encode.encode(xml));
 changes.set("xl/styles.xml",encode.encode(fitted.stylesXml));
 assertNativeScopeSummary0553(fitted.sheets.get(summarySheet),{
  a:model.a.map(x=>({...x,amount:x.previewSellTHB})),b:bc.map(x=>({...x,amount:x.customerSellTHB})),
  total:priced.reduce((sum,n)=>sum+n,0),unpricedText:"NOT ESTABLISHED",sharedXml
 });
 // All unrelated ZIP parts are copied byte-for-byte.
 const result=rebuildZip(entries,changes);
 const date=new Date().toISOString().slice(0,10).replace(/-/g,"");
 return {blob:new Blob([result],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),
  filename:"PJ2608-0553_ScopeOfSupply_NATIVE_WORKING_DRAFT_NOT_RELEASED_"+date+".xlsx",
  warnings,mappedCells:count};
}

// Clone one original B10 body row and move Total/Remark down on the same
// sheet, preserving customer style/merges. Idempotent on an already expanded
// original workbook for repeated native USD export.
function expandOriginalB10To14Rows0553(xml){
 xml=xml.replace('<dimension ref="B2:I22"/>','<dimension ref="B2:I23"/>');
 if(xml.includes('<mergeCell ref="B20:H20"')&&xml.includes('<mergeCell ref="B21:E21"')){
  if(!/<row\b[^>]*\br="19"/.test(xml))throw Error("B10 expanded row 19 absent");
  return xml.replace(/<row\b[^>]*\br="21"[^>]*>/,tag=>
   /\bht=/.test(tag)?tag.replace(/\bht="[^"]*"/,'ht="115"'):tag.replace(">",' ht="115" customHeight="1">'));
 }
 if(!xml.includes('<mergeCell ref="B19:H19"')||!xml.includes('<mergeCell ref="B20:E20"'))
  throw Error("B10 original footer merges changed");
 const lastBody=xml.match(/<row\b[^>]*\br="18"[^>]*>[\s\S]*?<\/row>/)?.[0];
 if(!lastBody)throw Error("B10 original native row18 missing");
 xml=xml.replace(/<row\b[^>]*?(?:\/>|>[\s\S]*?<\/row>)/g,row=>{
  const n=Number(row.match(/^<row\b[^>]*\br="(\d+)"/)?.[1]);
  if(!Number.isInteger(n)||n<19)return row;
  return row.replace(/^<row\b[^>]*>/,h=>h.replace(/\br="\d+"/,'r="'+(n+1)+'"'))
   .replace(/(<c\b[^>]*\br=")([A-Z]+)\d+(")/g,(_m,a,col,q)=>a+col+(n+1)+q);
 });
 const inserted=lastBody.replace(/^<row\b[^>]*>/,h=>h.replace(/\br="18"/,'r="19"'))
  .replace(/(<c\b[^>]*\br=")([A-Z]+)18(")/g,(_m,a,col,q)=>a+col+"19"+q);
 const pos=xml.indexOf('<row r="20"');
 if(pos<0)throw Error("B10 shifted footer missing");
 xml=xml.slice(0,pos)+inserted+xml.slice(pos);
 xml=xml.replace(/(<mergeCell\b[^>]*\bref=")([A-Z]+)(\d+):([A-Z]+)(\d+)(")/g,
  (m,a,col1,r1,col2,r2,q)=>Number(r1)>=19?
   a+col1+(Number(r1)+1)+":"+col2+(Number(r2)+1)+q:m);
 if(!xml.includes('<mergeCell ref="B20:H20"')||!xml.includes('<mergeCell ref="B21:E21"'))
  throw Error("B10 footer merge shift failed");
 return xml.replace(/<row\b[^>]*\br="21"[^>]*>/,tag=>
  /\bht=/.test(tag)?tag.replace(/\bht="[^"]*"/,'ht="115"'):tag.replace(">",' ht="115" customHeight="1">'));
}

// Generate a separate English customer workbook from original geometry.
// Only explicitly selected customer fields are written; no internal model dump,
// unused shared strings, old amounts or source-workbook custom metadata survive.
export async function buildNativeOfficialRelease0553(file,model){
 if(model.currency!=="USD"||!model.policy||model.a.length!==4||model.b.length!==14)throw Error("Invalid official USD quotation model");
 const entries=entriesFromZip(new Uint8Array(await file.arrayBuffer()));
 const changes=new Map(),warnings=[],sheets=new Map();
 for(let i=1;i<=6;i++){
  const name="xl/worksheets/sheet"+i+".xml",entry=entries.find(e=>e.name===name);
  if(!entry)throw Error("Original worksheet missing: "+name);
  const preservedFormulas=new Map();
  // Preserve every cell address/style, row, column, merge, page and print setting.
  let xml=normalizeSpreadsheetXml0553(decode.decode(await readEntry(entry))).replace(/<c\b([^>]*?)(?:\/>|>[\s\S]*?<\/c>)/g,(cell,attrs)=>{
   const formula=cell.match(/<f\b[^>]*>[\s\S]*?<\/f>/)?.[0];
   if(formula){
    const address=attrs.match(/\br="([A-Z]+\d+)"/)?.[1];
    if(i===1&&address==="E7"&&formula==="<f>SUM(E8:E22)</f>")
     return "<c"+attrs.replace(/\s+t="[^"]*"/g,"")+">"+formula+"<v>4</v></c>";
    const row=Number(address?.slice(1)),totalRow=i===2?20:19;
    const line=i>1&&address==="I"+row&&row>=6&&row<totalRow&&
     ["<f>G"+row+"*H"+row+"</f>","<f>ROUND(G"+row+"*H"+row+",2)</f>"].includes(formula);
    const total=i>1&&address==="I"+totalRow&&formula==="<f>SUM(I6:I"+(totalRow-1)+")</f>";
    if(!line&&!total)throw Error("Unexpected native formula: preserve and reconcile before export "+name+"!"+address);
    preservedFormulas.set(address,formula);
   }
   return "<c"+attrs.replace(/\s+t="[^"]*"/g,"")+"/>";
  });
  if(i===2)xml=expandOriginalB10To14Rows0553(xml);
  const cells=new Map(),put=(address,value)=>write(cells,address,value);
  const price=value=>Number.isFinite(value)?value:"To be quoted";
  if(i===1){
   put("A1","Scope of Supply");put("A2","Project");put("B2",model.project);
   put("A3","Currency");put("B3","USD");put("A4","Package Name");put("B4","Telecommunications Systems");
   ["Item","Tag No.","Description","Main Specification","Qty","Unit Price (USD)","Amount (USD)","Remarks"].forEach((v,j)=>put("ABCDEFGH"[j]+"5",v));
   put("A6","Part A: Equipment");put("A7","Main Equipment");
   model.a.forEach((r,j)=>{const row=8+j;put("A"+row,r.code);put("B"+row,r.mr);put("C"+row,r.description);put("D"+row,r.locations);put("E"+row,1);put("F"+row,price(r.amountUSD));put("G"+row,price(r.amountUSD));});
   put("A23","Part B: Services and Other Supplies");
   const fill=(r,row)=>{
     const isOption=r.code==="C1"||r.code==="C2";
     const ref=isOption?model.otherSpareItemizedAnnex?.summaries?.[r.code]:null;
     if(isOption&&(!Number.isFinite(ref?.totalUSD)||ref.selectedWorking!==false||
        ref.budgetaryOfferPrepared!==true||ref.conditionalPriceStatus!=="CONDITIONAL_BUDGETARY_OFFER"||
        r.budgetaryOptionQuoteUSD!==ref.totalUSD||r.budgetaryOfferPrepared!==true||
        r.firmOemQuote!==false||r.optionExcludedFromBase!==true||
        Number.isFinite(r.amountUSD)))
      throw Error("0553 Native Part C conditional budgetary offer must match canonical 10.3→Official");
     const amount=isOption?r.budgetaryOptionQuoteUSD:r.amountUSD;
     const displayText=[r.description,r.serviceText,
      isOption?"CONDITIONAL BUDGETARY OPTION PRICE / OEM TECHNICAL REVIEW REQUIRED / SUBJECT TO CIF CONFIRMATION":null]
      .filter(Boolean).join("\n");
     put("A"+row,r.code);put("B"+row,displayText);put("E"+row,1);
     put("F"+row,amount===null&&r.priceText?r.priceText:price(amount));put("G"+row,amount===null&&r.priceText?r.priceText:price(amount));
     if(r.commercialRemark)put("H"+row,r.commercialRemark);
     if(model.annex[r.code])put("H"+row,"Refer to Annex "+r.code+
      (isOption?" / CONDITIONAL BUDGETARY OFFER / OEM TECHNICAL QUALIFICATION / excludes A+B":""));
    };
   model.b.forEach((r,j)=>fill(r,24+j));model.c.forEach((r,j)=>fill(r,41+j));
   put("A38","Total A+B (USD)"+(model.excluded?.length?"\nNot quoted / excluded: "+model.excluded.join(", ")+".":"")+(model.unpriced.length?"\nExcludes items to be quoted: "+model.unpriced.join(", ")+".":""));put("G38",price(model.totalUSD));
   put("A39","Prices cover the items described above and are subject to the stated scope and qualifications.");
   put("A40","Part C: Options — excluded from Total A+B");
   put("B43","Proposed delivery: CIF Zhuhai Port, China (Incoterms 2020), subject to buyer approval against original DDP site terms.");
  }else{
   const code=["B10","B11","B13","C1","C2"][i-2],isB10=code==="B10";
   // Exactly the same itemized read model drives 10.3.4 JSX and native Excel.
   // C1/C2 are conditional budgetary options, separate from firm OEM pricing.
   const detail=isB10?model.b10ItemizedAnnex?.rows:
    model.otherSpareItemizedAnnex?.rows?.[code];
   if(!Array.isArray(detail)||detail.length>(isB10?14:13)||
      (isB10&&(detail.length!==14||model.b10ItemizedAnnex?.customerIssued!==false)))
    throw Error(code+" original priced Annex capacity or approval gate failed");
   put("B2",model.annexTitles[code]);
   ["Item","Tag No.","Description","Specification","Materials","Qty"].forEach((v,j)=>put("BCDEFG"[j]+"4",v));
   put("H4",isB10?"PRE-AWARD BUDGET USD / CIF UNCONFIRMED":
    code.startsWith("C")?"CONDITIONAL OPTION BUDGET USD / CIF UNVERIFIED":
    "PRE-AWARD WORKING ALLOCATION USD");
   put("H5","Unit Price (USD)");put("I5","Amount (USD)");
   if(code.startsWith("C"))put("J5","Lead Time (ARO)");
   detail.forEach((r,j)=>{const row=6+j;
    [r.item??(j+1),r.tag??r.tagNo,r.description,r.specification,r.materials,
     r.qty??"TBC",price(r.unitUSD),price(r.totalUSD)].forEach((v,k)=>put("BCDEFGHI"[k]+row,v));
    if(code.startsWith("C"))put("J"+row,r.leadTime);
   });
   const totalRow=isB10?20:19;
   put("B"+totalRow,isB10?"PRE-AWARD B10 FINANCIAL ALLOCATION (USD) — NOT OEM SPARE QUOTE":
    code.startsWith("C")?"CONDITIONAL BUDGETARY OPTION SELL (USD) — OEM SUBJECT TO APPROVAL":
    "PRE-AWARD WORKING PRICE TOTAL (USD) — NOT OEM LINE QUOTE");
   put("I"+totalRow,price(isB10?
    [...model.b,...model.c].find(r=>r.code===code).amountUSD:
    model.otherSpareItemizedAnnex?.summaries?.[code]?.totalUSD));
   if(isB10)put("B21","PRE-AWARD BUDGETARY FINANCIAL ALLOCATION ONLY. Each Qty 1 LOT is a functional budget line, not one physical spare. OEM spare part numbers, actual delivery quantities, quoted CIF unit rates and buyer approval remain outstanding. NOT ISSUED.");
   if(code==="C1"||code==="C2")put("B21",code==="C1"?
    "CONDITIONAL BUDGETARY C1 PRICE OFFER: installed RACON FCA package is a rate comparator only; subject to approved capital spare Ex configuration, actual OEM spare rate and CIF delivery.":
    "CONDITIONAL BUDGETARY C2 PRICE OFFER: Rev08 historical rates are a proposal basis only; replace 7/8-inch cable with installed-system compatible feeder and exclude confirmed B10 duplicate stock; OEM 2026 quote required.");
  }
  for(const [address,value] of cells){
   if(!new RegExp('<c\\b[^>]*r="'+address+'"').test(xml)){
    const row=address.match(/\d+$/)[0],rowPattern=new RegExp('<row\\b[^>]*r="'+row+'"[^>]*>[\\s\\S]*?</row>');
    if(!rowPattern.test(xml))throw Error("Original row missing: "+address);
    xml=xml.replace(rowPattern,body=>body.replace('</row>','<c r="'+address+'" s="'+(body.match(/<c\b[^>]*s="(\d+)"/)?.[1]||0)+'"/></row>'));
   }
   xml=replaceCell(xml,address,value);
  }
  for(const [address,formula] of preservedFormulas){
   const value=cells.get(address),row=Number(address.slice(1));
   const calculated=formula.includes('SUM(')?round([...cells].filter(([key,v])=>/^I\d+$/.test(key)&&Number(key.slice(1))>=6&&Number(key.slice(1))<row&&Number.isFinite(v)).reduce((sum,[,v])=>sum+v,0)):
    round(cells.get('G'+row)*cells.get('H'+row));
   if(!Number.isFinite(value)||calculated!==round(value))throw Error("Native formula/source mismatch: "+name+"!"+address);
   const re=new RegExp('(<c\\b[^>]*\\br="'+address+'"[^>]*>)([\\s\\S]*?)(</c>)');
   xml=xml.replace(re,(_match,start,_body,end)=>start+formula+'<v>'+value+'</v>'+end);
  }
  sheets.set(name,xml);
 }
 const style=entries.find(e=>e.name==="xl/styles.xml");
 if(!style)throw Error("Original styles missing");
 const fitted=fitNativeReleaseLayout0553(normalizeSpreadsheetXml0553(decode.decode(await readEntry(style))),"",sheets,warnings);
 // Numeric quotation amounts use USD decimals; annex unit rates retain 4 decimals
 // so Qty x Unit Price rounds exactly to the distributed parent quotation.
 let styles=fitted.stylesXml;
 const formats=[...styles.matchAll(/<numFmt\b[^>]*numFmtId="(\d+)"[^>]*formatCode="([^"]*)"[^>]*\/>/g)];
 const existingUnitFormat=formats.find(x=>x[2]==="#,##0.00##");
 const unitFormat=existingUnitFormat?Number(existingUnitFormat[1]):Math.max(164,...formats.map(x=>Number(x[1])))+1;
 const xfs=styles.match(/<cellXfs\b[^>]*>([\s\S]*?)<\/cellXfs>/);
 const list=xfs[1].match(/<xf\b[^>]*?(?:\/>|>[\s\S]*?<\/xf>)/g),cache=new Map();
 for(const [name,input] of fitted.sheets){
  const main=/sheet1\.xml$/.test(name);
  const xml=input.replace(/<c\b[^>]*>\s*<v>[^<]+<\/v><\/c>/g,cell=>{
   const address=cell.match(/\br="([^"]+)"/)[1],col=address.match(/^[A-Z]+/)[0];
   if(!(main?["F","G"]:["H","I"]).includes(col))return cell;
   const id=Number(cell.match(/\bs="(\d+)"/)?.[1]||0),format=!main&&col==="H"?unitFormat:4,key=id+":"+format;
   if(!cache.has(key)){
    let xf=list[id].replace(/\bnumFmtId="\d+"/,'numFmtId="'+format+'"');
    if(!/applyNumberFormat=/.test(xf))xf=xf.replace("<xf ",'<xf applyNumberFormat="1" ');
    else xf=xf.replace(/applyNumberFormat="[^"]*"/,'applyNumberFormat="1"');
    let next=list.indexOf(xf);if(next<0){next=list.length;list.push(xf);}cache.set(key,next);
   }
   return /\bs="/.test(cell)?cell.replace(/\bs="\d+"/,'s="'+cache.get(key)+'"'):cell.replace("<c ",'<c s="'+cache.get(key)+'" ');
  });
  changes.set(name,encode.encode(xml));
 }
 styles=styles.replace(/<cellXfs\b[^>]*>[\s\S]*?<\/cellXfs>/,'<cellXfs count="'+list.length+'">'+list.join("")+'</cellXfs>');
 if(!existingUnitFormat){
  const fmt='<numFmt numFmtId="'+unitFormat+'" formatCode="#,##0.00##"/>';
  if(/<numFmts\b[^>]*>/.test(styles))styles=styles.replace(/<numFmts\b[^>]*>([\s\S]*?)<\/numFmts>/,(_,body)=>'<numFmts count="'+(formats.length+1)+'">'+body+fmt+'</numFmts>');
  else styles=styles.replace(/(<styleSheet\b[^>]*>)/,'$1<numFmts count="1">'+fmt+'</numFmts>');
 }
 changes.set("xl/styles.xml",encode.encode(styles));
 assertNativeScopeSummary0553(decode.decode(changes.get("xl/worksheets/sheet1.xml")),{
  a:model.a.map(x=>({...x,amount:x.amountUSD})),b:model.b.map(x=>({...x,amount:x.amountUSD})),
  total:model.totalUSD,unpricedText:"To be quoted"
 });
 changes.set("xl/sharedStrings.xml",encode.encode('<?xml version="1.0" encoding="UTF-8"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="0" uniqueCount="0"/>'));
 changes.set("docProps/core.xml",encode.encode('<?xml version="1.0" encoding="UTF-8"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>PJ2608-0553 Scope of Supply USD</dc:title></cp:coreProperties>'));
 const remove=name=>name.startsWith("customXml/")||name==="xl/calcChain.xml"||name==="docProps/custom.xml";
 for(const e of entries.filter(e=>e.name.endsWith(".rels")||e.name==="[Content_Types].xml")){
  const xml=decode.decode(await readEntry(e)).replace(/<(?:Relationship|Override)\b[^>]*(?:\/>|>[\s\S]*?<\/(?:Relationship|Override)>)/g,tag=>/customXml\/|calcChain\.xml|docProps\/custom\.xml/.test(tag)?"":tag);
  changes.set(e.name,encode.encode(xml));
 }
 const result=rebuildZip(entries.filter(e=>!remove(e.name)),changes);
 return {blob:new Blob([result],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),filename:"PJ2608-0553_ScopeOfSupply_USD_PRE_AWARD_NOT_ISSUED.xlsx",warnings:[...warnings,"C1/C2 are CONDITIONAL BUDGETARY PRICED OPTION OFFERS only, not confirmed supplier OEM unit prices; exclude from A+B and verify technical stock/CIF terms before contracting."]};
}


// INTERNAL B10 original-template review (NOT the Official customer release).
// Inserts any number of line rows into B10 CommSpares in the SAME native sheet,
// shifting the original Total and Remark and their merged ranges downward.
// Source quoted equipment Qty/USD reference is NOT an accepted B10 CIF spare SELL.
export async function buildNativeB10ItemizedReview0553(file,annex){
 if(!file||!/\.xlsx$/i.test(file.name||"")||!annex||annex.originalSheet!=="B10 CommSpares"||
  !Array.isArray(annex.rows)||annex.rows.length<1||annex.customerReleaseAllowed!==false)
  throw Error("Native B10 review requires original 4-Scope of Supply.xlsx and the nonposting source item map");
 if(annex.rows.some(x=>!x.id||!x.parentSourceId||x.b10PurchaseQty!==null||
  x.b10UnitSellUSD!==null||x.customerIssueAllowed!==false||
  !Number.isFinite(x.budgetaryUnitPriceUSD)||x.presentationQty!==1))
  throw Error("B10 spare buying Qty/SELL may not be assumed from installed quote");
 const bytes=new Uint8Array(await file.arrayBuffer()),entries=entriesFromZip(bytes);
 const wb=entries.find(x=>x.name==="xl/workbook.xml"),sheet=entries.find(x=>x.name==="xl/worksheets/sheet2.xml");
 if(!wb||!sheet)throw Error("Original six-sheet Native B10 template missing");
 const workbook=decode.decode(await readEntry(wb));
 if(!SHEETS_0553.every(name=>workbook.includes('name="'+name+'"')))
  throw Error("B10 output must retain all six original customer worksheets");
 let xml=decode.decode(await readEntry(sheet));
 const original13=13,extra=Math.max(0,annex.rows.length-original13);
 if(extra){
  const originalRow=xml.match(/<row\b[^>]*\br="18"[^>]*>[\s\S]*?<\/row>/)?.[0];
  if(!originalRow||!xml.includes('<mergeCell ref="B19:H19"')||
   !xml.includes('<mergeCell ref="B20:E20"'))throw Error("Original B10 styled body/total/remark geometry changed");
  const shift=row=>{
   const no=Number(row.match(/^<row\b[^>]*\br="(\d+)"/)?.[1]);
   if(!Number.isInteger(no)||no<19)return row;
   const to=no+extra;
   return row.replace(/^<row\b[^>]*>/,s=>s.replace(/\br="\d+"/,'r="'+to+'"'))
    .replace(/(<c\b[^>]*\br=")([A-Z]+)\d+(")/g,(_m,a,col,end)=>a+col+to+end);
  };
  xml=xml.replace(/<row\b[^>]*>[\s\S]*?<\/row>/g,shift);
  const inserted=Array.from({length:extra},(_,i)=>{
   const to=19+i;
   return originalRow.replace(/^<row\b[^>]*>/,s=>s.replace(/\br="18"/,'r="'+to+'"').replace(/\bht="[^"]+"/,'ht="56"'))
    .replace(/(<c\b[^>]*\br=")([A-Z]+)18(")/g,(_m,a,col,end)=>a+col+to+end);
  }).join("");
  const token='<row r="'+(19+extra)+'"';
  const index=xml.indexOf(token);
  if(index<0)throw Error("Native B10 inserted row position missing");
  xml=xml.slice(0,index)+inserted+xml.slice(index);
  xml=xml.replace(/(<mergeCell\b[^>]*\bref=")([A-Z]+)(\d+):([A-Z]+)(\d+)(")/g,
   (whole,prefix,a,first,b,last,suffix)=>Number(first)>=19?
    prefix+a+(Number(first)+extra)+":"+b+(Number(last)+extra)+suffix:whole);
 }
 const totalRow=19+extra,remarkRow=20+extra;
 if(totalRow!==6+annex.rows.length)throw Error("B10 native total row not below all physical items");
 const writes=new Map();
 write(writes,"H4","BUDGETARY WORKING SELL (USD) — NOT ISSUED");
 write(writes,"H5","UNIT PRICE (USD) — BUDGET LOT");
 write(writes,"I5","TOTAL PRICE (USD) — BUDGET");
 for(let j=0;j<annex.rows.length;j++){
  const r=annex.rows[j],row=6+j;
  write(writes,"B"+row,r.item);
  write(writes,"C"+row,r.tag);
  write(writes,"D"+row,r.description);
  write(writes,"E"+row,r.specification);
  write(writes,"F"+row,r.materials);
  write(writes,"G"+row,r.presentationQty);
  write(writes,"H"+row,r.budgetaryUnitPriceUSD);
  write(writes,"I"+row,r.budgetaryTotalUSD);
 }
 write(writes,"B"+totalRow,"B10 TOTAL — ALLOCATED WORKING BUDGET USD / NOT ISSUED");
 write(writes,"I"+totalRow,annex.budgetaryPresentationTotalUSD);
 write(writes,"B"+remarkRow,"BUDGETARY WORKING PRICE BREAKDOWN / NOT ISSUED. Each line is 1 LOT functional allowance; "+
  "its USD Unit Price is the equal share of the corresponding MR kit Working SELL (THB ÷ FX "+annex.budgetaryPlanningFX+"). "+
  "These amounts are NOT OEM unit rates or confirmed physical spare quantities. "+
  "Proposed CIF Zhuhai Port requires purchaser acceptance, OEM SPIR, freight/insurance and non-duplication review.");
 for(const [cell,value] of writes)xml=replaceCell(xml,cell,value);
 // Existing 6 original worksheet identities/styles, columns, printing and
 // unrelated ZIP files remain untouched. The cloned row-18 carries native
 // borders/fills/column format into all added B10 lines.
 const out=rebuildZip(entries,new Map([["xl/worksheets/sheet2.xml",encode.encode(xml)]]));
 return {blob:new Blob([out],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),
  filename:"PJ2608-0553_B10_ORIGINAL_NATIVE_BUDGETARY_WORKING_ALLOCATION_INTERNAL_NOT_RELEASED.xlsx",
  rowCount:annex.rows.length,originalCapacity:original13,insertedRows:extra,totalRow,
  warnings:["INTERNAL NONPOSTING B10 — USD Unit prices are 10.2 Working envelope allocations, NOT OEM replacement spare rates",
   "1 LOT means 1 financial allowance line, not one physical spare; purchaser DDP/CIF deviation and final freight/insurance remain open"]};
}
