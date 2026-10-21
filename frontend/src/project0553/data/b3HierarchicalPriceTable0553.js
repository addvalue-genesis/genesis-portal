// 10.2 / B3: ONE source-backed, read-only normalized table schema for every Module.
// Future B3 entries must declare ONE classification: INCLUDED_WORKING_SELL,
// SUPPLIER_QUOTE_REFERENCE, HISTORICAL_REFERENCE, or NON_POSTING_AUDIT.
// Never sum supplier, historical or audit previews into canonical B3 Working SELL.
import {MGW_R2_COVER_20261020_0553 as cover} from "./mgwP26058R2Cover20261020";
import {selectB3WorkingSellBreakdown0553} from "./b3WorkingSellBreakdown0553";
import {selectB3SiteMrSatCoverage0553} from "./b3SiteMrSatCoverage0553";
import {selectB3RequirementWbsTrace0553} from "./b3RequirementWbsTrace0553";

const ROOT="bid.budget.working.bc.b3";
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
export const B3_PRICE_ROW_CLASSES_0553=Object.freeze({
 INCLUDED_WORKING_SELL:"INCLUDED_WORKING_SELL",
 SUPPLIER_QUOTE_REFERENCE:"SUPPLIER_QUOTE_REFERENCE",
 HISTORICAL_REFERENCE:"HISTORICAL_REFERENCE",
 NON_POSTING_AUDIT:"NON_POSTING_AUDIT"
});
const C=B3_PRICE_ROW_CLASSES_0553;
const sourcePrice=(x)=>Number.isFinite(x)?round(x):null;
const item=(number,suffix,title,driver,priceClass,{workingSellTHB=null,vendorQuoteUSD=null,historicalTHB=null,
 referenceTHB=null,qty=null,unit=null,unitRateTHB=null,owner="B3",status="PENDING_VERIFICATION",supplierRows=[]}={})=>
 Object.freeze({number,moduleId:ROOT+"."+suffix,title,driver,priceClass,
  workingSellTHB:sourcePrice(workingSellTHB),vendorQuoteUSD:sourcePrice(vendorQuoteUSD),
  historicalTHB:sourcePrice(historicalTHB),referenceTHB:sourcePrice(referenceTHB),
  qty,unit,unitRateTHB:sourcePrice(unitRateTHB),owner,status,supplierRows:Object.freeze(supplierRows)});
const group=(number,kind,title,driver,items)=>Object.freeze({
 number,moduleId:ROOT+"."+kind,kind,title,driver,items:Object.freeze(items),
 priceClass:C.INCLUDED_WORKING_SELL,
 workingSellTHB:round(items.filter(x=>x.priceClass===C.INCLUDED_WORKING_SELL)
  .reduce((n,x)=>n+x.workingSellTHB,0)),
 vendorQuoteUSD:round(items.filter(x=>x.priceClass===C.SUPPLIER_QUOTE_REFERENCE)
  .reduce((n,x)=>n+(x.vendorQuoteUSD||0),0)),
 vendorQuoteTHB:null,
 qty:null,unit:null,owner:"B3"
});

