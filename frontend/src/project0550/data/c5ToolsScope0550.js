// BID-FLOW: CUS ↔ VND → SI A/B/C → Release → Volume I (A1 A2 C1–C8 D E F M) / II / III
// TOOLS-SCOPE (Schedule C5 Special Tools): tool TYPES required by the systems selected in Working A.
// Read-only projection. It writes no Working line, price owner, allocation, A1/A2 total or history, and
// no brand, quantity or price exists until a 07 Vendor Offer does. The type list is data
// (toolsScope0550.json), DRAFT / unverified. This is not an entry in EQUATION_INPUTS: those fields are numeric.
import toolsScope from './toolsScope0550.json';

export const C5_TOOLS_DRAFT_NOTE_0550='Tool type from system scope — brand, model, quantity and price OPEN until 07 Vendor Offer. Draft: not allocated to Schedule C5; does not enter A1/A2 totals until bound in 11.M.';

export function toolsScopeForSystems0550(systemTokens){
 const tokens=[...new Set((systemTokens||[]).filter(t=>t&&t!=='COMMON'))];
 if(!tokens.length)return [];
 const tools=new Map();
 const add=(name,token)=>{
  if(!tools.has(name))tools.set(name,{name,systems:[]});
  const tool=tools.get(name);
  if(!tool.systems.includes(token))tool.systems.push(token);
 };
 for(const token of tokens)for(const name of toolsScope.bySystem[token]||[])add(name,token);
 for(const name of toolsScope.common)add(name,'COMMON');
 return [...tools.values()];
}

// Same Working A selection rules as spareEquationDraftRows0550: selected, not covered by another owner,
// not COMPANY-responsibility, not excluded by MR / satellite scope.
export function c5SelectedSystems0550(data,model){
 const shown=new Map((model?.provisional?.lines||model?.lines||[]).map(l=>[l.id,l]));
 const tokens=new Set();
 for(const raw of data?.lines||[]){
  const line=shown.get(raw.id)||raw;
  if(raw.wbs!=='A'||raw.selected!==true||line.selected===false||raw.coveredByLineId||raw.responsibility==='COMPANY'||
   line.mrScopeState?.covered||line.mrScopeState?.excluded||line.satelliteScopeState?.excluded)continue;
  if(raw.systemToken&&raw.systemToken!=='COMMON')tokens.add(raw.systemToken);
 }
 return [...tokens];
}

export function c5EquationDraftRows0550(data,model){
 const slug=name=>name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 return toolsScopeForSystems0550(c5SelectedSystems0550(data,model)).map(tool=>({
  id:'C5-TOOL-'+slug(tool.name),description:tool.name,systems:tool.systems,
  quantity:null,unit:null,unitCost:null,totalCost:null,currency:null,
  source:'BID-FLOW / TOOLS-SCOPE / 10.2 Working A · '+tool.systems.join(', '),
  note:C5_TOOLS_DRAFT_NOTE_0550,status:'DRAFT_FROM_SCOPE',equationDraft:true,nonAdditive:true,priceOwner:false}));
}

export const c5UnmappedSystems0550=tokens=>tokens.filter(token=>!toolsScope.bySystem[token]);
