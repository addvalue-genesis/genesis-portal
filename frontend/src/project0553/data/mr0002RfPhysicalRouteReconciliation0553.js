// PJ2608-0553 MR0002 DMR/BDA physically distinct RF feeder circuits.
// Evidence-led route takeoff; LAY positions ≠ WIR/TER routes ≠ AFC measured metres.
// MGW complete-system supply is responsible for installed RF cables and accessories.
// ADDVALUE NEK is a discretionary BULK installation spare/contingency reserve only.
import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import {MGW_P26_058_R2_SELECTED_0553 as MGW} from "./mgwP26058R2Selected0553";
import {MR0002_RF_FEEDER_QUALIFICATION_0553 as NEK_QA} from "./mr0002RfFeederQualification0553";
import {MR0002_BDA_DEVIATION_REV00_0553 as DEV} from "./mr0002DeviationBdaRev00_0553";

export const MR0002_RF_ROUTE_SOURCE_0553=Object.freeze({
 customerMR:{document:"MM-ZTK-1F-GEN-TEL-MR-0002 Rev.C1",pages:"10–11 of 31",
  url:"https://drive.google.com/file/d/1Vk8Jv8x9jDb7tMUNh1f7F4EtK6y5u6cm/view",
  scope:"One BULK lot per site: cable glands, FIRE RESISTANCE coaxial and Ethernet cables, grounding kits etc."},
 customerSPE:{document:"MM-ZTK-1F-GEN-TEL-SPE-0001 Rev.C2",clause:"6.3 / 6.6 / 6.6.5",
  url:"https://drive.google.com/file/d/1pa5Tlqpu65Lv1HDkNSz3XvcDCkpjVGRn/view",
  scope:"RF cables for Digital Radio System shall be FIRE RESISTANCE; Coax separate tray; Ex glands/grounding and approved routing."},
 layout:{document:"MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1 AFC",url:"https://drive.google.com/file/d/1PStua_5EmygpXpT2wMB3Jlj-Sq7syETA/view",
  limitation:"AFC positions/decks only; no cable-by-cable routing metres or service loops"},
 block:{document:"MM-ZTK-1F-ZWPX-TEL-BLD-0001 Rev.C1",url:"https://drive.google.com/file/d/1ilsnWSfMlFZh8nD29rra4YRWizadovl-/view",
  limitation:"AFC functional schematic (not WIR/TER) still shows original LNA at new WPs and BDA in brownfield system; no unapproved BDA substitution."},
 internalSchematic:{document:"MM-ZTK-1F-GEN-SCADA-TEL-DWG-0001 Rev00",
  class:"INTERNAL_SAMART_ADDVALUE_ENGINEERING_CHECK_ONLY",status:"ISSUED_FOR_BIDDING",
  pages:"3–4 of 4",caveat:"BOM cable detail entries use 1 LOT not measured runs; old LNA and 16-port L3 must not override AFC or current MGW RF quote."},
 mgw:{document:MGW.document,quoteLine:"UHF-4",url:MGW.source,
  includedFeederMPerSite:100,includedConnectorPcPerSite:6,
  scope:"FORLLER 1/2 inch low-loss 50-ohm coax and six 1/2-inch male RF connectors, per quoted site package"},
 nek:{document:"SM000111.pdf NEK Rev6",sourceKind:"USER_DOCUMENT",
  scope:"ADDVALUE-proposed RF BULK technical source; only IEC 60332 Flame Retardant listed, no IEC 60331 Fire Resistant proof in supplied PDF",
  attenuation450DbPer100m:4.93},
 requirements:["Verify ZWP20 AFC TCAB-508-001 surge / 002 LNA; ZWP21/ZWP22 001 LNA / 002 surge",
 "Approve engineering change from AFC original LNA to MGW RFI BDA with GA/BLD/Ex evidence before mapping selected BDA ports",
 "Confirm selected donor/service BDA port and certified Ex feedthrough diagram; no old LNA assumptions",
 "Obtain AFC TEL cable routing or WIR/TER actual start/end, bends, tray segments and termination tails for EACH distinct RF run",
 "Confirm MGW UHF-4 feeder supplied form (reel/cut assemblies), usable balance, connectors and installation ownership",
 "Resolve 1/2 inch vs 7/8 inch conditional clause for ODU-antenna runs with project authority; do not automatically apply that clause to BDA",
 "Prove IEC 60331 FIRE RESISTANCE of installed DMR coax (IEC 60332 Flame Retardant alone is not sufficient)",
 "Confirm Ex surge/PolyPhaser/Solexy, antenna connector types, enclosure RF bulkheads and extra jumper mating ends",
 "Treat any installed RF feeder gap as MGW vendor corrective scope; assess independent ADDVALUE BULK spare reserve only if management explicitly approves it"]
});
export const MR0002_RF_ROUTE_SCENARIO_POLICY_0553=Object.freeze({
 reference:"Original dtrsRfiBudgetCalculation0553 2026-10-12 grid/span provisional calculation",
 gridProxyM:9.144,terminationAndRoutingAllowanceM:3,
 perRouteInstalledReferenceM:12.144,
 purchasingAllowancePct:15,
 sourceType:"ILLUSTRATIVE_GEOMETRY_PROXY_NOT_AFC_QUANTITY",
 costPostingAllowed:false,approvedTakeoff:false,
 warning:"Do not treat 9.144m WP grid span + 3m as field-measured route. Repeated across two distinct RF functions only for a labelled sensitivity check."
});
const siteLayoutSheets=Object.freeze({ZWP20:4,ZWP21:7,ZWP22:10});
const paths=Object.freeze([
 {id:"RF-DONOR",name:"DONOR YAGI → BDA",from:"ANT-508-001",to:"TCAB-508-001 / donor RF IN",
  topology:"ANT-508-001 Yagi → Ex/cable coupling + PolyPhaser / TCAB-508-002 where selected → TCAB-508-001 BDA donor input",
  intermediate:["Yagi","Solexy RXNMS0200JX0","PolyPhaser IS-B50LN-C2","Ex feedthrough / surge enclosure (verify final order)"],
  owner:"MGW_COMPLETE_SYSTEM__DONOR_INSTALLED_RF_CABLE"},
 {id:"RF-SERVICE",name:"BDA → SERVICE OMNI",from:"TCAB-508-001 / service RF OUT",to:"ANT-508-002",
  topology:"TCAB-508-001 BDA service output → surge / certified RF interface (as selected) → ANT-508-002 Omni",
  intermediate:["BDA service port","SA-508-001/002 as applicable","TCAB-508-002 as applicable","KBT antenna"],
  owner:"MGW_COMPLETE_SYSTEM__SERVICE_INSTALLED_RF_CABLE"}
]);
export const mr0002RfPurchaseM0553=(installedM,allowancePct=15)=>{
 if(!Number.isFinite(installedM)||installedM<0||!Number.isFinite(allowancePct)||allowancePct<0)return null;
 return Math.ceil(installedM*(1+allowancePct/100));
};
export function calculateMR0002RFNetMaterial0553({verifiedPhysicalRunLengthsM=null,acceptedMGWAvailableM=null,connectorsRequired=null,acceptedMGWConnectorQty=null}={}){
 if(!Array.isArray(verifiedPhysicalRunLengthsM)||verifiedPhysicalRunLengthsM.length!==2||
    verifiedPhysicalRunLengthsM.some(x=>!Number.isFinite(x)||x<0)||
    !Number.isFinite(acceptedMGWAvailableM)||acceptedMGWAvailableM<0){
  return {installedM:null,purchaseM:null,netAdditionalM:null,additionalConnectors:null,
   state:"ROUTE_OR_ACCEPTED_VENDOR_CREDIT_NOT_VERIFIED"};
 }
 const installedM=verifiedPhysicalRunLengthsM.reduce((n,x)=>n+x,0);
 // This is a MGW installation-supply shortage calculation, NOT an ADDVALUE purchase signal.
 const purchaseM=verifiedPhysicalRunLengthsM.map(x=>mr0002RfPurchaseM0553(x)).reduce((a,b)=>a+b,0);
 const connectorKnown=Number.isInteger(connectorsRequired)&&connectorsRequired>=0&&
   Number.isInteger(acceptedMGWConnectorQty)&&acceptedMGWConnectorQty>=0;
 return {installedM:Math.round(installedM*1000)/1000,purchaseM,
  netAdditionalM:Math.max(0,purchaseM-acceptedMGWAvailableM),
  shortfallOwner:"MGW_COMPLETE_SYSTEM__SUPPLIER_CORRECTIVE_SCOPE",
  addvalueAutomaticProcurementM:null,
  additionalConnectors:connectorKnown?Math.max(0,connectorsRequired-acceptedMGWConnectorQty):null,
  state:"CONDITIONAL_NET_MATERIAL__CABLE_SPEC_AND_VENDOR_CREDIT_MUST_BE_VERIFIED",
  warning:"Any difference is for MGW scope reconciliation/correction only, NOT an ADDVALUE NEK bulk purchase order. Compatible pooled stock is unverified."};
}
export function deriveMR0002RfPhysicalRouteReconciliation0553(){
 const policy=MR0002_RF_ROUTE_SCENARIO_POLICY_0553,src=MR0002_RF_ROUTE_SOURCE_0553;
 const selectedSites=MGW.sitesByMR["MR-0002"];
 const kit=MGW.lines.find(x=>x.id==="UHF-4");
 if(!kit||kit.quantity!==selectedSites.length||
   NEK_QA.selectedQtyPerSiteM!==src.mgw.includedFeederMPerSite||
   NEK_QA.selectedConnectorQtyPerSite!==src.mgw.includedConnectorPcPerSite)
   throw Error("MR0002 RF feeder route reconciliation requires exact selected MGW Rev2 UHF-4 included supply");
 const sites=selectedSites.map(site=>{
  const found=Z1F_TEL_LAYOUT_INDEX_0553.byWP.find(w=>w.wp===site);
  const eq=(tag)=>found?.equipment.find(x=>x.system==="DTRS_TRUNK_RADIO"&&x.tag===tag);
  const expected=["ANT-508-001","ANT-508-002","TCAB-508-001","TCAB-508-002"];
  const missingTags=expected.filter(t=>!eq(t));
  const routeTag=x=>String(x).split(" / ")[0];
   const lnaCandidates=found?.equipment.filter(x=>x.system==="DTRS_TRUNK_RADIO"&&x.functionRole==="LEGACY_LNA_ENCLOSURE")||[];
  const surgeCandidates=found?.equipment.filter(x=>x.system==="DTRS_TRUNK_RADIO"&&x.functionRole==="RF_SURGE_EXD")||[];
  if(lnaCandidates.length!==1||surgeCandidates.length!==1||lnaCandidates[0].tag===surgeCandidates[0].tag)
   throw Error("AFC LNA / RF surge role mismatch: "+site);
  const lnaTag=lnaCandidates[0].tag,surgeTag=surgeCandidates[0].tag;
  const circuits=paths.map(p=>{
   const donor=p.id==="RF-DONOR";
   const from=donor?"ANT-508-001":lnaTag+" / ORIGINAL AFC LNA — BDA CHANGE HOLD";
   const to=donor?lnaTag+" / ORIGINAL AFC LNA — BDA CHANGE HOLD":"ANT-508-002";
   return {
   ...p,from,to,site,moduleId:"bid.budget.bom."+site.toLowerCase()+".mr0002.rf-route."+p.id.toLowerCase(),
   originalAfcLnaTag:lnaTag,originalAfcSurgeTag:surgeTag,
   topology:donor?
    "Yagi ANT-508-001 → "+surgeTag+" AFC surge (order pending WIR) → "+lnaTag+" AFC original LNA / proposed MGW BDA HOLD":
    lnaTag+" AFC original LNA / proposed BDA service interface HOLD → "+surgeTag+" AFC surge (order pending WIR) → ANT-508-002 Omni",
   intermediate:donor?["Yagi","Solexy and PolyPhaser supplier accessories",surgeTag+" AFC surge",lnaTag+" AFC LNA/proposed BDA"]:
    [lnaTag+" AFC LNA/proposed BDA",surgeTag+" AFC surge","Omni"],
   fromDeck:eq(routeTag(from))?.deck||"NOT LOCATED",
   toDeck:eq(routeTag(to))?.deck||"NOT LOCATED",
   sourceSheet:siteLayoutSheets[site],routeSegmentsM:null,verifiedInstalledM:null,
   verifiedTerminationEnds:null,verifiedConnectors:null,
   cableSku:null,cableOemAccepted:false,
   sourceStatus:"AFC_LNA_VS_MGW_BDA_CHANGE_AND_RF_ROUTE_HOLD",
   engineeringBudgetReferenceInstalledM:policy.perRouteInstalledReferenceM,
   engineeringBudgetReferencePurchaseM:mr0002RfPurchaseM0553(policy.perRouteInstalledReferenceM,policy.purchasingAllowancePct)
  };});
  // This intentionally uses an unverified *illustration* separately from the actual quantity answer.
  const illustrativeInstalledM=circuits.reduce((s,c)=>s+c.engineeringBudgetReferenceInstalledM,0);
  const illustrativePurchaseM=circuits.reduce((s,c)=>s+c.engineeringBudgetReferencePurchaseM,0);
  const illustrativeMgwPotentialBalanceM=src.mgw.includedFeederMPerSite-illustrativePurchaseM;
  const net=calculateMR0002RFNetMaterial0553();
  return {site,scope:"MR-0002",moduleId:"bid.budget.bom."+site.toLowerCase()+".mr0002.rf-physical-routes",
   sourceBulk:"MR0002 Bulk 1 Lot per MR C1",expectedTags:expected,missingTags,
   layoutDocument:src.layout.document,layoutSheet:siteLayoutSheets[site],
   afcLnaEnclosureTag:lnaTag,afcSurgeEnclosureTag:surgeTag,
   afcTagRoleVerified:true,selectedMgWBdaFunctionMapsToOriginalAfcLna:false,
   engineeringChange:"SELECTED_MGW_BDA_VS_CUSTOMER_AFC_LNA__GA_BLD_EX_CERT_DEVIATION_HOLD",
   deviationId:DEV.id,deviationStatus:DEV.status,
   proposedRfiBda:{outputDbm:DEV.proposed.outputCompositeDbm,gainDb:DEV.proposed.gainAdjustableDb,
     agc:true,oscillationMute:true},
   proposedDonorAntenna:{tag:"ANT-508-001",model:DEV.proposed.yagiModel,
     elements:DEV.proposed.yagiElements,gainDbi:DEV.proposed.yagiGainDbi,
     elevationM:DEV.proposed.yagiElevationM,positionApproval:false},
   proposedServiceAntenna:{tag:"ANT-508-002",location:DEV.proposed.omniRelocation,
     elevationM:DEV.proposed.omniElevationM,positionApproval:false},
   approvedDeviationCableLengthM:null,
   circuitCount:circuits.length,circuits,
   mgw:{vendor:"MGW",materialBrand:"FORLLER",offerLine:"UHF-4",
    providedFeederM:100,providedConnectors:6,source:src.mgw.url,
    supplierScope:"COMPLETE_SYSTEM__INSTALLED_RF_FEEDER_CONNECTORS_AND_ACCEPTANCE",
    functionalInstalledSupplyOwner:true,shortfallCorrectiveOwner:"MGW",
    technicallyAccepted:false,suppliedFormVerified:false,installationAllocationVerified:false},
   addvalue:{proposer:"ADDVALUE",materialBrand:"NEK",proposalSelected:true,
    reserveType:"CONDITIONAL_INSTALLATION_BULK_SPARE",
    installationScopeOwner:"MGW",sparesLedgerOwner:"ADDVALUE_BULK_RESERVE_ONLY",
    applicableCircuits:["RF-DONOR","RF-SERVICE"],
    procurementQtyM:null,approvedReserveM:null,workingTHB:null,
    unitRateTHB:null,source:"SM000111.pdf",technicalApproved:false,
    reserveRationale:"NEK candidate for separate spare/installation contingency only; MGW owns all system installation cable. Spare reserve depends on approved policy and IEC60331.",
    notEquivalentTo:["MGW RF feeder shortfall purchase","B10 commissioning spares","C2 capital/long-term spares"],
    bookedAdditionalTHB:0},
   actual:{totalMeasuredInstalledM:net.installedM,purchaseM:net.purchaseM,
    mgwSystemShortfallM:net.netAdditionalM,mgwSystemShortfallConnectors:net.additionalConnectors,
    netNEKPurchaseM:null,netNEKConnectors:null,
    procurementReady:false,calculationStatus:net.state},
   scenario:{type:policy.sourceType,referenceMPerCircuit:policy.perRouteInstalledReferenceM,
    referenceTotalInstalledM:Math.round(illustrativeInstalledM*1000)/1000,
    referenceTotalPurchaseM:illustrativePurchaseM,
    mgwPotentialBalanceIfEquivalentM:illustrativeMgwPotentialBalanceM,
    netAdditionalIfMGWAcceptedAndPooledM:Math.max(0,illustrativePurchaseM-100),
    replacementNEKIfMGWRejectedM:null,
    mgwSystemIllustrativeShortfallM:Math.max(0,illustrativePurchaseM-100),
    independentADDVALUENEKSpareM:null,
    geometryOnlyFor:"AFC_BASE_LEGACY_SAME_DECK_REFERENCE",
    usableForOpenBdaRelocation:false,proposedBdaRelocationRequiredCableM:null,
    conditionalOnly:true,financialPostingAllowed:false},
   compliance:{mrRequiresFireResistant:true,nekSm000111OnlyDocumentsFlameRetardant:true,
    nekIEC60331Proof:false,forllerIEC60331Proof:false,
    selectedFeederTechnicalApproval:false,
    scope:"HOLD_DMR_RF_CABLE_FIRE_RESISTANCE_AND_FREQUENCY_CERTIFICATION",
    conditional78InchClause:"ODU-to-antenna >5m condition in SPE 6.6 needs applicability assessment; cannot copy to BDA without decision"},
   missingSources:["AFC TEL/ELE Cable Routing LAY-0002",
    "Actual MR0002 cable-end WIR-0001/TER, donor/service RF BDA port arrangement",
    "FORLLER datasheet/IEC60331 and delivered 100m physical form",
    "NEK IEC60331 and confirmed Rev6/Rev9, current budget unit cost",
    "Certified connector, 2x surge assembly, Ex bulkhead and cable OD/gland matching"],
   ownerStatus:"MGW_COMPLETE_SYSTEM_OWNER__ADDVALUE_NEK_SPARE_RESERVE_UNPRICED",
   changedExistingWorkingTHB:0,customerReleased:false};
 });
 return {id:"PJ2608-0553",moduleId:"bid.budget.bom.mr0002.rf-physical-routes",
  sites,source:src,policy,selectedVendor:"MGW FORLLER / UHF-4 COMPLETE SYSTEM",proposedBulk:"ADDVALUE NEK CONDITIONAL SPARE RESERVE",
  totalActualAddvalueNetM:null,totalIllustrativeReferencePurchaseM:sites.reduce((s,w)=>s+w.scenario.referenceTotalPurchaseM,0),
  allSitesTakeoffApproved:false,postedAdditionalTHB:0,costLedgerChanged:false};
}
