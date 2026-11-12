import {isPagaCommissioningKit0550} from './data/supplierRevision0550';
import React,{useState} from 'react';
import {COMMISSIONING_PHASES_0550,commissioningBreakdown0550,commissioningPhase0550,B5_STARTUP_STATUS_0550,priceB5StartupAllowance0550,validB5StartupPct0550} from './data/commissioningSparePhases0550';
import {CERAGON_R11_0550,CERAGON_R12_0550} from './data/ceragonSelection0550';
import {evaluateServiceEquation} from './serviceEquationRuntime';
import {lanStockBasis0550} from './data/lanStockBasis0550';
import {LanCusLine0550,LanCusStandards0550} from './LanCusBasis0550';
import {useBidWorkspace} from './BidWorkspaceContext';

const money=(amount,currency)=>Number.isFinite(amount)?`${currency} ${amount.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`:'OPEN';
const subtotal=(rollup,currency)=>rollup.priced?money(rollup.knownUSD,currency):'OPEN';
const workingId=id=>'bid.budget.working.line.'+id;
const offerId=id=>'bid.vendor.offer.'+id;
const b5Id='bid.budget.working.group.B5';
const ceragonReliability='https://butikk.lastmile.no/media/multicase/documents/ceragon/ip50cx_technical_description_131_rev_a01.pdf#page=244';

function Trace({id,label,disabled,onNavigate}){
 return <button type="button" title={'PJ2608-0550 / '+id} disabled={disabled} onClick={()=>onNavigate?.(id)}>{label}</button>;
}

function StockScenario({lan,dmr}){
 const [days,setDays]=useState('30'),[target,setTarget]=useState('99');
 const items=[
  ...lan,
  {name:'DMR · CERAGON IP-50CX',count:dmr,mtbf:126*365*24,source:ceragonReliability,locator:'Technical Description §8.23 · เทียบ Part No. ก่อนใช้'},
 ];
 return <details><summary>ลองประเมินสต็อกจากสินค้าจริงในโครงการ</summary>
  <p>ค่าตั้งต้น 30 วันและ 99% ใช้เปรียบเทียบ โดยสมมติว่าอุปกรณ์ทดแทนกันได้และหยิบจากคลังเดียวกันในเวลาที่ต้องใช้ ผลแสดงเฉพาะสต็อกเผื่อเสียแบบสุ่ม สต็อกบังคับหรืออะไหล่ที่ใช้ตามแผนให้ประเมินแยกใน Working</p>
  <div className="p55-bid-fields"><label>วันรอเติมสต็อก<input type="number" min="1" value={days} onChange={e=>setDays(e.target.value)}/></label><label>เป้าหมายความพอใช้ (%)<input type="number" min="0.01" max="99.999999" step="any" value={target} onChange={e=>setTarget(e.target.value)}/></label></div>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Project spare stock scenario"><thead><tr><th>สินค้า</th><th>จำนวนฐาน Working</th><th>ฐานอัตราเสีย</th><th>โอกาสพอใช้เมื่อเก็บ 0</th><th>เผื่อเสีย (ชิ้น)</th><th>โอกาสพอใช้เมื่อเก็บตามผล</th></tr></thead><tbody>
   {items.map(item=>{const result=evaluateServiceEquation('B5-SPARE-STOCK',{installed:item.count,failureRate:1/item.mtbf,exposureHours:days?Number(days)*24:null,coveragePct:target?Number(target):null,planned:0,included:0});return <tr key={item.name}><td>{item.name}</td><td>{item.count??'OPEN'}</td><td><a href={item.source} target="_blank" rel="noreferrer">{item.locator}</a> · MTBF {item.mtbf.toLocaleString('en-US')} h</td><td>{result.meanFailures===undefined?'OPEN':(100*Math.exp(-result.meanFailures)).toFixed(4)+'%'}</td><td>{result.reserve??'OPEN'}</td><td>{result.coveragePct===undefined?'OPEN':result.coveragePct.toFixed(4)+'%'}</td></tr>;})}
  </tbody></table></div>
 </details>;
}

