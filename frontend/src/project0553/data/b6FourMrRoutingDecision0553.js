/**
 * PJ2608-0553 / 10.2 B6 Transportation — current Four-MR route reconciliation.
 *
 * SOURCE AUTHORITY:
 * - NextG NG/260916-ADV-DAP1, 16-Sep-2026, USD191610.15, DAP Ranong;
 *   expires 01-Oct-2026. This is NOT DDP Thailand, nor DAP Nantong.
 * - MGW P26-058_R2 20-Oct cover SERV-5 USD2500 Nantong->JUTAL; the
 *   supplier's earlier WhatsApp mentions packing INCLUDED in freight,
 *   despite separate SERV-3 USD500 on the cover. Never invent USD500 credit.
 * - RQ2609-1182 greenfield request: 4 ODU, 4 IDU, 5 antenna; not
 *   automatically 4 antennas or ALL equipment already confirmed by the quote.
 * - 10.2 B6 THB307584 is a selected HISTORICAL REV08-based Working SELL,
 *   without evidenced MR-level quantities, freight legs or cost allocation.
 *
 * ENGINEERING:
 * Keep NextG radio, ODU, antennas, Thai enclosure/Cisco and MGW goods in
 * UNIQUE physical-cargo batches. Moving an upstream vendor delivery handover
 * does not post an incremental freight cost or imply a real savings value.
 * 2026-10-22 OWNER APPROVAL: All five greenfield antennas also go to MGW
 * Nantong (no direct-JUTAL antenna bypass). Thai Enclosure + Cisco 4 sets
 * are bench preassembled in Thailand and then exported to MGW.
 * Owner shipping-route approval is NOT NextG's acceptance of amended DAP
 * place/rate, goods dispatch, customs clearance, or a B6 sell reprice.
 * DAP and DDP are different import-clearance responsibilities.
 *
 * NO new module/dashboard/customer line. Read-only 10.2 B6 evidence only.
 */
import NEXTG from "./quotes/NG-260916-ADV-DAP1.full.json";
import {MGW_R2_COVER_20261020_0553 as mgw} from "./mgwP26058R2Cover20261020";
import {MGW_ROAD_FREIGHT_PACKING_EVIDENCE_0553 as freightProof} from "./mgwRoadFreightPackingEvidence0553";
const freeze=x=>Object.freeze(x);
const PREFIX="bid.budget.working.bc.b6";
const legs=freeze([
 {id:"B6-MR1-NEXTG-IDU",mr:"MR0001",cargo:"NextG selected IDU/radio equipment",preferred:"NextG quoted DAP Ranong → SAMTEL Warehouse Thailand; changed handover unconfirmed"},
 {id:"B6-MR1-NEXTG-ODU",mr:"MR0001",cargo:"NextG selected ODU/accessories",preferred:"NextG supplier → Thailand SAMTEL Warehouse; no automatic China routing"},
 {id:"B6-MR1-NEXTG-ANT",mr:"MR0001",cargo:"Five greenfield antennas; wider selected MR0001 scope separately reconciled",preferred:"NextG → SAMTEL Warehouse Thailand"},
 {id:"B6-MR1-TH-ENC-CISCO",mr:"MR0001",cargo:"Thai enclosure / VST Cisco current Rev03 composition (5 LAN sets; 4 GF assemblies)",preferred:"Thai suppliers → SAMTEL Warehouse; no direct export to MGW"},
 {id:"B6-MGW-MR234-INTERNAL",mr:"MR0002",cargo:"MGW BDA/RF 3 systems ONLY; old cargo ID retained for trace",preferred:"MGW China → Thailand; ADDVALUE owns Thai import",sourceQtyBasis:"UHF-1..4 USD99564; EXW detailed vs DAP Nantong cover conflict retained"},
 {id:"B6-EXION-TH-IN",mr:"MR0003",cargo:"EXION 4 telephone/sounder pairs",preferred:"DDP Nonthaburi → exact SAMTEL Warehouse handover; local transfer if needed"},
 {id:"B6-MDS-TH-IN",mr:"MR0004",cargo:"MDS / ORGA 3 RACON systems budgeted from 1-system quote",preferred:"FCA Factory (named place TBC) → Thailand import → SAMTEL Warehouse"},
 {id:"B6-MGW-JUTAL-OUT",mr:"MR0001–MR0004",cargo:"Consolidated tested goods SAMTEL → Thai export port → Zhuhai Port, China; old cargo ID retained",preferred:"CIF Zhuhai Port China Incoterms 2020; China clearance/tax and port→yard Purchaser under COM-D02"}
].map(x=>freeze({sourceQtyBasis:"Use selected BOM and actual package weights/dimensions; equipment quantity is not crate count",fallback:"Do not assume free freight or tax exemption",selectedFreightCostTHB:null,postingAllowed:false,...x})));
const scenarios=freeze([freeze({id:"SC-B6-SAMTEL-CIF-ZHUHAI",status:"OWNER_SELECTED__FREIGHT_COST_ALLOCATION_OPEN",
 label:"All selected suppliers → SAMTEL Warehouse Thailand FAT/Training → CIF Zhuhai Port",
 included:legs.map(x=>x.preferred),additionalThailandTouchpoints:true,additionalChinaInboundTripsPotential:true,
 returnToThailandForFAT:true,workingSellTHB:null,verifiedDirectCostTHB:null,postingAllowed:false})]);
