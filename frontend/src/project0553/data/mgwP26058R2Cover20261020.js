// PJ2608-0553 / MGW P26-058_R2 Commercial COVER dated 20-Oct-2026.
// Source: cover PDF uploaded to MGW folder after 21-Sep detailed offer.
// Separate evidence revision on same quote number; equipment detail PDF unchanged.
// Never overwrite frozen working cost, issue customer release, or post B3/B6.
import {MGW_P26_058_R2_SELECTED_0553 as detail} from "./mgwP26058R2Selected0553";
import {MGW_PAUL_EMAIL_CLARIFICATIONS_0553 as email} from "./mgwPaulEmailClarifications0553";
const coverUrl="https://drive.google.com/file/d/1qOswXUq_gogU272zWDaLilRGdjhtLK7n/view";
const cost=(id,description,usd,owner,scopeState)=>Object.freeze({
 id,description,usd,currency:"USD",ownerCandidate:owner,scopeState,
 sourceId:"MGW-P26-058-R2-COVER-20261020",sourceUrl:coverUrl,
 workingCostPostingAllowed:false,workingSellPostingAllowed:false,
 directCostTHB:null,customerReleaseAllowed:false
});
const current=Object.freeze([
 cost("SERV-1","MGW design engineering, drawing, documentation and project management",8000,
  "A_VENDOR_INCLUDED_DESIGN__B1_B2_OVERLAP_CHECK","SCOPE_ITEMIZATION_REQUIRED"),
 cost("SERV-2","MGW integration, assembly, inspection and INTERNAL FAT (iFAT) with ADDVALUE — 2 days, client witness Nantong",5000,
  "A_VENDOR_OEM_IFAT__B3_WITNESS_SEPARATE","EXACT_VENUE_WITNESS_ITP_GATE"),
 cost("SERV-4","MGW premises/facility for END USER and ADDVALUE witnessed FAT with minimal MGW involvement — minimum 5 days",2500,
  "A_VENDOR_FAT_PREMISES__B3_WITNESS_WBS_RECONCILE","MINIMUM_FIVE_DAYS__VENUE_SCOPE_EXTRA_DAYS_OPEN"),
 cost("SERV-3","MGW packing, marking and preparation for delivery",500,
  "B5_VENDOR_PACKING_INCLUDED_CREDIT_CHECK","PACKING_SCOPE_AND_B5_DEDUCTION_OPEN"),
 cost("SERV-5","Road freight from Nantong to JUTAL site",2500,
  "B6_VENDOR_FREIGHT__DELIVERY_SCOPE_AND_INCOTERM_OPEN","FREIGHT_TO_JUTAL__DAP_NANTONG_CONFLICT_OPEN")
]);
const old=detail.services.map(row=>Object.freeze({
 id:row.id,usd:row.amountUSD,description:row.description
}));
const totals={
 equipmentUSD:detail.equipmentTotalUSD,
 oldVendorServicesUSD:detail.serviceTotalUSD,
 newVendorServicesUSD:current.reduce((n,x)=>n+x.usd,0),
 oldOverallUSD:detail.overallTotalUSD
};
totals.newOverallUSD=totals.equipmentUSD+totals.newVendorServicesUSD;
totals.vendorServiceDeltaUSD=totals.newVendorServicesUSD-totals.oldVendorServicesUSD;
totals.overallDeltaUSD=totals.newOverallUSD-totals.oldOverallUSD;
const activities=current.map(x=>{
 const prev=old.find(v=>v.id===x.id);
 return Object.freeze({...x,priorUSD:prev?.usd??null,
  deltaUSD:x.usd-(prev?.usd??0),
  priorSource:detail.source});
});
export const MGW_R2_COVER_20261020_0553=Object.freeze({
 id:"MGW-P26-058-R2-COVER-20261020",quoteNumber:detail.quoteNumber,
 quoteDate:"2026-10-20",
 document:"Q26-058 PTTEPI MM-ZTK Phase 1F_Rev2 Cover sheet.pdf",
 sourceUrl:coverUrl,baseDetailSourceUrl:detail.source,
 equipmentDetailsAuthority:"P26-058_R2 detailed quotation dated 21-Sep-2026; unchanged six priced packages",
 currentCommercialCoverAuthority:"P26-058_R2 cover sheet dated 20-Oct-2026",
 equipmentTotalUSD:totals.equipmentUSD,
 priorCommercialServiceTotalUSD:totals.oldVendorServicesUSD,
 serviceTotalUSD:totals.newVendorServicesUSD,
 priorOverallTotalUSD:totals.oldOverallUSD,
 overallTotalUSD:totals.newOverallUSD,
 services: Object.freeze(activities),
 changes:Object.freeze({
 vendorServiceDeltaUSD:totals.vendorServiceDeltaUSD,
 overallDeltaUSD:totals.overallDeltaUSD,
 oldIFATUSD:6000,newIFATUSD:5000,iFatDeltaUSD:-1000,
 newFATFacilityUSD:2500,newRoadFreightUSD:2500,
 equipmentDeltaUSD:0
 }),
 freight:Object.freeze({
 quotedUSD:2500,sourceUrl:coverUrl,emailEvidenceId:email.sourceId,
 emailUSD:email.pricedVendorFreight.usd,
 additiveToEmail:false,
 quotedServiceId:"SERV-5",
 sourceCostOwner:"B6",
 includedInOverallTotal:true,extraOnTopOfCoverUSD:null,
 destinationText:"JUTAL site (unspecified)",
 deliveryTermText:"DAP Nantong China",
 deliveryScopeReconciled:false,
 directCostPosted:false,
 workingSellAdjusted:false,
 ambiguity:"Road freight to JUTAL site is priced, but Cover Delivery Destination says DAP Nantong China; exact transfer-of-risk, consignee, road legs and duties unverified"
 }),
 deliveryTerms:Object.freeze({
 cover:"DAP Nantong China",
 previousDetail:"EX WORKS Nantong China",
 statedRoadFreightTo:"JUTAL site",
 termsReconciled:false,
 ddpJutalZhuhaiConfirmed:false,
 onwardToMyanmarIncluded:null,
 incotermAuthorityPending:true
 }),
 FAT:Object.freeze({
 internalFatDays:2,
 internalFatUSD:5000,
 facilityEndUserDaysMinimum:5,
 facilityEndUserUSD:2500,
 addvalueExistingWitnessDaysBudgeted:6,
 // Management instruction: distinct sequential FAT stages, then JUTAL road delivery.
 managementDistinctFATStagesConfirmed:true,
 executionOrder:Object.freeze(["SERV-2_INTERNAL_IFAT","SERV-4_CUSTOMER_FAT_RESERVE","SERV-5_JUTAL_YARD_DELIVERY"]),
 internalIFATPurpose:"MGW+ADDVALUE integration and readiness before Customer FAT",
 customerFATPurpose:"Separate end-user/customer FAT premises reserved for at least five days",
 customerFATIsSeparateFromInternalIFAT:true,
 quotedServiceOverlap:false,
 supplierFATPriceCreditUSD:null,
 supplierServicesIncludedOnceInCoverUSD:7500,
 freightAfterCustomerFATPlanned:true,
 signedFATAgendaAndDatesConfirmed:false,
 actualAddvalueAttendanceDaysConfirmed:false,
 attendanceVsVenueReconciled:false,
 sourceOwnerDifference:"MGW iFAT and facility are vendor service prices; ADDVALUE FAT witness personnel/travel are separately budgeted in B3; no automatic duplicate labour or facility posting"
 }),
 taxDuty:Object.freeze({
 emailMyanmarZeroDutyClaim:email.customsDuty.sellerClaim,
 officialRulingReceived:false,
 approvedDutyRate:null
 }),
 costGovernance:Object.freeze({
 newVendorQuoteCommercialEvidence:true,
 autoPostB3:false,autoPostB6:false,autoPostB5:false,
 updateRev02Rev03CostBaseline:false,
 updateCfoRelease:false,approvedDirectCost:false,
 fixedWorkingSellAmountsUnchanged:true,
 notes:"Current MGW vendor service quote increased USD 4,000 versus older cover, but ADDVALUE Working SELL and signed Cost Baseline require separate approval"
 })
});
const v=MGW_R2_COVER_20261020_0553;
if(v.equipmentTotalUSD!==350341||v.serviceTotalUSD!==18500||
 v.overallTotalUSD!==368841||v.changes.overallDeltaUSD!==4000||
 v.changes.newRoadFreightUSD!==email.pricedVendorFreight.usd||
 v.services.reduce((n,s)=>n+s.usd,0)!==v.serviceTotalUSD)
 throw Error("MGW P26-058_R2 20-Oct commercial cover arithmetic/duplicate freight divergence");
