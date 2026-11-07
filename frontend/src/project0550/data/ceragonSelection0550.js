const quote = 'OFFER-CERAGON-26-30029-REVA1-E90E86E5-';
export const CERAGON_R10_0550 = quote + 'R10';
export const CERAGON_R11_0550 = quote + 'R11';
export const CERAGON_LINK_OWNER_0550 = 'LINE-CERAGON-ASK-REVA1-BASE';
export const CERAGON_DISH_ALLOWANCE_0550 = 'LINE-BID-DMR-ANTENNA-GAP-0550';
export const CERAGON_R11_DECISION_DATE_0550 = '2026-11-07';
export const CERAGON_R11_CONFIGURATION_0550 = 'CERAGON IP-50CX 7 GHz, 2+0, one Full Outdoor radio and one 1.2 m antenna per site, without Hot Standby.';
export const CERAGON_R11_OPEN_SCOPE_0550 = 'MR Appendix 1.5: reconcile Full Outdoor / no Hot Standby, MR antenna quantity versus BLD/TYP/LIS, APF cabinet and access switch, and both cable schedules. Verify net throughput at 99.99% availability with the 2+0 RF path losses.';
export const ceragonR11Selected0550 = data => data.lines.some(line =>
  line.id === CERAGON_LINK_OWNER_0550 && line.selected && line.offerId === CERAGON_R11_0550);
export const ceragonSupersededOffer0550 = (data, offerId) =>
  offerId === CERAGON_R10_0550 && ceragonR11Selected0550(data);
export const ceragonR11Source0550 = offer =>
  offer?.id === CERAGON_R11_0550 && offer.vendorId === 'VENDOR-CERAGON-0550' &&
  offer.currency === 'USD' && offer.unit === 'Lot' && offer.quoteEvidence?.revision === 'RevA1' &&
  offer.quoteEvidence.classification === 'OPTION' && offer.quoteEvidence.quotedQuantity === 0;

export const CERAGON_R11_C1_0550 = {
  'MR-B1-15-APF-01': [
    'APF end of the shared 2+0 link.',
    'APF cabinet shared with Wireless Broadband; check ADDVALUE allocation.',
    '1 IP-50CX Full Outdoor radio; high sub-band diplexer. No Hot Standby.',
    'No separate IDU. Full Outdoor interface proposed as a deviation.',
    '1 × 1.2 m dish per APF BLD, tag ANT-320-201; differs from MR quantity.',
    'Excluded by CERAGON. Check ADDVALUE LAN scope.',
  ],
  'MR-B1-15-APF-02': [
    'Offer: 75 m. BoQ: 80 m MM fibre assembly and DC cable. Confirm route, lengths and SM/MM compatibility.',
    'Full Outdoor fibre to customer network and DC power replace the IDU–ODU interface.',
    'Radio mounted to the antenna assembly through OMT; verify installation detail.',
  ],
  'MR-B1-15-ACP-01': [
    'ACP end of the same shared 2+0 link.',
    '1 IP-50CX Full Outdoor radio; low sub-band diplexer. No Hot Standby.',
    'No separate IDU. Reconcile the Radio Cabinet interface for Full Outdoor.',
    '1 × 1.2 m dish per ACP TYP/LIS, tag ANT-320-001; differs from MR quantity.',
  ],
  'MR-B1-15-ACP-02': [
    'Offer: 75 m. BoQ: 80 m MM fibre assembly and DC cable. Confirm route, lengths and SM/MM compatibility.',
    'Full Outdoor fibre to customer network and DC power replace the IDU–ODU interface.',
    'Radio mounted to the antenna assembly through OMT; verify installation detail.',
  ],
};
