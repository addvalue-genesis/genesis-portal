// Current bid preparation, not supplier/engineering acceptance. Estimates are
// explicit planning allowances; original quotations and authored inputs survive.
import {importMrWorkingBasis0550} from './mrWorkingBasis0550';
import {policyDefaults0550} from '../bidWorkingBasis0550';
import {roundMoney0550,sumMoney0550} from './money0550';
import licensingBudget from './licensingBudgetBasis0550.json';
import {prepareTsiActivityBudget0550,prepareTsiExpenseBudget0550,TSI_ACTIVITY_PLAN_0550} from './tsiActivityBudget0550';
import {workingOffers0550} from './workingOffers0550';
import {blankProof0550,integrationFingerprint0550} from './integrationWorkspace0550';
import {isTowerSourceItem0550,towerC1Reference0550,TOWER_SURVEY_ID_0550,TOWER_SURVEY_BASIS_0550,TOWER_ENGINEERING_ID_0550,TOWER_ENGINEERING_BASIS_0550,TOWER_ERECTION_ID_0550,TOWER_ERECTION_BASE_BASIS_0550,towerErectionBaseApproved0550} from './towerTenderScope0550';
export const BID_COMPLETION_VERSION_0550='0550-bid-completion-20261104-1';
const finite=Number.isFinite,clone=x=>JSON.parse(JSON.stringify(x));
const same=(a,b)=>JSON.stringify(Object.keys(a||{}).sort().map(k=>[k,a[k]]))===JSON.stringify(Object.keys(b||{}).sort().map(k=>[k,b[k]]));
const prefix='BID WORKING ESTIMATE / '+BID_COMPLETION_VERSION_0550;
const key=value=>{const text=JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);let h=2166136261;for(let i=0;i<text.length;i++)h=Math.imul(h^text.charCodeAt(i),16777619);return 'bid1:'+(h>>>0).toString(16)+':'+text.length;};
const lineKey=(data,line)=>key([line,data.calculations.find(c=>c.id===line?.calculationId)||null]);
const ownerKey=(data,line)=>key([lineKey(data,line),workingOffers0550(data,line)]);
const sourceKey=(data,ids)=>key(ids.map(id=>data.offers.find(o=>o.id===id)||null));

const TOWER_SUPPLY_ROWS = [
 ['REQ-MR-B1-11-APF-08', '2609.95.1'],
 ['REQ-MR-B1-11-ACP-06', '2609.95.2'],
];
const MICROWAVE_ALLOWANCE = 'LINE-BID-DMR-ANTENNA-GAP-0550';
const MICROWAVE_PACKAGE = 'LINE-CERAGON-ASK-REVA1-BASE';
const MICROWAVE_DRAFTS = {
 'REQDEF-MR-B1-15-APF-01': ['iw1:4066144719:2751717861:6057','iw1:2433556402:3434919004:6182'],
 'REQDEF-MR-B1-15-APF-02': ['iw1:2305603546:1944763840:5997','iw1:3689590334:1881833468:6111'],
 'REQDEF-MR-B1-15-ACP-01': ['iw1:2824451539:4225883257:6009','iw1:183896312:3465622310:6134'],
 'REQDEF-MR-B1-15-ACP-02': ['iw1:3469904913:3132963819:5997','iw1:2169286181:1805160687:6111'],
};
const MICROWAVE_LINK_REPORT = 'https://drive.google.com/file/d/1hGcBbwgqPR1DhbsfUzSrtc43E-FS8cS8/view';
const DTRS_ALLOWANCE = 'LINE-BID-DTRS-HANDHELD-GAP-0550';
const cusPriceIds = new Set([...TOWER_SUPPLY_ROWS.map(([id])=>id), MICROWAVE_ALLOWANCE, DTRS_ALLOWANCE]);

// Continue only the exact prepared MR drafts. A saved edit, review or deletion
// is authoritative. These links identify price owners without claiming coverage.
function linkPreparedMicrowaveDrafts0550(data, currentMr){
 const workspace=data.integrationWorkspace;
 const allowance=data.lines.find(line=>line.id===MICROWAVE_ALLOWANCE&&line.selected);
 if(!workspace||!allowance||cusQuantityPricingProblems0550(data,allowance).length)return data;
 const allocations=new Map(data.repositoryBasisImport.bidCompletion.rows.map(row=>[row.lineId,row]));
 const receipt=allocations.get(allowance.id);
 if(receipt?.kind!=='ESTIMATE'||receipt.inputKey!==lineKey(data,allowance)||receipt.ownerIds.length!==1||receipt.ownerIds[0]!==MICROWAVE_PACKAGE)return data;
 const appendixPage=currentMr.content.split('[PDF PAGE 23; printed 21]')[1]?.split('[PDF PAGE 24; printed 22]')[0]?.trim()||'';
 const normalizedPage=appendixPage.replace(/\s+/g,' ');
 const appendixVerified=currentMr.id==='DRV-1KFCSSo3D50fAS6LUBz0IYKPG4NjGVcDS'&&
  normalizedPage.includes('APPENDIX 1.5 : SCOPE OF SUPPLY FOR MICROWAVE COMMUNICATION SYSTEM')&&
  (normalizedPage.match(/Microwave Antena 2 Ea\./g)||[]).length===2&&
  (normalizedPage.match(/200M Vendor Cable/g)||[]).length===2;
 const proofs=[...workspace.proofs];
 let changed=false;
 const requirements=workspace.requirements.map(requirement=>{
  const fingerprints=MICROWAVE_DRAFTS[requirement.id];
  if(!fingerprints)return requirement;
  const fingerprint=integrationFingerprint0550(requirement);
  if(!fingerprints.includes(fingerprint))return requirement;
  const linked=fingerprint===fingerprints[1];
  const rebind=appendixVerified&&currentMr.replaces.includes(requirement.sourceIds[0]);
  if(linked&&!rebind)return requirement;
  const native=data.lines.find(line=>line.id===requirement.workLineIds[0]&&line.selected);
  const reference=allocations.get(native?.id);
  if(reference?.kind!=='PRICE_REFERENCE'||reference.inputKey!==lineKey(data,native)||!reference.ownerIds.includes(MICROWAVE_PACKAGE))return requirement;
  changed=true;
  const equipment=requirement.id.endsWith('-01');
  if(rebind&&equipment){
   const id='RPT-DMR-CERAGON-R10-'+requirement.site+'-DRAFT';
   if(!proofs.some(proof=>proof.id===id||proof.requirementId===requirement.id&&proof.report===MICROWAVE_LINK_REPORT)){
    proofs.push({...blankProof0550(requirement,id),title:'CERAGON ACP–APF Link Budget · bid evidence review',
     method:'Compare CERAGON Pathloss ACP-APF.pl5, 3-Nov-2026, pp. 1–2, against the current MR, PHI, SPE and DTS. Use the Total annual column at the required throughput.',
     inputsBasis:'Vendor case: 12.06 km, 7500 MHz, 28 MHz, 2+2 HSB, one modelled antenna position per site at ACP 30 m / APF 60 m. p. 2: 4KQAM 262–320 Mbps at 99.9603%; 2KQAM 242–295 Mbps at 99.9924%; 128QAM 158–193 Mbps at 99.9996%.',
     criteria:'PHI §7.3.11, SPE-0011 §§7.2–7.3 and DTS-0010 Rev.B1: minimum 99.99% link availability. Confirm required simultaneous net throughput and availability. DTS states up to 300 Mbps.',
     limitations:'The highest mode in this vendor report is below 99.99%. The report is for the quoted single-dish case and does not verify the two-dish bid layout, final mounting heights, updated RF losses, Full Outdoor interfaces or power autonomy.',
     report:MICROWAVE_LINK_REPORT});
   }
  }
  const next={...requirement};
  if(!linked){
   next.workLineIds=[...requirement.workLineIds,MICROWAVE_PACKAGE,...(equipment?[MICROWAVE_ALLOWANCE]:[])];
   next.supplierBasis+=equipment?' Draft price trace: R10 and separate antenna balance allowance.':' Draft price trace: R10 package reference only. Cable medium and length remain open.';
  }
  if(rebind){
   next.sourceIds=[currentMr.id];
   next.sourceExcerpt=appendixPage;
   next.sourceLocator='MM-ASK-1A-APF-TEL-MR-0001 Rev.B1 / Appendix 1.5 / printed p21 / PDF p23 / '+requirement.site+' Item '+(equipment?'1.0':'2.0');
  }
  return next;
 });
 return changed?{...data,integrationWorkspace:{...workspace,requirements,proofs}}:data;
}

