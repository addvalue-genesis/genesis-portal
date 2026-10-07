import React, { useMemo, useState } from "react";
import { PROJECT0550_COMMERCIAL_GROUPS } from "./Project0550CommercialModel";
import { PROJECT0550_SYSTEMS } from "./Project0550SystemRegistry";
import { auditForPriceLine } from "./Project0550A1PriceAudit";
import { classifyProject0550PriceLine } from "./Project0550PriceSourceModel";
import {
  CommercialPortfolioView,
  PriceSourceOverview,
  OutputContractStrip
} from "./ASKTSIPricedBreakdownForm";
import { convertFx } from "./Project0550FxControl";
import { PROJECT0550_PAGA_DIRECT_SERVICE_MODEL } from "./Project0550PagaDigitalThread";

function money(value,currency="USD"){
  if(!Number.isFinite(Number(value))) return "TBC";
  try{
    return new Intl.NumberFormat("en-US",{
      style:"currency",
      currency,
      maximumFractionDigits:2
    }).format(Number(value));
  }catch{
    return String(value);
  }
}

function systemByToken(token){
  return PROJECT0550_SYSTEMS.find(x=>x.token===token) || null;
}

function lineAmountIn(line,targetCurrency){
  if(!line) return null;
  const map=line.subtotalByCurrency||line.unitPriceByCurrency||{};
  if(Number.isFinite(Number(map[targetCurrency]))) return Number(map[targetCurrency]);

  for(const sourceCurrency of ["THB","USD","EUR","CNY"]){
    if(Number.isFinite(Number(map[sourceCurrency]))){
      return convertFx(Number(map[sourceCurrency]),sourceCurrency,targetCurrency);
    }
  }
  return null;
}

function amountFromBuildRow(row,targetCurrency){
  if(!row) return null;
  if(Number.isFinite(Number(row.amount))){
    return convertFx(Number(row.amount),String(row.currency||"THB").toUpperCase(),targetCurrency);
  }
  if(Number.isFinite(Number(row.amountThb))){
    return convertFx(Number(row.amountThb),"THB",targetCurrency);
  }
  return null;
}

function fallbackCostBasis(audit,targetCurrency){
  if(!audit) return {value:null,label:"COST TBC",basis:"No explicit controlled cost row"};
  if(audit.commercialPreview?.knownSelectedCostEur){
    return {
      value:convertFx(Number(audit.commercialPreview.knownSelectedCostEur),"EUR",targetCurrency),
      label:"KNOWN SELECTED COST",
      basis:"Controlled selected vendor cost; open completion cost remains separate"
    };
  }
  const priority=[
    /^CONTROLLED COST$/i,
    /^KNOWN SELECTED COST$/i,
    /^KNOWN PROCURED COST$/i,
    /^RAW MARKET COST$/i
  ];
  for(const pattern of priority){
    const row=(audit.buildUp||[]).find(x=>pattern.test(String(x.priceClass||"")));
    const value=amountFromBuildRow(row,targetCurrency);
    if(Number.isFinite(value)){
      return {value,label:row.priceClass,basis:row.item||audit.basis};
    }
  }
  return {value:null,label:"COST TBC",basis:audit.basis||"No explicit controlled cost row"};
}

function fallbackOffer(line,audit,targetCurrency){
  if(line?.includeInKnownCustomerSubtotal===false){
    const indicative=audit?.commercialPreview?.indicativeKnownCostSellEur;
    return {
      finalValue:null,
      indicativeValue:Number.isFinite(Number(indicative))
        ? convertFx(Number(indicative),"EUR",targetCurrency)
        : null,
      state:"FINAL SELL HOLD",
      label:"Indicative only"
    };
  }
  const value=lineAmountIn(line,targetCurrency);
  return {
    finalValue:Number.isFinite(value)?value:null,
    indicativeValue:null,
    state:line?.state||"TBC",
    label:"Controlled displayed line"
  };
}

function convertBindingAmount(row,targetCurrency){
  const amount=Number(row.allocated_amount);
  const currency=String(row.binding_currency||row.cost_currency||"THB").toUpperCase();
  if(!Number.isFinite(amount)) return null;
  return convertFx(amount,currency,targetCurrency);
}

function rowStateTone(text){
  const s=String(text||"").toUpperCase();
  if(/HOLD|OPEN|TBC|BLOCK|NOT READY/.test(s)) return "bad";
  if(/PARTIAL|WORKING|PRELIM|PROXY|MARKET/.test(s)) return "warn";
  return "good";
}

