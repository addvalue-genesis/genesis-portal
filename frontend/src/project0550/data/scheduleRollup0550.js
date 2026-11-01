import {sumMoney0550} from './money0550';
// A preparation subtotal never supplies a missing amount or authorizes a total.
export function scheduleRollup0550(rows){
 const owners=[...new Map(rows.filter(r=>!r.nonAdditive).map(r=>[r.lineId||r.id,r])).values()];
 const priced=owners.filter(r=>Number.isFinite(r.amount)),open=owners.filter(r=>!Number.isFinite(r.amount));
 return {knownUSD:sumMoney0550(priced.map(r=>r.amount)),totalUSD:owners.length&&!open.length?sumMoney0550(priced.map(r=>r.amount)):null,priced:priced.length,open:open.length,count:owners.length,openIds:open.map(r=>r.lineId||r.id)};
}
export const rollupNote0550=r=>r.open?`KNOWN SUBTOTAL ONLY: ${r.priced}/${r.count} priced; ${r.open} OPEN. Not a complete scope price.`:'';