// Use the approved customer bid quantities and the existing quote owners. New
// allowances are separate from the original quote; they are not unit quotations.
function prepareCusQuantityPricing0550(data, policies, today) {
 const receipt=data.repositoryBasisImport?.bidCompletion;
 if(!receipt||today<'2026-11-07')return data;
 const sources=data.sourceIntake?.sources||[], replaced=new Set(sources.flatMap(s=>s.replaces||[]));
 const candidates=no=>sources.filter(s=>s.documentNo==='MM-ASK-1A-APF-TEL-'+no&&s.revision==='B1'&&s.authority==='CURRENT_TENDER'&&s.content&&!replaced.has(s.id));
 const current=no=>candidates(no).length===1;
 const mrCandidates=candidates('MR-0001');
 if(mrCandidates.length!==1)return data;
 const findings=new Set((data.sourceIntake.findings||[]).map(f=>f.id));
 const rows=new Map(receipt.rows.map(r=>[r.lineId,r])),lines=new Map(data.lines.map(l=>[l.id,l])),offers=new Map(data.offers.map(o=>[o.id,o]));
 const goods=policyDefaults0550(policies,'Goods / Procured Cost');
 if(!goods)return data;
 const pricedSupply=token=>data.lines.filter(l=>l.systemToken===token&&l.wbs==='A'&&l.selected&&!l.coveredByLineId&&
  (l.offerId||l.calculationId||l.mgwDetailGroupId||finite(l.manualCost)||finite(l.sellRate)));
 let changed=false;
 const install=(line,kind,basis,offerIds,ownerIds=[])=>{
  const next={...line,sourceRef:basis+'\n'+line.requirementRef};
  lines.set(next.id,next);
  rows.set(next.id,{lineId:next.id,kind,basis,offerIds,ownerIds,inputKey:lineKey(data,next),sourceKey:sourceKey(data,offerIds),ownerKeys:ownerIds.map(id=>ownerKey(data,lines.get(id)))});
  changed=true;
 };
 if(towerErectionBaseApproved0550(data)){
  const pristine=new Map(importMrWorkingBasis0550({lines:[],offers:[]},policies,today).lines.map(l=>[l.id,l]));
  const occupied=pricedSupply('TEL-TELT').some(l=>!TOWER_SUPPLY_ROWS.some(([id])=>id===l.id));
  for(const [id,quoteRef] of TOWER_SUPPLY_ROWS){
   const line=lines.get(id),expected=pristine.get(id);
   if(occupied||rows.has(id)||!line||!expected||!same(line,expected))continue;
   const items=['02','03','04','05'].map(code=>offers.get('OFFER-MASTER-TOWER-'+quoteRef+'-'+code));
   if(items.some(o=>!isTowerSourceItem0550(o)||o.quoteRef!==quoteRef||o.currency!=='THB'||!finite(o.quoteEvidence?.quotedTotal)||o.quoteEvidence.quotedTotal<=0))continue;
   const basis='Master Tower '+quoteRef+' / PDF p1 Items 2–5 only. Supply, paint, warning light and lightning system. Item 10 erection has its own Base owner in B4. Item 9 foundation construction is excluded. Full quotation NET and legacy tower package are separate.';
   install({...line,manualCost:sumMoney0550(items.map(o=>o.quoteEvidence.quotedTotal)),vendorId:items[0].vendorId,brand:'MASTER TOWER',
    customerRemark:'One tower with quoted supply items. Tower erection is separately included under Base services.'},'QUOTED',basis,items.map(o=>o.id));
  }
 }
 const estimate=(id,owner,quantity,rate,description,requirementRef,basis,customerRemark,offerIds)=>{
  if(lines.has(id)||rows.has(id)||!finite(rate)||rate<=0)return;
  install({id,systemToken:owner.systemToken,wbs:'A',description,scopeKey:id,tagRef:'CUS bid quantity balance',requirementRef,
   vendorId:'',offerId:'',calculationId:'',resultKey:'value',quantity,unit:'Pc',currency:'USD',manualCost:rate,
   sellMode:'MARGIN',sellRate:null,markupPct:null,marginPct:null,primePct:null,...goods,selected:true,
   customerRowCode:owner.customerRowCode,customerRemark,brand:''},'ESTIMATE',basis,offerIds,[owner.id]);
 };
 const microwave=pricedSupply('TEL-DMR');
 const ceragon=['R10','R11','R12'].map(row=>offers.get('OFFER-CERAGON-26-30029-REVA1-E90E86E5-'+row));
 const microwaveSourceReady=current('PHI-0001')&&current('DTS-0010')&&current('SPE-0011')&&current('LIS-0004')&&findings.has('A-SI-R24-MICROWAVE-MR-BASE-DESIGN');
 if(microwaveSourceReady&&microwave.length===1&&microwave[0].id===MICROWAVE_PACKAGE&&
  ceragon.every(o=>o?.currency==='USD'&&o.quoteEvidence?.revision==='RevA1'&&finite(o.quoteEvidence.quotedUnitCost)&&o.quoteEvidence.quotedUnitCost>0)&&microwave[0].offerId===ceragon[0].id){
  const [,alternative,spares]=ceragon, reference=alternative.quoteEvidence.quotedUnitCost, radio=spares.quoteEvidence.quotedUnitCost;
  const basis='Budget allowance for two additional 1.2 m installed dishes and associated RF/mounting hardware, one per site. CERAGON Rev.A1 BoQ F93/G93 includes one dish at each site. Pricing proxy: R11 whole unprotected link USD '+reference+' less R12 two spare radios USD '+radio+', shared across two additional dish assemblies. The residual includes other non-radio material and is a planning reserve, not an antenna unit quote. No separate IDU is included by this allowance.';
  estimate(MICROWAVE_ALLOWANCE,microwave[0],2,roundMoney0550((reference-radio)/2),'ประมาณการ · Microwave 1.2 m antenna and RF/mounting balance',
   'MR Rev.B1 Appendix 1.5 pp21–22 / PHI B1 Figure 7-15 / SPE-0011 B1 §7.2 / DTS-0010 B1 sheets 3–4',basis,
   'Bid basis: two installed antennas per site under MR Appendix 1.5. FEED drawings and the DTS tag list show one location per site. Confirm the updated mounting positions, cable takeoff, link availability and the Full Outdoor departure from the specified IDU/ODU arrangement.',ceragon.map(o=>o.id));
 }
 const dtrs=pricedSupply('TEL-RADIO-DTRS'), handheld=offers.get('OFFER-MGW-Q26-063-RADIO-009');
 if(current('DTS-0008')&&findings.has('REV-DMR-002')&&dtrs.length===1&&dtrs[0].mgwDetailGroupId==='RADIO-DTRS'&&
  handheld?.currency==='USD'&&finite(handheld.unitCost)&&handheld.unitCost>0&&workingOffers0550(data,dtrs[0]).some(o=>o.id===handheld.id)){
  const basis='Budget allowance for 98 required less 96 quoted handheld radios. MGW Q26-063 p10 Item 1 provides only one mixed lot (96 ATEX handhelds, 26 mobiles, subscriber licences and accessories). Blended planning rate USD '+handheld.unitCost+' / 122 quoted radios. Carry matching accessories/licence exposure in this allowance; reconcile both licence layers and fixed/mobile TAGs separately.';
  estimate(DTRS_ALLOWANCE,dtrs[0],2,roundMoney0550(handheld.unitCost/122),'ประมาณการ · Two additional DTRS ATEX handhelds',
   'DTS-0008 Rev.B1 p3 comment 9 and sheet 8: VPR-308-001 through VPR-308-098',basis,
   'Offer 98 handhelds total, including the MOGE Office TAG. Map site assignment and verify subscriber entitlement against the final list.',[handheld.id]);
 }
 const prepared=changed?{...data,lines:[...lines.values()],repositoryBasisImport:{...data.repositoryBasisImport,bidCompletion:{...receipt,rows:[...rows.values()]}}}:data;
 return microwaveSourceReady?linkPreparedMicrowaveDrafts0550(prepared,mrCandidates[0]):prepared;
}

