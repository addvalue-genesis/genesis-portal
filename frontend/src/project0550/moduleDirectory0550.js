const projectId = "PJ2608-0550";
const logicalParents = [
 ["bid.working-preview.particulars", "bid.budget.working.lines"],
 ["bid.working-preview.particular.", "bid.working-preview.particulars"],
 ["bid.working-preview.requirement.", "bid.working-preview.step.4"],
 ["bid.working-preview.proof.", "bid.working-preview.step.2"],
 ["bid.working-preview.activity.", "bid.working-preview.step.6"],
 ["bid.working-preview", "bid.budget.working.lines"],
 ["bid.documents.controlled-source-inventory.mr.page.", "bid.documents.controlled-source-inventory.mr"],
 ["bid.documents.source.", "l3.original"],
 ["bid.vendor.offer.", "bid.vendor.offers"],
 ["bid.vendor.", "bid.documents"],
 ["MOD-", "bid.registry"],
];
const compare = (left,right) => left.localeCompare(right,"en",{numeric:true});

export function moduleDirectory0550(entries) {
 const byId = new Map(entries.map(item => [item.id,{...item}]));
 const byNumber = new Map();
 const sectionKey = (item,number) => [item.area || "B",item.tab,number].join("/");
 const structuralOrder = [...byId.values()].sort((a,b) => a.id.length-b.id.length || compare(a.id,b.id));
 for (const item of structuralOrder) {
  const key = sectionKey(item,item.number);
  if (item.number && !byNumber.has(key)) byNumber.set(key,item.id);
 }
 const parentId = item => {
  const {id,area,tab} = item;
  if (item.parentId && byId.has(item.parentId)) return item.parentId;
  if (id.startsWith("bid.budget.working.group.") && item.owner) {
   const part = "bid.budget.working.part."+item.owner[0];
   if (byId.has(part)) return part;
  }
  const parent = logicalParents.find(([prefix]) => prefix.endsWith(".") || prefix.endsWith("-")
   ? id.startsWith(prefix) : id === prefix)?.[1];
  if (parent && byId.has(parent)) return parent;
  const number = item.number || "";
  for (let end=number.lastIndexOf(".");end>0;end=number.lastIndexOf(".",end-1)) {
   const candidate = byNumber.get(sectionKey(item,number.slice(0,end)));
   if (candidate && candidate!==id) return candidate;
  }
  for (let end=id.lastIndexOf(".");end>0;end=id.lastIndexOf(".",end-1)) {
   const candidate = byId.get(id.slice(0,end));
   if (candidate && (candidate.area || "B") === (area || "B") && candidate.tab === tab) return candidate.id;
  }
  const root = area === "A" ? "l3.original" : area === "C" ? "l3.submissions" : "bid."+tab;
  return id !== root && byId.has(root) ? root : "";
 };
 // Reserve the existing numbers for structural headings before allocating leaf
 // numbers. Repeated labels such as A.1 and 11.M stay searchable as aliases.
 const used = new Set(), children = new Map();
 for (const item of structuralOrder) {
  item.parentId = parentId(item);
  item.legacyNumber ||= item.number;
  if (item.number && !used.has(item.number)) used.add(item.number);
  else item.number = "";
  if (!children.has(item.parentId)) children.set(item.parentId,[]);
  children.get(item.parentId).push(item);
 }
 const ordered = [];
 function visit(parent, level) {
  const siblings = children.get(parent?.id || "") || [];
  let ordinal = 1;
  for (const item of siblings) {
   if (item.number) continue;
   const prefix = parent?.number ? parent.number+"." : "";
   do {item.number = prefix+String(ordinal++);} while (used.has(item.number));
   used.add(item.number);
  }
  siblings.sort((a,b) => compare(a.number,b.number));
  // A workflow can place a tool after a group whose headings use WBS letters.
  for (const item of siblings.filter(entry => entry.sortAfterId)) {
   const from = siblings.indexOf(item);
   const after = siblings.findIndex(entry => entry.id === item.sortAfterId);
   if (from < after) {
    siblings.splice(from,1);
    siblings.splice(after,0,item);
   }
  }
  for (const item of siblings) {
   item.level = level;
   ordered.push(item);
   visit(item,level+1);
  }
 }
 visit(null,0);
 return {entries:ordered,children,numbers:new Map(ordered.map(item=>[item.id,item.number]))};
}

export function moduleDirectoryText0550(entries) {
 const field = value => String(value || "").replace(/[\t\r\n]+/g," ");
 return ["เลขที่\tชื่อหัวข้อ\tModule ID",...entries.map(item =>
  [item.number,field(item.title),projectId+" / "+item.id].join("\t"))].join("\n");
}
