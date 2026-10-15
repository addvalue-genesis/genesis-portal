import {APPROVED_0553_BUDGET_BASIS,approvedCablePurchaseM} from "./approvedBudgetBasis0553";
import {ZWP20_BULK_SCOPE_AUDIT_0553} from "./zwp20BulkScopeAudit0553";
import {ZWP20_GA_BULK_RECONCILIATION} from "./zwp20GaBulkReconciliation";
import {ZWP20_BARTEC_NEXTG_REFERENCE_MAP} from "./zwp20BartecNextgMap";
// ZWP20 SCADA MR0001 single allocation ledger: never add vendor alternatives or quote-wide quantities.
// Each MTO source row owns its cost once. A/B/C classifications and missing sources stay explicit.
import {WORKING_BOM_BY_LOCATION_0553} from "./workingBomByLocation";
import {deriveEngineeringOwnedCost0553} from "./engineeringOwnedCost0553";
import NEXTG from "./quotes/NG-260916-ADV-DAP1.full.json";
import {SUPPLIER_QUOTE_LINES_0553} from "./supplierQuoteLines";
import {INNOVA_0553_PROVISIONAL_PRICES} from "./innovaHistoricalBudgetPrices";
import {findZwp20WebRate0553} from "./zwp20WebBulkRates0553";
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
  // INNOVA N/A is preserved as null. The older THB 0 allowance was superseded
  // by sourced RS retail evidence for the working budget (not an INNOVA/OEM quote).
  const innova=INNOVA_0553_PROVISIONAL_PRICES.quotations.find(v=>v.number==="QA24-0604");
  const plugQuote=innova?.lines.find(v=>v.partNumber==="IE-PS-RJ45-FH-BK");
  const plugQuotedRate=Number.isFinite(plugQuote?.unitPriceExVat)?plugQuote.unitPriceExVat:null;
  const plugQty=1; // ZWP20 engineering budget assumption; never copied from vendor quote qty
  const plugRsEvidence=findZwp20WebRate0553("RJ45"); // canonical 07 rate evidence
  const plugBudgetRate=plugQuotedRate===null?plugRsEvidence?.rateTHB??null:plugQuotedRate;
  const weidmuellerPlug={functionId:"DATO_RJ45_FIELD_PLUG",vendor:"RS Thailand / Weidmüller",
    sku:"IE-PS-RJ45-FH-BK",orderNo:"1963600000",qty:plugQty,currency:"THB",
    quotedUnitPrice:plugQuotedRate,unitPrice:plugBudgetRate,extended:money(plugQty,plugBudgetRate),
    priceBasis:plugQuotedRate===null?"RS_ONLINE_RETAIL_INDICATIVE_EX_VAT_NOT_VENDOR_RFQ":"INNOVA_QUOTED_PRICE_EX_VAT",
    budgetApproval:plugRsEvidence?.approvalStatus||"BUDGET_APPROVAL_NOT_RECORDED",
    budgetApprovedBy:plugRsEvidence?.approvalAuthority||null,
    budgetApprovalSource:plugRsEvidence?.approvalConfirmation||null,
    budgetApprovalScope:plugRsEvidence?.approvalScope||null,
    quote:"QA24-0604 (N/A)",quoteItem:2,source:plugQuotedRate===null?plugRsEvidence?.url??null:innova?.url||null,
    exStatus:"IP20_DATASHEET__EX_COMPLIANCE_NOT_ESTABLISHED"};
  const panelAmount=money(q,rate);
  const budgetaryDATO=Number.isFinite(panelAmount)&&Number.isFinite(weidmuellerPlug.extended)?Math.round((panelAmount+weidmuellerPlug.extended)*100)/100:null;
  return {...base,vendor:"Sonic Automation / Phoenix Contact + RS Thailand / Weidmüller (online indicative)",sku:"FL-PP-RJ45-SC + IE-PS-RJ45-FH-BK (budgetary DATO components)",components:[
    {functionId:"DATO_RJ45_PANEL_INTERFACE",vendor:"Sonic Automation / Phoenix Contact",sku:"FL-PP-RJ45-SC",qty:q,currency:"THB",unitPrice:rate,extended:money(q,rate),priceBasis:"CCY24-PXC-633 historical quotation"},
    weidmuellerPlug
   ],
   currency:Number.isFinite(budgetaryDATO)?"THB":null,
   // This MTO unit is one complete DATO Set; component unit rates remain in components[].
   unitCost:Number.isFinite(budgetaryDATO)&&q>0?Math.round(budgetaryDATO/q*100)/100:null,
   extended:budgetaryDATO,
   source:"SONIC CCY24-PXC-633 (panel) + "+(plugQuotedRate===null?"RS Thailand 741-7317 (plug retail budget reference)":"INNOVA QA24-0604 (plug quote)"),
   priceRevision:"2026-10-12_RS_RETAIL_BUDGET_RATE_SUPERSEDES_TEMP_ZERO",
   quantityBasis:"MTO Rev04 DATO-507-001 1 Set; assumed one RJ45 patch panel as provisional budgetary interface equivalent; actual Ex-rated disconnect composition must be checked",
   status:"MANAGEMENT_APPROVED_BUDGETARY_SELECTION_AND_RATE__EX_REVIEW",
   selectedComponentBudgetApproval:weidmuellerPlug.budgetApproval,
   managementBudgetApprovalRecorded:weidmuellerPlug.budgetApproval==="MANAGEMENT_APPROVED_INTERNAL_BUDGETARY_PRODUCT_AND_RATE",
   decision:"Selected ZWP20 DATO budget components are Phoenix Contact FL-PP-RJ45-SC (Sonic source THB 1,900) and Weidmüller IE-PS-RJ45-FH-BK (RS Thailand retail reference THB 1,176.68). The 2026-10-11 temporary THB 0 plug allowance was superseded by the 2026-10-12 working budget update. The project manager has approved the selected Weidmüller product and THB 1,176.68 rate for internal budget use (approval reconfirmed 2026-10-15); DO NOT re-open product/price selection without source revision or an explicit change request. INNOVA QA24-0604 Item 2 remains N/A; RS rate is NOT an INNOVA/OEM firm quote, and technical Ex compliance is independently gated. DATO Row 8 alone owns these costs; SCADA bulk mirrors but never adds the plug.",
   assumptions:["Historical Sonic CCY24-PXC-633 11-Jul-2024 THB 1,900 / EA ex VAT; quotation validity expired",
    "Weidmüller IE-PS-RJ45-FH-BK (Order No. 1963600000), 1 provisional plug × RS Thailand THB 1,176.68 retail ex VAT working reference; INNOVA QA24-0604 item 2 stays N/A. The prior THB 0 temporary allowance is historical only, not the active cost. IP20 datasheet is NOT Ex certification",
    "Phoenix FL-PP-RJ45-SC has quoted price but is NOT established as full DATO Ex-rated socket and plug. Keep technical gap, hazardous-area certification and accessory assembly as separate unresolved scope",
    "Estimate quantity 1 Set is provisional; do not use vendor quoted quantity"]};
 }
 if(item.sourceRow===9){
  const bartecQuote=SUPPLIER_QUOTE_LINES_0553.find(v=>v.id==="PROSPER-24051");
  const panelRefs=(bartecQuote?.lines||[]).filter(v=>["1","2"].includes(v[0])).map(v=>({
    quoteLine:v[0],sku:v[1],sourceUnitTHB:v[4],description:v[2],historicalProject:"Zawtika 1E",budgetarySelected:false
  }));
  const choice=panelRefs.find(v=>v.quoteLine==="1");
  const unitPrice=Number.isFinite(choice?.sourceUnitTHB)?choice.sourceUnitTHB:null;
  return {...base,bartecMapping:ZWP20_BARTEC_NEXTG_REFERENCE_MAP.entries.filter(e=>e.allocation.includes("TCAB-500-001 row9")),
   currency:"THB",unitCost:unitPrice,extended:money(q,unitPrice),budgetarySelectedQuoteLine:choice?.quoteLine||null,
   sku:choice?.sku||null,
   vendor:"BARTEC / Prosper E&T (2024 historical comparable for working budget)",
   quotedRateCandidates:panelRefs,
   quantityBasis:"MTO Rev04 ZWP20 TCAB-500-001 1 Set; BLD AFC sheet 3 Note 8 NEW Ex e enclosure; physical assembly qty from selected configuration",
   status:"BUDGETARY_HISTORICAL_COMPARABLE_SELECTED",
   assumptions:["Prosper Q-PROSRY-24051 item 1 is a 2024 Zawtika 1E SCADA Ex e control panel THB 39,200/set; item 2 THB 38,800 is an alternative; conservative item 1 adopted as internal 0553 budgetary comparable, not a current quotation",
    "Historical BARTEC GA-1001/1002 is a mechanical/termination reference; do not assume its included components or quantity from 2022 is transferable",
    "Original quote identifies PoE injector, Cisco switch, surge and Phoenix patch panel as customer free-issued: row 5, 7, 10 and 8 own those costs; enclosure quote only covers BARTEC panel assembly and its supplied internal fittings",
    "Ex e certification, SS316L size, thermal/heat load, terminal count, gland entries, internal wiring and assembly labour must be checked"]};
 }
 if(item.sourceRow===10){
  const vendor=lineByCode.get("B-8");
  return {...base,vendor:"Next G / Aviat",sku:vendor.partNumber,currency:"USD",unitCost:vendor.unitPrice,
   extended:money(q,vendor.unitPrice),status:"BUDGETARY_CALCULATED",
   quantityBasis:"MTO SA-502-001 1 Set, allocated exclusively to this row, not Radio ODU",
   assumptions:["Check industrial PoE surge technology and earthing/Ex scope with selected system"]};
 }
 if(item.sourceRow===11){
  const q0604=INNOVA_0553_PROVISIONAL_PRICES.quotations.find(v=>v.number==="QA24-0604");
  const q0606=INNOVA_0553_PROVISIONAL_PRICES.quotations.find(v=>v.number==="QA24-0606");
  // BID-FPR TPP-EQ-003 forbids fabricated route lengths / wastage factors.
  // LAY-0001 Rev C1 positions ODU/antenna and points to separate E&I layout;
  // no dimensioned cable-route measurement was established in available evidence.
  const cable=q0604?.lines.find(v=>v.description?.includes("TECKNIKABEL"));
  const gland=q0604?.lines.find(v=>v.partNumber==="501/453/UNIV/A/M20");
  const layoutTakeoff={
   drawing:"MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1 AFC",sheet:4,
   scale:"1:100 at A1",gridSpanM:9.144,
   radioAntennaPlanSeparationM:{min:0.5,max:1.0,method:"Scale-based visual approximation, not as-built cable route"},
   mezzanineLevelM:[21.1,21.3],lowerDeckLevelM:18.3,
   levelDifferenceM:[2.8,3.0],
   endPoints:["MR-502-001 outdoor radio on E&I room rooftop","ANT-502-001 rooftop antenna","Indoor PoE / SCADA Ex e panel position not drawn here"],
   relevantNotes:["Sheet 4 equipment tags MR-502-001 and ANT-502-001","Sheet 5 says detailed telecom equipment inside E&I room belongs to MM-ZTK-1F-ZWPX-ELE-LAY-0002"],
   actualRoutedCableLengthM:null,
   dimensionedPathAvailable:false,
   classification:"DRAWING_GEOMETRY_PRELIMINARY__NOT_CABLE_MTO"
  };
  const historicalWiring={
   source:"Z1D Wiring Brownfield_ - 2021-12-22.pdf",project:"Zawtika Phase 1D",
   sourcePages:[3,4,5],status:"HISTORICAL_TOPOLOGY_REFERENCE_ONLY",
   functionTrace:[
    {id:"ODU_ANT_RF",from:"Outdoor radio RF ports",to:"RF antenna",medium:"Coax jumper / feeder",quantityDriver:"RF port count + actual routing",costOwner:"ODU kit / conditional bulk",sourcePage:3},
    {id:"ODU_INDOOR_DATA",from:"Outdoor radio Ethernet",to:"Indoor PoE / surge interface",medium:"Outdoor-rated CAT6A",quantityDriver:"one verified run per physical Ethernet path × route length",costOwner:"Bulk row 11",sourcePage:3},
    {id:"INDOOR_NETWORK",from:"PoE / surge interface",to:"Cisco switch / data termination",medium:"RJ45 patch cable",quantityDriver:"port and termination mapping",costOwner:"IDU/DATO/Bulk by nonduplicate interface",sourcePage:4},
    {id:"INDOOR_POWER",from:"DC supply / terminals",to:"PoE injector",medium:"DC wiring",quantityDriver:"terminal count and power interface",costOwner:"BARTEC assembly vs bulk interface check",sourcePage:5},
    {id:"EARTHING",from:"Outdoor radio / surge / panel",to:"Earthing termination",medium:"Earth conductor",quantityDriver:"bonding points and measured length",costOwner:"mounting kit / BARTEC / bulk (single owner)",sourcePage:5}
   ],
   routeLengthM:null,interfaceCountsApproved:false,
   caveat:"Historical Z1D schematic has connectivity, not dimensioned Z1F cable routes or approved Z1F quantities"
  };
  // Internal budgetary quantity allowance derived from LAY geometry and Z1D comparable,
  // never presented as a dimensioned or approved cable takeoff.
  const cableRoutes=[
   {routeId:"ZWP20-ODU-TO-TC-ROOM-01",from:"MR-502-001 outdoor installation",to:"TC Room indoor PoE panel",
    orientation:"ZWP20 source direction",quantityBasis:"MANAGEMENT_BASELINE",baseAllowanceM:APPROVED_0553_BUDGET_BASIS.greenfield.baseRouteM,
    additionalMeasuredRouteM:0,sharedInfrastructureM:0}
   // A distinct direction requires a new route record with evidence-based length,
   // not an automatic multiplication of the 60m allowance.
  ];
  const effectiveLength=route=>route.baseAllowanceM+Math.max(0,route.additionalMeasuredRouteM);
  const budgetRoute={routes:cableRoutes,minimumBudgetaryLengthM:60,
    totalM:cableRoutes.reduce((n,route)=>n+approvedCablePurchaseM(effectiveLength(route)),0),
    routeBaseM:cableRoutes.reduce((n,route)=>n+effectiveLength(route),0),procurementAllowancePct:15,
    runCount:cableRoutes.length,additionalDirectionsPending:true,
    formula:"Sum CEIL((60m per confirmed physical run + verified extra route) * 1.15); shared pathways are not extra purchased conductors",
    classification:"MANAGEMENT_APPROVED_MINIMUM_BUDGETARY_ALLOWANCE",
    source:"Management-approved 2026-10-11: 60m per greenfield field-to-TC-room run plus 15% purchasing allowance",
    caveat:"60m plus 15% is a commercial purchasing assumption, not drawing-measured. Check actual routing, cable specification and 80m Ethernet constraint before design release"};
  const options=[
   {sku:"TECKNIKABEL CAT6A S/FTP",unit:"m",rateTHB:cable?.unitPriceExVat??null,quantity:budgetRoute.totalM,
    source:"QA24-0604 / line1",driver:"ZWP20 1 physical ODU-to-TC-room run: 60m budget base × 1.15 = 69m purchase. Additional distinct routes require separate endpoint evidence.",selection:"BUDGETARY_ENGINEERING_ALLOWANCE"},
   {sku:"501/453/UNIV/A/M20",unit:"set",rateTHB:gland?.unitPriceExVat??null,quantity:1,
    source:"QA24-0604 / line4",driver:"One M20 indoor Ex e panel-entry allowance only; verify cable diameter and vendor-fitted gland. NOT 3/4in NPT outdoor radio entry shown by SAMART 1E GA",selection:"BUDGETARY_ENGINEERING_ALLOWANCE"},
   ...[...(q0604?.lines||[]).filter(v=>v.partNumber==="AFU113030"),...(q0606?.lines||[])].map(v=>({
    sku:v.partNumber,unit:v.unit,rateTHB:v.unitPriceExVat,quantity:null,source:v.partNumber==="AFU113030"?"QA24-0604 / line3":"QA24-0606",
    driver:"Unselected alternatives: confirm RF/Ex interfaces before adding",selection:"UNSELECTED_ALTERNATIVE"}))
  ];
  const components=options.map(v=>({...v,extended:Number.isFinite(v.quantity)&&Number.isFinite(v.rateTHB)?money(v.quantity,v.rateTHB):null}));
  const budgetaryTotal=components.filter(v=>Number.isFinite(v.extended)).reduce((n,v)=>n+v.extended,0);
  return {...base,vendor:"INNOVA (historical rate evidence)",sku:"CAT6A + certified entry fittings (engineering takeoff)",
   quotedRateCandidates:components,components,layoutTakeoff,historicalWiring,gaReconciliation:ZWP20_GA_BULK_RECONCILIATION,scopeAudit:ZWP20_BULK_SCOPE_AUDIT_0553,budgetRoute,currency:"THB",unitCost:budgetaryTotal,extended:budgetaryTotal,
   quantityBasis:"AFC LAY-0001 C1 sheet4 scale 1:100: ODU/antenna plan proximity ~0.5-1.0m; mezzanine +21.100/+21.300m vs lower +18.300m = 2.8-3.0m deck elevation difference (NOT cable length). BID-FPR TPP-EQ-003 still requires measured indoor endpoint and routed cable segments.",
   status:"PARTIAL_BULK_2_OF_16_FUNCTIONS_PRICED_60M_PLUS_15PCT",
   assumptions:["Approved management baseline 60m and 15% procurement allowance (69m per evidenced run); previous 50m superseded. Equipment in other directions needs an additional individually measured route/quantity, not covered by the first 50m; no separate direction has been entered into this estimate yet","Avoid duplicating cost of common pathways or counting link count as cable run count without distinct physical wiring", "One M20 indoor-panel gland budgetary allowance only; BARTEC includes 16 blanking plugs but not necessarily commissioned glands. 1E GA outdoor radio 3/4in NPT union/gland may need a different selected item; not proven included or priced, so document conditional additional exposure",
    "SPE §6.6 ethernet run <80m is a design constraint; it cannot be converted to an assumed purchase quantity",
    "Cable entry quantities require confirmed Ex cable/entry/interface schedule, accounting for BARTEC included components and B-5 two short RF jumpers",
    "QA24-0604 THB 524/m, THB 1,020/gland; QA24-0606 alternatives remain unit-rate evidence, not selected quantities"]};
 }
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
