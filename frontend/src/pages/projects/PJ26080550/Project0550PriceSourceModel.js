import { auditForPriceLine } from "./Project0550A1PriceAudit";
import { vendorOfferForPriceLine } from "./Project0550VendorOfferRegister";

export const PROJECT0550_PRICE_SOURCE_CLASSES = {
  CURRENT_SELECTED_QUOTE:{
    key:"CURRENT_SELECTED_QUOTE",
    short:"Current selected quote",
    label:"CURRENT VENDOR QUOTE · SELECTED",
    tone:"good",
    confidence:"HIGH SOURCE CONFIDENCE / ENGINEERING CLOSURE MAY STILL BE OPEN",
    meaning:"A current vendor quotation is selected as the commercial source for this line."
  },
  CURRENT_PARTIAL_QUOTE:{
    key:"CURRENT_PARTIAL_QUOTE",
    short:"Current quote + completion",
    label:"CURRENT QUOTE · PARTIAL / MIXED",
    tone:"warn",
    confidence:"MEDIUM",
    meaning:"A current quotation anchors part of the line; unquoted scope is completed by other controlled bases."
  },
  MARKET_SANITY:{
    key:"MARKET_SANITY",
    short:"Market sanity",
    label:"MARKET-SANITY BUDGET",
    tone:"warn",
    confidence:"MEDIUM-LOW",
    meaning:"Current project quantity is used with market/reference pricing rather than a project vendor quotation."
  },
  PARAMETRIC_MODEL:{
    key:"PARAMETRIC_MODEL",
    short:"Parametric model",
    label:"PARAMETRIC / RESOURCE MODEL",
    tone:"neutral",
    confidence:"MODEL-DEPENDENT",
    meaning:"Price is derived from controlled workload, lifecycle, resource or pass-through drivers."
  },
  HISTORICAL_PROXY:{
    key:"HISTORICAL_PROXY",
    short:"Historical / proxy",
    label:"HISTORICAL / PROXY",
    tone:"neutral",
    confidence:"LOW-MEDIUM",
    meaning:"Current requirement/quantity is priced with historical or proxy rates pending a current quotation."
  },
  DUMMY_ALLOWANCE:{
    key:"DUMMY_ALLOWANCE",
    short:"Dummy / allowance",
    label:"DUMMY / WORKING ALLOWANCE",
    tone:"bad",
    confidence:"LOW",
    meaning:"A temporary explicit allowance is used because the commercial source is not yet available."
  },
  OPTION_HOLD:{
    key:"OPTION_HOLD",
    short:"Option / hold",
    label:"OPTION / HOLD / UNPRICED",
    tone:"bad",
    confidence:"N/A",
    meaning:"The line is optional, held, or intentionally unpriced."
  },
  UNKNOWN:{
    key:"UNKNOWN",
    short:"Unclassified",
    label:"SOURCE CLASS TBC",
    tone:"bad",
    confidence:"TBC",
    meaning:"The current line has not yet been classified."
  }
};

function has(text,pattern){
  return pattern.test(String(text||""));
}

export function classifyProject0550PriceLine(code,line={}){
  const audit=auditForPriceLine(code);
  const vendor=vendorOfferForPriceLine(code);
  const state=String(line.state||"");
  const grade=String(audit?.grade||"");
  const corpus=[state,grade,audit?.verdict,audit?.modelStatus].filter(Boolean).join(" · ");

  let sourceClass="UNKNOWN";
  if(has(corpus,/CURRENT QUOTE\s*\/\s*SELECTED|CURRENT QUOTE \/ SELECTED|VALID SOURCE/i)){
    sourceClass="CURRENT_SELECTED_QUOTE";
  }else if(vendor || has(corpus,/CURRENT QUOTE PARTIAL|PARTIAL CURRENT QUOTE|MIXED.SOURCE|CURRENT AIS COMPONENT/i)){
    sourceClass="CURRENT_PARTIAL_QUOTE";
  }else if(has(corpus,/MARKET.SANITY/i)){
    sourceClass="MARKET_SANITY";
  }else if(has(corpus,/PARAMETRIC|RESOURCE.PROTECTED|PASS.THROUGH|LOGISTICS|INSURANCE/i)){
    sourceClass="PARAMETRIC_MODEL";
  }else if(has(corpus,/HISTORICAL|PROXY|REPRICE/i)){
    sourceClass="HISTORICAL_PROXY";
  }else if(has(corpus,/DUMMY|ALLOWANCE/i)){
    sourceClass="DUMMY_ALLOWANCE";
  }else if(has(corpus,/OPTION|HOLD|NOT PRICED/i)){
    sourceClass="OPTION_HOLD";
  }

  const meta=PROJECT0550_PRICE_SOURCE_CLASSES[sourceClass];
  const vendorItemCount=vendor?.vendorItems?.length||0;
  const reconciliationCount=vendor?.reconciliation?.length||0;
  const buildUpCount=audit?.buildUp?.length||0;
  const openGapCount=line.openItems?.length||0;
  const detailCount=vendorItemCount+reconciliationCount+buildUpCount+openGapCount;

  return {
    code,
    sourceClass,
    ...meta,
    vendor:audit?.vendor || vendor?.vendor || line.vendor || null,
    quoteRef:audit?.quoteRef || vendor?.quoteRef || line.quoteRef || null,
    audit,
    vendorOffer:vendor,
    vendorItemCount,
    reconciliationCount,
    buildUpCount,
    openGapCount,
    detailCount,
    hasNestedDetail:detailCount>0 || Boolean(audit?.basis || audit?.source || line.internalTrace),
    releaseState:state || "TBC"
  };
}

export function summarizeProject0550PriceSources(lines={},codes=[]){
  const groups={};
  const details=[];
  for(const code of codes){
    const line=lines?.[code]||{};
    const info=classifyProject0550PriceLine(code,line);
    details.push(info);
    groups[info.sourceClass]=(groups[info.sourceClass]||0)+1;
  }

  return {
    totalLines:codes.length,
    groups,
    details,
    vendorBoundLines:details.filter(x=>x.vendorOffer).length,
    selectedQuoteLines:groups.CURRENT_SELECTED_QUOTE||0,
    partialQuoteLines:groups.CURRENT_PARTIAL_QUOTE||0,
    marketSanityLines:groups.MARKET_SANITY||0,
    historicalProxyLines:groups.HISTORICAL_PROXY||0,
    dummyAllowanceLines:groups.DUMMY_ALLOWANCE||0,
    parametricLines:groups.PARAMETRIC_MODEL||0,
    optionHoldLines:groups.OPTION_HOLD||0
  };
}

export function priceLineSourceLabel(code,line={}){
  return classifyProject0550PriceLine(code,line).label;
}
