import {
  DTS_SYSTEM_PACKAGE_MAP_0550,
  buildDts0010ReferenceRows0550,
  generateDtsDocument0550,
  sanitizeDtsCustomerText0550,
} from './dtsGenerator0550';
import {
  PTTEP_DOC_STANDARD_0550,
  PTTEP_REVISION_CATALOG_0550,
  customerRevisionHistory0550,
  formatPttepFileName0550,
  isInternalPttepRevision0550,
  normalizePttepRev0550,
} from './pttepDocControl0550';
import {
  evaluatePhiDtsRow0550,
  verifyVolumeIAsIsLock0550,
} from './siVerificationEquations0550';

export const DTS_FORM_AREAS_0550 = ['APF', 'ACP', 'ABV01', 'AMS01'];

export const DTS_FORM_REVISIONS_0550 = [
  { code: '00', label: '00 (Issued for Bidding)' },
  { code: 'A1', label: 'A1 (Issued for Review)' },
  { code: 'R1', label: 'R1 (IDC)' },
  { code: 'B1', label: 'B1 (IFA/IFT)' },
  { code: 'C1', label: 'C1 (AFC)' },
  { code: 'INT-00', label: 'INT-00 (Internal WIP)' },
];

export const DTS_FORM_SECTIONS_0550 = [
  'General',
  'Equipment / Antenna Specification',
  'Radio / Network / Functional Specification',
  'Power / Enclosure / Hazardous Area Specification',
];

export const FORBIDDEN_DTS_FORM_PLACEHOLDERS_RE =
  /\bCatalog Standard\b|\bManufacturer Model per MR\b|\bDraft\b|\bMGW\b|\bSI budget estimate\b|\bOEM Standard\b|\bPer Specification\b|\[INTERNAL TRACE\]|\bWorking owner\b|\bWorking draft\b/i;

export function sanitizeDtsFormText0550(text) {
  const base = sanitizeDtsCustomerText0550(String(text ?? ''));
  return base
    .replace(/\bCatalog Standard\b/gi, 'Manufacturer Datasheet')
    .replace(/\bManufacturer Model per MR\b/gi, 'Per Vendor Technical Proposal')
    .replace(/\bDraft\b/gi, 'Issued')
    .replace(/\bMGW\b/gi, 'Vendor Package')
    .replace(/\s*\(placeholder\)/gi, '')
    .replace(/\s*\[DEV-[^\]]+\]/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function formatDateDmy(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || '').trim());
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '17/11/2026';
}

function mapToFourSections(row, idx) {
  const sec = String(row.section || '');
  if (/antenna/i.test(sec) || /^A\./i.test(String(row.item || ''))) {
    return 'Equipment / Antenna Specification';
  }
  if (/functional|rf|network|radio|odu|idu/i.test(sec)) {
    return 'Radio / Network / Functional Specification';
  }
  if (/electrical|mechanical|power|enclosure|hazard|standard/i.test(sec)) {
    return 'Power / Enclosure / Hazardous Area Specification';
  }
  if (/general/i.test(sec)) {
    return 'General';
  }
  return DTS_FORM_SECTIONS_0550[idx % DTS_FORM_SECTIONS_0550.length];
}

function normalizeComplianceBadge(compliance) {
  const s = String(compliance || '').trim().toUpperCase();
  if (s === 'COMPLY') return { label: 'COMPLY', cls: 'sb-c' };
  if (s.includes('PARTIAL')) return { label: 'PARTIAL COMPLY', cls: 'sb-p' };
  if (s.includes('DEVIATE') || s.includes('VTA') || s.includes('CLARIFY')) {
    return { label: 'PARTIAL COMPLY', cls: 'sb-p' };
  }
  return { label: 'HOLD / OPEN', cls: 'sb-o' };
}

function buildAuthoritativeNotes({ systemToken, area, dts }) {
  const notes = [
    {
      text: 'Telecom equipment shall be certified by a recognized independent certifying authority according to ATEX Directive 2014/34/EU, IECEx or updated version. All active radio equipment and accessories in hazardous areas shall be Zone-2 classified as minimum with IP66.',
      devTag: '[DEV-002]',
    },
    {
      text: `Final operating frequency, channel plan, and Myanmar PTD Type Approval for ${dts.systemTitle} (${area}) shall be subject to approval by Myanmar authority and assigned frequency spectrum from COMPANY.`,
      devTag: '[DEV-003]',
    },
  ];
  if (systemToken === 'TEL-DMR') {
    notes.push({
      text: 'Ceragon FibeAir IP-50CX is a Full-Outdoor 2+0 XPIC architecture; separate indoor IDU slots are eliminated and user Ethernet interfaces are terminated via the Telecom Access Switch inside the Rittal cabinet.',
      devTag: '[DEV-DMR-001]',
    });
  } else if (systemToken === 'TEL-CCTV') {
    notes.push({
      text: 'Unclassified indoor monitoring workstation and non-AVL auxiliary switch selections are documented in Deviation List MM-ASK-1A-WP01-TEQ-TEL-LIS-0004.',
      devTag: '[DEV-CCTV-001]',
    });
  } else {
    notes.push({
      text: `Equipment quantities, physical dimensions, and tag allocations align with Volume I Schedule C1 and Appendix 2 Master Evidence (${area}).`,
      devTag: `[DEV-${dts.pkg}-001]`,
    });
  }
  return notes;
}

