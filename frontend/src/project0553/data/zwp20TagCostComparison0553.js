// Read-only audited comparison of the SAME controlled MAP-01..MAP-10 details.
// Four cost owners share nine vendor source lines; only B-1..B-5 belong to ODU.
// Never reinterpret quotation-wide quantities as engineering purchase quantities.
const cents=n=>Math.round((n+Number.EPSILON)*100)/100;
export function summarizeZWP20TagCostComparison0553(audit){
 const details=Array.isArray(audit?.details)?audit.details:[];
 const ledgerByOwner=new Map((audit?.ownerReconciliation||[]).map(x=>[x.id,x]));
 const ownerOrder=["MR-502-001.4","MR-502-001A.5","SA-502-001.10","ANT-502-001.6"];
 const owners=ownerOrder.map(ownerId=>{
  const lines=details.filter(x=>x.costOwner===ownerId).map(x=>{
   // A quoted dash is never a supplier price of zero. A zero incremental
   // management assumption is shown separately and is NOT compliance evidence.
   const quoted=Number.isFinite(x.sourceUnitPriceUSD);
   const managementOnly=!quoted&&x.managementZeroAssumption===true&&x.mappingRateUSD===0;
   const rate=quoted?x.sourceUnitPriceUSD:managementOnly?0:null;
   const qty=Number.isFinite(x.engineeringQty)?x.engineeringQty:null;
   const siteExtendedUSD=Number.isFinite(rate)&&Number.isFinite(qty)?cents(qty*rate):null;
   const mapped=Number.isFinite(x.mappingExtendedUSD)?x.mappingExtendedUSD:null;
   return {code:x.quoteLine,partNumber:x.partNumber,costOwner:x.costOwner,
    sourceMatch:x.sourceMatch===true,engineeringQty:qty,
    sourceQuoteQty:x.sourceQuoteQty??null,quotedSourceTotalUSD:Number.isFinite(x.sourceQuotedLineTotalUSD)?x.sourceQuotedLineTotalUSD:null,
    sourceUnitPriceUSD:quoted?rate:null,workingRateUSD:rate,siteExtendedUSD,
    mappedExtendedUSD:mapped,rateState:quoted?"SOURCE_UNIT_RATE":managementOnly?"MANAGEMENT_ZERO_INCREMENT_NOT_VENDOR_QUOTE":"NO_SOURCE_RATE"};
  });
  const numeric=lines.every(x=>Number.isFinite(x.siteExtendedUSD));
  const computedUSD=lines.length&&numeric?cents(lines.reduce((n,x)=>n+x.siteExtendedUSD,0)):null;
  const ledger=ledgerByOwner.get(ownerId);
  const ledgerUSD=Number.isFinite(ledger?.ledgerUSD)?ledger.ledgerUSD:null;
  const differenceUSD=Number.isFinite(computedUSD)&&Number.isFinite(ledgerUSD)?cents(computedUSD-ledgerUSD):null;
  return {ownerId,quoteCodes:lines.map(x=>x.code),lines,computedUSD,ledgerUSD,differenceUSD,
   sourceMissing:lines.filter(x=>x.sourceUnitPriceUSD===null).map(x=>x.code),
   reconciled:lines.length>0&&lines.every(x=>x.sourceMatch)&&differenceUSD!==null&&Math.abs(differenceUSD)<=0.01&&ledger?.pass===true};
 });
 const selected=owners[0],others=owners.slice(1);
 const allNumerical=owners.every(x=>Number.isFinite(x.computedUSD));
 const all9USD=allNumerical?cents(owners.reduce((n,x)=>n+x.computedUSD,0)):null;
 const otherTagsUSD=others.every(x=>Number.isFinite(x.computedUSD))?cents(others.reduce((n,x)=>n+x.computedUSD,0)):null;
 const lines=owners.flatMap(x=>x.lines);
 const sourceWidePricedUSD=lines.length?cents(lines.reduce((n,x)=>n+(x.quotedSourceTotalUSD??0),0)):null;
 const vendorUnpriced=lines.filter(x=>x.sourceUnitPriceUSD===null).map(x=>x.code);
 const reconciled=audit?.status==="BUDGETARY_RECONCILED_WITH_QUALIFICATIONS"&&details.length===9&&
  owners.every(x=>x.reconciled);
 return {scope:"ZWP20 / MR-0001 / Next G Group B source subset",owners,
  selectedTagOwner:selected.ownerId,selectedTagUSD:selected.computedUSD,
  otherTagsUSD,all9USD,sourceWidePricedUSD,vendorUnpriced,
  sourceQuotedLines:lines.length,sourceComplete:vendorUnpriced.length===0,
  reconciled,releaseAllowed:false,
  note:"Quoted source line totals apply original offered quantities (mostly 3), not one ZWP20 engineering set. B-4 USD NULL remains unpriced by supplier; management USD 0 is an unverified incremental planning assumption."};
}
