// Resource pages: Phone numbers pool, Campaign templates, Activity log, Settings.

// ============================================================
// Phone numbers pool
// ============================================================
function NumbersPage({ onOpenCustomer }) {
  const { CUSTOMERS } = window;
  const assigned = CUSTOMERS.filter(c => c.number && !c.number.includes("shared"));
  const [showSearch, setShowSearch] = React.useState(false);

  return (
    <div>
      <SectionHeader
        eyebrow="Resources"
        title="Phone numbers"
        subtitle="Every number provisioned for AbsenceSoft customers through the Twilio Messaging Service Number Pool."
        action={
          <>
            <Button variant="ghost" icon={<Icon name="cloud_sync" size={17} />}>Sync from Twilio</Button>
            <Button variant="primary" onClick={() => setShowSearch(true)} icon={<Icon name="add" size={17} />}>Purchase numbers</Button>
          </>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        <Kpi value="203" label="Numbers in pool" icon="smartphone" />
        <Kpi value="$233.45" label="Monthly cost" icon="payments" delta="$1.15/number" />
        <Kpi value="46" label="States covered" tone="info" icon="map" />
        <Kpi value="1" label="Shared (legacy)" tone="warning" icon="warning" />
      </div>

      <Card padding={0}>
        <div style={{
          padding: "12px 18px", borderBottom: "1px solid #F1F1F1",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 320,
            border: "1px solid #E0E0E0", borderRadius: 5, padding: "7px 12px",
          }}>
            <Icon name="search" size={16} color="#717171" />
            <input placeholder="Filter by number, customer, or state…"
              style={{ flex: 1, border: "none", outline: "none", fontFamily: "Figtree", fontSize: 13.5 }}/>
          </div>
          <div style={{ flex: 1 }} />
          <Button size="sm" variant="ghost" icon={<Icon name="tune" size={15} />}>Filter</Button>
          <Button size="sm" variant="ghost" icon={<Icon name="file_download" size={15} />}>Export</Button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Figtree", fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: "#FAFAFA" }}>
              {["Number", "Assigned to", "Geography", "Capabilities", "Status", "Cost", ""].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "12px 18px", fontFamily: "Poppins",
                  fontWeight: 600, fontSize: 11.5, color: "#717171", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderTop: "1px solid #F1F1F1", background: "#FFF6F0" }}>
              <td style={{ padding: "13px 18px", fontFamily: "ui-monospace, Menlo", color: "#252525" }}>+1 (949) 555-0100</td>
              <td style={{ padding: "13px 18px", color: "#7A2A05" }}>
                <strong>Legacy shared</strong> — 82 customers
              </td>
              <td style={{ padding: "13px 18px", color: "#505050" }}>949 · CA</td>
              <td style={{ padding: "13px 18px" }}>
                <span style={{ display: "flex", gap: 4 }}>
                  <Chip tone="success" dot={false}>SMS</Chip>
                  <Chip tone="success" dot={false}>MMS</Chip>
                </span>
              </td>
              <td style={{ padding: "13px 18px" }}>
                <Chip tone="warning">Non-compliant</Chip>
              </td>
              <td style={{ padding: "13px 18px", color: "#252525" }}>$1.15</td>
              <td style={{ padding: "13px 18px", textAlign: "right" }}>
                <Icon name="chevron_right" size={20} color="#717171" />
              </td>
            </tr>
            {assigned.map(c => (
              <tr key={c.id} style={{ borderTop: "1px solid #F1F1F1", cursor: "pointer" }}
                onClick={() => onOpenCustomer(c)}
                onMouseEnter={(e) => e.currentTarget.style.background = "#FAFDFE"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "13px 18px", fontFamily: "ui-monospace, Menlo", color: "#252525" }}>{c.number}</td>
                <td style={{ padding: "13px 18px", color: "#252525" }}>{c.name}</td>
                <td style={{ padding: "13px 18px", color: "#505050" }}>{c.areaCode} · {c.state}</td>
                <td style={{ padding: "13px 18px" }}>
                  <span style={{ display: "flex", gap: 4 }}>
                    <Chip tone="success" dot={false}>SMS</Chip>
                    <Chip tone="success" dot={false}>MMS</Chip>
                    <Chip tone="success" dot={false}>Voice</Chip>
                  </span>
                </td>
                <td style={{ padding: "13px 18px" }}>
                  <Chip tone={c.status === "Suspended" ? "warning" : "success"}>
                    {c.status === "Suspended" ? "Suspended" : "Active"}
                  </Chip>
                </td>
                <td style={{ padding: "13px 18px", color: "#252525" }}>$1.15</td>
                <td style={{ padding: "13px 18px", textAlign: "right" }}>
                  <Icon name="chevron_right" size={20} color="#717171" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "14px 18px", borderTop: "1px solid #F1F1F1", textAlign: "center", color: "#717171", fontSize: 13 }}>
          + {203 - assigned.length} more numbers · <span style={{ color: "#096179", fontWeight: 600, cursor: "pointer" }}>Load more</span>
        </div>
      </Card>

      <SearchNumberSheet open={showSearch} onClose={() => setShowSearch(false)} />
    </div>
  );
}

