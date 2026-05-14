// Customer detail — full view of one customer's A2P 10DLC provisioning state.

function CustomerDetailPage({ customer, onBack, onOpenWizard }) {
  const c = customer;
  const { SAMPLE_TIMELINE, STATUSES } = window;
  const [tab, setTab] = React.useState("provisioning");
  const meta = STATUSES[c.status];

  // Build a per-customer timeline based on status
  const timeline = buildTimeline(c);

  return (
    <div>
      {/* Back + title bar */}
      <div style={{ marginBottom: 14 }}>
        <span onClick={onBack} style={{
          color: "#096179", fontFamily: "Poppins", fontWeight: 600, fontSize: 13, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <Icon name="arrow_back" size={16} /> All customers
        </span>
      </div>

      <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 22 }}>
        <Avatar initials={c.name.split(" ").slice(0,2).map(s => s[0]).join("")} size={64} tone="dark" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h1 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 28, color: "#252525", margin: 0, lineHeight: 1.15 }}>{c.name}</h1>
            <StatusChip status={c.status} />
          </div>
          <div style={{ color: "#505050", fontSize: 14, marginTop: 6 }}>
            <span style={{ fontFamily: "ui-monospace, Menlo", color: "#717171" }}>{c.id}</span>
            <span style={{ margin: "0 10px", color: "#D3D3D3" }}>·</span>
            EIN {c.ein}
            <span style={{ margin: "0 10px", color: "#D3D3D3" }}>·</span>
            {c.employees.toLocaleString()} employees
            <span style={{ margin: "0 10px", color: "#D3D3D3" }}>·</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Icon name="location_on" size={14} color="#717171" /> {c.state}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <Button variant="ghost" icon={<Icon name="open_in_new" size={16} />}>Open in OpsAdmin</Button>
          {c.status === "NotStarted" && (
            <Button variant="primary" onClick={onOpenWizard} icon={<Icon name="rocket_launch" size={16} />}>Start provisioning</Button>
          )}
          {["BrandRejected","CampaignRejected","Failed"].includes(c.status) && (
            <Button variant="warning" icon={<Icon name="refresh" size={16} />}>Retry registration</Button>
          )}
          {c.status === "Active" && (
            <Button variant="primary" icon={<Icon name="sms" size={16} />}>Send test message</Button>
          )}
        </div>
      </div>

      {/* State banner */}
      {c.reason && (
        <Alert tone={c.status === "Suspended" ? "warning" : "error"}
               title={c.status === "Suspended" ? "Carrier suspended this number" : "Registration was rejected by TCR"}
               style={{ marginBottom: 20 }}
               action={<Button size="sm" variant={c.status === "Suspended" ? "warning" : "danger"}>Resolve →</Button>}>
          {c.reason}
        </Alert>
      )}
      {c.status === "NotStarted" && (
        <Alert tone="warning" style={{ marginBottom: 20 }}
               title="This customer is on the legacy shared number"
               action={<Button size="sm" variant="warning" onClick={onOpenWizard}>Provision now →</Button>}>
          Texting still flows through +1 (949) 555-0100. Migrate to a dedicated, Brand-registered number to remain A2P 10DLC compliant.
        </Alert>
      )}
      {["BrandPending","CampaignPending"].includes(c.status) && (
        <Alert tone="info" style={{ marginBottom: 20 } } title={`${c.status === "BrandPending" ? "Brand" : "Campaign"} is awaiting TCR review`}>
          Submitted on {c.submittedOn}. Expected approval in {c.eta}. We'll continue with the next step automatically once approved — no action needed.
        </Alert>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #E0E0E0", marginBottom: 20 }}>
        {[
          { id: "provisioning", label: "Provisioning", icon: "shield_check" },
          { id: "messaging",    label: "Messaging activity", icon: "forum" },
          { id: "audit",        label: "Audit trail", icon: "history" },
          { id: "raw",          label: "Twilio raw data", icon: "code" },
        ].map(t => (
          <div key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "10px 16px", cursor: "pointer",
            color: tab === t.id ? "#074252" : "#505050",
            borderBottom: tab === t.id ? "2px solid #0A8193" : "2px solid transparent",
            fontFamily: "Poppins", fontWeight: tab === t.id ? 600 : 500, fontSize: 13.5,
            display: "inline-flex", alignItems: "center", gap: 6,
            marginBottom: -1,
          }}>
            <Icon name={t.icon} size={16} /> {t.label}
          </div>
        ))}
      </div>

      {tab === "provisioning" && <ProvisioningTab c={c} timeline={timeline} />}
      {tab === "messaging" && <MessagingTab c={c} />}
      {tab === "audit" && <AuditTab c={c} timeline={timeline} />}
      {tab === "raw" && <RawTab c={c} />}
    </div>
  );
}

