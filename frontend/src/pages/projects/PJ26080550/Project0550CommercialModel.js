/*
PJ2608-0550 — COMMERCIAL GROUP / SYSTEM MAPPING

The customer ASK-TSI price form has 15 A1 lines while the controlled engineering
architecture has 19 telecom systems. This registry keeps those identities separate.

Rule:
- One price line may roll up multiple engineering systems.
- A commercial roll-up must never silently merge engineering requirements.
- Shared/composite lines are flagged; system-level allocation remains OPEN until a
  defensible cost driver is available.
*/

export const PROJECT0550_COMMERCIAL_GROUPS = [
  {lineCode:"A1-01",label:"Network / KU / AIS composite",systemTokens:["TEL-LAN","TEL-VSAT-KU","TEL-AIS"],allocation:"COMPOSITE / SYSTEM ALLOCATION OPEN"},
  {lineCode:"A1-02",label:"VSAT",systemTokens:["TEL-VSAT"],allocation:"1:1"},
  {lineCode:"A1-03",label:"Video Conference",systemTokens:["TEL-LAN-VCS"],allocation:"1:1"},
  {lineCode:"A1-04",label:"IP Telephony / Field Phone",systemTokens:["TEL-PABX","TEL-IPP"],allocation:"COMPOSITE / SYSTEM ALLOCATION OPEN"},
  {lineCode:"A1-05",label:"PAGA",systemTokens:["TEL-PAGA"],allocation:"1:1"},
  {lineCode:"A1-06",label:"CCTV",systemTokens:["TEL-CCTV"],allocation:"1:1"},
  {lineCode:"A1-07",label:"VHF DMR",systemTokens:["TEL-RADIO-DTRS"],allocation:"1:1"},
  {lineCode:"A1-08",label:"VHF-FM Marine",systemTokens:["TEL-RADIO-MARINE"],allocation:"1:1"},
  {lineCode:"A1-09",label:"VHF-AM Aero",systemTokens:["TEL-RADIO-AERO"],allocation:"1:1"},
  {lineCode:"A1-10",label:"MF/HF SSB",systemTokens:["TEL-RADIO-SSB"],allocation:"1:1"},
  {lineCode:"A1-11",label:"Microwave / Tower",systemTokens:["TEL-DMR","TEL-TELT"],allocation:"COMPOSITE / SYSTEM ALLOCATION OPEN"},
  {lineCode:"A1-12",label:"Entertainment",systemTokens:["TEL-ES"],allocation:"1:1"},
  {lineCode:"A1-13",label:"Fiber Optic",systemTokens:["TEL-FO"],allocation:"1:1"},
  {lineCode:"A1-14",label:"Meteorological",systemTokens:["TEL-MET"],allocation:"1:1"},
  {lineCode:"A1-15",label:"NDB",systemTokens:["TEL-NDB"],allocation:"1:1"}
];

export function commercialGroupForLine(lineCode){
  return PROJECT0550_COMMERCIAL_GROUPS.find(x=>x.lineCode===lineCode) || null;
}

export function linesForSystemToken(token){
  return PROJECT0550_COMMERCIAL_GROUPS.filter(x=>x.systemTokens.includes(token)).map(x=>x.lineCode);
}

export function isCompositeCommercialLine(lineCode){
  const row=commercialGroupForLine(lineCode);
  return Boolean(row && row.systemTokens.length>1);
}
