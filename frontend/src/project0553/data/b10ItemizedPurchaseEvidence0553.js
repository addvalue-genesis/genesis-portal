// PJ2608-0553 / B10 physical purchasing evidence, derived from original quoted SKU rows.
// Independent READ MODEL. It does not create a second price owner or treat a KIT as a SKU.
import NEXTG from "./quotes/NG-260916-ADV-DAP1.full.json";
import {selectSpareCustomerSchedule0553} from "./spareCustomerSchedule0553";
import {selectSpareCoverageEngineering0553} from "./spareCoverageEngineering0553";

const freeze=Object.freeze,round=n=>Math.round((n+Number.EPSILON)*100)/100;
const unique=xs=>[...new Set(xs)];
const CODES=freeze(["MR-0001","MR-0002","MR-0003","MR-0004"]);
const scopeForGroup=freeze({
 D:"BASE_STATION_SPARE_OFFER__SITE_STOCK_UNALLOCATED",
 E:"REMOTE_TERMINAL_SPARE_OFFER__SITE_STOCK_UNALLOCATED"
});
const classify=(part,desc)=>{
 const d=(part+" "+desc).toUpperCase();
 if(/WARRANTY/.test(d))return "WARRANTY_SERVICE__NOT_PHYSICAL_SPARE";
 if(/OPK-/.test(d))return "SOFTWARE_ENTITLEMENT__VERIFY_LICENSE_NOT_SPARE";
 if(/POWER CORD|PPT-B/.test(d))return "POWER_CORD__VERIFY_US_NA_COMPATIBILITY";
 if(/PS-DCDC|POE DC/.test(d))return "POWER_INJECTOR__POTENTIAL_B10_REPLACEABLE_ITEM";
 if(/FLK-MAR/.test(d))return "RF_FILTER__POTENTIAL_B10_REPLACEABLE_ITEM";
 if(/REGION/.test(d))return "REGION_LICENSE__NO_QUOTED_PRICE";
 return "RADIO_ASSEMBLY__POTENTIAL_C1_CAPITAL_NOT_AUTO_B10";
};
const linkInstalled=(coverage,family,group)=>{
 // Functional installed associations only. A quoted spare SKU is NOT verified
 // interchangeable with any of these actual TAGs or one-per-site demand.
 const radios=coverage.byMr["MR-0001"].filter(x=>/^(MR|ANT|SA|LAN)-/.test(x.tag));
 const relevant=family.startsWith("RF_FILTER")?radios.filter(x=>/^(MR|ANT|SA)-/.test(x.tag)):
  family.startsWith("POWER")||family.startsWith("SOFTWARE")||family.startsWith("REGION")||family.startsWith("RADIO")?
    radios.filter(x=>/^MR-/.test(x.tag)):[];
 return freeze(unique(relevant.map(x=>x.site+" / "+x.tag)));
};
export function selectB10ItemizedPurchaseEvidence0553(){
 const source=selectSpareCustomerSchedule0553(),coverage=selectSpareCoverageEngineering0553();
 const envelopes=source.currentByCode.B10;
 if(envelopes.length!==4||envelopes.reduce((a,x)=>a+x.qty,0)!==14||
  envelopes.reduce((a,x)=>a+x.extendedTHB,0)!==509827.5)
  throw Error("B10 budget envelope changed; item evidence cannot be silently posted");
 const supplierLines=NEXTG.lines.filter(x=>["D","E"].includes(x.group));
 if(supplierLines.length!==16||new Set(supplierLines.map(x=>x.code)).size!==16)
  throw Error("NextG D/E source offer row identity changed");
 const candidateRows=freeze(supplierLines.map(q=>{
  const f=classify(q.partNumber,q.description),isPhysical=/POTENTIAL_B10_REPLACEABLE_ITEM|POTENTIAL_C1_CAPITAL|POWER_CORD/.test(f);
  const quoted=Number.isFinite(q.unitPrice)&&Number.isFinite(q.quotedTotal);
  if(quoted&&Math.abs(round(q.qty*q.unitPrice)-q.quotedTotal)>0.011)
   throw Error("Supplier spare quote row arithmetic changed: "+q.code);
  return freeze({
   id:"B10-NG-"+q.code,sourceQuoteLine:q.code,sourceDocument:NEXTG.sourceDocument,
   quotation:NEXTG.quoteNumber,quotationDate:"2026-09-16",validUntil:"2026-10-01",
   vendor:"Next G Solution",mr:"MR-0001",sourceGroup:q.group,
   stockPool:"MR0001_"+q.group+"_SEPARATELY_QUOTED_STOCK",
   groupMeaning:scopeForGroup[q.group],
   articleDescription:q.description,manufacturer:"AVIAT / OEM model per quote",
   proposedSku:q.partNumber,quotedSkuVerified:true,
   selectedSpareSkuVerified:false,partAPriceOwner:"A1_INSTALLED_EQUIPMENT__NO_B10_ADDITION",
   candidateInstalledSiteTags:linkInstalled(coverage,f,q.group),
   installedTagRelation:"FUNCTIONAL_CANDIDATE_ONLY__NO_VENDOR_INTERCHANGEABILITY_PROOF",
   articleClass:f,physicalPurchaseCandidate:isPhysical,
   // The offered quantity is not the customer-required B10 SPIR quantity.
   vendorOfferedQty:q.qty,requiredSpareQty:null,selectedPurchaseQty:null,
   quotedUnitPriceUSD:quoted?q.unitPrice:null,quotedExtendedUSD:quoted?q.quotedTotal:null,
   quoteCurrency:"USD",quotePricingState:q.pricingState,
   referenceUnitTHB:quoted?round(q.unitPrice*31.5):null,
   quotedSupplierCostIsCurrent:false,verifiedDirectCostTHB:null,
   customerUnitSellTHB:null,customerExtendedSellTHB:null,
   sourceScopeDriver:"B10 MR0001 1 kit per four platforms; vendor D/E separate spare offer does not allocate between these kits",
   requiredSpecificationProof:"MR0001 C1 Att.5 SPIR part number, installed OEM configuration, licence/rating, vendor included quantity, 4-platform commissioning stock basis",
   potentialCategoryConflict:/CAPITAL|SOFTWARE|WARRANTY/.test(f)?"C1/B11/Part A applicability; do not post as B10 automatically":"A1 included OEM equipment and C2 operating stock exclusion",
   status:!quoted?"VENDOR_DASH__PRICE_UNKNOWN":isPhysical?
     "EXPIRED_VENDOR_SPARE_SKU_PRICE__B10_QTY_AND_CATEGORY_HOLD":
     "SEPARATELY_QUOTED_SERVICE_OR_ENTITLEMENT__NOT_B10_PHYSICAL_STOCK",
   sourceOwner:"EVIDENCE_ONLY_NONPOSTING",countedInB10WorkingSell:false,
   countedInA1:false,countedInC1:false,countedInC2:false,
   releaseAllowed:false
  });
 }));
 // Reference 9 historical physical-family names separately; do not map their
 // historical quantities/rates to new 2026 OEM SKUs or sell twice.
 const legacy=freeze(source.sparePriceEvidence.byCode.B10.map(x=>freeze({
  id:x.id,description:x.name,historicalQty:x.historicalQty,
  historicalUnitUSD:x.historicalUnitUSD,requiredSpareQty:null,
  oemSku:null,approvedUnitPrice:null,
  status:"REV08_GENERIC_CANDIDATE__NOT_PURCHASE_AUTHORIZED",postingAllowed:false
 })));
 const quoteTotalUSD=round(candidateRows.reduce((a,x)=>a+(x.quotedExtendedUSD||0),0));
 const quoteCostAtPlanningFxTHB=round(quoteTotalUSD*31.5);
 const b10ReferenceCostTHB=round(509827.5/1.30);
 if(quoteTotalUSD!==28819.71||quoteCostAtPlanningFxTHB!==907820.87)
  throw Error("D/E quote complete amount or historical FX comparison changed");
 const duplicatedSkus=freeze(unique(candidateRows.map(x=>x.proposedSku).filter(s=>
  candidateRows.filter(x=>x.proposedSku===s).length>1)));
 return freeze({
  moduleId:"bid.budget.working.bc.b10.itemized-purchasing-evidence",
  costOwner:"B10",sourceModuleId:source.moduleId,
  sourceQuote:NEXTG.quoteNumber,sourceQuoteStatus:"EXPIRED_OCT_01_2026",
  supplierRows:candidateRows,supplierQuotedCount:candidateRows.filter(x=>x.quotedExtendedUSD!==null).length,
  supplierUnpricedCount:candidateRows.filter(x=>x.quotedExtendedUSD===null).length,
  relatedInstalledTagsVerifiedFromMto:true,
  relatedInstalledTagsAreCompatibleSpareSkus:false,
  quotedOfferedQtyIsPurchaseQty:false,
  quotedSpareGroupUSD:quoteTotalUSD,quotedSpareGroupTHB:quoteCostAtPlanningFxTHB,
  originalB10WorkingSellTHB:509827.5,originalB10ReferenceCostTHB:b10ReferenceCostTHB,
  costComparisonExceedsEnvelope:quoteCostAtPlanningFxTHB>b10ReferenceCostTHB,
  repeatedSkusAcrossSpareGroups:duplicatedSkus,
  legacyCandidates:legacy,
  budgetEnvelopeRows:freeze(envelopes.map(x=>freeze({id:x.id,mr:x.linkedMR[0],
    locations:x.linkedLocations,contractKitCount:x.qty,
    workingUnitSellTHB:x.unitPriceTHB,workingTotalSellTHB:x.extendedTHB,
    physicalStockContentsVerified:false,selectedOemSparePartsCount:0}))),
  unquotedOtherMrCodes:freeze(CODES.slice(1)),
  noVerifiedPhysicalPurchaseLine:true,
  sourceToWorkingReconciled:true,postingAllowed:false,
  releaseAllowed:false,changeToSelectedB10SellTHB:0,
  releaseStatement:"Customer cannot order physical B10 parts solely from four kit lines. D/E supplier SKU evidence is separately quoted/expired, does not establish required B10 item quantity, and exceeds the existing 14-kit engineering allowance."
 });
}
