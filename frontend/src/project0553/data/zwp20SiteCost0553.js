import {ZWP20_BARTEC_NEXTG_REFERENCE_MAP} from "./zwp20BartecNextgMap";
// ZWP20 SCADA MR0001 single allocation ledger: never add vendor alternatives or quote-wide quantities.
// Each MTO source row owns its cost once. A/B/C classifications and missing sources stay explicit.
import {WORKING_BOM_BY_LOCATION_0553} from "./workingBomByLocation";
import {deriveEngineeringOwnedCost0553} from "./engineeringOwnedCost0553";
import NEXTG from "./quotes/NG-260916-ADV-DAP1.full.json";
import {SUPPLIER_QUOTE_LINES_0553} from "./supplierQuoteLines";
const lineByCode=new Map(NEXTG.lines.map(q=>[q.code,q]));
const cisco=SUPPLIER_QUOTE_LINES_0553.find(q=>q.id==="VST-0048-RE1");
const money=(q,p)=>Number.isFinite(q)&&Number.isFinite(p)?Math.round(q*p*100)/100:null;
const SOURCE="MTO Rev04 ZWP20 rows 4–11";
function rowCost(item){
 const q=item.sourceScopeQty;
 const base={id:item.id,site:item.site,row:item.sourceRow,tag:item.sourceTag,description:item.description,
  sourceQty:q,sourceUnit:item.sourceScopeUnit,basis:SOURCE,quantityBasis:"Engineering source / physical interface",vendor:null,sku:null,
  currency:null,unitCost:null,extended:null,assumptions:[],status:"UNPRICED_BUDGETARY_SCOPE"};
 if(item.sourceRow===4){
  const d=deriveEngineeringOwnedCost0553(item);
  return {...base,vendor:"Next G / Aviat",sku:"Engineering-derived remote radio functional composition",
   currency:"USD",unitCost:d.budgetaryItemTotalUSD,extended:d.budgetaryItemTotalUSD,
   detail:d.components,quantityBasis:"MTO 1 Set + RPT topology + explicit radio functional parameters",
   status:d.budgetaryCoverage?"BUDGETARY_CALCULATED":"BUDGETARY_PARTIAL",
   assumptions:["Region key B-4 USD0 incremental assumption; no supplier rate","Radio ODU only: separate MTO surge, antenna and enclosure are not counted here"]};
 }
 if(item.sourceRow===5){
  const odU=WORKING_BOM_BY_LOCATION_0553.locations.find(l=>l.site==="ZWP20")?.items.find(x=>x.sourceRow===4);
  const engineering=odU?deriveEngineeringOwnedCost0553(odU):null;
  const functionalCost=engineering?.budgetaryIndoorInterfaceUSD??null;
  return {...base,vendor:"Next G / Aviat",sku:"PS-DCDC-HAZ-POE-IND-01 + PPT-B (indoor PoE interface only)",
   currency:"USD",unitCost:functionalCost,extended:functionalCost,
   quantityBasis:"MTO Rev04 row 5: IDU function 1 Set; AFC BLD-0001 Rev.C1 sheet 3/7 Note 8: new IDU + surge in new Ex e enclosure",
   status:"BUDGETARY_PARTIAL_INTERFACE_ONLY",bartecMapping:ZWP20_BARTEC_NEXTG_REFERENCE_MAP.entries.filter(e=>e.allocation==="MR-502-001A row5"),
   assumptions:["USD 667.67 + USD 3.60: sourced PoE supply and cord only, allocated from Radio ODU exactly once","Not a separately offered or technically proven complete IDU: dedicated IDU/equivalent functionality remains an explicitly qualified scope gap","AFC BLD requires new IDU; if using an integrated outdoor-radio design, document compliant indoor interface equivalence and deviation","Surge remains solely at MTO row 10; Ex e enclosure remains row 9"]};
 }
 if(item.sourceRow===6){
  const vendor=lineByCode.get("B-12");
  // User-directed budgetary 4ft option at ZWP20 RX end, pending RF availability recheck.
  return {...base,vendor:"Next G / Aviat",sku:vendor.partNumber,currency:"USD",
   unitCost:vendor.unitPrice,extended:money(q,vendor.unitPrice),
   quantityBasis:"1 antenna endpoint from ZWP8→ZWP20 RPT and ZWP20 MTO 1 Set",
   status:"BUDGETARY_CALCULATED",assumptions:["4ft B-12 preliminary per management downsize; final RPT/OEM gain/availability confirmation required","Do not sum 6ft alternative"]};
 }
 if(item.sourceRow===7){
  const relevant=(cisco?.lines||[]).filter(v=>["1.0","1.0.1","1.1","1.6.1","2.0","2.0.1"].includes(v[0]));
  const unit=relevant.reduce((n,v)=>n+(Number.isFinite(v[4])?v[4]:0),0);
  return {...base,vendor:"VST ECS / Cisco",sku:"IE-3400 + IE-3300 + priced modules/licences",currency:"THB",
   unitCost:unit,extended:money(q,unit),status:"BUDGETARY_CALCULATED",
   quantityBasis:"1 LAN Set in ZWP20 MTO, reconciled with 5-switch vendor quote across five locations",
   assumptions:["Current quote expired; included SmartNet/subscription terms per offered package","Zero-priced source software lines are included, not separately charged"]};
 }
 if(item.sourceRow===8){
  const quote=SUPPLIER_QUOTE_LINES_0553.find(v=>v.id==="SONIC-CCY24-PXC-633");
  const source=quote?.lines.find(v=>v[1]==="FL-PP-RJ45-SC");
  const rate=Number.isFinite(source?.[4])?source[4]:null;
  const weidmuellerPlug={functionId:"DATO_RJ45_FIELD_PLUG",vendor:"Weidmüller / INNOVA quotation expected",
    sku:"IE-PS-RJ45-FH-BK",orderNo:"1963600000",qty:1,currency:"THB",
    unitPrice:0,extended:0,priceBasis:"MANAGEMENT_APPROVED_TEMPORARY_ZERO__INNOVA_QUOTATION_TO_FOLLOW",
    source:"1963600000_IE-PS-RJ45-FH-BK_en.pdf",exStatus:"IP20_DATASHEET__EX_COMPLIANCE_NOT_ESTABLISHED"};
  return {...base,vendor:"Sonic Automation / Phoenix Contact + Weidmüller (INNOVA pending)",sku:"FL-PP-RJ45-SC + IE-PS-RJ45-FH-BK (budgetary DATO components)",components:[
    {functionId:"DATO_RJ45_PANEL_INTERFACE",vendor:"Sonic Automation / Phoenix Contact",sku:"FL-PP-RJ45-SC",qty:q,currency:"THB",unitPrice:rate,extended:money(q,rate),priceBasis:"CCY24-PXC-633 historical quotation"},
    weidmuellerPlug
   ],
   currency:rate!==null?"THB":null,unitCost:rate,extended:money(q,rate),
   quantityBasis:"MTO Rev04 DATO-507-001 1 Set; assumed one RJ45 patch panel as provisional budgetary interface equivalent; actual Ex-rated disconnect composition must be checked",
   status:"MANAGEMENT_APPROVED_BUDGETARY_BASIS",decision:"Management accepted FL-PP-RJ45-SC THB 1,900 and temporary Weidmüller RJ45 plug THB 0 as ZWP20 DATO budget components; INNOVA quote will replace zero; technical Ex compliance remains separate",
   assumptions:["Historical Sonic CCY24-PXC-633 11-Jul-2024 THB 1,900 / EA ex VAT; quotation validity expired",
    "Weidmüller IE-PS-RJ45-FH-BK (Order No. 1963600000), 1 provisional plug × THB 0 temporary management allowance; replace with INNOVA quotation rate when supplied. IP20 datasheet is NOT Ex certification",
    "Phoenix FL-PP-RJ45-SC has quoted price but is NOT established as full DATO Ex-rated socket and plug. Keep technical gap, hazardous-area certification and accessory assembly as separate unresolved scope",
    "Estimate quantity 1 Set is provisional; do not use vendor quoted quantity"]};
 }
 if(item.sourceRow===9)return {...base,bartecMapping:ZWP20_BARTEC_NEXTG_REFERENCE_MAP.entries.filter(e=>e.allocation.includes("TCAB-500-001 row9")),quantityBasis:"MTO 1 Telecom Enclosure; verify SCADA panel Ex rating, cut-outs, cooling and mounting",
  assumptions:["Do not substitute Ex Telephone JB or Zawtika 1E panel historical price without technical scope reconciliation"]};
 if(item.sourceRow===10){
  const vendor=lineByCode.get("B-8");
  return {...base,vendor:"Next G / Aviat",sku:vendor.partNumber,currency:"USD",unitCost:vendor.unitPrice,
   extended:money(q,vendor.unitPrice),status:"BUDGETARY_CALCULATED",
   quantityBasis:"MTO SA-502-001 1 Set, allocated exclusively to this row, not Radio ODU",
   assumptions:["Check industrial PoE surge technology and earthing/Ex scope with selected system"]};
 }
 if(item.sourceRow===11)return {...base,quantityBasis:"MTO 1 Lot bulk; derive cable lengths, glands, earthing and routes from LAY/BLD/DWG",
  assumptions:["A Lot cannot be priced by treating one lot as one cable, gland or accessory","Coax/Ethernet fire performance TC-0001 items 7–8; verify take-off"]};
 return base;
}
export function deriveZWP20SiteCost0553(){
 const site=WORKING_BOM_BY_LOCATION_0553.locations.find(l=>l.site==="ZWP20");
 const rows=(site?.items||[]).map(rowCost);
 const currencies=["USD","THB"];
 const subtotals=Object.fromEntries(currencies.map(currency=>[currency,Math.round(rows.filter(r=>r.currency===currency&&Number.isFinite(r.extended)).reduce((n,r)=>n+r.extended,0)*100)/100]));
 const gaps=rows.filter(r=>r.extended===null||r.status==="BUDGETARY_PARTIAL_INTERFACE_ONLY");
 return {site:"ZWP20",moduleId:"PJ2608-0553 / bid.budget.bom.zwp20",system:"MR-0001",rows,subtotals,gaps,
  pricedRows:rows.filter(r=>Number.isFinite(r.extended)).length,totalRows:rows.length,
  status:gaps.length?"PRICED_SUBTOTAL_WITH_EXPLICIT_SCOPE_GAPS":"BUDGETARY_SCOPE_COSTED",
  fxStatus:"NO_UNSUPPORTED_CURRENCY_CONVERSION",releaseAllowed:false};
}
