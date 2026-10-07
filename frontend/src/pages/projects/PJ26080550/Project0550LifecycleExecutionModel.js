/*
PJ2608-0550 — LIFECYCLE EXECUTION / RESPONSIBILITY ENGINE

Purpose:
Resolve each required lifecycle event into complementary work roles without double counting:
- what the project requires;
- what the vendor/OEM quoted and will execute;
- what ADDVALUE retains / leads / witnesses / performs;
- what still requires a vendor quote / clarification;
- where each cost is commercially mapped.

This is a METHOD / PROJECTION layer over existing controlled source data.
It does not create a second vendor quote, MH model, or price model.
*/

import { vendorOfferForPriceLine } from "./Project0550VendorOfferRegister";
import { PROJECT0550_PAGA_DIRECT_SERVICE_MODEL } from "./Project0550PagaDigitalThread";

export const PROJECT0550_EXECUTION_ROLE_TYPES = [
  "CONTRACT_LEAD",
  "TECHNICAL_EXECUTE",
  "OEM_SUPERVISE",
  "PREPARE_PROCEDURE",
  "WITNESS",
  "PUNCH_CLOSEOUT",
  "SITE_PRECOM",
  "SITE_SAT",
  "COMMISSION_STARTUP",
  "APPROVE_ACCEPT"
];

function retainedRowsByCodes(codes=[]){
  const wanted=new Set(codes);
  return PROJECT0550_PAGA_DIRECT_SERVICE_MODEL.rows.filter(x=>wanted.has(x.code));
}

function vendorServiceByType(offer,eventType){
  return (offer?.serviceScope||[]).find(x=>x.eventType===eventType) || null;
}

export const PROJECT0550_PAGA_REQUIRED_LIFECYCLE_EVENTS = [
  {
    eventCode:"PAGA-FAT-001",
    eventType:"FAT",
    eventName:"Factory Acceptance Test",
    sourceRefs:["MR-0001 App.1.4","SPE-0004 FAT requirement","A20261632 item 23010"],
    commercialLineVendor:"A1-05",
    commercialLineAddvalue:"B4",
    retainedActivityCodes:["SVC-028"]
  },
  {
    eventCode:"PAGA-IFAT-001",
    eventType:"IFAT",
    eventName:"Integrated Factory Acceptance Test / interface verification",
    sourceRefs:["MR-0001 App.1.4","SPE-0004 IFAT requirement"],
    commercialLineVendor:"TBC",
    commercialLineAddvalue:"B4",
    retainedActivityCodes:["SVC-028"]
  },
  {
    eventCode:"PAGA-PRECOM-001",
    eventType:"PRE_COMMISSIONING",
    eventName:"Site pre-commissioning",
    sourceRefs:["MR / Exhibit lifecycle obligation","PAGA retained service model"],
    commercialLineVendor:"TBC",
    commercialLineAddvalue:"B4",
    retainedActivityCodes:["SVC-029"]
  },
  {
    eventCode:"PAGA-SAT-001",
    eventType:"SAT",
    eventName:"Site Acceptance Test",
    sourceRefs:["MR-0001 App.1.4","SPE-0004 SAT requirement"],
    commercialLineVendor:"TBC",
    commercialLineAddvalue:"B4",
    retainedActivityCodes:["SVC-029"]
  },
  {
    eventCode:"PAGA-COMM-001",
    eventType:"SITE_COMMISSIONING",
    eventName:"Commissioning / start-up",
    sourceRefs:["A20261632 service note","PAGA retained service model"],
    commercialLineVendor:"B4 candidate",
    commercialLineAddvalue:"B4",
    retainedActivityCodes:["SVC-029"]
  }
];