function LanWorkingStock({basis,link,data,onNavigate}){
 const {rows,unlinked,stock}=basis;
 const quote=(offer)=>offer&&<>{offer.quoteEvidence?.quotedQuantity??'OPEN'} {offer.unit} · {Number.isFinite(offer.unitCost)?money(offer.unitCost,offer.currency)+' / '+offer.unit:offer.quoteEvidence?.quotedTotalText||'OPEN'}<br/>{link(offerId(offer.id),'07.2 · '+offer.quoteRef)}</>;
 const components=terms=>terms.length>0&&<details><summary>รายการในชุดตามใบเสนอราคา</summary><ul>{terms.map((term,i)=><li key={i}>{term}</li>)}</ul></details>;
 return <details>
  <summary>ตรวจ Working LAN ทั้งกลุ่ม · {rows.length} แถว · {stock.filter(item=>item.count!==null).length} รุ่นมีฐานคำนวณ · {unlinked.length} รายการจาก Vendor รอผูก Working</summary>
  <p>ตรวจรายการอุปกรณ์และวัสดุติดตั้งก่อนแยกความต้องการอะไหล่ของ C2 ราคาต่อชุดมาจากใบเสนอราคา จำนวนที่ใช้คำนวณมาจาก Working และจำนวนต่อชุดที่ระบุในใบเสนอราคา</p>
  <LanCusStandards0550 data={data} onNavigate={onNavigate}/>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="LAN Working spare inventory"><thead><tr><th>รายการ Working</th><th>Working Qty</th><th>Part No. / BOM</th><th>Quote Qty / เรตชุด</th><th>ฐานประเมิน</th></tr></thead><tbody>
   {rows.map(({line,offer,partNo,components:terms,selected,duplicate,installed,reliability})=><tr key={line.id}><td>{line.historicalMgwPackage?<>{line.description}<small>{line.id}</small></>:link(workingId(line.id),line.description)}</td><td>{line.quantity??'OPEN'} {line.unit}</td><td>{partNo||'Part No. OPEN'}{components(terms)}</td><td>{quote(offer)||'รอหลักฐานรายอุปกรณ์'}</td><td>{line.historicalMgwPackage?'แพ็กเกจเดิมที่ถูกแทนที่ · ไม่นับซ้ำ':!selected?'แถวอ้างอิง / อยู่นอกจำนวนที่เลือก':duplicate?'OPEN · Offer เชื่อมหลายเจ้าของราคา':installed!==null?`${installed} ชิ้น · ${reliability?'ประเมินเผื่อเสีย':'OPEN · ตรวจรุ่นและ MTBF จาก OEM'}`:line.unit==='m'?'ตรวจปริมาณวัสดุใช้ตามงาน':'OPEN · ตรวจ Part No., จำนวนและหลักฐาน OEM'}<LanCusLine0550 data={data} line={line} offer={offer} onNavigate={onNavigate}/></td></tr>)}
  </tbody></table></div>
  {unlinked.length>0&&<div className="p55-table-wrap"><table className="p55-table" aria-label="LAN vendor rows pending Working link"><thead><tr><th>รายการ Vendor</th><th>Part No. / BOM</th><th>จำนวนตามใบเสนอราคา</th><th>สถานะ</th></tr></thead><tbody>
   {unlinked.map(({offer,partNo,components:terms,reliability})=><tr key={offer.id}><td>{offer.description}</td><td>{partNo||'OPEN'}{components(terms)}</td><td>{quote(offer)}</td><td>{offer.quoteEvidence.classification==='OPTION'?'Option จาก Vendor':'รอเชื่อมจำนวนกับ Working'}{reliability&&<small><a href={reliability.source} target="_blank" rel="noreferrer">{reliability.locator}</a> · MTBF {reliability.mtbf.toLocaleString('en-US')} h</small>}</td></tr>)}
  </tbody></table></div>}
 </details>;
}

