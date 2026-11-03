exports.parent=row=>{
 const copy={...row};if(Object.hasOwn(copy,'preTensAmountUSD'))copy.amountUSD=copy.preTensAmountUSD;
 delete copy.preTensAmountUSD;return copy;
};
exports.rows=rows=>rows.map(row=>{
 const copy={...row};if(Object.hasOwn(copy,'preTensUnitUSD'))copy.unitUSD=copy.preTensUnitUSD;
 if(Object.hasOwn(copy,'preTensTotalUSD'))copy.totalUSD=copy.preTensTotalUSD;
 if(Object.hasOwn(copy,'preTensTotalUSD')&&Number.isFinite(copy.sourceTotalUSD))copy.roundingAdjustmentUSD=Math.round((copy.totalUSD-copy.sourceTotalUSD)*100)/100;
 delete copy.preTensUnitUSD;delete copy.preTensTotalUSD;return copy;
});
