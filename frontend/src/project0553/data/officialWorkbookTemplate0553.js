// Transcription of native 4-Scope of Supply.xlsx layout, not revised commercial prices.
// Blank cells remain blank. Annex sheets retain original unquoted rows and headers.
// Source workbook remains authoritative for XLSX export and exact cell styles.
const summaryRows=[
 [1,"Scope of supply / 供货范围"],
 [2,"Project","ZAWTIKA DEVELOPMENT PROJECT PHASE 1F"],
 [3,"RFQ No."],[4,"Package Name"],
 [5,"S.N / 序号","Tag No. / 位号","Description / 名称","Main Specification / 主要参数","Qty / 数量","Unit Price / 单价","Sub-Total / 小计","Remark / 备注"],
 [6,"Part A: BASIC / A部分：基本"],
 [7,"A1. Main Equipment",null,null,null,8],
 [8,null,null,"xxx","xxx",8],
 [23,"Part B: OTHERS / B部分：其它"],
 [24,"B1","Engineering and design / 工程设计",null,null,"1 lot"],
 [25,"B2","DDP delivery of Documentation including final as-built",null,null,"1 lot"],
 [26,"B3","Inspection, Testing and Certification as per ITP",null,null,"1 lot"],
 [27,"B4","Painting / Protective coating",null,null,"1 lot"],
 [28,"B5","Packing and Marking",null,null,"1 lot"],
 [29,"B6","Transportation to DDP PURCHASER'YARD",null,null,"1 lot"],
 [30,"B7","3 months Free Storage in Vendor’s Workshop",null,null,"1 lot"],
 [31,"B8","Training for Enduser / PURCHASER personnel",null,null,"1 lot",null,null,"lump-sum or unit rates"],
 [32,"B9","Specialist field assistance",null,null,"1 lot",null,null,"lump-sum or unit rates"],
 [33,"B10","Erection, Pre-commissioning, Commissioning and Start Up Spares",null,null,"1 lot","refer to Annex B10"],
 [34,"B11","Special Tools for operation and maintenance",null,null,"1 lot","refer to Annex B11"],
 [35,"B12","First Filling",null,null,"1 lot","refer to Annex B12"],
 [36,"B13","Consumables for safe preservation, operation and maintenance",null,null,"1 lot","refer to Annex B13"],
 [37,"B14","Commercial Bonds & Insurance",null,null,"1 lot"],
 [38,"Total / 合计"],
 [39,"Prices shall include all the scope of supply"],
 [40,"Part C: OPTIONS / 选项"],
 [41,"C1","Capital Spares",null,null,"1 lot","refer to Annex C1"],
 [42,"C2","2 years normal operation spare parts",null,null,"1 lot","refer to Annex C2"],
 [43,null,"Remark: Delivery term shall follow program logistic"]
];
const annexSpecs=[
 ["B10 CommSpares","ERECTION, PRECOMMISSIONING, COMMISSIONING, START UP SPARES",22,9],
 ["B11 SpecialTool","SUPPLIER RECOMMENDATION FOR SPECIAL TOOLS",22,9],
 ["B13 Consumerables","SUPPLIER RECOMMENDATION FOR CONSUMABLES",22,9],
 ["C1 CapitalSpares","SUPPLIER RECOMMENDATION FOR CAPITAL SPARE PARTS",21,10],
 ["C2 2Y-Spares","SUPPLIER RECOMMENDATION FOR 2 YEARS OPERATION SPARE PARTS",23,10]
];
const annexSheet=([name,title,maxRow,cols])=>{
 const cellRows=[
  [2,null,title],
  [4,null,"Item / 序号","Tag No / 位号","Description / 描述","Detail Specification / 详细规格","Materials / 材质","QTY / 数量","DDP site / DDP现场交货"],
  [5,null,null,null,null,null,null,null,"UNIT PRICE (CURRENCY) / 单价","TOTAL PRICE (CURRENCY) / 总价"]
 ];
 if(cols===10)cellRows[2].push("Lead time (ARO) / 交货期");
 for(let r=6;r<=18;r++){
  const row=[r];if(name==="C2 2Y-Spares"){row[8]="Not quote";row[9]="Not quote";}
  cellRows.push(row);
 }
 cellRows.push([19,null,"Total Price DDP PURCHASER'S YARD:",null,null,null,null,null,"Not quote"]);
 if(name==="C1 CapitalSpares"||name==="C2 2Y-Spares")cellRows.push([21,null,"Remark: Above Price of spare parts is valid up to"]);
 else if(name!=="B13 Consumerables")cellRows.push([20,null,"Remark: Please include installation and commissioning costs"]);
 return {name,title,maxRow,columns:cols,rows:cellRows};
};
export const OFFICIAL_WORKBOOK_TEMPLATE_0553=Object.freeze({
 id:"4-Scope of Supply.xlsx",source:"USER_UPLOADED_OFFICIAL_TEMPLATE",currencyLabel:"CURRENCY",
 sheets:[
  {name:"Scope of supply",title:"Scope of supply / 供货范围",maxRow:44,columns:8,rows:summaryRows},
  ...annexSpecs.map(annexSheet)
 ],
 note:"Rendering schema preserves all worksheet rows and column positions including intentionally blank cells. Native XLSX controls exact merged ranges, formatting and formulas."
});
