// Template exports must not leave calcChain.xml pointing at a cleared formula.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),cp=require("node:child_process"),os=require("node:os");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src"),frontend=path.resolve(__dirname,"..");
const compile=(m,file)=>{const x=babel.transformFileSync(file,{babelrc:false,configFile:false,cwd:frontend,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 m._compile(x.code,file);};
const originalJS=require.extensions[".js"],originalJSX=require.extensions[".jsx"];
require.extensions[".js"]=(m,file)=>file.startsWith(root+path.sep)?compile(m,file):originalJS(m,file);
require.extensions[".jsx"]=(m,file)=>file.startsWith(root+path.sep)?compile(m,file):(originalJSX||originalJS)(m,file);
require.extensions[".css"]=()=>{};
const from=name=>require(path.join(root,"project0553",name));
const native=from("nativeWorkingDraft0553.js");
const {buildReleaseCommercialModel0553}=from("data/releaseCommercialModel0553.js");
const {buildOfficialUsdRelease0553}=from("data/officialUsdRelease0553.js");
const {selectB3BrownfieldAdditional0553,buildB3BrownfieldOfficialXlsx0553}=from("data/b3BrownfieldAdditional0553.js");
const template=from("data/nativeReleaseTemplate0553.json");
const decode=new TextDecoder();
function fileFromTemplate(){
 const bytes=Uint8Array.from(Buffer.from(template.base64,"base64"));
 return {name:template.sourceName,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)};
}
async function text(entries,name){
 const entry=entries.find(item=>item.name===name);
 assert.ok(entry,"missing "+name);
 return decode.decode(await native.readEntry(entry));
}
function formulaCells(xml){
 return [...xml.matchAll(/<c\b[^>]*\br="([A-Z]+\d+)"[^>]*>[\s\S]*?<\/c>/g)]
  .filter(match=>/<f[\s>]/.test(match[0])).map(match=>match[1]);
}
async function assertCleanWorkbook(bytes,label){
 const entries=native.entriesFromZip(bytes instanceof Uint8Array?bytes:new Uint8Array(bytes));
 assert.ok(!entries.some(entry=>entry.name==="xl/calcChain.xml"),label+" still contains calcChain.xml");
 const types=await text(entries,"[Content_Types].xml");
 const rels=await text(entries,"xl/_rels/workbook.xml.rels");
 assert.ok(!types.includes("calcChain"),label+" content type still names calcChain");
 assert.ok(!rels.includes("calcChain"),label+" workbook rel still names calcChain");
 const sheets=entries.filter(entry=>/^xl\/worksheets\/sheet\d+\.xml$/.test(entry.name));
 assert.ok(sheets.length>=1,label+" has no worksheets");
 for(const entry of entries.filter(item=>item.name.endsWith(".xml"))){
  const xml=decode.decode(await native.readEntry(entry));
  assert.ok(xml.includes("<")&&!xml.includes("\u0000"),label+" "+entry.name+" is not XML text");
  if(entry.name==="xl/sharedStrings.xml"){
   const unique=xml.match(/uniqueCount="(\d+)"/);
   const count=(xml.match(/<si\b/g)||[]).length;
   if(unique)assert.equal(Number(unique[1]),count,label+" shared string uniqueCount");
  }
  if(entry.name.startsWith("xl/worksheets/")){
   const shared=[...xml.matchAll(/<f\b[^>]*\bt="shared"[^>]*>/g)];
   const masters=shared.filter(tag=>/\bref=/.test(tag[0]));
   const indexes=shared.map(tag=>tag[0].match(/\bsi="(\d+)"/)?.[1]).filter(Boolean);
   for(const index of new Set(indexes))assert.equal(masters.filter(tag=>tag[0].includes('si="'+index+'"')).length,1,label+" shared formula "+index);
   const mergeCount=xml.match(/<mergeCells\b[^>]*\bcount="(\d+)"/);
   const merges=(xml.match(/<mergeCell\b/g)||[]).length;
   if(mergeCount)assert.equal(Number(mergeCount[1]),merges,label+" "+entry.name+" merge count");
   assert.equal(formulaCells(xml).length,(xml.match(/<f[\s>]/g)||[]).length);
  }
 }
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"xlsx-calc-"));
 const source=path.join(dir,label.replace(/[^\w.-]+/g,"_")+".xlsx");
 fs.writeFileSync(source,Buffer.from(bytes));
 const profile=path.join(dir,"profile");
 const converted=cp.spawnSync("soffice",["--headless","--norestore","--nolockcheck","--convert-to","xlsx","--outdir",dir,source],{
  env:{...process.env,HOME:profile,TMPDIR:dir},timeout:120000,encoding:"utf8"
 });
 const log=(converted.stdout||"")+(converted.stderr||"");
 assert.equal(converted.status,0,label+" LibreOffice failed\n"+log);
 assert.ok(!/repair|repaired|unreadable content|calcChain/i.test(log),label+" LibreOffice reported a repair\n"+log);
 const well=cp.spawnSync("python3",["-c",`
import zipfile,sys,xml.etree.ElementTree as ET
z=zipfile.ZipFile(sys.argv[1])
assert "xl/calcChain.xml" not in z.namelist()
for name in z.namelist():
    if name.endswith(".xml"):
        ET.fromstring(z.read(name))
print("well-formed",len(z.namelist()))
`,source],{encoding:"utf8"});
 assert.equal(well.status,0,(well.stderr||"")+(well.stdout||""));
}
(async()=>{
 const file=fileFromTemplate();
 const release=buildReleaseCommercialModel0553({thbPerUsd:31.5});
 const official=buildOfficialUsdRelease0553(release);
 const brownfield=selectB3BrownfieldAdditional0553();
 const main=await native.buildNativeWorkingDraft0553(file,release);
 const usd=await native.buildNativeOfficialRelease0553(file,official);
 const extra=await buildB3BrownfieldOfficialXlsx0553(file,brownfield,{priced:true,currency:"thb"});
 await assertCleanWorkbook(new Uint8Array(await main.blob.arrayBuffer()),"main-working-draft");
 await assertCleanWorkbook(new Uint8Array(await usd.blob.arrayBuffer()),"official-usd");
 await assertCleanWorkbook(extra.bytes,"brownfield-quotation");
 const mainXml=decode.decode(await native.readEntry(native.entriesFromZip(new Uint8Array(await main.blob.arrayBuffer())).find(entry=>entry.name==="xl/worksheets/sheet1.xml")));
 assert.ok(mainXml.includes(">905809.53<")&&mainXml.includes(">2438572.5<")&&mainXml.includes(">405405<")&&mainXml.includes(">46683<")&&mainXml.includes(">826875<"));
 assert.ok(!mainXml.includes(">862675.74<"));
 const brownXml=decode.decode(await native.readEntry(native.entriesFromZip(extra.bytes).find(entry=>entry.name==="xl/worksheets/sheet1.xml")));
 assert.ok(!/<f[\s>]/.test(brownXml),"brownfield sheet cleared the template formula but must not keep a formula calcChain");
 assert.ok(brownXml.includes("668,115.00"));
 console.log("PASS 0553 xlsx calcChain: main workbook, official USD, and brownfield quotation open without a stale calculation chain");
})().catch(error=>{console.error(error);process.exit(1);});
