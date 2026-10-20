// PJ2608-0553 — read-only supplier clarification provided as Outlook screenshot.
// MGW Paul Lee email dated Tuesday 2026-10-20 17:49 (as displayed).
// Separate from P26-058_R2 PDF: seller statements are evidence, NOT revised
// quote line prices, verified customs relief, OEM certification or B/C posting.
import {MGW_P26_058_R2_SELECTED_0553 as quoted} from "./mgwP26058R2Selected0553";
const email="MGW_Paul_Lee_2026-10-20_1749_user_supplied_Outlook_screenshot";
const contract=[
 ["RACON-KIT","bid.budget.bom.mr0004.mgw-paul-clarification","MR-0004",1,
  "MGW confirms RACON comes with programming kit",
  "CONFIRMED_IN_EMAIL__VENDOR_INCLUDED_NOT_SEPARATELY_PRICED",
  "Confirm exact kit SKU, quantity per RACON, delivery packing list, functions and OEM procedure; do not add price"],
 ["RACON-BD","bid.budget.bom.mr0004.mgw-paul-clarification","MR-0004",2,
  'MGW says "The BD is comply for Racon"',
  "VENDOR_COMPLIANCE_CLAIM__BD_DOCUMENT_NOT_IDENTIFIED",
  "Request explanation of BD, clause-level compliance matrix, IECEx/ATEX certificate and approved technical response"],
 ["ROAD-FREIGHT","bid.budget.working.bc.b6.mgw-road-freight","B6",3,
  "MGW indicates USD 2,500 road freight Nantong to JUTAL site",
  "VENDOR_EMAIL_RATE__ROUTE_INCOTERM_TAX_AND_LOADING_UNCONFIRMED",
  "Confirm which JUTAL site and precise delivery address, trucks/loads, packing, taxes, insurance, export documentation, Zhuhai/Myanmar onward transportation and DDP responsibility"],
 ["SPARES-TOOLS","bid.budget.working.bc.b10.mgw-commissioning-spares","B10",4,
  "MGW says 2-year operational spares, special tools and commissioning spares will be included; John asked to share details",
  "PROMISED_TO_INCLUDE__ITEMIZED_OEM_SPIR_NOT_RECEIVED",
  "Obtain itemized commissioning spare list with TAG/SKU/quantity/price owner before comparing B10, B11, C2; no duplicate Working SELL"],
 ["RADWIN-FREE-ISSUE","bid.budget.working.bc.b6.mgw-radwin-free-issue","B6",5,
  "ADDVALUE free-issues RADWIN microwave equipment from Thailand to MGW Nantong for staging",
  "FREE_ISSUE_STAGING_PLAN__IMPORT_EXPORT_PERMIT_COST_OWNER_OPEN",
  "Confirm China temporary import status, customs importer, permits, packing/serial log, return/export to Myanmar, schedule and buyer risk"],
 ["FAT-REFERENCE","bid.budget.working.bc.b3.mgw-racon-fat-evidence","B3",6,
  "Paul requests Yvan/John to provide a previous Tideland or Pharos RACON FAT report",
  "FAT_SAMPLE_REQUESTED__NOT_RECEIVED",
  "Obtain past FAT report for planning only; approved project-specific FAT/ITP and witness criteria remain separate"]
];
const rows=contract.map(([id,moduleId,owner,item,statement,status,gate])=>Object.freeze({
 id,moduleId,owner,emailItem:item,statement,status,verificationGate:gate,
 sourceId:email,documentClass:"VENDOR_EMAIL_CLARIFICATION_ONLY",
 sourceAvailable:"USER_PROVIDED_SCREENSHOT",postingAllowed:false,
 directCostTHB:null,workingSellTHB:null,customerReleaseAllowed:false
}));
const optional=[
 {id:"B11-SPECIAL-TOOLS",moduleId:"bid.budget.working.bc.b11.mgw-special-tools",
  owner:"B11",sourceItem:4,expected:"OEM itemized special tool list",status:"PROMISED_NOT_ITEMIZED"},
 {id:"C2-2YEAR-SPARES",moduleId:"bid.budget.working.bc.c2.mgw-two-year-operation-spares",
  owner:"C2",sourceItem:4,expected:"Two-year operations OEM spare list/SPIR",status:"PROMISED_NOT_ITEMIZED"}
].map(x=>Object.freeze({...x,sourceId:email,postingAllowed:false,directCostTHB:null,
 workingSellTHB:null,customerReleaseAllowed:false}));
export const MGW_PAUL_EMAIL_CLARIFICATIONS_0553=Object.freeze({
 id:"MGW-PAUL-20261020-CLARIFICATION",
 sourceId:email,source:"User-provided Outlook screenshot, 20-Oct-2026, Paul Lee, 5:49 PM",
 receivedDate:"2026-10-20",supplier:quoted.supplier,
 quoteRef:quoted.id,quoteSource:quoted.source,
 priceIsNewQuoteRevision:false,revisionOverrideAllowed:false,
 pricedVendorFreight:Object.freeze({
  sourceId:email,usd:2500,currency:"USD",qty:null,unit:"road freight indication",
  origin:"MGW Nantong",destination:"JUTAL site — exact address unspecified",
  sourceCostOwner:"B6",moduleId:"bid.budget.working.bc.b6.mgw-road-freight",
  freightScopeVerified:false,incotermVerified:false,exwQuoteUSD:quoted.overallTotalUSD,
  onwardTransportToMyanmarIncluded:null,customsDutyUSD:null,
  currentWorkingSellOverrideAllowed:false,
  directCostPostingAllowed:false,
  status:"SOURCE_RATE_AVAILABLE__LOGISTICS_SCOPE_AWAITING_CONFIRMATION"
 }),
 customsDuty:Object.freeze({
  sellerClaim:"Myanmar offshore final destination expected zero-rated duty",
  supportedByOfficialCustomsRuling:false,rateAcceptedForPricing:null,
  documentation:"JUTAL DO stamp on receipt stated; import/customs obligation not evidenced",
  status:"VENDOR_ASSERTION_ONLY__MYANMAR_AUTHORITY_CONFIRM_REQUIRED"
 }),
 raconProgrammingKit:Object.freeze({
  included:true,quotedAsSeparateLine:false,priceIncrementUSD:null,
  sourceId:email,status:"SELLER_CONFIRMED_INCLUDED__PACKING_LIST_SKU_QTY_PENDING",
  postingAllowed:false
 }),
 rows:Object.freeze(rows),additionalSpareOwners:Object.freeze(optional),
 technicalCompliant:false,approvedVendorSpareListReceived:false,
 fullShippingScopeEstablished:false,customerReleaseAllowed:false
});
if(quoted.quoteNumber!=="P26-058_R2"||quoted.overallTotalUSD!==364841)
 throw Error("Vendor email follow-up must attach only to selected P26-058_R2 unchanged quote");
if(rows.length!==6||optional.length!==2||rows.some(x=>x.postingAllowed)||
 MGW_PAUL_EMAIL_CLARIFICATIONS_0553.pricedVendorFreight.currentWorkingSellOverrideAllowed)
 throw Error("Supplier email cannot silently post B6/spares/customer Sell");
