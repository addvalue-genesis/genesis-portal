// GENESS COMMON Knowledge Kernels
// Reusable across projects. No project facts, quantities, vendors or prices belong here.
// Project-specific evidence, constraints and bindings live in each project adapter/binding layer.

export const KNOWLEDGE_KERNEL_DOMAINS = [
  {
    id: "MATH",
    name: "Mathematics",
    purpose: "Quantify relationships, uncertainty, optimization and consistency.",
    topics: ["Arithmetic", "Algebra", "Geometry", "Trigonometry", "Calculus", "Probability", "Statistics", "Graph Theory", "Optimization", "Dimensional Analysis"],
  },
  {
    id: "PHYSICS",
    name: "Physics",
    purpose: "Model physical feasibility and boundary conditions.",
    topics: ["Electromagnetics", "Acoustics", "Optics", "Mechanics", "Energy / Power", "Thermal / Environmental Effects"],
  },
  {
    id: "TELECOM",
    name: "Telecom Fundamentals",
    purpose: "Apply domain engineering laws to communication systems.",
    topics: ["RF", "Microwave", "Satellite", "VHF/UHF/HF", "Fiber Optic", "PAGA", "CCTV", "Telephony", "Availability / Redundancy"],
  },
  {
    id: "NETWORK",
    name: "Computer & Network Engineering",
    purpose: "Control digital capacity, architecture, monitoring and cyber interfaces.",
    topics: ["LAN/WAN", "Routing/Switching", "QoS", "NMS/EMS", "Server/Storage", "Virtualization", "Cybersecurity", "Protocols / APIs"],
  },
  {
    id: "ELECTRICAL",
    name: "Electrical / Power",
    purpose: "Size and verify power, UPS, battery, grounding and protection.",
    topics: ["Load", "UPS", "Battery Autonomy", "Redundancy", "Grounding", "Surge / Lightning"],
  },
  {
    id: "ECON",
    name: "Economics & Finance",
    purpose: "Translate engineering decisions into lifecycle economic consequences.",
    topics: ["CAPEX/OPEX", "FX", "Inflation", "NPV", "Lifecycle Cost", "Sensitivity", "Uncertainty"],
  },
  {
    id: "ACCOUNTING",
    name: "Accounting & Commercial",
    purpose: "Control cost, sell price, margin, cash and commercial structure.",
    topics: ["Cost", "Sell Price", "Margin / Markup", "Cash Flow", "Payment Milestones", "Tax", "Working Capital"],
  },
  {
    id: "LOGISTICS",
    name: "Logistics & Supply Chain",
    purpose: "Control movement, lead time and delivery boundary.",
    topics: ["Incoterms", "Freight", "Packing", "Customs", "Import/Export", "Lead Time", "Route", "Sanctions"],
  },
  {
    id: "PM",
    name: "Project Management",
    purpose: "Turn scope into executable work, schedule, resources and control.",
    topics: ["WBS", "Schedule", "Critical Path", "Resources", "Procurement", "Risk", "Change", "Document Control"],
  },
  {
    id: "GOV",
    name: "Contract / Quality / Governance",
    purpose: "Control obligations, traceability, verification and release.",
    topics: ["Scope Boundary", "Warranty", "LD", "Deviation", "Permit", "V-Model", "QA/ITP", "FAT/IFAT/SAT", "Configuration Control"],
  },
];

