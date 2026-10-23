/**
 * PJ2608-0553 / 10.3.3 — Export WORKING DRAFT into an ORIGINAL native .xlsx
 * supplied via local browser file picker.  No template is checked into GitHub,
 * no upload or network request occurs, no worksheet/style/merge/size is created.
 *
 * 10.1 -> 10.3.3: four GROUPED MR lines within original Part A rows 8..11.
 * 10.2 -> 10.3.3: B1..B14 Working Sell and B10/B11/B13 Annex detail.
 * C1/C2: item descriptions/qty only, because direct cost+30% is unverified.
 * RELEASE is always HOLD; this export is INTERNAL / NOT FOR CUSTOMER SUBMISSION.
 *
 * ZIP archive parts are copied unchanged except specified worksheet XML cell
 * value elements.  No dependency/package addition, no historical 'cost' posting.
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
function entriesFromZip(bytes){
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
async function readEntry(entry){
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
function rebuildZip(entries,changes){
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
  sourceXml.set(entryName,decode.decode(await readEntry(entries.find(e=>e.name===entryName))));
 }
 const warnings=["WORKING DRAFT ONLY — NOT RELEASED / NOT FOR CUSTOMER SUBMISSION"];
 const writes=new Map();
 const scope=new Map();
 for(let i=0;i<4;i++){
  const row=8+i,group=model.a[i];
  if(!group||group.code!=="A"+(i+1))throw Error("Part A source group order mismatch");
  const sum=group.previewSellTHB;
  if(!Number.isFinite(sum)){warnings.push(group.code+" has no working price");continue;}
  write(scope,"A"+row,group.code);
  write(scope,"B"+row,group.mr);
  write(scope,"C"+row,group.description);
  write(scope,"D"+row,"Grouped MR "+group.mr+"; "+group.sourceRows.length+" TAG working lines; verify TAGs before customer issue");
  write(scope,"E"+row,1);
  write(scope,"F"+row,round(sum));
  write(scope,"G"+row,round(sum));
 }
 const bc=model.b||[];
 for(let i=1;i<=14;i++){
  const row=23+i,b=bc.find(x=>x.code==="B"+i),price=b?.customerSellTHB;
  if(!Number.isFinite(price)){warnings.push("B"+i+" price NOT ESTABLISHED");write(scope,"F"+row,"NOT ESTABLISHED");write(scope,"G"+row,"NOT ESTABLISHED");continue;}
  write(scope,"F"+row,round(price)); // B10/B11/B13 current Annex working unit LS must replace original stale F value too.
  write(scope,"G"+row,round(price));
 }
 const a=model.summary?.aProvisionalCustomerSellTHB,b=model.summary?.bProvisionalCustomerSellTHB;
 for(const row of [41,42]){
  write(scope,"F"+row,"NOT QUOTED");
  write(scope,"G"+row,"NOT QUOTED");
 }
 if(model.sourceCoverage?.aReady===true&&model.sourceCoverage?.bSellReady===true&&Number.isFinite(a)&&Number.isFinite(b))write(scope,"G38",round(a+b));
 else{write(scope,"G38","NOT ESTABLISHED");warnings.push("A+B NOT COMPLETE: priced subtotal only; mandatory items/confirmed supplier evidence pending");}
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
  const code=annexCodes[i],detail=model.annex?.[code]||[],audit=model.annexModels?.[code];
  const rows=new Map();
  if(detail.length>13)throw Error(code+" exceeds 13 physical rows in original. Cannot export without layout changes.");
  const routeTrace=model.annexTraceAudit?.rowTrace?.filter(x=>x.code===code)||null;
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
   if(code.startsWith("B")){
    write(rows,"H"+row,Number.isFinite(r.customerUnitTHB)?r.customerUnitTHB:"NOT ESTABLISHED");
    write(rows,"I"+row,Number.isFinite(r.customerTotalTHB)?round(r.customerTotalTHB):"NOT ESTABLISHED");
   }
   if(code.startsWith("C")){
    write(rows,"H"+row,"NOT QUOTED");write(rows,"I"+row,"NOT QUOTED");
    write(rows,"J"+row,r.leadTimeARO??"OEM confirmation required");
   }
   // C1/C2 require independent OEM spare cost before any commercial price.
  });
  write(rows,"I19",code.startsWith("B")?(Number.isFinite(audit?.annexLineTotalTHB)?round(audit.annexLineTotalTHB):"NOT ESTABLISHED"):"NOT QUOTED");
  if(Number.isFinite(audit?.varianceTHB)&&Math.abs(audit.varianceTHB)>0.01)
   warnings.push(code+" line-to-summary variance THB "+audit.varianceTHB.toFixed(2)+" — no balancing item created");
  if(code.startsWith("C"))warnings.push(code+" optional price not quoted: verified direct cost required");
  replaceAll("xl/worksheets/sheet"+(i+2)+".xml",rows);
 }
 // Re-use each original binary ZIP part as-is; only native cell values in 6 sheets change.
 const result=rebuildZip(entries,changes);
 const date=new Date().toISOString().slice(0,10).replace(/-/g,"");
 return {blob:new Blob([result],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),
  filename:"PJ2608-0553_ScopeOfSupply_NATIVE_WORKING_DRAFT_NOT_RELEASED_"+date+".xlsx",
  warnings,mappedCells:count};
}
