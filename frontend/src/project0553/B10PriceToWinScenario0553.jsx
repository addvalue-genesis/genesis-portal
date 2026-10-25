import React,{useMemo,useState} from "react";
import {selectB10PriceToWinReview0553} from "./data/b10PriceToWinReview0553";
import "./releaseWorkbook0553.css";

const cash=(n,cur="USD")=>Number.isFinite(n)?cur+" "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const f4=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):"—";
export function B10PriceToWinScenario0553({canonical=null,context="working"}){
 const [profit,setProfit]=useState(20);
 const [risk,setRisk]=useState(5);
 const [mr1Credit,setMr1Credit]=useState(100);
 const [includeCord,setIncludeCord]=useState(false);
 const [includeWholeRadio,setIncludeWholeRadio]=useState(false);
 const price=useMemo(()=>selectB10PriceToWinReview0553({
  targetGrossProfitOfSellPct:profit,riskCostPct:risk,samtelSellDeductionPct:5,
  mr1PriorEnvelopeCreditPct:mr1Credit,
  includeNorthAmericanCord:includeCord,includeWholeRadio
 }),[profit,risk,mr1Credit,includeCord,includeWholeRadio]);
 if(canonical?.trace?.originalParametricCostUSD!==price.trace.originalParametricCostUSD)
  throw Error("10.2/10.3 B10 price scenario underlying source changed");
 const value=price.scenario,ass=price.assumptions;
 return <details className="p55-panel p553-b10-ptw" data-component-key={price.moduleId} open={context!=="scope"} style={{padding:12}}>
  <summary><strong>B10 — Price-to-Win What-if (INTERNAL / NONPOSTING)</strong>
   <small>Same Source→Working→Scope→Release evidence · proposed USD summary only; NOT customer 10.3.4 or Excel</small></summary>
  <p className="p55-note"><strong>Purpose:</strong> show a controlled estimate rather than automatically applying retail markup to the released price. The NextG quote expired on 1 Oct 2026, and the supplier's D/E quantity is <strong>NOT</strong> the approved commissioning-spare purchase quantity. MR0002–0004 remain unitemized planning allowances, not vendor quotes.</p>
  <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"end"}}>
   <label style={{display:"grid",gap:4}}>Target ADDVALUE profit after risk &amp; SAMTEL
    <select value={profit} onChange={e=>setProfit(Number(e.target.value))}>
     <option value={15}>15% of sell (x1.3125)</option>
     <option value={20}>20% of sell (x1.40)</option>
     <option value={25}>25% of sell (x1.50)</option>
    </select>
   </label>
   <label style={{display:"grid",gap:4}}>Cost-risk reserve
    <select value={risk} onChange={e=>setRisk(Number(e.target.value))}>
     <option value={0}>0% (only if separately covered)</option>
     <option value={5}>5% of source cost</option>
     <option value={10}>10% of source cost</option>
    </select>
   </label>
   <label style={{display:"grid",gap:4}}>MR0001 old allowance credit (sensitivity, not evidence)
    <select value={mr1Credit} onChange={e=>setMr1Credit(Number(e.target.value))}>
     <option value={100}>100% credit — optimistic lower bound</option>
     <option value={50}>50% credit — middle sensitivity (not approved)</option>
     <option value={0}>0% credit — gross coverage stress (may overlap)</option>
    </select>
   </label>
   <label style={{display:"flex",gap:6,alignItems:"center"}}>
    <input type="checkbox" checked={includeCord} onChange={e=>setIncludeCord(e.target.checked)}/>
    Include US/North America power cord D/E (NOT technically approved)
   </label>
   <label style={{display:"flex",gap:6,alignItems:"center"}}>
    <input type="checkbox" checked={includeWholeRadio} onChange={e=>setIncludeWholeRadio(e.target.checked)}/>
    Stress test: include two complete radios (capital spare scope OPEN)
   </label>
  </div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Repricing source</th><th>Original B10 cost allowance USD</th><th>Scenario replacement cost USD</th><th>Posting / evidence</th></tr></thead>
   <tbody>
    <tr><td>MR0001 — selected D/E supplier accessory offer, optional whole radio/cord</td>
     <td>{cash(price.trace.creditSupersededMr1USD)}</td>
     <td><strong>{cash(price.trace.replacementQuotedAccessoryCostUSD)}</strong></td>
     <td><strong>MR1 prior allowance credit {mr1Credit}% = {cash(price.trace.creditSupersededMr1USD)}</strong><small>Credit is only scope-overlap sensitivity; 100% credit risks omitting other MR1 parts, 0% may double count. No posting.</small></td></tr>
    <tr><td>MR0001 remaining unitemized physical spare coverage reserve</td><td>{cash(price.trace.originalMr1EnvelopeUSD)}</td><td><strong>{cash(price.trace.uncreditedMr1CoverageReserveUSD)}</strong></td><td>Assumption, not additional approved SKU or supplier cost</td></tr>
    {price.otherMrCostEnvelopes.map(row=><tr key={row.mr}>
     <td>{row.mr} — unitemized commissioning spare allowance</td><td>{cash(row.subtotalCostUSD)}</td>
     <td>{cash(row.subtotalCostUSD)}</td><td><strong>Engineering estimate only</strong><small>No SKU-by-SKU supplier rate established</small></td>
    </tr>)}
    <tr><th>Net review source cost</th><th>{cash(price.trace.originalParametricCostUSD)}</th>
     <th>{cash(value.sourceCostUSD)}<small>{cash(value.sourceCostTHB,"THB")}</small></th>
     <th>{price.trace.sourceScenarioReconciled?"SOURCE→SCENARIO CHECK PASSED":"RECONCILIATION FAILED"}</th></tr>
   </tbody>
  </table></div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Quoted SKU / Source / TAG candidates</th><th>Supplier offered Qty (scenario only)</th><th>Quoted Cost USD / ea</th><th>Proposed Sell USD / ea</th><th>Estimated line SELL USD</th></tr></thead>
   <tbody>{price.selectedSourceQuoteLines.map(x=><tr key={x.id}>
    <td><strong>{x.sku}</strong><small>{x.sourceQuoteLine} / {x.description}</small><small>Candidate installed TAGs: {x.candidateInstalledSiteTags.join(", ")||"mapping pending"} — not yet verified interchangeable</small></td>
    <td>{x.scenarioQty}<small>Actual required Qty = TBC</small></td>
    <td>{f4(x.estimatedUnitCostUSD)}</td><td>{f4(x.indicativeUnitSellUSD)}</td>
    <td>{cash(x.indicativeLineSellUSD)}</td>
   </tr>)}</tbody>
  </table></div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Price waterfall / 10.3.4 what-if reference</th><th>USD</th><th>THB / status</th></tr></thead>
   <tbody>
    <tr><td>Source cost — vendor D/E scenario + other MR parametric reserves</td><td>{cash(value.sourceCostUSD)}</td><td>{cash(value.sourceCostTHB,"THB")}</td></tr>
    <tr><td>Risk reserve {risk}% of cost, included within factor x{ass.multiplier}</td><td>{cash(value.riskCostUSD)}</td><td>Not B5/B6 freight/insurance; no double booking</td></tr>
    <tr><td>Proposed B10 SELL — before USD100 summary rounding</td><td>{cash(value.sellBeforeUsdRoundUSD)}</td><td><strong>{cash(value.sellBeforeUsdRoundTHB,"THB")}</strong></td></tr>
    <tr><td>10.3.4-equivalent proposed SUMMARY, rounded USD100</td><td><strong>{cash(value.roundedOfficialSummaryUSD)}</strong></td>
     <td>For management review only — no Excel/official posting</td></tr>
    <tr><td>Current 10.3.3 Working SELL / current 10.3.4 USD</td><td>{cash(value.existingOfficialSummaryUSD)}</td><td>{cash(value.existingWorkingSellTHB,"THB")}</td></tr>
    <tr><td>What-if uplift vs current unrounded THB</td><td>{cash(value.proposedVsExistingOfficialUSD)}</td><td>{cash(value.proposedVsExistingTHB,"THB")}</td></tr>
   </tbody>
  </table></div>
  <p className="p55-note"><strong>Source quote and published market checks:</strong> public retail listings below are nonposting, do not imply an identical approved spare/Ex certification, and do not supplement the MR2–MR4 remaining envelopes.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>MR</th><th>Source item</th><th>Public price reference</th><th>Technical &amp; duplicate scope gate</th></tr></thead>
   <tbody>{price.marketPriceComparables.map(r=><tr key={r.id}>
    <td>{r.mr}</td><td><strong>{r.brand} {r.partNo}</strong><small>{r.name}</small></td>
    <td><a href={r.url} target="_blank" rel="noreferrer">{Number.isFinite(r.usdUnit)?cash(r.usdUnit):cash(r.thbUnit,"THB")} / unit (external)</a>
     <small>{r.quoteType}</small></td><td>{r.relevance}</td></tr>)}</tbody>
  </table></div>
  <p className="p55-note"><strong>Quotation hold:</strong> Original 14 contractual kits remain in financial Release B10. None of these scenario item prices is automatically a customer approved unit price. Before actual itemized 10.3.4/Excel, establish full B10 SPIR, exact SKU-to-TAG compatibility and quantity, receive/quote basis and no duplicate Part A/B5/B6/B11/C1/C2; the real price will then replace this scenario, not stack over it.</p>
 </details>;
}
