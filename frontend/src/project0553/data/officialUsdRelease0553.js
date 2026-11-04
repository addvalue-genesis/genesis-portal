import {buildRawCustomerPriceBreakdown0553} from "./customerPriceBreakdownCore0553";
import {allocateFixedParent} from "../../common/cost/quotationRounding";
import {roundQuotedRowsUp0553,roundQuoteUnitUp0553} from "./quoteUnitRounding0553";
import {selectOptionBudgetaryOffer0553} from "./optionBudgetaryOffer0553";
import {roundAnnexUnitPrices0553} from "./c1SiTagBudget0553";
import {buildB10OfficialItemizedAnnex0553} from "./b10OfficialItemizedAnnex0553";
import {buildOtherSpareItemizedPresentation0553} from "./otherSpareItemizedPresentation0553";
import SUBMITTED_SAMTEL_REV02_0553 from "./snapshots/submitted.samtel.rev02.20261030.json";
import CURRENT_RELEASE_REV03_0553 from "./snapshots/release.rev03.20261103.json";
const freezeRelease0553=value=>{
 if(value&&typeof value==="object"&&!Object.isFrozen(value)){
  Object.values(value).forEach(freezeRelease0553);Object.freeze(value);
 }
 return value;
};
const submittedRev02=freezeRelease0553(SUBMITTED_SAMTEL_REV02_0553);
export const selectSubmittedRev02Release0553=()=>submittedRev02;
export const RELEASE_PRICE_REFERENCE_0553=freezeRelease0553(CURRENT_RELEASE_REV03_0553);
export const selectCurrentReleaseRev03_0553=()=>RELEASE_PRICE_REFERENCE_0553;
export const MTO_C1_RELEASE_CONFIRMATION_0553=Object.freeze({
 date:"2026-11-03",authority:"PROJECT_OWNER_USER",releaseRevision:"Rev02",
 releaseSourceDriveId:"14WGYqVhcrqxL0CVvrcT95yQ8nosYwgMt",
 releaseBaseUSD:902900,priceChangeUSD:0,
 mto:"MM-ZTK-1F-GEN-TEL-MTO-0001 Rev.C1",
 scope:"All materials and associated costs marked Supplied by Telecom Vendor are included in the submitted commercial proposal.",
 submittedPriceUnchanged:true,internalCostFinalizationPending:true,
 supplierTechnicalApproval:false,confirmationEmailSent:false
});
// Customer presentation derived only from the current 10.3.3 release model.
// The commercial conversion/rounding layer never writes back to Working THB.
export const OFFICIAL_USD_POLICY_0553=Object.freeze({thbPerUsd:31.5,incrementUSD:100,rounding:"UP_UNIT_TO_TENS_THEN_ROLLUP",unitIncrementUSD:10,summarySeedRounding:"UP_PER_SUMMARY_LINE"});
// The legacy export name remains stable; current target prices come from the
// owner's Rev03 reference, while the submitted Rev02 archive stays immutable.
export const PART_A_SUBMITTED_PRICE_HOLD_0553=Object.freeze({
 date:"2026-11-03",authority:"PROJECT_OWNER_USER",
 baseline:RELEASE_PRICE_REFERENCE_0553.filename,
 revision:RELEASE_PRICE_REFERENCE_0553.revision,
 sourceWorkbookSha256:RELEASE_PRICE_REFERENCE_0553.sourceWorkbookSha256,
 sourceLibraryFileId:RELEASE_PRICE_REFERENCE_0553.libraryFileId,
 quotedUSD:Object.freeze(Object.fromEntries(RELEASE_PRICE_REFERENCE_0553.rows.filter(r=>["A1","A2","A3"].includes(r.code)).map(r=>[r.code,r.amountUSD]))),
 scope:"Telecom Vendor materials in MTO-0001 C1, 29-Oct-2026, included within existing Part A budget; no additional Part A charge",
 internalBudgetTransferAllowed:true,additionalPartAChargeUSD:0,
 directCostComplete:false,technicalApproval:false,customerIssued:false,
 note:"Use the owner-provided Rev03 commercial targets with current Source/Working detail. Retain ZWP11 new cabinet cost, superseded LNA nonposting treatment and the restored telephone JB allowance. Allocate current priced rows to Rev03 A1/A2/A3 totals, without changing supplier cost, FX, quantities or markup. The submitted Rev02 archive remains unchanged."
});
export const OFFICIAL_SHEETS_0553=Object.freeze([
 ["Scope of supply","SUMMARY"],["B10 CommSpares","B10"],["B11 SpecialTool","B11"],
 ["B13 Consumerables","B13"],["C1 CapitalSpares","C1"],["C2 2Y-Spares","C2"]
]);
const descriptions={
 B1:"Engineering and design; project management and coordination; Myanmar import and operating approval services, including applicable government fees.",
 B2:"Engineering documentation, test procedures and reports, as-built documents and final dossier in accordance with the VDRL.",
 B3:"Inspection, testing and certification. Preparation and FAT at SAMTEL Warehouse: 2 days plus 1 reserve day; shared facilities, test tools and closeout. Survey and offshore SAT included as specified below.",
 B4:"Painting and protective coating in accordance with the specification, where required.",
 B5:"Export packing, preservation and shipping marks in accordance with packing and shipping instructions.",
 B6:"Transportation, export documentation and cargo insurance to CIF Zhuhai Port, China (Incoterms 2020); import/export administration and supporting documents for JUTAL.",
 B7:"Additional storage allowance beyond included storage.",
 B8:"End-user training at SAMTEL Warehouse: 1 day plus 1 reserve day; OEM online instruction with ADDVALUE onsite facilitation, training materials and session facilities.",
 B9:"Onshore specialist assistance at JUTAL Zhuhai Fabrication Yard, including configuration, integration, mobilisation and accommodation.",
 B10:"Erection, pre-commissioning, commissioning and start-up spares. Refer to Annex B10.",
 B11:"Special tools for operation and maintenance. Refer to Annex B11.",
 B12:"First-filling materials, where required by the equipment specification.",
 B13:"Consumables for preservation, operation and maintenance. Refer to Annex B13.",
 B14:"Budgetary insurance allowance for ADDVALUE services in accordance with the stated scope and qualifications.",
 C1:"Capital spares. Refer to Annex C1.",
 C2:"Two years of normal operation spare parts. Refer to Annex C2."
};
const annexTitles={B10:"Erection, Pre-commissioning, Commissioning and Start-up Spares",B11:"Special Tools for Operation and Maintenance",B13:"Preservation, Operation and Maintenance Consumables",C1:"Capital Spares",C2:"Two-year Operation Spare Parts"};
// Customer wording retains unresolved technical selection without internal budget instructions.
const specifications={
 B10:["SCADA/L3 fuses, power injector and Ethernet/RF protection; PLC spares excluded.","RF surge/coupler, feeder termination and Ex seal parts; complete BDA assembly excluded.","Handset/sounder service parts, Ex glands/seals and CAT6A re-termination parts.","Fuse, control-box gasket, Ex gland and service materials; complete RACON assembly excluded."],
 B11:["SCADA configuration and network-monitoring tools; excludes licences supplied in Part A.","OEM service/configuration tools for the selected RFI BDA system.","OEM service tools; temporary contractor test equipment excluded.","RACON configuration/charging tools where required and not included in the equipment supply."],
 B13:["Replacement desiccant and preservation sets; final frequency subject to the approved preservation procedure.","Cleaning and re-termination materials; installed cables and permanent glands excluded.","Replacement seals and inspection labels for shared project use."],
 C1:["SeaBeacon 2 System 6 X/S compatible complete assembly; final Ex certification and configuration subject to OEM confirmation."],
 C2:Array(4).fill("OEM operating spare parts list, quantities and lead times to be confirmed; commissioning spares excluded.")
};
const specificationById=Object.fromEntries(Object.entries(specifications).flatMap(([code,items])=>items.map((text,i)=>[code+"-PTTEP-"+String(i+1).padStart(2,"0"),text])));
const round2=n=>Math.round((n+Number.EPSILON)*100)/100;
export function quoteUsd0553(thb,policy=OFFICIAL_USD_POLICY_0553){
 if(!Number.isFinite(policy.thbPerUsd)||policy.thbPerUsd<=0||!Number.isFinite(policy.incrementUSD)||policy.incrementUSD<=0)throw Error("Invalid quotation FX or rounding increment");
 if(thb===null||thb===undefined)return null;
 if(!Number.isFinite(thb)||thb<0)throw Error("Invalid source price");
 if(thb===0)return 0;
 return Math.ceil((thb/policy.thbPerUsd)/policy.incrementUSD-1e-10)*policy.incrementUSD;
}
function serviceText(s){
 if(!s)return "";
 const rates=key=>s.roles.map(r=>r[key]===null?"TBC":r[key].toLocaleString("en-US",{maximumFractionDigits:2})).join(" / ");
 return `Included: ${s.crew} persons; ${s.workDays} working days${s.travelDays===null?`; ${s.normalHoursPerDay} hours/day`:` + ${s.travelDays} travel days/person`}.\n`+
 `Additional labour (Senior / Field): USD ${rates("dayUSD")}/person/day.\n`+
 (s.normalHoursPerDay?`Proposed OT after ${s.normalHoursPerDay} hours/day: USD ${rates("proposedOtUSDPerHour")}/person/hour.\n`:"Onshore working hours and OT rates: to be agreed.\n")+
 `Proposed standby: USD ${rates("proposedStandbyUSDPerDay")}/person/day. Additional services require written agreement; extra travel/accommodation excluded; no overlapping time charges.`;
}
function allocateAnnex(rows,target){
 if(target===null)return rows.map(r=>({...r,unitUSD:null,totalUSD:null}));
 if(!rows.length||rows.some(r=>!Number.isFinite(r.sourceTHB)||!Number.isFinite(r.qty)||r.qty<=0))throw Error("Priced annex has incomplete source quantities/prices");
 const base=rows.reduce((s,r)=>s+r.sourceTHB,0),cents=Math.round(target*100);
 if(base<=0)throw Error("Annex allocation requires a positive source total");
 const parts=rows.map((r,i)=>{const exact=cents*r.sourceTHB/base;return {i,value:Math.floor(exact),fraction:exact-Math.floor(exact)};});
 let left=cents-parts.reduce((s,r)=>s+r.value,0);
 const order=[...parts].sort((a,b)=>b.fraction-a.fraction||a.i-b.i);
 for(let i=0;i<left;i++)order[i%order.length].value++;
 return rows.map((r,i)=>{
  const totalUSD=parts[i].value/100,unitUSD=Math.round(totalUSD/r.qty*10000)/10000;
  if(round2(unitUSD*r.qty)!==totalUSD)throw Error("Annex quantity/unit precision cannot reconcile");
  return {...r,unitUSD,totalUSD};
 });
}
function buildOfficialUsdReleaseSeed0553(source,policy){
 const line=(r,thb)=>{
  if(r.offerTreatment?.status==="NOT_QUOTED_EXCLUDED"&&Number.isFinite(thb))
   throw Error(r.code+" excluded offer cannot carry a quoted price");
  return {code:r.code,description:descriptions[r.code]||r.description,
  serviceText:serviceText(r.serviceCommercialBasis),qty:1,unit:"lot",amountUSD:quoteUsd0553(thb,{...policy,incrementUSD:policy.seedIncrementUSD??policy.incrementUSD}),
  offerTreatment:r.offerTreatment||null,
  priceText:r.offerTreatment?.priceText||null,commercialRemark:r.offerTreatment?.remark||"",
  sourceTHB:thb??null,sourceModuleId:r.sourceModuleId||r.moduleId,
  locations:[...new Set((r.sourceRows||[]).map(x=>x.site).filter(Boolean))].join(", "),mr:r.mr||""};
 };
 const a=source.a.map(r=>line(r,r.previewSellTHB)),b=source.b.map(r=>line(r,r.customerSellTHB)),
  c=source.c.map(r=>{
   const normal=line(r,r.customerSellTHB);
   if(!r.budgetaryOfferPrepared||!Number.isFinite(r.budgetaryOptionOfferTHB)||
      !Number.isFinite(r.budgetaryOptionOfferUSD)||Number.isFinite(normal.amountUSD)||
      r.customerOfferIssued!==false||r.firmOemQuote!==false)
    throw Error("0553 C1/C2 conditional budgetary option quote lacks source price authority");
   const option=selectOptionBudgetaryOffer0553().offers[r.code];
   if(policy.thbPerUsd!==31.5||option.sourceSellTHB!==r.budgetaryOptionOfferTHB)throw Error("Option source/FX mismatch");
   const budgetUsd=option.budgetaryQuoteUSD;
   if(budgetUsd!==r.budgetaryOptionOfferUSD)
    throw Error("0553 option quote USD must match canonical 10.3 Source→Release rounding");
   return {...normal,budgetaryOptionQuoteUSD:budgetUsd,
    budgetaryOptionOfferTHB:r.budgetaryOptionOfferTHB,conditionalPriceState:r.budgetaryOfferStatus,
    budgetaryOfferSourceId:r.budgetaryOfferSourceId,budgetaryOfferSourceModuleId:r.budgetaryOfferSourceModuleId,
    budgetaryOfferPrepared:true,firmOemQuote:false,optionExcludedFromBase:true};
  });
 for(const row of a){
  row.commercialScopeInclusion=PART_A_SUBMITTED_PRICE_HOLD_0553.scope;
  const fixedUSD=PART_A_SUBMITTED_PRICE_HOLD_0553.quotedUSD[row.code];
  if(fixedUSD!==undefined){
   row.costDerivedSeedUSD=row.amountUSD;
   row.amountUSD=fixedUSD;
   row.commercialPriceHold=PART_A_SUBMITTED_PRICE_HOLD_0553;
  }
 }
 const rows=[...a,...b,...c],annex={};
 for(const code of ["B10","B11","B13","C1","C2"]){
  const items=source.annex[code]||[],parent=rows.find(r=>r.code===code);
  if(items.length!==(code==="B10"?3:specifications[code].length)||new Set(items.map(r=>r.sourceId)).size!==items.length||items.some(r=>!specificationById[r.sourceId]||!r.sourceId.startsWith(code+"-PTTEP-")))throw Error(code+" customer description mapping needs review");
  if(parent.amountUSD!==null&&Math.abs(items.reduce((n,r)=>n+(r.customerTotalTHB||0),0)-parent.sourceTHB)>0.02)throw Error(code+" source annex total differs from Release");
  annex[code]=allocateAnnex(items.map((r,i)=>({code,sourceId:r.sourceId,sourceRowModuleId:r.sourceRowModuleId,traceId:r.traceId,sourceTHB:r.customerTotalTHB,
   tagNo:r.tagNo||"COMMON",description:r.description.replace("readiness reserve","set"),
   specification:specificationById[r.sourceId],materials:"Subject to approved OEM specification",qty:r.qty,
   leadTime:"To be confirmed"})),parent.amountUSD);
 }
 // Round unit prices at the Official owner; all downstream B13 views/exports
 // consume these same rows. Original THB source and total USD1500 stay intact.
 annex.B10=roundAnnexUnitPrices0553(annex.B10.map(x=>({...x,id:x.sourceId,quantity:x.qty,sourceTotalUSD:x.totalUSD})),b.find(x=>x.code==="B10").amountUSD,1,{residualMetric:"squared"});
 annex.B13=roundAnnexUnitPrices0553(annex.B13.map(x=>({...x,id:x.sourceId,quantity:x.qty,sourceTotalUSD:x.totalUSD})),b.find(x=>x.code==="B13").amountUSD,1,{residualMetric:"squared"});
 const known=[...a,...b].filter(r=>r.amountUSD!==null);
 const document={moduleId:"bid.budget.pricing.official",sourceModuleId:"bid.budget.pricing.release.preview",currency:"USD",
  policy:{...policy},a,b,c,annex,annexTitles,project:"ZAWTIKA DEVELOPMENT PROJECT PHASE 1F",
  totalUSD:known.length?round2(known.reduce((s,r)=>s+r.amountUSD,0)):null,
  unpriced:[...a,...b].filter(r=>r.amountUSD===null&&r.offerTreatment?.status!=="NOT_QUOTED_EXCLUDED").map(r=>r.code),
  excluded:b.filter(r=>r.offerTreatment?.status==="NOT_QUOTED_EXCLUDED").map(r=>r.code),
  unroundedUSD:round2(known.reduce((s,r)=>s+r.sourceTHB/policy.thbPerUsd,0)),
  issued:false};
 return {...document,b10ItemizedAnnex:buildB10OfficialItemizedAnnex0553(document),
  otherSpareItemizedAnnex:buildOtherSpareItemizedPresentation0553(document)};
}

