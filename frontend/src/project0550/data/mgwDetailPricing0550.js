import {MGW_QUOTE_0550 as quote,mgwQuoteItem0550,mgwGroupExcluded0550,mgwWorkingLineExcluded0550,mgwProjectWideLineConflict0550,MGW_SCOPE_EXCLUDED_0550,PROCUREMENT_SCOPE_0550,reconcileMgwWorkingScope0550} from "./mgwVendorBasis0550";
import {EXTERNAL_ENGINEERING_MGW_GROUPS_0550,EXTERNAL_ENGINEERING_POLICY_0550,policyDefaults0550} from "../bidWorkingBasis0550";
import {roundMoney0550,sumMoney0550} from "./money0550";
import {evaluateServiceEquation} from "../serviceEquationRuntime";
import {TSI_DESIGN_WORKLOAD_0550} from "./tsiActivityBudget0550";
import {quoteValidity0550} from "./quoteValidity0550";

// 29-Oct-2026 user decision: price the detailed MGW scope despite cover errors.
// This prices quoted scope; it does not certify MR quantities or adequacy.
// Generated workflow note. It belongs in Working diagnostics, not the C1 paper.
export const mgwDetailCustomerRemark0550=id=>'Draft price for listed quoted scope; final MR quantity, interfaces and scope reconciliation pending.'+(id==='RADIO-SHARED'?' Shared radio items charged once in A1-07.':id.startsWith('SERVICES-')?' Full quoted MGW service allowance pending scope adjustment; no credit assumed.':'');
export const MGW_DETAIL_PRICING_VERSION_0550="0550-mgw-detail-pricing-20261029-1";
const make=(id,title,systemToken,customerRowCode,rows,select=true,wbs="A")=>({id,title,systemToken,customerRowCode,rowIds:rows.map(r=>r.id),select,wbs});
const section=id=>quote.rows.filter(r=>r.section===id);
const groups=[
 make("CCTV","CCTV — detailed quoted scope","TEL-CCTV","A1-06",section("CCTV")),
 make("LAN","LAN — detailed quoted scope","TEL-LAN","A1-01",section("LAN")),
 make("PABX","PABX / IP telephony — quoted scope","TEL-PABX","A1-04",section("PABX")),
 make("ENTERTAINMENT","Entertainment — quoted scope","TEL-ES","A1-12",section("ENTERTAINMENT")),
 make("BULK","Shared bulk material — one price owner","TEL-FO","A1-13",section("BULK")),
 ...[["DTRS","TEL-RADIO-DTRS","A1-07"],["MARINE","TEL-RADIO-MARINE","A1-08"],["AERO","TEL-RADIO-AERO","A1-09"],["SSB","TEL-RADIO-SSB","A1-10"]].map(([id,system,code])=>make("RADIO-"+id,id+" radio — quoted scope",system,code,section("RADIO").filter(r=>r.systemTokens.length===1&&r.systemTokens[0]===system))),
 make("RADIO-SHARED","Shared radio consoles and antenna cables — one owner in A1-07","COMMON","A1-07",section("RADIO").filter(r=>r.systemTokens.length>1),true),
 make("MET","MET — quoted cover package; no detailed BOM","TEL-MET","A1-14",section("MET")),
 make("NDB","NDB — quoted cover package; no detailed BOM","TEL-NDB","A1-15",section("NDB")),
 make("PAGA-ALTERNATIVE","MGW BOSCH alternative — not INDUSTRONIC","TEL-PAGA","A1-05",section("PAGA").filter(r=>r.wbs==="A"),false),
 ...section("SERVICES").map(r=>{const field=r.id.endsWith("006"),freight=r.id.endsWith("004");return make(r.id.replace("MGW-Q26-063-",""),r.description,"COMMON",field?"B4":freight?"B2":"B1",[r],!field,field?"B4":freight?"B2":"B1");}),
 make("PAGA-STUDY","BOSCH PAGA coverage study alternative","TEL-PAGA","B1",section("PAGA").filter(r=>r.wbs!=="A"),false,"B1")
];
// Internal estimate only. Each cover charge stays a single quoted pool.
export function mgwServiceAllocation0550(){
 const excluded=new Set(PROCUREMENT_SCOPE_0550.directProcurement.flatMap(scope=>scope.mgwExcludedSystemTokens));
 const quotedSystems=new Set(quote.rows.filter(r=>r.wbs==='A'&&Number.isFinite(r.extended)).flatMap(r=>r.systemTokens));
 const drivers=TSI_DESIGN_WORKLOAD_0550.filter(([system])=>quotedSystems.has(system)&&!excluded.has(system));
 const totalDrivers=drivers.reduce((sum,[,driver])=>sum+driver,0);
 const services=section('SERVICES'),priced=services.filter(r=>Number.isFinite(r.extended));
 const totalUSD=sumMoney0550(priced.map(r=>r.extended));
 const allocated=priced.map(r=>0);
 let cumulativeDriver=0;
 const rows=drivers.map(([systemToken,driver])=>{
  cumulativeDriver+=driver;
  // Difference of rounded cumulative shares preserves each quoted pool to the cent.
  const shares=priced.map((row,i)=>{
   const pool=row.extended;
   const cumulativeUSD=roundMoney0550(evaluateServiceEquation('E14',{pool,driver:cumulativeDriver,totalDrivers}).value);
   const amount=roundMoney0550(cumulativeUSD-allocated[i]);
   allocated[i]=cumulativeUSD;
   return amount;
  });
  return {systemToken,driver,shares,totalUSD:sumMoney0550(shares)};
 });
 return {rows,priced,totalDrivers,totalUSD,open:services.filter(r=>!Number.isFinite(r.extended))};
}

