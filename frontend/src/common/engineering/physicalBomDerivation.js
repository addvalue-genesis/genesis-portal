// Generic physical BOM derivation. Quantities require evidence-backed topology/route.
// Existing 0553 EQ-002/003 and common RF feeder loss methods; no assumptions as facts.
const n=x=>typeof x==="number"&&Number.isFinite(x);
const open=(missing)=>({status:"OPEN_INPUT",value:null,missing});
export function deriveCable({routeM,verticalM,terminationM,spareM,routingFactor,lossDbPer100M,evidence}){
 const v={routeM,verticalM,terminationM,spareM,routingFactor,lossDbPer100M};
 const missing=Object.entries(v).filter(([k,x])=>!n(x)||x<0||(k==="routingFactor"&&x<1)).map(([k])=>k);
 if(!evidence?.sourceId)missing.push("evidence.sourceId");
 if(missing.length)return open(missing);
 const lengthM=routeM*routingFactor+verticalM+terminationM+spareM;
 return {status:"DERIVED_REVIEW",value:lengthM,lengthM,feederLossDb:lengthM*lossDbPer100M/100,source:evidence,equations:["OPTICAL-03","RF-PROP-02"],note:"Do not round to procurement reel sizes without supplier packing rules"};
}
export function deriveTerminationAccessories({cableRuns,terminationEndsPerRun,entriesPerCableEnd,connectorsPerEnd,spareGlandQuantity,evidence}){
 const v={cableRuns,terminationEndsPerRun,entriesPerCableEnd,connectorsPerEnd,spareGlandQuantity},missing=Object.entries(v).filter(([k,x])=>!Number.isInteger(x)||x<0).map(([k])=>k);
 if(!evidence?.sourceId)missing.push("evidence.sourceId");
 if(missing.length)return open(missing);
 const ends=cableRuns*terminationEndsPerRun;
 return {status:"DERIVED_REVIEW",value:{terminations:ends,connectors:ends*connectorsPerEnd,cableGlands:ends*entriesPerCableEnd+spareGlandQuantity},equation:"Q_accessory = Q_connected_end × fittings_per_end + verified_spares",source:evidence,
 note:"Only cable ends entering an enclosure need glands; topology/interface evidence determines entriesPerCableEnd"};
}
export function deriveEnclosureCapacity({equipmentDimensions,usableInsideDimensions,entryCount,certification,evidence}){
 const missing=[];if(!Array.isArray(equipmentDimensions)||!equipmentDimensions.length)missing.push("equipmentDimensions");
 if(!usableInsideDimensions)missing.push("usableInsideDimensions");if(!Number.isInteger(entryCount)||entryCount<0)missing.push("entryCount");
 if(!certification?.certificateId)missing.push("certification.certificateId");if(!evidence?.sourceId)missing.push("evidence.sourceId");
 if(missing.length)return open(missing);
 return {status:"ENGINEERING_REVIEW_REQUIRED",value:null,missing:["Manufacturer clearances, heat dissipation, gland spacing, Ex certificate and installation approval require detailed layout review"],
 note:"Bounding-box volume alone cannot establish compliant JB/Ex enclosure sizing"};
}
export function deriveInstalledAndPurchaseQty({facilityQuantities,spares,contingency,evidence}){
 const missing=[];
 if(!Array.isArray(facilityQuantities)||!facilityQuantities.length||facilityQuantities.some(x=>!Number.isInteger(x.quantity)||x.quantity<0||!x.facility))missing.push("facilityQuantities");
 if(!Number.isInteger(spares)||spares<0)missing.push("spares");
 if(!Number.isInteger(contingency)||contingency<0)missing.push("contingency");
 if(!evidence?.sourceId)missing.push("evidence.sourceId");
 if(missing.length)return open(missing);
 const installed=facilityQuantities.reduce((v,x)=>v+x.quantity,0);
 return {status:"DERIVED_REVIEW",value:{installed,purchase:installed+spares+contingency},equations:["EQ-002","EQ-003"],source:evidence};
}
