/*
ASK-TSI Priced Breakdown List — JSX output contract
Source template snapshot inspected from:
  ASK-TSI Priced Breakdown List.xlsx
  Sheet: PriceBreakdown
  Range: A1:H80

This component represents the form/output contract.
It must be populated from controlled engineering/cost/commercial state.
It is NOT the engineering source of truth.
*/

import React, { useState } from "react";
import { traceForPriceLine } from "./Project0550PriceTrace";
import { auditForPriceLine } from "./Project0550A1PriceAudit";
import { vendorOfferForPriceLine } from "./Project0550VendorOfferRegister";
import { runProject0550EvidenceReasoning } from "./Project0550SmartControlEngine";
import {
  classifyProject0550PriceLine,
  summarizeProject0550PriceSources,
  PROJECT0550_PRICE_SOURCE_CLASSES
} from "./Project0550PriceSourceModel";
import {
  ASKTSI_PRICED_BREAKDOWN_TEMPLATE,
  PROJECT0550_OUTPUT_PROFILES
} from "./Project0550OutputContract";
import { PROJECT0550_SYSTEMS } from "./Project0550SystemRegistry";
import {
  PROJECT0550_COMMERCIAL_GROUPS,
  commercialGroupForLine
} from "./Project0550CommercialModel";
import {
  PROJECT0550_PAGA_SOURCE_CHAIN,
  PROJECT0550_PAGA_CANONICAL_THREAD,
  PROJECT0550_PAGA_METHOD_GROUPS,
  PROJECT0550_PAGA_REQUIREMENTS,
  PROJECT0550_PAGA_PARTICULAR_EQUATIONS,
  PROJECT0550_PAGA_DIRECT_SERVICE_MODEL,
  PROJECT0550_PAGA_OUTPUT_CHAIN,
  pagaRequirementSummary
} from "./Project0550PagaDigitalThread";
import { pagaRequirementMethodDetail } from "./Project0550PagaRequirementMethodDetail";

export { ASKTSI_PRICED_BREAKDOWN_TEMPLATE };

function money(value,currency="USD"){
  if(value===null || value===undefined || value==="") return "—";
  if(typeof value==="string") return value;
  try{
    return new Intl.NumberFormat("en-US",{style:"currency",currency,maximumFractionDigits:2}).format(value);
  }catch{
    return String(value);
  }
}

function buildUpAmount(row){
  if(row?.amountText) return row.amountText;
  if(Number.isFinite(row?.amount)) return money(row.amount,row.currency||"THB");
  if(Number.isFinite(row?.amountThb)) return money(row.amountThb,"THB");
  return "TBC";
}

function buildUpUnitPrice(row){
  if(Number.isFinite(row?.unitPrice)) return money(row.unitPrice,row.currency||"THB");
  if(Number.isFinite(row?.unitPriceThb)) return money(row.unitPriceThb,"THB");
  return "—";
}

function displaySourceValue(value,sourceCurrency,targetCurrency,eurThbFx,usdThbFx,cnyThbFx){
  if(!Number.isFinite(value)) return "—";
  if(sourceCurrency===targetCurrency) return money(value,sourceCurrency);
  const line={subtotalByCurrency:{[sourceCurrency]:value}};
  return displayAmount(line,targetCurrency,"subtotal",eurThbFx,usdThbFx,cnyThbFx);
}

function sourceAmountToThb(line,field,eurThbFx,usdThbFx,cnyThbFx){
  const map = field==="unitPrice" ? line.unitPriceByCurrency : line.subtotalByCurrency;
  if(!map) return null;

  if(Number.isFinite(map.THB)) return map.THB;

  const usdFx=Number(usdThbFx);
  if(Number.isFinite(map.USD) && Number.isFinite(usdFx) && usdFx>0) return map.USD * usdFx;

  const eurFx=Number(eurThbFx);
  if(Number.isFinite(map.EUR) && Number.isFinite(eurFx) && eurFx>0) return map.EUR * eurFx;

  const cnyFx=Number(cnyThbFx);
  if(Number.isFinite(map.CNY) && Number.isFinite(cnyFx) && cnyFx>0) return map.CNY * cnyFx;

  return null;
}

function convertedAmount(line,currency,field,eurThbFx,usdThbFx,cnyThbFx){
  const thb=sourceAmountToThb(line,field,eurThbFx,usdThbFx,cnyThbFx);
  if(!Number.isFinite(thb)) return null;

  if(currency==="THB") return thb;

  const usdFx=Number(usdThbFx);
  if(currency==="USD" && Number.isFinite(usdFx) && usdFx>0) return thb / usdFx;

  const eurFx=Number(eurThbFx);
  if(currency==="EUR" && Number.isFinite(eurFx) && eurFx>0) return thb / eurFx;

  const cnyFx=Number(cnyThbFx);
  if(currency==="CNY" && Number.isFinite(cnyFx) && cnyFx>0) return thb / cnyFx;

  return null;
}

function primarySourceCurrency(line,field){
  if(line?.sourceCurrency) return String(line.sourceCurrency).toUpperCase();
  const map = field==="unitPrice" ? line?.unitPriceByCurrency : line?.subtotalByCurrency;
  if(!map) return null;
  if(Number.isFinite(map.THB)) return "THB";
  if(Number.isFinite(map.EUR)) return "EUR";
  if(Number.isFinite(map.USD)) return "USD";
  if(Number.isFinite(map.CNY)) return "CNY";
  return null;
}

function displayAmount(line,currency,field,eurThbFx,usdThbFx,cnyThbFx){
  const sourceCurrency=primarySourceCurrency(line,field);
  const converted=convertedAmount(line,currency,field,eurThbFx,usdThbFx,cnyThbFx);
  if(Number.isFinite(converted)){
    const suffix=sourceCurrency && sourceCurrency!==currency ? " · BOT MID FX" : "";
    return money(converted,currency)+suffix;
  }

  const value=lineAmount(line,currency,field);
  if(value!==null && value!==undefined && value!=="") return money(value,currency);

  const map = field==="unitPrice" ? line.unitPriceByCurrency : line.subtotalByCurrency;
  if(map && Number.isFinite(map.EUR)){
    if(currency==="THB") return "THB HOLD · EUR/THB FX TBC";
    if(currency==="USD") return "USD HOLD · EUR/THB FX TBC";
    if(currency==="CNY") return "CNY HOLD · FX TBC";
    return money(map.EUR,"EUR");
  }
  if(map && Number.isFinite(map.CNY)){
    if(currency==="THB") return "THB HOLD · CNY/THB FX TBC";
    return money(map.CNY,"CNY");
  }
  return "—";
}

function stateTone(state){
  const s=String(state||"TBC").toLowerCase();
  if(s.includes("ready")||s.includes("approved")||s.includes("controlled")) return "good";
  if(s.includes("working")||s.includes("prelim")||s.includes("partial")||s.includes("budget")) return "warn";
  if(s.includes("open")||s.includes("tbc")||s.includes("not priced")||s.includes("block")) return "bad";
  return "neutral";
}

function Status({state}){
  const text=state||"TBC";
  return <span className={"bid-status "+stateTone(text)}>{text}</span>;
}

function SourceChip({info}){
  if(!info) return null;
  return (
    <span className={"ask-source-chip "+(info.tone||"neutral")} title={info.meaning}>
      {info.short}
    </span>
  );
}

export function PriceSourceOverview({lines,codes}){
  const summary=summarizeProject0550PriceSources(lines,codes);
  const order=[
    "CURRENT_SELECTED_QUOTE",
    "CURRENT_PARTIAL_QUOTE",
    "MARKET_SANITY",
    "PARAMETRIC_MODEL",
    "HISTORICAL_PROXY",
    "DUMMY_ALLOWANCE",
    "OPTION_HOLD"
  ];

  return (
    <div className="ask-source-overview">
      <div className="ask-source-overview-head">
        <div>
          <small>PRICE SOURCE COMPOSITION · A1</small>
          <strong>ตัวเลขในตารางไม่ได้มีความน่าเชื่อถือเท่ากันทุกบรรทัด</strong>
          <span>แยก Current Quote / Partial Quote / Market Sanity / Parametric / Historical / Dummy ให้เห็นก่อนดูยอดรวม</span>
        </div>
        <div className="ask-source-overview-rule">
          <b>{summary.vendorBoundLines}</b>
          <span>price lines มี vendor offer register</span>
        </div>
      </div>
      <div className="ask-source-overview-grid">
        {order.map(key=>{
          const meta=PROJECT0550_PRICE_SOURCE_CLASSES[key];
          const count=summary.groups[key]||0;
          return (
            <div className={"ask-source-summary-card "+meta.tone} key={key}>
              <small>{meta.label}</small>
              <strong>{count}</strong>
              <span>{meta.meaning}</span>
            </div>
          );
        })}
      </div>
      <div className="ask-source-overview-note">
        <strong>อ่านยอดรวมอย่างไร:</strong>
        <span>ยอดที่แสดงใน UI เป็น controlled working model ซึ่งอาจประกอบด้วย vendor quote + historical/proxy + parametric completion. คลิก “View details” เพื่อดูสิ่งที่อยู่ข้างในแต่ละบรรทัด.</span>
      </div>
    </div>
  );
}

