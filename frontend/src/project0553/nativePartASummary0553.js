import {buildNativeOfficialRelease0553,entriesFromZip,readEntry,rebuildZip} from "./nativeWorkingDraft0553";
import {emptyEntry,addStyles} from "./nativePriceBreakdown0553";
import {buildPartAEquipmentSummary0553} from "./data/partAEquipmentSummary0553";
const enc=new TextEncoder(),dec=new TextDecoder();
const esc=x=>String(x??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

export function partASummaryWorksheet0553(model,styles,showPrices){
 const cell=(col,n,value,style=styles.body,formula=null)=>{
  const attrs=' r="'+col+n+'" s="'+style+'"';
  if(formula)return '<c'+attrs+'><f>'+esc(formula)+'</f><v>'+value+'</v></c>';
  if(value===null||value===undefined)return '<c'+attrs+'/>';
  return Number.isFinite(value)?'<c'+attrs+'><v>'+value+'</v></c>':'<c'+attrs+' t="inlineStr"><is><t xml:space="preserve">'+esc(value)+'</t></is></c>';
 };
 const row=(n,values,height=44)=>'<row r="'+n+'" ht="'+height+'" customHeight="1">'+values+'</row>';
 const merged=[],subtotals=[];let n=0,data='';
 const heading=(text,style=styles.body,height=30)=>{n++;data+=row(n,cell('A',n,text,style),height);merged.push('A'+n+':H'+n);};
 heading('Part A — Equipment Summary',styles.title,32);
 heading('PJ2608-0553 | ZAWTIKA DEVELOPMENT PROJECT PHASE 1F | USD',styles.body,26);
 heading('DRAFT — NOT ISSUED. Submitted proposal comparison: NOT VERIFIED. Quantities based on received MR scope and current offer.',styles.body,30);
 heading(showPrices?'Group prices shown. Mixed configurations have no common unit rate. Included components carry no second charge.':
  'Detail prices omitted from Sheet A. A1–A4 subtotals retained. Other quotation sheets retain their existing prices.',styles.body,30);
 n++;data+=row(n,['Item','Description','Location','Qty','Unit',showPrices?'Unit price USD':'',showPrices?'Amount USD':'Subtotal USD','Remarks'].map((v,i)=>cell(String.fromCharCode(65+i),n,v,styles.header)).join(''),32);
 model.groups.forEach((group,index)=>{
  heading(group.code+' / '+group.mr+' — '+group.description,styles.header,30);
  const start=n+1;
  group.rows.forEach(r=>{
   n++;
   const values=[r.item,r.description,r.locations,r.qty,r.unit,showPrices?r.unitUSD:null,showPrices?r.amountUSD:null,r.remark];
   const height=Math.max(48,Math.ceil(r.remark.length/51)*14+12,Math.ceil(r.description.length/48)*14+12);
   data+=row(n,values.map((v,i)=>cell(String.fromCharCode(65+i),n,v,i===5?styles.rate:i===6?styles.money:styles.body)).join(''),height);
  });
  const last=n;n++;subtotals.push(n);
  data+=row(n,cell('A',n,group.code+' priced subtotal',styles.total)+cell('G',n,group.totalUSD,styles.total,
   showPrices?'ROUND(SUM(G'+start+':G'+last+'),2)':"'Scope of supply'!G"+(8+index)),28);
  merged.push('A'+n+':F'+n);
 });
 n++;data+=row(n,cell('A',n,'Part A priced subtotal (USD)',styles.total)+cell('G',n,model.totalUSD,styles.total,'SUM('+subtotals.map(r=>'G'+r).join(',')+')'),30);merged.push('A'+n+':F'+n);
 return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'+
  '<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><dimension ref="A1:H'+n+'"/><sheetViews><sheetView workbookViewId="0" showGridLines="0"><pane ySplit="5" topLeftCell="A6" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="44"/>'+
  '<cols>'+[10,48,28,8,10,showPrices?18:2,18,53].map((w,i)=>'<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+w+'" customWidth="1"/>').join('')+'</cols><sheetData>'+data+'</sheetData><mergeCells count="'+merged.length+'">'+merged.map(r=>'<mergeCell ref="'+r+'"/>').join('')+'</mergeCells>'+
  '<printOptions horizontalCentered="1"/><pageMargins left="0.25" right="0.25" top="0.4" bottom="0.4" header="0.2" footer="0.2"/><pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/>'+
  '<headerFooter><oddFooter>&amp;LPJ2608-0553 | Part A | Draft&amp;RPage &amp;P of &amp;N</oddFooter></headerFooter></worksheet>';
}

export async function buildNativePartASummary0553(file,official,breakdown,{showPrices=false}={}){
 if(!breakdown.reconciled||breakdown.groups.length!==4||breakdown.issued||breakdown.releaseAllowed)
  throw Error('Sheet A requires four reconciled draft MR groups');
 for(const g of breakdown.groups)if(official.a.find(r=>r.code===g.code)?.amountUSD!==g.parentUSD)throw Error('Sheet A parent differs from Official Release');
 const summary=buildPartAEquipmentSummary0553(breakdown),native=await buildNativeOfficialRelease0553(file,official);
 const entries=entriesFromZip(new Uint8Array(await native.blob.arrayBuffer())),changes=new Map();
 const read=async name=>{const entry=entries.find(e=>e.name===name);if(!entry)throw Error('Missing '+name);return dec.decode(await readEntry(entry));};
 let workbook=await read('xl/workbook.xml'),rels=await read('xl/_rels/workbook.xml.rels'),types=await read('[Content_Types].xml');
 const styles=addStyles(await read('xl/styles.xml'));
 const sheetId=Math.max(...[...workbook.matchAll(/sheetId="(\d+)"/g)].map(m=>Number(m[1])))+1;
 const part=Math.max(...entries.map(e=>Number(e.name.match(/^xl\/worksheets\/sheet(\d+)\.xml$/)?.[1]||0)))+1;
 const rid='rId'+(Math.max(...[...rels.matchAll(/Id="rId(\d+)"/g)].map(m=>Number(m[1])))+1);
 const sheetIndex=(workbook.match(/<sheet /g)||[]).length,path='xl/worksheets/sheet'+part+'.xml';
 workbook=workbook.replace('</sheets>','<sheet name="A Equipment" sheetId="'+sheetId+'" r:id="'+rid+'"/></sheets>');
 const names='<definedName name="_xlnm.Print_Titles" localSheetId="'+sheetIndex+'">\'A Equipment\'!$1:$5</definedName>';
 if(/<definedNames\b[^>]*\/>/.test(workbook))workbook=workbook.replace(/<definedNames\b[^>]*\/>/,'<definedNames>'+names+'</definedNames>');
 else if(workbook.includes('</definedNames>'))workbook=workbook.replace('</definedNames>',names+'</definedNames>');
 else workbook=workbook.replace('</sheets>','</sheets><definedNames>'+names+'</definedNames>');
 rels=rels.replace('</Relationships>','<Relationship Id="'+rid+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'+part+'.xml"/></Relationships>');
 types=types.replace('</Types>','<Override PartName="/'+path+'" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>');
 entries.push(emptyEntry(path));
 for(const [p,text] of [[path,partASummaryWorksheet0553(summary,styles,showPrices)],['xl/styles.xml',styles.xml],['xl/workbook.xml',workbook],['xl/_rels/workbook.xml.rels',rels],['[Content_Types].xml',types]])changes.set(p,enc.encode(text));
 return {blob:new Blob([rebuildZip(entries,changes)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),
  filename:'PJ2608-0553_SheetA_'+(showPrices?'WithDetailPrices':'WithoutDetailPrices')+'_DRAFT_NOT_ISSUED.xlsx'};
}
