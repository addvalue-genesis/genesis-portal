// PJ2608-0553 customer format map. Commercial state mechanics reuse 0550's
// working / frozen budgetary / gated release doctrine; never import 0550 facts.
export const COMMERCIAL_TEMPLATE_0553={
 id:"0553-ZM169-SCOPE-REV08",project:"PJ2608-0553",sourceName:"4-Scope of Supply.xlsx",revision:"Rev08",currency:"USD",
 sourceId:"1KSfxvPfgS8XcvwaQUeacmgdX32yobwVk",
 sheets:[
 {name:"Scope of supply",kind:"SUMMARY",code:"A/B/C",includedInBase:"A+B"},
 {name:"B10 CommSpares",kind:"DETAIL",code:"B10",totalCell:"I19",priceColumn:"I",unitColumn:"H",quantityColumn:"G"},
 {name:"B11 SpecialTool",kind:"DETAIL",code:"B11",totalCell:"I19",priceColumn:"I",unitColumn:"H",quantityColumn:"G"},
 {name:"B13 Consumerables",kind:"DETAIL",code:"B13",totalCell:"I19",priceColumn:"I",unitColumn:"H",quantityColumn:"G"},
 {name:"C1 CapitalSpares",kind:"OPTION",code:"C1",includedInBase:false},
 {name:"C2 2Y-Spares",kind:"OPTION",code:"C2",includedInBase:false}
 ],
 mappings:[
 {code:"A1",source:"MR-0001 / SCADA",driver:"equipmentBOM",sheet:"Scope of supply"},
 {code:"A2",source:"MR-0002 / DMR",driver:"equipmentBOM",sheet:"Scope of supply"},
 {code:"A3",source:"MR-0003 / Telephone",driver:"equipmentBOM",sheet:"Scope of supply"},
 {code:"A4",source:"MR-0004 / RACON",driver:"equipmentBOM",sheet:"Scope of supply"},
 {code:"A5",source:"Cross-system bulk",driver:"physicalBOM",sheet:"Scope of supply"},
 ...["B10","B11","B13","C1","C2"].map(code=>({code,source:"MR0001–0004 supplier scope",driver:"linkedDetailSheet",sheet:{"B10":"B10 CommSpares","B11":"B11 SpecialTool","B13":"B13 Consumerables","C1":"C1 CapitalSpares","C2":"C2 2Y-Spares"}[code]}))
 ],
 policy:{stateIds:["working","budgetary","released"],recipients:["INTERNAL","SAMTEL","JUTAL_CNEEC"],snapshotImmutable:true,partCOptional:true,sourceSpecific:true}
};
export function reconcileCommercialSheets({summaryLines=[],detailSheets={},sourceId}={}){
 const checks=[];
 for(const s of COMMERCIAL_TEMPLATE_0553.sheets.filter(x=>x.kind!=="SUMMARY")){
  const summary=summaryLines.find(x=>x.code===s.code);
  const details=detailSheets[s.name];
  if(!summary||!Array.isArray(details)){checks.push({code:s.code,status:"OPEN_SOURCE",reason:!summary?"Summary item missing":"Detail rows not loaded"});continue;}
  const unknown=details.filter(x=>!Number.isFinite(x.quantity)||!Number.isFinite(x.unitPrice));
  if(unknown.length){checks.push({code:s.code,status:"OPEN_INPUT",reason:unknown.length+" detail rows missing quantity/unit price"});continue;}
  const total=details.reduce((a,x)=>a+x.quantity*x.unitPrice,0);
  const summaryTotal=summary.total;
  checks.push({code:s.code,status:Number.isFinite(summaryTotal)&&Math.abs(summaryTotal-total)<0.01?"MATCH":"MISMATCH",detailTotal:total,summaryTotal,sourceId});
 }
 return {releaseAllowed:checks.every(x=>x.status==="MATCH")&&Boolean(sourceId),checks};
}
export function commercialTransition({state,action,approved=false,snapshotId=null}){
 if(action==="EDIT"&&state!=="working")return {allowed:false,reason:"Frozen snapshots cannot be edited"};
 if(action==="ISSUE_BUDGETARY")return {allowed:state==="working"&&approved&&Boolean(snapshotId),nextState:"budgetary"};
 if(action==="RELEASE")return {allowed:state==="working"&&approved&&Boolean(snapshotId),nextState:"released"};
 return {allowed:action==="EDIT"&&state==="working",nextState:state};
}
