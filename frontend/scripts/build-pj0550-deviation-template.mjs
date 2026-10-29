// Run a copy from a temporary directory with the primary runtime's node_modules
// symlink. Arguments: layout JSON, absolute output directory. No source is edited.
import fs from 'node:fs/promises';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const layout=JSON.parse(await fs.readFile(process.argv[2],'utf8')),outputDir=process.argv[3];
const wb=Workbook.create(),s=wb.worksheets.add(layout.sheetName);
s.showGridLines=false;
s.getRange('A1:K13').format={font:{name:'Arial',size:11,color:'#000000'},verticalAlignment:'top',rowHeight:18};
layout.widths.forEach((width,i)=>s.getRangeByIndexes(0,i,13,1).format.columnWidth=width);
['Project No.:','Project:','Requisition:','REQ Description','Vendor:'].forEach((label,i)=>{
 s.getCell(i,0).values=[[label]];s.mergeCells(`C${i+1}:K${i+1}`);s.getCell(i,2).values=[[`{{META_${i}}}`]];
});
s.mergeCells('A6:K6');s.getRange('A6').values=[['{{DRAFT_STATUS}}']];s.getRange('A6').format.font={name:'Arial',size:10,italic:true};
s.mergeCells('A7:K7');s.getRange('A7').values=[[layout.title]];s.getRange('A7').format={font:{name:'Arial',size:24,bold:true},horizontalAlignment:'center',rowHeight:32};
s.mergeCells('A8:K8');s.getRange('A8').values=[[layout.note]];s.getRange('A8').format={font:{name:'Arial',size:14,bold:true},horizontalAlignment:'center',wrapText:true,rowHeight:28};
s.getRange('A10:K10').values=[layout.columns];
s.getRange('A10:K10').format={font:{name:'Arial',size:11,bold:true},horizontalAlignment:'center',verticalAlignment:'center',wrapText:true,rowHeight:50,borders:{preset:'all',style:'medium',color:'#000000'}};
s.mergeCells('B11:K11');s.getRange('A11').values=[['1.0']];s.getRange('B11').values=[['{{SECTION}}']];
s.getRange('A11:K11').format={fill:'#D9E1F2',font:{name:'Arial',size:13,bold:true},wrapText:true,rowHeight:32,borders:{preset:'outside',style:'medium',color:'#000000'}};
s.getRange('A12:K12').format.rowHeight=6;
s.getRange('A13:K13').values=[layout.columns.map((_,i)=>`{{CELL_${i}}}`)];
s.getRange('A13:K13').format={wrapText:true,rowHeight:145,borders:{preset:'all',style:'thin',color:'#000000'}};
s.getRange('A13:B13').format.horizontalAlignment='center';
s.freezePanes.freezeRows(10);s.freezePanes.freezeColumns(2);
wb.recalculate();await fs.mkdir(outputDir,{recursive:true});
await (await SpreadsheetFile.exportXlsx(wb)).save(`${outputDir}/deviation-template.xlsx`);
await fs.writeFile(`${outputDir}/deviation-template.png`,new Uint8Array(await (await wb.render({sheetName:layout.sheetName,range:'A1:K13',scale:1,format:'png'})).arrayBuffer()));
console.log('Template authored and rendered with Artifact Tool');
