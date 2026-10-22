import snapshot from "./project0556.json";
export const PROJECT_ID_0556 = "PJ2610-0556";
export function validateDataset0556(d=snapshot) {
 const errors=[];
 if(d.projectId!==PROJECT_ID_0556)errors.push("wrong project");
 if(d.releaseAllowed!==false||d.issuePermission!==false)errors.push("release gate must be closed");
 if(d.project.durationMonths!==60||d.sites.length!==2)errors.push("TOR shape mismatch");
 if(d.costs.lines.length!==0||d.costs.capexTotal!==null||d.costs.opex60Months!==null||d.costs.workingSell!==null||d.costs.releaseSell!==null)errors.push("unverified price source");
 if(errors.length)throw Error("PJ2610-0556 controlled data invalid: "+errors.join(", "));
 return d;
}
export const getProject0556Dataset=()=>validateDataset0556(snapshot);