export function selectB6FourMrRoutingDecision0553({selectedB6WorkingSellTHB=null,earlierFourCabinetReference=null}={}){
 const freight=mgw.services.find(s=>s.id==="SERV-5");
 const packing=mgw.services.find(s=>s.id==="SERV-3");
 if(NEXTG.quoteNumber!=="NG/260916-ADV-DAP1"||NEXTG.quotedGrandTotal!==191610.15||
  NEXTG.sourceDriveId!=="1dwU6mkjm0JOKvbw3fMeCH8alQtKufEyd"||
  freight?.usd!==2500||packing?.usd!==500||freightProof.coverFreightUSD!==2500||
  freightProof.supplierConfirmsRoadFreightIncludesPacking!==true||
  selectedB6WorkingSellTHB!==307584||legs.length!==8||
  new Set(legs.map(x=>x.id)).size!==8)
  throw Error("B6 selected owner / NextG DAP Ranong / MGW packing-freight evidence changed");
 if(earlierFourCabinetReference&&
  (earlierFourCabinetReference.preliminaryInboundLowTHB!==42797||
   earlierFourCabinetReference.preliminaryInboundHighTHB!==72372||
   earlierFourCabinetReference.bundleCount!==4||
   earlierFourCabinetReference.postingAllowed))
  throw Error("Prior four-cabinet intake scenario cannot be modified into a complete radio/antenna freight offer");
 return freeze({
  moduleId:PREFIX,
  sourceId:"B6-4MR-LOGISTICS-DECISION-20261021",
  approvedDecisionId:"ADR-URGENT-SAMTEL-CIF-20261024",
  approvedDecisionDate:"2026-10-24",
  decisionOwner:"PROJECT_OWNER",
  physicalRoutingStatus:"OWNER_APPROVED__NOT_VENDOR_RECONFIRMED",
  sourceQuoteRevisionUnchanged:true,
  selectedB6WorkingSellTHB,
  dapCommercialPlanning:freeze({
   proposedDeliveryTerm:"CIF Zhuhai Port China — Incoterms 2020",
   contractualBaseline:"DDP PURCHASER'YARD — JUTAL Equipment Purchase Contract Article 8.1",
   cclPreviousAlternative:"CCL Samart item12 Accepted/Close CIF Zhuhai Port; COM-D02 China clearance/duty/VAT and port-to-yard Purchaser unless separately agreed",
   workingDecision:"OWNER_SELECTED_PROVISIONAL_BUDGETARY_BASIS__NOT_CLIENT_OR_VENDOR_APPROVED",
   workingSellTHB:307584,mgwServ5QuotedUSD:2500,mgwServ5QuotedTHB:78750,
   buyerResponsibleForApplicableImportClearanceUnderDAP:true,
   importVATTHB:null,importDutyTHB:null,domesticChineseSalesVATTHB:null,
   taxSavingsEstablishedTHB:null,deliveryCargoScopeConfirmed:false,
   vendorConfirmedDAPJutal:false,jutalApprovedDAPDeviation:false,
   nextgIncomingChinaRerouteCostConfirmed:false,mgwPackingFreightOverlapResolved:false,
   independentCostPostingAllowed:false,customerReleaseAllowed:false,
   priceClass:"RETAINED_B6_WORKING_SELL_ALLOWANCE__CIF_NEW_LEGS_NOT_YET_COSTED",
   note:"Keep B6 307584 as provisional 1LS reserve, adequacy UNKNOWN for new route; MGW USD2500 China road freight is NOT Thai sea freight. Cargo ICC(A) to Yard under contract 18.1(c) remains unresolved against CIF port; no automatic exclusion or zero premium."
  }),
  workingSellAuthority:"10.2 historical Rev08 USD9764.5714 x 31.5 = THB307584; NOT a shipment rate",
  nextg:freeze({quoteNumber:NEXTG.quoteNumber,sourceUrl:"https://drive.google.com/file/d/"+NEXTG.sourceDriveId+"/view",
   quotedTotalUSD:NEXTG.quotedGrandTotal,quoteValidTo:"2026-10-01",
   quotedDeliveryTerm:"DAP Ranong, Thailand",isDDPThailand:false,
   directChinaFreightQuoted:false,deliveryRerouteCreditTHB:null,
   approvedDirectToMgwNantong:false,approvedIdutoMgw:false,
   approvedOdutoMgw:false,approvedAllFiveAntennasToMgw:false,
   destinationAcceptedInRevisedNextgQuotation:false,
   purchaseOrderDestinationAmended:false,dispatchConfirmed:false,
   currentQuotationExpired:true,
   greenfieldRfQODU:4,greenfieldRfQIDU:4,greenfieldRfQAntenna:5}),
  mgw:freeze({quoteNumber:mgw.quoteNumber,quotedRoadFreightUSD:2500,quotedRoadFreightTHB:78750,
   quotedPackingUSD:500,chatPackingIncludedWithinFreight:true,
   confirmedPackingCreditUSD:null,freightPostingCount:0,
   sourceUrl:mgw.sourceUrl,
   quotedOutboundOwner:"VQ-MGW-SERV-5",outboundFreightScopeAllMRsConfirmed:false,
   quoteDestinationMismatch:"DAP Nantong vs separate road freight to JUTAL"}),
  siteAssembly:freeze({thaiPreassemblyAuthorizedByOwner:true,
   enclosureAndCiscoFourSetsFromThailandApproved:true,
   preliminaryWiringAndElectricalQaApproved:true,
   actualAssemblyCompleted:false,
   operation:"Install/mount Cisco and enclosure accessories at SAMTEL; integrate all selected suppliers before FAT",
   technicalRequirement:"Do not modify Ex-certified enclosure, penetrations or heat dissipation beyond approved GA/Ex documentation; retain serial/port and FAT photos",
   packedSetCount:4,
   inboundToMgwAcceptedOperationallyByOwner:false,
   chinaImporterProcedureCostQuoted:false}),
  sourceLegs:legs,scenarios,preferredScenarioId:scenarios[0].id,
  selectedPhysicalRouteId:scenarios[0].id,
  approvedMr0001InboundLotIds:freeze([
   "B6-MR1-NEXTG-IDU","B6-MR1-NEXTG-ODU",
   "B6-MR1-NEXTG-ANT","B6-MR1-TH-ENC-CISCO"
  ]),
  selectedAntennaBypassToJutal:false,
  ownerApprovedAntennaCount:5,
  approvedRoutingVsQuotedShippingSeparation:true,
  pendingNextgAmendedSupplierOffer:true,
  insuranceExtent:"Contract 18.1(c) ICC(A) to Purchaser Yard vs CIF port: reconcile scope; retain open premium exposure",
  chinaImportAndPortToYardOwner:"PURCHASER under COM-D02 unless separately agreed",
  thaiImportOwner:"ADDVALUE for MGW MR0002; MDS importer/tax treatment to confirm",
  mr2to4CurrentDirection:"MGW MR0002 → Thailand import; EXION MR0003 domestic; MDS MR0004 FCA → Thailand; all to SAMTEL FAT",
  supplierFreightAlreadyQuotedOnce:true,
  sourceOnlyFourCabinetLowTHB:earlierFourCabinetReference?.preliminaryInboundLowTHB??null,
  sourceOnlyFourCabinetHighTHB:earlierFourCabinetReference?.preliminaryInboundHighTHB??null,
  fourCabinetAllowanceNotFullMr0001Freight:true,
  directChinaWholeMr0001FreightTHB:null,
  selectedB6CostAllocationPerMRTHB:null,
  vendorFreightCostDoesNotEqualSelectedSell:true,
  oldRouteCostDecompositionTHB:null,
  netSavingOrIncreaseTHB:null,
  prospectiveUpdatedB6WorkingSellTHB:null,
  costRepostingAllowed:false,postingAllowed:false,releaseAllowed:false,
  decisionGates:freeze([
   "Existing MGW evidence only; no requotation request. EXW detailed vs DAP Nantong cover remains unresolved",
   "MGW RF freight China→Thailand, Thai import/broker/duty and insurance require supported budget allocation; no tax exemption assumed",
   "NextG DAP Ranong and EXION DDP Nonthaburi are not exact SAMTEL address acceptance; retain named-place mismatch",
   "MDS FCA pickup place is unconfirmed; do not infer Schiedam from warranty text",
   "B6 307584 is retained provisional Working SELL, not proof the new multi-leg CIF scope is fully funded",
   "CIF Zhuhai Port accepted CCL item12; COM-D02 China clearance/duty/VAT and port→yard Purchaser unless otherwise agreed",
   "Contract 18.1(c) ICC(A) to Yard is stronger than port delivery; reconcile insurance extent and premium without silent removal",
   "B5 sea repacking net of MDS included crates / EXION inland packing; B7 storage and B14 general insurance charged once"

  ])
 });
}
