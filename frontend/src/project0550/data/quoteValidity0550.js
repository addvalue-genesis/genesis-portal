const EXTENSION_APPROVED_ON = '2026-11-12';
export const QUOTE_EXTENSION_DAYS_0550 = 90;

// The project approved a single extension for bidding. The supplier's date
// stays on the Offer and in source evidence. Reviews before the decision use it.
export function quoteValidity0550(offer, reviewDate) {
 const quotedUntil = offer?.validUntil || '';
 const expiry = Date.parse(quotedUntil);
 const extended = Number.isFinite(expiry) && reviewDate >= EXTENSION_APPROVED_ON;
 const effectiveExpiry = extended ? expiry + QUOTE_EXTENSION_DAYS_0550 * 24 * 60 * 60 * 1000 : expiry;
 const effectiveUntil = extended ? new Date(effectiveExpiry).toISOString().split('T')[0] : quotedUntil;
 const expired = effectiveExpiry < Date.parse(reviewDate);
 return {
  effectiveUntil,
  expired,
  extended,
  current: Boolean(reviewDate && offer?.date && offer.date <= reviewDate && Number.isFinite(expiry) && !expired),
 };
}
