import {workingOffers0550} from './workingOffers0550';
import {RETIRED_TOWER_OFFER_0550,RETIRED_TOWER_OWNER_0550} from './towerLegacyPricing0550';

export const requirementSupplierOfferIds0550=requirement=>[...new Set([
 ...(requirement.offerIds||[]),...(requirement.tagBindings||[]).flatMap(binding=>binding.offerIds||[])
])];

// Read canonical links, including shared owners and authored requirement IDs.
// A requirement candidate is evidence to review, never a selected price/approval.
export function mrSupplierLinks0550(data,line){
 const owner=data.lines.find(l=>l.id===line.coveredByLineId&&l.id!==RETIRED_TOWER_OWNER_0550);
 const requirements=(data.integrationWorkspace?.requirements||[]).filter(r=>r.id==='REQDEF-'+line.mrRequirementId||(r.workLineIds||[]).includes(line.id));
 const links=new Map(),add=(id,label)=>{if(id===RETIRED_TOWER_OFFER_0550)return;if(!links.has(id))links.set(id,{id,offer:data.offers.find(o=>o.id===id),labels:[]});const entry=links.get(id);if(!entry.labels.includes(label))entry.labels.push(label);};
 for(const o of workingOffers0550(data,line))add(o.id,'Offer ที่ผูกกับ Working');
 // Preserve a dangling selection so a deleted Offer cannot look unmapped.
 if(line.offerId)add(line.offerId,'Offer ที่ผูกกับ Working');
 if(owner){for(const o of workingOffers0550(data,owner))add(o.id,'Offer ของเจ้าของราคาอ้างอิง');if(owner.offerId)add(owner.offerId,'Offer ของเจ้าของราคาอ้างอิง');}
 for(const r of requirements)for(const id of requirementSupplierOfferIds0550(r))add(id,'ลิงก์ Requirement / TAG · ดูผลตรวจ Mapping');
 return {owner,requirements,links:[...links.values()]};
}
