// Vendor-neutral cascade noise and gain calculation (Friis, linear noise factors).
// Does not substitute OEM coverage/intermodulation verification.
const ok=x=>typeof x==="number"&&Number.isFinite(x);
const missing=names=>({status:"OPEN_INPUT",value:null,missing:names});
export function calculateLnaReceiveChain({frequencyMHz,bandMinMHz,bandMaxMHz,preLnaLossDb,lnaGainDb,lnaNoiseFigureDb,postLnaLossDb,receiverNoiseFigureDb,evidence}){
 const v={frequencyMHz,bandMinMHz,bandMaxMHz,preLnaLossDb,lnaGainDb,lnaNoiseFigureDb,postLnaLossDb,receiverNoiseFigureDb};
 const absent=Object.entries(v).filter(([k,x])=>!ok(x)).map(([k])=>k);
 if(!evidence?.sourceId)absent.push("evidence.sourceId");
 if(absent.length)return missing(absent);
 if(frequencyMHz<=0||bandMinMHz<=0||bandMaxMHz<bandMinMHz||preLnaLossDb<0||postLnaLossDb<0||lnaNoiseFigureDb<0||receiverNoiseFigureDb<0) return missing(["valid frequency, band and nonnegative loss / NF inputs"]);
 if(frequencyMHz<bandMinMHz||frequencyMHz>bandMaxMHz)return {status:"BAND_MISMATCH",value:null,frequencyMHz,bandMinMHz,bandMaxMHz,evidence};
 const db=val=>Math.pow(10,val/10),log=val=>10*Math.log10(val);
 const stages=[
  {name:"Pre-LNA feeder/filter",gain:1/db(preLnaLossDb),noise:db(preLnaLossDb)},
  {name:"LNA",gain:db(lnaGainDb),noise:db(lnaNoiseFigureDb)},
  {name:"Post-LNA feeder/filter",gain:1/db(postLnaLossDb),noise:db(postLnaLossDb)},
  {name:"Receiver",gain:1,noise:db(receiverNoiseFigureDb)}
 ];
 let F=1,gainBefore=1;
 for(let i=0;i<stages.length;i++){const p=stages[i];F+=(p.noise-1)/gainBefore;gainBefore*=p.gain;}
 const withoutLnaDb=preLnaLossDb+postLnaLossDb+receiverNoiseFigureDb;
 const totalGainDb=lnaGainDb-preLnaLossDb-postLnaLossDb;
 return {status:"PRELIMINARY_CALCULATED",formula:"Ftotal=F1+(F2-1)/G1+... (Friis linear noise factors)",
  value:log(F),systemNoiseFigureDb:log(F),withoutLnaNoiseFigureDb:withoutLnaDb,
  noiseFigureImprovementDb:withoutLnaDb-log(F),totalGainDb,lnaInputEquivalentGainDb:lnaGainDb-preLnaLossDb,
  evidence,limits:["NF requires actual receiver/filter/cable data","High gain may overload receiver; verify blocking, AGC, dynamic range and intermodulation",
  "Output power/OIP3 alone do not prove system linearity","LNA in the RECEIVE chain only; transmitter power and coverage are not increased by this calculation"]};
}
export function deriveLnaSetting({maxGainDb,attenuationDb,evidence}){
 if(!ok(maxGainDb)||!ok(attenuationDb)||attenuationDb<0||attenuationDb>31||!Number.isInteger(attenuationDb)||!evidence?.sourceId)return missing(["maxGainDb","attenuationDb 0..31 integer","evidence.sourceId"]);
 return {status:"VENDOR_RATED_GAIN_SETTING",value:maxGainDb-attenuationDb,evidence};
}
