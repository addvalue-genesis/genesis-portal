// Exact PTTEP Client DTS Baseline: MM-ASK-1A-APF-TEL-DTS-0003 Rev.B1 (PUBLIC ADDRESS AND GENERAL ALARM SYSTEM)
// Answered WITH BID against Volume I (11.C1 / APPENDIX 1.4) AS-IS Equipment Lock: INDUSTRONIC INTRON-X (A20261632-002 / -005)

export function buildPagaClientDtsSheets0550(area = 'APF') {
  const isAcp = area === 'ACP';
  const locText = isAcp ? 'ACP' : 'APF, ACP';

  const makeRows = (rows, model, partNo) =>
    rows.map(([item, parameter, requirement, offered, compliance, remarks]) => ({
      item,
      parameter,
      requirement,
      offered,
      compliance,
      remarks,
      model,
      partNo,
      isSectionHeader: compliance === 'HEADER',
    }));

  // Sheet 2: PUBLIC ADDRESS AND GENERAL ALARM (PAGA) SYSTEM — Industronic INTRON-X Main Rack
  const mainRows = makeRows(
    [
      ['1', 'Tag. Number', 'Refer to Tag number on page 9 to 12', 'Refer to Equipment Tag List (Page 9)', 'COMPLY', 'PAGA-303-351 (APF Main), PAGA-303-001 (ACP Main)'],
      ['2', 'Service', 'Refer to Tag number on page 9 to 12', 'Refer to Equipment Tag List (Page 9)', 'COMPLY', 'Public Address & General Alarm Central System'],
      ['3', 'Location', 'APF, ACP', locText, 'COMPLY', 'Control Building / E&I Cabin Technical Room'],
      ['4', 'Area Classification', 'Non-Classified', 'Non-Classified (Safe Area)', 'COMPLY', 'Indoor equipment room'],
      ['5', 'Ambient Temperature, °C (max. / min. / design)', '38.7 / 19.1 / 40', '0 °C to +45 °C continuous (Storage -25 °C to +70 °C)', 'COMPLY', 'Industronic INTRON-X Datasheet'],
      ['6', 'Relative Humidity, % (design)', '91.4', 'Up to 95% non-condensing', 'COMPLY', 'Industronic INTRON-X Datasheet'],
      ['7', 'Room Operating Temperature (°C)', '20 - 25', '20 - 25 °C inside Rittal VX25 IP54 Cabinet', 'COMPLY', 'VX-8825-IX'],
      ['8', 'Site Environment', 'On Shore or Off Shore (depend by location)', isAcp ? 'Offshore Platform' : 'Onshore / Offshore Processing Facility', 'COMPLY', 'Industrial marine/onshore cabinet'],
      ['9', 'Manufacturer', 'VTA', 'INDUSTRONIC Industrie-Electronic GmbH & Co. KG', 'DEVIATE', 'DEV-AVL-PAGA-INDUSTRONIC: Selected non-AVL manufacturer (Tab 14 Deviation List)'],
      ['10', 'Model/Part No.', 'VTA', 'INTRON-X Main Rack (A+B) / P/N: IX-MAIN-351 (IX-MAIN-ACP)', 'COMPLY', 'Volume I APPENDIX 1.4 AS-IS Model'],
      ['11', 'Power supply', '230 VAC with the isolated power designed', '230 VAC Dual-Redundant + 24/48 VDC Battery Backup', 'COMPLY', 'Isolated dual PSU in VX-8825-IX'],
      ['12', 'Controller', 'Dual microprocessor based / Hot Standby controller modules', 'Dual-Redundant INTRON-X Central Control Units (Hot Standby)', 'COMPLY', 'A20261632-005 XBC / Main Node'],
      ['13', 'External interface requirement', 'Fire and Gas, PABX, and Entertainment Mute line interfaces', 'F&G (Modbus/Hardwired), IP-PABX SIP/E&M, Entertainment Mute', 'COMPLY', 'Integrated I/O & IP gateway'],
      ['14', 'Number of Alarm Tones', 'Minimum 3 tone', 'Programmable multi-tone generator (> 8 standard alarm tones)', 'COMPLY', 'GA / APA / Fire / Toxic Gas'],
      ['15', 'Number of Broadcast Zones', 'Minimum 4 zone', 'Modular multi-zone matrix (up to 64+ zones; configured per APF/ACP)', 'COMPLY', 'Per APF/ACP zone schedule'],
      ['16', 'Test Tick Tone', 'Supported', 'Supported (Programmable loop test tick tone)', 'COMPLY', 'Industronic INTRON-X'],
      ['17', 'Compression on Voice Inputs', 'VTA', 'Automatic Gain Control (AGC) & Voice Compression integrated', 'COMPLY', 'Preliminary per datasheet; final value confirmed per post-award Path Loss / Link Budget report'],
      ['18', 'Frequency Response', '50 Hz – 18 kHz (-3 dB) / Speech band 200 Hz – 10 kHz +- 3 dB at full rated power', '50 Hz – 18 kHz (-3 dB) / Speech 200 Hz – 10 kHz ± 2 dB', 'COMPLY', 'Industronic INTRON-X'],
      ['19', 'Line monitoring Level', 'Supported', 'Supported (Continuous EOL & Impedance Loop Supervision)', 'COMPLY', 'VX-8805-IX EOL modules'],
      ['20', 'Audio Output Level', 'Supported', 'Supported (100 Vrms constant voltage line)', 'COMPLY', 'Industronic INTRON-X'],
      ['21', 'Auto Diagnostics', 'Supported', 'Supported (CPU, Amplifier, Speaker Loop, Mic & PSU self-test)', 'COMPLY', 'SNMP / Dry-contact fault output'],
      ['22', 'Signal Process Unit', 'Yes', 'Yes (DSP Matrix & Digital Audio Processing)', 'COMPLY', 'INTRON-X DSP'],
      ['23', 'Alarm Tone Generator', 'Yes', 'Yes (Dual-redundant digital tone & voice message storage)', 'COMPLY', 'INTRON-X'],
      ['24', 'Access and Monitor Panel', 'Yes (installed in the cabinet of PAGA)', 'Yes (Cabinet-mounted monitor speaker & status panel)', 'COMPLY', 'INTRON-X'],
      ['25', 'Access Unit Interfaces', 'Yes', 'Yes (Digital/IP & 2-wire bus interfaces for OAP/RAP)', 'COMPLY', 'INTRON-X'],
      ['26', 'Override Control Unit Interface', 'Yes', 'Yes (Hardwired ESD/F&G OCU interface)', 'COMPLY', 'OCU-IX-100'],
      ['27', 'Voice Message Store', 'Yes', 'Yes (Solid-state digital pre-recorded voice announcements)', 'COMPLY', 'INTRON-X'],
      ['28', 'Fibre Optic Interface', 'Yes', 'Yes (Redundant Fiber Optic inter-rack ring)', 'COMPLY', 'APF sub-rack fiber ring'],
      ['29', 'Entertainment System Mute Facility', 'Yes', 'Yes (Dry contact / IP mute output on PA/GA activation)', 'COMPLY', 'INTRON-X'],
      ['30', 'POWER AMPLIFIER', '', '', 'HEADER', ''],
      ['31', 'Amplifier Design', 'High Efficiency Class D/Switching PWM microprocessor-controlled "intelligent" design', 'High-Efficiency Class D PWM Microprocessor-Controlled Amplifier', 'COMPLY', 'Industronic INTRON-X Class D'],
      ['32', 'Output power', 'Amplifier Output not less than 200w and not exceed 400w by (VTA)', '250 W / 400 W modular Class D channels (VTA per SPL study)', 'COMPLY', 'Industronic INTRON-X Amp'],
      ['33', 'Signal to Noise Ratio', 'at least 75 dB at full rated power', '> 80 dB at full rated power', 'COMPLY', 'Industronic Datasheet'],
      ['34', 'Full Power Efficiency', '80%', '≥ 85% Class D efficiency', 'COMPLY', 'Industronic Datasheet'],
      ['35', 'Rated Power', '200 - 400 W', '250 W – 400 W per amplifier module (N+1 hot-standby)', 'COMPLY', 'Industronic Datasheet'],
      ['36', 'Input Common Mode Rejection Rate', '> 50 dB', '> 60 dB', 'COMPLY', 'Industronic Datasheet'],
      ['37', 'Input Sensitivity', '0 dBm', '0 dBm (0.775 Vrms) balanced', 'COMPLY', 'Industronic Datasheet'],
      ['38', 'Total Harmonic Distortion', 'less than 2% at full rated power (1 kHz)', '< 1.0% at full rated power (1 kHz)', 'COMPLY', 'Industronic Datasheet'],
      ['39', 'Frequency Response (Amplifier)', '50 Hz – 18 kHz (-3 dB) / Speech band 200 Hz – 10 kHz +- 3 dB at full rated power', '50 Hz – 18 kHz (-3 dB) / Speech 200 Hz – 10 kHz ± 2 dB', 'COMPLY', 'Industronic Datasheet'],
      ['40', 'Amplifier Class Operation', 'Class D', 'Class D Switching PWM', 'COMPLY', 'Industronic Datasheet'],
      ['41', 'Distortion', 'Better than 2% at full rated power (1 kHz)', '< 1% THD at 1 kHz', 'COMPLY', 'Industronic Datasheet'],
      ['42', 'Regulation', '3 dB', '< 2 dB (no-load to full-load)', 'COMPLY', 'Industronic Datasheet'],
      ['43', 'Thermal Shutdown Protection', 'Yes', 'Yes (Auto-reset thermal protection)', 'COMPLY', 'Industronic Datasheet'],
      ['44', 'Electronics Status Failure Alarm', 'Yes', 'Yes', 'COMPLY', 'Industronic Datasheet'],
      ['45', 'Amplifier Alarm', 'Yes', 'Yes (Automatic switchover to standby amp)', 'COMPLY', 'Industronic Datasheet'],
      ['46', 'ELECTRICAL & MECHANICAL', '', '', 'HEADER', ''],
      ['47', 'Primary Power Supply', '24/48 VTA', '230 VAC + 24/48 VDC Dual-Redundant Input (VTA)', 'COMPLY', 'VX-8825-IX'],
      ['48', 'Line Output Transform Voltage', '100V line', '100 Vrms transformer-isolated line', 'COMPLY', 'Industronic Datasheet'],
      ['49', 'Open / Short Circuit Protection', 'Yes', 'Yes (Open, short, and earth-fault protected)', 'COMPLY', 'Industronic Datasheet'],
      ['50', 'Hot-Swap Capable', 'Yes', 'Yes (Hot-swappable amplifier & I/O modules)', 'COMPLY', 'Industronic INTRON-X'],
      ['51', 'Mounting Option', '19" Standard Rack', '19" Standard Rack inside Rittal VX25 Cabinet', 'COMPLY', 'VX-8825-IX'],
      ['52', 'Dimensions (W × D × H)', '800 × 800 × 2100 mm (Weight VTA)', '800 × 1000 × 2200 mm (APF Main) / 800 × 800 × 2000 mm (Sub); Weight VTA', 'MINOR / CLARIFY', '1000mm depth on Main VX25 cabinet for cable bend radius'],
      ['53', 'Sub-Rack / Shelf & Labels', 'Yes', 'Yes (19" sub-racks with engraved SS/traffolyte labels)', 'COMPLY', 'Rittal VX25'],
      ['54', 'CABINET CHARACTERISTICS', '', '', 'HEADER', ''],
      ['55', 'Colour', 'RAL7035', 'RAL 7035 Light Grey Powder Coat (IP54)', 'COMPLY', 'Rittal VX25'],
      ['56', 'PAGA System Completeness', 'Controller, I/O Cards, Power Amplifiers, OAP, Loop Speakers & Flashing Beacon, Power Supply, Accessories', 'Complete INTRON-X System: Dual Controllers, I/O Cards, Class-D Amps, OAPs, Speakers, Beacons, Redundant PSU & Accessories', 'COMPLY', 'APPENDIX 1.4 Scope'],
      ['57', 'Network Communication Interface (VTA)', 'Ethernet 10/100/1000Base-T (RJ45) and/or Fiber Optic TCP/IP networking for Access Panels, Workstations, PABX, F&G, redundant architecture & remote diagnostics', 'Redundant Gigabit Ethernet RJ45 & Fiber Optic TCP/IP ring (INTRON-X IP) with remote SNMPv3 diagnostics', 'COMPLY', 'Rev.A1 Comment #1 Closed'],
      ['58', 'External Interface Requirement (VTA)', 'Fire & Gas System, IP-PABX, Entertainment Mute Interface, Remote IP Access Panel, Override Control Unit (OCU), and COMPANY Network Interface', 'All 6 interfaces supported via INTRON-X IP/Hardwired I/O cards', 'COMPLY', 'Rev.A1 Comment #1 Closed'],
    ],
    'INTRON-X Main Rack (A+B)',
    'IX-MAIN-351'
  );

  // Sheet 3: OVERRIDE CONTROL UNITS (OCU)
  const ocuRows = makeRows(
    [
      ['1', 'Tag. Number', 'Refer to Tag number on page 11', 'Refer to Equipment Tag List (Page 9)', 'COMPLY', 'OCU-303-001, OCU-303-002'],
      ['2', 'Service', 'MUSTER AREA', 'Master Point & Alternative Master Point ESD Override', 'COMPLY', 'APPENDIX 1.4 (1.4.1.4)'],
      ['3', 'Location', 'Indoor APF, ACP', locText, 'COMPLY', 'Control Room / Muster Area'],
      ['4', 'Area Classification', 'ATEX / IECEx Zone 1', 'ATEX / IECEx Zone 1 (or Safe Area Control Room per layout)', 'COMPLY', 'Industronic OCU'],
      ['5', 'Ambient Temperature / Humidity', '38.7 / 19.1 / 40 °C · 91.4% RH', '-20 °C to +55 °C / 95% RH non-condensing', 'COMPLY', 'Industronic Datasheet'],
      ['6', 'Equipment Name', 'Operator Access Panel / Remote Access Panel / ETP', 'Override Control Unit (OCU) with Status Matrix', 'COMPLY', 'OCU-IX-100'],
      ['7', 'Power supply input', '24 VDC (or 48 VDC from central PAGA rack or local Isolated Power (VTA)', '24 VDC from central PAGA rack (VTA)', 'COMPLY', 'OCU-IX-100'],
      ['8', 'Microphone Interface', 'Noise-cancelling gooseneck dynamic microphone with PTT key', 'Noise-cancelling gooseneck dynamic mic with PTT key', 'COMPLY', 'OCU-IX-100'],
      ['9', 'Zone Selection / Alarm Initiation', 'Dedicated tactile push buttons with dual-color LEDs; General Alarm / Abandon Platform under spring-loaded cover', '20-key tactile dual-LED matrix + guarded GA / APA push buttons', 'COMPLY', 'OCU-IX-100'],
      ['10', 'Supervision & Priority Control', 'Loop self-test and monitoring; Multi-level priority override', 'Continuous loop supervision & highest-priority hardware override', 'COMPLY', 'OCU-IX-100'],
      ['11', 'Mounting & Ingress Protection', '19" Rack-mount (3U/4U) / Console Flush / Desktop; IP42', 'Console Flush / 19" Rack Mount, IP42 (Indoor)', 'COMPLY', 'OCU-IX-100'],
      ['12', 'Connectivity & Manufacturer / Model', 'Industrial Ethernet Cat6 / 2-wire digital bus / RS-485; Manufacturer VTA / Model VTA', 'Industronic INTRON-X OCU (P/N: OCU-IX-100) — Cat6 IP / 2-wire bus', 'DEVIATE', 'DEV-AVL-PAGA-INDUSTRONIC (Tab 14 Deviation List)'],
    ],
    'INTRON-X OCU',
    'OCU-IX-100'
  );

  // Sheet 4: OPERATOR ACCESS PANEL (OAP)
  const oapRows = makeRows(
    [
      ['1', 'Tag. Number', 'Refer to Tag number on page 11', 'Refer to Equipment Tag List (Page 9)', 'COMPLY', 'OAP-303-001, OAP-303-002 (APF), OAP-303-001 (ACP)'],
      ['2', 'Service', 'MUSTER AREA', 'Control Room / Radio Room PAGA Operator Access Panel', 'COMPLY', 'APPENDIX 1.4 (1.4.1.5)'],
      ['3', 'Location', 'Outdoor / Indoor APF, ACP', locText, 'COMPLY', 'Control Room & Radio Room'],
      ['4', 'Area Classification', 'ATEX / IECEx Zone 1', 'Zone 1 / Safe Area variant per final Hazardous Area layout', 'COMPLY', 'AP712-IX'],
      ['5', 'Equipment Name', 'Panel Access Panel', 'Industronic AP712 / INTRON-X 20-Key Operator Access Panel', 'COMPLY', 'AP712-IX'],
      ['6', 'Operating Voltage', '24 VDC (or 48 VDC from central PAGA rack) VTA', '24 VDC powered from central INTRON-X PAGA rack (VTA)', 'COMPLY', 'AP712-IX'],
      ['7', 'Alarm Initiation & Status LEDs', '2x Push Buttons with protective flap covers; Power/Healthy, Alarm Active, Fault', 'Guarded GA/APA push buttons + Power/Healthy/Alarm/Fault LEDs', 'COMPLY', 'AP712-IX'],
      ['8', 'Microphone & Line Supervision', 'Fixed Noise-cancelling Mic with PTT; Detects open/short/ground fault', 'Noise-cancelling PTT mic + continuous line & mic supervision', 'COMPLY', 'AP712-IX'],
      ['9', 'Enclosure & Ingress Protection', 'GRP (VTA), IP66, Anti-static < 10^9 Ω, RAL 7035 / Black', 'GRP Anti-static enclosure (IP66 outdoor / IP42 console), RAL 7035', 'COMPLY', 'AP712-IX'],
      ['10', 'Manufacturer & Model', 'VTA / VTA', 'Industronic / AP712-IX Access Panel (P/N: AP712-IX)', 'DEVIATE', 'DEV-AVL-PAGA-INDUSTRONIC (Tab 14 Deviation List)'],
    ],
    'AP712-IX Access Panel',
    'AP712-IX'
  );

  // Sheet 5: HORN SPEAKER EXPLOSION PROOF (15W & 25W)
  const hornRows = makeRows(
    [
      ['1', 'Tag. Number', 'Refer to Tag number on page 9 to 12', 'Refer to Equipment Tag List (Page 9)', 'COMPLY', 'LSE-303-001..109 (APF 56 pcs, ACP 8 pcs)'],
      ['2', 'Service & Location', 'Various (Outdoor), APF, ACP', locText + ' — Process, Utility, Substation & Muster Areas', 'COMPLY', 'APPENDIX 1.4 (1.4.1.6)'],
      ['3', 'Area Classification & Certification', 'Zone 1 · ATEX (II2 G Exd IIA T3)', 'ATEX / IECEx Zone 1 Ex d IIB+H2 T4 (exceeds IIA T3)', 'COMPLY', 'Industronic / MEDC DA-EX-25-IX'],
      ['4', 'Rated Power & Output SPL', '15W / 25W RMS (VTA) · 124 dB @ 25W (VTA)', '25W RMS (tappings 1.5–25W), 116–124 dB(A) @ 1m (VTA per SPL study)', 'COMPLY', 'DA-EX-25-IX'],
      ['5', 'Frequency Range & Line Voltage', '0.3 - 8.0 kHz (VTA) · 100 V (VTA)', '300 Hz – 8.0 kHz · 100 Vrms constant voltage line', 'COMPLY', 'DA-EX-25-IX'],
      ['6', 'Ingress Protection & Material', 'IP65 · GRP · Black/Grey · 316SS bracket', 'IP66/IP67 UV-resistant GRP flare + 316L stainless steel mounting bracket', 'COMPLY', 'DA-EX-25-IX'],
      ['7', 'Cable Entries & Junction Box', '2x 1/2" NPT / 2x M20 Exe (VTA) 316SS', '2x M20 Ex e integrated termination chamber (316SS hardware)', 'COMPLY', 'DA-EX-25-IX'],
      ['8', 'Network Interface (Rev.A1 #2)', 'Ethernet 10/100Base-T (RJ45) TCP/IP for PAGA System & Remote Monitoring', '100V supervised loop + IP/Ethernet monitoring at PAGA sub-rack', 'MINOR / CLARIFY', '100V analog Ex d speakers monitored via INTRON-X IP EOL modules (Rev.A1 #2)'],
      ['9', 'Manufacturer & Model', 'VTA / Horn Loudspeaker', 'Industronic / Cooper MEDC DA-EX-25-IX (P/N: DA-EX-25-IX)', 'DEVIATE', 'DEV-AVL-PAGA-INDUSTRONIC (Tab 14 Deviation List)'],
    ],
    'DA-EX-25-IX (Ex d)',
    'DA-EX-25-IX'
  );

  // Sheet 6: LOUD SPEAKER CEILING/WALL MOUNTED
  const indoorRows = makeRows(
    [
      ['1', 'Tag. Number', 'Refer to Tag number on page 9 to 12', 'Refer to Equipment Tag List (Page 9)', 'COMPLY', 'LSN-303-151..509 (incl. LSN-303-365 ITR & LSN-303-414 Lab)'],
      ['2', 'Service & Location', 'APF, ACP (Non-Classified Indoor)', locText + ' — Buildings, Offices, Accommodation, Control & ITR Rooms', 'COMPLY', 'APPENDIX 1.4 (1.4.1.7)'],
      ['3', 'Rated Power & Tappings', '6 - 8 watt RMS (VTA) · Tappings (100V): 6W, 3W, 1.5W, 0.8W', '6W RMS 100V line (Tappings: 6W / 3W / 1.5W / 0.8W)', 'COMPLY', 'DL-6W-IX'],
      ['4', 'Output Power & Frequency Range', '97 @ 6W / 106 @ 8W (VTA) · 85 Hz to 18 kHz', '97 dB @ 6W/1m · 85 Hz – 18 kHz', 'COMPLY', 'DL-6W-IX'],
      ['5', 'Size, Dispersion & IP Rating', '150 mm (6") Ceiling/Wall · 90 Deg · IP42 · Grey', '150 mm (6") Ceiling/Wall Mount · 90° dispersion · IP42 · Grey/White', 'COMPLY', 'DL-6W-IX'],
      ['6', 'Hazardous Area & Manufacturer/Model', 'Non-Ex · VTA / VTA', 'Non-Ex · Industronic DL-6W-IX Indoor Speaker (P/N: DL-6W-IX)', 'DEVIATE', 'DEV-AVL-PAGA-INDUSTRONIC (Tab 14 Deviation List)'],
    ],
    'DL-6W-IX Indoor Speaker',
    'DL-6W-IX'
  );

  // Sheet 7: FLASHING BEACON
  const beaconRows = makeRows(
    [
      ['1', 'Tag. Number', 'Refer to Tag number on page 12', 'Refer to Equipment Tag List (Page 9)', 'COMPLY', 'FB-303-001..010 (APF), FB-303-001..003 (ACP)'],
      ['2', 'Service & Location', 'PROCESS AND UTILITY AREA · Outdoor, APF, ACP', locText + ' — Process, Utility & Admin/Accom Areas', 'COMPLY', 'APPENDIX 1.4 (1.4.1.8)'],
      ['3', 'Area Classification & Certificate', 'Zone 1, Zone 2 · ATEX (II2 G Exd IIA T3)', 'Zone 1 / Zone 2 · ATEX / IECEx Ex d IIC T4/T6', 'COMPLY', 'XBC-EX-15J-IX'],
      ['4', 'Lamp Type, Voltage & Energy', 'Twin Tube Xenon · 24 VDC · 20 Joules (VTA)', 'Xenon Flashing Beacon · 24 VDC · 15 Joules (XBC-EX-15J-IX)', 'MINOR / CLARIFY', 'Volume I AS-IS model offers 15J Xenon (XBC-EX-15J-IX); 20J option available if required by SPL/visual study'],
      ['5', 'Flash Rate & Lens Colours', '1HZ, 2HZ & double strike 1HZ · Orange / Yellow', '1 Hz / 60 fpm · Amber/Orange/Yellow glass lens with SS guard', 'COMPLY', 'XBC-EX-15J-IX'],
      ['6', 'Ingress Protection & Material', 'IP66 / IP67 Exe (VTA) · 316SS', 'IP66/IP67 · GRP / 316SS hardware · 2x M20 Ex e entries', 'COMPLY', 'XBC-EX-15J-IX'],
      ['7', 'Manufacturer & Model', 'VTA / VTA', 'Industronic / Cooper MEDC XBC-EX-15J-IX (P/N: XBC-EX-15J-IX)', 'DEVIATE', 'DEV-AVL-PAGA-INDUSTRONIC (Tab 14 Deviation List)'],
    ],
    'XBC-EX-15J-IX (Ex d)',
    'XBC-EX-15J-IX'
  );

  // Representative & Complete Tag Schedule from Pages 10-13 of MM-ASK-1A-APF-TEL-DTS-0003 Rev.B1
  const tagRows = [
    { tagNo: 'PAGA-303-351', service: 'PAGA System Cabinet (Main Controller & Dual Amp Rack)', location: 'APF / Control Building — Control Room', model: 'Industronic INTRON-X Main Rack (A+B)', partNo: 'IX-MAIN-351' },
    { tagNo: 'PAGA-303-151 / 201 / 251 / 401 / 451 / 501', service: 'PAGA Sub-Distribution Amplifier Cabinets (6 Buildings)', location: 'APF / Office, Catering, Accom, Warehouse, Store, Security', model: 'Industronic INTRON-X Sub-Rack + VX25', partNo: 'IX-SUB-FIELD' },
    { tagNo: 'OCU-303-001 / OCU-303-002', service: 'Override Control Unit (Master & Alt. Master Point)', location: 'APF / Process & Utility Area — Muster Points', model: 'Industronic INTRON-X OCU', partNo: 'OCU-IX-100' },
    { tagNo: 'OAP-303-001 / OAP-303-002', service: 'PAGA Operator Access Panel (Control & Radio Room)', location: 'APF / Control Building — Control Room & Radio Room', model: 'Industronic AP712-IX Access Panel', partNo: 'AP712-IX' },
    { tagNo: 'LSE-303-001 to LSE-303-109', service: 'Speaker Explosion Proof (56 sets — Process, Utility, Substation, Muster)', location: 'APF / Process & Utility, Admin/Accom & Substation', model: 'Industronic / MEDC DA-EX-25-IX (Ex d)', partNo: 'DA-EX-25-IX' },
    { tagNo: 'LSN-303-151 to LSN-303-509', service: 'Indoor Speaker (118 sets — incl. LSN-303-365 ITR & LSN-303-414 Lab)', location: 'APF / All 9 Buildings (Rev.B1 ITR & Lab added)', model: 'Industronic DL-6W-IX Indoor Speaker', partNo: 'DL-6W-IX' },
    { tagNo: 'FB-303-001 to FB-303-010', service: 'Flashing Beacon Ex (10 sets — Process & Admin/Accom)', location: 'APF / Process Area & Admin/Accom Area', model: 'Industronic / MEDC XBC-EX-15J-IX (Ex d)', partNo: 'XBC-EX-15J-IX' },
    { tagNo: 'PAGA-303-001 / OAP-303-001', service: 'ACP PAGA System Cabinet & Operator Access Panel', location: 'ACP / E&I Cabin Technical Room & Office Control Room', model: 'Industronic INTRON-X Main Rack + AP712-IX', partNo: 'IX-MAIN-ACP' },
    { tagNo: 'LSE-303-101..109 / LSN-303-201..306 / FB-303-001..003', service: 'ACP Field Speakers (8 Ex, 12 Indoor) & Flashing Beacons (3 Ex)', location: 'ACP / Office, E&I Cabin, Process & Utility Area', model: 'DA-EX-25-IX / DL-6W-IX / XBC-EX-15J-IX', partNo: 'A20261632-005' },
  ];

  return {
    mainSection: {
      title: 'Sheet 2 · Public Address and General Alarm (PAGA) System — Central Cabinet (Industronic INTRON-X)',
      rows: mainRows,
    },
    subSections: [
      { title: 'Sheet 3 · Override Control Units (OCU) — Industronic INTRON-X OCU', rows: ocuRows },
      { title: 'Sheet 4 · Operator Access Panel (OAP) — Industronic AP712-IX', rows: oapRows },
      { title: 'Sheet 5 · Horn Speaker Explosion Proof (15W / 25W) — DA-EX-25-IX', rows: hornRows },
      { title: 'Sheet 6 · Loud Speaker Ceiling/Wall Mounted — DL-6W-IX', rows: indoorRows },
      { title: 'Sheet 7 · Flashing Beacon (Ex d) — XBC-EX-15J-IX', rows: beaconRows },
    ],
    tagRows,
  };
}
