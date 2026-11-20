// Single inventory of pre-existing GENESS formulas; never duplicate literal equations.
// Status describes executable coverage, not engineering approval or project applicability.
import { ENGINEERING_LAW_KERNELS } from "../../knowledge-kernels/library";
import { SERVICE_EQUATIONS } from "../cost/serviceEquations";
const executedEngineering=new Set([
 "RF-PROP/Free Space Path Loss","RF-PROP/Received Level",
 "RF-PROP/Fade Margin","RF-PROP/Fresnel Radius"
]);
const executedService=new Set(["E01","E02","E07","E12"]);
export const MASTER_FORMULA_INVENTORY=[
 ...ENGINEERING_LAW_KERNELS.flatMap(kernel=>kernel.equations.map((eq,index)=>({
  id:kernel.id+"-"+String(index+1).padStart(2,"0"),domain:kernel.id,
  name:eq.name,formula:eq.formula,role:eq.role,
  implementationState:executedEngineering.has(kernel.id+"/"+eq.name)?"EXECUTABLE_PRELIMINARY":"FORMULA_ONLY",
  source:"frontend/src/knowledge-kernels/library.js",
  controls:kernel.controls,output:kernel.output
 }))),
 ...SERVICE_EQUATIONS.map(eq=>({
  id:eq.id,domain:"SERVICE_COST",name:eq.purpose,formula:eq.equation,
  role:eq.purpose,implementationState:executedService.has(eq.id)?"EXECUTABLE_PARTIAL":"FORMULA_ONLY",
  source:"frontend/src/common/cost/serviceEquations.js",
  controls:[eq.control],output:"Work / cost derivation; requires project evidence and commercial policy"
 }))
];
export const FORMULA_COVERAGE_SUMMARY={
 engineeringDefinitions:ENGINEERING_LAW_KERNELS.reduce((n,k)=>n+k.equations.length,0),
 serviceDefinitions:SERVICE_EQUATIONS.length,
 total:MASTER_FORMULA_INVENTORY.length,
 executableCoverage:MASTER_FORMULA_INVENTORY.filter(x=>x.implementationState.startsWith("EXECUTABLE")).length
};
export const PRELIMINARY_METHODS_REQUIRING_SPECIALIST_MODELS=[
 {id:"SEA-TIDE-REFLECTION",basis:"Flat sea two-ray geometry",state:"PRELIMINARY_GEOMETRY_ONLY",limitation:"No Pathloss 6 multipath loss, earth curvature, reflection coefficient or full propagation prediction",implementation:"frontend/src/common/engineering/seaReflection.js"},
 {id:"ITU-P530-AVAILABILITY",basis:"ITU-R P.530 and applicable project specification",state:"METHOD_REVIEW_REQUIRED",limitation:"No OEM/Pathloss equivalent implementation"},
 {id:"OEM-CAL-RPT",basis:"Final selected vendor equipment and Pathloss verification",state:"OEM_REVIEW_PENDING",limitation:"Not a reusable universal equation"}
];
