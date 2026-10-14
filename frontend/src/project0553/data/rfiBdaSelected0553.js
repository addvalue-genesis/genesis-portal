// PJ2608-0553 MR0002 — new user-supplied product-family selection (14-Oct-2026).
// User source: RFI UHF Bi-Directional Amplifier 380-520MHz BD Series P-43899-10, pp1-2.
// Replaces old MGW UHF-1 HYTERA TS-9200 BDA as the selected product family;
// it does NOT automatically replace the separate RFI RX3852-2002-11 LNA.
export const RFI_BDA_SELECTION_0553=Object.freeze({
 mr:"MR0002",system:"DTRS_TRUNK_RADIO",function:"UHF_BI_DIRECTIONAL_AMPLIFIER",
 manufacturer:"RFI",family:"BD Series",model:"BDxxxx-yyyy-zz",
 document:"RFI UHF Bi-Directional Amplifier.pdf, P-43899-10",sourceDate:"2026-10-14",
 selectedFamily:true,exactOrderingCode:null,unitRate:null,currency:null,
 projectedUnitCount:null,siteAllocation:null,extendedCost:null,
 replacesHistorical:"MGW P26-058 UHF-1 HYTERA TS-9200 BDA, unselected historical alternative",
 lnaPolicy:"RFI RX3852-2002-11 LNA remains separately evidenced; do not automatically delete or price it twice until approved RF topology confirms BDA and LNA functions",
 frequencySubbandsMHz:[[380,400],[400,430],[430,450],[450,470],[470,500],[500,520]],
 externalFilterVariant:"BDUEXT requires external duplexing/filtering; frequency supported 380-520MHz is filter-dependent",
 passbandMHz:[1.5,5],minimumTxRxSeparationMHz:4,
 powerOutputMaxDbm:{standard:21,high:40},gainMaxHighDb:84,
 connector:"N-female",powerOptions:["12VDC","24VDC","48VDC","90-264VAC"],
 protection:"IP65",mount:"wall or pole",
 RFoverFibre:["none","single WDM","dual simplex","single alternative WDM wavelength"],
 requiredDecisions:["operating frequencies UL/DL and duplex separation","off-air versus RF over Fibre / donor-service antenna topology","BD subband and full ordering code","required standard/high power gain, isolation and donor/service antenna design","DC/AC site supply, current draw and hazardous-area suitability","vendor package rate and field bulk inclusions","RFI LNA coexistence / replacement topology approval"],
 status:"SELECTED_RFI_BD_FAMILY__EXACT_MODEL_COMPLIANCE_AND_PRICE_PENDING",
 pricingPolicy:"Missing model/quote is unknown, never zero; no automatic transfer of excluded HYTERA BDA price.",
 releaseAllowed:false
});
