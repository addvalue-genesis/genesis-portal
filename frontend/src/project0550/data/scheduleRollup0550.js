import {displayPriceCheck0550,sumMoney0550} from './money0550';
export function scheduleBindingTHB0550(binding){
 const amount=binding.nonAdditive?null:binding.line?.customerTHB??null;
 return {...binding,amount,unitPrice:displayPriceCheck0550(amount,binding.quantity).unitPrice};
}

// Only the screen consumes this projection. USD still governs document completeness.
export function scheduleViewTHB0550(view){
 const bindings=view.bindings.map(scheduleBindingTHB0550);
 const total=(treatment,usd)=>Number.isFinite(usd)?sumMoney0550(bindings.filter(b=>b.line&&b.treatment===treatment&&!b.nonAdditive).map(b=>b.amount)):null;
 return {...view,bindings,scheduleRows:id=>view.scheduleRows(id).map(scheduleBindingTHB0550),
  baseAssigned:total('BASE',view.baseAssigned),optionsAssigned:total('OPTION',view.optionsAssigned)};
}

// A preparation subtotal never supplies a missing amount or authorizes a total.
export function scheduleRollup0550(rows){
 const owners=[...new Map(rows.filter(r=>!r.nonAdditive).map(r=>[r.lineId||r.id,r])).values()];
 const priced=owners.filter(r=>Number.isFinite(r.amount)),open=owners.filter(r=>!Number.isFinite(r.amount));
 return {knownUSD:sumMoney0550(priced.map(r=>r.amount)),totalUSD:owners.length&&!open.length?sumMoney0550(priced.map(r=>r.amount)):null,priced:priced.length,open:open.length,count:owners.length,openIds:open.map(r=>r.lineId||r.id)};
}
export const rollupNote0550=r=>r.open?`KNOWN SUBTOTAL ONLY: ${r.priced}/${r.count} priced; ${r.open} OPEN. Not a complete scope price.`:'';
