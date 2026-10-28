import {buildMrCustomerSummary0553} from "./mrCustomerSummary0553";

// Read-only presentation. Each source key belongs to exactly one summary row.
const cents=n=>Math.round(n*100);
const definitions=[
 ["ODU","Outdoor Radio Unit"],["IDU","Indoor Radio Unit / Interface"],
 ["ANT","SCADA Radio Antenna"],["LAN","Layer 3 Switch"],
 ["DATO","DATO Ethernet Socket & Plug"],["NEW","Enclosure — New Supply"],
 ["REUSE","Existing Enclosure — Reuse"],["SA","Ethernet Surge Protection"],
 ["BULK","Bulk Materials & Accessories"]
];
const odu=new Set(["MR-502-001","MR-502-003","MR-502-004","MR-502-005A","MR-LQM-202-025A"]);
const idu=new Set(["MR-502-001A","MR-502-003A","MR-502-004A","MR-502-005B","MR-LQM-202-025B"]);
function category(row){
 if(odu.has(row.tag))return "ODU";
 if(idu.has(row.tag))return "IDU";
 if(row.tag.startsWith("TCAB-"))return row.site==="ZWP11"?"REUSE":"NEW";
 for(const key of ["ANT","LAN","DATO","SA"])if(row.tag.startsWith(key+"-"))return key;
 if(row.tag.startsWith("Bulk Material"))return "BULK";
 throw Error("Unmapped A1 equipment: "+row.key);
}
export function buildPartAEquipmentSummary0553(breakdown){
 const mrSummary=buildMrCustomerSummary0553(breakdown);
 const groups=breakdown.groups.map(group=>{
  let rows;
  if(group.code==="A1"){
   const buckets=new Map(definitions.map(([key])=>[key,[]]));
   group.rows.forEach(r=>buckets.get(category(r)).push(r));
   rows=definitions.filter(([key])=>buckets.get(key).length).map(([key,description],index)=>{
    const children=buckets.get(key),units=new Set(children.map(r=>r.unit.toLowerCase()));
    if(units.size!==1||children.some(r=>!Number.isFinite(r.qty)||r.qty<0))throw Error("A1 quantity/unit requires review: "+key);
    const qty=children.reduce((n,r)=>n+r.qty,0),priced=children.filter(r=>r.amountUSD!==null);
    const amountUSD=priced.length?priced.reduce((n,r)=>n+cents(r.amountUSD),0)/100:null;
    const commonRate=children.every(r=>r.specification===children[0].specification&&r.unitUSD===children[0].unitUSD);
    const unitUSD=commonRate&&priced.length===children.length&&key!=="IDU"?children[0].unitUSD:null;
    let remark=key==="REUSE"?"Existing owner asset; reuse only. New procurement quantity: 0.":
     key==="IDU"?"MR functional quantity; configuration confirmation required. ZPQ IDU specification conflicts with the selected source; no common unit rate.":
     unitUSD===null?"Mixed configurations; group amount only.":"";
    if(children.some(r=>r.status==="NOT PRICED"))remark+=" Unpriced scope requires confirmation.";
    return {item:group.code+"."+(index+1),description,qty,unit:units.has("lot")?"Lot":"Set",
     locations:[...new Set(children.map(r=>r.site))].join(", "),unitUSD,amountUSD,remark,
     sourceKeys:children.map(r=>r.key)};
   });
  }else{
   // MR system quantities, not the sum of package components. In particular,
   // the shared phase adapter is NOT multiplied by the number of RACON sites.
   const summary=mrSummary.groups.find(g=>g.code===group.code),units=new Set(summary.rows.map(r=>r.unit));
   if(units.size!==1||summary.rows.some(r=>!Number.isFinite(r.qty)))throw Error("MR system quantity requires review");
   const qty=summary.rows.reduce((n,r)=>n+r.qty,0);
   const commonRate=summary.rows.every(r=>r.unitUSD===summary.rows[0].unitUSD);
   rows=[{item:group.code+".1",description:summary.description,qty,unit:summary.rows[0].unit,
    locations:summary.rows.map(r=>r.site).join(", "),unitUSD:commonRate?summary.rows[0].unitUSD:null,
    amountUSD:summary.totalUSD,remark:summary.qualification+
     (group.pendingCount?" Priced subtotal excludes unpriced scope; not a complete scope price.":""),
    sourceKeys:summary.rows.flatMap(r=>r.sourceKeys)}];
  }
  const keys=rows.flatMap(r=>r.sourceKeys);
  if(keys.length!==group.rows.length||new Set(keys).size!==keys.length||group.rows.some(r=>!keys.includes(r.key)))
   throw Error("Sheet A must map each source row exactly once");
  const totalUSD=rows.reduce((n,r)=>n+cents(r.amountUSD??0),0)/100;
  if(totalUSD!==group.parentUSD)throw Error("Sheet A differs from Release total");
  return {code:group.code,mr:group.mr,description:group.description,rows,totalUSD,parentUSD:group.parentUSD};
 });
 return {groups,totalUSD:groups.reduce((n,g)=>n+cents(g.totalUSD),0)/100,issued:false};
}
