/*
PJ2608-0550 — FOUR-LAYER PRICING MODEL

Canonical semantic layers:
1 SOURCE_COST   = vendor / procurement source cost as quoted.
2 INTERNAL_COST = complete controlled cost before commercial sell policy.
3 WORKING_SELL  = internal management / budgetary / target sell; not customer-released.
4 RELEASED_SELL = authorised customer selling price only.

7.1 may show all four layers. 7.0 may consume RELEASED_SELL only.
Unknown layers stay TBC/HOLD; values are never copied across semantic layers just to fill a blank.
*/

import { PROJECT0550_PRICING_BASELINE } from "./Project0550PricingBaseline";
import { vendorOfferForPriceLine } from "./Project0550VendorOfferRegister";

export const PROJECT0550_PRICE_LAYER_TYPES = ["SOURCE_COST","INTERNAL_COST","WORKING_SELL","RELEASED_SELL"];

function firstFiniteCurrency(map={},preferred){
  const order=[preferred,"THB","EUR","USD","CNY"].filter(Boolean);
  for(const currency of [...new Set(order)]){
    const value=map?.[currency];
    if(Number.isFinite(Number(value))) return {amount:Number(value),currency};
  }
  return {amount:null,currency:preferred||null};
}

function layer(type,{amount=null,currency=null,state="TBC",basis="",origin="CONTROLLED_FALLBACK"}={}){
  return {layerType:type,amount,currency,state,basis,origin};
}

export function fallbackPriceLayersForLine(lineCode,line={}){
  const vendor=vendorOfferForPriceLine(lineCode);
  const sourceCurrency=vendor?.currency || line.sourceCurrency || null;
  const sourceFromVendor=Number.isFinite(Number(vendor?.quotedFinal))
    ? {amount:Number(vendor.quotedFinal),currency:vendor.currency}
    : /VENDOR_COST_INPUT/i.test(String(line.priceRole||""))
      ? firstFiniteCurrency(line.subtotalByCurrency||line.unitPriceByCurrency,sourceCurrency)
      : {amount:null,currency:sourceCurrency};

  let working=Number.isFinite(Number(line?.workingSellAmount))
    ? {amount:Number(line.workingSellAmount),currency:line.workingSellCurrency||sourceCurrency}
    : firstFiniteCurrency(line.subtotalByCurrency||line.unitPriceByCurrency,sourceCurrency);

  if(lineCode==="A1-05"){
    working={amount:PROJECT0550_PRICING_BASELINE.paga.indicativeKnownCostSellEur,currency:"EUR"};
  } else if(/VENDOR_COST_INPUT/i.test(String(line.priceRole||""))){
    working={amount:null,currency:sourceCurrency};
  }

  const releasedMap=line.releasedSellByCurrency||{};
  const released=firstFiniteCurrency(releasedMap,line.releasedSellCurrency||sourceCurrency);
  const releasedState=Number.isFinite(released.amount) && /AUTHORISED|RELEASED|APPROVED/i.test(String(line.releasedSellState||"")) ? "AUTHORISED" : "HOLD";

  return {
    lineCode,
    SOURCE_COST:layer("SOURCE_COST",{
      amount:sourceFromVendor.amount,currency:sourceFromVendor.currency,
      state:Number.isFinite(sourceFromVendor.amount)?"CONTROLLED":"TBC",
      basis:vendor ? vendor.vendor+" · "+vendor.quoteRef : "No isolated current vendor/source cost bound",
      origin:"CONTROLLED_SOURCE_SNAPSHOT"
    }),
    INTERNAL_COST:layer("INTERNAL_COST",{
      amount:null,currency:sourceCurrency,state:"TBC",
      basis:"Complete internal cost is not inferred from vendor cost or working sell. Close equipment/bulk/work/lifecycle/common/risk cost first."
    }),
    WORKING_SELL:layer("WORKING_SELL",{
      amount:working.amount,currency:working.currency,state:Number.isFinite(working.amount)?"WORKING":"TBC",
      basis:lineCode==="A1-05" ? PROJECT0550_PRICING_BASELINE.paga.sellControlNote : (line.internalTrace||line.state||"Controlled working price baseline; not customer-authorised.")
    }),
    RELEASED_SELL:layer("RELEASED_SELL",{
      amount:released.amount,currency:released.currency,state:releasedState,
      basis:releasedState==="AUTHORISED" ? "Authorised customer selling price" : "No authorised customer sell layer. Customer output must remain HOLD/TBC."
    })
  };
}

