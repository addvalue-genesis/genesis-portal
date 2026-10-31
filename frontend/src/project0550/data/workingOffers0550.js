import {mgwDetailGroup0550} from './mgwDetailPricing0550';
import {satelliteScope0550} from './satelliteScope0550';
// One Working cost owner may have many supplier detail references. Never add prices here.
export const workingOffers0550=(data,line)=>line.offerId?data.offers.filter(o=>o.id===line.offerId):line.mgwDetailGroupId?data.offers.filter(o=>mgwDetailGroup0550(line.mgwDetailGroupId)?.rowIds.includes(o.mgwQuoteLineId)):[];
export const activeSupply0550=line=>line.selected&&!line.coveredByLineId&&line.responsibility!=='COMPANY'&&!satelliteScope0550(line).excluded;
