import React,{useMemo,useRef,useState} from 'react';
import {amount} from './BidControls';
import {nativeSupplierItem0550,supplierBoqRows0550,supplierItemLabel0550,supplierItemSourceText0550,supplierCostProjection0550} from './data/supplierCostProjection0550';
import {isTowerSourceItem0550,towerOfferScope0550} from './data/towerTenderScope0550';
import {requirementSupplierOfferIds0550} from './data/mrSupplierLinks0550';

const columns=[['ACP(main)','2+2 · ACP'],['APF(main)','2+2 · APF'],['ACP(alternative)','2+0 · ACP'],['APF(alternative)','2+0 · APF'],['Spares','Spares']];
const configurations=[['all','เทียบทุกแบบ'],['main','Main 2+2 HSB'],['alternative','Alternative 2+0'],['Spares','Spares']];

function SupplierBoqTable0550({rows,config='all'}){
 const visible=columns.filter(([key])=>rows.some(row=>Object.hasOwn(row.quantities,key))&&(config==='all'||key===config||key.endsWith('('+config+')')));
 return <div className="p55-table-wrap"><table className="p55-table p55-supplier-boq" aria-label="Supplier BoQ by configuration and site">
  <thead><tr><th scope="col">P/N</th><th scope="col">รายการต้นฉบับ</th>{visible.map(([key,label])=><th scope="col" key={key}>{label}</th>)}<th scope="col">หมายเหตุ / ต้นทาง</th></tr></thead>
  <tbody>{rows.filter(row=>visible.some(([key])=>Object.hasOwn(row.quantities,key))).map((row,i)=><tr key={row.locator+':'+i} data-supplier-boq-locator={row.locator}>
   <td><strong>{row.part}</strong></td><td>{row.description}</td>{visible.map(([key])=><td key={key} className="p55-boq-qty">{row.quantities[key]??'—'}</td>)}<td>{row.remark&&<span>{row.remark}<br/></span>}<code>{row.locator}</code></td>
  </tr>)}</tbody>
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
 if(!rows.length)return null;
 const sourceUrl=offers.find(offer=>offer.quoteEvidence?.sourceUrl)?.quoteEvidence.sourceUrl;
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

function TowerBomItem0550({entry, requirements, onNavigate, showPrices}) {
  const {offer, native, uses, stale} = entry;
  const scope = towerOfferScope0550(offer);
  return <div data-tower-bom-offer={offer.id}>
    <strong>{supplierItemLabel0550(offer)}</strong>
    <p className="p55-bom-quantity">{native.quantity ?? 'ไม่ระบุจำนวน'} {native.unit}</p>
    {showPrices && <p>
      เรต {amount(native.rate,native.currency)} / {native.unit}<br/>
      ยอดต้นฉบับ {Number.isFinite(native.total) ? amount(native.total,native.currency) : native.totalText || 'OPEN'}
    </p>}
    <SupplierItemSourceText0550 offer={offer} showPrice={showPrices} requirement={requirements[0]}/>
    <small>
      {native.locator} · <a href={native.url} target="_blank" rel="noopener noreferrer">เปิดต้นฉบับ</a>
    </small>
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
  </div>;
}

// The two tower quotations and their existing SI/Working links, in one view.
export function SupplierTowerBom0550({
  data, projection, onNavigate,
  requirements=data.integrationWorkspace?.requirements || [],
  showPrices=true, initiallyOpen=false
}) {
  const [open,setOpen] = useState(initiallyOpen);
  const [view,setView] = useState('supply');
  const index = useMemo(() => open ? projection || supplierCostProjection0550(data) : null, [data,projection,open]);
  if (!data.offers.some(isTowerSourceItem0550)) return null;
  const quotes = (index?.bySystem.get('TEL-TELT') || [])
    .filter(quote => quote.items.some(entry => isTowerSourceItem0550(entry.offer)))
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

// A full-width disclosure shared by the existing Vendor, Mapping and Working views.
export function SupplierItemSourceText0550({offer,requirement,showPrice=true}){
 const dialog=useRef(null);
 const texts=supplierItemSourceText0550(offer);
 const rows=supplierBoqRows0550(offer),native=nativeSupplierItem0550(offer);
 const details=texts.filter(text=>!rows.some(row=>text===row.text));
 return <div data-supplier-source-text={offer.id}>
  <button type="button" aria-haspopup="dialog" onClick={()=>dialog.current.showModal()}>ดูรายละเอียด Supplier{rows.length?' · BoQ '+rows.length+' แถว':''}</button>
  <dialog ref={dialog} className="p55-supplier-evidence" aria-label={'รายละเอียด Supplier '+(offer.supplierQuoteRow?.itemCode||offer.quoteRef||offer.id)}>
   <div className="p55-supplier-evidence-head"><strong>{offer.quoteRef||'Supplier'}{offer.supplierQuoteRow?.itemCode?' · Item '+offer.supplierQuoteRow.itemCode:''}</strong>
    <form method="dialog"><button type="submit">ปิดรายละเอียด</button></form></div>
   <h3>{supplierItemLabel0550(offer)}</h3>
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
   {details.length>0&&<details open={!rows.length}><summary>ข้อความ Supplier / เงื่อนไขที่บันทึก</summary>{details.map((text,i)=><p key={i} className="p55-supplier-verbatim">{text}</p>)}</details>}
   {!texts.length&&<p>ยังไม่มีข้อความรายละเอียดต้นฉบับของ Item นี้ในข้อมูลที่โหลด · ตรวจใบเสนอราคาต้นฉบับ</p>}
   <details data-supplier-source-ref={offer.id}><summary>ข้อความรายการเต็ม / แหล่งอ้างอิงที่บันทึก</summary><p className="p55-supplier-verbatim">{offer.description}</p>{offer.sourceRef&&<p className="p55-supplier-verbatim">{offer.sourceRef}</p>}</details>
  </dialog>
 </div>;
}
