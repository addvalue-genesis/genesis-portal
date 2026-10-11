// Project-specific canonical component references. Navigation numbers are only aliases.
export const BUDGET_COMPONENTS_0553=Object.freeze([
 {key:"bid.budget",alias:"BID-BUD",file:"CommercialWorkspace.jsx",parent:null},
 {key:"bid.budget.internal",alias:"BID-BUD-SUM",file:"InternalBudgetShortcut0553.jsx",parent:"bid.budget"},
 {key:"bid.budget.summary",alias:"BID-BUD-SUM-MR",file:"InternalBudgetShortcut0553.jsx",parent:"bid.budget.internal"},
 {key:"bid.budget.bulk",alias:"BID-BUD-BLK",file:"BulkTakeoff0553.jsx",parent:"bid.budget.internal"},
 {key:"bid.budget.scope",alias:"BID-BUD-SOS",file:"ScopeSheetsDetail0553.jsx",parent:"bid.budget"},
 {key:"bid.budget.bom",alias:"BID-BUD-BOM",file:"SimpleBom0553.jsx",parent:"bid.budget"},
 {key:"bid.budget.mapping",alias:"BID-BUD-MAP",file:"EstimateToBidMapping0553.jsx",parent:"bid.budget"},
 {key:"bid.budget.pricing",alias:"BID-BUD-PRC",file:"CommercialWorkspace.jsx",parent:"bid.budget"}
]);
export function getBudgetComponent0553(key){return BUDGET_COMPONENTS_0553.find(x=>x.key===key)||null;}
