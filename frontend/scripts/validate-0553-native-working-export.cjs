// 0553 native working XLSX exporter. Self-contained valid ZIP workbook fixture.
// Original template is embedded for direct browser export; no runtime XLSX dependency.
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const source=fs.readFileSync(path.resolve(__dirname,"../src/project0553/nativeWorkingDraft0553.js"),"utf8");
const context={Blob,TextEncoder,TextDecoder,Response,DecompressionStream,Uint8Array,DataView,Date,Map,Set};
vm.runInNewContext(source.replace(/\bexport /g,"")+
 ";this.api={replaceCell,rebuildZip,entriesFromZip,readEntry,crc32,fitNativeReleaseLayout0553,buildNativeWorkingDraft0553};",context);
const {api}=context;
const adjacent='<row><c r="A8" s="20"/><c r="B8" s="21"/><c r="C8" s="21" t="s"><v>3</v></c></row>';
const edited=api.replaceCell(adjacent,"A8","A1");
assert(edited.includes('<c r="B8" s="21"/><c r="C8" s="21" t="s"><v>3</v></c>'),"Replacing a self-closing cell must preserve following cells");
assert.throws(()=>api.replaceCell('<c r="I19"><f>SUM(I6:I18)</f><v>0</v></c>',"I19",1),/Refusing to overwrite formula/);
const encoder=new TextEncoder(),decoder=new TextDecoder();
const view=u=>new DataView(u.buffer,u.byteOffset,u.byteLength);
const w16=(u,i,x)=>view(u).setUint16(i,x,true),w32=(u,i,x)=>view(u).setUint32(i,x>>>0,true);
function zippedEntry(name,text){
 const nameBytes=encoder.encode(name),data=encoder.encode(text),local=new Uint8Array(30+nameBytes.length);
 const central=new Uint8Array(46+nameBytes.length);
 w32(local,0,0x04034b50);w16(local,4,20);w16(local,8,0);w16(local,26,nameBytes.length);
 w32(central,0,0x02014b50);w16(central,4,20);w16(central,6,20);w16(central,10,0);w16(central,28,nameBytes.length);
 local.set(nameBytes,30);central.set(nameBytes,46);
 return {name,local,central,compressed:data,method:0,rawSize:data.length,
  crc:api.crc32(data),flags:0};
}
const names=["Scope of supply","B10 CommSpares","B11 SpecialTool","B13 Consumerables","C1 CapitalSpares","C2 2Y-Spares"];
const book='<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheets>'+
 names.map((name,i)=>'<sheet name="'+name+'" sheetId="'+(i+1)+'"/>').join("")+'</sheets></workbook>';
function sheet(index){
 const max=index===1?43:22;
 const cells=[];
 for(let row=1;row<=max;row++){
  const addresses=index===1?(row>=24&&row<=37?["A"+row,"B"+row,"E"+row,"F"+row,"G"+row]:row>=8&&row<=11?"ABCDEFG".split("").map(x=>x+row):
   row>=24&&row<=37||row===41||row===42?["B"+row,"F"+row,"G"+row,"H"+row]:row===38?["A38","G38","H38"]:[]):
   row>=6&&row<=18?(index>=5?["B","C","D","E","F","G","H","I","J"]:["B","C","D","E","F","G","H","I"]).map(x=>x+row):row===19?["B19","I19"]:row===21?["B21"]:row===4?["H4"]:[];
  // A previously priced workbook must not leak historical values in unused rows.
  const xml=addresses.map(address=>'<c r="'+address+'" s="12">'+(index===1||row>=6&&row<=18?'<v>987654321</v>':'')+'</c>').join("");
  cells.push('<row r="'+row+'" ht="16" customHeight="1">'+xml+'</row>');
 }
 return '<?xml version="1.0"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'+
  '<cols><col min="1" max="9" width="22" customWidth="1"/></cols><sheetData>'+
  cells.join("")+'</sheetData><mergeCells count="1"><mergeCell ref="A1:F1"/></mergeCells></worksheet>';
}
const stylesXml='<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="1"><font><sz val="18"/><name val="Arial"/></font></fonts><cellXfs count="13">'+Array(13).fill('<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>').join('')+'</cellXfs></styleSheet>';
const inputZip=api.rebuildZip([
 zippedEntry("[Content_Types].xml","<Types/>"),
 zippedEntry("xl/workbook.xml",book),zippedEntry("xl/styles.xml",stylesXml),
 ...names.map((name,i)=>zippedEntry("xl/worksheets/sheet"+(i+1)+".xml",sheet(i+1))),
 zippedEntry("docProps/core.xml","<properties><creator>Original</creator></properties>")
],new Map());
const a=[1,2,3,4].map(i=>({code:"A"+i,mr:"MR-000"+i,
 description:"Equipment "+i,previewSellTHB:130*i,sourceRows:[{tag:"TAG-"+i}]}));
