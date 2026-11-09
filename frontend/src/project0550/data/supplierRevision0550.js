import Decimal from "decimal.js";
// Private supplier revisions enter the existing source/SI/offer/Working stores.
// ADR-0550-001 §§1–6,8–11,14: draft evidence never approves allocation or reprices saved owners.
import {integrationFingerprint0550,emptyIntegration0550,validateIntegration0550} from './integrationWorkspace0550';
import {validateSourceIntake} from './sourceIntakeModel';
import {selectAutomaticSource} from './sourceAutoLoad';
import {validateBidWorkspace} from './bidWorkspaceModel';
import {MR_WORKING_CATALOG_0550} from './mrWorkingBasis0550';
import {activeSupplyLine0550} from './supplyProposalDraft0550';
export const SUPPLIER_REVISION_SCHEMA_0550='genesis.0550.supplier-revision.v1';
export const PAGA_REVISION='A20261632-002';
const PAGA_NET_ID='OFFER-PAGA-'+PAGA_REVISION+'-NET';
const PAGA_OWNER='LINE-LEGACY-TEL-PAGA-1';
const PAGA_PREDECESSORS=['OFFER-LEGACY-TEL-PAGA-1','OFFER-LEGACY-TEL-PAGA-2','OFFER-LEGACY-TEL-PAGA-3'];
export const PAGA_REVISION_INCLUDED_0550='NET includes OEM documentation/project management (22030), FAT at Wertheim (23010), packing (24010) and one commissioning kit (18020).';
export const PAGA_REVISION_OPEN_0550='Confirm fourth access panel TAG, XBC circuits, controller/switch architecture and failover. The quoted controller redundancy activations require hardware/TAG and test verification. Separate freight, insurance, duties, ID IE site services/SAT, training and additional spares require their own basis.';
export const pagaRevisionNet0550=offer=>offer?.id===PAGA_NET_ID&&offer.quoteRef===PAGA_REVISION&&
 offer.supplierQuoteRow?.classification==='NET_PACKAGE'&&offer.supplierQuoteRow.parentOfferId===offer.id&&
 offer.quoteEvidence?.sourceId===offer.supplierQuoteRow.sourceId&&offer.quoteEvidence?.quotedCurrency==='EUR'&&
 offer.currency==='EUR'&&offer.unit==='Lot'&&offer.supplierQuoteRow.quantity===1&&
 Number.isFinite(offer.unitCost)&&offer.unitCost>0&&offer.unitCost===offer.quoteEvidence.quotedTotal;
export function pagaRevisionSelected0550(data){
 const net=data?.offers.find(pagaRevisionNet0550);
 if(!net)return null;
 const owners=data.lines.map(activeSupplyLine0550).filter(line=>line.selected&&line.wbs==='A'&&line.systemToken==='TEL-PAGA'&&line.offerId===net.id);
 return owners.length===1?{net,owner:owners[0]}:null;
}

export function pagaRevisionItems0550(data,net){
 return data.offers.filter(offer=>offer.id!==net.id&&offer.quoteRef===net.quoteRef&&offer.vendorId===net.vendorId&&
  offer.supplierQuoteRow?.parentOfferId===net.id&&offer.supplierQuoteRow.sourceId===net.supplierQuoteRow.sourceId&&
  offer.quoteEvidence?.sourceSha256===net.quoteEvidence.sourceSha256);
}

