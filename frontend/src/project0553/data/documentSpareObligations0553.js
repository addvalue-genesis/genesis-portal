// PJ2608-0553 · Document-driven spare obligations, NOT recommendations.
// Master methodology is Section 02. Price/mapping consumers belong to Section 10.
// MR Rev.C1 §5: One commissioning spare KIT per applicable platform, tools one
// set per PHASE, two-year operating spare list QUOTATION ONLY. A "kit" does not
// assert an additional complete RACON/ODU/IDU or any specific OEM spare part.
import {MR0003_MR0004_SCOPE_C1} from "./mr0003Mr0004ScopeC1";
import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import {MR0001_WORKING_PRICED_BOM} from "./mr0001WorkingPricedBom";
const U=a=>[...new Set(a)];
const MR_INFO=Object.freeze([
 {mr:"MR-0001",label:"SCADA Radio",sites:["ZWP20","ZWP21","ZWP22","ZWP23"],source:"MM-ZTK-1F-GEN-TEL-MR-0001 Rev.C1 §5"},
 {mr:"MR-0002",label:"DMR Trunk Radio",sites:["ZWP20","ZWP21","ZWP22"],source:"MM-ZTK-1F-GEN-TEL-MR-0002 Rev.C1 §5"},
 ...MR0003_MR0004_SCOPE_C1.systems.map(x=>({
  mr:"MR-"+x.mr.slice(-4),label:x.name,sites:x.sites,
  source:MR0003_MR0004_SCOPE_C1.sources[x.mr].document+" Rev.C1 §5"
 }))
]);
export const SPARE_DOCUMENT_METHOD_0553=Object.freeze({
 governanceModule:"bid.methodology.first-principles",
 equationSource:"MAP-02 + MAP-06 + MAP-07 + MAP-08",
 rule:"REQUIREMENT → SYSTEM/WP/TAG → APPLICABILITY → DOCUMENT QUANTITY DRIVER → OEM/EXA-A8 CONTENT → SKU & PRICE → CUSTOMER OUTPUT",
 noAssumedSparePartQuantity:true,
 classification:["DOCUMENT_REQUIRED","ENGINEERING_DERIVED","OEM_RECOMMENDED","CLARIFICATION","NOT_APPLICABLE"],
 categoryPolicy:{
  B10:"1 documented spare KIT per platform per MR; physical contents remain independently specified",
  B11:"1 special tool SET per phase per MR; common tools pooled only when explicitly compatible",
  B13:"Use document/OEM preservation and maintenance activity; not automatically 1 kit per platform",
  C1:"Optional capital spare quote, never infer one complete equipment spare from installed-set count",
  C2:"2-year recommended operation spares quotation only, no automatic physical supply in base"
 },
 control:"SPQ-001 risk scenario may flag a gap; it must never create mandatory spare BOM quantity."
});
// Brownfield source clauses must be captured independently from the new ZWP
// 1 kit/platform mandate. Existing network tie-ins may require spare parts and
// special tools "as required"; there is no document-based 1-kit-per-brownfield
// rule. Do not erase this demand because it is not quantified in section §5.
const BROWNFIELD_SCOPES=Object.freeze([
 {mr:"MR-0001",site:"ZPQ",source:"MR0001 Rev.C1 §5 BROWNFIELD FOR ZPQ / as required spare parts and special tools",requirement:"SCADA tie-in/ODU/IDU/RF spare and OEM compatibility screening"},
 {mr:"MR-0001",site:"ZWP08",source:"MR0001 Rev.C1 §5 BROWNFIELD FOR ZWP08 / as required spare parts and special tools",requirement:"SCADA dual-radio/antenna/switch interfaces and spare coverage screening"},
 {mr:"MR-0001",site:"ZWP11",source:"MR0001 Rev.C1 §5 BROWNFIELD FOR ZWP11 / as required spare parts and special tools",requirement:"SCADA existing-site interface and spare coverage screening"},
 {mr:"MR-0002",site:"ZPQ",source:"MR0002 Rev.C1 §5 Existing DMR/ZPQ integration / spare parts and tools as required",requirement:"RFI LNA/BDA tie-in to operating ZPQ DMR and compatible spare screening"}
]);
export function selectDocumentSpareObligations0553(){
 const actualMr1=new Set(MR0001_WORKING_PRICED_BOM.items.map(x=>x.site));
 const actualMr2=new Set(Z1F_TEL_LAYOUT_INDEX_0553.byWP.filter(w=>w.equipment.some(x=>x.system==="DTRS_TRUNK_RADIO")).map(x=>x.wp));
 for(const item of MR_INFO){
  const source=item.mr==="MR-0001"?actualMr1:item.mr==="MR-0002"?actualMr2:null;
  if(source&&item.sites.some(x=>!source.has(x)))throw Error("Installed scope missing "+item.mr+" "+item.sites.filter(x=>!source.has(x)).join(","));
 }
 const rows=MR_INFO.map(item=>Object.freeze({
  ...item,siteCount:U(item.sites).length,
  commissioningKitQuantity:U(item.sites).length,commissioningKitUnit:"set",
  commissioningKitEquation:"MAP-06: sum(1 kit × applicable MR-platform)",
  commissioningKitContents:null,commissioningKitContentsState:"DOCUMENT_AND_OEM_PART_LIST_REQUIRED",
  specialToolPhaseSets:1,specialToolUnit:"set/phase",
  specialToolEquation:"MR §5: 1 tool set per phase per MR; shared scope requires explicit compatibility proof",
  c1CompleteEquipmentRequiredQuantity:null,c1Mandatory:false,
  c2QuotationRequired:true,c2MandatoryEquipmentDelivery:false,
  minimumProof:"MR Rev.C1 §5 + SPE §8.1 + EXA-A8 applicability; no inferred spare SKU",
  customerReleaseAllowed:false
 }));
 const brownfieldRows=BROWNFIELD_SCOPES.map(x=>Object.freeze({...x,commissioningKitQuantity:null,sparePartItemQuantity:null,commercialPriceTHB:null,driver:"AS_REQUIRED__FUNCTIONAL_INTERFACE_AND_OEM_ASSESSMENT",costPostingAllowed:false}));
 const totals={commissioningKitSets:rows.reduce((sum,x)=>sum+x.commissioningKitQuantity,0),
  specialToolMrPhaseRequirements:rows.length,brownfieldAsRequiredInterfaces:brownfieldRows.length,physicalSparePartItemsVerified:0,
  capitalCompleteUnitsMandatedFromOneSetRule:0};
 if(totals.commissioningKitSets!==14||totals.specialToolMrPhaseRequirements!==4)
  throw Error("Four MR documented spare demand has diverged");
 return Object.freeze({moduleId:"bid.methodology.spare-obligation-derivation",
  section:"02",consumers:["10.2/B10","10.2/B11","10.2/B13","10.2/C1","10.2/C2"],
  method:SPARE_DOCUMENT_METHOD_0553,rows,brownfieldRows,totals,
  pricePostingAllowed:false,contractSpareContentComplete:false,
  customerReleaseAllowed:false});
}
