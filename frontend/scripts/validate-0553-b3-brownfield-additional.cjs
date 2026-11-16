// Additional brownfield proposal is read-only. 14 team-days x the existing
// SAT team-day rate must stay 793,800, and the BOM note must stay last.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const frontend=path.resolve(__dirname,"..");
const compile=(m,file)=>{const x=babel.transformFileSync(file,{babelrc:false,configFile:false,cwd:frontend,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 m._compile(x.code,file);};
const originalJS=require.extensions[".js"],originalJSX=require.extensions[".jsx"];
require.extensions[".js"]=(m,file)=>file.startsWith(root+path.sep)?compile(m,file):originalJS(m,file);
require.extensions[".jsx"]=(m,file)=>file.startsWith(root+path.sep)?compile(m,file):(originalJSX||originalJS)(m,file);
require.extensions[".css"]=()=>{};
const data=require(path.join(root,"project0553/data/b3BrownfieldAdditional0553.js"));
const ui=require(path.join(root,"project0553/B3BrownfieldAdditional0553.jsx"));
const sat=require(path.join(root,"project0553/data/b3SelectedSatSurveyPrice0553.js")).selectB3SelectedSatSurveyPrice0553();
const NOTE="Note: Working days on the Greenfield/base B3 scope have been reduced by 5 working days. / ปรับลดวันทำงานไปที่ Greenfield/base B3 ลดลง 5 วันทำงาน";
const model=data.selectB3BrownfieldAdditional0553();
assert.equal(data.B3BF_LAST_LINE_NOTE_0553,NOTE);
assert.equal(model.lastLineNote,NOTE);
assert.equal(model.bomLines.at(-1).kind,"note");
assert.equal(model.bomLines.at(-1).text,NOTE);
assert.equal(sat.satTeamDaySellTHB,56700);
assert.equal(model.teamDayTHB,sat.satTeamDaySellTHB);
assert.equal(model.netCalendarDays,14);
assert.equal(model.netCalendarDays*model.teamDayTHB,793800);
assert.equal(model.proposalTHB,793800);
assert.equal(model.proposalUSD,25200);
assert.equal(model.teamDayUSD,1800);
assert.equal(model.proposalUSD*model.fxTHBPerUSD,model.proposalTHB);
assert.equal(model.teamDayUSD*model.fxTHBPerUSD,model.teamDayTHB);
assert.equal(model.grandTotalTHB,793800);
assert.equal(model.grandTotalUSD,25200);
assert.equal(model.a1Rows[8].sn,"A1.9");
assert.equal(model.a1Rows[8].sourceRowIndex,49);
assert.equal(model.a1Rows[8].site,"ZWP11");
assert.equal(model.a1Rows[8].tagText,"MR-502-005A MR-502-005B\nANT-502-005");
assert.equal(model.a1Rows[8].qtyText,"1 Set\n1 Set\n1 Set");
assert.equal(model.a1Rows[8].description,"Subscriber Radio (ODU) Subscriber Radio (IDU) SCADA Antenna");
assert.equal(model.a1Rows[8].unitText,"");
assert.equal(model.a1Rows[9].tagText,"SA- 507-005");
assert.equal(model.a1Rows[9].qtyText,"1 Set");
assert.equal(model.a1Rows[9].unitText,"Set");
assert.equal(model.a1Rows[10].tagText,"TCAB-500-003");
assert.equal(model.a1Rows[11].qtyText,"1 Lot");
assert.ok(model.a1Rows[11].description.includes("\n"));
assert.equal(data.B3BF_JUTAL_NOTE_0553,"Note: Installation and cable routing are by the Jutal team. / งานติดตั้งและเดินสายโดยทีม Jutal");
assert.equal(model.jutalNote,data.B3BF_JUTAL_NOTE_0553);
assert.equal(model.bomLines.at(-2).text,model.jutalNote);
assert.ok(!model.bomLines.some(line=>["BF.1.5","BF.1.6","BF.1.7"].includes(line.id)));
assert.equal(data.b3BrownfieldExportFileName0553({audience:"official",extension:"csv"}),"MM-ZTK-1F-GEN-ADV-TEL-QUO-0001 Rev.00.csv");
assert.equal(data.b3BrownfieldExportFileName0553({audience:"internal",extension:"csv"}),"MM-ZTK-1F-GEN-ADV-TEL-QUO-0001 Rev.00_INTERNAL.csv");
assert.equal(data.b3BrownfieldExportFileName0553({audience:"official"}),"MM-ZTK-1F-GEN-ADV-TEL-QUO-0001 Rev.00");
assert.equal(data.b3BrownfieldExportFileName0553({audience:"internal"}),"MM-ZTK-1F-GEN-ADV-TEL-QUO-0001 Rev.00_INTERNAL");
assert.throws(()=>data.b3BrownfieldExportFileName0553({extension:"docx"}));
assert.throws(()=>data.b3BrownfieldExportFileName0553({extension:"doc"}));
assert.equal(model.partATHB,0);
assert.equal(model.partBReferencePriceTHB,null);
assert.equal(model.baseB3Modified,false);
assert.equal(model.originalQuotationUnchanged,true);
assert.equal(model.baseReadOnly.workingSellTHB,2322450);
assert.equal(model.baseReadOnly.appliedChangeTHB,0);
assert.equal(model.carveOut.appliedToBase,false);
assert.equal(model.carveOut.appliedToProposal,false);
assert.equal(model.carveOut.c1.valueTHB,252000);
assert.equal(model.carveOut.c2.valueTHB,283500);
assert.deepEqual(model.a1Rows.map(row=>row.site).filter((site,i,all)=>all.indexOf(site)===i),["ZPQ","ZWP8","ZWP11"]);
assert.ok(model.a1Rows.every(row=>row.status==="Supplied under base"&&row.priceTHB===null));
assert.ok(model.a1Rows.every(row=>row.installer.includes("Jutal")));
assert.equal(model.a1Rows.find(row=>row.site==="ZWP11").jbState,"OPEN");
assert.ok(model.otherPartA.every(row=>row.status==="Not in scope (greenfield ZWP20-23)"&&row.priceTHB===null));
assert.ok(model.partB.every(row=>row.priceTHB===null));
assert.equal(model.partB.find(row=>row.code==="B3").note,"Original quotation, unchanged");
for(const topic of ["MOB/DEMOB","Accommodation / POB / medical / visa","Per-site split","Carve-out basis C1 vs C2","ZWP11 JB new vs existing","Termination owner","ZPQ DMR integration scope","ZPQ PABX FXS for ZWP20-23","ZPQ radio DMR SLR5300 vs TETRA","Commissioning responsibility"])
 assert.ok(model.openItems.some(item=>item.topic===topic),"missing open item "+topic);
assert.ok(model.siteRows.every(row=>row.days===null&&row.priceTHB===null));
const pricedCsv=data.buildB3BrownfieldAdditionalCsv0553(model,{priced:true,itemized:true});
const unpricedCsv=data.buildB3BrownfieldAdditionalCsv0553(model,{priced:false,itemized:true});
const lumpCsv=data.buildB3BrownfieldAdditionalCsv0553(model,{priced:true,itemized:false});
assert.ok(pricedCsv.includes(NOTE)&&pricedCsv.includes("793,800.00"));
assert.ok(!unpricedCsv.includes("793,800")&&!unpricedCsv.includes("Unit Rate (THB)")&&unpricedCsv.includes(NOTE));
assert.ok(lumpCsv.includes("793,800.00")&&!lumpCsv.includes("441,000.00"));
const partABeforePartB=(text,label)=>{
 const a=text.indexOf("\nA1,"),b=text.indexOf("\nB3-BF,");
 assert.ok(a>=0&&b>a,label+": Part A must precede Part B");
 assert.ok(text.lastIndexOf(NOTE)>b,label+": the Greenfield/base note stays after Part B");
 assert.ok(text.trimEnd().endsWith(NOTE)||text.split("\n").at(-1).includes(NOTE),label+": the note stays the last line");
};
partABeforePartB(pricedCsv,"priced csv");
partABeforePartB(unpricedCsv,"unpriced csv");
partABeforePartB(lumpCsv,"lump csv");
const render=props=>renderToStaticMarkup(React.createElement(ui.B3BrownfieldAdditional0553,props));
const pricedHtml=render({initialPriced:true,initialItemized:true});
const unpricedHtml=render({initialPriced:false,initialItemized:true});
const lumpHtml=render({initialPriced:true,initialItemized:false});
assert.ok(pricedHtml.includes(NOTE)&&pricedHtml.includes("793,800.00")&&pricedHtml.includes("Unit Rate (THB)"));
assert.ok(pricedHtml.includes("data-testid=\"b3bf-total\"")&&pricedHtml.includes("Open items"));
assert.ok(!unpricedHtml.includes("793,800")&&!unpricedHtml.includes("Unit Rate (THB)")&&!unpricedHtml.includes("data-testid=\"b3bf-total\"")&&unpricedHtml.includes(NOTE));
assert.ok(lumpHtml.includes("793,800.00")&&!lumpHtml.includes("441,000.00")&&lumpHtml.includes("LUMP SUM LOT MODE"));
const scheduleOrder=(html,label)=>{
 const a=html.indexOf("A1 · MR-0001"),b=html.indexOf("B3-BF · Brownfield inspection");
 assert.ok(a>=0&&b>a,label+": Part A must precede Part B");
 assert.ok(html.indexOf(NOTE)>b,label+": the Greenfield/base note stays after Part B");
};
scheduleOrder(pricedHtml,"priced");
scheduleOrder(unpricedHtml,"unpriced");
scheduleOrder(lumpHtml,"lump");
const absentRows=text=>!text.includes("BF.1.5")&&!text.includes("BF.1.6")&&!text.includes("BF.1.7")&&!text.includes("Offshore transfer")&&!text.includes("boat / helicopter");
for(const [label,text] of [["priced csv",pricedCsv],["unpriced csv",unpricedCsv],["lump csv",lumpCsv],["priced",pricedHtml],["unpriced",unpricedHtml],["lump",lumpHtml]]){
 assert.ok(absentRows(text),label+": BF.1.5/BF.1.6/BF.1.7 must be absent");
 assert.ok(text.includes(data.B3BF_JUTAL_NOTE_0553),label+": Jutal note missing");
 assert.ok(text.lastIndexOf(NOTE)>text.lastIndexOf(data.B3BF_JUTAL_NOTE_0553),label+": Greenfield note must follow the Jutal note");
}
const officialHtml=render({initialPriced:true,initialItemized:true,initialVersion:"official",initialCurrency:"both"});
const officialThb=render({initialPriced:true,initialItemized:false,initialVersion:"official",initialCurrency:"thb"});
const officialCsv=data.buildB3BrownfieldAdditionalCsv0553(model,{priced:true,itemized:true,version:"official",currency:"both"});
const baseMoney=n=>n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const partASum=model.baseCustomerPreview.partA.reduce((sum,part)=>sum+(Number.isFinite(part.previewSellTHB)?part.previewSellTHB:0),0);
const officialSchedule=data.selectB3BrownfieldOfficialSchedule0553(model,{priced:true,itemized:true,currency:"thb"});
assert.equal(model.baseCustomerPreview.source,"buildReleaseCommercialModel0553");
assert.equal(model.baseCustomerPreview.thbPerUsd,31.5);
assert.deepEqual(model.baseCustomerPreview.partA.map(part=>part.previewSellTHB),[7643874.13,4088522.84,1203800,9213750]);
assert.notEqual(model.grandTotalTHB,partASum);
assert.equal(model.grandTotalTHB,793800);
assert.ok(officialHtml.includes("25,200.00 USD")&&officialHtml.includes("793,800.00")&&officialHtml.includes("Part A: BASIC")&&officialHtml.includes("Part B: OTHERS"));
assert.ok(officialHtml.indexOf("Part A: BASIC")<officialHtml.indexOf(">B3<")&&officialHtml.indexOf(">B3<")<officialHtml.indexOf(">B3-BF<"));
assert.ok(officialHtml.indexOf(">B3-BF<")<officialHtml.indexOf("Total Additional (B3-BF)"));
assert.ok(officialThb.includes("Total Additional (B3-BF)")&&officialThb.includes("793,800.00")&&!officialThb.includes("25,200"));
for(const part of model.baseCustomerPreview.partA){
 const locations=part.locations.length?"Locations: "+part.locations.join(", "):"TBC";
 const price=Number.isFinite(part.previewSellTHB)?baseMoney(part.previewSellTHB):"—";
 const row=officialSchedule.rows.find(entry=>entry.cells[0]===part.code);
 assert.equal(row.cells[5],price);
 assert.equal(row.cells[6],price);
 assert.equal(row.cells[7],"Quoted");
 assert.equal(row.cells[3],locations);
 assert.ok(officialThb.includes(locations)&&officialThb.includes(part.description));
 if(Number.isFinite(part.previewSellTHB)){
  assert.ok(officialThb.includes(price),"official THB missing base price "+part.code);
  assert.ok(officialCsv.includes(price));
 }
}
const b3Row=officialSchedule.rows.find(entry=>entry.cells[0]==="B3");
const bfRow=officialSchedule.rows.find(entry=>entry.cells[0]==="B3-BF");
assert.equal(b3Row.cells[2],model.baseCustomerPreview.b3.name);
assert.ok(b3Row.cells[3].includes(model.baseCustomerPreview.b3.releaseText));
assert.ok(b3Row.cells[3].includes(model.baseCustomerPreview.b3.compactText));
assert.equal(b3Row.cells[6],"Quoted");
assert.ok(officialThb.includes("Included SAT: 2 persons")&&officialThb.includes("Proposed standby"));
assert.ok(bfRow.cells[3].includes("14 team-days")&&bfRow.cells[5]==="793,800.00"&&bfRow.cells[6]==="793,800.00"&&bfRow.cells[7]==="");
assert.ok(officialThb.includes("14 team-days")&&officialThb.includes("USD 1,000.00 / 800.00 per person/day @31.5"));
for(const code of ["B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","B14"]){
 assert.ok(officialHtml.includes(">"+code+"<"),"official view missing "+code);
 assert.ok(officialCsv.includes("\n"+code+","),"official csv missing "+code);
}
assert.ok(officialHtml.includes("Quoted")&&officialHtml.includes(">B3-BF<"));
assert.ok(!officialHtml.includes("Supplied under base")&&!officialHtml.includes("Breakdown (incl. in B3-BF)")&&!officialHtml.includes("Net additional")&&!officialHtml.includes("TBA"));
assert.ok(!officialHtml.includes("2,322,450")&&!officialCsv.includes("2,322,450"));
assert.ok(!officialHtml.includes("BF.1.3")&&!officialHtml.includes("Existing SAT role rate")&&!officialHtml.includes("Offshore POB"));
assert.ok(!officialCsv.includes("BF.1.3")&&!officialCsv.includes("Existing SAT role rate")&&!officialCsv.includes("Offshore POB")&&!officialCsv.includes("Breakdown (incl. in B3-BF)"));
assert.ok(officialCsv.includes("25,200.00 USD")&&officialCsv.includes("793,800.00")&&officialCsv.includes("Quoted")&&officialCsv.includes("Total Additional (B3-BF)"));
assert.ok(officialCsv.split("\n").at(-1).includes(NOTE));
assert.ok(officialCsv.lastIndexOf(NOTE)>officialCsv.lastIndexOf(data.B3BF_JUTAL_NOTE_0553));
const officialUnpriced=render({initialPriced:false,initialItemized:true,initialVersion:"official",initialCurrency:"both"});
assert.ok(!officialUnpriced.includes("793,800")&&!officialUnpriced.includes("25,200")&&!officialUnpriced.includes("1,000.00")&&officialUnpriced.includes("Quoted"));
assert.ok(officialUnpriced.includes("SAMTEL preparation")&&!officialUnpriced.includes("Included SAT")&&!officialUnpriced.includes("TBA"));
for(const part of model.baseCustomerPreview.partA)if(Number.isFinite(part.previewSellTHB))assert.ok(!officialUnpriced.includes(baseMoney(part.previewSellTHB)));
assert.ok(pricedHtml.includes("BF.1.3")&&pricedHtml.includes("Existing SAT role rate")&&pricedHtml.includes("Offshore POB"));
const leak=/793,?800|56,?700|25,?200|441,?000|352,?800|14,?000|11,?200|1,?800|1,?000|31\.5/;
for(const view of [
 {initialPriced:false,initialCurrency:"both",initialVersion:"internal"},
 {initialPriced:false,initialCurrency:"usd",initialVersion:"official"},
 {initialPriced:false,initialItemized:false,initialCurrency:"thb",initialVersion:"internal"}
]){
 const html=render(view);
 const csv=data.buildB3BrownfieldAdditionalCsv0553(model,{priced:false,itemized:view.initialItemized!==false,version:view.initialVersion,currency:view.initialCurrency});
 assert.ok(!leak.test(html)&&!leak.test(csv),"unpriced view leaked a money figure");
 assert.ok(absentRows(html)&&absentRows(csv));
}
const uiSource=fs.readFileSync(path.join(root,"project0553/B3BrownfieldAdditional0553.jsx"),"utf8");
assert.ok(!/docx|\.doc\b|Word export|Export Word/i.test(uiSource),"this tab must not offer a Word export");
const page=fs.readFileSync(path.join(frontend,"src/pages/PJ26080553.jsx"),"utf8");
const nav=fs.readFileSync(path.join(frontend,"src/project0553/lifecycleNavigation.js"),"utf8");
assert.ok(page.includes('tab==="b3bf"&&<B3BrownfieldAdditional0553/>'));
assert.ok(nav.includes('["b3bf","10B B3 Brownfield Additional"]'));
assert.ok(nav.includes('tabs:["documents","budget"]'));
const brownfieldSource=fs.readFileSync(path.join(root,"project0553/data/b3BrownfieldAdditional0553.js"),"utf8");
assert.ok(brownfieldSource.includes("buildReleaseCommercialModel0553"));
assert.ok(!brownfieldSource.includes("priceAorCFromCost0553"));
const satAfter=require(path.join(root,"project0553/data/b3SelectedSatSurveyPrice0553.js")).selectB3SelectedSatSurveyPrice0553();
assert.equal(satAfter.satWorkingSellTHB,1587600);
assert.equal(satAfter.satTeamDaySellTHB,56700);
console.log("PASS 0553 B3 brownfield additional: 14 x 56,700 = 793,800; last-line note present; base B3 unchanged");
