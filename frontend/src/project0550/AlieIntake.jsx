import React,{useMemo,useState} from 'react';
import {downloadBidFile,useBidWorkspace} from './BidWorkspaceContext';
import {COMMERCIAL_POLICY,SYSTEMS} from './data';
import {ALIE_CLASSES_0550,atomicSections0550} from './data/atomicLines0550';
import {planVendorRegister0550} from './data/vendorRegister0550';
import {offerSourceSections0550} from './data/vendorBidTags0550';
import {
 alieWorkingDraft0550,alieQuoteGroups0550,alieRegisterFromJson0550,defaultAlieRoute0550,exportAlieRows0550,
 parsedAlieRegister0550,parsedAlieSystem0550,preparedAlieRegister0550,registeredAlieRows0550,
} from './data/alieIntake0550';
import {
 ALIE_DRIVE_FOLDER_0550,alieFolderId0550,authorizeAlieDrive0550,downloadAliePdf0550,driveFolderMime0550,
 extractAliePdf0550,fingerprintAliePdf0550,listAlieDrive0550,loadAlieDrive0550,
} from './data/alieDrive0550';

const systems=[...SYSTEMS.map(system=>system.token),'COMMON'];
const volumes=['A1','A2','C1','C2','C3','C4','C5','C6','C7','E','F'];

function DriveQuotes({busy,inspectPdf}){
 const [folder,setFolder]=useState(ALIE_DRIVE_FOLDER_0550);
 const [sdkReady,setSdkReady]=useState(false);
 const [token,setToken]=useState('');
 const [paths,setPaths]=useState([]);
 const [files,setFiles]=useState([]);
 const [pending,setPending]=useState(false);
 const [error,setError]=useState('');
 const run=async action=>{
  setPending(true);
  setError('');
  try{await action();}catch(e){setError(e.message);}finally{setPending(false);}
 };
 const open=async(accessToken,path)=>{
  const items=await listAlieDrive0550(accessToken,path.at(-1).id);
  setPaths(path);
  setFiles(items);
 };
 const connect=async()=>{
  const id=alieFolderId0550(folder);
  if(!id)throw Error('Enter the project quotation folder URL or ID.');
  const accessToken=await authorizeAlieDrive0550();
  await open(accessToken,[{id,name:'Quotation folder'}]);
  setToken(accessToken);
 };
 const disabled=busy||pending;
 return <div className="p55-stack">
  <div className="p55-review-toolbar">
   <label>Google Drive folder <input value={folder} onChange={event=>setFolder(event.target.value)} disabled={disabled}/></label>
   {sdkReady?<button type="button" disabled={disabled} onClick={()=>run(connect)}>Connect Google Drive</button>:
    <button type="button" disabled={disabled} onClick={()=>run(async()=>{await loadAlieDrive0550();setSdkReady(true);})}>Enable Drive connection</button>}
  </div>
  {error&&<p role="alert">{error}</p>}
  {pending&&<p role="status">กำลังอ่าน Google Drive…</p>}
  {paths.length>0&&<div>
   <div className="p55-review-toolbar">{paths.map((item,index)=><button key={item.id} type="button" disabled={disabled||index===paths.length-1}
    onClick={()=>run(()=>open(token,paths.slice(0,index+1)))}>{item.name}</button>)}</div>
   <ul>{files.map(file=><li key={file.id}>{file.mimeType===driveFolderMime0550?
    <button type="button" disabled={disabled} onClick={()=>run(()=>open(token,[...paths,file]))}>{file.name} /</button>:
    file.mimeType==='application/pdf'?<button type="button" disabled={disabled} onClick={()=>run(()=>inspectPdf(
     ()=>downloadAliePdf0550(token,file),file.name,'https://drive.google.com/file/d/'+file.id+'/view'))}>{file.name}</button>:
     <span>{file.name} · PDF intake unavailable</span>}</li>)}</ul>
   {!files.length&&<p>โฟลเดอร์นี้ว่าง</p>}
  </div>}
 </div>;
}

