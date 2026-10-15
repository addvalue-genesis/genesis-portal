// PJ2608-0553 — one source-linked, non-posting four-category Spare & Consumables VIEW.
// Source Tag inventory is existing MR0001 MTO, never fabricated from a spare description.
// Genuine OEM spare-to-installed-tag mapping requires model/part compatibility evidence.
import {REV08_BASELINE} from "./rev08CommercialBaseline";
import {MR0001_WORKING_PRICED_BOM} from "./mr0001WorkingPricedBom";
const codes=Object.freeze(["B10","B13","C1","C2"]);
const descriptions=Object.freeze({B10:"Erection, Precommissioning, Commissioning, Start-up Spare Parts",B13:"Supplier Recommendation for Consumables",C1:"Supplier Recommendation for Capital Spare Parts",C2:"Supplier Recommendation for 2 Years Operation Spare Parts"});
const applicableFamily=description=>{
 const d=description.toLowerCase();
 if(/scada|poe|cisco|ethernet|rf |n-male|surge|radio/.test(d))return "MR0001";
 if(/racon/.test(d))return "MR0004";
 if(/telephone|sounder|ex phone/.test(d))return "MR0003";
 return null; // Broad words such as gland/fuse are cross-system, not a verified SKU match.
};
const tagRows=MR0001_WORKING_PRICED_BOM.items.filter(x=>typeof x.sourceTag==="string"&&x.sourceTag.trim());
const installedByTag=new Map(tagRows.map(x=>[x.site+"|"+x.sourceTag,x]));
export function selectUnifiedSpareConsumables0553(){
 const rows=codes.flatMap(code=>(REV08_BASELINE.detail[code]||[]).map(([description,quantity,unitPriceUSD],i)=>{
  const family=applicableFamily(description);
  const installed=family==="MR0001"?tagRows.filter(x=>{
   const d=description.toLowerCase(),tag=x.sourceTag.toUpperCase();
   if(/cisco|ethernet/.test(d))return tag.startsWith("LAN-");
   if(/poe/.test(d))return tag.startsWith("MR-");
   if(/rf |radio|n-male/.test(d))return tag.startsWith("MR-")||tag.startsWith("ANT-");
   return false;
  }):[];
  const connectedTags=[...new Set(installed.map(x=>x.sourceTag))];
  return Object.freeze({
   id:code+"-REV08-"+String(i+1).padStart(2,"0"),code,item:i+1,description,
   sourceClass:"HISTORICAL_REV08_BUDGETARY_CANDIDATE",sourceRevision:"Rev08",currency:"USD",
   legacyQty:quantity,legacyUnitUSD:unitPriceUSD,legacyTotalUSD:quantity*unitPriceUSD,
   mrFamilyCandidate:family,relatedInstalledTags:connectedTags,
   relatedLocations:[...new Set(installed.map(x=>x.site))],
   tagMappingState:connectedTags.length?"MTO_TAG_CANDIDATES_NOT_SPARE_COMPATIBILITY_VERIFIED":"REQUIRES_TAG_SKU_COMPATIBILITY_LINK",
   customerTagNo:null, // Never misrepresent candidate MTO TAG as OEM-approved spare fit.
   vendorPartNumber:null,detailSpecification:null,material:null,leadTimeARO:null,
   approvedRequiredQty:null,approvedUnitTHB:null,workingSellTHB:null,
   validDirectCost:false,customerReleaseAllowed:false,
   physicalCostOwner:code,option:code.startsWith("C"),requiredMinimumSpareValidation:"EXA_A8_AND_OEM_SPIR_PENDING"
  });
 }));
 const byCode=Object.fromEntries(codes.map(c=>[c,rows.filter(x=>x.code===c)]));
 if(rows.some(x=>!installedByTag||x.legacyQty<0))throw Error("Invalid spare source");
 for(const code of codes){
  const source=REV08_BASELINE.summary.find(x=>x[0]===code)?.[2];
  const sum=byCode[code].reduce((n,x)=>n+x.legacyTotalUSD,0);
  if(!Number.isFinite(source)||Math.abs(sum-source)>0.01)throw Error("Spare master Rev08 reconciliation "+code);
 }
 return Object.freeze({moduleId:"bid.budget.working.bc.spares-master",codes,descriptions,rows,byCode,
  sourceTagRegister:"MR0001 MTO Rev04 through existing Working Priced BOM",
  sourceHistorical:"4-Scope of Supply.xlsx Rev08",
  verification:"MR0001-0004 + SPE C2 + EXA-A8 + OEM SPIR + DTS/LIS compatibility remain to validate",
  historicalNotAdditionalCost:true,complete:false,releaseAllowed:false});
}
