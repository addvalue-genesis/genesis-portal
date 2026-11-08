import {mgwCurrentOffer0550} from './mgwQuoteSelection0550';

const switches='https://www.cisco.com/c/en/us/products/collateral/switches/';
const wireless='https://www.cisco.com/c/en/us/products/collateral/wireless/';
const reliability=new Map([
 ['C9200-48P-A',{mtbf:375570,source:switches+'catalyst-9200-series-switches/nb-06-cat9200-ser-data-sheet-cte-en.pdf',locator:'Cisco C9200-48P · Table 12'}],
 ['C9300-48P-A',{mtbf:277770,source:switches+'catalyst-9300-series-switches/nb-06-cat9300-ser-data-sheet-cte-en.html',locator:'Cisco C9300-48P · MTBF table'}],
 ['C9500-48Y4C-A',{mtbf:316960,source:switches+'catalyst-9500-series-switches/nb-06-cat9500-ser-data-sheet-cte-en.html',locator:'Cisco C9500-48Y4C · MTBF table'}],
 ['C9105AXI-H',{mtbf:614054,source:wireless+'catalyst-9100ax-access-points/guide-c07-744444.html',locator:'Cisco 9105AXI · 40°C scenario'}],
 ['9800-L-C-K9',{mtbf:100000,source:wireless+'catalyst-9800-series-wireless-controllers/nb-06-cat9800-ser-wirel-faq-ctp-en.html',locator:'Cisco C9800-L · MTBF FAQ'}],
]);

function quoteItem(offer){
 const terms=mgwCurrentOffer0550(offer)?offer.quoteEvidence.terms||[]:[];
 const [description='',rawPart='']=terms[0]?.split('|').map(part=>part.trim())||[];
 const partNo=/^[A-Z0-9]+(?:[-/.][A-Z0-9]+)+$/i.test(rawPart)?rawPart:'';
 const perSet=Number(description.match(/^~\s*(\d+)\s*[×x]\s*/i)?.[1])||null;
 return {partNo,perSet,components:terms,reliability:reliability.get(partNo)};
}

// The Working line remains the quantity owner. The source package provides
// the identity and component multiplier, plus a comparison to quoted qty.
export function lanStockBasis0550(data,model){
 const working=model.provisional||model,offers=new Map(data.offers.map(offer=>[offer.id,offer]));
 const lines=working.lines.filter(line=>line.wbs==='A'&&line.systemToken==='TEL-LAN');
 const selectedOfferUses=new Map();
 const isOwner=line=>line.selected&&!line.historicalMgwPackage&&!line.mrScopeState?.covered&&!line.mrScopeState?.excluded&&!line.coveredByLineId&&!line.bidPriceAllocation&&line.responsibility!=='COMPANY';
 for(const line of lines)if(line.offerId&&isOwner(line))selectedOfferUses.set(line.offerId,(selectedOfferUses.get(line.offerId)||0)+1);
 const stock=new Map();
 const rows=lines.map(line=>{
  const offer=offers.get(line.offerId),item=quoteItem(offer);
  const selected=isOwner(line),duplicate=selectedOfferUses.get(line.offerId)>1;
  const canCount=selected&&!duplicate&&Number.isSafeInteger(line.quantity)&&line.quantity>0&&['U','Pc','SET'].includes(line.unit)&&line.unit===offer?.unit&&Number.isSafeInteger(line.quantity*item.perSet)&&item.perSet>0;
  const installed=canCount?line.quantity*item.perSet:null;
  if(selected&&item.reliability){
   const group=stock.get(item.partNo)||{name:'LAN · Cisco '+item.partNo,...item.reliability,count:0};
   group.count=group.count===null||installed===null?null:group.count+installed;
   stock.set(item.partNo,group);
  }
  return {line,offer,...item,selected,duplicate,installed};
 });
 const linkedOffers=new Set(rows.map(row=>row.offer?.id));
 const unlinked=data.offers.filter(offer=>mgwCurrentOffer0550(offer)&&offer.quoteEvidence.systemTokens.includes('TEL-LAN')&&!linkedOffers.has(offer.id)).map(offer=>({offer,...quoteItem(offer)}));
 return {rows,unlinked,stock:[...stock.values()]};
}
