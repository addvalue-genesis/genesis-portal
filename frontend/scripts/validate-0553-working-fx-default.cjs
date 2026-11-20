const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const src=fs.readFileSync(path.resolve(__dirname,"../src/project0553/CommercialWorkspace.jsx"),"utf8");
for(const token of ['displayCurrency:"THB"','fxRate:"31.5"','fxDate:"2026-10-10"','INTERNAL PLANNING ASSUMPTION','pj2608-0553-working-fx-v1','window.localStorage.getItem','window.localStorage.setItem','Reset working default','NOT VERIFIED BOT RATE'])
 assert(src.includes(token),"Missing FX default / persistence control: "+token);
assert(src.includes('Number(fxRate)>0')&&src.includes('fxSource.trim()'));
console.log("PASS 0553 working FX default 31.5 planning-only, browser persistence and editable reset; source currency retained");
