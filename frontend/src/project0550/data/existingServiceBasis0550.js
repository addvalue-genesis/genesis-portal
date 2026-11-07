import {mgwReplacementActive0550} from "./mgwQuoteSelection0550";
import {getProject0550Dataset} from './repository';
import {getProject0550References} from './referenceRepository';
import {MGW_QUOTE_0550,mgwQuoteItem0550} from './mgwVendorBasis0550';
import {workingOffers0550} from './workingOffers0550';
// Read the actual preserved registries. Availability and adoption are separate states.
export function existingServiceBasis0550(data){
 const dataset=getProject0550Dataset(),reference=getProject0550References(),b1=reference.b1CostLineage;
 const adoptedOfferIds=new Set(data.lines.filter(l=>l.selected&&!l.coveredByLineId&&l.responsibility!=='COMPANY').flatMap(l=>workingOffers0550(data,l).map(o=>o.id)));
 const serviceQuotes=(mgwReplacementActive0550(data)?[]:MGW_QUOTE_0550.rows).filter(r=>r.section==='SERVICES').map(row=>{const offers=data.offers.filter(o=>mgwQuoteItem0550(o)?.id===row.id),offer=offers.length===1?offers[0]:null;return {id:row.id,title:offer?.description||row.description,quantity:row.quantity,unit:row.unit,currency:offer?.currency||MGW_QUOTE_0550.currency,unitCost:offer?offer.unitCost:row.unitCost,amount:offer&&Number.isFinite(offer.unitCost)?offer.unitCost*row.quantity:offer?null:row.extended,offerId:offer?.id||'',selected:offer?adoptedOfferIds.has(offer.id):false,sourceRef:MGW_QUOTE_0550.sourceName+' / p'+row.page,scopeState:'SUPPLIER_BUNDLE_BOUNDARY_REVIEW'};});
 const paga=dataset.commercialSources.find(s=>s.offerNo==='A20261632'),pagaSelected=data.offers.some(o=>adoptedOfferIds.has(o.id)&&o.quoteRef===paga?.offerNo);
 const included=pagaSelected?(paga?.priceGroups||[]).filter(r=>['22030','23010','24010','18010','18020','18050'].includes(r.code)).map(r=>({...r,currency:paga.currency,quoteRef:paga.offerNo,state:'SOURCE_GROUP_INCLUDED_IN_SELECTED_PACKAGE_NOT_ADDITIVE',note:'Quoted group before package discount; not an additional charge or a complete SI activity.'})):[];
 return {snapshotId:dataset.meta.datasetId,snapshotDate:dataset.meta.snapshotDate,referenceAuthority:reference.meta.authority,source:b1.source,b1Groups:b1.groups,roles:dataset.coreTeam,campaigns:dataset.executionCampaigns,methods:reference.serviceLineDerivation,allowances:[...dataset.budgetaryEstimate.partB,...dataset.budgetaryEstimate.partC],serviceQuotes,included,
  b1RecoveredThb:b1.recoveredBottomUpThb,b1AllowanceThb:b1.currentAllowanceThb,b1ReconciliationThb:b1.reconciliationGapThb};
}
