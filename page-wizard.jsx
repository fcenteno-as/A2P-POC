// Provisioning wizard — side sheet with 4 steps to enable A2P texting for a customer.

function ProvisioningWizard({ open, onClose, prefillCustomer }) {
  const [step, setStep] = React.useState(0);
  const [customer, setCustomer] = React.useState(prefillCustomer || null);
  const [areaCode, setAreaCode] = React.useState("");
  const [useCase, setUseCase] = React.useState("CUSTOMER_CARE");
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setStep(prefillCustomer ? 1 : 0);
      setCustomer(prefillCustomer || null);
      setAreaCode("");
      setSubmitting(false);
      setDone(false);
    }
  }, [open, prefillCustomer]);

  const steps = ["Customer", "Brand details", "Campaign", "Number & review"];

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 1400);
  };

  return (
    <SideSheet open={open} onClose={onClose} width={640}
      title="Provision A2P 10DLC"
      subtitle="Register Brand, Campaign, and dedicated phone number for a customer in one flow."
      footer={
        done ? (
          <>
            <div style={{ flex: 1 }} />
            <Button variant="primary" onClick={onClose}>Close</Button>
          </>
        ) : (
          <>
            <Button variant="text" onClick={onClose}>Cancel</Button>
            <div style={{ flex: 1 }} />
            {step > 0 && <Button variant="ghost" onClick={() => setStep(step - 1)}>← Back</Button>}
            {step < 3 && (
              <Button variant="primary" disabled={step === 0 && !customer}
                onClick={() => setStep(step + 1)}>Continue →</Button>
            )}
            {step === 3 && (
              <Button variant="primary" onClick={submit} disabled={submitting}
                icon={submitting ? <Spinner color="#fff" size={14} /> : <Icon name="rocket_launch" size={16} />}>
                {submitting ? "Submitting…" : "Submit to Twilio"}
              </Button>
            )}
          </>
        )
      }
    >
      {done ? (
        <SuccessState customer={customer} onClose={onClose} />
      ) : (
        <>
          {/* Stepper header */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 22 }}>
            {steps.map((s, i) => {
              const active = i === step;
              const completed = i < step;
              return (
                <React.Fragment key={s}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: completed ? "#2E7D32" : active ? "#0A8193" : "#F1F1F1",
                      color: completed || active ? "#fff" : "#717171",
                      display: "grid", placeItems: "center", fontFamily: "Poppins",
                      fontWeight: 600, fontSize: 12,
                    }}>
                      {completed ? <Icon name="check" size={14} /> : i + 1}
                    </div>
                    <span style={{
                      fontFamily: "Poppins", fontSize: 12.5,
                      fontWeight: active ? 600 : 500,
                      color: active ? "#252525" : completed ? "#505050" : "#717171",
                    }}>{s}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: completed ? "#2E7D32" : "#F1F1F1", margin: "0 10px" }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {step === 0 && <StepCustomer customer={customer} setCustomer={setCustomer} />}
          {step === 1 && <StepBrand customer={customer} />}
          {step === 2 && <StepCampaign useCase={useCase} setUseCase={setUseCase} customer={customer} />}
          {step === 3 && <StepReview customer={customer} areaCode={areaCode} setAreaCode={setAreaCode} useCase={useCase} />}
        </>
      )}
    </SideSheet>
  );
}

function StepCustomer({ customer, setCustomer }) {
  const { CUSTOMERS } = window;
  const [search, setSearch] = React.useState("");
  const legacy = CUSTOMERS.filter(c => c.status === "NotStarted");
  const matches = legacy.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <h4 style={{ fontFamily: "Poppins", fontSize: 16, color: "#252525", margin: "0 0 6px" }}>Pick a customer</h4>
      <p style={{ fontSize: 13.5, color: "#505050", margin: "0 0 16px" }}>
        Choose a customer to enable A2P 10DLC texting for. Legacy customers (currently on the shared +1 (949) number) are pre-listed.
      </p>
      <Input placeholder="Search customers…" value={search} onChange={setSearch}/>
      <div style={{ marginTop: 14, border: "1px solid #E0E0E0", borderRadius: 8, maxHeight: 320, overflowY: "auto" }}>
        {matches.map(c => (
          <div key={c.id} onClick={() => setCustomer(c)} style={{
            padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
            borderBottom: "1px solid #F1F1F1", cursor: "pointer",
            background: customer && customer.id === c.id ? "#EBF7F7" : "transparent",
          }}>
            <input type="radio" checked={customer && customer.id === c.id} readOnly
              style={{ accentColor: "#0A8193" }} />
            <Avatar initials={c.name.split(" ").slice(0,2).map(s => s[0]).join("")} size={32} tone="neutral" />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "#252525" }}>{c.name}</div>
              <div style={{ fontSize: 12, color: "#717171" }}>{c.id} · {c.employees.toLocaleString()} employees · {c.state}</div>
            </div>
            <Chip tone="warning" dot={false}>Legacy</Chip>
          </div>
        ))}
        {matches.length === 0 && (
          <div style={{ padding: 24, textAlign: "center", color: "#717171", fontSize: 13 }}>
            No legacy customers match. Try clearing your search.
          </div>
        )}
      </div>
      <div style={{ marginTop: 14, padding: "10px 12px", background: "#FAFAFA", borderRadius: 6, fontSize: 12.5, color: "#505050", display: "flex", gap: 8, alignItems: "center" }}>
        <Icon name="info" size={16} color="#40A3BD" />
        New customers are auto-provisioned when "Enable texting" is checked in their OpsAdmin profile. This wizard is for manual provisioning and migration.
      </div>
    </div>
  );
}