function buildDmrClientDts60Rows0550(area = 'APF') {
  const isAcp = area === 'ACP';
  const siteEnv = area === 'ABV01' || area === 'AMS01' ? 'Onshore / Valve & Metering Station' : 'Offshore Wellhead Platform (Tropical Marine)';
  const tagSummary = isAcp
    ? 'ACP-MR-320-001 / ACP-ANT-320-001 / ACP-MR-320'
    : 'MR-320-001 / ANT-320-001 / MR-320 (APF)';
  const locSummary = isAcp
    ? 'ACP 30m Telecom Tower / Control Room (El. +28m)'
    : 'APF 60m Telecom Tower / Control Building ITR (El. +58m)';

  // Exact 60-row PTTEP Client DTS (MM-ASK-1A-APF-TEL-DTS-0010) answered from APPENDIX 1.5 (Ceragon FibeAir IP-50CX 2+0)
  const raw = [
    ['1', 'Tag. Number', 'Refer to Tag Number on page 4', 'Refer to Equipment Tag List (Page 4)', 'COMPLY', 'APPENDIX 1.5 (1.5.1.1–1.5.1.3)'],
    ['2', 'Service', 'Refer to Tag Number on page 4', 'Refer to Equipment Tag List (Page 4)', 'COMPLY', 'Ceragon Offer 26-30029 RevA1'],
    ['3', 'Location', 'Refer to Tag Number on page 4', 'Refer to Equipment Tag List (Page 4)', 'COMPLY', 'Appendix 2 LIS-0001'],
    ['4', 'Ambient Temperature, °C (max. / min. / design)', '38.7 / 19.1 / 40', '-33 °C to +55 °C continuous ODU rating (ETSI EN 300 019-1-4 Class 4.1)', 'COMPLY', 'IP-50CX Datasheet'],
    ['5', 'Relative Humidity, % (design)', '91.4', '5% to 95% non-condensing (100% condensing external IP67)', 'COMPLY', 'IP-50CX Datasheet'],
    ['6', 'Room Operating Temperature (°C)', '20 - 25', '20 - 25 °C inside Rittal VX25 42U IP54 Telecom Cabinet (MR-320)', 'COMPLY', 'VERSED VX-8825.000'],
    ['7', 'Site Environment', 'Onshore / Offshore', siteEnv, 'COMPLY', 'Marine C5-M Offshore Finish'],
    ['8', 'Design Life', '20- year', '15+ to 20 years continuous industrial service (MTBF > 1,100,000 hrs)', 'COMPLY', 'Telcordia SR-332'],
    ['9', 'Microwave Characteristics', '', '', 'HEADER', ''],
    ['10', 'Recommendations', 'Complied with the relevant and most up-to-date ITU-T/ITU-R Recommendations.', 'Complied — Ceragon FibeAir IP-50CX (2+0) complies with ITU-T & ITU-R', 'COMPLY', 'Ceragon Compliance'],
    ['11', '', 'ITU-R F.752-2 , ITU-R P.1410, ITU-R P.530-17 , ITU-R Q.412', 'Complied — Verified in 7 GHz Pathloss / Link Budget', 'COMPLY', 'STU-0002'],
    ['12', 'RF Transmitter/receiver characteristics', '', '', 'HEADER', ''],
    ['13', 'System operation', 'Full duplex', 'Full Duplex FDD, 2+0 Full Outdoor Dual-Core XPIC/ACM', 'COMPLY', 'IP50CX-FO-2P0'],
    ['14', 'Frequency band', '7.1 - 8.5 GHz band or applicable local licensed band)', '7.125 – 7.900 GHz (7 GHz Sub-band; High at APF, Low at ACP)', 'COMPLY', 'IP-50CX-7-8w'],
    ['15', 'RF channel spacing', '5, 10, 15, 20, 30, 40, 45, 56 MHz channels (VTA)', '7, 14, 28, 40, 56 MHz software-selectable (VTA — 28/56 MHz per link budget)', 'COMPLY', 'SL-Capacity-150M x2'],
    ['16', 'Minimum throughput', 'Up to 300Mbps', '300 Mbps licensed (2×150 Mbps); hardware capable up to 1.0+ Gbps (2+0 XPIC)', 'COMPLY', 'SL-Capacity-150M x2'],
    ['17', 'Range', 'Suitable for minimum 40 km path and extendable up to 250 km subject to link design', 'Supports 32–40+ km offshore over-water path (99.5 dB system gain)', 'COMPLY', 'Pathloss Link Budget'],
    ['18', '', '(confirmed with the pathloss calculation report)', 'Confirmed with Ceragon Pathloss Link Budget (APF–ACP path)', 'COMPLY', 'STU-0002'],
    ['19', 'Modulation/demodulation method', 'QPSK, 16QAM, 32QAM, 64QAM, 128QAM, 256QAM, 512QAM, 1024QAM and 2048QAM', 'Hitless & Errorless ACM: QPSK up to 4096-QAM (exceeds 2048QAM)', 'COMPLY', 'SL-ACM x2'],
    ['20', '', 'with Adaptive Modulation', 'Hitless Adaptive Coding & Modulation (ACM) included', 'COMPLY', 'SL-ACM x2'],
    ['21', 'Power Output', '30 dBm at 56MHz 128QAM (VTA)', '+29 dBm max (QPSK) / +23 dBm (1024QAM) with ATPC (VTA per link budget)', 'COMPLY', 'IP-50CX Datasheet'],
    ['22', 'Frequency stability', '± 10 ppm or better', '± 5 ppm or better (exceeds ± 10 ppm)', 'COMPLY', 'ETSI EN 302 217-2'],
    ['23', 'Power requirement', '-48 Vdc (nominal), positive ground', '-48 VDC nominal (-40.5 to -60 VDC, dual redundant feed), 68W typ / 85W max', 'COMPLY', 'Rittal DC Dist.'],
    ['24', 'System Fade margin', 'Not less than 30 dB above the value of receiver threshold level at BER = 1x10E-6', '≥ 34 dB fade margin at 256QAM (Rx threshold -72.5 dBm at BER 10^-6)', 'COMPLY', 'Pathloss Link Budget'],
    ['25', 'Transmit Power', 'As required to meet link budget and availability requirement', 'ATPC (Automatic Transmit Power Control) configured per link budget', 'COMPLY', 'IP-50CX Datasheet'],
    ['26', 'Link Availability', 'Minimum 99.99%', '99.995% Annual Availability (2+0 XPIC + ACM + 1.2m Dish ANT-MW-1.2M-320)', 'COMPLY', 'Pathloss Link Budget'],
    ['27', 'Ethernet Interfaces', 'Minimum 4 x 1GE RJ45 VTA', 'ODU: 1×1G RJ45 PoE/Mgmt + 2×1G/2.5G SFP+; user RJ45 ports via Rittal Access Switch', 'MINOR / CLARIFY', 'All-Outdoor port layout via cabinet switch'],
    ['28', '', 'Minimum 2 x 1GE SFP VTA', '2 × 1G/2.5G SFP+ Optical ports on IP-50CX ODU', 'COMPLY', 'IP-50CX Datasheet'],
    ['29', '', 'Support 10GE SFP+', '2 × 1G/2.5G/10GE SFP+ optical interfaces supported', 'COMPLY', 'IP-50CX Datasheet'],
    ['30', '', 'SFP/SFP+ Connector type LC', 'LC Duplex Single-Mode 1310nm Industrial SFP (SFP-GE-LX-EXT-TEMP)', 'COMPLY', 'Ceragon BOM'],
    ['31', '', 'Support Layer-2 and Layer-3 networking', 'MEF CE 2.0 Carrier Ethernet Layer-2 switching + L3 management routing', 'COMPLY', 'SL-Edge-CET-Node'],
    ['32', '', 'Support VLAN, QoS, Link Aggregation (LACP), RSTP/MSTP', 'Supported: IEEE 802.1Q/802.1ad, H-QoS (8 queues), LACP, RSTP/MSTP, ERPS', 'COMPLY', 'SL-Edge-CET-Node'],
    ['33', 'Protection', 'Support Link Aggregation and Protection Switching', 'Supported: 2+0 MC-ABC Link Aggregation + Dual-Core Hardware Protection', 'COMPLY', 'SL-MC-ABC x2'],
    ['34', 'Standard Compliance', '', '', 'HEADER', ''],
    ['35', 'Ethernet Switching', 'Layer-2', 'MEF CE 2.0 Carrier Ethernet Layer-2 Switching', 'COMPLY', 'SL-Edge-CET-Node'],
    ['36', 'Layer -3 Routing', 'Supported', 'Supported (Management & Control Plane L3 Routing)', 'COMPLY', 'IP-50CX Datasheet'],
    ['37', 'IEEE 802.1q', 'VLAN Tagging', 'Supported (IEEE 802.1Q VLAN Tagging)', 'COMPLY', 'IP-50CX Datasheet'],
    ['38', 'IEEE 802.1p', 'Ethernet QoS', 'Supported (IEEE 802.1p 8-Queue Priority QoS)', 'COMPLY', 'IP-50CX Datasheet'],
    ['39', 'IEEE 802.3u', '100BASE-TX Fast Ethernet', 'Supported', 'COMPLY', 'IP-50CX Datasheet'],
    ['40', 'IEEE 802.3ab', '1000BASE-T Gigabit Ethernet', 'Supported (1000BASE-T RJ45 Management/Traffic)', 'COMPLY', 'IP-50CX Datasheet'],
    ['41', 'IEEE 802.3z', '1000BASE-X Gigabit Ethernet', 'Supported (1000BASE-LX/SX SFP)', 'COMPLY', 'IP-50CX Datasheet'],
    ['42', 'IEEE 802.1ad', 'provider bridging, Q-in-Q', 'Supported (IEEE 802.1ad Q-in-Q Provider Bridging)', 'COMPLY', 'IP-50CX Datasheet'],
    ['43', 'IEEE 802.3ad', 'Link Aggregation Control Protocol', 'Supported (IEEE 802.3ad LACP)', 'COMPLY', 'IP-50CX Datasheet'],
    ['44', 'IEEE 802.3x', 'Flow Control', 'Supported (IEEE 802.3x Pause Flow Control)', 'COMPLY', 'IP-50CX Datasheet'],
    ['45', 'Cyber Security', '', '', 'HEADER', ''],
    ['46', '- HTTPS Management', 'Supported', 'Supported (TLS 1.2+ HTTPS Web UI)', 'COMPLY', 'IP-50CX Security'],
    ['47', '- SSHv2', 'Supported', 'Supported (SSHv2 CLI)', 'COMPLY', 'IP-50CX Security'],
    ['48', '- SNMPv3', 'Supported', 'Supported (SNMPv3 AuthPriv)', 'COMPLY', 'IP-50CX Security'],
    ['49', '- TACACS+ or RADIUS', 'Supported', 'Supported (RADIUS & TACACS+ Centralized AAA)', 'COMPLY', 'IP-50CX Security'],
    ['50', '- Authentication', 'Supported', 'Supported (User/Device Authentication)', 'COMPLY', 'IP-50CX Security'],
    ['51', '- Role Based Access Control (RBAC)', 'Supported', 'Supported (Multi-level RBAC)', 'COMPLY', 'IP-50CX Security'],
    ['52', '- Syslog', 'Supported', 'Supported (Syslog TLS/UDP)', 'COMPLY', 'IP-50CX Security'],
    ['53', '- NTP', 'Supported', 'Supported (NTPv4 + SyncE / IEEE 1588v2)', 'COMPLY', 'SL-Sync-Unit'],
    ['54', '- Password Policy Enforcement', 'Supported', 'Supported (Configurable Password Complexity & Lockout)', 'COMPLY', 'IP-50CX Security'],
    ['55', 'System performance', '', '', 'HEADER', ''],
    ['56', 'Error performance objectives', 'Complied with ITU-T Rec.G.826', 'Complied with ITU-T Rec. G.826 & G.828', 'COMPLY', 'IP-50CX Datasheet'],
    ['57', 'Management system', '', '', 'HEADER', ''],
    ['58', 'Management system', 'The proposed equipment shall provide interface to be monitored and controlled by the', 'Ceragon NetMaster NMS + SNMPv3 Northbound Traps/MIBs', 'COMPLY', 'NMS Integration'],
    ['59', '', 'existing Network Management System', 'Compatible with Project Telecom NMS & OT Cybersecurity Policy', 'COMPLY', 'NMS Integration'],
    ['60', '', '', 'Model: Ceragon FibeAir IP-50CX (2+0) · P/N: IP50CX-FO-2P0 + ANT-MW-1.2M-320 + VX-8825.000', 'COMPLY', 'APPENDIX 1.5 BOM'],
  ];

  return raw.map(([item, parameter, requirement, offered, compliance, remarks]) => ({
    item,
    parameter,
    requirement,
    offered,
    compliance,
    remarks,
    model: 'FibeAir IP-50CX (2+0)',
    partNo: 'IP50CX-FO-2P0',
    isSectionHeader: compliance === 'HEADER',
  }));
}

