/**
 * 10.3.3 — Generate a NEW 6-sheet customer-structured Excel from CODE.
 * Structural source: officialWorkbookTemplate0553.js (customer six tabs, bilingual
 * labels, source row positions). Raw customer Excel is NOT embedded in public GitHub.
 * Prices: 10.1 A group cost ×1.30; 10.2 B Working Sell; C not quoted without OEM cost.
 * File is INTERNAL WORKING, never an approved customer release.
 */
import {OFFICIAL_WORKBOOK_TEMPLATE_0553} from "./data/officialWorkbookTemplate0553";
const SHEETS=OFFICIAL_WORKBOOK_TEMPLATE_0553.sheets;
const enc=new TextEncoder();
const num=x=>typeof x==="number"&&Number.isFinite(x)?x:null;
const r2=x=>Math.round((x+Number.EPSILON)*100)/100;
const escapeXml=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;")
 .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
function zip(entries){
 const parts=[],dirs=[];let off=0;
 const crc=a=>{let c=0xFFFFFFFF;for(const v of a){c^=v;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xEDB88320:0);}return(c^0xFFFFFFFF)>>>0;};
 const cat=a=>{const b=new Uint8Array(a.reduce((s,x)=>s+x.length,0));let n=0;for(const x of a){b.set(x,n);n+=x.length;}return b;};
 for(const [filename,string] of entries){
  const name=enc.encode(filename),body=enc.encode(string),hash=crc(body);
  const local=new Uint8Array(30+name.length),central=new Uint8Array(46+name.length);
  const l=new DataView(local.buffer),c=new DataView(central.buffer);
  l.setUint32(0,0x04034b50,true);l.setUint16(4,20,true);
  l.setUint32(14,hash,true);l.setUint32(18,body.length,true);l.setUint32(22,body.length,true);
  l.setUint16(26,name.length,true);local.set(name,30);
  c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);
  c.setUint32(16,hash,true);c.setUint32(20,body.length,true);c.setUint32(24,body.length,true);
  c.setUint16(28,name.length,true);c.setUint32(42,off,true);central.set(name,46);
  parts.push(local,body);dirs.push(central);off+=local.length+body.length;
 }
 const cd=cat(dirs),end=new Uint8Array(22),v=new DataView(end.buffer);
 v.setUint32(0,0x06054b50,true);v.setUint16(8,entries.length,true);v.setUint16(10,entries.length,true);
 v.setUint32(12,cd.length,true);v.setUint32(16,off,true);return cat([...parts,cd,end]);
}
const summaryMerges=["A1:H1","A6:H6","A23:H23",
 ...Array.from({length:14},(_,i)=>"B"+(24+i)+":D"+(24+i)),
 "A38:D38","A39:H39","A40:H40","B41:D41","B42:D42","B43:H43"];
const annexMerges=(c,b10)=>["G4:G5","B19:H19","B2:"+(c?"J":"I")+"3",
 "B4:B5","C4:C5","D4:D5","E4:E5","F4:F5","H4:"+(c?"J":"I")+"4",
 ...(c?["B21:J21"]:[]),...(b10?["B20:E20"]:[])];
const colsA=[[1,1,14.14],[2,2,28.86],[3,3,34.57],[4,4,47.57],[5,5,7.57],[6,7,16.14],[8,8,24.14],[9,26,8.71]];
const colsB=c=>[[1,3,9.14],[4,4,26.43],[5,5,28.14],[6,6,19.86],[7,7,14.86],[8,9,15.86],...(c?[[10,10,28]]:[]),[c?11:10,26,9.14]];
const rowHeight=(i,row)=>i===0?
 ({1:57.75,2:17.25,3:17.25,4:36,5:39,6:34.5,7:23.25,23:39,38:23.25,39:40.5,40:39,41:31.5,42:33,43:42.75}[row]||
 (row>=8&&row<=22?23.25:row>=24&&row<=37?33:18)):
 ({2:12,4:30,5:12,19:32.25,20:i===1?37.5:12,21:i===4?56.25:45}[row]||(row>=6&&row<=18?12:18));