function StepBrand({ customer }) {
  if (!customer) return null;
  return (
    <div>
      <h4 style={{ fontFamily: "Poppins", fontSize: 16, color: "#252525", margin: "0 0 6px" }}>Confirm Brand details</h4>
      <p style={{ fontSize: 13.5, color: "#505050", margin: "0 0 16px" }}>
        These values are pulled from <strong>{customer.name}</strong>'s OpsAdmin profile and submitted to The Campaign Registry. Edit before submitting if anything is wrong.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input label="Legal business name" value={customer.name} />
        <Input label="EIN (Tax ID)" value={customer.ein} mono />
        <Select label="Business type" value="private_profit" options={[
          { value: "private_profit", label: "Private — for profit" },
          { value: "public_profit",  label: "Public — for profit" },
          { value: "non_profit",     label: "Non-profit" },
          { value: "government",     label: "Government" },
        ]} />
        <Select label="Industry vertical" value="HUMAN_RESOURCES" options={[
          "HUMAN_RESOURCES", "HEALTHCARE", "FINANCIAL", "EDUCATION", "GOVERNMENT", "RETAIL", "TECHNOLOGY", "MANUFACTURING",
        ]} />
        <Input label="Business address" value="100 Main St" />
        <Input label="City" value="Austin" />
        <Input label="State" value={customer.state} />
        <Input label="Postal code" value="78701" />
        <Input label="Business phone" value={`+1 (${customer.areaCode || "800"}) 555-0100`} optional hint="Fallback: AbsenceSoft support line" />
        <Input label="Email" value={`admin@${customer.name.toLowerCase().split(" ")[0]}.com`} optional />
      </div>
      <Alert tone="info" style={{ marginTop: 16 }} title="TCR will verify these details">
        Brand verification typically takes 1–5 business days. Mismatched legal name or EIN is the most common cause of rejection.
      </Alert>
    </div>
  );
}

function StepCampaign({ useCase, setUseCase, customer }) {
  return (
    <div>
      <h4 style={{ fontFamily: "Poppins", fontSize: 16, color: "#252525", margin: "0 0 6px" }}>Configure Campaign</h4>
      <p style={{ fontSize: 13.5, color: "#505050", margin: "0 0 16px" }}>
        The Campaign declares the kind of messages we'll send. We pre-fill the standard AbsenceSoft template for absence and leave notifications.
      </p>
      <Select label="Use case" value={useCase} onChange={setUseCase} options={window.USE_CASES}
        hint="CUSTOMER_CARE is standard for absence notifications" />
      <div style={{ marginTop: 14 }}>
        <Input label="Campaign description"
               value="Employee absence and leave management notifications" />
      </div>
      <div style={{ marginTop: 14 }}>
        <label style={{ display: "block", fontFamily: "Poppins", fontWeight: 600, fontSize: 13, color: "#252525", marginBottom: 6 }}>
          Sample messages
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            `Welcome to ${customer ? customer.name : "<CUSTOMER>"} absence notifications powered by AbsenceSoft. Reply STOP to opt out.`,
            "Your leave request has been approved. Contact your HR manager if you have questions.",
            "Reminder: Submit your leave paperwork by 5 PM today.",
          ].map((s, i) => (
            <div key={i} style={{
              padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: 8,
              fontSize: 13.5, color: "#252525", lineHeight: 1.5, background: "#FAFAFA",
              display: "flex", alignItems: "flex-start", gap: 10,
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: "50%", background: "#D0EDF4", color: "#096179",
                display: "grid", placeItems: "center", fontFamily: "Poppins", fontWeight: 600, fontSize: 11, flexShrink: 0,
              }}>{i+1}</span>
              <span style={{ flex: 1 }}>{s}</span>
              <Icon name="edit" size={15} color="#717171" style={{ cursor: "pointer", marginTop: 2 }} />
            </div>
          ))}
        </div>
        <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 13, color: "#096179", cursor: "pointer", marginTop: 10, display: "inline-block" }}>
          + Add sample message
        </span>
      </div>

      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Toggle on={false} onChange={()=>{}} label="Embedded links allowed" hint="Disabled by default" />
        <Toggle on={true} onChange={()=>{}} label="Embedded phone allowed" hint="Required for HR support callbacks" />
      </div>
    </div>
  );
}

