// BLD-0001 Rev.C1 + MR-0001 Rev.C1 cross-check, project-specific.
// PDF extracted statements are evidence pointers, not verified symbol-by-symbol native drawing takeoff.
import {MR0001_RADIO_ROLE_MATRIX} from "./mr0001RadioRoleMatrix";
import {MR0001_ENGINEERING_REQUIRED_BOM} from "./mr0001RequiredBomDerivation";
const BLD="https://drive.google.com/file/d/1ilsnWSfMlFZh8nD29rra4YRWizadovl-/view";
const MR="https://drive.google.com/file/d/1UiabYMc178_X5_AkQsBe6kA0hUJAG5f8/view";
const checks=[
 {id:"OWN-01",site:"ZWP8",description:"BLD Rev.C1 notes existing ZWP8–ZPQ communication link to be used in communicating with ZWP20/ZWP22",requiredDecision:"Classify reused radio, new branch/link components, capacity/licence expansion and modification ownership",state:"BROWNFIELD_REUSE_VERIFY",source:"BLD-0001-C1",sourceUrl:BLD},
 {id:"OWN-02",site:"ZWP20/ZWP22",description:"BLD Rev.C1 notes new IDU and surge arrestor installed in new Ex 'e' enclosure",requiredDecision:"Tie each new IDU/SA/JB/enclosure to site MTO, installation interface and OEM quote; avoid counting the same SA twice",state:"NEW_SCOPE_RECONCILE",source:"BLD-0001-C1",sourceUrl:BLD},
 {id:"OWN-03",site:"ZWP20/ZWP21/ZWP22/ZWP23",description:"BLD Rev.C1 depicts ODU, antenna, RF filter, L3/IDU interfaces with existing equipment and equipment provided by others differentiated by line/symbol style",requiredDecision:"Read actual diagram line styles and legends per sheet, confirm new/reused/free-issued/others ownership; text extraction alone is insufficient",state:"DRAWING_SYMBOL_REVIEW",source:"BLD-0001-C1",sourceUrl:BLD},
 {id:"OWN-04",site:"ALL",description:"MR0001 Rev.C1 requires commissioning spares and special tools to be supplied, not only listed",requiredDecision:"Verify supplier spare/tool inventory, included vs optional price and SPIR against MR and customer form",state:"MR_MANDATORY_SCOPE_CHECK",source:"MR-0001-C1",sourceUrl:MR},
 {id:"OWN-05",site:"ALL",description:"MR0001 Rev.C1 vendor selected model/dimensions must be reflected in datasheet after selection",requiredDecision:"Obtain signed vendor GA/datasheet, confirm cabinet heat/load, dimensions and clearances before Ex enclosure approval",state:"OEM_DATASHEET_OPEN",source:"MR-0001-C1",sourceUrl:MR}
];
export const MR0001_SCOPE_OWNERSHIP_AUDIT=Object.freeze({
 projectId:"PJ2608-0553",mr:"MR-0001",
 sources:[{id:"BLD-0001-C1",url:BLD,revision:"C1",drawingStatus:"AFC"},
  {id:"MR-0001-C1",url:MR,revision:"C1",documentStatus:"AFC"}],
 siteRoles:MR0001_RADIO_ROLE_MATRIX.sites.map(s=>({
 site:s.site,relatedMtoRows:MR0001_ENGINEERING_REQUIRED_BOM.rows.filter(x=>x.platform===s.site).map(x=>x.sourceRowIndex),
 newEquipmentQty:null,reusedEquipmentQty:null,freeIssueQty:null,installationServiceMH:null,
 ownershipApproval:"OPEN_NATIVE_BLD_SYMBOL_AND_TIE_IN_CHECK"
 })),
 checks,acceptedNewBOM:null,acceptedReuse:null,acceptedCost:null,releaseAllowed:false
});