export function buildPagaLifecycleExecutionPlan({
  fatVendorSelection="SELECT_VENDOR_IN_PART_A",
  siteOemSelection="TBC"
}={}){
  const offer=vendorOfferForPriceLine("A1-05");
  const fat=vendorServiceByType(offer,"FAT");
  const siteCommissioning=vendorServiceByType(offer,"SITE_COMMISSIONING");

  return PROJECT0550_PAGA_REQUIRED_LIFECYCLE_EVENTS.map(event=>{
    const retained=retainedRowsByCodes(event.retainedActivityCodes);
    const retainedMh=retained.reduce((sum,x)=>sum+(Number(x.mh)||0),0);
    const retainedInternalCostThb=retained.reduce((sum,x)=>sum+(Number(x.internalCostThb)||0),0);
    const retainedBaseSellThb=retained.reduce((sum,x)=>sum+(Number(x.baseSellThb)||0),0);

    if(event.eventType==="FAT"){
      return {
        ...event,
        location:fat?.location || "Wertheim, Germany",
        strategy:"HYBRID_VENDOR_PLUS_ADDVALUE",
        vendorSelection:fatVendorSelection,
        vendorCoverage:{
          state:fat?.quoteState || "TBC",
          sourceRef:fat?.sourceRef,
          role:fat?.vendorRole || "TECHNICAL_EXECUTE",
          qty:fat?.qty,
          unit:fat?.unit,
          unitRate:fat?.unitRate,
          total:fat?.total,
          currency:fat?.currency,
          boundary:fat?.participantBoundary,
          excludedCost:fat?.excludedCost
        },
        addvalueCoverage:{
          roles:["CONTRACT_LEAD","PREPARE_PROCEDURE","WITNESS","PUNCH_CLOSEOUT"],
          workloadSource:event.retainedActivityCodes,
          sharedWorkloadNote:"SVC-028 covers retained FAT/IFAT preparation, witness and close-out; do not split MH arbitrarily without a controlled event driver.",
          mhPool:retainedMh,
          internalCostThbPool:retainedInternalCostThb,
          baseSellThbPool:retainedBaseSellThb
        },
        travel:{
          state:"TBC",
          destination:"Wertheim, Germany",
          rule:"INDUSTRONIC quote excludes purchaser/end-user travel/accommodation; ADDVALUE attendance trip must be budgeted separately and counted once by PhysicalTripKey."
        },
        releaseNote:"OEM executes FAT; ADDVALUE leads/coordinates from TSI side and witnesses/close-outs. These are complementary roles, not duplicate labor."
      };
    }

    if(event.eventType==="IFAT"){
      return {
        ...event,
        location:"Factory / integration venue TBC",
        strategy:"ADDVALUE_RETAINED_LEAD / OEM_SUPPORT_TBC",
        vendorSelection:"TBC",
        vendorCoverage:{
          state:"NOT EXPLICITLY QUOTED",
          sourceRef:offer?.quoteRef,
          role:"OEM TECHNICAL SUPPORT TBC"
        },
        addvalueCoverage:{
          roles:["CONTRACT_LEAD","PREPARE_PROCEDURE","TECHNICAL_EXECUTE","WITNESS","PUNCH_CLOSEOUT"],
          workloadSource:event.retainedActivityCodes,
          sharedWorkloadNote:"Shares SVC-028 workload pool with FAT until event-specific MH driver is controlled.",
          mhPool:retainedMh,
          internalCostThbPool:retainedInternalCostThb,
          baseSellThbPool:retainedBaseSellThb
        },
        releaseNote:"Define interface test scope and whether INDUSTRONIC attendance is required before separating additional OEM cost."
      };
    }

    if(event.eventType==="SITE_COMMISSIONING"){
      return {
        ...event,
        location:"Project site · Myanmar",
        strategy:"ADDVALUE_LEAD + OEM_AUTHORISED_COMMISSIONING_REQUIRED_TO_CLOSE",
        vendorSelection:siteOemSelection,
        vendorCoverage:{
          state:siteCommissioning?.quoteState || "NOT QUOTED",
          sourceRef:siteCommissioning?.sourceRef,
          role:siteCommissioning?.vendorRole || "OEM_AUTHORISED_COMMISSIONING",
          total:siteCommissioning?.total ?? null,
          currency:siteCommissioning?.currency || "EUR",
          boundary:siteCommissioning?.participantBoundary,
          excludedCost:siteCommissioning?.excludedCost
        },
        addvalueCoverage:{
          roles:["CONTRACT_LEAD","SITE_PRECOM","SITE_SAT","PUNCH_CLOSEOUT"],
          workloadSource:event.retainedActivityCodes,
          sharedWorkloadNote:"SVC-029 is retained site Pre-Com/SAT/integration/commissioning pool; OEM-authorised commissioning is not replaced silently.",
          mhPool:retainedMh,
          internalCostThbPool:retainedInternalCostThb,
          baseSellThbPool:retainedBaseSellThb
        },
        releaseNote:"Current INDUSTRONIC offer says commissioning should be by authorised personnel and independent commissioning may affect warranty. Obtain OEM site terms or written warranty-safe delegation before assuming ADDVALUE-only commissioning."
      };
    }

    return {
      ...event,
      location:"Project site · Myanmar",
      strategy:"ADDVALUE_RETAINED_EXECUTION / OEM_SUPPORT_AS_REQUIRED",
      vendorSelection:"NOT QUOTED / TBC",
      vendorCoverage:{
        state:"NOT QUOTED IN A20261632",
        sourceRef:offer?.quoteRef,
        role:"OEM SUPPORT / SUPERVISION TBC"
      },
      addvalueCoverage:{
        roles:event.eventType==="SAT"
          ? ["CONTRACT_LEAD","SITE_SAT","TECHNICAL_EXECUTE","PUNCH_CLOSEOUT"]
          : ["CONTRACT_LEAD","SITE_PRECOM","TECHNICAL_EXECUTE"],
        workloadSource:event.retainedActivityCodes,
        sharedWorkloadNote:"SVC-029 is a shared retained site workload pool; event-specific MH is not split without a controlled driver.",
        mhPool:retainedMh,
        internalCostThbPool:retainedInternalCostThb,
        baseSellThbPool:retainedBaseSellThb
      },
      releaseNote:"ADVALUE retained work is required unless a selected vendor service explicitly covers the same executable role. OEM support remains separate and must not be assumed free."
    };
  });
}

export const PROJECT0550_PAGA_LIFECYCLE_PLAN = buildPagaLifecycleExecutionPlan();
