// Fail-closed project-specific checks. No 0550 particular facts or rates.
export function validateProject0553Dataset(data){
 const errors=[];
 if(data?.projectId!=="PJ2608-0553"||data?.meta?.projectCode!=="PJ2608-0553")errors.push("project mismatch");
 if(data?.issuePermission!==false)errors.push("release must remain disabled");
 if(data?.meta?.integrationState?.controlledJson!=="ACTIVE")errors.push("controlled JSON is not active");
 if(!Array.isArray(data?.mto?.systems)||data.mto.systems.length!==4)errors.push("expected four MR systems");
 if(!Array.isArray(data?.supplierQuotes))errors.push("supplier quote registry missing");
 if(!Array.isArray(data?.quoteReferences))errors.push("quote manifest missing");
 for(const ref of data.quoteReferences||[]){
  const q=(data.supplierQuotes||[]).find(x=>x.id===ref.id);
  if(!q||!Array.isArray(q.lines)||q.lines.length!==ref.expectedLineCount||q.currency!==ref.currency)errors.push("quote count/currency: "+ref.id);
  if(q&&Math.abs((q.lines||[]).reduce((a,x)=>a+(typeof x[5]==="number"?x[5]:0),0)-ref.expectedQuotedTotal)>0.01)errors.push("quote total: "+ref.id);
 }
 if(errors.length)throw Error("PJ2608-0553 controlled dataset invalid: "+errors.join("; "));
 return Object.freeze(data);
}
