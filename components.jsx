// AbsenceSoft product UI — shared components for A2P 10DLC admin
// React 18 + Babel. Exports components to window.

const { useState } = React;

// ---------- Button ----------
function Button({ variant = "primary", size = "md", onClick, children, disabled, icon, style, type = "button" }) {
  const variants = {
    primary:   { background: "#0A8193", color: "#fff" },
    secondary: { background: "#074252", color: "#fff" },
    ghost:     { background: "transparent", color: "#096179", border: "1.5px solid #096179" },
    text:      { background: "transparent", color: "#096179", padding: "10px 6px" },
    danger:    { background: "#D32F2F", color: "#fff" },
    warning:   { background: "#F16624", color: "#fff" },
  };
  const base = {
    fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14,
    padding: "10px 18px", borderRadius: 5, border: "none", cursor: "pointer",
    lineHeight: 1, transition: "background 200ms cubic-bezier(0.2,0,0,1), color 200ms",
    display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
  };
  const sz = size === "sm" ? { padding: "7px 12px", fontSize: 13 } : size === "lg" ? { padding: "13px 22px", fontSize: 15 } : {};
  const dis = disabled ? { background: "#F1F1F1", color: "#A0A0A0", cursor: "not-allowed", border: "none" } : {};
  return (
    <button type={type} onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant], ...sz, ...dis, ...style }}>
      {icon && <span style={{ display: "inline-flex" }}>{icon}</span>}
      {children}
    </button>
  );
}

function Icon({ name, size = 18, color, style }) {
  return (
    <span className="material-symbols-outlined" style={{
      fontSize: size, color, fontVariationSettings: "'FILL' 0,'wght' 400,'opsz' 20",
      lineHeight: 1, ...style,
    }}>{name}</span>
  );
}

// ---------- Chip ----------
function Chip({ tone = "neutral", children, dot = true, style }) {
  const tones = {
    neutral: { bg: "#F1F1F1",       fg: "#252525", dot: "#717171" },
    info:    { bg: "#D0EDF4",       fg: "#074252", dot: "#40A3BD" },
    success: { bg: "rgba(46,125,50,0.12)", fg: "#1B5E20", dot: "#2E7D32" },
    warning: { bg: "#FFF6F0",       fg: "#7A2A05", dot: "#F16624" },
    error:   { bg: "#FBEAEA",       fg: "#8B1A1A", dot: "#D32F2F" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontFamily: "Figtree, sans-serif", fontSize: 12, fontWeight: 600,
      padding: "4px 10px", borderRadius: 9999, background: t.bg, color: t.fg, lineHeight: 1, ...style,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.dot }} />}
      {children}
    </span>
  );
}

// Status chip — looks up STATUSES from window.
function StatusChip({ status, style }) {
  const meta = window.STATUSES[status] || { label: status, tone: "neutral" };
  return <Chip tone={meta.tone} style={style}>{meta.label}</Chip>;
}

// ---------- Avatar ----------
function Avatar({ initials, size = 36, tone = "info" }) {
  const tones = {
    info:    { bg: "#D0EDF4", fg: "#096179" },
    warn:    { bg: "#FFF6F0", fg: "#CE4A0D" },
    dark:    { bg: "#074252", fg: "#fff" },
    neutral: { bg: "#F1F1F1", fg: "#505050" },
  };
  const t = tones[tone] || tones.info;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: size, height: size, borderRadius: "50%",
      background: t.bg, color: t.fg,
      fontFamily: "Poppins", fontWeight: 700, fontSize: Math.round(size * 0.4),
      flexShrink: 0,
    }}>{initials}</span>
  );
}

// ---------- Alert ----------
function Alert({ tone = "info", title, children, onClose, style, action }) {
  const tones = {
    info:    { bg: "#EBF7F7", fg: "#074252", icon: "#40A3BD", ic: "info"          },
    success: { bg: "rgba(46,125,50,0.10)", fg: "#1B5E20", icon: "#2E7D32", ic: "check_circle" },
    warning: { bg: "#FFF6F0", fg: "#7A2A05", icon: "#F16624", ic: "warning"       },
    error:   { bg: "#FBEAEA", fg: "#8B1A1A", icon: "#D32F2F", ic: "error"         },
  };
  const t = tones[tone] || tones.info;
  return (
    <div style={{
      display: "flex", gap: 12, padding: "14px 16px", borderRadius: 8,
      background: t.bg, color: t.fg, fontFamily: "Figtree", fontSize: 14, lineHeight: 1.5,
      alignItems: "flex-start", ...style,
    }}>
      <Icon name={t.ic} size={20} color={t.icon} style={{ marginTop: 1, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontFamily: "Poppins", fontWeight: 600, marginBottom: 2 }}>{title}</div>}
        <div>{children}</div>
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      {onClose && <span onClick={onClose} style={{ cursor: "pointer", opacity: 0.5 }}>×</span>}
    </div>
  );
}

