// PJ2608-0553 B1 presentation-only nested Module IDs; not price/cost accounts.
// Shared by 10.2 React view and Project Module Navigator to avoid anchor drift.
export const B1_ACCORDION_ROOT_0553="bid.budget.working.bc.b1";
export const b1AccountModuleId0553=account=>
 B1_ACCORDION_ROOT_0553+".account."+String(account).toLowerCase().replace(".","-");
export const b1AccountLineModuleId0553=(account,lineId)=>
 b1AccountModuleId0553(account)+".line."+String(lineId).toLowerCase();
export const b1AuditModuleId0553=kind=>B1_ACCORDION_ROOT_0553+".audit."+kind;
export const B1_AUDIT_KINDS_0553=Object.freeze([
 "role-rates","revk-events","engineering-review","indirect-ledger","source-audit"
]);
