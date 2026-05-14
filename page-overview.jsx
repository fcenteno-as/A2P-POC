// Overview / Dashboard — high-level health of the A2P 10DLC program.

function OverviewPage({ onNavigate, onOpenCustomer }) {
  const { FLEET, ACTIVITY, CUSTOMERS } = window;
  const inFlight = CUSTOMERS.filter(c => ["BrandPending", "CampaignPending"].includes(c.status));
  const needsAttention = CUSTOMERS.filter(c => ["BrandRejected", "CampaignRejected", "Failed", "Suspended"].includes(c.status));

  return (
    <div>
      <SectionHeader
        eyebrow="A2P 10DLC Compliance"
        title="Provisioning overview"
        subtitle="Status of every customer's Brand, Campaign, and dedicated phone number across the AbsenceSoft fleet."
        action={
          <>
            <Button variant="ghost" icon={<Icon name="file_download" size={17} />}>Export report</Button>
            <Button variant="primary" onClick={() => onNavigate("customers")} icon={<Icon name="add" size={17} />}>Provision customer</Button>
          </>
        }
      />

      <Alert tone="warning" style={{ marginBottom: 22 }} title="82 legacy customers are still on the shared +1 (949) number"
        action={<Button size="sm" variant="warning" onClick={() => onNavigate("migration")}>Continue migration →</Button>}>
        Each must be migrated to a dedicated, Brand-registered number before carrier enforcement deadlines. Estimated 4 weeks at current pace.
      </Alert>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 22 }}>
        <Kpi value={FLEET.total} label="Total texting customers" icon="domain" />
        <Kpi value={FLEET.active} label="Fully provisioned" tone="success" icon="check_circle" delta="↑ 12 this week" />
        <Kpi value={FLEET.pending} label="In flight (TCR review)" tone="info" icon="hourglass_empty" delta="Avg. 2.6 days" />
        <Kpi value={FLEET.failed} label="Needs attention" tone="error" icon="error" delta="3 new today" />
        <Kpi value={FLEET.legacy} label="On shared number" tone="warning" icon="merge_type" delta="Migration in progress" />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 22 }}>
        <Card padding={0}>
          <div style={{ padding: "18px 22px 12px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <h3 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 16, color: "#252525", margin: 0 }}>Provisioning pipeline</h3>
              <div style={{ fontSize: 12.5, color: "#717171", marginTop: 3 }}>Customer count by current stage</div>
            </div>
            <span style={{ fontSize: 12, color: "#717171" }}>Last 30 days</span>
          </div>
          <PipelineFunnel />
        </Card>
        <Card>
          <CardHeader title="Migration progress" subtitle="285 legacy customers · target Aug 2026" />
          <div style={{ marginBottom: 14 }}>
            <ProgressBar value={203} max={285} tone="info" height={10} label="Migrated to dedicated number" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <MiniStat label="Migrated" value="203" tone="#2E7D32" />
            <MiniStat label="Remaining" value="82" tone="#F16624" />
            <MiniStat label="This week" value="14" tone="#40A3BD" />
            <MiniStat label="Avg / week" value="11.6" tone="#717171" />
          </div>
          <Button variant="ghost" size="sm" style={{ marginTop: 14, width: "100%", justifyContent: "center" }}
            onClick={() => onNavigate("migration")}>Open migration console</Button>
        </Card>
      </div>

      {/* Action queues + activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
        <Card padding={0}>
          <div style={{ padding: "18px 22px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 16, color: "#252525", margin: 0 }}>Needs your attention</h3>
              <div style={{ fontSize: 12.5, color: "#717171", marginTop: 3 }}>Rejected, failed, or suspended registrations</div>
            </div>
            <span onClick={() => onNavigate("customers")} style={{
              fontFamily: "Poppins", fontWeight: 600, fontSize: 13, color: "#096179", cursor: "pointer",
            }}>View all →</span>
          </div>
          <div>
            {needsAttention.map((c, i) => (
              <div key={c.id} onClick={() => onOpenCustomer(c)} style={{
                padding: "14px 22px", borderTop: "1px solid #F1F1F1", display: "flex", gap: 12,
                cursor: "pointer", alignItems: "flex-start",
              }} onMouseEnter={(e) => e.currentTarget.style.background = "#FAFDFE"}
                 onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: c.status === "Suspended" ? "#F16624" : "#D32F2F",
                  marginTop: 7, flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
                    <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "#252525" }}>{c.name}</span>
                    <StatusChip status={c.status} />
                    <span style={{ fontSize: 12, color: "#717171", fontFamily: "ui-monospace, Menlo" }}>{c.id}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#505050", lineHeight: 1.5 }}>{c.reason}</div>
                </div>
                <Icon name="chevron_right" size={20} color="#717171" />
              </div>
            ))}
          </div>
        </Card>

        <Card padding={0}>
          <div style={{ padding: "18px 22px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 16, color: "#252525", margin: 0 }}>Recent activity</h3>
              <div style={{ fontSize: 12.5, color: "#717171", marginTop: 3 }}>System and operator events</div>
            </div>
            <span onClick={() => onNavigate("activity")} style={{
              fontFamily: "Poppins", fontWeight: 600, fontSize: 13, color: "#096179", cursor: "pointer",
            }}>View all →</span>
          </div>
          <div style={{ padding: "0 22px 18px" }}>
            {ACTIVITY.slice(0, 6).map((a, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, padding: "10px 0",
                borderTop: i === 0 ? "1px solid #F1F1F1" : "1px solid #F1F1F1",
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                  background: a.tone === "success" ? "rgba(46,125,50,0.12)"
                            : a.tone === "error"   ? "#FBEAEA"
                            : a.who === "system"   ? "#EBF7F7" : "#FFF6F0",
                  color:      a.tone === "success" ? "#2E7D32"
                            : a.tone === "error"   ? "#D32F2F"
                            : a.who === "system"   ? "#40A3BD" : "#CE4A0D",
                  display: "grid", placeItems: "center",
                }}>
                  <Icon name={
                    a.tone === "success" ? "check"
                    : a.tone === "error" ? "close"
                    : a.who === "system" ? "settings_suggest" : "person"
                  } size={15} />
                </div>
                <div style={{ flex: 1, fontSize: 13, lineHeight: 1.45 }}>
                  <div style={{ color: "#252525" }}>
                    <span style={{ fontFamily: "Poppins", fontWeight: 600 }}>{a.who === "system" ? "System" : a.who}</span>
                    {" "}<span style={{ color: "#505050" }}>{a.what}</span>
                    {a.target && <span style={{ fontFamily: "Poppins", fontWeight: 600, color: "#096179" }}> {a.target}</span>}
                  </div>
                  <div style={{ color: "#717171", fontSize: 12, marginTop: 1 }}>{a.at}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Lower row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <Card>
          <CardHeader
            icon="domain_verification"
            title="Twilio integration"
            subtitle="Single master account · Messaging Service Number Pool"
            action={<Chip tone="success">Healthy</Chip>}
          />
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 12, columnGap: 16, fontSize: 13.5 }}>
            <span style={{ color: "#717171" }}>Account SID</span>
            <CopyMono text="AC8a2c1d3e4f5a6b7c8d9e0f1a2b3c4d5e6" />
            <span style={{ color: "#717171" }}>Messaging Service</span>
            <CopyMono text="MG77104a5b6c7d8e9f0a1b2c3d4e5f6a7b8" />
            <span style={{ color: "#717171" }}>Brand policy</span>
            <CopyMono text="RN2891ab4cd5e6f7a8b9c0d1e2f3a4b5c6d" />
            <span style={{ color: "#717171" }}>Webhook</span>
            <span style={{ fontFamily: "ui-monospace, Menlo", fontSize: 12.5, color: "#252525" }}>https://api.absencesoft.com/webhooks/twilio</span>
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #F1F1F1", display: "flex", gap: 16, fontSize: 12.5, color: "#505050" }}>
            <span>🟢 API responsive · 134 ms avg</span>
            <span>·</span>
            <span>Last sync 1 min ago</span>
          </div>
        </Card>

        <Card>
          <CardHeader
            icon="speed"
            title="Throughput & deliverability"
            subtitle="Last 7 days across all dedicated numbers"
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <MiniStat label="Messages sent" value="218.4k" tone="#074252" />
            <MiniStat label="Delivery rate" value="98.7%" tone="#2E7D32" />
            <MiniStat label="Carrier filtered" value="0.4%" tone="#F16624" />
          </div>
          <div style={{ marginTop: 18 }}>
            <Sparkline />
          </div>
        </Card>
      </div>
    </div>
  );
}

function MiniStat({ label, value, tone = "#252525" }) {
  return (
    <div>
      <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 22, color: tone, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#717171", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function PipelineFunnel() {
  const stages = [
    { label: "Texting enabled",     count: 285, tone: "#074252" },
    { label: "Brand submitted",     count: 263, tone: "#0A8193" },
    { label: "Brand approved",      count: 251, tone: "#40A3BD" },
    { label: "Campaign submitted",  count: 243, tone: "#70C9E9" },
    { label: "Campaign approved",   count: 232, tone: "#2E7D32" },
    { label: "Number assigned",     count: 203, tone: "#1B5E20" },
  ];
  const max = stages[0].count;
  return (
    <div style={{ padding: "4px 22px 22px" }}>
      {stages.map((s, i) => {
        const pct = (s.count / max) * 100;
        return (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 0" }}>
            <div style={{ width: 160, fontSize: 13, color: "#252525", fontFamily: "Poppins", fontWeight: 500 }}>{s.label}</div>
            <div style={{ flex: 1, position: "relative", height: 28 }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`,
                background: s.tone, borderRadius: 4, opacity: 0.92,
                transition: "width 400ms cubic-bezier(0.2,0,0,1)",
              }} />
              <div style={{
                position: "absolute", left: `calc(${pct}% + 10px)`, top: "50%", transform: "translateY(-50%)",
                fontFamily: "Poppins", fontSize: 13, fontWeight: 600, color: "#252525",
              }}>{s.count}</div>
            </div>
            <div style={{ width: 50, textAlign: "right", fontSize: 12, color: "#717171" }}>
              {i === 0 ? "—" : `−${stages[i-1].count - s.count}`}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Sparkline() {
  const points = [42, 48, 51, 49, 53, 57, 62, 65, 71, 68, 74, 79, 86];
  const w = 360, h = 80, pad = 4;
  const max = Math.max(...points), min = Math.min(...points);
  const dx = (w - pad * 2) / (points.length - 1);
  const sy = (v) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${pad + i * dx},${sy(p)}`).join(" ");
  const area = path + ` L${pad + (points.length - 1) * dx},${h - pad} L${pad},${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: 80, display: "block" }}>
      <defs>
        <linearGradient id="sp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#40A3BD" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#40A3BD" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sp)" />
      <path d={path} fill="none" stroke="#0A8193" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => i === points.length - 1 && (
        <circle key={i} cx={pad + i * dx} cy={sy(p)} r="4" fill="#0A8193" stroke="#fff" strokeWidth="2" />
      ))}
    </svg>
  );
}

Object.assign(window, { OverviewPage });
