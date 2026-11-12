import React,{useMemo,useRef,useState} from 'react';
import {MgwRadioTagEvidence0550} from './MgwRadioTagEvidence0550';
import {VENDOR_PHYSICAL_TAG_FIELDS_0550,offerSourceSections0550} from './data/vendorBidTags0550';
import {amount} from './BidControls';
import {nativeSupplierItem0550,supplierBoqRows0550,supplierItemLabel0550,supplierItemSourceText0550,supplierCostProjection0550,supplierQuotedSection0550} from './data/supplierCostProjection0550';
import {isTowerSourceItem0550,towerOfferScope0550} from './data/towerTenderScope0550';
import {requirementSupplierOfferIds0550} from './data/mrSupplierLinks0550';

const columns=[['ACP(main)','2+2 · ACP'],['APF(main)','2+2 · APF'],['ACP(alternative)','2+0 · ACP'],['APF(alternative)','2+0 · APF'],['Spares','Spares']];
const configurations=[['all','เทียบทุกแบบ'],['main','Main 2+2 HSB'],['alternative','Alternative 2+0'],['Spares','Spares']];

export function SupplierBoqTable0550({rows,config='all',workingSite}){
 const visible=columns.filter(([key])=>rows.some(row=>Object.hasOwn(row.quantities,key))&&(config==='all'||key===config||key.endsWith('('+config+')')));
 const focusedColumn=workingSite&&workingSite+'(alternative)';
 const groups=new Map();
 for(const row of rows.filter(row=>visible.some(([key])=>Object.hasOwn(row.quantities,key)))){
  const group=row.workingGroup;
  const key=group?.key||'all';
  if(!groups.has(key))groups.set(key,{label:group?.label,rows:[]});
  groups.get(key).rows.push(row);
 }
 return <div className="p55-table-wrap"><table className="p55-table p55-supplier-boq" aria-label="Supplier BoQ by configuration and site">
  {workingSite&&<caption>{rows.length} รายการ BoQ ที่มี Mapping ถึงแถวนี้</caption>}
  <thead><tr><th scope="col">P/N</th><th scope="col">รายการต้นฉบับ</th>{visible.map(([key,label])=><th scope="col" key={key} data-boq-working-site={key===focusedColumn?workingSite:undefined}>{label}</th>)}
   {workingSite&&<th scope="col">สถานะ BOM · {workingSite}</th>}
   <th scope="col">หมายเหตุ / ต้นทาง</th></tr></thead>
  <tbody>{[...groups].map(([key,group])=><React.Fragment key={key}>
   {group.label&&<tr className="p55-dmr-boq-group"><th colSpan={visible.length+4}>{group.label}</th></tr>}
   {group.rows.map((row,i)=><tr key={row.locator+':'+i} data-supplier-boq-locator={row.locator}>
   <td><strong>{row.part}</strong></td><td>{row.description}</td>{visible.map(([key])=><td key={key} className="p55-boq-qty" data-boq-working-site={key===focusedColumn?workingSite:undefined}>{row.quantities[key]??'—'}</td>)}
   {workingSite&&<td>{row.workingStatus}</td>}
   <td>{row.remark&&<span>{row.remark}<br/></span>}<code>{row.locator}</code></td>
  </tr>)}</React.Fragment>)}</tbody>
 </table></div>;
}