export function selectB3HierarchicalPriceTable0553(workingRow){
 if(!workingRow||workingRow.code!=="B3")return null;
 const b=selectB3WorkingSellBreakdown0553(workingRow);
 const fat=b.fat,offshore=b.offshore,veex=workingRow.b3FortyDayBudget.veex;
 const quoted=cover.services.filter(x=>x.id==="SERV-2"||x.id==="SERV-4");
 const quotedUSD=round(quoted.reduce((n,x)=>n+x.usd,0));
 const satMatrix=selectB3SiteMrSatCoverage0553();
 const crosswalk=selectB3RequirementWbsTrace0553();
 if(quoted.length!==2||quotedUSD!==7500||offshore.laborWorkingSellTHB!==2016000||
  fat.workingSellTHB!==397400||veex.workingSellTHB!==30000||
  satMatrix.rows.length!==21||crosswalk.rows.length!==19||
  workingRow.b3FatOwnerTransfer?.amountTHB!==144000||
  workingRow.directCostTHB!==null)
  throw Error("B3 normalized table source authority or cost ownership changed");
 const groups=Object.freeze([
  group("B3.1","fat","FAT — Factory Acceptance Test",
   "MGW vendor iFAT/facility reference + ADDVALUE China Witness SELL",[
   item("B3.1.1","mgw-r2-cover-20261020","MGW Rev.2 Supplier iFAT / FAT Facility",
    "SERV-2: 2-day iFAT USD5,000; SERV-4: minimum 5-day facility USD2,500",
    C.SUPPLIER_QUOTE_REFERENCE,{vendorQuoteUSD:quotedUSD,qty:2,unit:"supplier service lines",
     owner:"MGW / Part A scope check",status:"SUPPLIER QUOTE ONLY — Part A vs B3 payer pending",
     supplierRows:quoted.map(x=>Object.freeze({id:x.id,usd:x.usd,description:x.description}))}),
   item("B3.1.2","revk-china-budget","ADDVALUE China FAT Witness / Travel / Insurance",
    "2 witnesses × 6 FAT days + 2 travel days; 8 unique B3 priced expense lines",
    C.INCLUDED_WORKING_SELL,{workingSellTHB:fat.workingSellTHB,qty:1,unit:"FAT trip LS",
     owner:"B3",status:"CURRENT WORKING SELL · direct cost unknown"}),
   item("B3.1.3","fat-owner-transfer","Rev05 Bangkok FAT — Superseded Reference",
    "8 old team-days × THB18,000; replaced by China FAT; do not carry forward",
    C.HISTORICAL_REFERENCE,{historicalTHB:workingRow.b3FatOwnerTransfer.amountTHB,
     qty:8,unit:"historical team-days",unitRateTHB:18000,
     owner:"B3 historical only",status:"SUPERSEDED — NON ADDITIVE"})
  ]),
  group("B3.2","sat","SAT / SIT — Offshore Site & Integration Tests",
   "7 locations + cross-site SIT / punch, 40 team-days shared across MR",[
   item("B3.2.1","40-day-abc","Offshore SAT/SIT Team",
    "2 engineers × 40 team-days × USD800/person-day × FX31.50",
    C.INCLUDED_WORKING_SELL,{workingSellTHB:offshore.laborWorkingSellTHB,
     qty:offshore.personDays,unit:"paid person-days",unitRateTHB:25200,
     status:"CURRENT WORKING SELL; site timeboxes counted once"}),
   item("B3.2.2","site-mr-sat-matrix","Seven-Site / Four-MR SAT Coverage Matrix",
    "19 Site/MR test IDs plus SIT and Punch = 21 traceable objects; shared 40 days",
    C.NON_POSTING_AUDIT,{qty:satMatrix.rows.length,unit:"test IDs",
     status:"COVERAGE ONLY — NOT 21 separate costs"})
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
   "Read-only mirror, contract coverage, historical cost source; never additive",[
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
    C.NON_POSTING_AUDIT,{status:"NO VERIFIED DIRECT COST — RELEASE HOLD"})
  ])
 ]);
 const totalSell=round(groups.reduce((n,g)=>n+g.workingSellTHB,0));
 const vendorUSD=round(groups.reduce((n,g)=>n+g.vendorQuoteUSD,0));
 const groupsAsExpected={fat:397400,sat:2016000,tools:30000,audit:0};
 if(totalSell!==2443400||totalSell!==b.totalWorkingSellTHB||
  vendorUSD!==7500||
  groups.some(g=>g.workingSellTHB!==groupsAsExpected[g.kind])||
  groups.flatMap(g=>g.items).filter(x=>x.priceClass===C.INCLUDED_WORKING_SELL).length!==3||
  new Set(groups.flatMap(g=>[g.moduleId,...g.items.map(x=>x.moduleId)])).size!==
  groups.reduce((n,g)=>n+g.items.length+1,0))
  throw Error("B3 price hierarchy sum / supplier-reference non-duplication failed");
 return Object.freeze({
  moduleId:ROOT+".worktype-accordion",
  parentModuleId:ROOT,
  groups,totalWorkingSellTHB:totalSell,
  supplierFatReferenceUSD:vendorUSD,
  supplierFatReferenceTHB:round(vendorUSD*31.5),
  supplierFxTHBPerUSD:31.5,
  verifiedDirectCostTHB:null,
  customerReleaseAllowed:false,
  sourceCostOwner:"B3 for ADDVALUE FAT Witness, SAT Labour, VeEX rental only",
  policy:"Every future module must specify a unique stable ID, priceClass, source, qty, owner and single posting authority. NULL not 0 for non-priced/audit references; never sum SOURCE, HISTORICAL or AUDIT into Working SELL."
 });
}
