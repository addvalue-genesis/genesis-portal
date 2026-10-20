// PJ2608-0553 / 10.3.3 native OOXML Working Draft, generated FROM CODE.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"../src/project0553");
const structural=fs.readFileSync(path.join(root,"data/officialWorkbookTemplate0553.js"),"utf8");
const generator=fs.readFileSync(path.join(root,"newNativeWorkbook0553.js"),"utf8");
const src=structural.replace(/\bexport /g,"")+"\n"+
 generator.replace(/^import .*?;\s*$/gm,"").replace(/\bexport /g,"")+
 "\n;this.api={buildNewNativeWorkingWorkbook0553};";
const context={Blob,TextEncoder,Uint8Array,DataView,Date,Map,Object,Math,Error};
vm.runInNewContext(src,context);
const {buildNewNativeWorkingWorkbook0553:build}=context.api;
const model={
 a:[1,2,3,4].map(i=>({code:"A"+i,mr:"MR-000"+i,description:"System "+i,
  sourceRows:[{tag:"SAMPLE-"+i}],previewSellTHB:1000*i})),
 b:Array.from({length:14},(_,i)=>({code:"B"+(i+1),customerSellTHB:100+i})),
 c:[{code:"C1",customerSellTHB:null},{code:"C2",customerSellTHB:null}],
 annex:Object.fromEntries(["B10","B11","B13","C1","C2"].map(k=>[k,[{
  tagNo:"TCAB-508-001",description:"Spare "+k,
  specification:"OEM MODEL pending",materials:"steel",qty:2,
  customerUnitTHB:k.startsWith("B")?10:null,
  customerTotalTHB:k.startsWith("B")?20:null
 }]])),
 annexModels:Object.fromEntries(["B10","B11","B13","C1","C2"].map(k=>[k,{annexLineTotalTHB:20,varianceTHB:k==="B10"?0.02:0}])),
 summary:{aProvisionalCustomerSellTHB:10000,bProvisionalCustomerSellTHB:1491},
 sourceCoverage:{aOverflow:true}
};
const entries=bytes=>{
 const results=new Map(),b=Buffer.from(bytes);
 let offset=0;
 while(offset+30<=b.length&&b.readUInt32LE(offset)===0x04034b50){
  const size=b.readUInt32LE(offset+18),nl=b.readUInt16LE(offset+26),extra=b.readUInt16LE(offset+28);
  const name=b.subarray(offset+30,offset+30+nl).toString("utf8");
  results.set(name,b.subarray(offset+30+nl+extra,offset+30+nl+extra+size).toString("utf8"));
  offset+=30+nl+extra+size;
 }
 return results;
};
(async()=>{
 const draft=build(model);
 assert.match(draft.filename,/^4-Scope of Supply_PJ2608-0553_INTERNAL_WORKING_NOT_RELEASED_\d{8}\.xlsx$/);
 assert.ok(draft.warnings.some(x=>x.includes("B10 Annex variance")));
 const zip=entries(new Uint8Array(await draft.blob.arrayBuffer()));
 assert.equal(zip.size,11);
 const names=["Scope of supply","B10 CommSpares","B11 SpecialTool","B13 Consumerables","C1 CapitalSpares","C2 2Y-Spares"];
 for(const name of names)assert.ok(zip.get("xl/workbook.xml").includes('name="'+name+'"'));
 for(let i=1;i<=6;i++){
  const worksheet=zip.get("xl/worksheets/sheet"+i+".xml");
  assert.ok(worksheet.includes('mergeCells'),"Missing original-format merge structure sheet"+i);
  assert.ok(worksheet.includes('customWidth="1"'));
  assert.ok(worksheet.includes('customHeight="1"'));
 }
 const s=zip.get("xl/worksheets/sheet1.xml");
 assert.match(s,/<c r="C8"[^>]*><is><t xml:space="preserve">System 1<\/t><\/is><\/c>/);
 assert.match(s,/<c r="G8"[^>]*><v>1000<\/v><\/c>/);
 assert.match(s,/<c r="G38"[^>]*><v>11491<\/v><\/c>/);
 assert.match(s,/<c r="G33"[^>]*><v>109<\/v><\/c>/);
 assert.ok(!s.includes(">xxx<"),"Do not preserve dummy 'xxx' source");
 const b10=zip.get("xl/worksheets/sheet2.xml"),c1=zip.get("xl/worksheets/sheet5.xml");
 assert.match(b10,/<c r="D6"[^>]*>.*Spare B10.*<\/c>/);
 assert.match(b10,/<c r="I19"[^>]*><v>20<\/v><\/c>/);
 assert.match(c1,/<c r="I6"[^>]*>.*Not quote.*<\/c>/);
 assert.ok(zip.get("xl/styles.xml").includes('formatCode="#,##0.00"'));
 assert.ok(!/https?:\/\/|indexedDB|type="file"/.test(generator),
  "Generate new native workbook without upload, original binary or local-file picker");
 const broken={...model,annex:{...model.annex,B10:Array.from({length:14},(_,i)=>({description:"Spare"+i,qty:1}))}};
 assert.throws(()=>build(broken),/exceeds native 13 Annex lines/);
 console.log("PASS 0553 new Excel: six original-structured sheets, direct new ZIP, A+B+Annex priced, C Not quote, no picker");
})().catch(e=>{console.error(e);process.exitCode=1;});
