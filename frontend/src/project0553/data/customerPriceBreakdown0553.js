import {buildOfficialUsdRelease0553} from "./officialUsdRelease0553";
import {buildRawCustomerPriceBreakdown0553} from "./customerPriceBreakdownCore0553";
export {breakdownKey0553,allocateBreakdown0553} from "./customerPriceBreakdownCore0553";
export function buildCustomerPriceBreakdown0553(source,official=buildOfficialUsdRelease0553(source)){
 const checked=buildRawCustomerPriceBreakdown0553(source,official);
 if(!official.customerPriceBreakdown)return checked;
 const selected=official.customerPriceBreakdown;
 for(const group of checked.groups){
  const target=selected.groups.find(x=>x.code===group.code);
  if(!target||target.parentUSD!==group.parentUSD||target.rows.length!==group.rows.length||
   group.rows.some((x,i)=>x.key!==target.rows[i].key||x.customerSellTHB!==target.rows[i].customerSellTHB||x.qty!==target.rows[i].qty))
   throw Error(group.code+" stale rounded breakdown/source");
 }
 return selected;
}

// Explicit export allowlist. Do not serialize internal source objects into the customer workbook.
function customerDescription(row){
 if(row.customerBudgetIncluded&&row.code==='A3'&&row.id.endsWith('-JB'))
  return 'Explosion-proof junction box, terminals and cable glands in accordance with MTO C1.';
 if(row.customerBudgetIncluded&&row.code==='A3')
  return 'Certified cable glands, plugs and bonding in accordance with MTO C1.';
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
  remark:r.customerBudgetIncluded?"Included in quoted Part A budget; no additional charge.":r.status==="INCLUDED"?"Included in package; no separate charge":
   r.status==="NOT PRICED"?"Not priced; scope confirmation required":
   r.quantityPending?"Quantity / unit confirmation required":""}));
}
