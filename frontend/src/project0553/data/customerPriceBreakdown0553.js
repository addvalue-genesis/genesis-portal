import {selectWorkingBomProjection0553} from "./workingBomAggregation0553";
import {buildOfficialUsdRelease0553} from "./officialUsdRelease0553";

// Presentation only. Parent Release prices remain authoritative. No financial writeback.
export const breakdownKey0553 = row => JSON.stringify([row.mr,row.site,String(row.id)]);
const cents = n => Math.round((n + Number.EPSILON) * 100);
const valid = n => Number.isFinite(n) && n >= 0;

export function allocateBreakdown0553(rows, target) {
 if (!valid(target) || !rows.length || rows.some(r=>!valid(r.customerSellTHB)))
  throw Error("Breakdown requires valid parent and source prices");
 const total=rows.reduce((s,r)=>s+r.customerSellTHB,0), budget=cents(target);
 if (!Number.isSafeInteger(budget) || (total===0 && budget!==0)) throw Error("Invalid breakdown allocation total");
 const parts=rows.map(r=>{
  const exact=total===0?0:budget*r.customerSellTHB/total;
  return {key:breakdownKey0553(r),value:Math.floor(exact),fraction:exact-Math.floor(exact)};
 });
 if(new Set(parts.map(p=>p.key)).size!==parts.length)throw Error("Duplicate breakdown source identity");
 const left=budget-parts.reduce((s,p)=>s+p.value,0);
 const order=[...parts].sort((a,b)=>b.fraction-a.fraction||(a.key<b.key?-1:a.key>b.key?1:0));
 if(left<0||left>parts.length)throw Error("Breakdown rounding cannot reconcile");
 for(let i=0;i<left;i++)order[i].value++;
 return new Map(parts.map(p=>[p.key,p.value/100]));
}

export function buildCustomerPriceBreakdown0553(source, official=buildOfficialUsdRelease0553(source)) {
 const groups=source.a.map(parent=>{
  const release=official.a.find(r=>r.code===parent.code);
  if(!release||release.sourceTHB!==parent.previewSellTHB)throw Error(parent.code+" stale Release/source price");
  const projection=selectWorkingBomProjection0553({mr:parent.mr});
  const keys=projection.lines.map(breakdownKey0553);
  if(new Set(keys).size!==keys.length)throw Error(parent.code+" duplicate source rows");
  const priced=new Map(parent.sourceRows.map(r=>[breakdownKey0553(r),r]));
  if(priced.size!==parent.sourceRows.length || projection.lines.filter(r=>r.counted).length!==priced.size ||
     projection.lines.some(r=>r.counted&&!priced.has(breakdownKey0553(r))))throw Error(parent.code+" orphan Release/source row");
  const lineTotal=parent.sourceRows.reduce((s,r)=>s+(r.customerSellTHB??0),0);
  if(valid(parent.previewSellTHB)&&Math.abs(lineTotal-parent.previewSellTHB)>0.01*(parent.sourceRows.length+1))
   throw Error(parent.code+" source price sum differs from parent");
  const amounts=release.amountUSD===null?new Map():allocateBreakdown0553(parent.sourceRows,release.amountUSD);
  const rows=projection.lines.map(line=>{
   const key=breakdownKey0553(line),row=priced.get(key),item=line.item||{};
   const included=!!(item.priceInclusion||item.parentPackage);
   const qty=row?.qty??item.sourceQty??item.qty??null;
   const amountUSD=amounts.get(key)??null;
   let unitUSD=Number.isFinite(amountUSD)&&Number.isFinite(qty)&&qty>0?Math.round(amountUSD/qty*1e8)/1e8:null;
   if(unitUSD!==null&&cents(unitUSD*qty)!==cents(amountUSD))unitUSD=null;
   return {key,code:parent.code,mr:parent.mr,site:line.site,id:String(line.id),
    tag:row?.tag||line.tag||"TBC",qty,unit:row?.unit||item.sourceUnit||item.unit||"TBC",
    description:row?.description||item.description||item.role||"Equipment detail to be confirmed",
    specification:row?.specification||item.sku||"To be confirmed",
    sourceModuleId:"bid.budget.bom.system-location-mto",sourceRef:line.source,
    sourceStatus:item.status||"REVIEW",parentPackage:item.parentPackage||null,
    customerSellTHB:row?.customerSellTHB??null,amountUSD,unitUSD,
    status:included?"INCLUDED":amountUSD!==null?"PRICED": "NOT PRICED",
    quantityPending:amountUSD!==null&&(unitUSD===null||!row?.unit)};
  });
  const totalUSD=rows.some(r=>r.amountUSD!==null)?rows.reduce((s,r)=>s+cents(r.amountUSD??0),0)/100:null;
  const varianceUSD=totalUSD!==null&&release.amountUSD!==null?(cents(totalUSD)-cents(release.amountUSD))/100:null;
  return {code:parent.code,mr:parent.mr,description:release.description,rows,
   parentUSD:release.amountUSD,totalUSD,varianceUSD,
   pricedCount:rows.filter(r=>r.status==="PRICED").length,
   includedCount:rows.filter(r=>r.status==="INCLUDED").length,
   pendingCount:rows.filter(r=>r.status==="NOT PRICED").length,
   quantityPendingCount:rows.filter(r=>r.quantityPending).length,
   sourceComplete:parent.costComplete,matched:varianceUSD===0};
 });
 return {groups,currency:"USD",totalUSD:official.totalUSD,issued:false,
  baselineState:"SUBMITTED_PROPOSAL_NOT_VERIFIED",reconciled:groups.every(g=>g.matched),
  releaseAllowed:false};
}

