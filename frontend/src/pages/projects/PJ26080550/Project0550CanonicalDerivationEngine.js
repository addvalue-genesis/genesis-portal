/*
PJ2608-0550 — PARTICULAR CANONICAL DERIVATION ADAPTER

Role
----
Bind PJ2608-0550 PARTICULAR state to the reusable COMMON/GENERIC commercial
derivation kernel.

This module may know:
- 0550 commercial lines / system groups,
- 0550 source classification,
- 0550 controlled fallback audit snapshots,
- 0550 price-layer selectors.

This module must not duplicate generic derivation algorithms.
*/

import { convertFx } from "./Project0550FxControl";
import { auditForPriceLine } from "./Project0550A1PriceAudit";
import { classifyProject0550PriceLine } from "./Project0550PriceSourceModel";
import { priceLayersForLine } from "./Project0550PricingLayerModel";
import { commercialGroupForLine } from "./Project0550CommercialModel";
import {
  amountFromCanonicalBinding,
  amountFromCanonicalCostRow,
  amountFromCanonicalLayer,
  buildCanonicalCommercialTrace,
  classifyCanonicalDerivationState,
  convertCanonicalAmount,
  finiteCanonicalValue,
  resolveCanonicalInternalCost,
  sumFiniteCanonicalValues
} from "./CanonicalCommercialDerivationKernel";

export function convertControlledAmount(value,fromCurrency,toCurrency){
  return convertCanonicalAmount(value,fromCurrency,toCurrency,convertFx);
}