const style=(i,row,col,v)=>{
 if(i===0){
  if(row===1)return 1;
  if(row===5)return 3;
  if([6,23,40].includes(row))return 4;
  if(row===38)return 7;
  if([39,43].includes(row))return 8;
  if(row>=8&&row<=22||row>=24&&row<=37||row>=41&&row<=42)
   return typeof v==="number"&&col>=6?6:5;
  return 2;
 }
 if(row===2)return 1;
 if([4,5].includes(row))return 3;
 if(row===19)return 7;
 if([20,21].includes(row))return 9;
 return row>=6&&row<=18?(typeof v==="number"&&col>=8?6:5):0;
};
const styles='<?xml version="1.0" encoding="UTF-8"?>'+
 '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'+
 '<numFmts count="1"><numFmt numFmtId="165" formatCode="#,##0.00"/></numFmts>'+
 '<fonts count="4"><font><sz val="10"/><name val="Arial"/></font><font><b/><sz val="12"/><name val="Arial"/></font>'+
 '<font><b/><sz val="10"/><name val="Arial"/></font><font><color rgb="FFCE2228"/><sz val="10"/><name val="Arial"/></font></fonts>'+
 '<fills count="5"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>'+
 '<fill><patternFill patternType="solid"><fgColor rgb="FFE6E6E6"/></patternFill></fill>'+
 '<fill><patternFill patternType="solid"><fgColor rgb="FFF5F5F5"/></patternFill></fill>'+
 '<fill><patternFill patternType="solid"><fgColor rgb="FFFFFF66"/></patternFill></fill></fills>'+
 '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border>'+
 '<border><left style="thin"/><right style="thin"/><top style="thin"/><bottom style="thin"/><diagonal/></border></borders>'+
 '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'+
 '<cellXfs count="10">'+
 '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'+
 '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>'+
 '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>'+
 '<xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>'+
 '<xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>'+
 '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>'+
 '<xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="right"/></xf>'+
 '<xf numFmtId="165" fontId="2" fillId="4" borderId="1" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="right"/></xf>'+
 '<xf numFmtId="0" fontId="2" fillId="4" borderId="1" xfId="0" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>'+
 '<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>'+
 '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
