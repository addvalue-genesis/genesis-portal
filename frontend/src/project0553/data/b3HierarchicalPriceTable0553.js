// 10.2 / B3: ONE source-backed, read-only normalized table schema for every Module.
// Future B3 entries must declare ONE classification: INCLUDED_WORKING_SELL,
// SUPPLIER_QUOTE_REFERENCE, HISTORICAL_REFERENCE, or NON_POSTING_AUDIT.
// Purchased MGW iFAT/Facility supplier price is NOW selected at 20+5+5 in WS-B3 once.
// Never add the original quote AGAIN; historical or audit references do not post.
import {MGW_R2_COVER_20261020_0553 as cover} from "./mgwP26058R2Cover20261020";
import {selectB3WorkingSellBreakdown0553} from "./b3WorkingSellBreakdown0553";
import {selectB3SiteMrSatCoverage0553} from "./b3SiteMrSatCoverage0553";
import {selectB3RequirementWbsTrace0553} from "./b3RequirementWbsTrace0553";
import {WORKING_PRICE_ROW_CLASSES_0553 as C,validateWorkingHierarchyPriceTable0553} from "./workingModulePriceTableContract0553";

const ROOT="bid.budget.working.bc.b3";
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
export const B3_PRICE_ROW_CLASSES_0553=C;
const sourcePrice=(x)=>Number.isFinite(x)?round(x):null;
const item=(number,suffix,title,driver,priceClass,{workingSellTHB=null,vendorQuoteUSD=null,historicalTHB=null,
 referenceTHB=null,qty=null,unit=null,unitRateTHB=null,owner="B3",status="PENDING_VERIFICATION",supplierRows=[]}={})=>
 Object.freeze({number,moduleId:ROOT+"."+suffix,title,driver,priceClass,
  workingSellTHB:sourcePrice(workingSellTHB),vendorQuoteUSD:sourcePrice(vendorQuoteUSD),
  historicalTHB:sourcePrice(historicalTHB),referenceTHB:sourcePrice(referenceTHB),
  qty,unit,unitRateTHB:sourcePrice(unitRateTHB),owner,status,supplierRows:Object.freeze(supplierRows)});
const group=(number,kind,title,driver,items)=>Object.freeze({
 number,moduleId:ROOT+"."+kind,kind,title,driver,items:Object.freeze(items),
 priceClass:kind==="audit"?C.NON_POSTING_AUDIT:C.INCLUDED_WORKING_SELL,
 workingSellTHB:round(items.filter(x=>[C.INCLUDED_WORKING_SELL,C.PURCHASED_SERVICE_WORKING_SELL].includes(x.priceClass))
  .reduce((n,x)=>n+x.workingSellTHB,0)),
 vendorQuoteUSD:round(items.filter(x=>Number.isFinite(x.vendorQuoteUSD))
  .reduce((n,x)=>n+(x.vendorQuoteUSD||0),0)),
 vendorQuoteTHB:null,
 historicalTHB:null, // FAT historical THB144000 moved to B3.4 source audit only
 referenceTHB:null, // Audit contains incompatible THB references; NEVER sum mirror, historic and scenario
 qty:kind==="fat"?1:kind==="sat"?66:kind==="tools"?30:null,
 unit:kind==="fat"?"FAT trip LS":kind==="sat"?"person-days":kind==="tools"?"rental-days":null,
 unitRateTHB:kind==="sat"?25200:kind==="tools"?1000:null,
 owner:"B3"
});

