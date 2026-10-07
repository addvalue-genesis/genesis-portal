/*
PJ2608-0550 — CANONICAL DERIVATION ENGINE

Purpose
-------
Provide one deterministic processing layer between canonical DB/source state and
7.1/7.0 UI projections.

React components must not invent pricing logic. They ask this engine for:
Source Cost -> Internal Cost -> Working Sell -> Released Sell,
plus derivation/equation/product/recompute trace.

DB remains canonical truth when live. Controlled JS snapshots are compatibility
fallbacks only until migration/ingestion is complete.
*/

import { convertFx } from "./Project0550FxControl";
import { auditForPriceLine } from "./Project0550A1PriceAudit";
import { classifyProject0550PriceLine } from "./Project0550PriceSourceModel";
import { priceLayersForLine } from "./Project0550PricingLayerModel";
import { commercialGroupForLine } from "./Project0550CommercialModel";

function finite(value){
  return value!==null && value!==undefined && value!=="" && Number.isFinite(Number(value));
}

export function convertControlledAmount(value,fromCurrency,toCurrency){
  if(!finite(value)) return null;
  const from=String(fromCurrency||toCurrency||"THB").toUpperCase();
  const to=String(toCurrency||from).toUpperCase();
  return from===to ? Number(value) : convertFx(Number(value),from,to);
}

function amountFromBuildRow(row,targetCurrency){
  if(!row) return null;
  if(finite(row.amount)) return convertControlledAmount(row.amount,row.currency||"THB",targetCurrency);
  if(finite(row.amountThb)) return convertControlledAmount(row.amountThb,"THB",targetCurrency);
  return null;
}

function fallbackCostBasis(audit,targetCurrency){
  if(!audit) return {value:null,label:"COST TBC",basis:"No explicit controlled cost row",origin:"CONTROLLED_FALLBACK"};
  if(finite(audit.commercialPreview?.knownSelectedCostEur)){
    return {
      value:convertControlledAmount(audit.commercialPreview.knownSelectedCostEur,"EUR",targetCurrency),
      label:"KNOWN SELECTED COST",
      basis:"Controlled selected vendor cost; open completion cost remains separate",
      origin:"CONTROLLED_FALLBACK"
    };
  }
  const priority=[/^CONTROLLED COST$/i,/^KNOWN SELECTED COST$/i,/^KNOWN PROCURED COST$/i,/^RAW MARKET COST$/i];
  for(const pattern of priority){
    const row=(audit.buildUp||[]).find(x=>pattern.test(String(x.priceClass||"")));
    const value=amountFromBuildRow(row,targetCurrency);
    if(Number.isFinite(value)){
      return {value,label:row.priceClass,basis:row.item||audit.basis,origin:"CONTROLLED_FALLBACK"};
    }
  }
  return {value:null,label:"COST TBC",basis:audit.basis||"No explicit controlled cost row",origin:"CONTROLLED_FALLBACK"};
}

function bindingAmount(row,targetCurrency){
  if(!finite(row?.allocated_amount)) return null;
  return convertControlledAmount(
    row.allocated_amount,
    row.binding_currency||row.cost_currency||"THB",
    targetCurrency
  );
}

function layerAmount(layer,targetCurrency){
  if(!layer || !finite(layer.amount)) return null;
  return convertControlledAmount(layer.amount,layer.currency||targetCurrency,targetCurrency);
}

function systemKeys(lineCode){
  const group=commercialGroupForLine(lineCode);
  const keys=new Set();
  for(const token of group?.systemTokens||[]){
    keys.add(String(token).toUpperCase());
    keys.add(String(token).replace(/^TEL-/i,"").toUpperCase());
  }
  return keys;
}

function rowMatchesLineOrSystem(row,lineCode,keys){
  const lc=String(row?.line_code||row?.price_line_code||row?.target_object_ref||"").toUpperCase();
  const sc=String(row?.system_code||row?.system_token||"").toUpperCase();
  if(lc===String(lineCode).toUpperCase()) return true;
  return keys.has(sc);
}

