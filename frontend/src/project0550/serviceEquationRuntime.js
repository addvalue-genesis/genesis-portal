// Executable bindings for the existing 0550 E01–E18 register. No rates or FX defaults.
import { SERVICE_EQUATIONS } from "./serviceEquationModel";
const f=(key,label,min=0,max=1e12)=>({key,label,min,max});
export const EQUATION_INPUTS = {
 E01:{fields:[f("I","Applicability 0/1",0,1),f("Q","Work objects"),f("UMH","MH per object"),f("F","Factor")],unit:"MH"},
 E02:{fields:[f("Qdoc","Documents"),f("Hinitial","Initial MH/document"),f("Ncycles","Review cycles"),f("Hcycle","MH/review"),f("Hfinal","Final MH/document")],unit:"MH"},
 E03:{fields:[f("months","Months"),f("FTE","FTE"),f("Hmonth","Paid hours/month")],unit:"MH"},
 E04:{fields:[],rows:[f("I","Applicable 0/1",0,1),f("UMH","MH/interface"),f("F","Factor")],unit:"MH"},
 E05:{fields:[f("events","Events"),f("days","Days/event"),f("crew","Persons"),f("Hday","Paid hours/day")],unit:"MD",outputs:["MD","MH"]},
 E06:{fields:[f("MHwork","Required MH"),f("crew","Persons",0.000001),f("Hday","Hours/day",0.000001),f("eta","Productive efficiency 0–1",0.000001,1)],unit:"DAYS"},
 E07:{fields:[],rows:[f("MHpaid","Paid MH"),f("costRate","Cost per MH")],unit:"CURRENCY"},
 E08:{fields:[f("fare","Fare"),f("hotel","Hotel"),f("perDiem","Per diem"),f("transport","Transport"),f("permits","Permits"),f("insurance","Insurance"),f("other","Other")],unit:"CURRENCY"},
 E09:{fields:[f("labor","Labor cost"),f("trip","Trip cost"),f("OEM","OEM cost"),f("test","Test cost"),f("other","Other cost")],unit:"CURRENCY"},
 E10:{fields:[f("other","Other selling amount")],rows:[f("quantity","Paid MH or MD"),f("sellRate","Sell per matching MH/MD")],unit:"CURRENCY"},
 E11:{fields:[f("cost","Loaded cost"),f("markup","Markup fraction (0.2 = 20%)",0,100)],unit:"CURRENCY"},
 E12:{fields:[f("cost","Loaded cost"),f("margin","Gross margin fraction",0,0.999999)],unit:"CURRENCY"},
 E13:{fields:[f("sell","ADDVALUE sell"),f("primeMarkup","Prime markup fraction",0,100)],unit:"CURRENCY"},
 E14:{fields:[f("pool","Shared pool"),f("driver","This causal driver"),f("totalDrivers","Total causal drivers",0.000001)],unit:"CURRENCY"},
 E15:{fields:[f("laborDelta","Labor delta",-1e12),f("tripDelta","Trip delta",-1e12),f("OEMDelta","OEM delta",-1e12)],unit:"CURRENCY"},
 E16:{fields:[f("sessions","Sessions"),f("days","Days/session"),f("trainers","Trainers"),f("Hday","Paid hours/day"),f("prepMH","Preparation MH"),f("closeMH","Closeout MH")],unit:"MH"},
 E17:{fields:[f("THB","THB amount"),f("fx","THB per USD",0.000001)],unit:"USD"},
 E18:{fields:[],rows:[f("qtyInstalled","Installed activity quantity"),f("UMH","MH per installed activity")],unit:"MH"},
 "PAGA-SPL":{fields:[f("ambient","Ambient noise dBA"),f("margin","Required SNR margin dB")],unit:"dBA",formula:"SPL_required = Ambient_Noise + Required_SNR_Margin"},
 "PAGA-UPS":{fields:[f("loadW","Alarm load W"),f("hours","Autonomy hours"),f("efficiency","Efficiency 0–1",0.000001,1),f("DoD","Depth of discharge 0–1",0.000001,1),f("derating","Derating factor 0–1",0.000001,1)],unit:"Wh",formula:"E_required = P_load × t / (η × DoD × Derating)"},
 "PAGA-AMPLIFIER":{fields:[f("tapW","Total speaker tap load W"),f("lossW","Loop losses W"),f("ratedW","Rated amplifier capacity W",0.000001),f("usable","Usable fraction 0–1",0.000001,1)],unit:"W",formula:"Headroom = Rated × Usable − (Speaker taps + Loop losses)"},
 "AVAILABILITY":{fields:[f("MTBF","MTBF hours",0.000001),f("MTTR","MTTR hours")],unit:"RATIO",formula:"A = MTBF / (MTBF + MTTR)"}
};
export function evaluateServiceEquation(id, inputs={}) {
 const definition=EQUATION_INPUTS[id];
 if(!definition)return {state:"INVALID",value:null,errors:["Unknown equation"],unit:null};
 if(!inputs||typeof inputs!=="object"||Array.isArray(inputs))return {state:"INVALID",value:null,errors:["Inputs must be an object"],unit:definition.unit};
 const errors=[],missing=[];
 const check=(spec,obj,prefix="")=>{for(const field of spec){const v=obj?.[field.key],k=prefix+field.key;
  if(v===null||v===undefined||v==="")missing.push(k);
  else if(typeof v!=="number"||!Number.isFinite(v)||v<field.min||v>field.max)errors.push(k+" outside allowed range");
 }};
 check(definition.fields,inputs);
 if(definition.rows){
  if(!Array.isArray(inputs.rows)||!inputs.rows.length)missing.push("rows");
  else if(inputs.rows.length>2000)errors.push("Too many work objects");
  else {const ids=new Set();inputs.rows.forEach((row,i)=>{if(!row||typeof row!=="object"||typeof row.id!=="string"||!row.id||ids.has(row.id)){errors.push("Duplicate/missing work-object ID");return;}ids.add(row.id);check(definition.rows,row,`rows[${i}].`);});}
 }
 if(id==="E01"&&inputs.I!==undefined&&inputs.I!==null&&![0,1].includes(inputs.I))errors.push("Applicability must be 0 or 1");
 if(id==="E04"&&Array.isArray(inputs.rows)&&inputs.rows.some(r=>r&&r.I!==null&&r.I!==undefined&&![0,1].includes(r.I)))errors.push("Applicability must be 0 or 1");
 if(id==="E05")for(const key of ["events","crew"])if(inputs[key]!==null&&inputs[key]!==undefined&&!Number.isInteger(inputs[key]))errors.push(key+" must be a whole count");
 if(id==="E14"&&inputs.driver>inputs.totalDrivers)errors.push("Driver exceeds total drivers");
 if(errors.length||missing.length)return {state:errors.length?"INVALID":"OPEN",value:null,errors:[...errors,...missing.map(k=>"Missing "+k)],unit:definition.unit};
 const x=inputs, sum=fn=>x.rows.reduce((n,r)=>n+fn(r),0);
 const calculations={
  E01:()=>x.I*x.Q*x.UMH*x.F,E02:()=>x.Qdoc*(x.Hinitial+x.Ncycles*x.Hcycle+x.Hfinal),E03:()=>x.months*x.FTE*x.Hmonth,
  E04:()=>sum(r=>r.I*r.UMH*r.F),E05:()=>x.events*x.days*x.crew,E06:()=>x.MHwork/(x.crew*x.Hday*x.eta),
  E07:()=>sum(r=>r.MHpaid*r.costRate),E08:()=>x.fare+x.hotel+x.perDiem+x.transport+x.permits+x.insurance+x.other,
  E09:()=>x.labor+x.trip+x.OEM+x.test+x.other,E10:()=>sum(r=>r.quantity*r.sellRate)+x.other,
  E11:()=>x.cost*(1+x.markup),E12:()=>x.cost/(1-x.margin),E13:()=>x.sell*(1+x.primeMarkup),
  E14:()=>x.pool*x.driver/x.totalDrivers,E15:()=>x.laborDelta+x.tripDelta+x.OEMDelta,
  E16:()=>x.sessions*x.days*x.trainers*x.Hday+x.prepMH+x.closeMH,E17:()=>x.THB/x.fx,E18:()=>sum(r=>r.qtyInstalled*r.UMH),
  "PAGA-SPL":()=>x.ambient+x.margin,"PAGA-UPS":()=>x.loadW*x.hours/(x.efficiency*x.DoD*x.derating),
  "PAGA-AMPLIFIER":()=>x.ratedW*x.usable-x.tapW-x.lossW,"AVAILABILITY":()=>x.MTBF/(x.MTBF+x.MTTR)
 };
 const value=calculations[id]();
 if(!Number.isFinite(value)||Math.abs(value)>Number.MAX_SAFE_INTEGER||(id==="E05"&&value*x.Hday>Number.MAX_SAFE_INTEGER))return {state:"INVALID",value:null,unit:definition.unit,errors:["Result overflow"]};
 return {state:"CALCULATED",value,unit:definition.unit,errors:[],formula:SERVICE_EQUATIONS.find(e=>e.id===id)?.equation||definition.formula,
  ...(id==="E05"?{MD:value,MH:value*x.Hday}:{}),engineeringAccepted:false};
}