function SourceRouting({rowKey,tokens,selection,onChange,disabled}){
 return <>
  <td><select aria-label={'System / '+rowKey} disabled={disabled} value={selection.system} onChange={e=>onChange({...selection,system:e.target.value})}>
   <option value="">OPEN</option>{tokens.map(token=><option key={token}>{token}</option>)}
  </select></td>
  <td><select aria-label={'LINE_CLASS / '+rowKey} disabled={disabled} value={selection.lineClass} onChange={e=>onChange({...selection,lineClass:e.target.value})}>
   <option value="">OPEN</option>{ALIE_CLASSES_0550.map(value=><option key={value}>{value}</option>)}
  </select></td>
 </>;
}

function RegisteredQuote({quote,disabled,onPrepare,onNavigate}){
 const [selected,setSelected]=useState({});
 const candidates=quote.offers.filter(offer=>!offer.atomicLines&&!offer.mgwQuoteLineId&&offer.supplierQuoteRow?.classification!=='NET_PACKAGE');
 const candidateIds=new Set(candidates.map(offer=>offer.id));
 const rowDefaults=offer=>({system:offer.quoteEvidence.systemTokens.length===1?offer.quoteEvidence.systemTokens[0]:'',lineClass:defaultAlieRoute0550(offer)});
 const selectedRows=candidates.filter(offer=>selected[offer.id]?.checked);
 const selectAll=checked=>setSelected(previous=>Object.fromEntries(candidates.map(offer=>[
  offer.id,{...rowDefaults(offer),...previous[offer.id],checked},
 ])));
 return <>
  <p><a href={quote.url} target="_blank" rel="noreferrer">{quote.name}</a> · {quote.offers.length} registered Offers · {quote.offers.reduce((count,offer)=>count+(offer.atomicLines?.length||0),0)} ALIE lines</p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Registered quotation source rows"><thead><tr>
   <th scope="col">{candidates.length>0&&<input type="checkbox" aria-label="Select all eligible source rows" disabled={disabled}
    checked={selectedRows.length===candidates.length} onChange={e=>selectAll(e.target.checked)}/>}</th>
   <th scope="col">Offer / Source locator</th><th scope="col">Native qty / rate</th><th scope="col">System</th><th scope="col">LINE_CLASS</th>
  </tr></thead><tbody>{quote.offers.map(offer=>{
   const e=offer.quoteEvidence,atom=offer.atomicLines?.[0],editable=candidateIds.has(offer.id);
   const selection={...rowDefaults(offer),...selected[offer.id]};
   const update=next=>setSelected(previous=>({...previous,[offer.id]:next}));
   return <tr key={offer.id}>
    <td>{editable&&<input type="checkbox" aria-label={'Add '+offer.id} checked={Boolean(selection.checked)} disabled={disabled}
     onChange={event=>update({...selection,checked:event.target.checked})}/>}</td>
    <td><button type="button" disabled={!onNavigate} onClick={()=>onNavigate?.('bid.vendor.offer.'+offer.id)}>{offer.quoteRef} · {offer.description}</button>
     <small>{e.locator}</small>{atom&&<small>{atom.line_id} · {atom.anchor.tag}</small>}</td>
    <td>{e.quotedQuantity??'OPEN'} {e.quotedUnit} · {e.quotedUnitCost??'OPEN'} {e.quotedCurrency}</td>
    {editable?<SourceRouting rowKey={offer.id} tokens={e.systemTokens} selection={selection} onChange={update} disabled={disabled}/>:
     <><td>{atom?.anchor.system||e.systemTokens.join(' / ')}</td><td>{atom?.route.line_class||(offer.supplierQuoteRow?.classification==='NET_PACKAGE'?'Quote summary':'OPEN')}</td></>}
   </tr>;
  })}</tbody></table></div>
  <button type="button" disabled={disabled||!selectedRows.length} onClick={()=>onPrepare(selectedRows.map(offer=>({offerId:offer.id,...selected[offer.id]})))}>
   Review selected source rows ({selectedRows.length})
  </button>
 </>;
}