const b=Array.from({length:14},(_,i)=>({code:"B"+(i+1),description:"Service "+(i+1),customerSellTHB:100+i}));
const c=["C1","C2"].map(code=>({code}));
const annexCodes=["B10","B11","B13","C1","C2"];
const annex=Object.fromEntries(annexCodes.map(code=>[code,[{
 tagNo:"SOURCE TAG",description:"Spare "+code,specification:"OEM / MODEL TBC",materials:"METAL",
 qty:2,customerUnitTHB:code.startsWith("B")?10:null,customerTotalTHB:code.startsWith("B")?20:null
}]]));
const annexModels=Object.fromEntries(annexCodes.map(code=>[code,{annexLineTotalTHB:20,varianceTHB:0.02}]));
const model={a,b,c,annex,annexModels,summary:{aProvisionalCustomerSellTHB:1300,bProvisionalCustomerSellTHB:1491},
 sourceCoverage:{aOverflow:false,aReady:false}};
const filename="4-Scope of Supply.xlsx";
const testFile={name:filename,arrayBuffer:async()=>inputZip.buffer.slice(inputZip.byteOffset,inputZip.byteOffset+inputZip.byteLength)};
(async()=>{
 const output=await api.buildNativeWorkingDraft0553(testFile,model);
 assert.match(output.filename,/NATIVE_WORKING_DRAFT_NOT_RELEASED/);
 assert.equal(output.warnings.some(x=>x.includes("NOT RELEASED")),true);
 const encoded=new Uint8Array(await output.blob.arrayBuffer()),parts=api.entriesFromZip(encoded);
 assert.equal(parts.length,10);
 const worksheet=n=>decoder.decode(parts.find(x=>x.name==="xl/worksheets/sheet"+n+".xml").compressed);
 const main=worksheet(1),b10=worksheet(2),c1=worksheet(5);
 assert.match(main,/<c r="A8" s="\d+" t="inlineStr"><is>/);
 assert.match(main,/<c r="G38" s="\d+"><v>2791<\/v><\/c>/);
 assert(main.includes("Excludes unpriced items"));
 assert.match(main,/<c r="G33" s="\d+"><v>109<\/v><\/c>/); // B10 100 + 9
 assert.match(b10,/<c r="D6" s="\d+" t="inlineStr"><is><t xml:space="preserve">Spare B10<\/t><\/is><\/c>/);
 assert.match(b10,/<c r="I19" s="\d+"><v>20<\/v><\/c>/);
 assert.ok(!/<c r="I6" s="\d+"><v>20<\/v><\/c>/.test(c1),"C price not released");
 assert.ok(worksheet(2).includes('<col min="1" max="9" width="22" customWidth="1"/>'));
 assert.match(worksheet(2),/<row r="6" ht="[2-9][0-9](?:\.[0-9]+)?" customHeight="1">/);
 const styled=decoder.decode(parts.find(x=>x.name==="xl/styles.xml").compressed);
 assert(styled.includes('<sz val="10"/>')&&styled.includes('wrapText="1"'));
 assert(!styled.includes('shrinkToFit="1"'));
 assert.ok(worksheet(2).includes('<mergeCell ref="A1:F1"/>'));
 assert.match(decoder.decode(parts.find(x=>x.name==="docProps/core.xml").compressed),/Original/);
 // original buffer may not be mutated
 assert.equal(inputZip.byteLength,api.rebuildZip([
  zippedEntry("[Content_Types].xml","<Types/>"),zippedEntry("xl/workbook.xml",book),zippedEntry("xl/styles.xml",stylesXml),
  ...names.map((name,i)=>zippedEntry("xl/worksheets/sheet"+(i+1)+".xml",sheet(i+1))),
  zippedEntry("docProps/core.xml","<properties><creator>Original</creator></properties>")
 ],new Map()).byteLength);
 // Real 16-line Source→Release→Native XLSX→Source round-trip on the SAME
 // original-format ZIP. No independent price/Qty data is created here.
 const babel=require("@babel/core"),srcRoot=path.resolve(__dirname,"../src");
 const originalLoader=require.extensions[".js"];
 require.extensions[".js"]=(mod,file)=>{
  if(file.startsWith(srcRoot+path.sep)){
   const converted=babel.transformFileSync(file,{babelrc:false,configFile:false,sourceMaps:false,
    presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
   mod._compile(converted.code,file);
  }else originalLoader(mod,file);
 };
 const real=require(path.join(srcRoot,"project0553/data/releaseCommercialModel0553.js")).buildReleaseCommercialModel0553({thbPerUsd:31.5});
 assert.equal(real.annexTraceAudit.totalRows,16);
 const expectedRows=code=>code.startsWith("B")?real.annex[code]:real.budgetaryOptionAnnex[code].map((x,i)=>({
  sourceId:x.sourceId||x.historicalSourceId,
  tagNo:code==="C2"?"Two-year operating stock / TAG by OEM":x.tag,
  description:x.description,specification:x.specification,materials:x.materials,
  qty:x.quantity,customerUnitTHB:x.unitPriceTHB,customerTotalTHB:x.extendedTHB,
  leadTimeARO:x.leadTime,nativeRow:6+i,
  nativeCells:Object.fromEntries(Object.entries({tagNo:"C",description:"D",specification:"E",materials:"F",qty:"G",unitPrice:"H",totalPrice:"I"}).map(([k,col])=>[k,col+(6+i)]))
 }));
 const expectedTotal=code=>code.startsWith("B")?real.annexModels[code].selectedWorkingTHB:real.c.find(x=>x.code===code).budgetaryOptionOfferTHB;
 const assertOptions=xml=>{
  for(const [code,row] of [["C1",41],["C2",42]]){
   for(const col of ["F","G"])assert(cell(xml,col+row).includes('<v>'+expectedTotal(code)+'</v>'));
   assert(cell(xml,"B"+row).includes("CONDITIONAL BUDGETARY OFFER"));
  }
 };

 const live=await api.buildNativeWorkingDraft0553(testFile,real);
 const realZip=api.entriesFromZip(new Uint8Array(await live.blob.arrayBuffer()));
 const nativeText=index=>decoder.decode(realZip.find(x=>x.name==="xl/worksheets/sheet"+index+".xml").compressed);
 const cell=(xml,address)=>xml.match(new RegExp('<c r="'+address+'"[^>]*>([\\s\\S]*?)</c>'))?.[1];
 const escaped=x=>x.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;");
 const nativeScope=nativeText(1);
 for(const row of real.b){
  const nativeRow=23+Number(row.code.slice(1));
  for(const col of ["F","G"]){
   const value=cell(nativeScope,col+nativeRow);
   assert(value?.includes(Number.isFinite(row.customerSellTHB)?'<v>'+row.customerSellTHB+'</v>':"NOT ESTABLISHED"),row.code+" current summary cell "+col);
  }
 }
 assertOptions(nativeScope);
 assert(cell(nativeScope,"G38").includes("<v>27192339.36</v>"));
 assert(cell(nativeScope,"A38").includes("B4, B12, B14"));
 for(const [code,index] of [["B10",2],["B11",3],["B13",4],["C1",5],["C2",6]]){
  const xml=nativeText(index);
  assert(!xml.includes("987654321"),code+" leaked stale native values");
  for(const row of expectedRows(code)){
   assert(xml.includes('r="'+row.nativeCells.tagNo+'"'),"Native row missing TAG cell "+row.sourceId);
   assert(xml.includes(escaped(row.tagNo)),"Native lost ORIGINAL source TAG string "+row.sourceId);
   assert(xml.includes(escaped(row.description)),"Native lost approved simple description "+row.sourceId);
   assert(xml.includes(escaped(row.specification)),"Native lost selected specification "+row.sourceId);
   assert(xml.includes(escaped(row.materials)),"Native lost material/TBC disclosure "+row.sourceId);
   assert(xml.includes('r="'+row.nativeCells.qty+'"'),"Native Qty target missing "+row.sourceId);
   assert(cell(xml,row.nativeCells.qty).includes(row.qty===null?"TBC — OEM SPIR":'<v>'+row.qty+'</v>'));
   assert.equal(cell(xml,row.nativeCells.unitPrice),'<v>'+row.customerUnitTHB+'</v>');
   assert.equal(cell(xml,row.nativeCells.totalPrice),'<v>'+row.customerTotalTHB+'</v>');
   assert.equal(Math.round(row.qty*row.customerUnitTHB*100),Math.round(row.customerTotalTHB*100));
   if(code.startsWith("C"))assert(cell(xml,"J"+row.nativeRow).includes(row.leadTimeARO));
  }
  for(let row=6+expectedRows(code).length;row<=18;row++)
   for(const col of (code.startsWith("C")?["B","C","D","E","F","G","H","I","J"]:["B","C","D","E","F","G","H","I"]))
    assert.equal(cell(xml,col+row),'<is><t xml:space="preserve"></t></is>',code+" must clear unused "+col+row);
  assert(cell(xml,"I19").includes('<v>'+expectedTotal(code)+'</v>'));
 }
 assert.deepEqual(real.annexTraceAudit.rowTrace.map(x=>x.sourceToReleaseMatched),Array(16).fill(true));
 assert.deepEqual(real.annexTraceAudit.rowTrace.map(x=>x.releaseToSourceMatched),Array(16).fill(true));
 // Optional private original binary verification; never commit the customer file.
 // npm run validate:0553-native-working-export -- --template="C:\\path\\4-Scope of Supply.xlsx"
 const templateArg=process.argv.find(x=>x.startsWith("--template="));
 {
  const embedded=require('../src/project0553/data/nativeReleaseTemplate0553.json');
  const templatePath=templateArg?path.resolve(templateArg.slice("--template=".length)):embedded.sourceName;
  const bytes=templateArg?fs.readFileSync(templatePath):Buffer.from(embedded.base64,'base64');
  if(!templateArg)assert.equal(require('node:crypto').createHash('sha256').update(bytes).digest('hex'),embedded.sha256,'Original template identity');
  const result=await api.buildNativeWorkingDraft0553({name:path.basename(templatePath),
   arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)},real);
  const outputArg=process.argv.find(x=>x.startsWith('--output='));
  if(outputArg)fs.writeFileSync(outputArg.slice(9),new Uint8Array(await result.blob.arrayBuffer()));
  const firstBytes=new Uint8Array(await result.blob.arrayBuffer());
  const repeated=await api.buildNativeWorkingDraft0553({name:filename,arrayBuffer:async()=>firstBytes.buffer},real);
  assert.deepEqual(new Uint8Array(await repeated.blob.arrayBuffer()),firstBytes,'Repeated export must not duplicate styles/notes');
  const before=api.entriesFromZip(new Uint8Array(bytes)),after=api.entriesFromZip(new Uint8Array(await result.blob.arrayBuffer()));
  // A reused, partially filled template can contain stale equipment below A4.
  const mainEntry=before.find(x=>x.name==='xl/worksheets/sheet1.xml');
  let stale=decoder.decode(await api.readEntry(mainEntry));
  for(const [address,value] of [['C12','OBSOLETE EQUIPMENT'],['E12',8],['F12',123456],['G12',987648]])stale=api.replaceCell(stale,address,value);
  const staleBytes=api.rebuildZip(before,new Map([[mainEntry.name,encoder.encode(stale)]]));
  const cleaned=await api.buildNativeWorkingDraft0553({name:filename,arrayBuffer:async()=>staleBytes.buffer},real);
  const cleanEntry=api.entriesFromZip(new Uint8Array(await cleaned.blob.arrayBuffer())).find(x=>x.name===mainEntry.name);
  const cleanXml=decoder.decode(await api.readEntry(cleanEntry));
  assert(!cleanXml.includes('OBSOLETE EQUIPMENT')&&!cleanXml.includes('<v>987648</v>'));
  assert(cell(cleanXml,'E7').includes('<v>4</v>'),'Reused template must not inflate MR lot count');
  assert.deepEqual(after.map(x=>x.name),before.map(x=>x.name));
  const normalizeCells=xml=>xml.replace(/<c\b([^>]*?)(?:\s*\/>|>[\s\S]*?<\/c>)/g,
   (_,attrs)=>'<c'+attrs.replace(/\s+t="[^"]*"/g,"")+'/>');
  for(let i=0;i<before.length;i++){
   const a=await api.readEntry(before[i]),b=await api.readEntry(after[i]);
   if(before[i].name==='xl/styles.xml'){
    const oldStyles=decoder.decode(a),newStyles=decoder.decode(b);
    const xfSection=newStyles.match(/<cellXfs count="(\d+)">([\s\S]*?)<\/cellXfs>/);
    assert.equal(Number(xfSection[1]),(xfSection[2].match(/<xf\b/g)||[]).length,'Style ids must match actual XF elements');
    for(const section of ['fonts','cellXfs']){
     const body=x=>x.match(new RegExp('<'+section+'\\b[^>]*>([\\s\\S]*?)</'+section+'>'))[1];
     assert(body(newStyles).startsWith(body(oldStyles)), 'Original '+section+' must remain for unrelated cells');
    }
    continue;
   }
   if(!/^xl\/worksheets\/sheet[1-6]\.xml$/.test(before[i].name)){
    assert.deepEqual(Array.from(b),Array.from(a),"Unrelated native part changed "+before[i].name);continue;
   }
   const oldXml=decoder.decode(a),newXml=decoder.decode(b);
   const structure=xml=>normalizeCells(xml).replace(/<row\b[^>]*>/g,t=>t.replace(/\s(?:ht|customHeight)="[^"]*"/g,'')).replace(/<c\b[^>]*>/g,t=>t.replace(/\ss="[^"]*"/g,''));
   assert.equal(structure(newXml),structure(oldXml),"Native structural content/merges changed "+before[i].name);
   const formulas=xml=>xml.match(/<f\b[^>]*>[\s\S]*?<\/f>/g)||[];
   assert.deepEqual(formulas(newXml),formulas(oldXml),'Native formulas preserved');
   const index=Number(before[i].name.match(/sheet(\d+)/)[1]);
   if(index===1){
    assert(cell(newXml,'E7').includes('<f>SUM(E8:E22)</f><v>4</v>'),'Original quantity formula cache must reflect four current MR lots');
    for(let part=0;part<4;part++)assert(cell(newXml,'D'+(8+part)).includes('Locations: '+[...new Set(real.a[part].sourceRows.map(r=>r.site))].join(', ')));
    for(const code of ['B3','B9']){
     const note=real.b.find(r=>r.code===code).serviceCommercialBasis.compactText;
     assert(cell(newXml,'B'+(23+Number(code.slice(1)))).includes(note.replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;')),'Same short note as Release '+code);
    }
    assert(cell(newXml,"B29").includes("CIF Zhuhai Port China"),"Native B6 must use selected source CIF wording, not old template DDP");
    for(const row of real.b){
     const nativeRow=23+Number(row.code.slice(1));
     const note=row.executionActivities.releaseText.replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;');
     assert(cell(newXml,'B'+nativeRow).includes('Activities: '+note),'Source activity note missing in native '+row.code);
     for(const col of ["F","G"])assert(cell(newXml,col+nativeRow).includes(Number.isFinite(row.customerSellTHB)?'<v>'+row.customerSellTHB+'</v>':"NOT ESTABLISHED"));
    }
    assertOptions(newXml);
    assert(cell(newXml,"G38").includes("<v>27192339.36</v>"));
    assert(cell(newXml,"A38").includes("B4, B12, B14"));
   }else{
    const code=annexCodes[index-2];
    for(const row of expectedRows(code)){
     for(const [field,value] of [["description",row.description],["tagNo",row.tagNo],["specification",row.specification],["materials",row.materials]]){
      const escaped=value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
      assert(cell(newXml,row.nativeCells[field]).includes(escaped),row.sourceId+" native "+field);
     }
     assert(cell(newXml,row.nativeCells.qty).includes(row.qty===null?"TBC — OEM SPIR":'<v>'+row.qty+'</v>'));
     for(const [field,value] of [["unitPrice",row.customerUnitTHB],["totalPrice",row.customerTotalTHB]])
      assert(cell(newXml,row.nativeCells[field]).includes('<v>'+value+'</v>'));
    }
    assert(cell(newXml,"I19").includes('<v>'+expectedTotal(code)+'</v>'));
   }
  }
  console.log("PASS actual native XLSX: six original sheets, 16 current rows, fitted typography/rows, original column widths/page setup, original merges/formulas and unrelated ZIP parts preserved; SHA256 "+require("node:crypto").createHash("sha256").update(bytes).digest("hex"));
 }
 console.log("PASS PJ2608-0553 native working draft ZIP: 6 original-style sheets, A+B mapped, 16 bidirectional PTTEP current annex source item rows, C1/C2 conditional offers with 1/12 price lines, layout fitted, structure preserved");
})().catch(e=>{console.error(e);process.exitCode=1;});
