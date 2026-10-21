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
 freeze({id:"B6-MR1-NEXTG-IDU",mr:"MR0001",cargo:"NextG radio/IDU interface equipment",sourceQtyBasis:"RQ2609-1182 greenfield IDU 4; verify split vs wider NG quotation",preferred:"NextG supplier-origin -> MGW Nantong direct",fallback:"NextG DAP Ranong -> Thailand -> MGW Nantong",selectedFreightCostTHB:null,postingAllowed:false}),
 freeze({id:"B6-MR1-NEXTG-ODU",mr:"MR0001",cargo:"NextG ODU / remote radio, accessories and licenses",sourceQtyBasis:"RQ2609-1182 greenfield ODU 4; vendor offer must be reconciled",preferred:"NextG supplier-origin -> MGW Nantong for iFAT/integration",fallback:"NextG DAP Ranong -> Thailand -> MGW Nantong",selectedFreightCostTHB:null,postingAllowed:false}),
 freeze({id:"B6-MR1-NEXTG-ANT",mr:"MR0001",cargo:"Antennas / dish / mount / RF accessories",sourceQtyBasis:"RQ2609-1182 greenfield antennas 5, NOT necessarily 4; approved link-budget SKU/diameter per site open",preferred:"NextG supplier-origin -> MGW Nantong direct for all FIVE greenfield antennas; FAT/staging with IDU/ODU",fallback:"Direct JUTAL antenna bypass is NOT owner-selected; requires a separately approved routing revision",selectedFreightCostTHB:null,postingAllowed:false}),
 freeze({id:"B6-MR1-TH-ENC-CISCO",mr:"MR0001",cargo:"Four enclosure + Cisco assemblies pre-mounted and electrically checked in Thailand; NO NextG IDU/ODU/antenna packed in this lot",sourceQtyBasis:"Owner-approved four sets; Thai supplier PO handover/Ex approvals and acceptance records to verify; not part of NextG radio quote",preferred:"Thai workshop -> MGW Nantong one protected consolidated batch",fallback:"Thai enclosure/Cisco loose parts -> MGW Nantong for all assembly",selectedFreightCostTHB:null,postingAllowed:false}),
 freeze({id:"B6-MGW-MR234-INTERNAL",mr:"MR0002/MR0003/MR0004",cargo:"MGW-procured BDA / telephone + sounder / RACON vendor packages",sourceQtyBasis:"MGW P26-058_R2 equipment quote USD350341; no evidence of Thailand re-import for China FAT",preferred:"OEM/vendor -> MGW Nantong receiving / integration",fallback:"Supplier contracted origins and delivery Incoterms, not automatic Thailand routing",selectedFreightCostTHB:null,postingAllowed:false}),
 freeze({id:"B6-MGW-JUTAL-OUT",mr:"MR0001–MR0004 consolidated (scope to confirm)",cargo:"MGW Nantong -> JUTAL yard outbound road cargo",sourceQtyBasis:"One original supplier quote SERV-5 USD2500; MGW also quotes SERV-3 packing USD500",preferred:"MGW Nantong -> JUTAL nominated site as quoted",fallback:"Confirm source cargo manifest and exact consignee rather than invent extra trip",selectedFreightCostTHB:null,postingAllowed:false})
]);
const scenarios=freeze([
 freeze({id:"SC-B6-A-THAILAND-FULL",status:"COMPARISON_ONLY",label:"Full Thailand receiving/assembly, then ship ALL MR0001 equipment to Nantong",
  included:["NextG equipment via DAP Ranong","Thai enclosures + Cisco assembly","ODU/IDU/antenna China shipment"],
  additionalThailandTouchpoints:true,additionalChinaInboundTripsPotential:true,
  returnToThailandForFAT:false,workingSellTHB:null,verifiedDirectCostTHB:null,postingAllowed:false}),
 freeze({id:"SC-B6-B-HYBRID-MGW",status:"OWNER_APPROVED_PHYSICAL_ROUTE__DELIVERY_REQUOTE_PENDING",label:"NextG IDU/ODU plus all 5 antennas direct to MGW; Thai enclosure+Cisco four cabinets preassembled then to MGW",
  included:["NextG IDU, ODU AND five greenfield antennas directly from vendor supply chain to MGW Nantong","Thai Enclosure + Cisco four sets: qualified bench preassembly, QA/power/wiring check, protected outbound shipment to MGW Nantong","At MGW: combine/stage complete MR0001 with MR0002–0004 and conduct approved FAT before JUTAL delivery"],
  additionalThailandTouchpoints:false,additionalChinaInboundTripsPotential:true,
  returnToThailandForFAT:false,workingSellTHB:null,verifiedDirectCostTHB:null,postingAllowed:false})
]);
export function selectB6FourMrRoutingDecision0553({selectedB6WorkingSellTHB=null,earlierFourCabinetReference=null}={}){
 const freight=mgw.services.find(s=>s.id==="SERV-5");
 const packing=mgw.services.find(s=>s.id==="SERV-3");
 if(NEXTG.quoteNumber!=="NG/260916-ADV-DAP1"||NEXTG.quotedGrandTotal!==191610.15||
  NEXTG.sourceDriveId!=="1dwU6mkjm0JOKvbw3fMeCH8alQtKufEyd"||
  freight?.usd!==2500||packing?.usd!==500||freightProof.coverFreightUSD!==2500||
  freightProof.supplierConfirmsRoadFreightIncludesPacking!==true||
  selectedB6WorkingSellTHB!==307584||legs.length!==6||
  new Set(legs.map(x=>x.id)).size!==6)
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
  approvedDecisionId:"ADR-68-B6-MR0001-DIRECT-MGW-20261022",
  approvedDecisionDate:"2026-10-22",
  decisionOwner:"PROJECT_OWNER",
  physicalRoutingStatus:"OWNER_APPROVED__NOT_VENDOR_RECONFIRMED",
  sourceQuoteRevisionUnchanged:true,
  selectedB6WorkingSellTHB,
  workingSellAuthority:"10.2 historical Rev08 USD9764.5714 x 31.5 = THB307584; NOT a shipment rate",
  nextg:freeze({quoteNumber:NEXTG.quoteNumber,sourceUrl:"https://drive.google.com/file/d/"+NEXTG.sourceDriveId+"/view",
   quotedTotalUSD:NEXTG.quotedGrandTotal,quoteValidTo:"2026-10-01",
   quotedDeliveryTerm:"DAP Ranong, Thailand",isDDPThailand:false,
   directChinaFreightQuoted:false,deliveryRerouteCreditTHB:null,
   approvedDirectToMgwNantong:true,approvedIdutoMgw:true,
   approvedOdutoMgw:true,approvedAllFiveAntennasToMgw:true,
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
   operation:"Install/mount Cisco and enclosure accessories in Thailand; reserve IDU interfaces for final MGW assembly",
   technicalRequirement:"Do not modify Ex-certified enclosure, penetrations or heat dissipation beyond approved GA/Ex documentation; retain serial/port and FAT photos",
   packedSetCount:4,
   inboundToMgwAcceptedOperationallyByOwner:true,
   chinaImporterProcedureCostQuoted:false}),
  sourceLegs:legs,scenarios,preferredScenarioId:scenarios[1].id,
  selectedPhysicalRouteId:scenarios[1].id,
  approvedMr0001InboundLotIds:freeze([
   "B6-MR1-NEXTG-IDU","B6-MR1-NEXTG-ODU",
   "B6-MR1-NEXTG-ANT","B6-MR1-TH-ENC-CISCO"
  ]),
  selectedAntennaBypassToJutal:false,
  ownerApprovedAntennaCount:5,
  approvedRoutingVsQuotedShippingSeparation:true,
  pendingNextgAmendedSupplierOffer:true,
  mr2to4CurrentDirection:"MGW procures vendor packages to China workshop; DO NOT route them to Thailand FAT in new workplan",
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
   "Obtain NextG written revised FCA/DAP MGW Nantong price, same SKU/quantity, freight credit versus expired DAP Ranong quote",
   "NextG must amend its expired DAP Ranong quotation to deliver the IDU/ODU and ALL five antennas to MGW Nantong; confirm freight credit/new charges and shipper/Incoterm",
   "Verify exact ODU/IDU and five-antenna SKU, diameter, mass, packaging, partial-shipment count, arrival window and factory ITP",
   "Keep all five antennas MGW-bound as owner-approved; do NOT route them direct to JUTAL without a NEW explicit owner decision",
   "Thai enclosure/Cisco preassembly GA, Ex/certification/thermal/grounding and customs export packing proof",
   "MGW incoming service/Incoterm/import duty/VAT/inspection fees by item; receiving feasible but not proof all costs included",
   "MGW existing SERV-5 USD2500 and SERV-3 USD500 possible packing overlap; no fabricated supplier credit",
   "Confirm no extra China/Thailand loop for MGW MR0002/0003/0004 and manifest scope of consolidated outbound freight"
  ])
 });
}
