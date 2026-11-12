import {MR_WORKING_CATALOG_0550} from "./data/mrWorkingBasis0550";
import {mgwCurrentMr0550,mgwRadioDtrsOffer0550} from "./data/mgwQuoteSelection0550";
import {MR_SUPPLY_ORDER_0550} from "./bidWorkingBasis0550";

const catalog=MR_WORKING_CATALOG_0550.rows;
const positions=new Map(catalog.map((row,index)=>[row.id,index]));
const appendixOf=row=>row?.reference.match(/\bApp\.(\d+\.\d+)\b/)?.[1]||"";
const rank=line=>positions.get(line?.mrRequirementId)??Infinity;

function mappedRadioPackages(rows,lines){
 const byMr=new Map();
 for(const row of rows){
  const mrId=lines.get(row.key)?.mrRequirementId;
  if(mrId)byMr.set(mrId,byMr.has(mrId)?null:row);
 }
 const byParent=new Map(),nested=new Set();
 for(const row of rows){
  const line=lines.get(row.key);
  if(line.mrRequirementId||!mgwRadioDtrsOffer0550(line.offer))continue;
  const mrIds=mgwCurrentMr0550(line.offer);
  const parent=mrIds.length===1?byMr.get(mrIds[0]):undefined;
  if(!parent)continue;
  if(!byParent.has(parent.key))byParent.set(parent.key,[]);
  byParent.get(parent.key).push(row);
  nested.add(row.key);
 }
 return {byParent,nested};
}

