// INTERNAL-ONLY display numbering for Schedule A1.
// The official customer form (exhibitCNativeTemplate0550.json) and the official
// export keep the form S/N text, which has SN 5 twice (C-3 option and C-5 tools),
// no SN 7 and "…" for Others. Internal screens may show a sequential number
// (1-10) instead. Rows are still found by template row (a1SummarySlot0550);
// this helper only changes labels and never affects prices, roll-ups or owners.
import contract from './scheduleA1SharedContract0550.json';

const byRow=new Map(contract.snMap.map(row=>[row.templateRow,row]));

// templateRow is the value returned by a1SummarySlot0550 (2-11).
export const a1DisplayRow0550=templateRow=>byRow.get(templateRow)||null;
export const a1DisplaySn0550=templateRow=>byRow.get(templateRow)?.displaySn??null;
export const a1FormSn0550=templateRow=>byRow.get(templateRow)?.sn??null;

// Example: "#6 · Special Tools for Commissioning and Maintenance (form S/N 5)".
export function a1InternalLabel0550(templateRow,title){
 const row=byRow.get(templateRow);
 if(!row)return title||'A1 row '+templateRow;
 return '#'+row.displaySn+' · '+(title||row.title)+' (form S/N '+row.sn+')';
}
