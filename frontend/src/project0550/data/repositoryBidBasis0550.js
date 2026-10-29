// User direction 29-Oct-2026: continue from repository JSON, without requiring
// an exported browser workspace. Carry forward only an entirely blank FX basis.
// Existing values, deliberate edits after preparation, and frozen issues survive.
export const REPOSITORY_BID_BASIS_VERSION_0550="0550-repository-basis-20261029-1";
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
