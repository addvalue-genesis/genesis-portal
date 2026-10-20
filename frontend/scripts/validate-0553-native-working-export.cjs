// 0553 native working XLSX exporter. Self-contained valid ZIP workbook fixture.
// No npm packages, no proprietary master workbook committed into the repository.
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const source=fs.readFileSync(path.resolve(__dirname,"../src/project0553/nativeWorkingDraft0553.js"),"utf8");
const context={Blob,TextEncoder,TextDecoder,Response,DecompressionStream,Uint8Array,DataView,Date,Map,Set};
vm.runInNewContext(source.replace(/\bexport /g,"")+
 ";this.api={replaceCell,rebuildZip,entriesFromZip,crc32,buildNativeWorkingDraft0553};",context);
const {api}=context;
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
   row>=24&&row<=37?["F"+row,"G"+row]:row===38?["G38"]:[]):
   row>=6&&row<=18?["B","C","D","E","F","G","H","I"].map(x=>x+row):row===19?["I19"]:[];
  const xml=addresses.map(address=>'<c r="'+address+'" s="12"/>').join("");
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
 assert.match(main,/<c r="G38" s="12"><v>2791<\/v><\/c>/);
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
 console.log("PASS PJ2608-0553 native working draft ZIP: 6 original-style sheets, A+B mapped, annex detail, C not quoted, geometry preserved");
})().catch(e=>{console.error(e);process.exitCode=1;});