export function SupplierQuoteBoq0550({offers}){
 const [config,setConfig]=useState('all'),[open,setOpen]=useState(false);
 const entries=new Map();
 for(const row of offers.flatMap(supplierBoqRows0550)){
  const key=JSON.stringify([row.locator,row.part,row.description,row.remark]);
  const prior=entries.get(key);
  if(prior&&Object.keys(row.quantities).some(k=>Object.hasOwn(prior.quantities,k)&&prior.quantities[k]!==row.quantities[k])){
   entries.set(key+JSON.stringify(row.quantities),row);
  }else entries.set(key,{...row,quantities:{...prior?.quantities,...row.quantities}});
 }
 const rows=[...entries.values()].sort((a,b)=>a.row-b.row);
 const sourceUrl=offers.find(offer=>offer.quoteEvidence?.sourceUrl)?.quoteEvidence.sourceUrl;
 if(!rows.length)return null;
 return <details className="p55-panel p55-quote-boq" onToggle={e=>{if(e.target===e.currentTarget)setOpen(e.currentTarget.open);}}><summary>เปรียบเทียบ BoQ ตามไซต์ / แบบที่เสนอ · {rows.length} แถว</summary>
  {open&&<>
  <div className="p55-review-toolbar">{configurations.filter(([key])=>key==='all'||rows.some(row=>Object.keys(row.quantities).some(k=>k===key||k.endsWith('('+key+')')))).map(([key,label])=>
   <button key={key} type="button" aria-pressed={config===key} onClick={()=>setConfig(key)}>{label}</button>)}</div>
  <p>— = ช่องที่ไม่มีจำนวนในหลักฐานที่บันทึก · 0 = ระบุศูนย์ · ราคาอยู่ที่แพ็กเกจตาม Offer{sourceUrl&&<> · <a href={sourceUrl} target="_blank" rel="noopener noreferrer">เปิด Workbook ต้นฉบับ</a></>}</p>
  <SupplierBoqTable0550 rows={rows} config={config}/>
  </>}
 </details>;
}

const towerBomGroups = [
  {key:'supply', title:'อุปกรณ์และวัสดุ', codes:['2','3','4','5']},
  {key:'engineering', title:'วิศวกรรม / สำรวจ / เอกสาร', codes:['1','6','7','8','15']},
  {key:'erection', title:'ประกอบและตั้งเสา', codes:['10']},
  {key:'civil', title:'งานฐานรากและพื้นที่ / จุดแบ่งงาน', codes:['9','11','12','13']},
  {key:'delivery', title:'จัดเก็บและขนส่ง', codes:['14']}
];

function SupplierBomLinks0550({entry,requirements,onNavigate}) {
  const {offer,uses,stale}=entry;
  const scope=towerOfferScope0550(offer);
  return <>
    {requirements.map(requirement => <div key={requirement.id}>
      <button type="button" onClick={() => onNavigate?.('bid.working-preview.requirement.'+requirement.id)}>
        SI Mapping · {requirement.site} · {requirement.title}
      </button>
      <small>สถานะบันทึก {requirement.status || 'DRAFT'}{requirement.state && ' · ผลตรวจ '+requirement.state}</small>
    </div>)}
    {scope && <p>
      {scope.text}
      {scope.id && <><br/><button type="button" onClick={() => onNavigate?.('bid.budget.working.line.'+scope.id)}>เปิดขอบเขต Working</button></>}
    </p>}
    {uses.map(usage => <div key={usage.line.id}>
      <button type="button" onClick={() => onNavigate?.('bid.budget.working.line.'+usage.line.id)}>
        10.2 · {usage.line.wbs} · {usage.line.description}
      </button>
      <small>{usage.label}</small>
    </div>)}
    {stale.map(usage => <small key={usage.line.id}>ฐานจัดสรรเปลี่ยน · ทบทวน {usage.line.description}</small>)}
    {!requirements.length && !scope && !uses.length && !stale.length &&
      <small>ยังไม่มี Mapping หรือการจัดสรร Working ของ Item นี้</small>}
  </>;
}