export function buildDtsFormModel0550({
  data,
  model,
  systems = [],
  systemToken = 'TEL-DMR',
  area = 'APF',
  revision = '00',
  mode = 'customer',
  today = '2026-11-17',
} = {}) {
  const isInternal = mode === 'internal';
  const safeArea = DTS_FORM_AREAS_0550.includes(area) ? area : 'APF';
  const normRev = normalizePttepRev0550(revision, '00');
  const displayRev = !isInternal && isInternalPttepRevision0550(normRev) ? '00' : normRev;
  const sysMeta = DTS_SYSTEM_PACKAGE_MAP_0550[systemToken] || {
    pkg: 'TEQ',
    seq: '0001',
    clientDts: `MM-ASK-1A-${safeArea}-TEL-DTS-0001`,
    title: systems.find(s => s.token === systemToken)?.name || systemToken,
  };

  // Generate authoritative Single Source of Truth DTS from SI-SYNTH-EQ / C1 / 7 VND / 10.2 SI / Appendix 2
  const dts = generateDtsDocument0550({
    data,
    model,
    systems,
    systemToken,
    area: safeArea,
    workflow: systemToken === 'TEL-DMR' ? 'WORKFLOW_A' : 'WORKFLOW_B',
    revision: normRev,
    today,
  });

  const clean = text => (isInternal ? String(text ?? '') : sanitizeDtsFormText0550(text));
  const systemNameClean = clean(dts.systemTitle);
  const systemNameUpper = systemNameClean.toUpperCase();
  const dateDmy = formatDateDmy(today);

  const revMeta = PTTEP_REVISION_CATALOG_0550.find(r => r.code === displayRev) || {
    code: displayRev,
    purpose: 'Issued for Review',
  };

  const statusCode = /^C/i.test(displayRev)
    ? 'C'
    : /^B/i.test(displayRev)
      ? 'B'
      : /^A/i.test(displayRev)
        ? 'A'
        : '—';

  // Revision history (auto-hides INT-XX in Customer Preview; defaults to 00 Issued for Bidding)
  const bidRevisionRow = {
    rev: '00',
    page: 'ALL',
    date: dateDmy,
    description: 'Issued for Bidding',
    by: 'Suriyapong Y.',
    checked: 'Suriyapong Y.',
    approved: '',
  };
  const rawHistory = dts.revisionHistory || [];
  const filteredHistory = isInternal ? rawHistory : customerRevisionHistory0550(rawHistory);
  const revisionHistory =
    displayRev === '00'
      ? [bidRevisionRow]
      : filteredHistory.map(r => ({
          rev: r.rev,
          page: 'ALL',
          date: formatDateDmy(r.date || today),
          description: r.rev === '00' ? 'Issued for Bidding' : clean(r.description || r.purpose),
          by: r.rev === '00' ? 'Suriyapong Y.' : clean(r.prepared || 'TSI Telecom Eng.'),
          checked: r.rev === '00' ? 'Suriyapong Y.' : clean(r.checked || 'SI Lead'),
          approved: r.rev === '00' ? '' : clean(r.approved || ''),
        }));

  // Combine specRows + antennaRows into Datasheet sections evaluated via Φ_DTS(r)
  // For TEL-DMR, use the exact 60-row PTTEP Client DTS (MM-ASK-1A-APF-TEL-DTS-0010) answered from APPENDIX 1.5
  const isDmr60 = systemToken === 'TEL-DMR';
  const combinedRows = isDmr60
    ? buildDmrClientDts60Rows0550(safeArea)
    : [...(dts.specRows || []), ...(dts.antennaRows || [])];
  const volumeILines = (data?.lines || []).filter(
    l => l.selected && (systemToken === 'COMMON' || l.systemToken === systemToken)
  );
  const volumeIAsIsLock = verifyVolumeIAsIsLock0550(combinedRows, volumeILines);
  const phiFlags = [];

  let sections = [];
  if (isDmr60) {
    const dmrRows = combinedRows.map(r => {
      if (r.isSectionHeader) {
        return {
          item: r.item,
          parameter: r.parameter,
          requirement: '',
          offered: '',
          src: '',
          badge: null,
          remarks: '',
          isSectionHeader: true,
        };
      }
      const phi = evaluatePhiDtsRow0550(r, { isInternal });
      if (isInternal && phi.internalFlag) {
        phiFlags.push({
          category: phi.deviationLink ? 'GATE R3 DEVIATION (TAB 14)' : 'PHI-DTS REVIEW FLAG',
          detail: phi.internalFlag,
        });
      }
      return {
        item: r.item,
        parameter: clean(r.parameter),
        requirement: clean(r.requirement),
        offered: clean(phi.offered),
        src: isInternal ? (r.remarks || 'APPENDIX 1.5') : '',
        badge: { label: phi.status, cls: phi.badgeClass },
        remarks: clean(phi.remarks),
        deviationLink: phi.deviationLink,
        deviationLabel: phi.deviationLabel,
        isSectionHeader: false,
      };
    });
    sections = [{ title: 'Sheet 2 · Main Equipment Datasheet — Microwave Radio System (Ceragon FibeAir IP-50CX)', rows: dmrRows }];
  } else {
    const groupedSpecs = new Map(DTS_FORM_SECTIONS_0550.map(sec => [sec, []]));
    combinedRows.forEach((r, idx) => {
      const secName = mapToFourSections(r, idx);
      const phi = evaluatePhiDtsRow0550(r, { isInternal });
      if (isInternal && phi.internalFlag) {
        phiFlags.push({
          category: phi.deviationLink ? 'GATE R3 DEVIATION (TAB 14)' : 'PHI-DTS REVIEW FLAG',
          detail: phi.internalFlag,
        });
      }
      const srcTrace = r.remarks ? String(r.remarks).slice(0, 32) : 'C1 / 7 VND';
      groupedSpecs.get(secName).push({
        item: r.item || String(idx + 1),
        parameter: clean(r.parameter),
        requirement: clean(r.requirement),
        offered: clean(phi.offered),
        src: isInternal ? srcTrace : '',
        badge: { label: phi.status, cls: phi.badgeClass },
        remarks: clean(phi.remarks),
        deviationLink: phi.deviationLink,
        deviationLabel: phi.deviationLabel,
        isSectionHeader: false,
      });
    });

    sections = DTS_FORM_SECTIONS_0550.map(secName => ({
      title: secName,
      rows: groupedSpecs.get(secName) || [],
    })).filter(s => s.rows.length > 0);
  }

  // Optional Sheet 3 (Page 4): Antenna / Sub-Equipment Datasheet when present (e.g., TEL-DMR 16-row CommScope VHLP4-7W/E)
  let subEquipmentSections = [];
  if (isDmr60) {
    const refDts = buildDts0010ReferenceRows0550();
    const antRows = (refDts.antennaRows || []).map((r, idx) => {
      const phi = evaluatePhiDtsRow0550(r, { isInternal });
      return {
        item: r.item || `A.${idx + 1}`,
        parameter: clean(r.parameter),
        requirement: clean(r.requirement),
        offered: clean(phi.offered),
        src: isInternal ? (r.remarks || 'Ceragon / CommScope') : '',
        badge: { label: phi.status, cls: phi.badgeClass },
        remarks: clean(phi.remarks),
        isSectionHeader: false,
      };
    });
    if (antRows.length > 0) {
      subEquipmentSections = [
        {
          title: 'Sheet 3 · Microwave Antenna Datasheet — CommScope VHLP4-7W/E (1.2 m Parabolic Dish)',
          rows: antRows,
        },
      ];
    }
  }

  // Final Sheet: Equipment Tag list (exact client tags for TEL-DMR)
  const rawTagRows = isDmr60
    ? [
        { tagNo: 'APF-MR-320-201', service: 'APF Microwave Radio ODU (2+0 High Sub-Band)', location: 'APF / 60m Telecom Tower / Dish Back-Mount', model: 'Ceragon FibeAir IP-50CX', partNo: 'IP50CX-FO-2P0', vdbRef: 'CERAGON-26-30029-R11 / PTD Pending' },
        { tagNo: 'APF-MR-320-202', service: 'APF Microwave IDU Slot (Full Outdoor IP-50CX)', location: 'APF / Control Building / Equipment Room', model: 'Ceragon FibeAir IP-50CX (Full Outdoor)', partNo: 'IP50CX-FO-2P0', vdbRef: 'DEV-DMR-CERAGON-R11-BID-DRAFT' },
        { tagNo: 'APF-ANT-320-201', service: 'APF 1.2m Parabolic Microwave Dish Antenna', location: 'APF / 60m Telecom Tower / El. +58m', model: 'CommScope VHLP4-7W/E', partNo: 'ANT-MW-1.2M-320', vdbRef: 'CERAGON-26-30029-R11 / LIS-0001' },
        { tagNo: 'MR-320', service: 'APF Microwave Indoor Termination Cabinet', location: 'APF / Control Building / Equipment Room', model: 'Rittal VX25 42U 800x1000x2200mm', partNo: 'VX-8825.000', vdbRef: 'VERSED-QT2611035 / App.2 LIS' },
        { tagNo: 'ACP-ANT-320-001', service: 'ACP 1.2m Parabolic Microwave Dish Antenna', location: 'ACP / 30m Telecom Tower / El. +28m', model: 'CommScope VHLP4-7W/E', partNo: 'ANT-MW-1.2M-320', vdbRef: 'CERAGON-26-30029-R11 / LIS-0001' },
        { tagNo: 'ACP-MR-320-001', service: 'ACP Microwave Radio ODU (2+0 Low Sub-Band)', location: 'ACP / 30m Telecom Tower / Dish Back-Mount', model: 'Ceragon FibeAir IP-50CX', partNo: 'IP50CX-FO-2P0', vdbRef: 'CERAGON-26-30029-R11 / PTD Pending' },
        { tagNo: 'ACP-MR-320-002', service: 'ACP Microwave IDU Slot (Full Outdoor IP-50CX)', location: 'ACP / Control Room / RAD-308-001', model: 'Ceragon FibeAir IP-50CX (Full Outdoor)', partNo: 'IP50CX-FO-2P0', vdbRef: 'DEV-DMR-CERAGON-R11-BID-DRAFT' },
      ]
    : dts.tagRows || [];

  const tagList = rawTagRows.map(t => ({
    items: clean(t.service || dts.systemTitle),
    tagNumber: clean(t.tagNo || 'Per Appendix 2 Drawing'),
    location: clean(t.location || `${safeArea} / Telecom Equipment Room`),
    remarks: clean(
      isInternal
        ? `${t.model || ''} ${t.partNo ? `(${t.partNo})` : ''} · ${t.vdbRef || ''}`.trim()
        : `${t.model || 'Per Vendor Technical Proposal'}${t.partNo && !/OPEN/i.test(t.partNo) ? ` (${t.partNo})` : ''}`
    ),
  }));

  const totalPages = subEquipmentSections.length > 0 ? 5 : 4;

  const tagSummary = tagList
    .slice(0, 3)
    .map(t => t.tagNumber)
    .filter(Boolean)
    .join(' · ') || 'Per Appendix 2';

  const notes = buildAuthoritativeNotes({ systemToken, area: safeArea, dts }).map(n => ({
    text: clean(n.text),
    devTag: isInternal ? n.devTag : '',
  }));

  const docFileNameDocx = formatPttepFileName0550({
    area: safeArea,
    pkg: dts.pkg,
    discipline: 'TEL',
    docType: 'DTS',
    seq: dts.seq,
    rev: displayRev,
    ext: 'docx',
    internal: isInternal,
  });

  const docFileNamePdf = formatPttepFileName0550({
    area: safeArea,
    pkg: dts.pkg,
    discipline: 'TEL',
    docType: 'DTS',
    seq: dts.seq,
    rev: displayRev,
    ext: 'pdf',
    internal: isInternal,
  });

  return {
    projectTitle:
      'EPC OF WELLHEAD PLATFORMS & ONSHORE PROCESSING FACILITIES FOR AUNG SINKHA DEVELOPMENT PROJECT PHASE 1A (EPC-01)',
    clientName: 'PTT Exploration and Production Public Company Limited',
    vendorName: 'ADD VALUE SYSTEM CO., LTD.',
    standard: PTTEP_DOC_STANDARD_0550,
    docId: dts.docId,
    clientDtsRef: sysMeta.clientDts,
    systemToken,
    systemTitle: systemNameClean,
    systemTitleUpper: systemNameUpper,
    area: safeArea,
    pkg: dts.pkg,
    seq: dts.seq,
    revision: displayRev,
    revisionPurpose: revMeta.purpose,
    statusCode,
    dateDmy,
    mode,
    isInternal,
    tagSummary,
    poNo: '—',
    vendorDocNo: '—',
    totalPages,
    c1SyncCount: dts.c1SyncCount || 0,
    volumeIAsIsLock,
    internalNotes: isInternal ? [...(dts.internalNotes || []), ...phiFlags] : [],
    revisionHistory,
    sections,
    subEquipmentSections,
    tagList,
    notes,
    docFileNameDocx,
    docFileNamePdf,
  };
}

