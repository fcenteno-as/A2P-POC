// Bulk migration page — drive 285 legacy customers off the shared number.

function MigrationPage({ onOpenCustomer, onStartBatch }) {
  const { MIGRATION_BATCHES, CUSTOMERS } = window;
  const legacy = CUSTOMERS.filter(c => c.status === "NotStarted");
  const running = MIGRATION_BATCHES.find(b => b.status === "running");

  return (
    <div>
      <SectionHeader
        eyebrow="Bulk migration"
        title="Migrate legacy customers"
        subtitle="285 customers shared a single +1 (949) phone number. This console walks them through Brand/Campaign/Number registration in controlled batches."
        action={
          <>
            <Button variant="ghost" icon={<Icon name="article" size={17} />}>Latest report (xlsx)</Button>
            <Button variant="primary" onClick={onStartBatch} icon={<Icon name="play_arrow" size={17} />}>Start migration batch</Button>
          </>
        }
      />

      {/* Big progress card */}
      <Card style={{ marginBottom: 22, padding: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 28, alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <h3 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 18, color: "#252525", margin: 0 }}>Overall fleet migration</h3>
              <Chip tone="info">71% complete</Chip>
            </div>
            <div style={{ color: "#505050", fontSize: 13.5, marginBottom: 16 }}>
              On pace to finish migration by <strong>August 12, 2026</strong> at current velocity of ~14 customers/week.
            </div>
            <ProgressBar value={203} max={285} tone="info" height={14} showLabel={false} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12.5, color: "#717171" }}>
              <span>0 customers</span>
              <span>285</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 18 }}>
              <MigStat n="203" label="Migrated" tone="#2E7D32" />
              <MigStat n="14" label="In flight (TCR)" tone="#40A3BD" />
              <MigStat n="6"  label="Failed — needs ops" tone="#D32F2F" />
              <MigStat n="62" label="Not yet started" tone="#717171" />
            </div>
          </div>
          <DonutChart segments={[
            { value: 203, color: "#2E7D32" },
            { value: 14,  color: "#40A3BD" },
            { value: 6,   color: "#D32F2F" },
            { value: 62,  color: "#E0E0E0" },
          ]} centerLabel="71%" centerSub="migrated" />
        </div>
      </Card>

      {/* Two-column: batches + remaining */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20 }}>
        <Card padding={0}>
          <div style={{ padding: "18px 22px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 16, color: "#252525", margin: 0 }}>Migration batches</h3>
              <div style={{ fontSize: 12.5, color: "#717171", marginTop: 3 }}>Each batch processes 10–20 customers in parallel, respecting Twilio rate limits.</div>
            </div>
          </div>
          {running && (
            <div style={{ padding: "0 22px 16px" }}>
              <div style={{
                background: "linear-gradient(90deg, #EBF7F7 0%, #FAFDFE 100%)",
                border: "1px solid #B3E0EB", borderRadius: 8, padding: 16,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <Spinner size={18} color="#0A8193" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "#074252" }}>
                      Batch {running.id} is running
                    </div>
                    <div style={{ fontSize: 12.5, color: "#505050", marginTop: 2 }}>
                      Started {running.started} by {running.by} · {running.size} customers
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" icon={<Icon name="pause" size={14} />}>Pause</Button>
                  <Button size="sm" variant="danger" icon={<Icon name="stop" size={14} />}>Abort</Button>
                </div>
                <ProgressBar value={running.done} max={running.size} tone="info" height={8} showLabel={false} />
                <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 12.5, color: "#505050" }}>
                  <span><strong style={{ color: "#2E7D32" }}>{running.ok}</strong> succeeded</span>
                  <span><strong style={{ color: "#D32F2F" }}>{running.fail}</strong> failed</span>
                  <span><strong style={{ color: "#F16624" }}>{running.skip}</strong> skipped</span>
                  <div style={{ flex: 1 }} />
                  <span style={{ color: "#717171" }}>ETA ~ 18 min</span>
                </div>
              </div>
            </div>
          )}
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Figtree", fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: "#FAFAFA" }}>
                {["Batch", "Started", "Mode", "Result", "Run by"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 18px", fontFamily: "Poppins",
                    fontWeight: 600, fontSize: 11.5, color: "#717171", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MIGRATION_BATCHES.filter(b => b.status !== "running").map(b => (
                <tr key={b.id} style={{ borderTop: "1px solid #F1F1F1" }}>
                  <td style={{ padding: "12px 18px", fontFamily: "ui-monospace, Menlo", color: "#096179", fontWeight: 600 }}>{b.id}</td>
                  <td style={{ padding: "12px 18px", color: "#505050" }}>{b.started}</td>
                  <td style={{ padding: "12px 18px" }}>
                    <Chip tone={b.mode === "Dry run" ? "warning" : "info"} dot={false}>{b.mode}</Chip>
                  </td>
                  <td style={{ padding: "12px 18px" }}>
                    <div style={{ display: "flex", gap: 10, fontSize: 12.5, color: "#505050", alignItems: "center" }}>
                      <span style={{ color: "#2E7D32", fontWeight: 600 }}>{b.ok} ok</span>
                      {b.fail > 0 && <span style={{ color: "#D32F2F", fontWeight: 600 }}>{b.fail} failed</span>}
                      {b.skip > 0 && <span style={{ color: "#F16624", fontWeight: 600 }}>{b.skip} skipped</span>}
                      <span style={{ color: "#717171" }}>of {b.size}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 18px", color: "#252525" }}>{b.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card padding={0}>
          <div style={{ padding: "18px 22px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 16, color: "#252525", margin: 0 }}>Queue: not yet migrated</h3>
              <div style={{ fontSize: 12.5, color: "#717171", marginTop: 3 }}>Sorted by message volume (highest first)</div>
            </div>
            <Button size="sm" variant="ghost">Re-prioritize</Button>
          </div>
          <div>
            {legacy.map((c, i) => (
              <div key={c.id} onClick={() => onOpenCustomer(c)} style={{
                padding: "12px 22px", borderTop: "1px solid #F1F1F1",
                display: "flex", gap: 12, alignItems: "center", cursor: "pointer",
              }} onMouseEnter={(e) => e.currentTarget.style.background = "#FAFDFE"}
                 onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", background: "#F1F1F1", color: "#717171",
                  display: "grid", placeItems: "center", fontFamily: "Poppins", fontSize: 11, fontWeight: 600, flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 13.5, color: "#252525", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "#717171", marginTop: 1 }}>{c.id} · {c.monthlyMessages.toLocaleString()} msg/mo · {c.state}</div>
                </div>
                <Icon name="chevron_right" size={18} color="#717171" />
              </div>
            ))}
            <div style={{ padding: "12px 22px", borderTop: "1px solid #F1F1F1", textAlign: "center", fontSize: 13, color: "#717171" }}>
              + {62 - legacy.length} more customers awaiting migration
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MigStat({ n, label, tone }) {
  return (
    <div>
      <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 26, color: tone, lineHeight: 1.1 }}>{n}</div>
      <div style={{ fontSize: 12.5, color: "#717171", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function DonutChart({ segments, centerLabel, centerSub, size = 200 }) {
  const r = 80, c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 0;
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size} viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="100" cy="100" r={r} fill="none" stroke="#F1F1F1" strokeWidth="22" />
        {segments.map((s, i) => {
          const len = (s.value / total) * c;
          const el = (
            <circle key={i} cx="100" cy="100" r={r} fill="none" stroke={s.color} strokeWidth="22"
              strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 36, color: "#074252" }}>{centerLabel}</div>
          <div style={{ fontSize: 13, color: "#717171", marginTop: -4 }}>{centerSub}</div>
        </div>
      </div>
    </div>
  );
}

// ----- Side sheet: start a migration batch -----
function StartBatchSheet({ open, onClose }) {
  const [size, setSize] = React.useState(20);
  const [dryRun, setDryRun] = React.useState(true);
  const [selection, setSelection] = React.useState("volume");
  return (
    <SideSheet open={open} onClose={onClose} width={560}
      title="Start migration batch"
      subtitle="Migrate a batch of legacy customers from the shared number to dedicated A2P-registered numbers."
      footer={
        <>
          <Button variant="text" onClick={onClose}>Cancel</Button>
          <div style={{ flex: 1 }} />
          <Button variant="ghost" onClick={onClose}>Save as preset</Button>
          <Button variant="primary" onClick={onClose} icon={<Icon name="play_arrow" size={16} />}>
            {dryRun ? "Run dry-run" : "Start live batch"}
          </Button>
        </>
      }>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Card style={{ background: dryRun ? "#FFF6F0" : "#EBF7F7", border: "none" }}>
          <Toggle on={!dryRun} onChange={(v) => setDryRun(!v)}
            label={dryRun ? "Dry run — no real API calls" : "Live run — registers Brands & Campaigns"}
            hint={dryRun ? "Validates customer data and reports what would happen." : "Real TCR submissions. Brand/Campaign approval takes 2–8 business days."} />
        </Card>

        <div>
          <label style={{ display: "block", fontFamily: "Poppins", fontWeight: 600, fontSize: 13, color: "#252525", marginBottom: 8 }}>
            Batch size
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {[5, 10, 20, 50].map(n => (
              <div key={n} onClick={() => setSize(n)} style={{
                padding: "10px 18px", border: `2px solid ${size === n ? "#0A8193" : "#E0E0E0"}`,
                background: size === n ? "#EBF7F7" : "#fff", color: size === n ? "#074252" : "#252525",
                borderRadius: 8, cursor: "pointer", fontFamily: "Poppins", fontWeight: 600, fontSize: 14,
              }}>{n}</div>
            ))}
          </div>
          <div style={{ fontSize: 12.5, color: "#717171", marginTop: 6 }}>
            Twilio rate limit: 100 req/sec. Larger batches finish faster but use more API quota.
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontFamily: "Poppins", fontWeight: 600, fontSize: 13, color: "#252525", marginBottom: 8 }}>
            Customer selection
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { id: "volume", label: "Highest message volume first", hint: "Migrate the noisiest customers first to maximize compliance impact." },
              { id: "state",  label: "Group by state",                hint: "Process customers in the same state together for cleaner area-code matches." },
              { id: "manual", label: "Custom list",                   hint: "Pick exactly which customers to migrate (paste IDs or upload CSV)." },
            ].map(opt => (
              <label key={opt.id} style={{
                display: "flex", gap: 12, padding: 12,
                border: `1.5px solid ${selection === opt.id ? "#0A8193" : "#E0E0E0"}`, borderRadius: 8, cursor: "pointer",
                background: selection === opt.id ? "#EBF7F7" : "#fff",
              }}>
                <input type="radio" checked={selection === opt.id} onChange={() => setSelection(opt.id)}
                  style={{ accentColor: "#0A8193", marginTop: 3 }} />
                <div>
                  <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "#252525" }}>{opt.label}</div>
                  <div style={{ fontSize: 12.5, color: "#717171", marginTop: 2 }}>{opt.hint}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <Alert tone="info" title="What this batch will do">
          For each selected customer: create TrustProduct → submit Brand → submit Campaign → search local area code → purchase number → attach to messaging service → associate with Campaign. Excel report generated when done.
        </Alert>
      </div>
    </SideSheet>
  );
}

Object.assign(window, { MigrationPage, StartBatchSheet });
