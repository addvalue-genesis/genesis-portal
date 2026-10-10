// Currency presentation only. Never mutate source quote currency or treat an unverified FX as approved.
export function convertCommercialAmount(amount,source,target,fx){
 if(!Number.isFinite(amount))return {status:"OPEN_AMOUNT",amount:null};
 if(source===target)return {status:"ORIGINAL",amount,currency:target};
 if(!["USD","THB"].includes(source)||!["USD","THB"].includes(target))return {status:"UNSUPPORTED",amount:null};
 if(!fx||!Number.isFinite(fx.thbPerUsd)||fx.thbPerUsd<=0||!fx.source||!fx.date)return {status:"FX_SOURCE_REQUIRED",amount:null};
 return {status:"FX_DERIVED_PRELIMINARY",amount:source==="USD"?amount*fx.thbPerUsd:amount/fx.thbPerUsd,currency:target};
}
export function formatCommercialAmount(amount,source,target,fx){
 const v=convertCommercialAmount(amount,source,target,fx);
 return v.amount===null?"FX OPEN ("+source+")":target+" "+v.amount.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
}