export const MGW_DETAIL_GROUPS_0550=groups.filter(g=>!mgwGroupExcluded0550(g.id));
// Legacy group identities remain readable for saved workspaces and frozen issues.
export const mgwDetailGroup0550=id=>groups.find(g=>g.id===id);
export function mgwDetailGroupBasis0550(data,id,line){
 const group=mgwDetailGroup0550(id);if(!group)return null;
 const record=line||data.lines.find(l=>l.mgwDetailGroupId===id);
 const source=record?.mgwDetailBasis||{quoteVersion:quote.version,sourceSha256:quote.sourceSha256,rows:group.rowIds.map(rowId=>{const r=quote.rows.find(r=>r.id===rowId);return {rowId,quantity:r.quantity,unit:r.unit||"U"};})};
 return {version:MGW_DETAIL_PRICING_VERSION_0550,group,source,offers:source.rows.map(row=>data.offers.filter(o=>o.id==="OFFER-"+row.rowId||o.mgwQuoteLineId===row.rowId))};
}
export function mgwDetailGroupPrice0550(data,id,line,today){
 if(mgwGroupExcluded0550(id))return {costUSD:null,problems:[MGW_SCOPE_EXCLUDED_0550]};
 const basis=mgwDetailGroupBasis0550(data,id,line);if(!basis)return {costUSD:null,problems:["MGW pricing group missing"]};
 const problems=[],amounts=[];
 for(let i=0;i<basis.source.rows.length;i++){
  const row=basis.source.rows[i],offers=basis.offers[i],offer=offers[0];
  if(offers.length!==1||!offer||offer.currency!=="USD"||offer.unit!==(row.unit)||!Number.isFinite(offer.unitCost)||offer.unitCost<0){problems.push("MGW source price OPEN / "+row.rowId);continue;}
  if(line?.vendorId&&offer.vendorId!==line.vendorId)problems.push("MGW package vendor mismatch / "+row.rowId);
  if(!offer.quoteRef.trim()||!offer.sourceRef.trim())problems.push("Quote source missing");
  if(!offer.date||!offer.validUntil)problems.push("Quote date/validity missing");
  if(today&&offer.date>today)problems.push("Quote dated in future — confirm source date");
  if(quoteValidity0550(offer,today).expired)problems.push("Quote expired — review replacement source");
  if(line?.selected&&data.lines.some(other=>other.id!==line.id&&other.selected&&!other.coveredByLineId&&(other.offerId===offer.id||mgwDetailGroup0550(other.mgwDetailGroupId)?.rowIds.includes(row.rowId))&&!mgwWorkingLineExcluded0550(data,other)&&!mgwProjectWideLineConflict0550(other,data.offers.find(o=>o.id===other.offerId))))problems.push("MGW_SOURCE_COST_OWNER_DUPLICATE / "+row.rowId);
  amounts.push(offer.unitCost*row.quantity);
 }
 return {costUSD:amounts.length===basis.source.rows.length?sumMoney0550(amounts):null,problems:[...new Set(problems)]};
}
export function prepareMgwDetailPricing0550(data,policies,today){
 data=reconcileMgwWorkingScope0550(data);
 if(data.mgwDetailPricingImport?.version===MGW_DETAIL_PRICING_VERSION_0550)return data;
 const policy=policyDefaults0550(policies,"Goods / Procured Cost");if(!policy)return data;
 const servicePolicy=policyDefaults0550(policies,EXTERNAL_ENGINEERING_POLICY_0550);
 const replacedLineIds=[];
 const replaceIds=["LINE-LEGACY-TEL-RADIO-MARINE-1","LINE-LEGACY-TEL-RADIO-AERO-1","LINE-LEGACY-TEL-RADIO-SSB-1"];
 const next={...data,lines:data.lines.map(l=>{if(replaceIds.includes(l.id)&&l.selected){replacedLineIds.push(l.id);return {...l,selected:false};}return l;})},importedLineIds=[],conflicts=[];
 const originalLines=[...next.lines];
 for(const g of MGW_DETAIL_GROUPS_0550){
  const id="LINE-MGW-DETAIL-"+g.id;
  if(next.lines.some(l=>l.id===id||l.mgwDetailGroupId===g.id))continue;
  // Keep existing user/legacy selection, including partial MR price selections.
  const occupied=originalLines.some(l=>l.selected&&l.wbs[0]===g.wbs[0]&&l.systemToken===g.systemToken&&(l.offerId||l.manualCost!==null&&l.manualCost!==undefined||l.sellRate!==null&&l.sellRate!==undefined));
  const selected=g.select&&!occupied;
  if(g.select&&occupied)conflicts.push(g.id+": existing price owner retained; MGW priced as unselected alternative");
  const basis=`${quote.quoteRef} / ${g.rowIds.join(", ")} / ${quote.sourceUrl}. User instruction 29-Oct-2026: use detailed prices where cover conflicts. One Lot represents the listed quoted scope only, not approved MR quantities. MET/NDB/service cover-only packages retain that source limitation. Bought-in costs use existing Procured Cost policy; OEM inclusions and SI service boundaries require reconciliation.`;
  next.lines.push({id,mgwDetailGroupId:g.id,mgwDetailBasis:mgwDetailGroupBasis0550(data,g.id).source,systemToken:g.systemToken,wbs:g.wbs,description:g.title,scopeKey:"MGW-QUOTED-SCOPE."+g.id,tagRef:"Quoted sites — MR reconciliation pending",requirementRef:"",sourceRef:basis,
   vendorId:data.offers.find(o=>mgwQuoteItem0550(o)?.id===g.rowIds[0])?.vendorId||"",offerId:"",calculationId:"",resultKey:"value",quantity:1,unit:"Lot",currency:"USD",manualCost:null,sellRate:null,markupPct:null,...(EXTERNAL_ENGINEERING_MGW_GROUPS_0550.has(g.id)&&servicePolicy||policy),selected,customerRowCode:g.customerRowCode,customerRemark:mgwDetailCustomerRemark0550(g.id),brand:"",coverageBasis:basis});
  importedLineIds.push(id);
 }
 return {...next,mgwDetailPricingImport:{version:MGW_DETAIL_PRICING_VERSION_0550,date:today,importedLineIds,conflicts,replacedLineIds,decision:PROCUREMENT_SCOPE_0550.mgw.decision}};
}
