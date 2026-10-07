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
import { PROJECT0550_PAGA_LIFECYCLE_PLAN } from "./Project0550LifecycleExecutionModel";
import { PROJECT0550_PART_A_LEGACY_PROXY_RULE } from "./Project0550CommercialAllocationPolicy";
import { priceLayersForLine } from "./Project0550PricingLayerModel";
import {
  PROJECT0550_PAGA_BULK_ROWS,
  PROJECT0550_PAGA_BULK_SUMMARY
} from "./Project0550PagaBulkModel";

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
  const explicitSource=String(line.sourceCurrency||"").toUpperCase();
  const sourceOrder=explicitSource
    ? [explicitSource,...["THB","EUR","USD","CNY"].filter(x=>x!==explicitSource)]
    : ["THB","EUR","USD","CNY"];

  for(const sourceCurrency of sourceOrder){
    if(Number.isFinite(Number(map[sourceCurrency]))){
      return sourceCurrency===targetCurrency
        ? Number(map[sourceCurrency])
        : convertFx(Number(map[sourceCurrency]),sourceCurrency,targetCurrency);
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

function parseMeta(value){
  if(!value) return {};
  if(typeof value==="object") return value;
  try{return JSON.parse(value);}catch{return {};}
}

function PagaBulkMtoView({canonical}){
  const liveRows=canonical?.data?.bulkMto||[];
  const materialSnapshot=PROJECT0550_PAGA_BULK_ROWS.filter(x=>x.objectClass!=="SERVICE");
  const serviceSnapshot=PROJECT0550_PAGA_BULK_ROWS.filter(x=>x.objectClass==="SERVICE");

  const rows=liveRows.length
    ? liveRows.map(r=>{
        const meta=parseMeta(r.metadata_json);
        return {
          id:String(r.mto_code||"").replace(/^PAGA-/,""),
          item:r.description,
          objectClass:r.object_class,
          family:r.material_family,
          ownership:r.ownership_class,
          refQty:meta.reference_qty ?? null,
          requiredQty:r.required_qty ?? null,
          unit:r.unit,
          qtyState:r.quantity_status,
          basis:meta.reference_basis||"Canonical DB MTO state",
          route:r.commercial_treatment,
          installRoute:r.object_class==="BULK"||r.object_class==="ACCESSORY" ? "C1 physical installation labor" : "TBC",
          source:"LIVE DB"
        };
      })
    : materialSnapshot.map(r=>({...r,requiredQty:null,source:"CONTROLLED SOURCE SNAPSHOT"}));

  return (
    <div className="ica-bulk">
      <div className="ica-subhead">
        <strong>PAGA Bulk / MTO · Engineering object first, commercial roll-up second</strong>
        <span>{liveRows.length ? "LIVE DB canonical MTO" : PROJECT0550_PAGA_BULK_SOURCE_LABEL} · required qty is not released unless explicitly controlled</span>
      </div>

      <div className="ica-bulk-summary">
        <div><b>{PROJECT0550_PAGA_BULK_SUMMARY.materialAccessoryRows}</b><span>material/accessory source rows</span></div>
        <div><b>{PROJECT0550_PAGA_BULK_SUMMARY.serviceRows}</b><span>service rows reclassified out of bulk</span></div>
        <div><b>{PROJECT0550_PAGA_BULK_SUMMARY.releasedQuantityRows}</b><span>released order-quantity rows in source pilot</span></div>
      </div>

      <div className="ica-bulk-columns">
        <span></span><span>ID</span><span>Bulk / material object</span><span>Qty basis</span><span>Engineering ownership</span><span>Commercial route</span>
      </div>

      <div className="ica-bulk-lines">
        {rows.map(row=>(
          <details key={row.id} className="ica-bulk-line">
            <summary>
              <span className="ica-bulk-toggle"></span>
              <code>{row.id}</code>
              <span className="ica-bulk-name"><strong>{row.item}</strong><small>{row.family||row.objectClass}</small></span>
              <span className="ica-bulk-qty">
                <strong>{row.requiredQty!==null && row.requiredQty!==undefined ? row.requiredQty+" "+(row.unit||"") : row.refQty!==null && row.refQty!==undefined ? "Ref "+row.refQty+" "+(row.unit||"") : "TBC"}</strong>
                <small>{row.qtyState}</small>
              </span>
              <span className="ica-bulk-owner"><strong>{row.ownership}</strong><small>{row.source}</small></span>
              <span className="ica-bulk-route"><strong>{row.route}</strong><small>{row.installRoute}</small></span>
            </summary>
            <div className="ica-bulk-detail">
              <div><b>Specification / object class</b><span>{row.spec||row.objectClass||"TBC"}</span></div>
              <div><b>Quantity / evidence basis</b><span>{row.basis||"TBC"}</span></div>
              <div><b>Installation linkage</b><span>{row.labour||row.installRoute||"TBC"}</span></div>
              <div><b>Control</b><span>Material quantity remains separate from C1 installation labor and B2 logistics. Vendor inclusion must be reconciled before adding cost.</span></div>
            </div>
          </details>
        ))}
      </div>

      <div className="ica-bulk-service-routing">
        <div className="ica-subhead">
          <strong>Rows found in the bulk pilot that are NOT bulk material</strong>
          <span>Reclassified to the correct service/commercial work object to avoid double count</span>
        </div>
        {serviceSnapshot.map(row=>(
          <div key={row.id}>
            <code>{row.id}</code>
            <strong>{row.item}</strong>
            <span>{row.route}</span>
            <em>{row.basis}</em>
          </div>
        ))}
      </div>
    </div>
  );
}

const PROJECT0550_PAGA_BULK_SOURCE_LABEL="PAGA Bulk Pilot Rev00 / controlled source snapshot";

function PagaLifecycleResponsibilityView({currency}){
  return (
    <div className="ica-lifecycle">
      <div className="ica-subhead">
        <strong>PAGA lifecycle responsibility · Vendor vs ADDVALUE</strong>
        <span>Derived from A20261632 + retained service model · no duplicate event/work object</span>
      </div>
      <div className="ica-lifecycle-head">
        <span>Event</span>
        <span>Vendor / OEM</span>
        <span>ADDVALUE retained role</span>
        <span>Commercial treatment</span>
        <span>Gap / release condition</span>
      </div>
      {PROJECT0550_PAGA_LIFECYCLE_PLAN.map(row=>{
        const v=row.vendorCoverage||{};
        const a=row.addvalueCoverage||{};
        const vendorAmount=Number.isFinite(Number(v.total))
          ? money(convertFx(Number(v.total),String(v.currency||"EUR").toUpperCase(),currency),currency)
          : "TBC / not quoted";
        return (
          <div className="ica-lifecycle-row" key={row.eventCode}>
            <div>
              <code>{row.eventCode}</code>
              <strong>{row.eventName}</strong>
              <small>{row.location}</small>
            </div>
            <div>
              <strong>{v.role||"TBC"}</strong>
              <span>{v.state||"TBC"}</span>
              <em>{vendorAmount}</em>
            </div>
            <div>
              <strong>{(a.roles||[]).join(" · ") || "TBC"}</strong>
              <span>{a.workloadSource?.join(" · ") || "No retained activity bound"}</span>
              <em>{Number.isFinite(Number(a.mhPool)) ? a.mhPool.toLocaleString("en-US",{maximumFractionDigits:1})+" MH shared pool" : "MH TBC"}</em>
            </div>
            <div>
              <strong>{row.strategy}</strong>
              <span>Vendor: {row.commercialLineVendor}</span>
              <span>ADDVALUE: {row.commercialLineAddvalue}</span>
            </div>
            <div>
              <strong>{row.vendorSelection}</strong>
              <span>{row.releaseNote}</span>
              {row.travel?.rule ? <small>{row.travel.rule}</small> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
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

  const priceLayers=priceLayersForLine(group.lineCode,line,canonical.data?.priceLayers||[]);
  const displayLayer=(layer)=>{
    if(!layer || !Number.isFinite(Number(layer.amount))) return null;
    const sourceCurrency=String(layer.currency||currency).toUpperCase();
    return sourceCurrency===currency
      ? Number(layer.amount)
      : convertFx(Number(layer.amount),sourceCurrency,currency);
  };
  const sourceCostValue=displayLayer(priceLayers.SOURCE_COST);
  const internalCostValue=displayLayer(priceLayers.INTERNAL_COST);
  const workingSellValue=displayLayer(priceLayers.WORKING_SELL);
  const releasedSellValue=displayLayer(priceLayers.RELEASED_SELL);

  const openItems=line?.openItems||[];
  const status=priceLayers.RELEASED_SELL?.state==="AUTHORISED"
    ? "AUTHORISED CUSTOMER SELL"
    : (line?.state||"HOLD / WORKING");
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
          <small>Source / Vendor Cost</small>
          <strong>{Number.isFinite(sourceCostValue)?money(sourceCostValue,currency):"TBC"}</strong>
          <em>{priceLayers.SOURCE_COST?.state||"TBC"}</em>
        </span>
        <span className="ica-value">
          <small>Internal Cost</small>
          <strong>{Number.isFinite(internalCostValue)?money(internalCostValue,currency):Number.isFinite(costValue)?money(costValue,currency):"TBC"}</strong>
          <em>{Number.isFinite(internalCostValue)?priceLayers.INTERNAL_COST?.state:(Number.isFinite(costValue)?"KNOWN PARTIAL COST · "+costBasis:"TBC")}</em>
        </span>
        <span className="ica-value">
          <small>Working Sell</small>
          <strong>{Number.isFinite(workingSellValue)?money(workingSellValue,currency):"TBC"}</strong>
          <em>{priceLayers.WORKING_SELL?.state||"TBC"}</em>
        </span>
        <span className="ica-value">
          <small>Released Customer Sell</small>
          <strong>{Number.isFinite(releasedSellValue)?money(releasedSellValue,currency):"HOLD"}</strong>
          <em>{priceLayers.RELEASED_SELL?.state||"HOLD"}</em>
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

          {group.lineCode==="A1-05" ? (
            <>
              <PagaBulkMtoView canonical={canonical}/>
              <PagaLifecycleResponsibilityView currency={currency}/>
            </>
          ) : null}

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
          <small>7.1 · INTERNAL COST / COMMERCIAL ANALYSIS · PROJECTION ONLY</small>
          <h2>ดู Source Cost → Internal Cost → Working Sell → Released Sell แบบบรรทัด และกด + / − เพื่อลงรายละเอียดต่อระบบ</h2>
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

      <div className="ica-allocation-rule">
        <strong>Commercial allocation control</strong>
        <span>Part A = equipment / vendor package. ADDVALUE engineering, VDRL, training, FAT/SAT/commissioning, survey and other professional labor route to Part B/C. Vendor/OEM service with a dedicated B/C line must not be charged twice.</span>
        <em>{PROJECT0550_PART_A_LEGACY_PROXY_RULE.rule}</em>
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
            <span>Source Cost</span><span>Internal Cost</span><span>Working Sell</span><span>Released Sell</span><span>State</span>
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