export function CommissioningSpareQuotes0550({data,model,onNavigate,disabled}){
 const active=model.lines.filter(l=>l.selected&&l.offerId&&!l.mrScopeState?.covered);
 const offers=new Map(data.offers.map(o=>[o.id,o]));
 const paga=data.offers.filter(offer=>offer.id.startsWith('OFFER-PAGA-A20261632')&&isPagaCommissioningKit0550(offer));
 const dmr=offers.get(CERAGON_R12_0550);
 const dmrBase=active.find(l=>l.wbs==='A'&&l.offerId===CERAGON_R11_0550);
 const lan=lanStockBasis0550(data,model);
 const apfDistribution=lan.rows.find(row=>row.offer?.id==='OFFER-MGW-Q26-063-LAN-PBX-FO-LAN-APF-9-04'&&
  row.components.some(item=>item.split('|').map(value=>value.trim())[1]==='PWR-C1-715WAC'));
 const link=(id,label)=>id&&<Trace id={id} label={label} disabled={disabled} onNavigate={onNavigate}/>;
 const reference=(offer,owner)=> <>{link(offerId(offer.id),'07.2 · '+offer.quoteRef)}{owner&&link(workingId(owner.id),'Working · '+owner.id)}</>;
 return <section className="p55-panel" aria-label="C2 supplier evidence">
  <h4>ราคาและขอบเขตที่พบใน 07 Vendor</h4>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>ระบบ</th><th>หลักฐานราคา</th><th>การใช้ใน C2</th><th>ต้นทาง</th></tr></thead><tbody>
   {paga.length?paga.map(offer=>{const owner=active.find(l=>l.offerId===offer.supplierQuoteRow?.parentOfferId&&l.wbs==='A');return <tr key={offer.id}><td>PAGA · INDUSTRONIC</td><td>{offer.supplierQuoteRow.itemCode} · {offer.description} · {offer.quoteEvidence?.quotedQuantity} {offer.unit} × {money(offer.unitCost,offer.currency)}</td><td>Commissioning kit · รวมในราคา Net ของใบนี้ · {owner?'ชุดนี้ 1 − 1 = 0 ชุดที่ต้องซื้อเพิ่ม':'รอตรวจการเลือกแพ็กเกจใน Working'} · รายการ Commissioning Spares อื่นยัง OPEN</td><td>{reference(offer,owner)}</td></tr>;}):<tr><td>PAGA · INDUSTRONIC</td><td>รอข้อมูล Commissioning kit จากทะเบียนใบเสนอราคา</td><td>OPEN</td><td>{link('bid.vendor.offers','07.2 · Vendor')}</td></tr>}
   <tr><td>DMR · CERAGON</td><td>{dmrBase&&<div>R11 Working · ติดตั้ง 2 ODU (APF 1 / ACP 1)</div>}{dmr?<>R12 · 2 × Main ODU · {money(dmr.unitCost,dmr.currency)} / {dmr.unit}</>:'รอใบเสนอราคา CERAGON RevA1 ใน 07.2'}</td><td>R12 อยู่ 11.C4 Capital Spares · จำนวน C2 และความพอใช้ของสต็อกรอฐาน OEM</td><td>{dmr&&reference(dmr,active.find(l=>l.offerId===dmr.id&&l.wbs==='C2'))}{link('bid.budget.working.group.TEL-DMR','Working DMR')}</td></tr>
   <tr><td>LAN</td><td>ตรวจอุปกรณ์และวัสดุ {lan.rows.length} แถวจาก Working ด้านล่าง</td><td>ประเมินรายรุ่นเมื่อมีฐานปริมาณและ MTBF</td><td>{link('bid.budget.working.group.TEL-LAN','Working LAN')}</td></tr>
   {apfDistribution&&<tr><td>LAN · APF Distribution Switch</td><td>Q26-063 LAN/PBX/FO · <code>PWR-C1-715WAC</code> เป็น PSU ในชุด C9300 ที่เสนอ</td><td>จำนวนและราคาอะไหล่ C2 ยัง OPEN · ใบ Q26-063 v1.0 เดิมเคยระบุ spare <code>PWR-C1-715WAC-P</code> กับ C9300L คนละรุ่นกับชุดปัจจุบัน</td><td>{reference(apfDistribution.offer,apfDistribution.line)}</td></tr>}
  </tbody></table></div>
  <LanWorkingStock basis={lan} link={link} data={data} onNavigate={onNavigate}/>
  <StockScenario lan={lan.stock} dmr={dmrBase?2:null}/>
 </section>;
}

export function B5StartupAmount0550({allowance,currency='USD'}){
 if(!allowance)return null;
 const total=currency==='THB'?allowance.totalTHB:allowance.totalUSD;
 return <p><strong>วงเงิน B5 / C2 จาก E08 · {money(total,currency)}</strong>
  <small>{B5_STARTUP_STATUS_0550} · ประมาณการจากต้นทุนอุปกรณ์ที่มีฐานราคา</small></p>;
}

