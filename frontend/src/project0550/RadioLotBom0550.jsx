import React from 'react';

// Per-set breakdown of a priced radio lot. Rows carry no price of their own.
function radioLotSections0550(components){
 const sections=[];
 for(const component of components){
  const group=component.group||'';
  const last=sections[sections.length-1];
  if(!last||last.group!==group)sections.push({group,items:[component]});
  else last.items.push(component);
 }
 return sections;
}
export function RadioLotBomTable0550({components,caption='BOM ต่อ 1 ชุด · ราคาอยู่ที่แถว Lot',sourceBrand,sourceModel}){
 if(!components?.length)return null;
 const sections=radioLotSections0550(components);
 const sourceIdentity=[sourceBrand,sourceModel].filter(Boolean).join(' · ');
 return <div className="p55-radio-lot-bom" data-radio-lot-bom="true">
  <div className="p55-table-wrap"><table className="p55-table p55-supplier-boq" aria-label="Radio lot component breakdown per set">
   <caption>{caption}</caption>
   <thead><tr><th>จำนวนต่อชุด</th><th>รายการ</th><th>Brand / Model / Part No.</th><th>หมายเหตุ</th></tr></thead>
   {sections.map((section,index)=>{
    // A blank group after a named section is equipment again, not a continuation of License or an include-list.
    const label=section.group||(index>0&&sections[index-1].group?'Equipment':'');
    return <tbody key={label+':'+index} data-radio-group={section.group}>
     {label&&<tr className="p55-bom-group"><th colSpan={4} scope="rowgroup">{label}</th></tr>}
     {section.items.map((component,itemIndex)=><tr key={itemIndex} data-radio-part={component.partNo||undefined} data-radio-group={component.group||''} data-radio-included={component.included?'true':'false'}>
      <td className="p55-bom-quantity">{component.quantity??'—'}{component.unit?' '+component.unit:''}</td>
      <td>{component.description}</td>
      <td>{component.partNo||(!component.included&&component.group==='Description'&&sourceIdentity)||'—'}</td>
      <td>{[component.included?'':'Remark · ไม่ใช่รายการราคา',component.remarks].filter(Boolean).join(' · ')}</td>
     </tr>)}
    </tbody>;
   })}
  </table></div>
  <p>จำนวนเป็นต่อ 1 ชุดใน Lot · ราคาอยู่ที่แถว Lot เท่านั้น · แถวส่วนประกอบไม่บวกซ้ำ</p>
 </div>;
}
