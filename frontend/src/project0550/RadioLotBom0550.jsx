import React from 'react';

// Per-set breakdown of a priced radio lot. Rows carry no price of their own.
export function RadioLotBomTable0550({components,caption='BOM ต่อ 1 ชุด · ราคาอยู่ที่แถว Lot'}){
 if(!components?.length)return null;
 const rows=[];
 let previous='';
 components.forEach((component,index)=>{
  if(component.group&&component.group!==previous)rows.push({kind:'group',key:'group-'+index,label:component.group});
  previous=component.group||'';
  rows.push({kind:'item',key:'item-'+index,component});
 });
 return <div className="p55-radio-lot-bom" data-radio-lot-bom="true">
  <div className="p55-table-wrap"><table className="p55-table p55-supplier-boq" aria-label="Radio lot component breakdown per set">
   <caption>{caption}</caption>
   <thead><tr><th>จำนวนต่อชุด</th><th>รายการ</th><th>Model / Part No.</th><th>หมายเหตุ</th></tr></thead>
   <tbody>{rows.map(row=>row.kind==='group'
    ?<tr key={row.key} className="p55-bom-group"><th colSpan={4} scope="rowgroup">{row.label}</th></tr>
    :<tr key={row.key} data-radio-part={row.component.partNo||undefined} data-radio-included={row.component.included?'true':'false'}>
     <td className="p55-bom-quantity">{row.component.quantity??'—'}{row.component.unit?' '+row.component.unit:''}</td>
     <td>{row.component.description}</td>
     <td>{row.component.partNo||'—'}</td>
     <td>{[row.component.included?'':'Remark · ไม่ใช่รายการราคา',row.component.remarks].filter(Boolean).join(' · ')}</td>
    </tr>)}</tbody>
  </table></div>
  <p>จำนวนเป็นต่อ 1 ชุดใน Lot · ราคาอยู่ที่แถว Lot เท่านั้น · แถวส่วนประกอบไม่บวกซ้ำ</p>
 </div>;
}