// ---------- Input ----------
function Input({ label, hint, error, value, onChange, type = "text", placeholder, disabled, optional, mono, prefix }) {
  return (
    <div style={{ fontFamily: "Figtree" }}>
      {label && (
        <label style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          fontFamily: "Poppins", fontWeight: 600, fontSize: 13, color: "#252525", marginBottom: 6
        }}>
          <span>{label}</span>
          {optional && <span style={{ color: "#717171", fontWeight: 400, fontSize: 12 }}>Optional</span>}
        </label>
      )}
      <div style={{
        display: "flex", alignItems: "center",
        border: `1px solid ${error ? "#D32F2F" : "#E0E0E0"}`, borderRadius: 5,
        background: disabled ? "#FAFAFA" : "#fff",
      }}>
        {prefix && <span style={{ padding: "0 0 0 12px", color: "#717171", fontSize: 14 }}>{prefix}</span>}
        <input type={type} value={value || ""} disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.value)} placeholder={placeholder}
          style={{
            width: "100%", padding: "10px 12px",
            fontFamily: mono ? "ui-monospace, Menlo, Consolas, monospace" : "Figtree",
            fontSize: 14, border: "none", borderRadius: 5,
            color: disabled ? "#717171" : "#252525", background: "transparent",
            boxSizing: "border-box", outline: "none",
          }}
        />
      </div>
      {(hint || error) && <div style={{
        fontSize: 12, color: error ? "#D32F2F" : "#717171", marginTop: 4
      }}>{error || hint}</div>}
    </div>
  );
}

function Select({ label, value, onChange, options, hint, optional }) {
  return (
    <div style={{ fontFamily: "Figtree" }}>
      {label && (
        <label style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          fontFamily: "Poppins", fontWeight: 600, fontSize: 13, color: "#252525", marginBottom: 6
        }}>
          <span>{label}</span>
          {optional && <span style={{ color: "#717171", fontWeight: 400, fontSize: 12 }}>Optional</span>}
        </label>
      )}
      <select value={value || ""} onChange={(e) => onChange && onChange(e.target.value)}
        style={{
          width: "100%", padding: "10px 12px", fontFamily: "Figtree", fontSize: 14,
          border: "1px solid #E0E0E0", borderRadius: 5, color: "#252525",
          background: "#fff", outline: "none", appearance: "menulist",
        }}>
        {options.map(o => typeof o === "string"
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>
        )}
      </select>
      {hint && <div style={{ fontSize: 12, color: "#717171", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function Toggle({ on, onChange, label, hint }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <span onClick={() => onChange && onChange(!on)} style={{
        width: 40, height: 22, borderRadius: 9999, background: on ? "#0A8193" : "#D3D3D3",
        position: "relative", transition: "background 200ms", cursor: "pointer", flexShrink: 0, marginTop: 2,
      }}>
        <span style={{
          position: "absolute", top: 3, left: on ? 21 : 3, width: 16, height: 16,
          borderRadius: "50%", background: "#fff", transition: "left 200ms",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }} />
      </span>
      {(label || hint) && <div style={{ fontSize: 14 }}>
        {label && <div style={{ fontFamily: "Poppins", fontWeight: 500, color: "#252525" }}>{label}</div>}
        {hint && <div style={{ fontSize: 13, color: "#717171", marginTop: 2 }}>{hint}</div>}
      </div>}
    </div>
  );
}

// ---------- Card ----------
function Card({ children, shadowed = false, style, padding = 20 }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 8,
      padding,
      border: shadowed ? "none" : "1px solid #E0E0E0",
      boxShadow: shadowed ? "0 1px 5px rgba(0,0,0,0.2)" : "none",
      ...style,
    }}>{children}</div>
  );
}

function CardHeader({ title, subtitle, action, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 14, gap: 12 }}>
      {icon && <div style={{
        width: 36, height: 36, borderRadius: 8, background: "#EBF7F7",
        display: "grid", placeItems: "center", flexShrink: 0,
      }}>
        <Icon name={icon} size={20} color="#096179" />
      </div>}
      <div style={{ flex: 1 }}>
        <h3 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 16, color: "#252525", margin: 0, lineHeight: 1.3 }}>{title}</h3>
        {subtitle && <div style={{ fontSize: 13, color: "#717171", marginTop: 2 }}>{subtitle}</div>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

// ---------- SideSheet ----------
function SideSheet({ open, onClose, title, subtitle, children, footer, width = 560 }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(38,50,56,0.48)", zIndex: 50,
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width, background: "#fff",
        display: "flex", flexDirection: "column", boxShadow: "0 12px 32px rgba(7,66,82,0.18)",
      }}>
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid #F1F1F1",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14,
        }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: "Poppins", fontWeight: 600, fontSize: 20, color: "#252525", lineHeight: 1.2 }}>{title}</h3>
            {subtitle && <div style={{ marginTop: 4, color: "#717171", fontSize: 13 }}>{subtitle}</div>}
          </div>
          <span onClick={onClose} style={{ cursor: "pointer", color: "#717171", lineHeight: 1, marginTop: 2 }}>
            <Icon name="close" size={22} />
          </span>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>{children}</div>
        {footer && <div style={{ padding: "16px 24px", borderTop: "1px solid #F1F1F1", display: "flex", gap: 10, alignItems: "center" }}>{footer}</div>}
      </div>
    </div>
  );
}

