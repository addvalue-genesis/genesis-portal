import { controlledSnapshotAdapter } from "./adapters/controlledSnapshotAdapter";

const activeAdapter = controlledSnapshotAdapter;

export function getProject0550Dataset() {
  return activeAdapter.load();
}

export function getProject0550DataLayerStatus() {
  return activeAdapter.describe();
}
