import {buildB10OfficialItemizedAnnex0553} from "./b10OfficialItemizedAnnex0553";
import {buildOtherSpareItemizedPresentation0553} from "./otherSpareItemizedPresentation0553";
// Customer presentation derived only from the current 10.3.3 release model.
// The commercial conversion/rounding layer never writes back to Working THB.
export const OFFICIAL_USD_POLICY_0553=Object.freeze({thbPerUsd:31.5,incrementUSD:100,rounding:"UP_PER_SUMMARY_LINE"});
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
 B14:"Commercial bonds and insurance in accordance with contract requirements.",
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
export function buildOfficialUsdRelease0553(source,policy=OFFICIAL_USD_POLICY_0553){
 const line=(r,thb)=>{
  if(r.offerTreatment?.status==="NOT_QUOTED_EXCLUDED"&&Number.isFinite(thb))
   throw Error(r.code+" excluded offer cannot carry a quoted price");
  return {code:r.code,description:descriptions[r.code]||r.description,
  serviceText:serviceText(r.serviceCommercialBasis),qty:1,unit:"lot",amountUSD:quoteUsd0553(thb,policy),
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
   const budgetUsd=quoteUsd0553(r.budgetaryOptionOfferTHB,policy);
   if(budgetUsd!==r.budgetaryOptionOfferUSD)
    throw Error("0553 option quote USD must match canonical 10.3 Source→Release rounding");
   return {...normal,budgetaryOptionQuoteUSD:budgetUsd,
    budgetaryOptionOfferTHB:r.budgetaryOptionOfferTHB,conditionalPriceState:r.budgetaryOfferStatus,
    budgetaryOfferSourceId:r.budgetaryOfferSourceId,budgetaryOfferSourceModuleId:r.budgetaryOfferSourceModuleId,
    budgetaryOfferPrepared:true,firmOemQuote:false,optionExcludedFromBase:true};
  });
 const rows=[...a,...b,...c],annex={};
 for(const code of ["B10","B11","B13","C1","C2"]){
  const items=source.annex[code]||[],parent=rows.find(r=>r.code===code);
  if(items.length!==specifications[code].length||new Set(items.map(r=>r.sourceId)).size!==items.length||items.some(r=>!specificationById[r.sourceId]||!r.sourceId.startsWith(code+"-PTTEP-")))throw Error(code+" customer description mapping needs review");
  if(parent.amountUSD!==null&&Math.abs(items.reduce((n,r)=>n+(r.customerTotalTHB||0),0)-parent.sourceTHB)>0.02)throw Error(code+" source annex total differs from Release");
  annex[code]=allocateAnnex(items.map((r,i)=>({code,sourceId:r.sourceId,sourceRowModuleId:r.sourceRowModuleId,traceId:r.traceId,sourceTHB:r.customerTotalTHB,
   tagNo:r.tagNo||"COMMON",description:r.description.replace("readiness reserve","set"),
   specification:specificationById[r.sourceId],materials:"Subject to approved OEM specification",qty:r.qty,
   leadTime:"To be confirmed"})),parent.amountUSD);
 }
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
