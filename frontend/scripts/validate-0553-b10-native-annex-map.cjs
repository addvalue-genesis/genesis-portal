// PJ2608-0553 — ORIGINAL B10 template must show ONLY 14 MR Attachment-5
// stage spare functions. 1/4/10% installation Qty rules never become spare SKU Qty.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"../src"),babel=require("@babel/core");
const original=require.extensions[".js"];
for(const ext of [".js",".jsx"])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?
 m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code,f):original(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const {selectB10StageSpareSelection0553}=from("data/b10StageSpareSelection0553.js");
const {selectB10NativeAnnexReview0553}=from("data/b10NativeAnnexReview0553.js");
const {selectB10BudgetaryFunctionalAllocation0553}=from("data/b10BudgetaryFunctionalAllocation0553.js");
const {B10StageSpareSelection0553}=from("B10StageSpareSelection0553.jsx");
const {B10NativeAnnexReview0553}=from("B10NativeAnnexReview0553.jsx");
const {buildReleaseCommercialModel0553}=from("data/releaseCommercialModel0553.js");
const stage=selectB10StageSpareSelection0553(),annex=selectB10NativeAnnexReview0553(),allocation=selectB10BudgetaryFunctionalAllocation0553();
assert.equal(stage.upstreamInstalledBomModule,"bid.budget.bom.zwp20.mr-502-001.4.required-bom");
assert.deepEqual(Array.from(stage.phases),["ERECTION","PRE_COMMISSIONING","COMMISSIONING","START_UP"]);
assert.equal(stage.originalZwp20RequiredBom.length,8);
for(const tag of ["MR-502-001","MR-502-001A","ANT-502-001","LAN-502-001",
 "DATO-507-001","TCAB-500-001","SA-502-001","Bulk Material"])
 assert(stage.originalZwp20RequiredBom.some(x=>x.tag===tag),"Missing ZWP20 installed BOM "+tag);
assert.deepEqual(Array.from(stage.commissioningSiteKits).map(x=>x.kits),[4,3,4,3]);
assert.equal(stage.stageRows.length,14);
assert(stage.stageRows.every(x=>x.physicalSpareQty===null&&x.unitSpareSellUSD===null&&
 x.replacementSku===null&&!x.commercialReleaseAllowed));
assert.equal(annex.originalSheet,"B10 CommSpares");
assert.deepEqual(Array.from(annex.layoutColumns),["B","C","D","E","F","G","H","I"]);
assert.equal(annex.rows.length,14);
assert.equal(annex.totalRow,20);
assert.equal(annex.originalDataCapacity,13);
assert.equal(annex.rows.filter(x=>x.isRequirementFamily).length,14);
assert.deepEqual(["MR-0001","MR-0002","MR-0003","MR-0004"].map(mr=>annex.rows.filter(x=>x.mr===mr).length),[4,3,4,3]);
assert.equal(new Set(annex.rows.map(x=>x.id)).size,14);
assert(annex.rows.every(x=>x.b10PurchaseQty===null&&x.b10UnitSellUSD===null&&
 x.b10ExtendedSellUSD===null&&!x.customerIssueAllowed&&x.presentationQty===1&&
 x.presentationUnit==="LOT"&&Number.isFinite(x.budgetaryUnitPriceUSD)&&x.budgetaryUnitPriceUSD>0));
assert.equal(annex.selectedMRKitWorkingSellTHB,509827.5);
assert.equal(annex.budgetaryPresentationTotalUSD,16185);
assert.equal(allocation.totalAllocatedUSD,16185);
assert.deepEqual(Array.from(allocation.byOwner).map(x=>x.sourceTotalUSD),[7280,2730,2860,3315]);
assert.deepEqual(Array.from(annex.rows).map(x=>x.budgetaryUnitPriceUSD),
 [1820,1820,1820,1820,910,910,910,715,715,715,715,1105,1105,1105]);
assert(annex.rows.every(x=>!(/PENDING|SPIR|INTERNAL|BUDGET|WORKING|PRICE/i).test(x.specification+" "+x.materials)),
 "No internal message belongs inside customer Detail Specification or Materials");
assert(annex.rows.some(x=>x.tag.includes("SA-502-001")));
assert(annex.rows.some(x=>x.proposedPartNo));
assert(annex.rows.every(x=>!x.partNo));
assert(annex.rows.some(x=>x.physicalStageNames.includes("Erection")));
assert(annex.rows.some(x=>x.physicalStageNames.includes("Pre-commissioning")));
assert(annex.rows.some(x=>x.physicalStageNames.includes("Commissioning")));
assert(annex.rows.some(x=>x.physicalStageNames.includes("Start-up")));
const stageHtml=renderToStaticMarkup(React.createElement(B10StageSpareSelection0553,{internal:true,onOpenSource:()=>{}}));
assert.equal((stageHtml.match(/data-b10-stage-spare-id=/g)||[]).length,14);
assert(stageHtml.includes("10% rules for PLC Based SCADA"));
const internal=renderToStaticMarkup(React.createElement(B10NativeAnnexReview0553,{internal:true,onOpenSource:()=>{},variant:"release"}));
const customer=renderToStaticMarkup(React.createElement(B10NativeAnnexReview0553,{internal:false,variant:"official"}));
for(const html of [internal,customer]){
 assert(html.includes("CIF Zhuhai Port"));
 assert.equal((html.match(/data-native-b10-source-id=/g)||[]).length,14);
 assert.equal((html.match(/data-b10-requirement-id=/g)||[]).length,14);
 assert(html.includes("UNIT PRICE (USD)")&&html.includes("TOTAL PRICE (USD)"));
 assert(html.includes("B10 — Original Annex: Spare Part Schedule"));
}
assert(internal.includes("Optional OEM quote references · not selected as spare cost"));
assert(internal.includes("sourceSelectionId:x.id")===false); // JSX source expression does not leak to HTML
assert(!customer.includes("242,460.00"));
assert(!customer.includes("NG/260916-ADV-DAP1"));
assert(!customer.includes("安装"));
assert(internal.includes("16,185.00"));
assert(internal.includes("1,820.00"));
assert(customer.includes("To be quoted"));
assert(!customer.includes("1,820.00"));
assert(!customer.includes("16,185.00"));
const kit=fs.readFileSync(path.join(root,"project0553/B10KitPriceSummary0553.jsx"),"utf8");
assert(kit.includes("<B10NativeAnnexReview0553 internal={internal}"));
assert(kit.includes("<B10StageSpareSelection0553 internal"));
const working=fs.readFileSync(path.join(root,"project0553/ScopeBcAnnexDetail0553.jsx"),"utf8");
assert(working.includes('code==="B10"&&inWorking&&<B10StageSpareSelection0553 internal'));
const navigator=fs.readFileSync(path.join(root,"project0553/CommercialWorkspace.jsx"),"utf8");
const releaseUI=fs.readFileSync(path.join(root,"project0553/ReleaseCustomerWorkbook0553.jsx"),"utf8");
for(const s of ["sourceSelectionId:item.sourceSelectionId||null","Return to exact B10 spare function",
 "stage-spare-selection.","setReleaseAnnexTarget(prev=>({code,sourceId,sourceSelectionId"])
 assert(navigator.includes(s),"B10 exact roundtrip missing "+s);
assert(releaseUI.includes("focusAnnexTarget.sourceSelectionId"));
assert(releaseUI.includes("buildNativeB10ItemizedReview0553(workingOriginal,review)"));
const native=fs.readFileSync(path.join(root,"project0553/nativeWorkingDraft0553.js"),"utf8");
assert(native.includes("export async function buildNativeB10ItemizedReview0553"));
const box={Blob,TextEncoder,TextDecoder,Response,DecompressionStream,Uint8Array,DataView,Date,Map,Set};
vm.runInNewContext(native.replace(/\bexport /g,"")+";this.ext={buildNativeB10ItemizedReview0553,buildNativeWorkingDraft0553,entriesFromZip,readEntry};",box);
const embedded=from("data/nativeReleaseTemplate0553.json");
const bytes=Buffer.from(embedded.base64,"base64");
const file={name:embedded.sourceName,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)};
const decoder=new TextDecoder();
(async()=>{
 const release=buildReleaseCommercialModel0553({thbPerUsd:31.5});
 const existingWorking=await box.ext.buildNativeWorkingDraft0553(file,release);
 const reviewOnWorking=await box.ext.buildNativeB10ItemizedReview0553(
  {name:existingWorking.filename,arrayBuffer:()=>existingWorking.blob.arrayBuffer()},annex);
 assert.equal(reviewOnWorking.insertedRows,1);
 const combined=box.ext.entriesFromZip(new Uint8Array(await reviewOnWorking.blob.arrayBuffer()));
 const main=decoder.decode(await box.ext.readEntry(combined.find(x=>x.name==="xl/worksheets/sheet1.xml")));
 assert(main.includes("509827.5"),"Same Working B10 price owner must appear in source-linked summary");
 const checkB10=decoder.decode(await box.ext.readEntry(combined.find(x=>x.name==="xl/worksheets/sheet2.xml")));
 assert(checkB10.includes(annex.rows[13].description)&&checkB10.includes('<mergeCell ref="B20:H20"'),
  "New B10 Working→Annex export must retain all 14 candidate functions and moved total");
 const result=await box.ext.buildNativeB10ItemizedReview0553(file,annex);
 assert.equal(result.rowCount,14);assert.equal(result.insertedRows,1);assert.equal(result.totalRow,20);
 const inputZip=box.ext.entriesFromZip(bytes),outputZip=box.ext.entriesFromZip(new Uint8Array(await result.blob.arrayBuffer()));
 assert.deepEqual(outputZip.map(e=>e.name),inputZip.map(e=>e.name));
 for(let i=0;i<inputZip.length;i++)if(inputZip[i].name!=="xl/worksheets/sheet2.xml")
  assert.deepEqual(Array.from(await box.ext.readEntry(outputZip[i])),Array.from(await box.ext.readEntry(inputZip[i])),
   "Original unrelated XLSX ZIP part modified: "+inputZip[i].name);
 const xml=decoder.decode(await box.ext.readEntry(outputZip.find(e=>e.name==="xl/worksheets/sheet2.xml")));
 assert(xml.includes('<mergeCell ref="B20:H20"'));
 assert(xml.includes('<mergeCell ref="B21:E21"'));
 assert(!xml.includes('<mergeCell ref="B19:H19"'));
 const cell=a=>xml.match(new RegExp('<c\\b[^>]*r="'+a+'"[^>]*>([\\s\\S]*?)<\\/c>'))?.[1]||"";
 assert(cell("B6").includes("1.01"));
 assert(cell("D6").includes(annex.rows[0].description));
 assert(cell("E6").includes("protective fuse"));
 assert(cell("G6").includes("<v>1</v>"));
 assert(cell("H6").includes("<v>1820</v>"));
 assert(cell("I19").includes("<v>1105</v>"));
 assert(cell("I20").includes("<v>16185</v>"));
 assert(cell("B21").includes("BUDGETARY WORKING"));
 assert(cell("H4").includes("BUDGETARY WORKING SELL"));
 for(const row of annex.rows)assert(xml.includes(row.description),"Native missing MR item "+row.id);
 console.log("PASS B10 source Working THB509827.50 / USD16185 allocated into 14 functional LOT lines, Spec/Materials customer-clean, 1 extra original B10 row, 6 original sheets and source→release retained; no OEM SKU rate or physical spare Qty falsely approved");
})().catch(e=>{console.error(e);process.exitCode=1;});
