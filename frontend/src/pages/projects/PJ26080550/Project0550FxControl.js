/*
PJ2608-0550 — CONTROLLED FX REFERENCE

Purpose:
- Currency display/conversion in the React working view must use an explicit,
  traceable FX basis.
- Vendor/source currency remains unchanged in source evidence.
- Cross-currency display uses THB as the common bridge.

Current official reference:
Bank of Thailand — FM_FX_001_S3
Rates of Exchange of Commercial Banks in Bangkok Metropolis
Latest published at time of control update: 06-Oct-2026 18:00 ICT
Unit: THB per 1 unit foreign currency

Policy for working cross-currency display:
Use BOT MID RATE consistently for USD / EUR / CNY.
This is a working/reference conversion only, not a firm hedged project FX.
*/

export const PROJECT0550_FX_CONTROL = {
  id:"BOT-FM_FX_001_S3-20261006-MID",
  authority:"Bank of Thailand",
  report:"FM_FX_001_S3",
  reportTitle:"Rates of Exchange of Commercial Banks in Bangkok Metropolis",
  asOfDate:"2026-10-06",
  lastUpdated:"2026-10-06 18:00 ICT",
  rateType:"MID RATE",
  unit:"THB per 1 unit foreign currency",
  sourceUrl:"https://app.bot.or.th/BTWS_STAT/statistics/ReportPage.aspx?language=eng&reportID=123",
  thbPerUnit:{
    THB:1,
    USD:33.6643,
    EUR:37.7629,
    CNY:5.0217
  },
  cross:{
    EURUSD:37.7629/33.6643,
    EURCNY:37.7629/5.0217,
    CNYUSD:5.0217/33.6643
  },
  policy:{
    useFor:"WORKING / DISPLAY / BUDGETARY CROSS-CURRENCY CONVERSION",
    firmProjectFx:false,
    allowSilentFallback:false,
    note:"Source/vendor currency remains authoritative. BOT mid rate is used only to translate the controlled amount into the selected display currency."
  }
};

export function fxRate(fromCurrency,toCurrency,control=PROJECT0550_FX_CONTROL){
  const from=String(fromCurrency||"").toUpperCase();
  const to=String(toCurrency||"").toUpperCase();
  if(from===to) return 1;
  const fromThb=control.thbPerUnit[from];
  const toThb=control.thbPerUnit[to];
  if(!Number.isFinite(fromThb)||!Number.isFinite(toThb)||toThb<=0) return null;
  return fromThb/toThb;
}

export function convertFx(amount,fromCurrency,toCurrency,control=PROJECT0550_FX_CONTROL){
  const value=Number(amount);
  const rate=fxRate(fromCurrency,toCurrency,control);
  if(!Number.isFinite(value)||!Number.isFinite(rate)) return null;
  return value*rate;
}

export function fxBasisLabel(control=PROJECT0550_FX_CONTROL){
  return `${control.authority} · ${control.report} · ${control.rateType} · ${control.asOfDate}`;
}
