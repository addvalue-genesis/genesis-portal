import {buildNativeOfficialRelease0553,entriesFromZip,readEntry,rebuildZip} from "./nativeWorkingDraft0553";
import {customerBreakdownRows0553} from "./data/customerPriceBreakdown0553";

const enc=new TextEncoder(),dec=new TextDecoder();
const esc=x=>String(x??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const ns="http://schemas.openxmlformats.org/spreadsheetml/2006/main";
function emptyEntry(name){
 const bytes=enc.encode(name),local=new Uint8Array(30+bytes.length),central=new Uint8Array(46+bytes.length);
 const l=new DataView(local.buffer),c=new DataView(central.buffer);
 l.setUint32(0,0x04034b50,true);l.setUint16(4,20,true);l.setUint16(26,bytes.length,true);local.set(bytes,30);
 c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(28,bytes.length,true);central.set(bytes,46);
 return {name,local,central,flags:0,method:0,rawSize:0,crc:0,compressed:new Uint8Array()};
}
function addStyles(xml){
 const append=(tag,parts)=>{
  const re=new RegExp('<'+tag+'\\b[^>]*count="(\\d+)"[^>]*>([\\s\\S]*?)</'+tag+'>'),match=xml.match(re);
  if(!match)throw Error("Missing workbook "+tag);
  const start=Number(match[1]);
  xml=xml.replace(re,match[0].replace('count="'+start+'"','count="'+(start+parts.length)+'"').replace('</'+tag+'>',parts.join("")+'</'+tag+'>'));
  return start;
 };
 const font=append("fonts",[
  '<font><sz val="10"/><color rgb="FF183448"/><name val="Arial"/></font>',
  '<font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Arial"/></font>',
  '<font><b/><sz val="15"/><color rgb="FF183448"/><name val="Arial"/></font>'
 ]);
 const fill=append("fills",['<fill><patternFill patternType="solid"><fgColor rgb="FF173D58"/><bgColor indexed="64"/></patternFill></fill>',
  '<fill><patternFill patternType="solid"><fgColor rgb="FFEAF2F7"/><bgColor indexed="64"/></patternFill></fill>']);
 const numIds=[...xml.matchAll(/numFmtId="(\d+)"/g)].map(m=>Number(m[1]));
 const rateId=Math.max(163,...numIds)+1;
 const fmt='<numFmt numFmtId="'+rateId+'" formatCode="#,##0.00######"/>';
 if(/<numFmts\b[^>]*>/.test(xml)&&!/<numFmts\b[^>]*\/>/.test(xml))append("numFmts",[fmt]);
 else if(/<numFmts\b[^>]*\/>/.test(xml))xml=xml.replace(/<numFmts\b[^>]*\/>/,'<numFmts count="1">'+fmt+'</numFmts>');
 else xml=xml.replace(/(<styleSheet\b[^>]*>)/,'$1<numFmts count="1">'+fmt+'</numFmts>');
 const xf=(f,fillId,num=0)=>'<xf numFmtId="'+num+'" fontId="'+f+'" fillId="'+fillId+'" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>';
 const base=append("cellXfs",[xf(font,0),xf(font+1,fill),xf(font,0,4),xf(font,0,rateId),xf(font,fill+1,4),xf(font+2,0)]);
 return {xml,body:base,header:base+1,money:base+2,rate:base+3,total:base+4,title:base+5};
}
function worksheet(group,styles,parentRow){
 const rows=customerBreakdownRows0553(group),last=4+rows.length,subtotal=last+1;
 const cell=(col,row,value,style=styles.body,formula=null)=>{
  const attrs=' r="'+col+row+'" s="'+style+'"';
  if(formula)return '<c'+attrs+'><f>'+esc(formula)+'</f><v>'+value+'</v></c>';
  if(value===null||value===undefined)return '<c'+attrs+'/>';
  return Number.isFinite(value)?'<c'+attrs+'><v>'+value+'</v></c>':'<c'+attrs+' t="inlineStr"><is><t xml:space="preserve">'+esc(value)+'</t></is></c>';
 };
 const row=(n,cells,height)=>'<row r="'+n+'" ht="'+height+'" customHeight="1">'+cells+'</row>';
 let data=row(1,cell('A',1,group.code+' / '+group.mr+' — Equipment Price Breakdown',styles.title),28)+
  row(2,cell('A',2,'DRAFT — NOT ISSUED. Comparison with the submitted proposal is not verified.'),26)+
  row(3,cell('A',3,'USD. Priced items only in subtotal. Included items have no separate charge. Not-priced items require scope confirmation.'),30)+
  row(4,['Item','Location','TAG','Description','Qty','Unit','Unit price USD','Amount USD','Remarks'].map((h,i)=>cell(String.fromCharCode(65+i),4,h,styles.header)).join(''),30);
 rows.forEach((r,i)=>{
  const n=i+5,values=[r.item,r.site,r.tag,r.description,r.qty,r.unit,r.unitUSD,r.amountUSD,r.remark];
  const wrappedLines=Math.max(Math.ceil(r.description.length/54),Math.ceil(r.tag.length/22),Math.ceil(r.unit.length/9),Math.ceil(r.remark.length/32));
  data+=row(n,values.map((v,j)=>cell(String.fromCharCode(65+j),n,v,j===6?styles.rate:j===7?styles.money:styles.body,
   j===7&&r.unitUSD!==null&&r.amountUSD!==null?'ROUND(E'+n+'*G'+n+',2)':null)).join(''),Math.max(44,wrappedLines*14+12));
 });
 data+=row(subtotal,cell('A',subtotal,'Priced subtotal',styles.total)+cell('H',subtotal,group.totalUSD,styles.total,'ROUND(SUM(H5:H'+last+'),2)'),26);
 data+=row(subtotal+1,cell('A',subtotal+1,'Release summary amount',styles.total)+cell('H',subtotal+1,group.parentUSD,styles.total,"'Scope of supply'!G"+parentRow),26);
 data+=row(subtotal+2,cell('A',subtotal+2,'Difference',styles.total)+cell('H',subtotal+2,group.varianceUSD,styles.total,'ROUND(H'+subtotal+'-H'+(subtotal+1)+',2)'),26);
 return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="'+ns+'">'+
  '<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><dimension ref="A1:I'+(subtotal+2)+'"/><sheetViews><sheetView workbookViewId="0" showGridLines="0"><pane ySplit="4" topLeftCell="A5" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="44"/>'+
  '<cols>'+[10,12,24,58,10,10,18,18,36].map((w,i)=>'<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+w+'" customWidth="1"/>').join('')+'</cols><sheetData>'+data+'</sheetData>'+
  '<autoFilter ref="A4:I'+last+'"/><mergeCells count="3"><mergeCell ref="A1:I1"/><mergeCell ref="A2:I2"/><mergeCell ref="A3:I3"/></mergeCells>'+
  '<printOptions horizontalCentered="1"/><pageMargins left="0.25" right="0.25" top="0.4" bottom="0.4" header="0.2" footer="0.2"/><pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/>'+
  '<headerFooter><oddFooter>&amp;L'+group.mr+' | Draft&amp;RPage &amp;P of &amp;N</oddFooter></headerFooter></worksheet>';
}

export async function buildNativePriceBreakdown0553(file,official,breakdown){
 if(!breakdown.reconciled||breakdown.groups.length!==4||breakdown.issued||breakdown.releaseAllowed)
  throw Error("Breakdown export requires four reconciled draft MR groups");
 for(const g of breakdown.groups)if(official.a.find(r=>r.code===g.code)?.amountUSD!==g.parentUSD)
  throw Error("Breakdown parent differs from Official Release");
 const native=await buildNativeOfficialRelease0553(file,official);
 const entries=entriesFromZip(new Uint8Array(await native.blob.arrayBuffer())),changes=new Map();
 const read=async name=>{const entry=entries.find(e=>e.name===name);if(!entry)throw Error('Missing '+name);return dec.decode(await readEntry(entry));};
 let workbook=await read('xl/workbook.xml'),rels=await read('xl/_rels/workbook.xml.rels'),types=await read('[Content_Types].xml');
 const styles=addStyles(await read('xl/styles.xml'));
 changes.set('xl/styles.xml',enc.encode(styles.xml));
 const maxSheet=Math.max(...[...workbook.matchAll(/sheetId="(\d+)"/g)].map(m=>Number(m[1])));
 const maxPart=Math.max(...entries.map(e=>Number(e.name.match(/^xl\/worksheets\/sheet(\d+)\.xml$/)?.[1]||0)));
 const maxRel=Math.max(...[...rels.matchAll(/Id="rId(\d+)"/g)].map(m=>Number(m[1])));
 let definitions='';
 breakdown.groups.forEach((g,i)=>{
  const sheetId=maxSheet+i+1,part=maxPart+i+1,rid='rId'+(maxRel+i+1),name=g.code+' '+g.mr.replace('-',''),path='xl/worksheets/sheet'+part+'.xml';
  if(entries.some(e=>e.name===path))throw Error('Duplicate sheet '+path);
  workbook=workbook.replace('</sheets>','<sheet name="'+name+'" sheetId="'+sheetId+'" r:id="'+rid+'"/></sheets>');
  rels=rels.replace('</Relationships>','<Relationship Id="'+rid+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'+part+'.xml"/></Relationships>');
  types=types.replace('</Types>','<Override PartName="/'+path+'" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>');
  entries.push(emptyEntry(path));changes.set(path,enc.encode(worksheet(g,styles,8+i)));
  definitions+='<definedName name="_xlnm.Print_Titles" localSheetId="'+(6+i)+'">\''+name+'\'!$1:$4</definedName>';
 });
 if(/<definedNames\b[^>]*\/>/.test(workbook))workbook=workbook.replace(/<definedNames\b[^>]*\/>/,'<definedNames>'+definitions+'</definedNames>');
 else if(workbook.includes('</definedNames>'))workbook=workbook.replace('</definedNames>',definitions+'</definedNames>');
 else workbook=workbook.replace('</sheets>','</sheets><definedNames>'+definitions+'</definedNames>');
 changes.set('xl/workbook.xml',enc.encode(workbook));changes.set('xl/_rels/workbook.xml.rels',enc.encode(rels));changes.set('[Content_Types].xml',enc.encode(types));
 return {blob:new Blob([rebuildZip(entries,changes)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),
  filename:'PJ2608-0553_PriceBreakdown_USD_DRAFT_NOT_ISSUED.xlsx'};
}