export function cusQuantityPricingProblems0550(data,line){
 if(!cusPriceIds.has(line.id))return [];
 const row=data.repositoryBasisImport?.bidCompletion?.rows.find(r=>r.lineId===line.id&&['QUOTED','ESTIMATE'].includes(r.kind));
 if(!row||row.inputKey!==lineKey(data,line))return [];
 const current=row.sourceKey===sourceKey(data,row.offerIds)&&row.ownerIds.every((id,i)=>{
  const owner=data.lines.find(l=>l.id===id);
  return owner?.selected&&ownerKey(data,owner)===row.ownerKeys[i];
 });
 return current?[]:['CUS_QUANTITY_PRICE_STALE: quote or selected package changed; reconcile the additional price'];
}

export function towerSurveyReviewPending0550(data){
 return Boolean(data.repositoryBasisImport?.bidCompletion?.rows.some(row=>row.lineId===TOWER_SURVEY_ID_0550&&
  row.offerIds.some(id=>/^OFFER-MASTER-TOWER-2609\.95\.[12]-07$/.test(id))));
}

export function reconcileTowerTenderScope0550(data){
 const receipt=data.repositoryBasisImport?.bidCompletion;
 const byLine=new Map((receipt?.rows||[]).filter(row=>[TOWER_SURVEY_ID_0550,TOWER_ENGINEERING_ID_0550].includes(row.lineId)).map(row=>[row.lineId,row])),updates=new Map();
 const erectionBase=towerErectionBaseApproved0550(data);
 const erectionBasis=TOWER_ERECTION_BASE_BASIS_0550;
 const erectionOfferIds=['OFFER-MASTER-TOWER-2609.95.1-10','OFFER-MASTER-TOWER-2609.95.2-10'];
 const erectionItems=erectionBase?erectionOfferIds.map(id=>data.offers.find(o=>o.id===id)):[];
 const erectionQuoted=erectionBase&&erectionItems.every(o=>isTowerSourceItem0550(o)&&o.currency==='THB'&&finite(o.quoteEvidence?.quotedTotal))
  ?sumMoney0550(erectionItems.map(o=>o.quoteEvidence.quotedTotal)):null;
 const lines=data.lines.map(line=>{
  if(erectionBase&&line.id===TOWER_ERECTION_ID_0550&&line.wbs==='C1'){
   const existingCost=finite(line.manualCost)||line.offerId||line.calculationId;
   return {...line,wbs:'B4',customerRowCode:'B4',responsibility:'TSI',selected:true,scopeBasis:erectionBasis,
    sourceRef:[erectionBasis,line.sourceRef&&'Previous allocation record / '+line.sourceRef].filter(Boolean).join('\n'),customerRemark:erectionBasis,
    ...(!existingCost&&erectionQuoted!==null?{quantity:1,unit:'Lot',currency:'THB',manualCost:erectionQuoted}:{})};
  }
  const scope=towerC1Reference0550(line);
  if(scope){
   const description=line.description==='PROJECT · Civil / foundations / trench-related work'?'PROJECT · Tower civil / foundations and site interfaces':line.description;
   const scopeBasis=line.scopeBasis?.startsWith('Existing activity register C1-D')?scope.text:line.scopeBasis;
   return line.selected||description!==line.description||scopeBasis!==line.scopeBasis?{...line,selected:false,description,scopeBasis}:line;
  }
  const row=byLine.get(line.id);
  if(!row||row.kind!=='QUOTED'||
     row.inputKey!==lineKey(data,line)||row.sourceKey!==sourceKey(data,row.offerIds))return line;
  const survey=line.id===TOWER_SURVEY_ID_0550;
  const basis=survey?TOWER_SURVEY_BASIS_0550:TOWER_ENGINEERING_BASIS_0550;
  if(row.basis===basis)return line;
  const items=row.offerIds.map(id=>data.offers.find(o=>o.id===id));
  if(items.some(o=>!isTowerSourceItem0550(o)))return line;
  const kept=survey?items.filter(o=>o.supplierQuoteRow.itemCode==='6'):items;
  if(survey&&(items.length!==4||kept.length!==2||new Set(kept.map(o=>o.quoteRef)).size!==2||kept.some(o=>o.currency!=='THB'||!finite(o.quoteEvidence?.quotedTotal))))return line;
  const next={...line,...(survey?{manualCost:sumMoney0550(kept.map(o=>o.quoteEvidence.quotedTotal))}:{}),
   sourceRef:'RECEIVED QUOTATION / '+basis+'\n'+line.requirementRef,customerRemark:'Received quoted scope; '+basis};
  const offerIds=kept.map(o=>o.id);
  updates.set(line.id,{...row,basis,offerIds,inputKey:lineKey(data,next),sourceKey:sourceKey(data,offerIds)});
  return next;
 });
 const erectionLine=lines.find(l=>l.id===TOWER_ERECTION_ID_0550);
 const rows=receipt?.rows.filter(r=>!towerC1Reference0550(r.lineId===TOWER_ERECTION_ID_0550&&erectionLine?erectionLine:{id:r.lineId})).map(r=>updates.get(r.lineId)||r);
 const migratedErection=erectionLine!==data.lines.find(l=>l.id===TOWER_ERECTION_ID_0550);
 const priorErectionIndex=rows?.findIndex(r=>r.lineId===TOWER_ERECTION_ID_0550);
 let erectionReceiptChanged=false;
 if(rows&&erectionQuoted!==null&&erectionLine?.wbs==='B4'&&erectionLine.scopeBasis===erectionBasis&&
  (migratedErection||priorErectionIndex===-1)&&erectionLine.currency==='THB'&&erectionLine.quantity===1&&
  erectionLine.manualCost===erectionQuoted&&!erectionLine.offerId&&!erectionLine.calculationId){
  const row={lineId:erectionLine.id,kind:'QUOTED',basis:erectionBasis,offerIds:erectionOfferIds,ownerIds:[],ownerKeys:[],
   inputKey:lineKey(data,erectionLine),sourceKey:sourceKey(data,erectionOfferIds)};
  if(priorErectionIndex===-1)rows.push(row);else rows[priorErectionIndex]=row;
  erectionReceiptChanged=true;
 }
 const receiptChanged=receipt&&(rows.length!==receipt.rows.length||updates.size>0||erectionReceiptChanged);
 if(!receiptChanged&&lines.every((line,i)=>line===data.lines[i]))return data;
 return {...data,lines,...(receiptChanged?{repositoryBasisImport:{...data.repositoryBasisImport,bidCompletion:{...receipt,rows}}}:{})};
}
export function prepareBidCompletion0550(data,{policies,team,pricing},today){
 if(today<'2026-11-04')return data;
 if(data.repositoryBasisImport?.bidCompletion?.version===BID_COMPLETION_VERSION_0550)return prepareCusQuantityPricing0550(data,policies,today);
 // Wait for the actual project evidence. A repository seed is not the user's DATA.
 const sources=data.sourceIntake?.sources||[],replaced=new Set(sources.flatMap(s=>s.replaces||[]));
 const currentMR=sources.filter(s=>s.documentNo==='MM-ASK-1A-APF-TEL-MR-0001'&&s.revision==='B1'&&s.authority==='CURRENT_TENDER'&&s.content&&!replaced.has(s.id)),mr=currentMR.length===1?currentMR[0]:null;
 const tower=data.offers.filter(isTowerSourceItem0550);
 const spare=data.offers.filter(o=>o.vendorId==='VENDOR-CERAGON-0550'&&o.id.endsWith('-R12')&&o.quoteEvidence?.revision==='RevA1'&&o.quoteEvidence.quotedQuantity===1&&o.unit==='Lot'&&o.currency==='USD'&&finite(o.unitCost)&&o.unitCost>0);
 if(!data.repositoryBasisImport||!mr||tower.length!==30||spare.length!==1||!finite(data.fx.thbPerUSD)||data.fx.thbPerUSD<=0)return data;
 const model=pricing(),supply=model.provisional.lines.filter(l=>l.selected&&l.wbs==='A'&&finite(l.costTHB));let supplyCost=sumMoney0550(supply.map(l=>l.costTHB));
 if(!(supplyCost>0))return data;
 let nonMicrowave=sumMoney0550(supply.filter(l=>l.systemToken!=='TEL-DMR').map(l=>l.costTHB));
 const defaults=importMrWorkingBasis0550({lines:[],offers:[]},policies,today).lines;
 const lines=[...data.lines],rows=[],conflicts=[],goods=policyDefaults0550(policies,'Goods / Procured Cost');
 if(!goods)return data;
 const at=id=>lines.findIndex(l=>l.id===id),defaultFor=id=>defaults.find(l=>l.id===id);
 const safe=id=>{const n=at(id),expected=defaultFor(id);return n>=0&&expected&&same(lines[n],expected);};
 const set=(id,fields,kind,basis,offerIds=[])=>{
  if(!safe(id)){conflicts.push(id);return;}
  const n=at(id),old=lines[n];
  lines[n]={...old,...fields,sourceRef:(kind==='QUOTED'?'RECEIVED QUOTATION / ':prefix+' / ')+today+' / '+basis+'\n'+old.requirementRef,
   customerRemark:(kind==='QUOTED'?'Received quoted scope; ':'Provisional estimate; ')+basis.slice(0,700)};
  rows.push({lineId:id,kind,basis,offerIds,ownerIds:[]});
 };
 const estimate=(key,currency,cost,basis)=>set('REQ-MR-ACT-'+key,{quantity:1,unit:'Lot',currency,manualCost:roundMoney0550(cost),sellRate:null,...goods},'ESTIMATE',basis);
 const quoted=(key,items,basis)=>{
  const offers=tower.filter(o=>items.includes(Number(o.supplierQuoteRow.itemCode)));
  if(offers.length!==items.length*2||offers.some(o=>o.currency!=='THB'||!finite(o.quoteEvidence?.quotedTotal))){conflicts.push(key);return;}
  const total=sumMoney0550(offers.map(o=>o.quoteEvidence.quotedTotal));
  set('REQ-MR-ACT-'+key,{quantity:1,unit:'Lot',currency:'THB',manualCost:total,sellRate:null,...goods},'QUOTED',basis,offers.map(o=>o.id));
 };
 const reference=(key,ownerIds,basis)=>{
  const id=key.startsWith('REQ-')?key:'REQ-MR-ACT-'+key;
  if(!safe(id)||ownerIds.some(owner=>at(owner)<0||!lines[at(owner)].selected)){conflicts.push(id);return;}
  rows.push({lineId:id,kind:'INCLUDED',basis,offerIds:[],ownerIds});
  lines[at(id)]={...lines[at(id)],selected:false,coverageBasis:'NON-ADDITIVE BID WORK / '+basis};
 };
 // Price currently unquoted RFQ support/conferencing scope as explicit estimates.
 // Keep native MR quantities, responsibility and original supplier records.
 const supportPlans=new Map();
 for(const native of defaults.filter(l=>l.wbs==='A'&&['TEL-VSAT','TEL-VSAT-KU','TEL-LAN-VCS'].includes(l.systemToken)&&l.responsibility!=='COMPANY')){
  let rate,basis;
  if(native.systemToken==='TEL-VSAT'){
   if(/-CAB$/.test(native.id)){rate=40000;basis='VSAT support cabinet budget THB40000/SET; MR quantity retained. Cabinet specification, power and certification require supplier confirmation.';}
   else if(/-RTR$/.test(native.id)){rate=350000;basis='Cisco8300-class router budget THB350000/SET; MR quantity retained. Planning allowance including licence/accessory exposure, not a Cisco quotation or approved model/licence configuration. Supply responsibility remains under clarification.';}
   else if(/-KIT$/.test(native.id)){rate=15000;basis='VSAT supporting installation kit/accessories budget THB15000/SET; MR quantity retained. COMPANY terminal hardware is excluded.';}
   else if(native.unit==='m'){rate=300;basis='VSAT supporting cable budget THB300/m; native MR cable length retained. Cable type/installation/route requires confirmation; terminal hardware remains COMPANY supply.';}
  }else if(native.systemToken==='TEL-VSAT-KU'){rate=360000;basis='KU/C Internet bid allowance per site: THB120000 supporting terminal/accessory hardware plus12 planning months × THB20000/month service provision. This is an explicit12-month commercial assumption, not a provider offer or confirmed service specification/responsibility.';}
  else if(/-08$/.test(native.id)){rate=50000;basis='Audio-conference endpoint budget THB50000 per native MR Lot; native quantity retained. Manufacturer, codec, licences and network integration require confirmation.';}
  else {rate=280000;basis='Video-conference room-package budget THB280000 per native MR Lot; native quantity retained. Manufacturer, camera/audio/codec/licences and compatibility require confirmation.';}
  if(finite(rate)&&safe(native.id)){if(!supportPlans.has(native.systemToken))supportPlans.set(native.systemToken,[]);supportPlans.get(native.systemToken).push({lineId:native.id,quantity:native.quantity,unit:native.unit,rate,basis});}
 }
 for(const [token,plans] of supportPlans){
  const id='LINE-BID-SUPPORT-'+token+'-0550';if(at(id)>=0){conflicts.push(id);continue;}
  const total=sumMoney0550(plans.map(p=>p.quantity*p.rate));
  if(!finite(total)||plans.some(p=>!(p.quantity>0))){conflicts.push(token);continue;}
  const native=defaults.find(l=>l.systemToken===token&&l.wbs==='A'),basis=plans.map(p=>p.lineId+': '+p.quantity+' '+p.unit+' × '+p.rate+' THB/'+p.unit+'. '+p.basis).join('\n');
  lines.push({id,systemToken:token,wbs:'A',description:'ประมาณการ · '+token+' supporting supply / service budget',scopeKey:'BID.SUPPORT.'+token,tagRef:'PROJECT / native MR quantities',requirementRef:'MR Rev.B1 Appendix1.2/1.6 / native requirements retained',sourceRef:(prefix+' / '+today+' / One budget price owner; original MR quantities stay on native rows.\n'+basis).slice(0,4000),vendorId:'',offerId:'',calculationId:'',resultKey:'value',quantity:1,unit:'Lot',currency:'THB',manualCost:total,sellRate:null,markupPct:null,marginPct:null,primePct:null,...goods,selected:true,customerRowCode:native.customerRowCode,customerRemark:'Provisional budget on stated scope/quantity/rate assumptions; supplier configuration and responsibility remain subject to confirmation.',brand:'',...(['TEL-VSAT','TEL-VSAT-KU'].includes(token)?{satelliteScope:token==='TEL-VSAT-KU'?'CLARIFICATION':'TSI_EQUIPMENT',scopeBasis:'Explicit bid estimate for the listed supporting supply/service assumptions only; COMPANY terminal hardware remains excluded and ownership is not approved.'}:{})});
  rows.push({lineId:id,kind:'ESTIMATE',basis:('Single budget owner, no alteration of native MR quantities.\n'+basis).slice(0,4000),offerIds:[],ownerIds:[]});
 }
 // Bulk is one shared budget, never a new lot at each native cable/detail row.
 // This is a declared length allowance until the engineering takeoff replaces it.
 const bulkOwner=supply.find(l=>l.id==='LINE-MGW-DETAIL-BULK');
 const bulkBudget=(3*5000*170+4*3000*130)*1.2;
 const bulkExtra=bulkOwner?Math.max(0,bulkBudget-bulkOwner.costTHB):null,idBulk='LINE-BID-BULK-SCOPE-PROVISION-0550';
 if(bulkExtra>0&&at(idBulk)<0){
  lines.push({id:idBulk,systemToken:'TEL-FO',wbs:'A',description:'ประมาณการ · Shared bulk/cable scope balance beyond quoted MGW bulk',scopeKey:'BID.BULK.SCOPE.BALANCE',tagRef:'PROJECT / shared',requirementRef:'MR Rev.B1 Appendix1.8 / APF ACP ABV01 AMS01 and pipelineFOC; quantities not printed',sourceRef:prefix+' / '+today+' / Planning gross bulk allowance:3 pipeline routes ×5000m ×THB170/m (FO/duct exposure), plus4 sites ×3000m ×THB130/m (mixed site cables), plus20% termination/accessory provision. These lengths/unit costs are explicit assumptions, not a verified MTO/vendor rate. Deduct the full existing selected MGW bulk procurement cost once. No physical installation/civil included.',vendorId:'',offerId:'',calculationId:'',resultKey:'value',quantity:1,unit:'Lot',currency:'THB',manualCost:roundMoney0550(bulkExtra),sellRate:null,markupPct:null,marginPct:null,primePct:null,...goods,selected:true,customerRowCode:'A1-13',customerRemark:'Provisional shared bulk allowance on stated length/rate assumptions; final takeoff/reconciliation required.',brand:''});
  rows.push({lineId:idBulk,kind:'ESTIMATE',basis:'Gross bulk planning budget '+bulkBudget+' THB less existing MGW bulk cost '+bulkOwner.costTHB+' THB. Assumed3×5km pipeline routes and4×3km site cable pools; not verified lengths. Physical installation excluded.',offerIds:[],ownerIds:[]});
 }
 const extraSupply=lines.filter(l=>l.wbs==='A'&&rows.some(r=>r.lineId===l.id&&r.kind==='ESTIMATE')).reduce((n,l)=>n+l.quantity*l.manualCost,0);
 supplyCost=roundMoney0550(supplyCost+extraSupply);nonMicrowave=roundMoney0550(nonMicrowave+extraSupply);
 // The original B/C items have their own scope and do not depend on Part A pricing.
 const towerVendor=tower[0].vendorId;
 const completeTowerQuotes=['2609.95.1','2609.95.2'].every(ref=>{
  const items=tower.filter(o=>o.quoteRef===ref);
  const codes=new Set(items.map(o=>o.supplierQuoteRow.itemCode));
  return items.length===15&&Array.from({length:15},(_,i)=>String(i+1)).every(code=>codes.has(code))&&
   items.every(o=>o.vendorId===towerVendor&&o.currency==='THB'&&finite(o.quoteEvidence?.quotedTotal));
 });
 if(completeTowerQuotes){
  quoted('B7-D04',[6],TOWER_SURVEY_BASIS_0550);
  const id=TOWER_ENGINEERING_ID_0550,offers=tower.filter(o=>[1,8,15].includes(Number(o.supplierQuoteRow.itemCode)));
  if(at(id)<0){lines.push({id,systemToken:'TEL-TELT',wbs:'B1',description:'Tower OEM PM / foundation design / as-built — two original quotations',scopeKey:'TOWER.QUOTED.ENGINEERING',tagRef:'30m + 60m',requirementRef:'MR Rev.B1 / tower scope; Master Tower2609.95.1/2609.95.2 items1,8,15',sourceRef:'RECEIVED QUOTATION / '+TOWER_ENGINEERING_BASIS_0550,vendorId:towerVendor,offerId:'',calculationId:'',resultKey:'value',quantity:1,unit:'Lot',currency:'THB',manualCost:sumMoney0550(offers.map(o=>o.quoteEvidence.quotedTotal)),sellRate:null,markupPct:null,marginPct:null,primePct:null,...goods,selected:true,customerRowCode:'B1',customerRemark:'Received quoted scope; '+TOWER_ENGINEERING_BASIS_0550,brand:'MASTER TOWER'});rows.push({lineId:id,kind:'QUOTED',basis:TOWER_ENGINEERING_BASIS_0550,offerIds:offers.map(o=>o.id),ownerIds:[]});}
 }else conflicts.push('TOWER_SUPPLY_BOUNDARY');
 const delivery=tower.filter(o=>Number(o.supplierQuoteRow.itemCode)===14);
 // Domestic tower delivery is kept distinct from the overseas freight estimate.
 const delivered=delivery.length===2?sumMoney0550(delivery.map(o=>o.quoteEvidence.quotedTotal)):null;
 estimate('B1-D07','USD',10*1000,'External specialist review: planning10MD × USD1000/MD, existing external-specialist minimum policy; estimated call-off, not an OEM quotation. No existing TSI design hours repeated.');
 estimate('B2-D01','USD',4*2*4500,'CIF Yangon bid scenario:4 origin/consolidation groups ×2 container-equivalent shipments × budget USD4500. Planning assumption, not a forwarder quote or verified cargo takeoff. Excludes origin handling, forwarding and cargo premium below; MGW packing/delivery remains its existing owner.');
 estimate('B2-D02','THB',3*40000+(delivered||0),'Non-MGW origin handling:3 origin groups × THB40000 estimated, plus original tower item14 warehousing/delivery '+(delivered===null?'unavailable':delivered+' THB')+'. Excludes MGW origin package already priced; no second tower delivery charge.');
 const deliveryRow=rows.find(r=>r.lineId==='REQ-MR-ACT-B2-D02');if(deliveryRow)deliveryRow.offerIds=delivery.map(o=>o.id);
 estimate('B2-D03','THB',4*25000,'Forwarder/consolidation administration allowance4 shipments × THB25000; excludes carrier freight, origin handling, customs duties and statutory fees. No forwarder quotation received.');
 estimate('B2-D04','THB',supplyCost*1.1*0.004,'Cargo premium budget only: known selected PartA procurement cost ×110% insured-value assumption ×0.4% premium assumption. Not an insurer offer or confirmation of cover; duties/deductibles excluded. This is the sole cargo-premium owner.');
 reference('B2-D05',['REQ-MR-ACT-B2-D01','REQ-MR-ACT-B2-D02','REQ-MR-ACT-B2-D03'],'Route/Incoterm normalization is SI process work, not another freight purchase. Current bid scenarioCIF Yangon; RFQ FCA/FOB differences remain disclosed.');
 estimate('B3-D01','USD',13*1000,'Additional OEM product training budget13 trainer-MD × USD1000/MD: MGW10MD and microwave3MD planning assumptions. Excludes INDUSTRONIC training already inside selected PAGA package and existing TSI operator/maintenance training. Supplier course/duration confirmation remains required.');
 if(rows.some(r=>r.lineId==='REQ-MR-ACT-B3-D01')){
  const id='LINE-BID-OEM-TRAINING-TRAVEL-0550';
  if(at(id)<0){const template=lines[at('REQ-MR-ACT-B3-D01')];lines.push({...template,id,mrRequirementId:undefined,description:'ประมาณการ · Additional OEM trainer travel / lodging',scopeKey:'BID.OEM.TRAINING.TRAVEL',currency:'THB',manualCost:4*(40000+6*3500),sourceRef:prefix+' / '+today+' / Additional OEM training travel:4 trips × (THB40000 return transport +6 days ×THB3500 lodging/per diem). Explicit budget assumptions; no overlap with the TSI-only shared travel pool. No OEM travel quotation.',customerRemark:'Estimated additional OEM travel; reconcile trip origin, duration and reimbursables.'});delete lines[lines.length-1].mrRequirementId;rows.push({lineId:id,kind:'ESTIMATE',basis:'4 additional OEM trips × (THB40000 transport +6 days ×THB3500 lodging/per diem); TSI shared trips excluded.',offerIds:[],ownerIds:[]});}
 }
 reference('B3-D05',['LINE-TSI-BUDGET-AIRFARE','REQ-MR-ACT-B4-D08','LINE-TSI-BUDGET-PERDIEM','LINE-TSI-BUDGET-GROUND'],'TSI trainer travel is included in the versioned shared trip pool, whose basis expressly includes operation/maintenance training. Additional OEM travel is covered by a separate allowance below, not assumed included in this pool.');
 // Spare provisions are budgets, not fabricated itemized/OEM-approved lists.
 estimate('B5-D01','THB',supplyCost*0.02,'Startup spare provision2% of selected PartA procurement cost. Explicit monetary allowance pending OEM itemized recommendation; not an approved quantity list and not PartC long-term spares.');
 estimate('B5-D02','THB',supplyCost*0.01,'Precommissioning spare provision1% of selected PartA procurement cost; separate consumable/testing loss pool, no item from startup provision recharged. Estimated allowance, not an OEM quote.');
 estimate('B5-D03','THB',supplyCost*0.01,'Commissioning spare provision1% of selected PartA procurement cost; separate cutover/startup event pool. Before procurement, replace provision by itemized vendor rates and deduct all proven package inclusions.');
 estimate('B6-D01','THB',5*75000,'Special-tool allowance5 families (RF, FO, network, NDB, mechanical/site) × budget THB75000/family. Explicit estimate; excludes purchased test equipment, calibration, software and tools already in equipment packages.');
 estimate('B6-D02','THB',100000,'Supplementary proprietary/software licence provision THB100000, excluding INTRON-X service tool already described in the selected INDUSTRONIC package. Budget estimate for unconfirmed additional licences; not evidence of licence entitlement.');
 estimate('B6-D03','THB',3*10*7500,'Test equipment rental/adapters:3 campaigns ×10 days × estimated THB7500/day. Rental, not purchase; excludes special tools above and instruments provided by existing OEM packages.');
 estimate('B6-D04','THB',5*5000,'Calibration/certification provision5 instrument families × estimated THB5000. Excludes calibration already included in the rental/OEM package; reconcile certificates before purchase.');
 const licenceAllowance=licensingBudget.workingAllowance;
 estimate('B8-D05','THB',sumMoney0550(licenceAllowance.map(r=>r.quantity*r.rateTHB)),
  'Authority/agent provisional cash allowance: '+licenceAllowance.map(r=>r.label+' · '+r.quantity+' × THB '+r.rateTHB).join(' / ')+'. Estimated exposure, not published statutory tariffs or approval. TSI preparation labour is already separate.');
 // Cash pass-through assumptions are explicit; goods margins do not apply.
 for(const key of ['B8-D05','B2-D04']){const n=at('REQ-MR-ACT-'+key);if(rows.some(r=>r.lineId===lines[n]?.id&&r.kind==='ESTIMATE'))lines[n]={...lines[n],sellMode:'DIRECT',sellRate:lines[n].manualCost,marginPct:null,primePct:0};}
 estimate('B9-D01','THB',supplyCost*0.005,'Project liability/contract-risk premium provision0.5% of selected PartA procurement value. Explicit bid budget, not insurance advice, a quoted premium or confirmed policy wording; cargo and personnel cover are separate.');
 estimate('B9-D03','THB',6*15000,'Medevac/medical-related cover provision6 planning personnel × estimated THB15000; not confirmation of policy eligibility/cover. Existing personnel travel/work-risk allowance is separate; deduct overlap when policy is quoted.');
 for(const key of ['B9-D01','B9-D03']){const n=at('REQ-MR-ACT-'+key);if(rows.some(r=>r.lineId===lines[n]?.id&&r.kind==='ESTIMATE'))lines[n]={...lines[n],sellMode:'DIRECT',sellRate:lines[n].manualCost,marginPct:null,primePct:0};}
 reference('B9-D04',['REQ-MR-ACT-B2-D04'],'Shipment-related cover is the same cargo premium already owned inB2-D04, not an additional policy.');
 estimate('C1-D01','THB',4*20*4*4000,'Installation OPTION:4 site campaigns ×20 days ×4 technicians × budget THB4000/MD. Physical equipment mounting only; excludes cable installation, FO, tower/civil, SAT/commissioning and COMPANY terminal installation below. Not a verified installation MTO or subcontract quote.');
 estimate('C1-D02','THB',4*10*4*4000,'Installation OPTION:4 sites ×10 days ×4-person crew × budget THB4000/MD, for physical cable/tray work only. Material supply and testing/commissioning remain elsewhere. Workload is a planning assumption pending cable takeoff.');
 estimate('C1-D03','THB',3*20*4*4000+30*4000,'FO installation OPTION:3 route campaigns ×20 days ×4 crew × budget THB4000/MD plus30 equipment-rental days × THB4000. Excludes trench/civil/duct supply and fibre supply. Route lengths and production rates remain assumptions, not a verified takeoff.');
 set('REQ-MR-VSAT-INSTALL',{quantity:1,unit:'Lot',currency:'THB',manualCost:4*4*4000,sellRate:null,...goods},'ESTIMATE','Installation OPTION:4 terminal-support sets ×4 technician-MD × budget THB4000/MD. COMPANY equipment remains excluded; APF/ACP/Yangon execution boundary requires confirmation.');
 reference('C2-D01',['REQ-MR-ACT-C2-D02','REQ-MR-ACT-C2-D03'],'Capital-spare list/summary is non-additive. CERAGON two-ODU quote and remaining-system provision are separate price owners; final OEM ten-year list is still a deliverable.');
 // The quoted package contains two ODUs; one package is bought, never2 × its rate.
 set('REQ-MR-ACT-C2-D02',{quantity:1,unit:'Lot',currency:'USD',manualCost:null,sellRate:null,offerId:spare[0].id,vendorId:spare[0].vendorId,...goods},'QUOTED','Proposed capital-spare option: one original CERAGON spare package containing2ODUs and source-listed accessories. This quote is not an OEM-certified ten-year complete spare list.',[spare[0].id]);
 estimate('C2-D03','THB',nonMicrowave*0.06,'Ten-year capital-spare OPTION provision6% of selected non-microwave PartA procurement cost. Microwave is excluded from this percentage because its quoted spare package is a separate owner. Explicit allowance, not an itemized/approved capital-spare list.');
 reference('C3-D01',['REQ-MR-ACT-C3-D02','REQ-MR-ACT-C3-D03'],'Two-year spare-list/summary is non-additive; the consumable and routine-replacement provisions below are distinct from capital spares. Final OEM list remains a deliverable.');
 estimate('C3-D02','THB',supplyCost*0.02,'Two-year normal-operation consumable OPTION provision2% of selected PartA procurement cost. Consumables only; no capital replacement assemblies or commissioning consumption are included again. Estimate pending OEM list.');
 estimate('C3-D03','THB',supplyCost*0.01,'Two-year routine-replacement OPTION provision1% of selected PartA procurement cost. Excludes consumables above and ten-year capital assemblies. Estimate pending itemized OEM recommendations.');
 set('REQ-MR-WARRANTY',{quantity:1,unit:'Lot',currency:'THB',manualCost:roundMoney0550(supplyCost*0.0075),sellMode:'DIRECT',sellRate:roundMoney0550(supplyCost*0.0075),marginPct:null,primePct:0},'ESTIMATE','Residual warranty cash reserve0.75% of selected PartA procurement cost, excluding existing90-day support labour and pass-through OEM warranty. Explicit budget reserve, not a duplicated support campaign or confirmation of warranty compliance.');
 // Estimate internal labour separately from protected selling rates. This does
 // not infer a cost by reversing the selling margin or claim a payroll quote.
 if(team&&data.repositoryBasisImport.tsiActivityBudget){
  const labourExpected=prepareTsiActivityBudget0550({projectId:data.projectId,repositoryBasisImport:{},lines:clone(defaults),calculations:[]},policies,team,data.repositoryBasisImport.tsiActivityBudget.preparedOn);
  const expected=prepareTsiExpenseBudget0550(labourExpected,policies,team,data.repositoryBasisImport.tsiActivityBudget.preparedOn);
  const costMH={PM:875,CHIEF:750,SENIOR:600,TECH:500,SUPPORT:562.5,DOC:400,ADMIN:250};
  for(const plan of [...TSI_ACTIVITY_PLAN_0550,{lineId:"REQ-MR-ACT-B4-D07",role:"TECH"}]){
   const id=plan.lineId||'REQ-MR-ACT-'+plan.key,n=at(id),base=expected.lines.find(l=>l.id===id);
   const calculation=data.calculations.find(c=>c.id===base?.calculationId),expectedCalc=expected.calculations.find(c=>c.id===base?.calculationId);
   if(n<0||!base||!same(lines[n],base)||!same(calculation,expectedCalc))continue;
   const thbRate=costMH[plan.role]*(base.unit==='MD'?8:1),rate=thbRate/data.fx.thbPerUSD;
   lines[n]={...lines[n],manualCost:rate,sourceRef:base.sourceRef+'\nINTERNAL COST ESTIMATE / '+today+': planning '+thbRate+' THB/'+base.unit+' ÷ saved THB/USD '+data.fx.thbPerUSD+'; '+plan.role+' workload cost assumption, not a payroll/subcontract quote. Protected selling rate unchanged.'};
   rows.push({lineId:id,kind:'COST_ESTIMATE',basis:'Explicit internal labour planning cost '+thbRate+' THB/'+base.unit+' at saved FX; selling inputs unchanged. Cost grade '+plan.role+'.',offerIds:[],ownerIds:[]});
  }
 }
 // Allocate the already existing B7/B8/B9 activities into the native B1–B6 rows.
 // Their internal WBS and IDs remain unchanged; blank customer rows are not new modules.
 for(let n=0;n<lines.length;n++)if(['B7','B8','B9'].includes(lines[n].wbs)&&!lines[n].customerRowCode&&lines[n].selected){
  const original=data.lines.find(l=>l.id===lines[n].id);if(!original)continue;
  const wasDefault=safe(lines[n].id)||rows.some(r=>r.lineId===lines[n].id)||data.repositoryBasisImport.tsiActivityBudget?.updatedLineIds.includes(lines[n].id)||data.repositoryBasisImport.tsiActivityBudget?.expenseLineIds?.includes(lines[n].id);
  if(wasDefault){lines[n]={...lines[n],customerRowCode:lines[n].wbs==='B9'?'B4':'B1',customerRemark:[lines[n].customerRemark,'Native customer allocation: '+lines[n].wbs+' retained internally; '+(lines[n].wbs==='B9'?'project/personnel cover under specialist field assistanceB4':'survey/regulatory engineering underB1')+'.'].filter(Boolean).join(' ').slice(0,4000)};if(!rows.some(r=>r.lineId===lines[n].id))rows.push({lineId:lines[n].id,kind:'ALLOCATION',basis:'Existing priced activity allocated to native PartB row without changing its amount or internal WBS.',offerIds:[],ownerIds:[]});}
 }
 // A financial package reference is distinct from accepted technical coverage.
 // Scope/quantity discrepancies and CAL/RPT remain in the canonical SI records.
 const byId=new Map(lines.map(l=>[l.id,l]));
 const pricedOwners=lines.filter(l=>l.selected&&l.wbs==='A'&&(!l.mrRequirementId||rows.some(r=>r.lineId===l.id&&r.kind==='ESTIMATE')||model.provisional.lines.some(p=>p.id===l.id&&p.selected&&finite(p.customerUSD))));
 const quotedOffers=new Map(pricedOwners.map(l=>[l.id,new Set(workingOffers0550(data,l).map(o=>o.id))]));
 for(const line of lines.filter(l=>l.selected&&l.wbs==='A'&&l.mrRequirementId&&safe(l.id)&&!l.coveredByLineId)){
  const req=data.integrationWorkspace?.requirements.find(r=>r.id==='REQDEF-'+line.mrRequirementId);
  if(!req?.sourceIds?.length)continue;
  let owners=[];
  if(line.mrRequirementId.startsWith('MR-B1-18-'))owners=['LINE-MGW-DETAIL-BULK',idBulk].filter(id=>byId.get(id)?.selected);
  else if(line.systemToken==='COMMON'&&/Antenna Cable/i.test(line.description))owners=['LINE-MGW-DETAIL-RADIO-SHARED'].filter(id=>byId.get(id)?.selected);
  else owners=pricedOwners.filter(l=>l.systemToken===line.systemToken||(req.offerIds||[]).some(id=>quotedOffers.get(l.id)?.has(id))).map(l=>l.id);
  if(!owners.length){conflicts.push(line.id);continue;}
  rows.push({lineId:line.id,kind:'PRICE_REFERENCE',ownerIds:[...new Set(owners)],offerIds:req.offerIds||[],basis:'Bid pricing allocation to the existing selected package(s), counted once. This is not accepted engineering coverage or confirmation that quoted quantities/specifications match the MR. Native MR quantities, supplier differences, source evidence and SI review remain unchanged. '+(req.supplierBasis||'').slice(0,1700)});
 }
 const result={...data,lines};
 for(const row of rows){row.inputKey=lineKey(result,byId.get(row.lineId));row.sourceKey=key(row.offerIds.map(id=>data.offers.find(o=>o.id===id)||null));row.ownerKeys=row.ownerIds.map(id=>ownerKey(result,byId.get(id)));}
 const prepared={...result,repositoryBasisImport:{...data.repositoryBasisImport,bidCompletion:{version:BID_COMPLETION_VERSION_0550,preparedOn:today,basisLineIds:pricedOwners.map(l=>l.id),basisKey:key([data.fx,pricedOwners.map(l=>ownerKey(result,l))]),supplyBasisTHB:supplyCost,nonMicrowaveBasisTHB:nonMicrowave,rows,conflicts}}};
 return prepareCusQuantityPricing0550(prepared,policies,today);
}

