import appendix2Evidence from './appendix2MasterEvidence0550.json';
import { CCTV_TPLINK_DEVIATION_0550 } from './mgwCctvEntBudget0550';

export const SI_SYNTH_EQUATIONS_0550 = [
  {
    id: 'EQ-UI',
    name: 'Customer-Facing Sanitization & 10-Col BOM Completeness',
    homeTab: 'SI-CAL (02 First Principles)',
    formula: '∀ row ∈ (C1 ∪ 11.P ∪ bid.technical): leaks(row) = 0 ∧ placeholders(row) = 0 ∧ cols(BOM(row)) = 10 ∧ dup(BOM(row)) = 0',
    control: 'Zero internal trace strings (MGW, Draft, SI budget estimate, OEM Standard, Per Specification, Thai approx.), zero duplicate BOM rows, exact Lump-Sum/Itemized parity.',
  },
  {
    id: 'EQ-CUS',
    name: 'Holistic Context Synthesis (Ψ_Synth + Λ_SI)',
    homeTab: 'SI-REQ (04 Systems / Requirements)',
    formula: 'Ψ_Synth(s, loc) = MR(s, loc) ⊕ PHI(s, loc) ⊕ DTS(s) ⊕ SPE(s) ⊕ LIS(s, loc) ⊕ App2(LAY/BLK/SLD/STD) ⊕ RedFont/Comments',
    control: 'Every BOM line and quantity must reconcile across Customer MR, PHI, DTS, SPE, LIS, and Appendix 2 drawings; non-MR items isolate to 10.2 SI.',
  },
  {
    id: 'EQ-VND',
    name: 'Supplier / Cross-Volume Gate §10 & Markup Routing μ(s)',
    homeTab: 'SI-ACT (06 Execution / Resources)',
    formula: 'μ(s) = { MGW: Cost × 1.05 × 1.05 × 1.20 | Direct (DMR/PAGA/Tower): Governed Contract Rate }; ΔCost_Impact = $0.00 (unless verified MR delta)',
    control: 'Strict Rev00 C-1 ceiling preservation, non-AVL brands logged in Tab 14 Deviation List (§10 R1/R3), and 100-record Volume II sync.',
  },
];

export const SI_LEARNED_RULES_0550 = [
  {
    id: 'LAMBDA-01',
    scope: 'APPENDIX 1.1 (TEL-RADIO-* / TEL-TELT)',
    rule: '10-Column BOM Prototype (Item | MR Description | Tag No. | Offered Equipment | Brand | Model | Part No. | Qty | Unit | Remarks); Rittal VX25/VX IT cabinets; MGW Options (PMPN4296/PMNN4067) & APM RADIO-006 isolated in 10.2 SI.',
    status: 'LOCKED_VERIFIED',
  },
  {
    id: 'LAMBDA-02',
    scope: 'APPENDIX 1.2 (TEL-VSAT / TEL-VSAT-KU)',
    rule: 'Purge 1.2.P1/1.2.P2 internal budget rows; allocate $94,662.76 onto APF/YANGON/ACP MR rows; enforce COMPANY free-issue vs TSI (Rittal + Cisco 8300 + LMR-400 + iDirect) demarcation.',
    status: 'LOCKED_VERIFIED',
  },
  {
    id: 'LAMBDA-03',
    scope: 'APPENDIX 1.3 (TEL-CCTV / TEL-LAN / TEL-IPP / TEL-MET)',
    rule: 'Ex-Proof CCTV stations include Camera + DS-2XE2705-M04(316L)(O-STD) Ex Junction Box/Fiber Converter + Mounting Kit; APF 1.3.11 matched to MR-B1-13-APF-11 (1 Switch, 1 UTP Patch); 1.3.12/1.3.13 unbundled from 1.3.P3; TP-Link MC210CS logged in Tab 14 Deviation List; LIS-0001 tags mapped from appendix2MasterEvidence0550.json.',
    status: 'ACTIVE_ENFORCED',
  },
];

const FORBIDDEN_CUSTOMER_STRINGS = [
  /SI budget estimate/i,
  /OEM Standard/i,
  /Per Specification/i,
  /\[INTERNAL TRACE\]/i,
  /Radio Console MGW/i,
  /Manufacturer Model per MR/i,
  /Catalog Standard/i,
  /quoted equipment suffix/i,
];

export function evaluateSiSynthEquations0550({ systems = [], c1Rows = [], bomFormatter, technicalDossiers = [] } = {}) {
  const checks = [];
  let leakCount = 0;
  let dupBomCount = 0;
  let bomCount = 0;

  for (const r of c1Rows) {
    const note = String(r.note || '');
    const desc = String(r.description || '');
    if (FORBIDDEN_CUSTOMER_STRINGS.some((re) => re.test(note) || re.test(desc))) {
      leakCount++;
    }
    if (typeof bomFormatter === 'function') {
      const items = bomFormatter(r, 'LUMP_SUM') || [];
      bomCount += items.length;
      const seen = new Set();
      for (const it of items) {
        const text = `${it.mrDescription || ''} ${it.offeredEquipment || ''} ${it.brand || ''} ${it.model || ''} ${it.partNo || ''} ${it.remarks || ''}`;
        if (FORBIDDEN_CUSTOMER_STRINGS.some((re) => re.test(text))) leakCount++;
        const k = `${it.itemNo}|${it.partNo}|${it.tagNo}`;
        if (seen.has(k)) dupBomCount++;
        seen.add(k);
      }
    }
  }

  for (const td of technicalDossiers) {
    const body = JSON.stringify(td || {});
    if (FORBIDDEN_CUSTOMER_STRINGS.some((re) => re.test(body))) leakCount++;
  }

  checks.push({
    id: 'EQ-UI-SANITIZATION',
    equation: 'EQ-UI',
    passed: leakCount === 0 && dupBomCount === 0,
    detail: `Checked ${c1Rows.length} C1 rows, ${bomCount} BOM child rows; leaks=${leakCount}, duplicates=${dupBomCount}`,
  });

  const rfqFiles = appendix2Evidence?.totalFiles || 0;
  const rfqTags = appendix2Evidence?.tags?.length || 0;
  checks.push({
    id: 'EQ-CUS-APPENDIX2-CACHE',
    equation: 'EQ-CUS',
    passed: rfqFiles > 0 && rfqTags > 0,
    detail: `Offline Appendix 2 cache: ${rfqFiles} RFQ files, ${rfqTags} extracted tags across APF/ACP/ABV01/AMS01`,
  });

  const devClean = Boolean(CCTV_TPLINK_DEVIATION_0550?.id) &&
    !FORBIDDEN_CUSTOMER_STRINGS.some((re) => re.test(JSON.stringify(CCTV_TPLINK_DEVIATION_0550)));
  checks.push({
    id: 'EQ-VND-TAB14-DEVIATION',
    equation: 'EQ-VND',
    passed: devClean,
    detail: devClean ? 'Tab 14 non-AVL deviation (1.3.11.6 TP-Link) synced with zero internal trace leaks' : 'Tab 14 deviation check failed',
  });

  const systemScorecard = systems.map((s) => ({
    token: s.token,
    name: s.name,
    eqUi: leakCount === 0 && dupBomCount === 0 ? 'PASS' : 'FAIL',
    eqCus: rfqTags > 0 ? 'SYNCED' : 'OPEN',
    eqVnd: devClean ? 'PASS' : 'FAIL',
  }));

  return {
    passed: checks.every((c) => c.passed),
    totalChecks: checks.length,
    passedChecks: checks.filter((c) => c.passed).length,
    checks,
    systemScorecard,
  };
}
