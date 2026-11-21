// ADDVALUE-to-SAMTEL engineering service markup.
// ADDVALUE cost (Item 7 VND) is ADDVALUE's actual selling price.
// Release = Item 7 × SAMTEL_ENGINEERING_SERVICE_MARKUP_0553.
// The direction is add-on-top. Do not change this factor into a deduction.
// priceBWorkingSell0553 deducts 5% from an already-customer working sell and
// must not be used for this markup.
export const SAMTEL_ENGINEERING_SERVICE_MARKUP_0553=1.05;
// Service lines are ADDVALUE engineering services. Goods lines stay on the
// existing working-sell customer price and are not marked up by this factor.
export const PART_B_COMMERCIAL_CATEGORY_0553=Object.freeze({
 B1:"service",B2:"service",B3:"service",B4:"service",B5:"service",
 B6:"service",B7:"service",B8:"service",B9:"service",
 B10:"goods",B11:"goods",B12:"goods",B13:"goods",
 B14:"service"
});
const roundMoney=n=>Math.round((n+Number.EPSILON)*100)/100;
export function priceSamtelEngineeringServiceRelease0553(workingSellTHB){
 if(typeof workingSellTHB!=="number"||!Number.isFinite(workingSellTHB))
  return Object.freeze({item7CostTHB:null,samtelServiceTHB:null,releaseTHB:null,customerSellTHB:null,addvalueReceivableTHB:null});
 const item7=roundMoney(workingSellTHB);
 const release=roundMoney(item7*SAMTEL_ENGINEERING_SERVICE_MARKUP_0553);
 const samtel=roundMoney(release-item7);
 if(release<item7)throw Error("SAMTEL engineering service markup must add on top of Item 7");
 return Object.freeze({
  item7CostTHB:item7,samtelServiceTHB:samtel,releaseTHB:release,
  customerSellTHB:release,addvalueReceivableTHB:item7
 });
}
