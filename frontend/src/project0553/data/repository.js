import { controlledSnapshotAdapter } from "./adapters/controlledSnapshotAdapter";
const activeAdapter=controlledSnapshotAdapter;
export function getProject0553Dataset(){return activeAdapter.load();}
export function getProject0553DataLayerStatus(){
 const m=activeAdapter.describe();
 return {projectId:m.projectCode,revision:getProject0553Dataset().revision,storage:"CONTROLLED_JSON_SNAPSHOT",adapter:m.adapter,datasetId:m.datasetId,integrationState:m.integrationState,issuePermission:false};
}
export function getProject0553SupplierQuotes(){return getProject0553Dataset().supplierQuotes;}
