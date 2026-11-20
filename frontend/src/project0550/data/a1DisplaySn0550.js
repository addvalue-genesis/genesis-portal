// Display numbering for Schedule A1, used on internal screens AND on the exports
// that match those screens (Volume I Excel A1 sheet / 11.A1 table via scheduleTable0550).
// The official customer Word form (exhibitCNativeTemplate0550.json,
// buildNativeExhibitDocx0550 / nativeExhibitHtml0550) keeps the form S/N text, which
// has SN 5 twice (C-3 option and C-5 tools), no SN 7 and "…" for Others.
// displaySn is sequential (1-10). Rows are still found by template row (a1SummarySlot0550);
// this helper only changes labels and never affects prices, roll-ups or owners.
import contract from './scheduleA1SharedContract0550.json';

const byRow=new Map(contract.snMap.map(row=>[row.templateRow,row]));

// templateRow is the value returned by a1SummarySlot0550 (2-11).
export const a1DisplayRow0550=templateRow=>byRow.get(templateRow)||null;
export const a1DisplaySn0550=templateRow=>{const sn=byRow.get(templateRow)?.displaySn;return sn==null?null:Number(sn);};
export const a1FormSn0550=templateRow=>byRow.get(templateRow)?.sn??null;

// Example: "#6 · Special Tools for Commissioning and Maintenance (form S/N 5)".
export function a1InternalLabel0550(templateRow,title){
 const row=byRow.get(templateRow);
 if(!row)return title||'A1 row '+templateRow;
 return '#'+row.displaySn+' · '+(title||row.title)+' (form S/N '+row.sn+')';
}
