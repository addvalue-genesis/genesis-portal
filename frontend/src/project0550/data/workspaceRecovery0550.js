// ADR-0550-001 6,9–12: expose incompatibility; retain original private data/history.
import release from "../../projectHubRelease.json";
export function workspaceDiagnostic0550(error,rawWorkspace,origin=""){
 const scalar=v=>["string","number"].includes(typeof v)?v:null;
 return {
  applicationVersion:release.version,
  buildCommit:typeof __PJ0553_BUILD_REVISION__==="undefined"?"UNAVAILABLE":__PJ0553_BUILD_REVISION__,
  expectedBranch:release.branch,
  origin,
  errorCode:error.code||"WORKSPACE_LOAD_FAILED",
  error:error.message,
  projectId:scalar(rawWorkspace?.projectId),
  schema:scalar(rawWorkspace?.schema),
  workspaceRevision:scalar(rawWorkspace?.revision),
  fieldNames:rawWorkspace&&typeof rawWorkspace==="object"?Object.keys(rawWorkspace).sort():[],
  unsupportedFields:error.unsupportedFields||[]
 };
}