export function livePriceLayerMap(rows=[]){
  const map={};
  for(const row of rows||[]){
    const code=row.line_code;
    const type=row.layer_type;
    if(!code||!type) continue;
    map[code] ||= {};
    if(map[code][type]) continue;
    map[code][type]={
      layerType:type,
      amount:row.amount===null||row.amount===undefined?null:Number(row.amount),
      currency:row.currency||null,state:row.layer_state||"TBC",basis:row.basis_text||"",
      revision:row.revision_no||null,origin:"LIVE_DB"
    };
  }
  return map;
}

export function priceLayersForLine(lineCode,line={},liveRows=[]){
  const fallback=fallbackPriceLayersForLine(lineCode,line);
  const live=livePriceLayerMap(liveRows)?.[lineCode]||{};
  const result={...fallback};
  for(const type of PROJECT0550_PRICE_LAYER_TYPES) result[type]=live[type]||fallback[type];
  return result;
}

export function buildPriceLayerMap(lines={},liveRows=[]){
  const out={};
  for(const [code,line] of Object.entries(lines||{})) out[code]=priceLayersForLine(code,line,liveRows);
  return out;
}

export function workingPreviewLines(lines={},liveRows=[]){
  const layers=buildPriceLayerMap(lines,liveRows);
  const out={};
  for(const [code,line] of Object.entries(lines||{})){
    const working=layers[code]?.WORKING_SELL;
    const known=working && Number.isFinite(Number(working.amount));
    const currency=working?.currency||line.sourceCurrency||"USD";
    out[code]={
      ...line,
      unitPriceByCurrency:known?{[currency]:Number(working.amount)}:{},
      subtotalByCurrency:known?{[currency]:Number(working.amount)}:{},
      sourceCurrency:currency,
      state:known
        ? "INTERNAL WORKING PREVIEW · "+String(working.state||"WORKING")
        : "TBC — WORKING SELL NOT DERIVED",
      priceRole:"WORKING_SELL_PROJECTION",
      includeInKnownCustomerSubtotal:known,
      internalTrace:known
        ? "7.0 Working Preview consumes the same WORKING_SELL semantic layer shown in 7.1. It is not a customer-authorised offer."
        : "No controlled WORKING_SELL amount is available. TBC remains visible and is not replaced by source cost or zero."
    };
  }
  return out;
}

export function releasedCustomerLines(lines={},liveRows=[]){
  const layers=buildPriceLayerMap(lines,liveRows);
  const out={};
  for(const [code,line] of Object.entries(lines||{})){
    const released=layers[code]?.RELEASED_SELL;
    const authorised=released && released.state==="AUTHORISED" && Number.isFinite(Number(released.amount));
    const currency=released?.currency||line.sourceCurrency||"USD";
    out[code]={
      ...line,
      unitPriceByCurrency:authorised?{[currency]:Number(released.amount)}:{},
      subtotalByCurrency:authorised?{[currency]:Number(released.amount)}:{},
      sourceCurrency:currency,
      state:authorised?"AUTHORISED CUSTOMER SELL":"HOLD — CUSTOMER SELL NOT RELEASED",
      priceRole:"RELEASED_SELL_ONLY",
      includeInKnownCustomerSubtotal:authorised,
      internalTrace:authorised ? "Customer output reads authorised RELEASED_SELL layer." : "No authorised RELEASED_SELL layer. Source cost / internal cost / working sell remain internal and are not substituted into customer output."
    };
  }
  return out;
}
