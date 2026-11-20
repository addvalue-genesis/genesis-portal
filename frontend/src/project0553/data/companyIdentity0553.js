import COMPANY_MASTER_0553 from "./companyMaster0553.json";

// Identity-resolution overlay. Original vendor strings and quotation IDs are NEVER edited.
// Exact source-label matches only: similar product brands or customers cannot become suppliers.
const normalizeSourceName=value=>String(value??"").normalize("NFKC").trim().replace(/\s+/g," ").toLowerCase();
const byAlias=new Map(COMPANY_MASTER_0553.companies.flatMap(company=>
 company.aliases.map(alias=>[normalizeSourceName(alias.sourceLabel),
  {id:company.id,name:company.displayName,alias:alias.sourceLabel,
   relation:alias.relation,thirdParty:alias.thirdParty||null,qualification:company.approvedStatus}])));
const byId=new Map(COMPANY_MASTER_0553.companies.map(x=>[x.id,x]));
export function resolveCompany0553(rawName){
 const sourceName=String(rawName??"").trim();
 const found=byAlias.get(normalizeSourceName(sourceName));
 return found?{...found,sourceName,matched:true}:{
  id:normalizeSourceName(sourceName),name:sourceName,sourceName,
  alias:null,relation:"UNCLASSIFIED_SOURCE_LABEL",thirdParty:null,matched:false,qualification:"NOT_VERIFIED"};
}
export const canonicalCompanyId0553=name=>resolveCompany0553(name).id;
export const companyMaster0553=COMPANY_MASTER_0553;
export function resolveCompanySummary0553(companyId){
 const company=byId.get(companyId);
 return company?{id:company.id,name:company.displayName,aliases:company.aliases.map(a=>a.sourceLabel),
   qualification:company.approvedStatus,roles:company.roles||[]}:
  {id:companyId,name:companyId,aliases:[],qualification:"NOT_VERIFIED",roles:[]};
}