function StepReview({ customer, areaCode, setAreaCode, useCase }) {
  if (!customer) return null;
  return (
    <div>
      <h4 style={{ fontFamily: "Poppins", fontSize: 16, color: "#252525", margin: "0 0 6px" }}>Choose phone number & review</h4>
      <p style={{ fontSize: 13.5, color: "#505050", margin: "0 0 16px" }}>
        We'll search Twilio for an available local number once Brand and Campaign are approved. Leave area code blank to use the customer's state.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
        <Input label="Preferred area code" optional value={areaCode} onChange={setAreaCode} placeholder={`Defaults to ${customer.state} area codes`} />
        <Select label="Number type" value="local" options={[{value:"local", label:"Local (recommended)"}, {value:"toll_free", label:"Toll-free"}]} />
      </div>

      <div style={{ background: "#FAFAFA", padding: 16, borderRadius: 8, border: "1px solid #E0E0E0" }}>
        <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "#252525", marginBottom: 12 }}>Review submission</div>
        <ReviewLine label="Customer"      value={customer.name + " · " + customer.id} />
        <ReviewLine label="EIN"           value={customer.ein} mono />
        <ReviewLine label="Brand profile" value="Will be created in Twilio Trust Hub" />
        <ReviewLine label="Use case"      value={useCase} />
        <ReviewLine label="State"         value={customer.state} />
        <ReviewLine label="Area code"     value={areaCode || `Auto (${customer.state})`} />
        <ReviewLine label="Messaging Service" value="MG77104a5b6c7d8e9f0a1b2c3d4e5f6a7b8" mono />
        <ReviewLine label="Webhook"       value="https://api.absencesoft.com/webhooks/twilio" />
      </div>

      <Alert tone="warning" style={{ marginTop: 16 }} title="This kicks off a TCR submission">
        Brand approval takes 1–5 business days. Campaign approval takes another 1–3. The phone number is purchased and associated automatically once both are approved.
      </Alert>
    </div>
  );
}

function ReviewLine({ label, value, mono }) {
  return (
    <div style={{ display: "flex", padding: "6px 0", fontSize: 13.5 }}>
      <span style={{ color: "#717171", width: 160, flexShrink: 0 }}>{label}</span>
      <span style={{ color: "#252525", fontFamily: mono ? "ui-monospace, Menlo" : "Figtree" }}>{value}</span>
    </div>
  );
}

function SuccessState({ customer }) {
  return (
    <div style={{ padding: "24px 4px" }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%", background: "rgba(46,125,50,0.12)",
        display: "grid", placeItems: "center", margin: "0 auto 18px",
      }}>
        <Icon name="rocket_launch" size={32} color="#2E7D32" />
      </div>
      <h3 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 22, color: "#252525", textAlign: "center", margin: "0 0 8px" }}>
        Provisioning submitted
      </h3>
      <p style={{ textAlign: "center", fontSize: 14, color: "#505050", margin: "0 0 24px" }}>
        Brand and Campaign for <strong>{customer ? customer.name : ""}</strong> have been submitted to TCR. You'll get an in-app notification when each step approves.
      </p>
      <div style={{ background: "#EBF7F7", borderRadius: 8, padding: 18 }}>
        <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "#074252", marginBottom: 10 }}>What happens next</div>
        <ol style={{ margin: 0, paddingLeft: 20, color: "#252525", fontSize: 13.5, lineHeight: 1.8 }}>
          <li><strong>Brand review</strong> — TCR validates EIN and legal name (1–5 days)</li>
          <li><strong>Campaign review</strong> — TCR validates use case and sample messages (1–3 days)</li>
          <li><strong>Number purchase</strong> — System picks the best available local number</li>
          <li><strong>Activation</strong> — Customer becomes A2P compliant; messaging routes automatically</li>
        </ol>
      </div>
    </div>
  );
}

Object.assign(window, { ProvisioningWizard });