function InternalAnalysisRow({
  group,
  line,
  canonical,
  currency,
  open,
  onToggle
}){
  const audit=auditForPriceLine(group.lineCode);
  const sourceInfo=classifyProject0550PriceLine(group.lineCode,line);
  const systems=group.systemTokens.map(systemByToken).filter(Boolean);
  const bindings=(canonical.data?.costPriceBindings||[]).filter(x=>x.line_code===group.lineCode);
  const systemTokens=new Set(systems.map(x=>x.token));
  const associatedBindings=(canonical.data?.costPriceBindings||[]).filter(
    x=>systemTokens.has(x.system_code) && x.line_code!==group.lineCode
  );

  const dbCostValues=bindings.map(x=>convertBindingAmount(x,currency)).filter(Number.isFinite);
  const dbCost=dbCostValues.length ? dbCostValues.reduce((a,b)=>a+b,0) : null;
  const fallback=fallbackCostBasis(audit,currency);
  const costValue=Number.isFinite(dbCost)?dbCost:fallback.value;
  const costBasis=Number.isFinite(dbCost)
    ? "CANONICAL COST-PRICE BINDINGS"
    : fallback.label;

  const offer=fallbackOffer(line,audit,currency);
  const offerValue=offer.finalValue;
  const indicativeValue=offer.indicativeValue;
  const spread=Number.isFinite(costValue)&&Number.isFinite(offerValue)
    ? offerValue-costValue
    : null;

  const openItems=line?.openItems||[];
  const status=offer.finalValue===null ? offer.state : (line?.state||"CONTROLLED");
  const detailRows=bindings.length
    ? bindings.map(x=>({
        className:x.cost_category||"COST",
        item:x.cost_description,
        amount:convertBindingAmount(x,currency),
        state:x.binding_state||x.cost_status||"TBC",
        source:x.binding_code
      }))
    : (audit?.buildUp||[]).map(x=>({
        className:x.priceClass,
        item:x.item,
        amount:amountFromBuildRow(x,currency),
        amountText:x.amountText,
        state:x.note||"",
        source:"CONTROLLED CODE SNAPSHOT"
      }));

  return (
    <section className={"ica-row "+(open?"is-open":"")}>
      <button type="button" className="ica-row-head" onClick={onToggle}>
        <span className="ica-toggle">{open?"−":"+"}</span>
        <span className="ica-id">{group.lineCode}</span>
        <span className="ica-system">
          <strong>{group.label}</strong>
          <small>{systems.map(x=>x.token).join(" · ")}</small>
        </span>
        <span className="ica-value">
          <small>Cost / known basis</small>
          <strong>{Number.isFinite(costValue)?money(costValue,currency):"TBC"}</strong>
          <em>{costBasis}</em>
        </span>
        <span className="ica-value">
          <small>{Number.isFinite(offerValue)?"Controlled offer / sell":"Working / indicative sell"}</small>
          <strong>{
            Number.isFinite(offerValue)
              ? money(offerValue,currency)
              : Number.isFinite(indicativeValue)
                ? money(indicativeValue,currency)
                : "HOLD / TBC"
          }</strong>
          <em>{offer.label}</em>
        </span>
        <span className="ica-value">
          <small>Visible spread</small>
          <strong>{Number.isFinite(spread)?money(spread,currency):"—"}</strong>
          <em>{Number.isFinite(spread)?"Not automatically profit":"Needs closed cost + sell"}</em>
        </span>
        <span className={"ica-state "+rowStateTone(status)}>{status}</span>
      </button>

      {open ? (
        <div className="ica-row-body">
          <div className="ica-detail-grid">
            <article>
              <small>Commercial mapping</small>
              <strong>{group.allocation}</strong>
              <span>{systems.length===1
                ? "1 commercial line ↔ 1 engineering system"
                : "Composite line; do not invent system split without a controlled allocation driver."}</span>
            </article>
            <article>
              <small>Price source</small>
              <strong>{sourceInfo.short}</strong>
              <span>{sourceInfo.vendor||audit?.vendor||"No current vendor bound"} · {sourceInfo.quoteRef||audit?.quoteRef||"Source TBC"}</span>
            </article>
            <article>
              <small>Cost basis / completeness</small>
              <strong>{costBasis}</strong>
              <span>{fallback.basis}</span>
            </article>
            <article>
              <small>Open / release</small>
              <strong>{openItems.length} open item(s)</strong>
              <span>{audit?.action||line?.state||"Review controlled state"}</span>
            </article>
          </div>

          <div className="ica-system-children">
            <div className="ica-subhead">
              <strong>Engineering systems inside this commercial group</strong>
              <span>{systems.length} system(s)</span>
            </div>
            {systems.map(system=>(
              <div key={system.token}>
                <code>{system.moduleId}</code>
                <strong>{system.token}</strong>
                <span>{system.name}</span>
                <em>{group.allocation==="1:1"?"Direct commercial mapping":"Allocation remains controlled/open"}</em>
              </div>
            ))}
          </div>

          <div className="ica-cost-lines">
            <div className="ica-subhead">
              <strong>Cost / price build-up from controlled source</strong>
              <span>{bindings.length?"LIVE DB binding rows":"Controlled code snapshot rows"}</span>
            </div>
            {detailRows.length ? detailRows.map((r,idx)=>(
              <div key={(r.source||"row")+"-"+idx}>
                <span>{r.className}</span>
                <strong>{r.item}</strong>
                <em>{Number.isFinite(r.amount)?money(r.amount,currency):(r.amountText||"TBC")}</em>
                <small>{r.state}</small>
              </div>
            )) : <div className="ica-empty">No detailed cost binding is controlled yet. Keep TBC; do not derive a fake breakdown.</div>}
          </div>

          {(associatedBindings.length || group.lineCode==="A1-05") ? (
            <div className="ica-associated-cost">
              <div className="ica-subhead">
                <strong>Associated system service / lifecycle cost</strong>
                <span>Separate commercial lines · shown for analysis only · not added into A1 equipment row here</span>
              </div>
              {associatedBindings.length ? associatedBindings.map((r,idx)=>(
                <div key={(r.binding_code||"assoc")+"-"+idx}>
                  <span>{r.line_code} · {r.cost_category||"COST"}</span>
                  <strong>{r.cost_description}</strong>
                  <em>{Number.isFinite(convertBindingAmount(r,currency))?money(convertBindingAmount(r,currency),currency):"TBC"}</em>
                  <small>{r.binding_state||r.cost_status||"TBC"}</small>
                </div>
              )) : PROJECT0550_PAGA_DIRECT_SERVICE_MODEL.rows.map(r=>(
                <div key={r.code}>
                  <span>{r.commercialMap} · {r.category}</span>
                  <strong>{r.workObject}</strong>
                  <em>{r.mh.toLocaleString("en-US",{maximumFractionDigits:1})} MH · {money(r.internalCostThb,"THB")} internal</em>
                  <small>{money(r.baseSellThb,"THB")} base service sell · controlled Rev04 snapshot</small>
                </div>
              ))}
            </div>
          ) : null}

          {openItems.length ? (
            <div className="ica-open-items">
              <strong>Open items</strong>
              {openItems.map(x=><span key={x}>{x}</span>)}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export function InternalCostOfferAnalysis({
  lines,
  currency="USD",
  canonical,
  eurThbFx,
  usdThbFx,
  cnyThbFx
}){
  const [view,setView]=useState("OUTLINE");
  const [open,setOpen]=useState(()=>new Set(["A1-05"]));
  const codes=PROJECT0550_COMMERCIAL_GROUPS.map(x=>x.lineCode);

  const rows=useMemo(()=>PROJECT0550_COMMERCIAL_GROUPS.map(group=>({
    group,
    line:lines?.[group.lineCode]||{}
  })),[lines]);

  function toggle(code){
    setOpen(current=>{
      const next=new Set(current);
      if(next.has(code)) next.delete(code); else next.add(code);
      return next;
    });
  }

  return (
    <div className="ica-shell">
      <div className="ica-hero">
        <div>
          <small>7.1 · INTERNAL COST / OFFER ANALYSIS · PROJECTION ONLY</small>
          <h2>ดู Cost → Offer → Gap แบบบรรทัด และกด + / − เพื่อลงรายละเอียดต่อระบบ</h2>
          <p>
            หน้านี้ไม่สร้างราคาใหม่และไม่สร้าง engineering logic ใหม่.
            ใช้ canonical DB/control state ชุดเดียวกับ 7.0; ถ้า DB ยังไม่พร้อมจะแสดง controlled code snapshot พร้อมสถานะให้เห็นชัด.
          </p>
        </div>
        <div className="ica-origin">
          <strong>{canonical?.isLive?"LIVE DB":"CONTROLLED FALLBACK"}</strong>
          <span>{currency}</span>
          <small>{canonical?.data?.openChanges?.length||0} open change/revision event(s)</small>
        </div>
      </div>

      <div className="ica-toolbar">
        <div>
          <button className={view==="OUTLINE"?"active":""} onClick={()=>setView("OUTLINE")}>Outline / + −</button>
          <button className={view==="CHART"?"active":""} onClick={()=>setView("CHART")}>Graph</button>
          <button className={view==="SOURCE"?"active":""} onClick={()=>setView("SOURCE")}>Source / Output Control</button>
        </div>
        {view==="OUTLINE" ? (
          <div>
            <button onClick={()=>setOpen(new Set(codes))}>Expand all</button>
            <button onClick={()=>setOpen(new Set())}>Collapse all</button>
            <button onClick={()=>setOpen(new Set(["A1-05"]))}>PAGA only</button>
          </div>
        ) : null}
      </div>

      {view==="OUTLINE" ? (
        <div className="ica-outline">
          <div className="ica-columns">
            <span></span><span>Line</span><span>System / Group</span>
            <span>Cost</span><span>Offer / Sell</span><span>Spread</span><span>State</span>
          </div>
          {rows.map(({group,line})=>(
            <InternalAnalysisRow
              key={group.lineCode}
              group={group}
              line={line}
              canonical={canonical}
              currency={currency}
              open={open.has(group.lineCode)}
              onToggle={()=>toggle(group.lineCode)}
            />
          ))}
        </div>
      ) : null}

      {view==="CHART" ? (
        <CommercialPortfolioView
          lines={lines}
          currency={currency}
          eurThbFx={eurThbFx}
          usdThbFx={usdThbFx}
          cnyThbFx={cnyThbFx}
        />
      ) : null}

      {view==="SOURCE" ? (
        <>
          <PriceSourceOverview lines={lines} codes={codes}/>
          <OutputContractStrip/>
        </>
      ) : null}
    </div>
  );
}