export function selectB3HierarchicalPriceTable0553(workingRow,integratedScenario=null){
 if(!workingRow||workingRow.code!=="B3")return null;
 const b=selectB3WorkingSellBreakdown0553(workingRow);
 const fat=b.fat,offshore=b.offshore,veex=workingRow.b3FortyDayBudget.veex;
 const quoted=cover.services.filter(x=>x.id==="SERV-2"||x.id==="SERV-4");
 const quotedUSD=round(quoted.reduce((n,x)=>n+x.usd,0));
 const satMatrix=selectB3SiteMrSatCoverage0553();
 const crosswalk=selectB3RequirementWbsTrace0553();
 if(quoted.length!==2||quotedUSD!==7500||offshore.laborWorkingSellTHB!==1411200||offshore.surveyLabourWorkingSellTHB!==252000||
  fat.workingSellTHB!==397400||
  fat.groupFatWorkingSellTHB!==704525||veex.workingSellTHB!==30000||
  satMatrix.rows.length!==21||crosswalk.rows.length!==19||
  workingRow.b3FatOwnerTransfer?.amountTHB!==144000||
  workingRow.directCostTHB!==null)
  throw Error("B3 normalized table source authority or cost ownership changed");
 const groups=Object.freeze([
  group("B3.1","fat","FAT — Factory Acceptance Test",
   "MGW purchased service SELL (20+5+5) plus ADDVALUE Witness; supplier cost separate from WS",[
   item("B3.1.1","mgw-r2-cover-20261020","VQ-MGW / WS-B3 — Purchased iFAT + FAT Facility (20+5+5)",
    "SERV-2 iFAT USD5,000 + SERV-4 FAT Facility USD2,500 × FX31.5 × 1.30 = THB307,125",
    C.PURCHASED_SERVICE_WORKING_SELL,{
     workingSellTHB:workingRow.b3MgwPurchasedFatWorkingSell?.selectedIncrementalWorkingSellTHB??null,
     vendorQuoteUSD:quotedUSD,qty:2,unit:"supplier service lines",
     owner:"IC-FAT-MGW-SERV-2-4 / SOW-B3 / WS-B3; CP-B3 NOT ISSUED",
     status:"SELECTED PURCHASED SERVICE WS — QUOTED COST, A-OWNER DUPLICATION REVIEW OPEN",
     supplierRows:quoted.map(x=>Object.freeze({id:x.id,usd:x.usd,description:x.description}))}),
   item("B3.1.2","revk-china-budget","WS-B3 / IC-FAT — ADDVALUE China FAT Witness / Travel / Insurance",
    "2 witnesses × 6 FAT days + 2 travel days; 8 unique B3 priced expense lines",
    C.INCLUDED_WORKING_SELL,{workingSellTHB:fat.workingSellTHB,qty:1,unit:"FAT trip LS",
     owner:"IC-FAT-001 / WS-B3 (SOW-B3); CP-B3 NOT ISSUED",status:"CURRENT INTERNAL WORKING SELL · DIRECT COST NOT VERIFIED"}),

  ]),
  group("B3.2","sat","SAT 28 Team-days + BF Survey 3 Site+2 Travel Days — Selected Working SELL",
   "Selected SAT28 (56 MD) plus BF Survey 3+2 team-days (10 MD); old 40-day history NONPOSTING",[
   item("B3.2.1","40-day-abc","Selected SAT/SIT 28 productive team-days / 56 MD (2 roles)",
    "Selected SAT labour: 2 specialists × 28 team-days × USD800/MD × FX31.50; historic 40-day audit below",
    C.INCLUDED_WORKING_SELL,{workingSellTHB:offshore.laborWorkingSellTHB,
     qty:offshore.personDays,unit:"paid person-days",unitRateTHB:25200,
     status:"SELECTED SAT 28-DAY SELL; actual GF Yard/Offshore RACI/ITP OPEN"}),
   item("B3.2.2","site-mr-sat-matrix","Seven-Site / Four-MR SAT Coverage Matrix",
    "19 Site/MR Test IDs plus SIT/Punch =21 source coverage; original 40d is price-only, not stage-assigned",
    C.NON_POSTING_AUDIT,{qty:satMatrix.rows.length,unit:"test IDs",
     status:"COVERAGE ONLY — NOT 21 separate costs"}),
   item("B3.2.3","site-survey-price","BF Survey — 3 site +2 travel two-person team-days",
    "3 Site days ZPQ/ZWP8/ZWP11 + 2 travel days × 2 specialists × THB25200/MD = THB252000",
    C.INCLUDED_WORKING_SELL,{workingSellTHB:b.survey.workingSellTHB,
     qty:b.survey.personDays,unit:"paid person-days",unitRateTHB:25200,
     status:"SELECTED BF SURVEY WORKING SELL; physical revisit conditional on written work order"})
  ]),
  group("B3.3","tools","Test Equipment — Temporary FAT / SAT Tools",
   "Temporary VeEX rental in B3; permanent O&M tooling belongs B11",[
   item("B3.3.1","veex-mx100","VeEX MX100+ Temporary SAT Rental",
    "30 rental-days × THB1,000 (ex VAT); included in B3 only once",
    C.INCLUDED_WORKING_SELL,{workingSellTHB:veex.workingSellTHB,
     qty:veex.quantity,unit:veex.unit,unitRateTHB:veex.rateTHB,
     status:"CURRENT WORKING SELL; true rental direct cost not verified"}),
   item("B3.3.2","test-tools-ownership","Other Test Tools / B11 Boundary",
    "RF/sound/radar instruments pending rate; delivered O&M tools belong B11",
    C.NON_POSTING_AUDIT,{owner:"B3 test vs B11 O&M",
     status:"PRICE NOT ESTABLISHED — do not invent a zero-priced item"})
  ]),
  group("B3.4","audit","Price Reconciliation / Requirement & Cost Audit",
   "Read-only current-price mirror, legacy FAT owner and seven-day what-if scenario; never additive",[
   item("B3.4.1","working-sell-breakdown","Canonical Working SELL Bridge",
    "FAT + Offshore + VeEX is a mirror of the B3 total, NOT a fourth priced work item",
    C.NON_POSTING_AUDIT,{referenceTHB:b.totalWorkingSellTHB,qty:3,unit:"priced B3 source buckets",
     status:"MIRROR ONLY — NOT ADDITIVE"}),
   item("B3.4.2","requirement-crosswalk","Contract Requirement / Cost Owner Crosswalk",
    "19 requirement obligations; proof and execution owner only",
    C.NON_POSTING_AUDIT,{qty:crosswalk.rows.length,unit:"requirements",
     status:"NON-POSTING CONTRACT COVERAGE"}),
   item("B3.4.3","source-cost-audit","Historical WBS / Source Cost Audit",
    "Original working evidence / missing direct cost; reference only",
    C.NON_POSTING_AUDIT,{status:"NO VERIFIED DIRECT COST — RELEASE HOLD"}),
   item("B3.4.4","fat-owner-transfer","Rev05 Bangkok FAT — Superseded Reference",
    "8 old team-days × THB18,000; replaced by China FAT; do not carry forward",
    C.HISTORICAL_REFERENCE,{historicalTHB:workingRow.b3FatOwnerTransfer.amountTHB,
     qty:8,unit:"historical team-days",unitRateTHB:18000,
     owner:"B3 historical only",status:"SUPERSEDED — NON ADDITIVE"}),
   item("B3.4.5","fat-training-7d-allocation","ADDVALUE-only 7-Day Integrated FAT + Training — INTERNAL SCENARIO",
    "ADDVALUE staff-only 7-day shared proposal; MGW purchased FAT THB307125 remains IN B3.1.1 unchanged and is not re-added",
    C.NON_POSTING_AUDIT,{referenceTHB:integratedScenario?.proposedB3FatWorkingSellTHB??null,
     qty:integratedScenario?.onSiteDays??null,unit:"shared on-site days",
     owner:"IC-FAT-001 / IC-TRN-001 · B3/B8 cross-owner",
     status:"SC-B3-FAT WHAT-IF; CP-B3/CP-B8 NOT ISSUED; no Working SELL posting"})
  ])
 ]);
 const contract=validateWorkingHierarchyPriceTable0553({
  ownerModuleId:ROOT,groups,expectedSellTHB:workingRow.workingSellTHB,
  knownSupplierReferenceUSD:7500
 });
 const totalSell=round(groups.reduce((n,g)=>n+g.workingSellTHB,0));
 const vendorUSD=round(groups.reduce((n,g)=>n+g.vendorQuoteUSD,0));
 const groupsAsExpected={fat:704525,sat:1663200,tools:30000,audit:0};
 if(totalSell!==2397725||totalSell!==b.totalWorkingSellTHB||
  vendorUSD!==7500||
  groups.some(g=>g.workingSellTHB!==groupsAsExpected[g.kind])||
  groups.flatMap(g=>g.items).filter(x=>[C.INCLUDED_WORKING_SELL,C.PURCHASED_SERVICE_WORKING_SELL].includes(x.priceClass)).length!==5||
  new Set(groups.flatMap(g=>[g.moduleId,...g.items.map(x=>x.moduleId)])).size!==
  groups.reduce((n,g)=>n+g.items.length+1,0))
  throw Error("B3 price hierarchy sum / supplier-reference non-duplication failed");
 return Object.freeze({
  moduleId:ROOT+".worktype-accordion",
  parentModuleId:ROOT,
  groups,contract,totalWorkingSellTHB:totalSell,
  supplierFatReferenceUSD:vendorUSD,
  supplierFatReferenceTHB:round(vendorUSD*31.5),
  supplierFxTHBPerUSD:31.5,
  verifiedDirectCostTHB:null,
  customerReleaseAllowed:false,
  sourceCostOwner:"B3: MGW purchased FAT, ADDVALUE FAT Witness, SAT28 labour, BF Survey5 labour, VeEX",
  policy:"Every future module must specify a unique stable ID, priceClass, source, qty, owner and single posting authority. NULL not 0 for non-priced/audit references; purchased MGW iFAT/FAT Facility charged ONCE at 20+5+5 with supplier quotation cost, no Part A or 5% B share duplication."
 });
}
