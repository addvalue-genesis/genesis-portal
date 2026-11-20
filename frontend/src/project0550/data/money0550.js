import Decimal from "decimal.js";

// Mutable 0550 only. Equations still produce Numbers: use their decimal
// representation here, without claiming to recover upstream precision loss.
const Money = Decimal.clone({precision:40, rounding:Decimal.ROUND_HALF_UP});
export const PRICING_POLICY_0550 = "0550-decimal-half-up-line-v1";
const valid = n => typeof n === "number" && Number.isFinite(n);
const rounded = n => {
 const result = n.toDecimalPlaces(2);
 return result.abs().times(100).lte(Number.MAX_SAFE_INTEGER) ? result.toNumber() : null;
};
export const roundMoney0550 = n => valid(n) ? rounded(new Money(n)) : null;
export const sumMoney0550 = values => values.length && values.every(valid)
 ? rounded(values.reduce((sum,value) => sum.plus(value),new Money(0))) : null;

// Diagnostic only: never adjust rate, quantity, FX or the customer template.
export function displayPriceCheck0550(total,quantity) {
 if (!valid(total) || !valid(quantity) || quantity<=0) return {unitPrice:null,recomputed:null,matches:false};
 const unitPrice = rounded(new Money(total).div(quantity));
 const recomputed = unitPrice===null ? null : rounded(new Money(unitPrice).times(quantity));
 return {unitPrice,recomputed,matches:recomputed!==null && new Money(recomputed).eq(total)};
}