// The quoted customer USD authority. Round children once, then roll parents up.
// Working THB costs, quantities, FX and markup remain immutable source evidence.
export function buildOfficialUsdRelease0553(source,policy=OFFICIAL_USD_POLICY_0553){
 const seed=buildOfficialUsdReleaseSeed0553(source,policy);
 const raw=buildRawCustomerPriceBreakdown0553(source,seed);
 const groups=raw.groups.map(g=>{
  if(g.parentUSD===null)return {...g,rows:g.rows.map(x=>({...x}))};
  if(Object.hasOwn(PART_A_SUBMITTED_PRICE_HOLD_0553.quotedUSD,g.code)){
   const fixedUSD=PART_A_SUBMITTED_PRICE_HOLD_0553.quotedUSD[g.code];
   // A fixed customer total is allocated to its existing priced rows in USD10
   // units. Upward rounding every row would increase the approved total.
   const priced=g.rows.filter(r=>r.amountUSD!==null&&r.customerSellTHB>0);
   if(fixedUSD%10!==0||!priced.length||priced.some(r=>r.qty!==1))
    throw Error(g.code+" fixed price allocation requires USD10 total and one-set source rows");
   const shares=allocateFixedParent(priced.map(r=>({id:r.key,qty:r.qty,weight:r.customerSellTHB})),fixedUSD,10);
   const byKey=new Map(shares.map(r=>[r.id,Number(r.amount)]));
   const rows=g.rows.map(r=>byKey.has(r.key)?{...r,preFixedPriceAmountUSD:r.amountUSD,
    unitUSD:byKey.get(r.key),amountUSD:byKey.get(r.key),unitRoundingUSD:10,
    commercialAllocation:"OWNER_FIXED_TOTAL_IN_USD10_UNITS"}:{...r});
   const totalUSD=rows.reduce((n,r)=>n+(r.amountUSD||0),0);
   if(totalUSD!==fixedUSD)throw Error(g.code+" fixed customer price changed");
   return {...g,rows,parentUSD:fixedUSD,totalUSD,varianceUSD:0,matched:true,
    commercialPriceHold:PART_A_SUBMITTED_PRICE_HOLD_0553};
  }
  const rows=roundQuotedRowsUp0553(g.rows,{amountKey:"amountUSD"});
  if(rows.some(x=>x.amountUSD!==null&&x.unitUSD===null))throw Error(g.code+" cannot round unknown priced unit");
  const totalUSD=Math.round(rows.reduce((n,x)=>n+(x.amountUSD||0),0)*100)/100;
  return {...g,rows,preTensParentUSD:g.parentUSD,parentUSD:totalUSD,totalUSD,varianceUSD:0,matched:true};
 });
 const a=seed.a.map(x=>{const amountUSD=groups.find(g=>g.code===x.code).totalUSD;return amountUSD===x.amountUSD?x:{...x,preTensAmountUSD:x.amountUSD,amountUSD};});
 const b10Parents=roundQuotedRowsUp0553(seed.annex.B10);
 const b13Rows=roundQuotedRowsUp0553(seed.annex.B13);
 const b=seed.b.map(x=>{const amountUSD=x.code==="B10"?b10Parents.reduce((n,r)=>n+r.totalUSD,0):
  x.code==="B13"?b13Rows.reduce((n,r)=>n+r.totalUSD,0):roundQuoteUnitUp0553(x.amountUSD);return amountUSD===x.amountUSD?x:{...x,preTensAmountUSD:x.amountUSD,amountUSD};});
 const annex={...seed.annex,B10:b10Parents,B13:b13Rows};
 const document={...seed,policy:{...seed.policy,seedIncrementUSD:policy.seedIncrementUSD??policy.incrementUSD,incrementUSD:10},a,b,annex,totalUSD:Math.round([...a,...b].reduce((n,x)=>n+(x.amountUSD||0),0)*100)/100,
  quotedUnitRounding:{incrementUSD:10,direction:"UP",fixedTotalAllocationExceptions:Object.keys(PART_A_SUBMITTED_PRICE_HOLD_0553.quotedUSD),rollup:"SUM_ROUNDED_CHILD_AMOUNTS",workingTHBUnchanged:true},
  commercialPriceHold:PART_A_SUBMITTED_PRICE_HOLD_0553,releasePriceReference:RELEASE_PRICE_REFERENCE_0553,
  preTensTotalUSD:seed.totalUSD};
 const prior=seed.otherSpareItemizedAnnex;
 const b13=prior.rows.B13.map(x=>{const priced=b13Rows.find(r=>r.sourceId===x.sourceId);return {...x,preTensUnitUSD:x.unitUSD,preTensTotalUSD:x.totalUSD,unitUSD:priced.unitUSD,totalUSD:priced.totalUSD,roundingAdjustmentUSD:Math.round((priced.totalUSD-x.sourceTotalUSD)*100)/100};});
 document.b10ItemizedAnnex=buildB10OfficialItemizedAnnex0553(document);
 document.otherSpareItemizedAnnex={...prior,rows:{...prior.rows,B13:b13},summaries:{...prior.summaries,
  B13:{...prior.summaries.B13,totalUSD:b.find(x=>x.code==="B13").amountUSD,unitRoundingUSD:10}}};
 const isMtoBudgetIncluded=r=>r.status==="NOT PRICED"&&(
  (r.code==="A2"&&/-BDA-M20-GLANDS$|-BDA-RF-FEEDTHROUGHS$/.test(r.id))||
  (r.code==="A3"&&/-MGW-PHONE1-JB$|-FIELD-EX-GLANDS$/.test(r.id)));
 const commercialGroups=groups.map(g=>({...g,rows:g.rows.map(r=>isMtoBudgetIncluded(r)?{...r,
  customerBudgetIncluded:true,internalCostStatus:"NOT_PRICED",
  commercialScopeBasis:"OWNER_CONFIRMED_MTO_C1_WITHIN_EXISTING_PART_A_BUDGET"}:r)}));
 document.customerPriceBreakdown={...raw,groups:commercialGroups,totalUSD:document.totalUSD,reconciled:groups.every(g=>g.matched),priceReference:RELEASE_PRICE_REFERENCE_0553};
 return document;
}
