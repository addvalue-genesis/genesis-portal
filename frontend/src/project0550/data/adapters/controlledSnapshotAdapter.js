import snapshot from "../snapshots/pj2608-0550.rev04.json";
import { validateProject0550Dataset } from "../validateDataset";

let cached;

export const controlledSnapshotAdapter = {
  id: "controlled-json-snapshot",
  describe() {
    return {
      adapter: this.id,
      datasetId: snapshot.meta.datasetId,
      projectCode: snapshot.meta.projectCode,
      status: snapshot.meta.status,
      integrationState: snapshot.meta.integrationState,
    };
  },
  load() {
    if (!cached) cached = validateProject0550Dataset(snapshot);
    return cached;
  },
};
