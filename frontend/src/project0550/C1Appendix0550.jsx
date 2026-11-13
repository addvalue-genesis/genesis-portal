import React,{useEffect,useMemo,useRef,useState} from 'react';
import {ComponentCopyId} from '../common/ui/ComponentCopyId';
import {bidOwnerStyle} from './bidPresentation0550';
import {deriveC1Appendix0550,c1AppendixOverview0550,c1AppendixSubtotalLabel0550,c1Display0550,c1AppendixCss0550} from './data/c1Appendix0550';
import {sumMoney0550} from './data/money0550';
import {RADIO_RELEASE_LOT_0550} from './releaseHierarchy0550';
import {cabinetTagLabel0550,draftCabinetTag0550,mappedCabinetTags0550} from './data/cabinetTag0550';
import {MR_WORKING_CATALOG_0550} from './data/mrWorkingBasis0550';
import {mgwCurrentItemKey0550} from './data/mgwQuoteSelection0550';
import {versedLanRackOffer0550} from './data/versedRack0550';

// Keep the native MR rows in order. In the interactive screen, put a separate
// package-price block first so an expanded Appendix still reveals its price.
const screenSites=(sites,nativeOrder)=>nativeOrder?sites:[...sites.filter(s=>s.rows.every(r=>r.kind==='PACKAGE')),...sites.filter(s=>!s.rows.every(r=>r.kind==='PACKAGE'))];

function PagaQuoteCosts0550({quote}){
 const {offer,items}=quote,evidence=offer.quoteEvidence,totals=evidence.commercialTotals;
 const {quotedCurrency:currency,sourceUrl}=evidence;
 const cost=value=>Number.isFinite(value)?currency+' '+c1Display0550(value):'—';
 const itemStatus=item=>{
  const row=item.supplierQuoteRow,source=item.quoteEvidence;
  if(row.classification==='OPTION')return 'Option · '+(source.quotedTotalText||'แยกจากยอด NET');
  if(row.classification==='INCLUDED_REFERENCE')return source.quotedTotalText||'รวมในแพ็กเกจ';
  return row.discountable?'อยู่ในฐานส่วนลด':'ไม่มีส่วนลด';
 };
 return <div>
  <p><strong>{offer.quoteRef}</strong>{sourceUrl&&<> · <a href={sourceUrl} target="_blank" rel="noopener noreferrer">เปิดใบเสนอราคา PDF</a></>}</p>
  {items.length>0&&<table aria-label={'ต้นทุนตามใบเสนอราคา '+offer.quoteRef}>
   <thead><tr><th>Item</th><th>รายการตามใบเสนอราคา</th><th>หน่วย</th><th>จำนวน</th><th>ต้นทุนต่อหน่วย</th><th>ยอดตามใบเสนอราคา</th><th>เงื่อนไข / หน้า PDF</th></tr></thead>
   <tbody>{items.map(item=>{
    const source=item.quoteEvidence;
    return <tr key={item.id} data-paga-quote-item={item.supplierQuoteRow.itemCode}>
     <td>{item.supplierQuoteRow.itemCode}</td><td>{item.description}</td><td>{source.quotedUnit}</td><td className="number">{source.quotedQuantity??'—'}</td>
     <td className="number">{cost(source.quotedUnitCost)}</td><td className="number">{cost(source.quotedTotal)}</td><td>{itemStatus(item)} · {source.locator}</td>
    </tr>;
   })}</tbody>
  </table>}
  {!items.length&&<p>ยังไม่พบรายการย่อยของฉบับนี้ใน 07.2 Vendor Offers</p>}
  {totals&&<p>ก่อนส่วนลด {cost(totals.gross)} · ฐานส่วนลด {cost(totals.discountable)} · ส่วนลด {totals.discountPercent}% ({cost(totals.discount)})</p>}
  <p><strong>ต้นทุนสุทธิ NET {cost(evidence.quotedTotal)}</strong></p>
 </div>;
}

