// PJ2608-0553 B10 — shared original native/customer-preview article schedule.
// 14 engineering commissioning-spare *functions* from MR Attachment 5.
// Business-facing Specification/Materials contain ONLY product descriptions.
// Amounts are transparent, nonposting equal-function budgetary allocations of
// the four CURRENT 10.2 MR kit Working SELL envelopes, NOT OEM SKU quotes.
import {selectB10StageSpareSelection0553} from "./b10StageSpareSelection0553";
import {selectB10ItemizedPurchaseEvidence0553} from "./b10ItemizedPurchaseEvidence0553";
import {selectB10BudgetaryFunctionalAllocation0553} from "./b10BudgetaryFunctionalAllocation0553";
const freeze=Object.freeze;
const spec=freeze({
 "B10-PTTEP-01-F01":freeze({spec:"Replaceable protective fuse set for SCADA radio indoor power interfaces and Layer 3 network equipment; to match installed fuse ratings and form factors.",material:"Electrical protection fuse cartridges and compatible fuse holders"}),
 "B10-PTTEP-01-F02":freeze({spec:"Industrial DC-to-PoE replacement power/interface assembly for the SCADA radio equipment; supply voltage, PoE rating and connection to match installed units.",material:"Industrial power conversion module, electrical terminals and mounting components"}),
 "B10-PTTEP-01-F03":freeze({spec:"Outdoor Ethernet surge-protection replacement assembly for SCADA data links; Ethernet interface, surge rating and mounting arrangement to match installed SA equipment.",material:"Surge protection element, industrial connector housing and mounting fittings"}),
 "B10-PTTEP-01-F04":freeze({spec:"RF filter / protection service assembly suitable for the installed SCADA radio operating band, antenna path, RF connector type and impedance.",material:"RF filter or surge-protection device with coaxial connectors"}),
 "B10-PTTEP-02-F01":freeze({spec:"Replaceable RF surge-protection or coupling assembly suitable for the installed trunk-radio RFI BDA system and Ex enclosure interfaces.",material:"RF surge/coupling module and matching coaxial connectors"}),
 "B10-PTTEP-02-F02":freeze({spec:"RF feeder cable-end termination and repair fittings suitable for the installed BDA antenna cable type, diameter and connector configuration.",material:"RF connectors, cable-end sealing and termination accessories"}),
 "B10-PTTEP-02-F03":freeze({spec:"Service seal and cable-entry replacement set suitable for the installed hazardous-area RFI BDA enclosure and cable entry sizes.",material:"Ex-rated gland fittings, gaskets, seals and washers"}),
 "B10-PTTEP-03-F01":freeze({spec:"Field-replaceable service component set for the installed explosion-proof SIP telephone assembly, maintaining the certified telephone configuration.",material:"Telephone service components, seals and associated fittings"}),
 "B10-PTTEP-03-F02":freeze({spec:"Replaceable component set for the installed hazardous-area audible sounder, matching its electrical supply rating and certified enclosure.",material:"Sounder service subassemblies, electrical terminals and seals"}),
 "B10-PTTEP-03-F03":freeze({spec:"Certified cable-gland and sealing replacements for the Ex IP telephone junction box, suitable for selected M20 entries and installed cable sizes.",material:"Ex-rated metal cable glands, sealing elements and stopping fittings"}),
 "B10-PTTEP-03-F04":freeze({spec:"CAT6A cable re-termination service materials for the IP telephone circuit, with cable compatibility and shielding maintained.",material:"Shielded CAT6A termination parts and cable protection accessories"}),
 "B10-PTTEP-04-F01":freeze({spec:"Replaceable protective fuse set for marine RACON control and power assemblies, matching installed fuse ratings and panel interfaces.",material:"Fuse cartridges and compatible fuse fittings"}),
 "B10-PTTEP-04-F02":freeze({spec:"Replacement cover gasket for the marine RACON control enclosure, preserving the installed ingress protection and hazardous-area enclosure rating.",material:"Enclosure gasket and compatible elastomeric sealing components"}),
 "B10-PTTEP-04-F03":freeze({spec:"Cable gland, entry seal and associated service fittings for the marine RACON Ex control enclosure, suited to installed cable diameters.",material:"Ex-rated metal glands, cable-entry seals and sealing washers"})
});
const stageNames=freeze({ERECTION:"Erection",PRE_COMMISSIONING:"Pre-commissioning",
 COMMISSIONING:"Commissioning",START_UP:"Start-up"});
