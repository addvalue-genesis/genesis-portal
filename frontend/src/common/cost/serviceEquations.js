// Shared method definitions extracted without modification from 0550 recovered E01–E18.
// Formula definitions are COMMON; project rates, quotas, historic pricing and allowances are not.
export const SERVICE_EQUATIONS = [
  { id:"E01", purpose:"Applicability and cost ownership", equation:"MH_i,r = I_i × Q_i × UMH_i,r × F_i", control:"I=0/1 only when scope is established; ownership is separate. Unknown is OPEN, not zero." },
  { id:"E02", purpose:"Document lifecycle", equation:"MH_doc = Q_doc × (H_initial + N_cycles × H_cycle + H_final)", control:"One row per work-object family/role; review, revision and document-control effort must not overlap." },
  { id:"E03", purpose:"PM and coordination", equation:"MH_PM = Months × FTE × H_month", control:"Calendar presence; no blanket document-review multiplier on PM. Site work is separate." },
  { id:"E04", purpose:"Interface engineering", equation:"MH_int,r = Σ_edges I_edge × UMH_edge,r × F_edge", control:"Count each controlled interface edge once; do not create N² duplication." },
  { id:"E05", purpose:"Event attendance", equation:"MD = Events × Days × Crew; MH_attend = MD × H_day", control:"Attendance hours govern pay/invoicing. Productive efficiency must not reduce paid attendance." },
  { id:"E06", purpose:"Capacity and duration", equation:"Days = MH_work / (Crew × H_day × η)", control:"Use only for output-driven work and check access/crew caps." },
  { id:"E07", purpose:"Internal labor cost", equation:"C_labor = Σ_r MH_paid,r × C_rate,r", control:"Internal cost rate must be an explicit loaded rate; do not reverse-engineer payroll from selling rates." },
  { id:"E08", purpose:"Trip cost", equation:"C_trip = Fare + Hotel + PerDiem + Transport + Permits + Insurance + Other", control:"Count once per physical trip; shared FAT/training travel is not duplicated." },
  { id:"E09", purpose:"Direct service cost", equation:"C_service = C_labor + C_trip + C_OEM + C_test + C_other", control:"Goods/installation by others remain outside; deduct OEM inclusions only with evidence." },
  { id:"E10", purpose:"Direct selling rates", equation:"P_service = Σ(MH × R_sell_hr) + Σ(MD × R_sell_day) + P_other", control:"Hourly/day-rate and cost-plus bases are alternatives where applicable, not automatically additive." },
  { id:"E11", purpose:"Cost-plus markup", equation:"P = C_loaded × (1 + markup)", control:"Do not double count overhead/risk." },
  { id:"E12", purpose:"Target gross margin", equation:"P = C_loaded / (1 − margin)", control:"Markup and gross margin are different quantities." },
  { id:"E13", purpose:"Prime-contractor layer", equation:"P_customer = P_ADDVALUE × (1 + prime_markup)", control:"Keep prime layer separate from ADDVALUE cost/margin." },
  { id:"E14", purpose:"Shared cost allocation", equation:"w_s = Driver_s / ΣDriver; Allocated_s = Pool × w_s", control:"Use a causal driver. No equal split across 19 systems by default." },
  { id:"E15", purpose:"Variation and retest", equation:"ΔC = Σ(ΔMH × C_rate) + Δtrip + ΔOEM", control:"Retest cost depends on cause and entitlement." },
  { id:"E16", purpose:"Training", equation:"MH_train = Sessions × Days × Trainers × H_day + PrepMH + CloseMH", control:"Trainees are not trainers. PAGA/CCTV have three trainee categories of five in the recovered model." },
  { id:"E17", purpose:"FX conversion", equation:"USD = THB / FX_THB_per_USD", control:"FX requires controlled source/date; historical FX is not automatically current." },
  { id:"E18", purpose:"Material-to-labor driver", equation:"MH_install = Σ(Q_installed_activity × UMH_activity)", control:"Purchase quantity/spares/pack rounding do not automatically create installation labor." }
];