function PagaPackageCosts0550({cost,onNavigate,disabled}){
 const {selected,candidate,lineId}=cost;
 return <tr className="c1-paga-cost"><td colSpan={7}><details>
  <summary>ดูต้นทุนตามใบเสนอราคา INDUSTRONIC{candidate?' · '+candidate.offer.quoteRef:''}</summary>
  <p>ราคาขายแถวด้านบนใช้ {selected.offer.quoteRef} ใน Working A1-05 คิดราคาแพ็กเกจ 1 Lot ครั้งเดียว</p>
  {candidate&&<><p>{candidate.offer.quoteRef} อยู่ในทะเบียน Vendor และรอเลือกใช้ใน Working A1-05</p><PagaQuoteCosts0550 quote={candidate}/></>}
  {candidate?<details><summary>ดูต้นทุนฉบับที่ใช้ใน Working · {selected.offer.quoteRef}</summary><PagaQuoteCosts0550 quote={selected}/></details>:<PagaQuoteCosts0550 quote={selected}/>}
  {selected.offer.quoteRef!=='A20261632-005'&&candidate?.offer.quoteRef!=='A20261632-005'&&
   <p>ถ้าต้องการใช้ A20261632-005 ให้ตรวจว่าใบเสนอราคาฉบับนี้โหลดเข้า 07.2 แล้ว</p>}
  {onNavigate&&<button type="button" disabled={disabled} onClick={()=>onNavigate('bid.budget.working.line.'+lineId)}>เปิด Working A1-05</button>}
 </details></td></tr>;
}

