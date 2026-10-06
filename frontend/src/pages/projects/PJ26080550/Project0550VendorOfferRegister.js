/*
PJ2608-0550 — Vendor Offer Register for Price Cross-Check

Rules:
1) vendorItems = AS QUOTED from source evidence. Do not normalize in this view.
2) reconciliation = Required vs Offered comparison. Derived/engineering layer only.
3) Missing vendor quote stays explicit. Never replace with zero.
*/

export const PROJECT0550_VENDOR_OFFER_REGISTER = {
  "A1-05":{
    vendor:"INDUSTRONIC Industrie-Electronic GmbH & Co. KG",
    quoteRef:"A20261632",
    quoteDate:"03-Sep-2026",
    currency:"EUR",
    incoterm:"FCA Wertheim/Germany · INCOTERMS 2020",
    validity:"31-Dec-2026",
    quotedTotalBeforeDiscount:255115.00,
    discount:28660.95,
    quotedFinal:226454.05,
    status:"CURRENT QUOTE / SELECTED",
    vendorItems:[
      {group:"Main Node",item:"INTRON-X Node — APF Control Building",qty:1,unit:"U",unitPrice:40062,total:40062,inFinal:true},
      {group:"Main Node",item:"INTRON-X Node — ACP Office/Guard House + Truck Loading",qty:1,unit:"U",unitPrice:33790,total:33790,inFinal:true},
      {group:"Remote Node",item:"Remote Amplifier Node — APF Accommodation",qty:1,unit:"U",unitPrice:22229,total:22229,inFinal:true},
      {group:"Remote Node",item:"Remote Amplifier Node — Catering/Store/Office/Security",qty:4,unit:"U",unitPrice:15944,total:63776,inFinal:true},
      {group:"Master Call Station",item:"AP712 Access Panel",qty:4,unit:"U",unitPrice:3210,total:12840,inFinal:true},
      {group:"Field Call Station",item:"DX705 Ex Field Call Station",qty:2,unit:"U",unitPrice:2367,total:4734,inFinal:true},
      {group:"Speaker",item:"LD 8 UE/IP54 EN54 Ceiling Speaker",qty:124,unit:"U",unitPrice:75,total:9300,inFinal:true},
      {group:"Speaker",item:"DSP 15 25W Ex Horn Speaker",qty:57,unit:"U",unitPrice:295,total:16815,inFinal:true},
      {group:"Beacon",item:"GNExB2X21 Ex Beacon",qty:9,unit:"U",unitPrice:910,total:8190,inFinal:true},
      {group:"Beacon",item:"MBX21 Beacon",qty:4,unit:"U",unitPrice:798,total:3192,inFinal:true},
      {group:"Tools",item:"Special Tools",qty:1,unit:"Lot",unitPrice:null,total:2902,inFinal:true},
      {group:"Software",item:"Activation",qty:1,unit:"Lot",unitPrice:null,total:13225,inFinal:true},
      {group:"Documentation",item:"Documentation & Project Management",qty:1,unit:"Lot",unitPrice:null,total:16000,inFinal:true},
      {group:"Service",item:"Service",qty:1,unit:"Lot",unitPrice:null,total:3060,inFinal:true},
      {group:"Packing",item:"Packing Charges",qty:1,unit:"Lot",unitPrice:null,total:5000,inFinal:true},
      {group:"OPTION",item:"Redundant XCO Controller",qty:1,unit:"U",unitPrice:3328,total:3328,inFinal:false},
      {group:"OPTION",item:"Redundant Managed FE Switch",qty:1,unit:"U",unitPrice:3408,total:3408,inFinal:false},
      {group:"OPTION",item:"Engineering Test Panel",qty:1,unit:"U",unitPrice:1894,total:1894,inFinal:false},
      {group:"OPTION",item:"XBC Beacon Control Module",qty:1,unit:"U",unitPrice:2014,total:2014,inFinal:false},
      {group:"OPTION",item:"AP Additional Keypad",qty:1,unit:"U",unitPrice:681,total:681,inFinal:false},
      {group:"OPTION",item:"XST Pro Activation Key",qty:1,unit:"U",unitPrice:400,total:400,inFinal:false}
    ],
    reconciliation:[
      {object:"Main INTRON-X nodes",required:2,offered:2,unit:"set",gap:0,status:"ALIGNED"},
      {object:"Remote amplifier nodes",required:5,offered:5,unit:"set",gap:0,status:"ALIGNED"},
      {object:"Indoor speakers",required:124,offered:124,unit:"pc",gap:0,status:"ALIGNED"},
      {object:"Outdoor / Ex speakers",required:57,offered:57,unit:"pc",gap:0,status:"ALIGNED"},
      {object:"Master Call Stations / OAP",required:5,offered:4,unit:"pc",gap:-1,status:"GAP — +1 AP712"},
      {object:"Field Call Stations / OCU",required:2,offered:2,unit:"pc",gap:0,status:"ALIGNED"},
      {object:"Beacons",required:13,offered:13,unit:"pc",gap:0,status:"ALIGNED"},
      {object:"Beacon monitoring / XBC",required:1,offered:0,unit:"module in base",gap:-1,status:"OPTION / NOT IN BASE"}
    ]
  },

  "A1-08":{
    vendor:"JASON ELECTRONICS (THAILAND) CO., LTD.",
    quoteRef:"QT2026-160",
    quoteDate:"16-Sep-2026",
    currency:"THB",
    incoterm:"Not stated as turnkey Marine package; quote excludes cable, installation, commissioning and transportation",
    quotedFinal:null,
    status:"CURRENT QUOTE PARTIAL",
    vendorItems:[
      {group:"Marine",item:"SAILOR 7222 VHF DSC Class A",qty:1,unit:"set",unitPrice:80500,total:80500,inFinal:true},
      {group:"Marine",item:"U-mount bracket kit",qty:1,unit:"pc",unitPrice:2300,total:2300,inFinal:true},
      {group:"Marine",item:"SAILOR N163S Power Supply",qty:1,unit:"pc",unitPrice:15350,total:15350,inFinal:true}
    ],
    reconciliation:[
      {object:"Fixed Marine radio",required:6,offered:1,unit:"set",gap:-5,status:"PARTIAL QUOTE"},
      {object:"Marine antenna",required:6,offered:0,unit:"pc",gap:-6,status:"NOT QUOTED"},
      {object:"Marine IP gateway",required:6,offered:0,unit:"pc",gap:-6,status:"NOT QUOTED"},
      {object:"Marine handheld",required:10,offered:0,unit:"pc",gap:-10,status:"NOT QUOTED"}
    ]
  },

  "A1-09":{
    vendor:"JASON ELECTRONICS (THAILAND) CO., LTD.",
    quoteRef:"QT2026-160",
    quoteDate:"16-Sep-2026",
    currency:"THB",
    status:"CURRENT QUOTE PARTIAL",
    vendorItems:[
      {group:"Aero",item:"TR-810 DE Transceiver Desktop",qty:1,unit:"pc",unitPrice:165000,total:165000,inFinal:true},
      {group:"Aero",item:"Procom CXL3-1LW Antenna 118-137 MHz",qty:1,unit:"pc",unitPrice:18500,total:18500,inFinal:true},
      {group:"Aero",item:"Lightning Protector",qty:1,unit:"pc",unitPrice:29000,total:29000,inFinal:true}
    ],
    reconciliation:[
      {object:"Aero fixed radio",required:1,offered:1,unit:"pc",gap:0,status:"ALIGNED"},
      {object:"Aero antenna",required:1,offered:1,unit:"pc",gap:0,status:"ALIGNED"},
      {object:"Aero IP gateway",required:1,offered:0,unit:"pc",gap:-1,status:"NOT QUOTED"},
      {object:"Aero handheld",required:4,offered:0,unit:"pc",gap:-4,status:"NOT QUOTED"}
    ]
  },

  "A1-10":{
    vendor:"JASON ELECTRONICS (THAILAND) CO., LTD.",
    quoteRef:"QT2026-160",
    quoteDate:"16-Sep-2026",
    currency:"THB",
    status:"CURRENT QUOTE PARTIAL",
    vendorItems:[
      {group:"SSB",item:"SAILOR MF/HF SYSTEM 6000B 150W",qty:1,unit:"set",unitPrice:330000,total:330000,inFinal:true},
      {group:"SSB",item:"SAILOR 6080 AC/DC PSU",qty:1,unit:"set",unitPrice:32000,total:32000,inFinal:true},
      {group:"SSB",item:"Wall-mounting tray",qty:1,unit:"set",unitPrice:6000,total:6000,inFinal:true},
      {group:"SSB",item:"COMROD AT82M Tx Antenna",qty:1,unit:"set",unitPrice:39500,total:39500,inFinal:true},
      {group:"SSB",item:"COMROD AR62M Rx Antenna",qty:1,unit:"set",unitPrice:39500,total:39500,inFinal:true}
    ],
    reconciliation:[
      {object:"SSB system/site",required:2,offered:1,unit:"set",gap:-1,status:"PARTIAL QUOTE"},
      {object:"SSB IP gateway",required:2,offered:0,unit:"pc",gap:-2,status:"NOT QUOTED"}
    ]
  },

  "A1-14":{
    vendor:"JASON ELECTRONICS (THAILAND) CO., LTD.",
    quoteRef:"QT2026-160",
    quoteDate:"16-Sep-2026",
    currency:"THB",
    status:"CURRENT QUOTE PARTIAL",
    vendorItems:[
      {group:"MET",item:"RM YOUNG 86106 Ultrasonic Anemometer",qty:1,unit:"set",unitPrice:120000,total:120000,inFinal:true}
    ],
    reconciliation:[
      {object:"Meteorological station",required:2,offered:0,unit:"complete system",gap:-2,status:"FULL SYSTEM NOT QUOTED"},
      {object:"Ultrasonic anemometer",required:"TBC per station",offered:1,unit:"set",gap:"TBC",status:"PARTIAL SENSOR ANCHOR"}
    ]
  },

  "A1-15":{
    vendor:"JASON ELECTRONICS (THAILAND) CO., LTD.",
    quoteRef:"QT2026-160",
    quoteDate:"16-Sep-2026",
    currency:"THB",
    status:"CURRENT QUOTE PARTIAL",
    vendorItems:[
      {group:"NDB",item:"FLUGCOM Dual NDB125 Transmitter Rack",qty:1,unit:"set",unitPrice:2450000,total:2450000,inFinal:true,note:"Includes dual 125W transmitters, changeover, dummy load, cabinet/accessories, FAT100 ATU, system documentation, helideck long-wire antenna/accessories, FRT100 remote/monitoring"}
    ],
    reconciliation:[
      {object:"NDB system",required:1,offered:1,unit:"lot",gap:0,status:"PACKAGE ANCHOR"},
      {object:"Coverage / antenna-counterpoise / DCA compliance",required:"Required",offered:"Not proven by price line",unit:"proof",gap:"OPEN",status:"ENGINEERING CLOSURE"}
    ]
  },

  "A1-11":{
    vendor:"Tower contractor — quotations 2609.95.1 / 2609.95.2",
    quoteRef:"2609.95.1 (60m) + 2609.95.2 (30m)",
    quoteDate:"22-Sep-2026",
    currency:"THB",
    status:"CURRENT TOWER QUOTE / MW-WBB OEM QUOTE OPEN",
    vendorItems:[
      {group:"60m Tower",item:"Full quoted package",qty:1,unit:"LS",unitPrice:null,total:5191700,inFinal:true,note:"Includes PM, tower/accessories, paint, warning light, lightning, TSSR, soil investigation, design, civil, erection, earthing, fencing, finishing, delivery, as-built"},
      {group:"30m Tower",item:"Full quoted package",qty:1,unit:"LS",unitPrice:null,total:1981300,inFinal:true,note:"Includes PM, tower/accessories, paint, warning light, lightning, TSSR, soil investigation, design, civil, erection, earthing, fencing, finishing, delivery, as-built"}
    ],
    reconciliation:[
      {object:"60m tower",required:1,offered:1,unit:"set",gap:0,status:"CURRENT QUOTE"},
      {object:"30m tower",required:1,offered:1,unit:"set",gap:0,status:"CURRENT QUOTE"},
      {object:"Microwave APF-ACP equipment",required:1,offered:0,unit:"link",gap:-1,status:"CURRENT OEM QUOTE NOT FOUND"},
      {object:"WBB APF/APM equipment",required:"Required",offered:0,unit:"link/package",gap:"OPEN",status:"CURRENT OEM QUOTE NOT FOUND"}
    ]
  }
};

export function vendorOfferForPriceLine(code){
  return PROJECT0550_VENDOR_OFFER_REGISTER[code] || null;
}
