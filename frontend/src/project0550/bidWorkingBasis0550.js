// Read existing project bases without promoting historical amounts to current bid inputs.
// These helpers only prepare editor drafts. Saved lines and review fingerprints are unchanged.
import {EQUATION_INPUTS,bidQuantityUnit0550,evaluateServiceEquation} from "./serviceEquationRuntime";
export const GOODS_POLICY_TITLE_0550="Goods / Procured Cost";
export const LEGACY_GOODS_FORMULA_0550="Customer = Cost × (1 + 20% SAMTEL) / (1 - 5% ADDVALUE final margin)";
export const GOODS_SELL_BASIS_0550=Object.freeze({sellMode:"MARKUP",markupPct:5,contingencyPct:5,marginPct:null,sellRate:null,primePct:20});
const {markupPct,contingencyPct,primePct}=GOODS_SELL_BASIS_0550;
export const GOODS_FORMULA_0550=`Customer = Cost × (1 + ${markupPct}% ADDVALUE markup + ${contingencyPct}% shortage contingency) × (1 + ${primePct}% SAMTEL)`;

export function matchesLegacyGoodsBasis0550(line) {
 return line.sellMode==="MARGIN"&&line.marginPct===5&&line.primePct===20&&line.markupPct==null&&line.sellRate==null&&line.contingencyPct===undefined;
}

export function applyGoodsSellBasis0550(line) {
 return {...line,...GOODS_SELL_BASIS_0550};
}

export function matchesWorkingDefault0550(line,original) {
 if(!line||!original)return false;
 const candidate=original.contingencyPct!=null&&matchesLegacyGoodsBasis0550(line)?applyGoodsSellBasis0550(line):line;
 return Object.keys(candidate).length===Object.keys(original).length&&Object.keys(original).every(key=>original[key]===candidate[key]);
}

export function addvalueSell0550(line,cost,quantity) {
 const nonnegative=n=>Number.isFinite(n)&&n>=0;
 if(line.sellMode==="DIRECT")return Number.isFinite(quantity)&&nonnegative(line.sellRate)?
  evaluateServiceEquation("E10",{rows:[{id:line.id,quantity,sellRate:line.sellRate}],other:0}).value:null;
 if(cost===null)return null;
 if(line.sellMode==="MARKUP"){
  const contingency=line.contingencyPct??0;
  return nonnegative(line.markupPct)&&nonnegative(contingency)?
   evaluateServiceEquation("E11",{cost,markup:(line.markupPct+contingency)/100}).value:null;
 }
 return nonnegative(line.marginPct)?evaluateServiceEquation("E12",{cost,margin:line.marginPct/100}).value:null;
}

export function policyDefaults0550(policies, kind) {
 const policy=policies.find(p=>p.title===kind);
 if(!policy)return null;
 if(kind===GOODS_POLICY_TITLE_0550) {
  if(policy.formula===GOODS_FORMULA_0550)return {...GOODS_SELL_BASIS_0550};
  const m=policy.formula.match(/^Customer = Cost × \(1 \+ ([\d.]+)% SAMTEL\) \/ \(1 - ([\d.]+)% ADDVALUE final margin\)$/);
  if(m&&Number(m[2])<100)return {sellMode:"MARGIN",marginPct:Number(m[2]),primePct:Number(m[1])};
 }
 if(kind==="Professional Service") {
  const m=policy.formula.match(/^Workload → protected ADDVALUE rate → SAMTEL \+([\d.]+)%$/);
  if(m)return {sellMode:"DIRECT",primePct:Number(m[1])};
 }
 return null; // Unrecognised/open policies require an explicit basis, not guessed numbers.
}
export function applyPolicyDraft0550(line, policies, kind) {
 const defaults=policyDefaults0550(policies,kind);
 if(!defaults)return line;
 const next={...line,...defaults,sourceRef:[line.sourceRef,`Project commercialPolicy / ${kind}: ${policies.find(p=>p.title===kind).formula}`].filter(Boolean).join("\n")};
 if(defaults.contingencyPct===undefined)delete next.contingencyPct;
 return next;
}
export function applyRoleDraft0550(line, role, offer) {
 if(!role||!Number.isFinite(role.protectedUsdDay)|| (offer&&(offer.currency!=="USD"||offer.unit!=="MD")))return line;
 if(!offer&&line.manualCost!=null&&(line.currency!=="USD"||line.unit!=="MD"))return line;
 const {contingencyPct,...inputs}=line;
 return {...inputs,currency:"USD",unit:"MD",sellMode:"DIRECT",sellRate:role.protectedUsdDay,
  sourceRef:[line.sourceRef,`06 Execution / CORE_TEAM / ${role.role}: ADDVALUE ${role.protectedUsdDay} USD/MD (selling basis; internal cost separate)`].filter(Boolean).join("\n")};
}
export function calculationBinding0550(calculation, resultKey, offer) {
 if(!calculation)return {calculationId:""};
 const key=resultKey||(calculation.equationId==="E05"?"MD":"value");
 const unit=calculation.equationId==="E05"&&key==="MH"?"MH":EQUATION_INPUTS[calculation.equationId]?.unit;
 return {calculationId:calculation.id,resultKey:key,...(!offer&&["MH","MD","DAYS"].includes(unit)?{unit:bidQuantityUnit0550(unit)}:{})};
}
// MR Rev.B1, printed p02 of 52: ordering aid only, not a reviewed scope decision.
// System-to-appendix associations are working mappings; exact requirements stay on each line.
export const MR_SUPPLY_ORDER_0550=[
 {appendix:"1.1",title:"VHF and MF/HF",systems:["TEL-RADIO-DTRS","TEL-RADIO-MARINE","TEL-RADIO-AERO","TEL-RADIO-SSB"]},
 {appendix:"1.2",title:"Satellite Communication",systems:["TEL-VSAT","TEL-VSAT-KU"]},
 {appendix:"1.3",title:"Network, PABX, CCTV and MET",systems:["TEL-LAN","TEL-LAN-VCS","TEL-PABX","TEL-IPP","TEL-CCTV","TEL-MET"]},
 {appendix:"1.4",title:"PAGA",systems:["TEL-PAGA"]},
 {appendix:"1.5",title:"Microwave Communication",systems:["TEL-DMR"]},
 {appendix:"1.6",title:"Entertainment",systems:["TEL-ES"]},
 {appendix:"1.7",title:"Non-Directional Beacon",systems:["TEL-NDB"]},
 {appendix:"1.8",title:"FOC and Cables",systems:["TEL-FO"]},
 {appendix:"1.0",title:"Cross-system / battery limits / shared scope — ตรวจข้อกำหนดรายรายการ",systems:["TEL-TELT","TEL-AIS","COMMON"]}
];
export function mrBasisForCustomer0550(row) {
 if(row.part!=="A")return "Appendix 1.0 / ข้อกำหนดบริการและเอกสารที่เกี่ยวข้อง";
 return MR_SUPPLY_ORDER_0550.filter(g=>g.systems.some(s=>row.systems.includes(s))).map(g=>"App. "+g.appendix).join(" / ");
}
