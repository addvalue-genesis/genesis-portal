// Same adapter boundary as 0550. No MariaDB/AGERP connection is claimed.
import manifest from "../snapshots/pj2608-0553.working.json";
import { PROJECT_0553_SNAPSHOT } from "../controlledSnapshot";
import { SUPPLIER_QUOTE_LINES_0553 } from "../supplierQuoteLines";
import { validateProject0553Dataset } from "../validateDataset";
let cache;
export const controlledSnapshotAdapter = {
 id:"controlled-json-snapshot",
 describe(){return {adapter:this.id,datasetId:manifest.meta.datasetId,projectCode:manifest.meta.projectCode,status:manifest.meta.status,integrationState:manifest.meta.integrationState};},
 load(){
  if(!cache) cache=validateProject0553Dataset({
   ...PROJECT_0553_SNAPSHOT,
   meta:manifest.meta,
   quoteReferences:manifest.quoteReferences,
   supplierQuotes:SUPPLIER_QUOTE_LINES_0553
  });
  return cache;
 }
};
