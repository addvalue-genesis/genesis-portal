import reference from "./subvendorReference0550.json";

// This attachment is headed "By Vendor". It is a declaration to reconcile,
// not customer AVL approval, project applicability or a manufacturing certificate.
export const SUBVENDOR_REFERENCE_0550=reference;
const fields=["discipline","group","subGroup","itemDescription","vendor","makeModel","countryOfOrigin"];
const normalize=text=>text.replace(/\s+/g," ").trim();
const key=row=>JSON.stringify(fields.map(field=>normalize(row[field])));
export function groupedSubvendors0550(){
 const groups=new Map();
 for(const row of reference.rows){
  const existing=groups.get(key(row));
  if(existing){existing.sourceRows.push(row.sourceRow);existing.rowIds.push(row.id);}
  else groups.set(key(row),{...row,sourceRows:[row.sourceRow],rowIds:[row.id]});
 }
 return [...groups.values()];
}
export const subvendorRow0550=id=>reference.rows.find(row=>row.id===id)||null;
export function subvendorDraftFields0550(rowId){
 const row=subvendorRow0550(rowId);if(!row)throw Error("Unknown sub-vendor source row");
 return {
  vendorListRowId:row.id,vendorListSourceHash:reference.source.sha256,
  manufacturer:row.vendor,model:row.makeModel,result:"OPEN",
  sourceIds:[],sourceLocator:"",sourceExcerpt:"",
  basis:`${reference.source.name} / p1 / table 1 / data row ${row.sourceRow}. By Vendor: ${row.itemDescription}; VENDORS: ${row.vendor}; declared country: ${row.countryOfOrigin}. Model, 0550 applicability and customer AVL approval require evidence.`,
  status:"DRAFT",reviewer:"",reviewedOn:"",basisKey:""
 };
}
export function isSubvendorDeclarationSource0550(source){
 const id=reference.source.driveFileId;
 if(source?.id===id||source?.id==="DRV-"+id)return true;
 try{return new URL(source.url).pathname.split("/").includes(id);}catch{return false;}
}
export function subvendorReferenceProblems0550(record){
 if(!record.vendorListRowId)return record.vendorListSourceHash?["VENDOR_LIST_ROW_MISSING"]:[];
 const row=subvendorRow0550(record.vendorListRowId),problems=[];
 if(!row)return ["VENDOR_LIST_ROW_MISSING"];
 if(record.vendorListSourceHash!==reference.source.sha256)problems.push("VENDOR_LIST_SOURCE_CHANGED");
 const brand=text=>text.toUpperCase().replace(/[^A-Z0-9]/g,"");
 if(brand(record.manufacturer)!==brand(row.vendor))problems.push("DECLARED_VENDOR_RECONCILIATION_OPEN");
 return problems;
}
