export const RETIRED_TOWER_OFFER_0550='OFFER-LEGACY-TEL-TELT-1';
export const RETIRED_TOWER_OWNER_0550='LINE-LEGACY-TEL-TELT-1';
export const RETIRED_TOWER_BASIS_0550='ยกเลิกฐานราคาเสารวมเดิม · ตรวจราคาที่แถว MR ของแต่ละเสา';

// Retain the historical records and supplier documents. Retire their financial
// link on the current workspace, including when an older backup is restored.
export function retireLegacyTowerPricing0550(data){
 let changed=false;
 const lines=data.lines.map(line=>{
  if(line.id===RETIRED_TOWER_OWNER_0550&&line.selected){
   changed=true;
   return {...line,selected:false};
  }
  if(line.coveredByLineId===RETIRED_TOWER_OWNER_0550){
   changed=true;
   return {...line,coveredByLineId:'',coverageBasis:''};
  }
  return line;
 });
 return changed?{...data,lines}:data;
}
