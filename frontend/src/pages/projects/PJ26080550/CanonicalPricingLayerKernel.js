/*
CANONICAL PRICING LAYER KERNEL

COMMON / GENERIC pricing-layer semantics only.

Semantic layers:
1 SOURCE_COST
2 INTERNAL_COST
3 WORKING_SELL
4 RELEASED_SELL

This module must not contain project codes, price-line IDs, vendor names,
system tokens, or project-specific commercial assumptions.
*/

export const CANONICAL_PRICE_LAYER_TYPES = Object.freeze([
  "SOURCE_COST",
  "INTERNAL_COST",
  "WORKING_SELL",
  "RELEASED_SELL"
]);

export function knownCanonicalAmount(value){
  return value!==null
    && value!==undefined
    && value!==""
    && Number.isFinite(Number(value));
}

export function firstCanonicalCurrencyAmount(map={},preferred,currencyOrder=["THB","EUR","USD","CNY"]){
  const order=[preferred,...currencyOrder].filter(Boolean);
  for(const currency of [...new Set(order)]){
    const value=map?.[currency];
    if(knownCanonicalAmount(value)){
      return {amount:Number(value),currency};
    }
  }
  return {amount:null,currency:preferred||null};
}

export function canonicalPriceLayer(
  type,
  {amount=null,currency=null,state="TBC",basis="",origin="CONTROLLED_FALLBACK"}={}
){
  return {
    layerType:type,
    amount:knownCanonicalAmount(amount)?Number(amount):null,
    currency:currency||null,
    state,
    basis,
    origin
  };
}

export function liveCanonicalPriceLayerMap(rows=[]){
  const map={};
  for(const row of rows||[]){
    const code=row.line_code;
    const type=row.layer_type;
    if(!code || !CANONICAL_PRICE_LAYER_TYPES.includes(type)) continue;
    map[code] ||= {};
    if(map[code][type]) continue;
    map[code][type]=canonicalPriceLayer(type,{
      amount:row.amount,
      currency:row.currency||null,
      state:row.layer_state||"TBC",
      basis:row.basis_text||"",
      origin:"LIVE_DB"
    });
    map[code][type].revision=row.revision_no||null;
  }
  return map;
}

export function mergeCanonicalPriceLayers(fallbackLayers={},liveLayers={}){
  const result={...fallbackLayers};
  for(const type of CANONICAL_PRICE_LAYER_TYPES){
    result[type]=liveLayers?.[type] || fallbackLayers?.[type] || canonicalPriceLayer(type);
  }
  return result;
}

export function buildCanonicalPriceLayerMap({
  lines={},
  liveRows=[],
  fallbackFactory
}={}){
  const live=liveCanonicalPriceLayerMap(liveRows);
  const out={};
  for(const [code,line] of Object.entries(lines||{})){
    const fallback=typeof fallbackFactory==="function"
      ? fallbackFactory(code,line)
      : {};
    out[code]=mergeCanonicalPriceLayers(fallback,live?.[code]||{});
  }
  return out;
}

export function projectCanonicalLayerToLine({
  line={},
  layer,
  layerType,
  authorisedState="AUTHORISED",
  workingState="WORKING",
  fallbackCurrency="USD"
}={}){
  const currency=layer?.currency||line.sourceCurrency||fallbackCurrency;
  const known=knownCanonicalAmount(layer?.amount);
  const authorised=layerType==="RELEASED_SELL"
    ? known && String(layer?.state||"").toUpperCase()===authorisedState
    : known;

  const isReleased=layerType==="RELEASED_SELL";
  const include=authorised;

  return {
    ...line,
    unitPriceByCurrency:include?{[currency]:Number(layer.amount)}:{},
    subtotalByCurrency:include?{[currency]:Number(layer.amount)}:{},
    sourceCurrency:currency,
    state:isReleased
      ? (include?"AUTHORISED CUSTOMER SELL":"HOLD — CUSTOMER SELL NOT RELEASED")
      : (include
          ?"INTERNAL WORKING PREVIEW · "+String(layer?.state||workingState)
          :"TBC — WORKING SELL NOT DERIVED"),
    priceRole:isReleased?"RELEASED_SELL_ONLY":"WORKING_SELL_PROJECTION",
    includeInKnownCustomerSubtotal:include,
    internalTrace:isReleased
      ? (include
          ?"Customer output reads authorised RELEASED_SELL layer."
          :"No authorised RELEASED_SELL layer. Source cost / internal cost / working sell remain internal and are not substituted into customer output.")
      : (include
          ?"Working preview consumes the controlled WORKING_SELL semantic layer. It is not a customer-authorised offer."
          :"No controlled WORKING_SELL amount is available. TBC remains visible and is not replaced by source cost or zero.")
  };
}

export const CANONICAL_PRICING_LAYER_RULES = Object.freeze([
  "SOURCE_COST is source/procurement cost and must not be treated as customer sell.",
  "INTERNAL_COST is a distinct controlled layer and is not inferred merely to fill a blank.",
  "WORKING_SELL is internal management state and is not customer-authorised.",
  "RELEASED_SELL requires explicit authorisation.",
  "Unknown/TBC/HOLD values are never copied across layers and never coerced to zero."
]);
