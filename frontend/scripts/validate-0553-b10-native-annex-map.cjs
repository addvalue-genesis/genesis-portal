// B10 8-column original native Annex: SAME read model in browser and original XLSX.
// Dynamic >13 rows; source quote USD is NOT B10 CIF spare SELL.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"../src");
const babel=require("@babel/core"),original=require.extensions[".js"];
for(const ext of [".js",".jsx"])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?
 m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code,f):original(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const {selectB10NativeAnnexReview0553}=from("data/b10NativeAnnexReview0553.js");
const {B10NativeAnnexReview0553}=from("B10NativeAnnexReview0553.jsx");
const annex=selectB10NativeAnnexReview0553();
assert.equal(annex.originalSheet,"B10 CommSpares");
assert.deepEqual(Array.from(annex.layoutColumns),["B","C","D","E","F","G","H","I"]);
assert.equal(annex.rows.length,35);
assert.equal(annex.totalRow,41);
assert.equal(annex.rows.filter(x=>x.isRequirementFamily).length,14);
assert.equal(annex.b10CifUnitSellConfirmedCount,0);
assert(annex.rows.every(x=>x.b10PurchaseQty===null&&x.b10UnitSellUSD===null&&
 x.b10ExtendedSellUSD===null&&x.customerIssueAllowed===false));
assert.equal(new Set(annex.rows.map(x=>x.id)).size,35);
assert(annex.rows.some(x=>x.partNo==="IE-3400-8P2S-E"));
assert(annex.rows.some(x=>x.partNo==="3K-SC-HAZ-RF4958-GPS-01"));
assert(annex.rows.some(x=>x.partNo===null&&x.description.startsWith("IDU")));
assert(annex.rows.some(x=>x.referenceCurrency==="THB"&&
 Number.isFinite(x.referenceUnitUSD)&&x.specification.includes("IE-3400")));
const internal=renderToStaticMarkup(React.createElement(B10NativeAnnexReview0553,{internal:true,variant:"release",onOpenSource:()=>{}}));
const customer=renderToStaticMarkup(React.createElement(B10NativeAnnexReview0553,{internal:false,variant:"official"}));
for(const html of [internal,customer]){
 assert(html.includes("Original Item / Source")&&html.includes("Equipment composition / Spare-Part Coverage"));
 assert(html.includes("IE-3400-8P2S-E")&&html.includes("3K-SC-HAZ-RF4958-GPS-01"));
 assert.equal((html.match(/data-native-b10-source-id=/g)||[]).length,35);
 assert.equal((html.match(/data-b10-requirement-id=/g)||[]).length,14);
}
assert(internal.includes("242,460.00"));
assert(!customer.includes("242,460.00"));
assert(!customer.includes("安装"));
assert(customer.includes("CIF ZHUHAI PORT — USD OFFER PENDING"));
assert(customer.includes("To be quoted"));

const native=fs.readFileSync(path.join(root,"project0553/nativeWorkingDraft0553.js"),"utf8");
assert(native.includes("export async function buildNativeB10ItemizedReview0553"));
const box={Blob,TextEncoder,TextDecoder,Response,DecompressionStream,Uint8Array,DataView,Date,Map,Set};
vm.runInNewContext(native.replace(/\\bexport /g,"")+";this.ext={buildNativeB10ItemizedReview0553,entriesFromZip,readEntry};",box);
const embedded=from("data/nativeReleaseTemplate0553.json"),originalBytes=Buffer.from(embedded.base64,"base64");
const asFile={name:embedded.sourceName,arrayBuffer:async()=>originalBytes.buffer.slice(originalBytes.byteOffset,originalBytes.byteOffset+originalBytes.byteLength)};
const decoder=new TextDecoder();
(async()=>{
 const r=await box.ext.buildNativeB10ItemizedReview0553(asFile,annex);
 assert.equal(r.rowCount,35);
 assert.equal(r.insertedRows,22);
 assert.equal(r.totalRow,41);
 assert(r.filename.includes("INTERNAL_NOT_RELEASED"));
 const original=box.ext.entriesFromZip(originalBytes),
  changed=box.ext.entriesFromZip(new Uint8Array(await r.blob.arrayBuffer()));
 assert.deepEqual(changed.map(x=>x.name),original.map(x=>x.name),"Six original sheet membership and Zip entries must be preserved");
 for(let i=0;i<original.length;i++)if(original[i].name!=="xl/worksheets/sheet2.xml")
  assert.deepEqual(Array.from(await box.ext.readEntry(changed[i])),Array.from(await box.ext.readEntry(original[i])),
   "Unrelated native file changed "+original[i].name);
 const sheetEntry=changed.find(x=>x.name==="xl/worksheets/sheet2.xml");
 const xml=decoder.decode(await box.ext.readEntry(sheetEntry));
 assert(xml.includes('<mergeCell ref="B41:H41"'));
 assert(xml.includes('<mergeCell ref="B42:E42"'));
 assert(!xml.includes('<mergeCell ref="B19:H19"'));
 assert.equal((xml.match(/<row r="41"/g)||[]).length,1);
 assert.equal((xml.match(/<row r="42"/g)||[]).length,1);
 const readCell=addr=>xml.match(new RegExp('<c\\\\b[^>]*\\\\br="'+addr+'"[^>]*>([\\\\s\\\\S]*?)<\\\\/c>'))?.[1]||"";
 assert(readCell("B6").includes("1.01"));
 assert(readCell("E6").includes("Original Item / Source"));
 assert(readCell("D40").includes("RACON"));
 assert(readCell("B41").includes("NOT ADDITIVE")||readCell("B41").includes("NOT ADDITIVE".toLowerCase())||readCell("B41").includes("SOURCE REFERENCE"));
 assert(readCell("I41").includes("NOT QUOTED"));
 assert(readCell("B42").includes("INTERNAL REVIEW"));
 assert(readCell("H4").includes("CIF ZHUHAI PORT"));
 assert(xml.includes('r="B39"')&&xml.includes('r="I40"'));
 console.log("PASS 0553 B10 original 8-column Annex: 35 source-mapped lines, 22 extra same-sheet rows, footer row41, same 6 sheets, 14 OEM spare functions, quoted source USD not CIF SELL");
})().catch(e=>{console.error(e);process.exitCode=1;});
