// ADR-0550-001: use canonical WP.1–8/source/offer records. Never reprice or approve.
import {PAGA_AVL_BASIS_0550} from './avlDeviationBasis0550';
import {integrationRequirements0550,blankRequirement0550,blankAvlCheck0550,blankDeviation0550,emptyIntegration0550,integrationFingerprint0550} from './integrationWorkspace0550';
import {mgwQuoteItem0550} from './mgwVendorBasis0550';
import {workingOffers0550,activeSupply0550} from './workingOffers0550';

// Bounded facts visually checked in native Annex 2_1, PDF p13 / printed p11 of 12.
// Brand inclusion is not approval of models, origin, qualifications or engineering.
export const AVL_CATEGORIES_0550=[
 {id:'PAGA',title:'PAGA System',brands:['GAI-Tronics'],system:'TEL-PAGA'},
 {id:'EXPHONE',title:'Telephone / Ex-Telephone',brands:['GAI-Tronics'],system:'TEL-IPP'},
 {id:'CCTV',title:'CCTV',brands:['COEX','AXIS','Hikvision','PELCO'],system:'TEL-CCTV'},
 {id:'IPPHONE',title:'IP Telephone System',brands:['CISCO','AVAYA','SIEMENS','NEC'],system:'TEL-PABX'},
 {id:'DMR',title:'UHF, VHF radio repeater /base station /trunking system',brands:['MOTOROLA','PICIORGROS','Hytera','TAIT'],system:'TEL-RADIO-DTRS'},
 {id:'FO-EQUIPMENT',title:'Fiber Optic Transmission Equipment',brands:['CORIANT','HUAWEI','CXR Anderson Jacobson','Alcatel Lucent'],system:'TEL-FO'},
 {id:'FO-CABLE',title:'Fiber Optic Cable',brands:['Corning','Nexan'],system:'TEL-FO'},
 {id:'FO-DUCT',title:'Fiber Optic Duct',brands:['Duraline','Dura-Mine'],system:'TEL-FO'}
];
const norm=s=>String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
const unknown=s=>!norm(s)||/^(MGW|LOCAL|DOMESTIC|TBD|NA|UNKNOWN)$/.test(norm(s));
const categoryFor=(token,description)=>{
 if(token==='TEL-RADIO-DTRS'&&/cable|antenna|connector|cabinet|rack|battery|charger/i.test(description))return null;
 if(token==='TEL-PAGA'&&/sub cabinet|override|loudspeaker|beacon/i.test(description))return null;
 if(token==='TEL-FO')return AVL_CATEGORIES_0550.find(c=>c.id===(/duct|conduit/i.test(description)?'FO-DUCT':/cable/i.test(description)?'FO-CABLE':'FO-EQUIPMENT'));
 // Do not treat CCTV cabinet/switch OEMs as camera/VMS manufacturers.
 if(token==='TEL-CCTV'&&/cabinet|rack|switch|patch|cable|monitor|workstation|ups|keyboard|mouse|converter|router|transceiver|sfp/i.test(description)&&!/camera|recorder|\bNVR\b|\bVMS\b/i.test(description))return null;
 return AVL_CATEGORIES_0550.find(c=>c.system===token);
};
const uniq=a=>[...new Set(a)];
const quoteSourceIds=(data,offer)=>{
 const ids=uniq((offer.sourceRef||'').match(/[-\w]{20,}/g)||[]);
 return (data.sourceIntake?.sources||[]).filter(s=>ids.some(id=>s.id===id||s.id==='DRV-'+id||s.url?.includes(id))).map(s=>s.id);
};
function assess(data,token,offer,basis,lines,reqs){
 const description=offer.description||'',cat=categoryFor(token,description),brand=offer.brand?.trim()||'';
 const selected=lines.some(l=>workingOffers0550(data,l).some(o=>o.id===offer.id)),allocated=reqs.filter(r=>r.offerIds.includes(offer.id));
 const quote=mgwQuoteItem0550(offer);
 const result=quote&&!quote.systemTokens.includes(token)?'OFFER_SYSTEM_CONFLICT':!cat?'CATEGORY_NOT_ESTABLISHED':unknown(brand)?'OEM_UNRESOLVED':cat.brands.some(b=>norm(b)===norm(brand))?'BRAND_LISTED':'NOT_LISTED';
 return {id:token+'/'+offer.id,systemToken:token,offerId:offer.id,brand,description,quoteRef:offer.quoteRef,sourceRef:offer.sourceRef,basis,selected,allocated:allocated.length>0,category:cat,
  requirementIds:allocated.map(r=>r.id),sourceIds:uniq([...quoteSourceIds(data,offer),...allocated.flatMap(r=>r.supplierSourceIds)]),result};
}
export function deriveAvlReconciliation0550(data,integration){
 const requirements=integration.requirements||integrationRequirements0550(data),w={...emptyIntegration0550(),...data.integrationWorkspace};
 const systems=integration.scopes.map(scope=>{
  const token=scope.id,reqs=requirements.filter(r=>r.systemToken===token),lines=data.lines.filter(l=>l.systemToken===token&&activeSupply0550(l)&&l.wbs==='A');
  const chosenIds=uniq([...lines.flatMap(l=>workingOffers0550(data,l).map(o=>o.id)),...reqs.filter(r=>r.disposition!=='NOT_APPLICABLE'&&r.responsibility!=='COMPANY').flatMap(r=>r.offerIds)]);
  const chosen=data.offers.filter(o=>chosenIds.includes(o.id));
  const offered=data.offers.filter(o=>mgwQuoteItem0550(o)?.systemTokens.includes(token)&&mgwQuoteItem0550(o)?.wbs==='A'&&!chosenIds.includes(o.id));
  const chosenKnown=chosen.some(o=>!unknown(o.brand));
  // Explicit Working allocations remain visible; competing catalogue offers are
  // reference only once an OEM is chosen. Never substitute them into pricing.
  const items=[...chosen.map(o=>assess(data,token,o,'WORKING',lines,reqs)),...offered.map(o=>assess(data,token,o,chosenKnown?'ALTERNATIVE':'OFFERED',[],reqs))];
  const sourceIds=uniq([...reqs.flatMap(r=>r.sourceIds),...(scope.review?.sourceIds||[]),...items.flatMap(i=>i.sourceIds)]);
  const findings=(data.sourceIntake?.findings||[]).filter(f=>f.systemTokens.includes(token)&&f.state!=='SOURCE_SUPPORTED');
  return {id:token,items,sourceIds,requirementIds:reqs.map(r=>r.id),requirements:reqs.length,proofs:integration.proofs.filter(p=>reqs.some(r=>r.id===p.requirementId)).length,activities:integration.activities.filter(a=>reqs.some(r=>r.id===a.requirementId)).length,
   interfaces:reqs.filter(r=>r.interfaceBasis?.trim()).length,workingLines:lines.length,findings:findings.length,scopeState:scope.state,
   deviations:integration.deviations.filter(d=>d.systemToken===token),categories:AVL_CATEGORIES_0550.filter(c=>c.system===token)};
 });
 const candidates=[];
 for(const s of systems)for(const item of s.items.filter(i=>i.result==='NOT_LISTED'&&i.basis!=='ALTERNATIVE')){
  const key=s.id+'/'+item.category.id+'/'+norm(item.brand)+'/'+item.quoteRef;
  let c=candidates.find(c=>c.key===key);if(!c){c={key,systemToken:s.id,category:item.category,brand:item.brand,quoteRef:item.quoteRef,items:[]};candidates.push(c);}c.items.push(item);
 }
 for(const c of candidates){c.selected=c.items.some(i=>i.selected);c.allocated=c.items.some(i=>i.allocated);c.offerIds=uniq(c.items.map(i=>i.offerId));
  const currentManufacturer=d=>{const a=w.avlChecks.find(a=>a.id===d.avlCheckId);return norm(a?.manufacturer)===norm(c.brand)&&d.vendorQuoteRef===c.quoteRef;};
  c.existing=w.deviations.filter(d=>currentManufacturer(d)&&d.systemToken===c.systemToken&&d.offerIds.some(id=>c.offerIds.includes(id))&&(/AVL|Annex.?2|Vendor List/i.test(d.contractorDocument+' '+d.vendorDeviation)||d.avlCheckId));
  c.manualCheck=w.avlChecks.some(a=>c.offerIds.includes(a.offerId)&&norm(a.manufacturer)===norm(c.brand)&&!w.deviations.some(d=>d.avlCheckId===a.id&&!currentManufacturer(d)));
 }
 const source=(data.sourceIntake?.sources||[]).find(s=>s.id===PAGA_AVL_BASIS_0550.sourceId);
 const replaced=(data.sourceIntake?.sources||[]).some(s=>s.replaces.includes(PAGA_AVL_BASIS_0550.sourceId));
 const referenceConflict=Boolean(replaced||(source&&source.authority!=='CURRENT_TENDER')||(source?.readState==='TEXT_READ'&&!AVL_CATEGORIES_0550.every(c=>c.title.split('/').every(t=>norm(source.content).includes(norm(t)))&&c.brands.every(b=>norm(source.content).includes(norm(b))))));
 return {systems,candidates,source,referenceConflict,sourceId:PAGA_AVL_BASIS_0550.sourceId,locator:PAGA_AVL_BASIS_0550.locator,sha256:PAGA_AVL_BASIS_0550.sha256,
  missingDrafts:referenceConflict?[]:candidates.filter(c=>!c.existing.length&&!c.manualCheck),selectedCandidates:candidates.filter(c=>c.selected),offeredCandidates:candidates.filter(c=>!c.selected)};
}
export function prepareSystemAvlDeviations0550(data,integration){
 const audit=deriveAvlReconciliation0550(data,integration);if(!audit.missingDrafts.length)return data;
 const old={...emptyIntegration0550(),...data.integrationWorkspace},w={...old,requirements:[...old.requirements],avlChecks:[...old.avlChecks],deviations:[...old.deviations]};
 for(const c of audit.missingDrafts){
  const suffix=integrationFingerprint0550(c.key).replace(/:/g,'-'),rid='REQ-AVL-'+suffix,aid='AVL-'+suffix,did='DEV-AVL-'+suffix;
  if(w.requirements.some(r=>r.id===rid)||w.avlChecks.some(a=>a.id===aid)||w.deviations.some(d=>d.id===did))continue;
  const locator='Exhibit A-Annex 2_1 / PDF p13 / printed p11 of 12 / '+c.category.title;
  const excerpt=c.category.brands[0],statement=c.category.title+': listed manufacturers are '+c.category.brands.join(', ')+'.';
  const linked=integration.requirements.filter(r=>r.systemToken===c.systemToken&&r.offerIds.some(id=>c.offerIds.includes(id)));
  const lines=data.lines.filter(l=>l.systemToken===c.systemToken&&activeSupply0550(l)&&workingOffers0550(data,l).some(o=>c.offerIds.includes(o.id)));
  const r={...blankRequirement0550(rid,c.systemToken),title:c.category.title+' / manufacturer AVL reconciliation',statement,reference:locator,sourceIds:[audit.sourceId],sourceLocator:locator,sourceExcerpt:excerpt,
   need:'Request acceptance of '+c.brand+' outside the applicable AVL category.',criteria:'Recorded purchaser/company manufacturer acceptance and supporting evidence.',offerIds:c.offerIds,
   supplierSourceIds:uniq(c.items.flatMap(i=>i.sourceIds)),supplierLocator:c.items.map(i=>i.sourceRef).join('\n').slice(0,12000),supplierBasis:'Existing supplier proposal / '+c.quoteRef+'; linked Working requirements: '+linked.map(r=>r.id).join(', '),
   workLineIds:lines.map(l=>l.id),responsibility:'TSI',proofMode:'NOT_REQUIRED',reason:'Manufacturer acceptance only. Does not certify model/origin or technical adequacy.',interfaceBasis:'Refer to existing system requirements and WP.2–WP.6; manufacturer comparison is not engineering approval.'};
  const a={...blankAvlCheck0550(aid),requirementId:rid,offerId:c.offerIds[0],manufacturer:c.brand,model:c.items.map(i=>i.description).join('; ').slice(0,12000),sourceIds:[audit.sourceId],sourceLocator:locator,sourceExcerpt:excerpt,result:'NOT_LISTED',basis:'Native AVL SHA-256 '+audit.sha256+'. '+(c.selected?'Selected Working offer.':'Supplier-proposed draft; final Working selection remains to be reconciled.')};
  const d={...blankDeviation0550(did),requirementId:rid,avlCheckId:aid,systemToken:c.systemToken,offerIds:c.offerIds,mrRef:'MM-ASK-1A-APF-TEL-MR-0001 / Telecommunication & Security System',vendorQuoteRef:c.quoteRef,contractorDocument:locator,
   vendorDeviation:'Request approval to use '+c.brand+' for '+c.category.title+'. This manufacturer is not listed in the referenced AVL category.',
   justification:'Supplier proposal '+c.quoteRef+' identifies '+c.brand+'. Refer to the technical offer and relevant datasheets. Technical equivalence, supporting qualifications and final manufacturer selection require review.',
   templateStatus:'DRAFT - manufacturer approval request',releaseDocument:'Exhibit A - Annex 2_1, Lists of Vendors and Subcontractors',releasePageRef:'PDF page 13 / printed page 11 of 12 / '+c.category.title,purchaserRequirement:statement,bidderProposal:'Proposed manufacturer: '+c.brand+'. Supplier offer: '+c.quoteRef+'.',
   releaseRemarks:c.selected?'':'Supplier-proposed preparation draft; reconcile final Working selection before submission.'};
  w.requirements.push(r);w.avlChecks.push(a);w.deviations.push(d);
 }
 return w.deviations.length===old.deviations.length?data:{...data,integrationWorkspace:w};
}
