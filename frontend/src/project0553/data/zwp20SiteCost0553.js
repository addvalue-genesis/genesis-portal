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
 if(item.sourceRow===5)return {...base,vendor:"Next G / Aviat",sku:"IDU function to integrate with ODU",
  quantityBasis:"1 source IDU Set; verify whether integrated / separate physical IDU is required",
  assumptions:["Do not invent a separate IDU price or assert included without OEM design evidence"]};
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
 if(item.sourceRow===8)return {...base,quantityBasis:"MTO 1 Set EX Ethernet quick disconnect; verify Ex zone, connectors and location",
  assumptions:["No 0553 verified DATO item unit price in selected-source ledger"]};
 if(item.sourceRow===9)return {...base,quantityBasis:"MTO 1 Telecom Enclosure; verify SCADA panel Ex rating, cut-outs, cooling and mounting",
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
 const gaps=rows.filter(r=>r.extended===null);
 return {site:"ZWP20",moduleId:"PJ2608-0553 / bid.budget.bom.zwp20",system:"MR-0001",rows,subtotals,gaps,
  pricedRows:rows.length-gaps.length,totalRows:rows.length,
  status:gaps.length?"PRICED_SUBTOTAL_WITH_EXPLICIT_SCOPE_GAPS":"BUDGETARY_SCOPE_COSTED",
  fxStatus:"NO_UNSUPPORTED_CURRENCY_CONVERSION",releaseAllowed:false};
}