function fallbackCostBasis(audit,targetCurrency){
  if(!audit){
    return {value:null,label:"COST TBC",basis:"No explicit controlled cost row",origin:"CONTROLLED_FALLBACK"};
  }
  if(finiteCanonicalValue(audit.commercialPreview?.knownSelectedCostEur)){
    return {
      value:convertControlledAmount(audit.commercialPreview.knownSelectedCostEur,"EUR",targetCurrency),
      label:"KNOWN SELECTED COST",
      basis:"Controlled selected vendor cost; open completion cost remains separate",
      origin:"CONTROLLED_FALLBACK"
    };
  }
  const priority=[/^CONTROLLED COST$/i,/^KNOWN SELECTED COST$/i,/^KNOWN PROCURED COST$/i,/^RAW MARKET COST$/i];
  for(const pattern of priority){
    const row=(audit.buildUp||[]).find(item=>pattern.test(String(item.priceClass||"")));
    const value=amountFromCanonicalCostRow(row,targetCurrency,convertFx);
    if(Number.isFinite(value)){
      return {value,label:row.priceClass,basis:row.item||audit.basis,origin:"CONTROLLED_FALLBACK"};
    }
  }
  return {value:null,label:"COST TBC",basis:audit.basis||"No explicit controlled cost row",origin:"CONTROLLED_FALLBACK"};
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
  // PARTICULAR selectors / controlled facts.
  const group=commercialGroupForLine(lineCode);
  const audit=auditForPriceLine(lineCode);
  const sourceInfo=classifyProject0550PriceLine(lineCode,line);
  const keys=systemKeys(lineCode);

  const costBindings=(canonicalData.costPriceBindings||[]).filter(row=>row.line_code===lineCode);
  const liveKnownInternalCost=sumFiniteCanonicalValues(
    costBindings.map(row=>amountFromCanonicalBinding(row,currency,convertFx))
  );
  const fallback=fallbackCostBasis(audit,currency);
  const layers=priceLayersForLine(lineCode,line,canonicalData.priceLayers||[]);

  // COMMON / GENERIC amount resolution.
  const sourceCost=amountFromCanonicalLayer(layers.SOURCE_COST,currency,convertFx);
  const dbInternalCost=amountFromCanonicalLayer(layers.INTERNAL_COST,currency,convertFx);
  const workingSell=amountFromCanonicalLayer(layers.WORKING_SELL,currency,convertFx);
  const releasedSell=amountFromCanonicalLayer(layers.RELEASED_SELL,currency,convertFx);

  const internalCostResolution=resolveCanonicalInternalCost({
    dbInternalCost,
    bindingInternalCost:liveKnownInternalCost,
    fallbackInternalCost:fallback.value,
    dbState:layers.INTERNAL_COST?.state||"CONTROLLED",
    fallbackState:Number.isFinite(fallback.value) ? "KNOWN PARTIAL COST · "+fallback.label : "TBC",
    fallbackOrigin:fallback.origin
  });

  // PARTICULAR relationship filtering over canonical DB state.
  const derivation=canonicalData.derivationState||{};
  const equationBindings=(derivation.equationBindings||[]).filter(row=>rowMatchesLineOrSystem(row,lineCode,keys));
  const calculationRuns=(derivation.calculationRuns||[]).filter(row=>rowMatchesLineOrSystem(row,lineCode,keys));
  const productOfferItems=(derivation.productOfferItems||[]).filter(row=>rowMatchesLineOrSystem(row,lineCode,keys));

  // COMMON / GENERIC run-state semantics.
  const runState=classifyCanonicalDerivationState({calculationRuns,equationBindings});
  const derivationState=runState.state;
  const staleRuns=runState.staleRuns;
  const blockedRuns=runState.blockedRuns;

  const detailRows=costBindings.length
    ? costBindings.map(row=>({
        className:row.cost_category||"COST",
        item:row.cost_description,
        amount:amountFromCanonicalBinding(row,currency,convertFx),
        state:row.binding_state||row.cost_status||"TBC",
        source:row.binding_code,
        origin:"LIVE_DB"
      }))
    : (audit?.buildUp||[]).map(row=>({
        className:row.priceClass,
        item:row.item,
        amount:amountFromCanonicalCostRow(row,currency,convertFx),
        amountText:row.amountText,
        state:row.note||"",
        source:"CONTROLLED CODE SNAPSHOT",
        origin:"CONTROLLED_FALLBACK"
      }));

  const internalCost=internalCostResolution.value;
  const internalCostState=internalCostResolution.state;
  const releaseState=layers.RELEASED_SELL?.state||"HOLD";
  const lineState=releaseState==="AUTHORISED" ? "AUTHORISED CUSTOMER SELL" : (line.state||"HOLD / WORKING");

  const derivationTrace=buildCanonicalCommercialTrace({
    sourceState:sourceInfo?.status||line.state||"TBC",
    sourceDetail:sourceInfo?.short||"Source classification",
    particularBound:Boolean(productOfferItems.length||costBindings.length),
    particularDetail:String(productOfferItems.length)+" product-bound offer item(s) · "+String(costBindings.length)+" cost-price binding(s)",
    genericBound:Boolean(equationBindings.length),
    genericDetail:String(equationBindings.length)+" equation binding(s)",
    derivationState,
    derivationDetail:String(calculationRuns.length)+" current run(s) · "+String(staleRuns.length)+" stale · "+String(blockedRuns.length)+" blocked/TBC",
    internalCostState,
    internalCostKnown:Number.isFinite(internalCost),
    workingSellState:layers.WORKING_SELL?.state||"TBC",
    releaseState
  });

  return {
    lineCode,
    currency,
    group,
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
      internalCost:internalCostResolution.origin,
      workingSell:layers.WORKING_SELL?.origin||"CONTROLLED_FALLBACK",
      releasedSell:layers.RELEASED_SELL?.origin||"CONTROLLED_FALLBACK"
    },
    resolution:{internalCost:internalCostResolution.resolution},
    costBindings,
    detailRows,
    equationBindings,
    calculationRuns,
    productOfferItems,
    staleRuns,
    blockedRuns,
    openItems:line.openItems||[],
    derivationTrace
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
    lineCode,
    line:lines?.[lineCode]||{},
    canonicalData,
    currency
  }));
  return {
    rows,
    summary:{
      rows:rows.length,
      stale:rows.filter(row=>row.staleRuns.length).length,
      blocked:rows.filter(row=>row.blockedRuns.length).length,
      released:rows.filter(row=>row.states.releasedSell==="AUTHORISED").length,
      derivationArchitecture:canonicalData.derivationState?.architectureStatus||"CONTROLLED_FALLBACK"
    }
  };
}

export const PROJECT0550_DERIVATION_ARCHITECTURE = {
  id:"PJ2608-0550-CANONICAL-DERIVATION-SPINE-REV01",
  commonGenericKernel:"CanonicalCommercialDerivationKernel.js",
  particularAdapter:"Project0550CanonicalDerivationEngine.js",
  flow:[
    "SOURCE / EVIDENCE",
    "PARTICULAR CANONICAL STATE",
    "COMMON / GENERIC EQUATION + ALGORITHM BINDING",
    "DERIVATION / RECONCILIATION ENGINE",
    "CANONICAL COST / PRICE LAYERS",
    "7.1 MANAGEMENT ANALYSIS WORKBENCH",
    "MANAGEMENT RELEASE",
    "7.0 WORKING PREVIEW / RELEASED CUSTOMER OUTPUT"
  ],
  rules:[
    "React UI does not own engineering or pricing math.",
    "COMMON/GENERIC derivation algorithms must not contain PJ2608-0550 facts.",
    "New quote/datasheet evidence updates PARTICULAR state first.",
    "Same OEM model across different sellers maps to one canonical product identity; offer price/terms stay offer-specific.",
    "Particular findings can become COMMON/GENERIC only through reviewed promotion and a new controlled method version.",
    "Source revision/change propagates through etm_trace_edges and marks dependent derivations/projections stale before release."
  ]
};
