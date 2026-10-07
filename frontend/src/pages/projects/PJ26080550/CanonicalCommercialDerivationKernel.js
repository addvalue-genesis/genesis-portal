/*
CANONICAL COMMERCIAL DERIVATION KERNEL

COMMON / GENERIC reusable algorithms only.
No PJ2608-0550 source facts, vendor names, price-line codes, system tokens,
or project-specific fallback assumptions are allowed in this module.

Project adapters are responsible for:
- PARTICULAR source/evidence classification,
- line/system/product mapping,
- project-specific fallback facts,
- equation/product/vendor selection policy.

The kernel is responsible for deterministic commercial-layer resolution,
run-state classification and trace construction.
*/

export function finiteCanonicalValue(value){
  return value!==null
    && value!==undefined
    && value!==""
    && Number.isFinite(Number(value));
}

export function convertCanonicalAmount(value,fromCurrency,toCurrency,fxConverter){
  if(!finiteCanonicalValue(value)) return null;
  const from=String(fromCurrency||toCurrency||"THB").toUpperCase();
  const to=String(toCurrency||from).toUpperCase();
  if(from===to) return Number(value);
  if(typeof fxConverter!=="function") return null;
  const converted=fxConverter(Number(value),from,to);
  return finiteCanonicalValue(converted) ? Number(converted) : null;
}

export function amountFromCanonicalCostRow(row,targetCurrency,fxConverter){
  if(!row) return null;
  if(finiteCanonicalValue(row.amount)){
    return convertCanonicalAmount(row.amount,row.currency||"THB",targetCurrency,fxConverter);
  }
  if(finiteCanonicalValue(row.amountThb)){
    return convertCanonicalAmount(row.amountThb,"THB",targetCurrency,fxConverter);
  }
  return null;
}

export function amountFromCanonicalBinding(row,targetCurrency,fxConverter){
  if(!finiteCanonicalValue(row?.allocated_amount)) return null;
  return convertCanonicalAmount(
    row.allocated_amount,
    row.binding_currency||row.cost_currency||"THB",
    targetCurrency,
    fxConverter
  );
}

export function amountFromCanonicalLayer(layer,targetCurrency,fxConverter){
  if(!layer || !finiteCanonicalValue(layer.amount)) return null;
  return convertCanonicalAmount(
    layer.amount,
    layer.currency||targetCurrency,
    targetCurrency,
    fxConverter
  );
}

export function sumFiniteCanonicalValues(values=[]){
  const finiteValues=values.filter(finiteCanonicalValue).map(Number);
  return finiteValues.length
    ? finiteValues.reduce((total,value)=>total+value,0)
    : null;
}

export function resolveCanonicalInternalCost({
  dbInternalCost,
  bindingInternalCost,
  fallbackInternalCost,
  dbState="CONTROLLED",
  bindingState="KNOWN PARTIAL COST · CANONICAL COST BINDINGS",
  fallbackState="KNOWN PARTIAL COST",
  dbOrigin="LIVE_DB_PRICE_LAYER",
  bindingOrigin="LIVE_DB_COST_BINDING",
  fallbackOrigin="CONTROLLED_FALLBACK"
}={}){
  if(finiteCanonicalValue(dbInternalCost)){
    return {
      value:Number(dbInternalCost),
      state:dbState,
      origin:dbOrigin,
      resolution:"DB_INTERNAL_COST"
    };
  }
  if(finiteCanonicalValue(bindingInternalCost)){
    return {
      value:Number(bindingInternalCost),
      state:bindingState,
      origin:bindingOrigin,
      resolution:"COST_BINDING_SUM"
    };
  }
  if(finiteCanonicalValue(fallbackInternalCost)){
    return {
      value:Number(fallbackInternalCost),
      state:fallbackState,
      origin:fallbackOrigin,
      resolution:"CONTROLLED_FALLBACK"
    };
  }
  return {
    value:null,
    state:"TBC",
    origin:"UNRESOLVED",
    resolution:"TBC"
  };
}

export function classifyCanonicalDerivationState({
  calculationRuns=[],
  equationBindings=[]
}={}){
  const staleRuns=calculationRuns.filter(
    row=>Number(row?.stale_flag)===1
      || String(row?.result_state||"").toUpperCase()==="STALE"
  );
  const blockedRuns=calculationRuns.filter(
    row=>["TBC","BLOCKED","ERROR"].includes(String(row?.result_state||"").toUpperCase())
  );

  const state=staleRuns.length
    ? "STALE / RECALCULATE"
    : blockedRuns.length
      ? "BLOCKED / TBC INPUT"
      : calculationRuns.length
        ? "DERIVED / CURRENT"
        : equationBindings.length
          ? "BOUND / RUN TBC"
          : "FALLBACK / BINDING TBC";

  return {state,staleRuns,blockedRuns};
}

export function buildCanonicalCommercialTrace({
  sourceState="TBC",
  sourceDetail="Source classification",
  particularBound=false,
  particularDetail="Particular binding TBC",
  genericBound=false,
  genericDetail="Common/generic binding TBC",
  derivationState="FALLBACK / BINDING TBC",
  derivationDetail="No current derivation run",
  internalCostState="TBC",
  internalCostKnown=false,
  workingSellState="TBC",
  releaseState="HOLD"
}={}){
  return [
    {
      stage:"SOURCE_EVIDENCE",
      state:sourceState,
      detail:sourceDetail
    },
    {
      stage:"PARTICULAR_STATE",
      state:particularBound?"BOUND":"PARTIAL",
      detail:particularDetail
    },
    {
      stage:"COMMON_GENERIC_BINDING",
      state:genericBound?"BOUND":"TBC",
      detail:genericDetail
    },
    {
      stage:"DERIVATION_RUN",
      state:derivationState,
      detail:derivationDetail
    },
    {
      stage:"INTERNAL_COST",
      state:internalCostState,
      detail:internalCostKnown
        ?"Known/derived amount available"
        :"Completion cost remains TBC"
    },
    {
      stage:"COMMERCIAL_TREATMENT",
      state:workingSellState,
      detail:"Working sell is an internal management state only"
    },
    {
      stage:"RELEASE",
      state:releaseState,
      detail:releaseState==="AUTHORISED"
        ?"Customer release authorised"
        :"Released customer output remains HOLD"
    }
  ];
}

export const CANONICAL_COMMERCIAL_DERIVATION_RULES = Object.freeze([
  "SOURCE/PARTICULAR facts are project-owned; COMMON/GENERIC algorithms are reusable.",
  "TBC/HOLD must never be coerced to zero.",
  "A stale derivation outranks a current amount for release-readiness decisions.",
  "A generic kernel never selects project vendor/product/source facts by itself.",
  "Released sell is a separate authorised semantic layer; it is not copied from working sell implicitly."
]);
