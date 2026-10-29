// Deliberately synthetic documents for model/browser regression only. Never import
// this fixture in the application or use it to approve the actual project corpus.
exports.completeSyntheticSourceInputs0550=function(data,S,today){
 if(data.sourceIntake?.batchId!=='SYNTHETIC')throw Error('Synthetic fixture only');
 const control=S.emptySourceControl0550(),keys=new Map();let n=0;
 for(const input of S.RFQ_INPUT_CATALOG_0550.inputs){
  const key=input.kind==='ATTACHMENT'?input.id:input.documentNo+'/'+input.revision;
  let source=keys.get(key);
  if(!source){
   const id='SYNTHETIC-INPUT-'+(++n);
   source={id,provider:'GDRIVE',title:'SYNTHETIC ONLY / '+input.title,documentNo:input.documentNo,revision:input.revision,issuedDate:today,receivedDate:today,url:'https://drive.google.com/file/d/'+id+'/view',readState:'TEXT_READ',authority:'CURRENT_TENDER',content:'SYNTHETIC ONLY / receipt and reading fixture. SUPPLIER DOCUMENTATION REQUIREMENT. INSPECTION & TESTING REQUIREMENTS.',note:'Synthetic only, not a received project document',replaces:[]};
   keys.set(key,source);data.sourceIntake.sources.push(source);
  }
  control.bindings.push({inputId:input.id,sourceIds:[source.id],locator:'SYNTHETIC p1 / '+input.locator});
 }
 control.review={status:'REVIEWED',reviewer:'SYNTHETIC REVIEWER',reviewedOn:today,basis:'Synthetic complete denominator only; not project applicability or receipt.',rfqReviewed:true,receivedSetReviewed:true,referencesReviewed:true,basisKey:''};
 data.sourceControl=S.stampSourceControl0550(data,control);
 return data;
};
