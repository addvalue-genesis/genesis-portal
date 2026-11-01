// User direction 29-Oct-2026: continue from repository JSON, without requiring
// an exported browser workspace. Carry forward only an entirely blank FX basis.
// Existing values, deliberate edits after preparation, and frozen issues survive.
export const REPOSITORY_BID_BASIS_VERSION_0550="0550-repository-basis-20261029-1";
export const EUR_THB_WORKING_BASIS_0550={version:"0550-eur-thb-owner-20261101-1",rate:38.0127,date:"2026-10-30",url:"https://www.bot.or.th/en/home.html",source:"Bank of Thailand / average commercial-bank SELLING / EUR / 2026-10-30"};
// Owner requested THB conversion on 1-Nov. Fill a missing EUR leg once; retain
// every existing rate and intentional later clearing, including after reload.
export function prepareAuthorizedEurThb0550(data,today){
 if(today<"2026-11-01"||!data.repositoryBasisImport||data.repositoryBasisImport.eurThbConversionVersion===EUR_THB_WORKING_BASIS_0550.version)return data;
 if(data.projectId!=="PJ2608-0550")throw Error("EUR conversion project mismatch");
 const b=EUR_THB_WORKING_BASIS_0550,source=[data.fx.source,`Owner decision 2026-11-01: convert EUR to THB. ${b.source}; 1 EUR = ${b.rate} THB. ${b.url}. Working reference only, not a booked bank transaction. Other currency legs and their original dates retained.`].filter(Boolean).join("\n");
 const apply=data.fx.thbPerEUR===null&&source.length<=4000;
 return {...data,...(apply?{fx:{...data.fx,thbPerEUR:b.rate,date:data.fx.date||b.date,source}}:{}),repositoryBasisImport:{...data.repositoryBasisImport,eurThbConversionVersion:b.version}};
}
export function prepareRepositoryBidBasis0550(data,dataset,today){
 if(data.repositoryBasisImport?.version===REPOSITORY_BID_BASIS_VERSION_0550)return data;
 if(dataset.meta.projectCode!==data.projectId||dataset.meta.datasetId!==data.baselineSnapshotId)throw Error("Repository pricing basis project/snapshot mismatch");
 const blank=data.fx.thbPerUSD===null&&data.fx.thbPerEUR===null&&data.fx.date===""&&data.fx.source==="";
 const rate=dataset.budgetaryEstimate.fxThbUsdWorking,date=dataset.meta.snapshotDate;
 const usable=typeof rate==="number"&&Number.isFinite(rate)&&rate>0&&/^\d{4}-\d{2}-\d{2}$/.test(date)&&date<=today;
 const inherited=blank&&usable;
 return {...data,...(inherited?{fx:{...data.fx,thbPerUSD:rate,date,source:`Repository JSON / ${dataset.meta.datasetId} / historical planning FX carried forward; not a current market quote`}}:{}),
  repositoryBasisImport:{version:REPOSITORY_BID_BASIS_VERSION_0550,snapshotId:dataset.meta.datasetId,preparedOn:today,fxInherited:inherited}};
}