export function preparePagaRevisionPricing0550(data,today){
 const repo=data.repositoryBasisImport,receipt=repo?.bidProcess;
 if(today<'2026-11-09'||!receipt||receipt.pagaRevisionHandled)return data;
 const net=data.offers.find(pagaRevisionNet0550);
 if(!net||!net.date||net.date>today||!net.validUntil||net.validUntil<today)return data;
 const integration=data.integrationWorkspace;
 const review=preparePagaRevisionMapping0550(data,integration?.requirements||[]);
 if(!review?.source||review.rows.some(row=>!row.excerpt)||review.source.url!==net.quoteEvidence.sourceUrl||
  data.sourceIntake.sources.some(s=>s.replaces?.includes(review.source.id)))return data;
 const items=pagaRevisionItems0550(data,net);
 if(!['11010','22030','23010','24010','18020'].every(code=>items.some(o=>o.supplierQuoteRow.itemCode===code&&o.supplierQuoteRow.classification==='BASE_PRICE'))||
  !items.some(o=>o.supplierQuoteRow.itemCode==='11010'&&o.supplierQuoteRow.quantity===4))return data;
 const eligible=line=>line.id.startsWith('LINE-LEGACY-TEL-PAGA-')&&
  line.offerId==='OFFER-LEGACY-TEL-PAGA-'+line.id.split('-').at(-1)&&
  line.scopeKey==='VENDOR-BASIS.LEGACY-TEL-PAGA-'+line.id.split('-').at(-1)&&
  line.vendorId===net.vendorId&&line.quantity===1&&line.currency==='EUR'&&
  line.unit===(line.id.endsWith('-2')?'Pc':'Lot')&&!line.calculationId&&!line.supplyDraft&&!line.officialReview&&
  line.manualCost===null&&line.sellRate===null&&line.customerRowCode==='A1-05';
 const owners=data.lines.filter(line=>line.selected&&line.systemToken==='TEL-PAGA'&&line.wbs==='A'&&
  (line.offerId||line.calculationId||line.mgwDetailGroupId||Number.isFinite(line.manualCost)||Number.isFinite(line.sellRate)));
 const base=owners.find(line=>line.id===PAGA_OWNER);
 if(!base||owners.some(line=>!PAGA_PREDECESSORS.includes(line.offerId)||!eligible(line)))return data;
 const nextLines=data.lines.map(line=>{
  if(line===base)return {...line,offerId:net.id,description:'INDUSTRONIC INTRON-X · '+PAGA_REVISION+' · NET package',
   requirementRef:'MR Rev.B1 Appendix 1.4 / priced PAGA package; allocation of remaining MR items pending.',
   sourceRef:net.sourceRef+' / one NET Lot. '+PAGA_REVISION_INCLUDED_0550,
   customerRemark:'PAGA package with the OEM services and packing stated in the offer. Final technical scope subject to review.'};
  return owners.includes(line)?{...line,selected:false}:line;
 });
 const matches=new Map(review.rows.filter(row=>row.requirement?.offerIds.includes(row.offer.id)).map(row=>[row.requirement.id,row]));
 const retiredIds=new Set(owners.filter(line=>line!==base).map(line=>line.id));
 const requirements=integration?.requirements.map(r=>{
  if(!matches.has(r.id)||r.status!=='DRAFT'||r.reviewer||r.basisKey||r.responsibility!=='TSI'||r.disposition!=='REQUIRED'||
   !r.workLineIds.includes(base.id)||!r.workLineIds.some(id=>retiredIds.has(id)))return r;
  return {...r,workLineIds:r.workLineIds.filter(id=>!retiredIds.has(id))};
 });
 const activation=items.find(o=>o.supplierQuoteRow.itemCode==='20030'&&o.supplierQuoteRow.classification==='INCLUDED_REFERENCE');
 const deviations=integration?.deviations.map(d=>{
  if(!activation||!review.source.content.includes('ACT-Controller Redundancy')||d.id!=='DEV-EPC-PAGA-REDUNDANCY'||
   d.status!=='DRAFT'||d.workflowStatus!=='DRAFT'||d.approvalDecision!=='PENDING'||d.basisKey||d.reviewer||
   d.offerIds.join(', ')!==PAGA_PREDECESSORS.join(', ')||d.vendorQuoteRef!==d.offerIds.join(', ')||
   d.vendorResponse1||d.companyResponse||d.resolution||d.finalClosure||d.approvalSourceIds.length||
   d.vendorDeviation!=='The current quoted base is not declared to include optional controller/switch redundancy. TSI recommended solution includes the required failure-tolerant architecture; additional selection/coverage/cost approval is required before any compliance claim or price change.'||
   d.contractorResponse1!=='Current INDUSTRONIC base quote has optional controller/network redundancy distinct from N+1 amplifiers.')return d;
  return {...d,offerIds:[net.id,activation.id],vendorQuoteRef:net.quoteRef,
   vendorDeviation:'Controller redundancy activation is listed. Confirm the offered failure-tolerant controller and network architecture against PHI Rev.B1 §7.3.4.',
   justification:'Supplier item 20030 lists '+activation.supplierQuoteRow.quantity+' controller redundancy activations. Licences are part of the NET package. Reconcile hardware, topology, TAG allocation and failover evidence before claiming compliance.',
   contractorResponse1:'Verify redundancy across APF and ACP. Confirm the physical controller/switch arrangement, power separation and the planned failover tests.'};
 });
 return {...data,lines:nextLines,...(integration?{integrationWorkspace:{...integration,requirements,deviations}}:{}),
  repositoryBasisImport:{...repo,bidProcess:{...receipt,pagaRevisionHandled:true}}};
}
const PAGA_MAPPING_ITEMS=[
 {mrId:'MR-B1-14-APF-05',item:'11010',label:'APF Access Panel',evidence:/^\s*11010\s+.*302-053-000.*$/m},
 {mrId:'MR-B1-14-ACP-05',item:'11010',label:'ACP Access Panel',evidence:/^\s*11010\s+.*302-053-000.*$/m},
 {mrId:'MR-B1-14-APF-01',item:'1010',label:'APF Main Node / XBC',evidence:/^\s*1x\s+XBC\s+\(IP Beacon Control Module\).*$/m},
 {mrId:'MR-B1-14-ACP-01',item:'2010',label:'ACP Main Node / XBC',evidence:/^\s*1x\s+XBC\s+\(IP Beacon Control Module\).*$/m}
];