// Screen-only hierarchy. Each canonical customer row occurs once. Split a Lot
// spanning appendices into display sections, never duplicate its amount/ID.
export function releaseHierarchy0550(official,customerRows){
 const lines=new Map(official.lines.map(line=>[line.id,line])),entries=[],controls=[];
 const heading=(key,label,parents,defaultOpen=true)=>{const node={key,label,parents,defaultOpen};controls.push(node);return node;};
 for(const part of ["A","B","C"]){
  const section=heading("part:"+part,part+" · "+(part==="A"?"Equipment":part==="B"?"Services":"Optional"),[]);
  entries.push({...customerRows.find(row=>row.kind==="section"&&row.key===part),sectionModuleId:"bid.budget.release.part."+part,parents:[],toggle:section});
  const buckets=new Map();
  const categoryFor=appendix=>part!=="A"?"part:"+part+":other":appendix?"mr:"+appendix:"working:A";
  const bucket=(key,appendix)=>{
   if(!buckets.has(key))buckets.set(key,{key,appendix,rank:appendix?catalog.findIndex(r=>r.wbs==="A"&&appendixOf(r)===appendix):Infinity,segments:[]});
   return buckets.get(key);
  };
  if(part==="A"){
   for(const {appendix} of MR_SUPPLY_ORDER_0550){
    if(appendix!=="1.0")bucket(categoryFor(appendix),appendix);
   }
  }
  for(const [index,group] of official.schedule.filter(g=>g.part===part).entries()){
   const rows=customerRows.filter(row=>row.kind==="line"&&lines.get(row.key)?.customerRowCode===group.code).sort((a,b)=>rank(lines.get(a.key))-rank(lines.get(b.key)));
   const packages=part==="A"?mappedRadioPackages(rows,lines):null;
   const references=rows.map(row=>catalog[rank(lines.get(row.key))]).filter(Boolean);
   const groupCatalog=catalog.filter(row=>row.wbs===part&&group.systems.includes(row.systemToken));
   const basis=references.length?references:groupCatalog;
   const appendixBasis=part==="A"?[...basis,...groupCatalog].sort((a,b)=>positions.get(a.id)-positions.get(b.id)):basis;
   const appendices=[...new Set(appendixBasis.map(appendixOf).filter(Boolean))];
   const firstAppendix=part==="A"?(appendixOf(basis[0])||appendices[0]||""):"",anchor=categoryFor(firstAppendix);
   const segments=new Map();
   if(part==="A")for(const appendix of appendices)segments.set(categoryFor(appendix),{appendix,rows:[]});
   segments.set(anchor,{appendix:firstAppendix,rows:[]});
   for(const row of rows){
    if(packages?.nested.has(row.key))continue;
    const line=lines.get(row.key),requirement=catalog[rank(line)];
    // Locate a package by its system within the Lot's known appendices. Keep its native reference separate.
    const systemAppendix=part==="A"&&!requirement&&MR_SUPPLY_ORDER_0550.find(grouping=>appendices.includes(grouping.appendix)&&grouping.systems.includes(line?.systemToken))?.appendix;
    const appendix=part==="A"?(appendixOf(requirement)||systemAppendix||firstAppendix):"",key=categoryFor(appendix);
    if(!segments.has(key))segments.set(key,{appendix,rows:[]});
    const packageRows=packages?.byParent.get(row.key);
    segments.get(key).rows.push({...row,mrReference:requirement?.reference||"",...(packageRows?{packageRows}:{})});
   }
   for(const [key,segment] of segments)bucket(key,segment.appendix).segments.push({group,index,...segment,anchor:key===anchor,appendices,rank:segment.rows.length?Math.min(...segment.rows.map(row=>rank(lines.get(row.key)))):positions.get(basis[0]?.id)??Infinity});
  }
  for(const category of [...buckets.values()].sort((a,b)=>a.rank-b.rank)){
   const parents=[section.key];
   if(part!=="A"||category.appendix){
    const appendixRef=category.appendix?"MR App. "+category.appendix:"";
    const description=category.appendix
     ? MR_SUPPLY_ORDER_0550.find(g=>g.appendix===category.appendix)?.title||"รายการตาม MR"
     : "รายการบริการ / Options ตามแบบลูกค้า";
    const label=appendixRef?appendixRef+" · "+description:description;
    const node=heading(category.key,label,[section.key]);
    entries.push({kind:"mr-category",key:node.key,parents:node.parents,toggle:node,appendixRef,description});
    parents.push(node.key);
   }
   if(!category.segments.length)entries.push({kind:"mr-empty",key:category.key+"/empty",parents,description:"ยังไม่มี Lot ที่เชื่อมกับ Appendix นี้ใน Release"});
   for(const segment of category.segments.sort((a,b)=>a.rank-b.rank||a.index-b.index)){
    const {group,rows,anchor,appendices}=segment;
    const showEmpty=part==="A"&&Boolean(category.appendix)&&!rows.length;
    const system=heading(anchor?group.releaseModuleId:group.releaseModuleId+"/appendix/"+(category.appendix||"working"),group.code+" · "+group.description,parents,part==="A"&&(rows.length>0||showEmpty));
    entries.push(anchor?{...customerRows.find(row=>row.kind==="group"&&row.key===group.code),parents,toggle:system,mrReferences:appendices.map(a=>"App. "+a).join(" / ")}:{kind:"mr-system",key:system.key,parents,toggle:system,lotCode:group.code,lotModuleId:group.releaseModuleId});
    if(showEmpty)entries.push({kind:"mr-empty",key:system.key+"/empty",parents:[...parents,system.key],description:"ยังไม่มีรายการย่อยของ Lot นี้ใน Appendix ในมุมมอง Release"});
    const sites=new Map();
    for(const row of rows){const requirement=catalog[rank(lines.get(row.key))],site=requirement?.site||(part==="A"?"":"Working / package");if(!sites.has(site))sites.set(site,[]);sites.get(site).push(row);}
    for(const [site,siteRows] of sites){
     const siteParents=[...parents,system.key];
     if(!site){
      entries.push(...siteRows.map(row=>({...row,parents:siteParents})));
      continue;
     }
     const siteLabel=site+" · "+siteRows.length+" รายการ";
     const siteNode=heading(system.key+"/site/"+site,part==="A"?group.code+" · "+siteLabel:siteLabel,siteParents);
     entries.push({kind:"mr-site",key:siteNode.key,parents:siteNode.parents,toggle:siteNode,lotCode:group.code,siteLabel});
     const rowParents=[...siteNode.parents,siteNode.key];
     for(const row of siteRows){
      const {packageRows,...entry}=row;
      if(!packageRows){
       entries.push({...entry,parents:rowParents});
       continue;
      }
      const toggle=heading(entry.moduleId,entry.cells[2]+" · ขอบเขตตาม MR",rowParents);
      entries.push({...entry,parents:rowParents,toggle,nestedOwnerIds:packageRows.map(child=>child.key)});
      entries.push(...packageRows.map(child=>({...child,parents:[...rowParents,toggle.key],packageChild:true})));
     }
    }
   }
  }
 }
 entries.push(...customerRows.filter(row=>row.kind==="total").map(row=>({...row,parents:[]})));
 return {entries,controls};
}