// Explicit export allowlist. Do not serialize internal source objects into the customer workbook.
function customerDescription(row){
 const suffixes={
  'A2':[
   ['-RFI-BDA-EXD-ENCLOSURE','WAROM HRMD95-VIIIB Ex d enclosure supplied with the RFI BDA package.'],
   ['-BULK-EX-SURGE','PolyPhaser IS-B50LN-C2 and Solexy RXNMS0200JX0; complete Ex assembly compliance to be confirmed.']
  ],
  'A3':[
   ['-PHONE','Auteldac 6 Zone 1 VoIP telephone'],['-HORN','EATON sounder, 12–48 VDC; two M20 entries'],
   ['-JB','Explosion-proof junction box, terminals and cable glands; supply scope to be confirmed.'],
   ['-FIELD-EX-GLANDS','Certified cable glands, plugs and bonding; supply scope to be confirmed.']
  ],
  'A4':[
   ['-BFOU-CABLE','RACON field cables; supply scope to be confirmed.'],
   ['-FIELD-GLANDS','RACON cable glands; supply scope to be confirmed.'],
   ['-TOOLS-TEST','RACON factory testing; scope to be confirmed.'],
   ['-PROGRAMMING-KIT','RACON purge kit and programming cable; adapter/charger compatibility to be confirmed.']
  ]
 };
 if(row.code==='A3'&&row.status==='PRICED')return 'Explosion-proof telephone and sounder set';
 if(row.code==='A4'&&row.status==='PRICED')return 'RACON system';
 return (suffixes[row.code]||[]).find(([suffix])=>row.id.endsWith(suffix))?.[1]||row.description;
}
export function customerBreakdownRows0553(group){
 return group.rows.map((r,i)=>({item:group.code+"."+(i+1),site:r.site,
  tag:r.tag===r.id&&/(?:MGW|MR000)/.test(r.tag)?"TBC":r.tag,
  description:customerDescription(r),
  qty:r.qty,unit:r.status==='INCLUDED'?"":r.unit,unitUSD:r.unitUSD,amountUSD:r.amountUSD,
  remark:r.status==="INCLUDED"?"Included in package; no separate charge":
   r.status==="NOT PRICED"?"Not priced; scope confirmation required":
   r.quantityPending?"Quantity / unit confirmation required":""}));
}