/**
 * Exact port of template fixWidths(): resolves % colgroups to fixed cm widths against widthCm (17cm).
 */
export function fixWidths(root, widthCm = 17) {
  if (!root || typeof root.querySelectorAll !== 'function') return;
  root.querySelectorAll('table').forEach(tb => {
    const cols = tb.querySelectorAll('colgroup col');
    if (!cols.length || tb.getAttribute('data-cm')) return;
    const pct = [];
    let ok = true;
    cols.forEach(c => {
      const m = /([\d.]+)%/.exec(c.getAttribute('style') || '');
      if (m) pct.push(parseFloat(m[1]));
      else ok = false;
    });
    if (!ok) return;
    const sum = pct.reduce((a, b) => a + b, 0) || 100;
    const w = [];
    cols.forEach((c, i) => {
      const cm = (widthCm * pct[i]) / sum;
      w.push(cm.toFixed(2));
      c.setAttribute('style', `width:${cm.toFixed(2)}cm`);
    });
    tb.setAttribute('data-cm', w.join(','));
    tb.style.tableLayout = 'fixed';
    tb.style.width = `${widthCm}cm`;
  });
}

/**
 * Exact port of template wordify(): converts .cv-sp/.cv-sp2 spacers, .cv-frame to 1-cell bordered table,
 * .page wrappers to explicit page-break-before:always, and .foot to plain margin blocks for MS Word.
 */