// Existing WP.7 uses the imported private quote and the native source text.
// Item numbers alone cannot establish scope across quotation revisions.
export function preparePagaRevisionMapping0550(data,requirements){
 const net=data.offers.find(o=>o.id===PAGA_NET_ID);
 if(net?.quoteRef!==PAGA_REVISION||net.supplierQuoteRow?.classification!=='NET_PACKAGE'||net.supplierQuoteRow.parentOfferId!==net.id)return null;
 const sourceId=net.supplierQuoteRow.sourceId;
 const sources=data.sourceIntake?.sources||[];
 const source=sources.find(s=>s.id===sourceId&&s.documentNo.includes(PAGA_REVISION)&&s.readState!=='METADATA_ONLY');
 const pages=new Map(Array.from((source?.content||'').matchAll(/\[PDF PAGE (\d+)\]([^]*?)(?=\[PDF PAGE |$)/g),
  ([,pageNumber,body])=>[Number(pageNumber),body]));
 const rows=PAGA_MAPPING_ITEMS.map(({mrId,item,label,evidence})=>{
  const requirement=requirements.find(r=>r.id==='REQDEF-'+mrId&&r.systemToken==='TEL-PAGA');
  const mr=MR_WORKING_CATALOG_0550.rows.find(r=>r.id===mrId);
  const matches=data.offers.filter(o=>o.vendorId===net.vendorId&&o.quoteRef===net.quoteRef&&o.supplierQuoteRow?.itemCode===item&&
   o.supplierQuoteRow.classification==='BASE_PRICE'&&o.supplierQuoteRow.sourceId===sourceId&&o.supplierQuoteRow.parentOfferId===net.id&&
   o.quoteEvidence?.sourceSha256&&o.quoteEvidence.sourceSha256===net.quoteEvidence?.sourceSha256);
  const offer=matches.length===1?matches[0]:undefined;
  const locator=offer?.quoteEvidence?.locator||'';
  const pageNumber=Number(locator.match(/^PDF p(\d+) \/ item /)?.[1]);
  const page=pages.get(pageNumber)||'';
  const itemRow=page.match(new RegExp('^[ \\t]*'+item+'[ \\t]+.*$', 'm'));
  const afterItem=itemRow?page.slice(itemRow.index):'';
  const nextRow=afterItem.slice(itemRow?.[0].length||0).search(/^[ \t]*\d{4,5}[ \t]+\d+[,.]\d+/m);
  const section=nextRow<0?afterItem:afterItem.slice(0,itemRow[0].length+nextRow);
  const match=section.match(evidence)?.[0].trim();
  const excerpt=match?[...new Set([itemRow[0].trim(),match])].join('\n'):'';
  return {label,requirement,mr,offer,locator,excerpt};
 });
 const selected=data.lines.filter(l=>l.selected&&l.systemToken==='TEL-PAGA'&&l.customerRowCode==='A1-05');
 return {net,source,rows,selected};
}

export function pagaRevisionRequirementDraft0550(row,source){
 const {requirement:r,offer,locator,excerpt}=row;
 if(!r||!source||!offer||!excerpt||r.disposition==='NOT_APPLICABLE'||r.responsibility==='COMPANY'||r.offerIds.includes(offer.id))return null;
 const append=(prior,value)=>[prior,value].filter(Boolean).join('\n');
 const draft={...r,status:'DRAFT',reviewer:'',reviewedOn:'',basisKey:'',
  offerIds:[...r.offerIds,offer.id],supplierSourceIds:[...new Set([...r.supplierSourceIds,source.id])],
  supplierLocator:append(r.supplierLocator,PAGA_REVISION+' / '+locator),
  supplierExcerpt:append(r.supplierExcerpt,excerpt),
  supplierBasis:append(r.supplierBasis,'A20261632-002 · หลักฐานใน NET เดียว · รอตรวจ TAG / การจัดลงพื้นที่และขอบเขต · ไม่เพิ่มเจ้าของราคา')};
 if(draft.offerIds.length>500||draft.supplierSourceIds.length>500||[draft.supplierLocator,draft.supplierExcerpt,draft.supplierBasis].some(s=>s.length>12000))return null;
 return draft;
}
const fail=m=>{throw Error('Supplier revision: '+m);};
const same=(a,b)=>integrationFingerprint0550(a)===integrationFingerprint0550(b);
const object=(v,keys)=>{if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!keys.includes(k)))fail('unsupported fields');};
export function validateSupplierRevisionImports0550(rows){
 if(rows===undefined)return;
 if(!Array.isArray(rows)||rows.length>2000||new Set(rows.map(r=>r?.batchId)).size!==rows.length)fail('invalid receipts');
 for(const r of rows){object(r,['batchId','packageKey','importedOn']);for(const k of ['batchId','packageKey'])if(typeof r[k]!=='string'||!r[k]||r[k].length>200)fail('invalid receipt');if(!/^\d{4}-\d{2}-\d{2}$/.test(r.importedOn)||new Date(r.importedOn).toISOString().slice(0,10)!==r.importedOn)fail('invalid receipt date');}
}
export function validateSupplierQuoteRow0550(o){
 if(o.supplierQuoteRow===undefined)return;
 const r=o.supplierQuoteRow;object(r,['sourceId','itemCode','classification','quantity','quotedUnit','parentOfferId','discountable']);
 for(const k of ['sourceId','itemCode','quotedUnit','parentOfferId'])if(typeof r[k]!=='string'||!r[k]||r[k].length>100)fail('invalid quote identity');
 if(!['NET_PACKAGE','BASE_PRICE','OPTION','INCLUDED_REFERENCE'].includes(r.classification)||!Number.isFinite(r.quantity)||r.quantity<=0||typeof r.discountable!=='boolean')fail('invalid quote row');
 if(r.classification==='INCLUDED_REFERENCE'&&o.unitCost!==null)fail('included reference cannot have a separate price');
 if(r.classification==='NET_PACKAGE'&&(o.id!==r.parentOfferId||o.unit!=='Lot'||r.quantity!==1||o.unitCost===null))fail('invalid net owner');
}
export function planSupplierRevision0550(data,pack,systems){
 object(pack,['schema','projectId','batchId','preparedOn','coverageNote','sourceIntake','predecessorSourceKey','vendor','offers','line','requirements','particulars','expectedRequirements','commercialTotals']);
 if(pack.schema!==SUPPLIER_REVISION_SCHEMA_0550||pack.projectId!==data.projectId||pack.projectId!=='PJ2608-0550'||!/^\d{4}-\d{2}-\d{2}$/.test(pack.preparedOn)||new Date(pack.preparedOn).toISOString().slice(0,10)!==pack.preparedOn)fail('project/schema/date');
 if(typeof pack.batchId!=='string'||!pack.batchId||pack.batchId.length>100||typeof pack.coverageNote!=='string'||pack.coverageNote.length>6000)fail('invalid batch');
 validateSupplierRevisionImports0550(data.supplierRevisionImports);
 const key=integrationFingerprint0550(pack),receipt=(data.supplierRevisionImports||[]).find(r=>r.batchId===pack.batchId);
 if(receipt){if(receipt.packageKey!==key)fail('consumed batch changed');return {workspace:data,changed:false,sourceState:'CURRENT',stats:[]};}
 validateSourceIntake(pack.sourceIntake,systems);
 if(!data.sourceIntake||integrationFingerprint0550(data.sourceIntake)!==pack.predecessorSourceKey)fail('current source differs from reviewed predecessor; reconcile without overwriting it');
 const bySource=new Map(pack.sourceIntake.sources.map(s=>[s.id,s]));
 for(const old of data.sourceIntake.sources)if(!same(bySource.get(old.id),old))fail('source ancestor changed / '+old.id);
 // Existing findings, package registers and milestones are retained byte-for-byte.
 for(const k of Object.keys(data.sourceIntake).filter(k=>!['sources','batchId','reviewedOn','coverageNote'].includes(k)))if(!same(pack.sourceIntake[k],data.sourceIntake[k]))fail('source register ancestor changed / '+k);
 const selected=selectAutomaticSource(data,pack.sourceIntake,systems);
 if(selected.state!=='UPDATED')fail('successor source required');
 const arrays=['offers','requirements','particulars','expectedRequirements'];for(const k of arrays)if(!Array.isArray(pack[k])||pack[k].length>2000)fail('invalid '+k);
 for(const k of ['offers','requirements','particulars'])if(new Set(pack[k].map(r=>r.id)).size!==pack[k].length)fail('duplicate '+k);
 const vendor=pack.vendor;object(vendor,['id','name','kind','reference']);
 const existingVendor=data.vendors.find(v=>v.id===vendor.id);
 if(!existingVendor||existingVendor.name.trim().toLowerCase()!==vendor.name.trim().toLowerCase())fail('existing supplier identity must match');
 if(pack.line.systemToken!=='TEL-PAGA'||pack.line.wbs!=='A'||pack.line.selected!==false||pack.line.manualCost!==null||pack.line.quantity!==1||pack.line.unit!=='Lot'||pack.line.currency!=='EUR'||pack.line.calculationId||pack.line.officialReview)fail('new package must be an unselected PAGA owner');
 const net=pack.offers.find(o=>o.id===pack.line.offerId);
 if(!net||net.supplierQuoteRow?.classification!=='NET_PACKAGE'||net.vendorId!==vendor.id||pack.line.vendorId!==vendor.id)fail('net owner missing');
 for(const o of pack.offers){validateSupplierQuoteRow0550(o);if(!o.supplierQuoteRow||o.vendorId!==vendor.id||o.quoteRef!==net.quoteRef||o.supplierQuoteRow.parentOfferId!==net.id||!bySource.has(o.supplierQuoteRow.sourceId)||o.currency!=='EUR')fail('offer revision identity missing');}
 const totals=pack.commercialTotals;object(totals,['gross','discountable','discount','net','discountPercent']);
 for(const v of Object.values(totals))if(!Number.isFinite(v)||v<0)fail('invalid commercial totals');
 if(Object.keys(totals).length!==5||totals.discountPercent>100)fail('invalid discount');
 const Money=Decimal.clone({precision:40,rounding:Decimal.ROUND_HALF_UP}),baseRows=pack.offers.filter(o=>o.supplierQuoteRow.classification==='BASE_PRICE');
 if(!baseRows.length||pack.offers.filter(o=>o.supplierQuoteRow.classification==='NET_PACKAGE').length!==1||baseRows.some(o=>o.unitCost===null))fail('priced base rows required');
 const sum=rows=>rows.reduce((n,o)=>n.plus(new Money(o.unitCost).times(o.supplierQuoteRow.quantity)),new Money(0)).toDecimalPlaces(2);
 if(!sum(baseRows).eq(totals.gross)||!sum(baseRows.filter(o=>o.supplierQuoteRow.discountable)).eq(totals.discountable)||!new Money(totals.discountable).times(totals.discountPercent).div(100).toDecimalPlaces(2).eq(totals.discount)||!new Money(totals.gross).minus(totals.discount).eq(totals.net)||!new Money(net.unitCost).eq(totals.net))fail('quote totals/discount do not reconcile');
 for(const e of pack.expectedRequirements){object(e,['id','basisKey']);if(typeof e.id!=='string'||typeof e.basisKey!=='string'||!pack.requirements.some(r=>r.id===e.id))fail('invalid expected requirement');}
 if(new Set(pack.expectedRequirements.map(r=>r.id)).size!==pack.expectedRequirements.length)fail('duplicate expected requirements');
 const source=bySource.get(net.supplierQuoteRow.sourceId);
 if(source.authority==='CURRENT_TENDER'||!source.documentNo.includes(net.quoteRef))fail('supplier source must stay separate from customer authority');
 const offered=new Set(pack.offers.map(o=>o.id)),allowedLines=new Set([...data.lines.map(l=>l.id),pack.line.id]);
 for(const r of [...pack.requirements,...pack.particulars]){
  if(r.status!=='DRAFT'||r.basisKey||r.reviewer||r.reviewedOn||r.systemToken!=='TEL-PAGA')fail('unstamped PAGA drafts only');
  if(r.disposition==='NOT_APPLICABLE')fail('cannot import a scope exclusion');
  for(const id of [...r.sourceIds||[],...r.supplierSourceIds||[],...(r.references||[]).map(x=>x.sourceId)])if(!bySource.has(id))fail('missing source / '+id);
  for(const id of r.offerIds||[])if(!offered.has(id)&&!data.offers.some(o=>o.id===id))fail('missing offer / '+id);
  for(const id of r.workLineIds||[])if(!allowedLines.has(id))fail('missing Working owner / '+id);
 }
 const w={...emptyIntegration0550(),...data.integrationWorkspace};
 const stats=[],merge=(collection,old,incoming,allowUpdate=false)=>{
  const added=[],updated=[],preserved=[],unchanged=[];
  for(const r of incoming){const own=old.find(x=>x.id===r.id),expect=pack.expectedRequirements.find(x=>x.id===r.id);
   if(!own){if(allowUpdate&&expect){preserved.push(r.id+' / existing requirement absent or deleted');continue;}added.push(r);}
   else if(same(own,r)||collection==='offers'&&own.quoteEvidence&&same((({quoteEvidence,...core})=>core)(own),r))unchanged.push(r.id);
   else if(allowUpdate&&expect&&integrationFingerprint0550(own)===expect.basisKey)updated.push(r);
   else if(collection==='offers'||collection==='lines')fail('new quote ID conflicts with saved record / '+r.id);
   else preserved.push(r.id+' / saved edit retained');
  }
  stats.push({collection,added:added.length,updated:updated.length,unchanged:unchanged.length,preserved});
  return [...old.map(r=>updated.find(n=>n.id===r.id)||r),...added];
 };
 const offers=merge('offers',data.offers,pack.offers),lines=merge('lines',data.lines,[pack.line]);
 const requirements=merge('requirements',w.requirements,pack.requirements,true),particulars=merge('particulars',w.particulars,pack.particulars);
 const workspace={...selected.workspace,offers,lines,integrationWorkspace:{...w,requirements,particulars},supplierRevisionImports:[...(data.supplierRevisionImports||[]),{batchId:pack.batchId,packageKey:key,importedOn:pack.preparedOn}]};
 validateIntegration0550(workspace);validateBidWorkspace(workspace,data.baselineSnapshotId,systems);
 return {workspace,changed:true,sourceState:selected.state,stats};
}
