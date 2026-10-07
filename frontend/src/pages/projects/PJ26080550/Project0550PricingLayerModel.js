/*
PJ2608-0550 — PARTICULAR FOUR-LAYER PRICING ADAPTER

COMMON / GENERIC price-layer semantics live in CanonicalPricingLayerKernel.js.
This adapter owns only PJ2608-0550 fallback/source mapping and exposes the
existing 0550 API used by 7.1 and 7.0.
*/

import { PROJECT0550_PRICING_BASELINE } from "./Project0550PricingBaseline";
import { vendorOfferForPriceLine } from "./Project0550VendorOfferRegister";
import {
  CANONICAL_PRICE_LAYER_TYPES,
  buildCanonicalPriceLayerMap,
  canonicalPriceLayer,
  firstCanonicalCurrencyAmount,
  knownCanonicalAmount,
  liveCanonicalPriceLayerMap,
  mergeCanonicalPriceLayers,
  projectCanonicalLayerToLine
} from "./CanonicalPricingLayerKernel";

export const PROJECT0550_PRICE_LAYER_TYPES = CANONICAL_PRICE_LAYER_TYPES;

export function fallbackPriceLayersForLine(lineCode,line={}){
  const vendor=vendorOfferForPriceLine(lineCode);
  const sourceCurrency=vendor?.currency || line.sourceCurrency || null;

  const sourceFromVendor=knownCanonicalAmount(vendor?.quotedFinal)
    ? {amount:Number(vendor.quotedFinal),currency:vendor.currency}
    : /VENDOR_COST_INPUT/i.test(String(line.priceRole||""))
      ? firstCanonicalCurrencyAmount(
          line.subtotalByCurrency||line.unitPriceByCurrency,
          sourceCurrency
        )
      : {amount:null,currency:sourceCurrency};

  let working=knownCanonicalAmount(line?.workingSellAmount)
    ? {
        amount:Number(line.workingSellAmount),
        currency:line.workingSellCurrency||sourceCurrency
      }
    : firstCanonicalCurrencyAmount(
        line.subtotalByCurrency||line.unitPriceByCurrency,
        sourceCurrency
      );

  // PARTICULAR 0550 exception:
  // PAGA keeps the current controlled indicative sell snapshot until live
  // canonical derivation closes the complete project cost.
  if(lineCode==="A1-05"){
    working={
      amount:PROJECT0550_PRICING_BASELINE.paga.indicativeKnownCostSellEur,
      currency:"EUR"
    };
  }else if(/VENDOR_COST_INPUT/i.test(String(line.priceRole||""))){
    working={amount:null,currency:sourceCurrency};
  }

  const released=firstCanonicalCurrencyAmount(
    line.releasedSellByCurrency||{},
    line.releasedSellCurrency||sourceCurrency
  );
  const releasedState=
    knownCanonicalAmount(released.amount)
    && /AUTHORISED|RELEASED|APPROVED/i.test(String(line.releasedSellState||""))
      ? "AUTHORISED"
      : "HOLD";

  return {
    lineCode,
    SOURCE_COST:canonicalPriceLayer("SOURCE_COST",{
      amount:sourceFromVendor.amount,
      currency:sourceFromVendor.currency,
      state:Number.isFinite(sourceFromVendor.amount)?"CONTROLLED":"TBC",
      basis:vendor
        ? vendor.vendor+" · "+vendor.quoteRef
        : "No isolated current vendor/source cost bound",
      origin:"CONTROLLED_SOURCE_SNAPSHOT"
    }),
    INTERNAL_COST:canonicalPriceLayer("INTERNAL_COST",{
      amount:null,
      currency:sourceCurrency,
      state:"TBC",
      basis:"Complete internal cost is not inferred from vendor cost or working sell. Close equipment/bulk/work/lifecycle/common/risk cost first."
    }),
    WORKING_SELL:canonicalPriceLayer("WORKING_SELL",{
      amount:working.amount,
      currency:working.currency,
      state:Number.isFinite(working.amount)?"WORKING":"TBC",
      basis:lineCode==="A1-05"
        ? PROJECT0550_PRICING_BASELINE.paga.sellControlNote
        : (line.internalTrace||line.state||"Controlled working price baseline; not customer-authorised.")
    }),
    RELEASED_SELL:canonicalPriceLayer("RELEASED_SELL",{
      amount:released.amount,
      currency:released.currency,
      state:releasedState,
      basis:releasedState==="AUTHORISED"
        ? "Authorised customer selling price"
        : "No authorised customer sell layer. Customer output must remain HOLD/TBC."
    })
  };
}

// Compatibility export used by existing 0550 callers.
export function livePriceLayerMap(rows=[]){
  return liveCanonicalPriceLayerMap(rows);
}

export function priceLayersForLine(lineCode,line={},liveRows=[]){
  const fallback=fallbackPriceLayersForLine(lineCode,line);
  const live=liveCanonicalPriceLayerMap(liveRows)?.[lineCode]||{};
  return mergeCanonicalPriceLayers(fallback,live);
}

export function buildPriceLayerMap(lines={},liveRows=[]){
  return buildCanonicalPriceLayerMap({
    lines,
    liveRows,
    fallbackFactory:fallbackPriceLayersForLine
  });
}

export function workingPreviewLines(lines={},liveRows=[]){
  const layers=buildPriceLayerMap(lines,liveRows);
  const out={};
  for(const [code,line] of Object.entries(lines||{})){
    out[code]=projectCanonicalLayerToLine({
      line,
      layer:layers[code]?.WORKING_SELL,
      layerType:"WORKING_SELL",
      fallbackCurrency:"USD"
    });
    if(out[code].includeInKnownCustomerSubtotal){
      out[code].internalTrace=
        "7.0 Working Preview consumes the same WORKING_SELL semantic layer shown in 7.1. It is not a customer-authorised offer.";
    }
  }
  return out;
}

export function releasedCustomerLines(lines={},liveRows=[]){
  const layers=buildPriceLayerMap(lines,liveRows);
  const out={};
  for(const [code,line] of Object.entries(lines||{})){
    out[code]=projectCanonicalLayerToLine({
      line,
      layer:layers[code]?.RELEASED_SELL,
      layerType:"RELEASED_SELL",
      fallbackCurrency:"USD"
    });
  }
  return out;
}
