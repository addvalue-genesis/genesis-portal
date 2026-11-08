import {MR_WORKING_CATALOG_0550} from "./data/mrWorkingBasis0550";
import {MR_SUPPLY_ORDER_0550} from "./bidWorkingBasis0550";

const catalog=MR_WORKING_CATALOG_0550.rows;
const positions=new Map(catalog.map((row,index)=>[row.id,index]));
const appendixOf=row=>row?.reference.match(/\bApp\.(\d+\.\d+)\b/)?.[1]||"";
const rank=line=>positions.get(line?.mrRequirementId)??Infinity;

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
  for(const [index,group] of official.schedule.filter(g=>g.part===part).entries()){
   const rows=customerRows.filter(row=>row.kind==="line"&&lines.get(row.key)?.customerRowCode===group.code).sort((a,b)=>rank(lines.get(a.key))-rank(lines.get(b.key)));
   const references=rows.map(row=>catalog[rank(lines.get(row.key))]).filter(Boolean);
   const basis=(references.length?references:catalog.filter(row=>row.wbs===part&&group.systems.includes(row.systemToken))).sort((a,b)=>positions.get(a.id)-positions.get(b.id));
   const appendices=[...new Set(basis.map(appendixOf).filter(Boolean))];
   const firstAppendix=part==="A"?appendixOf(basis[0]):"",anchor=categoryFor(firstAppendix);
   const segments=new Map([[anchor,{appendix:firstAppendix,rows:[]}]]);
   for(const row of rows){
    // An item without an Appendix stays with its Lot. Its own MR reference is unchanged.
    const requirement=catalog[rank(lines.get(row.key))],appendix=part==="A"?(appendixOf(requirement)||firstAppendix):"",key=categoryFor(appendix);
    if(!segments.has(key))segments.set(key,{appendix,rows:[]});
    segments.get(key).rows.push({...row,mrReference:requirement?.reference||""});
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
   for(const segment of category.segments.sort((a,b)=>a.rank-b.rank||a.index-b.index)){
    const {group,rows,anchor,appendices}=segment;
    const system=heading(anchor?group.releaseModuleId:group.releaseModuleId+"/appendix/"+(category.appendix||"working"),group.code+" · "+group.description,parents,part==="A"&&rows.length>0);
    entries.push(anchor?{...customerRows.find(row=>row.kind==="group"&&row.key===group.code),parents,toggle:system,mrReferences:appendices.map(a=>"App. "+a).join(" / ")}:{kind:"mr-system",key:system.key,parents,toggle:system,lotModuleId:group.releaseModuleId});
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
     entries.push(...siteRows.map(row=>({...row,parents:[...siteNode.parents,siteNode.key]})));
    }
   }
  }
 }
 entries.push(...customerRows.filter(row=>row.kind==="total").map(row=>({...row,parents:[]})));
 return {entries,controls};
}
