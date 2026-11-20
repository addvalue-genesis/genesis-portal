// Integration contract only. No network calls, credentials, or live ERP dependencies.
// Project data remains controlled by frontend/src/project0553/data/repository.js.
export const ERP_INTEGRATION = Object.freeze({
  dolibarr: {state:"NOT_CONNECTED",mode:"READ_ONLY_FUTURE",enabled:false},
  agerp: {state:"NOT_CONNECTED",mode:"READ_ONLY_FUTURE",enabled:false}
});
export function normalizeExternalProduct(record) {
 if (!record || typeof record !== "object") throw new TypeError("Product record required");
 return {externalSystem:record.externalSystem||null,externalId:record.externalId||null,
  productRef:record.productRef||null,model:record.model||null,
  manufacturer:record.manufacturer||null,description:record.description||null,
  rawRevision:record.rawRevision||null};
}
export function getErpIntegrationStatus(){return ERP_INTEGRATION;}
export async function fetchErpProducts(){
 throw new Error("ERP_NOT_CONNECTED: configure an approved read-only adapter and mapping first");
}
