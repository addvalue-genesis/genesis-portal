// Management-approved budgetary policy 2026-10-11, PJ2608-0553.
// Procurement allowance applies to purchased cable length, NOT supplier unit price,
// not entire equipment packages and not spares.
export const APPROVED_0553_BUDGET_BASIS=Object.freeze({
 status:"APPROVED_INTERNAL_BUDGETARY",approvedDate:"2026-10-11",
 greenfield:{siteIds:["ZWP20","ZWP21","ZWP22","ZWP23"],baseRouteM:60,cableProcurementAllowancePct:15},
 brownfield:{siteIds:["ZPQ","ZWP8","ZWP11"],scope:"NEW_CABLE_TERMINATION_MODIFICATION_ONLY",
  allowance:"PARAMETRIC_ADDITIONAL_SCOPE_AFTER_BLD_REUSE_CLASSIFICATION",doNotAssumeNewCableForReuse:true},
 telephone:{jbPolicy:"ONE_JB_PER_EX_IP_PHONE_REQUIRING_JB",historicalProsperRateTHB:24500,
  quotation:"Q-PROSRY-24051 Rev0 item3, 12-Jul-2024",requirePhoneCountsFromMR:true},
 racon:{enclosureCostOwner:"VENDOR_RACON_PACKAGE",bulkScope:"EXTERNAL_FIELD_CABLE_AND_NON_INCLUDED_ACCESSORIES_ONLY"},
 lifecycle:{precomAndCommissioning:"B4",startupSpares:"B5",capitalSpares:"C2",installation:"C1"},
 costRules:["Never double count ZWP20 SCADA Bulk row11 and seven-location budget projection",
 "Never apply SCADA CAT6A unit price to DTRS coax, telephone or RACON wiring",
 "Never count historical vendor quoted quantities as approved Z1F installations",
 "Separate engineering assumptions, vendor unit rates and final approved measured MTO"]
});
export const approvedCablePurchaseM=(routeM,allowancePct=15)=>Number.isFinite(routeM)?Math.ceil(routeM*(1+allowancePct/100)):null;
