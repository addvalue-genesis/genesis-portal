// Display aliases only. Never use these as record IDs, schema keys or cost owners.
export const WORKSPACE_ALIAS_TARGETS_0550=Object.freeze({
 cus:'l3.original',vnd:'bid.vendor.offers',si:'bid.working-preview',
 'si-req':'bid.working-preview.step.4','si-bom':'bid.working-preview.step.5',
 'si-act':'bid.working-preview.step.6','si-cost':'bid.budget.working.lines',
 'si-rel':'bid.budget.release','si-out':'bid.quotation',
 ...Object.fromEntries(Array.from({length:8},(_,i)=>['si-wp-'+String(i+1).padStart(2,'0'),'bid.working-preview.step.'+(i+1)]))
});
export function workspaceAlias0550(id=''){
 const wp=id.match(/^bid\.working-preview\.step\.(\d+)$/);
 if(wp)return 'SI-WP-'+wp[1].padStart(2,'0');
 if(id==='l3.original'||id.startsWith('bid.documents.controlled-source-inventory'))return 'CUS';
 if(id==='l3.submissions')return 'COM';
 if(id.startsWith('bid.vendor')||id==='bid.documents')return 'VND';
 if(id==='bid.execution')return 'SI-ACT';
 if(id==='bid.systems')return 'SI-REQ';
 if(id==='bid.engineering')return 'SI-CAL';
 if(id==='bid.schematic')return 'SI-ARCH';
 if(id==='bid.registry')return 'SI-TRACE';
 if(id.startsWith('bid.deviations'))return 'SI-DEV';
 if(id.startsWith('bid.quotation'))return 'SI-OUT';
 if(id.startsWith('bid.budget.working')||id==='bid.budget')return 'SI-COST';
 if(id.startsWith('bid.budget.release'))return 'SI-REL';
 if(id.startsWith('bid.working-preview.requirement'))return 'SI-REQ';
 if(id.startsWith('bid.working-preview.activity'))return 'SI-ACT';
 if(id.startsWith('bid.working-preview.proof'))return 'SI-CAL';
 if(id.startsWith('bid.technical'))return 'SI-TECH';
 if(id.startsWith('bid.commercial'))return 'SI-COM';
 return 'SI';
}
