// App shell — left rail nav + top header + content slot.
// A2P 10DLC admin tool inside the AbsenceSoft OpsAdmin surface.

function AppShell({ children, active, onNavigate, breadcrumb }) {
  const sections = [
    { kind: "label", label: "Operations" },
    { id: "overview",  label: "Overview",          icon: "dashboard" },
    { id: "customers", label: "Customers",         icon: "domain"    },
    { id: "migration", label: "Bulk migration",    icon: "swap_horiz", badge: 82 },
    { kind: "label", label: "Resources" },
    { id: "numbers",   label: "Phone numbers",     icon: "smartphone" },
    { id: "templates", label: "Campaign templates",icon: "description" },
    { id: "activity",  label: "Activity log",      icon: "history"   },
    { kind: "label", label: "Account" },
    { id: "settings",  label: "Settings",          icon: "settings"  },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FAFAFA", fontFamily: "Figtree, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: 248, background: "#074252", color: "#fff",
        display: "flex", flexDirection: "column", flexShrink: 0,
        position: "sticky", top: 0, height: "100vh",
      }}>
        <div style={{ padding: "22px 22px 22px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <img src="assets/Logo-white.svg" alt="AbsenceSoft" style={{ height: 24 }} />
          <div style={{
            marginTop: 14, display: "flex", alignItems: "center", gap: 8,
            fontFamily: "Poppins", fontSize: 12, fontWeight: 500,
            color: "rgba(255,255,255,0.62)", letterSpacing: "0.04em", textTransform: "uppercase",
          }}>
            <Icon name="sms" size={14} color="#70C9E9" />
            A2P 10DLC Console
          </div>
        </div>
        <nav style={{ padding: "12px 12px", flex: 1, overflowY: "auto" }}>
          {sections.map((n, i) => {
            if (n.kind === "label") return (
              <div key={"l"+i} style={{
                padding: "14px 14px 6px", fontSize: 11, fontFamily: "Poppins", fontWeight: 600,
                color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em",
              }}>{n.label}</div>
            );
            const isActive = n.id === active;
            return (
              <div key={n.id} onClick={() => onNavigate && onNavigate(n.id)} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "9px 14px", borderRadius: 6, cursor: "pointer",
                color: isActive ? "#fff" : "rgba(255,255,255,0.78)",
                background: isActive ? "rgba(64,163,189,0.22)" : "transparent",
                fontFamily: "Poppins", fontWeight: isActive ? 600 : 500, fontSize: 13.5,
                marginBottom: 2, position: "relative",
                borderLeft: isActive ? "3px solid #70C9E9" : "3px solid transparent",
                paddingLeft: isActive ? 11 : 14,
              }}>
                <Icon name={n.icon} size={19} />
                <span style={{ flex: 1 }}>{n.label}</span>
                {n.badge != null && (
                  <span style={{
                    background: "#F16624", color: "#fff", fontSize: 11, fontWeight: 600,
                    padding: "1px 7px", borderRadius: 9999, lineHeight: 1.5,
                  }}>{n.badge}</span>
                )}
              </div>
            );
          })}
        </nav>
        <div style={{
          padding: 14, margin: 12, borderRadius: 8,
          background: "rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <Avatar initials="DA" size={32} tone="info" />
          <div style={{ fontSize: 13, lineHeight: 1.3, flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "Poppins", fontWeight: 600, color: "#fff",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Dani Ahmed</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Ops Admin</div>
          </div>
          <Icon name="more_horiz" size={18} color="rgba(255,255,255,0.55)" />
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{
          height: 60, background: "#fff", borderBottom: "1px solid #E0E0E0",
          display: "flex", alignItems: "center", padding: "0 28px", gap: 16, position: "sticky", top: 0, zIndex: 10,
        }}>
          <Breadcrumb items={breadcrumb} />
          <div style={{ flex: 1 }} />
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#F6F6F6", borderRadius: 9999, padding: "7px 14px", minWidth: 280,
          }}>
            <Icon name="search" size={17} color="#717171" />
            <input placeholder="Search customers, brand SIDs, phone numbers…" style={{
              border: "none", background: "transparent", outline: "none", flex: 1,
              fontFamily: "Figtree", fontSize: 13, color: "#252525",
            }} />
            <kbd style={{
              fontFamily: "ui-monospace, Menlo", fontSize: 11, color: "#717171",
              padding: "1px 5px", border: "1px solid #E0E0E0", borderRadius: 3, background: "#fff",
            }}>⌘K</kbd>
          </div>
          <Icon name="help" size={20} color="#505050" style={{ cursor: "pointer" }} />
          <div style={{ position: "relative" }}>
            <Icon name="notifications" size={20} color="#505050" style={{ cursor: "pointer" }} />
            <span style={{
              position: "absolute", top: -3, right: -3, width: 8, height: 8,
              background: "#F16624", borderRadius: "50%", border: "2px solid #fff",
            }} />
          </div>
        </header>
        <main style={{ flex: 1, padding: "26px 32px 80px", overflow: "auto", maxWidth: "100%" }}>{children}</main>
      </div>
    </div>
  );
}

function Breadcrumb({ items = [] }) {
  if (!items.length) return <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "#252525" }}>OpsAdmin</div>;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#717171" }}>
      <span style={{ color: "#096179", fontWeight: 600, fontFamily: "Poppins" }}>OpsAdmin</span>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          <Icon name="chevron_right" size={16} color="#D3D3D3" />
          <span style={{
            color: i === items.length - 1 ? "#252525" : "#505050",
            fontFamily: "Poppins", fontWeight: i === items.length - 1 ? 600 : 500,
          }}>{it}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

Object.assign(window, { AppShell, Breadcrumb });
