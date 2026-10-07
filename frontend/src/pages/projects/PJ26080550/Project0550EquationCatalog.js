/*
PJ2608-0550 — CONTROLLED EQUATION CATALOG FALLBACK SNAPSHOT

Canonical source of truth when DB is live: etm_equation_registry.
This file is the shared controlled fallback projection used by EquationKernel and
internal derivation views. It is not a second equation authority.
*/

export const PROJECT0550_CONTROLLED_EQUATION_FALLBACK = [
  ["GEQ-001","Applicability","I_i = Applicable(Requirement, Scope, Phase, Context, Interface) ∈ {0,1}","STRUCTURAL_RULE","CONTROLLED","Does this obligation/activity apply to 0550?"],
  ["GEQ-002","Installed Quantity","Q_installed,e = Σ_f I[f,e] × q[f,e]","MATHEMATICAL_IDENTITY","CONTROLLED","Installed equipment / device quantity by location"],
  ["GEQ-004","Activity Quantity Driver","Q_i = Driver(B_i, Context)","STRUCTURAL_RULE","CONTROLLED","Turns physical/document/event basis into work quantity"],
  ["GEQ-005","Role Man-hours","MH_i,r = I_i × Q_i × UMH_i,r × F_combined,i,r","PARAMETRIC_CER_CANDIDATE","CALIBRATION REQUIRED","Workload by role; UMH/factors must come from approved library/history"],
  ["GEQ-006","Activity Duration","D_i,r(n) = MH_i,r / (n × H_day × η_i,r(n,Context))","RESOURCE_CONSTRAINED","CALIBRATION REQUIRED","Crew/time feasibility"],
  ["GEQ-007","Required / Feasible Headcount","N_req = MIN{n : D_i,r(n) ≤ D_target}; N_plan = MIN(N_req,N_cap)","RESOURCE_FEASIBILITY_RULE","INPUT REQUIRED","Crew cannot exceed actual resource/POB/workspace/safety constraints"],
  ["GEQ-008","Regular Labor Cost","C_labor,i = Σ_r MH_i,r × Rate_r","ACCOUNTING_IDENTITY","RATE INPUT","Turns workload into internal labor cost"],
  ["GEQ-009","Document Workflow MH","MH_doc = MH_author + MH_control + MH_review + MH_consolidate + MH_approve + MH_revise","ACCOUNTING_IDENTITY","CONTROLLED","VDRL/document workload"],
  ["GEQ-010","Document Cycle Time","T_doc,realized = T_base + Σ I_rework,c × (T_revise,c + T_resubmit,c + T_response,c)","PROCESS_TIME_IDENTITY","HISTORY / PROCESS INPUT","Revision/review loop duration"],
  ["GEQ-011","Event-relative Due Date","DueDate = EventDate + OffsetDays","MATHEMATICAL_IDENTITY","CONTROLLED","PO/FAT/dispatch/test based due dates"],
  ["GEQ-012","Material / Landed Cost","C_material = Q_purchase × UnitPrice; C_landed = C_material + accessory + freight + duty + insurance","ACCOUNTING_IDENTITY","RATE INPUT","Equipment / bulk landed cost"],
  ["GEQ-013","Travel Cost","C_travel = Σ_l(Pax_l × Fare_l) + Σ_l OtherTransport_l","ACCOUNTING_IDENTITY","RATE INPUT","Travel component"],
  ["GEQ-014","Hotel Rooms","Rooms = CEILING(Persons / Occupancy)","MATHEMATICAL_IDENTITY","POLICY INPUT","Accommodation quantity"],
  ["GEQ-015","Accommodation Cost","C_hotel = Rooms × Nights × Rate_room","ACCOUNTING_IDENTITY","RATE INPUT","Hotel cost"],
  ["GEQ-016","Per-diem Cost","C_PD = Σ_r Persons_r × EligibleDays_r × Rate_PD,r","ACCOUNTING_IDENTITY","POLICY / RATE","Per-diem cost"],
  ["GEQ-017","Mobilization Cost","C_mob = Travel + Hotel + PerDiem + LocalTransport + Visa + Permit + Insurance + Other","ACCOUNTING_IDENTITY","INPUT REQUIRED","Complete mobilization cost"],
  ["GEQ-018","Direct Activity Cost","C_activity,i = C_labor + C_OT + C_standby + C_mob + C_material + C_rental + C_subcontract + C_otherdirect","ACCOUNTING_IDENTITY","CONTROLLED","Cost of one engineering/site/test activity"],
  ["GEQ-019","Direct Equipment Cost","C_direct,e = C_landed,e + Σ C_activity,i + C_assetlogistics,e","ACCOUNTING_IDENTITY","CONTROLLED","Fully traceable direct equipment/item cost"],
  ["GEQ-020","Common Project Cost","C_common = C_PM + C_DC + C_commonEng + C_commonMob + C_safety + C_commonTools + C_closeout + C_otherCommon","ACCOUNTING_IDENTITY","OWNER / INPUT","Shared project cost"],
  ["GEQ-021","Total Project Cost","C_project = Σ_e C_direct,e + C_common","ACCOUNTING_IDENTITY","CONTROLLED","Canonical total internal project cost"],
  ["GEQ-022","Fully Loaded Cost Allocation","C_loaded,e = C_direct,e + C_common × w_e; Σ_e w_e = 1","CAUSAL_ALLOCATION_METHOD","POLICY REQUIRED","Allocates common cost using causal driver, not arbitrary weight"],
  ["GEQ-023","Stage Cost / Reconciliation","C_project,byStage = Σ_p C_stage,p","RECONCILIATION_VIEW","CONTROLLED","Engineering / FAT / site / training / etc. must reconcile to total"],
  ["GEQ-024","Document Revision Workload","MH_doc,total = MH_initial + Σ_c(MH_review,c + MH_revise,c + MH_control,c) + MH_final","ACCOUNTING_IDENTITY","PRODUCTIVITY INPUT","Historical revision / revision-cycle workload"],
  ["GEQ-025","Integration Workload","MH_integration,r = Σ_g I_g × UMH_interface,type(g),r × F_complexity,g × F_workmode,g,r","INTERFACE_GRAPH_DRIVER","CALIBRATION REQUIRED","Interface count/type drives integration work; no blanket O(N²)"],
  ["GEQ-026","Context-controlled Activity Set","Activities(P) = BaseActivities ∪ Triggered(Context) ∪ Required(ParticularRequirements)","STRUCTURAL_RULE","CONTROLLED","Scope/context creates work before cost"],
  ["GEQ-027","Overtime Cost","C_OT,i,r = Σ_t MH_OT,i,r,t × Rate_r × M_OT,t","ACCOUNTING_IDENTITY","POLICY / LEGAL INPUT","OT cost"],
  ["GEQ-028","Standby Cost","C_standby,i = I_standby,i × Σ_r N_persons,r × StandbyDays_r × Rate_standby,r","ACCOUNTING_IDENTITY","RATE POLICY","Standby is explicit, never silently free"],
  ["GEQ-031","Hazardous Area Compliance / Cost Gate","I_ExReq = Applicable(...); I_ExCompat = CompatibilityGate(...); C_ExProtection = I_ExReq × (...applicable Ex cost terms...)","ENGINEERING_COMPLIANCE_GATE","SCOPE / RATE INPUT","Ex compliance gate + only applicable premium/accessory/install/inspection/cert costs"],
  ["GEQ-032","Procurement-class Quantity Conservation","Q_ordered,pseg = I_required × I_awarded × Q_required; Q_physical,pse = Σ_g Q_ordered,pseg","MATHEMATICAL_IDENTITY","CONTROLLED","Installed / commissioning spare / 2Y / capital quantities stay separate"],
  ["GEQ-033","Commercial-treatment Line Cost","C_line,psj = I_required × I_awarded × Q_psj × P_psj; C_award = C_base + C_separate,awarded + C_option,exercised","ACCOUNTING_IDENTITY","RATE / AWARD INPUT","Base vs separate vs option commercial state"],
  ["GEQ-034","Controlled Currency Conversion","P_to = P_from × R_from,THB / R_to,THB","MATHEMATICAL_IDENTITY / COMMON_GENERIC","CONTROLLED FX INPUT","Cross-currency display uses one controlled FX authority/date/rate type while preserving the source currency amount"]
];

export function controlledEquationById(id){
  const row=PROJECT0550_CONTROLLED_EQUATION_FALLBACK.find(x=>x[0]===id);
  if(!row) return null;
  return {
    id:row[0],name:row[1],expression:row[2],modelClass:row[3],inputState:row[4],meaning:row[5]
  };
}

export function controlledEquationsByIds(ids=[]){
  return ids.map(controlledEquationById).filter(Boolean);
}
