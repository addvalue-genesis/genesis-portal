import React from 'react';
import evidence from './data/mgwRadioTagEvidence0550.json';
import {mgwRadioItemForOffer0550} from './data/vendorBidTags0550';

export function MgwRadioTagEvidence0550({offer,item=mgwRadioItemForOffer0550(offer)}){
 const group=evidence.groups[evidence.items[item]];
 if(!group)return null;
 return <details data-radio-tag-evidence={item}>
  <summary>Equipment TAG / TAG Location / Rack · {group.state}</summary>
  <p>{group.note}</p>
  {group.placements.length>0&&<div className="p55-table-wrap"><table className="p55-table" aria-label={'CUS installation TAGs '+item}>
   <thead><tr><th>อุปกรณ์ / TAG</th><th>TAG Location</th><th>Rack / Cabinet TAG</th><th>หลักฐาน CUS</th></tr></thead>
   <tbody>{group.placements.map(placement=><tr key={placement.equipment}>
    <td><strong>{placement.equipment}</strong><small>{placement.tags.join(' · ')||'TAG ยังไม่ระบุ'}</small></td>
    <td>{placement.location}</td><td>{placement.rack}</td>
    <td>{placement.refs.map(([id,locator])=><small key={id+locator}><a href={evidence.sources[id].url} target="_blank" rel="noreferrer">{evidence.sources[id].label}</a> · {locator}</small>)}</td>
   </tr>)}</tbody>
  </table></div>}
 </details>;
}
