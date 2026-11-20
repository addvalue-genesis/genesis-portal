import React from 'react';
import {technicalDossier0550} from './data/technicalDossier0550';
export function TechnicalTrace0550({data,model,view,system,section,onNavigate}){
 const d=technicalDossier0550(data,model,view,system,section),groups=[['A / S · Source records',d.sourceIds.map(id=>({id,title:id,target:'bid.documents.source.'+id}))],['SI / Requirements',d.requirements.map(r=>({id:r.id,title:r.title,target:'bid.working-preview.requirement.'+r.id}))],['SI / CAL–RPT',d.proofs.map(r=>({id:r.id,title:r.title,target:'bid.working-preview.proof.'+r.id}))],['S / Supplier offers',d.offers.map(o=>({id:o.id,title:o.brand+' / '+o.description,target:'bid.vendor.offer.'+o.id}))],['14 / Technical Deviation',d.deviations.map(r=>({id:r.id,title:r.vendorDeviation,target:'bid.deviations.record.'+r.id}))]];
 return <details><summary>ตรวจย้อนกลับ A ↔ SI ↔ Supplier / Deviation · {system}</summary>{groups.map(([title,rows])=><section key={title}><h4>{title}</h4>{rows.length?<ul>{rows.map(r=><li key={r.id}><button type="button" onClick={()=>onNavigate(r.target)}>{r.id}</button> · {r.title}</li>)}</ul>:<p>OPEN · ยังไม่มีรายการเชื่อม / ต้องทบทวน applicability</p>}</section>)}</details>;
}
