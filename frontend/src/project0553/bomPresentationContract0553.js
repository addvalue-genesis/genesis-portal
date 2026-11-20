// PJ2608-0553 shared BOM presentation contract.
// Pure functions: never change price authority, FX, quantity, or posting ownership.
export const bomModuleId0553=({mr,site,itemId})=>{
 const m=String(mr||"").toLowerCase().replace(/-/g,"");
 const w=String(site||"").toLowerCase();
 const id=String(itemId||"").toLowerCase();
 return ["bid.budget.bom",m,w,id].filter(Boolean).join(".");
};
export const bomPriceTHB0553=(amount,currency,fx)=>{
 if(!Number.isFinite(amount))return {amount:null,label:"PENDING",state:"MISSING_PRICE"};
 if(currency==="THB")return {amount,label:"THB "+amount.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),state:"CONVERTED"};
 if(currency!=="USD")return {amount:null,label:"CURRENCY REVIEW",state:"UNSUPPORTED_CURRENCY"};
 if(!(Number.isFinite(fx?.thbPerUsd)&&fx.thbPerUsd>0))return {amount:null,label:"FX REQUIRED",state:"MISSING_FX"};
 const value=amount*fx.thbPerUsd;
 return {amount:value,label:"THB "+value.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),state:"CONVERTED"};
};
export const bomInclusion0553=item=>{
 const included=Boolean(item?.priceInclusion&&item?.parentPackage);
 return {included,additive:!included&&item?.countedInWorkingTotal===true,
  label:included?"INCLUDED IN "+(item.quoteLine||"VENDOR PACKAGE"):item?.status||"REVIEW",
  parentPackage:included?item.parentPackage:null};
};
export const bomEvidenceDisplay0553=(item,fx,quoteLines=[])=>{
 const inc=bomInclusion0553(item);
 if(!inc.included)return item?.countedInWorkingTotal?bomPriceTHB0553(item.extended,item.currency,fx).label:item?.displayPrice||"NOT ADDITIVE / TECHNICAL REVIEW";
 const parent=quoteLines.find(q=>q.id===item.quoteLine);
 return inc.label+" · "+(parent?("Package "+bomPriceTHB0553(parent.unitPriceUSD,"USD",fx).label):"PARENT PACKAGE RATE NOT LINKED")+" · No additional cost";
};