export function OutputContractStrip(){
  const profiles=[
    PROJECT0550_OUTPUT_PROFILES.XLSX_CUSTOMER,
    PROJECT0550_OUTPUT_PROFILES.XLSX_INTERNAL,
    PROJECT0550_OUTPUT_PROFILES.DOCX_INTERNAL,
    PROJECT0550_OUTPUT_PROFILES.PDF_INTERNAL
  ];
  return (
    <div className="ask-output-contract-strip">
      <div className="ask-output-contract-title">
        <small>ONE CONTROLLED MODEL → MANY OUTPUTS</small>
        <strong>React = working view · Export = fixed document contract</strong>
        <span>XLSX จะเติมลง original ASK-TSI template A1:H80; Word/PDF ใช้ document model เดียวกัน ไม่ดึงข้อมูลจากหน้าจอแบบ copy/paste.</span>
      </div>
      <div className="ask-output-profile-list">
        {profiles.map(profile=>(
          <div key={profile.id}>
            <b>{profile.label}</b>
            <span>{profile.renderer}</span>
            <small>{profile.status}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function rowValue(lines,code){
  return lines?.[code] || {};
}

function vendorQuotedCost(vendorOffer){
  if(!vendorOffer) return null;
  if(Number.isFinite(vendorOffer.quotedFinal)) return vendorOffer.quotedFinal;
  const items=(vendorOffer.vendorItems||[]).filter(x=>x.inFinal!==false && Number.isFinite(x.total));
  if(!items.length) return null;
  return items.reduce((sum,x)=>sum+Number(x.total),0);
}

function commercialLayerStatus(code,audit,trace,line){
  const build=(audit?.buildUp||[]);
  const selling=build.find(x=>/SELLING PRICE/i.test(String(x.priceClass||"")));
  if(selling){
    return {
      state:"COMMERCIAL RULE APPLIED",
      detail:"Displayed controlled line includes the modeled commercial transformation shown in Price Build-up."
    };
  }
  if(code==="A1-05" || /not yet the final customer selling line|final customer sell not released/i.test(String(trace?.commercialRule||"")+" "+String(trace?.releaseState||""))){
    return {
      state:"NOT YET APPLIED / SELLING PRICE HOLD",
      detail:"Vendor/selected cost is controlled, but the final customer selling line has not been released."
    };
  }
  if(/HOLD|OPEN|TBC/i.test(String(line?.state||""))){
    return {
      state:"COMMERCIAL TREATMENT OPEN",
      detail:"The displayed baseline is not a released final selling price. Review Price Build-up / Engineering Trace."
    };
  }
  return {
    state:"CONTROLLED BASELINE — VERIFY BUILD-UP",
    detail:"Use Price Build-up and Commercial Rule to confirm which markup/allowance layers are already included."
  };
}

function lineAmount(line,currency,field){
  const map = field==="unitPrice" ? line.unitPriceByCurrency : line.subtotalByCurrency;
  if(map && Object.prototype.hasOwnProperty.call(map,currency)) return map[currency];
  return line[field];
}

function RemarkCell({base,line,mode}){
  const hasInternal = mode==="INTERNAL" && (line.internalTrace || line.openItems?.length);
  return (
    <div className="ask-remark">
      {base ? <div className="ask-remark-source">{base}</div> : null}
      {hasInternal ? (
        <details className="ask-trace">
          <summary>Internal trace / open items</summary>
          {line.internalTrace ? <div><strong>Trace:</strong> {line.internalTrace}</div> : null}
          {line.openItems?.length ? <div><strong>Open:</strong> {line.openItems.join("; ")}</div> : null}
        </details>
      ) : null}
    </div>
  );
}

function systemByToken(token){
  return PROJECT0550_SYSTEMS.find(x=>x.token===token) || null;
}

function RequirementBasisView({code,trace}){
  const commercialGroup=commercialGroupForLine(code);
  const systems=(commercialGroup?.systemTokens||[]).map(systemByToken).filter(Boolean);

  if(code==="A1-05"){
    const summary=pagaRequirementSummary();
    return (
      <div className="ask-digital-thread compact">
        <div className="ask-thread-banner">
          <div>
            <small>PAGA · CONTROLLED METHOD BINDING</small>
            <strong>First Principles → Constraint-Based Engineering → Parametric Cost → Commercial / Release</strong>
            <span>หน้านี้เป็น projection ของข้อมูลหลัก ไม่ใช่ logic ชุดใหม่. เปิดเฉพาะบรรทัดที่ต้องการตรวจด้วย + / −.</span>
          </div>
          <div>
            <b>{summary.sources}</b><span>sources</span>
            <b>{summary.requirements}</b><span>requirements</span>
            <b>{summary.particularEquations}</b><span>particular equations</span>
          </div>
        </div>

        <details className="ask-thread-detail">
          <summary>
            <span className="ask-detail-toggle"></span>
            <strong>Method binding · Canonical 25-stage chain</strong>
            <small>{PROJECT0550_PAGA_CANONICAL_THREAD.length} stages · Engineering Doctrine fullChain · presentation only</small>
            <em>DO NOT REORDER</em>
          </summary>
          <div className="ask-detail-body">
            <div className="ask-method-groups">
              {PROJECT0550_PAGA_METHOD_GROUPS.map((group)=>(
                <section key={group.id}>
                  <div className="ask-method-group-title">
                    <b>{group.id}</b>
                    <strong>{group.label}</strong>
                  </div>
                  <div className="ask-method-group-stages">
                    {group.stages.map(stage=>(
                      <div key={stage.id} className={"ask-method-stage "+String(stage.state).toLowerCase().replaceAll(" ","-").replaceAll("/","-")}>
                        <code>{String(stage.order).padStart(2,"0")}</code>
                        <strong>{stage.label}</strong>
                        <span>{stage.state}</span>
                        <small>{stage.detail}</small>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </details>

        <details className="ask-thread-detail">
          <summary>
            <span className="ask-detail-toggle"></span>
            <strong>Source set · MR / PHI / BOD / SPE / STD / DWG / Vendor</strong>
            <small>{PROJECT0550_PAGA_SOURCE_CHAIN.length} controlled source objects · not contractual precedence</small>
            <em>SOURCE BINDING</em>
          </summary>
          <div className="ask-detail-body">
            <div className="ask-source-set-note">
              <strong>Source Set — not contractual precedence</strong>
              <span>Source family แต่ละตัว bind เข้าข้อกำหนดตาม clause/role. ลำดับบนหน้าจอไม่ใช่ order of precedence เว้นแต่ contract ระบุ.</span>
            </div>
            <div className="ask-thread-source-chain">
              {PROJECT0550_PAGA_SOURCE_CHAIN.map((s)=>(
                <div className={"ask-thread-source "+String(s.state).toLowerCase().replaceAll("_","-")} key={s.code}>
                  <small>{s.class}</small>
                  <strong>{s.code}</strong>
                  <span>{s.document}</span>
                  <em>{s.locator}</em>
                  <p>{s.role}</p>
                </div>
              ))}
            </div>
          </div>
        </details>

        <div className="ask-thread-requirement-lines">
          <div className="ask-line-section-head">
            <strong>Requirement threads</strong>
            <span>แต่ละบรรทัด trace จาก Source → Need → Constraint/Input → Proof → Object/Qty → Equation/Driver</span>
          </div>
          {PROJECT0550_PAGA_REQUIREMENTS.map(req=>{
            const method=pagaRequirementMethodDetail(req.id);
            return (
              <details className="ask-thread-detail requirement" key={req.id}>
                <summary>
                  <span className="ask-detail-toggle"></span>
                  <code>{req.id}</code>
                  <strong>{req.title}</strong>
                  <small>{req.requirement}</small>
                  <em>{req.state}</em>
                </summary>
                <div className="ask-detail-body">
                  <div className="ask-thread-flow canonical">
                    <div><b>01 · Source / Evidence</b><span>{req.source.join(" · ")}</span></div>
                    <div><b>02 · Fundamental Need</b><span>{method?.fundamentalNeed || "TBC"}</span></div>
                    <div><b>03 · Constraint / Context</b><span>{req.constraints.join("; ")}{method?.interfaceContext?.length ? " | "+method.interfaceContext.join(", ") : ""}</span></div>
                    <div><b>04 · Engineering Input</b><span>{method?.engineeringInputs?.join(" · ") || "TBC"}</span></div>
                    <div><b>05 · CAL / Study / RPT → Proof</b><span>{req.proof.join(" · ")}</span></div>
                    <div><b>06 · Architecture / Object / Qty</b><span>{method?.architecture || "TBC"} | {req.objects.join(", ")} | {method?.requiredMtoState || req.drives.join(", ")}</span></div>
                    <div><b>07 · Equation / Downstream Driver</b><span>{req.equations.join(" · ")} → {req.drives.join(", ")}</span></div>
                  </div>
                </div>
              </details>
            );
          })}
        </div>

        <details className="ask-thread-detail">
          <summary>
            <span className="ask-detail-toggle"></span>
            <strong>PAGA Particular Equations</strong>
            <small>{PROJECT0550_PAGA_PARTICULAR_EQUATIONS.length} system-specific engineering equations / studies</small>
            <em>PARTICULAR</em>
          </summary>
          <div className="ask-detail-body">
            <div className="ask-particular-equations">
              {PROJECT0550_PAGA_PARTICULAR_EQUATIONS.map(eq=>(
                <div key={eq.code}>
                  <code>{eq.code}</code>
                  <strong>{eq.name}</strong>
                  <span>{eq.expression}</span>
                  <small>Input: {eq.input.join(" · ")} | Output: {eq.output.join(" · ")} | State: {eq.state}</small>
                </div>
              ))}
            </div>
          </div>
        </details>

        <details className="ask-thread-detail">
          <summary>
            <span className="ask-detail-toggle"></span>
            <strong>Downstream work / output groups</strong>
            <small>ย่อ canonical chain เพื่อดูผลกระทบไป MTO / Work / Cost / Commercial / Release</small>
            <em>PROJECTION</em>
          </summary>
          <div className="ask-detail-body">
            <div className="ask-output-thread">
              {PROJECT0550_PAGA_OUTPUT_CHAIN.map((x,idx)=>(
                <React.Fragment key={x.step}>
                  <div><b>{x.step}</b><strong>{x.label}</strong><span>{x.output}</span></div>
                  {idx<PROJECT0550_PAGA_OUTPUT_CHAIN.length-1 ? <i>→</i> : null}
                </React.Fragment>
              ))}
            </div>
          </div>
        </details>
      </div>
    );
  }

  return (
    <div className="ask-digital-thread generic">
      <div className="ask-thread-banner">
        <div>
          <small>RFQ BINDING · GENERIC 19-SYSTEM PATTERN</small>
          <strong>Source binding exists now; detailed requirement threads migrate system-by-system using the same PAGA pilot schema.</strong>
          <span>{trace.requirement}</span>
        </div>
      </div>
      <div className="ask-generic-system-bindings">
        {systems.map(system=>(
          <article key={system.token}>
            <div><code>{system.moduleId}</code><strong>{system.token}</strong><span>{system.name}</span></div>
            <dl>
              <div><dt>MR</dt><dd>{system.rfq?.mr}</dd></div>
              <div><dt>PHI</dt><dd>{system.rfq?.phi}</dd></div>
              <div><dt>BOD</dt><dd>{system.rfq?.bod}</dd></div>
              <div><dt>SPE</dt><dd>{system.rfq?.spe}</dd></div>
              <div><dt>STD</dt><dd>{system.rfq?.std}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}

function PagaCommercialComposition({audit,currency,eurThbFx,usdThbFx,cnyThbFx}){
  const p=audit?.commercialPreview;
  if(!p) return null;
  const additions=p.knownSelectedCostEur-p.sourceCostEur;
  const uplift=p.indicativeKnownCostSellEur-p.knownSelectedCostEur;
  const total=p.indicativeKnownCostSellEur;
  const pct=v=>total>0 ? Math.max(0,(v/total)*100) : 0;
  return (
    <div className="ask-commercial-decomp">
      <div className="ask-commercial-decomp-head">
        <div>
          <small>COMMERCIAL DECOMPOSITION · PAGA PILOT</small>
          <strong>Known numeric composition before unresolved completion cost</strong>
          <span>Final selling price remains HOLD; open completion items are shown separately and never treated as zero.</span>
        </div>
        <div>
          <small>INDICATIVE KNOWN-COST SELL</small>
          <strong>{money(p.indicativeKnownCostSellEur,"EUR")}</strong>
          <span>{displaySourceValue(p.indicativeKnownCostSellEur,"EUR",currency,eurThbFx,usdThbFx,cnyThbFx)}</span>
        </div>
      </div>
      <div className="ask-commercial-stack" aria-label="PAGA known commercial composition">
        <div className="vendor" style={{width:pct(p.sourceCostEur)+"%"}} title={"Vendor net "+money(p.sourceCostEur,"EUR")}></div>
        <div className="addition" style={{width:pct(additions)+"%"}} title={"Requirement additions "+money(additions,"EUR")}></div>
        <div className="uplift" style={{width:pct(uplift)+"%"}} title={"Commercial uplift "+money(uplift,"EUR")}></div>
      </div>
      <div className="ask-commercial-legend">
        <div><i className="vendor"></i><span>Vendor net cost</span><strong>{money(p.sourceCostEur,"EUR")}</strong><em>{pct(p.sourceCostEur).toFixed(1)}%</em></div>
        <div><i className="addition"></i><span>Controlled requirement additions</span><strong>{money(additions,"EUR")}</strong><em>{pct(additions).toFixed(1)}%</em></div>
        <div><i className="uplift"></i><span>Commercial uplift on known cost</span><strong>{money(uplift,"EUR")}</strong><em>{pct(uplift).toFixed(1)}%</em></div>
        <div className="tbc"><i></i><span>Open completion / lifecycle cost</span><strong>TBC</strong><em>not zero</em></div>
      </div>
    </div>
  );
}

function PagaServiceAnalytics(){
  const model=PROJECT0550_PAGA_DIRECT_SERVICE_MODEL;
  const maxSell=Math.max(...model.rows.map(x=>x.baseSellThb),1);
  const maxMh=Math.max(...model.rows.map(x=>x.mh),1);
  return (
    <div className="ask-service-analytics">
      <div className="ask-service-analytics-head">
        <div>
          <small>PAGA DIRECT SERVICE / LABOR · CONTROLLED REV04</small>
          <strong>ดู workload, internal labor cost และ base service sell แยกตามงาน</strong>
          <span>{model.rule}</span>
        </div>
        <div>
          <b>{model.totals.directMh.toLocaleString("en-US",{maximumFractionDigits:1})} MH</b><span>direct modeled workload</span>
          <b>{money(model.totals.internalCostThb,"THB")}</b><span>internal direct labor cost</span>
          <b>{money(model.totals.baseSellThb,"THB")}</b><span>base service sell before shared/common allocation</span>
        </div>
      </div>
      <div className="ask-service-bars">
        {model.rows.map(row=>(
          <div key={row.code} className="ask-service-row">
            <div className="ask-service-label">
              <code>{row.code}</code>
              <strong>{row.workObject}</strong>
              <span>{row.category} · {row.role} · {row.commercialMap}</span>
            </div>
            <div className="ask-service-metric">
              <small>Workload</small>
              <div className="ask-service-track mh"><i style={{width:(row.mh/maxMh*100)+"%"}}></i></div>
              <strong>{row.mh.toLocaleString("en-US",{maximumFractionDigits:1})} MH</strong>
            </div>
            <div className="ask-service-metric">
              <small>Internal Cost</small>
              <strong>{money(row.internalCostThb,"THB")}</strong>
            </div>
            <div className="ask-service-metric">
              <small>Base Service Sell</small>
              <div className="ask-service-track sell"><i style={{width:(row.baseSellThb/maxSell*100)+"%"}}></i></div>
              <strong>{money(row.baseSellThb,"THB")}</strong>
            </div>
          </div>
        ))}
      </div>
      <div className="ask-service-exclusions">
        <b>Not forced into PAGA yet:</b>
        <span>{model.exclusions.join(" · ")}</span>
      </div>
    </div>
  );
}

export function CommercialPortfolioView({lines,currency,eurThbFx,usdThbFx,cnyThbFx}){
  const rows=PROJECT0550_COMMERCIAL_GROUPS.map(group=>{
    const line=rowValue(lines,group.lineCode);
    let value=convertedAmount(line,currency,"subtotal",eurThbFx,usdThbFx,cnyThbFx);
    if(!Number.isFinite(value)) value=lineAmount(line,currency,"subtotal") ?? lineAmount(line,currency,"unitPrice");
    const info=classifyProject0550PriceLine(group.lineCode,line);
    const costInput=line.includeInKnownCustomerSubtotal===false || /COST_INPUT/i.test(String(line.priceRole||""));
    return {
      ...group,
      line,
      info,
      value:Number.isFinite(value)?value:null,
      costInput,
      systems:group.systemTokens.map(systemByToken).filter(Boolean)
    };
  }).sort((a,b)=>(b.value||0)-(a.value||0));
  const max=Math.max(...rows.map(x=>x.value||0),1);
  return (
    <div className="ask-commercial-portfolio">
      <div className="ask-commercial-portfolio-head">
        <div>
          <small>SYSTEM / COMMERCIAL GROUP ANALYTICS</small>
          <strong>มองราคาแพง–ถูกก่อน แล้วค่อย drill down ไป Cost / Labor / Vendor / Gap</strong>
          <span>15 customer price groups roll up 19 engineering systems. Composite lines are not arbitrarily split until a controlled allocation driver exists.</span>
        </div>
        <div>
          <b>19</b><span>engineering systems</span>
          <b>15</b><span>A1 commercial groups</span>
        </div>
      </div>
      <div className="ask-commercial-bars">
        {rows.map(row=>(
          <div className={"ask-commercial-bar-row "+(row.costInput?"is-cost-input":"")} key={row.lineCode}>
            <div className="ask-commercial-bar-label">
              <code>{row.lineCode}</code>
              <strong>{row.label}</strong>
              <span>{row.systems.map(x=>x.token).join(" · ")}</span>
            </div>
            <div className="ask-commercial-bar-track">
              <div style={{width:((row.value||0)/max*100)+"%"}}></div>
            </div>
            <div className="ask-commercial-bar-value">
              <strong>{row.value===null ? "TBC" : money(row.value,currency)}</strong>
              <span>{row.costInput ? "SOURCE COST INPUT / SELL HOLD" : row.info.short}</span>
              {row.allocation!=="1:1" ? <small>{row.allocation}</small> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OutlineSection({title,summary,status,open,onToggle,children,className=""}){
  return (
    <section className={"ask-outline-section "+className+(open?" is-open":"")}>
      <button type="button" className="ask-outline-head" onClick={onToggle}>
        <span className="ask-outline-toggle">{open ? "−" : "+"}</span>
        <span className="ask-outline-title-wrap">
          <strong>{title}</strong>
          {summary ? <small>{summary}</small> : null}
        </span>
        {status ? <span className="ask-outline-status">{status}</span> : null}
      </button>
      {open ? <div className="ask-outline-body">{children}</div> : null}
    </section>
  );
}

function PriceTraceDetail({code,line,currency,eurThbFx,usdThbFx,cnyThbFx}){
  const trace=traceForPriceLine(code,line);
  const audit=auditForPriceLine(code);
  const vendorOffer=vendorOfferForPriceLine(code);
  const displayed=displayAmount(line,currency,"subtotal",eurThbFx,usdThbFx,cnyThbFx);
  const [traceTab,setTraceTab]=useState("OVERVIEW");
  const [traceMode,setTraceMode]=useState("OUTLINE");
  const [outlineOpen,setOutlineOpen]=useState(()=>new Set(["engineering","cost","gaps"]));
  const sourceInfo=classifyProject0550PriceLine(code,line);
  const vendorCost=vendorQuotedCost(vendorOffer);
  const commercialStatus=commercialLayerStatus(code,audit,trace,line);
  const traceSourceCurrency=primarySourceCurrency(line,"subtotal");
  const fxEquationRequired=Boolean(traceSourceCurrency && currency && traceSourceCurrency!==currency);
  const equationsForDisplay=[
    ...(Array.isArray(trace.equations)?trace.equations:[]),
    ...(fxEquationRequired && !(trace.equations||[]).some(x=>String(x).startsWith("GEQ-034"))
      ? ["GEQ-034 Controlled Currency Conversion"]
      : [])
  ];

  const outlineKeys=["engineering","vendor","reconciliation","cost","gaps","equations","source"];
  function setOutlinePreset(keys){
    setOutlineOpen(new Set(keys));
  }
  function toggleOutline(key){
    setOutlineOpen(current=>{
      const next=new Set(current);
      if(next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const nodes=[
    ["Requirement",trace.requirement],
    ["Constraint",trace.constraint],
    ["CAL / Study / RPT",trace.proof],
    ["Quantity Driver",trace.quantityDriver],
    ["Equation ID",equationsForDisplay],
    ["Cost Object",trace.costObject],
    ["Commercial Rule",trace.commercialRule],
    ["Displayed Price / Release",displayed+" · "+trace.releaseState],
  ];

  const tabs=[
    ["OVERVIEW","Overview"],
    ["ENGINEERING","Engineering Trace"],
    ["VENDOR","Vendor Offer"],
    ["RECON","Reconciliation"],
    ["BUILDUP","Price Build-up"],
    ["GAPS","Open Gaps"],
  ];

  return (
    <tr className="ask-engineering-trace-row">
      <td colSpan="8">
        <div className="ask-engineering-trace">
          <div className="ask-engineering-trace-head">
            <div>
              <small>{code} · {trace.modelClass}</small>
              <strong>Engineering → Cost → Selling Price Trace</strong>
              <span>{trace.sourceBasis}</span>
            </div>
            <Status state={trace.releaseState}/>
          </div>

          <div className="ask-trace-mode-switch">
            <button type="button" className={traceMode==="OUTLINE"?"active":""} onClick={()=>setTraceMode("OUTLINE")}>
              Outline / Group View
            </button>
            <button type="button" className={traceMode==="DETAIL"?"active":""} onClick={()=>setTraceMode("DETAIL")}>
              Detailed Tabs
            </button>
            {traceMode==="OUTLINE" ? (
              <div className="ask-outline-actions">
                <button type="button" onClick={()=>setOutlinePreset(outlineKeys)}>Expand all</button>
                <button type="button" onClick={()=>setOutlinePreset([])}>Collapse all</button>
                <button type="button" onClick={()=>setOutlinePreset(["engineering","cost","gaps"])}>Working view</button>
                <button type="button" onClick={()=>setOutlinePreset(["gaps"])}>Open gaps only</button>
              </div>
            ) : null}
          </div>

          {traceMode==="OUTLINE" ? (
            <div className="ask-outline-view">
              <div className="ask-outline-summary">
                <div>
                  <small>DISPLAYED LINE</small>
                  <strong>{displayed}</strong>
                  <span>{trace.releaseState}</span>
                </div>
                <div>
                  <small>PRICE BASIS</small>
                  <strong><SourceChip info={sourceInfo}/></strong>
                  <span>{sourceInfo.confidence}</span>
                </div>
                <div>
                  <small>VENDOR / SOURCE</small>
                  <strong>{sourceInfo.vendor || "No current vendor quote bound"}</strong>
                  <span>{sourceInfo.quoteRef || audit?.source || "Source closure required"}</span>
                </div>
                <div>
                  <small>OPEN GAPS</small>
                  <strong>{(line.openItems||[]).length}</strong>
                  <span>{commercialStatus.state}</span>
                </div>
              </div>

              <OutlineSection
                title="1 · Engineering & Proof"
                summary="Requirement → Constraint → CAL / Study / RPT → Quantity Driver"
                status={trace.releaseState}
                open={outlineOpen.has("engineering")}
                onToggle={()=>toggleOutline("engineering")}
              >
                <RequirementBasisView code={code} trace={trace}/>
              </OutlineSection>

              <OutlineSection
                title="2 · Vendor Offer"
                summary={vendorOffer ? `${vendorOffer.vendor} · ${vendorOffer.vendorItems?.length||0} quoted item(s)` : "No current vendor offer registered"}
                status={vendorOffer?.status || audit?.grade || "OPEN"}
                open={outlineOpen.has("vendor")}
                onToggle={()=>toggleOutline("vendor")}
              >
                {vendorOffer ? (
                  <>
                    <div className="ask-outline-source-head">
                      <div><small>AS QUOTED</small><strong>{vendorOffer.vendor}</strong><span>{vendorOffer.quoteRef} · {vendorOffer.quoteDate || "Date TBC"}</span></div>
                      <div><small>CURRENCY</small><strong>{vendorOffer.currency || "TBC"}</strong><span>{vendorOffer.incoterm || ""}</span></div>
                      <div><small>VENDOR COST INPUT</small><strong>{Number.isFinite(vendorOffer.quotedFinal) ? money(vendorOffer.quotedFinal,vendorOffer.currency) : (Number.isFinite(vendorCost) ? money(vendorCost,vendorOffer.currency) : "PARTIAL / TBC")}</strong><span>Before project commercial treatment</span></div>
                    </div>
                    <div className="ask-outline-list">
                      {(vendorOffer.vendorItems||[]).map((item,idx)=>(
                        <div key={item.item+"-"+idx}>
                          <span>{item.group}</span>
                          <strong>{item.item}</strong>
                          <em>{item.qty} {item.unit} · {Number.isFinite(item.total) ? money(item.total,vendorOffer.currency) : "TBC"}</em>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="ask-outline-empty">No current vendor offer bound to this price line.</div>
                )}
              </OutlineSection>

              <OutlineSection
                title="3 · Required vs Offered"
                summary={vendorOffer?.reconciliation?.length ? `${vendorOffer.reconciliation.length} controlled reconciliation row(s)` : "Reconciliation not available yet"}
                status={vendorOffer?.reconciliation?.length ? "REVIEW" : "OPEN"}
                open={outlineOpen.has("reconciliation")}
                onToggle={()=>toggleOutline("reconciliation")}
              >
                {vendorOffer?.reconciliation?.length ? (
                  <div className="ask-outline-list">
                    {vendorOffer.reconciliation.map((row,idx)=>(
                      <div key={row.object+"-"+idx}>
                        <span>{row.status}</span>
                        <strong>{row.object}</strong>
                        <em>Required {String(row.required)} · Offered {String(row.offered)} · Gap {String(row.gap)}</em>
                      </div>
                    ))}
                  </div>
                ) : <div className="ask-outline-empty">{audit?.basis || trace.quantityDriver}</div>}
              </OutlineSection>

              <OutlineSection
                title="4 · Cost & Selling Price"
                summary="Source cost → completion / landed / lifecycle → commercial rule → customer sell"
                status={commercialStatus.state}
                open={outlineOpen.has("cost")}
                onToggle={()=>toggleOutline("cost")}
                className="is-cost"
              >
                <div className="ask-outline-grid">
                  <article><b>Cost Object</b><span>{trace.costObject}</span></article>
                  <article><b>Commercial Rule</b><span>{trace.commercialRule}</span></article>
                </div>
                {code==="A1-05" ? (
                  <>
                    <PagaCommercialComposition
                      audit={audit}
                      currency={currency}
                      eurThbFx={eurThbFx}
                      usdThbFx={usdThbFx}
                      cnyThbFx={cnyThbFx}
                    />
                    <PagaServiceAnalytics/>
                  </>
                ) : null}
                {audit?.commercialPreview ? (
                  <div className="ask-price-ladder">
                    <div><small>1 · Vendor net cost</small><strong>{money(audit.commercialPreview.sourceCostEur,"EUR")}</strong><span>Source quotation cost</span></div>
                    <em>→</em>
                    <div><small>2 · Known selected cost</small><strong>{money(audit.commercialPreview.knownSelectedCostEur,"EUR")}</strong><span>Vendor cost + controlled priced additions</span></div>
                    <em>→</em>
                    <div className="preview"><small>3 · Indicative sell</small><strong>{money(audit.commercialPreview.indicativeKnownCostSellEur,"EUR")}</strong><span>{displaySourceValue(audit.commercialPreview.indicativeKnownCostSellEur,"EUR",currency,eurThbFx,usdThbFx,cnyThbFx)} · {audit.commercialPreview.formula}</span></div>
                    <em>→</em>
                    <div className="hold"><small>4 · Final customer sell</small><strong>HOLD</strong><span>Open completion cost must be closed first</span></div>
                  </div>
                ) : null}
                {audit?.buildUp?.length ? (
                  <div className="ask-outline-list compact">
                    {audit.buildUp.map((row,idx)=>(
                      <div key={row.priceClass+"-"+row.item+"-"+idx}>
                        <span>{row.priceClass}</span>
                        <strong>{row.item}</strong>
                        <em>{buildUpAmount(row)}</em>
                      </div>
                    ))}
                  </div>
                ) : null}
              </OutlineSection>

              <OutlineSection
                title="5 · Open Gaps / Next Closure"
                summary={(line.openItems||[]).length ? `${line.openItems.length} open item(s)` : "No itemized open-gap list"}
                status={(line.openItems||[]).length ? "OPEN" : "CHECK"}
                open={outlineOpen.has("gaps")}
                onToggle={()=>toggleOutline("gaps")}
                className="is-gaps"
              >
                <div className="ask-gap-list">
                  {(line.openItems||[]).length
                    ? line.openItems.map(x=><span key={x}>{x}</span>)
                    : <span>{audit?.action || "Close source / proof / quantity / commercial gaps."}</span>}
                </div>
              </OutlineSection>

              <OutlineSection
                title="6 · Equations Used"
                summary={`${equationsForDisplay.length} controlled equation(s)`}
                status="COMMON / GENERIC + PARTICULAR"
                open={outlineOpen.has("equations")}
                onToggle={()=>toggleOutline("equations")}
              >
                <div className="ask-equation-tags">
                  {equationsForDisplay.map(x=><code key={x}>{x}</code>)}
                </div>
              </OutlineSection>

              <OutlineSection
                title="7 · Source / Evidence"
                summary={audit?.quoteRef || sourceInfo.quoteRef || "Controlled project source chain"}
                status={audit?.grade || "CONTROLLED TRACE"}
                open={outlineOpen.has("source")}
                onToggle={()=>toggleOutline("source")}
              >
                <div className="ask-outline-grid">
                  <article><b>Primary Source</b><span>{audit?.source || trace.sourceBasis}</span></article>
                  <article><b>Audit Verdict</b><span>{audit?.verdict || "TBC"}</span></article>
                  <article><b>CBE / Parametric Status</b><span>{audit?.modelStatus || "CONTROLLED BASELINE / MATURITY VARIES"}</span></article>
                  <article><b>Internal Trace</b><span>{line.internalTrace || "No additional internal trace."}</span></article>
                </div>
              </OutlineSection>
            </div>
          ) : null}

          {traceMode==="DETAIL" ? (
            <div className="ask-trace-subtabs">
              {tabs.map(([key,label])=>(
                <button
                  key={key}
                  type="button"
                  className={traceTab===key ? "active" : ""}
                  onClick={()=>setTraceTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}

          {traceMode==="DETAIL" && traceTab==="OVERVIEW" ? (
            <div className="ask-line-overview">
              <div className="ask-overview-grid">
                <div>
                  <small>Displayed controlled line</small>
                  <strong>{displayed}</strong>
                  <span>{line.state || "TBC"}</span>
                </div>
                <div>
                  <small>Primary price basis</small>
                  <strong><SourceChip info={sourceInfo}/></strong>
                  <span>{sourceInfo.confidence}</span>
                </div>
                <div>
                  <small>Vendor / source</small>
                  <strong>{sourceInfo.vendor || "No current vendor quote bound"}</strong>
                  <span>{sourceInfo.quoteRef || audit?.source || "Source closure required"}</span>
                </div>
                <div>
                  <small>Nested detail</small>
                  <strong>{sourceInfo.detailCount}</strong>
                  <span>{sourceInfo.vendorItemCount} vendor items · {sourceInfo.reconciliationCount} reconciliation · {sourceInfo.openGapCount} gaps</span>
                </div>
              </div>

              <div className="ask-overview-explain">
                <div>
                  <b>What this number means</b>
                  <span>{audit?.basis || trace.costObject}</span>
                </div>
                <div>
                  <b>Why it is not final yet</b>
                  <span>{audit?.action || line.openItems?.join("; ") || trace.releaseState}</span>
                </div>
              </div>

              {vendorOffer?.vendorItems?.length ? (
                <div className="ask-overview-children">
                  <div className="ask-overview-children-head">
                    <b>Quoted child items</b>
                    <span>{vendorOffer.vendorItems.length} item(s) · source preserved AS QUOTED</span>
                  </div>
                  <div className="ask-child-list">
                    {vendorOffer.vendorItems.slice(0,8).map((item,idx)=>(
                      <div key={item.item+"-"+idx}>
                        <span>{item.group}</span>
                        <strong>{item.item}</strong>
                        <em>{item.qty} {item.unit} · {Number.isFinite(item.total) ? money(item.total,vendorOffer.currency) : "Option / TBC"}</em>
                      </div>
                    ))}
                  </div>
                  {vendorOffer.vendorItems.length>8 ? <small className="ask-more-note">+ {vendorOffer.vendorItems.length-8} more — open Vendor Offer tab for the full list</small> : null}
                </div>
              ) : null}

              {audit?.buildUp?.length ? (
                <div className="ask-overview-build">
                  <b>Modeled completion inside this selling line</b>
                  <div>
                    {audit.buildUp.map((item,idx)=>(
                      <span key={item.item+"-"+idx}>
                        <small>{item.priceClass}</small>
                        <strong>{item.item}</strong>
                        <em>{buildUpAmount(item)}</em>
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {traceMode==="DETAIL" && traceTab==="ENGINEERING" ? (
            <>
              <div className="ask-price-audit">
                <div><b>GDrive Price Audit</b><span>{audit?.grade || "NOT AUDITED"}</span></div>
                <div><b>Verdict</b><span>{audit?.verdict || "TBC"}</span></div>
                <div><b>Vendor</b><span>{audit?.vendor || vendorOffer?.vendor || "NO CURRENT VENDOR QUOTE IDENTIFIED"}</span></div>
                <div><b>Quote / Source Ref</b><span>{audit?.quoteRef || vendorOffer?.quoteRef || audit?.source || "TBC"}</span></div>
                <div><b>CBE / Parametric Status</b><span>{audit?.modelStatus || "CONTROLLED BASELINE / MATURITY VARIES"}</span></div>
              </div>

              <div className="ask-engineering-trace-chain">
                {nodes.map(([label,value],idx)=>{
                  const tone =
                    label==="Equation ID" ? " is-equation" :
                    label==="Displayed Price / Release" ? " is-price" :
                    label==="Commercial Rule" ? " is-commercial" :
                    "";
                  return (
                    <div className={"ask-engineering-trace-node"+tone} key={label}>
                      <b>{String(idx+1).padStart(2,"0")} · {label}</b>
                      {Array.isArray(value)
                        ? <div className="ask-equation-tags">{value.map(x=><code key={x}>{x}</code>)}</div>
                        : <span>{value}</span>}
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}

          {traceMode==="DETAIL" && traceTab==="VENDOR" ? (
            <div className="ask-vendor-view">
              {vendorOffer ? (
                <>
                  <div className="ask-cost-layer-banner">
                    <div>
                      <small>PRICE LAYER 1 · SOURCE COST</small>
                      <strong>VENDOR OFFER — AS QUOTED · BEFORE PROJECT COMMERCIAL RULE</strong>
                      <span>ตัวเลขใน tab นี้คือราคาที่ supplier เสนอมาโดยตรง ใช้เป็น procurement/source cost input. ยังไม่ใช่ราคาขายลูกค้าของ ADDVALUE/SAMTEL เว้นแต่มีการระบุเป็นอย่างอื่นใน source.</span>
                    </div>
                    <div>
                      <small>COMMERCIAL STATUS</small>
                      <strong>{commercialStatus.state}</strong>
                      <span>{commercialStatus.detail}</span>
                    </div>
                  </div>
                  <div className="ask-vendor-head">
                    <div>
                      <small>AS-QUOTED SOURCE</small>
                      <strong>{vendorOffer.vendor}</strong>
                      <span>{vendorOffer.quoteRef} · {vendorOffer.quoteDate || "Date TBC"}</span>
                    </div>
                    <div>
                      <small>Currency</small>
                      <strong>{vendorOffer.currency || "TBC"}</strong>
                      <span>{vendorOffer.incoterm || vendorOffer.status || ""}</span>
                    </div>
                    <div>
                      <small>Vendor Net / Quoted Final · Cost Input</small>
                      <strong>{Number.isFinite(vendorOffer.quotedFinal) ? money(vendorOffer.quotedFinal,vendorOffer.currency) : (Number.isFinite(vendorCost) ? money(vendorCost,vendorOffer.currency)+" · mapped quoted items" : "PARTIAL / NO SINGLE PACKAGE TOTAL")}</strong>
                      {Number.isFinite(vendorOffer.quotedTotalBeforeDiscount) ? (
                        <span>Before discount {money(vendorOffer.quotedTotalBeforeDiscount,vendorOffer.currency)} · Discount {money(vendorOffer.discount,vendorOffer.currency)}</span>
                      ) : null}
                    </div>
                  </div>

                  <div className="ask-vendor-table-wrap">
                    <table className="ask-vendor-table">
                      <thead>
                        <tr>
                          <th>Group</th>
                          <th>Vendor Item — As Quoted</th>
                          <th>Qty</th>
                          <th>Unit</th>
                          <th>Vendor Unit Price · Cost</th>
                          <th>Vendor Total · Cost</th>
                          <th>Base / Option</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendorOffer.vendorItems.map((row,idx)=>(
                          <tr key={row.group+"-"+row.item+"-"+idx}>
                            <td>{row.group}</td>
                            <td>{row.item}{row.note ? <small>{row.note}</small> : null}</td>
                            <td>{row.qty}</td>
                            <td>{row.unit}</td>
                            <td>{Number.isFinite(row.unitPrice) ? money(row.unitPrice,vendorOffer.currency) : "—"}</td>
                            <td>{Number.isFinite(row.total) ? money(row.total,vendorOffer.currency) : "—"}</td>
                            <td><Status state={row.inFinal ? "IN QUOTED BASE" : "OPTION / NOT IN BASE"}/></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="ask-source-lock">
                    <strong>Source lock:</strong>
                    <span>Vendor Offer shows supplier/source cost AS RECEIVED and BEFORE ADDVALUE/SAMTEL commercial treatment. Requirement corrections, completion allowances, logistics and mark-up belong in Reconciliation / Price Build-up — not in this tab.</span>
                  </div>
                </>
              ) : (
                <div className="ask-empty-source">
                  <strong>NO CURRENT VENDOR OFFER REGISTERED</strong>
                  <span>{audit?.source || "No current commercial quotation is bound to this line."}</span>
                  <p>Use Engineering Trace / Price Build-up to see whether the displayed amount comes from historical, parametric, market-sanity or allowance data.</p>
                </div>
              )}
            </div>
          ) : null}

          {traceMode==="DETAIL" && traceTab==="RECON" ? (
            <div className="ask-recon-view">
              {vendorOffer?.reconciliation?.length ? (
                <table className="ask-recon-table">
                  <thead>
                    <tr>
                      <th>Required Object</th>
                      <th>Required</th>
                      <th>Vendor Offered</th>
                      <th>Unit</th>
                      <th>Gap</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorOffer.reconciliation.map((row,idx)=>(
                      <tr key={row.object+"-"+idx}>
                        <td>{row.object}</td>
                        <td>{String(row.required)}</td>
                        <td>{String(row.offered)}</td>
                        <td>{row.unit}</td>
                        <td>{String(row.gap)}</td>
                        <td><Status state={row.status}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="ask-empty-source">
                  <strong>REQUIRED VS OFFERED MATRIX NOT AVAILABLE YET</strong>
                  <span>{audit?.basis || trace.quantityDriver}</span>
                  <p>This remains OPEN until the required quantity and the vendor BOM can be compared object-by-object.</p>
                </div>
              )}
            </div>
          ) : null}

          {traceMode==="DETAIL" && traceTab==="BUILDUP" ? (
            <div className="ask-build-view">
              <div className="ask-price-source-detail">
                <div><b>Basis</b><span>{audit?.basis || trace.costObject}</span></div>
                <div><b>Primary source</b><span>{audit?.source || trace.sourceBasis}</span></div>
                <div><b>Displayed controlled line</b><span>{displayed} · {commercialStatus.state}</span></div>
              </div>

              {audit?.commercialPreview ? (
                <div className="ask-price-ladder">
                  <div>
                    <small>1 · Vendor net cost</small>
                    <strong>{money(audit.commercialPreview.sourceCostEur,"EUR")}</strong>
                    <span>Source quotation cost</span>
                  </div>
                  <em>→</em>
                  <div>
                    <small>2 · Known selected cost</small>
                    <strong>{money(audit.commercialPreview.knownSelectedCostEur,"EUR")}</strong>
                    <span>Vendor cost + controlled priced additions</span>
                  </div>
                  <em>→</em>
                  <div className="preview">
                    <small>3 · Indicative sell · known cost only</small>
                    <strong>{money(audit.commercialPreview.indicativeKnownCostSellEur,"EUR")}</strong>
                    <span>{displaySourceValue(audit.commercialPreview.indicativeKnownCostSellEur,"EUR",currency,eurThbFx,usdThbFx,cnyThbFx)} · BOT MID FX · {audit.commercialPreview.formula}</span>
                  </div>
                  <em>→</em>
                  <div className="hold">
                    <small>4 · Final customer sell</small>
                    <strong>HOLD</strong>
                    <span>Open completion cost must be closed first</span>
                  </div>
                </div>
              ) : null}

              {audit?.commercialPreview ? (
                <div className="ask-commercial-preview-note">
                  <strong>สำคัญ:</strong>
                  <span>ราคา {money(audit.commercialPreview.indicativeKnownCostSellEur,"EUR")} เป็นเพียงราคาขายเชิงพาณิชย์บน “known selected cost” ที่ปิดแล้วเท่านั้น ยังไม่รวม {audit.commercialPreview.openCompletion.join(", ")} จึงห้ามใช้เป็น Final Customer Selling Price.</span>
                </div>
              ) : null}

              {audit?.quantityBasis?.length ? (
                <div className="ask-quantity-basis">
                  <b>Project Quantity Basis</b>
                  <div>{audit.quantityBasis.map(x=><span key={x}>{x}</span>)}</div>
                </div>
              ) : null}

              {audit?.buildUp?.length ? (
                <div className="ask-build-up">
                  <div className="ask-build-up-head">
                    <b>Vendor Cost → Completion → Controlled Cost → Commercial Preview / Sell</b>
                    <span>SOURCE / MODEL CURRENCY</span>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Class</th>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {audit.buildUp.map((row,idx)=>(
                        <tr key={row.priceClass+"-"+row.item+"-"+idx}>
                          <td>{row.priceClass}</td>
                          <td>{row.item}</td>
                          <td>{row.qty || ""}</td>
                          <td>{buildUpUnitPrice(row)}</td>
                          <td>{buildUpAmount(row)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="ask-empty-source">
                  <strong>DETAILED NUMERIC BUILD-UP NOT MIGRATED YET</strong>
                  <span>{trace.costObject}</span>
                  <p>The line is still traceable by source class and equations, but the itemized arithmetic has not yet been bound to this view.</p>
                </div>
              )}
            </div>
          ) : null}

          {traceMode==="DETAIL" && traceTab==="GAPS" ? (
            <div className="ask-gaps-view">
              <div className="ask-price-source-detail">
                <div><b>Release State</b><span>{trace.releaseState}</span></div>
                <div><b>Audit Verdict</b><span>{audit?.verdict || "TBC"}</span></div>
                <div><b>Closure Action</b><span>{audit?.action || "Close source / proof / quantity / commercial gaps."}</span></div>
              </div>
              <div className="ask-gap-list">
                {(line.openItems || []).length
                  ? line.openItems.map(x=><span key={x}>{x}</span>)
                  : <span>No itemized open-gap list has been migrated for this line yet.</span>}
              </div>
            </div>
          ) : null}

          <div className="ask-engineering-trace-rule">
            <strong>Control:</strong>
            <span>Vendor Offer = SOURCE COST as quoted. Reconciliation = required vs offered. Price Build-up = completion / landed / lifecycle cost + commercial transformation. Displayed customer selling price is valid only after those layers and release gates are explicitly closed.</span>
          </div>
        </div>
      </td>
    </tr>
  );
}

function numericSubtotal(lines,codes,currency,eurThbFx,usdThbFx,cnyThbFx){
  return codes.reduce((sum,code)=>{
    const line=rowValue(lines,code);
    if(line.includeInKnownCustomerSubtotal===false) return sum;
    let v=lineAmount(line,currency,"subtotal") ?? lineAmount(line,currency,"unitPrice");
    if(!Number.isFinite(v)) v=convertedAmount(line,currency,"subtotal",eurThbFx,usdThbFx,cnyThbFx);
    return Number.isFinite(v) ? sum+v : sum;
  },0);
}

function hasOpenTotal(lines,codes,currency){
  return codes.some(code=>{
    const line=rowValue(lines,code);
    const v=lineAmount(line,currency,"subtotal") ?? lineAmount(line,currency,"unitPrice");
    const state=String(line.state||"");
    return v===null || v===undefined || /OPEN|TBC|HOLD|NOT PRICED/i.test(state);
  });
}

export function ASKTSIPricedBreakdownForm({lines={},currency="USD",mode="INTERNAL",eurThbFx=null,usdThbFx=31.50,cnyThbFx=null}){
  const t=ASKTSI_PRICED_BREAKDOWN_TEMPLATE;
  const [traceCode,setTraceCode]=useState(null);

  function toggleTrace(code){
    setTraceCode(current=>current===code ? null : code);
  }
  const aCodes=t.partA.map(([code])=>code);
  const bCodes=t.partB.map(([code])=>code);
  const cCodes=t.partC.map(([code])=>code);

  const aKnown=numericSubtotal(lines,aCodes,currency,eurThbFx,usdThbFx,cnyThbFx);
  const bKnown=numericSubtotal(lines,bCodes,currency,eurThbFx,usdThbFx,cnyThbFx);
  const cKnown=numericSubtotal(lines,cCodes,currency,eurThbFx,usdThbFx,cnyThbFx);
  const aHold=hasOpenTotal(lines,aCodes,currency);
  const bHold=hasOpenTotal(lines,bCodes,currency);
  const evidenceGate=runProject0550EvidenceReasoning(undefined,{candidateLines:lines});
  const outputHold=aHold || bHold || evidenceGate.status==="BLOCKED";

  return (
    <div className="bid-stack">
      <section className="bid-panel">
        <div className="bid-panel-head">
          <div>
            <small>OUTPUT CONTRACT · {t.sourceFile} · {t.sheet}!{t.range}</small>
            <h2>ASK-TSI Priced Breakdown List</h2>
          </div>
          <Status state={mode==="INTERNAL"?"CONTROLLED INTERNAL VIEW":"CUSTOMER FORM VIEW"}/>
        </div>
        <p>
          Form นี้รับค่าจาก controlled engineering / cost / commercial model.
          ช่องว่าง/TBC ต้องคงสถานะไว้และห้ามถูกแปลงเป็นศูนย์โดยอัตโนมัติ.
          หน้าจอเป็น rich working view; customer export ยังคงรูปแบบ ASK-TSI ต้นฉบับ.
        </p>
        <div className="ask-price-audit">
          <div><b>Evidence Gate</b><span>{evidenceGate.status}</span></div>
          <div><b>Memory</b><span>{evidenceGate.memoryRevision}</span></div>
          <div><b>Current baseline</b><span>{evidenceGate.baselineRevision}</span></div>
          <div><b>Stale/conflict blockers</b><span>{evidenceGate.summary.blockers}</span></div>
          <div>
            <b>Output rule</b>
            <span>{evidenceGate.status==="BLOCKED" ? "HOLD — candidate must be rebuilt from controlled state" : "Candidate passes current evidence-memory checks"}</span>
          </div>
        </div>
        {evidenceGate.findings.length ? (
          <details className="ask-trace">
            <summary>Evidence gate findings</summary>
            {evidenceGate.findings.map((finding,idx)=>(
              <div key={(finding.code||"EVD")+"-"+idx}>
                <strong>{finding.code}</strong> · {finding.message}
                {finding.action ? <> · <em>{finding.action}</em></> : null}
              </div>
            ))}
          </details>
        ) : null}

        <div className="bid-table-wrap ask-price-wrap">
          <table className="bid-table ask-price-table">
            <colgroup>
              <col className="ask-col-sn"/>
              <col className="ask-col-tag"/>
              <col className="ask-col-desc"/>
              <col className="ask-col-qty"/>
              <col className="ask-col-unit"/>
              <col className="ask-col-price"/>
              <col className="ask-col-subtotal"/>
              <col className="ask-col-remark"/>
            </colgroup>
            <thead>
              <tr>{t.columns.map(c=><th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody>
              <tr className="ask-part-head"><td colSpan="8"><strong>Part A: BASIC PRICE / A1. Main Equipment Price</strong></td></tr>
              {t.partA.map(([code,sn,description])=>{
                const line=rowValue(lines,code);
                const sourceInfo=classifyProject0550PriceLine(code,line);
                return (
                  <React.Fragment key={code}>
                    <tr className={traceCode===code ? "ask-price-line is-trace-open" : "ask-price-line"}>
                      <td><strong>{sn}</strong><small>{code}</small></td>
                      <td>{line.tagNo || ""}</td>
                      <td>
                        <strong>{description}</strong>
                        {mode==="INTERNAL" ? (
                          <div className="ask-row-source-line">
                            <SourceChip info={sourceInfo}/>
                            {sourceInfo.vendor ? <span className="ask-row-vendor">{sourceInfo.vendor}</span> : null}
                          </div>
                        ) : null}
                        {line.state?<><br/><Status state={line.state}/></>:null}
                        {mode==="INTERNAL" ? (
                          <button type="button" className="ask-trace-btn" onClick={()=>toggleTrace(code)}>
                            {traceCode===code ? "▾ Close details" : `▸ View details${sourceInfo.detailCount ? " · "+sourceInfo.detailCount : ""}`}
                          </button>
                        ) : null}
                      </td>
                      <td>{line.qty ?? 1}</td>
                      <td>{line.unit || "Lot"}</td>
                      <td>{displayAmount(line,currency,"unitPrice",eurThbFx,usdThbFx,cnyThbFx)}</td>
                      <td>{displayAmount(line,currency,"subtotal",eurThbFx,usdThbFx,cnyThbFx)}</td>
                      <td><RemarkCell base={line.sourceRemark || t.sourceRemarks.A_DEFAULT} line={line} mode={mode}/></td>
                    </tr>
                    {traceCode===code ? <PriceTraceDetail code={code} line={line} currency={currency} eurThbFx={eurThbFx} usdThbFx={usdThbFx} cnyThbFx={cnyThbFx}/> : null}
                  </React.Fragment>
                );
              })}
              <tr className="ask-total-row">
                <td colSpan="5"><strong>Part A Known Customer-Priced Portion</strong><small>Vendor-cost-only / unreleased selling lines such as open PAGA are excluded</small></td>
                <td></td>
                <td><strong>{money(aKnown,currency)}</strong></td>
                <td>{aHold ? <Status state="PART A TOTAL = HOLD"/> : <Status state="PART A TOTAL READY"/>}</td>
              </tr>

              <tr className="ask-part-head"><td colSpan="8"><strong>Part B: OTHERS</strong></td></tr>
              {t.partB.map(([code,sourceDescription])=>{
                const line=rowValue(lines,code);
                const description=sourceDescription || (mode==="INTERNAL" ? (line.description || "") : "");
                const sourceInfo=classifyProject0550PriceLine(code,line);
                return (
                  <React.Fragment key={code}>
                    <tr className={traceCode===code ? "ask-price-line is-trace-open" : "ask-price-line"}>
                      <td><strong>{code}</strong></td>
                      <td>
                        {description}
                        {mode==="INTERNAL" ? (
                          <div className="ask-row-source-line">
                            <SourceChip info={sourceInfo}/>
                          </div>
                        ) : null}
                      </td>
                      <td>
                        {line.tagNo || ""}
                        {mode==="INTERNAL" ? (
                          <button type="button" className="ask-trace-btn" onClick={()=>toggleTrace(code)}>
                            {traceCode===code ? "▾ Close details" : `▸ View details${sourceInfo.detailCount ? " · "+sourceInfo.detailCount : ""}`}
                          </button>
                        ) : null}
                      </td>
                      <td>{line.qty ?? "1 lot"}</td>
                      <td>{line.unit || ""}</td>
                      <td>{displayAmount(line,currency,"unitPrice",eurThbFx,usdThbFx,cnyThbFx)}</td>
                      <td>{displayAmount(line,currency,"subtotal",eurThbFx,usdThbFx,cnyThbFx)}</td>
                      <td><RemarkCell base={line.sourceRemark || t.sourceRemarks[code] || ""} line={line} mode={mode}/>{line.state?<><br/><Status state={line.state}/></>:null}</td>
                    </tr>
                    {traceCode===code ? <PriceTraceDetail code={code} line={line} currency={currency} eurThbFx={eurThbFx} usdThbFx={usdThbFx} cnyThbFx={cnyThbFx}/> : null}
                  </React.Fragment>
                );
              })}
              <tr className="ask-total-row">
                <td colSpan="5"><strong>Part B Known Customer-Priced Portion</strong><small>Known numeric portions are included; open/TBC remainder keeps Part B on HOLD</small></td>
                <td></td>
                <td><strong>{money(bKnown,currency)}</strong></td>
                <td>{bHold ? <Status state="PART B TOTAL = HOLD"/> : <Status state="PART B TOTAL READY"/>}</td>
              </tr>
              <tr className="ask-base-total">
                <td colSpan="5"><strong>BASE OFFER = PART A + PART B</strong><small>This is the project offer amount before optional Part C.</small></td>
                <td></td>
                <td><strong>{outputHold ? "HOLD" : money(aKnown+bKnown,currency)}</strong></td>
                <td><Status state={outputHold ? "PROJECT OFFER = HOLD" : "PROJECT OFFER READY"}/></td>
              </tr>
              <tr><td colSpan="8">Prices shall include for all the scope of supply and work as specified in the Material Requisition, but not limited to above items.</td></tr>

              <tr className="ask-part-head"><td colSpan="8"><strong>Part C: OPTIONS — EXCLUDED FROM BASE OFFER UNLESS SELECTED</strong></td></tr>
              {t.partC.map(([code,description])=>{
                const line=rowValue(lines,code);
                return (
                  <React.Fragment key={code}>
                    <tr className={traceCode===code ? "ask-price-line is-trace-open" : "ask-price-line"}>
                      <td><strong>{code}</strong></td>
                      <td>{description}</td>
                      <td>
                        {line.tagNo || ""}
                        <button type="button" className="ask-trace-btn" onClick={()=>toggleTrace(code)}>
                          {traceCode===code ? "Close trace" : "Trace price"}
                        </button>
                      </td>
                      <td>{line.qty ?? "1 lot"}</td>
                      <td>{line.unit || ""}</td>
                      <td>{displayAmount(line,currency,"unitPrice",eurThbFx,usdThbFx,cnyThbFx)}</td>
                      <td>{displayAmount(line,currency,"subtotal",eurThbFx,usdThbFx,cnyThbFx)}</td>
                      <td><RemarkCell base={line.sourceRemark || t.sourceRemarks[code] || ""} line={line} mode={mode}/>{line.state?<><br/><Status state={line.state}/></>:null}</td>
                    </tr>
                    {traceCode===code ? <PriceTraceDetail code={code} line={line} currency={currency} eurThbFx={eurThbFx} usdThbFx={usdThbFx} cnyThbFx={cnyThbFx}/> : null}
                  </React.Fragment>
                );
              })}
              <tr className="ask-option-total">
                <td colSpan="5"><strong>Part C Known Options Subtotal</strong><small>For reference only; not included in Base Offer automatically.</small></td>
                <td></td>
                <td><strong>{money(cKnown,currency)}</strong></td>
                <td><Status state="OPTIONS / SEPARATE"/></td>
              </tr>
              <tr><td colSpan="8"><strong>Remark:</strong> {t.sourceRemarks.FINAL}</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