export function bidCompletionReference0550(data,id){return data.repositoryBasisImport?.bidCompletion?.rows.find(r=>r.lineId===id&&r.kind==='INCLUDED')||null;}
export function bidCompletionReferenceResolved0550(data,id,prices){
 return bidCompletionReferences0550(data,prices).has(id);
}
export function bidCompletionReferences0550(data,prices){
 const result=new Map(),byId=new Map(data.lines.map(l=>[l.id,l])),priceById=new Map(prices.map(l=>[l.id,l])),keys=new Map();
 for(const reference of data.repositoryBasisImport?.bidCompletion?.rows||[]){
  if(!['INCLUDED','PRICE_REFERENCE'].includes(reference.kind))continue;
  const line=byId.get(reference.lineId);
  if(!line||lineKey(data,line)!==reference.inputKey||line.manualCost!==null||line.sellRate!==null||line.offerId||line.calculationId||!reference.ownerIds.length)continue;
  if(reference.kind==='INCLUDED'&&(line.selected||line.coverageBasis!=='NON-ADDITIVE BID WORK / '+reference.basis))continue;
  if(!reference.ownerIds.every((id,n)=>{const owner=byId.get(id),price=priceById.get(id);if(!owner||owner.id===line.id||!owner.selected||!price?.selected||!finite(price.customerUSD))return false;if(!keys.has(id))keys.set(id,ownerKey(data,owner));return keys.get(id)===reference.ownerKeys[n];}))continue;
  result.set(line.id,reference);
 }
 return result;
}
export function validateBidCompletion0550(receipt){
 if(receipt===undefined)return;
 const allowed=['version','preparedOn','basisLineIds','basisKey','supplyBasisTHB','nonMicrowaveBasisTHB','rows','conflicts'];
 if(!receipt||Object.keys(receipt).some(k=>!allowed.includes(k))||receipt.version!==BID_COMPLETION_VERSION_0550||!Array.isArray(receipt.basisLineIds)||receipt.basisLineIds.length>200||receipt.basisLineIds.some(id=>typeof id!=='string'||id.length>100)||typeof receipt.basisKey!=='string'||receipt.basisKey.length>100||(!/^\d{4}-\d{2}-\d{2}$/.test(receipt.preparedOn)||!Number.isFinite(Date.parse(receipt.preparedOn))||new Date(receipt.preparedOn).toISOString().slice(0,10)!==receipt.preparedOn)||![receipt.supplyBasisTHB,receipt.nonMicrowaveBasisTHB].every(n=>finite(n)&&n>0)||!Array.isArray(receipt.rows)||receipt.rows.length>500||new Set(receipt.rows.map(r=>r.lineId)).size!==receipt.rows.length||!Array.isArray(receipt.conflicts)||receipt.conflicts.length>200||receipt.conflicts.some(id=>typeof id!=='string'||id.length>200))throw Error('Invalid bid completion receipt');
 for(const row of receipt.rows){if(Object.keys(row).some(k=>!['lineId','kind','basis','offerIds','ownerIds','inputKey','ownerKeys','sourceKey'].includes(k))||!['QUOTED','ESTIMATE','INCLUDED','ALLOCATION','COST_ESTIMATE','PRICE_REFERENCE'].includes(row.kind)||typeof row.lineId!=='string'||typeof row.basis!=='string'||row.basis.length>4000||!Array.isArray(row.offerIds)||row.offerIds.length>200||!Array.isArray(row.ownerIds)||row.ownerIds.length>100||typeof row.inputKey!=='string'||typeof row.sourceKey!=='string'||row.sourceKey.length>100||!Array.isArray(row.ownerKeys)||row.ownerKeys.length!==row.ownerIds.length||row.ownerKeys.some(k=>typeof k!=='string'||k.length>100)||[...row.offerIds,...row.ownerIds].some(id=>typeof id!=='string'||id.length>100))throw Error('Invalid bid completion row');}
}

