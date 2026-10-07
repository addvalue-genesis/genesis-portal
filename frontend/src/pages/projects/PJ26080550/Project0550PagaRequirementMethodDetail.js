export const PROJECT0550_PAGA_REQUIREMENT_METHOD_DETAIL = {
  "REQ-PAGA-001":{
    fundamentalNeed:"People in occupied areas must hear and understand public-address speech.",
    interfaceContext:["Occupied location / room","Ambient acoustic environment","Speaker-to-listener geometry"],
    engineeringInputs:["Ambient noise","Geometry","Speaker acoustic data","Mounting/location"],
    architecture:"Coverage-driven speaker layout; final arrangement remains proof-driven.",
    requiredMtoState:"Speaker type / qty / tap / mount = TBC until coverage proof closes."
  },
  "REQ-PAGA-002":{
    fundamentalNeed:"Personnel must reliably perceive emergency alarm notification.",
    interfaceContext:["Ambient noise","Occupied/hazardous location","Beacon circuit monitoring"],
    engineeringInputs:["Ambient noise","Area classification","Beacon visibility/location basis"],
    architecture:"Audible alarm plus beacon supplementation where required.",
    requiredMtoState:"Beacon / monitored circuit / controller qty = proof- and location-driven."
  },
  "REQ-PAGA-003":{
    fundamentalNeed:"Speaker load must be driven with sufficient capacity and required redundancy.",
    interfaceContext:["Speaker loops/circuits","Remote building node","Power/network/cabinet boundary"],
    engineeringInputs:["Speaker qty","Tap","Loop allocation","Amplifier nominal output"],
    architecture:"Active + standby remote amplifier arrangement by building.",
    requiredMtoState:"Amplifier and cabinet qty = TBC until load/topology proof closes."
  },
  "REQ-PAGA-004":{
    fundamentalNeed:"Electrical distribution must deliver required speaker power within acceptable loss.",
    interfaceContext:["Cabinet-field route","Loop topology","JB/termination/cable-entry boundary"],
    engineeringInputs:["Loop load","Cable route/length","Cable material/area","100 V line","Final topology"],
    architecture:"Loop/circuit architecture preliminary while drawing/topology conflict is open.",
    requiredMtoState:"Cable/JB/termination/loop qty remain TBC."
  },
  "REQ-PAGA-005":{
    fundamentalNeed:"PAGA must remain powered for the required operating/emergency duration.",
    interfaceContext:["230 VAC UPS","PAGA node loads","Distribution/protection boundary"],
    engineeringInputs:["Node load","Autonomy","Efficiency/reserve","Battery/UPS parameters"],
    architecture:"UPS-fed package architecture; final storage provision remains input-driven.",
    requiredMtoState:"Power supply / UPS accessory / battery-autonomy provision = TBC."
  },
  "REQ-PAGA-006":{
    fundamentalNeed:"PAGA must exchange triggers/status and enforce required priority with adjacent systems.",
    interfaceContext:["Fire & Gas","PABX","Entertainment","Protocol/I/O boundary"],
    engineeringInputs:["Interface list","Signal/protocol","Cause & effect","Responsibility boundary"],
    architecture:"Interface architecture partial; exact I/O/protocol/gateway remains open.",
    requiredMtoState:"I/O / gateway / license / accessories derive from controlled interface graph."
  },
  "REQ-PAGA-007":{
    fundamentalNeed:"System must be engineered, verified, accepted, handed over and supportable.",
    interfaceContext:["Vendor/TSI/EPC/Company boundary","Factory/site event grouping","Document workflow"],
    engineeringInputs:["VDRL","Review cycles","Test cases","Witness points","Crew/duration/travel grouping"],
    architecture:"Lifecycle = documents + FAT/IFAT + site integration/SAT/commissioning + handover/warranty.",
    requiredMtoState:"Creates document/test/work objects and B1/B3/B4 drivers; not a pure equipment MTO."
  }
};

export function pagaRequirementMethodDetail(id){
  return PROJECT0550_PAGA_REQUIREMENT_METHOD_DETAIL[id] || null;
}