export function selectB10NativeAnnexReview0553(){
 const selection=selectB10StageSpareSelection0553();
 const evidence=selectB10ItemizedPurchaseEvidence0553();
 const alloc=selectB10BudgetaryFunctionalAllocation0553();
 const sourceQuotes=new Map(evidence.supplierRows.map(x=>[x.id,x]));
 const allocated=new Map(alloc.rows.map(x=>[x.sourceSelectionId,x]));
 const rows=freeze(selection.stageRows.map(x=>{
  const technical=spec[x.id],money=allocated.get(x.id);
  if(!technical||!money||money.parentSourceId!==x.parentSourceId)
   throw Error("0553 B10 item lacks direct technical specification or 10.2 Working allocation: "+x.id);
  const vendorEvidence=(x.quotedSupplierSpareRows||[]).map(id=>{
   const q=sourceQuotes.get(id);if(!q)throw Error("B10 vendor offer reference changed "+id);
   return freeze({id:q.id,sourceQuoteLine:q.sourceQuoteLine,
    partNo:q.proposedSku,vendorOfferedQty:q.vendorOfferedQty,
    unitCostUSD:q.quotedUnitPriceUSD,quoteExpired:!q.quotedSupplierCostIsCurrent,
    selectedSpareSkuVerified:q.selectedSpareSkuVerified});
  });
  const stages=x.phaseApplicability.map(s=>stageNames[s]);
  const tags=x.installedEquipmentTagCandidates;
  return freeze({
   id:x.id,sourceId:x.id,parentSourceId:x.parentSourceId,
   sourceRowModuleId:x.sourceRowModuleId,traceId:x.traceId,
   mr:x.mr,item:x.id.replace(/^B10-PTTEP-(\d\d)-F(\d\d)$/,(_m,g,n)=>Number(g)+"."+n),
   tag:tags.length?tags.join("; "):x.mr+" / Radio or enclosure equipment group",
   description:x.requirementFunction,
   specification:technical.spec,materials:technical.material,
   originalItemSource:x.id,physicalStageNames:freeze(stages),
   proposedPartNo:vendorEvidence.length===1?vendorEvidence[0].partNo:null,
   sourceQuoteEvidence:freeze(vendorEvidence),why:x.engineeringJustification,
   // Budgetary allocation is a price breakdown of the financial package, not
   // physical spare Qty or individual OEM replacement SKU quote.
   presentationQty:money.quantity,presentationUnit:"LOT",
   budgetaryUnitPriceUSD:money.allocatedBudgetaryUnitUSD,
   budgetaryTotalUSD:money.allocatedBudgetaryTotalUSD,
   budgetarySourcePriceClass:money.priceClass,
   sourceKitCount:selection.commissioningSiteKits.find(z=>z.sourceId===x.parentSourceId)?.kits,
   physicalSpareQty:null,verifiedOemUnitUSD:null,
   b10PurchaseQty:null,b10UnitSellUSD:null,b10ExtendedSellUSD:null,
   sourceQuoteBasis:"WORKING_KIT_SELL_ENVELOPE__NONPOSTING_EQUAL_FUNCTION_ALLOCATION",
   customerIssueAllowed:false,selectedOemPartNo:null,approvedB10PartNo:false,
   isRequirementFamily:true,postingAllowed:false
  });
 }));
 if(rows.length!==14||new Set(rows.map(x=>x.id)).size!==14||
  rows.some(x=>!Number.isFinite(x.budgetaryUnitPriceUSD)||x.budgetaryUnitPriceUSD<=0||
   x.b10PurchaseQty!==null||x.b10UnitSellUSD!==null))
  throw Error("0553 original B10 14 function budget breakdown invalid");
 const sum=rows.reduce((a,x)=>a+x.budgetaryTotalUSD,0);
 if(Math.abs(sum-alloc.totalAllocatedUSD)>0.01)
  throw Error("0553 B10 itemized budget presentation not reconciled to selected Working");
 if(rows.some(x=>/PENDING|SPIR|INTERNAL|BUDGET|WORKING|PRICE/i.test(x.specification+" "+x.materials)))
  throw Error("0553 B10 customer Specification/Materials contains nontechnical internal text");
 return freeze({
  moduleId:"bid.budget.working.bc.b10.original-annex-item-map",
  sourceModuleId:selection.moduleId,
  originalSheet:"B10 CommSpares",layoutColumns:freeze(["B","C","D","E","F","G","H","I"]),
  dataFirstRow:6,originalDataCapacity:13,totalRow:6+rows.length,
  standardDocumentHeader:"ERECTION, PRECOMMISSIONNING, COMMISSIONNING, START UP SPARE PARTS LISTS",
  commercialOfferTerm:"CIF Zhuhai Port, China — proposed; purchaser deviation acceptance required",
  customerOriginalIncoterm:"DDP site (purchaser original)",
  rows,requiredPartFamilies:14,selectedMRKitQty:14,
  selectedMRKitWorkingSellTHB:alloc.original10_2WorkingSellTHB,
  budgetaryPresentationTotalUSD:alloc.totalAllocatedUSD,
  budgetaryPlanningFX:alloc.planningFxTHBPerUSD,
  budgetaryAllocationMethod:alloc.allocationMethod,
  sourceToReleaseParentIds:alloc.selectedFinancialSourceRows,
  b10CifUnitSellConfirmedCount:0,physicalSpareQtyConfirmedCount:0,
  sourceTotalIsB10Cost:false,customerReleaseAllowed:false,
  note:"14 functional budget allocations (1 LOT each) reconcile to 10.2 MR kit Working SELL, not OEM unit prices/physical spare quantities. Exact parts/CIF quotation require OEM SPIR."
 });
}
