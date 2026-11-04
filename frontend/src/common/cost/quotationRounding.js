// COMMON commercial equations. Decimal strings/BigInt avoid binary rounding.
// Project adapters choose applicability; this file contains no project prices/FX.
export const QUOTATION_EQUATION_VERSION="quotation-rounding/1";
// preset-env can lower BigInt exponentiation to Math.pow, which rejects BigInt.
// Multiplication keeps this exact in both Node tests and the browser bundle.
const powersOfTen=[1n];
const pow=n=>{
 if(!Number.isInteger(n)||n<0)throw Error("Invalid decimal scale");
 for(let i=powersOfTen.length;i<=n;i++)powersOfTen.push(powersOfTen[i-1]*10n);
 return powersOfTen[n];
};
function decimal(value){
 if(typeof value==="number"&&(!Number.isFinite(value)||value<0||value>Number.MAX_SAFE_INTEGER))throw Error("Invalid nonnegative decimal");
 const s=String(value),m=s.match(/^(\d+)(?:\.(\d+))?$/);
 if(!m||s.length>100||(m[2]?.length||0)>18)throw Error("Expected nonnegative decimal, at most18 places");
 return {n:BigInt(m[1]+(m[2]||"")),scale:(m[2]||"").length};
}
function text(n,scale){
 const s=n.toString().padStart(scale+1,"0");
 return scale?(s.slice(0,-scale)+"."+s.slice(-scale)).replace(/\.?0+$/,"")||"0":s;
}
const at=(v,scale)=>v.n*pow(scale-v.scale);
export function roundUnitUp(value,increment){
 if(value===null)return null;
 const x=decimal(value),s=decimal(increment),scale=Math.max(x.scale,s.scale),step=at(s,scale),amount=at(x,scale);
 if(step===0n)throw Error("Rounding increment must be positive");
 return text(((amount+step-1n)/step)*step,scale);
}
export function quotedLineAmount(quantity,unitPrice,places=2){
 if(!Number.isInteger(places)||places<0||places>6)throw Error("Unsupported currency precision");
 const q=decimal(quantity),u=decimal(unitPrice),product=q.n*u.n,scale=q.scale+u.scale;
 const n=scale<=places?product*pow(places-scale):
  (product+pow(scale-places)/2n)/pow(scale-places); // nonnegative ROUND_HALF_UP
 return text(n,places);
}
export function allocateFixedParent(rows,target,increment){
 const t=decimal(target),s=decimal(increment),scale=Math.max(t.scale,s.scale),step=at(s,scale),total=at(t,scale);
 if(!step||total%step)throw Error("Fixed parent must be an exact increment multiple");
 if(!rows.length||new Set(rows.map(x=>x.id)).size!==rows.length||rows.some(x=>typeof x.id!=="string"||!x.id))throw Error("Unique stable line IDs required");
 const weights=rows.map(x=>{if(decimal(x.qty).n!==pow(decimal(x.qty).scale))throw Error("Fixed allocation requires quantity1");return decimal(x.weight);});
 const ws=Math.max(...weights.map(x=>x.scale)),w=weights.map(x=>at(x,ws)),sum=w.reduce((a,b)=>a+b,0n),units=total/step;
 if(!sum)throw Error("Positive allocation weight required");
 const shares=rows.map((r,i)=>({id:r.id,units:units*w[i]/sum,remainder:units*w[i]%sum}));
 const left=units-shares.reduce((n,r)=>n+r.units,0n);
 const order=[...shares].sort((a,b)=>a.remainder===b.remainder?(a.id<b.id?-1:a.id>b.id?1:0):a.remainder>b.remainder?-1:1);
 for(let i=0;i<Number(left);i++)order[i].units++;
 return shares.map(r=>({id:r.id,amount:text(r.units*step,scale)}));
}