export function deriveProject0550CommercialLine({
  lineCode,
  line={},
  canonicalData={},
  currency="USD"
}={}){
  const audit=auditForPriceLine(lineCode);
  const sourceInfo=classifyProject0550PriceLine(lineCode,line);
  const keys=systemKeys(lineCode);

  const costBindings=(canonicalData.costPriceBindings||[]).filter(x=>x.line_code===lineCode);
  const liveCostValues=costBindings.map(x=>bindingAmount(x,currency)).filter(Number.isFinite);
  const liveKnownInternalCost=liveCostValues.length ? liveCostValues.reduce((a,b)=>a+b,0) : null;
  const fallback=fallbackCostBasis(audit,currency);

  const layers=priceLayersForLine(lineCode,line,canonicalData.priceLayers||[]);
  const sourceCost=layerAmount(layers.SOURCE_COST,currency);
  const dbInternalCost=layerAmount(layers.INTERNAL_COST,currency);
  const internalCost=Number.isFinite(dbInternalCost)
    ? dbInternalCost
    : Number.isFinite(liveKnownInternalCost)
      ? liveKnownInternalCost
      : fallback.value;
  const workingSell=layerAmount(layers.WORKING_SELL,currency);
  const releasedSell=layerAmount(layers.RELEASED_SELL,currency);

  const derivation=canonicalData.derivationState||{};
  const equationBindings=(derivation.equationBindings||[]).filter(x=>rowMatchesLineOrSystem(x,lineCode,keys));
  const calculationRuns=(derivation.calculationRuns||[]).filter(x=>rowMatchesLineOrSystem(x,lineCode,keys));
  const productOfferItems=(derivation.productOfferItems||[]).filter(x=>rowMatchesLineOrSystem(x,lineCode,keys));

  const staleRuns=calculationRuns.filter(x=>Number(x.stale_flag)===1 || String(x.result_state||"").toUpperCase()==="STALE");
  const blockedRuns=calculationRuns.filter(x=>["TBC","BLOCKED","ERROR"].includes(String(x.result_state||"").toUpperCase()));

  const detailRows=costBindings.length
    ? costBindings.map(x=>({
        className:x.cost_category||"COST",
        item:x.cost_description,
        amount:bindingAmount(x,currency),
        state:x.binding_state||x.cost_status||"TBC",
        source:x.binding_code,
        origin:"LIVE_DB"
      }))
    : (audit?.buildUp||[]).map(x=>({
        className:x.priceClass,
        item:x.item,
        amount:amountFromBuildRow(x,currency),
        amountText:x.amountText,
        state:x.note||"",
        source:"CONTROLLED CODE SNAPSHOT",
        origin:"CONTROLLED_FALLBACK"
      }));

  const internalCostState=Number.isFinite(dbInternalCost)
    ? layers.INTERNAL_COST?.state||"CONTROLLED"
    : Number.isFinite(liveKnownInternalCost)
      ? "KNOWN PARTIAL COST · CANONICAL COST BINDINGS"
      : Number.isFinite(fallback.value)
        ? "KNOWN PARTIAL COST · "+fallback.label
        : "TBC";

  const releaseState=layers.RELEASED_SELL?.state||"HOLD";
  const lineState=releaseState==="AUTHORISED" ? "AUTHORISED CUSTOMER SELL" : (line.state||"HOLD / WORKING");
  const derivationState=staleRuns.length
    ? "STALE / RECALCULATE"
    : blockedRuns.length
      ? "BLOCKED / TBC INPUT"
      : calculationRuns.length
        ? "DERIVED / CURRENT"
        : equationBindings.length
          ? "BOUND / RUN TBC"
          : "FALLBACK / BINDING TBC";

  return {
    lineCode,
    currency,
    group:commercialGroupForLine(lineCode),
    sourceInfo,
    audit,
    priceLayers:layers,
    values:{sourceCost,internalCost,workingSell,releasedSell},
    states:{
      sourceCost:layers.SOURCE_COST?.state||"TBC",
      internalCost:internalCostState,
      workingSell:layers.WORKING_SELL?.state||"TBC",
      releasedSell:releaseState,
      line:lineState,
      derivation:derivationState
    },
    provenance:{
      sourceCost:layers.SOURCE_COST?.origin||"CONTROLLED_FALLBACK",
      internalCost:Number.isFinite(dbInternalCost)?"LIVE_DB_PRICE_LAYER":Number.isFinite(liveKnownInternalCost)?"LIVE_DB_COST_BINDING":fallback.origin,
      workingSell:layers.WORKING_SELL?.origin||"CONTROLLED_FALLBACK",
      releasedSell:layers.RELEASED_SELL?.origin||"CONTROLLED_FALLBACK"
    },
    costBindings,
    detailRows,
    equationBindings,
    calculationRuns,
    productOfferItems,
    staleRuns,
    blockedRuns,
    openItems:line.openItems||[],
    derivationTrace:[
      {stage:"SOURCE_EVIDENCE",state:sourceInfo?.status||line.state||"TBC",detail:sourceInfo?.short||"Source classification"},
      {stage:"PARTICULAR_STATE",state:productOfferItems.length||costBindings.length?"BOUND":"PARTIAL",detail:`${productOfferItems.length} product-bound offer item(s) · ${costBindings.length} cost-price binding(s)`},
      {stage:"COMMON_GENERIC_BINDING",state:equationBindings.length?"BOUND":"TBC",detail:`${equationBindings.length} equation binding(s)`},
      {stage:"DERIVATION_RUN",state:derivationState,detail:`${calculationRuns.length} current run(s) · ${staleRuns.length} stale · ${blockedRuns.length} blocked/TBC`},
      {stage:"INTERNAL_COST",state:internalCostState,detail:Number.isFinite(internalCost)?"Known/derived amount available":"Completion cost remains TBC"},
      {stage:"COMMERCIAL_TREATMENT",state:layers.WORKING_SELL?.state||"TBC",detail:"Working sell is internal management state only"},
      {stage:"RELEASE",state:releaseState,detail:releaseState==="AUTHORISED"?"Customer release authorised":"7.0 Released Customer Output remains HOLD"}
    ]
  };
}