function TowerBomItem0550({entry,requirements,onNavigate,showPrices}) {
  const {offer,native}=entry;
  return <div data-tower-bom-offer={offer.id}>
    <strong>{supplierItemLabel0550(offer)}</strong>
    <p className="p55-bom-quantity">{native.quantity ?? 'ไม่ระบุจำนวน'} {native.unit}</p>
    {showPrices && <p>
      เรต {amount(native.rate,native.currency)} / {native.unit}<br/>
      ยอดต้นฉบับ {Number.isFinite(native.total) ? amount(native.total,native.currency) : native.totalText || 'OPEN'}
    </p>}
    <SupplierItemSourceText0550 offer={offer} showPrice={showPrices} requirement={requirements[0]}/>
    <small>{native.locator} · <a href={native.url} target="_blank" rel="noopener noreferrer">เปิดต้นฉบับ</a></small>
    <SupplierBomLinks0550 entry={entry} requirements={requirements} onNavigate={onNavigate}/>
  </div>;
}

// The two tower quotations and their existing SI/Working links, in one view.
export function SupplierTowerBom0550({
  data, projection, onNavigate, vendorId,
  requirements=data.integrationWorkspace?.requirements || [],
  showPrices=true, initiallyOpen=false
}) {
  const [open,setOpen] = useState(initiallyOpen);
  const [view,setView] = useState('supply');
  const index = useMemo(() => open ? projection || supplierCostProjection0550(data) : null, [data,projection,open]);
  const matchesOffer = offer => (!vendorId || offer.vendorId===vendorId) && isTowerSourceItem0550(offer);
  if (!data.offers.some(matchesOffer)) return null;
  const quotes = (index?.bySystem.get('TEL-TELT') || [])
    .filter(quote => quote.items.some(entry => matchesOffer(entry.offer)))
    .sort((a,b) => a.title.localeCompare(b.title));
  const mappings = new Map();
  for (const requirement of open ? requirements : []) {
    for (const id of requirementSupplierOfferIds0550(requirement)) {
      if (!mappings.has(id)) mappings.set(id,[]);
      mappings.get(id).push(requirement);
    }
  }
  const knownCodes = new Set(towerBomGroups.flatMap(group => group.codes));
  const otherCodes = [...new Set(quotes.flatMap(quote => quote.items
    .filter(entry => isTowerSourceItem0550(entry.offer))
    .map(entry => entry.offer.supplierQuoteRow.itemCode)))]
    .filter(code => !knownCodes.has(code));
  const groups = [...towerBomGroups, {key:'other',title:'รายการเพิ่มเติมในต้นฉบับ',codes:otherCodes}]
    .filter(group => view==='all' || (view==='supply' ? group.key==='supply' : group.key!=='supply'))
    .map(group => ({...group,codes:group.codes.filter(code => quotes.some(quote =>
      quote.items.some(entry => entry.offer.supplierQuoteRow?.itemCode===code)))}))
    .filter(group => group.codes.length);
  return <details className="p55-panel p55-quote-boq p55-tower-bom" open={open} data-supplier-tower-bom
    onToggle={event => {if (event.target===event.currentTarget) setOpen(event.currentTarget.open);}}>
    <summary>BOM Telecom Tower · เปรียบเทียบ APF / ACP และขอบเขต Working</summary>
    {open && <>
      <div className="p55-review-toolbar">
        {[['supply','อุปกรณ์และวัสดุ'],['work','งานบริการ / จุดแบ่งงาน'],['all','ทุก Item ในใบเสนอราคา']].map(([key,label]) =>
          <button type="button" key={key} aria-pressed={view===key} onClick={() => setView(key)}>{label}</button>)}
      </div>
      <p>จำนวนและหน่วยตาม Supplier · เปิดรายละเอียดเพื่อตรวจของที่รวมในรายการเหมารวม · Mapping และเจ้าของราคาอ่านจากรายการที่บันทึกในระบบ</p>
      <div className="p55-table-wrap">
        <table className="p55-table p55-supplier-boq" aria-label="Telecom Tower BOM by site">
          <thead><tr>
            <th scope="col">Item ต้นฉบับ / หมวดงาน</th>
            {quotes.map(quote => {
              const linked = requirements.filter(requirement => requirementSupplierOfferIds0550(requirement)
                .some(id => quote.allEntries.some(entry => entry.offer.id===id)));
              const labels = [...new Set(linked.filter(requirement => requirement.site)
                .map(requirement => requirement.site+' · '+requirement.title))];
              return <th scope="col" key={quote.key}>
                {labels.map(label => <span key={label}>{label}<br/></span>)}
                {quote.vendor} · {quote.title}
                <small>{quote.revision || 'Revision ไม่ระบุ'}</small>
                {showPrices && <small>
                  สุทธิต้นฉบับ {quote.totals.base.totalTHB===null ? 'OPEN' : amount(quote.totals.base.totalTHB,'THB')}
                </small>}
              </th>;
            })}
          </tr></thead>
          <tbody>{groups.map(group => <React.Fragment key={group.key}>
            <tr className="p55-bom-group"><th colSpan={quotes.length+1} scope="rowgroup">{group.title}</th></tr>
            {group.codes.map(code => <tr key={code} data-tower-bom-item={code}>
              <th scope="row">Item {code}</th>
              {quotes.map(quote => {
                const entries = quote.items.filter(entry =>
                  isTowerSourceItem0550(entry.offer) && entry.offer.supplierQuoteRow.itemCode===code);
                return <td key={quote.key}>
                  {!entries.length && <span>ไม่มี Item นี้ในใบที่โหลด</span>}
                  {entries.map(entry => <TowerBomItem0550 key={entry.offer.id} entry={entry}
                    requirements={mappings.get(entry.offer.id) || []} onNavigate={onNavigate} showPrices={showPrices}/>)}
                </td>;
              })}
            </tr>)}
          </React.Fragment>)}</tbody>
        </table>
      </div>
      <p>ราคาเหมารวมและ NET ใช้เจ้าของราคาเดิม · ตรวจฐานราก กราวด์ รั้ว และงานติดตั้งตามขอบเขตใน Working ก่อนนำไปเสนอ</p>
    </>}
  </details>;
}

