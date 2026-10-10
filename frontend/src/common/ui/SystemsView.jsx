import React, {useMemo,useState} from "react";
function Badge({children,tone}) { const t=tone||(/OPEN|CONFLICT|HOLD|TBC|NOT FOUND/i.test(String(children))?"warn":"neutral");return <span className={"p55-badge p55-badge--"+t}>{children}</span>; }
function SectionTitle({eyebrow,title,text}) {return <div className="p55-section-title"><div><div className="p55-eyebrow">{eyebrow}</div><h2>{title}</h2><p>{text}</p></div></div>;}
export function SystemCard({ system, expanded, onToggle }) {
  return (
    <article className={"p55-system " + (expanded ? "is-expanded" : "")}>
      <button className="p55-system__summary" onClick={onToggle} type="button">
        <div className="p55-system__no">{String(system.no).padStart(2, "0")}</div>
        <div className="p55-system__title">
          <strong>{system.name}</strong>
          <span>{system.token}</span>
        </div>
        <div className="p55-system__badges">
          <Badge>{system.proofState}</Badge>
          <Badge>{system.costBasis}</Badge>
        </div>
        <span className="p55-chevron">{expanded ? "−" : "+"}</span>
      </button>
      {expanded ? (
        <div className="p55-system__detail">
          <dl className="p55-detail-grid">
            <div><dt>Project reference</dt><dd>{system.ref}</dd></div>
            <div><dt>Engineering proof</dt><dd>{system.proof}</dd></div>
            <div><dt>Quantity state</dt><dd><Badge>{system.quantityState}</Badge></dd></div>
            <div><dt>Execution / boundary</dt><dd>{system.owner}</dd></div>
          </dl>
          <div className="p55-open-item">
            <span>OPEN CLOSURE</span>
            <strong>{system.open}</strong>
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function SystemsView({systems,systemGroups,title,description}) {
  const [viewMode, setViewMode] = useState("group");
  const [selectedToken, setSelectedToken] = useState("ALL");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(() => new Set([]));
  const [openGroups, setOpenGroups] = useState(() => new Set(systemGroups.map((g) => g.id)));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return systems.filter((system) => {
      if (selectedToken !== "ALL" && system.token !== selectedToken) return false;
      if (!q) return true;
      return [system.name, system.token, system.ref, system.proof, system.open]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query, selectedToken]);

  function toggleSystem(token) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(token)) next.delete(token);
      else next.add(token);
      return next;
    });
  }

  function toggleGroup(id) {
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const groups = systemGroups.map((group) => ({
    ...group,
    systems: filtered.filter((s) => s.groupId === group.id),
  })).filter((group) => group.systems.length > 0);

  return (
    <div className="p55-stack">
      <SectionTitle
        eyebrow="System control"
        title={title || "System group view"}
        text={description || "Expand by discipline or focus on one system; proof, quantity, cost and closure remain visible."}
      />

      <div className="p55-filterbar">
        <div className="p55-segmented" aria-label="View mode">
          <button className={viewMode === "group" ? "is-active" : ""} onClick={() => setViewMode("group")} type="button">Group view</button>
          <button className={viewMode === "focus" ? "is-active" : ""} onClick={() => setViewMode("focus")} type="button">System focus</button>
        </div>
        <label>
          <span>System</span>
          <select
            value={selectedToken}
            onChange={(e) => {
              setSelectedToken(e.target.value);
              if (e.target.value !== "ALL") {
                setViewMode("focus");
                setExpanded(new Set([e.target.value]));
              }
            }}
          >
            <option value="ALL">All systems</option>
            {systems.map((s) => <option value={s.token} key={s.token}>{String(s.no).padStart(2, "0")} — {s.name}</option>)}
          </select>
        </label>
        <label className="p55-search">
          <span>Search</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="PAGA, coverage, quote…" />
        </label>
      </div>

      {viewMode === "focus" ? (
        <div className="p55-system-list">
          {filtered.map((system) => (
            <SystemCard
              key={system.token}
              system={system}
              expanded={expanded.has(system.token)}
              onToggle={() => toggleSystem(system.token)}
            />
          ))}
        </div>
      ) : (
        <div className="p55-groups">
          {groups.map((group) => {
            const isOpen = openGroups.has(group.id);
            return (
              <section className="p55-group" key={group.id}>
                <button className="p55-group__head" onClick={() => toggleGroup(group.id)} type="button">
                  <div>
                    <strong>{group.name}</strong>
                    <span>{group.description}</span>
                  </div>
                  <div className="p55-group__right">
                    <Badge tone="neutral">{group.systems.length} systems</Badge>
                    <span className="p55-chevron">{isOpen ? "−" : "+"}</span>
                  </div>
                </button>
                {isOpen ? (
                  <div className="p55-system-list">
                    {group.systems.map((system) => (
                      <SystemCard
                        key={system.token}
                        system={system}
                        expanded={expanded.has(system.token)}
                        onToggle={() => toggleSystem(system.token)}
                      />
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

