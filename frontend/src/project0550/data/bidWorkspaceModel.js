import { evaluateServiceEquation } from "../serviceEquationRuntime";
import { validateSourceIntake } from "./sourceIntakeModel";
import {validateOfficialReview,deriveOfficialPricing,deriveProvisionalPricing} from "./officialPricing0550";
export const BID_SCHEMA="genesis.0550.bidding.v1";
export const BID_UNITS=["MD","MH","SET","LS","U","Pc","Lot","day","m"];
export const BID_WBS=["A","B1","B2","B3","B4","B5","B6","B7","B8","B9","C1","C2","C3"];
export const newId=prefix=>prefix+"-"+globalThis.crypto.randomUUID();
const finite=n=>typeof n==="number"&&Number.isFinite(n);
const nonnegative=n=>finite(n)&&n>=0;
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const fail=m=>{throw Error(m);};
export function emptyBidWorkspace(snapshotId){return {schema:BID_SCHEMA,projectId:"PJ2608-0550",baselineSnapshotId:snapshotId,revision:0,vendors:[],offers:[],calculations:[],lines:[],nodes:[],edges:[],fx:{thbPerUSD:null,thbPerEUR:null,source:"",date:""},audit:[]};}
export function validateBidWorkspace(data,snapshotId,systems){
 if(!data||data.schema!==BID_SCHEMA||data.projectId!=="PJ2608-0550"||data.baselineSnapshotId!==snapshotId)fail("Wrong project/schema/baseline");
 const keys=["schema","projectId","baselineSnapshotId","revision","vendors","offers","calculations","lines","nodes","edges","fx","audit","sourceIntake","customerReviews","vendorBasisImport"];
 if(Object.keys(data).some(k=>!keys.includes(k)))fail("Unsupported workspace field");
 if(!Number.isSafeInteger(data.revision)||data.revision<0)fail("Invalid revision");
 for(const key of ["vendors","offers","calculations","lines","nodes","edges","audit"]){
  if(!Array.isArray(data[key])||data[key].length>2000)fail("Invalid "+key);
  if(key!=="audit"&&(data[key].some(r=>!r||typeof r.id!=="string"||!/^[\w.-]{1,100}$/.test(r.id))||new Set(data[key].map(r=>r.id)).size!==data[key].length))fail("Duplicate/invalid "+key+" ID");
 }
 const string=(v,k,max=4000)=>{if(typeof v!=="string"||v.length>max)fail("Invalid "+k);};
 const date=(v,k)=>{string(v,k,10);if(v&&(!/^\d{4}-\d{2}-\d{2}$/.test(v)||!Number.isFinite(new Date(v).getTime())||new Date(v).toISOString().slice(0,10)!==v))fail("Invalid "+k);};
 const fields=(o,allowed)=>{if(Object.keys(o).some(k=>!allowed.includes(k)))fail("Unsupported record field");};
 const number=n=>{if(n!==null&&(!finite(n)||n<0||n>1e12))fail("Invalid numeric input");};
 const system=s=>{if(s!=="COMMON"&&!systems.includes(s))fail("Unknown system");};
 for(const v of data.vendors){fields(v,["id","name","kind","reference"]);["name","kind","reference"].forEach(k=>string(v[k],k));if(!v.name.trim())fail("Vendor name required");}
 for(const o of data.offers){fields(o,["id","vendorId","description","brand","quoteRef","sourceRef","date","validUntil","currency","unit","unitCost"]);["description","brand","quoteRef","sourceRef"].forEach(k=>string(o[k],k));date(o.date,"quote date");date(o.validUntil,"quote validity");if(o.date&&o.validUntil&&o.validUntil<o.date)fail("Quote validity precedes quote date");if(!data.vendors.some(v=>v.id===o.vendorId))fail("Offer vendor missing");if(!["THB","USD","EUR"].includes(o.currency)||!BID_UNITS.includes(o.unit))fail("Invalid offer currency/unit");number(o.unitCost);}
 for(const c of data.calculations){fields(c,["id","title","systemToken","equationId","inputs","sourceRef"]);string(c.title,"calculation title");string(c.sourceRef,"calculation source");system(c.systemToken);if(!c.inputs||typeof c.inputs!=="object"||Array.isArray(c.inputs))fail("Invalid equation inputs");if(evaluateServiceEquation(c.equationId,c.inputs).errors?.includes("Unknown equation"))fail("Unknown equation");}
 for(const l of data.lines){fields(l,["id","systemToken","wbs","description","scopeKey","tagRef","requirementRef","sourceRef","vendorId","offerId","calculationId","resultKey","quantity","unit","currency","manualCost","sellMode","sellRate","markupPct","marginPct","primePct","selected","customerRowCode","customerRemark","brand","officialReview"]);system(l.systemToken);if(l.officialReview!==undefined)validateOfficialReview(l.officialReview);for(const k of ["customerRowCode","customerRemark","brand"])if(l[k]!==undefined)string(l[k],k);if(!BID_WBS.includes(l.wbs))fail("Unknown 0550 WBS");["description","scopeKey","tagRef","requirementRef","sourceRef","vendorId","offerId","calculationId","resultKey"].forEach(k=>string(l[k],k));if(!BID_UNITS.includes(l.unit)||!["THB","USD","EUR"].includes(l.currency)||!["DIRECT","MARKUP","MARGIN"].includes(l.sellMode)||typeof l.selected!=="boolean")fail("Invalid line selection/unit/currency/pricing");["quantity","manualCost","sellRate","markupPct","marginPct","primePct"].forEach(k=>number(l[k]));}
 for(const n of data.nodes){fields(n,["id","systemToken","site","label","kind","sourceRef"]);system(n.systemToken);["site","label","kind","sourceRef"].forEach(k=>string(n[k],k));}
 for(const e of data.edges){fields(e,["id","from","to","label","sourceRef"]);["from","to","label","sourceRef"].forEach(k=>string(e[k],k));if(!data.nodes.some(n=>n.id===e.from)||!data.nodes.some(n=>n.id===e.to)||e.from===e.to)fail("Invalid schematic edge");}
 if(!data.fx||typeof data.fx!=="object")fail("Missing FX record");fields(data.fx,["thbPerUSD","thbPerEUR","source","date"]);number(data.fx.thbPerUSD);number(data.fx.thbPerEUR);string(data.fx.source,"FX source");date(data.fx.date,"FX date");
 for(const a of data.audit){fields(a,["revision","at","action"]);if(!Number.isSafeInteger(a.revision)||a.revision<1)fail("Invalid audit revision");string(a.at,"audit time",100);string(a.action,"audit action");}
 if(data.customerReviews!==undefined){if(!Array.isArray(data.customerReviews)||data.customerReviews.length>24||new Set(data.customerReviews.map(r=>r.code)).size!==data.customerReviews.length)fail("Invalid customer reviews");data.customerReviews.forEach(r=>validateOfficialReview(r,true));}
 if(data.vendorBasisImport!==undefined){const r=data.vendorBasisImport;fields(r,["version","date","importedLineIds","skippedSystems"]);string(r.version,"vendor import version",100);date(r.date,"vendor import date");for(const k of ["importedLineIds","skippedSystems"]){if(!Array.isArray(r[k])||r[k].length>2000||r[k].some(v=>typeof v!=="string"||v.length>100))fail("Invalid vendor import list");}}
 if(data.sourceIntake!==undefined)validateSourceIntake(data.sourceIntake,systems);
 return data;
}
export function deriveBidWorkspace(data,systemTokens,reviewDate){
 const eq=(id,inputs)=>evaluateServiceEquation(id,inputs).value;
 const fxReady=Boolean(data.fx.source.trim()&&/^\d{4}-\d{2}-\d{2}$/.test(data.fx.date));
 const fx=currency=>currency==="THB"?1:fxReady&&finite(data.fx["thbPer"+currency])&&data.fx["thbPer"+currency]>0?data.fx["thbPer"+currency]:null;
 const counts=new Map();data.lines.filter(l=>l.selected&&l.scopeKey.trim()).forEach(l=>{const k=l.scopeKey.trim().toLowerCase();counts.set(k,(counts.get(k)||0)+1);});
 const lines=data.lines.map(l=>{
  const problems=[],offer=data.offers.find(o=>o.id===l.offerId),calc=data.calculations.find(c=>c.id===l.calculationId);
  let quantity=l.quantity,unit=l.unit,currency=l.currency,costRate=l.manualCost,result=null;
  if(!l.description.trim()||!l.sourceRef.trim()||!l.scopeKey.trim())problems.push("Description, scope key and source/basis required");
  if(counts.get(l.scopeKey.trim().toLowerCase())>1&&l.selected)problems.push("DUPLICATE_SCOPE_OWNER");
  if(l.vendorId&&!data.vendors.some(v=>v.id===l.vendorId))problems.push("Vendor missing");
  if(l.offerId){
   if(!offer)problems.push("Selected offer missing");
   else {currency=offer.currency;unit=offer.unit;costRate=offer.unitCost;
    if(offer.vendorId!==l.vendorId)problems.push("Vendor/offer mismatch");
    if(!offer.quoteRef.trim()||!offer.sourceRef.trim())problems.push("Quote source missing");
    if(!offer.date||!offer.validUntil)problems.push("Quote date/validity missing");
    if(offer.date&&offer.date>reviewDate)problems.push("Quote dated in future — confirm source date");
    if(offer.validUntil&&offer.validUntil<reviewDate)problems.push("Quote expired — review replacement source");
   }
  }
  if(l.calculationId){
   if(!calc)problems.push("Calculation missing");
   else {result=evaluateServiceEquation(calc.equationId,calc.inputs);quantity=result[l.resultKey];
    if(calc.systemToken!==l.systemToken&&calc.systemToken!=="COMMON")problems.push("Calculation system mismatch");
    if(!calc.sourceRef.trim())problems.push("Calculation source required");
    const outputUnit=l.resultKey==="MD"?"MD":l.resultKey==="MH"&&calc.equationId==="E05"?"MH":result.unit;
    if(unit!==outputUnit)problems.push("Equation output/rate unit mismatch");
    if(result.state!=="CALCULATED")problems.push(...result.errors);
   }
  }
  if(!finite(quantity)||quantity<=0)problems.push("Positive quantity/driver required");
  if(!nonnegative(costRate))problems.push("Cost rate OPEN");
  const factor=fx(currency);if(factor===null)problems.push("FX source/date/rate OPEN");
  const costNative=finite(quantity)&&nonnegative(costRate)?quantity*costRate:null;
  let addvalueSell=null;
  if(l.sellMode==="DIRECT")addvalueSell=finite(quantity)&&nonnegative(l.sellRate)?eq("E10",{rows:[{id:l.id,quantity,sellRate:l.sellRate}],other:0}):null;
  else if(l.sellMode==="MARKUP")addvalueSell=costNative!==null&&nonnegative(l.markupPct)?eq("E11",{cost:costNative,markup:l.markupPct/100}):null;
  else addvalueSell=costNative!==null&&nonnegative(l.marginPct)?eq("E12",{cost:costNative,margin:l.marginPct/100}):null;
  if(addvalueSell===null)problems.push("Working sell inputs OPEN/invalid");
  const customerNative=addvalueSell!==null&&nonnegative(l.primePct)?eq("E13",{sell:addvalueSell,primeMarkup:l.primePct/100}):null;
  if(customerNative===null)problems.push("Prime commercial treatment OPEN/invalid");
  if(factor!==null&&[customerNative,costNative,addvalueSell].some(n=>n!==null&&(!Number.isFinite(n*factor)||Math.abs(n*factor)>Number.MAX_SAFE_INTEGER/100)))problems.push("Converted amount exceeds supported precision");
  const ready=problems.length===0;
  const customerTHB=ready?round(customerNative*factor):null;
  const usdRate=fx("USD");
  const usdValue=ready&&usdRate!==null?eq("E17",{THB:customerTHB,fx:usdRate}):null;
  const provisionalProblems=problems.filter(p=>!["Quote date/validity missing","Quote expired — review replacement source","FX source/date/rate OPEN"].includes(p));
  const nativeReady=provisionalProblems.length===0&&[costNative,addvalueSell,customerNative].every(n=>Number.isFinite(n)&&Math.abs(n)<=Number.MAX_SAFE_INTEGER/100);
  const provisionalCustomerTHB=nativeReady&&factor!==null?round(customerNative*factor):null;
  const provisionalUSD=provisionalCustomerTHB!==null&&usdRate!==null?eq("E17",{THB:provisionalCustomerTHB,fx:usdRate}):null;
  const provisional={provisionalProblems,provisionalCostNative:nativeReady?round(costNative):null,provisionalSellNative:nativeReady?round(addvalueSell):null,provisionalCustomerNative:nativeReady?round(customerNative):null,
   provisionalCostTHB:nativeReady&&factor!==null?round(costNative*factor):null,provisionalSellTHB:nativeReady&&factor!==null?round(addvalueSell*factor):null,provisionalCustomerTHB,provisionalCustomerUSD:provisionalUSD===null?null:round(provisionalUSD)};
  return {...l,...provisional,quantity,unit,currency,costRate,offer,calculation:calc,result,problems,state:ready?"PRICED_WORKING":"OPEN",costTHB:ready?round(costNative*factor):null,workingSellTHB:ready?round(addvalueSell*factor):null,customerTHB,customerUSD:usdValue===null?null:round(usdValue),sourceModuleId:"bid.budget.working.line."+l.id,releaseModuleId:"bid.budget.release.line."+l.id,traceId:"PJ2608-0550/"+l.id};
 });
 const selected=lines.filter(l=>l.selected);
 const complete=selected.length>0&&selected.every(l=>l.customerTHB!==null);
 const sum=(rows,key)=>rows.length&&rows.every(r=>r[key]!==null)?round(rows.reduce((n,r)=>n+r[key],0)):null;
 const groups=BID_WBS.map(code=>{const rows=selected.filter(l=>l.wbs===code);return {code,rows,costTHB:sum(rows,"costTHB"),customerTHB:sum(rows,"customerTHB"),customerUSD:sum(rows,"customerUSD")};});
 const missingSystems=systemTokens.filter(t=>!selected.some(l=>l.systemToken===t&&l.wbs==="A"));
 const missingWbs=BID_WBS.filter(c=>c!=="A"&&c!=="C1"&&!selected.some(l=>l.wbs===c));
 const result={lines,selected,groups,complete,missingSystems,missingWbs,baseTHB:sum(selected.filter(l=>!l.wbs.startsWith("C")),"customerTHB"),baseUSD:sum(selected.filter(l=>!l.wbs.startsWith("C")),"customerUSD"),optionsTHB:sum(selected.filter(l=>l.wbs.startsWith("C")),"customerTHB"),optionsUSD:sum(selected.filter(l=>l.wbs.startsWith("C")),"customerUSD"),knownTHB:sum(selected.filter(l=>l.customerTHB!==null),"customerTHB"),selectedTHB:sum(selected,"customerTHB"),selectedUSD:sum(selected,"customerUSD"),releaseAllowed:false,releaseState:"HOLD",scopeComplete:missingSystems.length===0&&missingWbs.length===0,revision:data.revision};
 return {...result,official:deriveOfficialPricing(data,result,reviewDate),provisional:deriveProvisionalPricing(data,result)};
}
