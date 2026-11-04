import {createBaseline,makeArtifact,cloneBaselineJson} from "../../common/governance/quotationBaseline";
import {QUOTATION_EQUATION_VERSION} from "../../common/cost/quotationRounding";
import {buildOfficialUsdRelease0553,PART_A_SUBMITTED_PRICE_HOLD_0553} from "./officialUsdRelease0553";
import {buildCustomerPriceBreakdown0553} from "./customerPriceBreakdown0553";
import {buildNativeOfficialRelease0553} from "../nativeWorkingDraft0553";
import {buildNativePriceBreakdown0553} from "../nativePriceBreakdown0553";
import template from "./nativeReleaseTemplate0553.json";
export const QUOTATION_SCOPE_0553=Object.freeze({projectId:"PJ2608-0553",proposalStreamId:"ZM169-RFQ-TE-001-COMMERCIAL",recipientGroupId:"SAMTEL"});
export const QUOTATION_POLICY_BINDINGS_0553=Object.freeze({
 version:"0553-quoted-usd/20261104.1",equationVersion:QUOTATION_EQUATION_VERSION,
 fixedParentCodes:Object.keys(PART_A_SUBMITTED_PRICE_HOLD_0553.quotedUSD),
 remainingCalculatedLines:"UP_UNIT_THEN_SUM",unitIncrementUSD:"10",
 importedWorkbooks:"IMPORT_EXACT_ARTIFACT__DO_NOT_RECALCULATE",
 optionsExcludedFromBase:["C1","C2"],missingIsZero:false,
 fixedParentRule:"LARGEST_REMAINDER_STABLE_LINE_ID_QTY_ONE",
 sourceFinancialWriteback:false,issuePermission:false
});
const mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const json=value=>JSON.parse(JSON.stringify(value)); // Existing models contain optional undefined fields; omit exactly as in workspace JSON.
export async function captureQuotation0553({mode,reference,source,label,actor,createdAt,fetchFile=globalThis.fetch}){
 if(!["CURRENT_REV03","SUBMITTED_REV02","WORKING_DRAFT"].includes(mode))throw Error("Choose current, history or Working before capturing a new revision");
 // Copy inputs before any await; edits during fetch/export cannot enter this revision.
 const workingSource=mode==="SUBMITTED_REV02"?null:json(source);
 const buildCommit=typeof __PJ0553_BUILD_REVISION__!=="undefined"?__PJ0553_BUILD_REVISION__:"UNAVAILABLE";
 let model=null,breakdown=null,contextError=null;
 if(workingSource){
  try{model=buildOfficialUsdRelease0553(workingSource);breakdown=buildCustomerPriceBreakdown0553(workingSource,model);}
  catch(error){if(mode==="WORKING_DRAFT")throw error;contextError=error.message;}
 }
 const snapshot={projectId:QUOTATION_SCOPE_0553.projectId,buildCommit,
  policyBindings:mode==="SUBMITTED_REV02"?{version:"IMPORTED_ORIGINAL_NO_RECALCULATION",mode:"IMPORT_EXACT_ARTIFACT",originalPricingPolicyReconstructed:false}:cloneBaselineJson(QUOTATION_POLICY_BINDINGS_0553),
  policyBindingAppliesTo:mode==="WORKING_DRAFT"?"CALCULATED_WORKING":"CAPTURED_CONTEXT_ONLY__ORIGINAL_PRICING_POLICY_NOT_RECONSTRUCTED",workingSource,
  derivedContext:model?json({model,breakdown,status:"CAPTURED_WORKING_CONTEXT_NOT_PROVEN_PREVIOUSLY_ISSUED"}):null,contextError,
  quotation:null,issued:false,customerAcceptanceVerified:false};
 const artifacts=[];
 if(mode!=="WORKING_DRAFT"){
  const frozenReference=json(reference);
  snapshot.quotation={kind:"IMPORTED_EXACT",reference:frozenReference,calculationMode:"IMPORT_EXACT_ARTIFACT"};
  const response=await fetchFile(frozenReference.originalWorkbookPath,{cache:"no-store"});
  if(!response.ok)throw Error("Cannot read original workbook; revision was not captured");
  const bytes=new Uint8Array(await response.arrayBuffer());
  if(bytes.length!==(frozenReference.originalWorkbookSizeBytes||frozenReference.sourceSizeBytes))throw Error("Original workbook size mismatch");
  artifacts.push(await makeArtifact({id:"original-workbook",filename:frozenReference.filename,mimeType:mime,audience:"CUSTOMER",bytes,
   expectedSha256:frozenReference.sourceWorkbookHash||frozenReference.sourceWorkbookSha256}));
 }else{
  if(!breakdown?.reconciled||model.totalUSD===null||model.unpriced.length)throw Error("Working totals/prices do not reconcile; capture stopped");
  snapshot.quotation={kind:"CALCULATED_WORKING",model:json(model),breakdown:json(breakdown),calculationMode:"PER_GROUP_POLICY_BINDINGS",status:"INTERNAL_DRAFT_NOT_ISSUED"};
 }
 // Freeze the actual generated files as well as the model. Original imported
 // quotation stays authoritative; today's generated detail is labelled internal.
 if(model&&breakdown){
  const bytes=Uint8Array.from(atob(template.base64),c=>c.charCodeAt(0));
  const file={name:template.sourceName,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.length)};
  artifacts.push(await makeArtifact({id:"source-export-template",filename:template.sourceName,mimeType:mime,audience:"INTERNAL",bytes}));
  for(const [id,out] of [["captured-scope",await buildNativeOfficialRelease0553(file,model)],
   ["captured-breakdown",await buildNativePriceBreakdown0553(file,model,breakdown)]]){
   artifacts.push(await makeArtifact({id,filename:out.filename,mimeType:mime,audience:"INTERNAL",bytes:new Uint8Array(await out.blob.arrayBuffer())}));
  }
 }
 return createBaseline({scope:QUOTATION_SCOPE_0553,label,actor,createdAt,snapshot:json(snapshot),artifacts});
}