export function wordify(root, doc, widthCm = 17) {
  if (!root || !doc) return;
  root.querySelectorAll('.cv-sp').forEach(e => {
    e.setAttribute('style', 'display:block;height:38mm;font-size:1pt;line-height:1');
  });
  root.querySelectorAll('.cv-sp2').forEach(e => {
    e.setAttribute('style', 'display:block;height:34mm;font-size:1pt;line-height:1');
  });
  root.querySelectorAll('.cv-bsp').forEach(e => {
    e.setAttribute('style', 'display:block;height:26mm;font-size:1pt;line-height:1');
  });

  root.querySelectorAll('.cv-frame').forEach(f => {
    const t = doc.createElement('table');
    const tr = doc.createElement('tr');
    const td = doc.createElement('td');
    t.setAttribute('style', `width:${widthCm}cm;border-collapse:collapse`);
    td.setAttribute('style', 'border:1pt solid #000;padding:1.0cm 1.2cm 0.8cm;vertical-align:top');
    while (f.firstChild) td.appendChild(f.firstChild);
    tr.appendChild(td);
    t.appendChild(tr);
    f.parentNode.replaceChild(t, f);
  });

  root.querySelectorAll('.page').forEach((p, i) => {
    p.setAttribute('style', `width:${widthCm}cm${i ? ';page-break-before:always' : ''}`);
    const inner = p.querySelector('.inner');
    if (inner) inner.setAttribute('style', 'display:block;margin:0');
  });

  root.querySelectorAll('.foot').forEach(e => {
    e.setAttribute(
      'style',
      'display:block;margin-top:6mm;border-top:.5pt solid #999;padding-top:3px;font-size:7pt;color:#555'
    );
  });
  root.querySelectorAll('.tblk').forEach(e => {
    e.setAttribute('style', 'width:100%;border-collapse:collapse;font-size:7pt;margin-top:6mm');
  });
}

