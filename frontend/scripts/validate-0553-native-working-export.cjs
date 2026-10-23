// 0553 native working XLSX exporter. Self-contained valid ZIP workbook fixture.
// No npm packages, no proprietary master workbook committed into the repository.
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const source=fs.readFileSync(path.resolve(__dirname,"../src/project0553/nativeWorkingDraft0553.js"),"utf8");
const context={Blob,TextEncoder,TextDecoder,Response,DecompressionStream,Uint8Array,DataView,Date,Map,Set};
vm.runInNewContext(source.replace(/\bexport /g,"")+
 ";this.api={replaceCell,rebuildZip,entriesFromZip,readEntry,crc32,buildNativeWorkingDraft0553};",context);
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
  const addresses=index===1?(row>=8&&row<=11?"ABCDEFG".split("").map(x=>x+row):
   row>=24&&row<=37||row===41||row===42?["F"+row,"G"+row]:row===38?["G38"]:[]):
   row>=6&&row<=18?(index>=5?["B","C","D","E","F","G","H","I","J"]:["B","C","D","E","F","G","H","I"]).map(x=>x+row):row===19?["I19"]:[];
  // A previously priced workbook must not leak historical values in unused rows.
  const xml=addresses.map(address=>'<c r="'+address+'" s="12"><v>987654321</v></c>').join("");
  cells.push('<row r="'+row+'" ht="16" customHeight="1">'+xml+'</row>');
 }
 return '<?xml version="1.0"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'+
  '<cols><col min="1" max="9" width="22" customWidth="1"/></cols><sheetData>'+
  cells.join("")+'</sheetData><mergeCells count="1"><mergeCell ref="A1:F1"/></mergeCells></worksheet>';
}
const inputZip=api.rebuildZip([
 zippedEntry("[Content_Types].xml","<Types/>"),
 zippedEntry("xl/workbook.xml",book),
 ...names.map((name,i)=>zippedEntry("xl/worksheets/sheet"+(i+1)+".xml",sheet(i+1))),
 zippedEntry("docProps/core.xml","<properties><creator>Original</creator></properties>")
],new Map());
const a=[1,2,3,4].map(i=>({code:"A"+i,mr:"MR-000"+i,
 description:"Equipment "+i,previewSellTHB:130*i,sourceRows:[{tag:"TAG-"+i}]}));
