// Additional brownfield proposal is read-only. 9 team-days
// x the existing SAT team-day rate must stay 510,300, and the BOM note must stay last.
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
assert.equal(model.netCalendarDays,9);
assert.equal(model.netCalendarDays*model.teamDayTHB,510300);
assert.equal(model.proposalTHB,510300);
assert.equal(model.proposalUSD,16200);
assert.equal(model.mobPersons,2);
assert.equal(model.mobTrips,1);
assert.equal(model.mobUsdPerPersonTrip,2000);
assert.equal(model.mobUSD,4000);
assert.equal(model.mobTHB,126000);
assert.equal(model.mobUSD*model.fxTHBPerUSD,model.mobTHB);
assert.equal(model.grandTotalTHB,636300);
assert.equal(model.grandTotalUSD,20200);
assert.equal(model.proposalTHB+model.mobTHB,model.grandTotalTHB);
assert.equal(model.baseReadOnly.workingSellTHB,2322450);
assert.ok(model.bomLines.find(line=>line.id==="BF.1.4").remarks.includes("Jack instruction 2026-11-16, USD 2,000 per person round trip"));
assert.equal(model.teamDayUSD,1800);
assert.equal(model.proposalUSD*model.fxTHBPerUSD,model.proposalTHB);
assert.equal(model.teamDayUSD*model.fxTHBPerUSD,model.teamDayTHB);
assert.equal(model.grandTotalTHB,636300);
assert.equal(model.grandTotalUSD,20200);
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
const DOC="MM-ZTK-1F-GEN-ADDV-TEL-QUO-0001 Rev.00";
assert.equal(data.b3BrownfieldDocumentNumber0553(),DOC);
assert.equal(data.b3BrownfieldExportFileName0553({audience:"official",extension:"csv"}),DOC+".csv");
assert.equal(data.b3BrownfieldExportFileName0553({audience:"internal",extension:"csv"}),DOC+"_INTERNAL.csv");
assert.equal(data.b3BrownfieldExportFileName0553({audience:"official"}),DOC);
assert.equal(data.b3BrownfieldExportFileName0553({audience:"internal"}),DOC+"_INTERNAL");
assert.equal(data.b3BrownfieldExportFileName0553({audience:"official",extension:"xlsx"}),DOC+".xlsx");
assert.equal(data.b3BrownfieldExportFileName0553({audience:"official",extension:"doc"}),DOC+".doc");
const companyCode=require(path.join(root,"project0553/data/addvalueDocumentCode0553.js")).ADDVALUE_DOCUMENT_COMPANY_CODE_0553;
assert.equal(companyCode,"ADDV");
assert.equal(data.B3BF_EXPORT_NAME_0553.vendorPackage,companyCode);
for(const name of [data.b3BrownfieldDocumentNumber0553(),
 data.b3BrownfieldExportFileName0553({audience:"official",extension:"csv"}),
 data.b3BrownfieldExportFileName0553({audience:"internal",extension:"csv"}),
 data.b3BrownfieldExportFileName0553({audience:"official",extension:"xlsx"}),
 data.b3BrownfieldExportFileName0553({audience:"official",extension:"doc"}),
 data.b3BrownfieldExportFileName0553({audience:"official",extension:"html"})]){
 assert.ok(name.includes("-ADDV-")&&!name.includes("-ADV-"),"document number must use ADDV: "+name);
}
assert.throws(()=>data.b3BrownfieldExportFileName0553({extension:"docx"}));
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
assert.deepEqual(model.dayPlan.map(row=>[row.label,row.days]),[["ZPQ",2],["ZWP8",2],["ZWP11",2],["MOB",1],["DEMOB",1],["Punch list",1]]);
assert.equal(model.dayPlan.reduce((sum,row)=>sum+row.days,0),9);
const pricedCsv=data.buildB3BrownfieldAdditionalCsv0553(model,{priced:true,itemized:true});
const unpricedCsv=data.buildB3BrownfieldAdditionalCsv0553(model,{priced:false,itemized:true});
const lumpCsv=data.buildB3BrownfieldAdditionalCsv0553(model,{priced:true,itemized:false});
assert.ok(pricedCsv.includes(NOTE)&&pricedCsv.includes("636,300.00")&&pricedCsv.includes("126,000.00")&&pricedCsv.includes("63,000.00")&&pricedCsv.includes("Punch list"));
assert.ok(!unpricedCsv.includes("636,300")&&!unpricedCsv.includes("126,000")&&!unpricedCsv.includes("63,000")&&!unpricedCsv.includes("Unit Rate (THB)")&&unpricedCsv.includes(NOTE)&&unpricedCsv.includes("Punch list"));
assert.ok(lumpCsv.includes("636,300.00")&&!lumpCsv.includes("9,000.00"));
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
assert.ok(pricedHtml.includes(NOTE)&&pricedHtml.includes("636,300.00")&&pricedHtml.includes("126,000.00")&&pricedHtml.includes("63,000.00")&&pricedHtml.includes("Unit Rate (THB)")&&pricedHtml.includes("data-testid=\"b3bf-day-plan\""));
assert.ok(pricedHtml.includes("data-testid=\"b3bf-total\"")&&pricedHtml.includes("Open items"));
assert.ok(!unpricedHtml.includes("636,300")&&!unpricedHtml.includes("126,000")&&!unpricedHtml.includes("63,000")&&!unpricedHtml.includes("Unit Rate (THB)")&&!unpricedHtml.includes("data-testid=\"b3bf-total\"")&&unpricedHtml.includes(NOTE)&&unpricedHtml.includes("Punch list"));
assert.ok(lumpHtml.includes("636,300.00")&&!lumpHtml.includes("9,000.00")&&lumpHtml.includes("LUMP SUM LOT MODE"));
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
const PART_A_MONEY=["7,643,874.13","4,088,522.84","1,203,800.00","9,213,750.00","7643874.13","4088522.84","1203800","9213750"];
const officialHtml=render({initialPriced:true,initialItemized:true,initialVersion:"official",initialCurrency:"both"});
const officialThb=render({initialPriced:true,initialItemized:false,initialVersion:"official",initialCurrency:"thb"});
const officialUsd=render({initialPriced:true,initialItemized:true,initialVersion:"official",initialCurrency:"usd"});
const officialCsv=data.buildB3BrownfieldAdditionalCsv0553(model,{priced:true,itemized:true,version:"official",currency:"both"});
const officialSchedule=data.selectB3BrownfieldOfficialSchedule0553(model,{priced:true,itemized:true,currency:"usd"});
assert.equal(model.baseCustomerPreview.source,"buildReleaseCommercialModel0553");
assert.equal(model.baseCustomerPreview.partA.some(part=>Object.prototype.hasOwnProperty.call(part,"previewSellTHB")),false);
assert.equal(model.grandTotalTHB,636300);
assert.equal(model.grandTotalUSD,20200);
assert.equal(model.item7.sellFactor,1);
assert.equal(model.item7.markupFactor,1);
assert.equal(model.item7.samtelPct,0);
assert.equal(model.item7.addvalueProfitPct,0);
assert.equal(model.item7.postedToDossier,false);
assert.equal(model.item7.postedToRelease,false);
assert.equal(model.item7.vndCostUSD,20200);
assert.equal(model.item7.vndCostTHB,636300);
assert.equal(model.item7.sellUSD,model.item7.vndCostUSD);
assert.equal(model.item7.sellTHB,model.item7.vndCostTHB);
assert.equal(model.item7.sellTHB,model.grandTotalTHB);
assert.equal(model.item7.labourUSD,16200);
assert.equal(model.item7.mobUSD,4000);
assert.equal(model.item7.lines.length,3);
assert.equal(model.item7.lines[0].usdPerDay,1000);
assert.equal(model.item7.lines[0].days,9);
assert.equal(model.item7.lines[0].totalUSD,9000);
assert.equal(model.item7.lines[0].totalTHB,283500);
assert.equal(model.item7.lines[1].usdPerDay,800);
assert.equal(model.item7.lines[1].days,9);
assert.equal(model.item7.lines[1].totalUSD,7200);
assert.equal(model.item7.lines[1].totalTHB,226800);
assert.equal(model.item7.lines[2].totalUSD,4000);
assert.equal(model.item7.lines[2].totalTHB,126000);
assert.equal(model.item7.equation,data.B3BF_ITEM7_EQUATION_0553);
assert.equal(model.item7.note,data.B3BF_ITEM7_NOTE_0553);
assert.equal(model.costBasis,model.item7);
assert.ok(pricedHtml.includes("data-testid=\"b3bf-vnd-equation\"")&&pricedHtml.includes(data.B3BF_ITEM7_EQUATION_0553));
assert.ok(pricedHtml.includes("Sell = VND cost × 1.00")&&pricedHtml.includes(data.B3BF_ITEM7_NOTE_0553));
assert.ok(pricedHtml.includes("VND.7.1")&&pricedHtml.includes("VND.7.2")&&pricedHtml.includes("VND.7.3"));
assert.ok(!pricedHtml.includes("899,640")&&!pricedHtml.includes("899640"));
assert.ok(pricedCsv.includes(data.B3BF_ITEM7_EQUATION_0553)&&pricedCsv.includes("Sell factor 1.00"));
assert.ok(!officialHtml.includes(data.B3BF_ITEM7_EQUATION_0553)&&!officialHtml.includes("899,640"));
assert.ok(officialHtml.includes("20,200.00 USD")&&officialHtml.includes("636,300.00")&&officialHtml.includes("Part A: BASIC")&&officialHtml.includes("Part B: OTHERS")&&officialHtml.includes("A1. Main Equipment"));
assert.ok(officialHtml.includes(DOC)&&!officialHtml.includes("-ADV-"),"official screen document number must use ADDV");
assert.ok(officialCsv.includes(DOC)&&!officialCsv.includes("-ADV-"),"official CSV document number must use ADDV");
assert.ok(officialHtml.includes("data-testid=\"b3bf-a1\"")&&officialHtml.includes("data-testid=\"b3bf-head\""));
assert.ok(!officialHtml.includes(">A2<")&&!officialHtml.includes(">A3<")&&!officialHtml.includes(">A4<"));
assert.ok(officialHtml.includes("Total 合计"));
assert.ok(officialHtml.includes("Brownfield Additional"));
assert.ok(officialHtml.includes("2 persons: Senior Telecom Systems Integration Engineer + Senior RF/Telecom Field Specialist"));
assert.ok(!officialHtml.includes("Offshore working")&&!officialHtml.includes("MOB labour")&&!officialHtml.includes(">ZPQ<")&&!officialHtml.includes(">Punch list<"));
assert.ok(!officialHtml.includes("31.5")&&!officialHtml.includes("@31.5")&&officialHtml.includes(">Quoted<"));
assert.ok(officialHtml.indexOf("Part A: BASIC")<officialHtml.indexOf(">A1<")&&officialHtml.indexOf(">A1<")<officialHtml.indexOf("Part B: OTHERS"));
assert.ok(officialHtml.indexOf(">B1<")<officialHtml.indexOf(">B2<")&&officialHtml.indexOf(">B2<")<officialHtml.indexOf(">B3<"));
assert.ok(officialHtml.indexOf(">B3<")<officialHtml.indexOf(">B3-BF.1<")&&officialHtml.indexOf(">B3-BF.3<")<officialHtml.indexOf(">B4<"));
assert.ok(officialHtml.indexOf(">B14<")<officialHtml.indexOf("Total 合计"));
const a1Preview=model.baseCustomerPreview.partA.find(part=>part.code==="A1");
const a1Row=officialSchedule.rows.find(entry=>entry.kind==="a1");
assert.equal(a1Preview.mr,"MR-0001");
assert.equal(a1Preview.description,"MR-0001 SCADA / AVIAT / Cisco");
assert.equal(a1Row.cells[0],"A1");
assert.equal(a1Row.cells[1],"MR-0001\nMULTI-TAG / customer grouping subject to approval");
assert.equal(a1Row.cells[2],a1Preview.description);
assert.equal(a1Row.cells[3],"Locations: "+a1Preview.locations.join(", "));
assert.equal(a1Row.cells[4],"1 lot");
assert.equal(a1Row.cells[5],"Quoted");
assert.equal(a1Row.cells[6],"");
assert.ok(officialHtml.includes(a1Preview.description)&&officialHtml.includes("Locations: "+a1Preview.locations.join(", ")));
assert.ok(!officialSchedule.rows.some(entry=>["A2","A3","A4"].includes(entry.cells[0])));
assert.ok(officialThb.includes("636,300.00")&&officialThb.includes(">Quoted<")&&!officialThb.includes("126,000")&&!officialThb.includes("63,000")&&!officialThb.includes("283,500")&&!officialThb.includes("226,800")&&!officialThb.includes("31,500")&&!officialThb.includes("25,200")&&!officialThb.includes("20,200.00 USD")&&!officialThb.includes("31.5"));
for(const money of PART_A_MONEY){
 for(const text of [officialHtml,officialThb,officialUsd,officialCsv])assert.ok(!text.includes(money),"official output contains Part A money "+money);
}
const seniorLine=officialSchedule.rows.find(entry=>entry.cells[0]==="B3-BF.1");
const specialistLine=officialSchedule.rows.find(entry=>entry.cells[0]==="B3-BF.2");
const ticketLine=officialSchedule.rows.find(entry=>entry.cells[0]==="B3-BF.3");
assert.ok(seniorLine.cells[1].startsWith(model.bomLines.find(entry=>entry.id==="BF.1.1").activity));
assert.ok(specialistLine.cells[1].startsWith(model.bomLines.find(entry=>entry.id==="BF.1.2").activity));
assert.equal(seniorLine.cells[4],"9 day");
assert.equal(seniorLine.cells[5],"");
assert.equal(seniorLine.cells[6],"");
assert.equal(specialistLine.cells[4],"9 day");
assert.equal(specialistLine.cells[5],"");
assert.equal(specialistLine.cells[6],"");
assert.equal(ticketLine.cells[4],"2 trip");
assert.equal(ticketLine.cells[5],"");
assert.equal(ticketLine.cells[6],"");
const heading=officialSchedule.rows.find(entry=>entry.kind==="bfhead");
assert.equal(heading.cells[0],"B3");
assert.ok(heading.cells[1].startsWith("Brownfield Additional"));
assert.equal(heading.cells[5],"20,200.00 USD");
assert.equal(heading.cells[6],"20,200.00 USD");
const thbSchedule=data.selectB3BrownfieldOfficialSchedule0553(model,{priced:true,itemized:true,currency:"thb"});
const thbHeading=thbSchedule.rows.find(entry=>entry.kind==="bfhead");
const thbTotal=thbSchedule.rows.find(entry=>entry.kind==="total");
assert.equal(thbHeading.cells[5],"636,300.00");
assert.equal(thbHeading.cells[6],"636,300.00");
assert.equal(thbTotal.cells[6],"636,300.00");
assert.ok(thbSchedule.rows.filter(entry=>entry.kind==="bf").every(entry=>entry.cells[5]===""&&entry.cells[6]===""));
assert.equal(officialSchedule.rows.filter(entry=>entry.kind==="day").length,0);
assert.deepEqual(officialSchedule.rows.filter(entry=>entry.kind==="template").map(entry=>entry.cells[0]),["B1","B2","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","B14"]);
assert.ok(!seniorLine.cells[3].includes("31.5")&&!a1Row.cells[3].includes("31.5"));
assert.ok(officialThb.includes("9 person-days")&&officialThb.includes("2 persons × 1 round trip")&&officialThb.includes("9 day"));
assert.ok(!officialThb.includes("31.5")&&!officialThb.includes("SAMTEL preparation")&&!officialThb.includes("Proposed standby"));
for(const code of ["B1","B2","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","B14"]){
 assert.ok(officialHtml.includes(">"+code+"<"),"official view must keep template line "+code);
 assert.ok(officialCsv.includes("\n"+code+","),"official csv must keep template line "+code);
 const templateRow=officialSchedule.rows.find(entry=>entry.cells[0]===code);
 assert.equal(templateRow.cells[5],"Quoted");
 assert.equal(templateRow.cells[6],"");
}
assert.ok(officialHtml.includes(">A1<")&&officialHtml.includes(">B3-BF.1<")&&officialHtml.includes(">Quoted<"));
assert.ok(!officialHtml.includes("Supplied under base")&&!officialHtml.includes("TBA"));
assert.ok(!officialHtml.includes("2,322,450")&&!officialCsv.includes("2,322,450"));
assert.ok(!officialHtml.includes("BF.1.3")&&!officialHtml.includes("Existing SAT role rate")&&!officialHtml.includes("Offshore POB"));
assert.ok(!officialCsv.includes("BF.1.3")&&!officialCsv.includes("Existing SAT role rate")&&!officialCsv.includes("Offshore POB"));
assert.ok(officialCsv.includes("20,200.00 USD")&&officialCsv.includes("636,300.00")&&officialCsv.includes("Quoted")&&!officialCsv.includes("9,000.00 USD")&&!officialCsv.includes("4,000.00 USD")&&!officialCsv.includes("126,000")&&officialCsv.includes("MR-0001 SCADA / AVIAT / Cisco")&&officialCsv.includes("Total 合计"));
assert.ok(!officialCsv.includes("31.5")&&!officialCsv.includes("SAMTEL preparation")&&!officialHtml.includes("31.5")&&!officialUsd.includes("31.5"));
assert.ok(officialCsv.split("\n").at(-1).includes(NOTE));
assert.ok(officialCsv.lastIndexOf(NOTE)>officialCsv.lastIndexOf(data.B3BF_JUTAL_NOTE_0553));
const officialUnpriced=render({initialPriced:false,initialItemized:true,initialVersion:"official",initialCurrency:"both"});
assert.ok(!officialUnpriced.includes("510,300")&&!officialUnpriced.includes("636,300")&&!officialUnpriced.includes("126,000")&&!officialUnpriced.includes("63,000")&&!officialUnpriced.includes("20,200")&&!officialUnpriced.includes("4,000")&&!officialUnpriced.includes("16,200")&&!officialUnpriced.includes("2,000.00")&&officialUnpriced.includes(">Quoted<")&&officialUnpriced.includes("MOB/DEMOB"));
assert.ok(officialUnpriced.includes("MR-0001 SCADA / AVIAT / Cisco")&&officialUnpriced.includes("Brownfield Additional")&&officialUnpriced.includes(">B3<")&&!officialUnpriced.includes("Offshore working")&&!officialUnpriced.includes("SAMTEL preparation")&&!officialUnpriced.includes("31.5")&&!officialUnpriced.includes("TBA"));
for(const money of PART_A_MONEY)assert.ok(!officialUnpriced.includes(money));
assert.ok(pricedHtml.includes("BF.1.3")&&pricedHtml.includes("Existing SAT role rate")&&pricedHtml.includes("Offshore POB"));
const leak=/793,?800|856,?800|636,?300|573,?300|510,?300|403,?200|340,?200|283,?500|226,?800|189,?000|151,?200|126,?000|63,?000|56,?700|31,?500|25,?200|20,?200|18,?200|16,?200|12,?800|10,?800|441,?000|352,?800|14,?000|11,?200|9,?000|7,?200|6,?000|4,?800|4,?000|2,?000|1,?800|1,?000|31\.5/;
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
const releaseSource=fs.readFileSync(path.join(root,"project0553/ReleaseCustomerWorkbook0553.jsx"),"utf8");
assert.ok(releaseSource.includes("Export Excel — WORKING DRAFT"));
assert.ok(!/Export Word|html-docx|\.docx/i.test(releaseSource),"10.3 preview has no Word export");
assert.ok(uiSource.includes("Excel — Official schedule")&&uiSource.includes("Word — Official schedule (.doc)"));
assert.ok(uiSource.includes("No docx library is installed"));
assert.ok(!uiSource.includes("buildNativeWorkingDraft0553"));
const page=fs.readFileSync(path.join(frontend,"src/pages/PJ26080553.jsx"),"utf8");
const nav=fs.readFileSync(path.join(frontend,"src/project0553/lifecycleNavigation.js"),"utf8");
assert.ok(page.includes('tab==="b3bf"&&<B3BrownfieldAdditional0553/>'));
assert.ok(nav.includes('["b3bf","10B B3 Brownfield Additional"]'));
assert.ok(nav.includes('tabs:["documents","budget"]'));
const brownfieldSource=fs.readFileSync(path.join(root,"project0553/data/b3BrownfieldAdditional0553.js"),"utf8");
assert.ok(brownfieldSource.includes("buildReleaseCommercialModel0553"));
assert.ok(!brownfieldSource.includes("priceAorCFromCost0553"));
assert.ok(!brownfieldSource.includes("b3ResourcePriceDossier0553"));
assert.ok(brownfieldSource.includes("B3BF_ITEM7_EQUATION_0553"));
assert.ok(!brownfieldSource.includes("899,640")&&!brownfieldSource.includes("899640"));
assert.ok(!brownfieldSource.includes("buildNativeWorkingDraft0553"));
assert.ok(brownfieldSource.includes("entriesFromZip"));
const satAfter=require(path.join(root,"project0553/data/b3SelectedSatSurveyPrice0553.js")).selectB3SelectedSatSurveyPrice0553();
assert.equal(satAfter.satWorkingSellTHB,1587600);
assert.equal(satAfter.satTeamDaySellTHB,56700);
const template=require(path.join(root,"project0553/data/nativeReleaseTemplate0553.json"));
const native=require(path.join(root,"project0553/nativeWorkingDraft0553.js"));
function parseCsv(text){
 const rows=[];let row=[];let field="";let quoted=false;
 for(let i=0;i<text.length;i++){
  const char=text[i];
  if(quoted){
   if(char==='"'&&text[i+1]==='"'){field+='"';i++;}
   else if(char==='"')quoted=false;
   else field+=char;
  }else if(char==='"')quoted=true;
  else if(char===","){row.push(field);field="";}
  else if(char==="\n"){row.push(field);rows.push(row);row=[];field="";}
  else if(char!=="\r")field+=char;
 }
 if(field.length||row.length){row.push(field);rows.push(row);}
 return rows;
}
function htmlText(value){
 return value.replace(/<br\s*\/?>/gi,"\n").replace(/<[^>]+>/g,"").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#x27;/g,"'").replace(/&apos;/g,"'");
}
function wordMatrix(html){
 const body=html.slice(html.indexOf("<tbody>"),html.indexOf("</tbody>"));
 return [...body.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(row=>[...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map(cell=>htmlText(cell[1])));
}
function excelMatrix(xml,rows){
 const decode=value=>value.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'");
 return rows.map(row=>"ABCDEFGH".split("").map(column=>{
  const match=xml.match(new RegExp('<c\\b[^>]*\\br="'+column+row+'"[^>]*?(?:/>|>([\\s\\S]*?)</c>)'));
  const text=match&&match[1]&&match[1].match(/<t[^>]*>([\s\S]*?)<\/t>/);
  return text?decode(text[1]):"";
 }));
}
function screenMatrix(html){
 const sheet=html.slice(html.indexOf('data-testid="b3bf-official-sheet"'));
 return [...sheet.matchAll(/<tr\b([^>]*)>([\s\S]*?)<\/tr>/g)].flatMap(row=>{
  const kind=(row[1].match(/data-kind="([^"]+)"/)||[])[1];
  if(!kind)return [];
  const cells=[...row[2].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map(cell=>htmlText(cell[1]));
  if(kind==="section"||kind==="subheading"||kind==="highlight"||kind==="note")return [[cells[0],...Array(7).fill("")]];
  if(kind==="total")return [[cells[0],"","","","","",cells[1],cells[2]]];
  if(kind==="a1")return [cells];
  return [[cells[0],cells[1],"","",cells[2],cells[3],cells[4],cells[5]]];
 });
}
function assertOfficialExportsMatch(model,file,pricedSheet,pricedWord){
 const view={priced:true,itemized:true,currency:"thb"};
 const schedule=data.selectB3BrownfieldOfficialSchedule0553(model,view);
 const matrix=data.b3BrownfieldOfficialMatrix0553(schedule);
 const csvRows=parseCsv(data.buildB3BrownfieldAdditionalCsv0553(model,{...view,version:"official"}));
 const csvMatrix=csvRows.slice(csvRows.findIndex(row=>row[0]==="S.N / 序号")+1);
 assert.deepEqual(csvMatrix,matrix,"official CSV rows differ from the screen");
 assert.deepEqual(wordMatrix(pricedWord),data.b3BrownfieldOfficialMatrix0553(data.selectB3BrownfieldOfficialSchedule0553(model,{priced:true,itemized:true,currency:"both"})),"official Word rows differ from the screen");
 assert.deepEqual(excelMatrix(pricedSheet,data.b3BrownfieldOfficialExcelRows0553(schedule)),matrix,"official Excel rows differ from the screen");
 const screen=screenMatrix(render({initialPriced:true,initialItemized:true,initialVersion:"official",initialCurrency:"thb"}));
 assert.deepEqual(screen,matrix,"official screen rows differ from the export model");
 assert.equal(data.b3BrownfieldOfficialExcelRows0553(schedule).join(","),"6,7,8,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44");
 void file;
}
async function checkOfficialExports(){
 const bytes=Uint8Array.from(Buffer.from(template.base64,"base64"));
 const file={name:template.sourceName,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)};
 const xlsx=await data.buildB3BrownfieldOfficialXlsx0553(file,model,{priced:true,currency:"thb"});
 assert.equal(xlsx.filename,"MM-ZTK-1F-GEN-ADDV-TEL-QUO-0001 Rev.00.xlsx");
 assert.ok(!xlsx.filename.includes("-ADV-"));
 const zip=native.entriesFromZip(xlsx.bytes);
 const sheet=new TextDecoder().decode(await native.readEntry(zip.find(entry=>entry.name==="xl/worksheets/sheet1.xml")));
 assert.ok(sheet.includes("636,300.00")&&sheet.includes("Quoted")&&sheet.includes("MR-0001 SCADA / AVIAT / Cisco")&&sheet.includes("B3-BF.3")&&!sheet.includes("126,000.00")&&!sheet.includes("283,500.00")&&sheet.includes("Brownfield Additional"));
 assert.ok(!sheet.includes("Offshore working")&&!sheet.includes(">A2<")&&!sheet.includes(">A3<")&&!sheet.includes(">A4<"));
 assert.ok(!sheet.includes("<f>SUM(E8:E22)</f>"));
 assert.ok(!sheet.includes("2,322,450")&&!sheet.includes("2322450")&&!sheet.includes("573,300")&&!sheet.includes("18,200"));
 const html=data.buildB3BrownfieldOfficialDocHtml0553(model,{priced:true,currency:"both"});
 assert.ok(html.includes("636,300.00 THB / 20,200.00 USD")&&html.includes("Quoted")&&html.includes("Labour + MOB/DEMOB + punch list")&&html.includes("xmlns:w=\"urn:schemas-microsoft-com:office:word\""));
 assert.ok(html.includes(DOC)&&!html.includes("-ADV-"),"Word document number must use ADDV");
 assert.ok(!html.includes("573,300")&&!html.includes("18,200")&&!html.includes("2,322,450")&&!html.includes("126,000.00")&&!html.includes("9,000.00")&&!html.includes("Offshore working"));
 const bare=data.buildB3BrownfieldOfficialDocHtml0553(model,{priced:false,currency:"usd"});
 assert.ok(!bare.includes("636,300")&&!bare.includes("20,200")&&bare.includes("Brownfield Additional")&&!bare.includes("Offshore working"));
 const bareXlsx=await data.buildB3BrownfieldOfficialXlsx0553(file,model,{priced:false,currency:"usd"});
 const bareSheet=new TextDecoder().decode(await native.readEntry(native.entriesFromZip(bareXlsx.bytes).find(entry=>entry.name==="xl/worksheets/sheet1.xml")));
 assert.ok(!bareSheet.includes("636,300")&&!bareSheet.includes("20,200")&&bareSheet.includes("Brownfield Additional")&&!bareSheet.includes("Offshore working"));
 assertOfficialExportsMatch(model,file,sheet,html);
 console.log("PASS 0553 B3 brownfield additional: 9 x 56,700 = 510,300; MOB/DEMOB 126,000; combined official total 636,300; base B3 unchanged");
}
checkOfficialExports().catch(error=>{console.error(error);process.exit(1);});