const pagaBomGroups=[
  {key:'nodes',title:'ตู้ Main Node / Remote Amplifier'},
  {key:'field',title:'Access Panel / Call Station / Speakers / Beacons'},
  {key:'tools',title:'เครื่องมือและ Software'},
  {key:'licenses',title:'Activation Bundle / สิทธิ์ที่รวม'},
  {key:'services',title:'บริการ / FAT / บรรจุภัณฑ์'},
  {key:'options',title:'Options ตามใบเสนอราคา'},
  {key:'other',title:'รายการอื่นในต้นฉบับ'}
];
const isPagaBomOffer=offer=>offer.id.startsWith('OFFER-PAGA-A20261632')&&offer.supplierQuoteRow;
function pagaBomGroup0550(offer){
  if(offer.supplierQuoteRow.classification==='OPTION')return 'options';
  const code=Number(offer.supplierQuoteRow.itemCode);
  return [{key:'nodes',from:1000,to:10000},{key:'field',from:10000,to:18000},
    {key:'tools',from:18000,to:20000},{key:'licenses',from:20000,to:22000},
    {key:'services',from:22000,to:25000}].find(group=>code>=group.from&&code<group.to)?.key||'other';
}

export function SupplierPagaBom0550({
  data,projection,onNavigate,vendorId,preferredOfferId,
  requirements=data.integrationWorkspace?.requirements||[],
  showPrices=true,initiallyOpen=false
}){
  const [open,setOpen]=useState(initiallyOpen);
  const [quoteKey,setQuoteKey]=useState('');
  const [view,setView]=useState('equipment');
  const index=useMemo(()=>open?(projection||supplierCostProjection0550(data)):null,[data,projection,open]);
  const matchesOffer=offer=>(!vendorId||offer.vendorId===vendorId)&&isPagaBomOffer(offer);
  if(!data.offers.some(matchesOffer))return null;
  const quotes=(index?.bySystem.get('TEL-PAGA')||[]).filter(quote=>quote.items.some(entry=>matchesOffer(entry.offer)));
  const quote=quotes.find(candidate=>candidate.key===quoteKey)||
    quotes.find(candidate=>candidate.allEntries.some(({offer})=>offer.id===preferredOfferId))||
    quotes.find(candidate=>candidate.owners.some(u=>u.line.wbs==='A'))||quotes[0];
  const mappings=new Map();
  for(const requirement of open?requirements:[]){
    for(const id of requirementSupplierOfferIds0550(requirement)){
      if(!mappings.has(id))mappings.set(id,[]);
      mappings.get(id).push(requirement);
    }
  }
  const groups=pagaBomGroups.map(group=>({...group,entries:(quote?.items||[])
    .filter(entry=>isPagaBomOffer(entry.offer)&&pagaBomGroup0550(entry.offer)===group.key)}))
    .filter(group=>group.entries.length&&(view==='all'||(view==='equipment'
      ?!['services','options'].includes(group.key):group.key===view)));
  return <details className="p55-panel p55-quote-boq p55-paga-bom" open={open} data-supplier-paga-bom
    onToggle={event=>{if(event.target===event.currentTarget)setOpen(event.currentTarget.open);}}>
    <summary>BOM PAGA INDUSTRONIC · เลือกฉบับ / อุปกรณ์ / สิทธิ์ที่รวม / บริการ / Options</summary>
    {open&&quote&&<>
      <div className="p55-review-toolbar" aria-label="PAGA BOM quotation">
        {quotes.map(candidate=><button key={candidate.key} type="button" aria-pressed={candidate.key===quote.key}
          onClick={()=>setQuoteKey(candidate.key)}>
          {candidate.title} · {candidate.items.length} Item{candidate.hash?' · '+candidate.hash.slice(0,8):''}
        </button>)}
      </div>
      <p><strong>{quote.vendor} · {quote.title}</strong> · {quote.fileName||quote.revision||'ต้นฉบับในทะเบียน'}
        <br/>จำนวนเป็นยอดของทั้งใบ · สถานที่และ TAG ตรวจจาก SI Mapping ของแต่ละ Item
      </p>
      {showPrices&&<p>สุทธิในใบที่เปิดดู {quote.totals.base.native.map(total=>amount(total.value,total.currency)).join(' + ')||'OPEN'}
        {' · '}เทียบเงินโครงการ {quote.totals.base.totalTHB===null?'OPEN':amount(quote.totals.base.totalTHB,'THB')}
      </p>}
      <details><summary>ลิงก์ราคาใบนี้ใน Working · {quote.owners.length} เจ้าของราคา</summary>
        {quote.owners.map(usage=><p key={usage.line.id}>
          <button type="button" onClick={()=>onNavigate?.('bid.budget.working.line.'+usage.line.id)}>
            10.2 · {usage.line.wbs} · {usage.line.description}
          </button><small>{usage.label}</small>
        </p>)}
        {!quote.owners.length&&<p>ยังไม่พบเจ้าของราคา Working ที่เลือกใช้ใบนี้ · เปิด WP.5 เพื่อตรวจฐานราคาที่บันทึก</p>}
      </details>
      <div className="p55-review-toolbar">
        {[['equipment','อุปกรณ์และสิทธิ์ที่รวม'],['services','บริการ / FAT / บรรจุภัณฑ์'],['options','Options'],['all','ทุก Item ในใบนี้']].map(([key,label])=>
          <button type="button" key={key} aria-pressed={view===key} onClick={()=>setView(key)}>{label}</button>)}
      </div>
      <div className="p55-table-wrap"><table className="p55-table p55-supplier-boq" aria-label="PAGA INDUSTRONIC BOM">
        <thead><tr><th>Item / รุ่น / รายละเอียด</th><th>จำนวน Supplier ทั้งใบ</th>{showPrices&&<th>ราคาต้นฉบับ</th>}<th>SI Mapping / Working</th></tr></thead>
        <tbody>{groups.map(group=><React.Fragment key={group.key}>
          <tr className="p55-bom-group"><th scope="rowgroup" colSpan={showPrices?4:3}>{group.title}</th></tr>
          {group.entries.map(entry=>{
            const {offer,native}=entry;
            const section=supplierQuotedSection0550(data,offer);
            const mapped=mappings.get(offer.id)||[];
            const classification=offer.supplierQuoteRow.classification;
            return <tr key={offer.id} data-paga-bom-offer={offer.id}>
              <td>
                <small>Item {offer.supplierQuoteRow.itemCode}</small><strong>{supplierItemLabel0550(offer)}</strong>
                {section?.part&&<small>P/N {section.part}</small>}
                {classification==='INCLUDED_REFERENCE'&&<small>รวมในแพ็กเกจ · ไม่มีราคาแยก</small>}
                {classification==='OPTION'&&<small>OPTION ตามต้นฉบับ</small>}
                <SupplierItemSourceText0550 offer={offer} requirement={mapped[0]} showPrice={showPrices} sourceSection={section}/>
                <small>{native.locator} · <a href={native.url} target="_blank" rel="noopener noreferrer">เปิดต้นฉบับ</a></small>
                {section?.components.length>0&&<small>เปิดรายละเอียดเพื่อดู BOM ภายในชุด · {section.components.length} แถว</small>}
              </td>
              <td className="p55-bom-quantity">{native.quantity??'ไม่ระบุจำนวน'} {native.unit}</td>
              {showPrices&&<td>
                {classification==='INCLUDED_REFERENCE'?'รวมในแพ็กเกจ':<>
                  เรต {amount(native.rate,native.currency)} / {native.unit}<br/>
                  ยอด {Number.isFinite(native.total)?amount(native.total,native.currency):native.totalText||'ไม่ระบุยอดรวม'}
                </>}
              </td>}
              <td><SupplierBomLinks0550 entry={entry} requirements={mapped} onNavigate={onNavigate}/></td>
            </tr>;
          })}
        </React.Fragment>)}</tbody>
      </table></div>
      {!groups.length&&<p>ไม่มีรายการหมวดนี้ในใบที่เปิดดู</p>}
      <p>ตรวจราคาแพ็กเกจที่เจ้าของราคา Working เดิม · เลือกฉบับด้านบนเพื่อเปิดดู BOM และหลักฐานของฉบับนั้น</p>
    </>}
  </details>;
}

