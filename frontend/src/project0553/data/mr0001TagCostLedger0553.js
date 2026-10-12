// MR0001 controlled tag-level cost ledger: same one-owner-per-MTO-item rule as ZWP20.
// No blind quote-wide multiplication or conversion of candidate prices to approved costs.
import {ZWP8_ROW43_COST_TRACE} from "./zwp8Row43CostTrace";
import {deriveZWP20SiteCost0553} from "./zwp20SiteCost0553";
import {WORKING_BOM_BY_LOCATION_0553} from "./workingBomByLocation";
import {SCADA_LINKS_0553} from "./scadaLinkEvidence";
import NEXTG from "./quotes/NG-260916-ADV-DAP1.full.json";
import {SUPPLIER_QUOTE_LINES_0553} from "./supplierQuoteLines";
const round=n=>Math.round(n*100)/100;
const quoteLines=new Map(NEXTG.lines.map(x=>[x.code,x]));
const costFunctions=(codes)=>codes.map(code=>quoteLines.get(code)).filter(Boolean).map(q=>({functionId:q.code,sku:q.partNumber,qty:1,unitPrice:q.unitPrice,currency:"USD",extended:Number.isFinite(q.unitPrice)?q.unitPrice:null,source:NEXTG.quoteNumber,status:q.pricingState}));
const zwp8=ZWP8_ROW43_COST_TRACE;
const scenario=zwp8.referenceScenarios.find(x=>x.id===zwp8.preferredScenarioId);
const radioTags=["MR-502-003","MR-502-004"];
const antennaTags=["ANT-502-002","ANT-502-003"];
const zwp8Rows=zwp8.items.map(item=>{
 const radio=radioTags.includes(item.tag),antenna=antennaTags.includes(item.tag);
 const rate=radio?scenario?.radioAssemblyUnitUSD:antenna?scenario?.antennaUnitUSD:null;
 const extended=Number.isFinite(rate)?round(item.sourceQty*rate):null;
 return {site:"ZWP8",mr:"MR-0001",row:43,tag:item.tag,description:item.role,
  sourceQty:item.sourceQty,sourceUnit:item.sourceUnit,currency:"USD",unitCost:rate,
  extended,status:extended===null?"NO_SELECTED_BUDGET_RATE":"MANAGEMENT_PREFERRED_4FT_PRELIMINARY__OEM_TO_CONFIRM",
  source:"ZWP8_ROW43_COST_TRACE / "+zwp8.quote,selectedScenario:zwp8.preferredScenarioId,
  countedInWorkingTotal:Number.isFinite(extended),
  note:radio?"Remote radio functional assembly; IDU and OEM entitlement remain to confirm":
    antenna?"4ft antenna budget preference, final RPT/OEM approval pending":
    "Separate IDU function not costed by this scenario"};
});
if(Number.isFinite(scenario?.partialEquipmentUSD)){
 const sum=round(zwp8Rows.filter(r=>r.countedInWorkingTotal).reduce((n,r)=>n+r.extended,0));
 if(sum!==round(scenario.partialEquipmentUSD))throw Error("ZWP8 MTO-row43 allocations do not reconcile to preferred source scenario");
}
// The same lineage applies to ALL seven sites. A row with source evidence but no
// selected engineering configuration is NOT priced, regardless of quote candidates.
export function selectMR0001TagCostRows0553(site){
 const original=WORKING_BOM_BY_LOCATION_0553.locations.find(x=>x.site===site)?.items||[];
 if(site==="ZWP20")return deriveZWP20SiteCost0553().rows.map(x=>({...x,mr:"MR-0001",countedInWorkingTotal:Number.isFinite(x.extended)}));
 const detailed=site==="ZWP8"?zwp8Rows:[];
 const byKey=new Map(detailed.map(x=>[x.row+"|"+x.tag,x]));
 return original.map(item=>{
  const selected=byKey.get(item.sourceRow+"|"+item.sourceTag);
  if(selected)return selected;
  // ZWP21 has one source-evidenced PTP peer to ZWP11 in RPT-0001.
  // Group C (remote terminal) is a reversible management working configuration,
  // NOT an OEM-accepted PTP solution. Cost functions are owned by distinct MTO tags.
  const ptp=site==="ZWP21"&&SCADA_LINKS_0553.some(l=>l.mode==="PTP"&&l.from==="ZWP11"&&l.to==="ZWP21");
  const oneSet=item.sourceScopeQty===1;
  let functions=[];
  let workingStatus=null;
  if(ptp&&oneSet&&item.sourceTag==="MR-502-001"){
   functions=costFunctions(["C-1","C-2","C-3","C-5"]);
   workingStatus="PTP_PEER_GROUP_C_PROVISIONAL_RADIO_FUNCTIONS__OEM_TO_CONFIRM";
  }else if(ptp&&oneSet&&item.sourceTag==="MR-502-001A"){
   functions=costFunctions(["C-6","C-7"]);
   workingStatus="PTP_INDOOR_POWER_INTERFACE_ONLY__IDU_FUNCTION_OPEN";
  }else if(ptp&&oneSet&&/^ANT-502-/.test(item.sourceTag)){
   functions=costFunctions(["C-11"]);
   workingStatus="PTP_3FT_ANTENNA_RPT_REFERENCE__OEM_TO_CONFIRM";
  }else if(ptp&&oneSet&&/^SA-502-/.test(item.sourceTag)){
   functions=costFunctions(["C-8"]);
   workingStatus="ETHERNET_SURGE_CANDIDATE_INTERFACE__VERIFY_EX";
  }
  // ZWP20 TCAB-500-001 row 9 and ZWP21 row 18 share an enclosure
  // function, but retain site-specific source quantity and Ex/thermal review.
  if(site==="ZWP21"&&oneSet&&item.sourceTag==="TCAB-500-001"&&item.sourceRow===18){
   const historical=SUPPLIER_QUOTE_LINES_0553.find(q=>q.id==="PROSPER-24051");
   const line=historical?.lines.find(v=>v[0]==="1");
   const rate=Number.isFinite(line?.[4])?line[4]:null;
   return {site,mr:"MR-0001",row:item.sourceRow,tag:item.sourceTag,
    description:item.description,sourceQty:item.sourceScopeQty,sourceUnit:item.sourceScopeUnit,
    currency:"THB",unitCost:rate,extended:Number.isFinite(rate)?round(rate*item.sourceScopeQty):null,
    vendor:"BARTEC / Prosper E&T (historical comparable)",sku:line?.[1]||null,
    source:"PROSPER-24051 / 2024 Zawtika 1E / MTO Rev04 ZWP21 Row 18",
    status:"BUDGETARY_HISTORICAL_COMPARABLE__ZWP21_EX_SCOPE_REVIEW",
    quantityBasis:"ZWP21 MTO Rev04 row 18, TCAB-500-001 1 Set; enclosure separately owned from radio, IDU, surge and LAN",
    assumptions:["Same enclosure cost-estimation method as ZWP20 TCAB-500-001 row 9; NOT a verified 1F vendor quote",
     "THB 39,200/set is 2024 historical BARTEC SCADA Ex e panel comparable; item 2 THB 38,800 is alternative only",
     "Verify Ex e certification, panel sizing, heat load, entries, gland and free-issued equipment boundaries for ZWP21"],
    countedInWorkingTotal:Number.isFinite(rate),
    quotedRateCandidates:(historical?.lines||[]).filter(x=>["1","2"].includes(x[0])).map(x=>({quoteLine:x[0],sku:x[1],unitPriceTHB:x[4],selected:x[0]==="1"}))};
  }
  if(site==="ZWP21"&&oneSet&&item.sourceTag==="DATO-507-001"&&item.sourceRow===17){
   const quote=SUPPLIER_QUOTE_LINES_0553.find(x=>x.id==="SONIC-CCY24-PXC-633");
   const line=quote?.lines.find(x=>x[1]==="FL-PP-RJ45-SC");
   const panel=Number.isFinite(line?.[4])?line[4]:null;
   const plug=1176.68; // Existing ZWP20 budget retail reference, NOT a vendor quote.
   const total=Number.isFinite(panel)?round(item.sourceScopeQty*(panel+plug)):null;
   return {site,mr:"MR-0001",row:17,tag:item.sourceTag,description:item.description,
    sourceQty:item.sourceScopeQty,sourceUnit:item.sourceScopeUnit,currency:"THB",
    vendor:"Sonic / Phoenix Contact + RS Thailand / Weidmüller",
    sku:"FL-PP-RJ45-SC + IE-PS-RJ45-FH-BK",
    unitCost:Number.isFinite(panel)?round(panel+plug):null,extended:total,
    countedInWorkingTotal:Number.isFinite(total),
    source:"SONIC-CCY24-PXC-633 / RS Thailand indicative / MTO Rev04 ZWP21 Row17",
    status:"PRELIMINARY_DATO_INTERFACE__EX_CERTIFICATION_REVIEW",
    quantityBasis:"1 Set per ZWP21 MTO row17; 1 panel connector and 1 field plug budgetary",
    components:[{functionId:"DATO_RJ45_PANEL_INTERFACE",sku:"FL-PP-RJ45-SC",qty:1,currency:"THB",unitPrice:panel,extended:panel,source:"SONIC-CCY24-PXC-633"},
     {functionId:"DATO_RJ45_FIELD_PLUG",sku:"IE-PS-RJ45-FH-BK",qty:1,currency:"THB",unitPrice:plug,extended:plug,source:"RS Thailand indicative"}],
    assumptions:["ZWP20 DATO budgeting method reused, but ZWP21 technical Ex compliance not verified",
     "IP20 retail plug is a price analogue only; do not release as certified Ex disconnect","Not additional to a vendor-free-issued package if included"]};
  }
  if(site==="ZWP21"&&item.sourceRow===20&&/bulk material/i.test(item.sourceTag)){
   const rate=524,baseM=60,allowance=0.15,purchaseM=Math.ceil(baseM*(1+allowance));
   const gland=1020;
   const components=[{functionId:"SCADA_CAT6A_FIELD_RUN",sku:"TECKNIKABEL CAT6A S/FTP",qty:purchaseM,currency:"THB",unitPrice:rate,extended:round(purchaseM*rate),source:"INNOVA QA24-0604 historical"},
    {functionId:"SCADA_INDOOR_ENTRY",sku:"501/453/UNIV/A/M20",qty:1,currency:"THB",unitPrice:gland,extended:gland,source:"INNOVA QA24-0604 historical"}];
   const total=round(components.reduce((n,c)=>n+c.extended,0));
   return {site,mr:"MR-0001",row:20,tag:"BULK-MATERIAL",description:item.description,
    sourceQty:item.sourceScopeQty,sourceUnit:item.sourceScopeUnit,currency:"THB",
    unitCost:total,extended:total,countedInWorkingTotal:true,
    vendor:"INNOVA historical / Engineering allowance",sku:"SCADA CAT6A + indoor certified entry candidate",
    source:"MTO Rev04 ZWP21 Row20 / INNOVA QA24-0604 / Approved greenfield base",
    status:"PARTIAL_BULK_BUDGETARY__NOT_MEASURED",
    quantityBasis:"One assumed SCADA field route 60m + 15% purchasing allowance = 69m; one indoor M20 entry only",
    components,
    assumptions:["Uses ZWP20 budget method, not an as-built route measurement","Exclude duplicate SCADA cable from standalone bulk projection",
     "Other coax, glands, grounding and distinct runs remain unpriced until interface takeoff"]};
  }
  // Cross-location matching to ZWP20 method: compare the MTO Tag and location scope.
  // Greenfield site-specific rows only. Brownfield equipment ownership remains
  // unallocated pending NEW/REUSE scope; never assume a replacement is required.
  const fullGreenfield=["ZWP22","ZWP23"].includes(site);
  const siteRows={ZWP22:{dato:26,tcab:27,bulk:29},ZWP23:{dato:33,tcab:34,bulk:36}};
  const rowMap=siteRows[site];
  if(fullGreenfield&&rowMap&&oneSet&&item.sourceTag==="DATO-507-001"&&item.sourceRow===rowMap.dato){
   const q=SUPPLIER_QUOTE_LINES_0553.find(x=>x.id==="SONIC-CCY24-PXC-633")?.lines.find(x=>x[1]==="FL-PP-RJ45-SC");
   const panel=Number.isFinite(q?.[4])?q[4]:null;
   const plug=1176.68;
   const unit=Number.isFinite(panel)?round(panel+plug):null;
   return {site,mr:"MR-0001",row:item.sourceRow,tag:item.sourceTag,description:item.description,
    sourceQty:item.sourceScopeQty,sourceUnit:item.sourceScopeUnit,currency:"THB",
    unitCost:unit,extended:Number.isFinite(unit)?round(unit*item.sourceScopeQty):null,
    vendor:"Sonic / Phoenix Contact + RS Thailand / Weidmüller",sku:"FL-PP-RJ45-SC + IE-PS-RJ45-FH-BK",
    source:"SONIC-CCY24-PXC-633 + RS retail analogue / MTO Rev04",
    status:"BUDGETARY_DATO_ASSEMBLY_EX_COMPLIANCE_NOT_VERIFIED",countedInWorkingTotal:Number.isFinite(unit),
    quantityBasis:"MTO one DATO set; one panel interface and one field plug as budgetary comparison",
    components:[{functionId:"RJ45_PANEL",sku:"FL-PP-RJ45-SC",qty:1,currency:"THB",unitPrice:panel,extended:panel},
      {functionId:"FIELD_PLUG",sku:"IE-PS-RJ45-FH-BK",qty:1,currency:"THB",unitPrice:plug,extended:plug}],
    assumptions:["ZWP20 costing method only; Ex-rated quick disconnect not technically confirmed","Free-issued and vendor-included interfaces must not be counted twice"]};
  }
  if(fullGreenfield&&rowMap&&oneSet&&item.sourceTag==="TCAB-500-001"&&item.sourceRow===rowMap.tcab){
   const q=SUPPLIER_QUOTE_LINES_0553.find(x=>x.id==="PROSPER-24051")?.lines.find(x=>x[0]==="1");
   const rate=Number.isFinite(q?.[4])?q[4]:null;
   return {site,mr:"MR-0001",row:item.sourceRow,tag:item.sourceTag,description:item.description,
    sourceQty:item.sourceScopeQty,sourceUnit:item.sourceScopeUnit,currency:"THB",unitCost:rate,
    extended:Number.isFinite(rate)?round(rate*item.sourceScopeQty):null,
    vendor:"BARTEC / Prosper E&T historical comparable",sku:q?.[1]||null,
    source:"PROSPER-24051 / historical Zawtika 1E",
    status:"BUDGETARY_ENCLOSURE_HISTORICAL_ANALOGUE",countedInWorkingTotal:Number.isFinite(rate),
    quantityBasis:"MTO one enclosure set; internal components owned by their own MTO rows",
    assumptions:["ZWP20 method, not a verified Phase 1F quotation","Ex e enclosure dimensions, thermal load, entries and installation certificate require confirmation"]};
  }
  if(fullGreenfield&&rowMap&&item.sourceRow===rowMap.bulk&&/bulk material/i.test(item.sourceTag)){
   const purchaseM=69,rate=524,gland=1020;
   const lines=[{functionId:"SCADA_CAT6A_FIELD_RUN",sku:"TECKNIKABEL CAT6A S/FTP",qty:purchaseM,currency:"THB",unitPrice:rate,extended:purchaseM*rate},
    {functionId:"SCADA_INDOOR_ENTRY",sku:"501/453/UNIV/A/M20",qty:1,currency:"THB",unitPrice:gland,extended:gland}];
   const total=round(lines.reduce((n,x)=>n+x.extended,0));
   return {site,mr:"MR-0001",row:item.sourceRow,tag:"BULK-MATERIAL",description:item.description,
    sourceQty:item.sourceScopeQty,sourceUnit:item.sourceScopeUnit,currency:"THB",unitCost:total,extended:total,
    vendor:"INNOVA historical / engineering route allowance",sku:"CAT6A plus single M20 entry candidate",
    source:"MTO Rev04 / INNOVA QA24-0604 / approved greenfield budget basis",
    status:"PARTIAL_BULK_ROUTE_ALLOWANCE_NOT_MEASURED",countedInWorkingTotal:true,
    quantityBasis:"One assumed route 60m + 15% purchasing = 69m and one panel gland, subject to actual routing",
    components:lines,
    assumptions:["ZWP20 methodology only; separate site routes and cable counts unverified","Remaining RF, glands and grounding functions outside this partial cost","Do not add separate SCADA bulk scenario again"]};
  }
  const pricedFunctions=functions.length>0&&functions.every(x=>Number.isFinite(x.extended));
  const functionCost=pricedFunctions?round(functions.reduce((n,x)=>n+x.extended,0)):null;
  if(functionCost!==null)return {site,mr:"MR-0001",row:item.sourceRow,tag:item.sourceTag,
   description:item.description,sourceQty:item.sourceScopeQty,sourceUnit:item.sourceScopeUnit,
   currency:"USD",unitCost:functionCost,extended:functionCost,
   vendor:"Next G / Aviat",sku:functions.map(x=>x.sku).join(" + "),
   status:workingStatus,source:"RPT-0001 C1 ZWP11↔ZWP21 PTP / "+NEXTG.quoteNumber,
   detail:functions.map(c=>({...c,requiredQty:c.qty,budgetaryUnitPrice:c.unitPrice,budgetaryExtended:c.extended,budgetarySelectedSKU:c.sku,allocationOwner:item.sourceTag+"."+item.sourceRow,quantityState:"MTO_ONE_SET_PRELIMINARY",budgetarySelectionState:"PROVISIONAL_QUOTE_RATE"})),
   quantityBasis:"MTO Rev04 1 Set and one PTP ZWP11–ZWP21 RPT endpoint; provisional one-per-function",
   components:functions,assumptions:["Group C is a provisional budget cost composition, not selected/approved OEM design",
    "Region license C-4 has no quote rate; not treated as zero or complete",
    "The separately required IDU functional compliance, antenna gain and Ex interface must be checked"],
   countedInWorkingTotal:true};
  const priced=Number.isFinite(item.indicativePackageCostTHB);
  return {site,mr:"MR-0001",row:item.sourceRow,tag:item.sourceTag,
   description:item.description,sourceQty:item.sourceScopeQty,sourceUnit:item.sourceScopeUnit,
   currency:priced?"THB":null,unitCost:priced&&item.sourceScopeQty>0?round(item.indicativePackageCostTHB/item.sourceScopeQty):null,
   extended:priced?round(item.indicativePackageCostTHB):null,
   status:priced?"CISCO_PRELIMINARY_WORKING_BUNDLE":"ENGINEERING_SELECTION_OR_PRICE_MAPPING_REQUIRED",
   source:priced?"VST-0048-RE1 / MTO Rev04":"MTO Rev04 / vendor candidates only",
   candidates:item.vendorCandidates||[],countedInWorkingTotal:priced,
   note:priced?"Cisco source quote is not OEM-accepted system BOM":"Selection must follow site-specific BLD/RPT/topology, not nearest vendor rate"};
 });
}
export function summarizeMR0001TagCost0553(site){
 const rows=selectMR0001TagCostRows0553(site);
 const subtotals={USD:0,THB:0};
 for(const x of rows)if(x.countedInWorkingTotal&&Number.isFinite(x.extended)&&x.currency in subtotals)
  subtotals[x.currency]=round(subtotals[x.currency]+x.extended);
 return {site,rows,subtotals,costedRows:rows.filter(x=>x.countedInWorkingTotal).length,
  unresolvedRows:rows.filter(x=>!x.countedInWorkingTotal),
  totalRows:rows.length,status:rows.some(x=>!x.countedInWorkingTotal)?"PARTIAL_ENGINEERING_COST_LEDGER":"BUDGETARY_PRICED_NOT_RELEASED"};
}
export const ZWP8_TAG_WORKING_LEDGER_0553=Object.freeze(zwp8Rows);