const b=Array.from({length:14},(_,i)=>({code:"B"+(i+1),customerSellTHB:100+i}));
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
 assert.equal(parts.length,9);
 const worksheet=n=>decoder.decode(parts.find(x=>x.name==="xl/worksheets/sheet"+n+".xml").compressed);
 const main=worksheet(1),b10=worksheet(2),c1=worksheet(5);
 assert.match(main,/<c r="A8" s="12" t="inlineStr"><is>/);
 assert.match(main,/<c r="G38" s="12" t="inlineStr"><is><t xml:space="preserve">NOT ESTABLISHED<\/t><\/is><\/c>/);
 assert.match(main,/<c r="G33" s="12"><v>109<\/v><\/c>/); // B10 100 + 9
 assert.match(b10,/<c r="D6" s="12" t="inlineStr"><is><t xml:space="preserve">Spare B10<\/t><\/is><\/c>/);
 assert.match(b10,/<c r="I19" s="12"><v>20<\/v><\/c>/);
 assert.ok(!/<c r="I6" s="12"><v>20<\/v><\/c>/.test(c1),"C price not released");
 assert.ok(worksheet(2).includes('<col min="1" max="9" width="22" customWidth="1"/>'));
 assert.ok(worksheet(2).includes('<mergeCell ref="A1:F1"/>'));
 assert.match(decoder.decode(parts.find(x=>x.name==="docProps/core.xml").compressed),/Original/);
 // original buffer may not be mutated
 assert.equal(inputZip.byteLength,api.rebuildZip([
  zippedEntry("[Content_Types].xml","<Types/>"),zippedEntry("xl/workbook.xml",book),
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
 const real=require(path.join(srcRoot,"project0553/data/releaseCommercialModel0553.js")).buildReleaseCommercialModel0553();
 assert.equal(real.annexTraceAudit.totalRows,16);
 const live=await api.buildNativeWorkingDraft0553(testFile,real);
 const realZip=api.entriesFromZip(new Uint8Array(await live.blob.arrayBuffer()));
 const nativeText=index=>decoder.decode(realZip.find(x=>x.name==="xl/worksheets/sheet"+index+".xml").compressed);
 const cell=(xml,address)=>xml.match(new RegExp('<c r="'+address+'"[^>]*>([\\s\\S]*?)</c>'))?.[1];
 const nativeScope=nativeText(1);
 for(const row of real.b){
  const nativeRow=23+Number(row.code.slice(1));
  for(const col of ["F","G"]){
   const value=cell(nativeScope,col+nativeRow);
   assert(value?.includes(Number.isFinite(row.customerSellTHB)?'<v>'+row.customerSellTHB+'</v>':"NOT ESTABLISHED"),row.code+" current summary cell "+col);
  }
 }
 for(const address of ["F41","G41","F42","G42"])assert(cell(nativeScope,address).includes("NOT QUOTED"));
 assert(cell(nativeScope,"G38").includes("NOT ESTABLISHED"));
 for(const [code,index] of [["B10",2],["B11",3],["B13",4],["C1",5],["C2",6]]){
  const xml=nativeText(index);
  assert(!xml.includes("987654321"),code+" leaked stale native values");
  for(const row of real.annex[code]){
   assert(xml.includes('r="'+row.nativeCells.tagNo+'"'),"Native row missing TAG cell "+row.sourceId);
   assert(xml.includes(row.tagNo),"Native lost ORIGINAL source TAG string "+row.sourceId);
   assert(xml.includes(row.description),"Native lost approved simple description "+row.sourceId);
   assert(xml.includes(row.specification),"Native lost selected specification "+row.sourceId);
   assert(xml.includes(row.materials),"Native lost material/TBC disclosure "+row.sourceId);
   assert(xml.includes('r="'+row.nativeCells.qty+'"'),"Native Qty target missing "+row.sourceId);
   assert(cell(xml,row.nativeCells.qty).includes(row.qty===null?"TBC — OEM SPIR":'<v>'+row.qty+'</v>'));
   if(code.startsWith("B")){
    assert.equal(cell(xml,row.nativeCells.unitPrice),'<v>'+row.customerUnitTHB+'</v>');
    assert.equal(cell(xml,row.nativeCells.totalPrice),'<v>'+row.customerTotalTHB+'</v>');
   }else{
    assert(cell(xml,row.nativeCells.unitPrice).includes("NOT QUOTED"));
    assert(cell(xml,row.nativeCells.totalPrice).includes("NOT QUOTED"));
    assert(cell(xml,"J"+row.nativeRow).includes("OEM confirmation required"));
   }
   if(code.startsWith("C"))
    assert(!new RegExp('<c r="'+row.nativeCells.totalPrice+'"[^>]*><v>').test(xml),
     "C option cannot become a Released Price "+row.sourceId);
  }
  for(let row=6+real.annex[code].length;row<=18;row++)
   for(const col of (code.startsWith("C")?["B","C","D","E","F","G","H","I","J"]:["B","C","D","E","F","G","H","I"]))
    assert.equal(cell(xml,col+row),'<is><t xml:space="preserve"></t></is>',code+" must clear unused "+col+row);
  assert(cell(xml,"I19").includes(code.startsWith("B")?'<v>'+real.annexModels[code].selectedWorkingTHB+'</v>':"NOT QUOTED"));
 }
 assert.deepEqual(real.annexTraceAudit.rowTrace.map(x=>x.sourceToReleaseMatched),Array(16).fill(true));
 assert.deepEqual(real.annexTraceAudit.rowTrace.map(x=>x.releaseToSourceMatched),Array(16).fill(true));
 // Optional private original binary verification; never commit the customer file.
 // npm run validate:0553-native-working-export -- --template="C:\\path\\4-Scope of Supply.xlsx"
 const templateArg=process.argv.find(x=>x.startsWith("--template="));
 if(templateArg){
  const templatePath=path.resolve(templateArg.slice("--template=".length)),bytes=fs.readFileSync(templatePath);
  const result=await api.buildNativeWorkingDraft0553({name:path.basename(templatePath),
   arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)},real);
  const before=api.entriesFromZip(new Uint8Array(bytes)),after=api.entriesFromZip(new Uint8Array(await result.blob.arrayBuffer()));
  assert.deepEqual(after.map(x=>x.name),before.map(x=>x.name));
  const normalizeCells=xml=>xml.replace(/<c\b([^>]*?)(?:\s*\/>|>[\s\S]*?<\/c>)/g,
   (_,attrs)=>'<c'+attrs.replace(/\s+t="[^"]*"/g,"")+'/>');
  for(let i=0;i<before.length;i++){
   const a=await api.readEntry(before[i]),b=await api.readEntry(after[i]);
   if(!/^xl\/worksheets\/sheet[1-6]\.xml$/.test(before[i].name)){
    assert.deepEqual(Array.from(b),Array.from(a),"Unrelated native part changed "+before[i].name);continue;
   }
   const oldXml=decoder.decode(a),newXml=decoder.decode(b);
   assert.equal(normalizeCells(newXml),normalizeCells(oldXml),"Native row geometry/styles/merges changed "+before[i].name);
   const index=Number(before[i].name.match(/sheet(\d+)/)[1]);
   if(index===1){
    for(const row of real.b){
     const nativeRow=23+Number(row.code.slice(1));
     for(const col of ["F","G"])assert(cell(newXml,col+nativeRow).includes(Number.isFinite(row.customerSellTHB)?'<v>'+row.customerSellTHB+'</v>':"NOT ESTABLISHED"));
    }
    for(const address of ["F41","G41","F42","G42"])assert(cell(newXml,address).includes("NOT QUOTED"));
    assert(cell(newXml,"G38").includes("NOT ESTABLISHED"));
   }else{
    const code=annexCodes[index-2];
    for(const row of real.annex[code]){
     for(const [field,value] of [["description",row.description],["tagNo",row.tagNo],["specification",row.specification],["materials",row.materials]]){
      const escaped=value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
      assert(cell(newXml,row.nativeCells[field]).includes(escaped),row.sourceId+" native "+field);
     }
     assert(cell(newXml,row.nativeCells.qty).includes(row.qty===null?"TBC — OEM SPIR":'<v>'+row.qty+'</v>'));
     for(const [field,value] of [["unitPrice",row.customerUnitTHB],["totalPrice",row.customerTotalTHB]])
      assert(cell(newXml,row.nativeCells[field]).includes(code.startsWith("C")?"NOT QUOTED":'<v>'+value+'</v>'));
    }
    assert(cell(newXml,"I19").includes(code.startsWith("C")?"NOT QUOTED":'<v>'+real.annexModels[code].selectedWorkingTHB+'</v>'));
   }
  }
  console.log("PASS actual native XLSX: six original sheets, 16 current rows, styles/merges/geometry and unrelated ZIP parts unchanged; SHA256 "+require("node:crypto").createHash("sha256").update(bytes).digest("hex"));
 }
 console.log("PASS PJ2608-0553 native working draft ZIP: 6 original-style sheets, A+B mapped, 16 bidirectional PTTEP current annex source item rows, C not quoted, geometry preserved");
})().catch(e=>{console.error(e);process.exitCode=1;});