export function bidCompletionBasisChanged0550(data){
 const receipt=data.repositoryBasisImport?.bidCompletion;if(!receipt)return false;
 const byId=new Map(data.lines.map(l=>[l.id,l]));
 // Earlier percentage allowances were derived before these procurement costs.
 if(receipt.rows.some(r=>cusPriceIds.has(r.lineId)&&byId.get(r.lineId)?.selected&&!receipt.basisLineIds.includes(r.lineId)))return true;
 return receipt.rows.some(r=>!byId.has(r.lineId)||lineKey(data,byId.get(r.lineId))!==r.inputKey||r.sourceKey!==key(r.offerIds.map(id=>data.offers.find(o=>o.id===id)||null)))||receipt.basisLineIds.some(id=>!byId.has(id))||receipt.basisKey!==key([data.fx,receipt.basisLineIds.map(id=>ownerKey(data,byId.get(id)))]);
}

export function cusQuantityWorkingRows0550(data,model,systemToken){
 const receipt=data.repositoryBasisImport?.bidCompletion;
 if(!receipt)return [];
 const ids=new Set(receipt.rows.filter(r=>cusPriceIds.has(r.lineId)).map(r=>r.lineId));
 return model.provisional?.lines.filter(l=>l.systemToken===systemToken&&l.selected&&ids.has(l.id))||[];
}

// Read-only source usage for Vendor/Working inspection. Do not extend
// workingOffers0550: that helper participates in financial/review fingerprints.
// A receipt is evidence of a dated allocation, not a new offer selection.
export function bidCompletionSourceUsages0550(data){
 const receipt=data.repositoryBasisImport?.bidCompletion;
 if(receipt?.version!==BID_COMPLETION_VERSION_0550)return [];
 const lines=new Map(data.lines.map(l=>[l.id,l])),offers=new Map(data.offers.map(o=>[o.id,o]));
 return receipt.rows.filter(r=>['QUOTED','ESTIMATE'].includes(r.kind)&&r.offerIds.length).flatMap(row=>{
  const line=lines.get(row.lineId);if(!line||towerC1Reference0550(line))return [];
  const current=lineKey(data,line)===row.inputKey&&key(row.offerIds.map(id=>offers.get(id)||null))===row.sourceKey&&!cusQuantityPricingProblems0550(data,line).length;
  return [{line,offerIds:row.offerIds,current,kind:row.kind,basis:row.basis}];
 });
}
