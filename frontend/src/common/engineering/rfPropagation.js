// GENESS COMMON RF-PROP executable functions. Implements existing library.js equations.
// Preliminary free-space calculations ONLY; not ITU-R P.530 availability/sea-path/OEM proof.
const valid = x => typeof x === "number" && Number.isFinite(x);
const result=(equation,value,inputs,evidence)=>({kernelId:"RF-PROP",equation,status:"PRELIMINARY_CALCULATED",value,inputs,evidence});
const pending=(equation,missing)=>({kernelId:"RF-PROP",equation,status:"OPEN_INPUT",value:null,missing});
export function freeSpacePathLoss({frequencyMHz,distanceKm,evidence}) {
 const missing=[];
 if(!valid(frequencyMHz)||frequencyMHz<=0) missing.push("frequencyMHz (>0)");
 if(!valid(distanceKm)||distanceKm<=0) missing.push("distanceKm (>0)");
 if(!evidence?.sourceId) missing.push("evidence.sourceId");
 if(missing.length) return pending("FSPL(dB) = 32.44 + 20log10(f_MHz) + 20log10(d_km)",missing);
 return result("FSPL(dB) = 32.44 + 20log10(f_MHz) + 20log10(d_km)",32.44+20*Math.log10(frequencyMHz)+20*Math.log10(distanceKm),{frequencyMHz,distanceKm},evidence);
}
export function fresnelRadius({frequencyMHz,d1Km,d2Km,evidence}) {
 const missing=[];
 for(const k of ["frequencyMHz","d1Km","d2Km"]) { const v=({frequencyMHz,d1Km,d2Km})[k];if(!valid(v)||v<=0) missing.push(k+" (>0)");}
 if(!evidence?.sourceId) missing.push("evidence.sourceId");
 if(missing.length) return pending("F1 = sqrt(lambda*d1*d2/(d1+d2))",missing);
 const lambda=299792458/(frequencyMHz*1e6),a=d1Km*1000,b=d2Km*1000;
 return result("F1 = sqrt(lambda*d1*d2/(d1+d2))",Math.sqrt(lambda*a*b/(a+b)),{frequencyMHz,d1Km,d2Km},evidence);
}
export function preliminaryLinkBalance({txPowerDbm,txGainDbi,rxGainDbi,otherLossDb,rxThresholdDbm,frequencyMHz,distanceKm,evidence}) {
 const fspl=freeSpacePathLoss({frequencyMHz,distanceKm,evidence});
 const missing=fspl.status==="OPEN_INPUT"?fspl.missing.slice():[];
 const values={txPowerDbm,txGainDbi,rxGainDbi,otherLossDb,rxThresholdDbm};
 for(const [k,v] of Object.entries(values)) if(!valid(v)) missing.push(k);
 if(valid(otherLossDb)&&otherLossDb<0) missing.push("otherLossDb (>=0)");
 if(missing.length) return {kernelId:"RF-PROP",status:"OPEN_INPUT",receivedDbm:null,fadeMarginDb:null,missing};
 const receivedDbm=txPowerDbm+txGainDbi+rxGainDbi-fspl.value-otherLossDb;
 return {kernelId:"RF-PROP",status:"PRELIMINARY_CALCULATED",fsplDb:fspl.value,receivedDbm,fadeMarginDb:receivedDbm-rxThresholdDbm,evidence,
  assumptions:["Free-space only","Other losses must explicitly include feeder/connector/system losses","No rain fading, multipath, interference, path profile, availability or PTTEP compliance conclusion"],
  oemState:"OEM_REVIEW_PENDING"};
}
