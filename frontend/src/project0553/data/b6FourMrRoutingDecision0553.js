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
 * A conditional antenna bypass requires an approved ITP allowing factory
 * RF terminations/dummy loads and OEM test evidence without every antenna.
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
 freeze({id:"B6-MR1-NEXTG-ANT",mr:"MR0001",cargo:"Antennas / dish / mount / RF accessories",sourceQtyBasis:"RQ2609-1182 greenfield antennas 5, NOT necessarily 4; approved link-budget SKU/diameter per site open",preferred:"Direct vendor-origin -> JUTAL yard ONLY if accepted by MGW/ITP; otherwise NextG -> MGW Nantong",fallback:"NextG DAP Ranong -> Thailand -> MGW Nantong -> JUTAL",selectedFreightCostTHB:null,postingAllowed:false}),
 freeze({id:"B6-MR1-TH-ENC-CISCO",mr:"MR0001",cargo:"Four enclosure + Cisco assemblies pre-mounted in Thailand, prepared for final IDU integration",sourceQtyBasis:"Project Owner four sets; Thai supplier delivery basis to verify by actual POs; not covered by NextG radio quote",preferred:"Thai workshop -> MGW Nantong one protected consolidated batch",fallback:"Thai enclosure/Cisco loose parts -> MGW Nantong for all assembly",selectedFreightCostTHB:null,postingAllowed:false}),
 freeze({id:"B6-MGW-MR234-INTERNAL",mr:"MR0002/MR0003/MR0004",cargo:"MGW-procured BDA / telephone + sounder / RACON vendor packages",sourceQtyBasis:"MGW P26-058_R2 equipment quote USD350341; no evidence of Thailand re-import for China FAT",preferred:"OEM/vendor -> MGW Nantong receiving / integration",fallback:"Supplier contracted origins and delivery Incoterms, not automatic Thailand routing",selectedFreightCostTHB:null,postingAllowed:false}),
 freeze({id:"B6-MGW-JUTAL-OUT",mr:"MR0001–MR0004 consolidated (scope to confirm)",cargo:"MGW Nantong -> JUTAL yard outbound road cargo",sourceQtyBasis:"One original supplier quote SERV-5 USD2500; MGW also quotes SERV-3 packing USD500",preferred:"MGW Nantong -> JUTAL nominated site as quoted",fallback:"Confirm source cargo manifest and exact consignee rather than invent extra trip",selectedFreightCostTHB:null,postingAllowed:false})
]);
const scenarios=freeze([
 freeze({id:"SC-B6-A-THAILAND-FULL",status:"COMPARISON_ONLY",label:"Full Thailand receiving/assembly, then ship ALL MR0001 equipment to Nantong",
  included:["NextG equipment via DAP Ranong","Thai enclosures + Cisco assembly","ODU/IDU/antenna China shipment"],
  additionalThailandTouchpoints:true,additionalChinaInboundTripsPotential:true,
  returnToThailandForFAT:false,workingSellTHB:null,verifiedDirectCostTHB:null,postingAllowed:false}),
 freeze({id:"SC-B6-B-HYBRID-MGW",status:"PREFERRED_NONPOSTING_FOR_RFQ",label:"NextG radios direct MGW; Thai enclosure+Cisco pre-mounted and shipped separately",
  included:["NextG IDU and ODU direct supplier-origin to MGW Nantong after quote change","Thai Cisco/enclosure bench-preassembly then one protected China inbound","Antenna direct JUTAL only with signed FAT bypass acceptance; otherwise MGW"],
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
  selectedB6WorkingSellTHB,
  workingSellAuthority:"10.2 historical Rev08 USD9764.5714 x 31.5 = THB307584; NOT a shipment rate",
  nextg:freeze({quoteNumber:NEXTG.quoteNumber,sourceUrl:"https://drive.google.com/file/d/"+NEXTG.sourceDriveId+"/view",
   quotedTotalUSD:NEXTG.quotedGrandTotal,quoteValidTo:"2026-10-01",
   quotedDeliveryTerm:"DAP Ranong, Thailand",isDDPThailand:false,
   directChinaFreightQuoted:false,deliveryRerouteCreditTHB:null,
   currentQuotationExpired:true,
   greenfieldRfQODU:4,greenfieldRfQIDU:4,greenfieldRfQAntenna:5}),
  mgw:freeze({quoteNumber:mgw.quoteNumber,quotedRoadFreightUSD:2500,quotedRoadFreightTHB:78750,
   quotedPackingUSD:500,chatPackingIncludedWithinFreight:true,
   confirmedPackingCreditUSD:null,freightPostingCount:0,
   sourceUrl:mgw.sourceUrl,
   quotedOutboundOwner:"VQ-MGW-SERV-5",outboundFreightScopeAllMRsConfirmed:false,
   quoteDestinationMismatch:"DAP Nantong vs separate road freight to JUTAL"}),
  siteAssembly:freeze({thaiPreassemblyAuthorizedByOwner:true,
   operation:"Install/mount Cisco and enclosure accessories in Thailand; reserve IDU interfaces for final MGW assembly",
   technicalRequirement:"Do not modify Ex-certified enclosure, penetrations or heat dissipation beyond approved GA/Ex documentation; retain serial/port and FAT photos",
   packedSetCount:4,
   inboundToMgwAcceptedOperationallyByOwner:true,
   chinaImporterProcedureCostQuoted:false}),
  sourceLegs:legs,scenarios,preferredScenarioId:scenarios[1].id,
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
   "Confirm ODU/IDU routing and exact 5 greenfield antenna packing SKUs/diameters; partial shipment acceptance",
   "Test plan: MGW required radio/IDU/ODU present for 100% FAT; separate antenna bypass only with OEM/client ITP approval",
   "Thai enclosure/Cisco preassembly GA, Ex/certification/thermal/grounding and customs export packing proof",
   "MGW incoming service/Incoterm/import duty/VAT/inspection fees by item; receiving feasible but not proof all costs included",
   "MGW existing SERV-5 USD2500 and SERV-3 USD500 possible packing overlap; no fabricated supplier credit",
   "Confirm no extra China/Thailand loop for MGW MR0002/0003/0004 and manifest scope of consolidated outbound freight"
  ])
 });
}