export function B5StartupEstimate0550({allowance,currency='USD',disabled,onNavigate}){
 const {busy,change}=useBidWorkspace()||{};
 const [edited,setEdited]=useState(null);
 if(!allowance)return null;
 const value=edited??String(Number((allowance.pct*100).toPrecision(14)));
 const pct=value.trim()?Number(value)/100:null,valid=validB5StartupPct0550(pct);
 const shown=edited===null?allowance:valid?priceB5StartupAllowance0550(allowance,pct):null;
 const save=async e=>{
  e.preventDefault();
  if(valid&&await change(data=>({...data,b5StartupPct:pct}),'Update B5 provisional PCT_START'))setEdited(null);
 };
 return <section className="p55-panel" aria-label="B5 E08 provisional allowance">
  <h4>B5 / C2 · วงเงินอะไหล่เริ่มเดินระบบ</h4>
  <form className="p55-review-toolbar" onSubmit={save}>
   <label>PCT_START (%) <input type="number" min="0" max="100" step="any" required value={value}
    onChange={e=>setEdited(e.target.value)} disabled={disabled||busy||!change}/></label>
   <button type="submit" disabled={disabled||busy||!change||!valid||edited===null}>บันทึก PCT_START</button>
  </form>
  <div aria-live="polite">{shown?<B5StartupAmount0550 allowance={shown} currency={currency}/>:<p>ระบุ PCT_START ระหว่าง 0 ถึง 100%</p>}</div>
  <p>Grok Rev00 E08 · LUMP_B5 (USD 0) + Σ (IN × Price_old × PCT_START) · ใช้ต้นทุน Working A แทน Price_old ที่ยังไม่ได้กรอกใน Rev00</p>
  <p>วงเงินนี้ใช้วางงบก่อนยืนยัน Part No., จำนวน, ราคา และรายการที่ OEM รวมไว้ ยอด 11.C2 / A1 ใช้เจ้าของราคาที่จัดลง 11.M</p>
  {shown&&<details><summary>ดูฐานต้นทุนและจำนวนอะไหล่ประมาณการ</summary>
   <div className="p55-table-wrap"><table className="p55-table" aria-label="B5 estimate by A1 item"><thead>
    <tr><th>รายการ A1</th><th>IN</th><th>Working A USD</th><th>วงเงิน B5 USD</th></tr>
   </thead><tbody>{shown.rows.map(row=><tr key={row.code}><th scope="row">{row.code} · {row.description}</th><td>{row.included?1:0}</td>
    <td>{money(row.basisUSD,'USD')}{row.open>0&&<small>{row.open} เจ้าของราคา OPEN</small>}
     {onNavigate&&row.ownerIds.length>0&&<details><summary>{row.ownerIds.length} เจ้าของต้นทุน Working A</summary>
      {row.ownerIds.map(id=><Trace key={id} id={workingId(id)} label={id} disabled={disabled} onNavigate={onNavigate}/>)}
     </details>}</td><td>{money(row.amountUSD,'USD')}</td></tr>)}</tbody></table></div>
   <p>A1-11 ใช้ต้นทุน Microwave ตามขอบเขต Rev00 แยกจากงาน Telecom Tower</p>
   <div className="p55-table-wrap"><table className="p55-table" aria-label="Provisional startup spare quantities"><thead>
    <tr><th>Driver จาก D_QTY</th><th>จำนวนติดตั้ง</th><th>จำนวนอะไหล่ประมาณการ</th></tr>
   </thead><tbody>{shown.drivers.map(driver=><tr key={driver.id}><th scope="row">{driver.id} · {driver.source}</th>
    <td>{driver.installed} {driver.unit}</td><td>{driver.quantity} {driver.unit}</td></tr>)}</tbody></table></div>
   <p>จำนวนประมาณการ = ROUND(จำนวนติดตั้ง × PCT_START, 0) · ใช้สำหรับวางงบและตรวจจำนวนกับ OEM</p>
  </details>}
 </section>;
}

