// PJ2608-0553 / 10 Budgetary A5 Attribution — pure/read-only.
import MTO from "./snapshots/mr0001.mto.rev04.sourceRows.json";
import {selectMR0001TagCostRows0553} from "./mr0001TagCostLedger0553";
import {deriveWpSystemBulkBudget0553} from "./wpSystemBulkBudget0553";
import {deriveScadaBulkVerification0553} from "./scadaBulkQuantityVerification0553";
const round=n=>Math.round(n*100)/100;
const normalized=s=>String(s||"").trim().replace(/\s+/g," ").toUpperCase();
const originalSites=[...new Set(MTO.itemRows.map(x=>x.platform))];
const sourceBulk=MTO.itemRows.filter(r=>normalized(r.sourcePartText)==="BULK MATERIAL");
const INNOVA_SOURCE="INNOVA QA24-0604";

/** Verified as a partial WORKING COST attribution, never a complete supply quotation. */
export function deriveA5BulkAttribution0553({ledgers=null,bulkSources=null}={}){
 const allLedgers=ledgers||Object.fromEntries(originalSites.map(site=>[site,selectMR0001TagCostRows0553(site)]));
 const externalBulk=bulkSources||deriveWpSystemBulkBudget0553();
 const scadaAudit=deriveScadaBulkVerification0553();
 const problems=[],rows=[],sourceKeys=new Set();
 const registerError=(sourceRow,message)=>problems.push({site:sourceRow?.platform||null,
  sourceRow:sourceRow?.sourceRowIndex??null,tag:sourceRow?.sourcePartText||null,message});
 if(sourceBulk.length!==originalSites.length)registerError(null,"Missing or duplicate source Bulk Material MTO rows relative to original sites");
 for(const sourceRow of sourceBulk){
  const key=sourceRow.platform+"|"+sourceRow.sourceRowIndex+"|"+normalized(sourceRow.sourcePartText);
  if(sourceKeys.has(key))registerError(sourceRow,"Duplicate MTO Bulk source identity");
  sourceKeys.add(key);
  const matches=(allLedgers[sourceRow.platform]||[]).filter(r=>
    r.row===sourceRow.sourceRowIndex&&normalized(r.tag)===normalized(sourceRow.sourcePartText));
  if(matches.length!==1){registerError(sourceRow,"Original MTO Bulk site/TAG/row has no unique cost-owner match");continue}
  const ledger=matches[0];
  if(!ledger.countedInWorkingTotal||ledger.currency!=="THB"||!Number.isFinite(ledger.extended)){
   registerError(sourceRow,"Bulk MTO row lacks a booked, THB-denominated working cost");
   continue;
  }
  // ZWP20 source uses quantity/rateTHB; other ledgers use qty/unitPrice.
  // Normalize read-only and compare every original extended amount before reclassification.
  const pricedComponents=(ledger.components||[]).filter(c=>Number.isFinite(c.extended))
   .map(c=>({...c,qty:c.qty??c.quantity??null,unitPrice:c.unitPrice??c.rateTHB??null}));
  const knownSku=component=>String(component.sku||"").toUpperCase();
  const cat6=pricedComponents.filter(c=>(/CAT6A|TECKNIKABEL/.test(knownSku(c)))&&c.qty===69&&c.unitPrice===524&&c.extended===36156);
  const gland=pricedComponents.filter(c=>/501\/453\/UNIV\/A\/M20/.test(knownSku(c))&&c.qty===1&&c.unitPrice===1020&&c.extended===1020);
  const componentsTotal=round(pricedComponents.reduce((n,c)=>n+c.extended,0));
  const totalMatches=pricedComponents.length===2&&cat6.length===1&&gland.length===1&&
    componentsTotal===round(ledger.extended)&&sourceRow.sourceQty===1&&sourceRow.sourceUnit==="Lot";
  if(!totalMatches){
   registerError(sourceRow,"Cannot independently reconcile historical CAT6A and M20 source components to booked Bulk amount; DO NOT reclassify");
   continue;
  }
  const isBrownfield=["ZPQ","ZWP8","ZWP11"].includes(sourceRow.platform);
  rows.push({
   site:sourceRow.platform,mr:"MR-0001",tag:sourceRow.sourcePartText,
   sourceRow:sourceRow.sourceRowIndex,sourceMTO:MTO.source.file,
   costOwner:"bid.budget.bom."+sourceRow.platform.toLowerCase()+".bulk-material."+sourceRow.sourceRowIndex,
   components:pricedComponents.map(c=>({sku:c.sku,qty:c.qty,unit:c.qty===69?"m":"set",
    rateTHB:c.unitPrice,extendedTHB:c.extended,source:c.source||ledger.source})),
   workingCostTHB:round(ledger.extended),currency:"THB",source:ledger.source,
   status:isBrownfield?"BROWNFIELD_REPLACEMENT_EQUIVALENT_SCENARIO_NOT_MEASURED":"GREENFIELD_WORKING_BUDGET__NOT_MEASURED",
   originalBookOwner:"A1 / MR0001 Site TAG Bulk MTO",scopeAllocationOwner:"A5 / Bulk materials and accessories",
   reclassificationOnly:true,qualified:true
  });
 }
 // Never treat a standalone Bulk preview as additional when it mirrors the same
 // physical CAT6A/Gland demand, nor give a zero amount to missing RF/Phone/RACON rates.
 const externalRows=externalBulk.flatMap(site=>site.systems.flatMap(system=>
   system.items.map(r=>({...r,site:site.wp,system:system.id}))));
 const mirrors=externalRows.filter(r=>r.system==="SCADA_RADIO"&&
   ["SCADA-CAT6A","SCADA-RJ45-WEIDMULLER"].includes(r.id));
 const unresolved=externalRows.filter(r=>!Number.isFinite(r.extendedTHB)&&
   r.owner!=="DATO_ROW8_INCLUDED_IN_BUDGET__NOT_ADDITIVE").map(r=>({
    site:r.site,system:r.system,id:r.id,item:r.item,qty:r.qty,
    rateTHB:r.rateTHB??null,source:r.source,owner:r.owner,status:r.status
   }));
 const unknownScadaAccessories=scadaAudit.flatMap(s=>s.rows
   .filter(row=>row.provisionalExtendedTHB===null&&row.budgetBucket==="CONDITIONAL_ACCESSORY_ALLOWANCE")
   .map(row=>({site:s.site,system:"SCADA_RADIO",id:row.id,
    item:row.item,qty:row.derivedQty,rateTHB:row.unitRateTHB,
    source:row.rateSource||row.source,owner:row.decision,status:row.quantityState})));
 // Existing external system rows with rates are NOT adopted until cost owner
 // can be certified as independent from A1/A2/A3/A4.
 const otherPricedCandidates=externalRows.filter(r=>r.system!=="SCADA_RADIO"&&
   Number.isFinite(r.extendedTHB)&&r.owner!=="DATO_ROW8_INCLUDED_IN_BUDGET__NOT_ADDITIVE");
 const totalReclassified=round(rows.reduce((n,x)=>n+x.workingCostTHB,0));
 const complete=problems.length===0&&rows.length===sourceBulk.length;
 return {
  projectId:"PJ2608-0553",moduleId:"bid.budget.scope.a5",
  a5PriceTHB:complete?totalReclassified:null,
  a1CostToReclassifyTHB:complete?totalReclassified:null,
  rowCount:rows.length,expectedMtoBulkLots:sourceBulk.length,siteCount:originalSites.length,
  source:MTO.source.file+" / "+INNOVA_SOURCE,
  rows,mirrorRows:mirrors,unresolved,unknownScadaAccessories,otherPricedCandidates,problems,
  state:complete?"PARTIAL_WORKING_PRICED_BULK__RECLASS_FROM_A1":"COST_OWNER_RECONCILIATION_FAILED",
  priceComplete:false,customerUnitPriceApproved:false,
  additionalCostPostedTHB:0,ledgerMutation:false,
  noDuplicateControl:"A5 booked THB is transferred out of displayed A1 only. It is NOT added to the original MR0001 Cost Ledger. Standalone mirror and other-system provisional candidates not added."
 };
}
