// SINGLE scope transfer: legacy B3 Bangkok integrated FAT has been superseded by
// MGW China OEM FAT under Rev.K. ADDVALUE FAT witnesses/travel belong exclusively to B9.
// Source Rev05 WBS remains immutable for audit; current 10.2 Sell uses B3 net-of-FAT.
// Do NOT remove offshore SAT/SIT from B3.
export const B3_LEGACY_BKK_FAT_OWNER_TRANSFER_0553=Object.freeze({
 originalOwner:"B3",newOwner:"B9",wbs:"Rev.K K01",
 oldLocation:"SAMTEL Bangkok FAT (Rev05 superseded for current FAT budget)",
 newLocation:"MGW Office China (Rev.K; precise city/venue to confirm)",
 amountTHB:144000,source:"Rev05 B3 8 team-days x THB 18,000/team-day",
 postingRule:"DEDUCT_OLD_B3_FAT_AND_ESTIMATE_MGW_B9_FAT_ONCE",
 currentStatus:"MANAGEMENT_APPROVED_REV_K_FAT_SCOPE_REALLOCATION_PRE_AWARD",
 costOwnerSinglePosting:true
});
export function selectB3WorkingSellAfterChinaFat0553(originalB3SellTHB){
 if(!Number.isFinite(originalB3SellTHB)||originalB3SellTHB!==2109600)
  throw Error("Unexpected Rev05 B3 baseline; cannot transfer FAT without reconciliation");
 return originalB3SellTHB-B3_LEGACY_BKK_FAT_OWNER_TRANSFER_0553.amountTHB;
}
