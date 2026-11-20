// COMMON preliminary flat-sea two-ray geometry; no claim of Pathloss 5 equivalence.
// Source elevations and tide heights must use the SAME vertical datum.
const number=x=>typeof x==="number"&&Number.isFinite(x);
const pending=missing=>({status:"OPEN_INPUT",value:null,missing});
export function assessSeaReflection({distanceKm,frequencyMHz,txElevationM,rxElevationM,tideElevationM,evidence}){
 const p={distanceKm,frequencyMHz,txElevationM,rxElevationM,tideElevationM};
 const missing=Object.entries(p).filter(([k,v])=>!number(v)||((k==="distanceKm"||k==="frequencyMHz")&&v<=0)).map(([k])=>k);
 if(!evidence?.sourceId)missing.push("evidence.sourceId");
 if(missing.length)return pending(missing);
 const txHeightM=txElevationM-tideElevationM,rxHeightM=rxElevationM-tideElevationM;
 if(txHeightM<=0||rxHeightM<=0)return pending(["antennas above tide waterline (both >0 m)"]);
 const d=distanceKm*1000,lambda=299792458/(frequencyMHz*1e6);
 const directLengthM=Math.hypot(d,txHeightM-rxHeightM);
 const reflectedLengthM=Math.hypot(d,txHeightM+rxHeightM);
 const pathDifferenceM=reflectedLengthM-directLengthM;
 const reflectionPointFromTxM=d*txHeightM/(txHeightM+rxHeightM);
 return {status:"PRELIMINARY_GEOMETRY_ONLY",kernelId:"RF-PROP",txHeightM,rxHeightM,directLengthM,reflectedLengthM,pathDifferenceM,reflectionPointFromTxM,
 phaseDifferenceDeg:(360*pathDifferenceM/lambda)%360,evidence,
 limitations:["Flat-earth specular reflection geometry only","No Earth curvature, refraction/k-factor, wave surface roughness or ducting","No reflection coefficient, polarization or received fading prediction","No path profile, obstruction analysis or antenna pattern","Requires Pathloss 5/OEM analysis and engineering approval"]};
}
export function assessTideScenarios({distanceKm,frequencyMHz,txElevationM,rxElevationM,tideScenarios,evidence}){
 if(!Array.isArray(tideScenarios)||tideScenarios.length===0)return {status:"OPEN_INPUT",missing:["tideScenarios"],scenarios:[]};
 const scenarios=tideScenarios.map(s=>({name:s.name,datum:s.datum||null,...assessSeaReflection({distanceKm,frequencyMHz,txElevationM,rxElevationM,tideElevationM:s.tideElevationM,evidence})}));
 return {status:scenarios.every(s=>s.status==="PRELIMINARY_GEOMETRY_ONLY")?"PRELIMINARY_GEOMETRY_ONLY":"OPEN_INPUT",scenarios,
  note:"Each tide elevation must use the same verified vertical datum as the antenna elevations."};
}