function SearchNumberSheet({ open, onClose }) {
  const { AVAILABLE_NUMBERS } = window;
  const [state, setState] = React.useState("MN");
  const [areaCode, setAreaCode] = React.useState("612");
  return (
    <SideSheet open={open} onClose={onClose} width={620}
      title="Search & purchase numbers"
      subtitle="Search Twilio's local number inventory and pre-purchase numbers into the pool."
      footer={
        <>
          <Button variant="text" onClick={onClose}>Cancel</Button>
          <div style={{ flex: 1 }} />
          <Button variant="primary" onClick={onClose}>Purchase 1 number ($1.15)</Button>
        </>
      }>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        <Select label="State" value={state} onChange={setState} options={["MN","CA","TX","NY","FL","IL","OH","PA","CO"]} />
        <Input  label="Area code" optional value={areaCode} onChange={setAreaCode} />
        <Select label="Capabilities" value="all" options={[{value:"all",label:"SMS + MMS"}, {value:"sms",label:"SMS only"}]} />
      </div>
      <div style={{ marginBottom: 10, fontSize: 13, color: "#505050" }}>
        <strong style={{ color: "#252525" }}>{AVAILABLE_NUMBERS.length} numbers</strong> available
      </div>
      <div style={{ border: "1px solid #E0E0E0", borderRadius: 8 }}>
        {AVAILABLE_NUMBERS.map((n, i) => (
          <div key={n.number} style={{
            padding: "12px 14px", borderBottom: i === AVAILABLE_NUMBERS.length - 1 ? "none" : "1px solid #F1F1F1",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <input type="radio" name="num" defaultChecked={i === 0} style={{ accentColor: "#0A8193" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "ui-monospace, Menlo", color: "#252525", fontWeight: 600 }}>{n.number}</div>
              <div style={{ fontSize: 12, color: "#717171", marginTop: 2 }}>{n.city}, {n.region}</div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {n.sms   && <Chip tone="success" dot={false}>SMS</Chip>}
              {n.mms   && <Chip tone="success" dot={false}>MMS</Chip>}
              {n.voice && <Chip tone="success" dot={false}>Voice</Chip>}
            </div>
            <div style={{ width: 56, textAlign: "right", color: "#252525", fontSize: 13 }}>{n.monthly}</div>
          </div>
        ))}
      </div>
    </SideSheet>
  );
}

// ============================================================
// Campaign templates
// ============================================================
function TemplatesPage() {
  const templates = [
    {
      name: "AbsenceSoft Standard — CUSTOMER_CARE",
      desc: "Default template used for all new customer provisioning. Employee absence and leave management notifications.",
      useCase: "CUSTOMER_CARE",
      usedBy: 168, isDefault: true,
      samples: [
        "Welcome to <CUSTOMER> absence notifications powered by AbsenceSoft. Reply STOP to opt out.",
        "Your leave request has been approved. Contact your HR manager if you have questions.",
        "Reminder: Submit your leave paperwork by 5 PM today.",
      ],
    },
    {
      name: "Account Notifications — Healthcare",
      desc: "For healthcare customers; lighter language around medical certifications and HIPAA-adjacent reminders.",
      useCase: "ACCOUNT_NOTIFICATION",
      usedBy: 28, isDefault: false,
      samples: [
        "Your case has been updated by your benefits coordinator. View status at our portal.",
        "Reminder: Medical certification due by <DATE>. Reply with questions.",
        "Your accommodation request status has changed. Sign in to review.",
      ],
    },
    {
      name: "Public Sector — Government Notices",
      desc: "Used for public-sector employers (school districts, municipalities). More formal copy.",
      useCase: "PUBLIC_SERVICE_ANNOUNCEMENT",
      usedBy: 7, isDefault: false,
      samples: [
        "This is an official notice from <CUSTOMER>. Your leave status has been updated.",
        "Required action: please log in to complete your leave certification.",
      ],
    },
  ];

  return (
    <div>
      <SectionHeader
        eyebrow="Resources"
        title="Campaign templates"
        subtitle="Reusable Campaign blueprints. New customers default to the standard template; customers in specific verticals can be reassigned."
        action={
          <Button variant="primary" icon={<Icon name="add" size={17} />}>New template</Button>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {templates.map(t => (
          <Card key={t.name}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 10 }}>
              <div>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 16, color: "#252525", margin: 0 }}>{t.name}</h3>
                <div style={{ marginTop: 4, fontSize: 13, color: "#505050", lineHeight: 1.5 }}>{t.desc}</div>
              </div>
              {t.isDefault && <Chip tone="info">Default</Chip>}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12, marginBottom: 14 }}>
              <Chip tone="info" dot={false}>{t.useCase}</Chip>
              <Chip tone="neutral" dot={false}>{t.usedBy} customers</Chip>
            </div>
            <div style={{ background: "#F7F7F7", borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 11.5, color: "#717171", textTransform: "uppercase", letterSpacing: 0.4, fontFamily: "Poppins", fontWeight: 600, marginBottom: 8 }}>Sample messages</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {t.samples.map((s, i) => (
                  <div key={i} style={{ fontSize: 12.5, color: "#252525", lineHeight: 1.5 }}>
                    <span style={{ color: "#40A3BD", fontWeight: 600, marginRight: 6 }}>{i+1}.</span>{s}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
              <Button size="sm" variant="ghost">Edit</Button>
              <Button size="sm" variant="text">Duplicate</Button>
              {!t.isDefault && <Button size="sm" variant="text">Make default</Button>}
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ marginTop: 18, background: "#EBF7F7", border: "none" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <Icon name="shield" size={22} color="#40A3BD" style={{ marginTop: 2 }} />
          <div>
            <h4 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 15, color: "#074252", margin: 0 }}>Opt-in / opt-out language</h4>
            <div style={{ fontSize: 13.5, color: "#505050", marginTop: 4, lineHeight: 1.6 }}>
              Configured once and applied globally. <strong>Opt-in keywords:</strong> START, YES, UNSTOP. <strong>Opt-out keywords:</strong> STOP, END, CANCEL, UNSUBSCRIBE, QUIT. <strong>Help keywords:</strong> HELP, INFO.
            </div>
          </div>
          <Button variant="ghost" size="sm">Edit global keywords</Button>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// Activity log
// ============================================================
function ActivityPage() {
  const { ACTIVITY } = window;
  // expand the activity feed with more rows for the dedicated page
  const extra = [
    { at: "May 11 · 2:18 PM",  who: "system",      what: "TCR approved Brand for",         target: "Tidewater Logistics Group",  tone: "success" },
    { at: "May 11 · 1:45 PM",  who: "B. Carlton",  what: "Updated brand details on",       target: "Birchwood Realty",           tone: "info"    },
    { at: "May 10 · 10:22 AM", who: "system",      what: "Migration batch MIG-010 completed (17 ok / 3 failed)", target: null, tone: "warning" },
    { at: "May 10 · 9:12 AM",  who: "D. Ahmed",    what: "Started migration batch MIG-010", target: null, tone: "info" },
    { at: "May 09 · 4:33 PM",  who: "system",      what: "TCR rejected Brand for",          target: "Cedar & Co. Consulting",     tone: "error"   },
    { at: "May 08 · 11:02 AM", who: "J. Martin",   what: "Updated default sample message #2", target: null, tone: "neutral" },
  ];
  const all = [...ACTIVITY, ...extra];

  return (
    <div>
      <SectionHeader
        eyebrow="Audit"
        title="Activity log"
        subtitle="Every provisioning event across the fleet — system actions and operator actions, fully searchable."
        action={
          <>
            <Button variant="ghost" icon={<Icon name="file_download" size={17} />}>Export</Button>
            <Button variant="ghost" icon={<Icon name="settings" size={17} />}>Configure alerts</Button>
          </>
        }
      />

      <Card padding={0}>
        <div style={{
          padding: "12px 18px", borderBottom: "1px solid #F1F1F1",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 360,
            border: "1px solid #E0E0E0", borderRadius: 5, padding: "7px 12px",
          }}>
            <Icon name="search" size={16} color="#717171" />
            <input placeholder="Search events…"
              style={{ flex: 1, border: "none", outline: "none", fontFamily: "Figtree", fontSize: 13.5 }}/>
          </div>
          <Select value="all" options={[{value:"all", label:"All event types"},{value:"sys",label:"System"},{value:"user",label:"User"}]} />
          <Select value="7d" options={[{value:"24h", label:"Last 24 hours"},{value:"7d",label:"Last 7 days"},{value:"30d",label:"Last 30 days"}]} />
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Figtree", fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: "#FAFAFA" }}>
              {["When", "Actor", "Event", "Target", "Type"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "12px 18px", fontFamily: "Poppins",
                  fontWeight: 600, fontSize: 11.5, color: "#717171", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {all.map((a, i) => (
              <tr key={i} style={{ borderTop: "1px solid #F1F1F1" }}>
                <td style={{ padding: "11px 18px", color: "#717171", fontFamily: "ui-monospace, Menlo", fontSize: 12, whiteSpace: "nowrap" }}>{a.at}</td>
                <td style={{ padding: "11px 18px", color: "#252525" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {a.who === "system" ? (
                      <span style={{
                        width: 22, height: 22, borderRadius: "50%", background: "#EBF7F7", color: "#40A3BD",
                        display: "grid", placeItems: "center",
                      }}><Icon name="settings_suggest" size={13} /></span>
                    ) : (
                      <Avatar initials={a.who.split(/[. ]/).map(s => s[0]).filter(Boolean).slice(0,2).join("").toUpperCase()} size={22} />
                    )}
                    <span>{a.who === "system" ? "System" : a.who}</span>
                  </div>
                </td>
                <td style={{ padding: "11px 18px", color: "#252525" }}>{a.what}</td>
                <td style={{ padding: "11px 18px", color: "#096179", fontWeight: 500, fontFamily: "Poppins" }}>{a.target || "—"}</td>
                <td style={{ padding: "11px 18px" }}><Chip tone={a.tone}>{a.tone === "success" ? "Success" : a.tone === "error" ? "Error" : a.tone === "warning" ? "Warning" : a.tone === "neutral" ? "Info" : "Info"}</Chip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ============================================================
// Settings
// ============================================================
function SettingsPage() {
  const [autoProv, setAutoProv] = React.useState(true);
  const [areaCodeStrategy, setAreaCodeStrategy] = React.useState("state");
  const [supportFallback, setSupportFallback] = React.useState(true);

  return (
    <div>
      <SectionHeader
        eyebrow="Configuration"
        title="A2P 10DLC settings"
        subtitle="Global behaviour for Brand registration, Campaign defaults, and number provisioning."
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <Card>
          <CardHeader icon="bolt" title="Automation" subtitle="What happens when texting is enabled on a customer" />
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Toggle on={autoProv} onChange={setAutoProv}
              label="Auto-provision new customers"
              hint="When a customer enables texting in OpsAdmin, Brand + Campaign + Number are registered automatically." />
            <Toggle on={supportFallback} onChange={setSupportFallback}
              label="Fallback contact info from AbsenceSoft support"
              hint="If a customer is missing phone/email, use support@absencesoft.com and +1 (800) 555-1234." />
            <Toggle on={true} onChange={()=>{}}
              label="Retry failed registrations daily"
              hint="Up to 3 attempts per Brand or Campaign over 7 days. After that, marked as Failed for ops." />
          </div>
        </Card>

        <Card>
          <CardHeader icon="location_on" title="Number search strategy" subtitle="How we pick numbers for new customers" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { id: "state",     label: "Customer's state",       hint: "Prefer numbers in the area code most-populated by the customer's HQ state." },
              { id: "headcount", label: "Largest employee state", hint: "Pick numbers from the state with the most employees, even if it's not HQ." },
              { id: "manual",    label: "Manual selection",       hint: "Ops admin picks the area code during onboarding." },
            ].map(opt => (
              <label key={opt.id} style={{
                display: "flex", gap: 10, padding: 10,
                border: `1.5px solid ${areaCodeStrategy === opt.id ? "#0A8193" : "#E0E0E0"}`, borderRadius: 8, cursor: "pointer",
                background: areaCodeStrategy === opt.id ? "#EBF7F7" : "#fff",
              }}>
                <input type="radio" checked={areaCodeStrategy === opt.id} onChange={() => setAreaCodeStrategy(opt.id)}
                  style={{ accentColor: "#0A8193", marginTop: 2 }} />
                <div>
                  <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 13.5, color: "#252525" }}>{opt.label}</div>
                  <div style={{ fontSize: 12.5, color: "#717171", marginTop: 2, lineHeight: 1.45 }}>{opt.hint}</div>
                </div>
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader icon="vpn_key" title="Twilio credentials" subtitle="Master account used for all registrations" />
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 12, columnGap: 16, fontSize: 13 }}>
            <span style={{ color: "#717171" }}>Account SID</span>
            <CopyMono text="AC8a2c1d3e4f5a6b7c8d9e0f1a2b3c4d5e6" />
            <span style={{ color: "#717171" }}>Auth Token</span>
            <CopyMono text="••••••••••••••••" />
            <span style={{ color: "#717171" }}>Messaging Service</span>
            <CopyMono text="MG77104a5b6c7d8e9f0a1b2c3d4e5f6a7b8" />
            <span style={{ color: "#717171" }}>Brand policy SID</span>
            <CopyMono text="RN2891ab4cd5e6f7a8b9c0d1e2f3a4b5c6d" />
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #F1F1F1" }}>
            <Button size="sm" variant="ghost">Rotate auth token</Button>
            <Button size="sm" variant="text" style={{ marginLeft: 8 }}>Test connection</Button>
          </div>
        </Card>

        <Card>
          <CardHeader icon="notifications" title="Alerts" subtitle="Who gets paged when things go wrong" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Brand rejected by TCR",   chan: "Slack #ops-alerts + email" },
              { label: "Campaign rejected by TCR",chan: "Slack #ops-alerts + email" },
              { label: "Number provisioning failure", chan: "Slack #ops-alerts" },
              { label: "Migration batch failure",  chan: "Email · ops-leads@absencesoft.com" },
              { label: "Carrier suspension",      chan: "PagerDuty (high)" },
            ].map(a => (
              <div key={a.label} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F1F1F1" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: 13.5, color: "#252525" }}>{a.label}</div>
                  <div style={{ fontSize: 12, color: "#717171", marginTop: 1 }}>{a.chan}</div>
                </div>
                <Toggle on={true} onChange={()=>{}} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { NumbersPage, TemplatesPage, ActivityPage, SettingsPage });