// ---------- Modal (centered) ----------
function Modal({ open, onClose, title, children, footer, width = 520 }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(38,50,56,0.48)", zIndex: 60,
      display: "grid", placeItems: "center",
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 14, width, maxWidth: "92vw",
        boxShadow: "0 12px 32px rgba(7,66,82,0.22)",
        display: "flex", flexDirection: "column", maxHeight: "90vh",
      }}>
        <div style={{ padding: "20px 24px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontFamily: "Poppins", fontWeight: 600, fontSize: 18, color: "#252525" }}>{title}</h3>
          <span onClick={onClose} style={{ cursor: "pointer", color: "#717171" }}><Icon name="close" size={22} /></span>
        </div>
        <div style={{ padding: "4px 24px 20px", overflow: "auto", fontSize: 14, lineHeight: 1.55, color: "#252525" }}>{children}</div>
        {footer && <div style={{ padding: "14px 24px", borderTop: "1px solid #F1F1F1", display: "flex", gap: 10, justifyContent: "flex-end" }}>{footer}</div>}
      </div>
    </div>
  );
}

// ---------- Misc ----------
function CopyMono({ text, label }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "5px 10px", background: "#F7F7F7", borderRadius: 5,
      fontFamily: "ui-monospace, Menlo, Consolas, monospace", fontSize: 12.5, color: "#252525",
      border: "1px solid #ECECEC", maxWidth: "100%",
    }}>
      {label && <span style={{ color: "#717171", fontFamily: "Figtree" }}>{label}</span>}
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text}</span>
      <span onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1100); }}
            style={{ cursor: "pointer", color: copied ? "#2E7D32" : "#717171", display: "inline-flex" }}>
        <Icon name={copied ? "check" : "content_copy"} size={14} />
      </span>
    </div>
  );
}

function ProgressBar({ value, max = 100, tone = "info", label, showLabel = true, height = 8 }) {
  const tones = { info: "#40A3BD", success: "#2E7D32", warning: "#F16624", error: "#D32F2F", neutral: "#717171" };
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      {(label || showLabel) && <div style={{
        display: "flex", justifyContent: "space-between",
        fontFamily: "Figtree", fontSize: 12.5, color: "#505050", marginBottom: 6,
      }}>
        <span>{label}</span>
        <span style={{ fontFamily: "Poppins", fontWeight: 600, color: "#252525" }}>{value} / {max}</span>
      </div>}
      <div style={{ background: "#F1F1F1", height, borderRadius: 9999, overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%", background: tones[tone],
          borderRadius: 9999, transition: "width 400ms cubic-bezier(0.2,0,0,1)",
        }} />
      </div>
    </div>
  );
}

function Spinner({ size = 16, color = "#40A3BD" }) {
  return (
    <span style={{
      display: "inline-block", width: size, height: size,
      border: `2px solid ${color}33`, borderTopColor: color, borderRadius: "50%",
      animation: "as-spin 700ms linear infinite",
    }} />
  );
}

// SectionHeader for in-page section dividers
function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 18, gap: 16 }}>
      <div>
        {eyebrow && <div style={{
          fontFamily: "Poppins", fontWeight: 600, fontSize: 12, textTransform: "uppercase",
          letterSpacing: "0.06em", color: "#096179", marginBottom: 8,
        }}>{eyebrow}</div>}
        <h1 style={{
          fontFamily: "Poppins", fontWeight: 600, fontSize: 26, color: "#252525",
          margin: 0, letterSpacing: "-0.01em",
        }}>{title}</h1>
        {subtitle && <p style={{ color: "#505050", fontSize: 14, margin: "6px 0 0", maxWidth: 720 }}>{subtitle}</p>}
      </div>
      {action && <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

// KPI card
function Kpi({ value, label, delta, tone, icon }) {
  const tones = {
    primary: "#074252", info: "#40A3BD", success: "#2E7D32", warning: "#CE4A0D", error: "#D32F2F",
  };
  return (
    <Card style={{ flex: 1, padding: "18px 20px", minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ color: "#505050", fontSize: 13, fontFamily: "Poppins", fontWeight: 500 }}>{label}</div>
        {icon && <div style={{
          width: 30, height: 30, borderRadius: 8, background: "#F7F7F7",
          display: "grid", placeItems: "center",
        }}>
          <Icon name={icon} size={18} color={tones[tone] || "#096179"} />
        </div>}
      </div>
      <div style={{
        fontFamily: "Poppins", fontWeight: 700, fontSize: 30,
        color: tones[tone] || "#074252", lineHeight: 1.1, marginTop: 8,
      }}>{value}</div>
      {delta && <div style={{ fontSize: 12.5, color: "#505050", marginTop: 6 }}>{delta}</div>}
    </Card>
  );
}

Object.assign(window, {
  Button, Icon, Chip, StatusChip, Avatar, Alert, Input, Select, Toggle,
  Card, CardHeader, SideSheet, Modal, CopyMono, ProgressBar, Spinner,
  SectionHeader, Kpi,
});
