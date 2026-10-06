/*
PJ2608-0550 — A1 15-LINE PRICE AUDIT
Audit priority: Google Drive project evidence first.
This registry does not upgrade a historical/proxy input into a current quote.
*/

export const PROJECT0550_A1_PRICE_AUDIT = {
  "A1-01":{
    grade:"HISTORICAL / PROXY",
    verdict:"USE AS BUDGETARY ONLY",
    basis:"Current 0550 quantities mapped to historical LAN/KU/AIS unit rates and completion allowances in Rev04 model.",
    source:"Rev04 Budget Model + MR App1.2/App1.3; no current LAN/KU commercial quotation found in GDrive.",
    action:"Obtain current Cisco/network + KU equipment quote; keep airtime/OPEX separate."
  },
  "A1-02":{
    grade:"DUMMY / NO CURRENT QUOTE",
    verdict:"REPRICE REQUIRED",
    basis:"Non-free-issued VSAT accessories/cable/interface completion allowance.",
    source:"Rev04 Budget Model; THAICOM technical/RFQ documents found, but no current commercial quote found in GDrive.",
    action:"Replace with current THAICOM / nominated VSAT commercial quotation and free-issue inventory."
  },
  "A1-03":{
    grade:"HISTORICAL UNIT RATE",
    verdict:"USE AS BUDGETARY ONLY",
    basis:"4 working VCS locations × historical system rate.",
    source:"Rev04 Budget Model + current 0550 VCS requirement; no current VCS vendor quote found in GDrive.",
    action:"Confirm 4th location, Teams-room BOM/licenses and obtain current quote."
  },
  "A1-04":{
    grade:"HISTORICAL UNIT RATE",
    verdict:"USE AS BUDGETARY ONLY",
    basis:"Current MR phone/PBX quantities mapped to historical IP phone / PBX / Ex-phone unit rates.",
    source:"Rev04 Budget Model + MR App1.3; no current AVAYA/PABX commercial quote found in GDrive.",
    action:"Obtain current Avaya phones/server/licenses/gateway/trunk quote and Ex-phone completion."
  },
  "A1-05":{
    grade:"CURRENT QUOTE / SELECTED",
    verdict:"VALID SOURCE — OPEN GAPS",
    basis:"INDUSTRONIC Offer A20261632; selected PAGA basis.",
    source:"A20261632.pdf in GDrive; base net EUR 226,454.05. Current controlled priced additions AP712 +1 and XBC are tracked separately.",
    action:"Close sound/loading/loop/autonomy/interface proof, site service, spares and FCA onward logistics before firm customer sell."
  },
  "A1-06":{
    grade:"CURRENT QTY + MARKET SANITY",
    verdict:"REVISED BUDGETARY",
    basis:"Current 0550 known quantity = 55 cameras; market sanity for Ex/indoor cameras, NVR/storage/monitor/network accessories.",
    source:"MR/App1.3 current quantities in GDrive; no current Hikvision project quotation found. Historical 24-Ex-PTZ basis rejected.",
    action:"Replace with current project Hikvision quote after coverage/lens/storage/certification/AMS01 closure."
  },
  "A1-07":{
    grade:"HISTORICAL CURRENT-QTY",
    verdict:"REPRICE REQUIRED",
    basis:"Current MR DMR quantities applied to historical radio unit rates.",
    source:"Rev04 Budget Model; Jason QT2026-160 does NOT cover VHF DMR system.",
    action:"Obtain current Motorola/Hytera DMR quote incl repeaters, mobiles, 98 Ex/UL handhelds, gateways/consoles/antenna system."
  },
  "A1-08":{
    grade:"CURRENT QUOTE PARTIAL + MIXED-SOURCE COMPLETION",
    verdict:"BUDGETARY ONLY — NOT FIRM",
    vendor:"JASON ELECTRONICS (THAILAND) CO., LTD.",
    quoteRef:"QT2026-160 · 16-Sep-2026",
    modelStatus:"CBE / PARAMETRIC = PARTIAL",
    basis:"Project quantity is mapped to current Jason equipment prices, then completed with historical antenna/gateway/handheld rates, bulk proxy and commercial rule.",
    source:"QT2026-160 + MR App1.1 + Rev04 First-Principles Budget Model.",
    quantityBasis:["Fixed radio sets 6","Antennas 6","IP gateways 6","Handheld radios 10"],
    buildUp:[
      {priceClass:"CURRENT QUOTE",item:"SAILOR 7222",qty:"6",unitPriceThb:80500,amountThb:483000},
      {priceClass:"CURRENT QUOTE",item:"U-mount bracket",qty:"6",unitPriceThb:2300,amountThb:13800},
      {priceClass:"CURRENT QUOTE",item:"N163S PSU",qty:"6",unitPriceThb:15350,amountThb:92100},
      {priceClass:"HISTORICAL COMPLETION",item:"Marine antenna",qty:"6",unitPriceThb:20000,amountThb:120000},
      {priceClass:"HISTORICAL COMPLETION",item:"IP gateway",qty:"6",unitPriceThb:50000,amountThb:300000},
      {priceClass:"HISTORICAL COMPLETION",item:"Handheld radio",qty:"10",unitPriceThb:45000,amountThb:450000},
      {priceClass:"A1 EQUIPMENT SUBTOTAL",item:"A1-024 equipment",qty:"1 lot",amountThb:1458900},
      {priceClass:"HISTORICAL BULK PROXY",item:"BLK-005 feeder allocation",qty:"1 lot",amountThb:205000},
      {priceClass:"COMMON BULK ALLOCATION",item:"Shared support / tags / completion",qty:"1 lot",amountThb:30624},
      {priceClass:"CONTROLLED COST",item:"Before commercial rule",qty:"",amountThb:1694524},
      {priceClass:"SELLING PRICE",item:"Cost x 1.20 / 0.95",qty:"",amountThb:2140451.37}
    ],
    action:"Replace historical and proxy rows with a complete current Marine vendor BOM/quote and close RF, feeder, licensing and commissioning scope."
  },
  "A1-09":{
    grade:"CURRENT QUOTE PARTIAL",
    verdict:"BUDGETARY WITH COMPLETION PROXY",
    basis:"Jason aeronautical fixed radio + antenna + lightning anchor; handheld/gateway completion remains historical/working.",
    source:"QT2026-160 dated 16-Sep-2026 + MR App1.1.",
    action:"Close DCA / 1+1 architecture / handheld / gateway / certification."
  },
  "A1-10":{
    grade:"CURRENT QUOTE PARTIAL",
    verdict:"BUDGETARY WITH COMPLETION PROXY",
    basis:"Jason MF/HF 150W radio/ATU/power/antenna hardware anchor plus historical IP-gateway/site completion.",
    source:"QT2026-160 dated 16-Sep-2026 + MR App1.1.",
    action:"Confirm exact site quantity, gateway, licence/frequency and feeder/mounting."
  },
  "A1-11":{
    grade:"PARTIAL CURRENT QUOTE + HISTORICAL MW/WBB",
    verdict:"REVISED BUDGETARY",
    basis:"Current 30m+60m tower supply portion THB 3.9425M + MW/WBB historical/current-topology equipment allowance THB 3.0M.",
    source:"Tower quotes 2609.95.1/2609.95.2 dated 22-Sep-2026 + Rev04 MW/WBB model. Civil/erection excluded to C1; engineering/logistics separated.",
    action:"Replace THB 3.0M MW/WBB proxy with current Ceragon/RADWIN/MGW quotation after link-budget proof."
  },
  "A1-12":{
    grade:"HISTORICAL CURRENT-QTY",
    verdict:"USE AS BUDGETARY ONLY",
    basis:"Current MR AV quantities × historical rates + completion allowance.",
    source:"Rev04 Budget Model; no current entertainment vendor quotation found in GDrive.",
    action:"Obtain current TV/AV/TVRO/projector/STB/audio quote and reconcile VCS overlap."
  },
  "A1-13":{
    grade:"HISTORICAL ROUTE PROXY",
    verdict:"HOLD FOR CURRENT MTO",
    basis:"Historical FO route quantities/rates; exact current route MTO is not yet bound.",
    source:"Rev04 Budget Model + historical cost library; current exact route take-off pending.",
    action:"Rebuild from current LIS/MTO/DWG/route length/core/termination/splice/test requirements."
  },
  "A1-14":{
    grade:"CURRENT QUOTE PARTIAL + HISTORICAL COMPLETION",
    verdict:"BUDGETARY ONLY",
    basis:"Jason RM YOUNG anemometer THB 120k is a current sensor anchor; full 2-station MET package remains historical working allowance.",
    source:"QT2026-160 dated 16-Sep-2026 + Rev04 model + MR/SPE-0014.",
    action:"Obtain complete MET package quote incl sensors, logger/server/monitor/cabinet/interface/calibration."
  },
  "A1-15":{
    grade:"CURRENT QUOTE PARTIAL",
    verdict:"BUDGETARY WITH COMPLETION ALLOWANCE",
    basis:"Jason FLUGCOM Dual NDB125 rack THB 2.45M is current quote; working complete-system allowance remains above quoted transmitter package.",
    source:"QT2026-160 dated 16-Sep-2026 + MR App1.7 / NDB requirement.",
    action:"Close NDB coverage criterion, antenna/counterpoise, DCA/regulatory, remote monitoring and commissioning."
  }
};

export function auditForA1(code){
  return PROJECT0550_A1_PRICE_AUDIT[code] || null;
}
