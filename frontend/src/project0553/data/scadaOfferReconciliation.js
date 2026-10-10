import MTO from "./snapshots/mto.rev04.summary.json";
import NEXTG from "./quotes/NG-260916-ADV-DAP1.full.json";
import {reconcileRequiredAndOffered} from "../../common/engineering/requiredOfferedReconciliation";
// Controlled preliminary comparison; MTO summary does not contain installed SKU quantities.
export const SCADA_0553_RECONCILIATION = reconcileRequiredAndOffered({
 sourceId:MTO.sourceId,
 required:MTO.systems.filter(s=>s.mr==="MR-0001").flatMap(s=>s.equipmentFamilies.map(f=>({
  mr:s.mr,equipmentFamily:f,requiredQty:null,selectedPartNumber:null,sourceId:MTO.sourceId,
  facilities:s.facilities,requirementStatus:"MTO_SUMMARY_FAMILY_ONLY"
 }))),
 offered:NEXTG.lines.map(x=>({mr:"MR-0001",partNumber:x.partNumber,qty:x.qty,unitPrice:x.unitPrice,
 currency:"USD",sourceId:NEXTG.sourceDriveId,quoteLine:x.code,description:x.description,group:x.group}))
});
