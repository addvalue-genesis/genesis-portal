import Decimal from "decimal.js";
import {roundMoney0550} from "./money0550";
const FX=Decimal.clone({precision:40});
const positive=n=>typeof n==="number"&&Number.isFinite(n)&&n>0&&n<=1e12;
export function prepareFxBasis0550(fx,mode="THB_PER_EUR",usdPerEUR=null){
 if(!["THB_PER_EUR","USD_PER_EUR"].includes(mode))throw Error("Unknown FX entry direction");
 for(const key of ["thbPerUSD","thbPerEUR"])if(fx[key]!==null&&!positive(fx[key]))throw Error("FX ต้องมากกว่า 0 และไม่เกิน 1e12 / "+key);
 if(mode==="THB_PER_EUR")return {...fx};
 if(!positive(fx.thbPerUSD)||!positive(usdPerEUR))throw Error("ระบุ THB per USD และ USD per EUR มากกว่า 0 เพื่อคำนวณ cross rate");
 const thbPerEUR=new FX(fx.thbPerUSD).times(usdPerEUR).toNumber();
 if(!positive(thbPerEUR))throw Error("Cross rate เกินช่วงที่รองรับ");
 const note=`Cross rate: 1 EUR = ${usdPerEUR} USD; 1 USD = ${fx.thbPerUSD} THB; 1 EUR = ${thbPerEUR} THB.`;
 const source=[fx.source.split("\n").filter(s=>!s.startsWith("Cross rate:")).join("\n").trim(),note].filter(Boolean).join("\n");
 if(source.length>4000)throw Error("FX source ต้องไม่เกิน 4000 ตัวอักษร");
 return {...fx,thbPerEUR,source};
}
export function previewEurConversion0550(eur,fx){
 if(typeof eur!=="number"||!Number.isFinite(eur)||eur<0||!positive(fx.thbPerEUR))return {thb:null,usd:null};
 const thb=roundMoney0550(new FX(eur).times(fx.thbPerEUR).toNumber());
 const usd=thb!==null&&positive(fx.thbPerUSD)?roundMoney0550(new FX(thb).div(fx.thbPerUSD).toNumber()):null;
 return {thb,usd};
}
