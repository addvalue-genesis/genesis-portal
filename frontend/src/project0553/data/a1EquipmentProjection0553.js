// Read-only A1 equipment cost coverage from canonical working BOM.
// No customer sell prices are created here. No historical Rev08 substitution.
import {BOM_READ_MODEL_0553,bomItems0553} from "./bomReadModel0553";
import {WORKING_BOM_BY_LOCATION_0553} from "./workingBomByLocation";
import {RFI_LNA_PRICE_DECISION_0553} from "./rfiLnaPriceDecision0553";
export function deriveA1EquipmentCoverage0553(){
 const seen=new Set(),items=[];
 for(const group of BOM_READ_MODEL_0553.rows){
  for(const item of bomItems0553(group)){
   const key=group.site+"|"+group.mr+"|"+item.row+"|"+item.tag;
   if(seen.has(key))continue;seen.add(key);
   items.push({site:group.site,mr:group.mr,tag:item.tag,row:item.row,description:item.description,
    qty:item.sourceQty,unit:item.sourceUnit,currency:item.currency,unitCost:item.unitCost,extended:item.extended,
    status:item.status,source:"DETAILED_COST_LEDGER"});
  }
 }
 for(const location of WORKING_BOM_BY_LOCATION_0553.locations){
  for(const item of location.items){
   const key=location.site+"|MR-0001|"+item.sourceRow+"|"+item.sourceTag;
   if(seen.has(key))continue;seen.add(key);
   items.push({site:location.site,mr:"MR-0001",tag:item.sourceTag,row:item.sourceRow,
    description:item.description,qty:item.sourceScopeQty,unit:item.sourceScopeUnit,
    currency:Number.isFinite(item.indicativePackageCostTHB)?"THB":null,
    unitCost:Number.isFinite(item.indicativePackageCostTHB)&&Number.isFinite(item.sourceScopeQty)&&item.sourceScopeQty>0?item.indicativePackageCostTHB/item.sourceScopeQty:null,
    extended:item.indicativePackageCostTHB,status:item.workingPriceStatus,
    source:"MTO_WORKING_SCOPE"});
  }
 }
 // User-approved temporary zero for missing RFI LNA vendor price. 
 // Keep as an unallocated control row until MR-0002 site quantity is reconciled.
 const lna=RFI_LNA_PRICE_DECISION_0553;
 items.push({site:"UNALLOCATED",mr:lna.mr,tag:lna.model,row:null,
  description:lna.product,qty:lna.quantity,unit:"set",currency:lna.currency,
  unitCost:lna.unitBudgetAllowance,extended:null,status:lna.status,
  source:lna.decisionSource,temporaryZero:true});
 const currencies=[...new Set(items.filter(x=>Number.isFinite(x.extended)&&x.currency).map(x=>x.currency))];
 const knownCost=currencies.map(currency=>({currency,amount:Math.round(items.filter(x=>x.currency===currency&&Number.isFinite(x.extended)).reduce((v,x)=>v+x.extended,0)*100)/100}));
 return {items,knownCost,siteCount:new Set(items.filter(x=>x.site!=="UNALLOCATED").map(x=>x.site)).size,
  pricedCount:items.filter(x=>Number.isFinite(x.extended)).length,unpricedCount:items.filter(x=>!Number.isFinite(x.extended)).length,
  coverage:"PARTIAL_WORKING_COST_ONLY",customerSellUSD:null,approved:false,releaseAllowed:false,reason:"No approved item-to-A1 customer sell mapping; known vendor working costs are not selling prices."};
}
