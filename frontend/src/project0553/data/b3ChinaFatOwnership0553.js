// Historical Bangkok FAT was a B3 event. Current MGW FAT witness is ALSO B3, under the Scope of Supply B3 testing clause.
// B9 is ONLY additional Specialist Field Assistance; prior cross-owner B3 -> B9 decision is superseded.
// Do NOT remove offshore SAT/SIT from B3.
export const B3_LEGACY_BKK_FAT_OWNER_TRANSFER_0553=Object.freeze({
 originalOwner:"B3",newOwner:"B3",wbs:"Rev.K K01",
 oldLocation:"SAMTEL Bangkok FAT (Rev05 superseded for current FAT budget)",
 newLocation:"MGW Office China (Rev.K; precise city/venue to confirm)",
 amountTHB:144000,source:"Rev05 B3 8 team-days x THB 18,000/team-day",
 postingRule:"REPLACE_BKK_FAT_WITH_MGW_B3_FAT_ONCE_NO_B9_CROSSPOST",
 currentStatus:"HISTORICAL_BKK_FAT_REPLACED_IN_B3_NO_CROSS_OWNER_TRANSFER",
 costOwnerSinglePosting:true
});
export function selectB3WorkingSellAfterChinaFat0553(originalB3SellTHB){
 if(!Number.isFinite(originalB3SellTHB)||originalB3SellTHB!==2109600)
  throw Error("Unexpected Rev05 B3 baseline; cannot transfer FAT without reconciliation");
 return originalB3SellTHB-B3_LEGACY_BKK_FAT_OWNER_TRANSFER_0553.amountTHB;
}
