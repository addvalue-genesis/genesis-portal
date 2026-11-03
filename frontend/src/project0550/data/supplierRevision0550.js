import Decimal from "decimal.js";
// Private supplier revisions enter the existing source/SI/offer/Working stores.
// ADR-0550-001 §§1–6,8–11,14: draft evidence never approves allocation or reprices saved owners.
import {integrationFingerprint0550,emptyIntegration0550,validateIntegration0550} from './integrationWorkspace0550';
import {validateSourceIntake} from './sourceIntakeModel';
import {selectAutomaticSource} from './sourceAutoLoad';
import {validateBidWorkspace} from './bidWorkspaceModel';
export const SUPPLIER_REVISION_SCHEMA_0550='genesis.0550.supplier-revision.v1';
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
   else if(same(own,r))unchanged.push(r.id);
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