function ParsedQuote({pdf,vendors,disabled,onPrepare}){
 const [vendor,setVendor]=useState('');
 const [sourceLink,setSourceLink]=useState(pdf.url);
 const [selections,setSelections]=useState({});
 const {quote}=pdf;
 const defaults=row=>({system:parsedAlieSystem0550(row.section),lineClass:''});
 return <>
  <p>{quote.quoteRef} · {quote.date} · {quote.rows.length} extracted rows · {quote.currency} {quote.subtotal} reconciled to the printed subtotal</p>
  <div className="p55-review-toolbar">
   <label>Vendor <select value={vendor} onChange={e=>setVendor(e.target.value)} disabled={disabled}><option value="">Select vendor</option>
    {vendors.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}
   </select></label>
   <label>Original Drive file <input type="url" value={sourceLink} onChange={e=>setSourceLink(e.target.value)} disabled={disabled}/></label>
  </div>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Parsed quotation rows"><thead><tr>
   <th scope="col">Source</th><th scope="col">Qty</th><th scope="col">Rate</th><th scope="col">Amount</th><th scope="col">System</th><th scope="col">LINE_CLASS</th>
  </tr></thead><tbody>{quote.rows.map(row=><tr key={row.item}>
   <td>{row.description}<small>PDF p{row.page} · {row.printedItem?'Item '+row.printedItem:'Unnumbered row'} · {row.section}</small>
    {row.details.length>0&&<details><summary>Source details</summary><ul>{row.details.map((detail,index)=><li key={index}>{detail}</li>)}</ul></details>}</td>
   <td>{row.qty} {row.unit}</td><td>{row.unitCost}</td><td>{row.amount}</td>
   <SourceRouting rowKey={row.item} tokens={systems} selection={selections[row.item]||defaults(row)} disabled={disabled}
    onChange={value=>setSelections(previous=>({...previous,[row.item]:value}))}/>
  </tr>)}</tbody></table></div>
  <button type="button" disabled={disabled||!vendor||!sourceLink.trim()} onClick={()=>onPrepare(
   Object.fromEntries(quote.rows.map(row=>[row.item,selections[row.item]||defaults(row)])),vendor,sourceLink)}>Review parsed Vendor register</button>
 </>;
}