// ---------- Tabs ----------
function ProvisioningTab({ c, timeline }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Stepper */}
        <Card>
          <h3 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 16, color: "#252525", margin: "0 0 16px" }}>Provisioning flow</h3>
          <Stepper c={c} />
        </Card>

        {/* Brand */}
        <Card>
          <CardHeader icon="domain_verification" title="Brand registration"
            subtitle="A2P 10DLC Brand is the legal entity sending messages. Registered once per customer with TCR."
            action={c.brand ? <Chip tone="success">Approved</Chip> : <Chip tone="neutral">Not started</Chip>} />
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 10, columnGap: 16, fontSize: 13.5 }}>
            <span style={{ color: "#717171" }}>Legal name</span>
            <span style={{ color: "#252525", fontWeight: 500 }}>{c.name}</span>
            <span style={{ color: "#717171" }}>EIN (Tax ID)</span>
            <span style={{ color: "#252525", fontFamily: "ui-monospace, Menlo" }}>{c.ein}</span>
            <span style={{ color: "#717171" }}>Industry</span>
            <span style={{ color: "#252525" }}>HUMAN_RESOURCES</span>
            <span style={{ color: "#717171" }}>Business type</span>
            <span style={{ color: "#252525" }}>Private — for profit</span>
            <span style={{ color: "#717171" }}>Brand SID</span>
            <span>{c.brand ? <CopyMono text={c.brand} /> : <span style={{ color: "#D3D3D3" }}>—</span>}</span>
            <span style={{ color: "#717171" }}>TrustProduct</span>
            <span>{c.brand ? <CopyMono text={"RN" + c.brand.slice(2,30)} /> : <span style={{ color: "#D3D3D3" }}>—</span>}</span>
          </div>
        </Card>

        {/* Campaign */}
        <Card>
          <CardHeader icon="campaign" title="A2P Campaign"
            subtitle="The use case for messages sent through this Brand. Determines throughput and content rules."
            action={c.campaign ? <Chip tone="success">Verified</Chip> : <Chip tone="neutral">Not started</Chip>} />
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 10, columnGap: 16, fontSize: 13.5, marginBottom: 16 }}>
            <span style={{ color: "#717171" }}>Use case</span>
            <span><Chip tone="info" dot={false}>CUSTOMER_CARE</Chip></span>
            <span style={{ color: "#717171" }}>Description</span>
            <span style={{ color: "#252525" }}>Employee absence and leave management notifications</span>
            <span style={{ color: "#717171" }}>Throughput</span>
            <span style={{ color: "#252525" }}>4,500 messages / day · T-Mobile, AT&T, Verizon</span>
            <span style={{ color: "#717171" }}>Campaign SID</span>
            <span>{c.campaign ? <CopyMono text={c.campaign} /> : <span style={{ color: "#D3D3D3" }}>—</span>}</span>
          </div>
          <div style={{ borderTop: "1px solid #F1F1F1", paddingTop: 14 }}>
            <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 13, color: "#252525", marginBottom: 10 }}>Sample messages</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                `Welcome to ${c.name} absence notifications powered by AbsenceSoft. Reply STOP to opt out.`,
                "Your leave request has been approved. Contact your HR manager if you have questions.",
                "Reminder: Submit your leave paperwork by 5 PM today.",
              ].map((s, i) => (
                <div key={i} style={{
                  background: "#EBF7F7", padding: "10px 14px", borderRadius: 14,
                  fontSize: 13.5, color: "#252525", maxWidth: 480, lineHeight: 1.45,
                }}>{s}</div>
              ))}
            </div>
          </div>
        </Card>

        {/* Phone Number */}
        <Card>
          <CardHeader icon="smartphone" title="Phone number"
            subtitle="Dedicated number this customer's employees see when receiving SMS."
            action={c.number ? <Chip tone="success">Active</Chip> : <Chip tone="neutral">Not assigned</Chip>} />
          {c.number ? (
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 10, columnGap: 16, fontSize: 13.5 }}>
              <span style={{ color: "#717171" }}>Number</span>
              <span style={{ fontFamily: "ui-monospace, Menlo", color: "#252525", fontSize: 15, fontWeight: 600 }}>{c.number}</span>
              <span style={{ color: "#717171" }}>Area code</span>
              <span style={{ color: "#252525" }}>{c.areaCode || "—"} ({c.state})</span>
              <span style={{ color: "#717171" }}>Capabilities</span>
              <span style={{ display: "flex", gap: 6 }}>
                <Chip tone="success" dot={false}>SMS</Chip>
                <Chip tone="success" dot={false}>MMS</Chip>
                <Chip tone="success" dot={false}>Voice</Chip>
              </span>
              <span style={{ color: "#717171" }}>PhoneNumber SID</span>
              <span><CopyMono text={"PN" + (c.brand || "1234").slice(2,34)} /></span>
              <span style={{ color: "#717171" }}>Messaging Service</span>
              <span><CopyMono text="MG77104a5b6c7d8e9f0a1b2c3d4e5f6a7b8" /></span>
              <span style={{ color: "#717171" }}>Monthly cost</span>
              <span style={{ color: "#252525" }}>$1.15</span>
            </div>
          ) : (
            <div style={{ padding: "16px 0", color: "#717171", fontSize: 13.5 }}>
              No number assigned yet. The system will purchase one automatically from {c.state} once Brand and Campaign are approved.
            </div>
          )}
        </Card>
      </div>

      {/* Right rail */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card>
          <h3 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 15, color: "#252525", margin: "0 0 12px" }}>Business contact</h3>
          <div style={{ fontSize: 13.5, color: "#505050", lineHeight: 1.7 }}>
            <div><span style={{ color: "#717171" }}>Owner</span> · {c.owner}</div>
            <div><span style={{ color: "#717171" }}>Phone</span> · {c.areaCode ? `+1 (${c.areaCode}) 555-0100` : <span style={{ color: "#F16624" }}>Missing — using fallback</span>}</div>
            <div><span style={{ color: "#717171" }}>Email</span> · admin@{c.name.toLowerCase().replace(/[^a-z]/g," ").trim().split(" ")[0]}.com</div>
            <div><span style={{ color: "#717171" }}>Address</span> · 100 Main St, {c.state} {c.areaCode || "12345"}</div>
          </div>
        </Card>

        <Card>
          <h3 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 15, color: "#252525", margin: "0 0 12px" }}>Recent events</h3>
          <Timeline events={timeline.slice(0, 5)} />
        </Card>

        <Card style={{ background: "#FFF6F0", border: "1px solid #FAD5BC" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <Icon name="lightbulb" size={20} color="#F16624" />
            <strong style={{ fontFamily: "Poppins", fontSize: 14, color: "#7A2A05" }}>Tip</strong>
          </div>
          <div style={{ fontSize: 13.5, color: "#505050", lineHeight: 1.55 }}>
            Brands flagged for manual TCR review are not unusual. Submissions matching expected business data typically clear in 1–3 days.
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stepper({ c }) {
  const steps = [
    { label: "Brand submitted",   doneAt: c.brand ? "Apr 12" : null, key: "brand_sub" },
    { label: "Brand approved",    doneAt: c.brand && c.status !== "BrandPending" && c.status !== "BrandRejected" ? "Apr 14" : null, key: "brand_ok", rejected: c.status === "BrandRejected" },
    { label: "Campaign submitted",doneAt: c.campaign ? "Apr 15" : null, key: "camp_sub" },
    { label: "Campaign approved", doneAt: c.campaign && !["CampaignPending","CampaignRejected"].includes(c.status) ? "Apr 16" : null, key: "camp_ok", rejected: c.status === "CampaignRejected" },
    { label: "Number purchased",  doneAt: c.number ? "Apr 18" : null, key: "num" },
    { label: "Compliant",         doneAt: c.status === "Active" ? "Apr 18" : null, key: "live", final: true },
  ];
  // For NotStarted, show all as inactive
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto" }}>
      {steps.map((s, i) => {
        const done = !!s.doneAt;
        const rejected = !!s.rejected;
        const next = !done && !rejected && (i === 0 || steps[i-1].doneAt);
        const bg = rejected ? "#FBEAEA" : done ? "#2E7D32" : next ? "#FFF6F0" : "#F7F7F7";
        const fg = rejected ? "#D32F2F" : done ? "#fff"    : next ? "#CE4A0D" : "#D3D3D3";
        return (
          <React.Fragment key={s.key}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", flex: "0 0 110px" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", background: bg, color: fg,
                display: "grid", placeItems: "center",
                border: next ? "2px solid #F16624" : "none",
                fontFamily: "Poppins", fontWeight: 600,
              }}>
                {rejected ? <Icon name="close" size={20} /> :
                 done     ? <Icon name="check" size={20} /> :
                 next     ? <Spinner color="#F16624" size={14} /> :
                            <span style={{ fontSize: 13 }}>{i+1}</span>}
              </div>
              <div style={{
                marginTop: 8, fontSize: 12, fontFamily: "Poppins",
                fontWeight: done || next || rejected ? 600 : 500,
                color: done ? "#252525" : next ? "#7A2A05" : rejected ? "#8B1A1A" : "#717171",
                lineHeight: 1.3,
              }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "#717171", marginTop: 2 }}>
                {rejected ? "Rejected" : done ? s.doneAt : next ? "In progress" : "Pending"}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2, marginTop: -28,
                background: done ? "#2E7D32" : "#F1F1F1",
                marginLeft: -16, marginRight: -16,
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Timeline({ events }) {
  return (
    <div style={{ position: "relative", paddingLeft: 22 }}>
      <div style={{ position: "absolute", left: 9, top: 8, bottom: 6, width: 2, background: "#F1F1F1" }} />
      {events.map((e, i) => {
        const color = e.tone === "success" ? "#2E7D32"
                   : e.tone === "error"   ? "#D32F2F"
                   : e.tone === "warning" ? "#F16624"
                   : e.tone === "neutral" ? "#717171" : "#40A3BD";
        return (
          <div key={i} style={{ display: "flex", gap: 14, paddingBottom: 14, position: "relative" }}>
            <span style={{
              position: "absolute", left: -22, top: 4,
              width: 12, height: 12, borderRadius: "50%",
              background: color, border: "2px solid #fff",
              boxShadow: "0 0 0 1px " + color + "44",
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 13.5, color: "#252525", lineHeight: 1.3 }}>{e.event}</div>
              {e.detail && <div style={{ fontSize: 12.5, color: "#505050", marginTop: 2, lineHeight: 1.45 }}>{e.detail}</div>}
              <div style={{ fontSize: 11.5, color: "#717171", marginTop: 3, fontFamily: "ui-monospace, Menlo" }}>{e.at}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function buildTimeline(c) {
  const baseline = [];
  if (c.status === "NotStarted") {
    baseline.push({ at: "Original onboarding", event: "Customer onboarded on shared number", detail: "Using +1 (949) 555-0100 — legacy", tone: "neutral" });
    return baseline;
  }
  if (c.brand) {
    baseline.push({ at: (c.submittedOn || c.rejectedOn || c.provisionedOn) + " · 2:14 PM", event: "Texting enabled by ops", detail: `${c.owner} enabled A2P provisioning in OpsAdmin`, tone: "neutral" });
    baseline.push({ at: (c.submittedOn || c.rejectedOn || c.provisionedOn) + " · 2:15 PM", event: "Brand submitted to TCR", detail: `TrustProduct RN${c.brand.slice(2,12)}… · EndUser SID EU…`, tone: "info" });
  }
  if (c.status === "BrandRejected") {
    baseline.push({ at: c.rejectedOn + " · 4:18 PM", event: "TCR rejected brand", detail: c.reason, tone: "error" });
    return baseline;
  }
  if (c.brand && c.status !== "BrandPending") {
    baseline.push({ at: (c.submittedOn || c.provisionedOn) + " · 8:02 AM", event: "TCR approved brand", detail: "Standard Brand verification · score 78/100", tone: "success" });
  }
  if (c.campaign) {
    baseline.push({ at: (c.submittedOn || c.rejectedOn || c.provisionedOn) + " · 4:18 PM", event: "Campaign submitted to TCR", detail: "Use case CUSTOMER_CARE · 3 sample messages", tone: "info" });
  }
  if (c.status === "CampaignRejected") {
    baseline.push({ at: c.rejectedOn + " · 11:08 AM", event: "TCR rejected campaign", detail: c.reason, tone: "error" });
    return baseline;
  }
  if (c.campaign && c.status === "Active") {
    baseline.push({ at: c.provisionedOn + " · 8:02 AM", event: "TCR approved campaign", detail: "Throughput 4,500 msg/day", tone: "success" });
    baseline.push({ at: c.provisionedOn + " · 11:40 AM", event: "Phone number purchased", detail: `${c.number} — Area ${c.areaCode}, ${c.state} · $1.15/mo`, tone: "info" });
    baseline.push({ at: c.provisionedOn + " · 11:41 AM", event: "Number added to messaging service", detail: "Messaging Service MG7710…", tone: "info" });
    baseline.push({ at: c.provisionedOn + " · 11:42 AM", event: "Number associated with campaign", detail: `${c.number} → Campaign ${c.campaign.slice(0,10)}…`, tone: "success" });
    baseline.push({ at: c.provisionedOn + " · 11:43 AM", event: "Fully A2P 10DLC compliant", detail: "Customer is live and sending on dedicated number.", tone: "success" });
  }
  if (c.status === "Suspended") {
    baseline.push({ at: c.provisionedOn + " · approved", event: "Activated successfully", detail: "Live and sending for 5 months.", tone: "success" });
    baseline.push({ at: "May 11, 2026", event: "Carrier issued suspension notice", detail: c.reason, tone: "warning" });
  }
  return baseline.reverse();
}

// ---------- Messaging tab ----------
function MessagingTab({ c }) {
  if (c.status !== "Active") {
    return (
      <Card>
        <div style={{ padding: "24px 8px", textAlign: "center", color: "#717171", fontSize: 14 }}>
          <Icon name="sms" size={36} color="#D3D3D3" />
          <div style={{ marginTop: 12, fontFamily: "Poppins", fontWeight: 600, color: "#252525", fontSize: 15 }}>No messaging activity yet</div>
          <div style={{ marginTop: 4 }}>Messages will appear here once a dedicated number is assigned and active.</div>
        </div>
      </Card>
    );
  }
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 18 }}>
        <Kpi value={c.monthlyMessages.toLocaleString()} label="Sent this month" tone="primary" icon="send" />
        <Kpi value="98.7%" label="Delivered" tone="success" icon="check_circle" />
        <Kpi value="0.4%" label="Filtered" tone="warning" icon="filter_alt" />
        <Kpi value="14" label="Replies" tone="info" icon="reply" />
      </div>
      <Card padding={0}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F1F1" }}>
          <h3 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 16, color: "#252525", margin: 0 }}>Recent outbound messages</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Figtree", fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: "#FAFAFA" }}>
              {["Sent", "To", "Preview", "Status"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 20px", fontFamily: "Poppins",
                  fontWeight: 600, fontSize: 11.5, color: "#717171", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Today · 9:42 AM",   "+1 (512) 555-2918", "Your leave request has been approved. Contact…", "Delivered"],
              ["Today · 9:41 AM",   "+1 (512) 555-7461", "Reminder: Submit your leave paperwork by 5 PM…", "Delivered"],
              ["Today · 8:55 AM",   "+1 (512) 555-1827", "Welcome to Northwind Logistics absence notif…", "Delivered"],
              ["Today · 8:14 AM",   "+1 (512) 555-3941", "Your case C-10482 status update: Documentati…", "Delivered"],
              ["Today · 7:32 AM",   "+1 (512) 555-8264", "Reply STOP to opt out at any time. AbsenceSoft…", "Failed"],
              ["Yesterday · 4:18 PM","+1 (512) 555-6178", "Your manager has reviewed your accommodation…", "Delivered"],
            ].map(([when, to, prev, st], i) => (
              <tr key={i} style={{ borderTop: "1px solid #F1F1F1" }}>
                <td style={{ padding: "11px 20px", color: "#717171", fontFamily: "ui-monospace, Menlo", fontSize: 12 }}>{when}</td>
                <td style={{ padding: "11px 20px", color: "#252525", fontFamily: "ui-monospace, Menlo", fontSize: 12.5 }}>{to}</td>
                <td style={{ padding: "11px 20px", color: "#505050" }}>{prev}</td>
                <td style={{ padding: "11px 20px" }}><Chip tone={st === "Delivered" ? "success" : "error"} dot={false}>{st}</Chip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ---------- Audit tab ----------
function AuditTab({ c, timeline }) {
  return (
    <Card>
      <h3 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 16, color: "#252525", margin: "0 0 18px" }}>Full audit trail</h3>
      <Timeline events={timeline} />
    </Card>
  );
}

// ---------- Raw JSON tab ----------
function RawTab({ c }) {
  const blob = {
    customerId: c.id,
    name: c.name,
    status: c.status,
    brand: c.brand ? {
      sid: c.brand,
      status: c.status === "BrandRejected" ? "FAILED" : c.brand ? "APPROVED" : "PENDING",
      tcr_score: 78,
      industry: "HUMAN_RESOURCES",
      business_type: "private_profit",
    } : null,
    campaign: c.campaign ? {
      sid: c.campaign,
      use_case: "CUSTOMER_CARE",
      message_samples: [
        "Welcome to <CUSTOMER> absence notifications powered by AbsenceSoft. Reply STOP to opt out.",
        "Your leave request has been approved. Contact your HR manager if you have questions.",
      ],
      has_embedded_links: false,
      has_embedded_phone: true,
    } : null,
    phone_number: c.number ? {
      phone_number: c.number,
      area_code: c.areaCode,
      capabilities: { SMS: true, MMS: true, voice: true },
      messaging_service_sid: "MG77104a5b6c7d8e9f0a1b2c3d4e5f6a7b8",
    } : null,
  };
  return (
    <Card padding={0}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #F1F1F1", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 15, color: "#252525", margin: 0 }}>Twilio API response (cached)</h3>
        <Button size="sm" variant="ghost" icon={<Icon name="refresh" size={14} />}>Refresh from Twilio</Button>
      </div>
      <pre style={{
        margin: 0, padding: 22, background: "#0B2E37", color: "#A7D8E2",
        fontFamily: "ui-monospace, Menlo, Consolas, monospace", fontSize: 12.5, lineHeight: 1.6,
        overflow: "auto", borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
      }}>{JSON.stringify(blob, null, 2)}</pre>
    </Card>
  );
}

Object.assign(window, { CustomerDetailPage });