export function deriveProject0550Portfolio({
  lines={},
  canonicalData={},
  currency="USD",
  lineCodes=[]
}={}){
  const codes=lineCodes.length ? lineCodes : Object.keys(lines||{});
  const rows=codes.map(lineCode=>deriveProject0550CommercialLine({
    lineCode,line:lines?.[lineCode]||{},canonicalData,currency
  }));
  return {
    rows,
    summary:{
      rows:rows.length,
      stale:rows.filter(x=>x.staleRuns.length).length,
      blocked:rows.filter(x=>x.blockedRuns.length).length,
      released:rows.filter(x=>x.states.releasedSell==="AUTHORISED").length,
      derivationArchitecture:canonicalData.derivationState?.architectureStatus||"CONTROLLED_FALLBACK"
    }
  };
}

export const PROJECT0550_DERIVATION_ARCHITECTURE = {
  id:"PJ2608-0550-CANONICAL-DERIVATION-SPINE-REV00",
  flow:[
    "SOURCE / EVIDENCE",
    "PARTICULAR CANONICAL STATE",
    "COMMON / GENERIC EQUATION BINDING",
    "DERIVATION / RECONCILIATION ENGINE",
    "CANONICAL COST / PRICE LAYERS",
    "7.1 MANAGEMENT ANALYSIS WORKBENCH",
    "MANAGEMENT RELEASE",
    "7.0 WORKING PREVIEW / RELEASED CUSTOMER OUTPUT"
  ],
  rules:[
    "React UI does not own engineering or pricing math.",
    "New quote/datasheet evidence updates PARTICULAR state first.",
    "Same OEM model across different sellers maps to one canonical product identity; offer price/terms stay offer-specific.",
    "Particular findings can become COMMON/GENERIC only through reviewed promotion and a new controlled method version.",
    "Source revision/change propagates through etm_trace_edges and marks dependent derivations/projections stale before release."
  ]
};