export function CommissioningBreakdown0550({view,systems,currency,summary,onNavigate,onAllocate,disabled,onOpenC3,model}){
 const {groups,bySystem,unclassified,total,operations,operationRows}=commissioningBreakdown0550(view,systems,currency);
 const working=new Map(model.lines.map(line=>[line.id,line]));
 const b5Lines=model.lines.filter(line=>line.wbs==='B5'&&!line.mrScopeState?.covered&&!line.mrScopeState?.excluded&&!line.satelliteScopeState?.excluded&&!line.bidPriceAllocation);
 const link=(id,label)=> <Trace id={id} label={label} disabled={disabled} onNavigate={onNavigate}/>;
 const totalText=rollup=>subtotal(rollup,currency);
 return <section className="p55-panel" aria-label={summary?'A1 commissioning spare breakdown':'C2 Working phase breakdown'}>
  <h4>{summary?'5.1–5.3 · รายละเอียด Commissioning Spares สำหรับ A1':'11.C2 · สมการและรายการ Working แยกตามระบบ'}</h4>
  {summary?<B5StartupAmount0550 allowance={model.b5StartupAllowance} currency={currency}/>:
   <B5StartupEstimate0550 allowance={model.b5StartupAllowance} currency={currency} disabled={disabled} onNavigate={onNavigate}/>}
  <p>อ้างอิงแบบต้นฉบับ · A1 S/N 4 รับยอด C2 เป็น Base 1 Lot · S/N 5 อ้างอิง C3 อะไหล่เดินเครื่อง 2 ปีใน A2 Option</p>
  {summary?<>
   <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>เลขย่อย Breakdown</th><th>ช่วงงาน</th><th>ราคาขายที่มี</th><th>แถว Working</th></tr></thead><tbody>
    {groups.map(group=><tr key={group.id}><td>{group.number}</td><td>{group.title}</td><td>{totalText(group)}</td><td>{group.priced}/{group.count} มีราคา · {group.open} OPEN</td></tr>)}
    {unclassified.count>0&&<tr><td>OPEN</td><td>Working รอระบุช่วงงาน</td><td>{totalText(unclassified)}</td><td>{unclassified.count} แถว</td></tr>}
    <tr><th colSpan="2">ยอด C2 ที่มีราคา → A1 S/N 4</th><td>{totalText(total)}</td><td>{total.priced}/{total.count} มีราคา · {total.open} OPEN</td></tr>
   </tbody></table></div>
   <p>A1 S/N 5 · C3 Option · {operations.count} เจ้าของราคา · {totalText(operations)} <button type="button" disabled={disabled} onClick={onOpenC3}>เปิด 11.C3</button></p>
   {operationRows.length>0&&<ul>{operationRows.map(row=><li key={row.lineId}>{link(workingId(row.lineId),row.line.description)} · {money(row.amount,currency)}{row.line.spareBudget&&' · วงเงินร่าง รอรายการ OEM'}</li>)}</ul>}
  </>:<>
   <p>Draft reference ในฟอร์มด้านบนใช้ตรวจต้นทุนและขอบเขตจาก 07 Vendor / 10.2 Working · ตารางด้านล่างแสดงรายการที่จัดลง C2 และยอดขายของรายการเหล่านั้น</p>
   <p><strong>B5-C2-OEM-QTY · หลักจาก Exhibit C2 Notes 1–3 / MR Appendix 10 / STD TEL-001 §7.7.1</strong> · แยกตาม Main Equipment No. และ Part No. ถึง PAC · ใช้จำนวนตรงตาม CUS/OEM หรือใช้ฐาน B หรือ A × B เมื่อเอกสารกำหนดอัตราส่วนต่อกลุ่ม</p>
   <p>แบบอัตราส่วน · เลือก CEIL เพื่อนับเศษเป็นหนึ่งกลุ่ม หรือ FLOOR เพื่อนับเฉพาะกลุ่มเต็มตามเอกสาร CUS/OEM จากนั้นคูณอะไหล่ต่อกลุ่มและหักจำนวนที่ยืนยันว่ารวมไว้สำหรับ Part No. และงานเดียวกัน โดยมีค่าต่ำสุดเป็น 0</p>
   <p><strong>B5-SPARE-QTY</strong> · ใช้แตกจำนวนตามขั้นตอน OEM หรือ ITP เมื่อมีจำนวนรอบ/ทีมและจำนวนใช้ต่อรอบ · ตรวจยอดกับรายการ OEM ก่อนตั้งราคา</p>
   <p><strong>B5-SPARE-STOCK</strong> · แบบทดลองประเมินความพอใช้ของสต็อกเผื่อเสีย · ค่าเฉลี่ยการเสีย = จำนวนติดตั้ง × อัตราเสียต่อชั่วโมง × ชั่วโมงที่เติมไม่ได้ · จำนวนตาม CUS และ OEM เป็นฐาน C2</p>
   <p>Working คำนวณราคาขายด้วย E10 / E11 / E12 ตามวิธีขาย ตามด้วย E13 และ E17 ตาม FX ของโครงการ</p>
   <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>ช่วงงาน</th><th>ฐานจำนวนและสมการต้นทุนต่อระบบ</th><th>ยอดขายที่มี</th></tr></thead><tbody>{groups.map(group=><tr key={group.id}><td>{group.number} · {group.title}</td><td>{group.driver} · Σ (จำนวนจัดหาเพิ่ม × เรตต่อหน่วยของ Part No.)</td><td>{totalText(group)}</td></tr>)}</tbody></table></div>
   <p>ยอดขายที่มีของ C2 · {totalText(total)} · {total.priced}/{total.count} แถวมีราคา {unclassified.count>0&&<>· {unclassified.count} แถวรอระบุช่วงงาน</>}</p>
   <div className="p55-review-toolbar">{link(b5Id,'Working B5 · เจ้าของราคา')}{link('bid.working-preview.step.5','WP.5 · ปริมาณ')}{link('bid.working-preview.step.7','WP.7 · Supplier mapping')}{link('bid.engineering.equations','สมการ GENESIS')}{link('bid.quotation.mapping','11.M · จัดลง Schedule')}</div>
   <div className="p55-table-wrap"><table className="p55-table" aria-label="C2 coverage by system"><thead><tr><th>ระบบ</th>{COMMISSIONING_PHASES_0550.map(phase=><th key={phase.id}>{phase.number} · {phase.title}</th>)}<th>รายการรอระบุช่วงงาน</th></tr></thead><tbody>
    {bySystem.map(system=>{
     const candidates=b5Lines.filter(line=>line.systemToken===system.token);
     const pending=candidates.filter(line=>line.selected&&!system.rows.some(row=>row.lineId===line.id));
     return <tr key={system.token}><th scope="row">{system.name} <small>{system.token}</small>
      {!system.rows.length&&<small>{!candidates.length?'OPEN · ยังไม่มีรายการ Working B5':pending.length?'OPEN · มี Working B5 รอตรวจการจัดลง C2':'OPEN · ยังไม่ได้เลือกรายการ Working B5'}</small>}
      {!system.rows.length&&<button type="button" disabled={disabled} onClick={()=>onNavigate?.(b5Id,{workingSystem:system.token})}>เปิด Working B5</button>}
      {pending.length>0&&<details><summary>ตรวจ 11.M · {pending.length} รายการ</summary><ul>{pending.map(line=><li key={line.id}><button type="button" disabled={disabled} onClick={()=>onAllocate?.(line.id)}>{line.description}</button></li>)}</ul></details>}
     </th>{[...COMMISSIONING_PHASES_0550.map(p=>p.id),''].map(phase=>{const rows=system.rows.filter(row=>commissioningPhase0550(row.line)===phase);return <td key={phase}>{rows.length?rows.map(row=>{const line=working.get(row.lineId),rate=line?.costRate;return <div key={row.lineId}>
      {link(workingId(row.lineId),row.line.description)}
      <small>{row.partNo||'Part No. OPEN'} · Qty {row.quantity??'OPEN'} {row.unit}</small>
      <small>Unit Cost {money(rate,line?.currency)} · Total Cost {money(line?.provisionalCostNative,line?.currency)}</small>
      <small>ราคาขายลูกค้า {money(row.amount,currency)}</small>
      {line?.result?.installedPopulation!==undefined&&<small>Interchangeability A × B · ติดตั้ง {line.result.installedPopulation} ชิ้น</small>}
      {line?.result?.requiredQuantity!==undefined&&<small>อัตราส่วน OEM · ฐาน {line.calculation?.inputs.populationBasis==='MAIN_EQUIPMENT'?'B':'A × B'} · {line.calculation?.inputs.roundingMode||'CEIL (รายการเดิม)'} · ต้องมี {line.result.requiredQuantity} ชิ้นก่อนหักจำนวนที่รวมไว้{line.calculation?.inputs.roundingSourceRef&&' · '+line.calculation.inputs.roundingSourceRef}</small>}
      {line?.result?.reserve!==undefined&&<small>เผื่อเสีย {line.result.reserve} · โอกาสพอใช้ {line.result.coveragePct.toFixed(4)}%</small>}
      {line?.calculationId&&link('bid.engineering.calculation.'+line.calculationId,'เปิดสมการปริมาณ')}{line?.offerId&&link(offerId(line.offerId),'เปิดใบเสนอราคา')}
     </div>;}):phase?'OPEN · ตรวจขอบเขต OEM':'—'}</td>;})}</tr>;
    })}
   </tbody></table></div>
  </>}
 </section>;
}