const set=(cells,letter,row,value)=>{if(value!==null&&value!==undefined&&value!=="")cells.set((letter.charCodeAt(0)-64)+":"+row,value);};
function baseCells(sheet){
 const out=new Map();
 for(const row of sheet.rows)for(let i=1;i<row.length;i++)if(row[i]!==null&&row[i]!==undefined&&row[i]!=="")out.set(i+":"+row[0],row[i]);
 return out;
}
function summary(sheet,model,warnings){
 const cells=baseCells(sheet);
 // Original customer worksheet has "xxx" / sample Qty 8; remove samples
 // BEFORE writing current A1 TAG-group data, never erase actual Working values.
 cells.delete("3:8");cells.delete("4:8");cells.delete("5:8");cells.delete("5:7");
 for(const p of model.a){
  const index=Number(String(p.code).slice(1))-1;
  if(index<0||index>3)throw Error("Unexpected Part A customer group "+p.code);
  const row=8+index,n=num(p.previewSellTHB);
  set(cells,"A",row,p.code);set(cells,"B",row,p.mr);
  set(cells,"C",row,p.description);
  set(cells,"D",row,p.sourceRows.length+" TAG working-source lines; buyer to approve grouping");
  set(cells,"E",row,1);
  if(n!==null){set(cells,"F",row,r2(n));set(cells,"G",row,r2(n));}
  else warnings.push(p.code+" price pending");
 }

 for(let i=1;i<=14;i++){
  const code="B"+i,row=i+23,owner=model.b.find(x=>x.code===code),price=num(owner?.customerSellTHB);
  if(price===null){warnings.push(code+" sell pending");continue;}
  if(![33,34,35,36].includes(row))set(cells,"F",row,r2(price));
  set(cells,"G",row,r2(price));
 }
 const a=num(model.summary.aProvisionalCustomerSellTHB),b=num(model.summary.bProvisionalCustomerSellTHB);
 if(a!==null&&b!==null)set(cells,"G",38,r2(a+b));
 for(const c of model.c||[]){
  const row=c.code==="C1"?41:c.code==="C2"?42:null;
  if(row!==null&&num(c.customerSellTHB)!==null)set(cells,"G",row,r2(c.customerSellTHB));
 }
 if(model.sourceCoverage?.aOverflow)warnings.push("A exceeds native 15 TAG slots; grouped by 4 MRs for Working Draft");
 return cells;
}
function annex(sheet,code,model,warnings){
 const cells=baseCells(sheet),items=model.annex?.[code]||[],audit=model.annexModels?.[code];
 if(items.length>13)throw Error(code+" exceeds native 13 Annex lines; cannot silently truncate");
 for(let i=0;i<items.length;i++){
  const x=items[i],row=6+i;
  set(cells,"B",row,i+1);set(cells,"C",row,x.tagNo||"COMMON");
  set(cells,"D",row,x.description);set(cells,"E",row,x.specification);
  set(cells,"F",row,x.materials);set(cells,"G",row,num(x.qty));
  if(code.startsWith("B")){
   set(cells,"H",row,num(x.customerUnitTHB));
   set(cells,"I",row,num(x.customerTotalTHB));
  }else{set(cells,"H",row,"Not quote");set(cells,"I",row,"Not quote");set(cells,"J",row,x.leadTimeARO);}
 }
 if(code.startsWith("B")&&num(audit?.annexLineTotalTHB)!==null)set(cells,"I",19,r2(audit.annexLineTotalTHB));
 if(code.startsWith("C"))warnings.push(code+" optional price is Not quote (verified supplier cost required)");
 if(num(audit?.varianceTHB)!==null&&Math.abs(audit.varianceTHB)>0.01)warnings.push(code+" Annex variance THB "+audit.varianceTHB.toFixed(2));
 return cells;
}
function worksheet(sheet,index,cells){
 const isMain=index===0,c=index>=4,columns=isMain?8:c?10:9;
 const widths=isMain?[[1,1,14.14],[2,2,28.86],[3,3,34.57],[4,4,47.57],[5,5,7.57],[6,7,16.14],[8,8,24.14],[9,26,8.71]]:
 [[1,3,9.14],[4,4,26.43],[5,5,28.14],[6,6,19.86],[7,7,14.86],[8,9,15.86],...(c?[[10,10,28]]:[]),[c?11:10,26,9.14]];
 const merges=isMain?summaryMerges:annexMerges(c,index===1);
 const rows=[];
 for(let row=1;row<=sheet.maxRow;row++){
  const values=[];
  for(let ci=1;ci<=columns;ci++){
   const value=cells.get(ci+":"+row),address=String.fromCharCode(64+ci)+row,st=style(index,row,ci,value);
   if(value===null||value===undefined||value==="")values.push('<c r="'+address+'" s="'+st+'"/>');
   else if(typeof value==="number")values.push('<c r="'+address+'" s="'+st+'"><v>'+value+'</v></c>');
   else values.push('<c r="'+address+'" s="'+st+'" t="inlineStr"><is><t xml:space="preserve">'+escapeXml(value)+'</t></is></c>');
  }
  rows.push('<row r="'+row+'" ht="'+rowHeight(index,row)+'" customHeight="1">'+values.join("")+'</row>');
 }
 return '<?xml version="1.0" encoding="UTF-8"?>'+
 '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'+
 '<dimension ref="A1:'+String.fromCharCode(64+columns)+sheet.maxRow+'"/>'+
 '<sheetViews><sheetView workbookViewId="0" showGridLines="0"/></sheetViews>'+
 '<sheetFormatPr defaultRowHeight="15"/><cols>'+
 widths.map(([a,b,w])=>'<col min="'+a+'" max="'+b+'" width="'+w+'" customWidth="1"/>').join("")+
 '</cols><sheetData>'+rows.join("")+'</sheetData><mergeCells count="'+merges.length+'">'+
 merges.map(x=>'<mergeCell ref="'+x+'"/>').join("")+'</mergeCells>'+
 '<pageMargins left="0.3" right="0.3" top="0.5" bottom="0.5" header="0.2" footer="0.2"/>'+
 '<pageSetup orientation="landscape"/></worksheet>';
}
function excelParts(model,warnings){
 const wb='<?xml version="1.0" encoding="UTF-8"?>'+
 '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'+
 SHEETS.map((x,i)=>'<sheet name="'+escapeXml(x.name)+'" sheetId="'+(i+1)+'" r:id="rId'+(i+1)+'"/>').join("")+
 '</sheets><calcPr calcId="0" fullCalcOnLoad="1"/></workbook>';
 const rels='<?xml version="1.0" encoding="UTF-8"?>'+
 '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
 SHEETS.map((x,i)=>'<Relationship Id="rId'+(i+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'+(i+1)+'.xml"/>').join("")+
 '<Relationship Id="rId7" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
 const types='<?xml version="1.0" encoding="UTF-8"?>'+
 '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'+
 '<Default Extension="xml" ContentType="application/xml"/>'+
 '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'+
 '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'+
 SHEETS.map((x,i)=>'<Override PartName="/xl/worksheets/sheet'+(i+1)+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>').join("")+'</Types>';
 const cells=SHEETS.map((sheet,i)=>i===0?summary(sheet,model,warnings):annex(sheet,["B10","B11","B13","C1","C2"][i-1],model,warnings));
 return [
 ["[Content_Types].xml",types],
 ["_rels/.rels",'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
 ["xl/workbook.xml",wb],
 ["xl/_rels/workbook.xml.rels",rels],
 ["xl/styles.xml",styles],
 ...SHEETS.map((s,i)=>["xl/worksheets/sheet"+(i+1)+".xml",worksheet(s,i,cells[i])])
 ];
}
export function buildNewNativeWorkingWorkbook0553(model){
 if(!model||!Array.isArray(model.a)||!Array.isArray(model.b)||!model.summary)
  throw Error("10.3.3 requires current 10.1/10.2 Working Model");
 if(SHEETS.length!==6)throw Error("Customer structure requires six original worksheet names");
 const warnings=["INTERNAL WORKING / NOT RELEASED. Original confidential workbook is not stored in public source."];
 const zipBytes=zip(excelParts(model,warnings));
 const date=new Date().toISOString().slice(0,10).replace(/-/g,"");
 return {
  blob:new Blob([zipBytes],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),
  filename:"4-Scope of Supply_PJ2608-0553_INTERNAL_WORKING_NOT_RELEASED_"+date+".xlsx",
  warnings,mappedCells:null
 };
}
