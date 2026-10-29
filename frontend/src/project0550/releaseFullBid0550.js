import {MR_WORKING_CATALOG_0550} from "./data/mrWorkingBasis0550";
import {CUSTOMER_FORM_0550,mappingValid} from "./data/officialPricing0550";
import {MR_SUPPLY_ORDER_0550} from "./bidWorkingBasis0550";

const page=reference=>Number(reference?.match(/\bp\s*0*(\d+)/i)?.[1]||Infinity);
const appendix=reference=>reference?.match(/\bApp\.(\d+\.\d+)\b/)?.[1]||"";
const counts=records=>Object.fromEntries(["TSI","COMPANY","CLARIFICATION","OPEN"].map(role=>[role,records.filter(r=>r.role===role).length]));

// Read-only scope inventory, independent of the 15 commercial Lot headings.
// A catalog requirement remains visible even without a selected/priced/mapped row.
export function releaseFullBid0550(data,official,systems){
 const catalog=MR_WORKING_CATALOG_0550.rows;
 const tokens=[...new Set([...systems.map(s=>s.token),...catalog.map(r=>r.systemToken),...data.lines.map(l=>l.systemToken),...(data.integrationWorkspace?.requirements||[]).map(r=>r.systemToken)])];
 return tokens.map((token,index)=>{
  const requirements=catalog.map((r,i)=>({...r,position:i})).filter(r=>r.systemToken===token);
  const records=requirements.map(requirement=>{
   const matches=official.lines.filter(l=>l.mrRequirementId===requirement.id),line=matches.length===1?matches[0]:null;
   const scope=line?.mrScopeState;
   const role=scope?.excluded||line?.satelliteScopeState?.excluded?"COMPANY":line?.satelliteScopeState?.problems.some(p=>p.startsWith("SATELLITE_SCOPE_OPEN"))?"CLARIFICATION":scope?.responsibility==="COMPANY"&&!scope.excluded?"OPEN":scope?.responsibility||requirement.responsibility||"OPEN";
   return {requirement,line,role,missing:matches.length===0,duplicate:matches.length>1,mappingOpen:role!=="COMPANY"&&(!line||!mappingValid(line))};
  });
  const equipment=records.filter(r=>r.requirement.wbs==="A"),services=records.filter(r=>r.requirement.wbs!=="A");
  const sourceOrder=(equipment.length?equipment:records).map(r=>r.requirement).sort((a,b)=>page(a.reference)-page(b.reference)||a.position-b.position);
  const first=sourceOrder[0],work=official.lines.filter(l=>l.systemToken===token),owners=work.filter(l=>l.selected);
  const a=counts(equipment),bc=counts(services),extraSelected=work.filter(l=>!l.mrRequirementId&&l.selected).length;
  const integration=(data.integrationWorkspace?.requirements||[]).filter(r=>r.systemToken===token);
  const bid=a.TSI+bc.TSI>0||a.CLARIFICATION+bc.CLARIFICATION+a.OPEN+bc.OPEN>0||!records.length||extraSelected>0;
  return {token,name:systems.find(s=>s.token===token)?.name||(token==="COMMON"?"Shared equipment / common obligations":token),index,first,
   references:[...new Set(sourceOrder.map(r=>r.reference))],appendices:[...new Set(sourceOrder.map(r=>appendix(r.reference)).filter(Boolean))],
   mrDocuments:records.length?[MR_WORKING_CATALOG_0550.document]:[],mrReferences:[...new Set(records.map(r=>r.requirement.reference))],
   records,a,bc,bid,extraSelected,integrationCount:integration.length,
   sourceLots:CUSTOMER_FORM_0550.rows.filter(r=>r.systems.includes(token)).map(r=>r.code),
   workingLots:[...new Set(work.map(r=>r.customerRowCode).filter(Boolean))],
   missing:records.filter(r=>r.missing).length,duplicates:records.filter(r=>r.duplicate).length,mappingOpen:records.filter(r=>r.mappingOpen).length,
   owners:owners.length,priced:owners.filter(r=>Number.isFinite(r.customerUSD)).length,
   workingGroupId:MR_SUPPLY_ORDER_0550.some(group=>group.systems.includes(token))?"bid.budget.working.group."+token:work[0]?.sourceModuleId||"bid.budget.working.lines"};
 }).sort((a,b)=>page(a.first?.reference)-page(b.first?.reference)||(a.first?.position??Infinity)-(b.first?.position??Infinity)||a.index-b.index);
}