export default function AlieIntake({onNavigate}){
 const {data,change,busy,error:saveError,reviewDate}=useBidWorkspace();
 const [pdf,setPdf]=useState(null);
 const [quoteKey,setQuoteKey]=useState('');
 const [pack,setPack]=useState(null);
 const [task,setTask]=useState('');
 const [error,setError]=useState('');
 const [message,setMessage]=useState('');
 const quotes=useMemo(()=>alieQuoteGroups0550(data.offers),[data.offers]);
 const quote=quotes.find(item=>item.key===quoteKey);
 const inspectPdf=async(source,name,url='')=>{
  setTask('กำลังตรวจ PDF…');
  setPdf(null);setPack(null);setQuoteKey('');setError('');setMessage('');
  try{
   const blob=typeof source==='function'?await source():source;
   const sha256=await fingerprintAliePdf0550(blob);
   if(quotes.some(item=>item.key===sha256)){
    setQuoteKey(sha256);
    setMessage('PDF ตรงกับทะเบียน Vendor ตาม SHA-256');
   }else{
    const extracted=await extractAliePdf0550(blob,sha256);
    setPdf({...extracted,name,url});
   }
  }catch(e){setError(e.message);}finally{setTask('');}
 };
 const prepare=build=>{
  setPack(null);setError('');setMessage('');
  try{
   const next=build();
   if(!next||!planVendorRegister0550(data,next,systems).changed){
    setMessage('ชุดข้อมูลนี้มีอยู่ใน 07.2 แล้ว');
    return;
   }
   setPack(next);
  }catch(e){setError(e.message);}
 };
 const readJson=async file=>{
  setTask('กำลังตรวจ JSON…');
  try{
   if(file.size>4*1024*1024)throw Error('Vendor register JSON limit is 4 MiB.');
   const value=JSON.parse(await file.text());
   prepare(()=>alieRegisterFromJson0550(data,value,reviewDate));
  }catch(e){setPack(null);setError(e.message);}finally{setTask('');}
 };
 const apply=async()=>{
  const next=pack;
  const saved=await change(current=>planVendorRegister0550(current,next,systems).workspace,'Register ALIE R2 source Offers / '+next.batchId);
  if(saved){setPack(null);setMessage('บันทึกหลักฐาน ALIE ใน 07.2 แล้ว · เปิด 10.2 เพื่อตรวจ Working trace');}
  else setError('บันทึกไม่สำเร็จ · '+(saveError||'ตรวจข้อความแจ้งเตือนของ GENESIS แล้วลองอีกครั้ง'));
 };
 const disabled=busy||Boolean(task);
 return <div className="p55-stack">
  <DriveQuotes busy={disabled} inspectPdf={inspectPdf}/>
  <div className="p55-review-toolbar">
   <label>Open PDF <input type="file" accept=".pdf,application/pdf" disabled={disabled} onChange={e=>{
    const file=e.target.files[0];e.target.value='';if(file)inspectPdf(file,file.name);
   }}/></label>
   <label>Open Vendor / ALIE JSON <input type="file" accept=".json,application/json" disabled={disabled} onChange={e=>{
    const file=e.target.files[0];e.target.value='';if(file)readJson(file);
   }}/></label>
  </div>
  <label>Registered quotation <select value={quoteKey} disabled={disabled} onChange={e=>{
   setQuoteKey(e.target.value);setPdf(null);setPack(null);setMessage('');setError('');
  }}><option value="">Select source</option>{quotes.map(item=><option key={item.key} value={item.key}>{item.name} · {item.key.slice(0,8)}</option>)}</select></label>
  {task&&<p role="status">{task}</p>}
  {message&&<p role="status">{message}</p>}
  {error&&<p role="alert">{error}</p>}
  {quote&&<RegisteredQuote key={quote.key} quote={quote} disabled={disabled||Boolean(pack)} onNavigate={onNavigate}
   onPrepare={rows=>prepare(()=>preparedAlieRegister0550(data,rows,reviewDate))}/>}
  {pdf?.quote&&<ParsedQuote key={pdf.sha256} pdf={pdf} vendors={data.vendors} disabled={disabled||Boolean(pack)}
   onPrepare={(rows,vendorId,url)=>prepare(()=>parsedAlieRegister0550(data,pdf,rows,vendorId,url,reviewDate))}/>}
  {pdf&&!pdf.quote&&<p role="status">{pdf.name} · {pdf.state==='OCR_REQUIRED'?'OPEN · PDF ต้องทำ OCR':'OPEN · ตารางใบเสนอราคายังอ่านและกระทบยอดอัตโนมัติไม่ได้'} · SHA-256 {pdf.sha256}</p>}
  {pack&&<section aria-label="Vendor register preview">
   <h3>Review before registration</h3>
   <p>{pack.vendors.map(vendor=>vendor.name).join(' / ')} · {pack.offers.length} Offers · {pack.offers.reduce((count,offer)=>count+(offer.atomicLines?.length||0),0)} ALIE lines</p>
   <div className="p55-table-wrap"><table className="p55-table" aria-label="ALIE registration preview">
    <thead><tr><th scope="col">Offer</th><th scope="col">TAG / Class</th><th scope="col">Source</th></tr></thead>
    <tbody>{pack.offers.map(offer=><tr key={offer.id}><td>{offer.quoteRef} · {offer.description}</td>
     <td>{offer.atomicLines?.map(atom=><small key={atom.line_id}>{atom.anchor.tag} · {atom.route.line_class}</small>)}</td>
     <td>{offer.quoteEvidence.locator}</td></tr>)}</tbody>
   </table></div>
   <div className="p55-review-toolbar">
    <button type="button" disabled={disabled} onClick={apply}>Register in 07.2 Vendor</button>
    <button type="button" onClick={()=>downloadBidFile(pack,'PJ2608-0550_ALIE_Vendor_Register.json')}>Export Vendor register JSON</button>
    <button type="button" disabled={disabled} onClick={()=>setPack(null)}>Cancel</button>
   </div>
  </section>}
 </div>;
}