export function buildDtsFormWordDocumentHtml0550({ rootElement, title, cssText = '', widthCm = 17 }) {
  if (!rootElement || typeof document === 'undefined') return '';
  const clone = rootElement.cloneNode(true);
  fixWidths(clone, widthCm);
  wordify(clone, document, widthCm);

  const wordCss = String(cssText || '')
    .replace(/display:\s*flex/g, 'display:block')
    .replace(/flex:\s*[^;}]+;?/g, '');
  const pageCss = '@page{size:21cm 29.7cm;margin:2cm 2cm}';
  const safeTitle = String(title || 'DTS Form').replace(/[<>&"]/g, '');

  return (
    '<html xmlns:o="urn:schemas-microsoft-com:office:office"' +
    ' xmlns:w="urn:schemas-microsoft-com:office:word"' +
    ' xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8">' +
    `<title>${safeTitle}</title><style>${pageCss} ${wordCss}` +
    ' .page{min-height:0 !important;border:0 !important;box-shadow:none !important;margin:0 !important}' +
    ' .cv-frame{border:0} table{border-collapse:collapse} td,th{vertical-align:top}' +
    `</style></head><body>${clone.innerHTML}</body></html>`
  );
}

export function exportDtsFormWord0550({ rootElement, formModel, cssText = '' }) {
  const docHtml = buildDtsFormWordDocumentHtml0550({
    rootElement,
    title: `${formModel.docId} Rev.${formModel.revision}`,
    cssText,
    widthCm: 17,
  });
  if (!docHtml) return formModel.docFileNameDocx;
  const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = formModel.docFileNameDocx;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return formModel.docFileNameDocx;
}
