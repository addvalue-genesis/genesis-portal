import {ceragonSupersededOffer0550} from './ceragonSelection0550';
import {towerC1Reference0550} from './towerTenderScope0550';
import {mgwDetailGroup0550} from './mgwDetailPricing0550';
import {currentSupplierOffers0550,mgwWorkingLineExcluded0550,mgwProjectWideLineConflict0550} from './mgwVendorBasis0550';
import {satelliteScope0550} from './satelliteScope0550';
import {RETIRED_TOWER_OFFER_0550,RETIRED_TOWER_OWNER_0550} from './towerLegacyPricing0550';
// One Working cost owner may have many supplier detail references. Never add prices here.
export function workingOffers0550(data,line){
 if(line.id===RETIRED_TOWER_OWNER_0550||line.offerId===RETIRED_TOWER_OFFER_0550||ceragonSupersededOffer0550(data,line.offerId))return [];
 const offer=line.offerId?data.offers.find(o=>o.id===line.offerId):undefined;
 if(mgwWorkingLineExcluded0550(data,line,offer)||mgwProjectWideLineConflict0550(line,offer))return [];
 if(line.offerId)return offer?[offer]:[];
 if(!line.mgwDetailGroupId)return [];
 const rowIds=mgwDetailGroup0550(line.mgwDetailGroupId)?.rowIds||[];
 return currentSupplierOffers0550(data,line.systemToken).filter(o=>rowIds.includes(o.mgwQuoteLineId));
}
export const activeSupply0550=line=>line.id!==RETIRED_TOWER_OWNER_0550&&line.offerId!==RETIRED_TOWER_OFFER_0550&&line.selected&&!towerC1Reference0550(line)&&!line.coveredByLineId&&line.responsibility!=='COMPANY'&&!satelliteScope0550(line).excluded;