export function AlieWorking0550({data,reviewDate,onNavigate,onEdit,onDraft}){
 const rows=useMemo(()=>registeredAlieRows0550(data),[data]);
 const [system,setSystem]=useState('');
 const [volume,setVolume]=useState('');
 const [selected,setSelected]=useState(new Set());
 const sections=({offer,atom})=>atom.parent_line_id?atomicSections0550(atom):offerSourceSections0550(offer);
 const filtered=rows.filter(row=>(!system||row.atom.anchor.system===system)&&(!volume||sections(row).includes(volume)));
 const selectedRows=rows.filter(({atom})=>selected.has(atom.line_id));
 const toggle=(items,checked)=>setSelected(previous=>{
  const next=new Set(previous);
  for(const {atom} of items){if(checked)next.add(atom.line_id);else next.delete(atom.line_id);}
  return next;
 });
 return <div className="p55-stack">
  <div className="p55-review-toolbar">
   <button type="button" disabled={!onNavigate} onClick={()=>onNavigate?.('bid.vendor.offers')}>07.2 Vendor Offers / ALIE Intake</button>
   <label>System <select value={system} onChange={e=>setSystem(e.target.value)}><option value="">All</option>
    {[...new Set(rows.map(row=>row.atom.anchor.system))].sort().map(value=><option key={value}>{value}</option>)}</select></label>
   <label>Volume I <select value={volume} onChange={e=>setVolume(e.target.value)}><option value="">All</option>
    {volumes.map(value=><option key={value} value={value}>11.{value}</option>)}</select></label>
   <button type="button" disabled={!selectedRows.length} onClick={()=>downloadBidFile(exportAlieRows0550(selectedRows,rows,reviewDate),'PJ2608-0550_ALIE_R2_to_GENESIS.json')}>
    Export ALIE R2 JSON ({selectedRows.length})
   </button>
  </div>
  {selectedRows.some(({atom})=>atom.parent_line_id&&!selected.has(atom.parent_line_id))&&<p>JSON จะรวมรายการหลักของชิ้นส่วนที่เลือกด้วย</p>}
  {!filtered.length?<p>ยังไม่มี ALIE lines สำหรับตัวกรองนี้ · เปิด 07.2 Vendor เพื่อรับเข้า</p>:
   <div className="p55-table-wrap"><table className="p55-table" aria-label="ALIE Working source trace">
    <thead><tr><th scope="col"><input type="checkbox" aria-label="Select all visible ALIE lines"
     checked={filtered.every(row=>selected.has(row.atom.line_id))} onChange={e=>toggle(filtered,e.target.checked)}/></th>
     <th scope="col">Offer / Part or service</th><th scope="col">System / TAG</th><th scope="col">Native Qty / rate</th><th scope="col">Class / Volume I</th><th scope="col">Working trace</th></tr></thead>
    <tbody>{filtered.map(row=>{
     const {offer,atom,working}=row;
     const {draft,reason}=working.length?{}:alieWorkingDraft0550(data,row,COMMERCIAL_POLICY,reviewDate);
     return <tr key={atom.line_id}>
      <td><input type="checkbox" aria-label={'Select '+atom.line_id} checked={selected.has(atom.line_id)} onChange={e=>toggle([row],e.target.checked)}/></td>
      <td><button type="button" disabled={!onNavigate} onClick={()=>onNavigate?.('bid.vendor.offer.'+offer.id)}>{offer.quoteRef} · {atom.part.vnd_desc}</button>
       <small>{atom.line_id} · {atom.part.vnd_pn||'PN OPEN'}</small>{atom.parent_line_id&&<small>Included in {atom.parent_line_id}</small>}</td>
      <td>{atom.anchor.system} · {atom.anchor.tag}<small>{[atom.anchor.tag_status,atom.anchor.site,atom.anchor.location,atom.anchor.cabinet].filter(Boolean).join(' · ')}</small></td>
      <td>{atom.qty.value??'OPEN'} {atom.qty.uom} · {atom.cost.unit??'OPEN'} {atom.cost.currency}</td>
      <td>{atom.route.line_class} · {atom.internal.treatment}<small>{sections(row).map(section=>'11.'+section).join(' / ')}</small></td>
      <td>{working.length?working.map(({line,owner})=><button key={line.id} type="button" onClick={()=>onEdit(line)}>
       {line.wbs} · {line.description} · {owner?'Selected':'Reference'}
      </button>):draft&&onDraft?<button type="button" onClick={()=>onDraft(draft)}>
       เตรียม Working {draft.wbs} จาก Offer
      </button>:reason||'OPEN · ยังไม่มี Working link'}</td>
     </tr>;
    })}</tbody>
   </table></div>}
 </div>;
}
