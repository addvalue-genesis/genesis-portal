// Versioned contract over the existing MAP-01..10 responsibilities. No project
// rates, sources, formula replacement, automatic ledger write or issue authority.
import {normalizedEquipmentTag} from './controlledTagMappingKernel';
export const TAG_MAPPING_RULE_VERSION='genesis.controlled-tag-mapping/2';
export const MAP_STAGE_IDS=Object.freeze(Array.from({length:10},(_,i)=>'MAP-'+String(i+1).padStart(2,'0')));
const text=v=>typeof v==='string'&&Boolean(v.trim());
export function matchQuotedSourceLineV2({expected={},registered={}}={}){
 const issues=[],keys=['offerId','sourceId','itemCode','unit','currency'];
 for(const key of keys)if(!text(expected[key])||!text(registered[key])||expected[key]!==registered[key])issues.push('SOURCE_'+key.toUpperCase()+'_MISSING_OR_MISMATCH');
 for(const key of ['quantity','rate'])if(!Number.isFinite(expected[key])||!Number.isFinite(registered[key])||expected[key]<0||registered[key]<0||expected[key]!==registered[key])issues.push('SOURCE_'+key.toUpperCase()+'_MISSING_OR_MISMATCH');
 return {matched:!issues.length,issues};
}
export function deriveSourcedExtendedV2({quantity,sourceUnitRate,currency,round,pricingPolicy}={}){
 if(!Number.isFinite(quantity)||quantity<0||!text(currency)||typeof round!=='function'||!text(pricingPolicy))return {amount:null,state:'INVALID_INPUT'};
 if(sourceUnitRate===null||sourceUnitRate===undefined)return {amount:null,state:'UNKNOWN_VENDOR_RATE',sourceRate:null};
 if(!Number.isFinite(sourceUnitRate)||sourceUnitRate<0)return {amount:null,state:'INVALID_SOURCE_RATE'};
 const amount=round(quantity*sourceUnitRate);
 return {amount:Number.isFinite(amount)?amount:null,state:Number.isFinite(amount)?'SOURCE_RATE':'INVALID_AMOUNT',sourceRate:sourceUnitRate,currency,pricingPolicy};
}
export function reconcileTagCostOwnersV2({items=[],ledger=[],round,pricingPolicy}={}){
 const problems=[],totals=new Map(),seen=new Set(),owners=new Set();
 if(!items.length||!ledger.length||typeof round!=='function'||!text(pricingPolicy))return {pass:false,problems:['EMPTY_OR_INVALID_RECONCILIATION'],ownerResults:[]};
 for(const i of items){
  if(!text(i.sourceUsageKey)||seen.has(i.sourceUsageKey)){problems.push('DUPLICATE_OR_EMPTY_SOURCE_USAGE');continue;}seen.add(i.sourceUsageKey);
  if(!text(i.ownerId)||!text(i.currency)||!Number.isFinite(i.amount)||i.amount<0){problems.push('INVALID_SOURCE_AMOUNT');continue;}
  const key=i.ownerId+'|'+i.currency;totals.set(key,round((totals.get(key)||0)+i.amount));
 }
 const ownerResults=ledger.map(l=>{const key=l.ownerId+'|'+l.currency;if(owners.has(key))problems.push('DUPLICATE_LEDGER_OWNER');owners.add(key);const found=totals.get(key),delta=Number.isFinite(found)&&Number.isFinite(l.extended)?round(found-l.extended):null;return {...l,mappedAmount:found??null,delta,pass:delta===0};});
 for(const key of totals.keys())if(!owners.has(key))problems.push('NO_LEDGER_OWNER_OR_CURRENCY');
 return {pass:!problems.length&&ownerResults.every(r=>r.pass),problems,ownerResults,pricingPolicy};
}
export function assessControlledTagMappingV2({checks=[],priceAvailable=false,engineeringReady=false}={}){
 const byId=new Map(checks.map(c=>[c.id,c]));
 const stages=MAP_STAGE_IDS.map(id=>{const c=byId.get(id);return c&&['PASS','OPEN','ERROR','NOT_APPLICABLE'].includes(c.state)&&text(c.reason)?{...c}:{id,state:'ERROR',reason:'Missing/invalid mapping check'};});
 const valid=checks.length===10&&byId.size===10&&checks.every(c=>MAP_STAGE_IDS.includes(c.id));
 return {ruleVersion:TAG_MAPPING_RULE_VERSION,stages,mappingComplete:valid&&stages.every(s=>['PASS','NOT_APPLICABLE'].includes(s.state)),priceAvailable:priceAvailable===true,engineeringReady:engineeringReady===true,issueAuthorized:false};
}
export const normalizeTagIdentityV2=normalizedEquipmentTag;
