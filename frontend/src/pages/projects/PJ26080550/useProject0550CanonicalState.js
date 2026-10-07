import { useEffect, useMemo, useState } from "react";

export function useProject0550CanonicalState(){
  const [data,setData]=useState(null);
  const [status,setStatus]=useState("LOADING");
  const [error,setError]=useState(null);

  useEffect(()=>{
    let active=true;
    fetch("/backend/api/etm/project-control-state.php?project=PJ2608-0550")
      .then(r=>{
        if(!r.ok) throw new Error("HTTP "+r.status);
        return r.json();
      })
      .then(async payload=>{
        if(!payload.ok) throw new Error(payload.message||payload.error||"Canonical-state API error");
        let bulkMto=[];
        let priceLayers=[];
        let vendorOfferControl=null;
        let derivationState=null;
        const [bulkResult,priceLayerResult,vendorOfferResult,derivationResult]=await Promise.allSettled([
          fetch("/backend/api/etm/bulk-state.php?project=PJ2608-0550&system=TEL-PAGA").then(async r=>r.ok?await r.json():null),
          fetch("/backend/api/etm/pricing-layers.php?project=PJ2608-0550").then(async r=>r.ok?await r.json():null),
          fetch("/backend/api/etm/vendor-offer-control.php?project=PJ2608-0550&system=PAGA").then(async r=>r.ok?await r.json():null),
          fetch("/backend/api/etm/derivation-state.php?project=PJ2608-0550").then(async r=>r.ok?await r.json():null)
        ]);
        if(bulkResult.status==="fulfilled" && bulkResult.value?.ok && Array.isArray(bulkResult.value.rows)){
          bulkMto=bulkResult.value.rows;
        }
        if(priceLayerResult.status==="fulfilled" && priceLayerResult.value?.ok && Array.isArray(priceLayerResult.value.rows)){
          priceLayers=priceLayerResult.value.rows;
        }
        if(vendorOfferResult.status==="fulfilled" && vendorOfferResult.value?.ok){
          vendorOfferControl=vendorOfferResult.value;
        }
        if(derivationResult.status==="fulfilled" && derivationResult.value?.ok){
          derivationState=derivationResult.value;
        }
        if(active){
          setData({...payload,bulkMto,priceLayers,vendorOfferControl,derivationState});
          setStatus("LIVE_DB");
          setError(null);
        }
      })
      .catch(err=>{
        if(active){
          setStatus("FALLBACK");
          setError(err);
        }
      });
    return ()=>{active=false;};
  },[]);

  const priceLineMap=useMemo(()=>{
    const map={};
    for(const row of data?.priceLines||[]) map[row.line_code]=row;
    return map;
  },[data]);

  const projectionMap=useMemo(()=>{
    const map={};
    for(const row of data?.projectionState||[]) map[row.module_id]=row;
    return map;
  },[data]);

  return {
    status,
    error,
    data,
    priceLineMap,
    projectionMap,
    isLive:status==="LIVE_DB"
  };
}

export function overlayControlledPriceLines(fallbackLines={},livePriceLineMap={}){
  const out={...fallbackLines};
  for(const [code,row] of Object.entries(livePriceLineMap||{})){
    const prior=out[code]||{};
    const currency=String(row.currency||"THB").toUpperCase();
    const unitPriceByCurrency={...(prior.unitPriceByCurrency||{})};
    const subtotalByCurrency={...(prior.subtotalByCurrency||{})};

    const unitRate=Number(row.unit_rate);
    const amount=Number(row.amount);
    if(Number.isFinite(unitRate)) unitPriceByCurrency[currency]=unitRate;
    if(Number.isFinite(amount)) subtotalByCurrency[currency]=amount;

    out[code]={
      ...prior,
      description:row.description||prior.description,
      qty:row.quantity ?? prior.qty,
      unit:row.unit||prior.unit,
      unitPriceByCurrency,
      subtotalByCurrency,
      state:row.cost_basis_status||prior.state,
      inclusionStatus:row.inclusion_status||prior.inclusionStatus,
      sourceCurrency:currency,
      liveDbRowId:row.id,
      dataOrigin:"LIVE_DB_CANONICAL_PRICE_SCHEDULE"
    };
  }
  return out;
}