export function C1Appendix0550({view,currency='USD',onNavigate,disabled=false,mrNavigationTarget}){
 const projection=useMemo(()=>deriveC1Appendix0550(view,currency),[view,currency]);
 const overview=useMemo(()=>c1AppendixOverview0550(projection),[projection]);
 const [opened,setOpened]=useState({}),[documentMode,setDocumentMode]=useState(false),[selected,setSelected]=useState('MR-B1-13-APF-09');
 const trace=useRef(null),focusedRow=useRef(null);
 const location=useMemo(()=>{
  if(!mrNavigationTarget)return null;
  for(const group of projection.groups)for(const system of group.systems)for(const site of system.sites){
   const row=site.rows.find(r=>r.mr?.id===mrNavigationTarget);
   if(row)return {appendix:group.id,system:system.name,site:site.name,key:row.key};
  }
  return null;
 },[projection,mrNavigationTarget]);
 useEffect(()=>{
  if(!location)return;
  const {appendix,system,site,key}=location;
  setOpened(old=>({...old,['APP:'+appendix]:true,['SYS:'+appendix+':'+system]:true,['SITE:'+appendix+':'+system+':'+site]:true}));
  setSelected(key);
  if(trace.current)trace.current.open=true;
  const timer=setTimeout(()=>{
   focusedRow.current?.scrollIntoView({block:'center'});
   focusedRow.current?.focus({preventScroll:true});
  },80);
  return ()=>clearTimeout(timer);
 },[location]);
 const screenSubtotal=projection.amount!==null?null:view.workingPreview?projection.pricedItemsSubtotal:
  documentMode?null:sumMoney0550(overview.map(group=>group.amount).filter(Number.isFinite));
 const expanded=(key,component=false)=>documentMode||(opened[key]??!component);
 const toggle=(key,component=false)=>setOpened(s=>({...s,[key]:!(s[key]??!component)}));
 const setAll=mode=>{const next={};for(const g of projection.groups){next['APP:'+g.id]=mode!=='OVERVIEW';for(const s of g.systems){next['SYS:'+g.id+':'+s.name]=true;for(const site of s.sites){next['SITE:'+g.id+':'+s.name+':'+site.name]=true;for(const r of site.rows)next[r.key]=mode==='ALL';}}}setOpened(next);};
 const active=projection.rows.find(r=>r.key===selected)||projection.rows[0];
 const containedMrIds=active?.mr?MR_WORKING_CATALOG_0550.rows.filter(r=>r.owner===active.mr.id).map(r=>r.id):[];
 const containedReqs=(view.c1Context?.requirements||[]).filter(r=>containedMrIds.includes(r.id.replace(/^REQDEF-/,'')));
 const traceCabinetTags=[...new Set([...(active?.requirements||[]),...containedReqs].flatMap(r=>mappedCabinetTags0550(r)))];
 const draftCabinet=[active?.mr?.id,...containedMrIds].map(draftCabinetTag0550).find(Boolean);
 const traceCabinetLabel=cabinetTagLabel0550(traceCabinetTags,draftCabinet);
 const navigate=(id,options)=>{if(!disabled)onNavigate?.(id,options);};
 const button=(key,label,component=false)=>documentMode?(component?null:<span>{label}</span>):<button type="button" className={component?'p55-c1-item-toggle':'p55-c1-group-toggle'} aria-expanded={expanded(key,component)} aria-label={label} onClick={()=>toggle(key,component)}><span aria-hidden="true">{expanded(key,component)?'−':'+'}</span>{!component&&<span>{label}</span>}</button>;
 const traceIds=active?Array.from(new Set([...(active.ownerIds||[]),...(active.raws||[]).map(l=>l.id)])):[];
 return <section className="p55-c1-workspace" aria-label="C1 Appendix workspace">
  <style>{c1AppendixCss0550+'\n.c1-paga-cost{background:#f4f7f9}.c1-paga-cost summary{cursor:pointer;font-weight:600}@media print{.c1-paga-cost{display:none}}'}</style>
  <div className="p55-c1-screen-head"><span>PJ2608-0550 / 11 · Quotation / C1</span><span>SI-OUT / Schedule C1</span></div>
  <h3>C1 · ภาพรวมทั้ง 8 Appendix</h3>
  <div className="p55-c1-controls">
   <button type="button" aria-pressed={!documentMode} onClick={()=>setDocumentMode(false)}>ดูแบบ +/−</button>
   <button type="button" aria-pressed={documentMode} onClick={()=>setDocumentMode(true)}>ดูเอกสารขยายครบ</button>
   {!documentMode&&<><button type="button" onClick={()=>setAll('OVERVIEW')}>ยุบเหลือ 8 หมวด</button><button type="button" onClick={()=>setAll('MAIN')}>แสดงรายการหลักทั้งหมด</button><button type="button" onClick={()=>setAll('ALL')}>ขยายส่วนประกอบทั้งหมด</button></>}
  </div>
  <nav className="p55-c1-jumps" aria-label="C1 Appendices">{projection.groups.filter(g=>g.id!=='OTHER').map(g=><button type="button" key={g.id} onClick={()=>{setOpened(s=>({...s,['APP:'+g.id]:true}));document.getElementById('p55-c1-app-'+g.id)?.scrollIntoView({block:'start'});}}>{g.id}</button>)}</nav>
  <p className="p55-c1-screen-note">CUS · MR Rev.B1 → SI → VND → Working · ราคาขายจาก Working ที่เลือกตามมุมมองปัจจุบัน · “—” คือยังไม่แสดงค่า ไม่ใช่ศูนย์ · DRAFT จนกว่าจะผ่านการออก Release</p>
  <details ref={trace} className="p55-c1-trace" aria-label="C1 internal trace"><summary>CUS ↔ SI ↔ VND / Working · Module ID และผลตรวจภายใน</summary>
   <ComponentCopyId projectId="PJ2608-0550" componentKey="bid.quotation.C1"/>
   <label>รายการ C1 ที่ต้องการตรวจ<select aria-label="C1 trace row" value={active?.key||''} onChange={e=>setSelected(e.target.value)}>{projection.rows.map(r=><option key={r.key} value={r.key}>{r.sn} · {r.site} · {r.description}</option>)}</select></label>
   {active&&<><p>{active.mr?.reference||active.description}</p>{active.internalNote&&<p>Working · {active.internalNote}</p>}
    {traceCabinetLabel&&<p>{traceCabinetLabel}</p>}
    {active.mr?.id.startsWith('MR-B1-11-')&&<button type="button" disabled={disabled} onClick={()=>navigate(RADIO_RELEASE_LOT_0550,{mrId:active.mr.id})}>10.7 · กลับ Release A1-07</button>}
    {active.appendix==='1.8'&&[...new Set((active.priceOwners||[]).map(b=>b.line.customerRowCode).filter(Boolean))].map(code=>
     <button type="button" key={code} disabled={disabled} onClick={()=>navigate('bid.budget.release.customer.'+code)}>10.7 · Release {code}</button>)}
    {active.mr&&<><button type="button" disabled={disabled} onClick={()=>navigate('bid.documents.controlled-source-inventory.mr.page.'+(Number(active.mr.reference.match(/\/\s*p(\d+)/)?.[1]||0)+2))}>CUS · เปิด MR ต้นทาง</button>{(active.mr.canonicalIds||[active.mr.id]).map(id=><button type="button" key={id} disabled={disabled} onClick={()=>navigate('bid.working-preview.requirement.REQDEF-'+id)}>SI-REQ · เปิดข้อกำหนด {active.mr.canonicalIds?id:''}</button>)}</>}
    <button type="button" disabled={disabled} onClick={()=>navigate('bid.working-preview.step.7')}>SI-WP-07 · Mapping กับ VND</button>
    {traceIds.map(id=><div key={id}><ComponentCopyId projectId="PJ2608-0550" componentKey={'bid.budget.working.line.'+id}/><button type="button" disabled={disabled} onClick={()=>navigate('bid.budget.working.line.'+id)}>SI-COST · เปิดเจ้าของงาน/ราคา</button><button type="button" disabled={disabled} onClick={()=>navigate('bid.quotation.line.'+id)}>ตรวจ Schedule allocation</button></div>)}
    {Array.from(new Set([...(active.requirements||[]).flatMap(r=>r.offerIds||[]),...(active.priceOwners||[]).map(b=>b.line.offerId).filter(Boolean),...(active.candidateOfferIds||[]),...(active.pagaReference?.offers||[]).map(o=>o.id)])).map(id=><button type="button" key={id} disabled={disabled} onClick={()=>navigate('bid.vendor.offer.'+id)}>VND · {id}</button>)}
   </>}
   <p>{projection.rows.filter(r=>r.kind==='MR').length} แถว MR · {projection.bindings.length} เจ้าของราคา C1 · ไม่แบ่งราคา package ตามสัดส่วนโดยไม่มีฐาน</p>
   {projection.pendingOwners?.length>0&&<details aria-label="C1 pending Working owners"><summary>Working รอ Mapping / ราคา · {projection.pendingOwners.length} รายการ</summary><p>ตรวจสอบการผูกแถว MR และราคาจาก Working สำหรับรายการที่ยังรอจัดลง C1</p>{projection.pendingOwners.map(b=><div key={b.lineId}><strong>{b.line.description}</strong><span> · {b.quantity??'—'} {b.unit}</span><ComponentCopyId projectId="PJ2608-0550" componentKey={'bid.budget.working.line.'+b.lineId}/><button type="button" disabled={disabled} onClick={()=>navigate('bid.budget.working.line.'+b.lineId)}>SI-COST · ตรวจ Working</button></div>)}</details>}
   {projection.mrNameDuplicates?.length>0&&<details aria-label="C1 MR repeated names"><summary>ตรวจชื่อรายการซ้ำตาม MR · {projection.mrNameDuplicates.length} กลุ่ม</summary><p>ตำแหน่ง MR ต่างกันยังเป็นคนละรายการ ต้องเทียบสถานที่ติดตั้ง ส่วนประกอบ และเจ้าของราคา ไม่รวมจำนวนหรือคิดราคาเพิ่มจากชื่อที่ตรงกัน</p>{projection.mrNameDuplicates.map(rs=><div key={rs[0].key}><strong>APPENDIX {rs[0].appendix} · {rs[0].site} · {rs[0].description}</strong>{rs.map(r=><p key={r.key}>{r.sn} · {r.mr.reference}{r.notes.filter(n=>/\binstall(?:ed|ation)?\b/i.test(n)).map((note,i)=><span key={i}> · {note}</span>)}<button type="button" disabled={disabled} onClick={()=>navigate('bid.working-preview.requirement.REQDEF-'+(r.mr.canonicalIds?.[0]||r.key))}>SI-REQ · ตรวจรายการ {r.sn}</button></p>)}</div>)}</details>}
   <details aria-label="C1 Appendix summary diagnostics"><summary>ผลรวมแต่ละ Appendix · ยอดที่มีราคา / รายการที่ยังขาด</summary><div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Appendix</th><th>ยอดที่มีราคา {currency}</th><th>เจ้าของราคา ครบ / ขาด</th><th>MR ขอบเขต / จำนวนยังขาด</th><th>ความครบถ้วนของยอด</th></tr></thead><tbody>{overview.map(g=><tr key={g.id}><td>{g.id}</td><td>{c1Display0550(g.knownAmount)}</td><td>{g.priced} / {g.open}</td><td>{g.openMR}</td><td>{g.complete?'ครบราคาภายในหมวด':'ยังไม่ใช่ยอดครบหมวด'}</td></tr>)}</tbody></table></div></details>
   {projection.problems.length>0&&<ul>{projection.problems.map(p=><li key={p}>{p}</li>)}</ul>}
  </details>
  <div className="p55-c1-scroll">
  <article className={'p55-c1-document'+(documentMode?' p55-c1-expanded':'')} data-native-schedule="C1">
   <div className="p55-c1-document-meta"><span>PJ2608-0550 · ASK TELECOMMUNICATION &amp; SECURITY SYSTEM</span><span>Currency: {currency}</span><span>DRAFT — NOT FOR SUBMISSION</span></div>
   <h2>SCHEDULE C1 - BREAKDOWN OF LUMP SUM INITIAL CONTRACT PRICE FOR BASE SCOPE OF SUPPY</h2>
   <table aria-label="Schedule C1 preview"><colgroup><col style={{width:'9%'}}/><col style={{width:'39%'}}/><col style={{width:'7%'}}/><col style={{width:'7%'}}/><col style={{width:'11%'}}/><col style={{width:'11%'}}/><col style={{width:'16%'}}/></colgroup>
    <thead><tr><th rowSpan={2}>SN</th><th rowSpan={2}>Item Description</th><th rowSpan={2}>Unit</th><th rowSpan={2}>Qty.</th><th colSpan={2}>CIF or FOB ({currency==='THB'?'THB':'USD or RMB'})</th><th rowSpan={2}>Notes</th></tr><tr><th>Unit Rates</th><th>Total Price</th></tr></thead>
    {projection.groups.map(g=>{
     const summary=overview.find(s=>s.id===g.id),showSummary=!documentMode;
     const heading=g.title.toUpperCase();
     return <tbody key={g.id}>
     <tr className={g.id==='OTHER'?'c1-other':'c1-app'} id={'p55-c1-app-'+g.id} style={bidOwnerStyle(g.rows[0]?.mr?.systemToken||'A')}><td colSpan={showSummary?5:7}>{button('APP:'+g.id,g.id==='OTHER'?heading:'APPENDIX '+g.id+' · '+heading)}</td>{showSummary&&<><td className="number" data-c1-summary-amount={g.id}>{c1Display0550(summary.amount)}</td><td>{summary.label}</td></>}</tr>
     {expanded('APP:'+g.id)&&g.systems.map(sys=><React.Fragment key={sys.name}>
      <tr className="c1-system">
       <td colSpan={!documentMode&&Number.isFinite(sys.knownAmount)?5:7}>{button('SYS:'+g.id+':'+sys.name,sys.name)}</td>
       {!documentMode&&Number.isFinite(sys.knownAmount)&&<><td className="number">{c1Display0550(sys.knownAmount)}</td><td>Priced items subtotal</td></>}
      </tr>
      {!documentMode&&sys.notice&&<tr className="c1-detail-note"><td colSpan={7}>{sys.notice}</td></tr>}
      {expanded('SYS:'+g.id+':'+sys.name)&&screenSites(sys.sites,documentMode||view.workingPreview&&g.id==='1.1').map(site=><React.Fragment key={site.name}>
       <tr className="c1-site">
        <td colSpan={!documentMode&&Number.isFinite(site.knownAmount)?5:7}>{button('SITE:'+g.id+':'+sys.name+':'+site.name,site.name)}</td>
        {!documentMode&&Number.isFinite(site.knownAmount)&&<><td className="number">{c1Display0550(site.knownAmount)}</td><td>Priced items subtotal</td></>}
       </tr>
       {expanded('SITE:'+g.id+':'+sys.name+':'+site.name)&&site.rows.map(r=><React.Fragment key={r.key}>
        <tr ref={r.key===location?.key?focusedRow:undefined} tabIndex={r.key===location?.key?-1:undefined}
         data-c1-mr-id={r.mr?.id} data-c1-owner-ids={r.ownerIds.join(' ')}><td>{r.sn}</td><td>{(r.components.length>0||r.intro||r.notes?.length>0||r.quotedComponents?.length>0||!documentMode&&r.pagaReference?.offers.length>0)&&button(r.key,'ส่วนประกอบ '+r.description+' / '+r.site,true)}{r.description}</td><td>{r.unit||'—'}</td><td className="number">{r.quantity??'—'}</td><td className="number">{c1Display0550(r.unitPrice)}</td><td className="number">{c1Display0550(r.amount)}</td>
         <td>{r.note}{!documentMode&&r.workingNote&&<div>{r.workingNote}</div>}{!documentMode&&(r.pendingRadioPlacement||r.provisionalRadio)&&<div>{r.pendingRadioPlacement||'ราคาตาม Offer · รอตรวจขอบเขต MR'}</div>}
          {!documentMode&&r.pagaReference&&<div>INDUSTRONIC {r.pagaReference.packageSn} · {r.pagaReference.offers.length?'Offer items '+r.pagaReference.offers.map(o=>o.supplierQuoteRow.itemCode).join(', ')+' · ตรวจจำนวนและ TAG รายไซต์':'รอตรวจรายการเทียบกับใบเสนอราคา'}</div>}
         </td>
        </tr>
        {!documentMode&&r.pagaCost&&<PagaPackageCosts0550 cost={r.pagaCost} onNavigate={onNavigate} disabled={disabled}/>}
        {!documentMode&&expanded(r.key,true)&&r.pagaReference?.offers.map(o=><tr className="c1-component c1-paga-cost" key={o.id} data-c1-quoted-offer={o.id}>
         <td>{o.supplierQuoteRow.itemCode}</td><td>{o.description}</td><td>{o.quoteEvidence.quotedUnit}</td><td className="number">{o.quoteEvidence.quotedQuantity??'—'}</td>
         <td className="number">{o.quoteEvidence.quotedCurrency} {c1Display0550(o.quoteEvidence.quotedUnitCost)}</td>
         <td className="number">{o.quoteEvidence.quotedCurrency} {c1Display0550(o.quoteEvidence.quotedTotal)}</td>
         <td>ต้นทุนและจำนวนตามใบเสนอราคา · ยอดขายอยู่ที่ {r.pagaReference.packageSn}</td>
        </tr>)}
        {!documentMode&&expanded(r.key,true)&&r.quotedComponents?.map(c=><tr className="c1-component" key={c.offer.id} data-c1-quoted-offer={c.offer.id}>
         <td>{versedLanRackOffer0550(c.offer)?c.offer.quoteRef:mgwCurrentItemKey0550(c.offer)}</td><td>{c.offer.description}</td><td>{c.unit||'—'}</td><td className="number">{c.quantity}</td>
         <td className="number">{c1Display0550(c.unitPrice)}</td><td className="number">{c1Display0550(c.amount)}</td>
         <td>{c.included?'Included by MGW':c.unit?'Included in parent total':'Included in parent total · supplier unit pending'}
          {c.quotedQuantity!==undefined&&<div>Working ตาม MR · ใบเสนอราคา {c.quotedQuantity} {c.unit}</div>}</td>
        </tr>)}
        {expanded(r.key,true)&&r.intro&&<tr className="c1-detail-note"><td/><td colSpan={6}>{r.intro}</td></tr>}
        {expanded(r.key,true)&&r.components.map((c,i)=><tr className="c1-component" key={i}><td>{r.sn+'.'+(i+1)}</td><td>{c.description}</td><td>{c.unit||'—'}</td><td className="number">{c.quantity??'—'}</td><td className="number">{c1Display0550(c.unitPrice)}</td><td className="number">{c1Display0550(c.amount)}</td><td>{[c.note,(Number.isFinite(c.unitPrice)||Number.isFinite(c.amount))&&'Included in parent total'].filter(Boolean).join(' · ')}</td></tr>)}
        {expanded(r.key,true)&&(r.notes||[]).map((note,i)=><tr className="c1-detail-note" key={'note'+i}><td/><td colSpan={6}>{note}</td></tr>)}
       </React.Fragment>)}
      </React.Fragment>)}
     </React.Fragment>)}
     {expanded('APP:'+g.id)&&<tr className="c1-subtotal"><td colSpan={5}>{g.id==='OTHER'?'OTHER BASE SUPPLY':'APPENDIX '+g.id} — SUBTOTAL</td>
      <td className="number">{c1Display0550(g.amount??g.draftSubtotal)}</td><td>{c1AppendixSubtotalLabel0550(g)}</td></tr>}
    </tbody>;})}
    <tfoot><tr><td colSpan={5}>{screenSubtotal===null?'TOTAL — BASE SCOPE OF SUPPLY':'BASE SCOPE OF SUPPLY'}</td><td className="number">{c1Display0550(projection.amount??screenSubtotal)}</td><td>{screenSubtotal!==null?'Priced items subtotal':''}</td></tr></tfoot>
   </table>
   {view.getRecord('I.C1').content&&<p>{view.getRecord('I.C1').content}</p>}
   <footer>Schedule C1 · {view.proposal.documentNo} / {view.proposal.revision}</footer>
  </article>
  </div>
 </section>;
}
