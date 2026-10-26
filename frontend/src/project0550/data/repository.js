import { controlledSnapshotAdapter } from "./adapters/controlledSnapshotAdapter";
import { bidIndexedDbAdapter } from "./adapters/bidIndexedDbAdapter";
import { emptyBidWorkspace, validateBidWorkspace } from "./bidWorkspaceModel";

const activeAdapter = controlledSnapshotAdapter;

export function getProject0550Dataset() {
  return activeAdapter.load();
}

export function getProject0550DataLayerStatus() {
  return activeAdapter.describe();
}

// Mutable bid inputs extend the existing repository; the controlled adapter stays read-only.
function validateBid(data){const baseline=getProject0550Dataset();return validateBidWorkspace(data,baseline.meta.datasetId,baseline.systemGroups.flatMap(g=>g.systems.map(s=>s.token)));}
export async function loadProject0550Bid(){return validateBid((await bidIndexedDbAdapter.load())||emptyBidWorkspace(getProject0550Dataset().meta.datasetId));}
export async function saveProject0550Bid(data,revision,action){return bidIndexedDbAdapter.save(validateBid(data),revision,action);}