// A full-width disclosure shared by the existing Vendor, Mapping and Working views.
export function SupplierItemSourceText0550({offer,requirement,showPrice=true,data,sourceSection=supplierQuotedSection0550(data,offer)}){
 const dialog=useRef(null);
 const texts=supplierItemSourceText0550(offer);
 const rows=supplierBoqRows0550(offer),native=nativeSupplierItem0550(offer);
 const details=texts.filter(text=>!rows.some(row=>text===row.text));
 const sections=offerSourceSections0550(offer);
 return <div data-supplier-source-text={offer.id}>
  <button type="button" aria-haspopup="dialog" onClick={()=>dialog.current.showModal()}>ดูรายละเอียด Supplier{rows.length?' · BoQ '+rows.length+' แถว':''}</button>
  <dialog ref={dialog} className="p55-supplier-evidence" aria-label={'รายละเอียด Supplier '+(offer.supplierQuoteRow?.itemCode||offer.quoteRef||offer.id)}>
   <div className="p55-supplier-evidence-head"><strong>{offer.quoteRef||'Supplier'}{offer.supplierQuoteRow?.itemCode?' · Item '+offer.supplierQuoteRow.itemCode:''}</strong>
    <form method="dialog"><button type="submit">ปิดรายละเอียด</button></form></div>
   <h3>{supplierItemLabel0550(offer)}</h3>
   {sections.length>0&&<p>Volume I · {sections.map(tag=>'11.'+tag).join(' · ')}</p>}
   {VENDOR_PHYSICAL_TAG_FIELDS_0550.map(([field,label])=>offer.bidTags?.[field]?.length>0&&<p key={field}>{label} · {offer.bidTags[field].join(' · ')}</p>)}
   <MgwRadioTagEvidence0550 offer={offer}/>
   {requirement&&<>
    <p><strong>CUS · {requirement.site} · {requirement.title}</strong><br/>{requirement.sourceLocator}{requirement.supplierLocator&&<><br/>จุดอ้างอิง Supplier ใน Mapping · {requirement.supplierLocator}</>}</p>
    {(requirement.sourceExcerpt||requirement.criteria)&&<details><summary>ข้อความข้อกำหนดลูกค้า / เกณฑ์ตรวจ SI</summary>
     {requirement.sourceExcerpt&&<p className="p55-supplier-verbatim">{requirement.sourceExcerpt}</p>}
     {requirement.criteria&&<p className="p55-supplier-verbatim">{requirement.criteria}</p>}
    </details>}
   </>}
   {native&&<p>{native.site&&<>{native.site} · </>}{native.quantity??'—'} {native.unit||'หน่วยรอตรวจ'}
    {showPrice&&<> · เรต {amount(native.rate,native.currency)} · ยอดต้นฉบับ {Number.isFinite(native.total)?amount(native.total,native.currency):native.totalText||'—'}</>}
    <br/><code>{native.locator}</code>{native.url&&<> · <a href={native.url} target="_blank" rel="noopener noreferrer">เปิดต้นฉบับ</a></>}</p>}
   {rows.length>0&&<><p>BoQ อ้างอิง Offer นี้ · ราคาแยกต่อ P/N ไม่ปรากฏในหลักฐานที่บันทึก</p><SupplierBoqTable0550 rows={rows}/></>}
   {sourceSection?.components.length>0&&<>
    <p>ส่วนประกอบที่รวมใน Item นี้ · จำนวนต่อ 1 {native.unit} ตามข้อความ Supplier</p>
    <div className="p55-table-wrap"><table className="p55-table p55-supplier-boq" aria-label="Included component BOM">
     <thead><tr><th>อุปกรณ์ / รายละเอียดต้นฉบับ</th><th>ต่อ 1 {native.unit}</th><th>รวมตาม {native.quantity} {native.unit} ในใบนี้</th></tr></thead>
     <tbody>{sourceSection.components.map((component,i)=><tr key={i}>
      <td className="p55-supplier-verbatim">{component.description}</td>
      <td>{component.quantity??'ไม่ระบุ'}</td>
      <td>{component.quantity!==null&&Number.isFinite(native.quantity)?component.quantity*native.quantity:'—'}</td>
     </tr>)}</tbody>
    </table></div>
    <p>ส่วนประกอบใช้ราคาแพ็กเกจเดิม · จำนวนข้างต้นเป็นจำนวนในใบเสนอราคาฉบับที่เปิดดู</p>
   </>}
   {sourceSection&&<details><summary>ข้อความ Item จากต้นฉบับ · {sourceSection.locator}</summary><p className="p55-supplier-verbatim">{sourceSection.text}</p></details>}
   {details.length>0&&<details open={!rows.length}><summary>ข้อความ Supplier / เงื่อนไขที่บันทึก</summary>{details.map((text,i)=><p key={i} className="p55-supplier-verbatim">{text}</p>)}</details>}
   {!texts.length&&!sourceSection&&<p>ยังไม่มีข้อความรายละเอียดต้นฉบับของ Item นี้ในข้อมูลที่โหลด · ตรวจใบเสนอราคาต้นฉบับ</p>}
   <details data-supplier-source-ref={offer.id}><summary>ข้อความรายการเต็ม / แหล่งอ้างอิงที่บันทึก</summary><p className="p55-supplier-verbatim">{offer.description}</p>{offer.sourceRef&&<p className="p55-supplier-verbatim">{offer.sourceRef}</p>}</details>
  </dialog>
 </div>;
}