export const ENGINEERING_LAW_KERNELS = [
  {
    id: "RF-PROP",
    name: "RF Propagation / Attenuation",
    domain: "Electromagnetics",
    equations: [
      { name: "Free Space Path Loss", formula: "FSPL(dB) = 32.44 + 20log10(f_MHz) + 20log10(d_km)", role: "Base propagation loss" },
      { name: "Feeder Loss", formula: "L_feeder(dB) = α(dB/m) × length(m)", role: "Cable / feeder attenuation" },
      { name: "Received Level", formula: "P_Rx = P_Tx + G_Tx + G_Rx − ΣLosses", role: "End-to-end RF link balance" },
      { name: "Fade Margin", formula: "FM = P_Rx − Receiver Threshold", role: "Link robustness margin" },
      { name: "Fresnel Radius", formula: "F1 = sqrt(λ d1 d2 / (d1 + d2))", role: "Path-clearance constraint" },
    ],
    controls: ["Explicit units", "Feeder/connector/filter losses", "Terrain/clutter/building loss when applicable", "Rain/gaseous attenuation where material", "Use the project/applicable propagation standard"],
    output: "Coverage / link feasibility / antenna-height and gain drivers / RF equipment quantity",
  },
  {
    id: "ACOUSTIC",
    name: "Acoustic / PAGA Coverage",
    domain: "Acoustics",
    equations: [
      { name: "Required SPL", formula: "SPL_required = Ambient_Noise + Required_SNR_Margin", role: "Audibility target" },
      { name: "Distance Attenuation", formula: "ΔSPL ≈ 20log10(r2/r1)", role: "Free-field preliminary propagation" },
      { name: "Amplifier Balance", formula: "Σ Speaker_Tap_Load ≤ Usable_Amplifier_Capacity", role: "Electrical loading constraint" },
    ],
    controls: ["Ambient-noise source required", "Free-field model is preliminary where reflections/obstructions dominate", "Speaker directivity/mounting matter", "OEM/CAL/RPT confirmation before final quantity"],
    output: "Speaker spacing / tapping / amplifier loading / node quantity / sound coverage proof",
  },
  {
    id: "OPTICAL",
    name: "Fiber / Optical Power & Route",
    domain: "Optics + Geometry",
    equations: [
      { name: "Optical Loss", formula: "L_total = L_fiber + L_splice + L_connector + L_passive + Margin", role: "Optical power budget" },
      { name: "Receiver Check", formula: "P_Rx = P_Tx − L_total; PASS if P_Rx ≥ Receiver_Sensitivity", role: "Feasibility" },
      { name: "Procurement Length", formula: "L_procure = L_route × F_routing + L_vertical + L_termination + L_spare", role: "Cable quantity derivation" },
    ],
    controls: ["Route source/revision required", "Core allocation/spare-core retained", "Splice/connector counts trace topology", "OTDR/test linked to final route"],
    output: "Cable length / core count / active-interface requirement / optical margin",
  },
  {
    id: "POWER",
    name: "Power / UPS / Energy Balance",
    domain: "Electrical + Energy",
    equations: [
      { name: "Energy Demand", formula: "E = P_load × t_autonomy", role: "Base autonomy requirement" },
      { name: "Adjusted Capacity", formula: "E_required = E / (η × DoD × Derating)", role: "Battery/UPS capacity driver" },
      { name: "Load Balance", formula: "Σ Connected_Load ≤ Rated_Usable_Capacity", role: "Capacity constraint" },
    ],
    controls: ["Autonomy from requirement", "Efficiency/DoD/aging/temperature assumptions explicit", "Redundancy philosophy separate"],
    output: "UPS/battery capacity / PSU quantity / redundancy check",
  },
  {
    id: "VIDEO",
    name: "CCTV Geometry / Bandwidth / Storage",
    domain: "Optics + Data",
    equations: [
      { name: "Field of View", formula: "FoV = geometry(sensor, focal_length, distance)", role: "Coverage / lens selection" },
      { name: "Pixel Density", formula: "Pixel_Density = Horizontal_Pixels / Scene_Width", role: "Image-detail criterion" },
      { name: "Storage", formula: "Storage = Σ Bitrate × Retention_Time × Recording_Factor", role: "NVR/VMS capacity" },
    ],
    controls: ["Target criterion required", "Scene distance/lens source required", "Codec/FPS/recording inputs retained", "RAID/usable-storage overhead explicit"],
    output: "Camera/lens quantity / bandwidth / effective storage requirement",
  },
  {
    id: "NET-CAP",
    name: "Network / NMS Capacity",
    domain: "Discrete Mathematics + Capacity",
    equations: [
      { name: "Port Capacity", formula: "Installed_Ports ≥ Required_Ports + Spare_Ports", role: "Switch sizing" },
      { name: "PoE Balance", formula: "Σ Endpoint_PoE_Load ≤ Usable_PoE_Budget", role: "Power-capacity check" },
      { name: "NMS Licence Capacity", formula: "Licensed_Objects ≥ Managed_Nodes/Sensors/Interfaces", role: "NMS sizing" },
      { name: "Bandwidth Balance", formula: "Σ Peak_or_Engineered_Traffic ≤ Usable_Link_Capacity", role: "Capacity constraint" },
    ],
    controls: ["Define licence counting unit", "Avoid logical-object double count", "Growth/spare policy explicit", "QoS/redundancy handled by architecture"],
    output: "Switch/NMS licence/controller quantity / bandwidth and port headroom",
  },
  {
    id: "RELIABILITY",
    name: "Reliability / Availability / Redundancy",
    domain: "Probability",
    equations: [
      { name: "Component Availability", formula: "A = MTBF / (MTBF + MTTR)", role: "Availability estimate" },
      { name: "Series Availability", formula: "A_series = Π A_i", role: "Series-path availability" },
      { name: "Parallel Redundancy", formula: "A_parallel = 1 − Π(1 − A_i)", role: "Independent redundant-path estimate" },
    ],
    controls: ["State independence assumption", "Treat common-mode failures separately", "Project/OEM criteria override generic assumptions"],
    output: "Redundancy requirement / spare module / architecture and risk decisions",
  },
  {
    id: "MECH",
    name: "Mechanical / Tower Preliminary Load",
    domain: "Mechanics",
    equations: [
      { name: "Dynamic Pressure", formula: "q = 0.5 × ρ × V²", role: "Physics basis for wind action" },
      { name: "Force", formula: "F = q × C_d × A", role: "Preliminary antenna/equipment wind force" },
      { name: "Moment", formula: "M = F × lever_arm", role: "Preliminary tower-load driver" },
    ],
    controls: ["Final structural design uses governing code", "Projected area/elevation required", "Geotechnical/foundation separate"],
    output: "Preliminary antenna-load schedule / tower capacity input / structural-design trigger",
  },
];

export const KNOWLEDGE_KERNEL_POLICY = {
  architecture: "COMMON → GENERIC DOMAIN → PARTICULAR PROJECT",
  evidenceRule: "Equations and models never upgrade weak input evidence into confirmed project facts.",
  calculationRecord: ["kernelId", "formula/model", "inputs", "units", "source", "assumptions", "result", "margin", "confidence", "revision", "replacementTrigger"],
};
