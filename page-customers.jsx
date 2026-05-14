// Customers list — CRM-style table with filters and bulk actions.

function CustomersPage({ onOpenCustomer, onOpenWizard }) {
  const { CUSTOMERS, STATUSES } = window;
  const [filter, setFilter] = React.useState("All");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState(new Set());

  const filters = [
    { key: "All",          test: () => true },
    { key: "Active",       test: c => c.status === "Active" },
    { key: "In flight",    test: c => ["BrandPending","CampaignPending"].includes(c.status) },
    { key: "Needs attention", test: c => ["BrandRejected","CampaignRejected","Failed","Suspended"].includes(c.status) },
    { key: "Legacy (shared)", test: c => c.status === "NotStarted" },
  ];

  const filterFn = filters.find(f => f.key === filter).test;
  const rows = CUSTOMERS.filter(filterFn).filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
        || (c.number && c.number.toLowerCase().includes(q))
        || (c.brand && c.brand.toLowerCase().includes(q))
        || (c.campaign && c.campaign.toLowerCase().includes(q));
  });

  const counts = Object.fromEntries(filters.map(f => [f.key, CUSTOMERS.filter(f.test).length]));
  // For "All" we want to show the fleet total, not just the sample.
  counts.All = window.FLEET.total;
  counts["Legacy (shared)"] = window.FLEET.legacy;
  counts["Active"] = window.FLEET.active;
  counts["In flight"] = window.FLEET.pending;
  counts["Needs attention"] = window.FLEET.failed;

  const toggle = (id) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const toggleAll = () => {
    setSelected(prev => prev.size === rows.length ? new Set() : new Set(rows.map(r => r.id)));
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Customer fleet"
        title="Customers"
        subtitle="Every AbsenceSoft customer that has texting enabled. Track Brand registration, Campaign approval, and assigned phone number from one place."
        action={
          <>
            <Button variant="ghost" icon={<Icon name="file_download" size={17} />}>Export CSV</Button>
            <Button variant="primary" onClick={onOpenWizard} icon={<Icon name="add" size={17} />}>Provision customer</Button>
          </>
        }
      />

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {filters.map(f => {
          const isActive = f.key === filter;
          return (
            <span key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: "8px 16px", borderRadius: 9999, cursor: "pointer",
              background: isActive ? "#D0EDF4" : "#fff",
              border: `1px solid ${isActive ? "#40A3BD" : "#E0E0E0"}`,
              color: isActive ? "#074252" : "#505050",
              fontFamily: "Poppins", fontWeight: 600, fontSize: 13,
              display: "inline-flex", alignItems: "center", gap: 7,
            }}>
              {f.key}
              <span style={{
                background: isActive ? "#40A3BD" : "#F1F1F1",
                color:      isActive ? "#fff"    : "#717171",
                padding: "1px 7px", borderRadius: 9999, fontSize: 11, fontWeight: 600,
              }}>{counts[f.key]}</span>
            </span>
          );
        })}
      </div>

      <Card padding={0} style={{ overflow: "hidden" }}>
        {/* Table toolbar */}
        <div style={{
          padding: "12px 16px", borderBottom: "1px solid #F1F1F1",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          {selected.size > 0 ? (
            <>
              <span style={{ fontSize: 13.5, fontFamily: "Poppins", fontWeight: 600, color: "#074252" }}>
                {selected.size} selected
              </span>
              <Button size="sm" variant="ghost" icon={<Icon name="refresh" size={15} />}>Retry provisioning</Button>
              <Button size="sm" variant="ghost" icon={<Icon name="swap_horiz" size={15} />}>Add to migration batch</Button>
              <Button size="sm" variant="ghost" icon={<Icon name="pause" size={15} />}>Pause</Button>
              <Button size="sm" variant="text" onClick={() => setSelected(new Set())}>Clear</Button>
            </>
          ) : (
            <>
              <div style={{
                display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 360,
                border: "1px solid #E0E0E0", borderRadius: 5, padding: "7px 12px",
              }}>
                <Icon name="search" size={16} color="#717171" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, ID, number, or SID…"
                  style={{ flex: 1, border: "none", outline: "none", fontFamily: "Figtree", fontSize: 13.5 }}/>
              </div>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 13, color: "#717171" }}>
                Showing <strong style={{ color: "#252525" }}>{rows.length}</strong> of <strong style={{ color: "#252525" }}>{counts[filter]}</strong>
              </span>
              <Button size="sm" variant="ghost" icon={<Icon name="tune" size={15} />}>Filters</Button>
            </>
          )}
        </div>

        {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Figtree" }}>
          <thead>
            <tr style={{ background: "#FAFAFA" }}>
              <th style={{ width: 40, padding: "12px 16px" }}>
                <input type="checkbox" checked={rows.length > 0 && selected.size === rows.length} onChange={toggleAll}
                  style={{ accentColor: "#0A8193", cursor: "pointer" }} />
              </th>
              {["Customer", "Status", "Phone number", "Brand / Campaign", "Geography", "Owner", ""].map(h => (
                <th key={h} style={{
                  textAlign: "left", padding: "12px 16px", fontFamily: "Poppins",
                  fontWeight: 600, fontSize: 11.5, color: "#717171", textTransform: "uppercase", letterSpacing: 0.5,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(c => (
              <tr key={c.id} style={{ borderTop: "1px solid #F1F1F1", cursor: "pointer" }}
                onClick={() => onOpenCustomer(c)}
                onMouseEnter={(e) => e.currentTarget.style.background = "#FAFDFE"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "14px 16px" }} onClick={(e) => { e.stopPropagation(); toggle(c.id); }}>
                  <input type="checkbox" checked={selected.has(c.id)} readOnly
                    style={{ accentColor: "#0A8193", cursor: "pointer" }} />
                </td>
                <td style={{ padding: "14px 16px", minWidth: 240 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar initials={c.name.split(" ").slice(0,2).map(s => s[0]).join("")} size={32}
                      tone={c.status === "Active" ? "info" : c.status === "NotStarted" ? "neutral" : "warn"} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "#252525", lineHeight: 1.3 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "#717171", fontFamily: "ui-monospace, Menlo" }}>{c.id} · EIN {c.ein}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <StatusChip status={c.status} />
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13.5 }}>
                  {c.number ? (
                    <div>
                      <div style={{ fontFamily: "ui-monospace, Menlo", color: "#252525" }}>{c.number}</div>
                      <div style={{ color: "#717171", fontSize: 12, marginTop: 2 }}>{c.monthlyMessages.toLocaleString()} msgs/mo</div>
                    </div>
                  ) : (
                    <span style={{ color: "#717171", fontStyle: "italic" }}>Not assigned</span>
                  )}
                </td>
                <td style={{ padding: "14px 16px", fontSize: 12, fontFamily: "ui-monospace, Menlo", color: "#505050" }}>
                  {c.brand ? <div title={c.brand}>{c.brand.slice(0,12)}…</div> : <span style={{ color: "#D3D3D3" }}>—</span>}
                  {c.campaign ? <div title={c.campaign} style={{ marginTop: 2 }}>{c.campaign.slice(0,12)}…</div> : <span style={{ color: "#D3D3D3" }}>—</span>}
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#505050" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="location_on" size={14} color="#717171" /> {c.state}
                  </div>
                  <div style={{ fontSize: 12, color: "#717171", marginTop: 2 }}>{c.employees.toLocaleString()} employees</div>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#252525" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar initials={c.owner.split(/[. ]/).map(s => s[0]).filter(Boolean).slice(0,2).join("").toUpperCase()} size={24} />
                    <span>{c.owner}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                  <Icon name="chevron_right" size={20} color="#717171" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer pagination */}
        <div style={{
          padding: "14px 18px", borderTop: "1px solid #F1F1F1",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontSize: 13, color: "#505050",
        }}>
          <div>
            Page <strong style={{ color: "#252525" }}>1</strong> of <strong style={{ color: "#252525" }}>{Math.ceil(counts[filter] / 25)}</strong>
            <span style={{ marginLeft: 16, color: "#717171" }}>·</span>
            <span style={{ marginLeft: 16 }}>Showing <strong style={{ color: "#252525" }}>1–{rows.length}</strong></span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <Button size="sm" variant="ghost" disabled>← Previous</Button>
            <Button size="sm" variant="ghost">Next →</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { CustomersPage });
