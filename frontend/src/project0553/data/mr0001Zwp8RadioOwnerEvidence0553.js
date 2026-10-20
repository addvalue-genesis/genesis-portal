// ZWP8 MR0001 two distinct radio TAG price owners, one grouped MR source row43.
// Values are selected INTERNAL Next G USD function rates already posted by the
// immutable Rev02/Rev03 ledger. Do not multiply vendor quotation-wide quantities.
import {ZWP8_ROW43_COST_TRACE} from "./zwp8Row43CostTrace";
import NEXTG from "./quotes/NG-260916-ADV-DAP1.full.json";
import {ZWP8_BOD_NEW_LINK_SCOPE_0553} from "./zwp8BodNewLinkScope0553";
const tags=["MR-502-003","MR-502-004"];
const get=code=>NEXTG.lines.find(x=>x.code===code);
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
export function getZWP8RadioOwnerEvidence0553(site,tagRow){
 if(site!=="ZWP8"||tagRow.row!==43||!tags.includes(tagRow.tag))return null;
 const quoteCodes=ZWP8_ROW43_COST_TRACE.ownerCodes[tagRow.tag];
 const functions=quoteCodes.map(code=>{
  const q=get(code);
  if(!q||!Number.isFinite(q.unitPrice))throw Error("ZWP8 selected quote function not costed: "+code);
  return {code,sku:q.partNumber,description:q.description||q.itemDescription||q.partNumber,
   quotedUnitUSD:q.unitPrice,quotedQtyOriginal:q.qty,siteQty:1,
   selectedExtendedUSD:q.unitPrice,source:NEXTG.quoteNumber,
   state:"SOURCE_RATE_ALREADY_OWNER_POSTED__NOT_ADDITIVE"};
 });
 const ownerUSD=round(functions.reduce((sum,x)=>sum+x.selectedExtendedUSD,0));
 if(ownerUSD!==tagRow.extended||ownerUSD!==ZWP8_ROW43_COST_TRACE.ownerCosts[tagRow.tag]||
  tagRow.currency!=="USD"||!tagRow.countedInWorkingTotal)
  throw Error("ZWP8 radio owner price mismatch for "+tagRow.tag);
 return {site,tag:tagRow.tag,row:tagRow.row,unit:"Set",scopeQty:1,
  quote:NEXTG.quoteNumber,fromGroup:"MR0001 C1 ZWP8 MTO Row43 (six source TAGs)",
  role:tagRow.tag==="MR-502-003"?"PTMP base serving ZWP20 and ZWP22":
   "NEW PTP ZPQ–ZWP8 additional-link radio REQUIRED by BOD C2 §7.2; separate EXISTING link retained",
  originalOwnerRateUSD:ownerUSD,alreadyBookedSiteUSD:ownerUSD,functions,
  pairedIdU:tagRow.tag==="MR-502-003"?"MR-502-003A":"MR-502-004A",
  associatedAntenna:tagRow.tag==="MR-502-003"?"ANT-502-002":"ANT-502-003",
  exclusions:["Related IDU PoE A-6/A-7 or B-6/B-7 has a separately counted TAG owner",
   "Ethernet surge A-8/B-8 belongs to SA-502-002 and SA-502-003, not ODU again",
   "Licence A-3/B-4 and OEM complete IDU are not proved by this selected partial cost",
   "New ZPQ–ZWP8 PTP radio/4ft antenna are required as ADDITIONAL equipment; existing PTP retained. OEM B-1 remote hardware/role and B-3 license require technical confirmation"],
  technicallyApproved:false,physicalProcurementApproved:false,workingSellChanged:false
 };
}
export function getZWP8RadioOwnershipComparison0553(rows){
 const byTag=new Map(rows.map(x=>[x.tag,x]));
 const radios=tags.map(tag=>getZWP8RadioOwnerEvidence0553("ZWP8",byTag.get(tag)||{}));
 if(radios.some(x=>!x))throw Error("ZWP8 must retain both radio ODU TAGs");
 const idus=["MR-502-003A","MR-502-004A"].map(tag=>byTag.get(tag));
 const surges=["SA-502-002","SA-502-003"].map(tag=>byTag.get(tag));
 const antennas=["ANT-502-002","ANT-502-003"].map(tag=>byTag.get(tag));
 const enclosure=byTag.get("TCAB-500-003");
 if(!enclosure||enclosure.row!==46||!enclosure.countedInWorkingTotal)throw Error("One separately owned TCAB Row46 required");
 for(const group of [idus,surges,antennas])if(group.some(x=>!x||!x.countedInWorkingTotal))
  throw Error("ZWP8 grouped source function cost owner missing");
 const sum=(array,currency)=>round(array.filter(x=>x.currency===currency).reduce((n,x)=>n+x.extended,0));
 return {radios,idu: idus,surge:surges,antennas,
  enclosureTag:enclosure.tag,enclosureRow:enclosure.row,
  enclosureWorkingCostTHB:enclosure.currency==="THB"?enclosure.extended:null,
  enclosureQtySource:enclosure.sourceQty,
  radioCostUSD:round(radios.reduce((n,x)=>n+x.alreadyBookedSiteUSD,0)),
  iduCostUSD:sum(idus,"USD"),surgeCostUSD:sum(surges,"USD"),antennaCostUSD:sum(antennas,"USD"),
  countOfRadioODUs:2,countOfRadioIDUs:2,countOfAntennas:2,countOfSurges:2,
  countOfEnclosureTags:1,radioOverlapFound:false,
  decision:"One enclosure 1 Set; 2022 BARTEC dual-interface Type2 reference only. Check actual space/thermal/Ex and current supplier quotation.",
  sourceScopeStatus:ZWP8_BOD_NEW_LINK_SCOPE_0553.status,
  newPtpRadioScopeRequired:true,newPtmpBaseScopeRequired:true,newTcAbScopeRequired:true,
  status:"USD_OWNER_PRICES_FOUND__TWO_BOD_NEW_RADIOS_AND_ONE_NEW_ENCLOSURE_REQUIRED__OEM_TECHNICAL_REVIEW_OPEN"};
}
